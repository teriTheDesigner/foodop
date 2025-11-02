import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  admin: any | null;
}

interface UserState {
  users: any[];
}

const initialAdminState: AdminState = {
  admin: null,
};

const initialUserState: UserState = {
  users: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialAdminState,
  reducers: {
    setAdmin(state, action: PayloadAction<any>) {
      state.admin = action.payload;
    },
    clearAdmin(state) {
      state.admin = null;
    },
  },
});

const userSlice = createSlice({
  name: "users",
  initialState: initialUserState,
  reducers: {
    setUsers(state, action: PayloadAction<any[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<any>) {
      state.users.push(action.payload);
    },
    removeUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export const { setUsers, addUser, removeUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    admin: adminSlice.reducer,
    users: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
