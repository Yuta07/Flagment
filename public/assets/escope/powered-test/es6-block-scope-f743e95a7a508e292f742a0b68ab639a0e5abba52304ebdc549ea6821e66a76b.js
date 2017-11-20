(function() {
  var escope, expect, harmony;

  expect = require('chai').expect;

  harmony = require('../third_party/esprima');

  escope = require('..');

  describe('ES6 block scope', function() {
    it('let is materialized in ES6 block scope#1', function() {
      var ast, scope, scopeManager;
      ast = harmony.parse("{\n    let i = 20;\n    i;\n}");
      scopeManager = escope.analyze(ast, {
        ecmaVersion: 6
      });
      expect(scopeManager.scopes).to.have.length(2);
      scope = scopeManager.scopes[0];
      expect(scope.type).to.be.equal('global');
      expect(scope.variables).to.have.length(0);
      scope = scopeManager.scopes[1];
      expect(scope.type).to.be.equal('block');
      expect(scope.variables).to.have.length(1);
      expect(scope.variables[0].name).to.be.equal('i');
      expect(scope.references).to.have.length(2);
      expect(scope.references[0].identifier.name).to.be.equal('i');
      return expect(scope.references[1].identifier.name).to.be.equal('i');
    });
    it('let is materialized in ES6 block scope#2', function() {
      var ast, scope, scopeManager;
      ast = harmony.parse("{\n    let i = 20;\n    var i = 20;\n    i;\n}");
      scopeManager = escope.analyze(ast, {
        ecmaVersion: 6
      });
      expect(scopeManager.scopes).to.have.length(2);
      scope = scopeManager.scopes[0];
      expect(scope.type).to.be.equal('global');
      expect(scope.variables).to.have.length(1);
      expect(scope.variables[0].name).to.be.equal('i');
      scope = scopeManager.scopes[1];
      expect(scope.type).to.be.equal('block');
      expect(scope.variables).to.have.length(1);
      expect(scope.variables[0].name).to.be.equal('i');
      expect(scope.references).to.have.length(3);
      expect(scope.references[0].identifier.name).to.be.equal('i');
      expect(scope.references[1].identifier.name).to.be.equal('i');
      return expect(scope.references[2].identifier.name).to.be.equal('i');
    });
    it('function delaration is materialized in ES6 block scope', function() {
      var ast, scope, scopeManager;
      ast = harmony.parse("{\n    function test() {\n    }\n    test();\n}");
      scopeManager = escope.analyze(ast, {
        ecmaVersion: 6
      });
      expect(scopeManager.scopes).to.have.length(3);
      scope = scopeManager.scopes[0];
      expect(scope.type).to.be.equal('global');
      expect(scope.variables).to.have.length(0);
      scope = scopeManager.scopes[1];
      expect(scope.type).to.be.equal('block');
      expect(scope.variables).to.have.length(1);
      expect(scope.variables[0].name).to.be.equal('test');
      expect(scope.references).to.have.length(1);
      expect(scope.references[0].identifier.name).to.be.equal('test');
      scope = scopeManager.scopes[2];
      expect(scope.type).to.be.equal('function');
      expect(scope.variables).to.have.length(1);
      expect(scope.variables[0].name).to.be.equal('arguments');
      return expect(scope.references).to.have.length(0);
    });
    it('let is not hoistable#1', function() {
      var ast, globalScope, scope, scopeManager;
      ast = harmony.parse("var i = 42; (1)\n{\n    i;  // (2) ReferenceError at runtime.\n    let i = 20;  // (2)\n    i;  // (2)\n}");
      scopeManager = escope.analyze(ast, {
        ecmaVersion: 6
      });
      expect(scopeManager.scopes).to.have.length(2);
      globalScope = scopeManager.scopes[0];
      expect(globalScope.type).to.be.equal('global');
      expect(globalScope.variables).to.have.length(1);
      expect(globalScope.variables[0].name).to.be.equal('i');
      expect(globalScope.references).to.have.length(1);
      scope = scopeManager.scopes[1];
      expect(scope.type).to.be.equal('block');
      expect(scope.variables).to.have.length(1);
      expect(scope.variables[0].name).to.be.equal('i');
      expect(scope.references).to.have.length(3);
      expect(scope.references[0].resolved).to.be.equal(scope.variables[0]);
      expect(scope.references[1].resolved).to.be.equal(scope.variables[0]);
      return expect(scope.references[2].resolved).to.be.equal(scope.variables[0]);
    });
    return it('let is not hoistable#2', function() {
      var ast, globalScope, scope, scopeManager, v1, v2, v3;
      ast = harmony.parse("(function () {\n    var i = 42; // (1)\n    i;  // (1)\n    {\n        i;  // (3)\n        {\n            i;  // (2)\n            let i = 20;  // (2)\n            i;  // (2)\n        }\n        let i = 30;  // (3)\n        i;  // (3)\n    }\n    i;  // (1)\n}());");
      scopeManager = escope.analyze(ast, {
        ecmaVersion: 6
      });
      expect(scopeManager.scopes).to.have.length(4);
      globalScope = scopeManager.scopes[0];
      expect(globalScope.type).to.be.equal('global');
      expect(globalScope.variables).to.have.length(0);
      expect(globalScope.references).to.have.length(0);
      scope = scopeManager.scopes[1];
      expect(scope.type).to.be.equal('function');
      expect(scope.variables).to.have.length(2);
      expect(scope.variables[0].name).to.be.equal('arguments');
      expect(scope.variables[1].name).to.be.equal('i');
      v1 = scope.variables[1];
      expect(scope.references).to.have.length(3);
      expect(scope.references[0].resolved).to.be.equal(v1);
      expect(scope.references[1].resolved).to.be.equal(v1);
      expect(scope.references[2].resolved).to.be.equal(v1);
      scope = scopeManager.scopes[2];
      expect(scope.type).to.be.equal('block');
      expect(scope.variables).to.have.length(1);
      expect(scope.variables[0].name).to.be.equal('i');
      v3 = scope.variables[0];
      expect(scope.references).to.have.length(3);
      expect(scope.references[0].resolved).to.be.equal(v3);
      expect(scope.references[1].resolved).to.be.equal(v3);
      expect(scope.references[2].resolved).to.be.equal(v3);
      scope = scopeManager.scopes[3];
      expect(scope.type).to.be.equal('block');
      expect(scope.variables).to.have.length(1);
      expect(scope.variables[0].name).to.be.equal('i');
      v2 = scope.variables[0];
      expect(scope.references).to.have.length(3);
      expect(scope.references[0].resolved).to.be.equal(v2);
      expect(scope.references[1].resolved).to.be.equal(v2);
      return expect(scope.references[2].resolved).to.be.equal(v2);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi1ibG9jay1zY29wZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdUJBO0FBQUEsTUFBQSx1QkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVMsTUFBVCxDQUFlLENBQUMsTUFBekIsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVMsd0JBQVQsQ0FEVixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUyxJQUFULENBRlQsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBVSxpQkFBVixFQUE0QixTQUFBLEdBQUE7QUFDeEIsSUFBQSxFQUFBLENBQUksMENBQUosRUFBK0MsU0FBQSxHQUFBO0FBQzNDLFVBQUEsd0JBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsS0FBUixDQUFpQiwrQkFBakIsQ0FBTixDQUFBO0FBQUEsTUFPQSxZQUFBLEdBQWUsTUFBTSxDQUFDLE9BQVAsQ0FBZSxHQUFmLEVBQW9CO0FBQUEsUUFBQSxXQUFBLEVBQWEsQ0FBYjtPQUFwQixDQVBmLENBQUE7QUFBQSxNQVFBLE1BQUEsQ0FBTyxZQUFZLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQXBDLENBQTJDLENBQTNDLENBUkEsQ0FBQTtBQUFBLE1BVUEsS0FBQSxHQUFRLFlBQVksQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQVY1QixDQUFBO0FBQUEsTUFXQSxNQUFBLENBQU8sS0FBSyxDQUFDLElBQWIsQ0FBa0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQXpCLENBQWdDLFFBQWhDLENBWEEsQ0FBQTtBQUFBLE1BWUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxTQUFiLENBQXVCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFoQyxDQUF1QyxDQUF2QyxDQVpBLENBQUE7QUFBQSxNQWNBLEtBQUEsR0FBUSxZQUFZLENBQUMsTUFBTyxDQUFBLENBQUEsQ0FkNUIsQ0FBQTtBQUFBLE1B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O0VBQUEsQ0FBNUIsQ0FKQSxDQUFBO0FBQUEiLCJmaWxlIjoiZXM2LWJsb2NrLXNjb3BlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyAtKi0gY29kaW5nOiB1dGYtOCAtKi1cbiMgIENvcHlyaWdodCAoQykgMjAxNCBZdXN1a2UgU3V6dWtpIDx1dGF0YW5lLnRlYUBnbWFpbC5jb20+XG4jXG4jICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiMgIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuI1xuIyAgICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4jICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuIyAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4jICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuIyAgICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4jXG4jICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuIyAgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuIyAgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiMgIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCA8Q09QWVJJR0hUIEhPTERFUj4gQkUgTElBQkxFIEZPUiBBTllcbiMgIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4jICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4jICBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkRcbiMgIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4jICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0ZcbiMgIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG5cbmV4cGVjdCA9IHJlcXVpcmUoJ2NoYWknKS5leHBlY3Rcbmhhcm1vbnkgPSByZXF1aXJlICcuLi90aGlyZF9wYXJ0eS9lc3ByaW1hJ1xuZXNjb3BlID0gcmVxdWlyZSAnLi4nXG5cbmRlc2NyaWJlICdFUzYgYmxvY2sgc2NvcGUnLCAtPlxuICAgIGl0ICdsZXQgaXMgbWF0ZXJpYWxpemVkIGluIEVTNiBibG9jayBzY29wZSMxJywgLT5cbiAgICAgICAgYXN0ID0gaGFybW9ueS5wYXJzZSBcIlwiXCJcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IGkgPSAyMDtcbiAgICAgICAgICAgIGk7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiXG5cbiAgICAgICAgc2NvcGVNYW5hZ2VyID0gZXNjb3BlLmFuYWx5emUgYXN0LCBlY21hVmVyc2lvbjogNlxuICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGggMiAgIyBQcm9ncmFtIGFuZCBCbGNva1N0YXRlbWVudCBzY29wZS5cblxuICAgICAgICBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMF1cbiAgICAgICAgZXhwZWN0KHNjb3BlLnR5cGUpLnRvLmJlLmVxdWFsICdnbG9iYWwnXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoIDAgICMgTm8gdmFyaWFibGUgaW4gUHJvZ3JhbSBzY29wZS5cblxuICAgICAgICBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMV1cbiAgICAgICAgZXhwZWN0KHNjb3BlLnR5cGUpLnRvLmJlLmVxdWFsICdibG9jaydcbiAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGggMSAgIyBgaWAgaW4gYmxvY2sgc2NvcGUuXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXNbMF0ubmFtZSkudG8uYmUuZXF1YWwgJ2knXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCAyXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzWzBdLmlkZW50aWZpZXIubmFtZSkudG8uYmUuZXF1YWwoJ2knKVxuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlc1sxXS5pZGVudGlmaWVyLm5hbWUpLnRvLmJlLmVxdWFsKCdpJylcblxuICAgIGl0ICdsZXQgaXMgbWF0ZXJpYWxpemVkIGluIEVTNiBibG9jayBzY29wZSMyJywgLT5cbiAgICAgICAgYXN0ID0gaGFybW9ueS5wYXJzZSBcIlwiXCJcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IGkgPSAyMDtcbiAgICAgICAgICAgIHZhciBpID0gMjA7XG4gICAgICAgICAgICBpO1xuICAgICAgICB9XG4gICAgICAgIFwiXCJcIlxuXG4gICAgICAgIHNjb3BlTWFuYWdlciA9IGVzY29wZS5hbmFseXplIGFzdCwgZWNtYVZlcnNpb246IDZcbiAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoIDIgICMgUHJvZ3JhbSBhbmQgQmxjb2tTdGF0ZW1lbnQgc2NvcGUuXG5cbiAgICAgICAgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzBdXG4gICAgICAgIGV4cGVjdChzY29wZS50eXBlKS50by5iZS5lcXVhbCAnZ2xvYmFsJ1xuICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCAxICAjIE5vIHZhcmlhYmxlIGluIFByb2dyYW0gc2NvcGUuXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXNbMF0ubmFtZSkudG8uYmUuZXF1YWwgJ2knXG5cbiAgICAgICAgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzFdXG4gICAgICAgIGV4cGVjdChzY29wZS50eXBlKS50by5iZS5lcXVhbCAnYmxvY2snXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoIDEgICMgYGlgIGluIGJsb2NrIHNjb3BlLlxuICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzWzBdLm5hbWUpLnRvLmJlLmVxdWFsICdpJ1xuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlcykudG8uaGF2ZS5sZW5ndGggM1xuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlc1swXS5pZGVudGlmaWVyLm5hbWUpLnRvLmJlLmVxdWFsKCdpJylcbiAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXNbMV0uaWRlbnRpZmllci5uYW1lKS50by5iZS5lcXVhbCgnaScpXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzWzJdLmlkZW50aWZpZXIubmFtZSkudG8uYmUuZXF1YWwoJ2knKVxuXG4gICAgaXQgJ2Z1bmN0aW9uIGRlbGFyYXRpb24gaXMgbWF0ZXJpYWxpemVkIGluIEVTNiBibG9jayBzY29wZScsIC0+XG4gICAgICAgIGFzdCA9IGhhcm1vbnkucGFyc2UgXCJcIlwiXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgXCJcIlwiXG5cbiAgICAgICAgc2NvcGVNYW5hZ2VyID0gZXNjb3BlLmFuYWx5emUgYXN0LCBlY21hVmVyc2lvbjogNlxuICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGggM1xuXG4gICAgICAgIHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1swXVxuICAgICAgICBleHBlY3Qoc2NvcGUudHlwZSkudG8uYmUuZXF1YWwgJ2dsb2JhbCdcbiAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGggMFxuXG4gICAgICAgIHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1sxXVxuICAgICAgICBleHBlY3Qoc2NvcGUudHlwZSkudG8uYmUuZXF1YWwgJ2Jsb2NrJ1xuICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXNbMF0ubmFtZSkudG8uYmUuZXF1YWwgJ3Rlc3QnXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzWzBdLmlkZW50aWZpZXIubmFtZSkudG8uYmUuZXF1YWwoJ3Rlc3QnKVxuXG4gICAgICAgIHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1syXVxuICAgICAgICBleHBlY3Qoc2NvcGUudHlwZSkudG8uYmUuZXF1YWwgJ2Z1bmN0aW9uJ1xuICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXNbMF0ubmFtZSkudG8uYmUuZXF1YWwgJ2FyZ3VtZW50cydcbiAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoIDBcblxuICAgIGl0ICdsZXQgaXMgbm90IGhvaXN0YWJsZSMxJywgLT5cbiAgICAgICAgYXN0ID0gaGFybW9ueS5wYXJzZSBcIlwiXCJcbiAgICAgICAgdmFyIGkgPSA0MjsgKDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGk7ICAvLyAoMikgUmVmZXJlbmNlRXJyb3IgYXQgcnVudGltZS5cbiAgICAgICAgICAgIGxldCBpID0gMjA7ICAvLyAoMilcbiAgICAgICAgICAgIGk7ICAvLyAoMilcbiAgICAgICAgfVxuICAgICAgICBcIlwiXCJcblxuICAgICAgICBzY29wZU1hbmFnZXIgPSBlc2NvcGUuYW5hbHl6ZSBhc3QsIGVjbWFWZXJzaW9uOiA2XG4gICAgICAgIGV4cGVjdChzY29wZU1hbmFnZXIuc2NvcGVzKS50by5oYXZlLmxlbmd0aCAyXG5cbiAgICAgICAgZ2xvYmFsU2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzBdXG4gICAgICAgIGV4cGVjdChnbG9iYWxTY29wZS50eXBlKS50by5iZS5lcXVhbCAnZ2xvYmFsJ1xuICAgICAgICBleHBlY3QoZ2xvYmFsU2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChnbG9iYWxTY29wZS52YXJpYWJsZXNbMF0ubmFtZSkudG8uYmUuZXF1YWwgJ2knXG4gICAgICAgIGV4cGVjdChnbG9iYWxTY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCAxXG5cbiAgICAgICAgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzFdXG4gICAgICAgIGV4cGVjdChzY29wZS50eXBlKS50by5iZS5lcXVhbCAnYmxvY2snXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoIDFcbiAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlc1swXS5uYW1lKS50by5iZS5lcXVhbCAnaSdcbiAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoIDNcbiAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXNbMF0ucmVzb2x2ZWQpLnRvLmJlLmVxdWFsIHNjb3BlLnZhcmlhYmxlc1swXVxuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlc1sxXS5yZXNvbHZlZCkudG8uYmUuZXF1YWwgc2NvcGUudmFyaWFibGVzWzBdXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzWzJdLnJlc29sdmVkKS50by5iZS5lcXVhbCBzY29wZS52YXJpYWJsZXNbMF1cblxuICAgIGl0ICdsZXQgaXMgbm90IGhvaXN0YWJsZSMyJywgLT5cbiAgICAgICAgYXN0ID0gaGFybW9ueS5wYXJzZSBcIlwiXCJcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpID0gNDI7IC8vICgxKVxuICAgICAgICAgICAgaTsgIC8vICgxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGk7ICAvLyAoMylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGk7ICAvLyAoMilcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAyMDsgIC8vICgyKVxuICAgICAgICAgICAgICAgICAgICBpOyAgLy8gKDIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBpID0gMzA7ICAvLyAoMylcbiAgICAgICAgICAgICAgICBpOyAgLy8gKDMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpOyAgLy8gKDEpXG4gICAgICAgIH0oKSk7XG4gICAgICAgIFwiXCJcIlxuXG4gICAgICAgIHNjb3BlTWFuYWdlciA9IGVzY29wZS5hbmFseXplIGFzdCwgZWNtYVZlcnNpb246IDZcbiAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoIDRcblxuICAgICAgICBnbG9iYWxTY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMF1cbiAgICAgICAgZXhwZWN0KGdsb2JhbFNjb3BlLnR5cGUpLnRvLmJlLmVxdWFsICdnbG9iYWwnXG4gICAgICAgIGV4cGVjdChnbG9iYWxTY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoIDBcbiAgICAgICAgZXhwZWN0KGdsb2JhbFNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoIDBcblxuICAgICAgICBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMV1cbiAgICAgICAgZXhwZWN0KHNjb3BlLnR5cGUpLnRvLmJlLmVxdWFsICdmdW5jdGlvbidcbiAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGggMlxuICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzWzBdLm5hbWUpLnRvLmJlLmVxdWFsICdhcmd1bWVudHMnXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXNbMV0ubmFtZSkudG8uYmUuZXF1YWwgJ2knXG4gICAgICAgIHYxID0gc2NvcGUudmFyaWFibGVzWzFdXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCAzXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzWzBdLnJlc29sdmVkKS50by5iZS5lcXVhbCB2MVxuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlc1sxXS5yZXNvbHZlZCkudG8uYmUuZXF1YWwgdjFcbiAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXNbMl0ucmVzb2x2ZWQpLnRvLmJlLmVxdWFsIHYxXG5cbiAgICAgICAgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzJdXG4gICAgICAgIGV4cGVjdChzY29wZS50eXBlKS50by5iZS5lcXVhbCAnYmxvY2snXG4gICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoIDFcbiAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlc1swXS5uYW1lKS50by5iZS5lcXVhbCAnaSdcbiAgICAgICAgdjMgPSBzY29wZS52YXJpYWJsZXNbMF1cbiAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoIDNcbiAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXNbMF0ucmVzb2x2ZWQpLnRvLmJlLmVxdWFsIHYzXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzWzFdLnJlc29sdmVkKS50by5iZS5lcXVhbCB2M1xuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlc1syXS5yZXNvbHZlZCkudG8uYmUuZXF1YWwgdjNcblxuICAgICAgICBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbM11cbiAgICAgICAgZXhwZWN0KHNjb3BlLnR5cGUpLnRvLmJlLmVxdWFsICdibG9jaydcbiAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGggMVxuICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzWzBdLm5hbWUpLnRvLmJlLmVxdWFsICdpJ1xuICAgICAgICB2MiA9IHNjb3BlLnZhcmlhYmxlc1swXVxuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlcykudG8uaGF2ZS5sZW5ndGggM1xuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlc1swXS5yZXNvbHZlZCkudG8uYmUuZXF1YWwgdjJcbiAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXNbMV0ucmVzb2x2ZWQpLnRvLmJlLmVxdWFsIHYyXG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzWzJdLnJlc29sdmVkKS50by5iZS5lcXVhbCB2MlxuXG4jIHZpbTogc2V0IHN3PTQgdHM9NCBldCB0dz04MCA6XG4iXX0=
;