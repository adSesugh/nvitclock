import { combineReducers } from '@reduxjs/toolkit'
import auth from '@/store/auth'
import common from '@/store/common'
import student from '@/store/student'
import staff from '@/store/staff'
import modal from '@/store/reducers/custom/modal'

export default combineReducers({
    auth,
    common,
    student,
    staff,
    modal
})