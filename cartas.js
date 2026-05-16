// ══════════════════════════════════════════════════════════
//  CAMPUS DO CAOS — BANCO DE CARTAS v2.0 (BALANCEADO)
//
//  FILOSOFIA DE BALANCEAMENTO:
//  • Custo = ATK + (vida / 2) - 1  (fórmula base)
//  • Cartas BASE:    ATK 1-2, Vida 2-3, Custo 1
//  • ESTÁGIO 1:      ATK 3-5, Vida 4-6, Custo 3-4
//  • HERÓI/ASCEND:   ATK 5-7, Vida 6-9, Custo 5-6
//  • JUBILADOS:      ATK alto, vida baixa, custo alto (vidro)
// ══════════════════════════════════════════════════════════

const bancoDeCartas = [

    // ─────────────────────────────────────────
    //  RESISTÊNCIA  (verde — defensivos)
    // ─────────────────────────────────────────
    {
        nome: "Iniciado da Ordem",
        ataque: 1, vida: 3, custo: 1,
        faccao: "Resistência", nivel: "BASE",
        trilha: ["Mestre Cassian"],
        habilidade: "Compilar: +1 vida ao entrar no campo."
    },
    {
        nome: "Dev Voluntário",
        ataque: 2, vida: 2, custo: 1,
        faccao: "Resistência", nivel: "BASE",
        trilha: ["Guardião do Repo"],
        habilidade: "Open Source: aliados BASE ganham +1 ATK."
    },
    {
        nome: "Mestre Cassian",
        ataque: 3, vida: 6, custo: 4,
        faccao: "Resistência", nivel: "ESTAGIO 1",
        evoluiDe: "Iniciado da Ordem",
        trilha: ["Divindade do Código"],
        habilidade: "Refactor: remove 1 debuff do campo aliado."
    },
    {
        nome: "Guardião do Repo",
        ataque: 4, vida: 5, custo: 4,
        faccao: "Resistência", nivel: "ESTAGIO 1",
        evoluiDe: "Dev Voluntário",
        trilha: ["Divindade do Código"],
        habilidade: "Git Push: +1 ATK ao atacar."
    },
    {
        nome: "Divindade do Código",
        ataque: 6, vida: 8, custo: 6,
        faccao: "Resistência", nivel: "HEROI",
        evoluiDe: "Mestre Cassian",
        habilidade: "Stack Sagrado: +4 dano ao atacar direto."
    },

    // ─────────────────────────────────────────
    //  EXÉRCITO  (vermelho — agressivos)
    // ─────────────────────────────────────────
    {
        nome: "Recruta GOE",
        ataque: 2, vida: 2, custo: 1,
        faccao: "Exército", nivel: "BASE",
        trilha: ["Sargento Sys32"],
        habilidade: "Disciplina: ignora bloqueio de cartas BASE."
    },
    {
        nome: "Patrulheiro GOE",
        ataque: 1, vida: 3, custo: 1,
        faccao: "Exército", nivel: "BASE",
        trilha: ["Comandante T.O.M."],
        habilidade: "Vigilância: bloqueia ataque direto inimigo."
    },
    {
        nome: "Sargento Sys32",
        ataque: 5, vida: 4, custo: 4,
        faccao: "Exército", nivel: "ESTAGIO 1",
        evoluiDe: "Recruta GOE",
        trilha: ["Comandante T.O.M."],
        habilidade: "Format C: destrói 1 carta BASE inimiga ao entrar."
    },
    {
        nome: "Comandante T.O.M.",
        ataque: 7, vida: 5, custo: 6,
        faccao: "Exército", nivel: "ASCENDENTE",
        evoluiDe: "Patrulheiro GOE",
        habilidade: "Protocolo Zero: força troca de turno imediata."
    },

    // ─────────────────────────────────────────
    //  NEUTROS  (âmbar — flexíveis)
    // ─────────────────────────────────────────
    {
        nome: "Calouro Sem Nome",
        ataque: 1, vida: 2, custo: 1,
        faccao: "Neutros", nivel: "BASE",
        trilha: ["Argus, o Mito"],
        habilidade: "Anônimo: inimigo não pode selecionar esta carta."
    },
    {
        nome: "Monitor de Lab",
        ataque: 2, vida: 3, custo: 1,
        faccao: "Neutros", nivel: "BASE",
        trilha: ["Argus, o Mito"],
        habilidade: "Acesso Root: vê 1 carta do baralho inimigo."
    },
    {
        nome: "Argus, o Mito",
        ataque: 4, vida: 6, custo: 5,
        faccao: "Neutros", nivel: "ASCENDENTE",
        evoluiDe: "Calouro Sem Nome",
        habilidade: "Overflow: se vida <= 2, ATK dobra."
    },

    // ─────────────────────────────────────────
    //  JUBILADOS  (roxo — vidro, alto ATK)
    // ─────────────────────────────────────────
    {
        nome: "Imperador Esquecido",
        ataque: 8, vida: 2, custo: 5,
        faccao: "Neutros", nivel: "JUBILADOS",
        habilidade: "Presença: inimigos vida > 5 perdem -2 ATK."
    },
    {
        nome: "Satoru Corrompido",
        ataque: 6, vida: 3, custo: 5,
        faccao: "Exército", nivel: "JUBILADOS",
        habilidade: "R.A.T.O.N.: carta atacada perde 1 ATK permanente."
    },
    {
        nome: "Maho-Vilan Frag.",
        ataque: 5, vida: 2, custo: 4,
        faccao: "Exército", nivel: "JUBILADOS",
        habilidade: "Null Pointer: ao destruir, compre 1 carta."
    }
];
