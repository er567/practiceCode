/**
 * Pollfill requestAnimationFrame implementations, provide apis: #.next(), #.cancel()
 *
 * @example
 *
 * ```js
 * var AnimationFrame = require('animation-frame');
 *
 * // requestAnimationFrame
 * var tid = AnimationFrame.next(function() {
 *  console.log('animating...');
 * })
 *
 * // cancelAnimationFrame: cancel the animation frame
 * AnimationFrame.cancel(tid);
 * ```
 *
 * GistID: 0d33f3d79cf5121aef1e
 * GistURL: https://gist.github.com/0d33f3d79cf5121aef1e
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var global = window

    , now = Date.now || function() { return +new Date }

    , requestAnimationFrame = global.requestAnimationFrame
    , cancelAnimationFrame = global.cancelAnimationFrame

  // Pollfill requestAnimationFrame implementations
  // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  if (!requestAnimationFrame) {
    var vendors = ['webkit', 'moz', 'o', 'ms'], i = -1, x
    while (x = vendors[++i], x && !cancelAnimationFrame) {
      requestAnimationFrame = global[x + 'RequestAnimationFrame'];
      cancelAnimationFrame = global[x + 'CancelAnimationFrame'];
    }
    if (!cancelAnimationFrame) {
      // IE <= 9, Android <= 4.3, very old/rare browsers
      var lastTime = 0;
      requestAnimationFrame = function( callback ) {
        var currTime = now();
        var timeToCall = Math.max( 0, 16 - (currTime - lastTime) );
        var id = global.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id; // return the id for cancellation capabilities
      };
      cancelAnimationFrame = function(id) { clearTimeout(id) };
    }
  }

  var AnimationFrame = function() {
    var timeout
      , tId = 0
      , pendings = [] // [ [id, handle] [, ...] ]
      , run = function(ts) {
          var fns = pendings;
          pendings = [];
          timeout = null
          while (fns.length) fns.shift()[1](ts);
        }
      , add = function(fn) {
          var id = 0;
          if (typeof fn === 'function') {
            id = ++tId;
            pendings.push([id, fn]);
          }
          ( timeout || (timeout = requestAnimationFrame(run)) );
          return id;
        }
      , cancel = function(id) {
          var l;
          if (l = pendings.length) {
            while (l--)
              if (pendings[l][0] === id) {
                pendings.splice(l, 1);
                break;
              }
            if (!pendings.length) {
              cancelAnimationFrame(timeout);
              timeout = null;
            }
          }
        }
    return {
      next: add,
      cancel: cancel
    }
  }();

  module.exports = AnimationFrame;

});
