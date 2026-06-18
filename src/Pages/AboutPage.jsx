import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import About from './About';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <About />
      </main>
      <Footer />
    </div>
  );
}