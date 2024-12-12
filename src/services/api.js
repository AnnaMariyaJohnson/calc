import axios from 'axios';

// IMPORTANT: Replace with your actual backend URL
const BASE_URL = 'http://192.168.137.121:3001';

// Calculate Operation (POST)
export const calculateOperation = async (operation, first_number, second_number) => {
  try {
    // Log the data that you are sending to the API for debugging
    console.log('Sending Request:', { operation, first_number, second_number });

    // API request
    const response = await axios.post(`${BASE_URL}/calculate`, {
      operation,
      first_number,
      second_number,
    });

    // Log the API response for debugging
    console.log('API Response:', response.data);

    return response.data.result; // Assuming the response contains a "result" field
  } catch (error) {
    console.error('Calculation Error:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch Calculation History (GET)
export const fetchCalculationHistory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/history`);
    return response.data; // Returning the history data directly
  } catch (error) {
    console.error('History Fetch Error:', error.response?.data || error.message);
    throw error;
  }
};

// Clear Calculation History (DELETE)
export const clearCalculationHistory = async () => {
  try {
    await axios.delete(`${BASE_URL}/history`);
    return true; // Returning a success flag
  } catch (error) {
    console.error('History Clear Error:', error.response?.data || error.message);
    throw error;
  }
};
