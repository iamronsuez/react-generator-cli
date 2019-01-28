module.exports = (name, cssExtension) => (`
import React from 'react'
import PropTypes from 'propt-types'
import ${name} from './${name}.${cssExtension}'

const ${name} = () => {
  return (
    <div>${name} component </div>
  )
}

${name}.propTypes = {}

${name}.defaultProps = {}

export default ${name}
`)