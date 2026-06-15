import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Portofolio from './Portofolio';

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <Portofolio />
      </main>
      <Footer />
    </div>
  );
}