# IRCTC Railway Management System

## Project Overview
The IRCTC Railway Management System is a comprehensive full-stack application designed to simulate the functionality of a railway ticketing system. The system includes features such as user registration, login, adding trains (admin only), searching for trains, booking seats, and fetching booking details. The project uses a React.js frontend, Express.js backend, SQLite database, and integrates with Bootstrap for styling.

### Key Features:
1. **User Registration and Login:**
   - Users can register by providing email, username, password, and admin status.
   - Secure login with JWT-based authentication.

2. **Train Management (Admin Only):**
   - Admins can add new train details, including train name, source, destination, seat capacity, and arrival times.

3. **Train Search:**
   - Users can search for trains by specifying the source and destination.
   - Displays available seats for each train.

4. **Seat Booking:**
   - Users can book seats on trains by providing train ID and number of seats required.
   - Seat availability is updated in real-time.

5. **Booking Details:**
   - Users can fetch details of a specific booking by providing the booking ID.

## Technologies Used
- **Frontend:** React.js, Axios, Bootstrap
- **Backend:** Express.js, SQLite, JWT for authentication
- **Styling:** CSS and Bootstrap for responsive design

---

## How to Run the Project

### Prerequisites
- Node.js and npm installed
- SQLite installed
- Bootstrap and React-Bootstrap libraries

### Steps to Run:

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies:**
   Navigate to the frontend and backend directories and run the following command in each:
   ```bash
   npm install
   ```

3. **Start the Backend Server:**
   In the backend directory, run:
   ```bash
   node server.js
   ```

4. **Start the Frontend Application:**
   In the frontend directory, run:
   ```bash
   npm start
   ```

5. **Access the Application:**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Example Usage

1. **Register a User:**
   - Provide email, username, password, and admin status.
   - Click the "Register" button.

2. **Login as Admin or User:**
   - Enter username and password.
   - Click "Login" to get a JWT token for subsequent actions.

3. **Add a Train (Admin Only):**
   - Fill out the train details and click "Add Train."

4. **Search for Trains:**
   - Enter source and destination and click "Search."

5. **Book Seats:**
   - Provide train ID and number of seats to book, then click "Book."

6. **View Booking Details:**
   - Enter the booking ID and click "Get Details."

---



