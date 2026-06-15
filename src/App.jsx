import { BrowserRouter, Routes, Route} from"react-router-dom";
import React, { lazy, Suspense} from"react";
import { HelmetProvider} from"react-helmet-async";
import"./index.css";
import Navbar from"./components/Navbar";
import Home from"./Pages/Home";
import About from"./Pages/About";
import AnimatedBackground from"./components/Background";
import Footer from"./components/Footer";
import WorkExperienceSection from"./components/WorkExperienceSection";
import { useTheme} from"./hooks/useTheme";

import Login from"./Pages/Login";
import Dashboard from"./Pages/Dashboard";
import ProtectedRoute from"./components/ProtectedRoute";

const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const AboutPage = lazy(() => import("./Pages/AboutPage"));
const StackPage = lazy(() => import("./Pages/StackPage"));
const ExperiencePage = lazy(() => import("./Pages/ExperiencePage"));
const ProjectsPage = lazy(() => import("./Pages/ProjectsPage"));
const CoursesPage = lazy(() => import("./Pages/CoursesPage"));
const CertificatesPage = lazy(() => import("./Pages/CertificatesPage"));
const ContactFullPage = lazy(() => import("./Pages/ContactFullPage"));

const LandingPage = () => {
 return (
 <>
 <Navbar />

 <Home />
 <About />
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
 <Route path="/about" element={<Suspense fallback={<div className="h-20" />}><AboutPage /></Suspense>} />
 <Route path="/stack" element={<Suspense fallback={<div className="h-20" />}><StackPage /></Suspense>} />
 <Route path="/experience" element={<Suspense fallback={<div className="h-20" />}><ExperiencePage /></Suspense>} />
 <Route path="/projects" element={<Suspense fallback={<div className="h-20" />}><ProjectsPage /></Suspense>} />
 <Route path="/courses" element={<Suspense fallback={<div className="h-20" />}><CoursesPage /></Suspense>} />
 <Route path="/certificates" element={<Suspense fallback={<div className="h-20" />}><CertificatesPage /></Suspense>} />
 <Route path="/contact" element={<Suspense fallback={<div className="h-20" />}><ContactFullPage /></Suspense>} />

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