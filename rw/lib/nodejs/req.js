'use strict';

function strlen(str) {
    return new Buffer(str).length;
}

function parseRes(res, fn) {
    var data = '';
    var isText;
    var ct = res.headers['content-type'];
    if(ct && ct.match('image')) {
        isText = false;
        res.setEncoding('binary');
    }else {
        isText = true;
        res.setEncoding('utf8');
    }
    res.on('data', function(chunk) {
        data += chunk;
    });

    res.on('error', function(e) {
        if(fn) {
            fn(e, null, {statusCode: res.statusCode, headers: res.headers});
        }
    });

    res.on('end', function() {
        if(isText) {
            try {
                data = JSON.parse(data);
            }catch(e) {

            }
        }
        if(fn) {
            fn(null, data, {statusCode: res.statusCode, headers: res.headers});
        }
    });
}

var Req = function() {
    var self = this;
    var uastr = 'rw/alpha';
    var defaultOptions = {
        agent: false,
        rejectUnauthorized: false
    };
    function ajax(config, fn) {
        if(config.url[0].match(/[\dl]/)) {
            config.url = 'http://' + config.url;
        }
        var urlParsed = url.parse(config.url);
        var options = {};
        for(var key in defaultOptions) {
            options[key] = defaultOptions[key];
        }
        if(!options.header) {
            options.header = {};
        }
        if(!options.header['user-agent']) {
            options.header['user-agent'] = uastr;
        }
        options.host = urlParsed.hostname;
        options.path = urlParsed.path;
        options.method = config.method || 'get';
        if(urlParsed.port) {
            options.port = urlParsed.port;
        }
        if(config.headers) {
            for(var key in config.headers) {
                options.headers[key] = config.headers[key];
            }
        }
        var protocol = urlParsed.protocol || 'http:';
        var req;
        if(protocol == 'http:') {
            req = http.request(options);
        }else if(protocol == 'https:') {
            req = https.request(options);
        }else {
            if(fn) {
                fn('wrong protocol ' + protocol);
            }
            return;
        }
        if(config.data) {
            if(typeof(config.data) === 'string') {
                req.write(config.data);
            }else {
                console.error('data is not string');
                console.error(config.data);
            }
        }
        req.once('response', function(res) {
            if(config.stream) {
                fn(null, res);
            }else {
                parseRes(res, fn);
            }
        });
        req.on('error', function(error) {
            if(fn) {
                fn(error);
            }
        });
        req.end();
    }

    self.ajax = ajax;

    ['get', 'post', 'put', 'delete'].forEach(function(method) {
        self[method + 'Ex'] = function(url, headers, param1, param2) {
            var fn, data;
            if(!param2) {
                fn = param1;
                data = '';
            }else {
                fn = param2;
                data = param1;
            }
            if(!headers) {
                headers = {};
            }
            var config = {};
        }
    })
}


