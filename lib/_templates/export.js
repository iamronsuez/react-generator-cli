module.exports = (name) => `
const C = require('./${name}').default
module.exports = C
`