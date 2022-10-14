import { useEffect, useState } from "react";
import { FaClock, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { secondsToDhms } from "../../../../util/secondsToDhms";

function SellerAuctionCard({
  item_id,
  minutes_remaining,
  buy_now,
  currently,
  ending,
  bidder_rating,
  jwt,
  editable,
  setEdit,
  setAuctionIDEdit,
  setAuctionItemID,
}) {
  const timeLeft = secondsToDhms(minutes_remaining * 60);

  const [name, setName] = useState("N/A");

  const [failedRate, setFailedRate] = useState(null);
  const [failedDelete, setFailedDelete] = useState(null);
  const [failedName, setFailedName] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt) {
    } else {
      navigate("/welcome");
    }
  }, []);

  function editAuction() {
    if (minutes_remaining > 0 && editable) {
      setEdit(true);
      setAuctionIDEdit(item_id);
      navigate("/newauction");
    }
  }

  function viewMore() {
    setAuctionItemID(item_id);
    navigate("/auctioninfoseller");
  }

  function oneStarRate() {
    if (jwt && item_id) {
      fetch(`https://localhost:8070/users/rate/bidder/${item_id}?rating=1`, {
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
    if (jwt && item_id) {
      fetch(`https://localhost:8070/users/rate/bidder/${item_id}?rating=2`, {
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
    if (jwt && item_id) {
      fetch(`https://localhost:8070/users/rate/bidder/${item_id}?rating=3`, {
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
    if (jwt && item_id) {
      fetch(`https://localhost:8070/users/rate/bidder/${item_id}?rating=4`, {
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
    if (jwt && item_id) {
      fetch(`https://localhost:8070/users/rate/bidder/${item_id}?rating=5`, {
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

  function deleteAuction() {
    if (jwt && item_id) {
      fetch(`https://localhost:8070/users/item/${item_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedDelete(null);
            window.location.reload();
          } else {
            throw Error("Failed to Delete!");
          }
        })
        .catch((err) => {
          setFailedDelete(err.message);
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
            setFailedName(null);
            return response.json();
          } else {
            throw Error("Failed to Fecth name!");
          }
        })
        .then((data) => {
          setName(data.name);
        })
        .catch((err) => {
          setFailedName(err.message);
        });
    }
  }, []);

  return (
    <div className="bid-card">
      {failedRate && <h3 style={{ color: "red" }}>Error:{failedRate}</h3>}
      {failedDelete && <h3 style={{ color: "red" }}>Error:{failedDelete}</h3>}
      {failedName && <h3 style={{ color: "red" }}>Error:{failedName}</h3> }
      {!failedName && (
        <>
          <h3>{name}</h3>
          {minutes_remaining <= 0 && (
            <>
              <h3>Τελική Τιμή</h3>
              <p>{currently}</p>
              <h3>Τιμή για Αγορά Τώρα</h3>
              <p>{buy_now}</p>
              <h3>Τύπος</h3>
              {ending === 0 && <p>Πλειοδότηση</p>}
              {ending === 1 && <p>Αγορά Τώρα</p>}
              {ending === 2 && <p>Δεν πωλήθηκε</p>}
              {ending > 2 && <></>}

              {(bidder_rating === 0 && (ending===0 || ending===1)) && (
                <>
                  {" "}
                  <h3> Αξιολόγησε</h3>
                  <p>
                    <FaStar
                      className="rate-star"
                      onClick={oneStarRate}
                    ></FaStar>
                    <FaStar
                      className="rate-star"
                      onClick={twoStarRate}
                    ></FaStar>
                    <FaStar
                      className="rate-star"
                      onClick={threeStarRate}
                    ></FaStar>
                    <FaStar
                      className="rate-star"
                      onClick={fourStarRate}
                    ></FaStar>
                    <FaStar
                      className="rate-star"
                      onClick={fiveStarRate}
                    ></FaStar>
                  </p>
                </>
              )}
              {bidder_rating !== 0 && (
                <>
                  {" "}
                  <h3>Η αξιολόγησή μου</h3>
                  <p>
                    {bidder_rating}/5{" "}
                    <FaStar style={{ color: "goldenrod" }}></FaStar>
                  </p>
                </>
              )}
            </>
          )}
          {minutes_remaining > 0 && !editable && (
            <>
              <h3>Υπολοιπόμενος Χρόνος</h3>{" "}
              <p>
                <FaClock></FaClock> {timeLeft}
              </p>
              <h3>Μέγιστη Τρέχουσα Προσφορά</h3> <p>{currently}</p>
              <h3>Τιμή για Αγορά Τώρα</h3> <p>{buy_now}</p>
              <button className="btn" onClick={viewMore}>
                {" "}
                Δες την
              </button>
            </>
          )}
          {minutes_remaining > 0 && editable && (
            <>
              <h3>Υπολοιπόμενος Χρόνος</h3>{" "}
              <p>
                <FaClock></FaClock> {timeLeft}
              </p>
              <h3>Μέγιστη Τρέχουσα Προσφορά</h3> <p>-</p>
              <h3>Τιμή για Αγορά Τώρα</h3> <p>{buy_now}</p>
              {editable && (
                <button className="btn" onClick={editAuction}>
                  Επεξεργασία
                </button>
              )}
              {
                <button className="btn" onClick={deleteAuction}>
                  {" "}
                  Διαγραφή
                </button>
              }
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SellerAuctionCard;
