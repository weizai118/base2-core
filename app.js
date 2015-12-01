var express     = require('express');
var bodyparser  = require('body-parser');
var path        = require('path');
var mount       = require('mount-routes');
var app         = express();

module.exports = function (config) {
  var deepExtend = require('deep-extend');
  deepExtend(app, {
    express: express
  });
  
  if(app.debug){
    app.set('root', path.join(__dirname, '../..'));
  }else{
    // xx/node_modules/base2/.
    app.set('root', path.join(__dirname, '../..'));
  }
  
  deepExtend(app, config);
  
  // hook_pre
  hook_pre(config);

  // settings
  _settings(app);
  
  // global middlewares
  _global_middlewares(app);
  
  // routes
  _routes(app);

  // hook_post
  hook_post(config);
  
  return app;
};

/**
 * basic settings
 */ 
function _settings(app){
  app.set('port', 8001);
  
}

/**
 * global middlewares
 */ 
function _global_middlewares(app){
  app.use('/public', express.static(path.join(__dirname, '../public')));
  app.use(bodyparser.urlencoded({ extended: false }));
  
  require('./lib')(app);
}

/**
 * routes
 */ 
function _routes(app){
  app.mount_routes = function (path) {
    // with path & api dump
    // console.log(app);
    // console.log(this);
    mount(this, path, true);
  }
}

function __set(app, k, v, default_v){
  app.set('port', v ? v : default_v);
}

function __call(config,key){
  if (config[key]) {
    config[key]();
  }
}

function hook_post(config){
   __call(config,'post')
}

function hook_pre(config){
   __call(config,'pre')
}