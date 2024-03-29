const withAntdLess = require("next-plugin-antd-less");

module.exports = withAntdLess({
  // optional: you can modify antd less variables directly here
  // modifyVars: { '@primary-color': '#e0007b' },
  // Or better still you can specify a path to a file
  lessVarsFilePath: "./src/css/variables.less",
  // optional
  lessVarsFilePathAppendToEndOfContent: false,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // Other Config Here...

  webpack(config) {
    return config;
  },
});
