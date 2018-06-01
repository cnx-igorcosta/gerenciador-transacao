import transacaoQueue from '../queue/sender'
import transacaoDb from '../db/transacao'
import * as estados from '../domain/estados'
import * as passos from '../domain/passos'
import { gravarIngressoShow } from './ingresso-show'
import { gravarValorShow } from './valor-show'

// Verifica se é a primeira tentativa de execução da transação
const iniciarTransacao = transacao => {
    return new Promise((resolve, reject) => {
        // Se transação está com estado 'pending' é uma transação nova
        if(transacao.estado === estados.PENDING) {
            // Altera estado da transação para 'in_process'
            transacao.estado = estados.IN_PROCESS
            // Cria registros iniciais dos passos da transacao
            transacao.passo_atual = passos.INGRESSO_SHOW 
            transacao.passo_estado = estados.IN_PROCESS
            transacao.qtd_tentativas = 0
            // Atualiza transação com novas informações
            transacaoDb.atualizar(transacao)
                // Coloca na fila para execução do próximo passo.
                .then(transacao => { transacaoQueue.send(transacao._id); resolve(transacao) })
                .catch(err => reject(err))
        } else {
            // Não é nova transação, passa para o próximo passo
            resolve(transacao)
        }
    })
}

// Finalização da transacao se não houve falha
const finalizarTransacao = transacao => {
    return new Promise((resolve, reject) => {
        // Verifica se transacao está no passo 'finalizacao' e transacao está com estado 'in_process'
        if(transacao.passo_atual === passos.FINALIZACAO && transacao.estado === estados.IN_PROCESS) {
            // Altera passo atual para finalização com sucesso
            transacao.passo_estado = estados.SUCCESS
            // Transacao concluida com sucesso
            transacao.estado = estados.SUCCESS
            // Atualiza transação com novas informações
            transacaoDb.atualizar(transacao)
                .then(transacao => resolve(transacao))
                .catch(err => reject(err))
        } else {
        // Não é finalizacao, passa para o próximo passo
        resolve(transacao)
        }
    })
    
}

// Cada passo verifica a condição da transacao para execução,
// também sabe qual o próximo passo.
const passosTransacao = [
    iniciarTransacao,
    gravarIngressoShow,
    gravarValorShow,
    finalizarTransacao
]

// Em caso de falha em algum passo, a transação é colocada na fila
// para reexecução posterior. Cada passo tem um limite de 5 reprocessamentos,
// após ultrapassar o limite a transação é dada como falha.
const handleError = (err, id_transacao) => {
    // Em caso de teste não imprime erro no console
    if(process.env.NODE_ENV !== 'test') {
        console.log('Erro: ', err)
    }
    transacaoDb.buscarPorIdTransacao(id_transacao)
        .then(transacao => {
            // Se tiver expirado o limite de tentativas
            // a transação é dada como falha
            if(transacao.qtd_tentativas >= 5) {
                transacao.estado = estados.FAIL
                transacao.mensagem = err.message
                transacaoDb.atualizar(transacao)
            } else {
                transacaoQueue.send(id_transacao)
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
                return Promise.all(passosTransacao)
                            .catch(err => handleError(err, id_transacao))
            })
    } 
} 

export { transacaoService }
