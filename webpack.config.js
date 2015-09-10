
var fs = require('fs');


//checking for external bin files, as per http://jlongster.com/Backend-Apps-with-Webpack--Part-I
// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

module.exports = {
	entry: "./index.js",
	output : {
		filename : "bundle.js"
	},
	target : "node",
	module : {
		loaders : [{
			test : /\.js$/,
			exclude : /node_modules/,
			loader : 'babel-loader'
		}]
	},
	externals : nodeModules
}
