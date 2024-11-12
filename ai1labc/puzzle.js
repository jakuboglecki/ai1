
let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("saveButton").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error("Błąd przy generowaniu mapy:", err);
            alert("Wystąpił problem podczas generowania obrazu mapy.");
            return;
        }

        let pictureCanvas = document.getElementById("picture");
        let context = pictureCanvas.getContext("2d");
        context.drawImage(canvas, 0, 0, pictureCanvas.width, pictureCanvas.height);

        createPuzzlePieces(canvas);
        setupPuzzleGrid();
    });
});

function createPuzzlePieces(canvas) {
    const pieceSize = 75;
    const puzzlePieces = [];
    let mixedPuzzle = document.getElementById("mixedPuzzle");
    mixedPuzzle.innerHTML = '';

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceSize;
            pieceCanvas.height = pieceSize;
            let context = pieceCanvas.getContext("2d");
            context.drawImage(
                canvas,
                col * pieceSize, row * pieceSize, pieceSize, pieceSize,
                0, 0, pieceSize, pieceSize
            );
            pieceCanvas.draggable = true;
            pieceCanvas.classList.add("puzzle-piece");
            pieceCanvas.dataset.position = `${row}-${col}`;

            pieceCanvas.addEventListener("dragstart", dragStart);
            puzzlePieces.push(pieceCanvas);
        }
    }

    shuffleArray(puzzlePieces);
    puzzlePieces.forEach(piece => mixedPuzzle.appendChild(piece));
}

function setupPuzzleGrid() {
    const puzzleArea = document.getElementById("puzzle");
    puzzleArea.innerHTML = '';

    for (let i = 0; i < 16; i++) {
        let cell = document.createElement("div");
        cell.classList.add("puzzle-cell");
        cell.dataset.cellIndex = i;

        cell.addEventListener("dragover", function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        cell.addEventListener("drop", function (e) {
            e.preventDefault();
            const position = e.dataTransfer.getData("text/plain");
            const draggedPiece = document.querySelector(`.puzzle-piece[data-position="${position}"]`);

            if (!cell.hasChildNodes()) {
                cell.appendChild(draggedPiece);
                checkPuzzleCompletion();
            }
        });

        puzzleArea.appendChild(cell);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function dragStart(e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", e.target.dataset.position);
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.remove("hidden");
    notification.classList.add("visible");

    setTimeout(() => {
        notification.classList.remove("visible");
        notification.classList.add("hidden");
    }, 3000);

}
function showCompletionNotification() {
    if (Notification.permission === "granted") {
        new Notification("Puzzle Completed!", {
            body: "Congratulations! You've successfully completed the puzzle.",
            icon: "path/to/icon.png"  // Optional icon path
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Puzzle Completed!", {
                    body: "Congratulations! You've successfully completed the puzzle.",
                    icon: "path/to/icon.png"
                });
            }
        });
    }
}

function checkPuzzleCompletion() {
    const puzzleCells = document.querySelectorAll("#puzzle .puzzle-cell");
    let isComplete = Array.from(puzzleCells).every((cell, index) => {
        if (cell.firstChild) {
            let [row, col] = cell.firstChild.dataset.position.split("-");
            let correctIndex = parseInt(row) * 4 + parseInt(col);
            return correctIndex === index;
        }
        return false;
    });

    if (isComplete) {
        showNotification("Puzzle completed successfully!");
        showCompletionNotification();
    }
}

document.getElementById("getLocation").addEventListener("click", function () {
    if (!navigator.geolocation) {
        console.log("Geolokalizacja niedostępna.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        map.setView([lat, lon]);
        L.marker([lat, lon]).addTo(map).bindPopup("You are here!").openPopup();
    }, positionError => {
        console.error("Błąd geolokalizacji:", positionError);
    });
});
