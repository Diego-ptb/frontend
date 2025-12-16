const webpack = require('webpack');

module.exports = function (config) {
  config.set({
    // Framework a usar
    frameworks: ['jasmine'],

    // Archivos de pruebas (solo tests)
    files: [
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx'
    ],

    // Archivos a excluir
    exclude: [],

    // Preprocesadores (solo para los tests)
    preprocessors: {
      'src/**/*.spec.ts': ['webpack'],
      'src/**/*.spec.tsx': ['webpack']
    },

    // Configuración de webpack para Karma
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react',
                    '@babel/preset-typescript'
                ]
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js']
      },
      plugins: [
        new webpack.DefinePlugin({
          'import.meta': '({env: { VITE_API_BASE_URL: "" }})'
        })
      ]
    },

    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    },

    // Reporteros
    reporters: ['progress'],

    // Puerto del servidor
    port: 9876,

    // Colores en consola
    colors: true,

    // Nivel de logging
    logLevel: config.LOG_INFO,

    // Observa cambios (desactivado para ejecuciones CI/one-shot)
    autoWatch: false,

    // Navegador para ejecutar los tests
    browsers: ['ChromeHeadless'],

    // Ejecución única (true para que Karma salga tras completar los tests)
    singleRun: true,

    // Timeouts
    browserNoActivityTimeout: 30000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,

    // Concurrencia
    concurrency: Infinity
  });
};