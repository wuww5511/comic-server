var 
    _express = require('express'),
    _app = _express(),
    _path = require('path'),
    _server = require('http').createServer(_app),
    _io = require('./routes/io'),
    _others = require('./routes/others'),
    _pathRouter = require('./routes/path'),
    _ftlRouter = require('./routes/ftl'),
    _exec = (require("child_process")).exec;

var _port = 3000;

_app.set('view engine', 'ejs');
_app.set('views', _path.join(__dirname, './views'));

if(process.argv[2] && +process.argv[2] != NaN) {
    _port = +process.argv[2];
}

_io(_server);

_app.use(_ftlRouter);

_app.use(_others);

_app.use(_pathRouter);

//服务器上存放的文件
_app.use('/server', _express.static(_path.join(__dirname, "..")));

_app.use(_express.static(process.cwd()));

_server.listen(_port);

_openBrowser("http://localhost:" + _port);

function _openBrowser(target, callback) {
      var map, opener;
      map = {
        'darwin': 'open',
        'win32': 'start '
      };
      opener = map[process.platform] || 'xdg-open';
      return _exec("" + opener + " " + target, callback);
}

         
        