# Department Notice Board System

A modern, responsive web application for managing department notices and announcements.

## Features

- 📋 **View Notices**: Browse all department notices with details
- ✏️ **Create Notices**: Add new notices with title, content, category, and metadata
- 📝 **Edit Notices**: Update existing notices
- 🗑️ **Delete Notices**: Remove notices from the system
- 🔍 **Search**: Search notices by title, content, or department
- 📁 **Filter by Category**: Filter notices by academic, event, maintenance, holiday, or other
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💾 **JSON Storage**: Simple file-based storage (can be upgraded to database)

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: JSON file storage
- **Other**: UUID for unique IDs, CORS support

## Project Structure

```
notice-board-system/
├── public/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Styling
│   └── js/
│       └── app.js          # Frontend logic
├── controllers/
│   └── noticeController.js # Backend business logic
├── data/
│   └── notices.json        # Notices database (JSON)
├── server.js               # Express server
├── package.json            # Project dependencies
└── README.md               # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v12 or higher)
- npm (Node Package Manager)

### Steps

1. **Extract the project folder**
   ```bash
   unzip notice-board-system.zip
   cd notice-board-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The notice board system should load

## Usage

### Viewing Notices
- All notices are displayed as cards on the main page
- Click any card to view full details
- Use the search bar to find specific notices
- Filter by category using the dropdown

### Adding a Notice
1. Click the **"+ Add Notice"** button
2. Fill in the form fields:
   - **Title**: Notice title (required)
   - **Content**: Notice description (required)
   - **Category**: Select from available categories (required)
   - **Department**: Department name (optional)
   - **Author**: Author name (optional)
3. Click **"Submit"** to save

### Editing a Notice
1. Click on a notice card to view details
2. Click the **"Edit"** button
3. Modify the fields
4. Click **"Submit"** to save changes

### Deleting a Notice
1. Click on a notice card to view details
2. Click the **"Delete"** button
3. Confirm the deletion

## API Endpoints

The following REST API endpoints are available:

### Notices
- `GET /api/notices` - Get all notices
- `GET /api/notices/:id` - Get a specific notice
- `POST /api/notices` - Create a new notice
- `PUT /api/notices/:id` - Update a notice
- `DELETE /api/notices/:id` - Delete a notice
- `GET /api/notices/category/:category` - Get notices by category

### Request/Response Format

**Create/Update Notice:**
```json
{
  "title": "Notice Title",
  "content": "Notice content here",
  "category": "academic",
  "department": "IT Department",
  "author": "Admin Name"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Notice Title",
  "content": "Notice content here",
  "category": "academic",
  "department": "IT Department",
  "author": "Admin Name",
  "createdDate": "2024-09-22T10:00:00Z",
  "updatedDate": "2024-09-22T10:00:00Z",
  "status": "active"
}
```

## Categories

Available notice categories:
- **Academic**: Course-related announcements
- **Event**: Event announcements and registrations
- **Maintenance**: Facility and system maintenance
- **Holiday**: Holiday announcements and closures
- **Other**: Miscellaneous announcements

## Customization

### Changing the Port
Edit `server.js` and change:
```javascript
const PORT = 3000; // Change this number
```

### Adding More Categories
1. Update `public/index.html` - Add option to the select element
2. Update `public/css/style.css` - Add color styling for the new category
3. Use the new category when creating notices

### Database Upgrade
To upgrade from JSON to a real database:
1. Replace file I/O in `noticeController.js` with database queries
2. Options: MongoDB, PostgreSQL, MySQL, etc.

## Features You Can Add

- User authentication and authorization
- Rich text editor for notice content
- Image uploads
- Email notifications
- Archive old notices
- Comments/feedback on notices
- Admin dashboard
- Export notices to PDF
- Scheduled notices

## Troubleshooting

### Port Already in Use
```bash
# Change the port in server.js
# Or kill the process using the port
# On Windows: netstat -ano | findstr :3000
# On Mac/Linux: lsof -i :3000
```

### Notices Not Loading
- Check if server is running
- Check browser console for errors
- Verify `data/notices.json` exists
- Check file permissions

### CORS Errors
- Ensure the frontend is on the same domain or CORS is properly configured
- Check that the API URL in `app.js` matches your server

## License
This project is open source and available for educational purposes.

## Support
For issues or questions, check the code comments or expand the application features as needed.

---

Happy managing! 📋✨
