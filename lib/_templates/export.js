module.exports = (name) => `
const C = require('./${name}')
module.exports = C
`