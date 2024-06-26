import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoutCall from "@/actions/logout.js";
import Cookies from "universal-cookie";
import checkIfActiveSession from "@/actions/checkIfActiveSession.js";

const cookies = new Cookies();

/**
 * Page for joining a game Room
 * @returns
 */
const RoomPage = () => {
  const room = useRef();
  const navigate = useNavigate();
  const [cookieExists, setCookieExists] = useState(true);
  const [localCookie, setLocalCookie] = useState(undefined);

  // Checks if a cookie exists for a user, if not, logs then out
  useEffect(() => {
    const cookie = cookies.get("PersonalCookie");
    setLocalCookie(cookie);
    if (!cookie) {
      setCookieExists(false); // Update state when cookie doesn't exist
    }
  }, []);

  // useEffect(() => {
  //   checkIfActiveSession().then((res) => {
  //     if (res === undefined){
  //       logoutCall()
  //       navigate("/")
  //     }
  //   })
  // }, [localCookie]);

  // Function to handle joining a room
  const handleJoin = () => {
    if (!room.current) {
      return;
    }
    navigate(`${room.current}`);
  };

  // Function to handle user logout
  const handleLogout = () => {
    logoutCall().then(() => {
      cookies.remove("PersonalCookie");
      navigate("/");
    });
  };

  // Function to handle 'enter' key press for joining room
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleJoin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Display message if not logged in  */}
      {!cookieExists && (
        <div>
          <p className="text-textColor-error mb-4">
            Please log in to join a game.
          </p>
        </div>
      )}
      <div className="w-50">
        <div className="mb-4">
          {cookieExists && (
            <Input
              type="text"
              onChange={(e) => {
                room.current = e.target.value;
              }}
              onKeyPress={handleKeyPress}
              placeholder="Room Number"
              disabled={room.current ? true : false}
              className="w-full px-4 py-2 border rounded-md text-textColor-dark"
            />
          )}
        </div>
        {cookieExists && (
          <Button
            onClick={handleJoin}
            className="px-4 py-2 rounded-md w-full"
            disabled={!cookieExists}
          >
            {room.current ? "Leave Room" : "Join Room"}
          </Button>
        )}
        {cookieExists && (
          <Button
            onClick={handleLogout}
            className="bg-button-redButton px-4 py-2 my-4 rounded-md w-full"
            disabled={!cookieExists}
          >
            Logout
          </Button>
        )}
        {/* Button to navigate to login page if not logged in  */}
        {!cookieExists && (
          <Button onClick={() => navigate("/")} className="rounded-md w-full">
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
