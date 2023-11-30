import { configureStore } from "@reduxjs/toolkit";
import pageUpdateSlice from "./pageUpdateSlice";

const store = configureStore({
    reducer: {
        pageUpdate: pageUpdateSlice,
    },
});

export default store;