import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ActionTable from "@/components/actionTable/actionTable.component";
import GameRules from "@/components/gameRules/gameRules.component";
import GameSectionTitle from "@/components/text/gameSectionTitle.component";
import { Button } from "@/components/ui/button";
import useGameContext from "@/context/useGameContext";

/**
 * Generates collection of references for the player (rules and game actions)
 * @returns React UI element for reference view
 */
const References = () => {
  const { socket, roomId } = useGameContext();
  return (
    <div className="space-y-2 p-2">
      <GameSectionTitle text={"References:"} />
      <div className="flex flex-row justify-center">
        <div className="flex flex-col space-y-2 sm:w-60 m-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-button-mainButton text-textColor-dark">
                Actions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full w-fit">
              <ActionTable />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-button-mainButton text-textColor-dark">
                Rules
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full w-fit max-h-full">
              <GameRules />
            </DialogContent>
          </Dialog>
          <Button
            className="bg-button-secondaryButton text-textColor-dark"
            onClick={() => {
              socket.current.emit("reset-game", { roomId: roomId }, () => {
                console.log("reset");
              });
            }}
          >
            Reset Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default References;
