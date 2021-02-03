const argv = require('yargs')
    .option('m', {
        alias: 'mock',
        describe: 'mock环境',
        type: 'boolean'
    })
    .alias('m', 'mock')
    .alias('h', 'help')
    .help('h').argv;

 module.exports = argv;
 