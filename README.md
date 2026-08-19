# Flashcards Prompt Engineering — Flashcards de Estudo

> Trabalho Prático — Engenharia de Prompt e Contexto na Prática

## 1. Integrantes do grupo

| Nome | RA |
|---|---|
| Gabrielle Morente Perna | 23217729-2 |
| Karen Tanaka | 23026540-2 |
| Leonardo Leitão Souza | 23020085-2 |
| Antonio Ferreira de Lima | 23038173-2 |

## 2. Descrição do projeto

- **O que é:** um site de flashcards para revisão de conteúdo de estudo. O usuário entra no site e pode gerenciar suas próprias disciplinas/matérias (criar, visualizar, editar e excluir), e dentro de cada matéria criar, visualizar, editar e excluir os flashcards correspondentes.
  
- **Opção escolhida:** Projeto de estudo de outra disciplina.
  
- **Problema que resolve:** melhora e facilita a revisão de tópicos importantes de qualquer matéria, organizando o conteúdo em formato de pergunta e resposta.
  
- **Principais funcionalidades:**
  - CRUD completo de matérias/disciplinas (criar, listar, editar, excluir).
  - Dentro de cada matéria, CRUD completo de flashcards (criar cartão com pergunta e resposta, listar, editar, excluir).
  - Modo de revisão com efeito de "flip" do cartão: o usuário vê a pergunta, tenta responder mentalmente e vira o card pra conferir a resposta.

---

## 3. System prompt usado

<img width="956" height="1280" alt="image" src="https://github.com/user-attachments/assets/2e6556e9-c053-467d-bb83-31896416257e" />


**Justificativa:** 
Escolhemos o HTML/CSS/JS puro em vez de um framework porque simplifica o deploy (sem build step, sem configuração de base para GitHub Pages). Pedimos explicitamente código comentado e gerado em partes pequenas porque isso também favorece esse mesmo objetivo: acompanhar a lógica passo a passo em vez de receber um bloco grande e opaco de código.

---

## 4. Técnica de prompt engineering aplicada

<!-- Escolher: few-shot OU chain-of-thought (ou ambas, se aplicaram). -->

- **Técnica escolhida:** Chain-of-thought (cadeia de raciocínio).
  
- **Por que essa técnica ajuda nesse caso específico:** A técnica foi utilizada para orientar o desenvolvimento do projeto de forma estruturada, fazendo com que a IA analisasse os requisitos e dividisse a implementação em etapas menores antes de gerar o código. Isso foi importante porque o sistema possui funcionalidades relacionadas entre si, como matérias e flashcards, além das operações de criar, listar, editar e excluir.
Ao solicitar que a IA organizasse o problema em etapas, foi possível desenvolver primeiro a estrutura dos dados e, posteriormente, implementar as funcionalidades de forma gradual. Isso também facilitou a compreensão do código gerado pelo grupo, evitando receber uma implementação completa e complexa de uma única vez.
Dessa forma, a técnica contribuiu principalmente para organizar a implementação, reduzir a complexidade das tarefas e facilitar a compreensão do código gerado.

- **Evidência (print):** [inserir print do prompt sendo usado + resposta obtida]

---

## 5. Teste de curadoria de contexto

### Versão A — arquivo/trecho inteiro colado no prompt

Alteração solicitada: Alterar a função renderizarMaterias.

```

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
    listaMateriasContainer.innerHTML = '';
    materias.forEach(materia => {
        const div = document.createElement('div');
        div.className = 'materia-card';
        div.innerHTML = `
            <h3>${materia.title}</h3>
            <span>${materia.cards.length} flashcards</span>
            <div class="materia-actions">
                <button class="btn-edit" onclick="event.stopPropagation(); editarMateria('${materia.id}')">Editar</button>
                <button class="btn-delete" onclick="event.stopPropagation(); excluirMateria('${materia.id}')">Excluir</button>
            </div>
        `;
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
```

- Tokens de entrada: 2875
- Tokens de saída: 1624
- Evidência (print): <img width="1280" height="1094" alt="image" src="https://github.com/user-attachments/assets/b680384d-9c5e-4ddb-82cd-feaf4e70e22c" />


### Versão B — apenas o trecho relevante

```
Aqui está a função do meu projeto que renderiza a lista de matérias
na tela inicial:

function renderizarMaterias() {
listaMateriasContainer.innerHTML = ";
materias.forEach(materia > {
const div = document.createElement('div');
div.className = 'materia-card';
div.innerHTML =
<h3>${materia. title}</h3> <span>${materia.cards.length} flashcards</span> <div class="materia-actions">
<button class="btn-edit" onclick="event. stopPropagation();
editarMateria('${materia.id}')">Editar</button> <button class="btn-delete"
onclick="event. stopPropagation(); excluirMateria('${materia.id}')">Excluir</button> </div>

div.onclick = () abrirMateria(materia.id);
listaMateriasContainer.appendChild(div);
});

Adicione uma contagem mostrando quantos flashcards existem no total
dentro de cada matéria, exibida no card da matéria na tela de listagem.

```

- Tokens de entrada: 250
- Tokens de saída: 1465
- Evidência (print): <img width="1600" height="1364" alt="image" src="https://github.com/user-attachments/assets/64bd6331-1b4e-4782-be37-bbe7c3ef2e11" />


### Comparação

| Versão | Tokens input | Tokens output | Diferença |
|---|---|---|---|
| A — arquivo inteiro | 2.875 | 1.624 | — |
| B — trecho relevante | 250 | 1.465 | 91,30% menos tokens de entrada |

**Conclusão:** 

A versão B, que utilizou apenas o trecho relevante do código, consumiu 250 tokens de entrada, enquanto a versão A, que utilizou o arquivo inteiro, consumiu 2.875 tokens. Isso representa uma redução de aproximadamente 91,30% nos tokens de entrada, demonstrando que a curadoria do contexto pode diminuir significativamente a quantidade de informações enviadas para a IA.

Além disso, a versão B também apresentou uma redução nos tokens de saída, passando de 1.624 para 1.465 tokens. Considerando entrada e saída, a versão A utilizou 4.499 tokens no total, enquanto a versão B utilizou 1.715 tokens, uma redução total de aproximadamente 61,84%.

Esse teste mostra que fornecer somente o contexto necessário para realizar uma alteração torna a chamada mais econômica e evita enviar informações do projeto que não são relevantes para a tarefa solicitada.

## 6. Tabela de chamadas (tokens e custo)

<!-- Fórmula: custo = (tokens_input/1_000_000)*preço_input + (tokens_output/1_000_000)*preço_output -->

| # | Descrição da chamada | Tokens input | Tokens output | Custo input | Custo output | Custo total |
|---|---|---|---|---|---|---|
| 1 | Modelagem de dados (chain-of-thought) | 354 | 1.464 | $0,00 | $0,00 | $0,00 |
| 2 | Listagem de matérias (HTML/CSS/JS base) | 242 | 2.998 | $0,00 | $0,01 | $0,01 |
| 3 | CRUD editar/excluir matéria | 396 | 4.770 | $0,00 | $0,01 | $0,01 |
| 4 | Tela de flashcards da matéria | 647 | 7.678 | $0,00 | $0,02 | $0,02 |
| 5 | Flip + editar/excluir flashcard (código completo) | 877 | 11.259 | $0,00 | $0,03 | $0,03 |
| **Total** | — | **2.516** | **28.169** | **$0,00** | **$0,08** | **$0,09** |

- **Modelo usado:** Gemini 3 flash preview
  
- **Preço input/output usado (tabela oficial):** Gemini 3 flash preview
- **Free tier?** Sim — usamos o acesso gratuito do Gemini 3 flash preview para gerar as chamadas. O custo acima é hipotético, calculado como se fosse cobrado pela API paga, conforme pedido no enunciado.
- **Custo total da sessão:** US$ 0,09 (≈ R$ 0,47, cotação de 19/08/2026: US$ 1 = R$ 5,20).
  
- **Evidência (print):**
   1. **Modelagem de dados (chain-of-thought)**
      Antes de gerar qualquer código, quero que você pense em voz alta: como você estruturaria os dados de matérias e flashcards em JSON, considerando que eu
      preciso criar, editar e excluir tanto matérias quanto flashcards, e que cada flashcard precisa guardar pergunta, resposta e um identificador único? Explique
      o raciocínio antes de me dar a estrutura final.
      <img width="1280" height="626" alt="image" src="https://github.com/user-attachments/assets/f07eb6cd-8e41-4330-ba4d-6361e29845cf" />

   2. **Listagem de matérias (HTML/CSS/JS base)**
      Com base na estrutura de dados que você definiu, gere agora:
      1.  O HTML básico da página (head + body com um container principal).
      2.  O CSS mínimo para exibir uma lista de "matérias" como cards/cartões na tela inicial, com um botão de "Nova matéria" no topo.
      3.  O JavaScript para: guardar as matérias no localStorage, renderizar a lista na tela ao carregar a página, e criar uma nova matéria quando o botão for
          clicado (pedindo o título via prompt() por enquanto, depois melhoramos isso).
      <img width="1280" height="1101" alt="image" src="https://github.com/user-attachments/assets/487d0df3-a876-4730-b6b6-7a910fbe1dab" />
      
   3. **CRUD editar/excluir matéria**
      Agora adicione, na tela de listagem de matérias que você já gerou:
        1.  Um botão de "editar" em cada card de matéria, que permite renomear o título
            (pode usar prompt() por enquanto, como fizemos na criação).
        2.  Um botão de "excluir" em cada card de matéria, que remove a matéria e todos
            os seus flashcards, pedindo confirmação antes com confirm().
        3.  Atualize o localStorage e a renderização da lista após cada ação, sem
            precisar recarregar a página.
      Não mude a estrutura de dados nem o código de criação de matéria que já existe
      só adicione essas duas funcionalidades.
      <img width="1280" height="1252" alt="image" src="https://github.com/user-attachments/assets/52cd28d8-eb02-493b-af22-e240f40e2db4" />

   4. **Tela de flashcards da matéria**
       Agora crie a tela que aparece ao clicar em uma matéria da listagem, mostrando os
      flashcards daquela matéria específica. Nessa tela:
      
      1.  Exiba o título da matéria no topo, com um botão de "Voltar" para a listagem
          de matérias.
      2.  Liste os flashcards daquela matéria, mostrando por enquanto só a pergunta de
          cada um (a resposta ainda não precisa aparecer nessa tela — isso fica pro
          componente de flip que vamos fazer depois).
      3.  Adicione um botão de "Novo flashcard" que pede a pergunta e a resposta (via
          prompt(), como fizemos antes) e salva no array "cards" daquela matéria no
          localStorage.
      4.  Pode usar uma navegação simples por JavaScript (esconder a tela de listagem
          de matérias e mostrar a tela da matéria selecionada), sem precisar de rotas
          de verdade nem framework.
      Não mude o código de criação/edição/exclusão de matéria que já existe só
      adicione a navegação e essa nova tela. Apenas envie todo o código completo
      atualizado com os novos códigos gerados.

      <img width="1600" height="1574" alt="image" src="https://github.com/user-attachments/assets/35f22568-3c9c-4d82-87a5-7b83c30699b5" />


   5. **Flip + editar/excluir flashcard**
      Agora implemente a animação de "virar" (flip) no flashcard, dentro da tela da
      matéria:
      1.  Ao clicar em um flashcard da lista, ele deve virar em 3D (CSS transform:
          rotateY) revelando a resposta no verso. Clicar de novo volta pra mostrar a
          pergunta.
      2.  Adicione um botão de "editar" e um de "excluir" em cada flashcard (excluir
          com confirm() antes, como fizemos com matéria).
      3.  Editar pode reabrir prompt() pra alterar pergunta e resposta, atualizando o
          localStorage.
      Não altere a lógica ou estrutura de código já existente (navegação, CRUD de
      matéria, criação de flashcard) — apenas adicione essas funcionalidades novas.
      Me envie o código COMPLETO e ATUALIZADO dos três arquivos (HTML, CSS e JS), já
      integrando o que foi pedido agora com tudo que já existia, para eu substituir os
      arquivos inteiros de uma vez.
      Ainda não implemente a tela de dentro da matéria nem os flashcards só a listagem
      de matérias por enquanto.

      <img width="1600" height="1574" alt="image" src="https://github.com/user-attachments/assets/7d3a5d2a-bea9-4384-847b-1c220774e8a0" />

---

## 7. Link da URL publicada

- **URL:** https://leoleitao13.github.io/flashcards-prompt-engineering/

---



