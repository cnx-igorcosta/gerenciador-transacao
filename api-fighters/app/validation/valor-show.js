let errors = []
const validar = valorPorShow => {
    errors = []
    return new Promise((resolve, reject) => {
        required(valorPorShow.id_show, 'id_show')
        required(valorPorShow.valor, 'valor')

        if(errors.length) reject({ errors })
        resolve(valorPorShow)
    }) 
}

const required = (value, name) => {
    if(!value) {
        errors.push(`O campo ${name} é obrigatório`)
        return false
    }
    return true
}

export default validar