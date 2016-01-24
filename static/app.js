/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../static/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Game = __webpack_require__(1);
	
	var _AssetManager = __webpack_require__(8);
	
	var $ = window.jQuery;
	var SpaceGophers = new _Game.Game();
	var Manager = new _AssetManager.AssetManager(SpaceGophers.stage, SpaceGophers.stage.canvas.width, SpaceGophers.stage.canvas.height);
	var conn = undefined;
	var initialized = false;
	
	function WSClose(e) {
	  console.log('Connection closed');
	}
	
	function WSMessage(e) {
	  var data = JSON.parse(e.data);
	
	  if (data.type === 'init') {
	    // Store the user's ID so we know which
	    // Gopher belongs to this socket
	    SpaceGophers.setUserId(data.i);
	  }
	
	  if (data.type === 'state' && initialized === true) {
	    SpaceGophers.UpdateStage(data);
	  }
	}
	
	function WSOpen(e) {
	  // console.log('Connection opened to game: ');
	  Manager.setDownloadCompleted(function () {
	    initialized = true;
	    SpaceGophers.InitStage(Manager, conn);
	  });
	
	  Manager.StartDownload();
	}
	
	function joinGame(gameID) {
	  conn = new WebSocket(window.wspath + gameID + '/ws');
	
	  conn.onclose = WSClose;
	  conn.onmessage = WSMessage;
	  conn.onopen = WSOpen;
	}
	
	document.addEventListener('DOMContentLoaded', function () {
	  if (window['WebSocket']) {
	
	    if (window.location.hash && window.location.hash.length > 0) {
	      var gameID = window.location.hash.substring(1);
	
	      joinGame(gameID);
	    } else {
	
	      $.ajax({
	        method: 'POST',
	        url: '/',
	        dataType: 'json'
	      }).done(function (data) {
	        window.location.hash = '#' + data.id;
	        joinGame(data.id);
	      });
	    }
	  } else {
	    console.log('Your browser does not support WebSockets');
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _Gophers = __webpack_require__(2);
	
	var createjs = window.createjs;
	
	var Game = (function (_Object) {
	  _inherits(Game, _Object);
	
	  function Game() {
	    _classCallCheck(this, Game);
	
	    _get(Object.getPrototypeOf(Game.prototype), 'constructor', this).call(this);
	    this.count = 0;
	    this.stage = new createjs.Stage('spaceGophers');
	    this.manager = null;
	    this.conn = null;
	    this.gophersOnStage = [];
	    this.state = {};
	  }
	
	  _createClass(Game, [{
	    key: 'setUserId',
	    value: function setUserId(userID) {
	      this._userID = userID;
	    }
	  }, {
	    key: 'tick',
	    value: function tick(event) {
	      var gophers = this.state.gophers;
	      var shots = this.state.shots;
	      var u = undefined;
	      var g = undefined;
	      var r = undefined;
	
	      // Update our User's gopher first
	      for (u = gophers.length - 1; u >= 0; u--) {
	        if (gophers[u].i === this._userID && this.gophersOnStage[u].update !== undefined) {
	          this.gophersOnStage[u].update({
	            x: gophers[u].p.x,
	            y: gophers[u].p.y
	          });
	          break;
	        }
	      };
	
	      // Loop through all of the gophers
	      for (g = gophers.length - 1; g >= 0; g--) {
	        var exists = null;
	
	        // As long as they aren't our user gopher
	        if (gophers[g].i !== this._userID) {
	          // Loop through all the gophers on stage
	          for (r = this.gophersOnStage.length - 1; r >= 0; r--) {
	            // If they already exist on the stage
	            if (gophers[g].i === this.gophersOnStage[r]._i) {
	              exists = true;
	              if (this.gophersOnStage[r].update !== undefined) {
	                this.gophersOnStage[r].update({
	                  x: gophers[g].p.x,
	                  y: gophers[g].p.y
	                });
	              }
	              break;
	            } else {
	              exists = false;
	            }
	          };
	        }
	
	        // Doesn't exist, let's add it to the stage and push
	        // into our Gophers array
	        if (exists === false) {
	          var enemyGopher = new _Gophers.EnemyGopher({
	            img: this.manager.enemyImg,
	            i: gophers[g].i,
	            x: gophers[g].p.x,
	            y: gophers[g].p.y,
	            radius: 15
	          });
	
	          this.storeGopher(enemyGopher);
	          this.addGopherToStage(enemyGopher);
	        }
	      };
	
	      this.stage.update();
	    }
	  }, {
	    key: 'storeGopher',
	    value: function storeGopher(gopher) {
	      this.gophersOnStage.push(gopher);
	    }
	  }, {
	    key: 'addGopherToStage',
	    value: function addGopherToStage(gopher) {
	      this.stage.addChild(gopher);
	    }
	  }, {
	    key: 'sendCommand',
	    value: function sendCommand(cmd) {
	      this.conn.send(cmd);
	    }
	  }, {
	    key: 'InitStage',
	    value: function InitStage(Manager, conn) {
	      var _this = this;
	
	      var userGopher = new _Gophers.UserGopher({
	        img: Manager.userImg,
	        i: this._userID,
	        x: window.innerWidth / 2,
	        y: window.innerHeight / 2,
	        radius: 15
	      }, this.sendCommand.bind(this));
	
	      createjs.Ticker.setFPS(30);
	      createjs.Ticker.addEventListener('tick', this.stage);
	      createjs.Ticker.addEventListener('tick', function (e) {
	        _this.tick(e);
	      });
	
	      this.manager = Manager;
	      this.conn = conn;
	      this.storeGopher(userGopher);
	      this.addGopherToStage(userGopher);
	    }
	
	    // updateGophers(newGophers) {
	    //   let g;
	    //   let r;
	
	    //   for (g = newGophers.length - 1; g >= 0; g--) {
	    //     let exists = null;
	
	    //     // Only check for gopher existence if their ID doesn't match
	    //     // our user's existing ID
	    //     if (newGophers[g].i !== this._userID) {
	    //       for (r = this.gophers.length - 1; r >= 0; r--) {
	    //         // Check if this gopher has already been added to the stage
	    //         if (newGophers[g].i === this.gophers[r]._i) {
	    //           exists = true;
	    //           if (this.gophers[r].update !== undefined) {
	    //             this.gophers[r].update({
	    //               x: newGophers[g].p.x,
	    //               y: newGophers[g].p.y
	    //             });
	    //           }
	    //           break;
	
	    //         } else {
	    //           exists = false;
	    //         }
	    //       };
	    //     }
	
	    //     // Doesn't exist, let's add it to the stage and push
	    //     // into our Gophers array
	    //     if (exists === false) {
	    //       let enemyGopher = new EnemyGopher({
	    //         img: this.manager.enemyImg,
	    //         i: newGophers[g].i,
	    //         x: newGophers[g].p.x,
	    //         y: newGophers[g].p.y,
	    //         radius: 15
	    //       });
	
	    //       this.storeGopher(enemyGopher);
	    //       this.addGopherToStage(enemyGopher);
	    //     } else {
	    //       // update position of the user's gopher
	    //       // if (this.gophers[g].update !== undefined) {
	    //       //   this.gophers[g].update({
	    //       //     x: newGophers[g].p.x,
	    //       //     y: newGophers[g].p.y
	    //       //   });
	    //       // }
	    //     }
	    //   };
	    // }
	
	  }, {
	    key: 'UpdateStage',
	    value: function UpdateStage(data) {
	      this.state = data;
	      // this.updateGophers(data.gophers);
	    }
	  }]);
	
	  return Game;
	})(Object);
	
	exports.Game = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _keyboardjs = __webpack_require__(3);
	
	var _keyboardjs2 = _interopRequireDefault(_keyboardjs);
	
	var Sprite = window.createjs.Sprite;
	var SpriteSheet = window.createjs.SpriteSheet;
	
	var BaseGopher = (function (_Sprite) {
	  _inherits(BaseGopher, _Sprite);
	
	  function BaseGopher(options) {
	    _classCallCheck(this, BaseGopher);
	
	    _get(Object.getPrototypeOf(BaseGopher.prototype), 'constructor', this).call(this);
	    var g = new Sprite();
	
	    g.spriteSheet = new SpriteSheet({
	      images: [options.img],
	      frames: {
	        width: 100,
	        height: 100,
	        regX: 50,
	        regY: 50
	      }
	    });
	
	    g.x = options.x;
	    g.y = options.y;
	    g._i = options.i;
	    g.update = this.update;
	
	    return g;
	  }
	
	  _createClass(BaseGopher, [{
	    key: 'update',
	    value: function update(obj) {
	      if (obj.x !== this.x) {
	        this.x = obj.x;
	      };
	
	      if (obj.y !== this.y) {
	        this.y = obj.y;
	      };
	    }
	  }]);
	
	  return BaseGopher;
	})(Sprite);
	
	exports.BaseGopher = BaseGopher;
	
	var EnemyGopher = (function (_BaseGopher) {
	  _inherits(EnemyGopher, _BaseGopher);
	
	  function EnemyGopher(options, sendCommand) {
	    _classCallCheck(this, EnemyGopher);
	
	    return _get(Object.getPrototypeOf(EnemyGopher.prototype), 'constructor', this).call(this, options);
	  }
	
	  return EnemyGopher;
	})(BaseGopher);
	
	exports.EnemyGopher = EnemyGopher;
	
	var UserGopher = (function (_BaseGopher2) {
	  _inherits(UserGopher, _BaseGopher2);
	
	  function UserGopher(options, sendCommand) {
	    _classCallCheck(this, UserGopher);
	
	    var g = _get(Object.getPrototypeOf(UserGopher.prototype), 'constructor', this).call(this, options);
	
	    g.sendCommand = function (cmd) {
	      sendCommand(cmd);
	    };
	
	    _keyboardjs2['default'].bind(['w', 'up'], function (e) {
	      e.preventDefault();
	      g.sendCommand('up');
	    });
	
	    _keyboardjs2['default'].bind(['s', 'down'], function (e) {
	      e.preventDefault();
	      g.sendCommand('down');
	    });
	
	    _keyboardjs2['default'].bind(['d', 'right'], function (e) {
	      g.sendCommand('right');
	    });
	
	    _keyboardjs2['default'].bind(['a', 'left'], function (e) {
	      g.sendCommand('left');
	    });
	
	    return g;
	  }
	
	  return UserGopher;
	})(BaseGopher);
	
	exports.UserGopher = UserGopher;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	var Keyboard = __webpack_require__(4);
	var Locale   = __webpack_require__(5);
	var KeyCombo = __webpack_require__(6);
	
	var keyboard = new Keyboard();
	
	keyboard.setLocale('us', __webpack_require__(7));
	
	exports          = module.exports = keyboard;
	exports.Keyboard = Keyboard;
	exports.Locale   = Locale;
	exports.KeyCombo = KeyCombo;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var Locale = __webpack_require__(5);
	var KeyCombo = __webpack_require__(6);
	
	
	function Keyboard(targetWindow, targetElement, platform, userAgent) {
	  this._locale               = null;
	  this._currentContext       = null;
	  this._contexts             = {};
	  this._listeners            = [];
	  this._appliedListeners     = [];
	  this._locales              = {};
	  this._targetElement        = null;
	  this._targetWindow         = null;
	  this._targetPlatform       = '';
	  this._targetUserAgent      = '';
	  this._isModernBrowser      = false;
	  this._targetKeyDownBinding = null;
	  this._targetKeyUpBinding   = null;
	  this._targetResetBinding   = null;
	  this._paused               = false;
	
	  this.setContext('global');
	  this.watch(targetWindow, targetElement, platform, userAgent);
	}
	
	Keyboard.prototype.setLocale = function(localeName, localeBuilder) {
	  var locale = null;
	  if (typeof localeName === 'string') {
	
	    if (localeBuilder) {
	      locale = new Locale(localeName);
	      localeBuilder(locale, this._targetPlatform, this._targetUserAgent);
	    } else {
	      locale = this._locales[localeName] || null;
	    }
	  } else {
	    locale     = localeName;
	    localeName = locale._localeName;
	  }
	
	  this._locale              = locale;
	  this._locales[localeName] = locale;
	  if (locale) {
	    this._locale.pressedKeys = locale.pressedKeys;
	  }
	};
	
	Keyboard.prototype.getLocale = function(localName) {
	  localName || (localName = this._locale.localeName);
	  return this._locales[localName] || null;
	};
	
	Keyboard.prototype.bind = function(keyComboStr, pressHandler, releaseHandler, preventRepeatByDefault) {
	  if (keyComboStr === null || typeof keyComboStr === 'function') {
	    preventRepeatByDefault = releaseHandler;
	    releaseHandler         = pressHandler;
	    pressHandler           = keyComboStr;
	    keyComboStr            = null;
	  }
	
	  if (
	    keyComboStr &&
	    typeof keyComboStr === 'object' &&
	    typeof keyComboStr.length === 'number'
	  ) {
	    for (var i = 0; i < keyComboStr.length; i += 1) {
	      this.bind(keyComboStr[i], pressHandler, releaseHandler);
	    }
	    return;
	  }
	
	  this._listeners.push({
	    keyCombo               : keyComboStr ? new KeyCombo(keyComboStr) : null,
	    pressHandler           : pressHandler           || null,
	    releaseHandler         : releaseHandler         || null,
	    preventRepeat          : preventRepeatByDefault || false,
	    preventRepeatByDefault : preventRepeatByDefault || false
	  });
	};
	Keyboard.prototype.addListener = Keyboard.prototype.bind;
	Keyboard.prototype.on          = Keyboard.prototype.bind;
	
	Keyboard.prototype.unbind = function(keyComboStr, pressHandler, releaseHandler) {
	  if (keyComboStr === null || typeof keyComboStr === 'function') {
	    releaseHandler = pressHandler;
	    pressHandler   = keyComboStr;
	    keyComboStr = null;
	  }
	
	  if (
	    keyComboStr &&
	    typeof keyComboStr === 'object' &&
	    typeof keyComboStr.length === 'number'
	  ) {
	    for (var i = 0; i < keyComboStr.length; i += 1) {
	      this.unbind(keyComboStr[i], pressHandler, releaseHandler);
	    }
	    return;
	  }
	
	  for (var i = 0; i < this._listeners.length; i += 1) {
	    var listener = this._listeners[i];
	
	    var comboMatches          = !keyComboStr && !listener.keyCombo ||
	                                listener.keyCombo.isEqual(keyComboStr);
	    var pressHandlerMatches   = !pressHandler && !releaseHandler ||
	                                !pressHandler && !listener.pressHandler ||
	                                pressHandler === listener.pressHandler;
	    var releaseHandlerMatches = !pressHandler && !releaseHandler ||
	                                !releaseHandler && !listener.releaseHandler ||
	                                releaseHandler === listener.releaseHandler;
	
	    if (comboMatches && pressHandlerMatches && releaseHandlerMatches) {
	      this._listeners.splice(i, 1);
	      i -= 1;
	    }
	  }
	};
	Keyboard.prototype.removeListener = Keyboard.prototype.unbind;
	Keyboard.prototype.off            = Keyboard.prototype.unbind;
	
	Keyboard.prototype.setContext = function(contextName) {
	  if(this._locale) { this.releaseAllKeys(); }
	
	  if (!this._contexts[contextName]) {
	    this._contexts[contextName] = [];
	  }
	  this._listeners      = this._contexts[contextName];
	  this._currentContext = contextName;
	};
	
	Keyboard.prototype.getContext = function() {
	  return this._currentContext;
	};
	
	Keyboard.prototype.withContext = function(contextName, callback) {
	  var previousContextName = this.getContext();
	  this.setContext(contextName);
	
	  callback();
	
	  this.setContext(previousContextName);
	};
	
	Keyboard.prototype.watch = function(targetWindow, targetElement, targetPlatform, targetUserAgent) {
	  var _this = this;
	
	  this.stop();
	
	  targetWindow && targetWindow !== null || (targetWindow = global);
	
	  if (typeof targetWindow.nodeType === 'number') {
	    targetUserAgent = targetPlatform;
	    targetPlatform  = targetElement;
	    targetElement   = targetWindow;
	    targetWindow    = global;
	  }
	
	  var userAgent = targetWindow.navigator && targetWindow.navigator.userAgent || '';
	  var platform  = targetWindow.navigator && targetWindow.navigator.platform  || '';
	
	  targetElement   && targetElement   !== null || (targetElement   = targetWindow.document);
	  targetPlatform  && targetPlatform  !== null || (targetPlatform  = platform);
	  targetUserAgent && targetUserAgent !== null || (targetUserAgent = userAgent);
	
	  this._isModernBrowser = !!targetWindow.addEventListener;
	  this._targetKeyDownBinding = function(event) {
	    _this.pressKey(event.keyCode, event);
	  };
	  this._targetKeyUpBinding = function(event) {
	    _this.releaseKey(event.keyCode, event);
	  };
	  this._targetResetBinding = function(event) {
	    _this.releaseAllKeys(event)
	  };
	
	  this._bindEvent(targetElement, 'keydown', this._targetKeyDownBinding);
	  this._bindEvent(targetElement, 'keyup',   this._targetKeyUpBinding);
	  this._bindEvent(targetWindow,  'focus',   this._targetResetBinding);
	  this._bindEvent(targetWindow,  'blur',    this._targetResetBinding);
	
	  this._targetElement   = targetElement;
	  this._targetWindow    = targetWindow;
	  this._targetPlatform  = targetPlatform;
	  this._targetUserAgent = targetUserAgent;
	};
	
	Keyboard.prototype.stop = function() {
	  var _this = this;
	
	  if (!this._targetElement || !this._targetWindow) { return; }
	
	  this._unbindEvent(this._targetElement, 'keydown', this._targetKeyDownBinding);
	  this._unbindEvent(this._targetElement, 'keyup',   this._targetKeyUpBinding);
	  this._unbindEvent(this._targetWindow,  'focus',   this._targetResetBinding);
	  this._unbindEvent(this._targetWindow,  'blur',    this._targetResetBinding);
	
	  this._targetWindow  = null;
	  this._targetElement = null;
	};
	
	Keyboard.prototype.pressKey = function(keyCode, event) {
	  if (this._paused) { return; }
	  if (!this._locale) { throw new Error('Locale not set'); }
	
	  this._locale.pressKey(keyCode);
	  this._applyBindings(event);
	};
	
	Keyboard.prototype.releaseKey = function(keyCode, event) {
	  if (this._paused) { return; }
	  if (!this._locale) { throw new Error('Locale not set'); }
	
	  this._locale.releaseKey(keyCode);
	  this._clearBindings(event);
	};
	
	Keyboard.prototype.releaseAllKeys = function(event) {
	  if (this._paused) { return; }
	  if (!this._locale) { throw new Error('Locale not set'); }
	
	  this._locale.pressedKeys.length = 0;
	  this._clearBindings(event);
	};
	
	Keyboard.prototype.pause = function() {
	  if (this._paused) { return; }
	  if (this._locale) { this.releaseAllKeys(); }
	  this._paused = true;
	};
	
	Keyboard.prototype.resume = function() {
	  this._paused = false;
	};
	
	Keyboard.prototype.reset = function() {
	  this.releaseAllKeys();
	  this._listeners.length = 0;
	};
	
	Keyboard.prototype._bindEvent = function(targetElement, eventName, handler) {
	  return this._isModernBrowser ?
	    targetElement.addEventListener(eventName, handler, false) :
	    targetElement.attachEvent('on' + eventName, handler);
	};
	
	Keyboard.prototype._unbindEvent = function(targetElement, eventName, handler) {
	  return this._isModernBrowser ?
	    targetElement.removeEventListener(eventName, handler, false) :
	    targetElement.detachEvent('on' + eventName, handler);
	};
	
	Keyboard.prototype._getGroupedListeners = function() {
	  var listenerGroups   = [];
	  var listenerGroupMap = [];
	
	  var listeners = this._listeners;
	  if (this._currentContext !== 'global') {
	    listeners = [].concat(listeners, this._contexts.global);
	  }
	
	  listeners.sort(function(a, b) {
	    return a.keyCombo.keyNames.length < b.keyCombo.keyNames.length;
	  }).forEach(function(l) {
	    var mapIndex = -1;
	    for (var i = 0; i < listenerGroupMap.length; i += 1) {
	      if (listenerGroupMap[i].isEqual(l.keyCombo)) {
	        mapIndex = i;
	      }
	    }
	    if (mapIndex === -1) {
	      mapIndex = listenerGroupMap.length;
	      listenerGroupMap.push(l.keyCombo);
	    }
	    if (!listenerGroups[mapIndex]) {
	      listenerGroups[mapIndex] = [];
	    }
	    listenerGroups[mapIndex].push(l);
	  });
	  return listenerGroups;
	};
	
	Keyboard.prototype._applyBindings = function(event) {
	  var preventRepeat = false;
	
	  event || (event = {});
	  event.preventRepeat = function() { preventRepeat = true; };
	  event.pressedKeys   = this._locale.pressedKeys.slice(0);
	
	  var pressedKeys    = this._locale.pressedKeys.slice(0);
	  var listenerGroups = this._getGroupedListeners();
	
	
	  for (var i = 0; i < listenerGroups.length; i += 1) {
	    var listeners = listenerGroups[i];
	    var keyCombo  = listeners[0].keyCombo;
	
	    if (keyCombo === null || keyCombo.check(pressedKeys)) {
	      for (var j = 0; j < listeners.length; j += 1) {
	        var listener = listeners[j];
	
	        if (keyCombo === null) {
	          listener = {
	            keyCombo               : new KeyCombo(pressedKeys.join('+')),
	            pressHandler           : listener.pressHandler,
	            releaseHandler         : listener.releaseHandler,
	            preventRepeat          : listener.preventRepeat,
	            preventRepeatByDefault : listener.preventRepeatByDefault
	          };
	        }
	
	        if (listener.pressHandler && !listener.preventRepeat) {
	          listener.pressHandler.call(this, event);
	          if (preventRepeat) {
	            listener.preventRepeat = preventRepeat;
	            preventRepeat          = false;
	          }
	        }
	
	        if (listener.releaseHandler && this._appliedListeners.indexOf(listener) === -1) {
	          this._appliedListeners.push(listener);
	        }
	      }
	
	      if (keyCombo) {
	        for (var j = 0; j < keyCombo.keyNames.length; j += 1) {
	          var index = pressedKeys.indexOf(keyCombo.keyNames[j]);
	          if (index !== -1) {
	            pressedKeys.splice(index, 1);
	            j -= 1;
	          }
	        }
	      }
	    }
	  }
	};
	
	Keyboard.prototype._clearBindings = function(event) {
	  event || (event = {});
	
	  for (var i = 0; i < this._appliedListeners.length; i += 1) {
	    var listener = this._appliedListeners[i];
	    var keyCombo = listener.keyCombo;
	    if (keyCombo === null || !keyCombo.check(this._locale.pressedKeys)) {
	      listener.preventRepeat = listener.preventRepeatByDefault;
	      listener.releaseHandler.call(this, event);
	      this._appliedListeners.splice(i, 1);
	      i -= 1;
	    }
	  }
	};
	
	module.exports = Keyboard;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	var KeyCombo = __webpack_require__(6);
	
	
	function Locale(name) {
	  this.localeName     = name;
	  this.pressedKeys    = [];
	  this._appliedMacros = [];
	  this._keyMap        = {};
	  this._killKeyCodes  = [];
	  this._macros        = [];
	}
	
	Locale.prototype.bindKeyCode = function(keyCode, keyNames) {
	  if (typeof keyNames === 'string') {
	    keyNames = [keyNames];
	  }
	
	  this._keyMap[keyCode] = keyNames;
	};
	
	Locale.prototype.bindMacro = function(keyComboStr, keyNames) {
	  if (typeof keyNames === 'string') {
	    keyNames = [ keyNames ];
	  }
	
	  var handler = null;
	  if (typeof keyNames === 'function') {
	    handler = keyNames;
	    keyNames = null;
	  }
	
	  var macro = {
	    keyCombo : new KeyCombo(keyComboStr),
	    keyNames : keyNames,
	    handler  : handler
	  };
	
	  this._macros.push(macro);
	};
	
	Locale.prototype.getKeyCodes = function(keyName) {
	  var keyCodes = [];
	  for (var keyCode in this._keyMap) {
	    var index = this._keyMap[keyCode].indexOf(keyName);
	    if (index > -1) { keyCodes.push(keyCode|0); }
	  }
	  return keyCodes;
	};
	
	Locale.prototype.getKeyNames = function(keyCode) {
	  return this._keyMap[keyCode] || [];
	};
	
	Locale.prototype.setKillKey = function(keyCode) {
	  if (typeof keyCode === 'string') {
	    var keyCodes = this.getKeyCodes(keyCode);
	    for (var i = 0; i < keyCodes.length; i += 1) {
	      this.setKillKey(keyCodes[i]);
	    }
	    return;
	  }
	
	  this._killKeyCodes.push(keyCode);
	};
	
	Locale.prototype.pressKey = function(keyCode) {
	  if (typeof keyCode === 'string') {
	    var keyCodes = this.getKeyCodes(keyCode);
	    for (var i = 0; i < keyCodes.length; i += 1) {
	      this.pressKey(keyCodes[i]);
	    }
	    return;
	  }
	
	  var keyNames = this.getKeyNames(keyCode);
	  for (var i = 0; i < keyNames.length; i += 1) {
	    if (this.pressedKeys.indexOf(keyNames[i]) === -1) {
	      this.pressedKeys.push(keyNames[i]);
	    }
	  }
	
	  this._applyMacros();
	};
	
	Locale.prototype.releaseKey = function(keyCode) {
	  if (typeof keyCode === 'string') {
	    var keyCodes = this.getKeyCodes(keyCode);
	    for (var i = 0; i < keyCodes.length; i += 1) {
	      this.releaseKey(keyCodes[i]);
	    }
	  }
	
	  else {
	    var keyNames         = this.getKeyNames(keyCode);
	    var killKeyCodeIndex = this._killKeyCodes.indexOf(keyCode);
	    
	    if (killKeyCodeIndex > -1) {
	      this.pressedKeys.length = 0;
	    } else {
	      for (var i = 0; i < keyNames.length; i += 1) {
	        var index = this.pressedKeys.indexOf(keyNames[i]);
	        if (index > -1) {
	          this.pressedKeys.splice(index, 1);
	        }
	      }
	    }
	
	    this._clearMacros();
	  }
	};
	
	Locale.prototype._applyMacros = function() {
	  var macros = this._macros.slice(0);
	  for (var i = 0; i < macros.length; i += 1) {
	    var macro = macros[i];
	    if (macro.keyCombo.check(this.pressedKeys)) {
	      if (macro.handler) {
	        macro.keyNames = macro.handler(this.pressedKeys);
	      }
	      for (var j = 0; j < macro.keyNames.length; j += 1) {
	        if (this.pressedKeys.indexOf(macro.keyNames[j]) === -1) {
	          this.pressedKeys.push(macro.keyNames[j]);
	        }
	      }
	      this._appliedMacros.push(macro);
	    }
	  }
	};
	
	Locale.prototype._clearMacros = function() {
	  for (var i = 0; i < this._appliedMacros.length; i += 1) {
	    var macro = this._appliedMacros[i];
	    if (!macro.keyCombo.check(this.pressedKeys)) {
	      for (var j = 0; j < macro.keyNames.length; j += 1) {
	        var index = this.pressedKeys.indexOf(macro.keyNames[j]);
	        if (index > -1) {
	          this.pressedKeys.splice(index, 1);
	        }
	      }
	      if (macro.handler) {
	        macro.keyNames = null;
	      }
	      this._appliedMacros.splice(i, 1);
	      i -= 1;
	    }
	  }
	};
	
	
	module.exports = Locale;


/***/ },
/* 6 */
/***/ function(module, exports) {

	
	function KeyCombo(keyComboStr) {
	  this.sourceStr = keyComboStr;
	  this.subCombos = KeyCombo.parseComboStr(keyComboStr);
	  this.keyNames  = this.subCombos.reduce(function(memo, nextSubCombo) {
	    return memo.concat(nextSubCombo);
	  });
	}
	
	// TODO: Add support for key combo sequences
	KeyCombo.sequenceDeliminator = '>>';
	KeyCombo.comboDeliminator    = '>';
	KeyCombo.keyDeliminator      = '+';
	
	KeyCombo.parseComboStr = function(keyComboStr) {
	  var subComboStrs = KeyCombo._splitStr(keyComboStr, KeyCombo.comboDeliminator);
	  var combo        = [];
	
	  for (var i = 0 ; i < subComboStrs.length; i += 1) {
	    combo.push(KeyCombo._splitStr(subComboStrs[i], KeyCombo.keyDeliminator));
	  }
	  return combo;
	};
	
	KeyCombo.prototype.check = function(pressedKeyNames) {
	  var startingKeyNameIndex = 0;
	  for (var i = 0; i < this.subCombos.length; i += 1) {
	    startingKeyNameIndex = this._checkSubCombo(
	      this.subCombos[i],
	      startingKeyNameIndex,
	      pressedKeyNames
	    );
	    if (startingKeyNameIndex === -1) { return false; }
	  }
	  return true;
	};
	
	KeyCombo.prototype.isEqual = function(otherKeyCombo) {
	  if (
	    !otherKeyCombo ||
	    typeof otherKeyCombo !== 'string' &&
	    typeof otherKeyCombo !== 'object'
	  ) { return false; }
	
	  if (typeof otherKeyCombo === 'string') {
	    otherKeyCombo = new KeyCombo(otherKeyCombo);
	  }
	
	  if (this.subCombos.length !== otherKeyCombo.subCombos.length) {
	    return false;
	  }
	  for (var i = 0; i < this.subCombos.length; i += 1) {
	    if (this.subCombos[i].length !== otherKeyCombo.subCombos[i].length) {
	      return false;
	    }
	  }
	
	  for (var i = 0; i < this.subCombos.length; i += 1) {
	    var subCombo      = this.subCombos[i];
	    var otherSubCombo = otherKeyCombo.subCombos[i].slice(0);
	
	    for (var j = 0; j < subCombo.length; j += 1) {
	      var keyName = subCombo[j];
	      var index   = otherSubCombo.indexOf(keyName);
	
	      if (index > -1) {
	        otherSubCombo.splice(index, 1);
	      }
	    }
	    if (otherSubCombo.length !== 0) {
	      return false;
	    }
	  }
	
	  return true;
	};
	
	KeyCombo._splitStr = function(str, deliminator) {
	  var s  = str;
	  var d  = deliminator;
	  var c  = '';
	  var ca = [];
	
	  for (var ci = 0; ci < s.length; ci += 1) {
	    if (ci > 0 && s[ci] === d && s[ci - 1] !== '\\') {
	      ca.push(c.trim());
	      c = '';
	      ci += 1;
	    }
	    c += s[ci];
	  }
	  if (c) { ca.push(c.trim()); }
	
	  return ca;
	};
	
	KeyCombo.prototype._checkSubCombo = function(subCombo, startingKeyNameIndex, pressedKeyNames) {
	  subCombo = subCombo.slice(0);
	  pressedKeyNames = pressedKeyNames.slice(startingKeyNameIndex);
	
	  var endIndex = startingKeyNameIndex;
	  for (var i = 0; i < subCombo.length; i += 1) {
	
	    var keyName = subCombo[i];
	    if (keyName[0] === '\\') {
	      var escapedKeyName = keyName.slice(1);
	      if (
	        escapedKeyName === KeyCombo.comboDeliminator ||
	        escapedKeyName === KeyCombo.keyDeliminator
	      ) {
	        keyName = escapedKeyName;
	      }
	    }
	
	    var index = pressedKeyNames.indexOf(keyName);
	    if (index > -1) {
	      subCombo.splice(i, 1);
	      i -= 1;
	      if (index > endIndex) {
	        endIndex = index;
	      }
	      if (subCombo.length === 0) {
	        return endIndex;
	      }
	    }
	  }
	  return -1;
	};
	
	
	module.exports = KeyCombo;


/***/ },
/* 7 */
/***/ function(module, exports) {

	
	module.exports = function(locale, platform, userAgent) {
	
	  // general
	  locale.bindKeyCode(3,   ['cancel']);
	  locale.bindKeyCode(8,   ['backspace']);
	  locale.bindKeyCode(9,   ['tab']);
	  locale.bindKeyCode(12,  ['clear']);
	  locale.bindKeyCode(13,  ['enter']);
	  locale.bindKeyCode(16,  ['shift']);
	  locale.bindKeyCode(17,  ['ctrl']);
	  locale.bindKeyCode(18,  ['alt', 'menu']);
	  locale.bindKeyCode(19,  ['pause', 'break']);
	  locale.bindKeyCode(20,  ['capslock']);
	  locale.bindKeyCode(27,  ['escape', 'esc']);
	  locale.bindKeyCode(32,  ['space', 'spacebar']);
	  locale.bindKeyCode(33,  ['pageup']);
	  locale.bindKeyCode(34,  ['pagedown']);
	  locale.bindKeyCode(35,  ['end']);
	  locale.bindKeyCode(36,  ['home']);
	  locale.bindKeyCode(37,  ['left']);
	  locale.bindKeyCode(38,  ['up']);
	  locale.bindKeyCode(39,  ['right']);
	  locale.bindKeyCode(40,  ['down']);
	  locale.bindKeyCode(41,  ['select']);
	  locale.bindKeyCode(42,  ['printscreen']);
	  locale.bindKeyCode(43,  ['execute']);
	  locale.bindKeyCode(44,  ['snapshot']);
	  locale.bindKeyCode(45,  ['insert', 'ins']);
	  locale.bindKeyCode(46,  ['delete', 'del']);
	  locale.bindKeyCode(47,  ['help']);
	  locale.bindKeyCode(145, ['scrolllock', 'scroll']);
	  locale.bindKeyCode(187, ['equal', 'equalsign', '=']);
	  locale.bindKeyCode(188, ['comma', ',']);
	  locale.bindKeyCode(190, ['period', '.']);
	  locale.bindKeyCode(191, ['slash', 'forwardslash', '/']);
	  locale.bindKeyCode(192, ['graveaccent', '`']);
	  locale.bindKeyCode(219, ['openbracket', '[']);
	  locale.bindKeyCode(220, ['backslash', '\\']);
	  locale.bindKeyCode(221, ['closebracket', ']']);
	  locale.bindKeyCode(222, ['apostrophe', '\'']);
	
	  // 0-9
	  locale.bindKeyCode(48, ['zero', '0']);
	  locale.bindKeyCode(49, ['one', '1']);
	  locale.bindKeyCode(50, ['two', '2']);
	  locale.bindKeyCode(51, ['three', '3']);
	  locale.bindKeyCode(52, ['four', '4']);
	  locale.bindKeyCode(53, ['five', '5']);
	  locale.bindKeyCode(54, ['six', '6']);
	  locale.bindKeyCode(55, ['seven', '7']);
	  locale.bindKeyCode(56, ['eight', '8']);
	  locale.bindKeyCode(57, ['nine', '9']);
	
	  // numpad
	  locale.bindKeyCode(96, ['numzero', 'num0']);
	  locale.bindKeyCode(97, ['numone', 'num1']);
	  locale.bindKeyCode(98, ['numtwo', 'num2']);
	  locale.bindKeyCode(99, ['numthree', 'num3']);
	  locale.bindKeyCode(100, ['numfour', 'num4']);
	  locale.bindKeyCode(101, ['numfive', 'num5']);
	  locale.bindKeyCode(102, ['numsix', 'num6']);
	  locale.bindKeyCode(103, ['numseven', 'num7']);
	  locale.bindKeyCode(104, ['numeight', 'num8']);
	  locale.bindKeyCode(105, ['numnine', 'num9']);
	  locale.bindKeyCode(106, ['nummultiply', 'num*']);
	  locale.bindKeyCode(107, ['numadd', 'num+']);
	  locale.bindKeyCode(108, ['numenter']);
	  locale.bindKeyCode(109, ['numsubtract', 'num-']);
	  locale.bindKeyCode(110, ['numdecimal', 'num.']);
	  locale.bindKeyCode(111, ['numdivide', 'num/']);
	  locale.bindKeyCode(144, ['numlock', 'num']);
	
	  // function keys
	  locale.bindKeyCode(112, ['f1']);
	  locale.bindKeyCode(113, ['f2']);
	  locale.bindKeyCode(114, ['f3']);
	  locale.bindKeyCode(115, ['f4']);
	  locale.bindKeyCode(116, ['f5']);
	  locale.bindKeyCode(117, ['f6']);
	  locale.bindKeyCode(118, ['f7']);
	  locale.bindKeyCode(119, ['f8']);
	  locale.bindKeyCode(120, ['f9']);
	  locale.bindKeyCode(121, ['f10']);
	  locale.bindKeyCode(122, ['f11']);
	  locale.bindKeyCode(123, ['f12']);
	
	  // secondary key symbols
	  locale.bindMacro('shift + `', ['tilde', '~']);
	  locale.bindMacro('shift + 1', ['exclamation', 'exclamationpoint', '!']);
	  locale.bindMacro('shift + 2', ['at', '@']);
	  locale.bindMacro('shift + 3', ['number', '#']);
	  locale.bindMacro('shift + 4', ['dollar', 'dollars', 'dollarsign', '$']);
	  locale.bindMacro('shift + 5', ['percent', '%']);
	  locale.bindMacro('shift + 6', ['caret', '^']);
	  locale.bindMacro('shift + 7', ['ampersand', 'and', '&']);
	  locale.bindMacro('shift + 8', ['asterisk', '*']);
	  locale.bindMacro('shift + 9', ['openparen', '(']);
	  locale.bindMacro('shift + 0', ['closeparen', ')']);
	  locale.bindMacro('shift + -', ['underscore', '_']);
	  locale.bindMacro('shift + =', ['plus', '+']);
	  locale.bindMacro('shift + [', ['opencurlybrace', 'opencurlybracket', '{']);
	  locale.bindMacro('shift + ]', ['closecurlybrace', 'closecurlybracket', '}']);
	  locale.bindMacro('shift + \\', ['verticalbar', '|']);
	  locale.bindMacro('shift + ;', ['colon', ':']);
	  locale.bindMacro('shift + \'', ['quotationmark', '\'']);
	  locale.bindMacro('shift + !,', ['openanglebracket', '<']);
	  locale.bindMacro('shift + .', ['closeanglebracket', '>']);
	  locale.bindMacro('shift + /', ['questionmark', '?']);
	
	  //a-z and A-Z
	  for (var keyCode = 65; keyCode <= 90; keyCode += 1) {
	    var keyName = String.fromCharCode(keyCode + 32);
	    var capitalKeyName = String.fromCharCode(keyCode);
	  	locale.bindKeyCode(keyCode, keyName);
	  	locale.bindMacro('shift + ' + keyName, capitalKeyName);
	  	locale.bindMacro('capslock + ' + keyName, capitalKeyName);
	  }
	
	  // browser caveats
	  var semicolonKeyCode = userAgent.match('Firefox') ? 59  : 186;
	  var dashKeyCode      = userAgent.match('Firefox') ? 173 : 189;
	  var leftCommandKeyCode;
	  var rightCommandKeyCode;
	  if (platform.match('Mac') && (userAgent.match('Safari') || userAgent.match('Chrome'))) {
	    leftCommandKeyCode  = 91;
	    rightCommandKeyCode = 93;
	  } else if(platform.match('Mac') && userAgent.match('Opera')) {
	    leftCommandKeyCode  = 17;
	    rightCommandKeyCode = 17;
	  } else if(platform.match('Mac') && userAgent.match('Firefox')) {
	    leftCommandKeyCode  = 224;
	    rightCommandKeyCode = 224;
	  }
	  locale.bindKeyCode(semicolonKeyCode,    ['semicolon', ';']);
	  locale.bindKeyCode(dashKeyCode,         ['dash', '-']);
	  locale.bindKeyCode(leftCommandKeyCode,  ['command', 'windows', 'win', 'super', 'leftcommand', 'leftwindows', 'leftwin', 'leftsuper']);
	  locale.bindKeyCode(rightCommandKeyCode, ['command', 'windows', 'win', 'super', 'rightcommand', 'rightwindows', 'rightwin', 'rightsuper']);
	
	  // kill keys
	  locale.setKillKey('command');
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var createjs = window.createjs;
	
	var AssetManager = (function () {
	  function AssetManager(stage, width, height) {
	    _classCallCheck(this, AssetManager);
	
	    this.enemyImg = new Image();
	    this.userImg = new Image();
	    this.downloadProgress = {};
	    this.onDownloadCompleted = null;
	    this.stage = stage;
	    this.width = width;
	    this.height = height;
	    this.NUM_ELEMENTS_TO_DOWNLOAD = 2;
	    this.numElementsLoaded = 0;
	  }
	
	  _createClass(AssetManager, [{
	    key: 'setDownloadCompleted',
	    value: function setDownloadCompleted(cb) {
	      this.onDownloadCompleted = cb;
	    }
	  }, {
	    key: 'StartDownload',
	    value: function StartDownload() {
	      var _this = this;
	
	      this.downloadProgress = new createjs.Text('-- %', '14px Arial', '#ff7700');
	      this.downloadProgress.x = this.width / 2 - 50;
	      this.downloadProgress.y = this.height / 2;
	      this.stage.addChild(this.downloadProgress);
	      this.stage.update();
	      this.setDownloadParameters(this.enemyImg, '/static/enemygopher.png');
	      this.setDownloadParameters(this.userImg, '/static/usergopher.png');
	
	      createjs.Ticker.addEventListener('tick', function (e) {
	        _this.tick(e);
	      });
	    }
	  }, {
	    key: 'setDownloadParameters',
	    value: function setDownloadParameters(assetElement, url) {
	      assetElement.src = url;
	      assetElement.onload = this.handleElementLoad.bind(this);
	      assetElement.onerror = this.handleElementError.bind(this);
	    }
	  }, {
	    key: 'handleElementLoad',
	    value: function handleElementLoad(e) {
	      this.numElementsLoaded++;
	
	      // If all elements have been downloaded
	      if (this.numElementsLoaded === this.NUM_ELEMENTS_TO_DOWNLOAD) {
	        this.stage.removeChild(this.downloadProgress);
	        createjs.Ticker.removeEventListener('tick');
	        this.numElementsLoaded = 0;
	        // we're calling back the method set by SetDownloadCompleted
	        this.onDownloadCompleted();
	      }
	    }
	  }, {
	    key: 'handleElementError',
	    value: function handleElementError(e) {
	      console.log('Error Loading Asset : ' + e.target.src);
	    }
	  }, {
	    key: 'tick',
	    value: function tick(event) {
	      var text = Math.round(this.numElementsLoaded / this.NUM_ELEMENTS_TO_DOWNLOAD * 100);
	
	      this.downloadProgress.text = 'Downloading ' + text + ' %';
	
	      // update the stage:
	      this.stage.update();
	    }
	  }]);
	
	  return AssetManager;
	})();

	exports.AssetManager = AssetManager;

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map