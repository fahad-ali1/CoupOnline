import ambassador from "@/assets/Ambassador.png";
import assassin from "@/assets/Assassin.png";
import captain from "@/assets/Captain.png";
import duke from "@/assets/Duke.png";
import contessa from "@/assets/Contessa.png";
import tombstone from "@/assets/tombstone96.png";
import GameCard from "@/lib/cardEnum";
import CardInfo from "@/components/card/CardInfo";

import "./card.styles.css";
import useGameContext from "@/context/useGameContext.js";

/**
 *
 * @param {Number} card the cards index in the cardEnum object
 * @param {function} onClick the function to execute when the car
 * @param {active} boolean whether the card is active or not (has onClick behaviour)
 * @param {Number} number the index of the card in the player's list of current cards
 * @returns
 */
const Card = ({ card, onClick, active, number }) => {
  const { isChoosing, exchangeCards } = useGameContext();
  let img = "";
  let bgColor = "bg-cards-duke";

  let cardInfo = CardInfo[card];

  //Set default background color based on type of cards
  switch (card) {
    case GameCard.Duke:
      img = duke;
      bgColor = "bg-cards-duke ";
      break;
    case GameCard.Assassin:
      img = assassin;
      bgColor = "bg-cards-assassin";
      break;
    case GameCard.Ambassador:
      img = ambassador;
      bgColor = "bg-cards-ambassador";
      break;
    case GameCard.Captain:
      img = captain;
      bgColor = "bg-cards-captain";
      break;
    case GameCard.Contessa:
      img = contessa;
      bgColor = "bg-cards-contessa";
      break;
    case GameCard.Eliminated:
      img = tombstone;
      bgColor = `bg-cards-eliminated`;
      break;
  }

  //Change background colour when exchanging, to differentiate between kept and discarded cards
  if (exchangeCards && card != GameCard.Eliminated) {
    if (active[number]) {
      bgColor = "bg-cards-return";
    } else {
      bgColor = "bg-cards-keep";
    }
  }

  const nonTargetStyle = `grid w-36 rounded-3xl justify-items-center ${bgColor} px-2 py-4 bg-opacity-70`;
  const targetStyle = `${nonTargetStyle} hover:bg-opacity-40`;

  if (card == GameCard.Eliminated) {
    return (
      <div className={nonTargetStyle}>
        <p className="font-bold w-24 text-center">Eliminated</p>
        <img className="w-24 rounded-md" src={img} alt="char_icon" />
      </div>
    );
  } else {
    return (
      <div
        onClick={() => {
          onClick();
          console.log(active[number]);
        }}
        className={isChoosing || exchangeCards ? targetStyle : nonTargetStyle}
      >
        <p className="font-bold w-24 text-center">{cardInfo["character"]}</p>
        <img className="w-24 rounded-md" src={img} alt="char_icon" />
      </div>
    );
  }
};

export default Card;
