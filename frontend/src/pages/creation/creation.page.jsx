import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import accountExists from "../../actions/verifyAccount.js";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

const cookies = new Cookies();

/**
 * Page for playing game and interacting with game state
 * @returns Game Page
 */
const CreationPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [CurrentCookie, setCurrentCookie] = useState(
    cookies.get("PersonalCookie")
  );
  const [screenName, setScreenName] = useState("");
  const [Email, setEmail] = useState("");
  const [CreatedCookie, setCreatedCookie] = useState(false);

  useEffect(() => {
    if (CreatedCookie === true) {
      if (userName === "") {
        window.alert("Input a Username.");
        return;
      }
      accountExists(userName).then((res) => {
        if (res === true) {
          window.alert("Account with this username already exists.");
          return;
        }
        if (screenName === "") {
          window.alert("Input a ScreenName.");
          return;
        }
        if (Email === "") {
          window.alert("Input an Email.");
          return;
        }
        if (Password === "") {
          window.alert("Input a Password");
          return;
        }
        if (Password !== ConfirmPassword) {
          window.alert("Passwords do not Match");
          return;
        }
        // src: https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
        const emailRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailRegex.test(Email)) {
          window.alert("Not a Valid Email Address, Input a Valid Email.");
          return;
        }
        const makeNewAccount = async () => {
          const response = await axios.post(
            "http://localhost:8080/players",
            { userName: userName, screenName: screenName, password: Password, email: Email },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
              },
            }
          );

          if (response.status === 200){
            cookies.set("PersonalCookie", response.data._id);
            setCurrentCookie(cookies.get("PersonalCookie"));
            navigate("/room");
          }else {
            //Replace with more detailed
            window.alert(`Failure, status ${response.status}`)
          }



        };

        if (CreatedCookie === true) {
          makeNewAccount();
        }
      });
      setCreatedCookie(false);
    }
  }, [CreatedCookie, Email, userName, screenName, CurrentCookie]);

  return (
    <div>
      <h1>Creation Page</h1>
      <p>User Name</p>
      <Input
        type="username"
        onChange={(e) => setUserName(e.target.value)}
      ></Input>
      <br/>
      <p>Password</p>
      <Input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      ></Input>
      <p>Confirm Password</p>
      <Input
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      ></Input>
      <br/>
      <p>Screen Name</p>
      <Input
        type="screenname"
        onChange={(e) => setScreenName(e.target.value)}
      ></Input>
      <br/>
      <p>Email</p>
      <Input type="email" onChange={(e) => setEmail(e.target.value)}></Input>
      <br/>
      <Button
        onClick={() => {
          setCreatedCookie(true);
        }}
      >
        Create Account
      </Button>
    </div>
  );
};

export default CreationPage;
