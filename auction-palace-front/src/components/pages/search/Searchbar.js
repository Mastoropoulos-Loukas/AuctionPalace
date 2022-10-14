import { useState } from "react";
import { FaSearch as Glass } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Searchbar({
  jwt,
  setSearchText,
  setTotalPages,
  setSearchResults,
}) {
  const [text, setText] = useState(""); // to search text

  const [failed, setFailed] = useState(null);
  
  const navigate = useNavigate();

  function search() {
    if (jwt) {
      fetch(
        `https://localhost:8070/search/?pageNumber=1&ignore_time=0&pageSize=10&text=${text}`,
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
          }else{
            throw Error("Failed to Search");
          }
        })
        .then((data) => {
          setTotalPages(data.total_pages);
          setSearchResults(data.page);
          navigate("/search");
        }).catch((err)=>{
          setFailed(err.message);
        })
    }
  }



  return (
    <div>
      <form>
        {" "}
        <input
          type="text"
          id="searchbar"
          placeholder="Αναζήτηση Τώρα..."
          className="searchbar"
          onChange={(e) => {
            setSearchText(e.target.value);
            setText(e.target.value);
          }}
        ></input>
        <button type="button" className="search-button">
          {" "}
          <Glass style={{ color: "coral" }} onClick={search}></Glass>{" "}
        </button>
      </form>
      {failed && <h1 style={{ color: "red" }}>Error:{failed}</h1>}
    </div>
  );
}

export default Searchbar;
