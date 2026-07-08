import { useCourses } from "./hooks/useCourses"
import { BookOpen, ExternalLink } from "lucide-react"
import PublicCtaButton from "../../components/ui/public-cta-button"
export default function CoursesPage() {
  const { courses, loading } = useCourses()

  return (
    <div className="px-[5%] sm:px-[10%]">
      <div className="text-center pb-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Courses & Bootcamps
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Certifications and learning paths I have completed.
        </p>
      </div>
      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition"
            >
              {course.img_url ? (
                <img
                  src={course.img_url}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex justify-center items-center bg-black/20">
                  <BookOpen className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-indigo-400 text-sm mb-3">
                  {course.provider}{" "}
                  {course.completion_date && `• ${course.completion_date}`}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {course.description}
                </p>
                {course.certificate_link && (
                  <PublicCtaButton
                    href={course.certificate_link}
                    target="_blank"
                    rel="noreferrer"
                    text="View Certificate"
                    icon={ExternalLink}
                    className="px-4 py-2 text-sm"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
