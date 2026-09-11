import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './features/entry/home';
import React from 'react';
import { useSelector } from 'react-redux';
import MyLoader from './components/loader/loader';
import AlertMessage from './components/alert/index';
import './App.css';

function App() {
  const loading = useSelector(state => state.spinner.loading);
  const alertMessage = useSelector(state => state.alert);

  return (
    <div>
      {alertMessage && alertMessage.success === false ? (
        <AlertMessage alertMessage={alertMessage} />
      ) : (
        <div className="App">
          <Router>
            <Routes>
              <Route element={<Home />} exact path="/:key?" />
            </Routes>
          </Router>
          {loading && <MyLoader />}
        </div>
      )}
    </div>
  );
}

export default App;

