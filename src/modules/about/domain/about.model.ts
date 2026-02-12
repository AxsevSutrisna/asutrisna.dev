/**
 * About Domain Model
 */

export interface AboutContent {
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

export class AboutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AboutError";
  }
}
