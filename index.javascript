"use strict";

// ======================================================
// CANVAS
// ======================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const vidaTexto = document.getElementById("vida");
const monedasTexto = document.getElementById("monedas");
const nivelTexto = document.getElementById("nivel");
const oleadaTexto = document.getElementById("oleada");
const mensaje = document.getElementById("mensaje");


// ======================================================
// TECLADO
// ======================================================

const teclas = {};

document.addEventListener("keydown", function(e) {

    teclas[e.key.toLowerCase()] = true;

    if (e.code === "Space") {
        teclas.space = true;
        e.preventDefault();
    }

});

document.addEventListener("keyup", function(e) {

    teclas[e.key.toLowerCase()] = false;

    if (e.code === "Space") {
        teclas.space = false;
    }

});


// ======================================================
// JUGADOR
// ======================================================

const jugador = {

    x: 100,
    y: 400,

    ancho: 35,
    alto: 50,

    velocidad: 5,

    velocidadY: 0,

    gravedad: 0.6,

    salto: -13,

    suelo: false,

    mirando: 1,

    vida: 5,

    vidaMaxima: 5,

    atacando: false,

    ataqueTiempo: 0,

    ataqueGolpeado: false,

    invulnerable: false,

    invulnerableTiempo: 0

};


// ======================================================
// NIVEL Y OLEADAS
// ======================================================

let nivel = 1;
let oleada = 1;

const MAX_OLEADAS = 3;

let cambiandoNivel = false;
let tiempoCambio = 0;


// ======================================================
// PLATAFORMAS
// ======================================================

let plataformas = [];


// ======================================================
// ENEMIGOS
// ======================================================

let enemigos = [];


// ======================================================
// PROYECTILES
// ======================================================

let balasJugador = [];
let balasEnemigos = [];

let puedeDisparar = true;


// ======================================================
// MONEDAS
// ======================================================

let monedas = [];
let cantidadMonedas = 0;


// ======================================================
// COLISIÓN
// ======================================================

function colision(a, b) {

    return (

        a.x < b.x + b.ancho &&

        a.x + a.ancho > b.x &&

        a.y < b.y + b.alto &&

        a.y + a.alto > b.y

    );

}


// ======================================================
// CREAR MAPA SEGÚN EL NIVEL
// ======================================================

function crearMapa() {

    plataformas = [];

    // ------------------------------------------
    // SUELO
    // ------------------------------------------

    plataformas.push({

        x: 0,
        y: 550,
        ancho: 1000,
        alto: 50

    });


    // ------------------------------------------
    // NIVEL 1
    // ------------------------------------------

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


    // ------------------------------------------
    // NIVEL 2
    // ------------------------------------------

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


    // ------------------------------------------
    // NIVEL 3
    // ------------------------------------------

    else if (nivel === 3) {

        plataformas.push({

            x: 80,
            y: 400,
            ancho: 130,
            alto: 25

        });

        plataformas.push({

            x: 250,
            y: 480,
            ancho: 140,
            alto: 25

        });

        plataformas.push({

            x: 450,
            y: 350,
            ancho: 150,
            alto: 25

        });

        plataformas.push({

            x: 680,
            y: 430,
            ancho: 120,
            alto: 25

        });

        plataformas.push({

            x: 820,
            y: 280,
            ancho: 130,
            alto: 25

        });

        plataformas.push({

            x: 500,
            y: 180,
            ancho: 150,
            alto: 25

        });

    }


    // ------------------------------------------
    // NIVEL 4
    // ------------------------------------------

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
            ancho: 100,
            alto: 25

        });

        plataformas.push({

            x: 370,
            y: 300,
            ancho: 140,
            alto: 25

        });

        plataformas.push({

            x: 570,
            y: 420,
            ancho: 130,
            alto: 25

        });

        plataformas.push({

            x: 750,
            y: 300,
            ancho: 100,
            alto: 25

        });

        plataformas.push({

            x: 850,
            y: 200,
            ancho: 100,
            alto: 25

        });

    }


    // ------------------------------------------
    // NIVEL 5+
    // ------------------------------------------

    else {

        plataformas.push({

            x: 50,
            y: 430,
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

            x: 380,
            y: 450,
            ancho: 120,
            alto: 25

        });

        plataformas.push({

            x: 520,
            y: 320,
            ancho: 120,
            alto: 25

        });

        plataformas.push({

            x: 700,
            y: 430,
            ancho: 120,
            alto: 25

        });

        plataformas.push({

            x: 820,
            y: 250,
            ancho: 130,
            alto: 25

        });

    }

}


// ======================================================
// CREAR ENEMIGO
// ======================================================

function crearEnemigo(tipo) {

    let enemigo = {

        x: 700 + Math.random() * 200,

        y: 100,

        ancho: 35,

        alto: 45,

        velocidad: 1.2,

        velocidadY: 0,

        gravedad: 0.6,

        salto: -11,

        suelo: false,

        direccion: -1,

        vida: 3,

        vidaMaxima: 3,

        tipo: tipo,

        contadorSalto: 60,

        contadorDisparo: 100,

        dañoContacto: 1

    };


    // ==================================================
    // NORMAL
    // ==================================================

    if (tipo === "normal") {

        enemigo.velocidad = 1.2;

        enemigo.vida = 3;

        enemigo.vidaMaxima = 3;

    }


    // ==================================================
    // NARANJA - SALTADOR
    // ==================================================

    if (tipo === "saltador") {

        enemigo.velocidad = 1.8;

        enemigo.vida = 3;

        enemigo.vidaMaxima = 3;

        enemigo.contadorSalto =
            50 + Math.random() * 50;

    }


    // ==================================================
    // TANQUE
    // ==================================================

    if (tipo === "tanque") {

        enemigo.ancho = 50;

        enemigo.alto = 65;

        enemigo.velocidad = 0.6;

        enemigo.vida = 8;

        enemigo.vidaMaxima = 8;

        enemigo.dañoContacto = 2;

    }


    // ==================================================
    // VOLADOR
    // ==================================================

    if (tipo === "volador") {

        enemigo.ancho = 40;

        enemigo.alto = 35;

        enemigo.velocidad = 1.5;

        enemigo.vida = 4;

        enemigo.vidaMaxima = 4;

        enemigo.y = 150 + Math.random() * 200;

    }


    // ==================================================
    // DISPARADOR
    // ==================================================

    if (tipo === "disparador") {

        enemigo.velocidad = 0.7;

        enemigo.vida = 5;

        enemigo.vidaMaxima = 5;

        enemigo.contadorDisparo =
            80 + Math.random() * 60;

    }


    // ==================================================
    // ÉLITE
    // ==================================================

    if (tipo === "elite") {

        enemigo.ancho = 50;

        enemigo.alto = 65;

        enemigo.velocidad = 1.8;

        enemigo.vida = 12;

        enemigo.vidaMaxima = 12;

        enemigo.dañoContacto = 2;

    }


    return enemigo;

}


// ======================================================
// CREAR OLEADA
// ======================================================

function crearOleada() {

    enemigos = [];

    balasJugador = [];

    balasEnemigos = [];

    crearMapa();


    jugador.x = 100;

    jugador.y = 300;

    jugador.velocidadY = 0;


    let cantidad =
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

            } else {

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
        "Nivel " +
        nivel +
        " - Oleada " +
        oleada;

    actualizarInterfaz();

}


// ======================================================
// SIGUIENTE OLEADA
// ======================================================

function siguienteOleada() {

    cambiandoNivel = false;


    oleada++;


    if (oleada > MAX_OLEADAS) {

        nivel++;

        oleada = 1;


        jugador.vida += 2;


        if (
            jugador.vida >
            jugador.vidaMaxima
        ) {

            jugador.vida =
                jugador.vidaMaxima;

        }


        mensaje.textContent =
            "⭐ ¡NIVEL " +
            nivel +
            "!";

    }


    crearOleada();

}


// ======================================================
// MOVIMIENTO DEL JUGADOR
// ======================================================

function moverJugador() {

    if (
        teclas.a ||
        teclas.arrowleft
    ) {

        jugador.x -=
            jugador.velocidad;

        jugador.mirando = -1;

    }


    if (
        teclas.d ||
        teclas.arrowright
    ) {

        jugador.x +=
            jugador.velocidad;

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
            jugador.salto;

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
        jugador.x +
        jugador.ancho >
        canvas.width
    ) {

        jugador.x =
            canvas.width -
            jugador.ancho;

    }


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


// ======================================================
// FÍSICA DE ENEMIGOS TERRESTRES
// ======================================================

function fisicaEnemigo(enemigo) {

    enemigo.velocidadY +=
        enemigo.gravedad;


    enemigo.y +=
        enemigo.velocidadY;


    enemigo.suelo = false;


    for (
        const plataforma of plataformas
    ) {

        if (

            enemigo.x <
            plataforma.x +
            plataforma.ancho

            &&

            enemigo.x +
            enemigo.ancho >
            plataforma.x

            &&

            enemigo.y +
            enemigo.alto >=
            plataforma.y

            &&

            enemigo.y +
            enemigo.alto <=
            plataforma.y +
            plataforma.alto + 15

            &&

            enemigo.velocidadY >= 0

        ) {

            enemigo.y =
                plataforma.y -
                enemigo.alto;

            enemigo.velocidadY = 0;

            enemigo.suelo = true;

        }

    }


    if (
        enemigo.y >
        canvas.height
    ) {

        enemigo.y = 100;

        enemigo.velocidadY = 0;

    }

}


// ======================================================
// MOVIMIENTO DEL ENEMIGO NARANJA
// ======================================================

function actualizarSaltador(enemigo) {

    fisicaEnemigo(enemigo);


    enemigo.x +=
        enemigo.velocidad *
        enemigo.direccion;


    enemigo.contadorSalto--;


    // SALTA
    if (
        enemigo.suelo &&
        enemigo.contadorSalto <= 0
    ) {

        enemigo.velocidadY =
            enemigo.salto;

        enemigo.contadorSalto =
            70 + Math.random() * 50;

    }


    // INTENTA IR HACIA EL JUGADOR

    if (
        jugador.x < enemigo.x
    ) {

        enemigo.direccion = -1;

    }
    else {

        enemigo.direccion = 1;

    }


    controlarLimitesEnemigo(enemigo);

}


// ======================================================
// ENEMIGO NORMAL
// ======================================================

function actualizarNormal(enemigo) {

    fisicaEnemigo(enemigo);


    enemigo.x +=
        enemigo.velocidad *
        enemigo.direccion;


    if (
        jugador.x < enemigo.x
    ) {

        enemigo.direccion = -1;

    }
    else {

        enemigo.direccion = 1;

    }


    controlarLimitesEnemigo(enemigo);

}


// ======================================================
// TANQUE
// ======================================================

function actualizarTanque(enemigo) {

    fisicaEnemigo(enemigo);


    enemigo.x +=
        enemigo.velocidad *
        enemigo.direccion;


    if (
        jugador.x < enemigo.x
    ) {

        enemigo.direccion = -1;

    }
    else {

        enemigo.direccion = 1;

    }


    controlarLimitesEnemigo(enemigo);

}


// ======================================================
// ENEMIGO VOLADOR
// ======================================================

function actualizarVolador(enemigo) {

    // NO USA GRAVEDAD

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


    // SIGUE AL JUGADOR VERTICALMENTE

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


    // LIMITES

    if (enemigo.x < 300) {

        enemigo.x = 300;

    }


    if (
        enemigo.x +
        enemigo.ancho >
        950
    ) {

        enemigo.x =
            950 -
            enemigo.ancho;

    }


    if (enemigo.y < 80) {

        enemigo.y = 80;

    }


    if (
        enemigo.y +
        enemigo.alto >
        500
    ) {

        enemigo.y =
            500 -
            enemigo.alto;

    }

}


// ======================================================
// ENEMIGO DISPARADOR
// ======================================================

function actualizarDisparador(enemigo) {

    fisicaEnemigo(enemigo);


    // SE MUEVE POCO

    if (
        jugador.x < enemigo.x - 100
    ) {

        enemigo.x -= 0.5;

    }


    if (
        jugador.x > enemigo.x + 100
    ) {

        enemigo.x += 0.5;

    }


    enemigo.contadorDisparo--;


    if (
        enemigo.contadorDisparo <= 0
    ) {

        dispararEnemigo(enemigo);

        enemigo.contadorDisparo =
            100;

    }


    controlarLimitesEnemigo(enemigo);

}


// ======================================================
// LÍMITES DE ENEMIGOS
// ======================================================

function controlarLimitesEnemigo(enemigo) {

    if (enemigo.x < 250) {

        enemigo.x = 250;

        enemigo.direccion = 1;

    }


    if (
        enemigo.x +
        enemigo.ancho >
        950
    ) {

        enemigo.x =
            950 -
            enemigo.ancho;

        enemigo.direccion = -1;

    }

}


// ======================================================
// ACTUALIZAR ENEMIGOS
// ======================================================

function actualizarEnemigos() {

    for (
        const enemigo of enemigos
    ) {

        if (enemigo.vida <= 0) {
            continue;
        }


        if (
            enemigo.tipo === "normal"
        ) {

            actualizarNormal(enemigo);

        }


        else if (
            enemigo.tipo === "saltador"
        ) {

            actualizarSaltador(enemigo);

        }


        else if (
            enemigo.tipo === "tanque"
        ) {

            actualizarTanque(enemigo);

        }


        else if (
            enemigo.tipo === "volador"
        ) {

            actualizarVolador(enemigo);

        }


        else if (
            enemigo.tipo === "disparador"
        ) {

            actualizarDisparador(enemigo);

        }


        else if (
            enemigo.tipo === "elite"
        ) {

            actualizarTanque(enemigo);

        }


        // DAÑO DE CONTACTO

        if (
            colision(
                jugador,
                enemigo
            )
        ) {

            perderVida();


            jugador.x +=
                enemigo.direccion *
                60;

        }

    }

}


// ======================================================
// DISPARAR ENEMIGO
// ======================================================

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

        ancho: 10,

        alto: 10,

        velocidad:
            direccion * 5

    });

}


// ======================================================
// ATAQUE
// ======================================================

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


    if (
        !jugador.ataqueGolpeado
    ) {

        for (
            const enemigo of enemigos
        ) {

            if (
                enemigo.vida > 0 &&
                colision(
                    espada,
                    enemigo
                )
            ) {

                enemigo.vida--;

                enemigo.x +=
                    jugador.mirando * 40;

                jugador.ataqueGolpeado = true;

                break;

            }

        }

    }


    if (
        jugador.ataqueTiempo <= 0
    ) {

        jugador.atacando = false;

    }

}


// ======================================================
// DISPARO DEL JUGADOR
// ======================================================

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


    setTimeout(function() {

        puedeDisparar = true;

    }, 250);

}


// ======================================================
// BALAS DEL JUGADOR
// ======================================================

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
            bala.x >
            canvas.width + 20
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


// ======================================================
// BALAS DE ENEMIGOS
// ======================================================

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
            bala.x < -20 ||
            bala.x >
            canvas.width + 20
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


// ======================================================
// VIDA
// ======================================================

function perderVida() {

    if (
        jugador.invulnerable
    ) {

        return;

    }


    jugador.vida--;

    jugador.invulnerable = true;

    jugador.invulnerableTiempo =
        60;


    actualizarInterfaz();


    if (
        jugador.vida <= 0
    ) {

        mensaje.textContent =
            "💀 GAME OVER";


        setTimeout(function() {

            location.reload();

        }, 1500);

    }

}


// ======================================================
// INVULNERABILIDAD
// ======================================================

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


// ======================================================
// MONEDAS
// ======================================================

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


// ======================================================
// RECOGER MONEDAS
// ======================================================

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

        }

    }

}


// ======================================================
// COMPROBAR OLEADA
// ======================================================

function comprobarOleada() {

    if (
        cambiandoNivel
    ) {

        return;

    }


    const vivos =
        enemigos.filter(
            function(enemigo) {

                return enemigo.vida > 0;

            }
        ).length;


    if (
        vivos === 0
    ) {

        cambiandoNivel = true;

        tiempoCambio = 120;


        mensaje.textContent =
            "🌊 ¡OLEADA COMPLETADA!";

    }

}


// ======================================================
// FONDO
// ======================================================

function dibujarFondo() {

    // CAMBIA EL COLOR SEGÚN EL NIVEL

    if (nivel === 1) {

        ctx.fillStyle = "#111122";

    }

    else if (nivel === 2) {

        ctx.fillStyle = "#14201c";

    }

    else if (nivel === 3) {

        ctx.fillStyle = "#20152b";

    }

    else if (nivel === 4) {

        ctx.fillStyle = "#281515";

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


// ======================================================
// PLATAFORMAS
// ======================================================

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


// ======================================================
// JUGADOR
// ======================================================

function dibujarJugador() {

    if (

        jugador.invulnerable &&

        Math.floor(
            jugador.invulnerableTiempo / 5
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


// ======================================================
// ENEMIGOS
// ======================================================

function dibujarEnemigos() {

    for (
        const enemigo of enemigos
    ) {

        if (
            enemigo.vida <= 0
        ) {

            continue;

        }


        // COLOR

        if (
            enemigo.tipo === "normal"
        ) {

            ctx.fillStyle =
                "#b52d35";

        }

        else if (
            enemigo.tipo === "saltador"
        ) {

            // NARANJA

            ctx.fillStyle =
                "#ff8c00";

        }

        else if (
            enemigo.tipo === "tanque"
        ) {

            ctx.fillStyle =
                "#555566";

        }

        else if (
            enemigo.tipo === "volador"
        ) {

            // MORADO

            ctx.fillStyle =
                "#9b35d6";

        }

        else if (
            enemigo.tipo === "disparador"
        ) {

            // AZUL

            ctx.fillStyle =
                "#3585d6";

        }

        else {

            // ÉLITE

            ctx.fillStyle =
                "#e000a8";

        }


        ctx.fillRect(
            enemigo.x,
            enemigo.y,
            enemigo.ancho,
            enemigo.alto
        );


        // OJOS

        ctx.fillStyle =
            "white";


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

        ctx.fillStyle =
            "#222222";


        ctx.fillRect(
            enemigo.x,
            enemigo.y - 10,
            enemigo.ancho,
            5
        );


        ctx.fillStyle =
            "#ff3333";


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

            ctx.fillStyle =
                "#c98cff";


            ctx.fillRect(
                enemigo.x - 10,
                enemigo.y + 10,
                10,
                20
            );


            ctx.fillRect(
                enemigo.x +
                enemigo.ancho,
                enemigo.y + 10,
                10,
                20
            );

        }

    }

}


// ======================================================
// BALAS
// ======================================================

function dibujarBalas() {

    // BALAS DEL JUGADOR

    for (
        const bala of balasJugador
    ) {

        ctx.fillStyle =
            "#ffff55";


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

        ctx.fillStyle =
            "#ff3333";


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


// ======================================================
// MONEDAS
// ======================================================

function dibujarMonedas() {

    for (
        const moneda of monedas
    ) {

        if (
            moneda.recogida
        ) {

            continue;

        }


        ctx.fillStyle =
            "#ffd700";


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


// ======================================================
// INTERFAZ
// ======================================================

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


// ======================================================
// ACTUALIZAR
// ======================================================

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


    if (
        cambiandoNivel
    ) {

        tiempoCambio--;


        if (
            tiempoCambio <= 0
        ) {

            siguienteOleada();

        }

    }


    actualizarInterfaz();

}


// ======================================================
// DIBUJAR
// ======================================================

function dibujar() {

    dibujarFondo();

    dibujarPlataformas();

    dibujarMonedas();

    dibujarEnemigos();

    dibujarBalas();

    dibujarJugador();

}


// ======================================================
// GAME LOOP
// ======================================================

function juego() {

    actualizar();

    dibujar();

    requestAnimationFrame(juego);

}


// ======================================================
// INICIAR
// ======================================================

crearMapa();

crearMonedas();

crearOleada();

actualizarInterfaz();

mensaje.textContent =
    "⚔️ ¡NIVEL 1 - OLEADA 1!";

juego();
