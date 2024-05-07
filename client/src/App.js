// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
import MealsForm from './components/MealsForm';
import FoodDashboard from './components/FoodDashboard';
import MealData from "./components/fetchingApi"
import MealDetails from "./components/mealPost"

const App = () => {
    const [mealData, setMealData] = useState([]);

    const addMeal = (newMeal) => {
        setMealData([...mealData, newMeal]);
    };

    return (
        <Router>
            <Routes> {/* Wrap Routes */}
            <Route path="/" element={<FoodDashboard meals={mealData} />} /> 
                <Route path="/addmeal" element={<MealsForm addMeal={addMeal} />} /> 
                <Route path="/api" element={<MealData/>}/>
                <Route path="/post" element={<MealDetails/>}/>
            </Routes>
        </Router>
    );
};

export default App;
