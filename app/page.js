'use client';

import { useState } from 'react';
import {
  ArrowUpRight, Menu, X, Droplets, Trees, Recycle, Sun,
  BookOpen, Handshake, MapPin, Leaf, Mail, Instagram,
  ChevronDown, ExternalLink, Sprout, Globe2, Waves
} from 'lucide-react';

const programmes = [
  { icon: Droplets, title: 'Water & lakes', text: 'Supporting healthier lakes, rivers and groundwater through research, awareness and local partnerships.', label: 'VRIDHI JAL' },
  { icon: Trees, title: 'Nature & biodiversity', text: 'Working with ecological experts and communities to protect native habitats and biodiversity.', label: 'VRIDHI GREEN' },
  { icon: Recycle, title: 'Waste & pollution', text: 'Encouraging responsible waste systems, segregation and practical solutions to local pollution.', label: 'VRIDHI CLEAN' },
  { icon: Sun, title: 'Climate & energy', text: 'Making climate resilience, clean energy and sustainable living easier to understand and adopt.', label: 'VRIDHI ENERGY' },
  { icon: BookOpen, title: 'Education & community', text: 'Helping schools, young people and residents turn environmental knowledge into everyday action.', label: 'VRIDHI EARTH' },
  { icon: Handshake, title: 'Sustainable business', text: 'Connecting businesses with credible expertise and measurable environmental improvements.', label: 'VRIDHI IMPACT' },
];

const principles = [
  ['Evidence before claims', 'We verify information, cite sources and distinguish facts from allegations.'],
  ['Partnership before duplication', 'We learn from organisations and experts already working on the ground.'],
  ['Impact over visibility', 'We value measurable, lasting outcomes over one-day publicity campaigns.'],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Vridhi home">
          <span className="brand-symbol"><Sprout size={23} strokeWidth={1.8}/></span>
          <span className="brand-name">VRIDHI<span>PEOPLE. PLANET. PROGRESS.</span></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X/> : <Menu/>}
        </button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#work" onClick={closeMenu}>Our work</a>
          <a href="#approach" onClick={closeMenu}>Our approach</a>
          <a href="#udaipur" onClick={closeMenu}>Udaipur</a>
          <a className="nav-cta" href="#connect" onClick={closeMenu}>Get involved <ArrowUpRight size={15}/></a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-image" role="img" aria-label="Aravalli hills and lake landscape near Udaipur"/>
        <div className="hero-shade"/>
        <div className="hero-content">
          <div className="eyebrow light"><span/> AN ENVIRONMENTAL INITIATIVE</div>
          <h1>A better future<br/><em>grows together.</em></h1>
          <p>We bring people, knowledge and action together to protect nature and build more sustainable communities — starting in Udaipur.</p>
          <div className="hero-actions">
            <a className="button button-light" href="#work">Explore our mission <ArrowUpRight size={17}/></a>
            <a className="text-link light-link" href="#about">Discover Vridhi <span>↓</span></a>
          </div>
        </div>
        <div className="hero-note"><MapPin size={14}/> ROOTED IN UDAIPUR, RAJASTHAN</div>
      </section>

      <section className="intro section-wrap" id="about">
        <div className="section-kicker">WHY VRIDHI EXISTS <span>01 / 04</span></div>
        <div className="intro-grid">
          <h2>Environmental change needs more than <em>good intentions.</em></h2>
          <div className="intro-copy">
            <p className="lead">It needs informed communities, trusted partnerships and action that can be measured.</p>
            <p>Vridhi is an independent environmental initiative being built to understand local challenges, connect people who can help, and support practical solutions for nature and communities.</p>
            <a className="under-link" href="#approach">The principles we work by <ArrowUpRight size={16}/></a>
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-wrap">
          <div className="section-kicker">OUR AREAS OF FOCUS <span>02 / 04</span></div>
          <div className="section-heading">
            <div><h2>One planet.<br/><em>Connected challenges.</em></h2></div>
            <p>Environmental issues do not exist in isolation. Our programmes connect the health of ecosystems with the choices, systems and communities around them.</p>
          </div>
          <div className="programme-grid">
            {programmes.map((item) => {
              const Icon = item.icon;
              return <article className="programme-card" key={item.label}>
                <div className="programme-top"><span className="programme-icon"><Icon size={22} strokeWidth={1.6}/></span><span className="programme-label">{item.label}</span></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="programme-arrow"><ArrowUpRight size={17}/></span>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section className="watch-section" id="udaipur">
        <div className="watch-photo"/>
        <div className="watch-copy">
          <div className="section-kicker light">OUR FIRST STEP <span>03 / 04</span></div>
          <div className="watch-icon"><Waves size={23}/></div>
          <h2>Understand the place.<br/><em>Then act.</em></h2>
          <p>Our work begins in Udaipur and its surrounding district. We are developing an environmental intelligence initiative to document local issues, follow public developments and identify where collaboration can make a difference.</p>
          <div className="watch-points">
            <div><span>01</span> Track credible local reporting and public updates</div>
            <div><span>02</span> Listen to residents, researchers and practitioners</div>
            <div><span>03</span> Identify practical opportunities for collective action</div>
          </div>
          <a className="button button-outline" href="#connect">Be part of the first steps <ArrowUpRight size={16}/></a>
        </div>
      </section>

      <section className="approach section-wrap" id="approach">
        <div className="section-kicker">HOW WE WILL WORK <span>04 / 04</span></div>
        <div className="approach-heading"><h2>Trust is built<br/>through <em>how we act.</em></h2><p>We are building Vridhi carefully: with humility, transparency and respect for the people and expertise already contributing to environmental protection.</p></div>
        <div className="principles">
          {principles.map(([title, text], i) => <div className="principle" key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}
        </div>
      </section>

      <section className="connect-section" id="connect">
        <div className="connect-inner">
          <div className="connect-mark"><Leaf size={25}/></div>
          <div className="section-kicker light">THE JOURNEY STARTS HERE</div>
          <h2>There is room<br/>for <em>everyone</em> in this work.</h2>
          <p>Are you an environmental researcher, community organiser, educator, responsible business or someone who cares about the future of Udaipur? We would like to hear from you.</p>
          <div className="connect-actions">
            <a className="button button-light" href="#about">Discover our mission <ArrowUpRight size={16}/></a>
          </div>
          <small>We are at the beginning. Official contact and social channels will be added once they are ready.</small>
        </div>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-symbol"><Sprout size={21}/></span><span className="brand-name">VRIDHI<span>PEOPLE. PLANET. PROGRESS.</span></span></a>
        <p>Rooted in Udaipur. Working for a more sustainable future.</p>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Vridhi. All rights reserved.</span><a href="#home">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
