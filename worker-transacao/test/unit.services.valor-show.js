import chai from 'chai'
import should from 'should'
import ValorPorShow from '../app/models/valor-show'

import { gravarValorPorShow } from '../app/services/valor-show'

describe('Testes Unitários de services da API Transação para chamadas à API FIGHTERS', () => {
    beforeEach(done => { //Before each test we empty the database
        ValorPorShow.remove({}, err => {
            done()
      })
    })
    
    it('Deve gravar valor por show na API FIGHTERS', done => {
        const context = { compraIngresso: {id_show: '98765', valor: 100} }
        gravarValorPorShow(context)
            .then(context => {
                context.should.have.property('ingressoPorShowGravado', true)
                done()
            })
    })
 })