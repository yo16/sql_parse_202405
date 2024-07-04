# node-sql-parser/pegjs/bigquery.pegjs

# memo
`parser.parse`によって得られる`tableList`、`columnList`は、テーブルと列の存在は示せるが、その関連は示せない。関連を見るためには、astを読まないといけない。astの構造は、pegjsによって定義されている。
したがって、pegjsを解読・理解する必要がある。


# source

## select_stmt_nake
```
select_stmt_nake
  = __ cte:with_clause? __ KW_SELECT ___
    sv:struct_value? __
    d:(KW_ALL / KW_DISTINCT)? __
    c:column_clause     __
    f:from_clause?      __
    fs:for_sys_time_as_of? __
    w:where_clause?     __
    g:group_by_clause?  __
    h:having_clause?    __
    q:qualify_clause? __
    o:order_by_clause?  __
    l:limit_clause? __
    win:window_clause? {
      if(Array.isArray(f)) f.forEach(info => info.table && tableList.add(`select::${info.db}::${info.table}`));
      return {
          type: 'select',
          as_struct_val: sv,
          distinct: d,
          columns: c,
          from: f,
          for_sys_time_as_of: fs,
          where: w,
          with: cte,
          groupby: g,
          having: h,
          qualify: q,
          orderby: o,
          limit: l,
          window:win,
          ...getLocationObject()
      };
  }
```

## column_clause (1656)
```
column_clause
  = c:columns_list __ COMMA? {
    return c
  }

columns_list
  = head:column_list_item tail:(__ COMMA __ column_list_item)* {
      return createList(head, tail);
    }
```

## column_list_item (1681)
```
column_list_item
  = p:(column_without_kw __ DOT)? STAR __ k:('EXCEPT'i / 'REPLACE'i) __ LPAREN __ c:columns_list __ RPAREN {
    const tbl = p && p[0]
    columnList.add(`select::${tbl}::(.*)`)
    return {
      expr_list: c,
      parentheses: true,
      expr: {
        type: 'column_ref',
        table: tbl,
        column: '*'
      },
      type: k.toLowerCase(),
      ...getLocationObject(),
    }
  }
  / head: (KW_ALL / (STAR !ident_start) / STAR) {
      columnList.add('select::null::(.*)')
      const item = {
        expr: {
          type: 'column_ref',
          table: null,
          column: '*'
        },
        as: null,
        ...getLocationObject()
      }
      return item
  }
  / tbl:column_without_kw __ DOT pro:((column_offset_expr / column_without_kw) __ DOT)? __ STAR {
      columnList.add(`select::${tbl}::(.*)`)
      let column = '*'
      const mid = pro && pro[0]
      if (typeof mid === 'string') column = `${mid}.*`
      if (mid && mid.expr && mid.offset) column = { ...mid, suffix: '.*' }
      return {
        expr: {
          type: 'column_ref',
          table: tbl,
          column,
        },
        as: null,
        ...getLocationObject()
      }
    }
  / c:column_offset_expr __ s:(DOT __ column_without_kw)? __ as:alias_clause? {
    if (s) c.suffix = `.${s[2]}`
    return {
        expr: {
          type: 'column_ref',
          table: null,
          column: c
        },
        as: as,
        ...getLocationObject()
      }
  }
  / expr_alias
```

## expr_alias (1651)
```
expr_alias
  = e:binary_column_expr __ alias:alias_clause? {
      return { expr: e, as: alias, ...getLocationObject() };
    }
```

## binary_column_expr (2133)
```
binary_column_expr
  = head:expr tail:(__ (KW_AND / KW_OR / LOGIC_OPERATOR) __ expr)* {
    const ast = head.ast
    if (ast && ast.type === 'select') {
      if (!(head.parentheses_symbol || head.parentheses || head.ast.parentheses || head.ast.parentheses_symbol) || ast.columns.length !== 1 || ast.columns[0].expr.column === '*') throw new Error('invalid column clause with select statement')
    }
    if (!tail || tail.length === 0) return head
    const len = tail.length
    let result = tail[len - 1][3]
    for (let i = len - 1; i >= 0; i--) {
      const left = i === 0 ? head : tail[i - 1][3]
      result = createBinaryExpr(tail[i][1], left, result)
    }
    return result
  }
```

## expr_list (2042)
```
expr_list
  = head:expr tail:(__ COMMA __ expr)* {
      const el = { type: 'expr_list' };
      el.value = createList(head, tail);
      return el;
    }

_expr
  = struct_expr
  / json_expr
  / or_expr
  / unary_expr
  / array_expr

expr
  = _expr / union_stmt
```

## unary_expr (2128)
```
unary_expr
  = op: additive_operator tail: (__ primary)+ {
    return createUnaryExpr(op, tail[0][1]);
  }
```

## function createUnaryExpr (127)
```
  function createUnaryExpr(op, e) {
    return {
      type: 'unary_expr',
      operator: op,
      expr: e
    };
  }
```


## primary (2285)
- これを呼んでいるところがわからない
```
primary
  = array_expr
  / aggr_func
  / func_call
  / struct_expr
  / json_expr
  / cast_expr
  / literal
  / case_expr
  / interval_expr
  / column_ref
  / param
  / LPAREN __ list:or_and_where_expr __ RPAREN {
        list.parentheses = true;
        return list;
    }
```

## unary_expr_or_primary
```
unary_expr_or_primary
  = primary
  / op:(unary_operator) tail:(__ unary_expr_or_primary) {
    // if (op === '!') op = 'NOT'
    return createUnaryExpr(op, tail[1])
  }
```
