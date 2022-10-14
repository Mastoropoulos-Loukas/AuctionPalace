import { useState } from "react";
import { FaTrash } from "react-icons/fa";

import { formatDates } from "../../../../util/formatDates";

import Backdrop from "../../general/Backdrop";
import MessageDetails from "./MessageDetails";

function ReceivedMessageCard(props) {
  const [enterIsOpen, setEnterIsOpen] = useState(false);
  const [notSeen, setNotSeen] = useState(!props.seen); //Whether exoyme dei ena mnm 

  const [failed1, setFailed1] = useState(null);
  const [failed2, setFailed2] = useState(null);

  function closeEnterHandler() {
    setEnterIsOpen(false);
  }

  function deleteReceived() {
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
            setFailed1(null);
            window.location.reload();
          } else {
            throw Error("Failed to Delete");
          }
        })
        .catch((err) => {
          setFailed1(err.message);
        });
    }
  }

  function openEnterHandler() {
    setEnterIsOpen(true);

    if (!props.seen && props.msgID) {
      fetch(`https://localhost:8070/users/messages/seen/${props.msgID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed2(null);
            return response.json();
          } else {
            throw Error("Failed to see!");
          }
        })
        .then((data) => {
          setNotSeen(!notSeen);
          if (props.newMsgs) {
            props.setNewMsgs(props.newMsgs - 1);
          }
        })
        .catch((err) => {
          setFailed2(err.message);
        });
    }
  }

  const formated_date = formatDates(props.date);

  return (
    <div className="auction-card">
      {failed1 && <h5 style={{ color: "red" }}>Error: {failed1}</h5>}
      {failed2 && <h5 style={{ color: "red" }}>Error: {failed2}</h5>}
      <h3>Αποστολέας</h3>
      <p>{props.sender}</p>
      <h3>Ημερομηνία</h3>
      <p>{formated_date}</p>
      <h3>Θέμα</h3>
      <p>{props.subject}</p>
      <button className="btn" onClick={openEnterHandler}>
        {" "}
        Προβολή
      </button>
      <FaTrash className="bin-icon" onClick={deleteReceived}></FaTrash>
      {!props.seen && notSeen && <h3 style={{ color: "green" }}>Νέο!</h3>}
      {enterIsOpen && (
        <MessageDetails
          sent={false}
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

export default ReceivedMessageCard;
