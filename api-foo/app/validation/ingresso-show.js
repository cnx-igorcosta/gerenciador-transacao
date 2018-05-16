let errors = []
const validar = ingressoPorShow => {
    errors = []
    return new Promise((resolve, reject) => {
        required(ingressoPorShow.id_ingresso, 'id_ingresso')
        required(ingressoPorShow.id_show, 'id_show')

        if(errors.length) reject({ errors })
        resolve(ingressoPorShow)
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