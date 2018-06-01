import { httpPost } from './http'
import transacaoQueue from '../queue/sender'
import transacaoDb from '../db/transacao'
import * as estados from '../domain/estados'
import * as passos from '../domain/passos'

// URI DE POST DA API FIGHTERS
const uri = 'http://api-fighters:4000/api/v1/valores'
// Próximo passo da transacao
const proximo_passo = passos.FINALIZACAO

const gravarValorShow = transacao => {
    return new Promise((resolve, reject) => {
        // Verifica se transacao está no passo 'valor_show' e transacao está com estado 'in_process'
        if(transacao.passo_atual === passos.VALOR_SHOW && transacao.estado === estados.IN_PROCESS) {
            // Aumenta o contador de tentativas da transacao se for reprocessamento
            if(transacao.passo_estado === estados.FAIL) {
                transacao.qtd_tentativas++
            }
            // Cria VALOR POR SHOW com informações da transação
            const valorPorShow = {
                id_show: transacao.id_show,
                valor: transacao.valor
            }
            // POST INGRESSO POR SHOW na API FIGHTERS
            httpPost(uri, valorPorShow)
                .then(response => {
                    // Altera próximo passo da transacao
                    transacao.passo_atual = proximo_passo
                    transacao.passo_estado = estados.IN_PROCESS
                    // Zera a quantidade de tentativas para pŕoximo passo
                    transacao.qtd_tentativas = 0
                    return transacao
                })
                // Salva novas informações na base
                .then(transacao => transacaoDb.atualizar(transacao))
                // Coloca na fila para execução do próximo passo.
                .then(transacao => { transacaoQueue.send(transacao._id); resolve(transacao) })
                .catch(err => reject(err))
        } else {
            // Transacao já passou pelo passo gravar VALOR POR SHOW
            resolve(transacao)
        }
    })
}

export { gravarValorShow }