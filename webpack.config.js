const path = require('path');
const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// dev server configuration
const devServerConfiguration = {
  host: 'localhost',
  port: 8080,
  open: 'external',
  reload: false,
  watch: true,
  notify: true,
  reloadDelay: 0,
};

// eslint-disable-next-line no-unused-vars
module.exports = function (env, args) {

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: './js/index.bundle.js',
    },
    // Defined to simplify complicated relative DIR addressing
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      }
    },
    // Generate sourcemaps for proper error messages
    devtool: 'source-map',
    performance: {
      // Turn off size warnings for entry points
      hints: false,
    },
    stats: {
      // Turn off information about the built modules.
      modules: false,
      colors: true,
    },
    /// -------
    /// MODULES
    /// -------
    module: {
      rules: [
        {
          test: /\.(html)$/,
          use: {
            loader: "html-srcsets-loader",
            options: {
              attrs: [":src", ':srcset'],
              interpolate: true,
              minimize: false,
              removeComments: false,
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: true,
                publicPath: '../',
              }
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true
              }
            },
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: {
                    'autoprefixer': {},
                  },
                },
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            },
          ],
        },
        {
          test: /\.(js)$/,
          loader: 'babel-loader',
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext]',
          },
        },
        {
          test: /(favicon\.ico|site\.webmanifest|browserconfig\.xml|robots\.txt|humans\.txt)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|flf|eot)(\?[a-z0-9=.]+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name]-[hash][ext][query]',
          }
        },
      ],
    },
    /// -------
    /// PLUGINS
    /// -------
    plugins: [
      // sync html files dynamically
      ...glob.sync('src/html/**/*.html').map(fileName => {
        return new HtmlWebpackPlugin({
          template: fileName,
          minify: false, // Disable minification during production mode
          filename: fileName.replace("src/html/", ""),
          hash: true,
        });
      }),
      new BrowserSyncPlugin({
          ...devServerConfiguration,
          server: {
            baseDir: ['dist']
          },
          files: [path.resolve(__dirname, 'src/**/*')],
          ghostMode: {
            location: false,
          },
          injectChanges: true,
          logFileChanges: true,
        },
        {
          // prevent BrowserSync from reloading the page
          // and let Webpack Dev Server take care of this
          reload: false
        }),
      new ESLintPlugin({
        emitError: true,
        emitWarning: true,
        context: path.resolve(__dirname, 'src/scripts'),
      }),
      new StylelintPlugin({
        emitErrors: true,
        emitWarning: true,
        configFile: path.resolve(__dirname, '.stylelintrc.js'),
        context: path.resolve(__dirname, 'src/assets/styles'),
      }),
      new MiniCssExtractPlugin({
        filename: './css/styles.css',
        experimentalUseImportModule: false
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/figlet/fonts/*/**'),
            to: path.resolve(__dirname, 'dist/fonts'),
            context: path.resolve(__dirname, 'node_modules/figlet/fonts'),
          },
        ]
      })
    ]
  }

}

// Read this
// eslint-disable-next-line no-console
console.log(
  '\x1b[41m\x1b[38m%s\x1b[0m',
  '\n[REMEMBER TO RESTART THE SERVER WHEN YOU ADD A NEW HTML FILE.]\n'
);
