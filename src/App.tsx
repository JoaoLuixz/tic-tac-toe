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

  // horizontal win
  if (
    (board[0][0] === board[0][1] &&
      board[0][1] === board[0][2] &&
      board[0][2]) ||
    (board[1][0] === board[1][1] &&
      board[1][1] === board[1][2] &&
      board[1][2]) ||
    (board[2][0] === board[2][1] && board[2][1] === board[2][2] && board[2][2])
  ) {
    return true;
  }

  // diagonal win
  if (
    (board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[2][2]) ||
    (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[0][2])
  ) {
    return true;
  }

  // vertical win
  if (
    (board[0][0] === board[1][0] &&
      board[1][0] === board[2][0] &&
      board[2][0]) ||
    (board[0][1] === board[1][1] &&
      board[1][1] === board[2][1] &&
      board[2][1]) ||
    (board[0][2] === board[1][2] && board[1][2] === board[2][2] && board[2][2])
  ) {
    return true;
  }

  return false;
}

function registerPlay(
  player: Player,
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  tile: { x: number; y: number },
  board: string[][],
  setSelectedTile: React.Dispatch<
    React.SetStateAction<
      | {
          y: number;
          x: number;
        }
      | undefined
    >
  >
): string[][] {
  if (board[tile.y][tile.x] === "X" || board[tile.y][tile.x] === "O")
    return board;

  const newBoard = board;

  if (player.ownedTiles.length >= 3) {
    const olderPlay = player.ownedTiles.shift();

    setSelectedTile(olderPlay);

    // @ts-ignore
    newBoard[olderPlay.y][olderPlay.x] = undefined;
  }

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

  const [selectedTile, setSelectedTile] = useState<{ y: number; x: number }>();

  const [currentPlayer, setCurrentPlayer] = useState<Player>(players[1]);

  const [winner, setWinner] = useState<Player | { name: "Tie" }>();

  useEffect(() => {
    if (winner) return;
    if (board.flat().every((tile) => tile !== undefined)) {
      setWinner({ name: "Tie" });
    }
    changeCurrentPlayer(players, currentPlayer, setCurrentPlayer);
  }, [players]);

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen ">
      <div className="space-y-20">
        <p className="text-center text-4xl">{currentPlayer.name}</p>
      </div>
      <div>
        <div className="flex justify-center items-center   ">
          {board.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex flex-col  text-5xl shadow-2xl"
            >
              {row.map((column, columnIndex) => (
                <div
                  key={`column-${columnIndex}`}
                  className={`cursor-pointer p-2 text-center border-white  size-20  ${
                    columnIndex === 0
                      ? "border-b"
                      : columnIndex === board.length - 1
                      ? "border-t"
                      : "border-y"
                  } 

                  ${
                    rowIndex === 0
                      ? "border-r"
                      : rowIndex === board.length - 1
                      ? "border-l"
                      : "border-x"
                  }
                   
                  ${
                    selectedTile?.y === rowIndex &&
                    selectedTile.x === columnIndex
                      ? currentPlayer.name === "P1"
                        ? "bg-red-600"
                        : "text-blue-600"
                      : ""
                  }`}
                  onClick={() => {
                    if (winner) return;

                    setBoard((board) => {
                      const newBoard = registerPlay(
                        currentPlayer,
                        setPlayers,
                        { y: rowIndex, x: columnIndex },
                        board as string[][],
                        setSelectedTile
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
      {winner && (
        <div className="p-2 flex flex-col gap-2">
          <p className="bg-green-600 rounded-md p-2 text-center">
            {winner.name === "Tie" ? winner.name : "Winner: " + winner.name}
          </p>
          <button
            className="bg-blue-600 rounded-md p-2"
            onClick={() => {
              setBoard(
                Array.from({ length: 3 }).map(() => Array.from({ length: 3 }))
              );
              setWinner(undefined);
              setCurrentPlayer(players[0]);
              setSelectedTile(undefined);
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
