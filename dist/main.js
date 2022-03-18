/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js ***!
  \*********************************************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function () {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function (record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
 true ? module.exports : 0);

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js");

/***/ }),

/***/ "./node_modules/ammojs-typed/ammo/ammo.js":
/*!************************************************!*\
  !*** ./node_modules/ammojs-typed/ammo/ammo.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __filename = "/index.js";
var __dirname = "/";
// This is ammo.js, a port of Bullet Physics to JavaScript. zlib licensed.
var Ammo=function(){var _scriptDir=typeof document!=='undefined'&&document.currentScript?document.currentScript.src:undefined;if(true)_scriptDir=_scriptDir||__filename;return function(Ammo){Ammo=Ammo||{};var b;b||(b=typeof Ammo!=='undefined'?Ammo:{});var Promise=function(){function a(){}function c(v,J){return function(){v.apply(J,arguments);};}function d(v){if(!(this instanceof d))throw new TypeError("Promises must be constructed via new");if("function"!==typeof v)throw new TypeError("not a function");this.m=0;this.ia=!1;this.o=void 0;this.s=[];ma(v,this);}function e(v,J){for(;3===v.m;)v=v.o;0===v.m?v.s.push(J):(v.ia=!0,d.ja(function(){var ba=1===v.m?J.Vc:J.Wc;if(null===ba)(1===v.m?g:n)(J.Y,v.o);else{try{var za=ba(v.o);}catch(ub){n(J.Y,ub);return;}g(J.Y,za);}}));}function g(v,J){try{if(J===v)throw new TypeError("A promise cannot be resolved with itself.");if(J&&("object"===typeof J||"function"===typeof J)){var ba=J.then;if(J instanceof d){v.m=3;v.o=J;D(v);return;}if("function"===typeof ba){ma(c(ba,J),v);return;}}v.m=1;v.o=J;D(v);}catch(za){n(v,za);}}function n(v,J){v.m=2;v.o=J;D(v);}function D(v){2===v.m&&0===v.s.length&&d.ja(function(){v.ia||d.ka(v.o);});for(var J=0,ba=v.s.length;J<ba;J++)e(v,v.s[J]);v.s=null;}function Y(v,J,ba){this.Vc="function"===typeof v?v:null;this.Wc="function"===typeof J?J:null;this.Y=ba;}function ma(v,J){var ba=!1;try{v(function(za){ba||(ba=!0,g(J,za));},function(za){ba||(ba=!0,n(J,za));});}catch(za){ba||(ba=!0,n(J,za));}}d.prototype["catch"]=function(v){return this.then(null,v);};d.prototype.then=function(v,J){var ba=new this.constructor(a);e(this,new Y(v,J,ba));return ba;};d.all=function(v){return new d(function(J,ba){function za(Cc,Ub){try{if(Ub&&("object"===typeof Ub||"function"===typeof Ub)){var Dc=Ub.then;if("function"===typeof Dc){Dc.call(Ub,function(rc){za(Cc,rc);},ba);return;}}ub[Cc]=Ub;0===--wC&&J(ub);}catch(rc){ba(rc);}}if(!Array.isArray(v))return ba(new TypeError("Promise.all accepts an array"));var ub=Array.prototype.slice.call(v);if(0===ub.length)return J([]);for(var wC=ub.length,dc=0;dc<ub.length;dc++)za(dc,ub[dc]);});};d.resolve=function(v){return v&&"object"===typeof v&&v.constructor===d?v:new d(function(J){J(v);});};d.reject=function(v){return new d(function(J,ba){ba(v);});};d.race=function(v){return new d(function(J,ba){if(!Array.isArray(v))return ba(new TypeError("Promise.race accepts an array"));for(var za=0,ub=v.length;za<ub;za++)d.resolve(v[za]).then(J,ba);});};d.ja="function"===typeof setImmediate&&function(v){setImmediate(v);}||function(v){setTimeout(v,0);};d.ka=function(v){"undefined"!==typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",v);};return d;}(),aa;b.ready=new Promise(function(a){aa=a;});var ca={},da;for(da in b)b.hasOwnProperty(da)&&(ca[da]=b[da]);var ea=!1,fa=!1,ha=!1,ia=!1;ea="object"===typeof window;fa="function"===typeof importScripts;ha="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;ia=!ea&&!ha&&!fa;var ja="",ka,la,na,oa;if(ha)ja=fa?(__webpack_require__(/*! path */ "?539c").dirname)(ja)+"/":__dirname+"/",ka=function(a,c){var d=pa(a);if(d)return c?d:d.toString();na||(na=__webpack_require__(/*! fs */ "?db70"));oa||(oa=__webpack_require__(/*! path */ "?539c"));a=oa.normalize(a);return na.readFileSync(a,c?null:"utf8");},la=function(a){a=ka(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a;},1<process.argv.length&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("uncaughtException",function(a){throw a;}),process.on("unhandledRejection",qa),b.inspect=function(){return"[Emscripten Module object]";};else if(ia)"undefined"!=typeof read&&(ka=function(a){var c=pa(a);return c?ra(c):read(a);}),la=function(a){var c;if(c=pa(a))return c;if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));c=read(a,"binary");assert("object"===typeof c);return c;},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(ea||fa)fa?ja=self.location.href:document.currentScript&&(ja=document.currentScript.src),_scriptDir&&(ja=_scriptDir),ja=0!==ja.indexOf("blob:")?ja.substr(0,ja.lastIndexOf("/")+1):"",ka=function(a){try{var c=new XMLHttpRequest();c.open("GET",a,!1);c.send(null);return c.responseText;}catch(d){if(a=pa(a))return ra(a);throw d;}},fa&&(la=function(a){try{var c=new XMLHttpRequest();c.open("GET",a,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response);}catch(d){if(a=pa(a))return a;throw d;}});var sa=b.print||console.log.bind(console),ta=b.printErr||console.warn.bind(console);for(da in ca)ca.hasOwnProperty(da)&&(b[da]=ca[da]);ca=null;var ua;b.wasmBinary&&(ua=b.wasmBinary);var noExitRuntime;b.noExitRuntime&&(noExitRuntime=b.noExitRuntime);function va(){return{buffer:new ArrayBuffer(wa/65536*65536),grow:function(a){return xa(a);}};}function ya(){return{exports:// EMSCRIPTEN_START_ASM
function a(asmLibraryArg,wasmMemory,wasmTable){var scratchBuffer=new ArrayBuffer(8);var b=new Int32Array(scratchBuffer);var c=new Float32Array(scratchBuffer);var d=new Float64Array(scratchBuffer);function e(index,value){b[index]=value;}function f(){return d[0];}function g(value){c[0]=value;}function h(index){return b[index];}function i(){return c[0];}function j(global,env,buffer){var k=env.memory;var l=wasmTable;var m=new global.Int8Array(buffer);var n=new global.Int16Array(buffer);var o=new global.Int32Array(buffer);var p=new global.Uint8Array(buffer);var q=new global.Uint16Array(buffer);var r=new global.Uint32Array(buffer);var s=new global.Float32Array(buffer);var t=new global.Float64Array(buffer);var u=global.Math.imul;var v=global.Math.fround;var w=global.Math.abs;var x=global.Math.clz32;var y=global.Math.min;var z=global.Math.max;var A=global.Math.floor;var B=global.Math.ceil;var C=global.Math.sqrt;var D=env.abort;var E=global.NaN;var F=global.Infinity;var G=env.emscripten_asm_const_iii;var H=env.gettimeofday;var I=env.emscripten_asm_const_dii;var J=env.emscripten_memcpy_big;var K=env.emscripten_resize_heap;var L=env.abort;var M=5274432;var N=0;// EMSCRIPTEN_START_FUNCS
l[1]=Ga;l[2]=hc;l[3]=Mn;l[4]=Ln;l[5]=Ha;l[6]=vb;l[7]=ay;l[8]=dh;l[9]=Jn;l[10]=In;l[11]=Hn;l[12]=Ha;l[13]=vb;l[14]=Ha;l[15]=vb;l[16]=Ga;l[17]=zn;l[18]=yn;l[19]=xn;l[20]=Ha;l[21]=vb;l[22]=Ga;l[23]=hc;l[24]=un;l[25]=tn;l[26]=sn;l[27]=Ha;l[28]=vb;l[29]=Ga;l[30]=hc;l[31]=rn;l[32]=Ga;l[33]=hc;l[34]=qn;l[35]=pn;l[36]=Ha;l[37]=vb;l[38]=Ga;l[39]=hc;l[40]=on;l[41]=nn;l[42]=mn;l[43]=ln;l[44]=kn;l[45]=jn;l[46]=hn;l[47]=gn;l[48]=fn;l[49]=en;l[50]=dn;l[51]=cn;l[52]=bn;l[53]=an;l[54]=$m;l[55]=_m;l[56]=Zm;l[57]=Ym;l[58]=Xm;l[59]=Wm;l[60]=Vm;l[61]=Ha;l[62]=vb;l[63]=xe;l[64]=vm;l[65]=um;l[66]=sm;l[67]=rm;l[68]=ye;l[69]=tm;l[70]=pm;l[71]=om;l[72]=nm;l[73]=mm;l[74]=jm;l[75]=im;l[76]=hm;l[77]=gm;l[78]=dm;l[79]=bm;l[80]=am;l[81]=Yl;l[82]=$l;l[83]=Zl;l[84]=_l;l[85]=Wl;l[86]=Xl;l[87]=Vl;l[88]=Sl;l[89]=Rl;l[90]=Ql;l[91]=Dg;l[92]=Dg;l[93]=Ul;l[94]=Tl;l[95]=la;l[96]=Z;l[97]=Pl;l[98]=be;l[99]=YG;l[100]=la;l[101]=Z;l[102]=oL;l[103]=la;l[104]=Z;l[105]=fb;l[106]=Z;l[107]=kL;l[108]=la;l[109]=Z;l[110]=ua;l[111]=ua;l[112]=jL;l[113]=la;l[114]=Z;l[115]=hL;l[116]=Lb;l[117]=wa;l[118]=la;l[119]=Ma;l[120]=fL;l[121]=eL;l[122]=dL;l[123]=Lb;l[124]=cd;l[125]=qe;l[126]=bL;l[127]=ug;l[128]=ec;l[129]=Fl;l[130]=El;l[131]=la;l[132]=Z;l[133]=aL;l[134]=Z;l[135]=$K;l[136]=Z;l[137]=_K;l[138]=Z;l[139]=ZK;l[140]=Z;l[141]=YK;l[142]=Z;l[143]=XK;l[144]=Z;l[145]=WK;l[146]=Z;l[147]=VK;l[148]=Z;l[149]=UK;l[150]=Z;l[151]=TK;l[152]=RK;l[153]=QK;l[154]=NK;l[155]=Lb;l[156]=cd;l[157]=la;l[158]=Z;l[159]=Dl;l[160]=MK;l[161]=LK;l[162]=EK;l[163]=DK;l[164]=KK;l[165]=JK;l[166]=IK;l[167]=HK;l[168]=Hb;l[169]=rg;l[170]=Bl;l[171]=bH;l[172]=$G;l[173]=aH;l[174]=ae;l[175]=CK;l[176]=pe;l[177]=BK;l[178]=AK;l[179]=sg;l[180]=zK;l[181]=qg;l[182]=yK;l[183]=_G;l[184]=bg;l[185]=xK;l[186]=ZG;l[187]=wK;l[188]=XG;l[189]=pg;l[190]=vK;l[191]=lH;l[192]=Al;l[193]=Al;l[194]=uK;l[195]=tK;l[196]=oe;l[197]=sK;l[198]=rK;l[199]=qK;l[200]=la;l[201]=Z;l[202]=yl;l[203]=pK;l[204]=wa;l[205]=ua;l[206]=la;l[207]=Z;l[208]=Z;l[209]=xl;l[210]=lK;l[211]=kK;l[212]=jK;l[213]=Lb;l[214]=cd;l[215]=Z;l[216]=hK;l[217]=gK;l[218]=iK;l[219]=Z;l[220]=ng;l[221]=Z;l[222]=ua;l[223]=ua;l[224]=fK;l[225]=Z;l[226]=vl;l[227]=Ma;l[228]=dK;l[229]=Ma;l[230]=cK;l[231]=lg;l[232]=aK;l[233]=$J;l[234]=_J;l[235]=pl;l[236]=QJ;l[237]=rl;l[238]=TJ;l[239]=WJ;l[240]=kg;l[241]=bd;l[242]=ZJ;l[243]=RJ;l[244]=Z;l[245]=ol;l[246]=Z;l[247]=ol;l[248]=la;l[249]=Z;l[250]=ua;l[251]=PJ;l[252]=OJ;l[253]=xe;l[254]=xe;l[255]=Z;l[256]=NJ;l[257]=MJ;l[258]=Z;l[259]=LJ;l[260]=Z;l[261]=KJ;l[262]=Z;l[263]=JJ;l[264]=IJ;l[265]=la;l[266]=Z;l[267]=HJ;l[268]=Z;l[269]=GJ;l[270]=Z;l[271]=FJ;l[272]=Z;l[273]=EJ;l[274]=la;l[275]=Z;l[276]=DJ;l[277]=CJ;l[278]=BJ;l[279]=AJ;l[280]=zJ;l[281]=Z;l[282]=ml;l[283]=vJ;l[284]=uJ;l[285]=tJ;l[286]=Lb;l[287]=cd;l[288]=la;l[289]=Z;l[290]=lJ;l[291]=pJ;l[292]=oJ;l[293]=nJ;l[294]=mJ;l[295]=kJ;l[296]=Z;l[297]=ua;l[298]=ua;l[299]=kl;l[300]=Z;l[301]=ua;l[302]=ua;l[303]=jJ;l[304]=Z;l[305]=iJ;l[306]=hJ;l[307]=gJ;l[308]=fJ;l[309]=eJ;l[310]=dJ;l[311]=Z;l[312]=cJ;l[313]=gl;l[314]=$I;l[315]=YI;l[316]=XI;l[317]=ec;l[318]=el;l[319]=VI;l[320]=TI;l[321]=SI;l[322]=UI;l[323]=Z;l[324]=RI;l[325]=wa;l[326]=LI;l[327]=KI;l[328]=FI;l[329]=CI;l[330]=AI;l[331]=DI;l[332]=zI;l[333]=yI;l[334]=xI;l[335]=wI;l[336]=BI;l[337]=HI;l[338]=GI;l[339]=la;l[340]=Ba;l[341]=Bl;l[342]=oI;l[343]=nI;l[344]=mI;l[345]=lI;l[346]=ee;l[347]=kI;l[348]=pI;l[349]=rI;l[350]=qI;l[351]=qb;l[352]=ua;l[353]=Ba;l[354]=jI;l[355]=iI;l[356]=Ba;l[357]=hI;l[358]=gI;l[359]=Zk;l[360]=eI;l[361]=YH;l[362]=XH;l[363]=VG;l[364]=UG;l[365]=_H;l[366]=WH;l[367]=VH;l[368]=ZH;l[369]=aI;l[370]=$H;l[371]=Ba;l[372]=Xk;l[373]=RH;l[374]=QH;l[375]=sg;l[376]=PH;l[377]=SH;l[378]=UH;l[379]=TH;l[380]=OH;l[381]=NH;l[382]=zH;l[383]=JH;l[384]=yH;l[385]=pe;l[386]=FH;l[387]=EH;l[388]=DH;l[389]=ee;l[390]=IH;l[391]=KH;l[392]=wH;l[393]=CH;l[394]=HH;l[395]=GH;l[396]=la;l[397]=Z;l[398]=Vk;l[399]=Z;l[400]=Vk;l[401]=Z;l[402]=BH;l[403]=la;l[404]=Ba;l[405]=Tk;l[406]=vH;l[407]=Sk;l[408]=Xa;l[409]=xH;l[410]=la;l[411]=Z;l[412]=uH;l[413]=Z;l[414]=tH;l[415]=la;l[416]=Ba;l[417]=rH;l[418]=pH;l[419]=oH;l[420]=pe;l[421]=nH;l[422]=qg;l[423]=mH;l[424]=qH;l[425]=Ma;l[426]=hH;l[427]=jH;l[428]=iH;l[429]=Ma;l[430]=fH;l[431]=gH;l[432]=la;l[433]=Ba;l[434]=Xk;l[435]=eH;l[436]=dH;l[437]=cg;l[438]=cH;l[439]=Gb;l[440]=Ma;l[441]=Ma;l[442]=Ma;l[443]=MG;l[444]=LG;l[445]=TG;l[446]=KG;l[447]=JG;l[448]=OG;l[449]=bg;l[450]=SG;l[451]=RG;l[452]=Jk;l[453]=Jk;l[454]=QG;l[455]=PG;l[456]=qb;l[457]=Gb;l[458]=Ik;l[459]=NG;l[460]=Ba;l[461]=CG;l[462]=ag;l[463]=FG;l[464]=BG;l[465]=Gk;l[466]=$c;l[467]=ee;l[468]=AG;l[469]=HG;l[470]=GG;l[471]=Ba;l[472]=zG;l[473]=Ba;l[474]=yG;l[475]=rg;l[476]=vG;l[477]=uG;l[478]=tG;l[479]=bg;l[480]=xG;l[481]=wG;l[482]=qb;l[483]=qb;l[484]=Gb;l[485]=ua;l[486]=qb;l[487]=Gb;l[488]=Ik;l[489]=Z;l[490]=sG;l[491]=la;l[492]=Ma;l[493]=rg;l[494]=Dk;l[495]=ag;l[496]=qG;l[497]=pG;l[498]=$c;l[499]=nG;l[500]=mG;l[501]=lG;l[502]=Ck;l[503]=kG;l[504]=jG;l[505]=Sk;l[506]=iG;l[507]=hG;l[508]=Ck;l[509]=gG;l[510]=fG;l[511]=eG;l[512]=dG;l[513]=cG;l[514]=_j;l[515]=zk;l[516]=jE;l[517]=lE;l[518]=kE;l[519]=bG;l[520]=Z;l[521]=aG;l[522]=Z;l[523]=$F;l[524]=YF;l[525]=XF;l[526]=WF;l[527]=TF;l[528]=SF;l[529]=pe;l[530]=RF;l[531]=UF;l[532]=VF;l[533]=Ba;l[534]=Dk;l[535]=ag;l[536]=QF;l[537]=JF;l[538]=Gk;l[539]=$c;l[540]=ee;l[541]=IF;l[542]=HF;l[543]=NF;l[544]=MF;l[545]=xk;l[546]=Ba;l[547]=GF;l[548]=PF;l[549]=KF;l[550]=FF;l[551]=Ba;l[552]=EF;l[553]=OF;l[554]=LF;l[555]=xk;l[556]=wk;l[557]=BF;l[558]=DF;l[559]=vk;l[560]=vk;l[561]=wa;l[562]=wa;l[563]=El;l[564]=wa;l[565]=wa;l[566]=AF;l[567]=yF;l[568]=xF;l[569]=tF;l[570]=CF;l[571]=tk;l[572]=uF;l[573]=wF;l[574]=vF;l[575]=Xf;l[576]=rF;l[577]=qF;l[578]=oF;l[579]=mF;l[580]=rk;l[581]=kF;l[582]=jF;l[583]=iF;l[584]=qk;l[585]=qk;l[586]=hF;l[587]=gF;l[588]=Zc;l[589]=eF;l[590]=dF;l[591]=cF;l[592]=pk;l[593]=bF;l[594]=ua;l[595]=ec;l[596]=ec;l[597]=ok;l[598]=ua;l[599]=qb;l[600]=ua;l[601]=wa;l[602]=ua;l[603]=pk;l[604]=oe;l[605]=wa;l[606]=wa;l[607]=kk;l[608]=ZE;l[609]=QE;l[610]=TE;l[611]=WE;l[612]=ec;l[613]=ec;l[614]=ok;l[615]=YE;l[616]=ug;l[617]=XE;l[618]=PE;l[619]=SE;l[620]=VE;l[621]=qb;l[622]=pl;l[623]=RE;l[624]=Z;l[625]=OE;l[626]=Z;l[627]=NE;l[628]=ME;l[629]=LE;l[630]=JE;l[631]=IE;l[632]=FE;l[633]=rk;l[634]=HE;l[635]=GE;l[636]=EE;l[637]=fk;l[638]=fk;l[639]=BE;l[640]=AE;l[641]=Zc;l[642]=Z;l[643]=zE;l[644]=yE;l[645]=Z;l[646]=ek;l[647]=Z;l[648]=ek;l[649]=Td;l[650]=rE;l[651]=Ma;l[652]=dE;l[653]=$D;l[654]=_D;l[655]=cE;l[656]=bE;l[657]=aE;l[658]=WD;l[659]=VD;l[660]=TD;l[661]=SD;l[662]=Qf;l[663]=PD;l[664]=Mj;l[665]=FD;l[666]=Jj;l[667]=oD;l[668]=JD;l[669]=AD;l[670]=zD;l[671]=yD;l[672]=xD;l[673]=HD;l[674]=GD;l[675]=KD;l[676]=DD;l[677]=CD;l[678]=ED;l[679]=sD;l[680]=rD;l[681]=qD;l[682]=Bj;l[683]=Bj;l[684]=pg;l[685]=MD;l[686]=Hj;l[687]=Gj;l[688]=Hj;l[689]=Gj;l[690]=Cj;l[691]=tD;l[692]=uD;l[693]=wD;l[694]=BD;l[695]=Kj;l[696]=OD;l[697]=LD;l[698]=wa;l[699]=nD;l[700]=mD;l[701]=lD;l[702]=kD;l[703]=Z;l[704]=jD;l[705]=iD;l[706]=yj;l[707]=Fb;l[708]=Zc;l[709]=dD;l[710]=gD;l[711]=fD;l[712]=kl;l[713]=cD;l[714]=bD;l[715]=qg;l[716]=Eb;l[717]=yj;l[718]=Fb;l[719]=ZC;l[720]=YC;l[721]=tj;l[722]=WC;l[723]=VC;l[724]=UC;l[725]=TC;l[726]=XC;l[727]=Fb;l[728]=MC;l[729]=KC;l[730]=JC;l[731]=LC;l[732]=Fb;l[733]=FC;l[734]=EC;l[735]=DC;l[736]=BC;l[737]=AC;l[738]=zk;l[739]=zC;l[740]=yC;l[741]=Ma;l[742]=Fb;l[743]=sC;l[744]=qC;l[745]=oC;l[746]=nC;l[747]=mC;l[748]=lC;l[749]=Fb;l[750]=eC;l[751]=hC;l[752]=gC;l[753]=dC;l[754]=bC;l[755]=aC;l[756]=_B;l[757]=ZB;l[758]=$B;l[759]=Fb;l[760]=YB;l[761]=WB;l[762]=VB;l[763]=RB;l[764]=QB;l[765]=PB;l[766]=OB;l[767]=gj;l[768]=NB;l[769]=ua;l[770]=yB;l[771]=ua;l[772]=xB;l[773]=oe;l[774]=FB;l[775]=CB;l[776]=AB;l[777]=DB;l[778]=EB;l[779]=BB;l[780]=tB;l[781]=cj;l[782]=rB;l[783]=hB;l[784]=jB;l[785]=oB;l[786]=mB;l[787]=gB;l[788]=Z;l[789]=iB;l[790]=fB;l[791]=eB;l[792]=RA;l[793]=wa;l[794]=aB;l[795]=$A;l[796]=_A;l[797]=ZA;l[798]=YA;l[799]=XA;l[800]=WA;l[801]=UA;l[802]=TA;l[803]=SA;l[804]=Z;l[805]=QA;l[806]=PA;l[807]=OA;l[808]=qb;l[809]=oe;l[810]=NA;l[811]=wa;l[812]=HA;l[813]=LA;l[814]=MA;l[815]=IA;l[816]=JA;l[817]=GA;l[818]=NI;l[819]=FA;l[820]=ug;l[821]=KA;l[822]=EA;l[823]=DA;l[824]=CA;l[825]=Z;l[826]=BA;l[827]=Z;l[828]=AA;l[829]=Z;l[830]=zA;l[831]=Z;l[832]=yA;l[833]=Rz;l[834]=Vi;l[835]=vA;l[836]=wa;l[837]=Az;l[838]=zz;l[839]=xz;l[840]=Z;l[841]=Nz;l[842]=la;l[843]=Z;l[844]=Iz;l[845]=Hz;l[846]=Gz;l[847]=pg;l[848]=Ba;l[849]=wz;l[850]=wa;l[851]=vz;l[852]=cg;l[853]=uz;l[854]=Gb;l[855]=Z;l[856]=tz;l[857]=Z;l[858]=qz;l[859]=Ba;l[860]=Gb;l[861]=cg;l[862]=pz;l[863]=sg;l[864]=oz;l[865]=nz;l[866]=mz;l[867]=Gb;l[868]=lz;l[869]=Z;l[870]=kz;l[871]=Z;l[872]=jz;l[873]=Cz;l[874]=Fz;l[875]=Ez;l[876]=Dz;l[877]=la;l[878]=Z;l[879]=iz;l[880]=Lb;l[881]=wa;l[882]=hz;l[883]=gz;l[884]=_y;l[885]=Zy;l[886]=wa;l[887]=ez;l[888]=dz;l[889]=cz;l[890]=Z;l[891]=yl;l[892]=Ci;l[893]=Xy;l[894]=Ry;l[895]=Qy;l[896]=Sy;l[897]=Oy;l[898]=Ny;l[899]=Wy;l[900]=Vy;l[901]=Z;l[902]=My;l[903]=la;l[904]=Z;l[905]=By;l[906]=Lb;l[907]=cd;l[908]=Ay;l[909]=zy;l[910]=ty;l[911]=uy;l[912]=sy;l[913]=Z;l[914]=la;l[915]=Z;l[916]=Zc;l[917]=Zc;l[918]=Zx;l[919]=Px;l[920]=Sx;l[921]=Xx;l[922]=Z;l[923]=Qx;l[924]=Tx;l[925]=Wx;l[926]=Z;l[927]=Rx;l[928]=Ux;l[929]=Vx;function O(){return buffer.byteLength/65536|0;}return{"__wasm_call_ctors":rL,"__em_js__array_bounds_check_error":qL,"emscripten_bind_btCollisionWorld_getDispatcher_0":xd,"emscripten_bind_btCollisionWorld_rayTest_3":qd,"emscripten_bind_btCollisionWorld_getPairCache_0":md,"emscripten_bind_btCollisionWorld_getDispatchInfo_0":kd,"emscripten_bind_btCollisionWorld_addCollisionObject_1":jh,"emscripten_bind_btCollisionWorld_addCollisionObject_2":Rg,"emscripten_bind_btCollisionWorld_addCollisionObject_3":te,"emscripten_bind_btCollisionWorld_removeCollisionObject_1":ne,"emscripten_bind_btCollisionWorld_getBroadphase_0":fe,"emscripten_bind_btCollisionWorld_convexSweepTest_5":ce,"emscripten_bind_btCollisionWorld_contactPairTest_3":_d,"emscripten_bind_btCollisionWorld_contactTest_2":Ud,"emscripten_bind_btCollisionWorld_updateSingleAabb_1":Md,"emscripten_bind_btCollisionWorld_setDebugDrawer_1":Sc,"emscripten_bind_btCollisionWorld_getDebugDrawer_0":Fd,"emscripten_bind_btCollisionWorld_debugDrawWorld_0":Cd,"emscripten_bind_btCollisionWorld_debugDrawObject_3":wd,"emscripten_bind_btCollisionWorld___destroy___0":_,"emscripten_bind_btCollisionShape_setLocalScaling_1":oa,"emscripten_bind_btCollisionShape_getLocalScaling_0":na,"emscripten_bind_btCollisionShape_calculateLocalInertia_2":ma,"emscripten_bind_btCollisionShape_setMargin_1":Ea,"emscripten_bind_btCollisionShape_getMargin_0":Da,"emscripten_bind_btCollisionShape___destroy___0":_,"emscripten_bind_btCollisionObject_setAnisotropicFriction_2":Gc,"emscripten_bind_btCollisionObject_getCollisionShape_0":Fc,"emscripten_bind_btCollisionObject_setContactProcessingThreshold_1":Vb,"emscripten_bind_btCollisionObject_setActivationState_1":Dc,"emscripten_bind_btCollisionObject_forceActivationState_1":Cc,"emscripten_bind_btCollisionObject_activate_0":Bc,"emscripten_bind_btCollisionObject_activate_1":Ac,"emscripten_bind_btCollisionObject_isActive_0":zc,"emscripten_bind_btCollisionObject_isKinematicObject_0":yc,"emscripten_bind_btCollisionObject_isStaticObject_0":xc,"emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0":wc,"emscripten_bind_btCollisionObject_getRestitution_0":uc,"emscripten_bind_btCollisionObject_getFriction_0":tc,"emscripten_bind_btCollisionObject_getRollingFriction_0":sc,"emscripten_bind_btCollisionObject_setRestitution_1":qc,"emscripten_bind_btCollisionObject_setFriction_1":pc,"emscripten_bind_btCollisionObject_setRollingFriction_1":oc,"emscripten_bind_btCollisionObject_getWorldTransform_0":Tb,"emscripten_bind_btCollisionObject_getCollisionFlags_0":nc,"emscripten_bind_btCollisionObject_setCollisionFlags_1":mc,"emscripten_bind_btCollisionObject_setWorldTransform_1":lc,"emscripten_bind_btCollisionObject_setCollisionShape_1":zb,"emscripten_bind_btCollisionObject_setCcdMotionThreshold_1":kc,"emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1":jc,"emscripten_bind_btCollisionObject_getUserIndex_0":Pa,"emscripten_bind_btCollisionObject_setUserIndex_1":Oa,"emscripten_bind_btCollisionObject_getUserPointer_0":Pa,"emscripten_bind_btCollisionObject_setUserPointer_1":Oa,"emscripten_bind_btCollisionObject_getBroadphaseHandle_0":Rb,"emscripten_bind_btCollisionObject___destroy___0":ic,"emscripten_bind_btDynamicsWorld_addAction_1":jd,"emscripten_bind_btDynamicsWorld_removeAction_1":Ne,"emscripten_bind_btDynamicsWorld_getSolverInfo_0":Me,"emscripten_bind_btDynamicsWorld_setInternalTickCallback_1":Ke,"emscripten_bind_btDynamicsWorld_setInternalTickCallback_2":Ie,"emscripten_bind_btDynamicsWorld_setInternalTickCallback_3":He,"emscripten_bind_btDynamicsWorld_getDispatcher_0":xd,"emscripten_bind_btDynamicsWorld_rayTest_3":qd,"emscripten_bind_btDynamicsWorld_getPairCache_0":md,"emscripten_bind_btDynamicsWorld_getDispatchInfo_0":kd,"emscripten_bind_btDynamicsWorld_addCollisionObject_1":jh,"emscripten_bind_btDynamicsWorld_addCollisionObject_2":Rg,"emscripten_bind_btDynamicsWorld_addCollisionObject_3":te,"emscripten_bind_btDynamicsWorld_removeCollisionObject_1":ne,"emscripten_bind_btDynamicsWorld_getBroadphase_0":fe,"emscripten_bind_btDynamicsWorld_convexSweepTest_5":ce,"emscripten_bind_btDynamicsWorld_contactPairTest_3":_d,"emscripten_bind_btDynamicsWorld_contactTest_2":Ud,"emscripten_bind_btDynamicsWorld_updateSingleAabb_1":Md,"emscripten_bind_btDynamicsWorld_setDebugDrawer_1":Sc,"emscripten_bind_btDynamicsWorld_getDebugDrawer_0":Fd,"emscripten_bind_btDynamicsWorld_debugDrawWorld_0":Cd,"emscripten_bind_btDynamicsWorld_debugDrawObject_3":wd,"emscripten_bind_btDynamicsWorld___destroy___0":_,"emscripten_bind_btTypedConstraint_enableFeedback_1":kb,"emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0":jb,"emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1":ib,"emscripten_bind_btTypedConstraint_getParam_2":hb,"emscripten_bind_btTypedConstraint_setParam_3":gb,"emscripten_bind_btTypedConstraint___destroy___0":_,"emscripten_bind_btConcaveShape_setLocalScaling_1":oa,"emscripten_bind_btConcaveShape_getLocalScaling_0":na,"emscripten_bind_btConcaveShape_calculateLocalInertia_2":ma,"emscripten_bind_btConcaveShape___destroy___0":_,"emscripten_bind_btCapsuleShape_btCapsuleShape_2":qo,"emscripten_bind_btCapsuleShape_setMargin_1":Ea,"emscripten_bind_btCapsuleShape_getMargin_0":Da,"emscripten_bind_btCapsuleShape_getUpAxis_0":hd,"emscripten_bind_btCapsuleShape_getRadius_0":Fe,"emscripten_bind_btCapsuleShape_getHalfHeight_0":Ee,"emscripten_bind_btCapsuleShape_setLocalScaling_1":oa,"emscripten_bind_btCapsuleShape_getLocalScaling_0":na,"emscripten_bind_btCapsuleShape_calculateLocalInertia_2":ma,"emscripten_bind_btCapsuleShape___destroy___0":_,"emscripten_bind_btIDebugDraw_drawLine_3":Ug,"emscripten_bind_btIDebugDraw_drawContactPoint_5":Sg,"emscripten_bind_btIDebugDraw_reportErrorWarning_1":Qg,"emscripten_bind_btIDebugDraw_draw3dText_2":Pg,"emscripten_bind_btIDebugDraw_setDebugMode_1":Mg,"emscripten_bind_btIDebugDraw_getDebugMode_0":Ig,"emscripten_bind_btIDebugDraw___destroy___0":_,"emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0":Am,"emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1":lm,"emscripten_bind_btDefaultCollisionConfiguration___destroy___0":_,"emscripten_bind_btTriangleMeshShape_setLocalScaling_1":oa,"emscripten_bind_btTriangleMeshShape_getLocalScaling_0":na,"emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2":ma,"emscripten_bind_btTriangleMeshShape___destroy___0":_,"emscripten_bind_btGhostObject_btGhostObject_0":cm,"emscripten_bind_btGhostObject_getNumOverlappingObjects_0":Eg,"emscripten_bind_btGhostObject_getOverlappingObject_1":Il,"emscripten_bind_btGhostObject_setAnisotropicFriction_2":Gc,"emscripten_bind_btGhostObject_getCollisionShape_0":Fc,"emscripten_bind_btGhostObject_setContactProcessingThreshold_1":Vb,"emscripten_bind_btGhostObject_setActivationState_1":Dc,"emscripten_bind_btGhostObject_forceActivationState_1":Cc,"emscripten_bind_btGhostObject_activate_0":Bc,"emscripten_bind_btGhostObject_activate_1":Ac,"emscripten_bind_btGhostObject_isActive_0":zc,"emscripten_bind_btGhostObject_isKinematicObject_0":yc,"emscripten_bind_btGhostObject_isStaticObject_0":xc,"emscripten_bind_btGhostObject_isStaticOrKinematicObject_0":wc,"emscripten_bind_btGhostObject_getRestitution_0":uc,"emscripten_bind_btGhostObject_getFriction_0":tc,"emscripten_bind_btGhostObject_getRollingFriction_0":sc,"emscripten_bind_btGhostObject_setRestitution_1":qc,"emscripten_bind_btGhostObject_setFriction_1":pc,"emscripten_bind_btGhostObject_setRollingFriction_1":oc,"emscripten_bind_btGhostObject_getWorldTransform_0":Tb,"emscripten_bind_btGhostObject_getCollisionFlags_0":nc,"emscripten_bind_btGhostObject_setCollisionFlags_1":mc,"emscripten_bind_btGhostObject_setWorldTransform_1":lc,"emscripten_bind_btGhostObject_setCollisionShape_1":zb,"emscripten_bind_btGhostObject_setCcdMotionThreshold_1":kc,"emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1":jc,"emscripten_bind_btGhostObject_getUserIndex_0":Pa,"emscripten_bind_btGhostObject_setUserIndex_1":Oa,"emscripten_bind_btGhostObject_getUserPointer_0":Pa,"emscripten_bind_btGhostObject_setUserPointer_1":Oa,"emscripten_bind_btGhostObject_getBroadphaseHandle_0":Rb,"emscripten_bind_btGhostObject___destroy___0":ic,"emscripten_bind_btConeShape_btConeShape_2":cL,"emscripten_bind_btConeShape_setLocalScaling_1":oa,"emscripten_bind_btConeShape_getLocalScaling_0":na,"emscripten_bind_btConeShape_calculateLocalInertia_2":ma,"emscripten_bind_btConeShape___destroy___0":_,"emscripten_bind_btActionInterface_updateAction_2":tg,"emscripten_bind_btActionInterface___destroy___0":_,"emscripten_bind_btVector3_btVector3_0":OK,"emscripten_bind_btVector3_btVector3_3":GK,"emscripten_bind_btVector3_length_0":zl,"emscripten_bind_btVector3_x_0":me,"emscripten_bind_btVector3_y_0":ke,"emscripten_bind_btVector3_z_0":je,"emscripten_bind_btVector3_setX_1":ie,"emscripten_bind_btVector3_setY_1":he,"emscripten_bind_btVector3_setZ_1":ge,"emscripten_bind_btVector3_setValue_3":aJ,"emscripten_bind_btVector3_normalize_0":dl,"emscripten_bind_btVector3_rotate_2":tI,"emscripten_bind_btVector3_dot_1":Pk,"emscripten_bind_btVector3_op_mul_1":Nk,"emscripten_bind_btVector3_op_add_1":Hk,"emscripten_bind_btVector3_op_sub_1":Ek,"emscripten_bind_btVector3___destroy___0":_c,"emscripten_bind_btVehicleRaycaster_castRay_3":yk,"emscripten_bind_btVehicleRaycaster___destroy___0":_,"emscripten_bind_btQuadWord_x_0":me,"emscripten_bind_btQuadWord_y_0":ke,"emscripten_bind_btQuadWord_z_0":je,"emscripten_bind_btQuadWord_w_0":Zf,"emscripten_bind_btQuadWord_setX_1":ie,"emscripten_bind_btQuadWord_setY_1":he,"emscripten_bind_btQuadWord_setZ_1":ge,"emscripten_bind_btQuadWord_setW_1":sk,"emscripten_bind_btQuadWord___destroy___0":pa,"emscripten_bind_btCylinderShape_btCylinderShape_1":fF,"emscripten_bind_btCylinderShape_setMargin_1":Ea,"emscripten_bind_btCylinderShape_getMargin_0":Da,"emscripten_bind_btCylinderShape_setLocalScaling_1":oa,"emscripten_bind_btCylinderShape_getLocalScaling_0":na,"emscripten_bind_btCylinderShape_calculateLocalInertia_2":ma,"emscripten_bind_btCylinderShape___destroy___0":_,"emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4":$E,"emscripten_bind_btDiscreteDynamicsWorld_setGravity_1":jk,"emscripten_bind_btDiscreteDynamicsWorld_getGravity_0":KE,"emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1":gk,"emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3":dk,"emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1":ak,"emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1":Zj,"emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2":Xj,"emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1":Rf,"emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1":Rj,"emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2":Pj,"emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3":Lj,"emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1":Ij,"emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1":Ej,"emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1":zj,"emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0":xd,"emscripten_bind_btDiscreteDynamicsWorld_rayTest_3":qd,"emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0":md,"emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0":kd,"emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1":xj,"emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2":vj,"emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3":te,"emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1":ne,"emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0":fe,"emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5":ce,"emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3":_d,"emscripten_bind_btDiscreteDynamicsWorld_contactTest_2":Ud,"emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1":Md,"emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1":Sc,"emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0":Fd,"emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0":Cd,"emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3":wd,"emscripten_bind_btDiscreteDynamicsWorld_addAction_1":jd,"emscripten_bind_btDiscreteDynamicsWorld_removeAction_1":Ne,"emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0":Me,"emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1":Ke,"emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2":Ie,"emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3":He,"emscripten_bind_btDiscreteDynamicsWorld___destroy___0":_,"emscripten_bind_btConvexShape_setLocalScaling_1":oa,"emscripten_bind_btConvexShape_getLocalScaling_0":na,"emscripten_bind_btConvexShape_calculateLocalInertia_2":ma,"emscripten_bind_btConvexShape_setMargin_1":Ea,"emscripten_bind_btConvexShape_getMargin_0":Da,"emscripten_bind_btConvexShape___destroy___0":_,"emscripten_bind_btDispatcher_getNumManifolds_0":Mf,"emscripten_bind_btDispatcher_getManifoldByIndexInternal_1":rj,"emscripten_bind_btDispatcher___destroy___0":_,"emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3":GC,"emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5":xC,"emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1":pj,"emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1":mj,"emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1":hj,"emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1":dj,"emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0":Gd,"emscripten_bind_btGeneric6DofConstraint_enableFeedback_1":kb,"emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0":jb,"emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1":ib,"emscripten_bind_btGeneric6DofConstraint_getParam_2":hb,"emscripten_bind_btGeneric6DofConstraint_setParam_3":gb,"emscripten_bind_btGeneric6DofConstraint___destroy___0":_,"emscripten_bind_btStridingMeshInterface_setScaling_1":Zi,"emscripten_bind_btStridingMeshInterface___destroy___0":_,"emscripten_bind_btMotionState_getWorldTransform_1":Ui,"emscripten_bind_btMotionState_setWorldTransform_1":zb,"emscripten_bind_btMotionState___destroy___0":_,"emscripten_bind_ConvexResultCallback_hasHit_0":Si,"emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0":Qi,"emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1":Pi,"emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0":Li,"emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1":Ii,"emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0":Ua,"emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1":Ta,"emscripten_bind_ConvexResultCallback___destroy___0":_,"emscripten_bind_ContactResultCallback_addSingleResult_7":Gi,"emscripten_bind_ContactResultCallback___destroy___0":_,"emscripten_bind_btSoftBodySolver___destroy___0":_,"emscripten_bind_RayResultCallback_hasHit_0":wf,"emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0":vf,"emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1":uf,"emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0":tf,"emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1":sf,"emscripten_bind_RayResultCallback_get_m_closestHitFraction_0":Ua,"emscripten_bind_RayResultCallback_set_m_closestHitFraction_1":Ta,"emscripten_bind_RayResultCallback_get_m_collisionObject_0":zd,"emscripten_bind_RayResultCallback_set_m_collisionObject_1":yd,"emscripten_bind_RayResultCallback___destroy___0":_,"emscripten_bind_btMatrix3x3_setEulerZYX_3":ly,"emscripten_bind_btMatrix3x3_getRotation_1":$x,"emscripten_bind_btMatrix3x3_getRow_1":Nx,"emscripten_bind_btMatrix3x3___destroy___0":pa,"emscripten_bind_btScalarArray_size_0":Ia,"emscripten_bind_btScalarArray_at_1":Kx,"emscripten_bind_btScalarArray___destroy___0":Ra,"emscripten_bind_Material_get_m_kLST_0":Ua,"emscripten_bind_Material_set_m_kLST_1":Ta,"emscripten_bind_Material_get_m_kAST_0":Nc,"emscripten_bind_Material_set_m_kAST_1":Mc,"emscripten_bind_Material_get_m_kVST_0":Lc,"emscripten_bind_Material_set_m_kVST_1":Kc,"emscripten_bind_Material_get_m_flags_0":Ix,"emscripten_bind_Material_set_m_flags_1":Hx,"emscripten_bind_Material___destroy___0":pa,"emscripten_bind_btDispatcherInfo_get_m_timeStep_0":td,"emscripten_bind_btDispatcherInfo_set_m_timeStep_1":sd,"emscripten_bind_btDispatcherInfo_get_m_stepCount_0":zg,"emscripten_bind_btDispatcherInfo_set_m_stepCount_1":ef,"emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0":zd,"emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1":yd,"emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0":Lc,"emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1":Kc,"emscripten_bind_btDispatcherInfo_get_m_useContinuous_0":Gx,"emscripten_bind_btDispatcherInfo_set_m_useContinuous_1":Fx,"emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0":Ex,"emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1":Dx,"emscripten_bind_btDispatcherInfo_get_m_enableSPU_0":Cx,"emscripten_bind_btDispatcherInfo_set_m_enableSPU_1":Bx,"emscripten_bind_btDispatcherInfo_get_m_useEpa_0":Ax,"emscripten_bind_btDispatcherInfo_set_m_useEpa_1":zx,"emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0":ri,"emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1":qi,"emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0":yx,"emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1":xx,"emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0":df,"emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1":cf,"emscripten_bind_btDispatcherInfo___destroy___0":pa,"emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0":Ha,"emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1":rd,"emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0":Jc,"emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1":Ic,"emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0":pi,"emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1":oi,"emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0":ni,"emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1":mi,"emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0":li,"emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1":ki,"emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0":ji,"emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1":ii,"emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0":hi,"emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1":gi,"emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0":fi,"emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1":ei,"emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0":di,"emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1":ci,"emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0":bi,"emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1":ai,"emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0":$h,"emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1":_h,"emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0":wx,"emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1":vx,"emscripten_bind_btWheelInfoConstructionInfo___destroy___0":pa,"emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1":ux,"emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2":tx,"emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1":oa,"emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0":na,"emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2":ma,"emscripten_bind_btConvexTriangleMeshShape_setMargin_1":Ea,"emscripten_bind_btConvexTriangleMeshShape_getMargin_0":Da,"emscripten_bind_btConvexTriangleMeshShape___destroy___0":_,"emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0":Mf,"emscripten_bind_btBroadphaseInterface___destroy___0":_,"emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3":sx,"emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4":rx,"emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0":af,"emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1":$e,"emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0":qx,"emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1":px,"emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0":ox,"emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1":nx,"emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0":mx,"emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1":lx,"emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0":kx,"emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1":jx,"emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0":ix,"emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1":hx,"emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0":gx,"emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1":fx,"emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0":ex,"emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1":dx,"emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0":cx,"emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1":bx,"emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0":ax,"emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1":_w,"emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0":Zw,"emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1":Yw,"emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0":Xw,"emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1":Ww,"emscripten_bind_btRigidBodyConstructionInfo___destroy___0":pa,"emscripten_bind_btCollisionConfiguration___destroy___0":_,"emscripten_bind_btPersistentManifold_btPersistentManifold_0":Vw,"emscripten_bind_btPersistentManifold_getBody0_0":Uw,"emscripten_bind_btPersistentManifold_getBody1_0":Tw,"emscripten_bind_btPersistentManifold_getNumContacts_0":Sw,"emscripten_bind_btPersistentManifold_getContactPoint_1":Rw,"emscripten_bind_btPersistentManifold___destroy___0":_c,"emscripten_bind_btCompoundShape_btCompoundShape_0":Qw,"emscripten_bind_btCompoundShape_btCompoundShape_1":Pw,"emscripten_bind_btCompoundShape_addChildShape_2":Ow,"emscripten_bind_btCompoundShape_removeChildShape_1":jd,"emscripten_bind_btCompoundShape_removeChildShapeByIndex_1":Nw,"emscripten_bind_btCompoundShape_getNumChildShapes_0":Mw,"emscripten_bind_btCompoundShape_getChildShape_1":Kw,"emscripten_bind_btCompoundShape_updateChildTransform_2":Iw,"emscripten_bind_btCompoundShape_updateChildTransform_3":Hw,"emscripten_bind_btCompoundShape_setMargin_1":Ea,"emscripten_bind_btCompoundShape_getMargin_0":Da,"emscripten_bind_btCompoundShape_setLocalScaling_1":oa,"emscripten_bind_btCompoundShape_getLocalScaling_0":na,"emscripten_bind_btCompoundShape_calculateLocalInertia_2":ma,"emscripten_bind_btCompoundShape___destroy___0":_,"emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2":Gw,"emscripten_bind_ClosestConvexResultCallback_hasHit_0":Si,"emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0":zF,"emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1":Dw,"emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0":qh,"emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1":Cw,"emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0":Bw,"emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1":Aw,"emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0":zw,"emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1":yw,"emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0":Qi,"emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1":Pi,"emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0":Li,"emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1":Ii,"emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0":Ua,"emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1":Ta,"emscripten_bind_ClosestConvexResultCallback___destroy___0":_,"emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2":xw,"emscripten_bind_AllHitsRayResultCallback_hasHit_0":wf,"emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0":_e,"emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1":vw,"emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0":Ze,"emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1":Ye,"emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0":Xh,"emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1":Wh,"emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0":Vh,"emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1":tw,"emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0":ph,"emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1":rw,"emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0":qw,"emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1":pw,"emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0":vf,"emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1":uf,"emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0":tf,"emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1":sf,"emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0":Ua,"emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1":Ta,"emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0":zd,"emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1":yd,"emscripten_bind_AllHitsRayResultCallback___destroy___0":_,"emscripten_bind_tMaterialArray_size_0":Ia,"emscripten_bind_tMaterialArray_at_1":pd,"emscripten_bind_tMaterialArray___destroy___0":Ra,"emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1":mw,"emscripten_bind_btDefaultVehicleRaycaster_castRay_3":yk,"emscripten_bind_btDefaultVehicleRaycaster___destroy___0":_,"emscripten_bind_btEmptyShape_btEmptyShape_0":kw,"emscripten_bind_btEmptyShape_setLocalScaling_1":oa,"emscripten_bind_btEmptyShape_getLocalScaling_0":na,"emscripten_bind_btEmptyShape_calculateLocalInertia_2":ma,"emscripten_bind_btEmptyShape___destroy___0":_,"emscripten_bind_btConstraintSetting_btConstraintSetting_0":jw,"emscripten_bind_btConstraintSetting_get_m_tau_0":td,"emscripten_bind_btConstraintSetting_set_m_tau_1":sd,"emscripten_bind_btConstraintSetting_get_m_damping_0":Ua,"emscripten_bind_btConstraintSetting_set_m_damping_1":Ta,"emscripten_bind_btConstraintSetting_get_m_impulseClamp_0":Nc,"emscripten_bind_btConstraintSetting_set_m_impulseClamp_1":Mc,"emscripten_bind_btConstraintSetting___destroy___0":pa,"emscripten_bind_LocalShapeInfo_get_m_shapePart_0":od,"emscripten_bind_LocalShapeInfo_set_m_shapePart_1":nd,"emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0":zg,"emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1":ef,"emscripten_bind_LocalShapeInfo___destroy___0":pa,"emscripten_bind_btRigidBody_btRigidBody_1":iw,"emscripten_bind_btRigidBody_getCenterOfMassTransform_0":Tb,"emscripten_bind_btRigidBody_setCenterOfMassTransform_1":hw,"emscripten_bind_btRigidBody_setSleepingThresholds_2":gw,"emscripten_bind_btRigidBody_getLinearDamping_0":ew,"emscripten_bind_btRigidBody_getAngularDamping_0":dw,"emscripten_bind_btRigidBody_setDamping_2":cw,"emscripten_bind_btRigidBody_setMassProps_2":bw,"emscripten_bind_btRigidBody_getLinearFactor_0":aw,"emscripten_bind_btRigidBody_setLinearFactor_1":_v,"emscripten_bind_btRigidBody_applyTorque_1":Yv,"emscripten_bind_btRigidBody_applyLocalTorque_1":Xv,"emscripten_bind_btRigidBody_applyForce_2":Vv,"emscripten_bind_btRigidBody_applyCentralForce_1":Tv,"emscripten_bind_btRigidBody_applyCentralLocalForce_1":Sv,"emscripten_bind_btRigidBody_applyTorqueImpulse_1":Qv,"emscripten_bind_btRigidBody_applyImpulse_2":Pv,"emscripten_bind_btRigidBody_applyCentralImpulse_1":Ov,"emscripten_bind_btRigidBody_updateInertiaTensor_0":Nv,"emscripten_bind_btRigidBody_getLinearVelocity_0":Mv,"emscripten_bind_btRigidBody_getAngularVelocity_0":Lv,"emscripten_bind_btRigidBody_setLinearVelocity_1":Jv,"emscripten_bind_btRigidBody_setAngularVelocity_1":Hv,"emscripten_bind_btRigidBody_getMotionState_0":Fv,"emscripten_bind_btRigidBody_setMotionState_1":Ev,"emscripten_bind_btRigidBody_getAngularFactor_0":Cv,"emscripten_bind_btRigidBody_setAngularFactor_1":Bv,"emscripten_bind_btRigidBody_upcast_1":zv,"emscripten_bind_btRigidBody_getAabb_2":xv,"emscripten_bind_btRigidBody_applyGravity_0":wv,"emscripten_bind_btRigidBody_getGravity_0":vv,"emscripten_bind_btRigidBody_setGravity_1":uv,"emscripten_bind_btRigidBody_getBroadphaseProxy_0":Rb,"emscripten_bind_btRigidBody_clearForces_0":tv,"emscripten_bind_btRigidBody_setAnisotropicFriction_2":Gc,"emscripten_bind_btRigidBody_getCollisionShape_0":Fc,"emscripten_bind_btRigidBody_setContactProcessingThreshold_1":Vb,"emscripten_bind_btRigidBody_setActivationState_1":Dc,"emscripten_bind_btRigidBody_forceActivationState_1":Cc,"emscripten_bind_btRigidBody_activate_0":Bc,"emscripten_bind_btRigidBody_activate_1":Ac,"emscripten_bind_btRigidBody_isActive_0":zc,"emscripten_bind_btRigidBody_isKinematicObject_0":yc,"emscripten_bind_btRigidBody_isStaticObject_0":xc,"emscripten_bind_btRigidBody_isStaticOrKinematicObject_0":wc,"emscripten_bind_btRigidBody_getRestitution_0":uc,"emscripten_bind_btRigidBody_getFriction_0":tc,"emscripten_bind_btRigidBody_getRollingFriction_0":sc,"emscripten_bind_btRigidBody_setRestitution_1":qc,"emscripten_bind_btRigidBody_setFriction_1":pc,"emscripten_bind_btRigidBody_setRollingFriction_1":oc,"emscripten_bind_btRigidBody_getWorldTransform_0":Tb,"emscripten_bind_btRigidBody_getCollisionFlags_0":nc,"emscripten_bind_btRigidBody_setCollisionFlags_1":mc,"emscripten_bind_btRigidBody_setWorldTransform_1":lc,"emscripten_bind_btRigidBody_setCollisionShape_1":zb,"emscripten_bind_btRigidBody_setCcdMotionThreshold_1":kc,"emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1":jc,"emscripten_bind_btRigidBody_getUserIndex_0":Pa,"emscripten_bind_btRigidBody_setUserIndex_1":Oa,"emscripten_bind_btRigidBody_getUserPointer_0":Pa,"emscripten_bind_btRigidBody_setUserPointer_1":Oa,"emscripten_bind_btRigidBody_getBroadphaseHandle_0":Rb,"emscripten_bind_btRigidBody___destroy___0":ic,"emscripten_bind_btIndexedMeshArray_size_0":Ia,"emscripten_bind_btIndexedMeshArray_at_1":rv,"emscripten_bind_btIndexedMeshArray___destroy___0":Ra,"emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0":qv,"emscripten_bind_btDbvtBroadphase___destroy___0":_,"emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9":pv,"emscripten_bind_btHeightfieldTerrainShape_setMargin_1":Ea,"emscripten_bind_btHeightfieldTerrainShape_getMargin_0":Da,"emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1":oa,"emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0":na,"emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2":ma,"emscripten_bind_btHeightfieldTerrainShape___destroy___0":_,"emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0":ov,"emscripten_bind_btDefaultSoftBodySolver___destroy___0":_,"emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1":nv,"emscripten_bind_btCollisionDispatcher_getNumManifolds_0":Mf,"emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1":rj,"emscripten_bind_btCollisionDispatcher___destroy___0":_,"emscripten_bind_btAxisSweep3_btAxisSweep3_2":mv,"emscripten_bind_btAxisSweep3_btAxisSweep3_3":lv,"emscripten_bind_btAxisSweep3_btAxisSweep3_4":kv,"emscripten_bind_btAxisSweep3_btAxisSweep3_5":jv,"emscripten_bind_btAxisSweep3___destroy___0":_,"emscripten_bind_VoidPtr___destroy___0":pa,"emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0":iv,"emscripten_bind_btSoftBodyWorldInfo_get_air_density_0":td,"emscripten_bind_btSoftBodyWorldInfo_set_air_density_1":sd,"emscripten_bind_btSoftBodyWorldInfo_get_water_density_0":Ua,"emscripten_bind_btSoftBodyWorldInfo_set_water_density_1":Ta,"emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0":Nc,"emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1":Mc,"emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0":Lc,"emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1":Kc,"emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0":Jc,"emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1":Ic,"emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0":gv,"emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1":fv,"emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0":ev,"emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1":dv,"emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0":Ze,"emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1":Ye,"emscripten_bind_btSoftBodyWorldInfo___destroy___0":cv,"emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2":av,"emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4":$u,"emscripten_bind_btConeTwistConstraint_setLimit_2":_u,"emscripten_bind_btConeTwistConstraint_setAngularOnly_1":Yu,"emscripten_bind_btConeTwistConstraint_setDamping_1":Xu,"emscripten_bind_btConeTwistConstraint_enableMotor_1":Wu,"emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1":Vu,"emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1":Uu,"emscripten_bind_btConeTwistConstraint_setMotorTarget_1":Tu,"emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1":Su,"emscripten_bind_btConeTwistConstraint_enableFeedback_1":kb,"emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0":jb,"emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1":ib,"emscripten_bind_btConeTwistConstraint_getParam_2":hb,"emscripten_bind_btConeTwistConstraint_setParam_3":gb,"emscripten_bind_btConeTwistConstraint___destroy___0":_,"emscripten_bind_btHingeConstraint_btHingeConstraint_2":Ru,"emscripten_bind_btHingeConstraint_btHingeConstraint_3":Qu,"emscripten_bind_btHingeConstraint_btHingeConstraint_4":Ou,"emscripten_bind_btHingeConstraint_btHingeConstraint_5":Nu,"emscripten_bind_btHingeConstraint_btHingeConstraint_6":Mu,"emscripten_bind_btHingeConstraint_btHingeConstraint_7":Lu,"emscripten_bind_btHingeConstraint_setLimit_4":Ku,"emscripten_bind_btHingeConstraint_setLimit_5":Ju,"emscripten_bind_btHingeConstraint_enableAngularMotor_3":Iu,"emscripten_bind_btHingeConstraint_setAngularOnly_1":Gu,"emscripten_bind_btHingeConstraint_enableMotor_1":Fu,"emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1":Eu,"emscripten_bind_btHingeConstraint_setMotorTarget_2":Du,"emscripten_bind_btHingeConstraint_enableFeedback_1":kb,"emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0":jb,"emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1":ib,"emscripten_bind_btHingeConstraint_getParam_2":hb,"emscripten_bind_btHingeConstraint_setParam_3":gb,"emscripten_bind_btHingeConstraint___destroy___0":_,"emscripten_bind_btConeShapeZ_btConeShapeZ_2":Cu,"emscripten_bind_btConeShapeZ_setLocalScaling_1":oa,"emscripten_bind_btConeShapeZ_getLocalScaling_0":na,"emscripten_bind_btConeShapeZ_calculateLocalInertia_2":ma,"emscripten_bind_btConeShapeZ___destroy___0":_,"emscripten_bind_btConeShapeX_btConeShapeX_2":Bu,"emscripten_bind_btConeShapeX_setLocalScaling_1":oa,"emscripten_bind_btConeShapeX_getLocalScaling_0":na,"emscripten_bind_btConeShapeX_calculateLocalInertia_2":ma,"emscripten_bind_btConeShapeX___destroy___0":_,"emscripten_bind_btTriangleMesh_btTriangleMesh_0":Au,"emscripten_bind_btTriangleMesh_btTriangleMesh_1":zu,"emscripten_bind_btTriangleMesh_btTriangleMesh_2":yu,"emscripten_bind_btTriangleMesh_addTriangle_3":xu,"emscripten_bind_btTriangleMesh_addTriangle_4":wu,"emscripten_bind_btTriangleMesh_findOrAddVertex_2":uu,"emscripten_bind_btTriangleMesh_addIndex_1":tu,"emscripten_bind_btTriangleMesh_getIndexedMeshArray_0":su,"emscripten_bind_btTriangleMesh_setScaling_1":Zi,"emscripten_bind_btTriangleMesh___destroy___0":_,"emscripten_bind_btConvexHullShape_btConvexHullShape_0":ru,"emscripten_bind_btConvexHullShape_btConvexHullShape_1":qu,"emscripten_bind_btConvexHullShape_btConvexHullShape_2":pu,"emscripten_bind_btConvexHullShape_addPoint_1":ou,"emscripten_bind_btConvexHullShape_addPoint_2":nu,"emscripten_bind_btConvexHullShape_setMargin_1":Ea,"emscripten_bind_btConvexHullShape_getMargin_0":Da,"emscripten_bind_btConvexHullShape_getNumVertices_0":mu,"emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1":lu,"emscripten_bind_btConvexHullShape_recalcLocalAabb_0":ku,"emscripten_bind_btConvexHullShape_getConvexPolyhedron_0":hd,"emscripten_bind_btConvexHullShape_setLocalScaling_1":oa,"emscripten_bind_btConvexHullShape_getLocalScaling_0":na,"emscripten_bind_btConvexHullShape_calculateLocalInertia_2":ma,"emscripten_bind_btConvexHullShape___destroy___0":_,"emscripten_bind_btVehicleTuning_btVehicleTuning_0":ju,"emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0":td,"emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1":sd,"emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0":Ua,"emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1":Ta,"emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0":Nc,"emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1":Mc,"emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0":Lc,"emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1":Kc,"emscripten_bind_btVehicleTuning_get_m_frictionSlip_0":lh,"emscripten_bind_btVehicleTuning_set_m_frictionSlip_1":Oh,"emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0":Nh,"emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1":Mh,"emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0":hu,"emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0":gu,"emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0":Ia,"emscripten_bind_btShapeHull_btShapeHull_1":fu,"emscripten_bind_btShapeHull_buildHull_1":eu,"emscripten_bind_btShapeHull_numVertices_0":cu,"emscripten_bind_btShapeHull_getVertexPointer_0":bu,"emscripten_bind_btShapeHull___destroy___0":$t,"emscripten_bind_btDefaultMotionState_btDefaultMotionState_0":_t,"emscripten_bind_btDefaultMotionState_btDefaultMotionState_1":Yt,"emscripten_bind_btDefaultMotionState_btDefaultMotionState_2":Xt,"emscripten_bind_btDefaultMotionState_getWorldTransform_1":Ui,"emscripten_bind_btDefaultMotionState_setWorldTransform_1":zb,"emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0":Qe,"emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1":Wt,"emscripten_bind_btDefaultMotionState___destroy___0":_,"emscripten_bind_btWheelInfo_btWheelInfo_1":Vt,"emscripten_bind_btWheelInfo_getSuspensionRestLength_0":St,"emscripten_bind_btWheelInfo_updateWheel_2":Rt,"emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0":Qt,"emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1":Ot,"emscripten_bind_btWheelInfo_get_m_frictionSlip_0":Pu,"emscripten_bind_btWheelInfo_set_m_frictionSlip_1":Nt,"emscripten_bind_btWheelInfo_get_m_engineForce_0":Mt,"emscripten_bind_btWheelInfo_set_m_engineForce_1":Lt,"emscripten_bind_btWheelInfo_get_m_rollInfluence_0":Kt,"emscripten_bind_btWheelInfo_set_m_rollInfluence_1":Jt,"emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0":It,"emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1":Ht,"emscripten_bind_btWheelInfo_get_m_wheelsRadius_0":Gt,"emscripten_bind_btWheelInfo_set_m_wheelsRadius_1":Ft,"emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0":Et,"emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1":Dt,"emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0":vu,"emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1":Ct,"emscripten_bind_btWheelInfo_get_m_steering_0":du,"emscripten_bind_btWheelInfo_set_m_steering_1":Bt,"emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0":At,"emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1":zt,"emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0":yt,"emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1":xt,"emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0":wt,"emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1":vt,"emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0":st,"emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1":rt,"emscripten_bind_btWheelInfo_get_m_raycastInfo_0":Ha,"emscripten_bind_btWheelInfo_set_m_raycastInfo_1":qt,"emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0":pt,"emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1":ot,"emscripten_bind_btWheelInfo_get_m_worldTransform_0":ph,"emscripten_bind_btWheelInfo_set_m_worldTransform_1":nt,"emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0":mt,"emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1":lt,"emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0":kt,"emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1":jt,"emscripten_bind_btWheelInfo_get_m_rotation_0":it,"emscripten_bind_btWheelInfo_set_m_rotation_1":ht,"emscripten_bind_btWheelInfo_get_m_deltaRotation_0":gt,"emscripten_bind_btWheelInfo_set_m_deltaRotation_1":ft,"emscripten_bind_btWheelInfo_get_m_brake_0":et,"emscripten_bind_btWheelInfo_set_m_brake_1":dt,"emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0":ct,"emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1":bt,"emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0":at,"emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1":$s,"emscripten_bind_btWheelInfo_get_m_skidInfo_0":Zs,"emscripten_bind_btWheelInfo_set_m_skidInfo_1":Ys,"emscripten_bind_btWheelInfo___destroy___0":pa,"emscripten_bind_btVector4_btVector4_0":Xs,"emscripten_bind_btVector4_btVector4_4":Ws,"emscripten_bind_btVector4_w_0":Zf,"emscripten_bind_btVector4_setValue_4":Lh,"emscripten_bind_btVector4_length_0":zl,"emscripten_bind_btVector4_x_0":me,"emscripten_bind_btVector4_y_0":ke,"emscripten_bind_btVector4_z_0":je,"emscripten_bind_btVector4_setX_1":ie,"emscripten_bind_btVector4_setY_1":he,"emscripten_bind_btVector4_setZ_1":ge,"emscripten_bind_btVector4_normalize_0":dl,"emscripten_bind_btVector4_rotate_2":Us,"emscripten_bind_btVector4_dot_1":Pk,"emscripten_bind_btVector4_op_mul_1":Nk,"emscripten_bind_btVector4_op_add_1":Hk,"emscripten_bind_btVector4_op_sub_1":Ek,"emscripten_bind_btVector4___destroy___0":_c,"emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0":Ts,"emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0":pa,"emscripten_bind_Anchor_get_m_node_0":od,"emscripten_bind_Anchor_set_m_node_1":nd,"emscripten_bind_Anchor_get_m_local_0":Qe,"emscripten_bind_Anchor_set_m_local_1":Xi,"emscripten_bind_Anchor_get_m_body_0":Kh,"emscripten_bind_Anchor_set_m_body_1":Jh,"emscripten_bind_Anchor_get_m_influence_0":Ih,"emscripten_bind_Anchor_set_m_influence_1":Hh,"emscripten_bind_Anchor_get_m_c0_0":qh,"emscripten_bind_Anchor_set_m_c0_1":Ss,"emscripten_bind_Anchor_get_m_c1_0":Rs,"emscripten_bind_Anchor_set_m_c1_1":Qs,"emscripten_bind_Anchor_get_m_c2_0":af,"emscripten_bind_Anchor_set_m_c2_1":$e,"emscripten_bind_Anchor___destroy___0":pa,"emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0":Ha,"emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1":rd,"emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0":Jc,"emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1":Ic,"emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0":Se,"emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1":Re,"emscripten_bind_btVehicleRaycasterResult___destroy___0":pa,"emscripten_bind_btVector3Array_size_0":Ia,"emscripten_bind_btVector3Array_at_1":Ps,"emscripten_bind_btVector3Array___destroy___0":Ra,"emscripten_bind_btConstraintSolver___destroy___0":_,"emscripten_bind_btRaycastVehicle_btRaycastVehicle_3":Os,"emscripten_bind_btRaycastVehicle_applyEngineForce_2":Ns,"emscripten_bind_btRaycastVehicle_setSteeringValue_2":Ms,"emscripten_bind_btRaycastVehicle_getWheelTransformWS_1":Ls,"emscripten_bind_btRaycastVehicle_updateWheelTransform_2":Ks,"emscripten_bind_btRaycastVehicle_addWheel_7":Js,"emscripten_bind_btRaycastVehicle_getNumWheels_0":Is,"emscripten_bind_btRaycastVehicle_getRigidBody_0":Gs,"emscripten_bind_btRaycastVehicle_getWheelInfo_1":Fs,"emscripten_bind_btRaycastVehicle_setBrake_2":Es,"emscripten_bind_btRaycastVehicle_setCoordinateSystem_3":Ds,"emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0":Cs,"emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0":Bs,"emscripten_bind_btRaycastVehicle_rayCast_1":As,"emscripten_bind_btRaycastVehicle_updateVehicle_1":zs,"emscripten_bind_btRaycastVehicle_resetSuspension_0":ys,"emscripten_bind_btRaycastVehicle_getSteeringValue_1":xs,"emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1":ws,"emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2":vs,"emscripten_bind_btRaycastVehicle_setPitchControl_1":us,"emscripten_bind_btRaycastVehicle_updateSuspension_1":ts,"emscripten_bind_btRaycastVehicle_updateFriction_1":ss,"emscripten_bind_btRaycastVehicle_getRightAxis_0":rs,"emscripten_bind_btRaycastVehicle_getUpAxis_0":qs,"emscripten_bind_btRaycastVehicle_getForwardAxis_0":ps,"emscripten_bind_btRaycastVehicle_getForwardVector_0":os,"emscripten_bind_btRaycastVehicle_getUserConstraintType_0":ms,"emscripten_bind_btRaycastVehicle_setUserConstraintType_1":ks,"emscripten_bind_btRaycastVehicle_setUserConstraintId_1":js,"emscripten_bind_btRaycastVehicle_getUserConstraintId_0":is,"emscripten_bind_btRaycastVehicle_updateAction_2":tg,"emscripten_bind_btRaycastVehicle___destroy___0":_,"emscripten_bind_btCylinderShapeX_btCylinderShapeX_1":hs,"emscripten_bind_btCylinderShapeX_setMargin_1":Ea,"emscripten_bind_btCylinderShapeX_getMargin_0":Da,"emscripten_bind_btCylinderShapeX_setLocalScaling_1":oa,"emscripten_bind_btCylinderShapeX_getLocalScaling_0":na,"emscripten_bind_btCylinderShapeX_calculateLocalInertia_2":ma,"emscripten_bind_btCylinderShapeX___destroy___0":_,"emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1":gs,"emscripten_bind_btCylinderShapeZ_setMargin_1":Ea,"emscripten_bind_btCylinderShapeZ_getMargin_0":Da,"emscripten_bind_btCylinderShapeZ_setLocalScaling_1":oa,"emscripten_bind_btCylinderShapeZ_getLocalScaling_0":na,"emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2":ma,"emscripten_bind_btCylinderShapeZ___destroy___0":_,"emscripten_bind_btConvexPolyhedron_get_m_vertices_0":Qe,"emscripten_bind_btConvexPolyhedron_set_m_vertices_1":fs,"emscripten_bind_btConvexPolyhedron_get_m_faces_0":Pe,"emscripten_bind_btConvexPolyhedron_set_m_faces_1":es,"emscripten_bind_btConvexPolyhedron___destroy___0":_,"emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0":as,"emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0":_,"emscripten_bind_tAnchorArray_size_0":Ia,"emscripten_bind_tAnchorArray_at_1":$r,"emscripten_bind_tAnchorArray_clear_0":Qa,"emscripten_bind_tAnchorArray_push_back_1":Zr,"emscripten_bind_tAnchorArray_pop_back_0":Yr,"emscripten_bind_tAnchorArray___destroy___0":Ra,"emscripten_bind_RaycastInfo_get_m_contactNormalWS_0":Ha,"emscripten_bind_RaycastInfo_set_m_contactNormalWS_1":rd,"emscripten_bind_RaycastInfo_get_m_contactPointWS_0":Jc,"emscripten_bind_RaycastInfo_set_m_contactPointWS_1":Ic,"emscripten_bind_RaycastInfo_get_m_suspensionLength_0":Se,"emscripten_bind_RaycastInfo_set_m_suspensionLength_1":Re,"emscripten_bind_RaycastInfo_get_m_hardPointWS_0":Bh,"emscripten_bind_RaycastInfo_set_m_hardPointWS_1":Ah,"emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0":zh,"emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1":yh,"emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0":xh,"emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1":wh,"emscripten_bind_RaycastInfo_get_m_isInContact_0":Xr,"emscripten_bind_RaycastInfo_set_m_isInContact_1":Wr,"emscripten_bind_RaycastInfo_get_m_groundObject_0":Gh,"emscripten_bind_RaycastInfo_set_m_groundObject_1":vh,"emscripten_bind_RaycastInfo___destroy___0":pa,"emscripten_bind_btMultiSphereShape_btMultiSphereShape_3":Vr,"emscripten_bind_btMultiSphereShape_setLocalScaling_1":oa,"emscripten_bind_btMultiSphereShape_getLocalScaling_0":na,"emscripten_bind_btMultiSphereShape_calculateLocalInertia_2":ma,"emscripten_bind_btMultiSphereShape___destroy___0":_,"emscripten_bind_btSoftBody_btSoftBody_4":Ur,"emscripten_bind_btSoftBody_checkLink_2":Tr,"emscripten_bind_btSoftBody_checkFace_3":Sr,"emscripten_bind_btSoftBody_appendMaterial_0":Rr,"emscripten_bind_btSoftBody_appendNode_2":Qr,"emscripten_bind_btSoftBody_appendLink_4":Pr,"emscripten_bind_btSoftBody_appendFace_4":Or,"emscripten_bind_btSoftBody_appendTetra_5":Nr,"emscripten_bind_btSoftBody_appendAnchor_4":Mr,"emscripten_bind_btSoftBody_addForce_1":Lr,"emscripten_bind_btSoftBody_addForce_2":Kr,"emscripten_bind_btSoftBody_addAeroForceToNode_2":Jr,"emscripten_bind_btSoftBody_getTotalMass_0":Ir,"emscripten_bind_btSoftBody_setTotalMass_2":Hr,"emscripten_bind_btSoftBody_setMass_2":Gr,"emscripten_bind_btSoftBody_transform_1":Fr,"emscripten_bind_btSoftBody_translate_1":Er,"emscripten_bind_btSoftBody_rotate_1":Dr,"emscripten_bind_btSoftBody_scale_1":Cr,"emscripten_bind_btSoftBody_generateClusters_1":Br,"emscripten_bind_btSoftBody_generateClusters_2":Ar,"emscripten_bind_btSoftBody_generateBendingConstraints_2":zr,"emscripten_bind_btSoftBody_upcast_1":yr,"emscripten_bind_btSoftBody_setAnisotropicFriction_2":Gc,"emscripten_bind_btSoftBody_getCollisionShape_0":Fc,"emscripten_bind_btSoftBody_setContactProcessingThreshold_1":Vb,"emscripten_bind_btSoftBody_setActivationState_1":Dc,"emscripten_bind_btSoftBody_forceActivationState_1":Cc,"emscripten_bind_btSoftBody_activate_0":Bc,"emscripten_bind_btSoftBody_activate_1":Ac,"emscripten_bind_btSoftBody_isActive_0":zc,"emscripten_bind_btSoftBody_isKinematicObject_0":yc,"emscripten_bind_btSoftBody_isStaticObject_0":xc,"emscripten_bind_btSoftBody_isStaticOrKinematicObject_0":wc,"emscripten_bind_btSoftBody_getRestitution_0":uc,"emscripten_bind_btSoftBody_getFriction_0":tc,"emscripten_bind_btSoftBody_getRollingFriction_0":sc,"emscripten_bind_btSoftBody_setRestitution_1":qc,"emscripten_bind_btSoftBody_setFriction_1":pc,"emscripten_bind_btSoftBody_setRollingFriction_1":oc,"emscripten_bind_btSoftBody_getWorldTransform_0":Tb,"emscripten_bind_btSoftBody_getCollisionFlags_0":nc,"emscripten_bind_btSoftBody_setCollisionFlags_1":mc,"emscripten_bind_btSoftBody_setWorldTransform_1":lc,"emscripten_bind_btSoftBody_setCollisionShape_1":zb,"emscripten_bind_btSoftBody_setCcdMotionThreshold_1":kc,"emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1":jc,"emscripten_bind_btSoftBody_getUserIndex_0":Pa,"emscripten_bind_btSoftBody_setUserIndex_1":Oa,"emscripten_bind_btSoftBody_getUserPointer_0":Pa,"emscripten_bind_btSoftBody_setUserPointer_1":Oa,"emscripten_bind_btSoftBody_getBroadphaseHandle_0":Rb,"emscripten_bind_btSoftBody_get_m_cfg_0":wr,"emscripten_bind_btSoftBody_set_m_cfg_1":vr,"emscripten_bind_btSoftBody_get_m_nodes_0":tr,"emscripten_bind_btSoftBody_set_m_nodes_1":sr,"emscripten_bind_btSoftBody_get_m_faces_0":pr,"emscripten_bind_btSoftBody_set_m_faces_1":or,"emscripten_bind_btSoftBody_get_m_materials_0":lr,"emscripten_bind_btSoftBody_set_m_materials_1":kr,"emscripten_bind_btSoftBody_get_m_anchors_0":jr,"emscripten_bind_btSoftBody_set_m_anchors_1":ir,"emscripten_bind_btSoftBody___destroy___0":ic,"emscripten_bind_btIntArray_size_0":Ia,"emscripten_bind_btIntArray_at_1":pd,"emscripten_bind_btIntArray___destroy___0":Ra,"emscripten_bind_Config_get_kVCF_0":Ua,"emscripten_bind_Config_set_kVCF_1":Ta,"emscripten_bind_Config_get_kDP_0":Nc,"emscripten_bind_Config_set_kDP_1":Mc,"emscripten_bind_Config_get_kDG_0":Lc,"emscripten_bind_Config_set_kDG_1":Kc,"emscripten_bind_Config_get_kLF_0":lh,"emscripten_bind_Config_set_kLF_1":Oh,"emscripten_bind_Config_get_kPR_0":Nh,"emscripten_bind_Config_set_kPR_1":Mh,"emscripten_bind_Config_get_kVC_0":Ih,"emscripten_bind_Config_set_kVC_1":Hh,"emscripten_bind_Config_get_kDF_0":ri,"emscripten_bind_Config_set_kDF_1":qi,"emscripten_bind_Config_get_kMT_0":Se,"emscripten_bind_Config_set_kMT_1":Re,"emscripten_bind_Config_get_kCHR_0":df,"emscripten_bind_Config_set_kCHR_1":cf,"emscripten_bind_Config_get_kKHR_0":uh,"emscripten_bind_Config_set_kKHR_1":th,"emscripten_bind_Config_get_kSHR_0":fr,"emscripten_bind_Config_set_kSHR_1":er,"emscripten_bind_Config_get_kAHR_0":ni,"emscripten_bind_Config_set_kAHR_1":mi,"emscripten_bind_Config_get_kSRHR_CL_0":li,"emscripten_bind_Config_set_kSRHR_CL_1":ki,"emscripten_bind_Config_get_kSKHR_CL_0":ji,"emscripten_bind_Config_set_kSKHR_CL_1":ii,"emscripten_bind_Config_get_kSSHR_CL_0":hi,"emscripten_bind_Config_set_kSSHR_CL_1":gi,"emscripten_bind_Config_get_kSR_SPLT_CL_0":fi,"emscripten_bind_Config_set_kSR_SPLT_CL_1":ei,"emscripten_bind_Config_get_kSK_SPLT_CL_0":di,"emscripten_bind_Config_set_kSK_SPLT_CL_1":ci,"emscripten_bind_Config_get_kSS_SPLT_CL_0":bi,"emscripten_bind_Config_set_kSS_SPLT_CL_1":ai,"emscripten_bind_Config_get_maxvolume_0":$h,"emscripten_bind_Config_set_maxvolume_1":_h,"emscripten_bind_Config_get_timescale_0":dr,"emscripten_bind_Config_set_timescale_1":cr,"emscripten_bind_Config_get_viterations_0":ls,"emscripten_bind_Config_set_viterations_1":br,"emscripten_bind_Config_get_piterations_0":Gh,"emscripten_bind_Config_set_piterations_1":vh,"emscripten_bind_Config_get_diterations_0":ar,"emscripten_bind_Config_set_diterations_1":$q,"emscripten_bind_Config_get_citerations_0":_q,"emscripten_bind_Config_set_citerations_1":Zq,"emscripten_bind_Config_get_collisions_0":Yq,"emscripten_bind_Config_set_collisions_1":Xq,"emscripten_bind_Config___destroy___0":Wq,"emscripten_bind_Node_get_m_x_0":nl,"emscripten_bind_Node_set_m_x_1":sh,"emscripten_bind_Node_get_m_q_0":Pe,"emscripten_bind_Node_set_m_q_1":rh,"emscripten_bind_Node_get_m_v_0":Ze,"emscripten_bind_Node_set_m_v_1":Ye,"emscripten_bind_Node_get_m_f_0":Xh,"emscripten_bind_Node_set_m_f_1":Wh,"emscripten_bind_Node_get_m_n_0":Vh,"emscripten_bind_Node_set_m_n_1":Uq,"emscripten_bind_Node_get_m_im_0":Tq,"emscripten_bind_Node_set_m_im_1":Sq,"emscripten_bind_Node_get_m_area_0":af,"emscripten_bind_Node_set_m_area_1":$e,"emscripten_bind_Node___destroy___0":pa,"emscripten_bind_btGhostPairCallback_btGhostPairCallback_0":Rq,"emscripten_bind_btGhostPairCallback___destroy___0":_,"emscripten_bind_btOverlappingPairCallback___destroy___0":_,"emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3":Pq,"emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4":Oq,"emscripten_bind_btKinematicCharacterController_setUpAxis_1":Nq,"emscripten_bind_btKinematicCharacterController_setWalkDirection_1":Sc,"emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2":Lq,"emscripten_bind_btKinematicCharacterController_warp_1":Kq,"emscripten_bind_btKinematicCharacterController_preStep_1":Jq,"emscripten_bind_btKinematicCharacterController_playerStep_2":Iq,"emscripten_bind_btKinematicCharacterController_setFallSpeed_1":Hq,"emscripten_bind_btKinematicCharacterController_setJumpSpeed_1":Gq,"emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1":Fq,"emscripten_bind_btKinematicCharacterController_canJump_0":Eq,"emscripten_bind_btKinematicCharacterController_jump_0":Dq,"emscripten_bind_btKinematicCharacterController_setGravity_1":Cq,"emscripten_bind_btKinematicCharacterController_getGravity_0":Bq,"emscripten_bind_btKinematicCharacterController_setMaxSlope_1":Aq,"emscripten_bind_btKinematicCharacterController_getMaxSlope_0":zq,"emscripten_bind_btKinematicCharacterController_getGhostObject_0":yq,"emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1":xq,"emscripten_bind_btKinematicCharacterController_onGround_0":wq,"emscripten_bind_btKinematicCharacterController_setUpInterpolate_1":vq,"emscripten_bind_btKinematicCharacterController_updateAction_2":tg,"emscripten_bind_btKinematicCharacterController___destroy___0":_,"emscripten_bind_btSoftBodyArray_size_0":Ia,"emscripten_bind_btSoftBodyArray_at_1":pd,"emscripten_bind_btSoftBodyArray___destroy___0":Ra,"emscripten_bind_btFaceArray_size_0":Ia,"emscripten_bind_btFaceArray_at_1":uq,"emscripten_bind_btFaceArray___destroy___0":tq,"emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2":qq,"emscripten_bind_btStaticPlaneShape_setLocalScaling_1":oa,"emscripten_bind_btStaticPlaneShape_getLocalScaling_0":na,"emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2":ma,"emscripten_bind_btStaticPlaneShape___destroy___0":_,"emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1":Rf,"emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0":pq,"emscripten_bind_btOverlappingPairCache___destroy___0":_,"emscripten_bind_btIndexedMesh_get_m_numTriangles_0":od,"emscripten_bind_btIndexedMesh_set_m_numTriangles_1":nd,"emscripten_bind_btIndexedMesh___destroy___0":_c,"emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5":oq,"emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3":nq,"emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1":mq,"emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1":ne,"emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0":lq,"emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0":kq,"emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0":xd,"emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3":qd,"emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0":md,"emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0":kd,"emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1":xj,"emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2":vj,"emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3":te,"emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0":fe,"emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5":ce,"emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3":_d,"emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2":Ud,"emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1":Md,"emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1":Sc,"emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0":Fd,"emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0":Cd,"emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3":wd,"emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1":jk,"emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0":jq,"emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1":gk,"emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3":dk,"emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1":ak,"emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1":Zj,"emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2":Xj,"emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1":Rf,"emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1":Rj,"emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2":Pj,"emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3":Lj,"emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1":Ij,"emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1":Ej,"emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1":zj,"emscripten_bind_btSoftRigidDynamicsWorld_addAction_1":jd,"emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1":Ne,"emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0":Me,"emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1":Ke,"emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2":Ie,"emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3":He,"emscripten_bind_btSoftRigidDynamicsWorld___destroy___0":_,"emscripten_bind_btFixedConstraint_btFixedConstraint_4":iq,"emscripten_bind_btFixedConstraint_enableFeedback_1":kb,"emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0":jb,"emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1":ib,"emscripten_bind_btFixedConstraint_getParam_2":hb,"emscripten_bind_btFixedConstraint_setParam_3":gb,"emscripten_bind_btFixedConstraint___destroy___0":_,"emscripten_bind_btTransform_btTransform_0":hq,"emscripten_bind_btTransform_btTransform_2":gq,"emscripten_bind_btTransform_setIdentity_0":dq,"emscripten_bind_btTransform_setOrigin_1":bq,"emscripten_bind_btTransform_setRotation_1":aq,"emscripten_bind_btTransform_getOrigin_0":Gd,"emscripten_bind_btTransform_getRotation_0":_p,"emscripten_bind_btTransform_getBasis_0":Yp,"emscripten_bind_btTransform_setFromOpenGLMatrix_1":Xp,"emscripten_bind_btTransform_inverse_0":Up,"emscripten_bind_btTransform_op_mul_1":Sp,"emscripten_bind_btTransform___destroy___0":pa,"emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2":Pp,"emscripten_bind_ClosestRayResultCallback_hasHit_0":wf,"emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0":_e,"emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1":mh,"emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0":Bh,"emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1":Ah,"emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0":zh,"emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1":yh,"emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0":xh,"emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1":wh,"emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0":vf,"emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1":uf,"emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0":tf,"emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1":sf,"emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0":Ua,"emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1":Ta,"emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0":zd,"emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1":yd,"emscripten_bind_ClosestRayResultCallback___destroy___0":_,"emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0":Np,"emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1":Mp,"emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0":_,"emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0":Lp,"emscripten_bind_ConcreteContactResultCallback_addSingleResult_7":Gi,"emscripten_bind_ConcreteContactResultCallback___destroy___0":_,"emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2":Jp,"emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3":Ip,"emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1":oa,"emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0":na,"emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2":ma,"emscripten_bind_btBvhTriangleMeshShape___destroy___0":_,"emscripten_bind_btConstCollisionObjectArray_size_0":Ia,"emscripten_bind_btConstCollisionObjectArray_at_1":pd,"emscripten_bind_btConstCollisionObjectArray___destroy___0":Ra,"emscripten_bind_btSliderConstraint_btSliderConstraint_3":Hp,"emscripten_bind_btSliderConstraint_btSliderConstraint_5":Gp,"emscripten_bind_btSliderConstraint_setLowerLinLimit_1":Vb,"emscripten_bind_btSliderConstraint_setUpperLinLimit_1":Fp,"emscripten_bind_btSliderConstraint_setLowerAngLimit_1":Ep,"emscripten_bind_btSliderConstraint_setUpperAngLimit_1":Cp,"emscripten_bind_btSliderConstraint_enableFeedback_1":kb,"emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0":jb,"emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1":ib,"emscripten_bind_btSliderConstraint_getParam_2":hb,"emscripten_bind_btSliderConstraint_setParam_3":gb,"emscripten_bind_btSliderConstraint___destroy___0":_,"emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0":Ap,"emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2":Gc,"emscripten_bind_btPairCachingGhostObject_getCollisionShape_0":Fc,"emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1":Vb,"emscripten_bind_btPairCachingGhostObject_setActivationState_1":Dc,"emscripten_bind_btPairCachingGhostObject_forceActivationState_1":Cc,"emscripten_bind_btPairCachingGhostObject_activate_0":Bc,"emscripten_bind_btPairCachingGhostObject_activate_1":Ac,"emscripten_bind_btPairCachingGhostObject_isActive_0":zc,"emscripten_bind_btPairCachingGhostObject_isKinematicObject_0":yc,"emscripten_bind_btPairCachingGhostObject_isStaticObject_0":xc,"emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0":wc,"emscripten_bind_btPairCachingGhostObject_getRestitution_0":uc,"emscripten_bind_btPairCachingGhostObject_getFriction_0":tc,"emscripten_bind_btPairCachingGhostObject_getRollingFriction_0":sc,"emscripten_bind_btPairCachingGhostObject_setRestitution_1":qc,"emscripten_bind_btPairCachingGhostObject_setFriction_1":pc,"emscripten_bind_btPairCachingGhostObject_setRollingFriction_1":oc,"emscripten_bind_btPairCachingGhostObject_getWorldTransform_0":Tb,"emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0":nc,"emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1":mc,"emscripten_bind_btPairCachingGhostObject_setWorldTransform_1":lc,"emscripten_bind_btPairCachingGhostObject_setCollisionShape_1":zb,"emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1":kc,"emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1":jc,"emscripten_bind_btPairCachingGhostObject_getUserIndex_0":Pa,"emscripten_bind_btPairCachingGhostObject_setUserIndex_1":Oa,"emscripten_bind_btPairCachingGhostObject_getUserPointer_0":Pa,"emscripten_bind_btPairCachingGhostObject_setUserPointer_1":Oa,"emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0":Rb,"emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0":Eg,"emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1":Il,"emscripten_bind_btPairCachingGhostObject___destroy___0":ic,"emscripten_bind_btManifoldPoint_getPositionWorldOnA_0":Gd,"emscripten_bind_btManifoldPoint_getPositionWorldOnB_0":zp,"emscripten_bind_btManifoldPoint_getAppliedImpulse_0":yp,"emscripten_bind_btManifoldPoint_getDistance_0":xp,"emscripten_bind_btManifoldPoint_get_m_localPointA_0":Ha,"emscripten_bind_btManifoldPoint_set_m_localPointA_1":rd,"emscripten_bind_btManifoldPoint_get_m_localPointB_0":Jc,"emscripten_bind_btManifoldPoint_set_m_localPointB_1":Ic,"emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0":pi,"emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1":oi,"emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0":VA,"emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1":Le,"emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0":wp,"emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1":vp,"emscripten_bind_btManifoldPoint_get_m_userPersistentData_0":up,"emscripten_bind_btManifoldPoint_set_m_userPersistentData_1":tp,"emscripten_bind_btManifoldPoint___destroy___0":pa,"emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2":sp,"emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4":rp,"emscripten_bind_btPoint2PointConstraint_setPivotA_1":qp,"emscripten_bind_btPoint2PointConstraint_setPivotB_1":op,"emscripten_bind_btPoint2PointConstraint_getPivotInA_0":mp,"emscripten_bind_btPoint2PointConstraint_getPivotInB_0":lp,"emscripten_bind_btPoint2PointConstraint_enableFeedback_1":kb,"emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0":jb,"emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1":ib,"emscripten_bind_btPoint2PointConstraint_getParam_2":hb,"emscripten_bind_btPoint2PointConstraint_setParam_3":gb,"emscripten_bind_btPoint2PointConstraint_get_m_setting_0":$v,"emscripten_bind_btPoint2PointConstraint_set_m_setting_1":kp,"emscripten_bind_btPoint2PointConstraint___destroy___0":_,"emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0":jp,"emscripten_bind_btSoftBodyHelpers_CreateRope_5":ip,"emscripten_bind_btSoftBodyHelpers_CreatePatch_9":hp,"emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10":gp,"emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4":fp,"emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5":ep,"emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4":dp,"emscripten_bind_btSoftBodyHelpers___destroy___0":pa,"emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0":cp,"emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1":bp,"emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0":ap,"emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1":$o,"emscripten_bind_btBroadphaseProxy___destroy___0":_c,"emscripten_bind_tNodeArray_size_0":Ia,"emscripten_bind_tNodeArray_at_1":_o,"emscripten_bind_tNodeArray___destroy___0":Ra,"emscripten_bind_btBoxShape_btBoxShape_1":Zo,"emscripten_bind_btBoxShape_setMargin_1":Ea,"emscripten_bind_btBoxShape_getMargin_0":Da,"emscripten_bind_btBoxShape_setLocalScaling_1":oa,"emscripten_bind_btBoxShape_getLocalScaling_0":na,"emscripten_bind_btBoxShape_calculateLocalInertia_2":ma,"emscripten_bind_btBoxShape___destroy___0":_,"emscripten_bind_btFace_get_m_indices_0":Ha,"emscripten_bind_btFace_set_m_indices_1":Yo,"emscripten_bind_btFace_get_m_plane_1":Xo,"emscripten_bind_btFace_set_m_plane_2":Wo,"emscripten_bind_btFace___destroy___0":Vo,"emscripten_bind_DebugDrawer_DebugDrawer_0":Uo,"emscripten_bind_DebugDrawer_drawLine_3":Ug,"emscripten_bind_DebugDrawer_drawContactPoint_5":Sg,"emscripten_bind_DebugDrawer_reportErrorWarning_1":Qg,"emscripten_bind_DebugDrawer_draw3dText_2":Pg,"emscripten_bind_DebugDrawer_setDebugMode_1":Mg,"emscripten_bind_DebugDrawer_getDebugMode_0":Ig,"emscripten_bind_DebugDrawer___destroy___0":_,"emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2":So,"emscripten_bind_btCapsuleShapeX_setMargin_1":Ea,"emscripten_bind_btCapsuleShapeX_getMargin_0":Da,"emscripten_bind_btCapsuleShapeX_getUpAxis_0":hd,"emscripten_bind_btCapsuleShapeX_getRadius_0":Fe,"emscripten_bind_btCapsuleShapeX_getHalfHeight_0":Ee,"emscripten_bind_btCapsuleShapeX_setLocalScaling_1":oa,"emscripten_bind_btCapsuleShapeX_getLocalScaling_0":na,"emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2":ma,"emscripten_bind_btCapsuleShapeX___destroy___0":_,"emscripten_bind_btQuaternion_btQuaternion_4":Ro,"emscripten_bind_btQuaternion_setValue_4":Lh,"emscripten_bind_btQuaternion_setEulerZYX_3":Qo,"emscripten_bind_btQuaternion_setRotation_2":Oo,"emscripten_bind_btQuaternion_normalize_0":Mo,"emscripten_bind_btQuaternion_length2_0":Ko,"emscripten_bind_btQuaternion_length_0":Jo,"emscripten_bind_btQuaternion_dot_1":Io,"emscripten_bind_btQuaternion_normalized_0":Ho,"emscripten_bind_btQuaternion_getAxis_0":Eo,"emscripten_bind_btQuaternion_inverse_0":Co,"emscripten_bind_btQuaternion_getAngle_0":Ao,"emscripten_bind_btQuaternion_getAngleShortestPath_0":yo,"emscripten_bind_btQuaternion_angle_1":wo,"emscripten_bind_btQuaternion_angleShortestPath_1":uo,"emscripten_bind_btQuaternion_op_add_1":ro,"emscripten_bind_btQuaternion_op_sub_1":oo,"emscripten_bind_btQuaternion_op_mul_1":mo,"emscripten_bind_btQuaternion_op_mulq_1":lo,"emscripten_bind_btQuaternion_op_div_1":jo,"emscripten_bind_btQuaternion_x_0":me,"emscripten_bind_btQuaternion_y_0":ke,"emscripten_bind_btQuaternion_z_0":je,"emscripten_bind_btQuaternion_w_0":Zf,"emscripten_bind_btQuaternion_setX_1":ie,"emscripten_bind_btQuaternion_setY_1":he,"emscripten_bind_btQuaternion_setZ_1":ge,"emscripten_bind_btQuaternion_setW_1":sk,"emscripten_bind_btQuaternion___destroy___0":pa,"emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2":io,"emscripten_bind_btCapsuleShapeZ_setMargin_1":Ea,"emscripten_bind_btCapsuleShapeZ_getMargin_0":Da,"emscripten_bind_btCapsuleShapeZ_getUpAxis_0":hd,"emscripten_bind_btCapsuleShapeZ_getRadius_0":Fe,"emscripten_bind_btCapsuleShapeZ_getHalfHeight_0":Ee,"emscripten_bind_btCapsuleShapeZ_setLocalScaling_1":oa,"emscripten_bind_btCapsuleShapeZ_getLocalScaling_0":na,"emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2":ma,"emscripten_bind_btCapsuleShapeZ___destroy___0":_,"emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0":ho,"emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1":go,"emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0":fo,"emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1":eo,"emscripten_bind_btContactSolverInfo_get_m_numIterations_0":Kh,"emscripten_bind_btContactSolverInfo_set_m_numIterations_1":Jh,"emscripten_bind_btContactSolverInfo___destroy___0":pa,"emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3":co,"emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5":bo,"emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2":ao,"emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2":$n,"emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2":_n,"emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0":Zn,"emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1":Yn,"emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2":Xn,"emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1":pj,"emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1":mj,"emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1":hj,"emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1":dj,"emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0":Gd,"emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1":kb,"emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0":jb,"emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1":ib,"emscripten_bind_btGeneric6DofSpringConstraint_getParam_2":hb,"emscripten_bind_btGeneric6DofSpringConstraint_setParam_3":gb,"emscripten_bind_btGeneric6DofSpringConstraint___destroy___0":_,"emscripten_bind_btSphereShape_btSphereShape_1":Wn,"emscripten_bind_btSphereShape_setMargin_1":Ea,"emscripten_bind_btSphereShape_getMargin_0":Da,"emscripten_bind_btSphereShape_setLocalScaling_1":oa,"emscripten_bind_btSphereShape_getLocalScaling_0":na,"emscripten_bind_btSphereShape_calculateLocalInertia_2":ma,"emscripten_bind_btSphereShape___destroy___0":_,"emscripten_bind_Face_get_m_n_1":Un,"emscripten_bind_Face_set_m_n_2":Tn,"emscripten_bind_Face_get_m_normal_0":_e,"emscripten_bind_Face_set_m_normal_1":mh,"emscripten_bind_Face_get_m_ra_0":df,"emscripten_bind_Face_set_m_ra_1":cf,"emscripten_bind_Face___destroy___0":pa,"emscripten_bind_tFaceArray_size_0":Ia,"emscripten_bind_tFaceArray_at_1":Sn,"emscripten_bind_tFaceArray___destroy___0":Ra,"emscripten_bind_LocalConvexResult_LocalConvexResult_5":Rn,"emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0":od,"emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1":nd,"emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0":zg,"emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1":ef,"emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0":nl,"emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1":sh,"emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0":Pe,"emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1":rh,"emscripten_bind_LocalConvexResult_get_m_hitFraction_0":uh,"emscripten_bind_LocalConvexResult_set_m_hitFraction_1":th,"emscripten_bind_LocalConvexResult___destroy___0":pa,"emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP":hh,"emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP":gh,"emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM":fh,"emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM":eh,"emscripten_enum_PHY_ScalarType_PHY_FLOAT":Pn,"emscripten_enum_PHY_ScalarType_PHY_DOUBLE":hh,"emscripten_enum_PHY_ScalarType_PHY_INTEGER":gh,"emscripten_enum_PHY_ScalarType_PHY_SHORT":fh,"emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88":eh,"emscripten_enum_PHY_ScalarType_PHY_UCHAR":On,"malloc":ff,"free":ba,"__growWasmMemory":Ox,"dynCall_vi":Mx,"dynCall_v":Lx};}for(var P=new Uint8Array(123),Q=25;Q>=0;--Q){P[48+Q]=52+Q;P[65+Q]=Q;P[97+Q]=26+Q;}P[43]=62;P[47]=63;function R(uint8Array,offset,b64){var S,T,Q=0,U=offset,V=b64.length,W=offset+(V*3>>2)-(b64[V-2]=="=")-(b64[V-1]=="=");for(;Q<V;Q+=4){S=P[b64.charCodeAt(Q+1)];T=P[b64.charCodeAt(Q+2)];uint8Array[U++]=P[b64.charCodeAt(Q)]<<2|S>>4;if(U<W)uint8Array[U++]=S<<4|T>>2;if(U<W)uint8Array[U++]=T<<6|P[b64.charCodeAt(Q+3)];}}var X=new Uint8Array(wasmMemory.buffer);R(X,1024,"KHNpemVfdCBpZHgsIHNpemVfdCBzaXplKTw6Oj57IHRocm93ICdBcnJheSBpbmRleCAnICsgaWR4ICsgJyBvdXQgb2YgYm91bmRzOiBbMCwnICsgc2l6ZSArICcpJzsgfQAAAAAAAADkBAAAAQAAAAIAAAADAAAABAAAAE4xNmJ0Q29sbGlzaW9uV29ybGQyN0Nsb3Nlc3RDb252ZXhSZXN1bHRDYWxsYmFja0UATjE2YnRDb2xsaXNpb25Xb3JsZDIwQ29udmV4UmVzdWx0Q2FsbGJhY2tFAAAAAExmAACuBAAAdGYAAHwEAADcBAAAAAAAANwEAAAFAAAABgAAAAMAAAAHAAAAAAAAAIAFAAAIAAAACQAAAAoAAAALAAAATjE2YnRDb2xsaXNpb25Xb3JsZDI0QWxsSGl0c1JheVJlc3VsdENhbGxiYWNrRQBOMTZidENvbGxpc2lvbldvcmxkMTdSYXlSZXN1bHRDYWxsYmFja0UAAExmAABPBQAAdGYAACAFAAB4BQAAAAAAAHgFAAAMAAAADQAAAAoAAAAHAAAAAAAAANAFAAAOAAAADwAAAAcAAAAxOGJ0VmVoaWNsZVJheWNhc3RlcgAAAABMZgAAuAUAAAAAAAAgBgAAEAAAABEAAAASAAAAEwAAADIwYnREZWZhdWx0TW90aW9uU3RhdGUAMTNidE1vdGlvblN0YXRlAABMZgAABwYAAHRmAADwBQAAGAYAAAAAAAAYBgAAFAAAABUAAAAHAAAABwAAAAAAAACcBgAAFgAAABcAAAAYAAAAGQAAABoAAAAxOWJ0R2hvc3RQYWlyQ2FsbGJhY2sAMjVidE92ZXJsYXBwaW5nUGFpckNhbGxiYWNrAAAATGYAAHYGAAB0ZgAAYAYAAJQGAAAAAAAAlAYAABsAAAAcAAAABwAAAAcAAAAHAAAAAAAAAAwHAAAdAAAAHgAAAAoAAAAfAAAATjE2YnRDb2xsaXNpb25Xb3JsZDI0Q2xvc2VzdFJheVJlc3VsdENhbGxiYWNrRQAAdGYAANwGAAB4BQAAAAAAAIQHAAAgAAAAIQAAACIAAAAjAAAAMjlDb25jcmV0ZUNvbnRhY3RSZXN1bHRDYWxsYmFjawBOMTZidENvbGxpc2lvbldvcmxkMjFDb250YWN0UmVzdWx0Q2FsbGJhY2tFAExmAABQBwAAdGYAADAHAAB8BwAAAAAAAHwHAAAkAAAAJQAAACIAAAAHAAAAeyB2YXIgc2VsZiA9IE1vZHVsZVsnZ2V0Q2FjaGUnXShNb2R1bGVbJ0NvbmNyZXRlQ29udGFjdFJlc3VsdENhbGxiYWNrJ10pWyQwXTsgaWYgKCFzZWxmLmhhc093blByb3BlcnR5KCdhZGRTaW5nbGVSZXN1bHQnKSkgdGhyb3cgJ2EgSlNJbXBsZW1lbnRhdGlvbiBtdXN0IGltcGxlbWVudCBhbGwgZnVuY3Rpb25zLCB5b3UgZm9yZ290IENvbmNyZXRlQ29udGFjdFJlc3VsdENhbGxiYWNrOjphZGRTaW5nbGVSZXN1bHQuJzsgcmV0dXJuIHNlbGZbJ2FkZFNpbmdsZVJlc3VsdCddKCQxLCQyLCQzLCQ0LCQ1LCQ2LCQ3KTsgfQBpaWlpaWlpaQAAAAAAAAAAaAkAACYAAAAnAAAAKAAAACkAAAAqAAAAKwAAACwAAAAtAAAALgAAAC8AAAAwAAAAMQAAADIAAAAzAAAANAAAADUAAAA2AAAANwAAADgAAAA5AAAAOgAAADsAAAA8AAAAMTFEZWJ1Z0RyYXdlcgAxMmJ0SURlYnVnRHJhdwAAAABMZgAATgkAAHRmAABACQAAYAkAAAAAAABgCQAAPQAAAD4AAAAHAAAAKQAAACoAAAArAAAALAAAAC0AAAAHAAAABwAAAAcAAAAHAAAABwAAADMAAAA0AAAANQAAADYAAAA3AAAAOAAAADkAAAA6AAAAOwAAADwAAAB7IHZhciBzZWxmID0gTW9kdWxlWydnZXRDYWNoZSddKE1vZHVsZVsnRGVidWdEcmF3ZXInXSlbJDBdOyBpZiAoIXNlbGYuaGFzT3duUHJvcGVydHkoJ2RyYXdMaW5lJykpIHRocm93ICdhIEpTSW1wbGVtZW50YXRpb24gbXVzdCBpbXBsZW1lbnQgYWxsIGZ1bmN0aW9ucywgeW91IGZvcmdvdCBEZWJ1Z0RyYXdlcjo6ZHJhd0xpbmUuJzsgc2VsZlsnZHJhd0xpbmUnXSgkMSwkMiwkMyk7IH0AaWlpaQB7IHZhciBzZWxmID0gTW9kdWxlWydnZXRDYWNoZSddKE1vZHVsZVsnRGVidWdEcmF3ZXInXSlbJDBdOyBpZiAoIXNlbGYuaGFzT3duUHJvcGVydHkoJ2RyYXdDb250YWN0UG9pbnQnKSkgdGhyb3cgJ2EgSlNJbXBsZW1lbnRhdGlvbiBtdXN0IGltcGxlbWVudCBhbGwgZnVuY3Rpb25zLCB5b3UgZm9yZ290IERlYnVnRHJhd2VyOjpkcmF3Q29udGFjdFBvaW50Lic7IHNlbGZbJ2RyYXdDb250YWN0UG9pbnQnXSgkMSwkMiwkMywkNCwkNSk7IH0AaWlpZGlpAHsgdmFyIHNlbGYgPSBNb2R1bGVbJ2dldENhY2hlJ10oTW9kdWxlWydEZWJ1Z0RyYXdlciddKVskMF07IGlmICghc2VsZi5oYXNPd25Qcm9wZXJ0eSgncmVwb3J0RXJyb3JXYXJuaW5nJykpIHRocm93ICdhIEpTSW1wbGVtZW50YXRpb24gbXVzdCBpbXBsZW1lbnQgYWxsIGZ1bmN0aW9ucywgeW91IGZvcmdvdCBEZWJ1Z0RyYXdlcjo6cmVwb3J0RXJyb3JXYXJuaW5nLic7IHNlbGZbJ3JlcG9ydEVycm9yV2FybmluZyddKCQxKTsgfQBpaQB7IHZhciBzZWxmID0gTW9kdWxlWydnZXRDYWNoZSddKE1vZHVsZVsnRGVidWdEcmF3ZXInXSlbJDBdOyBpZiAoIXNlbGYuaGFzT3duUHJvcGVydHkoJ2RyYXczZFRleHQnKSkgdGhyb3cgJ2EgSlNJbXBsZW1lbnRhdGlvbiBtdXN0IGltcGxlbWVudCBhbGwgZnVuY3Rpb25zLCB5b3UgZm9yZ290IERlYnVnRHJhd2VyOjpkcmF3M2RUZXh0Lic7IHNlbGZbJ2RyYXczZFRleHQnXSgkMSwkMik7IH0AaWlpAHsgdmFyIHNlbGYgPSBNb2R1bGVbJ2dldENhY2hlJ10oTW9kdWxlWydEZWJ1Z0RyYXdlciddKVskMF07IGlmICghc2VsZi5oYXNPd25Qcm9wZXJ0eSgnc2V0RGVidWdNb2RlJykpIHRocm93ICdhIEpTSW1wbGVtZW50YXRpb24gbXVzdCBpbXBsZW1lbnQgYWxsIGZ1bmN0aW9ucywgeW91IGZvcmdvdCBEZWJ1Z0RyYXdlcjo6c2V0RGVidWdNb2RlLic7IHNlbGZbJ3NldERlYnVnTW9kZSddKCQxKTsgfQBpaQB7IHZhciBzZWxmID0gTW9kdWxlWydnZXRDYWNoZSddKE1vZHVsZVsnRGVidWdEcmF3ZXInXSlbJDBdOyBpZiAoIXNlbGYuaGFzT3duUHJvcGVydHkoJ2dldERlYnVnTW9kZScpKSB0aHJvdyAnYSBKU0ltcGxlbWVudGF0aW9uIG11c3QgaW1wbGVtZW50IGFsbCBmdW5jdGlvbnMsIHlvdSBmb3Jnb3QgRGVidWdEcmF3ZXI6OmdldERlYnVnTW9kZS4nOyByZXR1cm4gc2VsZlsnZ2V0RGVidWdNb2RlJ10oKTsgfQBpAAAAAAAAALgPAAA/AAAAQAAAAEEAAABCAAAAQwAAAEQAAABFAAAAYnRDb2xsaXNpb25PYmplY3RGbG9hdERhdGEAMTdidENvbGxpc2lvbk9iamVjdAAATGYAAKMPAAAAAAAAKBAAAD8AAABGAAAARwAAAEIAAABDAAAARAAAAEUAAABIAAAASQAAAAAAAABQEAAAPwAAAEoAAABLAAAAQgAAAEMAAABEAAAARQAAAEwAAABNAAAAMTNidEdob3N0T2JqZWN0AHRmAAAYEAAAuA8AADI0YnRQYWlyQ2FjaGluZ0dob3N0T2JqZWN0AAB0ZgAANBAAACgQAAAAAAAAvBAAAE8AAABQAAAAUQAAAFIAAABTAAAAVAAAAFUAAABWAAAAVwAAAFgAAABZAAAAWgAAAFsAAABcAAAAXQAAAF4AAAAyMWJ0Q29sbGlzaW9uRGlzcGF0Y2hlcgB0ZgAApBAAALxEAAAAAAAAFBEAAF8AAABgAAAAYQAAADIzYnRDb2xsaXNpb25QYWlyQ2FsbGJhY2sAMTdidE92ZXJsYXBDYWxsYmFjawAAAExmAAD2EAAAdGYAANwQAAAMEQAAAQAAAAIAAAAAAAAAAQAAAAIAAAAAAAAAAQAAAAIAAAAAAAAAAgAAAAAAAAABAAAAAAAAALARAABkAAAAZQAAAGYAAAAzMGJ0R2prRXBhUGVuZXRyYXRpb25EZXB0aFNvbHZlcgAzMGJ0Q29udmV4UGVuZXRyYXRpb25EZXB0aFNvbHZlcgAAAExmAACFEQAAdGYAAGQRAACoEQAAAAAAABQSAABnAAAAaAAAAGkAAAAxN2J0R2prUGFpckRldGVjdG9yADM2YnREaXNjcmV0ZUNvbGxpc2lvbkRldGVjdG9ySW50ZXJmYWNlAABMZgAA5BEAAHRmAADQEQAADBIAAAAAAABYEgAAZAAAAGoAAABrAAAAMzNidE1pbmtvd3NraVBlbmV0cmF0aW9uRGVwdGhTb2x2ZXIAdGYAADQSAACoEQAAAAAAAGQTAABsAAAAbQAAAG4AAABvAAAAcAAAAFpOMzNidE1pbmtvd3NraVBlbmV0cmF0aW9uRGVwdGhTb2x2ZXIxMmNhbGNQZW5EZXB0aEVSMjJidFZvcm9ub2lTaW1wbGV4U29sdmVyUEsxM2J0Q29udmV4U2hhcGVTNF9SSzExYnRUcmFuc2Zvcm1TN19SOWJ0VmVjdG9yM1M5X1M5X1AxMmJ0SURlYnVnRHJhd0UyMGJ0SW50ZXJtZWRpYXRlUmVzdWx0AE4zNmJ0RGlzY3JldGVDb2xsaXNpb25EZXRlY3RvckludGVyZmFjZTZSZXN1bHRFAABMZgAAKxMAAHRmAACAEgAAXBMAAAAAAADAEwAAcQAAAHIAAABzAAAAdAAAAHUAAAAxNmJ0RW1wdHlBbGdvcml0aG0AMjBidENvbGxpc2lvbkFsZ29yaXRobQAAAExmAACfEwAAdGYAAIwTAAC4EwAAAAAAAAwUAAB2AAAAdwAAAAcAAAAHAAAABwAAADMwYnRBY3RpdmF0aW5nQ29sbGlzaW9uQWxnb3JpdGhtAAAAAHRmAADoEwAAuBMAAAAAAABYFAAAeAAAAHkAAAB6AAAAewAAAHwAAAAzMmJ0U3BoZXJlU3BoZXJlQ29sbGlzaW9uQWxnb3JpdGhtAAB0ZgAANBQAAAwUAAAAAAAAzBQAAH0AAAB+AAAAfwAAAIAAAACBAAAAggAAADMxYnREZWZhdWx0Q29sbGlzaW9uQ29uZmlndXJhdGlvbgAyNGJ0Q29sbGlzaW9uQ29uZmlndXJhdGlvbgAAAABMZgAAphQAAHRmAACEFAAAxBQAAAAAAABIFQAAgwAAAIQAAACFAAAATjMzYnRDb252ZXhDb25jYXZlQ29sbGlzaW9uQWxnb3JpdGhtMTBDcmVhdGVGdW5jRQAzMGJ0Q29sbGlzaW9uQWxnb3JpdGhtQ3JlYXRlRnVuYwAATGYAAB4VAAB0ZgAA7BQAAEAVAAAAAAAApBUAAIMAAACGAAAAhwAAAE4zM2J0Q29udmV4Q29uY2F2ZUNvbGxpc2lvbkFsZ29yaXRobTE3U3dhcHBlZENyZWF0ZUZ1bmNFAAAAAHRmAABoFQAAQBUAAAAAAAD0FQAAgwAAAIgAAACJAAAATjI4YnRDb21wb3VuZENvbGxpc2lvbkFsZ29yaXRobTEwQ3JlYXRlRnVuY0UAAAAAdGYAAMQVAABAFQAAAAAAAEwWAACDAAAAigAAAIsAAABOMzZidENvbXBvdW5kQ29tcG91bmRDb2xsaXNpb25BbGdvcml0aG0xMENyZWF0ZUZ1bmNFAAAAAHRmAAAUFgAAQBUAAAAAAACgFgAAgwAAAIwAAACNAAAATjI4YnRDb21wb3VuZENvbGxpc2lvbkFsZ29yaXRobTE3U3dhcHBlZENyZWF0ZUZ1bmNFAHRmAABsFgAAQBUAAAAAAADkFgAAgwAAAI4AAACPAAAATjE2YnRFbXB0eUFsZ29yaXRobTEwQ3JlYXRlRnVuY0UAAAAAdGYAAMAWAABAFQAAAAAAADgXAACDAAAAkAAAAJEAAABOMzJidFNwaGVyZVNwaGVyZUNvbGxpc2lvbkFsZ29yaXRobTEwQ3JlYXRlRnVuY0UAAAAAdGYAAAQXAABAFQAAAAAAAIwXAACDAAAAkgAAAJMAAABOMzRidFNwaGVyZVRyaWFuZ2xlQ29sbGlzaW9uQWxnb3JpdGhtMTBDcmVhdGVGdW5jRQAAdGYAAFgXAABAFQAAAAAAANgXAACDAAAAlAAAAJUAAABOMjZidEJveEJveENvbGxpc2lvbkFsZ29yaXRobTEwQ3JlYXRlRnVuY0UAAHRmAACsFwAAQBUAAAAAAAAoGAAAgwAAAJYAAACXAAAATjMxYnRDb252ZXhQbGFuZUNvbGxpc2lvbkFsZ29yaXRobTEwQ3JlYXRlRnVuY0UAdGYAAPgXAABAFQAAAAAAAHQYAACYAAAAmQAAAJoAAACbAAAAnAAAADMxYnRDb252ZXhQbGFuZUNvbGxpc2lvbkFsZ29yaXRobQAAAHRmAABQGAAAuBMAADEyYnRDb252ZXhDYXN0AABMZgAAgBgAAAAAAADIGAAAnQAAAJ4AAACfAAAAMjJidFN1YnNpbXBsZXhDb252ZXhDYXN0AAAAAHRmAACsGAAAkBgAAAAAAAAoGQAAoAAAAKEAAACiAAAAowAAAKQAAAAAAAAAUBkAAKUAAACmAAAApwAAADMzYnRDb252ZXhDb25jYXZlQ29sbGlzaW9uQWxnb3JpdGhtAHRmAAAEGQAADBQAADI0YnRDb252ZXhUcmlhbmdsZUNhbGxiYWNrAAB0ZgAANBkAAIg2AAAAAAAA+BkAAKgAAACpAAAAqgAAAKsAAACsAAAArQAAAK4AAACvAAAAsAAAALEAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAAuQAAALoAAAC7AAAAvAAAAL0AAAC+AAAAvwAAAMAAAADBAAAAwgAAAMMAAADEAAAAxQAAAMYAAADHAAAAMTVidFRyaWFuZ2xlU2hhcGUAAAB0ZgAA5BkAABwzAABUcmlhbmdsZQBidENvbnZleEludGVybmFsU2hhcGVEYXRhAAAAAAAA3BoAAMgAAADJAAAAygAAAFpOMzNidENvbnZleENvbmNhdmVDb2xsaXNpb25BbGdvcml0aG0yMWNhbGN1bGF0ZVRpbWVPZkltcGFjdEVQMTdidENvbGxpc2lvbk9iamVjdFMxX1JLMTZidERpc3BhdGNoZXJJbmZvUDE2YnRNYW5pZm9sZFJlc3VsdEUzMUxvY2FsVHJpYW5nbGVTcGhlcmVDYXN0Q2FsbGJhY2sAAAB0ZgAAPBoAAIg2AAAAAAAAJBsAAMsAAADMAAAAzQAAAM4AAADPAAAATjEyYnRDb252ZXhDYXN0MTBDYXN0UmVzdWx0RQAAAABMZgAABBsAAAAAAABUGwAAZwAAANAAAADRAAAAMTZidEJveEJveERldGVjdG9yAAB0ZgAAQBsAAAwSAAAAAAAAnBsAANIAAADTAAAA1AAAANUAAADWAAAAMjZidEJveEJveENvbGxpc2lvbkFsZ29yaXRobQAAAAB0ZgAAfBsAAAwUAAAAAAAA2BsAAGwAAADXAAAA2AAAANkAAADaAAAAMTZidE1hbmlmb2xkUmVzdWx0AAB0ZgAAxBsAAFwTAAAAAAAADBwAAJ0AAADbAAAA3AAAADE1YnRHamtDb252ZXhDYXN0AAAAdGYAAPgbAACQGAAAAAAAAEgcAABsAAAA3QAAAN4AAADfAAAA4AAAADE2YnRQb2ludENvbGxlY3RvcgAAdGYAADQcAABcEwAAAAAAAIgcAACdAAAA4QAAAOIAAAAyN2J0Q29udGludW91c0NvbnZleENvbGxpc2lvbgAAAHRmAABoHAAAkBgAAAAAAADgHAAAyAAAAOMAAADkAAAABwAAAAAAAAAMHQAAyAAAAOUAAADmAAAABwAAADI1YnRUcmlhbmdsZVJheWNhc3RDYWxsYmFjawB0ZgAAxBwAAIg2AAAyOGJ0VHJpYW5nbGVDb252ZXhjYXN0Q2FsbGJhY2sAAHRmAADsHAAAiDYAAAAAAACsHgAA5wAAAOgAAADpAAAA6gAAAOsAAADsAAAA7QAAAO4AAADvAAAA8AAAAPEAAADyAAAA8wAAAE92ZXJmbG93IGluIEFBQkIsIG9iamVjdCByZW1vdmVkIGZyb20gc2ltdWxhdGlvbgBJZiB5b3UgY2FuIHJlcHJvZHVjZSB0aGlzLCBwbGVhc2UgZW1haWwgYnVnc0Bjb250aW51b3VzcGh5c2ljcy5jb20KAFBsZWFzZSBpbmNsdWRlIGFib3ZlIGluZm9ybWF0aW9uLCB5b3VyIFBsYXRmb3JtLCB2ZXJzaW9uIG9mIE9TLgoAVGhhbmtzLgoAdXBkYXRlQWFiYnMAY2FsY3VsYXRlT3ZlcmxhcHBpbmdQYWlycwBwZXJmb3JtRGlzY3JldGVDb2xsaXNpb25EZXRlY3Rpb24AZGlzcGF0Y2hBbGxDb2xsaXNpb25QYWlycwBjb252ZXhTd2VlcENvbXBvdW5kAGNvbnZleFN3ZWVwVGVzdAAxNmJ0Q29sbGlzaW9uV29ybGQATGYAAJkeAAAAAAAAYB8AAMgAAAD0AAAA5AAAAPUAAABaTjE2YnRDb2xsaXNpb25Xb3JsZDIxcmF5VGVzdFNpbmdsZUludGVybmFsRVJLMTFidFRyYW5zZm9ybVMyX1BLMjRidENvbGxpc2lvbk9iamVjdFdyYXBwZXJSTlNfMTdSYXlSZXN1bHRDYWxsYmFja0VFMjlCcmlkZ2VUcmlhbmdsZVJheWNhc3RDYWxsYmFjawAAdGYAAMweAADgHAAAAAAAABwgAADIAAAA9gAAAOQAAAD3AAAAWk4xNmJ0Q29sbGlzaW9uV29ybGQyMXJheVRlc3RTaW5nbGVJbnRlcm5hbEVSSzExYnRUcmFuc2Zvcm1TMl9QSzI0YnRDb2xsaXNpb25PYmplY3RXcmFwcGVyUk5TXzE3UmF5UmVzdWx0Q2FsbGJhY2tFRTI5QnJpZGdlVHJpYW5nbGVSYXljYXN0Q2FsbGJhY2tfMAAAAAB0ZgAAhB8AAOAcAAAAAAAA6CAAAPgAAAD5AAAA+gAAAPsAAAD8AAAA/QAAAP4AAABaTjE2YnRDb2xsaXNpb25Xb3JsZDIxcmF5VGVzdFNpbmdsZUludGVybmFsRVJLMTFidFRyYW5zZm9ybVMyX1BLMjRidENvbGxpc2lvbk9iamVjdFdyYXBwZXJSTlNfMTdSYXlSZXN1bHRDYWxsYmFja0VFOVJheVRlc3RlcgBONmJ0RGJ2dDhJQ29sbGlkZUUAAAAATGYAAMogAAB0ZgAATCAAAOAgAAAAAAAAlCEAAAwAAAD/AAAAAAEAAAEBAABaTjE2YnRDb2xsaXNpb25Xb3JsZDIxcmF5VGVzdFNpbmdsZUludGVybmFsRVJLMTFidFRyYW5zZm9ybVMyX1BLMjRidENvbGxpc2lvbk9iamVjdFdyYXBwZXJSTlNfMTdSYXlSZXN1bHRDYWxsYmFja0VFMTVMb2NhbEluZm9BZGRlcjIAAAAAdGYAAAwhAAB4BQAAAAAAAGgiAADIAAAAAgEAAOYAAAADAQAAWk4xNmJ0Q29sbGlzaW9uV29ybGQyNW9iamVjdFF1ZXJ5U2luZ2xlSW50ZXJuYWxFUEsxM2J0Q29udmV4U2hhcGVSSzExYnRUcmFuc2Zvcm1TNV9QSzI0YnRDb2xsaXNpb25PYmplY3RXcmFwcGVyUk5TXzIwQ29udmV4UmVzdWx0Q2FsbGJhY2tFZkUzMkJyaWRnZVRyaWFuZ2xlQ29udmV4Y2FzdENhbGxiYWNrAAB0ZgAAuCEAAAwdAAAAAAAAQCMAAMgAAAAEAQAA5gAAAAUBAABaTjE2YnRDb2xsaXNpb25Xb3JsZDI1b2JqZWN0UXVlcnlTaW5nbGVJbnRlcm5hbEVQSzEzYnRDb252ZXhTaGFwZVJLMTFidFRyYW5zZm9ybVM1X1BLMjRidENvbGxpc2lvbk9iamVjdFdyYXBwZXJSTlNfMjBDb252ZXhSZXN1bHRDYWxsYmFja0VmRTMyQnJpZGdlVHJpYW5nbGVDb252ZXhjYXN0Q2FsbGJhY2tfMAAAAAB0ZgAAjCIAAAwdAAAAAAAABCQAAAUAAAAGAQAABwEAAAgBAABaTjE2YnRDb2xsaXNpb25Xb3JsZDI1b2JqZWN0UXVlcnlTaW5nbGVJbnRlcm5hbEVQSzEzYnRDb252ZXhTaGFwZVJLMTFidFRyYW5zZm9ybVM1X1BLMjRidENvbGxpc2lvbk9iamVjdFdyYXBwZXJSTlNfMjBDb252ZXhSZXN1bHRDYWxsYmFja0VmRTE0TG9jYWxJbmZvQWRkZXIAAAAAdGYAAGQjAADcBAAAAAAAAIQkAAAJAQAACgEAAAsBAAAxOWJ0U2luZ2xlUmF5Q2FsbGJhY2sAMjNidEJyb2FkcGhhc2VSYXlDYWxsYmFjawAyNGJ0QnJvYWRwaGFzZUFhYmJDYWxsYmFjawAATGYAAFQkAAB0ZgAAOiQAAHAkAAB0ZgAAJCQAAHgkAAAAAAAAvCQAAAkBAAAMAQAADQEAADIxYnRTaW5nbGVTd2VlcENhbGxiYWNrAHRmAACkJAAAeCQAAAAAAAD4JAAACQEAAA4BAAAPAQAAMjNidFNpbmdsZUNvbnRhY3RDYWxsYmFjawAAAHRmAADcJAAAcCQAAAAAAAA8JQAAbAAAABABAADYAAAA2QAAABEBAAAyM2J0QnJpZGdlZE1hbmlmb2xkUmVzdWx0AAAAdGYAACAlAADYGwAAAAAAAIglAAASAQAAEwEAABQBAAAVAQAA/P///4glAAAWAQAAFwEAABgBAAAxN0RlYnVnRHJhd2NhbGxiYWNrANBmAAB0JQAAAAAAAAIAAACINgAAAgAAALQ2AAACBAAAAAAAANglAABnAAAAGQEAABoBAAAyMlNwaGVyZVRyaWFuZ2xlRGV0ZWN0b3IAAAAAdGYAALwlAAAMEgAAAAAAACgmAAAbAQAAHAEAAB0BAAAeAQAAHwEAADM0YnRTcGhlcmVUcmlhbmdsZUNvbGxpc2lvbkFsZ29yaXRobQAAAAB0ZgAAACYAAAwUAAAAAAAAjCYAACABAAAhAQAAIgEAAAAAAAC0JgAAIwEAACQBAAAlAQAAJgEAACcBAABOMjNidENvbnZleENvbnZleEFsZ29yaXRobTEwQ3JlYXRlRnVuY0UAdGYAAGQmAABAFQAAMjNidENvbnZleENvbnZleEFsZ29yaXRobQAAAHRmAACYJgAADBQAAAAAAABkJwAAbAAAACgBAAApAQAAKgEAACsBAABaTjIzYnRDb252ZXhDb252ZXhBbGdvcml0aG0xNnByb2Nlc3NDb2xsaXNpb25FUEsyNGJ0Q29sbGlzaW9uT2JqZWN0V3JhcHBlclMyX1JLMTZidERpc3BhdGNoZXJJbmZvUDE2YnRNYW5pZm9sZFJlc3VsdEUxM2J0RHVtbXlSZXN1bHQAAAAAdGYAANwmAABcEwAAAAAAABwoAABsAAAALAEAAC0BAAAuAQAALwEAAFpOMjNidENvbnZleENvbnZleEFsZ29yaXRobTE2cHJvY2Vzc0NvbGxpc2lvbkVQSzI0YnRDb2xsaXNpb25PYmplY3RXcmFwcGVyUzJfUksxNmJ0RGlzcGF0Y2hlckluZm9QMTZidE1hbmlmb2xkUmVzdWx0RTIxYnRXaXRob3V0TWFyZ2luUmVzdWx0AAAAAHRmAACMJwAAXBMAAAAAAABgKAAAbAAAADABAADYAAAA2QAAADEBAAAyNGJ0UGVydHVyYmVkQ29udGFjdFJlc3VsdAAAdGYAAEQoAADYGwAAAAAAAKgoAAAyAQAAMwEAADQBAAA1AQAANgEAADI4YnRDb21wb3VuZENvbGxpc2lvbkFsZ29yaXRobQAAdGYAAIgoAAAMFAAAAAAAAPQoAAD4AAAANwEAAPoAAAA4AQAA/AAAAP0AAAD+AAAAMjJidENvbXBvdW5kTGVhZkNhbGxiYWNrAAAAAHRmAADYKAAA4CAAAAAAAAA4KQAAOQEAADoBAAA7AQAAPAEAAD0BAAAyM2J0SGFzaGVkU2ltcGxlUGFpckNhY2hlAAAATGYAABwpAAAAAAAAhCkAAD4BAAA/AQAAQAEAAEEBAABCAQAAMzZidENvbXBvdW5kQ29tcG91bmRDb2xsaXNpb25BbGdvcml0aG0AAHRmAABcKQAADBQAAAAAAADYKQAA+AAAAEMBAABEAQAARQEAAPwAAAD9AAAA/gAAADMwYnRDb21wb3VuZENvbXBvdW5kTGVhZkNhbGxiYWNrAAAAAHRmAAC0KQAA4CAAAAAAAAB0KgAARgEAAEcBAABIAQAAqwAAAKwAAACtAAAASQEAAEoBAABLAQAATAEAALIAAABNAQAATgEAAE8BAABQAQAAtwAAAFEBAABSAQAAYnRDb21wb3VuZFNoYXBlQ2hpbGREYXRhAGJ0Q29tcG91bmRTaGFwZURhdGEAMTVidENvbXBvdW5kU2hhcGUAAHRmAABhKgAA9DMAAENvbXBvdW5kAAAAAAAAAADIKwAAUwEAAFQBAABVAQAAqwAAAKwAAACtAAAAVgEAAK8AAABXAQAAWAEAAFkBAACzAAAAtAAAAFoBAABbAQAAtwAAAFwBAABdAQAAugAAAF4BAAC8AAAAXwEAAGABAAAAAAAA5CsAAFMBAABhAQAAVQEAAKsAAACsAAAArQAAAFYBAACvAAAAVwEAAGIBAABjAQAAswAAALQAAABaAQAAWwEAALcAAABcAQAAXQEAALoAAABeAQAAvAAAAF8BAABgAQAAAAAAAAAsAABTAQAAZAEAAFUBAACrAAAArAAAAK0AAABWAQAArwAAAFcBAABlAQAAZgEAALMAAAC0AAAAWgEAAFsBAAC3AAAAXAEAAF0BAAC6AAAAXgEAALwAAABfAQAAYAEAADExYnRDb25lU2hhcGUAAAB0ZgAAuCsAAFw1AAAxMmJ0Q29uZVNoYXBlWgAAdGYAANQrAADIKwAAMTJidENvbmVTaGFwZVgAAHRmAADwKwAAyCsAAENvbmUAYnRDb25lU2hhcGVEYXRhAENvbmVaAENvbmVYAAAAAAAAAABYLAAAZwEAAGgBAAAxOGJ0Q29udmV4UG9seWhlZHJvbgAAAABMZgAAQCwAAAAAAAAELQAAaQEAAGoBAABrAQAAqwAAAKwAAACtAAAAbAEAAK8AAABtAQAAbgEAALIAAACzAAAAtAAAAG8BAABwAQAAtwAAALgAAABxAQAAugAAAHIBAAC8AAAAXwEAAGABAABidFBvc2l0aW9uQW5kUmFkaXVzAGJ0TXVsdGlTcGhlcmVTaGFwZURhdGEAMThidE11bHRpU3BoZXJlU2hhcGUAdGYAAO8sAACMNQAATXVsdGlTcGhlcmUAAAAAAJAtAABTAQAAcwEAAHQBAACrAAAArAAAAK0AAACuAAAArwAAAHUBAAB2AQAAsgAAAHcBAAB4AQAAtQAAALYAAAC3AAAAeQEAAHoBAAC6AAAAewEAALwAAABfAQAAYAEAADEzYnRTcGhlcmVTaGFwZQB0ZgAAgC0AAFw1AABTUEhFUkUAAAAAAAA0LgAAfAEAAH0BAAB+AQAAqwAAAKwAAACtAAAAfwEAAIABAACBAQAAggEAALIAAACDAQAAhAEAAIUBAACGAQAAtwAAAIcBAACIAQAAiQEAAIoBAACLAQAAYnRUcmlhbmdsZU1lc2hTaGFwZURhdGEAMjJidEJ2aFRyaWFuZ2xlTWVzaFNoYXBlAAAAAHRmAAAYLgAAiDAAAAAAAADcLgAAjAEAAI0BAACOAQAAWk4yMmJ0QnZoVHJpYW5nbGVNZXNoU2hhcGUxNHBlcmZvcm1SYXljYXN0RVAxOGJ0VHJpYW5nbGVDYWxsYmFja1JLOWJ0VmVjdG9yM1M0X0UyMU15Tm9kZU92ZXJsYXBDYWxsYmFjawAyMWJ0Tm9kZU92ZXJsYXBDYWxsYmFjawBMZgAAvC4AAHRmAABULgAA1C4AAAAAAABwLwAAjAEAAI8BAACQAQAAWk4yMmJ0QnZoVHJpYW5nbGVNZXNoU2hhcGUxN3BlcmZvcm1Db252ZXhjYXN0RVAxOGJ0VHJpYW5nbGVDYWxsYmFja1JLOWJ0VmVjdG9yM1M0X1M0X1M0X0UyMU15Tm9kZU92ZXJsYXBDYWxsYmFjawAAAAB0ZgAA/C4AANQuAAAAAAAAADAAAIwBAACRAQAAkgEAAFpOSzIyYnRCdmhUcmlhbmdsZU1lc2hTaGFwZTE5cHJvY2Vzc0FsbFRyaWFuZ2xlc0VQMThidFRyaWFuZ2xlQ2FsbGJhY2tSSzlidFZlY3RvcjNTNF9FMjFNeU5vZGVPdmVybGFwQ2FsbGJhY2sAAAB0ZgAAkC8AANQuAABCVkhUUklBTkdMRU1FU0gAAAAAAIgwAACTAQAAlAEAAH4BAACrAAAArAAAAK0AAACVAQAAgAEAAIEBAACWAQAAsgAAAIMBAACEAQAAlwEAAJgBAAC3AAAAmQEAAIgBAACJAQAAMTlidFRyaWFuZ2xlTWVzaFNoYXBlAAAAdGYAAHAwAADYOQAAAAAAABAxAACaAQAAmwEAAJwBAABaTksxOWJ0VHJpYW5nbGVNZXNoU2hhcGUxOXByb2Nlc3NBbGxUcmlhbmdsZXNFUDE4YnRUcmlhbmdsZUNhbGxiYWNrUks5YnRWZWN0b3IzUzRfRTE2RmlsdGVyZWRDYWxsYmFjawAAAHRmAACoMAAAtDYAAAAAAABIMQAAyAAAAJ0BAACeAQAAMjFTdXBwb3J0VmVydGV4Q2FsbGJhY2sAdGYAADAxAACINgAAVFJJQU5HTEVNRVNIAAAAAAAAAADIMQAAnwEAAKABAAChAQAAqwAAAKwAAACtAAAAogEAAKMBAACkAQAApQEAALIAAACDAQAAhAEAAKYBAACnAQAAtwAAAKgBAAAxOGJ0U3RhdGljUGxhbmVTaGFwZQAAAAB0ZgAAsDEAANg5AABTVEFUSUNQTEFORQBidFN0YXRpY1BsYW5lU2hhcGVEYXRhAAAAAAAAHDMAAKgAAACpAQAAVQEAAKsAAACsAAAArQAAAK4AAACvAAAAqgEAAAcAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAAqwEAALoAAACsAQAAvAAAAF8BAABgAQAAvwAAAAcAAAAHAAAABwAAAAcAAAAHAAAABwAAAAcAAAAAAAAAUDMAAKgAAACtAQAArgEAAKsAAACsAAAArQAAAK8BAACvAAAAqgEAAAcAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAAqwEAALoAAACsAQAAvAAAAF8BAABgAQAAvwAAAAcAAAAHAAAABwAAAAcAAAAHAAAABwAAAAcAAAAyM2J0UG9seWhlZHJhbENvbnZleFNoYXBlAAAAdGYAAAAzAABcNQAAMzRidFBvbHloZWRyYWxDb252ZXhBYWJiQ2FjaGluZ1NoYXBlAAAAAHRmAAAoMwAAHDMAAAAAAAC4MwAAsAEAALEBAACyAQAAqwAAAKwAAACtAAAAswEAALQBAAC1AQAAtgEAALIAAACDAQAAhAEAAJcBAACYAQAAtwAAALcBAAAxMmJ0RW1wdHlTaGFwZQAAdGYAAKgzAADYOQAARW1wdHkAYnRDb2xsaXNpb25TaGFwZURhdGEAMTZidENvbGxpc2lvblNoYXBlAAAATGYAAN8zAAAAAAAAcDQAAFMBAAC4AQAABwAAAKsAAACsAAAArQAAAAcAAAAHAAAABwAAAAcAAACyAAAABwAAAAcAAACXAQAAmAEAALcAAAAHAAAABwAAALoAAAAHAAAABwAAAAcAAAAHAAAAMTNidENvbnZleFNoYXBlAHRmAABgNAAA9DMAAAAAAABcNQAAUwEAALkBAABVAQAAqwAAAKwAAACtAAAArgAAAK8AAAAHAAAABwAAALIAAACzAAAAtAAAALUAAAC2AAAAtwAAALgAAAAHAAAAugAAAAcAAAC8AAAAXwEAAGABAAAAAAAAjDUAAFMBAAC6AQAAawEAAKsAAACsAAAArQAAAGwBAACvAAAABwAAAAcAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAABwAAALoAAAAHAAAAvAAAAF8BAABgAQAAMjFidENvbnZleEludGVybmFsU2hhcGUAdGYAAEQ1AABwNAAAMzJidENvbnZleEludGVybmFsQWFiYkNhY2hpbmdTaGFwZQAAdGYAAGg1AABcNQAAAAAAAGA2AAC7AQAAvAEAAK4BAACrAAAArAAAAK0AAAC9AQAArwAAAKoBAAC+AQAAsgAAALMAAAC0AAAAvwEAAMABAAC3AAAAwQEAAMIBAAC6AAAAwwEAALwAAABfAQAAYAEAAL8AAADEAQAAxQEAAMYBAADHAQAAyAEAAMkBAADKAQAAywEAAGJ0VmVjdG9yM0Zsb2F0RGF0YQBidENvbnZleEh1bGxTaGFwZURhdGEAMTdidENvbnZleEh1bGxTaGFwZQAAAAB0ZgAASTYAAFAzAABDb252ZXgAMThidFRyaWFuZ2xlQ2FsbGJhY2sATGYAAHM2AAAzMWJ0SW50ZXJuYWxUcmlhbmdsZUluZGV4Q2FsbGJhY2sAAABMZgAAkDYAAAAAAAD8NwAAUwEAAMwBAADNAQAAqwAAAKwAAACtAAAAzgEAAK8AAADPAQAA0AEAANEBAADSAQAAtAAAANMBAADUAQAAtwAAALgAAADVAQAAugAAANYBAAC8AAAAXwEAAGABAAAAAAAAHDgAAFMBAADXAQAAzQEAAKsAAACsAAAArQAAAM4BAACvAAAAzwEAANgBAADRAQAA0gEAALQAAADTAQAA1AEAALcAAAC4AAAA1QEAALoAAADWAQAAvAAAAF8BAABgAQAAAAAAADw4AABTAQAA2QEAAM0BAACrAAAArAAAAK0AAADOAQAArwAAAM8BAADaAQAA0QEAANIBAAC0AAAA0wEAANQBAAC3AAAAuAAAANUBAAC6AAAA1gEAALwAAABfAQAAYAEAADE0YnRDYXBzdWxlU2hhcGUAAAAAdGYAAOg3AABcNQAAMTVidENhcHN1bGVTaGFwZVgAAAB0ZgAACDgAAPw3AAAxNWJ0Q2Fwc3VsZVNoYXBlWgAAAHRmAAAoOAAA/DcAAENhcHN1bGVTaGFwZQBidENhcHN1bGVTaGFwZURhdGEAQ2Fwc3VsZVgAQ2Fwc3VsZVoAAAAAAAAAHDkAAKgAAADbAQAArgEAAKsAAACsAAAArQAAANwBAADdAQAAqgEAAN4BAACyAAAAswAAALQAAAC1AAAAtgAAALcAAADfAQAA4AEAALoAAADhAQAAvAAAAF8BAABgAQAAvwAAAOIBAADjAQAA5AEAAOUBAADmAQAA5wEAAOgBAAAyNWJ0Q29udmV4VHJpYW5nbGVNZXNoU2hhcGUAdGYAAAA5AABQMwAAAAAAAFw5AACaAQAA6QEAAOoBAAAyNkxvY2FsU3VwcG9ydFZlcnRleENhbGxiYWNrAAAAAHRmAAA8OQAAtDYAAENvbnZleFRyaW1lc2gAAAAAAAAA2DkAAOsBAADsAQAABwAAAKsAAACsAAAArQAAAAcAAAAHAAAABwAAAAcAAACyAAAAgwEAAIQBAACXAQAAmAEAALcAAAAHAAAAMTRidENvbmNhdmVTaGFwZQAAAAB0ZgAAxDkAAPQzAAAAAAAAfDoAAKgAAADtAQAA7gEAAKsAAACsAAAArQAAAO8BAACvAAAA8AEAAPEBAACyAAAA8gEAALQAAAC1AAAAtgAAALcAAADzAQAA9AEAALoAAAD1AQAAvAAAAPYBAAD3AQAAvwAAAPgBAAD5AQAA+gEAAPsBAAD8AQAA/QEAAP4BAAD/AQAAMTBidEJveFNoYXBlAAAAAHRmAABsOgAAHDMAAEJveAAAAIA/AACAvw==");R(X,15022,"gD8AAIC/");R(X,15054,"gD8AAIC/AAAAAAAAAAABAAAAAgAAAAAAAAABAAAAAgAAAAMAAAAEAAAABAAAAAUAAAAGAAAAAQAAAAIAAAADAAAAAwAAAAQAAAAFAAAABgAAAAcAAAAFAAAABgAAAAcAAAAHAAAAAAAAAHA7AAAAAgAAAQIAAAICAAADAgAABAIAAAUCAAAGAgAABwIAADE0YnRPcHRpbWl6ZWRCdmgAAAAAdGYAAFw7AABURQAAAAAAAPQ7AACaAQAACAIAAAkCAABaTjE0YnRPcHRpbWl6ZWRCdmg1YnVpbGRFUDIzYnRTdHJpZGluZ01lc2hJbnRlcmZhY2ViUks5YnRWZWN0b3IzUzRfRTI5UXVhbnRpemVkTm9kZVRyaWFuZ2xlQ2FsbGJhY2sAdGYAAJA7AAC0NgAAAAAAAHA8AACaAQAACgIAAAsCAABaTjE0YnRPcHRpbWl6ZWRCdmg1YnVpbGRFUDIzYnRTdHJpZGluZ01lc2hJbnRlcmZhY2ViUks5YnRWZWN0b3IzUzRfRTIwTm9kZVRyaWFuZ2xlQ2FsbGJhY2sAAHRmAAAUPAAAtDYAAAAAAADoPAAADAIAAA0CAAAOAgAAqwAAAKwAAACtAAAADwIAABACAAARAgAAEgIAALIAAACDAQAAhAEAAJcBAACYAQAAtwAAABMCAAAUAgAAMjVidEhlaWdodGZpZWxkVGVycmFpblNoYXBlAHRmAADMPAAA2DkAAEhFSUdIVEZJRUxEAAAAAABMPgAAUwEAABUCAAAWAgAAqwAAAKwAAACtAAAAFwIAAK8AAAAYAgAAGQIAABoCAAAbAgAAtAAAABwCAAAdAgAAtwAAAB4CAAAfAgAAugAAACACAAC8AAAAXwEAAGABAAAhAgAAAAAAAGw+AABTAQAAIgIAABYCAACrAAAArAAAAK0AAAAXAgAArwAAABgCAAAjAgAAGgIAABsCAAC0AAAAHAIAAB0CAAC3AAAAHgIAACQCAAC6AAAAJQIAALwAAABfAQAAYAEAACYCAAAAAAAAjD4AAFMBAAAnAgAAFgIAAKsAAACsAAAArQAAABcCAACvAAAAGAIAACgCAAAaAgAAGwIAALQAAAAcAgAAHQIAALcAAAAeAgAAKQIAALoAAAAqAgAAvAAAAF8BAABgAQAAKwIAADE1YnRDeWxpbmRlclNoYXBlAAAAdGYAADg+AABcNQAAMTZidEN5bGluZGVyU2hhcGVYAAB0ZgAAWD4AAEw+AAAxNmJ0Q3lsaW5kZXJTaGFwZVoAAHRmAAB4PgAATD4AAEN5bGluZGVyWQBidEN5bGluZGVyU2hhcGVEYXRhAEN5bGluZGVyWABDeWxpbmRlcloAYnRJbnRJbmRleERhdGEAYnRTaG9ydEludEluZGV4VHJpcGxldERhdGEAYnRDaGFySW5kZXhUcmlwbGV0RGF0YQBidFZlY3RvcjNGbG9hdERhdGEAYnRWZWN0b3IzRG91YmxlRGF0YQBidE1lc2hQYXJ0RGF0YQBidFN0cmlkaW5nTWVzaEludGVyZmFjZURhdGEAMjNidFN0cmlkaW5nTWVzaEludGVyZmFjZQAATGYAAF0/AAAAAAAA5D8AACwCAAAtAgAALgIAAC8CAAAwAgAAMQIAADICAAAzAgAANAIAADUCAAA2AgAANwIAADgCAAA5AgAAOgIAADI2YnRUcmlhbmdsZUluZGV4VmVydGV4QXJyYXkAAAAAdGYAAMQ/AAB4PwAAAAAAAEhAAAA7AgAAPAIAAC4CAAAvAgAAMAIAADECAAAyAgAAMwIAAD0CAAA+AgAANgIAADcCAAA4AgAAOQIAADoCAAAxNGJ0VHJpYW5nbGVNZXNoAAAAAHRmAAA0QAAA5D8AAAAAAADsQAAAPwIAAEACAABBAgAAQgIAAEMCAABEAgAARQIAAEYCAABHAgAASAIAAEkCAABKAgAASwIAAEwCAAAxMmJ0QXhpc1N3ZWVwMwAyMGJ0QXhpc1N3ZWVwM0ludGVybmFsSXRFADIxYnRCcm9hZHBoYXNlSW50ZXJmYWNlAAAAAExmAAC9QAAAdGYAAKNAAADYQAAAdGYAAJRAAADgQAAAAAAAAOBAAAA/AgAATQIAAEECAABCAgAAQwIAAEQCAABFAgAARgIAAEcCAABIAgAASQIAAEoCAABLAgAATAIAAAAAAAC8QQAATgIAAE8CAABQAgAAUQIAAFICAABTAgAAVAIAAFUCAABWAgAAVwIAAFgCAABZAgAAWgIAAFsCAABcAgAAXQIAAF4CAAAxNWJ0TnVsbFBhaXJDYWNoZQAyMmJ0T3ZlcmxhcHBpbmdQYWlyQ2FjaGUAAHRmAACWQQAAlAYAAHRmAACEQQAAsEEAAAAAAAA0QgAAXwIAAGACAABhAgAAYgIAAGMCAABkAgAAZQIAAGYCAABnAgAAaAIAAGkCAABqAgAAawIAAGwCAABtAgAAbgIAAG8CAAAyOGJ0SGFzaGVkT3ZlcmxhcHBpbmdQYWlyQ2FjaGUAAHRmAAAUQgAAsEEAAAAAAADEQgAAXwAAAHACAABxAgAAWk4yOGJ0SGFzaGVkT3ZlcmxhcHBpbmdQYWlyQ2FjaGUxOWNsZWFuUHJveHlGcm9tUGFpcnNFUDE3YnRCcm9hZHBoYXNlUHJveHlQMTJidERpc3BhdGNoZXJFMTdDbGVhblBhaXJDYWxsYmFjawAAAHRmAABUQgAADBEAAAAAAABoQwAAXwAAAHICAABzAgAAWk4yOGJ0SGFzaGVkT3ZlcmxhcHBpbmdQYWlyQ2FjaGUzN3JlbW92ZU92ZXJsYXBwaW5nUGFpcnNDb250YWluaW5nUHJveHlFUDE3YnRCcm9hZHBoYXNlUHJveHlQMTJidERpc3BhdGNoZXJFMThSZW1vdmVQYWlyQ2FsbGJhY2sAAAAAdGYAAORCAAAMEQAAAAAAAMhDAAB0AgAAdQIAAHYCAAB3AgAAeAIAAHkCAAB6AgAAewIAAHwCAAB9AgAAfgIAAH8CAACAAgAAgQIAADE2YnREYnZ0QnJvYWRwaGFzZQAAdGYAALRDAADYQAAAAAAAABBEAAD4AAAAggIAAIMCAACEAgAA/AAAAP0AAAD+AAAAMThidERidnRUcmVlQ29sbGlkZXIAAAAAdGYAAPhDAADgIAAAAAAAAFhEAAD4AAAAhQIAAPoAAACGAgAA/AAAAP0AAAD+AAAAMTlCcm9hZHBoYXNlUmF5VGVzdGVyAAAAdGYAAEBEAADgIAAAAAAAAKBEAAD4AAAAhwIAAPoAAACIAgAA/AAAAP0AAAD+AAAAMjBCcm9hZHBoYXNlQWFiYlRlc3RlcgAAdGYAAIhEAADgIAAAMTJidERpc3BhdGNoZXIAAExmAACsRAAAAAAAAFRFAACJAgAAigIAAAICAAADAgAABAIAAAUCAAAGAgAAYnRPcHRpbWl6ZWRCdmhOb2RlRGF0YQBidFF1YW50aXplZEJ2aE5vZGVEYXRhAGJ0QnZoU3VidHJlZUluZm9EYXRhAGJ0UXVhbnRpemVkQnZoRmxvYXREYXRhADE0YnRRdWFudGl6ZWRCdmgATGYAAENFAAAAAAAAuBMAAHEAAACLAgAABwAAAAcAAAAHAAAAAAAAAMBFAACMAgAAjQIAAI4CAABCAAAAjwIAAJACAACRAgAAYnRSaWdpZEJvZHlGbG9hdERhdGEAMTFidFJpZ2lkQm9keQAAdGYAALFFAAC4DwAAAAAAACxGAACSAgAAkwIAAJQCAACVAgAAaXNsYW5kVW5pb25GaW5kQW5kUXVpY2tTb3J0AHByb2Nlc3NJc2xhbmRzADI1YnRTaW11bGF0aW9uSXNsYW5kTWFuYWdlcgAATGYAAA9GAAAAAAAAqEgAAJYCAACXAgAA6QAAAOoAAADrAAAA7AAAAJgCAADuAAAA7wAAAJkCAACaAgAA8gAAAJsCAACcAgAAnQIAAJ4CAACfAgAAoAIAAKECAACiAgAAowIAAKQCAAClAgAApgIAAKcCAACoAgAAqQIAAKoCAACrAgAArAIAAK0CAACuAgAArwIAALACAACxAgAAsgIAALMCAAC0AgAAtQIAALYCAAC3AgAAuAIAALkCAAC6AgAAuwIAAGRlYnVnRHJhd1dvcmxkAHN5bmNocm9uaXplTW90aW9uU3RhdGVzAHN0ZXBTaW11bGF0aW9uAGludGVybmFsU2luZ2xlU3RlcFNpbXVsYXRpb24AdXBkYXRlQWN0aW9ucwB1cGRhdGVBY3RpdmF0aW9uU3RhdGUAc29sdmVDb25zdHJhaW50cwBjYWxjdWxhdGVTaW11bGF0aW9uSXNsYW5kcwBjcmVhdGVQcmVkaWN0aXZlQ29udGFjdHMAcmVsZWFzZSBwcmVkaWN0aXZlIGNvbnRhY3QgbWFuaWZvbGRzAHByZWRpY3RpdmUgY29udmV4U3dlZXBUZXN0AGludGVncmF0ZVRyYW5zZm9ybXMAQ0NEIG1vdGlvbiBjbGFtcGluZwBhcHBseSBzcGVjdWxhdGl2ZSBjb250YWN0IHJlc3RpdHV0aW9uAHByZWRpY3RVbmNvbnN0cmFpbnRNb3Rpb24AYnREeW5hbWljc1dvcmxkRmxvYXREYXRhADIzYnREaXNjcmV0ZUR5bmFtaWNzV29ybGQAMTVidER5bmFtaWNzV29ybGQAAAAAdGYAAIdIAACsHgAAdGYAAG1IAACcSAAAAAAAABxJAAC8AgAAvQIAAL4CAAAyN0lucGxhY2VTb2x2ZXJJc2xhbmRDYWxsYmFjawBOMjVidFNpbXVsYXRpb25Jc2xhbmRNYW5hZ2VyMTRJc2xhbmRDYWxsYmFja0UATGYAAOZIAAB0ZgAAyEgAABRJAAAAAAAAaEkAAAUAAAC/AgAAwAIAAMECAAAzNGJ0Q2xvc2VzdE5vdE1lQ29udmV4UmVzdWx0Q2FsbGJhY2sAAAAAdGYAAEBJAADkBAAAAAAAALxJAADCAgAAwwIAAMQCAADFAgAAxgIAAMcCAADIAgAAyQIAAMoCAADLAgAAzAIAADE3YnRGaXhlZENvbnN0cmFpbnQAdGYAAKhJAADMSwAAAAAAABxKAADNAgAAzgIAAM8CAADFAgAA0AIAANECAADIAgAA0gIAANMCAADUAgAA1QIAANYCAAAyM2J0R2VuZXJpYzZEb2ZDb25zdHJhaW50AAAAdGYAAABKAADMSwAAYnRHZW5lcmljNkRvZkNvbnN0cmFpbnREYXRhAAAAAACgSgAAzQIAANcCAADPAgAAxQIAANACAADYAgAAyAIAANICAADTAgAA2QIAANoCAADWAgAA2wIAADI5YnRHZW5lcmljNkRvZlNwcmluZ0NvbnN0cmFpbnQAdGYAAIBKAAAcSgAAYnRHZW5lcmljNkRvZlNwcmluZ0NvbnN0cmFpbnREYXRhAAAAAAAAACBLAADNAgAA3AIAAN0CAADFAgAA3gIAAN8CAADIAgAA4AIAAOECAADiAgAA4wIAADIzYnRQb2ludDJQb2ludENvbnN0cmFpbnQAAAB0ZgAABEsAAMxLAABidFBvaW50MlBvaW50Q29uc3RyYWludEZsb2F0RGF0YQAAAAAAAAAAzEsAAM0CAADlAgAAxAIAAMUCAAAHAAAABwAAAMgCAAAHAAAABwAAAMsCAADMAgAAYnRUeXBlZENvbnN0cmFpbnRGbG9hdERhdGEAMTdidFR5cGVkQ29uc3RyYWludAAxM2J0VHlwZWRPYmplY3QAAExmAACzSwAA0GYAAJ9LAAAAAAAAAQAAAMRLAAACBAAAAAAAADBMAADNAgAA5gIAAMQCAADFAgAA5wIAAOgCAADIAgAA6QIAAOoCAADrAgAA7AIAADE4YnRTbGlkZXJDb25zdHJhaW50AAAAAHRmAAAYTAAAzEsAAGJ0U2xpZGVyQ29uc3RyYWludERhdGEAAAAAAACkTAAAzQIAAO0CAADuAgAAxQIAAO8CAADwAgAA8QIAAPICAADzAgAA9AIAAPUCAAD2AgAAMjFidENvbmVUd2lzdENvbnN0cmFpbnQAdGYAAIxMAADMSwAAYnRDb25lVHdpc3RDb25zdHJhaW50RGF0YQAAAAAAAAAUTQAAzQIAAPcCAAD4AgAAxQIAAPkCAAD6AgAAyAIAAPsCAAD8AgAA/QIAAP4CAAAxN2J0SGluZ2VDb25zdHJhaW50AHRmAAAATQAAzEsAAGJ0SGluZ2VDb25zdHJhaW50RmxvYXREYXRhAAAAAAAACE4AAP8CAAAAAwAAAQMAAAIDAAADAwAABAMAAAUDAAAGAwAABwMAAAgDAAAJAwAACgMAAAsDAABzb2x2ZUdyb3VwQ2FjaGVGcmllbmRseVNldHVwAHNvbHZlR3JvdXBDYWNoZUZyaWVuZGx5SXRlcmF0aW9ucwBzb2x2ZUdyb3VwADM1YnRTZXF1ZW50aWFsSW1wdWxzZUNvbnN0cmFpbnRTb2x2ZXIAMThidENvbnN0cmFpbnRTb2x2ZXIAAAAATGYAAOhNAAB0ZgAAwk0AAABOAAAAAAAApE4AAA0DAAAOAwAADwMAABADAAARAwAAEgMAABMDAAAAAAAAaE4AAA4AAAAUAwAAFQMAADI1YnREZWZhdWx0VmVoaWNsZVJheWNhc3RlcgB0ZgAATE4AANAFAAAxNmJ0UmF5Y2FzdFZlaGljbGUAMTdidEFjdGlvbkludGVyZmFjZQAATGYAAIdOAAB0ZgAAdE4AAJxOAAAAAAAAQE8AABYDAAAXAwAAGAMAABkDAAAaAwAAGwMAABwDAAAdAwAAHgMAAB8DAAAgAwAAIQMAACIDAAAjAwAAMzBidEtpbmVtYXRpY0NoYXJhY3RlckNvbnRyb2xsZXIAMzBidENoYXJhY3RlckNvbnRyb2xsZXJJbnRlcmZhY2UAAAB0ZgAAEU8AAJxOAAB0ZgAA8E4AADRPAAAAAAAAlE8AAAUAAAAkAwAAAwAAACUDAAA0M2J0S2luZW1hdGljQ2xvc2VzdE5vdE1lQ29udmV4UmVzdWx0Q2FsbGJhY2sAAAB0ZgAAZE8AAOQEAAAAAAAAIFAAACYDAAAnAwAAKAMAACkDAAAqAwAAKwMAACwDAAAtAwAALgMAAC8DAAAwAwAAMQMAADIDAAAzAwAANAMAADUDAAAyM2J0RGVmYXVsdFNvZnRCb2R5U29sdmVyADE2YnRTb2Z0Qm9keVNvbHZlcgAAAABMZgAAAlAAAHRmAADoTwAAGFAAAAAAAAB4UAAANgMAADcDAAB/AAAAgAAAADgDAACCAAAANDFidFNvZnRCb2R5UmlnaWRCb2R5Q29sbGlzaW9uQ29uZmlndXJhdGlvbgB0ZgAATFAAAMwUAAAAAAAAyFAAAIMAAAA5AwAAOgMAAE4yOGJ0U29mdFNvZnRDb2xsaXNpb25BbGdvcml0aG0xMENyZWF0ZUZ1bmNFAAAAAHRmAACYUAAAQBUAAAAAAAAYUQAAgwAAADsDAAA8AwAATjI5YnRTb2Z0UmlnaWRDb2xsaXNpb25BbGdvcml0aG0xMENyZWF0ZUZ1bmNFAAAAdGYAAOhQAABAFQAAAAAAAGxRAACDAAAAPQMAAD4DAABOMzVidFNvZnRCb2R5Q29uY2F2ZUNvbGxpc2lvbkFsZ29yaXRobTEwQ3JlYXRlRnVuY0UAdGYAADhRAABAFQAAAAAAAMhRAACDAAAAPwMAAEADAABOMzVidFNvZnRCb2R5Q29uY2F2ZUNvbGxpc2lvbkFsZ29yaXRobTE3U3dhcHBlZENyZWF0ZUZ1bmNFAAB0ZgAAjFEAAEAVAAAAAAAAzFMAAD8AAABCAwAAQwMAAEQDAABFAwAARgMAAEUAAABHAwAAAAAAAPhTAAD4AAAASAMAAPoAAABJAwAA/AAAAP0AAAD+AAAAAAAAAAEAAAACAAAAAAAAAAEAAAADAAAAAQAAAAIAAAADAAAAAAAAAAIAAAADAAAAVXBkYXRlQ2x1c3RlcnMAQXBwbHlDbHVzdGVycwBTb2Z0Qm9keSBhcHBseUZvcmNlcwBTb2Z0Qm9keU1hdGVyaWFsRGF0YQBTb2Z0Qm9keU5vZGVEYXRhAFNvZnRCb2R5TGlua0RhdGEAU29mdEJvZHlGYWNlRGF0YQBTb2Z0Qm9keVRldHJhRGF0YQBTb2Z0UmlnaWRBbmNob3JEYXRhAGJ0VmVjdG9yM0Zsb2F0RGF0YQBmbG9hdABTb2Z0Qm9keVBvc2VEYXRhAGludABTb2Z0Qm9keUNsdXN0ZXJEYXRhAGJ0U29mdEJvZHlKb2ludERhdGEAYnRTb2Z0Qm9keUZsb2F0RGF0YQBOMTBidFNvZnRCb2R5NUpvaW50RQAATGYAAFpTAAAAAAAAsFMAAEoDAABLAwAATAMAAE0DAABOAwAATwMAAE4xMGJ0U29mdEJvZHk2Q0pvaW50RQAAAHRmAACYUwAAcFMAADEwYnRTb2Z0Qm9keQAAAAB0ZgAAvFMAALgPAABOMTBidFNvZnRCb2R5MTVSYXlGcm9tVG9DYXN0ZXJFAHRmAADYUwAA4CAAAAAAAABsVAAA6wEAAFADAABRAwAAqwAAAKwAAACtAAAAUgMAAFMDAABUAwAAVQMAALIAAACDAQAAhAEAAJcBAACYAQAAtwAAAFYDAAAyNGJ0U29mdEJvZHlDb2xsaXNpb25TaGFwZQAAdGYAAFBUAADYOQAAU29mdEJvZHkAAAAAAAAAAMxUAAD4AAAAVwMAAPoAAABYAwAA/AAAAP0AAAD+AAAATjE1YnRTb2Z0Q29sbGlkZXJzMTNDb2xsaWRlU0RGX1JTRQAAdGYAAKhUAADgIAAAAAAAAExVAAD4AAAAWQMAAPoAAABaAwAA/AAAAP0AAAD+AAAATjE1YnRTb2Z0Q29sbGlkZXJzMTJDb2xsaWRlQ0xfUlNFAE4xNWJ0U29mdENvbGxpZGVyczExQ2x1c3RlckJhc2VFAAB0ZgAAHlUAAOAgAAB0ZgAA/FQAAEBVAAAAAAAA4FUAAFMBAABbAwAAXAMAAKsAAACsAAAArQAAAK4AAACvAAAAXQMAAF4DAACyAAAAXwMAAGADAAC1AAAAtgAAALcAAABhAwAAYgMAALoAAABjAwAAvAAAAF8BAABgAQAAZAMAADI3YnRTb2Z0Q2x1c3RlckNvbGxpc2lvblNoYXBlAAAAdGYAAMBVAABcNQAAU09GVENMVVNURVIAAAAAAEBWAAD4AAAAZQMAAGYDAABFAQAA/AAAAP0AAAD+AAAATjE1YnRTb2Z0Q29sbGlkZXJzMTJDb2xsaWRlQ0xfU1NFAAAAdGYAABxWAABAVQAAAAAAAJRWAAD4AAAAZwMAAGgDAABFAQAA/AAAAP0AAAD+AAAATjE1YnRTb2Z0Q29sbGlkZXJzMTJDb2xsaWRlVkZfU1NFAAAAdGYAAHBWAADgIAAAaQMAAGoDAABrAwAAbAMAAAAAAADsVgAAbQMAAG4DAABvAwAAcAMAAHEDAAAyOWJ0U29mdFJpZ2lkQ29sbGlzaW9uQWxnb3JpdGhtAHRmAADMVgAAuBMAAAAAAABQVwAAcgMAAHMDAAB0AwAAdQMAAHYDAAAAAAAAfFcAAHcDAAB4AwAAeQMAADM1YnRTb2Z0Qm9keUNvbmNhdmVDb2xsaXNpb25BbGdvcml0aG0AAAB0ZgAAKFcAALgTAAAyNmJ0U29mdEJvZHlUcmlhbmdsZUNhbGxiYWNrAAAAAHRmAABcVwAAiDYAAAAAAAA8WAAAyAAAAHoDAAB7AwAAWk4zNWJ0U29mdEJvZHlDb25jYXZlQ29sbGlzaW9uQWxnb3JpdGhtMjFjYWxjdWxhdGVUaW1lT2ZJbXBhY3RFUDE3YnRDb2xsaXNpb25PYmplY3RTMV9SSzE2YnREaXNwYXRjaGVySW5mb1AxNmJ0TWFuaWZvbGRSZXN1bHRFMzFMb2NhbFRyaWFuZ2xlU3BoZXJlQ2FzdENhbGxiYWNrAHRmAACcVwAAiDYAAAAAAABgWQAAfAMAAH0DAADpAAAA6gAAAOsAAADsAAAAfgMAAO4AAAB/AwAAmQIAAIADAADyAAAAgQMAAJwCAACdAgAAngIAAJ8CAACgAgAAoQIAAKICAACjAgAApAIAAKUCAACmAgAApwIAAKgCAACpAgAAqgIAAKsCAACCAwAArQIAAK4CAACvAgAAsAIAALECAACDAwAAswIAALQCAAC1AgAAtgIAAIQDAAC4AgAAuQIAALoCAAC7AgAAcHJlZGljdFVuY29uc3RyYWludE1vdGlvblNvZnRCb2R5AHNvbHZlU29mdENvbnN0cmFpbnRzAHJheVRlc3QAMjRidFNvZnRSaWdpZER5bmFtaWNzV29ybGQAAAB0ZgAAQ1kAAKhIAAAAAAAAnFkAAAkBAACFAwAAhgMAADIzYnRTb2Z0U2luZ2xlUmF5Q2FsbGJhY2sAAAB0ZgAAgFkAAHgkAAAAAAAA5FkAAIcDAACIAwAAiQMAAIoDAACLAwAAMjhidFNvZnRTb2Z0Q29sbGlzaW9uQWxnb3JpdGhtAAB0ZgAAxFkAALgTAABSb290AAAAABe30TgQAAAAAwAAAAQAAAAEAAAABgAAAIP5ogBETm4A/CkVANFXJwDdNPUAYtvAADyZlQBBkEMAY1H+ALveqwC3YcUAOm4kANJNQgBJBuAACeouAByS0QDrHf4AKbEcAOg+pwD1NYIARLsuAJzphAC0JnAAQX5fANaROQBTgzkAnPQ5AItfhAAo+b0A+B87AN7/lwAPmAUAES/vAApaiwBtH20Az342AAnLJwBGT7cAnmY/AC3qXwC6J3UA5evHAD178QD3OQcAklKKAPtr6gAfsV8ACF2NADADVgB7/EYA8KtrACC8zwA29JoA46kdAF5hkQAIG+YAhZllAKAUXwCNQGgAgNj/ACdzTQAGBjEAylYVAMmocwB74mAAa4zAABnERwDNZ8MACejcAFmDKgCLdsQAphyWAESv3QAZV9EApT4FAAUH/wAzfj8AwjLoAJhP3gC7fTIAJj3DAB5r7wCf+F4ANR86AH/yygDxhx0AfJAhAGokfADVbvoAMC13ABU7QwC1FMYAwxmdAK3EwgAsTUEADABdAIZ9RgDjcS0Am8aaADNiAAC00nwAtKeXADdV1QDXPvYAoxAYAE12/ABknSoAcNerAGN8+AB6sFcAFxXnAMBJVgA71tkAp4Q4ACQjywDWincAWlQjAAAfuQDxChsAGc7fAJ8x/wBmHmoAmVdhAKz7RwB+f9gAImW3ADLoiQDmv2AA78TNAGw2CQBdP9QAFt7XAFg73gDem5IA0iIoACiG6ADiWE0AxsoyAAjjFgDgfcsAF8BQAPMdpwAY4FsALhM0AIMSYgCDSAEA9Y5bAK2wfwAe6fIASEpDABBn0wCq3dgArl9CAGphzgAKKKQA05m0AAam8gBcd38Ao8KDAGE8iACKc3gAr4xaAG/XvQAtpmMA9L/LAI2B7wAmwWcAVcpFAMrZNgAoqNIAwmGNABLJdwAEJhQAEkabAMRZxADIxUQATbKRAAAX8wDUQ60AKUnlAP3VEAAAvvwAHpTMAHDO7gATPvUA7PGAALPnwwDH+CgAkwWUAMFxPgAuCbMAC0XzAIgSnACrIHsALrWfAEeSwgB7Mi8ADFVtAHKnkABr5x8AMcuWAHkWSgBBeeIA9N+JAOiUlwDi5oQAmTGXAIjtawBfXzYAu/0OAEiatABnpGwAcXJCAI1dMgCfFbgAvOUJAI0xJQD3dDkAMAUcAA0MAQBLCGgALO5YAEeqkAB05wIAvdYkAPd9pgBuSHIAnxbvAI6UpgC0kfYA0VNRAM8K8gAgmDMA9Ut+ALJjaADdPl8AQF0DAIWJfwBVUikAN2TAAG3YEAAySDIAW0x1AE5x1ABFVG4ACwnBACr1aQAUZtUAJwedAF0EUAC0O9sA6nbFAIf5FwBJa30AHSe6AJZpKQDGzKwArRRUAJDiagCI2YkALHJQAASkvgB3B5QA8zBwAAD8JwDqcagAZsJJAGTgPQCX3YMAoz+XAEOU/QANhowAMUHeAJI5nQDdcIwAF7fnAAjfOwAVNysAXICgAFqAkwAQEZIAD+jYAGyArwDb/0sAOJAPAFkYdgBipRUAYcu7AMeJuQAQQL0A0vIEAEl1JwDrtvYA2yK7AAoUqgCJJi8AZIN2AAk7MwAOlBoAUTqqAB2jwgCv7a4AXCYSAG3CTQAtepwAwFaXAAM/gwAJ8PYAK0CMAG0xmQA5tAcADCAVANjDWwD1ksQAxq1LAE7KpQCnN80A5qk2AKuSlADdQmgAGWPeAHaM7wBoi1IA/Ns3AK6hqwDfFTEAAK6hAAz72gBkTWYA7QW3ACllMABXVr8AR/86AGr5uQB1vvMAKJPfAKuAMABmjPYABMsVAPoiBgDZ5B0APbOkAFcbjwA2zQkATkLpABO+pAAzI7UA8KoaAE9lqADSwaUACz8PAFt4zQAj+XYAe4sEAIkXcgDGplMAb27iAO/rAACbSlgAxNq3AKpmugB2z88A0QIdALHxLQCMmcEAw613AIZI2gD3XaAAxoD0AKzwLwDd7JoAP1y8ANDebQCQxx8AKtu2AKMlOgAAr5oArVOTALZXBAApLbQAS4B+ANoHpwB2qg4Ae1mhABYSKgDcty0A+uX9AInb/gCJvv0A5HZsAAap/AA+gHAAhW4VAP2H/wAoPgcAYWczACoYhgBNveoAs+evAI9tbgCVZzkAMb9bAITXSAAw3xYAxy1DACVhNQDJcM4AMMu4AL9s/QCkAKIABWzkAFrdoAAhb0cAYhLSALlchABwYUkAa1bgAJlSAQBQVTcAHtW3ADPxxAATbl8AXTDkAIUuqQAdssMAoTI2AAi3pADqsdQAFvchAI9p5AAn/3cADAOAAI1ALQBPzaAAIKWZALOi0wAvXQoAtPlCABHaywB9vtAAm9vBAKsXvQDKooEACGpcAC5VFwAnAFUAfxTwAOEHhgAUC2QAlkGNAIe+3gDa/SoAayW2AHuJNAAF8/4Aub+eAGhqTwBKKqgAT8RaAC34vADXWpgA9MeVAA1NjQAgOqYApFdfABQ/sQCAOJUAzCABAHHdhgDJ3rYAv2D1AE1lEQABB2sAjLCsALLA0ABRVUgAHvsOAJVywwCjBjsAwEA1AAbcewDgRcwATin6ANbKyADo80EAfGTeAJtk2ADZvjEApJfDAHdY1ABp48UA8NoTALo6PABGGEYAVXVfANK99QBuksYArC5dAA5E7QAcPkIAYcSHACn96QDn1vMAInzKAG+RNQAI4MUA/9eNAG5q4gCw/cYAkwjBAHxddABrrbIAzW6dAD5yewDGEWoA98+pAClz3wC1yboAtwBRAOKyDQB0uiQA5X1gAHTYigANFSwAgRgMAH5mlAABKRYAn3p2AP39vgBWRe8A2X42AOzZEwCLurkAxJf8ADGoJwDxbsMAlMU2ANioVgC0qLUAz8wOABKJLQBvVzQALFaJAJnO4wDWILkAa16qAD4qnAARX8wA/QtKAOH0+wCOO20A4oYsAOnUhAD8tKkA7+7RAC41yQAvOWEAOCFEABvZyACB/AoA+0pqAC8c2ABTtIQATpmMAFQizAAqVdwAwMbWAAsZlgAacLgAaZVkACZaYAA/Uu4AfxEPAPS1EQD8y/UANLwtADS87gDoXcwA3V5gAGeOmwCSM+8AyRe4AGFYmwDhV7wAUYPGANg+EADdcUgALRzdAK8YoQAhLEYAWfPXANl6mACeVMAAT4b6AFYG/ADlea4AiSI2ADitIgBnk9wAVeiqAIImOADK55sAUQ2kAJkzsQCp1w4AaQVIAGWy8AB/iKcAiEyXAPnRNgAhkrMAe4JKAJjPIQBAn9wA3EdVAOF0OgBn60IA/p3fAF7UXwB7Z6QAuqx6AFX2ogAriCMAQbpVAFluCAAhKoYAOUeDAInj5gDlntQASftAAP9W6QAcD8oAxVmKAJT6KwDTwcUAD8XPANtargBHxYYAhUNiACGGOwAseZQAEGGHACpMewCALBoAQ78SAIgmkAB4PIkAqMTkAOXbewDEOsIAJvTqAPdnigANkr8AZaMrAD2TsQC9fAsApFHcACfdYwBp4d0AmpQZAKgplQBozigACe20AESfIABOmMoAcIJjAH58IwAPuTIAp/WOABRW5wAh8QgAtZ0qAG9+TQClGVEAtfmrAILf1gCW3WEAFjYCAMQ6nwCDoqEAcu1tADmNegCCuKkAazJcAEYnWwAANO0A0gB3APz0VQABWU0A4HGA");R(X,25827,"QPsh+T8AAAAALUR0PgAAAICYRvg8AAAAYFHMeDsAAACAgxvwOQAAAEAgJXo4AAAAgCKC4zYAAAAAHfNpNThj7T7aD0k/Xph7P9oPyT9pN6wxaCEiM7QPFDNoIaIz2w9JP9sPSb/kyxZA5MsWwAAAAAAAAACA2w9JQNsPScAAAIA/AADAPwAAAADcz9E1AAAAAADAFT9fX2N4YV9ndWFyZF9hY3F1aXJlIGRldGVjdGVkIHJlY3Vyc2l2ZSBpbml0aWFsaXphdGlvbgBQdXJlIHZpcnR1YWwgZnVuY3Rpb24gY2FsbGVkIQBTdDl0eXBlX2luZm8AAAAATGYAAMxlAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAAB0ZgAA5GUAANxlAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAAB0ZgAAFGYAAAhmAAAAAAAAOGYAAJIDAACTAwAAlAMAAJUDAACWAwAAlwMAAJgDAACZAwAAAAAAALxmAACSAwAAmgMAAJQDAACVAwAAlgMAAJsDAACcAwAAnQMAAE4xMF9fY3h4YWJpdjEyMF9fc2lfY2xhc3NfdHlwZV9pbmZvRQAAAAB0ZgAAlGYAADhmAAAAAAAAGGcAAJIDAACeAwAAlAMAAJUDAACWAwAAnwMAAKADAAChAwAATjEwX19jeHhhYml2MTIxX192bWlfY2xhc3NfdHlwZV9pbmZvRQAAAHRmAADwZgAAOGY=");R(X,26404,"CtejPAEBAAAAAABAAACAP2h4AACOAwAAjwMAAJADAACRAwAA/////w==");return j({"Int8Array":Int8Array,"Int16Array":Int16Array,"Int32Array":Int32Array,"Uint8Array":Uint8Array,"Uint16Array":Uint16Array,"Uint32Array":Uint32Array,"Float32Array":Float32Array,"Float64Array":Float64Array,"NaN":NaN,"Infinity":Infinity,"Math":Math},asmLibraryArg,wasmMemory.buffer);}// EMSCRIPTEN_END_ASM
(Aa,Ba,Ca)};}function Da(){return{then:function(a){a({instance:new ya()});}};}var Ea=Error,WebAssembly={};ua=[];"object"!==typeof WebAssembly&&ta("no native wasm support detected");var Ba,Ca=new function(a){var c=Array(a.initial);c.grow=function(){930<=c.length&&qa("Unable to grow wasm table. Use a higher value for RESERVED_FUNCTION_POINTERS or set ALLOW_TABLE_GROWTH.");c.push(null);};c.set=function(d,e){c[d]=e;};c.get=function(d){return c[d];};return c;}({initial:930,maximum:930,element:"anyfunc"}),Fa=!1;function assert(a,c){a||qa("Assertion failed: "+c);}var Ga="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0,Ha,Ia,Ja,Ka,La,Ma,wa=b.INITIAL_MEMORY||67108864;if(Ba=b.wasmMemory?b.wasmMemory:new va())Ha=Ba.buffer;wa=Ha.byteLength;var Na=Ha;Ha=Na;b.HEAP8=Ia=new Int8Array(Na);b.HEAP16=new Int16Array(Na);b.HEAP32=Ka=new Int32Array(Na);b.HEAPU8=Ja=new Uint8Array(Na);b.HEAPU16=new Uint16Array(Na);b.HEAPU32=new Uint32Array(Na);b.HEAPF32=La=new Float32Array(Na);b.HEAPF64=Ma=new Float64Array(Na);Ka[7848]=5274432;function Oa(a){for(;0<a.length;){var c=a.shift();if("function"==typeof c)c(b);else{var d=c.la;"number"===typeof d?void 0===c.N?b.dynCall_v(d):b.dynCall_vi(d,c.N):d(void 0===c.N?null:c.N);}}}var Pa=[],Qa=[],Ra=[],Sa=[],Ta=!1;function Ua(){var a=b.preRun.shift();Pa.unshift(a);}Math.imul&&-5===Math.imul(4294967295,5)||(Math.imul=function(a,c){var d=a&65535,e=c&65535;return d*e+((a>>>16)*e+d*(c>>>16)<<16)|0;});if(!Math.fround){var Va=new Float32Array(1);Math.fround=function(a){Va[0]=a;return Va[0];};}Math.clz32||(Math.clz32=function(a){var c=32,d=a>>16;d&&(c-=16,a=d);if(d=a>>8)c-=8,a=d;if(d=a>>4)c-=4,a=d;if(d=a>>2)c-=2,a=d;return a>>1?c-2:c-a;});Math.trunc||(Math.trunc=function(a){return 0>a?Math.ceil(a):Math.floor(a);});var Wa=0,Xa=null,Ya=null;b.preloadedImages={};b.preloadedAudios={};function qa(a){if(b.onAbort)b.onAbort(a);a+="";sa(a);ta(a);Fa=!0;throw new Ea("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");}function Za(a,c){return String.prototype.startsWith?a.startsWith(c):0===a.indexOf(c);}var $a="data:application/octet-stream;base64,",ab="";if(!Za(ab,$a)){var bb=ab;ab=b.locateFile?b.locateFile(bb,ja):ja+bb;}function cb(){try{if(ua)return new Uint8Array(ua);var a=pa(ab);if(a)return a;if(la)return la(ab);throw"both async and sync fetching of the wasm failed";}catch(c){qa(c);}}function db(){return ua||!ea&&!fa||"function"!==typeof fetch||Za(ab,"file://")?new Promise(function(a){a(cb());}):fetch(ab,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+ab+"'";return a.arrayBuffer();}).catch(function(){return cb();});}var eb={1960:function(a,c,d,e,g,n,D,Y){a=b.getCache(b.ConcreteContactResultCallback)[a];if(!a.hasOwnProperty("addSingleResult"))throw"a JSImplementation must implement all functions, you forgot ConcreteContactResultCallback::addSingleResult.";return a.addSingleResult(c,d,e,g,n,D,Y);},2520:function(a,c,d,e){a=b.getCache(b.DebugDrawer)[a];if(!a.hasOwnProperty("drawLine"))throw"a JSImplementation must implement all functions, you forgot DebugDrawer::drawLine.";a.drawLine(c,d,e);},2745:function(a,c,d,e,g,n){a=b.getCache(b.DebugDrawer)[a];if(!a.hasOwnProperty("drawContactPoint"))throw"a JSImplementation must implement all functions, you forgot DebugDrawer::drawContactPoint.";a.drawContactPoint(c,d,e,g,n);},3002:function(a,c){a=b.getCache(b.DebugDrawer)[a];if(!a.hasOwnProperty("reportErrorWarning"))throw"a JSImplementation must implement all functions, you forgot DebugDrawer::reportErrorWarning.";a.reportErrorWarning(c);},3249:function(a,c,d){a=b.getCache(b.DebugDrawer)[a];if(!a.hasOwnProperty("draw3dText"))throw"a JSImplementation must implement all functions, you forgot DebugDrawer::draw3dText.";a.draw3dText(c,d);},3476:function(a,c){a=b.getCache(b.DebugDrawer)[a];if(!a.hasOwnProperty("setDebugMode"))throw"a JSImplementation must implement all functions, you forgot DebugDrawer::setDebugMode.";a.setDebugMode(c);},3705:function(a){a=b.getCache(b.DebugDrawer)[a];if(!a.hasOwnProperty("getDebugMode"))throw"a JSImplementation must implement all functions, you forgot DebugDrawer::getDebugMode.";return a.getDebugMode();}};Qa.push({la:function(){fb();}});var gb=[];function hb(a,c){gb.length=0;var d;for(c>>=2;d=Ja[a++];)gb.push(105>d?Ma[++c>>1]:Ka[c]),++c;return gb;}var ib=!1;function ra(a){for(var c=[],d=0;d<a.length;d++){var e=a[d];255<e&&(ib&&assert(!1,"Character code "+e+" ("+String.fromCharCode(e)+")  at offset "+d+" not in 0x00-0xFF."),e&=255);c.push(String.fromCharCode(e));}return c.join("");}var jb="function"===typeof atob?atob:function(a){var c="",d=0;a=a.replace(/[^A-Za-z0-9\+\/=]/g,"");do{var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(d++));var g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(d++));var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(d++));var D="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(d++));e=e<<2|g>>4;g=(g&15)<<4|n>>2;var Y=(n&3)<<6|D;c+=String.fromCharCode(e);64!==n&&(c+=String.fromCharCode(g));64!==D&&(c+=String.fromCharCode(Y));}while(d<a.length);return c;};function pa(a){if(Za(a,$a)){a=a.slice($a.length);if("boolean"===typeof ha&&ha){try{var c=Buffer.from(a,"base64");}catch(n){c=new Buffer(a,"base64");}var d=new Uint8Array(c.buffer,c.byteOffset,c.byteLength);}else try{var e=jb(a),g=new Uint8Array(e.length);for(c=0;c<e.length;++c)g[c]=e.charCodeAt(c);d=g;}catch(n){throw Error("Converting base64 string to bytes failed.");}return d;}}var Aa={abort:function(){qa();},emscripten_asm_const_dii:function(a,c,d){c=hb(c,d);return eb[a].apply(null,c);},emscripten_asm_const_iii:function(a,c,d){c=hb(c,d);return eb[a].apply(null,c);},emscripten_memcpy_big:Uint8Array.prototype.copyWithin?function(a,c,d){Ja.copyWithin(a,c,c+d);}:function(a,c,d){Ja.set(Ja.subarray(c,c+d),a);},emscripten_resize_heap:function(){qa("OOM");},gettimeofday:function(a){var c=Date.now();Ka[a>>2]=c/1E3|0;Ka[a+4>>2]=c%1E3*1E3|0;return 0;},memory:Ba,table:Ca};(function(){function a(g){b.asm=g.exports;Wa--;b.monitorRunDependencies&&b.monitorRunDependencies(Wa);0==Wa&&(null!==Xa&&(clearInterval(Xa),Xa=null),Ya&&(g=Ya,Ya=null,g()));}function c(g){a(g.instance);}function d(g){return db().then(function(){return Da();}).then(g,function(n){ta("failed to asynchronously prepare wasm: "+n);qa(n);});}var e={env:Aa,wasi_snapshot_preview1:Aa};Wa++;b.monitorRunDependencies&&b.monitorRunDependencies(Wa);if(b.instantiateWasm)try{return b.instantiateWasm(e,a);}catch(g){return ta("Module.instantiateWasm callback failed with error: "+g),!1;}(function(){if(ua||"function"!==typeof WebAssembly.instantiateStreaming||Za(ab,$a)||Za(ab,"file://")||"function"!==typeof fetch)return d(c);fetch(ab,{credentials:"same-origin"}).then(function(g){return WebAssembly.instantiateStreaming(g,e).then(c,function(n){ta("wasm streaming compile failed: "+n);ta("falling back to ArrayBuffer instantiation");return d(c);});});})();return{};})();var fb=b.___wasm_call_ctors=function(){return(fb=b.___wasm_call_ctors=b.asm.__wasm_call_ctors).apply(null,arguments);};b.___em_js__array_bounds_check_error=function(){return(b.___em_js__array_bounds_check_error=b.asm.__em_js__array_bounds_check_error).apply(null,arguments);};var kb=b._emscripten_bind_btCollisionWorld_getDispatcher_0=function(){return(kb=b._emscripten_bind_btCollisionWorld_getDispatcher_0=b.asm.emscripten_bind_btCollisionWorld_getDispatcher_0).apply(null,arguments);},lb=b._emscripten_bind_btCollisionWorld_rayTest_3=function(){return(lb=b._emscripten_bind_btCollisionWorld_rayTest_3=b.asm.emscripten_bind_btCollisionWorld_rayTest_3).apply(null,arguments);},mb=b._emscripten_bind_btCollisionWorld_getPairCache_0=function(){return(mb=b._emscripten_bind_btCollisionWorld_getPairCache_0=b.asm.emscripten_bind_btCollisionWorld_getPairCache_0).apply(null,arguments);},nb=b._emscripten_bind_btCollisionWorld_getDispatchInfo_0=function(){return(nb=b._emscripten_bind_btCollisionWorld_getDispatchInfo_0=b.asm.emscripten_bind_btCollisionWorld_getDispatchInfo_0).apply(null,arguments);},ob=b._emscripten_bind_btCollisionWorld_addCollisionObject_1=function(){return(ob=b._emscripten_bind_btCollisionWorld_addCollisionObject_1=b.asm.emscripten_bind_btCollisionWorld_addCollisionObject_1).apply(null,arguments);},pb=b._emscripten_bind_btCollisionWorld_addCollisionObject_2=function(){return(pb=b._emscripten_bind_btCollisionWorld_addCollisionObject_2=b.asm.emscripten_bind_btCollisionWorld_addCollisionObject_2).apply(null,arguments);},qb=b._emscripten_bind_btCollisionWorld_addCollisionObject_3=function(){return(qb=b._emscripten_bind_btCollisionWorld_addCollisionObject_3=b.asm.emscripten_bind_btCollisionWorld_addCollisionObject_3).apply(null,arguments);},rb=b._emscripten_bind_btCollisionWorld_removeCollisionObject_1=function(){return(rb=b._emscripten_bind_btCollisionWorld_removeCollisionObject_1=b.asm.emscripten_bind_btCollisionWorld_removeCollisionObject_1).apply(null,arguments);},sb=b._emscripten_bind_btCollisionWorld_getBroadphase_0=function(){return(sb=b._emscripten_bind_btCollisionWorld_getBroadphase_0=b.asm.emscripten_bind_btCollisionWorld_getBroadphase_0).apply(null,arguments);},tb=b._emscripten_bind_btCollisionWorld_convexSweepTest_5=function(){return(tb=b._emscripten_bind_btCollisionWorld_convexSweepTest_5=b.asm.emscripten_bind_btCollisionWorld_convexSweepTest_5).apply(null,arguments);},vb=b._emscripten_bind_btCollisionWorld_contactPairTest_3=function(){return(vb=b._emscripten_bind_btCollisionWorld_contactPairTest_3=b.asm.emscripten_bind_btCollisionWorld_contactPairTest_3).apply(null,arguments);},wb=b._emscripten_bind_btCollisionWorld_contactTest_2=function(){return(wb=b._emscripten_bind_btCollisionWorld_contactTest_2=b.asm.emscripten_bind_btCollisionWorld_contactTest_2).apply(null,arguments);},xb=b._emscripten_bind_btCollisionWorld_updateSingleAabb_1=function(){return(xb=b._emscripten_bind_btCollisionWorld_updateSingleAabb_1=b.asm.emscripten_bind_btCollisionWorld_updateSingleAabb_1).apply(null,arguments);},yb=b._emscripten_bind_btCollisionWorld_setDebugDrawer_1=function(){return(yb=b._emscripten_bind_btCollisionWorld_setDebugDrawer_1=b.asm.emscripten_bind_btCollisionWorld_setDebugDrawer_1).apply(null,arguments);},zb=b._emscripten_bind_btCollisionWorld_getDebugDrawer_0=function(){return(zb=b._emscripten_bind_btCollisionWorld_getDebugDrawer_0=b.asm.emscripten_bind_btCollisionWorld_getDebugDrawer_0).apply(null,arguments);},Ab=b._emscripten_bind_btCollisionWorld_debugDrawWorld_0=function(){return(Ab=b._emscripten_bind_btCollisionWorld_debugDrawWorld_0=b.asm.emscripten_bind_btCollisionWorld_debugDrawWorld_0).apply(null,arguments);},Bb=b._emscripten_bind_btCollisionWorld_debugDrawObject_3=function(){return(Bb=b._emscripten_bind_btCollisionWorld_debugDrawObject_3=b.asm.emscripten_bind_btCollisionWorld_debugDrawObject_3).apply(null,arguments);},Cb=b._emscripten_bind_btCollisionWorld___destroy___0=function(){return(Cb=b._emscripten_bind_btCollisionWorld___destroy___0=b.asm.emscripten_bind_btCollisionWorld___destroy___0).apply(null,arguments);},Db=b._emscripten_bind_btCollisionShape_setLocalScaling_1=function(){return(Db=b._emscripten_bind_btCollisionShape_setLocalScaling_1=b.asm.emscripten_bind_btCollisionShape_setLocalScaling_1).apply(null,arguments);},Eb=b._emscripten_bind_btCollisionShape_getLocalScaling_0=function(){return(Eb=b._emscripten_bind_btCollisionShape_getLocalScaling_0=b.asm.emscripten_bind_btCollisionShape_getLocalScaling_0).apply(null,arguments);},Fb=b._emscripten_bind_btCollisionShape_calculateLocalInertia_2=function(){return(Fb=b._emscripten_bind_btCollisionShape_calculateLocalInertia_2=b.asm.emscripten_bind_btCollisionShape_calculateLocalInertia_2).apply(null,arguments);},Gb=b._emscripten_bind_btCollisionShape_setMargin_1=function(){return(Gb=b._emscripten_bind_btCollisionShape_setMargin_1=b.asm.emscripten_bind_btCollisionShape_setMargin_1).apply(null,arguments);},Hb=b._emscripten_bind_btCollisionShape_getMargin_0=function(){return(Hb=b._emscripten_bind_btCollisionShape_getMargin_0=b.asm.emscripten_bind_btCollisionShape_getMargin_0).apply(null,arguments);},Ib=b._emscripten_bind_btCollisionShape___destroy___0=function(){return(Ib=b._emscripten_bind_btCollisionShape___destroy___0=b.asm.emscripten_bind_btCollisionShape___destroy___0).apply(null,arguments);},Jb=b._emscripten_bind_btCollisionObject_setAnisotropicFriction_2=function(){return(Jb=b._emscripten_bind_btCollisionObject_setAnisotropicFriction_2=b.asm.emscripten_bind_btCollisionObject_setAnisotropicFriction_2).apply(null,arguments);},Kb=b._emscripten_bind_btCollisionObject_getCollisionShape_0=function(){return(Kb=b._emscripten_bind_btCollisionObject_getCollisionShape_0=b.asm.emscripten_bind_btCollisionObject_getCollisionShape_0).apply(null,arguments);},Lb=b._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1=function(){return(Lb=b._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1=b.asm.emscripten_bind_btCollisionObject_setContactProcessingThreshold_1).apply(null,arguments);},Mb=b._emscripten_bind_btCollisionObject_setActivationState_1=function(){return(Mb=b._emscripten_bind_btCollisionObject_setActivationState_1=b.asm.emscripten_bind_btCollisionObject_setActivationState_1).apply(null,arguments);},Nb=b._emscripten_bind_btCollisionObject_forceActivationState_1=function(){return(Nb=b._emscripten_bind_btCollisionObject_forceActivationState_1=b.asm.emscripten_bind_btCollisionObject_forceActivationState_1).apply(null,arguments);},Ob=b._emscripten_bind_btCollisionObject_activate_0=function(){return(Ob=b._emscripten_bind_btCollisionObject_activate_0=b.asm.emscripten_bind_btCollisionObject_activate_0).apply(null,arguments);},Pb=b._emscripten_bind_btCollisionObject_activate_1=function(){return(Pb=b._emscripten_bind_btCollisionObject_activate_1=b.asm.emscripten_bind_btCollisionObject_activate_1).apply(null,arguments);},Qb=b._emscripten_bind_btCollisionObject_isActive_0=function(){return(Qb=b._emscripten_bind_btCollisionObject_isActive_0=b.asm.emscripten_bind_btCollisionObject_isActive_0).apply(null,arguments);},Rb=b._emscripten_bind_btCollisionObject_isKinematicObject_0=function(){return(Rb=b._emscripten_bind_btCollisionObject_isKinematicObject_0=b.asm.emscripten_bind_btCollisionObject_isKinematicObject_0).apply(null,arguments);},Sb=b._emscripten_bind_btCollisionObject_isStaticObject_0=function(){return(Sb=b._emscripten_bind_btCollisionObject_isStaticObject_0=b.asm.emscripten_bind_btCollisionObject_isStaticObject_0).apply(null,arguments);},Tb=b._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0=function(){return(Tb=b._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0=b.asm.emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0).apply(null,arguments);},Vb=b._emscripten_bind_btCollisionObject_getRestitution_0=function(){return(Vb=b._emscripten_bind_btCollisionObject_getRestitution_0=b.asm.emscripten_bind_btCollisionObject_getRestitution_0).apply(null,arguments);},Wb=b._emscripten_bind_btCollisionObject_getFriction_0=function(){return(Wb=b._emscripten_bind_btCollisionObject_getFriction_0=b.asm.emscripten_bind_btCollisionObject_getFriction_0).apply(null,arguments);},Xb=b._emscripten_bind_btCollisionObject_getRollingFriction_0=function(){return(Xb=b._emscripten_bind_btCollisionObject_getRollingFriction_0=b.asm.emscripten_bind_btCollisionObject_getRollingFriction_0).apply(null,arguments);},Yb=b._emscripten_bind_btCollisionObject_setRestitution_1=function(){return(Yb=b._emscripten_bind_btCollisionObject_setRestitution_1=b.asm.emscripten_bind_btCollisionObject_setRestitution_1).apply(null,arguments);},Zb=b._emscripten_bind_btCollisionObject_setFriction_1=function(){return(Zb=b._emscripten_bind_btCollisionObject_setFriction_1=b.asm.emscripten_bind_btCollisionObject_setFriction_1).apply(null,arguments);},$b=b._emscripten_bind_btCollisionObject_setRollingFriction_1=function(){return($b=b._emscripten_bind_btCollisionObject_setRollingFriction_1=b.asm.emscripten_bind_btCollisionObject_setRollingFriction_1).apply(null,arguments);},ac=b._emscripten_bind_btCollisionObject_getWorldTransform_0=function(){return(ac=b._emscripten_bind_btCollisionObject_getWorldTransform_0=b.asm.emscripten_bind_btCollisionObject_getWorldTransform_0).apply(null,arguments);},bc=b._emscripten_bind_btCollisionObject_getCollisionFlags_0=function(){return(bc=b._emscripten_bind_btCollisionObject_getCollisionFlags_0=b.asm.emscripten_bind_btCollisionObject_getCollisionFlags_0).apply(null,arguments);},cc=b._emscripten_bind_btCollisionObject_setCollisionFlags_1=function(){return(cc=b._emscripten_bind_btCollisionObject_setCollisionFlags_1=b.asm.emscripten_bind_btCollisionObject_setCollisionFlags_1).apply(null,arguments);},ec=b._emscripten_bind_btCollisionObject_setWorldTransform_1=function(){return(ec=b._emscripten_bind_btCollisionObject_setWorldTransform_1=b.asm.emscripten_bind_btCollisionObject_setWorldTransform_1).apply(null,arguments);},fc=b._emscripten_bind_btCollisionObject_setCollisionShape_1=function(){return(fc=b._emscripten_bind_btCollisionObject_setCollisionShape_1=b.asm.emscripten_bind_btCollisionObject_setCollisionShape_1).apply(null,arguments);},hc=b._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1=function(){return(hc=b._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1=b.asm.emscripten_bind_btCollisionObject_setCcdMotionThreshold_1).apply(null,arguments);},ic=b._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1=function(){return(ic=b._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1=b.asm.emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1).apply(null,arguments);},jc=b._emscripten_bind_btCollisionObject_getUserIndex_0=function(){return(jc=b._emscripten_bind_btCollisionObject_getUserIndex_0=b.asm.emscripten_bind_btCollisionObject_getUserIndex_0).apply(null,arguments);},kc=b._emscripten_bind_btCollisionObject_setUserIndex_1=function(){return(kc=b._emscripten_bind_btCollisionObject_setUserIndex_1=b.asm.emscripten_bind_btCollisionObject_setUserIndex_1).apply(null,arguments);},lc=b._emscripten_bind_btCollisionObject_getUserPointer_0=function(){return(lc=b._emscripten_bind_btCollisionObject_getUserPointer_0=b.asm.emscripten_bind_btCollisionObject_getUserPointer_0).apply(null,arguments);},mc=b._emscripten_bind_btCollisionObject_setUserPointer_1=function(){return(mc=b._emscripten_bind_btCollisionObject_setUserPointer_1=b.asm.emscripten_bind_btCollisionObject_setUserPointer_1).apply(null,arguments);},nc=b._emscripten_bind_btCollisionObject_getBroadphaseHandle_0=function(){return(nc=b._emscripten_bind_btCollisionObject_getBroadphaseHandle_0=b.asm.emscripten_bind_btCollisionObject_getBroadphaseHandle_0).apply(null,arguments);},oc=b._emscripten_bind_btCollisionObject___destroy___0=function(){return(oc=b._emscripten_bind_btCollisionObject___destroy___0=b.asm.emscripten_bind_btCollisionObject___destroy___0).apply(null,arguments);},pc=b._emscripten_bind_btDynamicsWorld_addAction_1=function(){return(pc=b._emscripten_bind_btDynamicsWorld_addAction_1=b.asm.emscripten_bind_btDynamicsWorld_addAction_1).apply(null,arguments);},qc=b._emscripten_bind_btDynamicsWorld_removeAction_1=function(){return(qc=b._emscripten_bind_btDynamicsWorld_removeAction_1=b.asm.emscripten_bind_btDynamicsWorld_removeAction_1).apply(null,arguments);},sc=b._emscripten_bind_btDynamicsWorld_getSolverInfo_0=function(){return(sc=b._emscripten_bind_btDynamicsWorld_getSolverInfo_0=b.asm.emscripten_bind_btDynamicsWorld_getSolverInfo_0).apply(null,arguments);},tc=b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_1=function(){return(tc=b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_1=b.asm.emscripten_bind_btDynamicsWorld_setInternalTickCallback_1).apply(null,arguments);},uc=b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_2=function(){return(uc=b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_2=b.asm.emscripten_bind_btDynamicsWorld_setInternalTickCallback_2).apply(null,arguments);},vc=b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_3=function(){return(vc=b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_3=b.asm.emscripten_bind_btDynamicsWorld_setInternalTickCallback_3).apply(null,arguments);},wc=b._emscripten_bind_btDynamicsWorld_getDispatcher_0=function(){return(wc=b._emscripten_bind_btDynamicsWorld_getDispatcher_0=b.asm.emscripten_bind_btDynamicsWorld_getDispatcher_0).apply(null,arguments);},xc=b._emscripten_bind_btDynamicsWorld_rayTest_3=function(){return(xc=b._emscripten_bind_btDynamicsWorld_rayTest_3=b.asm.emscripten_bind_btDynamicsWorld_rayTest_3).apply(null,arguments);},yc=b._emscripten_bind_btDynamicsWorld_getPairCache_0=function(){return(yc=b._emscripten_bind_btDynamicsWorld_getPairCache_0=b.asm.emscripten_bind_btDynamicsWorld_getPairCache_0).apply(null,arguments);},zc=b._emscripten_bind_btDynamicsWorld_getDispatchInfo_0=function(){return(zc=b._emscripten_bind_btDynamicsWorld_getDispatchInfo_0=b.asm.emscripten_bind_btDynamicsWorld_getDispatchInfo_0).apply(null,arguments);},Ac=b._emscripten_bind_btDynamicsWorld_addCollisionObject_1=function(){return(Ac=b._emscripten_bind_btDynamicsWorld_addCollisionObject_1=b.asm.emscripten_bind_btDynamicsWorld_addCollisionObject_1).apply(null,arguments);},Bc=b._emscripten_bind_btDynamicsWorld_addCollisionObject_2=function(){return(Bc=b._emscripten_bind_btDynamicsWorld_addCollisionObject_2=b.asm.emscripten_bind_btDynamicsWorld_addCollisionObject_2).apply(null,arguments);},Ec=b._emscripten_bind_btDynamicsWorld_addCollisionObject_3=function(){return(Ec=b._emscripten_bind_btDynamicsWorld_addCollisionObject_3=b.asm.emscripten_bind_btDynamicsWorld_addCollisionObject_3).apply(null,arguments);},Fc=b._emscripten_bind_btDynamicsWorld_removeCollisionObject_1=function(){return(Fc=b._emscripten_bind_btDynamicsWorld_removeCollisionObject_1=b.asm.emscripten_bind_btDynamicsWorld_removeCollisionObject_1).apply(null,arguments);},Gc=b._emscripten_bind_btDynamicsWorld_getBroadphase_0=function(){return(Gc=b._emscripten_bind_btDynamicsWorld_getBroadphase_0=b.asm.emscripten_bind_btDynamicsWorld_getBroadphase_0).apply(null,arguments);},Hc=b._emscripten_bind_btDynamicsWorld_convexSweepTest_5=function(){return(Hc=b._emscripten_bind_btDynamicsWorld_convexSweepTest_5=b.asm.emscripten_bind_btDynamicsWorld_convexSweepTest_5).apply(null,arguments);},Ic=b._emscripten_bind_btDynamicsWorld_contactPairTest_3=function(){return(Ic=b._emscripten_bind_btDynamicsWorld_contactPairTest_3=b.asm.emscripten_bind_btDynamicsWorld_contactPairTest_3).apply(null,arguments);},Jc=b._emscripten_bind_btDynamicsWorld_contactTest_2=function(){return(Jc=b._emscripten_bind_btDynamicsWorld_contactTest_2=b.asm.emscripten_bind_btDynamicsWorld_contactTest_2).apply(null,arguments);},Kc=b._emscripten_bind_btDynamicsWorld_updateSingleAabb_1=function(){return(Kc=b._emscripten_bind_btDynamicsWorld_updateSingleAabb_1=b.asm.emscripten_bind_btDynamicsWorld_updateSingleAabb_1).apply(null,arguments);},Lc=b._emscripten_bind_btDynamicsWorld_setDebugDrawer_1=function(){return(Lc=b._emscripten_bind_btDynamicsWorld_setDebugDrawer_1=b.asm.emscripten_bind_btDynamicsWorld_setDebugDrawer_1).apply(null,arguments);},Mc=b._emscripten_bind_btDynamicsWorld_getDebugDrawer_0=function(){return(Mc=b._emscripten_bind_btDynamicsWorld_getDebugDrawer_0=b.asm.emscripten_bind_btDynamicsWorld_getDebugDrawer_0).apply(null,arguments);},Nc=b._emscripten_bind_btDynamicsWorld_debugDrawWorld_0=function(){return(Nc=b._emscripten_bind_btDynamicsWorld_debugDrawWorld_0=b.asm.emscripten_bind_btDynamicsWorld_debugDrawWorld_0).apply(null,arguments);},Oc=b._emscripten_bind_btDynamicsWorld_debugDrawObject_3=function(){return(Oc=b._emscripten_bind_btDynamicsWorld_debugDrawObject_3=b.asm.emscripten_bind_btDynamicsWorld_debugDrawObject_3).apply(null,arguments);},Pc=b._emscripten_bind_btDynamicsWorld___destroy___0=function(){return(Pc=b._emscripten_bind_btDynamicsWorld___destroy___0=b.asm.emscripten_bind_btDynamicsWorld___destroy___0).apply(null,arguments);},Qc=b._emscripten_bind_btTypedConstraint_enableFeedback_1=function(){return(Qc=b._emscripten_bind_btTypedConstraint_enableFeedback_1=b.asm.emscripten_bind_btTypedConstraint_enableFeedback_1).apply(null,arguments);},Rc=b._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0=function(){return(Rc=b._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0=b.asm.emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0).apply(null,arguments);},Sc=b._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1=function(){return(Sc=b._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1=b.asm.emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1).apply(null,arguments);},Tc=b._emscripten_bind_btTypedConstraint_getParam_2=function(){return(Tc=b._emscripten_bind_btTypedConstraint_getParam_2=b.asm.emscripten_bind_btTypedConstraint_getParam_2).apply(null,arguments);},Uc=b._emscripten_bind_btTypedConstraint_setParam_3=function(){return(Uc=b._emscripten_bind_btTypedConstraint_setParam_3=b.asm.emscripten_bind_btTypedConstraint_setParam_3).apply(null,arguments);},Vc=b._emscripten_bind_btTypedConstraint___destroy___0=function(){return(Vc=b._emscripten_bind_btTypedConstraint___destroy___0=b.asm.emscripten_bind_btTypedConstraint___destroy___0).apply(null,arguments);},Wc=b._emscripten_bind_btConcaveShape_setLocalScaling_1=function(){return(Wc=b._emscripten_bind_btConcaveShape_setLocalScaling_1=b.asm.emscripten_bind_btConcaveShape_setLocalScaling_1).apply(null,arguments);},Xc=b._emscripten_bind_btConcaveShape_getLocalScaling_0=function(){return(Xc=b._emscripten_bind_btConcaveShape_getLocalScaling_0=b.asm.emscripten_bind_btConcaveShape_getLocalScaling_0).apply(null,arguments);},Yc=b._emscripten_bind_btConcaveShape_calculateLocalInertia_2=function(){return(Yc=b._emscripten_bind_btConcaveShape_calculateLocalInertia_2=b.asm.emscripten_bind_btConcaveShape_calculateLocalInertia_2).apply(null,arguments);},Zc=b._emscripten_bind_btConcaveShape___destroy___0=function(){return(Zc=b._emscripten_bind_btConcaveShape___destroy___0=b.asm.emscripten_bind_btConcaveShape___destroy___0).apply(null,arguments);},$c=b._emscripten_bind_btCapsuleShape_btCapsuleShape_2=function(){return($c=b._emscripten_bind_btCapsuleShape_btCapsuleShape_2=b.asm.emscripten_bind_btCapsuleShape_btCapsuleShape_2).apply(null,arguments);},ad=b._emscripten_bind_btCapsuleShape_setMargin_1=function(){return(ad=b._emscripten_bind_btCapsuleShape_setMargin_1=b.asm.emscripten_bind_btCapsuleShape_setMargin_1).apply(null,arguments);},bd=b._emscripten_bind_btCapsuleShape_getMargin_0=function(){return(bd=b._emscripten_bind_btCapsuleShape_getMargin_0=b.asm.emscripten_bind_btCapsuleShape_getMargin_0).apply(null,arguments);},cd=b._emscripten_bind_btCapsuleShape_getUpAxis_0=function(){return(cd=b._emscripten_bind_btCapsuleShape_getUpAxis_0=b.asm.emscripten_bind_btCapsuleShape_getUpAxis_0).apply(null,arguments);},dd=b._emscripten_bind_btCapsuleShape_getRadius_0=function(){return(dd=b._emscripten_bind_btCapsuleShape_getRadius_0=b.asm.emscripten_bind_btCapsuleShape_getRadius_0).apply(null,arguments);},ed=b._emscripten_bind_btCapsuleShape_getHalfHeight_0=function(){return(ed=b._emscripten_bind_btCapsuleShape_getHalfHeight_0=b.asm.emscripten_bind_btCapsuleShape_getHalfHeight_0).apply(null,arguments);},fd=b._emscripten_bind_btCapsuleShape_setLocalScaling_1=function(){return(fd=b._emscripten_bind_btCapsuleShape_setLocalScaling_1=b.asm.emscripten_bind_btCapsuleShape_setLocalScaling_1).apply(null,arguments);},gd=b._emscripten_bind_btCapsuleShape_getLocalScaling_0=function(){return(gd=b._emscripten_bind_btCapsuleShape_getLocalScaling_0=b.asm.emscripten_bind_btCapsuleShape_getLocalScaling_0).apply(null,arguments);},hd=b._emscripten_bind_btCapsuleShape_calculateLocalInertia_2=function(){return(hd=b._emscripten_bind_btCapsuleShape_calculateLocalInertia_2=b.asm.emscripten_bind_btCapsuleShape_calculateLocalInertia_2).apply(null,arguments);},id=b._emscripten_bind_btCapsuleShape___destroy___0=function(){return(id=b._emscripten_bind_btCapsuleShape___destroy___0=b.asm.emscripten_bind_btCapsuleShape___destroy___0).apply(null,arguments);},jd=b._emscripten_bind_btIDebugDraw_drawLine_3=function(){return(jd=b._emscripten_bind_btIDebugDraw_drawLine_3=b.asm.emscripten_bind_btIDebugDraw_drawLine_3).apply(null,arguments);},kd=b._emscripten_bind_btIDebugDraw_drawContactPoint_5=function(){return(kd=b._emscripten_bind_btIDebugDraw_drawContactPoint_5=b.asm.emscripten_bind_btIDebugDraw_drawContactPoint_5).apply(null,arguments);},ld=b._emscripten_bind_btIDebugDraw_reportErrorWarning_1=function(){return(ld=b._emscripten_bind_btIDebugDraw_reportErrorWarning_1=b.asm.emscripten_bind_btIDebugDraw_reportErrorWarning_1).apply(null,arguments);},md=b._emscripten_bind_btIDebugDraw_draw3dText_2=function(){return(md=b._emscripten_bind_btIDebugDraw_draw3dText_2=b.asm.emscripten_bind_btIDebugDraw_draw3dText_2).apply(null,arguments);},nd=b._emscripten_bind_btIDebugDraw_setDebugMode_1=function(){return(nd=b._emscripten_bind_btIDebugDraw_setDebugMode_1=b.asm.emscripten_bind_btIDebugDraw_setDebugMode_1).apply(null,arguments);},od=b._emscripten_bind_btIDebugDraw_getDebugMode_0=function(){return(od=b._emscripten_bind_btIDebugDraw_getDebugMode_0=b.asm.emscripten_bind_btIDebugDraw_getDebugMode_0).apply(null,arguments);},pd=b._emscripten_bind_btIDebugDraw___destroy___0=function(){return(pd=b._emscripten_bind_btIDebugDraw___destroy___0=b.asm.emscripten_bind_btIDebugDraw___destroy___0).apply(null,arguments);},qd=b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0=function(){return(qd=b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0=b.asm.emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0).apply(null,arguments);},rd=b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1=function(){return(rd=b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1=b.asm.emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1).apply(null,arguments);},sd=b._emscripten_bind_btDefaultCollisionConfiguration___destroy___0=function(){return(sd=b._emscripten_bind_btDefaultCollisionConfiguration___destroy___0=b.asm.emscripten_bind_btDefaultCollisionConfiguration___destroy___0).apply(null,arguments);},td=b._emscripten_bind_btTriangleMeshShape_setLocalScaling_1=function(){return(td=b._emscripten_bind_btTriangleMeshShape_setLocalScaling_1=b.asm.emscripten_bind_btTriangleMeshShape_setLocalScaling_1).apply(null,arguments);},ud=b._emscripten_bind_btTriangleMeshShape_getLocalScaling_0=function(){return(ud=b._emscripten_bind_btTriangleMeshShape_getLocalScaling_0=b.asm.emscripten_bind_btTriangleMeshShape_getLocalScaling_0).apply(null,arguments);},vd=b._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2=function(){return(vd=b._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2=b.asm.emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2).apply(null,arguments);},wd=b._emscripten_bind_btTriangleMeshShape___destroy___0=function(){return(wd=b._emscripten_bind_btTriangleMeshShape___destroy___0=b.asm.emscripten_bind_btTriangleMeshShape___destroy___0).apply(null,arguments);},xd=b._emscripten_bind_btGhostObject_btGhostObject_0=function(){return(xd=b._emscripten_bind_btGhostObject_btGhostObject_0=b.asm.emscripten_bind_btGhostObject_btGhostObject_0).apply(null,arguments);},yd=b._emscripten_bind_btGhostObject_getNumOverlappingObjects_0=function(){return(yd=b._emscripten_bind_btGhostObject_getNumOverlappingObjects_0=b.asm.emscripten_bind_btGhostObject_getNumOverlappingObjects_0).apply(null,arguments);},zd=b._emscripten_bind_btGhostObject_getOverlappingObject_1=function(){return(zd=b._emscripten_bind_btGhostObject_getOverlappingObject_1=b.asm.emscripten_bind_btGhostObject_getOverlappingObject_1).apply(null,arguments);},Ad=b._emscripten_bind_btGhostObject_setAnisotropicFriction_2=function(){return(Ad=b._emscripten_bind_btGhostObject_setAnisotropicFriction_2=b.asm.emscripten_bind_btGhostObject_setAnisotropicFriction_2).apply(null,arguments);},Bd=b._emscripten_bind_btGhostObject_getCollisionShape_0=function(){return(Bd=b._emscripten_bind_btGhostObject_getCollisionShape_0=b.asm.emscripten_bind_btGhostObject_getCollisionShape_0).apply(null,arguments);},Cd=b._emscripten_bind_btGhostObject_setContactProcessingThreshold_1=function(){return(Cd=b._emscripten_bind_btGhostObject_setContactProcessingThreshold_1=b.asm.emscripten_bind_btGhostObject_setContactProcessingThreshold_1).apply(null,arguments);},Dd=b._emscripten_bind_btGhostObject_setActivationState_1=function(){return(Dd=b._emscripten_bind_btGhostObject_setActivationState_1=b.asm.emscripten_bind_btGhostObject_setActivationState_1).apply(null,arguments);},Ed=b._emscripten_bind_btGhostObject_forceActivationState_1=function(){return(Ed=b._emscripten_bind_btGhostObject_forceActivationState_1=b.asm.emscripten_bind_btGhostObject_forceActivationState_1).apply(null,arguments);},Fd=b._emscripten_bind_btGhostObject_activate_0=function(){return(Fd=b._emscripten_bind_btGhostObject_activate_0=b.asm.emscripten_bind_btGhostObject_activate_0).apply(null,arguments);},Gd=b._emscripten_bind_btGhostObject_activate_1=function(){return(Gd=b._emscripten_bind_btGhostObject_activate_1=b.asm.emscripten_bind_btGhostObject_activate_1).apply(null,arguments);},Hd=b._emscripten_bind_btGhostObject_isActive_0=function(){return(Hd=b._emscripten_bind_btGhostObject_isActive_0=b.asm.emscripten_bind_btGhostObject_isActive_0).apply(null,arguments);},Id=b._emscripten_bind_btGhostObject_isKinematicObject_0=function(){return(Id=b._emscripten_bind_btGhostObject_isKinematicObject_0=b.asm.emscripten_bind_btGhostObject_isKinematicObject_0).apply(null,arguments);},Jd=b._emscripten_bind_btGhostObject_isStaticObject_0=function(){return(Jd=b._emscripten_bind_btGhostObject_isStaticObject_0=b.asm.emscripten_bind_btGhostObject_isStaticObject_0).apply(null,arguments);},Kd=b._emscripten_bind_btGhostObject_isStaticOrKinematicObject_0=function(){return(Kd=b._emscripten_bind_btGhostObject_isStaticOrKinematicObject_0=b.asm.emscripten_bind_btGhostObject_isStaticOrKinematicObject_0).apply(null,arguments);},Ld=b._emscripten_bind_btGhostObject_getRestitution_0=function(){return(Ld=b._emscripten_bind_btGhostObject_getRestitution_0=b.asm.emscripten_bind_btGhostObject_getRestitution_0).apply(null,arguments);},Md=b._emscripten_bind_btGhostObject_getFriction_0=function(){return(Md=b._emscripten_bind_btGhostObject_getFriction_0=b.asm.emscripten_bind_btGhostObject_getFriction_0).apply(null,arguments);},Nd=b._emscripten_bind_btGhostObject_getRollingFriction_0=function(){return(Nd=b._emscripten_bind_btGhostObject_getRollingFriction_0=b.asm.emscripten_bind_btGhostObject_getRollingFriction_0).apply(null,arguments);},Od=b._emscripten_bind_btGhostObject_setRestitution_1=function(){return(Od=b._emscripten_bind_btGhostObject_setRestitution_1=b.asm.emscripten_bind_btGhostObject_setRestitution_1).apply(null,arguments);},Pd=b._emscripten_bind_btGhostObject_setFriction_1=function(){return(Pd=b._emscripten_bind_btGhostObject_setFriction_1=b.asm.emscripten_bind_btGhostObject_setFriction_1).apply(null,arguments);},Qd=b._emscripten_bind_btGhostObject_setRollingFriction_1=function(){return(Qd=b._emscripten_bind_btGhostObject_setRollingFriction_1=b.asm.emscripten_bind_btGhostObject_setRollingFriction_1).apply(null,arguments);},Rd=b._emscripten_bind_btGhostObject_getWorldTransform_0=function(){return(Rd=b._emscripten_bind_btGhostObject_getWorldTransform_0=b.asm.emscripten_bind_btGhostObject_getWorldTransform_0).apply(null,arguments);},Sd=b._emscripten_bind_btGhostObject_getCollisionFlags_0=function(){return(Sd=b._emscripten_bind_btGhostObject_getCollisionFlags_0=b.asm.emscripten_bind_btGhostObject_getCollisionFlags_0).apply(null,arguments);},Td=b._emscripten_bind_btGhostObject_setCollisionFlags_1=function(){return(Td=b._emscripten_bind_btGhostObject_setCollisionFlags_1=b.asm.emscripten_bind_btGhostObject_setCollisionFlags_1).apply(null,arguments);},Ud=b._emscripten_bind_btGhostObject_setWorldTransform_1=function(){return(Ud=b._emscripten_bind_btGhostObject_setWorldTransform_1=b.asm.emscripten_bind_btGhostObject_setWorldTransform_1).apply(null,arguments);},Vd=b._emscripten_bind_btGhostObject_setCollisionShape_1=function(){return(Vd=b._emscripten_bind_btGhostObject_setCollisionShape_1=b.asm.emscripten_bind_btGhostObject_setCollisionShape_1).apply(null,arguments);},Wd=b._emscripten_bind_btGhostObject_setCcdMotionThreshold_1=function(){return(Wd=b._emscripten_bind_btGhostObject_setCcdMotionThreshold_1=b.asm.emscripten_bind_btGhostObject_setCcdMotionThreshold_1).apply(null,arguments);},Xd=b._emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1=function(){return(Xd=b._emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1=b.asm.emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1).apply(null,arguments);},Yd=b._emscripten_bind_btGhostObject_getUserIndex_0=function(){return(Yd=b._emscripten_bind_btGhostObject_getUserIndex_0=b.asm.emscripten_bind_btGhostObject_getUserIndex_0).apply(null,arguments);},Zd=b._emscripten_bind_btGhostObject_setUserIndex_1=function(){return(Zd=b._emscripten_bind_btGhostObject_setUserIndex_1=b.asm.emscripten_bind_btGhostObject_setUserIndex_1).apply(null,arguments);},$d=b._emscripten_bind_btGhostObject_getUserPointer_0=function(){return($d=b._emscripten_bind_btGhostObject_getUserPointer_0=b.asm.emscripten_bind_btGhostObject_getUserPointer_0).apply(null,arguments);},ae=b._emscripten_bind_btGhostObject_setUserPointer_1=function(){return(ae=b._emscripten_bind_btGhostObject_setUserPointer_1=b.asm.emscripten_bind_btGhostObject_setUserPointer_1).apply(null,arguments);},be=b._emscripten_bind_btGhostObject_getBroadphaseHandle_0=function(){return(be=b._emscripten_bind_btGhostObject_getBroadphaseHandle_0=b.asm.emscripten_bind_btGhostObject_getBroadphaseHandle_0).apply(null,arguments);},ce=b._emscripten_bind_btGhostObject___destroy___0=function(){return(ce=b._emscripten_bind_btGhostObject___destroy___0=b.asm.emscripten_bind_btGhostObject___destroy___0).apply(null,arguments);},de=b._emscripten_bind_btConeShape_btConeShape_2=function(){return(de=b._emscripten_bind_btConeShape_btConeShape_2=b.asm.emscripten_bind_btConeShape_btConeShape_2).apply(null,arguments);},ee=b._emscripten_bind_btConeShape_setLocalScaling_1=function(){return(ee=b._emscripten_bind_btConeShape_setLocalScaling_1=b.asm.emscripten_bind_btConeShape_setLocalScaling_1).apply(null,arguments);},fe=b._emscripten_bind_btConeShape_getLocalScaling_0=function(){return(fe=b._emscripten_bind_btConeShape_getLocalScaling_0=b.asm.emscripten_bind_btConeShape_getLocalScaling_0).apply(null,arguments);},ge=b._emscripten_bind_btConeShape_calculateLocalInertia_2=function(){return(ge=b._emscripten_bind_btConeShape_calculateLocalInertia_2=b.asm.emscripten_bind_btConeShape_calculateLocalInertia_2).apply(null,arguments);},he=b._emscripten_bind_btConeShape___destroy___0=function(){return(he=b._emscripten_bind_btConeShape___destroy___0=b.asm.emscripten_bind_btConeShape___destroy___0).apply(null,arguments);},ie=b._emscripten_bind_btActionInterface_updateAction_2=function(){return(ie=b._emscripten_bind_btActionInterface_updateAction_2=b.asm.emscripten_bind_btActionInterface_updateAction_2).apply(null,arguments);},je=b._emscripten_bind_btActionInterface___destroy___0=function(){return(je=b._emscripten_bind_btActionInterface___destroy___0=b.asm.emscripten_bind_btActionInterface___destroy___0).apply(null,arguments);},ke=b._emscripten_bind_btVector3_btVector3_0=function(){return(ke=b._emscripten_bind_btVector3_btVector3_0=b.asm.emscripten_bind_btVector3_btVector3_0).apply(null,arguments);},le=b._emscripten_bind_btVector3_btVector3_3=function(){return(le=b._emscripten_bind_btVector3_btVector3_3=b.asm.emscripten_bind_btVector3_btVector3_3).apply(null,arguments);},me=b._emscripten_bind_btVector3_length_0=function(){return(me=b._emscripten_bind_btVector3_length_0=b.asm.emscripten_bind_btVector3_length_0).apply(null,arguments);},ne=b._emscripten_bind_btVector3_x_0=function(){return(ne=b._emscripten_bind_btVector3_x_0=b.asm.emscripten_bind_btVector3_x_0).apply(null,arguments);},oe=b._emscripten_bind_btVector3_y_0=function(){return(oe=b._emscripten_bind_btVector3_y_0=b.asm.emscripten_bind_btVector3_y_0).apply(null,arguments);},pe=b._emscripten_bind_btVector3_z_0=function(){return(pe=b._emscripten_bind_btVector3_z_0=b.asm.emscripten_bind_btVector3_z_0).apply(null,arguments);},qe=b._emscripten_bind_btVector3_setX_1=function(){return(qe=b._emscripten_bind_btVector3_setX_1=b.asm.emscripten_bind_btVector3_setX_1).apply(null,arguments);},re=b._emscripten_bind_btVector3_setY_1=function(){return(re=b._emscripten_bind_btVector3_setY_1=b.asm.emscripten_bind_btVector3_setY_1).apply(null,arguments);},se=b._emscripten_bind_btVector3_setZ_1=function(){return(se=b._emscripten_bind_btVector3_setZ_1=b.asm.emscripten_bind_btVector3_setZ_1).apply(null,arguments);},te=b._emscripten_bind_btVector3_setValue_3=function(){return(te=b._emscripten_bind_btVector3_setValue_3=b.asm.emscripten_bind_btVector3_setValue_3).apply(null,arguments);},ue=b._emscripten_bind_btVector3_normalize_0=function(){return(ue=b._emscripten_bind_btVector3_normalize_0=b.asm.emscripten_bind_btVector3_normalize_0).apply(null,arguments);},ve=b._emscripten_bind_btVector3_rotate_2=function(){return(ve=b._emscripten_bind_btVector3_rotate_2=b.asm.emscripten_bind_btVector3_rotate_2).apply(null,arguments);},we=b._emscripten_bind_btVector3_dot_1=function(){return(we=b._emscripten_bind_btVector3_dot_1=b.asm.emscripten_bind_btVector3_dot_1).apply(null,arguments);},xe=b._emscripten_bind_btVector3_op_mul_1=function(){return(xe=b._emscripten_bind_btVector3_op_mul_1=b.asm.emscripten_bind_btVector3_op_mul_1).apply(null,arguments);},ye=b._emscripten_bind_btVector3_op_add_1=function(){return(ye=b._emscripten_bind_btVector3_op_add_1=b.asm.emscripten_bind_btVector3_op_add_1).apply(null,arguments);},ze=b._emscripten_bind_btVector3_op_sub_1=function(){return(ze=b._emscripten_bind_btVector3_op_sub_1=b.asm.emscripten_bind_btVector3_op_sub_1).apply(null,arguments);},Ae=b._emscripten_bind_btVector3___destroy___0=function(){return(Ae=b._emscripten_bind_btVector3___destroy___0=b.asm.emscripten_bind_btVector3___destroy___0).apply(null,arguments);},Be=b._emscripten_bind_btVehicleRaycaster_castRay_3=function(){return(Be=b._emscripten_bind_btVehicleRaycaster_castRay_3=b.asm.emscripten_bind_btVehicleRaycaster_castRay_3).apply(null,arguments);},Ce=b._emscripten_bind_btVehicleRaycaster___destroy___0=function(){return(Ce=b._emscripten_bind_btVehicleRaycaster___destroy___0=b.asm.emscripten_bind_btVehicleRaycaster___destroy___0).apply(null,arguments);},De=b._emscripten_bind_btQuadWord_x_0=function(){return(De=b._emscripten_bind_btQuadWord_x_0=b.asm.emscripten_bind_btQuadWord_x_0).apply(null,arguments);},Ee=b._emscripten_bind_btQuadWord_y_0=function(){return(Ee=b._emscripten_bind_btQuadWord_y_0=b.asm.emscripten_bind_btQuadWord_y_0).apply(null,arguments);},Fe=b._emscripten_bind_btQuadWord_z_0=function(){return(Fe=b._emscripten_bind_btQuadWord_z_0=b.asm.emscripten_bind_btQuadWord_z_0).apply(null,arguments);},Ge=b._emscripten_bind_btQuadWord_w_0=function(){return(Ge=b._emscripten_bind_btQuadWord_w_0=b.asm.emscripten_bind_btQuadWord_w_0).apply(null,arguments);},He=b._emscripten_bind_btQuadWord_setX_1=function(){return(He=b._emscripten_bind_btQuadWord_setX_1=b.asm.emscripten_bind_btQuadWord_setX_1).apply(null,arguments);},Ie=b._emscripten_bind_btQuadWord_setY_1=function(){return(Ie=b._emscripten_bind_btQuadWord_setY_1=b.asm.emscripten_bind_btQuadWord_setY_1).apply(null,arguments);},Je=b._emscripten_bind_btQuadWord_setZ_1=function(){return(Je=b._emscripten_bind_btQuadWord_setZ_1=b.asm.emscripten_bind_btQuadWord_setZ_1).apply(null,arguments);},Ke=b._emscripten_bind_btQuadWord_setW_1=function(){return(Ke=b._emscripten_bind_btQuadWord_setW_1=b.asm.emscripten_bind_btQuadWord_setW_1).apply(null,arguments);},Le=b._emscripten_bind_btQuadWord___destroy___0=function(){return(Le=b._emscripten_bind_btQuadWord___destroy___0=b.asm.emscripten_bind_btQuadWord___destroy___0).apply(null,arguments);},Me=b._emscripten_bind_btCylinderShape_btCylinderShape_1=function(){return(Me=b._emscripten_bind_btCylinderShape_btCylinderShape_1=b.asm.emscripten_bind_btCylinderShape_btCylinderShape_1).apply(null,arguments);},Ne=b._emscripten_bind_btCylinderShape_setMargin_1=function(){return(Ne=b._emscripten_bind_btCylinderShape_setMargin_1=b.asm.emscripten_bind_btCylinderShape_setMargin_1).apply(null,arguments);},Oe=b._emscripten_bind_btCylinderShape_getMargin_0=function(){return(Oe=b._emscripten_bind_btCylinderShape_getMargin_0=b.asm.emscripten_bind_btCylinderShape_getMargin_0).apply(null,arguments);},Pe=b._emscripten_bind_btCylinderShape_setLocalScaling_1=function(){return(Pe=b._emscripten_bind_btCylinderShape_setLocalScaling_1=b.asm.emscripten_bind_btCylinderShape_setLocalScaling_1).apply(null,arguments);},Qe=b._emscripten_bind_btCylinderShape_getLocalScaling_0=function(){return(Qe=b._emscripten_bind_btCylinderShape_getLocalScaling_0=b.asm.emscripten_bind_btCylinderShape_getLocalScaling_0).apply(null,arguments);},Re=b._emscripten_bind_btCylinderShape_calculateLocalInertia_2=function(){return(Re=b._emscripten_bind_btCylinderShape_calculateLocalInertia_2=b.asm.emscripten_bind_btCylinderShape_calculateLocalInertia_2).apply(null,arguments);},Se=b._emscripten_bind_btCylinderShape___destroy___0=function(){return(Se=b._emscripten_bind_btCylinderShape___destroy___0=b.asm.emscripten_bind_btCylinderShape___destroy___0).apply(null,arguments);},Te=b._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4=function(){return(Te=b._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4=b.asm.emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4).apply(null,arguments);},Ue=b._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1=function(){return(Ue=b._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_setGravity_1).apply(null,arguments);},Ve=b._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0=function(){return(Ve=b._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0=b.asm.emscripten_bind_btDiscreteDynamicsWorld_getGravity_0).apply(null,arguments);},We=b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1=function(){return(We=b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1).apply(null,arguments);},Xe=b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3=function(){return(Xe=b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3=b.asm.emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3).apply(null,arguments);},Ye=b._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1=function(){return(Ye=b._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1).apply(null,arguments);},Ze=b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1=function(){return(Ze=b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1).apply(null,arguments);},$e=b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2=function(){return($e=b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2=b.asm.emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2).apply(null,arguments);},af=b._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1=function(){return(af=b._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1).apply(null,arguments);},bf=b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1=function(){return(bf=b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1).apply(null,arguments);},cf=b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2=function(){return(cf=b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2=b.asm.emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2).apply(null,arguments);},df=b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3=function(){return(df=b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3=b.asm.emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3).apply(null,arguments);},ef=b._emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1=function(){return(ef=b._emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1).apply(null,arguments);},ff=b._emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1=function(){return(ff=b._emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1).apply(null,arguments);},gf=b._emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1=function(){return(gf=b._emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1).apply(null,arguments);},hf=b._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0=function(){return(hf=b._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0=b.asm.emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0).apply(null,arguments);},jf=b._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3=function(){return(jf=b._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3=b.asm.emscripten_bind_btDiscreteDynamicsWorld_rayTest_3).apply(null,arguments);},kf=b._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0=function(){return(kf=b._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0=b.asm.emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0).apply(null,arguments);},lf=b._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0=function(){return(lf=b._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0=b.asm.emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0).apply(null,arguments);},mf=b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1=function(){return(mf=b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1).apply(null,arguments);},nf=b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2=function(){return(nf=b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2=b.asm.emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2).apply(null,arguments);},of=b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3=function(){return(of=b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3=b.asm.emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3).apply(null,arguments);},pf=b._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1=function(){return(pf=b._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1).apply(null,arguments);},qf=b._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0=function(){return(qf=b._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0=b.asm.emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0).apply(null,arguments);},rf=b._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5=function(){return(rf=b._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5=b.asm.emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5).apply(null,arguments);},sf=b._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3=function(){return(sf=b._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3=b.asm.emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3).apply(null,arguments);},tf=b._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2=function(){return(tf=b._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2=b.asm.emscripten_bind_btDiscreteDynamicsWorld_contactTest_2).apply(null,arguments);},uf=b._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1=function(){return(uf=b._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1).apply(null,arguments);},vf=b._emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1=function(){return(vf=b._emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1).apply(null,arguments);},wf=b._emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0=function(){return(wf=b._emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0=b.asm.emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0).apply(null,arguments);},xf=b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0=function(){return(xf=b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0=b.asm.emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0).apply(null,arguments);},yf=b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3=function(){return(yf=b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3=b.asm.emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3).apply(null,arguments);},zf=b._emscripten_bind_btDiscreteDynamicsWorld_addAction_1=function(){return(zf=b._emscripten_bind_btDiscreteDynamicsWorld_addAction_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_addAction_1).apply(null,arguments);},Af=b._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1=function(){return(Af=b._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_removeAction_1).apply(null,arguments);},Bf=b._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0=function(){return(Bf=b._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0=b.asm.emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0).apply(null,arguments);},Cf=b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1=function(){return(Cf=b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1=b.asm.emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1).apply(null,arguments);},Df=b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2=function(){return(Df=b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2=b.asm.emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2).apply(null,arguments);},Ef=b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3=function(){return(Ef=b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3=b.asm.emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3).apply(null,arguments);},Ff=b._emscripten_bind_btDiscreteDynamicsWorld___destroy___0=function(){return(Ff=b._emscripten_bind_btDiscreteDynamicsWorld___destroy___0=b.asm.emscripten_bind_btDiscreteDynamicsWorld___destroy___0).apply(null,arguments);},Gf=b._emscripten_bind_btConvexShape_setLocalScaling_1=function(){return(Gf=b._emscripten_bind_btConvexShape_setLocalScaling_1=b.asm.emscripten_bind_btConvexShape_setLocalScaling_1).apply(null,arguments);},Hf=b._emscripten_bind_btConvexShape_getLocalScaling_0=function(){return(Hf=b._emscripten_bind_btConvexShape_getLocalScaling_0=b.asm.emscripten_bind_btConvexShape_getLocalScaling_0).apply(null,arguments);},If=b._emscripten_bind_btConvexShape_calculateLocalInertia_2=function(){return(If=b._emscripten_bind_btConvexShape_calculateLocalInertia_2=b.asm.emscripten_bind_btConvexShape_calculateLocalInertia_2).apply(null,arguments);},Jf=b._emscripten_bind_btConvexShape_setMargin_1=function(){return(Jf=b._emscripten_bind_btConvexShape_setMargin_1=b.asm.emscripten_bind_btConvexShape_setMargin_1).apply(null,arguments);},Kf=b._emscripten_bind_btConvexShape_getMargin_0=function(){return(Kf=b._emscripten_bind_btConvexShape_getMargin_0=b.asm.emscripten_bind_btConvexShape_getMargin_0).apply(null,arguments);},Lf=b._emscripten_bind_btConvexShape___destroy___0=function(){return(Lf=b._emscripten_bind_btConvexShape___destroy___0=b.asm.emscripten_bind_btConvexShape___destroy___0).apply(null,arguments);},Mf=b._emscripten_bind_btDispatcher_getNumManifolds_0=function(){return(Mf=b._emscripten_bind_btDispatcher_getNumManifolds_0=b.asm.emscripten_bind_btDispatcher_getNumManifolds_0).apply(null,arguments);},Nf=b._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1=function(){return(Nf=b._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1=b.asm.emscripten_bind_btDispatcher_getManifoldByIndexInternal_1).apply(null,arguments);},Of=b._emscripten_bind_btDispatcher___destroy___0=function(){return(Of=b._emscripten_bind_btDispatcher___destroy___0=b.asm.emscripten_bind_btDispatcher___destroy___0).apply(null,arguments);},Pf=b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3=function(){return(Pf=b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3=b.asm.emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3).apply(null,arguments);},Qf=b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5=function(){return(Qf=b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5=b.asm.emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5).apply(null,arguments);},Rf=b._emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1=function(){return(Rf=b._emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1=b.asm.emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1).apply(null,arguments);},Sf=b._emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1=function(){return(Sf=b._emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1=b.asm.emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1).apply(null,arguments);},Tf=b._emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1=function(){return(Tf=b._emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1=b.asm.emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1).apply(null,arguments);},Uf=b._emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1=function(){return(Uf=b._emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1=b.asm.emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1).apply(null,arguments);},Vf=b._emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0=function(){return(Vf=b._emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0=b.asm.emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0).apply(null,arguments);},Wf=b._emscripten_bind_btGeneric6DofConstraint_enableFeedback_1=function(){return(Wf=b._emscripten_bind_btGeneric6DofConstraint_enableFeedback_1=b.asm.emscripten_bind_btGeneric6DofConstraint_enableFeedback_1).apply(null,arguments);},Xf=b._emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0=function(){return(Xf=b._emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0=b.asm.emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0).apply(null,arguments);},Yf=b._emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1=function(){return(Yf=b._emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1=b.asm.emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1).apply(null,arguments);},Zf=b._emscripten_bind_btGeneric6DofConstraint_getParam_2=function(){return(Zf=b._emscripten_bind_btGeneric6DofConstraint_getParam_2=b.asm.emscripten_bind_btGeneric6DofConstraint_getParam_2).apply(null,arguments);},$f=b._emscripten_bind_btGeneric6DofConstraint_setParam_3=function(){return($f=b._emscripten_bind_btGeneric6DofConstraint_setParam_3=b.asm.emscripten_bind_btGeneric6DofConstraint_setParam_3).apply(null,arguments);},ag=b._emscripten_bind_btGeneric6DofConstraint___destroy___0=function(){return(ag=b._emscripten_bind_btGeneric6DofConstraint___destroy___0=b.asm.emscripten_bind_btGeneric6DofConstraint___destroy___0).apply(null,arguments);},bg=b._emscripten_bind_btStridingMeshInterface_setScaling_1=function(){return(bg=b._emscripten_bind_btStridingMeshInterface_setScaling_1=b.asm.emscripten_bind_btStridingMeshInterface_setScaling_1).apply(null,arguments);},cg=b._emscripten_bind_btStridingMeshInterface___destroy___0=function(){return(cg=b._emscripten_bind_btStridingMeshInterface___destroy___0=b.asm.emscripten_bind_btStridingMeshInterface___destroy___0).apply(null,arguments);},dg=b._emscripten_bind_btMotionState_getWorldTransform_1=function(){return(dg=b._emscripten_bind_btMotionState_getWorldTransform_1=b.asm.emscripten_bind_btMotionState_getWorldTransform_1).apply(null,arguments);},eg=b._emscripten_bind_btMotionState_setWorldTransform_1=function(){return(eg=b._emscripten_bind_btMotionState_setWorldTransform_1=b.asm.emscripten_bind_btMotionState_setWorldTransform_1).apply(null,arguments);},fg=b._emscripten_bind_btMotionState___destroy___0=function(){return(fg=b._emscripten_bind_btMotionState___destroy___0=b.asm.emscripten_bind_btMotionState___destroy___0).apply(null,arguments);},gg=b._emscripten_bind_ConvexResultCallback_hasHit_0=function(){return(gg=b._emscripten_bind_ConvexResultCallback_hasHit_0=b.asm.emscripten_bind_ConvexResultCallback_hasHit_0).apply(null,arguments);},hg=b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0=function(){return(hg=b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0=b.asm.emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0).apply(null,arguments);},ig=b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1=function(){return(ig=b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1=b.asm.emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1).apply(null,arguments);},jg=b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0=function(){return(jg=b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0=b.asm.emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0).apply(null,arguments);},kg=b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1=function(){return(kg=b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1=b.asm.emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1).apply(null,arguments);},lg=b._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0=function(){return(lg=b._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0=b.asm.emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0).apply(null,arguments);},mg=b._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1=function(){return(mg=b._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1=b.asm.emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1).apply(null,arguments);},ng=b._emscripten_bind_ConvexResultCallback___destroy___0=function(){return(ng=b._emscripten_bind_ConvexResultCallback___destroy___0=b.asm.emscripten_bind_ConvexResultCallback___destroy___0).apply(null,arguments);},og=b._emscripten_bind_ContactResultCallback_addSingleResult_7=function(){return(og=b._emscripten_bind_ContactResultCallback_addSingleResult_7=b.asm.emscripten_bind_ContactResultCallback_addSingleResult_7).apply(null,arguments);},pg=b._emscripten_bind_ContactResultCallback___destroy___0=function(){return(pg=b._emscripten_bind_ContactResultCallback___destroy___0=b.asm.emscripten_bind_ContactResultCallback___destroy___0).apply(null,arguments);},qg=b._emscripten_bind_btSoftBodySolver___destroy___0=function(){return(qg=b._emscripten_bind_btSoftBodySolver___destroy___0=b.asm.emscripten_bind_btSoftBodySolver___destroy___0).apply(null,arguments);},rg=b._emscripten_bind_RayResultCallback_hasHit_0=function(){return(rg=b._emscripten_bind_RayResultCallback_hasHit_0=b.asm.emscripten_bind_RayResultCallback_hasHit_0).apply(null,arguments);},sg=b._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0=function(){return(sg=b._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0=b.asm.emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0).apply(null,arguments);},tg=b._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1=function(){return(tg=b._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1=b.asm.emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1).apply(null,arguments);},ug=b._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0=function(){return(ug=b._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0=b.asm.emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0).apply(null,arguments);},vg=b._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1=function(){return(vg=b._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1=b.asm.emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1).apply(null,arguments);},wg=b._emscripten_bind_RayResultCallback_get_m_closestHitFraction_0=function(){return(wg=b._emscripten_bind_RayResultCallback_get_m_closestHitFraction_0=b.asm.emscripten_bind_RayResultCallback_get_m_closestHitFraction_0).apply(null,arguments);},xg=b._emscripten_bind_RayResultCallback_set_m_closestHitFraction_1=function(){return(xg=b._emscripten_bind_RayResultCallback_set_m_closestHitFraction_1=b.asm.emscripten_bind_RayResultCallback_set_m_closestHitFraction_1).apply(null,arguments);},yg=b._emscripten_bind_RayResultCallback_get_m_collisionObject_0=function(){return(yg=b._emscripten_bind_RayResultCallback_get_m_collisionObject_0=b.asm.emscripten_bind_RayResultCallback_get_m_collisionObject_0).apply(null,arguments);},zg=b._emscripten_bind_RayResultCallback_set_m_collisionObject_1=function(){return(zg=b._emscripten_bind_RayResultCallback_set_m_collisionObject_1=b.asm.emscripten_bind_RayResultCallback_set_m_collisionObject_1).apply(null,arguments);},Ag=b._emscripten_bind_RayResultCallback___destroy___0=function(){return(Ag=b._emscripten_bind_RayResultCallback___destroy___0=b.asm.emscripten_bind_RayResultCallback___destroy___0).apply(null,arguments);},Bg=b._emscripten_bind_btMatrix3x3_setEulerZYX_3=function(){return(Bg=b._emscripten_bind_btMatrix3x3_setEulerZYX_3=b.asm.emscripten_bind_btMatrix3x3_setEulerZYX_3).apply(null,arguments);},Cg=b._emscripten_bind_btMatrix3x3_getRotation_1=function(){return(Cg=b._emscripten_bind_btMatrix3x3_getRotation_1=b.asm.emscripten_bind_btMatrix3x3_getRotation_1).apply(null,arguments);},Dg=b._emscripten_bind_btMatrix3x3_getRow_1=function(){return(Dg=b._emscripten_bind_btMatrix3x3_getRow_1=b.asm.emscripten_bind_btMatrix3x3_getRow_1).apply(null,arguments);},Eg=b._emscripten_bind_btMatrix3x3___destroy___0=function(){return(Eg=b._emscripten_bind_btMatrix3x3___destroy___0=b.asm.emscripten_bind_btMatrix3x3___destroy___0).apply(null,arguments);},Fg=b._emscripten_bind_btScalarArray_size_0=function(){return(Fg=b._emscripten_bind_btScalarArray_size_0=b.asm.emscripten_bind_btScalarArray_size_0).apply(null,arguments);},Gg=b._emscripten_bind_btScalarArray_at_1=function(){return(Gg=b._emscripten_bind_btScalarArray_at_1=b.asm.emscripten_bind_btScalarArray_at_1).apply(null,arguments);},Hg=b._emscripten_bind_btScalarArray___destroy___0=function(){return(Hg=b._emscripten_bind_btScalarArray___destroy___0=b.asm.emscripten_bind_btScalarArray___destroy___0).apply(null,arguments);},Ig=b._emscripten_bind_Material_get_m_kLST_0=function(){return(Ig=b._emscripten_bind_Material_get_m_kLST_0=b.asm.emscripten_bind_Material_get_m_kLST_0).apply(null,arguments);},Jg=b._emscripten_bind_Material_set_m_kLST_1=function(){return(Jg=b._emscripten_bind_Material_set_m_kLST_1=b.asm.emscripten_bind_Material_set_m_kLST_1).apply(null,arguments);},Kg=b._emscripten_bind_Material_get_m_kAST_0=function(){return(Kg=b._emscripten_bind_Material_get_m_kAST_0=b.asm.emscripten_bind_Material_get_m_kAST_0).apply(null,arguments);},Lg=b._emscripten_bind_Material_set_m_kAST_1=function(){return(Lg=b._emscripten_bind_Material_set_m_kAST_1=b.asm.emscripten_bind_Material_set_m_kAST_1).apply(null,arguments);},Mg=b._emscripten_bind_Material_get_m_kVST_0=function(){return(Mg=b._emscripten_bind_Material_get_m_kVST_0=b.asm.emscripten_bind_Material_get_m_kVST_0).apply(null,arguments);},Ng=b._emscripten_bind_Material_set_m_kVST_1=function(){return(Ng=b._emscripten_bind_Material_set_m_kVST_1=b.asm.emscripten_bind_Material_set_m_kVST_1).apply(null,arguments);},Og=b._emscripten_bind_Material_get_m_flags_0=function(){return(Og=b._emscripten_bind_Material_get_m_flags_0=b.asm.emscripten_bind_Material_get_m_flags_0).apply(null,arguments);},Pg=b._emscripten_bind_Material_set_m_flags_1=function(){return(Pg=b._emscripten_bind_Material_set_m_flags_1=b.asm.emscripten_bind_Material_set_m_flags_1).apply(null,arguments);},Qg=b._emscripten_bind_Material___destroy___0=function(){return(Qg=b._emscripten_bind_Material___destroy___0=b.asm.emscripten_bind_Material___destroy___0).apply(null,arguments);},Rg=b._emscripten_bind_btDispatcherInfo_get_m_timeStep_0=function(){return(Rg=b._emscripten_bind_btDispatcherInfo_get_m_timeStep_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_timeStep_0).apply(null,arguments);},Sg=b._emscripten_bind_btDispatcherInfo_set_m_timeStep_1=function(){return(Sg=b._emscripten_bind_btDispatcherInfo_set_m_timeStep_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_timeStep_1).apply(null,arguments);},Tg=b._emscripten_bind_btDispatcherInfo_get_m_stepCount_0=function(){return(Tg=b._emscripten_bind_btDispatcherInfo_get_m_stepCount_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_stepCount_0).apply(null,arguments);},Ug=b._emscripten_bind_btDispatcherInfo_set_m_stepCount_1=function(){return(Ug=b._emscripten_bind_btDispatcherInfo_set_m_stepCount_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_stepCount_1).apply(null,arguments);},Vg=b._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0=function(){return(Vg=b._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0).apply(null,arguments);},Wg=b._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1=function(){return(Wg=b._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1).apply(null,arguments);},Xg=b._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0=function(){return(Xg=b._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0).apply(null,arguments);},Yg=b._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1=function(){return(Yg=b._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1).apply(null,arguments);},Zg=b._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0=function(){return(Zg=b._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_useContinuous_0).apply(null,arguments);},$g=b._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1=function(){return($g=b._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_useContinuous_1).apply(null,arguments);},ah=b._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0=function(){return(ah=b._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0).apply(null,arguments);},bh=b._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1=function(){return(bh=b._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1).apply(null,arguments);},ch=b._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0=function(){return(ch=b._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_enableSPU_0).apply(null,arguments);},dh=b._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1=function(){return(dh=b._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_enableSPU_1).apply(null,arguments);},eh=b._emscripten_bind_btDispatcherInfo_get_m_useEpa_0=function(){return(eh=b._emscripten_bind_btDispatcherInfo_get_m_useEpa_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_useEpa_0).apply(null,arguments);},fh=b._emscripten_bind_btDispatcherInfo_set_m_useEpa_1=function(){return(fh=b._emscripten_bind_btDispatcherInfo_set_m_useEpa_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_useEpa_1).apply(null,arguments);},gh=b._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0=function(){return(gh=b._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0).apply(null,arguments);},hh=b._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1=function(){return(hh=b._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1).apply(null,arguments);},ih=b._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0=function(){return(ih=b._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0).apply(null,arguments);},jh=b._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1=function(){return(jh=b._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1).apply(null,arguments);},kh=b._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0=function(){return(kh=b._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0=b.asm.emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0).apply(null,arguments);},lh=b._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1=function(){return(lh=b._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1=b.asm.emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1).apply(null,arguments);},mh=b._emscripten_bind_btDispatcherInfo___destroy___0=function(){return(mh=b._emscripten_bind_btDispatcherInfo___destroy___0=b.asm.emscripten_bind_btDispatcherInfo___destroy___0).apply(null,arguments);},nh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0=function(){return(nh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0).apply(null,arguments);},oh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1=function(){return(oh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1).apply(null,arguments);},ph=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0=function(){return(ph=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0).apply(null,arguments);},qh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1=function(){return(qh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1).apply(null,arguments);},rh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0=function(){return(rh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0).apply(null,arguments);},sh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1=function(){return(sh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1).apply(null,arguments);},th=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0=function(){return(th=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0).apply(null,arguments);},uh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1=function(){return(uh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1).apply(null,arguments);},vh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0=function(){return(vh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0).apply(null,arguments);},wh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1=function(){return(wh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1).apply(null,arguments);},xh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0=function(){return(xh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0).apply(null,arguments);},yh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1=function(){return(yh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1).apply(null,arguments);},zh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0=function(){return(zh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0).apply(null,arguments);},Ah=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1=function(){return(Ah=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1).apply(null,arguments);},Bh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0=function(){return(Bh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0).apply(null,arguments);},Ch=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1=function(){return(Ch=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1).apply(null,arguments);},Dh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0=function(){return(Dh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0).apply(null,arguments);},Eh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1=function(){return(Eh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1).apply(null,arguments);},Fh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0=function(){return(Fh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0).apply(null,arguments);},Gh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1=function(){return(Gh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1).apply(null,arguments);},Hh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0=function(){return(Hh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0).apply(null,arguments);},Ih=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1=function(){return(Ih=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1).apply(null,arguments);},Jh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0=function(){return(Jh=b._emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0=b.asm.emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0).apply(null,arguments);},Kh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1=function(){return(Kh=b._emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1=b.asm.emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1).apply(null,arguments);},Lh=b._emscripten_bind_btWheelInfoConstructionInfo___destroy___0=function(){return(Lh=b._emscripten_bind_btWheelInfoConstructionInfo___destroy___0=b.asm.emscripten_bind_btWheelInfoConstructionInfo___destroy___0).apply(null,arguments);},Mh=b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1=function(){return(Mh=b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1=b.asm.emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1).apply(null,arguments);},Nh=b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2=function(){return(Nh=b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2=b.asm.emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2).apply(null,arguments);},Oh=b._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1=function(){return(Oh=b._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1=b.asm.emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1).apply(null,arguments);},Ph=b._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0=function(){return(Ph=b._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0=b.asm.emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0).apply(null,arguments);},Qh=b._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2=function(){return(Qh=b._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2=b.asm.emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2).apply(null,arguments);},Rh=b._emscripten_bind_btConvexTriangleMeshShape_setMargin_1=function(){return(Rh=b._emscripten_bind_btConvexTriangleMeshShape_setMargin_1=b.asm.emscripten_bind_btConvexTriangleMeshShape_setMargin_1).apply(null,arguments);},Sh=b._emscripten_bind_btConvexTriangleMeshShape_getMargin_0=function(){return(Sh=b._emscripten_bind_btConvexTriangleMeshShape_getMargin_0=b.asm.emscripten_bind_btConvexTriangleMeshShape_getMargin_0).apply(null,arguments);},Th=b._emscripten_bind_btConvexTriangleMeshShape___destroy___0=function(){return(Th=b._emscripten_bind_btConvexTriangleMeshShape___destroy___0=b.asm.emscripten_bind_btConvexTriangleMeshShape___destroy___0).apply(null,arguments);},Uh=b._emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0=function(){return(Uh=b._emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0=b.asm.emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0).apply(null,arguments);},Vh=b._emscripten_bind_btBroadphaseInterface___destroy___0=function(){return(Vh=b._emscripten_bind_btBroadphaseInterface___destroy___0=b.asm.emscripten_bind_btBroadphaseInterface___destroy___0).apply(null,arguments);},Wh=b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3=function(){return(Wh=b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3=b.asm.emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3).apply(null,arguments);},Xh=b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4=function(){return(Xh=b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4=b.asm.emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4).apply(null,arguments);},Yh=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0=function(){return(Yh=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0).apply(null,arguments);},Zh=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1=function(){return(Zh=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1).apply(null,arguments);},$h=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0=function(){return($h=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0).apply(null,arguments);},ai=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1=function(){return(ai=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1).apply(null,arguments);},bi=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0=function(){return(bi=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0).apply(null,arguments);},ci=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1=function(){return(ci=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1).apply(null,arguments);},di=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0=function(){return(di=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0).apply(null,arguments);},ei=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1=function(){return(ei=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1).apply(null,arguments);},fi=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0=function(){return(fi=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0).apply(null,arguments);},gi=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1=function(){return(gi=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1).apply(null,arguments);},hi=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0=function(){return(hi=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0).apply(null,arguments);},ii=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1=function(){return(ii=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1).apply(null,arguments);},ji=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0=function(){return(ji=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0).apply(null,arguments);},ki=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1=function(){return(ki=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1).apply(null,arguments);},li=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0=function(){return(li=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0).apply(null,arguments);},mi=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1=function(){return(mi=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1).apply(null,arguments);},ni=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0=function(){return(ni=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0).apply(null,arguments);},oi=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1=function(){return(oi=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1).apply(null,arguments);},pi=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0=function(){return(pi=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0).apply(null,arguments);},qi=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1=function(){return(qi=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1).apply(null,arguments);},ri=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0=function(){return(ri=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0).apply(null,arguments);},si=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1=function(){return(si=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1).apply(null,arguments);},ti=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0=function(){return(ti=b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0=b.asm.emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0).apply(null,arguments);},ui=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1=function(){return(ui=b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1=b.asm.emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1).apply(null,arguments);},vi=b._emscripten_bind_btRigidBodyConstructionInfo___destroy___0=function(){return(vi=b._emscripten_bind_btRigidBodyConstructionInfo___destroy___0=b.asm.emscripten_bind_btRigidBodyConstructionInfo___destroy___0).apply(null,arguments);},wi=b._emscripten_bind_btCollisionConfiguration___destroy___0=function(){return(wi=b._emscripten_bind_btCollisionConfiguration___destroy___0=b.asm.emscripten_bind_btCollisionConfiguration___destroy___0).apply(null,arguments);},xi=b._emscripten_bind_btPersistentManifold_btPersistentManifold_0=function(){return(xi=b._emscripten_bind_btPersistentManifold_btPersistentManifold_0=b.asm.emscripten_bind_btPersistentManifold_btPersistentManifold_0).apply(null,arguments);},yi=b._emscripten_bind_btPersistentManifold_getBody0_0=function(){return(yi=b._emscripten_bind_btPersistentManifold_getBody0_0=b.asm.emscripten_bind_btPersistentManifold_getBody0_0).apply(null,arguments);},zi=b._emscripten_bind_btPersistentManifold_getBody1_0=function(){return(zi=b._emscripten_bind_btPersistentManifold_getBody1_0=b.asm.emscripten_bind_btPersistentManifold_getBody1_0).apply(null,arguments);},Ai=b._emscripten_bind_btPersistentManifold_getNumContacts_0=function(){return(Ai=b._emscripten_bind_btPersistentManifold_getNumContacts_0=b.asm.emscripten_bind_btPersistentManifold_getNumContacts_0).apply(null,arguments);},Bi=b._emscripten_bind_btPersistentManifold_getContactPoint_1=function(){return(Bi=b._emscripten_bind_btPersistentManifold_getContactPoint_1=b.asm.emscripten_bind_btPersistentManifold_getContactPoint_1).apply(null,arguments);},Ci=b._emscripten_bind_btPersistentManifold___destroy___0=function(){return(Ci=b._emscripten_bind_btPersistentManifold___destroy___0=b.asm.emscripten_bind_btPersistentManifold___destroy___0).apply(null,arguments);},Di=b._emscripten_bind_btCompoundShape_btCompoundShape_0=function(){return(Di=b._emscripten_bind_btCompoundShape_btCompoundShape_0=b.asm.emscripten_bind_btCompoundShape_btCompoundShape_0).apply(null,arguments);},Ei=b._emscripten_bind_btCompoundShape_btCompoundShape_1=function(){return(Ei=b._emscripten_bind_btCompoundShape_btCompoundShape_1=b.asm.emscripten_bind_btCompoundShape_btCompoundShape_1).apply(null,arguments);},Fi=b._emscripten_bind_btCompoundShape_addChildShape_2=function(){return(Fi=b._emscripten_bind_btCompoundShape_addChildShape_2=b.asm.emscripten_bind_btCompoundShape_addChildShape_2).apply(null,arguments);},Gi=b._emscripten_bind_btCompoundShape_removeChildShape_1=function(){return(Gi=b._emscripten_bind_btCompoundShape_removeChildShape_1=b.asm.emscripten_bind_btCompoundShape_removeChildShape_1).apply(null,arguments);},Hi=b._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1=function(){return(Hi=b._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1=b.asm.emscripten_bind_btCompoundShape_removeChildShapeByIndex_1).apply(null,arguments);},Ii=b._emscripten_bind_btCompoundShape_getNumChildShapes_0=function(){return(Ii=b._emscripten_bind_btCompoundShape_getNumChildShapes_0=b.asm.emscripten_bind_btCompoundShape_getNumChildShapes_0).apply(null,arguments);},Ji=b._emscripten_bind_btCompoundShape_getChildShape_1=function(){return(Ji=b._emscripten_bind_btCompoundShape_getChildShape_1=b.asm.emscripten_bind_btCompoundShape_getChildShape_1).apply(null,arguments);},Ki=b._emscripten_bind_btCompoundShape_updateChildTransform_2=function(){return(Ki=b._emscripten_bind_btCompoundShape_updateChildTransform_2=b.asm.emscripten_bind_btCompoundShape_updateChildTransform_2).apply(null,arguments);},Li=b._emscripten_bind_btCompoundShape_updateChildTransform_3=function(){return(Li=b._emscripten_bind_btCompoundShape_updateChildTransform_3=b.asm.emscripten_bind_btCompoundShape_updateChildTransform_3).apply(null,arguments);},Mi=b._emscripten_bind_btCompoundShape_setMargin_1=function(){return(Mi=b._emscripten_bind_btCompoundShape_setMargin_1=b.asm.emscripten_bind_btCompoundShape_setMargin_1).apply(null,arguments);},Ni=b._emscripten_bind_btCompoundShape_getMargin_0=function(){return(Ni=b._emscripten_bind_btCompoundShape_getMargin_0=b.asm.emscripten_bind_btCompoundShape_getMargin_0).apply(null,arguments);},Oi=b._emscripten_bind_btCompoundShape_setLocalScaling_1=function(){return(Oi=b._emscripten_bind_btCompoundShape_setLocalScaling_1=b.asm.emscripten_bind_btCompoundShape_setLocalScaling_1).apply(null,arguments);},Pi=b._emscripten_bind_btCompoundShape_getLocalScaling_0=function(){return(Pi=b._emscripten_bind_btCompoundShape_getLocalScaling_0=b.asm.emscripten_bind_btCompoundShape_getLocalScaling_0).apply(null,arguments);},Qi=b._emscripten_bind_btCompoundShape_calculateLocalInertia_2=function(){return(Qi=b._emscripten_bind_btCompoundShape_calculateLocalInertia_2=b.asm.emscripten_bind_btCompoundShape_calculateLocalInertia_2).apply(null,arguments);},Ri=b._emscripten_bind_btCompoundShape___destroy___0=function(){return(Ri=b._emscripten_bind_btCompoundShape___destroy___0=b.asm.emscripten_bind_btCompoundShape___destroy___0).apply(null,arguments);},Si=b._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2=function(){return(Si=b._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2=b.asm.emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2).apply(null,arguments);},Ti=b._emscripten_bind_ClosestConvexResultCallback_hasHit_0=function(){return(Ti=b._emscripten_bind_ClosestConvexResultCallback_hasHit_0=b.asm.emscripten_bind_ClosestConvexResultCallback_hasHit_0).apply(null,arguments);},Ui=b._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0=function(){return(Ui=b._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0=b.asm.emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0).apply(null,arguments);},Vi=b._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1=function(){return(Vi=b._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1=b.asm.emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1).apply(null,arguments);},Wi=b._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0=function(){return(Wi=b._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0=b.asm.emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0).apply(null,arguments);},Xi=b._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1=function(){return(Xi=b._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1=b.asm.emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1).apply(null,arguments);},Yi=b._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0=function(){return(Yi=b._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0=b.asm.emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0).apply(null,arguments);},Zi=b._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1=function(){return(Zi=b._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1=b.asm.emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1).apply(null,arguments);},$i=b._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0=function(){return($i=b._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0=b.asm.emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0).apply(null,arguments);},aj=b._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1=function(){return(aj=b._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1=b.asm.emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1).apply(null,arguments);},bj=b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0=function(){return(bj=b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0=b.asm.emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0).apply(null,arguments);},cj=b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1=function(){return(cj=b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1=b.asm.emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1).apply(null,arguments);},dj=b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0=function(){return(dj=b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0=b.asm.emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0).apply(null,arguments);},ej=b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1=function(){return(ej=b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1=b.asm.emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1).apply(null,arguments);},fj=b._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0=function(){return(fj=b._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0=b.asm.emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0).apply(null,arguments);},gj=b._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1=function(){return(gj=b._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1=b.asm.emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1).apply(null,arguments);},hj=b._emscripten_bind_ClosestConvexResultCallback___destroy___0=function(){return(hj=b._emscripten_bind_ClosestConvexResultCallback___destroy___0=b.asm.emscripten_bind_ClosestConvexResultCallback___destroy___0).apply(null,arguments);},ij=b._emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2=function(){return(ij=b._emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2=b.asm.emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2).apply(null,arguments);},jj=b._emscripten_bind_AllHitsRayResultCallback_hasHit_0=function(){return(jj=b._emscripten_bind_AllHitsRayResultCallback_hasHit_0=b.asm.emscripten_bind_AllHitsRayResultCallback_hasHit_0).apply(null,arguments);},kj=b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0=function(){return(kj=b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0).apply(null,arguments);},lj=b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1=function(){return(lj=b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1).apply(null,arguments);},mj=b._emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0=function(){return(mj=b._emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0).apply(null,arguments);},nj=b._emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1=function(){return(nj=b._emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1).apply(null,arguments);},oj=b._emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0=function(){return(oj=b._emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0).apply(null,arguments);},pj=b._emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1=function(){return(pj=b._emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1).apply(null,arguments);},qj=b._emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0=function(){return(qj=b._emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0).apply(null,arguments);},rj=b._emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1=function(){return(rj=b._emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1).apply(null,arguments);},sj=b._emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0=function(){return(sj=b._emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0).apply(null,arguments);},tj=b._emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1=function(){return(tj=b._emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1).apply(null,arguments);},uj=b._emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0=function(){return(uj=b._emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0).apply(null,arguments);},vj=b._emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1=function(){return(vj=b._emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1).apply(null,arguments);},wj=b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0=function(){return(wj=b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0).apply(null,arguments);},xj=b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1=function(){return(xj=b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1).apply(null,arguments);},yj=b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0=function(){return(yj=b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0).apply(null,arguments);},zj=b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1=function(){return(zj=b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1).apply(null,arguments);},Aj=b._emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0=function(){return(Aj=b._emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0).apply(null,arguments);},Bj=b._emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1=function(){return(Bj=b._emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1).apply(null,arguments);},Cj=b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0=function(){return(Cj=b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0=b.asm.emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0).apply(null,arguments);},Dj=b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1=function(){return(Dj=b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1=b.asm.emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1).apply(null,arguments);},Ej=b._emscripten_bind_AllHitsRayResultCallback___destroy___0=function(){return(Ej=b._emscripten_bind_AllHitsRayResultCallback___destroy___0=b.asm.emscripten_bind_AllHitsRayResultCallback___destroy___0).apply(null,arguments);},Fj=b._emscripten_bind_tMaterialArray_size_0=function(){return(Fj=b._emscripten_bind_tMaterialArray_size_0=b.asm.emscripten_bind_tMaterialArray_size_0).apply(null,arguments);},Gj=b._emscripten_bind_tMaterialArray_at_1=function(){return(Gj=b._emscripten_bind_tMaterialArray_at_1=b.asm.emscripten_bind_tMaterialArray_at_1).apply(null,arguments);},Hj=b._emscripten_bind_tMaterialArray___destroy___0=function(){return(Hj=b._emscripten_bind_tMaterialArray___destroy___0=b.asm.emscripten_bind_tMaterialArray___destroy___0).apply(null,arguments);},Ij=b._emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1=function(){return(Ij=b._emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1=b.asm.emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1).apply(null,arguments);},Jj=b._emscripten_bind_btDefaultVehicleRaycaster_castRay_3=function(){return(Jj=b._emscripten_bind_btDefaultVehicleRaycaster_castRay_3=b.asm.emscripten_bind_btDefaultVehicleRaycaster_castRay_3).apply(null,arguments);},Kj=b._emscripten_bind_btDefaultVehicleRaycaster___destroy___0=function(){return(Kj=b._emscripten_bind_btDefaultVehicleRaycaster___destroy___0=b.asm.emscripten_bind_btDefaultVehicleRaycaster___destroy___0).apply(null,arguments);},Lj=b._emscripten_bind_btEmptyShape_btEmptyShape_0=function(){return(Lj=b._emscripten_bind_btEmptyShape_btEmptyShape_0=b.asm.emscripten_bind_btEmptyShape_btEmptyShape_0).apply(null,arguments);},Mj=b._emscripten_bind_btEmptyShape_setLocalScaling_1=function(){return(Mj=b._emscripten_bind_btEmptyShape_setLocalScaling_1=b.asm.emscripten_bind_btEmptyShape_setLocalScaling_1).apply(null,arguments);},Nj=b._emscripten_bind_btEmptyShape_getLocalScaling_0=function(){return(Nj=b._emscripten_bind_btEmptyShape_getLocalScaling_0=b.asm.emscripten_bind_btEmptyShape_getLocalScaling_0).apply(null,arguments);},Oj=b._emscripten_bind_btEmptyShape_calculateLocalInertia_2=function(){return(Oj=b._emscripten_bind_btEmptyShape_calculateLocalInertia_2=b.asm.emscripten_bind_btEmptyShape_calculateLocalInertia_2).apply(null,arguments);},Pj=b._emscripten_bind_btEmptyShape___destroy___0=function(){return(Pj=b._emscripten_bind_btEmptyShape___destroy___0=b.asm.emscripten_bind_btEmptyShape___destroy___0).apply(null,arguments);},Qj=b._emscripten_bind_btConstraintSetting_btConstraintSetting_0=function(){return(Qj=b._emscripten_bind_btConstraintSetting_btConstraintSetting_0=b.asm.emscripten_bind_btConstraintSetting_btConstraintSetting_0).apply(null,arguments);},Rj=b._emscripten_bind_btConstraintSetting_get_m_tau_0=function(){return(Rj=b._emscripten_bind_btConstraintSetting_get_m_tau_0=b.asm.emscripten_bind_btConstraintSetting_get_m_tau_0).apply(null,arguments);},Sj=b._emscripten_bind_btConstraintSetting_set_m_tau_1=function(){return(Sj=b._emscripten_bind_btConstraintSetting_set_m_tau_1=b.asm.emscripten_bind_btConstraintSetting_set_m_tau_1).apply(null,arguments);},Tj=b._emscripten_bind_btConstraintSetting_get_m_damping_0=function(){return(Tj=b._emscripten_bind_btConstraintSetting_get_m_damping_0=b.asm.emscripten_bind_btConstraintSetting_get_m_damping_0).apply(null,arguments);},Uj=b._emscripten_bind_btConstraintSetting_set_m_damping_1=function(){return(Uj=b._emscripten_bind_btConstraintSetting_set_m_damping_1=b.asm.emscripten_bind_btConstraintSetting_set_m_damping_1).apply(null,arguments);},Vj=b._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0=function(){return(Vj=b._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0=b.asm.emscripten_bind_btConstraintSetting_get_m_impulseClamp_0).apply(null,arguments);},Wj=b._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1=function(){return(Wj=b._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1=b.asm.emscripten_bind_btConstraintSetting_set_m_impulseClamp_1).apply(null,arguments);},Xj=b._emscripten_bind_btConstraintSetting___destroy___0=function(){return(Xj=b._emscripten_bind_btConstraintSetting___destroy___0=b.asm.emscripten_bind_btConstraintSetting___destroy___0).apply(null,arguments);},Yj=b._emscripten_bind_LocalShapeInfo_get_m_shapePart_0=function(){return(Yj=b._emscripten_bind_LocalShapeInfo_get_m_shapePart_0=b.asm.emscripten_bind_LocalShapeInfo_get_m_shapePart_0).apply(null,arguments);},Zj=b._emscripten_bind_LocalShapeInfo_set_m_shapePart_1=function(){return(Zj=b._emscripten_bind_LocalShapeInfo_set_m_shapePart_1=b.asm.emscripten_bind_LocalShapeInfo_set_m_shapePart_1).apply(null,arguments);},ak=b._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0=function(){return(ak=b._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0=b.asm.emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0).apply(null,arguments);},bk=b._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1=function(){return(bk=b._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1=b.asm.emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1).apply(null,arguments);},ck=b._emscripten_bind_LocalShapeInfo___destroy___0=function(){return(ck=b._emscripten_bind_LocalShapeInfo___destroy___0=b.asm.emscripten_bind_LocalShapeInfo___destroy___0).apply(null,arguments);},dk=b._emscripten_bind_btRigidBody_btRigidBody_1=function(){return(dk=b._emscripten_bind_btRigidBody_btRigidBody_1=b.asm.emscripten_bind_btRigidBody_btRigidBody_1).apply(null,arguments);},ek=b._emscripten_bind_btRigidBody_getCenterOfMassTransform_0=function(){return(ek=b._emscripten_bind_btRigidBody_getCenterOfMassTransform_0=b.asm.emscripten_bind_btRigidBody_getCenterOfMassTransform_0).apply(null,arguments);},fk=b._emscripten_bind_btRigidBody_setCenterOfMassTransform_1=function(){return(fk=b._emscripten_bind_btRigidBody_setCenterOfMassTransform_1=b.asm.emscripten_bind_btRigidBody_setCenterOfMassTransform_1).apply(null,arguments);},gk=b._emscripten_bind_btRigidBody_setSleepingThresholds_2=function(){return(gk=b._emscripten_bind_btRigidBody_setSleepingThresholds_2=b.asm.emscripten_bind_btRigidBody_setSleepingThresholds_2).apply(null,arguments);},hk=b._emscripten_bind_btRigidBody_getLinearDamping_0=function(){return(hk=b._emscripten_bind_btRigidBody_getLinearDamping_0=b.asm.emscripten_bind_btRigidBody_getLinearDamping_0).apply(null,arguments);},ik=b._emscripten_bind_btRigidBody_getAngularDamping_0=function(){return(ik=b._emscripten_bind_btRigidBody_getAngularDamping_0=b.asm.emscripten_bind_btRigidBody_getAngularDamping_0).apply(null,arguments);},jk=b._emscripten_bind_btRigidBody_setDamping_2=function(){return(jk=b._emscripten_bind_btRigidBody_setDamping_2=b.asm.emscripten_bind_btRigidBody_setDamping_2).apply(null,arguments);},kk=b._emscripten_bind_btRigidBody_setMassProps_2=function(){return(kk=b._emscripten_bind_btRigidBody_setMassProps_2=b.asm.emscripten_bind_btRigidBody_setMassProps_2).apply(null,arguments);},lk=b._emscripten_bind_btRigidBody_getLinearFactor_0=function(){return(lk=b._emscripten_bind_btRigidBody_getLinearFactor_0=b.asm.emscripten_bind_btRigidBody_getLinearFactor_0).apply(null,arguments);},mk=b._emscripten_bind_btRigidBody_setLinearFactor_1=function(){return(mk=b._emscripten_bind_btRigidBody_setLinearFactor_1=b.asm.emscripten_bind_btRigidBody_setLinearFactor_1).apply(null,arguments);},nk=b._emscripten_bind_btRigidBody_applyTorque_1=function(){return(nk=b._emscripten_bind_btRigidBody_applyTorque_1=b.asm.emscripten_bind_btRigidBody_applyTorque_1).apply(null,arguments);},ok=b._emscripten_bind_btRigidBody_applyLocalTorque_1=function(){return(ok=b._emscripten_bind_btRigidBody_applyLocalTorque_1=b.asm.emscripten_bind_btRigidBody_applyLocalTorque_1).apply(null,arguments);},pk=b._emscripten_bind_btRigidBody_applyForce_2=function(){return(pk=b._emscripten_bind_btRigidBody_applyForce_2=b.asm.emscripten_bind_btRigidBody_applyForce_2).apply(null,arguments);},qk=b._emscripten_bind_btRigidBody_applyCentralForce_1=function(){return(qk=b._emscripten_bind_btRigidBody_applyCentralForce_1=b.asm.emscripten_bind_btRigidBody_applyCentralForce_1).apply(null,arguments);},rk=b._emscripten_bind_btRigidBody_applyCentralLocalForce_1=function(){return(rk=b._emscripten_bind_btRigidBody_applyCentralLocalForce_1=b.asm.emscripten_bind_btRigidBody_applyCentralLocalForce_1).apply(null,arguments);},sk=b._emscripten_bind_btRigidBody_applyTorqueImpulse_1=function(){return(sk=b._emscripten_bind_btRigidBody_applyTorqueImpulse_1=b.asm.emscripten_bind_btRigidBody_applyTorqueImpulse_1).apply(null,arguments);},tk=b._emscripten_bind_btRigidBody_applyImpulse_2=function(){return(tk=b._emscripten_bind_btRigidBody_applyImpulse_2=b.asm.emscripten_bind_btRigidBody_applyImpulse_2).apply(null,arguments);},uk=b._emscripten_bind_btRigidBody_applyCentralImpulse_1=function(){return(uk=b._emscripten_bind_btRigidBody_applyCentralImpulse_1=b.asm.emscripten_bind_btRigidBody_applyCentralImpulse_1).apply(null,arguments);},vk=b._emscripten_bind_btRigidBody_updateInertiaTensor_0=function(){return(vk=b._emscripten_bind_btRigidBody_updateInertiaTensor_0=b.asm.emscripten_bind_btRigidBody_updateInertiaTensor_0).apply(null,arguments);},wk=b._emscripten_bind_btRigidBody_getLinearVelocity_0=function(){return(wk=b._emscripten_bind_btRigidBody_getLinearVelocity_0=b.asm.emscripten_bind_btRigidBody_getLinearVelocity_0).apply(null,arguments);},xk=b._emscripten_bind_btRigidBody_getAngularVelocity_0=function(){return(xk=b._emscripten_bind_btRigidBody_getAngularVelocity_0=b.asm.emscripten_bind_btRigidBody_getAngularVelocity_0).apply(null,arguments);},yk=b._emscripten_bind_btRigidBody_setLinearVelocity_1=function(){return(yk=b._emscripten_bind_btRigidBody_setLinearVelocity_1=b.asm.emscripten_bind_btRigidBody_setLinearVelocity_1).apply(null,arguments);},zk=b._emscripten_bind_btRigidBody_setAngularVelocity_1=function(){return(zk=b._emscripten_bind_btRigidBody_setAngularVelocity_1=b.asm.emscripten_bind_btRigidBody_setAngularVelocity_1).apply(null,arguments);},Ak=b._emscripten_bind_btRigidBody_getMotionState_0=function(){return(Ak=b._emscripten_bind_btRigidBody_getMotionState_0=b.asm.emscripten_bind_btRigidBody_getMotionState_0).apply(null,arguments);},Bk=b._emscripten_bind_btRigidBody_setMotionState_1=function(){return(Bk=b._emscripten_bind_btRigidBody_setMotionState_1=b.asm.emscripten_bind_btRigidBody_setMotionState_1).apply(null,arguments);},Ck=b._emscripten_bind_btRigidBody_getAngularFactor_0=function(){return(Ck=b._emscripten_bind_btRigidBody_getAngularFactor_0=b.asm.emscripten_bind_btRigidBody_getAngularFactor_0).apply(null,arguments);},Dk=b._emscripten_bind_btRigidBody_setAngularFactor_1=function(){return(Dk=b._emscripten_bind_btRigidBody_setAngularFactor_1=b.asm.emscripten_bind_btRigidBody_setAngularFactor_1).apply(null,arguments);},Ek=b._emscripten_bind_btRigidBody_upcast_1=function(){return(Ek=b._emscripten_bind_btRigidBody_upcast_1=b.asm.emscripten_bind_btRigidBody_upcast_1).apply(null,arguments);},Fk=b._emscripten_bind_btRigidBody_getAabb_2=function(){return(Fk=b._emscripten_bind_btRigidBody_getAabb_2=b.asm.emscripten_bind_btRigidBody_getAabb_2).apply(null,arguments);},Gk=b._emscripten_bind_btRigidBody_applyGravity_0=function(){return(Gk=b._emscripten_bind_btRigidBody_applyGravity_0=b.asm.emscripten_bind_btRigidBody_applyGravity_0).apply(null,arguments);},Hk=b._emscripten_bind_btRigidBody_getGravity_0=function(){return(Hk=b._emscripten_bind_btRigidBody_getGravity_0=b.asm.emscripten_bind_btRigidBody_getGravity_0).apply(null,arguments);},Ik=b._emscripten_bind_btRigidBody_setGravity_1=function(){return(Ik=b._emscripten_bind_btRigidBody_setGravity_1=b.asm.emscripten_bind_btRigidBody_setGravity_1).apply(null,arguments);},Jk=b._emscripten_bind_btRigidBody_getBroadphaseProxy_0=function(){return(Jk=b._emscripten_bind_btRigidBody_getBroadphaseProxy_0=b.asm.emscripten_bind_btRigidBody_getBroadphaseProxy_0).apply(null,arguments);},Kk=b._emscripten_bind_btRigidBody_clearForces_0=function(){return(Kk=b._emscripten_bind_btRigidBody_clearForces_0=b.asm.emscripten_bind_btRigidBody_clearForces_0).apply(null,arguments);},Lk=b._emscripten_bind_btRigidBody_setAnisotropicFriction_2=function(){return(Lk=b._emscripten_bind_btRigidBody_setAnisotropicFriction_2=b.asm.emscripten_bind_btRigidBody_setAnisotropicFriction_2).apply(null,arguments);},Mk=b._emscripten_bind_btRigidBody_getCollisionShape_0=function(){return(Mk=b._emscripten_bind_btRigidBody_getCollisionShape_0=b.asm.emscripten_bind_btRigidBody_getCollisionShape_0).apply(null,arguments);},Nk=b._emscripten_bind_btRigidBody_setContactProcessingThreshold_1=function(){return(Nk=b._emscripten_bind_btRigidBody_setContactProcessingThreshold_1=b.asm.emscripten_bind_btRigidBody_setContactProcessingThreshold_1).apply(null,arguments);},Ok=b._emscripten_bind_btRigidBody_setActivationState_1=function(){return(Ok=b._emscripten_bind_btRigidBody_setActivationState_1=b.asm.emscripten_bind_btRigidBody_setActivationState_1).apply(null,arguments);},Pk=b._emscripten_bind_btRigidBody_forceActivationState_1=function(){return(Pk=b._emscripten_bind_btRigidBody_forceActivationState_1=b.asm.emscripten_bind_btRigidBody_forceActivationState_1).apply(null,arguments);},Qk=b._emscripten_bind_btRigidBody_activate_0=function(){return(Qk=b._emscripten_bind_btRigidBody_activate_0=b.asm.emscripten_bind_btRigidBody_activate_0).apply(null,arguments);},Rk=b._emscripten_bind_btRigidBody_activate_1=function(){return(Rk=b._emscripten_bind_btRigidBody_activate_1=b.asm.emscripten_bind_btRigidBody_activate_1).apply(null,arguments);},Sk=b._emscripten_bind_btRigidBody_isActive_0=function(){return(Sk=b._emscripten_bind_btRigidBody_isActive_0=b.asm.emscripten_bind_btRigidBody_isActive_0).apply(null,arguments);},Tk=b._emscripten_bind_btRigidBody_isKinematicObject_0=function(){return(Tk=b._emscripten_bind_btRigidBody_isKinematicObject_0=b.asm.emscripten_bind_btRigidBody_isKinematicObject_0).apply(null,arguments);},Uk=b._emscripten_bind_btRigidBody_isStaticObject_0=function(){return(Uk=b._emscripten_bind_btRigidBody_isStaticObject_0=b.asm.emscripten_bind_btRigidBody_isStaticObject_0).apply(null,arguments);},Vk=b._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0=function(){return(Vk=b._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0=b.asm.emscripten_bind_btRigidBody_isStaticOrKinematicObject_0).apply(null,arguments);},Wk=b._emscripten_bind_btRigidBody_getRestitution_0=function(){return(Wk=b._emscripten_bind_btRigidBody_getRestitution_0=b.asm.emscripten_bind_btRigidBody_getRestitution_0).apply(null,arguments);},Xk=b._emscripten_bind_btRigidBody_getFriction_0=function(){return(Xk=b._emscripten_bind_btRigidBody_getFriction_0=b.asm.emscripten_bind_btRigidBody_getFriction_0).apply(null,arguments);},Yk=b._emscripten_bind_btRigidBody_getRollingFriction_0=function(){return(Yk=b._emscripten_bind_btRigidBody_getRollingFriction_0=b.asm.emscripten_bind_btRigidBody_getRollingFriction_0).apply(null,arguments);},Zk=b._emscripten_bind_btRigidBody_setRestitution_1=function(){return(Zk=b._emscripten_bind_btRigidBody_setRestitution_1=b.asm.emscripten_bind_btRigidBody_setRestitution_1).apply(null,arguments);},$k=b._emscripten_bind_btRigidBody_setFriction_1=function(){return($k=b._emscripten_bind_btRigidBody_setFriction_1=b.asm.emscripten_bind_btRigidBody_setFriction_1).apply(null,arguments);},al=b._emscripten_bind_btRigidBody_setRollingFriction_1=function(){return(al=b._emscripten_bind_btRigidBody_setRollingFriction_1=b.asm.emscripten_bind_btRigidBody_setRollingFriction_1).apply(null,arguments);},bl=b._emscripten_bind_btRigidBody_getWorldTransform_0=function(){return(bl=b._emscripten_bind_btRigidBody_getWorldTransform_0=b.asm.emscripten_bind_btRigidBody_getWorldTransform_0).apply(null,arguments);},cl=b._emscripten_bind_btRigidBody_getCollisionFlags_0=function(){return(cl=b._emscripten_bind_btRigidBody_getCollisionFlags_0=b.asm.emscripten_bind_btRigidBody_getCollisionFlags_0).apply(null,arguments);},dl=b._emscripten_bind_btRigidBody_setCollisionFlags_1=function(){return(dl=b._emscripten_bind_btRigidBody_setCollisionFlags_1=b.asm.emscripten_bind_btRigidBody_setCollisionFlags_1).apply(null,arguments);},el=b._emscripten_bind_btRigidBody_setWorldTransform_1=function(){return(el=b._emscripten_bind_btRigidBody_setWorldTransform_1=b.asm.emscripten_bind_btRigidBody_setWorldTransform_1).apply(null,arguments);},fl=b._emscripten_bind_btRigidBody_setCollisionShape_1=function(){return(fl=b._emscripten_bind_btRigidBody_setCollisionShape_1=b.asm.emscripten_bind_btRigidBody_setCollisionShape_1).apply(null,arguments);},gl=b._emscripten_bind_btRigidBody_setCcdMotionThreshold_1=function(){return(gl=b._emscripten_bind_btRigidBody_setCcdMotionThreshold_1=b.asm.emscripten_bind_btRigidBody_setCcdMotionThreshold_1).apply(null,arguments);},hl=b._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1=function(){return(hl=b._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1=b.asm.emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1).apply(null,arguments);},il=b._emscripten_bind_btRigidBody_getUserIndex_0=function(){return(il=b._emscripten_bind_btRigidBody_getUserIndex_0=b.asm.emscripten_bind_btRigidBody_getUserIndex_0).apply(null,arguments);},jl=b._emscripten_bind_btRigidBody_setUserIndex_1=function(){return(jl=b._emscripten_bind_btRigidBody_setUserIndex_1=b.asm.emscripten_bind_btRigidBody_setUserIndex_1).apply(null,arguments);},kl=b._emscripten_bind_btRigidBody_getUserPointer_0=function(){return(kl=b._emscripten_bind_btRigidBody_getUserPointer_0=b.asm.emscripten_bind_btRigidBody_getUserPointer_0).apply(null,arguments);},ll=b._emscripten_bind_btRigidBody_setUserPointer_1=function(){return(ll=b._emscripten_bind_btRigidBody_setUserPointer_1=b.asm.emscripten_bind_btRigidBody_setUserPointer_1).apply(null,arguments);},ml=b._emscripten_bind_btRigidBody_getBroadphaseHandle_0=function(){return(ml=b._emscripten_bind_btRigidBody_getBroadphaseHandle_0=b.asm.emscripten_bind_btRigidBody_getBroadphaseHandle_0).apply(null,arguments);},nl=b._emscripten_bind_btRigidBody___destroy___0=function(){return(nl=b._emscripten_bind_btRigidBody___destroy___0=b.asm.emscripten_bind_btRigidBody___destroy___0).apply(null,arguments);},ol=b._emscripten_bind_btIndexedMeshArray_size_0=function(){return(ol=b._emscripten_bind_btIndexedMeshArray_size_0=b.asm.emscripten_bind_btIndexedMeshArray_size_0).apply(null,arguments);},pl=b._emscripten_bind_btIndexedMeshArray_at_1=function(){return(pl=b._emscripten_bind_btIndexedMeshArray_at_1=b.asm.emscripten_bind_btIndexedMeshArray_at_1).apply(null,arguments);},ql=b._emscripten_bind_btIndexedMeshArray___destroy___0=function(){return(ql=b._emscripten_bind_btIndexedMeshArray___destroy___0=b.asm.emscripten_bind_btIndexedMeshArray___destroy___0).apply(null,arguments);},rl=b._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0=function(){return(rl=b._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0=b.asm.emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0).apply(null,arguments);},sl=b._emscripten_bind_btDbvtBroadphase___destroy___0=function(){return(sl=b._emscripten_bind_btDbvtBroadphase___destroy___0=b.asm.emscripten_bind_btDbvtBroadphase___destroy___0).apply(null,arguments);},tl=b._emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9=function(){return(tl=b._emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9=b.asm.emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9).apply(null,arguments);},ul=b._emscripten_bind_btHeightfieldTerrainShape_setMargin_1=function(){return(ul=b._emscripten_bind_btHeightfieldTerrainShape_setMargin_1=b.asm.emscripten_bind_btHeightfieldTerrainShape_setMargin_1).apply(null,arguments);},vl=b._emscripten_bind_btHeightfieldTerrainShape_getMargin_0=function(){return(vl=b._emscripten_bind_btHeightfieldTerrainShape_getMargin_0=b.asm.emscripten_bind_btHeightfieldTerrainShape_getMargin_0).apply(null,arguments);},wl=b._emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1=function(){return(wl=b._emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1=b.asm.emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1).apply(null,arguments);},xl=b._emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0=function(){return(xl=b._emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0=b.asm.emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0).apply(null,arguments);},yl=b._emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2=function(){return(yl=b._emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2=b.asm.emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2).apply(null,arguments);},zl=b._emscripten_bind_btHeightfieldTerrainShape___destroy___0=function(){return(zl=b._emscripten_bind_btHeightfieldTerrainShape___destroy___0=b.asm.emscripten_bind_btHeightfieldTerrainShape___destroy___0).apply(null,arguments);},Al=b._emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0=function(){return(Al=b._emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0=b.asm.emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0).apply(null,arguments);},Bl=b._emscripten_bind_btDefaultSoftBodySolver___destroy___0=function(){return(Bl=b._emscripten_bind_btDefaultSoftBodySolver___destroy___0=b.asm.emscripten_bind_btDefaultSoftBodySolver___destroy___0).apply(null,arguments);},Cl=b._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1=function(){return(Cl=b._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1=b.asm.emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1).apply(null,arguments);},Dl=b._emscripten_bind_btCollisionDispatcher_getNumManifolds_0=function(){return(Dl=b._emscripten_bind_btCollisionDispatcher_getNumManifolds_0=b.asm.emscripten_bind_btCollisionDispatcher_getNumManifolds_0).apply(null,arguments);},El=b._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1=function(){return(El=b._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1=b.asm.emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1).apply(null,arguments);},Fl=b._emscripten_bind_btCollisionDispatcher___destroy___0=function(){return(Fl=b._emscripten_bind_btCollisionDispatcher___destroy___0=b.asm.emscripten_bind_btCollisionDispatcher___destroy___0).apply(null,arguments);},Gl=b._emscripten_bind_btAxisSweep3_btAxisSweep3_2=function(){return(Gl=b._emscripten_bind_btAxisSweep3_btAxisSweep3_2=b.asm.emscripten_bind_btAxisSweep3_btAxisSweep3_2).apply(null,arguments);},Hl=b._emscripten_bind_btAxisSweep3_btAxisSweep3_3=function(){return(Hl=b._emscripten_bind_btAxisSweep3_btAxisSweep3_3=b.asm.emscripten_bind_btAxisSweep3_btAxisSweep3_3).apply(null,arguments);},Il=b._emscripten_bind_btAxisSweep3_btAxisSweep3_4=function(){return(Il=b._emscripten_bind_btAxisSweep3_btAxisSweep3_4=b.asm.emscripten_bind_btAxisSweep3_btAxisSweep3_4).apply(null,arguments);},Jl=b._emscripten_bind_btAxisSweep3_btAxisSweep3_5=function(){return(Jl=b._emscripten_bind_btAxisSweep3_btAxisSweep3_5=b.asm.emscripten_bind_btAxisSweep3_btAxisSweep3_5).apply(null,arguments);},Kl=b._emscripten_bind_btAxisSweep3___destroy___0=function(){return(Kl=b._emscripten_bind_btAxisSweep3___destroy___0=b.asm.emscripten_bind_btAxisSweep3___destroy___0).apply(null,arguments);},Ll=b._emscripten_bind_VoidPtr___destroy___0=function(){return(Ll=b._emscripten_bind_VoidPtr___destroy___0=b.asm.emscripten_bind_VoidPtr___destroy___0).apply(null,arguments);},Ml=b._emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0=function(){return(Ml=b._emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0).apply(null,arguments);},Nl=b._emscripten_bind_btSoftBodyWorldInfo_get_air_density_0=function(){return(Nl=b._emscripten_bind_btSoftBodyWorldInfo_get_air_density_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_get_air_density_0).apply(null,arguments);},Ol=b._emscripten_bind_btSoftBodyWorldInfo_set_air_density_1=function(){return(Ol=b._emscripten_bind_btSoftBodyWorldInfo_set_air_density_1=b.asm.emscripten_bind_btSoftBodyWorldInfo_set_air_density_1).apply(null,arguments);},Pl=b._emscripten_bind_btSoftBodyWorldInfo_get_water_density_0=function(){return(Pl=b._emscripten_bind_btSoftBodyWorldInfo_get_water_density_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_get_water_density_0).apply(null,arguments);},Ql=b._emscripten_bind_btSoftBodyWorldInfo_set_water_density_1=function(){return(Ql=b._emscripten_bind_btSoftBodyWorldInfo_set_water_density_1=b.asm.emscripten_bind_btSoftBodyWorldInfo_set_water_density_1).apply(null,arguments);},Rl=b._emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0=function(){return(Rl=b._emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0).apply(null,arguments);},Sl=b._emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1=function(){return(Sl=b._emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1=b.asm.emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1).apply(null,arguments);},Tl=b._emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0=function(){return(Tl=b._emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0).apply(null,arguments);},Ul=b._emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1=function(){return(Ul=b._emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1=b.asm.emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1).apply(null,arguments);},Vl=b._emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0=function(){return(Vl=b._emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0).apply(null,arguments);},Wl=b._emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1=function(){return(Wl=b._emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1=b.asm.emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1).apply(null,arguments);},Xl=b._emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0=function(){return(Xl=b._emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0).apply(null,arguments);},Yl=b._emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1=function(){return(Yl=b._emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1=b.asm.emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1).apply(null,arguments);},Zl=b._emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0=function(){return(Zl=b._emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0).apply(null,arguments);},$l=b._emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1=function(){return($l=b._emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1=b.asm.emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1).apply(null,arguments);},am=b._emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0=function(){return(am=b._emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0=b.asm.emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0).apply(null,arguments);},bm=b._emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1=function(){return(bm=b._emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1=b.asm.emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1).apply(null,arguments);},cm=b._emscripten_bind_btSoftBodyWorldInfo___destroy___0=function(){return(cm=b._emscripten_bind_btSoftBodyWorldInfo___destroy___0=b.asm.emscripten_bind_btSoftBodyWorldInfo___destroy___0).apply(null,arguments);},dm=b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2=function(){return(dm=b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2=b.asm.emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2).apply(null,arguments);},em=b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4=function(){return(em=b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4=b.asm.emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4).apply(null,arguments);},fm=b._emscripten_bind_btConeTwistConstraint_setLimit_2=function(){return(fm=b._emscripten_bind_btConeTwistConstraint_setLimit_2=b.asm.emscripten_bind_btConeTwistConstraint_setLimit_2).apply(null,arguments);},gm=b._emscripten_bind_btConeTwistConstraint_setAngularOnly_1=function(){return(gm=b._emscripten_bind_btConeTwistConstraint_setAngularOnly_1=b.asm.emscripten_bind_btConeTwistConstraint_setAngularOnly_1).apply(null,arguments);},hm=b._emscripten_bind_btConeTwistConstraint_setDamping_1=function(){return(hm=b._emscripten_bind_btConeTwistConstraint_setDamping_1=b.asm.emscripten_bind_btConeTwistConstraint_setDamping_1).apply(null,arguments);},im=b._emscripten_bind_btConeTwistConstraint_enableMotor_1=function(){return(im=b._emscripten_bind_btConeTwistConstraint_enableMotor_1=b.asm.emscripten_bind_btConeTwistConstraint_enableMotor_1).apply(null,arguments);},jm=b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1=function(){return(jm=b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1=b.asm.emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1).apply(null,arguments);},km=b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1=function(){return(km=b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1=b.asm.emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1).apply(null,arguments);},lm=b._emscripten_bind_btConeTwistConstraint_setMotorTarget_1=function(){return(lm=b._emscripten_bind_btConeTwistConstraint_setMotorTarget_1=b.asm.emscripten_bind_btConeTwistConstraint_setMotorTarget_1).apply(null,arguments);},mm=b._emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1=function(){return(mm=b._emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1=b.asm.emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1).apply(null,arguments);},nm=b._emscripten_bind_btConeTwistConstraint_enableFeedback_1=function(){return(nm=b._emscripten_bind_btConeTwistConstraint_enableFeedback_1=b.asm.emscripten_bind_btConeTwistConstraint_enableFeedback_1).apply(null,arguments);},om=b._emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0=function(){return(om=b._emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0=b.asm.emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0).apply(null,arguments);},pm=b._emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1=function(){return(pm=b._emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1=b.asm.emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1).apply(null,arguments);},qm=b._emscripten_bind_btConeTwistConstraint_getParam_2=function(){return(qm=b._emscripten_bind_btConeTwistConstraint_getParam_2=b.asm.emscripten_bind_btConeTwistConstraint_getParam_2).apply(null,arguments);},rm=b._emscripten_bind_btConeTwistConstraint_setParam_3=function(){return(rm=b._emscripten_bind_btConeTwistConstraint_setParam_3=b.asm.emscripten_bind_btConeTwistConstraint_setParam_3).apply(null,arguments);},sm=b._emscripten_bind_btConeTwistConstraint___destroy___0=function(){return(sm=b._emscripten_bind_btConeTwistConstraint___destroy___0=b.asm.emscripten_bind_btConeTwistConstraint___destroy___0).apply(null,arguments);},tm=b._emscripten_bind_btHingeConstraint_btHingeConstraint_2=function(){return(tm=b._emscripten_bind_btHingeConstraint_btHingeConstraint_2=b.asm.emscripten_bind_btHingeConstraint_btHingeConstraint_2).apply(null,arguments);},um=b._emscripten_bind_btHingeConstraint_btHingeConstraint_3=function(){return(um=b._emscripten_bind_btHingeConstraint_btHingeConstraint_3=b.asm.emscripten_bind_btHingeConstraint_btHingeConstraint_3).apply(null,arguments);},wm=b._emscripten_bind_btHingeConstraint_btHingeConstraint_4=function(){return(wm=b._emscripten_bind_btHingeConstraint_btHingeConstraint_4=b.asm.emscripten_bind_btHingeConstraint_btHingeConstraint_4).apply(null,arguments);},xm=b._emscripten_bind_btHingeConstraint_btHingeConstraint_5=function(){return(xm=b._emscripten_bind_btHingeConstraint_btHingeConstraint_5=b.asm.emscripten_bind_btHingeConstraint_btHingeConstraint_5).apply(null,arguments);},ym=b._emscripten_bind_btHingeConstraint_btHingeConstraint_6=function(){return(ym=b._emscripten_bind_btHingeConstraint_btHingeConstraint_6=b.asm.emscripten_bind_btHingeConstraint_btHingeConstraint_6).apply(null,arguments);},zm=b._emscripten_bind_btHingeConstraint_btHingeConstraint_7=function(){return(zm=b._emscripten_bind_btHingeConstraint_btHingeConstraint_7=b.asm.emscripten_bind_btHingeConstraint_btHingeConstraint_7).apply(null,arguments);},Am=b._emscripten_bind_btHingeConstraint_setLimit_4=function(){return(Am=b._emscripten_bind_btHingeConstraint_setLimit_4=b.asm.emscripten_bind_btHingeConstraint_setLimit_4).apply(null,arguments);},Bm=b._emscripten_bind_btHingeConstraint_setLimit_5=function(){return(Bm=b._emscripten_bind_btHingeConstraint_setLimit_5=b.asm.emscripten_bind_btHingeConstraint_setLimit_5).apply(null,arguments);},Cm=b._emscripten_bind_btHingeConstraint_enableAngularMotor_3=function(){return(Cm=b._emscripten_bind_btHingeConstraint_enableAngularMotor_3=b.asm.emscripten_bind_btHingeConstraint_enableAngularMotor_3).apply(null,arguments);},Dm=b._emscripten_bind_btHingeConstraint_setAngularOnly_1=function(){return(Dm=b._emscripten_bind_btHingeConstraint_setAngularOnly_1=b.asm.emscripten_bind_btHingeConstraint_setAngularOnly_1).apply(null,arguments);},Em=b._emscripten_bind_btHingeConstraint_enableMotor_1=function(){return(Em=b._emscripten_bind_btHingeConstraint_enableMotor_1=b.asm.emscripten_bind_btHingeConstraint_enableMotor_1).apply(null,arguments);},Fm=b._emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1=function(){return(Fm=b._emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1=b.asm.emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1).apply(null,arguments);},Gm=b._emscripten_bind_btHingeConstraint_setMotorTarget_2=function(){return(Gm=b._emscripten_bind_btHingeConstraint_setMotorTarget_2=b.asm.emscripten_bind_btHingeConstraint_setMotorTarget_2).apply(null,arguments);},Hm=b._emscripten_bind_btHingeConstraint_enableFeedback_1=function(){return(Hm=b._emscripten_bind_btHingeConstraint_enableFeedback_1=b.asm.emscripten_bind_btHingeConstraint_enableFeedback_1).apply(null,arguments);},Im=b._emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0=function(){return(Im=b._emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0=b.asm.emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0).apply(null,arguments);},Jm=b._emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1=function(){return(Jm=b._emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1=b.asm.emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1).apply(null,arguments);},Km=b._emscripten_bind_btHingeConstraint_getParam_2=function(){return(Km=b._emscripten_bind_btHingeConstraint_getParam_2=b.asm.emscripten_bind_btHingeConstraint_getParam_2).apply(null,arguments);},Lm=b._emscripten_bind_btHingeConstraint_setParam_3=function(){return(Lm=b._emscripten_bind_btHingeConstraint_setParam_3=b.asm.emscripten_bind_btHingeConstraint_setParam_3).apply(null,arguments);},Mm=b._emscripten_bind_btHingeConstraint___destroy___0=function(){return(Mm=b._emscripten_bind_btHingeConstraint___destroy___0=b.asm.emscripten_bind_btHingeConstraint___destroy___0).apply(null,arguments);},Nm=b._emscripten_bind_btConeShapeZ_btConeShapeZ_2=function(){return(Nm=b._emscripten_bind_btConeShapeZ_btConeShapeZ_2=b.asm.emscripten_bind_btConeShapeZ_btConeShapeZ_2).apply(null,arguments);},Om=b._emscripten_bind_btConeShapeZ_setLocalScaling_1=function(){return(Om=b._emscripten_bind_btConeShapeZ_setLocalScaling_1=b.asm.emscripten_bind_btConeShapeZ_setLocalScaling_1).apply(null,arguments);},Pm=b._emscripten_bind_btConeShapeZ_getLocalScaling_0=function(){return(Pm=b._emscripten_bind_btConeShapeZ_getLocalScaling_0=b.asm.emscripten_bind_btConeShapeZ_getLocalScaling_0).apply(null,arguments);},Qm=b._emscripten_bind_btConeShapeZ_calculateLocalInertia_2=function(){return(Qm=b._emscripten_bind_btConeShapeZ_calculateLocalInertia_2=b.asm.emscripten_bind_btConeShapeZ_calculateLocalInertia_2).apply(null,arguments);},Rm=b._emscripten_bind_btConeShapeZ___destroy___0=function(){return(Rm=b._emscripten_bind_btConeShapeZ___destroy___0=b.asm.emscripten_bind_btConeShapeZ___destroy___0).apply(null,arguments);},Sm=b._emscripten_bind_btConeShapeX_btConeShapeX_2=function(){return(Sm=b._emscripten_bind_btConeShapeX_btConeShapeX_2=b.asm.emscripten_bind_btConeShapeX_btConeShapeX_2).apply(null,arguments);},Tm=b._emscripten_bind_btConeShapeX_setLocalScaling_1=function(){return(Tm=b._emscripten_bind_btConeShapeX_setLocalScaling_1=b.asm.emscripten_bind_btConeShapeX_setLocalScaling_1).apply(null,arguments);},Um=b._emscripten_bind_btConeShapeX_getLocalScaling_0=function(){return(Um=b._emscripten_bind_btConeShapeX_getLocalScaling_0=b.asm.emscripten_bind_btConeShapeX_getLocalScaling_0).apply(null,arguments);},Vm=b._emscripten_bind_btConeShapeX_calculateLocalInertia_2=function(){return(Vm=b._emscripten_bind_btConeShapeX_calculateLocalInertia_2=b.asm.emscripten_bind_btConeShapeX_calculateLocalInertia_2).apply(null,arguments);},Wm=b._emscripten_bind_btConeShapeX___destroy___0=function(){return(Wm=b._emscripten_bind_btConeShapeX___destroy___0=b.asm.emscripten_bind_btConeShapeX___destroy___0).apply(null,arguments);},Xm=b._emscripten_bind_btTriangleMesh_btTriangleMesh_0=function(){return(Xm=b._emscripten_bind_btTriangleMesh_btTriangleMesh_0=b.asm.emscripten_bind_btTriangleMesh_btTriangleMesh_0).apply(null,arguments);},Ym=b._emscripten_bind_btTriangleMesh_btTriangleMesh_1=function(){return(Ym=b._emscripten_bind_btTriangleMesh_btTriangleMesh_1=b.asm.emscripten_bind_btTriangleMesh_btTriangleMesh_1).apply(null,arguments);},Zm=b._emscripten_bind_btTriangleMesh_btTriangleMesh_2=function(){return(Zm=b._emscripten_bind_btTriangleMesh_btTriangleMesh_2=b.asm.emscripten_bind_btTriangleMesh_btTriangleMesh_2).apply(null,arguments);},$m=b._emscripten_bind_btTriangleMesh_addTriangle_3=function(){return($m=b._emscripten_bind_btTriangleMesh_addTriangle_3=b.asm.emscripten_bind_btTriangleMesh_addTriangle_3).apply(null,arguments);},an=b._emscripten_bind_btTriangleMesh_addTriangle_4=function(){return(an=b._emscripten_bind_btTriangleMesh_addTriangle_4=b.asm.emscripten_bind_btTriangleMesh_addTriangle_4).apply(null,arguments);},bn=b._emscripten_bind_btTriangleMesh_findOrAddVertex_2=function(){return(bn=b._emscripten_bind_btTriangleMesh_findOrAddVertex_2=b.asm.emscripten_bind_btTriangleMesh_findOrAddVertex_2).apply(null,arguments);},cn=b._emscripten_bind_btTriangleMesh_addIndex_1=function(){return(cn=b._emscripten_bind_btTriangleMesh_addIndex_1=b.asm.emscripten_bind_btTriangleMesh_addIndex_1).apply(null,arguments);},dn=b._emscripten_bind_btTriangleMesh_getIndexedMeshArray_0=function(){return(dn=b._emscripten_bind_btTriangleMesh_getIndexedMeshArray_0=b.asm.emscripten_bind_btTriangleMesh_getIndexedMeshArray_0).apply(null,arguments);},en=b._emscripten_bind_btTriangleMesh_setScaling_1=function(){return(en=b._emscripten_bind_btTriangleMesh_setScaling_1=b.asm.emscripten_bind_btTriangleMesh_setScaling_1).apply(null,arguments);},fn=b._emscripten_bind_btTriangleMesh___destroy___0=function(){return(fn=b._emscripten_bind_btTriangleMesh___destroy___0=b.asm.emscripten_bind_btTriangleMesh___destroy___0).apply(null,arguments);},gn=b._emscripten_bind_btConvexHullShape_btConvexHullShape_0=function(){return(gn=b._emscripten_bind_btConvexHullShape_btConvexHullShape_0=b.asm.emscripten_bind_btConvexHullShape_btConvexHullShape_0).apply(null,arguments);},hn=b._emscripten_bind_btConvexHullShape_btConvexHullShape_1=function(){return(hn=b._emscripten_bind_btConvexHullShape_btConvexHullShape_1=b.asm.emscripten_bind_btConvexHullShape_btConvexHullShape_1).apply(null,arguments);},jn=b._emscripten_bind_btConvexHullShape_btConvexHullShape_2=function(){return(jn=b._emscripten_bind_btConvexHullShape_btConvexHullShape_2=b.asm.emscripten_bind_btConvexHullShape_btConvexHullShape_2).apply(null,arguments);},kn=b._emscripten_bind_btConvexHullShape_addPoint_1=function(){return(kn=b._emscripten_bind_btConvexHullShape_addPoint_1=b.asm.emscripten_bind_btConvexHullShape_addPoint_1).apply(null,arguments);},ln=b._emscripten_bind_btConvexHullShape_addPoint_2=function(){return(ln=b._emscripten_bind_btConvexHullShape_addPoint_2=b.asm.emscripten_bind_btConvexHullShape_addPoint_2).apply(null,arguments);},mn=b._emscripten_bind_btConvexHullShape_setMargin_1=function(){return(mn=b._emscripten_bind_btConvexHullShape_setMargin_1=b.asm.emscripten_bind_btConvexHullShape_setMargin_1).apply(null,arguments);},nn=b._emscripten_bind_btConvexHullShape_getMargin_0=function(){return(nn=b._emscripten_bind_btConvexHullShape_getMargin_0=b.asm.emscripten_bind_btConvexHullShape_getMargin_0).apply(null,arguments);},on=b._emscripten_bind_btConvexHullShape_getNumVertices_0=function(){return(on=b._emscripten_bind_btConvexHullShape_getNumVertices_0=b.asm.emscripten_bind_btConvexHullShape_getNumVertices_0).apply(null,arguments);},pn=b._emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1=function(){return(pn=b._emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1=b.asm.emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1).apply(null,arguments);},qn=b._emscripten_bind_btConvexHullShape_recalcLocalAabb_0=function(){return(qn=b._emscripten_bind_btConvexHullShape_recalcLocalAabb_0=b.asm.emscripten_bind_btConvexHullShape_recalcLocalAabb_0).apply(null,arguments);},rn=b._emscripten_bind_btConvexHullShape_getConvexPolyhedron_0=function(){return(rn=b._emscripten_bind_btConvexHullShape_getConvexPolyhedron_0=b.asm.emscripten_bind_btConvexHullShape_getConvexPolyhedron_0).apply(null,arguments);},sn=b._emscripten_bind_btConvexHullShape_setLocalScaling_1=function(){return(sn=b._emscripten_bind_btConvexHullShape_setLocalScaling_1=b.asm.emscripten_bind_btConvexHullShape_setLocalScaling_1).apply(null,arguments);},tn=b._emscripten_bind_btConvexHullShape_getLocalScaling_0=function(){return(tn=b._emscripten_bind_btConvexHullShape_getLocalScaling_0=b.asm.emscripten_bind_btConvexHullShape_getLocalScaling_0).apply(null,arguments);},un=b._emscripten_bind_btConvexHullShape_calculateLocalInertia_2=function(){return(un=b._emscripten_bind_btConvexHullShape_calculateLocalInertia_2=b.asm.emscripten_bind_btConvexHullShape_calculateLocalInertia_2).apply(null,arguments);},vn=b._emscripten_bind_btConvexHullShape___destroy___0=function(){return(vn=b._emscripten_bind_btConvexHullShape___destroy___0=b.asm.emscripten_bind_btConvexHullShape___destroy___0).apply(null,arguments);},wn=b._emscripten_bind_btVehicleTuning_btVehicleTuning_0=function(){return(wn=b._emscripten_bind_btVehicleTuning_btVehicleTuning_0=b.asm.emscripten_bind_btVehicleTuning_btVehicleTuning_0).apply(null,arguments);},xn=b._emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0=function(){return(xn=b._emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0=b.asm.emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0).apply(null,arguments);},yn=b._emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1=function(){return(yn=b._emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1=b.asm.emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1).apply(null,arguments);},zn=b._emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0=function(){return(zn=b._emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0=b.asm.emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0).apply(null,arguments);},An=b._emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1=function(){return(An=b._emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1=b.asm.emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1).apply(null,arguments);},Bn=b._emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0=function(){return(Bn=b._emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0=b.asm.emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0).apply(null,arguments);},Cn=b._emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1=function(){return(Cn=b._emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1=b.asm.emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1).apply(null,arguments);},Dn=b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0=function(){return(Dn=b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0=b.asm.emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0).apply(null,arguments);},En=b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1=function(){return(En=b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1=b.asm.emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1).apply(null,arguments);},Fn=b._emscripten_bind_btVehicleTuning_get_m_frictionSlip_0=function(){return(Fn=b._emscripten_bind_btVehicleTuning_get_m_frictionSlip_0=b.asm.emscripten_bind_btVehicleTuning_get_m_frictionSlip_0).apply(null,arguments);},Gn=b._emscripten_bind_btVehicleTuning_set_m_frictionSlip_1=function(){return(Gn=b._emscripten_bind_btVehicleTuning_set_m_frictionSlip_1=b.asm.emscripten_bind_btVehicleTuning_set_m_frictionSlip_1).apply(null,arguments);},Hn=b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0=function(){return(Hn=b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0=b.asm.emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0).apply(null,arguments);},In=b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1=function(){return(In=b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1=b.asm.emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1).apply(null,arguments);},Jn=b._emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0=function(){return(Jn=b._emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0=b.asm.emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0).apply(null,arguments);},Kn=b._emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0=function(){return(Kn=b._emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0=b.asm.emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0).apply(null,arguments);},Ln=b._emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0=function(){return(Ln=b._emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0=b.asm.emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0).apply(null,arguments);},Mn=b._emscripten_bind_btShapeHull_btShapeHull_1=function(){return(Mn=b._emscripten_bind_btShapeHull_btShapeHull_1=b.asm.emscripten_bind_btShapeHull_btShapeHull_1).apply(null,arguments);},Nn=b._emscripten_bind_btShapeHull_buildHull_1=function(){return(Nn=b._emscripten_bind_btShapeHull_buildHull_1=b.asm.emscripten_bind_btShapeHull_buildHull_1).apply(null,arguments);},On=b._emscripten_bind_btShapeHull_numVertices_0=function(){return(On=b._emscripten_bind_btShapeHull_numVertices_0=b.asm.emscripten_bind_btShapeHull_numVertices_0).apply(null,arguments);},Pn=b._emscripten_bind_btShapeHull_getVertexPointer_0=function(){return(Pn=b._emscripten_bind_btShapeHull_getVertexPointer_0=b.asm.emscripten_bind_btShapeHull_getVertexPointer_0).apply(null,arguments);},Qn=b._emscripten_bind_btShapeHull___destroy___0=function(){return(Qn=b._emscripten_bind_btShapeHull___destroy___0=b.asm.emscripten_bind_btShapeHull___destroy___0).apply(null,arguments);},Rn=b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0=function(){return(Rn=b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0=b.asm.emscripten_bind_btDefaultMotionState_btDefaultMotionState_0).apply(null,arguments);},Sn=b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1=function(){return(Sn=b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1=b.asm.emscripten_bind_btDefaultMotionState_btDefaultMotionState_1).apply(null,arguments);},Tn=b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2=function(){return(Tn=b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2=b.asm.emscripten_bind_btDefaultMotionState_btDefaultMotionState_2).apply(null,arguments);},Un=b._emscripten_bind_btDefaultMotionState_getWorldTransform_1=function(){return(Un=b._emscripten_bind_btDefaultMotionState_getWorldTransform_1=b.asm.emscripten_bind_btDefaultMotionState_getWorldTransform_1).apply(null,arguments);},Vn=b._emscripten_bind_btDefaultMotionState_setWorldTransform_1=function(){return(Vn=b._emscripten_bind_btDefaultMotionState_setWorldTransform_1=b.asm.emscripten_bind_btDefaultMotionState_setWorldTransform_1).apply(null,arguments);},Wn=b._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0=function(){return(Wn=b._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0=b.asm.emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0).apply(null,arguments);},Xn=b._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1=function(){return(Xn=b._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1=b.asm.emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1).apply(null,arguments);},Yn=b._emscripten_bind_btDefaultMotionState___destroy___0=function(){return(Yn=b._emscripten_bind_btDefaultMotionState___destroy___0=b.asm.emscripten_bind_btDefaultMotionState___destroy___0).apply(null,arguments);},Zn=b._emscripten_bind_btWheelInfo_btWheelInfo_1=function(){return(Zn=b._emscripten_bind_btWheelInfo_btWheelInfo_1=b.asm.emscripten_bind_btWheelInfo_btWheelInfo_1).apply(null,arguments);},$n=b._emscripten_bind_btWheelInfo_getSuspensionRestLength_0=function(){return($n=b._emscripten_bind_btWheelInfo_getSuspensionRestLength_0=b.asm.emscripten_bind_btWheelInfo_getSuspensionRestLength_0).apply(null,arguments);},ao=b._emscripten_bind_btWheelInfo_updateWheel_2=function(){return(ao=b._emscripten_bind_btWheelInfo_updateWheel_2=b.asm.emscripten_bind_btWheelInfo_updateWheel_2).apply(null,arguments);},bo=b._emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0=function(){return(bo=b._emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0=b.asm.emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0).apply(null,arguments);},co=b._emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1=function(){return(co=b._emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1=b.asm.emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1).apply(null,arguments);},eo=b._emscripten_bind_btWheelInfo_get_m_frictionSlip_0=function(){return(eo=b._emscripten_bind_btWheelInfo_get_m_frictionSlip_0=b.asm.emscripten_bind_btWheelInfo_get_m_frictionSlip_0).apply(null,arguments);},fo=b._emscripten_bind_btWheelInfo_set_m_frictionSlip_1=function(){return(fo=b._emscripten_bind_btWheelInfo_set_m_frictionSlip_1=b.asm.emscripten_bind_btWheelInfo_set_m_frictionSlip_1).apply(null,arguments);},go=b._emscripten_bind_btWheelInfo_get_m_engineForce_0=function(){return(go=b._emscripten_bind_btWheelInfo_get_m_engineForce_0=b.asm.emscripten_bind_btWheelInfo_get_m_engineForce_0).apply(null,arguments);},ho=b._emscripten_bind_btWheelInfo_set_m_engineForce_1=function(){return(ho=b._emscripten_bind_btWheelInfo_set_m_engineForce_1=b.asm.emscripten_bind_btWheelInfo_set_m_engineForce_1).apply(null,arguments);},io=b._emscripten_bind_btWheelInfo_get_m_rollInfluence_0=function(){return(io=b._emscripten_bind_btWheelInfo_get_m_rollInfluence_0=b.asm.emscripten_bind_btWheelInfo_get_m_rollInfluence_0).apply(null,arguments);},jo=b._emscripten_bind_btWheelInfo_set_m_rollInfluence_1=function(){return(jo=b._emscripten_bind_btWheelInfo_set_m_rollInfluence_1=b.asm.emscripten_bind_btWheelInfo_set_m_rollInfluence_1).apply(null,arguments);},ko=b._emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0=function(){return(ko=b._emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0=b.asm.emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0).apply(null,arguments);},lo=b._emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1=function(){return(lo=b._emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1=b.asm.emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1).apply(null,arguments);},mo=b._emscripten_bind_btWheelInfo_get_m_wheelsRadius_0=function(){return(mo=b._emscripten_bind_btWheelInfo_get_m_wheelsRadius_0=b.asm.emscripten_bind_btWheelInfo_get_m_wheelsRadius_0).apply(null,arguments);},no=b._emscripten_bind_btWheelInfo_set_m_wheelsRadius_1=function(){return(no=b._emscripten_bind_btWheelInfo_set_m_wheelsRadius_1=b.asm.emscripten_bind_btWheelInfo_set_m_wheelsRadius_1).apply(null,arguments);},oo=b._emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0=function(){return(oo=b._emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0=b.asm.emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0).apply(null,arguments);},po=b._emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1=function(){return(po=b._emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1=b.asm.emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1).apply(null,arguments);},qo=b._emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0=function(){return(qo=b._emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0=b.asm.emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0).apply(null,arguments);},ro=b._emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1=function(){return(ro=b._emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1=b.asm.emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1).apply(null,arguments);},so=b._emscripten_bind_btWheelInfo_get_m_steering_0=function(){return(so=b._emscripten_bind_btWheelInfo_get_m_steering_0=b.asm.emscripten_bind_btWheelInfo_get_m_steering_0).apply(null,arguments);},to=b._emscripten_bind_btWheelInfo_set_m_steering_1=function(){return(to=b._emscripten_bind_btWheelInfo_set_m_steering_1=b.asm.emscripten_bind_btWheelInfo_set_m_steering_1).apply(null,arguments);},uo=b._emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0=function(){return(uo=b._emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0=b.asm.emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0).apply(null,arguments);},vo=b._emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1=function(){return(vo=b._emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1=b.asm.emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1).apply(null,arguments);},wo=b._emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0=function(){return(wo=b._emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0=b.asm.emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0).apply(null,arguments);},xo=b._emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1=function(){return(xo=b._emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1=b.asm.emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1).apply(null,arguments);},yo=b._emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0=function(){return(yo=b._emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0=b.asm.emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0).apply(null,arguments);},zo=b._emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1=function(){return(zo=b._emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1=b.asm.emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1).apply(null,arguments);},Ao=b._emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0=function(){return(Ao=b._emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0=b.asm.emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0).apply(null,arguments);},Bo=b._emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1=function(){return(Bo=b._emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1=b.asm.emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1).apply(null,arguments);},Co=b._emscripten_bind_btWheelInfo_get_m_raycastInfo_0=function(){return(Co=b._emscripten_bind_btWheelInfo_get_m_raycastInfo_0=b.asm.emscripten_bind_btWheelInfo_get_m_raycastInfo_0).apply(null,arguments);},Do=b._emscripten_bind_btWheelInfo_set_m_raycastInfo_1=function(){return(Do=b._emscripten_bind_btWheelInfo_set_m_raycastInfo_1=b.asm.emscripten_bind_btWheelInfo_set_m_raycastInfo_1).apply(null,arguments);},Eo=b._emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0=function(){return(Eo=b._emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0=b.asm.emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0).apply(null,arguments);},Fo=b._emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1=function(){return(Fo=b._emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1=b.asm.emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1).apply(null,arguments);},Go=b._emscripten_bind_btWheelInfo_get_m_worldTransform_0=function(){return(Go=b._emscripten_bind_btWheelInfo_get_m_worldTransform_0=b.asm.emscripten_bind_btWheelInfo_get_m_worldTransform_0).apply(null,arguments);},Ho=b._emscripten_bind_btWheelInfo_set_m_worldTransform_1=function(){return(Ho=b._emscripten_bind_btWheelInfo_set_m_worldTransform_1=b.asm.emscripten_bind_btWheelInfo_set_m_worldTransform_1).apply(null,arguments);},Io=b._emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0=function(){return(Io=b._emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0=b.asm.emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0).apply(null,arguments);},Jo=b._emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1=function(){return(Jo=b._emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1=b.asm.emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1).apply(null,arguments);},Ko=b._emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0=function(){return(Ko=b._emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0=b.asm.emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0).apply(null,arguments);},Lo=b._emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1=function(){return(Lo=b._emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1=b.asm.emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1).apply(null,arguments);},Mo=b._emscripten_bind_btWheelInfo_get_m_rotation_0=function(){return(Mo=b._emscripten_bind_btWheelInfo_get_m_rotation_0=b.asm.emscripten_bind_btWheelInfo_get_m_rotation_0).apply(null,arguments);},No=b._emscripten_bind_btWheelInfo_set_m_rotation_1=function(){return(No=b._emscripten_bind_btWheelInfo_set_m_rotation_1=b.asm.emscripten_bind_btWheelInfo_set_m_rotation_1).apply(null,arguments);},Oo=b._emscripten_bind_btWheelInfo_get_m_deltaRotation_0=function(){return(Oo=b._emscripten_bind_btWheelInfo_get_m_deltaRotation_0=b.asm.emscripten_bind_btWheelInfo_get_m_deltaRotation_0).apply(null,arguments);},Po=b._emscripten_bind_btWheelInfo_set_m_deltaRotation_1=function(){return(Po=b._emscripten_bind_btWheelInfo_set_m_deltaRotation_1=b.asm.emscripten_bind_btWheelInfo_set_m_deltaRotation_1).apply(null,arguments);},Qo=b._emscripten_bind_btWheelInfo_get_m_brake_0=function(){return(Qo=b._emscripten_bind_btWheelInfo_get_m_brake_0=b.asm.emscripten_bind_btWheelInfo_get_m_brake_0).apply(null,arguments);},Ro=b._emscripten_bind_btWheelInfo_set_m_brake_1=function(){return(Ro=b._emscripten_bind_btWheelInfo_set_m_brake_1=b.asm.emscripten_bind_btWheelInfo_set_m_brake_1).apply(null,arguments);},So=b._emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0=function(){return(So=b._emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0=b.asm.emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0).apply(null,arguments);},To=b._emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1=function(){return(To=b._emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1=b.asm.emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1).apply(null,arguments);},Uo=b._emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0=function(){return(Uo=b._emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0=b.asm.emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0).apply(null,arguments);},Vo=b._emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1=function(){return(Vo=b._emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1=b.asm.emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1).apply(null,arguments);},Wo=b._emscripten_bind_btWheelInfo_get_m_skidInfo_0=function(){return(Wo=b._emscripten_bind_btWheelInfo_get_m_skidInfo_0=b.asm.emscripten_bind_btWheelInfo_get_m_skidInfo_0).apply(null,arguments);},Xo=b._emscripten_bind_btWheelInfo_set_m_skidInfo_1=function(){return(Xo=b._emscripten_bind_btWheelInfo_set_m_skidInfo_1=b.asm.emscripten_bind_btWheelInfo_set_m_skidInfo_1).apply(null,arguments);},Yo=b._emscripten_bind_btWheelInfo___destroy___0=function(){return(Yo=b._emscripten_bind_btWheelInfo___destroy___0=b.asm.emscripten_bind_btWheelInfo___destroy___0).apply(null,arguments);},Zo=b._emscripten_bind_btVector4_btVector4_0=function(){return(Zo=b._emscripten_bind_btVector4_btVector4_0=b.asm.emscripten_bind_btVector4_btVector4_0).apply(null,arguments);},$o=b._emscripten_bind_btVector4_btVector4_4=function(){return($o=b._emscripten_bind_btVector4_btVector4_4=b.asm.emscripten_bind_btVector4_btVector4_4).apply(null,arguments);},ap=b._emscripten_bind_btVector4_w_0=function(){return(ap=b._emscripten_bind_btVector4_w_0=b.asm.emscripten_bind_btVector4_w_0).apply(null,arguments);},bp=b._emscripten_bind_btVector4_setValue_4=function(){return(bp=b._emscripten_bind_btVector4_setValue_4=b.asm.emscripten_bind_btVector4_setValue_4).apply(null,arguments);},cp=b._emscripten_bind_btVector4_length_0=function(){return(cp=b._emscripten_bind_btVector4_length_0=b.asm.emscripten_bind_btVector4_length_0).apply(null,arguments);},dp=b._emscripten_bind_btVector4_x_0=function(){return(dp=b._emscripten_bind_btVector4_x_0=b.asm.emscripten_bind_btVector4_x_0).apply(null,arguments);},ep=b._emscripten_bind_btVector4_y_0=function(){return(ep=b._emscripten_bind_btVector4_y_0=b.asm.emscripten_bind_btVector4_y_0).apply(null,arguments);},fp=b._emscripten_bind_btVector4_z_0=function(){return(fp=b._emscripten_bind_btVector4_z_0=b.asm.emscripten_bind_btVector4_z_0).apply(null,arguments);},gp=b._emscripten_bind_btVector4_setX_1=function(){return(gp=b._emscripten_bind_btVector4_setX_1=b.asm.emscripten_bind_btVector4_setX_1).apply(null,arguments);},hp=b._emscripten_bind_btVector4_setY_1=function(){return(hp=b._emscripten_bind_btVector4_setY_1=b.asm.emscripten_bind_btVector4_setY_1).apply(null,arguments);},ip=b._emscripten_bind_btVector4_setZ_1=function(){return(ip=b._emscripten_bind_btVector4_setZ_1=b.asm.emscripten_bind_btVector4_setZ_1).apply(null,arguments);},jp=b._emscripten_bind_btVector4_normalize_0=function(){return(jp=b._emscripten_bind_btVector4_normalize_0=b.asm.emscripten_bind_btVector4_normalize_0).apply(null,arguments);},kp=b._emscripten_bind_btVector4_rotate_2=function(){return(kp=b._emscripten_bind_btVector4_rotate_2=b.asm.emscripten_bind_btVector4_rotate_2).apply(null,arguments);},lp=b._emscripten_bind_btVector4_dot_1=function(){return(lp=b._emscripten_bind_btVector4_dot_1=b.asm.emscripten_bind_btVector4_dot_1).apply(null,arguments);},mp=b._emscripten_bind_btVector4_op_mul_1=function(){return(mp=b._emscripten_bind_btVector4_op_mul_1=b.asm.emscripten_bind_btVector4_op_mul_1).apply(null,arguments);},np=b._emscripten_bind_btVector4_op_add_1=function(){return(np=b._emscripten_bind_btVector4_op_add_1=b.asm.emscripten_bind_btVector4_op_add_1).apply(null,arguments);},op=b._emscripten_bind_btVector4_op_sub_1=function(){return(op=b._emscripten_bind_btVector4_op_sub_1=b.asm.emscripten_bind_btVector4_op_sub_1).apply(null,arguments);},pp=b._emscripten_bind_btVector4___destroy___0=function(){return(pp=b._emscripten_bind_btVector4___destroy___0=b.asm.emscripten_bind_btVector4___destroy___0).apply(null,arguments);},qp=b._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0=function(){return(qp=b._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0=b.asm.emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0).apply(null,arguments);},rp=b._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0=function(){return(rp=b._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0=b.asm.emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0).apply(null,arguments);},sp=b._emscripten_bind_Anchor_get_m_node_0=function(){return(sp=b._emscripten_bind_Anchor_get_m_node_0=b.asm.emscripten_bind_Anchor_get_m_node_0).apply(null,arguments);},tp=b._emscripten_bind_Anchor_set_m_node_1=function(){return(tp=b._emscripten_bind_Anchor_set_m_node_1=b.asm.emscripten_bind_Anchor_set_m_node_1).apply(null,arguments);},up=b._emscripten_bind_Anchor_get_m_local_0=function(){return(up=b._emscripten_bind_Anchor_get_m_local_0=b.asm.emscripten_bind_Anchor_get_m_local_0).apply(null,arguments);},vp=b._emscripten_bind_Anchor_set_m_local_1=function(){return(vp=b._emscripten_bind_Anchor_set_m_local_1=b.asm.emscripten_bind_Anchor_set_m_local_1).apply(null,arguments);},wp=b._emscripten_bind_Anchor_get_m_body_0=function(){return(wp=b._emscripten_bind_Anchor_get_m_body_0=b.asm.emscripten_bind_Anchor_get_m_body_0).apply(null,arguments);},xp=b._emscripten_bind_Anchor_set_m_body_1=function(){return(xp=b._emscripten_bind_Anchor_set_m_body_1=b.asm.emscripten_bind_Anchor_set_m_body_1).apply(null,arguments);},yp=b._emscripten_bind_Anchor_get_m_influence_0=function(){return(yp=b._emscripten_bind_Anchor_get_m_influence_0=b.asm.emscripten_bind_Anchor_get_m_influence_0).apply(null,arguments);},zp=b._emscripten_bind_Anchor_set_m_influence_1=function(){return(zp=b._emscripten_bind_Anchor_set_m_influence_1=b.asm.emscripten_bind_Anchor_set_m_influence_1).apply(null,arguments);},Ap=b._emscripten_bind_Anchor_get_m_c0_0=function(){return(Ap=b._emscripten_bind_Anchor_get_m_c0_0=b.asm.emscripten_bind_Anchor_get_m_c0_0).apply(null,arguments);},Bp=b._emscripten_bind_Anchor_set_m_c0_1=function(){return(Bp=b._emscripten_bind_Anchor_set_m_c0_1=b.asm.emscripten_bind_Anchor_set_m_c0_1).apply(null,arguments);},Cp=b._emscripten_bind_Anchor_get_m_c1_0=function(){return(Cp=b._emscripten_bind_Anchor_get_m_c1_0=b.asm.emscripten_bind_Anchor_get_m_c1_0).apply(null,arguments);},Dp=b._emscripten_bind_Anchor_set_m_c1_1=function(){return(Dp=b._emscripten_bind_Anchor_set_m_c1_1=b.asm.emscripten_bind_Anchor_set_m_c1_1).apply(null,arguments);},Ep=b._emscripten_bind_Anchor_get_m_c2_0=function(){return(Ep=b._emscripten_bind_Anchor_get_m_c2_0=b.asm.emscripten_bind_Anchor_get_m_c2_0).apply(null,arguments);},Fp=b._emscripten_bind_Anchor_set_m_c2_1=function(){return(Fp=b._emscripten_bind_Anchor_set_m_c2_1=b.asm.emscripten_bind_Anchor_set_m_c2_1).apply(null,arguments);},Gp=b._emscripten_bind_Anchor___destroy___0=function(){return(Gp=b._emscripten_bind_Anchor___destroy___0=b.asm.emscripten_bind_Anchor___destroy___0).apply(null,arguments);},Hp=b._emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0=function(){return(Hp=b._emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0=b.asm.emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0).apply(null,arguments);},Ip=b._emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1=function(){return(Ip=b._emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1=b.asm.emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1).apply(null,arguments);},Jp=b._emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0=function(){return(Jp=b._emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0=b.asm.emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0).apply(null,arguments);},Kp=b._emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1=function(){return(Kp=b._emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1=b.asm.emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1).apply(null,arguments);},Lp=b._emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0=function(){return(Lp=b._emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0=b.asm.emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0).apply(null,arguments);},Mp=b._emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1=function(){return(Mp=b._emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1=b.asm.emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1).apply(null,arguments);},Np=b._emscripten_bind_btVehicleRaycasterResult___destroy___0=function(){return(Np=b._emscripten_bind_btVehicleRaycasterResult___destroy___0=b.asm.emscripten_bind_btVehicleRaycasterResult___destroy___0).apply(null,arguments);},Op=b._emscripten_bind_btVector3Array_size_0=function(){return(Op=b._emscripten_bind_btVector3Array_size_0=b.asm.emscripten_bind_btVector3Array_size_0).apply(null,arguments);},Pp=b._emscripten_bind_btVector3Array_at_1=function(){return(Pp=b._emscripten_bind_btVector3Array_at_1=b.asm.emscripten_bind_btVector3Array_at_1).apply(null,arguments);},Qp=b._emscripten_bind_btVector3Array___destroy___0=function(){return(Qp=b._emscripten_bind_btVector3Array___destroy___0=b.asm.emscripten_bind_btVector3Array___destroy___0).apply(null,arguments);},Rp=b._emscripten_bind_btConstraintSolver___destroy___0=function(){return(Rp=b._emscripten_bind_btConstraintSolver___destroy___0=b.asm.emscripten_bind_btConstraintSolver___destroy___0).apply(null,arguments);},Sp=b._emscripten_bind_btRaycastVehicle_btRaycastVehicle_3=function(){return(Sp=b._emscripten_bind_btRaycastVehicle_btRaycastVehicle_3=b.asm.emscripten_bind_btRaycastVehicle_btRaycastVehicle_3).apply(null,arguments);},Tp=b._emscripten_bind_btRaycastVehicle_applyEngineForce_2=function(){return(Tp=b._emscripten_bind_btRaycastVehicle_applyEngineForce_2=b.asm.emscripten_bind_btRaycastVehicle_applyEngineForce_2).apply(null,arguments);},Up=b._emscripten_bind_btRaycastVehicle_setSteeringValue_2=function(){return(Up=b._emscripten_bind_btRaycastVehicle_setSteeringValue_2=b.asm.emscripten_bind_btRaycastVehicle_setSteeringValue_2).apply(null,arguments);},Vp=b._emscripten_bind_btRaycastVehicle_getWheelTransformWS_1=function(){return(Vp=b._emscripten_bind_btRaycastVehicle_getWheelTransformWS_1=b.asm.emscripten_bind_btRaycastVehicle_getWheelTransformWS_1).apply(null,arguments);},Wp=b._emscripten_bind_btRaycastVehicle_updateWheelTransform_2=function(){return(Wp=b._emscripten_bind_btRaycastVehicle_updateWheelTransform_2=b.asm.emscripten_bind_btRaycastVehicle_updateWheelTransform_2).apply(null,arguments);},Xp=b._emscripten_bind_btRaycastVehicle_addWheel_7=function(){return(Xp=b._emscripten_bind_btRaycastVehicle_addWheel_7=b.asm.emscripten_bind_btRaycastVehicle_addWheel_7).apply(null,arguments);},Yp=b._emscripten_bind_btRaycastVehicle_getNumWheels_0=function(){return(Yp=b._emscripten_bind_btRaycastVehicle_getNumWheels_0=b.asm.emscripten_bind_btRaycastVehicle_getNumWheels_0).apply(null,arguments);},Zp=b._emscripten_bind_btRaycastVehicle_getRigidBody_0=function(){return(Zp=b._emscripten_bind_btRaycastVehicle_getRigidBody_0=b.asm.emscripten_bind_btRaycastVehicle_getRigidBody_0).apply(null,arguments);},$p=b._emscripten_bind_btRaycastVehicle_getWheelInfo_1=function(){return($p=b._emscripten_bind_btRaycastVehicle_getWheelInfo_1=b.asm.emscripten_bind_btRaycastVehicle_getWheelInfo_1).apply(null,arguments);},aq=b._emscripten_bind_btRaycastVehicle_setBrake_2=function(){return(aq=b._emscripten_bind_btRaycastVehicle_setBrake_2=b.asm.emscripten_bind_btRaycastVehicle_setBrake_2).apply(null,arguments);},bq=b._emscripten_bind_btRaycastVehicle_setCoordinateSystem_3=function(){return(bq=b._emscripten_bind_btRaycastVehicle_setCoordinateSystem_3=b.asm.emscripten_bind_btRaycastVehicle_setCoordinateSystem_3).apply(null,arguments);},cq=b._emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0=function(){return(cq=b._emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0=b.asm.emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0).apply(null,arguments);},dq=b._emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0=function(){return(dq=b._emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0=b.asm.emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0).apply(null,arguments);},eq=b._emscripten_bind_btRaycastVehicle_rayCast_1=function(){return(eq=b._emscripten_bind_btRaycastVehicle_rayCast_1=b.asm.emscripten_bind_btRaycastVehicle_rayCast_1).apply(null,arguments);},fq=b._emscripten_bind_btRaycastVehicle_updateVehicle_1=function(){return(fq=b._emscripten_bind_btRaycastVehicle_updateVehicle_1=b.asm.emscripten_bind_btRaycastVehicle_updateVehicle_1).apply(null,arguments);},gq=b._emscripten_bind_btRaycastVehicle_resetSuspension_0=function(){return(gq=b._emscripten_bind_btRaycastVehicle_resetSuspension_0=b.asm.emscripten_bind_btRaycastVehicle_resetSuspension_0).apply(null,arguments);},hq=b._emscripten_bind_btRaycastVehicle_getSteeringValue_1=function(){return(hq=b._emscripten_bind_btRaycastVehicle_getSteeringValue_1=b.asm.emscripten_bind_btRaycastVehicle_getSteeringValue_1).apply(null,arguments);},iq=b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1=function(){return(iq=b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1=b.asm.emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1).apply(null,arguments);},jq=b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2=function(){return(jq=b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2=b.asm.emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2).apply(null,arguments);},kq=b._emscripten_bind_btRaycastVehicle_setPitchControl_1=function(){return(kq=b._emscripten_bind_btRaycastVehicle_setPitchControl_1=b.asm.emscripten_bind_btRaycastVehicle_setPitchControl_1).apply(null,arguments);},lq=b._emscripten_bind_btRaycastVehicle_updateSuspension_1=function(){return(lq=b._emscripten_bind_btRaycastVehicle_updateSuspension_1=b.asm.emscripten_bind_btRaycastVehicle_updateSuspension_1).apply(null,arguments);},mq=b._emscripten_bind_btRaycastVehicle_updateFriction_1=function(){return(mq=b._emscripten_bind_btRaycastVehicle_updateFriction_1=b.asm.emscripten_bind_btRaycastVehicle_updateFriction_1).apply(null,arguments);},nq=b._emscripten_bind_btRaycastVehicle_getRightAxis_0=function(){return(nq=b._emscripten_bind_btRaycastVehicle_getRightAxis_0=b.asm.emscripten_bind_btRaycastVehicle_getRightAxis_0).apply(null,arguments);},oq=b._emscripten_bind_btRaycastVehicle_getUpAxis_0=function(){return(oq=b._emscripten_bind_btRaycastVehicle_getUpAxis_0=b.asm.emscripten_bind_btRaycastVehicle_getUpAxis_0).apply(null,arguments);},pq=b._emscripten_bind_btRaycastVehicle_getForwardAxis_0=function(){return(pq=b._emscripten_bind_btRaycastVehicle_getForwardAxis_0=b.asm.emscripten_bind_btRaycastVehicle_getForwardAxis_0).apply(null,arguments);},qq=b._emscripten_bind_btRaycastVehicle_getForwardVector_0=function(){return(qq=b._emscripten_bind_btRaycastVehicle_getForwardVector_0=b.asm.emscripten_bind_btRaycastVehicle_getForwardVector_0).apply(null,arguments);},rq=b._emscripten_bind_btRaycastVehicle_getUserConstraintType_0=function(){return(rq=b._emscripten_bind_btRaycastVehicle_getUserConstraintType_0=b.asm.emscripten_bind_btRaycastVehicle_getUserConstraintType_0).apply(null,arguments);},sq=b._emscripten_bind_btRaycastVehicle_setUserConstraintType_1=function(){return(sq=b._emscripten_bind_btRaycastVehicle_setUserConstraintType_1=b.asm.emscripten_bind_btRaycastVehicle_setUserConstraintType_1).apply(null,arguments);},tq=b._emscripten_bind_btRaycastVehicle_setUserConstraintId_1=function(){return(tq=b._emscripten_bind_btRaycastVehicle_setUserConstraintId_1=b.asm.emscripten_bind_btRaycastVehicle_setUserConstraintId_1).apply(null,arguments);},uq=b._emscripten_bind_btRaycastVehicle_getUserConstraintId_0=function(){return(uq=b._emscripten_bind_btRaycastVehicle_getUserConstraintId_0=b.asm.emscripten_bind_btRaycastVehicle_getUserConstraintId_0).apply(null,arguments);},vq=b._emscripten_bind_btRaycastVehicle_updateAction_2=function(){return(vq=b._emscripten_bind_btRaycastVehicle_updateAction_2=b.asm.emscripten_bind_btRaycastVehicle_updateAction_2).apply(null,arguments);},wq=b._emscripten_bind_btRaycastVehicle___destroy___0=function(){return(wq=b._emscripten_bind_btRaycastVehicle___destroy___0=b.asm.emscripten_bind_btRaycastVehicle___destroy___0).apply(null,arguments);},xq=b._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1=function(){return(xq=b._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1=b.asm.emscripten_bind_btCylinderShapeX_btCylinderShapeX_1).apply(null,arguments);},yq=b._emscripten_bind_btCylinderShapeX_setMargin_1=function(){return(yq=b._emscripten_bind_btCylinderShapeX_setMargin_1=b.asm.emscripten_bind_btCylinderShapeX_setMargin_1).apply(null,arguments);},zq=b._emscripten_bind_btCylinderShapeX_getMargin_0=function(){return(zq=b._emscripten_bind_btCylinderShapeX_getMargin_0=b.asm.emscripten_bind_btCylinderShapeX_getMargin_0).apply(null,arguments);},Aq=b._emscripten_bind_btCylinderShapeX_setLocalScaling_1=function(){return(Aq=b._emscripten_bind_btCylinderShapeX_setLocalScaling_1=b.asm.emscripten_bind_btCylinderShapeX_setLocalScaling_1).apply(null,arguments);},Bq=b._emscripten_bind_btCylinderShapeX_getLocalScaling_0=function(){return(Bq=b._emscripten_bind_btCylinderShapeX_getLocalScaling_0=b.asm.emscripten_bind_btCylinderShapeX_getLocalScaling_0).apply(null,arguments);},Cq=b._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2=function(){return(Cq=b._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2=b.asm.emscripten_bind_btCylinderShapeX_calculateLocalInertia_2).apply(null,arguments);},Dq=b._emscripten_bind_btCylinderShapeX___destroy___0=function(){return(Dq=b._emscripten_bind_btCylinderShapeX___destroy___0=b.asm.emscripten_bind_btCylinderShapeX___destroy___0).apply(null,arguments);},Eq=b._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1=function(){return(Eq=b._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1=b.asm.emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1).apply(null,arguments);},Fq=b._emscripten_bind_btCylinderShapeZ_setMargin_1=function(){return(Fq=b._emscripten_bind_btCylinderShapeZ_setMargin_1=b.asm.emscripten_bind_btCylinderShapeZ_setMargin_1).apply(null,arguments);},Gq=b._emscripten_bind_btCylinderShapeZ_getMargin_0=function(){return(Gq=b._emscripten_bind_btCylinderShapeZ_getMargin_0=b.asm.emscripten_bind_btCylinderShapeZ_getMargin_0).apply(null,arguments);},Hq=b._emscripten_bind_btCylinderShapeZ_setLocalScaling_1=function(){return(Hq=b._emscripten_bind_btCylinderShapeZ_setLocalScaling_1=b.asm.emscripten_bind_btCylinderShapeZ_setLocalScaling_1).apply(null,arguments);},Iq=b._emscripten_bind_btCylinderShapeZ_getLocalScaling_0=function(){return(Iq=b._emscripten_bind_btCylinderShapeZ_getLocalScaling_0=b.asm.emscripten_bind_btCylinderShapeZ_getLocalScaling_0).apply(null,arguments);},Jq=b._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2=function(){return(Jq=b._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2=b.asm.emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2).apply(null,arguments);},Kq=b._emscripten_bind_btCylinderShapeZ___destroy___0=function(){return(Kq=b._emscripten_bind_btCylinderShapeZ___destroy___0=b.asm.emscripten_bind_btCylinderShapeZ___destroy___0).apply(null,arguments);},Lq=b._emscripten_bind_btConvexPolyhedron_get_m_vertices_0=function(){return(Lq=b._emscripten_bind_btConvexPolyhedron_get_m_vertices_0=b.asm.emscripten_bind_btConvexPolyhedron_get_m_vertices_0).apply(null,arguments);},Mq=b._emscripten_bind_btConvexPolyhedron_set_m_vertices_1=function(){return(Mq=b._emscripten_bind_btConvexPolyhedron_set_m_vertices_1=b.asm.emscripten_bind_btConvexPolyhedron_set_m_vertices_1).apply(null,arguments);},Nq=b._emscripten_bind_btConvexPolyhedron_get_m_faces_0=function(){return(Nq=b._emscripten_bind_btConvexPolyhedron_get_m_faces_0=b.asm.emscripten_bind_btConvexPolyhedron_get_m_faces_0).apply(null,arguments);},Oq=b._emscripten_bind_btConvexPolyhedron_set_m_faces_1=function(){return(Oq=b._emscripten_bind_btConvexPolyhedron_set_m_faces_1=b.asm.emscripten_bind_btConvexPolyhedron_set_m_faces_1).apply(null,arguments);},Pq=b._emscripten_bind_btConvexPolyhedron___destroy___0=function(){return(Pq=b._emscripten_bind_btConvexPolyhedron___destroy___0=b.asm.emscripten_bind_btConvexPolyhedron___destroy___0).apply(null,arguments);},Qq=b._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0=function(){return(Qq=b._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0=b.asm.emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0).apply(null,arguments);},Rq=b._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0=function(){return(Rq=b._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0=b.asm.emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0).apply(null,arguments);},Sq=b._emscripten_bind_tAnchorArray_size_0=function(){return(Sq=b._emscripten_bind_tAnchorArray_size_0=b.asm.emscripten_bind_tAnchorArray_size_0).apply(null,arguments);},Tq=b._emscripten_bind_tAnchorArray_at_1=function(){return(Tq=b._emscripten_bind_tAnchorArray_at_1=b.asm.emscripten_bind_tAnchorArray_at_1).apply(null,arguments);},Uq=b._emscripten_bind_tAnchorArray_clear_0=function(){return(Uq=b._emscripten_bind_tAnchorArray_clear_0=b.asm.emscripten_bind_tAnchorArray_clear_0).apply(null,arguments);},Vq=b._emscripten_bind_tAnchorArray_push_back_1=function(){return(Vq=b._emscripten_bind_tAnchorArray_push_back_1=b.asm.emscripten_bind_tAnchorArray_push_back_1).apply(null,arguments);},Wq=b._emscripten_bind_tAnchorArray_pop_back_0=function(){return(Wq=b._emscripten_bind_tAnchorArray_pop_back_0=b.asm.emscripten_bind_tAnchorArray_pop_back_0).apply(null,arguments);},Xq=b._emscripten_bind_tAnchorArray___destroy___0=function(){return(Xq=b._emscripten_bind_tAnchorArray___destroy___0=b.asm.emscripten_bind_tAnchorArray___destroy___0).apply(null,arguments);},Yq=b._emscripten_bind_RaycastInfo_get_m_contactNormalWS_0=function(){return(Yq=b._emscripten_bind_RaycastInfo_get_m_contactNormalWS_0=b.asm.emscripten_bind_RaycastInfo_get_m_contactNormalWS_0).apply(null,arguments);},Zq=b._emscripten_bind_RaycastInfo_set_m_contactNormalWS_1=function(){return(Zq=b._emscripten_bind_RaycastInfo_set_m_contactNormalWS_1=b.asm.emscripten_bind_RaycastInfo_set_m_contactNormalWS_1).apply(null,arguments);},$q=b._emscripten_bind_RaycastInfo_get_m_contactPointWS_0=function(){return($q=b._emscripten_bind_RaycastInfo_get_m_contactPointWS_0=b.asm.emscripten_bind_RaycastInfo_get_m_contactPointWS_0).apply(null,arguments);},ar=b._emscripten_bind_RaycastInfo_set_m_contactPointWS_1=function(){return(ar=b._emscripten_bind_RaycastInfo_set_m_contactPointWS_1=b.asm.emscripten_bind_RaycastInfo_set_m_contactPointWS_1).apply(null,arguments);},br=b._emscripten_bind_RaycastInfo_get_m_suspensionLength_0=function(){return(br=b._emscripten_bind_RaycastInfo_get_m_suspensionLength_0=b.asm.emscripten_bind_RaycastInfo_get_m_suspensionLength_0).apply(null,arguments);},cr=b._emscripten_bind_RaycastInfo_set_m_suspensionLength_1=function(){return(cr=b._emscripten_bind_RaycastInfo_set_m_suspensionLength_1=b.asm.emscripten_bind_RaycastInfo_set_m_suspensionLength_1).apply(null,arguments);},dr=b._emscripten_bind_RaycastInfo_get_m_hardPointWS_0=function(){return(dr=b._emscripten_bind_RaycastInfo_get_m_hardPointWS_0=b.asm.emscripten_bind_RaycastInfo_get_m_hardPointWS_0).apply(null,arguments);},er=b._emscripten_bind_RaycastInfo_set_m_hardPointWS_1=function(){return(er=b._emscripten_bind_RaycastInfo_set_m_hardPointWS_1=b.asm.emscripten_bind_RaycastInfo_set_m_hardPointWS_1).apply(null,arguments);},fr=b._emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0=function(){return(fr=b._emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0=b.asm.emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0).apply(null,arguments);},gr=b._emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1=function(){return(gr=b._emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1=b.asm.emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1).apply(null,arguments);},hr=b._emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0=function(){return(hr=b._emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0=b.asm.emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0).apply(null,arguments);},ir=b._emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1=function(){return(ir=b._emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1=b.asm.emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1).apply(null,arguments);},jr=b._emscripten_bind_RaycastInfo_get_m_isInContact_0=function(){return(jr=b._emscripten_bind_RaycastInfo_get_m_isInContact_0=b.asm.emscripten_bind_RaycastInfo_get_m_isInContact_0).apply(null,arguments);},kr=b._emscripten_bind_RaycastInfo_set_m_isInContact_1=function(){return(kr=b._emscripten_bind_RaycastInfo_set_m_isInContact_1=b.asm.emscripten_bind_RaycastInfo_set_m_isInContact_1).apply(null,arguments);},lr=b._emscripten_bind_RaycastInfo_get_m_groundObject_0=function(){return(lr=b._emscripten_bind_RaycastInfo_get_m_groundObject_0=b.asm.emscripten_bind_RaycastInfo_get_m_groundObject_0).apply(null,arguments);},mr=b._emscripten_bind_RaycastInfo_set_m_groundObject_1=function(){return(mr=b._emscripten_bind_RaycastInfo_set_m_groundObject_1=b.asm.emscripten_bind_RaycastInfo_set_m_groundObject_1).apply(null,arguments);},nr=b._emscripten_bind_RaycastInfo___destroy___0=function(){return(nr=b._emscripten_bind_RaycastInfo___destroy___0=b.asm.emscripten_bind_RaycastInfo___destroy___0).apply(null,arguments);},or=b._emscripten_bind_btMultiSphereShape_btMultiSphereShape_3=function(){return(or=b._emscripten_bind_btMultiSphereShape_btMultiSphereShape_3=b.asm.emscripten_bind_btMultiSphereShape_btMultiSphereShape_3).apply(null,arguments);},pr=b._emscripten_bind_btMultiSphereShape_setLocalScaling_1=function(){return(pr=b._emscripten_bind_btMultiSphereShape_setLocalScaling_1=b.asm.emscripten_bind_btMultiSphereShape_setLocalScaling_1).apply(null,arguments);},qr=b._emscripten_bind_btMultiSphereShape_getLocalScaling_0=function(){return(qr=b._emscripten_bind_btMultiSphereShape_getLocalScaling_0=b.asm.emscripten_bind_btMultiSphereShape_getLocalScaling_0).apply(null,arguments);},rr=b._emscripten_bind_btMultiSphereShape_calculateLocalInertia_2=function(){return(rr=b._emscripten_bind_btMultiSphereShape_calculateLocalInertia_2=b.asm.emscripten_bind_btMultiSphereShape_calculateLocalInertia_2).apply(null,arguments);},sr=b._emscripten_bind_btMultiSphereShape___destroy___0=function(){return(sr=b._emscripten_bind_btMultiSphereShape___destroy___0=b.asm.emscripten_bind_btMultiSphereShape___destroy___0).apply(null,arguments);},tr=b._emscripten_bind_btSoftBody_btSoftBody_4=function(){return(tr=b._emscripten_bind_btSoftBody_btSoftBody_4=b.asm.emscripten_bind_btSoftBody_btSoftBody_4).apply(null,arguments);},ur=b._emscripten_bind_btSoftBody_checkLink_2=function(){return(ur=b._emscripten_bind_btSoftBody_checkLink_2=b.asm.emscripten_bind_btSoftBody_checkLink_2).apply(null,arguments);},vr=b._emscripten_bind_btSoftBody_checkFace_3=function(){return(vr=b._emscripten_bind_btSoftBody_checkFace_3=b.asm.emscripten_bind_btSoftBody_checkFace_3).apply(null,arguments);},wr=b._emscripten_bind_btSoftBody_appendMaterial_0=function(){return(wr=b._emscripten_bind_btSoftBody_appendMaterial_0=b.asm.emscripten_bind_btSoftBody_appendMaterial_0).apply(null,arguments);},xr=b._emscripten_bind_btSoftBody_appendNode_2=function(){return(xr=b._emscripten_bind_btSoftBody_appendNode_2=b.asm.emscripten_bind_btSoftBody_appendNode_2).apply(null,arguments);},yr=b._emscripten_bind_btSoftBody_appendLink_4=function(){return(yr=b._emscripten_bind_btSoftBody_appendLink_4=b.asm.emscripten_bind_btSoftBody_appendLink_4).apply(null,arguments);},zr=b._emscripten_bind_btSoftBody_appendFace_4=function(){return(zr=b._emscripten_bind_btSoftBody_appendFace_4=b.asm.emscripten_bind_btSoftBody_appendFace_4).apply(null,arguments);},Ar=b._emscripten_bind_btSoftBody_appendTetra_5=function(){return(Ar=b._emscripten_bind_btSoftBody_appendTetra_5=b.asm.emscripten_bind_btSoftBody_appendTetra_5).apply(null,arguments);},Br=b._emscripten_bind_btSoftBody_appendAnchor_4=function(){return(Br=b._emscripten_bind_btSoftBody_appendAnchor_4=b.asm.emscripten_bind_btSoftBody_appendAnchor_4).apply(null,arguments);},Cr=b._emscripten_bind_btSoftBody_addForce_1=function(){return(Cr=b._emscripten_bind_btSoftBody_addForce_1=b.asm.emscripten_bind_btSoftBody_addForce_1).apply(null,arguments);},Dr=b._emscripten_bind_btSoftBody_addForce_2=function(){return(Dr=b._emscripten_bind_btSoftBody_addForce_2=b.asm.emscripten_bind_btSoftBody_addForce_2).apply(null,arguments);},Er=b._emscripten_bind_btSoftBody_addAeroForceToNode_2=function(){return(Er=b._emscripten_bind_btSoftBody_addAeroForceToNode_2=b.asm.emscripten_bind_btSoftBody_addAeroForceToNode_2).apply(null,arguments);},Fr=b._emscripten_bind_btSoftBody_getTotalMass_0=function(){return(Fr=b._emscripten_bind_btSoftBody_getTotalMass_0=b.asm.emscripten_bind_btSoftBody_getTotalMass_0).apply(null,arguments);},Gr=b._emscripten_bind_btSoftBody_setTotalMass_2=function(){return(Gr=b._emscripten_bind_btSoftBody_setTotalMass_2=b.asm.emscripten_bind_btSoftBody_setTotalMass_2).apply(null,arguments);},Hr=b._emscripten_bind_btSoftBody_setMass_2=function(){return(Hr=b._emscripten_bind_btSoftBody_setMass_2=b.asm.emscripten_bind_btSoftBody_setMass_2).apply(null,arguments);},Ir=b._emscripten_bind_btSoftBody_transform_1=function(){return(Ir=b._emscripten_bind_btSoftBody_transform_1=b.asm.emscripten_bind_btSoftBody_transform_1).apply(null,arguments);},Jr=b._emscripten_bind_btSoftBody_translate_1=function(){return(Jr=b._emscripten_bind_btSoftBody_translate_1=b.asm.emscripten_bind_btSoftBody_translate_1).apply(null,arguments);},Kr=b._emscripten_bind_btSoftBody_rotate_1=function(){return(Kr=b._emscripten_bind_btSoftBody_rotate_1=b.asm.emscripten_bind_btSoftBody_rotate_1).apply(null,arguments);},Lr=b._emscripten_bind_btSoftBody_scale_1=function(){return(Lr=b._emscripten_bind_btSoftBody_scale_1=b.asm.emscripten_bind_btSoftBody_scale_1).apply(null,arguments);},Mr=b._emscripten_bind_btSoftBody_generateClusters_1=function(){return(Mr=b._emscripten_bind_btSoftBody_generateClusters_1=b.asm.emscripten_bind_btSoftBody_generateClusters_1).apply(null,arguments);},Nr=b._emscripten_bind_btSoftBody_generateClusters_2=function(){return(Nr=b._emscripten_bind_btSoftBody_generateClusters_2=b.asm.emscripten_bind_btSoftBody_generateClusters_2).apply(null,arguments);},Or=b._emscripten_bind_btSoftBody_generateBendingConstraints_2=function(){return(Or=b._emscripten_bind_btSoftBody_generateBendingConstraints_2=b.asm.emscripten_bind_btSoftBody_generateBendingConstraints_2).apply(null,arguments);},Pr=b._emscripten_bind_btSoftBody_upcast_1=function(){return(Pr=b._emscripten_bind_btSoftBody_upcast_1=b.asm.emscripten_bind_btSoftBody_upcast_1).apply(null,arguments);},Qr=b._emscripten_bind_btSoftBody_setAnisotropicFriction_2=function(){return(Qr=b._emscripten_bind_btSoftBody_setAnisotropicFriction_2=b.asm.emscripten_bind_btSoftBody_setAnisotropicFriction_2).apply(null,arguments);},Rr=b._emscripten_bind_btSoftBody_getCollisionShape_0=function(){return(Rr=b._emscripten_bind_btSoftBody_getCollisionShape_0=b.asm.emscripten_bind_btSoftBody_getCollisionShape_0).apply(null,arguments);},Sr=b._emscripten_bind_btSoftBody_setContactProcessingThreshold_1=function(){return(Sr=b._emscripten_bind_btSoftBody_setContactProcessingThreshold_1=b.asm.emscripten_bind_btSoftBody_setContactProcessingThreshold_1).apply(null,arguments);},Tr=b._emscripten_bind_btSoftBody_setActivationState_1=function(){return(Tr=b._emscripten_bind_btSoftBody_setActivationState_1=b.asm.emscripten_bind_btSoftBody_setActivationState_1).apply(null,arguments);},Ur=b._emscripten_bind_btSoftBody_forceActivationState_1=function(){return(Ur=b._emscripten_bind_btSoftBody_forceActivationState_1=b.asm.emscripten_bind_btSoftBody_forceActivationState_1).apply(null,arguments);},Vr=b._emscripten_bind_btSoftBody_activate_0=function(){return(Vr=b._emscripten_bind_btSoftBody_activate_0=b.asm.emscripten_bind_btSoftBody_activate_0).apply(null,arguments);},Wr=b._emscripten_bind_btSoftBody_activate_1=function(){return(Wr=b._emscripten_bind_btSoftBody_activate_1=b.asm.emscripten_bind_btSoftBody_activate_1).apply(null,arguments);},Xr=b._emscripten_bind_btSoftBody_isActive_0=function(){return(Xr=b._emscripten_bind_btSoftBody_isActive_0=b.asm.emscripten_bind_btSoftBody_isActive_0).apply(null,arguments);},Yr=b._emscripten_bind_btSoftBody_isKinematicObject_0=function(){return(Yr=b._emscripten_bind_btSoftBody_isKinematicObject_0=b.asm.emscripten_bind_btSoftBody_isKinematicObject_0).apply(null,arguments);},Zr=b._emscripten_bind_btSoftBody_isStaticObject_0=function(){return(Zr=b._emscripten_bind_btSoftBody_isStaticObject_0=b.asm.emscripten_bind_btSoftBody_isStaticObject_0).apply(null,arguments);},$r=b._emscripten_bind_btSoftBody_isStaticOrKinematicObject_0=function(){return($r=b._emscripten_bind_btSoftBody_isStaticOrKinematicObject_0=b.asm.emscripten_bind_btSoftBody_isStaticOrKinematicObject_0).apply(null,arguments);},as=b._emscripten_bind_btSoftBody_getRestitution_0=function(){return(as=b._emscripten_bind_btSoftBody_getRestitution_0=b.asm.emscripten_bind_btSoftBody_getRestitution_0).apply(null,arguments);},bs=b._emscripten_bind_btSoftBody_getFriction_0=function(){return(bs=b._emscripten_bind_btSoftBody_getFriction_0=b.asm.emscripten_bind_btSoftBody_getFriction_0).apply(null,arguments);},cs=b._emscripten_bind_btSoftBody_getRollingFriction_0=function(){return(cs=b._emscripten_bind_btSoftBody_getRollingFriction_0=b.asm.emscripten_bind_btSoftBody_getRollingFriction_0).apply(null,arguments);},ds=b._emscripten_bind_btSoftBody_setRestitution_1=function(){return(ds=b._emscripten_bind_btSoftBody_setRestitution_1=b.asm.emscripten_bind_btSoftBody_setRestitution_1).apply(null,arguments);},es=b._emscripten_bind_btSoftBody_setFriction_1=function(){return(es=b._emscripten_bind_btSoftBody_setFriction_1=b.asm.emscripten_bind_btSoftBody_setFriction_1).apply(null,arguments);},gs=b._emscripten_bind_btSoftBody_setRollingFriction_1=function(){return(gs=b._emscripten_bind_btSoftBody_setRollingFriction_1=b.asm.emscripten_bind_btSoftBody_setRollingFriction_1).apply(null,arguments);},hs=b._emscripten_bind_btSoftBody_getWorldTransform_0=function(){return(hs=b._emscripten_bind_btSoftBody_getWorldTransform_0=b.asm.emscripten_bind_btSoftBody_getWorldTransform_0).apply(null,arguments);},is=b._emscripten_bind_btSoftBody_getCollisionFlags_0=function(){return(is=b._emscripten_bind_btSoftBody_getCollisionFlags_0=b.asm.emscripten_bind_btSoftBody_getCollisionFlags_0).apply(null,arguments);},js=b._emscripten_bind_btSoftBody_setCollisionFlags_1=function(){return(js=b._emscripten_bind_btSoftBody_setCollisionFlags_1=b.asm.emscripten_bind_btSoftBody_setCollisionFlags_1).apply(null,arguments);},ks=b._emscripten_bind_btSoftBody_setWorldTransform_1=function(){return(ks=b._emscripten_bind_btSoftBody_setWorldTransform_1=b.asm.emscripten_bind_btSoftBody_setWorldTransform_1).apply(null,arguments);},ls=b._emscripten_bind_btSoftBody_setCollisionShape_1=function(){return(ls=b._emscripten_bind_btSoftBody_setCollisionShape_1=b.asm.emscripten_bind_btSoftBody_setCollisionShape_1).apply(null,arguments);},ms=b._emscripten_bind_btSoftBody_setCcdMotionThreshold_1=function(){return(ms=b._emscripten_bind_btSoftBody_setCcdMotionThreshold_1=b.asm.emscripten_bind_btSoftBody_setCcdMotionThreshold_1).apply(null,arguments);},ns=b._emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1=function(){return(ns=b._emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1=b.asm.emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1).apply(null,arguments);},ps=b._emscripten_bind_btSoftBody_getUserIndex_0=function(){return(ps=b._emscripten_bind_btSoftBody_getUserIndex_0=b.asm.emscripten_bind_btSoftBody_getUserIndex_0).apply(null,arguments);},qs=b._emscripten_bind_btSoftBody_setUserIndex_1=function(){return(qs=b._emscripten_bind_btSoftBody_setUserIndex_1=b.asm.emscripten_bind_btSoftBody_setUserIndex_1).apply(null,arguments);},rs=b._emscripten_bind_btSoftBody_getUserPointer_0=function(){return(rs=b._emscripten_bind_btSoftBody_getUserPointer_0=b.asm.emscripten_bind_btSoftBody_getUserPointer_0).apply(null,arguments);},ss=b._emscripten_bind_btSoftBody_setUserPointer_1=function(){return(ss=b._emscripten_bind_btSoftBody_setUserPointer_1=b.asm.emscripten_bind_btSoftBody_setUserPointer_1).apply(null,arguments);},ts=b._emscripten_bind_btSoftBody_getBroadphaseHandle_0=function(){return(ts=b._emscripten_bind_btSoftBody_getBroadphaseHandle_0=b.asm.emscripten_bind_btSoftBody_getBroadphaseHandle_0).apply(null,arguments);},us=b._emscripten_bind_btSoftBody_get_m_cfg_0=function(){return(us=b._emscripten_bind_btSoftBody_get_m_cfg_0=b.asm.emscripten_bind_btSoftBody_get_m_cfg_0).apply(null,arguments);},vs=b._emscripten_bind_btSoftBody_set_m_cfg_1=function(){return(vs=b._emscripten_bind_btSoftBody_set_m_cfg_1=b.asm.emscripten_bind_btSoftBody_set_m_cfg_1).apply(null,arguments);},xs=b._emscripten_bind_btSoftBody_get_m_nodes_0=function(){return(xs=b._emscripten_bind_btSoftBody_get_m_nodes_0=b.asm.emscripten_bind_btSoftBody_get_m_nodes_0).apply(null,arguments);},ys=b._emscripten_bind_btSoftBody_set_m_nodes_1=function(){return(ys=b._emscripten_bind_btSoftBody_set_m_nodes_1=b.asm.emscripten_bind_btSoftBody_set_m_nodes_1).apply(null,arguments);},zs=b._emscripten_bind_btSoftBody_get_m_faces_0=function(){return(zs=b._emscripten_bind_btSoftBody_get_m_faces_0=b.asm.emscripten_bind_btSoftBody_get_m_faces_0).apply(null,arguments);},As=b._emscripten_bind_btSoftBody_set_m_faces_1=function(){return(As=b._emscripten_bind_btSoftBody_set_m_faces_1=b.asm.emscripten_bind_btSoftBody_set_m_faces_1).apply(null,arguments);},Bs=b._emscripten_bind_btSoftBody_get_m_materials_0=function(){return(Bs=b._emscripten_bind_btSoftBody_get_m_materials_0=b.asm.emscripten_bind_btSoftBody_get_m_materials_0).apply(null,arguments);},Cs=b._emscripten_bind_btSoftBody_set_m_materials_1=function(){return(Cs=b._emscripten_bind_btSoftBody_set_m_materials_1=b.asm.emscripten_bind_btSoftBody_set_m_materials_1).apply(null,arguments);},Ds=b._emscripten_bind_btSoftBody_get_m_anchors_0=function(){return(Ds=b._emscripten_bind_btSoftBody_get_m_anchors_0=b.asm.emscripten_bind_btSoftBody_get_m_anchors_0).apply(null,arguments);},Es=b._emscripten_bind_btSoftBody_set_m_anchors_1=function(){return(Es=b._emscripten_bind_btSoftBody_set_m_anchors_1=b.asm.emscripten_bind_btSoftBody_set_m_anchors_1).apply(null,arguments);},Fs=b._emscripten_bind_btSoftBody___destroy___0=function(){return(Fs=b._emscripten_bind_btSoftBody___destroy___0=b.asm.emscripten_bind_btSoftBody___destroy___0).apply(null,arguments);},Gs=b._emscripten_bind_btIntArray_size_0=function(){return(Gs=b._emscripten_bind_btIntArray_size_0=b.asm.emscripten_bind_btIntArray_size_0).apply(null,arguments);},Hs=b._emscripten_bind_btIntArray_at_1=function(){return(Hs=b._emscripten_bind_btIntArray_at_1=b.asm.emscripten_bind_btIntArray_at_1).apply(null,arguments);},Is=b._emscripten_bind_btIntArray___destroy___0=function(){return(Is=b._emscripten_bind_btIntArray___destroy___0=b.asm.emscripten_bind_btIntArray___destroy___0).apply(null,arguments);},Js=b._emscripten_bind_Config_get_kVCF_0=function(){return(Js=b._emscripten_bind_Config_get_kVCF_0=b.asm.emscripten_bind_Config_get_kVCF_0).apply(null,arguments);},Ks=b._emscripten_bind_Config_set_kVCF_1=function(){return(Ks=b._emscripten_bind_Config_set_kVCF_1=b.asm.emscripten_bind_Config_set_kVCF_1).apply(null,arguments);},Ls=b._emscripten_bind_Config_get_kDP_0=function(){return(Ls=b._emscripten_bind_Config_get_kDP_0=b.asm.emscripten_bind_Config_get_kDP_0).apply(null,arguments);},Ms=b._emscripten_bind_Config_set_kDP_1=function(){return(Ms=b._emscripten_bind_Config_set_kDP_1=b.asm.emscripten_bind_Config_set_kDP_1).apply(null,arguments);},Ns=b._emscripten_bind_Config_get_kDG_0=function(){return(Ns=b._emscripten_bind_Config_get_kDG_0=b.asm.emscripten_bind_Config_get_kDG_0).apply(null,arguments);},Os=b._emscripten_bind_Config_set_kDG_1=function(){return(Os=b._emscripten_bind_Config_set_kDG_1=b.asm.emscripten_bind_Config_set_kDG_1).apply(null,arguments);},Ps=b._emscripten_bind_Config_get_kLF_0=function(){return(Ps=b._emscripten_bind_Config_get_kLF_0=b.asm.emscripten_bind_Config_get_kLF_0).apply(null,arguments);},Qs=b._emscripten_bind_Config_set_kLF_1=function(){return(Qs=b._emscripten_bind_Config_set_kLF_1=b.asm.emscripten_bind_Config_set_kLF_1).apply(null,arguments);},Rs=b._emscripten_bind_Config_get_kPR_0=function(){return(Rs=b._emscripten_bind_Config_get_kPR_0=b.asm.emscripten_bind_Config_get_kPR_0).apply(null,arguments);},Ss=b._emscripten_bind_Config_set_kPR_1=function(){return(Ss=b._emscripten_bind_Config_set_kPR_1=b.asm.emscripten_bind_Config_set_kPR_1).apply(null,arguments);},Ts=b._emscripten_bind_Config_get_kVC_0=function(){return(Ts=b._emscripten_bind_Config_get_kVC_0=b.asm.emscripten_bind_Config_get_kVC_0).apply(null,arguments);},Us=b._emscripten_bind_Config_set_kVC_1=function(){return(Us=b._emscripten_bind_Config_set_kVC_1=b.asm.emscripten_bind_Config_set_kVC_1).apply(null,arguments);},Vs=b._emscripten_bind_Config_get_kDF_0=function(){return(Vs=b._emscripten_bind_Config_get_kDF_0=b.asm.emscripten_bind_Config_get_kDF_0).apply(null,arguments);},Ws=b._emscripten_bind_Config_set_kDF_1=function(){return(Ws=b._emscripten_bind_Config_set_kDF_1=b.asm.emscripten_bind_Config_set_kDF_1).apply(null,arguments);},Xs=b._emscripten_bind_Config_get_kMT_0=function(){return(Xs=b._emscripten_bind_Config_get_kMT_0=b.asm.emscripten_bind_Config_get_kMT_0).apply(null,arguments);},Ys=b._emscripten_bind_Config_set_kMT_1=function(){return(Ys=b._emscripten_bind_Config_set_kMT_1=b.asm.emscripten_bind_Config_set_kMT_1).apply(null,arguments);},Zs=b._emscripten_bind_Config_get_kCHR_0=function(){return(Zs=b._emscripten_bind_Config_get_kCHR_0=b.asm.emscripten_bind_Config_get_kCHR_0).apply(null,arguments);},$s=b._emscripten_bind_Config_set_kCHR_1=function(){return($s=b._emscripten_bind_Config_set_kCHR_1=b.asm.emscripten_bind_Config_set_kCHR_1).apply(null,arguments);},at=b._emscripten_bind_Config_get_kKHR_0=function(){return(at=b._emscripten_bind_Config_get_kKHR_0=b.asm.emscripten_bind_Config_get_kKHR_0).apply(null,arguments);},bt=b._emscripten_bind_Config_set_kKHR_1=function(){return(bt=b._emscripten_bind_Config_set_kKHR_1=b.asm.emscripten_bind_Config_set_kKHR_1).apply(null,arguments);},ct=b._emscripten_bind_Config_get_kSHR_0=function(){return(ct=b._emscripten_bind_Config_get_kSHR_0=b.asm.emscripten_bind_Config_get_kSHR_0).apply(null,arguments);},dt=b._emscripten_bind_Config_set_kSHR_1=function(){return(dt=b._emscripten_bind_Config_set_kSHR_1=b.asm.emscripten_bind_Config_set_kSHR_1).apply(null,arguments);},et=b._emscripten_bind_Config_get_kAHR_0=function(){return(et=b._emscripten_bind_Config_get_kAHR_0=b.asm.emscripten_bind_Config_get_kAHR_0).apply(null,arguments);},ft=b._emscripten_bind_Config_set_kAHR_1=function(){return(ft=b._emscripten_bind_Config_set_kAHR_1=b.asm.emscripten_bind_Config_set_kAHR_1).apply(null,arguments);},gt=b._emscripten_bind_Config_get_kSRHR_CL_0=function(){return(gt=b._emscripten_bind_Config_get_kSRHR_CL_0=b.asm.emscripten_bind_Config_get_kSRHR_CL_0).apply(null,arguments);},ht=b._emscripten_bind_Config_set_kSRHR_CL_1=function(){return(ht=b._emscripten_bind_Config_set_kSRHR_CL_1=b.asm.emscripten_bind_Config_set_kSRHR_CL_1).apply(null,arguments);},it=b._emscripten_bind_Config_get_kSKHR_CL_0=function(){return(it=b._emscripten_bind_Config_get_kSKHR_CL_0=b.asm.emscripten_bind_Config_get_kSKHR_CL_0).apply(null,arguments);},jt=b._emscripten_bind_Config_set_kSKHR_CL_1=function(){return(jt=b._emscripten_bind_Config_set_kSKHR_CL_1=b.asm.emscripten_bind_Config_set_kSKHR_CL_1).apply(null,arguments);},kt=b._emscripten_bind_Config_get_kSSHR_CL_0=function(){return(kt=b._emscripten_bind_Config_get_kSSHR_CL_0=b.asm.emscripten_bind_Config_get_kSSHR_CL_0).apply(null,arguments);},lt=b._emscripten_bind_Config_set_kSSHR_CL_1=function(){return(lt=b._emscripten_bind_Config_set_kSSHR_CL_1=b.asm.emscripten_bind_Config_set_kSSHR_CL_1).apply(null,arguments);},mt=b._emscripten_bind_Config_get_kSR_SPLT_CL_0=function(){return(mt=b._emscripten_bind_Config_get_kSR_SPLT_CL_0=b.asm.emscripten_bind_Config_get_kSR_SPLT_CL_0).apply(null,arguments);},nt=b._emscripten_bind_Config_set_kSR_SPLT_CL_1=function(){return(nt=b._emscripten_bind_Config_set_kSR_SPLT_CL_1=b.asm.emscripten_bind_Config_set_kSR_SPLT_CL_1).apply(null,arguments);},ot=b._emscripten_bind_Config_get_kSK_SPLT_CL_0=function(){return(ot=b._emscripten_bind_Config_get_kSK_SPLT_CL_0=b.asm.emscripten_bind_Config_get_kSK_SPLT_CL_0).apply(null,arguments);},pt=b._emscripten_bind_Config_set_kSK_SPLT_CL_1=function(){return(pt=b._emscripten_bind_Config_set_kSK_SPLT_CL_1=b.asm.emscripten_bind_Config_set_kSK_SPLT_CL_1).apply(null,arguments);},qt=b._emscripten_bind_Config_get_kSS_SPLT_CL_0=function(){return(qt=b._emscripten_bind_Config_get_kSS_SPLT_CL_0=b.asm.emscripten_bind_Config_get_kSS_SPLT_CL_0).apply(null,arguments);},rt=b._emscripten_bind_Config_set_kSS_SPLT_CL_1=function(){return(rt=b._emscripten_bind_Config_set_kSS_SPLT_CL_1=b.asm.emscripten_bind_Config_set_kSS_SPLT_CL_1).apply(null,arguments);},st=b._emscripten_bind_Config_get_maxvolume_0=function(){return(st=b._emscripten_bind_Config_get_maxvolume_0=b.asm.emscripten_bind_Config_get_maxvolume_0).apply(null,arguments);},tt=b._emscripten_bind_Config_set_maxvolume_1=function(){return(tt=b._emscripten_bind_Config_set_maxvolume_1=b.asm.emscripten_bind_Config_set_maxvolume_1).apply(null,arguments);},ut=b._emscripten_bind_Config_get_timescale_0=function(){return(ut=b._emscripten_bind_Config_get_timescale_0=b.asm.emscripten_bind_Config_get_timescale_0).apply(null,arguments);},vt=b._emscripten_bind_Config_set_timescale_1=function(){return(vt=b._emscripten_bind_Config_set_timescale_1=b.asm.emscripten_bind_Config_set_timescale_1).apply(null,arguments);},wt=b._emscripten_bind_Config_get_viterations_0=function(){return(wt=b._emscripten_bind_Config_get_viterations_0=b.asm.emscripten_bind_Config_get_viterations_0).apply(null,arguments);},xt=b._emscripten_bind_Config_set_viterations_1=function(){return(xt=b._emscripten_bind_Config_set_viterations_1=b.asm.emscripten_bind_Config_set_viterations_1).apply(null,arguments);},yt=b._emscripten_bind_Config_get_piterations_0=function(){return(yt=b._emscripten_bind_Config_get_piterations_0=b.asm.emscripten_bind_Config_get_piterations_0).apply(null,arguments);},zt=b._emscripten_bind_Config_set_piterations_1=function(){return(zt=b._emscripten_bind_Config_set_piterations_1=b.asm.emscripten_bind_Config_set_piterations_1).apply(null,arguments);},At=b._emscripten_bind_Config_get_diterations_0=function(){return(At=b._emscripten_bind_Config_get_diterations_0=b.asm.emscripten_bind_Config_get_diterations_0).apply(null,arguments);},Bt=b._emscripten_bind_Config_set_diterations_1=function(){return(Bt=b._emscripten_bind_Config_set_diterations_1=b.asm.emscripten_bind_Config_set_diterations_1).apply(null,arguments);},Ct=b._emscripten_bind_Config_get_citerations_0=function(){return(Ct=b._emscripten_bind_Config_get_citerations_0=b.asm.emscripten_bind_Config_get_citerations_0).apply(null,arguments);},Dt=b._emscripten_bind_Config_set_citerations_1=function(){return(Dt=b._emscripten_bind_Config_set_citerations_1=b.asm.emscripten_bind_Config_set_citerations_1).apply(null,arguments);},Et=b._emscripten_bind_Config_get_collisions_0=function(){return(Et=b._emscripten_bind_Config_get_collisions_0=b.asm.emscripten_bind_Config_get_collisions_0).apply(null,arguments);},Ft=b._emscripten_bind_Config_set_collisions_1=function(){return(Ft=b._emscripten_bind_Config_set_collisions_1=b.asm.emscripten_bind_Config_set_collisions_1).apply(null,arguments);},Gt=b._emscripten_bind_Config___destroy___0=function(){return(Gt=b._emscripten_bind_Config___destroy___0=b.asm.emscripten_bind_Config___destroy___0).apply(null,arguments);},Ht=b._emscripten_bind_Node_get_m_x_0=function(){return(Ht=b._emscripten_bind_Node_get_m_x_0=b.asm.emscripten_bind_Node_get_m_x_0).apply(null,arguments);},It=b._emscripten_bind_Node_set_m_x_1=function(){return(It=b._emscripten_bind_Node_set_m_x_1=b.asm.emscripten_bind_Node_set_m_x_1).apply(null,arguments);},Jt=b._emscripten_bind_Node_get_m_q_0=function(){return(Jt=b._emscripten_bind_Node_get_m_q_0=b.asm.emscripten_bind_Node_get_m_q_0).apply(null,arguments);},Kt=b._emscripten_bind_Node_set_m_q_1=function(){return(Kt=b._emscripten_bind_Node_set_m_q_1=b.asm.emscripten_bind_Node_set_m_q_1).apply(null,arguments);},Lt=b._emscripten_bind_Node_get_m_v_0=function(){return(Lt=b._emscripten_bind_Node_get_m_v_0=b.asm.emscripten_bind_Node_get_m_v_0).apply(null,arguments);},Mt=b._emscripten_bind_Node_set_m_v_1=function(){return(Mt=b._emscripten_bind_Node_set_m_v_1=b.asm.emscripten_bind_Node_set_m_v_1).apply(null,arguments);},Nt=b._emscripten_bind_Node_get_m_f_0=function(){return(Nt=b._emscripten_bind_Node_get_m_f_0=b.asm.emscripten_bind_Node_get_m_f_0).apply(null,arguments);},Ot=b._emscripten_bind_Node_set_m_f_1=function(){return(Ot=b._emscripten_bind_Node_set_m_f_1=b.asm.emscripten_bind_Node_set_m_f_1).apply(null,arguments);},Pt=b._emscripten_bind_Node_get_m_n_0=function(){return(Pt=b._emscripten_bind_Node_get_m_n_0=b.asm.emscripten_bind_Node_get_m_n_0).apply(null,arguments);},Qt=b._emscripten_bind_Node_set_m_n_1=function(){return(Qt=b._emscripten_bind_Node_set_m_n_1=b.asm.emscripten_bind_Node_set_m_n_1).apply(null,arguments);},Rt=b._emscripten_bind_Node_get_m_im_0=function(){return(Rt=b._emscripten_bind_Node_get_m_im_0=b.asm.emscripten_bind_Node_get_m_im_0).apply(null,arguments);},St=b._emscripten_bind_Node_set_m_im_1=function(){return(St=b._emscripten_bind_Node_set_m_im_1=b.asm.emscripten_bind_Node_set_m_im_1).apply(null,arguments);},Tt=b._emscripten_bind_Node_get_m_area_0=function(){return(Tt=b._emscripten_bind_Node_get_m_area_0=b.asm.emscripten_bind_Node_get_m_area_0).apply(null,arguments);},Ut=b._emscripten_bind_Node_set_m_area_1=function(){return(Ut=b._emscripten_bind_Node_set_m_area_1=b.asm.emscripten_bind_Node_set_m_area_1).apply(null,arguments);},Vt=b._emscripten_bind_Node___destroy___0=function(){return(Vt=b._emscripten_bind_Node___destroy___0=b.asm.emscripten_bind_Node___destroy___0).apply(null,arguments);},Wt=b._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0=function(){return(Wt=b._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0=b.asm.emscripten_bind_btGhostPairCallback_btGhostPairCallback_0).apply(null,arguments);},Xt=b._emscripten_bind_btGhostPairCallback___destroy___0=function(){return(Xt=b._emscripten_bind_btGhostPairCallback___destroy___0=b.asm.emscripten_bind_btGhostPairCallback___destroy___0).apply(null,arguments);},Yt=b._emscripten_bind_btOverlappingPairCallback___destroy___0=function(){return(Yt=b._emscripten_bind_btOverlappingPairCallback___destroy___0=b.asm.emscripten_bind_btOverlappingPairCallback___destroy___0).apply(null,arguments);},Zt=b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3=function(){return(Zt=b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3=b.asm.emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3).apply(null,arguments);},$t=b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4=function(){return($t=b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4=b.asm.emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4).apply(null,arguments);},au=b._emscripten_bind_btKinematicCharacterController_setUpAxis_1=function(){return(au=b._emscripten_bind_btKinematicCharacterController_setUpAxis_1=b.asm.emscripten_bind_btKinematicCharacterController_setUpAxis_1).apply(null,arguments);},bu=b._emscripten_bind_btKinematicCharacterController_setWalkDirection_1=function(){return(bu=b._emscripten_bind_btKinematicCharacterController_setWalkDirection_1=b.asm.emscripten_bind_btKinematicCharacterController_setWalkDirection_1).apply(null,arguments);},cu=b._emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2=function(){return(cu=b._emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2=b.asm.emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2).apply(null,arguments);},du=b._emscripten_bind_btKinematicCharacterController_warp_1=function(){return(du=b._emscripten_bind_btKinematicCharacterController_warp_1=b.asm.emscripten_bind_btKinematicCharacterController_warp_1).apply(null,arguments);},eu=b._emscripten_bind_btKinematicCharacterController_preStep_1=function(){return(eu=b._emscripten_bind_btKinematicCharacterController_preStep_1=b.asm.emscripten_bind_btKinematicCharacterController_preStep_1).apply(null,arguments);},fu=b._emscripten_bind_btKinematicCharacterController_playerStep_2=function(){return(fu=b._emscripten_bind_btKinematicCharacterController_playerStep_2=b.asm.emscripten_bind_btKinematicCharacterController_playerStep_2).apply(null,arguments);},gu=b._emscripten_bind_btKinematicCharacterController_setFallSpeed_1=function(){return(gu=b._emscripten_bind_btKinematicCharacterController_setFallSpeed_1=b.asm.emscripten_bind_btKinematicCharacterController_setFallSpeed_1).apply(null,arguments);},hu=b._emscripten_bind_btKinematicCharacterController_setJumpSpeed_1=function(){return(hu=b._emscripten_bind_btKinematicCharacterController_setJumpSpeed_1=b.asm.emscripten_bind_btKinematicCharacterController_setJumpSpeed_1).apply(null,arguments);},iu=b._emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1=function(){return(iu=b._emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1=b.asm.emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1).apply(null,arguments);},ju=b._emscripten_bind_btKinematicCharacterController_canJump_0=function(){return(ju=b._emscripten_bind_btKinematicCharacterController_canJump_0=b.asm.emscripten_bind_btKinematicCharacterController_canJump_0).apply(null,arguments);},ku=b._emscripten_bind_btKinematicCharacterController_jump_0=function(){return(ku=b._emscripten_bind_btKinematicCharacterController_jump_0=b.asm.emscripten_bind_btKinematicCharacterController_jump_0).apply(null,arguments);},lu=b._emscripten_bind_btKinematicCharacterController_setGravity_1=function(){return(lu=b._emscripten_bind_btKinematicCharacterController_setGravity_1=b.asm.emscripten_bind_btKinematicCharacterController_setGravity_1).apply(null,arguments);},mu=b._emscripten_bind_btKinematicCharacterController_getGravity_0=function(){return(mu=b._emscripten_bind_btKinematicCharacterController_getGravity_0=b.asm.emscripten_bind_btKinematicCharacterController_getGravity_0).apply(null,arguments);},nu=b._emscripten_bind_btKinematicCharacterController_setMaxSlope_1=function(){return(nu=b._emscripten_bind_btKinematicCharacterController_setMaxSlope_1=b.asm.emscripten_bind_btKinematicCharacterController_setMaxSlope_1).apply(null,arguments);},ou=b._emscripten_bind_btKinematicCharacterController_getMaxSlope_0=function(){return(ou=b._emscripten_bind_btKinematicCharacterController_getMaxSlope_0=b.asm.emscripten_bind_btKinematicCharacterController_getMaxSlope_0).apply(null,arguments);},pu=b._emscripten_bind_btKinematicCharacterController_getGhostObject_0=function(){return(pu=b._emscripten_bind_btKinematicCharacterController_getGhostObject_0=b.asm.emscripten_bind_btKinematicCharacterController_getGhostObject_0).apply(null,arguments);},qu=b._emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1=function(){return(qu=b._emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1=b.asm.emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1).apply(null,arguments);},ru=b._emscripten_bind_btKinematicCharacterController_onGround_0=function(){return(ru=b._emscripten_bind_btKinematicCharacterController_onGround_0=b.asm.emscripten_bind_btKinematicCharacterController_onGround_0).apply(null,arguments);},su=b._emscripten_bind_btKinematicCharacterController_setUpInterpolate_1=function(){return(su=b._emscripten_bind_btKinematicCharacterController_setUpInterpolate_1=b.asm.emscripten_bind_btKinematicCharacterController_setUpInterpolate_1).apply(null,arguments);},tu=b._emscripten_bind_btKinematicCharacterController_updateAction_2=function(){return(tu=b._emscripten_bind_btKinematicCharacterController_updateAction_2=b.asm.emscripten_bind_btKinematicCharacterController_updateAction_2).apply(null,arguments);},uu=b._emscripten_bind_btKinematicCharacterController___destroy___0=function(){return(uu=b._emscripten_bind_btKinematicCharacterController___destroy___0=b.asm.emscripten_bind_btKinematicCharacterController___destroy___0).apply(null,arguments);},vu=b._emscripten_bind_btSoftBodyArray_size_0=function(){return(vu=b._emscripten_bind_btSoftBodyArray_size_0=b.asm.emscripten_bind_btSoftBodyArray_size_0).apply(null,arguments);},wu=b._emscripten_bind_btSoftBodyArray_at_1=function(){return(wu=b._emscripten_bind_btSoftBodyArray_at_1=b.asm.emscripten_bind_btSoftBodyArray_at_1).apply(null,arguments);},xu=b._emscripten_bind_btSoftBodyArray___destroy___0=function(){return(xu=b._emscripten_bind_btSoftBodyArray___destroy___0=b.asm.emscripten_bind_btSoftBodyArray___destroy___0).apply(null,arguments);},yu=b._emscripten_bind_btFaceArray_size_0=function(){return(yu=b._emscripten_bind_btFaceArray_size_0=b.asm.emscripten_bind_btFaceArray_size_0).apply(null,arguments);},zu=b._emscripten_bind_btFaceArray_at_1=function(){return(zu=b._emscripten_bind_btFaceArray_at_1=b.asm.emscripten_bind_btFaceArray_at_1).apply(null,arguments);},Au=b._emscripten_bind_btFaceArray___destroy___0=function(){return(Au=b._emscripten_bind_btFaceArray___destroy___0=b.asm.emscripten_bind_btFaceArray___destroy___0).apply(null,arguments);},Bu=b._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2=function(){return(Bu=b._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2=b.asm.emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2).apply(null,arguments);},Cu=b._emscripten_bind_btStaticPlaneShape_setLocalScaling_1=function(){return(Cu=b._emscripten_bind_btStaticPlaneShape_setLocalScaling_1=b.asm.emscripten_bind_btStaticPlaneShape_setLocalScaling_1).apply(null,arguments);},Du=b._emscripten_bind_btStaticPlaneShape_getLocalScaling_0=function(){return(Du=b._emscripten_bind_btStaticPlaneShape_getLocalScaling_0=b.asm.emscripten_bind_btStaticPlaneShape_getLocalScaling_0).apply(null,arguments);},Eu=b._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2=function(){return(Eu=b._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2=b.asm.emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2).apply(null,arguments);},Fu=b._emscripten_bind_btStaticPlaneShape___destroy___0=function(){return(Fu=b._emscripten_bind_btStaticPlaneShape___destroy___0=b.asm.emscripten_bind_btStaticPlaneShape___destroy___0).apply(null,arguments);},Gu=b._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1=function(){return(Gu=b._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1=b.asm.emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1).apply(null,arguments);},Hu=b._emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0=function(){return(Hu=b._emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0=b.asm.emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0).apply(null,arguments);},Iu=b._emscripten_bind_btOverlappingPairCache___destroy___0=function(){return(Iu=b._emscripten_bind_btOverlappingPairCache___destroy___0=b.asm.emscripten_bind_btOverlappingPairCache___destroy___0).apply(null,arguments);},Ju=b._emscripten_bind_btIndexedMesh_get_m_numTriangles_0=function(){return(Ju=b._emscripten_bind_btIndexedMesh_get_m_numTriangles_0=b.asm.emscripten_bind_btIndexedMesh_get_m_numTriangles_0).apply(null,arguments);},Ku=b._emscripten_bind_btIndexedMesh_set_m_numTriangles_1=function(){return(Ku=b._emscripten_bind_btIndexedMesh_set_m_numTriangles_1=b.asm.emscripten_bind_btIndexedMesh_set_m_numTriangles_1).apply(null,arguments);},Lu=b._emscripten_bind_btIndexedMesh___destroy___0=function(){return(Lu=b._emscripten_bind_btIndexedMesh___destroy___0=b.asm.emscripten_bind_btIndexedMesh___destroy___0).apply(null,arguments);},Mu=b._emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5=function(){return(Mu=b._emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5).apply(null,arguments);},Nu=b._emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3=function(){return(Nu=b._emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3).apply(null,arguments);},Ou=b._emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1=function(){return(Ou=b._emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1).apply(null,arguments);},Pu=b._emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1=function(){return(Pu=b._emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1).apply(null,arguments);},Qu=b._emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0=function(){return(Qu=b._emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0).apply(null,arguments);},Ru=b._emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0=function(){return(Ru=b._emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0).apply(null,arguments);},Su=b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0=function(){return(Su=b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0).apply(null,arguments);},Tu=b._emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3=function(){return(Tu=b._emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3).apply(null,arguments);},Uu=b._emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0=function(){return(Uu=b._emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0).apply(null,arguments);},Vu=b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0=function(){return(Vu=b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0).apply(null,arguments);},Wu=b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1=function(){return(Wu=b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1).apply(null,arguments);},Xu=b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2=function(){return(Xu=b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2).apply(null,arguments);},Yu=b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3=function(){return(Yu=b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3).apply(null,arguments);},Zu=b._emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0=function(){return(Zu=b._emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0).apply(null,arguments);},$u=b._emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5=function(){return($u=b._emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5).apply(null,arguments);},av=b._emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3=function(){return(av=b._emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3).apply(null,arguments);},bv=b._emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2=function(){return(bv=b._emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2).apply(null,arguments);},cv=b._emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1=function(){return(cv=b._emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1).apply(null,arguments);},dv=b._emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1=function(){return(dv=b._emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1).apply(null,arguments);},ev=b._emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0=function(){return(ev=b._emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0).apply(null,arguments);},fv=b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0=function(){return(fv=b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0).apply(null,arguments);},gv=b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3=function(){return(gv=b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3).apply(null,arguments);},hv=b._emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1=function(){return(hv=b._emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1).apply(null,arguments);},iv=b._emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0=function(){return(iv=b._emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0).apply(null,arguments);},jv=b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1=function(){return(jv=b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1).apply(null,arguments);},kv=b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3=function(){return(kv=b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3).apply(null,arguments);},lv=b._emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1=function(){return(lv=b._emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1).apply(null,arguments);},mv=b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1=function(){return(mv=b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1).apply(null,arguments);},nv=b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2=function(){return(nv=b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2).apply(null,arguments);},ov=b._emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1=function(){return(ov=b._emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1).apply(null,arguments);},pv=b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1=function(){return(pv=b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1).apply(null,arguments);},qv=b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2=function(){return(qv=b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2).apply(null,arguments);},rv=b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3=function(){return(rv=b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3).apply(null,arguments);},sv=b._emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1=function(){return(sv=b._emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1).apply(null,arguments);},tv=b._emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1=function(){return(tv=b._emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1).apply(null,arguments);},uv=b._emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1=function(){return(uv=b._emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1).apply(null,arguments);},vv=b._emscripten_bind_btSoftRigidDynamicsWorld_addAction_1=function(){return(vv=b._emscripten_bind_btSoftRigidDynamicsWorld_addAction_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_addAction_1).apply(null,arguments);},wv=b._emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1=function(){return(wv=b._emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1).apply(null,arguments);},xv=b._emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0=function(){return(xv=b._emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0).apply(null,arguments);},yv=b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1=function(){return(yv=b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1).apply(null,arguments);},zv=b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2=function(){return(zv=b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2).apply(null,arguments);},Av=b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3=function(){return(Av=b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3=b.asm.emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3).apply(null,arguments);},Bv=b._emscripten_bind_btSoftRigidDynamicsWorld___destroy___0=function(){return(Bv=b._emscripten_bind_btSoftRigidDynamicsWorld___destroy___0=b.asm.emscripten_bind_btSoftRigidDynamicsWorld___destroy___0).apply(null,arguments);},Cv=b._emscripten_bind_btFixedConstraint_btFixedConstraint_4=function(){return(Cv=b._emscripten_bind_btFixedConstraint_btFixedConstraint_4=b.asm.emscripten_bind_btFixedConstraint_btFixedConstraint_4).apply(null,arguments);},Dv=b._emscripten_bind_btFixedConstraint_enableFeedback_1=function(){return(Dv=b._emscripten_bind_btFixedConstraint_enableFeedback_1=b.asm.emscripten_bind_btFixedConstraint_enableFeedback_1).apply(null,arguments);},Ev=b._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0=function(){return(Ev=b._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0=b.asm.emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0).apply(null,arguments);},Fv=b._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1=function(){return(Fv=b._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1=b.asm.emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1).apply(null,arguments);},Gv=b._emscripten_bind_btFixedConstraint_getParam_2=function(){return(Gv=b._emscripten_bind_btFixedConstraint_getParam_2=b.asm.emscripten_bind_btFixedConstraint_getParam_2).apply(null,arguments);},Hv=b._emscripten_bind_btFixedConstraint_setParam_3=function(){return(Hv=b._emscripten_bind_btFixedConstraint_setParam_3=b.asm.emscripten_bind_btFixedConstraint_setParam_3).apply(null,arguments);},Iv=b._emscripten_bind_btFixedConstraint___destroy___0=function(){return(Iv=b._emscripten_bind_btFixedConstraint___destroy___0=b.asm.emscripten_bind_btFixedConstraint___destroy___0).apply(null,arguments);},Jv=b._emscripten_bind_btTransform_btTransform_0=function(){return(Jv=b._emscripten_bind_btTransform_btTransform_0=b.asm.emscripten_bind_btTransform_btTransform_0).apply(null,arguments);},Kv=b._emscripten_bind_btTransform_btTransform_2=function(){return(Kv=b._emscripten_bind_btTransform_btTransform_2=b.asm.emscripten_bind_btTransform_btTransform_2).apply(null,arguments);},Lv=b._emscripten_bind_btTransform_setIdentity_0=function(){return(Lv=b._emscripten_bind_btTransform_setIdentity_0=b.asm.emscripten_bind_btTransform_setIdentity_0).apply(null,arguments);},Mv=b._emscripten_bind_btTransform_setOrigin_1=function(){return(Mv=b._emscripten_bind_btTransform_setOrigin_1=b.asm.emscripten_bind_btTransform_setOrigin_1).apply(null,arguments);},Nv=b._emscripten_bind_btTransform_setRotation_1=function(){return(Nv=b._emscripten_bind_btTransform_setRotation_1=b.asm.emscripten_bind_btTransform_setRotation_1).apply(null,arguments);},Ov=b._emscripten_bind_btTransform_getOrigin_0=function(){return(Ov=b._emscripten_bind_btTransform_getOrigin_0=b.asm.emscripten_bind_btTransform_getOrigin_0).apply(null,arguments);},Pv=b._emscripten_bind_btTransform_getRotation_0=function(){return(Pv=b._emscripten_bind_btTransform_getRotation_0=b.asm.emscripten_bind_btTransform_getRotation_0).apply(null,arguments);},Qv=b._emscripten_bind_btTransform_getBasis_0=function(){return(Qv=b._emscripten_bind_btTransform_getBasis_0=b.asm.emscripten_bind_btTransform_getBasis_0).apply(null,arguments);},Rv=b._emscripten_bind_btTransform_setFromOpenGLMatrix_1=function(){return(Rv=b._emscripten_bind_btTransform_setFromOpenGLMatrix_1=b.asm.emscripten_bind_btTransform_setFromOpenGLMatrix_1).apply(null,arguments);},Sv=b._emscripten_bind_btTransform_inverse_0=function(){return(Sv=b._emscripten_bind_btTransform_inverse_0=b.asm.emscripten_bind_btTransform_inverse_0).apply(null,arguments);},Tv=b._emscripten_bind_btTransform_op_mul_1=function(){return(Tv=b._emscripten_bind_btTransform_op_mul_1=b.asm.emscripten_bind_btTransform_op_mul_1).apply(null,arguments);},Uv=b._emscripten_bind_btTransform___destroy___0=function(){return(Uv=b._emscripten_bind_btTransform___destroy___0=b.asm.emscripten_bind_btTransform___destroy___0).apply(null,arguments);},Vv=b._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2=function(){return(Vv=b._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2=b.asm.emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2).apply(null,arguments);},Wv=b._emscripten_bind_ClosestRayResultCallback_hasHit_0=function(){return(Wv=b._emscripten_bind_ClosestRayResultCallback_hasHit_0=b.asm.emscripten_bind_ClosestRayResultCallback_hasHit_0).apply(null,arguments);},Xv=b._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0=function(){return(Xv=b._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0=b.asm.emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0).apply(null,arguments);},Yv=b._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1=function(){return(Yv=b._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1=b.asm.emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1).apply(null,arguments);},Zv=b._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0=function(){return(Zv=b._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0=b.asm.emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0).apply(null,arguments);},$v=b._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1=function(){return($v=b._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1=b.asm.emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1).apply(null,arguments);},aw=b._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0=function(){return(aw=b._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0=b.asm.emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0).apply(null,arguments);},bw=b._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1=function(){return(bw=b._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1=b.asm.emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1).apply(null,arguments);},cw=b._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0=function(){return(cw=b._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0=b.asm.emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0).apply(null,arguments);},dw=b._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1=function(){return(dw=b._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1=b.asm.emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1).apply(null,arguments);},ew=b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0=function(){return(ew=b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0=b.asm.emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0).apply(null,arguments);},fw=b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1=function(){return(fw=b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1=b.asm.emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1).apply(null,arguments);},gw=b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0=function(){return(gw=b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0=b.asm.emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0).apply(null,arguments);},hw=b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1=function(){return(hw=b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1=b.asm.emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1).apply(null,arguments);},iw=b._emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0=function(){return(iw=b._emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0=b.asm.emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0).apply(null,arguments);},jw=b._emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1=function(){return(jw=b._emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1=b.asm.emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1).apply(null,arguments);},kw=b._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0=function(){return(kw=b._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0=b.asm.emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0).apply(null,arguments);},lw=b._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1=function(){return(lw=b._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1=b.asm.emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1).apply(null,arguments);},mw=b._emscripten_bind_ClosestRayResultCallback___destroy___0=function(){return(mw=b._emscripten_bind_ClosestRayResultCallback___destroy___0=b.asm.emscripten_bind_ClosestRayResultCallback___destroy___0).apply(null,arguments);},nw=b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0=function(){return(nw=b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0=b.asm.emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0).apply(null,arguments);},ow=b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1=function(){return(ow=b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1=b.asm.emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1).apply(null,arguments);},pw=b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0=function(){return(pw=b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0=b.asm.emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0).apply(null,arguments);},qw=b._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0=function(){return(qw=b._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0=b.asm.emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0).apply(null,arguments);},rw=b._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7=function(){return(rw=b._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7=b.asm.emscripten_bind_ConcreteContactResultCallback_addSingleResult_7).apply(null,arguments);},sw=b._emscripten_bind_ConcreteContactResultCallback___destroy___0=function(){return(sw=b._emscripten_bind_ConcreteContactResultCallback___destroy___0=b.asm.emscripten_bind_ConcreteContactResultCallback___destroy___0).apply(null,arguments);},tw=b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2=function(){return(tw=b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2=b.asm.emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2).apply(null,arguments);},uw=b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3=function(){return(uw=b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3=b.asm.emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3).apply(null,arguments);},vw=b._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1=function(){return(vw=b._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1=b.asm.emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1).apply(null,arguments);},ww=b._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0=function(){return(ww=b._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0=b.asm.emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0).apply(null,arguments);},xw=b._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2=function(){return(xw=b._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2=b.asm.emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2).apply(null,arguments);},yw=b._emscripten_bind_btBvhTriangleMeshShape___destroy___0=function(){return(yw=b._emscripten_bind_btBvhTriangleMeshShape___destroy___0=b.asm.emscripten_bind_btBvhTriangleMeshShape___destroy___0).apply(null,arguments);},zw=b._emscripten_bind_btConstCollisionObjectArray_size_0=function(){return(zw=b._emscripten_bind_btConstCollisionObjectArray_size_0=b.asm.emscripten_bind_btConstCollisionObjectArray_size_0).apply(null,arguments);},Aw=b._emscripten_bind_btConstCollisionObjectArray_at_1=function(){return(Aw=b._emscripten_bind_btConstCollisionObjectArray_at_1=b.asm.emscripten_bind_btConstCollisionObjectArray_at_1).apply(null,arguments);},Bw=b._emscripten_bind_btConstCollisionObjectArray___destroy___0=function(){return(Bw=b._emscripten_bind_btConstCollisionObjectArray___destroy___0=b.asm.emscripten_bind_btConstCollisionObjectArray___destroy___0).apply(null,arguments);},Cw=b._emscripten_bind_btSliderConstraint_btSliderConstraint_3=function(){return(Cw=b._emscripten_bind_btSliderConstraint_btSliderConstraint_3=b.asm.emscripten_bind_btSliderConstraint_btSliderConstraint_3).apply(null,arguments);},Dw=b._emscripten_bind_btSliderConstraint_btSliderConstraint_5=function(){return(Dw=b._emscripten_bind_btSliderConstraint_btSliderConstraint_5=b.asm.emscripten_bind_btSliderConstraint_btSliderConstraint_5).apply(null,arguments);},Ew=b._emscripten_bind_btSliderConstraint_setLowerLinLimit_1=function(){return(Ew=b._emscripten_bind_btSliderConstraint_setLowerLinLimit_1=b.asm.emscripten_bind_btSliderConstraint_setLowerLinLimit_1).apply(null,arguments);},Fw=b._emscripten_bind_btSliderConstraint_setUpperLinLimit_1=function(){return(Fw=b._emscripten_bind_btSliderConstraint_setUpperLinLimit_1=b.asm.emscripten_bind_btSliderConstraint_setUpperLinLimit_1).apply(null,arguments);},Gw=b._emscripten_bind_btSliderConstraint_setLowerAngLimit_1=function(){return(Gw=b._emscripten_bind_btSliderConstraint_setLowerAngLimit_1=b.asm.emscripten_bind_btSliderConstraint_setLowerAngLimit_1).apply(null,arguments);},Hw=b._emscripten_bind_btSliderConstraint_setUpperAngLimit_1=function(){return(Hw=b._emscripten_bind_btSliderConstraint_setUpperAngLimit_1=b.asm.emscripten_bind_btSliderConstraint_setUpperAngLimit_1).apply(null,arguments);},Iw=b._emscripten_bind_btSliderConstraint_enableFeedback_1=function(){return(Iw=b._emscripten_bind_btSliderConstraint_enableFeedback_1=b.asm.emscripten_bind_btSliderConstraint_enableFeedback_1).apply(null,arguments);},Jw=b._emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0=function(){return(Jw=b._emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0=b.asm.emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0).apply(null,arguments);},Kw=b._emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1=function(){return(Kw=b._emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1=b.asm.emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1).apply(null,arguments);},Lw=b._emscripten_bind_btSliderConstraint_getParam_2=function(){return(Lw=b._emscripten_bind_btSliderConstraint_getParam_2=b.asm.emscripten_bind_btSliderConstraint_getParam_2).apply(null,arguments);},Mw=b._emscripten_bind_btSliderConstraint_setParam_3=function(){return(Mw=b._emscripten_bind_btSliderConstraint_setParam_3=b.asm.emscripten_bind_btSliderConstraint_setParam_3).apply(null,arguments);},Nw=b._emscripten_bind_btSliderConstraint___destroy___0=function(){return(Nw=b._emscripten_bind_btSliderConstraint___destroy___0=b.asm.emscripten_bind_btSliderConstraint___destroy___0).apply(null,arguments);},Ow=b._emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0=function(){return(Ow=b._emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0=b.asm.emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0).apply(null,arguments);},Pw=b._emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2=function(){return(Pw=b._emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2=b.asm.emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2).apply(null,arguments);},Qw=b._emscripten_bind_btPairCachingGhostObject_getCollisionShape_0=function(){return(Qw=b._emscripten_bind_btPairCachingGhostObject_getCollisionShape_0=b.asm.emscripten_bind_btPairCachingGhostObject_getCollisionShape_0).apply(null,arguments);},Rw=b._emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1=function(){return(Rw=b._emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1=b.asm.emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1).apply(null,arguments);},Sw=b._emscripten_bind_btPairCachingGhostObject_setActivationState_1=function(){return(Sw=b._emscripten_bind_btPairCachingGhostObject_setActivationState_1=b.asm.emscripten_bind_btPairCachingGhostObject_setActivationState_1).apply(null,arguments);},Tw=b._emscripten_bind_btPairCachingGhostObject_forceActivationState_1=function(){return(Tw=b._emscripten_bind_btPairCachingGhostObject_forceActivationState_1=b.asm.emscripten_bind_btPairCachingGhostObject_forceActivationState_1).apply(null,arguments);},Uw=b._emscripten_bind_btPairCachingGhostObject_activate_0=function(){return(Uw=b._emscripten_bind_btPairCachingGhostObject_activate_0=b.asm.emscripten_bind_btPairCachingGhostObject_activate_0).apply(null,arguments);},Vw=b._emscripten_bind_btPairCachingGhostObject_activate_1=function(){return(Vw=b._emscripten_bind_btPairCachingGhostObject_activate_1=b.asm.emscripten_bind_btPairCachingGhostObject_activate_1).apply(null,arguments);},Ww=b._emscripten_bind_btPairCachingGhostObject_isActive_0=function(){return(Ww=b._emscripten_bind_btPairCachingGhostObject_isActive_0=b.asm.emscripten_bind_btPairCachingGhostObject_isActive_0).apply(null,arguments);},Xw=b._emscripten_bind_btPairCachingGhostObject_isKinematicObject_0=function(){return(Xw=b._emscripten_bind_btPairCachingGhostObject_isKinematicObject_0=b.asm.emscripten_bind_btPairCachingGhostObject_isKinematicObject_0).apply(null,arguments);},Yw=b._emscripten_bind_btPairCachingGhostObject_isStaticObject_0=function(){return(Yw=b._emscripten_bind_btPairCachingGhostObject_isStaticObject_0=b.asm.emscripten_bind_btPairCachingGhostObject_isStaticObject_0).apply(null,arguments);},Zw=b._emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0=function(){return(Zw=b._emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0=b.asm.emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0).apply(null,arguments);},$w=b._emscripten_bind_btPairCachingGhostObject_getRestitution_0=function(){return($w=b._emscripten_bind_btPairCachingGhostObject_getRestitution_0=b.asm.emscripten_bind_btPairCachingGhostObject_getRestitution_0).apply(null,arguments);},ax=b._emscripten_bind_btPairCachingGhostObject_getFriction_0=function(){return(ax=b._emscripten_bind_btPairCachingGhostObject_getFriction_0=b.asm.emscripten_bind_btPairCachingGhostObject_getFriction_0).apply(null,arguments);},bx=b._emscripten_bind_btPairCachingGhostObject_getRollingFriction_0=function(){return(bx=b._emscripten_bind_btPairCachingGhostObject_getRollingFriction_0=b.asm.emscripten_bind_btPairCachingGhostObject_getRollingFriction_0).apply(null,arguments);},cx=b._emscripten_bind_btPairCachingGhostObject_setRestitution_1=function(){return(cx=b._emscripten_bind_btPairCachingGhostObject_setRestitution_1=b.asm.emscripten_bind_btPairCachingGhostObject_setRestitution_1).apply(null,arguments);},dx=b._emscripten_bind_btPairCachingGhostObject_setFriction_1=function(){return(dx=b._emscripten_bind_btPairCachingGhostObject_setFriction_1=b.asm.emscripten_bind_btPairCachingGhostObject_setFriction_1).apply(null,arguments);},ex=b._emscripten_bind_btPairCachingGhostObject_setRollingFriction_1=function(){return(ex=b._emscripten_bind_btPairCachingGhostObject_setRollingFriction_1=b.asm.emscripten_bind_btPairCachingGhostObject_setRollingFriction_1).apply(null,arguments);},fx=b._emscripten_bind_btPairCachingGhostObject_getWorldTransform_0=function(){return(fx=b._emscripten_bind_btPairCachingGhostObject_getWorldTransform_0=b.asm.emscripten_bind_btPairCachingGhostObject_getWorldTransform_0).apply(null,arguments);},gx=b._emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0=function(){return(gx=b._emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0=b.asm.emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0).apply(null,arguments);},hx=b._emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1=function(){return(hx=b._emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1=b.asm.emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1).apply(null,arguments);},ix=b._emscripten_bind_btPairCachingGhostObject_setWorldTransform_1=function(){return(ix=b._emscripten_bind_btPairCachingGhostObject_setWorldTransform_1=b.asm.emscripten_bind_btPairCachingGhostObject_setWorldTransform_1).apply(null,arguments);},jx=b._emscripten_bind_btPairCachingGhostObject_setCollisionShape_1=function(){return(jx=b._emscripten_bind_btPairCachingGhostObject_setCollisionShape_1=b.asm.emscripten_bind_btPairCachingGhostObject_setCollisionShape_1).apply(null,arguments);},kx=b._emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1=function(){return(kx=b._emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1=b.asm.emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1).apply(null,arguments);},lx=b._emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1=function(){return(lx=b._emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1=b.asm.emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1).apply(null,arguments);},mx=b._emscripten_bind_btPairCachingGhostObject_getUserIndex_0=function(){return(mx=b._emscripten_bind_btPairCachingGhostObject_getUserIndex_0=b.asm.emscripten_bind_btPairCachingGhostObject_getUserIndex_0).apply(null,arguments);},nx=b._emscripten_bind_btPairCachingGhostObject_setUserIndex_1=function(){return(nx=b._emscripten_bind_btPairCachingGhostObject_setUserIndex_1=b.asm.emscripten_bind_btPairCachingGhostObject_setUserIndex_1).apply(null,arguments);},ox=b._emscripten_bind_btPairCachingGhostObject_getUserPointer_0=function(){return(ox=b._emscripten_bind_btPairCachingGhostObject_getUserPointer_0=b.asm.emscripten_bind_btPairCachingGhostObject_getUserPointer_0).apply(null,arguments);},px=b._emscripten_bind_btPairCachingGhostObject_setUserPointer_1=function(){return(px=b._emscripten_bind_btPairCachingGhostObject_setUserPointer_1=b.asm.emscripten_bind_btPairCachingGhostObject_setUserPointer_1).apply(null,arguments);},qx=b._emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0=function(){return(qx=b._emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0=b.asm.emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0).apply(null,arguments);},rx=b._emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0=function(){return(rx=b._emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0=b.asm.emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0).apply(null,arguments);},sx=b._emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1=function(){return(sx=b._emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1=b.asm.emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1).apply(null,arguments);},tx=b._emscripten_bind_btPairCachingGhostObject___destroy___0=function(){return(tx=b._emscripten_bind_btPairCachingGhostObject___destroy___0=b.asm.emscripten_bind_btPairCachingGhostObject___destroy___0).apply(null,arguments);},ux=b._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0=function(){return(ux=b._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0=b.asm.emscripten_bind_btManifoldPoint_getPositionWorldOnA_0).apply(null,arguments);},vx=b._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0=function(){return(vx=b._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0=b.asm.emscripten_bind_btManifoldPoint_getPositionWorldOnB_0).apply(null,arguments);},wx=b._emscripten_bind_btManifoldPoint_getAppliedImpulse_0=function(){return(wx=b._emscripten_bind_btManifoldPoint_getAppliedImpulse_0=b.asm.emscripten_bind_btManifoldPoint_getAppliedImpulse_0).apply(null,arguments);},xx=b._emscripten_bind_btManifoldPoint_getDistance_0=function(){return(xx=b._emscripten_bind_btManifoldPoint_getDistance_0=b.asm.emscripten_bind_btManifoldPoint_getDistance_0).apply(null,arguments);},yx=b._emscripten_bind_btManifoldPoint_get_m_localPointA_0=function(){return(yx=b._emscripten_bind_btManifoldPoint_get_m_localPointA_0=b.asm.emscripten_bind_btManifoldPoint_get_m_localPointA_0).apply(null,arguments);},zx=b._emscripten_bind_btManifoldPoint_set_m_localPointA_1=function(){return(zx=b._emscripten_bind_btManifoldPoint_set_m_localPointA_1=b.asm.emscripten_bind_btManifoldPoint_set_m_localPointA_1).apply(null,arguments);},Ax=b._emscripten_bind_btManifoldPoint_get_m_localPointB_0=function(){return(Ax=b._emscripten_bind_btManifoldPoint_get_m_localPointB_0=b.asm.emscripten_bind_btManifoldPoint_get_m_localPointB_0).apply(null,arguments);},Bx=b._emscripten_bind_btManifoldPoint_set_m_localPointB_1=function(){return(Bx=b._emscripten_bind_btManifoldPoint_set_m_localPointB_1=b.asm.emscripten_bind_btManifoldPoint_set_m_localPointB_1).apply(null,arguments);},Cx=b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0=function(){return(Cx=b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0=b.asm.emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0).apply(null,arguments);},Dx=b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1=function(){return(Dx=b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1=b.asm.emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1).apply(null,arguments);},Ex=b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0=function(){return(Ex=b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0=b.asm.emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0).apply(null,arguments);},Fx=b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1=function(){return(Fx=b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1=b.asm.emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1).apply(null,arguments);},Gx=b._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0=function(){return(Gx=b._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0=b.asm.emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0).apply(null,arguments);},Hx=b._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1=function(){return(Hx=b._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1=b.asm.emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1).apply(null,arguments);},Ix=b._emscripten_bind_btManifoldPoint_get_m_userPersistentData_0=function(){return(Ix=b._emscripten_bind_btManifoldPoint_get_m_userPersistentData_0=b.asm.emscripten_bind_btManifoldPoint_get_m_userPersistentData_0).apply(null,arguments);},Jx=b._emscripten_bind_btManifoldPoint_set_m_userPersistentData_1=function(){return(Jx=b._emscripten_bind_btManifoldPoint_set_m_userPersistentData_1=b.asm.emscripten_bind_btManifoldPoint_set_m_userPersistentData_1).apply(null,arguments);},Kx=b._emscripten_bind_btManifoldPoint___destroy___0=function(){return(Kx=b._emscripten_bind_btManifoldPoint___destroy___0=b.asm.emscripten_bind_btManifoldPoint___destroy___0).apply(null,arguments);},Lx=b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2=function(){return(Lx=b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2=b.asm.emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2).apply(null,arguments);},Mx=b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4=function(){return(Mx=b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4=b.asm.emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4).apply(null,arguments);},Nx=b._emscripten_bind_btPoint2PointConstraint_setPivotA_1=function(){return(Nx=b._emscripten_bind_btPoint2PointConstraint_setPivotA_1=b.asm.emscripten_bind_btPoint2PointConstraint_setPivotA_1).apply(null,arguments);},Ox=b._emscripten_bind_btPoint2PointConstraint_setPivotB_1=function(){return(Ox=b._emscripten_bind_btPoint2PointConstraint_setPivotB_1=b.asm.emscripten_bind_btPoint2PointConstraint_setPivotB_1).apply(null,arguments);},Px=b._emscripten_bind_btPoint2PointConstraint_getPivotInA_0=function(){return(Px=b._emscripten_bind_btPoint2PointConstraint_getPivotInA_0=b.asm.emscripten_bind_btPoint2PointConstraint_getPivotInA_0).apply(null,arguments);},Qx=b._emscripten_bind_btPoint2PointConstraint_getPivotInB_0=function(){return(Qx=b._emscripten_bind_btPoint2PointConstraint_getPivotInB_0=b.asm.emscripten_bind_btPoint2PointConstraint_getPivotInB_0).apply(null,arguments);},Rx=b._emscripten_bind_btPoint2PointConstraint_enableFeedback_1=function(){return(Rx=b._emscripten_bind_btPoint2PointConstraint_enableFeedback_1=b.asm.emscripten_bind_btPoint2PointConstraint_enableFeedback_1).apply(null,arguments);},Sx=b._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0=function(){return(Sx=b._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0=b.asm.emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0).apply(null,arguments);},Tx=b._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1=function(){return(Tx=b._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1=b.asm.emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1).apply(null,arguments);},Ux=b._emscripten_bind_btPoint2PointConstraint_getParam_2=function(){return(Ux=b._emscripten_bind_btPoint2PointConstraint_getParam_2=b.asm.emscripten_bind_btPoint2PointConstraint_getParam_2).apply(null,arguments);},Vx=b._emscripten_bind_btPoint2PointConstraint_setParam_3=function(){return(Vx=b._emscripten_bind_btPoint2PointConstraint_setParam_3=b.asm.emscripten_bind_btPoint2PointConstraint_setParam_3).apply(null,arguments);},Wx=b._emscripten_bind_btPoint2PointConstraint_get_m_setting_0=function(){return(Wx=b._emscripten_bind_btPoint2PointConstraint_get_m_setting_0=b.asm.emscripten_bind_btPoint2PointConstraint_get_m_setting_0).apply(null,arguments);},Xx=b._emscripten_bind_btPoint2PointConstraint_set_m_setting_1=function(){return(Xx=b._emscripten_bind_btPoint2PointConstraint_set_m_setting_1=b.asm.emscripten_bind_btPoint2PointConstraint_set_m_setting_1).apply(null,arguments);},Yx=b._emscripten_bind_btPoint2PointConstraint___destroy___0=function(){return(Yx=b._emscripten_bind_btPoint2PointConstraint___destroy___0=b.asm.emscripten_bind_btPoint2PointConstraint___destroy___0).apply(null,arguments);},Zx=b._emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0=function(){return(Zx=b._emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0=b.asm.emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0).apply(null,arguments);},$x=b._emscripten_bind_btSoftBodyHelpers_CreateRope_5=function(){return($x=b._emscripten_bind_btSoftBodyHelpers_CreateRope_5=b.asm.emscripten_bind_btSoftBodyHelpers_CreateRope_5).apply(null,arguments);},ay=b._emscripten_bind_btSoftBodyHelpers_CreatePatch_9=function(){return(ay=b._emscripten_bind_btSoftBodyHelpers_CreatePatch_9=b.asm.emscripten_bind_btSoftBodyHelpers_CreatePatch_9).apply(null,arguments);},by=b._emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10=function(){return(by=b._emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10=b.asm.emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10).apply(null,arguments);},cy=b._emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4=function(){return(cy=b._emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4=b.asm.emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4).apply(null,arguments);},dy=b._emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5=function(){return(dy=b._emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5=b.asm.emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5).apply(null,arguments);},ey=b._emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4=function(){return(ey=b._emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4=b.asm.emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4).apply(null,arguments);},fy=b._emscripten_bind_btSoftBodyHelpers___destroy___0=function(){return(fy=b._emscripten_bind_btSoftBodyHelpers___destroy___0=b.asm.emscripten_bind_btSoftBodyHelpers___destroy___0).apply(null,arguments);},gy=b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0=function(){return(gy=b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0=b.asm.emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0).apply(null,arguments);},hy=b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1=function(){return(hy=b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1=b.asm.emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1).apply(null,arguments);},iy=b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0=function(){return(iy=b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0=b.asm.emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0).apply(null,arguments);},jy=b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1=function(){return(jy=b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1=b.asm.emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1).apply(null,arguments);},ky=b._emscripten_bind_btBroadphaseProxy___destroy___0=function(){return(ky=b._emscripten_bind_btBroadphaseProxy___destroy___0=b.asm.emscripten_bind_btBroadphaseProxy___destroy___0).apply(null,arguments);},ly=b._emscripten_bind_tNodeArray_size_0=function(){return(ly=b._emscripten_bind_tNodeArray_size_0=b.asm.emscripten_bind_tNodeArray_size_0).apply(null,arguments);},my=b._emscripten_bind_tNodeArray_at_1=function(){return(my=b._emscripten_bind_tNodeArray_at_1=b.asm.emscripten_bind_tNodeArray_at_1).apply(null,arguments);},ny=b._emscripten_bind_tNodeArray___destroy___0=function(){return(ny=b._emscripten_bind_tNodeArray___destroy___0=b.asm.emscripten_bind_tNodeArray___destroy___0).apply(null,arguments);},oy=b._emscripten_bind_btBoxShape_btBoxShape_1=function(){return(oy=b._emscripten_bind_btBoxShape_btBoxShape_1=b.asm.emscripten_bind_btBoxShape_btBoxShape_1).apply(null,arguments);},py=b._emscripten_bind_btBoxShape_setMargin_1=function(){return(py=b._emscripten_bind_btBoxShape_setMargin_1=b.asm.emscripten_bind_btBoxShape_setMargin_1).apply(null,arguments);},qy=b._emscripten_bind_btBoxShape_getMargin_0=function(){return(qy=b._emscripten_bind_btBoxShape_getMargin_0=b.asm.emscripten_bind_btBoxShape_getMargin_0).apply(null,arguments);},ry=b._emscripten_bind_btBoxShape_setLocalScaling_1=function(){return(ry=b._emscripten_bind_btBoxShape_setLocalScaling_1=b.asm.emscripten_bind_btBoxShape_setLocalScaling_1).apply(null,arguments);},sy=b._emscripten_bind_btBoxShape_getLocalScaling_0=function(){return(sy=b._emscripten_bind_btBoxShape_getLocalScaling_0=b.asm.emscripten_bind_btBoxShape_getLocalScaling_0).apply(null,arguments);},ty=b._emscripten_bind_btBoxShape_calculateLocalInertia_2=function(){return(ty=b._emscripten_bind_btBoxShape_calculateLocalInertia_2=b.asm.emscripten_bind_btBoxShape_calculateLocalInertia_2).apply(null,arguments);},uy=b._emscripten_bind_btBoxShape___destroy___0=function(){return(uy=b._emscripten_bind_btBoxShape___destroy___0=b.asm.emscripten_bind_btBoxShape___destroy___0).apply(null,arguments);},vy=b._emscripten_bind_btFace_get_m_indices_0=function(){return(vy=b._emscripten_bind_btFace_get_m_indices_0=b.asm.emscripten_bind_btFace_get_m_indices_0).apply(null,arguments);},wy=b._emscripten_bind_btFace_set_m_indices_1=function(){return(wy=b._emscripten_bind_btFace_set_m_indices_1=b.asm.emscripten_bind_btFace_set_m_indices_1).apply(null,arguments);},xy=b._emscripten_bind_btFace_get_m_plane_1=function(){return(xy=b._emscripten_bind_btFace_get_m_plane_1=b.asm.emscripten_bind_btFace_get_m_plane_1).apply(null,arguments);},yy=b._emscripten_bind_btFace_set_m_plane_2=function(){return(yy=b._emscripten_bind_btFace_set_m_plane_2=b.asm.emscripten_bind_btFace_set_m_plane_2).apply(null,arguments);},zy=b._emscripten_bind_btFace___destroy___0=function(){return(zy=b._emscripten_bind_btFace___destroy___0=b.asm.emscripten_bind_btFace___destroy___0).apply(null,arguments);},Ay=b._emscripten_bind_DebugDrawer_DebugDrawer_0=function(){return(Ay=b._emscripten_bind_DebugDrawer_DebugDrawer_0=b.asm.emscripten_bind_DebugDrawer_DebugDrawer_0).apply(null,arguments);},By=b._emscripten_bind_DebugDrawer_drawLine_3=function(){return(By=b._emscripten_bind_DebugDrawer_drawLine_3=b.asm.emscripten_bind_DebugDrawer_drawLine_3).apply(null,arguments);},Cy=b._emscripten_bind_DebugDrawer_drawContactPoint_5=function(){return(Cy=b._emscripten_bind_DebugDrawer_drawContactPoint_5=b.asm.emscripten_bind_DebugDrawer_drawContactPoint_5).apply(null,arguments);},Dy=b._emscripten_bind_DebugDrawer_reportErrorWarning_1=function(){return(Dy=b._emscripten_bind_DebugDrawer_reportErrorWarning_1=b.asm.emscripten_bind_DebugDrawer_reportErrorWarning_1).apply(null,arguments);},Ey=b._emscripten_bind_DebugDrawer_draw3dText_2=function(){return(Ey=b._emscripten_bind_DebugDrawer_draw3dText_2=b.asm.emscripten_bind_DebugDrawer_draw3dText_2).apply(null,arguments);},Fy=b._emscripten_bind_DebugDrawer_setDebugMode_1=function(){return(Fy=b._emscripten_bind_DebugDrawer_setDebugMode_1=b.asm.emscripten_bind_DebugDrawer_setDebugMode_1).apply(null,arguments);},Gy=b._emscripten_bind_DebugDrawer_getDebugMode_0=function(){return(Gy=b._emscripten_bind_DebugDrawer_getDebugMode_0=b.asm.emscripten_bind_DebugDrawer_getDebugMode_0).apply(null,arguments);},Hy=b._emscripten_bind_DebugDrawer___destroy___0=function(){return(Hy=b._emscripten_bind_DebugDrawer___destroy___0=b.asm.emscripten_bind_DebugDrawer___destroy___0).apply(null,arguments);},Iy=b._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2=function(){return(Iy=b._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2=b.asm.emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2).apply(null,arguments);},Jy=b._emscripten_bind_btCapsuleShapeX_setMargin_1=function(){return(Jy=b._emscripten_bind_btCapsuleShapeX_setMargin_1=b.asm.emscripten_bind_btCapsuleShapeX_setMargin_1).apply(null,arguments);},Ky=b._emscripten_bind_btCapsuleShapeX_getMargin_0=function(){return(Ky=b._emscripten_bind_btCapsuleShapeX_getMargin_0=b.asm.emscripten_bind_btCapsuleShapeX_getMargin_0).apply(null,arguments);},Ly=b._emscripten_bind_btCapsuleShapeX_getUpAxis_0=function(){return(Ly=b._emscripten_bind_btCapsuleShapeX_getUpAxis_0=b.asm.emscripten_bind_btCapsuleShapeX_getUpAxis_0).apply(null,arguments);},My=b._emscripten_bind_btCapsuleShapeX_getRadius_0=function(){return(My=b._emscripten_bind_btCapsuleShapeX_getRadius_0=b.asm.emscripten_bind_btCapsuleShapeX_getRadius_0).apply(null,arguments);},Ny=b._emscripten_bind_btCapsuleShapeX_getHalfHeight_0=function(){return(Ny=b._emscripten_bind_btCapsuleShapeX_getHalfHeight_0=b.asm.emscripten_bind_btCapsuleShapeX_getHalfHeight_0).apply(null,arguments);},Oy=b._emscripten_bind_btCapsuleShapeX_setLocalScaling_1=function(){return(Oy=b._emscripten_bind_btCapsuleShapeX_setLocalScaling_1=b.asm.emscripten_bind_btCapsuleShapeX_setLocalScaling_1).apply(null,arguments);},Py=b._emscripten_bind_btCapsuleShapeX_getLocalScaling_0=function(){return(Py=b._emscripten_bind_btCapsuleShapeX_getLocalScaling_0=b.asm.emscripten_bind_btCapsuleShapeX_getLocalScaling_0).apply(null,arguments);},Qy=b._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2=function(){return(Qy=b._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2=b.asm.emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2).apply(null,arguments);},Ry=b._emscripten_bind_btCapsuleShapeX___destroy___0=function(){return(Ry=b._emscripten_bind_btCapsuleShapeX___destroy___0=b.asm.emscripten_bind_btCapsuleShapeX___destroy___0).apply(null,arguments);},Sy=b._emscripten_bind_btQuaternion_btQuaternion_4=function(){return(Sy=b._emscripten_bind_btQuaternion_btQuaternion_4=b.asm.emscripten_bind_btQuaternion_btQuaternion_4).apply(null,arguments);},Ty=b._emscripten_bind_btQuaternion_setValue_4=function(){return(Ty=b._emscripten_bind_btQuaternion_setValue_4=b.asm.emscripten_bind_btQuaternion_setValue_4).apply(null,arguments);},Uy=b._emscripten_bind_btQuaternion_setEulerZYX_3=function(){return(Uy=b._emscripten_bind_btQuaternion_setEulerZYX_3=b.asm.emscripten_bind_btQuaternion_setEulerZYX_3).apply(null,arguments);},Vy=b._emscripten_bind_btQuaternion_setRotation_2=function(){return(Vy=b._emscripten_bind_btQuaternion_setRotation_2=b.asm.emscripten_bind_btQuaternion_setRotation_2).apply(null,arguments);},Wy=b._emscripten_bind_btQuaternion_normalize_0=function(){return(Wy=b._emscripten_bind_btQuaternion_normalize_0=b.asm.emscripten_bind_btQuaternion_normalize_0).apply(null,arguments);},Xy=b._emscripten_bind_btQuaternion_length2_0=function(){return(Xy=b._emscripten_bind_btQuaternion_length2_0=b.asm.emscripten_bind_btQuaternion_length2_0).apply(null,arguments);},Yy=b._emscripten_bind_btQuaternion_length_0=function(){return(Yy=b._emscripten_bind_btQuaternion_length_0=b.asm.emscripten_bind_btQuaternion_length_0).apply(null,arguments);},Zy=b._emscripten_bind_btQuaternion_dot_1=function(){return(Zy=b._emscripten_bind_btQuaternion_dot_1=b.asm.emscripten_bind_btQuaternion_dot_1).apply(null,arguments);},$y=b._emscripten_bind_btQuaternion_normalized_0=function(){return($y=b._emscripten_bind_btQuaternion_normalized_0=b.asm.emscripten_bind_btQuaternion_normalized_0).apply(null,arguments);},az=b._emscripten_bind_btQuaternion_getAxis_0=function(){return(az=b._emscripten_bind_btQuaternion_getAxis_0=b.asm.emscripten_bind_btQuaternion_getAxis_0).apply(null,arguments);},bz=b._emscripten_bind_btQuaternion_inverse_0=function(){return(bz=b._emscripten_bind_btQuaternion_inverse_0=b.asm.emscripten_bind_btQuaternion_inverse_0).apply(null,arguments);},cz=b._emscripten_bind_btQuaternion_getAngle_0=function(){return(cz=b._emscripten_bind_btQuaternion_getAngle_0=b.asm.emscripten_bind_btQuaternion_getAngle_0).apply(null,arguments);},dz=b._emscripten_bind_btQuaternion_getAngleShortestPath_0=function(){return(dz=b._emscripten_bind_btQuaternion_getAngleShortestPath_0=b.asm.emscripten_bind_btQuaternion_getAngleShortestPath_0).apply(null,arguments);},ez=b._emscripten_bind_btQuaternion_angle_1=function(){return(ez=b._emscripten_bind_btQuaternion_angle_1=b.asm.emscripten_bind_btQuaternion_angle_1).apply(null,arguments);},fz=b._emscripten_bind_btQuaternion_angleShortestPath_1=function(){return(fz=b._emscripten_bind_btQuaternion_angleShortestPath_1=b.asm.emscripten_bind_btQuaternion_angleShortestPath_1).apply(null,arguments);},gz=b._emscripten_bind_btQuaternion_op_add_1=function(){return(gz=b._emscripten_bind_btQuaternion_op_add_1=b.asm.emscripten_bind_btQuaternion_op_add_1).apply(null,arguments);},hz=b._emscripten_bind_btQuaternion_op_sub_1=function(){return(hz=b._emscripten_bind_btQuaternion_op_sub_1=b.asm.emscripten_bind_btQuaternion_op_sub_1).apply(null,arguments);},iz=b._emscripten_bind_btQuaternion_op_mul_1=function(){return(iz=b._emscripten_bind_btQuaternion_op_mul_1=b.asm.emscripten_bind_btQuaternion_op_mul_1).apply(null,arguments);},jz=b._emscripten_bind_btQuaternion_op_mulq_1=function(){return(jz=b._emscripten_bind_btQuaternion_op_mulq_1=b.asm.emscripten_bind_btQuaternion_op_mulq_1).apply(null,arguments);},kz=b._emscripten_bind_btQuaternion_op_div_1=function(){return(kz=b._emscripten_bind_btQuaternion_op_div_1=b.asm.emscripten_bind_btQuaternion_op_div_1).apply(null,arguments);},lz=b._emscripten_bind_btQuaternion_x_0=function(){return(lz=b._emscripten_bind_btQuaternion_x_0=b.asm.emscripten_bind_btQuaternion_x_0).apply(null,arguments);},mz=b._emscripten_bind_btQuaternion_y_0=function(){return(mz=b._emscripten_bind_btQuaternion_y_0=b.asm.emscripten_bind_btQuaternion_y_0).apply(null,arguments);},nz=b._emscripten_bind_btQuaternion_z_0=function(){return(nz=b._emscripten_bind_btQuaternion_z_0=b.asm.emscripten_bind_btQuaternion_z_0).apply(null,arguments);},oz=b._emscripten_bind_btQuaternion_w_0=function(){return(oz=b._emscripten_bind_btQuaternion_w_0=b.asm.emscripten_bind_btQuaternion_w_0).apply(null,arguments);},pz=b._emscripten_bind_btQuaternion_setX_1=function(){return(pz=b._emscripten_bind_btQuaternion_setX_1=b.asm.emscripten_bind_btQuaternion_setX_1).apply(null,arguments);},qz=b._emscripten_bind_btQuaternion_setY_1=function(){return(qz=b._emscripten_bind_btQuaternion_setY_1=b.asm.emscripten_bind_btQuaternion_setY_1).apply(null,arguments);},rz=b._emscripten_bind_btQuaternion_setZ_1=function(){return(rz=b._emscripten_bind_btQuaternion_setZ_1=b.asm.emscripten_bind_btQuaternion_setZ_1).apply(null,arguments);},sz=b._emscripten_bind_btQuaternion_setW_1=function(){return(sz=b._emscripten_bind_btQuaternion_setW_1=b.asm.emscripten_bind_btQuaternion_setW_1).apply(null,arguments);},tz=b._emscripten_bind_btQuaternion___destroy___0=function(){return(tz=b._emscripten_bind_btQuaternion___destroy___0=b.asm.emscripten_bind_btQuaternion___destroy___0).apply(null,arguments);},uz=b._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2=function(){return(uz=b._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2=b.asm.emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2).apply(null,arguments);},vz=b._emscripten_bind_btCapsuleShapeZ_setMargin_1=function(){return(vz=b._emscripten_bind_btCapsuleShapeZ_setMargin_1=b.asm.emscripten_bind_btCapsuleShapeZ_setMargin_1).apply(null,arguments);},wz=b._emscripten_bind_btCapsuleShapeZ_getMargin_0=function(){return(wz=b._emscripten_bind_btCapsuleShapeZ_getMargin_0=b.asm.emscripten_bind_btCapsuleShapeZ_getMargin_0).apply(null,arguments);},xz=b._emscripten_bind_btCapsuleShapeZ_getUpAxis_0=function(){return(xz=b._emscripten_bind_btCapsuleShapeZ_getUpAxis_0=b.asm.emscripten_bind_btCapsuleShapeZ_getUpAxis_0).apply(null,arguments);},yz=b._emscripten_bind_btCapsuleShapeZ_getRadius_0=function(){return(yz=b._emscripten_bind_btCapsuleShapeZ_getRadius_0=b.asm.emscripten_bind_btCapsuleShapeZ_getRadius_0).apply(null,arguments);},zz=b._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0=function(){return(zz=b._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0=b.asm.emscripten_bind_btCapsuleShapeZ_getHalfHeight_0).apply(null,arguments);},Az=b._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1=function(){return(Az=b._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1=b.asm.emscripten_bind_btCapsuleShapeZ_setLocalScaling_1).apply(null,arguments);},Bz=b._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0=function(){return(Bz=b._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0=b.asm.emscripten_bind_btCapsuleShapeZ_getLocalScaling_0).apply(null,arguments);},Cz=b._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2=function(){return(Cz=b._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2=b.asm.emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2).apply(null,arguments);},Dz=b._emscripten_bind_btCapsuleShapeZ___destroy___0=function(){return(Dz=b._emscripten_bind_btCapsuleShapeZ___destroy___0=b.asm.emscripten_bind_btCapsuleShapeZ___destroy___0).apply(null,arguments);},Ez=b._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0=function(){return(Ez=b._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0=b.asm.emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0).apply(null,arguments);},Fz=b._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1=function(){return(Fz=b._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1=b.asm.emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1).apply(null,arguments);},Gz=b._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0=function(){return(Gz=b._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0=b.asm.emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0).apply(null,arguments);},Hz=b._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1=function(){return(Hz=b._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1=b.asm.emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1).apply(null,arguments);},Iz=b._emscripten_bind_btContactSolverInfo_get_m_numIterations_0=function(){return(Iz=b._emscripten_bind_btContactSolverInfo_get_m_numIterations_0=b.asm.emscripten_bind_btContactSolverInfo_get_m_numIterations_0).apply(null,arguments);},Jz=b._emscripten_bind_btContactSolverInfo_set_m_numIterations_1=function(){return(Jz=b._emscripten_bind_btContactSolverInfo_set_m_numIterations_1=b.asm.emscripten_bind_btContactSolverInfo_set_m_numIterations_1).apply(null,arguments);},Kz=b._emscripten_bind_btContactSolverInfo___destroy___0=function(){return(Kz=b._emscripten_bind_btContactSolverInfo___destroy___0=b.asm.emscripten_bind_btContactSolverInfo___destroy___0).apply(null,arguments);},Lz=b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3=function(){return(Lz=b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3).apply(null,arguments);},Mz=b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5=function(){return(Mz=b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5).apply(null,arguments);},Nz=b._emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2=function(){return(Nz=b._emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2).apply(null,arguments);},Oz=b._emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2=function(){return(Oz=b._emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2).apply(null,arguments);},Pz=b._emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2=function(){return(Pz=b._emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2).apply(null,arguments);},Qz=b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0=function(){return(Qz=b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0).apply(null,arguments);},Rz=b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1=function(){return(Rz=b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1).apply(null,arguments);},Sz=b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2=function(){return(Sz=b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2).apply(null,arguments);},Tz=b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1=function(){return(Tz=b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1).apply(null,arguments);},Uz=b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1=function(){return(Uz=b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1).apply(null,arguments);},Vz=b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1=function(){return(Vz=b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1).apply(null,arguments);},Wz=b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1=function(){return(Wz=b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1).apply(null,arguments);},Xz=b._emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0=function(){return(Xz=b._emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0).apply(null,arguments);},Yz=b._emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1=function(){return(Yz=b._emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1).apply(null,arguments);},Zz=b._emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0=function(){return(Zz=b._emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0).apply(null,arguments);},$z=b._emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1=function(){return($z=b._emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1).apply(null,arguments);},aA=b._emscripten_bind_btGeneric6DofSpringConstraint_getParam_2=function(){return(aA=b._emscripten_bind_btGeneric6DofSpringConstraint_getParam_2=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_getParam_2).apply(null,arguments);},bA=b._emscripten_bind_btGeneric6DofSpringConstraint_setParam_3=function(){return(bA=b._emscripten_bind_btGeneric6DofSpringConstraint_setParam_3=b.asm.emscripten_bind_btGeneric6DofSpringConstraint_setParam_3).apply(null,arguments);},cA=b._emscripten_bind_btGeneric6DofSpringConstraint___destroy___0=function(){return(cA=b._emscripten_bind_btGeneric6DofSpringConstraint___destroy___0=b.asm.emscripten_bind_btGeneric6DofSpringConstraint___destroy___0).apply(null,arguments);},dA=b._emscripten_bind_btSphereShape_btSphereShape_1=function(){return(dA=b._emscripten_bind_btSphereShape_btSphereShape_1=b.asm.emscripten_bind_btSphereShape_btSphereShape_1).apply(null,arguments);},eA=b._emscripten_bind_btSphereShape_setMargin_1=function(){return(eA=b._emscripten_bind_btSphereShape_setMargin_1=b.asm.emscripten_bind_btSphereShape_setMargin_1).apply(null,arguments);},fA=b._emscripten_bind_btSphereShape_getMargin_0=function(){return(fA=b._emscripten_bind_btSphereShape_getMargin_0=b.asm.emscripten_bind_btSphereShape_getMargin_0).apply(null,arguments);},gA=b._emscripten_bind_btSphereShape_setLocalScaling_1=function(){return(gA=b._emscripten_bind_btSphereShape_setLocalScaling_1=b.asm.emscripten_bind_btSphereShape_setLocalScaling_1).apply(null,arguments);},hA=b._emscripten_bind_btSphereShape_getLocalScaling_0=function(){return(hA=b._emscripten_bind_btSphereShape_getLocalScaling_0=b.asm.emscripten_bind_btSphereShape_getLocalScaling_0).apply(null,arguments);},iA=b._emscripten_bind_btSphereShape_calculateLocalInertia_2=function(){return(iA=b._emscripten_bind_btSphereShape_calculateLocalInertia_2=b.asm.emscripten_bind_btSphereShape_calculateLocalInertia_2).apply(null,arguments);},jA=b._emscripten_bind_btSphereShape___destroy___0=function(){return(jA=b._emscripten_bind_btSphereShape___destroy___0=b.asm.emscripten_bind_btSphereShape___destroy___0).apply(null,arguments);},kA=b._emscripten_bind_Face_get_m_n_1=function(){return(kA=b._emscripten_bind_Face_get_m_n_1=b.asm.emscripten_bind_Face_get_m_n_1).apply(null,arguments);},lA=b._emscripten_bind_Face_set_m_n_2=function(){return(lA=b._emscripten_bind_Face_set_m_n_2=b.asm.emscripten_bind_Face_set_m_n_2).apply(null,arguments);},mA=b._emscripten_bind_Face_get_m_normal_0=function(){return(mA=b._emscripten_bind_Face_get_m_normal_0=b.asm.emscripten_bind_Face_get_m_normal_0).apply(null,arguments);},nA=b._emscripten_bind_Face_set_m_normal_1=function(){return(nA=b._emscripten_bind_Face_set_m_normal_1=b.asm.emscripten_bind_Face_set_m_normal_1).apply(null,arguments);},oA=b._emscripten_bind_Face_get_m_ra_0=function(){return(oA=b._emscripten_bind_Face_get_m_ra_0=b.asm.emscripten_bind_Face_get_m_ra_0).apply(null,arguments);},pA=b._emscripten_bind_Face_set_m_ra_1=function(){return(pA=b._emscripten_bind_Face_set_m_ra_1=b.asm.emscripten_bind_Face_set_m_ra_1).apply(null,arguments);},qA=b._emscripten_bind_Face___destroy___0=function(){return(qA=b._emscripten_bind_Face___destroy___0=b.asm.emscripten_bind_Face___destroy___0).apply(null,arguments);},rA=b._emscripten_bind_tFaceArray_size_0=function(){return(rA=b._emscripten_bind_tFaceArray_size_0=b.asm.emscripten_bind_tFaceArray_size_0).apply(null,arguments);},sA=b._emscripten_bind_tFaceArray_at_1=function(){return(sA=b._emscripten_bind_tFaceArray_at_1=b.asm.emscripten_bind_tFaceArray_at_1).apply(null,arguments);},tA=b._emscripten_bind_tFaceArray___destroy___0=function(){return(tA=b._emscripten_bind_tFaceArray___destroy___0=b.asm.emscripten_bind_tFaceArray___destroy___0).apply(null,arguments);},uA=b._emscripten_bind_LocalConvexResult_LocalConvexResult_5=function(){return(uA=b._emscripten_bind_LocalConvexResult_LocalConvexResult_5=b.asm.emscripten_bind_LocalConvexResult_LocalConvexResult_5).apply(null,arguments);},vA=b._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0=function(){return(vA=b._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0=b.asm.emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0).apply(null,arguments);},wA=b._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1=function(){return(wA=b._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1=b.asm.emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1).apply(null,arguments);},xA=b._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0=function(){return(xA=b._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0=b.asm.emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0).apply(null,arguments);},yA=b._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1=function(){return(yA=b._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1=b.asm.emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1).apply(null,arguments);},zA=b._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0=function(){return(zA=b._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0=b.asm.emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0).apply(null,arguments);},AA=b._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1=function(){return(AA=b._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1=b.asm.emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1).apply(null,arguments);},BA=b._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0=function(){return(BA=b._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0=b.asm.emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0).apply(null,arguments);},CA=b._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1=function(){return(CA=b._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1=b.asm.emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1).apply(null,arguments);},DA=b._emscripten_bind_LocalConvexResult_get_m_hitFraction_0=function(){return(DA=b._emscripten_bind_LocalConvexResult_get_m_hitFraction_0=b.asm.emscripten_bind_LocalConvexResult_get_m_hitFraction_0).apply(null,arguments);},EA=b._emscripten_bind_LocalConvexResult_set_m_hitFraction_1=function(){return(EA=b._emscripten_bind_LocalConvexResult_set_m_hitFraction_1=b.asm.emscripten_bind_LocalConvexResult_set_m_hitFraction_1).apply(null,arguments);},FA=b._emscripten_bind_LocalConvexResult___destroy___0=function(){return(FA=b._emscripten_bind_LocalConvexResult___destroy___0=b.asm.emscripten_bind_LocalConvexResult___destroy___0).apply(null,arguments);},GA=b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP=function(){return(GA=b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP=b.asm.emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP).apply(null,arguments);},HA=b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP=function(){return(HA=b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP=b.asm.emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP).apply(null,arguments);},IA=b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM=function(){return(IA=b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM=b.asm.emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM).apply(null,arguments);},JA=b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM=function(){return(JA=b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM=b.asm.emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM).apply(null,arguments);},KA=b._emscripten_enum_PHY_ScalarType_PHY_FLOAT=function(){return(KA=b._emscripten_enum_PHY_ScalarType_PHY_FLOAT=b.asm.emscripten_enum_PHY_ScalarType_PHY_FLOAT).apply(null,arguments);},LA=b._emscripten_enum_PHY_ScalarType_PHY_DOUBLE=function(){return(LA=b._emscripten_enum_PHY_ScalarType_PHY_DOUBLE=b.asm.emscripten_enum_PHY_ScalarType_PHY_DOUBLE).apply(null,arguments);},MA=b._emscripten_enum_PHY_ScalarType_PHY_INTEGER=function(){return(MA=b._emscripten_enum_PHY_ScalarType_PHY_INTEGER=b.asm.emscripten_enum_PHY_ScalarType_PHY_INTEGER).apply(null,arguments);},NA=b._emscripten_enum_PHY_ScalarType_PHY_SHORT=function(){return(NA=b._emscripten_enum_PHY_ScalarType_PHY_SHORT=b.asm.emscripten_enum_PHY_ScalarType_PHY_SHORT).apply(null,arguments);},OA=b._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88=function(){return(OA=b._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88=b.asm.emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88).apply(null,arguments);},PA=b._emscripten_enum_PHY_ScalarType_PHY_UCHAR=function(){return(PA=b._emscripten_enum_PHY_ScalarType_PHY_UCHAR=b.asm.emscripten_enum_PHY_ScalarType_PHY_UCHAR).apply(null,arguments);};b._malloc=function(){return(b._malloc=b.asm.malloc).apply(null,arguments);};b._free=function(){return(b._free=b.asm.free).apply(null,arguments);};var xa=b.__growWasmMemory=function(){return(xa=b.__growWasmMemory=b.asm.__growWasmMemory).apply(null,arguments);};b.dynCall_vi=function(){return(b.dynCall_vi=b.asm.dynCall_vi).apply(null,arguments);};b.dynCall_v=function(){return(b.dynCall_v=b.asm.dynCall_v).apply(null,arguments);};b.UTF8ToString=function(a,c){if(a){var d=a+c;for(c=a;Ja[c]&&!(c>=d);)++c;if(16<c-a&&Ja.subarray&&Ga)a=Ga.decode(Ja.subarray(a,c));else{for(d="";a<c;){var e=Ja[a++];if(e&128){var g=Ja[a++]&63;if(192==(e&224))d+=String.fromCharCode((e&31)<<6|g);else{var n=Ja[a++]&63;e=224==(e&240)?(e&15)<<12|g<<6|n:(e&7)<<18|g<<12|n<<6|Ja[a++]&63;65536>e?d+=String.fromCharCode(e):(e-=65536,d+=String.fromCharCode(55296|e>>10,56320|e&1023));}}else d+=String.fromCharCode(e);}a=d;}}else a="";return a;};var QA;Ya=function RA(){QA||SA();QA||(Ya=RA);};function SA(){function a(){if(!QA&&(QA=!0,b.calledRun=!0,!Fa)){Ta=!0;Oa(Qa);Oa(Ra);aa(b);if(b.onRuntimeInitialized)b.onRuntimeInitialized();if(b.postRun)for("function"==typeof b.postRun&&(b.postRun=[b.postRun]);b.postRun.length;){var c=b.postRun.shift();Sa.unshift(c);}Oa(Sa);}}if(!(0<Wa)){if(b.preRun)for("function"==typeof b.preRun&&(b.preRun=[b.preRun]);b.preRun.length;)Ua();Oa(Pa);0<Wa||(b.setStatus?(b.setStatus("Running..."),setTimeout(function(){setTimeout(function(){b.setStatus("");},1);a();},1)):a());}}b.run=SA;if(b.preInit)for("function"==typeof b.preInit&&(b.preInit=[b.preInit]);0<b.preInit.length;)b.preInit.pop()();noExitRuntime=!0;SA();function f(){}f.prototype=Object.create(f.prototype);f.prototype.constructor=f;f.prototype.b=f;f.c={};b.WrapperObject=f;function h(a){return(a||f).c;}b.getCache=h;function k(a,c){var d=h(c),e=d[a];if(e)return e;e=Object.create((c||f).prototype);e.a=a;return d[a]=e;}b.wrapPointer=k;b.castObject=function(a,c){return k(a.a,c);};b.NULL=k(0);b.destroy=function(a){if(!a.__destroy__)throw"Error: Cannot destroy object. (Did you create it yourself?)";a.__destroy__();delete h(a.b)[a.a];};b.compare=function(a,c){return a.a===c.a;};b.getPointer=function(a){return a.a;};b.getClass=function(a){return a.b;};var TA=0,UA=0,VA=0,WA=[],XA=0;function YA(){if(XA){for(var a=0;a<WA.length;a++)b._free(WA[a]);WA.length=0;b._free(TA);TA=0;UA+=XA;XA=0;}TA||(UA+=128,TA=b._malloc(UA),assert(TA));VA=0;}function ZA(a,c){assert(TA);a=a.length*c.BYTES_PER_ELEMENT;a=a+7&-8;VA+a>=UA?(assert(0<a),XA+=a,c=b._malloc(a),WA.push(c)):(c=TA+VA,VA+=a);return c;}function $A(a,c,d){d>>>=0;switch(c.BYTES_PER_ELEMENT){case 2:d>>>=1;break;case 4:d>>>=2;break;case 8:d>>>=3;}for(var e=0;e<a.length;e++)c[d+e]=a[e];}function aB(a){if("string"===typeof a){for(var c=0,d=0;d<a.length;++d){var e=a.charCodeAt(d);55296<=e&&57343>=e&&(e=65536+((e&1023)<<10)|a.charCodeAt(++d)&1023);127>=e?++c:c=2047>=e?c+2:65535>=e?c+3:c+4;}c=Array(c+1);e=c.length;d=0;if(0<e){e=d+e-1;for(var g=0;g<a.length;++g){var n=a.charCodeAt(g);if(55296<=n&&57343>=n){var D=a.charCodeAt(++g);n=65536+((n&1023)<<10)|D&1023;}if(127>=n){if(d>=e)break;c[d++]=n;}else{if(2047>=n){if(d+1>=e)break;c[d++]=192|n>>6;}else{if(65535>=n){if(d+2>=e)break;c[d++]=224|n>>12;}else{if(d+3>=e)break;c[d++]=240|n>>18;c[d++]=128|n>>12&63;}c[d++]=128|n>>6&63;}c[d++]=128|n&63;}}c[d]=0;}a=ZA(c,Ia);$A(c,Ia,a);}return a;}function bB(a){if("object"===typeof a){var c=ZA(a,La);$A(a,La,c);return c;}return a;}function cB(){throw"cannot construct a btCollisionWorld, no constructor in IDL";}cB.prototype=Object.create(f.prototype);cB.prototype.constructor=cB;cB.prototype.b=cB;cB.c={};b.btCollisionWorld=cB;cB.prototype.getDispatcher=function(){return k(kb(this.a),dB);};cB.prototype.rayTest=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);lb(e,a,c,d);};cB.prototype.getPairCache=function(){return k(mb(this.a),eB);};cB.prototype.getDispatchInfo=function(){return k(nb(this.a),l);};cB.prototype.addCollisionObject=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?ob(e,a):void 0===d?pb(e,a,c):qb(e,a,c,d);};cB.prototype.removeCollisionObject=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);rb(c,a);};cB.prototype.getBroadphase=function(){return k(sb(this.a),fB);};cB.prototype.convexSweepTest=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);tb(n,a,c,d,e,g);};cB.prototype.contactPairTest=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);vb(e,a,c,d);};cB.prototype.contactTest=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);wb(d,a,c);};cB.prototype.updateSingleAabb=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);xb(c,a);};cB.prototype.setDebugDrawer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);yb(c,a);};cB.prototype.getDebugDrawer=function(){return k(zb(this.a),gB);};cB.prototype.debugDrawWorld=function(){Ab(this.a);};cB.prototype.debugDrawObject=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Bb(e,a,c,d);};cB.prototype.__destroy__=function(){Cb(this.a);};function m(){throw"cannot construct a btCollisionShape, no constructor in IDL";}m.prototype=Object.create(f.prototype);m.prototype.constructor=m;m.prototype.b=m;m.c={};b.btCollisionShape=m;m.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Db(c,a);};m.prototype.getLocalScaling=function(){return k(Eb(this.a),p);};m.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Fb(d,a,c);};m.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Gb(c,a);};m.prototype.getMargin=function(){return Hb(this.a);};m.prototype.__destroy__=function(){Ib(this.a);};function q(){throw"cannot construct a btCollisionObject, no constructor in IDL";}q.prototype=Object.create(f.prototype);q.prototype.constructor=q;q.prototype.b=q;q.c={};b.btCollisionObject=q;q.prototype.setAnisotropicFriction=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Jb(d,a,c);};q.prototype.getCollisionShape=function(){return k(Kb(this.a),m);};q.prototype.setContactProcessingThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Lb(c,a);};q.prototype.setActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Mb(c,a);};q.prototype.forceActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Nb(c,a);};q.prototype.activate=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);void 0===a?Ob(c):Pb(c,a);};q.prototype.isActive=function(){return!!Qb(this.a);};q.prototype.isKinematicObject=function(){return!!Rb(this.a);};q.prototype.isStaticObject=function(){return!!Sb(this.a);};q.prototype.isStaticOrKinematicObject=function(){return!!Tb(this.a);};q.prototype.getRestitution=function(){return Vb(this.a);};q.prototype.getFriction=function(){return Wb(this.a);};q.prototype.getRollingFriction=function(){return Xb(this.a);};q.prototype.setRestitution=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Yb(c,a);};q.prototype.setFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Zb(c,a);};q.prototype.setRollingFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);$b(c,a);};q.prototype.getWorldTransform=function(){return k(ac(this.a),r);};q.prototype.getCollisionFlags=function(){return bc(this.a);};q.prototype.setCollisionFlags=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);cc(c,a);};q.prototype.setWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ec(c,a);};q.prototype.setCollisionShape=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);fc(c,a);};q.prototype.setCcdMotionThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hc(c,a);};q.prototype.setCcdSweptSphereRadius=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ic(c,a);};q.prototype.getUserIndex=function(){return jc(this.a);};q.prototype.setUserIndex=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);kc(c,a);};q.prototype.getUserPointer=function(){return k(lc(this.a),hB);};q.prototype.setUserPointer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);mc(c,a);};q.prototype.getBroadphaseHandle=function(){return k(nc(this.a),iB);};q.prototype.__destroy__=function(){oc(this.a);};function jB(){throw"cannot construct a btDynamicsWorld, no constructor in IDL";}jB.prototype=Object.create(cB.prototype);jB.prototype.constructor=jB;jB.prototype.b=jB;jB.c={};b.btDynamicsWorld=jB;jB.prototype.addAction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);pc(c,a);};jB.prototype.removeAction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);qc(c,a);};jB.prototype.getSolverInfo=function(){return k(sc(this.a),t);};jB.prototype.setInternalTickCallback=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?tc(e,a):void 0===d?uc(e,a,c):vc(e,a,c,d);};jB.prototype.getDispatcher=function(){return k(wc(this.a),dB);};jB.prototype.rayTest=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);xc(e,a,c,d);};jB.prototype.getPairCache=function(){return k(yc(this.a),eB);};jB.prototype.getDispatchInfo=function(){return k(zc(this.a),l);};jB.prototype.addCollisionObject=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?Ac(e,a):void 0===d?Bc(e,a,c):Ec(e,a,c,d);};jB.prototype.removeCollisionObject=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fc(c,a);};jB.prototype.getBroadphase=function(){return k(Gc(this.a),fB);};jB.prototype.convexSweepTest=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);Hc(n,a,c,d,e,g);};jB.prototype.contactPairTest=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Ic(e,a,c,d);};jB.prototype.contactTest=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Jc(d,a,c);};jB.prototype.updateSingleAabb=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Kc(c,a);};jB.prototype.setDebugDrawer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Lc(c,a);};jB.prototype.getDebugDrawer=function(){return k(Mc(this.a),gB);};jB.prototype.debugDrawWorld=function(){Nc(this.a);};jB.prototype.debugDrawObject=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Oc(e,a,c,d);};jB.prototype.__destroy__=function(){Pc(this.a);};function kB(){throw"cannot construct a btTypedConstraint, no constructor in IDL";}kB.prototype=Object.create(f.prototype);kB.prototype.constructor=kB;kB.prototype.b=kB;kB.c={};b.btTypedConstraint=kB;kB.prototype.enableFeedback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Qc(c,a);};kB.prototype.getBreakingImpulseThreshold=function(){return Rc(this.a);};kB.prototype.setBreakingImpulseThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Sc(c,a);};kB.prototype.getParam=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return Tc(d,a,c);};kB.prototype.setParam=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Uc(e,a,c,d);};kB.prototype.__destroy__=function(){Vc(this.a);};function lB(){throw"cannot construct a btConcaveShape, no constructor in IDL";}lB.prototype=Object.create(m.prototype);lB.prototype.constructor=lB;lB.prototype.b=lB;lB.c={};b.btConcaveShape=lB;lB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Wc(c,a);};lB.prototype.getLocalScaling=function(){return k(Xc(this.a),p);};lB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Yc(d,a,c);};lB.prototype.__destroy__=function(){Zc(this.a);};function mB(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=$c(a,c);h(mB)[this.a]=this;}mB.prototype=Object.create(m.prototype);mB.prototype.constructor=mB;mB.prototype.b=mB;mB.c={};b.btCapsuleShape=mB;mB.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ad(c,a);};mB.prototype.getMargin=function(){return bd(this.a);};mB.prototype.getUpAxis=function(){return cd(this.a);};mB.prototype.getRadius=function(){return dd(this.a);};mB.prototype.getHalfHeight=function(){return ed(this.a);};mB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);fd(c,a);};mB.prototype.getLocalScaling=function(){return k(gd(this.a),p);};mB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);hd(d,a,c);};mB.prototype.__destroy__=function(){id(this.a);};function gB(){throw"cannot construct a btIDebugDraw, no constructor in IDL";}gB.prototype=Object.create(f.prototype);gB.prototype.constructor=gB;gB.prototype.b=gB;gB.c={};b.btIDebugDraw=gB;gB.prototype.drawLine=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);jd(e,a,c,d);};gB.prototype.drawContactPoint=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);kd(n,a,c,d,e,g);};gB.prototype.reportErrorWarning=function(a){var c=this.a;YA();a=a&&"object"===typeof a?a.a:aB(a);ld(c,a);};gB.prototype.draw3dText=function(a,c){var d=this.a;YA();a&&"object"===typeof a&&(a=a.a);c=c&&"object"===typeof c?c.a:aB(c);md(d,a,c);};gB.prototype.setDebugMode=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);nd(c,a);};gB.prototype.getDebugMode=function(){return od(this.a);};gB.prototype.__destroy__=function(){pd(this.a);};function nB(a){a&&"object"===typeof a&&(a=a.a);this.a=void 0===a?qd():rd(a);h(nB)[this.a]=this;}nB.prototype=Object.create(f.prototype);nB.prototype.constructor=nB;nB.prototype.b=nB;nB.c={};b.btDefaultCollisionConfiguration=nB;nB.prototype.__destroy__=function(){sd(this.a);};function oB(){throw"cannot construct a btTriangleMeshShape, no constructor in IDL";}oB.prototype=Object.create(lB.prototype);oB.prototype.constructor=oB;oB.prototype.b=oB;oB.c={};b.btTriangleMeshShape=oB;oB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);td(c,a);};oB.prototype.getLocalScaling=function(){return k(ud(this.a),p);};oB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);vd(d,a,c);};oB.prototype.__destroy__=function(){wd(this.a);};function u(){this.a=xd();h(u)[this.a]=this;}u.prototype=Object.create(q.prototype);u.prototype.constructor=u;u.prototype.b=u;u.c={};b.btGhostObject=u;u.prototype.getNumOverlappingObjects=function(){return yd(this.a);};u.prototype.getOverlappingObject=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(zd(c,a),q);};u.prototype.setAnisotropicFriction=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Ad(d,a,c);};u.prototype.getCollisionShape=function(){return k(Bd(this.a),m);};u.prototype.setContactProcessingThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Cd(c,a);};u.prototype.setActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Dd(c,a);};u.prototype.forceActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ed(c,a);};u.prototype.activate=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);void 0===a?Fd(c):Gd(c,a);};u.prototype.isActive=function(){return!!Hd(this.a);};u.prototype.isKinematicObject=function(){return!!Id(this.a);};u.prototype.isStaticObject=function(){return!!Jd(this.a);};u.prototype.isStaticOrKinematicObject=function(){return!!Kd(this.a);};u.prototype.getRestitution=function(){return Ld(this.a);};u.prototype.getFriction=function(){return Md(this.a);};u.prototype.getRollingFriction=function(){return Nd(this.a);};u.prototype.setRestitution=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Od(c,a);};u.prototype.setFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Pd(c,a);};u.prototype.setRollingFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Qd(c,a);};u.prototype.getWorldTransform=function(){return k(Rd(this.a),r);};u.prototype.getCollisionFlags=function(){return Sd(this.a);};u.prototype.setCollisionFlags=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Td(c,a);};u.prototype.setWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ud(c,a);};u.prototype.setCollisionShape=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Vd(c,a);};u.prototype.setCcdMotionThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Wd(c,a);};u.prototype.setCcdSweptSphereRadius=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Xd(c,a);};u.prototype.getUserIndex=function(){return Yd(this.a);};u.prototype.setUserIndex=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Zd(c,a);};u.prototype.getUserPointer=function(){return k($d(this.a),hB);};u.prototype.setUserPointer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ae(c,a);};u.prototype.getBroadphaseHandle=function(){return k(be(this.a),iB);};u.prototype.__destroy__=function(){ce(this.a);};function pB(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=de(a,c);h(pB)[this.a]=this;}pB.prototype=Object.create(m.prototype);pB.prototype.constructor=pB;pB.prototype.b=pB;pB.c={};b.btConeShape=pB;pB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ee(c,a);};pB.prototype.getLocalScaling=function(){return k(fe(this.a),p);};pB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);ge(d,a,c);};pB.prototype.__destroy__=function(){he(this.a);};function qB(){throw"cannot construct a btActionInterface, no constructor in IDL";}qB.prototype=Object.create(f.prototype);qB.prototype.constructor=qB;qB.prototype.b=qB;qB.c={};b.btActionInterface=qB;qB.prototype.updateAction=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);ie(d,a,c);};qB.prototype.__destroy__=function(){je(this.a);};function p(a,c,d){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);this.a=void 0===a?ke():void 0===c?_emscripten_bind_btVector3_btVector3_1(a):void 0===d?_emscripten_bind_btVector3_btVector3_2(a,c):le(a,c,d);h(p)[this.a]=this;}p.prototype=Object.create(f.prototype);p.prototype.constructor=p;p.prototype.b=p;p.c={};b.btVector3=p;p.prototype.length=p.prototype.length=function(){return me(this.a);};p.prototype.x=p.prototype.x=function(){return ne(this.a);};p.prototype.y=p.prototype.y=function(){return oe(this.a);};p.prototype.z=p.prototype.z=function(){return pe(this.a);};p.prototype.setX=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);qe(c,a);};p.prototype.setY=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);re(c,a);};p.prototype.setZ=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);se(c,a);};p.prototype.setValue=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);te(e,a,c,d);};p.prototype.normalize=p.prototype.normalize=function(){ue(this.a);};p.prototype.rotate=p.prototype.rotate=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return k(ve(d,a,c),p);};p.prototype.dot=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return we(c,a);};p.prototype.op_mul=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(xe(c,a),p);};p.prototype.op_add=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(ye(c,a),p);};p.prototype.op_sub=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(ze(c,a),p);};p.prototype.__destroy__=function(){Ae(this.a);};function rB(){throw"cannot construct a btVehicleRaycaster, no constructor in IDL";}rB.prototype=Object.create(f.prototype);rB.prototype.constructor=rB;rB.prototype.b=rB;rB.c={};b.btVehicleRaycaster=rB;rB.prototype.castRay=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Be(e,a,c,d);};rB.prototype.__destroy__=function(){Ce(this.a);};function sB(){throw"cannot construct a btQuadWord, no constructor in IDL";}sB.prototype=Object.create(f.prototype);sB.prototype.constructor=sB;sB.prototype.b=sB;sB.c={};b.btQuadWord=sB;sB.prototype.x=sB.prototype.x=function(){return De(this.a);};sB.prototype.y=sB.prototype.y=function(){return Ee(this.a);};sB.prototype.z=sB.prototype.z=function(){return Fe(this.a);};sB.prototype.w=function(){return Ge(this.a);};sB.prototype.setX=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);He(c,a);};sB.prototype.setY=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ie(c,a);};sB.prototype.setZ=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Je(c,a);};sB.prototype.setW=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ke(c,a);};sB.prototype.__destroy__=function(){Le(this.a);};function tB(a){a&&"object"===typeof a&&(a=a.a);this.a=Me(a);h(tB)[this.a]=this;}tB.prototype=Object.create(m.prototype);tB.prototype.constructor=tB;tB.prototype.b=tB;tB.c={};b.btCylinderShape=tB;tB.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ne(c,a);};tB.prototype.getMargin=function(){return Oe(this.a);};tB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Pe(c,a);};tB.prototype.getLocalScaling=function(){return k(Qe(this.a),p);};tB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Re(d,a,c);};tB.prototype.__destroy__=function(){Se(this.a);};function w(a,c,d,e){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);this.a=Te(a,c,d,e);h(w)[this.a]=this;}w.prototype=Object.create(jB.prototype);w.prototype.constructor=w;w.prototype.b=w;w.c={};b.btDiscreteDynamicsWorld=w;w.prototype.setGravity=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ue(c,a);};w.prototype.getGravity=function(){return k(Ve(this.a),p);};w.prototype.addRigidBody=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?We(e,a):void 0===d?_emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_2(e,a,c):Xe(e,a,c,d);};w.prototype.removeRigidBody=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ye(c,a);};w.prototype.addConstraint=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);void 0===c?Ze(d,a):$e(d,a,c);};w.prototype.removeConstraint=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);af(c,a);};w.prototype.stepSimulation=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);return void 0===c?bf(e,a):void 0===d?cf(e,a,c):df(e,a,c,d);};w.prototype.setContactAddedCallback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ef(c,a);};w.prototype.setContactProcessedCallback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ff(c,a);};w.prototype.setContactDestroyedCallback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gf(c,a);};w.prototype.getDispatcher=function(){return k(hf(this.a),dB);};w.prototype.rayTest=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);jf(e,a,c,d);};w.prototype.getPairCache=function(){return k(kf(this.a),eB);};w.prototype.getDispatchInfo=function(){return k(lf(this.a),l);};w.prototype.addCollisionObject=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?mf(e,a):void 0===d?nf(e,a,c):of(e,a,c,d);};w.prototype.removeCollisionObject=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);pf(c,a);};w.prototype.getBroadphase=function(){return k(qf(this.a),fB);};w.prototype.convexSweepTest=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);rf(n,a,c,d,e,g);};w.prototype.contactPairTest=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);sf(e,a,c,d);};w.prototype.contactTest=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);tf(d,a,c);};w.prototype.updateSingleAabb=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);uf(c,a);};w.prototype.setDebugDrawer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vf(c,a);};w.prototype.getDebugDrawer=function(){return k(wf(this.a),gB);};w.prototype.debugDrawWorld=function(){xf(this.a);};w.prototype.debugDrawObject=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);yf(e,a,c,d);};w.prototype.addAction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);zf(c,a);};w.prototype.removeAction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Af(c,a);};w.prototype.getSolverInfo=function(){return k(Bf(this.a),t);};w.prototype.setInternalTickCallback=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?Cf(e,a):void 0===d?Df(e,a,c):Ef(e,a,c,d);};w.prototype.__destroy__=function(){Ff(this.a);};function uB(){throw"cannot construct a btConvexShape, no constructor in IDL";}uB.prototype=Object.create(m.prototype);uB.prototype.constructor=uB;uB.prototype.b=uB;uB.c={};b.btConvexShape=uB;uB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Gf(c,a);};uB.prototype.getLocalScaling=function(){return k(Hf(this.a),p);};uB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);If(d,a,c);};uB.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Jf(c,a);};uB.prototype.getMargin=function(){return Kf(this.a);};uB.prototype.__destroy__=function(){Lf(this.a);};function dB(){throw"cannot construct a btDispatcher, no constructor in IDL";}dB.prototype=Object.create(f.prototype);dB.prototype.constructor=dB;dB.prototype.b=dB;dB.c={};b.btDispatcher=dB;dB.prototype.getNumManifolds=function(){return Mf(this.a);};dB.prototype.getManifoldByIndexInternal=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Nf(c,a),vB);};dB.prototype.__destroy__=function(){Of(this.a);};function wB(a,c,d,e,g){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);this.a=void 0===e?Pf(a,c,d):void 0===g?_emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_4(a,c,d,e):Qf(a,c,d,e,g);h(wB)[this.a]=this;}wB.prototype=Object.create(kB.prototype);wB.prototype.constructor=wB;wB.prototype.b=wB;wB.c={};b.btGeneric6DofConstraint=wB;wB.prototype.setLinearLowerLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Rf(c,a);};wB.prototype.setLinearUpperLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Sf(c,a);};wB.prototype.setAngularLowerLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Tf(c,a);};wB.prototype.setAngularUpperLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Uf(c,a);};wB.prototype.getFrameOffsetA=function(){return k(Vf(this.a),r);};wB.prototype.enableFeedback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Wf(c,a);};wB.prototype.getBreakingImpulseThreshold=function(){return Xf(this.a);};wB.prototype.setBreakingImpulseThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Yf(c,a);};wB.prototype.getParam=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return Zf(d,a,c);};wB.prototype.setParam=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);$f(e,a,c,d);};wB.prototype.__destroy__=function(){ag(this.a);};function xB(){throw"cannot construct a btStridingMeshInterface, no constructor in IDL";}xB.prototype=Object.create(f.prototype);xB.prototype.constructor=xB;xB.prototype.b=xB;xB.c={};b.btStridingMeshInterface=xB;xB.prototype.setScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);bg(c,a);};xB.prototype.__destroy__=function(){cg(this.a);};function yB(){throw"cannot construct a btMotionState, no constructor in IDL";}yB.prototype=Object.create(f.prototype);yB.prototype.constructor=yB;yB.prototype.b=yB;yB.c={};b.btMotionState=yB;yB.prototype.getWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);dg(c,a);};yB.prototype.setWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);eg(c,a);};yB.prototype.__destroy__=function(){fg(this.a);};function x(){throw"cannot construct a ConvexResultCallback, no constructor in IDL";}x.prototype=Object.create(f.prototype);x.prototype.constructor=x;x.prototype.b=x;x.c={};b.ConvexResultCallback=x;x.prototype.hasHit=function(){return!!gg(this.a);};x.prototype.get_m_collisionFilterGroup=x.prototype.f=function(){return hg(this.a);};x.prototype.set_m_collisionFilterGroup=x.prototype.h=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ig(c,a);};Object.defineProperty(x.prototype,"m_collisionFilterGroup",{get:x.prototype.f,set:x.prototype.h});x.prototype.get_m_collisionFilterMask=x.prototype.g=function(){return jg(this.a);};x.prototype.set_m_collisionFilterMask=x.prototype.i=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);kg(c,a);};Object.defineProperty(x.prototype,"m_collisionFilterMask",{get:x.prototype.g,set:x.prototype.i});x.prototype.get_m_closestHitFraction=x.prototype.j=function(){return lg(this.a);};x.prototype.set_m_closestHitFraction=x.prototype.l=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);mg(c,a);};Object.defineProperty(x.prototype,"m_closestHitFraction",{get:x.prototype.j,set:x.prototype.l});x.prototype.__destroy__=function(){ng(this.a);};function zB(){throw"cannot construct a ContactResultCallback, no constructor in IDL";}zB.prototype=Object.create(f.prototype);zB.prototype.constructor=zB;zB.prototype.b=zB;zB.c={};b.ContactResultCallback=zB;zB.prototype.addSingleResult=function(a,c,d,e,g,n,D){var Y=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);n&&"object"===typeof n&&(n=n.a);D&&"object"===typeof D&&(D=D.a);return og(Y,a,c,d,e,g,n,D);};zB.prototype.__destroy__=function(){pg(this.a);};function AB(){throw"cannot construct a btSoftBodySolver, no constructor in IDL";}AB.prototype=Object.create(f.prototype);AB.prototype.constructor=AB;AB.prototype.b=AB;AB.c={};b.btSoftBodySolver=AB;AB.prototype.__destroy__=function(){qg(this.a);};function y(){throw"cannot construct a RayResultCallback, no constructor in IDL";}y.prototype=Object.create(f.prototype);y.prototype.constructor=y;y.prototype.b=y;y.c={};b.RayResultCallback=y;y.prototype.hasHit=function(){return!!rg(this.a);};y.prototype.get_m_collisionFilterGroup=y.prototype.f=function(){return sg(this.a);};y.prototype.set_m_collisionFilterGroup=y.prototype.h=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);tg(c,a);};Object.defineProperty(y.prototype,"m_collisionFilterGroup",{get:y.prototype.f,set:y.prototype.h});y.prototype.get_m_collisionFilterMask=y.prototype.g=function(){return ug(this.a);};y.prototype.set_m_collisionFilterMask=y.prototype.i=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vg(c,a);};Object.defineProperty(y.prototype,"m_collisionFilterMask",{get:y.prototype.g,set:y.prototype.i});y.prototype.get_m_closestHitFraction=y.prototype.j=function(){return wg(this.a);};y.prototype.set_m_closestHitFraction=y.prototype.l=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);xg(c,a);};Object.defineProperty(y.prototype,"m_closestHitFraction",{get:y.prototype.j,set:y.prototype.l});y.prototype.get_m_collisionObject=y.prototype.u=function(){return k(yg(this.a),q);};y.prototype.set_m_collisionObject=y.prototype.G=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);zg(c,a);};Object.defineProperty(y.prototype,"m_collisionObject",{get:y.prototype.u,set:y.prototype.G});y.prototype.__destroy__=function(){Ag(this.a);};function BB(){throw"cannot construct a btMatrix3x3, no constructor in IDL";}BB.prototype=Object.create(f.prototype);BB.prototype.constructor=BB;BB.prototype.b=BB;BB.c={};b.btMatrix3x3=BB;BB.prototype.setEulerZYX=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Bg(e,a,c,d);};BB.prototype.getRotation=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Cg(c,a);};BB.prototype.getRow=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Dg(c,a),p);};BB.prototype.__destroy__=function(){Eg(this.a);};function CB(){throw"cannot construct a btScalarArray, no constructor in IDL";}CB.prototype=Object.create(f.prototype);CB.prototype.constructor=CB;CB.prototype.b=CB;CB.c={};b.btScalarArray=CB;CB.prototype.size=CB.prototype.size=function(){return Fg(this.a);};CB.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return Gg(c,a);};CB.prototype.__destroy__=function(){Hg(this.a);};function z(){throw"cannot construct a Material, no constructor in IDL";}z.prototype=Object.create(f.prototype);z.prototype.constructor=z;z.prototype.b=z;z.c={};b.Material=z;z.prototype.get_m_kLST=z.prototype.Kb=function(){return Ig(this.a);};z.prototype.set_m_kLST=z.prototype.ve=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Jg(c,a);};Object.defineProperty(z.prototype,"m_kLST",{get:z.prototype.Kb,set:z.prototype.ve});z.prototype.get_m_kAST=z.prototype.Jb=function(){return Kg(this.a);};z.prototype.set_m_kAST=z.prototype.ue=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Lg(c,a);};Object.defineProperty(z.prototype,"m_kAST",{get:z.prototype.Jb,set:z.prototype.ue});z.prototype.get_m_kVST=z.prototype.Lb=function(){return Mg(this.a);};z.prototype.set_m_kVST=z.prototype.we=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ng(c,a);};Object.defineProperty(z.prototype,"m_kVST",{get:z.prototype.Lb,set:z.prototype.we});z.prototype.get_m_flags=z.prototype.rb=function(){return Og(this.a);};z.prototype.set_m_flags=z.prototype.ce=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Pg(c,a);};Object.defineProperty(z.prototype,"m_flags",{get:z.prototype.rb,set:z.prototype.ce});z.prototype.__destroy__=function(){Qg(this.a);};function l(){throw"cannot construct a btDispatcherInfo, no constructor in IDL";}l.prototype=Object.create(f.prototype);l.prototype.constructor=l;l.prototype.b=l;l.c={};b.btDispatcherInfo=l;l.prototype.get_m_timeStep=l.prototype.zc=function(){return Rg(this.a);};l.prototype.set_m_timeStep=l.prototype.kf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Sg(c,a);};Object.defineProperty(l.prototype,"m_timeStep",{get:l.prototype.zc,set:l.prototype.kf});l.prototype.get_m_stepCount=l.prototype.qc=function(){return Tg(this.a);};l.prototype.set_m_stepCount=l.prototype.af=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ug(c,a);};Object.defineProperty(l.prototype,"m_stepCount",{get:l.prototype.qc,set:l.prototype.af});l.prototype.get_m_dispatchFunc=l.prototype.kb=function(){return Vg(this.a);};l.prototype.set_m_dispatchFunc=l.prototype.Wd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Wg(c,a);};Object.defineProperty(l.prototype,"m_dispatchFunc",{get:l.prototype.kb,set:l.prototype.Wd});l.prototype.get_m_timeOfImpact=l.prototype.yc=function(){return Xg(this.a);};l.prototype.set_m_timeOfImpact=l.prototype.jf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Yg(c,a);};Object.defineProperty(l.prototype,"m_timeOfImpact",{get:l.prototype.yc,set:l.prototype.jf});l.prototype.get_m_useContinuous=l.prototype.Bc=function(){return!!Zg(this.a);};l.prototype.set_m_useContinuous=l.prototype.mf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);$g(c,a);};Object.defineProperty(l.prototype,"m_useContinuous",{get:l.prototype.Bc,set:l.prototype.mf});l.prototype.get_m_enableSatConvex=l.prototype.ob=function(){return!!ah(this.a);};l.prototype.set_m_enableSatConvex=l.prototype.$d=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);bh(c,a);};Object.defineProperty(l.prototype,"m_enableSatConvex",{get:l.prototype.ob,set:l.prototype.$d});l.prototype.get_m_enableSPU=l.prototype.nb=function(){return!!ch(this.a);};l.prototype.set_m_enableSPU=l.prototype.Zd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);dh(c,a);};Object.defineProperty(l.prototype,"m_enableSPU",{get:l.prototype.nb,set:l.prototype.Zd});l.prototype.get_m_useEpa=l.prototype.Dc=function(){return!!eh(this.a);};l.prototype.set_m_useEpa=l.prototype.pf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);fh(c,a);};Object.defineProperty(l.prototype,"m_useEpa",{get:l.prototype.Dc,set:l.prototype.pf});l.prototype.get_m_allowedCcdPenetration=l.prototype.Na=function(){return gh(this.a);};l.prototype.set_m_allowedCcdPenetration=l.prototype.zd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hh(c,a);};Object.defineProperty(l.prototype,"m_allowedCcdPenetration",{get:l.prototype.Na,set:l.prototype.zd});l.prototype.get_m_useConvexConservativeDistanceUtil=l.prototype.Cc=function(){return!!ih(this.a);};l.prototype.set_m_useConvexConservativeDistanceUtil=l.prototype.nf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);jh(c,a);};Object.defineProperty(l.prototype,"m_useConvexConservativeDistanceUtil",{get:l.prototype.Cc,set:l.prototype.nf});l.prototype.get_m_convexConservativeDistanceThreshold=l.prototype.fb=function(){return kh(this.a);};l.prototype.set_m_convexConservativeDistanceThreshold=l.prototype.Rd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lh(c,a);};Object.defineProperty(l.prototype,"m_convexConservativeDistanceThreshold",{get:l.prototype.fb,set:l.prototype.Rd});l.prototype.__destroy__=function(){mh(this.a);};function A(){throw"cannot construct a btWheelInfoConstructionInfo, no constructor in IDL";}A.prototype=Object.create(f.prototype);A.prototype.constructor=A;A.prototype.b=A;A.c={};b.btWheelInfoConstructionInfo=A;A.prototype.get_m_chassisConnectionCS=A.prototype.Za=function(){return k(nh(this.a),p);};A.prototype.set_m_chassisConnectionCS=A.prototype.Ld=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);oh(c,a);};Object.defineProperty(A.prototype,"m_chassisConnectionCS",{get:A.prototype.Za,set:A.prototype.Ld});A.prototype.get_m_wheelDirectionCS=A.prototype.V=function(){return k(ph(this.a),p);};A.prototype.set_m_wheelDirectionCS=A.prototype.fa=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);qh(c,a);};Object.defineProperty(A.prototype,"m_wheelDirectionCS",{get:A.prototype.V,set:A.prototype.fa});A.prototype.get_m_wheelAxleCS=A.prototype.U=function(){return k(rh(this.a),p);};A.prototype.set_m_wheelAxleCS=A.prototype.ea=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);sh(c,a);};Object.defineProperty(A.prototype,"m_wheelAxleCS",{get:A.prototype.U,set:A.prototype.ea});A.prototype.get_m_suspensionRestLength=A.prototype.vc=function(){return th(this.a);};A.prototype.set_m_suspensionRestLength=A.prototype.ff=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);uh(c,a);};Object.defineProperty(A.prototype,"m_suspensionRestLength",{get:A.prototype.vc,set:A.prototype.ff});A.prototype.get_m_maxSuspensionTravelCm=A.prototype.D=function(){return vh(this.a);};A.prototype.set_m_maxSuspensionTravelCm=A.prototype.L=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);wh(c,a);};Object.defineProperty(A.prototype,"m_maxSuspensionTravelCm",{get:A.prototype.D,set:A.prototype.L});A.prototype.get_m_wheelRadius=A.prototype.Jc=function(){return xh(this.a);};A.prototype.set_m_wheelRadius=A.prototype.vf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);yh(c,a);};Object.defineProperty(A.prototype,"m_wheelRadius",{get:A.prototype.Jc,set:A.prototype.vf});A.prototype.get_m_suspensionStiffness=A.prototype.F=function(){return zh(this.a);};A.prototype.set_m_suspensionStiffness=A.prototype.M=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ah(c,a);};Object.defineProperty(A.prototype,"m_suspensionStiffness",{get:A.prototype.F,set:A.prototype.M});A.prototype.get_m_wheelsDampingCompression=A.prototype.W=function(){return Bh(this.a);};A.prototype.set_m_wheelsDampingCompression=A.prototype.ga=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ch(c,a);};Object.defineProperty(A.prototype,"m_wheelsDampingCompression",{get:A.prototype.W,set:A.prototype.ga});A.prototype.get_m_wheelsDampingRelaxation=A.prototype.X=function(){return Dh(this.a);};A.prototype.set_m_wheelsDampingRelaxation=A.prototype.ha=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Eh(c,a);};Object.defineProperty(A.prototype,"m_wheelsDampingRelaxation",{get:A.prototype.X,set:A.prototype.ha});A.prototype.get_m_frictionSlip=A.prototype.v=function(){return Fh(this.a);};A.prototype.set_m_frictionSlip=A.prototype.H=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Gh(c,a);};Object.defineProperty(A.prototype,"m_frictionSlip",{get:A.prototype.v,set:A.prototype.H});A.prototype.get_m_maxSuspensionForce=A.prototype.C=function(){return Hh(this.a);};A.prototype.set_m_maxSuspensionForce=A.prototype.K=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ih(c,a);};Object.defineProperty(A.prototype,"m_maxSuspensionForce",{get:A.prototype.C,set:A.prototype.K});A.prototype.get_m_bIsFrontWheel=A.prototype.O=function(){return!!Jh(this.a);};A.prototype.set_m_bIsFrontWheel=A.prototype.Z=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Kh(c,a);};Object.defineProperty(A.prototype,"m_bIsFrontWheel",{get:A.prototype.O,set:A.prototype.Z});A.prototype.__destroy__=function(){Lh(this.a);};function DB(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=void 0===c?Mh(a):Nh(a,c);h(DB)[this.a]=this;}DB.prototype=Object.create(uB.prototype);DB.prototype.constructor=DB;DB.prototype.b=DB;DB.c={};b.btConvexTriangleMeshShape=DB;DB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Oh(c,a);};DB.prototype.getLocalScaling=function(){return k(Ph(this.a),p);};DB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Qh(d,a,c);};DB.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Rh(c,a);};DB.prototype.getMargin=function(){return Sh(this.a);};DB.prototype.__destroy__=function(){Th(this.a);};function fB(){throw"cannot construct a btBroadphaseInterface, no constructor in IDL";}fB.prototype=Object.create(f.prototype);fB.prototype.constructor=fB;fB.prototype.b=fB;fB.c={};b.btBroadphaseInterface=fB;fB.prototype.getOverlappingPairCache=function(){return k(Uh(this.a),eB);};fB.prototype.__destroy__=function(){Vh(this.a);};function B(a,c,d,e){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);this.a=void 0===e?Wh(a,c,d):Xh(a,c,d,e);h(B)[this.a]=this;}B.prototype=Object.create(f.prototype);B.prototype.constructor=B;B.prototype.b=B;B.c={};b.btRigidBodyConstructionInfo=B;B.prototype.get_m_linearDamping=B.prototype.Mb=function(){return Yh(this.a);};B.prototype.set_m_linearDamping=B.prototype.xe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Zh(c,a);};Object.defineProperty(B.prototype,"m_linearDamping",{get:B.prototype.Mb,set:B.prototype.xe});B.prototype.get_m_angularDamping=B.prototype.Pa=function(){return $h(this.a);};B.prototype.set_m_angularDamping=B.prototype.Bd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ai(c,a);};Object.defineProperty(B.prototype,"m_angularDamping",{get:B.prototype.Pa,set:B.prototype.Bd});B.prototype.get_m_friction=B.prototype.sb=function(){return bi(this.a);};B.prototype.set_m_friction=B.prototype.de=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ci(c,a);};Object.defineProperty(B.prototype,"m_friction",{get:B.prototype.sb,set:B.prototype.de});B.prototype.get_m_rollingFriction=B.prototype.ic=function(){return di(this.a);};B.prototype.set_m_rollingFriction=B.prototype.Te=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ei(c,a);};Object.defineProperty(B.prototype,"m_rollingFriction",{get:B.prototype.ic,set:B.prototype.Te});B.prototype.get_m_restitution=B.prototype.fc=function(){return fi(this.a);};B.prototype.set_m_restitution=B.prototype.Re=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gi(c,a);};Object.defineProperty(B.prototype,"m_restitution",{get:B.prototype.fc,set:B.prototype.Re});B.prototype.get_m_linearSleepingThreshold=B.prototype.Nb=function(){return hi(this.a);};B.prototype.set_m_linearSleepingThreshold=B.prototype.ye=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ii(c,a);};Object.defineProperty(B.prototype,"m_linearSleepingThreshold",{get:B.prototype.Nb,set:B.prototype.ye});B.prototype.get_m_angularSleepingThreshold=B.prototype.Qa=function(){return ji(this.a);};B.prototype.set_m_angularSleepingThreshold=B.prototype.Cd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ki(c,a);};Object.defineProperty(B.prototype,"m_angularSleepingThreshold",{get:B.prototype.Qa,set:B.prototype.Cd});B.prototype.get_m_additionalDamping=B.prototype.Ka=function(){return!!li(this.a);};B.prototype.set_m_additionalDamping=B.prototype.wd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);mi(c,a);};Object.defineProperty(B.prototype,"m_additionalDamping",{get:B.prototype.Ka,set:B.prototype.wd});B.prototype.get_m_additionalDampingFactor=B.prototype.La=function(){return ni(this.a);};B.prototype.set_m_additionalDampingFactor=B.prototype.xd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);oi(c,a);};Object.defineProperty(B.prototype,"m_additionalDampingFactor",{get:B.prototype.La,set:B.prototype.xd});B.prototype.get_m_additionalLinearDampingThresholdSqr=B.prototype.Ma=function(){return pi(this.a);};B.prototype.set_m_additionalLinearDampingThresholdSqr=B.prototype.yd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);qi(c,a);};Object.defineProperty(B.prototype,"m_additionalLinearDampingThresholdSqr",{get:B.prototype.Ma,set:B.prototype.yd});B.prototype.get_m_additionalAngularDampingThresholdSqr=B.prototype.Ja=function(){return ri(this.a);};B.prototype.set_m_additionalAngularDampingThresholdSqr=B.prototype.vd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);si(c,a);};Object.defineProperty(B.prototype,"m_additionalAngularDampingThresholdSqr",{get:B.prototype.Ja,set:B.prototype.vd});B.prototype.get_m_additionalAngularDampingFactor=B.prototype.Ia=function(){return ti(this.a);};B.prototype.set_m_additionalAngularDampingFactor=B.prototype.ud=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ui(c,a);};Object.defineProperty(B.prototype,"m_additionalAngularDampingFactor",{get:B.prototype.Ia,set:B.prototype.ud});B.prototype.__destroy__=function(){vi(this.a);};function EB(){throw"cannot construct a btCollisionConfiguration, no constructor in IDL";}EB.prototype=Object.create(f.prototype);EB.prototype.constructor=EB;EB.prototype.b=EB;EB.c={};b.btCollisionConfiguration=EB;EB.prototype.__destroy__=function(){wi(this.a);};function vB(){this.a=xi();h(vB)[this.a]=this;}vB.prototype=Object.create(f.prototype);vB.prototype.constructor=vB;vB.prototype.b=vB;vB.c={};b.btPersistentManifold=vB;vB.prototype.getBody0=function(){return k(yi(this.a),q);};vB.prototype.getBody1=function(){return k(zi(this.a),q);};vB.prototype.getNumContacts=function(){return Ai(this.a);};vB.prototype.getContactPoint=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Bi(c,a),C);};vB.prototype.__destroy__=function(){Ci(this.a);};function FB(a){a&&"object"===typeof a&&(a=a.a);this.a=void 0===a?Di():Ei(a);h(FB)[this.a]=this;}FB.prototype=Object.create(m.prototype);FB.prototype.constructor=FB;FB.prototype.b=FB;FB.c={};b.btCompoundShape=FB;FB.prototype.addChildShape=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Fi(d,a,c);};FB.prototype.removeChildShape=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Gi(c,a);};FB.prototype.removeChildShapeByIndex=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Hi(c,a);};FB.prototype.getNumChildShapes=function(){return Ii(this.a);};FB.prototype.getChildShape=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Ji(c,a),m);};FB.prototype.updateChildTransform=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===d?Ki(e,a,c):Li(e,a,c,d);};FB.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Mi(c,a);};FB.prototype.getMargin=function(){return Ni(this.a);};FB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Oi(c,a);};FB.prototype.getLocalScaling=function(){return k(Pi(this.a),p);};FB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Qi(d,a,c);};FB.prototype.__destroy__=function(){Ri(this.a);};function E(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=Si(a,c);h(E)[this.a]=this;}E.prototype=Object.create(x.prototype);E.prototype.constructor=E;E.prototype.b=E;E.c={};b.ClosestConvexResultCallback=E;E.prototype.hasHit=function(){return!!Ti(this.a);};E.prototype.get_m_convexFromWorld=E.prototype.gb=function(){return k(Ui(this.a),p);};E.prototype.set_m_convexFromWorld=E.prototype.Sd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Vi(c,a);};Object.defineProperty(E.prototype,"m_convexFromWorld",{get:E.prototype.gb,set:E.prototype.Sd});E.prototype.get_m_convexToWorld=E.prototype.hb=function(){return k(Wi(this.a),p);};E.prototype.set_m_convexToWorld=E.prototype.Td=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Xi(c,a);};Object.defineProperty(E.prototype,"m_convexToWorld",{get:E.prototype.hb,set:E.prototype.Td});E.prototype.get_m_hitNormalWorld=E.prototype.A=function(){return k(Yi(this.a),p);};E.prototype.set_m_hitNormalWorld=E.prototype.I=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Zi(c,a);};Object.defineProperty(E.prototype,"m_hitNormalWorld",{get:E.prototype.A,set:E.prototype.I});E.prototype.get_m_hitPointWorld=E.prototype.B=function(){return k($i(this.a),p);};E.prototype.set_m_hitPointWorld=E.prototype.J=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);aj(c,a);};Object.defineProperty(E.prototype,"m_hitPointWorld",{get:E.prototype.B,set:E.prototype.J});E.prototype.get_m_collisionFilterGroup=E.prototype.f=function(){return bj(this.a);};E.prototype.set_m_collisionFilterGroup=E.prototype.h=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);cj(c,a);};Object.defineProperty(E.prototype,"m_collisionFilterGroup",{get:E.prototype.f,set:E.prototype.h});E.prototype.get_m_collisionFilterMask=E.prototype.g=function(){return dj(this.a);};E.prototype.set_m_collisionFilterMask=E.prototype.i=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ej(c,a);};Object.defineProperty(E.prototype,"m_collisionFilterMask",{get:E.prototype.g,set:E.prototype.i});E.prototype.get_m_closestHitFraction=E.prototype.j=function(){return fj(this.a);};E.prototype.set_m_closestHitFraction=E.prototype.l=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gj(c,a);};Object.defineProperty(E.prototype,"m_closestHitFraction",{get:E.prototype.j,set:E.prototype.l});E.prototype.__destroy__=function(){hj(this.a);};function F(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=ij(a,c);h(F)[this.a]=this;}F.prototype=Object.create(y.prototype);F.prototype.constructor=F;F.prototype.b=F;F.c={};b.AllHitsRayResultCallback=F;F.prototype.hasHit=function(){return!!jj(this.a);};F.prototype.get_m_collisionObjects=F.prototype.bb=function(){return k(kj(this.a),GB);};F.prototype.set_m_collisionObjects=F.prototype.Od=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lj(c,a);};Object.defineProperty(F.prototype,"m_collisionObjects",{get:F.prototype.bb,set:F.prototype.Od});F.prototype.get_m_rayFromWorld=F.prototype.S=function(){return k(mj(this.a),p);};F.prototype.set_m_rayFromWorld=F.prototype.ba=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);nj(c,a);};Object.defineProperty(F.prototype,"m_rayFromWorld",{get:F.prototype.S,set:F.prototype.ba});F.prototype.get_m_rayToWorld=F.prototype.T=function(){return k(oj(this.a),p);};F.prototype.set_m_rayToWorld=F.prototype.da=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);pj(c,a);};Object.defineProperty(F.prototype,"m_rayToWorld",{get:F.prototype.T,set:F.prototype.da});F.prototype.get_m_hitNormalWorld=F.prototype.A=function(){return k(qj(this.a),HB);};F.prototype.set_m_hitNormalWorld=F.prototype.I=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);rj(c,a);};Object.defineProperty(F.prototype,"m_hitNormalWorld",{get:F.prototype.A,set:F.prototype.I});F.prototype.get_m_hitPointWorld=F.prototype.B=function(){return k(sj(this.a),HB);};F.prototype.set_m_hitPointWorld=F.prototype.J=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);tj(c,a);};Object.defineProperty(F.prototype,"m_hitPointWorld",{get:F.prototype.B,set:F.prototype.J});F.prototype.get_m_hitFractions=F.prototype.zb=function(){return k(uj(this.a),CB);};F.prototype.set_m_hitFractions=F.prototype.ke=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vj(c,a);};Object.defineProperty(F.prototype,"m_hitFractions",{get:F.prototype.zb,set:F.prototype.ke});F.prototype.get_m_collisionFilterGroup=F.prototype.f=function(){return wj(this.a);};F.prototype.set_m_collisionFilterGroup=F.prototype.h=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);xj(c,a);};Object.defineProperty(F.prototype,"m_collisionFilterGroup",{get:F.prototype.f,set:F.prototype.h});F.prototype.get_m_collisionFilterMask=F.prototype.g=function(){return yj(this.a);};F.prototype.set_m_collisionFilterMask=F.prototype.i=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);zj(c,a);};Object.defineProperty(F.prototype,"m_collisionFilterMask",{get:F.prototype.g,set:F.prototype.i});F.prototype.get_m_closestHitFraction=F.prototype.j=function(){return Aj(this.a);};F.prototype.set_m_closestHitFraction=F.prototype.l=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Bj(c,a);};Object.defineProperty(F.prototype,"m_closestHitFraction",{get:F.prototype.j,set:F.prototype.l});F.prototype.get_m_collisionObject=F.prototype.u=function(){return k(Cj(this.a),q);};F.prototype.set_m_collisionObject=F.prototype.G=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Dj(c,a);};Object.defineProperty(F.prototype,"m_collisionObject",{get:F.prototype.u,set:F.prototype.G});F.prototype.__destroy__=function(){Ej(this.a);};function IB(){throw"cannot construct a tMaterialArray, no constructor in IDL";}IB.prototype=Object.create(f.prototype);IB.prototype.constructor=IB;IB.prototype.b=IB;IB.c={};b.tMaterialArray=IB;IB.prototype.size=IB.prototype.size=function(){return Fj(this.a);};IB.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Gj(c,a),z);};IB.prototype.__destroy__=function(){Hj(this.a);};function JB(a){a&&"object"===typeof a&&(a=a.a);this.a=Ij(a);h(JB)[this.a]=this;}JB.prototype=Object.create(rB.prototype);JB.prototype.constructor=JB;JB.prototype.b=JB;JB.c={};b.btDefaultVehicleRaycaster=JB;JB.prototype.castRay=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Jj(e,a,c,d);};JB.prototype.__destroy__=function(){Kj(this.a);};function KB(){this.a=Lj();h(KB)[this.a]=this;}KB.prototype=Object.create(lB.prototype);KB.prototype.constructor=KB;KB.prototype.b=KB;KB.c={};b.btEmptyShape=KB;KB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Mj(c,a);};KB.prototype.getLocalScaling=function(){return k(Nj(this.a),p);};KB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Oj(d,a,c);};KB.prototype.__destroy__=function(){Pj(this.a);};function G(){this.a=Qj();h(G)[this.a]=this;}G.prototype=Object.create(f.prototype);G.prototype.constructor=G;G.prototype.b=G;G.c={};b.btConstraintSetting=G;G.prototype.get_m_tau=G.prototype.xc=function(){return Rj(this.a);};G.prototype.set_m_tau=G.prototype.hf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Sj(c,a);};Object.defineProperty(G.prototype,"m_tau",{get:G.prototype.xc,set:G.prototype.hf});G.prototype.get_m_damping=G.prototype.ib=function(){return Tj(this.a);};G.prototype.set_m_damping=G.prototype.Ud=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Uj(c,a);};Object.defineProperty(G.prototype,"m_damping",{get:G.prototype.ib,set:G.prototype.Ud});G.prototype.get_m_impulseClamp=G.prototype.Fb=function(){return Vj(this.a);};G.prototype.set_m_impulseClamp=G.prototype.qe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Wj(c,a);};Object.defineProperty(G.prototype,"m_impulseClamp",{get:G.prototype.Fb,set:G.prototype.qe});G.prototype.__destroy__=function(){Xj(this.a);};function LB(){throw"cannot construct a LocalShapeInfo, no constructor in IDL";}LB.prototype=Object.create(f.prototype);LB.prototype.constructor=LB;LB.prototype.b=LB;LB.c={};b.LocalShapeInfo=LB;LB.prototype.get_m_shapePart=LB.prototype.lc=function(){return Yj(this.a);};LB.prototype.set_m_shapePart=LB.prototype.We=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Zj(c,a);};Object.defineProperty(LB.prototype,"m_shapePart",{get:LB.prototype.lc,set:LB.prototype.We});LB.prototype.get_m_triangleIndex=LB.prototype.Ac=function(){return ak(this.a);};LB.prototype.set_m_triangleIndex=LB.prototype.lf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);bk(c,a);};Object.defineProperty(LB.prototype,"m_triangleIndex",{get:LB.prototype.Ac,set:LB.prototype.lf});LB.prototype.__destroy__=function(){ck(this.a);};function H(a){a&&"object"===typeof a&&(a=a.a);this.a=dk(a);h(H)[this.a]=this;}H.prototype=Object.create(q.prototype);H.prototype.constructor=H;H.prototype.b=H;H.c={};b.btRigidBody=H;H.prototype.getCenterOfMassTransform=function(){return k(ek(this.a),r);};H.prototype.setCenterOfMassTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);fk(c,a);};H.prototype.setSleepingThresholds=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);gk(d,a,c);};H.prototype.getLinearDamping=function(){return hk(this.a);};H.prototype.getAngularDamping=function(){return ik(this.a);};H.prototype.setDamping=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);jk(d,a,c);};H.prototype.setMassProps=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);kk(d,a,c);};H.prototype.getLinearFactor=function(){return k(lk(this.a),p);};H.prototype.setLinearFactor=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);mk(c,a);};H.prototype.applyTorque=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);nk(c,a);};H.prototype.applyLocalTorque=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ok(c,a);};H.prototype.applyForce=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);pk(d,a,c);};H.prototype.applyCentralForce=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);qk(c,a);};H.prototype.applyCentralLocalForce=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);rk(c,a);};H.prototype.applyTorqueImpulse=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);sk(c,a);};H.prototype.applyImpulse=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);tk(d,a,c);};H.prototype.applyCentralImpulse=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);uk(c,a);};H.prototype.updateInertiaTensor=function(){vk(this.a);};H.prototype.getLinearVelocity=function(){return k(wk(this.a),p);};H.prototype.getAngularVelocity=function(){return k(xk(this.a),p);};H.prototype.setLinearVelocity=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);yk(c,a);};H.prototype.setAngularVelocity=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);zk(c,a);};H.prototype.getMotionState=function(){return k(Ak(this.a),yB);};H.prototype.setMotionState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Bk(c,a);};H.prototype.getAngularFactor=function(){return k(Ck(this.a),p);};H.prototype.setAngularFactor=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Dk(c,a);};H.prototype.upcast=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Ek(c,a),H);};H.prototype.getAabb=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Fk(d,a,c);};H.prototype.applyGravity=function(){Gk(this.a);};H.prototype.getGravity=function(){return k(Hk(this.a),p);};H.prototype.setGravity=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ik(c,a);};H.prototype.getBroadphaseProxy=function(){return k(Jk(this.a),iB);};H.prototype.clearForces=function(){Kk(this.a);};H.prototype.setAnisotropicFriction=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Lk(d,a,c);};H.prototype.getCollisionShape=function(){return k(Mk(this.a),m);};H.prototype.setContactProcessingThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Nk(c,a);};H.prototype.setActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ok(c,a);};H.prototype.forceActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Pk(c,a);};H.prototype.activate=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);void 0===a?Qk(c):Rk(c,a);};H.prototype.isActive=function(){return!!Sk(this.a);};H.prototype.isKinematicObject=function(){return!!Tk(this.a);};H.prototype.isStaticObject=function(){return!!Uk(this.a);};H.prototype.isStaticOrKinematicObject=function(){return!!Vk(this.a);};H.prototype.getRestitution=function(){return Wk(this.a);};H.prototype.getFriction=function(){return Xk(this.a);};H.prototype.getRollingFriction=function(){return Yk(this.a);};H.prototype.setRestitution=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Zk(c,a);};H.prototype.setFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);$k(c,a);};H.prototype.setRollingFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);al(c,a);};H.prototype.getWorldTransform=function(){return k(bl(this.a),r);};H.prototype.getCollisionFlags=function(){return cl(this.a);};H.prototype.setCollisionFlags=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);dl(c,a);};H.prototype.setWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);el(c,a);};H.prototype.setCollisionShape=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);fl(c,a);};H.prototype.setCcdMotionThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gl(c,a);};H.prototype.setCcdSweptSphereRadius=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hl(c,a);};H.prototype.getUserIndex=function(){return il(this.a);};H.prototype.setUserIndex=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);jl(c,a);};H.prototype.getUserPointer=function(){return k(kl(this.a),hB);};H.prototype.setUserPointer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ll(c,a);};H.prototype.getBroadphaseHandle=function(){return k(ml(this.a),iB);};H.prototype.__destroy__=function(){nl(this.a);};function MB(){throw"cannot construct a btIndexedMeshArray, no constructor in IDL";}MB.prototype=Object.create(f.prototype);MB.prototype.constructor=MB;MB.prototype.b=MB;MB.c={};b.btIndexedMeshArray=MB;MB.prototype.size=MB.prototype.size=function(){return ol(this.a);};MB.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(pl(c,a),NB);};MB.prototype.__destroy__=function(){ql(this.a);};function OB(){this.a=rl();h(OB)[this.a]=this;}OB.prototype=Object.create(f.prototype);OB.prototype.constructor=OB;OB.prototype.b=OB;OB.c={};b.btDbvtBroadphase=OB;OB.prototype.__destroy__=function(){sl(this.a);};function PB(a,c,d,e,g,n,D,Y,ma){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);n&&"object"===typeof n&&(n=n.a);D&&"object"===typeof D&&(D=D.a);Y&&"object"===typeof Y&&(Y=Y.a);ma&&"object"===typeof ma&&(ma=ma.a);this.a=tl(a,c,d,e,g,n,D,Y,ma);h(PB)[this.a]=this;}PB.prototype=Object.create(lB.prototype);PB.prototype.constructor=PB;PB.prototype.b=PB;PB.c={};b.btHeightfieldTerrainShape=PB;PB.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ul(c,a);};PB.prototype.getMargin=function(){return vl(this.a);};PB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);wl(c,a);};PB.prototype.getLocalScaling=function(){return k(xl(this.a),p);};PB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);yl(d,a,c);};PB.prototype.__destroy__=function(){zl(this.a);};function QB(){this.a=Al();h(QB)[this.a]=this;}QB.prototype=Object.create(AB.prototype);QB.prototype.constructor=QB;QB.prototype.b=QB;QB.c={};b.btDefaultSoftBodySolver=QB;QB.prototype.__destroy__=function(){Bl(this.a);};function RB(a){a&&"object"===typeof a&&(a=a.a);this.a=Cl(a);h(RB)[this.a]=this;}RB.prototype=Object.create(dB.prototype);RB.prototype.constructor=RB;RB.prototype.b=RB;RB.c={};b.btCollisionDispatcher=RB;RB.prototype.getNumManifolds=function(){return Dl(this.a);};RB.prototype.getManifoldByIndexInternal=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(El(c,a),vB);};RB.prototype.__destroy__=function(){Fl(this.a);};function SB(a,c,d,e,g){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);this.a=void 0===d?Gl(a,c):void 0===e?Hl(a,c,d):void 0===g?Il(a,c,d,e):Jl(a,c,d,e,g);h(SB)[this.a]=this;}SB.prototype=Object.create(f.prototype);SB.prototype.constructor=SB;SB.prototype.b=SB;SB.c={};b.btAxisSweep3=SB;SB.prototype.__destroy__=function(){Kl(this.a);};function hB(){throw"cannot construct a VoidPtr, no constructor in IDL";}hB.prototype=Object.create(f.prototype);hB.prototype.constructor=hB;hB.prototype.b=hB;hB.c={};b.VoidPtr=hB;hB.prototype.__destroy__=function(){Ll(this.a);};function I(){this.a=Ml();h(I)[this.a]=this;}I.prototype=Object.create(f.prototype);I.prototype.constructor=I;I.prototype.b=I;I.c={};b.btSoftBodyWorldInfo=I;I.prototype.get_air_density=I.prototype.ma=function(){return Nl(this.a);};I.prototype.set_air_density=I.prototype.Xc=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ol(c,a);};Object.defineProperty(I.prototype,"air_density",{get:I.prototype.ma,set:I.prototype.Xc});I.prototype.get_water_density=I.prototype.Sc=function(){return Pl(this.a);};I.prototype.set_water_density=I.prototype.Ef=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ql(c,a);};Object.defineProperty(I.prototype,"water_density",{get:I.prototype.Sc,set:I.prototype.Ef});I.prototype.get_water_offset=I.prototype.Uc=function(){return Rl(this.a);};I.prototype.set_water_offset=I.prototype.Gf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Sl(c,a);};Object.defineProperty(I.prototype,"water_offset",{get:I.prototype.Uc,set:I.prototype.Gf});I.prototype.get_m_maxDisplacement=I.prototype.Tb=function(){return Tl(this.a);};I.prototype.set_m_maxDisplacement=I.prototype.Ee=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ul(c,a);};Object.defineProperty(I.prototype,"m_maxDisplacement",{get:I.prototype.Tb,set:I.prototype.Ee});I.prototype.get_water_normal=I.prototype.Tc=function(){return k(Vl(this.a),p);};I.prototype.set_water_normal=I.prototype.Ff=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Wl(c,a);};Object.defineProperty(I.prototype,"water_normal",{get:I.prototype.Tc,set:I.prototype.Ff});I.prototype.get_m_broadphase=I.prototype.Ua=function(){return k(Xl(this.a),fB);};I.prototype.set_m_broadphase=I.prototype.Gd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Yl(c,a);};Object.defineProperty(I.prototype,"m_broadphase",{get:I.prototype.Ua,set:I.prototype.Gd});I.prototype.get_m_dispatcher=I.prototype.lb=function(){return k(Zl(this.a),dB);};I.prototype.set_m_dispatcher=I.prototype.Xd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);$l(c,a);};Object.defineProperty(I.prototype,"m_dispatcher",{get:I.prototype.lb,set:I.prototype.Xd});I.prototype.get_m_gravity=I.prototype.ub=function(){return k(am(this.a),p);};I.prototype.set_m_gravity=I.prototype.fe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);bm(c,a);};Object.defineProperty(I.prototype,"m_gravity",{get:I.prototype.ub,set:I.prototype.fe});I.prototype.__destroy__=function(){cm(this.a);};function TB(a,c,d,e){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);this.a=void 0===d?dm(a,c):void 0===e?_emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_3(a,c,d):em(a,c,d,e);h(TB)[this.a]=this;}TB.prototype=Object.create(kB.prototype);TB.prototype.constructor=TB;TB.prototype.b=TB;TB.c={};b.btConeTwistConstraint=TB;TB.prototype.setLimit=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);fm(d,a,c);};TB.prototype.setAngularOnly=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gm(c,a);};TB.prototype.setDamping=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hm(c,a);};TB.prototype.enableMotor=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);im(c,a);};TB.prototype.setMaxMotorImpulse=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);jm(c,a);};TB.prototype.setMaxMotorImpulseNormalized=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);km(c,a);};TB.prototype.setMotorTarget=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lm(c,a);};TB.prototype.setMotorTargetInConstraintSpace=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);mm(c,a);};TB.prototype.enableFeedback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);nm(c,a);};TB.prototype.getBreakingImpulseThreshold=function(){return om(this.a);};TB.prototype.setBreakingImpulseThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);pm(c,a);};TB.prototype.getParam=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return qm(d,a,c);};TB.prototype.setParam=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);rm(e,a,c,d);};TB.prototype.__destroy__=function(){sm(this.a);};function UB(a,c,d,e,g,n,D){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);n&&"object"===typeof n&&(n=n.a);D&&"object"===typeof D&&(D=D.a);this.a=void 0===d?tm(a,c):void 0===e?um(a,c,d):void 0===g?wm(a,c,d,e):void 0===n?xm(a,c,d,e,g):void 0===D?ym(a,c,d,e,g,n):zm(a,c,d,e,g,n,D);h(UB)[this.a]=this;}UB.prototype=Object.create(kB.prototype);UB.prototype.constructor=UB;UB.prototype.b=UB;UB.c={};b.btHingeConstraint=UB;UB.prototype.setLimit=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);void 0===g?Am(n,a,c,d,e):Bm(n,a,c,d,e,g);};UB.prototype.enableAngularMotor=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Cm(e,a,c,d);};UB.prototype.setAngularOnly=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Dm(c,a);};UB.prototype.enableMotor=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Em(c,a);};UB.prototype.setMaxMotorImpulse=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fm(c,a);};UB.prototype.setMotorTarget=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Gm(d,a,c);};UB.prototype.enableFeedback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Hm(c,a);};UB.prototype.getBreakingImpulseThreshold=function(){return Im(this.a);};UB.prototype.setBreakingImpulseThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Jm(c,a);};UB.prototype.getParam=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return Km(d,a,c);};UB.prototype.setParam=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Lm(e,a,c,d);};UB.prototype.__destroy__=function(){Mm(this.a);};function VB(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=Nm(a,c);h(VB)[this.a]=this;}VB.prototype=Object.create(pB.prototype);VB.prototype.constructor=VB;VB.prototype.b=VB;VB.c={};b.btConeShapeZ=VB;VB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Om(c,a);};VB.prototype.getLocalScaling=function(){return k(Pm(this.a),p);};VB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Qm(d,a,c);};VB.prototype.__destroy__=function(){Rm(this.a);};function WB(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=Sm(a,c);h(WB)[this.a]=this;}WB.prototype=Object.create(pB.prototype);WB.prototype.constructor=WB;WB.prototype.b=WB;WB.c={};b.btConeShapeX=WB;WB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Tm(c,a);};WB.prototype.getLocalScaling=function(){return k(Um(this.a),p);};WB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Vm(d,a,c);};WB.prototype.__destroy__=function(){Wm(this.a);};function XB(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=void 0===a?Xm():void 0===c?Ym(a):Zm(a,c);h(XB)[this.a]=this;}XB.prototype=Object.create(xB.prototype);XB.prototype.constructor=XB;XB.prototype.b=XB;XB.c={};b.btTriangleMesh=XB;XB.prototype.addTriangle=function(a,c,d,e){var g=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);void 0===e?$m(g,a,c,d):an(g,a,c,d,e);};XB.prototype.findOrAddVertex=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return bn(d,a,c);};XB.prototype.addIndex=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);cn(c,a);};XB.prototype.getIndexedMeshArray=function(){return k(dn(this.a),MB);};XB.prototype.setScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);en(c,a);};XB.prototype.__destroy__=function(){fn(this.a);};function YB(a,c){YA();"object"==typeof a&&(a=bB(a));c&&"object"===typeof c&&(c=c.a);this.a=void 0===a?gn():void 0===c?hn(a):jn(a,c);h(YB)[this.a]=this;}YB.prototype=Object.create(m.prototype);YB.prototype.constructor=YB;YB.prototype.b=YB;YB.c={};b.btConvexHullShape=YB;YB.prototype.addPoint=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);void 0===c?kn(d,a):ln(d,a,c);};YB.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);mn(c,a);};YB.prototype.getMargin=function(){return nn(this.a);};YB.prototype.getNumVertices=function(){return on(this.a);};YB.prototype.initializePolyhedralFeatures=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return!!pn(c,a);};YB.prototype.recalcLocalAabb=function(){qn(this.a);};YB.prototype.getConvexPolyhedron=function(){return k(rn(this.a),ZB);};YB.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);sn(c,a);};YB.prototype.getLocalScaling=function(){return k(tn(this.a),p);};YB.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);un(d,a,c);};YB.prototype.__destroy__=function(){vn(this.a);};function K(){this.a=wn();h(K)[this.a]=this;}K.prototype=Object.create(f.prototype);K.prototype.constructor=K;K.prototype.b=K;K.c={};b.btVehicleTuning=K;K.prototype.get_m_suspensionStiffness=K.prototype.F=function(){return xn(this.a);};K.prototype.set_m_suspensionStiffness=K.prototype.M=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);yn(c,a);};Object.defineProperty(K.prototype,"m_suspensionStiffness",{get:K.prototype.F,set:K.prototype.M});K.prototype.get_m_suspensionCompression=K.prototype.rc=function(){return zn(this.a);};K.prototype.set_m_suspensionCompression=K.prototype.bf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);An(c,a);};Object.defineProperty(K.prototype,"m_suspensionCompression",{get:K.prototype.rc,set:K.prototype.bf});K.prototype.get_m_suspensionDamping=K.prototype.sc=function(){return Bn(this.a);};K.prototype.set_m_suspensionDamping=K.prototype.cf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Cn(c,a);};Object.defineProperty(K.prototype,"m_suspensionDamping",{get:K.prototype.sc,set:K.prototype.cf});K.prototype.get_m_maxSuspensionTravelCm=K.prototype.D=function(){return Dn(this.a);};K.prototype.set_m_maxSuspensionTravelCm=K.prototype.L=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);En(c,a);};Object.defineProperty(K.prototype,"m_maxSuspensionTravelCm",{get:K.prototype.D,set:K.prototype.L});K.prototype.get_m_frictionSlip=K.prototype.v=function(){return Fn(this.a);};K.prototype.set_m_frictionSlip=K.prototype.H=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Gn(c,a);};Object.defineProperty(K.prototype,"m_frictionSlip",{get:K.prototype.v,set:K.prototype.H});K.prototype.get_m_maxSuspensionForce=K.prototype.C=function(){return Hn(this.a);};K.prototype.set_m_maxSuspensionForce=K.prototype.K=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);In(c,a);};Object.defineProperty(K.prototype,"m_maxSuspensionForce",{get:K.prototype.C,set:K.prototype.K});function $B(){throw"cannot construct a btCollisionObjectWrapper, no constructor in IDL";}$B.prototype=Object.create(f.prototype);$B.prototype.constructor=$B;$B.prototype.b=$B;$B.c={};b.btCollisionObjectWrapper=$B;$B.prototype.getWorldTransform=function(){return k(Jn(this.a),r);};$B.prototype.getCollisionObject=function(){return k(Kn(this.a),q);};$B.prototype.getCollisionShape=function(){return k(Ln(this.a),m);};function aC(a){a&&"object"===typeof a&&(a=a.a);this.a=Mn(a);h(aC)[this.a]=this;}aC.prototype=Object.create(f.prototype);aC.prototype.constructor=aC;aC.prototype.b=aC;aC.c={};b.btShapeHull=aC;aC.prototype.buildHull=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return!!Nn(c,a);};aC.prototype.numVertices=function(){return On(this.a);};aC.prototype.getVertexPointer=function(){return k(Pn(this.a),p);};aC.prototype.__destroy__=function(){Qn(this.a);};function bC(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=void 0===a?Rn():void 0===c?Sn(a):Tn(a,c);h(bC)[this.a]=this;}bC.prototype=Object.create(yB.prototype);bC.prototype.constructor=bC;bC.prototype.b=bC;bC.c={};b.btDefaultMotionState=bC;bC.prototype.getWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Un(c,a);};bC.prototype.setWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Vn(c,a);};bC.prototype.get_m_graphicsWorldTrans=bC.prototype.tb=function(){return k(Wn(this.a),r);};bC.prototype.set_m_graphicsWorldTrans=bC.prototype.ee=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Xn(c,a);};Object.defineProperty(bC.prototype,"m_graphicsWorldTrans",{get:bC.prototype.tb,set:bC.prototype.ee});bC.prototype.__destroy__=function(){Yn(this.a);};function L(a){a&&"object"===typeof a&&(a=a.a);this.a=Zn(a);h(L)[this.a]=this;}L.prototype=Object.create(f.prototype);L.prototype.constructor=L;L.prototype.b=L;L.c={};b.btWheelInfo=L;L.prototype.getSuspensionRestLength=function(){return $n(this.a);};L.prototype.updateWheel=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);ao(d,a,c);};L.prototype.get_m_suspensionStiffness=L.prototype.F=function(){return bo(this.a);};L.prototype.set_m_suspensionStiffness=L.prototype.M=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);co(c,a);};Object.defineProperty(L.prototype,"m_suspensionStiffness",{get:L.prototype.F,set:L.prototype.M});L.prototype.get_m_frictionSlip=L.prototype.v=function(){return eo(this.a);};L.prototype.set_m_frictionSlip=L.prototype.H=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);fo(c,a);};Object.defineProperty(L.prototype,"m_frictionSlip",{get:L.prototype.v,set:L.prototype.H});L.prototype.get_m_engineForce=L.prototype.pb=function(){return go(this.a);};L.prototype.set_m_engineForce=L.prototype.ae=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ho(c,a);};Object.defineProperty(L.prototype,"m_engineForce",{get:L.prototype.pb,set:L.prototype.ae});L.prototype.get_m_rollInfluence=L.prototype.hc=function(){return io(this.a);};L.prototype.set_m_rollInfluence=L.prototype.Se=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);jo(c,a);};Object.defineProperty(L.prototype,"m_rollInfluence",{get:L.prototype.hc,set:L.prototype.Se});L.prototype.get_m_suspensionRestLength1=L.prototype.wc=function(){return ko(this.a);};L.prototype.set_m_suspensionRestLength1=L.prototype.gf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lo(c,a);};Object.defineProperty(L.prototype,"m_suspensionRestLength1",{get:L.prototype.wc,set:L.prototype.gf});L.prototype.get_m_wheelsRadius=L.prototype.Kc=function(){return mo(this.a);};L.prototype.set_m_wheelsRadius=L.prototype.wf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);no(c,a);};Object.defineProperty(L.prototype,"m_wheelsRadius",{get:L.prototype.Kc,set:L.prototype.wf});L.prototype.get_m_wheelsDampingCompression=L.prototype.W=function(){return oo(this.a);};L.prototype.set_m_wheelsDampingCompression=L.prototype.ga=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);po(c,a);};Object.defineProperty(L.prototype,"m_wheelsDampingCompression",{get:L.prototype.W,set:L.prototype.ga});L.prototype.get_m_wheelsDampingRelaxation=L.prototype.X=function(){return qo(this.a);};L.prototype.set_m_wheelsDampingRelaxation=L.prototype.ha=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ro(c,a);};Object.defineProperty(L.prototype,"m_wheelsDampingRelaxation",{get:L.prototype.X,set:L.prototype.ha});L.prototype.get_m_steering=L.prototype.pc=function(){return so(this.a);};L.prototype.set_m_steering=L.prototype.$e=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);to(c,a);};Object.defineProperty(L.prototype,"m_steering",{get:L.prototype.pc,set:L.prototype.$e});L.prototype.get_m_maxSuspensionForce=L.prototype.C=function(){return uo(this.a);};L.prototype.set_m_maxSuspensionForce=L.prototype.K=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vo(c,a);};Object.defineProperty(L.prototype,"m_maxSuspensionForce",{get:L.prototype.C,set:L.prototype.K});L.prototype.get_m_maxSuspensionTravelCm=L.prototype.D=function(){return wo(this.a);};L.prototype.set_m_maxSuspensionTravelCm=L.prototype.L=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);xo(c,a);};Object.defineProperty(L.prototype,"m_maxSuspensionTravelCm",{get:L.prototype.D,set:L.prototype.L});L.prototype.get_m_wheelsSuspensionForce=L.prototype.Lc=function(){return yo(this.a);};L.prototype.set_m_wheelsSuspensionForce=L.prototype.xf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);zo(c,a);};Object.defineProperty(L.prototype,"m_wheelsSuspensionForce",{get:L.prototype.Lc,set:L.prototype.xf});L.prototype.get_m_bIsFrontWheel=L.prototype.O=function(){return!!Ao(this.a);};L.prototype.set_m_bIsFrontWheel=L.prototype.Z=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Bo(c,a);};Object.defineProperty(L.prototype,"m_bIsFrontWheel",{get:L.prototype.O,set:L.prototype.Z});L.prototype.get_m_raycastInfo=L.prototype.ec=function(){return k(Co(this.a),M);};L.prototype.set_m_raycastInfo=L.prototype.Qe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Do(c,a);};Object.defineProperty(L.prototype,"m_raycastInfo",{get:L.prototype.ec,set:L.prototype.Qe});L.prototype.get_m_chassisConnectionPointCS=L.prototype.$a=function(){return k(Eo(this.a),p);};L.prototype.set_m_chassisConnectionPointCS=L.prototype.Md=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fo(c,a);};Object.defineProperty(L.prototype,"m_chassisConnectionPointCS",{get:L.prototype.$a,set:L.prototype.Md});L.prototype.get_m_worldTransform=L.prototype.Mc=function(){return k(Go(this.a),r);};L.prototype.set_m_worldTransform=L.prototype.yf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ho(c,a);};Object.defineProperty(L.prototype,"m_worldTransform",{get:L.prototype.Mc,set:L.prototype.yf});L.prototype.get_m_wheelDirectionCS=L.prototype.V=function(){return k(Io(this.a),p);};L.prototype.set_m_wheelDirectionCS=L.prototype.fa=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Jo(c,a);};Object.defineProperty(L.prototype,"m_wheelDirectionCS",{get:L.prototype.V,set:L.prototype.fa});L.prototype.get_m_wheelAxleCS=L.prototype.U=function(){return k(Ko(this.a),p);};L.prototype.set_m_wheelAxleCS=L.prototype.ea=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Lo(c,a);};Object.defineProperty(L.prototype,"m_wheelAxleCS",{get:L.prototype.U,set:L.prototype.ea});L.prototype.get_m_rotation=L.prototype.jc=function(){return Mo(this.a);};L.prototype.set_m_rotation=L.prototype.Ue=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);No(c,a);};Object.defineProperty(L.prototype,"m_rotation",{get:L.prototype.jc,set:L.prototype.Ue});L.prototype.get_m_deltaRotation=L.prototype.jb=function(){return Oo(this.a);};L.prototype.set_m_deltaRotation=L.prototype.Vd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Po(c,a);};Object.defineProperty(L.prototype,"m_deltaRotation",{get:L.prototype.jb,set:L.prototype.Vd});L.prototype.get_m_brake=L.prototype.Ta=function(){return Qo(this.a);};L.prototype.set_m_brake=L.prototype.Fd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ro(c,a);};Object.defineProperty(L.prototype,"m_brake",{get:L.prototype.Ta,set:L.prototype.Fd});L.prototype.get_m_clippedInvContactDotSuspension=L.prototype.ab=function(){return So(this.a);};L.prototype.set_m_clippedInvContactDotSuspension=L.prototype.Nd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);To(c,a);};Object.defineProperty(L.prototype,"m_clippedInvContactDotSuspension",{get:L.prototype.ab,set:L.prototype.Nd});L.prototype.get_m_suspensionRelativeVelocity=L.prototype.uc=function(){return Uo(this.a);};L.prototype.set_m_suspensionRelativeVelocity=L.prototype.ef=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Vo(c,a);};Object.defineProperty(L.prototype,"m_suspensionRelativeVelocity",{get:L.prototype.uc,set:L.prototype.ef});L.prototype.get_m_skidInfo=L.prototype.mc=function(){return Wo(this.a);};L.prototype.set_m_skidInfo=L.prototype.Xe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Xo(c,a);};Object.defineProperty(L.prototype,"m_skidInfo",{get:L.prototype.mc,set:L.prototype.Xe});L.prototype.__destroy__=function(){Yo(this.a);};function N(a,c,d,e){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);this.a=void 0===a?Zo():void 0===c?_emscripten_bind_btVector4_btVector4_1(a):void 0===d?_emscripten_bind_btVector4_btVector4_2(a,c):void 0===e?_emscripten_bind_btVector4_btVector4_3(a,c,d):$o(a,c,d,e);h(N)[this.a]=this;}N.prototype=Object.create(p.prototype);N.prototype.constructor=N;N.prototype.b=N;N.c={};b.btVector4=N;N.prototype.w=function(){return ap(this.a);};N.prototype.setValue=function(a,c,d,e){var g=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);bp(g,a,c,d,e);};N.prototype.length=N.prototype.length=function(){return cp(this.a);};N.prototype.x=N.prototype.x=function(){return dp(this.a);};N.prototype.y=N.prototype.y=function(){return ep(this.a);};N.prototype.z=N.prototype.z=function(){return fp(this.a);};N.prototype.setX=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gp(c,a);};N.prototype.setY=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hp(c,a);};N.prototype.setZ=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ip(c,a);};N.prototype.normalize=N.prototype.normalize=function(){jp(this.a);};N.prototype.rotate=N.prototype.rotate=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return k(kp(d,a,c),p);};N.prototype.dot=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return lp(c,a);};N.prototype.op_mul=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(mp(c,a),p);};N.prototype.op_add=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(np(c,a),p);};N.prototype.op_sub=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(op(c,a),p);};N.prototype.__destroy__=function(){pp(this.a);};function cC(){this.a=qp();h(cC)[this.a]=this;}cC.prototype=Object.create(f.prototype);cC.prototype.constructor=cC;cC.prototype.b=cC;cC.c={};b.btDefaultCollisionConstructionInfo=cC;cC.prototype.__destroy__=function(){rp(this.a);};function O(){throw"cannot construct a Anchor, no constructor in IDL";}O.prototype=Object.create(f.prototype);O.prototype.constructor=O;O.prototype.b=O;O.c={};b.Anchor=O;O.prototype.get_m_node=O.prototype.Ub=function(){return k(sp(this.a),Node);};O.prototype.set_m_node=O.prototype.Fe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);tp(c,a);};Object.defineProperty(O.prototype,"m_node",{get:O.prototype.Ub,set:O.prototype.Fe});O.prototype.get_m_local=O.prototype.Ob=function(){return k(up(this.a),p);};O.prototype.set_m_local=O.prototype.ze=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vp(c,a);};Object.defineProperty(O.prototype,"m_local",{get:O.prototype.Ob,set:O.prototype.ze});O.prototype.get_m_body=O.prototype.Sa=function(){return k(wp(this.a),H);};O.prototype.set_m_body=O.prototype.Ed=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);xp(c,a);};Object.defineProperty(O.prototype,"m_body",{get:O.prototype.Sa,set:O.prototype.Ed});O.prototype.get_m_influence=O.prototype.Hb=function(){return yp(this.a);};O.prototype.set_m_influence=O.prototype.se=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);zp(c,a);};Object.defineProperty(O.prototype,"m_influence",{get:O.prototype.Hb,set:O.prototype.se});O.prototype.get_m_c0=O.prototype.Va=function(){return k(Ap(this.a),BB);};O.prototype.set_m_c0=O.prototype.Hd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Bp(c,a);};Object.defineProperty(O.prototype,"m_c0",{get:O.prototype.Va,set:O.prototype.Hd});O.prototype.get_m_c1=O.prototype.Wa=function(){return k(Cp(this.a),p);};O.prototype.set_m_c1=O.prototype.Id=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Dp(c,a);};Object.defineProperty(O.prototype,"m_c1",{get:O.prototype.Wa,set:O.prototype.Id});O.prototype.get_m_c2=O.prototype.Xa=function(){return Ep(this.a);};O.prototype.set_m_c2=O.prototype.Jd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fp(c,a);};Object.defineProperty(O.prototype,"m_c2",{get:O.prototype.Xa,set:O.prototype.Jd});O.prototype.__destroy__=function(){Gp(this.a);};function P(){throw"cannot construct a btVehicleRaycasterResult, no constructor in IDL";}P.prototype=Object.create(f.prototype);P.prototype.constructor=P;P.prototype.b=P;P.c={};b.btVehicleRaycasterResult=P;P.prototype.get_m_hitPointInWorld=P.prototype.Cb=function(){return k(Hp(this.a),p);};P.prototype.set_m_hitPointInWorld=P.prototype.ne=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ip(c,a);};Object.defineProperty(P.prototype,"m_hitPointInWorld",{get:P.prototype.Cb,set:P.prototype.ne});P.prototype.get_m_hitNormalInWorld=P.prototype.Ab=function(){return k(Jp(this.a),p);};P.prototype.set_m_hitNormalInWorld=P.prototype.le=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Kp(c,a);};Object.defineProperty(P.prototype,"m_hitNormalInWorld",{get:P.prototype.Ab,set:P.prototype.le});P.prototype.get_m_distFraction=P.prototype.mb=function(){return Lp(this.a);};P.prototype.set_m_distFraction=P.prototype.Yd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Mp(c,a);};Object.defineProperty(P.prototype,"m_distFraction",{get:P.prototype.mb,set:P.prototype.Yd});P.prototype.__destroy__=function(){Np(this.a);};function HB(){throw"cannot construct a btVector3Array, no constructor in IDL";}HB.prototype=Object.create(f.prototype);HB.prototype.constructor=HB;HB.prototype.b=HB;HB.c={};b.btVector3Array=HB;HB.prototype.size=HB.prototype.size=function(){return Op(this.a);};HB.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Pp(c,a),p);};HB.prototype.__destroy__=function(){Qp(this.a);};function dC(){throw"cannot construct a btConstraintSolver, no constructor in IDL";}dC.prototype=Object.create(f.prototype);dC.prototype.constructor=dC;dC.prototype.b=dC;dC.c={};b.btConstraintSolver=dC;dC.prototype.__destroy__=function(){Rp(this.a);};function Q(a,c,d){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);this.a=Sp(a,c,d);h(Q)[this.a]=this;}Q.prototype=Object.create(qB.prototype);Q.prototype.constructor=Q;Q.prototype.b=Q;Q.c={};b.btRaycastVehicle=Q;Q.prototype.applyEngineForce=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Tp(d,a,c);};Q.prototype.setSteeringValue=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Up(d,a,c);};Q.prototype.getWheelTransformWS=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Vp(c,a),r);};Q.prototype.updateWheelTransform=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Wp(d,a,c);};Q.prototype.addWheel=function(a,c,d,e,g,n,D){var Y=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);n&&"object"===typeof n&&(n=n.a);D&&"object"===typeof D&&(D=D.a);return k(Xp(Y,a,c,d,e,g,n,D),L);};Q.prototype.getNumWheels=function(){return Yp(this.a);};Q.prototype.getRigidBody=function(){return k(Zp(this.a),H);};Q.prototype.getWheelInfo=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k($p(c,a),L);};Q.prototype.setBrake=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);aq(d,a,c);};Q.prototype.setCoordinateSystem=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);bq(e,a,c,d);};Q.prototype.getCurrentSpeedKmHour=function(){return cq(this.a);};Q.prototype.getChassisWorldTransform=function(){return k(dq(this.a),r);};Q.prototype.rayCast=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return eq(c,a);};Q.prototype.updateVehicle=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);fq(c,a);};Q.prototype.resetSuspension=function(){gq(this.a);};Q.prototype.getSteeringValue=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return hq(c,a);};Q.prototype.updateWheelTransformsWS=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);void 0===c?iq(d,a):jq(d,a,c);};Q.prototype.setPitchControl=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);kq(c,a);};Q.prototype.updateSuspension=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lq(c,a);};Q.prototype.updateFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);mq(c,a);};Q.prototype.getRightAxis=function(){return nq(this.a);};Q.prototype.getUpAxis=function(){return oq(this.a);};Q.prototype.getForwardAxis=function(){return pq(this.a);};Q.prototype.getForwardVector=function(){return k(qq(this.a),p);};Q.prototype.getUserConstraintType=function(){return rq(this.a);};Q.prototype.setUserConstraintType=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);sq(c,a);};Q.prototype.setUserConstraintId=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);tq(c,a);};Q.prototype.getUserConstraintId=function(){return uq(this.a);};Q.prototype.updateAction=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);vq(d,a,c);};Q.prototype.__destroy__=function(){wq(this.a);};function eC(a){a&&"object"===typeof a&&(a=a.a);this.a=xq(a);h(eC)[this.a]=this;}eC.prototype=Object.create(tB.prototype);eC.prototype.constructor=eC;eC.prototype.b=eC;eC.c={};b.btCylinderShapeX=eC;eC.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);yq(c,a);};eC.prototype.getMargin=function(){return zq(this.a);};eC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Aq(c,a);};eC.prototype.getLocalScaling=function(){return k(Bq(this.a),p);};eC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Cq(d,a,c);};eC.prototype.__destroy__=function(){Dq(this.a);};function fC(a){a&&"object"===typeof a&&(a=a.a);this.a=Eq(a);h(fC)[this.a]=this;}fC.prototype=Object.create(tB.prototype);fC.prototype.constructor=fC;fC.prototype.b=fC;fC.c={};b.btCylinderShapeZ=fC;fC.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fq(c,a);};fC.prototype.getMargin=function(){return Gq(this.a);};fC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Hq(c,a);};fC.prototype.getLocalScaling=function(){return k(Iq(this.a),p);};fC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Jq(d,a,c);};fC.prototype.__destroy__=function(){Kq(this.a);};function ZB(){throw"cannot construct a btConvexPolyhedron, no constructor in IDL";}ZB.prototype=Object.create(f.prototype);ZB.prototype.constructor=ZB;ZB.prototype.b=ZB;ZB.c={};b.btConvexPolyhedron=ZB;ZB.prototype.get_m_vertices=ZB.prototype.Gc=function(){return k(Lq(this.a),HB);};ZB.prototype.set_m_vertices=ZB.prototype.sf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Mq(c,a);};Object.defineProperty(ZB.prototype,"m_vertices",{get:ZB.prototype.Gc,set:ZB.prototype.sf});ZB.prototype.get_m_faces=ZB.prototype.P=function(){return k(Nq(this.a),gC);};ZB.prototype.set_m_faces=ZB.prototype.$=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Oq(c,a);};Object.defineProperty(ZB.prototype,"m_faces",{get:ZB.prototype.P,set:ZB.prototype.$});ZB.prototype.__destroy__=function(){Pq(this.a);};function hC(){this.a=Qq();h(hC)[this.a]=this;}hC.prototype=Object.create(f.prototype);hC.prototype.constructor=hC;hC.prototype.b=hC;hC.c={};b.btSequentialImpulseConstraintSolver=hC;hC.prototype.__destroy__=function(){Rq(this.a);};function iC(){throw"cannot construct a tAnchorArray, no constructor in IDL";}iC.prototype=Object.create(f.prototype);iC.prototype.constructor=iC;iC.prototype.b=iC;iC.c={};b.tAnchorArray=iC;iC.prototype.size=iC.prototype.size=function(){return Sq(this.a);};iC.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Tq(c,a),O);};iC.prototype.clear=iC.prototype.clear=function(){Uq(this.a);};iC.prototype.push_back=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Vq(c,a);};iC.prototype.pop_back=function(){Wq(this.a);};iC.prototype.__destroy__=function(){Xq(this.a);};function M(){throw"cannot construct a RaycastInfo, no constructor in IDL";}M.prototype=Object.create(f.prototype);M.prototype.constructor=M;M.prototype.b=M;M.c={};b.RaycastInfo=M;M.prototype.get_m_contactNormalWS=M.prototype.cb=function(){return k(Yq(this.a),p);};M.prototype.set_m_contactNormalWS=M.prototype.Pd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Zq(c,a);};Object.defineProperty(M.prototype,"m_contactNormalWS",{get:M.prototype.cb,set:M.prototype.Pd});M.prototype.get_m_contactPointWS=M.prototype.eb=function(){return k($q(this.a),p);};M.prototype.set_m_contactPointWS=M.prototype.Qd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ar(c,a);};Object.defineProperty(M.prototype,"m_contactPointWS",{get:M.prototype.eb,set:M.prototype.Qd});M.prototype.get_m_suspensionLength=M.prototype.tc=function(){return br(this.a);};M.prototype.set_m_suspensionLength=M.prototype.df=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);cr(c,a);};Object.defineProperty(M.prototype,"m_suspensionLength",{get:M.prototype.tc,set:M.prototype.df});M.prototype.get_m_hardPointWS=M.prototype.wb=function(){return k(dr(this.a),p);};M.prototype.set_m_hardPointWS=M.prototype.he=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);er(c,a);};Object.defineProperty(M.prototype,"m_hardPointWS",{get:M.prototype.wb,set:M.prototype.he});M.prototype.get_m_wheelDirectionWS=M.prototype.Ic=function(){return k(fr(this.a),p);};M.prototype.set_m_wheelDirectionWS=M.prototype.uf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gr(c,a);};Object.defineProperty(M.prototype,"m_wheelDirectionWS",{get:M.prototype.Ic,set:M.prototype.uf});M.prototype.get_m_wheelAxleWS=M.prototype.Hc=function(){return k(hr(this.a),p);};M.prototype.set_m_wheelAxleWS=M.prototype.tf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ir(c,a);};Object.defineProperty(M.prototype,"m_wheelAxleWS",{get:M.prototype.Hc,set:M.prototype.tf});M.prototype.get_m_isInContact=M.prototype.Ib=function(){return!!jr(this.a);};M.prototype.set_m_isInContact=M.prototype.te=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);kr(c,a);};Object.defineProperty(M.prototype,"m_isInContact",{get:M.prototype.Ib,set:M.prototype.te});M.prototype.get_m_groundObject=M.prototype.vb=function(){return lr(this.a);};M.prototype.set_m_groundObject=M.prototype.ge=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);mr(c,a);};Object.defineProperty(M.prototype,"m_groundObject",{get:M.prototype.vb,set:M.prototype.ge});M.prototype.__destroy__=function(){nr(this.a);};function jC(a,c,d){YA();a&&"object"===typeof a&&(a=a.a);"object"==typeof c&&(c=bB(c));d&&"object"===typeof d&&(d=d.a);this.a=or(a,c,d);h(jC)[this.a]=this;}jC.prototype=Object.create(m.prototype);jC.prototype.constructor=jC;jC.prototype.b=jC;jC.c={};b.btMultiSphereShape=jC;jC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);pr(c,a);};jC.prototype.getLocalScaling=function(){return k(qr(this.a),p);};jC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);rr(d,a,c);};jC.prototype.__destroy__=function(){sr(this.a);};function R(a,c,d,e){YA();a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);"object"==typeof e&&(e=bB(e));this.a=tr(a,c,d,e);h(R)[this.a]=this;}R.prototype=Object.create(q.prototype);R.prototype.constructor=R;R.prototype.b=R;R.c={};b.btSoftBody=R;R.prototype.checkLink=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return!!ur(d,a,c);};R.prototype.checkFace=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);return!!vr(e,a,c,d);};R.prototype.appendMaterial=function(){return k(wr(this.a),z);};R.prototype.appendNode=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);xr(d,a,c);};R.prototype.appendLink=function(a,c,d,e){var g=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);yr(g,a,c,d,e);};R.prototype.appendFace=function(a,c,d,e){var g=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);zr(g,a,c,d,e);};R.prototype.appendTetra=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);Ar(n,a,c,d,e,g);};R.prototype.appendAnchor=function(a,c,d,e){var g=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);Br(g,a,c,d,e);};R.prototype.addForce=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);void 0===c?Cr(d,a):Dr(d,a,c);};R.prototype.addAeroForceToNode=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Er(d,a,c);};R.prototype.getTotalMass=function(){return Fr(this.a);};R.prototype.setTotalMass=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Gr(d,a,c);};R.prototype.setMass=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Hr(d,a,c);};R.prototype.transform=R.prototype.transform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ir(c,a);};R.prototype.translate=R.prototype.translate=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Jr(c,a);};R.prototype.rotate=R.prototype.rotate=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Kr(c,a);};R.prototype.scale=R.prototype.scale=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Lr(c,a);};R.prototype.generateClusters=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return void 0===c?Mr(d,a):Nr(d,a,c);};R.prototype.generateBendingConstraints=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return Or(d,a,c);};R.prototype.upcast=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Pr(c,a),R);};R.prototype.setAnisotropicFriction=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Qr(d,a,c);};R.prototype.getCollisionShape=function(){return k(Rr(this.a),m);};R.prototype.setContactProcessingThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Sr(c,a);};R.prototype.setActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Tr(c,a);};R.prototype.forceActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ur(c,a);};R.prototype.activate=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);void 0===a?Vr(c):Wr(c,a);};R.prototype.isActive=function(){return!!Xr(this.a);};R.prototype.isKinematicObject=function(){return!!Yr(this.a);};R.prototype.isStaticObject=function(){return!!Zr(this.a);};R.prototype.isStaticOrKinematicObject=function(){return!!$r(this.a);};R.prototype.getRestitution=function(){return as(this.a);};R.prototype.getFriction=function(){return bs(this.a);};R.prototype.getRollingFriction=function(){return cs(this.a);};R.prototype.setRestitution=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ds(c,a);};R.prototype.setFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);es(c,a);};R.prototype.setRollingFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gs(c,a);};R.prototype.getWorldTransform=function(){return k(hs(this.a),r);};R.prototype.getCollisionFlags=function(){return is(this.a);};R.prototype.setCollisionFlags=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);js(c,a);};R.prototype.setWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ks(c,a);};R.prototype.setCollisionShape=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ls(c,a);};R.prototype.setCcdMotionThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ms(c,a);};R.prototype.setCcdSweptSphereRadius=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ns(c,a);};R.prototype.getUserIndex=function(){return ps(this.a);};R.prototype.setUserIndex=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);qs(c,a);};R.prototype.getUserPointer=function(){return k(rs(this.a),hB);};R.prototype.setUserPointer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ss(c,a);};R.prototype.getBroadphaseHandle=function(){return k(ts(this.a),iB);};R.prototype.get_m_cfg=R.prototype.Ya=function(){return k(us(this.a),S);};R.prototype.set_m_cfg=R.prototype.Kd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vs(c,a);};Object.defineProperty(R.prototype,"m_cfg",{get:R.prototype.Ya,set:R.prototype.Kd});R.prototype.get_m_nodes=R.prototype.Vb=function(){return k(xs(this.a),kC);};R.prototype.set_m_nodes=R.prototype.Ge=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ys(c,a);};Object.defineProperty(R.prototype,"m_nodes",{get:R.prototype.Vb,set:R.prototype.Ge});R.prototype.get_m_faces=R.prototype.P=function(){return k(zs(this.a),lC);};R.prototype.set_m_faces=R.prototype.$=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);As(c,a);};Object.defineProperty(R.prototype,"m_faces",{get:R.prototype.P,set:R.prototype.$});R.prototype.get_m_materials=R.prototype.Sb=function(){return k(Bs(this.a),IB);};R.prototype.set_m_materials=R.prototype.De=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Cs(c,a);};Object.defineProperty(R.prototype,"m_materials",{get:R.prototype.Sb,set:R.prototype.De});R.prototype.get_m_anchors=R.prototype.Oa=function(){return k(Ds(this.a),iC);};R.prototype.set_m_anchors=R.prototype.Ad=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Es(c,a);};Object.defineProperty(R.prototype,"m_anchors",{get:R.prototype.Oa,set:R.prototype.Ad});R.prototype.__destroy__=function(){Fs(this.a);};function mC(){throw"cannot construct a btIntArray, no constructor in IDL";}mC.prototype=Object.create(f.prototype);mC.prototype.constructor=mC;mC.prototype.b=mC;mC.c={};b.btIntArray=mC;mC.prototype.size=mC.prototype.size=function(){return Gs(this.a);};mC.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return Hs(c,a);};mC.prototype.__destroy__=function(){Is(this.a);};function S(){throw"cannot construct a Config, no constructor in IDL";}S.prototype=Object.create(f.prototype);S.prototype.constructor=S;S.prototype.b=S;S.c={};b.Config=S;S.prototype.get_kVCF=S.prototype.Ha=function(){return Js(this.a);};S.prototype.set_kVCF=S.prototype.td=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ks(c,a);};Object.defineProperty(S.prototype,"kVCF",{get:S.prototype.Ha,set:S.prototype.td});S.prototype.get_kDP=S.prototype.ua=function(){return Ls(this.a);};S.prototype.set_kDP=S.prototype.ed=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ms(c,a);};Object.defineProperty(S.prototype,"kDP",{get:S.prototype.ua,set:S.prototype.ed});S.prototype.get_kDG=S.prototype.ta=function(){return Ns(this.a);};S.prototype.set_kDG=S.prototype.dd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Os(c,a);};Object.defineProperty(S.prototype,"kDG",{get:S.prototype.ta,set:S.prototype.dd});S.prototype.get_kLF=S.prototype.wa=function(){return Ps(this.a);};S.prototype.set_kLF=S.prototype.hd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Qs(c,a);};Object.defineProperty(S.prototype,"kLF",{get:S.prototype.wa,set:S.prototype.hd});S.prototype.get_kPR=S.prototype.ya=function(){return Rs(this.a);};S.prototype.set_kPR=S.prototype.kd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ss(c,a);};Object.defineProperty(S.prototype,"kPR",{get:S.prototype.ya,set:S.prototype.kd});S.prototype.get_kVC=S.prototype.Ga=function(){return Ts(this.a);};S.prototype.set_kVC=S.prototype.sd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Us(c,a);};Object.defineProperty(S.prototype,"kVC",{get:S.prototype.Ga,set:S.prototype.sd});S.prototype.get_kDF=S.prototype.sa=function(){return Vs(this.a);};S.prototype.set_kDF=S.prototype.cd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ws(c,a);};Object.defineProperty(S.prototype,"kDF",{get:S.prototype.sa,set:S.prototype.cd});S.prototype.get_kMT=S.prototype.xa=function(){return Xs(this.a);};S.prototype.set_kMT=S.prototype.jd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ys(c,a);};Object.defineProperty(S.prototype,"kMT",{get:S.prototype.xa,set:S.prototype.jd});S.prototype.get_kCHR=S.prototype.ra=function(){return Zs(this.a);};S.prototype.set_kCHR=S.prototype.bd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);$s(c,a);};Object.defineProperty(S.prototype,"kCHR",{get:S.prototype.ra,set:S.prototype.bd});S.prototype.get_kKHR=S.prototype.va=function(){return at(this.a);};S.prototype.set_kKHR=S.prototype.gd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);bt(c,a);};Object.defineProperty(S.prototype,"kKHR",{get:S.prototype.va,set:S.prototype.gd});S.prototype.get_kSHR=S.prototype.za=function(){return ct(this.a);};S.prototype.set_kSHR=S.prototype.ld=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);dt(c,a);};Object.defineProperty(S.prototype,"kSHR",{get:S.prototype.za,set:S.prototype.ld});S.prototype.get_kAHR=S.prototype.qa=function(){return et(this.a);};S.prototype.set_kAHR=S.prototype.ad=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ft(c,a);};Object.defineProperty(S.prototype,"kAHR",{get:S.prototype.qa,set:S.prototype.ad});S.prototype.get_kSRHR_CL=S.prototype.Ca=function(){return gt(this.a);};S.prototype.set_kSRHR_CL=S.prototype.od=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ht(c,a);};Object.defineProperty(S.prototype,"kSRHR_CL",{get:S.prototype.Ca,set:S.prototype.od});S.prototype.get_kSKHR_CL=S.prototype.Aa=function(){return it(this.a);};S.prototype.set_kSKHR_CL=S.prototype.md=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);jt(c,a);};Object.defineProperty(S.prototype,"kSKHR_CL",{get:S.prototype.Aa,set:S.prototype.md});S.prototype.get_kSSHR_CL=S.prototype.Ea=function(){return kt(this.a);};S.prototype.set_kSSHR_CL=S.prototype.qd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lt(c,a);};Object.defineProperty(S.prototype,"kSSHR_CL",{get:S.prototype.Ea,set:S.prototype.qd});S.prototype.get_kSR_SPLT_CL=S.prototype.Da=function(){return mt(this.a);};S.prototype.set_kSR_SPLT_CL=S.prototype.pd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);nt(c,a);};Object.defineProperty(S.prototype,"kSR_SPLT_CL",{get:S.prototype.Da,set:S.prototype.pd});S.prototype.get_kSK_SPLT_CL=S.prototype.Ba=function(){return ot(this.a);};S.prototype.set_kSK_SPLT_CL=S.prototype.nd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);pt(c,a);};Object.defineProperty(S.prototype,"kSK_SPLT_CL",{get:S.prototype.Ba,set:S.prototype.nd});S.prototype.get_kSS_SPLT_CL=S.prototype.Fa=function(){return qt(this.a);};S.prototype.set_kSS_SPLT_CL=S.prototype.rd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);rt(c,a);};Object.defineProperty(S.prototype,"kSS_SPLT_CL",{get:S.prototype.Fa,set:S.prototype.rd});S.prototype.get_maxvolume=S.prototype.Oc=function(){return st(this.a);};S.prototype.set_maxvolume=S.prototype.Af=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);tt(c,a);};Object.defineProperty(S.prototype,"maxvolume",{get:S.prototype.Oc,set:S.prototype.Af});S.prototype.get_timescale=S.prototype.Qc=function(){return ut(this.a);};S.prototype.set_timescale=S.prototype.Cf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vt(c,a);};Object.defineProperty(S.prototype,"timescale",{get:S.prototype.Qc,set:S.prototype.Cf});S.prototype.get_viterations=S.prototype.Rc=function(){return wt(this.a);};S.prototype.set_viterations=S.prototype.Df=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);xt(c,a);};Object.defineProperty(S.prototype,"viterations",{get:S.prototype.Rc,set:S.prototype.Df});S.prototype.get_piterations=S.prototype.Pc=function(){return yt(this.a);};S.prototype.set_piterations=S.prototype.Bf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);zt(c,a);};Object.defineProperty(S.prototype,"piterations",{get:S.prototype.Pc,set:S.prototype.Bf});S.prototype.get_diterations=S.prototype.pa=function(){return At(this.a);};S.prototype.set_diterations=S.prototype.$c=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Bt(c,a);};Object.defineProperty(S.prototype,"diterations",{get:S.prototype.pa,set:S.prototype.$c});S.prototype.get_citerations=S.prototype.na=function(){return Ct(this.a);};S.prototype.set_citerations=S.prototype.Yc=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Dt(c,a);};Object.defineProperty(S.prototype,"citerations",{get:S.prototype.na,set:S.prototype.Yc});S.prototype.get_collisions=S.prototype.oa=function(){return Et(this.a);};S.prototype.set_collisions=S.prototype.Zc=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ft(c,a);};Object.defineProperty(S.prototype,"collisions",{get:S.prototype.oa,set:S.prototype.Zc});S.prototype.__destroy__=function(){Gt(this.a);};function Node(){throw"cannot construct a Node, no constructor in IDL";}Node.prototype=Object.create(f.prototype);Node.prototype.constructor=Node;Node.prototype.b=Node;Node.c={};b.Node=Node;Node.prototype.get_m_x=Node.prototype.Nc=function(){return k(Ht(this.a),p);};Node.prototype.set_m_x=Node.prototype.zf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);It(c,a);};Object.defineProperty(Node.prototype,"m_x",{get:Node.prototype.Nc,set:Node.prototype.zf});Node.prototype.get_m_q=Node.prototype.cc=function(){return k(Jt(this.a),p);};Node.prototype.set_m_q=Node.prototype.Oe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Kt(c,a);};Object.defineProperty(Node.prototype,"m_q",{get:Node.prototype.cc,set:Node.prototype.Oe});Node.prototype.get_m_v=Node.prototype.Fc=function(){return k(Lt(this.a),p);};Node.prototype.set_m_v=Node.prototype.rf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Mt(c,a);};Object.defineProperty(Node.prototype,"m_v",{get:Node.prototype.Fc,set:Node.prototype.rf});Node.prototype.get_m_f=Node.prototype.qb=function(){return k(Nt(this.a),p);};Node.prototype.set_m_f=Node.prototype.be=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ot(c,a);};Object.defineProperty(Node.prototype,"m_f",{get:Node.prototype.qb,set:Node.prototype.be});Node.prototype.get_m_n=Node.prototype.R=function(){return k(Pt(this.a),p);};Node.prototype.set_m_n=Node.prototype.aa=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Qt(c,a);};Object.defineProperty(Node.prototype,"m_n",{get:Node.prototype.R,set:Node.prototype.aa});Node.prototype.get_m_im=Node.prototype.Eb=function(){return Rt(this.a);};Node.prototype.set_m_im=Node.prototype.pe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);St(c,a);};Object.defineProperty(Node.prototype,"m_im",{get:Node.prototype.Eb,set:Node.prototype.pe});Node.prototype.get_m_area=Node.prototype.Ra=function(){return Tt(this.a);};Node.prototype.set_m_area=Node.prototype.Dd=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ut(c,a);};Object.defineProperty(Node.prototype,"m_area",{get:Node.prototype.Ra,set:Node.prototype.Dd});Node.prototype.__destroy__=function(){Vt(this.a);};function nC(){this.a=Wt();h(nC)[this.a]=this;}nC.prototype=Object.create(f.prototype);nC.prototype.constructor=nC;nC.prototype.b=nC;nC.c={};b.btGhostPairCallback=nC;nC.prototype.__destroy__=function(){Xt(this.a);};function oC(){throw"cannot construct a btOverlappingPairCallback, no constructor in IDL";}oC.prototype=Object.create(f.prototype);oC.prototype.constructor=oC;oC.prototype.b=oC;oC.c={};b.btOverlappingPairCallback=oC;oC.prototype.__destroy__=function(){Yt(this.a);};function pC(a,c,d,e){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);this.a=void 0===e?Zt(a,c,d):$t(a,c,d,e);h(pC)[this.a]=this;}pC.prototype=Object.create(qB.prototype);pC.prototype.constructor=pC;pC.prototype.b=pC;pC.c={};b.btKinematicCharacterController=pC;pC.prototype.setUpAxis=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);au(c,a);};pC.prototype.setWalkDirection=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);bu(c,a);};pC.prototype.setVelocityForTimeInterval=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);cu(d,a,c);};pC.prototype.warp=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);du(c,a);};pC.prototype.preStep=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);eu(c,a);};pC.prototype.playerStep=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);fu(d,a,c);};pC.prototype.setFallSpeed=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gu(c,a);};pC.prototype.setJumpSpeed=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hu(c,a);};pC.prototype.setMaxJumpHeight=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);iu(c,a);};pC.prototype.canJump=function(){return!!ju(this.a);};pC.prototype.jump=function(){ku(this.a);};pC.prototype.setGravity=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lu(c,a);};pC.prototype.getGravity=function(){return mu(this.a);};pC.prototype.setMaxSlope=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);nu(c,a);};pC.prototype.getMaxSlope=function(){return ou(this.a);};pC.prototype.getGhostObject=function(){return k(pu(this.a),T);};pC.prototype.setUseGhostSweepTest=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);qu(c,a);};pC.prototype.onGround=function(){return!!ru(this.a);};pC.prototype.setUpInterpolate=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);su(c,a);};pC.prototype.updateAction=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);tu(d,a,c);};pC.prototype.__destroy__=function(){uu(this.a);};function qC(){throw"cannot construct a btSoftBodyArray, no constructor in IDL";}qC.prototype=Object.create(f.prototype);qC.prototype.constructor=qC;qC.prototype.b=qC;qC.c={};b.btSoftBodyArray=qC;qC.prototype.size=qC.prototype.size=function(){return vu(this.a);};qC.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(wu(c,a),R);};qC.prototype.__destroy__=function(){xu(this.a);};function gC(){throw"cannot construct a btFaceArray, no constructor in IDL";}gC.prototype=Object.create(f.prototype);gC.prototype.constructor=gC;gC.prototype.b=gC;gC.c={};b.btFaceArray=gC;gC.prototype.size=gC.prototype.size=function(){return yu(this.a);};gC.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(zu(c,a),rC);};gC.prototype.__destroy__=function(){Au(this.a);};function sC(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=Bu(a,c);h(sC)[this.a]=this;}sC.prototype=Object.create(lB.prototype);sC.prototype.constructor=sC;sC.prototype.b=sC;sC.c={};b.btStaticPlaneShape=sC;sC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Cu(c,a);};sC.prototype.getLocalScaling=function(){return k(Du(this.a),p);};sC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Eu(d,a,c);};sC.prototype.__destroy__=function(){Fu(this.a);};function eB(){throw"cannot construct a btOverlappingPairCache, no constructor in IDL";}eB.prototype=Object.create(f.prototype);eB.prototype.constructor=eB;eB.prototype.b=eB;eB.c={};b.btOverlappingPairCache=eB;eB.prototype.setInternalGhostPairCallback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Gu(c,a);};eB.prototype.getNumOverlappingPairs=function(){return Hu(this.a);};eB.prototype.__destroy__=function(){Iu(this.a);};function NB(){throw"cannot construct a btIndexedMesh, no constructor in IDL";}NB.prototype=Object.create(f.prototype);NB.prototype.constructor=NB;NB.prototype.b=NB;NB.c={};b.btIndexedMesh=NB;NB.prototype.get_m_numTriangles=NB.prototype.Zb=function(){return Ju(this.a);};NB.prototype.set_m_numTriangles=NB.prototype.Ke=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ku(c,a);};Object.defineProperty(NB.prototype,"m_numTriangles",{get:NB.prototype.Zb,set:NB.prototype.Ke});NB.prototype.__destroy__=function(){Lu(this.a);};function U(a,c,d,e,g){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);this.a=Mu(a,c,d,e,g);h(U)[this.a]=this;}U.prototype=Object.create(w.prototype);U.prototype.constructor=U;U.prototype.b=U;U.c={};b.btSoftRigidDynamicsWorld=U;U.prototype.addSoftBody=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Nu(e,a,c,d);};U.prototype.removeSoftBody=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ou(c,a);};U.prototype.removeCollisionObject=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Pu(c,a);};U.prototype.getWorldInfo=function(){return k(Qu(this.a),I);};U.prototype.getSoftBodyArray=function(){return k(Ru(this.a),qC);};U.prototype.getDispatcher=function(){return k(Su(this.a),dB);};U.prototype.rayTest=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Tu(e,a,c,d);};U.prototype.getPairCache=function(){return k(Uu(this.a),eB);};U.prototype.getDispatchInfo=function(){return k(Vu(this.a),l);};U.prototype.addCollisionObject=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?Wu(e,a):void 0===d?Xu(e,a,c):Yu(e,a,c,d);};U.prototype.getBroadphase=function(){return k(Zu(this.a),fB);};U.prototype.convexSweepTest=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);$u(n,a,c,d,e,g);};U.prototype.contactPairTest=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);av(e,a,c,d);};U.prototype.contactTest=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);bv(d,a,c);};U.prototype.updateSingleAabb=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);cv(c,a);};U.prototype.setDebugDrawer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);dv(c,a);};U.prototype.getDebugDrawer=function(){return k(ev(this.a),gB);};U.prototype.debugDrawWorld=function(){fv(this.a);};U.prototype.debugDrawObject=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);gv(e,a,c,d);};U.prototype.setGravity=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hv(c,a);};U.prototype.getGravity=function(){return k(iv(this.a),p);};U.prototype.addRigidBody=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?jv(e,a):void 0===d?_emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_2(e,a,c):kv(e,a,c,d);};U.prototype.removeRigidBody=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lv(c,a);};U.prototype.addConstraint=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);void 0===c?mv(d,a):nv(d,a,c);};U.prototype.removeConstraint=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ov(c,a);};U.prototype.stepSimulation=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);return void 0===c?pv(e,a):void 0===d?qv(e,a,c):rv(e,a,c,d);};U.prototype.setContactAddedCallback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);sv(c,a);};U.prototype.setContactProcessedCallback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);tv(c,a);};U.prototype.setContactDestroyedCallback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);uv(c,a);};U.prototype.addAction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vv(c,a);};U.prototype.removeAction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);wv(c,a);};U.prototype.getSolverInfo=function(){return k(xv(this.a),t);};U.prototype.setInternalTickCallback=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);void 0===c?yv(e,a):void 0===d?zv(e,a,c):Av(e,a,c,d);};U.prototype.__destroy__=function(){Bv(this.a);};function tC(a,c,d,e){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);this.a=Cv(a,c,d,e);h(tC)[this.a]=this;}tC.prototype=Object.create(kB.prototype);tC.prototype.constructor=tC;tC.prototype.b=tC;tC.c={};b.btFixedConstraint=tC;tC.prototype.enableFeedback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Dv(c,a);};tC.prototype.getBreakingImpulseThreshold=function(){return Ev(this.a);};tC.prototype.setBreakingImpulseThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fv(c,a);};tC.prototype.getParam=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return Gv(d,a,c);};tC.prototype.setParam=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Hv(e,a,c,d);};tC.prototype.__destroy__=function(){Iv(this.a);};function r(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=void 0===a?Jv():void 0===c?_emscripten_bind_btTransform_btTransform_1(a):Kv(a,c);h(r)[this.a]=this;}r.prototype=Object.create(f.prototype);r.prototype.constructor=r;r.prototype.b=r;r.c={};b.btTransform=r;r.prototype.setIdentity=function(){Lv(this.a);};r.prototype.setOrigin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Mv(c,a);};r.prototype.setRotation=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Nv(c,a);};r.prototype.getOrigin=function(){return k(Ov(this.a),p);};r.prototype.getRotation=function(){return k(Pv(this.a),V);};r.prototype.getBasis=function(){return k(Qv(this.a),BB);};r.prototype.setFromOpenGLMatrix=function(a){var c=this.a;YA();"object"==typeof a&&(a=bB(a));Rv(c,a);};r.prototype.inverse=r.prototype.inverse=function(){return k(Sv(this.a),r);};r.prototype.op_mul=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Tv(c,a),r);};r.prototype.__destroy__=function(){Uv(this.a);};function W(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=Vv(a,c);h(W)[this.a]=this;}W.prototype=Object.create(y.prototype);W.prototype.constructor=W;W.prototype.b=W;W.c={};b.ClosestRayResultCallback=W;W.prototype.hasHit=function(){return!!Wv(this.a);};W.prototype.get_m_rayFromWorld=W.prototype.S=function(){return k(Xv(this.a),p);};W.prototype.set_m_rayFromWorld=W.prototype.ba=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Yv(c,a);};Object.defineProperty(W.prototype,"m_rayFromWorld",{get:W.prototype.S,set:W.prototype.ba});W.prototype.get_m_rayToWorld=W.prototype.T=function(){return k(Zv(this.a),p);};W.prototype.set_m_rayToWorld=W.prototype.da=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);$v(c,a);};Object.defineProperty(W.prototype,"m_rayToWorld",{get:W.prototype.T,set:W.prototype.da});W.prototype.get_m_hitNormalWorld=W.prototype.A=function(){return k(aw(this.a),p);};W.prototype.set_m_hitNormalWorld=W.prototype.I=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);bw(c,a);};Object.defineProperty(W.prototype,"m_hitNormalWorld",{get:W.prototype.A,set:W.prototype.I});W.prototype.get_m_hitPointWorld=W.prototype.B=function(){return k(cw(this.a),p);};W.prototype.set_m_hitPointWorld=W.prototype.J=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);dw(c,a);};Object.defineProperty(W.prototype,"m_hitPointWorld",{get:W.prototype.B,set:W.prototype.J});W.prototype.get_m_collisionFilterGroup=W.prototype.f=function(){return ew(this.a);};W.prototype.set_m_collisionFilterGroup=W.prototype.h=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);fw(c,a);};Object.defineProperty(W.prototype,"m_collisionFilterGroup",{get:W.prototype.f,set:W.prototype.h});W.prototype.get_m_collisionFilterMask=W.prototype.g=function(){return gw(this.a);};W.prototype.set_m_collisionFilterMask=W.prototype.i=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hw(c,a);};Object.defineProperty(W.prototype,"m_collisionFilterMask",{get:W.prototype.g,set:W.prototype.i});W.prototype.get_m_closestHitFraction=W.prototype.j=function(){return iw(this.a);};W.prototype.set_m_closestHitFraction=W.prototype.l=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);jw(c,a);};Object.defineProperty(W.prototype,"m_closestHitFraction",{get:W.prototype.j,set:W.prototype.l});W.prototype.get_m_collisionObject=W.prototype.u=function(){return k(kw(this.a),q);};W.prototype.set_m_collisionObject=W.prototype.G=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lw(c,a);};Object.defineProperty(W.prototype,"m_collisionObject",{get:W.prototype.u,set:W.prototype.G});W.prototype.__destroy__=function(){mw(this.a);};function uC(a){a&&"object"===typeof a&&(a=a.a);this.a=void 0===a?nw():ow(a);h(uC)[this.a]=this;}uC.prototype=Object.create(nB.prototype);uC.prototype.constructor=uC;uC.prototype.b=uC;uC.c={};b.btSoftBodyRigidBodyCollisionConfiguration=uC;uC.prototype.__destroy__=function(){pw(this.a);};function vC(){this.a=qw();h(vC)[this.a]=this;}vC.prototype=Object.create(zB.prototype);vC.prototype.constructor=vC;vC.prototype.b=vC;vC.c={};b.ConcreteContactResultCallback=vC;vC.prototype.addSingleResult=function(a,c,d,e,g,n,D){var Y=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);n&&"object"===typeof n&&(n=n.a);D&&"object"===typeof D&&(D=D.a);return rw(Y,a,c,d,e,g,n,D);};vC.prototype.__destroy__=function(){sw(this.a);};function xC(a,c,d){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);this.a=void 0===d?tw(a,c):uw(a,c,d);h(xC)[this.a]=this;}xC.prototype=Object.create(oB.prototype);xC.prototype.constructor=xC;xC.prototype.b=xC;xC.c={};b.btBvhTriangleMeshShape=xC;xC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vw(c,a);};xC.prototype.getLocalScaling=function(){return k(ww(this.a),p);};xC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);xw(d,a,c);};xC.prototype.__destroy__=function(){yw(this.a);};function GB(){throw"cannot construct a btConstCollisionObjectArray, no constructor in IDL";}GB.prototype=Object.create(f.prototype);GB.prototype.constructor=GB;GB.prototype.b=GB;GB.c={};b.btConstCollisionObjectArray=GB;GB.prototype.size=GB.prototype.size=function(){return zw(this.a);};GB.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(Aw(c,a),q);};GB.prototype.__destroy__=function(){Bw(this.a);};function yC(a,c,d,e,g){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);this.a=void 0===e?Cw(a,c,d):void 0===g?_emscripten_bind_btSliderConstraint_btSliderConstraint_4(a,c,d,e):Dw(a,c,d,e,g);h(yC)[this.a]=this;}yC.prototype=Object.create(kB.prototype);yC.prototype.constructor=yC;yC.prototype.b=yC;yC.c={};b.btSliderConstraint=yC;yC.prototype.setLowerLinLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ew(c,a);};yC.prototype.setUpperLinLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fw(c,a);};yC.prototype.setLowerAngLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Gw(c,a);};yC.prototype.setUpperAngLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Hw(c,a);};yC.prototype.enableFeedback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Iw(c,a);};yC.prototype.getBreakingImpulseThreshold=function(){return Jw(this.a);};yC.prototype.setBreakingImpulseThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Kw(c,a);};yC.prototype.getParam=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return Lw(d,a,c);};yC.prototype.setParam=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Mw(e,a,c,d);};yC.prototype.__destroy__=function(){Nw(this.a);};function T(){this.a=Ow();h(T)[this.a]=this;}T.prototype=Object.create(u.prototype);T.prototype.constructor=T;T.prototype.b=T;T.c={};b.btPairCachingGhostObject=T;T.prototype.setAnisotropicFriction=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Pw(d,a,c);};T.prototype.getCollisionShape=function(){return k(Qw(this.a),m);};T.prototype.setContactProcessingThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Rw(c,a);};T.prototype.setActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Sw(c,a);};T.prototype.forceActivationState=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Tw(c,a);};T.prototype.activate=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);void 0===a?Uw(c):Vw(c,a);};T.prototype.isActive=function(){return!!Ww(this.a);};T.prototype.isKinematicObject=function(){return!!Xw(this.a);};T.prototype.isStaticObject=function(){return!!Yw(this.a);};T.prototype.isStaticOrKinematicObject=function(){return!!Zw(this.a);};T.prototype.getRestitution=function(){return $w(this.a);};T.prototype.getFriction=function(){return ax(this.a);};T.prototype.getRollingFriction=function(){return bx(this.a);};T.prototype.setRestitution=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);cx(c,a);};T.prototype.setFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);dx(c,a);};T.prototype.setRollingFriction=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ex(c,a);};T.prototype.getWorldTransform=function(){return k(fx(this.a),r);};T.prototype.getCollisionFlags=function(){return gx(this.a);};T.prototype.setCollisionFlags=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hx(c,a);};T.prototype.setWorldTransform=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ix(c,a);};T.prototype.setCollisionShape=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);jx(c,a);};T.prototype.setCcdMotionThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);kx(c,a);};T.prototype.setCcdSweptSphereRadius=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);lx(c,a);};T.prototype.getUserIndex=function(){return mx(this.a);};T.prototype.setUserIndex=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);nx(c,a);};T.prototype.getUserPointer=function(){return k(ox(this.a),hB);};T.prototype.setUserPointer=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);px(c,a);};T.prototype.getBroadphaseHandle=function(){return k(qx(this.a),iB);};T.prototype.getNumOverlappingObjects=function(){return rx(this.a);};T.prototype.getOverlappingObject=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(sx(c,a),q);};T.prototype.__destroy__=function(){tx(this.a);};function C(){throw"cannot construct a btManifoldPoint, no constructor in IDL";}C.prototype=Object.create(f.prototype);C.prototype.constructor=C;C.prototype.b=C;C.c={};b.btManifoldPoint=C;C.prototype.getPositionWorldOnA=function(){return k(ux(this.a),p);};C.prototype.getPositionWorldOnB=function(){return k(vx(this.a),p);};C.prototype.getAppliedImpulse=function(){return wx(this.a);};C.prototype.getDistance=function(){return xx(this.a);};C.prototype.get_m_localPointA=C.prototype.Pb=function(){return k(yx(this.a),p);};C.prototype.set_m_localPointA=C.prototype.Ae=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);zx(c,a);};Object.defineProperty(C.prototype,"m_localPointA",{get:C.prototype.Pb,set:C.prototype.Ae});C.prototype.get_m_localPointB=C.prototype.Qb=function(){return k(Ax(this.a),p);};C.prototype.set_m_localPointB=C.prototype.Be=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Bx(c,a);};Object.defineProperty(C.prototype,"m_localPointB",{get:C.prototype.Qb,set:C.prototype.Be});C.prototype.get_m_positionWorldOnB=C.prototype.bc=function(){return k(Cx(this.a),p);};C.prototype.set_m_positionWorldOnB=C.prototype.Ne=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Dx(c,a);};Object.defineProperty(C.prototype,"m_positionWorldOnB",{get:C.prototype.bc,set:C.prototype.Ne});C.prototype.get_m_positionWorldOnA=C.prototype.ac=function(){return k(Ex(this.a),p);};C.prototype.set_m_positionWorldOnA=C.prototype.Me=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fx(c,a);};Object.defineProperty(C.prototype,"m_positionWorldOnA",{get:C.prototype.ac,set:C.prototype.Me});C.prototype.get_m_normalWorldOnB=C.prototype.Xb=function(){return k(Gx(this.a),p);};C.prototype.set_m_normalWorldOnB=C.prototype.Ie=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Hx(c,a);};Object.defineProperty(C.prototype,"m_normalWorldOnB",{get:C.prototype.Xb,set:C.prototype.Ie});C.prototype.get_m_userPersistentData=C.prototype.Ec=function(){return Ix(this.a);};C.prototype.set_m_userPersistentData=C.prototype.qf=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Jx(c,a);};Object.defineProperty(C.prototype,"m_userPersistentData",{get:C.prototype.Ec,set:C.prototype.qf});C.prototype.__destroy__=function(){Kx(this.a);};function zC(a,c,d,e){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);this.a=void 0===d?Lx(a,c):void 0===e?_emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_3(a,c,d):Mx(a,c,d,e);h(zC)[this.a]=this;}zC.prototype=Object.create(kB.prototype);zC.prototype.constructor=zC;zC.prototype.b=zC;zC.c={};b.btPoint2PointConstraint=zC;zC.prototype.setPivotA=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Nx(c,a);};zC.prototype.setPivotB=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Ox(c,a);};zC.prototype.getPivotInA=function(){return k(Px(this.a),p);};zC.prototype.getPivotInB=function(){return k(Qx(this.a),p);};zC.prototype.enableFeedback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Rx(c,a);};zC.prototype.getBreakingImpulseThreshold=function(){return Sx(this.a);};zC.prototype.setBreakingImpulseThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Tx(c,a);};zC.prototype.getParam=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return Ux(d,a,c);};zC.prototype.setParam=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Vx(e,a,c,d);};zC.prototype.get_m_setting=zC.prototype.kc=function(){return k(Wx(this.a),G);};zC.prototype.set_m_setting=zC.prototype.Ve=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Xx(c,a);};Object.defineProperty(zC.prototype,"m_setting",{get:zC.prototype.kc,set:zC.prototype.Ve});zC.prototype.__destroy__=function(){Yx(this.a);};function AC(){this.a=Zx();h(AC)[this.a]=this;}AC.prototype=Object.create(f.prototype);AC.prototype.constructor=AC;AC.prototype.b=AC;AC.c={};b.btSoftBodyHelpers=AC;AC.prototype.CreateRope=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);return k($x(n,a,c,d,e,g),R);};AC.prototype.CreatePatch=function(a,c,d,e,g,n,D,Y,ma){var v=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);n&&"object"===typeof n&&(n=n.a);D&&"object"===typeof D&&(D=D.a);Y&&"object"===typeof Y&&(Y=Y.a);ma&&"object"===typeof ma&&(ma=ma.a);return k(ay(v,a,c,d,e,g,n,D,Y,ma),R);};AC.prototype.CreatePatchUV=function(a,c,d,e,g,n,D,Y,ma,v){var J=this.a;YA();a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);n&&"object"===typeof n&&(n=n.a);D&&"object"===typeof D&&(D=D.a);Y&&"object"===typeof Y&&(Y=Y.a);ma&&"object"===typeof ma&&(ma=ma.a);"object"==typeof v&&(v=bB(v));return k(by(J,a,c,d,e,g,n,D,Y,ma,v),R);};AC.prototype.CreateEllipsoid=function(a,c,d,e){var g=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);return k(cy(g,a,c,d,e),R);};AC.prototype.CreateFromTriMesh=function(a,c,d,e,g){var n=this.a;YA();a&&"object"===typeof a&&(a=a.a);"object"==typeof c&&(c=bB(c));if("object"==typeof d&&"object"===typeof d){var D=ZA(d,Ka);$A(d,Ka,D);d=D;}e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);return k(dy(n,a,c,d,e,g),R);};AC.prototype.CreateFromConvexHull=function(a,c,d,e){var g=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);return k(ey(g,a,c,d,e),R);};AC.prototype.__destroy__=function(){fy(this.a);};function iB(){throw"cannot construct a btBroadphaseProxy, no constructor in IDL";}iB.prototype=Object.create(f.prototype);iB.prototype.constructor=iB;iB.prototype.b=iB;iB.c={};b.btBroadphaseProxy=iB;iB.prototype.get_m_collisionFilterGroup=iB.prototype.f=function(){return gy(this.a);};iB.prototype.set_m_collisionFilterGroup=iB.prototype.h=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);hy(c,a);};Object.defineProperty(iB.prototype,"m_collisionFilterGroup",{get:iB.prototype.f,set:iB.prototype.h});iB.prototype.get_m_collisionFilterMask=iB.prototype.g=function(){return iy(this.a);};iB.prototype.set_m_collisionFilterMask=iB.prototype.i=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);jy(c,a);};Object.defineProperty(iB.prototype,"m_collisionFilterMask",{get:iB.prototype.g,set:iB.prototype.i});iB.prototype.__destroy__=function(){ky(this.a);};function kC(){throw"cannot construct a tNodeArray, no constructor in IDL";}kC.prototype=Object.create(f.prototype);kC.prototype.constructor=kC;kC.prototype.b=kC;kC.c={};b.tNodeArray=kC;kC.prototype.size=kC.prototype.size=function(){return ly(this.a);};kC.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(my(c,a),Node);};kC.prototype.__destroy__=function(){ny(this.a);};function BC(a){a&&"object"===typeof a&&(a=a.a);this.a=oy(a);h(BC)[this.a]=this;}BC.prototype=Object.create(m.prototype);BC.prototype.constructor=BC;BC.prototype.b=BC;BC.c={};b.btBoxShape=BC;BC.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);py(c,a);};BC.prototype.getMargin=function(){return qy(this.a);};BC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);ry(c,a);};BC.prototype.getLocalScaling=function(){return k(sy(this.a),p);};BC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);ty(d,a,c);};BC.prototype.__destroy__=function(){uy(this.a);};function rC(){throw"cannot construct a btFace, no constructor in IDL";}rC.prototype=Object.create(f.prototype);rC.prototype.constructor=rC;rC.prototype.b=rC;rC.c={};b.btFace=rC;rC.prototype.get_m_indices=rC.prototype.Gb=function(){return k(vy(this.a),mC);};rC.prototype.set_m_indices=rC.prototype.re=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);wy(c,a);};Object.defineProperty(rC.prototype,"m_indices",{get:rC.prototype.Gb,set:rC.prototype.re});rC.prototype.get_m_plane=rC.prototype.$b=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return xy(c,a);};rC.prototype.set_m_plane=rC.prototype.Le=function(a,c){var d=this.a;YA();a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);yy(d,a,c);};Object.defineProperty(rC.prototype,"m_plane",{get:rC.prototype.$b,set:rC.prototype.Le});rC.prototype.__destroy__=function(){zy(this.a);};function CC(){this.a=Ay();h(CC)[this.a]=this;}CC.prototype=Object.create(gB.prototype);CC.prototype.constructor=CC;CC.prototype.b=CC;CC.c={};b.DebugDrawer=CC;CC.prototype.drawLine=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);By(e,a,c,d);};CC.prototype.drawContactPoint=function(a,c,d,e,g){var n=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);Cy(n,a,c,d,e,g);};CC.prototype.reportErrorWarning=function(a){var c=this.a;YA();a=a&&"object"===typeof a?a.a:aB(a);Dy(c,a);};CC.prototype.draw3dText=function(a,c){var d=this.a;YA();a&&"object"===typeof a&&(a=a.a);c=c&&"object"===typeof c?c.a:aB(c);Ey(d,a,c);};CC.prototype.setDebugMode=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fy(c,a);};CC.prototype.getDebugMode=function(){return Gy(this.a);};CC.prototype.__destroy__=function(){Hy(this.a);};function DC(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=Iy(a,c);h(DC)[this.a]=this;}DC.prototype=Object.create(mB.prototype);DC.prototype.constructor=DC;DC.prototype.b=DC;DC.c={};b.btCapsuleShapeX=DC;DC.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Jy(c,a);};DC.prototype.getMargin=function(){return Ky(this.a);};DC.prototype.getUpAxis=function(){return Ly(this.a);};DC.prototype.getRadius=function(){return My(this.a);};DC.prototype.getHalfHeight=function(){return Ny(this.a);};DC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Oy(c,a);};DC.prototype.getLocalScaling=function(){return k(Py(this.a),p);};DC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Qy(d,a,c);};DC.prototype.__destroy__=function(){Ry(this.a);};function V(a,c,d,e){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);this.a=Sy(a,c,d,e);h(V)[this.a]=this;}V.prototype=Object.create(sB.prototype);V.prototype.constructor=V;V.prototype.b=V;V.c={};b.btQuaternion=V;V.prototype.setValue=function(a,c,d,e){var g=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);Ty(g,a,c,d,e);};V.prototype.setEulerZYX=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);Uy(e,a,c,d);};V.prototype.setRotation=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Vy(d,a,c);};V.prototype.normalize=V.prototype.normalize=function(){Wy(this.a);};V.prototype.length2=function(){return Xy(this.a);};V.prototype.length=V.prototype.length=function(){return Yy(this.a);};V.prototype.dot=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return Zy(c,a);};V.prototype.normalized=function(){return k($y(this.a),V);};V.prototype.getAxis=function(){return k(az(this.a),p);};V.prototype.inverse=V.prototype.inverse=function(){return k(bz(this.a),V);};V.prototype.getAngle=function(){return cz(this.a);};V.prototype.getAngleShortestPath=function(){return dz(this.a);};V.prototype.angle=V.prototype.angle=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return ez(c,a);};V.prototype.angleShortestPath=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return fz(c,a);};V.prototype.op_add=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(gz(c,a),V);};V.prototype.op_sub=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(hz(c,a),V);};V.prototype.op_mul=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(iz(c,a),V);};V.prototype.op_mulq=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(jz(c,a),V);};V.prototype.op_div=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(kz(c,a),V);};V.prototype.x=V.prototype.x=function(){return lz(this.a);};V.prototype.y=V.prototype.y=function(){return mz(this.a);};V.prototype.z=V.prototype.z=function(){return nz(this.a);};V.prototype.w=function(){return oz(this.a);};V.prototype.setX=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);pz(c,a);};V.prototype.setY=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);qz(c,a);};V.prototype.setZ=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);rz(c,a);};V.prototype.setW=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);sz(c,a);};V.prototype.__destroy__=function(){tz(this.a);};function EC(a,c){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);this.a=uz(a,c);h(EC)[this.a]=this;}EC.prototype=Object.create(mB.prototype);EC.prototype.constructor=EC;EC.prototype.b=EC;EC.c={};b.btCapsuleShapeZ=EC;EC.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);vz(c,a);};EC.prototype.getMargin=function(){return wz(this.a);};EC.prototype.getUpAxis=function(){return xz(this.a);};EC.prototype.getRadius=function(){return yz(this.a);};EC.prototype.getHalfHeight=function(){return zz(this.a);};EC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Az(c,a);};EC.prototype.getLocalScaling=function(){return k(Bz(this.a),p);};EC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Cz(d,a,c);};EC.prototype.__destroy__=function(){Dz(this.a);};function t(){throw"cannot construct a btContactSolverInfo, no constructor in IDL";}t.prototype=Object.create(f.prototype);t.prototype.constructor=t;t.prototype.b=t;t.c={};b.btContactSolverInfo=t;t.prototype.get_m_splitImpulse=t.prototype.nc=function(){return!!Ez(this.a);};t.prototype.set_m_splitImpulse=t.prototype.Ye=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Fz(c,a);};Object.defineProperty(t.prototype,"m_splitImpulse",{get:t.prototype.nc,set:t.prototype.Ye});t.prototype.get_m_splitImpulsePenetrationThreshold=t.prototype.oc=function(){return Gz(this.a);};t.prototype.set_m_splitImpulsePenetrationThreshold=t.prototype.Ze=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Hz(c,a);};Object.defineProperty(t.prototype,"m_splitImpulsePenetrationThreshold",{get:t.prototype.oc,set:t.prototype.Ze});t.prototype.get_m_numIterations=t.prototype.Yb=function(){return Iz(this.a);};t.prototype.set_m_numIterations=t.prototype.Je=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Jz(c,a);};Object.defineProperty(t.prototype,"m_numIterations",{get:t.prototype.Yb,set:t.prototype.Je});t.prototype.__destroy__=function(){Kz(this.a);};function FC(a,c,d,e,g){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);this.a=void 0===e?Lz(a,c,d):void 0===g?_emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_4(a,c,d,e):Mz(a,c,d,e,g);h(FC)[this.a]=this;}FC.prototype=Object.create(wB.prototype);FC.prototype.constructor=FC;FC.prototype.b=FC;FC.c={};b.btGeneric6DofSpringConstraint=FC;FC.prototype.enableSpring=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Nz(d,a,c);};FC.prototype.setStiffness=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Oz(d,a,c);};FC.prototype.setDamping=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);Pz(d,a,c);};FC.prototype.setEquilibriumPoint=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);void 0===a?Qz(d):void 0===c?Rz(d,a):Sz(d,a,c);};FC.prototype.setLinearLowerLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Tz(c,a);};FC.prototype.setLinearUpperLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Uz(c,a);};FC.prototype.setAngularLowerLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Vz(c,a);};FC.prototype.setAngularUpperLimit=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Wz(c,a);};FC.prototype.getFrameOffsetA=function(){return k(Xz(this.a),r);};FC.prototype.enableFeedback=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);Yz(c,a);};FC.prototype.getBreakingImpulseThreshold=function(){return Zz(this.a);};FC.prototype.setBreakingImpulseThreshold=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);$z(c,a);};FC.prototype.getParam=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);return aA(d,a,c);};FC.prototype.setParam=function(a,c,d){var e=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);bA(e,a,c,d);};FC.prototype.__destroy__=function(){cA(this.a);};function GC(a){a&&"object"===typeof a&&(a=a.a);this.a=dA(a);h(GC)[this.a]=this;}GC.prototype=Object.create(m.prototype);GC.prototype.constructor=GC;GC.prototype.b=GC;GC.c={};b.btSphereShape=GC;GC.prototype.setMargin=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);eA(c,a);};GC.prototype.getMargin=function(){return fA(this.a);};GC.prototype.setLocalScaling=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);gA(c,a);};GC.prototype.getLocalScaling=function(){return k(hA(this.a),p);};GC.prototype.calculateLocalInertia=function(a,c){var d=this.a;a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);iA(d,a,c);};GC.prototype.__destroy__=function(){jA(this.a);};function X(){throw"cannot construct a Face, no constructor in IDL";}X.prototype=Object.create(f.prototype);X.prototype.constructor=X;X.prototype.b=X;X.c={};b.Face=X;X.prototype.get_m_n=X.prototype.R=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(kA(c,a),Node);};X.prototype.set_m_n=X.prototype.aa=function(a,c){var d=this.a;YA();a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);lA(d,a,c);};Object.defineProperty(X.prototype,"m_n",{get:X.prototype.R,set:X.prototype.aa});X.prototype.get_m_normal=X.prototype.Wb=function(){return k(mA(this.a),p);};X.prototype.set_m_normal=X.prototype.He=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);nA(c,a);};Object.defineProperty(X.prototype,"m_normal",{get:X.prototype.Wb,set:X.prototype.He});X.prototype.get_m_ra=X.prototype.dc=function(){return oA(this.a);};X.prototype.set_m_ra=X.prototype.Pe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);pA(c,a);};Object.defineProperty(X.prototype,"m_ra",{get:X.prototype.dc,set:X.prototype.Pe});X.prototype.__destroy__=function(){qA(this.a);};function lC(){throw"cannot construct a tFaceArray, no constructor in IDL";}lC.prototype=Object.create(f.prototype);lC.prototype.constructor=lC;lC.prototype.b=lC;lC.c={};b.tFaceArray=lC;lC.prototype.size=lC.prototype.size=function(){return rA(this.a);};lC.prototype.at=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);return k(sA(c,a),X);};lC.prototype.__destroy__=function(){tA(this.a);};function Z(a,c,d,e,g){a&&"object"===typeof a&&(a=a.a);c&&"object"===typeof c&&(c=c.a);d&&"object"===typeof d&&(d=d.a);e&&"object"===typeof e&&(e=e.a);g&&"object"===typeof g&&(g=g.a);this.a=uA(a,c,d,e,g);h(Z)[this.a]=this;}Z.prototype=Object.create(f.prototype);Z.prototype.constructor=Z;Z.prototype.b=Z;Z.c={};b.LocalConvexResult=Z;Z.prototype.get_m_hitCollisionObject=Z.prototype.xb=function(){return k(vA(this.a),q);};Z.prototype.set_m_hitCollisionObject=Z.prototype.ie=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);wA(c,a);};Object.defineProperty(Z.prototype,"m_hitCollisionObject",{get:Z.prototype.xb,set:Z.prototype.ie});Z.prototype.get_m_localShapeInfo=Z.prototype.Rb=function(){return k(xA(this.a),LB);};Z.prototype.set_m_localShapeInfo=Z.prototype.Ce=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);yA(c,a);};Object.defineProperty(Z.prototype,"m_localShapeInfo",{get:Z.prototype.Rb,set:Z.prototype.Ce});Z.prototype.get_m_hitNormalLocal=Z.prototype.Bb=function(){return k(zA(this.a),p);};Z.prototype.set_m_hitNormalLocal=Z.prototype.me=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);AA(c,a);};Object.defineProperty(Z.prototype,"m_hitNormalLocal",{get:Z.prototype.Bb,set:Z.prototype.me});Z.prototype.get_m_hitPointLocal=Z.prototype.Db=function(){return k(BA(this.a),p);};Z.prototype.set_m_hitPointLocal=Z.prototype.oe=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);CA(c,a);};Object.defineProperty(Z.prototype,"m_hitPointLocal",{get:Z.prototype.Db,set:Z.prototype.oe});Z.prototype.get_m_hitFraction=Z.prototype.yb=function(){return DA(this.a);};Z.prototype.set_m_hitFraction=Z.prototype.je=function(a){var c=this.a;a&&"object"===typeof a&&(a=a.a);EA(c,a);};Object.defineProperty(Z.prototype,"m_hitFraction",{get:Z.prototype.yb,set:Z.prototype.je});Z.prototype.__destroy__=function(){FA(this.a);};(function(){function a(){b.BT_CONSTRAINT_ERP=GA();b.BT_CONSTRAINT_STOP_ERP=HA();b.BT_CONSTRAINT_CFM=IA();b.BT_CONSTRAINT_STOP_CFM=JA();b.PHY_FLOAT=KA();b.PHY_DOUBLE=LA();b.PHY_INTEGER=MA();b.PHY_SHORT=NA();b.PHY_FIXEDPOINT88=OA();b.PHY_UCHAR=PA();}Ta?a():Ra.unshift(a);})();this.Ammo=b;return Ammo.ready;};}();if(true)module.exports=Ammo;else {}

/***/ }),

/***/ "./node_modules/dat.gui/build/dat.gui.module.js":
/*!******************************************************!*\
  !*** ./node_modules/dat.gui/build/dat.gui.module.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GUI": () => (/* binding */ GUI$1),
/* harmony export */   "color": () => (/* binding */ color),
/* harmony export */   "controllers": () => (/* binding */ controllers),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "dom": () => (/* binding */ dom$1),
/* harmony export */   "gui": () => (/* binding */ gui)
/* harmony export */ });
/**
 * dat-gui JavaScript Controller Library
 * https://github.com/dataarts/dat.gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function ___$insertStyle(css) {
  if (!css) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

function colorToString(color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();

  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);

  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);

    while (str.length < 6) {
      str = '0' + str;
    }

    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }

  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);

      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }

      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }

    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;

      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;

      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }

      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);

      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }

    isNaN.toString = function () {
      return _isNaN.toString();
    };

    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return obj instanceof Function;
  }
};
var INTERPRETATIONS = [{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);

        if (test === null) {
          return false;
        }

        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);

        if (test === null) {
          return false;
        }

        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);

        if (test === null) {
          return false;
        }

        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);

        if (test === null) {
          return false;
        }

        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
}, {
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
}, {
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }

        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
}, {
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }

        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;

var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);

        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;

    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }

    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }

    h /= 6;

    if (h < 0) {
      h += 1;
    }

    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }

    this.__state.a = this.__state.a || 1;
  }

  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();

function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }

      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }

      this.__state[component] = v;
    }
  });
}

function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }

      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }

      this.__state[component] = v;
    }
  });
}

Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};

Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });

  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};

Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
      this.__state.space = 'HEX';
    }

    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }

  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;

      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }

      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }

  var match = val.match(CSS_VALUE_PIXELS);

  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }

  return 0;
}

var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;

    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }

    if (Common.isUndefined(vertical)) {
      vertical = true;
    }

    elem.style.position = 'absolute';

    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }

    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];

    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }

    var evt = document.createEvent(className);

    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
          break;
        }

      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }

      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }

    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;

    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }

    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;

    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }

    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);

      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }

    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);

        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }

    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = {
      left: 0,
      top: 0
    };

    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }

    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);

  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);

    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));

    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');

    _this2.__checkbox.setAttribute('type', 'checkbox');

    function onChange() {
      _this.setValue(!_this.__prev);
    }

    dom.bind(_this2.__checkbox, 'change', onChange, false);

    _this2.domElement.appendChild(_this2.__checkbox);

    _this2.updateDisplay();

    return _this2;
  }

  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }

      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');

        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }

      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);

  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);

    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));

    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');

    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }

    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);

      _this.__select.appendChild(opt);
    });

    _this2.updateDisplay();

    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;

      _this.setValue(desiredValue);
    });

    _this2.domElement.appendChild(_this2.__select);

    return _this2;
  }

  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }

      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);

  function StringController(object, property) {
    classCallCheck(this, StringController);

    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));

    var _this = _this2;

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    _this2.__input = document.createElement('input');

    _this2.__input.setAttribute('type', 'text');

    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });

    _this2.updateDisplay();

    _this2.domElement.appendChild(_this2.__input);

    return _this2;
  }

  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }

      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();

  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }

  return 0;
}

var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);

  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);

    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));

    var _params = params || {};

    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;

    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }

    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }

  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;

      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }

      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }

      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);

  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);

    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));

    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;

    function onChange() {
      var attempted = parseFloat(_this.__input.value);

      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onBlur() {
      onFinish();
    }

    function onMouseDrag(e) {
      var diff = prevY - e.clientY;

      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prevY = e.clientY;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }

    _this2.__input = document.createElement('input');

    _this2.__input.setAttribute('type', 'text');

    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });

    _this2.updateDisplay();

    _this2.domElement.appendChild(_this2.__input);

    return _this2;
  }

  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);

  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);

    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, {
      min: min,
      max: max,
      step: step
    }));

    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');

    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }

    function onMouseDrag(e) {
      e.preventDefault();

      var bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));

      return false;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);

      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }

      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }

    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;

      var bgRect = _this.__background.getBoundingClientRect();

      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }

    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);

      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    _this2.updateDisplay();

    _this2.__background.appendChild(_this2.__foreground);

    _this2.domElement.appendChild(_this2.__background);

    return _this2;
  }

  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);

      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);

  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);

    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));

    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();

      _this.fire();

      return false;
    });
    dom.addClass(_this2.__button, 'button');

    _this2.domElement.appendChild(_this2.__button);

    return _this2;
  }

  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }

      this.getValue().call(this.object);

      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
  inherits(ColorController, _Controller);

  function ColorController(object, property) {
    classCallCheck(this, ColorController);

    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));

    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function () {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function () {
      dom.addClass(this, 'drag').bind(window, 'touchend', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);

    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }

    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }

    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }

    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }

    function onBlur() {
      var i = interpret(this.value);

      if (i !== false) {
        _this.__color.__state = i;

        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }

    _this2.__saturation_field.appendChild(valueField);

    _this2.__selector.appendChild(_this2.__field_knob);

    _this2.__selector.appendChild(_this2.__saturation_field);

    _this2.__selector.appendChild(_this2.__hue_field);

    _this2.__hue_field.appendChild(_this2.__hue_knob);

    _this2.domElement.appendChild(_this2.__input);

    _this2.domElement.appendChild(_this2.__selector);

    _this2.updateDisplay();

    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }

      var fieldRect = _this.__saturation_field.getBoundingClientRect();

      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;

      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }

      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }

      var fieldRect = _this.__hue_field.getBoundingClientRect();

      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;

      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    return _this2;
  }

  createClass(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());

      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);

        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }

      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;

      var _flip = 255 - flip;

      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);

var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];

function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}

function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];

    try {
      head.appendChild(injected);
    } catch (e) {}
  }
};
var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];

  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }

  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }

      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }

    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, {
        min: arguments[2],
        max: arguments[3],
        step: arguments[4]
      });
    }

    return new NumberControllerBox(object, property, {
      min: arguments[2],
      max: arguments[3]
    });
  }

  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }

  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }

  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }

  return null;
};

function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}

var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;

    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }

  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;

      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;

      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };

      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();

var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];

var GUI = function GUI(pars) {
  var _this = this;

  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });

  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = {
      preset: DEFAULT_DEFAULT_PRESET_NAME
    };
  }

  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }

  params.resizable = Common.isUndefined(params.parent) && params.resizable;

  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }

  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(this, {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }

        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }

        setPresetSelectIndex(this);

        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;

        if (titleRow) {
          titleRow.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;

        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }

        this.onResize();

        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;

          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }

          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });

  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);

    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }

    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);

    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }

    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }

    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, 'controller-name');
    titleRow = addRow(_this, titleRowName);

    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };

    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);

    if (!params.closed) {
      this.closed = false;
    }
  }

  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }

      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }

    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }

  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };

  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();

  if (params.resizable) {
    addResizeHandle(this);
  }

  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };

  this.saveToLocalStorageIfPossible = saveToLocalStorage;

  function resetWidth() {
    var root = _this.getRoot();

    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }

  if (!params.parent) {
    resetWidth();
  }
};

GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};

GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';

GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};

dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype, {
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);

    this.__controllers.splice(this.__controllers.indexOf(controller), 1);

    var _this = this;

    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }

    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }

    var _this = this;

    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }

    var newGuiParams = {
      name: name,
      parent: this
    };
    newGuiParams.autoPlace = this.autoPlace;

    if (this.load && this.load.folders && this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }

    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);

    delete this.__folders[folder.name];

    if (this.load && this.load.folders && this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }

    removeListeners(folder);

    var _this = this;

    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  hide: function hide() {
    this.domElement.style.display = 'none';
  },
  show: function show() {
    this.domElement.style.display = '';
  },
  onResize: function onResize() {
    var root = this.getRoot();

    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });

      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }

    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }

    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }

    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }

    var _this = this;

    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }

      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });

    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;

    while (gui.parent) {
      gui = gui.parent;
    }

    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;

    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;

      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }

      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }

    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }

    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }

    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }

      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });

    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;

    this.__listening.push(controller);

    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});

function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');

  if (newDom) {
    li.appendChild(newDom);
  }

  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }

  gui.onResize();
  return li;
}

function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);

  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}

function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];

  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}

function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller, {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }

      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);

      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);

      return controller;
    }
  });

  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, {
      min: controller.__min,
      max: controller.__max,
      step: controller.__step
    });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
      var pc = controller[method];
      var pb = box[method];

      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();

        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });

        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }

      return returned;
    };

    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }

  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }

    return val;
  }, controller.setValue);
}

function recallSavedValue(gui, controller) {
  var root = gui.getRoot();

  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);

  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];

    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }

    controllerMap[controller.property] = controller;

    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;

      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }

      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}

function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }

  var controller = void 0;

  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }

  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }

  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);

  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }

  augmentController(gui, li, controller);

  gui.__controllers.push(controller);

  return controller;
}

function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}

function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;

  gui.__preset_select.appendChild(opt);

  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}

function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}

function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');

  gui.__ul.insertBefore(div, gui.__ul.firstChild);

  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');

  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }

  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }

    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);

  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';

    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }

    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }

  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');

    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}

function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });

  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }

  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }

  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }

  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}

function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';

  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }

  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}

function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}

function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}

function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }

  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}

var color = {
  Color: Color,
  math: ColorMath,
  interpret: interpret
};
var controllers = {
  Controller: Controller,
  BooleanController: BooleanController,
  OptionController: OptionController,
  StringController: StringController,
  NumberController: NumberController,
  NumberControllerBox: NumberControllerBox,
  NumberControllerSlider: NumberControllerSlider,
  FunctionController: FunctionController,
  ColorController: ColorController
};
var dom$1 = {
  dom: dom
};
var gui = {
  GUI: GUI
};
var GUI$1 = GUI;
var index = {
  color: color,
  controllers: controllers,
  dom: dom$1,
  gui: gui,
  GUI: GUI$1
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);

/***/ }),

/***/ "./src/physics.js":
/*!************************!*\
  !*** ./src/physics.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhysicsController": () => (/* binding */ PhysicsController)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ammojs_typed__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ammojs-typed */ "./node_modules/ammojs-typed/ammo/ammo.js");
/* harmony import */ var ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ammojs_typed__WEBPACK_IMPORTED_MODULE_4__);




function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



var PhysicsController = /*#__PURE__*/function () {
  function PhysicsController() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, PhysicsController);
  }

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(PhysicsController, [{
    key: "init",
    value: function () {
      var _init = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().mark(function _callee() {
        var collisionConfiguration, dispatcher, broadphase, solver, softBodySolver;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default()((ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default()));

              case 2:
                collisionConfiguration = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btSoftBodyRigidBodyCollisionConfiguration)();
                dispatcher = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btCollisionDispatcher)(collisionConfiguration);
                broadphase = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btDbvtBroadphase)();
                solver = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btSequentialImpulseConstraintSolver)();
                softBodySolver = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btDefaultSoftBodySolver)();
                this.world = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btSoftRigidDynamicsWorld)(dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
                this.world.setGravity(new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btVector3)(0, 0, 0));
                this.world.getWorldInfo().set_m_gravity(new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btVector3)(0, 0, 0));
                this.meshes = [];

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "createPlanet",
    value: function createPlanet(objThree, radius, mass, pos, quat) {
      var transform = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btTransform)();
      transform.setIdentity();
      transform.setOrigin(new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btVector3)(pos.x, pos.y, pos.z));
      transform.setRotation(new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btQuaternion)(quat.x, quat.y, quat.z, quat.w));
      var motionState = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btDefaultMotionState)(transform);
      var localInertia = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btVector3)(0, 0, 0);
      var physicsShape = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btSphereShape)(radius);
      physicsShape.calculateLocalInertia(mass, localInertia);
      var rbInfo = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btRigidBodyConstructionInfo)(mass, motionState, physicsShape, localInertia);
      var body = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btRigidBody)(rbInfo);
      this.world.addRigidBody(body);
      objThree.userData.physicsBody = body;
      body.mass = mass;
      this.meshes.push(objThree);
      return body;
    }
  }, {
    key: "applyImpulse",
    value: function applyImpulse(body, vector) {
      body.applyCentralImpulse(new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btVector3)(vector.x, vector.y, vector.z));
    }
  }, {
    key: "animate",
    value: function animate(delta) {
      var _iterator = _createForOfIteratorHelper(this.meshes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var objThree = _step.value;

          var _iterator3 = _createForOfIteratorHelper(this.meshes),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var objThree2 = _step3.value;
              var body = objThree.userData.physicsBody;
              var body2 = objThree2.userData.physicsBody;

              if (body != body2) {
                var pos1 = this.getPosition(body);
                var pos2 = this.getPosition(body2);
                pos2.op_sub(pos1);
                var force = pos2;
                var mass = body.mass;
                var mass2 = body2.mass;
                var r = pos2.length();

                if (r != 0) {
                  force.op_mul(mass * mass2 / (r * r));
                  body.applyCentralForce(force);
                }

                pos1.__destroy__();

                pos2.__destroy__();
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (delta > 0) this.world.stepSimulation(delta, 10);

      var _iterator2 = _createForOfIteratorHelper(this.meshes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _objThree = _step2.value;
          this.syncPhysicsState(_objThree);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "getPosition",
    value: function getPosition(objPhys) {
      var ms = objPhys.getMotionState();
      var transform = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btTransform)();
      ms.getWorldTransform(transform);
      var p = transform.getOrigin();
      var tmp = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btVector3)(p.x(), p.y(), p.z());

      transform.__destroy__();

      return tmp;
    }
  }, {
    key: "syncPhysicsState",
    value: function syncPhysicsState(objThree) {
      var objPhys = objThree.userData.physicsBody;
      var ms = objPhys.getMotionState();
      var transform = new (ammojs_typed__WEBPACK_IMPORTED_MODULE_4___default().btTransform)();
      ms.getWorldTransform(transform);
      var p = transform.getOrigin();
      var q = transform.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

      transform.__destroy__();
    }
  }]);

  return PhysicsController;
}();

/***/ }),

/***/ "?db70":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?539c":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACESFilmicToneMapping": () => (/* binding */ ACESFilmicToneMapping),
/* harmony export */   "AddEquation": () => (/* binding */ AddEquation),
/* harmony export */   "AddOperation": () => (/* binding */ AddOperation),
/* harmony export */   "AdditiveAnimationBlendMode": () => (/* binding */ AdditiveAnimationBlendMode),
/* harmony export */   "AdditiveBlending": () => (/* binding */ AdditiveBlending),
/* harmony export */   "AlphaFormat": () => (/* binding */ AlphaFormat),
/* harmony export */   "AlwaysDepth": () => (/* binding */ AlwaysDepth),
/* harmony export */   "AlwaysStencilFunc": () => (/* binding */ AlwaysStencilFunc),
/* harmony export */   "AmbientLight": () => (/* binding */ AmbientLight),
/* harmony export */   "AmbientLightProbe": () => (/* binding */ AmbientLightProbe),
/* harmony export */   "AnimationClip": () => (/* binding */ AnimationClip),
/* harmony export */   "AnimationLoader": () => (/* binding */ AnimationLoader),
/* harmony export */   "AnimationMixer": () => (/* binding */ AnimationMixer),
/* harmony export */   "AnimationObjectGroup": () => (/* binding */ AnimationObjectGroup),
/* harmony export */   "AnimationUtils": () => (/* binding */ AnimationUtils),
/* harmony export */   "ArcCurve": () => (/* binding */ ArcCurve),
/* harmony export */   "ArrayCamera": () => (/* binding */ ArrayCamera),
/* harmony export */   "ArrowHelper": () => (/* binding */ ArrowHelper),
/* harmony export */   "Audio": () => (/* binding */ Audio),
/* harmony export */   "AudioAnalyser": () => (/* binding */ AudioAnalyser),
/* harmony export */   "AudioContext": () => (/* binding */ AudioContext),
/* harmony export */   "AudioListener": () => (/* binding */ AudioListener),
/* harmony export */   "AudioLoader": () => (/* binding */ AudioLoader),
/* harmony export */   "AxesHelper": () => (/* binding */ AxesHelper),
/* harmony export */   "AxisHelper": () => (/* binding */ AxisHelper),
/* harmony export */   "BackSide": () => (/* binding */ BackSide),
/* harmony export */   "BasicDepthPacking": () => (/* binding */ BasicDepthPacking),
/* harmony export */   "BasicShadowMap": () => (/* binding */ BasicShadowMap),
/* harmony export */   "BinaryTextureLoader": () => (/* binding */ BinaryTextureLoader),
/* harmony export */   "Bone": () => (/* binding */ Bone),
/* harmony export */   "BooleanKeyframeTrack": () => (/* binding */ BooleanKeyframeTrack),
/* harmony export */   "BoundingBoxHelper": () => (/* binding */ BoundingBoxHelper),
/* harmony export */   "Box2": () => (/* binding */ Box2),
/* harmony export */   "Box3": () => (/* binding */ Box3),
/* harmony export */   "Box3Helper": () => (/* binding */ Box3Helper),
/* harmony export */   "BoxBufferGeometry": () => (/* binding */ BoxGeometry),
/* harmony export */   "BoxGeometry": () => (/* binding */ BoxGeometry),
/* harmony export */   "BoxHelper": () => (/* binding */ BoxHelper),
/* harmony export */   "BufferAttribute": () => (/* binding */ BufferAttribute),
/* harmony export */   "BufferGeometry": () => (/* binding */ BufferGeometry),
/* harmony export */   "BufferGeometryLoader": () => (/* binding */ BufferGeometryLoader),
/* harmony export */   "ByteType": () => (/* binding */ ByteType),
/* harmony export */   "Cache": () => (/* binding */ Cache),
/* harmony export */   "Camera": () => (/* binding */ Camera),
/* harmony export */   "CameraHelper": () => (/* binding */ CameraHelper),
/* harmony export */   "CanvasRenderer": () => (/* binding */ CanvasRenderer),
/* harmony export */   "CanvasTexture": () => (/* binding */ CanvasTexture),
/* harmony export */   "CatmullRomCurve3": () => (/* binding */ CatmullRomCurve3),
/* harmony export */   "CineonToneMapping": () => (/* binding */ CineonToneMapping),
/* harmony export */   "CircleBufferGeometry": () => (/* binding */ CircleGeometry),
/* harmony export */   "CircleGeometry": () => (/* binding */ CircleGeometry),
/* harmony export */   "ClampToEdgeWrapping": () => (/* binding */ ClampToEdgeWrapping),
/* harmony export */   "Clock": () => (/* binding */ Clock),
/* harmony export */   "Color": () => (/* binding */ Color),
/* harmony export */   "ColorKeyframeTrack": () => (/* binding */ ColorKeyframeTrack),
/* harmony export */   "CompressedTexture": () => (/* binding */ CompressedTexture),
/* harmony export */   "CompressedTextureLoader": () => (/* binding */ CompressedTextureLoader),
/* harmony export */   "ConeBufferGeometry": () => (/* binding */ ConeGeometry),
/* harmony export */   "ConeGeometry": () => (/* binding */ ConeGeometry),
/* harmony export */   "CubeCamera": () => (/* binding */ CubeCamera),
/* harmony export */   "CubeReflectionMapping": () => (/* binding */ CubeReflectionMapping),
/* harmony export */   "CubeRefractionMapping": () => (/* binding */ CubeRefractionMapping),
/* harmony export */   "CubeTexture": () => (/* binding */ CubeTexture),
/* harmony export */   "CubeTextureLoader": () => (/* binding */ CubeTextureLoader),
/* harmony export */   "CubeUVReflectionMapping": () => (/* binding */ CubeUVReflectionMapping),
/* harmony export */   "CubeUVRefractionMapping": () => (/* binding */ CubeUVRefractionMapping),
/* harmony export */   "CubicBezierCurve": () => (/* binding */ CubicBezierCurve),
/* harmony export */   "CubicBezierCurve3": () => (/* binding */ CubicBezierCurve3),
/* harmony export */   "CubicInterpolant": () => (/* binding */ CubicInterpolant),
/* harmony export */   "CullFaceBack": () => (/* binding */ CullFaceBack),
/* harmony export */   "CullFaceFront": () => (/* binding */ CullFaceFront),
/* harmony export */   "CullFaceFrontBack": () => (/* binding */ CullFaceFrontBack),
/* harmony export */   "CullFaceNone": () => (/* binding */ CullFaceNone),
/* harmony export */   "Curve": () => (/* binding */ Curve),
/* harmony export */   "CurvePath": () => (/* binding */ CurvePath),
/* harmony export */   "CustomBlending": () => (/* binding */ CustomBlending),
/* harmony export */   "CustomToneMapping": () => (/* binding */ CustomToneMapping),
/* harmony export */   "CylinderBufferGeometry": () => (/* binding */ CylinderGeometry),
/* harmony export */   "CylinderGeometry": () => (/* binding */ CylinderGeometry),
/* harmony export */   "Cylindrical": () => (/* binding */ Cylindrical),
/* harmony export */   "Data3DTexture": () => (/* binding */ Data3DTexture),
/* harmony export */   "DataArrayTexture": () => (/* binding */ DataArrayTexture),
/* harmony export */   "DataTexture": () => (/* binding */ DataTexture),
/* harmony export */   "DataTexture2DArray": () => (/* binding */ DataTexture2DArray),
/* harmony export */   "DataTexture3D": () => (/* binding */ DataTexture3D),
/* harmony export */   "DataTextureLoader": () => (/* binding */ DataTextureLoader),
/* harmony export */   "DataUtils": () => (/* binding */ DataUtils),
/* harmony export */   "DecrementStencilOp": () => (/* binding */ DecrementStencilOp),
/* harmony export */   "DecrementWrapStencilOp": () => (/* binding */ DecrementWrapStencilOp),
/* harmony export */   "DefaultLoadingManager": () => (/* binding */ DefaultLoadingManager),
/* harmony export */   "DepthFormat": () => (/* binding */ DepthFormat),
/* harmony export */   "DepthStencilFormat": () => (/* binding */ DepthStencilFormat),
/* harmony export */   "DepthTexture": () => (/* binding */ DepthTexture),
/* harmony export */   "DirectionalLight": () => (/* binding */ DirectionalLight),
/* harmony export */   "DirectionalLightHelper": () => (/* binding */ DirectionalLightHelper),
/* harmony export */   "DiscreteInterpolant": () => (/* binding */ DiscreteInterpolant),
/* harmony export */   "DodecahedronBufferGeometry": () => (/* binding */ DodecahedronGeometry),
/* harmony export */   "DodecahedronGeometry": () => (/* binding */ DodecahedronGeometry),
/* harmony export */   "DoubleSide": () => (/* binding */ DoubleSide),
/* harmony export */   "DstAlphaFactor": () => (/* binding */ DstAlphaFactor),
/* harmony export */   "DstColorFactor": () => (/* binding */ DstColorFactor),
/* harmony export */   "DynamicBufferAttribute": () => (/* binding */ DynamicBufferAttribute),
/* harmony export */   "DynamicCopyUsage": () => (/* binding */ DynamicCopyUsage),
/* harmony export */   "DynamicDrawUsage": () => (/* binding */ DynamicDrawUsage),
/* harmony export */   "DynamicReadUsage": () => (/* binding */ DynamicReadUsage),
/* harmony export */   "EdgesGeometry": () => (/* binding */ EdgesGeometry),
/* harmony export */   "EdgesHelper": () => (/* binding */ EdgesHelper),
/* harmony export */   "EllipseCurve": () => (/* binding */ EllipseCurve),
/* harmony export */   "EqualDepth": () => (/* binding */ EqualDepth),
/* harmony export */   "EqualStencilFunc": () => (/* binding */ EqualStencilFunc),
/* harmony export */   "EquirectangularReflectionMapping": () => (/* binding */ EquirectangularReflectionMapping),
/* harmony export */   "EquirectangularRefractionMapping": () => (/* binding */ EquirectangularRefractionMapping),
/* harmony export */   "Euler": () => (/* binding */ Euler),
/* harmony export */   "EventDispatcher": () => (/* binding */ EventDispatcher),
/* harmony export */   "ExtrudeBufferGeometry": () => (/* binding */ ExtrudeGeometry),
/* harmony export */   "ExtrudeGeometry": () => (/* binding */ ExtrudeGeometry),
/* harmony export */   "FaceColors": () => (/* binding */ FaceColors),
/* harmony export */   "FileLoader": () => (/* binding */ FileLoader),
/* harmony export */   "FlatShading": () => (/* binding */ FlatShading),
/* harmony export */   "Float16BufferAttribute": () => (/* binding */ Float16BufferAttribute),
/* harmony export */   "Float32Attribute": () => (/* binding */ Float32Attribute),
/* harmony export */   "Float32BufferAttribute": () => (/* binding */ Float32BufferAttribute),
/* harmony export */   "Float64Attribute": () => (/* binding */ Float64Attribute),
/* harmony export */   "Float64BufferAttribute": () => (/* binding */ Float64BufferAttribute),
/* harmony export */   "FloatType": () => (/* binding */ FloatType),
/* harmony export */   "Fog": () => (/* binding */ Fog),
/* harmony export */   "FogExp2": () => (/* binding */ FogExp2),
/* harmony export */   "Font": () => (/* binding */ Font),
/* harmony export */   "FontLoader": () => (/* binding */ FontLoader),
/* harmony export */   "FramebufferTexture": () => (/* binding */ FramebufferTexture),
/* harmony export */   "FrontSide": () => (/* binding */ FrontSide),
/* harmony export */   "Frustum": () => (/* binding */ Frustum),
/* harmony export */   "GLBufferAttribute": () => (/* binding */ GLBufferAttribute),
/* harmony export */   "GLSL1": () => (/* binding */ GLSL1),
/* harmony export */   "GLSL3": () => (/* binding */ GLSL3),
/* harmony export */   "GreaterDepth": () => (/* binding */ GreaterDepth),
/* harmony export */   "GreaterEqualDepth": () => (/* binding */ GreaterEqualDepth),
/* harmony export */   "GreaterEqualStencilFunc": () => (/* binding */ GreaterEqualStencilFunc),
/* harmony export */   "GreaterStencilFunc": () => (/* binding */ GreaterStencilFunc),
/* harmony export */   "GridHelper": () => (/* binding */ GridHelper),
/* harmony export */   "Group": () => (/* binding */ Group),
/* harmony export */   "HalfFloatType": () => (/* binding */ HalfFloatType),
/* harmony export */   "HemisphereLight": () => (/* binding */ HemisphereLight),
/* harmony export */   "HemisphereLightHelper": () => (/* binding */ HemisphereLightHelper),
/* harmony export */   "HemisphereLightProbe": () => (/* binding */ HemisphereLightProbe),
/* harmony export */   "IcosahedronBufferGeometry": () => (/* binding */ IcosahedronGeometry),
/* harmony export */   "IcosahedronGeometry": () => (/* binding */ IcosahedronGeometry),
/* harmony export */   "ImageBitmapLoader": () => (/* binding */ ImageBitmapLoader),
/* harmony export */   "ImageLoader": () => (/* binding */ ImageLoader),
/* harmony export */   "ImageUtils": () => (/* binding */ ImageUtils),
/* harmony export */   "ImmediateRenderObject": () => (/* binding */ ImmediateRenderObject),
/* harmony export */   "IncrementStencilOp": () => (/* binding */ IncrementStencilOp),
/* harmony export */   "IncrementWrapStencilOp": () => (/* binding */ IncrementWrapStencilOp),
/* harmony export */   "InstancedBufferAttribute": () => (/* binding */ InstancedBufferAttribute),
/* harmony export */   "InstancedBufferGeometry": () => (/* binding */ InstancedBufferGeometry),
/* harmony export */   "InstancedInterleavedBuffer": () => (/* binding */ InstancedInterleavedBuffer),
/* harmony export */   "InstancedMesh": () => (/* binding */ InstancedMesh),
/* harmony export */   "Int16Attribute": () => (/* binding */ Int16Attribute),
/* harmony export */   "Int16BufferAttribute": () => (/* binding */ Int16BufferAttribute),
/* harmony export */   "Int32Attribute": () => (/* binding */ Int32Attribute),
/* harmony export */   "Int32BufferAttribute": () => (/* binding */ Int32BufferAttribute),
/* harmony export */   "Int8Attribute": () => (/* binding */ Int8Attribute),
/* harmony export */   "Int8BufferAttribute": () => (/* binding */ Int8BufferAttribute),
/* harmony export */   "IntType": () => (/* binding */ IntType),
/* harmony export */   "InterleavedBuffer": () => (/* binding */ InterleavedBuffer),
/* harmony export */   "InterleavedBufferAttribute": () => (/* binding */ InterleavedBufferAttribute),
/* harmony export */   "Interpolant": () => (/* binding */ Interpolant),
/* harmony export */   "InterpolateDiscrete": () => (/* binding */ InterpolateDiscrete),
/* harmony export */   "InterpolateLinear": () => (/* binding */ InterpolateLinear),
/* harmony export */   "InterpolateSmooth": () => (/* binding */ InterpolateSmooth),
/* harmony export */   "InvertStencilOp": () => (/* binding */ InvertStencilOp),
/* harmony export */   "JSONLoader": () => (/* binding */ JSONLoader),
/* harmony export */   "KeepStencilOp": () => (/* binding */ KeepStencilOp),
/* harmony export */   "KeyframeTrack": () => (/* binding */ KeyframeTrack),
/* harmony export */   "LOD": () => (/* binding */ LOD),
/* harmony export */   "LatheBufferGeometry": () => (/* binding */ LatheGeometry),
/* harmony export */   "LatheGeometry": () => (/* binding */ LatheGeometry),
/* harmony export */   "Layers": () => (/* binding */ Layers),
/* harmony export */   "LensFlare": () => (/* binding */ LensFlare),
/* harmony export */   "LessDepth": () => (/* binding */ LessDepth),
/* harmony export */   "LessEqualDepth": () => (/* binding */ LessEqualDepth),
/* harmony export */   "LessEqualStencilFunc": () => (/* binding */ LessEqualStencilFunc),
/* harmony export */   "LessStencilFunc": () => (/* binding */ LessStencilFunc),
/* harmony export */   "Light": () => (/* binding */ Light),
/* harmony export */   "LightProbe": () => (/* binding */ LightProbe),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "Line3": () => (/* binding */ Line3),
/* harmony export */   "LineBasicMaterial": () => (/* binding */ LineBasicMaterial),
/* harmony export */   "LineCurve": () => (/* binding */ LineCurve),
/* harmony export */   "LineCurve3": () => (/* binding */ LineCurve3),
/* harmony export */   "LineDashedMaterial": () => (/* binding */ LineDashedMaterial),
/* harmony export */   "LineLoop": () => (/* binding */ LineLoop),
/* harmony export */   "LinePieces": () => (/* binding */ LinePieces),
/* harmony export */   "LineSegments": () => (/* binding */ LineSegments),
/* harmony export */   "LineStrip": () => (/* binding */ LineStrip),
/* harmony export */   "LinearEncoding": () => (/* binding */ LinearEncoding),
/* harmony export */   "LinearFilter": () => (/* binding */ LinearFilter),
/* harmony export */   "LinearInterpolant": () => (/* binding */ LinearInterpolant),
/* harmony export */   "LinearMipMapLinearFilter": () => (/* binding */ LinearMipMapLinearFilter),
/* harmony export */   "LinearMipMapNearestFilter": () => (/* binding */ LinearMipMapNearestFilter),
/* harmony export */   "LinearMipmapLinearFilter": () => (/* binding */ LinearMipmapLinearFilter),
/* harmony export */   "LinearMipmapNearestFilter": () => (/* binding */ LinearMipmapNearestFilter),
/* harmony export */   "LinearToneMapping": () => (/* binding */ LinearToneMapping),
/* harmony export */   "Loader": () => (/* binding */ Loader),
/* harmony export */   "LoaderUtils": () => (/* binding */ LoaderUtils),
/* harmony export */   "LoadingManager": () => (/* binding */ LoadingManager),
/* harmony export */   "LoopOnce": () => (/* binding */ LoopOnce),
/* harmony export */   "LoopPingPong": () => (/* binding */ LoopPingPong),
/* harmony export */   "LoopRepeat": () => (/* binding */ LoopRepeat),
/* harmony export */   "LuminanceAlphaFormat": () => (/* binding */ LuminanceAlphaFormat),
/* harmony export */   "LuminanceFormat": () => (/* binding */ LuminanceFormat),
/* harmony export */   "MOUSE": () => (/* binding */ MOUSE),
/* harmony export */   "Material": () => (/* binding */ Material),
/* harmony export */   "MaterialLoader": () => (/* binding */ MaterialLoader),
/* harmony export */   "Math": () => (/* binding */ MathUtils),
/* harmony export */   "MathUtils": () => (/* binding */ MathUtils),
/* harmony export */   "Matrix3": () => (/* binding */ Matrix3),
/* harmony export */   "Matrix4": () => (/* binding */ Matrix4),
/* harmony export */   "MaxEquation": () => (/* binding */ MaxEquation),
/* harmony export */   "Mesh": () => (/* binding */ Mesh),
/* harmony export */   "MeshBasicMaterial": () => (/* binding */ MeshBasicMaterial),
/* harmony export */   "MeshDepthMaterial": () => (/* binding */ MeshDepthMaterial),
/* harmony export */   "MeshDistanceMaterial": () => (/* binding */ MeshDistanceMaterial),
/* harmony export */   "MeshFaceMaterial": () => (/* binding */ MeshFaceMaterial),
/* harmony export */   "MeshLambertMaterial": () => (/* binding */ MeshLambertMaterial),
/* harmony export */   "MeshMatcapMaterial": () => (/* binding */ MeshMatcapMaterial),
/* harmony export */   "MeshNormalMaterial": () => (/* binding */ MeshNormalMaterial),
/* harmony export */   "MeshPhongMaterial": () => (/* binding */ MeshPhongMaterial),
/* harmony export */   "MeshPhysicalMaterial": () => (/* binding */ MeshPhysicalMaterial),
/* harmony export */   "MeshStandardMaterial": () => (/* binding */ MeshStandardMaterial),
/* harmony export */   "MeshToonMaterial": () => (/* binding */ MeshToonMaterial),
/* harmony export */   "MinEquation": () => (/* binding */ MinEquation),
/* harmony export */   "MirroredRepeatWrapping": () => (/* binding */ MirroredRepeatWrapping),
/* harmony export */   "MixOperation": () => (/* binding */ MixOperation),
/* harmony export */   "MultiMaterial": () => (/* binding */ MultiMaterial),
/* harmony export */   "MultiplyBlending": () => (/* binding */ MultiplyBlending),
/* harmony export */   "MultiplyOperation": () => (/* binding */ MultiplyOperation),
/* harmony export */   "NearestFilter": () => (/* binding */ NearestFilter),
/* harmony export */   "NearestMipMapLinearFilter": () => (/* binding */ NearestMipMapLinearFilter),
/* harmony export */   "NearestMipMapNearestFilter": () => (/* binding */ NearestMipMapNearestFilter),
/* harmony export */   "NearestMipmapLinearFilter": () => (/* binding */ NearestMipmapLinearFilter),
/* harmony export */   "NearestMipmapNearestFilter": () => (/* binding */ NearestMipmapNearestFilter),
/* harmony export */   "NeverDepth": () => (/* binding */ NeverDepth),
/* harmony export */   "NeverStencilFunc": () => (/* binding */ NeverStencilFunc),
/* harmony export */   "NoBlending": () => (/* binding */ NoBlending),
/* harmony export */   "NoColors": () => (/* binding */ NoColors),
/* harmony export */   "NoToneMapping": () => (/* binding */ NoToneMapping),
/* harmony export */   "NormalAnimationBlendMode": () => (/* binding */ NormalAnimationBlendMode),
/* harmony export */   "NormalBlending": () => (/* binding */ NormalBlending),
/* harmony export */   "NotEqualDepth": () => (/* binding */ NotEqualDepth),
/* harmony export */   "NotEqualStencilFunc": () => (/* binding */ NotEqualStencilFunc),
/* harmony export */   "NumberKeyframeTrack": () => (/* binding */ NumberKeyframeTrack),
/* harmony export */   "Object3D": () => (/* binding */ Object3D),
/* harmony export */   "ObjectLoader": () => (/* binding */ ObjectLoader),
/* harmony export */   "ObjectSpaceNormalMap": () => (/* binding */ ObjectSpaceNormalMap),
/* harmony export */   "OctahedronBufferGeometry": () => (/* binding */ OctahedronGeometry),
/* harmony export */   "OctahedronGeometry": () => (/* binding */ OctahedronGeometry),
/* harmony export */   "OneFactor": () => (/* binding */ OneFactor),
/* harmony export */   "OneMinusDstAlphaFactor": () => (/* binding */ OneMinusDstAlphaFactor),
/* harmony export */   "OneMinusDstColorFactor": () => (/* binding */ OneMinusDstColorFactor),
/* harmony export */   "OneMinusSrcAlphaFactor": () => (/* binding */ OneMinusSrcAlphaFactor),
/* harmony export */   "OneMinusSrcColorFactor": () => (/* binding */ OneMinusSrcColorFactor),
/* harmony export */   "OrthographicCamera": () => (/* binding */ OrthographicCamera),
/* harmony export */   "PCFShadowMap": () => (/* binding */ PCFShadowMap),
/* harmony export */   "PCFSoftShadowMap": () => (/* binding */ PCFSoftShadowMap),
/* harmony export */   "PMREMGenerator": () => (/* binding */ PMREMGenerator),
/* harmony export */   "ParametricGeometry": () => (/* binding */ ParametricGeometry),
/* harmony export */   "Particle": () => (/* binding */ Particle),
/* harmony export */   "ParticleBasicMaterial": () => (/* binding */ ParticleBasicMaterial),
/* harmony export */   "ParticleSystem": () => (/* binding */ ParticleSystem),
/* harmony export */   "ParticleSystemMaterial": () => (/* binding */ ParticleSystemMaterial),
/* harmony export */   "Path": () => (/* binding */ Path),
/* harmony export */   "PerspectiveCamera": () => (/* binding */ PerspectiveCamera),
/* harmony export */   "Plane": () => (/* binding */ Plane),
/* harmony export */   "PlaneBufferGeometry": () => (/* binding */ PlaneGeometry),
/* harmony export */   "PlaneGeometry": () => (/* binding */ PlaneGeometry),
/* harmony export */   "PlaneHelper": () => (/* binding */ PlaneHelper),
/* harmony export */   "PointCloud": () => (/* binding */ PointCloud),
/* harmony export */   "PointCloudMaterial": () => (/* binding */ PointCloudMaterial),
/* harmony export */   "PointLight": () => (/* binding */ PointLight),
/* harmony export */   "PointLightHelper": () => (/* binding */ PointLightHelper),
/* harmony export */   "Points": () => (/* binding */ Points),
/* harmony export */   "PointsMaterial": () => (/* binding */ PointsMaterial),
/* harmony export */   "PolarGridHelper": () => (/* binding */ PolarGridHelper),
/* harmony export */   "PolyhedronBufferGeometry": () => (/* binding */ PolyhedronGeometry),
/* harmony export */   "PolyhedronGeometry": () => (/* binding */ PolyhedronGeometry),
/* harmony export */   "PositionalAudio": () => (/* binding */ PositionalAudio),
/* harmony export */   "PropertyBinding": () => (/* binding */ PropertyBinding),
/* harmony export */   "PropertyMixer": () => (/* binding */ PropertyMixer),
/* harmony export */   "QuadraticBezierCurve": () => (/* binding */ QuadraticBezierCurve),
/* harmony export */   "QuadraticBezierCurve3": () => (/* binding */ QuadraticBezierCurve3),
/* harmony export */   "Quaternion": () => (/* binding */ Quaternion),
/* harmony export */   "QuaternionKeyframeTrack": () => (/* binding */ QuaternionKeyframeTrack),
/* harmony export */   "QuaternionLinearInterpolant": () => (/* binding */ QuaternionLinearInterpolant),
/* harmony export */   "REVISION": () => (/* binding */ REVISION),
/* harmony export */   "RGBADepthPacking": () => (/* binding */ RGBADepthPacking),
/* harmony export */   "RGBAFormat": () => (/* binding */ RGBAFormat),
/* harmony export */   "RGBAIntegerFormat": () => (/* binding */ RGBAIntegerFormat),
/* harmony export */   "RGBA_ASTC_10x10_Format": () => (/* binding */ RGBA_ASTC_10x10_Format),
/* harmony export */   "RGBA_ASTC_10x5_Format": () => (/* binding */ RGBA_ASTC_10x5_Format),
/* harmony export */   "RGBA_ASTC_10x6_Format": () => (/* binding */ RGBA_ASTC_10x6_Format),
/* harmony export */   "RGBA_ASTC_10x8_Format": () => (/* binding */ RGBA_ASTC_10x8_Format),
/* harmony export */   "RGBA_ASTC_12x10_Format": () => (/* binding */ RGBA_ASTC_12x10_Format),
/* harmony export */   "RGBA_ASTC_12x12_Format": () => (/* binding */ RGBA_ASTC_12x12_Format),
/* harmony export */   "RGBA_ASTC_4x4_Format": () => (/* binding */ RGBA_ASTC_4x4_Format),
/* harmony export */   "RGBA_ASTC_5x4_Format": () => (/* binding */ RGBA_ASTC_5x4_Format),
/* harmony export */   "RGBA_ASTC_5x5_Format": () => (/* binding */ RGBA_ASTC_5x5_Format),
/* harmony export */   "RGBA_ASTC_6x5_Format": () => (/* binding */ RGBA_ASTC_6x5_Format),
/* harmony export */   "RGBA_ASTC_6x6_Format": () => (/* binding */ RGBA_ASTC_6x6_Format),
/* harmony export */   "RGBA_ASTC_8x5_Format": () => (/* binding */ RGBA_ASTC_8x5_Format),
/* harmony export */   "RGBA_ASTC_8x6_Format": () => (/* binding */ RGBA_ASTC_8x6_Format),
/* harmony export */   "RGBA_ASTC_8x8_Format": () => (/* binding */ RGBA_ASTC_8x8_Format),
/* harmony export */   "RGBA_BPTC_Format": () => (/* binding */ RGBA_BPTC_Format),
/* harmony export */   "RGBA_ETC2_EAC_Format": () => (/* binding */ RGBA_ETC2_EAC_Format),
/* harmony export */   "RGBA_PVRTC_2BPPV1_Format": () => (/* binding */ RGBA_PVRTC_2BPPV1_Format),
/* harmony export */   "RGBA_PVRTC_4BPPV1_Format": () => (/* binding */ RGBA_PVRTC_4BPPV1_Format),
/* harmony export */   "RGBA_S3TC_DXT1_Format": () => (/* binding */ RGBA_S3TC_DXT1_Format),
/* harmony export */   "RGBA_S3TC_DXT3_Format": () => (/* binding */ RGBA_S3TC_DXT3_Format),
/* harmony export */   "RGBA_S3TC_DXT5_Format": () => (/* binding */ RGBA_S3TC_DXT5_Format),
/* harmony export */   "RGBFormat": () => (/* binding */ RGBFormat),
/* harmony export */   "RGB_ETC1_Format": () => (/* binding */ RGB_ETC1_Format),
/* harmony export */   "RGB_ETC2_Format": () => (/* binding */ RGB_ETC2_Format),
/* harmony export */   "RGB_PVRTC_2BPPV1_Format": () => (/* binding */ RGB_PVRTC_2BPPV1_Format),
/* harmony export */   "RGB_PVRTC_4BPPV1_Format": () => (/* binding */ RGB_PVRTC_4BPPV1_Format),
/* harmony export */   "RGB_S3TC_DXT1_Format": () => (/* binding */ RGB_S3TC_DXT1_Format),
/* harmony export */   "RGFormat": () => (/* binding */ RGFormat),
/* harmony export */   "RGIntegerFormat": () => (/* binding */ RGIntegerFormat),
/* harmony export */   "RawShaderMaterial": () => (/* binding */ RawShaderMaterial),
/* harmony export */   "Ray": () => (/* binding */ Ray),
/* harmony export */   "Raycaster": () => (/* binding */ Raycaster),
/* harmony export */   "RectAreaLight": () => (/* binding */ RectAreaLight),
/* harmony export */   "RedFormat": () => (/* binding */ RedFormat),
/* harmony export */   "RedIntegerFormat": () => (/* binding */ RedIntegerFormat),
/* harmony export */   "ReinhardToneMapping": () => (/* binding */ ReinhardToneMapping),
/* harmony export */   "RepeatWrapping": () => (/* binding */ RepeatWrapping),
/* harmony export */   "ReplaceStencilOp": () => (/* binding */ ReplaceStencilOp),
/* harmony export */   "ReverseSubtractEquation": () => (/* binding */ ReverseSubtractEquation),
/* harmony export */   "RingBufferGeometry": () => (/* binding */ RingGeometry),
/* harmony export */   "RingGeometry": () => (/* binding */ RingGeometry),
/* harmony export */   "Scene": () => (/* binding */ Scene),
/* harmony export */   "SceneUtils": () => (/* binding */ SceneUtils),
/* harmony export */   "ShaderChunk": () => (/* binding */ ShaderChunk),
/* harmony export */   "ShaderLib": () => (/* binding */ ShaderLib),
/* harmony export */   "ShaderMaterial": () => (/* binding */ ShaderMaterial),
/* harmony export */   "ShadowMaterial": () => (/* binding */ ShadowMaterial),
/* harmony export */   "Shape": () => (/* binding */ Shape),
/* harmony export */   "ShapeBufferGeometry": () => (/* binding */ ShapeGeometry),
/* harmony export */   "ShapeGeometry": () => (/* binding */ ShapeGeometry),
/* harmony export */   "ShapePath": () => (/* binding */ ShapePath),
/* harmony export */   "ShapeUtils": () => (/* binding */ ShapeUtils),
/* harmony export */   "ShortType": () => (/* binding */ ShortType),
/* harmony export */   "Skeleton": () => (/* binding */ Skeleton),
/* harmony export */   "SkeletonHelper": () => (/* binding */ SkeletonHelper),
/* harmony export */   "SkinnedMesh": () => (/* binding */ SkinnedMesh),
/* harmony export */   "SmoothShading": () => (/* binding */ SmoothShading),
/* harmony export */   "Sphere": () => (/* binding */ Sphere),
/* harmony export */   "SphereBufferGeometry": () => (/* binding */ SphereGeometry),
/* harmony export */   "SphereGeometry": () => (/* binding */ SphereGeometry),
/* harmony export */   "Spherical": () => (/* binding */ Spherical),
/* harmony export */   "SphericalHarmonics3": () => (/* binding */ SphericalHarmonics3),
/* harmony export */   "SplineCurve": () => (/* binding */ SplineCurve),
/* harmony export */   "SpotLight": () => (/* binding */ SpotLight),
/* harmony export */   "SpotLightHelper": () => (/* binding */ SpotLightHelper),
/* harmony export */   "Sprite": () => (/* binding */ Sprite),
/* harmony export */   "SpriteMaterial": () => (/* binding */ SpriteMaterial),
/* harmony export */   "SrcAlphaFactor": () => (/* binding */ SrcAlphaFactor),
/* harmony export */   "SrcAlphaSaturateFactor": () => (/* binding */ SrcAlphaSaturateFactor),
/* harmony export */   "SrcColorFactor": () => (/* binding */ SrcColorFactor),
/* harmony export */   "StaticCopyUsage": () => (/* binding */ StaticCopyUsage),
/* harmony export */   "StaticDrawUsage": () => (/* binding */ StaticDrawUsage),
/* harmony export */   "StaticReadUsage": () => (/* binding */ StaticReadUsage),
/* harmony export */   "StereoCamera": () => (/* binding */ StereoCamera),
/* harmony export */   "StreamCopyUsage": () => (/* binding */ StreamCopyUsage),
/* harmony export */   "StreamDrawUsage": () => (/* binding */ StreamDrawUsage),
/* harmony export */   "StreamReadUsage": () => (/* binding */ StreamReadUsage),
/* harmony export */   "StringKeyframeTrack": () => (/* binding */ StringKeyframeTrack),
/* harmony export */   "SubtractEquation": () => (/* binding */ SubtractEquation),
/* harmony export */   "SubtractiveBlending": () => (/* binding */ SubtractiveBlending),
/* harmony export */   "TOUCH": () => (/* binding */ TOUCH),
/* harmony export */   "TangentSpaceNormalMap": () => (/* binding */ TangentSpaceNormalMap),
/* harmony export */   "TetrahedronBufferGeometry": () => (/* binding */ TetrahedronGeometry),
/* harmony export */   "TetrahedronGeometry": () => (/* binding */ TetrahedronGeometry),
/* harmony export */   "TextGeometry": () => (/* binding */ TextGeometry),
/* harmony export */   "Texture": () => (/* binding */ Texture),
/* harmony export */   "TextureLoader": () => (/* binding */ TextureLoader),
/* harmony export */   "TorusBufferGeometry": () => (/* binding */ TorusGeometry),
/* harmony export */   "TorusGeometry": () => (/* binding */ TorusGeometry),
/* harmony export */   "TorusKnotBufferGeometry": () => (/* binding */ TorusKnotGeometry),
/* harmony export */   "TorusKnotGeometry": () => (/* binding */ TorusKnotGeometry),
/* harmony export */   "Triangle": () => (/* binding */ Triangle),
/* harmony export */   "TriangleFanDrawMode": () => (/* binding */ TriangleFanDrawMode),
/* harmony export */   "TriangleStripDrawMode": () => (/* binding */ TriangleStripDrawMode),
/* harmony export */   "TrianglesDrawMode": () => (/* binding */ TrianglesDrawMode),
/* harmony export */   "TubeBufferGeometry": () => (/* binding */ TubeGeometry),
/* harmony export */   "TubeGeometry": () => (/* binding */ TubeGeometry),
/* harmony export */   "UVMapping": () => (/* binding */ UVMapping),
/* harmony export */   "Uint16Attribute": () => (/* binding */ Uint16Attribute),
/* harmony export */   "Uint16BufferAttribute": () => (/* binding */ Uint16BufferAttribute),
/* harmony export */   "Uint32Attribute": () => (/* binding */ Uint32Attribute),
/* harmony export */   "Uint32BufferAttribute": () => (/* binding */ Uint32BufferAttribute),
/* harmony export */   "Uint8Attribute": () => (/* binding */ Uint8Attribute),
/* harmony export */   "Uint8BufferAttribute": () => (/* binding */ Uint8BufferAttribute),
/* harmony export */   "Uint8ClampedAttribute": () => (/* binding */ Uint8ClampedAttribute),
/* harmony export */   "Uint8ClampedBufferAttribute": () => (/* binding */ Uint8ClampedBufferAttribute),
/* harmony export */   "Uniform": () => (/* binding */ Uniform),
/* harmony export */   "UniformsLib": () => (/* binding */ UniformsLib),
/* harmony export */   "UniformsUtils": () => (/* binding */ UniformsUtils),
/* harmony export */   "UnsignedByteType": () => (/* binding */ UnsignedByteType),
/* harmony export */   "UnsignedInt248Type": () => (/* binding */ UnsignedInt248Type),
/* harmony export */   "UnsignedIntType": () => (/* binding */ UnsignedIntType),
/* harmony export */   "UnsignedShort4444Type": () => (/* binding */ UnsignedShort4444Type),
/* harmony export */   "UnsignedShort5551Type": () => (/* binding */ UnsignedShort5551Type),
/* harmony export */   "UnsignedShortType": () => (/* binding */ UnsignedShortType),
/* harmony export */   "VSMShadowMap": () => (/* binding */ VSMShadowMap),
/* harmony export */   "Vector2": () => (/* binding */ Vector2),
/* harmony export */   "Vector3": () => (/* binding */ Vector3),
/* harmony export */   "Vector4": () => (/* binding */ Vector4),
/* harmony export */   "VectorKeyframeTrack": () => (/* binding */ VectorKeyframeTrack),
/* harmony export */   "Vertex": () => (/* binding */ Vertex),
/* harmony export */   "VertexColors": () => (/* binding */ VertexColors),
/* harmony export */   "VideoTexture": () => (/* binding */ VideoTexture),
/* harmony export */   "WebGL1Renderer": () => (/* binding */ WebGL1Renderer),
/* harmony export */   "WebGL3DRenderTarget": () => (/* binding */ WebGL3DRenderTarget),
/* harmony export */   "WebGLArrayRenderTarget": () => (/* binding */ WebGLArrayRenderTarget),
/* harmony export */   "WebGLCubeRenderTarget": () => (/* binding */ WebGLCubeRenderTarget),
/* harmony export */   "WebGLMultipleRenderTargets": () => (/* binding */ WebGLMultipleRenderTargets),
/* harmony export */   "WebGLMultisampleRenderTarget": () => (/* binding */ WebGLMultisampleRenderTarget),
/* harmony export */   "WebGLRenderTarget": () => (/* binding */ WebGLRenderTarget),
/* harmony export */   "WebGLRenderTargetCube": () => (/* binding */ WebGLRenderTargetCube),
/* harmony export */   "WebGLRenderer": () => (/* binding */ WebGLRenderer),
/* harmony export */   "WebGLUtils": () => (/* binding */ WebGLUtils),
/* harmony export */   "WireframeGeometry": () => (/* binding */ WireframeGeometry),
/* harmony export */   "WireframeHelper": () => (/* binding */ WireframeHelper),
/* harmony export */   "WrapAroundEnding": () => (/* binding */ WrapAroundEnding),
/* harmony export */   "XHRLoader": () => (/* binding */ XHRLoader),
/* harmony export */   "ZeroCurvatureEnding": () => (/* binding */ ZeroCurvatureEnding),
/* harmony export */   "ZeroFactor": () => (/* binding */ ZeroFactor),
/* harmony export */   "ZeroSlopeEnding": () => (/* binding */ ZeroSlopeEnding),
/* harmony export */   "ZeroStencilOp": () => (/* binding */ ZeroStencilOp),
/* harmony export */   "_SRGBAFormat": () => (/* binding */ _SRGBAFormat),
/* harmony export */   "sRGBEncoding": () => (/* binding */ sRGBEncoding)
/* harmony export */ });
/**
 * @license
 * Copyright 2010-2022 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const REVISION='138';const MOUSE={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2};const TOUCH={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};const CullFaceNone=0;const CullFaceBack=1;const CullFaceFront=2;const CullFaceFrontBack=3;const BasicShadowMap=0;const PCFShadowMap=1;const PCFSoftShadowMap=2;const VSMShadowMap=3;const FrontSide=0;const BackSide=1;const DoubleSide=2;const FlatShading=1;const SmoothShading=2;const NoBlending=0;const NormalBlending=1;const AdditiveBlending=2;const SubtractiveBlending=3;const MultiplyBlending=4;const CustomBlending=5;const AddEquation=100;const SubtractEquation=101;const ReverseSubtractEquation=102;const MinEquation=103;const MaxEquation=104;const ZeroFactor=200;const OneFactor=201;const SrcColorFactor=202;const OneMinusSrcColorFactor=203;const SrcAlphaFactor=204;const OneMinusSrcAlphaFactor=205;const DstAlphaFactor=206;const OneMinusDstAlphaFactor=207;const DstColorFactor=208;const OneMinusDstColorFactor=209;const SrcAlphaSaturateFactor=210;const NeverDepth=0;const AlwaysDepth=1;const LessDepth=2;const LessEqualDepth=3;const EqualDepth=4;const GreaterEqualDepth=5;const GreaterDepth=6;const NotEqualDepth=7;const MultiplyOperation=0;const MixOperation=1;const AddOperation=2;const NoToneMapping=0;const LinearToneMapping=1;const ReinhardToneMapping=2;const CineonToneMapping=3;const ACESFilmicToneMapping=4;const CustomToneMapping=5;const UVMapping=300;const CubeReflectionMapping=301;const CubeRefractionMapping=302;const EquirectangularReflectionMapping=303;const EquirectangularRefractionMapping=304;const CubeUVReflectionMapping=306;const CubeUVRefractionMapping=307;const RepeatWrapping=1000;const ClampToEdgeWrapping=1001;const MirroredRepeatWrapping=1002;const NearestFilter=1003;const NearestMipmapNearestFilter=1004;const NearestMipMapNearestFilter=1004;const NearestMipmapLinearFilter=1005;const NearestMipMapLinearFilter=1005;const LinearFilter=1006;const LinearMipmapNearestFilter=1007;const LinearMipMapNearestFilter=1007;const LinearMipmapLinearFilter=1008;const LinearMipMapLinearFilter=1008;const UnsignedByteType=1009;const ByteType=1010;const ShortType=1011;const UnsignedShortType=1012;const IntType=1013;const UnsignedIntType=1014;const FloatType=1015;const HalfFloatType=1016;const UnsignedShort4444Type=1017;const UnsignedShort5551Type=1018;const UnsignedInt248Type=1020;const AlphaFormat=1021;const RGBFormat=1022;const RGBAFormat=1023;const LuminanceFormat=1024;const LuminanceAlphaFormat=1025;const DepthFormat=1026;const DepthStencilFormat=1027;const RedFormat=1028;const RedIntegerFormat=1029;const RGFormat=1030;const RGIntegerFormat=1031;const RGBAIntegerFormat=1033;const RGB_S3TC_DXT1_Format=33776;const RGBA_S3TC_DXT1_Format=33777;const RGBA_S3TC_DXT3_Format=33778;const RGBA_S3TC_DXT5_Format=33779;const RGB_PVRTC_4BPPV1_Format=35840;const RGB_PVRTC_2BPPV1_Format=35841;const RGBA_PVRTC_4BPPV1_Format=35842;const RGBA_PVRTC_2BPPV1_Format=35843;const RGB_ETC1_Format=36196;const RGB_ETC2_Format=37492;const RGBA_ETC2_EAC_Format=37496;const RGBA_ASTC_4x4_Format=37808;const RGBA_ASTC_5x4_Format=37809;const RGBA_ASTC_5x5_Format=37810;const RGBA_ASTC_6x5_Format=37811;const RGBA_ASTC_6x6_Format=37812;const RGBA_ASTC_8x5_Format=37813;const RGBA_ASTC_8x6_Format=37814;const RGBA_ASTC_8x8_Format=37815;const RGBA_ASTC_10x5_Format=37816;const RGBA_ASTC_10x6_Format=37817;const RGBA_ASTC_10x8_Format=37818;const RGBA_ASTC_10x10_Format=37819;const RGBA_ASTC_12x10_Format=37820;const RGBA_ASTC_12x12_Format=37821;const RGBA_BPTC_Format=36492;const LoopOnce=2200;const LoopRepeat=2201;const LoopPingPong=2202;const InterpolateDiscrete=2300;const InterpolateLinear=2301;const InterpolateSmooth=2302;const ZeroCurvatureEnding=2400;const ZeroSlopeEnding=2401;const WrapAroundEnding=2402;const NormalAnimationBlendMode=2500;const AdditiveAnimationBlendMode=2501;const TrianglesDrawMode=0;const TriangleStripDrawMode=1;const TriangleFanDrawMode=2;const LinearEncoding=3000;const sRGBEncoding=3001;const BasicDepthPacking=3200;const RGBADepthPacking=3201;const TangentSpaceNormalMap=0;const ObjectSpaceNormalMap=1;const ZeroStencilOp=0;const KeepStencilOp=7680;const ReplaceStencilOp=7681;const IncrementStencilOp=7682;const DecrementStencilOp=7683;const IncrementWrapStencilOp=34055;const DecrementWrapStencilOp=34056;const InvertStencilOp=5386;const NeverStencilFunc=512;const LessStencilFunc=513;const EqualStencilFunc=514;const LessEqualStencilFunc=515;const GreaterStencilFunc=516;const NotEqualStencilFunc=517;const GreaterEqualStencilFunc=518;const AlwaysStencilFunc=519;const StaticDrawUsage=35044;const DynamicDrawUsage=35048;const StreamDrawUsage=35040;const StaticReadUsage=35045;const DynamicReadUsage=35049;const StreamReadUsage=35041;const StaticCopyUsage=35046;const DynamicCopyUsage=35050;const StreamCopyUsage=35042;const GLSL1='100';const GLSL3='300 es';const _SRGBAFormat=1035;// fallback for WebGL 1
/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */class EventDispatcher{addEventListener(type,listener){if(this._listeners===undefined)this._listeners={};const listeners=this._listeners;if(listeners[type]===undefined){listeners[type]=[];}if(listeners[type].indexOf(listener)===-1){listeners[type].push(listener);}}hasEventListener(type,listener){if(this._listeners===undefined)return false;const listeners=this._listeners;return listeners[type]!==undefined&&listeners[type].indexOf(listener)!==-1;}removeEventListener(type,listener){if(this._listeners===undefined)return;const listeners=this._listeners;const listenerArray=listeners[type];if(listenerArray!==undefined){const index=listenerArray.indexOf(listener);if(index!==-1){listenerArray.splice(index,1);}}}dispatchEvent(event){if(this._listeners===undefined)return;const listeners=this._listeners;const listenerArray=listeners[event.type];if(listenerArray!==undefined){event.target=this;// Make a copy, in case listeners are removed while iterating.
const array=listenerArray.slice(0);for(let i=0,l=array.length;i<l;i++){array[i].call(this,event);}event.target=null;}}}const _lut=[];for(let i=0;i<256;i++){_lut[i]=(i<16?'0':'')+i.toString(16);}let _seed=1234567;const DEG2RAD=Math.PI/180;const RAD2DEG=180/Math.PI;// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
function generateUUID(){const d0=Math.random()*0xffffffff|0;const d1=Math.random()*0xffffffff|0;const d2=Math.random()*0xffffffff|0;const d3=Math.random()*0xffffffff|0;const uuid=_lut[d0&0xff]+_lut[d0>>8&0xff]+_lut[d0>>16&0xff]+_lut[d0>>24&0xff]+'-'+_lut[d1&0xff]+_lut[d1>>8&0xff]+'-'+_lut[d1>>16&0x0f|0x40]+_lut[d1>>24&0xff]+'-'+_lut[d2&0x3f|0x80]+_lut[d2>>8&0xff]+'-'+_lut[d2>>16&0xff]+_lut[d2>>24&0xff]+_lut[d3&0xff]+_lut[d3>>8&0xff]+_lut[d3>>16&0xff]+_lut[d3>>24&0xff];// .toUpperCase() here flattens concatenated strings to save heap memory space.
return uuid.toUpperCase();}function clamp(value,min,max){return Math.max(min,Math.min(max,value));}// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation
function euclideanModulo(n,m){return(n%m+m)%m;}// Linear mapping from range <a1, a2> to range <b1, b2>
function mapLinear(x,a1,a2,b1,b2){return b1+(x-a1)*(b2-b1)/(a2-a1);}// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
function inverseLerp(x,y,value){if(x!==y){return(value-x)/(y-x);}else{return 0;}}// https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(x,y,t){return(1-t)*x+t*y;}// http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
function damp(x,y,lambda,dt){return lerp(x,y,1-Math.exp(-lambda*dt));}// https://www.desmos.com/calculator/vcsjnyz7x4
function pingpong(x,length=1){return length-Math.abs(euclideanModulo(x,length*2)-length);}// http://en.wikipedia.org/wiki/Smoothstep
function smoothstep(x,min,max){if(x<=min)return 0;if(x>=max)return 1;x=(x-min)/(max-min);return x*x*(3-2*x);}function smootherstep(x,min,max){if(x<=min)return 0;if(x>=max)return 1;x=(x-min)/(max-min);return x*x*x*(x*(x*6-15)+10);}// Random integer from <low, high> interval
function randInt(low,high){return low+Math.floor(Math.random()*(high-low+1));}// Random float from <low, high> interval
function randFloat(low,high){return low+Math.random()*(high-low);}// Random float from <-range/2, range/2> interval
function randFloatSpread(range){return range*(0.5-Math.random());}// Deterministic pseudo-random float in the interval [ 0, 1 ]
function seededRandom(s){if(s!==undefined)_seed=s%2147483647;// Park-Miller algorithm
_seed=_seed*16807%2147483647;return(_seed-1)/2147483646;}function degToRad(degrees){return degrees*DEG2RAD;}function radToDeg(radians){return radians*RAD2DEG;}function isPowerOfTwo(value){return(value&value-1)===0&&value!==0;}function ceilPowerOfTwo(value){return Math.pow(2,Math.ceil(Math.log(value)/Math.LN2));}function floorPowerOfTwo(value){return Math.pow(2,Math.floor(Math.log(value)/Math.LN2));}function setQuaternionFromProperEuler(q,a,b,c,order){// Intrinsic Proper Euler Angles - see https://en.wikipedia.org/wiki/Euler_angles
// rotations are applied to the axes in the order specified by 'order'
// rotation by angle 'a' is applied first, then by angle 'b', then by angle 'c'
// angles are in radians
const cos=Math.cos;const sin=Math.sin;const c2=cos(b/2);const s2=sin(b/2);const c13=cos((a+c)/2);const s13=sin((a+c)/2);const c1_3=cos((a-c)/2);const s1_3=sin((a-c)/2);const c3_1=cos((c-a)/2);const s3_1=sin((c-a)/2);switch(order){case'XYX':q.set(c2*s13,s2*c1_3,s2*s1_3,c2*c13);break;case'YZY':q.set(s2*s1_3,c2*s13,s2*c1_3,c2*c13);break;case'ZXZ':q.set(s2*c1_3,s2*s1_3,c2*s13,c2*c13);break;case'XZX':q.set(c2*s13,s2*s3_1,s2*c3_1,c2*c13);break;case'YXY':q.set(s2*c3_1,c2*s13,s2*s3_1,c2*c13);break;case'ZYZ':q.set(s2*s3_1,s2*c3_1,c2*s13,c2*c13);break;default:console.warn('THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: '+order);}}var MathUtils=/*#__PURE__*/Object.freeze({__proto__:null,DEG2RAD:DEG2RAD,RAD2DEG:RAD2DEG,generateUUID:generateUUID,clamp:clamp,euclideanModulo:euclideanModulo,mapLinear:mapLinear,inverseLerp:inverseLerp,lerp:lerp,damp:damp,pingpong:pingpong,smoothstep:smoothstep,smootherstep:smootherstep,randInt:randInt,randFloat:randFloat,randFloatSpread:randFloatSpread,seededRandom:seededRandom,degToRad:degToRad,radToDeg:radToDeg,isPowerOfTwo:isPowerOfTwo,ceilPowerOfTwo:ceilPowerOfTwo,floorPowerOfTwo:floorPowerOfTwo,setQuaternionFromProperEuler:setQuaternionFromProperEuler});class Vector2{constructor(x=0,y=0){this.x=x;this.y=y;}get width(){return this.x;}set width(value){this.x=value;}get height(){return this.y;}set height(value){this.y=value;}set(x,y){this.x=x;this.y=y;return this;}setScalar(scalar){this.x=scalar;this.y=scalar;return this;}setX(x){this.x=x;return this;}setY(y){this.y=y;return this;}setComponent(index,value){switch(index){case 0:this.x=value;break;case 1:this.y=value;break;default:throw new Error('index is out of range: '+index);}return this;}getComponent(index){switch(index){case 0:return this.x;case 1:return this.y;default:throw new Error('index is out of range: '+index);}}clone(){return new this.constructor(this.x,this.y);}copy(v){this.x=v.x;this.y=v.y;return this;}add(v,w){if(w!==undefined){console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');return this.addVectors(v,w);}this.x+=v.x;this.y+=v.y;return this;}addScalar(s){this.x+=s;this.y+=s;return this;}addVectors(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this;}addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;return this;}sub(v,w){if(w!==undefined){console.warn('THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');return this.subVectors(v,w);}this.x-=v.x;this.y-=v.y;return this;}subScalar(s){this.x-=s;this.y-=s;return this;}subVectors(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this;}multiply(v){this.x*=v.x;this.y*=v.y;return this;}multiplyScalar(scalar){this.x*=scalar;this.y*=scalar;return this;}divide(v){this.x/=v.x;this.y/=v.y;return this;}divideScalar(scalar){return this.multiplyScalar(1/scalar);}applyMatrix3(m){const x=this.x,y=this.y;const e=m.elements;this.x=e[0]*x+e[3]*y+e[6];this.y=e[1]*x+e[4]*y+e[7];return this;}min(v){this.x=Math.min(this.x,v.x);this.y=Math.min(this.y,v.y);return this;}max(v){this.x=Math.max(this.x,v.x);this.y=Math.max(this.y,v.y);return this;}clamp(min,max){// assumes min < max, componentwise
this.x=Math.max(min.x,Math.min(max.x,this.x));this.y=Math.max(min.y,Math.min(max.y,this.y));return this;}clampScalar(minVal,maxVal){this.x=Math.max(minVal,Math.min(maxVal,this.x));this.y=Math.max(minVal,Math.min(maxVal,this.y));return this;}clampLength(min,max){const length=this.length();return this.divideScalar(length||1).multiplyScalar(Math.max(min,Math.min(max,length)));}floor(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this;}ceil(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this;}round(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this;}roundToZero(){this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x);this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y);return this;}negate(){this.x=-this.x;this.y=-this.y;return this;}dot(v){return this.x*v.x+this.y*v.y;}cross(v){return this.x*v.y-this.y*v.x;}lengthSq(){return this.x*this.x+this.y*this.y;}length(){return Math.sqrt(this.x*this.x+this.y*this.y);}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y);}normalize(){return this.divideScalar(this.length()||1);}angle(){// computes the angle in radians with respect to the positive x-axis
const angle=Math.atan2(-this.y,-this.x)+Math.PI;return angle;}distanceTo(v){return Math.sqrt(this.distanceToSquared(v));}distanceToSquared(v){const dx=this.x-v.x,dy=this.y-v.y;return dx*dx+dy*dy;}manhattanDistanceTo(v){return Math.abs(this.x-v.x)+Math.abs(this.y-v.y);}setLength(length){return this.normalize().multiplyScalar(length);}lerp(v,alpha){this.x+=(v.x-this.x)*alpha;this.y+=(v.y-this.y)*alpha;return this;}lerpVectors(v1,v2,alpha){this.x=v1.x+(v2.x-v1.x)*alpha;this.y=v1.y+(v2.y-v1.y)*alpha;return this;}equals(v){return v.x===this.x&&v.y===this.y;}fromArray(array,offset=0){this.x=array[offset];this.y=array[offset+1];return this;}toArray(array=[],offset=0){array[offset]=this.x;array[offset+1]=this.y;return array;}fromBufferAttribute(attribute,index,offset){if(offset!==undefined){console.warn('THREE.Vector2: offset has been removed from .fromBufferAttribute().');}this.x=attribute.getX(index);this.y=attribute.getY(index);return this;}rotateAround(center,angle){const c=Math.cos(angle),s=Math.sin(angle);const x=this.x-center.x;const y=this.y-center.y;this.x=x*c-y*s+center.x;this.y=x*s+y*c+center.y;return this;}random(){this.x=Math.random();this.y=Math.random();return this;}*[Symbol.iterator](){yield this.x;yield this.y;}}Vector2.prototype.isVector2=true;class Matrix3{constructor(){this.elements=[1,0,0,0,1,0,0,0,1];if(arguments.length>0){console.error('THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.');}}set(n11,n12,n13,n21,n22,n23,n31,n32,n33){const te=this.elements;te[0]=n11;te[1]=n21;te[2]=n31;te[3]=n12;te[4]=n22;te[5]=n32;te[6]=n13;te[7]=n23;te[8]=n33;return this;}identity(){this.set(1,0,0,0,1,0,0,0,1);return this;}copy(m){const te=this.elements;const me=m.elements;te[0]=me[0];te[1]=me[1];te[2]=me[2];te[3]=me[3];te[4]=me[4];te[5]=me[5];te[6]=me[6];te[7]=me[7];te[8]=me[8];return this;}extractBasis(xAxis,yAxis,zAxis){xAxis.setFromMatrix3Column(this,0);yAxis.setFromMatrix3Column(this,1);zAxis.setFromMatrix3Column(this,2);return this;}setFromMatrix4(m){const me=m.elements;this.set(me[0],me[4],me[8],me[1],me[5],me[9],me[2],me[6],me[10]);return this;}multiply(m){return this.multiplyMatrices(this,m);}premultiply(m){return this.multiplyMatrices(m,this);}multiplyMatrices(a,b){const ae=a.elements;const be=b.elements;const te=this.elements;const a11=ae[0],a12=ae[3],a13=ae[6];const a21=ae[1],a22=ae[4],a23=ae[7];const a31=ae[2],a32=ae[5],a33=ae[8];const b11=be[0],b12=be[3],b13=be[6];const b21=be[1],b22=be[4],b23=be[7];const b31=be[2],b32=be[5],b33=be[8];te[0]=a11*b11+a12*b21+a13*b31;te[3]=a11*b12+a12*b22+a13*b32;te[6]=a11*b13+a12*b23+a13*b33;te[1]=a21*b11+a22*b21+a23*b31;te[4]=a21*b12+a22*b22+a23*b32;te[7]=a21*b13+a22*b23+a23*b33;te[2]=a31*b11+a32*b21+a33*b31;te[5]=a31*b12+a32*b22+a33*b32;te[8]=a31*b13+a32*b23+a33*b33;return this;}multiplyScalar(s){const te=this.elements;te[0]*=s;te[3]*=s;te[6]*=s;te[1]*=s;te[4]*=s;te[7]*=s;te[2]*=s;te[5]*=s;te[8]*=s;return this;}determinant(){const te=this.elements;const a=te[0],b=te[1],c=te[2],d=te[3],e=te[4],f=te[5],g=te[6],h=te[7],i=te[8];return a*e*i-a*f*h-b*d*i+b*f*g+c*d*h-c*e*g;}invert(){const te=this.elements,n11=te[0],n21=te[1],n31=te[2],n12=te[3],n22=te[4],n32=te[5],n13=te[6],n23=te[7],n33=te[8],t11=n33*n22-n32*n23,t12=n32*n13-n33*n12,t13=n23*n12-n22*n13,det=n11*t11+n21*t12+n31*t13;if(det===0)return this.set(0,0,0,0,0,0,0,0,0);const detInv=1/det;te[0]=t11*detInv;te[1]=(n31*n23-n33*n21)*detInv;te[2]=(n32*n21-n31*n22)*detInv;te[3]=t12*detInv;te[4]=(n33*n11-n31*n13)*detInv;te[5]=(n31*n12-n32*n11)*detInv;te[6]=t13*detInv;te[7]=(n21*n13-n23*n11)*detInv;te[8]=(n22*n11-n21*n12)*detInv;return this;}transpose(){let tmp;const m=this.elements;tmp=m[1];m[1]=m[3];m[3]=tmp;tmp=m[2];m[2]=m[6];m[6]=tmp;tmp=m[5];m[5]=m[7];m[7]=tmp;return this;}getNormalMatrix(matrix4){return this.setFromMatrix4(matrix4).invert().transpose();}transposeIntoArray(r){const m=this.elements;r[0]=m[0];r[1]=m[3];r[2]=m[6];r[3]=m[1];r[4]=m[4];r[5]=m[7];r[6]=m[2];r[7]=m[5];r[8]=m[8];return this;}setUvTransform(tx,ty,sx,sy,rotation,cx,cy){const c=Math.cos(rotation);const s=Math.sin(rotation);this.set(sx*c,sx*s,-sx*(c*cx+s*cy)+cx+tx,-sy*s,sy*c,-sy*(-s*cx+c*cy)+cy+ty,0,0,1);return this;}scale(sx,sy){const te=this.elements;te[0]*=sx;te[3]*=sx;te[6]*=sx;te[1]*=sy;te[4]*=sy;te[7]*=sy;return this;}rotate(theta){const c=Math.cos(theta);const s=Math.sin(theta);const te=this.elements;const a11=te[0],a12=te[3],a13=te[6];const a21=te[1],a22=te[4],a23=te[7];te[0]=c*a11+s*a21;te[3]=c*a12+s*a22;te[6]=c*a13+s*a23;te[1]=-s*a11+c*a21;te[4]=-s*a12+c*a22;te[7]=-s*a13+c*a23;return this;}translate(tx,ty){const te=this.elements;te[0]+=tx*te[2];te[3]+=tx*te[5];te[6]+=tx*te[8];te[1]+=ty*te[2];te[4]+=ty*te[5];te[7]+=ty*te[8];return this;}equals(matrix){const te=this.elements;const me=matrix.elements;for(let i=0;i<9;i++){if(te[i]!==me[i])return false;}return true;}fromArray(array,offset=0){for(let i=0;i<9;i++){this.elements[i]=array[i+offset];}return this;}toArray(array=[],offset=0){const te=this.elements;array[offset]=te[0];array[offset+1]=te[1];array[offset+2]=te[2];array[offset+3]=te[3];array[offset+4]=te[4];array[offset+5]=te[5];array[offset+6]=te[6];array[offset+7]=te[7];array[offset+8]=te[8];return array;}clone(){return new this.constructor().fromArray(this.elements);}}Matrix3.prototype.isMatrix3=true;function arrayNeedsUint32(array){// assumes larger values usually on last
for(let i=array.length-1;i>=0;--i){if(array[i]>65535)return true;}return false;}const TYPED_ARRAYS={Int8Array:Int8Array,Uint8Array:Uint8Array,Uint8ClampedArray:Uint8ClampedArray,Int16Array:Int16Array,Uint16Array:Uint16Array,Int32Array:Int32Array,Uint32Array:Uint32Array,Float32Array:Float32Array,Float64Array:Float64Array};function getTypedArray(type,buffer){return new TYPED_ARRAYS[type](buffer);}function createElementNS(name){return document.createElementNS('http://www.w3.org/1999/xhtml',name);}const _colorKeywords={'aliceblue':0xF0F8FF,'antiquewhite':0xFAEBD7,'aqua':0x00FFFF,'aquamarine':0x7FFFD4,'azure':0xF0FFFF,'beige':0xF5F5DC,'bisque':0xFFE4C4,'black':0x000000,'blanchedalmond':0xFFEBCD,'blue':0x0000FF,'blueviolet':0x8A2BE2,'brown':0xA52A2A,'burlywood':0xDEB887,'cadetblue':0x5F9EA0,'chartreuse':0x7FFF00,'chocolate':0xD2691E,'coral':0xFF7F50,'cornflowerblue':0x6495ED,'cornsilk':0xFFF8DC,'crimson':0xDC143C,'cyan':0x00FFFF,'darkblue':0x00008B,'darkcyan':0x008B8B,'darkgoldenrod':0xB8860B,'darkgray':0xA9A9A9,'darkgreen':0x006400,'darkgrey':0xA9A9A9,'darkkhaki':0xBDB76B,'darkmagenta':0x8B008B,'darkolivegreen':0x556B2F,'darkorange':0xFF8C00,'darkorchid':0x9932CC,'darkred':0x8B0000,'darksalmon':0xE9967A,'darkseagreen':0x8FBC8F,'darkslateblue':0x483D8B,'darkslategray':0x2F4F4F,'darkslategrey':0x2F4F4F,'darkturquoise':0x00CED1,'darkviolet':0x9400D3,'deeppink':0xFF1493,'deepskyblue':0x00BFFF,'dimgray':0x696969,'dimgrey':0x696969,'dodgerblue':0x1E90FF,'firebrick':0xB22222,'floralwhite':0xFFFAF0,'forestgreen':0x228B22,'fuchsia':0xFF00FF,'gainsboro':0xDCDCDC,'ghostwhite':0xF8F8FF,'gold':0xFFD700,'goldenrod':0xDAA520,'gray':0x808080,'green':0x008000,'greenyellow':0xADFF2F,'grey':0x808080,'honeydew':0xF0FFF0,'hotpink':0xFF69B4,'indianred':0xCD5C5C,'indigo':0x4B0082,'ivory':0xFFFFF0,'khaki':0xF0E68C,'lavender':0xE6E6FA,'lavenderblush':0xFFF0F5,'lawngreen':0x7CFC00,'lemonchiffon':0xFFFACD,'lightblue':0xADD8E6,'lightcoral':0xF08080,'lightcyan':0xE0FFFF,'lightgoldenrodyellow':0xFAFAD2,'lightgray':0xD3D3D3,'lightgreen':0x90EE90,'lightgrey':0xD3D3D3,'lightpink':0xFFB6C1,'lightsalmon':0xFFA07A,'lightseagreen':0x20B2AA,'lightskyblue':0x87CEFA,'lightslategray':0x778899,'lightslategrey':0x778899,'lightsteelblue':0xB0C4DE,'lightyellow':0xFFFFE0,'lime':0x00FF00,'limegreen':0x32CD32,'linen':0xFAF0E6,'magenta':0xFF00FF,'maroon':0x800000,'mediumaquamarine':0x66CDAA,'mediumblue':0x0000CD,'mediumorchid':0xBA55D3,'mediumpurple':0x9370DB,'mediumseagreen':0x3CB371,'mediumslateblue':0x7B68EE,'mediumspringgreen':0x00FA9A,'mediumturquoise':0x48D1CC,'mediumvioletred':0xC71585,'midnightblue':0x191970,'mintcream':0xF5FFFA,'mistyrose':0xFFE4E1,'moccasin':0xFFE4B5,'navajowhite':0xFFDEAD,'navy':0x000080,'oldlace':0xFDF5E6,'olive':0x808000,'olivedrab':0x6B8E23,'orange':0xFFA500,'orangered':0xFF4500,'orchid':0xDA70D6,'palegoldenrod':0xEEE8AA,'palegreen':0x98FB98,'paleturquoise':0xAFEEEE,'palevioletred':0xDB7093,'papayawhip':0xFFEFD5,'peachpuff':0xFFDAB9,'peru':0xCD853F,'pink':0xFFC0CB,'plum':0xDDA0DD,'powderblue':0xB0E0E6,'purple':0x800080,'rebeccapurple':0x663399,'red':0xFF0000,'rosybrown':0xBC8F8F,'royalblue':0x4169E1,'saddlebrown':0x8B4513,'salmon':0xFA8072,'sandybrown':0xF4A460,'seagreen':0x2E8B57,'seashell':0xFFF5EE,'sienna':0xA0522D,'silver':0xC0C0C0,'skyblue':0x87CEEB,'slateblue':0x6A5ACD,'slategray':0x708090,'slategrey':0x708090,'snow':0xFFFAFA,'springgreen':0x00FF7F,'steelblue':0x4682B4,'tan':0xD2B48C,'teal':0x008080,'thistle':0xD8BFD8,'tomato':0xFF6347,'turquoise':0x40E0D0,'violet':0xEE82EE,'wheat':0xF5DEB3,'white':0xFFFFFF,'whitesmoke':0xF5F5F5,'yellow':0xFFFF00,'yellowgreen':0x9ACD32};const _hslA={h:0,s:0,l:0};const _hslB={h:0,s:0,l:0};function hue2rgb(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*6*(2/3-t);return p;}function SRGBToLinear(c){return c<0.04045?c*0.0773993808:Math.pow(c*0.9478672986+0.0521327014,2.4);}function LinearToSRGB(c){return c<0.0031308?c*12.92:1.055*Math.pow(c,0.41666)-0.055;}class Color{constructor(r,g,b){if(g===undefined&&b===undefined){// r is THREE.Color, hex or string
return this.set(r);}return this.setRGB(r,g,b);}set(value){if(value&&value.isColor){this.copy(value);}else if(typeof value==='number'){this.setHex(value);}else if(typeof value==='string'){this.setStyle(value);}return this;}setScalar(scalar){this.r=scalar;this.g=scalar;this.b=scalar;return this;}setHex(hex){hex=Math.floor(hex);this.r=(hex>>16&255)/255;this.g=(hex>>8&255)/255;this.b=(hex&255)/255;return this;}setRGB(r,g,b){this.r=r;this.g=g;this.b=b;return this;}setHSL(h,s,l){// h,s,l ranges are in 0.0 - 1.0
h=euclideanModulo(h,1);s=clamp(s,0,1);l=clamp(l,0,1);if(s===0){this.r=this.g=this.b=l;}else{const p=l<=0.5?l*(1+s):l+s-l*s;const q=2*l-p;this.r=hue2rgb(q,p,h+1/3);this.g=hue2rgb(q,p,h);this.b=hue2rgb(q,p,h-1/3);}return this;}setStyle(style){function handleAlpha(string){if(string===undefined)return;if(parseFloat(string)<1){console.warn('THREE.Color: Alpha component of '+style+' will be ignored.');}}let m;if(m=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(style)){// rgb / hsl
let color;const name=m[1];const components=m[2];switch(name){case'rgb':case'rgba':if(color=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components)){// rgb(255,0,0) rgba(255,0,0,0.5)
this.r=Math.min(255,parseInt(color[1],10))/255;this.g=Math.min(255,parseInt(color[2],10))/255;this.b=Math.min(255,parseInt(color[3],10))/255;handleAlpha(color[4]);return this;}if(color=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components)){// rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
this.r=Math.min(100,parseInt(color[1],10))/100;this.g=Math.min(100,parseInt(color[2],10))/100;this.b=Math.min(100,parseInt(color[3],10))/100;handleAlpha(color[4]);return this;}break;case'hsl':case'hsla':if(color=/^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components)){// hsl(120,50%,50%) hsla(120,50%,50%,0.5)
const h=parseFloat(color[1])/360;const s=parseInt(color[2],10)/100;const l=parseInt(color[3],10)/100;handleAlpha(color[4]);return this.setHSL(h,s,l);}break;}}else if(m=/^\#([A-Fa-f\d]+)$/.exec(style)){// hex color
const hex=m[1];const size=hex.length;if(size===3){// #ff0
this.r=parseInt(hex.charAt(0)+hex.charAt(0),16)/255;this.g=parseInt(hex.charAt(1)+hex.charAt(1),16)/255;this.b=parseInt(hex.charAt(2)+hex.charAt(2),16)/255;return this;}else if(size===6){// #ff0000
this.r=parseInt(hex.charAt(0)+hex.charAt(1),16)/255;this.g=parseInt(hex.charAt(2)+hex.charAt(3),16)/255;this.b=parseInt(hex.charAt(4)+hex.charAt(5),16)/255;return this;}}if(style&&style.length>0){return this.setColorName(style);}return this;}setColorName(style){// color keywords
const hex=_colorKeywords[style.toLowerCase()];if(hex!==undefined){// red
this.setHex(hex);}else{// unknown color
console.warn('THREE.Color: Unknown color '+style);}return this;}clone(){return new this.constructor(this.r,this.g,this.b);}copy(color){this.r=color.r;this.g=color.g;this.b=color.b;return this;}copySRGBToLinear(color){this.r=SRGBToLinear(color.r);this.g=SRGBToLinear(color.g);this.b=SRGBToLinear(color.b);return this;}copyLinearToSRGB(color){this.r=LinearToSRGB(color.r);this.g=LinearToSRGB(color.g);this.b=LinearToSRGB(color.b);return this;}convertSRGBToLinear(){this.copySRGBToLinear(this);return this;}convertLinearToSRGB(){this.copyLinearToSRGB(this);return this;}getHex(){return this.r*255<<16^this.g*255<<8^this.b*255<<0;}getHexString(){return('000000'+this.getHex().toString(16)).slice(-6);}getHSL(target){// h,s,l ranges are in 0.0 - 1.0
const r=this.r,g=this.g,b=this.b;const max=Math.max(r,g,b);const min=Math.min(r,g,b);let hue,saturation;const lightness=(min+max)/2.0;if(min===max){hue=0;saturation=0;}else{const delta=max-min;saturation=lightness<=0.5?delta/(max+min):delta/(2-max-min);switch(max){case r:hue=(g-b)/delta+(g<b?6:0);break;case g:hue=(b-r)/delta+2;break;case b:hue=(r-g)/delta+4;break;}hue/=6;}target.h=hue;target.s=saturation;target.l=lightness;return target;}getStyle(){return'rgb('+(this.r*255|0)+','+(this.g*255|0)+','+(this.b*255|0)+')';}offsetHSL(h,s,l){this.getHSL(_hslA);_hslA.h+=h;_hslA.s+=s;_hslA.l+=l;this.setHSL(_hslA.h,_hslA.s,_hslA.l);return this;}add(color){this.r+=color.r;this.g+=color.g;this.b+=color.b;return this;}addColors(color1,color2){this.r=color1.r+color2.r;this.g=color1.g+color2.g;this.b=color1.b+color2.b;return this;}addScalar(s){this.r+=s;this.g+=s;this.b+=s;return this;}sub(color){this.r=Math.max(0,this.r-color.r);this.g=Math.max(0,this.g-color.g);this.b=Math.max(0,this.b-color.b);return this;}multiply(color){this.r*=color.r;this.g*=color.g;this.b*=color.b;return this;}multiplyScalar(s){this.r*=s;this.g*=s;this.b*=s;return this;}lerp(color,alpha){this.r+=(color.r-this.r)*alpha;this.g+=(color.g-this.g)*alpha;this.b+=(color.b-this.b)*alpha;return this;}lerpColors(color1,color2,alpha){this.r=color1.r+(color2.r-color1.r)*alpha;this.g=color1.g+(color2.g-color1.g)*alpha;this.b=color1.b+(color2.b-color1.b)*alpha;return this;}lerpHSL(color,alpha){this.getHSL(_hslA);color.getHSL(_hslB);const h=lerp(_hslA.h,_hslB.h,alpha);const s=lerp(_hslA.s,_hslB.s,alpha);const l=lerp(_hslA.l,_hslB.l,alpha);this.setHSL(h,s,l);return this;}equals(c){return c.r===this.r&&c.g===this.g&&c.b===this.b;}fromArray(array,offset=0){this.r=array[offset];this.g=array[offset+1];this.b=array[offset+2];return this;}toArray(array=[],offset=0){array[offset]=this.r;array[offset+1]=this.g;array[offset+2]=this.b;return array;}fromBufferAttribute(attribute,index){this.r=attribute.getX(index);this.g=attribute.getY(index);this.b=attribute.getZ(index);if(attribute.normalized===true){// assuming Uint8Array
this.r/=255;this.g/=255;this.b/=255;}return this;}toJSON(){return this.getHex();}}Color.NAMES=_colorKeywords;Color.prototype.isColor=true;Color.prototype.r=1;Color.prototype.g=1;Color.prototype.b=1;let _canvas;class ImageUtils{static getDataURL(image){if(/^data:/i.test(image.src)){return image.src;}if(typeof HTMLCanvasElement=='undefined'){return image.src;}let canvas;if(image instanceof HTMLCanvasElement){canvas=image;}else{if(_canvas===undefined)_canvas=createElementNS('canvas');_canvas.width=image.width;_canvas.height=image.height;const context=_canvas.getContext('2d');if(image instanceof ImageData){context.putImageData(image,0,0);}else{context.drawImage(image,0,0,image.width,image.height);}canvas=_canvas;}if(canvas.width>2048||canvas.height>2048){console.warn('THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons',image);return canvas.toDataURL('image/jpeg',0.6);}else{return canvas.toDataURL('image/png');}}static sRGBToLinear(image){if(typeof HTMLImageElement!=='undefined'&&image instanceof HTMLImageElement||typeof HTMLCanvasElement!=='undefined'&&image instanceof HTMLCanvasElement||typeof ImageBitmap!=='undefined'&&image instanceof ImageBitmap){const canvas=createElementNS('canvas');canvas.width=image.width;canvas.height=image.height;const context=canvas.getContext('2d');context.drawImage(image,0,0,image.width,image.height);const imageData=context.getImageData(0,0,image.width,image.height);const data=imageData.data;for(let i=0;i<data.length;i++){data[i]=SRGBToLinear(data[i]/255)*255;}context.putImageData(imageData,0,0);return canvas;}else if(image.data){const data=image.data.slice(0);for(let i=0;i<data.length;i++){if(data instanceof Uint8Array||data instanceof Uint8ClampedArray){data[i]=Math.floor(SRGBToLinear(data[i]/255)*255);}else{// assuming float
data[i]=SRGBToLinear(data[i]);}}return{data:data,width:image.width,height:image.height};}else{console.warn('THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.');return image;}}}class Source{constructor(data=null){this.uuid=generateUUID();this.data=data;this.version=0;}set needsUpdate(value){if(value===true)this.version++;}toJSON(meta){const isRootObject=meta===undefined||typeof meta==='string';if(!isRootObject&&meta.images[this.uuid]!==undefined){return meta.images[this.uuid];}const output={uuid:this.uuid,url:''};const data=this.data;if(data!==null){let url;if(Array.isArray(data)){// cube texture
url=[];for(let i=0,l=data.length;i<l;i++){if(data[i].isDataTexture){url.push(serializeImage(data[i].image));}else{url.push(serializeImage(data[i]));}}}else{// texture
url=serializeImage(data);}output.url=url;}if(!isRootObject){meta.images[this.uuid]=output;}return output;}}function serializeImage(image){if(typeof HTMLImageElement!=='undefined'&&image instanceof HTMLImageElement||typeof HTMLCanvasElement!=='undefined'&&image instanceof HTMLCanvasElement||typeof ImageBitmap!=='undefined'&&image instanceof ImageBitmap){// default images
return ImageUtils.getDataURL(image);}else{if(image.data){// images of DataTexture
return{data:Array.prototype.slice.call(image.data),width:image.width,height:image.height,type:image.data.constructor.name};}else{console.warn('THREE.Texture: Unable to serialize Texture.');return{};}}}Source.prototype.isSource=true;let textureId=0;class Texture extends EventDispatcher{constructor(image=Texture.DEFAULT_IMAGE,mapping=Texture.DEFAULT_MAPPING,wrapS=ClampToEdgeWrapping,wrapT=ClampToEdgeWrapping,magFilter=LinearFilter,minFilter=LinearMipmapLinearFilter,format=RGBAFormat,type=UnsignedByteType,anisotropy=1,encoding=LinearEncoding){super();Object.defineProperty(this,'id',{value:textureId++});this.uuid=generateUUID();this.name='';this.source=new Source(image);this.mipmaps=[];this.mapping=mapping;this.wrapS=wrapS;this.wrapT=wrapT;this.magFilter=magFilter;this.minFilter=minFilter;this.anisotropy=anisotropy;this.format=format;this.internalFormat=null;this.type=type;this.offset=new Vector2(0,0);this.repeat=new Vector2(1,1);this.center=new Vector2(0,0);this.rotation=0;this.matrixAutoUpdate=true;this.matrix=new Matrix3();this.generateMipmaps=true;this.premultiplyAlpha=false;this.flipY=true;this.unpackAlignment=4;// valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)
// Values of encoding !== THREE.LinearEncoding only supported on map, envMap and emissiveMap.
//
// Also changing the encoding after already used by a Material will not automatically make the Material
// update. You need to explicitly call Material.needsUpdate to trigger it to recompile.
this.encoding=encoding;this.userData={};this.version=0;this.onUpdate=null;this.isRenderTargetTexture=false;// indicates whether a texture belongs to a render target or not
this.needsPMREMUpdate=false;// indicates whether this texture should be processed by PMREMGenerator or not (only relevant for render target textures)
// q is assumed to be normalized
this.w=2*Math.acos(q.w);const s=Math.sqrt(1-q.w*q.w);if(s<0.0001){this.x=1;this.y=0;this.z=0;}else{this.x=q.x/s;this.y=q.y/s;this.z=q.z/s;}return this;}setAxisAngleFromRotationMatrix(m){// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
let angle,x,y,z;// variables for result
const epsilon=0.01,// margin to allow for rounding errors
epsilon2=0.1,// margin to distinguish between 0 and 180 degrees
te=m.elements,m11=te[0],m12=te[4],m13=te[8],m21=te[1],m22=te[5],m23=te[9],m31=te[2],m32=te[6],m33=te[10];if(Math.abs(m12-m21)<epsilon&&Math.abs(m13-m31)<epsilon&&Math.abs(m23-m32)<epsilon){// singularity found
// first check for identity matrix which must have +1 for all terms
// in leading diagonal and zero in other terms
if(Math.abs(m12+m21)<epsilon2&&Math.abs(m13+m31)<epsilon2&&Math.abs(m23+m32)<epsilon2&&Math.abs(m11+m22+m33-3)<epsilon2){// this singularity is identity matrix so angle = 0
this.set(1,0,0,0);return this;// zero angle, arbitrary axis
}// otherwise this singularity is angle = 180
angle=Math.PI;const xx=(m11+1)/2;const yy=(m22+1)/2;const zz=(m33+1)/2;const xy=(m12+m21)/4;const xz=(m13+m31)/4;const yz=(m23+m32)/4;if(xx>yy&&xx>zz){// m11 is the largest diagonal term
if(xx<epsilon){x=0;y=0.707106781;z=0.707106781;}else{x=Math.sqrt(xx);y=xy/x;z=xz/x;}}else if(yy>zz){// m22 is the largest diagonal term
if(yy<epsilon){x=0.707106781;y=0;z=0.707106781;}else{y=Math.sqrt(yy);x=xy/y;z=yz/y;}}else{// m33 is the largest diagonal term so base result on this
if(zz<epsilon){x=0.707106781;y=0.707106781;z=0;}else{z=Math.sqrt(zz);x=xz/z;y=yz/z;}}this.set(x,y,z,angle);return this;// return 180 deg rotation
}// as we have reached here there are no singularities so we can handle normally
let s=Math.sqrt((m32-m23)*(m32-m23)+(m13-m31)*(m13-m31)+(m21-m12)*(m21-m12));// used to normalize
if(Math.abs(s)<0.001)s=1;// prevent divide by zero, should not happen if matrix is orthogonal and should be
// caught by singularity test above, but I've left it in just in case
 In options, we can specify:
 * Texture parameters for an auto-generated target texture
 * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
//
// 	texture.anisotropy = 16;
//
 *
