import chai from 'chai'
import should from 'should'
import transacaoQueue from '../app/queue/sender'

describe('Testes Unitários de queue da API Transação', () => {
    
    it('Deve enviar transacao como mensagem para a queue com sucesso', done => {
        const transacao = { _id: '551137c2f9e1fac808a5f572' }
        const msg = JSON.stringify(transacao);
        try{
            // Para esperar o tempo necessário para subir o rabbitmq
            setTimeout(() => {
                const callback =(sucesso) => {
                    sucesso.should.be.true()
                    done()
                }
                const sucesso = transacaoQueue.send(msg, callback)
            }, 1500)
        } catch(err) {
            console.log(err)
        }
    })
 })