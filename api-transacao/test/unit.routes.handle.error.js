import chai from 'chai'
import should from 'should'
import sender from '../app/queue/sender'
import receiver from '../app/queue/receiver'
import { handleReenvioFila } from '../app/routes/transacao'

describe('Testes Unitários para lidar com erro em routes de Transação', () => {
    
    it('Deve colocar na fila quando qtdReenvio for menor que 5', done => {
        const context = {compraIngresso: {qtdReenvio: 4}}
        const colocouNaFila = handleReenvioFila(context, null)
        colocouNaFila.should.be.eql(true)
        done()
    })

    it('Não deve colocar na fila quando qtdReenvio for igual a 5', done => {
        const context = {compraIngresso: {qtdReenvio: 5}}
        const colocouNaFila = handleReenvioFila(context, null)
        colocouNaFila.should.be.eql(false)
        done()
    })

    it('Não deve colocar na fila quando qtdReenvio for maior que 5', done => {
        const context = {compraIngresso: {qtdReenvio: 6}}
        const colocouNaFila = handleReenvioFila(context, null)
        colocouNaFila.should.be.eql(false)
        done()
    })
    
 })