/**
 * A simulate threads alternative task manager.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var AnimationFrame = require('./animation-frame')
    , global = window
    , now = Date.now || function() { return +new Date }
    , requestAnimationFrame = AnimationFrame.next
    , cancelAnimationFrame = AnimationFrame.cancel

  var TaskDaemon = function() {

    var _tId = 0
      , _threadsId
      , _running
      , _tasks = []

    function run(ts) {
      if (!_tasks.length) {
        stop();
      } else {
        if (!_running) {
          return;
        }
        var crontab
          , queue = _tasks.slice(0)
          , interval, start, currTime
          , fn, args
        while (crontab = queue.shift()) {
          currTime = now();
          interval = crontab[1];
          fn = crontab[2];
          args = crontab[3];
          start = crontab[4];
          if (currTime - start >= interval) {
            crontab[4] = currTime;
            if (args) fn.apply(null, args);
            else fn(ts);
          }
        }
        if (_running) _threadsId = requestAnimationFrame(run);
      }
    }

    function stop() {
      if (_running) {
        cancelAnimationFrame(_threadsId);
        _running = false;
        _threadsId = null;
      }
    }

    function check() {
      if (_running) {
        return;
      }
      _running = true;
      global.setTimeout(run, 1);
    }

    function add(fn, wait, args) {
      if (typeof fn !== 'function') {
        return 0;
      }

      if (args && (typeof args !== 'object' || !args.length)) {
        args = undefined;
      }
      wait = +wait || 0;

      var o, i = -1;
      while (o = _tasks[++i]) {
        if (o[1] === wait && o[2] === fn && o[3] === args) return o[0];
      }

      var id = ++_tId
      _tasks.push([ id, wait, fn, args, now() ]);
      check();

      return id;
    }

    function cancel(id) {
      if (!id) {
        return;
      }
      var l = _tasks.length;
      while (l--) {
        if (_tasks[l][0] === id) {
          _tasks.splice(l, 1);
          break;
        }
      }
      if (!_tasks.length) {
        stop();
      }
    }

    function delay(fn, wait, args) {
      var id = add(function() {
        cancel(id);
        fn.apply(null, arguments)
      }, wait, args);
      return id;
    }

    return {
      /**
       * Behaves the same as setInterval except uses requestAnimationFrame()
       * where possible for better performance
       *
       * @method loop
       *
       * @param {Function} fn The callback function
       * @param {Integer} delay The delay in milliseconds
       * @return {Integer} Returns a unique crontab id.
       */
      loop: add,

      /**
       * Behaves the same as setTimeout, Invokes a function or executes a code snippet
       * after a specified `wait` milliseconds delay.
       *
       * @method delay
       *
       * @param {Function} fn The callback function
       * @param {Integer} delay The delay in milliseconds
       * @return {Integer} Returns a unique crontab id.
       */
      delay: delay,

      /**
       * Cancels crontab task was set up using loop or delay.
       *
       * @method cancel
       *
       * @param {Integer} id The crontab id to cancel
       */
      cancel: cancel
    }

  }();

  module.exports = TaskDaemon;
});
