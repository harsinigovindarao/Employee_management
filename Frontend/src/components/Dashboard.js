import React, { useState, useEffect } from 'react';
import EmployeeForm from './EmployeeForm';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [isDatabaseVisible, setIsDatabaseVisible] = useState(false);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null); // Track employee to update

  // Fetch employee data when component mounts
  useEffect(() => {
    if (isDatabaseVisible) {
      viewDatabase();
    }
  }, [isDatabaseVisible]);

  const viewDatabase = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      // Ensure data is in the correct format before setting state
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setError('Unexpected data format received from server.');
      }
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
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== id)
        );
      } else {
        setError('Error deleting employee. Please try again.');
      }
    } catch (err) {
      setError('Error deleting employee. Please try again.');
    }
  };

  const handleAddEmployeeSuccess = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setIsDatabaseVisible(true); // Refresh employee list
  };

  const handleUpdateSuccess = () => {
    setEmployeeToUpdate(null); // Clear the employee being updated
    setIsDatabaseVisible(true); // Refresh the employee list after update
  };

  return (
    <div>
      <h1>Employee Management Dashboard</h1>

      {/* Employee Form to Add New Employee */}
      <h2>Add New Employee</h2>
      <EmployeeForm
        employeeToUpdate={null} // No employee to update for the "Add New Employee" form
        onSubmit={handleAddEmployeeSuccess} // Handle success for adding new employee
      />

      {/* Button to View Database */}
      <button onClick={() => setIsDatabaseVisible(true)}>View Database</button>

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
              {employees.map((employee) => {
                // Ensure employee data is valid before rendering
                if (employee && employee.name) {
                  return (
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
                  );
                }
                return null; // If employee data is invalid, don't render this row
              })}
            </tbody>
          </table>

          {/* Show the update form below the table when an employee is selected */}
          {employeeToUpdate && (
            <div>
              <h2>Update Employee</h2>
              <EmployeeForm
                employeeToUpdate={employeeToUpdate}
                onSubmit={handleUpdateSuccess} // Refresh after updating
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
