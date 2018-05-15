import express from 'express'
import bodyParser from 'body-parser'

import { db } from './app/db'
import { postIngressoPorShow, getTotalIngressoPorShow, getIngressoShowValido } from './app/routes/ingresso-show.js'

const app = express()
const port = 3000

// Conexão com banco
db.connect(app);

// Midlewares
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({type: 'application/json'}))

app.get('/', (req, res) => res.json({message: 'Bem vindo a API FOO'}))

// Routes 
app.route('/api/v1/tickets')
    .get(getTotalIngressoPorShow)
    .post(postIngressoPorShow)

app.route('/api/v1/tickets/validate')
    .get(getIngressoShowValido)

// Start server    
app.listen(port)
console.log(`Listening on port ${port}`)

export default app