import request from 'request-promise-native'

import validar from '../validation/compra-ingresso'
import transacaoDb from '../db/transacao'
import queueSender from '../queue'
import * as estados from '../estados'


// POST at /transacao
const postTransacao = (req, res) => {
    const compraIngresso = req.body 
    // TODO: validar se combinação ingresso/show já foi gravada anteriormente
    Promise.resolve(validar(compraIngresso))
        .then(pedido => salvarTransacao(pedido))
        //TODO: ALTERA ESTADO PARA IN PROCESS
        .then(compraIngresso => gravarIngressoPorShow(compraIngresso))
        .then(compraIngresso => gravarValorPorShow(compraIngresso))
        //TODO: ALTERA ESTADO PARA SUCCESS
        .then(compraIngresso => res.status(200).json(compraIngresso))
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
            .then(transacao => {
                compraIngresso.id_transacao = transacao._id
                return transacao 
            })
    }
}

const gravarIngressoPorShow = compraIngresso => {
    const uri = 'http://api-foo:3000/api/v1/tickets'
    const ingressoPorShow = {
        id_ingresso: compraIngresso.id_ingresso,
        id_show: compraIngresso.id_show,
    }
    return new Promise((resolve, reject) => {
        postToApi(uri, ingressoPorShow)
            .then(response => {
                if(response.statusCode !== 204) 
                    reject(new Error('Não foi possível se comunicar com a API FOO.'))
                resolve(compraIngresso)
            })
            .catch(err => reject(err))
    })
}

const gravarValorPorShow = compraIngresso => {
    const uri = 'http://api-fighters:4000/api/v1/valores'
    const valorPorShow = {
        id_show: compraIngresso.id_show,
        valor: compraIngresso.valor
    }
    return new Promise((resolve, reject) => {
        postToApi(uri, valorPorShow)
            .then(response => {
                if(response.statusCode !== 204) 
                    reject(new Error('Não foi possível se comunicar com a API FIGHTERS.'))
                resolve(compraIngresso)
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

export { postTransacao }