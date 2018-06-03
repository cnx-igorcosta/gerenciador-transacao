import transacaoDb from '../db/transacao'
import * as estados from '../domain/estados'
import * as passos from '../domain/passos'

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

export { finalizarTransacao }