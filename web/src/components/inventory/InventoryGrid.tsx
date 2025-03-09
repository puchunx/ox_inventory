import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import { Money } from '../../store/money';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import CashIcon from '../utils/icons/CashIcon';
import BankIcon from '../utils/icons/BankIcon';
import CryptoIcon from '../utils/icons/CryptoIcon';
import MoneyIcon from '../utils/icons/MoneyIcon';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  const InfoLabel = (moneytype: string) => {
    if (moneytype === 'cash') {
      return <CashIcon />;
    } else if (moneytype === 'bank') {
      return <BankIcon />;
    } else if (moneytype === 'crypto') {
      return <CryptoIcon />;
    } else {
      return <MoneyIcon />;
    }
  };

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);
  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div>
          <div className="inventory-grid-header-wrapper">
            <p>{inventory.label}</p>
            {inventory.maxWeight && (
              <p>
                {weight / 1000}/{inventory.maxWeight / 1000}kg
              </p>
            )}
          </div>
          <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
        </div>
        <div className="inventory-grid-container" ref={containerRef}>
          {inventory.type === 'player' && (
            <div className="inventory-grid-info-wrapper">
              {Money.map((moneytype) => (
                <div className="inventory-grid-info" key={`${inventory.type}-${inventory.id}-${moneytype}`}>
                  <div className="inventory-grid-info-label">{InfoLabel(moneytype)}</div>
                  <p>$ {inventory.money?.[moneytype]?.toLocaleString() || 0}</p>
                </div>
              ))}
            </div>
          )}
          <div className="inventory-grid">
            {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
