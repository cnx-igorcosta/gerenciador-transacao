import request from 'request-promise-native'

import validar from '../validation/compra-ingresso'
import transacaoDb from '../db/transacao'
import queueSender from '../queue'
import * as estados from '../estados'


// POST at /transacao
const postTransacao = (req, res) => {
    const compraIngresso = req.body 
    Promise.resolve(validar(compraIngresso))
        .then(pedido => salvarTransacao(pedido))
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
        const transacao = {
            data_compra: compraIngresso.data_compra,
            account_id: compraIngresso.account_id,
            estado: estados.PENDING
        }
        return Promise.resolve(transacaoDb.salvar(transacao))
            .then(transacao => {
                compraIngresso.id_transacao = transacao._id
                return transacao 
            })
    }
}

const gravarIngressoPorShow = compraIngresso => {
    // verifica se já foi gravado antes de tentar gravar novamente
    const ingressoPorShow = {
        id_ingresso: compraIngresso.id_ingresso,
        id_show: compraIngresso.id_show,
    }
    const options = {
        method: 'POST',
        uri: 'http:api_foo/test',
        body: ingressoPorShow
    }
    return request(options)
        //TODO: Alterar estado para in_process
        .then(response => console.log('RETORNO DA API_FOO', response.statusCode))
        .then(() =>  compraIngresso)
        .catch(err => handleError(err))
}

const gravarValorPorShow = ingressoShow => {
    // verifica se já foi gravado antes de tentar gravar novamente
    const valorPorShow = {
        id_show: compraIngresso.id_show,
        valor: compraIngresso.valor,
    }
    //TODO: Enviar para 
    return Promise.resolve(ingressoShow)
}

const handleError = (err, res) => {
    // TODO: Em caso de erro, enviar para fila para reprocessamento
    if(process.env.NODE_ENV !== 'test'){
        console.log(err)
    }
    res.status(400).json(err)
}

export { postTransacao }