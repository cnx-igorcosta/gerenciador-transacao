import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server'
import should from 'should'
import mongoose from 'mongoose'
import ValorPorShow from '../app/models/valor-show'


chai.use(chaiHttp)
describe('Testes Integrados da aplicação API FIGHTERS', () => {
    beforeEach(done => { //Before each test we empty the database
        ValorPorShow.remove({}, err => {
            done()
      })
    })

    describe("/GET '/'", () => {
        it('Deve retornar mensagem bem vindo', done => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.property('status', 200)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.should.have.property('message').and.be.a.String()
                    done()
                })
        })
      })

      describe("/GET /api/v1/valores", () => {
        it('Deve retornar total de ingressos por show', done => {
            const url = '/api/v1/valores?id_show=551137c2f9e1fac808a5f572'
            chai.request(server)
                .get(url)
                .end((err, res) => {
                    res.should.have.property('status', 200)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.should.have.property('valor', 0)
                    done()
                })
        })
      })

      describe("/POST /api/v1/valores", () => {
        it('Deve salvar valor por show', done => {
            const valorPorShow = { id_show:'9090', valor: '50' }
            const url = '/api/v1/valores'
            chai.request(server)
                .post(url)
                .send(valorPorShow)
                .end((err, res) => {
                    res.should.have.property('status', 200)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.should.have.property('_id')
                    done()
                })
        })
      })

      describe("/GET /api/v1/valores/ticket-medio", () => {
        it('Deve retornar o cálculo de ticket médio', done => {
            const valorPorShow1 = { id_show:'9090', valor: '30' }
            const valorPorShow2 = { id_show:'9090', valor: '70' }
            const url = '/api/v1/valores/ticket-medio?id_show=9090'
            chai.request(server)
                .post('/api/v1/valores')
                .send(valorPorShow1)
                .end((err, res) => {

                    chai.request(server)
                    .post('/api/v1/valores')
                    .send(valorPorShow2)
                    .end((err, res) => {
                    
                        chai.request(server)
                            .get(url)
                            .end((err, res) => {
                                res.should.have.property('status', 200)
                                res.should.have.property('body').and.be.a.Object()
                                res.body.should.have.property('ticket_medio', 50)
                                done()
                            })
                    })
                })
        })
      })
})

