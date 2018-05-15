import chai from 'chai'
import should from 'should'
import moment from 'moment'
import mongoose from 'mongoose'

import transacaoDb from '../../app/db/transacao'
import Transacao from '../../app/models/transacao'

describe('Validação de funções de banco de Transacao', () => {
    beforeEach(done => { //Before each test we empty the database
        Transacao.remove({}, err => {
            done()
      })
    })

    describe('salvar', () => {
        it('deve retornar erro ao tentar salvar transacao sem campos obrigatórios', done => {
            const transacao = {}
            transacaoDb.salvar(transacao).catch(err => {
                err.should.be.a.Object()
                err.should.have.property('errors')
                done()
            })
        })
        it('deve salvar transacao na base e retornar a transacao com _id', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const transacao = {data_compra: dataAtual, account_id: '10101010', estado: 'pending'}
            transacaoDb.salvar(transacao)
                .then(transacao => {
                    transacao.should.have.property('_id')
                    done()        
                })
        })
    })
})