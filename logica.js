// ══════════════════════════════════════════════════════════
//  CAMPUS DO CAOS — LÓGICA v2.0 (BALANCEADA)
// ══════════════════════════════════════════════════════════

let minhaVida   = 30;
let vidaInimigo = 30;
let meuClock    = 4;       // começa com 4, +1 por turno
let meuCampo    = [null, null, null, null, null];
let campoInimigo = [null, null, null, null, null];
let minhaMao    = [];
let maoInimigo  = [];
let meuBaralho  = [];
let cartasJaAtacaram = [];
let turnoAtual  = 1;

// ── BARALHO ──────────────────────────────────────────────

function prepararBaralho() {
    meuBaralho = [];
    for (let i = 0; i < 30; i++) {
        let carta = bancoDeCartas[Math.floor(Math.random() * bancoDeCartas.length)];
        meuBaralho.push({ ...carta, vidaMax: carta.vida });
    }
}

// ── CÁLCULO DE ATAQUE COM TERRENO ────────────────────────

function calcularAtaqueReal(carta) {
    if (typeof terrenoAtual === 'undefined') return carta.ataque;
    let bonus = 0;
    const t = terrenoAtual;

    // Buff/nerf por facção
    if (t.buff) {
        if (Array.isArray(t.buff) ? t.buff.includes(carta.faccao) : t.buff === carta.faccao) {
            bonus += (t.buffBonus !== undefined ? t.buffBonus : 2);
        }
    }
    if (t.nerf) {
        if (Array.isArray(t.nerf) ? t.nerf.includes(carta.faccao) : t.nerf === carta.faccao) {
            bonus += (t.nerfBonus !== undefined ? t.nerfBonus : -2);
        }
    }

    // Buff/nerf por nível
    if (t.buffNivel) {
        if (Array.isArray(t.buffNivel) ? t.buffNivel.includes(carta.nivel) : t.buffNivel === carta.nivel) {
            bonus += 1;
        }
    }
    if (t.nerfNivel && t.nerfNivel.includes(carta.nivel)) {
        bonus -= 1;
    }

    // Buff geral
    if (t.buffGeral) bonus += t.buffGeral;

    return Math.max(0, carta.ataque + bonus);
}

// ── ATACAR ────────────────────────────────────────────────

function atacarComSlot(indexSlot) {
    // Terreno "O Site Caiu" bloqueia todos os ataques
    if (terrenoAtual && terrenoAtual.bloqueiaAtaque) {
        notificar("O SITE CAIU — ataques bloqueados este turno!", 2500, "erro");
        return;
    }

    let minhaCarta = meuCampo[indexSlot];
    if (!minhaCarta) return;

    if (cartasJaAtacaram.includes(indexSlot)) {
        notificar(minhaCarta.nome + " já atacou este turno!", 2200, "erro");
        return;
    }

    let dano = calcularAtaqueReal(minhaCarta);
    cartasJaAtacaram.push(indexSlot);

    // Atualiza visual: carta exausta
    atualizarInterface();

    let indexAlvo = campoInimigo.findIndex(s => s !== null);

    if (indexAlvo !== -1) {
        let alvo = campoInimigo[indexAlvo];
        let danoFinal = Math.max(1, dano);
        alvo.vida -= danoFinal;
        addLog(minhaCarta.nome + " → " + alvo.nome + " [" + danoFinal + " dmg]");
        notificar("⚔ " + minhaCarta.nome + " causou " + danoFinal + " dano em " + alvo.nome + "!");

        if (alvo.vida <= 0) {
            addLog("✝ " + alvo.nome + " foi destruído!");
            campoInimigo[indexAlvo] = null;
        }
    } else {
        // Ataque direto
        vidaInimigo -= dano;
        addLog("⚡ Ataque direto! " + dano + " dano ao oponente.");
        notificar("⚡ ATAQUE DIRETO — " + dano + " de dano!");
    }

    atualizarInterface();
    checarFimDeJogo();
}

// ── JOGAR CARTA ───────────────────────────────────────────

function tentarJogarNoCampo(indexMao) {
    let carta = minhaMao[indexMao];
    if (!carta) return;

    if (meuClock < carta.custo) {
        notificar("Clock insuficiente! Custo: " + carta.custo + " | Você tem: " + meuClock, 2500, "erro");
        return;
    }

    let slotDestino = -1;

    if (carta.nivel === "BASE") {
        slotDestino = meuCampo.indexOf(null);
        if (slotDestino === -1) {
            notificar("Campo lotado! Sem espaço para novas cartas BASE.", 2500, "erro");
            return;
        }
    } else {
        // Evolução: precisa de carta anterior na trilha
        if (carta.evoluiDe) {
            slotDestino = meuCampo.findIndex(s => s && s.nome === carta.evoluiDe);
            if (slotDestino === -1) {
                notificar("Requer '" + carta.evoluiDe + "' no campo para evoluir!", 2800, "erro");
                return;
            }
        } else {
            slotDestino = meuCampo.indexOf(null);
        }
    }

    if (slotDestino === -1) {
        notificar("Sem espaço ou pré-requisito ausente no campo.", 2500, "erro");
        return;
    }

    meuClock -= carta.custo;
    meuCampo[slotDestino] = { ...carta, vidaMax: carta.vida };
    minhaMao.splice(indexMao, 1);
    addLog("+ " + carta.nome + " entrou no campo!");
    notificar("✦ " + carta.nome + " invocado!");
    atualizarInterface();
}

// ── COMPRAR CARTAS ────────────────────────────────────────

function comprarCartas(qtd) {
    let compradas = 0;
    for (let i = 0; i < qtd; i++) {
        if (minhaMao.length < 10 && meuBaralho.length > 0) {
            minhaMao.push(meuBaralho.shift());
            compradas++;
        }
    }
    if (typeof atualizarInterface === 'function') atualizarInterface();
    return compradas;
}

function comprarCartasInimigo(qtd) {
    for (let i = 0; i < qtd; i++) {
        if (maoInimigo.length < 8) {
            let carta = bancoDeCartas[Math.floor(Math.random() * bancoDeCartas.length)];
            maoInimigo.push({ ...carta, vidaMax: carta.vida });
        }
    }
}

// ── IA DO OPONENTE ────────────────────────────────────────

function turnoIA() {
    comprarCartasInimigo(1);

    // IA tenta jogar cartas (prefere BASE primeiro, depois evolução)
    let tentativas = Math.min(2, maoInimigo.length);
    for (let t = 0; t < tentativas; t++) {
        let slotVazio = campoInimigo.indexOf(null);
        if (slotVazio === -1) break;

        // Tenta BASE primeiro
        let idx = maoInimigo.findIndex(c => c.nivel === "BASE");
        if (idx === -1) idx = 0;

        let carta = maoInimigo.splice(idx, 1)[0];
        campoInimigo[slotVazio] = carta;
        addLog("Inimigo invocou " + carta.nome + "!");
    }

    // IA ataca — usa a carta com maior ATK
    let cartasIA = campoInimigo.map((c, i) => ({ c, i })).filter(x => x.c !== null);
    cartasIA.sort((a, b) => b.c.ataque - a.c.ataque);

    cartasIA.forEach(({ c: cartaIA, i: slotIA }) => {
        if (terrenoAtual && terrenoAtual.bloqueiaAtaque) return;

        let meuSlot = meuCampo.findIndex(s => s !== null);
        if (meuSlot !== -1) {
            let alvo = meuCampo[meuSlot];
            let dano = Math.max(1, cartaIA.ataque);
            alvo.vida -= dano;
            addLog(cartaIA.nome + " → " + alvo.nome + " [" + dano + " dmg]");
            if (alvo.vida <= 0) {
                addLog("✝ " + alvo.nome + " destruído!");
                meuCampo[meuSlot] = null;
            }
        } else {
            let dano = Math.max(1, cartaIA.ataque);
            minhaVida -= dano;
            addLog(cartaIA.nome + " causou " + dano + " dano direto a você!");
        }
    });
}

// ── PASSAR TURNO ──────────────────────────────────────────

function passarTurno() {
    const btn = document.getElementById("btnPassar");
    if (btn) btn.disabled = true;

    notificar("Turno do Oponente...", 1200);

    setTimeout(function () {
        turnoIA();

        setTimeout(function () {
            turnoAtual++;

            // Ressorteia terreno a cada 3 turnos
            if (turnoAtual % 3 === 0 && typeof listaTerrenos !== 'undefined') {
                let novo = listaTerrenos[Math.floor(Math.random() * listaTerrenos.length)];
                if (novo.nome !== terrenoAtual.nome) {
                    terrenoAtual = novo;
                    addLog("🌍 Terreno mudou: " + terrenoAtual.nome);
                    notificar("⚠ TERRENO: " + terrenoAtual.nome, 2500);
                }
            }

            // Clock cresce gradualmente
            let clockBonus = Math.min(turnoAtual, 4); // máx +4 por turno
            meuClock += clockBonus;

            cartasJaAtacaram = [];
            comprarCartas(2);

            if (btn) btn.disabled = false;
            notificar("Seu turno! +" + clockBonus + " Clock · +2 Cartas", 2500);
            atualizarInterface();
            checarFimDeJogo();
        }, 900);
    }, 1300);
}

// ── FIM DE JOGO ───────────────────────────────────────────

function checarFimDeJogo() {
    if (vidaInimigo <= 0) {
        notificar("✦ VITÓRIA! O Campus é seu! ✦", 6000, "vitoria");
        setTimeout(() => location.reload(), 6000);
    }
    if (minhaVida <= 0) {
        notificar("✝ JUBILADO! Você foi reprovado. ✝", 6000, "erro");
        setTimeout(() => location.reload(), 6000);
    }
}

// ── INICIAR ───────────────────────────────────────────────

function iniciarJogo() {
    prepararBaralho();
    comprarCartas(5);
    addLog("Jogo iniciado — Turno " + turnoAtual);
    if (typeof atualizarInterface === 'function') atualizarInterface();
}

window.onload = iniciarJogo;
