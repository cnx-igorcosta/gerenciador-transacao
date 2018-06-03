import { enviarParaFila } from '../queue/sender'
import transacaoDb from '../db/transacao'
import * as estados from '../domain/estados'
import * as passos from '../domain/passos'

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

export { iniciarTransacao }