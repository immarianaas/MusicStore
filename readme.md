# Music Store

## Funcionalidades

### Sem login efetuado é possível
- navegar pela página de instrumentos e verificar detalhes desses mesmos instrumentos
- navegar pela página de fabricantes e também verificar os detalhes que lhes correspondem
- pesquisar por algum instrumento (lupa no topo do separador 'instruments')
- qualquer ação para além das duas enunciadas antes (p.e comprar instrumento) implica que se efetue um login antes

### Após efetuar login (cliente)
- mesmas possibilidades que haviam antes de se autenticar
- possibilidade de adicionar um produto ao carrinho de compras (clicando em 'buy')
	- após adicionar os produtos que pretender pode encaminhar-se para o checkout (1o clicando no carrinho disposto na navbar, em 2o clicando em 'Place Order')
	- encontrando-se no separador de 'Payment', pode então associar uma morada de entrega (não havendo nenhuma pode criar no momento clicando em 'Create a new address', ou entao indo às configurações de conta e adicionar um novo endereço)
	- é necessário também especificar qual o método de pagamento
	- e clicando em 'Click to finish' teremos entao concluído o processo
- ou entao adicionar esse produto aos seus favoritos
	- no separador de favoritos ( prontamente acedido a partir do ícone de coração da navbar) é possível verificar os instrumentos favoritos, bem como adicioná-los ao carrinho de compras ou então removê-los simplesmente da lista.
Ver / pesquisar os instrumentos / maufacturers e “comprar”
- clicando no ícone da navbar referente ao utilizador
	- é permitido fazer ações de edicão de perfil como por exemplo, editar contacto, endereços associados, ou mesmo alterar a palavra-passe
	- também é fazível ações já referidas anteriormente, como verificar quais os favoritos, qual o estado do carrinho de compras
	- por último, algo bastante útil, será o facto de ser possível verificar detalhes duma compra bem como o seu estado de entrega ( disponível clicando em 'see your orders' )

### Após efetuar login (admin)
- pode verificar os fabricantes de instrumentos associados com a empresa ('see all manufacturers')
	- pode editar ou eliminar fabricantes, assim como verificar todos os instrumentos associados a esse fabricante
- pode também verificar os instrumentos disponíveis
- se for necessário adicionar um fabricante recentemente associado com a empresa, ir de encontro a 'add manufacturer'
- contrariamente, se o fabricante já estiver filiado e apenas quiser adicionar um novo modelo de instrumento, clicar em 'add instrument'
- por último, clicando em 'see orders mande by clients' conseguirá encontrar os detalhes de todas as compras feitas por clientes

### extra
- quando algum utilizador tenta aceder a uma página à qual não tem permissão, é prontamente redirecionado para uma página com erro 403
	- para exemplificar: http://orlandop.pythonanywhere.com/edit/instruments/1


