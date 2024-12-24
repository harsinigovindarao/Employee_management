import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-employee" element={<EmployeeForm />} />
        <Route path="/employee-list" element={<EmployeeList />} />
      </Routes>
    </Router>
  );
};

export default App;
