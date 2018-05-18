import { httpPost, httpGet } from './'

const validarDuplicidadeIngresso = context => {
    const compraIngresso = context.compraIngresso
    // Se já possui id_transacao então é reprocessamento.
    // Não precisa validar duplicidade novamente
    if(compraIngresso.id_transacao) {
        return Promise.resolve(context)
    }
    
    const id_ingresso = compraIngresso.id_ingresso
    const id_show = compraIngresso.id_show

    const uri = `http://api-foo:3000/api/v1/tickets/validate?id_ingresso=${id_ingresso}&id_show=${id_show}`
    
    return new Promise((resolve, reject) => {
        httpGet(uri)
        .then(response => {
            if(response.statusCode !== 200) 
                reject(new Error('Não foi possível se comunicar com a API FOO.'))
            if(response.body && response.body.valid) {
                reject(new Error('id_ingresso por Show já existe!'))
            }
            context.ingresso_existente = false;
            resolve(context)
        })
        .catch(err => reject(err))
    })
}

const gravarIngressoPorShow = context => {
    const compraIngresso = context.compraIngresso
    const uri = 'http://api-foo:3000/api/v1/tickets'
    const ingressoPorShow = {
        id_ingresso: compraIngresso.id_ingresso,
        id_show: compraIngresso.id_show,
    }
    
    return new Promise((resolve, reject) => {
        httpPost(uri, ingressoPorShow)
            .then(response => {
                if(response.statusCode !== 200) {
                    reject(new Error('Não foi possível se comunicar com a API FOO.'))
                }
                context.ingressoPorShowGravado = true;
                resolve(context)
            })
        .catch(err => reject(err))
    })
}

export { validarDuplicidadeIngresso, gravarIngressoPorShow }