import chai from 'chai'
import should from 'should'
import moment from 'moment'

import validar from '../app/validation/compra-ingresso'

describe('Teste Unitário de validation da API Transação', () => {
    
    it('Deve retornar erro de todos 5 os campos obrigatorios', done => {
        const context = { compraIngresso: {} }
        validar(context)
            .catch(err => {
                err.should.have.property('validation_error', true)
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(5)
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviada data_compra', done => {
        const context = { compraIngresso: { data_compra: '', account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 } }
        validar(context)
            .catch(err => {
                err.should.have.property('validation_error', true)
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo data_compra é obrigatório')
                done()
            })
    })

    it('Deve retornar erro de data inválida quando data_compra não for um campo data válido', done => {
        const context = { compraIngresso: { data_compra: 'invalida', account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 } }
        validar(context)
            .catch(err => {
                err.should.have.property('validation_error', true)
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo data_compra não é uma data válida')
                done()
            })
    })

    it('Deve retornar erro de data anterior à data atual quando data_compra não for superior à data atual', done => {
        const data_compra = moment().subtract(1, "days").format('YYYY-MM-DD').toString()
        const context = { compraIngresso: { data_compra: data_compra, account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 } }
        validar(context)
            .catch(err => {
                err.should.have.property('validation_error', true)
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo data_compra não pode ser uma data anterior à data atual')
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviado account_id', done => {
        const dataAtual = moment().format('YYYY-MM-DD').toString()
        const context = { compraIngresso: { data_compra: dataAtual, account_id: '', id_ingresso: '12345', id_show: '9876', valor: 670.30 } }
        validar(context)
            .catch(err => {
                err.should.have.property('validation_error', true)
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo account_id é obrigatório')
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviado id_ingresso', done => {
        const dataAtual = moment().format('YYYY-MM-DD').toString()
        const context = { compraIngresso: { data_compra: dataAtual, account_id: '10011011001', id_ingresso: '', id_show: '9876', valor: 670.30 } }
        validar(context)
            .catch(err => {
                err.should.have.property('validation_error', true)
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo id_ingresso é obrigatório')
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviado id_show', done => {
        const dataAtual = moment().format('YYYY-MM-DD').toString()
        const context = { compraIngresso: { data_compra: dataAtual, account_id: '10011011001', id_ingresso: '12345', id_show: '', valor: 670.30 } }
        validar(context)
            .catch(err => {
                err.should.have.property('validation_error', true)
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo id_show é obrigatório')
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviado valor', done => {
        const dataAtual = moment().format('YYYY-MM-DD').toString()
        const context = { compraIngresso: { data_compra: dataAtual, account_id: '10011011001', id_ingresso: '12345', id_show: '1234', valor: '' } }
        validar(context)
            .catch(err => {
                err.should.have.property('validation_error', true)
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo valor é obrigatório')
                done()
            })
    })
})