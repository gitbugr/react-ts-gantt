let g:nc2_enabled = 0

"" JS DEVTools
" bindings could be better, but are intended to match my phpactor bindings
" closely
let g:lmap.k = {
            \'name': 'JS DEVTools',
            \'d': ['TSDef', 'Go to definition'],
            \'f': ['TSRefs', 'Find references'],
            \'k': {
            \   'name': 'Menu',
            \   'r': ['TSRename', 'Rename'],
            \   'h': ['TSDoc', 'Generate Documentation'],
            \},
            \'h': ['TSType', 'Hover'],
            \'u': ['TSImport', 'Import Module'],
            \' ': ['JsDoc', 'DocBlock'],
            \}

let g:topdict = g:lmap
