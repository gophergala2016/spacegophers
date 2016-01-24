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
	
	var _Stage = __webpack_require__(1);
	
	var wspath = window.wspath;
	var conn = undefined;
	var gameID = undefined;
	
	function joinGame(gameID) {}
	
	document.addEventListener('DOMContentLoaded', function () {
	  if (window['WebSocket']) {
	    console.log('woo');
	  }
	
	  (0, _Stage.InitStage)();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.InitStage = InitStage;
	
	var _Gophers = __webpack_require__(2);
	
	var createjs = window.createjs;
	var stage = new createjs.Stage('spaceGophers');
	var count = 0;
	var userID = 'userID';
	var gophers = [];
	
	var state = {
	  projectiles: [{
	    id: 'projectile1',
	    x: 25,
	    y: 50
	  }],
	  gophers: [{
	    color: '#f00',
	    id: 'gopher1',
	    x: 300,
	    y: 100
	  }, {
	    color: '#0081c9',
	    id: 'gopher2',
	    x: 50,
	    y: 50
	  }, {
	    color: '#ff0',
	    id: 'userID',
	    x: 600,
	    y: 600
	  }]
	};
	
	function tick(event) {
	  var i = undefined;
	
	  if (count < 10) {
	    count++;
	    console.log('-------');
	
	    for (i = gophers.length - 1; i >= 0; i--) {
	      gophers[i].update({
	        x: 5,
	        y: 7
	      });
	    };
	  }
	
	  stage.update();
	}
	
	function InitStage() {
	  var gopher = undefined;
	  var i = undefined;
	
	  for (i = state.gophers.length - 1; i >= 0; i--) {
	    console.log('state: ', state.gophers[i].id);
	
	    if (state.gophers[i].id !== userID) {
	      gopher = new _Gophers.BaseGopher({
	        color: state.gophers[i].color,
	        id: state.gophers[i].id,
	        x: state.gophers[i].x,
	        y: state.gophers[i].y,
	        radius: state.gophers[i].radius
	      });
	    } else {
	      gopher = new _Gophers.UserGopher({
	        color: state.gophers[i].color,
	        id: state.gophers[i].id,
	        x: state.gophers[i].x,
	        y: state.gophers[i].y,
	        radius: state.gophers[i].radius
	      });
	    }
	
	    gophers.push(gopher);
	    stage.addChild(gopher);
	  };
	
	  createjs.Ticker.setFPS(5);
	  createjs.Ticker.addEventListener('tick', stage);
	  createjs.Ticker.addEventListener('tick', tick);
	}

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
	
	var Shape = window.createjs.Shape;
	
	var BaseGopher = (function (_Shape) {
	  _inherits(BaseGopher, _Shape);
	
	  function BaseGopher(options) {
	    _classCallCheck(this, BaseGopher);
	
	    _get(Object.getPrototypeOf(BaseGopher.prototype), 'constructor', this).call(this);
	    var g = new Shape();
	
	    // Custom properties and methods
	    g._id = options.id;
	    g._name = options.name;
	    g._color = options.color;
	    g.update = this.update;
	    g.getName = this.getName;
	    g.convertDegrees = this.convertDegrees;
	
	    // EaselJS properties/methods
	    g.graphics.beginFill(options.color).drawCircle(0, 0, 20);
	    g.x = options.x;
	    g.y = options.y;
	    g.pixelsPerSecond = 100;
	    return g;
	  }
	
	  _createClass(BaseGopher, [{
	    key: 'getName',
	    value: function getName() {
	      return this._name;
	    }
	  }, {
	    key: 'convertDegrees',
	    value: function convertDegrees(angle) {
	      return Math.sin(angle) * 360;
	    }
	  }, {
	    key: 'update',
	    value: function update(obj) {
	      this.x += obj.x;
	      this.y += obj.y;
	      console.log(this._name, ' has new position of: ', obj, this.x, this.y);
	    }
	  }]);
	
	  return BaseGopher;
	})(Shape);
	
	exports.BaseGopher = BaseGopher;
	
	var UserGopher = (function (_BaseGopher) {
	  _inherits(UserGopher, _BaseGopher);
	
	  function UserGopher(options) {
	    var _this = this;
	
	    _classCallCheck(this, UserGopher);
	
	    var g = _get(Object.getPrototypeOf(UserGopher.prototype), 'constructor', this).call(this, options);
	
	    _keyboardjs2['default'].bind(['w', 'up'], function (e) {
	      console.log('upward movement');
	      _this.moveUp();
	    }, function (e) {
	      console.log('stop upward movement');
	    });
	
	    // key.bind(['s', 'down'], (e) => {
	    //   console.log('backward movement');
	    //   // this.moveDown();
	    // }, (e) => {
	    //   console.log('stop backward movement');
	    // });
	
	    // key.bind(['a', 'left'], (e) => {
	    //   console.log('left movement');
	    //   // this.moveLeft();
	    // }, (e) => {
	    //   console.log('stop left movement');
	    // });
	
	    // key.bind(['d', 'right'], (e) => {
	    //   console.log('right movement');
	    //   // this.moveRight();
	    // }, (e) => {
	    //   console.log('stop right movement');
	    // });
	
	    return g;
	  }
	
	  _createClass(UserGopher, [{
	    key: 'postAction',
	    value: function postAction(action) {}
	  }, {
	    key: 'moveUp',
	    value: function moveUp() {
	      console.log('test: ', this.movementCalculation());
	    }
	  }, {
	    key: 'moveDown',
	    value: function moveDown() {
	      this.y += this.movementCalculation();
	    }
	  }, {
	    key: 'moveLeft',
	    value: function moveLeft() {
	      this.x -= this.movementCalculation();
	    }
	  }, {
	    key: 'moveRight',
	    value: function moveRight() {
	      this.x += this.movementCalculation();
	    }
	  }]);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map