import { useState } from "react";

import Backdrop from "../../general/Backdrop";
import UserDetails from "../../general/UserDetails";

function UserCard(props) {
  const [enterIsOpen, setEnterIsOpen] = useState(false); // gia to backdrop kai tis userDetails

  const [failed, setFailed] = useState(null);

  function closeEnterHandler() {
    setEnterIsOpen(false);
  }

  function openEnterHandler() {
    setEnterIsOpen(true);
  }

  function block() {
    if (props.jwt && props.userID) {
      fetch(`https://localhost:8070/admin/block_user/${props.userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            window.location.reload();
          } else {
            throw Error("Failed to Block!");
          }
        })
        .catch((err) => {
          setFailed(err.message);
        });
    }
  }

  return (
    <div className="user-card">
      {failed && <h4 style={{ color: "red" }}>Error:{failed}</h4>}
      <h2>{props.username}</h2>
      <h3>Email</h3>
      <p>{props.email}</p>
      <h3>ΑΦΜ</h3>
      <p>{props.afm}</p>
      <h3>Τηλέφωνο</h3>
      <p>{props.tel}</p>
      <h3>Πόντοι</h3>
      <p>{props.points.toFixed(2)}</p>
      <br></br>
      <button className="btn" onClick={openEnterHandler}>
        {" "}
        Παραπάνω
      </button>
      <button className="btn" onClick={block}>
        {" "}
        Μπλοκάρισμα
      </button>

      {enterIsOpen && (
        <UserDetails
          userID={props.userID}
          jwt={props.jwt}
          onClick={closeEnterHandler}
        ></UserDetails>
      )}
      {enterIsOpen && <Backdrop onCancel={closeEnterHandler} />}
    </div>
  );
}

export default UserCard;
