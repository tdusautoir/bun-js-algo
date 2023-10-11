/// <reference lib="dom" />

const ws = new WebSocket(`ws://${location.host}`);
ws.onopen = () => {
    setInterval(() => ws.send("ping"), 5000);
    ws.send("Hello from the client!");
}

ws.onmessage = (e: MessageEvent) => {
    if (e.data === "reload") {
        location.reload();
    }
}

const bgColor = "#DDD"
const thinLineColor = "#AAA"
const boldLineColor = "#000"

const canvas = document.getElementById("sudokuCanvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
const width = canvas.width
const height = canvas.height
const cellSize = Math.round(Math.min(width, height) / 9)

// Domaines des valeurs possibles pour chaques cellules de la grille
const cellDomains: number[][][] = []
// Eventuelles valeurs choisie par le joueur
const cellValues: (number | null)[][] = []
// Initialisation des deux structure de données précédentes
for (let j = 0; j < 9; j++) {
    cellDomains.push([])
    cellValues.push([])
    for (let i = 0; i < 9; i++) {
        cellDomains[j].push([1, 2, 3, 4, 5, 6, 7, 8, 9])
        cellValues[j].push(null)
    }
}

function clearCanvas() {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)
}

function drawCell(
    i: number,
    j: number,
    cellSize: number,
    borderColor: string,
    fillColor?: string
) {
    const x = i * cellSize
    const y = j * cellSize
    if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
    }
    ctx.strokeStyle = borderColor
    ctx.strokeRect(x, y, cellSize, cellSize)
}

function drawGroup(groupI: number, groupJ: number, fillColor?: string) {
    drawCell(groupI, groupJ, cellSize * 3, boldLineColor, fillColor)
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            drawCell(groupI * 3 + i, groupJ * 3 + j, cellSize, thinLineColor)
        }
    }
}

function drawDomain(i: number, j: number) {
    if (cellValues[j][i] !== null) {
        ctx!.font = "bold 60px Arial"
        ctx!.textBaseline = "middle"
        ctx!.textAlign = "center"
        const x = i * cellSize + Math.floor(cellSize * 0.5)
        const y = j * cellSize + Math.floor(cellSize * 0.575)
        ctx.fillText(cellValues[j][i]!.toString(), x, y)
    } else {
        ctx.fillStyle = "#000"
        ctx.font = "16px Arial"
        ctx.textBaseline = "top"
        ctx.textAlign = "start"
        const domain = cellDomains[j][i]
        // Taille de la zone à l'intérieure de laquelle je veux écrire
        const areaSize = Math.max(cellSize - 2, Math.floor(cellSize * 0.8))
        // Pixels à sauter pour passer d'un texte à l'autre de la même ligne
        const valueStep = Math.floor(areaSize / 3)
        // Taille de l'espace blanc à laisser entre le bord de la cellule et le texte
        const cellPadding = Math.max(1, Math.floor(cellSize * 0.1))
        // Coordonnées en pixel de ma zone de texte
        const x = i * cellSize + cellPadding
        const y = j * cellSize + cellPadding
        for (let k = 1; k <= 9; k++) {
            // k-ième valeur du domaine, ou null si la valeur n'est plus permise
            const vk = domain.includes(k) ? k : null
            // Numéro de colonne de cette k-ième valeur
            const vi = (k - 1) % 3
            // Numéro de ligne de cette k-ième valeur
            const vj = Math.floor((k - 1) / 3)
            // Coordonnées en pixel de la valeur
            const vx = x + valueStep * vi
            const vy = y + valueStep * vj
            // Ecriture de la valeur ou rien si null
            ctx.fillText(vk !== null ? vk.toString() : "", vx, vy)
        }
    }
}

function drawDomains() {

    for (let j = 0; j < 9; j++) {
        for (let i = 0; i < 9; i++) {
            drawDomain(i, j)
        }
    }
}

function drawEmptyGrid() {
    clearCanvas()
    /*for (let j = 0; j < 9; j++) {
        for (let i = 0; i < 9; i++) {
            drawCell(i, j, cellSize, thinLineColor, bgColor)
        }
    }*/
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            drawGroup(i, j)
        }
    }
}

drawEmptyGrid()
drawDomains()

let selectedCell: [number, number] | null = null

canvas.addEventListener("mousemove", (event: MouseEvent) => {
    event.stopPropagation()
    const x = event.offsetX
    const y = event.offsetY
    const i = Math.min(Math.floor(x / cellSize), 8)
    const j = Math.min(Math.floor(y / cellSize), 8)
    if (selectedCell === null || selectedCell[0] !== i || selectedCell[1] !== j) {
        selectedCell = [i, j]
        console.log("Celulle sélectionnée:", selectedCell)
    }
})

canvas.addEventListener("mouseout", (event: MouseEvent) => {
    event.stopPropagation()
    selectedCell = null
    console.log("Celulle sélectionnée:", selectedCell)
})

document.addEventListener("keydown", (event: KeyboardEvent) => {
    const choiceKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (choiceKeys.includes(event.key) && selectedCell !== null) {
        toggle(parseInt(event.key));
    }
});

function toggle(v: number) {
    const [i, j] = selectedCell!;

    if (cellValues[j][i] === v) {
        cellValues[j][i] = null;
        addToDomains(i, j, v);
    } else if (cellDomains[j][i].includes(v)) {
        cellValues[j][i] = v;
        removeFromDomains(i, j, v);
    }

    drawEmptyGrid();
    drawDomains();
}

function removeFromDomains(i: number, j: number, v: number) {
    for (let k = 0; k < 9; k++) {
        const domainI = cellDomains[k][i];
        const indexI = domainI.indexOf(v);
        if (indexI > -1) {
            domainI.splice(indexI, 1);
        }

        const domainJ = cellDomains[j][k];
        const indexJ = domainJ.indexOf(v);
        if (indexJ > -1) {
            domainJ.splice(indexJ, 1);
        }
    }
    const groupI = Math.floor(i / 3);
    const groupJ = Math.floor(j / 3);
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            const domain = cellDomains[groupJ * 3 + k][groupI * 3 + l];
            const index = domain.indexOf(v);
            if (index > -1) {
                domain.splice(index, 1);
            }
        }
    }
}

function addToDomains(i: number, j: number, v: number) {
    for (let k = 0; k < 9; k++) {
        if (cellValues[k][i] === null && !cellDomains[k][i].includes(v)) {
            cellDomains[k][i].push(v);
        }
        if (cellValues[j][k] === null && !cellDomains[j][k].includes(v)) {
            cellDomains[j][k].push(v);
        }
    }
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            const groupI = Math.floor(i / 3);
            const groupJ = Math.floor(j / 3);
            const x = groupI * 3 + l;
            const y = groupJ * 3 + k;
            if (cellValues[y][x] === null && !cellDomains[y][x].includes(v)) {
                cellDomains[y][x].push(v);
            }
        }
    }
}

console.log("Frontend chargé")
