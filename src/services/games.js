import axios from "axios";
import { serverUrl } from "../constants";

export const getGameId = async (
  couplesCount,
  singlePlayerMode,
  gameDificulty
) => {
  const response = await axios.post(`${serverUrl}/api/game`, {
    couplesCount: couplesCount,
    singlePlayerMode: singlePlayerMode,
    gameDificulty: gameDificulty,
  });
  const gameId = response.data;
  return gameId;
};

export const addUsertoGame = async (userId, userName, gameId) => {
  try {
    await axios.put(`${serverUrl}/api/game${gameId}`, {
      userId: userId,
      userName: userName,
    });
    return true;
  } catch (error) {
    return false;
  }
};
