(function() {
  var Cmd, Color, PATH, Q, UTIL,
    slice = [].slice;

  UTIL = require('util');

  PATH = require('path');

  Color = require('./color').Color;

  Q = require('q');


  /**
  Command
  
  Top level entity. Commands may have options and arguments.
  @namespace
  @class Presents command
   */

  exports.Cmd = Cmd = (function() {

    /**
    @constructs
    @param {COA.Cmd} [cmd] parent command
     */
    function Cmd(cmd) {
      if (!(this instanceof Cmd)) {
        return new Cmd(cmd);
      }
      this._parent(cmd);
      this._cmds = [];
      this._cmdsByName = {};
      this._opts = [];
      this._optsByKey = {};
      this._args = [];
      this._ext = false;
    }

    Cmd.get = function(propertyName, func) {
      return Object.defineProperty(this.prototype, propertyName, {
        configurable: true,
        enumerable: true,
        get: func
      });
    };


    /**
    Returns object containing all its subcommands as methods
    to use from other programs.
    @returns {Object}
     */

    Cmd.get('api', function() {
      var c, fn1;
      if (!this._api) {
        this._api = (function(_this) {
          return function() {
            return _this.invoke.apply(_this, arguments);
          };
        })(this);
      }
      fn1 = (function(_this) {
        return function(c) {
          return _this._api[c] = _this._cmdsByName[c].api;
        };
      })(this);
      for (c in this._cmdsByName) {
        fn1(c);
      }
      return this._api;
    });

    Cmd.prototype._parent = function(cmd) {
      this._cmd = cmd || this;
      if (cmd) {
        cmd._cmds.push(this);
        if (this._name) {
          this._cmd._cmdsByName[this._name] = this;
        }
      }
      return this;
    };


    /**
    Set a canonical command identifier to be used anywhere in the API.
    @param {String} _name command name
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.name = function(_name1) {
      this._name = _name1;
      if (this._cmd !== this) {
        this._cmd._cmdsByName[_name] = this;
      }
      return this;
    };


    /**
    Set a long description for command to be used anywhere in text messages.
    @param {String} _title command title
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.title = function(_title) {
      this._title = _title;
      return this;
    };


    /**
    Create new or add existing subcommand for current command.
    @param {COA.Cmd} [cmd] existing command instance
    @returns {COA.Cmd} new subcommand instance
     */

    Cmd.prototype.cmd = function(cmd) {
      if (cmd) {
        return cmd._parent(this);
      } else {
        return new Cmd(this);
      }
    };


    /**
    Create option for current command.
    @returns {COA.Opt} new option instance
     */

    Cmd.prototype.opt = function() {
      return new (require('./opt').Opt)(this);
    };


    /**
    Create argument for current command.
    @returns {COA.Opt} new argument instance
     */

    Cmd.prototype.arg = function() {
      return new (require('./arg').Arg)(this);
    };


    /**
    Add (or set) action for current command.
    @param {Function} act action function,
        invoked in the context of command instance
        and has the parameters:
            - {Object} opts parsed options
            - {Array} args parsed arguments
            - {Object} res actions result accumulator
        It can return rejected promise by Cmd.reject (in case of error)
        or any other value treated as result.
    @param {Boolean} [force=false] flag for set action instead add to existings
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.act = function(act, force) {
      if (!act) {
        return this;
      }
      if (!force && this._act) {
        this._act.push(act);
      } else {
        this._act = [act];
      }
      return this;
    };


    /**
    Set custom additional completion for current command.
    @param {Function} completion generation function,
        invoked in the context of command instance.
        Accepts parameters:
            - {Object} opts completion options
        It can return promise or any other value treated as result.
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.comp = function(_comp) {
      this._comp = _comp;
      return this;
    };


    /**
    Apply function with arguments in context of command instance.
    @param {Function} fn
    @param {Array} args
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.apply = function() {
      var args, fn;
      fn = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      fn.apply(this, args);
      return this;
    };


    /**
    Make command "helpful", i.e. add -h --help flags for print usage.
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.helpful = function() {
      return this.opt().name('help').title('Help').short('h').long('help').flag().only().act(function() {
        return this.usage();
      }).end();
    };


    /**
    Adds shell completion to command, adds "completion" subcommand,
    that makes all the magic.
    Must be called only on root command.
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.completable = function() {
      return this.cmd().name('completion').apply(require('./completion')).end();
    };


    /**
    Allow command to be extendable by external node.js modules.
    @param {String} [pattern]  Pattern of node.js module to find subcommands at.
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.extendable = function(pattern) {
      this._ext = pattern || true;
      return this;
    };

    Cmd.prototype._exit = function(msg, code) {
      return process.once('exit', function() {
        if (msg) {
          console.error(msg);
        }
        return process.exit(code || 0);
      });
    };


    /**
    Build full usage text for current command instance.
    @returns {String} usage text
     */

    Cmd.prototype.usage = function() {
      var res;
      res = [];
      if (this._title) {
        res.push(this._fullTitle());
      }
      res.push('', 'Usage:');
      if (this._cmds.length) {
        res.push(['', '', Color('lred', this._fullName()), Color('lblue', 'COMMAND'), Color('lgreen', '[OPTIONS]'), Color('lpurple', '[ARGS]')].join(' '));
      }
      if (this._opts.length + this._args.length) {
        res.push(['', '', Color('lred', this._fullName()), Color('lgreen', '[OPTIONS]'), Color('lpurple', '[ARGS]')].join(' '));
      }
      res.push(this._usages(this._cmds, 'Commands'), this._usages(this._opts, 'Options'), this._usages(this._args, 'Arguments'));
      return res.join('\n');
    };

    Cmd.prototype._usage = function() {
      return Color('lblue', this._name) + ' : ' + this._title;
    };

    Cmd.prototype._usages = function(os, title) {
      var j, len, o, res;
      if (!os.length) {
        return;
      }
      res = ['', title + ':'];
      for (j = 0, len = os.length; j < len; j++) {
        o = os[j];
        res.push('  ' + o._usage());
      }
      return res.join('\n');
    };

    Cmd.prototype._fullTitle = function() {
      return (this._cmd === this ? '' : this._cmd._fullTitle() + '\n') + this._title;
    };

    Cmd.prototype._fullName = function() {
      return (this._cmd === this ? '' : this._cmd._fullName() + ' ') + PATH.basename(this._name);
    };

    Cmd.prototype._ejectOpt = function(opts, opt) {
      var pos;
      if ((pos = opts.indexOf(opt)) >= 0) {
        if (opts[pos]._arr) {
          return opts[pos];
        } else {
          return opts.splice(pos, 1)[0];
        }
      }
    };

    Cmd.prototype._checkRequired = function(opts, args) {
      var all, i;
      if (!(this._opts.filter(function(o) {
        return o._only && o._name in opts;
      })).length) {
        all = this._opts.concat(this._args);
        while (i = all.shift()) {
          if (i._req && i._checkParsed(opts, args)) {
            return this.reject(i._requiredText());
          }
        }
      }
    };

    Cmd.prototype._parseCmd = function(argv, unparsed) {
      var c, cmd, cmdDesc, e, i, optSeen, pkg;
      if (unparsed == null) {
        unparsed = [];
      }
      argv = argv.concat();
      optSeen = false;
      while (i = argv.shift()) {
        if (!i.indexOf('-')) {
          optSeen = true;
        }
        if (!optSeen && /^\w[\w-_]*$/.test(i)) {
          cmd = this._cmdsByName[i];
          if (!cmd && this._ext) {
            if (typeof this._ext === 'string') {
              if (~this._ext.indexOf('%s')) {
                pkg = UTIL.format(this._ext, i);
              } else {
                pkg = this._ext + i;
              }
            } else if (this._ext === true) {
              pkg = i;
              c = this;
              while (true) {
                pkg = c._name + '-' + pkg;
                if (c._cmd === c) {
                  break;
                }
                c = c._cmd;
              }
            }
            try {
              cmdDesc = require(pkg);
            } catch (error) {
              e = error;
            }
            if (cmdDesc) {
              if (typeof cmdDesc === 'function') {
                this.cmd().name(i).apply(cmdDesc).end();
              } else if (typeof cmdDesc === 'object') {
                this.cmd(cmdDesc);
                cmdDesc.name(i);
              } else {
                throw new Error('Error: Unsupported command declaration type, ' + 'should be function or COA.Cmd() object');
              }
              cmd = this._cmdsByName[i];
            }
          }
          if (cmd) {
            return cmd._parseCmd(argv, unparsed);
          }
        }
        unparsed.push(i);
      }
      return {
        cmd: this,
        argv: unparsed
      };
    };

    Cmd.prototype._parseOptsAndArgs = function(argv) {
      var a, arg, args, i, m, nonParsedArgs, nonParsedOpts, opt, opts, res;
      opts = {};
      args = {};
      nonParsedOpts = this._opts.concat();
      nonParsedArgs = this._args.concat();
      while (i = argv.shift()) {
        if (i !== '--' && !i.indexOf('-')) {
          if (m = i.match(/^(--\w[\w-_]*)=(.*)$/)) {
            i = m[1];
            if (!this._optsByKey[i]._flag) {
              argv.unshift(m[2]);
            }
          }
          if (opt = this._ejectOpt(nonParsedOpts, this._optsByKey[i])) {
            if (Q.isRejected(res = opt._parse(argv, opts))) {
              return res;
            }
          } else {
            return this.reject("Unknown option: " + i);
          }
        } else {
          if (i === '--') {
            i = argv.splice(0);
          }
          i = Array.isArray(i) ? i : [i];
          while (a = i.shift()) {
            if (arg = nonParsedArgs.shift()) {
              if (arg._arr) {
                nonParsedArgs.unshift(arg);
              }
              if (Q.isRejected(res = arg._parse(a, args))) {
                return res;
              }
            } else {
              return this.reject("Unknown argument: " + a);
            }
          }
        }
      }
      return {
        opts: this._setDefaults(opts, nonParsedOpts),
        args: this._setDefaults(args, nonParsedArgs)
      };
    };

    Cmd.prototype._setDefaults = function(params, desc) {
      var i, j, len;
      for (j = 0, len = desc.length; j < len; j++) {
        i = desc[j];
        if (!(i._name in params) && '_def' in i) {
          i._saveVal(params, i._def);
        }
      }
      return params;
    };

    Cmd.prototype._processParams = function(params, desc) {
      var i, j, k, len, len1, n, notExists, res, v, vals;
      notExists = [];
      for (j = 0, len = desc.length; j < len; j++) {
        i = desc[j];
        n = i._name;
        if (!(n in params)) {
          notExists.push(i);
          continue;
        }
        vals = params[n];
        delete params[n];
        if (!Array.isArray(vals)) {
          vals = [vals];
        }
        for (k = 0, len1 = vals.length; k < len1; k++) {
          v = vals[k];
          if (Q.isRejected(res = i._saveVal(params, v))) {
            return res;
          }
        }
      }
      return this._setDefaults(params, notExists);
    };

    Cmd.prototype._parseArr = function(argv) {
      return Q.when(this._parseCmd(argv), function(p) {
        return Q.when(p.cmd._parseOptsAndArgs(p.argv), function(r) {
          return {
            cmd: p.cmd,
            opts: r.opts,
            args: r.args
          };
        });
      });
    };

    Cmd.prototype._do = function(input) {
      return Q.when(input, (function(_this) {
        return function(input) {
          var cmd;
          cmd = input.cmd;
          return [_this._checkRequired].concat(cmd._act || []).reduce(function(res, act) {
            return Q.when(res, function(res) {
              return act.call(cmd, input.opts, input.args, res);
            });
          }, void 0);
        };
      })(this));
    };


    /**
    Parse arguments from simple format like NodeJS process.argv
    and run ahead current program, i.e. call process.exit when all actions done.
    @param {Array} argv
    @returns {COA.Cmd} this instance (for chainability)
     */

    Cmd.prototype.run = function(argv) {
      var cb;
      if (argv == null) {
        argv = process.argv.slice(2);
      }
      cb = (function(_this) {
        return function(code) {
          return function(res) {
            var ref, ref1;
            if (res) {
              return _this._exit((ref = res.stack) != null ? ref : res.toString(), (ref1 = res.exitCode) != null ? ref1 : code);
            } else {
              return _this._exit();
            }
          };
        };
      })(this);
      Q.when(this["do"](argv), cb(0), cb(1)).done();
      return this;
    };


    /**
    Convenient function to run command from tests.
    @param {Array} argv
    @returns {Q.Promise}
     */

    Cmd.prototype["do"] = function(argv) {
      return this._do(this._parseArr(argv || []));
    };


    /**
    Invoke specified (or current) command using provided
    options and arguments.
    @param {String|Array} cmds  subcommand to invoke (optional)
    @param {Object} opts  command options (optional)
    @param {Object} args  command arguments (optional)
    @returns {Q.Promise}
     */

    Cmd.prototype.invoke = function(cmds, opts, args) {
      if (cmds == null) {
        cmds = [];
      }
      if (opts == null) {
        opts = {};
      }
      if (args == null) {
        args = {};
      }
      if (typeof cmds === 'string') {
        cmds = cmds.split(' ');
      }
      if (arguments.length < 3) {
        if (!Array.isArray(cmds)) {
          args = opts;
          opts = cmds;
          cmds = [];
        }
      }
      return Q.when(this._parseCmd(cmds), (function(_this) {
        return function(p) {
          if (p.argv.length) {
            return _this.reject("Unknown command: " + cmds.join(' '));
          }
          return Q.all([_this._processParams(opts, _this._opts), _this._processParams(args, _this._args)]).spread(function(opts, args) {
            return _this._do({
              cmd: p.cmd,
              opts: opts,
              args: args
            }).fail(function(res) {
              if (res && res.exitCode === 0) {
                return res.toString();
              } else {
                return _this.reject(res);
              }
            });
          });
        };
      })(this));
    };


    /**
    Return reject of actions results promise with error code.
    Use in .act() for return with error.
    @param {Object} reject reason
        You can customize toString() method and exitCode property
        of reason object.
    @returns {Q.promise} rejected promise
     */

    Cmd.prototype.reject = function(reason) {
      return Q.reject(reason);
    };


    /**
    Finish chain for current subcommand and return parent command instance.
    @returns {COA.Cmd} parent command
     */

    Cmd.prototype.end = function() {
      return this._cmd;
    };

    return Cmd;

  })();

}).call(this);