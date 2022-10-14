import { useState } from "react";

function PendingUserCard(props) {
  const [failed1, setFailed1] = useState(null);
  const [failed2, setFailed2] = useState(null);

  function approve() {
    if (props.jwt && props.ID) {
      fetch(`https://localhost:8070/admin/approve/${props.ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed1(null);
            window.location.reload();
          } else {
            throw Error("Failed to Approve!");
          }
        })
        .catch((err) => {
          setFailed1(err.message);
        });
    }
  }

  function reject() {
    if (props.jwt && props.ID) {
      fetch(`https://localhost:8070/admin/block_user/${props.ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed2(null);
            window.location.reload();
          } else {
            throw Error("Failed to Reject!");
          }
        })
        .catch((err) => {
          setFailed2(err.message);
        });
    }
  }

  return (
    <div className="user-card">
      {failed1 && <h4 style={{ color: "red" }}>Error: {failed1}</h4>}
      {failed2 && <h4 style={{ color: "red" }}>Error: {failed2}</h4>}
      <h2>{props.username}</h2>
      <h3>Email</h3>
      <p>{props.email}</p>
      <h3>ΑΦΜ</h3>
      <p>{props.afm}</p>
      <h3>Τηλέφωνο</h3>
      <p>{props.tel}</p>
      <br></br>
      <button className="btn" onClick={approve}>
        {" "}
        Επικύρωση
      </button>

      <button className="btn" onClick={reject}>
        {" "}
        Απόρριψη
      </button>
    </div>
  );
}

export default PendingUserCard;
