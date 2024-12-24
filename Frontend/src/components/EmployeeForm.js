import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employeeToUpdate, onSubmit, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    email: '',
    phone: '',
    department: '',
    date_of_joining: '',
    role: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (employeeToUpdate) {
      // Pre-fill form if updating
      setFormData({
        name: employeeToUpdate.name,
        employee_id: employeeToUpdate.employee_id,
        email: employeeToUpdate.email,
        phone: employeeToUpdate.phone,
        department: employeeToUpdate.department,
        date_of_joining: employeeToUpdate.date_of_joining,
        role: employeeToUpdate.role,
      });
    }
  }, [employeeToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const method = employeeToUpdate ? 'PUT' : 'POST';
    const url = employeeToUpdate
      ? `/api/employees/${employeeToUpdate.id}`  // For update
      : '/api/employees'; // For add

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message || 'Form submitted successfully!');
        setFormData({
          name: '',
          employee_id: '',
          email: '',
          phone: '',
          department: '',
          date_of_joining: '',
          role: '',
        });
        if (employeeToUpdate) {
          onUpdate(); // Call onUpdate after successful update
        } else {
          onSubmit(); // Call onSubmit after adding new employee
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Submission failed.');
        console.error('Update failed:', errorData); // Log response for debugging
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again.');
      console.error('Error:', err); // Log any other errors
    }
  };

  return (
    <div>
      <h1>{employeeToUpdate ? 'Update Employee' : 'Add Employee'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="employee_id"
          placeholder="Employee ID"
          value={formData.employee_id}
          onChange={handleChange}
          required
          maxLength={10}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="\d{10}"
        />
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
        </select>
        <input
          type="date"
          name="date_of_joining"
          max={new Date().toISOString().split('T')[0]}
          value={formData.date_of_joining}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
          required
        />
        <button type="submit">{employeeToUpdate ? 'Update' : 'Submit'}</button>
        <button
          type="reset"
          onClick={() =>
            setFormData({
              name: '',
              employee_id: '',
              email: '',
              phone: '',
              department: '',
              date_of_joining: '',
              role: '',
            })
          }
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
