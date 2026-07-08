import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useProjects } from "./hooks/useProjects"
import ProjectCard from "./components/ProjectCard"
import AOS from "aos"
import "aos/dist/aos.css"
import { Search } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useLocation } from "react-router-dom"

import ShowMoreButton from "../../components/ui/ShowMoreButton"

export default function Portofolio() {
  const { projects } = useProjects()
  const location = useLocation()
  const [showAllProjects, setShowAllProjects] = useState(false)
  const isSubpage = location.pathname === "/projects"
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")

  const [isMobile, setIsMobile] = useState(false)
  const initialItems = isMobile ? 4 : 6

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    AOS.init({ once: false })
  }, [])

  const toggleShowMore = useCallback(() => {
    setShowAllProjects((prev) => !prev)
  }, [])

  // Dynamic filters based on project categories
  const filters = useMemo(() => {
    const categories = projects
      .map((p) => p.category || p.Category)
      .filter(Boolean)
    const uniqueCategories = [...new Set(categories)]
    return ["All", ...uniqueCategories]
  }, [projects])

  const filteredProjects = projects.filter((project) => {
    const title = (project.title || project.Title || "").toLowerCase()
    const description = (
      project.description ||
      project.Description ||
      ""
    ).toLowerCase()

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      description.includes(searchQuery.toLowerCase())

    if (activeFilter === "All") return matchesSearch

    const projectCategory = project.category || project.Category || ""
    const matchesFilter = projectCategory === activeFilter

    return matchesSearch && matchesFilter
  })

  const displayedProjects = showAllProjects
    ? filteredProjects
    : filteredProjects.slice(0, initialItems)

  return (
    <div
      className={`md:px-[10%] px-[5%] w-full overflow-hidden ${isSubpage ? "pt-12 pb-12 md:pt-0 md:pb-24" : "py-12 md:py-24"}`}
      id="Portfolio"
      style={{ backgroundColor: "var(--color-backdrop-base)" }}
    >
      {/* Header section */}
      <div
        className="text-center pb-8"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="inline-block text-3xl md:text-5xl font-display font-bold text-center mx-auto text-white flex items-center justify-center gap-3">
          <span>Things I&apos;ve Built</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-4">
          Here&apos;s a selection of projects I&apos;ve crafted over time. Many
          are open-source, so feel free to explore and contribute!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 md:gap-4 md:max-w-[70%] pb-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              variant={activeFilter === filter ? "default" : "neutral"}
              size="sm"
              className={`rounded-xl transition-all duration-300 cursor-target ${
                activeFilter === filter
                  ? "opacity-100 scale-105 shadow-[4px_4px_0_var(--color-shadow-primary)]"
                  : "opacity-60 saturate-50 hover:opacity-100 hover:saturate-100"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors cursor-target"
            style={{ "--tw-ring-color": "var(--color-primary-light)" }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-primary-light)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255, 255, 255, 0.2)"
            }}
          />
        </div>
      </div>

      {/* Project Grid */}
      <div className="container mx-auto">
        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayedProjects.map((project, index) => (
              <div
                key={project.id || index}
                data-aos={
                  index % 3 === 0
                    ? "fade-up-right"
                    : index % 3 === 1
                      ? "fade-up"
                      : "fade-up-left"
                }
                data-aos-duration={
                  index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"
                }
              >
                <ProjectCard
                  img={project.img || project.Img}
                  title={project.title || project.Title}
                  description={project.description || project.Description}
                  link={project.link || project.Link}
                  id={project.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-12 text-slate-400">
            No projects found matching your search or filter.
          </div>
        )}
      </div>

      {/* Show More/Less Button */}
      {filteredProjects.length > initialItems && (
        <div className="mt-8 w-full flex justify-center">
          <ShowMoreButton
            onClick={toggleShowMore}
            isShowingMore={showAllProjects}
          />
        </div>
      )}
    </div>
  )
}
