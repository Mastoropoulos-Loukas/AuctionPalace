import React, { useState } from "react";
import { Link } from "react-router-dom";

import SignUp from "../signup/SignUp";
import Backdrop from "../general/Backdrop";
import BackToWelcome from "../user/BackToWelcome";

function Navbar({
  jwt,
  setJwt,
  userID,
  setUserID,
  uname,
  setUname,
  ustatus,
  setUstatus,
  ubalance,
  setUbalance,
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
    setRegisterIsOpen(true);
  }


  return (
    <div>
      {" "}
      <div className="navbar">
        <BackToWelcome></BackToWelcome>

        <div className="parent">
          <button className="btn" onClick={openEnterHandler}>
            Είσοδος
          </button>
          <Link to="/register">
            {" "}
            <button className="btn btn--alt" onClick={openRegisterHandler}>
              Εγγραφή
            </button>
          </Link>
        </div>
        {enterIsOpen && (
          <SignUp
            jwt={jwt}
            setJwt={setJwt}
            userID={userID}
            setUserID={setUserID}
            uname={uname}
            setUname={setUname}
            ustatus={ustatus}
            setUstatus={setUstatus}
            ubalance={ubalance}
            setUbalance={setUbalance}
            onClick={closeEnterHandler}
          />
        )}
        {enterIsOpen && <Backdrop onCancel={closeEnterHandler} />}
      </div>
    </div>
  );
}

export default Navbar;
