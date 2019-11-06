/**
 * Função para retornar data atual no formato YYYY-MM-DD (Fuso horário -4)
 */
const dataHoje = () => {
  const nowDate = new Date()
  return new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
}

module.exports = {
  dataHoje
}
