// // store/emotions.slice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import ServiceEmotions from "@/app/api/services/emotionService";

// export const fetchCurrentEmotions = createAsyncThunk(
//   'emotions/fetchCurrent',
//   async () => await ServiceEmotions.getCurrentEmotions()
// )

// export const fetchLastPerUser = createAsyncThunk(
//   'emotions/fetchLastPerUser',
//   async () => await ServiceEmotions.getLastEmotionPerUser()
// )

// type State = { list: any[]; lastPerUser: any[]; loading: boolean; error?: string }
// const initialState: State = { list: [], lastPerUser: [], loading: false }

// const emotionsSlice = createSlice({
//   name: 'emotions',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCurrentEmotions.pending, (s) => {
//         s.loading = true
//       })
//       .addCase(fetchCurrentEmotions.fulfilled, (s, a) => {
//         s.loading = false
//         s.list = a.payload || []
//       })
//       .addCase(fetchCurrentEmotions.rejected, (s, a) => {
//         s.loading = false
//         s.error = String(a.error.message)
//       })
//       .addCase(fetchLastPerUser.pending, (s) => {
//         s.loading = true
//       })
//       .addCase(fetchLastPerUser.fulfilled, (s, a) => {
//         s.loading = false
//         s.lastPerUser = a.payload || []
//       })
//       .addCase(fetchLastPerUser.rejected, (s, a) => {
//         s.loading = false
//         s.error = String(a.error.message)
//       })
//   },
// })

// export default emotionsSlice.reducer
