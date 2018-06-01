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
        passo_atual: { type: String },
        passo_estado: { type: String },
        qtd_tentativas: { type: Number },
        mensagem: { type: String }
    }
)

const Transacao = mongoose.model('transacao', TransacaoSchema)
export default Transacao