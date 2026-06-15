import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperienceContent from '../components/ExperienceContent';

export default function ExperiencePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <ExperienceContent />
      </main>
      <Footer />
    </div>
  );
}