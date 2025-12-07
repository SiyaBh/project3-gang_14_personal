import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/employee`
  : 'http://localhost:3001/api/employee';
export const getEmployees = () => axios.get(`${BASE_URL}/details`).then((res) => res.data);
export const addEmployee = (employee) => axios.post(BASE_URL, employee);
export const updateEmployee = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`${BASE_URL}/${id}`);
