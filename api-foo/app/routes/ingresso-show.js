import validar from '../validation/ingresso-show'
import ingressoPorShowDb from '../db/ingresso-show'

//GET /api/v1/tickets
const getTotalIngressoPorShow = (req, res) => {
    const id_show = req.query.id_show
    Promise.resolve(ingressoPorShowDb.listarPorShow(id_show))
        .then(ingressos => res.status(200).json({ total: ingressos.length }))
        .catch(err => handleError(err, res))
}

//GET /api/v1/tickets/validate
const getIngressoShowValido = (req, res) => {
    const query = req.query
    const ingressoPorShow = {
        id_ingresso: query.id_ingresso,
        id_show: query.id_show
    }
    Promise.resolve(validar(ingressoPorShow))
        .then(ingressoPorShow => ingressoPorShowDb.buscarPorIngressoEShow(ingressoPorShow.id_ingresso, ingressoPorShow.id_show))
        .then(ingressoPorShow => res.status(200).json({ valid: (ingressoPorShow != null) }))
        .catch(err => handleError(err, res))
}

//POST /api/v1/tickets
const postIngressoPorShow = (req, res) => {
    const ingressoPorShow = req.body
    Promise.resolve(validar(ingressoPorShow))
        .then(ingressoPorShow => verificarDuplicidade(ingressoPorShow))
        .then(ingressoPorShow => ingressoPorShowDb.salvar(ingressoPorShow))
        .then(ingressoPorShow => res.status(200).json(ingressoPorShow))
        .catch(err => handleError(err, res))
}

const verificarDuplicidade = ingressoPorShow => {
    const id_ingresso = ingressoPorShow.id_ingresso
    const id_show = ingressoPorShow.id_show
    return new Promise((resolve, reject) => {
        try{
            ingressoPorShowDb.buscarPorIngressoEShow(id_ingresso, id_show)
                .then(ingressos => {
                    if(ingressos.length) reject(new Error('Ingresso por Show duplicado!'))
                    else resolve(ingressoPorShow)
                })
            } catch(err) {
                reject(err)
            }
        })
}


const handleError = (err, res) => {
    if(process.env.NODE_ENV !== 'test'){
        console.log('Erro: ', err)
    }
    if(err.errors)
        res.status(400).json(err)
    else 
        res.status(400).json({ erro: err.message })
}

export { postIngressoPorShow, getTotalIngressoPorShow, getIngressoShowValido }