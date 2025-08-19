
let board = document.getElementById("board");
let game = new Chess();
let mode = "free"; // "free" ou "guided"
let openings = null;
let currentTree = null;

// Charger base d'ouvertures
fetch("data/openings.json").then(r => r.json()).then(db => {
  openings = db;
  currentTree = db.trees[0];
});

// Changer mode
document.getElementById("modeBtn").onclick = () => {
  mode = (mode === "free") ? "guided" : "free";
  document.getElementById("modeBtn").innerText = "Mode : " + (mode === "free" ? "Libre" : "Guidé");
};

// Annuler coup
document.getElementById("undoBtn").onclick = () => {
  game.undo();
  board.setPosition(game.fen());
  updateStatus();
};

// Flip board
document.getElementById("flipBtn").onclick = () => {
  board.flip();
};

// Export base
document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(openings, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "openings.json";
  a.click();
  URL.revokeObjectURL(url);
};

// Import base
document.getElementById("importInput").onchange = e => {
  let file = e.target.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = evt => {
    openings = JSON.parse(evt.target.result);
    currentTree = openings.trees[0];
    alert("Base importée");
  };
  reader.readAsText(file);
};

// Quand on joue un coup
board.addEventListener("drop", e => {
  let move = game.move({ from: e.detail.source, to: e.detail.target, promotion: "q" });
  if (move === null) return e.preventDefault();

  board.setPosition(game.fen());
  checkOpening(move.san, e.detail.source + e.detail.target);
  updateStatus();
});

function checkOpening(san, uci) {
  if (!currentTree) return;
  let found = false;

  if (mode === "free") {
    if (currentTree.good && currentTree.good[uci]) {
      currentTree = currentTree.good[uci];
      found = true;
    } else if (currentTree.mistakes && currentTree.mistakes[uci]) {
      alert("Erreur fréquente: " + currentTree.mistakes[uci].note);
      found = true;
    } else {
      alert("Coup non reconnu dans la base");
    }
  }

  if (mode === "guided") {
    if (currentTree.good && currentTree.good[uci]) {
      currentTree = currentTree.good[uci];
      found = true;
    } else if (currentTree.mistakes && currentTree.mistakes[uci]) {
      alert("Erreur fréquente: " + currentTree.mistakes[uci].note);
      found = true;
    } else {
      alert("Coup invalide dans le mode guidé");
      game.undo();
      board.setPosition(game.fen());
    }
  }

  if (found && currentTree.label) {
    document.getElementById("status").innerText = "Ouverture: " + currentTree.label;
  }
}

function updateStatus() {
  document.getElementById("status").innerText = game.history().join(" ");
}
