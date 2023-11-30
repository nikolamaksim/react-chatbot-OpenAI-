import { createSlice } from '@reduxjs/toolkit';

const pageUpdateSlice = createSlice({
  name: 'pageUpdate',
  initialState: false,
  reducers: {
    setPageUpdate: (state) => !state
  },
});

export const { setPageUpdate } = pageUpdateSlice.actions;
export default pageUpdateSlice.reducer;