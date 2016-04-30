/**
 * Created by eritikass on 30/04/16.
 */


var args = {}
process.argv.forEach(function (val, index, array) {
    if (val.substr(0, 1) == '-' && val.substr(1)) {
        args[val.substr(1)] = 'x'
        var nextIndex = index+1
        if (array[nextIndex] && array[nextIndex].substr(0, 1) != '-') {
            args[val.substr(1)] =  array[nextIndex]
        }
    }
})

var context = {
    'fail': function (msg) {
        console.log('-----errror----')
        console.log('fail>', msg)
    },
    'done': function (err, msg) {
        console.log('----success-----')
        console.log('done>', err, msg)
    }
}

var lamba = require('./index')

lamba.handler({
    "type": args.e || 'deploy',
    "project": {
        "name": args.p || 'test'
    }
}, context)