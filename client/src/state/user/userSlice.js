import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token"),
    id: localStorage.getItem("id"),
    user: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setIdToken: (state, action) => {
            state.token = action.payload.token;
            state.id = action.payload.id;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
        }
    }
});

export const { setIdToken, setUser } = userSlice.actions;
export default userSlice.reducer;