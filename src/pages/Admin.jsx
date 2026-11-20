import { useState } from 'react'
import { FolderKanban, ImagePlus, LayoutDashboard, LogOut, Mail, Plus, Settings, Wallet } from 'lucide-react'

const nav = [{label:'Overview',icon:LayoutDashboard},{label:'Projects',icon:FolderKanban},{label:'Enquiries',icon:Mail},{label:'Payments',icon:Wallet},{label:'Settings',icon:Settings}]

export default function Admin() {
  const [tab, setTab] = useState('Overview')
  const [showNotice, setShowNotice] = useState(true)
  return <section className="admin-shell">
    <aside className="admin-sidebar"><a className="brand" href="/"><span className="brand-mark">A</span><span>Studio admin<i>.</i></span></a><span className="eyebrow admin-label">WORKSPACE</span>{nav.map(item => <button key={item.label} className={`admin-nav-item ${tab===item.label?'active':''}`} onClick={()=>setTab(item.label)}><item.icon size={17}/>{item.label}</button>)}<a className="admin-nav-item admin-exit" href="/"><LogOut size={17}/>Back to website</a></aside>
    <div className="admin-main"><div className="admin-topbar"><span className="eyebrow">YOUR WORKSPACE / {tab.toUpperCase()}</span><span className="admin-avatar">AM</span></div>
      <div className="admin-content"><div className="admin-heading-row"><div><span className="eyebrow">GOOD TO SEE YOU</span><h1>{tab}</h1><p className="body-copy">Manage your portfolio from one place.</p></div>{tab==='Projects' && <button className="button button-primary" onClick={()=>alert('Connect Supabase before adding projects.')}><Plus size={16}/> Add project</button>}</div>
      {showNotice && <div className="admin-notice"><div><strong>Setup required before publishing</strong><p>This is a dashboard UI scaffold. Connect Supabase Auth, database tables and Row Level Security before using it with real data.</p></div><button onClick={()=>setShowNotice(false)}>×</button></div>}
      {tab==='Overview' && <div className="admin-stat-grid">{[['Projects','—',FolderKanban],['New enquiries','—',Mail],['Payments received','—',Wallet]].map(([label,value,Icon])=><div className="admin-stat" key={label}><Icon/><span>{label}</span><strong>{value}</strong></div>)}</div>}
      {tab==='Projects' && <div className="admin-empty"><ImagePlus size={30}/><h2>Your project library</h2><p>Once Supabase is connected, you'll be able to upload covers, edit case studies and publish projects here.</p></div>}
      {tab==='Enquiries' && <div className="admin-empty"><Mail size={30}/><h2>Client enquiries</h2><p>New project requests will appear here after the enquiry form is connected to your backend.</p></div>}
      {tab==='Payments' && <div className="admin-empty"><Wallet size={30}/><h2>Payment activity</h2><p>Verified Razorpay payments will appear here after secure server-side order creation and webhook verification are implemented.</p></div>}
      {tab==='Settings' && <div className="admin-empty"><Settings size={30}/><h2>Workspace settings</h2><p>Profile details, links and availability settings can be managed here in a later step.</p></div>}
      </div>
    </div>
  </section>
}
