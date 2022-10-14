import { useState } from "react";

function AddCreditCard({ jwt, userID, onClick }) {
  const months = [
    { id: 1, month: "01" },
    { id: 2, month: "02" },
    { id: 3, month: "03" },
    { id: 4, month: "04" },
    { id: 5, month: "05" },
    { id: 6, month: "06" },
    { id: 7, month: "07" },
    { id: 8, month: "08" },
    { id: 9, month: "09" },
    { id: 10, month: "10 " },
    { id: 11, month: "11 " },
    { id: 12, month: "12" },
  ]; // oloi oi mines toy xronoy

  const years = [
    { id: 1, year: "22" },
    { id: 2, year: "23" },
    { id: 3, year: "24" },
    { id: 4, year: "25" },
    { id: 5, year: "26" },
    { id: 6, year: "27" },
    { id: 7, year: "28" },
    { id: 8, year: "29" },
    { id: 9, year: "30" },
    { id: 10, year: "31 " },
    { id: 11, year: "32 " },
    { id: 12, year: "33" },
  ]; // ta eti apo to 2022 mexri kai to 2033

  const [cardNum, setCardNum] = useState(""); // o arithmos tis kartas
  const [newMonth, setNewMonth] = useState(""); // o minas
  const [newYear, setNewYear] = useState(""); // to etos
  const [newCVV, setNewCVV] = useState(""); // to CVV

  const [failed, setFailed] = useState(null);

  function addCard(e) {
    e.preventDefault();
    const newCard = {
      card_number: `${cardNum}`,
      expiration_date: newMonth + "/" + newYear,
      cvv: newCVV,
    };

    if (jwt) {
      fetch(`https://localhost:8070/users/add_card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(newCard),
      })
        .then((response) => {
          if (response.status === 200) {
            setFailed(null);
            return response.json();
          }else{
            throw Error("Failed to Add Card!");
          }
        })
        .then((data) => {
          onClick();
          window.location.reload();
        }).catch((err)=>{
          setFailed(err.message);
        })


    }
  }


  return (
    <div className="enter">
            {failed && <h1 style={{ color: "red" }}>Error:{failed}</h1>}
      <form>
        {" "}
        <label htlmfor="cardNum">Αριθμός Κάρτας(χωρίς κενά ή παύλες) </label>
        <input
          type="text"
          id="cardNum"
          required="required"
          placeholder="1212121212121212"
          onChange={(e) => setCardNum(e.target.value)}
        ></input>
        <h4>Ημερομηνία Λήξης</h4>
        <label htlmfor="month"> Μήνας </label>
        <select
          id="month"
          name="month"
          style={{ marginBottom: "50px" }}
          onChange={(e) => {
            setNewMonth(e.target.value);
          }}
        >
          <option></option>
          {months.map((month) => {
            return <option key={month.id}>{month.month}</option>;
          })}
        </select>
        <label htlmfor="year"> Έτος </label>
        <select
          id="year"
          name="year"
          style={{ marginBottom: "50px" }}
          onChange={(e) => {
            setNewYear(e.target.value);
          }}
        >
          <option></option>
          {years.map((year) => {
            return <option key={year.id}>{year.year}</option>;
          })}
        </select>
        <label htlmfor="cvv"> CVV</label>
        <input
          type="text"
          id="cvv"
          style={{ width: "80px" }}
          maxLength="3"
          required="required"
          placeholder="123"
          onChange={(e) => setNewCVV(e.target.value)}
        ></input>
      </form>
      <button className="btn" onClick={addCard}>
        {" "}
        Προσθήκη{" "}
      </button>

    </div>
  );
}

export default AddCreditCard;
