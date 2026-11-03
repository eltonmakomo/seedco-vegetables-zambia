import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowRight, ChevronDown, Menu, X, MapPin, Mail, Phone, Instagram, Facebook, Youtube, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import catalogue from '@/lib/seedco-content.json';
import brandLogo from '@/assets/seedco/seedco-logo.asset.json';
import brandLogoWhite from '@/assets/seedco/seedco-logo-white.svg.asset.json';

export const sitePath = (path: string) => path.replace(/^\/+|\/+$/g, '');
export function SiteLink({ path, children, className, onClick }: { path: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  const slug = sitePath(path);
  return slug ? <Link to="/$" params={{ _splat: slug }} className={className} onClick={onClick}>{children}</Link> : <Link to="/" className={className} onClick={onClick}>{children}</Link>;
}
export const navigation: { label: string; path: string; links: [string, string][] }[] = [
  { label: 'About Us', path: 'about-us/overview', links: [
    ['Overview', 'about-us/overview'], ['Our Story', 'about-us/our-story'], ['Management Team', 'about-us/management-team'],
    ['Sales Team', 'about-us/sales-team'], ['Agronomists', 'about-us/agronomists'], ['Corporate Social Responsibility', 'about-us/corporate-social-responsibility'], ['Careers', 'about-us/careers'],
  ] },
  { label: 'Products', path: 'products', links: catalogue.categories.map(c => [c.name, c.path]) },
  { label: 'Innovations', path: 'service-innovations', links: [
    ['Service Innovations', 'service-innovations'], ['Product Innovations', 'product-innovations'], ['Disease Tolerance', 'disease-tolerance'],
    ['Hybridization', 'hybridization'], ['Yield Thrust', 'yield-thrust'], ['Top Left Hybrids', 'top-left-hybrids'], ['Climate Fast Varieties', 'climate-fast-varieties'],
  ] },
  { label: 'Media', path: 'news', links: [
    ['News', 'news'], ['Events Calendar', 'media/events-calendar'], ['Blog', 'blog'], ['FAQs', 'media/faqs'], ['Photo Gallery', 'media/photo-gallery'], ['Video Gallery', 'media/video-gallery'], ['Audio', 'media/audio'],
  ] },
];
const countries = [
  ['Angola','https://www.seedcogroup.com/angola/'],['Botswana','https://www.seedcogroup.com/bw/'],['DRC','https://www.seedcogroup.com/drc/'],['Kenya','https://www.seedcogroup.com/ke/'],['Malawi','https://www.seedcogroup.com/mw/'],['Mozambique','https://seedcogroup.com/mz'],['Nigeria','https://seedcogroup.com/ng'],['South Africa','https://www.lgseeds.co.za/'],['Tanzania','https://seedcogroup.com/tz'],['Uganda','https://www.seedcogroup.com/ug'],['West & Central Africa','https://www.seedcogroup.com/weca/'],['Zimbabwe','https://seedcogroup.com/zw/'],
];

export function SiteFrame() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = useRouterState({ select: state => state.location.pathname });
  const close = () => { setMobileOpen(false); setOpenSection(null); };
  return <div className="site-shell" key={pathname}>
    <div className="utility-bar"><div className="site-container utility-inner">
      <div className="country-picker"><button type="button" aria-label="Choose country"><MapPin size={13} /> ZAMBIA <ChevronDown size={12}/></button><div className="country-list"><span>EXPLORE SEED CO IN AFRICA</span>{countries.map(([name,href])=><a href={href} key={name} target="_blank" rel="noreferrer">{name}<ArrowRight size={13}/></a>)}</div></div><span className="utility-slogan"><span className="utility-divider"/> THE HOME OF BUMPER HARVESTS</span>
      <div className="utility-right"><a href="http://139.84.241.235/scg/" target="_blank" rel="noreferrer">Seed Co Group ↗</a><span className="utility-divider"/><SiteLink path="contact-us">Get in touch <ArrowRight size={13}/></SiteLink></div>
    </div></div>
    <header className="site-header"><div className="site-container header-inner">
      <SiteLink path="" className="brand" onClick={close}><img src={brandLogo.url} alt="Seed Co" width="80" height="58"/><span className="brand-rule"/><span className="brand-wording"><strong>VEGETABLES</strong><small>ZAMBIA</small></span></SiteLink>
      <nav className="desktop-nav" aria-label="Main navigation"><SiteLink path="" className="nav-item">Home</SiteLink>{navigation.map(n => <div className="nav-group" key={n.label}><SiteLink path={n.path} className="nav-item">{n.label} <ChevronDown size={13}/></SiteLink><div className="nav-dropdown"><div className="dropdown-head">EXPLORE {n.label.toUpperCase()}</div>{n.links.map(([label,path]) => <SiteLink key={path} path={path} className="dropdown-link">{label}<ArrowRight size={14}/></SiteLink>)}</div></div>)}<SiteLink path="contact-us" className="nav-item">Contact Us</SiteLink></nav>
      <div className="header-actions"><Button asChild variant="brand" size="lg" className="header-contact"><a href="https://www.seedcoonlineshop.com/zm/" target="_blank" rel="noreferrer">Buy seed online <ArrowUpRight size={16}/></a></Button><Button variant="ghost" size="icon" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} className="mobile-menu-button" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</Button></div>
    </div></header>
    {mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><SiteLink path="" onClick={close}>Home</SiteLink>{navigation.map(n => <div key={n.label} className="mobile-nav-group"><div className="mobile-nav-row"><SiteLink path={n.path} onClick={close}>{n.label}</SiteLink><Button variant="ghost" size="icon" aria-label={`Show ${n.label} pages`} aria-expanded={openSection===n.label} onClick={() => setOpenSection(openSection===n.label?null:n.label)}><ChevronDown size={17}/></Button></div>{openSection===n.label && <div className="mobile-subnav">{n.links.map(([label,path]) => <SiteLink key={path} path={path} onClick={close}>{label}</SiteLink>)}</div>}</div>)}<SiteLink path="contact-us" onClick={close}>Contact Us</SiteLink><SiteLink path="learn-with-seedco" onClick={close}>Learn with Seed Co</SiteLink></nav>}
    <main><Outlet/></main>
    <footer className="site-footer"><div className="site-container"><div className="footer-top"><div className="footer-intro"><SiteLink path="" className="footer-brand"><img src={brandLogoWhite.url} alt="Seed Co" width="100" height="72"/><span>VEGETABLES<br/><small>ZAMBIA</small></span></SiteLink><p>Certified vegetable seed, specially bred for Africa and tested for Zambia’s agro-ecologies.</p><div className="social-row"><a aria-label="Facebook" href="https://www.facebook.com/seedcozambia" target="_blank" rel="noreferrer"><Facebook size={19}/></a><a aria-label="YouTube" href="https://www.youtube.com/channel/UCrlVuj5uYRjTRXJWSmkozjQ" target="_blank" rel="noreferrer"><Youtube size={19}/></a><a aria-label="Instagram" href="https://www.instagram.com/seedcozambia/" target="_blank" rel="noreferrer"><Instagram size={19}/></a><a aria-label="X" href="https://x.com/SeedCoZambia" target="_blank" rel="noreferrer">𝕏</a></div></div><div className="footer-column"><h3>Explore</h3><SiteLink path="products">Vegetable seeds</SiteLink><SiteLink path="about-us/overview">About Seed Co</SiteLink><SiteLink path="service-innovations">Innovations</SiteLink><SiteLink path="news">Latest news</SiteLink><SiteLink path="blog">The blog</SiteLink><SiteLink path="learn-with-seedco">Learn with Seed Co</SiteLink></div><div className="footer-column"><h3>Here to help</h3><SiteLink path="media/faqs">FAQs</SiteLink><SiteLink path="about-us/agronomists">Find an agronomist</SiteLink><SiteLink path="media/events-calendar">Events calendar</SiteLink><SiteLink path="promotions">Seedney Agronomy App</SiteLink><SiteLink path="privacy-policy">Privacy policy</SiteLink><SiteLink path="notice-to-suppliers-and-contractors">Notice to suppliers</SiteLink><a href="https://www.seedcoonlineshop.com/zm/" target="_blank" rel="noreferrer">Buy seed online ↗</a></div><div className="footer-column footer-contact"><h3>Get in touch</h3><span><MapPin size={17}/> SeedCo Business Complex, Farm no 683 B, Mumbwa Road, Lusaka</span><a href="tel:+260211426400"><Phone size={17}/> +260 211 426 400</a><a href="mailto:Zambia.sales@seedcogroup.com"><Mail size={17}/> Zambia.sales@seedcogroup.com</a><SiteLink path="contact-us" className="footer-contact-link">Contact us <ArrowRight size={15}/></SiteLink></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Seed Co Zambia. The home of bumper harvests.</span><div><SiteLink path="privacy-policy">Privacy</SiteLink><a href="http://139.84.241.235/scg/" target="_blank" rel="noreferrer">Seed Co Group ↗</a></div></div></div></footer>
  </div>;
}
