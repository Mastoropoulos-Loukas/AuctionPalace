import React, { useState } from "react";
import { Link } from "react-router-dom";

function Gate(props) {
  const [failed, setFailed] = useState(null);

  const click = (e) => {
    props.onClick();
  };

  const crazyTrain = (e) => {
    e.preventDefault();
    if (props.jwt && props.uname === "admin") {
      fetch(`https://localhost:8070/admin/train `, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            return response.json();
          } else {
            throw Error("Failed to Train!");
          }
        })
        .then((data) => {
          props.onClick();
          window.location.reload();
        })
        .catch((err) => {
          setFailed(err.message);
        });
    }
  };

  return (
    <>
      {" "}
      <div className="enter">
        {failed && <h3 style={{ color: "red" }}>Error occured:{failed}</h3>}
        <h2>Χρήστης: {props.uname}</h2>
        {props.uname !== "admin" && (
          <h2>Υπόλοιπο: {props.ubalance.toFixed(2)} πόντοι</h2>
        )}
        {props.uname !== "admin" ? (
          <>
            {" "}
            <Link to="/mybids">
              {" "}
              <button
                className="btn"
                style={{ margin: "0.5em" }}
                onClick={click}
              >
                Οι πλειοδοτήσεις μου{" "}
              </button>
            </Link>
            <Link to="/myauctions">
              {" "}
              <button
                className="btn"
                style={{ margin: "0.5em" }}
                onClick={click}
              >
                {" "}
                Οι δημοπρασίες μου
              </button>
            </Link>
            <Link to="/points">
              <button
                className="btn"
                style={{ margin: "0.5em" }}
                onClick={click}
              >
                {" "}
                Διαχείρηση Πόντων
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/">
              {" "}
              <button
                className="btn"
                style={{ margin: "0.5em" }}
                onClick={click}
              >
                {" "}
                Διαχείρηση
              </button>
            </Link>
            <br></br>
            <button
              className="btn"
              style={{ margin: "0.5em" }}
              onClick={crazyTrain}
            >
              Εκπαίδευσε
            </button>
          </>
        )}

        <Link to="/received">
          <button className="btn" style={{ margin: "0.5em" }} onClick={click}>
            {" "}
            Διαχείρηση Μηνυμάτων
          </button>
        </Link>
      </div>
    </>
  );
}

export default Gate;
