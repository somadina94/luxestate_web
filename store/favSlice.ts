import { createSlice } from '@reduxjs/toolkit';
import { Meal } from 'types/meal';

interface FavState {
  favs: Meal[];
}

const initialState: FavState = {
  favs: [],
};

const favSlice = createSlice({
  name: 'fav',
  initialState,
  reducers: {
    add(state, action) {
      const existingFav = state.favs.find((fav) => fav.id === action.payload.id);
      if (existingFav) return;
      state.favs.push(action.payload);
    },
    remove(state, action) {
      const existingFav = state.favs.find((fav) => fav.id === action.payload.id);
      if (!existingFav) return;
      state.favs = state.favs.filter((fav) => fav.id !== action.payload.id);
    },
    clear(state) {
      state.favs = [];
    },
  },
});

export const { add, remove, clear } = favSlice.actions;
export default favSlice.reducer;
