import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  course: {},
  editCourse: false,
  paymentLoading: false,
}

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      console.log("Setting step to:", action.payload);  // Debug log
      state.step = action.payload;
    },
    setCourse: (state, action) => {
      console.log("Setting course to:", action.payload);  // Debug log
      state.course = action.payload;
    },
    setEditCourse: (state, action) => {
      console.log("Setting editCourse to:", action.payload);  // Debug log
      state.editCourse = action.payload;
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload;
    },
    resetCourseState: (state) => {
      console.log("Resetting course state to initial values");  // Debug log
      state.step = 1;
      state.course = {};
      state.editCourse = false;
    },
  },
})


export const {
  setStep,
  setCourse,
  setEditCourse,
  setPaymentLoading,
  resetCourseState,
} = courseSlice.actions

export default courseSlice.reducer