var _router = require('express').Router(),
    _path = require('path');

_router.use(function (_req, _res, _next) {
    var _routes = _getJson(_path.join(process.cwd(), "routes/index.json"));
    var _url = _req.originalUrl.split("?")[0];
    if(_routes[_url]) {
        
        _res.json(_routes[_url]);
    }
    else
        _next();
});

function _getJson (_url) {
    try{
        delete require.cache[require.resolve(_url)];
        return require(_url);
    }
    catch(_e) {
        console.warn("warn:" + _e.message);
        return {};
    }
}

module.exports = _router;