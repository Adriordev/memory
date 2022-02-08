import axios from "axios";
export const getGameId = async (
  couplesCount,
  singlePlayerMode,
  gameDificulty
) => {
  const response = await axios.post("http://localhost:3000/api/game", {
    couplesCount: couplesCount,
    singlePlayerMode: singlePlayerMode,
    gameDificulty: gameDificulty,
  });
  const gameId = response.data;
  return gameId;
};

