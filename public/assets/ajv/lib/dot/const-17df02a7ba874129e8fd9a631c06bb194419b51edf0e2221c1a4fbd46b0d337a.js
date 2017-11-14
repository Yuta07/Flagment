(function() { this.JST || (this.JST = {}); this.JST["ajv/lib/dot/const"] = {{# def.definitions }}
  {{# def.errors }}
  {{# def.setupKeyword }}
  {{# def.$data }}
  
  {{? !$isData }}
    var schema{{=$lvl}} = validate.schema{{=$schemaPath}};
  {{?}}
  var {{=$valid}} = equal({{=$data}}, schema{{=$lvl}});
  {{# def.checkError:'const' }}
  {{? $breakOnError }} else { {{?}};
}).call(this);
