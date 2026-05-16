// ══════════════════════════════════════════════════════════
//  CAMPUS DO CAOS — INTERFACE v2.0
// ══════════════════════════════════════════════════════════

// ── NOTIFICAÇÕES ──────────────────────────────────────────
let _notifTimer = null;

function notificar(msg, duracao, tipo) {
    duracao = duracao || 2800;
    const el = document.getElementById("notificacao");
    if (!el) return;
    el.textContent = msg;
    el.className = "visivel";
    if (tipo === "erro")    el.classList.add("notif-erro");
    if (tipo === "vitoria") el.classList.add("notif-vitoria");
    clearTimeout(_notifTimer);
    _notifTimer = setTimeout(() => {
        el.className = "";
    }, duracao);
}

// ── LOG DE COMBATE ────────────────────────────────────────
function addLog(msg) {
    const log = document.getElementById("log-combate");
    if (!log) return;
    const linha = document.createElement("div");
    linha.textContent = "› " + msg;
    log.prepend(linha);
    while (log.children.length > 8) log.removeChild(log.lastChild);
}

// ── HELPER: CLASSE DE FACÇÃO ─────────────────────────────
function classesFaccao(faccao) {
    const map = {
        "Resistência": "fac-resistencia",
        "Exército":    "fac-exercito",
        "Neutros":     "fac-neutros",
        "Jubilados":   "fac-jubilados"
    };
    return map[faccao] || "";
}

// ── ATUALIZAR INTERFACE ───────────────────────────────────
function atualizarInterface() {
    const vInimigo = document.getElementById("vidaInimigo");
    const mVida    = document.getElementById("minhaVida");
    const mClock   = document.getElementById("meuClock");
    if (vInimigo) vInimigo.innerText = vidaInimigo;
    if (mVida)    mVida.innerText    = minhaVida;
    if (mClock)   mClock.innerText   = meuClock;

    if (typeof terrenoAtual !== 'undefined') {
        const nTerreno = document.getElementById("nomeTerreno");
        const eTerreno = document.getElementById("efeitoTerreno");
        if (nTerreno) nTerreno.innerText = terrenoAtual.nome;
        if (eTerreno) eTerreno.innerText = terrenoAtual.desc;
    }

    renderizarMao();
    renderizarMaoInimigo();
    renderizarCampo();
}

// ── MÃO DO JOGADOR ────────────────────────────────────────
function renderizarMao() {
    const divMao = document.getElementById("minha-mao");
    if (!divMao) return;
    divMao.innerHTML = "";

    minhaMao.forEach((carta, index) => {
        let btn = document.createElement("button");
        const podePagar = meuClock >= carta.custo;
        btn.className = "carta-mao " + classesFaccao(carta.faccao) + (podePagar ? "" : " sem-clock");

        btn.innerHTML =
            '<div>' +
                '<div class="carta-nome">' + carta.nome + '</div>' +
                '<div class="carta-faccao">' + carta.faccao + ' · ' + carta.nivel + '</div>' +
            '</div>' +
            '<div class="carta-custo">' + carta.custo + '</div>' +
            '<div class="carta-footer">' +
                '<span class="c-atk">⚔' + carta.ataque + '</span>' +
                '<span class="c-hp">♥' + carta.vida + '</span>' +
            '</div>';

        btn.title = (carta.habilidade ? carta.habilidade + '\n' : '') +
                    'Custo: ' + carta.custo + ' | ATK: ' + carta.ataque + ' | HP: ' + carta.vida;

        btn.onclick = (function(i) { return function() { tentarJogarNoCampo(i); }; })(index);
        divMao.appendChild(btn);
    });
}

// ── MÃO DO INIMIGO (VERSO) ───────────────────────────────
function renderizarMaoInimigo() {
    const div = document.getElementById("mao-inimigo");
    if (!div) return;
    div.innerHTML = "";
    maoInimigo.forEach(() => {
        let d = document.createElement("div");
        d.className = "carta-mao carta-verso";
        div.appendChild(d);
    });
}

// ── CAMPOS DE BATALHA ─────────────────────────────────────
function renderizarCampo() {
    renderizarCampoInimigo();
    renderizarCampoJogador();
}

function renderizarCampoInimigo() {
    const div = document.getElementById("campo-inimigo");
    if (!div) return;
    div.innerHTML = '<span class="label-area">CARTAS NO CAMPO — INIMIGO</span>';

    campoInimigo.forEach(function(slot) {
        let d = document.createElement("div");
        d.className = slot ? "slot-campo ocupado " + classesFaccao(slot.faccao) : "slot-campo";
        if (slot) {
            d.innerHTML =
                '<div class="slot-nome">' + slot.nome + '</div>' +
                '<div class="slot-nivel">' + slot.nivel + '</div>' +
                '<div class="slot-stats">' +
                    '<span class="slot-atk">⚔' + slot.ataque + '</span>' +
                    '<span class="slot-hp">♥' + slot.vida + '</span>' +
                '</div>';
        } else {
            d.innerHTML = '<span style="font-size:16px;opacity:0.12;color:var(--verde)">⬡</span>';
        }
        div.appendChild(d);
    });
}

function renderizarCampoJogador() {
    const div = document.getElementById("campo-batalha");
    if (!div) return;
    div.innerHTML = '<span class="label-area">SEU CAMPO — clique para atacar</span>';

    meuCampo.forEach(function(slot, index) {
        let d = document.createElement("div");
        const jaAtacou = cartasJaAtacaram.includes(index);
        d.className = slot
            ? "slot-campo ocupado " + (jaAtacou ? "exausto " : "") + classesFaccao(slot.faccao)
            : "slot-campo";

        if (slot) {
            let atkReal = (typeof calcularAtaqueReal === 'function') ? calcularAtaqueReal(slot) : slot.ataque;
            let modificado = atkReal !== slot.ataque;

            d.innerHTML =
                '<div class="slot-nome">' + slot.nome + '</div>' +
                '<div class="slot-nivel">' + slot.nivel + '</div>' +
                '<div class="slot-stats">' +
                    '<span class="slot-atk" style="' + (modificado ? 'color:var(--amarelo)' : '') + '">⚔' + atkReal + '</span>' +
                    '<span class="slot-hp">♥' + slot.vida + '</span>' +
                '</div>';

            if (jaAtacou) {
                d.title = slot.nome + " — EXAUSTO";
            } else {
                d.title = (slot.habilidade || "") + "\nClique para atacar";
                d.onclick = (function(i) { return function() { atacarComSlot(i); }; })(index);
            }
        } else {
            d.innerHTML = '<span style="font-size:16px;opacity:0.12;color:var(--verde)">⬡</span>';
        }
        div.appendChild(d);
    });
}
