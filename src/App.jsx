import { useState, useEffect, useRef } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes fadeUp     { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes fadeIn     { from{opacity:0} to{opacity:1} }
@keyframes bounceIn   { 0%{transform:scale(.4);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
@keyframes pulseY     { 0%,100%{box-shadow:0 0 0 0 rgba(246,180,14,.4)} 50%{box-shadow:0 0 0 12px rgba(246,180,14,0)} }
@keyframes confettiFall{ 0%{transform:translateY(-8px) rotate(0deg);opacity:1} 100%{transform:translateY(200px) rotate(540deg);opacity:0} }
@keyframes steamUp    { 0%{transform:translateY(0) scaleX(1);opacity:.4} 100%{transform:translateY(-18px) scaleX(1.5);opacity:0} }
.float    { animation: float 3.6s ease-in-out infinite; }
.bounce-in{ animation: bounceIn .55s cubic-bezier(.34,1.56,.64,1) both; }
.btn-y    { animation: pulseY 2.4s infinite; }
.confetti-p{position:absolute;animation:confettiFall var(--d) ease-in var(--dl) both;pointer-events:none}
.steam-1  { animation: steamUp 1.4s ease-out 0s    infinite; }
.steam-2  { animation: steamUp 1.4s ease-out .45s  infinite; }
.steam-3  { animation: steamUp 1.4s ease-out .9s   infinite; }
.u1{animation:fadeUp .42s ease .05s both}
.u2{animation:fadeUp .42s ease .13s both}
.u3{animation:fadeUp .42s ease .22s both}
.u4{animation:fadeUp .42s ease .32s both}
.fi{animation:fadeIn .3s ease both}
`;

const P = {
  bg:'#FFFFFF', bgSoft:'#F4F9FF',
  cel:'#74ACDF', celLight:'#E4F1FB', celDark:'#4A88BE',
  navy:'#1A2E3F', navySoft:'#2C4A62',
  yellow:'#F6B40E', ylLight:'#FFF8DC', ylDark:'#C99208',
  muted:'#7A94A8', border:'#D8EAF5', text:'#1A2E3F',
};

// ── DATA ─────────────────────────────────────────────────────────────────────
const COMEDORES = [
  { id:1, emoji:"🌻", name:"Comedor Los Girasoles", short:"Los Girasoles",
    zone:"Mataderos, CABA", zoneId:"caba", type:"Comedor comunitario",
    typeOrg:"Organización vecinal", verified:true, founded:"2019",
    days:"Lunes a viernes · dos turnos",
    bocas:148, diasActivos:127, metaPct:72, metaAmount:18000,
    tagline:"Desde el barrio, para el barrio.",
    description:"Todo empezó con tres vecinas, una olla prestada y 12 chicos del pasillo. Hoy somos 12 voluntarios cocinando dos turnos por día.",
    representante:"María Fernández", rol:"Coordinadora vecinal",
    team:[{name:"María Fernández",rol:"Coordinadora",emoji:"👩‍🍳",years:5},{name:"Jorge Ramos",rol:"Logística",emoji:"👨‍🔧",years:4},{name:"Lidia Paz",rol:"Voluntaria",emoji:"👵",years:5}],
    alias:"los.girasoles.mp",
    alimentos:["🌾 Arroz","🌽 Polenta","🥚 Huevos","🍝 Fideos","🛢️ Aceite"],
    padrinos:24, semanaAporte:1500, telefono:"11 4523-7891",
    updates:[{date:"Hace 2 días",emoji:"📸",text:"Hoy cocinamos guiso para 52 personas. Pudimos comprar carne gracias a sus aportes.",hasPhoto:true,photo:"🍲"},{date:"Hace 5 días",emoji:"🎉",text:"¡Cumplimos la meta! 38 familias, 127 raciones esta semana.",hasPhoto:false}] },
  { id:2, emoji:"🌉", name:"Merendero El Puente", short:"El Puente",
    zone:"Floresta, CABA", zoneId:"caba", type:"Merendero",
    typeOrg:"Fundación civil", verified:true, founded:"2017",
    days:"Lunes a viernes · tarde",
    bocas:89, diasActivos:210, metaPct:41, metaAmount:12000,
    tagline:"No cerramos ni en la pandemia.",
    description:"Roberto empezó El Puente cuando vio que los chicos del asentamiento no tenían adónde ir después del colegio.",
    representante:"Roberto Suárez", rol:"Fundador",
    team:[{name:"Roberto Suárez",rol:"Fundador",emoji:"👨‍🏫",years:7},{name:"Carla Méndez",rol:"Apoyo escolar",emoji:"👩‍🎓",years:3}],
    alias:"merendero.elpuente",
    alimentos:["🥛 Leche","🍬 Azúcar","🌾 Harina","🍯 Mermelada"],
    padrinos:11, semanaAporte:2000, telefono:"11 3867-2240",
    updates:[{date:"Ayer",emoji:"📚",text:"Valentina sacó un 9 en matemáticas y nos trajo el papel. Orgullo total.",hasPhoto:true,photo:"📝"}] },
  { id:3, emoji:"🌹", name:"Comedor Doña Rosa", short:"Doña Rosa",
    zone:"Villa Lugano, CABA", zoneId:"caba", type:"Adultos mayores",
    typeOrg:"Iniciativa individual", verified:false, founded:"2016",
    days:"Lunes, miércoles y viernes",
    bocas:60, diasActivos:45, metaPct:89, metaAmount:9000,
    tagline:"Para los abuelos del barrio.",
    description:"Rosa lleva 8 años cocinando para adultos mayores solos y familias monoparentales.",
    representante:"Rosa Acevedo", rol:"Responsable y fundadora",
    team:[{name:"Rosa Acevedo",rol:"Cocinera",emoji:"👩‍🍳",years:8},{name:"Mirta Saldaño",rol:"Ayudante",emoji:"👵",years:6}],
    alias:"donarosa.comedor",
    alimentos:["🫒 Aceite","🥬 Verduras","🥩 Carne","🌾 Arroz"],
    padrinos:8, semanaAporte:1000,
    updates:[{date:"Hace 3 días",emoji:"💛",text:"Cumpleaños de Don Héctor, 82 años. Le hicimos torta. Se le llenaron los ojos de agua.",hasPhoto:true,photo:"🎂"}] },
  { id:4, emoji:"🌿", name:"Copa de Leche San Martín", short:"San Martín",
    zone:"San Martín, GBA Norte", zoneId:"gba_n", type:"Copa de leche",
    typeOrg:"Parroquia", verified:true, founded:"2020",
    days:"Lunes a sábado · mañana",
    bocas:110, diasActivos:88, metaPct:58, metaAmount:14000,
    tagline:"El desayuno que los chicos necesitan.",
    description:"Damos desayuno a 110 chicos antes del colegio. Muchos vienen sin haber comido nada.",
    representante:"Padre Guillermo Rivas", rol:"Coordinador",
    team:[{name:"Padre Guillermo",rol:"Coordinador",emoji:"⛪",years:4}],
    alias:"copa.sanmartin",
    alimentos:["🥛 Leche","☕ Mate cocido","🍞 Pan","🧈 Manteca"],
    padrinos:19, semanaAporte:1500,
    updates:[{date:"Hace 1 día",emoji:"🌅",text:"98 chicos a las 7:45. Con la taza en la mano, listos para aprender.",hasPhoto:true,photo:"☕"}] },
];

const COMUNAS = [
  {id:1,  num:"1",  short:"Centro / San Telmo",    barrios:"Retiro, San Nicolás, San Telmo, Montserrat, Constitución",       comedores:12},
  {id:2,  num:"2",  short:"Recoleta",              barrios:"Recoleta",                                                        comedores:5},
  {id:3,  num:"3",  short:"Balvanera / Once",      barrios:"Balvanera, San Cristóbal",                                        comedores:18},
  {id:4,  num:"4",  short:"La Boca / Barracas",    barrios:"La Boca, Barracas, Parque Patricios, Nueva Pompeya",              comedores:24},
  {id:5,  num:"5",  short:"Almagro / Boedo",       barrios:"Almagro, Boedo",                                                  comedores:11},
  {id:6,  num:"6",  short:"Caballito",             barrios:"Caballito",                                                       comedores:9},
  {id:7,  num:"7",  short:"Flores",                barrios:"Flores, Parque Chacabuco",                                        comedores:21},
  {id:8,  num:"8",  short:"Lugano / Soldati",      barrios:"Villa Soldati, Villa Riachuelo, Villa Lugano",                    comedores:31},
  {id:9,  num:"9",  short:"Mataderos / Liniers",   barrios:"Liniers, Mataderos, Parque Avellaneda",                           comedores:26},
  {id:10, num:"10", short:"Floresta / Vélez",      barrios:"Floresta, Monte Castro, Versalles, Villa Luro, Vélez Sársfield",  comedores:15},
  {id:11, num:"11", short:"Devoto / Del Parque",   barrios:"Villa Devoto, Villa del Parque, Villa Santa Rita",                comedores:13},
  {id:12, num:"12", short:"Urquiza / Saavedra",    barrios:"Coghlan, Saavedra, Villa Urquiza, Villa Pueyrredón",              comedores:10},
  {id:13, num:"13", short:"Belgrano / Núñez",      barrios:"Belgrano, Colegiales, Núñez",                                    comedores:7},
  {id:14, num:"14", short:"Palermo",               barrios:"Palermo",                                                        comedores:8},
  {id:15, num:"15", short:"Chacarita / Crespo",    barrios:"Chacarita, Villa Crespo, La Paternal, Parque Chas, Agronomía",   comedores:14},
];
const MONTOS=[
  {val:500,label:"$500",food:"1 kg de arroz · 4 raciones"},
  {val:1000,label:"$1.000",food:"2 kg arroz + huevos · 8 raciones"},
  {val:1500,label:"$1.500",food:"Canasta básica para 1 familia"},
  {val:2000,label:"$2.000",food:"Mercado para 2 familias · 16 raciones"},
];
const ACHIEVEMENTS=[
  {id:"primera",icon:"💧",label:"Primera gota",desc:"Tu primera colaboración"},
  {id:"llamas",icon:"🔥",label:"En llamas",desc:"4 semanas seguidas"},
  {id:"mes",icon:"⭐",label:"Padrino del mes",desc:"Un mes completo"},
  {id:"doble",icon:"🦋",label:"Doble amor",desc:"Dos comedores"},
  {id:"super",icon:"🏆",label:"Super padrino",desc:"Tres meses"},
];

// ── Pot with Argentine flag wave fill (splash only) ───────────────────────────
function SplashPot({size=190}) {
  const [fillPct, setFillPct] = useState(0);
  const [phase, setPhase] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const TARGET = 74;
  const FILL_DUR = 3400;

  useEffect(() => {
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / FILL_DUR, 1);
      const eased = t < .5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
      setFillPct(TARGET * eased);
      setPhase(ts * 0.0028);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const body = "M 26 42 L 74 42 Q 82 42 82 50 L 82 82 Q 82 88 74 88 L 26 88 Q 18 88 18 82 L 18 50 Q 18 42 26 42 Z";

  // Wave fill path
  const wavePath = (() => {
    if (fillPct < 0.4) return '';
    const baseY = 88 - 46 * fillPct / 100;
    const amp = 1.7, freq = 2.4;
    const pts = [];
    for (let x = 18; x <= 82; x++) {
      const y = baseY + Math.sin((x - 18) / 64 * Math.PI * freq * 2 + phase) * amp;
      pts.push(`${x} ${y.toFixed(2)}`);
    }
    return `M 18 88 L ${pts.join(' L ')} L 82 88 Z`;
  })();

  // Sun: rises from bottom of white zone (~y=73) into center (~y=65)
  // white zone: fill 33%–66%, SVG y: 72.7 → 57.3
  // Sun starts appearing at fill=30, fully up at fill=62
  const SUN_START = 30, SUN_FULL = 62;
  const sunProgress = Math.max(0, Math.min(1, (fillPct - SUN_START) / (SUN_FULL - SUN_START)));
  const sunOpacity = sunProgress;
  // Y: starts at 74 (celeste/white boundary), rises to 64 (center of white zone)
  const sunCY = 74 - 10 * sunProgress;
  const sunCX = 50;
  const sunR = 4.8;
  const rayInner = 7.2, rayOuter = 11.5;
  const RAY_COUNT = 16;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{display:"block"}}>
      <defs>
        <linearGradient id="flagG" x1="0" y1="88" x2="0" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%"      stopColor="#74ACDF"/>
          <stop offset="33.2%"   stopColor="#74ACDF"/>
          <stop offset="33.35%"  stopColor="#FFFFFF"/>
          <stop offset="66.65%"  stopColor="#FFFFFF"/>
          <stop offset="66.8%"   stopColor="#74ACDF"/>
          <stop offset="100%"    stopColor="#74ACDF"/>
        </linearGradient>
        <clipPath id="bodyC"><path d={body}/></clipPath>
      </defs>

      {/* Flag wave fill */}
      {wavePath && (
        <path d={wavePath} fill="url(#flagG)" clipPath="url(#bodyC)"/>
      )}

      {/* Sol — plain yellow circle, centered in white band */}
      {sunOpacity > 0 && (
        <circle
          cx={sunCX} cy={sunCY} r={7}
          fill="#F6B40E"
          clipPath="url(#bodyC)"
          opacity={sunOpacity}
        />
      )}

      {/* Pot outline */}
      <path d={body} fill="none" stroke={P.navy} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M 18 56 Q 8 56 8 66 Q 8 76 18 76" fill="none" stroke={P.navy} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 82 56 Q 92 56 92 66 Q 92 76 82 76" fill="none" stroke={P.navy} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 14 44 Q 50 30 86 44" fill="none" stroke={P.navy} strokeWidth="2.5" strokeLinecap="round"/>

      {/* Steam when nearly full */}
      {fillPct > 65 && <>
        <path d="M 40 28 Q 42 21 40 14" fill="none" stroke={P.navy} strokeWidth="1.8" strokeLinecap="round" className="steam-1"/>
        <path d="M 50 26 Q 52 19 50 12" fill="none" stroke={P.navy} strokeWidth="1.8" strokeLinecap="round" className="steam-2"/>
        <path d="M 60 28 Q 62 21 60 14" fill="none" stroke={P.navy} strokeWidth="1.8" strokeLinecap="round" className="steam-3"/>
      </>}
    </svg>
  );
}

// ── Static pot (outline + flat fill) for rest of app ─────────────────────────
function Pot({fill=0, size=160, fillColor=P.cel, strokeColor=P.navy, strokeW=2.5, noSteam=false}) {
  const pct = Math.max(0, Math.min(100, fill));
  const innerBot=88, innerH=46;
  const fillH=innerH*pct/100;
  const fillY=innerBot-fillH;
  const body="M 26 42 L 74 42 Q 82 42 82 50 L 82 82 Q 82 88 74 88 L 26 88 Q 18 88 18 82 L 18 50 Q 18 42 26 42 Z";
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{display:"block"}}>
      <defs>
        <clipPath id={`c${size}${Math.floor(fill)}`}><rect x="18" y={fillY} width="64" height={fillH+4}/></clipPath>
      </defs>
      {pct>0&&<path d={body} fill={fillColor} clipPath={`url(#c${size}${Math.floor(fill)})`}/>}
      <path d={body} fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinejoin="round"/>
      <path d="M 18 56 Q 8 56 8 66 Q 8 76 18 76" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round"/>
      <path d="M 82 56 Q 92 56 92 66 Q 92 76 82 76" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round"/>
      <path d="M 14 44 Q 50 30 86 44" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round"/>
      {pct>70&&!noSteam&&<>
        <path d="M 40 28 Q 42 21 40 14" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" className="steam-1"/>
        <path d="M 50 26 Q 52 19 50 12" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" className="steam-2"/>
        <path d="M 60 28 Q 62 21 60 14" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" className="steam-3"/>
      </>}
    </svg>
  );
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const cols=[P.yellow,P.cel,"#fff",P.navySoft,"#F0E040",P.celLight,"#FFC0CB"];
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:200}}>
      {Array.from({length:30},(_,i)=>({id:i,color:cols[i%cols.length],left:`${5+Math.random()*90}%`,d:`${1.1+Math.random()*.9}s`,dl:`${Math.random()*.5}s`,sz:6+Math.random()*9,round:Math.random()>.5,rot:Math.random()*360})).map(p=>(
        <div key={p.id} className="confetti-p" style={{left:p.left,top:-10,width:p.sz,height:p.sz,borderRadius:p.round?"50%":"3px",background:p.color,transform:`rotate(${p.rot}deg)`,"--d":p.d,"--dl":p.dl}}/>
      ))}
    </div>
  );
}

// ── Progress dots ─────────────────────────────────────────────────────────────
function Dots({step,total=6,onDark=false}) {
  return (
    <div style={{display:"flex",gap:5,justifyContent:"center"}}>
      {Array.from({length:total},(_,i)=>(
        <div key={i} style={{width:i===step-1?20:6,height:6,borderRadius:3,background:i<step?(onDark?"rgba(255,255,255,.9)":P.cel):(onDark?"rgba(255,255,255,.2)":P.border),transition:"all .3s ease"}}/>
      ))}
    </div>
  );
}

// ── OBHeader ──────────────────────────────────────────────────────────────────
function OBHeader({step,onBack,onDark=false}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
      {onBack
        ?<button onClick={onBack} style={{background:"none",border:"none",fontFamily:"Plus Jakarta Sans",fontSize:14,color:onDark?"rgba(255,255,255,.6)":P.muted,cursor:"pointer",padding:0}}>← Volver</button>
        :<div/>}
      <Dots step={step} total={6} onDark={onDark}/>
      <div style={{width:52}}/>
    </div>
  );
}

// ── OB0: Splash ───────────────────────────────────────────────────────────────
function OB0Splash({onNext}) {
  useEffect(()=>{ const t=setTimeout(onNext,6000); return()=>clearTimeout(t); },[]);
  return (
    <div onClick={onNext} style={{height:"100%",background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 32px 40px",cursor:"pointer"}}>

      {/* Animated flag pot — large, no extra top text */}
      <div className="u1" style={{marginBottom:28}}>
        <SplashPot size={244}/>
      </div>

      <div className="u2" style={{fontFamily:"Plus Jakarta Sans",fontSize:54,fontWeight:800,color:P.navy,letterSpacing:"-2.5px",lineHeight:1,marginBottom:12,textAlign:"center"}}>olla</div>
      <div className="u3" style={{fontFamily:"Plus Jakarta Sans",fontSize:17,fontWeight:500,color:P.muted,textAlign:"center",lineHeight:1.6}}>Todo suma.</div>
      <div style={{position:"absolute",bottom:36,fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:600,color:P.border,letterSpacing:"1.5px",textTransform:"uppercase"}}>tocá para continuar</div>
    </div>
  );
}

// ── OB1: Concepto ─────────────────────────────────────────────────────────────
function OB1Concepto({onNext}) {
  return (
    <div style={{height:"100%",background:P.bg,display:"flex",flexDirection:"column",padding:"28px 28px 36px"}}>
      {/* Nav row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:36}}>
        <span style={{fontFamily:"Plus Jakarta Sans",fontSize:14,fontWeight:800,color:P.navy}}>olla</span>
        <Dots step={1} total={6}/>
        <div style={{width:36}}/>
      </div>

      {/* Content */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:0}}>

        {/* Label */}
        <div className="u1" style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:700,color:P.cel,letterSpacing:"3px",textTransform:"uppercase",marginBottom:12}}>
          Hoy en Buenos Aires
        </div>

        {/* Hero number */}
        <div className="u1" style={{display:"flex",alignItems:"flex-start",gap:4,marginBottom:6}}>
          <span style={{fontFamily:"Plus Jakarta Sans",fontSize:80,fontWeight:800,color:P.yellow,lineHeight:.9,letterSpacing:"-4px"}}>+</span>
          <span style={{fontFamily:"Plus Jakarta Sans",fontSize:80,fontWeight:800,color:P.cel,lineHeight:.9,letterSpacing:"-4px"}}>200</span>
        </div>

        {/* Descriptor */}
        <div className="u2" style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:500,color:P.navySoft,lineHeight:1.5,marginBottom:28}}>
          comedores cocinan solos, sin visibilidad<br/>y sin apoyo organizado.
        </div>

        {/* Mini stats — no boxes, just numbers with a thin rule */}
        <div className="u2" style={{marginBottom:28}}>
          <div style={{height:1,background:P.border,marginBottom:18}}/>
          <div style={{display:"flex",alignItems:"flex-start",gap:0}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:30,fontWeight:800,color:P.cel,lineHeight:1,letterSpacing:"-1.5px"}}>600K</div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:P.muted,marginTop:3,lineHeight:1.4}}>raciones por mes<br/>en CABA</div>
            </div>
            <div style={{width:1,background:P.border,alignSelf:"stretch",margin:"0 20px"}}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:30,fontWeight:800,color:P.navy,lineHeight:1,letterSpacing:"-1.5px"}}>15%</div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:P.muted,marginTop:3,lineHeight:1.4}}>de la demanda<br/>queda sin cubrir</div>
            </div>
          </div>
          <div style={{height:1,background:P.border,marginTop:18}}/>
        </div>

        {/* Callout */}
        <div className="u3" style={{paddingLeft:16,borderLeft:`3px solid ${P.cel}`}}>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:14,fontWeight:500,color:P.navySoft,lineHeight:1.65}}>
            Con una ayuda mínima podés apadrinar y ayudar a que más personas coman.
          </div>
        </div>

      </div>

      {/* CTA */}
      <button className="u4 btn-y" onClick={onNext} style={{width:"100%",padding:"18px",background:P.yellow,color:P.navy,border:"none",borderRadius:18,fontFamily:"Plus Jakarta Sans",fontSize:17,fontWeight:700,cursor:"pointer",marginTop:24,letterSpacing:"-.2px"}}>
        Quiero ayudar
      </button>
    </div>
  );
}

// ── OB2: Monto — SCROLL FIXED ─────────────────────────────────────────────────
function OB2Monto({onNext, onBack, data, setData}) {
  const [sel, setSel] = useState(data.monto||1000);
  const [customAmt, setCustomAmt] = useState('');

  const OPTIONS = [
    ...MONTOS,
    {val:'custom', label:'Personalizado', food:'Ingresá el monto que puedas'},
  ];

  const getDisplayLabel = () => {
    if (sel === 'custom') {
      return customAmt ? `$${parseInt(customAmt).toLocaleString('es-AR')}` : 'tu monto';
    }
    return MONTOS.find(m=>m.val===sel)?.label || '$1.000';
  };

  const canContinue = sel !== 'custom' || customAmt.length > 0;

  return (
    <div style={{height:"100%",background:P.bg,display:"flex",flexDirection:"column"}}>

      {/* Fixed header */}
      <div style={{padding:"28px 28px 0",flexShrink:0}}>
        <OBHeader step={2} onBack={onBack}/>
        <div className="u1">
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:700,color:P.cel,letterSpacing:"3px",textTransform:"uppercase",marginBottom:10}}>Paso 2 de 6</div>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:22,fontWeight:700,color:P.navy,lineHeight:1.2,marginBottom:6}}>¿Cuánto podés aportar<br/>por semana?</div>
        </div>
      </div>

      {/* Scrollable */}
      <div style={{flex:1,overflowY:"auto",padding:"20px 28px 12px"}}>

        {/* Amount list — grouped, iOS-style */}
        <div className="u2" style={{border:`1.5px solid ${P.border}`,borderRadius:16,overflow:"hidden",marginBottom:16}}>
          {OPTIONS.map((m, i) => {
            const isSelected = sel === m.val;
            return (
              <button key={m.val} onClick={()=>setSel(m.val)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:14,
                padding:"13px 16px",
                background: isSelected ? P.celLight : P.bg,
                border:"none",
                borderBottom: i < OPTIONS.length-1 ? `1px solid ${P.border}` : "none",
                cursor:"pointer", textAlign:"left", transition:"background .15s"
              }}>
                {/* Radio dot */}
                <div style={{
                  width:18, height:18, borderRadius:9, flexShrink:0,
                  border:`2px solid ${isSelected ? P.cel : P.border}`,
                  background: isSelected ? P.cel : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .15s"
                }}>
                  {isSelected && <div style={{width:6,height:6,borderRadius:3,background:P.bg}}/>}
                </div>

                {/* Text */}
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:isSelected?P.celDark:P.navy,lineHeight:1}}>{m.label}</div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:P.muted,marginTop:3}}>{m.food}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom input — appears when Personalizado is selected */}
        {sel === 'custom' && (
          <div className="fi" style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:0,border:`1.5px solid ${P.cel}`,borderRadius:14,overflow:"hidden",background:P.celLight}}>
              <div style={{padding:"12px 14px",fontFamily:"Plus Jakarta Sans",fontSize:16,fontWeight:700,color:P.celDark}}>$</div>
              <input
                type="number"
                placeholder="0"
                value={customAmt}
                onChange={e=>setCustomAmt(e.target.value)}
                style={{
                  flex:1, border:"none", outline:"none", padding:"12px 0",
                  fontFamily:"Plus Jakarta Sans", fontSize:20, fontWeight:800,
                  color:P.navy, background:"transparent",
                }}
              />
            </div>
          </div>
        )}

        {/* Clarification */}
        <div className="u3" style={{display:"flex",gap:10,alignItems:"flex-start",padding:"4px 0"}}>
          <span style={{fontSize:15,flexShrink:0,marginTop:1}}>🏦</span>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:400,color:P.muted,lineHeight:1.65}}>
            El aporte lo hacés vos, con tu banco. Nosotros solo te recordamos y te acompañamos en el proceso.
          </div>
        </div>

      </div>

      {/* Fixed CTA */}
      <div style={{padding:"12px 28px 36px",flexShrink:0}}>
        <button
          className="btn-y"
          onClick={()=>{
            const finalVal = sel === 'custom' ? (parseInt(customAmt)||0) : sel;
            setData(d=>({...d,monto:finalVal}));
            onNext();
          }}
          disabled={!canContinue}
          style={{
            width:"100%", padding:"17px",
            background: canContinue ? P.yellow : P.border,
            color: canContinue ? P.navy : P.muted,
            border:"none", borderRadius:18,
            fontFamily:"Plus Jakarta Sans", fontSize:16, fontWeight:700,
            cursor: canContinue ? "pointer" : "default", transition:"all .2s"
          }}
        >
          Seguir con {getDisplayLabel()}
        </button>
      </div>
    </div>
  );
}

// ── OB3: Zona — COMUNAS CABA ──────────────────────────────────────────────────
function OB3Zona({onNext, onBack, data, setData}) {
  const [sel, setSel]     = useState(data.zona||null);
  const [query, setQuery] = useState('');

  const filtered = COMUNAS.filter(c => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.short.toLowerCase().includes(q)   ||
      c.barrios.toLowerCase().includes(q) ||
      `${c.num}`.includes(q)              ||
      `comuna ${c.num}`.includes(q)
    );
  });

  const selComuna = COMUNAS.find(c => c.id === sel);

  return (
    <div style={{height:"100%",background:P.bg,display:"flex",flexDirection:"column"}}>

      {/* Fixed header */}
      <div style={{padding:"28px 28px 16px",flexShrink:0}}>
        <OBHeader step={3} onBack={onBack}/>
        <div className="u1" style={{marginBottom:16}}>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:700,color:P.cel,letterSpacing:"3px",textTransform:"uppercase",marginBottom:10}}>Paso 3 de 6</div>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:22,fontWeight:700,color:P.navy,lineHeight:1.2,marginBottom:5}}>¿En qué barrio estás?</div>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:P.muted,lineHeight:1.5}}>Te mostramos los comedores más cercanos a vos.</div>
        </div>

        {/* Search input */}
        <div className="u2" style={{display:"flex",alignItems:"center",gap:10,background:P.bgSoft,border:`1.5px solid ${sel?P.cel:P.border}`,borderRadius:14,padding:"11px 14px",marginBottom:16,transition:"border-color .2s"}}>
          <span style={{fontSize:15,opacity:.45}}>🔍</span>
          <input
            type="text"
            placeholder="Barrio o número de comuna..."
            value={query}
            onChange={e=>setQuery(e.target.value)}
            style={{flex:1,border:"none",outline:"none",fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:500,color:P.navy,background:"transparent"}}
          />
          {query && (
            <button onClick={()=>setQuery('')} style={{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:16,lineHeight:1,padding:0}}>×</button>
          )}
        </div>
      </div>

      {/* Scrollable commune list */}
      <div style={{flex:1,overflowY:"auto",padding:"4px 28px 12px"}}>
        {filtered.length===0 && (
          <div style={{textAlign:"center",padding:"32px 0",fontFamily:"Plus Jakarta Sans",fontSize:13,color:P.muted}}>No encontramos esa zona.<br/>Probá con otro nombre.</div>
        )}
        <div style={{border:`1.5px solid ${P.border}`,borderRadius:16,overflow:"hidden"}}>
          {filtered.map((c, i) => {
            const isSelected = sel === c.id;
            return (
              <button key={c.id} onClick={()=>{setSel(c.id);setQuery('');}} style={{
                width:"100%", display:"flex", alignItems:"center", gap:12,
                padding:"13px 14px", background:isSelected?P.celLight:P.bg,
                border:"none", borderBottom:i<filtered.length-1?`1px solid ${P.border}`:"none",
                cursor:"pointer", textAlign:"left", transition:"background .15s"
              }}>
                {/* Comuna badge */}
                <div style={{
                  width:32, height:32, borderRadius:8, flexShrink:0,
                  background:isSelected?P.cel:P.bgSoft,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"background .15s"
                }}>
                  <span style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:800,color:isSelected?P.bg:P.muted}}>{c.num}</span>
                </div>

                {/* Name */}
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:14,fontWeight:700,color:isSelected?P.celDark:P.navy,lineHeight:1}}>{c.short}</div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:400,color:P.muted,marginTop:3,lineHeight:1.3}}>{c.barrios}</div>
                </div>

                {/* Comedores count */}
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:800,color:isSelected?P.celDark:P.navySoft}}>{c.comedores}</div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:500,color:P.muted,marginTop:2}}>comedores</div>
                </div>

                {isSelected && <span style={{color:P.cel,fontSize:14,flexShrink:0}}>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Confirmation pill when selected */}
        {selComuna && (
          <div className="fi" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:P.celLight,borderRadius:12,marginTop:12}}>
            <span style={{fontSize:14}}>📍</span>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:600,color:P.celDark}}>
              {selComuna.comedores} comedores cerca de {selComuna.short}
            </div>
          </div>
        )}
      </div>

      {/* Fixed CTA */}
      <div style={{padding:"12px 28px 36px",flexShrink:0}}>
        <button onClick={()=>{if(!sel)return;setData(d=>({...d,zona:sel}));onNext();}} style={{
          width:"100%",padding:"17px",borderRadius:18,border:"none",
          fontFamily:"Plus Jakarta Sans",fontSize:16,fontWeight:700,cursor:sel?"pointer":"default",
          background:sel?P.yellow:P.border,color:sel?P.navy:P.muted,transition:"all .25s"
        }}>
          {selComuna ? `Ver comedores en ${selComuna.short}` : "Seleccioná tu zona"}
        </button>
      </div>
    </div>
  );
}

// ── OB4: Sugeridos ────────────────────────────────────────────────────────────
function OB4Sugeridos({onNext, onBack, data, setApadrinado}) {
  const list=(COMEDORES.filter(c=>c.zoneId===data.zona).length?COMEDORES.filter(c=>c.zoneId===data.zona):COMEDORES).slice(0,2);
  return (
    <div style={{height:"100%",background:P.bg,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"28px 20px 0",flexShrink:0}}>
        <div style={{padding:"0 8px"}}><OBHeader step={4} onBack={onBack}/></div>
        <div className="u1" style={{padding:"0 8px",marginBottom:20}}>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:700,color:P.cel,letterSpacing:"3px",textTransform:"uppercase",marginBottom:10}}>Paso 4 de 6</div>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:24,fontWeight:700,color:P.navy,lineHeight:1.15}}>Estos lugares<br/>te necesitan</div>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:P.muted,marginTop:8}}>Elegí uno. Podés cambiarlo cuando quieras.</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 20px 12px",display:"flex",flexDirection:"column",gap:14}}>
        {list.map((c,i)=>(
          <div key={c.id} style={{background:P.bg,border:`1.5px solid ${P.border}`,borderRadius:20,overflow:"hidden",animation:`fadeUp .38s ease ${i*.1}s both`,borderTop:`4px solid ${P.cel}`,flexShrink:0}}>
            <div style={{padding:"18px 18px 16px"}}>

              {/* Header: small static pot + name + zone */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{flexShrink:0}}>
                  <Pot fill={c.metaPct} size={42} strokeColor={P.navy} noSteam/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:P.navy}}>{c.name}</div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:P.muted,marginTop:2}}>{c.zone}</div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{display:"flex",marginBottom:16,borderTop:`1px solid ${P.border}`,borderBottom:`1px solid ${P.border}`,padding:"12px 0"}}>
                {[
                  {v:Math.round(c.bocas*4.3), l:"asistentes\npor mes"},
                  {v:c.diasActivos,           l:"días\nactivo"},
                  {v:c.padrinos,             l:"padrinos\nactivos"},
                ].map((s,j)=>(
                  <div key={j} style={{flex:1,textAlign:"center",borderRight:j<2?`1px solid ${P.border}`:"none"}}>
                    <div style={{fontFamily:"Plus Jakarta Sans",fontSize:22,fontWeight:800,color:P.cel,lineHeight:1}}>{s.v}</div>
                    <div style={{fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:600,color:P.muted,marginTop:4,whiteSpace:"pre-line",lineHeight:1.3}}>{s.l}</div>
                  </div>
                ))}
              </div>

              <button onClick={()=>{setApadrinado(c);onNext();}} style={{width:"100%",padding:"13px",background:P.yellow,color:P.navy,border:"none",borderRadius:14,fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,cursor:"pointer"}}>Apadrinar ❤️</button>
            </div>
          </div>
        ))}
        <div style={{textAlign:"center",padding:"4px 0 8px"}}>
          <span onClick={()=>{setApadrinado(null);onNext();}} style={{fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:500,color:P.muted,cursor:"pointer",textDecoration:"underline"}}>Ver todos los comedores →</span>
        </div>
      </div>
    </div>
  );
}

// ── OB5: Confirmación ─────────────────────────────────────────────────────────
function OB5Confirm({apadrinado, onFinish}) {
  const [show,setShow]=useState(false);
  const c=apadrinado||COMEDORES[0];
  useEffect(()=>{setTimeout(()=>setShow(true),700);},[]);

  const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
      <circle cx="8" cy="8" r="6.5" stroke="rgba(255,255,255,.65)" strokeWidth="1.5"/>
      <path d="M8 4.5V8L10.2 10.2" stroke="rgba(255,255,255,.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{height:"100%",background:P.cel,display:"flex",flexDirection:"column",padding:"32px 28px 40px",position:"relative",overflow:"hidden"}}>
      <Confetti/>

      <div style={{display:"flex",justifyContent:"center",position:"relative",zIndex:1,marginBottom:0}}>
        <Dots step={5} total={6} onDark/>
      </div>

      {/* Centered content */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1}}>
        <div className="float bounce-in" style={{marginBottom:40}}>
          <Pot fill={38} size={128} fillColor={P.yellow} strokeColor={P.bg} noSteam/>
        </div>

        <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.6)",letterSpacing:"3px",textTransform:"uppercase",marginBottom:16,textAlign:"center"}}>
          ¡Bienvenida al equipo!
        </div>

        <div style={{fontFamily:"Plus Jakarta Sans",fontSize:28,fontWeight:800,color:P.bg,lineHeight:1.15,textAlign:"center",marginBottom:32}}>
          Ahora sos padrino de<br/><span style={{color:P.yellow}}>{c.short}</span>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <ClockIcon/>
          <span style={{fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:500,color:"rgba(255,255,255,.65)"}}>Recordatorio cada lunes</span>
        </div>
      </div>

      {/* Buttons */}
      {show&&(
        <div className="u3" style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={onFinish} style={{width:"100%",padding:"17px",background:P.bg,color:P.navy,border:"none",borderRadius:18,fontFamily:"Plus Jakarta Sans",fontSize:16,fontWeight:700,cursor:"pointer"}}>
            Activar recordatorio semanal
          </button>
          <button onClick={onFinish} style={{width:"100%",padding:"15px",background:"rgba(255,255,255,.18)",color:P.bg,border:"none",borderRadius:18,fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,cursor:"pointer"}}>
            Seguir apadrinando
          </button>
          <button onClick={onFinish} style={{width:"100%",padding:"10px",background:"transparent",border:"none",fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:500,color:"rgba(255,255,255,.38)",cursor:"pointer"}}>
            Continuar sin recordatorio
          </button>
        </div>
      )}
    </div>
  );
}

// ── ExploreScreen ─────────────────────────────────────────────────────────────
function ExploreScreen({onSelect}) {
  const [q,setQ]=useState('');
  const [zone,setZone]=useState('Todas');
  const zones=['Todas','CABA','GBA Norte','GBA Sur','GBA Oeste'];
  const list=COMEDORES.filter(c=>{
    const qs=q.toLowerCase();
    return(!q||c.name.toLowerCase().includes(qs)||c.zone.toLowerCase().includes(qs))&&(zone==='Todas'||c.zone.includes(zone.replace('GBA ','')));
  });
  return (
    <div style={{height:"100%",overflowY:"auto",background:P.bg,padding:"24px 20px 8px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:600,color:P.muted,marginBottom:4}}>Buenos días ✦</div>
        <div style={{fontFamily:"Plus Jakarta Sans",fontSize:24,fontWeight:800,color:P.navy,lineHeight:1.15}}>Encontrá un lugar<br/>a quien apadrinar</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,background:P.bgSoft,border:`1.5px solid ${P.border}`,borderRadius:14,padding:"10px 14px",marginBottom:14}}>
        <span style={{fontSize:14,opacity:.4}}>🔍</span>
        <input type="text" placeholder="Nombre o zona..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,border:"none",outline:"none",fontFamily:"Plus Jakarta Sans",fontSize:13,color:P.navy,background:"transparent"}}/>
      </div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,marginBottom:20,scrollbarWidth:"none"}}>
        {zones.map(z=><button key={z} onClick={()=>setZone(z)} style={{flexShrink:0,padding:"6px 14px",borderRadius:20,cursor:"pointer",border:zone===z?"none":`1.5px solid ${P.border}`,background:zone===z?P.cel:P.bg,color:zone===z?P.bg:P.navySoft,fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:600}}>{z}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,paddingBottom:16}}>
        {list.map((c,i)=>(
          <div key={c.id} onClick={()=>onSelect(c)} style={{background:P.bg,border:`1.5px solid ${P.border}`,borderRadius:20,padding:"18px 18px 16px",cursor:"pointer",animation:`fadeUp .35s ease ${i*.07}s both`,borderLeft:`4px solid ${P.cel}`}}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
              <div style={{width:50,height:50,borderRadius:14,background:P.celLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{c.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:P.navy}}>{c.name}</div>
                  {c.verified&&<span style={{fontSize:11,color:P.cel}}>✓</span>}
                </div>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:P.muted}}>📍 {c.zone}</div>
              </div>
            </div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:12,color:P.navySoft,fontStyle:"italic",marginBottom:12}}>"{c.tagline}"</div>
            <div style={{display:"flex",gap:16,marginBottom:12}}>
              {[{v:c.bocas,l:"bocas/sem"},{v:c.diasActivos,l:"días activo"},{v:c.padrinos,l:"padrinos"}].map((s,j)=>(
                <div key={j}>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:20,fontWeight:800,color:P.cel,lineHeight:1}}>{s.v}</div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:600,color:P.muted,marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{height:4,background:P.celLight,borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${c.metaPct}%`,background:P.cel,borderRadius:2}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ProfileScreen ─────────────────────────────────────────────────────────────
function ProfileScreen({c,onBack,onApadrinar}) {
  const [copied,setCopied]=useState(false);
  const [tab,setTab]=useState('info');
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:P.bg}}>
      <div style={{flexShrink:0}}>
        <div style={{height:140,background:P.cel,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-12,bottom:-12,fontSize:96,opacity:.12,transform:"rotate(-10deg)"}}>{c.emoji}</div>
          <button onClick={onBack} style={{position:"absolute",top:14,left:16,background:"rgba(255,255,255,.2)",border:"none",borderRadius:20,padding:"5px 12px",color:P.bg,fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:600,cursor:"pointer"}}>← Volver</button>
          {c.verified&&<div style={{position:"absolute",top:14,right:16,display:"inline-flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.2)",borderRadius:20,padding:"4px 10px"}}><span style={{fontSize:10,color:P.bg}}>✓</span><span style={{fontFamily:"Plus Jakarta Sans",fontSize:11,color:P.bg,fontWeight:600}}>Verificado</span></div>}
        </div>
        <div style={{background:P.navy,padding:"14px 20px 18px",position:"relative"}}>
          <div style={{position:"absolute",top:-24,left:20,width:48,height:48,borderRadius:14,background:P.cel,border:`3px solid ${P.navy}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{c.emoji}</div>
          <div style={{paddingLeft:60}}>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:17,fontWeight:800,color:P.bg,lineHeight:1}}>{c.name}</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:"rgba(255,255,255,.4)",marginTop:2}}>📍 {c.zone} · {c.typeOrg}</div>
          </div>
        </div>
        <div style={{display:"flex",background:P.bg,borderBottom:`1.5px solid ${P.border}`}}>
          {[["info","Información"],["fotos","Galería"],["novedades","Novedades"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"12px 0",border:"none",background:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:tab===id?700:500,color:tab===id?P.cel:P.muted,borderBottom:tab===id?`2px solid ${P.cel}`:"2px solid transparent"}}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px 20px 0"}}>
        {tab==="info"&&<div style={{paddingBottom:100}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:P.border,borderRadius:14,overflow:"hidden",border:`1px solid ${P.border}`,marginBottom:24}}>
            {[{v:c.bocas,l:"bocas"},{v:c.diasActivos,l:"días activo"},{v:`${c.metaPct}%`,l:"meta"}].map((s,i)=>(
              <div key={i} style={{background:P.bg,textAlign:"center",padding:"14px 0"}}>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:22,fontWeight:800,color:P.cel}}>{s.v}</div>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:600,color:P.muted,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:24}}>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:16,fontWeight:700,color:P.navy,marginBottom:8}}>Su historia</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:"#3a4a5e",lineHeight:1.75}}>{c.description}</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,color:P.muted,marginTop:8}}>📅 Desde {c.founded} · {c.days}</div>
          </div>
          <div style={{marginBottom:24}}>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:16,fontWeight:700,color:P.navy,marginBottom:12}}>El equipo</div>
            {c.team.map((m,i)=>(
              <div key={i} style={{background:i===0?P.celLight:P.bgSoft,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,marginBottom:10,border:`1.5px solid ${i===0?P.cel:P.border}`}}>
                <div style={{width:40,height:40,borderRadius:20,background:P.cel,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{m.emoji}</div>
                <div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:600,color:P.navy}}>{m.name}</div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,color:P.muted}}>{m.rol} · {m.years} años</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:24}}>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:16,fontWeight:700,color:P.navy,marginBottom:10}}>Necesitan esta semana</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{c.alimentos.map(a=><div key={a} style={{background:P.bgSoft,border:`1.5px solid ${P.border}`,borderRadius:20,padding:"6px 14px",fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:500,color:P.navy}}>{a}</div>)}</div>
          </div>
          <div style={{background:P.navy,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>Alias Mercado Pago</div>
              <div style={{fontFamily:"monospace",fontSize:14,color:P.bg,fontWeight:500}}>{c.alias}</div>
            </div>
            <button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),1800);}} style={{background:copied?"#1B6B3A":P.yellow,border:"none",borderRadius:10,padding:"8px 14px",color:copied?P.bg:P.navy,fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:700,cursor:"pointer",transition:"background .2s"}}>{copied?"✓ Copiado":"Copiar"}</button>
          </div>
        </div>}
        {tab==="fotos"&&<div style={{paddingBottom:100}}>
          <div style={{borderRadius:16,overflow:"hidden",marginBottom:12,background:P.cel,height:130,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            <div style={{fontSize:54,opacity:.3,transform:"rotate(-8deg)"}}>{c.emoji}</div>
            <div style={{position:"absolute",bottom:8,left:12,background:"rgba(0,0,0,.35)",borderRadius:8,padding:"4px 10px"}}><div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:600,color:P.bg}}>📸 Foto principal</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:80}}>
            {[{emoji:"🍲",label:"La olla del martes"},{emoji:"🤝",label:"Voluntarios"},{emoji:"🌿",label:"Compras"},{emoji:"😊",label:"La comunidad"}].map((s,i)=>(
              <div key={i} style={{borderRadius:14,background:P.celLight,border:`1px solid ${P.border}`,aspectRatio:"1.35",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
                <div style={{fontSize:26}}>{s.emoji}</div>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:600,color:P.celDark,textAlign:"center",padding:"0 8px"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>}
        {tab==="novedades"&&<div style={{paddingBottom:100}}>
          {c.updates.map((upd,i)=>(
            <div key={i} style={{background:P.bg,border:`1.5px solid ${P.border}`,borderRadius:16,overflow:"hidden",marginBottom:12}}>
              {upd.hasPhoto&&<div style={{background:P.celLight,height:76,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>{upd.photo}</div>}
              <div style={{padding:"12px 14px"}}>
                <div style={{display:"flex",gap:7,marginBottom:5}}><span style={{fontSize:14}}>{upd.emoji}</span><span style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:P.muted}}>{upd.date}</span></div>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:"#3a4a5e",lineHeight:1.65}}>{upd.text}</div>
              </div>
            </div>
          ))}
        </div>}
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"12px 20px 20px",background:`linear-gradient(to top,${P.bg} 70%,transparent)`}}>
        <button onClick={onApadrinar} className="btn-y" style={{width:"100%",padding:"16px",background:P.yellow,color:P.navy,border:"none",borderRadius:18,fontFamily:"Plus Jakarta Sans",fontSize:17,fontWeight:700,cursor:"pointer"}}>Apadrinar este lugar ❤️</button>
      </div>
    </div>
  );
}

// ── MiOllaScreen ──────────────────────────────────────────────────────────────
// ── Real comedor photo ───────────────────────────────────────────────────────
const COMEDOR_PHOTO = "data:image/webp;base64,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ZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyc+CiAgPGRjOnRpdGxlPgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+byAtIDQ8L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+Um9zYXJpbyBNYXJpbmE8L3BkZjpBdXRob3I+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnhtcD0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyc+CiAgPHhtcDpDcmVhdG9yVG9vbD5DYW52YSAoUmVuZGVyZXIpIGRvYz1EQUdPLUlSd1kyUSB1c2VyPVVBRm5PTHJMTXJvIGJyYW5kPUVxdWlwbyBkZSBTT0NJQUwgQURNSU5TIHRlbXBsYXRlPTwveG1wOkNyZWF0b3JUb29sPgogPC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9J3InPz4A";
function ComedorPhoto() {
  return (
    <img
      src={COMEDOR_PHOTO}
      alt="Foto del comedor"
      style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 40%",display:"block"}}
    />
  );
}

function MiOllaScreen({apadrinado,goExplore}) {
  const [ayude,setAyude]=useState(false);
  const [showCelebra,setShowCelebra]=useState(false);
  const [semanas,setSemanas]=useState(apadrinado?1:0);
  const [newAchieve,setNewAchieve]=useState(null);
  const [copied,setCopied]=useState(false);
  const c=apadrinado;

  // Empty state
  if(!c) return (
    <div style={{height:"100%",background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",textAlign:"center"}}>
      <div style={{marginBottom:24,opacity:.55}}><Pot fill={0} size={120} strokeColor={P.navy} noSteam/></div>
      <div style={{fontFamily:"Plus Jakarta Sans",fontSize:22,fontWeight:800,color:P.navy,marginBottom:10,lineHeight:1.15}}>Tu olla todavía<br/>está vacía</div>
      <div style={{fontFamily:"Plus Jakarta Sans",fontSize:14,color:P.muted,lineHeight:1.65,marginBottom:32,maxWidth:260}}>Elegí un comedor para apadrinar y empezá a hacer la diferencia.</div>
      <button onClick={goExplore} className="btn-y" style={{padding:"16px 32px",background:P.yellow,color:P.navy,border:"none",borderRadius:18,fontFamily:"Plus Jakarta Sans",fontSize:16,fontWeight:700,cursor:"pointer"}}>Encontrar un comedor</button>
    </div>
  );

  const handleAyude=()=>{
    if(ayude)return;
    setAyude(true);
    setSemanas(s=>s+1);
    if(semanas===0)setNewAchieve(ACHIEVEMENTS[0]);
    setShowCelebra(true);
  };

  const racionesTotales = semanas * c.bocas;
  const totalAporte = semanas * c.semanaAporte;

  const achieveData = [
    {
      ...ACHIEVEMENTS[0],
      unlocked: ayude||semanas>0,
      como:"Realizá tu primera colaboración semanal.",
      progress:null,
    },
    {
      ...ACHIEVEMENTS[1],
      unlocked: semanas>=4,
      como:"Ayudá 4 semanas consecutivas sin saltear.",
      progress:{current:Math.min(semanas,4), total:4},
    },
    {
      ...ACHIEVEMENTS[2],
      unlocked: semanas>=5,
      como:"Completá un mes completo de aportes.",
      progress:{current:Math.min(semanas,5), total:5},
    },
    {
      ...ACHIEVEMENTS[3],
      unlocked:false,
      como:"Apadriná un segundo comedor.",
      progress:null,
    },
    {
      ...ACHIEVEMENTS[4],
      unlocked:false,
      como:"Mantené 3 meses de aportes continuos.",
      progress:{current:Math.min(semanas,13), total:13},
    },
  ];

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:P.bg}}>

      {/* ── HEADER ── */}
      <div style={{background:P.cel,padding:"18px 20px 22px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:"3px",textTransform:"uppercase",marginBottom:4}}>Tu Olla</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:18,fontWeight:800,color:P.bg,lineHeight:1}}>{c.name}</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:"rgba(255,255,255,.4)",marginTop:3}}>{c.zone}</div>
          </div>
          <button style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:20,padding:"6px 12px",fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.6)",cursor:"pointer",marginTop:2}}>
            Cambiar
          </button>
        </div>
      </div>

      {/* ── STICKY BANNER (fixed, not scrollable) ── */}
      {!ayude ? (
        <div style={{background:P.bg,borderLeft:`3px solid ${P.yellow}`,padding:"12px 20px",flexShrink:0,display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:700,color:P.navy}}>Esta semana falta tu aporte</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:12,color:P.muted}}>${c.semanaAporte.toLocaleString("es-AR")} para {c.short}</div>
          </div>
        </div>
      ) : (
        <div style={{background:"#E8F7EE",borderLeft:"3px solid #1B6B3A",padding:"12px 20px",flexShrink:0,display:"flex",alignItems:"center",gap:10,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:700,color:"#1B4A2A"}}>Aportaste esta semana</div>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,color:"#2d7a50",marginLeft:"auto"}}>Próximo aviso el lunes</div>
        </div>
      )}

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none"}}>

        {/* IMPACTO — primero */}
        <div style={{margin:"16px 20px 0",border:`1.5px solid ${P.border}`,borderRadius:18,padding:"18px 16px"}}>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:700,color:P.muted,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:14}}>Tu impacto histórico</div>
          <div style={{display:"flex",gap:0}}>
            <div style={{flex:1,textAlign:"center",borderRight:`1px solid ${P.border}`}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:32,fontWeight:800,color:P.cel,lineHeight:1}}>{racionesTotales}</div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:600,color:P.muted,marginTop:5,lineHeight:1.3}}>raciones<br/>aportadas</div>
            </div>
            <div style={{flex:1,textAlign:"center",borderRight:`1px solid ${P.border}`}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:32,fontWeight:800,color:P.navy,lineHeight:1}}>{semanas}</div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:600,color:P.muted,marginTop:5,lineHeight:1.3}}>semanas<br/>activo</div>
            </div>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:32,fontWeight:800,color:P.navySoft,lineHeight:1}}>${(totalAporte/1000).toFixed(0)}K</div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:600,color:P.muted,marginTop:5,lineHeight:1.3}}>pesos<br/>canalizados</div>
            </div>
          </div>
        </div>

        {/* YA AYUDÉ */}
        <div style={{padding:"14px 20px 0"}}>
          {!ayude ? (
            <button className="btn-y" onClick={handleAyude} style={{width:"100%",padding:"18px",background:P.yellow,color:P.navy,border:"none",borderRadius:18,fontFamily:"Plus Jakarta Sans",fontSize:17,fontWeight:800,cursor:"pointer",letterSpacing:"-.2px"}}>
              Ya ayudé esta semana
            </button>
          ) : (
            <div style={{width:"100%",padding:"15px",background:"#E8F7EE",border:"2px solid #1B6B3A",borderRadius:18,textAlign:"center"}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:"#1B4A2A"}}>Aporte registrado esta semana</div>
            </div>
          )}
        </div>

        {/* NOVEDADES */}
        {c.updates[0]&&(
          <div style={{margin:"16px 20px 0",border:`1.5px solid ${P.border}`,borderRadius:18,overflow:"hidden"}}>
            <div style={{height:175,overflow:"hidden"}}>
              <ComedorPhoto/>
            </div>
            <div style={{padding:"13px 15px"}}>
              <div style={{display:"flex",gap:8,marginBottom:7,alignItems:"center"}}>
                <span style={{fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:700,color:P.navy}}>{c.representante.split(" ")[0]}</span>
                <span style={{fontFamily:"Plus Jakarta Sans",fontSize:11,color:P.muted}}>{c.updates[0].date}</span>
              </div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:"#3a4a5e",lineHeight:1.65}}>{c.updates[0].text}</div>
            </div>
          </div>
        )}

        {/* ALIAS */}
        <div style={{margin:"12px 20px 0",background:P.celLight,borderRadius:18,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",border:`1.5px solid ${P.cel}`}}>
          <div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:700,color:P.celDark,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:5}}>Transferí directo al comedor</div>
            <div style={{fontFamily:"monospace",fontSize:15,color:P.navy,fontWeight:700}}>{c.alias}</div>
          </div>
          <button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),1800);}} style={{background:copied?"#1B6B3A":P.yellow,border:"none",borderRadius:10,padding:"8px 14px",color:copied?P.bg:P.navy,fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:700,cursor:"pointer",transition:"background .2s",flexShrink:0}}>
            {copied?"✓ Copiado":"Copiar"}
          </button>
        </div>

        {/* SOBRE EL COMEDOR */}
        <div style={{margin:"12px 20px 0",padding:"16px",background:P.bg,borderRadius:18,border:`1.5px solid ${P.border}`}}>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:700,color:P.muted,letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:10}}>Sobre el comedor</div>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:"#3a4a5e",lineHeight:1.75,marginBottom:14}}>{c.description}</div>
          <div style={{height:1,background:P.border,marginBottom:14}}/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="11" rx="2" stroke={P.muted} strokeWidth="1.5"/>
              <path d="M1 6h14" stroke={P.muted} strokeWidth="1.5"/>
              <path d="M5 1v4M11 1v4" stroke={P.muted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:500,color:P.muted}}>{c.days}</span>
          </div>
          {c.telefono&&(
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 2.5C2 2.5 3 1 4.5 1c.5 0 1 .3 1.3.8L7 4c.3.5.2 1.2-.2 1.6l-.8.8c.5 1 1.6 2.1 2.6 2.6l.8-.8c.4-.4 1.1-.5 1.6-.2l2.2 1.2c.5.3.8.8.8 1.3 0 1.5-1.5 2.5-1.5 2.5C5 15 1 5 2 2.5z" stroke={P.muted} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:600,color:P.navySoft}}>{c.telefono}</span>
            </div>
          )}
        </div>

        {/* LOGROS — premium cards */}
        <div style={{padding:"24px 20px 8px"}}>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:800,color:P.navy,marginBottom:14}}>Tus logros</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {achieveData.map((a)=>(
              <div key={a.id} style={{
                background: a.unlocked ? P.bg : P.bgSoft,
                border: `1.5px solid ${a.unlocked ? P.border : "#e4eef6"}`,
                borderRadius:16, overflow:"hidden",
                opacity: a.unlocked ? 1 : 0.8,
              }}>
                <div style={{padding:"14px 16px",display:"flex",gap:14,alignItems:"flex-start"}}>
                  {/* Icon */}
                  <div style={{
                    width:44,height:44,borderRadius:12,flexShrink:0,
                    background: a.unlocked ? P.ylLight : P.bgSoft,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:22, filter: a.unlocked ? "none" : "grayscale(1)",
                    border:`1px solid ${a.unlocked?P.yellow:P.border}`
                  }}>{a.icon}</div>

                  {/* Content */}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                      <div style={{fontFamily:"Plus Jakarta Sans",fontSize:14,fontWeight:700,color:a.unlocked?P.navy:P.muted}}>{a.label}</div>
                      <div style={{
                        fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:700,
                        letterSpacing:"1.5px",textTransform:"uppercase",
                        color: a.unlocked ? "#1B6B3A" : P.muted,
                        padding:"2px 8px",borderRadius:20,
                        background: a.unlocked ? "#E8F7EE" : P.bgSoft,
                      }}>{a.unlocked ? "Desbloqueado" : "Bloqueado"}</div>
                    </div>
                    <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,color:a.unlocked?P.muted:"#9aabb8",lineHeight:1.5,marginBottom: a.progress ? 8 : 0}}>
                      {a.unlocked ? a.desc : a.como}
                    </div>
                    {/* Progress bar for locked with progress */}
                    {!a.unlocked && a.progress && (
                      <div>
                        <div style={{height:4,background:P.border,borderRadius:2,overflow:"hidden",marginBottom:3}}>
                          <div style={{height:"100%",width:`${(a.progress.current/a.progress.total)*100}%`,background:P.cel,borderRadius:2,transition:"width .6s ease"}}/>
                        </div>
                        <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,color:P.muted}}>{a.progress.current} de {a.progress.total}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PUNTOS SUMADOS */}
        <div style={{padding:"0 20px 8px"}}>
          <div style={{background:P.navy,borderRadius:18,padding:"20px 18px",overflow:"hidden",position:"relative"}}>
            <div style={{position:"absolute",right:-10,top:-10,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.45)",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:6}}>Tus puntos</div>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span style={{fontFamily:"Plus Jakarta Sans",fontSize:40,fontWeight:800,color:P.yellow,lineHeight:1}}>{semanas*50}</span>
                  <span style={{fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:600,color:"rgba(255,255,255,.5)"}}>pts</span>
                </div>
              </div>
              <div style={{background:"rgba(246,180,14,.12)",borderRadius:12,padding:"8px 12px",textAlign:"center"}}>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:700,color:P.yellow,letterSpacing:1,textTransform:"uppercase"}}>Por aporte</div>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:18,fontWeight:800,color:P.yellow}}>+50</div>
              </div>
            </div>
            <div style={{height:1,background:"rgba(255,255,255,.08)",marginBottom:12}}/>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:400,color:"rgba(255,255,255,.5)",lineHeight:1.6,marginBottom:14}}>
              Los puntos se acumulan con cada aporte semanal y podrán canjearse por premios de la ciudad.
            </div>
            <div style={{display:"flex",gap:8}}>
              {[
                {icon:"🏛️",label:"Museos"},
                {icon:"🚌",label:"Transporte"},
                {icon:"🎭",label:"Cultura"},
                {icon:"🌳",label:"Parques"},
              ].map((prize,i)=>(
                <div key={i} style={{flex:1,background:"rgba(255,255,255,.06)",borderRadius:10,padding:"8px 4px",textAlign:"center"}}>
                  <div style={{fontSize:16,marginBottom:3}}>{prize.icon}</div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:600,color:"rgba(255,255,255,.4)"}}>{prize.label}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:600,color:"rgba(255,255,255,.3)",letterSpacing:"1.5px",textTransform:"uppercase",textAlign:"center"}}>
              Próximamente disponible
            </div>
          </div>
        </div>

        <div style={{height:28}}/>
      </div>

      {/* CELEBRATION MODAL */}
      {showCelebra&&(
        <div style={{position:"absolute",inset:0,background:"rgba(10,20,40,.88)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}>
          <Confetti/>
          <div className="bounce-in" style={{background:P.bg,borderRadius:28,padding:"28px 24px",textAlign:"center",width:"100%",maxWidth:340,position:"relative",zIndex:101}}>
            <div style={{fontSize:44,marginBottom:8}}>🎉</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:26,fontWeight:800,color:P.navy,lineHeight:1.1,marginBottom:10}}>¡Gracias, Martina!</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:P.muted,lineHeight:1.7,marginBottom:18}}>
              Ayudaste a alimentar a <strong style={{color:P.navy}}>{Math.floor(c.bocas/5)} familias</strong> en {c.zone.split(",")[0]} esta semana.
            </div>
            <div style={{background:P.ylLight,borderRadius:16,padding:"14px",marginBottom:16,border:`1.5px solid ${P.yellow}`}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:700,color:P.ylDark,marginBottom:8}}>TUS ${c.semanaAporte.toLocaleString("es-AR")} EQUIVALEN A</div>
              <div style={{display:"flex",justifyContent:"space-around"}}>
                {[{e:"🌾",v:"3 kg",l:"arroz"},{e:"🥚",v:"×18",l:"huevos"},{e:"🍽️",v:"12",l:"raciones"}].map((item,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{fontSize:22}}>{item.e}</div>
                    <div style={{fontFamily:"Plus Jakarta Sans",fontSize:18,fontWeight:800,color:P.navy}}>{item.v}</div>
                    <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,color:P.muted}}>{item.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {newAchieve&&(
              <div className="achieve-pop" style={{background:P.ylLight,border:`2px solid ${P.yellow}`,borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:28}}>{newAchieve.icon}</div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:9,fontWeight:700,color:P.ylDark,letterSpacing:"1px",textTransform:"uppercase"}}>Nuevo logro</div>
                  <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:P.navy}}>{newAchieve.label}</div>
                </div>
              </div>
            )}
            <button onClick={()=>setShowCelebra(false)} style={{width:"100%",padding:"14px",background:P.navy,color:P.bg,border:"none",borderRadius:14,fontFamily:"Plus Jakarta Sans",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8}}>Cerrar</button>
            <button style={{background:"none",border:"none",fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:600,color:P.muted,cursor:"pointer"}}>Compartir mi impacto</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MiPerfilScreen ────────────────────────────────────────────────────────────
function MiPerfilScreen({apadrinado, onReset}) {
  const c=apadrinado;
  const [monto,setMonto]=useState(c?.semanaAporte||1500);
  const [showMonto,setShowMonto]=useState(false);
  return (
    <div style={{height:"100%",overflowY:"auto",background:P.bg}}>
      <div style={{background:P.navy,padding:"24px 24px 32px"}}>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <div style={{width:52,height:52,borderRadius:26,background:`linear-gradient(135deg,${P.cel},${P.yellow})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🙋</div>
          <div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:19,fontWeight:800,color:P.bg}}>Martina García</div>
            <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:500,color:"rgba(255,255,255,.4)"}}>Buenos Aires · desde 2025</div>
          </div>
        </div>
      </div>
      <div style={{padding:"0 20px 32px",marginTop:-16}}>
        <div style={{background:P.bg,borderRadius:20,padding:"20px",boxShadow:"0 4px 20px rgba(26,46,63,.07)",marginBottom:20,border:`1.5px solid ${P.border}`}}>
          <div style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:700,color:P.muted,letterSpacing:"3px",textTransform:"uppercase",marginBottom:16}}>Mi impacto total</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
            {[{v:"148",l:"raciones",emoji:"🍽️"},{v:"12",l:"familias",emoji:"👨‍👩‍👧"},{v:"1",l:"semana",emoji:"📅"}].map((s,i)=>(
              <div key={i} style={{textAlign:"center",paddingBottom:4,borderRight:i<2?`1px solid ${P.border}`:"none"}}>
                <div style={{fontSize:22,marginBottom:5}}>{s.emoji}</div>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:24,fontWeight:800,color:P.cel}}>{s.v}</div>
                <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,fontWeight:600,color:P.muted,marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:P.navy,marginBottom:10}}>Mi comedor</div>
        {c?(
          <div style={{background:P.bg,border:`1.5px solid ${P.border}`,borderRadius:18,padding:"16px",marginBottom:20,display:"flex",gap:14,alignItems:"center"}}>
            <div style={{flexShrink:0}}><Pot fill={20} size={48} strokeColor={P.navy}/></div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:P.navy}}>{c.name}</div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:11,color:P.muted,marginBottom:7}}>{c.zone}</div>
              <div style={{display:"flex",gap:3}}>{Array.from({length:8},(_,i)=><div key={i} style={{width:14,height:14,borderRadius:4,background:i<1?P.cel:P.celLight}}/>)}</div>
            </div>
          </div>
        ):(
          <div style={{background:P.bgSoft,borderRadius:16,padding:16,marginBottom:20,textAlign:"center"}}><div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:P.muted}}>No apadrinás ningún comedor todavía</div></div>
        )}
        <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:P.navy,marginBottom:10}}>Mis logros</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:20}}>
          {ACHIEVEMENTS.map((a,i)=>(
            <div key={a.id} style={{background:i===0?P.bg:P.bgSoft,border:`1.5px solid ${i===0?P.border:"#e4eef6"}`,borderRadius:14,padding:"10px 4px",textAlign:"center",opacity:i===0?1:.32}}>
              <div style={{fontSize:18,marginBottom:3,filter:i===0?"none":"grayscale(1)"}}>{a.icon}</div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:8,fontWeight:700,color:P.navy,lineHeight:1.3}}>{a.label}</div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:"Plus Jakarta Sans",fontSize:15,fontWeight:700,color:P.navy,marginBottom:10}}>Configuración</div>
        <div style={{background:P.bg,borderRadius:16,border:`1.5px solid ${P.border}`,overflow:"hidden",marginBottom:14}}>
          {[{l:"Monto semanal",v:`$${monto.toLocaleString("es-AR")}`,a:()=>setShowMonto(!showMonto)},{l:"Recordatorio",v:"Lunes · 9hs",a:null},{l:"Notificaciones",v:"Activadas 🔔",a:null}].map((row,i)=>(
            <div key={i} onClick={row.a||undefined} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:i<2?`1px solid ${P.border}`:"none",cursor:row.a?"pointer":"default"}}>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:500,color:P.navy}}>{row.l}</div>
              <div style={{fontFamily:"Plus Jakarta Sans",fontSize:13,color:P.muted,display:"flex",alignItems:"center",gap:4}}>{row.v}{row.a&&<span>›</span>}</div>
            </div>
          ))}
        </div>
        {showMonto&&(
          <div className="fi" style={{background:P.bg,borderRadius:14,border:`1.5px solid ${P.border}`,padding:14,marginBottom:14}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {MONTOS.map(m=><button key={m.val} onClick={()=>{setMonto(m.val);setShowMonto(false);}} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${monto===m.val?P.yellow:P.border}`,background:monto===m.val?P.yellow:P.bg,color:P.navy,fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:700,cursor:"pointer"}}>{m.label}</button>)}
            </div>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button style={{width:"100%",padding:"14px",background:P.yellow,color:P.navy,border:"none",borderRadius:16,fontFamily:"Plus Jakarta Sans",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>📤 Compartir mi impacto</button>
          <button style={{width:"100%",padding:"12px",background:"transparent",color:P.muted,border:`1px solid ${P.border}`,borderRadius:16,fontFamily:"Plus Jakarta Sans",fontSize:13,cursor:"pointer"}}>Acerca de Olla</button>
          <button onClick={onReset} style={{width:"100%",padding:"11px",background:"transparent",color:"#ccc",border:"none",borderRadius:16,fontFamily:"Plus Jakarta Sans",fontSize:12,cursor:"pointer",marginTop:4}}>Reiniciar app</button>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
// ── Estilos mobile-first ──────────────────────────────────────────────────────
const MOBILE_STYLES = `
  * { -webkit-tap-highlight-color: transparent; }
  body { margin:0; overflow:hidden; }
  @media (max-width: 480px) {
    .olla-outer { background:#fff !important; padding:0 !important; align-items:flex-start !important; min-height:100dvh !important; }
    .olla-frame { max-width:100% !important; width:100% !important; height:100dvh !important; max-height:100dvh !important; border-radius:0 !important; box-shadow:none !important; }
  }
`;

// ── localStorage helpers ───────────────────────────────────────────────────────
function lsGet(key, fallback=null) {
  try { const v=localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function lsDel(key) {
  try { localStorage.removeItem(key); } catch {}
}

export default function App() {
  // Inicializar desde localStorage — si ya hizo onboarding, va directo a mi_olla
  const [screen, setScreen]       = useState(() => lsGet('olla_screen', 'ob0'));
  const [ob, setOb]               = useState(() => lsGet('olla_ob', {monto:1000, zona:null}));
  const [apadrinado, setApadrinado] = useState(() => lsGet('olla_comedor', null));
  const [profileC, setProfileC]   = useState(null);
  const [tab, setTab]             = useState('mi_olla');

  // Inyectar estilos globales
  useEffect(()=>{
    const s1=document.createElement('style'); s1.textContent=STYLES; document.head.appendChild(s1);
    const s2=document.createElement('style'); s2.textContent=MOBILE_STYLES; document.head.appendChild(s2);
    return()=>{ document.head.removeChild(s1); document.head.removeChild(s2); };
  },[]);

  // Persistir en localStorage cuando cambia algo relevante
  useEffect(()=>{ if(!screen.startsWith('ob')) lsSet('olla_screen', screen); },[screen]);
  useEffect(()=>{ if(apadrinado) lsSet('olla_comedor', apadrinado); },[apadrinado]);
  useEffect(()=>{ lsSet('olla_ob', ob); },[ob]);

  const go=(sc,opts={})=>{ setScreen(sc); if(opts.tab!==undefined) setTab(opts.tab); };
  const isOb=screen.startsWith('ob');
  const showNav=!isOb&&screen!=='profile';
  const statusLight=screen==='ob5'||screen==='mi_olla'||screen==='mi_perfil'||screen==='profile';

  // Reset (para testear onboarding de nuevo)
  const reset=()=>{ lsDel('olla_screen'); lsDel('olla_comedor'); lsDel('olla_ob'); window.location.reload(); };

  return (
    <div className="olla-outer" style={{minHeight:"100dvh",height:"100dvh",background:"#0A1628",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",fontFamily:"Plus Jakarta Sans, sans-serif"}}>
      <div className="olla-frame" style={{width:"100%",maxWidth:390,height:"calc(100dvh - 40px)",maxHeight:790,background:P.bg,borderRadius:46,overflow:"hidden",boxShadow:"0 40px 120px rgba(0,0,0,.7),inset 0 0 0 1px rgba(255,255,255,.05)",display:"flex",flexDirection:"column",position:"relative"}}>

        {/* Status bar */}
        <div style={{background:statusLight?P.navy:P.bg,padding:"11px 24px 7px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,transition:"background .3s ease",borderBottom:statusLight?"none":`1px solid ${P.border}`}}>
          <span style={{fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:600,color:statusLight?"rgba(255,255,255,.7)":P.muted}}>9:41</span>
          <div style={{width:120,height:28,background:statusLight?"rgba(255,255,255,.1)":P.bgSoft,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"Plus Jakarta Sans",fontSize:14,fontWeight:800,color:statusLight?P.bg:P.navy,letterSpacing:"-1px"}}>olla</span>
          </div>
          <span style={{fontFamily:"Plus Jakarta Sans",fontSize:11,color:statusLight?"rgba(255,255,255,.6)":P.muted}}>●●●</span>
        </div>

        {/* Screens */}
        <div style={{flex:1,overflow:"hidden",position:"relative"}}>
          {screen==='ob0'&&<OB0Splash onNext={()=>go('ob1')}/>}
          {screen==='ob1'&&<OB1Concepto onNext={()=>go('ob2')}/>}
          {screen==='ob2'&&<OB2Monto onNext={()=>go('ob3')} onBack={()=>go('ob1')} data={ob} setData={setOb}/>}
          {screen==='ob3'&&<OB3Zona onNext={()=>go('ob4')} onBack={()=>go('ob2')} data={ob} setData={setOb}/>}
          {screen==='ob4'&&<OB4Sugeridos onNext={()=>go('ob5')} onBack={()=>go('ob3')} data={ob} setApadrinado={c=>setApadrinado(c)}/>}
          {screen==='ob5'&&<OB5Confirm apadrinado={apadrinado} onFinish={()=>go('mi_olla',{tab:'mi_olla'})}/>}
          {screen==='explore'&&<ExploreScreen onSelect={c=>{setProfileC(c);go('profile');}}/>}
          {screen==='profile'&&profileC&&<ProfileScreen c={profileC} onBack={()=>go('explore',{tab:'explore'})} onApadrinar={()=>{setApadrinado(profileC);go('mi_olla',{tab:'mi_olla'});}}/>}
          {screen==='mi_olla'&&<MiOllaScreen apadrinado={apadrinado} goExplore={()=>go('explore',{tab:'explore'})}/>}
          {screen==='mi_perfil'&&<MiPerfilScreen apadrinado={apadrinado} onReset={reset}/>}
        </div>

        {/* Bottom nav */}
        {showNav&&(
          <div style={{background:P.bg,borderTop:`1px solid ${P.border}`,padding:"8px 0 16px",display:"flex",flexShrink:0}}>
            {[{id:'explore',icon:'🔍',label:'Explorar',sc:'explore'},{id:'mi_olla',icon:'🍲',label:'Mi Olla',sc:'mi_olla'},{id:'mi_perfil',icon:'👤',label:'Mi Perfil',sc:'mi_perfil'}].map(t=>(
              <button key={t.id} onClick={()=>go(t.sc,{tab:t.id})} style={{flex:1,border:"none",background:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"5px 0",opacity:tab===t.id?1:.28}}>
                <span style={{fontSize:20}}>{t.icon}</span>
                <span style={{fontFamily:"Plus Jakarta Sans",fontSize:10,fontWeight:tab===t.id?700:500,color:tab===t.id?P.navy:P.muted}}>{t.label}</span>
                {tab===t.id&&<div style={{width:20,height:3,borderRadius:2,background:P.yellow,marginTop:1}}/>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
