const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const vidaTexto = document.getElementById("vida");
const monedasTexto = document.getElementById("monedas");


// =====================================================
// TECLAS
// =====================================================

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
        e.preventDefault();
    }

});


// =====================================================
// SISTEMA DE NIVELES
// =====================================================

let nivel = 1;

let oleada = 1;

const oleadasPorNivel = 3;

let esperandoNuevaOleada = false;

let tiempoNuevaOleada = 0;

let mensajeNivel = "";

let tiempoMensaje = 0;


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

    salto: -13,

    gravedad: 0.6,

    vida: 5,

    vidaMaxima: 5,

    mirando: 1,

    suelo: false,

    atacando: false,

    tiempoAtaque: 0,

    ataqueYaGolpeo: false

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
// PROYECTILES
// =====================================================

const proyectiles = [];


// =====================================================
// PROYECTILES ENEMIGOS
// =====================================================

const proyectilesEnemigos = [];


// =====================================================
// MONEDAS
// =====================================================

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

        x: 0,

        y: 0,

        ancho: 35,

        alto: 50,

        velocidad: 1,

        vida: 3,

        vidaMaxima: 3,

        daño: 1,

        direccion: -1,

        tipo: tipo,

        vivo: true,

        golpeado: false,

        puedeDisparar: true,

        tiempoDisparo: 0

    };


    // =================================================
    // ENEMIGO BÁSICO
    // =================================================

    if (tipo === "basico") {

        enemigo.velocidad = 1.2;

        enemigo.vida = 3;

        enemigo.vidaMaxima = 3;

    }


    // =================================================
    // ENEMIGO RÁPIDO
    // =================================================

    if (tipo === "rapido") {

        enemigo.velocidad = 2.8;

        enemigo.vida = 2;

        enemigo.vidaMaxima = 2;

        enemigo.ancho = 30;

        enemigo.alto = 40;

    }


    // =================================================
    // TANQUE
    // =================================================

    if (tipo === "tanque") {

        enemigo.velocidad = 0.7;

        enemigo.vida = 8;

        enemigo.vidaMaxima = 8;

        enemigo.ancho = 50;

        enemigo.alto = 65;

        enemigo.daño = 2;

    }


    // =================================================
    // ENEMIGO DISPARADOR
    // =================================================

    if (tipo === "disparador") {

        enemigo.velocidad = 0.8;

        enemigo.vida = 4;

        enemigo.vidaMaxima = 4;

        enemigo.ancho = 40;

        enemigo.alto = 50;

        enemigo.tiempoDisparo = 120;

    }


    // =================================================
    // ENEMIGO ÉLITE
    // =================================================

    if (tipo === "elite") {

        enemigo.velocidad = 2;

        enemigo.vida = 10;

        enemigo.vidaMaxima = 10;

        enemigo.ancho = 45;

        enemigo.alto = 60;

        enemigo.daño = 2;

    }


    // =================================================
    // POSICIÓN
    // =================================================

    enemigo.x =
        700 + Math.random() * 220;

    enemigo.y = 300;


    return enemigo;

}


// =====================================================
// CREAR OLEADA
// =====================================================

function crearOleada() {

    enemigos = [];

    const cantidad =
        2 + nivel + oleada;


    for (let i = 0; i < cantidad; i++) {

        let tipo = "basico";


        // NIVEL 1
        if (nivel === 1) {

            tipo = "basico";

        }


        // NIVEL 2
        else if (nivel === 2) {

            if (i % 3 === 0) {

                tipo = "rapido";

            } else {

                tipo = "basico";

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

                tipo = "basico";

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

            const numero =
                i % 5;


            if (numero === 0) {

                tipo = "elite";

            }

            else if (numero === 1) {

                tipo = "disparador";

            }

            else if (numero === 2) {

                tipo = "tanque";

            }

            else if (numero === 3) {

                tipo = "rapido";

            }

            else {

                tipo = "basico";

            }

        }


        enemigos.push(
            crearEnemigo(tipo)
        );

    }


    jugador.x = 100;

    jugador.y = 300;

    jugador.velocidadY = 0;


    mensajeNivel =
        "NIVEL " +
        nivel +
        " - OLEADA " +
        oleada;

    tiempoMensaje = 120;

}


// =====================================================
// SIGUIENTE OLEADA
// =====================================================

function siguienteOleada() {

    esperandoNuevaOleada = false;

    tiempoNuevaOleada = 0;


    oleada++;


    if (oleada > oleadasPorNivel) {

        siguienteNivel();

        return;

    }


    crearOleada();

}


// =====================================================
// SIGUIENTE NIVEL
// =====================================================

function siguienteNivel() {

    nivel++;

    oleada = 1;


    // Recuperar algo de vida

    jugador.vida += 2;


    if (jugador.vida > jugador.vidaMaxima) {

        jugador.vida =
            jugador.vidaMaxima;

    }


    vidaTexto.textContent =
        jugador.vida;


    mensajeNivel =
        "¡NIVEL " +
        nivel +
        "!";


    tiempoMensaje = 180;


    crearOleada();

}


// =====================================================
// COMPROBAR OLEADA
// =====================================================

function comprobarOleada() {

    if (esperandoNuevaOleada) {

        return;

    }


    const enemigosVivos =
        enemigos.filter(
            enemigo => enemigo.vivo
        );


    if (
        enemigosVivos.length === 0
    ) {

        esperandoNuevaOleada = true;

        tiempoNuevaOleada = 120;

        mensajeNivel =
            "¡OLEADA COMPLETADA!";

        tiempoMensaje = 120;

    }

}


// =====================================================
// MOVIMIENTO JUGADOR
// =====================================================

function moverJugador() {

    if (
        teclas["a"] ||
        teclas["arrowleft"]
    ) {

        jugador.x -=
            jugador.velocidad;

        jugador.mirando = -1;

    }


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
            teclas.space ||
            teclas["w"] ||
            teclas["arrowup"]
        ) &&
        jugador.suelo
    ) {

        jugador.velocidadY =
            jugador.salto;

        jugador.suelo = false;

    }


    // GRAVEDAD

    jugador.velocidadY +=
        jugador.gravedad;

    jugador.y +=
        jugador.velocidadY;


    jugador.suelo = false;


    // =================================================
    // PLATAFORMAS
    // =================================================

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


    // LÍMITES

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


    // CAÍDA

    if (
        jugador.y >
        canvas.height
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

function ataque() {

    if (
        teclas["j"] &&
        !jugador.atacando
    ) {

        jugador.atacando = true;

        jugador.tiempoAtaque = 15;

        jugador.ataqueYaGolpeo = false;

    }


    if (
        jugador.atacando
    ) {

        jugador.tiempoAtaque--;


        // El ataque golpea una sola vez

        if (
            jugador.tiempoAtaque <= 10 &&
            !jugador.ataqueYaGolpeo
        ) {

            atacarEnemigos();

            jugador.ataqueYaGolpeo =
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
// GOLPE DE ESPADA
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

        if (
            !enemigo.vivo
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

            enemigo.golpeado = true;


            enemigo.x +=
                jugador.mirando * 25;


            setTimeout(() => {

                enemigo.golpeado =
                    false;

            }, 120);


            if (
                enemigo.vida <= 0
            ) {

                enemigo.vivo = false;

            }

        }

    }

}


// =====================================================
// DISPARO
// =====================================================

let puedeDisparar = true;


function disparo() {

    if (
        teclas["k"] &&
        puedeDisparar
    ) {

        proyectiles.push({

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
                10 *
                jugador.mirando

        });


        puedeDisparar = false;


        setTimeout(() => {

            puedeDisparar = true;

        }, 250);

    }

}


// =====================================================
// PROYECTILES
// =====================================================

function actualizarProyectiles() {

    for (
        let i =
            proyectiles.length - 1;

        i >= 0;

        i--
    ) {

        const bala =
            proyectiles[i];


        bala.x +=
            bala.velocidad;


        if (
            bala.x < -50 ||
            bala.x >
            canvas.width + 50
        ) {

            proyectiles.splice(i, 1);

            continue;

        }


        for (
            const enemigo of enemigos
        ) {

            if (
                !enemigo.vivo
            ) {

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


                setTimeout(() => {

                    enemigo.golpeado =
                        false;

                }, 100);


                proyectiles.splice(
                    i,
                    1
                );


                if (
                    enemigo.vida <= 0
                ) {

                    enemigo.vivo =
                        false;

                }


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

        if (
            !enemigo.vivo
        ) {

            continue;

        }


        // =================================================
        // ENEMIGO DISPARADOR
        // =================================================

        if (
            enemigo.tipo ===
            "disparador"
        ) {

            enemigo.tiempoDisparo--;


            if (
                enemigo.tiempoDisparo <= 0
            ) {

                disparoEnemigo(
                    enemigo
                );

                enemigo.tiempoDisparo =
                    150 -
                    Math.min(
                        nivel * 10,
                        80
                    );

            }

        }


        // =================================================
        // MOVIMIENTO
        // =================================================

        enemigo.x +=
            enemigo.velocidad *
            enemigo.direccion;


        // =================================================
        // LÍMITES
        // =================================================

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


        // =================================================
        // DAÑO AL JUGADOR
        // =================================================

        if (
            colision(
                jugador,
                enemigo
            )
        ) {

            perderVida();

            jugador.x -=
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


    proyectilesEnemigos.push({

        x:
            enemigo.x +
            enemigo.ancho / 2,

        y:
            enemigo.y + 20,

        ancho: 10,

        alto: 10,

        velocidad:
            5 * direccion

    });

}


// =====================================================
// ACTUALIZAR DISPAROS ENEMIGOS
// =====================================================

function actualizarProyectilesEnemigos() {

    for (
        let i =
            proyectilesEnemigos.length - 1;

        i >= 0;

        i--
    ) {

        const bala =
            proyectilesEnemigos[i];


        bala.x +=
            bala.velocidad;


        if (
            bala.x < -50 ||
            bala.x >
            canvas.width + 50
        ) {

            proyectilesEnemigos.splice(
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


            proyectilesEnemigos.splice(
                i,
                1
            );

        }

    }

}


// =====================================================
// VIDA
// =====================================================

let puedeRecibirDaño = true;


function perderVida() {

    if (
        !puedeRecibirDaño
    ) {

        return;

    }


    jugador.vida--;


    if (
        jugador.vida < 0
    ) {

        jugador.vida = 0;

    }


    vidaTexto.textContent =
        jugador.vida;


    puedeRecibirDaño = false;


    setTimeout(() => {

        puedeRecibirDaño = true;

    }, 800);


    if (
        jugador.vida <= 0
    ) {

        setTimeout(() => {

            alert(
                "💀 GAME OVER\n\n" +
                "Llegaste al nivel " +
                nivel
            );

            location.reload();

        }, 100);

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


            monedasTexto.textContent =
                cantidadMonedas;

        }

    }

}


// =====================================================
// FONDO
// =====================================================

function dibujarFondo() {

    ctx.fillStyle =
        "#15152b";


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

    // Parpadeo al recibir daño

    if (
        !puedeRecibirDaño &&
        Math.floor(
            Date.now() / 80
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
            "#dddddd";


        if (
            jugador.mirando === 1
        ) {

            ctx.fillRect(

                jugador.x + 30,

                jugador.y + 15,

                45,

                8

            );

        }

        else {

            ctx.fillRect(

                jugador.x - 40,

                jugador.y + 15,

                45,

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
            !enemigo.vivo
        ) {

            continue;

        }


        // COLOR

        if (
            enemigo.tipo ===
            "basico"
        ) {

            ctx.fillStyle =
                "#9b2d30";

        }


        else if (
            enemigo.tipo ===
            "rapido"
        ) {

            ctx.fillStyle =
                "#e06b25";

        }


        else if (
            enemigo.tipo ===
            "tanque"
        ) {

            ctx.fillStyle =
                "#5e5e65";

        }


        else if (
            enemigo.tipo ===
            "disparador"
        ) {

            ctx.fillStyle =
                "#7435a8";

        }


        else if (
            enemigo.tipo ===
            "elite"
        ) {

            ctx.fillStyle =
                "#b326a8";

        }


        if (
            enemigo.golpeado
        ) {

            ctx.fillStyle =
                "#ffffff";

        }


        ctx.fillRect(

            enemigo.x,

            enemigo.y,

            enemigo.ancho,

            enemigo.alto

        );


        // OJOS

        ctx.fillStyle =
            "#ffffff";


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


        // BARRA VIDA

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

    }

}


// =====================================================
// PROYECTILES
// =====================================================

function dibujarProyectiles() {

    for (
        const bala of proyectiles
    ) {

        ctx.fillStyle =
            "#ffff66";


        ctx.fillRect(

            bala.x,

            bala.y,

            bala.ancho,

            bala.alto

        );

    }

}


// =====================================================
// PROYECTILES ENEMIGOS
// =====================================================

function dibujarProyectilesEnemigos() {

    for (
        const bala of proyectilesEnemigos
    ) {

        ctx.fillStyle =
            "#ff5555";


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
// INFORMACIÓN DE NIVEL
// =====================================================

function dibujarInformacionNivel() {

    ctx.textAlign = "center";


    ctx.fillStyle =
        "white";


    ctx.font =
        "bold 22px Arial";


    ctx.fillText(

        "Nivel " +
        nivel +
        "  |  Oleada " +
        oleada +
        "/" +
        oleadasPorNivel,

        canvas.width / 2,

        35

    );


    if (
        tiempoMensaje > 0
    ) {

        ctx.font =
            "bold 35px Arial";


        ctx.fillStyle =
            "#ffffff";


        ctx.shadowColor =
            "#7777ff";


        ctx.shadowBlur =
            15;


        ctx.fillText(

            mensajeNivel,

            canvas.width / 2,

            canvas.height / 2

        );


        ctx.shadowBlur = 0;


        tiempoMensaje--;

    }

}


// =====================================================
// ACTUALIZAR
// =====================================================

function actualizar() {

    if (
        esperandoNuevaOleada
    ) {

        tiempoNuevaOleada--;


        if (
            tiempoNuevaOleada <= 0
        ) {

            siguienteOleada();

        }

    }


    moverJugador();

    ataque();

    disparo();

    actualizarProyectiles();

    actualizarProyectilesEnemigos();

    actualizarEnemigos();

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

    dibujarProyectiles();

    dibujarProyectilesEnemigos();

    dibujarJugador();

    dibujarInformacionNivel();

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

vidaTexto.textContent =
    jugador.vida;

monedasTexto.textContent =
    cantidadMonedas;


crearOleada();


juego();
