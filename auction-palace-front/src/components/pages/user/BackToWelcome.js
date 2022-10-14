import { Link } from "react-router-dom";

import logo from "./images/ap_logo.png";

function BackToWelcome() {
  return (
    <div className="Logo">
      <img src={logo} alt="AuctionPalace logo"></img>
      <Link to="/welcome">Αρχική</Link>
    </div>
  );
}

export default BackToWelcome;
