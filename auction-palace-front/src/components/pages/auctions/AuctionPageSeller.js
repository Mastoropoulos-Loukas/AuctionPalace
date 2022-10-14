import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { formatDates } from "../../../util/formatDates";
import { secondsToDhms } from "../../../util/secondsToDhms";
import AuctionPageSellerCard from "./cards/AuctionPageSellerCard";

function AuctionPageSeller({ jwt, item_id }) {
  const [auctionInfo, setAuctionInfo] = useState({
    item_id: 0,
    minutes_remaining: 700,
    currently: 333,
    buy_now: 777,
    userIDwinning: 134,
  }); // Oi plirofories tis dimoprasias

  const [bidsInfo, setBidsInfo] = useState([
    // {
    //   user_id: 890,
    //   date: "2022-09-07T13:13:13",
    //   amount: 1234,
    // },
    // {
    //   user_id: 891,
    //   date: "2022-09-07T13:13:13",
    //   amount: 1235,
    // },
    // {
    //   user_id: 892,
    //   date: "2022-09-07T13:13:13",
    //   amount: 1236,
    // },
    // {
    //   user_id: 893,
    //   date: "2022-09-07T13:13:13",
    //   amount: 1237,
    // },
  ]); // Ola ta bids poy exoyn ginei gia ayto to antikeimeno

  const navigate = useNavigate();

  const [userWinning, setUserWinning] = useState(null); // o xristis poy kerdizei se ayti ti dimoprasia

  const [failedInfo, setFailedInfo] = useState(null);
  const [failedWinnig, setFailedWinning] = useState(null);
  const [failedBids, setFailedBids] = useState(null);

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
            throw Error("Failed to fetch Info!");
          }
        })
        .then((data) => {
          setAuctionInfo(data);
        })
        .catch((err) => {
          setFailedInfo(err.message);
        });

      fetch(`https://localhost:8070/users/item/${item_id}/winning_user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedWinning(null);
            return response.json();
          } else {
            throw Error("Failed to Fetch Winner!");
          }
        })
        .then((data) => {
          setUserWinning(data.username);
        })
        .catch((err) => {
          setFailedWinning(err.message);
        });

      fetch(`https://localhost:8070/users/item/${item_id}/bids`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedBids(null);
            return response.json();
          } else {
            throw Error("Failed to Fetch Bids!");
          }
        })
        .then((data) => {
          setBidsInfo(data);
        })
        .catch((err) => {
          setFailedBids(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, []);

  return (
    <>
      {" "}
      {failedInfo && <p style={{ color: "red" }}>Error:{failedInfo}</p>}
      {!failedInfo && (
        <div>
          {" "}
          <h1>{auctionInfo.name}</h1>
          <div className="flexbox">
            {" "}
            <h3 style={{ marginLeft: "50px" }}>
              Υπολοιπόμενος Χρόνος:{" "}
              <p>
                {" "}
                <FaClock></FaClock>
                {secondsToDhms(auctionInfo.minutes_remaining * 60)}
              </p>
            </h3>
            <h3 style={{ marginLeft: "50px" }}>
              Τρέχουσα Προσφορά: <p> {auctionInfo.currently}</p>
            </h3>
            <h3 style={{ marginLeft: "50px" }}>
              Αγορά Τώρα: <p> {auctionInfo.buy_now}</p>
            </h3>
            <h3 style={{ marginLeft: "50px" }}>
              Χρήστης που κερδίζει: {failedWinnig && <p> - </p>}
              {!failedWinnig && (
                <> {userWinning ? <p>{userWinning}</p> : <p> - </p>}</>
              )}
            </h3>
          </div>
          {failedBids && <p style={{ color: "red" }}>Error:{failedBids}</p>}
          {!failedBids && (
            <>
              {bidsInfo.length > 0 && (
                <h1 style={{ marginTop: "50px" }}>
                  Όλες οι πλειοδοτήσεις για {auctionInfo.name}
                </h1>
              )}
              <div className="flexbox">
                {" "}
                {bidsInfo.length > 0 ? (
                  bidsInfo.map((bid) => (
                    <AuctionPageSellerCard
                      key={bid.bid_id}
                      username={bid.user_username}
                      date={formatDates(bid.date)}
                      amount={bid.amount}
                    ></AuctionPageSellerCard>
                  ))
                ) : (
                  <h2>
                    Δεν έχουν γίνει ακόμη προσφορές για το αντικείμενο "
                    {auctionInfo.name}"
                  </h2>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default AuctionPageSeller;
