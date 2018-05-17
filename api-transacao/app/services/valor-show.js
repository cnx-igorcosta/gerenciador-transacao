import { httpPost } from './'

const gravarValorPorShow = context => {
    const compraIngresso = context.compraIngresso
    const uri = 'http://api-fighters:4000/api/v1/valores'
    const valorPorShow = {
        id_show: compraIngresso.id_show,
        valor: compraIngresso.valor
    }
    return new Promise((resolve, reject) => {
        httpPost(uri, valorPorShow)
            .then(response => {
                if(response.statusCode !== 200) 
                    reject(new Error('Não foi possível se comunicar com a API FIGHTERS.'))
                resolve(context)
            })
            .catch(err => reject(err))
    })
}

export { gravarValorPorShow }