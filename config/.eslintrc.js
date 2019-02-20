module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parser": "babel-eslint",
  "globals": {
    "window": true,
    "document": true,
    "module": true,
    "require": true
  },
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": ["html"],
  "rules": {
    "react/prop-types": "on",
    "no-console": "off",
    "react/display-name": 0
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  }
}