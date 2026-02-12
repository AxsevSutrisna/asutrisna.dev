/**
 * About Output Port (Secondary Port)
 */

import { AboutContent } from "./about.model";

export interface IAboutOutput {
  getAboutContent(): Promise<AboutContent>;
}
