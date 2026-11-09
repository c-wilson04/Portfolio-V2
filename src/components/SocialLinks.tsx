import type { ComponentType, SVGProps } from "react";
import { profile, type SocialIcon } from "../data/profile";
import { GitHubIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "./Icons";

const ICONS: Record<SocialIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
};

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`socials ${className}`.trim()}>
      {profile.socials.map((social) => {
        const Icon = ICONS[social.icon];
        return (
          <li key={social.label}>
            <a href={social.href} target="_blank" rel="noreferrer">
              <Icon />
              {social.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
