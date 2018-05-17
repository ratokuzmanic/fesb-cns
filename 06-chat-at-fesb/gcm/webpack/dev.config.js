const path = require('path')
const webpack = require('webpack')

// Sharing config data between server and the client
// (default.json -> client.json)
const config = require('config')
const fs = require('fs')
fs.writeFileSync(
    path.resolve('config/client.json'), 
    JSON.stringify(config)
)

const CONFIG = {
    target: 'electron-main',

    srcDir: './',
    targetDir: 'public',
    entries: ['app'],

    styleLoaders: [
            'style-loader', 
            'css-loader',
            'sass-loader?sourceMap'
    ],
}

const getEntry = () => {
    let entry = {
        vendor: ['react', 'react-dom']
    }

    CONFIG.entries.forEach(_entry => {
        entry =  {
            ...entry,
            [_entry]: path.join(_entry, 'index.js')
        }
    })
    
    return entry
}

const getOutput = () => ({
    path: path.resolve(CONFIG.targetDir),
    filename: '[name].js'
})

const getStyleLoaders = () => CONFIG.styleLoaders

module.exports = {
    target: CONFIG.target,

    context: path.resolve(CONFIG.srcDir),
    
    entry: getEntry(),

    output: getOutput(),

    resolve: { 
        modules: [path.resolve(CONFIG.srcDir), 'node_modules'],
        alias: { config: path.resolve('config/client.json') }
    },

    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['env', 'react'],
                    plugins: [
                        'transform-object-rest-spread',
                        'transform-class-properties',
                        'transform-runtime'
                    ]
                },

            },

            {   
                test: /\.(css|scss)$/,                
                use: getStyleLoaders()
            },
            
            {
                test: /\.svg$/,
                loader: 'url-loader'
            }            
        ]
    },

    devtool: 'source-map',
    
    devServer: {
        // We're using Hot Module Replacement
        hot: true,
        contentBase: CONFIG.targetDir,
        compress: true,
        stats: 'minimal',
        port: 3000
    }    
}