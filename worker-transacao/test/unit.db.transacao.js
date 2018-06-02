import chai from 'chai'
import should from 'should'
import Transacao from '../app/models/transacao'
import transacaoDb from '../app/db/transacao'
import { db } from '../app/db'

// Abre conexão com banco
db.connect()

describe('Testes Unitários de database de Worker Transação.', () => {
    beforeEach(done => { //Before each test we empty the database
        Transacao.remove({}, err => {
            done()
        }).catch(err => console.log(err))
    })
    
    
    it('Deve salvar nova transacao.', done => {
        transacaoDb.salvar(transacao)
        .then(transacao => {
            transacao.should.be.property('_id')
            done()
        }).catch(err => {
            console.log(err)
        })
    })

    it('Deve atualizar estado, passo_atual, passo_estado, qtd_tentativas e mensagem de transacao.', done => {
        transacaoDb.salvar(transacao)
        .then(transacao_salva => {
            transacao_salva.estado = 'teste_estado'
            transacao_salva.passo_atual = 'teste_passo_atual'
            transacao_salva.passo_estado = 'teste_passo_estado'
            transacao_salva.qtd_retentativas = 4
            transacao_salva.mensagem = 'teste_mensagem'
            return Promise.resolve(transacaoDb.atualizar(transacao_salva))
        })
        .then(transacao_atualizada => {
            transacao_atualizada.should.be.property('estado', 'teste_estado')
            transacao_atualizada.should.be.property('passo_atual', 'teste_passo_atual')
            transacao_atualizada.should.be.property('passo_estado', 'teste_passo_estado')
            transacao_atualizada.should.be.property('qtd_retentativas', 4)
            transacao_atualizada.should.be.property('mensagem', 'teste_mensagem')
            done()
        })
        .catch(err => {
            console.log(err)
        })
    })
    
    it('Deve buscar transacao após salvar.', done => {
        transacaoDb.salvar(transacao)
            .then(transacao => transacaoDb.buscarPorIdTransacao(transacao._id))
            .then(transacao => {
                transacao.should.be.property('id_ingresso', '898998')
                done()
            }).catch(err => {
                console.log(err)
            })
    })

 })

 const transacao = {
    data_compra: '2018-01-01',
    account_id: '898998',
    id_ingresso: '898998',
    id_show: '898998',
    valor: '50',
    estado: 'pending'
 }