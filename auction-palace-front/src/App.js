import { Routes, Route } from "react-router-dom";
import { useLocalState } from "./util/useLocalStorage";
import { useState } from "react";

import Navbar from "./components/pages/navbar/Navbar";
import LoggedInNavbar from "./components/pages/navbar/LoggedInNavbar";

import Welcome from "./components/pages/general/Welcome";

import AwaitingApprovalPage from "./components/pages/user/AwaitingApproval";
import HomePage from "./components/pages/user/HomePage";
import UserBids from "./components/pages/user/UserBids";
import UserAuctions from "./components/pages/user/UserAuctions";
import BlockedUserPage from "./components/pages/user/BlockedUserPage";

import RegisterPage from "./components/pages/register/Register";


import ReceivedMessagesPage from "./components/pages/messages/ReceivedMessages";
import SentMessagesPage from "./components/pages/messages/SentMessages";
import SendMessagesPage from "./components/pages/messages/SendMessages";

import AdminViewUsersPage from "./components/pages/admin/AdminViewUsers";
import AdminApproveUsersPage from "./components/pages/admin/AdminApproveUsers";
import AdminViewAuctionsPage from "./components/pages/admin/AdminViewAuctions";

import PointsManagement from "./components/pages/points/PointsManagement";

import ViewAuction from "./components/pages/auctions/ViewAuction";
import CreateAuction from "./components/pages/auctions/CreateAuction";
import AuctionPageSeller from "./components/pages/auctions/AuctionPageSeller";

import SearchResults from "./components/pages/search/SearchResults";

function App() {
  const [jwt, setJwt] = useLocalState("", "jwt"); //to JWT poy antiprosopeyei ena session ,stored locally
  const [userID, setUserID] = useLocalState("", "userID"); //to ID toy xristi xrisimo gia fetch, stored locally
  const [uname, setUname] = useLocalState("", "userName"); //to username toy xristi,stored locally
  const [ustatus, setUstatus] = useLocalState("", "userStatus"); //to status toy xristi, stored locally
  const [ubalance, setUbalance] = useLocalState("", "userBalance"); //to balance toy xristi, stored locally
  const [viewAuctionID, setViewAuctionID] = useLocalState("","viewAuctionID"); // to auction poy tha doyme san bidder,stored locally
  const [auctionItemID, setAuctionItemID] = useLocalState("","SellerViewAuctionID"); //to auction poy tha doyme san seller,stored locally


  const [edit, setEdit] = useState(true);

  const [auctionIDEdit, setAuctionIDEdit] = useState(""); // to auction poy tha ginei edit san seller



  const [searchText, setSearchText] = useState(""); // to text gia to search
  const [searchMaxPrice, setSearchMaxPrice] = useState(''); // to max price gia to search
  const [searchCategories, setSearchCategories] = useState([]); // oi katigories gia to search
  const [searchLocation, setSearchLocation] = useState(""); // h topothesia gia to seatch

  const [searchResults, setSearchResults] = useState([]); // to apotelesma toy search
  const [totalPages, setTotalPages] = useState(Infinity); // oi synolikes selides toy search
  const [pageNum, setPageNum] = useState(1); // h current selida toy search

  if (!jwt) {
    // ama den exoyme jwt prepei na vlepoyme to welcome page
    return (
      <div>
        <Navbar 
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
        ></Navbar>
        <Routes>
          <Route path="/" element={<Welcome jwt={jwt}></Welcome>}></Route>
          <Route
            path="/welcome"
            element={<Welcome jwt={jwt}></Welcome>}
          ></Route>
          <Route
            path="/awaitapproval"
            element={
              <AwaitingApprovalPage jwt={jwt} uname={uname} ustatus={ustatus}></AwaitingApprovalPage>
            }
          ></Route>
          <Route
            path="/blocked"
            element={<BlockedUserPage jwt={jwt} uname={uname} ustatus={ustatus}></BlockedUserPage>}
          ></Route>
          <Route
            path="/register"
            element={<RegisterPage jwt={jwt}></RegisterPage>}
          >
            {" "}
          </Route>
          <Route
            path="/homepage"
            element={
              <HomePage
                jwt={jwt}
                ustatus={ustatus}
                setViewAuctionID={setViewAuctionID}
              ></HomePage>
            }
          ></Route>
          <Route
            path="/received"
            element={
              <ReceivedMessagesPage
                jwt={jwt}
                userID={userID}
              ></ReceivedMessagesPage>
            }
          ></Route>
          <Route
            path="/sent"
            element={
              <SentMessagesPage jwt={jwt} userID={userID}></SentMessagesPage>
            }
          ></Route>
          <Route
            path="/compose"
            element={
              <SendMessagesPage jwt={jwt} userID={userID}></SendMessagesPage>
            }
          ></Route>
          <Route
            path="/points"
            element={
              <PointsManagement
                jwt={jwt}
                userID={userID}
                ubalance={ubalance}
                setUbalance={setUbalance}
              ></PointsManagement>
            }
          ></Route>
          <Route
            path="/mybids"
            element={
              <UserBids
                jwt={jwt}
                setViewAuctionID={setViewAuctionID}
                setUbalance={setUbalance}
              ></UserBids>
            }
          ></Route>
          <Route
            path="/myauctions"
            element={
              <UserAuctions
                jwt={jwt}
                userID={userID}
                setEdit={setEdit}
                setAuctionIDEdit={setAuctionIDEdit}
                setAuctionItemID={setAuctionItemID}
              ></UserAuctions>
            }
          ></Route>
          <Route
            path="/auctioninfo"
            element={
              <ViewAuction
                viewAuctionID={viewAuctionID}
                jwt={jwt}
                setUbalance={setUbalance}
              ></ViewAuction>
            }
          ></Route>
          <Route
            path="/newauction"
            element={
              <CreateAuction
                jwt={jwt}
                auctionIDEdit={auctionIDEdit}
              ></CreateAuction>
            }
          >
            {" "}
          </Route>
          <Route
            path="/auctioninfoseller"
            element={
              <AuctionPageSeller
                jwt={jwt}
                item_id={auctionItemID}
              ></AuctionPageSeller>
            }
          ></Route>
          <Route
            path="/search"
            element={
              <SearchResults
                jwt={jwt}
                results={searchResults}
                totalPages={totalPages}
                searchText={searchText}
                pageNum={pageNum}
                setPageNum={setPageNum}
                setSearchCategories={setSearchCategories}
                setSearchLocation={setSearchLocation}
                setSearchMaxPrice={setSearchMaxPrice}
                setViewAuctionID={setViewAuctionID}
                setTotalPages={setTotalPages}
                setSearchResults={setSearchResults}
                searchMaxPrice={searchMaxPrice}
                searchCategories={searchCategories}
                searchLocation={searchLocation}
              ></SearchResults>
            }
          ></Route>
          <Route
            path="/admin/users"
            element={<AdminViewUsersPage jwt={jwt} ustatus={ustatus}></AdminViewUsersPage>}
          ></Route>
          <Route
            path="/admin/approvals"
            element={<AdminApproveUsersPage jwt={jwt} ustatus={ustatus}></AdminApproveUsersPage>}
          ></Route>
          <Route
            path="/admin/auctions"
            element={<AdminViewAuctionsPage jwt={jwt} ustatus={ustatus}></AdminViewAuctionsPage>}
          ></Route>
        </Routes>
      </div>
    );
  }

  // Gia toys waiting kai blocked xristes
  if (ustatus === "waiting" || ustatus === "blocked") {
    return (
      <div>
        <LoggedInNavbar
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
          setSearchText={setSearchText}
          setTotalPages={setTotalPages}
          setSearchResults={setSearchResults}
          setAuctionItemID={setAuctionItemID}
          setViewAuctionId={setViewAuctionID}
        ></LoggedInNavbar>
        <Routes>
          {ustatus === "waiting" && (
            <Route
              path="/"
              element={
                <AwaitingApprovalPage jwt={jwt} uname={uname} ustatus={ustatus}></AwaitingApprovalPage>
              }
            ></Route>
          )}
          {ustatus === "blocked" && (
            <Route
              path="/"
              element={<BlockedUserPage jwt={jwt} uname={uname} ustatus={ustatus}></BlockedUserPage>}
            ></Route>
          )}
          <Route
            path="/welcome"
            element={<Welcome jwt={jwt}></Welcome>}
          ></Route>
          <Route
            path="/awaitapproval"
            element={
              <AwaitingApprovalPage jwt={jwt} uname={uname} ustatus={ustatus}></AwaitingApprovalPage>
            }
          ></Route>
          <Route
            path="/homepage"
            element={<HomePage jwt={jwt} setViewAuctionID={setViewAuctionID} ustatus={ustatus}></HomePage>}
          ></Route>{" "}
          <Route
            path="/register"
            element={<RegisterPage jwt={jwt}></RegisterPage>}
          >
            {" "}
          </Route>
          <Route
            path="/welcome"
            element={<Welcome jwt={jwt}></Welcome>}
          ></Route>
        </Routes>
      </div>
    );
  }

  // Gia ton admin
  if (ustatus === "admin") {
    return (
      <div>
        <LoggedInNavbar
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
          setTotalPages={setTotalPages}
          setSearchResults={setSearchResults}
          setSearchText={setSearchText}
          setAuctionItemID={setAuctionItemID}
          setViewAuctionId={setViewAuctionID}
        ></LoggedInNavbar>
        <Routes>
          <Route
            path="/"
            element={<AdminViewUsersPage jwt={jwt} ustatus={ustatus}></AdminViewUsersPage>}
          ></Route>
          <Route
            path="/admin/users"
            element={<AdminViewUsersPage jwt={jwt} ustatus={ustatus}></AdminViewUsersPage>}
          ></Route>
          <Route
            path="/admin/approvals"
            element={<AdminApproveUsersPage jwt={jwt} ustatus={ustatus}></AdminApproveUsersPage>}
          ></Route>
          <Route
            path="/admin/auctions"
            element={<AdminViewAuctionsPage jwt={jwt} ustatus={ustatus}></AdminViewAuctionsPage>}
          ></Route>
          <Route
            path="/welcome"
            element={<Welcome jwt={jwt}></Welcome>}
          ></Route>
          <Route
            path="/received"
            element={
              <ReceivedMessagesPage
                jwt={jwt}
                userID={userID}
              ></ReceivedMessagesPage>
            }
          ></Route>
          <Route
            path="/sent"
            element={
              <SentMessagesPage jwt={jwt} userID={userID}></SentMessagesPage>
            }
          ></Route>
          <Route
            path="/compose"
            element={
              <SendMessagesPage jwt={jwt} userID={userID}></SendMessagesPage>
            }
          ></Route>
        </Routes>
      </div>
    );
  }

  //Kai gia oloys toys approved xristes
  return (
    <div>
      <LoggedInNavbar
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
        viewAuctionID={viewAuctionID}
        setViewAuctionId={setViewAuctionID}
        setSearchText={setSearchText}
        setTotalPages={setTotalPages}
        setSearchResults={setSearchResults}
        setAuctionItemID={setAuctionItemID}
      ></LoggedInNavbar>
      <Routes>
        <Route
          path="/search"
          element={
            <SearchResults
              jwt={jwt}
              results={searchResults}
              totalPages={totalPages}
              searchText={searchText}
              pageNum={pageNum}
              setPageNum={setPageNum}
              setSearchCategories={setSearchCategories}
              setSearchLocation={setSearchLocation}
              setSearchMaxPrice={setSearchMaxPrice}
              setViewAuctionID={setViewAuctionID}
              setTotalPages={setTotalPages}
              setSearchResults={setSearchResults}
              searchMaxPrice={searchMaxPrice}
              searchCategories={searchCategories}
              searchLocation={searchLocation}
            ></SearchResults>
          }
        ></Route>
        <Route
          path="/received"
          element={
            <ReceivedMessagesPage
              jwt={jwt}
              userID={userID}
            ></ReceivedMessagesPage>
          }
        ></Route>
        <Route
          path="/sent"
          element={
            <SentMessagesPage jwt={jwt} userID={userID}></SentMessagesPage>
          }
        ></Route>
        <Route
          path="/compose"
          element={
            <SendMessagesPage jwt={jwt} userID={userID}></SendMessagesPage>
          }
        ></Route>
        {ustatus === "approved" && (
          <Route
            path="/"
            element={
              <HomePage
                jwt={jwt}
                setViewAuctionID={setViewAuctionID}
                ustatus={ustatus}
              ></HomePage>
            }
          ></Route>
        )}
        {ustatus === "waiting" && (
          <Route
            path="/"
            element={
              <AwaitingApprovalPage jwt={jwt} uname={uname} ustatus={ustatus}></AwaitingApprovalPage>
            }
          ></Route>
        )}
        <Route path="/welcome" element={<Welcome jwt={jwt}></Welcome>}></Route>
        <Route
          path="/awaitapproval"
          element={<AwaitingApprovalPage jwt={jwt} uname={uname} ustatus={ustatus}></AwaitingApprovalPage>}
        ></Route>
        <Route
          path="/homepage"
          element={
            <HomePage
              jwt={jwt}
              setViewAuctionID={setViewAuctionID}
              ustatus={ustatus}
            ></HomePage>
          }
        ></Route>{" "}
        <Route
          path="/register"
          element={<RegisterPage jwt={jwt}></RegisterPage>}
        >
          {" "}
        </Route>
        <Route
          path="/points"
          element={
            <PointsManagement
              jwt={jwt}
              userID={userID}
              ubalance={ubalance}
              setUbalance={setUbalance}
            ></PointsManagement>
          }
        ></Route>
        <Route
          path="/mybids"
          element={
            <UserBids
              jwt={jwt}
              setViewAuctionID={setViewAuctionID}
              setUbalance={setUbalance}
            ></UserBids>
          }
        ></Route>
        <Route
          path="/myauctions"
          element={
            <UserAuctions
              jwt={jwt}
              userID={userID}
              setEdit={setEdit}
              setAuctionIDEdit={setAuctionIDEdit}
              setAuctionItemID={setAuctionItemID}
            ></UserAuctions>
          }
        ></Route>
        <Route
          path="/auctioninfo"
          element={
            <ViewAuction
              viewAuctionID={viewAuctionID}
              jwt={jwt}
              setUbalance={setUbalance}
            ></ViewAuction>
          }
        ></Route>
        <Route
          path="/newauction"
          element={
            <CreateAuction
              jwt={jwt}
              auctionIDEdit={auctionIDEdit}
            ></CreateAuction>
          }
        >
          {" "}
        </Route>
        <Route
          path="/auctioninfoseller"
          element={
            <AuctionPageSeller
              jwt={jwt}
              item_id={auctionItemID}
            ></AuctionPageSeller>
          }
        ></Route>
        <Route path="/welcome" element={<Welcome jwt={jwt}></Welcome>}></Route>
      </Routes>
    </div>
  );
}

export default App;
