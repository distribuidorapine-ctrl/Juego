"use strict";

// =====================================================
// CANVAS
// =====================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const vidaTexto = document.getElementById("vida");
const monedasTexto = document.getElementById("monedas");

const nivelTexto = document.getElementById("nivel");
const oleadaTexto = document.getElementById("oleada");

const mensaje = document.getElementById("mensaje");


// =====================================================
// TECLADO
// =====================================================

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


// =====================================================
// JUGADOR
// =====================================================

const jugador = {

    x: 100,
    y: 300,

    ancho: 35,
    alto: 50,

    velocidad: 5,

    velocidadY: 0,
    gravedad: 0.6,
    salto: -13,

    suelo: false,

    mirando: 1,

    vida: 5,

    atacando: false,
    ataqueTiempo: 0,
    ataqueGolpeados: [],

    invulnerable: false,
    invulnerableTiempo: 0
};


// =====================================================
// SISTEMA DE NIVELES
// =====================================================

let nivel = 1;
let oleada = 1;

const OLEADAS_POR_NIVEL = 3;

let cambiandoOleada = false;
let tiempoCambio = 0;


// =====================================================
// MONEDAS
// =====================================================

let monedas = [];

let cantidadMonedas = 0;

// Monedas acumuladas desde que empezó el juego
let monedasParaVida = 0;


// =====================================================
// MAPA
// =====================================================

let plataformas = [];


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
// CREAR MAPA
// =====================================================

function crearMapa() {

    plataformas = [];


    // SUELO PRINCIPAL

    plataformas.push({

        x: 0,
        y: 550,
        ancho: 1000,
        alto: 50

    });


    // NIVEL 1

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


    // NIVEL 2

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


    // NIVEL 3

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


    // NIVEL 4

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


    // NIVEL 5+

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


// =====================================================
// FÍSICA DE ENTIDADES
// =====================================================

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
            plataforma.y + plataforma.alto + 20

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


// =====================================================
// BUSCAR PLATAFORMA DEBAJO
// =====================================================

function buscarSuelo(enemigo) {

    let mejorY = 500;


    for (const plataforma of plataformas) {

        const tocaHorizontal =

            enemigo.x + enemigo.ancho >
            plataforma.x &&

            enemigo.x <
            plataforma.x + plataforma.ancho;


        if (!tocaHorizontal) {
            continue;
        }


        if (
            plataforma.y >= enemigo.y &&
            plataforma.y < mejorY
        ) {

            mejorY = plataforma.y;
        }

    }


    return mejorY;
}


// =====================================================
// COLOCAR ENEMIGO EN EL MAPA
// =====================================================

function colocarEnemigo(enemigo) {

    const suelo =
        buscarSuelo(enemigo);


    enemigo.y =
        suelo - enemigo.alto;

    enemigo.velocidadY = 0;

    enemigo.suelo = true;

}


// =====================================================
// CREAR ENEMIGO
// =====================================================

function crearEnemigo(tipo, x) {

    const enemigo = {

        x: x,
        y: 100,

        ancho: 35,
        alto: 45,

        velocidad: 1.5,

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

        daño: 1

    };


    // NORMAL

    if (tipo === "normal") {

        enemigo.velocidad = 1.5;

        enemigo.vida = 3;
        enemigo.vidaMaxima = 3;

    }


    // NARANJA SALTADOR

    if (tipo === "saltador") {

        enemigo.velocidad = 2;

        enemigo.vida = 4;
        enemigo.vidaMaxima = 4;

        enemigo.contadorSalto = 50;

    }


    // NEGRO TANQUE

    if (tipo === "tanque") {

        enemigo.ancho = 50;
        enemigo.alto = 65;

        enemigo.velocidad = 0.8;

        enemigo.vida = 8;
        enemigo.vidaMaxima = 8;

        enemigo.daño = 2;

    }


    // VOLADOR

    if (tipo === "volador") {

        enemigo.ancho = 40;
        enemigo.alto = 35;

        enemigo.velocidad = 1.6;

        enemigo.vida = 5;
        enemigo.vidaMaxima = 5;

        enemigo.y =
            100 + Math.random() * 250;

    }


    // DISPARADOR

    if (tipo === "disparador") {

        enemigo.velocidad = 1;

        enemigo.vida = 5;
        enemigo.vidaMaxima = 5;

        enemigo.contadorDisparo = 80;

    }


    // ÉLITE

    if (tipo === "elite") {

        enemigo.ancho = 50;
        enemigo.alto = 65;

        enemigo.velocidad = 1.8;

        enemigo.vida = 12;
        enemigo.vidaMaxima = 12;

        enemigo.daño = 2;

    }


    // Los voladores NO necesitan suelo

    if (tipo !== "volador") {

        colocarEnemigo(enemigo);

    }


    return enemigo;

}


// =====================================================
// CREAR MONEDAS
// =====================================================

function crearMonedas() {

    monedas = [];


    // =================================================
    // LAS MONEDAS AHORA SON NUEVAS CADA NIVEL
    // =================================================

    const posiciones = [

        {
            x: 150,
            y: 400
        },

        {
            x: 270,
            y: 250
        },

        {
            x: 480,
            y: 330
        },

        {
            x: 650,
            y: 220
        },

        {
            x: 820,
            y: 400
        },

        {
            x: 550,
            y: 500
        }

    ];


    for (const posicion of posiciones) {

        monedas.push({

            x: posicion.x,

            y: posicion.y,

            ancho: 20,
            alto: 20,

            recogida: false

        });

    }

}


// =====================================================
// CREAR OLEADA
// =====================================================

function crearOleada() {

    enemigos = [];

    balasJugador = [];
    balasEnemigos = [];


    crearMapa();


    jugador.x = 100;
    jugador.y = 300;
    jugador.velocidadY = 0;


    // =================================================
    // IMPORTANTE:
    // LAS MONEDAS NO SE CREAN AQUÍ.
    //
    // SOLO SE CREAN AL COMENZAR UN NIVEL.
    //
    // Así NO reaparecen durante cada oleada.
    // =================================================


    const cantidad =
        2 + nivel + oleada;


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

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

            if (i % 5 === 0) {

                tipo = "disparador";

            }
            else if (i % 4 === 0) {

                tipo = "volador";

            }
            else if (i % 3 === 0) {

                tipo = "tanque";

            }
            else {

                tipo = "saltador";

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

                tipo = "tanque";

            }
            else {

                tipo = "saltador";

            }

        }


        // =================================================
        // APARICIÓN
        // =================================================

        let x;


        // Los enemigos aparecen a la derecha
        // pero nunca pegados al borde.

        x =
            450 +
            Math.random() * 450;


        if (x > 940) {

            x = 900;

        }


        enemigos.push(
            crearEnemigo(
                tipo,
                x
            )
        );

    }


    mensaje.textContent =
        "⚔️ NIVEL " +
        nivel +
        " - OLEADA " +
        oleada;


    actualizarInterfaz();

}


// =====================================================
// MOVIMIENTO DEL JUGADOR
// =====================================================

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
            teclas.space ||
            teclas.w ||
            teclas.arrowup
        )

        &&

        jugador.suelo

    ) {

        jugador.velocidadY =
            jugador.salto;

        jugador.suelo = false;

    }


    aplicarFisica(jugador);


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


// =====================================================
// MOVIMIENTO ENEMIGO TERRESTRE
// =====================================================

function moverTerrestre(enemigo) {

    aplicarFisica(enemigo);


    // ================================================
    // SI ESTÁ A LA IZQUIERDA DEL JUGADOR
    // AVANZA A LA DERECHA
    // ================================================

    if (
        jugador.x >
        enemigo.x + 10
    ) {

        enemigo.direccion = 1;

    }


    // ================================================
    // SI ESTÁ A LA DERECHA
    // AVANZA A LA IZQUIERDA
    // ================================================

    else if (
        jugador.x <
        enemigo.x - 10
    ) {

        enemigo.direccion = -1;

    }


    enemigo.x +=
        enemigo.velocidad *
        enemigo.direccion;


    // ================================================
    // SOLUCIÓN AL PROBLEMA DE LA IZQUIERDA
    // ================================================

    if (
        enemigo.x <= 5
    ) {

        enemigo.x = 5;

        // Si llega a la izquierda,
        // se obliga a mirar hacia el jugador.

        if (
            jugador.x >
            enemigo.x
        ) {

            enemigo.direccion = 1;

        }

    }


    // DERECHA

    if (
        enemigo.x +
        enemigo.ancho >=
        canvas.width - 5
    ) {

        enemigo.x =
            canvas.width -
            enemigo.ancho -
            5;


        if (
            jugador.x <
            enemigo.x
        ) {

            enemigo.direccion = -1;

        }

    }

}


// =====================================================
// ENEMIGO SALTADOR
// =====================================================

function moverSaltador(enemigo) {

    moverTerrestre(enemigo);


    enemigo.contadorSalto--;


    if (
        enemigo.suelo &&
        enemigo.contadorSalto <= 0
    ) {

        enemigo.velocidadY =
            enemigo.salto;

        enemigo.suelo = false;

        enemigo.contadorSalto = 70;

    }

}


// =====================================================
// ENEMIGO VOLADOR
// =====================================================

function moverVolador(enemigo) {

    const distanciaX =
        jugador.x -
        enemigo.x;


    const distanciaY =
        jugador.y -
        enemigo.y;


    if (
        Math.abs(distanciaX) > 20
    ) {

        enemigo.x +=
            Math.sign(distanciaX) *
            enemigo.velocidad;

    }


    if (
        Math.abs(distanciaY) > 20
    ) {

        enemigo.y +=
            Math.sign(distanciaY) *
            0.8;

    }


    if (enemigo.x < 20) {

        enemigo.x = 20;

    }


    if (
        enemigo.x +
        enemigo.ancho >
        980
    ) {

        enemigo.x =
            980 -
            enemigo.ancho;

    }


    if (enemigo.y < 50) {

        enemigo.y = 50;

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


// =====================================================
// DISPARADOR
// =====================================================

function moverDisparador(enemigo) {

    moverTerrestre(enemigo);


    enemigo.contadorDisparo--;


    if (
        enemigo.contadorDisparo <= 0
    ) {

        dispararEnemigo(enemigo);

        enemigo.contadorDisparo = 100;

    }

}


// =====================================================
// ACTUALIZAR ENEMIGOS
// =====================================================

function actualizarEnemigos() {

    for (const enemigo of enemigos) {

        if (
            enemigo.vida <= 0
        ) {

            continue;

        }


        if (
            enemigo.tipo === "volador"
        ) {

            moverVolador(enemigo);

        }

        else if (
            enemigo.tipo === "saltador"
        ) {

            moverSaltador(enemigo);

        }

        else if (
            enemigo.tipo === "disparador"
        ) {

            moverDisparador(enemigo);

        }

        else {

            moverTerrestre(enemigo);

        }


        // CONTACTO CON JUGADOR

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


// =====================================================
// ATAQUE DE ESPADA
// =====================================================

function actualizarAtaque() {

    if (
        teclas.j &&
        !jugador.atacando
    ) {

        jugador.atacando = true;

        jugador.ataqueTiempo = 12;

        jugador.ataqueGolpeados = [];

    }


    if (
        !jugador.atacando
    ) {

        return;

    }


    jugador.ataqueTiempo--;


    const espada = {

        x:
            jugador.mirando === 1

                ? jugador.x +
                  jugador.ancho

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
            jugador.ataqueGolpeados
                .includes(enemigo)
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
                jugador.mirando *
                40;

        }

    }


    if (
        jugador.ataqueTiempo <= 0
    ) {

        jugador.atacando = false;

    }

}


// =====================================================
// DISPARO DEL JUGADOR
// =====================================================

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

                ? jugador.x +
                  jugador.ancho

                : jugador.x - 12,

        y:
            jugador.y + 22,

        ancho: 12,
        alto: 6,

        velocidad:
            jugador.mirando * 10

    });


    puedeDisparar = false;


    setTimeout(
        function() {

            puedeDisparar = true;

        },
        250
    );

}


// =====================================================
// BALAS DEL JUGADOR
// =====================================================

function actualizarBalasJugador() {

    for (
        let i =
        balasJugador.length - 1;

        i >= 0;

        i--
    ) {

        const bala =
            balasJugador[i];


        bala.x +=
            bala.velocidad;


        if (
            bala.x < -30 ||
            bala.x >
            canvas.width + 30
        ) {

            balasJugador.splice(
                i,
                1
            );

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

                balasJugador.splice(
                    i,
                    1
                );

                break;

            }

        }

    }

}


// =====================================================
// DISPARO ENEMIGO
// =====================================================

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


// =====================================================
// ACTUALIZAR BALAS ENEMIGAS
// =====================================================

function actualizarBalasEnemigos() {

    for (
        let i =
        balasEnemigos.length - 1;

        i >= 0;

        i--
    ) {

        const bala =
            balasEnemigos[i];


        bala.x +=
            bala.velocidad;


        if (
            bala.x < -30 ||
            bala.x >
            canvas.width + 30
        ) {

            balasEnemigos.splice(
                i,
                1
            );

            continue;

        }


        if (
            colision(
                bala,
                jugador
            )
        ) {

            perderVida();

            balasEnemigos.splice(
                i,
                1
            );

        }

    }

}


// =====================================================
// RECOGER MONEDAS
// =====================================================

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

            monedasParaVida++;


            // CADA 10 MONEDAS

            if (
                monedasParaVida >= 10
            ) {

                monedasParaVida -= 10;

                jugador.vida++;

                mensaje.textContent =
                    "🪙 10 MONEDAS = ❤️ +1 VIDA";

            }

        }

    }

}


// =====================================================
// ¿QUEDAN MONEDAS?
// =====================================================

function quedanMonedas() {

    return monedas.some(
        function(moneda) {

            return !moneda.recogida;

        }
    );

}


// =====================================================
// ¿QUEDAN ENEMIGOS?
// =====================================================

function quedanEnemigos() {

    return enemigos.some(
        function(enemigo) {

            return enemigo.vida > 0;

        }
    );

}


// =====================================================
// COMPROBAR FIN DE OLEADA
// =====================================================

function comprobarOleada() {

    if (
        cambiandoOleada
    ) {

        return;

    }


    const enemigosVivos =
        quedanEnemigos();


    const monedasRestantes =
        quedanMonedas();


    // =================================================
    // MUY IMPORTANTE:
    //
    // NO TERMINA SI QUEDA UNA SOLA MONEDA.
    // =================================================

    if (
        !enemigosVivos &&
        !monedasRestantes
    ) {

        completarOleada();

    }


    else if (
        !enemigosVivos &&
        monedasRestantes
    ) {

        mensaje.textContent =
            "🪙 RECOGE TODAS LAS MONEDAS";

    }

}


// =====================================================
// COMPLETAR OLEADA
// =====================================================

function completarOleada() {

    cambiandoOleada = true;

    tiempoCambio = 120;


    // +1 VIDA

    jugador.vida++;


    mensaje.textContent =
        "🏆 OLEADA COMPLETADA +1 ❤️";

}


// =====================================================
// SIGUIENTE OLEADA
// =====================================================

function siguienteOleada() {

    cambiandoOleada = false;


    oleada++;


    // =================================================
    // CAMBIO DE NIVEL
    // =================================================

    if (
        oleada >
        OLEADAS_POR_NIVEL
    ) {

        nivel++;

        oleada = 1;


        // =================================================
        // AQUÍ SE REGENERAN LAS MONEDAS
        // =================================================

        crearMonedas();


        mensaje.textContent =
            "🌟 ¡NUEVO NIVEL!";

    }


    crearOleada();

}


// =====================================================
// DAÑO
// =====================================================

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


        setTimeout(
            function() {

                location.reload();

            },
            1500
        );

    }

}


// =====================================================
// INVULNERABILIDAD
// =====================================================

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


// =====================================================
// FONDO
// =====================================================

function dibujarFondo() {

    if (nivel === 1) {

        ctx.fillStyle =
            "#101025";

    }

    else if (nivel === 2) {

        ctx.fillStyle =
            "#10251c";

    }

    else if (nivel === 3) {

        ctx.fillStyle =
            "#24142e";

    }

    else if (nivel === 4) {

        ctx.fillStyle =
            "#301414";

    }

    else {

        ctx.fillStyle =
            "#080808";

    }


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // LUNA

    ctx.fillStyle =
        "#eeeeaa";

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

    ctx.fillStyle =
        "#252545";

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

        ctx.fillStyle =
            "#4a3025";

        ctx.fillRect(

            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            plataforma.alto

        );


        ctx.fillStyle =
            "#75a83b";

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
            jugador.invulnerableTiempo / 5
        ) % 2 === 0

    ) {

        return;

    }


    ctx.fillStyle =
        "#eeeeee";


    ctx.fillRect(

        jugador.x,
        jugador.y,
        jugador.ancho,
        jugador.alto

    );


    // CABEZA

    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(

        jugador.x + 5,
        jugador.y - 15,
        25,
        20

    );


    // OJOS

    ctx.fillStyle =
        "#111";


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

        ctx.fillStyle =
            "#eeeeee";


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


// =====================================================
// ENEMIGOS
// =====================================================

function dibujarEnemigos() {

    for (
        const enemigo of enemigos
    ) {

        if (
            enemigo.vida <= 0
        ) {

            continue;

        }


        // NORMAL

        if (
            enemigo.tipo === "normal"
        ) {

            ctx.fillStyle =
                "#c92f36";

        }


        // NARANJA

        else if (
            enemigo.tipo === "saltador"
        ) {

            ctx.fillStyle =
                "#ff8c00";

        }


        // NEGRO

        else if (
            enemigo.tipo === "tanque"
        ) {

            ctx.fillStyle =
                "#050505";

        }


        // VOLADOR

        else if (
            enemigo.tipo === "volador"
        ) {

            ctx.fillStyle =
                "#9b35d6";

        }


        // DISPARADOR

        else if (
            enemigo.tipo === "disparador"
        ) {

            ctx.fillStyle =
                "#3585d6";

        }


        // ÉLITE

        else {

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
            enemigo.ancho -
            14,

            enemigo.y + 10,

            7,
            7

        );


        // BARRA DE VIDA

        ctx.fillStyle =
            "#222";

        ctx.fillRect(

            enemigo.x,
            enemigo.y - 10,
            enemigo.ancho,
            5

        );


        ctx.fillStyle =
            "#e33";

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


        // ALAS

        if (
            enemigo.tipo === "volador"
        ) {

            ctx.fillStyle =
                "#c98cff";


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

    }

}


// =====================================================
// BALAS
// =====================================================

function dibujarBalas() {

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


    for (
        const bala of balasEnemigos
    ) {

        ctx.fillStyle =
            "#ff3333";


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


// =====================================================
// MONEDAS
// =====================================================

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


        ctx.fillStyle =
            "#fff5a0";


        ctx.fillRect(

            moneda.x + 6,
            moneda.y + 4,
            4,
            4

        );

    }

}


// =====================================================
// INTERFAZ
// =====================================================

function actualizarInterfaz() {

    if (vidaTexto) {

        vidaTexto.textContent =
            jugador.vida;

    }


    if (monedasTexto) {

        monedasTexto.textContent =
            cantidadMonedas;

    }


    if (nivelTexto) {

        nivelTexto.textContent =
            nivel;

    }


    if (oleadaTexto) {

        oleadaTexto.textContent =
            oleada;

    }

}


// =====================================================
// ACTUALIZAR
// =====================================================

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


    if (
        cambiandoOleada
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
// INICIAR
// =====================================================

crearMapa();

crearMonedas();

crearOleada();

actualizarInterfaz();

if (mensaje) {

    mensaje.textContent =
        "⚔️ NIVEL 1 - OLEADA 1";

}

juego();
