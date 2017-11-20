(function() { this.JST || (this.JST = {}); this.JST["ajv/lib/dot/validate"] = {{# def.definitions }}
  {{# def.errors }}
  {{# def.defaults }}
  {{# def.coerce }}
  
  {{ /**
      * schema compilation (render) time:
      * it = { schema, RULES, _validate, opts }
      * it.validate - this template function,
      *   it is used recursively to generate code for subschemas
      *
      * runtime:
      * "validate" is a variable name to which this function will be assigned
      * validateRef etc. are defined in the parent scope in index.js
      */ }}
  
  {{
    var $async = it.schema.$async === true
      , $refKeywords = it.util.schemaHasRulesExcept(it.schema, it.RULES.all, '$ref')
      , $id = it.self._getId(it.schema);
  }}
  
  {{? it.isTop }}
    {{? $async }}
      {{
        it.async = true;
        var $es7 = it.opts.async == 'es7';
        it.yieldAwait = $es7 ? 'await' : 'yield';
      }}
    {{?}}
  
    var validate =
      {{? $async }}
        {{? $es7 }}
          (async function
        {{??}}
          {{? it.opts.async != '*'}}co.wrap{{?}}(function*
        {{?}}
      {{??}}
        (function
      {{?}}
          (data, dataPath, parentData, parentDataProperty, rootData) {
            'use strict';
            {{? $id && (it.opts.sourceCode || it.opts.processCode) }}
              {{= '/\*# sourceURL=' + $id + ' */' }}
            {{?}}
  {{?}}
  
  {{? typeof it.schema == 'boolean' || !($refKeywords || it.schema.$ref) }}
    {{ var $keyword = 'false schema'; }}
    {{# def.setupKeyword }}
    {{? it.schema === false}}
      {{? it.isTop}}
        {{ $breakOnError = true; }}
      {{??}}
        var {{=$valid}} = false;
      {{?}}
      {{# def.error:'false schema' }}
    {{??}}
      {{? it.isTop}}
        {{? $async }}
          return data;
        {{??}}
          validate.errors = null;
          return true;
        {{?}}
      {{??}}
        var {{=$valid}} = true;
      {{?}}
    {{?}}
  
    {{? it.isTop}}
      });
      return validate;
    {{?}}
  
    {{ return out; }}
  {{?}}
  
  
  {{? it.isTop }}
    {{
      var $top = it.isTop
        , $lvl = it.level = 0
        , $dataLvl = it.dataLevel = 0
        , $data = 'data';
      it.rootId = it.resolve.fullPath(it.self._getId(it.root.schema));
      it.baseId = it.baseId || it.rootId;
      delete it.isTop;
  
      it.dataPathArr = [undefined];
    }}
  
    var vErrors = null; {{ /* don't edit, used in replace */ }}
    var errors = 0;     {{ /* don't edit, used in replace */ }}
    if (rootData === undefined) rootData = data; {{ /* don't edit, used in replace */ }}
  {{??}}
    {{
      var $lvl = it.level
        , $dataLvl = it.dataLevel
        , $data = 'data' + ($dataLvl || '');
  
      if ($id) it.baseId = it.resolve.url(it.baseId, $id);
  
      if ($async && !it.async) throw new Error('async schema in sync schema');
    }}
  
    var errs_{{=$lvl}} = errors;
  {{?}}
  
  {{
    var $valid = 'valid' + $lvl
      , $breakOnError = !it.opts.allErrors
      , $closingBraces1 = ''
      , $closingBraces2 = '';
  
    var $errorKeyword;
    var $typeSchema = it.schema.type
      , $typeIsArray = Array.isArray($typeSchema);
  
    if ($typeIsArray && $typeSchema.length == 1) {
      $typeSchema = $typeSchema[0];
      $typeIsArray = false;
    }
  }}
  
  {{## def.checkType:
    {{
      var $schemaPath = it.schemaPath + '.type'
        , $errSchemaPath = it.errSchemaPath + '/type'
        , $method = $typeIsArray ? 'checkDataTypes' : 'checkDataType';
    }}
  
    if ({{= it.util[$method]($typeSchema, $data, true) }}) {
  #}}
  
  {{? it.schema.$ref && $refKeywords }}
    {{? it.opts.extendRefs == 'fail' }}
      {{ throw new Error('$ref: validation keywords used in schema at path "' + it.errSchemaPath + '" (see option extendRefs)'); }}
    {{?? it.opts.extendRefs !== true }}
      {{
        $refKeywords = false;
        console.warn('$ref: keywords ignored in schema at path "' + it.errSchemaPath + '"');
      }}
    {{?}}
  {{?}}
  
  {{? $typeSchema }}
    {{? it.opts.coerceTypes }}
      {{ var $coerceToTypes = it.util.coerceToTypes(it.opts.coerceTypes, $typeSchema); }}
    {{?}}
  
    {{ var $rulesGroup = it.RULES.types[$typeSchema]; }}
    {{? $coerceToTypes || $typeIsArray || $rulesGroup === true ||
      ($rulesGroup && !$shouldUseGroup($rulesGroup)) }}
      {{
        var $schemaPath = it.schemaPath + '.type'
          , $errSchemaPath = it.errSchemaPath + '/type';
      }}
      {{# def.checkType }}
        {{? $coerceToTypes }}
          {{# def.coerceType }}
        {{??}}
          {{# def.error:'type' }}
        {{?}}
      }
    {{?}}
  {{?}}
  
  
  {{? it.schema.$ref && !$refKeywords }}
    {{= it.RULES.all.$ref.code(it, '$ref') }}
    {{? $breakOnError }}
      }
      if (errors === {{?$top}}0{{??}}errs_{{=$lvl}}{{?}}) {
      {{ $closingBraces2 += '}'; }}
    {{?}}
  {{??}}
    {{? it.opts.v5 && it.schema.patternGroups }}
      {{ console.warn('keyword "patternGroups" is deprecated and disabled. Use option patternGroups: true to enable.'); }}
    {{?}}
    {{~ it.RULES:$rulesGroup }}
      {{? $shouldUseGroup($rulesGroup) }}
        {{? $rulesGroup.type }}
          if ({{= it.util.checkDataType($rulesGroup.type, $data) }}) {
        {{?}}
          {{? it.opts.useDefaults && !it.compositeRule }}
            {{? $rulesGroup.type == 'object' && it.schema.properties }}
              {{# def.defaultProperties }}
            {{?? $rulesGroup.type == 'array' && Array.isArray(it.schema.items) }}
              {{# def.defaultItems }}
            {{?}}
          {{?}}
          {{~ $rulesGroup.rules:$rule }}
            {{? $shouldUseRule($rule) }}
              {{ var $code = $rule.code(it, $rule.keyword, $rulesGroup.type); }}
              {{? $code }}
                {{= $code }}
                {{? $breakOnError }}
                  {{ $closingBraces1 += '}'; }}
                {{?}}
              {{?}}
            {{?}}
          {{~}}
          {{? $breakOnError }}
            {{= $closingBraces1 }}
            {{ $closingBraces1 = ''; }}
          {{?}}
        {{? $rulesGroup.type }}
          }
          {{? $typeSchema && $typeSchema === $rulesGroup.type && !$coerceToTypes }}
            else {
              {{
                var $schemaPath = it.schemaPath + '.type'
                  , $errSchemaPath = it.errSchemaPath + '/type';
              }}
              {{# def.error:'type' }}
            }
          {{?}}
        {{?}}
  
        {{? $breakOnError }}
          if (errors === {{?$top}}0{{??}}errs_{{=$lvl}}{{?}}) {
          {{ $closingBraces2 += '}'; }}
        {{?}}
      {{?}}
    {{~}}
  {{?}}
  
  {{? $breakOnError }} {{= $closingBraces2 }} {{?}}
  
  {{? $top }}
      {{? $async }}
        if (errors === 0) return data;           {{ /* don't edit, used in replace */ }}
        else throw new ValidationError(vErrors); {{ /* don't edit, used in replace */ }}
      {{??}}
        validate.errors = vErrors; {{ /* don't edit, used in replace */ }}
        return errors === 0;       {{ /* don't edit, used in replace */ }}
      {{?}}
    });
  
    return validate;
  {{??}}
    var {{=$valid}} = errors === errs_{{=$lvl}};
  {{?}}
  
  {{# def.cleanUp }}
  
  {{? $top }}
    {{# def.finalCleanUp }}
  {{?}}
  
  {{
    function $shouldUseGroup($rulesGroup) {
      var rules = $rulesGroup.rules;
      for (var i=0; i < rules.length; i++)
        if ($shouldUseRule(rules[i]))
          return true;
    }
  
    function $shouldUseRule($rule) {
      return it.schema[$rule.keyword] !== undefined ||
             ($rule.implements && $ruleImlementsSomeKeyword($rule));
    }
  
    function $ruleImlementsSomeKeyword($rule) {
      var impl = $rule.implements;
      for (var i=0; i < impl.length; i++)
        if (it.schema[impl[i]] !== undefined)
          return true;
    }
  }};
}).call(this);