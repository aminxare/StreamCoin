import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SortableCoinKey =
  | "current_price"
  | "price_change_percentage_24h"
  | "market_cap"
  | "total_volume";

interface MarketState {
  search: string;
  sortBy: SortableCoinKey;
  sortDirection: "asc" | "desc";
}

const initialState: MarketState = {
  search: "",
  sortBy: "market_cap",
  sortDirection: "desc",
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortableCoinKey>) {
      state.sortBy = action.payload;
    },
    toggleSortDirection(state) {
      state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
    },
    setSortDirection(state, action: PayloadAction<"asc" | "desc">) {
      state.sortDirection = action.payload;
    },
  },
});

export const {
  setSearch,
  setSortBy,
  toggleSortDirection,
  setSortDirection,
} = marketSlice.actions;

export default marketSlice.reducer;
