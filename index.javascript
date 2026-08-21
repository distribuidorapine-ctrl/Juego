"use strict";


// =====================================================
// CANVAS
// =====================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


// =====================================================
// INTERFAZ
// =====================================================

const vidaTexto = document.getElementById("vida");
const monedasTexto = document.getElementById("monedas");
const nivelTexto = document.getElementById("nivel");
const oleadaTexto = document.getElementById("oleada");
const mensaje = document.getElementById("mensaje");


// =====================================================
// TECLADO
// =====================================================

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


// =====================================================
// JUGADOR
// =====================================================

const jugador = {

    x: 100,
    y: 400,

    ancho: 35,
    alto: 50,

    velocidad: 5,

    velocidadY: 0,

    gravedad: 0.6,

    fuerzaSalto: -13,

    suelo: false,

    mirando: 1,

    vida: 5,

    vidaMaxima: 5,

    atacando: false,

    ataqueTiempo: 0,

    ataqueGolpeado: false,

    invulnerable: false,

    tiempoInvulnerable: 0

};


// =====================================================
// NIVEL
// =====================================================

let nivel = 1;
let oleada = 1;

const oleadasMaximas = 3;

let cambiandoOleada = false;
let tiempoCambio = 0;


// =====================================================
// PLATAFORMAS
// =====================================================

const plataformas = [

    {
        x: 0,
        y: 550,
        ancho: 1000,
        alto: 50
    },

    {
        x: 100,
        y: 450,
        ancho: 200,
        alto: 25
    },

    {
        x: 400,
        y: 380,
        ancho: 220,
        alto: 25
    },

    {
        x: 700,
        y: 450,
        ancho: 200,
        alto: 25
    },

    {
        x: 600,
        y: 270,
        ancho: 180,
        alto: 25
    }

];


// =====================================================
// ENEMIGOS
// =====================================================

let enemigos = [];


// =====================================================
// BALAS
// =====================================================

let balasJugador = [];

let balasEnemigos = [];

let puedeDisparar = true;


// =====================================================
// MONEDAS
// =====================================================

let monedas = [

    {
        x: 200,
        y: 410,
        ancho: 20,
        alto: 20,
        recogida: false
    },

    {
        x: 500,
        y: 340,
        ancho: 20,
        alto: 20,
        recogida: false
    },

    {
        x: 850,
        y: 410,
        ancho: 20,
        alto: 20,
        recogida: false
    }

];

let cantidadMonedas = 0;


// =====================================================
// COLISIÓN
// =====================================================

function colision(a, b) {

    return (

        a.x < b.x + b.ancho &&

        a.x + a.ancho > b.x &&

        a.y < b.y + b.alto &&

        a.y + a.alto > b.y

    );

}


// =====================================================
// CREAR ENEMIGO
// =====================================================

function crearEnemigo(tipo) {

    const enemigo = {

        x: 650 + Math.random() * 250,

        y: 300,

        ancho: 35,

        alto: 50,

        velocidad: 1.2,

        vida: 3,

        vidaMaxima: 3,

        direccion: -1,

        tipo: tipo,

        contadorDisparo: 120

    };


    if (tipo === "rapido") {

        enemigo.velocidad = 2.5;

        enemigo.vida = 2;

        enemigo.vidaMaxima = 2;

        enemigo.ancho = 30;

        enemigo.alto = 40;

    }


    if (tipo === "tanque") {

        enemigo.velocidad = 0.6;

        enemigo.vida = 8;

        enemigo.vidaMaxima = 8;

        enemigo.ancho = 50;

        enemigo.alto = 65;

    }


    if (tipo === "disparador") {

        enemigo.velocidad = 0.7;

        enemigo.vida = 4;

        enemigo.vidaMaxima = 4;

        enemigo.contadorDisparo = 100;

    }


    if (tipo === "elite") {

        enemigo.velocidad = 2;

        enemigo.vida = 12;

        enemigo.vidaMaxima = 12;

        enemigo.ancho = 50;

        enemigo.alto = 65;

    }


    return enemigo;

}


// =====================================================
// CREAR OLEADA
// =====================================================

function crearOleada() {

    enemigos = [];

    balasJugador = [];

    balasEnemigos = [];


    jugador.x = 100;
    jugador.y = 300;

    jugador.velocidadY = 0;


    let cantidad = 2 + nivel + oleada;


    for (let i = 0; i < cantidad; i++) {

        let tipo = "normal";


        if (nivel === 1) {

            tipo = "normal";

        }

        else if (nivel === 2) {

            tipo = i % 3 === 0
                ? "rapido"
                : "normal";

        }

        else if (nivel === 3) {

            if (i % 4 === 0) {
                tipo = "tanque";
            }

            else if (i % 2 === 0) {
                tipo = "rapido";
            }

            else {
                tipo = "normal";
            }

        }

        else if (nivel === 4) {

            if (i % 4 === 0) {
                tipo = "disparador";
            }

            else if (i % 3 === 0) {
                tipo = "tanque";
            }

            else {
                tipo = "rapido";
            }

        }

        else {

            if (i % 5 === 0) {
                tipo = "elite";
            }

            else if (i % 4 === 0) {
                tipo = "disparador";
            }

            else if (i % 3 === 0) {
                tipo = "tanque";
            }

            else if (i % 2 === 0) {
                tipo = "rapido";
            }

            else {
                tipo = "normal";
            }

        }


        enemigos.push(
            crearEnemigo(tipo)
        );

    }


    actualizarInterfaz();

    mensaje.textContent =
        "Nivel " + nivel +
        " | Oleada " + oleada;

}


// =====================================================
// SIGUIENTE OLEADA
// =====================================================

function siguienteOleada() {

    cambiandoOleada = false;


    oleada++;


    if (oleada > oleadasMaximas) {

        nivel++;

        oleada = 1;


        jugador.vida += 2;


        if (jugador.vida > jugador.vidaMaxima) {
            jugador.vida = jugador.vidaMaxima;
        }


        mensaje.textContent =
            "⭐ ¡NIVEL " + nivel + "!";

    }


    crearOleada();

}


// =====================================================
// MOVIMIENTO
// =====================================================

function moverJugador() {

    if (
        teclas.a ||
        teclas.arrowleft
    ) {

        jugador.x -= jugador.velocidad;

        jugador.mirando = -1;

    }


    if (
        teclas.d ||
        teclas.arrowright
    ) {

        jugador.x += jugador.velocidad;

        jugador.mirando = 1;

    }


    if (

        (
            teclas.w ||
            teclas.arrowup ||
            teclas.space
        )

        &&

        jugador.suelo

    ) {

        jugador.velocidadY =
            jugador.fuerzaSalto;

        jugador.suelo = false;

    }


    jugador.velocidadY +=
        jugador.gravedad;


    jugador.y +=
        jugador.velocidadY;


    jugador.suelo = false;


    for (
        const plataforma of plataformas
    ) {

        if (

            jugador.x <
            plataforma.x +
            plataforma.ancho

            &&

            jugador.x +
            jugador.ancho >
            plataforma.x

            &&

            jugador.y +
            jugador.alto >=
            plataforma.y

            &&

            jugador.y +
            jugador.alto <=
            plataforma.y +
            plataforma.alto + 15

            &&

            jugador.velocidadY >= 0

        ) {

            jugador.y =
                plataforma.y -
                jugador.alto;

            jugador.velocidadY = 0;

            jugador.suelo = true;

        }

    }


    if (jugador.x < 0) {
        jugador.x = 0;
    }


    if (
        jugador.x + jugador.ancho >
        canvas.width
    ) {

        jugador.x =
            canvas.width -
            jugador.ancho;

    }


    if (jugador.y > canvas.height + 100) {

        perderVida();

        jugador.x = 100;
        jugador.y = 300;

        jugador.velocidadY = 0;

    }

}


// =====================================================
// ATAQUE
// =====================================================

function actualizarAtaque() {

    if (
        teclas.j &&
        !jugador.atacando
    ) {

        jugador.atacando = true;

        jugador.ataqueTiempo = 12;

        jugador.ataqueGolpeado = false;

    }


    if (!jugador.atacando) {
        return;
    }


    jugador.ataqueTiempo--;


    const espada = {

        x:
            jugador.mirando === 1
                ? jugador.x + jugador.ancho
                : jugador.x - 50,

        y:
            jugador.y + 10,

        ancho: 50,

        alto: 35

    };


    if (!jugador.ataqueGolpeado) {

        for (
            const enemigo of enemigos
        ) {

            if (
                enemigo.vida > 0 &&
                colision(espada, enemigo)
            ) {

                enemigo.vida--;

                enemigo.x +=
                    jugador.mirando * 35;

                jugador.ataqueGolpeado = true;

                break;

            }

        }

    }


    if (jugador.ataqueTiempo <= 0) {

        jugador.atacando = false;

    }

}


// =====================================================
// DISPARO
// =====================================================

function disparar() {

    if (
        !teclas.k ||
        !puedeDisparar
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


    puedeDisparar = false;


    setTimeout(function () {

        puedeDisparar = true;

    }, 250);

}


// =====================================================
// BALAS DEL JUGADOR
// =====================================================

function actualizarBalasJugador() {

    for (
        let i = balasJugador.length - 1;
        i >= 0;
        i--
    ) {

        const bala = balasJugador[i];

        bala.x += bala.velocidad;


        if (
            bala.x < -20 ||
            bala.x > canvas.width + 20
        ) {

            balasJugador.splice(i, 1);

            continue;

        }


        for (
            const enemigo of enemigos
        ) {

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


// =====================================================
// ENEMIGOS
// =====================================================

function actualizarEnemigos() {

    for (
        const enemigo of enemigos
    ) {

        if (enemigo.vida <= 0) {
            continue;
        }


        enemigo.x +=
            enemigo.velocidad *
            enemigo.direccion;


        if (enemigo.x < 350) {

            enemigo.x = 350;

            enemigo.direccion = 1;

        }


        if (
            enemigo.x + enemigo.ancho > 950
        ) {

            enemigo.x =
                950 - enemigo.ancho;

            enemigo.direccion = -1;

        }


        if (
            enemigo.tipo === "disparador"
        ) {

            enemigo.contadorDisparo--;


            if (
                enemigo.contadorDisparo <= 0
            ) {

                disparoEnemigo(enemigo);

                enemigo.contadorDisparo = 120;

            }

        }


        if (
            colision(jugador, enemigo)
        ) {

            perderVida();

            jugador.x +=
                enemigo.direccion * 50;

        }

    }

}


// =====================================================
// DISPARO ENEMIGO
// =====================================================

function disparoEnemigo(enemigo) {

    const direccion =
        jugador.x < enemigo.x
            ? -1
            : 1;


    balasEnemigos.push({

        x: enemigo.x,

        y: enemigo.y + 20,

        ancho: 10,

        alto: 10,

        velocidad:
            direccion * 5

    });

}


// =====================================================
// BALAS ENEMIGAS
// =====================================================

function actualizarBalasEnemigos() {

    for (
        let i = balasEnemigos.length - 1;
        i >= 0;
        i--
    ) {

        const bala = balasEnemigos[i];

        bala.x += bala.velocidad;


        if (
            bala.x < -20 ||
            bala.x > canvas.width + 20
        ) {

            balasEnemigos.splice(i, 1);

            continue;

        }


        if (
            colision(bala, jugador)
        ) {

            perderVida();

            balasEnemigos.splice(i, 1);

        }

    }

}


// =====================================================
// DAÑO
// =====================================================

function perderVida() {

    if (jugador.invulnerable) {
        return;
    }


    jugador.vida--;

    jugador.invulnerable = true;

    jugador.tiempoInvulnerable = 60;


    actualizarInterfaz();


    if (jugador.vida <= 0) {

        mensaje.textContent =
            "💀 GAME OVER - Recargando...";


        setTimeout(function () {

            location.reload();

        }, 1500);

    }

}


// =====================================================
// INVULNERABILIDAD
// =====================================================

function actualizarInvulnerabilidad() {

    if (!jugador.invulnerable) {
        return;
    }


    jugador.tiempoInvulnerable--;


    if (
        jugador.tiempoInvulnerable <= 0
    ) {

        jugador.invulnerable = false;

    }

}


// =====================================================
// MONEDAS
// =====================================================

function recogerMonedas() {

    for (
        const moneda of monedas
    ) {

        if (moneda.recogida) {
            continue;
        }


        if (
            colision(jugador, moneda)
        ) {

            moneda.recogida = true;

            cantidadMonedas++;

        }

    }

}


// =====================================================
// OLEADAS
// =====================================================

function comprobarOleada() {

    if (cambiandoOleada) {
        return;
    }


    const vivos =
        enemigos.filter(
            function (enemigo) {
                return enemigo.vida > 0;
            }
        ).length;


    if (vivos === 0) {

        cambiandoOleada = true;

        tiempoCambio = 100;

        mensaje.textContent =
            "🌊 ¡OLEADA COMPLETADA!";

    }

}


// =====================================================
// DIBUJAR FONDO
// =====================================================

function dibujarFondo() {

    ctx.fillStyle = "#111122";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle = "#ddddaa";

    ctx.beginPath();

    ctx.arc(
        820,
        100,
        50,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "#252545";

    ctx.beginPath();

    ctx.moveTo(0, 450);

    ctx.lineTo(180, 250);

    ctx.lineTo(350, 450);

    ctx.lineTo(550, 220);

    ctx.lineTo(800, 450);

    ctx.lineTo(1000, 250);

    ctx.lineTo(1000, 600);

    ctx.lineTo(0, 600);

    ctx.fill();

}


// =====================================================
// PLATAFORMAS
// =====================================================

function dibujarPlataformas() {

    for (
        const plataforma of plataformas
    ) {

        ctx.fillStyle = "#4a3025";

        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            plataforma.alto
        );


        ctx.fillStyle = "#75a83b";

        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            6
        );

    }

}


// =====================================================
// JUGADOR
// =====================================================

function dibujarJugador() {

    if (
        jugador.invulnerable &&
        Math.floor(
            jugador.tiempoInvulnerable / 5
        ) % 2 === 0
    ) {

        return;

    }


    ctx.fillStyle = "#eeeeee";

    ctx.fillRect(
        jugador.x,
        jugador.y,
        jugador.ancho,
        jugador.alto
    );


    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        jugador.x + 5,
        jugador.y - 15,
        25,
        20
    );


    ctx.fillStyle = "#111111";

    ctx.fillRect(
        jugador.x + 10,
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


    if (jugador.atacando) {

        ctx.fillStyle = "#eeeeee";


        if (jugador.mirando === 1) {

            ctx.fillRect(
                jugador.x + 30,
                jugador.y + 15,
                50,
                8
            );

        }
        else {

            ctx.fillRect(
                jugador.x - 45,
                jugador.y + 15,
                50,
                8
            );

        }

    }

}


// =====================================================
// ENEMIGOS
// =====================================================

function dibujarEnemigos() {

    for (
        const enemigo of enemigos
    ) {

        if (enemigo.vida <= 0) {
            continue;
        }


        if (enemigo.tipo === "normal") {
            ctx.fillStyle = "#b52d35";
        }

        else if (enemigo.tipo === "rapido") {
            ctx.fillStyle = "#e47722";
        }

        else if (enemigo.tipo === "tanque") {
            ctx.fillStyle = "#555566";
        }

        else if (enemigo.tipo === "disparador") {
            ctx.fillStyle = "#843bb5";
        }

        else {
            ctx.fillStyle = "#d128b4";
        }


        ctx.fillRect(
            enemigo.x,
            enemigo.y,
            enemigo.ancho,
            enemigo.alto
        );


        ctx.fillStyle = "white";

        ctx.fillRect(
            enemigo.x + 7,
            enemigo.y + 10,
            7,
            7
        );


        ctx.fillRect(
            enemigo.x +
            enemigo.ancho - 14,
            enemigo.y + 10,
            7,
            7
        );


        ctx.fillStyle = "#222";

        ctx.fillRect(
            enemigo.x,
            enemigo.y - 10,
            enemigo.ancho,
            5
        );


        ctx.fillStyle = "#ff3333";

        ctx.fillRect(
            enemigo.x,
            enemigo.y - 10,
            enemigo.ancho *
            (
                enemigo.vida /
                enemigo.vidaMaxima
            ),
            5
        );

    }

}


// =====================================================
// BALAS
// =====================================================

function dibujarBalas() {

    for (
        const bala of balasJugador
    ) {

        ctx.fillStyle = "#ffff55";

        ctx.fillRect(
            bala.x,
            bala.y,
            bala.ancho,
            bala.alto
        );

    }


    for (
        const bala of balasEnemigos
    ) {

        ctx.fillStyle = "#ff3333";

        ctx.beginPath();

        ctx.arc(
            bala.x + 5,
            bala.y + 5,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// =====================================================
// MONEDAS
// =====================================================

function dibujarMonedas() {

    for (
        const moneda of monedas
    ) {

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

    }

}


// =====================================================
// INTERFAZ
// =====================================================

function actualizarInterfaz() {

    vidaTexto.textContent =
        jugador.vida;

    monedasTexto.textContent =
        cantidadMonedas;

    nivelTexto.textContent =
        nivel;

    oleadaTexto.textContent =
        oleada;

}


// =====================================================
// ACTUALIZAR
// =====================================================

function actualizar() {

    moverJugador();

    actualizarAtaque();

    disparar();

    actualizarBalasJugador();

    actualizarBalasEnemigos();

    actualizarEnemigos();

    actualizarInvulnerabilidad();

    recogerMonedas();

    comprobarOleada();


    if (cambiandoOleada) {

        tiempoCambio--;


        if (tiempoCambio <= 0) {

            siguienteOleada();

        }

    }


    actualizarInterfaz();

}


// =====================================================
// DIBUJAR
// =====================================================

function dibujar() {

    dibujarFondo();

    dibujarPlataformas();

    dibujarMonedas();

    dibujarEnemigos();

    dibujarBalas();

    dibujarJugador();

}


// =====================================================
// GAME LOOP
// =====================================================

function juego() {

    actualizar();

    dibujar();

    requestAnimationFrame(juego);

}


// =====================================================
// INICIO
// =====================================================

crearOleada();

actualizarInterfaz();

mensaje.textContent =
    "¡JUEGO CARGADO!";

juego();
