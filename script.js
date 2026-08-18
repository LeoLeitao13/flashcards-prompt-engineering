// --- ESTADO ---
let materias = JSON.parse(localStorage.getItem('flashcards_db')) || [];
let materiaAtivaId = null;

// --- SELETORES ---
const viewMaterias = document.getElementById('view-materias');
const viewFlashcards = document.getElementById('view-flashcards');
const listaMateriasContainer = document.getElementById('lista-materias');
const listaCardsContainer = document.getElementById('lista-cards');
const tituloMateriaAtiva = document.getElementById('titulo-materia-ativa');

// --- PERSISTÊNCIA ---
function salvarDados() {
    localStorage.setItem('flashcards_db', JSON.stringify(materias));
}

// --- NAVEGAÇÃO ---
function abrirMateria(id) {
    materiaAtivaId = id;
    const materia = materias.find(m => m.id === id);
    tituloMateriaAtiva.innerText = materia.title;
    viewMaterias.classList.add('hidden');
    viewFlashcards.classList.remove('hidden');
    renderizarFlashcards();
}

function voltarParaMaterias() {
    materiaAtivaId = null;
    viewFlashcards.classList.add('hidden');
    viewMaterias.classList.remove('hidden');
    renderizarMaterias();
}

// --- CRUD MATÉRIAS ---
function renderizarMaterias() {
    // Limpa o container antes de renderizar para evitar duplicatas
    listaMateriasContainer.innerHTML = '';

    materias.forEach(materia => {
        const div = document.createElement('div');
        div.className = 'materia-card';
        
        // Calculamos a quantidade de cards com uma verificação de segurança
        const quantidadeCards = materia.cards ? materia.cards.length : 0;
        
        // Lógica simples de pluralização
        const textoCards = quantidadeCards === 1 ? '1 flashcard' : `${quantidadeCards} flashcards`;

        div.innerHTML = `
            <div class="materia-info">
                <h3>${materia.title}</h3>
                <span class="badge-count">${textoCards}</span>
            </div>
            <div class="materia-actions">
                <button class="btn-edit" onclick="event.stopPropagation(); editarMateria('${materia.id}')">
                    Editar
                </button>
                <button class="btn-delete" onclick="event.stopPropagation(); excluirMateria('${materia.id}')">
                    Excluir
                </button>
            </div>
        `;

        // Define a ação de clique para abrir a matéria
        div.onclick = () => abrirMateria(materia.id);
        
        listaMateriasContainer.appendChild(div);
    });
}

function adicionarMateria() {
    const t = prompt("Nome da matéria:");
    if (t && t.trim()) {
        materias.push({ id: 'sub-' + Date.now(), title: t.trim(), cards: [] });
        salvarDados();
        renderizarMaterias();
    }
}

function editarMateria(id) {
    const m = materias.find(m => m.id === id);
    const novo = prompt("Novo nome:", m.title);
    if (novo && novo.trim()) {
        m.title = novo.trim();
        salvarDados();
        renderizarMaterias();
    }
}

function excluirMateria(id) {
    if (confirm("Excluir matéria e todos os cards?")) {
        materias = materias.filter(m => m.id !== id);
        salvarDados();
        renderizarMaterias();
    }
}

// --- CRUD FLASHCARDS ---
function renderizarFlashcards() {
    listaCardsContainer.innerHTML = '';
    const materia = materias.find(m => m.id === materiaAtivaId);
    
    materia.cards.forEach(card => {
        const container = document.createElement('div');
        container.className = 'flashcard-container';
        
        container.innerHTML = `
            <div class="flashcard-inner" id="inner-${card.id}">
                <div class="flashcard-front">
                    <p><strong>Pergunta:</strong></p>
                    <p>${card.question}</p>
                    <div class="card-actions">
                        <button class="btn-edit" onclick="event.stopPropagation(); editarFlashcard('${card.id}')">✏️</button>
                        <button class="btn-delete" onclick="event.stopPropagation(); excluirFlashcard('${card.id}')">🗑️</button>
                    </div>
                </div>
                <div class="flashcard-back">
                    <p><strong>Resposta:</strong></p>
                    <p>${card.answer}</p>
                </div>
            </div>
        `;

        // Lógica de virar o card
        container.onclick = () => {
            const inner = document.getElementById(`inner-${card.id}`);
            inner.classList.toggle('flipped');
        };

        listaCardsContainer.appendChild(container);
    });
}

function adicionarFlashcard() {
    const p = prompt("Pergunta:");
    const r = prompt("Resposta:");
    if (p && r) {
        const materia = materias.find(m => m.id === materiaAtivaId);
        materia.cards.push({ id: 'card-' + Date.now(), question: p.trim(), answer: r.trim() });
        salvarDados();
        renderizarFlashcards();
    }
}

function editarFlashcard(cardId) {
    const materia = materias.find(m => m.id === materiaAtivaId);
    const card = materia.cards.find(c => c.id === cardId);
    
    const p = prompt("Editar Pergunta:", card.question);
    const r = prompt("Editar Resposta:", card.answer);
    
    if (p && r) {
        card.question = p.trim();
        card.answer = r.trim();
        salvarDados();
        renderizarFlashcards();
    }
}

function excluirFlashcard(cardId) {
    if (confirm("Excluir este flashcard?")) {
        const materia = materias.find(m => m.id === materiaAtivaId);
        materia.cards = materia.cards.filter(c => c.id !== cardId);
        salvarDados();
        renderizarFlashcards();
    }
}

// --- LISTENERS ---
document.getElementById('btn-nova-materia').onclick = adicionarMateria;
document.getElementById('btn-novo-card').onclick = adicionarFlashcard;
document.getElementById('btn-voltar').onclick = voltarParaMaterias;

// Inicialização
renderizarMaterias();