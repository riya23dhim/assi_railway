import React, { useState } from 'react';
import axios from 'axios';
import ResultModal from './ResultModal';

function App() {
  const [registerData, setRegisterData] = useState({ email: '', username: '', password: '', is_admin: false });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [trainData, setTrainData] = useState({ train_name: '', source: '', destination: '', seat_capacity: '', arrival_time_at_source: '', arrival_time_at_destination: '' });
  const [searchData, setSearchData] = useState({ source: '', destination: '' });
  const [bookingData, setBookingData] = useState({ trainId: '', seats: '' });
  const [bookingId, setBookingId] = useState('');
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/users/register', registerData);
      setResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/users/login', loginData);
      setToken(response.data.access_token);
      setResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTrain = async () => {
    try {
      const response = await axios.post('/api/trains', trainData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearchTrains = async () => {
    try {
      const response = await axios.get('/api/trains_s', { params: searchData });
      setResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookSeat = async () => {
    try {
      const response = await axios.post('/api/bookings/book', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetBookingDetails = async () => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => setShowModal(false);
  
  const myStyle = {
    backgroundImage:
      "url('https://bsmedia.business-standard.com/_media/bs/img/article/2019-09/30/full/1569790979-4055.jpg')",
    height: "500vh",
    marginTop: "1px",
    fontSize: "15px",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat"
  };
  const histyle={fontSize:"60px"};
//below is all jsx we nee for front end
  return (
    <div style={myStyle}>
      <h1  style={histyle} className=' text-primary text-center'>IRCTC</h1>
      <h2>Register</h2>
      <div className='container-fluid'>
        <input type="email" placeholder="Email" onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
        <input type="text" placeholder="Username" onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
        <input type="checkbox" onChange={(e) => setRegisterData({ ...registerData, is_admin: e.target.checked })} /> Is Admin
      </div>
      <div className='container-fluid'>
        <button onClick={handleRegister}>Register</button>
      </div>

      <h2>Login</h2>
      <div className='container-fluid'>
        <input type="text" placeholder="Username" onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
      </div>
      <div className="container-fluid">
        <button onClick={handleLogin}>Login</button>
      </div>

      <h2>Add Train (Admin Only)</h2>
      <div className='container-fluid'>
        <input type="text" placeholder="Train Name" onChange={(e) => setTrainData({ ...trainData, train_name: e.target.value })} />
        <input type="text" placeholder="Source" onChange={(e) => setTrainData({ ...trainData, source: e.target.value })} />
        <input type="text" placeholder="Destination" onChange={(e) => setTrainData({ ...trainData, destination: e.target.value })} />
        <input type="number" placeholder="Seat Capacity" onChange={(e) => setTrainData({ ...trainData, seat_capacity: e.target.value })} />
        <input type="text" placeholder="Arrival Time at Source" onChange={(e) => setTrainData({ ...trainData, arrival_time_at_source: e.target.value })} />
        <input type="text" placeholder="Arrival Time at Destination" onChange={(e) => setTrainData({ ...trainData, arrival_time_at_destination: e.target.value })} />
      </div>
      <div className='container-fluid'>
        <button onClick={handleAddTrain}>Add Train</button>
      </div>

      <h2>Search Trains</h2>
      <div className='container-fluid'>
        <input type="text" placeholder="Source" onChange={(e) => setSearchData({ ...searchData, source: e.target.value })} />
        <input type="text" placeholder="Destination" onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })} />
      </div>
      <div className='container-fluid'>
        <button onClick={handleSearchTrains}>Search</button>
      </div>

      <h2>Book Seat</h2>
      <div className='container-fluid'>
        <input type="text" placeholder="Train ID" onChange={(e) => setBookingData({ ...bookingData, trainId: e.target.value })} />
        <input type="number" placeholder="Seats" onChange={(e) => setBookingData({ ...bookingData, seats: e.target.value })} />
      </div>
      <div className='container-fluid'>
        <button onClick={handleBookSeat}>Book</button>
      </div>

      <h2>Get Booking Details</h2>
      <div className='container-fluid'>
        <input type="text" placeholder="Booking ID" onChange={(e) => setBookingId(e.target.value)} />
      </div>
      <div className='container-fluid'>
        <button onClick={handleGetBookingDetails}>Get Details</button>
      </div>

      <ResultModal show={showModal} handleClose={handleCloseModal} result={result} />
    </div>
  );
}
//model used so thta our result after logon or any button will be displayed as apopup
export default App;
