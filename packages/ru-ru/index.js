const { Schema } = require('koishi')

module.exports.filter = false
module.exports.Config = Schema.object({})
module.exports.apply = (ctx) => {
  ctx.i18n.define('ru-RU', require('./translation'))
}
