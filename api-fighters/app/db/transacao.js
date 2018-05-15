import Transacao from '../models/transacao'

const transacaoDb = {}

transacaoDb.listar = () => {
    return new Promise((resolve, reject) => {
        const query = Transacao.find({})
        query.exec((err, transacoes) => {
            if(err) reject(err)
            resolve(transacoes)
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