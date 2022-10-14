import { useEffect, useState } from "react";
import { FaClock as Clock, FaStar as Star } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { formatDates } from "../../../util/formatDates";
import { secondsToDhms } from "../../../util/secondsToDhms";

function ViewAuction({ viewAuctionID, jwt, setUbalance }) {
  const [bidAmount, setBidAmount] = useState(0); // to poso poy tha ginei bid
  const [sellerRating, setSellerRating] = useState(0); // to rating toy seller
  const [winner, setWinner] = useState(false); // an nikaei o bidder poy vlepei ti dimoprasia

  const [info, setInfo] = useState({
    id: 7777,
    name: "AuctionTest",
    starts: "2052-05-01T04:36:00",
    ends: "2052-08-21T06:28:16",
    first_bid: 200,
    location: "Dumbville 22",
    country: "Utopia",
    seller_username: "TheBestSeller",
    minutes_remaining: 4568 * 60,
    currently: 230,
    buy_now: 560,
    winning: true,
    descritpion:
      "lorem lorem ipsum pisp lorem lorem ipsum pisp lorem lorem ipsum pisp lorem lorem ipsum pisp lorem lorem ipsum pisp lorem lorem ipsum pisp ",
  }); // Oi plirofories toy antikeimenoy

  const navigate = useNavigate();

  const [failedBuy, setFailedBuy] = useState(null);
  const [failedItem, setFailedItem] = useState(null);
  const [failedWinner, setFailedWinner] = useState(null);
  const [failedSeen, setFailedSeen] = useState(null);

  useEffect(() => {
    if (jwt) {
    } else {
      navigate("/welcome");
    }
  }, []);

  function buy(e) {
    e.preventDefault();
    if (jwt && bidAmount > 0 && viewAuctionID) {
      fetch(
        `https://localhost:8070/users/bid/${viewAuctionID}?amount=${bidAmount}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setFailedBuy(null);
            fetch("https://localhost:8070/users/quick_login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
            })
              .then((response) => {
                if (response.status === 200) {
                  setFailedBuy(null);
                  return response.json();
                } else {
                  throw Error("Failed to Buy Item!");
                }
              })
              .then((data) => {
                setUbalance(data.balance);
              })
              .catch((err) => {
                setFailedBuy(err.message);
              });

            navigate("/mybids");
          } else {
            throw Error("Failed to Buy Item!");
          }
        })
        .catch((err) => {
          setFailedBuy(err.message);
        });
    }
  }

  function instantBuy(e) {
    e.preventDefault();
    if (jwt && viewAuctionID) {
      fetch(`https://localhost:8070/users/buy_now/${viewAuctionID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedBuy(null);
            fetch("https://localhost:8070/users/quick_login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
            })
              .then((response) => {
                if (response.status === 200) {
                  setFailedBuy(null);
                  return response.json();
                } else {
                  throw Error("Failed to Buy Item!");
                }
              })
              .then((data) => {
                setUbalance(data.balance);
              })
              .catch((err) => {
                setFailedBuy(err.message);
              });

            navigate("/mybids");
          } else {
            throw Error("Failed to Buy Item!");
          }
        })
        .catch((err) => {
          setFailedBuy(err.message);
        });
    }
  }

  useEffect(() => {
    if (jwt && viewAuctionID) {
      fetch(`https://localhost:8070/search/item/${viewAuctionID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedItem(null);
            return response.json();
          } else {
            throw Error("Failed to Fetch Item's Info!");
          }
        })
        .then((data) => {
          setSellerRating(data.seller_rating);
          setInfo(data);
        })
        .catch((err) => {
          setFailedItem(err.message);
        });

      fetch(`https://localhost:8070/users/winning_item/${viewAuctionID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedWinner(null);
            return response.json();
          } else {
            throw Error("Failed to Get Winner!");
          }
        })
        .then((data) => {
          setWinner(data);
        })
        .catch((err) => {
          setFailedWinner(err.message);
        });

      fetch(`https://localhost:8070/users/visit/${viewAuctionID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedSeen(null);
            return response.json();
          } else if(response.status !==200 && response.status!==400) {
            throw Error("Failed to See Item!");
          }
        })
        .then((data) => {
        })
        .catch((err) => {
          setFailedSeen(err.message);
        });
    }
  }, []);

  return (
    <div className="view-auction">
      {failedItem && <h1 style={{ color: "red" }}>Error:{failedItem}</h1>}
      {!failedItem && (
        <>
          {" "}
          <div className="auction-info">
          {failedSeen && <h1 style={{ color: "red" }}>Error:{failedSeen}</h1>}
            <h1>{info.name}</h1>
            <h3>Ημερομηνια εκκινησης</h3>
            <p>{formatDates(info.starts)}</p>

            <h3>Ημερομηνία λήξης</h3>
            <p>{formatDates(info.ends)}</p>

            <h3>Αρχική Τιμή</h3>
            <p>{info.first_bid} ΠΟΝΤΟΙ</p>

            <h3>Τοποθεσία</h3>
            <p>{info.location}</p>

            <h3>Χώρα</h3>
            <p>{info.country}</p>

            <h3>{info.seller_username}</h3>
            <p>
              {" "}
              {sellerRating.toFixed(2)}/5{" "}
              <Star style={{ color: "goldenrod" }}></Star>
            </p>
          </div>
          <div>
            <div className="info-for-buyer">
              <h3>
                Υπολοιπόμενος Χρόνος: <br></br>{" "}
                <p>
                  <Clock></Clock> {secondsToDhms(info.minutes_remaining * 60)}
                </p>{" "}
              </h3>

              <h3>
                Τρέχουσα Προσφορά: <p>{info.currently} ΠΟΝΤΟΙ</p>
              </h3>
              <h3>
                Αγορά Τώρα: <p>{info.buy_now} ΠΟΝΤΟΙ</p>
              </h3>
              {failedWinner && (
                <h1 style={{ color: "red" }}>Error:{failedWinner}</h1>
              )}
              {!failedWinner && (
                <>
                  {" "}
                  <h3>
                    Κατάσταση:{" "}
                    {winner ? (
                      <p style={{ color: "green" }}> Κέρδιζεις</p>
                    ) : (
                      <p style={{ color: "red" }}>Χάνεις</p>
                    )}
                  </h3>
                </>
              )}
            </div>
            <div className="pleio">
              {" "}
              <form>{" "}
              <div className="input-form">
                {" "}
                <label htmlFor="bid-points">Πόντοι για πλειδότηση </label>
                <input
                  type="number"
                  id="bid-points"
                  required="required"
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                  }}
                ></input>
              </div>
              <button className="btn" type="submit" onClick={buy}>
                {" "}
                ΠΛΕΙΟΔΟΤΗΣΗ
              </button>
              {failedBuy && <h1 style={{ color: "red" }}>Error:{failedBuy}</h1>}
              <button className="btn " type="button" onClick={instantBuy}>
                ΑΓΟΡΑ ΤΩΡΑ
              </button>
              {failedBuy && <h1 style={{ color: "red" }}>Error:{failedBuy}</h1>}
              </form>
            </div>
            <div className="auction-descr">
              <h2>Περιγραφή</h2>
              <p>{info.descritpion}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewAuction;
