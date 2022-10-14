import { Link } from "react-router-dom";

import logo from "./images/ap_logo.png";

function BackToHome() {
  return (
    <div className="Logo">
      <img src={logo} alt="AuctionPalace logo"></img>
      <Link to="/homepage">Αρχική</Link>
    </div>
  );
}

export default BackToHome;
