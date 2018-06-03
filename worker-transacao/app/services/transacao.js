import transacaoDb from '../db/transacao'
import { enviarParaFila } from '../queue/sender'
import { iniciarTransacao } from './passo-inicial'
import { finalizarTransacao } from './passo-final'
import { gravarIngressoShow } from './ingresso-show'
import { gravarValorShow } from './valor-show'
import * as estados from '../domain/estados'
import * as passos from '../domain/passos'

// Em caso de falha em algum passo, a transação é colocada na fila
// para reexecução posterior. Cada passo tem um limite de 5 reprocessamentos,
// após ultrapassar o limite a transação é dada como falha.
// Quando a transação falha, é possível saber em que passo ela estava 
// quando falhou, mensagem de erro, quantidade de retentativas 
// e o estado dela ao consultar transação através da api-transacao
const handleError = (err, id_transacao) => {
    // Em caso de teste não imprime erro no console
    if(process.env.NODE_ENV !== 'test') {
        console.log('Erro: ', err)
    }
    transacaoDb.buscarPorIdTransacao(id_transacao)
        .then(transacao => {
            // Se tiver expirado o limite de tentativas
            // a transação é dada como falha
            if(transacao.qtd_retentativas >= 5) {
                transacao.estado = estados.FAIL
                transacao.mensagem = err.message
                transacaoDb.atualizar(transacao)
            } else {
                // Altera o estado do passo em que a transação
                // está para fail, e coloca na fila para reexecução
                transacao.passo_estado = estados.FAIL
                transacaoDb.atualizar(transacao)
                    .then(enviarParaFila(transacao))
                    .catch(err => console.log(`Erro ao tentar tratar falha de transacao. Erro: ${err}`))
            }
            return
        }).catch(err => console.log(`Erro ao tentar tratar falha de transacao. Erro: ${err}`))
}

// A execução da transação de compra de ingressos se dá verificando em 
// que passo a transação está, executando e colocando na fila novamente
// para execução do próximo passo. 
const transacaoService = {
    executar: id_transacao => {
        transacaoDb.buscarPorIdTransacao(id_transacao)
        .then(transacao => {
            // Aumenta o contador de tentativas da transacao se for reprocessamento
            if(transacao.passo_estado === estados.FAIL) {
                transacao.qtd_retentativas++
                transacaoDb.atualizar(transacao)
            }
            // Cada passo verifica a condição da transacao para execução.
            // Após execução do passo, altera a transacao para ser verificada
            // e executada pelo próximo passo até completar todos os passos.
            return Promise.all(
                    [
                        iniciarTransacao(transacao),
                        gravarIngressoShow(transacao),
                        gravarValorShow(transacao),
                        finalizarTransacao(transacao)
                    ])
                    .catch(err => handleError(err, id_transacao))
            })
    } 
} 

export { transacaoService }
