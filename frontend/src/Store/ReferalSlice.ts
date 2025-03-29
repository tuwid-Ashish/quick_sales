import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product{
    referralCode?: string;
    // Add other user properties here if needed
}

interface ReferalState {
    referal_id: string | null;
    product: Product | null;
}

const initialState: ReferalState = {
    referal_id: null,
    product: null,
};

const ReferalSlice = createSlice({
    name: 'referal',
    initialState,
    reducers: {
        Product: (state, action: PayloadAction<Product>) => {
            state.product = action.payload;
        },
        addrefreral : (state, action) => {
            state.referal_id = action.payload?.referralCode || null;

        }
    }
});

export const { addrefreral ,Product} = ReferalSlice.actions;
export default ReferalSlice.reducer;