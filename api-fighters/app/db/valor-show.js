import ValorPorShow from '../models/valor-show'

const valorPorShowDb = {}

valorPorShowDb.listarPorShow = id_show => {
    return new Promise((resolve, reject) => {
        const query = ValorPorShow.find({ id_show: id_show })
        query.exec((err, valores) => {
            if(err) reject(err)
            resolve(valores)
        })
    })
}

valorPorShowDb.salvar = transacao => {
    return new Promise((resolve, reject) => {
        const newValorPorShow = new ValorPorShow(transacao)
        newValorPorShow.save((err, valorPorShow) => {
            if(err) reject(err)
            resolve(valorPorShow)
        })
    })
}

export default valorPorShowDb