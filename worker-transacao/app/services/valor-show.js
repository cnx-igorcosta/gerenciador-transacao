import config from 'config'
import { httpPost } from './http'
import { enviarParaFila } from '../queue/sender'
import transacaoDb from '../db/transacao'
import * as estados from '../domain/estados'
import * as passos from '../domain/passos'

// URI de POST da API FIGHTERS
const uri = config.URI_API_FIGHTERS
// Próximo passo da transacao
const proximo_passo = passos.FINALIZACAO

const gravarValorShow = transacao => {
    return new Promise((resolve, reject) => {
        // Verifica se transacao está no passo 'valor_show' e transacao está com estado 'in_process'
        if(transacao.passo_atual === passos.VALOR_SHOW && transacao.estado === estados.IN_PROCESS) {
            // Clona transacao para não alterar o original
            const clone_transacao = JSON.parse(JSON.stringify(transacao))
            // Cria VALOR POR SHOW com informações da transação
            const valorPorShow = {
                id_show: clone_transacao.id_show,
                valor: clone_transacao.valor
            }
            // POST VALOR POR SHOW na API FIGHTERS
            httpPost(uri, valorPorShow)
                .then(response => {
                    // Passa transacao para próximo passo
                    clone_transacao.passo_atual = proximo_passo
                    clone_transacao.passo_estado = estados.IN_PROCESS
                    // Zera a quantidade de tentativas para pŕoximo passo
                    clone_transacao.qtd_retentativas = 0
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

export { gravarValorShow }