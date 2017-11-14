(function() { this.JST || (this.JST = {}); this.JST["ajv/lib/dot/_limitProperties"] = {{# def.definitions }}
  {{# def.errors }}
  {{# def.setupKeyword }}
  {{# def.$data }}
  
  {{ var $op = $keyword == 'maxProperties' ? '>' : '<'; }}
  if ({{# def.$dataNotType:'number' }} Object.keys({{=$data}}).length {{=$op}} {{=$schemaValue}}) {
    {{ var $errorKeyword = $keyword; }}
    {{# def.error:'_limitProperties' }}
  } {{? $breakOnError }} else { {{?}};
}).call(this);
