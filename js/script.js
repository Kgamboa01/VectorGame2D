// =============================================
// VECTORGAME 2D
// Simulador de movimiento vectorial
// =============================================


// =============================================
// 1. ELEMENTOS DE LA INTERFAZ
// =============================================

const canvas = document.getElementById("vectorCanvas");
const ctx = canvas.getContext("2d");

const simulateBtn = document.getElementById("simulateBtn");
const resetBtn = document.getElementById("resetBtn");

const resultVector = document.getElementById("resultVector");
const finalPosition = document.getElementById("finalPosition");
const resultMagnitude = document.getElementById("resultMagnitude");

const mathSteps = document.getElementById("mathSteps");
const simulationStatus = document.getElementById("simulationStatus");


// =============================================
// 2. VALORES INICIALES
// =============================================

const DEFAULTS = {
    ax: 3,
    ay: 2,
    bx: 1,
    by: -1,
    alpha: 2,
    beta: 1
};

const state = {
    active: false,
    values: null,
    progress: 0
};


// =============================================
// CONVERTIR NÚMEROS DECIMALES
// =============================================

function parseDecimal(value) {

    // Eliminar espacios y convertir coma en punto
    const normalized = value.trim().replace(",", ".");

    // Validar el formato numérico
    const decimalPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

    if (!decimalPattern.test(normalized)) {
        return null;
    }

    const number = Number(normalized);

    return Number.isFinite(number) ? number : null;

}


// =============================================
// LEER LOS VALORES INGRESADOS
// =============================================

function readInputs() {

    const values = {};

    const fields = [
        "ax", "ay",
        "bx", "by",
        "alpha", "beta"
    ];

    for (const field of fields) {

        const input = document.getElementById(field);

        const value = parseDecimal(input.value);

        if (value === null) {

            alert(
                "Por favor, ingresa un número válido. Puedes utilizar coma o punto decimal."
            );

            input.focus();

            return null;

        }

        values[field] = value;

    }

    return values;

}


// =============================================
// 4. FORMATEAR LOS RESULTADOS
// =============================================

function formatNumber(value) {

    const rounded = Number(value.toFixed(2));

    return Object.is(rounded, -0) ? "0" : String(rounded);
}


// =============================================
// 5. REALIZAR LOS CÁLCULOS MATEMÁTICOS
// =============================================

function calculateVectors(values) {

    // Vector A
    const A = {
        x: values.ax,
        y: values.ay
    };

    // Vector B
    const B = {
        x: values.bx,
        y: values.by
    };


    // Multiplicación por escalares

    const alphaA = {
        x: values.alpha * A.x,
        y: values.alpha * A.y
    };

    const betaB = {
        x: values.beta * B.x,
        y: values.beta * B.y
    };


    // Suma de vectores

    const R = {
        x: alphaA.x + betaB.x,
        y: alphaA.y + betaB.y
    };


    // Magnitud del vector resultante

    const magnitude = Math.sqrt(
        Math.pow(R.x, 2) + Math.pow(R.y, 2)
    );


    return {
        A,
        B,
        alphaA,
        betaB,
        R,
        magnitude
    };

}


// =============================================
// 6. MOSTRAR LOS RESULTADOS
// =============================================

function displayResults(result) {

    resultVector.textContent =
        `(${formatNumber(result.R.x)}, ${formatNumber(result.R.y)})`;

    finalPosition.textContent =
        `(${formatNumber(result.R.x)}, ${formatNumber(result.R.y)})`;

    resultMagnitude.textContent =
        formatNumber(result.magnitude);

}


// =============================================
// 7. MOSTRAR EL PROCEDIMIENTO MATEMÁTICO
// =============================================

function displayProcedure(values, result) {

    const A = result.A;
    const B = result.B;

    const alphaA = result.alphaA;
    const betaB = result.betaB;

    const R = result.R;


    mathSteps.innerHTML = `

        <div class="math-step">

            <div class="step-number">01</div>

            <div class="step-content">

                <h4>Identificación de los vectores</h4>

                <p class="math-explanation">
                    Primero identificamos los dos vectores ingresados
                    y sus respectivos factores escalares.
                </p>

                <div class="math-equation">
                    A = (${formatNumber(A.x)}, ${formatNumber(A.y)})
                </div>

                <div class="math-equation">
                    B = (${formatNumber(B.x)}, ${formatNumber(B.y)})
                </div>

            </div>

        </div>


        <div class="math-step">

            <div class="step-number">02</div>

            <div class="step-content">

                <h4>Multiplicación por escalares</h4>

                <p class="math-explanation">
                    Multiplicamos cada componente de los vectores
                    por su correspondiente factor escalar.
                </p>

                <div class="math-equation">
                    αA = ${formatNumber(values.alpha)}
                    (${formatNumber(A.x)}, ${formatNumber(A.y)})
                </div>

                <div class="math-equation">
                    αA = (${formatNumber(alphaA.x)},
                    ${formatNumber(alphaA.y)})
                </div>

                <div class="math-equation">
                    βB = ${formatNumber(values.beta)}
                    (${formatNumber(B.x)}, ${formatNumber(B.y)})
                </div>

                <div class="math-equation">
                    βB = (${formatNumber(betaB.x)},
                    ${formatNumber(betaB.y)})
                </div>

            </div>

        </div>


        <div class="math-step">

            <div class="step-number">03</div>

            <div class="step-content">

                <h4>Suma de vectores</h4>

                <p class="math-explanation">
                    Sumamos las componentes X entre sí y las
                    componentes Y entre sí.
                </p>

                <div class="math-equation">
                    R = αA + βB
                </div>

                <div class="math-equation">
                    R = (${formatNumber(alphaA.x)},
                    ${formatNumber(alphaA.y)})
                    +
                    (${formatNumber(betaB.x)},
                    ${formatNumber(betaB.y)})
                </div>

                <div class="math-equation">
                    R = (${formatNumber(alphaA.x)}
                    ${betaB.x < 0 ? "-" : "+"}
                    ${formatNumber(Math.abs(betaB.x))},
                    ${formatNumber(alphaA.y)}
                    ${betaB.y < 0 ? "-" : "+"}
                    ${formatNumber(Math.abs(betaB.y))})
                </div>

            </div>

        </div>


        <div class="math-step result-step">

            <div class="step-number">04</div>

            <div class="step-content">

                <h4>Vector resultante y posición final</h4>

                <p class="math-explanation">
                    El resultado de la combinación lineal
                    representa el desplazamiento total.
                </p>

                <div class="math-equation final-equation">
                    R = (${formatNumber(R.x)}, ${formatNumber(R.y)})
                </div>

                <div class="math-equation">
                    Posición final = (${formatNumber(R.x)},
                    ${formatNumber(R.y)})
                </div>

            </div>

        </div>


        <div class="math-step">

            <div class="step-number">05</div>

            <div class="step-content">

                <h4>Cálculo de la magnitud</h4>

                <p class="math-explanation">
                    Calculamos la longitud del vector resultante
                    utilizando el teorema de Pitágoras.
                </p>

                <div class="math-equation">
                    |R| = √(Rx² + Ry²)
                </div>

                <div class="math-equation">
                    |R| = √(${formatNumber(R.x)}²
                    + ${formatNumber(R.y)}²)
                </div>

                <div class="math-equation final-equation">
                    |R| = ${formatNumber(result.magnitude)}
                </div>

            </div>

        </div>

    `;

}


// =============================================
// 8. CONFIGURAR EL PLANO CARTESIANO
// =============================================

function getCoordinates(result) {

    const points = [
        { x: 0, y: 0 },
        { x: result.alphaA.x, y: result.alphaA.y },
        { x: result.R.x, y: result.R.y }
    ];

    const minDataX = Math.min(...points.map(p => p.x));
    const maxDataX = Math.max(...points.map(p => p.x));

    const minDataY = Math.min(...points.map(p => p.y));
    const maxDataY = Math.max(...points.map(p => p.y));

    const rangeX = Math.max(maxDataX - minDataX, 1);
    const rangeY = Math.max(maxDataY - minDataY, 1);

    const padding = Math.max(rangeX, rangeY) * 0.18 + 0.5;

    const minX = minDataX - padding;
    const maxX = maxDataX + padding;

    const minY = minDataY - padding;
    const maxY = maxDataY + padding;


    const scaleX = (canvas.width - 100) / (maxX - minX);
    const scaleY = (canvas.height - 100) / (maxY - minY);

    const scale = Math.min(scaleX, scaleY);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;


    function toCanvas(x, y) {

        return {
            x: canvas.width / 2 + (x - centerX) * scale,
            y: canvas.height / 2 - (y - centerY) * scale
        };

    }


    return {
        scale,
        minX,
        maxX,
        minY,
        maxY,
        toCanvas
    };

}


// =============================================
// 9. DIBUJAR EL PLANO CARTESIANO
// =============================================

function getGridStep(scale) {

    const rawStep = 75 / scale;

    const power = Math.pow(
        10,
        Math.floor(Math.log10(rawStep))
    );

    const normalized = rawStep / power;

    let step;

    if (normalized <= 1) {
        step = 1;
    } else if (normalized <= 2) {
        step = 2;
    } else if (normalized <= 5) {
        step = 5;
    } else {
        step = 10;
    }

    return step * power;

}


function drawGrid(plot) {

    const width = canvas.width;
    const height = canvas.height;

    const step = getGridStep(plot.scale);


    // Fondo

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);


    // Líneas de cuadrícula

    ctx.strokeStyle = "#e5eaf2";
    ctx.lineWidth = 1;


    for (
        let x = Math.ceil(plot.minX / step) * step;
        x <= plot.maxX;
        x += step
    ) {

        const point = plot.toCanvas(x, 0);

        ctx.beginPath();
        ctx.moveTo(point.x, 0);
        ctx.lineTo(point.x, height);
        ctx.stroke();

    }


    for (
        let y = Math.ceil(plot.minY / step) * step;
        y <= plot.maxY;
        y += step
    ) {

        const point = plot.toCanvas(0, y);

        ctx.beginPath();
        ctx.moveTo(0, point.y);
        ctx.lineTo(width, point.y);
        ctx.stroke();

    }


    // Ejes X e Y

    const origin = plot.toCanvas(0, 0);

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);


    // Eje X

    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y);
    ctx.stroke();


    // Eje Y

    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height);
    ctx.stroke();


    // Números de los ejes

    ctx.fillStyle = "#64748b";
    ctx.font = "12px Arial";


    for (
        let x = Math.ceil(plot.minX / step) * step;
        x <= plot.maxX;
        x += step
    ) {

        if (Math.abs(x) < step / 1000) continue;

        const point = plot.toCanvas(x, 0);

        ctx.textAlign = "center";
        ctx.fillText(formatNumber(x), point.x, origin.y + 20);

    }


    for (
        let y = Math.ceil(plot.minY / step) * step;
        y <= plot.maxY;
        y += step
    ) {

        if (Math.abs(y) < step / 1000) continue;

        const point = plot.toCanvas(0, y);

        ctx.textAlign = "right";
        ctx.fillText(formatNumber(y), origin.x - 10, point.y + 4);

    }


    // Identificación de los ejes

    ctx.fillStyle = "#334155";
    ctx.font = "bold 13px Arial";

    ctx.textAlign = "right";
    ctx.fillText("X", width - 15, origin.y - 12);

    ctx.textAlign = "left";
    ctx.fillText("Y", origin.x + 12, 20);

}


// =============================================
// 10. DIBUJAR FLECHAS VECTORIALES
// =============================================

function drawArrow(from, to, plot, color, label, progress = 1, dashed = false) {

    const start = plot.toCanvas(from.x, from.y);
    const finish = plot.toCanvas(to.x, to.y);

    const end = {
        x: start.x + (finish.x - start.x) * progress,
        y: start.y + (finish.y - start.y) * progress
    };


    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const angle = Math.atan2(dy, dx);


    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;

    ctx.setLineDash(dashed ? [9, 6] : []);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.setLineDash([]);


    // Punta de la flecha

    if (progress > 0.03) {

        const headLength = 12;

        ctx.beginPath();
        ctx.moveTo(end.x, end.y);

        ctx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
        );

        ctx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
        );

        ctx.closePath();
        ctx.fill();

    }


    // Nombre del vector

    if (progress > 0.65) {

        const middleX = (start.x + finish.x) / 2;
        const middleY = (start.y + finish.y) / 2;

        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";

        ctx.fillStyle = color;

        ctx.fillText(label, middleX + 10, middleY - 12);

    }

}


// =============================================
// 11. DIBUJAR EL PERSONAJE
// =============================================

function drawPlayer(position, plot) {

    const point = plot.toCanvas(position.x, position.y);

    // Círculo exterior

    ctx.beginPath();
    ctx.arc(point.x, point.y, 11, 0, Math.PI * 2);

    ctx.fillStyle = "#1d4ed8";
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();


    // Centro

    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);

    ctx.fillStyle = "#ffffff";
    ctx.fill();

}

// =============================================
// ETIQUETAS DE COORDENADAS
// =============================================

function drawCoordinateLabel(position, label, plot, color) {

    const point = plot.toCanvas(position.x, position.y);

    ctx.font = "bold 13px Arial";
    ctx.textAlign = "left";

    ctx.fillStyle = color;

    ctx.fillText(
        `${label} (${formatNumber(position.x)}, ${formatNumber(position.y)})`,
        point.x + 15,
        point.y - 15
    );

}


// =============================================
// 12. DIBUJAR TODA LA SIMULACIÓN
// =============================================

function drawSimulation(progress = 0) {

    const values = state.values || DEFAULTS;

    const result = calculateVectors(values);

    const plot = getCoordinates(result);


    // Dibujar el plano cartesiano

    drawGrid(plot);


    // Si todavía no se ha ejecutado la simulación

    if (!state.active) {

        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "Presiona Simular movimiento para comenzar",
            canvas.width / 2,
            canvas.height / 2
        );

        return;

    }


    // Puntos del recorrido

    const origin = { x: 0, y: 0 };

    const intermediate = {
        x: result.alphaA.x,
        y: result.alphaA.y
    };

    const destination = {
        x: result.R.x,
        y: result.R.y
    };


    // Vector resultante

    drawArrow(
        origin,
        destination,
        plot,
        "#16a34a",
        "R",
        1,
        true
    );


    // Primer desplazamiento: αA

    const progressA = Math.min(progress / 0.5, 1);

    drawArrow(
        origin,
        intermediate,
        plot,
        "#2563eb",
        "αA",
        progressA
    );


    // Segundo desplazamiento: βB

    const progressB = Math.max(
        0,
        Math.min((progress - 0.5) / 0.5, 1)
    );

    drawArrow(
        intermediate,
        destination,
        plot,
        "#e87935",
        "βB",
        progressB
    );


    // Punto de origen

    const startPoint = plot.toCanvas(0, 0);

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 5, 0, Math.PI * 2);

    ctx.fillStyle = "#0f172a";
    ctx.fill();


    // Punto intermedio

    if (progressA >= 1) {

        const middlePoint = plot.toCanvas(
            intermediate.x,
            intermediate.y
        );

        ctx.beginPath();
        ctx.arc(middlePoint.x, middlePoint.y, 5, 0, Math.PI * 2);

        ctx.fillStyle = "#e87935";
        ctx.fill();

    }


    // Posición actual del personaje

    let currentPosition;

    if (progress <= 0.5) {

        currentPosition = {
            x: intermediate.x * progressA,
            y: intermediate.y * progressA
        };

    } else {

        currentPosition = {
            x: intermediate.x +
                (destination.x - intermediate.x) * progressB,

            y: intermediate.y +
                (destination.y - intermediate.y) * progressB
        };

    }


    drawPlayer(currentPosition, plot);

    // Etiqueta del origen
    drawCoordinateLabel(
        origin,
        "O",
        plot,
        "#334155"
    );

// Etiqueta del primer desplazamiento
    if (progressA >= 1) {

        drawCoordinateLabel(
            intermediate,
            "P",
            plot,
            "#e87935"
        );

    }

// Etiqueta de la posición final
    if (progress >= 1) {

        drawCoordinateLabel(
            destination,
            "F",
            plot,
            "#16a34a"
        );

    }

}


// =============================================
// 13. ANIMAR EL MOVIMIENTO
// =============================================

function animateMovement() {

    const duration = 1800;

    let startTime = null;


    function animate(timestamp) {

        if (startTime === null) {
            startTime = timestamp;
        }

        const elapsed = timestamp - startTime;

        const progress = Math.min(elapsed / duration, 1);

        state.progress = progress;

        drawSimulation(progress);


        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            simulationStatus.textContent = "Completado";

        }

    }


    simulationStatus.textContent = "Simulando...";

    requestAnimationFrame(animate);

}


// =============================================
// 14. EJECUTAR LA SIMULACIÓN
// =============================================

function simulate() {

    const values = readInputs();

    if (!values) {
        return;
    }


    state.values = values;
    state.active = true;
    state.progress = 0;


    // Realizar operaciones

    const result = calculateVectors(values);


    // Mostrar resultados

    displayResults(result);


    // Mostrar procedimiento

    displayProcedure(values, result);


    // Ejecutar animación

    animateMovement();

}


// =============================================
// 15. REINICIAR LA SIMULACIÓN
// =============================================

function resetSimulation() {

    // Recuperar valores iniciales

    document.getElementById("ax").value = DEFAULTS.ax;
    document.getElementById("ay").value = DEFAULTS.ay;

    document.getElementById("bx").value = DEFAULTS.bx;
    document.getElementById("by").value = DEFAULTS.by;

    document.getElementById("alpha").value = DEFAULTS.alpha;
    document.getElementById("beta").value = DEFAULTS.beta;


    // Limpiar resultados

    state.active = false;
    state.values = null;
    state.progress = 0;


    resultVector.textContent = "(0, 0)";
    finalPosition.textContent = "(0, 0)";
    resultMagnitude.textContent = "0";


    simulationStatus.textContent = "En espera";


    mathSteps.innerHTML = `

        <div class="empty-state">

            <span>∑</span>

            <p>
                Configura los vectores y presiona
                <strong>Simular movimiento</strong>
                para visualizar el procedimiento matemático.
            </p>

        </div>

    `;


    drawSimulation();

}


// =============================================
// 16. DETECTAR CAMBIOS EN LOS VALORES
// =============================================

const inputFields = [
    "ax", "ay",
    "bx", "by",
    "alpha", "beta"
];

inputFields.forEach(id => {

    document.getElementById(id).addEventListener("input", () => {

        state.active = false;
        state.values = null;

        resultVector.textContent = "—";
        finalPosition.textContent = "—";
        resultMagnitude.textContent = "—";

        simulationStatus.textContent = "Pendiente";

        mathSteps.innerHTML = `
            <div class="empty-state">
                <span>∑</span>
                <p>
                    Presiona <strong>Simular movimiento</strong>
                    para calcular los nuevos resultados.
                </p>
            </div>
        `;

        drawSimulation();

    });

});


// =============================================
// 17. EVENTOS DE LOS BOTONES
// =============================================

simulateBtn.addEventListener("click", simulate);

resetBtn.addEventListener("click", resetSimulation);


// =============================================
// 18. INICIAR APLICACIÓN
// =============================================

drawSimulation();

// =============================================
// 19. EJEMPLOS PREDEFINIDOS
// =============================================

const examples = {

    basic: {

        ax: 3,
        ay: 2,

        bx: 1,
        by: -1,

        alpha: 2,
        beta: 1,

        description:
            "Movimiento básico con componentes positivas y negativas."

    },

    combined: {

        ax: 2,
        ay: 1,

        bx: -1,
        by: 3,

        alpha: 3,
        beta: 2,

        description:
            "Combinación de vectores con componentes positivas y negativas."

    },

    inverse: {

        ax: 2,
        ay: 1,

        bx: 1,
        by: 2,

        alpha: -2,
        beta: 1,

        description:
            "Movimiento inverso: el factor escalar negativo cambia la dirección del primer vector."

    }

};


// =============================================
// 20. CARGAR UN EJEMPLO
// =============================================

function loadExample() {

    const selectedExample =
        document.getElementById("exampleSelect").value;

    const example = examples[selectedExample];

    if (!example) {
        return;
    }

    // Colocar los valores en los campos

    document.getElementById("ax").value = example.ax;
    document.getElementById("ay").value = example.ay;

    document.getElementById("bx").value = example.bx;
    document.getElementById("by").value = example.by;

    document.getElementById("alpha").value = example.alpha;
    document.getElementById("beta").value = example.beta;


    // Mostrar descripción

    document.getElementById("exampleDescription").textContent =
        example.description;


    // Ejecutar la simulación

    simulate();

}


// =============================================
// 21. EVENTO DEL BOTÓN DE EJEMPLOS
// =============================================

document.getElementById("loadExampleBtn")
    .addEventListener("click", loadExample);