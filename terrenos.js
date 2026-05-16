// ══════════════════════════════════════════════════════════
//  CAMPUS DO CAOS — TERRENOS v2.0
// ══════════════════════════════════════════════════════════

const listaTerrenos = [
    {
        nome: "CAMPUS CENTRAL",
        desc: "Calouros (BASE) +1 ATK · Veteranos (ESTAGIO 1) -1 ATK",
        buffNivel: "BASE",
        nerfNivel: ["ESTAGIO 1"]
    },
    {
        nome: "PORTÕES DA FACULDADE",
        desc: "ESTAGIO 1 +2 ATK · BASE -1 ATK",
        buffNivel: "ESTAGIO 1",
        nerfNivel: ["BASE"]
    },
    {
        nome: "AMAZON CAMPUS",
        desc: "Exército +2 ATK · Resistência -1 ATK",
        buff: "Exército",
        nerf: "Resistência"
    },
    {
        nome: "OFICINA DO CAOS",
        desc: "Neutros e Resistência +2 ATK",
        buff: ["Neutros", "Resistência"]
    },
    {
        nome: "PURGATÓRIO DOS JUBILADOS",
        desc: "Jubilados +3 ATK · Todos os outros -1 ATK",
        buffNivel: "JUBILADOS",
        nerfNivel: ["BASE", "ESTAGIO 1", "ASCENDENTE", "HEROI"]
    },
    {
        nome: "VIA DOS VETERANOS",
        desc: "Todos +1 ATK · HERÓI e ASCENDENTE +2 ATK",
        buffNivel: ["HEROI", "ASCENDENTE"],
        buffGeral: 1
    },
    {
        nome: "O SITE CAIU",
        desc: "Nenhuma carta pode atacar neste turno! (terreno instável)",
        bloqueiaAtaque: true
    },
    {
        nome: "BATIDA NO LINO",
        desc: "Exército +3 ATK · Neutros e Resistência -2 ATK",
        buff: "Exército",
        buffBonus: 3,
        nerf: ["Neutros", "Resistência"],
        nerfBonus: -2
    }
];

// Sorteia o terreno ao iniciar
let terrenoAtual = listaTerrenos[Math.floor(Math.random() * listaTerrenos.length)];
console.log("[TERRENO] Sorteado:", terrenoAtual.nome);
