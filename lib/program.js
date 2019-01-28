import {get} from 'lodash'
import fs from 'fs'
import path from 'path'
import sanitize from 'sanitize-filename'
import componentTemplate from './_templates/component'
import statelessComponenentTemplate from './_templates/stateless.component'
import pageTemplate from './_templates/page'
import styleTemplate from './_templates/styles'
import exportTemplate from './_templates/export'

class CommandParser {

  constructor({rootDirName = 'src', pagesDirName = 'pages', componentsDirName = 'components'}) {
    
    this._rootDirName = rootDirName;
    this._rootPagesDirName = `${process.cwd()}/${rootDirName}/${pagesDirName}`
    this._rootComponentsDirName= `${process.cwd()}/${rootDirName}/${componentsDirName}`
    
    this._availableActions = {
      page: this.generatePage,
      component: this.generateComponent,
      service: this.generateService,
      auto: this.generateAutoScaffold
    }

    this._configureDestinationDirectories()

  }


  _configureDestinationDirectories = () => {
    [ this._rootDirName, 
      this._rootPagesDirName, 
      this._rootComponentsDirName
    ].forEach((dirName) => {
        this._createDirectory(dirName)
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
    const filePath = sanitize(name)
    const fullPath = `${this._rootComponentsDirName}/${name}`
    this._createFile(`${fullPath}/index.js`, this._getExportScaffold(filePath))
    this._createFile(`${fullPath}/${filePath}.js`, this._getComponentScaffold(filePath))
    this._createFile(`${fullPath}/${filePath}.css`, this._getCssScaffold(filePath))
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

  _createFile = (filePath, fileContent) => {
    this._createDirectory(filePath, true)
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) throw err;
      console.log(`file: ${filePath} Saved!`);
    });
  }

  _getPageScaffold = (params) => {
    return pageTemplate(params)
  }


  _getComponentScaffold = (name) => {
    return componentTemplate(name)
  }

  _getCssScaffold = (name) => {
    return styleTemplate(name)
  }

  _getExportScaffold = (name) => {
    return exportTemplate(name)
  }
}

export default CommandParser