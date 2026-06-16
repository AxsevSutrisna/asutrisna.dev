import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import AOS from "aos";
import "aos/dist/aos.css";
import { ExternalLink, Mail, Linkedin, Github, Instagram, Youtube } from "lucide-react";
import { Button } from "../components/ui/button";

const ICONS = {
    Linkedin,
    Instagram,
    Youtube,
    Github,
    GitHub: Github,
    Email: Mail,
    Gmail: Mail,
    ExternalLink
};

const ContactPage = () => {
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
        AOS.init({ once: false });
        
        const fetchSocialLinks = async () => {
            try {
                const { data, error } = await supabase
                    .from('social_links')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });
                
                if (!error && data) {
                    setSocialLinks(data);
                }
            } catch (err) {
                console.error("Error fetching social links:", err);
            }
        };
        fetchSocialLinks();
    }, []);

    const roles = [
        "Software Engineer", 
        "Tech Educator", 
        "Keynote Speaker", 
        "Workshop Mentor", 
        "IoT Consultant", 
        "Project Lead"
    ];

    const getIconComponent = (iconName, platformName) => {
        const nameToUse = iconName || platformName || '';
        // Find matching key case-insensitively
        const matchedKey = Object.keys(ICONS).find(
            key => key.toLowerCase() === nameToUse.toLowerCase()
        );
        return matchedKey ? ICONS[matchedKey] : ExternalLink;
    };

    return (
        <div className="px-[5%] sm:px-[5%] lg:px-[10%] py-12 md:py-24" id="Contact">
            <div className="flex items-center justify-center">
                <div 
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    className="neo-shell w-full max-w-4xl p-8 md:p-16 relative overflow-hidden" 
                    style={{ boxShadow: '8px 8px 0 var(--color-shadow-primary)' }}
                >
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div 
                            data-aos="fade-down"
                            data-aos-delay="100"
                            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border-2"
                            style={{ 
                                backgroundColor: 'color-mix(in srgb, var(--color-primary-light) 10%, transparent)', 
                                color: 'var(--color-primary-light)', 
                                borderColor: 'var(--color-border-light)' 
                            }}
                        >
                            LET'S BUILD SOMETHING GREAT
                        </div>
                        
                        <h2 
                            data-aos="fade-up"
                            data-aos-delay="200"
                            className="text-4xl md:text-5xl font-bold mb-6"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            Ready to <span style={{ color: 'var(--color-primary-light)' }}>Collaborate?</span>
                        </h2>
                        
                        <p 
                            data-aos="fade-up"
                            data-aos-delay="300"
                            className="max-w-2xl mx-auto text-base md:text-lg mb-10"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Whether you have a professional inquiry, a community initiative, or just want to say hi, my inbox is always open.
                        </p>

                        <div 
                            data-aos="fade-up"
                            data-aos-delay="400"
                            className="flex flex-wrap justify-center gap-4 mb-14"
                        >
                            {socialLinks.map((link, index) => {
                                const IconComponent = getIconComponent(link.icon, link.platform);
                                const linkColor = link.color || 'var(--color-primary-light)';
                                
                                return (
                                    <Button 
                                        key={link.id || index} 
                                        asChild 
                                        variant="neutral"
                                    >
                                        <a 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="font-bold"
                                        >
                                            <IconComponent style={{ color: linkColor }} />
                                            {link.display_name}
                                        </a>
                                    </Button>
                                );
                            })}
                        </div>

                        <div 
                            data-aos="fade-up"
                            data-aos-delay="500"
                            className="w-full pt-10 border-t-2"
                            style={{ borderColor: 'var(--color-border-light)' }}
                        >
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--color-text-muted)' }}>
                                Available Roles for Collaboration
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {roles.map(role => (
                                    <div 
                                        key={role} 
                                        className="px-4 py-2 border-2 rounded-full text-sm font-bold cursor-default shadow-[2px_2px_0_var(--color-shadow-primary)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                                        style={{ 
                                            backgroundColor: 'var(--color-backdrop-base)',
                                            color: 'var(--color-text-secondary)',
                                            borderColor: 'var(--color-border-light)'
                                        }}
                                    >
                                        {role}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;