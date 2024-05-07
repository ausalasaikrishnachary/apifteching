import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Checkbox, Button, TextField, IconButton, Modal, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faTimes } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative', // Ensure positioning for the ellipsis icon
  },
  ellipsisIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px', // Adjust the position to the right side
    cursor: 'pointer',
  },
  container: {
    margin: '0 auto', // centers the content horizontally
    maxWidth: '1200px', // adjust the maximum width as needed
    padding: '0 20px', // add space to the left and right ends
  },
  optionsDropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '8px 0',
    zIndex: '10',
  },
  optionsButton: {
    background: 'none',
    border: 'none',
    display: 'block',
    width: '100%',
    padding: '8px 16px',
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  editButton: {
    color: '#333',
  },
  deleteButton: {
    color: '#333',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    outline: 'none',
    maxWidth: '400px',
    width: '100%',
  },
}));

const FoodDashboard = () => {
  const classes = useStyles();
  const [newMeal, setNewMeal] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMeal, setEditingMeal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);

  useEffect(() => {
    async function fetchMealData() {
      try {
        const response = await fetch('http://localhost:4000/api/meals');
        if (response.ok) {
          const newMealData = await response.json();
          setNewMeal(newMealData);
        } else {
          console.error('Failed to fetch meal data:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching meal data:', err);
      }
    }

    fetchMealData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/meals/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNewMeal(newMeal.filter(meal => meal._id !== id));
      } else {
        console.error('Failed to delete meal data:', response.statusText);
      }
    } catch (err) {
      console.error('Error deleting meal data:', err);
    }
  };

  const handleEdit = (id) => {
    setSelectedMealId(id);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (updatedMeal) => {
    try {
      const response = await fetch(`http://localhost:4000/api/meals/${updatedMeal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMeal),
      });
      if (response.ok) {
        setNewMeal(newMeal.map(meal => meal._id === updatedMeal._id ? updatedMeal : meal));
        setShowEditModal(false);
      } else {
        console.error('Failed to update meal data:', response.statusText);
      }
    } catch (err) {
      console.error('Error updating meal data:', err);
    }
  };

  const filteredMeals = newMeal.filter(meal =>
    meal.comment && meal.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={classes.container}>
    <div className="food-dashboard">
      <h2>Food Meals Dashboard</h2>
      <div className="button-search-container">
        <div className="button-container">
          <Link to="/addmeal" >
            <button className="add-meal-button">Add Meal</button>
          </Link>
        </div>
        <div className="search-bar">
          <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search by comment" />
        </div>
      </div>
      <hr />
      <Grid container spacing={3}>
        {filteredMeals.map((meal, index) => (
          <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2">Meals:</Typography>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li style={{ display: 'inline-block', marginRight: '10px' }}>{meal.meals && meal.meals.breakfast && 'Breakfast'}</li>
                  <li style={{ display: 'inline-block', marginRight: '10px' }}>{meal.meals && meal.meals.lunch && 'Lunch'}</li>
                  <li style={{ display: 'inline-block' }}>{meal.meals && meal.meals.dinner && 'Dinner'}</li>
                </ul>
                <Typography>Date: {meal.date}</Typography>
                <Typography>Comment: {meal.comment}</Typography>
              </CardContent>
              <FontAwesomeIcon icon={faEllipsisH} className={classes.ellipsisIcon} onClick={() => handleEdit(meal._id)} />
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} className={classes.modal}>
        <div className={classes.editModal}>
          {selectedMealId && <EditModal meal={newMeal.find(meal => meal._id === selectedMealId)} onSubmit={handleEditSubmit} />}
        </div>
      </Modal>
    </div>
    </div>
  );
};

const EditModal = ({ meal, onSubmit }) => {
  const classes = useStyles();
  const [editedMeal, setEditedMeal] = useState({ ...meal });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEditedMeal(prevState => ({
      ...prevState,
      meals: {
        ...prevState.meals,
        [name]: newValue
      },
      [name]: newValue,
    }));
  };

  const handleSubmit = () => {
    onSubmit(editedMeal);
  };

  return (
    <div>
      <FormControlLabel
        control={<Checkbox name="breakfast" checked={editedMeal.meals.breakfast} onChange={handleChange} />}
        label="Breakfast"
      />
      <FormControlLabel
        control={<Checkbox name="lunch" checked={editedMeal.meals.lunch} onChange={handleChange} />}
        label="Lunch"
      />
      <FormControlLabel
        control={<Checkbox name="dinner" checked={editedMeal.meals.dinner} onChange={handleChange} />}
        label="Dinner"
      />
      <TextField type="text" name="date" value={editedMeal.date} onChange={handleChange} label="Date" />
      <TextField type="text" name="comment" value={editedMeal.comment} onChange={handleChange} label="Comment" />
      <br/>
      <Button onClick={handleSubmit}>Save</Button>
    </div>
    
  );
};

export default FoodDashboard;
