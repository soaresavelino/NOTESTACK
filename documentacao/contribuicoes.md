# 🤝 Contribuições Realizadas no NoteStack

Este documento detalha o escopo de contribuições da dupla para a disciplina de Engenharia de Software, cobrindo as exigências do **Caminho A (Resolução de Issue)** e do **Caminho B (Refatoração de Qualidade)**.

---

## 🎯 1. Resolução da Issue (Caminho A)

* **Issue de referência:** [rspavithra/NOTESTACK#20 - Sort notes by last modified date](https://github.com/rspavithra/NOTESTACK/issues/20)
* **Pull Request Oficial (Projeto Original):** [rspavithra/NOTESTACK/pull/85](https://github.com/rspavithra/NOTESTACK/pull/85)

### 🚨 Problema Identificado
As notas do NoteStack eram exibidas na tela de acordo com a ordem de inserção direta no armazenamento, ignorando o momento da última modificação. Dessa forma, notas atualizadas recentemente podiam ficar perdidas no fundo da lista, prejudicando a usabilidade geral.

### 🛠️ Solução Implementada
1. **Atributos de Tempo:** Adicionadas as propriedades `createdAt` (data de criação) e `updatedAt` (data de modificação) na estrutura do objeto de notas dentro do `script.js`.
2. **Ciclo de Atualização:** A propriedade `updatedAt` é gerada no momento da criação da nota e updated dinamicamente sempre que o conteúdo ou o título da nota sofre alterações.
3. **Ordenação Cronológica:** Implementada uma função de ordenação descendente (`.sort()`) baseada no timestamp de `updatedAt` para garantir que as notas alteradas por último fiquem sempre no topo.
4. **Resiliência:** Foi adicionado suporte a notas antigas salvas localmente (retrocompatibilidade), que recebem um fallback de data para não quebrar o layout.
5. **Consistência Visual:** A ordenação automática foi integrada com sucesso no grid principal, nas categorias, nas pastas personalizadas e na barra de pesquisa de termos.

---
## 🏗️ 2. Descrição da Refatoração (Caminho B)

* **Escopo técnico:** Reestruturação arquitetural e eliminação de acoplamentos no arquivo `script.js`

### 🛡️ Padrões de Projeto Sugeridos
* **Singleton (`NoteStorage`):** Sugerido para a parte que lida com o `localStorage` (salvar e buscar notas). Ele cria uma classe única na memória para cuidar do banco de dados local em um só lugar. Isso segue o Princípio de Responsabilidade Única (SRP) e evita que o código de salvamento fique espalhado e duplicado pelo arquivo.

* **Facade (`UIManager`):** Sugerido para a parte que mexe com o HTML da tela (comandos diretos como `document.getElementById` e `innerHTML`). Ele funciona como uma fachada simples para centralizar e esconder as alterações de layout, isolando as funções de lógica dessas manipulações visuais.

### 🧹 Correção de Code Smells (Análise Estática do SonarCloud)
* **Nested If (Linearização):** Correção de desvios condicionais na função `restoreNote`. Juntamos um `if` que estava sozinho e escondido dentro de um bloco `else`, transformando-o em um `else if` direto. Isso eliminou chaves inúteis e deixou o código em linha reta, facilitando a leitura.
* **Optional Chaining (`?.`):** Simplificação de validações na função `filterNotesByCategory`. Trocamos uma checagem manual dupla e poluída com `&&` pelo operador de ponto de interrogação (`?.`). O código ficou muito mais curto, limpo e protegido contra erros de dados vazios.
* **Redundant Jump (Remoção de Código Morto):** Correção no evento da tecla "Escape". Removemos a palavra-chave `return;` que estava sobrando no final do bloco. Como ela não realizava nenhuma função prática ali, sua remoção eliminou um pedaço de código inútil.
* **Padrão Moderno `.dataset`:** Substituição das chamadas genéricas de `setAttribute` para manipulação de atributos iniciados com `data-` nas linhas 98, 270 e 416. Trocamos o formato antigo pelo uso da propriedade limpa `.dataset` do JavaScript moderno.

---

## 👥 3. Papel de Cada Integrante

Para garantir uma divisão clara de responsabilidades, cada membro liderou uma frente específica do projeto:

* **Gabriel Soares Avelino:**
  * Modelagem e documentação da nova arquitetura do NoteStack (`PR1`).
  * Mapeamento, diagnóstico e correção dos Code Smells apontados pelo SonarCloud (`PR2`).
  * Sugestão e aplicação dos Padrões de Projeto Singleton e Facade (`PR3`).

* **Geovanna:**
  * Escrita e parametrização dos testes automatizados de aceitação usando Cypress (`PR4`).
  * Modelagem e automação da pipeline de Integração Contínua (CI) com GitHub Actions (`PR5`).
  * Desenvolvimento da lógica de carimbo de datas e ordenação dinâmica para fechar a Issue #20 (`PR6`).

--- 


## 🔀 4. Lista de todos os PRs Criados (Histórico Completo)

Aqui está o histórico estruturado de entregas realizadas no fork [soaresavelino/NOTESTACK](https://github.com/soaresavelino/NOTESTACK) e o fechamento do bônus externo:

| Pull Request | Autor | Objetivo / Escopo da Entrega | Link de Acesso Direto |
| :--- | :--- | :--- | :--- |
| **PR1** | Gabriel | Desenvolvimento inicial, arquitetura e organização do projeto | [Acessar PR1](https://github.com/soaresavelino/NOTESTACK/pull/1) |
| **PR2** | Gabriel | Identificação de Code Smells, Sugestões de Aplicação de Padrões de Projeto | [Acessar PR2](https://github.com/soaresavelino/NOTESTACK/pull/2) |
| **PR3** | Gabriel | Refatoração | [Acessar PR3](https://github.com/soaresavelino/NOTESTACK/pull/3) |
| **PR4** | Geovanna | Implementação dos testes automatizados de aceitação (Cypress) | [Acessar PR4](https://github.com/soaresavelino/NOTESTACK/pull/12) |
| **PR5** | Geovanna | Configuração da pipeline DevOps (GitHub Actions CI) | [Acessar PR5](https://github.com/soaresavelino/NOTESTACK/pull/15) |
| **PR6** | Geovanna | Resolução da Issue #20 (Data de modificação e ordenação) | [Acessar PR6](https://github.com/soaresavelino/NOTESTACK/pull/17) |
| **BÔNUS** | Dupla | **PR Oficial enviado ao repositório original (rspavithra/NOTESTACK)** | [Acessar PR #85](https://github.com/rspavithra/NOTESTACK/pull/85) |    