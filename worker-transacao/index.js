// Gerenciador de transações

import { db } from './app/db'
import transacaoReceiver from './app/queue/receiver'
import { transacaoService } from './app/services/transacao'

// Inicia conexão com banco
db.connect()
// Inicia escuta na fila de transação
transacaoReceiver.startListening(transacaoService.executar)
