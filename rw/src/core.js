'use strict';

var path = require('path');
var format = require('./format');
var nav = require('./nav');
var walk = require('./walk');
var gen = require('./gen');
var post = require('./post');

module.exports = Rw;
function Rw() {
    var config, errorFn;
    switch(arguments.length) {
        case 0: 
            config = {}, 
            errorFn = function(err) { 
                console.error(err); 
                return 1;
            };
            break;
        case 1: 
            config = {}, errorFn = arguments[0];
            break;
        case 2:
            config = arguments[0], errorFn = arguments[1];
            break;
        default:
            console.error('Rw with wrong args');
    }
    var self = this;
    // the dir contains your project and project.json
    self.projectDir = config.projectDir || path.resolve('.');
    // the dir contains rw librarys
    self.rootDir = config.rootDir || path.resolve(__dirname + '/..');
    // select the task;
    self.task = config.task || 'main';

    self.global = {};
    self.formats = {};
    self.froms = {};
    self.tmpls = {};

    self.archs = {};
    self.navpaths = {};
    self.prevFilelist = {};
    self.filelist = {};
    self.global.bin = process.argv[1];
    var dead = false;
    self.error = function() {
        dead = true;
        errorFn.apply(self, arguments);
        return 1;
    }
    var steps = {
        'readConfigs': format.readConfigs,  // generate global
        'getNavPaths': nav.getNavPaths,     // get navpaths
        'readRwJsons': walk.readRwJsons,
        'getNavPaths2': nav.getNavPaths,
        'extendConfigs': format.extendConfigs,
        'readFileList': walk.readFileList,
        'genFiles': gen.genFiles,
        'postRun': post.run
    }
    for(var step in steps) {
        if(dead) break;
        console.info(step);
        if(!steps[step].apply(self)) {
            console.info('-->success~!');
        }
    }
}
