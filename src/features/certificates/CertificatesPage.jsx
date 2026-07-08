import React, { useEffect, useState, useCallback } from "react"
import { useCertificates } from "./hooks/useCertificates"
import Certificate from "../../components/Certificate"
import AOS from "aos"
import "aos/dist/aos.css"
import { Button } from "../../components/ui/button"

import ShowMoreButton from "../../components/ui/ShowMoreButton"

export default function CertificatesPage() {
  const { certificates } = useCertificates()
  const [showAllCertificates, setShowAllCertificates] = useState(false)

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
    setShowAllCertificates((prev) => !prev)
  }, [])

  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(0, initialItems)

  return (
    <div className="md:px-[10%] px-[5%] w-full">
      <div
        className="text-center pb-10"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
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
              <Certificate ImgSertif={certificate.img || certificate.Img} />
            </div>
          ))}
        </div>
      </div>
      {certificates.length > initialItems && (
        <div className="mt-12 w-full flex justify-center">
          <ShowMoreButton
            onClick={toggleShowMore}
            isShowingMore={showAllCertificates}
          />
        </div>
      )}
    </div>
  )
}
