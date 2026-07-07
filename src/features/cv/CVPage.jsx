import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
    Award,
    BriefcaseBusiness,
    Code2,
    Download,
    ExternalLink,
    FileText,
    Github,
    GraduationCap,
    Instagram,
    Linkedin,
    Mail,
    Youtube,
} from 'lucide-react'

import Certificate from '../../components/Certificate'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import PublicCtaButton from '../../components/ui/public-cta-button'
import { aboutService } from '../../services/aboutService'
import { useCertificates } from '../certificates/hooks/useCertificates'
import { useContactInfo } from '../contact/hooks/useContactInfo'
import { useExperienceData } from '../experience/hooks/useExperienceData'
import { useTechStacks } from '../techstack/hooks/useTechStacks'
import { formatDateRange as formatEducationDate } from '../../utils/educations'
import { formatDateRange as formatWorkDate } from '../../utils/workExperiences'

const FALLBACK_PROFILE = {
    name: 'Muhammad Ikhwan Fathulloh',
    description: 'Software engineer building products, tools, and learning experiences across web and IoT.',
    quote: 'Use AI as a professional tool, not as a replacement.',
    photo_url: '/AsepSutrisnaSuhadaPutra-PhotoProfile.png',
    cv_url: '',
    cv_en_url: '',
    cv_id_url: '',
    role_badges: 'Software Engineer, IoT, AI Engineer, Instructor',
}

const SOCIAL_ICON_MAP = {
    linkedin: Linkedin,
    instagram: Instagram,
    youtube: Youtube,
    github: Github,
    email: Mail,
    gmail: Mail,
    externallink: ExternalLink,
    external: ExternalLink,
}

const parseList = (value) => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
    if (typeof value !== 'string') return []

    const trimmed = value.trim()
    if (!trimmed) return []

    try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean)
        }
    } catch {
        // fall through to string splitting
    }

    return trimmed
        .split(/[,\n|]/)
        .map((item) => item.trim())
        .filter(Boolean)
}

const resolveDriveDownloadUrl = (url) => {
    const value = String(url || '').trim()
    if (!value) return ''

    const directFileMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)\/view/i)
    if (directFileMatch) {
        return `https://drive.google.com/uc?export=download&id=${directFileMatch[1]}`
    }

    const openMatch = value.match(/drive\.google\.com\/open\?id=([^&]+)/i)
    if (openMatch) {
        return `https://drive.google.com/uc?export=download&id=${openMatch[1]}`
    }

    const ucMatch = value.match(/drive\.google\.com\/uc\?id=([^&]+)/i)
    if (ucMatch) {
        return `https://drive.google.com/uc?export=download&id=${ucMatch[1]}`
    }

    return value
}

const formatDateLabel = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

const renderBullets = (text) => {
    if (!text) return null

    const lines = String(text)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

    if (lines.length === 0) return null

    return (
        <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
            {lines.map((line, index) => {
                const isBullet = /^[-•–]\s+/.test(line)
                const content = isBullet ? line.replace(/^[-•–]\s+/, '') : line

                return isBullet ? (
                    <div key={`${index}-${content}`} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-primary-light)]" />
                        <span>{content}</span>
                    </div>
                ) : (
                    <p key={`${index}-${content}`}>{content}</p>
                )
            })}
        </div>
    )
}

const SectionHeader = ({ icon: Icon, eyebrow, title, description }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gray-500">
            <Icon className="h-3.5 w-3.5 text-[color:var(--color-primary-light)]" />
            <span>{eyebrow}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
        {description ? <p className="max-w-2xl text-sm sm:text-base text-gray-400">{description}</p> : null}
    </div>
)

const DownloadMenu = ({ options }) => {
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    return (
        <div ref={menuRef} className="relative">
            <PublicCtaButton
                onClick={() => setOpen((current) => !current)}
                text="Download CV"
                icon={Download}
                iconClassName="w-4 h-4"
                className="cursor-target"
            />

            {open ? (
                <div className="absolute left-0 top-full z-30 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] p-2 shadow-2xl shadow-black/40">
                    {options.map((option) => {
                        const isDisabled = !option.url
                        const href = option.url ? resolveDriveDownloadUrl(option.url) : '#'

                        return isDisabled ? (
                            <div
                                key={option.label}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-500 opacity-50"
                            >
                                <FileText className="h-4 w-4" />
                                <div>
                                    <div className="font-medium text-gray-400">{option.label}</div>
                                    <div className="text-xs text-gray-600">Not available yet</div>
                                </div>
                            </div>
                        ) : (
                            <a
                                key={option.label}
                                href={href}
                                download
                                onClick={() => setOpen(false)}
                                className="cursor-target flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white transition-colors hover:bg-white/5"
                            >
                                <FileText className="h-4 w-4 text-[color:var(--color-primary-light)]" />
                                <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-gray-500">{option.description}</div>
                                </div>
                            </a>
                        )
                    })}
                </div>
            ) : null}
        </div>
    )
}

export default function CVPage() {
    const [aboutContent, setAboutContent] = useState(null)
    const [aboutLoading, setAboutLoading] = useState(true)

    const { socialLinks, loading: socialLoading } = useContactInfo()
    const { workExperiences, educations, loading: experienceLoading } = useExperienceData()
    const { techStacks, loading: techLoading } = useTechStacks()
    const { certificates, loading: certificatesLoading } = useCertificates()

    useEffect(() => {
        let active = true

        const fetchAboutContent = async () => {
            setAboutLoading(true)
            try {
                const data = await aboutService.fetchAboutContent()
                if (active) {
                    setAboutContent(data)
                }
            } catch (error) {
                console.error('Failed to fetch about content for CV:', error)
                if (active) {
                    setAboutContent(null)
                }
            } finally {
                if (active) {
                    setAboutLoading(false)
                }
            }
        }

        fetchAboutContent()
        return () => {
            active = false
        }
    }, [])

    const profile = aboutContent || FALLBACK_PROFILE

    const roleBadges = useMemo(() => parseList(profile.role_badges), [profile.role_badges])
    const heroSubtitle = useMemo(() => {
        if (roleBadges.length > 0) {
            return roleBadges.join(' · ')
        }

        return 'Software · IoT · AI Engineer & Instructor'
    }, [roleBadges])

    const orderedSocialLinks = useMemo(() => {
        const items = Array.isArray(socialLinks) ? [...socialLinks] : []

        return items.sort((left, right) => {
            if (Boolean(left.is_primary) !== Boolean(right.is_primary)) {
                return left.is_primary ? -1 : 1
            }

            const leftOrder = Number(left.sort_order ?? 0)
            const rightOrder = Number(right.sort_order ?? 0)
            if (leftOrder !== rightOrder) {
                return leftOrder - rightOrder
            }

            return String(left.display_name || left.platform || '').localeCompare(String(right.display_name || right.platform || ''))
        })
    }, [socialLinks])

    const socialButtons = useMemo(() => {
        return orderedSocialLinks.map((link) => {
            const platform = String(link.icon || link.platform || link.display_name || 'external').toLowerCase()
            const Icon = SOCIAL_ICON_MAP[platform] || ExternalLink
            const label = link.display_name || link.platform || 'Social Link'

            return {
                id: link.id,
                label,
                url: link.url,
                subText: link.sub_text || link.subText || '',
                Icon,
            }
        })
    }, [orderedSocialLinks])

    const downloadOptions = useMemo(() => ([
        {
            label: 'CV English',
            description: 'Download the English version',
            url: profile.cv_en_url || profile.cv_url || '',
        },
        {
            label: 'CV Indonesia',
            description: 'Download the Indonesian version',
            url: profile.cv_id_url || profile.cv_url || '',
        },
    ]), [profile.cv_en_url, profile.cv_id_url, profile.cv_url])

    const groupedSkills = useMemo(() => {
        return Object.entries(techStacks || {})
            .map(([category, stacks]) => ({
                category,
                stacks: Array.isArray(stacks) ? stacks : [],
            }))
            .sort((left, right) => left.category.localeCompare(right.category))
    }, [techStacks])

    const isLoading = aboutLoading || socialLoading || experienceLoading || techLoading || certificatesLoading

    if (isLoading && !aboutContent) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-[5%]">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--color-primary-light)]" />
            </div>
        )
    }

    return (
        <div className="px-[5%] md:px-[10%] pb-24">
            <Helmet>
                <title>CV | asutrisnadev</title>
                <meta
                    name="description"
                    content={profile.description || 'Curriculum Vitae and career overview of Muhammad Ikhwan Fathulloh.'}
                />
            </Helmet>

            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center pt-4 sm:pt-8">
                    <Badge variant="primary" className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.25em]">
                        Curriculum Vitae
                    </Badge>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                            {profile.name}
                        </h1>
                        <p className="text-base font-semibold text-gray-400 sm:text-lg">
                            {heroSubtitle}
                        </p>
                        <p className="mx-auto max-w-3xl text-base leading-7 text-gray-400 sm:text-lg">
                            {profile.description}
                        </p>
                    </div>

                    {socialButtons.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            {socialButtons.map((social) => (
                                <PublicCtaButton
                                    key={social.id || social.label}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    text={social.label}
                                    icon={social.Icon}
                                    iconClassName="w-4 h-4"
                                    className="cursor-target"
                                />
                            ))}
                        </div>
                    ) : null}

                    <div className="pt-4">
                        <DownloadMenu options={downloadOptions} />
                    </div>
                </section>

                <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card className="rounded-[28px] border-white/10 bg-white/5 p-0">
                        <CardHeader className="space-y-4 border-b border-white/10 p-6 sm:p-8">
                            <SectionHeader
                                icon={BriefcaseBusiness}
                                eyebrow="Experience"
                                title="Career timeline"
                            />
                        </CardHeader>
                        <CardContent className="space-y-6 p-6 sm:p-8">
                            {workExperiences.length > 0 ? (
                                workExperiences.map((experience) => {
                                    const techStack = Array.isArray(experience.tech_stack) ? experience.tech_stack : []

                                    return (
                                        <div key={experience.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="text-xl font-bold text-white">{experience.position}</h3>
                                                        {experience.is_current ? (
                                                            <Badge variant="primary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]">
                                                                Current
                                                            </Badge>
                                                        ) : null}
                                                    </div>
                                                    <p className="text-sm font-medium text-[color:var(--color-primary-light)]">{experience.company}</p>
                                                    <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                            {experience.employment_type}
                                                        </span>
                                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                            {formatWorkDate(experience.start_month, experience.start_year, experience.end_month, experience.end_year, experience.is_current)}
                                                        </span>
                                                        {experience.location ? (
                                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                                {experience.location}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            {experience.description ? <div className="mt-4">{renderBullets(experience.description)}</div> : null}

                                            {techStack.length > 0 ? (
                                                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                                                    {techStack.map((tech) => (
                                                        <Badge key={tech} variant="neutral" className="rounded-full px-3 py-1.5 text-xs">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-sm text-gray-500">
                                    No work experience data is available yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        <Card className="rounded-[28px] border-white/10 bg-white/5 p-0">
                            <CardHeader className="border-b border-white/10 p-6 sm:p-8">
                                <SectionHeader
                                    icon={GraduationCap}
                                    eyebrow="Education"
                                    title="Academic background"
                                />
                            </CardHeader>
                            <CardContent className="space-y-4 p-6 sm:p-8">
                                {educations.length > 0 ? (
                                    educations.map((education) => (
                                        <div key={education.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-semibold text-white">{education.school}</h3>
                                                    <p className="text-sm text-gray-300">
                                                        {education.degree}
                                                        {education.field_of_study ? ` in ${education.field_of_study}` : ''}
                                                    </p>
                                                </div>
                                                <Badge variant="neutral" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                                                    {formatEducationDate(
                                                        education.start_month,
                                                        education.start_year,
                                                        education.end_month,
                                                        education.end_year,
                                                        education.is_current,
                                                    )}
                                                </Badge>
                                            </div>

                                            <div className="mt-3 space-y-2 text-sm text-gray-400">
                                                {education.grade ? <p>Grade: {education.grade}</p> : null}
                                                {education.activities ? <p>{education.activities}</p> : null}
                                                {education.description ? <div>{renderBullets(education.description)}</div> : null}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-sm text-gray-500">
                                        No education data is available yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="rounded-[28px] border-white/10 bg-white/5 p-0">
                            <CardHeader className="border-b border-white/10 p-6 sm:p-8">
                                <SectionHeader
                                    icon={Code2}
                                    eyebrow="Skills"
                                    title="Stack by category"
                                />
                            </CardHeader>
                            <CardContent className="space-y-4 p-6 sm:p-8">
                                {groupedSkills.length > 0 ? (
                                    groupedSkills.map((group) => (
                                        <div key={group.category} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-300">{group.category}</h3>
                                                <Badge variant="neutral" className="rounded-full px-3 py-1 text-[11px]">
                                                    {group.stacks.length}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {group.stacks.map((stack) => (
                                                    <Badge key={stack.id || stack.name} variant="default" className="rounded-full px-3 py-1.5 text-xs">
                                                        {stack.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-sm text-gray-500">
                                        No active tech stacks are available yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section>
                    <Card className="rounded-[28px] border-white/10 bg-white/5 p-0">
                        <CardHeader className="border-b border-white/10 p-6 sm:p-8">
                            <SectionHeader
                                icon={Award}
                                eyebrow="Certificates"
                                title="Professional proof"
                            />
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            {certificates.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {certificates.map((certificate, index) => (
                                        <div key={certificate.id || index} className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                                            <Certificate ImgSertif={certificate.img || certificate.Img} />
                                            <div className="flex items-center justify-between gap-3 text-sm text-gray-400">
                                                <span>Certificate #{index + 1}</span>
                                                {certificate.created_at ? <span>{formatDateLabel(certificate.created_at)}</span> : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-sm text-gray-500">
                                    No certificates are available yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}