import React, { useEffect, useState } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.position} - ${employee.salary}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
