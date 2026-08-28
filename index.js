"use strict";

window.addEventListener("load", () => {

```
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const vidaHTML = document.getElementById("vida");
const monedasHTML = document.getElementById("monedas");
const nivelHTML = document.getElementById("nivel");
const oleadaHTML = document.getElementById("oleada");
const mensajeHTML = document.getElementById("mensaje");
const errorHTML = document.getElementById("errorJuego");

if (!canvas || !ctx) {
    if (mensajeHTML) {
        mensajeHTML.textContent = "ERROR: No se encontró el canvas.";
    }
    return;
}

const W = canvas.width;
const H = canvas.height;

/* =====================================================
   TECLADO
===================================================== */

const teclas = {};

document.addEventListener("keydown", e => {

    teclas[e.key.toLowerCase()] = true;

    if (e.code === "Space") {
        teclas.space = true;
        e.preventDefault();
    }

});

document.addEventListener("keyup", e => {

    teclas[e.key.toLowerCase()] = false;

    if (e.code === "Space") {
        teclas.space = false;
    }

});


/* =====================================================
   JUGADOR
===================================================== */

const jugador = {
    x: 70,
    y: 400,
    ancho: 34,
    alto: 48,

    vx: 0,
    vy: 0,

    velocidad: 5,
    salto: -13,
    gravedad: 0.65,

    suelo: false,
    mirando: 1,

    vida: 5,

    invulnerable: 0,

    atacando: false,
    ataqueTiempo: 0,

    disparoCooldown: 0
};


/* =====================================================
   ESTADO
===================================================== */

let nivel = 1;
let oleada = 1;

let monedas = 0;
let monedasParaVida = 0;

let plataformas = [];
let monedasMapa = [];
let enemigos = [];

let balas = [];
let balasEnemigas = [];

let transicion = false;
let transicionTiempo = 0;

let gameOver = false;


/* =====================================================
   UTILIDADES
===================================================== */

function limitar(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function colision(a, b) {

    return (
        a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y
    );

}

function hud() {

    vidaHTML.textContent = jugador.vida;
    monedasHTML.textContent = monedas;
    nivelHTML.textContent = nivel;
    oleadaHTML.textContent = oleada;

}

function mensaje(texto) {
    mensajeHTML.textContent = texto;
}


/* =====================================================
   MAPAS
===================================================== */

function crearMapa() {

    plataformas = [];

    plataformas.push({
        x: 0,
        y: 550,
        ancho: 1000,
        alto: 50
    });

    if (nivel === 1) {

        plataformas.push(
            {x: 70, y: 450, ancho: 220, alto: 25},
            {x: 370, y: 370, ancho: 230, alto: 25},
            {x: 700, y: 450, ancho: 220, alto: 25},
            {x: 610, y: 260, ancho: 190, alto: 25}
        );

    } else if (nivel === 2) {

        plataformas.push(
            {x: 40, y: 430, ancho: 160, alto: 25},
            {x: 280, y: 350, ancho: 170, alto: 25},
            {x: 520, y: 450, ancho: 150, alto: 25},
            {x: 750, y: 330, ancho: 180, alto: 25},
            {x: 410, y: 210, ancho: 180, alto: 25}
        );

    } else if (nivel === 3) {

        plataformas.push(
            {x: 40, y: 420, ancho: 140, alto: 25},
            {x: 230, y: 300, ancho: 140, alto: 25},
            {x: 430, y: 440, ancho: 140, alto: 25},
            {x: 610, y: 320, ancho: 140, alto: 25},
            {x: 820, y: 220, ancho: 130, alto: 25},
            {x: 440, y: 170, ancho: 140, alto: 25}
        );

    } else {

        plataformas.push(
            {x: 30, y: 420, ancho: 140, alto: 25},
            {x: 210, y: 300, ancho: 130, alto: 25},
            {x: 380, y: 440, ancho: 130, alto: 25},
            {x: 540, y: 300, ancho: 130, alto: 25},
            {x: 700, y: 420, ancho: 120, alto: 25},
            {x: 830, y: 230, ancho: 130, alto: 25},
            {x: 440, y: 150, ancho: 150, alto: 25}
        );

    }

}


/* =====================================================
   FÍSICA
===================================================== */

function fisica(obj) {

    const anterior = obj.y;

    obj.vy += obj.gravedad;

    if (obj.vy > 15) {
        obj.vy = 15;
    }

    obj.y += obj.vy;

    obj.suelo = false;

    for (const p of plataformas) {

        const horizontal =
            obj.x + obj.ancho > p.x &&
            obj.x < p.x + p.ancho;

        if (!horizontal) continue;

        const pieAnterior =
            anterior + obj.alto;

        const pieActual =
            obj.y + obj.alto;

        if (
            obj.vy >= 0 &&
            pieAnterior <= p.y &&
            pieActual >= p.y
        ) {

            obj.y = p.y - obj.alto;
            obj.vy = 0;
            obj.suelo = true;

        }

    }

}


/* =====================================================
   MONEDAS
===================================================== */

function crearMonedas() {

    monedasMapa = [];

    const posiciones = [
        [120, 410],
        [330, 310],
        [490, 330],
        [650, 210],
        [800, 410],
        [900, 150]
    ];

    for (const p of posiciones) {

        monedasMapa.push({
            x: p[0],
            y: p[1],
            ancho: 20,
            alto: 20,
            recogida: false
        });

    }

}


/* =====================================================
   ENEMIGOS
===================================================== */

function crearEnemigo(tipo, x) {

    const e = {

        tipo,

        x,
        y: 100,

        ancho: 36,
        alto: 46,

        vx: 0,
        vy: 0,

        velocidad: 1.5,
        gravedad: 0.6,

        vida: 3,
        vidaMax: 3,

        salto: -11,

        cooldown: 80,

        direccion: -1,

        suelo: false

    };


    if (tipo === "saltador") {
        e.velocidad = 1.8;
        e.vida = 4;
        e.vidaMax = 4;
    }

    if (tipo === "tanque") {
        e.ancho = 52;
        e.alto = 60;
        e.velocidad = 0.8;
        e.vida = 8;
        e.vidaMax = 8;
    }

    if (tipo === "volador") {
        e.ancho = 42;
        e.alto = 34;
        e.velocidad = 1.7;
        e.vida = 5;
        e.vidaMax = 5;
        e.y = 120 + Math.random() * 280;
    }

    if (tipo === "disparador") {
        e.velocidad = 1;
        e.vida = 5;
        e.vidaMax = 5;
        e.cooldown = 90;
    }

    if (tipo === "elite") {
        e.ancho = 52;
        e.alto = 62;
        e.velocidad = 1.7;
        e.vida = 12;
        e.vidaMax = 12;
        e.cooldown = 60;
    }


    if (tipo !== "volador") {

        e.x = limitar(
            e.x,
            10,
            W - e.ancho - 10
        );

        colocarEnPlataforma(e);

    }

    return e;

}


function colocarEnPlataforma(e) {

    let mejor = null;

    for (const p of plataformas) {

        if (
            e.x + e.ancho > p.x &&
            e.x < p.x + p.ancho
        ) {

            if (!mejor || p.y < mejor.y) {
                mejor = p;
            }

        }

    }

    if (mejor) {
        e.y = mejor.y - e.alto;
    } else {
        e.y = 550 - e.alto;
    }

    e.vy = 0;
    e.suelo = true;

}


function crearOleada() {

    enemigos = [];
    balas = [];
    balasEnemigas = [];

    crearMapa();
    crearMonedas();

    jugador.x = 70;
    jugador.y = 300;
    jugador.vy = 0;

    const cantidad = 2 + nivel + oleada;


    for (let i = 0; i < cantidad; i++) {

        let tipo = "normal";

        if (nivel === 1) {

            tipo = "normal";

        } else if (nivel === 2) {

            tipo =
                i % 3 === 0
                    ? "saltador"
                    : "normal";

        } else if (nivel === 3) {

            if (i % 4 === 0)
                tipo = "volador";
            else if (i % 3 === 0)
                tipo = "saltador";
            else
                tipo = "normal";

        } else {

            if (i % 5 === 0)
                tipo = "tanque";
            else if (i % 4 === 0)
                tipo = "disparador";
            else if (i % 3 === 0)
                tipo = "volador";
            else
                tipo = "saltador";

        }


        let x;

        if (i % 3 === 0)
            x = 400 + Math.random() * 250;
        else if (i % 3 === 1)
            x = 700 + Math.random() * 180;
        else
            x = 250 + Math.random() * 300;


        enemigos.push(
            crearEnemigo(tipo, x)
        );

    }

    mensaje(
        "⚔️ NIVEL " +
        nivel +
        " - OLEADA " +
        oleada
    );

    hud();

}


/* =====================================================
   JUGADOR
===================================================== */

function moverJugador() {

    jugador.vx = 0;

    if (teclas.a || teclas.arrowleft) {

        jugador.vx = -jugador.velocidad;
        jugador.mirando = -1;

    }

    if (teclas.d || teclas.arrowright) {

        jugador.vx = jugador.velocidad;
        jugador.mirando = 1;

    }

    jugador.x += jugador.vx;


    if (
        (teclas.space ||
         teclas.w ||
         teclas.arrowup) &&
        jugador.suelo
    ) {

        jugador.vy = jugador.salto;
        jugador.suelo = false;

    }


    fisica(jugador);


    jugador.x = limitar(
        jugador.x,
        0,
        W - jugador.ancho
    );


    if (jugador.y > H + 100) {

        recibirDaño();

        jugador.x = 70;
        jugador.y = 300;
        jugador.vy = 0;

    }

}


/* =====================================================
   ATAQUE
===================================================== */

function atacar() {

    if (
        teclas.j &&
        !jugador.atacando
    ) {

        jugador.atacando = true;
        jugador.ataqueTiempo = 12;

    }

    if (!jugador.atacando)
        return;


    jugador.ataqueTiempo--;


    const espada = {

        x:
            jugador.mirando === 1
                ? jugador.x + jugador.ancho
                : jugador.x - 55,

        y: jugador.y + 8,

        ancho: 55,
        alto: 35

    };


    for (const e of enemigos) {

        if (
            e.vida <= 0 ||
            e.golpeadoAtaque
        ) continue;


        if (colision(espada, e)) {

            e.vida--;

            e.golpeadoAtaque = true;

            e.x += jugador.mirando * 40;

        }

    }


    if (jugador.ataqueTiempo <= 0) {

        jugador.atacando = false;

        for (const e of enemigos) {
            e.golpeadoAtaque = false;
        }

    }

}


/* =====================================================
   DISPAROS
===================================================== */

function disparar() {

    if (
        teclas.k &&
        jugador.disparoCooldown <= 0
    ) {

        balas.push({

            x:
                jugador.mirando === 1
                    ? jugador.x + jugador.ancho
                    : jugador.x - 12,

            y: jugador.y + 20,

            ancho: 12,
            alto: 6,

            velocidad:
                jugador.mirando * 11

        });

        jugador.disparoCooldown = 15;

    }

    if (jugador.disparoCooldown > 0) {
        jugador.disparoCooldown--;
    }

}


function actualizarBalas() {

    for (
        let i = balas.length - 1;
        i >= 0;
        i--
    ) {

        const b = balas[i];

        b.x += b.velocidad;


        if (
            b.x < -30 ||
            b.x > W + 30
        ) {

            balas.splice(i, 1);
            continue;

        }


        let impacto = false;


        for (const e of enemigos) {

            if (
                e.vida > 0 &&
                colision(b, e)
            ) {

                e.vida--;

                impacto = true;

                break;

            }

        }


        if (impacto) {
            balas.splice(i, 1);
        }

    }

}


/* =====================================================
   ENEMIGOS
===================================================== */

function actualizarEnemigos() {

    for (const e of enemigos) {

        if (e.vida <= 0)
            continue;


        if (e.tipo === "volador") {

            const dx = jugador.x - e.x;
            const dy = jugador.y - e.y;

            if (Math.abs(dx) > 25)
                e.x += Math.sign(dx) * e.velocidad;

            if (Math.abs(dy) > 25)
                e.y += Math.sign(dy) * 0.8;

            e.x = limitar(
                e.x,
                10,
                W - e.ancho - 10
            );

            e.y = limitar(
                e.y,
                50,
                480
            );

        } else {

            fisica(e);

            const dx =
                jugador.x - e.x;

            e.direccion =
                dx >= 0 ? 1 : -1;

            e.x +=
                e.velocidad *
                e.direccion;

            e.x = limitar(
                e.x,
                5,
                W - e.ancho - 5
            );


            if (
                e.tipo === "saltador" &&
                e.suelo
            ) {

                e.cooldown--;

                if (e.cooldown <= 0) {

                    e.vy = e.salto;

                    e.suelo = false;

                    e.cooldown = 70;

                }

            }

        }


        if (
            e.tipo === "disparador" ||
            e.tipo === "elite"
        ) {

            e.cooldown--;

            if (e.cooldown <= 0) {

                disparoEnemigo(e);

                e.cooldown =
                    e.tipo === "elite"
                        ? 60
                        : 100;

            }

        }


        if (colision(jugador, e)) {

            recibirDaño();

            jugador.x +=
                e.direccion * 35;

        }

    }

}


function disparoEnemigo(e) {

    const direccion =
        jugador.x < e.x
            ? -1
            : 1;

    balasEnemigas.push({

        x: e.x + e.ancho / 2,
        y: e.y + e.alto / 2,

        ancho: 12,
        alto: 12,

        velocidad:
            direccion * 5

    });

}


function actualizarBalasEnemigas() {

    for (
        let i = balasEnemigas.length - 1;
        i >= 0;
        i--
    ) {

        const b =
            balasEnemigas[i];

        b.x += b.velocidad;


        if (
            b.x < -40 ||
            b.x > W + 40
        ) {

            balasEnemigas.splice(i, 1);
            continue;

        }


        if (
            colision(b, jugador)
        ) {

            recibirDaño();

            balasEnemigas.splice(i, 1);

        }

    }

}


/* =====================================================
   MONEDAS
===================================================== */

function recogerMonedas() {

    for (const m of monedasMapa) {

        if (m.recogida)
            continue;


        if (colision(jugador, m)) {

            m.recogida = true;

            monedas++;

            monedasParaVida++;


            if (monedasParaVida >= 10) {

                monedasParaVida -= 10;

                jugador.vida++;

                mensaje(
                    "🪙 ¡10 MONEDAS! +1 ❤️"
                );

            }

            hud();

        }

    }

}


/* =====================================================
   DAÑO
===================================================== */

function recibirDaño() {

    if (
        jugador.invulnerable > 0 ||
        gameOver
    ) return;


    jugador.vida--;

    jugador.invulnerable = 70;

    hud();


    if (jugador.vida <= 0) {

        jugador.vida = 0;

        gameOver = true;

        mensaje(
            "💀 GAME OVER"
        );

        setTimeout(() => {
            location.reload();
        }, 2000);

    }

}


/* =====================================================
   FIN DE OLEADA
===================================================== */

function comprobarOleada() {

    if (transicion || gameOver)
        return;


    const enemigosVivos =
        enemigos.some(
            e => e.vida > 0
        );


    const monedasFaltantes =
        monedasMapa.some(
            m => !m.recogida
        );


    if (
        !enemigosVivos &&
        !monedasFaltantes
    ) {

        transicion = true;

        transicionTiempo = 120;

        jugador.vida++;

        mensaje(
            "🏆 ¡OLEADA COMPLETADA! +1 ❤️"
        );

        hud();

    }
    else if (
        !enemigosVivos &&
        monedasFaltantes
    ) {

        mensaje(
            "🪙 ¡RECOGE TODAS LAS MONEDAS!"
        );

    }

}


function siguienteOleada() {

    transicion = false;

    oleada++;


    if (oleada > 3) {

        nivel++;

        oleada = 1;

        mensaje(
            "🌟 ¡NUEVO NIVEL!"
        );

    }


    crearOleada();

}


/* =====================================================
   DIBUJO
===================================================== */

function fondo() {

    let color = "#101025";

    if (nivel === 2)
        color = "#10251c";

    if (nivel === 3)
        color = "#24152d";

    if (nivel >= 4)
        color = "#090909";


    ctx.fillStyle = color;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* Luna */

    ctx.fillStyle = "#eeeeb0";

    ctx.beginPath();

    ctx.arc(
        820,
        90,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Montañas */

    ctx.fillStyle = "#242440";

    ctx.beginPath();

    ctx.moveTo(0, 500);
    ctx.lineTo(160, 280);
    ctx.lineTo(330, 500);
    ctx.lineTo(530, 240);
    ctx.lineTo(760, 500);
    ctx.lineTo(1000, 270);
    ctx.lineTo(1000, 600);
    ctx.lineTo(0, 600);

    ctx.closePath();

    ctx.fill();

}


function dibujarPlataformas() {

    for (const p of plataformas) {

        ctx.fillStyle = "#4b3025";

        ctx.fillRect(
            p.x,
            p.y,
            p.ancho,
            p.alto
        );

        ctx.fillStyle = "#79ad3e";

        ctx.fillRect(
            p.x,
            p.y,
            p.ancho,
            6
        );

    }

}


function dibujarMonedas() {

    for (const m of monedasMapa) {

        if (m.recogida)
            continue;


        ctx.fillStyle = "#ffd700";

        ctx.beginPath();

        ctx.arc(
            m.x + 10,
            m.y + 10,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#fff5a0";

        ctx.fillRect(
            m.x + 6,
            m.y + 4,
            4,
            5
        );

    }

}


function dibujarJugador() {

    if (
        jugador.invulnerable > 0 &&
        Math.floor(
            jugador.invulnerable / 5
        ) % 2 === 0
    ) return;


    /* Cuerpo */

    ctx.fillStyle = "#eeeeee";

    ctx.fillRect(
        jugador.x,
        jugador.y,
        jugador.ancho,
        jugador.alto
    );


    /* Cabeza */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        jugador.x + 4,
        jugador.y - 15,
        26,
        20
    );


    /* Ojos */

    ctx.fillStyle = "#111111";

    ctx.fillRect(
        jugador.x + 9,
        jugador.y - 8,
        4,
        4
    );

    ctx.fillRect(
        jugador.x + 20,
        jugador.y - 8,
        4,
        4
    );


    /* Espada */

    if (jugador.atacando) {

        ctx.fillStyle = "#dddddd";

        if (jugador.mirando === 1) {

            ctx.fillRect(
                jugador.x + 30,
                jugador.y + 15,
                55,
                8
            );

        } else {

            ctx.fillRect(
                jugador.x - 50,
                jugador.y + 15,
                55,
                8
            );

        }

    }

}


function dibujarEnemigos() {

    for (const e of enemigos) {

        if (e.vida <= 0)
            continue;


        if (e.tipo === "normal")
            ctx.fillStyle = "#d52d36";

        else if (e.tipo === "saltador")
            ctx.fillStyle = "#ff8500";

        else if (e.tipo === "tanque")
            ctx.fillStyle = "#050505";

        else if (e.tipo === "volador")
            ctx.fillStyle = "#a239d6";

        else if (e.tipo === "disparador")
            ctx.fillStyle = "#3685dc";

        else
            ctx.fillStyle = "#e000a8";


        ctx.fillRect(
            e.x,
            e.y,
            e.ancho,
            e.alto
        );


        /* Ojos */

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            e.x + 7,
            e.y + 10,
            7,
            7
        );

        ctx.fillRect(
            e.x + e.ancho - 14,
            e.y + 10,
            7,
            7
        );


        /* Vida */

        ctx.fillStyle = "#222222";

        ctx.fillRect(
            e.x,
            e.y - 9,
            e.ancho,
            5
        );


        ctx.fillStyle = "#e33b3b";

        ctx.fillRect(
            e.x,
            e.y - 9,
            e.ancho *
            (e.vida / e.vidaMax),
            5
        );


        /* Alas */

        if (e.tipo === "volador") {

            ctx.fillStyle = "#d08cff";

            ctx.fillRect(
                e.x - 10,
                e.y + 8,
                10,
                18
            );

            ctx.fillRect(
                e.x + e.ancho,
                e.y + 8,
                10,
                18
            );

        }

    }

}


function dibujarBalas() {

    for (const b of balas) {

        ctx.fillStyle = "#ffff55";

        ctx.fillRect(
            b.x,
            b.y,
            b.ancho,
            b.alto
        );

    }


    for (const b of balasEnemigas) {

        ctx.fillStyle = "#ff3030";

        ctx.beginPath();

        ctx.arc(
            b.x + 6,
            b.y + 6,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =====================================================
   ACTUALIZACION
===================================================== */

function actualizar() {

    if (gameOver)
        return;


    if (transicion) {

        transicionTiempo--;

        if (transicionTiempo <= 0) {
            siguienteOleada();
        }

        return;

    }


    moverJugador();

    atacar();

    disparar();

    actualizarBalas();

    actualizarEnemigos();

    actualizarBalasEnemigas();

    recogerMonedas();

    if (jugador.invulnerable > 0) {
        jugador.invulnerable--;
    }

    comprobarOleada();

    hud();

}


/* =====================================================
   RENDER
===================================================== */

function dibujar() {

    fondo();

    dibujarPlataformas();

    dibujarMonedas();

    dibujarEnemigos();

    dibujarBalas();

    dibujarJugador();

}


/* =====================================================
   GAME LOOP
===================================================== */

function loop() {

    actualizar();

    dibujar();

    requestAnimationFrame(loop);

}


/* =====================================================
   INICIAR
===================================================== */

try {

    crearMapa();
    crearMonedas();
    crearOleada();

    jugador.vida = 5;

    hud();

    mensaje(
        "⚔️ ¡NIVEL 1 - OLEADA 1!"
    );

    loop();

}
catch (error) {

    console.error(error);

    mensaje(
        "❌ ERROR AL INICIAR EL JUEGO"
    );

    if (errorHTML) {

        errorHTML.style.display = "block";

        errorHTML.textContent =
            "Error: " +
            error.message;

    }

}
```

});
