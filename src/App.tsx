import { useEffect, useState } from "react";

import "./App.css";

type Player = {
  name: "P1" | "P2";
  symbol: "X" | "O";
  ownedTiles: { y: number; x: number }[];
};

function changeCurrentPlayer(
  players: Player[],
  currentPlayer: Player,
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player>>
) {
  setCurrentPlayer(
    players.find((player) => player.name !== currentPlayer.name)!
  );
}

function checkWin({ ownedTiles }: Player, board: string[][]): boolean {
  console.log("owned tiles", ownedTiles);
  //console.log(boar)
  // const coordinates = [
  //   [
  //     [0, 0],
  //     [0, 1],
  //     [0, 2],
  //   ],
  //   [
  //     [1, 0],
  //     [1, 1],
  //     [1, 2],
  //   ],
  //   [
  //     [2, 0],
  //     [2, 1],
  //     [2, 2],
  //   ],

  //   [
  //     [0, 0],
  //     [1, 0],
  //     [2, 0],
  //   ],
  //   [
  //     [0, 1],
  //     [1, 1],
  //     [2, 1],
  //   ],
  //   [
  //     [0, 2],
  //     [1, 2],
  //     [2, 2],
  //   ],
  //   [
  //     [0, 0],
  //     [1, 1],
  //     [2, 2],
  //   ],
  //   [
  //     [0, 2],
  //     [1, 1],
  //     [2, 0],
  //   ],
  // ];

  // for (const coordinate of coordinates) {
  //   if (board[coordinate[0][0]][coordinate[0][1]] === undefined) continue;

  //   if (
  //     board[coordinate[0][0]][coordinate[0][1]] ===
  //       board[coordinate[1][0]][coordinate[1][1]] &&
  //     board[coordinate[0][0]][coordinate[0][1]] ===
  //       board[coordinate[2][0]][coordinate[2][1]]
  //   ) {
  //     console.log("WINNER");
  //     return true;
  //   }
  //}

  // line win
  if (
    (board[0][0] === board[0][1] &&
      board[0][1] === board[0][2] &&
      board[0][2]) ||
    (board[1][0] === board[1][1] &&
      board[1][1] === board[1][2] &&
      board[1][2]) ||
    (board[2][0] === board[2][1] && board[2][1] === board[2][2] && board[2][2])
  ) {
    console.log("WINNER");
    return true;
  }

  // diagonal win
  if (
    (board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[2][2]) ||
    (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[0][2])
  ) {
    console.log("winner");
    return true;
  }

  // vertical win
  if (
    (board[0][1] === board[1][1] &&
      board[1][1] === board[2][1] &&
      board[2][1]) ||
    (board[1][0] === board[1][1] && board[1][1] === board[1][2] && board[1][2])
  ) {
    console.log("winner");
    return true;
  }

  return false;
}

function registerPlay(
  player: Player,
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  tile: { x: number; y: number },
  board: string[][]
): string[][] {
  if (board[tile.y][tile.x] === "X" || board[tile.y][tile.x] === "O")
    return board;

  const newBoard = board;

  // const tileValue = +newBoard[tile.y][tile.x];

  setPlayers((players) => {
    let newPlayers: Player[];

    if (player.name === "P1") {
      newPlayers = [
        { ...players[0], ownedTiles: [...players[0].ownedTiles, tile] },
        players[1],
      ];
    } else {
      newPlayers = [
        players[0],
        { ...players[1], ownedTiles: [...players[1].ownedTiles, tile] },
      ];
    }
    return newPlayers;
  });

  newBoard[tile.y][tile.x] = player.symbol;

  console.log(newBoard);

  return newBoard;
}

function App() {
  const [board, setBoard] = useState(
    Array.from({ length: 3 }).map(() => Array.from({ length: 3 }))
  );

  const [players, setPlayers] = useState<Player[]>([
    { name: "P1", symbol: "X", ownedTiles: [] },
    { name: "P2", symbol: "O", ownedTiles: [] },
  ]);

  const [currentPlayer, setCurrentPlayer] = useState<Player>(players[1]);

  const [winner, setWinner] = useState<Player>();

  useEffect(() => {
    console.log(currentPlayer.name);

    // if (checkWin(currentPlayer, board as string[][])) {
    //   setWinner(currentPlayer);
    //   return;
    // }

    changeCurrentPlayer(players, currentPlayer, setCurrentPlayer);
  }, [players]);

  return (
    <div className=" flex flex-col gap-10 items-center justify-center">
      <div className="space-y-10">
        <p className="text-center">{currentPlayer.name}</p>
        {winner && (
          <div className="bg-blue-600 rounded-md p-2">WINNER:{winner.name}</div>
        )}
      </div>
      <div>
        <div className="flex justify-center items-center gap-10">
          {board.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex flex-col gap-5 text-5xl"
            >
              {row.map((column, columnIndex) => (
                <div
                  key={`column-${columnIndex}`}
                  className="cursor-pointer p-2 border text-center border-white size-20 "
                  onClick={() => {
                    if (winner) return;

                    setBoard((board) => {
                      const newBoard = registerPlay(
                        currentPlayer,
                        setPlayers,
                        { y: rowIndex, x: columnIndex },
                        board as string[][]
                      );

                      console.log("iae");
                      if (checkWin(currentPlayer, newBoard)) {
                        setWinner(currentPlayer);
                      }

                      return newBoard;
                    });
                  }}
                >{`${column ?? ""}`}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
