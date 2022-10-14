import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

function UserDetails(props) {
  const [user, setUser] = useState([]); // Oi plirofories toy xristi
  const [points, setPoints] = useState(0); // Oi pontoi toy xristi se diaforetiki metavliti eksaitias to toFixed()
  const [ratingBuyer, setRatingBuyer] = useState(0); //To rating toy xristi san buyer se diaforetiki metavliti eksaitias to toFixed()
  const [ratingSeller, setRatingSeller] = useState(0); //To rating toy xristi san seller se diaforetiki metavliti eksaitias to toFixed()

  const [failed, setFailed] = useState(null);

  useEffect(() => {
    if (props.jwt && props.userID) {
      fetch(`https://localhost:8070/admin/users/${props.userID} `, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            return response.json();
          } else {
            throw Error("Can't get more info!");
          }
        })
        .then((data) => {
          setUser(data);
          setPoints(data.balance);
          setRatingBuyer(data.ratingBuyer);
          setRatingSeller(data.ratingSeller);
        })
        .catch((err) => {
          setFailed(err.message);
        });
    }
  }, []);

  return (
    <div className="enter">
      {failed && <h3 style={{ color: "red" }}>Error:{failed}</h3>}
      {!failed && (
        <>
          {" "}
          <h4>Username</h4>
          <p>{user.username}</p>
          <h4>UserID</h4>
          <p>{user.id}</p>
          <h4>Πόντοι</h4>
          <p>{points.toFixed(2)}</p>
          <h4>Email</h4>
          <p>{user.email}</p>
          <h4>Κατάσταση</h4>
          <p>{user.status}</p>
          <h4>Όνομα</h4>
          <p>{user.name}</p>
          <h4>Επίθετο</h4>
          <p>{user.surname}</p>
          <h4>Τηλέφωνο</h4>
          <p>{user.phone}</p>
          <h4>Διεύθυνση</h4>
          <p>{user.address}</p>
          <h4>ΑΦΜ</h4>
          <p>{user.afm}</p>
          <h4>Βαθμολογία ως πωλητής</h4>
          <p>
            {ratingSeller.toFixed(2)}{" "}
            <FaStar style={{ color: "goldenrod" }}></FaStar>
          </p>
          <h4>Σύνολο αξιολογήσεων ως πωλητής</h4>
          <p>{user.totalRatingsSeller}</p>
          <h4>Βαθμολογία ως αγοραστής</h4>
          <p>
            {ratingBuyer.toFixed(2)}{" "}
            <FaStar style={{ color: "goldenrod" }}></FaStar>
          </p>
          <h4>Σύνολο αξιολογήσεων ως αγοραστής</h4>
          <p>{user.totalRatingsBuyer}</p>
        </>
      )}
    </div>
  );
}

export default UserDetails;
