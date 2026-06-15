import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Portofolio from './Portofolio'; // For now it renders Portofolio, we will split it later if needed

export default function StackPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="text-center mb-8"><h1 className="text-4xl font-bold text-white">Tech Stack</h1></div>
        {/* We can reuse Portofolio or create a specific Stack component */}
        <Portofolio />
      </main>
      <Footer />
    </div>
  );
}