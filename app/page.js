'use client';

import { useState } from 'react';
import {
  LayoutDashboard, Search, Users, Target, Mail, Linkedin, CalendarCheck,
  MessageSquareText, BriefcaseBusiness, ChartNoAxesCombined, Settings,
  Bell, ChevronDown, Plus, ArrowUpRight, ArrowDownRight, Sparkles,
  Filter, Download, MoreHorizontal, Clock3, CheckCircle2, CircleDot,
  Menu, X, Send, Building2, MapPin, SlidersHorizontal, Zap
} from 'lucide-react';

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Lead Discovery', icon: Search },
  { label: 'Lead Database', icon: Users },
  { label: 'Campaigns', icon: Target },
  { label: 'Email Outreach', icon: Mail },
  { label: 'LinkedIn Assistant', icon: Linkedin },
  { label: 'Follow-ups', icon: CalendarCheck },
  { label: 'Conversations', icon: MessageSquareText },
  { label: 'Opportunities', icon: BriefcaseBusiness },
  { label: 'Analytics', icon: ChartNoAxesCombined },
];

const leads = [
  { company:'Asterion Components', person:'Meera Shah', role:'Head of Procurement', industry:'Manufacturing', location:'Pune, India', score:94, status:'Qualified', source:'AI discovery' },
  { company:'Northstar Living', person:'Arjun Mehta', role:'Founder', industry:'Real Estate', location:'Mumbai, India', score:88, status:'Researching', source:'AI discovery' },
  { company:'BrightPath Digital', person:'Nisha Rao', role:'Managing Director', industry:'Agency', location:'Bengaluru, India', score:82, status:'Contacted', source:'Website' },
  { company:'Summit Trade House', person:'Karan Shah', role:'Sales Director', industry:'Distribution', location:'Ahmedabad, India', score:76, status:'New lead', source:'CSV import' },
  { company:'Evergreen Workspaces', person:'Ritu Jain', role:'Operations Head', industry:'Professional Services', location:'Delhi, India', score:71, status:'Qualified', source:'AI discovery' },
];

const campaigns = [
  { name:'India manufacturing — Q4', channel:'Email', audience:420, sent:286, replies:31, positive:12, status:'Active' },
  { name:'SME founder introduction', channel:'Email + LinkedIn', audience:180, sent:104, replies:18, positive:9, status:'Draft' },
  { name:'Distributor partner outreach', channel:'LinkedIn assistant', audience:95, sent:0, replies:0, positive:0, status:'Needs review' },
];

function Metric({label,value,change,up=true,icon:Icon}) {
  return <div className="metric card"><div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={17}/></span></div><div className="metric-value">{value}</div><div className={up?'trend up':'trend down'}>{up?<ArrowUpRight size={14}/>:<ArrowDownRight size={14}/>} {change} <span>vs. last 30 days</span></div></div>;
}

function Tag({children, tone='slate'}) { return <span className={`tag ${tone}`}>{children}</span>; }

export default function Home() {
  const [active,setActive] = useState('Overview');
  const [mobileOpen,setMobileOpen] = useState(false);
  const [query,setQuery] = useState('');
  const [showCreate,setShowCreate] = useState(false);
  const [campaignName,setCampaignName] = useState('');
  const [notice,setNotice] = useState('');

  const filtered = leads.filter(l => `${l.company} ${l.person} ${l.industry}`.toLowerCase().includes(query.toLowerCase()));

  function createCampaign(e) {
    e.preventDefault();
    if (!campaignName.trim()) return;
    setNotice(`Campaign “${campaignName}” saved as a local prototype draft.`);
    setCampaignName('');
    setShowCreate(false);
  }

  const Sidebar = () => <aside className={`sidebar ${mobileOpen?'open':''}`}>
    <div className="brand"><div className="brand-mark">V</div><div><b>VRIDHI</b><small>GROWTH ENGINE</small></div><button className="mobile-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
    <div className="workspace"><div className="workspace-avatar">A</div><div><b>Acme Workspace</b><small>Growth team</small></div><ChevronDown size={15}/></div>
    <div className="nav-label">WORKSPACE</div>
    <nav>{nav.map(item=>{const Icon=item.icon;return <button key={item.label} className={`nav-item ${active===item.label?'selected':''}`} onClick={()=>{setActive(item.label);setMobileOpen(false);}}><Icon size={17}/><span>{item.label}</span>{item.label==='Follow-ups'&&<i>4</i>}</button>})}</nav>
    <div className="sidebar-bottom"><button className="nav-item"><Settings size={17}/><span>Settings</span></button><div className="profile"><div className="profile-avatar">RG</div><div><b>Ravi Gurnani</b><small>Workspace admin</small></div><MoreHorizontal size={17}/></div></div>
  </aside>;

  return <div className="app">
    <Sidebar/>
    {mobileOpen&&<div className="scrim" onClick={()=>setMobileOpen(false)}/>}
    <main className="main">
      <header className="topbar"><button className="hamburger" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><span className="prototype-label"><span/> Prototype mode</span><button className="icon-button"><Bell size={18}/><i/></button><div className="top-avatar">RG</div></div></header>
      <div className="content">
        {notice&&<div className="notice"><CheckCircle2 size={16}/>{notice}<button onClick={()=>setNotice('')}>Dismiss</button></div>}
        {active==='Overview'&&<Overview setActive={setActive}/>}
        {active==='Lead Discovery'&&<Discovery setNotice={setNotice}/>}
        {active==='Lead Database'&&<LeadDatabase query={query} setQuery={setQuery} filtered={filtered}/>}
        {active==='Campaigns'&&<Campaigns setShowCreate={setShowCreate}/>}
        {active==='Email Outreach'&&<Outreach type="email"/>}
        {active==='LinkedIn Assistant'&&<Outreach type="linkedin"/>}
        {active==='Follow-ups'&&<Tasks/>}
        {active==='Conversations'&&<Conversations/>}
        {active==='Opportunities'&&<Pipeline/>}
        {active==='Analytics'&&<Analytics/>}
        {showCreate&&<div className="modal-backdrop"><form className="modal card" onSubmit={createCampaign}><div className="modal-head"><div><h2>Create campaign</h2><p>Start with a name. Audience and sending settings can be configured later.</p></div><button type="button" className="icon-button" onClick={()=>setShowCreate(false)}><X size={18}/></button></div><label>Campaign name</label><input autoFocus value={campaignName} onChange={e=>setCampaignName(e.target.value)} placeholder="e.g. West India distributor outreach"/><div className="modal-actions"><button type="button" className="btn secondary" onClick={()=>setShowCreate(false)}>Cancel</button><button className="btn primary" type="submit">Save draft</button></div></form></div>}
      </div>
    </main>
  </div>;
}

function PageTitle({eyebrow,title,description,action,actionText='Create campaign',onAction}) {
  return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action&&<button className="btn primary" onClick={onAction}><Plus size={16}/>{actionText}</button>}</div>;
}

function Overview({setActive}) {
  return <>
    <PageTitle eyebrow="MONDAY, 31 OCTOBER 2026" title="Good morning, Ravi" description="Here is what is happening across your growth engine today." action actionText="New campaign" onAction={()=>setActive('Campaigns')}/>
    <div className="metric-grid"><Metric label="Leads discovered" value="2,486" change="+18.6%" icon={Users}/><Metric label="Qualified prospects" value="684" change="+12.4%" icon={Target}/><Metric label="Positive replies" value="126" change="+8.2%" icon={MessageSquareText}/><Metric label="Meetings booked" value="38" change="+14.1%" icon={CalendarCheck}/></div>
    <div className="two-col">
      <section className="card panel"><div className="panel-head"><div><h2>Growth funnel</h2><p>Prospect movement across the last 30 days</p></div><button className="text-button">Last 30 days <ChevronDown size={14}/></button></div><div className="funnel">{[['Discovered','2,486','100%','f1'],['Researched','1,840','74%','f2'],['Qualified','684','28%','f3'],['Contacted','512','21%','f4'],['Positive replies','126','5.1%','f5']].map(x=><div className="funnel-row" key={x[0]}><div className="funnel-label">{x[0]}<b>{x[1]}</b></div><div className="funnel-track"><div className={`funnel-fill ${x[3]}`} style={{width:x[2]}}/></div><small>{x[2]}</small></div>)}</div></section>
      <section className="card panel"><div className="panel-head"><div><h2>Today's priorities</h2><p>Recommended actions from Vridhi AI</p></div><Sparkles size={18} className="purple"/></div><div className="priority-list"><div className="priority"><span className="priority-dot amber"/><div><b>Review 18 newly discovered leads</b><small>Manufacturing · High fit score</small></div><ArrowUpRight size={16}/></div><div className="priority"><span className="priority-dot green"/><div><b>Respond to 6 interested prospects</b><small>Email replies awaiting review</small></div><ArrowUpRight size={16}/></div><div className="priority"><span className="priority-dot blue"/><div><b>Complete 4 follow-up tasks</b><small>2 overdue · 2 due today</small></div><ArrowUpRight size={16}/></div></div><button className="btn secondary full" onClick={()=>setActive('Follow-ups')}>View all tasks</button></section>
    </div>
    <section className="card panel"><div className="panel-head"><div><h2>Recent prospects</h2><p>Latest companies added to your lead database</p></div><button className="text-button" onClick={()=>setActive('Lead Database')}>View all <ArrowUpRight size={14}/></button></div><LeadTable rows={leads.slice(0,4)}/></section>
  </>;
}

function Discovery({setNotice}) {
  const [industry,setIndustry]=useState('Manufacturing');
  const [geo,setGeo]=useState('India');
  const [size,setSize]=useState('50–500 employees');
  return <><PageTitle eyebrow="AI PROSPECTING" title="Lead discovery" description="Describe your ideal customer profile and prepare a targeted prospect search."/><section className="card discovery-card"><div className="ai-heading"><div className="ai-icon"><Sparkles size={20}/></div><div><h2>Build an ideal customer profile</h2><p>Set targeting criteria. Real discovery requires a connected data provider.</p></div><Tag tone="purple">AI workspace</Tag></div><div className="form-grid"><div><label>Industry</label><select value={industry} onChange={e=>setIndustry(e.target.value)}><option>Manufacturing</option><option>Real Estate</option><option>Professional Services</option><option>Distribution</option><option>Marketing Agency</option><option>Information Technology</option></select></div><div><label>Target geography</label><select value={geo} onChange={e=>setGeo(e.target.value)}><option>India</option><option>United Arab Emirates</option><option>Singapore</option><option>United States</option><option>United Kingdom</option></select></div><div><label>Company size</label><select value={size} onChange={e=>setSize(e.target.value)}><option>1–20 employees</option><option>20–50 employees</option><option>50–500 employees</option><option>500+ employees</option></select></div><div><label>Buying signal</label><select><option>Any relevant signal</option><option>Hiring / expansion</option><option>New location</option><option>Recent funding</option><option>New leadership</option></select></div></div><div className="discovery-summary"><b><Sparkles size={15}/> Search brief</b><p>Find <strong>{industry.toLowerCase()}</strong> businesses in <strong>{geo}</strong> with <strong>{size}</strong>, prioritising companies showing relevant buying signals.</p></div><button className="btn primary" onClick={()=>setNotice('Search brief saved. Connect a permitted business data provider to run live lead discovery.')}><Search size={16}/> Prepare AI search</button></section><div className="info-grid"><div className="card info-card"><Building2/><h3>Company discovery</h3><p>Find businesses by industry, geography, size and business profile.</p></div><div className="card info-card"><Target/><h3>Buying signals</h3><p>Prioritise prospects using evidence such as hiring and expansion.</p></div><div className="card info-card"><ShieldIcon/><h3>Source transparency</h3><p>Store source, last-checked date and confidence with each record.</p></div></div></>;
}
function ShieldIcon(){return <CheckCircle2/>}

function LeadDatabase({query,setQuery,filtered}) {
  return <><PageTitle eyebrow="PROSPECT MANAGEMENT" title="Lead database" description="Review, qualify and manage prospects from every acquisition source." action actionText="Import leads" onAction={()=>alert('CSV import is planned for the next development milestone.')}/><section className="card panel"><div className="toolbar"><div className="searchbox"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search company, contact or industry..."/></div><button className="btn secondary"><Filter size={15}/> Filters</button><button className="btn secondary"><Download size={15}/> Export</button></div><LeadTable rows={filtered}/></section></>;
}

function LeadTable({rows}) {
  return <div className="table-wrap"><table><thead><tr><th>COMPANY / CONTACT</th><th>INDUSTRY</th><th>LOCATION</th><th>AI SCORE</th><th>STATUS</th><th>SOURCE</th><th></th></tr></thead><tbody>{rows.map((l,i)=><tr key={l.company}><td><div className="company-cell"><div className="company-logo">{l.company[0]}</div><div><b>{l.company}</b><small>{l.person} · {l.role}</small></div></div></td><td>{l.industry}</td><td>{l.location}</td><td><span className={`score ${l.score>=85?'high':'mid'}`}>{l.score}</span></td><td><Tag tone={l.status==='Qualified'?'green':l.status==='Contacted'?'blue':'slate'}>{l.status}</Tag></td><td>{l.source}</td><td><button className="icon-button"><MoreHorizontal size={17}/></button></td></tr>)}</tbody></table>{rows.length===0&&<div className="empty">No matching leads found.</div>}</div>;
}

function Campaigns({setShowCreate}) {
  return <><PageTitle eyebrow="CAMPAIGN MANAGEMENT" title="Campaigns" description="Plan targeted campaigns and coordinate email and human-led LinkedIn outreach." action onAction={()=>setShowCreate(true)}/><div className="metric-grid three"><Metric label="Active campaigns" value="4" change="+1 this month" icon={Target}/><Metric label="Prospects enrolled" value="1,240" change="+16.8%" icon={Users}/><Metric label="Positive reply rate" value="8.4%" change="+1.2%" icon={MessageSquareText}/></div><section className="card panel"><div className="panel-head"><div><h2>All campaigns</h2><p>Sample campaign data for interface preview</p></div><button className="btn secondary"><Filter size={15}/> Filter</button></div><div className="campaign-list">{campaigns.map(c=><div className="campaign-row" key={c.name}><div className="campaign-icon"><Target size={18}/></div><div className="campaign-name"><b>{c.name}</b><small>{c.channel} · {c.audience} prospects</small></div><div className="campaign-stat"><b>{c.sent}</b><small>Sent / activity</small></div><div className="campaign-stat"><b>{c.replies}</b><small>Replies</small></div><div className="campaign-stat"><b>{c.positive}</b><small>Positive</small></div><Tag tone={c.status==='Active'?'green':c.status==='Draft'?'slate':'amber'}>{c.status}</Tag><button className="icon-button"><MoreHorizontal size={17}/></button></div>)}</div></section></>;
}

function Outreach({type}) {
  const linkedin=type==='linkedin';
  return <><PageTitle eyebrow={linkedin?'PROFESSIONAL NETWORK':'EMAIL ENGAGEMENT'} title={linkedin?'LinkedIn assistant':'Email outreach'} description={linkedin?'Prepare relevant, personalised LinkedIn messages for human review and sending.':'Create personalised email sequences and manage connected sending accounts.'}/><div className="notice"><CheckCircle2 size={16}/>{linkedin?'Human-operated workflow: no scraping or unauthorised automated messaging.':'Sending is disabled in this prototype. Connect and verify a sending provider in a secured backend before launch.'}</div><div className="two-col"><section className="card panel"><div className="panel-head"><div><h2>{linkedin?'Message composer':'Email sequence builder'}</h2><p>Personalise content using prospect context</p></div><Sparkles className="purple" size={18}/></div><label>Choose prospect</label><select><option>Asterion Components — Meera Shah</option><option>Northstar Living — Arjun Mehta</option><option>BrightPath Digital — Nisha Rao</option></select>{!linkedin&&<><label>Subject line</label><input defaultValue="A thought for Asterion Components"/></>}<label>{linkedin?'Connection note / message':'Message body'}</label><textarea rows="8" defaultValue={linkedin?'Hello Meera, I came across Asterion Components and wanted to connect. I would be interested in learning more about your procurement priorities and sharing relevant industry insights.':'Hello Meera,\n\nI came across Asterion Components while researching manufacturing businesses in Pune. I wanted to introduce our team and understand whether there may be an opportunity to support your current priorities.\n\nWould a brief conversation next week be useful?\n\nRegards,\n[Your name]'}/><div className="composer-actions"><button className="btn secondary"><Sparkles size={15}/> Improve with AI</button><button className="btn primary"><Send size={15}/>{linkedin?'Save message draft':'Save email draft'}</button></div></section><section className="card panel"><h2>Prospect context</h2><p className="muted">Sample research summary</p><div className="context-company"><div className="company-logo large">A</div><div><b>Asterion Components</b><small>Manufacturing · Pune, India</small></div></div><div className="context-row"><span>Contact</span><b>Meera Shah</b></div><div className="context-row"><span>Role</span><b>Head of Procurement</b></div><div className="context-row"><span>Lead score</span><b className="score high">94 / 100</b></div><div className="context-row"><span>Research confidence</span><b>Sample data</b></div><div className="ai-insight"><Sparkles size={15}/><p>Reference a specific, verified business need. Avoid generic claims or pretending to have a prior relationship.</p></div></section></div></>;
}

function Tasks() {
  const [done,setDone]=useState([]);
  const tasks=[['Review 18 new manufacturing prospects','Lead research','Today','High'],['Respond to pricing request from Northstar Living','Email reply','Today','High'],['Prepare LinkedIn note for Summit Trade House','LinkedIn','Today','Medium'],['Review campaign performance','Campaign review','Tomorrow','Medium'],['Verify contact details for Evergreen Workspaces','Data quality','Overdue','High']];
  return <><PageTitle eyebrow="WORK QUEUE" title="Follow-ups" description="A prioritised view of tasks and next actions across your prospecting activity."/><section className="card panel"><div className="panel-head"><div><h2>My task list</h2><p>{done.length} of {tasks.length} completed</p></div><button className="btn secondary"><SlidersHorizontal size={15}/> Filter</button></div><div className="task-list">{tasks.map((t,i)=><div className={`task-row ${done.includes(i)?'completed':''}`} key={t[0]}><button className="check-task" onClick={()=>setDone(d=>d.includes(i)?d.filter(x=>x!==i):[...d,i])}>{done.includes(i)?<CheckCircle2/>:<CircleDot/>}</button><div className="task-title"><b>{t[0]}</b><small>{t[1]}</small></div><span className="task-date"><Clock3 size={14}/>{t[2]}</span><Tag tone={t[3]==='High'?'amber':'slate'}>{t[3]}</Tag></div>)}</div></section></>;
}

function Conversations() {
  return <><PageTitle eyebrow="INBOX INTELLIGENCE" title="Conversations" description="Review replies, understand intent and decide the next best action."/><div className="inbox-layout card"><div className="inbox-list"><div className="inbox-search"><Search size={15}/> Search conversations</div>{[['Northstar Living','Could you share the pricing details?','Interested','2m'],['Asterion Components','Please contact our sourcing team.','Referral','1h'],['BrightPath Digital','Not looking at this currently.','Not interested','3h']].map((x,i)=><div className={`inbox-item ${i===0?'active':''}`} key={x[0]}><b>{x[0]}</b><p>{x[1]}</p><div><Tag tone={i===0?'green':i===1?'blue':'slate'}>{x[2]}</Tag><small>{x[3]}</small></div></div>)}</div><div className="inbox-detail"><div className="panel-head"><div><h2>Northstar Living</h2><p>Arjun Mehta · Email conversation</p></div><Tag tone="green">Interested</Tag></div><div className="message-bubble"><small>Incoming reply · 10:42 AM</small><p>Thanks for reaching out. Could you share the pricing details and a short overview of your services?</p></div><div className="ai-insight"><Sparkles size={15}/><p><b>AI suggestion:</b> Share the relevant service overview and ask one qualifying question before preparing a proposal.</p></div><textarea rows="4" placeholder="Write a reply for human review..."/><div className="composer-actions"><button className="btn secondary">Draft with AI</button><button className="btn primary"><Send size={15}/> Save reply draft</button></div></div></div></>;
}

function Pipeline() {
  const stages=[['Qualified',[['Asterion Components','₹4.5L','Meera Shah'],['Summit Trade House','₹2.8L','Karan Shah']]],['Meeting',[['Northstar Living','₹6.0L','Arjun Mehta']]],['Proposal',[['BrightPath Digital','₹3.2L','Nisha Rao']]],['Negotiation',[['Evergreen Workspaces','₹5.5L','Ritu Jain']]]];
  return <><PageTitle eyebrow="REVENUE PIPELINE" title="Opportunities" description="Track qualified prospects through meetings, proposals and commercial decisions." action actionText="New opportunity" onAction={()=>alert('Opportunity creation form is planned for the next milestone.')}/><div className="pipeline">{stages.map(([stage,cards])=><div className="pipeline-col" key={stage}><div className="pipeline-head"><b>{stage}</b><Tag>{cards.length}</Tag></div>{cards.map(c=><div className="deal-card card" key={c[0]}><b>{c[0]}</b><small>{c[2]}</small><strong>{c[1]}</strong><div className="deal-foot"><span>Open opportunity</span><MoreHorizontal size={15}/></div></div>)}</div>)}</div></>;
}

function Analytics() {
  const bars=[42,58,48,72,63,84,68,93,77,88,71,100];
  return <><PageTitle eyebrow="PERFORMANCE" title="Growth analytics" description="Measure prospect quality, engagement and conversion through the funnel."/><div className="metric-grid"><Metric label="Qualified lead rate" value="27.5%" change="+3.4%" icon={Target}/><Metric label="Email reply rate" value="9.8%" change="+1.6%" icon={Mail}/><Metric label="Meeting conversion" value="30.2%" change="+4.1%" icon={CalendarCheck}/><Metric label="Pipeline value" value="₹22.0L" change="+11.2%" icon={BriefcaseBusiness}/></div><section className="card panel"><div className="panel-head"><div><h2>Prospect activity trend</h2><p>Illustrative monthly activity index — sample data</p></div><Tag>Last 12 months</Tag></div><div className="bar-chart">{bars.map((b,i)=><div className="bar-col" key={i}><div className="bar" style={{height:`${b}%`}}/><small>{['N','D','J','F','M','A','M','J','J','A','S','O'][i]}</small></div>)}</div></section></>;
}
