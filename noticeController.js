const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataFile = path.join(__dirname, '../data/notices.json');

// Helper function to read notices from JSON file
const readNotices = () => {
    try {
        if (!fs.existsSync(dataFile)) {
            return [];
        }
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading notices:', error);
        return [];
    }
};

// Helper function to write notices to JSON file
const writeNotices = (notices) => {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(notices, null, 2));
    } catch (error) {
        console.error('Error writing notices:', error);
    }
};

// Get all notices
exports.getAllNotices = (req, res) => {
    const notices = readNotices();
    res.json(notices.reverse()); // Latest notices first
};

// Get notice by ID
exports.getNoticeById = (req, res) => {
    const { id } = req.params;
    const notices = readNotices();
    const notice = notices.find(n => n.id === id);
    
    if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.json(notice);
};

// Create new notice
exports.createNotice = (req, res) => {
    const { title, content, category, department, author } = req.body;
    
    if (!title || !content || !category) {
        return res.status(400).json({ message: 'Title, content, and category are required' });
    }
    
    const notices = readNotices();
    const newNotice = {
        id: uuidv4(),
        title,
        content,
        category,
        department: department || 'General',
        author: author || 'Admin',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        status: 'active'
    };
    
    notices.push(newNotice);
    writeNotices(notices);
    
    res.status(201).json(newNotice);
};

// Update notice
exports.updateNotice = (req, res) => {
    const { id } = req.params;
    const { title, content, category, department, author } = req.body;
    
    let notices = readNotices();
    const noticeIndex = notices.findIndex(n => n.id === id);
    
    if (noticeIndex === -1) {
        return res.status(404).json({ message: 'Notice not found' });
    }
    
    notices[noticeIndex] = {
        ...notices[noticeIndex],
        title: title || notices[noticeIndex].title,
        content: content || notices[noticeIndex].content,
        category: category || notices[noticeIndex].category,
        department: department || notices[noticeIndex].department,
        author: author || notices[noticeIndex].author,
        updatedDate: new Date().toISOString()
    };
    
    writeNotices(notices);
    res.json(notices[noticeIndex]);
};

// Delete notice
exports.deleteNotice = (req, res) => {
    const { id } = req.params;
    let notices = readNotices();
    
    const noticeIndex = notices.findIndex(n => n.id === id);
    if (noticeIndex === -1) {
        return res.status(404).json({ message: 'Notice not found' });
    }
    
    const deletedNotice = notices.splice(noticeIndex, 1);
    writeNotices(notices);
    
    res.json({ message: 'Notice deleted successfully', deletedNotice: deletedNotice[0] });
};

// Get notices by category
exports.getNoticesByCategory = (req, res) => {
    const { category } = req.params;
    const notices = readNotices();
    const filteredNotices = notices.filter(n => n.category.toLowerCase() === category.toLowerCase());
    
    res.json(filteredNotices.reverse());
};
