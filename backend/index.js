const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const calorieIntakeRoutes = require('./routes/calorieIntake');
const adminRoutes = require('./routes/admin');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const sleepTrackRoutes = require('./routes/sleepTrack');
const stepTrackRoutes = require('./routes/sleepTrack');
const weightTrackRoutes = require('./routes/weightTrack');
const waterTrackRoutes = require('./routes/waterTrack');
const workoutTrackRoutes = require('./routes/workoutTrack');
const workoutRoutes = require('./routes/workoutPlans');
const reportRoutes = require('./routes/report');

require('dotenv').config();
require('./db');

app.use(bodyParser.json());

app.use(
    cors({
        origin: 'http://localhost:3000', // Allow requests from localhost:3000
        credentials: true, // Allow cookies to be sent along with the request
    })
);

app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/calorieIntake', calorieIntakeRoutes);
app.use('/admin', adminRoutes);
app.use('/imageUpload', imageUploadRoutes);
app.use('/sleetTrack', sleepTrackRoutes);
app.use('/stepTrack', stepTrackRoutes);
app.use('/weightTrack', weightTrackRoutes);
app.use('/waterTrack', waterTrackRoutes);
app.use('/workoutTrack', workoutTrackRoutes);
app.use('/workoutPlans', workoutRoutes);
app.use('/report', reportRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'The server is working!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
