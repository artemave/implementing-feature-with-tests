autocmd FileType javascript set formatprg=prettier-standard
autocmd BufWritePre *.js  exe "normal! gggqG\<C-o>\<C-o>"
