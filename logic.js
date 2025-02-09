const ROWS = 4;
const COLUMNS = 4;

let board;
let score;
let winStates;

function setGame() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const tile = document.createElement("div");
      tile.id = r + '-' + c;
      document.getElementById('board').append(tile);
    }
  }

  // document.getElementById('reset').addEventListener("mousedown", (e) => {
  //   if (e.button == 0)
  //     resetGame();
  // })

  resetGame();
}


function resetGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  winStates = {
    "2048": [false, "You win! You got the 2048!"],
    "4096": [false, "You are unstoppable at 4096! You are fantastically unstoppable!"],
    "8192": [false, "Victory! You have reached 8192! You are incredibly awesome!"],
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      updateTile(document.getElementById(r + '-' + c), board[r][c])
    }
  }

  score = 0;
  document.getElementById('score').innerText = 0;

  setOne();
  setOne();

  checkWin();
}


function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";
  tile.classList.add("tile");

  if (num > 0) {
    tile.innerText = num;
    tile.classList.add("x" + Math.min(num, 8192));
  }
}

window.onload = function () {
  setGame();
}


const slideFuncMap = {
  "ArrowUp": (() => canMoveUp() && (slideUp(false) || true)),
  "ArrowDown": (() => canMoveDown() && (slideUp(true) || true)),
  "ArrowLeft": (() => canMoveLeft() && (slideLeft(false) || true)),
  "ArrowRight": (() => canMoveRight() && (slideLeft(true) || true)),
};

function handleSlide(e) {
  const slideFunc = slideFuncMap[e.code]
  if (slideFunc && !e.repeat) {
    const hasChanged = slideFunc();
    if (hasChanged && hasEmptyTile())
      setOne();

    document.getElementById('score').innerText = score;
  }

  setTimeout(() => {
    if (hasLost()) {
      alert("Game Over! You have lost the game. Game will restart.")
      resetGame();
      alert("Click any arrow key to restart.")
    } else {
      checkWin();
    }
  }, 100);
}

document.addEventListener("keydown", handleSlide)


function slideUp(rev) {
  for (let c = 0; c < COLUMNS; c++) {
    let col = board.map(row => row[c]);
    const origCol = [...col];

    if (rev)
      col = slide(col.reverse(), ROWS).reverse();
    else
      col = slide(col, ROWS);

    for (let r = 0; r < ROWS; r++) {
      const tile = document.getElementById(r + '-' + c)
      const val = col[r];
      board[r][c] = val;
      if (origCol[r] != val && val != 0) {
        tile.style.animation = rev && "slide-from-top 0.3s" || "slide-from-bottom 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, val)
    }
  }
}


function slideLeft(rev) {
  for (let r = 0; r < ROWS; r++) {
    let row = board[r];
    const origRow = [...row];

    if (rev)
      row = slide(row.reverse(), COLUMNS).reverse();
    else
      row = slide(row, COLUMNS);

    board[r] = row;
    for (let c = 0; c < COLUMNS; c++) {
      const tile = document.getElementById(r + '-' + c);
      const val = board[r][c];
      if (origRow[c] != val && val != 0) {
        tile.style.animation = rev && "slide-from-left 0.3s" || "slide-from-right 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, val)
    }
  }
}


function slide(row, size) {
  row = row.filter(num => num != 0);
  
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = row.filter(num => num != 0);

  while (row.length < size) {
    row.push(0);
  }

  return row
}


function hasEmptyTile() {
  return board.some(row => board.some(col => col.some(tile => tile == 0)))
}


function setOne() {
  if (!hasEmptyTile())
    return;

  while (true) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLUMNS);
    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r + '-' + c)
      updateTile(tile, 2)
      break;
    }
  }
}


function canMoveLeft() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = COLUMNS - 1; c >= 1; c--) {
      if (board[r][c] != 0 && (board[r][c] == board[r][c-1] || board[r][c-1] == 0)) {
        return true;
      }
    }
  }

  return false;
}

function canMoveRight() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS - 1; c++) {
      if (board[r][c] != 0 && (board[r][c] == board[r][c+1] || board[r][c+1] == 0))
        return true;
    }
  }

  return false;
}

function canMoveUp() {
  for (let c = 0; c < COLUMNS; c++) {
    for (let r = ROWS - 1; r >= 1; r--) {
      if (board[r][c] != 0 && (board[r-1][c] == 0 || board[r-1][c] == board[r][c]))
        return true;
    }
  }

  return false;
}

function canMoveDown() {
  for (let c = 0; c < COLUMNS; c++) {
    for (let r = 0; r <= ROWS - 2; r++) {
      if (board[r][c] != 0 && (board[r+1][c] == 0 || board[r+1][c] == board[r][c]))
        return true;
    }
  }

  return false;
}

function checkWin() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const tile = board[r][c];
      if (tile in winStates && !winStates[tile][0]) {
        alert(winStates[tile][1]);
        winStates[tile][0] = true;
      }
    }
  }
}

function hasLost() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const currentTile = board[r][c];
      if (currentTile == 0)
        return false;
      if (r > 0 && board[r - 1][c] === currentTile ||
          r < ROWS - 1 && board[r + 1][c] === currentTile ||
          c > 0 && board[r][c - 1] === currentTile ||
          c < COLUMNS - 1 && board[r][c + 1] === currentTile)
        return false;
    }
  }
  return true;
}
