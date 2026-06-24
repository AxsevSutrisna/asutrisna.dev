import React, { useState, useEffect, useRef } from 'react';
import { useExperienceData } from './hooks/useExperienceData';
import { MapPin, CalendarDays, Sparkles } from 'lucide-react';
import { formatDateRange as formatWorkDate } from '../../utils/workExperiences';
import { formatDateRange as formatEduDate } from '../../utils/educations';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ── UI Helpers ── */
function renderDescription(text, primaryColor = 'var(--color-primary-light)') {
  if (!text) return null;
  const lines = text.split('\n');
  const blocks = [];
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    const isBullet = /^[-•–]\s+/.test(line);
    if (isBullet) blocks.push({ type: 'bullet', content: line.replace(/^[-•–]\s+/, '') });
    else blocks.push({ type: 'text', content: line });
  });

  if (!blocks.length) return null;

  const elements = [];
  let i = 0;
  while (i < blocks.length) {
    if (blocks[i].type === 'bullet') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'bullet') {
        items.push(blocks[i].content);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 list-none mt-3">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-sm sm:text-base text-gray-300 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-sm sm:text-base text-gray-300 leading-relaxed mt-3">
          {blocks[i].content}
        </p>
      );
      i++;
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

/* ── Generic Expandable Card ── */
const ExpandableCard = ({ title, subtitle, dateRange, location, badges, description, isCurrent, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > 180) {
        setIsTruncated(true);
      }
    }
  }, [description]);

  return (
    <div className="relative group mb-8 last:mb-0">
      <div className="absolute -inset-0.5 bg-[#0f172a] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <Card className="relative h-full p-6 sm:p-8 bg-[#0f172a]/80 backdrop-blur-md border-white/10 group-hover:border-white/20 transition-all duration-500 rounded-3xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {title}
              </h3>
              {isCurrent && (
                <Badge variant="primary" className="text-xs uppercase tracking-wider px-3 py-1 font-semibold">
                  Current
                </Badge>
              )}
            </div>

            <div className="text-lg text-gray-300 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white">{subtitle}</span>
              {badges && badges.map((badge, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-gray-600">•</span>
                  <Badge variant="neutral" className="text-[10px] uppercase tracking-widest px-2 py-0.5 font-medium bg-white/5 text-gray-300">
                    {badge}
                  </Badge>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <CalendarDays className="w-4 h-4 text-theme-primary-light" />
              <span>{dateRange}</span>
            </div>

            {location && (
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 text-theme-primary-light" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {description && (
          <div className="mt-6 relative">
            <div 
              ref={contentRef}
              className={`transition-all duration-700 ease-in-out overflow-hidden ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-[150px] opacity-90'
              }`}
            >
              {renderDescription(description)}
              
              {/* Smooth Fade Overlay when truncated */}
              {!isExpanded && isTruncated && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none" />
              )}
            </div>
            
            {isTruncated && (
              <div className={`mt-4 flex justify-start ${!isExpanded ? 'relative z-10 -mt-6' : ''}`}>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group/btn no-neo flex items-center gap-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-6 py-2.5 transition-all duration-300 backdrop-blur-sm shadow-none"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 text-theme-primary-light ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {children}
      </Card>
    </div>
  );
};

/* ── Main Component ── */
export default function ExperienceContent() {
  const [activeTab, setActiveTab] = useState('work'); // 'work' or 'education'
  const { workExperiences, educations, loading } = useExperienceData();

  const TABS = [
    { id: 'work', label: 'Working Experience', number: '01' },
    { id: 'education', label: 'Educational History', number: '02' },
  ];

  return (
    <section className="pb-24 px-[5%] md:px-[10%] min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Column: Navigation Sidebar */}
        <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit lg:z-30">
          {/* Page Title & Description */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-left">
              Professional <span className="text-theme-primary-light">Journey</span>
            </h1>
            <p className="text-gray-400 mt-4 text-base md:text-lg max-w-2xl text-left">
              A timeline of my career path, achievements, and educational foundation.
            </p>
          </div>

          {/* Sticky Tabs container on mobile, relative inside sticky parent on desktop */}
          <div className="sticky top-[76px] lg:relative lg:top-0 z-30 flex flex-row lg:flex-col gap-3 bg-white/5 border border-white/10 rounded-3xl p-2.5 sm:p-6 backdrop-blur-xl">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center justify-center lg:justify-start gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl transition-all duration-500 font-medium text-center lg:text-left no-neo
                    ${isActive 
                      ? 'bg-theme-primary text-white scale-[1.02] shadow-xl shadow-theme-primary/30' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white shadow-none'
                    }
                  `}
                >
                  <span className={`text-sm font-bold opacity-50 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {tab.number}
                  </span>
                  <span className="text-base sm:text-lg">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:w-2/3 flex flex-col">
          {loading ? (
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-8 animate-pulse min-h-[300px]" />
              ))}
            </div>
          ) : (
            <div className="space-y-8 transition-all duration-500 ease-in-out">
              {activeTab === 'work' && (
                workExperiences.length > 0 ? workExperiences.map((exp) => {
                  const techStack = Array.isArray(exp.tech_stack) ? exp.tech_stack : [];
                  return (
                    <ExpandableCard
                      key={exp.id}
                      title={exp.position}
                      subtitle={exp.company}
                      dateRange={formatWorkDate(exp.start_month, exp.start_year, exp.end_month, exp.end_year, exp.is_current)}
                      location={exp.location}
                      badges={[exp.employment_type]}
                      description={exp.description}
                      isCurrent={exp.is_current}
                    >
                      {techStack.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                          <div className="flex flex-wrap gap-2">
                            {techStack.map((tech) => (
                              <Badge
                                key={tech}
                                variant="neutral"
                                className="text-xs font-medium bg-white/5 hover:bg-theme-primary/20 hover:text-theme-primary-light border-white/10 hover:border-theme-primary/30 transition-all duration-300 px-3 py-1.5"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </ExpandableCard>
                  );
                }) : (
                  <div className="text-center py-20 text-gray-400">No working experience found.</div>
                )
              )}

              {activeTab === 'education' && (
                educations.length > 0 ? educations.map((edu) => (
                  <ExpandableCard
                    key={edu.id}
                    title={edu.school}
                    subtitle={`${edu.degree} ${edu.field_of_study ? `in ${edu.field_of_study}` : ''}`}
                    dateRange={formatEduDate(edu.start_month, edu.start_year, edu.end_month, edu.end_year, edu.is_current)}
                    badges={edu.grade ? [`Grade: ${edu.grade}`] : null}
                    description={edu.description}
                    isCurrent={edu.is_current}
                  >
                    {edu.activities && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-theme-primary-light" />
                          Activities & Societies
                        </h4>
                        <div className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          {renderDescription(edu.activities)}
                        </div>
                      </div>
                    )}
                  </ExpandableCard>
                )) : (
                  <div className="text-center py-20 text-gray-400">No educational history found.</div>
                )
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
