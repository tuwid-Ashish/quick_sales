import { User } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    status: boolean;
    rule: string;
    user: User | null;
}

const initialState: AuthState = {
    status: false,
    rule: "agent",
    user: null,
}

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.status = action.payload?._id ? true : false;
            state.rule = action.payload?.role ?? "agent";
            state.user = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.user = null;
        },
    }
});

export const { login, logout} = AuthSlice.actions;
export default AuthSlice.reducer;