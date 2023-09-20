import { createSlice } from "@reduxjs/toolkit";

export interface PropsUserDataRD {
  user: {
    id: string;
    avatar: any;
    name: string;
    roleId: string;
    gender: boolean;
    createdAt: string;
    updatedAt: string;
    roles: {
      description: string;
      id: string;
      name: string;
      permissions: string;
    };
  } | null;
  login: boolean;
  register: boolean;
}
const initialState: PropsUserDataRD = {
  user: null,
  login: false,
  register: false,
};
const userData = createSlice({
  name: "userData",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    delUser: (state, action) => {
      state.user = action.payload;
    },
    login: (state, action) => {
      state.login = !state.login;
      state.register = false;
    },
    register: (state, action) => {
      state.login = false;
      state.register = !state.register;
    },
  },
});
export const { setUser, delUser, login, register } = userData.actions;
export default userData.reducer;
