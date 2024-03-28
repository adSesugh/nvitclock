import axiosInstance from "@/utils/Api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STAFF_LOGIN, STUDENT_LOGIN, VERIFY_CODE } from "@/utils/endpoints";

interface AuthState {
    isLoggedIn: boolean
    errors: any | null
    photo: string
    token: string
    role: string
    loading: boolean
    otp: number | undefined
}

const initialState: AuthState = {
    isLoggedIn: false,
    errors: null,
    photo: null,
    token: null,
    role: null,
    loading: false,
    otp: undefined
}

export const studentSignIn = createAsyncThunk(
    'auth/student_signin',
    async (formData: { phone_number: string, deviceId: string }) => {
        try {
            const response = await axiosInstance.post(`${STUDENT_LOGIN}`, formData)
            return response?.data
        } catch (e) {
            return e.response?.data
        }
    }
)

export const staffSignIn = createAsyncThunk(
    'auth/staff_signin',
    async (email: string) => {
        try {
            const response = await axiosInstance.post(`${STAFF_LOGIN}`, { 'email': email })
            return response?.data
        } catch (e) {
            return e.response?.data
        }
    }
)

export const codeVerification = createAsyncThunk(
    'auth/staff_verify_code',
    async (params: { email: string, code: number }) => {
        try {
            const response = await axiosInstance.post(`${VERIFY_CODE}`, params)
            return response?.data
        } catch (e) {
            return e.response?.data
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetError: (state) => {
            state.errors = null
        },
        resetState: (state) => {
            state.isLoggedIn = false
            state.errors = null
            state.loading = false
            state.photo = null
            state.role = null
            state.token = null
        },
        setErrors: (state, action) => {
            state.errors = action.payload
        },
        resetLoader: (state) => {
            state.loading = false
        },
        logout: (state) => {
            state.isLoggedIn = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(studentSignIn.pending, (state) => {
            state.loading = true
        }).addCase(studentSignIn.fulfilled, (state, action) => {
            if (action.payload?.error) {
                state.errors = action.payload?.error
                state.isLoggedIn = false
            }
            else if (action.payload) {
                state.isLoggedIn = true
                state.photo = action.payload?.headshot
                state.token = action.payload?.token
                state.role = action.payload?.role
            }
            state.loading = false
        }).addCase(studentSignIn.rejected, (state, action) => {
            state.loading = false
            //console.log(action.payload)
        }).addCase(staffSignIn.pending, (state) => {
            state.loading = true
        }).addCase(staffSignIn.fulfilled, (state, action) => {
            state.loading = false
            state.otp = action.payload?.otp
            //console.log(action.payload)
        }).addCase(staffSignIn.rejected, (state, action) => {
            state.loading = false
            //console.log(action.payload)
        }).addCase(codeVerification.pending, (state) => {
            state.loading = true
        }).addCase(codeVerification.fulfilled, (state, action) => {
            if (action.payload?.error) {
                state.errors = action.payload.error
                state.isLoggedIn = false
                state.loading = false
            }
            else if (action.payload) {
                state.isLoggedIn = true
                state.token = action.payload.token
                state.role = action.payload.role
                state.loading = false
            }
        }).addCase(codeVerification.rejected, (state, action) => {
            state.loading = false
        })
    }
})


export const { resetError, resetState, setErrors, resetLoader } = authSlice.actions

export default authSlice.reducer