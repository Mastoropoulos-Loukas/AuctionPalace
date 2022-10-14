import React from "react";

import { formatDates } from "../../../../util/formatDates";

function MessageDetails(props) {
  const formated_date = formatDates(props.date); // To date poy perasame san prop alla formated se morfi poy na katalavainoyme

  return (
    <div className="enter">
      <h2>{props.sent === true ? "Παραληπτης" : "Αποστολεας"}</h2>
      <p>{props.receiver}</p>
      <h2>Θέμα</h2>
      <p>{props.subject}</p>
      <h2>Ημερομηνία {props.sent === true ? "Αποστολής" : "Παράληψης"}</h2>
      <p>{formated_date}</p>
      <h2>Κυρίως Σώμα</h2>
      <p>{props.text}</p>
    </div>
  );
}

export default MessageDetails;
