// ==========================================
// PADRÃO DE PROJETO: SINGLETON (NoteStorage)
// ==========================================
class NoteStorage {
    constructor() {
        if (!NoteStorage.instancia) {
            NoteStorage.instancia = this;
        }
        return NoteStorage.instancia;
    }

    buscarNotas() {
        return JSON.parse(localStorage.getItem("ultimateNotes")) || [];
    }

    salvarNotas(notes) {
        localStorage.setItem("ultimateNotes", JSON.stringify(notes));
    }

    buscarLixeira() {
        return JSON.parse(localStorage.getItem("ultimateTrash")) || [];
    }

    salvarLixeira(trash) {
        localStorage.setItem("ultimateTrash", JSON.stringify(trash));
    }

    buscarPastas() {
        return JSON.parse(localStorage.getItem("noteFolders")) || [];
    }

    salvarPastas(folders) {
        localStorage.setItem("noteFolders", JSON.stringify(folders));
    }
}

// Cria e congela a instância única do Singleton
const storage = new NoteStorage();
Object.freeze(storage);

// ==========================================
// PADRÃO DE PROJETO: FACADE (UIManager)
// ==========================================
class UIManager {
    static obterElemento(id) {
        return document.getElementById(id);
    }

    static obterTodos(seletor) {
        return document.querySelectorAll(seletor);
    }
}

// Mapeamento dos elementos usando o padrão Facade
const noteInput = UIManager.obterElemento("noteInput");
const addNoteBtn = UIManager.obterElemento("addNoteBtn");
const notesGrid = UIManager.obterElemento("notesGrid");
const searchInput = UIManager.obterElemento("searchInput");
const trashGrid = UIManager.obterElemento("trashGrid");
const darkModeBtn = UIManager.obterElemento("darkModeBtn");
const labelCheckboxes = UIManager.obterTodos(".label-checkbox");

// Folder Elements usando Facade
const newFolderBtn = UIManager.obterElemento("newFolderBtn");
const newFolderModal = UIManager.obterElemento("newFolderModal");
const closeFolderModal = UIManager.obterElemento("closeFolderModal");
const folderNameInput = UIManager.obterElemento("folderNameInput");
const createFolderBtn = UIManager.obterElemento("createFolderBtn");
const customFoldersList = UIManager.obterElemento("customFoldersList");
const folderSelect = UIManager.obterElemento("folderSelect");

// Estado da Aplicação gerenciado pelo Singleton
let trash = storage.buscarLixeira();
let notes = storage.buscarNotas();
let folders = storage.buscarPastas();
let currentFilter = "all"; // Track current category/folder filter

// --- Funções Auxiliares de Tempo ---
function getNoteTimestamp(note) {
    const noteDate = note.updatedAt || note.createdAt;

    if (!noteDate) {
        return 0;
    }

    const timestamp = new Date(noteDate).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortNotesByModificationDate(notesList) {
    return [...notesList].sort(
        (noteA, noteB) => getNoteTimestamp(noteB) - getNoteTimestamp(noteA)
    );
}

function showEmptyState(container, message) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>No notes yet</h3>
            <p>${message}</p>
            <button id="emptyAddBtn">+ Add Note</button>
        </div>
    `;

    const btn = UIManager.obterElemento("emptyAddBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            noteInput.focus();
        });
    }
}

function getSelectedLabels() {
    const selected = [];
    labelCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selected.push(checkbox.value);
        }
    });
    return selected;
}

function createNoteCard(note, originalIndex) {
    const card = document.createElement("div");
    card.className = "note-card";

    if (note.labels?.length) {
        card.dataset.labels = note.labels.join(" ");

        const labelsDiv = document.createElement("div");
        labelsDiv.className = "note-labels";

        note.labels.forEach(label => {
            const labelSpan = document.createElement("span");
            labelSpan.className = `note-label ${label.toLowerCase()}`;
            labelSpan.textContent = label;
            labelsDiv.appendChild(labelSpan);
        });

        card.appendChild(labelsDiv);
    }

    const content = document.createElement("p");
    content.textContent = note.text;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editNote(originalIndex);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteNote(originalIndex);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(content);
    card.appendChild(actions);

    return card;
}

function filterNotesByCategory(category) {
    currentFilter = category;

    if (category === "all") {
        renderNotes(searchInput.value);
    } else {
        const filtered = sortNotesByModificationDate(
            notes.filter(note =>
                note.labels?.includes(category) || note.folder === category
            )
        );

        notesGrid.innerHTML = "";

        if (filtered.length === 0) {
            showEmptyState(
                notesGrid,
                `No ${category} notes found. Start by adding your first note!`
            );
            return;
        }

        filtered.forEach(note => {
            const originalIndex = notes.findIndex(item => item.id === note.id);
            notesGrid.appendChild(createNoteCard(note, originalIndex));
        });
    }

    // Update active state in sidebar
    UIManager.obterTodos(".sidebar li").forEach(li => {
        li.classList.remove("active");
    });

    const builtInNav = UIManager.obterElemento(`nav${category}`);
    if (builtInNav) {
        builtInNav.classList.add("active");
    } else {
        const customNavs = UIManager.obterTodos(".custom-folder-item");
        customNavs.forEach(nav => {
            if (nav.dataset.folder === category) {
                nav.classList.add("active");
            }
        });
    }
}

// Métodos de Persistência via Singleton
function saveNotes() {
    storage.salvarNotas(notes);
}

function saveFolders() {
    storage.salvarPastas(folders);
}

// Migrate old notes to new format
notes = notes.map(note => {
    const currentDate = new Date().toISOString();

    if (typeof note === "string") {
        return {
            id: Date.now() + Math.random(),
            text: note,
            labels: [],
            folder: "",
            createdAt: currentDate,
            updatedAt: currentDate
        };
    }

    if (note.folder === undefined) {
        note.folder = "";
    }

    if (!note.createdAt) {
        const noteId = Number(note.id);
        note.createdAt = Number.isFinite(noteId) && noteId > 0
            ? new Date(noteId).toISOString()
            : currentDate;
    }

    if (!note.updatedAt) {
        note.updatedAt = note.createdAt;
    }

    return note;
});
saveNotes();

function saveTrash() {
    storage.salvarLixeira(trash);
}

function renderNotes(filter = "") {
    if (currentFilter !== "all") {
        filterNotesByCategory(currentFilter);
        return;
    }

    notesGrid.innerHTML = "";

    let filteredNotes = sortNotesByModificationDate(notes);

    if (filter.startsWith("#")) {
        const labelFilter = filter.substring(1).toLowerCase();
        filteredNotes = filteredNotes.filter(note =>
            note.labels?.some(label =>
                label.toLowerCase().includes(labelFilter)
            )
        );
    } else {
        filteredNotes = filteredNotes.filter(note =>
            note.text.toLowerCase().includes(filter.toLowerCase())
        );
    }

    if (filteredNotes.length === 0 && filter.trim() !== "") {
        showEmptyState(
            notesGrid,
            `No notes found matching "${filter}". Try a different search or add a new note.`
        );
        return;
    }

    filteredNotes.forEach(note => {
        const originalIndex = notes.findIndex(item => item.id === note.id);
        notesGrid.appendChild(createNoteCard(note, originalIndex));
    });
}

function addNote() {
    const text = noteInput.value.trim();

    if (!text) {
        return;
    }

    const selectedLabels = getSelectedLabels();
    const selectedFolder = folderSelect.value;
    const currentDate = new Date().toISOString();

    notes.push({
        id: Date.now(),
        text,
        labels: selectedLabels,
        folder: selectedFolder,
        createdAt: currentDate,
        updatedAt: currentDate
    });

    noteInput.value = "";
    folderSelect.value = "";

    labelCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    saveNotes();
    renderNotes(searchInput.value);
}

function deleteNote(index) {
    trash.push(notes[index]);
    notes.splice(index, 1);

    saveNotes();
    saveTrash();

    if (currentFilter !== "all") {
        filterNotesByCategory(currentFilter);
    } else {
        renderNotes(searchInput.value);
    }
}

function editNote(index) {
    const updated = prompt("Edit note:", notes[index].text);

    if (updated !== null && updated.trim() !== "") {
        notes[index].text = updated.trim();
        notes[index].updatedAt = new Date().toISOString();

        saveNotes();
        renderNotes(searchInput.value);
    }
}

addNoteBtn.addEventListener("click", addNote);

searchInput.addEventListener("input", () => {
    if (currentFilter !== "all") {
        const filtered = sortNotesByModificationDate(
            notes.filter(note =>
                note.labels?.includes(currentFilter) &&
                note.text.toLowerCase().includes(searchInput.value.toLowerCase())
            )
        );

        notesGrid.innerHTML = "";

        if (filtered.length === 0) {
            notesGrid.innerHTML = `
                <p style="text-align:center; margin-top:20px; color:#777;">
                    No ${currentFilter} notes found matching "${searchInput.value}"
                </p>
            `;
            return;
        }

        filtered.forEach(note => {
            const originalIndex = notes.findIndex(item => item.id === note.id);
            notesGrid.appendChild(createNoteCard(note, originalIndex));
        });
    } else {
        renderNotes(searchInput.value);
    }
});

function restoreNote(index) {
    notes.push(trash[index]);
    trash.splice(index, 1);

    saveNotes();
    saveTrash();

    // CODE SMELL 1 RESOLVIDO: Linearização da estrutura usando else if
    if (UIManager.obterElemento("trashView").style.display === "block") {
        renderTrash();
    } else if (currentFilter !== "all") {
        filterNotesByCategory(currentFilter);
    } else {
        renderNotes(searchInput.value);
    }
}

function permanentlyDelete(index) {
    if (!confirm("Permanently delete this note? This cannot be undone.")) {
        return;
    }

    trash.splice(index, 1);
    saveTrash();
    renderTrash();
}

function renderTrash() {
    if (!trashGrid) {
        return;
    }

    trashGrid.innerHTML = "";

    if (trash.length === 0) {
        trashGrid.innerHTML = `
            <p style="text-align:center; margin-top:20px; color:#777;">
                Trash is empty
            </p>
        `;
        return;
    }

    trash.forEach((note, index) => {
        const card = document.createElement("div");
        card.className = "note-card";

        const noteText = typeof note === "string" ? note : note.text;
        const noteLabels = typeof note === "object" && note.labels ? note.labels : [];

        if (noteLabels.length > 0) {
            const labelsDiv = document.createElement("div");
            labelsDiv.className = "note-labels";

            noteLabels.forEach(label => {
                const labelSpan = document.createElement("span");
                labelSpan.className = `note-label ${label.toLowerCase()}`;
                labelSpan.textContent = label;
                labelsDiv.appendChild(labelSpan);
            });

            card.appendChild(labelsDiv);
        }

        const content = document.createElement("p");
        content.textContent = noteText;

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "Restore";
        restoreBtn.className = "edit-btn";
        restoreBtn.onclick = () => restoreNote(index);

        const permDeleteBtn = document.createElement("button");
        permDeleteBtn.textContent = "Delete Forever";
        permDeleteBtn.className = "delete-btn";
        permDeleteBtn.onclick = () => permanentlyDelete(index);

        actions.appendChild(restoreBtn);
        actions.appendChild(permDeleteBtn);

        card.appendChild(content);
        card.appendChild(actions);

        trashGrid.appendChild(card);
    });
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkModeBtn.textContent = "☀️ Light Mode";
}

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    darkModeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

renderNotes();
renderTrash();

// Sidebar Navigation
UIManager.obterElemento("navNotes").addEventListener("click", () => {
    UIManager.obterElemento("notesView").style.display = "block";
    UIManager.obterElemento("trashView").style.display = "none";
    UIManager.obterElemento("navNotes").classList.add("active");
    UIManager.obterElemento("navTrash").classList.remove("active");
    filterNotesByCategory("all");
});

UIManager.obterElemento("navTrash").addEventListener("click", () => {
    UIManager.obterElemento("notesView").style.display = "none";
    UIManager.obterElemento("trashView").style.display = "block";
    UIManager.obterElemento("navTrash").classList.add("active");
    UIManager.obterElemento("navNotes").classList.remove("active");
    UIManager.obterElemento("navImportant").classList.remove("active");
    UIManager.obterElemento("navWork").classList.remove("active");
    UIManager.obterElemento("navPersonal").classList.remove("active");
    UIManager.obterElemento("navIdeas").classList.remove("active");
    renderTrash();
});

// Category Filters
UIManager.obterElemento("navImportant").addEventListener("click", () => {
    UIManager.obterElemento("notesView").style.display = "block";
    UIManager.obterElemento("trashView").style.display = "none";
    filterNotesByCategory("Important");
});

UIManager.obterElemento("navWork").addEventListener("click", () => {
    UIManager.obterElemento("notesView").style.display = "block";
    UIManager.obterElemento("trashView").style.display = "none";
    filterNotesByCategory("Work");
});

UIManager.obterElemento("navPersonal").addEventListener("click", () => {
    UIManager.obterElemento("notesView").style.display = "block";
    UIManager.obterElemento("trashView").style.display = "none";
    filterNotesByCategory("Personal");
});

UIManager.obterElemento("navIdeas").addEventListener("click", () => {
    UIManager.obterElemento("notesView").style.display = "block";
    UIManager.obterElemento("trashView").style.display = "none";
    filterNotesByCategory("Ideas");
});

// --- Folder Management ---
function renderFolders() {
    customFoldersList.innerHTML = "";
    folderSelect.innerHTML = '<option value="">No Folder</option>';

    folders.forEach(folder => {
        const li = document.createElement("li");
        li.className = "custom-folder-item";
        li.dataset.folder = folder;
        li.innerHTML = `📁 ${folder}`;

        li.addEventListener("click", () => {
            UIManager.obterElemento("notesView").style.display = "block";
            UIManager.obterElemento("trashView").style.display = "none";
            filterNotesByCategory(folder);
        });

        customFoldersList.appendChild(li);

        const option = document.createElement("option");
        option.value = folder;
        option.textContent = folder;
        folderSelect.appendChild(option);
    });
}

newFolderBtn.addEventListener("click", () => {
    newFolderModal.style.display = "flex";
    folderNameInput.focus();
});

closeFolderModal.addEventListener("click", () => {
    newFolderModal.style.display = "none";
});

createFolderBtn.addEventListener("click", () => {
    const name = folderNameInput.value.trim();

    if (!name) {
        return;
    }

    if (folders.includes(name)) {
        alert("A folder with this name already exists.");
        return;
    }

    folders.push(name);
    saveFolders();
    renderFolders();

    folderNameInput.value = "";
    newFolderModal.style.display = "none";
});

// --- Keyboard Shortcuts ---
document.addEventListener("keydown", event => {
    if (event.altKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        noteInput.focus();
    }

    if (event.altKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        searchInput.focus();
    }

    if (event.altKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        darkModeBtn.click();
    }

    if (event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        UIManager.obterElemento("navTrash").click();
    }

    // CODE SMELL 3 RESOLVIDO: Removido 'return;' desnecessário
    if (event.key === "Escape") {
        searchInput.value = "";
        renderNotes();
    }
});

// Initial Render
renderFolders();