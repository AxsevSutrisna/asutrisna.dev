const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'Pages');

const templates = {
  'AboutPage.jsx': `
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import About from './About';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <About />
      </main>
      <Footer />
    </div>
  );
}
`,
  'StackPage.jsx': `
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
`,
  'ExperiencePage.jsx': `
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
`,
  'ProjectsPage.jsx': `
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
`,
  'CoursesPage.jsx': `
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../supabase';
import { BookOpen } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from('courses').select('*').order('sort_order', { ascending: true });
      if (data) setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 px-[5%] sm:px-[10%]">
        <div className="text-center pb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Courses & Bootcamps</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Certifications and learning paths I have completed.</p>
        </div>
        {loading ? (
           <div className="text-center text-white">Loading...</div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {courses.map(course => (
               <div key={course.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition">
                 {course.img_url ? (
                   <img src={course.img_url} alt={course.title} className="w-full h-48 object-cover" />
                 ) : (
                   <div className="w-full h-48 flex justify-center items-center bg-black/20"><BookOpen className="w-12 h-12 text-gray-500" /></div>
                 )}
                 <div className="p-5">
                   <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                   <p className="text-indigo-400 text-sm mb-3">{course.provider} {course.completion_date && \`• \${course.completion_date}\`}</p>
                   <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                   {course.certificate_link && (
                     <a href={course.certificate_link} target="_blank" rel="noreferrer" className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg inline-block">View Certificate</a>
                   )}
                 </div>
               </div>
             ))}
           </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
`,
  'CertificatesPage.jsx': `
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Portofolio from './Portofolio';

export default function CertificatesPage() {
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
`,
  'ContactFullPage.jsx': `
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
`
};

for (const [filename, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join(pagesDir, filename), content.trim());
  console.log('Created ' + filename);
}
