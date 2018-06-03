import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server'
import should from 'should'
import moment from 'moment'
import mongoose from 'mongoose'
import config from 'config'
import Transacao from '../app/models/transacao'

chai.use(chaiHttp)
describe('Testes Integrados da aplicação API Transação', () => {
    beforeEach(done => { //Before each test we empty the database
        Transacao.remove({}, err => {
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

    describe("/POST '/api/v1/transacao'", () => {
        it('Deve retornar erro de todos 5 os campos obrigatorios', done => {
            chai.request(server)
                .post('/api/v1/transacao')
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.error.should.be.a.Object()
                    res.body.error.should.have.property('validation_error', true)
                    res.body.error.should.have.property('errors').and.be.a.Array()
                    res.body.error.errors.should.with.lengthOf(5)
                    done()
                })
        })
        it('Deve retornar erro de campo obrigatório quando não é enviada data_compra', done => {
            const compraIngresso = { data_compra: '', account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.error.should.be.a.Object()
                    res.body.error.should.have.property('validation_error', true)
                    res.body.error.should.have.property('errors').and.be.a.Array()
                    res.body.error.errors.should.with.lengthOf(1)
                    res.body.error.errors[0].should.be.eql('O campo data_compra é obrigatório')
                    done()
                })
        })
        it('Deve retornar erro de data inválida quando data_compra não for um campo data válido', done => {
            const compraIngresso = { data_compra: 'invalida', account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.error.should.be.a.Object()
                    res.body.error.should.have.property('validation_error', true)
                    res.body.error.should.have.property('errors').and.be.a.Array()
                    res.body.error.errors.should.with.lengthOf(1)
                    res.body.error.errors[0].should.be.eql('O campo data_compra não é uma data válida')
                    done()
                })
        })
        it('Deve retornar erro de data anterior à data atual quando data_compra não for superior à data atual', done => {
            const dataAtual = moment().subtract(1, "days").format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.error.should.be.a.Object()
                    res.body.error.should.have.property('validation_error', true)
                    res.body.error.should.have.property('errors').and.be.a.Array()
                    res.body.error.errors.should.with.lengthOf(1)
                    res.body.error.errors[0].should.be.eql('O campo data_compra não pode ser uma data anterior à data atual')
                    done()
                })
        })
        it('Deve retornar erro de campo obrigatório quando não é enviado account_id', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.error.should.be.a.Object()
                    res.body.error.should.have.property('validation_error', true)
                    res.body.error.should.have.property('errors').and.be.a.Array()
                    res.body.error.errors.should.with.lengthOf(1)
                    res.body.error.errors[0].should.be.eql('O campo account_id é obrigatório')
                    done()
                })
        })
        it('Deve retornar erro de campo obrigatório quando não é enviado id_ingresso', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '312312', id_ingresso: '', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.error.should.be.a.Object()
                    res.body.error.should.have.property('validation_error', true)
                    res.body.error.should.have.property('errors').and.be.a.Array()
                    res.body.error.errors.should.with.lengthOf(1)
                    res.body.error.errors[0].should.be.eql('O campo id_ingresso é obrigatório')
                    done()
                })
        })
        it('Deve retornar erro de campo obrigatório quando não é enviado id_show', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '312312', id_ingresso: '31213', id_show: '', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.error.should.be.a.Object()
                    res.body.error.should.have.property('validation_error', true)
                    res.body.error.should.have.property('errors').and.be.a.Array()
                    res.body.error.errors.should.with.lengthOf(1)
                    res.body.error.errors[0].should.be.eql('O campo id_show é obrigatório')
                    done()
                })
        })
        it('Deve retornar erro de campo obrigatório quando não é enviado valor', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '312312', id_ingresso: '31213', id_show: '646345', valor: null }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.error.should.be.a.Object()
                    res.body.error.should.have.property('validation_error', true)
                    res.body.error.should.have.property('errors').and.be.a.Array()
                    res.body.error.errors.should.with.lengthOf(1)
                    res.body.error.errors[0].should.be.eql('O campo valor é obrigatório')
                    done()
                })
        })
        it("Deve criar transacao e retornar o id e com estado 'pending'", done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '12345', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            // Para esperar o tempo necessário para subir o rabbitmq
            setTimeout(() => {
                chai.request(server)
                    .post('/api/v1/transacao')
                    .send(compraIngresso)
                    .end((err, res) => {
                        res.should.have.property('status', 202)
                        res.should.have.property('body').and.be.a.Object()
                        res.body.should.have.property('transacao').and.be.a.Object()
                        res.body.transacao.should.have.property('_id')
                        res.body.transacao.should.have.property('estado','pending')
                        done()
                    })
            },1500)
        })
    })

    describe("/GET '/api/v1/transacao'", () => {
            it('Deve buscar transacao por id_transacao', done => {
                chai.request(server)
                    .get('/api/v1/transacao?id_transacao=551137c2f9e1fac808a5f572')
                    .end((err, res) => {
                        res.should.have.property('status', 200)
                        res.should.have.property('body').and.be.a.Object()
                        done()
                    })
            })
     })
})

