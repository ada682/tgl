import React, { useState } from 'react';
import axios from 'axios';
import { FaCalculator, FaHistory, FaInfoCircle } from 'react-icons/fa';
import './App.css';

function App() {
  const [market, setMarket] = useState('sgp');
  const [method, setMethod] = useState('ekorKepala');
  const [inputNumbers, setInputNumbers] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const markets = [
    { id: 'sgp', name: 'Singapore' },
    { id: 'hk', name: 'Hongkong' },
    { id: 'sdy', name: 'Sydney' },
    { id: 'kamboja', name: 'Kamboja' },
    { id: 'taiwan', name: 'Taiwan' }
  ];

  const methods = [
    { id: 'ekorKepala', name: 'Ekor & Kepala' },
    { id: 'shio', name: 'Shio' },
    { id: 'hotnumbers', name: 'Hot Numbers' }
  ];

  const calculate = async () => {
    if (!inputNumbers.trim()) {
      setError('Please enter previous numbers');
      return;
    }

    const numbers = inputNumbers.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (numbers.length === 0) {
      setError('Invalid numbers format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://178.128.91.32:5000/api/calculate', {
        market,
        numbers,
        method
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to calculate. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Togel Prediction Calculator</h1>
        <p className="powered-by">Powered by <span>DGN29</span></p>
      </header>

      <main className="calculator">
        <div className="form-group">
          <label>Pasaran:</label>
          <select value={market} onChange={(e) => setMarket(e.target.value)}>
            {markets.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Metode:</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {methods.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            Previous Numbers (comma separated):
            <span className="info-tooltip">
              <FaInfoCircle />
              <span className="tooltip-text">Example: 1234, 5678, 9012</span>
            </span>
          </label>
          <textarea
            value={inputNumbers}
            onChange={(e) => setInputNumbers(e.target.value)}
            placeholder="Enter previous numbers separated by commas"
            rows={3}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button onClick={calculate} disabled={loading}>
          <FaCalculator /> {loading ? 'Calculating...' : 'Calculate'}
        </button>

        {result && (
          <div className="result-container">
            <h3><FaHistory /> Prediction Result</h3>
            <div className="result-details">
              <p><strong>Market:</strong> {markets.find(m => m.id === result.market)?.name}</p>
              <p><strong>Method:</strong> {methods.find(m => m.id === result.method)?.name}</p>
              <p><strong>Previous Numbers:</strong> {result.previousNumbers.join(', ')}</p>
            </div>
            
            <div className="predicted-numbers">
              <h4>Predicted Numbers:</h4>
              <div className="numbers-grid">
                {result.predictedNumbers.map((num, index) => (
                  <div key={index} className="number-box">{num}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Disclaimer: This is for entertainment purposes only. No guaranteed results.</p>
      </footer>
    </div>
  );
}

export default App;
