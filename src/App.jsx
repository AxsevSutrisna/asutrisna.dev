import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import { HelmetProvider } from "react-helmet-async"
import { Analytics } from "@vercel/analytics/react"
import AOS from "aos"
import "aos/dist/aos.css"
import ErrorBoundary from "./components/ErrorBoundary"
import { PageSkeleton } from "./components/ui/Skeleton"
import "./index.css"
import Navbar from "./components/Navbar"
import Home from "./Pages/Home"
import AnimatedBackground from "./components/Background"
import Footer from "./components/Footer"
import { useTheme } from "./hooks/useTheme"
import PublicLayout from "./components/layouts/PublicLayout"
import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

const Portfolio = lazy(() => import("./features/projects/Portfolio"))
const ContactPage = lazy(() => import("./features/contact/Contact"))
const ProjectDetails = lazy(() => import("./features/projects/ProjectDetail"))
const NotFoundPage = lazy(() => import("./pages/NotFound"))

const About = lazy(() => import("./features/about/About"))
const StackPage = lazy(() => import("./features/techstack/StackPage"))
const ExperienceContent = lazy(
  () => import("./features/experience/ExperienceContent")
)
const CoursesPage = lazy(() => import("./features/courses/CoursesPage"))
const CertificatesPage = lazy(
  () => import("./features/certificates/CertificatesPage")
)
const CVPage = lazy(() => import("./features/cv/CVPage"))

// Layout untuk halaman Home (ada Navbar & Footer, tanpa padding khusus)
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
)

// Layout untuk halaman Detail (tanpa Navbar, dengan Footer)
const DetailLayout = () => (
  <div className="flex flex-col min-h-screen">
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
)

import TargetCursor from "./components/ui/TargetCursor"

function App() {
  useTheme()

  useEffect(() => {
    AOS.init({
      once: false,
      offset: 10,
    })
  }, [])

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Analytics />
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
              <Route
                path="/about"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="/stack"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <StackPage />
                  </Suspense>
                }
              />
              <Route
                path="/cv"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <CVPage />
                  </Suspense>
                }
              />
              <Route
                path="/experience"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <ExperienceContent />
                  </Suspense>
                }
              />
              <Route
                path="/projects"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Portfolio />
                  </Suspense>
                }
              />
              <Route
                path="/courses"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <CoursesPage />
                  </Suspense>
                }
              />
              <Route
                path="/certificates"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <CertificatesPage />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <ContactPage />
                  </Suspense>
                }
              />
            </Route>

            <Route element={<DetailLayout />}>
              <Route
                path="/project/:slug"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <ProjectDetails />
                  </Suspense>
                }
              />
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
    </ErrorBoundary>
  )
}

export default App
