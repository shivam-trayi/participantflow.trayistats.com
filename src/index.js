import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import errorLog from './common/utils/logger';
const theme = createTheme({
  palette: {
    primary: {
      main: '#574592'
    }
  }
});

class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    errorLog(error, { source: info.componentStack });
  }

  render() {
    return this.props.children;
  }
}

window.onerror = function (message, source, lineno, colno, error) {
  errorLog(error || message, { source, lineno, colno });
};

window.onunhandledrejection = function (event) {
  errorLog(event.reason, { source: 'FrontendUserRejection' });
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

