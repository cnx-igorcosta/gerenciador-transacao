import mongoose from 'mongoose'
const Schema = mongoose.Schema

const IgressoPorShowSchema = new Schema (
    {
        id_ingresso: { type: String, required: true },
        id_show: { type: String, required: true },
    }
)

const IngressoPorShow = mongoose.model('ingressoPorShow', IgressoPorShowSchema)
export default IngressoPorShow