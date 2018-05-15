import express from 'express'
import bodyParser from 'body-parser'

import { db } from './app/db'
import { getValorPorShow, postValorPorShow, getTicketMedio } from './app/routes/valor-show.js'

const app = express()
const port = 4000

// Conexão com banco
db.connect(app);

// Midlewares
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({type: 'application/json'}))

app.get('/', (req, res) => res.json({message: 'Bem vindo a API FIGHTERS'}))

// Routes 
app.route('/api/v1/valores')
    .get(getValorPorShow)
    .post(postValorPorShow)

app.route('/api/v1/valores/ticket-medio')
    .get(getTicketMedio)

// Start server    
app.listen(port)
console.log(`Listening on port ${port}`)

export default app