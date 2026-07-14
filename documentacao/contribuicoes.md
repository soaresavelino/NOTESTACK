# Contribuições realizadas no NoteStack

## Issue #20 — Ordenação das notas pela data de modificação

**Link da issue:** inserir aqui o link da issue #20

### Problema identificado

As notas do NoteStack eram apresentadas de acordo com a posição em que estavam armazenadas no array, sem considerar quando haviam sido criadas ou editadas. Dessa forma, uma nota recentemente modificada poderia continuar aparecendo abaixo de notas mais antigas, dificultando o acesso aos conteúdos atualizados pelo usuário.

### Solução implementada

Foram adicionadas às notas as propriedades `createdAt` e `updatedAt`.

A propriedade `createdAt` registra a data e o horário em que a nota foi criada. A propriedade `updatedAt` também recebe a data de criação inicialmente, mas é atualizada sempre que o conteúdo da nota é editado.

Foi criada uma função de ordenação que compara a data de modificação das notas e retorna uma nova lista organizada da mais recente para a mais antiga. Essa ordenação foi aplicada na visualização geral, nas categorias, nas pastas e nos resultados de pesquisa.

Também foi adicionada uma rotina de compatibilidade para notas antigas que ainda não possuíam as propriedades de data.

### Comportamento após a melhoria

Quando uma nova nota é criada, ela aparece no início da lista. Quando uma nota antiga é editada, sua data de modificação é atualizada e ela passa automaticamente para o início da visualização.

### Arquivo alterado

* `script.js`

### Validação realizada

A melhoria foi validada por meio dos seguintes passos:

1. Criação de duas notas em momentos diferentes;
2. Verificação de que a nota mais recente apareceu primeiro;
3. Edição da nota mais antiga;
4. Verificação de que a nota editada passou para o início da lista;
5. Teste da ordenação na visualização geral, nas categorias, nas pastas e na pesquisa.

