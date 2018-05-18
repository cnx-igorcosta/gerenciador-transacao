import chai from 'chai'
import should from 'should'
import IngressoPorShow from '../app/models/ingresso-show'
import ingressoPorShowDb from '../app/db/ingresso-show'

describe('Testes Unitários de database da API FOO.', () => {
    beforeEach(done => { //Before each test we empty the database
        IngressoPorShow.remove({}, err => {
            done()
        })
    })
    
    
    it('Deve salvar novo ingresso por show.', done => {
        ingressoPorShowDb.salvar(ingressoPorShow)
            .then(ingresso => {
                ingresso.should.be.property('_id')
                done()
            }).catch(err => {
                console.log(err)
            })
    })
    
    it('Deve listar ingressos por show.', done => {
        ingressoPorShowDb.salvar(ingressoPorShow)
            .then(ingresso => ingressoPorShowDb.listarPorShow('898998'))
            .then(ingressos => {
                ingressos.should.be.a.Array()
                ingressos.should.with.lengthOf(1)
                ingressos[0].should.be.property('id_ingresso', '898998')
                done()
            }).catch(err => {
                console.log(err.message)
            })
    })

    it('Deve buscar por ingressos e show.', done => {
        ingressoPorShowDb.salvar(ingressoPorShow)
            .then(ingressoPorShow => ingressoPorShowDb.buscarPorIngressoEShow('898998','898998'))
            .then(ingressoPorShow => {
                ingressoPorShow.should.be.a.Object()
                ingressoPorShow.should.be.property('id_ingresso', '898998')
                done()
            }).catch(err => {
                console.log(err.message)
            })
    })
 })

 const ingressoPorShow = {
    id_ingresso: '898998',
    id_show: '898998',
 }