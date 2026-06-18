import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32 pb-20 overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
