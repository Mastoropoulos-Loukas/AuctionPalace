import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "https://localhost:8070";

function RegisterPage({ jwt }) {
  const [username, setUsername] = useState("Dummy"); // to username toy neoy xristi
  const [password, setPassword] = useState("Dummy"); // to password toy neoy xristi
  const [email, setEmail] = useState("Dummy"); // to email toy neoy xristi
  const [firstName, setFirstName] = useState("Dummy"); // to mikro onoma toy neoy xristi
  const [lastName, setLastName] = useState("Dummy"); // to epitheto toy neoy xristi
  const [afm, setAfm] = useState("Dummy"); // to afm toy neoy xristi
  const [adress, setAdress] = useState("Dummy"); // i dieythinsi toy neoy xristi
  const [telephone, setTelephone] = useState(""); // to telephono toy neoy xristi

  const [failed, setFailed] = useState(null);

  const navigate = useNavigate();

  // variables poy xrisimopoioyntai gia to password matching
  const [cPassword, setCPassword] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState("form-control");
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);

  useEffect(() => {
    if (isCPasswordDirty) {
      if (password === cPassword) {
        setShowErrorMessage(false);
        setCPasswordClass("form-control is-valid");
      } else {
        setShowErrorMessage(true);
        setCPasswordClass("form-control is-invalid");
      }
    }
  }, [cPassword]);

  const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setIsCPasswordDirty(true);
  };


  function Coord(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  useEffect(() => {
    if (jwt) {
      navigate("/");
    } else {
    }
  }, []);

  const submit = (event) => {
    event.preventDefault();

    const user = {
      username: `${username}`,
      password: `${password}`,
      email: `${email}`,
      name: `${firstName}`,
      lastname: `${lastName}`,
      afm: `${afm}`,
      address: `${adress}`,
      latitude: Coord(35.01186, 41.50306), // random mexri na vro tropo na xrisimopoio to api
      longitude: Coord(19.91975, 28.2225),
      phone: `${telephone}`,
    };

    if (user.username !== "Dummy") {
      userRegister(user);
    } else {
      console.log("Empty Form!");
      setFailed("Empty Form!");
    }
  };


  async function userRegister(user) {
    fetch(`${BASE}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.status === 400 ) {
          throw Error("???? ?????????? ???????????? ?????????????? ??????! ?????????????????? ???????????? ????????!");
        }else if(response.status === 500 || response.status===401){
          throw Error("Server error!");
        } 
        else if (response.status === 200) {
          console.log("New User Successfully Created!!!");
          setFailed(null);
          
          navigate("/"); 
        }
      })
      .catch((err) => {
        console.log(err);
        setFailed(err.message);
      });
  }

  return (
    <div className="registerForm">
      <h1> ???????????? ????????????????</h1>
      {failed && <h2 style={{ color: "red" }}>{failed}</h2>}
      <form onSubmit={submit}>
        <div className="info">
          {" "}
          <div className="acc-data">
            <h2>???????????????? ??????????????????????</h2>
            <div className="input-form">
              {" "}
              <label htmlFor="username">'?????????? ????????????</label>
              <input
                type="text"
                id="username"
                required="required"
                minLength={4}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="password">?????????????? ????????????</label>
              <input
                type="password"
                id="password"
                required="required"
                minLength={8}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="pw_validation">???????????????????? ??????????????</label>
              <input
                type="password"
                className={cPasswordClass}
                id="pw_validation"
                required="required"
                onChange={handleCPassword}
              ></input>
            </div>
            {showErrorMessage && isCPasswordDirty ? (
              <div style={{ color: "red" }}>
                {" "}
                ???? ?????????????? ???????????? ???? ??????????????????????!{" "}
              </div>
            ) : (
              ""
            )}
            <div className="input-form">
              {" "}
              <label htmlFor="email">Email ????????????</label>
              <input
                type="email"
                id="email"
                required="required"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className="user-data">
            <h2>???????????????? ????????????</h2>
            <div className="input-form">
              {" "}
              <label htmlFor="first-name">??????????</label>
              <input
                type="text"
                id="first-name"
                required="required"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="last-name">??????????????</label>
              <input
                type="text"
                id="last-name"
                required="required"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="afm">??????</label>
              <input
                type="text"
                id="afm"
                required="required"
                onChange={(e) => {
                  setAfm(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className="cont-info">
            <h2>???????????????? ????????????????????????</h2>
            <div className="input-form">
              {" "}
              <label htmlFor="location">??????????????????</label>
              <input
                type="text"
                id="location"
                required="required"
                onChange={(e) => {
                  setAdress(e.target.value);
                }}
              ></input>
            </div>
            <div className="input-form">
              {" "}
              <label htmlFor="tel">????????????????</label>
              <input
                type="tel"
                id="tel"
                required="required"
                onChange={(e) => {
                  setTelephone(e.target.value);
                }}
              ></input>
            </div>
          </div>
        </div>

        <div className="center">
          {" "}
          <input type="submit" value="????????????"></input>
        </div>
      </form>
      *?????? ???? ?????????? ?????????? ??????????????????????
    </div>
  );
}

export default RegisterPage;
