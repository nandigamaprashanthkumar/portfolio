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
  newsletter: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxlDJRw9gDl8qbdaXkh3jZi0jRh1g_QW6IBmMYS01MhP36TZveN-QtJr3fhgOv1sBMld2kIXeZ3o7B/pub?gid=1650676482&single=true&output=csv",
  articles:  "https://docs.google.com/spreadsheets/d/1CLtONoVAuozDXCJLA7dHOBPvi1rlo3rbanlZ_PnAuRM/gviz/tq?tqx=out:csv&sheet=Articles"
};

/* --- Newsletter (LinkedIn) carousel --- */
const NEWSLETTER = [
  { issue:"#61", date:"", title:"US bank rules left AI agents out. Two regulators just sketched what fills the gap.", blurb:"", link:"https://www.linkedin.com/pulse/us-bank-rules-left-ai-agents-out-two-regulators-just-sketched-kumar-nlfof/" },
  { issue:"#60", date:"", title:"Your coding agent needed somewhere to put a screenshot. It chose public GitHub.", blurb:"", link:"https://www.linkedin.com/pulse/your-coding-agent-needed-somewhere-put-screenshot-chose-kumar-udfmf/" },
  { issue:"#59", date:"", title:"Your agent is about to need its own KYC file", blurb:"", link:"https://www.linkedin.com/pulse/your-agent-need-its-own-kyc-file-nandigama-prashanth-kumar-xkhnf/" },
  { issue:"#58", date:"", title:"Losing Your Place: When Back Throws Away the Scrolling You Already Did", blurb:"", link:"https://www.linkedin.com/pulse/losing-your-place-when-back-throws-away-scrolling-you-kumar-2v41f/" },
  { issue:"#57", date:"", title:"The All-or-Nothing Notification Switch", blurb:"", link:"https://www.linkedin.com/pulse/all-or-nothing-notification-switch-nandigama-prashanth-kumar-7gywf/" },
  { issue:"#55", date:"", title:"Typing Is Not Activity: The Timeout That Deletes Your Work", blurb:"", link:"https://www.linkedin.com/pulse/typing-activity-timeout-deletes-your-work-nandigama-prashanth-kumar-i77mf/" },
  { issue:"#52", date:"", title:"The Unscoped Delete: when an app won't say which copy it's destroying", blurb:"", link:"https://www.linkedin.com/pulse/unscoped-delete-when-app-wont-say-which-copy-its-destroying-kumar-8jegf/" },
  { issue:"#50", date:"", title:"The Verb With Two Scopes: when \"Delete\" means three different things", blurb:"", link:"https://www.linkedin.com/pulse/verb-two-scopes-when-delete-means-three-different-things-kumar-ffjef/" }
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
    tags:["Workflow","MERN","Design"] },
  { title:"Spacing is a feature", date:"Sep 2026", read:"4 min", kicker:"DESIGN",
    pull:"Whitespace isn't empty. It's the part of the design doing its job without being noticed.",
    body:["The fastest way to make a cramped interface feel calmer isn't a redesign — it's space. Padding, line-height and the gaps between groups do more for clarity than any new component.",
          "Space creates relationships. Two things close together read as related; a gap says 'new idea'. Most confusing screens aren't missing information, they're missing the breathing room that tells you how it's organised.",
          "I treat spacing as a system, not a nudge. A small set of consistent values — 4, 8, 16, 24, 40 — applied everywhere beats eyeballing each margin. The rhythm is what makes a page feel designed.",
          "When a layout feels off and I can't say why, the answer is almost always spacing. Fix the gaps first; reach for colour and borders last."],
    tags:["Design","Layout","Craft"] },
  { title:"The cost of a modal", date:"Sep 2026", read:"3 min", kicker:"UX",
    pull:"Every modal is a tiny interruption. Make sure the user chose it — and can leave without thinking.",
    body:["Modals are tempting because they're easy: drop the content on top, dim the background, done. But every modal stops what the user was doing and demands a decision before they can continue.",
          "That's fine when the user opened it. It's hostile when the app did. A modal that appears unprompted — a promo, a survey, a 'rate us' — spends trust you'll want later.",
          "If I use one, it earns its place: it's the user's action, it's focused on a single task, and the exit is obvious. Escape closes it, a click outside closes it, and the close button is where the hand expects.",
          "The honest test: would this be better as its own page or an inline panel? Often it would. The modal is a last resort, not a default."],
    tags:["UX","Patterns","Trust"] },
  { title:"Naming things in a MERN stack", date:"Aug 2026", read:"5 min", kicker:"ENGINEERING",
    pull:"Half of clean code is just honest names. The other half is deleting the comment the name made unnecessary.",
    body:["Across a MERN app the same idea travels through a Mongoose model, an Express route, a React prop and a piece of state. If it's called four different things, every handoff costs a translation.",
          "I try to name the concept once and carry it everywhere. If the database calls it an invoice, the API, the component and the variable say invoice too. Boring, consistent names are a feature.",
          "Good names also kill comments. When I feel the urge to explain what a function does, I first try renaming it so the explanation isn't needed. A comment that restates the code is a name that gave up.",
          "It sounds trivial until you're six months in and onboarding someone. Clear names are the cheapest documentation you'll ever write, and the only kind that can't go stale."],
    tags:["MERN","Code","Craft"] },
  { title:"Designing the error state", date:"Aug 2026", read:"4 min", kicker:"PROCESS",
    pull:"The error state is where your product apologises. Write it like you mean it.",
    body:["Happy paths get all the attention in design reviews. But users meet the error state at their worst moment — something broke, and now they're stuck. That's the screen that decides whether they trust you.",
          "A good error does three things: it says what happened in plain language, it says whose fault it is honestly, and it gives a way forward. 'Something went wrong' fails all three.",
          "I write error copy as if I'm standing next to the person. No codes without an explanation, no blame, and always a next step — retry, go back, or reach a human.",
          "Design the error state early, not as cleanup. If you can't describe what happens when the request fails, you don't fully understand the feature yet."],
    tags:["Process","UX","Copy"] },
  { title:"Ship the boring version first", date:"Jul 2026", read:"4 min", kicker:"WORKFLOW",
    pull:"The flashy version can wait. The boring one tells you what's actually real.",
    body:["Every feature has a tempting version — animations, edge cases, the clever interaction — and a boring version that just works. I ship the boring one first, on purpose.",
          "The boring version is a question to reality: do people use this at all? Does the data look like I expected? Half the polish I imagine up front turns out to decorate a path nobody takes.",
          "It's also faster to be honest about. A plain list ships in a day and teaches me more than a week spent perfecting a carousel for a feature that might get cut.",
          "Polish is real work and it matters — but it's earned. First prove the thing is worth using. Then make it a joy."],
    tags:["Workflow","Product","Shipping"] }
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
