const CustomStore = require('devextreme/data/custom_store')
const { resolveHttpErro } = './axios'

/**
 * Metodo para carregar os dados
 * @param {*} http -> instancia da lib de http (exemplo axios)
 * @param {*} url -> url do endpoint
 * @param {*} filtros -> filtros
 * @param {*} instanciaVue -> instancia do vue
 * @param {*} operacoesRemotas -> se as operações de filtro e paginação são efetuadas pelo server (default = false)
 */
const carregar = async (http, url, filtros = {}, instanciaVue, operacoesRemotas = false) => {
  try {
    instanciaVue.$emit('carregandoDados')
    const { take, skip } = filtros
    const params = {
      take,
      skip
    }
    const { data } = await http.get(url, { params })

    if (operacoesRemotas && typeof take !== 'undefined') {
      return {
        data: data.data,
        totalCount: data.total
      }
    }

    return {
      data: data,
      totalCount: data.length
    }
  } catch (err) {
    return resolveHttpErro(err)
  }
}

/**
 * Metodo para inserir dados no backend
 * @param {*} http -> instancia da lib de http (exemplo axios)
 * @param {*} url -> url do endpoint
 * @param {*} dados -> dados a serem inseridos
 */
const inserir = async (http, url, dados) => {
  try {
    const resp = await http.post(url, dados)
    return resp
  } catch (err) {
    return resolveHttpErro(err)
  }
}

/**
 * Metodo para atualizar dados no backend
 * @param {*} http -> instancia da lib de http (exemplo axios)
 * @param {*} url -> url do endpoint
 * @param {*} chave -> id do objeto a ser atualizado
 * @param {*} dados -> dados a serem inseridos
 */
const atualizar = async (http, url, chave, dados) => {
  const updateUrl = `${url}${chave}/`
  try {
    const resp = await http.patch(updateUrl, dados)
    return resp
  } catch (err) {
    return resolveHttpErro(err)
  }
}

/**
 * Metodo para apagar dados no backend
 * @param {*} http -> instancia da lib de http (exemplo axios)
 * @param {*} url -> url do endpoint
 * @param {*} chave -> id do objeto a ser atualizado
 */
const apagar = async (http, url, chave) => {
  const deleteUrl = `${url}${chave}/`
  try {
    const resp = await http.delete(deleteUrl, {})
    return resp
  } catch (err) {
    return resolveHttpErro(err)
  }
}

/**
 * Metodo para criar um DevExpress CustomStore para trabalhar com django restframework como endpoint
 * @param {*} http -> instancia da lib de http (exemplo axios)
 * @param {*} instanciaVue -> instancia do vue
 * @param {*} url -> url do endpoint
 * @param {*} campoChave -> campo chave
 * @param {*} operacoesRemotas -> se as operações de filtro e paginação são efetuadas pelo server (default = false)
 */
const criarCustomStore = (http, instanciaVue, url, campoChave = 'id', operacoesRemotas = false) => {
  return new CustomStore({
    key: campoChave,
    byKey: key => carregar(http, `${url}${key}/`, instanciaVue, operacoesRemotas),
    load: loadOptions => carregar(http, url, loadOptions, instanciaVue, operacoesRemotas),
    insert: values => inserir(http, url, values, operacoesRemotas),
    update: (key, values) => atualizar(http, url, key, values, operacoesRemotas),
    remove: key => apagar(http, url, key, operacoesRemotas)
  })
}

module.exports = {
  criarCustomStore
}
