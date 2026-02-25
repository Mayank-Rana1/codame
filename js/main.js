

document.addEventListener('DOMContentLoaded', () => {
    // --- Security: Disable Copying & Right Click & Zoom ---
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('copy', event => event.preventDefault());
    document.addEventListener('cut', event => event.preventDefault());
    document.addEventListener('paste', event => event.preventDefault());
    // Prevent Zoom
    document.addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
            e.preventDefault();
        }
    });

    // Show loading screen with CODAME text
    initPreloader();

    // Calculate stroke lengths for consistent animation speed
    initTextAnimation();

    initCursorSpotlight();

    // Inlined Data Store
    renderEvents();
    renderMembers();
    renderCompetitions();

    initScrollObserver();
    initParallax();
    initSmoothScroll();

    // Prevent URL hash on page load
    if (window.location.hash) {
        history.replaceState(null, null, ' ');
    }
});

let globalObserver;

// --- Data Store ---
const MEMBERS_DATA = [
    // Leads 2025-26
    { "name": "Anushka Kathil", "role": "Coordinator", "team": "Leads", "link": "https://www.linkedin.com/in/anushka-kathil-201850203" },
    { "name": "Gaurang Gupta", "role": "Co-coordinator", "team": "Leads", "link": "https://www.linkedin.com/in/gaurang-gupta-6a6444283/" },
    { "name": "Anchal Jain", "role": "CP Lead", "team": "Leads", "link": "https://www.linkedin.com/in/anchaljain06" },
    { "name": "Ambar Mittal", "role": "Events Lead", "team": "Leads", "link": "https://www.linkedin.com/in/ambar-mittal-00a69a326" },
    { "name": "Darsh Dave", "role": "Social Media Lead", "team": "Leads", "link": "https://www.linkedin.com/in/darsh-dave-120062291/" },
    { "name": "Aditya Singh", "role": "Design Lead", "team": "Leads", "link": "https://www.linkedin.com/in/adityasingh0109/" },
    { "name": "Rhythm Duggal", "role": "Outreach Lead", "team": "Leads", "link": "https://www.linkedin.com/in/rhythm-duggal-2bb27630a/" },
    { "name": "Ujjwal Sharma", "role": "Dev Lead", "team": "Leads", "link": "https://www.linkedin.com/in/ujjwal-sharma-b16392222/" },

    // CP Team
    { "name": "Akshay Shrivastava", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/akshay-shrivastava-305a0122a" },
    { "name": "Priyanshu Jain", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/priyanshu-jain7427" },
    { "name": "Menil Patel", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/menil-patel-631278321" },
    { "name": "Mayank Rana", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/mayank-rana17" },
    { "name": "Nikhil Kumar", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/nikhil-kumar-48431b325" },
    { "name": "Anuj Shrivastava", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/anuj-shrivastava-899122325" },
    { "name": "Pranav Patil", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/pranav-patil-745064310" },
    { "name": "Keshav Garg", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/keshavgarg8605" },
    { "name": "Mridu .", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/mridu-96119a328" },
    { "name": "Hariom Gandhile", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/hariom-gandhile-a69848336" },
    { "name": "Rafat Alam", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/rafatalam" },
    { "name": "Prateek Sahu", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/prateek-sahu16" },
    { "name": "Mohit Rai", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/mohit-rai-99323431a" },
    { "name": "Prem Shaw", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/premshaw2311" },
    { "name": "Rahul Kumar", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/rahul-kumar-a5b52a376" },
    { "name": "Sumit Tiwari", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/sumit-tiwari1212" },
    { "name": "Manoor Ansari", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/manoor-ansari" },
    { "name": "Daksh Jain", "role": "CP Team", "team": "CP Wing", "link": "https://in.linkedin.com/in/daksh-jain23" },

    // Core Team
    { "name": "Aayush Yadav", "role": "Events Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/aayush-yadav-30527331a" },
    { "name": "Shatakshi Chowksey", "role": "Events Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/shatakshi-chowksey-347ab7324" },
    { "name": "Prince Purohit", "role": "Events Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/prince-purohit-a35375324" },
    { "name": "Varun Dixit", "role": "Events Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/varun-dixit-10626333a" },
    { "name": "Prakhar Manek", "role": "Outreach Executive", "team": "Core Team", "link": "#" },
    { "name": "Sanskriti Mishra", "role": "Outreach Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/sanskriti-mishra26" },
    { "name": "Vivek Jha", "role": "Outreach Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/vivek-jha-7b9788276" },
    { "name": "Aman Kumar", "role": "Outreach Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/aman-kumar1405" },
    { "name": "Sarthak Patil", "role": "Development Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/sarthaknpatil" },
    { "name": "Girdhar Shukla", "role": "Development Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/girdhar-shukla-434a72322" },
    { "name": "Anik Aryan", "role": "Development Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/anikaryan" },
    { "name": "Yajur Chatnani", "role": "Social Media", "team": "Core Team", "link": "https://in.linkedin.com/in/yajurchatnani" },
    { "name": "Atharv Agrawal", "role": "Social Media", "team": "Core Team", "link": "https://in.linkedin.com/in/atharvagrawal1704" },
    { "name": "Naman Chaddha", "role": "Content", "team": "Core Team", "link": "https://in.linkedin.com/in/naman-chaddha-120250345" },
    { "name": "Hardik Garg", "role": "Content", "team": "Core Team", "link": "https://in.linkedin.com/in/hardik-garg-156019314" },
    { "name": "Aman Sharma", "role": "Video Editing", "team": "Core Team", "link": "https://in.linkedin.com/in/aman-sharma-76084933a" },
    { "name": "Karan Mishra", "role": "Video Editing", "team": "Core Team", "link": "https://in.linkedin.com/in/karan-mishra-59a075320" },
    { "name": "Tanishq Yadav", "role": "Design Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/tanishq-yadav-a79162313" },
    { "name": "Venkat Relangi", "role": "Design Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/venkat-relangi-174587318" },
    { "name": "Jayesh Kumar", "role": "Design Executive", "team": "Core Team", "link": "https://in.linkedin.com/in/jayesh-kumar-8355bb32a" }
];

const EVENTS_DATA = [
    { "title": "CodeWars 2025", "date": "Jan 15, 2025", "status": "Upcoming", "description": "The ultimate competitive programming battle. Prove your logic." },
    { "title": "Intro to Graph Theory", "date": "Dec 10, 2024", "status": "Past", "description": "A deep dive into BFS, DFS, and Dijkstra's algorithm." },
    { "title": "Weekly Contest #42", "date": "Every Sunday", "status": "Recurring", "description": "Sharpen your skills with our weekly rapid-fire coding rounds." }
];

// --- 3. Members Rendering (Home: Leads Only) ---
// --- 3. Members Rendering (Unified) ---
function renderMembers() {
    // 1. Home Page Rendering (Leads Only)
    const homeContainer = document.getElementById('members-grid');
    if (homeContainer) {
        const displayMembers = MEMBERS_DATA.filter(m => m.team === "Leads");
        homeContainer.innerHTML = displayMembers.map(member => `
            <div class="member-card fade-in-section">
                <a href="${member.link}" target="_blank" style="display:block; color:inherit;">
                    <div class="member-avatar"></div> 
                    <h3 class="member-name">${member.name}</h3>
                    <p class="member-role">${member.role}</p>
                    <span class="member-team-badge">${member.team}</span>
                </a>
            </div>
        `).join('');

        const loadMoreBtn = document.createElement('div');
        loadMoreBtn.className = 'load-more-container fade-in-section';
        loadMoreBtn.innerHTML = `<button class="btn-primary magnetic-btn" onclick="window.location.href='members.html'">View All Members</button>`;
        Object.assign(loadMoreBtn.style, { textAlign: 'center', marginTop: '2rem', width: '100%' });
        homeContainer.parentNode.appendChild(loadMoreBtn);
    }

    // 2. All Members Page Rendering (Grouped by Team)
    const allMembersContainer = document.getElementById('all-members-grid');
    if (allMembersContainer) {
        // Define team order
        const teamOrder = ["Leads", "CP Team", "Core Team"];
        const grouped = {};

        // Group data with Normalization
        MEMBERS_DATA.forEach(member => {
            let teamName = member.team;
            // Normalize "CP Wing" to "CP Team" to match user request
            if (teamName === "CP Wing") teamName = "CP Team";
            // Normalize "Leads 2025-26" to "Leads" if needed
            if (teamName.includes("Leads")) teamName = "Leads";

            if (!grouped[teamName]) grouped[teamName] = [];
            grouped[teamName].push(member);
        });

        // HTML Builder
        const htmlContent = teamOrder.map(teamName => {
            const members = grouped[teamName];
            if (!members) return '';

            return `
                <div class="team-section" style="margin-bottom: 4rem;">
                    <h3 style="font-size: 1.8rem; margin-bottom: 2rem; color: var(--text-primary); border-left: 4px solid var(--text-primary); padding-left: 1rem; text-transform:uppercase; letter-spacing:0.05em;">
                        ${teamName}
                    </h3>
                    <div class="members-grid">
                        ${members.map(member => `
                            <div class="member-card">
                                <a href="${member.link}" target="_blank" style="display:block; color:inherit;">
                                    <div class="member-avatar"></div>
                                    <h3 class="member-name">${member.name}</h3>
                                    <p class="member-role">${member.role}</p>
                                    <span class="member-team-badge">${member.team}</span>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        allMembersContainer.innerHTML = htmlContent;
    }
}


// --- 2. Live Competitions API (Robust Fallback) ---
// --- 2. Live Competitions API (Optimized: Cache-First + Parallel Fetch) ---
// --- Generators & Caching Logic ---

// Use allorigins to bypass CORS for free APIs
async function fetchWithProxy(url) {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Proxy Failed');
    const json = await response.json();
    return JSON.parse(json.contents);
}

// Generate fallback data if API fails to prevent empty sections
const generateFallbackContests = () => {
    // Keep a simple fallback just in case
    const fallback = [];
    const now = new Date();

    const nextCC = new Date(now);
    nextCC.setUTCHours(14, 30, 0, 0);
    const dayDiff = (3 - nextCC.getUTCDay() + 7) % 7;
    nextCC.setDate(nextCC.getDate() + (dayDiff === 0 && nextCC < now ? 7 : dayDiff));

    fallback.push({
        name: "CodeChef Starters",
        site: "CodeChef",
        start_time: nextCC.getTime(),
        duration: 7200,
        url: "https://www.codechef.com/contests",
        status: "BEFORE"
    });
    return fallback;
};

// Fetch real CodeChef contests
async function fetchCodeChefContests() {
    try {
        // CodeChef API might require a proxy due to CORS. Using allorigins raw as it does not get rate limited as easily as corsproxy for simple GETs.
        const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.codechef.com/api/list/contests/all'));
        if (!response.ok) throw new Error('CodeChef Proxy Failed');
        const data = await response.json();

        if (data && data.future_contests) {
            return data.future_contests.map(c => ({
                name: c.contest_name,
                site: 'CodeChef',
                start_time: new Date(c.contest_start_date_iso).getTime(),
                duration: parseInt(c.contest_duration) * 60, // duration is in minutes
                url: `https://www.codechef.com/${c.contest_code}`,
                status: 'BEFORE'
            }));
        }
        return generateFallbackContests();
    } catch (e) {
        console.warn("CodeChef API Failed, using fallback. Error:", e);
        return generateFallbackContests();
    }
}

// Fetch real LeetCode contests
async function fetchLeetCodeContests() {
    const query = `
        query upcomingContests {
            topTwoContests {
                title
                titleSlug
                startTime
                duration
                cardImg
            }
        }
    `;
    try {
        const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://leetcode.com/graphql'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query })
        });

        if (!response.ok) throw new Error('LeetCode GraphQL proxy failed');
        const jsonResponse = await response.json();
        const lcData = jsonResponse.data?.topTwoContests || [];

        if (lcData.length > 0) {
            return lcData.map(c => ({
                name: c.title,
                site: 'LeetCode',
                start_time: c.startTime * 1000,
                duration: c.duration,
                url: `https://leetcode.com/contest/${c.titleSlug}`,
                status: 'BEFORE'
            }));
        }
        return generateFallbackContests();
    } catch (e) {
        console.warn("LeetCode API wrapper Failed:", e);
        return generateFallbackContests();
    }
}

async function fetchCodeforcesCached() {
    const CACHE_KEY = 'codame_cf_cache_daily';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

    const now = Date.now();
    const cached = localStorage.getItem(CACHE_KEY);

    // 1. Try Cache
    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            if (now - timestamp < CACHE_DURATION) {
                console.log("Using Cached Codeforces Data");
                return data;
            }
        } catch (e) { localStorage.removeItem(CACHE_KEY); }
    }

    // 2. Fetch Fresh
    console.log("Fetching Fresh Codeforces Data...");
    try {
        const timeout = 6000;
        const fetchWithTimeout = (url) => Promise.race([
            fetch(url),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
        ]);

        const response = await fetchWithTimeout('https://codeforces.com/api/contest.list?gym=false');
        if (!response.ok) throw new Error('API Failed');
        const json = await response.json();

        if (json.status === 'OK') {
            const cfContests = json.result
                .filter(c => c.phase === 'BEFORE' || c.phase === 'CODING')
                .map(c => ({
                    name: c.name,
                    site: 'CodeForces',
                    start_time: c.startTimeSeconds * 1000,
                    duration: c.durationSeconds,
                    url: `https://codeforces.com/contest/${c.id}`,
                    status: c.phase === 'CODING' ? 'CODING' : 'BEFORE'
                }));

            // Save to Cache
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: now,
                data: cfContests
            }));

            return cfContests;
        }
    } catch (e) {
        console.warn("CF Fetch Failed:", e);
        return []; // Fail gracefully
    }
}

async function renderCompetitions() {
    const container = document.getElementById('competitions-list');
    if (!container) return;

    // Show lightweight scanner initially
    container.innerHTML = '<div style="text-align:center; padding:2rem; opacity:0.6; font-family:monospace;">Scanning live frequencies...</div>';

    try {
        const combined = [];

        // 1. Fetch Codeforces, CodeChef, and LeetCode Concurrently
        const [cfResult, ccResult, lcResult] = await Promise.allSettled([
            fetchCodeforcesCached(),
            fetchCodeChefContests(),
            fetchLeetCodeContests()
        ]);

        if (cfResult.status === 'fulfilled' && cfResult.value) {
            const sortedCF = cfResult.value.sort((a, b) => a.start_time - b.start_time);
            combined.push(...sortedCF.slice(0, 5)); // Top 5 CF
        }

        if (ccResult.status === 'fulfilled' && ccResult.value) {
            const sortedCC = ccResult.value.sort((a, b) => a.start_time - b.start_time);
            combined.push(...sortedCC.slice(0, 3)); // Top 3 CC
        }

        if (lcResult.status === 'fulfilled' && lcResult.value) {
            const sortedLC = lcResult.value.sort((a, b) => a.start_time - b.start_time);
            combined.push(...sortedLC.slice(0, 3)); // Top 3 LC
        }

        // 3. Sort & Render
        const now = new Date();
        const valid = combined.filter(c => {
            const end = c.start_time + (c.duration * 1000);
            return end > now.getTime();
        });

        const upcoming = valid
            .sort((a, b) => a.start_time - b.start_time)
            .slice(0, 10); // Top 10 combined upcoming

        if (upcoming.length > 0) {
            container.innerHTML = upcoming.map(c => {
                const dateObj = new Date(c.start_time);
                const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const durationHrs = (Number(c.duration) / 3600).toFixed(1);
                let siteClass = 'codeforces';
                if (c.site.toLowerCase().includes('codechef')) siteClass = 'codechef';
                else if (c.site.toLowerCase().includes('leetcode')) siteClass = 'leetcode';

                const startTime = c.start_time;
                const endTime = startTime + (c.duration * 1000);
                const isLive = now.getTime() >= startTime && now.getTime() < endTime;

                return `
                <div class="competition-card fade-in-section">
                    <div class="comp-date" style="text-align:center; min-width:80px;">
                        <div style="font-weight:700; font-size:1.1rem; line-height:1;">${dateObj.getDate()}</div>
                        <div style="font-size:0.8rem; text-transform:uppercase; opacity:0.7;">${dateStr.split(' ')[0]}</div>
                    </div>
                    <div class="comp-info">
                        <h3 style="font-size:1rem; margin-bottom:0.25rem;">
                            ${c.name}
                            ${isLive ? '<span class="comp-status live" style="margin-left:8px; font-size:0.7rem; vertical-align:middle;">LIVE</span>' : ''}
                        </h3>
                        <p style="font-size:0.85rem; opacity:0.7;">
                             ${isLive
                        ? `<span style="color:#4CAF50; font-weight:bold;">Ends in ${((endTime - now.getTime()) / 3600000).toFixed(1)}h</span>`
                        : dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    } • 
                            ${durationHrs}h • <span class="site-badge ${siteClass}">${c.site}</span>
                        </p>
                    </div>
                    <a href="${c.url}" target="_blank" class="btn-primary magnetic-btn" style="padding: 0.6rem 1.2rem; font-size: 0.8rem; white-space:nowrap;">
                        ${isLive ? 'Compete' : 'Register'}
                    </a>
                </div>
                `;
            }).join('');

            if (globalObserver) {
                container.querySelectorAll('.competition-card').forEach(el => globalObserver.observe(el));
            }

        } else {
            container.innerHTML = '<div style="text-align:center; padding:2rem; opacity:0.6; font-family:monospace;">No upcoming contests found.</div>';
        }

    } catch (e) {
        console.warn("Contest logic failed:", e);
        container.innerHTML = '<div style="text-align:center; padding:2rem; opacity:0.6; font-family:monospace;">Contest Signal Lost.</div>';
    }
}


// --- 4. Events Rendering ---
function renderEvents() {
    const container = document.getElementById('events-grid');
    if (!container) return;

    container.innerHTML = EVENTS_DATA.map(event => `
        <div class="event-card fade-in-section">
            <div class="event-image"></div>
            <div class="event-content">
                <div class="event-meta">
                    <span>${event.date}</span>
                    <span>${event.status}</span>
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-desc">${event.description}</p>
            </div>
        </div>
    `).join('');
}

// --- Dynamic Text Animation Setup ---
function initTextAnimation() {
    // Wait a bit for fonts to load and SVG to render
    setTimeout(() => {
        const baseText = document.querySelector('.base-text');
        const highlightText = document.querySelector('.highlight-text');

        if (baseText && highlightText) {
            // Calculate actual path lengths
            const baseLength = baseText.getComputedTextLength();
            const highlightLength = highlightText.getComputedTextLength();

            // Use smaller multiplier to ensure drawing fills the whole animation time
            // Previously 12, which caused 90% of animation to be invisible waiting
            const strokeLength = baseLength * 3;

            // Update CSS custom properties for animation
            document.documentElement.style.setProperty('--stroke-length', strokeLength);

            // Apply to ALL instances (Preloader + Hero)
            document.querySelectorAll('.base-text, .highlight-text').forEach(el => {
                el.style.strokeDasharray = strokeLength;
                // Only set offset if not animating via CSS (Preloader handles its own offset)
                // el.style.strokeDashoffset = strokeLength; 
            });
        }
    }, 100);

    // Recalculate on window resize to maintain consistency
    window.addEventListener('resize', () => {
        const baseText = document.querySelector('.base-text');
        const highlightText = document.querySelector('.highlight-text');

        if (baseText && highlightText) {
            const baseLength = baseText.getComputedTextLength();
            const strokeLength = baseLength * 12; // Same multiplier

            baseText.style.strokeDasharray = strokeLength;
            baseText.style.strokeDashoffset = strokeLength;

            highlightText.style.strokeDasharray = strokeLength;
            highlightText.style.strokeDashoffset = strokeLength;

            document.documentElement.style.setProperty('--stroke-length', strokeLength);
        }
    });
}

// --- Preloader & Effects ---
function initPreloader() {
    // Force Scroll to Top on Reload
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const preloader = document.querySelector('#preloader');
    const baseText = document.querySelector('#preloader .base-text');

    const finishLoading = () => {
        if (preloader && !preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            // Trigger reveal animations on main content
            document.querySelectorAll('.reveal-text').forEach(el => el.classList.add('animate'));
        }
    };

    // Event-driven: Finish exactly when animation ends
    if (baseText) {
        baseText.addEventListener('animationend', finishLoading);
    }

    // Safety fallback: Ensure it runs even if event misses
    // CHANGE BACKUP TIME HERE (should be slightly longer than CSS animation)
    setTimeout(finishLoading, 800);
}


// --- 5. Interactive Cursor & 3D Tilt (OPTIMIZED) ---
function initCursorSpotlight() {
    const heroBg = document.querySelector('#hero-bg');

    // Create Custom Cursor Element
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.textContent = '</>';
    cursor.style.opacity = '0';
    document.body.appendChild(cursor);

    // Create Pointer Light Element (New Optimized Flashlight)
    const pointerLight = document.createElement('div');
    pointerLight.id = 'pointer-light';
    document.body.appendChild(pointerLight);

    let mouseX = -5000;
    let mouseY = -5000;
    let isMouseActive = false;

    // Throttle function for performance
    function throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    }

    // Update cursor position (runs on every mousemove for smoothness)
    function updateCursor(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isMouseActive) {
            document.body.classList.add('mouse-active');
            cursor.style.opacity = '1';
            isMouseActive = true;
        }

        // Update cursor position immediately for smoothness
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;

        // Update Pointer Light Position (Centered: -300px offset for 600px width)
        pointerLight.style.transform = `translate3d(${mouseX - 300}px, ${mouseY - 300}px, 0)`;
    }

    // Throttled expensive operations
    const updateMaskAndParallax = throttle(() => {
        // Update SVG Flashlight Mask
        const maskCircle = document.getElementById('mask-circle');
        if (maskCircle) {
            maskCircle.setAttribute('cx', mouseX);
            maskCircle.setAttribute('cy', mouseY + window.scrollY);
        }

        // Background Parallax
        if (heroBg) {
            const moveX = (mouseX / window.innerWidth - 0.5) * 15;
            const moveY = (mouseY / window.innerHeight - 0.5) * 15;
            heroBg.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
        }
    }, 16); // ~60fps

    // 3D Tilt - Only for cards near cursor (heavily throttled)
    const update3DTilt = throttle(() => {
        const cards = document.querySelectorAll('.competition-card, .event-card, .resource-item, .member-card');

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const isNearby = (
                mouseX > rect.left - 100 && mouseX < rect.right + 100 &&
                mouseY > rect.top - 100 && mouseY < rect.bottom + 100
            );

            if (isNearby) {
                const x = mouseX - (rect.left + rect.width / 2);
                const y = mouseY - (rect.top + rect.height / 2);
                const rotateX = (y / rect.height) * -8;
                const rotateY = (x / rect.width) * 8;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            } else {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            }
        });
    }, 32); // ~30fps for 3D tilt is enough

    // Main mousemove handler
    document.addEventListener('mousemove', (e) => {
        updateCursor(e);
        updateMaskAndParallax();
        update3DTilt();
    });

    // Reset cursor size on scroll to prevent "stuck" hover state
    window.addEventListener('scroll', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }, { passive: true });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            updateMaskAndParallax();
        }
    }, { passive: true });

    // Cursor hover effects (Event Delegation for Dynamic Elements)
    document.addEventListener('mouseover', (e) => {
        // Only scale up for actionable elements (Links & Buttons)
        // This fixes the issue where non-clickable cards triggered the effect
        const target = e.target.closest('a, button, input[type="submit"], input[type="button"]');

        if (target) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.mixBlendMode = 'difference'; // Ensure visibility
        } else {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });

    // We don't strictly need mouseout if mouseover handles the "else" case? 
    // No, mouseover only fires when entering a NEW element. If I move from Button to Empty Space, 
    // I trigger mouseover on "body" (or container).
    // So the `else` block in mouseover above covers "entering non-interactive space".
    // BUT we must filter against "bubbling" from children. 
    // Actually, `e.target` is the deepest element. 
    // If I hover `button > span`, target is span. `closest` finds button. Scale 1.5. Correct.
    // If I hover `div` (background), target is div. `closest` is null. Scale 1. Correct.
    // So the simple `mouseover` handler covering both cases is sufficient and robust!
}

function initScrollObserver() {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    globalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                globalObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    setTimeout(() => {
        document.querySelectorAll('.fade-in-section, .section-header, .competition-card, .resource-item, .hero-actions, .hero-subtitle').forEach(el => globalObserver.observe(el));
    }, 100);
}

// --- Smooth Scroll Without URL Hash ---
function initSmoothScroll() {
    document.querySelectorAll('[data-scroll]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-scroll');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navHeight = 80; // navbar height
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initParallax() {
    const logoLayer = document.querySelector('.hero-logo-layer');
    if (!logoLayer) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Simple white fill effect on scroll (0-600px)
        if (scrolled < 600) {
            const baseText = logoLayer.querySelector('.base-text');
            const highlightText = logoLayer.querySelector('.highlight-text');

            if (baseText && highlightText) {
                // Calculate fill progress (0 to 1)
                const progress = Math.min(scrolled / 600, 1);

                // Gradually fill with white as you scroll
                const fillOpacity = progress * 0.8; // Max 0.8 fill opacity
                const strokeOpacity = 0.2 + (progress * 0.3); // 0.2 to 0.5

                baseText.style.fill = `rgba(255, 255, 255, ${fillOpacity})`;
                baseText.style.stroke = `rgba(255, 255, 255, ${strokeOpacity})`;

                highlightText.style.fill = `rgba(255, 255, 255, ${fillOpacity})`;
                highlightText.style.stroke = `rgba(255, 255, 255, ${strokeOpacity + 0.2})`;
            }
        } else {
            // Fully white at 600px+
            const baseText = logoLayer.querySelector('.base-text');
            const highlightText = logoLayer.querySelector('.highlight-text');

            if (baseText && highlightText) {
                baseText.style.fill = 'rgba(255, 255, 255, 0.8)';
                baseText.style.stroke = 'rgba(255, 255, 255, 0.5)';
                highlightText.style.fill = 'rgba(255, 255, 255, 0.8)';
                highlightText.style.stroke = 'rgba(255, 255, 255, 0.7)';
            }
        }
    });
}
