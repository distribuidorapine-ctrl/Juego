const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const vidaTexto = document.getElementById("vida");
const monedasTexto = document.getElementById("monedas");

const teclas = {};

document.addEventListener("keydown", (e) => {
    teclas[e.key.toLowerCase()] = true;

    if (e.code === "Space") {
        teclas.space = true;
        e.preventDefault();
    }
});

document.addEventListener("keyup", (e) => {
    teclas[e.key.toLowerCase()] = false;

    if (e.code === "Space") {
        teclas.space = false;
    }
});


// =============================
// JUGADOR
// =============================

const jugador = {
    x: 100,
    y: 400,

    ancho: 35,
    alto: 50,

    velocidad: 5,
    velocidadY: 0,

    salto: -13,
    gravedad: 0.6,

    vida: 5,

    mirando: 1,

    suelo: false,

    atacando: false,
    tiempoAtaque: 0,

    disparando: false
};


// =============================
// PLATAFORMAS
// =============================

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


// =============================
// ENEMIGOS
// =============================

const enemigos = [

    {
        x: 500,
        y: 330,
        ancho: 35,
        alto: 50,

        velocidad: 1.5,
        direccion: 1,

        vida: 3,

        vivo: true
    },

    {
        x: 750,
        y: 400,
        ancho: 35,
        alto: 50,

        velocidad: 1.2,
        direccion: -1,

        vida: 3,

        vivo: true
    }
];


// =============================
// PROYECTILES
// =============================

const proyectiles = [];


// =============================
// MONEDAS
// =============================

const monedas = [

    {
        x: 200,
        y: 410,
        recogida: false
    },

    {
        x: 500,
        y: 340,
        recogida: false
    },

    {
        x: 850,
        y: 410,
        recogida: false
    }
];


// =============================
// COLISIÓN
// =============================

function colision(a, b) {

    return (
        a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y
    );
}


// =============================
// MOVIMIENTO DEL JUGADOR
// =============================

function moverJugador() {

    if (teclas["a"] || teclas["arrowleft"]) {

        jugador.x -= jugador.velocidad;

        jugador.mirando = -1;
    }

    if (teclas["d"] || teclas["arrowright"]) {

        jugador.x += jugador.velocidad;

        jugador.mirando = 1;
    }


    // SALTO

    if (
        (teclas.space || teclas["w"] || teclas["arrowup"]) &&
        jugador.suelo
    ) {

        jugador.velocidadY = jugador.salto;

        jugador.suelo = false;
    }


    // GRAVEDAD

    jugador.velocidadY += jugador.gravedad;

    jugador.y += jugador.velocidadY;


    jugador.suelo = false;


    // COLISIÓN CON PLATAFORMAS

    for (const plataforma of plataformas) {

        if (
            jugador.x < plataforma.x + plataforma.ancho &&
            jugador.x + jugador.ancho > plataforma.x &&
            jugador.y + jugador.alto > plataforma.y &&
            jugador.y + jugador.alto < plataforma.y + plataforma.alto + 20 &&
            jugador.velocidadY >= 0
        ) {

            jugador.y = plataforma.y - jugador.alto;

            jugador.velocidadY = 0;

            jugador.suelo = true;
        }
    }


    // LÍMITES

    if (jugador.x < 0) {
        jugador.x = 0;
    }

    if (jugador.x + jugador.ancho > canvas.width) {
        jugador.x = canvas.width - jugador.ancho;
    }


    // CAÍDA

    if (jugador.y > canvas.height) {

        perderVida();

        jugador.x = 100;
        jugador.y = 300;
    }
}


// =============================
// ATAQUE
// =============================

function ataque() {

    if (teclas["j"] && !jugador.atacando) {

        jugador.atacando = true;

        jugador.tiempoAtaque = 15;
    }

    if (jugador.atacando) {

        jugador.tiempoAtaque--;

        if (jugador.tiempoAtaque <= 0) {

            jugador.atacando = false;
        }
    }
}


// =============================
// DISPARO
// =============================

let puedeDisparar = true;

function disparo() {

    if (teclas["k"] && puedeDisparar) {

        proyectiles.push({

            x: jugador.mirando === 1
                ? jugador.x + jugador.ancho
                : jugador.x,

            y: jugador.y + 20,

            ancho: 12,
            alto: 6,

            velocidad: 10 * jugador.mirando
        });

        puedeDisparar = false;

        setTimeout(() => {

            puedeDisparar = true;

        }, 250);
    }
}


// =============================
// ACTUALIZAR PROYECTILES
// =============================

function actualizarProyectiles() {

    for (let i = proyectiles.length - 1; i >= 0; i--) {

        const bala = proyectiles[i];

        bala.x += bala.velocidad;


        // ELIMINAR SI SALE DEL MAPA

        if (
            bala.x < 0 ||
            bala.x > canvas.width
        ) {

            proyectiles.splice(i, 1);

            continue;
        }


        // GOLPEAR ENEMIGOS

        for (const enemigo of enemigos) {

            if (
                enemigo.vivo &&
                colision(bala, enemigo)
            ) {

                enemigo.vida--;

                proyectiles.splice(i, 1);

                if (enemigo.vida <= 0) {

                    enemigo.vivo = false;
                }

                break;
            }
        }
    }
}


// =============================
// ACTUALIZAR ENEMIGOS
// =============================

function actualizarEnemigos() {

    for (const enemigo of enemigos) {

        if (!enemigo.vivo) {
            continue;
        }


        enemigo.x += enemigo.velocidad * enemigo.direccion;


        // CAMBIAR DIRECCIÓN

        if (
            enemigo.x < 350 ||
            enemigo.x + enemigo.ancho > 950
        ) {

            enemigo.direccion *= -1;
        }


        // DAÑO AL JUGADOR

        if (colision(jugador, enemigo)) {

            perderVida();

            jugador.x -= enemigo.direccion * 60;
        }


        // ATAQUE DE ESPADA

        if (jugador.atacando) {

            const espada = {

                x: jugador.mirando === 1
                    ? jugador.x + jugador.ancho
                    : jugador.x - 45,

                y: jugador.y + 10,

                ancho: 45,
                alto: 30
            };


            if (colision(espada, enemigo)) {

                enemigo.vida--;

                if (enemigo.vida <= 0) {

                    enemigo.vivo = false;
                }
            }
        }
    }
}


// =============================
// VIDA
// =============================

let puedeRecibirDaño = true;

function perderVida() {

    if (!puedeRecibirDaño) {
        return;
    }

    jugador.vida--;

    vidaTexto.textContent = jugador.vida;

    puedeRecibirDaño = false;


    setTimeout(() => {

        puedeRecibirDaño = true;

    }, 800);


    if (jugador.vida <= 0) {

        alert("💀 GAME OVER");

        location.reload();
    }
}


// =============================
// MONEDAS
// =============================

let cantidadMonedas = 0;

function recogerMonedas() {

    for (const moneda of monedas) {

        if (moneda.recogida) {
            continue;
        }


        const objeto = {

            x: moneda.x,
            y: moneda.y,

            ancho: 20,
            alto: 20
        };


        if (colision(jugador, objeto)) {

            moneda.recogida = true;

            cantidadMonedas++;

            monedasTexto.textContent = cantidadMonedas;
        }
    }
}


// =============================
// DIBUJAR FONDO
// =============================

function dibujarFondo() {

    ctx.fillStyle = "#15152b";

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


// =============================
// DIBUJAR PLATAFORMAS
// =============================

function dibujarPlataformas() {

    for (const plataforma of plataformas) {

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


// =============================
// DIBUJAR JUGADOR
// =============================

function dibujarJugador() {

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

    ctx.fillStyle = "#111";

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

    if (jugador.atacando) {

        ctx.fillStyle = "#dddddd";

        if (jugador.mirando === 1) {

            ctx.fillRect(
                jugador.x + 30,
                jugador.y + 15,
                45,
                8
            );

        } else {

            ctx.fillRect(
                jugador.x - 40,
                jugador.y + 15,
                45,
                8
            );
        }
    }
}


// =============================
// DIBUJAR ENEMIGOS
// =============================

function dibujarEnemigos() {

    for (const enemigo of enemigos) {

        if (!enemigo.vivo) {
            continue;
        }


        ctx.fillStyle = "#9b2d30";

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
            enemigo.x + 21,
            enemigo.y + 10,
            7,
            7
        );


        // VIDA

        ctx.fillStyle = "#222";

        ctx.fillRect(
            enemigo.x,
            enemigo.y - 10,
            enemigo.ancho,
            5
        );

        ctx.fillStyle = "#e33";

        ctx.fillRect(
            enemigo.x,
            enemigo.y - 10,
            enemigo.ancho * (enemigo.vida / 3),
            5
        );
    }
}


// =============================
// DIBUJAR PROYECTILES
// =============================

function dibujarProyectiles() {

    for (const bala of proyectiles) {

        ctx.fillStyle = "#ffff66";

        ctx.fillRect(
            bala.x,
            bala.y,
            bala.ancho,
            bala.alto
        );
    }
}


// =============================
// DIBUJAR MONEDAS
// =============================

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
    }
}


// =============================
// ACTUALIZAR JUEGO
// =============================

function actualizar() {

    moverJugador();

    ataque();

    disparo();

    actualizarProyectiles();

    actualizarEnemigos();

    recogerMonedas();
}


// =============================
// DIBUJAR TODO
// =============================

function dibujar() {

    dibujarFondo();

    dibujarPlataformas();

    dibujarMonedas();

    dibujarEnemigos();

    dibujarProyectiles();

    dibujarJugador();
}


// =============================
// GAME LOOP
// =============================

function juego() {

    actualizar();

    dibujar();

    requestAnimationFrame(juego);
}


juego();
