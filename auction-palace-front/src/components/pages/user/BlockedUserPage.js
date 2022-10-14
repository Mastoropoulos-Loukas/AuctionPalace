import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import red_x from "./images/red_x.png";

function BlockedUserPage({ jwt, uname, ustatus }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && ustatus === "blocked") {
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="await_appr">
      <div className="appr_img">
        {" "}
        <img src={red_x} alt="You have been blocked"></img>
      </div>
      <div className="container">
        <div>
          {" "}
          <h1>
            {" "}
            {uname
              ? `Αγαπητέ ${uname} έχετε μπλοκαριστεί λόγω ανάρμοστης συμπεριφοράς!`
              : ``}{" "}
          </h1>
          <p>Περιμένετε νέα από τον διαχειριστή</p>
        </div>
      </div>
    </div>
  );
}

export default BlockedUserPage;
