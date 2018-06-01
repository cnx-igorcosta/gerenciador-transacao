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
    connect: () => { 
        mongoose.connect(uri, options)
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error:'))
    }
}

export { db }
