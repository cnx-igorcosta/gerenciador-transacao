import send from './sender'

// Queues
const TRANSACAO_QUEUE = 'TRANSACAO_QUEUE'
const INGRESSO_SHOW_QUEUE = 'INGRESSO_SHOW_QUEUE'
const VALOR_SHOW_QUEUE = 'VALOR_SHOW_QUEUE'

const sendToTransacao = (transacao) => {
    const msg = JSON.stringify(transacao)
    return Promise.resolve(send(msg, TRANSACAO_QUEUE))
}

const sendToIngressoShow = (ingressoShow) => {
    const transacaoIngressoShow = {
        ingressoShow,
        qtd_tentativas: 0
    }
    const msg = JSON.stringify(transacaoIngressoShow)
    return Promise.resolve(send(msg, INGRESSO_SHOW_QUEUE))
}

const sendToValorShow = (valorShow) => {
    const msg = JSON.stringify(valorShow)
    return Promise.resolve(send(msg, VALOR_SHOW_QUEUE))
}

// Objeto de envio de mensagens para queues
const queueSender = {
    send:(pedido) => {
        return new Promise((resolve, reject) => {
            try {
                //sendToTransacao(pedido.transacao)
                sendToIngressoShow(pedido.ingressoShow)
                resolve(pedido)
            } catch(err) {
                reject(err)
            }
        })
    }
}

export default queueSender
