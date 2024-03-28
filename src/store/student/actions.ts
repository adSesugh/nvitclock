import { createAsyncThunk } from "@reduxjs/toolkit"

import axiosInstance from '@/utils/Api'
import { GET_LEARNER, STUDENT_BOARD } from '@/utils/endpoints'
import { RootState } from ".."
import { resetState } from "../auth"


export const getLearner = createAsyncThunk(
    'student/getLearner',
    async (phone_number: string, { getState, dispatch }) => {
        try {
            const { auth: { token } } = getState() as RootState
            const response = await axiosInstance.get(`${GET_LEARNER}/${phone_number}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            return response?.data

        } catch (error) {
            if (error.response.status === 422 || error.response.status === 401) {
                return dispatch(resetState())
            }
            return error.response?.data
        }
    }
)

export const studentDashboard = createAsyncThunk(
    'student/dashboard',
    async (_, { getState, dispatch }) => {
        try {
            const { auth: { token } } = getState() as RootState
            const response = await axiosInstance.get(`${STUDENT_BOARD}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            return response?.data

        } catch (error) {
            if (error.response.status === 422 || error.response.status === 401) {
                return dispatch(resetState())
            }
            return error.response?.data
        }
    }
)