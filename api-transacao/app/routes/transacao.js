import validar from '../validation/compra-ingresso'
import transacaoDb from '../db/transacao'
import { validarDuplicidadeIngresso, gravarIngressoPorShow } from '../services/ingresso-show'
import { gravarValorPorShow } from '../services/valor-show'
import transacaoQueue from '../queue/sender'
import * as estados from '../estados'

//GET at /api/v1/transacao
const getTransacao = (req, res) => {
    const id_transacao = req.query.id_transacao
    transacaoDb.buscarPorIdTransacao(id_transacao)
        .then(transacao => res.status(200).json({ transacao }))
        .catch(err => res.status(400).json(err))
}

// POST at /api/v1/transacao
const postTransacao = (req, res) => {
    const compraIngresso = req.body
    // Zera contador de reenvio
    compraIngresso.qtdReenvio = 0
    executarFluxoTransacao(res, compraIngresso)
}

const executarFluxoTransacao = (res, compraIngresso) => {
    const context = { compraIngresso }
    Promise.resolve(context)
        // Valida obrigatoriedade
        .then(context => validar(context))
        // Valida se combinação de id_ingresso e id_show já existe na api foo
        .then(context => validarDuplicidadeIngresso(context))
        // Salva uma nova transação com estado 'pending'
        .then(context => salvarTransacao(context))
        // Atualiza estado da transacao para 'in_process'
        .then(context => transacaoDb.atualizarEstado(estados.IN_PROCESS, context))
        // Envia informações de ingresso por show para gravar na API FOO
        .then(context => gravarIngressoPorShow(context))
        // Envia informações de valor por show para gravar na API FIGHTERS
        .then(context => gravarValorPorShow(context))
        // Atualiza estado da transacao para 'success'
        .then(context => transacaoDb.atualizarEstado(estados.SUCCESS, context))
        // Retorna status 200 com os dados da transação criada
        .then(context => res.status(200).json({ transacao: context.compraIngresso }))
        // Trata erro colocando na fila para tentativa de processamento posterior
        .catch(err => handleError(err, res, context))
}

const salvarTransacao = (context) => {
    const compraIngresso = context.compraIngresso

    if(compraIngresso.id_transacao) {
        // Já foi salvo anteriormente e está reprocessando
        return Promise.resolve(context)
    } else {
        // Copia tudo de compra ingresso
        const transacao = Object.assign(compraIngresso)
        // Inicia com estado 'pending'
        transacao.estado = estados.PENDING
        return new Promise((resolve, reject) => {
            transacaoDb.salvar(transacao)
                .then(transacao => {
                    context.compraIngresso.id_transacao = transacao._id
                    resolve(context)
                })
                .catch(err => reject(err))
        })
    }
}

const handleError = (err, res, context) => {
    // Em caso de teste não imprime erro no console
    if(process.env.NODE_ENV !== 'test') {
        console.log('Erro: ', err)
    }
    // Cuida do response da chamada
    const colocarNaFila = handleResponse(res, context.compraIngresso.id_transacao, err)
    if(colocarNaFila) {
      // Cuida de recolocar na fila para reprocessamento
      handleReenvioFila(context, err)
    }
}

const handleReenvioFila = (context, err) => {
    const compraIngresso = context.compraIngresso
    // Tenta reenviar para processamento até 5x, passando disso não coloca na fila novamente.
    // salva transação com estado 'fail'
    if(compraIngresso.qtdReenvio < 1) {
        console.log(`A Transacao ${compraIngresso.id_transacao} não foi executada com sucesso, será colocada na fila para reprocessamento.`)
        // Envia para fila para reprocessamento posterior
        compraIngresso.qtdReenvio ++
        const msg = JSON.stringify(compraIngresso)
        setTimeout(() => transacaoQueue.send(msg), 5000)

    } else {
        console.log(`A Transacao ${compraIngresso.id_transacao} excedeu o limite de tentativas de reprocessamento.`)
        if(compraIngresso.id_transacao) {
            // Altera estado para 'fail'
            transacaoDb.atualizarEstadoErro(compraIngresso.id_transacao, estados.FAIL, err.message)
        }
    }
}

const handleResponse = (res, id_transacao, err) => {
  let colocarNaFila = true
  // Se tiver dentro de um fluxo de request, informa que está processando
  if(res) {
    // Trata quando for erro de validação
    if(err.validation_error) {
      res.status(400).json({ errors: err.errors })
      colocarNaFila = false
      // Se transacao foi criada antes de dar erro devolve para o client o id_transacao para consulta posterior
    } else if(id_transacao) {
      // 202 significa que foi aceito pelo servidor e ainda está processando
      // Devolve o id_transacao gerado
      res.status(202).json({ id_transacao })
    } else {
      // Não foi possível gerar id_transacao mas ainda pode reprocessar as informações
      res.status(202).json({ mensagem: 'Não foi possível gerar id_transacao', motivoFalha: err.message})
    }
  }
  return colocarNaFila
}
export { postTransacao, getTransacao, executarFluxoTransacao }
