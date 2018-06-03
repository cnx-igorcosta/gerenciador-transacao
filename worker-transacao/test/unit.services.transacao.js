import chai from 'chai'
import should from 'should'
import config from 'config'
import { httpGet } from '../app/services/http'
import Transacao from '../app/models/transacao'
import transacaoDb from '../app/db/transacao'
import { iniciarTransacao } from '../app/services/passo-inicial'
import { finalizarTransacao } from '../app/services/passo-final'
import * as estados from '../app/domain/estados'
import * as passos from '../app/domain/passos'

describe('Testes Unitários de services de Worker Transação gerenciamento dos passos inicial e final', () => {
    beforeEach(done => { //Before each test we empty the database
        Transacao.remove({}, err => {
            done()
        })
    })
    
    describe('Passo Inicial da Transação', () => { 
        it("Deve devolver transação sem alterar seu estado e o passo quando não tiver com estado 'pending'", done => {
            const transacao = {
                data_compra: '2019-01-01T00:00:00.000Z',
                account_id: 265923,
                id_ingresso: "30",
                id_show: "865387",
                valor: 130,
                estado: estados.FAIL,
            }
            transacaoDb.salvar(transacao)
                .then(transacao => iniciarTransacao(transacao))
                .then(transacao => {
                    transacao.should.have.property('estado',estados.FAIL)
                    done()
                })
                .catch(err => console.log(err))
        })
        it("Deve alterar o estado para 'in_process', o passo para 'INGRESSO_SHOW', e estado do passo 'pending' quando transação estiver com estado 'pending'", done => {
            const transacao = {
                data_compra: '2019-01-01T00:00:00.000Z',
                account_id: 265923,
                id_ingresso: "30",
                id_show: "865387",
                valor: 130,
                estado: estados.PENDING,
            }
            transacaoDb.salvar(transacao)
                .then(transacao => iniciarTransacao(transacao))
                .then(transacao => {
                    transacao.should.have.property('estado', estados.IN_PROCESS)
                    transacao.should.have.property('passo_atual', passos.INGRESSO_SHOW)
                    transacao.should.have.property('passo_estado', estados.IN_PROCESS)
                    done()
                })
                .catch(err => console.log(err))
        })
    })
    describe('Passo Final da Transação', () => { 
        it("Deve devolver transacao sem alterar seu estado quando não tiver no passo 'FINALIZACAO'", done => {
            const transacao = {
                data_compra: '2019-01-01T00:00:00.000Z',
                account_id: 265923,
                id_ingresso: "30",
                id_show: "865387",
                valor: 130,
                estado: estados.IN_PROCESS,
                passo_atual: passos.INGRESSO_SHOW,
                passo_estado: estados.IN_PROCESS
            }
            transacaoDb.salvar(transacao)
                .then(transacao => finalizarTransacao(transacao))
                .then(transacao => {
                    transacao.should.have.property('estado',estados.IN_PROCESS)
                    done()
                })
                .catch(err => console.log(err))
        })
        it("Deve alterar o estado para 'success' e estado do passo para 'success' quando transação quando estiver no passo 'FINALIZACAO'", done => {
            const transacao = {
                data_compra: '2019-01-01T00:00:00.000Z',
                account_id: 265923,
                id_ingresso: "30",
                id_show: "865387",
                valor: 130,
                estado: estados.IN_PROCESS,
                passo_atual: passos.FINALIZACAO,
                passo_estado: estados.IN_PROCESS
            }
            transacaoDb.salvar(transacao)
                .then(transacao => finalizarTransacao(transacao))
                .then(transacao => {
                    transacao.should.have.property('estado', estados.SUCCESS)
                    transacao.should.have.property('passo_atual', passos.FINALIZACAO)
                    transacao.should.have.property('passo_estado', estados.SUCCESS)
                    done()
                })
                .catch(err => console.log(err))
        })
    })
 })

