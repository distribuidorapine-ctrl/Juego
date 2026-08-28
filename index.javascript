"use strict";

console.log("INDEX.JS SE ESTA CARGANDO");

window.addEventListener("DOMContentLoaded", function () {

    const mensaje = document.getElementById("mensaje");
    const error = document.getElementById("errorJuego");
    const canvas = document.getElementById("game");

    if (!mensaje) {
        console.error("NO EXISTE #mensaje");
        return;
    }

    if (!canvas) {
        mensaje.textContent = "ERROR: NO EXISTE EL CANVAS";
        return;
    }

    mensaje.textContent = "✅ ¡JUEGO CARGADO!";

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#101025";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("MI PLATAFORMER", 320, 250);

    ctx.font = "24px Arial";
    ctx.fillText("A/D = Mover", 400, 320);
    ctx.fillText("ESPACIO = Saltar", 370, 360);

});
