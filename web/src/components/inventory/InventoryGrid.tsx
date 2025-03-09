import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

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
          {inventory.type === 'player' && inventory.money && (
            <div className="inventory-grid-info-wrapper">
              {inventory.money.hasOwnProperty('cash') && (
                <div className="inventory-grid-info">
                  <div className="inventory-grid-info-label">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960">
                      <path d="M540.94-448.39q-39.56 0-66.82-27.26-27.27-27.27-27.27-66.93 0-39.65 27.39-66.67 27.39-27.02 66.96-27.02 39.16 0 66.34 27.21 27.19 27.21 27.19 66.52 0 39.31-26.99 66.73-26.98 27.42-66.8 27.42Zm-267.55 99.85q-24.87 0-42.57-17.72t-17.7-42.6v-267.26q0-24.89 17.7-42.44 17.7-17.55 42.57-17.55H809q24.86 0 42.56 17.72 17.71 17.72 17.71 42.6v267.26q0 24.88-17.71 42.44-17.7 17.55-42.56 17.55H273.39Zm49.57-47.96h436.46q0-26.42 18.18-44.67t43.71-18.25v-166.04q-25.82 0-43.85-18.33-18.04-18.34-18.04-44.36H322.96q0 26.42-18.18 44.67t-43.7 18.25v166.04q25.81 0 43.85 18.33 18.03 18.33 18.03 44.36Zm428.69 169.54H151q-24.86 0-42.56-17.71-17.71-17.7-17.71-42.56V-642.5h47.96v355.27q0 4.61 3.85 8.46 3.85 3.85 8.46 3.85h600.65v47.96ZM273.39-396.5h-12.31v-291.65h12.31q-5.01 0-8.66 3.65-3.65 3.65-3.65 8.66v267.03q0 5 3.65 8.66 3.65 3.65 8.66 3.65Z" />
                    </svg>
                  </div>
                  <p>$ {inventory.money.cash.toLocaleString()}</p>
                </div>
              )}
              {inventory.money.hasOwnProperty('bank') && (
                <div className="inventory-grid-info">
                  <div className="inventory-grid-info-label">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960">
                      <path d="M635.79-534.73q11.79 0 20.73-8.64 8.94-8.63 8.94-20.42 0-11.79-8.73-20.73-8.73-8.94-20.52-8.94t-20.63 8.73q-8.85 8.73-8.85 20.52t8.64 20.63q8.63 8.85 20.42 8.85Zm-297.67-77.39h187.96v-47.96H338.12v47.96Zm-129.71 446Q179.23-285 148.67-382.3q-30.55-97.3-30.55-193.77 0-80.94 56.45-137.47 56.45-56.54 137.43-56.54h210.33q28.17-33.07 66.76-52.53 38.6-19.47 82.91-19.47 10.64 0 18.36 7.65 7.72 7.65 7.72 18.35 0 5.87-1.72 11.79-1.71 5.92-4.75 12.17-7.03 13.97-11.82 27.42-4.79 13.46-7.25 28.43l110.19 110.19h59.35v225.85l-103.96 22.77-58.74 211.34H502.12v-72H386.08v72H208.41Zm35.97-47.96h93.74v-72h211.96v72h92.54l57.19-205.26 94.31-21.04v-137.74h-31.31L626.12-714.97q0-19.05 2.8-37.63 2.81-18.57 8.77-36.94-27.19 7.97-50.58 24.52-23.38 16.56-41.73 42.9H312q-60.45 0-103.19 42.81-42.73 42.8-42.73 103.36 0 83.76 26.6 172.63 26.6 88.87 51.7 189.24ZM480-480.5Z" />
                    </svg>
                  </div>
                  <p>$ {inventory.money.bank.toLocaleString()}</p>
                </div>
              )}
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
