import CategoryCard from "./cards/CategoryCard";
import AuctionCard from "../auctions/cards/AuctionCard";

import {
  FaHandshake as HandShake,
  FaEnvelope as Folder,
  FaStar as Star,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage(props) {
  const [categories, setCategories] = useState([
    {
      category_id: 1,
      name: "Ρούχα",
      total_auctions: 700,
      min_price: 100,
      max_price: 1000,
    },
  ]); // oles oi katigories poy yparxoyn sti vasi

  const [recs, setRecs] = useState(null); // I protasi gia ton xristi

  const [newmes, setNewmes] = useState(0); // Ta nea mmnta poy exei o xristis
  const [part, setPart] = useState(0); // Se poses dimoprasies symmetexei
  const [win, setWin] = useState(0); // Se poses dimoprasies kerdizei
  const [ratebid, setRatebid] = useState(0.0); // To rating toy san bidder
  const [sellbid, setSellbid] = useState(0.0); // To rating toy san seller

  const [failed1, setFailed1] = useState(null);
  const [failed2, setFailed2] = useState(null);
  const [failed3, setFailed3] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.jwt && props.ustatus === "approved") {
      fetch("https://localhost:8070/users/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed1(null);
            return response.json();
          } else {
            throw Error("Failed to get User's Stats!");
          }
        })
        .then((data) => {
          setNewmes(data.total_unread_messages);
          setPart(data.total_auctions_participating);
          setWin(data.total_auctions_winning);
          setRatebid(data.average_buyer_rating);
          setSellbid(data.average_seller_rating);
        })
        .catch((err) => {
          setFailed1(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, []);

  useEffect(() => {
    if (props.jwt) {
      fetch("https://localhost:8070/search/categories_with_stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed2(null);
            return response.json();
          } else {
            throw Error("Failed to get Categories!");
          }
        })
        .then((data) => {
          setCategories(data);
        })
        .catch((err) => {
          setFailed2(err.message);
        });
    }
  }, []);

  useEffect(() => {
    if (props.jwt) {
      fetch("https://localhost:8070/users/recommend", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed3(null);
            return response.json();
          } else {
            throw Error("Failed to get Recommendations!");
          }
        })
        .then((data) => {
          setRecs(data);
        })
        .catch((err) => {
          setFailed3(err.message);
        });
    }
  }, []);


  return (
    <div className="homepage">
      <div className="categories">
        <h1>Κατηγορίες</h1>
        {failed2 && <h2 style={{ color: "red" }}>Error occured:{failed2}</h2>}
        {!failed2 && (
          <>
            {" "}
            <div className="container">
              <>
                {" "}
                {categories.length > 0 &&
                  categories.map((category) => (
                    <CategoryCard
                      key={category.category_id}
                      name={category.name}
                      cat_num={category.total_auctions}
                      min_bid={category.min_price}
                      max_bid={category.max_price}
                    ></CategoryCard>
                  ))}
              </>
            </div>
          </>
        )}
      </div>
      <div className="categories">
        <h1>Προτεινόμενα</h1>
        {failed3 && <h2 style={{ color: "red" }}>Error occured:{failed3}</h2>}
        <div  className="container" >
          {recs && (
            <AuctionCard
              id={recs.id}
              setViewAuctionID={props.setViewAuctionID}
              jwt={props.jwt}
            ></AuctionCard>
          )}
        </div>
      </div>
      <div className="synopsis">
        <h1>Σύνοψη</h1>
        {failed1 && <h2 style={{ color: "red" }}>Error occured:{failed1}</h2>}
        {!failed1 && (
          <>
            {" "}
            <p>
              {" "}
              <Folder style={{ color: "firebrick" }}></Folder>{" "}
              <span style={{ color: "firebrick" }}> {newmes} </span> Νέα
              Μηνύματα
            </p>
            <p>
              <HandShake style={{ color: "blue" }}></HandShake>
              <span style={{ color: "blue" }}> {part} </span> Δημοπρασίες που
              συμμετέχω{" "}
            </p>
            <p>
              <HandShake style={{ color: "green" }}></HandShake>
              <span style={{ color: "green" }}> {win} </span> Δημοπρασίες που
              κερδίζω
            </p>
            <p>
              <Star style={{ color: "goldenrod" }}></Star>
              <span style={{ color: "goldenrod" }}>
                {" "}
                {ratebid.toFixed(2)}{" "}
              </span>{" "}
              /5.00 Μέση Βαθμολογία σαν πλειοδότης
            </p>
            <p>
              <Star style={{ color: "goldenrod" }}></Star>
              <span style={{ color: "goldenrod" }}>
                {" "}
                {sellbid.toFixed(2)}{" "}
              </span>{" "}
              /5.00 Μέση Βαθμολογία σαν πωλητής
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
