export const GameActions = {
  Income: 0,
  Aid: 1,
  Coup: 2,
  Taxes: 3,
  Assassinate: 4,
  Exchange: 5,
  Steal: 6,
  BlockAid: 7,
  BlockStealAsAmbass: 8,
  BlockStealAsCaptain: 9,
  BlockAssassinate: 10,
  CalloutLie: 11,
  Pass: 12,
  LooseCallout: 13,
  0: "Income",
  1: "Aid",
  2: "Coup",
  3: "Taxes",
  4: "Assassinate",
  5: "Exchange",
  6: "Steal",
  7: "BlockAid",
  8: "BlockStealAsAmbass",
  9: "BlockStealAsCaptain",
  10: "BlockAssassinate",
  11: "CalloutLie",
  12: "Pass",
  13: "LooseCallout",
};

export const isBlockAction = (action) => {
  if (
    action === GameActions.BlockAssassinate ||
    action === GameActions.BlockAid ||
    action === GameActions.BlockStealAsCaptain ||
    action === GameActions.BlockStealAsAmbass
  ) {
    return true;
  }
  return false;
};
