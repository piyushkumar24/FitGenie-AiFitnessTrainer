const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminSchema');
const errorHandler = require('../middlewares/errorMiddlewares');
const adminTokenHandler = require('../middlewares/checkAdminToken');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if the admin with the same email already exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(409).json(createResponse(false, 'Admin with this email already exists'));
        }

        // Hash the admin's password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 8);
        const newAdmin = new Admin({
            name,
            email,
            hashedPassword,
        });

        await newAdmin.save(); // Await the save operation

        res.status(201).json(createResponse(true, 'Admin registered successfully'));
    } catch (err) {
        // Pass the error to the error middleware
        next(err);
    }
});


router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json(createResponse(false, 'Invalid admin credentials'));
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json(createResponse(false, 'Invalid admin credentials'));
        }

        // Generate an authentication token for the admin
        const adminAuthToken = jwt.sign({ adminId: admin._id }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '10m' });

        res.cookie('adminAuthToken', adminAuthToken, { httpOnly: true });
        res.status(200).json(createResponse(true, 'Admin login successful', { adminAuthToken }));
    } catch (err) {
        next(err);
    }
});



router.get('/checklogin', adminTokenHandler, async (req, res) => {
    res.json({
        adminId: req.adminId,
        ok: true,
        message: 'Admin authenticated successfully'
    })
})


router.use(errorHandler)

module.exports = router;