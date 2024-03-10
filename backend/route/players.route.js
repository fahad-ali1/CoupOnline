import express from "express";
import {
  getPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
  createPlayer,
  getPlayerByUsername, checkIfPlayerExistsByID, checkIfPlayerExistsByName,
} from "../controller/playerController.js";
import checkForNeededPlayerFields from "../middleware/checkForValidPlayer.js";
import hashPassword from "../middleware/hashPassword.js";

const router = express.Router();

// Player Routes
router.get("/", getPlayers);
router.get("/byId/:id", getPlayer);
router.get("/byName/:username", getPlayerByUsername);
router.get("/check/byId/:id", checkIfPlayerExistsByID);
router.get("/check/byName/:username", checkIfPlayerExistsByName);
router.get("/:id", getPlayer);
router.patch("/:id", updatePlayer);
router.delete("/:id", deletePlayer);
router.post("/", checkForNeededPlayerFields, hashPassword, createPlayer);

export default router;
