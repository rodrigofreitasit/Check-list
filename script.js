
// Dados iniciais da lista de compras automática baseada nos cardápios
let dados = JSON.parse(localStorage.getItem("checklist_dieta")) || {
  "Proteínas": [["🍗", "Frango grelhado", "2 kg"], ["🥚", "Ovos", "30 unidades"]],
  "Carboidratos": [["🍚", "Arroz integral", "1.5 kg"], ["🥔", "Batata doce", "1 kg"]],
  "Verduras e Legumes": [["🥦", "Brócolis", "2 maços"], ["🥕", "Cenoura", "4 unidades"]],
  "Frutas": [["🍌", "Banana", "8 unidades"], ["🍎", "Maçã", "6 unidades"]],
  "Outros": [["🧂", "Chia", "100g"], ["☕", "Chá de camomila", "1 caixa"]]
};

const frases = [
  "Você não precisa ser perfeito, só precisa começar.",
  "A consistência vence a motivação.",
  "Cada refeição saudável é um passo rumo ao seu objetivo.",
  "Você é mais forte do que imagina.",
  "Confie no processo. Ele funciona."
];

const cardapio = {1: ["Almoço: 3 col. arroz, 1 concha feijão, 1 bife grelhado, 1 col. cenoura cozida", "Lanche: 1 iogurte desnatado + 1 banana", "Jantar: 2 ovos mexidos, 1 fatia pão integral, 1 xícara chá de camomila"], 2: ["Almoço: 4 col. arroz integral, 1 concha lentilha, frango grelhado, salada de alface e tomate", "Lanche: 1 barra de proteína + 1 maçã", "Jantar: sopa de legumes + 2 torradas integrais"], 3: ["Almoço: purê de batata doce, carne moída refogada, brócolis no vapor", "Lanche: vitamina com leite desnatado, morango e aveia", "Jantar: omelete com legumes + 1 torrada integral"], 4: ["Almoço: arroz, feijão, posta de peixe assado, couve refogada", "Lanche: iogurte + semente de chia", "Jantar: sopa de abóbora + 1 fatia pão integral"], 5: ["Almoço: salada variada, arroz integral, filé de frango", "Lanche: banana + pasta de amendoim", "Jantar: omelete com espinafre + chá de ervas"], 6: ["Almoço: massa integral com carne moída ao molho de tomate, salada verde", "Lanche: fruta + 10 castanhas", "Jantar: sopa de legumes com frango desfiado"], 7: ["Almoço: arroz integral, lentilha, filé de peixe, cenoura ralada", "Lanche: iogurte natural com granola", "Jantar: ovos cozidos, pão integral, salada"], 8: ["Almoço: purê de mandioquinha, carne grelhada, vagem cozida", "Lanche: shake proteico", "Jantar: sopa de legumes + pão integral"], 9: ["Almoço: arroz, feijão, peito de frango, mix de folhas verdes", "Lanche: maçã + semente de linhaça", "Jantar: omelete + chá de camomila"], 10: ["Almoço: macarrão integral com atum, salada crua", "Lanche: banana + aveia", "Jantar: sopa detox + 2 torradas"], 11: ["Almoço: arroz integral, feijão, carne grelhada, brócolis no vapor", "Lanche: vitamina + pão integral", "Jantar: omelete + chá"], 12: ["Almoço: arroz, lentilha, frango desfiado, salada verde", "Lanche: barra de proteína + fruta", "Jantar: sopa com legumes e ovos"], 13: ["Almoço: purê de batata, carne moída, cenoura ralada", "Lanche: iogurte com granola", "Jantar: ovo mexido + pão integral + chá"], 14: ["Almoço: arroz, feijão, peixe grelhado, espinafre refogado", "Lanche: shake com proteína vegetal", "Jantar: sopa de legumes e batata"], 15: ["Almoço: arroz integral, frango grelhado, salada de rúcula e cenoura", "Lanche: fruta + chia", "Jantar: omelete com tomate + chá"]};
for (let i = 3; i <= 15; i++) {
  cardapio[i] = ["Almoço: Exemplo", "Lanche: Exemplo", "Jantar: Exemplo"];
}

function mudarAba(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active", "hidden"));
  document.getElementById(id).classList.add("active");
  if (id === "progresso") atualizarProgresso();
  if (id === "compras") renderChecklist();
}

let diaAtual = 1;
function trocarDia() {
  diaAtual = parseInt(document.getElementById("diaSelect").value);
  carregarRefeicoes();
  carregarAgua();
  carregarFrase();
}
function criarSelectDias() {
  const sel = document.getElementById("diaSelect");
  for (let i = 1; i <= 15; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = "Dia " + i;
    sel.appendChild(opt);
  }
}
function carregarFrase() {
  document.getElementById("fraseMotivacional").textContent = frases[Math.floor(Math.random() * frases.length)];
}
function carregarRefeicoes() {
  const container = document.getElementById("refeicoesContainer");
  container.innerHTML = "";
  const refeicoes = cardapio[diaAtual];
  const feitas = JSON.parse(localStorage.getItem("ref_" + diaAtual)) || [];
  refeicoes.forEach((ref, idx) => {
    const div = document.createElement("div");
    div.className = "refeicao";
    div.innerHTML = `<span>${ref}</span><input type="checkbox" ${feitas[idx] ? "checked" : ""}>`;
    div.querySelector("input").addEventListener("change", e => {
      feitas[idx] = e.target.checked;
      localStorage.setItem("ref_" + diaAtual, JSON.stringify(feitas));
    });
    container.appendChild(div);
  });
}
function carregarAgua() {
  const agua = JSON.parse(localStorage.getItem("agua_" + diaAtual)) || [];
  const container = document.getElementById("aguaContainer");
  container.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const copo = document.createElement("div");
    copo.className = "copo";
    if (agua[i]) copo.classList.add("cheio");
    copo.textContent = "💧";
    copo.addEventListener("click", () => {
      agua[i] = !agua[i];
      localStorage.setItem("agua_" + diaAtual, JSON.stringify(agua));
      copo.classList.toggle("cheio");
    });
    container.appendChild(copo);
  }
}
function atualizarProgresso() {
  let total = 0, feitas = 0, totalAgua = 0, diasOk = 0;
  for (let i = 1; i <= 15; i++) {
    const refs = cardapio[i];
    const marcadas = JSON.parse(localStorage.getItem("ref_" + i)) || [];
    const agua = JSON.parse(localStorage.getItem("agua_" + i)) || [];
    total += refs.length;
    feitas += marcadas.filter(Boolean).length;
    totalAgua += agua.filter(Boolean).length;
    if (marcadas.length === refs.length && marcadas.every(v => v)) diasOk++;
  }
  const pct = Math.round((feitas / total) * 100);
  document.querySelector(".barra").style.width = pct + "%";
  document.getElementById("resumoProgresso").innerHTML =
    `Refeições feitas: ${feitas}/${total}<br>` +
    `Copos de água: ${totalAgua}/150<br>` +
    `Dias completos: ${diasOk}/15`;
}

// Checklist de compras
let editando = null;
function renderChecklist() {
  const container = document.getElementById("checklistContainer");
  container.innerHTML = "";
  let id = 0;
  for (const [cat, itens] of Object.entries(dados)) {
    const h2 = document.createElement("h2");
    h2.textContent = cat;
    container.appendChild(h2);
    itens.forEach(([emoji, nome, qtd], idx) => {
      const cid = `item_${cat}_${idx}`;
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div><input type="checkbox" id="${cid}" ${localStorage.getItem(cid)==="true"?"checked":""}>
        <label for="${cid}">${emoji} ${nome}: ${qtd}</label></div>
        <div><button onclick="editarItem('${cat}', ${idx})">✏️</button>
        <button onclick="excluirItem('${cat}', ${idx})">🗑️</button></div>`;
      div.querySelector("input").addEventListener("change", e => {
        localStorage.setItem(cid, e.target.checked);
      });
      container.appendChild(div);
    });
  }
}
function marcarTodos() {
  document.querySelectorAll("#checklistContainer input[type='checkbox']").forEach(cb => {
    cb.checked = true;
    localStorage.setItem(cb.id, "true");
  });
}
function desmarcarTodos() {
  document.querySelectorAll("#checklistContainer input[type='checkbox']").forEach(cb => {
    cb.checked = false;
    localStorage.setItem(cb.id, "false");
  });
}
function abrirPopup() {
  editando = null;
  document.getElementById("popup").style.display = "flex";
  document.getElementById("newEmoji").value = "";
  document.getElementById("newName").value = "";
  document.getElementById("newQtd").value = "";
}
function fecharPopup() {
  document.getElementById("popup").style.display = "none";
}
function salvarItem() {
  const emoji = document.getElementById("newEmoji").value || "📝";
  const nome = document.getElementById("newName").value;
  const qtd = document.getElementById("newQtd").value;
  const cat = document.getElementById("newCategoria").value;
  if (!nome || !qtd) return alert("Preencha os campos");
  if (editando) dados[editando[0]].splice(editando[1], 1);
  dados[cat] = dados[cat] || [];
  dados[cat].push([emoji, nome, qtd]);
  localStorage.setItem("checklist_dieta", JSON.stringify(dados));
  fecharPopup();
  renderChecklist();
}
function editarItem(cat, idx) {
  const [emoji, nome, qtd] = dados[cat][idx];
  document.getElementById("newEmoji").value = emoji;
  document.getElementById("newName").value = nome;
  document.getElementById("newQtd").value = qtd;
  document.getElementById("newCategoria").value = cat;
  editando = [cat, idx];
  document.getElementById("popup").style.display = "flex";
}
function excluirItem(cat, idx) {
  if (confirm("Deseja excluir?")) {
    dados[cat].splice(idx, 1);
    localStorage.setItem("checklist_dieta", JSON.stringify(dados));
    renderChecklist();
  }
}

// Inicialização
mudarAba("planner");
criarSelectDias();
trocarDia();
renderChecklist();
