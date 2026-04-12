import React, { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const addTransaction = () => {
    if (text === "" || amount === "") {
      alert("Enter all fields");
      return;
    }

    const newItem = {
      text: text,
      amount: Number(amount)
    };

    setTransactions([...transactions, newItem]);

    setText("");
    setAmount("");
  };

  const deleteTransaction = (index) => {
    const updatedList = transactions.filter((item, i) => i !== index);
    setTransactions(updatedList);
  };

  // calculations
  let balance = 0;
  let income = 0;
  let expense = 0;

  for (let i = 0; i < transactions.length; i++) {
    balance = balance + transactions[i].amount;

    if (transactions[i].amount > 0) {
      income = income + transactions[i].amount;
    } else {
      expense = expense + transactions[i].amount;
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Expense Tracker</h1>

      <h3>Income: ₹{income}</h3>
      <h3>Expense: ₹{expense}</h3>
      <h3>Balance: ₹{balance}</h3>

      <input
        type="text"
        placeholder="Enter description"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />

      <button onClick={addTransaction}>Add</button>

      <h2>Transactions</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {transactions.map((item, i) => {
          return (
            <li
              key={i}
              style={{
                margin: "10px",
                color: item.amount < 0 ? "red" : "green"
              }}
            >
              {item.text} - ₹{item.amount}

              <button
                onClick={() => deleteTransaction(i)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;