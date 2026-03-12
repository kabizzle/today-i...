import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import Assessment from './pages/Assessment';

import SkillsGrowth from './pages/SkillsGrowth';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="entry/new" element={<NewEntry />} />
          <Route path="assess" element={<Assessment />} />
          <Route path="skills" element={<SkillsGrowth />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
