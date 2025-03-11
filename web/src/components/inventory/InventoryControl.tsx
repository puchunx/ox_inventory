import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { DragSource } from '../../typings';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { AllowCustomize } from '../../store/allowCustomize';
import UsefulControls from './UsefulControls';
import ColorSettings from './ColorSettings';
import { Logo } from '../../store/logo';

const InventoryControl: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();

  const [controlsVisible, setControlsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const [, use] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [, give] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.valueAsNumber =
      isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
    dispatch(setItemAmount(event.target.valueAsNumber));
  };

  const AddButton: React.FC<{ amount: number }> = ({ amount }) => {
    const addAmount = () => {
      dispatch(setItemAmount(itemAmount + amount));
    };

    return (
      <button className="inventory-control-button" onClick={addAmount}>
        +{amount}
      </button>
    );
  };

  return (
    <>
      <ColorSettings visible={settingsVisible} setVisible={setSettingsVisible} />
      <UsefulControls visible={controlsVisible} setVisible={setControlsVisible} />
      <div className="inventory-control">
        <div className="inventory-control-wrapper">
          {Logo && (
            <div className="inventory-control-logo-wrapper">
              <img className="inventory-control-logo" src={Logo} />
            </div>
          )}
          <div className="inventory-control-input-wrapper">
            <input
              className="inventory-control-input"
              type="number"
              value={itemAmount}
              onChange={inputHandler}
              min={0}
            />
            <div className="inventory-control-button-wrapper">
              <button className="inventory-control-button" onClick={() => dispatch(setItemAmount(0))}>
                0
              </button>
              {[1, 10, 100].map((value, index) => (
                <AddButton key={index} amount={value} />
              ))}
            </div>
          </div>
          <button className="inventory-control-button" ref={use}>
            {Locale.ui_use || 'Use'}
          </button>
          <button className="inventory-control-button" ref={give}>
            {Locale.ui_give || 'Give'}
          </button>
          <button className="inventory-control-button" onClick={() => fetchNui('exit')}>
            {Locale.ui_close || 'Close'}
          </button>
        </div>
      </div>

      <div className="action-button-wrapper">
        {AllowCustomize && (
          <button className="action-button" onClick={() => setSettingsVisible(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.6rem" viewBox="0 0 384 512">
              <path d="M162.4 6c-1.5-3.6-5-6-8.9-6l-19 0c-3.9 0-7.5 2.4-8.9 6L104.9 57.7c-3.2 8-14.6 8-17.8 0L66.4 6c-1.5-3.6-5-6-8.9-6L48 0C21.5 0 0 21.5 0 48L0 224l0 22.4L0 256l9.6 0 364.8 0 9.6 0 0-9.6 0-22.4 0-176c0-26.5-21.5-48-48-48L230.5 0c-3.9 0-7.5 2.4-8.9 6L200.9 57.7c-3.2 8-14.6 8-17.8 0L162.4 6zM0 288l0 32c0 35.3 28.7 64 64 64l64 0 0 64c0 35.3 28.7 64 64 64s64-28.7 64-64l0-64 64 0c35.3 0 64-28.7 64-64l0-32L0 288zM192 432a16 16 0 1 1 0 32 16 16 0 1 1 0-32z" />
            </svg>
          </button>
        )}
        <button className="action-button" onClick={() => setControlsVisible(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1.6rem" viewBox="0 0 524 524">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default InventoryControl;
