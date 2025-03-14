import { useRef } from 'react';
import { useAppDispatch } from '../../store';
import BankIcon from '../utils/icons/BankIcon';
import CashIcon from '../utils/icons/CashIcon';
import CryptoIcon from '../utils/icons/CryptoIcon';
import MoneyIcon from '../utils/icons/MoneyIcon';
import { closeTooltip, openTooltip } from '../../store/tooltip';
import { SlotWithItem } from '../../typings';
import { Locale } from '../../store/locale';

interface Props {
  moneytype: string;
  value: string;
}

const InventoryInfo: React.FC<Props> = ({ moneytype, value }) => {
  const dispatch = useAppDispatch();
  const timerRef = useRef<number | null>(null);

  const InfoLabel = (moneytype: string) => {
    if (moneytype === 'cash' || moneytype === 'money') {
      return <CashIcon />;
    } else if (moneytype === 'bank') {
      return <BankIcon />;
    } else if (moneytype === 'crypto') {
      return <CryptoIcon />;
    } else {
      return <MoneyIcon />;
    }
  };

  const inventoryType = 'player';
  const item: SlotWithItem = {
    name: Locale[`ui_${moneytype}`] || moneytype,
    slot: 0,
    count: 0,
    weight: 0,
  };

  return (
    <div
      className="inventory-grid-info"
      onMouseEnter={() => {
        timerRef.current = window.setTimeout(() => {
          dispatch(openTooltip({ item, inventoryType }));
        }, 500) as unknown as number;
      }}
      onMouseLeave={() => {
        dispatch(closeTooltip());
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }}
    >
      <div className="inventory-grid-info-label">{InfoLabel(moneytype)}</div>
      <p>
        {Locale.$} {value}
      </p>
    </div>
  );
};

export default InventoryInfo;
