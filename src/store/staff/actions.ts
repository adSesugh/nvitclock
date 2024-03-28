import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import axiosInstance from "@/utils/Api";
import { STAFF_BOARD } from "@/utils/endpoints";
import { resetError, resetState } from "../auth";

export const getDashboard = createAsyncThunk(
    'staff/dashboard',
    async (_, { getState, dispatch }) => {
        try {
            const { auth: { token } } = getState() as RootState
            const response = await axiosInstance.get(`${STAFF_BOARD}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            return response.data
        } catch (error) {
            if (error.response.status === 422 || error.response.status === 401) {
                return dispatch(resetState())
            }
        }
    }
)