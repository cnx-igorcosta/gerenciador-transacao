import transacaoReceiver from './app/queue/receiver'
import { transacaoService } from './app/services/transacao'

// Inicia escuta na fila de transação
transacaoReceiver.startListening(transacaoService)
