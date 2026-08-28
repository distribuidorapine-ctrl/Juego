window.addEventListener("load", function () {

```
const mensaje = document.getElementById("mensaje");
const canvas = document.getElementById("game");

if (!mensaje) {
    alert("ERROR: No existe #mensaje en index.html");
    return;
}

if (!canvas) {
    mensaje.textContent = "ERROR: No existe el canvas #game";
    return;
}

mensaje.textContent = "✅ JAVASCRIPT FUNCIONA";

const ctx = canvas.getContext("2d");

ctx.fillStyle = "#15152a";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#ffffff";
ctx.font = "40px Arial";
ctx.textAlign = "center";
ctx.fillText(
    "MI PLATAFORMER",
    canvas.width / 2,
    250
);

ctx.font = "25px Arial";
ctx.fillText(
    "JavaScript está funcionando",
    canvas.width / 2,
    300
);
```

});
