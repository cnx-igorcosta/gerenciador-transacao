import request from 'request-promise-native'

import validar from '../validation/compra-ingresso'
import transacaoDb from '../db/transacao'
import queueSender from '../queue'
import * as estados from '../estados'

//GET at /api/v1/transacao
const getTransacao = (req, res) => {
    const id_transacao = req.query.id_transacao
    transacaoDb.buscarPorIdTransacao(id_transacao)
        .then(transacao => res.status(200).json({ transacao }))
        .catch(err => res.status(400).json(err))
}

// POST at /api/v1/transacao
const postTransacao = (req, res) => {
    const compraIngresso = req.body 
    // TODO: validar se combinação ingresso/show já foi gravada anteriormente
    Promise.resolve(validar(compraIngresso))
        // Salva uma nova transação com estado 'pending'
        .then(pedido => salvarTransacao(pedido))
        // Atualiza estado da transacao para 'in_process'
        .then(transacao => transacaoDb.atualizarEstado(estados.IN_PROCESS, transacao._id))
        // Envia informações de ingresso por show para gravar na API FOO
        .then(transacao => gravarIngressoPorShow(transacao))
        // Envia informações de valor por show para gravar na API FIGHTERS
        .then(transacao => gravarValorPorShow(transacao))
        // Atualiza estado da transacao para 'success'
        .then(transacao => transacaoDb.atualizarEstado(estados.SUCCESS, transacao._id))
        // Retorna status 204 com os dados da transação criada
        .then(transacao => res.status(200).json({ transacao }))
        // Trata erro colocando na fila para tentativa de processamento posterior
        .catch(err => handleError(err, res))
}

const salvarTransacao = (compraIngresso) => {
    if(compraIngresso.id_transacao) {
        // Já foi salvo anteriormente e está reprocessando
        return Promise.resolve(compraIngresso)
    } else {
        // Copia tudo de compra
        const transacao = Object.assign(compraIngresso)
        transacao.estado = estados.PENDING
        return Promise.resolve(transacaoDb.salvar(transacao))
    }
}

const gravarIngressoPorShow = transacao => {
    const uri = 'http://api-foo:3000/api/v1/tickets'
    const ingressoPorShow = {
        id_ingresso: transacao.id_ingresso,
        id_show: transacao.id_show,
    }
    
    return new Promise((resolve, reject) => {
        postToApi(uri, ingressoPorShow)
        .then(response => {
            if(response.statusCode !== 200) 
            reject(new Error('Não foi possível se comunicar com a API FOO.'))
            resolve(transacao)
        })
        .catch(err => reject(err))
    })
}

const gravarValorPorShow = transacao => {
    const uri = 'http://api-fighters:4000/api/v1/valores'
    const valorPorShow = {
        id_show: transacao.id_show,
        valor: transacao.valor
    }
    return new Promise((resolve, reject) => {
        postToApi(uri, valorPorShow)
            .then(response => {
                if(response.statusCode !== 200) 
                    reject(new Error('Não foi possível se comunicar com a API FIGHTERS.'))
                resolve(transacao)
            })
            .catch(err => reject(err))
    })
}

const postToApi = (uri, requestBody) => {
    const options = {
        method: 'POST',
        uri,
        body: { requestBody },
        resolveWithFullResponse: true,
        json: true
    }
    return request(options)
}

const handleError = (err, res) => {
    // TODO: Em caso de erro, enviar para fila para reprocessamento
    if(process.env.NODE_ENV !== 'test'){
        console.log('Erro: ', err)
    }
    res.status(400).json(err)
}

export { postTransacao, getTransacao }