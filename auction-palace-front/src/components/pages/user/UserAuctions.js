import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import SellerAuctionCard from "../auctions/cards/SellerAuctionCard";

function UserAuctions({
  jwt,
  userID,
  setEdit,
  setAuctionIDEdit,
  setAuctionItemID,
}) {
  const [completedAuctions, setCompletedAuctions] = useState([]); // oi olokliromenes dimoprasies toy xristi san seller

  const [ongoingAuctions, setOngoingAuctions] = useState([]); // oi ongoing dimoprasies toy xristi san seller

  const [pageNumCompl, setPageNumCompl] = useState(1); // diaforetika pageNum kai totalPages gia tis ongoing kai completed
  const [totalComplPages, setTotalComplPages] = useState(Infinity);

  const [pageNumOngo, setPageNumOngo] = useState(1);
  const [totalOngoPages, setTotalOngoPages] = useState(Infinity);

  const [failedCom, setFailedCom] = useState(null);
  const [failedOngo, setFailedOngo] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    setAuctionIDEdit("");
    if (jwt) {
      fetch(
        `https://localhost:8070/users/items/completed?pageNumber=${pageNumCompl}&pageSize=8`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
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
          setTotalComplPages(data.total_pages);
          setCompletedAuctions(data.page);
        })
        .catch((err) => {
          setFailedOngo(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, [pageNumCompl]);

  useEffect(() => {
    if (jwt) {
      fetch(
        `https://localhost:8070/users/items/ongoing?pageNumber=${pageNumOngo}&pageSize=8`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setFailedOngo(null);
            return response.json();
          } else {
            throw Error("Failed to Fetch Ongoing!");
          }
        })
        .then((data) => {
          setTotalOngoPages(data.total_pages);
          setOngoingAuctions(data.page);
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
      <h1>Οι δημοπρασίες μου </h1>
      <Link to="/newauction">
        {" "}
        <button className="btn"> Νέα Δημοπρασία</button>
      </Link>

      <div>
        {" "}
        <h2>Τρέχουσες</h2>
        {failedOngo && <h3 style={{ color: "red" }}>Error:{failedOngo}</h3>}
        {!failedOngo && (
          <>
            {" "}
            <div className="flexbox">
              {" "}
              {!ongoingAuctions.length ? (
                <h3 style={{ textAlign: "center" }}>
                  Δεν έχεις κάποια δημοπρασία σε εξέλιξη
                </h3>
              ) : (
                ongoingAuctions.map((mappedCompleted) => (
                  <SellerAuctionCard
                    key={mappedCompleted.item_id}
                    item_id={mappedCompleted.item_id}
                    minutes_remaining={mappedCompleted.minutes_remaining}
                    buy_now={mappedCompleted.buy_now}
                    currently={mappedCompleted.currently}
                    ending={mappedCompleted.ending}
                    editable={mappedCompleted.editable}
                    jwt={jwt}
                    setEdit={setEdit}
                    setAuctionIDEdit={setAuctionIDEdit}
                    setAuctionItemID={setAuctionItemID}
                  ></SellerAuctionCard>
                ))
              )}
            </div>
            {ongoingAuctions.length !== 0 && (
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
        {" "}
        <h2>Ολοκληρωμένες</h2>
        {failedCom && <h3 style={{ color: "red" }}>Error:{failedCom}</h3>}
        {!failedCom && (
          <>
            {" "}
            <div className="flexbox">
              {" "}
              {!completedAuctions.length ? (
                <h3 style={{ textAlign: "center" }}>
                  Δεν έχεις ολοκληρώσει κάποια δημοπρασία
                </h3>
              ) : (
                completedAuctions.map((mappedCompleted) => (
                  <SellerAuctionCard
                    key={mappedCompleted.item_id}
                    item_id={mappedCompleted.item_id}
                    minutes_remaining={mappedCompleted.minutes_remaining}
                    buy_now={mappedCompleted.buy_now}
                    currently={mappedCompleted.currently}
                    ending={mappedCompleted.ending}
                    bidder_rating={mappedCompleted.bidder_rating}
                    jwt={jwt}
                    userID={userID}
                    setAuctionItemID={setAuctionItemID}
                  ></SellerAuctionCard>
                ))
              )}
            </div>
            {completedAuctions.length !== 0 && (
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

export default UserAuctions;
