const camelCase = require('lodash/camelCase')
const { resolverErroHttp } = require('./axios')

/**
 * Método para autoregistrar os módulos do store.
 * Não é necessário informar o namespaced
 */
const registrarModulos = () => {
  const requireModule = require.context('../store', true, /\.js$/)
  const modules = {}

  requireModule.keys().forEach(filename => {
    if (filename === './index.js') return
    const moduleName = camelCase(filename.replace(/(\.\/|\.js)/g, ''))
    modules[moduleName] = {
      ...requireModule(filename).default,
      namespaced: true
    }
  })
  return modules
}

/**
 * Metodo para simplificar a construção do commit
 * Sem:
 * ...
 * commits: {
 *   SET_ALGO (state, payload) {
 *     state.algo = payload
 *   }
 * }
 * ...
 *
 * Com:
 * ...
 * commits: {
 *   SET_ALGO: setState('algo')
 * }
 * ...
 */
const setState = property => (state, payload) => (state[property] = payload)

/**
 * Metodo para efetuar o http.get no backend com opções de filtro e paginação
 * PS: Utilizar somente em STORE
 * @param {*} http -> instancia do axios
 * @param {*} url -> url do endpoint
 * @param {*} mutation -> commit para fazer o store (default = '')
 * @param {*} permitePaginacao -> permite paginação no server (default = false)
 * @param {*} filtraFilial -> se irá filtrar a filial na requisição (default = false)
 */
const carregar = (http, url, mutation = '', permitePaginacao = false, filtraFilial = false) =>
  async ({ rootState, commit }, filtro = {}) => {
    if (filtraFilial) {
      const { filial } = rootState.session
      filtro['filial'] = filial
    }

    const { data } = await http.get(url, { params: filtro }).catch(err => resolverErroHttp(err))

    if (mutation !== '') {
      commit(mutation, data)
    }

    if (permitePaginacao) {
      return data.data
    }

    return data
  }

/**
 * Metodo para carregar uma unica instancia de um objeto
 * PS: Utilizar somente em STORE
 * @param {*} http -> instancia do axios
 * @param {*} url -> url do endpoint
 */
const carregarPorChave = (http, url) =>
  async (context, key) => {
    const urlKey = `${url}${key}/`
    const { data } = await http.get(urlKey).catch(err => resolverErroHttp(err))
    return data
  }

/**
 * Metodo para salvar dados (Geralmente instância de formulários)
 * Ele verifica se tem o PK informado. Caso tiver, irá enviar um patch, senão um post
 * PS: Utilizar somente em STORE
 * @param {*} http -> instancia do axios
 * @param {*} url -> url do endpoint
 * @param {*} pk -> campo de PK (default = 'id')
 * @param {*} salvaFilial -> se é para salvar a filial (default = false)
 */
const salvar = (http, url, pk = 'id', salvaFilial = false) =>
  ({ rootState }, form) => {
    if (salvaFilial) {
      const { filial } = rootState.session
      form['filial'] = filial
    }
    if (form[pk]) {
      const urlPk = `${url}${form[pk]}/`
      return http.patch(urlPk, form).catch(err => resolverErroHttp(err))
    }
    return http.post(url, form).catch(err => resolverErroHttp(err))
  }

/**
 * Metodo para apagar dados
 * PS: Utilizar somente em STORE
 * @param {*} http -> instancia do axios
 * @param {*} url -> url do endpoint
 */
const apagar = (http, url) => (context, id) =>
  http.delete(`${url}${id}/`).catch(err => resolverErroHttp(err))

module.exports = {
  setState,
  registrarModulos,
  carregar,
  carregarPorChave,
  salvar,
  apagar
}
