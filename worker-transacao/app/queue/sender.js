import amqp from 'amqplib/callback_api'
import config from 'config'

// URI de conexao com o Rabbitmq
const uri = config.URI_RABBITMQ
// Nome da queue
const queue = config.QUEUE_NAME

// Objeto com funcao de conexao com o Rabbitmq e envio de mensagens
const transacaoQueue = {
  send: (msg, callback) => {
    amqp.connect(uri, (err, conn) => {
      if(err) hanldeError(err, conn, 'Erro ao tentar se conectar.')
      else {
        // Criacao de canal de comunicacao
        conn.createChannel((err, ch) => {
          if(err) hanldeError(err, conn, 'Erro ao criar canal.')
          else {
            // Verifica se a queue existe        
            ch.assertQueue(queue, {durable: false})
            // Envio da mensagem
            ch.sendToQueue(queue, new Buffer(msg))
            console.log(`Sent ${msg}`)
            // Fecha conexao
            setTimeout(() => { conn.close() }, 500)
            if(callback) callback(true)
          }
        })
      }
    })
  }
}

const enviarParaFila = transacao => {
  return new Promise((resolve, reject) => {
      try {
          const msg = JSON.stringify(transacao._id)
          transacaoQueue.send(msg)
          resolve(transacao)
      } catch(err) {
          reject(err)
      }

  })
}

const hanldeError = (err, conn) => {
  // Fecha conexao se existir
  if(conn) {
    conn.close()
    console.log('Conexao com Rabbitmq fechada.')
  }
  throw new Error(`Erro ao tentar enviar mensagem via rabbitmq: ${err.message}`)
} 

export { transacaoQueue, enviarParaFila }