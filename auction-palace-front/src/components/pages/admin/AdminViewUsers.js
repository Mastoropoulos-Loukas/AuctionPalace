import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import UserCard from "./cards/UserCard";

function AdminViewUsersPage(props) {
  const [users, setUsers] = useState([
    {
      id: 1,
      authority: {
        id: 1,
        authority: "ROLE_USER",
      },
      username: "fletchingcarry",
      name: "Ned",
      surname: "Arias",
      address: "Εθνική Πινακοθήκη",
      latitude: 37.97574,
      longitude: 23.74941,
      email: "maeegoistic@att.net",
      phone: "(541) 734-3576",
      afm: "977737114",
      balance: 11.0,
      ratingSeller: 4.0,
      totalRatingsSeller: 68,
      ratingBuyer: 4.0,
      totalRatingsBuyer: 47,
      status: "approved",
      enabled: true,
      authorities: [
        {
          id: 1,
          authority: "ROLE_USER",
        },
      ],
      accountNonLocked: true,
      accountNonExpired: true,
      credentialsNonExpired: true,
    },
  ]); // oloi oi xristes aneksartita apo to status toys

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
        `https://localhost:8070/admin/users?pageNumber=${pageNum}&pageSize=10`,
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
            throw Error("Server Error at fetch/users!");
          }
        })
        .then((data) => {
          setTotalPages(data.total_pages);
          setUsers(data.page);
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
      <h1>Χρήστες</h1>
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
              {users.map((mappedInfo, index) => (
                <UserCard
                  key={index}
                  jwt={props.jwt}
                  userID={mappedInfo.id}
                  username={mappedInfo.username}
                  email={mappedInfo.email}
                  afm={mappedInfo.afm}
                  tel={mappedInfo.phone}
                  points={mappedInfo.balance}
                ></UserCard>
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
            {users.length !== 0 && (
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

export default AdminViewUsersPage;
