const path = require('path');

const prod = {
    mode: 'production',
    entry: './storybook/stories/LightAutocomplete/index.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'LightAutocomplete.js',
        library: "LightAutocomplete",
        libraryTarget: "umd"
    },
    resolve: {
        modules: ['.', 'node_modules'],
        extensions: ['', '.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', "@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
                ],
            },
        ]
    },
    externals: {
        'react': {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React'
        },
        'react-dom': {
          commonjs: 'react-dom',
          commonjs2: 'react-dom',
          amd: 'ReactDOM',
          root: 'ReactDOM'
        }    
    },
    devtool: 'source-map',
};

console.log('----------------> webpackk PRODUCTION', JSON.stringify(prod, null ,4))

module.exports = prod;