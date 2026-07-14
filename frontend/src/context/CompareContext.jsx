import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bp_compare') || '[]'); } catch { return []; }
  });

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('bp_compare', JSON.stringify(next));
  };

  const add = (property) => {
    if (items.find(p => p.id === property.id)) return;
    if (items.length >= 4) return alert('Compare up to 4 properties only');
    persist([...items, property]);
  };
  const remove = (id) => persist(items.filter(p => p.id !== id));
  const clear = () => persist([]);

  return (
    <CompareContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
