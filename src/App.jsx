// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import DomainManager from './DomainManager';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* TEMPORARY: Dashboard as default route for development */}
        <Route path="/" element={<DomainManager />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<DomainManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;