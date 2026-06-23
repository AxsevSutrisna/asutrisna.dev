import { useEffect, memo, useMemo } from"react"
import { Link } from "react-router-dom"
import { Code, Award, Globe, ArrowUpRight } from"lucide-react"
import AOS from'aos'
import'aos/dist/aos.css'
import { useAboutContent } from "./hooks/useAboutContent"
import PublicCtaButton from"../../components/ui/public-cta-button"
import { Badge} from"@/components/ui/badge"
import DecryptedText from "@/components/ui/DecryptedText"
import ProfileCard from "@/components/ui/ProfileCard"
import StatCard from "@/components/ui/StatCard"
import LogoLoop from "@/components/ui/LogoLoop"

const ABOUT_FALLBACK = {
 name:"Asep Sutrisna Suhada Putra",
 description:
"Full-Stack Web Developer with experience in end-to-end web application development, from design and development to deployment. Proficient in JavaScript, TypeScript, React, and Next.js for the front end, as well as Node.js and Laravel for the back end.",
 quote:"Use AI as a professional tool, not as a replacement AI as a professional tool, not a replacement.",
 photo_url:"/AsepSutrisnaSuhadaPutra-PhotoProfile.png",
 cv_url:"https://drive.google.com/file/d/14D0m6vlfyBZ3VZB2q66yCtnVf54iTc3E/view?usp=sharing",
}

const ProfileImage = memo(({ name, roleBadges, photoUrl, yearsOfExperience }) => (
  <div className="flex justify-center items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div
      className="relative group w-full max-w-md mx-auto lg:mx-0"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <ProfileCard
        name={name}
        title={roleBadges ? (roleBadges.split(',')[0].trim() === 'Developer' ? 'Full-Stack Developer' : roleBadges.split(',')[0].trim()) : "Full-Stack Developer"}
        handle="asutrisnadev"
        status="Online"
        contactText="Contact Me"
        avatarUrl={photoUrl || ABOUT_FALLBACK.photo_url}
        showUserInfo={false}
        enableTilt={true}
        enableMobileTilt={false}
        behindGlowColor="rgba(125, 190, 255, 0.67)"
        behindGlowEnabled={true}
        innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
        yearsOfExperience={yearsOfExperience}
      />
    </div>
  </div>
));
ProfileImage.displayName = 'ProfileImage';



const AboutPage = () => {
  const {
    content: fetchedContent,
    totalProjects,
    totalCertificates,
    YearExperienceDecimal,
    YearExperienceLabel,
    techStacks
  } = useAboutContent()

 const content = fetchedContent || ABOUT_FALLBACK

 const initAOS = () => {
  AOS.init({
  once: false,
 })
}

 useEffect(() => {
 initAOS();

 // Debounced resize handler
 let resizeTimer;
 const handleResize = () => {
 clearTimeout(resizeTimer);
 resizeTimer = setTimeout(initAOS, 250);
};

 window.addEventListener('resize', handleResize);
 return () => {
 window.removeEventListener('resize', handleResize);
 clearTimeout(resizeTimer);
};
}, []);

 // Memoized stats data
  const statsData = useMemo(() => [
  {
  icon: Code,
  value: totalProjects,
  label:"Total Projects",
  description:"Innovative web solutions crafted",
  animation:"fade-right",
  href:"/projects",
 },
  {
  icon: Award,
  value: totalCertificates,
  label:"Certificates",
  description:"Professional skills validated",
  animation:"fade-up",
  href:"/certificates",
 },
  {
  icon: Globe,
  value: YearExperienceDecimal,
  label:"Years of Experience",
  description: YearExperienceLabel ||"Continuous learning journey",
  animation:"fade-left",
  href:"/experience",
 },
  ], [totalProjects, totalCertificates, YearExperienceDecimal, YearExperienceLabel]);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]"
      id="About"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="w-full mx-auto relative">
        <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          
          <div className="space-y-6 text-left">
            {/* Small Badge About Me */}
            <div data-aos="fade-right" data-aos-duration="1000">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full border-white/20 text-white/80 bg-white/5 backdrop-blur-md">
                <span className="text-sm font-medium" style={{ color: 'var(--color-primary-light)' }}>About Me</span>
              </Badge>
            </div>

            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight"
              data-aos="fade-right"
              data-aos-duration="1200"
            >
              <DecryptedText
                text="Hello, My Name is "
                animateOn="inViewHover"
                revealDirection="start"
                sequential={true}
                className="text-white"
                parentClassName="text-white"
              />
              <br className="hidden sm:block"/>
              <DecryptedText
                text={content.name}
                animateOn="inViewHover"
                revealDirection="start"
                sequential={true}
                className="text-[var(--color-primary-light)]"
                parentClassName="text-[var(--color-primary-light)]"
                style={{ color: 'var(--color-primary-light)' }}
              />
            </h2>

            <div
              className="text-base sm:text-lg leading-relaxed text-justify sm:text-left text-gray-300 space-y-4"
              data-aos="fade-right"
              data-aos-duration="1400"
            >
              {content.description.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
              ))}
            </div>

            {/* Personal Quote */}
            {content.quote && (
              <blockquote
                className="border-l-2 border-white/20 pl-4 text-sm sm:text-base italic text-gray-400"
                style={{ borderColor: 'var(--color-primary-light)' }}
                data-aos="fade-right"
                data-aos-duration="1500"
              >
                &ldquo;{content.quote}&rdquo;
              </blockquote>
            )}

            {/* Role Badges */}
            <div className="flex flex-wrap gap-2 pt-2" data-aos="fade-right" data-aos-duration="1600">
              {(content.role_badges 
                  ? content.role_badges.split(',').map(r => r.trim()).filter(Boolean) 
                  : ['DEVELOPER', 'EDUCATOR', 'MENTOR', 'LECTURER', 'SPEAKER', 'IOT ENTHUSIAST']
              ).map((role) => (
                <Badge key={role} variant="outline" className="px-3 py-1 rounded-md text-[10px] sm:text-xs font-semibold tracking-widest border-white/10 bg-[#0f172a] shadow-sm uppercase" style={{ color: 'var(--color-primary-light)' }}>
                  {role}
                </Badge>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4" data-aos="fade-right" data-aos-duration="1800">
              <PublicCtaButton
                to="/contact"
                text="👋 Get in touch"
                className="w-full sm:w-auto px-8"
              />
              <PublicCtaButton
                to="/stack"
                text="🧠 View Tech Stack"
                className="w-full sm:w-auto px-8"
              />
            </div>
          </div>

          <ProfileImage 
            name={content.name}
            roleBadges={content.role_badges}
            photoUrl={content.photo_url} 
            yearsOfExperience={Math.floor(YearExperienceDecimal)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 lg:mt-24">
          {statsData.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

 <style>{`
 @keyframes float {
 0%, 100% { transform: translateY(0);}
 50% { transform: translateY(-20px);}
}
 @keyframes spin-slower {
 to { transform: rotate(360deg);}
}
 .animate-bounce-slow {
 animation: bounce 3s infinite;
}
 .animate-pulse-slow {
 animation: pulse 3s infinite;
}
 .animate-spin-slower {
 animation: spin-slower 8s linear infinite;
}
 `}</style>
 </div>
 );
};

AboutPage.displayName ='AboutPage';
export default memo(AboutPage);