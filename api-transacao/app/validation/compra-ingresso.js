import moment from 'moment'

let errors = []
const validar = compraIngresso => {
    errors = []
    return new Promise((resolve, reject) => {
        if(required(compraIngresso.data_compra, 'data_compra')) {
            // valida se é data valida
            if(validDate(compraIngresso.data_compra, 'data_compra')) {
                // valida se data é anterior a data atual
                beforeToday(compraIngresso.data_compra, 'data_compra')
            }
        }
        required(compraIngresso.account_id, 'account_id')
        required(compraIngresso.id_ingresso, 'id_ingresso')
        required(compraIngresso.id_show, 'id_show')
        required(compraIngresso.valor, 'valor')

        if(errors.length) reject({ validation_error: true, errors })
        resolve(compraIngresso)
    })
}

const required = (value, name) => {
    if(!value) {
        errors.push(`O campo ${name} é obrigatório`)
        return false
    }
    return true
}

const validDate = (value, name) => {
    if(!moment(value, 'YYYY-MM-DD').isValid()) {
        errors.push(`O campo ${name} não é uma data válida`)
        return false
    }
    return true
}

const beforeToday = (value, name) => {
    const totay = moment().format('YYYY-MM-DD')
    if(moment(value, 'YYYY-MM-DD').isBefore(totay)) {
        errors.push(`O campo ${name} não pode ser uma data anterior à data atual`)
        return false
    }
    return true
}

export default validar
