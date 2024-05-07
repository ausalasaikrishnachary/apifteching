import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';
import './styles.scss';

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

const MealData = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [newMeal, setNewMeal] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://iiiqbets.com/pg-management/GET-Meals-for-tenant-API.php', {
          manager_email: 'tanandbabu@yahoo.co.in',
          building_name: 'ANB1',
          tenant_mobile: 9381404011
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMeals = newMeal.filter(meal =>
    meal.comment && meal.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="meal-data-container">
        <div className="food-dashboard">
      <h2>Meal Data</h2>
      <div className="button-search-container">
                <div className="button-container">
                    <Link to="/post" >
                        <button className="add-meal-button">Add Meal</button>
                    </Link>
                </div>
                <div className="search-bar">
                    <input type="text" onChange={handleSearchChange} placeholder="Search by comment" />
                </div>
            </div>
            <hr />
      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={3} lg={3}>
            <Card className={classes.card}>
            <CardContent>
                <Typography variant="h5" component="h2">Meal Details</Typography>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li style={{ display: 'inline-block', marginRight: '10px' }}>{item.breakfast && 'Breakfast'}</li>
                  <li style={{ display: 'inline-block', marginRight: '10px' }}>{item.lunch && 'Lunch'}</li>
                  <li style={{ display: 'inline-block' }}>{item.dinner && 'Dinner'}</li>
                </ul>
                <Typography>Date: {item.date}</Typography>
                <Typography>Comment: {item.comments}</Typography>
              </CardContent>
              <FontAwesomeIcon icon={faEllipsisH} className={classes.ellipsisIcon}/>
              </Card>
          </Grid>
        ))}
      </Grid>
      </div>
    </div>
  );
};

export default MealData;
