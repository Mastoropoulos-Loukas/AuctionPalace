import FiltersSection from "./FiltersSection";
import AuctionCard from "../auctions/cards/AuctionCard";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function SearchResults({
  jwt,
  results,
  totalPages,
  pageNum,
  setPageNum,
  setSearchLocation,
  setSearchCategories,
  setSearchMaxPrice,
  searchText,
  searchMaxPrice,
  searchCategories,
  searchLocation,
  setViewAuctionID,
  setTotalPages,
  setSearchResults,
}) {
  const navigate = useNavigate();

  const [failed, setFailed] = useState(null);

  useEffect(() => {
    if (jwt) {
    } else {
      navigate("/welcome");
    }
  }, []);

  function previousPage() {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  }

  function nextPage() {
    if (pageNum < totalPages) {
      setPageNum(pageNum + 1);

      if (jwt) {
        if (
          searchText &&
          (searchMaxPrice > 0 ||
            searchLocation.length !== 0 ||
            searchCategories.length !== 0)
        ) {
          fetch(
            `https://localhost:8070/search/?pageNumber=${pageNum}&ignore_time=0&pageSize=10&text=${searchText}&max_price=${searchMaxPrice}&location=${searchLocation}&categories=${searchCategories[0].category_id}, ${searchCategories[1].category_id}, ${searchCategories[2].category_id}`,
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
                setFailed(null);
                return response.json();
              } else {
                throw Error("Failed to Search!");
              }
            })
            .then((data) => {
              setTotalPages(data.total_pages);
              setSearchResults(data.page);
            })
            .catch((err) => {
              setFailed(err.message);
            });
        } else if (
          searchText &&
          !(
            searchMaxPrice > 0 ||
            searchLocation.length !== 0 ||
            searchCategories.length !== 0
          )
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
                setFailed(null);
                return response.json();
              } else {
                throw Error("Failed to Search!");
              }
            })
            .then((data) => {
              setSearchResults(data.page);
              setTotalPages(data.total_pages);
            })
            .catch((err) => {
              setFailed(err.message);
            });
        } else {
        }
      }
    }
  }



  return (
    <>
      {failed && <h1 style={{ color: "red" }}>Error:{failed}</h1>}
      {!failed && (
        <>
          {" "}
          {results.length !== 0 ? (
            <h1>
              {results.length} Αποτ
              {results.length === 1 ? "έλεσμα" : "ελέσματα"}
            </h1>
          ) : (
            <h1>Παρακαλώ πληκτρολογείστε την Αναζήτησή σας!</h1>
          )}
        </>
      )}

      <div className="flexbox">
        {!failed && (
          <>
            {" "}
            <div className="filters-section">
              {" "}
              <FiltersSection
                jwt={jwt}
                setSearchCategories={setSearchCategories}
                setSearchLocation={setSearchLocation}
                setSearchMaxPrice={setSearchMaxPrice}
                searchText={searchText}
                searchMaxPrice={searchMaxPrice}
                searchLocation={searchLocation}
                setTotalPages={setTotalPages}
                setSearchResults={setSearchResults}
                pageNum={pageNum}
              ></FiltersSection>
            </div>
          </>
        )}
        {!failed && (
          <>
            {" "}
            <div className="auction-list">
              {results.length !== 0 ? (
                results.map((res) => (
                  <AuctionCard
                    key={res.id}
                    id={res.id}
                    setViewAuctionID={setViewAuctionID}
                    jwt={jwt}
                  ></AuctionCard>
                ))
              ) : (
                <p>Παρακαλώ πληκτρολογείστε την Αναζήτησή σας!</p>
              )}
            </div>
          </>
        )}
      </div>
      {!failed && (
        <>
          {" "}
          <div className="center">
            {" "}
            {results.length !== 0 && (
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
    </>
  );
}

export default SearchResults;
