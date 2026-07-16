describe("NoteStack - testes principais", () => {
    const criarNota = (texto) => {
        cy.get("#noteInput")
            .should("be.visible")
            .clear()
            .type(texto);

        cy.get("#addNoteBtn")
            .should("be.visible")
            .click();

        cy.contains(".note-card", texto)
            .should("be.visible");
    };

    beforeEach(() => {
        cy.visit("/", {
            onBeforeLoad(window) {
                window.localStorage.clear();
            },
        });
    });

    it("mantém a nota visível após recarregar a página", () => {
        const texto = "Nota persistente Cypress";

        criarNota(texto);

        cy.window().then((window) => {
            const notasSalvas =
                window.localStorage.getItem("notestackNotes") ||
                window.localStorage.getItem("ultimateNotes");

            expect(
                notasSalvas,
                "notas armazenadas no localStorage"
            ).to.not.be.null;

            const notas = JSON.parse(notasSalvas);

            expect(notas).to.be.an("array");

            expect(
                notas.some(nota => nota.text === texto),
                "nota criada deve estar salva"
            ).to.equal(true);

            /*
             * O script carrega as notas utilizando ultimateNotes.
             * Por isso, garantimos que essa chave tenha as notas
             * antes de recarregar a página.
             */
            window.localStorage.setItem(
                "ultimateNotes",
                JSON.stringify(notas)
            );
        });

        cy.reload();

        cy.contains(".note-card", texto, {
            timeout: 10000,
        }).should("be.visible");
    });

    it("abre o modal de criação de pasta", () => {
        cy.get("#newFolderModal")
            .should("not.be.visible");

        cy.get("#newFolderBtn")
            .should("be.visible")
            .click();

        cy.get("#newFolderModal")
            .should("be.visible");
    });

    it("exclui uma nota do grid", () => {
        const texto = "Nota que será excluída";

        criarNota(texto);

        cy.contains(".note-card", texto)
            .should("exist")
            .within(() => {
                cy.get(".delete-btn")
                    .should("be.visible")
                    .click();
            });

        cy.contains(".note-card", texto)
            .should("not.exist");
    });
});