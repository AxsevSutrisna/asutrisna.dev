import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorkExperienceSection from '../components/WorkExperienceSection';

export default function ExperiencePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <WorkExperienceSection />
      </main>
      <Footer />
    </div>
  );
}