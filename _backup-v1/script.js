/* ===== Original companions ===== */
const mochi=()=>`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 14c2-6 8-8 11-5-5 0-8 3-10 7" fill="#9ccfb2"/><path d="M32 15c-2-5-7-6-9-4 4 0 6 2 8 5" fill="#7fbf9c"/><g fill="#fff8ee" stroke="#e8cdb9" stroke-width="1.5"><circle cx="20" cy="34" r="12"/><circle cx="44" cy="34" r="12"/><circle cx="32" cy="27" r="14"/><ellipse cx="32" cy="42" rx="19" ry="12"/></g><ellipse cx="32" cy="36" rx="17" ry="12" fill="#fff8ee"/><ellipse cx="25" cy="35" rx="2.2" ry="3" fill="#3a2340"/><ellipse cx="39" cy="35" rx="2.2" ry="3" fill="#3a2340"/><circle cx="25.8" cy="34" r=".8" fill="#fff"/><circle cx="39.8" cy="34" r=".8" fill="#fff"/><ellipse cx="20" cy="40" rx="3.5" ry="2" fill="#f4a9c4"/><ellipse cx="44" cy="40" rx="3.5" ry="2" fill="#f4a9c4"/><path d="M30 40q2 2 4 0" stroke="#3a2340" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>`;
const plum=()=>`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 18l6 8M50 18l-6 8" stroke="#a68dd8" stroke-width="5" stroke-linecap="round"/><ellipse cx="32" cy="38" rx="20" ry="21" fill="#cbb6ef"/><ellipse cx="32" cy="45" rx="12" ry="12" fill="#eee5fc"/><circle cx="24" cy="32" r="7" fill="#fff"/><circle cx="40" cy="32" r="7" fill="#fff"/><circle cx="25" cy="33" r="3.4" fill="#3b2545"/><circle cx="39" cy="33" r="3.4" fill="#3b2545"/><circle cx="26" cy="32" r="1" fill="#fff"/><circle cx="40" cy="32" r="1" fill="#fff"/><path d="M30 38h4l-2 3z" fill="#e9b14f"/></svg>`;
const noct=()=>`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="34" rx="13" ry="16" fill="#8a6aa8" transform="rotate(-18 16 34)"/><ellipse cx="48" cy="34" rx="13" ry="16" fill="#8a6aa8" transform="rotate(18 48 34)"/><circle cx="14" cy="31" r="4" fill="#cbb6ef"/><circle cx="50" cy="31" r="4" fill="#cbb6ef"/><path d="M28 18q-4-8-9-8M36 18q4-8 9-8" stroke="#2a1b33" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M19 6a4 4 0 1 0 2 7 3 3 0 1 1-2-7z" fill="#e9b14f"/><path d="M45 6a4 4 0 1 1-2 7 3 3 0 1 0 2-7z" fill="#e9b14f"/><ellipse cx="32" cy="36" rx="10" ry="17" fill="#4b2d5a"/><circle cx="28" cy="30" r="2.6" fill="#fff"/><circle cx="36" cy="30" r="2.6" fill="#fff"/><circle cx="28.4" cy="30.4" r="1.3" fill="#2a1b33"/><circle cx="36.4" cy="30.4" r="1.3" fill="#2a1b33"/><ellipse cx="25.5" cy="35" rx="2" ry="1.2" fill="#e0709d" opacity=".7"/><ellipse cx="38.5" cy="35" rx="2" ry="1.2" fill="#e0709d" opacity=".7"/></svg>`;
const BUDDY={mochi:['Mochi',mochi],plum:['Plum',plum],noct:['Noct',noct]};
const nest=(fn,x,y,s)=>fn().replace('<svg ',`<svg x="${x}" y="${y}" width="${s}" height="${s}" `);
function star(cx,cy,R,r,fill,extra=''){let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,d=i%2?r:R;p.push((cx+Math.cos(a)*d).toFixed(1)+','+(cy+Math.sin(a)*d).toFixed(1))}return `<polygon points="${p.join(' ')}" fill="${fill}" ${extra}/>`}

/* ===== Stage motifs (100×100) ===== */
const MOTIF={
  tooth:`<path d="M30 22c8-6 16 0 20 0s12-6 20 0c8 6 6 22 2 32-3 8-4 22-8 30-3 6-8 4-9-2l-3-16c-1-4-3-4-4 0l-3 16c-1 6-6 8-9 2-4-8-5-22-8-30-4-10-6-26 2-32z" fill="#fff" stroke="#e2a9c2" stroke-width="2.5"/><path d="M40 34q5-4 10 0" stroke="#f4a9c4" stroke-width="2.5" fill="none" stroke-linecap="round"/>${star(78,20,8,3,'#e9b14f')}${star(20,74,5,2,'#a985e0')}<rect x="66" y="56" width="8" height="38" rx="4" fill="#a985e0" transform="rotate(28 70 75)"/><rect x="72" y="44" width="12" height="14" rx="3" fill="#fff" stroke="#a985e0" stroke-width="2" transform="rotate(28 78 51)"/>`,
  bow:`<path d="M50 50C30 22 6 28 10 50 6 72 30 78 50 50z" fill="#e2445f"/><path d="M50 50C70 22 94 28 90 50c4 22-20 28-40 0z" fill="#e2445f"/><path d="M22 42q8-6 18 4M78 42q-8-6-18 4" stroke="#f47a92" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M45 54L34 88l9-4 4 9 7-37z" fill="#c42f4b"/><path d="M55 54l11 34-9-4-4 9-7-37z" fill="#c42f4b"/><circle cx="50" cy="50" r="10" fill="#f05a74" stroke="#c42f4b" stroke-width="2"/>`,
  rain:`<g fill="#fff" stroke="#c9b0ea" stroke-width="2"><circle cx="38" cy="34" r="14"/><circle cx="58" cy="30" r="17"/><circle cx="74" cy="38" r="11"/><rect x="26" y="34" width="58" height="16" rx="8"/></g><g fill="#a985e0"><path d="M34 60q-4 7 0 9 4-2 0-9z"/><path d="M52 66q-4 7 0 9 4-2 0-9z"/><path d="M70 58q-4 7 0 9 4-2 0-9z"/></g><path d="M18 78a20 14 0 0 1 40 0z" fill="#f4a9c4"/><path d="M38 78v14q0 4 4 4" stroke="#7b5a8e" stroke-width="2.5" fill="none"/>`,
  museum:`<path d="M14 38L50 18l36 20z" fill="#cbb6ef" stroke="#2a1b33" stroke-width="2"/><rect x="16" y="38" width="68" height="6" fill="#a68dd8"/><g fill="#efe7fc" stroke="#2a1b33" stroke-width="1.5"><rect x="22" y="44" width="8" height="34"/><rect x="38" y="44" width="8" height="34"/><rect x="54" y="44" width="8" height="34"/><rect x="70" y="44" width="8" height="34"/></g><rect x="12" y="78" width="76" height="8" fill="#a68dd8" stroke="#2a1b33" stroke-width="1.5"/><path d="M82 6a10 10 0 1 0 10 13 8 8 0 1 1-10-13z" fill="#e9b14f"/><path d="M8 72q0-14 9-14t9 14l-3-2-3 3-3-3-3 3-3-3z" fill="#fff" stroke="#c9b0ea" stroke-width="1.5"/><circle cx="14" cy="64" r="1.3" fill="#2a1b33"/><circle cx="20" cy="64" r="1.3" fill="#2a1b33"/>`,
  basket:`<path d="M24 50q26-46 52 0" stroke="#b9875a" stroke-width="5" fill="none"/><path d="M14 50h72l-8 36H22z" fill="#e3b17a" stroke="#b9875a" stroke-width="2.5"/><path d="M18 62h64M20 74h60M36 50l-3 36M50 50v36M64 50l3 36" stroke="#c8935f" stroke-width="2"/><circle cx="36" cy="44" r="8" fill="#f4a9c4"/><circle cx="50" cy="40" r="9" fill="#fff" stroke="#efd1df" stroke-width="2"/><circle cx="64" cy="44" r="8" fill="#e9b14f"/><path d="M14 50h72" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/>`,
  rice:`<path d="M30 30q-3-8 2-14M48 26q-3-8 2-14M66 30q-3-8 2-14" stroke="#c9b0ea" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M18 50a32 32 0 0 0 64 0z" fill="#fff" stroke="#9ccfb2" stroke-width="3"/><path d="M18 50q32-22 64 0" fill="#fffaf0" stroke="#e8dcc8" stroke-width="2"/><path d="M24 62h52" stroke="#9ccfb2" stroke-width="3"/><circle cx="50" cy="64" r="4" fill="#f4a9c4"/><path d="M60 44L94 14M66 46L98 20" stroke="#b9875a" stroke-width="3.5" stroke-linecap="round"/><path d="M34 40l2-2M44 37l2 1M56 39l1 2" stroke="#e8dcc8" stroke-width="2"/>`,
  palace:`<path d="M50 4v14" stroke="#c9963f" stroke-width="3"/><circle cx="50" cy="4" r="3" fill="#e9b14f"/><path d="M28 34L50 16l22 18z" fill="#c42f4b"/><path d="M16 50l34-24 34 24z" fill="#d9a75a"/><path d="M10 52q6-4 6-10M90 52q-6-4-6-10" stroke="#c9963f" stroke-width="3" fill="none"/><rect x="24" y="50" width="52" height="34" fill="#fdeee0" stroke="#c9963f" stroke-width="2"/><rect x="42" y="62" width="16" height="22" rx="8" fill="#c42f4b"/><path d="M14 92q18-20 36 0" fill="#f4a9c4"/><path d="M14 92L32 74M50 92L32 74M23 92l9-18M41 92l-9-18" stroke="#fff" stroke-width="1.5"/>`,
  seesaw:`<path d="M42 82h16l-8-20z" fill="#5b1530" stroke="#2a0f1f" stroke-width="2"/><rect x="6" y="54" width="88" height="7" rx="3.5" fill="#c2244e" transform="rotate(-16 50 58)"/><path d="M84 30c-4-7-14-4-12 4 1 5 12 11 12 11s11-6 12-11c2-8-8-11-12-4z" fill="#ff5c7f"/><circle cx="16" cy="64" r="7" fill="#8a6aa8"/>${star(26,22,7,3,'#ff9db4')}<path d="M10 90h80" stroke="#c2244e" stroke-width="2" stroke-dasharray="3 5"/>`
};

/* ===== Tu’s journey (edit freely) ===== */
const STAGES=[
 {short:'Dental roots', title:'Chulalongkorn University', work:'Faculty of Dentistry', year:'Graduated August 2025', motif:'tooth', buddy:'mochi', c:'#f2a7c3', bg:['#fff4f8','#f7cfe0'], dark:false,
  role:'Dentistry student, now a graduate', tag:'The white coat came first',
  desc:['Long before the red carpets, Tu was a Bangkok girl from Chula Demonstration School who chose one of the hardest degrees at Chulalongkorn University: dentistry.',
        'What makes this stage special is that she never put it down. Every drama and film on this map, from Gorya to Mui, arrived while she was still a dental student. In August 2025 she walked across the stage herself, graduating with second-class honours.'],
  trivia:['Gorya, Kongkwan, Bee and Mui were all made while Tu was still studying dentistry.','She is one of very few Thai leading actresses who is also a qualified dentist.','Fans lovingly call her “Dr. Tu” now, and she earned it.'],
  stats:[['Brains',96],['Grit',98],['Smile',100]],
  imgs:[['https://i.pinimg.com/736x/8c/53/8c/8c538c08601196c5293bc77a2ced4ec7.jpg','Chula student days'],['https://i.pinimg.com/736x/9f/0d/c7/9f0dc7f0115fb3a9e59a2797453e9fc3.jpg','On campus'],['https://i.ytimg.com/vi/Ha9smBfm7Ao/maxresdefault.jpg','Graduation day']]},
 {short:'Gorya', title:'Gorya', work:'F4 Thailand: Boys Over Flowers', year:'2021–2022', motif:'bow', buddy:'mochi', c:'#e85a78', bg:['#ffe6eb','#f49aae'], dark:false,
  role:'Gorya, her first main lead', tag:'The role that introduced Tu to Asia',
  desc:['Gorya was Tu’s first main lead, and the role that made fans across Asia learn her name. Starring opposite Bright Vachirawit’s Thyme, she played a girl from an ordinary family who refuses to bow to the F4.',
        'The parallel is easy to love: a real-life university student juggling a demanding degree, playing a student fighting for her place at an elite school. Gorya’s stubborn kindness and bright energy feel like Tu’s own, which is why so many fans still call her Gorya first.'],
  trivia:['Tu was a dentistry student at Chula while playing Gorya.','It was her first-ever main lead role.','Thailand’s version of the story Japan, Taiwan, Korea and China all told before it.'],
  stats:[['Courage',97],['Heart',95],['Comebacks',99]],
  imgs:[['https://data-corporate.abs-cbn.com/corp/medialibrary/dotcom/kapamilya%20online%20live/f4%20thailand/tu%20tontawan%20as%20gorya%201.jpg','Character introduction'],['https://i.pinimg.com/736x/43/35/2c/43352cb5dc4c7d925a00912b0cace197.jpg','Gorya'],['https://i.pinimg.com/736x/f0/47/b7/f047b744363d9f22f7d70a0d38506596.jpg','Gorya on set']]},
 {short:'Kongkwan', title:'Kongkwan', work:'10 Years Ticket', year:'2022', motif:'rain', buddy:'plum', c:'#b996e3', bg:['#f5edff','#dccbf4'], dark:false,
  role:'Kongkwan', tag:'Tu’s quietest, saddest role',
  desc:['After Gorya’s fire, Tu took on Kongkwan, a role built on quiet heartbreak rather than loud confrontations.',
        'For many fans this was the moment they realised her range: the girl who shouted down the F4 could also break hearts with a single look. She did it while still in the middle of her dentistry degree.'],
  trivia:['Fans point to Kongkwan as proof of Tu’s emotional range.','Made during her dental school years.'],
  stats:[['Tears',98],['Tenderness',96],['Hope',70]],
  imgs:[['https://i.mydramalist.com/2112E_3f.jpg','Character introduction'],['https://m.media-amazon.com/images/M/MV5BZDEzMmM0Y2YtY2NkOS00NjFhLTk0MWMtZTFiY2RhNDI2ZGI0XkEyXkFqcGc@._V1_.jpg','10 Years Ticket']]},
 {short:'Bee', title:'Bee', work:'Midnight Museum', year:'2023', motif:'museum', buddy:'noct', c:'#8b6bb8', bg:['#2c1f3d','#5b3d7a'], dark:true,
  role:'Bee', tag:'Tu’s first step into horror',
  desc:['With Midnight Museum, Tu stepped out of romance and melodrama and into horror and mystery as Bee.',
        'It showed a braver, more playful side of her career choices: swapping love stories for eerie corridors and secrets after dark, and proving she wasn’t going to be boxed into one kind of heroine.'],
  trivia:['Her first big genre switch into horror and mystery.','Still a dentistry student when the series aired.'],
  stats:[['Nerve',90],['Curiosity',97],['Spook',88]],
  imgs:[['https://tse2.mm.bing.net/th/id/OIP.PIkFXTviPTq9aoZIDJLzxQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3','Bee'],['https://i.ytimg.com/vi/aYEmqePq_Js/maxresdefault.jpg','Midnight Museum']]},
 {short:'Mui', title:'Mui', work:'How to Make Millions Before Grandma Dies', year:'2024', motif:'basket', buddy:'plum', c:'#efb06f', bg:['#fff5e6','#f6d2a8'], dark:false,
  role:'Mui, supporting role', tag:'Tu’s big-screen moment',
  desc:['In How to Make Millions Before Grandma Dies, Tu played Mui, M’s cousin, whose devotion to her late grandfather sets the whole story in motion.',
        'Sharing the screen with Billkin and Usha Seamkhum, she gave a small role real warmth, and became part of a film that sent audiences across Southeast Asia home to call their grandparents.'],
  trivia:['The film was Thailand’s official submission to the Academy Awards.','A cinema role in a career mostly built on series.','Her last role on this map before graduating as a dentist.'],
  stats:[['Warmth',96],['Wit',85],['Family',99]],
  imgs:[['https://i.mydramalist.com/rNEWvZ_3f.jpg','Mui'],['https://i.pinimg.com/originals/e8/0c/dd/e80cdd0973cba2835b24e605ce5de26b.jpg','On screen as Mui']]},
 {short:'Jaidee', title:'Jaidee', work:'Gohan', year:'2026', motif:'rice', buddy:'mochi', c:'#8fcaa8', bg:['#fff7dc','#cfeadb'], dark:false,
  role:'Jaidee', tag:'Kind-hearted, just like Tu',
  desc:['In Gohan, Tu becomes Jaidee, a cute character persona that feels made for her.',
        'It’s the first role on this map to arrive after her graduation, and it’s pure joy: a cosy, pastel celebration of the sweetness fans see in her every day.'],
  trivia:['“Jai dee” is Thai for kind-hearted, and fans say the name fits Tu perfectly.','“Gohan” is Japanese for cooked rice, or a meal.','Her first role on this map after becoming a dentist.'],
  stats:[['Kindness',99],['Cuteness',98],['Snacks',90]],
  imgs:[['https://indonesiasenang.com/content/images/2026/05/gohan-dan-jaidee-pele.jpg','Gohan and Jaidee'],['https://kavenyou.com/wp-content/uploads/2026/04/Gohan-KAvenyou-1-800x1200.jpg','Gohan poster']]},
 {short:'Fongnuan', title:'Fongnuan / Boon', work:'Scarlet Heart Thailand', year:'2026', soon:'Premieres 4 Nov 2026', motif:'palace', buddy:'plum', c:'#d9a75a', bg:['#fff1e2','#ebc78f'], dark:false,
  role:'Nabun / Chao Laila / Fongnuan', tag:'Tu’s grandest role yet',
  desc:['Scarlet Heart Thailand asks Tu to carry several lives at once: Nabun, Chao Laila and Fongnuan, in an epic where time travel meets palace intrigue.',
        'It’s the biggest canvas of her career so far, with court robes, golden ornaments and dangerous loyalties. Fittingly, it arrives in her birthday season.'],
  trivia:['One actress, three names across time.','Premieres 4 November 2026. Fans are counting down.'],
  stats:[['Elegance',97],['Strategy',91],['Destiny',95]],
  imgs:[['https://i.mydramalist.com/mOdoXm_3m.jpg','Scarlet Heart Thailand'],['https://i.mydramalist.com/eYWrNe_3f.jpg','Fongnuan']]},
 {short:'Mars', title:'Mars', work:'Overdose', year:'Upcoming', soon:'Coming soon', motif:'seesaw', buddy:'noct', c:'#c2244e', bg:['#2a0f1f','#7a1235'], dark:true,
  role:'Mars', tag:'Tu like you’ve never seen her',
  desc:['In the upcoming revenge thriller Overdose, Tu plays Mars, the darkest role on this map and a world away from the girl in the white coat at stage one.',
        'The striking image of Mars holding a seesaw hints at a story of balance, power and getting even. After eight stages, Tu is still surprising everyone.'],
  trivia:['The most intense role of her career so far.','Crimson red is the colour to watch in every teaser.'],
  stats:[['Intensity',99],['Revenge',96],['Mercy',20]],
  imgs:[]}
];
const RANKS=['New fan','Casual fan','Fan club member','Devoted fan','Super fan','Fansite admin','Front-row legend','Lightstick master','Ultimate stan'];

/* ===== Generated art for gallery slots & image fallbacks ===== */
function art(st,kind,cap=''){
  const [b1,b2]=st.bg, ink=st.dark?'#ffffff':'#3a2340', sub=st.dark?'rgba(255,255,255,.78)':'rgba(58,35,64,.72)', id='g'+Math.random().toString(36).slice(2,8);
  const bub=`<circle cx="340" cy="40" r="60" fill="#fff" opacity=".18"/><circle cx="40" cy="230" r="70" fill="#fff" opacity=".14"/>${star(60,40,6,2.4,'#fff','opacity=".8"')}${star(330,210,5,2,'#fff','opacity=".7"')}`;
  let body='';
  if(kind==='scene'){
    body=`${bub}<g transform="translate(36 34) scale(1.55)">${MOTIF[st.motif]}</g>${nest(BUDDY[st.buddy][1],250,96,110)}
      <text x="24" y="232" fill="${ink}" font-family="Comfortaa,sans-serif" font-weight="700" font-size="20">${st.title}</text>`;
  }else if(kind==='poster'){
    body=`<g opacity=".18" transform="translate(110 20) scale(1.8)">${MOTIF[st.motif]}</g>${bub}
      <text x="200" y="118" text-anchor="middle" fill="${ink}" font-family="Comfortaa,sans-serif" font-weight="700" font-size="${st.work.length>24?17:24}">${st.work}</text>
      <text x="200" y="146" text-anchor="middle" fill="${sub}" font-family="Quicksand,sans-serif" font-weight="700" font-size="13">${st.tag}</text>
      <text x="200" y="176" text-anchor="middle" fill="${sub}" font-family="Quicksand,sans-serif" font-weight="700" font-size="11">${st.year}</text>`;
  }else if(kind==='card'){
    body=`${bub}<rect x="30" y="26" width="340" height="208" rx="20" fill="#fff" opacity=".92"/>
      <circle cx="96" cy="100" r="46" fill="${st.c}" opacity=".35"/>${nest(BUDDY[st.buddy][1],58,62,76)}
      <text x="160" y="80" fill="#3a2340" font-family="Comfortaa,sans-serif" font-weight="700" font-size="20">${st.title.split(' / ')[0]}</text>
      <text x="160" y="102" fill="#6e5476" font-family="Quicksand,sans-serif" font-weight="700" font-size="11">${st.work.length>30?st.work.slice(0,30)+'…':st.work}</text>
      ${st.stats.map(([k,v],i)=>`<text x="56" y="${176+i*20}" fill="#3a2340" font-family="Quicksand,sans-serif" font-weight="700" font-size="11">${k}</text><rect x="140" y="${167+i*20}" width="200" height="9" rx="4.5" fill="#f1e6ee"/><rect x="140" y="${167+i*20}" width="${2*v}" height="9" rx="4.5" fill="${st.c}"/>`).join('')}`;
  }else if(kind==='mood'){
    const sw=[st.c,b1,b2,'#e0709d','#a985e0'];
    body=`${bub}${[0,1,2].map(i=>`<g transform="translate(${30+i*120} 30) scale(.85)" opacity=".95">${MOTIF[st.motif]}</g>`).join('')}
      ${sw.map((c,i)=>`<rect x="${30+i*70}" y="150" width="60" height="60" rx="14" fill="${c}" stroke="#fff" stroke-width="3"/>`).join('')}
      <text x="30" y="236" fill="${ink}" font-family="Comfortaa,sans-serif" font-weight="700" font-size="14">Mood board</text>`;
  }else{ // photo fallback
    body=`${bub}<g transform="translate(170 62)"><rect width="60" height="44" rx="10" fill="#fff" opacity=".9"/><circle cx="30" cy="22" r="12" fill="${st.c}"/><circle cx="30" cy="22" r="6" fill="#fff"/><rect x="8" y="-6" width="16" height="8" rx="3" fill="#fff" opacity=".9"/></g>
      <text x="200" y="142" text-anchor="middle" fill="${ink}" font-family="Comfortaa,sans-serif" font-weight="700" font-size="15">${cap||st.title}</text>
      <text x="200" y="164" text-anchor="middle" fill="${sub}" font-family="Quicksand,sans-serif" font-weight="700" font-size="11.5">This photo is hosted on another site and can’t load in this preview.</text>
      <text x="200" y="181" text-anchor="middle" fill="${sub}" font-family="Quicksand,sans-serif" font-weight="700" font-size="11.5">It will appear when the page runs on GitHub Pages.</text>`;
  }
  return `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs><rect width="400" height="260" fill="url(#${id})"/>${body}</svg>`;
}
const slidesFor=st=>st.imgs.length?st.imgs.map(([src,cap])=>({src,cap})):[['scene','Stage art'],['card','Character card'],['poster','Title card']].map(([kind,cap])=>({kind,cap}));

/* ===== State ===== */
const KEY='tu-journey-v1';
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.done))return s}catch(e){}return{done:[],gems:100,coins:400,sound:true,theme:'auto'}}
let state=load();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const $=id=>document.getElementById(id);
const wrap=$('mapWrap'),map=$('map'),terrain=$('terrain'),token=$('token'),sheet=$('sheet'),card=$('card');
let sel=0,busy=false,openIdx=-1,pts=[],slide=0,slideCount=0;

function applyTheme(){const t=state.theme;if(t==='auto')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=t;
  document.querySelectorAll('#themeSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===t));}
function applySound(){$('sndBtn').textContent=state.sound?'🔊':'🔇';$('sndBtn').setAttribute('aria-label',state.sound?'Sound on':'Sound off');
  document.querySelectorAll('#soundSeg button').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.s==='1')===state.sound));}

/* ===== Audio ===== */
let actx;
function chime(fs=[660,880],d=.1){if(!state.sound)return;try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();fs.forEach((f,j)=>{const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime+j*d*.8;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d*2.4);o.connect(g).connect(actx.destination);o.start(t);o.stop(t+d*2.6)})}catch(e){}}

/* ===== Map (rebuilds for landscape or portrait) ===== */
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
function segPath(i){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2,k=1/5;
  return `M${p1[0]} ${p1[1]} C${(p1[0]+(p2[0]-p0[0])*k).toFixed(1)} ${(p1[1]+(p2[1]-p0[1])*k).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])*k).toFixed(1)} ${(p2[1]-(p3[1]-p1[1])*k).toFixed(1)} ${p2[0]} ${p2[1]}`}
function buildMap(){
  const W=wrap.clientWidth,H=wrap.clientHeight;if(!W||!H)return;
  const vertical=W/H<1.15;let mw,mh,ns;
  if(!vertical){ns=Math.round(Math.min(96,Math.max(56,H*.2)));const gap=Math.max(ns*1.95,(W-ns*2.4)/7);mw=Math.max(W,gap*7+ns*2.6);mh=H;const x0=(mw-gap*7)/2;
    pts=STAGES.map((_,i)=>[Math.round(x0+i*gap),Math.round(mh*(i%2?.36:.64))]);}
  else{ns=Math.round(Math.min(84,Math.max(58,W*.19)));const gap=ns*2.15;mw=W;mh=Math.max(H,gap*7+ns*3.2);const y0=(mh-gap*7)/2+ns*.35;
    pts=STAGES.map((_,i)=>[Math.round(mw*(i%2?.7:.3)),Math.round(y0+i*gap)]);}
  map.style.width=mw+'px';map.style.height=mh+'px';map.style.setProperty('--node',ns+'px');
  terrain.setAttribute('viewBox',`0 0 ${mw} ${mh}`);terrain.setAttribute('width',mw);terrain.setAttribute('height',mh);
  seed=7;let s=`<defs><linearGradient id="dg" x1="0" x2="1"><stop offset="0" stop-color="#e0709d"/><stop offset="1" stop-color="#a985e0"/></linearGradient></defs>`;
  const nc=Math.round(mw*mh/60000)+3;
  for(let c=0;c<nc;c++){const x=rnd()*mw,y=rnd()*mh,k=.6+rnd()*.5;s+=`<g class="cloud" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${k.toFixed(2)})"><path d="M0 10a14 14 0 0 1 14-14 20 20 0 0 1 36-4 15 15 0 0 1 20 18z"/></g>`;}
  const segs=STAGES.slice(0,-1).map((_,i)=>segPath(i));
  segs.forEach(d=>s+=`<path class="trail-bd" d="${d}"/>`);segs.forEach(d=>s+=`<path class="trail-base" d="${d}"/>`);
  segs.forEach((d,i)=>s+=`<path class="trail-done" id="seg${i}" d="${d}" stroke="url(#dg)"/>`);segs.forEach(d=>s+=`<path class="trail-dots" d="${d}"/>`);
  for(let k=0;k<nc+3;k++)s+=star(rnd()*mw,rnd()*mh,6,2.5,'#e9b14f',`class="spark" style="animation-delay:${(k*.4).toFixed(1)}s"`);
  terrain.innerHTML=s;
  segs.forEach((_,i)=>{const p=$('seg'+i);p.style.setProperty('--len',p.getTotalLength())});
  STAGES.forEach((st,i)=>{let n=$('node'+i);
    if(!n){n=document.createElement('button');n.className='node';n.id='node'+i;n.style.setProperty('--c',st.c);
      n.innerHTML=`<span class="node-box"><svg viewBox="0 0 100 100">${MOTIF[st.motif]}</svg></span><span class="node-num">${i+1}</span><span class="node-flag"></span><span class="node-label">${st.short}</span>`;
      n.addEventListener('click',()=>goTo(i,true));map.appendChild(n);}
    n.style.left=pts[i][0]+'px';n.style.top=pts[i][1]+'px';});
  placeToken(...pts[sel],0);refresh();follow(pts[sel][0],pts[sel][1],false);
}
function placeToken(x,y,h){token.style.left=x+'px';token.style.top=y+'px';token.style.setProperty('--hop',h+'px')}
function follow(x,y,smooth=true){wrap.scrollTo({left:x-wrap.clientWidth/2,top:y-wrap.clientHeight/2,behavior:smooth?'smooth':'auto'})}

function refresh(){
  STAGES.forEach((st,i)=>{const n=$('node'+i);if(!n)return;const d=state.done.includes(i);
    n.classList.toggle('current',i===sel);n.querySelector('.node-flag').textContent=d?'♥':'♡';
    n.setAttribute('aria-label',`Stage ${i+1}: ${st.title}, ${st.work}${d?', collected':''}`);});
  STAGES.slice(0,-1).forEach((_,i)=>$('seg'+i)?.classList.toggle('on',state.done.includes(i)&&state.done.includes(i+1)));
  $('rank').textContent=RANKS[state.done.length];$('progress').textContent=`${state.done.length}/8`;
  const st=STAGES[sel];$('pvTitle').textContent=`${sel+1}. ${st.title} in ${st.work}`;
  $('pvSub').textContent=(state.done.includes(sel)?'Collected ♥ ':'')+(st.soon?st.soon+'. ':'')+st.tag;
}
function setNum(id,to){const el=$(id),from=+el.textContent||0,t0=performance.now();
  (function f(n){const t=Math.min(1,(n-t0)/700);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-t,3)));if(t<1)requestAnimationFrame(f)})(t0);
  el.parentElement.classList.remove('bump');void el.offsetWidth;el.parentElement.classList.add('bump');}

/* ===== Hopping ===== */
function hop(a,b,dur){return new Promise(res=>{const k=Math.min(a,b),rev=b<a,p=$('seg'+k),L=p.getTotalLength(),t0=performance.now();token.classList.add('moving');
  (function f(n){const t=Math.min(1,(n-t0)/dur),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,q=p.getPointAtLength(L*(rev?1-e:e));
    placeToken(q.x,q.y,Math.abs(Math.sin(t*Math.PI*2))*20);wrap.scrollLeft=q.x-wrap.clientWidth/2;wrap.scrollTop=q.y-wrap.clientHeight/2;
    if(t<1)requestAnimationFrame(f);else{token.classList.remove('moving');placeToken(...pts[b],0);res()}})(t0);});}
async function goTo(i,thenOpen=false){
  if(busy||i<0||i>=STAGES.length)return;busy=true;const dur=Math.abs(i-sel)>2?320:560;
  while(sel!==i){const nx=sel+(i>sel?1:-1);await hop(sel,nx,dur);sel=nx;chime([784,988],.05);refresh();}
  busy=false;refresh();follow(...pts[sel]);if(thenOpen)openSheet(i);}

/* ===== Stage card ===== */
function openSheet(i){
  const st=STAGES[i],d=state.done.includes(i),[bn,bf]=BUDDY[st.buddy],sl=slidesFor(st);slideCount=sl.length;slide=0;
  card.style.setProperty('--sc',st.c);
  const fig=(s,k)=>s.src?`<img src="${s.src}" alt="${st.title}: ${s.cap}" ${k===0?'':'loading="lazy"'} referrerpolicy="no-referrer" data-cap="${s.cap}" draggable="false">`:art(st,s.kind);
  card.innerHTML=`
    <button class="close" id="closeBtn" aria-label="Close">✕</button>
    <div class="carousel" id="car">
      <div class="track" id="track">${sl.map((s,k)=>`<figure class="slide">${fig(s,k)}<figcaption>${s.cap}</figcaption></figure>`).join('')}</div>
      <button class="nav prev" id="prevBtn" aria-label="Previous photo">◀</button><button class="nav next" id="nextBtn" aria-label="Next photo">▶</button>
      <div class="dots">${sl.map((_,k)=>`<button aria-label="Photo ${k+1}"></button>`).join('')}</div>
    </div>
    <div class="thumbs" id="thumbs">${sl.map((s,k)=>`<button aria-label="Show ${s.cap}">${fig(s,1)}</button>`).join('')}</div>
    <div class="body">
      <div>
        <div class="chips"><span class="chip tint">Stage ${i+1}</span><span class="chip">${st.year}</span>${st.soon?`<span class="chip soon">${st.soon}</span>`:''}</div>
        <h2 id="sheetTitle">${st.title}</h2><p class="role">${st.work}. ${st.role}</p>
        <div class="story">${st.desc.map(p=>`<p>${p}</p>`).join('')}</div>
      </div>
      <div class="side">
        <div class="panel"><h3>Character stats</h3>${st.stats.map(([k,v])=>`<div class="stat"><span>${k}</span><div class="bar"><i data-w="${v}"></i></div><span>${v}</span></div>`).join('')}</div>
        <div class="panel"><h3>Trivia</h3><ul class="trivia">${st.trivia.map(t=>`<li>${t}</li>`).join('')}</ul></div>
        <div class="panel buddy">${bf()}<p><b>${bn}:</b> ${['That’s the one! ♡','Collect this memory before you go.','Swipe the photos, there’s more.'][i%3]}</p></div>
      </div>
    </div>
    <div class="card-foot"><button class="cta" id="claimBtn" ${d?'disabled':''}>${d?'Memory collected ♥':`Collect memory, +${30+i*10} 💎 +${120+i*40} ⭐`}<span class="key">A</span></button></div>`;
  // image fallbacks (blocked or broken links become styled art)
  card.querySelectorAll('img').forEach(img=>{const fail=()=>{const s=document.createElement('div');s.style.cssText='width:100%;height:100%';s.innerHTML=art(st,'photo',img.dataset.cap);s.firstChild.style.cssText='width:100%;height:100%;display:block';img.replaceWith(s.firstChild)};
    img.addEventListener('error',fail,{once:true});img.addEventListener('load',()=>{if(img.naturalWidth/img.naturalHeight>1.2)img.classList.add('cover')});if(img.complete&&!img.naturalWidth)fail();});
  const sr=$('screen').getBoundingClientRect(),nr=$('node'+i).getBoundingClientRect();
  sheet.classList.add('open');const ox=nr.left+nr.width/2-sr.left-card.offsetLeft,oy=nr.top+nr.height/2-sr.top-card.offsetTop;
  sheet.classList.remove('open');card.style.transformOrigin=`${ox}px ${oy}px`;void card.offsetWidth;sheet.classList.add('open');
  card.scrollTop=0;openIdx=i;goSlide(0);
  setTimeout(()=>card.querySelectorAll('.bar i').forEach(b=>b.style.width=b.dataset.w+'%'),60);
  $('closeBtn').onclick=closeSheet;$('claimBtn').onclick=()=>claim(i);
  $('prevBtn').onclick=()=>goSlide(slide-1);$('nextBtn').onclick=()=>goSlide(slide+1);
  card.querySelectorAll('.dots button').forEach((b,k)=>b.onclick=()=>goSlide(k));
  card.querySelectorAll('.thumbs button').forEach((b,k)=>b.onclick=()=>goSlide(k));
  const tr=$('track');let sx=null;
  tr.addEventListener('pointerdown',e=>{sx=e.clientX});
  tr.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>40)goSlide(slide+(dx<0?1:-1))});
  chime([523,659,784],.07);setTimeout(()=>$('closeBtn')?.focus({preventScroll:true}),350);
}
function goSlide(n){if(openIdx<0)return;slide=(n+slideCount)%slideCount;$('track').style.transform=`translateX(${-slide*100}%)`;
  card.querySelectorAll('.dots button,.thumbs button').forEach(b=>b.removeAttribute('aria-current'));
  card.querySelectorAll('.dots button')[slide].setAttribute('aria-current','true');
  const t=card.querySelectorAll('.thumbs button')[slide];t.setAttribute('aria-current','true');
  const th=$('thumbs');th.scrollTo({left:t.offsetLeft-th.clientWidth/2+32,behavior:'smooth'});}
function closeSheet(){if(openIdx<0)return;sheet.classList.remove('open');const i=openIdx;openIdx=-1;setTimeout(()=>$('node'+i).focus({preventScroll:true}),200)}
function claim(i){
  if(state.done.includes(i)){toast('Already collected ♥');return}
  state.done.push(i);state.gems+=30+i*10;state.coins+=120+i*40;save();setNum('gems',state.gems);setNum('coins',state.coins);
  const b=$('claimBtn');b.disabled=true;b.innerHTML='Memory collected ♥';
  const r=b.getBoundingClientRect(),sr=$('screen').getBoundingClientRect();confetti(r.left+r.width/2-sr.left,r.top-sr.top);
  chime([523,659,784,1047],.09);refresh();
  setTimeout(()=>toast(state.done.length===8?'All 8 memories collected. Ultimate stan unlocked ✨':`Memory collected: ${STAGES[i].title} ♥`),300);
}
function confetti(x,y){const bits=['♡','✦','★','☾','♥','✧'],cols=['#e0709d','#a985e0','#e9b14f','#8fcaa8','#f5bfd4'];
  for(let n=0;n<28;n++){const s=document.createElement('span');s.className='confetti';s.textContent=bits[n%6];s.style.color=cols[n%5];s.style.left=x+'px';s.style.top=y+'px';
    s.style.setProperty('--dx',(Math.random()*320-160)+'px');s.style.setProperty('--dy',(-Math.random()*220-40)+'px');s.style.setProperty('--r',(Math.random()*540-270)+'deg');
    $('screen').appendChild(s);setTimeout(()=>s.remove(),1400);}}
let tt;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2400)}

/* ===== Controls ===== */
const press=el=>{if(!el)return;el.classList.add('pressed');setTimeout(()=>el.classList.remove('pressed'),120)};
const A=()=>openIdx>=0?claim(openIdx):openSheet(sel);
const move=d=>{if(openIdx>=0)goSlide(slide+d);else goTo(sel+d)};
document.querySelectorAll('.dpad button').forEach(b=>b.onclick=()=>move(+b.dataset.dir));
$('btnA').onclick=A;$('btnB').onclick=closeSheet;$('pvOpen').onclick=()=>openSheet(sel);
$('btnX').onclick=()=>openIdx>=0?goSlide(slide-1):toast('Open a stage to browse its photos');
$('btnY').onclick=()=>openIdx>=0?goSlide(slide+1):toast('Open a stage to browse its photos');
const toggleSound=()=>{state.sound=!state.sound;save();applySound();try{syncStartSnd()}catch(e){}toast(state.sound?'Sound on':'Sound off');chime()};
$('btnPlus').onclick=toggleSound;$('sndBtn').onclick=toggleSound;
$('btnMinus').onclick=()=>{const cur=document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');state.theme=cur==='dark'?'light':'dark';save();applyTheme()};
$('btnHome').onclick=()=>{closeSheet();closeMail();showStart()};
const setP=$('settings');
$('setBtn').onclick=e=>{e.stopPropagation();setP.hidden=!setP.hidden;$('setBtn').setAttribute('aria-expanded',!setP.hidden)};
document.addEventListener('click',e=>{if(!setP.hidden&&!setP.contains(e.target)&&e.target!==$('setBtn')){setP.hidden=true;$('setBtn').setAttribute('aria-expanded','false')}});
document.querySelectorAll('#themeSeg button').forEach(b=>b.onclick=()=>{state.theme=b.dataset.t;save();applyTheme()});
document.querySelectorAll('#soundSeg button').forEach(b=>b.onclick=()=>{state.sound=b.dataset.s==='1';save();applySound()});
let armed=false;$('resetBtn').onclick=()=>{if(!armed){armed=true;$('resetBtn').textContent='Tap again to confirm';setTimeout(()=>{armed=false;$('resetBtn').textContent='Reset collected memories'},2500);return}
  armed=false;$('resetBtn').textContent='Reset collected memories';state.done=[];state.gems=100;state.coins=400;save();setNum('gems',100);setNum('coins',400);refresh();toast('Memories reset')};
sheet.addEventListener('click',e=>{if(e.target===sheet)closeSheet()});
document.addEventListener('keydown',e=>{const k=e.key;
  if(gOpen()){if(k==='Escape'||k==='b')closeG();return}
  if(mailOpen()){if(k==='Escape'||k==='b')closeMail();return}
  if(startOpen()){if(k==='Enter'&&e.target.tagName!=='BUTTON'){e.preventDefault();startJourney()}return}
  if(k==='ArrowLeft'||k==='ArrowUp'){e.preventDefault();press(document.querySelector('.dpad .l'));move(-1)}
  else if(k==='ArrowRight'||k==='ArrowDown'){e.preventDefault();press(document.querySelector('.dpad .r'));move(1)}
  else if(k==='Enter'||k==='a'){if(e.target.tagName==='BUTTON'&&k==='Enter')return;press($('btnA'));A()}
  else if(k==='Escape'||k==='b'){press($('btnB'));closeSheet();setP.hidden=true}});

/* ===== Fan wishes: config + sample data ===== */
// Paste your Google Form link here (used by "Send your wish" buttons).
const FORM_URL='';
// Optional: publish your Form's response sheet as CSV (File → Share → Publish to web → CSV) and paste the link.
// Expected columns, in any order: handle, name, message, badge (Mochi / Plum / Noct). Real rows replace the samples.
const SHEET_CSV_URL='';
/* ---- Curated wishes: paste your Excel / Google Sheets rows between the backticks ----
   One wish per line. Columns: handle, name, message, badge.
   Rows copied straight from Excel (tab-separated) work, or type them with " | " between columns.
   Badge accepts 🍎, 🌸 or 🖤 (or the words apple / blossom / midnight). */
const EXCEL_ROWS=`
@sample_fan_one | Ploy | Happy birthday, Tu! From Gorya to Dr. Tu, you’ve shown us you can be brave and brilliant at the same time. Keep shining like a sunflower 🌻 | 🍎
@sample_fan_two | Mint | Thank you for every character you’ve given us, from Kongkwan’s tears to Mui’s warmth. Wishing you the happiest birthday! | 🌸
@sample_fan_three | Nat | Counting down to Scarlet Heart Thailand and Overdose! Have a magical birthday, Tu 🖤 | 🖤
`;
// Curation: wishes containing any of these words are hidden; long messages are trimmed.
const BLOCKLIST=[];
const MAX_LEN=600;
const BADGES={apple:{emoji:'🍎',label:'Apple badge',buddy:'mochi',color:'#ff9a9a'},blossom:{emoji:'🌸',label:'Blossom badge',buddy:'plum',color:'#f5bfd4'},midnight:{emoji:'🖤',label:'Midnight badge',buddy:'noct',color:'#8a6aa8'}};
const BADGE_COLOR={apple:'#ff9a9a',blossom:'#f5bfd4',midnight:'#8a6aa8'};
function curate(list){return list.map(w=>({handle:String(w.handle||'fan').trim(),name:String(w.name||'').trim(),badge:String(w.badge||'').trim(),message:String(w.message||'').replace(/\s+/g,' ').trim()}))
  .filter(w=>w.message&&!BLOCKLIST.some(b=>b&&w.message.toLowerCase().includes(String(b).toLowerCase())))
  .map(w=>({...w,message:w.message.length>MAX_LEN?w.message.slice(0,MAX_LEN).trim()+'…':w.message,sample:/^@?sample/i.test(w.handle)}));}
const rowsFromPaste=t=>t.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const c=l.split(/\t|\s\|\s/).map(x=>x.trim());return{handle:c[0],name:c[1],message:c[2],badge:c[3]}});
let WISHES=curate(rowsFromPaste(EXCEL_ROWS));
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=t=>[...String(t)].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
function badgeOf(w){const k=String(w.badge||'').toLowerCase();
  if(k.includes('🍎')||k.includes('apple')||k.includes('kitty'))return'apple';
  if(k.includes('🌸')||k.includes('blossom')||k.includes('melody'))return'blossom';
  if(k.includes('🖤')||k.includes('midnight')||k.includes('kuromi'))return'midnight';
  return['apple','blossom','midnight'][hash(w.handle)%3]}
const fmtHandle=h=>{h=String(h||'fan').trim();return h.startsWith('@')?h:'@'+h};
function parseCSV(t){const rows=[];let r=[],v='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
  if(q){if(c=='"'){if(t[i+1]=='"'){v+='"';i++}else q=false}else v+=c}
  else if(c=='"')q=true;else if(c==','){r.push(v);v=''}else if(c=='\n'||c=='\r'){if(c=='\r'&&t[i+1]=='\n')i++;r.push(v);rows.push(r);r=[];v=''}else v+=c}
  if(v||r.length){r.push(v);rows.push(r)}return rows}
async function loadSheet(){if(!SHEET_CSV_URL)return;try{const res=await fetch(SHEET_CSV_URL);const rows=parseCSV(await res.text());const hd=rows.shift().map(h=>h.toLowerCase());
  const col=n=>hd.findIndex(h=>h.includes(n));const ih=col('handle'),inm=col('name'),im=col('message'),ib=col('badge');
  const got=rows.filter(r=>r[im]&&r[im].trim()).map(r=>({handle:fmtHandle(r[ih]),name:r[inm]||'',message:r[im].trim(),badge:r[ib]||''}));
  if(got.length){WISHES=curate(got);renderMail()}}catch(e){console.warn('Wishes sheet could not load',e)}}
const badgeSvg=w=>BUDDY[BADGES[badgeOf(w)].buddy][1]();
function openForm(){if(FORM_URL)window.open(FORM_URL,'_blank','noopener');else toast('Add your Google Form link to FORM_URL in the code')}

/* Mailbox */
const mailEl=$('mail'),gw=$('gwrap'),startEl=$('start');
const mailOpen=()=>mailEl.classList.contains('open'),gOpen=()=>gw.classList.contains('open'),startOpen=()=>!startEl.classList.contains('hide');
function renderMail(){
  $('mailCount').textContent=`${WISHES.length} birthday ${WISHES.length===1?'wish':'wishes'}`;
  $('mailList').innerHTML=`<span class="ph-day">Birthday wishes 🌻</span>`+WISHES.map((w,i)=>`<button class="msg" data-i="${i}" style="animation-delay:${Math.min(i,10)*.05}s"><span class="bd" style="--bc:${BADGE_COLOR[badgeOf(w)]}">${badgeSvg(w)}</span><span class="bubble"><b>${esc(fmtHandle(w.handle))} ${BADGES[badgeOf(w)].emoji}</b>${w.sample?'<span class="tag">Sample</span>':''}<p>${esc(w.message)}</p></span></button>`).join('');
  $('mailList').querySelectorAll('.msg').forEach(m=>m.onclick=()=>openWish(+m.dataset.i));}
function openMail(){renderMail();mailEl.classList.add('open');chime([659,784],.07);setTimeout(()=>$('mailBack').focus({preventScroll:true}),300)}
function closeMail(){mailEl.classList.remove('open')}
const flower=(x,y,s)=>`<svg class="corner" style="left:${x};top:${y};width:${s}px" viewBox="0 0 100 100">${Array.from({length:12},(_,i)=>`<ellipse cx="50" cy="20" rx="9" ry="20" fill="${i%2?'#ffc93c':'#ffd96b'}" transform="rotate(${i*30} 50 50)"/>`).join('')}<circle cx="50" cy="50" r="18" fill="#8a5a2b"/></svg>`;
function openWish(i){const w=WISHES[i],b=badgeOf(w);
  $('gcard').style.setProperty('--bc',BADGE_COLOR[b]);
  $('gcard').innerHTML=`${flower('-14px','-14px',64)}${flower('calc(100% - 46px)','calc(100% - 50px)',56)}<button class="x" id="gx" aria-label="Close card">✕</button>
    <div class="badge-big">${badgeSvg(w)}</div><span class="badge-name">${BADGES[b].emoji} ${BADGES[b].label}</span>
    <h3>Dear Tu,</h3><p class="msgtext">${esc(w.message)}</p>
    <div class="sig">With love, ${esc(w.name||'a fan')}<span>${esc(fmtHandle(w.handle))}${w.sample?' (sample message)':''}</span></div>`;
  gw.classList.add('open');$('gx').onclick=closeG;chime([784,988,1175],.07);setTimeout(()=>$('gx').focus({preventScroll:true}),300);
  const r=$('screen').getBoundingClientRect();confetti(r.width/2,r.height*.3);}
function closeG(){gw.classList.remove('open')}
gw.addEventListener('click',e=>{if(e.target===gw)closeG()});
mailEl.addEventListener('click',e=>{if(e.target===mailEl)closeMail()});
$('mailBack').onclick=closeMail;$('mailBtn').onclick=openMail;$('wishesBtn').onclick=openMail;$('mailFake').onclick=openForm;$('mailSend').onclick=openForm;
$('mailAv').innerHTML=mochi();

/* Live ticker */
let liveOn=true,ti=0;

function pushTick(){
  if(!liveOn||!WISHES.length||startOpen()||mailOpen()||gOpen()||openIdx>=0||document.hidden)return;
  const idx=ti++%WISHES.length,w=WISHES[idx],t=$('ticker'),max=wrap.clientWidth<560?1:3;
  const el=document.createElement('button');el.className='tick';el.style.setProperty('--bc',BADGE_COLOR[badgeOf(w)]);
  el.innerHTML=`<span class="bd" style="--bc:${BADGE_COLOR[badgeOf(w)]}">${badgeSvg(w)}</span><span style="min-width:0"><b>${esc(fmtHandle(w.handle))} <small>just now</small></b><span>${esc(w.message)}</span></span>`;
  el.onclick=()=>openWish(idx);t.prepend(el);chime([1319],.04);
  while(t.children.length>max){const o=t.lastElementChild;o.classList.add('out');setTimeout(()=>o.remove(),400);t.appendChild(o);break}
  setTimeout(()=>{if(el.isConnected){el.classList.add('out');setTimeout(()=>el.remove(),400)}},9000);}


/* Start screen */
function sunMochi(){const pet=Array.from({length:18},(_,i)=>`<ellipse cx="100" cy="30" rx="13" ry="30" fill="${i%2?'#ffc93c':'#ffd96b'}" stroke="#eeac2c" stroke-width="1.5" transform="rotate(${i*20} 100 100)"/>`).join('');
  const mini=Array.from({length:10},(_,i)=>`<ellipse cx="140" cy="44" rx="4" ry="8" fill="#ffc93c" stroke="#eeac2c" stroke-width="1" transform="rotate(${i*36} 140 52)"/>`).join('');
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Mochi wearing a sunflower crown"><g class="sun-petals">${pet}</g><circle cx="100" cy="100" r="58" fill="#fff6dc" stroke="#f2c76a" stroke-width="3"/>${nest(mochi,48,46,104)}${mini}<circle cx="140" cy="52" r="6" fill="#8a5a2b"/><path d="M58 150q-12 10-4 22 10-2 12-16z" fill="#9ccfb2"/></svg>`;}
$('heroSun').innerHTML=sunMochi();
(function(){let h='';const g=['🌻','✨','♡','✦','🌼','💛'];for(let i=0;i<16;i++)h+=`<span class="floaty" style="left:${(i*6.3+3)%100}%;font-size:${12+(i*7)%14}px;animation-duration:${9+(i*3)%8}s;animation-delay:${-(i*1.3)}s;color:${['#e9b14f','#e0709d','#a985e0'][i%3]}">${g[i%6]}</span>`;$('floaties').innerHTML=h})();
function startJourney(){if(startEl.classList.contains('poster')){startEl.classList.remove('poster');return}startEl.classList.add('hide');chime([523,659,784,1047],.08);setTimeout(()=>toast('Tap a stage to follow Tu’s journey ♡'),500)}
function showStart(){startEl.classList.remove('hide');setTimeout(()=>$('startBtn').focus({preventScroll:true}),300)}
$('startBtn').onclick=startJourney;
const syncStartSnd=()=>$('startSnd').textContent=state.sound?'🔊 Sound on':'🔇 Sound off';



const showCredits=()=>{$('gcard').style.setProperty('--bc','#ffd257');
  $('gcard').innerHTML=`<button class="x" id="gx" aria-label="Close credits">✕</button><div class="badge-big">${mochi()}</div><h3>Credits</h3><div class="credits">
  <p>A non-commercial, fan-made birthday gift for Tu Tontawan Tantivejakul. Not affiliated with Tu, her agencies, broadcasters or any studio.</p>
  <p>Photos belong to their original owners and are linked, not stored. Mochi, Plum and Noct are original companion characters made for this project.</p>
  <p>Made with love by fans. 🌻</p></div>`;gw.classList.add('open');$('gx').onclick=closeG;};
renderMail();loadSheet();

/* ===== Boot ===== */
applyTheme();applySound();
$('avatar').innerHTML=mochi();token.innerHTML=mochi();
$('gems').textContent=state.gems;$('coins').textContent=state.coins;
let rt;new ResizeObserver(()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!busy)buildMap()},100)}).observe(wrap);
buildMap();
setTimeout(()=>$('startBtn').focus({preventScroll:true}),400);
