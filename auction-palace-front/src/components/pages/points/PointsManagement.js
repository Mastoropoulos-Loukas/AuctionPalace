import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AddCreditCard from "./AddCreditCard";
import Backdrop from "../general/Backdrop";

function PointsManagement(props) {
  const [userCards, setUserCards] = useState([]); // oi kartes toy xristi

  const [selectedCardBuy, setSelectedCardBuy] = useState(0); // i karta poy tha xrisimopoiisei gia agora
  const [selectedCardOut, setSelectedCardOut] = useState(0); // i karta poy tha xrisimopoiisei gia cashOut
  const [points, setPoints] = useState(0); // oi pontoi poy exei epileksi
  const [amountCashed, setAmountCashed] = useState(0); // to poso poy tha kanei cashOut

  const [enterIsOpen, setEnterIsOpen] = useState(false);

  const [deals, setDeals] = useState([]); // oles oi prosfores poy yparxoyn sti vasi

  const [failedBuy, setFailedBuy] = useState(null);
  const [failedCashOut, setFailedCashOut] = useState(null);
  const [failedDeals, setFailedDeals] = useState(null);
  const [failedCards, setFailedCards] = useState(null);

  const navigate = useNavigate();

  function openEnterHandler() {
    setEnterIsOpen(true);
  }

  function closeEnterHandler() {
    setEnterIsOpen(false);
  }

  function buy(e) {
    e.preventDefault();
    if (props.jwt && selectedCardBuy>0 && points > 0) {
      fetch(`https://localhost:8070/users/get_deal/${points}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedBuy(null);
            return response.json();
          } else {
            throw Error("Failed to Buy Deal!");
          }
        })
        .then((data) => {
          props.setUbalance(data.balance);
          window.location.reload();
        })
        .catch((err) => {
          setFailedBuy(err.message);
        });
    }
  }

  function cashOut(e) {
    e.preventDefault();
    if (props.jwt && selectedCardOut > 0 && amountCashed > 0) {
      fetch(
        `https://localhost:8070/users/cash_out/${selectedCardOut}?amount=${amountCashed}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.jwt}`,
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setFailedCashOut(null);
            return response.json();
          } else {
            throw Error("Failed to Cash Out!");
          }
        })
        .then((data) => {
          props.setUbalance(data.balance);
          window.location.reload();
        })
        .catch((err) => {
          setFailedCashOut(err.message);
        });
    }
  }

  useEffect(() => {
    if (props.jwt) {
      fetch("https://localhost:8070/search/deals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedDeals(null);
            return response.json();
          } else {
            throw Error("Failed to fetch deals!");
          }
        })
        .then((data) => {
          setDeals(data);
        })
        .catch((err) => {
          setFailedDeals(err.message);
        });

      fetch("https://localhost:8070/users/cards", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedCards(null);
            return response.json();
          } else {
            throw Error("Failed to Fetch User's Cards!");
          }
        })
        .then((data) => {
          setUserCards(data);
        })
        .catch((err) => {
          setFailedCards(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, []);

  return (
    <div>
      <h1>
        Διαχείρηση Πόντων{" "}
        <p>Πόντοι που Απομένουν: {props.ubalance.toFixed(2)} </p>
      </h1>
      <button className="btn" onClick={openEnterHandler}>
        Προσθήκη κάρτας
      </button>
      <div className="flexbox">
        <div style={{ marginLeft: "50px" }}>
          <h1 style={{ marginTop: "20px" }}>Αγορά Πόντων</h1>
          {failedCards && <h1 style={{ color: "red" }}>Error:{failedCards}</h1>}
          {!failedCards && (
            <>
              {" "}
              <h3 style={{ marginTop: "20px" }}>Επιλογή Κάρτας</h3>
              {userCards.length>0 ? (
                <select
                  id="card"
                  name="card"
                  style={{ marginBottom: "50px" }}
                  onChange={(e) => {
                    setSelectedCardBuy(e.target.value);
                  }}
                >
                  <option value={0}>Επιλέξτε Καρτα</option>
                  {userCards.map((card) => {
                    return (
                      <option key={card.card_id} value={card.card_id}>
                        {card.card_number}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <p>Δεν έχετε συνδέσει κάποια κάρτα!</p>
              )}
            </>
          )}
          {failedDeals && <h1 style={{ color: "red" }}>Error:{failedDeals}</h1>}
          {!failedDeals && (
            <>
              <h3>Επιλογή Πακέτου</h3>
              {deals.length ? (
                deals.map((deal) => (
                  <div key={deal.id}>
                    {" "}
                    <input
                      type="radio"
                      id={deal.id}
                      name="deal"
                      value={deal.id}
                      onChange={(e) => {
                        setPoints(e.target.value);
                      }}
                    />{" "}
                    <label htmlFor={deal.id}>
                      {deal.points} Πόντοι με {deal.cost}${" "}
                    </label>
                    <br></br>
                  </div>
                ))
              ) : (
                <p>
                  Δεν υπάρχουν διαθέσιμα πακέτα<br></br>Προσπαθήστε ξανά
                  αργότερα
                </p>
              )}
              {deals.length ? (
                <>
                  <input
                    type="radio"
                    id="zero"
                    name="deal"
                    value={0}
                    onChange={(e) => {
                      setPoints(e.target.value);
                    }}
                  />
                  <label htmlFor="zero">Cash Out</label>
                  <br></br>
                  <br></br>
                  <button className="btn" onClick={buy}>
                    {" "}
                    Αγορά
                  </button>
                  {failedBuy && (
                    <h1 style={{ color: "red" }}>Error:{failedBuy}</h1>
                  )}
                </>
              ) : (
                <>
                  {" "}
                  <br></br>
                  <br></br>
                </>
              )}
            </>
          )}
        </div>{" "}
        <div style={{ marginLeft: "50px" }}>
          <h1 style={{ marginTop: "20px" }}>Eξαργύρωση Πόντων</h1>
          <h3 style={{ marginTop: "20px" }}>Επιλογή Κάρτας</h3>
          {userCards.length > 0 ? (
            <select
              id="card"
              name="card"
              style={{ marginBottom: "50px" }}
              onChange={(e) => {
                setSelectedCardOut(e.target.value);
              }}
            >
              <option value={0}>Επιλέξτε Κάρτα</option>
              {userCards.map((card) => {
                return (
                  <option key={card.card_id} value={card.card_id}>
                    {card.card_number}
                  </option>
                );
              })}
            </select>
          ) : (
            <p>Δεν έχετε συνδέσει κάποια κάρτα!</p>
          )}

          <h3>Εισαγωγή Πόντων</h3>
          <div className="input-form">
            <input
              type="text"
              id="points"
              onChange={(e) => {
                setAmountCashed(e.target.value);
              }}
            ></input>
          </div>
          <br></br>
          <br></br>
          <button
            className="btn"
            style={{ marginTop: "12px" }}
            onClick={cashOut}
          >
            {" "}
            Εξαργύρωση
          </button>
          {failedCashOut && (
            <h1 style={{ color: "red" }}>Error:{failedCashOut}</h1>
          )}
        </div>
        {enterIsOpen && (
          <AddCreditCard
            onClick={closeEnterHandler}
            jwt={props.jwt}
            userID={props.userID}
          ></AddCreditCard>
        )}
        {enterIsOpen && <Backdrop onCancel={closeEnterHandler} />}
      </div>
    </div>
  );
}

export default PointsManagement;
