import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import tick from "./images/green_tick.png";

function AwaitingApprovalPage(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.jwt && props.ustatus === "waiting") {
    } else {
      navigate("/");
    }
  }, []);
  
  return (
    <div className="await_appr">
      <div className="appr_img">
        {" "}
        <img src={tick} alt="Awaiting approval"></img>
      </div>
      <div className="container">
        <div>
          {" "}
          <h1>
            {" "}
            {props.uname
              ? `Αγαπητέ ${props.uname} η αίτηση εγγραφής σας έχει αποσταλεί επιτυχώς!`
              : `Η αίτηση εγγραφής σας έχει αποσταλεί επιτυχώς!`}{" "}
          </h1>
          <p>Περιμένετε έγκριση από τον διαχειριστή</p>
        </div>
      </div>
    </div>
  );
}

export default AwaitingApprovalPage;
