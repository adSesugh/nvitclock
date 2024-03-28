import { createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "./actions";

type StaffStateProps = {
    stats: Record<string, any> | undefined
}

const initialState: StaffStateProps = {
    stats: undefined
}


export const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDashboard.fulfilled, (state, action) => {
            state.stats = action.payload?.records
        })
    }
})

export const { } = staffSlice.actions

export default staffSlice.reducer