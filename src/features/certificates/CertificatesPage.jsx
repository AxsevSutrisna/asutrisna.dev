import React, { useEffect, useState, useCallback } from 'react';
import { useCertificates } from './hooks/useCertificates';
import Certificate from '../../components/Certificate';
import AOS from "aos";
import "aos/dist/aos.css";
import { Button } from "../../components/ui/button";

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

export default function CertificatesPage() {
    const { certificates } = useCertificates();
    const [showAllCertificates, setShowAllCertificates] = useState(false);
    
    const isMobile = window.innerWidth < 768;
    const initialItems = isMobile ? 4 : 6;

    useEffect(() => {
        AOS.init({ once: false });
    }, []);

    const toggleShowMore = useCallback(() => {
        setShowAllCertificates(prev => !prev);
    }, []);

    const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

    return (
        <div className="md:px-[10%] px-[5%] w-full">
                    
                    <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
                        <h2 className="inline-block text-3xl md:text-5xl font-display font-bold text-center mx-auto text-white">
                            <span>🎓 My Certificates</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
                            A collection of my professional certifications and achievements.
                        </p>
                    </div>

                    <div className="container mx-auto flex justify-center items-center p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                            {displayedCertificates.map((certificate, index) => (
                                <div
                                    key={certificate.id || index}
                                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                                >
                                    <Certificate ImgSertif={certificate.img || certificate.Img} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {certificates.length > initialItems && (
                        <div className="mt-6 w-full flex justify-center">
                            <ToggleButton
                                onClick={toggleShowMore}
                                isShowingMore={showAllCertificates}
                            />
                        </div>
                    )}
        </div>
    );
}