var 
    _express = require('express'),
    _app = _express(),
    _path = require('path'),
    _server = require('http').createServer(_app),
    _io = require('./routes/io'),
    _others = require('./routes/others');

var _ftlRouter = require('./routes/ftl');

//服务器上存放的文件
_app.use('/server', _express.static(_path.join(__dirname, "..")));


_app.use(_express.static(process.cwd()));

_io(_server);

_app.use(_ftlRouter);

_app.use(_others);

_server.listen(3000);

         
        