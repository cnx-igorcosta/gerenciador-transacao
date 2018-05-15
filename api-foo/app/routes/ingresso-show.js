//import validar from '../validation/compra-ingresso'
//import transacaoDb from '../db/transacao'

const ticketsStorage = []

//POST /api/v1/tickets
const postIngressoPorShow = (req, res) => {
    res.status(204).json({})
}

//GET /api/v1/tickets
const getTotalIngressoPorShow = (req, res) => {
    res.json({ total: 10 })
}

//GET /api/v1/tickets/validate
const getIngressoShowValido = (req, res) => {
    res.json({ valid: true })
}

export { postIngressoPorShow, getTotalIngressoPorShow, getIngressoShowValido }