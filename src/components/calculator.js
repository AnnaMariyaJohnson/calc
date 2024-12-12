import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Icon library
import {
  calculateOperation,
  fetchCalculationHistory,
  clearCalculationHistory,
} from '../services/api'; // Ensure this path is correct for your project

const Calculator = () => {
  const [display, setDisplay] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // Toggle history visibility
  const [error, setError] = useState(''); // For error display

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await fetchCalculationHistory();
      setHistory(historyData);
    } catch (err) {
      setError('Failed to load history');
      console.error('Failed to fetch history:', err);
    }
  };

  const handlePress = (value) => {
    setDisplay((prev) => prev + value);
    setError(''); // Clear any previous errors
  };

  const handleClear = () => {
    setDisplay('');
    setError(''); // Clear error when clearing display
  };

  const handleBackspace = () => {
    setDisplay((prev) => prev.slice(0, -1));
  };

  const handleEquals = async () => {
    try {
      // Split the display input into numbers and operation
      const [first_number, operation, second_number] = display.split(/([+\-*/])/);
      if (!first_number || !operation || !second_number) {
        setError('Invalid Expression');
        return;
      }

      let backendOperation;
      // Map the operation to backend's expected operation names
      switch (operation) {
        case '+':
          backendOperation = 'add';
          break;
        case '-':
          backendOperation = 'subtract';
          break;
        case '*':
          backendOperation = 'multiply';
          break;
        case '/':
          backendOperation = 'divide';
          break;
        default:
          setError('Invalid Operation');
          return;
      }

      // Perform the calculation through the backend API
      const result = await calculateOperation(backendOperation, first_number, second_number);
      setDisplay(result.toString());
      loadHistory(); // Refresh the history after calculation
    } catch (err) {
      setError('Calculation Error');
      console.error('Calculation Error:', err);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearCalculationHistory();
      setHistory([]); // Clear the history from UI
    } catch (err) {
      setError('Failed to clear history');
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.display}>{display || '0'}</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Toggle History */}
      <View style={styles.historyToggle}>
        <TouchableOpacity onPress={() => setShowHistory((prev) => !prev)}>
          <MaterialIcons
            name={showHistory ? 'history-toggle-off' : 'history'}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* History Section */}
      {showHistory && (
        <View style={styles.historyContainer}>
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.historyItem}>
                {item.first_number} {item.operation  === 'add' ? '+' : item.operation === 'subtract' ? '-' : item.operation === 'multiply' ? '*' : '/'} {item.second_number} = {item.result}
              </Text>
            )}
          />
          <TouchableOpacity
            style={styles.clearHistoryButton}
            onPress={handleClearHistory}
          >
            <Text style={styles.clearHistoryText}>Clear History</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        {[['7', '8', '9', '+'], ['4', '5', '6', '-'], ['1', '2', '3', '*'], ['C', '0', '=', '/']].map(
          (row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((btn, btnIndex) => (
                <TouchableOpacity
                  key={btnIndex}
                  style={[
                    styles.button,
                    btn === '=' && styles.equalsButton, // Special styling for "=" button
                  ]}
                  onPress={() => {
                    if (btn === 'C') handleClear();
                    else if (btn === '=') handleEquals();
                    else handlePress(btn);
                  }}
                >
                  <Text style={styles.buttonText}>{btn}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  display: {
    color: '#fff',
    fontSize: 48,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginTop: 10,
  },
  historyToggle: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  historyContainer: {
    flex: 2,
    backgroundColor: '#333',
    paddingHorizontal: 10,
  },
  historyItem: {
    fontSize: 16,
    color: '#fff',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  clearHistoryButton: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  clearHistoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flex: 4,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equalsButton: {
    backgroundColor: '#ff9900', // Orange for "=" button
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default Calculator;
