import PropTypes from "prop-types"
import { Button } from "./button"

const ShowMoreButton = ({ onClick, isShowingMore }) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="sm"
    className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-3 py-1.5 text-sm font-medium cursor-target"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
                    transition-transform 
                    duration-300 
                    ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
                `}
      >
        <polyline
          points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
        ></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </Button>
)

ShowMoreButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isShowingMore: PropTypes.bool,
}

export default ShowMoreButton
