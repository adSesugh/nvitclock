import { createSlice } from "@reduxjs/toolkit"
import { getLearner, studentDashboard } from "./actions"

type StudentStateProps = {
    learner: Record<string, any> | null
    status: string | undefined,
    dashboard: Record<string, any> | undefined
    loading: boolean
}

const initialState: StudentStateProps = {
    learner: null,
    status: undefined,
    dashboard: undefined,
    loading: false
}

export const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        resetLearner: (state) => {
            state.learner = null
        },
        resetStatus: (state, action) => {
            state.status = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLearner.pending, (state) => {
            state.loading = true
        }).addCase(getLearner.fulfilled, (state, action) => {
            state.learner = action.payload.learner
            state.loading = false
        }).addCase(getLearner.rejected, (state) => {
            state.loading = false
        }).addCase(studentDashboard.pending, (state) => {
            state.loading = true
        }).addCase(studentDashboard.fulfilled, (state, action) => {
            state.dashboard = action.payload
            state.loading = false
        }).addCase(studentDashboard.rejected, (state, action) => {
            state.loading = false
        })
    }
})


export const { resetLearner, resetStatus } = studentSlice.actions

export default studentSlice.reducer