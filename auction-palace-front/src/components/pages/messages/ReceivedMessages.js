import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import ReceivedMessageCard from "./cards/ReceivedMessageCard";

function ReceivedMessagesPage(props) {
  const [info, setInfo] = useState([
    {
      message_id: 1,
      date: "N/A",
      receiver_username: "N/A",
      subject: "N/A",
      sender_username: "N/A",
      text: "N/A",
      seen: false,
    },
  ]); // Ola ta received msgs

  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(Infinity);

  const [newMsgs, setNewMsgs] = useState(0); // Posa new msgs exoyme

  const [failed, setFailed] = useState(null);

  const navigate = useNavigate();

  function previousPage() {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  }

  function nextPage() {
    if (pageNum < totalPages) {
      setPageNum(pageNum + 1);
    }
  }

  useEffect(() => {
    if (props.jwt) {
      fetch(
        `https://localhost:8070/users/messages/inbox?pageNumber=${pageNum}&pageSize=8`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.jwt}`,
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            return response.json();
          } else {
            throw Error("Server Error at received!");
          }
        })
        .then((data) => {
          setTotalPages(data.total_pages);
          setInfo(data.page);
        })
        .catch((err) => {
          setFailed(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, [pageNum]);

  useEffect(() => {
    if (props.jwt) {
      fetch("https://localhost:8070/users/messages/unseen", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            return response.json();
          }else{
            throw Error("Server error at unread!");
          }
        })
        .then((data) => {
          setNewMsgs(data);
        }).catch((err)=>{
          setFailed(err.message);
        })
    }
  }, []);

  return (
    <div>
      {failed && <h1>Error occured:{failed}</h1>}
      {!failed && (
        <>
          {" "}
          <h1>
            Εισερχόμενα ({newMsgs ? newMsgs : 0} Νέ{newMsgs === 1 && "ο"}
            {newMsgs !== 1 && "α"}){" "}
          </h1>
        </>
      )}

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
        {failed && <h1>Error occured:{failed}</h1>}
        {!failed && (
          <>
            {" "}
            <div className="auction-list">
              {!info.length && (
                <div className="center">
                  <h3>Δεν έχετε λάβει ακόμη κάποιο μήνυμα</h3>
                </div>
              )}{" "}
              {info.map((mappedInfo) => (
                <ReceivedMessageCard
                  key={mappedInfo.message_id}
                  msgID={mappedInfo.message_id}
                  sender={mappedInfo.sender_username}
                  subject={mappedInfo.subject}
                  date={mappedInfo.date}
                  text={mappedInfo.text}
                  seen={mappedInfo.seen}
                  jwt={props.jwt}
                  newMsgs={newMsgs}
                  setNewMsgs={setNewMsgs}
                ></ReceivedMessageCard>
              ))}
            </div>
          </>
        )}
      </div>
      {!failed && (
        <>
          {" "}
          <div className="center">
            {" "}
            {info.length !== 0 && (
              <div style={{ margin: "5px" }}>
                {" "}
                <FaArrowLeft
                  className="nav-arrow"
                  onClick={previousPage}
                ></FaArrowLeft>{" "}
                {pageNum}/{totalPages}{" "}
                <FaArrowRight
                  className="nav-arrow"
                  onClick={nextPage}
                ></FaArrowRight>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ReceivedMessagesPage;
