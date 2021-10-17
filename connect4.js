/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 document.addEventListener('submit',function(e){
  e.preventDefault()
  
})

document.querySelector('.form').addEventListener('submit',function () {
  localStorage.setItem('p1Color',document.querySelector('#p1Color').value)
  localStorage.setItem('p2Color',document.querySelector('#p2Color').value)
  document.querySelector('.form').classList.add("invisible")
  document.querySelector('#p2Color').value = ""
  document.querySelector('#p1Color').value = ""
})
document.querySelector('#newGameButton').addEventListener('click', function () {
    if (localStorage.gameInProgress === undefined) {
      //localStorage.setItem('gameInProgress', 'true')
      let p1 = new Player(localStorage.p1Color, 1)
      let p2 = new Player(localStorage.p2Color, 2)
      let g1 = new Game(6, 7, p1, p2)
    }
  })

class Game {
  constructor(WIDTH,HEIGHT,p1,p2){
    this.WIDTH = WIDTH
    this.HEIGHT = HEIGHT
    this.playerObject = {p1,p2}
    this.currPlayer = this.playerObject.p1.number
    this.board = []
    this.makeBoard();
    this.makeHtmlBoard();
  }



  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
    const color = this.currPlayer === this.playerObject.p1.number ? this.playerObject.p1.color : this.playerObject.p2.color;
    piece.style.setProperty('background-color',color)

    const spot = document.getElementById(`${y}-${x}`); 
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    const htmlBoard = document.getElementById('board');
    while(htmlBoard.firstChild) {
      htmlBoard.removeChild(htmlBoard.firstChild)
    }
    localStorage.removeItem('gameInProgress')
    localStorage.removeItem('p1Color')
    localStorage.removeItem('p2Color')
    document.querySelector('.form').classList.remove("invisible")
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
  
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
  
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
  
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    
    // switch players
    this.currPlayer = this.currPlayer === this.playerObject.p1.number ? this.playerObject.p2.number : this.playerObject.p1.number;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    console.log(this)
    let HEIGHT = this.HEIGHT
    let WIDTH = this.WIDTH
    let currPlayer = this.currPlayer
    let board = this.board

    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
          ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

}

class Player {
  constructor(color,number) {
    this.color = color
    this.number = number
  }
}