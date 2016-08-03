var _url = "";

var _scripts = document.getElementsByTagName('script');

var _reg = /^(\S*)\/public\/dist\/reload.js/;

for(var _i = 0; _i < _scripts.length; _i++) {
    if(_reg.test(_scripts[_i].src)){
        _url = RegExp.$1;
        break;
    }
}

var _socket = io(_url);
    
_socket.on('reload', function () {
    console.log('reload');
    _delayReload();
});

var _reloadHandle = null,
    _onlyCss = true;

function _delayReload (_isCss) {
    if(!_isCss) _onlyCss = false;
    if(_reloadHandle) return;
    _reloadHandle = setTimeout(function () {
        _reload(_onlyCss);
        _reloadHandle = null;
        _onlyCss = true;
    }, 500);
}

function _reload (_onlyCss) {
    if(_onlyCss) {
        _reloadCss();
        return;
    }
    location.reload();
}

function _reloadCss () {
    var _links = document.getElementsByTagName('link');
    for(var _i = 0; _i < _links.length; _i++) {
        var _href = _links[_i].getAttribute('href');
        if(_href) {
            var _realHref = _href.split('?')[0];
            _links[_i].setAttribute('href', _realHref + "?timestamp=" + (+new Date()));
        }
    }
}