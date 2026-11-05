import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useVisible, useStoredState } from './hooks.js';
const LazyPanel = lazy(() => import('./LazyPanel.jsx'));
const labels = ['Fade', 'Slide Up', 'Blur', 'Split Text', 'Gradient', 'Shiny', 'Glare Hover', 'Count Up'];

function Reveal({ children, kind='fade', replay=0, delay=0 }) {
  const [ref, visible] = useVisible();
  return <div key={replay} ref={ref} className={'reveal reveal-'+kind+(visible?' visible':'')} style={{ '--delay': delay+'ms' }}>{children}</div>;
}
function SplitWords({ text, replay=0 }) {
  const [ref, visible] = useVisible();
  return <h3 key={replay} ref={ref} className={'split-words'+(visible?' visible':'')} aria-label={text}>{text.split(' ').map((word,i)=><span aria-hidden="true" key={i} style={{'--i':i}}>{word}&nbsp;</span>)}</h3>;
}
function CountUp({ end=1500, replay=0 }) {
  const [ref, seen] = useVisible();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(end); return; }
    let frame, start;
    const tick = now => {
      start ??= now;
      const p=Math.min((now-start)/1200,1);
      setValue(Math.round(end*(1-Math.pow(1-p,3))));
      if(p<1) frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[seen,end,replay]);
  return <span key={replay} ref={ref}>{new Intl.NumberFormat('tr-TR').format(value)}</span>;
}
function Sample({ name, index, replay, enabled, children, className='' }) {
  return <div className={'sample-card '+className}>
    <div className="sample-meta"><span className="sample-index">{String(index+1).padStart(2,'0')}</span><span>{name}</span><span className="light-dot"/></div>
    <div className={'sample-content '+(!enabled?'paused':'')}>{children}</div>
    <div className="sample-foot"><span>CSS {['Fade','Slide Up','Blur','Split Text'].includes(name)?'+ Observer':''}</span><span className="sample-arrow">↗</span></div>
  </div>;
}
export default function App() {
  const [enabled,setEnabled]=useStoredState('uzerman-animations-enabled',true);
  const [favorite,setFavorite]=useStoredState('uzerman-animation-favorite',false);
  const [replay,setReplay]=useState(0);
  const [active,setActive]=useState('Tümü');
  const [lazyRef,lazyVisible]=useVisible('400px 0px');
  const examples = [
    {name:'Fade',category:'Scroll',render:()=> <Reveal replay={replay}><div className="sample-statement">Her detayda <b>mühendislik.</b></div></Reveal>},
    {name:'Slide Up',category:'Scroll',render:()=> <Reveal kind="slide" replay={replay}><div className="slide-example"><span className="small-glyph">↗</span><b>İklimlendirmede<br/>yeni bir standart.</b></div></Reveal>},
    {name:'Blur',category:'Scroll',render:()=> <Reveal kind="blur" replay={replay}><div className="big-words">NET BİR<br/>VİZYON.</div></Reveal>},
    {name:'Split Text',category:'Text',render:()=> <SplitWords replay={replay} text="Geleceği birlikte tasarlıyoruz."/>},
    {name:'Gradient',category:'Text',render:()=> <div className="gradient-text">SINIRSIZ<br/>ENERJİ.</div>},
    {name:'Shiny',category:'Text',render:()=> <div className="shiny-text">Teknoloji ile<br/>geleceğe.</div>},
    {name:'Glare Hover',category:'Hover',render:()=> <div className="glare-target"><span className="glare-symbol">◈</span><div><strong>Premium Deneyim</strong><small>Kartın üzerine gel</small></div><span>↗</span></div>},
    {name:'Count Up',category:'Data',render:()=> <div className="counter-wrap"><strong><CountUp key={replay} end={1500} replay={replay}/><span>+</span></strong><span>Animasyon için örnek değer</span></div>},
  ];
  const chosen=examples.filter(x=>active==='Tümü'||x.category===active);
  return <div className={!enabled?'app motion-disabled':'app'}>
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark">U</span><span>UZER<span className="brand-blue">MAN</span><small>MÜHENDİSLİK A.Ş.</small></span></a><div className="nav-links"><a href="#examples">Animasyonlar</a><a href="#performance">Performans</a><a href="https://reactbits.dev/" target="_blank" rel="noreferrer">React Bits ↗</a></div><span className="nav-status"><i/> LIGHTWEIGHT LAB</span></header>
    <main id="top">
      <section className="hero"><div className="hero-glow"/><div className="hero-intro"><span className="intro-line"><i/> REACT ANIMATION PLAYGROUND <span> / 2026</span></span><h1>Hareketin<br/><em>en hafif</em> hali<span className="dot">.</span></h1><p>React Bits estetiğiyle hazırlanmış, performans odaklı animasyon laboratuvarı. Az kod, akıcı geçişler, daha iyi deneyim.</p><div className="hero-buttons"><a href="#examples" className="primary-button">Animasyonları keşfet <span>↗</span></a><a className="text-link" href="https://github.com/mrtatnc/uzerman-kombi-onizleme/tree/reactbits-animation-preview" target="_blank" rel="noreferrer">Kaynak kodu incele ↗</a></div></div><div className="hero-visual"><div className="orbit orbit-outer"/><div className="orbit orbit-mid"/><div className="orbit orbit-inner"/><div className="orb orb-one"/><div className="orb orb-two"/><div className="orb orb-three"/><div className="center-object"><span>U</span></div><div className="floating-tag tag-top">60 FPS <i>●</i></div><div className="floating-tag tag-bottom">PURE CSS + REACT</div></div><div className="hero-bottom"><span>SCROLL TO EXPLORE ↓</span><span>01 — 08 / LIVE COMPONENTS</span></div></section>
      <section className="section examples" id="examples"><div className="section-top"><div><span className="eyebrow">01 / COMPONENT SHOWCASE</span><h2>Küçük dokunuşlar.<br/><span>Büyük etki.</span></h2><p>Her kart gerçek, etkileşimli bir örnek. Tekrar oynat, filtrele veya animasyonları kapat.</p></div><div className="control-panel"><div className="toggle-label"><span>Animasyonlar</span><button aria-pressed={enabled} className={'switch '+(enabled?'on':'')} onClick={()=>setEnabled(v=>!v)}><span/></button></div><button className="replay-button" onClick={()=>setReplay(v=>v+1)}>↻ <span>Tekrar oynat</span></button></div></div><div className="filters">{['Tümü','Scroll','Text','Hover','Data'].map(x=><button key={x} onClick={()=>setActive(x)} className={active===x?'selected':''}>{x}<span>{x==='Tümü'?8:examples.filter(v=>v.category===x).length}</span></button>)}</div><div className="sample-grid">{chosen.map((item)=>{const index=examples.indexOf(item);return <Sample key={item.name} name={item.name} index={index} enabled={enabled} replay={replay}>{item.render()}</Sample>})}</div></section>
      <section className="feature-section" id="performance"><div className="section-top"><div><span className="eyebrow">02 / BUILT FOR SPEED</span><h2>Görünmeyeni<br/><span>yükleme.</span></h2><p>IntersectionObserver ve dinamik import ile yalnızca gerektiğinde çalışan bileşenler.</p></div><div className="feature-metric"><strong>0</strong><span>Ek animasyon<br/>kütüphanesi</span></div></div><div ref={lazyRef} className="lazy-surface">{lazyVisible?<Suspense fallback={<div className="lazy-fallback">Modül yükleniyor…</div>}><LazyPanel/></Suspense>:<div className="lazy-fallback">Scroll ile bu alana yaklaşınca modül yüklenir.</div>}</div><div className="feature-badges"><span>✓ IntersectionObserver</span><span>✓ React.lazy + Suspense</span><span>✓ Reduced motion</span><span>✓ LocalStorage</span></div></section>
      <section className="last-section"><span className="eyebrow">03 / PERSISTENT STATE</span><div><div><h2>Tercihlerin<br/><span>yerinde kalsın.</span></h2><p>Aşağıdaki tercihin tarayıcıda saklanır. Sayfayı yenilediğinde de korunur.</p></div><button className={'favorite-button '+(favorite?'is-favorite':'')} onClick={()=>setFavorite(v=>!v)}>{favorite?'♥':'♡'} {favorite?'Favorilere eklendi':'Bu demoyu favorile'}</button></div></section>
    </main><footer><div className="brand"><span className="brand-mark">U</span><span>UZER<span className="brand-blue">MAN</span><small>MÜHENDİSLİK A.Ş.</small></span></div><span>React Bits ilhamıyla • Bağımsız hafif uygulama</span><span>© 2026 UZERMAN</span></footer>
  </div>;
}
