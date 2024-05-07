const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mealsData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mealSchema = new mongoose.Schema({
  meals: Object,
  date: String,
  comment: String,
});

const Meal = mongoose.model('Meal', mealSchema);

app.post('/api/meals', async (req, res) => {
    try {
        const meal = new Meal(req.body);
        await meal.save();
        console.log('Meal data stored successfully:', meal);
        res.status(201).json(meal); // Send back the stored meal data
    } catch (err) {
        console.error('Error storing meal data:', err);
        res.status(500).json({ error: 'Error storing meal data' });
    }
});

app.get('/api/meals', async (req, res) => {
    try {
        const meals = await Meal.find();
        res.status(200).json(meals);
    } catch (err) {
        console.error('Error fetching meal data:', err);
        res.status(500).json({ error: 'Error fetching meal data' });
    }
});

app.delete('/api/meals/:id', async (req, res) => {
    try {
        const mealId = req.params.id;
        const deletedMeal = await Meal.findByIdAndDelete(mealId);
        if (!deletedMeal) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        res.json({ message: 'Meal deleted successfully' });
    } catch (error) {
        console.error('Error deleting meal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/meals/:id', async (req, res) => {
    try {
        const updatedMeal = req.body;
        const id = req.params.id;

        // Update meal data in the database
        await Meal.findByIdAndUpdate(id, updatedMeal);

        res.status(200).json({ message: 'Meal updated successfully' });
    } catch (error) {
        console.error('Error updating meal:', error);
        res.status(500).json({ error: 'Failed to update meal' });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
