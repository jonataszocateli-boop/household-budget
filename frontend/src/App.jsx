import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const defaultDate = new Date();
    // Use the 2026-02 context we discussed, or default to current month
    // We'll just hardcode 2026-02 for default given the demo context, but let's do real dynamic
    const year = defaultDate.getFullYear();
    const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  })

  const [budgetData, setBudgetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form State
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('INCOME')
  const [formConfig, setFormConfig] = useState(false)

  const fetchMonthData = (yearMonth) => {
    setLoading(true)
    fetch(`http://localhost:8081/api/budget/${yearMonth}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch budget data')
        return res.json()
      })
      .then(data => {
        setBudgetData(data)
        setError(null)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setError('Failed to connect to backend.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMonthData(currentMonth)
  }, [currentMonth])

  const handleMonthChange = (e) => {
    setCurrentMonth(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!desc || !amount) return;

    setFormConfig(true)

    fetch(`http://localhost:8081/api/budget/${currentMonth}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: desc,
        amount: parseFloat(amount),
        type: type
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add transaction')
        setDesc('')
        setAmount('')
        setType('INCOME')
        // Refresh the data!
        fetchMonthData(currentMonth);
      })
      .catch(err => {
        console.error("Error posting transaction", err)
        alert("Failed to save transaction!")
      })
      .finally(() => {
        setFormConfig(false)
      })
  }

  const deleteTransaction = (id) => {
    fetch(`http://localhost:8081/api/budget/${currentMonth}/transactions/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete transaction')
        // Refresh the data!
        fetchMonthData(currentMonth);
      })
      .catch(err => {
        console.error("Error deleting transaction", err)
        alert("Failed to delete transaction!")
      })
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-group">
          <h1>Household Budget</h1>
          <p className="subtitle">Track your finances with ease</p>
        </div>
      </header>

      <main className="main-content">

        {/* Month Selector */}
        <div className="controls-bar">
          <div className="month-picker">
            <label htmlFor="month">Select Month: </label>
            <input
              type="month"
              id="month"
              name="month"
              value={currentMonth}
              onChange={handleMonthChange}
            />
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {/* Dashboard Totals */}
        <section className="dashboard-cards">
          <div className="card income-card">
            <h3>Total Income</h3>
            <p className="amount positive">
              ${loading ? '...' : (budgetData?.totalIncome?.toFixed(2) || '0.00')}
            </p>
          </div>

          <div className="card expense-card">
            <h3>Total Expense</h3>
            <p className="amount negative">
              ${loading ? '...' : (budgetData?.totalExpense?.toFixed(2) || '0.00')}
            </p>
          </div>

          <div className={`card net-card ${!loading && budgetData?.netAmount < 0 ? 'negative-bg' : 'positive-bg'}`}>
            <h3>Net Amount</h3>
            <p className="amount">
              ${loading ? '...' : (budgetData?.netAmount?.toFixed(2) || '0.00')}
            </p>
          </div>
        </section>

        {/* Add Transaction Form */}
        <section className="form-section">
          <h2>Add Transaction</h2>
          <form className="transaction-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Description (e.g., Salary, Rent)"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount ($)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <button type="submit" disabled={formConfig}>
              {formConfig ? 'Saving...' : 'Add Transaction'}
            </button>
          </form>
        </section>

        {/* Lists Container */}
        <section className="lists-container">
          <div className="list-column">
            <h3>Incomes</h3>
            {loading ? <p>Loading...</p> :
              (budgetData?.incomes?.length === 0 ? <p className="empty-state">No incomes for this month.</p> :
                <ul className="transaction-list">
                  {budgetData?.incomes.map(inc => (
                    <li key={inc.id} className="transaction-item income-item">
                      <span className="desc">{inc.description}</span>
                      <div className="action-group">
                        <span className="val">+${inc.amount.toFixed(2)}</span>
                        <button className="delete-btn" onClick={() => deleteTransaction(inc.id)} aria-label="Delete transaction">&times;</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          </div>

          <div className="list-column">
            <h3>Expenses</h3>
            {loading ? <p>Loading...</p> :
              (budgetData?.expenses?.length === 0 ? <p className="empty-state">No expenses for this month.</p> :
                <ul className="transaction-list">
                  {budgetData?.expenses.map(exp => (
                    <li key={exp.id} className="transaction-item expense-item">
                      <span className="desc">{exp.description}</span>
                      <div className="action-group">
                        <span className="val">-${exp.amount.toFixed(2)}</span>
                        <button className="delete-btn" onClick={() => deleteTransaction(exp.id)} aria-label="Delete transaction">&times;</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
