import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'http://192.168.137.121:3001'; // Update this with your backend URL if needed

// Function to send the expression to the backend and get the result
export const calculateOperation = async (expression) => {
  try {
    const response = await axios.post(`${BASE_URL}/calculate`, {
      expression: expression,
    });
    return response.data.result;
  } catch (error) {
    console.error('Error calculating operation:', error);
    throw new Error('Failed to calculate expression');
  }
};

// Function to fetch calculation history from the backend
export const fetchCalculationHistory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching calculation history:', error);
    throw new Error('Failed to fetch history');
  }
};

// Function to clear the calculation history in the backend
export const clearCalculationHistory = async () => {
  try {
    await axios.delete(`${BASE_URL}/history`);
  } catch (error) {
    console.error('Error clearing history:', error);
    throw new Error('Failed to clear history');
  }
};
