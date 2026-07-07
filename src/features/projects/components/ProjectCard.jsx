import React from"react";
import PropTypes from"prop-types";
import { ExternalLink, ArrowRight } from "lucide-react";
import PublicCtaButton from "@/components/ui/public-cta-button";
import {
 Card,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from"@/components/ui/card"
import { toSlug} from"../../../utils/slug";

const CardProject = ({ img, title, description, link: ProjectLink, id}) => {
 const handleLiveDemo = (e) => {
 if (!ProjectLink) {
 e.preventDefault();
 alert("Visit Link link is not available");
}
};

 const handleDetails = (e) => {
 if (!id) {
 e.preventDefault();
 alert("Project details are not available");
}
};

 return (
 <Card className="group relative w-full overflow-hidden p-5 flex flex-col justify-between h-full">
 <div className="relative overflow-hidden rounded-lg mb-4 border-2 border-black/40">
 <img
 src={img}
 alt={title}
 className="w-full h-full object-cover aspect-[16/8] transform group-hover:scale-105 transition-transform duration-500"
 />
 </div>

 <CardHeader className="p-0 space-y-3 flex-1">
 <CardTitle>{title}</CardTitle>
 <CardDescription className="line-clamp-3">
 {description}
 </CardDescription>
 </CardHeader>

 <CardFooter className="p-0 pt-4 flex items-center justify-between mt-auto">
 {ProjectLink ? (
 <PublicCtaButton
 href={ProjectLink || "#"}
 text="Visit Link"
 icon={ExternalLink}
 target="_blank"
 rel="noopener noreferrer"
 onClick={handleLiveDemo}
 className="px-4 py-2 text-sm cursor-target"
 />
 ) : (
 <span className="text-gray-500 text-sm">
 Visit Link Not Available
 </span>
 )}

 {id ? (
 <PublicCtaButton
 to={`/project/${toSlug(title)}`}
 text="Details"
 icon={ArrowRight}
 onClick={handleDetails}
 className="px-4 py-2 text-sm cursor-target"
 />
 ) : (
 <span className="text-gray-500 text-sm">
 Details Not Available
 </span>
    )}
 </CardFooter>
 </Card>
 );
};

CardProject.propTypes = {
 img: PropTypes.string.isRequired,
 title: PropTypes.string.isRequired,
 description: PropTypes.string,
 link: PropTypes.string,
 id: PropTypes.number.isRequired,
};

export default CardProject;
