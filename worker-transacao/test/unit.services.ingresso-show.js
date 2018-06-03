import chai from 'chai'
import should from 'should'
import config from 'config'
import { httpGet } from '../app/services/http'
import IngressoPorShow from '../app/models/ingresso-show'
import Transacao from '../app/models/transacao'
import transacaoDb from '../app/db/transacao'
import { gravarIngressoShow } from '../app/services/ingresso-show'
import * as estados from '../app/domain/estados'
import * as passos from '../app/domain/passos'

describe('Testes Unitários de services de Worker Transação para chamadas à API FOO', () => {
    beforeEach(done => { //Before each test we empty the database
        IngressoPorShow.remove({}, err => {
            Transacao.remove({}, err => {
                done()
            })
        })
    })
    
    it("Deve devolver transacao sem alterar seu estado e o passo quando passo não for 'INGRESSO_SHOW'", done => {
        const transacao = {
            estado: estados.PENDING,
            passo_atual: passos.VALOR_SHOW,
            passo_estado: estados.SUCCESS,
        }
        gravarIngressoShow(transacao)
            .then(transacao => {
                transacao.should.have.property('estado',estados.PENDING)
                transacao.should.have.property('passo_atual',passos.VALOR_SHOW)
                done()
            })
    })
    it("Deve devolver transacao sem alterar seu estado e o passo quando passo for 'INGRESSO_SHOW' e estado não for 'in_process'", done => {
        const transacao = {
            estado: estados.PENDING,
            passo_atual: passos.VALOR_SHOW,
            passo_estado: estados.SUCCESS,
        }
        gravarIngressoShow(transacao)
            .then(transacao => {
                transacao.should.have.property('estado', estados.PENDING)
                transacao.should.have.property('passo_atual', passos.VALOR_SHOW)
                done()
            })
    })
    it("Deve gravar INGRESSO POR SHOW na API FOO quando transacao estiver no passo 'INGRESSO_SHOW' e estado 'in_process'", done => {
        const transacao = {
            data_compra: '2019-01-01T00:00:00.000Z',
            account_id: 265923,
            id_ingresso: "30",
            id_show: "865387",
            valor: 130,
            estado: estados.IN_PROCESS,
            passo_atual: passos.INGRESSO_SHOW,
            passo_estado: estados.IN_PROCESS,
        }
        const url = `${config.URI_API_FOO_VALIDATE}?id_show=${transacao.id_show}&id_ingresso=${transacao.id_ingresso}`
        transacaoDb.salvar(transacao)
            .then(transacao => gravarIngressoShow(transacao))
            .then(transacao => httpGet(url))
            .then(response => {
                response.should.have.property('body').and.be.a.Object()
                response.body.should.have.property('valid', true)
                done()
            })
            .catch(err => console.log(err))
    })
    it("Deve mudar transacao para o passo VALOR_SHOW após gravar INGRESSO POR SHOW na api FOO", done => {
        const transacao = {
            data_compra: '2019-01-01T00:00:00.000Z',
            account_id: 265923,
            id_ingresso: "30",
            id_show: "865387",
            valor: 130,
            estado: estados.IN_PROCESS,
            passo_atual: passos.INGRESSO_SHOW,
            passo_estado: estados.IN_PROCESS,
        }
        transacaoDb.salvar(transacao)
            .then(transacao => gravarIngressoShow(transacao))
            .then(transacao => {
                transacao.should.have.property('estado', 'in_process')
                transacao.should.have.property('passo_atual', 'VALOR_SHOW')
                transacao.should.have.property('passo_estado', 'in_process')
                done()
            })
            .catch(err => console.log(err))
    })
 })

