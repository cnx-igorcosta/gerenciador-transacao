import chai from 'chai'
import should from 'should'
import config from 'config'
import { db } from '../app/db'
import { httpGet } from '../app/services/http'
import Transacao from '../app/models/transacao'
import transacaoDb from '../app/db/transacao'
import { transacaoService } from '../app/services/transacao'
import * as estados from '../app/domain/estados'
import * as passos from '../app/domain/passos'

// Abre conexão com banco
db.connect()

describe('Testes Unitários de retentativas e falhas ao executar os passos da transação', () => {
    beforeEach(done => { //Before each test we empty the database
        Transacao.remove({}, err => {
            done()
        })
    })
    it("Deve mudar o estado do passo em que estava a transação para 'fail' quando não conseguir se conectar com API FOO", done => {
        const transacao = {
            data_compra: '2019-01-01T00:00:00.000Z',
            account_id: 265923,
            id_ingresso: "30",
            id_show: "865387",
            valor: 130,
            estado: estados.IN_PROCESS,
            passo_atual: passos.INGRESSO_SHOW,
            passo_estado: estados.IN_PROCESS,
            qtd_retentativas: 1
        }
        transacaoDb.salvar(transacao)
            .then(transacao => {
                return new Promise((resolve, reject) => {
                    // Aguarda rabbitmq subir
                    setTimeout(() => {
                        transacaoService.executar(transacao) 
                        resolve(transacao)
                    },1400)
                }) 
            })
            .then(transacao => {
                // Aguarda processamento da transação
                setTimeout(() => {
                    transacaoDb.buscarPorIdTransacao(transacao._id)
                        .then(transacao => {
                            transacao.should.have.property('estado', 'in_process')
                            transacao.should.have.property('passo_atual', 'INGRESSO_SHOW')
                            transacao.should.have.property('passo_estado', 'fail')
                            done()
                        })
                },100)
            })
            .catch(err => console.log(err))
    })
    it("Deve mudar o estado do passo em que estava a transação para 'fail' quando não conseguir se conectar com API FIGHTERS", done => {
        const transacao = {
            data_compra: '2019-01-01T00:00:00.000Z',
            account_id: 265923,
            id_ingresso: "30",
            id_show: "865387",
            valor: 130,
            estado: estados.IN_PROCESS,
            passo_atual: passos.VALOR_SHOW,
            passo_estado: estados.IN_PROCESS,
            qtd_retentativas: 1
        }
        transacaoDb.salvar(transacao)
            .then(transacao => {
                return new Promise((resolve, reject) => {
                    // Aguarda rabbitmq subir
                    setTimeout(() => {
                        transacaoService.executar(transacao) 
                        resolve(transacao)
                    },1400)
                }) 
            })
            .then(transacao => {
                // Aguarda processamento da transação
                setTimeout(() => {
                    transacaoDb.buscarPorIdTransacao(transacao._id)
                        .then(transacao => {
                            transacao.should.have.property('estado', 'in_process')
                            transacao.should.have.property('passo_atual', 'VALOR_SHOW')
                            transacao.should.have.property('passo_estado', 'fail')
                            done()
                        })
                },100)
            })
            .catch(err => console.log(err))
    })   
    it("Deve aumentar a quantidade de retentativas quando o estado do passo em que a transação está for 'fail'", done => {
        const transacao = {
            data_compra: '2019-01-01T00:00:00.000Z',
            account_id: 265923,
            id_ingresso: "30",
            id_show: "865387",
            valor: 130,
            estado: estados.IN_PROCESS,
            passo_atual: passos.INGRESSO_SHOW,
            passo_estado: estados.FAIL,
            qtd_retentativas: 1
        }
        transacaoDb.salvar(transacao)
            .then(transacao => {
                return new Promise((resolve, reject) => {
                    // Aguarda rabbitmq subir
                    setTimeout(() => {
                        transacaoService.executar(transacao) 
                        resolve(transacao)
                    },1400)
                }) 
            })
            .then(transacao => {
                // Aguarda processamento da transação
                setTimeout(() => {
                    transacaoDb.buscarPorIdTransacao(transacao._id)
                        .then(transacao => {
                            transacao.should.have.property('qtd_retentativas', 2)
                            done()
                        })
                },100)
            })
            .catch(err => console.log(err))
    })    
    it("Deve alterar transacao para estado 'fail' quando quantidade de retentativas for igual ou maior que 5", done => {
        const transacao = {
            data_compra: '2019-01-01T00:00:00.000Z',
            account_id: 265923,
            id_ingresso: "30",
            id_show: "865387",
            valor: 130,
            estado: estados.IN_PROCESS,
            passo_atual: passos.INGRESSO_SHOW,
            passo_estado: estados.IN_PROCESS,
            qtd_retentativas: 5
        }
        transacaoDb.salvar(transacao)
            .then(transacao => {
                return new Promise((resolve, reject) => {
                    transacaoService.executar(transacao) 
                    resolve(transacao)
                }) 
            })
            .then(transacao => {
                // Aguarda processamento da transação
                setTimeout(() => {
                    transacaoDb.buscarPorIdTransacao(transacao._id)
                        .then(transacao => {
                            transacao.should.have.property('passo_atual','INGRESSO_SHOW')
                            //transacao.should.have.property('passo_estado','fail')
                            transacao.should.have.property('estado','fail')
                            done()
                        })
                },1500)
            })
            .catch(err => console.log(err))
    })
    it("Deve gravar mensagem de erro quando transacao é dada como falha", done => {
        const transacao = {
            data_compra: '2019-01-01T00:00:00.000Z',
            account_id: 265923,
            id_ingresso: "30",
            id_show: "865387",
            valor: 130,
            estado: estados.IN_PROCESS,
            passo_atual: passos.INGRESSO_SHOW,
            passo_estado: estados.IN_PROCESS,
            qtd_retentativas: 5
        }
        transacaoDb.salvar(transacao)
            .then(transacao => {
                return new Promise((resolve, reject) => {
                    transacaoService.executar(transacao) 
                    resolve(transacao)
                }) 
            })
            .then(transacao => {
                // Aguarda processamento da transação
                setTimeout(() => {
                    transacaoDb.buscarPorIdTransacao(transacao._id)
                        .then(transacao => {
                            transacao.should.have.property('estado','fail')
                            transacao.should.have.property('mensagem').and.not.empty()
                            done()
                        })
                },1500)
            })
            .catch(err => console.log(err))
    })
 })

