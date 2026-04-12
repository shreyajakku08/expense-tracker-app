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

  // ---- CALCULATIONS ----
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
    <div>
      <h1>Expense Tracker</h1>

      <h3>Balance: ₹{balance}</h3>

      <h4>Income: ₹{income}</h4>
      <h4>Expense: ₹{expense}</h4>

      <input
        type="text"
        placeholder="Enter description"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Enter amount (negative for expense)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />

      <button onClick={addTransaction}>Add</button>

      <h2>Transactions</h2>

      <ul>
        {transactions.map((item, i) => {
          return (
            <li key={i}>
              {item.text} - ₹{item.amount}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;