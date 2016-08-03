var _express = require('express'),
    _router = _express.Router(),
    _ftl = require('../freemarker/index'),
    _path = require('path'),
     _cheerio = require('cheerio');

var _commonDataUrl = _path.join(process.cwd(), "./data/data.json");

_router.use(/\S+\.ftl/, function (_req, _res, _next) {
    var _dataUrl = _path.join(process.cwd(), "./data" + _req.originalUrl.slice(0, -3) + "json");
    var _commonData = _getJson(_commonDataUrl);
    
    var _data = _getJson(_dataUrl);
    
    Object.assign(_commonData, _data);
    
    _ftl(_path.join(process.cwd(), "WEB-INF/template/"))._$render("WEB-INF/template/" + _req.originalUrl.slice(1),
                                 _commonData,
                                 function (_err, _html) {
        if(_err) {
            _res.end(_err);
        }
        else {
            var _$ = _cheerio.load(_html);
            if(_$('body').length > 0) {
                _$('body').append('<script src="/server/public/socket.io.js"></script><script src="/server/public/main.js"></script>')
            }
            
            _res.end(new Buffer(_$.html()));
        }
    });
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