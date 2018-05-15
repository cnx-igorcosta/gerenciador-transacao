import express from 'express'
import bodyParser from 'body-parser'

import { db } from './app/db'
import { postTransacao } from './app/routes/transacao.js'

const app = express()
const port = 8080

db.connect(app);

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({type: 'application/json'}))

app.get('/', (req, res) => res.json({message: 'Bem vindo ao Compra de Ingressos - API Transação!'}))


//TODO: consultar transacao retornando estado e dados

app.route('/transacao')
    //.get(getPlanetas)
    .post(postTransacao)

// app.route('/modeloRs/:_id')
//     .get(getModeloRs)
//     .delete(deleteModeloRs)    
//     .put(putModeloRs)

app.listen(port)
console.log(`Listening on port ${port}`)

export default app