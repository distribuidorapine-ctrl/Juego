"use strict";

// ============================================================
// CANVAS
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const vidaTexto = document.getElementById("vida");
const monedasTexto = document.getElementById("monedas");
const nivelTexto = document.getElementById("nivel");
const oleadaTexto = document.getElementById("oleada");
const mensaje = document.getElementById("mensaje");


// ============================================================
// TECLADO
// ============================================================

const teclas = {};

document.addEventListener("keydown", function (e) {

    teclas[e.key.toLowerCase()] = true;

    if (e.code === "Space") {

        teclas.space = true;

        e.preventDefault();
    }

});

document.addEventListener("keyup", function (e) {

    teclas[e.key.toLowerCase()] = false;

    if (e.code === "Space") {

        teclas.space = false;
    }

});


// ============================================================
// JUGADOR
// ============================================================

const jugador = {

    x: 100,
    y: 300,

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

    ataqueGolpeados: [],

    invulnerable: false,

    invulnerableTiempo: 0
};


// ============================================================
// SISTEMA DE NIVELES
// ============================================================

let nivel = 1;

let oleada = 1;

const OLEADAS_POR_NIVEL = 3;

let cambiando = false;

let contadorCambio = 0;


// ============================================================
// PLATAFORMAS
// ============================================================

let plataformas = [];


// ============================================================
// ENEMIGOS
// ============================================================

let enemigos = [];


// ============================================================
// PROYECTILES
// ============================================================

let balasJugador = [];

let balasEnemigos = [];

let puedeDisparar = true;


// ============================================================
// MONEDAS
// ============================================================

let monedas = [];

let cantidadMonedas = 0;


// ============================================================
// COLISIÓN
// ============================================================

function colision(a, b) {

    return (

        a.x < b.x + b.ancho &&

        a.x + a.ancho > b.x &&

        a.y < b.y + b.alto &&

        a.y + a.alto > b.y

    );
}


// ============================================================
// CREAR MAPA
// ============================================================

function crearMapa() {

    plataformas = [];

    // SUELO
    plataformas.push({
        x: 0,
        y: 550,
        ancho: 1000,
        alto: 50
    });


    // ========================================================
    // NIVEL 1
    // ========================================================

    if (nivel === 1) {

        plataformas.push({
            x: 100,
            y: 450,
            ancho: 200,
            alto: 25
        });

        plataformas.push({
            x: 400,
            y: 380,
            ancho: 220,
            alto: 25
        });

        plataformas.push({
            x: 700,
            y: 450,
            ancho: 200,
            alto: 25
        });

        plataformas.push({
            x: 600,
            y: 270,
            ancho: 180,
            alto: 25
        });
    }


    // ========================================================
    // NIVEL 2
    // ========================================================

    else if (nivel === 2) {

        plataformas.push({
            x: 50,
            y: 430,
            ancho: 150,
            alto: 25
        });

        plataformas.push({
            x: 280,
            y: 350,
            ancho: 160,
            alto: 25
        });

        plataformas.push({
            x: 520,
            y: 450,
            ancho: 150,
            alto: 25
        });

        plataformas.push({
            x: 760,
            y: 330,
            ancho: 180,
            alto: 25
        });

        plataformas.push({
            x: 400,
            y: 220,
            ancho: 170,
            alto: 25
        });
    }


    // ========================================================
    // NIVEL 3
    // ========================================================

    else if (nivel === 3) {

        plataformas.push({
            x: 60,
            y: 420,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 240,
            y: 300,
            ancho: 140,
            alto: 25
        });

        plataformas.push({
            x: 430,
            y: 450,
            ancho: 130,
            alto: 25
        });

        plataformas.push({
            x: 600,
            y: 330,
            ancho: 140,
            alto: 25
        });

        plataformas.push({
            x: 800,
            y: 230,
            ancho: 140,
            alto: 25
        });

        plataformas.push({
            x: 450,
            y: 180,
            ancho: 130,
            alto: 25
        });
    }


    // ========================================================
    // NIVEL 4
    // ========================================================

    else if (nivel === 4) {

        plataformas.push({
            x: 50,
            y: 350,
            ancho: 120,
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
            ancho: 110,
            alto: 25
        });

        plataformas.push({
            x: 870,
            y: 180,
            ancho: 100,
            alto: 25
        });
    }


    // ========================================================
    // NIVEL 5+
    // ========================================================

    else {

        plataformas.push({
            x: 40,
            y: 420,
            ancho: 120,
            alto: 25
        });

        plataformas.push({
            x: 200,
            y: 300,
            ancho: 120,
            alto: 25
        });

        plataformas.push({
            x: 370,
            y: 440,
            ancho: 120,
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


// ============================================================
// FÍSICA CONTRA PLATAFORMAS
// ============================================================

function aplicarFisica(entidad) {

    entidad.velocidadY += entidad.gravedad;

    entidad.y += entidad.velocidadY;

    entidad.suelo = false;


    for (const plataforma of plataformas) {

        if (

            entidad.x <
            plataforma.x + plataforma.ancho

            &&

            entidad.x + entidad.ancho >
            plataforma.x

            &&

            entidad.y + entidad.alto >=
            plataforma.y

            &&

            entidad.y + entidad.alto <=
            plataforma.y + plataforma.alto + 15

            &&

            entidad.velocidadY >= 0

        ) {

            entidad.y =
                plataforma.y - entidad.alto;

            entidad.velocidadY = 0;

            entidad.suelo = true;
        }
    }
}


// ============================================================
// CREAR ENEMIGO
// ============================================================

function crearEnemigo(tipo) {

    const enemigo = {

        x: 700 + Math.random() * 200,

        y: 100,

        ancho: 35,

        alto: 45,

        velocidad: 1.2,

        velocidadY: 0,

        gravedad: 0.6,

        fuerzaSalto: -11,

        suelo: false,

        direccion: -1,

        vida: 3,

        vidaMaxima: 3,

        tipo: tipo,

        tiempoSalto: 60,

        tiempoDisparo: 100,

        daño: 1
    };


    // NORMAL
    if (tipo === "normal") {

        enemigo.velocidad = 1.2;

        enemigo.vida = 3;

        enemigo.vidaMaxima = 3;
    }


    // NARANJA
    if (tipo === "saltador") {

        enemigo.velocidad = 1.7;

        enemigo.vida = 3;

        enemigo.vidaMaxima = 3;

        enemigo.tiempoSalto = 50;
    }


    // TANQUE
    if (tipo === "tanque") {

        enemigo.ancho = 50;

        enemigo.alto = 65;

        enemigo.velocidad = 0.6;

        enemigo.vida = 8;

        enemigo.vidaMaxima = 8;

        enemigo.daño = 2;
    }


    // VOLADOR
    if (tipo === "volador") {

        enemigo.ancho = 40;

        enemigo.alto = 35;

        enemigo.velocidad = 1.5;

        enemigo.vida = 4;

        enemigo.vidaMaxima = 4;

        enemigo.y =
            120 + Math.random() * 200;
    }


    // DISPARADOR
    if (tipo === "disparador") {

        enemigo.velocidad = 0.7;

        enemigo.vida = 5;

        enemigo.vidaMaxima = 5;

        enemigo.tiempoDisparo = 100;
    }


    // ELITE
    if (tipo === "elite") {

        enemigo.ancho = 50;

        enemigo.alto = 65;

        enemigo.velocidad = 1.5;

        enemigo.vida = 12;

        enemigo.vidaMaxima = 12;

        enemigo.daño = 2;
    }


    return enemigo;
}


// ============================================================
// CREAR OLEADA
// ============================================================

function crearOleada() {

    enemigos = [];

    balasJugador = [];

    balasEnemigos = [];

    crearMapa();


    jugador.x = 100;

    jugador.y = 300;

    jugador.velocidadY = 0;


    const cantidad =
        2 + nivel + oleada;


    for (let i = 0; i < cantidad; i++) {

        let tipo = "normal";


        // NIVEL 1
        if (nivel === 1) {

            tipo = "normal";
        }


        // NIVEL 2
        else if (nivel === 2) {

            if (i % 3 === 0) {
                tipo = "saltador";
            }
            else {
                tipo = "normal";
            }
        }


        // NIVEL 3
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


        // NIVEL 4
        else if (nivel === 4) {

            if (i % 4 === 0) {
                tipo = "disparador";
            }
            else if (i % 3 === 0) {
                tipo = "volador";
            }
            else if (i % 2 === 0) {
                tipo = "saltador";
            }
            else {
                tipo = "tanque";
            }
        }


        // NIVEL 5+
        else {

            if (i % 5 === 0) {
                tipo = "elite";
            }
            else if (i % 4 === 0) {
                tipo = "disparador";
            }
            else if (i % 3 === 0) {
                tipo = "volador";
            }
            else if (i % 2 === 0) {
                tipo = "saltador";
            }
            else {
                tipo = "tanque";
            }
        }


        enemigos.push(
            crearEnemigo(tipo)
        );
    }


    mensaje.textContent =
        "⚔️ NIVEL " +
        nivel +
        " - OLEADA " +
        oleada;


    actualizarInterfaz();
}


// ============================================================
// MOVIMIENTO DEL JUGADOR
// ============================================================

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
            teclas.space ||
            teclas.w ||
            teclas.arrowup
        )

        &&

        jugador.suelo

    ) {

        jugador.velocidadY =
            jugador.fuerzaSalto;

        jugador.suelo = false;
    }


    aplicarFisica(jugador);


    // LÍMITES

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


    // CAER DEL MAPA

    if (
        jugador.y >
        canvas.height + 100
    ) {

        perderVida();

        jugador.x = 100;

        jugador.y = 300;

        jugador.velocidadY = 0;
    }
}


// ============================================================
// ACTUALIZAR ENEMIGOS
// ============================================================

function actualizarEnemigos() {

    for (const enemigo of enemigos) {

        if (enemigo.vida <= 0) {
            continue;
        }


        // NORMAL
        if (
            enemigo.tipo === "normal"
        ) {

            moverEnemigoNormal(enemigo);
        }


        // NARANJA
        else if (
            enemigo.tipo === "saltador"
        ) {

            moverEnemigoSaltador(enemigo);
        }


        // TANQUE
        else if (
            enemigo.tipo === "tanque"
        ) {

            moverEnemigoNormal(enemigo);
        }


        // VOLADOR
        else if (
            enemigo.tipo === "volador"
        ) {

            moverEnemigoVolador(enemigo);
        }


        // DISPARADOR
        else if (
            enemigo.tipo === "disparador"
        ) {

            moverEnemigoDisparador(enemigo);
        }


        // ELITE
        else if (
            enemigo.tipo === "elite"
        ) {

            moverEnemigoNormal(enemigo);
        }


        // DAÑO DE CONTACTO

        if (
            colision(jugador, enemigo)
        ) {

            perderVida();

            jugador.x +=
                enemigo.direccion * 50;
        }
    }
}


// ============================================================
// ENEMIGO NORMAL
// ============================================================

function moverEnemigoNormal(enemigo) {

    aplicarFisica(enemigo);


    if (
        jugador.x < enemigo.x
    ) {

        enemigo.direccion = -1;
    }
    else {

        enemigo.direccion = 1;
    }


    enemigo.x +=
        enemigo.velocidad *
        enemigo.direccion;


    limitarEnemigo(enemigo);
}


// ============================================================
// ENEMIGO NARANJA SALTADOR
// ============================================================

function moverEnemigoSaltador(enemigo) {

    aplicarFisica(enemigo);


    if (
        jugador.x < enemigo.x
    ) {

        enemigo.direccion = -1;
    }
    else {

        enemigo.direccion = 1;
    }


    enemigo.x +=
        enemigo.velocidad *
        enemigo.direccion;


    enemigo.tiempoSalto--;


    if (
        enemigo.suelo &&
        enemigo.tiempoSalto <= 0
    ) {

        enemigo.velocidadY =
            enemigo.fuerzaSalto;

        enemigo.tiempoSalto = 70;
    }


    limitarEnemigo(enemigo);
}


// ============================================================
// ENEMIGO VOLADOR
// ============================================================

function moverEnemigoVolador(enemigo) {

    // NO TIENE GRAVEDAD

    if (
        jugador.x < enemigo.x
    ) {

        enemigo.x -=
            enemigo.velocidad;
    }
    else {

        enemigo.x +=
            enemigo.velocidad;
    }


    // SIGUE AL JUGADOR

    if (
        jugador.y < enemigo.y
    ) {

        enemigo.y -= 0.8;
    }


    if (
        jugador.y > enemigo.y
    ) {

        enemigo.y += 0.8;
    }


    if (enemigo.x < 300) {
        enemigo.x = 300;
    }


    if (
        enemigo.x + enemigo.ancho >
        950
    ) {

        enemigo.x =
            950 - enemigo.ancho;
    }


    if (enemigo.y < 80) {
        enemigo.y = 80;
    }


    if (
        enemigo.y + enemigo.alto >
        500
    ) {

        enemigo.y =
            500 - enemigo.alto;
    }
}


// ============================================================
// ENEMIGO DISPARADOR
// ============================================================

function moverEnemigoDisparador(enemigo) {

    aplicarFisica(enemigo);


    // Mantiene cierta distancia

    if (
        jugador.x <
        enemigo.x - 180
    ) {

        enemigo.x -= 0.5;
    }


    if (
        jugador.x >
        enemigo.x + 180
    ) {

        enemigo.x += 0.5;
    }


    enemigo.tiempoDisparo--;


    if (
        enemigo.tiempoDisparo <= 0
    ) {

        dispararEnemigo(enemigo);

        enemigo.tiempoDisparo = 100;
    }


    limitarEnemigo(enemigo);
}


// ============================================================
// LIMITAR ENEMIGO
// ============================================================

function limitarEnemigo(enemigo) {

    if (enemigo.x < 200) {

        enemigo.x = 200;

        enemigo.direccion = 1;
    }


    if (
        enemigo.x + enemigo.ancho >
        970
    ) {

        enemigo.x =
            970 - enemigo.ancho;

        enemigo.direccion = -1;
    }
}


// ============================================================
// ATAQUE CON J
// ============================================================

function actualizarAtaque() {

    if (
        teclas.j &&
        !jugador.atacando
    ) {

        jugador.atacando = true;

        jugador.ataqueTiempo = 12;

        jugador.ataqueGolpeados = [];
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


    for (
        const enemigo of enemigos
    ) {

        if (
            enemigo.vida <= 0
        ) {
            continue;
        }


        if (
            jugador.ataqueGolpeados.includes(
                enemigo
            )
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

            jugador.ataqueGolpeados.push(
                enemigo
            );

            enemigo.x +=
                jugador.mirando * 35;
        }
    }


    if (
        jugador.ataqueTiempo <= 0
    ) {

        jugador.atacando = false;
    }
}


// ============================================================
// DISPARO DEL JUGADOR
// ============================================================

function dispararJugador() {

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
            jugador.y + 22,

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


// ============================================================
// ACTUALIZAR BALAS JUGADOR
// ============================================================

function actualizarBalasJugador() {

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
                colision(
                    bala,
                    enemigo
                )
            ) {

                enemigo.vida--;

                balasJugador.splice(i, 1);

                break;
            }
        }
    }
}


// ============================================================
// DISPARAR ENEMIGO
// ============================================================

function dispararEnemigo(enemigo) {

    let direccion = 1;


    if (
        jugador.x <
        enemigo.x
    ) {

        direccion = -1;
    }


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


// ============================================================
// ACTUALIZAR BALAS ENEMIGAS
// ============================================================

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
            bala.x > canvas.width + 30
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

            perderVida();

            balasEnemigos.splice(i, 1);
        }
    }
}


// ============================================================
// VIDA
// ============================================================

function perderVida() {

    if (
        jugador.invulnerable
    ) {
        return;
    }


    jugador.vida--;

    jugador.invulnerable = true;

    jugador.invulnerableTiempo = 60;


    actualizarInterfaz();


    if (
        jugador.vida <= 0
    ) {

        mensaje.textContent =
            "💀 GAME OVER";


        setTimeout(function () {

            location.reload();

        }, 1500);
    }
}


// ============================================================
// INVULNERABILIDAD
// ============================================================

function actualizarInvulnerabilidad() {

    if (
        !jugador.invulnerable
    ) {
        return;
    }


    jugador.invulnerableTiempo--;


    if (
        jugador.invulnerableTiempo <= 0
    ) {

        jugador.invulnerable = false;
    }
}


// ============================================================
// MONEDAS
// ============================================================

function crearMonedas() {

    monedas = [

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
}


// ============================================================
// RECOGER MONEDAS
// ============================================================

function recogerMonedas() {

    for (
        const moneda of monedas
    ) {

        if (
            moneda.recogida
        ) {
            continue;
        }


        if (
            colision(
                jugador,
                moneda
            )
        ) {

            moneda.recogida = true;

            cantidadMonedas++;

            monedasTexto.textContent =
                cantidadMonedas;
        }
    }
}


// ============================================================
// COMPROBAR OLEADA
// ============================================================

function comprobarOleada() {

    if (cambiando) {
        return;
    }


    const vivos =
        enemigos.filter(
            function (enemigo) {

                return enemigo.vida > 0;

            }
        ).length;


    if (vivos === 0) {

        cambiando = true;

        contadorCambio = 120;

        mensaje.textContent =
            "⭐ ¡OLEADA COMPLETADA!";
    }
}


// ============================================================
// SIGUIENTE OLEADA
// ============================================================

function siguienteOleada() {

    cambiando = false;


    oleada++;


    if (
        oleada >
        OLEADAS_POR_NIVEL
    ) {

        nivel++;

        oleada = 1;


        // CURACIÓN AL SUBIR DE NIVEL

        jugador.vida += 2;


        if (
            jugador.vida >
            jugador.vidaMaxima
        ) {

            jugador.vida =
                jugador.vidaMaxima;
        }


        mensaje.textContent =
            "⭐ ¡NUEVO NIVEL!";
    }


    crearOleada();
}


// ============================================================
// DIBUJAR FONDO
// ============================================================

function dibujarFondo() {

    // DIFERENTE FONDO POR NIVEL

    if (nivel === 1) {

        ctx.fillStyle = "#101025";
    }

    else if (nivel === 2) {

        ctx.fillStyle = "#10251c";
    }

    else if (nivel === 3) {

        ctx.fillStyle = "#24142e";
    }

    else if (nivel === 4) {

        ctx.fillStyle = "#301414";
    }

    else {

        ctx.fillStyle = "#080808";
    }


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // LUNA

    ctx.fillStyle = "#eeeeaa";

    ctx.beginPath();

    ctx.arc(
        820,
        100,
        50,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // MONTAÑAS

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


// ============================================================
// DIBUJAR PLATAFORMAS
// ============================================================

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


// ============================================================
// DIBUJAR JUGADOR
// ============================================================

function dibujarJugador() {

    // PARPADEO CUANDO RECIBE DAÑO

    if (
        jugador.invulnerable &&
        Math.floor(
            jugador.invulnerableTiempo / 5
        ) % 2 === 0
    ) {

        return;
    }


    // CUERPO

    ctx.fillStyle = "#eeeeee";

    ctx.fillRect(

        jugador.x,

        jugador.y,

        jugador.ancho,

        jugador.alto
    );


    // CABEZA

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(

        jugador.x + 5,

        jugador.y - 15,

        25,

        20
    );


    // OJOS

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


    // ESPADA

    if (
        jugador.atacando
    ) {

        ctx.fillStyle = "#eeeeee";


        if (
            jugador.mirando === 1
        ) {

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


// ============================================================
// DIBUJAR ENEMIGOS
// ============================================================

function dibujarEnemigos() {

    for (
        const enemigo of enemigos
    ) {

        if (
            enemigo.vida <= 0
        ) {
            continue;
        }


        // COLORES

        if (
            enemigo.tipo === "normal"
        ) {

            ctx.fillStyle = "#c92f36";
        }

        else if (
            enemigo.tipo === "saltador"
        ) {

            // NARANJA

            ctx.fillStyle = "#ff8c00";
        }

        else if (
            enemigo.tipo === "tanque"
        ) {

            // GRIS

            ctx.fillStyle = "#555566";
        }

        else if (
            enemigo.tipo === "volador"
        ) {

            // MORADO

            ctx.fillStyle = "#9b35d6";
        }

        else if (
            enemigo.tipo === "disparador"
        ) {

            // AZUL

            ctx.fillStyle = "#3585d6";
        }

        else {

            // ELITE

            ctx.fillStyle = "#e000a8";
        }


        // CUERPO

        ctx.fillRect(

            enemigo.x,

            enemigo.y,

            enemigo.ancho,

            enemigo.alto
        );


        // OJOS

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


        // BARRA DE VIDA

        ctx.fillStyle = "#222222";

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


        // ALAS DEL VOLADOR

        if (
            enemigo.tipo === "volador"
        ) {

            ctx.fillStyle = "#c98cff";


            ctx.fillRect(

                enemigo.x - 10,

                enemigo.y + 8,

                10,

                20
            );


            ctx.fillRect(

                enemigo.x +
                enemigo.ancho,

                enemigo.y + 8,

                10,

                20
            );
        }


        // CAÑÓN DEL DISPARADOR

        if (
            enemigo.tipo === "disparador"
        ) {

            ctx.fillStyle = "#222222";


            if (
                jugador.x <
                enemigo.x
            ) {

                ctx.fillRect(

                    enemigo.x - 15,

                    enemigo.y + 22,

                    15,

                    7
                );

            }
            else {

                ctx.fillRect(

                    enemigo.x +
                    enemigo.ancho,

                    enemigo.y + 22,

                    15,

                    7
                );
            }
        }
    }
}


// ============================================================
// DIBUJAR BALAS
// ============================================================

function dibujarBalas() {

    // BALAS DEL JUGADOR

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


    // BALAS ENEMIGAS

    for (
        const bala of balasEnemigos
    ) {

        ctx.fillStyle = "#ff3333";


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


// ============================================================
// DIBUJAR MONEDAS
// ============================================================

function dibujarMonedas() {

    for (
        const moneda of monedas
    ) {

        if (
            moneda.recogida
        ) {
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


// ============================================================
// INTERFAZ
// ============================================================

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


// ============================================================
// ACTUALIZAR JUEGO
// ============================================================

function actualizar() {

    moverJugador();

    actualizarAtaque();

    dispararJugador();

    actualizarBalasJugador();

    actualizarBalasEnemigos();

    actualizarEnemigos();

    actualizarInvulnerabilidad();

    recogerMonedas();

    comprobarOleada();


    // CAMBIO DE OLEADA

    if (cambiando) {

        contadorCambio--;


        if (
            contadorCambio <= 0
        ) {

            siguienteOleada();
        }
    }


    actualizarInterfaz();
}


// ============================================================
// DIBUJAR JUEGO
// ============================================================

function dibujar() {

    dibujarFondo();

    dibujarPlataformas();

    dibujarMonedas();

    dibujarEnemigos();

    dibujarBalas();

    dibujarJugador();
}


// ============================================================
// GAME LOOP
// ============================================================

function juego() {

    actualizar();

    dibujar();

    requestAnimationFrame(juego);
}


// ============================================================
// INICIAR
// ============================================================

crearMapa();

crearMonedas();

crearOleada();

actualizarInterfaz();

mensaje.textContent =
    "⚔️ NIVEL 1 - OLEADA 1";

juego();
