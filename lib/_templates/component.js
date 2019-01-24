module.exports = (name) => (`
import React from 'react'
import PropTypes from 'propt-types'
class ${name} extends React.Component {
  render() {
    return (<div> ${name} </div>)
  }
}

${name}.propTypes = {}

${name}.defaultProps = {}

export default ${name}
`)