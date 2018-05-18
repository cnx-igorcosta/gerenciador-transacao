import chai from 'chai'
import should from 'should'

import validar from '../app/validation/valor-show'

describe('Teste Unitário de validation da API FIGHTERS', () => {
    
    it('Deve retornar erro de todos os 2 campos obrigatorios', done => {
        const valorPorShow = {}
        validar(valorPorShow)
            .catch(err => {
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(2)
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviado id_show', done => {
        const valorPorShow = { id_show: '', valor:'40' }
        validar(valorPorShow)
            .catch(err => {
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo id_show é obrigatório')
                done()
            })
    })

    it('Deve retornar erro de campo obrigatório quando não é enviado valor', done => {
        const valorPorShow = { id_show: '32123123', valor:'' }
        validar(valorPorShow)
            .catch(err => {
                err.should.have.property('errors').and.be.a.Array()
                err.errors.should.with.lengthOf(1)
                err.errors[0].should.be.eql('O campo valor é obrigatório')
                done()
            })
    })
})