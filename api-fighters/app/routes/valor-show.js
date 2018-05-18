import validar from '../validation/valor-show'
import valorPorShowDb from '../db/valor-show'

//GET /api/v1/valores
const getValorPorShow = (req, res) => {
    const id_show = req.query.id_show
    Promise.resolve(valorPorShowDb.listarPorShow(id_show))
        .then(valores => {
            if(valores.length) {
                const valor = valores.reduce((memo, d) => memo + d.valor, 0)
                res.status(200).json({ valor })
            } else {
                res.status(200).json({ valor: 0 })
            }
        })
        .catch(err => handleError(err, res))
}

//GET /api/v1/valores/ticket-medio
const getTicketMedio = (req, res) => {
    const id_show = req.query.id_show
    Promise.resolve(valorPorShowDb.listarPorShow(id_show))
        .then(valores => {
            if(valores.length) {
                const valor_total = valores.reduce((memo, d) => memo + d.valor, 0)
                res.status(200).json({ ticket_medio: valor_total / valores.length })
            } else {
                res.status(200).json({ ticket_medio: 0 })
            }
        })
        .catch(err => handleError(err, res))
}

//POST /api/v1/valores
const postValorPorShow = (req, res) => {
    const valorPorShow = req.body
    Promise.resolve(validar(valorPorShow))
        .then(valorPorShow => valorPorShowDb.salvar(valorPorShow))
        .then(valorPorShow => res.status(200).json(valorPorShow))
        .catch(err => handleError(err, res))
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

export { postValorPorShow, getValorPorShow, getTicketMedio }