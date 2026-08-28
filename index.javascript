"use strict";

console.log("================================");
console.log("INDEX.JS CARGADO");
console.log("================================");

function iniciarPrueba() {

```
const mensaje = document.getElementById("mensaje");
const canvas = document.getElementById("game");

if (!mensaje) {
    alert("ERROR: No existe el elemento mensaje");
    return;
}

if (!canvas) {
    mensaje.textContent = "ERROR: NO SE ENCUENTRA EL CANVAS";
    return;
}

mensaje.textContent = "✅ JAVASCRIPT FUNCIONA";

const ctx = canvas.getContext("2d");

ctx.fillStyle = "#111122";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#ffffff";
ctx.font = "bold 45px Arial";
ctx.textAlign = "center";

ctx.fillText(
    "⚔️ MI PLATAFORMER",
    canvas.width / 2,
    250
);

ctx.font = "28px Arial";

ctx.fillText(
    "JAVASCRIPT ESTÁ FUNCIONANDO",
    canvas.width / 2,
    320
);

console.log("PRUEBA COMPLETADA");
```

}

if (document.readyState === "loading") {

```
document.addEventListener(
    "DOMContentLoaded",
    iniciarPrueba
);
```

} else {

```
iniciarPrueba();
```

}
