var _express = require('express'),
    _router = _express.Router(),
    _ftl = require('../freemarker/index'),
    _path = require('path'),
     _cheerio = require('cheerio'),
    _querystring = require('querystring');

var _commonDataUrl = _path.join(process.cwd(), "./data/data.json");

_router.use(/\S+\.ftl/, function (_req, _res, _next) {
    
    var _urlData = _getUrlData(_req.originalUrl);
    
    var _data = _getInputData(_urlData.path, _urlData.query);
    
    _ftl(_path.join(process.cwd(), "WEB-INF/template/"))
        ._$render( _urlData.path.slice(1), _data, _onRender.bind(null, _req, _res, _next));
    
    
});

function _onRender (_req, _res, _next, _err, _html) {
    
    if(_err) {
        _res.end(_err);
    }
    else {
        var _$ = _cheerio.load(_html);
        if(_$('body').length > 0) {
            _$('body').append('<script src="/server/public/socket.io.js"></script><script src="/server/public/main.js"></script>')
        }
        _res.setHeader("Content-Type", "text/html;charset=utf-8")
        _res.end(new Buffer(_$.html()));
    }
}

/**
 *  获取json文件中的数据。不使用缓存
 */
function _getJson (_url) {
    try{
        delete require.cache[require.resolve(_url)];
        return require(_url);
    }
    catch(_e) {
        return {};
    }
}

/**
 *  获取URL中的数据
 *  @return {Object}
 *      -   path {String}
 *      -   query {Object}
 */
function _getUrlData (_url) {
    
    var _query = "",
        _path = _url;
    
    if(_url.indexOf('?') >= 0) {
        _path = _url.split('?')[0];
        _query = _url.split('?')[1];
    }
    
    return {
        path: _path,
        query: _querystring.parse(_query)
    };
}

/**
 *  获取模板的输入数据
 *  @param {String} URL中的path
 *  @param {Object} URL中的query
 *  @return {Object}
 */
function _getInputData (_pathname, _query) {
    
    var _specificUrl = _path.join(process.cwd(),
                                "./data" + '/' + _pathname.split('/').slice(3).join('/').slice(0, -3) + "json");
    
    var _commonData = _getJson(_commonDataUrl);
    
    var _specificData = _getJson(_specificUrl);
    
    var _res = Object.assign(_commonData, _specificData);
    
    _res.params || (_res.params = {});
    
    Object.assign(_res.params, _query);
    
    return _res;
    
}

module.exports = _router;