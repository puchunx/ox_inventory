import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColorLabel, Colors } from '../typings';
import tinycolor from 'tinycolor2';

const initialState: Colors = {
  mainColor: '#22232c',
  textColor: '#c1c2c5',
  backgroundColor: '#0c0c0c',
  secondaryColor: 'rgba(12, 12, 12, 0.4)',
  secondaryColorDark: 'rgba(12, 12, 12, 0.8)',
  opacity: 40,
};

const updateSecondaryColor = (state: any) => {
  const alpha = state.opacity / 100;
  const backgroundColor = tinycolor(state.backgroundColor);
  state.secondaryColor = backgroundColor.setAlpha(alpha).toRgbString();
  state.secondaryColorDark = backgroundColor.setAlpha((alpha + 2) / 3).toRgbString();
};

export const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    setColors: (state, action: PayloadAction<Partial<Colors>>) => {
      Object.assign(state, action.payload);
      updateSecondaryColor(state);
    },

    setColor: (state, action: PayloadAction<{ label: ColorLabel; value: string }>) => {
      state[action.payload.label] = action.payload.value;
      updateSecondaryColor(state);
    },

    setOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload;
      updateSecondaryColor(state);
    },

    resetColors: () => {
      return { ...initialState };
    },
  },
});

export const { setColors, setColor, setOpacity, resetColors } = colorSlice.actions;

export default colorSlice.reducer;
