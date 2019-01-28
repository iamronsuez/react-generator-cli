const {name, rsGeneratorConfig = {}} = require('../package.json')
const {get} = require('lodash')
const fs = require('fs')
const path = require('path')
const sanitize = require('sanitize-filename')
const {
  componentTemplate,
  statelessComponenentTemplate,
  pageTemplate,
  styleTemplate,
  exportTemplate,
  exportDefaultTemplate,
  exportDefaultComponent
} = require('./_templates')

class CommandParser {

  config = {}
  constructor({
    rootDirName = 'src', 
    pagesDirName = 'pages', 
    componentsDirName = 'components',
    cssExtensionName = 'css'
  }) {
    const rootFolder = get(rsGeneratorConfig, 'rootDirName', rootDirName)
    const cssExtension = get(rsGeneratorConfig, 'cssExtensionName', cssExtensionName)
    this._rootDirName = `${process.cwd()}/${rootFolder}`;
    this._rootPagesDirName = `${process.cwd()}/${rootFolder}/${pagesDirName}`
    this._rootComponentsDirName= `${process.cwd()}/${rootFolder}/${componentsDirName}`
    
    this._availableActions = {
      page: this.generatePage,
      component: this.generateComponent,
      service: this.generateService,
      auto: this.generateAutoScaffold
    }

    this.config = {
      cssExtensionName: cssExtension
    }
  
  }


  _configureDestinationDirectories = () => {
    [ this._rootDirName, 
      this._rootPagesDirName, 
      this._rootComponentsDirName
    ].forEach((dirName) => {
        this._createDirectory(dirName)
        this._createFile(`${dirName}/index.js`, '')
    })
  }
  getAction = (action, params) => {
    const actionFn = get(this._availableActions, action)
    if (!actionFn) {
      let message = `action ${action} is not defined`
      throw new Error(message)
    }

    return actionFn(params)
  }

  generatePage = ({
    name,
    auth: requiresAuth
  }) => {
    console.log('should generate a page', name, requiresAuth)
    const filePath = sanitize(name)
    this._createDirectory(this._rootPagesDirName)
    this._createFile(`${this._rootPagesDirName}/${name}.js`,  this._getPageScaffold({name: filePath, requiresAuth}))
  }

  generateComponent = ({name}) => {
    console.log('should generate a component', name, 'at', `${this._rootComponentsDirName}/${name}`)

    const fileName = sanitize(name)
    const fullPath = `${this._rootComponentsDirName}/${name}`

    Promise.all([
      this._createFile(`${fullPath}/index.js`, this._getExportScaffold(fileName)),
      this._createFile(`${fullPath}/${fileName}.js`, this._getComponentScaffold(fileName, this.config.cssExtensionName)),
      this._createFile(`${fullPath}/${fileName}.${this.config.cssExtensionName}`, this._getCssScaffold(fileName))
    ]).then(() => {
      // Update Main EntryPoint
      this._updateFile(`${this._rootComponentsDirName}/index.js`, this._getDefaultComponentExportScaffold(fileName, name), true)
    })
    .catch((error) => console.log(error))

  }

  generateService = () => {
    console.log('should generate a service')
  }


  generateAutoScaffold = () => {
    console.log('should get settings from app.config')
  }

  _createDirectory = (folderName, ignoreLastCoincidence) => {
    const targetDir = folderName;
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const directories = folderName.split(sep)
    const directoriesToCreate = ignoreLastCoincidence ? directories.slice(0, directories.length - 1) : directories
    directoriesToCreate.reduce((parentDir, childDir) => {
      const curDir = path.resolve(parentDir, childDir);
      if (!fs.existsSync(curDir)) {
        console.log('Created', curDir);
        fs.mkdirSync(curDir);
      }
      return curDir;
    }, initDir);
  }

  _createFile = (filePath, fileContent, shouldAppendContent = false) => {
    this._createDirectory(filePath, true)

    return new Promise((resolve, reject) => {

      if (fs.existsSync(filePath) && !shouldAppendContent) {
        return reject(`error: ${filePath} already exists`)
      }
      fs.appendFile(filePath, fileContent, (err) => {
        if (err) return reject(err);
        console.log(`file: ${filePath} Saved!`);
        return resolve()
      });
    })
    
  }


  _updateFile = (filePath, fileContent) => {
    fs.appendFile(filePath, fileContent, (err) => {
      if (err) throw err;
      console.log(`file: ${filePath} Updated!`);
    });
  }

  _getPageScaffold = (params, cssExtensionName) => {
    return pageTemplate(params, cssExtensionName)
  }


  _getComponentScaffold = (name, cssExtensionName) => {
    return componentTemplate(name, cssExtensionName)
  }

  _getCssScaffold = (name) => {
    return styleTemplate(name)
  }

  _getExportScaffold = (name) => {
    return exportTemplate(name)
  }

  _getDefaultExportScaffold = (name) => {
    return exportDefaultTemplate(name)
  }

  _getDefaultComponentExportScaffold = (fileName, filepath) => {
    return exportDefaultComponent(fileName, filepath)
  }
}

module.exports = CommandParser