import { createAction } from "@reduxjs/toolkit";

export const setCloseModal = createAction<Function>('SET_CLOSE_MODAL');

interface State {
    closeModal: Function | null;
}

export const closeModalState: State = {
    closeModal: null,
};