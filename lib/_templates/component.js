module.exports = (name, cssExtension) => (`
import React from 'react'
import PropTypes from 'propt-types'
import ${name} from './${name}.${cssExtension}'

class ${name} extends React.Component {
  render() {
    return (<div> ${name} </div>)
  }
}

${name}.propTypes = {}

${name}.defaultProps = {}

export default ${name}
`)