import IngressoPorShow from '../models/ingresso-show'

const ingressoPorShowDb = {}

ingressoPorShowDb.listarPorShow = (id_show) => {
    return new Promise((resolve, reject) => {
        const query = IngressoPorShow.find({id_show})
        query.exec((err, ingressoPorShow) => {
            if(err) reject(err)
            resolve(ingressoPorShow)
        })
    })
}

ingressoPorShowDb.buscarPorIngressoEShow = (id_ingresso, id_show) => {
    return new Promise((resolve, reject) => {
        const query = IngressoPorShow.findOne({id_ingresso: id_ingresso, id_show: id_show})
        query.exec((err, ingressoPorShow) => {
            if(err) reject(err)
            resolve(ingressoPorShow)
        })
    })
}

ingressoPorShowDb.salvar = ingressoPorShow => {
    return new Promise((resolve, reject) => {
        const newIngressoPorShow = new IngressoPorShow(ingressoPorShow)
        newIngressoPorShow.save((err, ingressos) => {
            if(err) reject(err)
            resolve(ingressos)
        })
    })
}

export default ingressoPorShowDb