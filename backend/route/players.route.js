import express from "express";
import {
  getPlayers,
  getPlayerByIdPasswordAuth,
  updatePlayer,
  deletePlayer,
  createPlayer,
  getPlayerByUsernamePasswordAuth, checkIfPlayerExistsByID, checkIfPlayerExistsByName,
} from "../controller/playerController.js";
import checkForNeededPlayerFields from "../middleware/checkForValidPlayer.js";
import {hashPasswordBody, hashPasswordParams} from "../middleware/hashPassword.js";

const router = express.Router();

// Player Routes
//router.get("/", getPlayers);
router.get("/byId/passwordAuth/:id/:password", hashPasswordParams, getPlayerByIdPasswordAuth);
router.get("/byName/passwordAuth/:username/:password", hashPasswordParams, getPlayerByUsernamePasswordAuth);
//router.get("/byId/cookieAuth/:id/:password", getPlayerByIdCookieAuth);
//router.get("/byName/cookieAuth/:username/:password", getPlayerByUsernameCookieAuth);
router.get("/check/byId/:id", checkIfPlayerExistsByID);
router.get("/check/byName/:username", checkIfPlayerExistsByName);
//router.get("/:id", getPlayer);
router.patch("/:id", updatePlayer);
router.delete("/:id", deletePlayer);
router.post("/", checkForNeededPlayerFields, hashPasswordBody, createPlayer);

export default router;
