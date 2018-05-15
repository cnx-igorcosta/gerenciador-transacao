import mongoose from 'mongoose'
const Schema = mongoose.Schema

const IgressoShowSchema = new Schema (
    {
        id_ingresso: { type: String, required: true },
        id_show: { type: String, required: true },
        id_transacao: {type: String, required: true},
        estado: { type: String, required: true }
    }
)

const IngressoShow = mongoose.model('ingressoShow', IgressoShowSchema)
export default IngressoShow