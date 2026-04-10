import { MessageCircle, PlayCircle, FileText, BarChart3, Twitter, Github } from "lucide-react";

const links = [
  { label: "Support", icon: MessageCircle, href: "#" },
  { label: "Tutorial", icon: PlayCircle, href: "#" },
  { label: "Docs", icon: FileText, href: "#" },
  { label: "Analytics", icon: BarChart3, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "Github", icon: Github, href: "#" },
];

const Footer = () => (
  <footer className="flex items-center justify-center gap-6 py-6 flex-wrap">
    {links.map(({ label, icon: Icon, href }) => (
      <a
        key={label}
        href={href}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </a>
    ))}
  </footer>
);

export default Footer;
