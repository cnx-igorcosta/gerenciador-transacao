import request from 'request-promise-native'

const httpPost = (uri, requestBody) => {
    const options = {
        method: 'POST',
        uri,
        body: requestBody,
        resolveWithFullResponse: true,
        json: true
    }
    return request(options)
}

const httpGet = (uri) => {
    const options = {
        method: 'GET',
        uri,
        resolveWithFullResponse: true,
        json: true
    }
    return request(options)
}

export { httpPost, httpGet }