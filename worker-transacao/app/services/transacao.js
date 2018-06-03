import { enviarParaFila } from '../queue/sender'
import transacaoDb from '../db/transacao'
import * as estados from '../domain/estados'
import * as passos from '../domain/passos'
import { gravarIngressoShow } from './ingresso-show'
import { gravarValorShow } from './valor-show'

// Primeiro passo, verifica se é a primeira tentativa de execução da transação
const iniciarTransacao = transacao => {
    const proximo_passo = passos.INGRESSO_SHOW 
    return new Promise((resolve, reject) => {
        // Se transação está com estado 'pending' é uma transação nova
        if(transacao.estado === estados.PENDING) {
            // Clona transacao para não alterar o original
            const clone_transacao = JSON.parse(JSON.stringify(transacao))
            // Altera estado da transação para 'in_process'
            clone_transacao.estado = estados.IN_PROCESS
            // Cria registros iniciais dos passos da transacao
            clone_transacao.passo_atual = proximo_passo
            clone_transacao.passo_estado = estados.IN_PROCESS
            clone_transacao.qtd_retentativas = 0
            // Atualiza transação com novas informações
            transacaoDb.atualizar(clone_transacao)
                // Coloca na fila para execução do próximo passo.
                .then(transacao => enviarParaFila(transacao))
                .then(transacao => resolve(transacao))
                .catch(err => reject(err))
        } else {
            // Não é nova transação, passa para o próximo passo
            resolve(transacao)
        }
    })
}

// Último passo, finaliza a transacao com sucesso
const finalizarTransacao = transacao => {
    return new Promise((resolve, reject) => {
        // Verifica se transacao está no passo 'finalizacao' e transacao está com estado 'in_process'
        if(transacao.passo_atual === passos.FINALIZACAO && transacao.estado === estados.IN_PROCESS) {
            // Clona transacao para não alterar o original
            const clone_transacao = JSON.parse(JSON.stringify(transacao))
            // Altera passo atual para finalização com sucesso
            clone_transacao.passo_estado = estados.SUCCESS
            // Transacao concluida com sucesso
            clone_transacao.estado = estados.SUCCESS
            // Atualiza transação com novas informações
            transacaoDb.atualizar(clone_transacao)
                .then(transacao => resolve(transacao))
                .catch(err => reject(err))
        } else {
        // Não é finalizacao, passa para o próximo passo
        resolve(transacao)
        }
    })
}

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
                //TODO: ROLLBACK
            } else {
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

export { transacaoService, iniciarTransacao, finalizarTransacao }
