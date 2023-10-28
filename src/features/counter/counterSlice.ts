import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'

type ExpenseState = {
    expenses: { [date: string]: number }
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const startDate = new Date('2023-10-26')
const expenses: { [date: string]: number } = {}

for (let i = 0; i < 21; i++) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    const day = currentDate.getDate().toString().padStart(2, '0')
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const year = currentDate.getFullYear()
    const dateKey = `${day}/${month}/${year}`
    expenses[dateKey] = getRandomInt(10, 300)
}

// console.log(expenses)

export const getWeekBounds = (d?: Date) => {
    const newDate = new Date(d);
    let day = newDate.getDay();
    
    // Calculate Monday
    let diffToMonday = newDate.getDate() - day + (day == 0 ? -6 : 1); 
    let monday = new Date(newDate.setDate(diffToMonday));

    // Calculate Sunday
    let diffToSunday = diffToMonday + 6;
    let sunday = new Date(newDate.setDate(diffToSunday));

    const inWeek = new Date(d) >= monday && new Date(d) <= sunday;
    // console.log("inWeek: ", inWeek)
    return { monday, sunday };
}



const initialState: ExpenseState = {
    expenses: {
        ...expenses,
    },
}

export const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        addExpense: (
            state,
            action: PayloadAction<{ date: string; amount: number }>,
        ) => {
            state.expenses[action.payload.date] = action.payload.amount
        },
        updateExpense: (
            state,
            action: PayloadAction<{ date: string; amount: number }>,
        ) => {
            if (state.expenses[action.payload.date]) {
                state.expenses[action.payload.date] = action.payload.amount
            }
        },
        removeExpense: (state, action: PayloadAction<string>) => {
            delete state.expenses[action.payload]
        },
    },
})

export const { addExpense, updateExpense, removeExpense } = expenseSlice.actions

export const selectExpenses = (state: RootState) => state.expenses.expenses

export const selectTotalExpenses = (state: RootState) => {
    return Object.values(state.expenses.expenses).reduce(
        (sum, amount) => sum + amount,
        0,
    )
}

export const selectTodayExpenses = (state: RootState) => {
    const today = new Date().toLocaleDateString('en-GB')
    return state.expenses.expenses[today] || 0
}

export const deltaExpenses = (state: RootState) => {
    const today = selectTodayExpenses(state)
    const yesterday = new Date(
        new Date().getTime() - 24 * 60 * 60 * 1000,
    ).toLocaleDateString('en-GB')
    return (
        (today / (state.expenses.expenses[yesterday] || 0) - 1) *
        100
    ).toFixed(2)
}

export default expenseSlice.reducer
