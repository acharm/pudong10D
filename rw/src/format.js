'use strict';

var fs = require('fs');

module.exports = {
    readConfigs: readConfigs,
    extendConfigs:extendConfigs,
    forma: format
}

function readConfigs() {
    var self = this;

    // begin with project.json
    console.log('read project.json');
    if(!fs.existsSync(self.projectDir + '/project.json')) {
        return self.error('no project.json');
    }
    var projectJson = libFile.readJSON(self.projectDir + 'project.json');

    self.global.project = projectJson;
}

function extendConfigs() {
    var self = this;
    console.log(self.navpaths);
    // extend global again (because walk may overwrite global)
    if(self.task != 'main') {
        libObject.extend(self.global, libFile.readJSON(self.task + '.json'));
    }
    // format twice
    if(format.call(self, 'global', self, self.formats)) {
        return 1;
    }
    if(!fs.existsSync(self.global.project.target)) {
        libFile.mkdirpSync(self.global.project.target);
    }
    fs.writeFileSync(self.global.project.target + '/disp.global.json', JSON.stringify(self.global, undefined, 2));
    return 0;
}

function format(key1, parent, formatJson) {
    var self = this;
    if(typeof(formatJson) != 'object') {
        formatJson = {
            $type: typeof(formatJson),
            $default: formatJson
        }
    }
}


