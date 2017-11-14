(function() { this.JST || (this.JST = {}); this.JST["ajv/lib/dot/multipleOf"] = {{# def.definitions }}
  {{# def.errors }}
  {{# def.setupKeyword }}
  {{# def.$data }}
  
  var division{{=$lvl}};
  if ({{?$isData}}
        {{=$schemaValue}} !== undefined && (
        typeof {{=$schemaValue}} != 'number' ||
      {{?}}
        (division{{=$lvl}} = {{=$data}} / {{=$schemaValue}},
        {{? it.opts.multipleOfPrecision }}
          Math.abs(Math.round(division{{=$lvl}}) - division{{=$lvl}}) > 1e-{{=it.opts.multipleOfPrecision}}
        {{??}}
          division{{=$lvl}} !== parseInt(division{{=$lvl}})
        {{?}}
        )
      {{?$isData}}  )  {{?}} ) {
    {{# def.error:'multipleOf' }}
  } {{? $breakOnError }} else { {{?}};
}).call(this);
