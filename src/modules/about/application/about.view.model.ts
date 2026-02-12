/**
 * About Application Model
 */

export interface AboutContentView {
  title: string;
  bio: string;
  location: string;
  email: string;
  skills: string[];
  experience: string;
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
}
