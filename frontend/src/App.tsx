import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import SkillDetail from './pages/SkillDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SubmitSkill from './pages/SubmitSkill';
import EditSkill from './pages/EditSkill';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/skills/:id" element={<SkillDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/submit" element={<SubmitSkill />} />
            <Route path="/skills/:id/edit" element={<EditSkill />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
