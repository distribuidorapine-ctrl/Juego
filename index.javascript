"use strict";

/* =========================================================
   OBTENER ELEMENTOS
========================================================= */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const vidaHTML = document.getElementById("vida");
const monedasHTML = document.getElementById("monedas");
const nivelHTML = document.getElementById("nivel");
const oleadaHTML = document.getElementById("oleada");
const mensajeHTML = document.getElementById("mensaje");

const ANCHO = canvas.width;
const ALTO = canvas.height;


/* =========================================================
   TECLADO
========================================================= */

const teclas = {};

document.addEventListener("keydown", function (e) {

    const tecla = e.key.toLowerCase();

    teclas[tecla] = true;

    if (e.code === "Space") {
        teclas.space = true;
        e.preventDefault();
    }

});

document.addEventListener("keyup", function (e) {

    const tecla = e.key.toLowerCase();

    teclas[tecla] = false;

    if (e.code === "Space") {
        teclas.space = false;
    }

});


/* =========================================================
   JUGADOR
========================================================= */

const jugador = {

    x: 80,
    y: 300,

    ancho: 34,
    alto: 48,

    velocidad: 5,

    velocidadY: 0,
    gravedad: 0.65,
    fuerzaSalto: -13,

    suelo: false,

    mirando: 1,

    vida: 5,

    invulnerable: 0,

    atacando: false,
    tiempoAtaque: 0,

    golpeados: [],

    disparoCooldown: 0

};


/* =========================================================
   ESTADO DEL JUEGO
========================================================= */

let nivel = 1;
let oleada = 1;

const OLEADAS_POR_NIVEL = 3;

let cambiando = false;
let contadorCambio = 0;

let monedas = [];
let totalMonedas = 0;
let monedasDesdeVida = 0;

let enemigos = [];

let balasJugador = [];
let balasEnemigos = [];

let plataformas = [];


/* =========================================================
   UTILIDADES
========================================================= */

function aleatorio(min, max) {
    return Math.random() * (max - min) + min;
}


function colision(a, b) {

    return (
        a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y
    );

}


function actualizarHUD() {

    vidaHTML.textContent = jugador.vida;
    monedasHTML.textContent = totalMonedas;
    nivelHTML.textContent = nivel;
    oleadaHTML.textContent = oleada;

}


/* =========================================================
   MAPA
========================================================= */

function crearMapa() {

    plataformas = [];

    // Suelo
    plataformas.push({
        x: 0,
        y: 550,
        ancho: 1000,
        alto: 50
    });


    if (nivel === 1) {

        plataformas.push({
            x: 80,
            y: 450,
            ancho: 200,
            alto: 25
        });

        plataformas.push({
            x: 380,
            y: 370,
            ancho: 220,
            alto: 25
        });

        plataformas.push({
            x: 700,
            y: 450,
            ancho: 210,
            alto: 25
        });

        plataformas.push({
            x: 600,
            y: 250,
            ancho: 190,
            alto: 25
        });

    }

    else if (nivel === 2) {

        plataformas.push({
            x: 40,
            y: 430,
            ancho: 160,
            alto: 25
        });

        plataformas.push({
            x: 280,
            y: 350,
            ancho: 170,
            alto: 25
        });

        plataformas.push({
            x: 520,
            y: 450,
            ancho: 150,
            alto: 25
        });

        plataformas.push({
            x: 750,
            y: 330,
            ancho: 180,
            alto: 25
        });

        plataformas.push({
            x: 400,
            y: 210,
            ancho: 180,
            alto: 25
        });

    }

    else if (nivel === 3) {

        plataformas.push({
            x: 50,
            y: 420,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 230,
            y: 300,
            ancho: 140,
            alto: 25
        });

        plataformas.push({
            x: 430,
            y: 440,
            ancho: 140,
            alto: 25
        });

        plataformas.push({
            x: 610,
            y: 320,
            ancho: 140,
            alto: 25
        });

        plataformas.push({
            x: 820,
            y: 220,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 440,
            y: 170,
            ancho: 140,
            alto: 25
        });

    }

    else if (nivel === 4) {

        plataformas.push({
            x: 40,
            y: 360,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 220,
            y: 450,
            ancho: 110,
            alto: 25
        });

        plataformas.push({
            x: 380,
            y: 300,
            ancho: 140,
            alto: 25
        });

        plataformas.push({
            x: 570,
            y: 420,
            ancho: 120,
            alto: 25
        });

        plataformas.push({
            x: 750,
            y: 300,
            ancho: 120,
            alto: 25
        });

        plataformas.push({
            x: 870,
            y: 180,
            ancho: 100,
            alto: 25
        });

    }

    else {

        plataformas.push({
            x: 30,
            y: 420,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 200,
            y: 300,
            ancho: 120,
            alto: 25
        });

        plataformas.push({
            x: 360,
            y: 440,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 520,
            y: 300,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 690,
            y: 420,
            ancho: 120,
            alto: 25
        });

        plataformas.push({
            x: 820,
            y: 240,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 430,
            y: 160,
            ancho: 150,
            alto: 25
        });

    }

}


/* =========================================================
   FÍSICA
========================================================= */

function aplicarFisica(entidad) {

    entidad.velocidadY += entidad.gravedad;
    entidad.y += entidad.velocidadY;

    entidad.suelo = false;

    for (const plataforma of plataformas) {

        const horizontal =
            entidad.x + entidad.ancho > plataforma.x &&
            entidad.x < plataforma.x + plataforma.ancho;

        if (!horizontal) {
            continue;
        }

        const estabaArriba =
            entidad.y + entidad.alto <= plataforma.y + 15;

        const estaBajando =
            entidad.velocidadY >= 0;

        if (
            estabaArriba &&
            estaBajando &&
            entidad.y + entidad.alto >= plataforma.y
        ) {

            entidad.y = plataforma.y - entidad.alto;

            entidad.velocidadY = 0;

            entidad.suelo = true;

        }

    }

}


/* =========================================================
   MONEDAS
========================================================= */

function crearMonedas() {

    monedas = [];

    const posiciones = [

        [130, 410],
        [330, 310],
        [490, 330],
        [650, 210],
        [800, 410],
        [900, 150]

    ];

    for (const posicion of posiciones) {

        monedas.push({

            x: posicion[0],
            y: posicion[1],

            ancho: 20,
            alto: 20,

            recogida: false

        });

    }

}


/* =========================================================
   ENEMIGOS
========================================================= */

function nuevoEnemigo(tipo, x) {

    const enemigo = {

        tipo: tipo,

        x: x,
        y: 100,

        ancho: 36,
        alto: 46,

        velocidad: 1.5,

        velocidadY: 0,
        gravedad: 0.6,

        salto: -11,

        suelo: false,

        direccion: -1,

        vida: 3,
        vidaMaxima: 3,

        cooldown: 80,

        fase: aleatorio(0, Math.PI * 2)

    };


    if (tipo === "normal") {

        enemigo.velocidad = 1.5;
        enemigo.vida = 3;
        enemigo.vidaMaxima = 3;

    }


    if (tipo === "saltador") {

        enemigo.velocidad = 1.8;
        enemigo.vida = 4;
        enemigo.vidaMaxima = 4;
        enemigo.cooldown = 50;

    }


    if (tipo === "tanque") {

        enemigo.ancho = 50;
        enemigo.alto = 60;

        enemigo.velocidad = 0.8;

        enemigo.vida = 8;
        enemigo.vidaMaxima = 8;

    }


    if (tipo === "volador") {

        enemigo.ancho = 42;
        enemigo.alto = 34;

        enemigo.velocidad = 1.7;

        enemigo.vida = 5;
        enemigo.vidaMaxima = 5;

        enemigo.y = aleatorio(100, 350);

    }


    if (tipo === "disparador") {

        enemigo.velocidad = 1;

        enemigo.vida = 5;
        enemigo.vidaMaxima = 5;

        enemigo.cooldown = 80;

    }


    if (tipo === "elite") {

        enemigo.ancho = 52;
        enemigo.alto = 62;

        enemigo.velocidad = 1.7;

        enemigo.vida = 12;
        enemigo.vidaMaxima = 12;

    }


    if (tipo !== "volador") {
        colocarEnSuelo(enemigo);
    }


    return enemigo;

}


function colocarEnSuelo(enemigo) {

    let plataformaEncontrada = null;

    for (const plataforma of plataformas) {

        if (
            enemigo.x + enemigo.ancho > plataforma.x &&
            enemigo.x < plataforma.x + plataforma.ancho
        ) {

            if (
                plataformaEncontrada === null ||
                plataforma.y < plataformaEncontrada.y
            ) {

                plataformaEncontrada = plataforma;

            }

        }

    }


    if (plataformaEncontrada) {

        enemigo.y =
            plataformaEncontrada.y -
            enemigo.alto;

    }

    else {

        enemigo.y =
            550 -
            enemigo.alto;

    }

    enemigo.velocidadY = 0;
    enemigo.suelo = true;

}


/* =========================================================
   CREAR OLEADA
========================================================= */

function crearOleada() {

    enemigos = [];

    balasJugador = [];
    balasEnemigos = [];

    crearMapa();

    jugador.x = 80;
    jugador.y = 300;
    jugador.velocidadY = 0;


    let cantidad =
        2 +
        nivel +
        oleada;


    for (let i = 0; i < cantidad; i++) {

        let tipo = "normal";


        if (nivel === 1) {

            tipo = "normal";

        }

        else if (nivel === 2) {

            tipo =
                i % 3 === 0
                    ? "saltador"
                    : "normal";

        }

        else if (nivel === 3) {

            if (i % 4 === 0) {
                tipo = "volador";
            }

            else if (i % 3 === 0) {
                tipo = "saltador";
            }

            else {
                tipo = "normal";
            }

        }

        else if (nivel === 4) {

            if (i % 5 === 0) {
                tipo = "tanque";
            }

            else if (i % 4 === 0) {
                tipo = "disparador";
            }

            else if (i % 3 === 0) {
                tipo = "volador";
            }

            else {
                tipo = "saltador";
            }

        }

        else {

            if (i % 5 === 0) {
                tipo = "elite";
            }

            else if (i % 4 === 0) {
                tipo = "tanque";
            }

            else if (i % 3 === 0) {
                tipo = "disparador";
            }

            else if (i % 2 === 0) {
                tipo = "volador";
            }

            else {
                tipo = "saltador";
            }

        }


        let x;

        if (i % 3 === 0) {
            x = aleatorio(400, 700);
        }

        else if (i % 3 === 1) {
            x = aleatorio(700, 900);
        }

        else {
            x = aleatorio(250, 600);
        }


        enemigos.push(
            nuevoEnemigo(tipo, x)
        );

    }


    mensajeHTML.textContent =
        "⚔️ Nivel " +
        nivel +
        " - Oleada " +
        oleada;

    actualizarHUD();

}


/* =========================================================
   JUGADOR
========================================================= */

function moverJugador() {

    if (
        teclas["a"] ||
        teclas["arrowleft"]
    ) {

        jugador.x -= jugador.velocidad;
        jugador.mirando = -1;

    }


    if (
        teclas["d"] ||
        teclas["arrowright"]
    ) {

        jugador.x += jugador.velocidad;
        jugador.mirando = 1;

    }


    if (
        (
            teclas.space ||
            teclas["w"] ||
            teclas["arrowup"]
        ) &&
        jugador.suelo
    ) {

        jugador.velocidadY =
            jugador.fuerzaSalto;

        jugador.suelo = false;

    }


    aplicarFisica(jugador);


    if (jugador.x < 0) {
        jugador.x = 0;
    }


    if (
        jugador.x + jugador.ancho > ANCHO
    ) {

        jugador.x =
            ANCHO -
            jugador.ancho;

    }


    if (jugador.y > ALTO + 100) {

        recibirDaño();

        jugador.x = 80;
        jugador.y = 300;
        jugador.velocidadY = 0;

    }

}


/* =========================================================
   ENEMIGOS TERRESTRES
========================================================= */

function moverEnemigoTerrestre(enemigo) {

    aplicarFisica(enemigo);


    const diferencia =
        jugador.x - enemigo.x;


    if (Math.abs(diferencia) > 8) {

        enemigo.direccion =
            diferencia > 0
                ? 1
                : -1;

    }


    enemigo.x +=
        enemigo.velocidad *
        enemigo.direccion;


    if (enemigo.x <= 5) {

        enemigo.x = 5;
        enemigo.direccion = 1;

    }


    if (
        enemigo.x +
        enemigo.ancho >=
        ANCHO - 5
    ) {

        enemigo.x =
            ANCHO -
            enemigo.ancho -
            5;

        enemigo.direccion = -1;

    }

}


/* =========================================================
   SALTADOR
========================================================= */

function moverSaltador(enemigo) {

    moverEnemigoTerrestre(enemigo);

    enemigo.cooldown--;

    if (
        enemigo.suelo &&
        enemigo.cooldown <= 0
    ) {

        enemigo.velocidadY =
            enemigo.salto;

        enemigo.suelo = false;

        enemigo.cooldown = 70;

    }

}


/* =========================================================
   VOLADOR
========================================================= */

function moverVolador(enemigo) {

    const dx =
        jugador.x -
        enemigo.x;

    const dy =
        jugador.y -
        enemigo.y;


    if (Math.abs(dx) > 30) {

        enemigo.x +=
            Math.sign(dx) *
            enemigo.velocidad;

    }


    if (Math.abs(dy) > 30) {

        enemigo.y +=
            Math.sign(dy) *
            0.8;

    }


    enemigo.x =
        Math.max(
            10,
            Math.min(
                ANCHO -
                enemigo.ancho -
                10,
                enemigo.x
            )
        );


    enemigo.y =
        Math.max(
            50,
            Math.min(
                500 -
                enemigo.alto,
                enemigo.y
            )
        );

}


/* =========================================================
   ACTUALIZAR ENEMIGOS
========================================================= */

function actualizarEnemigos() {

    for (const enemigo of enemigos) {

        if (enemigo.vida <= 0) {
            continue;
        }


        if (enemigo.tipo === "volador") {

            moverVolador(enemigo);

        }

        else if (enemigo.tipo === "saltador") {

            moverSaltador(enemigo);

        }

        else {

            moverEnemigoTerrestre(enemigo);

        }


        if (enemigo.tipo === "disparador") {

            enemigo.cooldown--;

            if (enemigo.cooldown <= 0) {

                dispararEnemigo(enemigo);

                enemigo.cooldown = 100;

            }

        }


        if (
            colision(
                jugador,
                enemigo
            )
        ) {

            recibirDaño();

            jugador.x +=
                enemigo.direccion *
                45;

        }

    }

}


/* =========================================================
   ATAQUE
========================================================= */

function actualizarAtaque() {

    if (
        teclas.j &&
        !jugador.atacando
    ) {

        jugador.atacando = true;

        jugador.tiempoAtaque = 12;

        jugador.golpeados = [];

    }


    if (!jugador.atacando) {
        return;
    }


    jugador.tiempoAtaque--;


    const espada = {

        x:
            jugador.mirando === 1
                ? jugador.x + jugador.ancho
                : jugador.x - 50,

        y:
            jugador.y + 8,

        ancho: 50,
        alto: 35

    };


    for (const enemigo of enemigos) {

        if (enemigo.vida <= 0) {
            continue;
        }


        if (
            jugador.golpeados.includes(enemigo)
        ) {
            continue;
        }


        if (
            colision(
                espada,
                enemigo
            )
        ) {

            enemigo.vida--;

            jugador.golpeados.push(enemigo);

            enemigo.x +=
                jugador.mirando *
                35;

        }

    }


    if (jugador.tiempoAtaque <= 0) {
        jugador.atacando = false;
    }

}


/* =========================================================
   DISPARAR
========================================================= */

function dispararJugador() {

    if (
        !teclas.k ||
        jugador.disparoCooldown > 0
    ) {
        return;
    }


    balasJugador.push({

        x:
            jugador.mirando === 1
                ? jugador.x + jugador.ancho
                : jugador.x - 12,

        y:
            jugador.y + 20,

        ancho: 12,
        alto: 6,

        velocidad:
            jugador.mirando * 10

    });


    jugador.disparoCooldown = 15;

}


function actualizarBalasJugador() {

    if (jugador.disparoCooldown > 0) {
        jugador.disparoCooldown--;
    }


    for (
        let i = balasJugador.length - 1;
        i >= 0;
        i--
    ) {

        const bala =
            balasJugador[i];


        bala.x +=
            bala.velocidad;


        if (
            bala.x < -30 ||
            bala.x > ANCHO + 30
        ) {

            balasJugador.splice(i, 1);

            continue;

        }


        for (const enemigo of enemigos) {

            if (
                enemigo.vida > 0 &&
                colision(bala, enemigo)
            ) {

                enemigo.vida--;

                balasJugador.splice(i, 1);

                break;

            }

        }

    }

}


/* =========================================================
   BALAS ENEMIGAS
========================================================= */

function dispararEnemigo(enemigo) {

    const direccion =
        jugador.x <
        enemigo.x
            ? -1
            : 1;


    balasEnemigos.push({

        x:
            enemigo.x +
            enemigo.ancho / 2,

        y:
            enemigo.y +
            enemigo.alto / 2,

        ancho: 12,
        alto: 12,

        velocidad:
            direccion * 5

    });

}


function actualizarBalasEnemigos() {

    for (
        let i = balasEnemigos.length - 1;
        i >= 0;
        i--
    ) {

        const bala =
            balasEnemigos[i];


        bala.x +=
            bala.velocidad;


        if (
            bala.x < -30 ||
            bala.x > ANCHO + 30
        ) {

            balasEnemigos.splice(i, 1);

            continue;

        }


        if (
            colision(
                bala,
                jugador
            )
        ) {

            recibirDaño();

            balasEnemigos.splice(i, 1);

        }

    }

}


/* =========================================================
   MONEDAS
========================================================= */

function recogerMonedas() {

    for (const moneda of monedas) {

        if (moneda.recogida) {
            continue;
        }


        if (
            colision(
                jugador,
                moneda
            )
        ) {

            moneda.recogida = true;

            totalMonedas++;
            monedasDesdeVida++;


            if (monedasDesdeVida >= 10) {

                monedasDesdeVida -= 10;

                jugador.vida++;

                mensajeHTML.textContent =
                    "🪙 ¡10 MONEDAS! +1 ❤️";

            }

        }

    }

}


function todasLasMonedasRecogidas() {

    return monedas.every(
        moneda => moneda.recogida
    );

}


function todosLosEnemigosDerrotados() {

    return enemigos.every(
        enemigo => enemigo.vida <= 0
    );

}


/* =========================================================
   OLEADAS
========================================================= */

function comprobarFinOleada() {

    if (cambiando) {
        return;
    }


    const enemigosDerrotados =
        todosLosEnemigosDerrotados();


    const monedasCompletas =
        todasLasMonedasRecogidas();


    if (
        enemigosDerrotados &&
        monedasCompletas
    ) {

        completarOleada();

    }

    else if (
        enemigosDerrotados &&
        !monedasCompletas
    ) {

        mensajeHTML.textContent =
            "🪙 ¡FALTAN MONEDAS! RECOGE TODAS";

    }

}


function completarOleada() {

    cambiando = true;

    contadorCambio = 120;

    jugador.vida++;

    actualizarHUD();

    mensajeHTML.textContent =
        "🏆 ¡OLEADA COMPLETADA! +1 ❤️";

}


function siguienteOleada() {

    cambiando = false;

    oleada++;


    if (
        oleada > OLEADAS_POR_NIVEL
    ) {

        nivel++;

        oleada = 1;

        crearMonedas();

        mensajeHTML.textContent =
            "🌟 ¡NUEVO NIVEL!";

    }


    crearOleada();

}


/* =========================================================
   DAÑO
========================================================= */

function recibirDaño() {

    if (jugador.invulnerable > 0) {
        return;
    }


    jugador.vida--;

    jugador.invulnerable = 60;


    actualizarHUD();


    if (jugador.vida <= 0) {

        jugador.vida = 0;

        cambiando = true;

        mensajeHTML.textContent =
            "💀 GAME OVER";


        setTimeout(function () {

            location.reload();

        }, 1500);

    }

}


function actualizarInvulnerabilidad() {

    if (
        jugador.invulnerable > 0
    ) {

        jugador.invulnerable--;

    }

}


/* =========================================================
   FONDO
========================================================= */

function dibujarFondo() {

    let fondo;


    if (nivel === 1) {
        fondo = "#101025";
    }

    else if (nivel === 2) {
        fondo = "#10251c";
    }

    else if (nivel === 3) {
        fondo = "#24152d";
    }

    else if (nivel === 4) {
        fondo = "#301414";
    }

    else {
        fondo = "#090909";
    }


    ctx.fillStyle = fondo;

    ctx.fillRect(
        0,
        0,
        ANCHO,
        ALTO
    );


    // Luna

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


    // Montañas

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


/* =========================================================
   PLATAFORMAS
========================================================= */

function dibujarPlataformas() {

    for (const plataforma of plataformas) {

        ctx.fillStyle = "#4b3025";

        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            plataforma.alto
        );


        ctx.fillStyle = "#79ad3e";

        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            6
        );

    }

}


/* =========================================================
   MONEDAS
========================================================= */

function dibujarMonedas() {

    for (const moneda of monedas) {

        if (moneda.recogida) {
            continue;
        }


        ctx.fillStyle = "#ffd700";

        ctx.beginPath();

        ctx.arc(
            moneda.x + 10,
            moneda.y + 10,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle = "#fff5a0";

        ctx.fillRect(
            moneda.x + 6,
            moneda.y + 4,
            4,
            5
        );

    }

}


/* =========================================================
   JUGADOR
========================================================= */

function dibujarJugador() {

    if (
        jugador.invulnerable > 0 &&
        Math.floor(
            jugador.invulnerable / 5
        ) % 2 === 0
    ) {

        return;

    }


    // Cuerpo

    ctx.fillStyle = "#eeeeee";

    ctx.fillRect(
        jugador.x,
        jugador.y,
        jugador.ancho,
        jugador.alto
    );


    // Cabeza

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        jugador.x + 4,
        jugador.y - 15,
        26,
        20
    );


    // Ojos

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


    // Espada

    if (jugador.atacando) {

        ctx.fillStyle = "#dddddd";


        if (jugador.mirando === 1) {

            ctx.fillRect(
                jugador.x + 30,
                jugador.y + 15,
                55,
                8
            );

        }

        else {

            ctx.fillRect(
                jugador.x - 50,
                jugador.y + 15,
                55,
                8
            );

        }

    }

}


/* =========================================================
   ENEMIGOS
========================================================= */

function dibujarEnemigos() {

    for (const enemigo of enemigos) {

        if (enemigo.vida <= 0) {
            continue;
        }


        if (enemigo.tipo === "normal") {
            ctx.fillStyle = "#d52d36";
        }

        else if (enemigo.tipo === "saltador") {
            ctx.fillStyle = "#ff8500";
        }

        else if (enemigo.tipo === "tanque") {
            ctx.fillStyle = "#050505";
        }

        else if (enemigo.tipo === "volador") {
            ctx.fillStyle = "#a239d6";
        }

        else if (enemigo.tipo === "disparador") {
            ctx.fillStyle = "#3685dc";
        }

        else {
            ctx.fillStyle = "#e000a8";
        }


        ctx.fillRect(
            enemigo.x,
            enemigo.y,
            enemigo.ancho,
            enemigo.alto
        );


        // Ojos

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            enemigo.x + 7,
            enemigo.y + 10,
            7,
            7
        );

        ctx.fillRect(
            enemigo.x +
            enemigo.ancho -
            14,
            enemigo.y + 10,
            7,
            7
        );


        // Barra de vida

        ctx.fillStyle = "#222222";

        ctx.fillRect(
            enemigo.x,
            enemigo.y - 9,
            enemigo.ancho,
            5
        );


        ctx.fillStyle = "#e33b3b";

        ctx.fillRect(
            enemigo.x,
            enemigo.y - 9,
            enemigo.ancho *
            (
                enemigo.vida /
                enemigo.vidaMaxima
            ),
            5
        );


        // Alas

        if (enemigo.tipo === "volador") {

            ctx.fillStyle = "#d08cff";

            ctx.fillRect(
                enemigo.x - 10,
                enemigo.y + 8,
                10,
                18
            );

            ctx.fillRect(
                enemigo.x +
                enemigo.ancho,
                enemigo.y + 8,
                10,
                18
            );

        }

    }

}


/* =========================================================
   BALAS
========================================================= */

function dibujarBalas() {

    // Balas del jugador

    for (const bala of balasJugador) {

        ctx.fillStyle = "#ffff55";

        ctx.fillRect(
            bala.x,
            bala.y,
            bala.ancho,
            bala.alto
        );

    }


    // Balas enemigas

    for (const bala of balasEnemigos) {

        ctx.fillStyle = "#ff3030";

        ctx.beginPath();

        ctx.arc(
            bala.x + 6,
            bala.y + 6,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   ACTUALIZAR
========================================================= */

function actualizar() {

    if (!cambiando) {

        moverJugador();

        actualizarAtaque();

        dispararJugador();

        actualizarBalasJugador();

        actualizarBalasEnemigos();

        actualizarEnemigos();

        recogerMonedas();

        actualizarInvulnerabilidad();

        comprobarFinOleada();

    }

    else {

        contadorCambio--;

        if (contadorCambio <= 0) {
            siguienteOleada();
        }

    }


    actualizarHUD();

}


/* =========================================================
   DIBUJAR
========================================================= */

function dibujar() {

    dibujarFondo();

    dibujarPlataformas();

    dibujarMonedas();

    dibujarEnemigos();

    dibujarBalas();

    dibujarJugador();

}


/* =========================================================
   BUCLE PRINCIPAL
========================================================= */

function juego() {

    actualizar();

    dibujar();

    requestAnimationFrame(juego);

}


/* =========================================================
   INICIAR JUEGO
========================================================= */

function iniciarJuego() {

    crearMapa();

    crearMonedas();

    crearOleada();

    actualizarHUD();

    mensajeHTML.textContent =
        "⚔️ NIVEL 1 - OLEADA 1";

    juego();

}


/* =========================================================
   INICIO SEGURO
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarJuego
    );

}

else {

    iniciarJuego();

}
