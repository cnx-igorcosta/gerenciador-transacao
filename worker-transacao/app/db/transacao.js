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

transacaoDb.atualizar = transacao => {
    const _id = transacao._id
    const update = {
        estado: transacao.estado,
        passo_atual: transacao.passo_atual,
        passo_estado: transacao.passo_estado,
        qtd_tentativas: transacao.qtd_tentativas,
        mensagem: transacao.mensagem
    }
    return new Promise((resolve, reject) => {
        Transacao.findOneAndUpdate({ _id }, { $set: update }, { new: true }, 
                (err, transacao) => {
                    if(err) reject(err)
                    resolve(transacao)
                })
    })  
}

export default transacaoDb