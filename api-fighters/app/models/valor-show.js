import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ValorPorShowSchema = new Schema (
    {
        id_show: { type: String, required: true },
        valor: { type: Number, required: true },
        id_transacao: {type: String, required: true},
    }
)

const ingressoPorShow = mongoose.model('ingressoPorShow', ValorPorShowSchema)
export default ingressoPorShow