import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
