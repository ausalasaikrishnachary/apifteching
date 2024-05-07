import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MealsForm.scss';

const MealsForm = () => {
    const navigate = useNavigate();
    const [meals, setMeals] = useState({
        breakfast: false,
        lunch: false,
        dinner: false,
    });
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});

    const handleMealChange = (e) => {
        const { name, checked } = e.target;
        setMeals((prevMeals) => ({
            ...prevMeals,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form fields
        const validationErrors = {};
        if (!date) {
            validationErrors.date = 'Date is required';
        }
        if (!meals.breakfast && !meals.lunch && !meals.dinner) {
            validationErrors.meals = 'Please select at least one meal';
        }
        if (!comment.trim()) {
            validationErrors.comment = 'Comment is required';
        }
        setErrors(validationErrors);
    
        if (Object.keys(validationErrors).length === 0) {
            // Construct the meal object
            const newMeal = {
                meals: meals,
                date: date,
                comment: comment,
            };
    
            try {
                // Make a POST request to store the meal data on the server
                const response = await fetch('http://localhost:4000/api/meals', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newMeal),
                });
    
                if (response.ok) {
                    // Parse the response as JSON if it's valid
                    const responseData = await response.json();
    
                    // Reset form fields and errors
                    setMeals({
                        breakfast: false,
                        lunch: false,
                        dinner: false,
                    });
                    setDate('');
                    setComment('');
                    setErrors({});
    
                    // Navigate to FoodDashboard page
                    navigate("/", { state: { mealData: responseData } });
                } else {
                    // Handle error
                    console.error('Failed to store meal data:', response.statusText);
                }
            } catch (err) {
                console.error('Error storing meal data:', err);
                // Handle network or other errors
            }
        }
    };
    

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="meals-form">
                <div className='heading'>
                    <h1>MealsForm</h1>
                </div>
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="breakfast"
                            checked={meals.breakfast}
                            onChange={handleMealChange}
                        />
                        Breakfast
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="lunch"
                            checked={meals.lunch}
                            onChange={handleMealChange}
                        />
                        Lunch
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="dinner"
                            checked={meals.dinner}
                            onChange={handleMealChange}
                        />
                        Dinner
                    </label>
                    {errors.meals && <div className="error"></div>}
                </div>
                <div className="input-group">
                    <label>
                        Date:
                        <br />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                    {errors.date && <div className="error"></div>}
                </div>
                <div className="input-group">
                    <label>
                        Comment:
                        <br />
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default MealsForm;
