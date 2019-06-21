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
    "react/display-name": 0,
    "no-unused-vars": 1,  // 未使用变量检测开启，warning级别
    "no-undef": 2,  // 未定义变量检测开启，error级别
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  }
}