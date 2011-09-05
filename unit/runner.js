

var requirejs  = require('requirejs'),
    mootools   = require('mootools'),
    _          = requirejs('underscore'),
    testrunner = require('nodeunit'),
    reporter   = require('./module_reporter.js');
    
var manager = requirejs(__dirname + "/../platform/base/ClassManager.js");
ClassManager = manager.ClassManager;
createOrReturn = manager.createOrReturn;

requirejs({
    
    baseUrl : __dirname + "/..",
    paths: {
        "platform" : __dirname + "/../platform",
        "unit" : __dirname
    }
});

requirejs(['unit/tests/definition'], function(testCase){

    reporter.run([testCase]);  
});

//testrunner.run(['tests/definition.js']);