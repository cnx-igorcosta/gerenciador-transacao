import Transacao from '../models/transacao'

const transacaoDb = {}

transacaoDb.buscarPorIdTransacao = (id_transacao) => {
    return new Promise((resolve, reject) => {
        const query = Transacao.findById(id_transacao)
        query.exec((err, transacao) => {
            if(err) reject(err)
            resolve(transacao)
        })
    })
}

transacaoDb.salvar = transacao => {
    return new Promise((resolve, reject) => {
        const newTransacao = new Transacao(transacao)
        newTransacao.save((err, transacao) => {
            if(err) reject(err)
            resolve(transacao)
        })
    })
}

export default transacaoDb