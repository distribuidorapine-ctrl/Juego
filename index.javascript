// =====================================================
// PLATAFORMER - GITHUB PAGES
// =====================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const vidaTexto = document.getElementById("vida");
const monedasTexto = document.getElementById("monedas");
const nivelTexto = document.getElementById("nivel");
const oleadaTexto = document.getElementById("oleada");
const mensajeTexto = document.getElementById("mensaje");


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
        e.preventDefault();
    }

});


// =====================================================
// NIVEL Y OLEADA
// =====================================================

let nivel = 1;
let oleada = 1;

const MAX_OLEADAS = 3;

let cambiandoOleada = false;
let contadorOleada = 0;


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

    tiempoAtaque: 0,

    ataqueGolpeado: false,

    invulnerable: false,

    tiempoInvulnerable: 0
};


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

let balas = [];

let balasEnemigas = [];

let puedeDisparar = true;


// =====================================================
// MONEDAS
// =====================================================

let monedas = [

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

    let enemigo = {

        x: 750,

        y: 300,

        ancho: 35,

        alto: 50,

        velocidad: 1.2,

        vida: 3,

        vidaMaxima: 3,

        daño: 1,

        tipo: tipo,

        direccion: -1,

        vivo: true,

        golpeado: false,

        contadorDisparo: 150
    };


    // ENEMIGO NORMAL

    if (tipo === "normal") {

        enemigo.velocidad = 1.2;

        enemigo.vida = 3;

        enemigo.vidaMaxima = 3;

    }


    // ENEMIGO RÁPIDO

    if (tipo === "rapido") {

        enemigo.velocidad = 2.5;

        enemigo.vida = 2;

        enemigo.vidaMaxima = 2;

        enemigo.ancho = 30;

        enemigo.alto = 40;

    }


    // TANQUE

    if (tipo === "tanque") {

        enemigo.velocidad = 0.6;

        enemigo.vida = 8;

        enemigo.vidaMaxima = 8;

        enemigo.ancho = 50;

        enemigo.alto = 65;

        enemigo.daño = 2;

    }


    // DISPARADOR

    if (tipo === "disparador") {

        enemigo.velocidad = 0.8;

        enemigo.vida = 4;

        enemigo.vidaMaxima = 4;

        enemigo.contadorDisparo = 120;

    }


    // ÉLITE

    if (tipo === "elite") {

        enemigo.velocidad = 2;

        enemigo.vida = 10;

        enemigo.vidaMaxima = 10;

        enemigo.ancho = 45;

        enemigo.alto = 60;

        enemigo.daño = 2;

    }


    enemigo.x =
        500 + Math.random() * 400;


    enemigo.y = 300;


    return enemigo;
}


// =====================================================
// CREAR OLEADA
// =====================================================

function crearOleada() {

    enemigos = [];

    balas = [];

    balasEnemigas = [];

    jugador.x = 100;
    jugador.y = 300;
    jugador.velocidadY = 0;


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
                tipo = "rapido";
            }
            else {
                tipo = "normal";
            }

        }


        // NIVEL 3

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


        // NIVEL 4

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


        // NIVEL 5+

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

    mostrarMensaje(
        "NIVEL " +
        nivel +
        " - OLEADA " +
        oleada
    );

}


// =====================================================
// SIGUIENTE OLEADA
// =====================================================

function siguienteOleada() {

    cambiandoOleada = false;

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

        mostrarMensaje(
            "⭐ ¡NIVEL " +
            nivel +
            "!"
        );

    }

    crearOleada();
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
// MENSAJE
// =====================================================

function mostrarMensaje(texto) {

    mensajeTexto.textContent =
        texto;

    setTimeout(function () {

        mensajeTexto.textContent =
            "";

    }, 1800);
}


// =====================================================
// MOVIMIENTO JUGADOR
// =====================================================

function moverJugador() {

    // IZQUIERDA

    if (
        teclas["a"] ||
        teclas["arrowleft"]
    ) {

        jugador.x -=
            jugador.velocidad;

        jugador.mirando = -1;

    }


    // DERECHA

    if (
        teclas["d"] ||
        teclas["arrowright"]
    ) {

        jugador.x +=
            jugador.velocidad;

        jugador.mirando = 1;

    }


    // SALTO

    if (
        (
            teclas["w"] ||
            teclas["arrowup"] ||
            teclas.space
        ) &&
        jugador.suelo
    ) {

        jugador.velocidadY =
            jugador.fuerzaSalto;

        jugador.suelo = false;

    }


    // GRAVEDAD

    jugador.velocidadY +=
        jugador.gravedad;

    jugador.y +=
        jugador.velocidadY;


    jugador.suelo = false;


    // PLATAFORMAS

    for (
        const plataforma of plataformas
    ) {

        if (

            jugador.x <
            plataforma.x +
            plataforma.ancho &&

            jugador.x +
            jugador.ancho >
            plataforma.x &&

            jugador.y +
            jugador.alto >=
            plataforma.y &&

            jugador.y +
            jugador.alto <=
            plataforma.y +
            plataforma.alto + 15 &&

            jugador.velocidadY >= 0

        ) {

            jugador.y =
                plataforma.y -
                jugador.alto;

            jugador.velocidadY = 0;

            jugador.suelo = true;

        }

    }


    // LÍMITE IZQUIERDO

    if (jugador.x < 0) {
        jugador.x = 0;
    }


    // LÍMITE DERECHO

    if (
        jugador.x +
        jugador.ancho >
        canvas.width
    ) {

        jugador.x =
            canvas.width -
            jugador.ancho;

    }


    // CAÍDA

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
// ATAQUE
// =====================================================

function actualizarAtaque() {

    if (
        teclas["j"] &&
        !jugador.atacando
    ) {

        jugador.atacando = true;

        jugador.tiempoAtaque = 15;

        jugador.ataqueGolpeado = false;

    }


    if (
        jugador.atacando
    ) {

        jugador.tiempoAtaque--;


        if (
            jugador.tiempoAtaque <= 10 &&
            !jugador.ataqueGolpeado
        ) {

            atacarEnemigos();

            jugador.ataqueGolpeado =
                true;

        }


        if (
            jugador.tiempoAtaque <= 0
        ) {

            jugador.atacando = false;

        }

    }

}


// =====================================================
// ATAQUE A ENEMIGOS
// =====================================================

function atacarEnemigos() {

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

        if (!enemigo.vivo) {
            continue;
        }


        if (
            colision(
                espada,
                enemigo
            )
        ) {

            enemigo.vida--;

            enemigo.golpeado =
                true;


            enemigo.x +=
                jugador.mirando * 30;


            if (
                enemigo.vida <= 0
            ) {

                enemigo.vivo =
                    false;

            }

        }

    }

}


// =====================================================
// DISPARO
// =====================================================

function disparar() {

    if (
        !teclas["k"] ||
        !puedeDisparar
    ) {
        return;
    }


    balas.push({

        x:
            jugador.mirando === 1
                ? jugador.x +
                  jugador.ancho
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
// ACTUALIZAR BALAS
// =====================================================

function actualizarBalas() {

    for (
        let i = balas.length - 1;
        i >= 0;
        i--
    ) {

        const bala = balas[i];

        bala.x +=
            bala.velocidad;


        if (
            bala.x < -50 ||
            bala.x >
            canvas.width + 50
        ) {

            balas.splice(i, 1);

            continue;
        }


        for (
            const enemigo of enemigos
        ) {

            if (!enemigo.vivo) {
                continue;
            }


            if (
                colision(
                    bala,
                    enemigo
                )
            ) {

                enemigo.vida--;

                enemigo.golpeado =
                    true;


                if (
                    enemigo.vida <= 0
                ) {

                    enemigo.vivo =
                        false;

                }


                balas.splice(i, 1);

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

        if (!enemigo.vivo) {
            continue;
        }


        // MOVIMIENTO

        enemigo.x +=
            enemigo.velocidad *
            enemigo.direccion;


        if (
            enemigo.x < 350
        ) {

            enemigo.x = 350;

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


        // DISPARADOR

        if (
            enemigo.tipo ===
            "disparador"
        ) {

            enemigo.contadorDisparo--;


            if (
                enemigo.contadorDisparo <= 0
            ) {

                disparoEnemigo(
                    enemigo
                );

                enemigo.contadorDisparo =
                    120;

            }

        }


        // CONTACTO

        if (
            colision(
                jugador,
                enemigo
            )
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
        jugador.x <
        enemigo.x
            ? -1
            : 1;


    balasEnemigas.push({

        x:
            enemigo.x,

        y:
            enemigo.y + 20,

        ancho: 10,

        alto: 10,

        velocidad:
            direccion * 5
    });

}


// =====================================================
// ACTUALIZAR BALAS ENEMIGAS
// =====================================================

function actualizarBalasEnemigas() {

    for (
        let i =
            balasEnemigas.length - 1;

        i >= 0;

        i--
    ) {

        const bala =
            balasEnemigas[i];


        bala.x +=
            bala.velocidad;


        if (
            bala.x < -50 ||
            bala.x >
            canvas.width + 50
        ) {

            balasEnemigas.splice(
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


            balasEnemigas.splice(
                i,
                1
            );

        }

    }

}


// =====================================================
// VIDA
// =====================================================

function perderVida() {

    if (
        jugador.invulnerable
    ) {
        return;
    }


    jugador.vida--;


    jugador.invulnerable =
        true;

    jugador.tiempoInvulnerable =
        60;


    actualizarInterfaz();


    if (
        jugador.vida <= 0
    ) {

        mostrarMensaje(
            "💀 GAME OVER"
        );


        setTimeout(
            reiniciarJuego,
            1000
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


    jugador.tiempoInvulnerable--;


    if (
        jugador.tiempoInvulnerable <= 0
    ) {

        jugador.invulnerable =
            false;

    }

}


// =====================================================
// MONEDAS
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


        const objeto = {

            x: moneda.x,

            y: moneda.y,

            ancho: 20,

            alto: 20
        };


        if (
            colision(
                jugador,
                objeto
            )
        ) {

            moneda.recogida =
                true;

            cantidadMonedas++;

            actualizarInterfaz();

        }

    }

}


// =====================================================
// COMPROBAR OLEADA
// =====================================================

function comprobarOleada() {

    if (cambiandoOleada) {
        return;
    }


    const vivos =
        enemigos.filter(
            e => e.vivo
        ).length;


    if (
        vivos === 0
    ) {

        cambiandoOleada = true;

        contadorOleada = 120;

        mostrarMensaje(
            "🌊 ¡OLEADA COMPLETADA!"
        );

    }

}


// =====================================================
// FONDO
// =====================================================

function dibujarFondo() {

    ctx.fillStyle =
        "#111122";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // LUNA

    ctx.fillStyle =
        "#ddddaa";

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
        "#242440";

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

    // PARPADEO

    if (
        jugador.invulnerable &&
        Math.floor(
            jugador.tiempoInvulnerable / 5
        ) % 2 === 0
    ) {
        return;
    }


    // CUERPO

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
        "#111111";

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

        if (!enemigo.vivo) {
            continue;
        }


        if (
            enemigo.tipo === "normal"
        ) {

            ctx.fillStyle =
                "#b52d35";

        }

        else if (
            enemigo.tipo === "rapido"
        ) {

            ctx.fillStyle =
                "#e47722";

        }

        else if (
            enemigo.tipo === "tanque"
        ) {

            ctx.fillStyle =
                "#555566";

        }

        else if (
            enemigo.tipo === "disparador"
        ) {

            ctx.fillStyle =
                "#843bb5";

        }

        else {

            ctx.fillStyle =
                "#d128b4";

        }


        if (
            enemigo.golpeado
        ) {

            ctx.fillStyle =
                "white";

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


        // VIDA

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

    }

}


// =====================================================
// BALAS
// =====================================================

function dibujarBalas() {

    for (
        const bala of balas
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
        const bala of balasEnemigas
    ) {

        ctx.fillStyle =
            "#ff4444";

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


// =====================================================
// ACTUALIZAR
// =====================================================

function actualizar() {

    if (
        cambiandoOleada
    ) {

        contadorOleada--;

        if (
            contadorOleada <= 0
        ) {

            siguienteOleada();

        }

    }


    moverJugador();

    actualizarAtaque();

    disparar();

    actualizarBalas();

    actualizarBalasEnemigas();

    actualizarEnemigos();

    actualizarInvulnerabilidad();

    recogerMonedas();

    comprobarOleada();

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
// REINICIAR
// =====================================================

function reiniciarJuego() {

    nivel = 1;

    oleada = 1;

    cantidadMonedas = 0;

    jugador.vida =
        jugador.vidaMaxima;

    monedas.forEach(
        moneda => {
            moneda.recogida = false;
        }
    );

    actualizarInterfaz();

    crearOleada();

}


// =====================================================
// GAME LOOP
// =====================================================

function juego() {

    actualizar();

    dibujar();

    requestAnimationFrame(
        juego
    );

}


// =====================================================
// INICIO
// =====================================================

actualizarInterfaz();

crearOleada();

juego();
