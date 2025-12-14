import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  admin: any | null;
}

const initialAdminState: AdminState = {
  admin: null,
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
interface UserState {
  users: any[];
}

const initialUserState: UserState = {
  users: [],
};

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

interface EmployeesState {
  employees: any[];
}

const initialEmployeesState: EmployeesState = {
  employees: [],
};

const employeesSlice = createSlice({
  name: "employees",
  initialState: initialEmployeesState,
  reducers: {
    setEmployees(state, action: PayloadAction<any[]>) {
      state.employees = action.payload;
    },
    addEmployee(state, action: PayloadAction<any>) {
      state.employees.push(action.payload);
    },
    removeEmployee(state, action: PayloadAction<string>) {
      state.employees = state.employees.filter((emp) => emp.id !== action.payload);
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export const { setUsers, addUser, removeUser } = userSlice.actions;
export const { setEmployees, addEmployee, removeEmployee } = employeesSlice.actions;

const store = configureStore({
  reducer: {
    admin: adminSlice.reducer,
    users: userSlice.reducer,
    employees: employeesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
