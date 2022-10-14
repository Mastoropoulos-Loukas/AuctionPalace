import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import AuctionCardAdmin from "./cards/AuctionCardAdmin";

function AdminViewAuctionsPage(props) {
  const [auctions, setAuctions] = useState([]); // oles oi dimoprasies

  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(Infinity);

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
    if (props.jwt && props.ustatus === "admin") {
      fetch(
        `https://localhost:8070/admin/items?pageNumber=${pageNum}&pageSize=10 `,
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
            throw Error("Server error at fetch auctions!");
          }
        })
        .then((data) => {
          setAuctions(data.page);
          setTotalPages(data.total_pages);
        })
        .catch((err) => {
          setFailed(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, [pageNum]);



  return (
    <div>
      <h1>Δημοπρασίες</h1>
      <div className="flexbox">
        <div className="filters-section">
          <br></br>
          <Link to="/admin/users">
            <button className="btn btn--alt"> Χρήστες </button>
          </Link>
          <br></br>
          <br></br>
          <Link to="/admin/approvals">
            <button className="btn btn--alt"> Αιτήσεις Εγγραφής </button>
          </Link>
          <br></br> <br></br>
          <Link to="/admin/auctions">
            <button className="btn btn--alt"> Δημοπρασίες </button>
          </Link>
          <br></br>
        </div>
        {failed && <h1>Error occured:{failed}</h1>}
        {!failed && (
          <>
            {" "}
            <div className="auction-list">
              {auctions.map((auction) => (
                <AuctionCardAdmin
                  jwt={props.jwt}
                  key={auction.id}
                  item_id={auction.id}
                  seller={auction.seller_username}
                  currently={auction.currently}
                  buy_now={auction.buy_now}
                  minutes_remaining={auction.minutes_remaining}
                  name={auction.name}
                ></AuctionCardAdmin>
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
            {auctions.length !== 0 && (
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

export default AdminViewAuctionsPage;
