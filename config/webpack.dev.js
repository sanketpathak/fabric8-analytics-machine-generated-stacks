/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cloneDeep = require('lodash/cloneDeep');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV || process.env.NODE_ENV || 'development';
// if env is 'inmemory', the inmemory debug resource is used
const API_URL = process.env.API_URL || (ENV === 'inmemory' ? 'app/' : 'http://localhost:8080/api/');
const FORGE_URL = process.env.FORGE_URL || 'http://localhost:8080/forge';
const FABRIC8_WIT_API_URL = process.env.FABRIC8_WIT_API_URL || 'http://localhost:8080/api/';
const FABRIC8_RECOMMENDER_API_URL = process.env.FABRIC8_RECOMMENDER_API_URL;
const FABRIC8_FORGE_URL = process.env.FABRIC8_FORGE_URL;
const FABRIC8_REALM = process.env.FABRIC8_REALM || 'fabric8';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const STACK_API_TOKEN = process.env.STACK_API_TOKEN;
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
const extractSASS = new ExtractTextPlugin('stylesheets/[name].scss');

// const OSO_CORS_PROXY = {
//   target: `https://${process.env.KUBERNETES_SERVICE_HOST}:${process.env.KUBERNETES_SERVICE_PORT}`,
//   // Remove our prefix from the forwarded path
//   pathRewrite: { '^/_p/oso': '' },
//   // Disable cert checks for dev only
//   secure: false,
//   //changeOrigin: true,
//   logLevel: "debug",
//     onProxyRes: function (proxyRes, req, res) {
//     proxyRes.headers['Access-Control-Allow-Origin'] = '*';
//   },
// };

const METADATA = webpackMerge(commonConfig.metadata, {
  API_URL: API_URL,
  ENV: ENV,
  FABRIC8_REALM: FABRIC8_REALM,
  FORGE_URL: FORGE_URL,
  FABRIC8_WIT_API_URL: FABRIC8_WIT_API_URL,
  FABRIC8_RECOMMENDER_API_URL: FABRIC8_RECOMMENDER_API_URL,
  FABRIC8_FORGE_URL: FABRIC8_FORGE_URL,
  STACK_API_TOKEN: STACK_API_TOKEN,
  PUBLIC_PATH: PUBLIC_PATH
});

//console.log(helpers.nodeModulePath('fabric8-planner'));

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  console.log('The merged metadata:', METADATA);
  return webpackMerge(commonConfig, {

    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: 'source-map',

    entry: {
      'polyfills': './src/polyfills.ts',
      'vendor': './src/vendor.ts',
      'app': './src/main.ts'
    },

    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {

      /**
       * The output directory as absolute path (required).
       *
       * See: http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist'),

      publicPath: METADATA.PUBLIC_PATH,

      /**
       * Specifies the name of each output file on disk.
       * IMPORTANT: You must not specify an absolute path here!
       *
       * See: http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files.
       * They are inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[name].map',

      /** The filename of non-entry chunks as relative path
       * inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].chunk.js',

      library: 'ac_[name]',

      libraryTarget: 'var'
    },


    plugins: [
       new DashboardPlugin(),
      extractCSS,
      extractSASS,
      
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'API_URL': JSON.stringify(METADATA.API_URL),
          'FORGE_URL': JSON.stringify(METADATA.FORGE_URL),
          'PUBLIC_PATH': JSON.stringify(METADATA.PUBLIC_PATH),
          'FABRIC8_REALM': JSON.stringify(METADATA.FABRIC8_REALM),
          'STACK_API_TOKEN': JSON.stringify(METADATA.STACK_API_TOKEN),
          'FABRIC8_RECOMMENDER_API': JSON.stringify(METADATA.FABRIC8_RECOMMENDER_API_URL)
        }
      }),

      /**
       * Plugin: NamedModulesPlugin (experimental)
       * Description: Uses file names as module name.
       *
       * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
       */
      new NamedModulesPlugin(),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: true,
        options: {

          /**
           * Static analysis linter for TypeScript advanced options configuration
           * Description: An extensible linter for the TypeScript language.
           *
           * See: https://github.com/wbuchwalter/tslint-loader
           */
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src'
          }

        }
      })

    ],

    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * See: https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      historyApiFallback: {
        disableDotRule: true,
      },
      watchOptions: {
        aggregateTimeout: 2000
      }
    },

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
};
