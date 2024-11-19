import React from 'react';

interface TokenSelectorProps {
  onClose: () => void;
  onSelect: (token: string) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ onClose, onSelect }) => {
  const tokens = ['CTC', 'USDC', 'USDT', 'WCTC'];

  return (
    <section className="layer-wrap">
      <div className="dimmed" onClick={onClose}></div>
      <div className="layer-container">
        <header className="layer-header">
          <div className="inner">
            <h3>Select a token</h3>
            <button type="button" className="button-close" onClick={onClose}>
              <i className="blind">Close</i>
            </button>
          </div>
        </header>
        <div className="layer-content">
          <div className="inner">
            <div className="select-token-wrap">
              <div className="currency-list-wrap">
                <div className="lists">
                  {tokens.map((token) => (
                    <button
                      type="button"
                      key={token}
                      className="currency-label"
                      onClick={() => onSelect(token)}
                    >
                      <div className="name">{token}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
