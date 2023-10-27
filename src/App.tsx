import './App.css'
import AppLayout from './layouts/AppLayout'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useAppSelector } from './types/hooks'
import {
    selectTotalExpenses,
    selectTodayExpenses,
    deltaExpenses,
    selectExpenses,
    getWeekBounds,
} from './features/counter/counterSlice'
import Chart from './components/Chart'
import { useState } from 'react'

function App() {
    let today = new Date();
    let day = today.getDay();
    let thisDay = today.getDate() - day + (day == 0 ? -6 : 1); 
    let thisMonday = new Date(today.setDate(thisDay));
    const [week, setWeek] = useState(thisMonday)

    const count = useAppSelector(selectTotalExpenses)
    const todayCount = useAppSelector(selectTodayExpenses)
    const diff = useAppSelector(deltaExpenses)
    // console.log("select expenses: ", useAppSelector(selectExpenses))
    const handleWeek = (today: Date, type: "increase" | "decrease") => {
        if (type === "decrease"){
            const prevWeek = new Date(today);
            prevWeek.setDate(today.getDate() - 7);
            setWeek(prevWeek);
        } else {
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            setWeek(nextWeek);
        }
    }
    // console.log("getWeek: ", getWeekBounds(week)["monday"].toLocaleDateString('en-GB'))

    const currentMonday = getWeekBounds(week)["monday"].toLocaleDateString('en-GB');
    const currentSunday = getWeekBounds(week)["sunday"].toLocaleDateString('en-GB');

    return (
        <AppLayout>
            <nav className="flex h-12 w-80 justify-end gap-2">
                <img
                    src="../public/spanish.png"
                    alt="spanish"
                    className="transition-scale h-auto w-12 scale-[1] rounded-full border-2 border-custom-cream outline outline-custom-coral duration-[.2s] ease-in-out hover:scale-[1.1]"
                />
                <img
                    src="../public/english.png"
                    alt="english"
                    className="transition-scale h-auto w-12 scale-[1] rounded-full border-2 border-custom-cream outline outline-custom-coral duration-[.2s] ease-in-out hover:scale-[1.1]"
                />
                <img
                    src="../public/catalan.png"
                    alt="catalan"
                    className="transition-scale h-auto w-12 scale-[1] rounded-full border-2 border-custom-cream outline outline-custom-coral duration-[.2s] ease-in-out hover:scale-[1.1]"
                />
            </nav>
            {/* <button className="bg-teal-400 px-6 py-2 rounded-xl" onClick={() => handleWeek(week)}>click</button> */}
            <div className="flex h-20 w-80 items-center rounded-xl bg-custom-coral text-white">
                <div className="flex h-3/5 w-full pl-4">
                    <div className="flex h-full w-full flex-1 flex-col">
                        <small className="flex h-full w-full items-center text-xs">
                            Balance total
                        </small>
                        <h3 className="flex h-full w-full items-center justify-start">
                            {count} €
                        </h3>
                    </div>
                    <div className="flex-3 flex items-center gap-2 px-4">
                        <div
                            className="cursor-pointer"
                            onClick={() => handleWeek(week, "decrease")}
                        >
                            <FiArrowLeft />
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={() => handleWeek(week, "increase")}
                        >
                            <FiArrowRight />
                        </div>
                    </div>
                </div>
            </div>
        <div>{currentMonday} - {currentSunday}</div>
            <main className="flex h-auto w-80 flex-col gap-2 rounded-xl bg-slate-100 p-4">
                <h3>Gastos - última semana</h3>
                <div className="h-auto w-full border">
                    <Chart />
                </div>
                <div className="flex h-3/5 w-full items-center justify-center">
                    <div className="flex h-3/5 w-full flex-1 flex-col items-center justify-center">
                        <small className="flex h-full w-full items-center text-xs text-slate-400">
                            Gastos de hoy
                        </small>
                        <h3 className="flex h-full w-full items-center justify-start">
                            {todayCount} €
                        </h3>
                    </div>
                    <div className="flex-3 flex flex-col items-center justify-center text-xs">
                        <div className="w-full text-right">{diff}%</div>
                        <div>Respecto a ayer</div>
                    </div>
                </div>
            </main>
        </AppLayout>
    )
}

export default App
