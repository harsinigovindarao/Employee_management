import React, { useEffect, useState } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Make sure to fetch from the correct endpoint '/api/employees'
    fetch('http://localhost:5000/api/employees')
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error)); // Handle errors
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.role} - {employee.department}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
