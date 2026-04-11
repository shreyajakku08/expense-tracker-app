import { useState } from "react";

function App() {
  const [transactions, setTransactions] = useState([]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Expense Tracker</h1>

      <h3>Balance: ₹0</h3>

      <input type="text" placeholder="Enter description" />
      <input type="number" placeholder="Enter amount" />
      <br /><br />
      <button>Add Transaction</button>

      <h2>Transactions</h2>
      <ul>
        {transactions.map((t, index) => (
          <li key={index}>
            {t.text} - ₹{t.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;