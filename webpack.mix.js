let mix = require('laravel-mix');

mix.ts('script.ts', 'dist')
    .setPublicPath('dist')
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|AppData)/,
                    use: 'ts-loader'
                }
            ]
        }
    });
