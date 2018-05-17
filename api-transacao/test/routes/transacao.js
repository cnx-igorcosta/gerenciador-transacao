import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../server'
import should from 'should'
import moment from 'moment'
import mongoose from 'mongoose'

import Transacao from '../../app/models/transacao'

chai.use(chaiHttp)
describe('Validação da API Rest Transacao', () => {
    beforeEach(done => { //Before each test we empty the database
        Transacao.remove({}, err => {
            done();
      })
    })

    describe("/GET '/'", () => {
        it('deve retornar mensagem bem vindo', done => {
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

    describe('/POST /api/v1/transacao', () => {
        it('deve retornar erro de todos 5 os campos obrigatorios', done => {
            chai.request(server)
                .post('/api/v1/transacao')
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.errors.should.be.a.Array()
                    res.body.errors.should.with.lengthOf(5)
                    done()
                })
        })
        it('deve retornar erro de campo obrigatório quando não é enviada data_compra', done => {
            const compraIngresso = { data_compra: '', account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.errors.should.be.a.Array()
                    res.body.errors.should.with.lengthOf(1)
                    res.body.errors[0].should.be.eql('O campo data_compra é obrigatório')
                    done()
                })
        })
        it('deve retornar erro de data inválida quando data_compra não for um campo data válido', done => {
            const compraIngresso = { data_compra: 'invalida', account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.errors.should.be.a.Array()
                    res.body.errors.should.with.lengthOf(1)
                    res.body.errors[0].should.be.eql('O campo data_compra não é uma data válida')
                    done()
                })
        })
        it('deve retornar erro de data anterior à data atual quando data_compra não for superior à data atual', done => {
            const dataAtual = moment().subtract(1, "days").format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '10011011001', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.errors.should.be.a.Array()
                    res.body.errors.should.with.lengthOf(1)
                    res.body.errors[0].should.be.eql('O campo data_compra não pode ser uma data anterior à data atual')
                    done()
                })
        })
        it('deve retornar erro de campo obrigatório quando não é enviado account_id', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.errors.should.be.a.Array()
                    res.body.errors.should.with.lengthOf(1)
                    res.body.errors[0].should.be.eql('O campo account_id é obrigatório')
                    done()
                })
        })
        it('deve retornar erro de campo obrigatório quando não é enviado id_ingresso', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '312312', id_ingresso: '', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.errors.should.be.a.Array()
                    res.body.errors.should.with.lengthOf(1)
                    res.body.errors[0].should.be.eql('O campo id_ingresso é obrigatório')
                    done()
                })
        })
        it('deve retornar erro de campo obrigatório quando não é enviado id_show', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '312312', id_ingresso: '31213', id_show: '', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.errors.should.be.a.Array()
                    res.body.errors.should.with.lengthOf(1)
                    res.body.errors[0].should.be.eql('O campo id_show é obrigatório')
                    done()
                })
        })
        it('deve retornar erro de campo obrigatório quando não é enviado valor', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '312312', id_ingresso: '31213', id_show: '646345', valor: null }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 400)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.errors.should.be.a.Array()
                    res.body.errors.should.with.lengthOf(1)
                    res.body.errors[0].should.be.eql('O campo valor é obrigatório')
                    done()
                })
        })
        it('Deve retornar o id_transacao', done => {
            const dataAtual = moment().format('YYYY-MM-DD').toString()
            const compraIngresso = { data_compra: dataAtual, account_id: '12345', id_ingresso: '12345', id_show: '9876', valor: 670.30 }
            chai.request(server)
                .post('/api/v1/transacao')
                .send(compraIngresso)
                .end((err, res) => {
                    res.should.have.property('status', 200)
                    res.should.have.property('body').and.be.a.Object()
                    res.body.should.have.property('id_transacao')
                    done()
                })
        })
    })
})


//testar se transacao com id_ingresso e id_show ja existe
