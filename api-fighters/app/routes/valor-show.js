//import validar from '../validation/compra-ingresso'
//import transacaoDb from '../db/transacao'

const ticketsStorage = []

//POST /api/v1/valores
const postValorPorShow = (req, res) => {
    res.status(200).json({})
}

//GET /api/v1/valores
const getValorPorShow = (req, res) => {
    res.json({ valor: 1000 })
}

//GET /api/v1/valores/ticket-medio
const getTicketMedio = (req, res) => {
    res.json({ ticket_medio: 25 })
}

export { postValorPorShow, getValorPorShow, getTicketMedio }