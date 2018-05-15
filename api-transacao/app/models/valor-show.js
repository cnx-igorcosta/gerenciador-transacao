import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ValorShowSchema = new Schema (
    {
        id_show: { type: String, required: true },
        valor: { type: Number, required: true },
        id_transacao: {type: String, required: true},
        estado: { type: String, required: true }
    }
)

const IngressoShow = mongoose.model('ingressoShow', IgressoShowSchema)
export default IngressoShow