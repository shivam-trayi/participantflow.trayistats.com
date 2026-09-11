import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MyLoader from './components/loader/loader';
import AlertMessage from './components/alert/index';
import './App.css';

// Lazy loaded pages (Better performance)
const EntryPage = React.lazy(() => import('./pages/entry/EntryPage'));
const SuccessPage = React.lazy(() => import('./pages/success/SuccessPage'));
const TerminatePage = React.lazy(() => import('./pages/terminate/TerminatePage'));
const QuotaFailPage = React.lazy(() => import('./pages/quotafail/QuotaFailPage'));
const SecurityFailPage = React.lazy(() => import('./pages/securityfail/SecurityFailPage'));

function App() {
  const loading = useSelector(state => state.spinner.loading);
  const alertMessage = useSelector(state => state.alert);

  return (
    <div>
      {alertMessage && alertMessage.success === false ? (
        <AlertMessage alertMessage={alertMessage} />
      ) : (
        <div className="App">
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<MyLoader />}>
              <Routes>
                {/* 5 Main App Routes */}
                <Route path="/:key?" element={<EntryPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/terminate" element={<TerminatePage />} />
                <Route path="/quotafail" element={<QuotaFailPage />} />
                <Route path="/securityfail" element={<SecurityFailPage />} />
              </Routes>
            </Suspense>
          </Router>
          {loading && <MyLoader />}
        </div>
      )}
    </div>
  );
}

export default App;
