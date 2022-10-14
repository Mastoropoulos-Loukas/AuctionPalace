import { useEffect, useState } from "react";
import React from "react";
import { FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CreateAuction({
  jwt,
  auctionIDEdit,
}) {
  const [info, setInfo] = useState({}); // oi plirofories tis dimoprasias, an prokeitai gia edit

  const [auctionName, setAuctionName] = useState(""); // to onoma tis dimoprasias/antikeimenoy
  const [auctionStarts, setAuctionStarts] = useState(""); // pote arxizei i dimoprasia
  const [auctionEnds, setAuctionEnds] = useState(""); // pote teleionei i dimoprasia
  const [auctionCat1, setAuctionCat1] = useState(""); // i katigoria 1 toy antikeimenoy
  const [auctionCat2, setAuctionCat2] = useState(""); // i katigoria 2 toy antikeimenoy
  const [auctionCat3, setAuctionCat3] = useState(""); // i katigoria 3 toy antikeimenoy
  const [auctionBuyNow, setAuctionBuyNow] = useState(0); // i buyNow timi toy antikeimenoy
  const [auctionFirstBid, setAuctionFirstBid] = useState(0); // i minimum timi toy antikeimenoy
  const [auctionText, setAuctionText] = useState(""); // i perigraphi toy anrikeimenoy
  const [auctionLocation, setAuctionLocation] = useState(""); // i topothesia toy anrikeimenoy
  const [auctionCountry, setAuctionCountry] = useState(""); // i xoratoy anrikeimenoy

  const [categories, setCategories] = useState([
    {
      category_id: 1,
      name: "Ρούχα",
      total_auctions: 700,
      min_price: 100,
      max_price: 1000,
    },
    {
      category_id: 2,
      name: "Παπούτσια",
      total_auctions: 700,
      min_price: 100,
      max_price: 1000,
    },
    {
      category_id: 3,
      name: "Είδη Υγιεινής",
      total_auctions: 700,
      min_price: 100,
      max_price: 1000,
    },
    {
      category_id: 4,
      name: "Αρχαία",
      total_auctions: 700,
      min_price: 100,
      max_price: 1000,
    },
    {
      category_id: 5,
      name: "Έπιπλα",
      total_auctions: 700,
      min_price: 100,
      max_price: 1000,
    },
    {
      category_id: 6,
      name: "Αυτοκίνητα",
      total_auctions: 700,
      min_price: 100,
      max_price: 1000,
    },
    {
      category_id: 7,
      name: "Κονσόλες",
      total_auctions: 700,
      min_price: 100,
      max_price: 1000,
    },
  ]); // oi diathesimes katigories poy yparxoyn stin vasi

  const [failedItem, setFailedItem] = useState(null);
  const [failedSubmit, setFailedSubmit] = useState(null);
  const [failedCats, setFailedCats] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && auctionIDEdit) {
      fetch(`https://localhost:8070/search/item/${auctionIDEdit}`, {
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
            throw Error("Failed to Fetch Item's Info");
          }
        })
        .then((data) => {
          setInfo(data);
          setAuctionName(data.name);
          setAuctionStarts(data.starts);
          setAuctionEnds(data.ends);
          setAuctionText(data.descritpion);
          setAuctionBuyNow(data.buy_now);
          setAuctionFirstBid(data.first_bid);
          setAuctionCountry(data.country);
          setAuctionLocation(data.location);
        })
        .catch((err) => {
          setFailedItem(err.message);
        });
    }
  }, []);



  function Coord(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  function submit(e) {
    e.preventDefault();
    
    const newAuction = {
      id: auctionIDEdit ? auctionIDEdit : "",
      name: auctionName,
      starts: auctionStarts,
      ends: auctionEnds,
      buy_now: auctionBuyNow,
      first_bid: auctionFirstBid,
      categories: [auctionCat1, auctionCat2, auctionCat3],
      location: auctionLocation,
      country: auctionCountry,
      latitude: Coord(35.01186, 41.50306), // random mexri na vro tropo na xrisimopoio to api
      longitude: Coord(19.91975, 28.2225),
      descritpion: auctionText,
    };

    if (jwt) {
      fetch(`https://localhost:8070/users/item/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(newAuction),
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedSubmit(null);
            navigate("/myauctions");
          } else {
            throw Error("Failed to Save Item!");
          }
        })
        .catch((err) => {
          setFailedSubmit(err.message);
        });
    } else {
      console.log("problem");
    }
  }

  useEffect(() => {
    if (jwt) {
      fetch("https://localhost:8070/search/categories_with_stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailedCats(null);
            return response.json();
          } else {
            throw Error("Failed to Fetch Categories!");
          }
        })
        .then((data) => {
          setCategories(data);
        })
        .catch((err) => {
          setFailedCats(err.message);
        });
    } else {
      navigate("/welcome");
    }
  }, []);

  return (
    <div className="registerForm">
      {failedSubmit && <h1 style={{ color: "red" }}>Error:{failedSubmit}</h1> }
      <h1> Στοιχεία Δημοπρασίας</h1>
      {!auctionIDEdit ? (
        <h2 style={{ color: "green" }}> Νέα Δημοπρασία</h2>
      ) : (
        <>
          {failedItem && <h1 style={{ color: "red" }}>Error:{failedItem}</h1>}
          {!failedItem && <h2> Επεξεργασία Δημοπρασίας: {info.name}</h2>}
        </>
      )}
      <form>
        <div className="auction">
          {" "}
          <div className="flexbox">
            <div className="input-form">
              {" "}
              <label htmlFor="name"> Όνομα Δημοπρασίας*</label>
              <input
                type="text"
                id="name"
                required="required"
                value={auctionName}
                placeholder={auctionName}
                minLength={1}
                onChange={(e) => {
                  setAuctionName(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="starts">
                Έναρξη*<FaCalendar></FaCalendar>
              </label>
              <input
                type="datetime-local"
                id="starts"
                required="required"
                value={auctionStarts}
                placeholder={auctionStarts}
                onChange={(e) => {
                  setAuctionStarts(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="ends">
                Λήξη*<FaCalendar></FaCalendar>
              </label>
              <input
                type="datetime-local"
                id="ends"
                required="required"
                value={auctionEnds}
                placeholder={auctionEnds}
                onChange={(e) => {
                  setAuctionEnds(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="firstBid">Τιμή Εκκίνησης</label>
              <input
                type="number"
                id="firstBid"
                min="0"
                value={auctionFirstBid}
                placeholder={auctionFirstBid}
                onChange={(e) => {
                  setAuctionFirstBid(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="buyNow">Αγορά Τώρα</label>
              <input
                type="number"
                id="buyNow"
                min="0"
                value={auctionBuyNow}
                placeholder={auctionBuyNow}
                onChange={(e) => {
                  setAuctionBuyNow(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className="flexbox">
            {failedCats && <h1 style={{ color: "red" }}>Error:{failedCats}</h1>}
            {!failedCats && (
              <>
                {" "}
                <div className="input-form">
                  {" "}
                  <h4>Κατηγορία 1</h4>
                  <select
                    id="cat1"
                    name="cat1"
                    onChange={(e) => {
                      setAuctionCat1(e.target.value);
                    }}
                  >
                    <option></option>
                    {categories.map((cat) => {
                      return <option key={cat.category_id}>{cat.name}</option>;
                    })}
                  </select>
                </div>
                <div className="input-form">
                  {" "}
                  <h4>Κατηγορία 2</h4>
                  <select
                    id="cat2"
                    name="cat2"
                    onChange={(e) => {
                      setAuctionCat2(e.target.value);
                    }}
                  >
                    <option></option>
                    {categories.map((cat) => {
                      return <option key={cat.category_id}>{cat.name}</option>;
                    })}
                  </select>
                </div>
                <div className="input-form">
                  {" "}
                  <h4>Κατηγορία 3</h4>
                  <select
                    id="cat3"
                    name="cat3"
                    onChange={(e) => {
                      setAuctionCat3(e.target.value);
                    }}
                  >
                    <option></option>
                    {categories.map((cat) => {
                      return <option key={cat.category_id}>{cat.name}</option>;
                    })}
                  </select>
                </div>
              </>
            )}

            <div className="input-form">
              {" "}
              <label htmlFor="location">Διεύθυνση*</label>
              <input
                type="text"
                id="location"
                value={auctionLocation}
                placeholder={auctionLocation}
                required="required"
                onChange={(e) => {
                  setAuctionLocation(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="country">Χώρα*</label>
              <input
                type="text"
                id="country"
                value={auctionCountry}
                placeholder={auctionCountry}
                required="required"
                onChange={(e) => {
                  setAuctionCountry(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className="flexbox">
            <div className="input-form">
              {" "}
              <label htmlFor="body">Περιγραφή</label>
              <textarea
                type="text"
                id="body"
                value={auctionText}
                placeholder={auctionText}
                rows="10"
                cols="100"
                onChange={(e) => {
                  setAuctionText(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="center">
          {" "}
          {/* <input type="submit" value="Αποθήκευση" onClick={submit}></input> */}
          <input type="button" value="Αποθήκευση" onClick={submit}></input>{" "}
          {/* ayto menei gia testing*/}
        </div>
      </form>
      *υποχρεωτικό πεδίο
    </div>
  );
}

export default CreateAuction;
