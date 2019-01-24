module.exports = ({name, requiresAuth}) => (`
import React from 'react'
import PropTypes from 'propt-types'
class ${name} extends React.Component {
  render() {
    return (<div> ${name} </div>)
  }
}

${name}.routeSettings = {
  requiresAuth: ${requiresAuth},
  page: '${name}',
  path: '${name}'
}

${name}.propTypes = {}

${name}.defaultProps = {}

export default ${name}
`)