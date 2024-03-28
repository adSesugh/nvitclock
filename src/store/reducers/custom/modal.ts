import { PayloadAction, createReducer } from "@reduxjs/toolkit";
import { closeModalState, setCloseModal } from "../actions/modal";

const closeModalAction = createReducer(closeModalState, (builder) => {
    builder.addCase(setCloseModal, (state, action: PayloadAction<Function>) => {
        state.closeModal = action.payload();
    })
});


export default closeModalAction