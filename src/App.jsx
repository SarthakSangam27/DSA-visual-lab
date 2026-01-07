import React, { useState, useEffect, useRef } from 'react';

// ============================================
// OPERATION ENGINE - THE HEART OF THE PROJECT
// ============================================
const OperationType = {
  COMPARE: 'COMPARE',
  SWAP: 'SWAP',
  INSERT: 'INSERT',
  DELETE: 'DELETE',
  TRAVERSE: 'TRAVERSE',
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  MOVE_POINTER: 'MOVE_POINTER',
  COMPLETE: 'COMPLETE'
};

// ============================================
// ALGORITHM GENERATORS (Pure Functions)
// ============================================
const generateBubbleSortOps = (arr) => {
  const ops = [];
  const n = arr.length;
  const copy = [...arr];
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      ops.push({ type: OperationType.COMPARE, indices: [j, j + 1] });
      if (copy[j] > copy[j + 1]) {
        ops.push({ type: OperationType.SWAP, indices: [j, j + 1] });
        [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
      }
    }
  }
  ops.push({ type: OperationType.COMPLETE });
  return ops;
};

const generateLinearSearchOps = (arr, target) => {
  const ops = [];
  for (let i = 0; i < arr.length; i++) {
    ops.push({ type: OperationType.MOVE_POINTER, indices: [i] });
    ops.push({ type: OperationType.COMPARE, indices: [i], value: target });
    if (arr[i] === target) {
      ops.push({ type: OperationType.FOUND, indices: [i] });
      return ops;
    }
  }
  ops.push({ type: OperationType.NOT_FOUND });
  return ops;
};

const generateBinarySearchOps = (arr, target) => {
  const ops = [];
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    ops.push({ type: OperationType.MOVE_POINTER, indices: [left, right, mid] });
    ops.push({ type: OperationType.COMPARE, indices: [mid], value: target });
    
    if (arr[mid] === target) {
      ops.push({ type: OperationType.FOUND, indices: [mid] });
      return ops;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  ops.push({ type: OperationType.NOT_FOUND });
  return ops;
};

const generateTwoPointerOps = (arr, target) => {
  const ops = [];
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    ops.push({ type: OperationType.MOVE_POINTER, indices: [left, right] });
    const sum = arr[left] + arr[right];
    ops.push({ type: OperationType.COMPARE, indices: [left, right], value: sum });
    
    if (sum === target) {
      ops.push({ type: OperationType.FOUND, indices: [left, right] });
      return ops;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  ops.push({ type: OperationType.NOT_FOUND });
  return ops;
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function DSAVisualLab() {
  const [tab, setTab] = useState('arrays');
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [operations, setOperations] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [searchTarget, setSearchTarget] = useState(22);
  const [message, setMessage] = useState('');
  const intervalRef = useRef(null);

  // Animation Engine
  useEffect(() => {
    if (isPlaying && currentStep < operations.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= operations.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(intervalRef.current);
  }, [isPlaying, currentStep, operations, speed]);

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    setMessage('');
  };

  const runAlgorithm = (ops) => {
    resetAnimation();
    setOperations(ops);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // Get current operation
  const currentOp = currentStep >= 0 && currentStep < operations.length 
    ? operations[currentStep] 
    : null;

  // Array Operations
  const insertElement = () => {
    const newVal = Math.floor(Math.random() * 100);
    setArray([...array, newVal]);
    setMessage(`Inserted ${newVal}`);
  };

  const deleteElement = (index) => {
    const newArr = array.filter((_, i) => i !== index);
    setArray(newArr);
    setMessage(`Deleted element at index ${index}`);
  };

  const traverseArray = () => {
    const ops = array.map((_, i) => ({ type: OperationType.TRAVERSE, indices: [i] }));
    runAlgorithm(ops);
  };

  // Algorithm runners
  const runBubbleSort = () => {
    const ops = generateBubbleSortOps(array);
    runAlgorithm(ops);
  };

  const runLinearSearch = () => {
    const ops = generateLinearSearchOps(array, searchTarget);
    runAlgorithm(ops);
  };

  const runBinarySearch = () => {
    const sorted = [...array].sort((a, b) => a - b);
    setArray(sorted);
    setTimeout(() => {
      const ops = generateBinarySearchOps(sorted, searchTarget);
      runAlgorithm(ops);
    }, 100);
  };

  const runTwoPointer = () => {
    const sorted = [...array].sort((a, b) => a - b);
    setArray(sorted);
    setTimeout(() => {
      const ops = generateTwoPointerOps(sorted, searchTarget);
      runAlgorithm(ops);
    }, 100);
  };

  const generateRandomArray = () => {
    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100));
    setArray(newArr);
    resetAnimation();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🧠 DSA Master Visual Lab</h1>
        <p style={styles.subtitle}>Operation-Driven Algorithm Visualization Framework</p>
      </header>

      <div style={styles.tabs}>
        {['arrays', 'searching', 'sorting', 'twopointers'].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); resetAnimation(); }}
            style={{...styles.tab, ...(tab === t ? styles.tabActive : {})}}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={styles.mainArea}>
        <div style={styles.visualArea}>
          <ArrayVisualizer 
            array={array} 
            currentOp={currentOp}
            onDelete={deleteElement}
          />
          {message && <div style={styles.message}>{message}</div>}
        </div>

        <div style={styles.controls}>
          <div style={styles.controlSection}>
            <h3 style={styles.controlTitle}>Controls</h3>
            <button onClick={generateRandomArray} style={styles.button}>
              🎲 Random Array
            </button>
            <div style={styles.speedControl}>
              <label>Speed: </label>
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={styles.select}>
                <option value={1000}>Slow</option>
                <option value={500}>Normal</option>
                <option value={200}>Fast</option>
              </select>
            </div>
          </div>

          {tab === 'arrays' && (
            <div style={styles.controlSection}>
              <h3 style={styles.controlTitle}>Array Operations</h3>
              <button onClick={insertElement} style={styles.button}>
                ➕ Insert Random
              </button>
              <button onClick={traverseArray} style={styles.button} disabled={isPlaying}>
                👁️ Traverse
              </button>
              <p style={styles.hint}>Click on bars to delete</p>
            </div>
          )}

          {tab === 'searching' && (
            <div style={styles.controlSection}>
              <h3 style={styles.controlTitle}>Search Algorithms</h3>
              <div style={styles.inputGroup}>
                <label>Target: </label>
                <input 
                  type="number" 
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(Number(e.target.value))}
                  style={styles.input}
                />
              </div>
              <button onClick={runLinearSearch} style={styles.button} disabled={isPlaying}>
                🔍 Linear Search
              </button>
              <button onClick={runBinarySearch} style={styles.button} disabled={isPlaying}>
                🎯 Binary Search
              </button>
              <p style={styles.complexity}>Linear: O(n) | Binary: O(log n)</p>
            </div>
          )}

          {tab === 'sorting' && (
            <div style={styles.controlSection}>
              <h3 style={styles.controlTitle}>Sorting Algorithms</h3>
              <button onClick={runBubbleSort} style={styles.button} disabled={isPlaying}>
                🫧 Bubble Sort
              </button>
              <p style={styles.complexity}>Time: O(n²) | Space: O(1)</p>
            </div>
          )}

          {tab === 'twopointers' && (
            <div style={styles.controlSection}>
              <h3 style={styles.controlTitle}>Two Pointer Technique</h3>
              <div style={styles.inputGroup}>
                <label>Target Sum: </label>
                <input 
                  type="number" 
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(Number(e.target.value))}
                  style={styles.input}
                />
              </div>
              <button onClick={runTwoPointer} style={styles.button} disabled={isPlaying}>
                ⬅️➡️ Find Pair
              </button>
              <p style={styles.complexity}>Time: O(n) | Space: O(1)</p>
            </div>
          )}

          <div style={styles.controlSection}>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              style={{...styles.button, ...styles.playButton}}
              disabled={operations.length === 0}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button onClick={resetAnimation} style={styles.button}>
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>Extensible DSA Framework | Arrays → Searching → Sorting → Two Pointers → [Graphs, Trees, DP...]</p>
      </footer>
    </div>
  );
}

// ============================================
// ARRAY VISUALIZER COMPONENT
// ============================================
function ArrayVisualizer({ array, currentOp, onDelete }) {
  const maxVal = Math.max(...array, 1);

  const getBarColor = (index) => {
    if (!currentOp) return '#4a90e2';
    
    const { type, indices } = currentOp;
    
    if (type === OperationType.FOUND && indices.includes(index)) return '#2ecc71';
    if (type === OperationType.COMPARE && indices.includes(index)) return '#f39c12';
    if (type === OperationType.SWAP && indices.includes(index)) return '#e74c3c';
    if (type === OperationType.TRAVERSE && indices.includes(index)) return '#9b59b6';
    if (type === OperationType.MOVE_POINTER && indices.includes(index)) return '#1abc9c';
    
    return '#4a90e2';
  };

  return (
    <div style={styles.arrayContainer}>
      {array.map((val, idx) => (
        <div key={idx} style={styles.barWrapper} onClick={() => onDelete(idx)}>
          <div 
            style={{
              ...styles.bar,
              height: `${(val / maxVal) * 200}px`,
              backgroundColor: getBarColor(idx)
            }}
          >
            <span style={styles.barValue}>{val}</span>
          </div>
          <div style={styles.barIndex}>{idx}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 10px 0',
    background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    color: '#94a3b8',
    margin: 0
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    background: '#334155',
    color: '#cbd5e1',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  tabActive: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: '#fff'
  },
  mainArea: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  visualArea: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '30px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrayContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer'
  },
  bar: {
    width: '50px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: '8px 8px 0 0',
    transition: 'all 0.3s ease',
    minHeight: '30px'
  },
  barValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '5px'
  },
  barIndex: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#64748b'
  },
  controls: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  controlSection: {
    borderBottom: '1px solid #334155',
    paddingBottom: '15px'
  },
  controlTitle: {
    margin: '0 0 15px 0',
    fontSize: '1.1rem',
    color: '#94a3b8'
  },
  button: {
    width: '100%',
    padding: '12px',
    marginBottom: '8px',
    border: 'none',
    borderRadius: '8px',
    background: '#3b82f6',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  playButton: {
    background: '#10b981'
  },
  select: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #475569',
    background: '#0f172a',
    color: '#fff',
    marginLeft: '10px'
  },
  input: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #475569',
    background: '#0f172a',
    color: '#fff',
    marginLeft: '10px',
    width: '80px'
  },
  inputGroup: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center'
  },
  speedControl: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center'
  },
  complexity: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '10px',
    fontFamily: 'monospace'
  },
  hint: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '5px',
    fontStyle: 'italic'
  },
  message: {
    marginTop: '20px',
    padding: '10px 20px',
    background: '#10b981',
    borderRadius: '6px',
    fontWeight: '600'
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    color: '#64748b',
    fontSize: '14px'
  }
};
