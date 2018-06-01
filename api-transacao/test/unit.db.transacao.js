import chai from 'chai'
import should from 'should'
import Transacao from '../app/models/transacao'
import transacaoDb from '../app/db/transacao'

describe('Testes Unitários de database da API Transação.', () => {
    beforeEach(done => { //Before each test we empty the database
        Transacao.remove({}, err => {
            done()
        })
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