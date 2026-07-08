import { useEffect, useMemo } from "react"
import { useExperienceStore } from "../../../store/useExperienceStore"
import {
  normalizeWorkExperience,
  compareWorkExperienceTimeline,
} from "../../../utils/workExperiences"
import {
  normalizeEducation,
  compareEducationTimeline,
} from "../../../utils/educations"

export function useExperienceData() {
  const {
    workExperiences: rawWork,
    educations: rawEdu,
    loading,
    fetchExperienceData,
  } = useExperienceStore()

  useEffect(() => {
    fetchExperienceData()
  }, [fetchExperienceData])

  const workExperiences = useMemo(() => {
    return (rawWork || [])
      .map(normalizeWorkExperience)
      .sort(compareWorkExperienceTimeline)
  }, [rawWork])

  const educations = useMemo(() => {
    return (rawEdu || []).map(normalizeEducation).sort(compareEducationTimeline)
  }, [rawEdu])

  return { workExperiences, educations, loading }
}
