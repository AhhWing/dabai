/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';
import MoodPage from './pages/MoodPage';
import HealthPage from './pages/HealthPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="mood" element={<MoodPage />} />
          <Route path="health" element={<HealthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
