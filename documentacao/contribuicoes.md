# Contribuições realizadas no NoteStack

## Issue #20 — Ordenação das notas pela data de modificação

**Issue de referência:** `rspavithra/NOTESTACK#20`

### Problema identificado

As notas do NoteStack eram exibidas de acordo com a posição em que estavam armazenadas no sistema, sem considerar a data da última modificação.

Dessa forma, uma nota recentemente editada poderia permanecer abaixo de notas mais antigas, dificultando o acesso aos conteúdos que haviam sido atualizados pelo usuário.

### Solução implementada

Foram adicionadas às notas as propriedades `createdAt` e `updatedAt`.

A propriedade `createdAt` registra a data e o horário em que a nota foi criada. A propriedade `updatedAt` recebe inicialmente a mesma data de criação e é atualizada sempre que o conteúdo da nota é editado.

Foi criada uma função responsável por ordenar as notas pela data da última modificação, da mais recente para a mais antiga.

A ordenação foi aplicada às seguintes visualizações:

* lista geral de notas;
* categorias;
* pastas personalizadas;
* resultados de pesquisa.

Também foi implementada compatibilidade com notas antigas que ainda não possuíam as propriedades de data.

### Comportamento após a melhoria

Quando uma nota é criada, ela aparece entre as notas mais recentes.

Quando uma nota antiga é editada, sua data de modificação é atualizada e ela passa a aparecer no início da lista.

### Arquivo alterado

* `script.js`

### Validação realizada

A melhoria foi validada pelos seguintes procedimentos:

1. Criação de duas notas em momentos diferentes;
2. Verificação de que a nota criada mais recentemente aparece primeiro;
3. Edição da nota mais antiga;
4. Verificação de que a nota editada passa para o início da lista;
5. Verificação da ordenação na lista geral;
6. Verificação da ordenação nas categorias e pastas;
7. Verificação da ordenação nos resultados de pesquisa;
8. Execução dos testes automatizados com Cypress.

## Histórico de Pull Requests

| Pull Request | Objetivo                                                           |
| ------------ | ------------------------------------------------------------------ |
| PR1          | Desenvolvimento inicial e organização do projeto                   |
| PR2          | Diagnóstico e correção dos Code Smells                             |
| PR3          | Implementação dos padrões Singleton e Facade                       |
| PR4          | Implementação de testes automatizados com Cypress                  |
| PR5          | Configuração da pipeline de integração contínua com GitHub Actions |
| PR6          | Ordenação das notas pela data da última modificação                |