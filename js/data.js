'use strict';
/* =====================================================================
   TUTY-VERSE content. Edit this file to change stages, wishes or setup.
   ===================================================================== */

/* ---------- Wish sending (Google Form) ----------
   1. Create a Google Form with two short-answer questions (X username, Message).
   2. Open the form's "Get pre-filled link", fill both, copy the link and find entry.XXXX ids.
   3. Paste the form's formResponse URL and the two entry ids below.
   Until this is filled in, the "Send" button politely says sending isn't switched on yet. */
const FORM = {
  action: '',          // e.g. 'https://docs.google.com/forms/d/e/XXXXXXXX/formResponse'
  handle: '',          // e.g. 'entry.1234567890'
  message: '',         // e.g. 'entry.0987654321'
  sheetCsv: '',        // optional: the form's response sheet published as CSV (Publish to web > CSV).
                       // When set, wishes sent from the game show up in everyone's mailbox within about 20 seconds.
};
/* ---------- Direct wish sending (Firebase Realtime Database, no form, no redirect) ----------
   Paste your database address below (see README: it looks like https://YOUR-PROJECT-default-rtdb.firebaseio.com).
   When this is set, wishes are saved straight from the game and appear for everyone within seconds. */
const WISH_DB = { url: 'https://tuty-verse-default-rtdb.asia-southeast1.firebasedatabase.app' };
const MAX_WISH = 280;          // characters per wish
const MAX_SENDS = 3;           // wishes one visitor can send per session
const SEND_GAP_MS = 20000;     // minimum gap between wishes

/* ---------- The wishes shown in the mailbox ----------
   One wish per line:   @username | message
   Rows pasted from Excel (tab separated) also work. Old 4-column rows
   (handle | name | message | badge) still work: the name and badge are ignored.
   PASTE YOUR 8 COLLECTED WISHES BETWEEN THE BACKTICKS. */
const WISH_ROWS = `
@Tu_sunshine9 | Happy birthday Tu i hope have best birthday i can't believe you're 26 but you are still baby in my eyes i love you so much 🥺 i wish your day filled with joy, happiness and full of surprises. You deserves only best things in life you are really precious to me 💗
@backtobeingakid | Wishing you, your family, and everyone you hold dear good health and happiness♥️♥️
@fiellyverse | Happy birthday, Tuty🤍 I hope this new chapter of your life brings you genuine happiness, good health, endless blessings, and opportunities that will lead you closer to your dreams. May life always be kind to you, and may you never run out of reasons to smile. You may never know how much you've helped me, especially during moments when I needed comfort the most. Without even knowing it, you've made my difficult days a little lighter and given me happiness in ways words could never fully explain. Thank you for being one of my unexpected sources of comfort. I want you to know that I'll continue supporting you through all the ups and downs. Not just during the beautiful and successful moments, but also during the challenging chapters of your journey. I'll always be here, cheering for you, celebrating your achievements, and believing in you. I hope you never forget how loved and appreciated you are. You deserve all the beautiful things this world has to offer. Keep growing, keep shining, and never stop being the person you are. Happy birthday once again, Tuty! No matter where life takes you, I'll always be rooting for you. Thank you for existing and for unknowingly making such a beautiful difference in my life. 🤍
@pipuwravit | Happiest birthday, dear Tutyy!! You've been such a great motivation for me. I hope the world will always love you just like I do. I wish you all the best ☀️🌻
@tuty_ismywife | happy birthday our baby tu, there are a lot of reasons why i'm so grateful that you exist but for now i'd like to say that i exist because you are existing🥹🫶🏻 i've never liked a person so much before you, i love you in a way that can't be described in words, you are the strongest person i've ever met and i hope you get all the good things in this world💞🤞🏻 love you SO much, my tuty🌻🫶🏻💗
@Unknown385244 | Happiest Birthday to one of the best Women in the world. You are the sweetest and one of the most beautiful women I have seen in my life. You have been my inspiration and motivation for a long time as your hard work, your words and your personality gives me so much positivity. My younger self has changed a lot because of you so, you deserve the world and so much love. I love you so much and thank you very much tuty💗🌻 - To Tu Tontawan Tantivejakul
@moochiiwin | happy birthday, tuty! 💗 thank you for being such a ray of sunshine and for bringing so much happiness and inspiration into our lives. we're so proud of everything you've achieved this year and excited for all the beautiful things still waiting for you. always remember to put yourself first, make time for what makes you happy, and never stop doing what you love. we'll always be here cheering you on and supporting you. we love you! have the happiest birthday! 🎂💗
@sugar19p | สุขสันต์วันเกิดนะตู 🌻 I still remember watching you for the first time and being so amazed by your acting. I've loved following and watching you grow ever since. Your talent first caught my attention, but the person you are has given me even more reasons to adore you. Thank you for bringing me so many smiles through your work. I'll always believe in you, support you and cheer you on. I hope the year ahead brings you endless happiness, love and beautiful opportunities. You mean so much to me, and I hope you never stop shining. 💛
@ailykim128 | Happy birthday to Intuyou's little princess! May happiness always accompany your every step. We (Intuyou) hope that at the age of 26, you will be able to make all your dreams come true. Please know that we love you dearly, just as you are, always so just to be our Tuty 💖
`;

/* ---------- Pinned wish from the creator (always shown first) ---------- */
const CREATOR_WISH = {
  handle: '@BisBis_06',
  message: 'This is a gift from all Intuyous: your beloved fans who wish you the very best at every stage of your life! You have done so well over the past 6 years as an actress and public figure. As the creator I ran out of space and time to show more of your amazing work and I could only hope to show the world a little more of it. I hope you take on more than one project next year because we can never get enough of actress Tu. I hope you also get the tons of awards and recognition you deserved years ago. I have been an international Intuyou since 2020 and I have never regretted a single day :)',
};

/* ---------- Stages ---------- */
const STAGES = [
  {
    short: 'Early life', title: 'Early life', work: 'Bangkok and school days', year: 'Early years', motif: 'pompom', c: '#f48fb1', bg: ['#fff0f6', '#ffc6dc'], dark: false,
    role: '', tag: 'Where the story begins',
    desc: ['Long before the red carpets Tuty was a Bangkok girl at Chulalongkorn University Demonstration School. She was bright and curious with a big heart.',
      'She was also a proud K-pop fan of NCT and EXO and Red Velvet with Jisung of NCT as her bias. She became a popular high schooler online where many fans first noticed her warmth. Every stage after this one grew from that bright and determined girl.'],
    trivia: ['She is the younger sister of Tonhon Tantivejakul who is a musician and producer and actor.',
      'Her name Tontawan comes from two Thai words: "ton" for the beginning and "tawan" for the sun. It reads like "the first light of the sun" and that is why the sunflower suits her so well.',
      'She is a K-pop fan of NCT and EXO and Red Velvet. Her bias is Jisung from NCT.',
      'She is a carb lover. Pasta and bread and pizza are her comfort foods. She adores sashimi too.',
      'She went to Chulalongkorn University Demonstration School for high school where she was the president of the K-pop fan club.',
      'Her first music video was for Waruntorn Paonil\'s song "Disappointed" where she played the girl opposite Putthipong Assaratanakul.'],
    stats: [['Spirit', 99], ['Energy', 97], ['Happiness', 100]],
    imgs: [['img/tonhon.jpg', 'With her brother Tonhon'], ['img/nct1.jpg', 'At an NCT concert'], ['img/nct2.jpg', 'NCT fan moment'], ['img/fan.jpg', 'Fan girl style'], ['img/kuromi.jpg', 'With Kuromi'], ['img/cheer.jpg', 'School days']],
  },
  {
    short: 'Dental roots', title: 'Dental roots', work: 'Chulalongkorn University Faculty of Dentistry', year: 'Graduated August 2025', motif: 'tooth', c: '#f2a7c3', bg: ['#fff4f8', '#f7cfe0'], dark: false,
    role: '', tag: 'The white coat',
    desc: ['At Chulalongkorn University she chose one of the hardest degrees there is: dentistry.',
      'What makes this stage special is that she never truly put it down. She balanced shoots with lectures and clinics and paused her acting for a year to focus. In August 2025 she walked across the graduation stage with second-class honours.'],
    trivia: ['She took a break in 2023 to 2024 and skipped one GMMTV lineup year to focus on her studies.',
      'She is one of very few Thai leading actresses who is also a qualified dentist.',
      'Fans lovingly call her "Dr. Tu" now and she earned it.',
      'Joke time: international fans are jealous because the biggest Thai fans can meet her using dental appointments.'],
    stats: [['Brains', 96], ['Grit', 98], ['Success', 100]],
    imgs: [['img/drtu.jpg', 'Dr. Tu'], ['https://i.pinimg.com/736x/8c/53/8c/8c538c08601196c5293bc77a2ced4ec7.jpg', 'Chula student days'], ['https://i.pinimg.com/736x/9f/0d/c7/9f0dc7f0115fb3a9e59a2797453e9fc3.jpg', 'On campus'], ['https://i.ytimg.com/vi/Ha9smBfm7Ao/maxresdefault.jpg', 'Graduation day']],
  },
  {
    short: 'Gorya', title: 'Gorya', work: 'F4 Thailand: Boys Over Flowers', year: '2021-2022', motif: 'moon', c: '#e85a78', bg: ['#ffe6eb', '#f49aae'], dark: false,
    role: '', tag: 'The role that introduced her to Asia',
    desc: ['Gorya was her first main lead and the role that made fans across Asia learn her name. Starring opposite Bright Vachirawit\'s Thyme she played a girl from an ordinary family who refuses to bow to the F4.',
      'Gorya is a scholarship student fighting for her place at an elite school. Her stubborn kindness and bright energy feel like Tuty\'s own and that is why so many fans still call her Gorya first.'],
    trivia: ['She shared the screen with Prim who is one of her best friends from GMMTV. They belong to the same close friend group that fans call PPG+1 with fellow GMMTV actors View and Love.',
      'It was her first-ever main lead role.',
      'BrightTu and DewTu became popular ships at that time.',
      'It is Thailand\'s version of a story that four other Asian countries had told before it.'],
    stats: [['Courage', 97], ['Innocence', 95], ['Comebacks', 99]],
    imgs: [['img/gorya2.jpg', 'Gorya'], ['img/gorya1.jpg', 'Gorya and Kaning'], ['https://data-corporate.abs-cbn.com/corp/medialibrary/dotcom/kapamilya%20online%20live/f4%20thailand/tu%20tontawan%20as%20gorya%201.jpg', 'Character introduction'], ['https://i.pinimg.com/736x/43/35/2c/43352cb5dc4c7d925a00912b0cace197.jpg', 'Gorya'], ['https://i.pinimg.com/736x/f0/47/b7/f047b744363d9f22f7d70a0d38506596.jpg', 'Gorya on set']],
  },
  {
    game: 'memory', short: 'Memory match', title: 'Memory match', work: 'Match her roles', year: 'Mini game', motif: 'puzzle', c: '#79b8ec', bg: ['#eaf5ff', '#bcdcf7'], dark: false,
    role: '', tag: 'Flip the cards and find the pairs', desc: [], trivia: [], stats: [], imgs: [],
  },
  {
    short: 'Kongkwan', title: 'Kongkwan', work: '10 Years Ticket', year: '2022', motif: 'bag', c: '#b996e3', bg: ['#f5edff', '#dccbf4'], dark: false,
    role: '', tag: 'Her quietest and saddest role',
    desc: ['Kongkwan is the role that broke hearts. Where Gorya fought back Kongkwan held everything in. Her love and loneliness only spilled out when she could no longer keep them quiet.',
      'Her crying scenes felt so raw that audiences could not stay dry. Viewers said they sobbed right along with her and that every tear felt real. Her heartbreak stayed with them long after the episode ended.'],
    trivia: ['She acted alongside View who is one of her close friends at GMMTV and with Ohm and Off who both had incredible chemistry with her on screen.',
      'The iconic library breakdown scene between Tu and Ohm\'s character in 10 Years Ticket is still one of the most talked-about moments of the show.',
      'Fans point to Kongkwan as proof of her emotional range.'],
    stats: [['Tears', 98], ['Tenderness', 96], ['Hope', 70]],
    imgs: [['img/kong.jpg', 'Kongkwan'], ['https://i.mydramalist.com/2112E_3f.jpg', 'Character introduction'], ['https://m.media-amazon.com/images/M/MV5BZDEzMmM0Y2YtY2NkOS00NjFhLTk0MWMtZTFiY2RhNDI2ZGI0XkEyXkFqcGc@._V1_.jpg', '10 Years Ticket']],
  },
  {
    short: 'Bee', title: 'Bee', work: 'Midnight Museum', year: '2023', motif: 'piano', c: '#8b6bb8', bg: ['#2c1f3d', '#5b3d7a'], dark: true,
    role: '', tag: 'Her first step into horror',
    desc: ['In Midnight Museum she played Bee who is a teenager completely obsessed with the piano. Behind the music was a deep heartbreak. Her mother died because of her father\'s cheating and the piano became the one place she could keep her feelings.',
      'The series also took her out of romance and melodrama and into horror and mystery. She swapped love stories for eerie corridors and secrets after dark.'],
    trivia: ['She made a solid appearance in 2 episodes of the show which continued her story.',
      'She acted alongside Fah Yongwaree who played Mira and was also part of F4 Thailand.',
      'Her first big genre switch into horror and mystery.'],
    stats: [['Blood', 90], ['Betrayal', 97], ['Hatred', 88]],
    imgs: [['img/bee.jpg', 'Midnight Museum'], ['https://tse2.mm.bing.net/th/id/OIP.PIkFXTviPTq9aoZIDJLzxQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'Bee'], ['https://i.ytimg.com/vi/aYEmqePq_Js/maxresdefault.jpg', 'Midnight Museum']],
  },
  {
    short: 'Mui', title: 'Mui', work: 'How to Make Millions Before Grandma Dies', year: '2024', motif: 'pulse', c: '#efb06f', bg: ['#fff5e6', '#f6d2a8'], dark: false,
    role: '', tag: 'Her big-screen moment',
    desc: ['In How to Make Millions Before Grandma Dies she played Mui who is M\'s cousin. Her devotion to her late grandfather sets the whole story in motion.',
      'Sharing the screen with Billkin and Usha Seamkhum she showed Billkin\'s character that she had only started caring for her grandpa for the money. It later grew into a real attachment to him. That bond left her sad and unhappy even after she received his money following his death. She gave a small role real warmth and became part of a film that sent audiences across Southeast Asia home to call their grandparents.'],
    trivia: ['The film was Thailand\'s official submission to the Academy Awards.',
      'This was her first movie role ever and the start of her movie collaboration with GDH.',
      'Her last role on this map before graduating as a dentist.'],
    stats: [['Care', 96], ['Wit', 85], ['Family', 99]],
    imgs: [['img/mui.jpg', 'Mui'], ['https://i.mydramalist.com/rNEWvZ_3f.jpg', 'Mui'], ['https://i.pinimg.com/originals/e8/0c/dd/e80cdd0973cba2835b24e605ce5de26b.jpg', 'On screen as Mui']],
  },
  {
    short: 'Jaidee', title: 'Jaidee', work: 'Gohan', year: '2026', motif: 'retriever', c: '#e6b75f', bg: ['#fff7dc', '#f4dfa8'], dark: false,
    role: '', tag: 'Kind-hearted just like her',
    desc: ['In Gohan she becomes Jaidee who is a cute character persona that feels made for her.',
      'It is the first role on this map to arrive after her graduation. On the surface it looks happy and sweet but it becomes subtly sad and realistic. It is a pastel story with real feelings underneath.'],
    trivia: ['"Jai dee" is Thai for kind-hearted and fans say the name fits her perfectly.',
      '"Gohan" is Japanese for cooked rice or a meal.',
      'This was her first-ever main lead in a Thai movie and it was a box office hit.',
      'It is her second movie with GDH after How to Make Millions Before Grandma Dies.'],
    stats: [['Kindness', 99], ['Cuteness', 98], ['Snacks', 90]],
    imgs: [['img/jaidee1.jpg', 'Jaidee'], ['img/jaidee2.jpg', 'Behind the scenes'], ['https://indonesiasenang.com/content/images/2026/05/gohan-dan-jaidee-pele.jpg', 'Gohan and Jaidee'], ['https://kavenyou.com/wp-content/uploads/2026/04/Gohan-KAvenyou-1-800x1200.jpg', 'Gohan poster']],
  },
  {
    game: 'maze', short: 'Maze', title: 'Maze escape', work: 'Four questions to get out', year: 'Mini game', motif: 'maze', c: '#7cc79a', bg: ['#e9f8ee', '#b9e3c6'], dark: false,
    role: '', tag: 'Answer right to find the way out', desc: [], trivia: [], stats: [], imgs: [],
  },
  {
    short: 'Fongnuan', title: 'Fongnuan / Boon', work: 'Scarlet Heart Thailand', year: '2026', chip: 'Premiered 4 Nov 2026', motif: 'palace', c: '#d9a75a', bg: ['#fff1e2', '#ebc78f'], dark: false,
    role: '', tag: 'Her grandest role yet',
    desc: ['Scarlet Heart Thailand gives her two lives to carry. She is Fongnuan in the ancient world and Boon in the modern one in an epic where time travel meets palace intrigue.',
      'She leads the biggest and most expensive series GMMTV has ever made and the first ancient period piece the studio has attempted. It also marks her comeback to series after nearly two years away with no cameos in between. Fittingly it premiered in her birthday season.'],
    trivia: ['She plays just two characters: Fongnuan in the ancient world and Boon in modern times.',
      'At 18 episodes it is the longest show she has ever worked on and it gave her the longest hair she has ever had for a character.',
      'She travelled back and forth between Chiang Mai and remote countryside locations across Thailand. Many of her co-actors known as the seven princes praised her dedication through long periods and days of shooting.'],
    stats: [['Elegance', 97], ['Strategy', 91], ['Destiny', 95]],
    imgs: [['img/fong1.jpg', 'Character introduction'], ['img/fong2.jpg', 'Fongnuan'], ['https://i.mydramalist.com/mOdoXm_3m.jpg', 'Scarlet Heart Thailand'], ['https://i.mydramalist.com/eYWrNe_3f.jpg', 'Fongnuan']],
  },
  {
    game: 'catch', short: 'Sunflower catch', title: 'Sunflower catch', work: 'A little game just for fun', year: 'Mini game', motif: 'catch', c: '#f2c14e', bg: ['#fff9df', '#f8e08c'], dark: false,
    role: '', tag: 'Catch the sunflowers and hearts', desc: [], trivia: [], stats: [], imgs: [],
  },
  {
    short: 'Awards', title: 'Achievements', work: 'Awards and looks', year: '2022-2026', motif: 'trophy', c: '#f2c14e', bg: ['#fff8de', '#f6dc8e'], dark: false,
    role: '', tag: '',
    desc: [], trivia: [], stats: [],
    imgs: [],
    awards: [
      { t: '5.8M', short: '5.8M', cap: '5.8 million Instagram followers: the most followed female GMMTV actress in 2026', imgs: ['img/ig.jpg'] },
      { t: 'Best Actress', short: 'Actress', cap: 'Best Actress in a Leading Role at the 28th Asian Television Awards for Kongkwan in 10 Years Ticket', imgs: ['img/ata.jpg'] },
      { t: 'Rising Icon', short: 'Rising Icon', cap: 'FPA Asia-Pacific Rising Icon at the 62nd Asia Pacific Film Festival in 2025. Earlier she was also nominated there for Best Supporting Actress for Mui', imgs: ['img/apff.jpg'] },
      { t: 'F4 award', short: 'F4 Award', cap: 'An award for her role as Gorya in F4 Thailand: Boys Over Flowers', imgs: ['img/f4award.jpg'] },
      { t: 'Award nights', short: 'Awards', cap: 'Award night', caps: ['Award night 1', 'Award night 2'], imgs: ['img/award2.jpg', 'img/award3.jpg'] },
      { t: 'GQ New Face', short: 'GQ', cap: 'New Face of the Year at the GQ Men of the Year Awards 2022', imgs: ['img/gq.jpg'] },
      { t: 'Dior', short: 'Dior', cap: 'Dior ambassador for Thailand since September 2023: the first GMMTV artist to be a Dior ambassador', imgs: ['img/dior1.jpg', 'img/dior2.jpg', 'img/dior3.jpg'] },
      { t: 'AMI Paris', short: 'AMI Paris', cap: 'At Paris Fashion Week with AMI Paris', imgs: ['img/ami1.jpg', 'img/ami2.jpg'] },
      { t: 'Puma', short: 'Puma', cap: 'Named Puma Thailand brand ambassador in March 2024', imgs: ['img/puma.jpg'] },
      { t: 'Dr. Tu', short: 'Dr. Tu', cap: 'Graduated from Chulalongkorn Faculty of Dentistry in August 2025 with second-class honours', imgs: ['img/drtu.jpg'] },
      { t: 'Brown look', short: 'Looks', cap: 'Look: the brown dress', caps: ['Look: the brown dress 1', 'Look: the brown dress 2'], imgs: ['img/brown1.jpg', 'img/brown2.jpg'] },
      { t: 'Calvin Klein', short: 'Calvin Klein', cap: 'Look: Calvin Klein', imgs: ['img/ck.jpg'] },
      { t: 'More looks', short: 'Looks', cap: 'Looks', caps: ['Look: Songmont', 'Look: Gohan premiere'], imgs: ['img/songmont.jpg', 'img/gohanpre.jpg'] },
    ],
  },
];

/* ---------- Mini games ---------- */
// Maze: each right answer moves her one step closer to the exit. Two wrong answers and she is stuck (skip is always there).
const MAZEQ = [
  { q: 'How many years did she not act in a series?', o: ['1 year', '2 years', '3 years'], a: 1 },
  { q: 'Which GMMTV lineup did she attend after coming back for her next series?', o: ['2023', '2024', '2025'], a: 1 },
  { q: 'Which brand did she wear for the series announcement?', o: ['Puma', 'AMI Paris', 'Dior'], a: 2 },
  { q: 'What colour was her dress for the announcement?', o: ['Purple', 'Pink', 'Blue'], a: 0 },
];
const RANKS = ['New fan', 'Casual fan', 'Fan club member', 'Devoted fan', 'Super fan', 'Fansite admin', 'Front-row legend', 'Lightstick master', 'Ultimate stan'];

/* ---------- Kindness filter ----------
   Runs in the browser on every wish, the pre-collected wishes and mascot names.
   It normalises look-alike characters (f*ck, sh1t, f u c k) and blocks insults,
   slurs, threats, links and @mentions. A browser filter can be bypassed by a
   determined person, so wishes sent through the form should still be read by you
   before you paste them into WISH_ROWS: nothing a visitor sends is ever shown to
   other visitors automatically. */
const MOD = (() => {
  const j = (...a) => a.join('');
  const SUB = ['fuck', 'bitch', 'whore', 'shit', 'faggot', 'retard', j('ni', 'gg'), j('ch', 'ink'), j('ka', 'ffir'), j('tr', 'anny'), 'slut', 'asshole', 'bastard', 'pussy', 'dickhead', 'motherfu', 'wanker'];
  const WORDS = new Set(['cunt', 'dick', 'cock', 'kys', 'ugly', 'fat', 'stupid', 'idiot', 'moron', 'dumb', 'trash', 'garbage', 'worthless', 'loser', 'hate', 'hated', 'hates', 'hating', 'suicide', 'rape', 'raped', 'nazi',
    'pathetic', 'disgusting', 'cringe', 'annoying', 'flop', 'overrated', 'boring', 'slag', 'twat', 'prick', 'crap', 'sucks', 'suck', 'ass', 'arse', 'porn', 'nude', 'nudes', 'sex', 'horny', 'bully', 'scum', 'freak']);
  const PHRASES = ['kill yourself', 'kill her', 'kill you', 'go die', 'hope you die', 'hope she dies', 'should die', 'drop dead', 'no talent', 'talentless', 'attention seeker', 'nobody likes you', 'nobody likes her', 'worst actress', 'cant act', 'cannot act'];
  const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', '@': 'a', $: 's', '!': 'i', '|': 'i', '+': 't' };
  const dd = s => s.replace(/(.)\1+/g, '$1');
  const norm = t => String(t).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[0134578@$!|+]/g, c => LEET[c]);
  const WORDS_D = new Set([...WORDS].map(dd).filter(w => w.length > 2));   // "ass" collapses to "as", a normal word: never match 2-letter results
  const MSG = {
    links: 'Please remove links, they can\'t be included in wishes.',
    mention: 'Please leave @mentions out of the message. Your own username goes in the box below.',
    phone: 'Please remove phone numbers and long numbers.',
    language: 'Let\'s keep Tuty\'s mailbox kind and positive. Please remove any rude, hateful or negative words.',
    short: 'Your wish is a little short. Add a few more words for Tuty.',
  };
  function check(text, o = {}) {
    const raw = String(text || '');
    if (!o.name) {
      if (/https?:|www\.|\.(com|net|org|io|co|ly|me|xyz|gg)\b|t\.co\//i.test(raw)) return MSG.links;
      if (/(^|\s)@\w+/.test(raw)) return MSG.mention;
      if (/\d[\d\s-]{7,}\d/.test(raw)) return MSG.phone;
      if (raw.replace(/\s/g, '').length < 3) return MSG.short;
    }
    const n = norm(raw);
    for (const v of [n, dd(n)]) {
      const spaced = v.replace(/[^a-z]+/g, ' ').trim(), toks = spaced.split(' ').filter(Boolean), cand = new Set(), vd = v === n ? WORDS : WORDS_D;
      let run = '';
      toks.forEach(t => { if (t.length === 1) run += t; else { if (run) { cand.add(run); run = ''; } cand.add(t); } });
      if (run) cand.add(run);
      for (const t of cand) {
        if (vd.has(t) || (t.length > 3 && vd.has(t.replace(/s$/, '')))) return MSG.language;
        if (SUB.some(s => t.includes(v === n ? s : dd(s)))) return MSG.language;
      }
      if (PHRASES.some(p => (' ' + spaced + ' ').includes(' ' + (v === n ? p : dd(p)) + ' '))) return MSG.language;
    }
    return '';
  }
  return { check, ok: (t, o) => !check(t, o) };
})();
