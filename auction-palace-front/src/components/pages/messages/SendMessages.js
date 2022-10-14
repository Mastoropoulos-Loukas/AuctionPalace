import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SendMessagesPage(props) {
  const [receiver, setReceiver] = useState("N/A"); // o receiver poy tha steiloyme
  const [subject, setSubject] = useState("N/A"); // to thema toy mnmtos
  const [text, setText] = useState("N/A");  // to kyrios soma toy mnmtos

  const [failed, setFailed] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.jwt) {
    } else {
      navigate("/welcome");
    }
  }, []);

  async function composeMessage(msg) {
    if (props.jwt) {
      fetch("https://localhost:8070/users/messages/compose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
        body: JSON.stringify(msg),
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            navigate("/received");
          } else if(response.status === 400) {
            throw Error(`User ${msg.receiver_username} does not exist!`);
          } else {
            throw Error ("Server error!");
          }
        })
        .catch((err) => {
          setFailed(err.message);
        });
    }
  }

  const send = (e) => {
    e.preventDefault();
    const newMsg = {
      receiver_username: `${receiver}`,
      subject: `${subject}`,
      text: `${text}`,
    };

    if (props.jwt && newMsg.receiver_username !== "N/A") {
      composeMessage(newMsg);
    } else {
      setFailed("No receiver entered!");
    }
  };

  return (
    <div>
      <h1>Σύνθεση Μηνύματος</h1>
      {failed && <h2 style={{ color: "red" }}>{failed}</h2>}
      <div className="flexbox">
        <div className="filters-section">
          <br></br>
          <Link to="/received">
            <button className="btn btn--alt"> Received </button>
          </Link>
          <br></br>
          <br></br>
          <Link to="/sent">
            <button className="btn btn--alt"> Sent</button>
          </Link>
          <br></br> <br></br>
          <Link to="/compose">
            <button className="btn btn--alt"> Compose </button>
          </Link>
          <br></br>
        </div>
        <div>
          <form onSubmit={send}>
            {" "}
            <div className="input-form">
              {" "}
              <label htmlFor="receiver"> Προς: </label>
              <input
                type="text"
                id="receiver"
                style={{ width: "500px" }}
                onChange={(e) => {
                  setReceiver(e.target.value);
                }}
              ></input>
              <br></br>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="subject"> Θέμα: </label>
              <input
                type="text"
                id="subject"
                style={{ width: "500px" }}
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="main-body"> Κυρίως Μήνυμα</label>
              <br></br>
              <textarea
                type="text"
                id="main-body"
                rows="30"
                cols="100"
                onChange={(e) => {
                  setText(e.target.value);
                }}
              ></textarea>
            </div>
            <div className="center">
              {" "}
              <input type="submit" value="Αποστολή" className="btn"></input>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendMessagesPage;
