function toSubscript(n) {
  const map={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
  return String(n).split('').map(c=>map[c]||c).join('');
}

// Parse formula string with _ for sub, ^ for super
function parseFormulaString(raw) {
  // e.g. "H_2O" => "H₂O", "Fe^3+" => "Fe³⁺"
  let result='';
  let i=0;
  while(i<raw.length){
    if(raw[i]==='_'){
      let num='';
      i++;
      while(i<raw.length && /[0-9]/.test(raw[i])){ num+=raw[i]; i++; }
      result+=toSubscript(num||'');
    } else if(raw[i]==='^'){
      let num='';
      i++;
      while(i<raw.length && /[0-9+\-]/.test(raw[i])){ num+=raw[i]; i++; }
      result+=toSuperscript(num||'');
    } else {
      result+=raw[i]; i++;
    }
  }
  return result;
}

// Auto-generate formula from atom array: e.g. ['H','H','O'] => 'H₂O'
function atomsToFormula(atomArr) {
  const count={};
  atomArr.forEach(s=>count[s]=(count[s]||0)+1);
  // Standard order: C first, H second, then alphabetical
  const order=Object.keys(count).sort((a,b)=>{
    const rank=s=>(s==='C'?0:s==='H'?1:2);
    return rank(a)!==rank(b)?rank(a)-rank(b):a.localeCompare(b);
  });
  return order.map(sym=>sym+(count[sym]>1?toSubscript(count[sym]):'')).join('');
}

// ── PERIODIC TABLE ────────────────────────────────────────────
const CAT_COLORS = {
  'Alcalino':'#ef5350','AlcalinoTérreo':'#ffa726','TransMetal':'#90a4ae',
  'PostTransición':'#78909c','Metaloide':'#66bb6a','NoMetal':'#64b5f6',
  'Halógeno':'#ab47bc','GasNoble':'#42a5f5','Lantánido':'#ff8a65',
  'Actínido':'#ffca28','Desconocido':'#555555',
};

const ELEMENTS=[
  {n:1,  sym:'H',  name:'Hidrógeno',  mass:1.008,   bonds:1, cat:'NoMetal',        r:13, color:'#64b5f6'},
  {n:2,  sym:'He', name:'Helio',      mass:4.003,   bonds:0, cat:'GasNoble',       r:12, color:'#42a5f5'},
  {n:3,  sym:'Li', name:'Litio',      mass:6.941,   bonds:1, cat:'Alcalino',       r:16, color:'#ef5350'},
  {n:4,  sym:'Be', name:'Berilio',    mass:9.012,   bonds:2, cat:'AlcalinoTérreo', r:14, color:'#ffa726'},
  {n:5,  sym:'B',  name:'Boro',       mass:10.811,  bonds:3, cat:'Metaloide',      r:14, color:'#66bb6a'},
  {n:6,  sym:'C',  name:'Carbono',    mass:12.011,  bonds:4, cat:'NoMetal',        r:15, color:'#78909c'},
  {n:7,  sym:'N',  name:'Nitrógeno',  mass:14.007,  bonds:3, cat:'NoMetal',        r:14, color:'#81c784'},
  {n:8,  sym:'O',  name:'Oxígeno',    mass:15.999,  bonds:2, cat:'NoMetal',        r:14, color:'#ef5350'},
  {n:9,  sym:'F',  name:'Flúor',      mass:18.998,  bonds:1, cat:'Halógeno',       r:13, color:'#ce93d8'},
  {n:10, sym:'Ne', name:'Neón',       mass:20.180,  bonds:0, cat:'GasNoble',       r:12, color:'#42a5f5'},
  {n:11, sym:'Na', name:'Sodio',      mass:22.990,  bonds:1, cat:'Alcalino',       r:17, color:'#ef5350'},
  {n:12, sym:'Mg', name:'Magnesio',   mass:24.305,  bonds:2, cat:'AlcalinoTérreo', r:16, color:'#ffa726'},
  {n:13, sym:'Al', name:'Aluminio',   mass:26.982,  bonds:3, cat:'PostTransición', r:16, color:'#b0bec5'},
  {n:14, sym:'Si', name:'Silicio',    mass:28.086,  bonds:4, cat:'Metaloide',      r:15, color:'#66bb6a'},
  {n:15, sym:'P',  name:'Fósforo',    mass:30.974,  bonds:5, cat:'NoMetal',        r:15, color:'#ffa726'},
  {n:16, sym:'S',  name:'Azufre',     mass:32.06,   bonds:2, cat:'NoMetal',        r:15, color:'#ffee58'},
  {n:17, sym:'Cl', name:'Cloro',      mass:35.453,  bonds:1, cat:'Halógeno',       r:15, color:'#ab47bc'},
  {n:18, sym:'Ar', name:'Argón',      mass:39.948,  bonds:0, cat:'GasNoble',       r:13, color:'#42a5f5'},
  {n:19, sym:'K',  name:'Potasio',    mass:39.098,  bonds:1, cat:'Alcalino',       r:18, color:'#ef5350'},
  {n:20, sym:'Ca', name:'Calcio',     mass:40.078,  bonds:2, cat:'AlcalinoTérreo', r:18, color:'#ffa726'},
  {n:21, sym:'Sc', name:'Escandio',   mass:44.956,  bonds:3, cat:'TransMetal',     r:17, color:'#90a4ae'},
  {n:22, sym:'Ti', name:'Titanio',    mass:47.867,  bonds:4, cat:'TransMetal',     r:17, color:'#90a4ae'},
  {n:23, sym:'V',  name:'Vanadio',    mass:50.942,  bonds:5, cat:'TransMetal',     r:16, color:'#90a4ae'},
  {n:24, sym:'Cr', name:'Cromo',      mass:51.996,  bonds:6, cat:'TransMetal',     r:16, color:'#90a4ae'},
  {n:25, sym:'Mn', name:'Manganeso',  mass:54.938,  bonds:7, cat:'TransMetal',     r:16, color:'#90a4ae'},
  {n:26, sym:'Fe', name:'Hierro',     mass:55.845,  bonds:3, cat:'TransMetal',     r:16, color:'#ff8a65'},
  {n:27, sym:'Co', name:'Cobalto',    mass:58.933,  bonds:3, cat:'TransMetal',     r:16, color:'#90a4ae'},
  {n:28, sym:'Ni', name:'Níquel',     mass:58.693,  bonds:2, cat:'TransMetal',     r:16, color:'#90a4ae'},
  {n:29, sym:'Cu', name:'Cobre',      mass:63.546,  bonds:2, cat:'TransMetal',     r:16, color:'#ffa726'},
  {n:30, sym:'Zn', name:'Zinc',       mass:65.38,   bonds:2, cat:'TransMetal',     r:16, color:'#90a4ae'},
  {n:31, sym:'Ga', name:'Galio',      mass:69.723,  bonds:3, cat:'PostTransición', r:16, color:'#b0bec5'},
  {n:32, sym:'Ge', name:'Germanio',   mass:72.630,  bonds:4, cat:'Metaloide',      r:15, color:'#66bb6a'},
  {n:33, sym:'As', name:'Arsénico',   mass:74.922,  bonds:5, cat:'Metaloide',      r:15, color:'#66bb6a'},
  {n:34, sym:'Se', name:'Selenio',    mass:78.971,  bonds:6, cat:'NoMetal',        r:15, color:'#64b5f6'},
  {n:35, sym:'Br', name:'Bromo',      mass:79.904,  bonds:1, cat:'Halógeno',       r:16, color:'#ab47bc'},
  {n:36, sym:'Kr', name:'Kriptón',    mass:83.798,  bonds:0, cat:'GasNoble',       r:14, color:'#42a5f5'},
  {n:37, sym:'Rb', name:'Rubidio',    mass:85.468,  bonds:1, cat:'Alcalino',       r:18, color:'#ef5350'},
  {n:38, sym:'Sr', name:'Estroncio',  mass:87.62,   bonds:2, cat:'AlcalinoTérreo', r:17, color:'#ffa726'},
  {n:39, sym:'Y',  name:'Ytrio',      mass:88.906,  bonds:3, cat:'TransMetal',     r:17, color:'#90a4ae'},
  {n:40, sym:'Zr', name:'Circonio',   mass:91.224,  bonds:4, cat:'TransMetal',     r:17, color:'#90a4ae'},
  {n:47, sym:'Ag', name:'Plata',      mass:107.868, bonds:1, cat:'TransMetal',     r:17, color:'#b0bec5'},
  {n:50, sym:'Sn', name:'Estaño',     mass:118.710, bonds:4, cat:'PostTransición', r:17, color:'#b0bec5'},
  {n:53, sym:'I',  name:'Yodo',       mass:126.904, bonds:1, cat:'Halógeno',       r:17, color:'#ab47bc'},
  {n:55, sym:'Cs', name:'Cesio',      mass:132.905, bonds:1, cat:'Alcalino',       r:19, color:'#ef5350'},
  {n:56, sym:'Ba', name:'Bario',      mass:137.327, bonds:2, cat:'AlcalinoTérreo', r:18, color:'#ffa726'},
  {n:78, sym:'Pt', name:'Platino',    mass:195.084, bonds:4, cat:'TransMetal',     r:16, color:'#b0bec5'},
  {n:79, sym:'Au', name:'Oro',        mass:196.967, bonds:1, cat:'TransMetal',     r:17, color:'#ffd54f'},
  {n:80, sym:'Hg', name:'Mercurio',   mass:200.59,  bonds:2, cat:'TransMetal',     r:18, color:'#90a4ae'},
  {n:82, sym:'Pb', name:'Plomo',      mass:207.2,   bonds:4, cat:'PostTransición', r:18, color:'#b0bec5'},
  {n:92, sym:'U',  name:'Uranio',     mass:238.029, bonds:6, cat:'Actínido',       r:18, color:'#ffca28'},
  {n:26, sym:'Fe', name:'Hierro',     mass:55.845,  bonds:3, cat:'TransMetal',     r:16, color:'#ff8a65'},
  // Lanthanides & Actinides selection
  {n:57, sym:'La', name:'Lantano',    mass:138.905, bonds:3, cat:'Lantánido',      r:18, color:'#ff8a65'},
  {n:58, sym:'Ce', name:'Cerio',      mass:140.116, bonds:4, cat:'Lantánido',      r:18, color:'#ff8a65'},
  {n:60, sym:'Nd', name:'Neodimio',   mass:144.242, bonds:3, cat:'Lantánido',      r:17, color:'#ff8a65'},
  {n:89, sym:'Ac', name:'Actinio',    mass:227,     bonds:3, cat:'Actínido',       r:18, color:'#ffca28'},
  {n:90, sym:'Th', name:'Torio',      mass:232.038, bonds:4, cat:'Actínido',       r:18, color:'#ffca28'},
  {n:94, sym:'Pu', name:'Plutonio',   mass:244,     bonds:4, cat:'Actínido',       r:18, color:'#ffca28'},
  // Special bio atoms
  {n:25, sym:'Mn', name:'Manganeso',  mass:54.938,  bonds:7, cat:'TransMetal',     r:16, color:'#90a4ae'},
  {n:27, sym:'Co', name:'Cobalto',    mass:58.933,  bonds:3, cat:'TransMetal',     r:16, color:'#90a4ae'},
  {n:12, sym:'Mg', name:'Magnesio',   mass:24.305,  bonds:2, cat:'AlcalinoTérreo', r:16, color:'#ffa726'},
];

// Deduplicate by sym
const seenSyms=new Set();
const ELEMENTS_UNIQ=ELEMENTS.filter(e=>{if(seenSyms.has(e.sym))return false;seenSyms.add(e.sym);return true;});

const ELEMENT_MAP={};
ELEMENTS_UNIQ.forEach(e=>{ELEMENT_MAP[e.sym]=e;});

// ── RECIPES ──────────────────────────────────────────────────
let RECIPES = [
  // INORGÁNICAS
  {cat:'Inorgánica', name:'H₂O',     atoms:['H','H','O'],                        color:'#64b5f6', desc:'Agua',                   func:'Solvente universal'},
  {cat:'Inorgánica', name:'CO₂',     atoms:['C','O','O'],                        color:'#90a4ae', desc:'Dióxido de carbono',     func:'Respiración celular'},
  {cat:'Inorgánica', name:'NH₃',     atoms:['N','H','H','H'],                    color:'#81c784', desc:'Amoníaco',               func:'Síntesis de proteínas'},
  {cat:'Inorgánica', name:'HCl',     atoms:['H','Cl'],                           color:'#ce93d8', desc:'Ácido clorhídrico',      func:'Digestión gástrica'},
  {cat:'Inorgánica', name:'NaCl',    atoms:['Na','Cl'],                          color:'#ef9a9a', desc:'Cloruro de sodio',       func:'Balance osmótico'},
  {cat:'Inorgánica', name:'H₂SO₄',  atoms:['H','H','S','O','O','O','O'],        color:'#ffee58', desc:'Ácido sulfúrico',        func:'Reacciones ácido-base'},
  {cat:'Inorgánica', name:'HNO₃',   atoms:['H','N','O','O','O'],               color:'#ef9a9a', desc:'Ácido nítrico',          func:'Síntesis de nitrogenados'},
  {cat:'Inorgánica', name:'H₃PO₄',  atoms:['H','H','H','P','O','O','O','O'],   color:'#ffa726', desc:'Ácido fosfórico',        func:'Metabolismo energético'},
  {cat:'Inorgánica', name:'NaOH',    atoms:['Na','O','H'],                       color:'#ef5350', desc:'Hidróxido de sodio',    func:'Base fuerte'},
  {cat:'Inorgánica', name:'KCl',     atoms:['K','Cl'],                           color:'#ef5350', desc:'Cloruro de potasio',    func:'Potencial de acción'},
  {cat:'Inorgánica', name:'CaCO₃',  atoms:['Ca','C','O','O','O'],              color:'#ce93d8', desc:'Carbonato de calcio',    func:'Formación ósea'},
  {cat:'Inorgánica', name:'H₂O₂',  atoms:['H','H','O','O'],                   color:'#64b5f6', desc:'Peróxido de hidrógeno',  func:'Estrés oxidativo'},
  {cat:'Inorgánica', name:'NO',     atoms:['N','O'],                            color:'#81c784', desc:'Monóxido de nitrógeno', func:'Vasodilatación'},
  {cat:'Inorgánica', name:'N₂O',   atoms:['N','N','O'],                        color:'#81c784', desc:'Óxido nitroso',         func:'Anestésico'},
  {cat:'Inorgánica', name:'CO',     atoms:['C','O'],                            color:'#90a4ae', desc:'Monóxido de carbono',   func:'Producto incompleto'},
  {cat:'Inorgánica', name:'SO₂',    atoms:['S','O','O'],                        color:'#ffee58', desc:'Dióxido de azufre',     func:'Producto metabólico'},
  // ORGÁNICA
  {cat:'Orgánica',   name:'CH₄',    atoms:['C','H','H','H','H'],               color:'#78909c', desc:'Metano',                func:'Combustión celular'},
  {cat:'Orgánica',   name:'C₂H₄',  atoms:['C','C','H','H','H','H'],           color:'#78909c', desc:'Etileno',               func:'Hormona vegetal'},
  {cat:'Orgánica',   name:'C₂H₂',  atoms:['C','C','H','H'],                   color:'#78909c', desc:'Acetileno',             func:'Triple enlace'},
  {cat:'Orgánica',   name:'CH₃OH', atoms:['C','H','H','H','O','H'],           color:'#b0bec5', desc:'Metanol',               func:'Solvente orgánico'},
  {cat:'Orgánica',   name:'C₂H₅OH',atoms:['C','C','H','H','H','H','H','O','H'],color:'#b0bec5',desc:'Etanol',               func:'Fermentación'},
  {cat:'Orgánica',   name:'C₃H₆O', atoms:['C','C','C','H','H','H','H','H','H','O'],color:'#b0bec5',desc:'Acetona',          func:'Cetogénesis'},
  {cat:'Orgánica',   name:'C₆H₁₂O₆',atoms:['C','C','C','C','C','C','H','H','H','H','H','H','O','O','O','O','O','O'],color:'#ffa726',desc:'Glucosa',func:'Fuente energética primaria'},
  // AMINOÁCIDOS
  {cat:'Aminoácidos',name:'Glicina',  atoms:['C','C','N','O','O','H','H','H','H','H'],          color:'#ce93d8', desc:'Gly – más simple',       func:'Síntesis de proteínas'},
  {cat:'Aminoácidos',name:'Alanina',  atoms:['C','C','C','N','O','O','H','H','H','H','H','H','H'],color:'#ce93d8',desc:'Ala',                   func:'Gluconeogénesis'},
  {cat:'Aminoácidos',name:'Cisteína', atoms:['C','C','C','N','O','O','S','H','H','H','H','H','H','H'],color:'#ce93d8',desc:'Cys',              func:'Puente disulfuro'},
  {cat:'Aminoácidos',name:'Metionina',atoms:['C','C','C','C','N','O','O','S','H','H','H','H','H','H','H','H','H'],color:'#ce93d8',desc:'Met',  func:'Inicio traducción'},
  // NUCLEÓTIDOS
  {cat:'Nucleótidos',name:'ATP',  atoms:['C','C','C','C','C','N','N','N','N','N','O','O','O','O','O','O','O','O','O','O','P','P','P','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H'],color:'#ffca28',desc:'Adenosín trifosfato',func:'Moneda energética celular'},
  {cat:'Nucleótidos',name:'ADP',  atoms:['C','C','C','C','C','N','N','N','N','N','O','O','O','O','O','O','O','P','P','H','H','H','H','H','H','H','H','H','H','H','H','H','H'],color:'#ffca28',desc:'Adenosín difosfato',func:'ATP gastado'},
  {cat:'Nucleótidos',name:'AMP',  atoms:['C','C','C','C','C','N','N','N','N','N','O','O','O','O','O','P','H','H','H','H','H','H','H','H','H','H','H','H'],color:'#ffca28',desc:'Adenosín monofosfato',func:'Señalización'},
  {cat:'Nucleótidos',name:'NADH', atoms:['C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','N','N','N','N','N','N','N','O','O','O','O','O','O','O','O','O','O','O','O','P','P','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H'],color:'#ffd54f',desc:'NADH reducido',func:'Cadena respiratoria'},
  // LÍPIDOS
  {cat:'Lípidos',    name:'Glicerol',atoms:['C','C','C','H','H','H','H','H','H','H','H','O','H','O','H','O','H'],color:'#81c784',desc:'Glicerol',func:'Base lípidos'},
  // VITAMINAS
  {cat:'Vitaminas',  name:'Vit-C',   atoms:['C','C','C','C','C','C','O','O','O','O','O','O','H','H','H','H','H','H','H','H'],color:'#a8ff3e',desc:'Ácido ascórbico',func:'Antioxidante, colágeno'},
  // HORMONAS
  {cat:'Hormonas',   name:'Adrenalina',atoms:['C','C','C','C','C','C','C','C','C','N','O','O','O','H','H','H','H','H','H','H','H','H','H','H','H','H'],color:'#ef5350',desc:'Epinefrina',func:'Respuesta de lucha/huida'},
  {cat:'Hormonas',   name:'Dopamina', atoms:['C','C','C','C','C','C','C','C','N','O','O','H','H','H','H','H','H','H','H','H','H','H','H'],color:'#64b5f6',desc:'Dopamina',func:'Neurotransmisor, recompensa'},
  {cat:'Hormonas',   name:'Serotonina',atoms:['C','C','C','C','C','C','C','C','C','C','N','N','O','H','H','H','H','H','H','H','H','H','H','H','H','H'],color:'#64b5f6',desc:'Serotonina',func:'Estado de ánimo, sueño'},
  // METABOLISMO
  {cat:'Metabolismo',name:'Piruvato', atoms:['C','C','C','O','O','O','H','H','H'],                 color:'#ffd54f', desc:'Ácido pirúvico',func:'Glucólisis, respiración'},
  {cat:'Metabolismo',name:'Lactato',  atoms:['C','C','C','O','O','O','H','H','H','H','H','H'],    color:'#ffd54f', desc:'Ácido láctico',func:'Fermentación anaerobia'},
  {cat:'Metabolismo',name:'Creatina', atoms:['C','C','C','N','N','N','O','O','H','H','H','H','H','H','H','H','H','H','H'],color:'#64b5f6',desc:'Creatina',func:'Reserva energética muscular'},
  {cat:'Metabolismo',name:'Citrato',  atoms:['C','C','C','C','C','C','O','O','O','O','O','O','O','H','H','H','H','H','H','H','H'],color:'#ffd54f',desc:'Ácido cítrico',func:'Ciclo de Krebs'},
  // PIGMENTOS
  {cat:'Pigmentos',  name:'Hemo',     atoms:['C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','C','N','N','N','N','Fe','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H','H'],color:'#ef5350',desc:'Grupo hemo',func:'Transporte de O₂'},
];

// ── CELL TYPES MAP ────────────────────────────────────────────
const CELL_TYPES_MAP = {
  'CO₂+H₂O':{name:'Célula Vegetal',   color:'#2e7d32',border:'#4caf50',desc:'Realiza fotosíntesis',life:100},
  'H₂O+CO₂':{name:'Célula Vegetal',   color:'#2e7d32',border:'#4caf50',desc:'Realiza fotosíntesis',life:100},
  'H₂O+NH₃':{name:'Célula Sanguínea', color:'#b71c1c',border:'#ef5350',desc:'Transporta O₂',       life:80},
  'NH₃+H₂O':{name:'Célula Sanguínea', color:'#b71c1c',border:'#ef5350',desc:'Transporta O₂',       life:80},
  'CO₂+NH₃':{name:'Célula Nerviosa',  color:'#0d47a1',border:'#42a5f5',desc:'Transmite señales',    life:120},
  'NH₃+CO₂':{name:'Célula Nerviosa',  color:'#0d47a1',border:'#42a5f5',desc:'Transmite señales',    life:120},
  'ATP+ADP': {name:'Célula Energética',color:'#e65100',border:'#ffa726',desc:'Alta actividad metabólica',life:150},
  'ADP+ATP': {name:'Célula Energética',color:'#e65100',border:'#ffa726',desc:'Alta actividad metabólica',life:150},
  'default': {name:'Célula Genérica',  color:'#4a148c',border:'#ab47bc',desc:'Célula multipotente',  life:90},
};

// ── STATE ─────────────────────────────────────────────────────
let atoms=[], molecules=[], cells=[];
let selected=null, dragging=null, dragOffX=0, dragOffY=0;
let selectedMolecules=new Set();
let animating=false, animFrame;
let viewLevel=1;
let idC=0;
const uid=()=>++idC;
let activeCat='Todos';
let ctxTarget=null;

// BOND MODE
let bondMode=false;
let bondFirstAtom=null;
let manualBonds=[];  // [{a1, a2}] for custom bonds outside molecules

// ATOM BUILDER (for new recipe form)
let abAtoms=[];  // array of sym strings

const canvas=document.getElementById('simCanvas');
const ctx=canvas.getContext('2d');
const blCanvas=document.getElementById('bondLine');
const blCtx=blCanvas.getContext('2d');
const wrap=document.getElementById('canvasWrap');

function resize(){
  canvas.width=wrap.clientWidth; canvas.height=wrap.clientHeight;
  blCanvas.style.position='absolute'; blCanvas.style.top='0'; blCanvas.style.left='0';
  blCanvas.width=wrap.clientWidth; blCanvas.height=wrap.clientHeight;
  blCanvas.style.width=wrap.clientWidth+'px'; blCanvas.style.height=wrap.clientHeight+'px';
  blCanvas.style.pointerEvents='none';
}
resize();
window.addEventListener('resize',()=>{resize();draw();});

// ── PANEL RESIZE ─────────────────────────────────────────────
(function setupPanelResize(){
  function makeResizable(panelId, handleId, side){
    const panel=document.getElementById(panelId);
    const handle=document.getElementById(handleId);
    let startX, startW;
    handle.addEventListener('mousedown', e=>{
      e.preventDefault();
      startX=e.clientX; startW=panel.offsetWidth;
      handle.classList.add('dragging');
      const onMove=e=>{
        const dx=side==='right'?e.clientX-startX:startX-e.clientX;
        const newW=Math.max(parseInt(panel.style.minWidth||150), Math.min(420, startW+dx));
        panel.style.width=newW+'px';
        resize(); draw();
      };
      const onUp=()=>{
        handle.classList.remove('dragging');
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('mouseup',onUp);
      };
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });
  }
  makeResizable('leftPanel','leftHandle','right');
  makeResizable('rightPanel','rightHandle','left');
})();

// ── ATOM PALETTE ─────────────────────────────────────────────
(function buildCatTabs(){
  const cats=['Todos',...new Set(ELEMENTS_UNIQ.map(e=>e.cat))];
  const tabsEl=document.getElementById('catTabs');
  cats.forEach(c=>{
    const d=document.createElement('div');
    d.className='cat-tab'+(c==='Todos'?' active':'');
    d.textContent=c;
    d.onclick=()=>{
      activeCat=c;
      document.querySelectorAll('.cat-tab').forEach(t=>t.classList.remove('active'));
      d.classList.add('active');
      renderAtomGrid();
    };
    tabsEl.appendChild(d);
  });
})();

function renderAtomGrid(filter=''){
  const grid=document.getElementById('atomGrid');
  const q=filter.toLowerCase();
  const list=ELEMENTS_UNIQ.filter(e=>{
    const matchCat=activeCat==='Todos'||e.cat===activeCat;
    const matchQ=!q||e.sym.toLowerCase().includes(q)||e.name.toLowerCase().includes(q);
    return matchCat&&matchQ;
  });
  grid.innerHTML='';
  list.forEach(el=>{
    const tile=document.createElement('div');
    tile.className='atom-tile'; tile.draggable=true;
    tile.title=`${el.name}\nMasa: ${el.mass} u\nEnlaces: ${el.bonds}`;
    tile.style.borderColor=el.color+'55';
    tile.innerHTML=`<div class="sym" style="color:${el.color}">${el.sym}</div><div class="num">${el.n}</div><div class="mass-t">${el.mass}</div>`;
    tile.addEventListener('dragstart', e=>e.dataTransfer.setData('atomType',el.sym));
    tile.addEventListener('click', ()=>addAtomCenter(el.sym));
    grid.appendChild(tile);
  });
}
renderAtomGrid();
function filterAtoms(){renderAtomGrid(document.getElementById('atomSearch').value);}

// Build quick grid for atom builder
function buildAbQuickGrid(){
  const grid=document.getElementById('abQuickGrid');
  grid.innerHTML='';
  // Show most common bio atoms first
  const common=['H','C','N','O','S','P','Na','K','Ca','Mg','Fe','Cl','Zn','Cu','Mn','Co','F','Br','I','Si'];
  common.forEach(sym=>{
    const el=ELEMENT_MAP[sym]; if(!el)return;
    const chip=document.createElement('div');
    chip.className='ab-chip';
    chip.style.color=el.color;
    chip.style.borderColor=el.color+'55';
    chip.textContent=sym;
    chip.title=el.name;
    chip.onclick=()=>abAddAtom(sym);
    grid.appendChild(chip);
  });
}
buildAbQuickGrid();

function abAddAtom(sym){
  abAtoms.push(sym);
  renderAbSelected();
  // Auto-generate formula name
  if(!document.getElementById('nr_name').value){
    document.getElementById('nr_name').value=atomsToFormula(abAtoms);
  }
}

function abRemoveAtom(idx){
  abAtoms.splice(idx,1);
  renderAbSelected();
}

function renderAbSelected(){
  const el=document.getElementById('abSelectedAtoms');
  if(!abAtoms.length){el.innerHTML='<span class="ab-empty">Ninguno</span>';return;}
  el.innerHTML=abAtoms.map((sym,i)=>{
    const e=ELEMENT_MAP[sym];
    return `<div class="ab-atom-tag" style="background:${e?.color||'#555'}22;border:1px solid ${e?.color||'#555'}55;color:${e?.color||'#ccc'}" onclick="abRemoveAtom(${i})">${sym}<span class="x">×</span></div>`;
  }).join('');
}

// ── DROP ON CANVAS ────────────────────────────────────────────
wrap.addEventListener('dragover',e=>e.preventDefault());
wrap.addEventListener('drop',e=>{
  e.preventDefault();
  const type=e.dataTransfer.getData('atomType'); if(!type)return;
  const r=canvas.getBoundingClientRect();
  addAtom(type,e.clientX-r.left,e.clientY-r.top);
});

function addAtomCenter(type){addAtom(type,100+Math.random()*200,100+Math.random()*200);}

function addAtom(type,x,y){
  const el=ELEMENT_MAP[type]; if(!el)return;
  atoms.push({id:uid(),type,x,y,vx:0,vy:0,r:el.r,color:el.color,sym:el.sym,
    name:el.name,mass:el.mass,maxBonds:el.bonds,bonds:0,inMol:null,cat:el.cat});
  draw();
  showStatus(`Átomo ${el.name} (${el.sym}) añadido`);
}

// ── SPAWN RECIPE TO CANVAS ────────────────────────────────────
function spawnRecipe(recipe){
  const cx=canvas.width/2+(Math.random()-.5)*160;
  const cy=canvas.height/2+(Math.random()-.5)*120;
  const n=recipe.atoms.length;
  const atomObjs=[];
  
  // Si hay muchos átomos (>12), mostrar como molécula compacta sin átomos individuales
  if(n>12){
    // Crear solo 1 átomo "representativo" para mantener la estructura
    const firstSym=recipe.atoms[0];
    const el=ELEMENT_MAP[firstSym];
    if(el){
      const a={id:uid(),type:firstSym,x:cx,y:cy,vx:0,vy:0,r:28,color:recipe.color,sym:'◉',
        name:recipe.name,mass:n*el.mass,maxBonds:0,bonds:0,inMol:null,cat:el.cat,isCompound:true};
      atoms.push(a);
      atomObjs.push(a);
    }
  } else {
    // Para moléculas pequeñas, mostrar todos los átomos dispersados
    recipe.atoms.forEach((sym,i)=>{
      const el=ELEMENT_MAP[sym]; if(!el)return;
      const ang=(i/n)*Math.PI*2;
      const rr=n<=2?28:n<=4?34:42;
      const x=cx+Math.cos(ang)*rr, y=cy+Math.sin(ang)*rr;
      const a={id:uid(),type:sym,x,y,vx:0,vy:0,r:el.r,color:el.color,sym:el.sym,
        name:el.name,mass:el.mass,maxBonds:el.bonds,bonds:0,inMol:null,cat:el.cat};
      atoms.push(a);
      atomObjs.push(a);
    });
  }
  
  // Form molecule immediately
  atomObjs.forEach(a=>a.inMol=true);
  const mol={id:uid(),name:recipe.name,desc:recipe.desc,func:recipe.func,
    atoms:atomObjs,cx,cy,color:recipe.color,cat:recipe.cat,isCompound:n>12};
  molecules.push(mol);
  addPulse(cx,cy);
  updateMoleculesList(); draw();
  showStatus(`✓ ${recipe.name} añadida al canvas — ${recipe.desc}`);
}

// ── DRAW ─────────────────────────────────────────────────────
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();
  drawManualBonds();
  drawCells();
  drawMolecules();
  drawAtoms();
  drawSelBoxes();
}

function drawGrid(){
  ctx.save();
  ctx.strokeStyle='rgba(255,255,255,0.03)'; ctx.lineWidth=1;
  const step=20;
  for(let x=0;x<canvas.width;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=0;y<canvas.height;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,0.04)';
  for(let x=0;x<canvas.width;x+=100)for(let y=0;y<canvas.height;y+=100){ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function drawManualBonds(){
  manualBonds.forEach(b=>{
    ctx.save();
    ctx.strokeStyle='rgba(255,213,79,0.5)'; ctx.lineWidth=2.5;
    ctx.setLineDash([6,3]);
    ctx.beginPath(); ctx.moveTo(b.a1.x,b.a1.y); ctx.lineTo(b.a2.x,b.a2.y); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  });
}

function drawAtoms(){
  atoms.forEach(a=>{if(!a.inMol)drawAtomShape(ctx,a,a===selected||a===bondFirstAtom,1);});
}

function drawAtomShape(c,a,hi,alpha=1){
  c.save();
  c.globalAlpha=alpha;
  if(hi){c.shadowColor=a===bondFirstAtom?'#ffd54f':a.color; c.shadowBlur=18;}
  const g=c.createRadialGradient(a.x-a.r*.3,a.y-a.r*.3,0,a.x,a.y,a.r);
  g.addColorStop(0,lighten(a.color,50)); g.addColorStop(1,a.color);
  c.beginPath(); c.arc(a.x,a.y,a.r,0,Math.PI*2);
  c.fillStyle=g; c.fill();
  c.strokeStyle=a===bondFirstAtom?'#ffd54f':(hi?'#ffffff':'rgba(255,255,255,0.2)');
  c.lineWidth=hi?2:.8;
  c.stroke();
  c.fillStyle='#000';
  c.font=`600 ${Math.max(9,a.r*.7)}px "IBM Plex Mono",monospace`;
  c.textAlign='center'; c.textBaseline='middle';
  c.fillText(a.sym,a.x,a.y);
  c.restore();
}

function drawMolecules(){
  molecules.forEach(mol=>{
    const isSel=selectedMolecules.has(mol.id);
    
    // Si es una molécula compuesta (muchos átomos), dibuja como círculo único
    if(mol.isCompound && mol.atoms.length===1){
      const a=mol.atoms[0];
      ctx.save();
      if(isSel){ctx.shadowColor='#3fb950';ctx.shadowBlur=18;}
      const g=ctx.createRadialGradient(a.x-a.r*.3,a.y-a.r*.3,0,a.x,a.y,a.r);
      g.addColorStop(0,lighten(a.color,50)); g.addColorStop(1,a.color);
      ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      ctx.strokeStyle=isSel?'#3fb950':'rgba(255,255,255,0.2)';
      ctx.lineWidth=isSel?2:.8;
      ctx.stroke();
      // Draw molecule name inside
      ctx.fillStyle='#000';
      ctx.font='600 11px "IBM Plex Mono",monospace';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(mol.name.substring(0,8),a.x,a.y);
      ctx.restore();
      return;
    }
    
    // Para moléculas normales, dibuja todos los átomos
    for(let i=0;i<mol.atoms.length-1;i++){
      const a1=mol.atoms[i], a2=mol.atoms[i+1];
      ctx.save();
      if(isSel){ctx.shadowColor='#3fb950';ctx.shadowBlur=8;}
      ctx.strokeStyle=isSel?'#3fb950':'rgba(255,255,255,0.4)';
      ctx.lineWidth=isSel?2.5:1.8;
      ctx.beginPath(); ctx.moveTo(a1.x,a1.y); ctx.lineTo(a2.x,a2.y); ctx.stroke();
      ctx.restore();
    }
    mol.atoms.forEach(a=>drawAtomShape(ctx,a,a===selected,1));
    // Formula label with subscripts (already in mol.name)
    const cx=mol.atoms.reduce((s,a)=>s+a.x,0)/mol.atoms.length;
    const minY=Math.min(...mol.atoms.map(a=>a.y));
    ctx.save();
    ctx.fillStyle=isSel?'#3fb950':'#0078d4';
    ctx.font='600 12px "IBM Plex Mono",monospace';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(mol.name,cx,minY-18);
    ctx.restore();
  });
}

function drawCells(){
  cells.forEach(cell=>{
    ctx.save();
    ctx.beginPath();
    drawBlobPath(ctx,cell.x,cell.y,cell.r,cell.blobPoints,cell.phase);
    ctx.fillStyle=hexAlpha(cell.color,.12); ctx.fill();
    ctx.strokeStyle=cell.border; ctx.lineWidth=1.5;
    ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cell.x,cell.y,cell.r*.22,0,Math.PI*2);
    ctx.fillStyle=hexAlpha(cell.border,.35); ctx.fill();
    ctx.strokeStyle=cell.border; ctx.lineWidth=1; ctx.stroke();
    for(let i=0;i<3;i++){
      const ang=cell.phase+i*2.1;
      ctx.beginPath(); ctx.ellipse(cell.x+Math.cos(ang)*cell.r*.45,cell.y+Math.sin(ang)*cell.r*.45,6,4,ang,0,Math.PI*2);
      ctx.fillStyle=hexAlpha(cell.border,.2); ctx.fill();
    }
    ctx.fillStyle=cell.border;
    ctx.font='500 10px "IBM Plex Sans",sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(cell.name,cell.x,cell.y-cell.r-14);
    const bw=cell.r*1.6, bx=cell.x-bw/2, by=cell.y+cell.r+6;
    ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fillRect(bx,by,bw,3);
    const pct=cell.hp/cell.maxHp;
    ctx.fillStyle=pct>.6?'#3fb950':pct>.3?'#ffa726':'#ef5350';
    ctx.fillRect(bx,by,bw*pct,3);
    ctx.restore();
  });
}

function drawBlobPath(c,cx,cy,r,pts,phase){
  c.beginPath();
  for(let i=0;i<=pts.length;i++){
    const p=pts[i%pts.length];
    const angle=(i/pts.length)*Math.PI*2;
    const wobble=r+Math.sin(angle*p.freq+phase)*p.amp;
    const x=cx+Math.cos(angle)*wobble, y=cy+Math.sin(angle)*wobble;
    i===0?c.moveTo(x,y):c.lineTo(x,y);
  }
  c.closePath();
}

function drawSelBoxes(){
  if(!selectedMolecules.size)return;
  ctx.save();
  ctx.strokeStyle='rgba(63,185,80,0.5)'; ctx.lineWidth=1; ctx.setLineDash([4,3]);
  selectedMolecules.forEach(id=>{
    const mol=molecules.find(m=>m.id===id); if(!mol)return;
    const minX=Math.min(...mol.atoms.map(a=>a.x))-20, maxX=Math.max(...mol.atoms.map(a=>a.x))+20;
    const minY=Math.min(...mol.atoms.map(a=>a.y))-20, maxY=Math.max(...mol.atoms.map(a=>a.y))+20;
    ctx.strokeRect(minX,minY,maxX-minX,maxY-minY);
  });
  ctx.setLineDash([]); ctx.restore();
}

// ── BOND MODE ─────────────────────────────────────────────────
function toggleBondMode(){
  bondMode=!bondMode;
  bondFirstAtom=null;
  canvas.classList.toggle('bond-cursor',bondMode);
  document.getElementById('bondModeBtn').classList.toggle('active',bondMode);
  document.getElementById('bondModeBar').classList.toggle('vis',bondMode);
  blCtx.clearRect(0,0,blCanvas.width,blCanvas.height);
  showStatus(bondMode?'⚡ Modo vinculación activo — click en átomo A, luego átomo B':'Modo vinculación desactivado');
}

// Draw rubber-band line in bond mode
canvas.addEventListener('mousemove',e=>{
  const {x,y}=cp(e);
  updateTooltip(x,y,e);
  if(bondMode&&bondFirstAtom){
    blCtx.clearRect(0,0,blCanvas.width,blCanvas.height);
    blCtx.save();
    blCtx.strokeStyle='rgba(255,213,79,0.7)';
    blCtx.lineWidth=2;
    blCtx.setLineDash([6,4]);
    blCtx.beginPath();
    blCtx.moveTo(bondFirstAtom.x,bondFirstAtom.y);
    blCtx.lineTo(x,y);
    blCtx.stroke();
    blCtx.setLineDash([]);
    blCtx.restore();
  }
  if(!dragging)return;
  
  let isDragging=false;
  if(dragging._da){
    dragging.x=x-dragOffX;
    dragging.y=y-dragOffY;
    isDragging=true;
  }
  else if(dragging._dm){
    const dx=x-dragOffX-dragging.cx;
    const dy=y-dragOffY-dragging.cy;
    dragging.atoms.forEach(a=>{a.x+=dx;a.y+=dy;});
    dragging.cx+=dx;
    dragging.cy+=dy;
    isDragging=true;
  }
  else if(dragging._dc){
    dragging.x=x-dragOffX;
    dragging.y=y-dragOffY;
    isDragging=true;
  }
  draw();
});

// ── INTERACTION ───────────────────────────────────────────────
let isDragging=false;

canvas.addEventListener('mousedown',e=>{
  if(e.button!==0)return;
  const {x,y}=cp(e);
  isDragging=false;

  // Bond mode
  if(bondMode){
    const hit=hitAtom(x,y);
    if(hit){
      if(!bondFirstAtom){
        bondFirstAtom=hit;
        showStatus(`Átomo A: ${hit.sym} — ahora click en átomo B`);
      } else if(hit!==bondFirstAtom){
        // Create manual bond
        manualBonds.push({a1:bondFirstAtom,a2:hit});
        showStatus(`⚡ Enlace manual: ${bondFirstAtom.sym} — ${hit.sym}`);
        bondFirstAtom=null;
        blCtx.clearRect(0,0,blCanvas.width,blCanvas.height);
        draw();
      }
    }
    return;
  }

  for(const c of cells){
    if(d(x,y,c.x,c.y)<c.r+15){dragging=c;dragging._dc=true;dragOffX=x-c.x;dragOffY=y-c.y;showInfo(c,'cell');return;}
  }
  for(const mol of molecules){
    for(const a of mol.atoms){
      if(d(x,y,a.x,a.y)<=a.r+3){
        dragging=mol;dragging._dm=true;dragOffX=x-mol.cx;dragOffY=y-mol.cy;
        if(e.shiftKey){if(selectedMolecules.has(mol.id))selectedMolecules.delete(mol.id);else selectedMolecules.add(mol.id);}
        else{selectedMolecules.clear();selectedMolecules.add(mol.id);}
        showInfo(mol,'molecule');draw();return;
      }
    }
  }
  for(let i=atoms.length-1;i>=0;i--){
    const a=atoms[i];if(a.inMol)continue;
    if(d(x,y,a.x,a.y)<=a.r+2){
      dragging=a;dragging._da=true;dragOffX=x-a.x;dragOffY=y-a.y;
      selected=a;showInfo(a,'atom');draw();return;
    }
  }
  selected=null;selectedMolecules.clear();draw();
});

canvas.addEventListener('mouseup',e=>{
  if(!dragging)return;
  const {x,y}=cp(e);
  
  // Solo checkear bonding si fue drag de átomo
  if(dragging._da){
    // Verificar si se movió significativamente
    const moved=Math.abs(x-dragOffX)>5 || Math.abs(y-dragOffY)>5;
    if(moved)checkBonding(dragging);
  }
  
  dragging._da=false;
  dragging._dm=false;
  dragging._dc=false;
  dragging=null;
});

canvas.addEventListener('dblclick',e=>{
  const {x,y}=cp(e);
  for(let i=atoms.length-1;i>=0;i--){
    const a=atoms[i];
    if(!a.inMol&&d(x,y,a.x,a.y)<=a.r){atoms.splice(i,1);draw();showStatus('Átomo eliminado');return;}
  }
  for(let i=molecules.length-1;i>=0;i--){
    const mol=molecules[i];
    if(mol.atoms.some(a=>d(x,y,a.x,a.y)<=a.r)){dissolveMolecule(mol);showStatus('Molécula disuelta');return;}
  }
});

canvas.addEventListener('contextmenu',e=>{
  e.preventDefault();
  const {x,y}=cp(e); ctxTarget=null;
  for(const a of atoms)if(!a.inMol&&d(x,y,a.x,a.y)<=a.r){ctxTarget={type:'atom',obj:a};break;}
  if(!ctxTarget)for(const mol of molecules)if(mol.atoms.some(a=>d(x,y,a.x,a.y)<=a.r)){ctxTarget={type:'mol',obj:mol};break;}
  if(!ctxTarget)for(const c of cells)if(d(x,y,c.x,c.y)<=c.r+10){ctxTarget={type:'cell',obj:c};break;}
  const m=document.getElementById('ctxMenu');
  m.style.display='block';m.style.left=e.clientX+'px';m.style.top=e.clientY+'px';
});
document.addEventListener('click',()=>document.getElementById('ctxMenu').style.display='none');

// ── DELETE KEY ────────────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.key==='Delete'||e.key==='Suprimir'){
    e.preventDefault();
    deleteSelected();
  }
});

function deleteSelected(){
  let deleted=0;
  // Eliminar moléculas seleccionadas
  if(selectedMolecules.size>0){
    selectedMolecules.forEach(id=>{
      const mol=molecules.find(m=>m.id===id);
      if(mol)deleted++;
      dissolveMolecule(mol);
    });
    selectedMolecules.clear();
  }
  // Eliminar átomo seleccionado si hay
  else if(selected){
    if(!selected.inMol){
      atoms.splice(atoms.indexOf(selected),1);
      deleted=1;
    }
    selected=null;
  }
  if(deleted>0){
    updateMoleculesList();
    updateCellsList();
    draw();
    showStatus(`✓ ${deleted} elemento(s) eliminado(s)`);
  }
}

function hitAtom(x,y){
  for(let i=atoms.length-1;i>=0;i--){
    const a=atoms[i];
    if(d(x,y,a.x,a.y)<=a.r+4)return a;
  }
  return null;
}

function ctxDelete(){
  if(!ctxTarget)return;
  if(ctxTarget.type==='atom')atoms.splice(atoms.indexOf(ctxTarget.obj),1);
  else if(ctxTarget.type==='mol')dissolveMolecule(ctxTarget.obj);
  else if(ctxTarget.type==='cell'){cells.splice(cells.indexOf(ctxTarget.obj),1);updateCellsList();}
  draw();showStatus('Eliminado');
}
function ctxDuplicate(){if(!ctxTarget)return;if(ctxTarget.type==='atom'){const a=ctxTarget.obj;addAtom(a.type,a.x+30,a.y+30);}showStatus('Duplicado');}
function ctxSelect(){if(ctxTarget?.type==='mol')selectedMolecules.add(ctxTarget.obj.id);draw();}
function ctxDeselect(){selectedMolecules.clear();draw();}

function dissolveMolecule(mol){
  mol.atoms.forEach(a=>{a.inMol=null;a.x+=Math.random()*40-20;a.y+=Math.random()*40-20;});
  molecules.splice(molecules.indexOf(mol),1);
  selectedMolecules.delete(mol.id);
  updateMoleculesList();
}

function cp(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function d(x1,y1,x2,y2){return Math.sqrt((x1-x2)**2+(y1-y2)**2);}

// ── BONDING (auto) ────────────────────────────────────────────
function checkBonding(atom){
  const freeClose=atoms.filter(a=>a!==atom&&!a.inMol&&d(atom.x,atom.y,a.x,a.y)<70);
  if(!freeClose.length)return;
  const group=[atom];
  const vis=new Set([atom.id]);
  const q=[atom];
  while(q.length){
    const cur=q.shift();
    atoms.filter(a=>!vis.has(a.id)&&!a.inMol&&d(cur.x,cur.y,a.x,a.y)<72).forEach(a=>{
      vis.add(a.id);
      group.push(a);
      q.push(a);
    });
  }
  if(group.length<2)return;
  
  // Obtener tipos de átomos en el grupo
  const groupTypes=group.map(a=>a.type).sort();
  const groupFormula=groupTypes.join(',');
  
  // Buscar receta que coincida
  for(const recipe of RECIPES){
    const recipeTypes=[...recipe.atoms].sort();
    const recipeFormula=recipeTypes.join(',');
    
    if(group.length===recipe.atoms.length && groupFormula===recipeFormula){
      formMolecule(group,recipe);
      return;
    }
  }
  
  // Si no hay receta, formar molécula genérica
  formGenericMolecule(group);
}

function formMolecule(grp,recipe){
  const cx=grp.reduce((s,a)=>s+a.x,0)/grp.length;
  const cy=grp.reduce((s,a)=>s+a.y,0)/grp.length;
  grp.forEach((a,i)=>{const ang=(i/grp.length)*Math.PI*2,rr=grp.length<=2?22:30;a.x=cx+Math.cos(ang)*rr;a.y=cy+Math.sin(ang)*rr;a.inMol=true;});
  const mol={id:uid(),name:recipe.name,desc:recipe.desc,func:recipe.func,atoms:grp,cx,cy,color:recipe.color,cat:recipe.cat};
  molecules.push(mol);
  showStatus(`✓ Molécula: ${recipe.name} — ${recipe.desc}`);
  updateMoleculesList();addPulse(cx,cy);draw();
}

function formGenericMolecule(grp){
  const cx=grp.reduce((s,a)=>s+a.x,0)/grp.length;
  const cy=grp.reduce((s,a)=>s+a.y,0)/grp.length;
  grp.forEach((a,i)=>{const ang=(i/grp.length)*Math.PI*2,rr=grp.length<=2?22:32;a.x=cx+Math.cos(ang)*rr;a.y=cy+Math.sin(ang)*rr;a.inMol=true;});
  const formula=atomsToFormula(grp.map(a=>a.type));
  const mol={id:uid(),name:formula,desc:'Compuesto personalizado',func:'Enlace manual',atoms:grp,cx,cy,color:'#90a4ae',cat:'Custom'};
  molecules.push(mol);
  showStatus(`✓ Compuesto formado: ${formula}`);
  updateMoleculesList();addPulse(cx,cy);draw();
}

function addPulse(x,y){
  const e=document.createElement('div');
  e.className='pulse'; e.style.cssText=`left:${x}px;top:${y}px;width:50px;height:50px;`;
  wrap.appendChild(e); setTimeout(()=>e.remove(),700);
}

// ── AUTO-REACT ────────────────────────────────────────────────
function autoReact(){
  const freeAtoms=atoms.filter(a=>!a.inMol);
  if(freeAtoms.length<2){showStatus('Necesitas al menos 2 átomos libres');return;}
  let reacted=false;
  for(const recipe of RECIPES){
    const need={};
    recipe.atoms.forEach(t=>need[t]=(need[t]||0)+1);
    const avail={};
    freeAtoms.forEach(a=>avail[a.type]=(avail[a.type]||0)+1);
    if(Object.entries(need).every(([t,n])=>(avail[t]||0)>=n)){
      const grp=[],used=new Set();
      for(const[type,cnt]of Object.entries(need)){
        let f=0;
        for(const a of freeAtoms)if(a.type===type&&!used.has(a.id)&&f<cnt){grp.push(a);used.add(a.id);f++;}
      }
      const cx=canvas.width/2+(Math.random()-.5)*200, cy=canvas.height/2+(Math.random()-.5)*150;
      grp.forEach((a,i)=>{const ang=(i/grp.length)*Math.PI*2;a.x=cx+Math.cos(ang)*30;a.y=cy+Math.sin(ang)*30;});
      formMolecule(grp,recipe); reacted=true; break;
    }
  }
  if(!reacted)showStatus('No hay combinaciones posibles con los átomos actuales');
}

// ── CELLS ─────────────────────────────────────────────────────
function groupAsCell(){
  if(selectedMolecules.size<2){showStatus('Selecciona 2+ moléculas (Shift+Click) para formar una célula');return;}
  const molObjs=[...selectedMolecules].map(id=>molecules.find(m=>m.id===id)).filter(Boolean);
  const names=molObjs.map(m=>m.name).sort().join('+');
  const cd=CELL_TYPES_MAP[names]||CELL_TYPES_MAP['default'];
  let cx=0,cy=0;
  molObjs.forEach(m=>{cx+=m.cx;cy+=m.cy;}); cx/=molObjs.length;cy/=molObjs.length;
  const bp=Array.from({length:18},()=>({freq:1+Math.floor(Math.random()*3),amp:8+Math.random()*14}));
  const cell={id:uid(),name:cd.name,color:cd.color,border:cd.border,desc:cd.desc,
    x:cx,y:cy,r:55+molObjs.length*8,blobPoints:bp,phase:0,
    vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,
    hp:cd.life,maxHp:cd.life,molecules:molObjs.map(m=>m.name)};
  cells.push(cell);
  molObjs.forEach(mol=>{
    molecules.splice(molecules.indexOf(mol),1);
    mol.atoms.forEach(a=>{a.inMol=null;atoms.splice(atoms.indexOf(a),1);});
  });
  selectedMolecules.clear();
  showStatus(`✓ ${cd.name} formada`);
  updateMoleculesList();updateCellsList();draw();
}

function animateCells(){
  if(animating)return; animating=true;
  function tick(){
    cells.forEach(c=>{
      c.phase+=.025; c.x+=c.vx; c.y+=c.vy;
      if(c.x<c.r||c.x>canvas.width-c.r)c.vx*=-1;
      if(c.y<c.r||c.y>canvas.height-c.r)c.vy*=-1;
      c.hp=Math.max(0,c.hp-.008);
    });
    draw();
    if(animating)animFrame=requestAnimationFrame(tick);
  }
  tick();showStatus('Células animadas');
}
function freezeCells(){animating=false;cancelAnimationFrame(animFrame);showStatus('Animación detenida');}

// ── INFO PANEL ────────────────────────────────────────────────
function showInfo(obj,type){
  const p=document.getElementById('infoPanel');
  if(type==='atom'){
    p.innerHTML=`<div class="info-name" style="color:${obj.color}">${obj.sym} — ${obj.name}</div>
      <div><span class="info-prop">Número: </span><span class="info-val">${ELEMENT_MAP[obj.type]?.n||'—'}</span></div>
      <div><span class="info-prop">Masa atómica: </span><span class="info-val">${obj.mass} u</span></div>
      <div><span class="info-prop">Categoría: </span><span class="info-val">${ELEMENT_MAP[obj.type]?.cat||'—'}</span></div>
      <div><span class="info-prop">enlaces máx: </span><span class="info-val">${obj.maxBonds}</span></div>
      <div><span class="info-prop">Estado: </span><span class="info-val">${obj.inMol?'Enlazado':'Libre'}</span></div>`;
  } else if(type==='molecule'){
    p.innerHTML=`<div class="info-name">${obj.name}</div>
      <div><span class="info-prop">Categoría: </span><span class="info-val">${obj.cat||'—'}</span></div>
      <div><span class="info-prop">Descripción: </span><span class="info-val">${obj.desc||'—'}</span></div>
      <div><span class="info-prop">Función: </span><span class="info-val">${obj.func||'—'}</span></div>
      <div><span class="info-prop">Fórmula generada: </span><span class="info-val">${atomsToFormula(obj.atoms.map(a=>a.type))}</span></div>`;
  } else if(type==='cell'){
    p.innerHTML=`<div class="info-name">${obj.name}</div>
      <div><span class="info-prop">Función: </span><span class="info-val">${obj.desc}</span></div>
      <div><span class="info-prop">Vitalidad: </span><span class="info-val">${Math.round(obj.hp)}/${obj.maxHp}</span></div>
      <div><span class="info-prop">Moléculas: </span><span class="info-val">${obj.molecules.join(', ')}</span></div>`;
  }
}

function updateTooltip(x,y,e){
  const tip=document.getElementById('tooltip');
  for(const a of atoms){
    if(!a.inMol&&d(x,y,a.x,a.y)<=a.r+4){
      tip.style.display='block';
      tip.style.left=(e.clientX-wrap.getBoundingClientRect().left+14)+'px';
      tip.style.top=(e.clientY-wrap.getBoundingClientRect().top-10)+'px';
      tip.innerHTML=`<b>${a.name} (${a.sym})</b><br>Z=${ELEMENT_MAP[a.type]?.n} | M=${a.mass}u<br>Cat: ${ELEMENT_MAP[a.type]?.cat}<br>Enlac: ${a.maxBonds}`;
      return;
    }
  }
  for(const mol of molecules){
    const cx=mol.atoms.reduce((s,a)=>s+a.x,0)/mol.atoms.length;
    const cy=mol.atoms.reduce((s,a)=>s+a.y,0)/mol.atoms.length;
    if(d(x,y,cx,cy)<40){
      tip.style.display='block';
      tip.style.left=(e.clientX-wrap.getBoundingClientRect().left+14)+'px';
      tip.style.top=(e.clientY-wrap.getBoundingClientRect().top-10)+'px';
      tip.innerHTML=`<b>${mol.name}</b><br>${mol.desc}<br><span style="color:var(--accent3)">${mol.func}</span>`;
      return;
    }
  }
  tip.style.display='none';
}

// ── MOLECULE LIST ─────────────────────────────────────────────
function updateMoleculesList(){
  const list=document.getElementById('moleculesList');
  document.getElementById('molCount').textContent=molecules.length;
  if(!molecules.length){list.innerHTML='<div class="info-empty" style="padding:6px 10px">—</div>';return;}
  list.innerHTML=molecules.map(m=>`
    <div class="mol-item${selectedMolecules.has(m.id)?' sel':''}" onclick="toggleMolSel(${m.id})">
      <div class="mol-dot" style="background:${m.color}"></div>
      <div><div class="mol-name">${m.name}</div><div class="mol-sub">${m.desc||m.cat}</div></div>
    </div>`).join('');
}

function toggleMolSel(id){
  if(selectedMolecules.has(id))selectedMolecules.delete(id);else selectedMolecules.add(id);
  updateMoleculesList();draw();
}

function updateCellsList(){
  const list=document.getElementById('cellsList');
  document.getElementById('cellCount').textContent=cells.length;
  if(!cells.length){list.innerHTML='<div class="info-empty" style="padding:6px 10px">—</div>';return;}
  list.innerHTML=cells.map(c=>`
    <div class="cell-item">
      <div class="mol-dot" style="background:${c.border}"></div>
      <div><div class="mol-name">${c.name}</div><div class="mol-sub">${Math.round(c.hp)}/${c.maxHp} HP</div></div>
    </div>`).join('');
}

// ── RECIPES PANEL ─────────────────────────────────────────────
let recipeFilter='';
function buildRecipePanel(){
  const panel=document.getElementById('recipesPanel');
  if(!panel){console.error('recipesPanel not found'); return;}
  const q=recipeFilter.toLowerCase();
  try{
    const filtered=RECIPES.filter(r=>!q||r.name.toLowerCase().includes(q)||r.desc.toLowerCase().includes(q)||(r.cat||'').toLowerCase().includes(q));
    const byCat={};
    filtered.forEach(r=>{(byCat[r.cat]||(byCat[r.cat]=[])).push(r);});
    let html='';
    Object.entries(byCat).forEach(([cat,list])=>{
      html+=`<div class="recipe-group-title">▸ ${cat}</div>`;
      list.forEach((r,i)=>{
        const atomFormula=atomsToFormula(r.atoms);
        const rid=RECIPES.indexOf(r);
        html+=`<div class="recipe-row" title="${r.func}">
          <span class="recipe-lhs">${atomFormula}</span>
          <span class="recipe-arrow">→</span>
          <span class="recipe-rhs">${r.name}</span>
          <span class="recipe-spawn" onclick="spawnRecipe(RECIPES[${rid}]);event.stopPropagation()">+ Canvas</span>
        </div>`;
      });
    });
    if(!html)html='<div class="info-empty">Sin resultados</div>';
    panel.innerHTML=html;
  }catch(e){console.error('buildRecipePanel error:',e);}
}

function filterRecipes(){
  recipeFilter=document.getElementById('recipeSearch').value;
  buildRecipePanel();
}

function addCustomRecipe(){
  if(!abAtoms.length){showStatus('⚠ Selecciona al menos un átomo');return;}
  const nameRaw=document.getElementById('nr_name').value.trim();
  const name=nameRaw?parseFormulaString(nameRaw):atomsToFormula(abAtoms);
  const desc=document.getElementById('nr_desc').value.trim()||'Compuesto personalizado';
  const func=document.getElementById('nr_func').value.trim()||'—';
  const cat=document.getElementById('nr_cat').value.trim()||'Custom';
  const color=document.getElementById('nr_color').value;
  const unknown=abAtoms.filter(s=>!ELEMENT_MAP[s]);
  if(unknown.length){showStatus(`⚠ Símbolo(s) desconocido(s): ${unknown.join(', ')}`);return;}
  RECIPES.push({cat,name,atoms:[...abAtoms],color,desc,func});
  abAtoms=[];renderAbSelected();
  document.getElementById('nr_name').value='';
  document.getElementById('nr_desc').value='';
  document.getElementById('nr_func').value='';
  buildRecipePanel();
  showStatus(`✓ Receta "${name}" agregada (${atomsToFormula(RECIPES[RECIPES.length-1].atoms)} → ${name})`);
}

// ── UTILS ─────────────────────────────────────────────────────
function toggleSection(id){
  const body=document.getElementById(id);
  const header=body.previousElementSibling;
  body.classList.toggle('collapsed');
  header.classList.toggle('collapsed');
}

function setView(n){
  viewLevel=n;
  [1,2,3].forEach(i=>document.getElementById('lv'+i).classList.toggle('active',i===n));
  draw();
}

function showStatus(msg){
  const c=document.getElementById('statusChip');
  c.textContent=msg;c.classList.add('vis');
  clearTimeout(showStatus._t);
  showStatus._t=setTimeout(()=>c.classList.remove('vis'),3500);
}

function clearCanvas(){
  atoms=[];molecules=[];cells=[];manualBonds=[];selected=null;selectedMolecules.clear();bondFirstAtom=null;
  if(bondMode)toggleBondMode();
  freezeCells();updateMoleculesList();updateCellsList();
  blCtx.clearRect(0,0,blCanvas.width,blCanvas.height);
  draw();showStatus('Canvas limpiado');
}

function resetSim(){
  clearCanvas();
  document.getElementById('infoPanel').innerHTML='<div class="info-empty">Haz click en un átomo, molécula o célula</div>';
  showStatus('Simulación reiniciada');
}

function lighten(hex,amt){
  const n=parseInt(hex.replace('#',''),16);
  const r=Math.min(255,(n>>16)+amt),g=Math.min(255,((n>>8)&0xff)+amt),b=Math.min(255,(n&0xff)+amt);
  return `rgb(${r},${g},${b})`;
}

function hexAlpha(hex,alpha){
  const n=parseInt(hex.replace('#',''),16);
  return `rgba(${n>>16},${(n>>8)&0xff},${n&0xff},${alpha})`;
}

// ── SCREENSHOT ─────────────────────────────────────────────────
function takeScreenshot(){
  const link=document.createElement('a');
  link.href=canvas.toDataURL('image/png');
  link.download=`Quimilopia-${Date.now()}.png`;
  link.click();
  showStatus('Captura descargada');
}

// ── SELECTION MODE ─────────────────────────────────────────────
let selectionMode=false;
let selBox={x:0,y:0,w:0,h:0,active:false};

function toggleSelectionMode(){
  selectionMode=!selectionMode;
  const btn=document.getElementById('selModeBtn');
  if(selectionMode){
    btn.classList.add('active');
    showStatus('Modo de selección activado — Arrastra para seleccionar múltiples');
  } else {
    btn.classList.remove('active');
    showStatus('Modo normal');
  }
}

function isPointInBox(px,py,x,y,w,h){
  return px>=x && px<=x+w && py>=y && py<=y+h;
}

// Override canvas mousedown para soporte de drag-select
const originalMouseDown=canvas.onmousedown;
canvas.addEventListener('mousedown',e=>{
  if(!selectionMode)return;
  const {x,y}=cp(e);
  selBox={x,y,w:0,h:0,active:true,sx:x,sy:y};
});

document.addEventListener('mousemove',e=>{
  if(!selectionMode || !selBox.active)return;
  const {x,y}=cp(e);
  selBox.w=x-selBox.x;
  selBox.h=y-selBox.y;
  draw();
});

document.addEventListener('mouseup',e=>{
  if(!selectionMode || !selBox.active)return;
  const x1=Math.min(selBox.x,selBox.x+selBox.w);
  const y1=Math.min(selBox.y,selBox.y+selBox.h);
  const w=Math.abs(selBox.w);
  const h=Math.abs(selBox.h);
  
  // Seleccionar moléculas en el área
  molecules.forEach(mol=>{
    const cx=mol.atoms.reduce((s,a)=>s+a.x,0)/mol.atoms.length;
    const cy=mol.atoms.reduce((s,a)=>s+a.y,0)/mol.atoms.length;
    if(isPointInBox(cx,cy,x1,y1,w,h)){
      selectedMolecules.add(mol.id);
    }
  });
  
  selBox.active=false;
  draw();
  if(selectedMolecules.size>0)showStatus(`✓ ${selectedMolecules.size} molécula(s) seleccionada(s)`);
});

// Draw selection box
const origDraw=window.draw;
window.draw=function(){
  origDraw();
  if(selectionMode && selBox.active){
    ctx.save();
    ctx.strokeStyle='#0078d4';
    ctx.lineWidth=2;
    ctx.setLineDash([4,4]);
    ctx.strokeRect(Math.min(selBox.x,selBox.x+selBox.w),Math.min(selBox.y,selBox.y+selBox.h),Math.abs(selBox.w),Math.abs(selBox.h));
    ctx.setLineDash([]);
    ctx.restore();
  }
};

// ── INIT ──────────────────────────────────────────────────────
requestAnimationFrame(()=>{
  buildRecipePanel();
  updateMoleculesList();
  updateCellsList();
  resize();
  draw();
  showStatus('Bienvenido a Quimilopia v3');
});
