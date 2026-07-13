import PropTypes from "prop-types"
import { Button } from "./button"
import { Link } from "react-router-dom"

export default function PublicCtaButton({
  href,
  text,
  icon: Icon,
  iconClassName = "w-4 h-4 text-current",
  iconStyle = {},
  onClick,
  to,
  target,
  rel,
  type = "button",
  disabled,
  className = "",
  ...props
}) {
  if (to) {
    return (
      <Button
        asChild
        variant="neutral"
        size="default"
        className={className}
        {...props}
      >
        <Link to={to} aria-label={text} onClick={onClick}>
          {text && <span className="font-medium">{text}</span>}
          {Icon && <Icon className={iconClassName} style={iconStyle} />}
        </Link>
      </Button>
    )
  }

  if (href) {
    return (
      <Button
        asChild
        variant="neutral"
        size="default"
        className={className}
        {...props}
      >
        <a
          href={href}
          aria-label={text}
          onClick={onClick}
          target={target}
          rel={rel}
        >
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
      className={className}
      {...props}
    >
      <Icon className={iconClassName} style={iconStyle} />
      <span className="font-medium">{text}</span>
    </Button>
  )
}

PublicCtaButton.propTypes = {
  href: PropTypes.string,
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  iconClassName: PropTypes.string,
  iconStyle: PropTypes.object,
  onClick: PropTypes.func,
  to: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}
