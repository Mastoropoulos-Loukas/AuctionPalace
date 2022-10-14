import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const BASE = "https://localhost:8070";

function SignUp(props) {
  const [username, setUsername] = useState(""); // to username poy pliktrologoyme
  const [password, setPassword] = useState(""); // to password poy pliktrologoyme
  const [failed, setFailed] = useState(null); // kratame to mnm lathous poy pernoyme

  const navigate = useNavigate();

  const submitInput = async (e) => {
    // an den exoyme jwt token tote prepei na paroyme
    if (!props.jwt) {
      userSignup({ username, password });
    }

    // kratame kai to ID toy user
    if (!props.userID) {
      getUserId({ username, password });
    }

    // kratame kai to username
    if (!props.uname) {
      getUname({ username, password });
    }
    if (!props.ustatus) {
      getUstatus({ username, password });
    }
    if (!props.ubalance) {
      getUbalance({ username, password });
    }
    if (!failed) {
      navigate("/");
    }
  };

  async function userSignup(cred) {
    fetch(`${BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(cred),
    })
      .then((response) => {
        if (response.ok) {
          return Promise.all([response.json, response.headers]);
        } else {
          throw Error("Λανθασμένα Στοιχεία! Δοκιμάστε ξανά!");
        }
      })
      .then(([body, headers]) => {
        setFailed(null);
        props.setJwt(headers.get("authorization"));
      })
      .catch((err) => {
        setFailed(err.message);
      });
  }

  async function getUserId(cred) {
    fetch(`${BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(cred),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("Λανθασμένα Στοιχεία! Δοκιμάστε ξανά!");
        }
      })
      .then((data) => {
        setFailed(null);
        props.setUserID(data.id);
      })
      .catch((err) => {
        setFailed(err.message);
      });
  }

  async function getUname(cred) {
    fetch(`${BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(cred),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("Λανθασμένα Στοιχεία! Δοκιμάστε ξανά!");
        }
      })
      .then((data) => {
        setFailed(null);
        props.setUname(data.username);
      })
      .catch((err) => {
        setFailed(err.message);
      });
  }

  async function getUstatus(cred) {
    fetch(`${BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(cred),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("Λανθασμένα Στοιχεία! Δοκιμάστε ξανά!");
        }
      })
      .then((data) => {
        setFailed(null);
        props.setUstatus(data.status);
      })
      .catch((err) => {
        setFailed(err.message);
      });
  }

  async function getUbalance(cred) {
    fetch(`${BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(cred),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("Λανθασμένα Στοιχεία! Δοκιμάστε ξανά!");
        }
      })
      .then((data) => {
        setFailed(null);
        props.setUbalance(data.balance);
      })
      .catch((err) => {
        setFailed(err.message);
      });
  }

  return (
    <div className="enter">
      {" "}
      <FaTimes
        className="x-button"
        style={{ display: "flex", alignSelf: "flex-end" }}
        onClick={props.onClick}
      ></FaTimes>
      <label htlmfor="un">Όνομα Χρήστη </label>
      <input
        type="text"
        id="un"
        required="required"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <label htlmfor="pw">Κωδικός Χρήστη</label>
      <input
        type="password"
        id="pw"
        required="required"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button className="btn" onClick={submitInput}>
        Είσοδος
      </button>
      {failed && <p style={{ color: "red" }}>{failed}</p>}
    </div>
  );
}
SignUp.propTypes = {
  setJwt: PropTypes.func.isRequired,
};

export default SignUp;
