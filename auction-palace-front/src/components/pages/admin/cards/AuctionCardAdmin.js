import { useEffect, useState } from "react";

import { secondsToDhms } from "../../../../util/secondsToDhms";
import { formatDates } from "../../../../util/formatDates";

import exportFromJSON from "export-from-json";

function AuctionCardAdmin({
  jwt,
  item_id,
  minutes_remaining,
  name,
  seller,
  currently,
  buy_now,
}) {
  const [auctionInfo, setAuctionInfo] = useState([]); // oi plirofories tis dimoprasias

  const [failed, setFailed] = useState(null);

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };



  useEffect(() => {
    if (jwt && item_id) {
      fetch(`https://localhost:8070/admin/items/${item_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            return response.json();
          } else {
            throw Error("Failed to fetch items!");
          }
        })
        .then((data) => {
          setAuctionInfo(data);
        })
        .catch((err) => {
          setFailed(err.message);
        });
    }
  }, []);

  function createInfo(auction) {
    const info = {
      id: auction.id,
      name: auction.name,
      seller: {
        sellerID: auction.user.id,
        seller_username: auction.user.username,
        seller_name: auction.user.name,
        seller_surname: auction.user.surname,
        seller_address: auction.user.address,
        seller_latitude: auction.user.latitude,
        seller_longitude: auction.user.longitude,
        seller_balance: auction.user.balance,
        seller_email: auction.user.email,
        seller_phone: auction.user.phone,
        seller_afm: auction.user.afm,
        seller_general_rating: auction.user.ratingSeller,
        seller_times_been_rated: auction.user.totalRatingsSeller,
      },
      categories: auction.categories,
      currently: auction.currently,
      buyNowPrice: auction.buyPrice,
      minBid: auction.firstBid,
      numBids: auction.numberOfBids,
      starts: formatDates(auction.starts),
      ends: formatDates(auction.ends),
      description: auction.description,
      ratingOfSeller: auction.sellerRating,
      ratingOfBidder: auction.bidderRating,
      location: auction.location,
      latitude: auction.latitude,
      longitude: auction.longitude,
      country: auction.country,
    };

    return info;
  }

  function moreJSON() {
    const info = createInfo(auctionInfo);

    downloadFile({
      data: JSON.stringify(info),
      fileName: `${info.name}.json`,
      fileType: "text/json",
    });
  }

  function moreXML() {
    const data = createInfo(auctionInfo);
    const fieldsAsObjects = {
      id: "Auction ID",
    };

    const fields = {
      id: "Auction ID",
      seller: "Seller Info",
      name: "Auction Name",
      categories: "Categories",
      currently: "Current Max Bid",
      buyNowPrice: "Buy Now Price",
      minBid: "Minimun Price",
      starts: "Start Date",
      ends: "Finish Date",
      description: "Descriprion",
      ratingOfSeller: "Seller's Rating",
      ratingOfBuyer: "Byuer's Rating",
      location: "Location",
      latitude: "Latitude",
      longitude: "Longitude",
      country: "Country",
    };

    const fileName = `${data.name}`;

    const exportType = "xml";

    exportFromJSON({ data, fileName, fields, exportType });
  }

  return (
    <div className="auction-card" style={{ height: "270px", width: "270px" }}>
      {failed && <h4 style={{ color: "red" }}>Error: {failed}</h4>}
      {!failed && (
        <>
          {" "}
          <h3>{name}</h3>
          <h4>Πωλητής</h4>
          <p>{seller}</p>
          <h4>Μεγιστή Προσφορά</h4>
          <p>{currently}</p>
          <h4>Αγορά Τώρα</h4>
          <p>{buy_now}</p>
          <h4>Χρόνος που Απομένει</h4>
          <p>{secondsToDhms(minutes_remaining * 60)}</p>{" "}
          <button className="btn" onClick={moreJSON}>
            {" "}
            JSON
          </button>
          <button className="btn" onClick={moreXML}>
            {" "}
            XML
          </button>
        </>
      )}
    </div>
  );
}

export default AuctionCardAdmin;
