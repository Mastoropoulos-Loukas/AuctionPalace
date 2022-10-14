import intro from "./images/ap_logo.png";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Welcome({ jwt }) {
  const [registerIsOpen, setRegisterIsOpen] = useState(false);

  function openRegisterHandler() {
    setRegisterIsOpen(true);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt) {
      navigate("/");
    } else {
    }
  }, []);

  return (
    <div className="welcome">
      <div className="intro_img">
        {" "}
        <img src={intro} alt="Everything has its price"></img>
      </div>
      <div className="container">
        <div className="buyer">
          {" "}
          <h1>Get broke quickly with these 4 easy steps!</h1>
          <p>
            Placeholder text that aims to convince the user to spend their
            hard-earned money, thus making us filthy rich
          </p>
        </div>
        <div className="seller">
          <h1>Get rich quickly with these 4 easy steps!</h1>
          <p>
            Placeholder text that aims to convince the user to spend their
            hard-earned money, thus making us filthy rich
          </p>
        </div>
      </div>
      <div className="center">
        {" "}
        <Link to="/register" className="btn" onClick={openRegisterHandler}>
          Ξεκίνα Τώρα!
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
