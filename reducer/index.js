import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js"
import profileReducer from "../slices/profileSlice.js"
import cartReducer from "../slices/cartSlice.js"
import loadingBarReducer from "../slices/loadingBarSlice.js"
import courseReducer from "../slices/courseSlice.js"

const rootReducer=combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
    loadingBar: loadingBarReducer,
    course:courseReducer,
    
})
export default rootReducer;