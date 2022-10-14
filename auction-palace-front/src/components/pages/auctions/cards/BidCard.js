import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { secondsToDhms } from "../../../../util/secondsToDhms";

function BidCard({
  item_id,
  buy_now,
  minutes_remaining,
  currently,
  winning,
  seller_rating,
  jwt,
  setViewAuctionID,
  setUbalance,
}) {
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
  });

  const [failedRate, setFailedRate] = useState(null);
  const [failedBn, setFailedBn] = useState(null);
  const [failedInfo, setFailedInfo] = useState(null);

  const navigate = useNavigate();

  function viewMore() {
    setViewAuctionID(item_id);
    navigate("/auctioninfo");
  }

  function oneStarRate() {
    if (jwt && winning && item_id) {
      fetch(`https://localhost:8070/users/rate/seller/${item_id}?rating=1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedRate(null);
            window.location.reload();
          } else if (response.status === 400) {
            throw Error("Already Rated User!");
          } else {
            throw Error("Failed to Rate");
          }
        })
        .catch((err) => {
          setFailedRate(err.message);
        });
    }
  }

  function twoStarRate() {
    if (jwt && winning && item_id) {
      fetch(`https://localhost:8070/users/rate/seller/${item_id}?rating=2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedRate(null);
            window.location.reload();
          } else if (response.status === 400) {
            throw Error("Already Rated User!");
          } else {
            throw Error("Failed to Rate");
          }
        })
        .catch((err) => {
          setFailedRate(err.message);
        });
    }
  }

  function threeStarRate() {
    if (jwt && winning && item_id) {
      fetch(`https://localhost:8070/users/rate/seller/${item_id}?rating=3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedRate(null);
            window.location.reload();
          } else if (response.status === 400) {
            throw Error("Already Rated User!");
          } else {
            throw Error("Failed to Rate");
          }
        })
        .catch((err) => {
          setFailedRate(err.message);
        });
    }
  }

  function fourStarRate() {
    if (jwt && winning && item_id) {
      fetch(`https://localhost:8070/users/rate/seller/${item_id}?rating=4`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedRate(null);
            window.location.reload();
          } else if (response.status === 400) {
            throw Error("Already Rated User!");
          } else {
            throw Error("Failed to Rate");
          }
        })
        .catch((err) => {
          setFailedRate(err.message);
        });
    }
  }

  function fiveStarRate() {
    if (jwt && winning && item_id) {
      fetch(`https://localhost:8070/users/rate/seller/${item_id}?rating=5`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedRate(null);
            window.location.reload();
          } else if (response.status === 400) {
            throw Error("Already Rated User!");
          } else {
            throw Error("Failed to Rate");
          }
        })
        .catch((err) => {
          setFailedRate(err.message);
        });
    }
  }

  function instantBuy() {
    if (jwt && item_id) {
      fetch(`https://localhost:8070/users/buy_now/${item_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedBn(null);
            fetch("https://localhost:8070/users/quick_login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
            })
              .then((response) => {
                if (response.status === 200) {
                  setFailedBn(null);
                  return response.json();
                } else {
                  throw Error("Failed to BuyNow!");
                }
              })
              .then((data) => {
                setUbalance(data.balance);
              })
              .catch((err) => {
                setFailedBn(err.message);
              });

            window.location.reload();
          } else {
            throw Error("Failed to BuyNow!");
          }
        })
        .catch((err) => {
          setFailedBn(err.message);
        });
    }
  }

  useEffect(() => {
    if (jwt && item_id) {
      fetch(`https://localhost:8070/search/item/${item_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedInfo(null);
            return response.json();
          } else {
            throw Error("Failed to Fetch Info!");
          }
        })
        .then((data) => {
          setInfo(data);
        })
        .catch((err) => {
          setFailedInfo(err.message);
        });
    }
  }, []);

  const time_Left = secondsToDhms(minutes_remaining * 60);

  return (
    <div className="bid-card">
      {failedRate && <h3 style={{ color: "red" }}>Error:{failedRate}</h3>}
      {failedBn && <h3 style={{ color: "red" }}>Error:{failedBn}</h3>}
      {failedInfo && <h3 style={{ color: "red" }}>Error:{failedInfo}</h3>}
      {!failedInfo && (
        <>
          {" "}
          <h3>{info.name}</h3>
          {minutes_remaining <= 0 ? (
            <>
              {" "}
              <h4>Τελική Προσφορά</h4>
              <p>{currently}</p>
              <h4>Κατάσταση</h4>
              {winning ? (
                <p style={{ color: "green" }}> Κέρδισες</p>
              ) : (
                <p style={{ color: "red" }}> Έχασες</p>
              )}
              {!seller_rating && winning && (
                <>
                  {" "}
                  <h4>Αξιολόγησε</h4>
                  <FaStar
                    className="rate-star"
                    onClick={oneStarRate}
                  ></FaStar>{" "}
                  <FaStar className="rate-star" onClick={twoStarRate}></FaStar>{" "}
                  <FaStar
                    className="rate-star"
                    onClick={threeStarRate}
                  ></FaStar>
                  <FaStar className="rate-star" onClick={fourStarRate}></FaStar>
                  <FaStar className="rate-star" onClick={fiveStarRate}></FaStar>
                </>
              )}
              {seller_rating && winning ? (
                <>
                  <h4>Η αξιολόγησή μου</h4>
                  <p>
                    {seller_rating}/5{" "}
                    <FaStar style={{ color: "goldenrod" }}></FaStar>
                  </p>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {" "}
              <h4>Υπολοιπόμενος Χρόνος</h4>
              <p>{time_Left}</p>
              <h4>Μέγιστη Τρέχουσα Προσφορά</h4>
              <p>{currently}</p>
              <h4>Τιμή για Αγορά Τώρα</h4>
              <p>{buy_now}</p>
              <h4>Κατάσταση</h4>
              {winning ? (
                <p style={{ color: "green" }}> Κέρδιζεις</p>
              ) : (
                <p style={{ color: "red" }}> Χάνεις</p>
              )}
              <button className="btn" onClick={viewMore}>
                {" "}
                Δες την
              </button>
              <button className="btn" onClick={instantBuy}>
                {" "}
                Αγορά Τώρα
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default BidCard;
