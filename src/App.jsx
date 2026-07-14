import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Calendar,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock,
  Compass,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  Heart,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Map,
  MapPin,
  Menu,
  Mountain,
  Plane,
  Plus,
  Route,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { TrailScene } from "./components/TrailScene.jsx";
import { bookings, formatMoney, trips, waitlist } from "./data/trips.js";
import { navigate, useHashRoute } from "./hooks/useHashRoute.js";
import { useScrollProgress } from "./hooks/useScrollProgress.js";
import { asset } from "./utils/assets.js";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function ButtonLink({ href, children, variant = "primary", icon = true }) {
  return (
    <a className={`button ${variant}`} href={href}>
      <span>{children}</span>
      {icon ? <ArrowRight size={18} aria-hidden="true" /> : null}
    </a>
  );
}

function PublicNav({ current }) {
  const [open, setOpen] = useState(false);
  const navItems = [
    ["Trips", "#/trips"],
    ["About", "#/about"],
    ["Reviews", "#/reviews"],
    ["FAQ", "#/faq"],
    ["Admin demo", "#/admin"],
  ];

  return (
    <header className="site-header">
      <a className="brand" href="#/" aria-label="Rhiannon Hikes home">
        <Mountain size={30} strokeWidth={1.7} aria-hidden="true" />
        <span>
          Rhiannon
          <strong>Hikes</strong>
        </span>
      </a>
      <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        <span className="sr-only">Toggle navigation</span>
      </button>
      <nav className={open ? "site-nav open" : "site-nav"} aria-label="Primary navigation">
        {navItems.map(([label, href]) => (
          <a key={href} className={current === href.replace("#", "") ? "active" : ""} href={href}>
            {label}
          </a>
        ))}
        <a className="nav-cta" href="#/trips">
          Book a trip
        </a>
      </nav>
    </header>
  );
}

function SectionIntro({ eyebrow, title, body, light = false }) {
  return (
    <div className={light ? "section-intro light" : "section-intro"}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

function TripCard({ trip, compact = false }) {
  const prefersReducedMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rawRotateX = useTransform(tiltY, [-0.5, 0.5], [5, -5]);
  const rawRotateY = useTransform(tiltX, [-0.5, 0.5], [-7, 7]);
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 24 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 24 });

  const handlePointerMove = (event) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(x);
    tiltY.set(y);
    event.currentTarget.style.setProperty("--glint-x", `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--glint-y", `${(y + 0.5) * 100}%`);
  };

  const handlePointerLeave = (event) => {
    tiltX.set(0);
    tiltY.set(0);
    event.currentTarget.style.setProperty("--glint-x", "50%");
    event.currentTarget.style.setProperty("--glint-y", "18%");
  };

  return (
    <motion.article
      className={compact ? "trip-card compact" : "trip-card"}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={fadeUp}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
    >
      <a className="trip-image-link" href={`#/trip/${trip.id}`} aria-label={`View ${trip.title}`}>
        <img src={trip.image} alt={`${trip.destination} adventure landscape`} loading="lazy" />
        <span className={trip.status === "Waitlist" ? "trip-status waitlist" : "trip-status"}>
          {trip.status === "Waitlist" ? "Waitlist open" : `${trip.spotsLeft} spots left`}
        </span>
        <span className="destination-chip">
          <MapPin size={16} aria-hidden="true" />
          {trip.destination}
        </span>
      </a>
      <div className="trip-card-body">
        <div>
          <h3>{trip.title}</h3>
          <p>{trip.summary}</p>
        </div>
        <dl className="trip-facts">
          <div>
            <Calendar size={17} aria-hidden="true" />
            <dt>Dates</dt>
            <dd>{trip.dates}</dd>
          </div>
          <div>
            <Clock size={17} aria-hidden="true" />
            <dt>Length</dt>
            <dd>{trip.length}</dd>
          </div>
          <div>
            <Mountain size={17} aria-hidden="true" />
            <dt>Level</dt>
            <dd>{trip.difficulty}</dd>
          </div>
          <div>
            <CircleDollarSign size={17} aria-hidden="true" />
            <dt>Deposit</dt>
            <dd>{formatMoney(trip.deposit)}</dd>
          </div>
        </dl>
        <div className="trip-actions">
          <ButtonLink href={trip.status === "Waitlist" ? "#/trips" : `#/book/${trip.id}`}>
            {trip.status === "Waitlist" ? "Join waitlist" : "Secure your spot"}
          </ButtonLink>
          <a className="text-link" href={`#/trip/${trip.id}`}>
            View itinerary
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function HomePage() {
  const progress = useScrollProgress(1800);
  const reducedMotion = useReducedMotion();
  const trailStoryRef = useRef(null);
  const { scrollYProgress: trailScroll } = useScroll({
    target: trailStoryRef,
    offset: ["start end", "end start"],
  });
  const trailTextY = useTransform(trailScroll, [0, 1], [70, -42]);
  const trailPhotoY = useTransform(trailScroll, [0, 1], [80, -68]);
  const trailLineScale = useTransform(trailScroll, [0.18, 0.78], [0, 1]);
  const routePercent = Math.min(100, Math.round(progress * 100));
  const featuredTrips = trips.slice(0, 2);
  const trailSteps = [
    {
      title: "Sell the feeling",
      body: "A cinematic public site makes the trip feel hosted, social and worth the deposit.",
    },
    {
      title: "Earn the booking",
      body: "Trip pages explain dates, difficulty, inclusions and the payment schedule before checkout.",
    },
    {
      title: "Run the operation",
      body: "The admin side tracks departures, deposits, balances, travellers and launch tasks.",
    },
  ];

  return (
    <>
      <section className="hero-section" aria-labelledby="home-title">
        <div className="hero-image" aria-hidden="true" />
        <TrailScene progress={progress} reducedMotion={Boolean(reducedMotion)} />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Adventure is better together
          </motion.p>
          <motion.h1
            id="home-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.08 }}
          >
            Wild group trips with real people
          </motion.h1>
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.14 }}
          >
            <p>
              Hike, climb and travel with Rhiannon on small-group adventures built around nature,
              culture and connection.
            </p>
            <div className="hero-actions">
              <ButtonLink href="#/trips">View upcoming trips</ButtonLink>
              <ButtonLink href="#/trips" variant="ghost">Join the waitlist</ButtonLink>
            </div>
            <div className="rating-row" aria-label="4.9 out of 5 from 200 travellers">
              <div className="avatar-stack" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <span className="stars">
                <Star size={16} fill="currentColor" aria-hidden="true" />
                <Star size={16} fill="currentColor" aria-hidden="true" />
                <Star size={16} fill="currentColor" aria-hidden="true" />
                <Star size={16} fill="currentColor" aria-hidden="true" />
                <Star size={16} fill="currentColor" aria-hidden="true" />
              </span>
              <strong>4.9/5 from 200+ travellers</strong>
            </div>
            <motion.div
              className="hero-route-card"
              style={{ "--route-progress": `${routePercent}%` }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
            >
              <span>Interactive route preview</span>
              <strong>{routePercent}% trail revealed</strong>
              <div aria-hidden="true">
                <i />
              </div>
              <p>Scroll to unlock the route, trips, checkout and admin view.</p>
            </motion.div>
          </motion.div>
        </div>
        <div className="scroll-note" aria-hidden="true">
          <span>Scroll to explore</span>
          <ChevronRight size={22} />
        </div>
      </section>

      <section className="trail-story" ref={trailStoryRef}>
        <motion.div
          className="trail-text"
          style={reducedMotion ? undefined : { y: trailTextY }}
        >
          <span className="script-label">Follow the trail</span>
          <h2>Every trip should feel planned, personal and a little bit unreal.</h2>
          <p>
            The public site sells the adventure. The booking flow builds trust. The admin dashboard
            keeps every departure, traveller and payment under control.
          </p>
          <div className="trail-readiness" aria-label="Prototype coverage">
            <span>Public site</span>
            <span>Mock checkout</span>
            <span>Admin ops</span>
          </div>
        </motion.div>
        <div className="trail-map-panel" aria-label="Trip promise trail">
          <motion.span
            className="trail-map-line"
            aria-hidden="true"
            style={reducedMotion ? undefined : { scaleY: trailLineScale }}
          />
          {trailSteps.map((item, index) => (
            <motion.div
              className="trail-step"
              key={item.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <span>{index + 1}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="photo-stack"
          style={reducedMotion ? undefined : { y: trailPhotoY }}
        >
          <img src={asset("assets/trip-greece.png")} alt="Greece coastline hiking trip" loading="lazy" />
          <img src={asset("assets/trip-georgia.png")} alt="Georgia Caucasus mountain trip" loading="lazy" />
          <img src={asset("assets/group-sunset.png")} alt="Small group hikers at sunset" loading="lazy" />
        </motion.div>
      </section>

      <section className="upcoming-section" id="trips">
        <div className="section-shell">
          <div className="section-heading-row">
            <SectionIntro
              eyebrow="Upcoming adventures"
              title="Choose your next trip"
              body="Live departures, waitlists and deposit booking in one branded home."
            />
            <a className="text-link strong" href="#/trips">
              View all trips
            </a>
          </div>
          <div className="featured-trips">
            {featuredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Trip trust points">
        {[
          [Users, "Small groups", "Intimate groups of 8-14 people for a better experience."],
          [ShieldCheck, "Deposit booking", "Lock in your spot with a clear payment schedule."],
          [Map, "Real itineraries", "Routes built around local experience, not generic checklists."],
          [Heart, "Solo friendly", "Come solo or with friends. You will always find your people."],
        ].map(([Icon, title, body]) => (
          <div className="trust-item" key={title}>
            <Icon size={28} aria-hidden="true" />
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="story-section" id="about">
        <img src={asset("assets/group-sunset.png")} alt="Small group of hikers celebrating at sunset" loading="lazy" />
        <div>
          <span className="script-label">More than a trip</span>
          <h2>It is a way to meet the people you were meant to travel with.</h2>
          <p>
            Rhiannon Hikes turns a social audience into a real travel community: clear dates, real
            routes, fair deposits, travel prep and a host people already trust.
          </p>
          <div className="story-actions">
            <ButtonLink href="#/trip/greece">Open Greece trip</ButtonLink>
            <ButtonLink href="#/admin" variant="light">View admin demo</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function TripsPage() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const filtered = trips.filter((trip) => {
    const matchesQuery = `${trip.title} ${trip.destination} ${trip.region}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesDifficulty = difficulty === "All" || trip.difficulty === difficulty;
    return matchesQuery && matchesDifficulty;
  });

  return (
    <main className="page public-page">
      <section className="page-hero compact-hero">
        <div>
          <span className="script-label">Trip board</span>
          <h1>Upcoming trips, waitlists and deposit-ready adventures.</h1>
          <p>Browse the trips, inspect the details and follow a mock deposit flow built for Phase 1.</p>
        </div>
      </section>

      <section className="section-shell trips-browser">
        <div className="filter-bar" role="search">
          <label>
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search trips</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by destination"
              type="search"
            />
          </label>
          <label>
            <Filter size={18} aria-hidden="true" />
            <span>Difficulty</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option>All</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </label>
        </div>

        <div className="trip-grid">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} compact />
          ))}
        </div>
      </section>
    </main>
  );
}

function TripDetailPage({ trip }) {
  if (!trip) return <NotFound />;

  return (
    <main className="page public-page">
      <section className="trip-detail-hero" style={{ backgroundImage: `url(${trip.image})` }}>
        <div className="trip-detail-overlay" aria-hidden="true" />
        <div className="trip-detail-copy">
          <span className="trip-status">{trip.status === "Waitlist" ? "Waitlist" : `${trip.spotsLeft} spots left`}</span>
          <h1>{trip.title}</h1>
          <p>{trip.story}</p>
          <div className="detail-facts">
            <span>
              <Calendar size={18} aria-hidden="true" />
              {trip.dates}
            </span>
            <span>
              <Clock size={18} aria-hidden="true" />
              {trip.length}
            </span>
            <span>
              <Mountain size={18} aria-hidden="true" />
              {trip.difficulty}
            </span>
          </div>
        </div>
      </section>

      <section className="section-shell trip-detail-layout">
        <article className="detail-main">
          <SectionIntro
            eyebrow="The adventure"
            title="Built for people who want the trail and the group."
            body={trip.summary}
          />
          <div className="highlight-grid">
            {trip.highlights.map((highlight) => (
              <div className="highlight-item" key={highlight}>
                <Check size={18} aria-hidden="true" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          <div className="split-content">
            <section>
              <h2>Included</h2>
              <ul>
                {trip.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2>Not included</h2>
              <ul>
                {trip.notIncluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="itinerary-section">
            <span className="script-label">Itinerary preview</span>
            <h2>Day-by-day trail</h2>
            <div className="itinerary-list">
              {trip.itinerary.map((item, index) => (
                <motion.div
                  className="itinerary-item"
                  key={item.day}
                  initial={{ opacity: 0, x: 22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.36, delay: index * 0.05 }}
                >
                  <span>{item.day}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </article>

        <aside className="booking-panel" aria-label="Booking summary">
          <div className="panel-topline">
            <span>From</span>
            <strong>{formatMoney(trip.price)}</strong>
          </div>
          <dl>
            <div>
              <dt>Deposit today</dt>
              <dd>{formatMoney(trip.deposit)}</dd>
            </div>
            <div>
              <dt>Group size</dt>
              <dd>{trip.groupSize}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{trip.status}</dd>
            </div>
          </dl>
          <ButtonLink href={trip.status === "Waitlist" ? "#/trips" : `#/book/${trip.id}`}>
            {trip.status === "Waitlist" ? "Join waitlist" : "Reserve deposit"}
          </ButtonLink>
          <p className="secure-note">
            <LockKeyhole size={16} aria-hidden="true" />
            Prototype checkout only. No payment is collected.
          </p>
        </aside>
      </section>
    </main>
  );
}

function BookingFlow({ trip }) {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("deposit");
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!trip) return <NotFound />;

  const dueToday = payment === "deposit" ? trip.deposit : trip.price;
  const balance = trip.price - dueToday;

  return (
    <main className="page booking-page">
      <section className="booking-shell">
        <div className="booking-main">
          <a className="text-link" href={`#/trip/${trip.id}`}>
            Back to {trip.title}
          </a>
          <h1>Reserve your spot</h1>
          <p>
            This Phase 1 checkout demonstrates the traveller journey. It is ready to connect to
            Stripe and email automations in the next phase.
          </p>

          <div className="stepper" aria-label="Booking progress">
            {["Payment", "Traveller", "Review"].map((label, index) => (
              <button
                type="button"
                key={label}
                className={step === index + 1 ? "active" : step > index + 1 || submitted ? "complete" : ""}
                onClick={() => setStep(index + 1)}
                aria-current={step === index + 1 ? "step" : undefined}
              >
                <span>{index + 1}</span>
                {label}
              </button>
            ))}
          </div>

          {submitted ? (
            <motion.section
              className="success-state"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
            >
              <BadgeCheck size={44} aria-hidden="true" />
              <h2>Spot reserved in prototype mode</h2>
              <p>
                The future production version would now create a booking, send a confirmation email
                and add the traveller to the admin dashboard.
              </p>
              <ButtonLink href="#/admin">View booking in admin</ButtonLink>
            </motion.section>
          ) : null}

          {!submitted && step === 1 ? (
            <section className="form-panel">
              <h2>Choose payment option</h2>
              <div className="payment-options">
                <button
                  type="button"
                  className={payment === "deposit" ? "selected" : ""}
                  onClick={() => setPayment("deposit")}
                >
                  <CreditCard size={22} aria-hidden="true" />
                  <strong>Pay deposit</strong>
                  <span>{formatMoney(trip.deposit)} today</span>
                </button>
                <button
                  type="button"
                  className={payment === "full" ? "selected" : ""}
                  onClick={() => setPayment("full")}
                >
                  <CircleDollarSign size={22} aria-hidden="true" />
                  <strong>Pay in full</strong>
                  <span>{formatMoney(trip.price)} today</span>
                </button>
              </div>
              <button className="button primary" type="button" onClick={() => setStep(2)}>
                Continue to traveller details <ArrowRight size={18} aria-hidden="true" />
              </button>
            </section>
          ) : null}

          {!submitted && step === 2 ? (
            <section className="form-panel">
              <h2>Traveller details</h2>
              <div className="form-grid">
                <label>
                  Full name
                  <input type="text" defaultValue="Alex Morgan" autoComplete="name" />
                </label>
                <label>
                  Email
                  <input type="email" defaultValue="alex@example.com" autoComplete="email" />
                </label>
                <label>
                  Room preference
                  <select defaultValue="Twin share">
                    <option>Twin share</option>
                    <option>Private room request</option>
                    <option>No preference</option>
                  </select>
                </label>
                <label>
                  Dietary notes
                  <input type="text" placeholder="Vegetarian, allergies, none" />
                </label>
              </div>
              <label className="full-label">
                Emergency contact
                <input type="text" placeholder="Name and phone number" />
              </label>
              <button className="button primary" type="button" onClick={() => setStep(3)}>
                Review booking <ArrowRight size={18} aria-hidden="true" />
              </button>
            </section>
          ) : null}

          {!submitted && step === 3 ? (
            <section className="form-panel">
              <h2>Review and reserve</h2>
              <div className="review-lines">
                <div>
                  <span>Trip</span>
                  <strong>{trip.title}</strong>
                </div>
                <div>
                  <span>Due today</span>
                  <strong>{formatMoney(dueToday)}</strong>
                </div>
                <div>
                  <span>Remaining balance</span>
                  <strong>{formatMoney(balance)}</strong>
                </div>
              </div>
              <label className="terms-check">
                <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
                <span>I understand this is a prototype and no payment will be collected.</span>
              </label>
              <button className="button primary" type="button" disabled={!accepted} onClick={() => setSubmitted(true)}>
                Reserve prototype spot <ArrowRight size={18} aria-hidden="true" />
              </button>
            </section>
          ) : null}
        </div>

        <aside className="booking-summary">
          <img src={trip.image} alt={`${trip.destination} trip preview`} />
          <h2>{trip.title}</h2>
          <dl>
            <div>
              <dt>Dates</dt>
              <dd>{trip.dates}</dd>
            </div>
            <div>
              <dt>Deposit</dt>
              <dd>{formatMoney(trip.deposit)}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatMoney(trip.price)}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}

function AdminDashboard() {
  const [module, setModule] = useState("Dashboard");
  const [selectedTripId, setSelectedTripId] = useState("greece");
  const [toast, setToast] = useState("");
  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) || trips[0];
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.paid, 0);
  const remainingBalance = bookings.reduce((sum, booking) => sum + booking.balance, 0);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const modules = [
    [LayoutDashboard, "Dashboard"],
    [Route, "Trips"],
    [ClipboardList, "Bookings"],
    [UserCheck, "Travellers"],
    [Mail, "Messages"],
    [Settings, "Settings"],
  ];

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#/">
          <Mountain size={28} aria-hidden="true" />
          <span>Rhiannon Ops</span>
        </a>
        <nav aria-label="Admin navigation">
          {modules.map(([Icon, label]) => (
            <button key={label} className={module === label ? "active" : ""} type="button" onClick={() => setModule(label)}>
              <Icon size={19} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
        <a className="admin-back" href="#/">
          Public site <ArrowRight size={16} aria-hidden="true" />
        </a>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div>
            <span>Phase 1 admin prototype</span>
            <h1>{module}</h1>
          </div>
          <div className="admin-actions">
            <button type="button" onClick={() => notify("Manifest export queued")}>
              <Download size={18} aria-hidden="true" />
              Export
            </button>
            <button type="button" onClick={() => notify("New departure draft opened")}>
              <Plus size={18} aria-hidden="true" />
              New trip
            </button>
          </div>
        </header>

        {toast ? <div className="toast" role="status">{toast}</div> : null}

        {module === "Dashboard" ? (
          <div className="admin-grid">
            <AdminMetric title="Deposits collected" value={formatMoney(totalRevenue)} icon={CircleDollarSign} delay={0} />
            <AdminMetric title="Balance outstanding" value={formatMoney(remainingBalance)} icon={CreditCard} delay={0.05} />
            <AdminMetric title="Open departures" value="2" icon={Plane} delay={0.1} />
            <AdminMetric title="Waitlist leads" value={String(waitlist.length)} icon={Bell} delay={0.15} />

            <section className="admin-panel wide">
              <div className="panel-heading">
                <h2>Departure health</h2>
                <button type="button" onClick={() => notify("Trip health report refreshed")}>
                  <Eye size={17} aria-hidden="true" />
                  Refresh
                </button>
              </div>
              <div className="departure-health">
                {trips.map((trip, index) => (
                  <div className="health-row" key={trip.id}>
                    <span>{trip.title}</span>
                    <div className="health-track">
                      <motion.i
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
                        style={{ width: `${trip.status === "Waitlist" ? 42 : 78}%`, background: trip.accent }}
                      />
                    </div>
                    <strong>{trip.status === "Waitlist" ? "Building interest" : `${trip.spotsLeft} spots left`}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-panel">
              <div className="panel-heading">
                <h2>Action queue</h2>
              </div>
              <ul className="task-list">
                <li>
                  <ShieldCheck size={18} aria-hidden="true" />
                  Review insurance copy before public launch.
                </li>
                <li>
                  <Mail size={18} aria-hidden="true" />
                  Send Greece balance reminder template.
                </li>
                <li>
                  <FileText size={18} aria-hidden="true" />
                  Upload cancellation policy and travel terms.
                </li>
              </ul>
            </section>
          </div>
        ) : null}

        {module === "Trips" ? (
          <div className="admin-editor-layout">
            <section className="admin-panel trip-list-panel">
              <h2>Trip inventory</h2>
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  type="button"
                  className={selectedTripId === trip.id ? "trip-row active" : "trip-row"}
                  onClick={() => setSelectedTripId(trip.id)}
                >
                  <img src={trip.image} alt="" aria-hidden="true" />
                  <span>
                    <strong>{trip.title}</strong>
                    <small>{trip.dates}</small>
                  </span>
                  <i>{trip.status}</i>
                </button>
              ))}
            </section>

            <section className="admin-panel editor-panel">
              <div className="panel-heading">
                <h2>Edit departure</h2>
                <button type="button" onClick={() => notify(`${selectedTrip.title} draft saved`)}>
                  <Save size={17} aria-hidden="true" />
                  Save draft
                </button>
              </div>
              <div className="admin-form-grid">
                <label>
                  Trip title
                  <input defaultValue={selectedTrip.title} />
                </label>
                <label>
                  Status
                  <select defaultValue={selectedTrip.status}>
                    <option>Open</option>
                    <option>Waitlist</option>
                    <option>Sold out</option>
                    <option>Draft</option>
                  </select>
                </label>
                <label>
                  Price
                  <input defaultValue={selectedTrip.price} />
                </label>
                <label>
                  Deposit
                  <input defaultValue={selectedTrip.deposit} />
                </label>
              </div>
              <label className="full-label">
                Public summary
                <textarea defaultValue={selectedTrip.summary} />
              </label>
              <div className="capability-grid">
                {[
                  "Itinerary builder",
                  "Pricing and deposits",
                  "Capacity and waitlist",
                  "Checkout settings",
                  "Policy attachments",
                  "Pre-trip email pack",
                ].map((item) => (
                  <span key={item}>
                    <Check size={15} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {module === "Bookings" ? (
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Bookings and payments</h2>
              <button type="button" onClick={() => notify("Balance reminders sent to selected travellers")}>
                <Send size={17} aria-hidden="true" />
                Send reminders
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Traveller</th>
                    <th>Trip</th>
                    <th>Status</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => {
                    const trip = trips.find((item) => item.id === booking.tripId);
                    return (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.26, delay: index * 0.04 }}
                      >
                        <td>{booking.id}</td>
                        <td>{booking.traveller}</td>
                        <td>{trip?.destination}</td>
                        <td>
                          <span className="status-pill">{booking.status}</span>
                        </td>
                        <td>{formatMoney(booking.paid)}</td>
                        <td>{formatMoney(booking.balance)}</td>
                        <td>{booking.due}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {module === "Travellers" ? (
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Traveller manifest</h2>
              <button type="button" onClick={() => notify("Traveller manifest exported")}>
                <Download size={17} aria-hidden="true" />
                Export manifest
              </button>
            </div>
            <div className="traveller-grid">
              {bookings.map((booking) => (
                <article className="traveller-card" key={booking.id}>
                  <UserCheck size={24} aria-hidden="true" />
                  <h3>{booking.traveller}</h3>
                  <p>{booking.room}</p>
                  <span>{booking.status}</span>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {module === "Messages" ? (
          <section className="admin-panel messages-panel">
            <div>
              <h2>Email templates</h2>
              <p>Confirmation, balance reminders, trip packs and waitlist launch emails.</p>
            </div>
            {["Booking confirmation", "Balance reminder", "Trip pack", "Waitlist launch"].map((template) => (
              <button key={template} type="button" onClick={() => notify(`${template} preview opened`)}>
                <Mail size={18} aria-hidden="true" />
                <span>{template}</span>
                <ChevronRight size={17} aria-hidden="true" />
              </button>
            ))}
          </section>
        ) : null}

        {module === "Settings" ? (
          <section className="admin-panel settings-panel">
            <h2>Launch checklist</h2>
            <div className="checklist-grid">
              {[
                "Stripe test mode connected",
                "Terms and cancellation policy uploaded",
                "Travel insurance notice visible",
                "Admin roles and audit log ready",
                "Email sender verified",
                "Traveller portal enabled",
              ].map((item, index) => (
                <label key={item}>
                  <input type="checkbox" defaultChecked={index < 3} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function AdminMetric({ title, value, icon: Icon, delay = 0 }) {
  return (
    <motion.section
      className="admin-metric"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, delay, ease: "easeOut" }}
    >
      <Icon size={24} aria-hidden="true" />
      <span>{title}</span>
      <strong>{value}</strong>
    </motion.section>
  );
}

function NotFound() {
  return (
    <main className="page public-page">
      <section className="page-hero compact-hero">
        <span className="script-label">Wrong trail</span>
        <h1>This page does not exist.</h1>
        <ButtonLink href="#/">Back home</ButtonLink>
      </section>
    </main>
  );
}

export function App() {
  const path = useHashRoute();
  const tripId = path.split("/")[2];
  const activeTrip = trips.find((trip) => trip.id === tripId);
  const showAdmin = path.startsWith("/admin");

  const page = useMemo(() => {
    if (path === "/" || path === "") return <HomePage />;
    if (path === "/trips" || path === "/about" || path === "/reviews" || path === "/faq") return <TripsPage />;
    if (path.startsWith("/trip/")) return <TripDetailPage trip={activeTrip} />;
    if (path.startsWith("/book/")) return <BookingFlow trip={activeTrip} />;
    if (path.startsWith("/admin")) return <AdminDashboard />;
    return <NotFound />;
  }, [activeTrip, path]);

  return (
    <>
      {!showAdmin ? <PublicNav current={path} /> : null}
      {page}
    </>
  );
}
