import { useEffect, useState } from "react";

import "./App.css";

type Player = { name: "P1" | "P2"; simbol: "X" | "O"; ownedTiles: number[] };

function changeCurrentPlayer(
  players: Player[],
  currentPlayer: Player,
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player>>
) {
  console.log("iae2");
  setCurrentPlayer(
    players.filter((player) => player.name !== currentPlayer.name)[0]
  );
}

function checkWin({ ownedTiles }: Player): boolean {
  if (ownedTiles.length < 3) return false;

  const tilesTotal = ownedTiles.reduce((sum, tileValue) => sum + tileValue, 0);

  switch (tilesTotal) {
    case 0:
    case 3:
    case 6:
      return true;
    default:
      return false;
  }
}

function registerPlay(
  player: Player,
  setCurrenPlayer: React.Dispatch<React.SetStateAction<Player>>,
  tile: { x: number; y: number },
  board: string[][]
): string[][] {
  console.log(tile);
  if (board[tile.y][tile.x] === "X" || board[tile.y][tile.x] === "Y")
    return board;

  const newBoard = board;
  console.log(+newBoard[tile.y][tile.x]);

  setCurrenPlayer((player) => {
    const newPlayer = {
      ...player,
      ownedTiles: [...player.ownedTiles, +newBoard[tile.y][tile.x]],
    };

    console.log(newPlayer.name, newPlayer.ownedTiles);

    return newPlayer;
  });

  newBoard[tile.y][tile.x] = player.simbol;

  return newBoard;
}

function App() {
  const [board, setBoard] = useState(
    Array.from({ length: 3 }).map(() =>
      Array.from({ length: 3 }).map((_, index) => index.toString())
    )
  );

  const [players, setPlayers] = useState<Player[]>([
    { name: "P1", simbol: "X", ownedTiles: [] },
    { name: "P2", simbol: "O", ownedTiles: [] },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(players[1]);

  const [winner, setWinner] = useState<Player>();

  useEffect(() => {
    if (checkWin(currentPlayer)) {
      setWinner(currentPlayer);
      console.log(winner);
      return;
    }
    changeCurrentPlayer(players, currentPlayer, setCurrentPlayer);
  }, [board]);

  return (
    <div>
      {currentPlayer.name}
      <div className="flex justify-center items-center h-screen bg-red-500 gap-10">
        {board.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex flex-col gap-5 text-5xl">
            {row.map((column, columnIndex) => (
              <div
                key={`column-${columnIndex}`}
                className="cursor-pointer p-2"
                onClick={() => {
                  setBoard(
                    registerPlay(
                      currentPlayer,
                      setCurrentPlayer,
                      { y: rowIndex, x: columnIndex },
                      board
                    )
                  );
                  console.log(players);
                  setPlayers((players) => {
                    if (currentPlayer.name === "P1") {
                      return [currentPlayer, players[1]];
                    } else {
                      return [players[0], currentPlayer];
                    }
                  });
                }}
              >{`${column}`}</div>
            ))}
          </div>
        ))}
      </div>
      {winner && <div>{winner.name}</div>}
    </div>
  );
}

export default App;
