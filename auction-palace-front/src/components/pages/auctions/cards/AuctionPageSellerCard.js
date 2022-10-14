function AuctionPageSellerCard({ username, date, amount }) {
  return (
    <div className="bid-card">
      {" "}
      <h3 style={{ marginTop: "10px" }}>
        Χρήστης <p>{username}</p>
      </h3>
      <h3 style={{ marginTop: "10px" }}>
        Ημερομηνία <p> {date}</p>
      </h3>
      <h3 style={{ marginTop: "10px" }}>
        Προσφορά <p>{amount}</p>
      </h3>
    </div>
  );
}

export default AuctionPageSellerCard;
