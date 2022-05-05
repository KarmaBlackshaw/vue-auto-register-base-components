/**

Usage:

import baseComponents from '@/plugins/baseComponents'

app.use(baseComponents)

 */

// libs
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

// helpers
const pipe = (initial, fns) => fns.reduce((v, f) => f(v), initial)

export default {
  install: (app, ops = {}) => {
    const options = Object.assign({
      // The relative path of the components folder
      path: '../components',
      // Whether or not to look in subfolders
      deep: true,
      // The regular expression used to match base component filenames
      regex: /Base[A-Z]\w+\.(vue|js)$/
    }, ops)

    const requireComponent = require.context(options.path, options.deep, options.regex)

    requireComponent.keys().forEach(fileName => {
      // Get component config
      const componentConfig = requireComponent(fileName)

      // Get PascalCase name of component
      const componentName = pipe(fileName, [
        val => val.split('/'),
        val => val.pop(),
        val => val.replace(/\.\w+$/, ''),
        val => camelCase(val),
        val => upperFirst(val)
      ])

      // Register component globally
      app.component(componentName, componentConfig.default)
    })
  }
}