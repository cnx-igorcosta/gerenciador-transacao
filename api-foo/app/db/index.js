import mongoose from 'mongoose'
import morgan from 'morgan'
import config from 'config'

// Conexão db
const uri = config.DBHost
// Opções db
const options = {
    keepAlive: 300000,
    connectTimeoutMS: 30000,
};

const db = {
    connect: (app) => { 
        mongoose.connect(uri, options)
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error:'))

        // Não mostra log quando esta em teste
        if(config.util.getEnv('NODE_ENV') !== 'test') {
            //usa morgan para logar via linha de comando
            app.use(morgan('combined')) //'combined' outputs the Apache style LOGs
        }
    }
}

export { db }
