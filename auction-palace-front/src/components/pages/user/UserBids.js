import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import BidCard from "../auctions/cards/BidCard";

function UserBids(props) {
  const [myBids, setMyBids] = useState([
    {
      item_id: 1,
      buy_now: 700,
      currently: 100,
      minutes_remaining: -7000,
      winning: true,
    },
    {
      item_id: 2,
      buy_now: 800,
      currently: 100,
      minutes_remaining: -7000,
      winning: false,
    },
    {
      item_id: 3,
      buy_now: 300,
      currently: 100,
      minutes_remaining: -7000,
      winning: false,
    },
    {
      item_id: 4,
      buy_now: 700,
      currently: 100,
      minutes_remaining: -7000,
      winning: true,
    },
  ]); // ta bids toy xristi se olokliromenes dimoprasies

  const [nowBids, setNowBids] = useState([
    {
      item_id: 1,
      buy_now: 700,
      currently: 100,
      minutes_remaining: 7000,
      winning: true,
    },
    {
      item_id: 2,
      buy_now: 800,
      currently: 100,
      minutes_remaining: 7000,
      winning: false,
    },
    {
      item_id: 3,
      buy_now: 300,
      currently: 100,
      minutes_remaining: 7000,
      winning: false,
    },
    {
      item_id: 4,
      buy_now: 700,
      currently: 100,
      minutes_remaining: 7000,
      winning: true,
    },
  ]); // ta bids toy xristi se ongoing dimoprasies (poy den exoyn teleiosei)

  const [pageNumCompl, setPageNumCompl] = useState(1); // diaforetika pageNum kai totalPages gia ta completed kai ongoing
  const [totalComplPages, setTotalComplPages] = useState(Infinity);

  const [pageNumOngo, setPageNumOngo] = useState(1);
  const [totalOngoPages, setTotalOngoPages] = useState(Infinity);

  const [failedCom, setFailedCom] = useState(null);
  const [failedOngo, setFailedOngo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.jwt) {
      fetch(
        `https://localhost:8070/users/bids/completed?pageNumber=${pageNumCompl}&pageSize=8`,
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
            setFailedCom(null);
            return response.json();
          } else {
            throw Error("Failed to fetch Completed!");
          }
        })
        .then((data) => {
          setMyBids(data.page);
          setTotalComplPages(data.total_pages);
        })
        .catch((err) => {
          setFailedCom(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, [pageNumCompl]);

  useEffect(() => {
    if (props.jwt) {
      fetch(
        `https://localhost:8070/users/bids/ongoing?pageNumber=${pageNumOngo}&pageSize=8`,
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
            setFailedOngo(null);
            return response.json();
          } else {
            throw Error("Failed to fetch Ongoing!");
          }
        })
        .then((data) => {
          setNowBids(data.page);
          setTotalOngoPages(data.total_pages);
        })
        .catch((err) => {
          setFailedOngo(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, [pageNumOngo]);

  function previousComplPage() {
    if (pageNumCompl > 1) {
      setPageNumCompl(pageNumCompl - 1);
    }
  }

  function nextComplPage() {
    if (pageNumCompl < totalComplPages) {
      setPageNumCompl(pageNumCompl + 1);
    }
  }

  function previousOngoPage() {
    if (pageNumOngo > 1) {
      setPageNumOngo(pageNumOngo - 1);
    }
  }

  function nextOngoPage() {
    if (pageNumOngo < totalOngoPages) {
      setPageNumOngo(pageNumOngo + 1);
    }
  }

  return (
    <div>
      <h1>Οι πλειοδοτήσεις μου</h1>
      <div>
        <h2>Τρέχουσες</h2>
        {failedOngo && <h3 style={{ color: "red" }}>Error:{failedOngo}</h3>}
        {!failedOngo && (
          <>
            {" "}
            <div className="flexbox">
              {" "}
              {!nowBids.length ? (
                <h3 style={{ textAlign: "center" }}>
                  Δεν συμμετέχεις σε κάποια Δημοπρασία
                </h3>
              ) : (
                nowBids.map((bid) => (
                  <BidCard
                    key={bid.item_id}
                    item_id={bid.item_id}
                    buy_now={bid.buy_now}
                    minutes_remaining={bid.minutes_remaining}
                    currently={bid.currently}
                    winning={bid.winning}
                    jwt={props.jwt}
                    setViewAuctionID={props.setViewAuctionID}
                    setUbalance={props.setUbalance}
                  ></BidCard>
                ))
              )}
            </div>
            {nowBids.length !== 0 && (
              <div style={{ margin: "5px" }}>
                {" "}
                <FaArrowLeft
                  className="nav-arrow"
                  onClick={previousOngoPage}
                ></FaArrowLeft>{" "}
                {pageNumOngo}/{totalOngoPages}{" "}
                <FaArrowRight
                  className="nav-arrow"
                  onClick={nextOngoPage}
                ></FaArrowRight>
              </div>
            )}
          </>
        )}
      </div>
      <div>
        <h2>Ολοκληρωμένες</h2>
        {failedCom && <h3 style={{ color: "red" }}>Error:{failedCom}</h3>}
        {!failedCom && (
          <>
            {" "}
            <div className="flexbox">
              {!myBids.length ? (
                <h3 style={{ textAlign: "center" }}>
                  Δεν συμμετέχεις σε κάποια Δημοπρασία
                </h3>
              ) : (
                myBids.map((bid) => (
                  <BidCard
                    key={bid.item_id}
                    item_id={bid.item_id}
                    currently={bid.currently}
                    buy_now={bid.buy_now}
                    minutes_remaining={bid.minutes_remaining}
                    seller_rating={bid.seller_rating}
                    winning={bid.winning}
                    jwt={props.jwt}
                  ></BidCard>
                ))
              )}
              {}
            </div>
            {myBids.length !== 0 && (
              <div style={{ margin: "5px" }}>
                {" "}
                <FaArrowLeft
                  className="nav-arrow"
                  onClick={previousComplPage}
                ></FaArrowLeft>{" "}
                {pageNumCompl}/{totalComplPages}{" "}
                <FaArrowRight
                  className="nav-arrow"
                  onClick={nextComplPage}
                ></FaArrowRight>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserBids;
