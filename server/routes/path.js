var _router = require('express').Router(),
    _path = require('path'),
    _fs = require('fs');

_router.use(function (_req, _res, _next) {
    var _p = process.cwd() + _req.originalUrl;
    try {
        var _files = _fs.readdirSync(_p);
    }
    catch(_e){
        _next();
        return;
    }
    
    var _filesInfo = [];
    
    for(var _i = 0; _i < _files.length; _i++) {
        
        var _info = {
            name: _files[_i]
        };
        
        var _stat = _fs.lstatSync(_p + "/" + _files[_i]);
        
        if(_stat.isFile()) {
            _info.type = 'file';
        }
        else if(_stat.isDirectory()) {
            _info.type = 'dir';
        }
        else
            continue;
        
        _filesInfo.push(_info);
        
    }
    
    _res.render("path", {
        _files: _filesInfo,
        _base: _req.originalUrl == "/"? "" : _req.originalUrl,
        _hasParentDir: _req.originalUrl == '/'? false : true
    })
});

module.exports = _router;