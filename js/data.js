/* ============================================================
   EDIT YOUR CONTENT HERE
   ============================================================ */

/* --- Google Sheets: paste your published-CSV links here ---
   In Google Sheets: File > Share > Publish to web > choose the
   tab > CSV. Paste that URL below. Leave "" to use sample data. */
const LEADS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxug86iEPi-AUh0U4FD2XzYMCdFKVXsbDK0IqASMLXonNfpldnEjzHySX7ZEViU149l/exec"; // paste your Google Apps Script web-app URL here

const SHEETS = {
  // LIVE — published-to-web CSV (edit the sheet, reload the site, it updates)
  learnings: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxlDJRw9gDl8qbdaXkh3jZi0jRh1g_QW6IBmMYS01MhP36TZveN-QtJr3fhgOv1sBMld2kIXeZ3o7B/pub?gid=835340019&single=true&output=csv",
  podcasts:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxlDJRw9gDl8qbdaXkh3jZi0jRh1g_QW6IBmMYS01MhP36TZveN-QtJr3fhgOv1sBMld2kIXeZ3o7B/pub?gid=756348010&single=true&output=csv",
  books:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxlDJRw9gDl8qbdaXkh3jZi0jRh1g_QW6IBmMYS01MhP36TZveN-QtJr3fhgOv1sBMld2kIXeZ3o7B/pub?gid=0&single=true&output=csv",
  newsletter: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxlDJRw9gDl8qbdaXkh3jZi0jRh1g_QW6IBmMYS01MhP36TZveN-QtJr3fhgOv1sBMld2kIXeZ3o7B/pub?gid=1650676482&single=true&output=csv"
};

/* --- Newsletter (LinkedIn) carousel --- */
const NEWSLETTER = [
  { issue:"#07", date:"Nov 2026", title:"Designing for the 20% nobody demos", blurb:"Empty, loading and error states are where real products live. A look at how I design the unglamorous paths.", link:"#" },
  { issue:"#06", date:"Oct 2026", title:"MERN, but make it fast", blurb:"The three things that actually slowed my apps down — and the one-line fixes that brought them back.", link:"#" },
  { issue:"#05", date:"Oct 2026", title:"What an EA taught me about discipline", blurb:"Automating a trading strategy is mostly about removing yourself from the keyboard. Lessons from building bots.", link:"#" },
  { issue:"#04", date:"Sep 2026", title:"A design system in a weekend", blurb:"Tokens first, components second, screens last. How I keep ten screens consistent without losing my mind.", link:"#" },
  { issue:"#03", date:"Sep 2026", title:"From Figma to deployed", blurb:"Why I don't 'hand off' designs — I build them. The messy, honest middle between design and code.", link:"#" },
  { issue:"#02", date:"Aug 2026", title:"Reading the market at a glance", blurb:"Most dashboards drown you in numbers. Designing one that tells you what matters.", link:"#" }
];

/* --- Fallback data (used until you connect a Sheet) --- */
const SAMPLE_LEARNINGS = [
  { Date:"2026-11-08", Title:"Debouncing vs throttling, finally straight", Source:"Josh Comeau", Type:"Article", Note:"Debounce waits for quiet; throttle fires on a timer. Search = debounce, scroll = throttle.", Tags:"frontend,react", Link:"#" },
  { Date:"2026-11-02", Title:"Mongo indexes are not optional", Source:"MongoDB docs", Type:"Docs", Note:"An unindexed query on a 100k collection went from 1200ms to 4ms with one compound index.", Tags:"mongodb,perf", Link:"#" },
  { Date:"2026-10-27", Title:"Risk per trade is the whole game", Source:"Backtest notes", Type:"Note", Note:"Fixed-fractional sizing survives a losing streak that fixed-lot sizing does not. Position size from % risk.", Tags:"trading,risk", Link:"#" }
];
const SAMPLE_PODCASTS = [
  { Date:"2026-11-09", Episode:"The cost of abstraction", Show:"Syntax", Note:"When a helper saves two lines but hides a bug for a week, it wasn't worth it.", Link:"#" },
  { Date:"2026-11-03", Episode:"Designing trust in fintech", Show:"Design Better", Note:"Small UI honesty — showing fees before the tap — builds more trust than any badge.", Link:"#" }
];
const SAMPLE_BOOKS = [
  { Title:"Atomic Habits", Author:"James Clear", Status:"Finished", Rating:"5", Finished:"2026-09", Learnings:"Systems over goals. Make the good habit obvious and the bad one invisible. 1% daily compounds.", Tags:"habits,growth", CoverURL:"" },
  { Title:"Don't Make Me Think", Author:"Steve Krug", Status:"Finished", Rating:"5", Finished:"2026-07", Learnings:"Usability is about not making users think. Self-evident beats clever every time.", Tags:"ux,design", CoverURL:"" },
  { Title:"Clean Code", Author:"Robert C. Martin", Status:"Finished", Rating:"4", Finished:"2026-06", Learnings:"Functions do one thing. Names are documentation. If you need a comment, try a better name first.", Tags:"code,craft", CoverURL:"" },
  { Title:"The Psychology of Money", Author:"Morgan Housel", Status:"Finished", Rating:"5", Finished:"2026-05", Learnings:"Doing well with money is behaviour, not intelligence. Room for error is the most underrated edge.", Tags:"finance,mindset", CoverURL:"" },
  { Title:"Refactoring UI", Author:"Adam Wathan & Steve Schoger", Status:"Finished", Rating:"5", Finished:"2026-04", Learnings:"Design with constraints. Spacing and hierarchy do more than colour. Start in greyscale.", Tags:"ux,ui", CoverURL:"" },
  { Title:"Deep Work", Author:"Cal Newport", Status:"Finished", Rating:"4", Finished:"2026-03", Learnings:"Focus is a skill you train. Shallow work scales; deep work compounds.", Tags:"focus,productivity", CoverURL:"" },
  { Title:"Eloquent JavaScript", Author:"Marijn Haverbeke", Status:"Reading", Rating:"", Finished:"", Learnings:"Re-reading closures and the event loop. The async chapter is worth the whole book.", Tags:"javascript", CoverURL:"" }
];

/* --- UI/UX Designs (Figma window frames) --- */
const DESIGNS = [
  { name:"Onboarding", kind:"hero", desc:"A three-step onboarding that explains value before asking for a sign-up.", w:"375 × 812", colors:["#111","#8a8a8a","#e3e3e3"] },
  { name:"Dashboard", kind:"grid", desc:"A market dashboard — KPIs up top, watchlist below, readable at a glance.", w:"1440 × 900", colors:["#0a0a0a","#4a4a4a","#cfcfcf"] },
  { name:"Checkout", kind:"form", desc:"A two-field checkout with the total always visible. Fewer taps, more trust.", w:"375 × 812", colors:["#111","#8a8a8a","#efefef"] },
  { name:"Profile", kind:"profile", desc:"A profile screen with a clear edit affordance and honest empty states.", w:"375 × 812", colors:["#0d0d0d","#555","#dedede"] },
  { name:"Pricing", kind:"cards", desc:"Three-tier pricing with the middle plan anchored as the obvious pick.", w:"1440 × 900", colors:["#111","#6a6a6a","#e9e9e9"] },
  { name:"Settings", kind:"list", desc:"A settings list grouped by intent, with destructive actions kept apart.", w:"375 × 812", colors:["#0a0a0a","#8a8a8a","#f3f3f3"] }
];

/* --- UI/UX Articles (reader window) --- */
const ARTICLES = [
  { title:"The 20% nobody demos", date:"Nov 2026", read:"5 min", kicker:"PROCESS",
    pull:"A pretty happy-path is the easy part. Products live in the empty, loading and error states.",
    body:["Every portfolio shows the finished, populated screen. But the first thing a real user hits is an empty list, a spinner, or an error — the states we love to skip.",
          "I now design those first. An empty state is a chance to teach; a loading state is a promise; an error state is where trust is won or lost.",
          "The discipline is simple: for every screen, sketch the empty, loading, error and success versions before calling it done."],
    tags:["UX","Process","States"] },
  { title:"Designing with constraints", date:"Oct 2026", read:"4 min", kicker:"DESIGN",
    pull:"Start in greyscale. If it doesn't work in black and white, colour won't save it.",
    body:["Constraints aren't limits, they're a focus mechanism. When I start a design in greyscale, I'm forced to solve hierarchy with spacing and weight instead of hiding behind colour.",
          "Only once the structure reads clearly do I add colour — and by then it's doing a job, not covering for a weak layout.",
          "This whole portfolio is the proof: it's black and white, and the hierarchy still holds."],
    tags:["Design","UI","Craft"] },
  { title:"From handoff to hands-on", date:"Oct 2026", read:"6 min", kicker:"WORKFLOW",
    pull:"I don't hand designs off. I build them. The messy middle is where the work is.",
    body:["A 'handoff' assumes design and development are separate stages with a wall between them. In practice, the interesting decisions happen exactly at that wall.",
          "Because I build what I design, I feel every lie a mockup tells — the text that's too long, the state I forgot, the interaction that's awkward on a real device.",
          "The result is fewer 'what did you mean here' messages and a shipped product that matches the intent."],
    tags:["Workflow","MERN","Design"] }
];

/* --- Projects (your 6 work areas: folders + Work window) --- */
const PROJECTS=[
{ id:"uiux", name:"UI/UX Design", kind:"Design", live:false, built:"2024 – ongoing", status:"Design",
  blurb:"Interfaces designed end to end in Figma — flows, wireframes, design systems and polished high-fidelity screens built to actually ship.",
  glance:[["30+","screens designed"],["1","reusable design system"],["Figma","to dev handoff"]],
  tech:["Figma","UI/UX","Design systems","Prototyping"],
  quote:{pre:"A pretty screen that a developer can't build is just ",mark:"a nice picture.",by:"how I design"},
  flows:[["Understand the user","who, and what they're stuck on"],["Wireframe the flow","structure before style"],["High-fidelity in Figma","components, tokens, states"],["Prototype & hand off","clickable, dev-ready"]],
  fun:[["A design system, not just screens","Colours, type and spacing live as tokens, so ten screens stay consistent and a redesign is one change.","tokens/"],["Designing for real data","Empty, loading and error states get designed too — the happy path is the easy 20%.","states"],["Handoff that devs like","Auto-layout and named components mean the build matches the design.","auto-layout"]],
  broke:["Early files had detached components everywhere — updating one thing meant updating forty.","I used to skip the empty states. Users found them first."],
  asks:["What tools do you use?","How do you design a system, not just screens?","Do you design for mobile first?","How do you hand off to developers?"],
  qa:{"What tools do you use?":"Figma for everything — wireframes, high-fidelity screens, components and prototypes. For visuals and assets I also reach for Photoshop and Illustrator.","How do you design a system, not just screens?":"I pull colours, type and spacing into tokens and build reusable components first. Then screens are assembled from those, so ten of them stay consistent and a rebrand is one change instead of forty edits.","Do you design for mobile first?":"Usually yes — mobile forces the hard priority calls, and scaling up to desktop is easier than cramming a desktop layout down.","How do you hand off to developers?":"Auto-layout, named components and documented tokens, plus a clickable prototype. The goal is that the built app matches the design without a dozen 'what did you mean here' messages."}},
{ id:"mern", name:"MERN App", kind:"Live app", live:true, built:"2025 – ongoing", status:"Live",
  blurb:"A full-stack web app on MongoDB, Express, React and Node — auth, a REST API, and a React front end that stays fast as the data grows.",
  glance:[["4","MERN layers, one codebase"],["JWT","auth + protected routes"],["REST","API the front end lives on"]],
  tech:["MongoDB","Express","React","Node.js","Redux"],
  quote:{pre:"The stack is the easy part. The real work is ",mark:"keeping it fast as the data grows.",by:"why I built it"},
  flows:[["Model the data","MongoDB schemas first"],["Build the API","Express routes + validation"],["Wire the front end","React + Redux state"],["Secure it","JWT auth, protected routes"]],
  fun:[["State that doesn't fight me","Redux for shared state, local state for the rest — not everything needs to be global.","store/"],["An API the UI trusts","Every route validates input and returns predictable shapes, so the React side never guesses.","routes/"],["Auth done properly","JWT with protected routes and refresh, so a logged-out user can't poke a private endpoint.","auth.js"]],
  broke:["An unindexed Mongo query crawled once the collection grew — adding the index fixed it instantly.","I over-used global state early; half of it should've been local."],
  asks:["What's the stack?","How do you handle auth?","How do you keep it fast?","Why MERN over something else?"],
  qa:{"What's the stack?":"MongoDB, Express, React and Node — classic MERN — with Redux for shared state. One language top to bottom, which keeps context-switching low.","How do you handle auth?":"JWT tokens with protected routes on the server and a refresh flow, so the React app can't reach a private endpoint without a valid token.","How do you keep it fast?":"Index the queries that actually run, paginate anything that can grow, and keep state local unless it genuinely needs to be shared. Most slowness I've hit was one missing Mongo index.","Why MERN over something else?":"One language across the whole stack and a huge ecosystem. For the apps I build, shipping speed matters more than squeezing out the last millisecond."}},
{ id:"market", name:"Market Tools", kind:"Live app", live:true, built:"2025 – ongoing", status:"Live",
  blurb:"Stock-market dashboards and screeners — live prices, indicators and watchlists in a clean UI, so you can read the market at a glance.",
  glance:[["Live","price + indicator feed"],["Custom","screeners & watchlists"],["1 glance","read the whole market"]],
  tech:["React","Node.js","TradingView","Market APIs"],
  quote:{pre:"Most market dashboards drown you in numbers. I wanted one that ",mark:"tells you what matters.",by:"why I built it"},
  flows:[["Pull live data","prices, volume, indicators"],["Run the screener","your rules, not presets"],["Watch what you care about","custom watchlists"],["Spot the signal","clean charts, clear flags"]],
  fun:[["Charts that stay readable","TradingView widgets themed to match, so indicators are legible instead of a rainbow mess.","charts"],["Screeners you define","Filter by your own rules — momentum, value, whatever — not a fixed preset list.","screener.js"],["Fast, even live","Price updates stream and the UI batches them, so it stays smooth during a busy session.","stream"]],
  broke:["A rate limit on a market API throttled me mid-session; I added caching and backoff.","Timezone handling on market hours was wrong for a while — painful to debug."],
  asks:["What's the stack?","Where does the data come from?","How do custom screeners work?","Is it real-time?"],
  qa:{"What's the stack?":"React on the front, Node on the back, TradingView for charts, and market data APIs feeding live prices and indicators.","Where does the data come from?":"Market data providers over their APIs. I cache sensibly and back off on rate limits so a busy session doesn't get throttled.","How do custom screeners work?":"You define the rules — momentum, value, volume, whatever — and the screener filters the universe against them live, instead of giving you a fixed preset list.","Is it real-time?":"Prices stream in and the UI batches updates so it stays smooth. 'Real-time' is only as good as the feed, but it's built to keep up with an active session."}},
{ id:"ea", name:"Trading EA", kind:"Tool", live:false, built:"2025 – ongoing", status:"Automation",
  blurb:"TrendRSI Breakout — an MT5 Expert Advisor for gold (XAUUSD) on the 15-minute chart. It trades a fast/slow EMA crossover confirmed by an RSI momentum filter, acts only on closed bars, and puts every trade on a fixed 1:2 risk-to-reward with one position at a time.",
  report:{ image:"", sim:true, note:"Simulated / illustrative only \u2014 these figures show the strategy's target profile against typical prop-firm limits (8% profit target, under 5% daily drawdown). They are NOT from a real MT5 Strategy Tester run on historical data, so they are not a track record. Verified numbers will replace this after a real backtest.", stats:[["+8.45%","net return"],["1.62","profit factor"],["42.1%","win rate"],["3.10%","max drawdown"],["114","total trades"],["10 mo","sim window"]] },
  pkg:"TrendRSI Breakout — EA package",
  files:[ {name:"TrendRSI_Breakout.mq5", desc:"MT5 source — EMA(10/50) crossover with an RSI(14) trend filter, 1:2 risk/reward", url:"assets/ea/TrendRSI_Breakout.mq5"}, {name:"TrendRSI_Breakout_Guide.md", desc:"Full user guide — install, every input, and how to run your own real backtest", url:"assets/ea/TrendRSI_Breakout_Guide.md"} ],
  glance:[["Rules","entry, exit & risk, automated"],["Backtested","before any real capital"],["24/5","watches so you don't"]],
  tech:["MQL5","MetaTrader 5","XAUUSD · M15","EMA crossover","RSI filter","1:2 R:R","Backtesting"],
  quote:{pre:"It only acts on closed bars — ",mark:"no repainting, no second-guessing.",by:"how it works"},
  flows:[["Watch two EMAs + RSI","Fast EMA (10) and Slow EMA (50) for trend, with RSI (14) as a momentum filter around the 50 line."],["Wait for the cross","A long only when the fast EMA crosses above the slow; a short when it crosses below — judged on closed bars."],["Confirm with RSI","Take the long only if RSI is above 50, and the short only if RSI is below 50."],["Fire once, with SL/TP","Send a single order with a fixed stop-loss and a 1:2 take-profit, then wait for it to close before looking again."]],
  inputs:[["FastEMA_Period","10","Length of the fast moving average"],["SlowEMA_Period","50","Length of the slow moving average"],["RSI_Period","14","Lookback for the RSI filter"],["RSI_Midline","50","Line RSI must beat — above for longs, below for shorts"],["LotSize","0.10","Position size per trade"],["StopLoss","3000","Stop-loss distance, in points"],["TakeProfit","6000","Take-profit distance, in points"],["MagicNumber","888888","ID so the EA only manages its own trades"],["Slippage","20","Max allowed price deviation, in points"]],
  fun:[["Closed-bar only, no repaint","It stamps each new bar's time at the open and runs the logic exactly once per bar, so signals never flicker or redraw mid-candle.","OnTick()"],["Broker-safe orders","SL/TP respect the broker's minimum stop distance and round to the symbol's digits; lots snap to the volume step and min/max — so no 'invalid stops' or 'invalid volume' errors.","NormalizeLot()"],["Minds its own trades","A magic number (888888) means it only counts and manages its own positions, so it sits happily alongside other EAs or manual trades.","HasOpenPosition()"]],
  broke:["Orders were rejected as 'invalid stops' until SL/TP were clamped to the broker's minimum stop distance and rounded to the symbol's digits.","'Invalid volume' errors until the lot was snapped to the symbol's volume step and clamped to its min/max.","The 1.0 default lot was dangerous on gold (~$100 per $1 move) — dropped to 0.10 so size is a deliberate choice, not an accident."],
  asks:["How does the entry actually work?","Why such a low win rate?","What symbol and timeframe?","How do I run my own backtest?"],
  qa:{"How does the entry actually work?":"On each closed bar it checks the two EMAs and RSI. A long needs the fast EMA (10) to cross above the slow EMA (50) with RSI above 50; a short is the mirror. On a signal it sends one order with a fixed stop-loss and a take-profit at 1:2, and won't open another until that trade closes.","Why such a low win rate?":"A ~42% win rate is normal for a 1:2 trend system — it's built so winners are about twice the size of losers. You take more small losses in exchange for bigger wins, so expect losing streaks; the math still works if the edge holds.","What symbol and timeframe?":"It's built for gold — XAUUSD on the M15 chart. 'Points' are broker-specific there (often 1 point = 0.01), so the 3000-point stop is roughly a $30 move. Always confirm the point size with your own broker.","How do I run my own backtest?":"In MT5 open the Strategy Tester (Ctrl+R), choose TrendRSI_Breakout, set XAUUSD / M15 / 'Every tick based on real ticks' and a date range, then Start and export the HTML report. Run it on a demo for a few weeks before risking real capital."}},
{ id:"panel", name:"Panel Board", kind:"Client work", live:false, built:"ongoing", status:"Hardware",
  blurb:"Electrical panel-board manufacturing — reading the single-line diagram, laying out components safely, wiring, and testing before it ships.",
  glance:[["SLD","to finished board"],["Safety","clearances & ratings first"],["Tested","before it leaves"]],
  tech:["Electrical design","SLD","Wiring","Testing"],
  quote:{pre:"On a screen a bug is a refresh away. On a panel board, ",mark:"you get it right the first time.",by:"why it's different"},
  flows:[["Read the SLD","the single-line diagram"],["Lay out components","clearances, ratings, heat"],["Wire it cleanly","labelled, to standard"],["Test before shipping","continuity, load, safety"]],
  fun:[["Layout is safety, not looks","Spacing, ratings and heat dissipation decide the layout before anything else.","clearances"],["Wiring you can service","Everything labelled and routed so the next person can trace a fault in minutes.","labelling"],["Test, then ship","Continuity, insulation and load checks happen before a board ever leaves.","QA"]],
  broke:["An early board ran hot because two breakers sat too close — spacing fixed it.","A mislabelled wire cost an hour of tracing. Now labelling is non-negotiable."],
  asks:["What is panel-board manufacturing?","How does it connect to your dev work?","How do you make it safe?","Do you test every board?"],
  qa:{"What is panel-board manufacturing?":"Building electrical control and distribution panels — reading the single-line diagram, mounting and wiring the components (breakers, contactors, meters), and testing the board before it's installed.","How does it connect to your dev work?":"More than you'd think — both are systems thinking. A panel is a diagram turned into a working thing that has to be safe and serviceable, which is the same discipline I bring to code.","How do you make it safe?":"Layout comes first: clearances, correct ratings and heat dissipation. Then clean, labelled wiring to standard. Safety drives the design, not aesthetics.","Do you test every board?":"Yes — continuity, insulation and load checks before anything ships. On hardware you don't get a hotfix, so it has to be right the first time."}}
];
