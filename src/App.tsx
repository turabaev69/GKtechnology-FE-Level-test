import './style/index.scss';
import React, { useState, useEffect } from 'react';
import { TokenSelector } from './component/TokenSelector';
import LoadingDot from './component/LoadingDot';




const Main: React.FC = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [payCurrency, setPayCurrency] = useState<string | null>('CTC');
  const [receiveCurrency, setReceiveCurrency] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState<number | null>(null);
  const [receiveAmount, setReceiveAmount] = useState<number | null>(null);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await fetch(
          'https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-balance'
        );
        const data = await response.json();
        setBalances(data);
      } catch (error) {
        console.error('Failed to fetch balances', error);
      }
    };

    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-price'
        );
        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error('Failed to fetch prices', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBalances(), fetchPrices()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (payAmount && payCurrency && receiveCurrency) {
      const totalPayValue = (payAmount * prices[payCurrency]) || 0;
      const calculatedReceiveAmount = totalPayValue / (prices[receiveCurrency] || 1);
      setReceiveAmount(calculatedReceiveAmount);
    } else {
      setReceiveAmount(null);
    }
  }, [payAmount, payCurrency, receiveCurrency, prices]);

  const toggleTokenSelectorOpen = () => setIsTokenSelectorOpen(!isTokenSelectorOpen);

  const swapCurrencies = () => {
    setPayCurrency(receiveCurrency);
    setReceiveCurrency(payCurrency);
    setPayAmount(null);
    setReceiveAmount(null);
  };

  const handleSwap = async () => {
    if (payAmount && payCurrency && receiveCurrency) {
      try {
        const response = await fetch(
          'https://inhousedashboard-test-app.azurewebsites.net/api/Interview/post-swap',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payCurrency,
              payAmount,
              receiveCurrency,
              receiveAmount,
            }),
          }
        );
        const result = await response.json();

        alert('Swap Successful: ' + JSON.stringify(result));
      } catch (error) {
        console.error('Failed to swap', error);
      }
    }
  };

  if (loading) {
    return <LoadingDot size="lg" />;
  }

  return (
    <>
      <div>
        <section className="page swap-page">
          <div className="box-content">
            <div className="heading">
              <h2>Swap</h2>
            </div>

            <div className="swap-dashboard">
              <div className="swap-item active">
                <div className="title">
                  <h3>You pay</h3>
                </div>
                <div className="amount-input">
                  <div className="input">
                    <input
                      type="number"
                      placeholder="0"
                      value={payAmount || ''}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                    />
                  </div>
                  <button
                    type="button"
                    className="currency-label"
                    onClick={() => toggleTokenSelectorOpen()}
                  >
                    <strong className="name">{payCurrency || 'Select token'}</strong>
                  </button>
                </div>
                <div className="amount item-flex">
                  <div className="balance">
                    <span>Balance: {payCurrency ? balances[payCurrency] || 0 : 0}</span>
                  </div>
                </div>
              </div>

              <button type="button" className="mark" onClick={swapCurrencies}>
                ↔️
              </button>

              <div className="swap-item">
                <div className="title">
                  <h3>You receive</h3>
                </div>
                <div className="amount-input">
                  <div className="input">
                    <input type="number" placeholder="0" value={receiveAmount || ''} readOnly />
                  </div>
                  <button
                    type="button"
                    className="currency-label"
                    onClick={() => toggleTokenSelectorOpen()}
                  >
                    <strong className="name">{receiveCurrency || 'Select token'}</strong>
                  </button>
                </div>
                <div className="amount item-flex">
                  <div className="balance">
                    <span>Balance: {receiveCurrency ? balances[receiveCurrency] || 0 : 0}</span>
                  </div>
                </div>
              </div>

              <div className="button-wrap">
                <button
                  type="button"
                  className="normal"
                  disabled={!payAmount || !payCurrency || !receiveCurrency || payAmount > (balances[payCurrency] || 0)}
                  onClick={handleSwap}
                >
                  Swap
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isTokenSelectorOpen && (
        <TokenSelector
          onClose={() => setIsTokenSelectorOpen(false)}
          onSelect={(token) => {
            if (!payCurrency) setPayCurrency(token);
            else setReceiveCurrency(token);
            setIsTokenSelectorOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Main;



