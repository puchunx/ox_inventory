import InventoryComponent from './components/inventory';
import useNuiEvent from './hooks/useNuiEvent';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { setImagePath } from './store/imagepath';
import { setupInventory } from './store/inventory';
import { Money } from './store/money';
import { Colors, Inventory } from './typings';
import { useAppDispatch, useAppSelector } from './store';
import { debugData } from './utils/debugData';
import DragPreview from './components/utils/DragPreview';
import { fetchNui } from './utils/fetchNui';
import { useDragDropManager } from 'react-dnd';
import KeyPress from './components/utils/KeyPress';
import { useEffect } from 'react';
import { setColors } from './store/colors';
import { setAllowCustomize } from './store/allowCustomize';
import { setLogo } from './store/logo';

debugData([
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'test',
        type: 'player',
        slots: 50,
        label: 'Bob Smith',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: '鉄',
            weight: 3000,
            metadata: {
              description: `name: Svetozar Miletic  \n Gender: Male`,
              ammo: 3,
              mustard: '60%',
              ketchup: '30%',
              mayo: '10%',
            },
            count: 5,
          },
          { slot: 2, name: 'powersaw', weight: 0, count: 1, metadata: { durability: 75 } },
          { slot: 3, name: 'copper', weight: 100, count: 12, metadata: { type: 'Special' } },
          {
            slot: 4,
            name: 'water',
            weight: 100,
            count: 1,
            metadata: { description: 'Generic item description' },
          },
          { slot: 5, name: 'water', weight: 100, count: 1 },
          {
            slot: 6,
            name: 'backwoods',
            weight: 100,
            count: 1,
            metadata: {
              label: 'Russian Cream',
              imageurl: 'https://i.imgur.com/2xHhTTz.png',
            },
          },
        ],
      },
      rightInventory: {
        id: 'shop',
        type: 'crafting',
        slots: 5000,
        label: 'Bob Smith',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: 'lockpick',
            weight: 500,
            price: 300,
            ingredients: {
              iron: 5,
              copper: 12,
              powersaw: 0.1,
            },
            metadata: {
              description: 'Simple lockpick that breaks easily and can pick basic door locks',
            },
          },
        ],
      },
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();

  const { mainColor, textColor, secondaryColor, secondaryColorDark } = useAppSelector((state) => state.colors);

  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', mainColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--secondary-color-dark', secondaryColorDark);
  }, [mainColor, textColor, secondaryColor, secondaryColorDark]);

  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
    imagepath: string;
    money: string[];
    customize: boolean;
    colors?: Partial<Colors>;
    logo?: string;
  }>('init', ({ locale, items, leftInventory, imagepath, money, customize, colors, logo }) => {
    for (const name in locale) Locale[name] = locale[name];
    for (const name in items) Items[name] = items[name];
    for (const name of money) Money.push(name);

    setImagePath(imagepath);
    setLogo(logo || '');
    setAllowCustomize(customize);
    if (customize) {
      dispatch(setColors(colors || {}));
    }
    dispatch(setupInventory({ leftInventory }));
  });

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  return (
    <div className="app-wrapper">
      <InventoryComponent />
      <DragPreview />
      <KeyPress />
    </div>
  );
};

addEventListener('dragstart', function (event) {
  event.preventDefault();
});

export default App;
