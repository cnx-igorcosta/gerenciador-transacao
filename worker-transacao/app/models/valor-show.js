import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ValorPorShowSchema = new Schema (
    {
        id_show: { type: String, required: true },
        valor: { type: Number, required: true },
    }
)

const valorPorShow = mongoose.model('valorPorShow', ValorPorShowSchema)
export default valorPorShow