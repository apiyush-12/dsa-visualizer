'use client';
import { createContext, useContext, useReducer, useCallback } from 'react';

const VisualizationContext = createContext(null);

const initialState = {
  isPlaying: false,
  speed: 50,
  currentStep: 0,
  totalSteps: 0,
  steps: [],
  isComplete: false,
  learningMode: true,
  message: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEPS':
      return { ...state, steps: action.payload, totalSteps: action.payload.length, currentStep: 0, isComplete: false, isPlaying: false };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'STEP_FORWARD':
      if (state.currentStep >= state.totalSteps - 1) {
        return { ...state, isComplete: true, isPlaying: false };
      }
      return { ...state, currentStep: state.currentStep + 1 };
    case 'RESET':
      return { ...state, currentStep: 0, isPlaying: false, isComplete: false, message: '' };
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'TOGGLE_LEARNING':
      return { ...state, learningMode: !state.learningMode };
    case 'SET_COMPLETE':
      return { ...state, isComplete: true, isPlaying: false };
    default:
      return state;
  }
}

export function VisualizationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const play = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const stepForward = useCallback(() => dispatch({ type: 'STEP_FORWARD' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setSpeed = useCallback((s) => dispatch({ type: 'SET_SPEED', payload: s }), []);
  const setSteps = useCallback((s) => dispatch({ type: 'SET_STEPS', payload: s }), []);
  const setMessage = useCallback((m) => dispatch({ type: 'SET_MESSAGE', payload: m }), []);
  const toggleLearning = useCallback(() => dispatch({ type: 'TOGGLE_LEARNING' }), []);
  const setComplete = useCallback(() => dispatch({ type: 'SET_COMPLETE' }), []);

  return (
    <VisualizationContext.Provider value={{
      ...state, play, pause, stepForward, reset, setSpeed, setSteps, setMessage, toggleLearning, setComplete
    }}>
      {children}
    </VisualizationContext.Provider>
  );
}

export function useVisualization() {
  const context = useContext(VisualizationContext);
  if (!context) throw new Error('useVisualization must be used within VisualizationProvider');
  return context;
}
