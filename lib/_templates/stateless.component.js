module.exports = (name) => (`
import React from 'react'
import PropTypes from 'propt-types'
import ${name} from './${name}'

const ${name} = () => {
  return (
    <div>${name} component </div>
  )
}

${name}.propTypes = {}

${name}.defaultProps = {}

export default ${name}
`)