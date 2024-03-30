import ambassador from "./Ambassador1.png";
import assassin from "./Assassin1.png";
import captain from "./Captain2.png";
import duke from "./Duke1.png";
import contessa from "./Contessa1.png";
import tombstone from "../cardList/tombstone64.png";
import notFound from "./not-found.png";
import GameCard from "@/lib/cardEnum";
import CardInfo from "@/components/card/CardInfo";

import "./card.styles.css";
import useGameContext from "@/context/useGameContext.js";

const Card = ({ card, onClick, active, number }) => {
  const { isTarget, exchangeCards } = useGameContext();
  let img = notFound;
  let bgColor = "bg-cards-duke";

  let cardInfo = CardInfo[card];

  switch (card) {
    case GameCard.Duke:
      img = duke;
      bgColor = active[number] ? "bg-cards-active" : "bg-cards-duke ";
      break;
    case GameCard.Assassin:
      img = assassin;
      bgColor = active[number] ? "bg-cards-active" : "bg-cards-assassin";
      break;
    case GameCard.Ambassador:
      img = ambassador;
      bgColor = active[number] ? "bg-cards-active" : "bg-cards-ambassador";
      break;
    case GameCard.Captain:
      img = captain;
      bgColor = active[number] ? "bg-cards-active" : `bg-cards-captain`;
      break;
    case GameCard.Contessa:
      img = contessa;
      bgColor = active[number] ? "bg-cards-active" : `bg-cards-contessa`;
      break;
    case GameCard.Eliminated:
      img = tombstone;
      bgColor = `bg-cards-eliminated`;
      break;
  }

  const nonTargetStyle = `grid w-36 rounded-3xl justify-items-center ${bgColor} px-2 py-4 opacity-75`;
  const targetStyle = `${nonTargetStyle} hover:bg-cards-discard hover:opacity-80`;

  if (card == GameCard.Eliminated) {
    return (
      <div className={nonTargetStyle}>
        <img className="justify-center" src={img} alt="char_icon" />
      </div>
    );
  } else {
    return (
      <div
        onClick={() => {
          onClick();
          console.log(active[number]);
        }}
        className={isTarget || exchangeCards ? targetStyle : nonTargetStyle}
      >
        <p className="font-bold w-24 text-center">{cardInfo["character"]}</p>
        <img className="w-24" src={img} alt="char_icon" />
        {/* <CardActionTitle text={"Action:"} />
        <p className="font-semibold italic">
          {cardInfo["action-name"] == "" ? "N/A" : cardInfo["action-name"]}
        </p>
        <p>
          {cardInfo["action-effect"] == "" ? "N/A" : cardInfo["action-effect"]}
        </p>
        <CardActionTitle text={"Counter-action:"} />
        <p>
          {cardInfo["counteraction"] == "" ? "N/A" : cardInfo["counteraction"]}
        </p> */}
      </div>
    );
  }
};

export default Card;
