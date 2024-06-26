import { getPlayerFromRepo } from "../repository/playerRepository.js";

// Handle 404 errors to show user when a player is not found
const handlePlayerNotFound = (res, id) => {
  res.status(404).send(`Player ${id} not found`);
};

// Handle errors
const handleError = (res, status, message) => {
  res.status(status).send(message);
};

const login = async (req, res) => {
  const { username } = req.params;
  try {
    const player = await getPlayerFromRepo({ userName: username });
    if (!player) {
      handlePlayerNotFound(res, id);
    } else {
      const userInfo = {
        id: player._id,
        userName: player.userName,
        screenName: player.screenName,
      };
      req.session.user = userInfo;
      res.status(200).send(userInfo);
    }
  } catch (error) {
    handleError(
      res,
      500,
      `Failed to fetch player ${username}: ${error.message}`
    );
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.clearCookie("session-id");
      res.status(200).send();
    }
  });
};
const checkForValidSession = (req, res) => {
  const { personalCookie } = req.query;
  const curUser = req.session.user;
  console.log(curUser);
  console.log(personalCookie);
  if (curUser) {
    curUser.id = curUser.id.toString();
    if (
      curUser.id === personalCookie.id &&
      curUser.username === personalCookie.userName &&
      curUser.screenName === personalCookie.screenName
    ) {
      res.status(200).send(req.session.user);
    }
  }
  res.status(401).send();
};

export { login, logout, checkForValidSession };
