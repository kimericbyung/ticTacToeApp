const Model = {
  turnsPlayed: 0,
  xGrid: [
    [0, 0 ,0],
    [0, 0, 0],
    [0, 0 ,0]
  ],
  oGrid: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  gameState: true,
  pastWinner: '',
  xWins: 0,
  oWins: 0,
  player1: '',
  player2: '',
  currPlayer: 'X',
  switch: false,
  gameStart: function(p1, p2) {
    Model.player1 = p1;
    Model.player2 = p2;
    View.gameStartRender();
  },
  onReset: function() {
    Model.xGrid = [
      [0, 0 ,0],
      [0, 0, 0],
      [0, 0 ,0]
    ];
    Model.oGrid = [
      [0, 0 ,0],
      [0, 0, 0],
      [0, 0 ,0]
    ];
    Model.turnsPlayed = 0;
    Model.gameState = true;
    if (Model.pastWinner) {
      Model.currPlayer = Model.pastWinner;
    } else {
      Model.currPlayer = 'X';
    }
    View.onReset();
  },
  onSwitch: function() {
    if (Model.switch === false) {
      Model.switch = true;
    } else {
      Model.switch = false;
    }
    View.toggleRotate()
  },
  addWin: function() {
    if (Model.currPlayer === 'X') {
      Model.xWins++;
    } else {
      Model.oWins++;
    }
    Model.pastWinner = Model.currPlayer;
    View.changeWins();
  },
  currValue: function(num) {
    let value = 0;
    if (num < 3) {
      value += Model.xGrid[0][num] + Model.oGrid[0][num]
    } else if (num < 6) {
      value += Model.xGrid[1][num - 3] + Model.oGrid[1][num - 3]
    } else {
      value += Model.xGrid[2][num - 6] + Model.oGrid[2][num - 6]
    }
    return value;
  },
  addXorO: function(num) {
    Model.turnsPlayed++;
    Model.changeGrid(num);
    if (Model.turnsPlayed > 4 && Model.checkWin()) {
      Model.addWin();
      Model.gameState = false;
      View.gameWin();
    } else {
      if (Model.turnsPlayed === 9) {
        View.gameTie();
      } else {
        if (Model.currPlayer === 'X') {
          Model.currPlayer = 'O';
        } else {
          Model.currPlayer = 'X';
        }
        View.changePlayer();
        if (Model.switch) {
          View.addRotate();
        }
      }
    }
  },
  changeGrid: function(num) {
    let grid = Model.whichGrid();
    if (num < 3) {
      grid[0][num] = 1;
    } else if (num < 6) {
      grid[1][num - 3] = 1;
    } else {
      grid[2][num - 6] = 1;
    }
    View.addXorO(num);
  },
  checkWin: function() {
    let grid = Model.whichGrid();
    if (Model.checkHorizWin(grid) || Model.checkVertWin(grid) || Model.checkDiagWin(grid)) {
      return true;
    }
    return false;
  },
  whichGrid: function() {
    if (Model.currPlayer === 'X') {
      return Model.xGrid;
    } else {
      return Model.oGrid;
    }
  },
  checkHorizWin: function(grid) {
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].reduce((acc, curr) => acc + curr) === 3) {
        return true;
      }
    }
    return false;
  },
  checkVertWin: function(grid) {
    for (let i = 0; i < grid.length; i++) {
      if (grid[0][i] + grid[1][i] + grid[2][i] === 3) {
        return true;
      }
    }
    return false;
  },
  checkDiagWin: function(grid) {
    let primDiag = grid[0][0] + grid[1][1] + grid[2][2];
    let secDiag = grid[0][2] + grid[1][1] + grid[2][0];
    if (primDiag === 3 || secDiag === 3) {
      return true;
    }
    return false;
  }
}

const View = {
  changeWins: function() {
    let id;
    let wins;
    let player;
    if (Model.currPlayer === 'X') {
      id = 'xwins';
      wins = Model.xWins;
      player = Model.player1;
    } else {
      id = 'owins'
      wins = Model.oWins;
      player = Model.player2;
    }
    document.getElementById(id).innerHTML = `${player} wins: ${wins}`;
  },
  addXorO: function(num) {
    document.getElementById(`box${num}`).classList.add(`${Model.currPlayer}Player`)
    document.getElementById(`box${num}`).innerHTML = ` ${Model.currPlayer} `;
  },
  gameWin: function() {
    document.getElementById('gamestate').innerHTML = 'wins!';
  },
  gameTie: function() {
    document.getElementById('player').innerHTML = `It's a`;
    document.getElementById('gamestate').innerHTML = 'tie!';
  },
  changePlayer: function() {
    document.getElementById('player').innerHTML = Model.currPlayer;
  },
  onReset: function() {
    for (let i = 0; i < 9; i++) {
      document.getElementById(`box${i}`).classList.remove(`XPlayer`);
      document.getElementById(`box${i}`).classList.remove(`OPlayer`);
      document.getElementById(`box${i}`).innerHTML = ' &nbsp; '
    }
    if (Model.pastWinner) {
      document.getElementById('player').innerHTML = Model.pastWinner;
    } else {
      document.getElementById('player').innerHTML = 'X';
    }
    document.getElementById('gamestate').innerHTML = 'turn';
    View.toggleRotate();
  },
  gameStartRender: function() {
    document.getElementById('player1').innerHTML = `X Player: ${Model.player1}`;
    document.getElementById('player2').innerHTML = `O Player: ${Model.player2}`;
    document.getElementById('xwins').innerHTML = `${Model.player1} wins: ${Model.xWins}`;
    document.getElementById('owins').innerHTML = `${Model.player2} wins: ${Model.oWins}`;
  },
  toggleRotate: function() {
    if (Model.switch === false) {
      document.getElementById('board').style.transform = `rotate(0deg)`;
      document.getElementById('rotateSwitch').innerHTML = ` &nbsp; Rotate Off`
    } else {
      document.getElementById('rotateSwitch').innerHTML = ` &nbsp; Rotate On`
    }
  },
  addRotate: function() {
    document.getElementById('board').style.transform = `rotate(${Model.turnsPlayed * 90}deg)`;
  }
};

const Controller = {
  addClick: function(num) {
    let currValue = Model.currValue(num);
    if (currValue === 0 && Model.gameState) {
      Model.addXorO(num);
    }
  },
  onReset: function() {
    Model.onReset();
  },
  onSwitch: function() {
    Model.onSwitch();
  },
  onLoad: function() {
    let player1Name = window.prompt('Who is the X player?');
    if (!player1Name) {
      player1Name = 'Anon';
    }
    let player2Name = window.prompt('Who is the O player?');
    if (!player2Name) {
      player2Name = 'Anon';
    }
    Model.gameStart(player1Name, player2Name);
    for (let i = 0; i < 9; i++) {
      document.getElementById(`box${i}`).onclick = function() {
        Controller.addClick(i);
      }
    };
    document.getElementById('reset').onclick = Controller.onReset;
    document.getElementById('slider').onclick = Controller.onSwitch;
  }
};

window.onload = Controller.onLoad;