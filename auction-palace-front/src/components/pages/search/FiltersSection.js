import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FiltersSection({
  jwt,
  setSearchMaxPrice,
  setSearchCategories,
  setSearchLocation,
  searchText,
  searchMaxPrice,
  searchLocation,
  setTotalPages,
  setSearchResults,
  pageNum,
}) {
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
  ]); // oles oi diathesimes katigories tis vasis

  const [auctionCat1, setAuctionCat1] = useState(""); // i 1h katigoria toy filter
  const [auctionCat2, setAuctionCat2] = useState(""); // i 2h katigoria toy filter
  const [auctionCat3, setAuctionCat3] = useState(""); // i 3h katigoria toy filter

  const [failedCats, setFailedCats] = useState(null);
  const [failedFilter, setFailedFilter] = useState(null);

  const navigate = useNavigate();

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
            throw Error("Failed to get Categories!");
          }
        })
        .then((data) => {
          setCategories(data);
        })
        .catch((err) => {
          setFailedCats(err.message);
        });
    }
  }, []);

  function filter(e) {
    e.preventDefault();
    const cats = [auctionCat1, auctionCat2, auctionCat3];
    setSearchCategories(cats); // thetoyme tis search katigories se aytes poy ftiaksame apo pano

    if (jwt) {
      if (
        auctionCat1.length === 0 &&
        auctionCat2.length === 0 &&
        auctionCat3.length === 0 &&
        searchLocation.length === 0 &&
        searchMaxPrice.length === 0
      ) {
        fetch(
          `https://localhost:8070/search/?pageNumber=${pageNum}&ignore_time=0&pageSize=10&text=${searchText}`,
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
              setFailedFilter(null);
              return response.json();
            } else {
              throw Error("Failed to Filter!");
            }
          })
          .then((data) => {
            setTotalPages(data.total_pages);
            setSearchResults(data.page);
            navigate("/search");
          })
          .catch((err) => {
            setFailedFilter(err.message);
          });
      } else if (
        auctionCat1.length === 0 &&
        auctionCat2.length === 0 &&
        auctionCat3.length === 0 &&
        (searchMaxPrice.length !== 0 || searchLocation.length !== 0)
      ) {
        fetch(
          `https://localhost:8070/search/?pageNumber=${pageNum}&ignore_time=0&pageSize=10&text=${searchText}&max_price=${searchMaxPrice}&location=${searchLocation}`,
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
              setFailedFilter(null);
              return response.json();
            } else {
              throw Error("Failed to Filter!");
            }
          })
          .then((data) => {
            setTotalPages(data.total_pages);
            setSearchResults(data.page);
            navigate("/search");
          })
          .catch((err) => {
            setFailedFilter(err.message);
          });
      } else {
        fetch(
          `https://localhost:8070/search/?pageNumber=${pageNum}&ignore_time=0&pageSize=10&text=${searchText}&max_price=${searchMaxPrice}&location=${searchLocation}&categories=${auctionCat1}, ${auctionCat2}, ${auctionCat3}`,
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
              setFailedFilter(null);
              return response.json();
            } else {
              throw Error("Failed to Filter!");
            }
          })
          .then((data) => {
            setTotalPages(data.total_pages);
            setSearchResults(data.page);
            navigate("/search");
          })
          .catch((err) => {
            setFailedFilter(err.message);
          });
      }
    }
  }





  return (
    <div>
      <form>
        <div className="input-form">
          <h2>Μέγιστη Τιμή </h2>
          <input
            type="text"
            id="maxprice"
            onChange={(e) => {
              setSearchMaxPrice(e.target.value);
            }}
          ></input>
        </div>
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
                value={auctionCat1}
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
                value={auctionCat2}
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
                value={auctionCat3}
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
        <br></br>
        <div className="input-form">
          <h2>Τοποθεσία </h2>
          <input
            type="text"
            id="location"
            onChange={(e) => {
              setSearchLocation(e.target.value);
            }}
          ></input>
        </div>
        <div className="center">
          {" "}
          <input
            type="button"
            className="btn"
            value="Αναζήτηση"
            onClick={filter}
          ></input>

        </div>
        {failedFilter && <h1 style={{ color: "red" }}>Error:{failedFilter}</h1> }
      </form>
    </div>
  );
}

export default FiltersSection;
