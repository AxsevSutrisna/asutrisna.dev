import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Contact from './Contact';

export default function ContactFullPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}