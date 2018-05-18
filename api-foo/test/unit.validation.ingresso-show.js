import chai from 'chai'
import should from 'should'

import validar from '../app/validation/ingresso-show'

describe('Teste Unitário de validation da API FOO', () => {
    
    it('Deve retornar erro de todos os 2 campos obrigatorios', done => {
        const ingressoPorShow = {}
        validar(ingressoPorShow)
            .catch(err => {
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(2)
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviado id_show', done => {
        const ingressoPorShow = { id_show: '', id_ingresso:'21212' }
        validar(ingressoPorShow)
            .catch(err => {
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo id_show é obrigatório')
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviado id_ingresso', done => {
        const ingressoPorShow = { id_show: '32123123', id_ingresso:'' }
        validar(ingressoPorShow)
            .catch(err => {
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo id_ingresso é obrigatório')
                done()
            })
    })
})