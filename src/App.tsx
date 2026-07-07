/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { BottomNav } from './components/BottomNav';
import HomePage from './pages/Home';
import ServicesPage from './pages/Services';
import ResultsPage from './pages/Results';
import ContactPage from './pages/Contact';
import AdminPage from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      {/* Centered Mobile Screen Container */}
      <div className="min-h-screen bg-[#eae8e3] text-on-surface font-sans flex items-center justify-center">
        <div className="w-full max-w-md h-screen md:h-[94vh] bg-background md:rounded-[36px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-black/[0.03] overflow-hidden flex flex-col relative">
          
          {/* Scrollable Simulator App Canvas */}
          <div className="flex-1 relative overflow-hidden flex flex-col bg-background">
            <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-28">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            <BottomNav />
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}
