/**
 * About Local Storage Adapter (Secondary Adapter)
 */

import { IAboutOutput } from "../domain/about.output";
import { AboutContent } from "../domain/about.model";

const mockAboutContent: AboutContent = {
  title: "About Me",
  bio: "Full-stack developer passionate about creating beautiful and functional web applications. With over 5 years of experience, I specialize in modern web technologies and clean architecture principles.",
  location: "Indonesia",
  email: "contact@asutrisna.dev",
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "Docker",
    "AWS",
  ],
  experience: "5+ years",
  education: [
    {
      school: "State University",
      degree: "Bachelor of Computer Science",
      year: "2018",
    },
  ],
};

export class AboutLocalStorageAdapter implements IAboutOutput {
  async getAboutContent(): Promise<AboutContent> {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("about_content");
        if (stored) {
          return JSON.parse(stored);
        }
      }

      return mockAboutContent;
    } catch {
      return mockAboutContent;
    }
  }

  setAboutContent(content: AboutContent): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("about_content", JSON.stringify(content));
    }
  }
}

export const aboutAdapter = new AboutLocalStorageAdapter();
