
let abaAtual = "lista";
let editando = null;
let dados = JSON.parse(localStorage.getItem("checklist_dieta")) || {
  "Proteínas": [["🍗", "Frango grelhado", "1.8 kg"]],
  "Carboidratos": [["🍠", "Batata doce", "390 g"]],
  "Outros": [["☕", "Café", "à vontade"]]
};
const cardapio = {
  1: ["Café: Omelete + Aveia", "Almoço: Frango + legumes", "Lanche: Iogurte + chia", "Jantar: Sopa de legumes"],
  2: ["Café: Panqueca", "Almoço: Peixe + batata", "Lanche: Fruta + castanha", "Jantar: Omelete com legumes"]
};
for (let i = 3; i <= 15; i++) {
  cardapio[i] = ["Café: Exemplo", "Almoço: Exemplo", "Lanche: Exemplo", "Jantar: Exemplo"];
}
const frases = [
  "Você não precisa ser perfeito, só começar.",
  "A consistência vence a motivação.",
  "Confie no processo. Ele funciona."
];

function mudarAba(aba) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(aba + "Page").classList.add("active");
  abaAtual = aba;
  if (aba === "planner") trocarDia();
  if (aba === "progresso") atualizarProgresso();
}

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
      div.innerHTML = \`
        <div><input type="checkbox" id="\${cid}" \${localStorage.getItem(cid)==="true"?"checked":""}>
        <label for="\${cid}">\${emoji} \${nome}: \${qtd}</label></div>
        <div><button onclick="editarItem('\${cat}', \${idx})">✏️</button>
        <button onclick="excluirItem('\${cat}', \${idx})">🗑️</button></div>\`;
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
function criarSelectDias() {
  const sel = document.getElementById("diaSelect");
  sel.innerHTML = "";
  for (let i = 1; i <= 15; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = "Dia " + i;
    sel.appendChild(opt);
  }
}
function trocarDia() {
  const dia = parseInt(document.getElementById("diaSelect").value);
  const refDiv = document.getElementById("refeicoesContainer");
  const aguaDiv = document.getElementById("aguaContainer");
  const fraseDiv = document.getElementById("fraseMotivacional");
  const refeicoes = cardapio[dia];
  const feitas = JSON.parse(localStorage.getItem("ref_" + dia)) || [];
  refDiv.innerHTML = "";
  refeicoes.forEach((ref, idx) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = \`<span>\${ref}</span><input type="checkbox" \${feitas[idx] ? "checked" : ""}>\`;
    div.querySelector("input").addEventListener("change", e => {
      feitas[idx] = e.target.checked;
      localStorage.setItem("ref_" + dia, JSON.stringify(feitas));
    });
    refDiv.appendChild(div);
  });
  aguaDiv.innerHTML = "";
  const agua = JSON.parse(localStorage.getItem("agua_" + dia)) || [];
  for (let i = 0; i < 10; i++) {
    const c = document.createElement("div");
    c.className = "copo";
    if (agua[i]) c.classList.add("cheio");
    c.textContent = "💧";
    c.addEventListener("click", () => {
      agua[i] = !agua[i];
      c.classList.toggle("cheio");
      localStorage.setItem("agua_" + dia, JSON.stringify(agua));
    });
    aguaDiv.appendChild(c);
  }
  fraseDiv.textContent = frases[Math.floor(Math.random() * frases.length)];
}
function atualizarProgresso() {
  let totalRef = 0, feitas = 0, totalAgua = 0;
  for (let i = 1; i <= 15; i++) {
    const ref = cardapio[i] || [];
    const marcadas = JSON.parse(localStorage.getItem("ref_" + i)) || [];
    totalRef += ref.length;
    feitas += marcadas.filter(Boolean).length;
    const agua = JSON.parse(localStorage.getItem("agua_" + i)) || [];
    totalAgua += agua.filter(Boolean).length;
  }
  const pct = Math.round((feitas / totalRef) * 100);
  document.querySelector(".barra").style.width = pct + "%";
  document.getElementById("resumoProgresso").innerHTML =
    \`Refeições feitas: \${feitas} / \${totalRef}<br>Copos de água: \${totalAgua} / \${15 * 10}\`;
}

// Inicialização
mudarAba("lista");
renderChecklist();
criarSelectDias();
