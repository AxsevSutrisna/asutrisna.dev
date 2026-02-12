/**
 * About Mapper
 */

import { AboutContent } from "../domain/about.model";
import { AboutContentView } from "./about.view.model";

export const mapAboutToView = (content: AboutContent): AboutContentView => ({
  title: content.title,
  bio: content.bio,
  location: content.location,
  email: content.email,
  skills: content.skills,
  experience: content.experience,
  education: content.education,
});
