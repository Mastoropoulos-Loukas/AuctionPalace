import { useState } from "react";
import { FaTrash } from "react-icons/fa";

import { formatDates } from "../../../../util/formatDates";

import Backdrop from "../../general/Backdrop";
import MessageDetails from "./MessageDetails";

function SentMessageCard(props) {
  const [enterIsOpen, setEnterIsOpen] = useState(false);

  const [failed, setFailed] = useState(null);

  function closeEnterHandler() {
    setEnterIsOpen(false);
  }

  function openEnterHandler() {
    setEnterIsOpen(true);
  }

  function deleteSent() {
    if (props.jwt && props.msgID) {
      fetch(`https://localhost:8070/users/messages/${props.msgID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            window.location.reload();
          } else {
            throw Error("Failed to Delete!");
          }
        })
        .catch((err) => {
          setFailed(err.message);
        });
    }
  }

  const formated_date = formatDates(props.date); // To date poy perasame san prop alla formated se morfi poy na katalavainoyme

  return (
    <div className="auction-card">
      {failed && <h4 style={{ color: "red" }}>Error: {failed}</h4>}
      <h3>Παραλήπτης</h3>
      <p>{props.receiver}</p>
      <h3>Ημερομηνία</h3>
      <p>{formated_date}</p>
      <h3>Θέμα</h3>
      <p>{props.subject}</p>
      <button className="btn" onClick={openEnterHandler}>
        {" "}
        Προβολή
      </button>
      <FaTrash className="bin-icon" onClick={deleteSent}></FaTrash>
      {enterIsOpen && (
        <MessageDetails
          sent={true}
          receiver={props.receiver}
          date={props.date}
          subject={props.subject}
          text={props.text}
          onClick={closeEnterHandler}
        ></MessageDetails>
      )}
      {enterIsOpen && <Backdrop onCancel={closeEnterHandler} />}
    </div>
  );
}

export default SentMessageCard;
