// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import DomainManager from './DomainManager';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<DomainManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;