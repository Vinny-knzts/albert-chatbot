"use client";

import './page.css';
import { useRef, useState, useEffect } from 'react';
import { inputs } from '../data/inputs';
import { outputs } from '../data/outputs';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {

  const chatboxRef = useRef(null);

  const [messageInput, setMessageInput] = useState("");
  const [elementList, setElementList] = useState([]);
  const [historic, setHistoric] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [placeholder, setPlaceHolder] = useState("Message...");
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const { push } = useRouter();

  useEffect(() => {
    const lastElement = chatboxRef.current?.lastElementChild;
    lastElement?.scrollIntoView();
  }, [elementList]);

  async function runApi() {

    setHistoric(async (state) => {
      try {
        const response = await axios.post("https://albert-chatbot-api-production.up.railway.app/", {
          historic: JSON.stringify(state),
          dt: state[state.length - 2].dt
        });
      } catch (err) {
        console.log(err);
      }
    });



    setHistoric([]);

  }

  function getDate() {
    const now = new Date(Date.now());

    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const dateFormat = `${year}-${month}-${day} ${hours}:${minutes}`;

    return dateFormat;
  }

  function sendInfo(e, option) {
    e.preventDefault();

    let messageReturn;
    let linkRef;

    if (option === "firstOption") {

      messageReturn = outputs.firstOption;
      linkRef = outputs.firstOptionRef;

    } else if (option === "secondOption") {

      messageReturn = outputs.secondOption;
      linkRef = outputs.secondOptionRef;

    } else if (option === "thirdOption") {

      messageReturn = outputs.thirdOption;
      linkRef = outputs.thirdOptionRef;

    }

    const newElement = <div key={elementList.length + "loanInfo"} className="box-message-bot">
      <div className="message-bot">
        <p>{messageReturn}</p>
        <br />
        <a href={linkRef} target="_blank">To know more about it click here</a>
      </div>
    </div>

    const newMessage = {
      user: "Albert-bot",
      message: messageReturn + "\n\n"
        + linkRef,
      dt: getDate()
    }

    setElementList(oldElementList => [...oldElementList, newElement]);
    setHistoric(oldHistoric => [...oldHistoric, newMessage]);

  }

  function anwserMessage(message) {
    setTimeout(() => {

      let messageReturn;

      let clearHistoric = false;

      let newPlaceHolder;

      if (username === undefined) {

        messageReturn = outputs.reqPassword;
        newPlaceHolder = "Password...";
        setUsername(message);
        setPassword(undefined);

      } else if (password === undefined) {

        messageReturn = outputs.successfulLogin;
        setPassword(true);
        setIsLogged(true);

      } else if (!isLogged && inputs.start.some(e => message.toLowerCase().includes(e))) {

        messageReturn = outputs.reqLogin;
        newPlaceHolder = "Username...";
        setUsername(undefined);

      } else if (isLogged && message.toLowerCase().includes(inputs.loan)) {

        const elementLoanAbout = <div key={elementList.length + "bot"} className="box-message-bot">
          <p className="message-bot">{outputs.loanAbout}</p>
        </div>

        const elementLoanOptions = <div key={elementList.length + "loanOptions"} className="box-message-bot">
          <div className="message-bot">
            <a onClick={(e) => sendInfo(e, 'firstOption')} href={""}>{outputs.laonOptions.firstOption}</a>
            <br />
            <br />
            <a onClick={(e) => sendInfo(e, 'secondOption')} href={""}>{outputs.laonOptions.secondOption}</a>
            <br />
            <br />
            <a onClick={(e) => sendInfo(e, 'thirdOption')} href={""}>{outputs.laonOptions.thirdOption}</a>
          </div>
        </div>

        const messageLoanAbout = {
          user: "Albert-bot",
          message: outputs.loanAbout,
          dt: getDate()
        }

        const messageLoanOptions = {
          user: "Albert-bot",
          message: outputs.laonOptions.firstOption + "\n\n"
            + outputs.laonOptions.secondOption + "\n\n"
            + outputs.laonOptions.thirdOption,
          dt: getDate()
        }

        setElementList(oldElementList => [...oldElementList, elementLoanAbout]);
        setElementList(oldElementList => [...oldElementList, elementLoanOptions]);
        setHistoric(oldHistoric => [...oldHistoric, messageLoanAbout]);
        setHistoric(oldHistoric => [...oldHistoric, messageLoanOptions]);
        setIsAnswering(false);
        setPlaceHolder(newPlaceHolder || "Message...");

        return;

      } else if (isLogged && message.toLowerCase().includes(inputs.goodbye)) {

        messageReturn = outputs.goodbye;
        clearHistoric = true;
        setIsLogged(false);
        setUsername(null);
        setPassword(null);

      } else {

        messageReturn = outputs.error;

      }

      const newElement = <div key={elementList.length + "bot"} className="box-message-bot">
        <p className="message-bot">{messageReturn}</p>
      </div>

      const newMessage = {
        user: "Albert-bot",
        message: messageReturn,
        dt: getDate()
      }

      setElementList(oldElementList => [...oldElementList, newElement]);
      setHistoric(oldHistoric => [...oldHistoric, newMessage]);
      clearHistoric && runApi();
      setIsAnswering(false);
      setPlaceHolder(newPlaceHolder || "Message...");

    }, 2000)

  }

  function sendMessage(e) {
    e.preventDefault();

    if (!messageInput) return;

    setIsAnswering(true);
    setPlaceHolder("Anwsering...");

    const newElement = <div key={elementList.length + "user"} className="box-message-user">
      <p className="message-user">{password === undefined ? "*****" : messageInput}</p>
    </div>

    const newMessage = {
      user: username && password ? username : null,
      message: password === undefined ? "*****" : messageInput,
      dt: getDate()
    }

    setElementList(oldElementList => [...oldElementList, newElement]);
    setHistoric(oldHistoric => [...oldHistoric, newMessage]);

    setMessageInput('');

    anwserMessage(messageInput);
  }

  return (
    <div className="chatbot">
      <header>
        <h2>Albert - CHATBOT</h2>
      </header>
      <div ref={chatboxRef} className="chatbox">
        {elementList.map((element) =>
          element
        )}
      </div>
      <div className="box-botton">
        <form onSubmit={sendMessage} className="box-chat-input">
          <div className="chat-input">
            <input placeholder={placeholder}
              disabled={isAnswering}
              value={messageInput}
              type={password === undefined ? "password" : "text"}
              onChange={(e) => setMessageInput(e.target.value)}
            />
          </div>
        </form>
        <button className="export-btn" onClick={() => push('/export')}>export historic</button>
      </div>
    </div>
  )
}
