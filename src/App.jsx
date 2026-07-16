import { Routes, Route, Navigate } from 'react-router-dom';
import LandingLayout from './layouts/LandingLayout';
import Register from './pages/register';
import LoginForm from './pages/Login';
import Features from './pages/Features';
import About from './pages/About';
import Inicio from './pages/Inicio';
import Dashboard from './pages/Dashboard';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import AppLayout from './layouts/AppLayout';
import Period from './pages/Period';
import Calendar from './pages/Calendar';
import Tasks from './pages/Tasks';
import Tests from './pages/Tests';
import Subjects from './pages/Subjects';
import Breaks from './pages/Breaks';
import PeriodForm from './pages/PeriodForm';
import Sprints from './pages/Sprints';
import ScrollToTop from './components/ScrollToTop';
import SubjectsForm from './pages/SubjectsForm';
import SubjectDetails from './pages/SubjectDetails';

export default function App() {
  return (
    <> 
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route element={<PublicOnlyRoute />}>

          {/* Landing */}
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Inicio />} />
            <Route path="features" element={<Features />} />
            <Route path="about" element={<About />} />
            <Route path="sprints" element={<Sprints />} />
           </Route>

          {/* Auth */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signup" element={<Register />} />
            <Route path="login" element={<LoginForm />} />
          </Route>

        </Route>


        {/* Private */}
        <Route element={<ProtectedRoute />}>

          {/* App */}
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route index element={<Navigate to="dashboard" />} />

            
            {/* Periods */}
            <Route path="periods" element={<Period />} />
            <Route path="periods/new" element={<PeriodForm />} />
            <Route path="periods/:id/edit" element={<PeriodForm />} />

            {/* Subjects */}
            <Route path="subjects" element={<Subjects />} />
            <Route path="subjects/new" element={<SubjectsForm />} />
            <Route path="subjects/:id" element={<SubjectDetails />} />

            <Route path="calendar" element={<Calendar />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tests" element={<Tests />} />
            <Route path="breaks" element={<Breaks />} />

          </Route>
|
        </Route>
      </Routes>
    </>
  );
}