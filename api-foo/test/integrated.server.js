import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server'
import should from 'should'
import mongoose from 'mongoose'
import IngressoPorShow from '../app/models/ingresso-show'


chai.use(chaiHttp)
describe('Testes Integrados da aplicação API FOO', () => {
    beforeEach(done => { //Before each test we empty the database
        IngressoPorShow.remove({}, err => {
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

      describe("/GET /api/v1/tickets", () => {
        it('Deve retornar total de ingressos por show', done => {
            const url = '/api/v1/tickets?id_show=551137c2f9e1fac808a5f572'
            chai.request(server)
                .get(url)
                .end((err, res) => {
                    res.should.have.property('status', 200)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.should.have.property('total', 0)
                    done()
                })
        })
      })

      describe("/POST /api/v1/tickets", () => {
        it('Deve salvar ingresso por show', done => {
            const ingressoShow = { id_ingresso: '9090', id_show:'9090' }
            const url = '/api/v1/tickets'
            chai.request(server)
                .post(url)
                .send(ingressoShow)
                .end((err, res) => {
                    res.should.have.property('status', 200)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.should.have.property('_id')
                    done()
                })
        })
      })

      describe("/GET /api/v1/tickets/validate", () => {
        it('Deve retornar false quando pesquisar por combinação ingresso show inexistente', done => {
            const url = '/api/v1/tickets/validate?id_ingresso=9090&id_show=9090'
            chai.request(server)
                .get(url)
                .end((err, res) => {
                    res.should.have.property('status', 200)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.should.have.property('valid', false)
                    done()
                })
        })
      })

      describe("/GET /api/v1/tickets/validate", () => {
        it('Deve retornar true quando pesquisar por combinação ingresso show válida', done => {
            const ingressoShow = { id_ingresso: '9090', id_show:'9090' }
            const url = '/api/v1/tickets/validate?id_ingresso=9090&id_show=9090'
            chai.request(server)
                .post('/api/v1/tickets/')
                .send(ingressoShow)
                .end((err, res1) => { 
                    chai.request(server)
                        .get(url)
                        .end((err, res2) => {
                            res2.should.have.property('status', 200)
                            res2.should.have.property('body').and.be.a.Object()
                            res2.body.should.have.property('valid', true)
                            done()
                        })
                })
        })
      })
})

