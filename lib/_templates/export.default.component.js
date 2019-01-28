module.exports = 
  (fileName, filepath) => (`export {default as ${fileName}} from './${filepath}.js'`)