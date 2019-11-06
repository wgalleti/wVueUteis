# Uteis para projetos VueJS + Devexpress

## Axios

### adicionaToken

Adiciona token de autenticação no axios.

> PARAMETROS

* Instância do axios
* Token (Padrão DRF)

Exemplo de uso

```js
import { axios } from '@/plugins/axios'
import { axios: helps } from 'wuteisvue'

const token = 'YOURTOKEN'
helps.adicionaToken(axios, token)
```

### resolverErroHttp

Efetuar o parser dos erros enviados pelo servidor.

Exemplo de uso

```js
import { axios } from '@/plugins/axios'
import { axios: helps } from 'wuteisvue'

async function receberDados () {
  try {
    const { data } = await axios.get('yoururl').catch(err => helps.resolverErroHttp)
  } catch (err) {
    console.error(err)
  }
}
```

## DevExpress

### criarCustomStore

Cria um custom store com os metodos `load`, `byKey`, `insert`, `update`, `remove` para cruds padrões com API utilizando Django + DjangoRestFramework

> PARAMETROS

* http -> instancia da lib de http (exemplo axios)
* instanciaVue -> instancia do vue
* url -> url do endpoint
* campoChave -> campo chave
* operacoesRemotas -> se as operações de filtro e paginação são efetuadas pelo server (default = false)

### montaLookupDataSource

Metodo para retornar um DataSource paginado de um DxLookup

## Helpers

### dataHoje

Metodo para retornar data atual no formato YYYY-MM-DD (Fuso horário -4)

## Store

Aqui estão alguns métodos para facilitar a utilização com VUEX

### registrarModulos

Método para autoregistrar os módulos do store.

Não é necessário informar o namespaced.

### setState

Metodo para simplificar a construção do commit

Sem:

```js
...
commits: {
  SET_ALGO (state, payload) {
    state.algo = payload
  }
}
...
```

Com:

```js
...
commits: {
  SET_ALGO: setState('algo')
}
...
```

### carregar

Metodo para efetuar o http.get no backend com opções de filtro e paginação

> Utilizar somente em STORE

### carregarPorChave

Metodo para carregar uma unica instancia de um objeto
> PS: Utilizar somente em STORE

### salvar

Metodo para salvar dados (Geralmente instância de formulários).

Ele verifica se tem o PK informado. Caso tiver, irá enviar um patch, senão um post.

> PS: Utilizar somente em STORE

### apagar

Metodo para apagar dados
