module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true
    },
    plugins: ['react'],
    globals: {
        test: true,
        expect: true,
        "__MOCK__": false
    }
}
