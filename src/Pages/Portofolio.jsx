import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import CardProject from "../components/CardProject";
import AOS from "aos";
import "aos/dist/aos.css";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";

const ToggleButton = ({ onClick, isShowingMore }) => (
    <Button
        onClick={onClick}
        variant="ghost"
        size="sm"
        className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-3 py-1.5 text-sm font-medium"
    >
        <span className="relative z-10 flex items-center gap-2">
            {isShowingMore ? "See Less" : "See More"}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`
 transition-transform 
 duration-300 
 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
 `}
            >
                <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
        </span>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
    </Button>
);

export default function Portofolio() {
    const [projects, setProjects] = useState([]);
    const [showAllProjects, setShowAllProjects] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const isMobile = window.innerWidth < 768;
    const initialItems = isMobile ? 4 : 6;

    useEffect(() => {
        AOS.init({ once: false });
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const { data, error } = await supabase.from("projects").select("*").order('id', { ascending: false });
            if (error) throw error;
            const projectData = data || [];
            setProjects(projectData);
            localStorage.setItem("projects", JSON.stringify(projectData));
        } catch (error) {
            console.error("Error fetching data from Supabase:", error.message);
        }
    }, []);

    useEffect(() => {
        const cachedProjects = localStorage.getItem('projects');
        if (cachedProjects) {
            setProjects(JSON.parse(cachedProjects));
        }
        fetchData();
    }, [fetchData]);

    const toggleShowMore = useCallback(() => {
        setShowAllProjects(prev => !prev);
    }, []);

    // Array filter dari gambar referensi
    const filters = [
        "All", "Open Source", "Education", "Programming", "Website", 
        "Machine Learning", "Cloud Computing", "Internet of Things", "Mobile", "Desktop"
    ];

    const filteredProjects = projects.filter(project => {
        const title = (project.title || project.Title || "").toLowerCase();
        const description = (project.description || project.Description || "").toLowerCase();
        const techStackString = Array.isArray(project.tech_stack) ? project.tech_stack.join(' ').toLowerCase() : '';
        const featuresString = Array.isArray(project.features) ? project.features.join(' ').toLowerCase() : '';
        
        const matchesSearch = title.includes(searchQuery.toLowerCase()) || description.includes(searchQuery.toLowerCase());
        
        if (activeFilter === "All") return matchesSearch;
        
        const combinedString = `${title} ${description} ${techStackString} ${featuresString}`;
        const matchesFilter = combinedString.includes(activeFilter.toLowerCase());
        
        return matchesSearch && matchesFilter;
    });

    const displayedProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, initialItems);

    return (
        <div className="md:px-[10%] px-[5%] w-full overflow-hidden py-12 md:py-24" id="Portofolio" style={{ backgroundColor: 'var(--color-backdrop-base)' }}>
            
            {/* Header section */}
            <div className="text-center pb-8" data-aos="fade-up" data-aos-duration="1000">
                <h2 className="inline-block text-3xl md:text-5xl font-display font-bold text-center mx-auto text-white flex items-center justify-center gap-3">
                    <span>🚀 Things I've Built</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-4">
                    Here's a selection of projects I've crafted over time. Many are open-source, so feel free to explore and contribute!
                </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4" data-aos="fade-up" data-aos-duration="1000">
                
                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 md:max-w-[70%]">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`no-neo px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                activeFilter === filter 
                                ? "text-white" 
                                : "bg-transparent border border-white/20 text-slate-300 hover:border-white/40 hover:text-white"
                            }`}
                            style={activeFilter === filter ? { backgroundColor: 'var(--color-primary-light)' } : {}}
                        >
                            {filter}
                        </button>
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
                        className="w-full bg-[#111827] border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
                        style={{ '--tw-ring-color': 'var(--color-primary-light)' }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary-light)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
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
                                data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                                data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                            >
                                <CardProject
                                    Img={project.img || project.Img}
                                    Title={project.title || project.Title}
                                    Description={project.description || project.Description}
                                    Link={project.link || project.Link}
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
                    <ToggleButton
                        onClick={toggleShowMore}
                        isShowingMore={showAllProjects}
                    />
                </div>
            )}
        </div>
    );
}