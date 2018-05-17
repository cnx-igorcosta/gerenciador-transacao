import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TransacaoSchema = new Schema (
    {
        data_compra: { type: Date, required: true },
        account_id: { type: String, required: true },
        id_ingresso: { type: String, required: true },
        id_show: { type: String, required: true },
        valor: { type: Number, required: true },
        estado: { type: String, required: true },
        motivoFalha: { type: String }
    }
)

const Transacao = mongoose.model('transacao', TransacaoSchema)
export default Transacao