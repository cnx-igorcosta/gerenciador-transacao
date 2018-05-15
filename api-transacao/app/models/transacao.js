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
        //falha: Schema.Types.Erro
    }
)

    // TODO: transacao tem tudo
    // {
    //     "data_compra" : "2020-01-01",
    //     "account_id": "111111",
    //     "id_ingresso": "650540646064560",
    //     "id_show": "654321",
    //     "valor": 654.32
    //     "falha": { "msgs": [] } 
    //   }

const Transacao = mongoose.model('transacao', TransacaoSchema)
export default Transacao