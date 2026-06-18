import { useEffect, memo, useMemo } from"react"
import { Link } from "react-router-dom"
import { Code, Award, Globe, ArrowUpRight } from"lucide-react"
import AOS from'aos'
import'aos/dist/aos.css'
import { useAboutContent } from "./hooks/useAboutContent"
import PublicCtaButton from"../../components/ui/public-cta-button"
import { Badge} from"@/components/ui/badge"

const ABOUT_FALLBACK = {
 name:"Asep Sutrisna Suhada Putra",
 description:
"Saya adalah mahasiswa Teknik Informatika yang berfokus pada pengembangan Front-End. Saya berfokus pada penciptaan pengalaman digital yang menarik dan selalu berupaya memberikan solusi terbaik dalam setiap proyek yang saya kerjakan.",
 quote:"Leveraging AI as a professional tool, not a replacement.",
 photo_url:"/Photo.jpg",
 cv_url:"https://drive.google.com/file/d/14D0m6vlfyBZ3VZB2q66yCtnVf54iTc3E/view?usp=sharing",
}

// No normalizeCvPath needed

const ProfileImage = memo(({ photoUrl, yearsOfExperience }) => (
  <div className="flex justify-center items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div
      className="relative group w-full max-w-md mx-auto lg:mx-0"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="absolute -inset-4 opacity-[20%] z-0 hidden sm:block">
        <div className="absolute inset-0 rounded-[2rem] blur-2xl animate-pulse-slow" style={{ background: 'var(--color-primary-light)' }} />
      </div>

      <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/20">
        <img
          src={photoUrl || ABOUT_FALLBACK.photo_url}
          alt="Profile"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = ABOUT_FALLBACK.photo_url
          }}
        />
        
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent opacity-80" />
        
        {/* Floating Badge */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#161b22] border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col items-center justify-center transform transition-all duration-500 hover:scale-105 hover:border-white/20 hover:shadow-[0_0_20px_rgba(var(--color-primary-light-rgb),0.3)]">
          <span className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-primary-light)' }}>
            {yearsOfExperience}+
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
            Years Experience
          </span>
        </div>
      </div>
    </div>
  </div>
));
ProfileImage.displayName = 'ProfileImage';

const StatCard = memo(({ icon: Icon, value, label, description, animation, href}) => {
 const isInternalLink = href && href.startsWith('/');
 const Wrapper = isInternalLink ? Link : (href ? 'a' : 'div');
 const linkProps = isInternalLink ? { to: href } : (href ? { href } : {});

 return (
 <Wrapper
 data-aos={animation}
 data-aos-duration={1300}
 className="relative group block h-full"
 {...linkProps}
 >
 <div className="relative z-10 p-6 h-full flex flex-col justify-between rounded-xl border-2 border-white/10 bg-white/5 shadow-[6px_6px_0_rgba(255,255,255,0.15)] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none hover:border-white/30 transition-all duration-200">
 <div className="absolute -z-10 inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" style={{ background:'linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary-light))'}}></div>

 <div className="flex items-center justify-between mb-4">
 <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 transition-transform duration-500 group-hover:rotate-12 group-hover:bg-white/20">
 <Icon className="w-8 h-8 text-white" />
 </div>
 <span
 className="text-4xl font-bold text-white"
 data-aos="fade-up-left"
 data-aos-duration="1500"
 data-aos-anchor-placement="top-bottom"
 >
 {value}
 </span>
 </div>

 <div>
 <p
 className="text-sm uppercase tracking-wider mb-2"
 style={{ color:'var(--color-text-secondary)'}}
 data-aos="fade-up"
 data-aos-duration="800"
 data-aos-anchor-placement="top-bottom"
 >
 {label}
 </p>
 <div className="flex items-center justify-between">
 <p
 className="text-xs"
 style={{ color:'var(--color-text-muted)'}}
 data-aos="fade-up"
 data-aos-duration="1000"
 data-aos-anchor-placement="top-bottom"
 >
 {description}
 </p>
 <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
 </div>
 </div>
 </div>
 </Wrapper>
 )
});
StatCard.displayName ='StatCard';

const AboutPage = () => {
  const {
    content: fetchedContent,
    totalProjects,
    totalCertificates,
    YearExperienceDecimal,
    YearExperienceLabel
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
              <span className="text-white">Hello, My Name is </span>
              <br className="hidden sm:block"/>
              <span style={{ color: 'var(--color-primary-light)' }}>{content.name}</span>
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

          <ProfileImage photoUrl={content.photo_url} yearsOfExperience={Math.floor(YearExperienceDecimal)} />
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