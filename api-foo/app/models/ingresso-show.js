import mongoose from 'mongoose'
const Schema = mongoose.Schema

const IgressoPorShowSchema = new Schema (
    {
        id_ingresso: { type: String, required: true },
        id_show: { type: String, required: true },
        id_transacao: {type: String, required: true},
    }
)

const IgressoPorShow = mongoose.model('ingressoPorShow', IgressoPorShowSchema)
export default IgressoPorShow