"use client";

import "./page.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

export default function Export() {

  const [historicList, setHistoricList] = useState([]);

  const headers = [
    { label: "User", key: "user" },
    { label: "Date", key: "dt" },
    { label: "Message", key: "message" }
  ]

  useEffect(() => {
    getHistorics();
  }, []);

  function sortByDate(a, b) {
    const isOlder = a.dt > b.dt ? 1 : -1;
    return isOlder;

  }

  async function getHistorics() {
    try {
      const response = await axios.get("https://albert-chatbot-api-production.up.railway.app/");
      setHistoricList(response.data[0]);
    } catch (err) {
      console.log(err);
    }

  }


  return (
    <div className="box-historicList">
      {historicList.sort(sortByDate).map(({ id, historic, dt }) =>
        <div key={id} className={'historicList'}>
          <p>{`Historic ${JSON.parse(historic)[JSON.parse(historic).length - 2].user}
          #${id} ${dt.replace("T", " ").split(":00.")[0]}`}</p>
          <CSVLink
            data={JSON.parse(historic)}
            headers={headers}
            filename={JSON.parse(historic)[JSON.parse(historic).length - 2].user
              + "#" + id + "-" + dt.replace("T", " ").split(":00.")[0] + "-historic"}>
            <button className="exportCSV-btn">export csv</button>
          </CSVLink>
        </div>
      )
      }

    </div >
  )
}