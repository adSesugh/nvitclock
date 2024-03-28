import axiosInstance from "@/utils/Api";
import { createAsyncThunk, createSlice, createAction, PayloadAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "..";
import { PROFILE, QR_CODE } from "@/utils/endpoints";
import { resetState } from "../auth";

interface AuthState {
    errors: any | null
    qrCode: string
    profile: Record<string, any>
    pointerEnable: boolean,
    loading: boolean
}



const initialState: AuthState = {
    errors: null,
    qrCode: null,
    profile: {},
    pointerEnable: false,
    loading: false
}

export const getProfile = createAsyncThunk(
    'auth/profile',
    async (_, { getState, dispatch }) => {
        try {
            const { auth: { token } } = getState() as RootState
            const response = await axiosInstance.get(`${PROFILE}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            return response.data
        } catch (e) {
            if (e.response.status === 422 || e.response.status === 401) {
                dispatch(resetState())
            }
            return e.response.data
        }
    }
)

export const userQrCode = createAsyncThunk(
    'auth/qrcode',
    async (_, { getState, dispatch }) => {
        try {
            const { auth: { token } } = getState() as RootState
            const response = await axiosInstance.get(`${QR_CODE}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            return response.data
        } catch (e) {
            if (e.response.status === 422 || e.response.status === 401) {
                dispatch(resetState())
            }
            return e.response.data
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
        resetQRCode: (state) => {
            state.qrCode = null
        },
        setPointerEnable: (state) => {
            state.pointerEnable = !state.pointerEnable
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userQrCode.pending, (state) => {
            state.loading = true
        }).addCase(userQrCode.fulfilled, (state, action) => {
            state.qrCode = action.payload.qr_code
            state.loading = false
        }).addCase(userQrCode.rejected, (state) => {
            state.loading = false
            state.qrCode = null
        }).addCase(getProfile.pending, (state) => {
            state.loading = true
        }).addCase(getProfile.fulfilled, (state, action) => {
            state.profile = action.payload
            state.loading = false
        }).addCase(getProfile.rejected, (state) => {
            state.loading = false
        })
    }
})


export const { resetError, resetQRCode } = authSlice.actions

export default authSlice.reducer