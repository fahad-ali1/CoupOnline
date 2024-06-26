import useGameContext from "@/context/useGameContext.js";
import Card from "@/components/card/card.component";
import ChooseCard from "@/lib/chooseCardEnum";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ActionTimeout from "../gameActions/actionTimeout.component";
import GameCard from "@/lib/cardEnum";

const PlayerCards = () => {
  const {
    gameCards,
    isChoosing,
    socket,
    roomId,
    initialAction,
    setTurnId,
    exchangeCards,
    setExchangeCards,
    chooseType,
    setIsChoosing,
    cookieRef,
  } = useGameContext();

  const [currentSelected, setCurrentSelected] = useState(0);
  const [selectedCards, setSelectedCards] = useState([
    false,
    false,
    false,
    false,
  ]);

  /**
   *
   * @param {*} card
   * @param {*} cardNumber
   * @returns
   */
  const handleChooseCard = (card, cardNumber) => {
    const { screenname } = cookieRef;
    if (isChoosing) {
      console.log(
        `${screenname} is choosing ${card}, ${ChooseCard[chooseType]},${initialAction}`
      );
      socket.current.emit("choose-card", {
        roomId: roomId,
        card: card,
        chooseActionType: chooseType,
      });
      setTurnId(null);
      setIsChoosing(false);
      return;
    } else if (exchangeCards) {
      setCurrentSelected(
        selectedCards[cardNumber] ? currentSelected - 1 : currentSelected + 1
      );
      const cards = selectedCards;
      cards[cardNumber] = !selectedCards[cardNumber];
      setSelectedCards(cards);
    }
  };

  const handleExchangeCard = () => {
    console.log(currentSelected);
    if (currentSelected === 2) {
      const chosenCards = [];
      const returnedCards = [];
      for (let i = 0; i < 4; i++) {
        if (i < 2) {
          if (!selectedCards[i]) {
            chosenCards.push(gameCards[i]);
          } else {
            returnedCards.push(gameCards[i]);
          }
        } else {
          if (!selectedCards[i]) {
            chosenCards.push(exchangeCards[i - 2]);
          } else {
            returnedCards.push(exchangeCards[i - 2]);
          }
        }
      }
      socket.current.emit("exchange-cards", {
        roomId: roomId,
        chosenCards: chosenCards,
        returnedCards: returnedCards,
      });
      setExchangeCards(null);
      setCurrentSelected(0);
      setSelectedCards([false, false, false, false]);
    }
  };

  const showPrompt = () => {
    if (exchangeCards) {
      return <p className="font-bold">Select Two Cards to Discard:</p>;
    } else if (isChoosing) {
      if (chooseType === ChooseCard.Show) {
        return <p className="font-bold">Select a Card to Show:</p>;
      } else {
        return <p className="font-bold">Select a Card to Lose:</p>;
      }
    }
  };

  const timeoutChooseDiscard = () => {
    if (gameCards[0] === GameCard.Eliminated) {
      handleChooseCard(1, 1);
    } else {
      handleChooseCard(0, 0);
    }
  };

  /**
   * Generates card images and confirmation button when exchanging cards
   * @returns The exchange card elemnts
   */
  const showExchange = () => {
    if (exchangeCards) {
      return (
        <>
          <div className="flex justify-center flex-row space-x-2 py-2">
            <Card
              card={exchangeCards[0]}
              active={selectedCards}
              number={2}
              onClick={() => handleChooseCard(0, 2)}
            ></Card>
            <Card
              card={exchangeCards[1]}
              active={selectedCards}
              number={3}
              onClick={() => handleChooseCard(1, 3)}
            ></Card>
          </div>
          <Button
            className={
              currentSelected === 2
                ? "bg-actions-normal"
                : "bg-actions-unavailable"
            }
            onClick={() => handleExchangeCard()}
          >
            Confirm Selection
          </Button>
        </>
      );
    }
    return;
  };

  return (
    <div className="flex flex-col">
      <p>Your Cards:</p>
      {showPrompt()}
      <div className="flex justify-center flex-row space-x-2">
        <Card
          card={gameCards[0]}
          active={selectedCards}
          number={0}
          onClick={() => handleChooseCard(0, 0)}
        ></Card>
        <Card
          card={gameCards[1]}
          active={selectedCards}
          number={1}
          onClick={() => handleChooseCard(1, 1)}
        ></Card>
      </div>
      {showExchange()}
      {isChoosing && chooseType === ChooseCard.Loose ? (
        <ActionTimeout callback={() => timeoutChooseDiscard()} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PlayerCards;
