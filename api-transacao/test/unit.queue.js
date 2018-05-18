import chai from 'chai'
import should from 'should'
import transacaoQueue from '../app/queue/sender'
import receiver from '../app/queue/receiver'

describe('Testes Unitários de queue da API Transação', () => {
    
    it('Deve enviar mensagem para a queue API_TRANSACAO com sucesso', done => {
        const context = { compraIngresso: {id_transacao: '551137c2f9e1fac808a5f572'} }
        const msg = JSON.stringify(context);
        try{
            const callback =(sucesso) => {
                sucesso.should.be.true()
                done()
            }
            const sucesso = transacaoQueue.send(msg, callback)
        } catch(err) {
            console.log(err)
        }
    })
    
    it('Deve receber mensagem da queue API_TRANSACAO com sucesso', done => {
        try{
            const callback = (_, context) => {
                context.should.be.property('compraIngresso')
                context.compraIngresso.should.be.property('id_transacao', '551137c2f9e1fac808a5f572')
            }
            receiver.startListening(callback)
            done()
        } catch(err) {
            console.log(err)
        }
    })
 })