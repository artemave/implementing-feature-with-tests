autocmd FileType javascript set formatprg=prettier-standard
autocmd BufWritePre *.js  exe "normal! gggqG\<C-o>\<C-o>"

let g:dbext_default_profile_sqlite_tests = 'type=SQLITE:dbname=./features/support/test.db'
let g:dbext_default_profile = 'sqlite_tests'
