const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const noticeController = require('./controllers/noticeController');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/api/notices', noticeController.getAllNotices);
app.get('/api/notices/:id', noticeController.getNoticeById);
app.post('/api/notices', noticeController.createNotice);
app.put('/api/notices/:id', noticeController.updateNotice);
app.delete('/api/notices/:id', noticeController.deleteNotice);
app.get('/api/notices/category/:category', noticeController.getNoticesByCategory);

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
