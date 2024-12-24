import React, { useState } from 'react';
import EmployeeForm from './EmployeeForm';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [isDatabaseVisible, setIsDatabaseVisible] = useState(false);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null); // Track employee to update

  const viewDatabase = async () => {
    try {
      const response = await fetch('https://676b11b56c5eeb40aa80ccf4--employeemanagemen.netlify.app/');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
      setIsDatabaseVisible(true);
    } catch (err) {
      setError('Error connecting to the server. Please try again.');
    }
  };

  const updateEmployee = (employee) => {
    setEmployeeToUpdate(employee); // Set the employee data to be updated
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`https://676b11b56c5eeb40aa80ccf4--employeemanagemen.netlify.app/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== id)
        );
      }
    } catch (err) {
      setError('Error deleting employee. Please try again.');
    }
  };

  const handleUpdateSuccess = () => {
    setEmployeeToUpdate(null); // Clear the employee being updated
    viewDatabase(); // Refresh the data after update
  };

  return (
    <div>
      <h1>Employee Management Dashboard</h1>

      {/* Employee Form to Add New Employee */}
      <h2>Add New Employee</h2>
      <EmployeeForm
        employeeToUpdate={null} // No employee to update for the "Add New Employee" form
        onSubmit={viewDatabase} // Reload employees after adding
      />

      {/* Button to View Database */}
      <button onClick={viewDatabase}>View Database</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Show Employees Table */}
      {isDatabaseVisible && employees.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.employee_id}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.department}</td>
                  <td>{employee.date_of_joining}</td>
                  <td>{employee.role}</td>
                  <td>
                    <button onClick={() => updateEmployee(employee)}>Update</button>
                    <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Show the update form below the table when an employee is selected */}
          {employeeToUpdate && (
            <div>
              <h2>Update Employee</h2>
              <EmployeeForm
                employeeToUpdate={employeeToUpdate}
                onSubmit={viewDatabase} // Reload employees after adding
                onUpdate={handleUpdateSuccess} // Refresh after updating
              />
            </div>
          )}
        </>
      ) : (
        isDatabaseVisible && <p>No employees found.</p>
      )}
    </div>
  );
};

export default Dashboard;
