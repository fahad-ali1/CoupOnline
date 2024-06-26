import { useEffect } from "react";
import GameActions from "@/lib/actionEnum";
import { useNavigate } from "react-router-dom";
import usePlayerState from "./PlayerState";
import Cookies from "universal-cookie";
import { io } from "socket.io-client";
import ChooseCard from "@/lib/chooseCardEnum";
import terminal from "virtual:terminal";

/**
 * Sets up socket listeners for gamestate variables
 * @param {*} gameState
 */
export const useGameEvents = (gameState) => {
  const {
    setWinner,
    socket,
    roomId,
    setLobbyMembers,
    setGameCards,
    setGameStart,
    setTurnId,
    setInitialUserId,
    setInitialAction,
    setTargetId,
    setResponseInitialId,
    setResponseInitialAction,
    setResponseSecondaryId,
    setResponseSecondaryAction,
    setIsChoosing,
    setCoins,
    setDiscardDeck,
    setIsResponding,
    setExchangeCards,
    responseIdRef,
    setIsTarget,
    setChooseType,
    setPlayerCardCount,
    setEventLog,
    eventLog,
    cookieRef,
  } = gameState;

  const navigate = useNavigate();
  const { setInLobby } = usePlayerState();
  const cookies = new Cookies();

  useEffect(() => {
    const cookie = cookies.get("PersonalCookie");
    cookieRef.current = cookie;
    const { id } = cookie;
    // Creates socket client if there is not socket object
    if (!socket.current) {
      socket.current = io(import.meta.env.VITE_SERVER_URL, {
        extraHeaders: {
          id: id,
          username: cookie.username,
          screenname: cookie.screenName,
        },
      });
    }

    const onLobbyEvent = ({ lobby }) => {
      setLobbyMembers(lobby);
    };

    /**
     *
     * @param {*} status
     */
    const handleStatusOnRoomJoin = (status) => {
      if (status.status === 400) {
        navigate("/room");
      } else if (status.status === 401) {
        navigate("/room");
      }
    };

    /**
     * Sets the game ui to render on game-start event
     */
    const onStartEvent = () => {
      setInLobby(false);
      setGameStart(true);
    };

    /**
     * Sets targetId, and the action causing the target
     * @param {*} initialUserId
     * @param {*} initialAction
     * @param {*} targetId
     */
    const onChooseResponseEvent = ({
      initialUserId,
      initialAction,
      targetId,
    }) => {
      terminal.log(
        `Choose a response to ${initialUserId}'s action of ${GameActions[initialAction]}, ${targetId} is the target`
      );
      setInitialAction(initialAction);
      setInitialUserId(initialUserId);
      setTargetId(targetId);
      setIsResponding(true);
      if (id === targetId) {
        terminal.log({ targetId });
        setIsTarget(true);
      }
    };

    /**
     * The Event when a player is prompted to lose or show a card
     * @param {*} chooserId - Player asking for target to choose card
     * @param {*} initialUserId - initial user
     * @param {*} initialAction - initial action
     * @param {*} responseId - responser userId
     * @param {*} responseAction - responser action
     * @param {*} secondaryResponseId
     * @param {*} secondaryResponseAction
     * @returns
     */
    const onChooseCardEvent = ({
      chooserId,
      chooseType,
      initialUserId,
      initialAction,
      responseId,
      responseAction,
      secondaryResponseId,
      secondaryResponseAction,
    }) => {
      setIsResponding(false);
      setTurnId(chooserId);
      setChooseType(chooseType);
      setInitialUserId(initialUserId);
      setInitialAction(initialAction);
      setResponseInitialAction(responseAction);
      setResponseInitialId(responseId);
      setResponseSecondaryAction(secondaryResponseAction);
      setResponseSecondaryId(secondaryResponseId);
      responseIdRef.current = responseId;

      if (chooserId === id) {
        setIsChoosing(true);
        return;
      }
      setIsChoosing(false);
    };

    /**
     * Sets the random cards given to the player
     * @param {*} param0
     */
    const onExchangeCardEvent = ({ chooserId, exchangeCards }) => {
      console.log(`${chooserId} is choosing 2 cards`);
      if (chooserId === id) {
        setChooseType(ChooseCard.Exchange);
        setExchangeCards(exchangeCards);
      }
    };

    /**
     * Resets turn relevant state and updates general gamestate
     */
    const onUpdateState = ({
      gameCards,
      turnId,
      coins,
      discardDeck,
      playerCardCount,
    }) => {
      setGameCards(gameCards);
      setTurnId(turnId);
      setExchangeCards.current = null;
      setIsChoosing(false);
      setInitialAction(null);
      setInitialUserId(turnId);
      setTargetId(null);
      responseIdRef.current = null;
      setResponseInitialAction(null);
      setResponseInitialId(null);
      setResponseSecondaryAction(null);
      setResponseSecondaryId(null);
      setCoins(coins);
      setDiscardDeck(discardDeck);
      setIsTarget(false);
      setChooseType(null);
      setPlayerCardCount(playerCardCount);
    };

    const onPartialUpdate = ({
      gameCards,
      turnId,
      coins,
      discardDeck,
      playerCardCount,
    }) => {
      console.log("Partially Updating State");
      setGameCards(gameCards);
      setTurnId(turnId);
      setCoins(coins);
      setDiscardDeck(discardDeck);
      setPlayerCardCount(playerCardCount);
    };

    const onBlocked = ({
      initialUserId,
      initialAction,
      responseId,
      responseAction,
    }) => {
      console.log(
        `${initialUserId}'s action of ${GameActions[initialAction]} is being blocked by ${responseId} with action of ${GameActions[responseAction]}`
      );
      setInitialUserId(initialUserId);
      setInitialAction(initialAction);
      responseIdRef.current = responseId;
      setResponseInitialAction(responseAction);
      setResponseInitialId(responseId);

      // Everyone other than the blocker can respond to the block
      if (responseId !== id) {
        setIsResponding(true);
        return;
      }
      setIsResponding(false);
    };

    const onEndGame = ({ winner }) => {
      setWinner(winner);
    };

    const onEventLog = ({ eventString }) => {
      const temp = eventLog;
      temp.unshift(eventString);
      setEventLog(temp);
    };

    socket.current.connect();
    socket.current.emit(
      "join-room",
      { roomId: roomId },
      handleStatusOnRoomJoin
    );
    socket.current.on("event-log", onEventLog);
    socket.current.on("lobby-members", onLobbyEvent);
    socket.current.on("start-game", onStartEvent);
    socket.current.on("choose-response", onChooseResponseEvent);
    socket.current.on("choose-card", onChooseCardEvent);
    socket.current.on("exchange-cards", onExchangeCardEvent);
    socket.current.on("update-state", onUpdateState);
    socket.current.on("partial-update-state", onPartialUpdate);
    socket.current.on("blocked", onBlocked);
    socket.current.on("end-game", onEndGame);

    // Removes all event listeners when component is removed
    return () => {
      socket.current.off("event-log", onEventLog);
      socket.current.off("lobby-members", onLobbyEvent);
      socket.current.off("start-game", onStartEvent);
      socket.current.off("choose-response", onChooseResponseEvent);
      socket.current.off("choose-card", onChooseCardEvent);
      socket.current.off("exchange-cards", onExchangeCardEvent);
      socket.current.off("update-state", onUpdateState);
      socket.current.off("partial-update-state", onPartialUpdate);
      socket.current.off("blocked", onBlocked);
      socket.current.off("end-game", onEndGame);
      socket.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
