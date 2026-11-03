import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Leaf, Mail, MapPin, Phone, Search, Sprout } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import catalogue from '@/lib/seedco-content.json';
import team from '@/lib/seedco-team.json';
import agronomists from '@/lib/seedco-agronomists.json';
import { SiteLink, navigation } from './site-frame';
import harvest from '@/assets/vegetable-harvest.jpg';

type Block = {type:string;text:string;links?: {text:string;href:string}[]};
type Content = {path:string;title:string;image:string;blocks:Block[];date?:string};
type Crop = typeof catalogue.categories[number];
type Product = typeof catalogue.products[number];
const intro = 'Seed Co Vegetables Zambia, trading as Prime Seed Co is a vegetable seed business that is primarily involved in the supply of Certified hybrid and open pollinated Vegetable Seeds.';
const itemUrl = (path:string) => `/${path}/`;
export function PageHeader({eyebrow,title,description,image}: {eyebrow?:string;title:string;description?:string;image?:string}) {
 return <div className={`page-hero ${image?'has-photo':''}`}>
 {image && <img className="page-hero-photo" src={image} alt=""/>}
 <div className="site-container page-hero-inner"><div className="page-hero-copy"><span className="eyebrow eyebrow-light"><span className="eyebrow-dot"/> {eyebrow || 'SEED CO VEGETABLES / ZAMBIA'}</span><h1>{title}</h1>{description && <p>{description}</p>}</div><div className="page-hero-mark" aria-hidden="true">SC.</div></div>
 </div>;
}
export function SectionHeading({label,title,description,href,linkLabel}: {label:string;title:string;description?:string;href?:string|undefined;linkLabel?:string}) {
 return <div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-dot"/> {label}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{href && <SiteLink path={href} className="text-link">{linkLabel || 'Explore all'} <ArrowUpRight size={19}/></SiteLink>}</div>;
}
export function CropCard({crop,index}: {crop:Crop;index:number}) {
 return <SiteLink path={crop.path} className="crop-card"><div className="crop-image-wrap"><img src={crop.image} loading="lazy" alt={crop.name}/></div><div className="crop-card-bottom"><div><span>{crop.products.length} {crop.products.length===1?'VARIETY':'VARIETIES'}</span><h3>{crop.name}</h3></div><span className="circle-arrow"><ArrowUpRight size={20}/></span></div></SiteLink>;
}
export function ProductCard({product}: {product:Product}) {
 return <SiteLink path={product.path} className="product-card"><div className="product-card-image"><img src={product.image} alt={product.title} loading="lazy"/><span className="product-card-arrow"><ArrowUpRight size={19}/></span></div><div className="product-card-info"><span>{product.category.toUpperCase()}</span><h3>{product.title}</h3><p>Explore variety <ArrowRight size={16}/></p></div></SiteLink>;
}
type Group = {head:Block|null;body:Block[]};
type Statement = {head:Block;body:Block[]};
const isHeadingBlock = (type:string) => /^h[2-5]$/.test(type);
function splitGroups(blocks:Block[]):Group[] {
 const out:Group[] = [];
 let cur:Group = {head:null,body:[]};
 blocks.forEach(b => { if (isHeadingBlock(b.type)) { out.push(cur); cur = {head:b,body:[]}; } else cur.body.push(b); });
 out.push(cur);
 return out.filter(g => g.head || g.body.length);
}
const isStatement = (g:Group): g is Statement => !!g.head && g.body.length <= 1 && g.body.every(b => b.type==='p' && !b.links?.length && b.text.length <= 220);
const statementCount = (blocks:Block[]) => splitGroups(blocks).filter(isStatement).length;

function ContentBlocks({blocks, cards}: {blocks:Block[]; cards?:boolean}) {
 const renderBlock = (block:Block, key:string) => {
  const text = block.text;
  if (isHeadingBlock(block.type)) return <h2 key={key}>{text}</h2>;
  if (block.type==='li') return <div key={key} className="rich-list-item"><Check size={15}/><span>{text}</span></div>;
  if (block.type==='blockquote') return <blockquote key={key}>{text}</blockquote>;
  if (block.type==='table') return <div key={key} className="rich-table-text">{text}</div>;
  return <p key={key}>{text}{block.links?.filter(l=>l.href && l.text && !l.href.startsWith('javascript:') && !l.href.includes('localhost')).map((l,j)=><a key={j} href={l.href} target="_blank" rel="noreferrer" className="inline-link"> {l.text} ↗</a>)}</p>;
 };
 const units:(Block|Statement[])[] = [];
 if (cards) {
  let batch:Statement[] = [];
  const flush = () => { if (batch.length) { units.push(batch); batch = []; } };
  splitGroups(blocks).forEach(g => {
   if (isStatement(g)) { batch.push(g); return; }
   flush();
   if (g.head) units.push(g.head);
   g.body.forEach(b => units.push(b));
  });
  flush();
 } else blocks.forEach(b => units.push(b));
 return <div className="rich-content">{units.map((unit,i) => Array.isArray(unit)
  ? <div className="statement-grid" key={`g${i}`}>{unit.map((g,j)=><div className="statement-card" key={j}><span className="statement-index">{String(j+1).padStart(2,'0')} / {String(unit.length).padStart(2,'0')}</span><h3>{g.head.text}</h3>{g.body.map((b,k)=><p key={k}>{b.text}</p>)}</div>)}</div>
  : renderBlock(unit, `b${i}`))}</div>;
}
export function HomePage() {
 const featured = catalogue.products.filter(p => ['ALAMBRA F1','VS 209 F1','KITO F1','SUNSHINE F1'].includes(p.title)).slice(0,4);
 const stories = catalogue.articles.slice(0,3);
 return <>
 <section className="home-hero"><img className="home-hero-image" src={harvest} alt="Fresh vegetables grown in a green field" width="1920" height="1080"/><div className="site-container home-hero-content"><div className="home-hero-text"><span className="eyebrow eyebrow-light"><span className="eyebrow-dot"/> GROWN FOR ZAMBIA</span><h1>Vegetables<br/>worth growing<span className="heading-period">.</span></h1><p>Certified vegetable seeds, selected for the land we know and the harvests you deserve.</p><div className="hero-buttons"><Button variant="light" size="lg" asChild><SiteLink path="products">Explore our seeds <ArrowUpRight size={18}/></SiteLink></Button><SiteLink path="about-us/overview" className="hero-secondary">Our story <ArrowRight size={18}/></SiteLink></div></div><div className="hero-bottom"><a href="#discover" aria-label="Scroll to discover">SCROLL TO EXPLORE <ArrowDown size={17}/></a></div></div></section>
 <section className="home-intro" id="discover"><div className="site-container intro-grid"><div className="intro-lead"><span className="eyebrow"><span className="eyebrow-dot"/> ROOTED IN PERFORMANCE</span><h2>Good seed.<br/><em>Great possibilities.</em></h2></div><div className="intro-body"><p>{intro}</p><p>Our products are tested and adapted to Zambia’s agro-ecologies for outstanding yields and tolerance to pests and diseases.</p><SiteLink path="about-us/overview" className="text-link">Get to know us <ArrowUpRight size={19}/></SiteLink></div></div></section>
 <section className="crop-section"><div className="site-container"><SectionHeading label="THE CROP COLLECTION" title="Find your next bumper harvest." description="Discover vegetable seeds for every kind of grower." href="products" linkLabel="View all products"/><div className="crop-grid">{catalogue.categories.map((crop,i)=><CropCard crop={crop} index={i} key={crop.slug}/>)}</div></div></section>
 <section className="feature-band"><div className="feature-photo"><img src={catalogue.home.cropPhotography['Slider-Tomato.jpg']} alt="Seed Co tomato crop" loading="lazy"/></div><div className="feature-copy"><span className="eyebrow eyebrow-light"><span className="eyebrow-dot"/> GROWN WITH PURPOSE</span><h2>Made for the field.<br/>Made for the future.</h2><p>We breed seed, feed and lead in Africa. Discover the research and innovations behind our varieties.</p><Button variant="light" size="lg" asChild><SiteLink path="service-innovations">Discover innovations <ArrowUpRight size={18}/></SiteLink></Button><div className="feature-number">SEED CO / ZM</div></div></section>
 <section className="featured-section"><div className="site-container"><SectionHeading label="FROM THE FIELD" title="Varieties to know." description="Explore selected favourites from our vegetable collection." href="products" linkLabel="Browse all crops"/><div className="product-grid">{featured.map(p=><ProductCard product={p} key={p.path}/>)}</div></div></section>
 <section className="journal-section"><div className="site-container"><SectionHeading label="THE LATEST" title="Stories from the field." href="news" linkLabel="See all news"/><div className="story-grid">{stories.map(a=><StoryCard item={a} key={a.path}/>)}</div></div></section>
 <CtaBand/>
 </>;
}
export function CtaBand(){return <section className="cta-band"><div className="site-container cta-inner"><div><span className="eyebrow eyebrow-light"><span className="eyebrow-dot"/> LET'S GROW TOGETHER</span><h2>Need a hand choosing<br/>the right seed?</h2></div><Button asChild size="lg" variant="light"><SiteLink path="contact-us">Talk to our team <ArrowUpRight size={18}/></SiteLink></Button></div></section>}
export function ProductsPage(){return <><PageHeader title="Our vegetables." description="The right seed is where every great harvest begins." eyebrow="THE CROP COLLECTION" image={harvest}/><section className="page-section"><div className="site-container"><SectionHeading label="EXPLORE BY CROP" title="Find what grows for you." description="Ten crop families. Varieties selected for the demands of Zambia’s fields."/><div className="crop-grid">{catalogue.categories.map((crop,i)=><CropCard crop={crop} index={i} key={crop.slug}/>)}</div></div></section><CtaBand/></>}
export function CategoryPage({crop}: {crop:Crop}) {
 const products=catalogue.products.filter(p=>crop.products.includes(p.path));
 return <><PageHeader eyebrow="THE CROP COLLECTION" title={`${crop.name}.`} description={`${products.length} ${products.length===1?'variety':'varieties'} in our ${crop.name.toLowerCase()} collection.`} image={crop.image}/><section className="page-section"><div className="site-container"><div className="crumbs"><SiteLink path="products"><ArrowLeft size={15}/> All crops</SiteLink><ChevronRight size={14}/><span>{crop.name}</span></div><SectionHeading label={`${crop.name.toUpperCase()} SEED` } title="Explore the varieties."/><div className="product-grid">{products.map(p=><ProductCard product={p} key={p.path}/>)}</div></div></section><section className="category-switch"><div className="site-container"><span className="eyebrow">EXPLORE MORE CROPS</span><div>{catalogue.categories.filter(c=>c.slug!==crop.slug).map(c=><SiteLink path={c.path} key={c.slug}>{c.name}<ArrowUpRight size={16}/></SiteLink>)}</div></div></section><CtaBand/></>;
}
export function VarietyPage({product}: {product:Product}) {
 const crop=catalogue.categories.find(c=>c.name===product.category);
 const related=catalogue.products.filter(p=>p.category===product.category && p.path!==product.path).slice(0,3);
 return <><div className="variety-top"><div className="site-container"><div className="crumbs"><SiteLink path="products">All crops</SiteLink><ChevronRight size={14}/>{crop && <SiteLink path={crop.path}>{crop.name}</SiteLink>}<ChevronRight size={14}/><span>{product.title}</span></div><div className="variety-layout"><div className="variety-image"><img src={product.image} alt={product.title}/></div><div className="variety-intro"><span className="eyebrow"><span className="eyebrow-dot"/> {product.category.toUpperCase()} / SEED CO ZAMBIA</span><h1>{product.title}</h1><div className="variety-accent"/><h2>Product description</h2><ContentBlocks blocks={product.description.filter(b=>b.type!=='h5')}/><div className="variety-actions">{<Button asChild size="lg" variant="brand"><a href={product.buy || 'https://www.seedcoonlineshop.com/zm/'} target="_blank" rel="noreferrer">Buy now <ArrowUpRight size={17}/></a></Button>}<Button asChild size="lg" variant="outline"><SiteLink path="contact-us">Ask our team <ArrowRight size={17}/></SiteLink></Button></div></div></div></div></div><section className="variety-spec-section"><div className="site-container specs-layout"><div><span className="eyebrow"><span className="eyebrow-dot"/> THE DETAILS</span><h2>At a glance.</h2><p>Product characteristics from Seed Co Zambia.</p></div><div className="specs-list">{product.characteristics.filter(b=>b.type!=='h5').map((b,i)=>{const [label,...rest]=b.text.split(':');return <div className="spec-row" key={i}><strong>{rest.length?label:'Detail'}</strong><span>{rest.length?rest.join(':').trim():b.text}</span></div>})}</div></div></section>{related.length>0 && <section className="page-section related-section"><div className="site-container"><SectionHeading label={`MORE ${product.category.toUpperCase()}`} title="Keep exploring." href={crop?.path} linkLabel="View the collection"/><div className="product-grid">{related.map(p=><ProductCard product={p} key={p.path}/>)}</div></div></section>}<CtaBand/></>;
}
export function SectionNav({path}:{path:string}){
 const group=navigation.find(n=>n.links.some(([,p])=>p===path)) || (path.startsWith('about-us')?navigation[0]:undefined);
 return <aside className="section-float"><div className="section-card"><span className="section-card-label"><Leaf size={13}/> IN THIS SECTION</span><h3>{group?.label || 'Seed Co Zambia'}</h3>{group ? <nav>{group.links.map(([label,p])=><SiteLink key={p} path={p} className={`section-link ${p===path?'is-active':''}`}><span>{label}</span><ArrowRight size={14}/></SiteLink>)}</nav> : <nav><SiteLink path="" className="section-link"><span>Home</span><ArrowRight size={14}/></SiteLink><SiteLink path="products" className="section-link"><span>Our vegetables</span><ArrowRight size={14}/></SiteLink><SiteLink path="news" className="section-link"><span>News</span><ArrowRight size={14}/></SiteLink></nav>}</div><div className="section-help"><Sprout size={22}/><h4>Need assistance?</h4><p>Our team can help you choose the right seed.</p><SiteLink path="contact-us" className="text-link">Talk to us <ArrowUpRight size={16}/></SiteLink></div></aside>;
}
function StoryCard({item}:{item:Content}) {return <SiteLink path={item.path} className="story-card"><div className="story-image">{item.image && <img src={item.image} alt="" loading="lazy"/>}<span><ArrowUpRight size={20}/></span></div><div className="story-meta"><CalendarDays size={14}/>{item.date || 'SEED CO ZAMBIA'}</div><h3>{item.title}</h3><div className="story-read">Read story <ArrowRight size={16}/></div></SiteLink>}
export function ListingPage({title,items,kind}: {title:string;items:Content[];kind:'news'|'blog'}) {
 const [query,setQuery]=useState('');
 const filtered=useMemo(()=>items.filter(i=>i.title.toLowerCase().includes(query.toLowerCase())),[items,query]);
 return <><PageHeader eyebrow="FROM THE FIELD" title={`${title}.`} description="People, perspectives and progress from Seed Co Zambia." image={items[0]?.image || harvest}/><section className="page-section"><div className="site-container"><div className="listing-tools"><div><span className="eyebrow"><span className="eyebrow-dot"/> {kind==='news'?'LATEST UPDATES':'IDEAS & INSIGHTS'}</span><h2>Read the latest.</h2></div><label className="search-field"><Search size={19}/><input type="search" placeholder="Search stories" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search stories"/></label></div><div className="story-grid story-listing">{filtered.map(a=><StoryCard item={a} key={a.path}/>)}</div>{!filtered.length && <p className="empty-result">No stories match that search.</p>}</div></section><CtaBand/></>;
}
export function ArticlePage({item}: {item:Content}) {return <><PageHeader eyebrow="SEED CO / STORIES" title={item.title} image={item.image || harvest}/><section className="article-section"><div className="site-container article-layout"><div className="article-main">{item.date && <span className="article-date"><CalendarDays size={15}/> {item.date}</span>}<ContentBlocks blocks={item.blocks}/><SiteLink path="blog" className="text-link article-back"><ArrowLeft size={17}/> All stories</SiteLink></div><SectionNav path="blog"/></div></section><CtaBand/></>}
export function FaqPage(){return <><PageHeader title="Frequently asked questions." description="Answers to the questions growers ask most." image={harvest}/><section className="page-section"><div className="site-container faq-layout"><div><span className="eyebrow"><span className="eyebrow-dot"/> HERE TO HELP</span><h2>Good questions.<br/>Clear answers.</h2><p>Can't find the answer you are looking for?</p><SiteLink path="contact-us" className="text-link">Talk to our team <ArrowUpRight size={18}/></SiteLink></div><div className="faq-list">{catalogue.faq.map((faq,i)=><details key={i} className="faq-item"><summary><span>{faq.question}</span><span className="faq-toggle">+</span></summary><ContentBlocks blocks={faq.answer}/></details>)}</div></div></section></>}
export function ContactPage(){return <><PageHeader title="Let’s talk growth." description="Your next great harvest starts with a conversation." image={harvest}/><section className="page-section"><div className="site-container contact-layout"><div><span className="eyebrow"><span className="eyebrow-dot"/> CONTACT SEED CO ZAMBIA</span><h2>We're here for you.</h2><p>From choosing the right variety to making the most of your crop, our team is ready to help.</p><Button asChild size="lg" variant="brand"><a href="mailto:Zambia.sales@seedcogroup.com">Email our sales team <ArrowUpRight size={17}/></a></Button></div><div className="contact-details"><a href="tel:+260211426400"><span><Phone size={24}/></span><div><small>CALL US</small><strong>+260 211 426 400</strong></div><ArrowUpRight size={20}/></a><a href="mailto:Zambia.sales@seedcogroup.com"><span><Mail size={24}/></span><div><small>SALES EMAIL</small><strong>Zambia.sales@seedcogroup.com</strong></div><ArrowUpRight size={20}/></a><a href="mailto:Zambia.seedco@seedcogroup.com"><span><Mail size={24}/></span><div><small>GENERAL ENQUIRIES</small><strong>Zambia.seedco@seedcogroup.com</strong></div><ArrowUpRight size={20}/></a><div><span><MapPin size={24}/></span><div><small>VISIT US</small><strong>SeedCo Business Complex</strong><p>Farm no 683 B, Mumbwa Road<br/>P.O. Box 35310, Lusaka, Zambia</p></div></div></div></div></section></>}
const OFFICE_FIRST=['Seed Co Head Office'];

export function AgronomistDirectory(){
 const groups=useMemo(()=>{
  const map=new Map<string,(typeof agronomists)[number][]>();
  agronomists.forEach(p=>{const key=p.location||'Other';const list=map.get(key)||[];list.push(p);map.set(key,list);});
  const rank=(name:string)=>{const i=OFFICE_FIRST.indexOf(name);return i===-1?OFFICE_FIRST.length:i;};
  return Array.from(map.entries()).sort((a,b)=>rank(a[0])-rank(b[0])||a[0].localeCompare(b[0]));
 },[]);
 return <div className="region-accordion">
  <p className="agronomist-intro">Find the Seed Co agronomist for your region. Open a region to see who covers it.</p>
  {groups.map(([office,people],i)=>{
   const districts=Array.from(new Set(people.map(p=>p.region))).sort((a,b)=>a.localeCompare(b));
   return <details className="region-panel" key={office} name="agronomist-regions" open={i===0}>
    <summary>
     <span className="region-panel-mark"><MapPin size={16}/></span>
     <span className="region-panel-titles"><strong>{office}</strong><small>{districts.join(' · ')}</small></span>
     <span className="region-panel-count">{people.length}</span>
     <ChevronDown className="region-panel-chevron" size={17}/>
    </summary>
    <div className="region-panel-body">
     {people.map(p=>{
      const cut=p.name.search(/\s+[–-]\s+/);
      const name=cut===-1?p.name:p.name.slice(0,cut);
      const role=cut===-1?'':p.name.slice(cut).replace(/^\s+[–-]\s+/,'');
      return <div className="agronomist-row" key={p.name}>
       <div><strong>{name}</strong>{role&&<em>{role}</em>}<span>{p.region}</span></div>
       <a href={`tel:${p.phone.replace(/\D/g,'')}`}><Phone size={15}/>{p.phone}</a>
      </div>;
     })}
    </div>
   </details>;
  })}
 </div>;
}

export function PhotoGallery(){
 const shots=useMemo(()=>catalogue.articles.filter(a=>a.image),[]);
 const [index,setIndex]=useState(0);
 const go=(d:number)=>setIndex(i=>(i+d+shots.length)%shots.length);
 useEffect(()=>{
  const onKey=(e:KeyboardEvent)=>{ if(e.key==='ArrowRight')setIndex(i=>(i+1)%shots.length); if(e.key==='ArrowLeft')setIndex(i=>(i-1+shots.length)%shots.length); };
  document.addEventListener('keydown',onKey);
  return ()=>document.removeEventListener('keydown',onKey);
 },[shots.length]);
 if(!shots.length)return null;
 const current=shots[index];
 return <div className="gallery-slider">
  <div className="slider-stage">
   <img key={current.path} src={current.image} alt={current.title}/>
   <div className="slider-caption"><span className="slider-count">{String(index+1).padStart(2,'0')} / {String(shots.length).padStart(2,'0')}</span><strong>{current.title}</strong></div>
   <button type="button" className="slider-arrow slider-prev" aria-label="Previous photo" onClick={()=>go(-1)}><ChevronLeft size={24}/></button>
   <button type="button" className="slider-arrow slider-next" aria-label="Next photo" onClick={()=>go(1)}><ChevronRight size={24}/></button>
  </div>
  <div className="slider-thumbs" role="tablist" aria-label="Gallery photos">
   {shots.map((a,i)=><button type="button" key={a.path} role="tab" aria-selected={i===index} aria-label={`Photo ${i+1}: ${a.title}`} className={i===index?'slider-thumb active':'slider-thumb'} onClick={()=>setIndex(i)}><img src={a.image} alt="" loading="lazy"/></button>)}
  </div>
 </div>;
}

export function ContentPage({item}: {item:Content}) {
 const related = item.path.startsWith('about-us/') ? ['about-us/overview','about-us/our-story','about-us/management-team','about-us/sales-team','about-us/agronomists','about-us/careers'].filter(p=>p!==item.path) : [];
 const specialLinks = item.path==='service-innovations'?['disease-tolerance','hybridization','yield-thrust','top-left-hybrids','climate-fast-varieties']:item.path==='about-us'?related:[];
 const people=team[item.path as keyof typeof team];
 return <><PageHeader title={item.title} image={item.image || harvest}/><section className="article-section"><div className="site-container article-layout"><div className="article-main">{item.blocks.length>0 && item.path!=='about-us/agronomists'?<ContentBlocks blocks={item.blocks} cards={statementCount(item.blocks)>=2}/>:null}{people?.length>0 && <div className="people-grid">{people.map(p=><div className="person-card" key={p.name}>{(p as {photo?:string}).photo ? <div className="person-photo"><img src={(p as {photo?:string}).photo} alt={p.name} loading="lazy"/></div> : <span className="person-initial">{p.name.trim().split(/\s+/).slice(0,2).map(s=>s[0]).join('')}</span>}<h3>{p.name}</h3><p>{p.role}</p></div>)}</div>}{item.path==='about-us/agronomists' && <AgronomistDirectory/>}{specialLinks.length>0 && <div className="related-links">{specialLinks.map(path=><SiteLink key={path} path={path}>{catalogue.pages.find(p=>p.path===path)?.title || path}<ArrowUpRight size={18}/></SiteLink>)}</div>}{item.path==='media/photo-gallery' && <PhotoGallery/>}{item.path==='media/video-gallery' && <div className="related-links"><a href="https://www.youtube.com/channel/UCrlVuj5uYRjTRXJWSmkozjQ" target="_blank" rel="noreferrer">Seed Co video channel <ArrowUpRight size={18}/></a></div>}{item.path==='media/events-calendar' && <div className="related-links"><SiteLink path="contact-us">Ask about upcoming events <ArrowUpRight size={18}/></SiteLink></div>}{item.blocks.length===0 && !people?.length && item.path!=='about-us/agronomists' && !specialLinks.length && !['media/photo-gallery','media/video-gallery','media/events-calendar'].includes(item.path) && <p className="empty-copy">Explore more from Seed Co Zambia.</p>}</div><SectionNav path={item.path}/></div></section><CtaBand/></>;
}
export function NotFoundPage(){return <><PageHeader title="This page hasn't grown here." description="Let's help you find your way back." image={harvest}/><section className="page-section"><div className="site-container"><Button variant="brand" asChild><Link to="/">Back to home <ArrowRight size={16}/></Link></Button></div></section></>}
