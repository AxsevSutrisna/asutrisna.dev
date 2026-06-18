import { BrowserRouter, Routes, Route} from"react-router-dom";
import React, { lazy, Suspense} from"react";
import { HelmetProvider} from"react-helmet-async";
import"./index.css";
import Navbar from"./components/Navbar";
import Home from"./Pages/Home";
import AnimatedBackground from"./components/Background";
import Footer from"./components/Footer";
import WorkExperienceSection from"./features/experience/components/WorkExperienceSection";
import { useTheme} from"./hooks/useTheme";
import PublicLayout from "./components/layouts/PublicLayout";

import Login from"./Pages/Login";
import Dashboard from"./Pages/Dashboard";
import ProtectedRoute from"./components/ProtectedRoute";

const Portofolio = lazy(() => import("./features/projects/Portofolio"));
const ContactPage = lazy(() => import("./features/contact/Contact"));
const ProjectDetails = lazy(() => import("./features/projects/ProjectDetail"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const About = lazy(() => import("./features/about/About"));
const StackPage = lazy(() => import("./features/techstack/StackPage"));
const ExperienceContent = lazy(() => import("./features/experience/ExperienceContent"));
const CoursesPage = lazy(() => import("./features/courses/CoursesPage"));
const CertificatesPage = lazy(() => import("./features/certificates/CertificatesPage"));

const LandingPage = () => {
 return (
 <>
 <Navbar />

 <Home />
 <WorkExperienceSection />
 <Suspense fallback={<div className="h-20" />}>
 <Portofolio />
 <ContactPage />
 </Suspense>
 <Footer />
 </>
 );
};

const ProjectPageLayout = () => (
 <>
 <Suspense fallback={<div className="min-h-screen" />}>
 <ProjectDetails />
 </Suspense>
 <Footer />
 </>
);

function App() {
 useTheme();

 return (

 <HelmetProvider>
 <div className="pointer-events-none">
 <AnimatedBackground />
 </div>
 <BrowserRouter>
 <Routes>
  {/* PUBLIC */}
  <Route
  path="/"
  element={<LandingPage />}
  />

  <Route element={<PublicLayout />}>
    <Route path="/about" element={<Suspense fallback={<div className="h-20" />}><About /></Suspense>} />
    <Route path="/stack" element={<Suspense fallback={<div className="h-20" />}><StackPage /></Suspense>} />
    <Route path="/experience" element={<Suspense fallback={<div className="h-20" />}><ExperienceContent /></Suspense>} />
    <Route path="/projects" element={<Suspense fallback={<div className="h-20" />}><Portofolio /></Suspense>} />
    <Route path="/courses" element={<Suspense fallback={<div className="h-20" />}><CoursesPage /></Suspense>} />
    <Route path="/certificates" element={<Suspense fallback={<div className="h-20" />}><CertificatesPage /></Suspense>} />
    <Route path="/contact" element={<Suspense fallback={<div className="h-20" />}><ContactPage /></Suspense>} />
  </Route>

  <Route path="/project/:slug" element={<ProjectPageLayout />} />

 {/* AUTH */}
 <Route path="/login" element={<Login />} />

 {/* ADMIN (PROTECTED) */}
 <Route
 path="/dashboard/*"
 element={
 <ProtectedRoute>
 <Dashboard />
 </ProtectedRoute>
}
 />

 {/* 404 */}
 <Route
 path="*"
 element={
 <Suspense fallback={null}>
 <NotFoundPage />
 </Suspense>
}
 />
 </Routes>
 </BrowserRouter>
 </HelmetProvider>
 );
}

export default App;