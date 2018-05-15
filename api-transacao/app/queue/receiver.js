import amqp from 'amqplib/callback_api'

// URI de conexao com o Rabbitmq
const uri = 'amqp://rabbitmq'
// Nome da queue
const queue = 'TRANSACAO_QUEUE'

// Objeto com funcao de conexao com rabbitmq para espera de mensagens
const transacaoReceiver = {
  startListening: () => {
    amqp.connect(uri, (err, conn) => {
      if(err) hanldeError(err, conn, 'Erro ao tentar se conectar com Rabbitmq.')
      else {
        // Criacao de canal de comunicacao 
        conn.createChannel((err, ch) => {
          if(err) hanldeError(err, conn, 'Erro ao criar canal.')
          else {
            // Verifica se a queue existe
            ch.assertQueue(queue, {durable: false})
            console.log(`Waiting for messages in ${queue}...`)
            // Tratamento de quando chega mensagem
            ch.consume(queue, msg => {
              console.log(`Received ${msg.content}`)
              const compraIngresso = JSON.parse(msg.content)
            }, {noAck: false});
          }
        })
      }
    })
  }
}

//2018-05-13T21:38:01.988320963Z Message acked

const hanldeError = (err, conn, mensagem) => {
  console.log(mensagem, err)
  // Fecha conexao se existir
  if(conn) {
    conn.close()
    console.log('Conexao com Rabbitmq fechada.')
  }
} 

export default transacaoReceiver 
