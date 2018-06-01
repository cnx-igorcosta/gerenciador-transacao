import { httpPost } from './http'
import transacaoQueue from '../queue/sender'
import transacaoDb from '../db/transacao'
import * as estados from '../domain/estados'
import * as passos from '../domain/passos'

// URI DE POST DA API FOO
const uri = 'http://api-foo:3000/api/v1/tickets'
// Próximo passo da transacao
const proximo_passo = passos.VALOR_SHOW

const gravarIngressoShow = transacao => {
    return new Promise((resolve, reject) => {
        // Verifica se transacao está no passo 'ingresso_show' e transacao está com estado 'in_process'
        if(transacao.passo_atual === passos.INGRESSO_SHOW && transacao.estado === estados.IN_PROCESS) {
            // Clona transacao para não alterar o original
            const clone_transacao = JSON.parse(JSON.stringify(transacao))
            // Aumenta o contador de tentativas da transacao se for reprocessamento
            if(clone_transacao.passo_estado === estados.FAIL) {
                clone_transacao.qtd_tentativas++
                transacaoDb.atualizar(clone_transacao)
            }
            // Cria INGRESSO POR SHOW com informações da transação
            const ingressoPorShow = {
                id_ingresso: clone_transacao.id_ingresso,
                id_show: clone_transacao.id_show,
            }
            // POST INGRESSO POR SHOW na API FOO
            httpPost(uri, ingressoPorShow)
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
            // Transacao já passou pelo passo gravar INGRESSO POR SHOW
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

export { gravarIngressoShow  }