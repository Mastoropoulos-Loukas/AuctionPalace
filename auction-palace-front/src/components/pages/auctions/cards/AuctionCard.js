import { useEffect, useState } from "react";
import {
  FaHandshake as HandShake,
  FaCalendar as Calendar,
  FaLocationArrow as Location,
  FaDollarSign as Price,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { secondsToDhms } from "../../../../util/secondsToDhms";

function AuctionCard({ jwt, id, setViewAuctionID }) {
  const [info, setInfo] = useState({
    id: -7777,
    name: "AuctionTest",
    starts: "2052-05-01T04:36:00",
    ends: "2052-08-21T06:28:16",
    first_bid: 200,
    location: "Dumbville 22",
    country: "Utopia",
    seller_username: "TheBestSeller",
    minutes_remaining: 4568,
    currently: 230,
    buy_now: 560,
    winning: true,
    descritpion:
      "lorem lorem ipsum pisp lorem lorem ipsum pisp lorem lorem ipsum pisp lorem lorem ipsum pisp lorem lorem ipsum pisp lorem lorem ipsum pisp ",
  });

  const [failed, setFailed] = useState(null);

  const navigate = useNavigate();

  function viewMore() {
    setViewAuctionID(id);
    navigate("/auctioninfo");
  }

  useEffect(() => {
    if (jwt && id && id !== -7777) {
      fetch(`https://localhost:8070/search/item/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            return response.json();
          } else {
            throw Error("Failed to Fetch Info!");
          }
        })
        .then((data) => {
          setInfo(data);
        })
        .catch((err) => {
          setFailed(err.message);
        });
    }
  }, []);



  return (
    <div className="auction-card">
      {failed && <h3 style={{ color: "red" }}>Error:{failed}</h3>}
      {!failed && (
        <>
          {" "}
          <h3>{info.name}</h3>
          <p>
            <Calendar></Calendar> {secondsToDhms(info.minutes_remaining * 60)}
          </p>
          <p>
            <Location></Location>
            {info.location},{info.country}
          </p>
          <p>
            <Price></Price>
            {info.currently} ποντοι
          </p>
          <p>
            <HandShake></HandShake>
            {info.buy_now} ποντοι
          </p>
          <button className="btn" onClick={viewMore}>
            ΔΕΣ ΤΗΝ
          </button>
        </>
      )}
    </div>
  );
}

export default AuctionCard;
