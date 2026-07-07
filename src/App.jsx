import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import AnimatedBackground from "./components/Background";
import Footer from "./components/Footer";
import { useTheme } from "./hooks/useTheme";
import PublicLayout from "./components/layouts/PublicLayout";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const Portofolio = lazy(() => import("./features/projects/Portofolio"));
const ContactPage = lazy(() => import("./features/contact/Contact"));
const ProjectDetails = lazy(() => import("./features/projects/ProjectDetail"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const About = lazy(() => import("./features/about/About"));
const StackPage = lazy(() => import("./features/techstack/StackPage"));
const ExperienceContent = lazy(() => import("./features/experience/ExperienceContent"));
const CoursesPage = lazy(() => import("./features/courses/CoursesPage"));
const CertificatesPage = lazy(() => import("./features/certificates/CertificatesPage"));
const CVPage = lazy(() => import("./features/cv/CVPage"));

// Layout untuk halaman Home (ada Navbar & Footer, tanpa padding khusus)
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Layout untuk halaman Detail (tanpa Navbar, dengan Footer)
const DetailLayout = () => (
  <div className="flex flex-col min-h-screen">
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

import TargetCursor from "./components/ui/TargetCursor";

function App() {
  useTheme();

  return (

    <HelmetProvider>
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
        cursorColor="#ffffff"
        cursorColorOnTarget="#B497CF"
      />
      <div className="pointer-events-none">
        <AnimatedBackground />
      </div>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="/about" element={<Suspense fallback={<div className="h-20" />}><About /></Suspense>} />
            <Route path="/stack" element={<Suspense fallback={<div className="h-20" />}><StackPage /></Suspense>} />
            <Route path="/cv" element={<Suspense fallback={<div className="h-20" />}><CVPage /></Suspense>} />
            <Route path="/experience" element={<Suspense fallback={<div className="h-20" />}><ExperienceContent /></Suspense>} />
            <Route path="/projects" element={<Suspense fallback={<div className="h-20" />}><Portofolio /></Suspense>} />
            <Route path="/courses" element={<Suspense fallback={<div className="h-20" />}><CoursesPage /></Suspense>} />
            <Route path="/certificates" element={<Suspense fallback={<div className="h-20" />}><CertificatesPage /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<div className="h-20" />}><ContactPage /></Suspense>} />
          </Route>

          <Route element={<DetailLayout />}>
            <Route path="/project/:slug" element={<Suspense fallback={<div className="min-h-screen" />}><ProjectDetails /></Suspense>} />
          </Route>

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