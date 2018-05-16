import Transacao from '../models/transacao'

const transacaoDb = {}

transacaoDb.buscarPorIdTransacao = (id_transacao) => {
    return new Promise((resolve, reject) => {
        const query = Transacao.findById(id_transacao)
        query.exec((err, transao) => {
            if(err) reject(err)
            resolve(transao)
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

transacaoDb.atualizarEstado = (estado, id_transacao) => {
    return new Promise((resolve, reject) => {
        Transacao.findOneAndUpdate({ _id: id_transacao }, { $set:{ estado: estado } }, { new: true }, 
                (err, transacao) => {
                    if(err) reject(err)
                    resolve(transacao)
                })
    })  
}

export default transacaoDb