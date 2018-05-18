import chai from 'chai'
import should from 'should'
import ValorPorShow from '../app/models/valor-show'
import valorPorShowDb from '../app/db/valor-show'

describe('Testes Unitários de database da API FIGHTERS.', () => {
    beforeEach(done => { //Before each test we empty the database
        ValorPorShow.remove({}, err => {
            done()
        })
    })
    
    it('Deve salvar novo valor por show.', done => {
        valorPorShowDb.salvar(valorPorShow)
            .then(valor => {
                valor.should.be.property('_id')
                done()
            }).catch(err => {
                console.log(err)
            })
    })
    
    it('Deve listar valores por show.', done => {
        valorPorShowDb.salvar(valorPorShow)
            .then(valor => valorPorShowDb.listarPorShow('898998'))
            .then(valores => {
                valores.should.be.a.Array()
                valores.should.with.lengthOf(1)
                valores[0].should.be.property('id_show', '898998')
                done()
            }).catch(err => {
                console.log(err.message)
            })
    })
 })

 const valorPorShow = {
    id_show: '898998',
    valor: 30
 }