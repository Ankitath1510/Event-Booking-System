# Event-Booking-System
A simple Event Booking Dashboard built with **Flask (Python)** and **HTML/CSS/JavaScript** that allows:
- Users to register for events
- CRUD (Create, Read, Update, Delete) operations for Users & Events
- Prevents overbooking (seat limits)
- Displays seats left with color-coded status (Available / Few Left / Sold Out)
Project Structure
project-folder/  
├── app.py # Flask Backend  
├── data.json # Mock database (Users, Events, Bookings)  
├── templates/  
│ └── index.html # Frontend UI  
└── static/  
├── styles.css # CSS Styling  
└── script.js # JavaScript Logic


---

## How to Run Locally
1. **Install Python 3.x**
2. **Install Flask**:
   ```bash
   pip install flask

