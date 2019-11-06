
/**
 * Incorpora o token no axios
 */
const adicionaToken = (http, token = null) => {
  delete http.defaults.headers['Authorization']
  if (token !== null) {
    http.defaults.headers['Authorization'] = 'Token ' + token
  }
}

/**
 * Resolve os erros para listar a mensagem que veio do backend
 */
const resolverErroHttp = error => {
  if (error.response) {
    if (error.response.status === 400 || error.response.status === 404 || error.response.status === 500) {
      const data = error.response.data
      Object.keys(data).forEach(m => {
        if (Array.isArray(data[m])) {
          data[m].forEach(k => {
            throw new Error(`${m}: ${k}`)
          })
        } else {
          throw new Error(`${m}: ${data[m]}`)
        }
      })
    }
  } else if (error.request) {
    throw new Error(error.request)
  } else {
    throw new Error(error.message)
  }
}

module.exports = {
  adicionaToken,
  resolverErroHttp
}
