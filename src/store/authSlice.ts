import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RegisterForm {
  // Step 1 – Account
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2 – Personal
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
}

interface AuthState {
  step: 1 | 2 | 3;
  form: RegisterForm;
  submitted: boolean;
}

const blank: RegisterForm = {
  email: '', password: '', confirmPassword: '',
  firstName: '', lastName: '', phone: '', dob: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { step: 1, form: blank, submitted: false } as AuthState,
  reducers: {
    nextStep(state) {
      if (state.step < 3) state.step = (state.step + 1) as 1 | 2 | 3;
    },
    prevStep(state) {
      if (state.step > 1) state.step = (state.step - 1) as 1 | 2 | 3;
    },
    updateForm(state, action: PayloadAction<Partial<RegisterForm>>) {
      state.form = { ...state.form, ...action.payload };
    },
    submitRegister(state) {
      state.submitted = true;
    },
    resetRegister: () => ({ step: 1, form: blank, submitted: false } as AuthState),
  },
});

export const { nextStep, prevStep, updateForm, submitRegister, resetRegister } = authSlice.actions;
export default authSlice.reducer;
