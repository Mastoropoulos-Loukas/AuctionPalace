import React, { useState } from "react";
import { Link } from "react-router-dom";

import Backdrop from "../general/Backdrop";
import Searchbar from "../search/Searchbar";
import BackToHome from "../user/BackToHome";
import BackToWelcome from "../user/BackToWelcome";
import Gate from "../general/Gate";

function LoggedInNavbar({
  jwt,
  setJwt,
  setUserID,
  uname,
  setUname,
  ustatus,
  setUstatus,
  ubalance,
  setUbalance,
  viewAuctionID,
  setViewAuctionId,
  setSearchText,
  setTotalPages,
  setSearchResults,
  setAuctionItemID,
}) {
  const [enterIsOpen, setEnterIsOpen] = useState(false);
  const [registerIsOpen, setRegisterIsOpen] = useState(false);

  function openEnterHandler() {
    setEnterIsOpen(true);
  }

  function closeEnterHandler() {
    setEnterIsOpen(false);
  }

  function openRegisterHandler() {
    setJwt("");
    setUserID("");
    setUname("");
    setUstatus("");
    setUbalance("");
    setAuctionItemID("");
    setViewAuctionId("");
    setRegisterIsOpen(true);
  }

  return (
    <div>
      {" "}
      <div className="navbar">
        {(ustatus === "waiting" || ustatus==="blocked") && <BackToWelcome></BackToWelcome>}
        {ustatus ==="approved" && (
          <BackToHome></BackToHome>
        )}
        {ustatus ==="approved" && (
          <>
            {" "}
            <Searchbar
              setSearchText={setSearchText}
              jwt={jwt}
              setTotalPages={setTotalPages}
              setSearchResults={setSearchResults}
            ></Searchbar>
          </>
        )}
        <div className="parent">
          <button className="btn" onClick={openEnterHandler}>
            {uname ? uname : "Dummy"}
          </button>
          <Link to="/welcome">
            {" "}
            <button className="btn btn--alt" onClick={openRegisterHandler}>
              Έξοδος
            </button>
          </Link>
        </div>
        {((ustatus==="approved" || ustatus==="admin") && enterIsOpen) && (
          <Gate
            jwt={jwt}
            uname={uname}
            ubalance={ubalance}
            viewAuctionID={viewAuctionID}
            setViewAuctionId={setViewAuctionId}
            onClick={closeEnterHandler}
          ></Gate>
        )}
        { ((ustatus==="approved" || ustatus==="admin") && enterIsOpen) && <Backdrop onCancel={closeEnterHandler} />}
      </div>
    </div>
  );
}

export default LoggedInNavbar;
