import chai from 'chai'
import should from 'should'
import IngressoPorShow from '../app/models/ingresso-show'

import { validarDuplicidadeIngresso, gravarIngressoPorShow } from '../app/services/ingresso-show'

describe('Testes Unitários de services da API Transação para chamadas à API FOO', () => {
    beforeEach(done => { //Before each test we empty the database
        IngressoPorShow.remove({}, err => {
            done()
      })
    })
    
    it('Deve gravar ingresso por show na API FOO', done => {
        const context = { compraIngresso: {id_ingresso: '98765', id_show: '98765'} }
        gravarIngressoPorShow(context)
            .then(context => {
                context.should.have.property('ingressoPorShowGravado',true)
                done()
            })
    })
    it('Deve consultar na API FOO ingresso não existente', done => {
        const context = { compraIngresso: {id_ingresso: '3612861', id_show: '3612861'} }
        validarDuplicidadeIngresso(context)
            .then(context => { 
                context.should.have.property('ingresso_existente',false)
                done()
            })
    })
    it('Deve consultar na API FOO se e retornar erro de ingresso existente', done => {
        const context = { compraIngresso: {id_ingresso: '98765', id_show: '98765'} }
        gravarIngressoPorShow(context)
            .then(context => {
                context.should.have.property('ingressoPorShowGravado',true)
                return context                
            })
            .then(context => validarDuplicidadeIngresso(context))
            .catch(err => { 
                err.should.have.property('message','id_ingresso por Show já existe!')
                done()
            })
    })
 })