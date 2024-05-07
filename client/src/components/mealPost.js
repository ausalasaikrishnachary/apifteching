// MealDetails.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './mealPost.scss';

const MealDetails = () => {
  const navigate = useNavigate();
  const [mealData, setMealData] = useState({
    tenant_name: 'Bhargav',
    date: '', // Change initial value to empty string
    breakfast: true,
    lunch: true,
    dinner: true,
    comments: '', // Change initial value to empty string
    building_name: 'ANB1',
    manager_email: 'tanandbabu@yahoo.co.in',
    floor_no: 1,
    room_no: 2,
    bed_no: 1,
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(mealData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post('https://iiiqbets.com/pg-management/MEALS-POST-by-tenant-API.php', mealData);
        alert('Successfully Data Registered');
        navigate('/api');
      } catch (error) {
        console.error('Error fetching meal data:', error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validate = (data) => {
    const errors = {};
    if (!data.date) {
      errors.date = 'Date is required';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setMealData((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="meals-form">
        <div className="heading">
          <h1>MealsForm</h1>
        </div>
        <div className="checkbox-group">
        <label>
            <input
              type="checkbox"
              name="breakfast"
              checked={mealData.breakfast}
              onChange={handleChange}
            />
            Breakfast
          </label>
          <label>
            <input
              type="checkbox"
              name="lunch"
              checked={mealData.lunch}
              onChange={handleChange}
            />
            Lunch
          </label>
          <label>
            <input
              type="checkbox"
              name="dinner"
              checked={mealData.dinner}
              onChange={handleChange}
            />
            Dinner
          </label>
        </div>
        <div className="input-group">
          <label>
            Date:
            <br />
            <input
              type="date"
              name="date"
              value={mealData.date} 
              onChange={handleChange}
            />
          </label>
          {errors.date && <div className="error">{errors.date}</div>}
        </div>
        <div className="input-group">
          <label>
            Comment:
            <br />
            <textarea
              name="comments"
              value={mealData.comments} 
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MealDetails;
