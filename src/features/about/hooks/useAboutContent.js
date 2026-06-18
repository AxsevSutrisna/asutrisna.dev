import { useEffect, useMemo } from 'react';
import { useAboutStore } from '../../../store/useAboutStore';
import { useProjectStore } from '../../../store/useProjectStore';
import { useCertificatesStore } from '../../../store/useCertificatesStore';

const ABOUT_FALLBACK = {
  name: "Asep Sutrisna Suhada Putra",
  description:
    "Saya adalah mahasiswa Teknik Informatika yang berfokus pada pengembangan Front-End. Saya berfokus pada penciptaan pengalaman digital yang menarik dan selalu berupaya memberikan solusi terbaik dalam setiap proyek yang saya kerjakan.",
  quote: "Leveraging AI as a professional tool, not a replacement.",
  photo_url: "/Photo.jpg",
  cv_url: "https://drive.google.com/file/d/14D0m6vlfyBZ3VZB2q66yCtnVf54iTc3E/view?usp=sharing",
};

export function useAboutContent() {
  const { content: aboutContent, workItems, loading, fetchAboutData } = useAboutStore();
  const { projects, fetchProjects } = useProjectStore();
  const { certificates, fetchCertificates } = useCertificatesStore();

  useEffect(() => {
    fetchAboutData();
    fetchProjects();
    fetchCertificates();
  }, [fetchAboutData, fetchProjects, fetchCertificates]);

  const { YearExperienceDecimal, YearExperienceLabel } = useMemo(() => {
    if (!Array.isArray(workItems) || workItems.length === 0) {
      const startDate = new Date('2021-11-06');
      const now = new Date();
      let years = now.getFullYear() - startDate.getFullYear();
      if (now.getMonth() < startDate.getMonth() || (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate())) years -= 1;
      const decimal = Number(years.toFixed(1));
      const label = `${years} ${years === 1 ? 'year' : 'years'}`;
      return { YearExperienceDecimal: decimal, YearExperienceLabel: label };
    }

    const starts = workItems
      .map((w) => ({ month: Number(w.start_month) || 1, year: Number(w.start_year) || 0 }))
      .filter((s) => s.year > 0);

    const ends = workItems.map((w) => {
      if (w.is_current) {
        const now = new Date();
        return { month: now.getMonth() + 1, year: now.getFullYear() };
      }
      return { month: Number(w.end_month) || 1, year: Number(w.end_year) || (Number(w.start_year) || 0) };
    });

    if (starts.length === 0 || ends.length === 0) {
      return { YearExperienceDecimal: 0, YearExperienceLabel: '0 years' };
    }

    const earliest = starts.reduce((min, cur) => {
      if (cur.year < min.year) return cur;
      if (cur.year === min.year && cur.month < min.month) return cur;
      return min;
    }, starts[0]);

    const latest = ends.reduce((max, cur) => {
      if (cur.year > max.year) return cur;
      if (cur.year === max.year && cur.month > max.month) return cur;
      return max;
    }, ends[0]);

    const totalMonths = (latest.year - earliest.year) * 12 + (latest.month - earliest.month);
    const years = Math.floor(totalMonths / 12);
    const months = Math.max(0, totalMonths % 12);
    const decimal = Number((totalMonths / 12).toFixed(1));
    const label = months > 0
      ? `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'} (${decimal} yrs)`
      : `${years} ${years === 1 ? 'year' : 'years'} (${decimal} yrs)`;

    return { YearExperienceDecimal: decimal, YearExperienceLabel: label };
  }, [workItems]);

  const content = aboutContent || ABOUT_FALLBACK;
  const totalProjects = projects.length;
  const totalCertificates = certificates.length;

  return {
    content,
    loading,
    totalProjects,
    totalCertificates,
    YearExperienceDecimal,
    YearExperienceLabel
  };
}
