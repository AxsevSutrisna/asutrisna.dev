import { Button } from './button'
import { Link } from 'react-router-dom'

const HERO_CTA_CLASS =''

export default function PublicCtaButton({
 href,
 text,
    icon: Icon,
    iconClassName = 'w-4 h-4 text-current',
    iconStyle = {},
    onClick,
    to,
    target,
    rel,
    type = 'button',
    disabled,
    className = '',
    ...props
}) {
    if (to) {
        return (
            <Button asChild variant="neutral" size="default" className={`${HERO_CTA_CLASS} ${className}`.trim()} {...props}>
                <Link to={to} aria-label={text} onClick={onClick}>
                    {text && <span className="font-medium">{text}</span>}
                    {Icon && <Icon className={iconClassName} style={iconStyle} />}
                </Link>
            </Button>
        )
    }

    if (href) {
        return (
            <Button asChild variant="neutral" size="default" className={`${HERO_CTA_CLASS} ${className}`.trim()} {...props}>
                <a href={href} aria-label={text} onClick={onClick} target={target} rel={rel}>
                    {text && <span className="font-medium">{text}</span>}
                    {Icon && <Icon className={iconClassName} style={iconStyle} />}
                </a>
            </Button>
        )
    }

    return (
 <Button
 variant="neutral"
 size="default"
 type={type}
 disabled={disabled}
 onClick={onClick}
 className={`${HERO_CTA_CLASS} ${className}`.trim()}
 {...props}
 >
            <Icon className={iconClassName} style={iconStyle} />
            <span className="font-medium">{text}</span>
 </Button>
 )
}