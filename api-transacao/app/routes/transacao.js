import validar from '../validation/compra-ingresso'
import transacaoDb from '../db/transacao'
import transacaoQueue from '../queue/sender'

//GET at /api/v1/transacao
const getTransacao = (req, res) => {
    const id_transacao = req.query.id_transacao
    Promise.resolve(id_transacao)
        .then(id_transacao => transacaoDb.buscarPorIdTransacao(id_transacao))
        .then(transacao => res.status(200).json({ transacao }))
        .catch(err => res.status(400).json(err))
}

// POST at /api/v1/transacao
const postTransacao = (req, res) => {
    const compraIngresso = req.body
    Promise.resolve(compraIngresso)
        // Valida obrigatoriedade.
        .then(compraIngresso => validar(compraIngresso))
        // Salva uma nova transação com estado 'pending'.
        .then(compraIngresso => salvarTransacao(compraIngresso))
        // Coloca na fila para execução de cada passo da transação assíncronamente.
        .then(transacao => enviarParaFila(transacao))
        // Retorna status 202 com os dados da transação criada.
        // 202 significa que foi aceito pelo servidor e ainda está processando.
        .then(transacao => res.status(202).json({ transacao }))
        // Trata erro retornando mensagem e status.
        .catch(err => handleError(err, res))
}

// Cria novo registro de transacao na base
const salvarTransacao = compraIngresso => {
    return new Promise((resolve, reject) => {
        // Copia tudo de compra ingresso
        const transacao = Object.assign(compraIngresso)
        // Inicia com estado 'pending'
        transacao.estado = 'pending'
        // cria nova transação na base e retorna id da transação
        transacaoDb.salvar(transacao)
            .then(transacao => resolve(transacao))
            .catch(err => reject(err))
    })
}

const enviarParaFila = transacao => {
    return new Promise((resolve, reject) => {
        try {
            const msg = JSON.stringify(transacao._id)
            transacaoQueue.send(msg)
            resolve(transacao)
        } catch(err) {
            reject(err)
        }

    })
}

const handleError = (err, res) => {
    // Em caso de teste não imprime erro no console
    if(process.env.NODE_ENV !== 'test') {
        console.log('Erro: ', err)
    }
    res.status(400).json({ error: err.message })
}

export { postTransacao, getTransacao }