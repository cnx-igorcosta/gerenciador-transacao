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
            // Clona transacao para não alterar o original
            const clone_transacao = JSON.parse(JSON.stringify(transacao))
            // Aumenta o contador de tentativas da transacao se for reprocessamento
            if(clone_transacao.passo_estado === estados.FAIL) {
                clone_transacao.qtd_tentativas++
                clone_transacao.atualizar(transacao)
            }
            // Cria VALOR POR SHOW com informações da transação
            const valorPorShow = {
                id_show: clone_transacao.id_show,
                valor: clone_transacao.valor
            }
            // POST INGRESSO POR SHOW na API FIGHTERS
            httpPost(uri, valorPorShow)
                .then(response => {
                    // Altera próximo passo da transacao
                    clone_transacao.passo_atual = proximo_passo
                    clone_transacao.passo_estado = estados.IN_PROCESS
                    // Zera a quantidade de tentativas para pŕoximo passo
                    clone_transacao.qtd_tentativas = 0
                    return clone_transacao
                })
                // Salva novas informações na base
                .then(clone_transacao => transacaoDb.atualizar(clone_transacao))
                // Coloca na fila para execução do próximo passo.
                .then(transacao => enviarParaFila(transacao))
                .then(transacao => resolve(transacao))
                .catch(err => reject(err))
        } else {
            // Transacao já passou pelo passo gravar VALOR POR SHOW
            resolve(transacao)
        }
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

export { gravarValorShow }