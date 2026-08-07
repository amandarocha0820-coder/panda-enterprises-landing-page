import pandaLogo from './panda-logo.jpg';
import marketVideo from './Market Video 2026.mp4';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, CalendarDays, Clock, Mail, MapPin, Store, Truck, Users } from 'lucide-react';
import './styles.css';

const PUBLIC_API_URL = 'https://xapdidzzecekrdxirrje.supabase.co/rest/v1/published_event_pages';
const PUBLIC_API_KEY = 'sb_publishable_9rkIUSnwWTFe28KQaYHYag_RBjLA3-H';

function displayEventDate(value) {
  return new Date(value).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function displayEventTime(value) {
  return new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function eventLocation(event) {
  return [event.venue_name, event.city, event.state].filter(Boolean).join(' · ');
}

function EventsPortal() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState('');
  const slug = decodeURIComponent(window.location.pathname.split('/').filter(Boolean)[1] || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(PUBLIC_API_URL + '?select=*&order=starts_at.asc', {
      headers: { apikey: PUBLIC_API_KEY }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Events are temporarily unavailable.');
        return response.json();
      })
      .then(setEvents)
      .catch((error) => setProblem(error.message))
      .finally(() => setLoading(false));
  }, []);

  const selected = slug ? events.find((event) => event.slug === slug) : null;
  const statusLabels = { coming_soon: 'Applications coming soon', open: 'Applications open', waitlist: 'Vendor waitlist', closed: 'Applications closed' };

  if (slug && !loading && !selected) {
    return <div className="events-site"><EventsHeader/><main className="event-empty"><h1>Event not found</h1><p>This event may not be published yet, or it may have already ended.</p><a className="button primary" href="/events">View upcoming events</a></main></div>;
  }

  if (selected) return <EventDetail event={selected} statusLabel={statusLabels[selected.application_status]} />;

  return <div className="events-site">
    <EventsHeader/>
    <main>
      <section className="events-hero">
        <div className="container">
          <p className="pill">PANDA EVENTS</p>
          <h1>Come be part of something memorable.</h1>
          <p>Explore upcoming Panda events, find vendor opportunities, volunteer, sponsor, or make plans to attend.</p>
        </div>
      </section>
      <section className="container events-list-section">
        <div className="events-heading"><div><span>UPCOMING EVENTS</span><h2>Find your next event</h2></div><p>Everything you need is collected on each event page.</p></div>
        {loading && <div className="event-empty"><div className="events-loading">P</div><p>Loading upcoming events…</p></div>}
        {problem && <div className="event-empty"><h3>We couldn’t load events.</h3><p>{problem}</p></div>}
        {!loading && !problem && events.length === 0 && <div className="event-empty"><CalendarDays/><h3>New events are coming soon.</h3><p>Check back for vendor opportunities, community events, and ways to get involved.</p></div>}
        <div className="public-event-grid">
          {events.map((event) => <article className="public-event-card" key={event.id}>
            <div className="event-card-image" style={event.hero_image_url ? { backgroundImage: `url("${event.hero_image_url}")` } : undefined}>
              {!event.hero_image_url && <span>PE</span>}
              <b>{statusLabels[event.application_status]}</b>
            </div>
            <div className="event-card-copy">
              <p className="event-card-date">{displayEventDate(event.starts_at)}</p>
              <h3>{event.title}</h3>
              <p>{event.short_description}</p>
              <div className="event-card-facts"><span><MapPin/> {eventLocation(event) || 'Location coming soon'}</span><span><Clock/> {displayEventTime(event.starts_at)}–{displayEventTime(event.ends_at)}</span></div>
              <a className="button primary full" href={'/events/' + event.slug}>View event details</a>
            </div>
          </article>)}
        </div>
      </section>
    </main>
  </div>;
}

function EventsHeader() {
  return <header className="events-header"><div className="container nav"><a className="brand" href="/"><img src={pandaLogo} alt="Panda Enterprises Logo" className="logoImage"/><div><strong>Panda Events</strong><span>Creating Events People Remember</span></div></a><nav><a href="/events">Upcoming Events</a><a href="/">Hire Panda</a></nav></div></header>;
}

function EventDetail({ event, statusLabel }) {
  const options = [
    ['vendor', 'Apply as a Vendor'], ['food_truck', 'Apply as a Food Truck'], ['volunteer', 'Volunteer'],
    ['sponsor', 'Become a Sponsor'], ['performer', 'Apply as a Performer'], ['tickets', 'Tickets & Registration']
  ].filter(([key]) => event[key + '_enabled'] && event[key + '_url']);
  const fullAddress = [event.address, event.city, event.state].filter(Boolean).join(', ');

  return <div className="events-site"><EventsHeader/><main>
    <section className="event-detail-hero" style={event.hero_image_url ? { backgroundImage: `linear-gradient(90deg,rgba(16,5,24,.96),rgba(16,5,24,.56)),url("${event.hero_image_url}")` } : undefined}>
      <div className="container"><a className="event-back" href="/events"><ArrowLeft/> All upcoming events</a><p className="pill">{statusLabel}</p><h1>{event.title}</h1><p>{event.short_description}</p></div>
    </section>
    <section className="container event-detail-layout">
      <article className="event-detail-main">
        <div className="event-fact-strip"><div><CalendarDays/><span><b>{displayEventDate(event.starts_at)}</b><small>{displayEventTime(event.starts_at)}–{displayEventTime(event.ends_at)}</small></span></div><div><MapPin/><span><b>{event.venue_name || 'Location coming soon'}</b><small>{fullAddress}</small></span></div></div>
        <section><h2>About this event</h2><p className="event-long-copy">{event.long_description || event.short_description}</p></section>
        {(event.admission_details || event.parking_details || event.accessibility_details) && <section><h2>Plan your visit</h2><div className="visitor-info-grid">{event.admission_details && <div><h3>Admission</h3><p>{event.admission_details}</p></div>}{event.parking_details && <div><h3>Parking</h3><p>{event.parking_details}</p></div>}{event.accessibility_details && <div><h3>Accessibility</h3><p>{event.accessibility_details}</p></div>}</div></section>}
      </article>
      <aside className="get-involved-card"><div className="involved-icon"><Users/></div><h2>Get involved</h2><p>Choose the option that fits you. Each button opens the correct form or registration page.</p>{options.length ? <div className="involved-buttons">{options.map(([key,label]) => <a className="button primary full" href={event[key + '_url']} key={key}>{label}</a>)}</div> : <div className="involved-soon">More opportunities will be added soon.</div>}{event.facebook_url && <a className="facebook-event-link" href={event.facebook_url} target="_blank" rel="noreferrer">View the Facebook event →</a>}</aside>
    </section>
  </main></div>;
}


const customServices = [
  { name: 'Full Vendor Coordination', price: 750 },
  { name: 'Event Layout & Planning', price: 300 },
  { name: 'Day-of Event Management', price: 600 },
  { name: 'Setup & Teardown Coordination', price: 400 },
  { name: 'Marketing Assistance', price: 350 },
  { name: 'Social Media Promotion', price: 400 },
  { name: 'Volunteer Coordination', price: 200 },
  { name: 'Permit Guidance', price: 250 },
];

function ServicesPage() {
  const [selectedServices, setSelectedServices] = useState([]);
  const toggleService = (serviceName) => setSelectedServices((current) =>
    current.includes(serviceName) ? current.filter((name) => name !== serviceName) : [...current, serviceName]
  );
  const totalEstimate = customServices
    .filter((service) => selectedServices.includes(service.name))
    .reduce((sum, service) => sum + service.price, 0);
  const services = customServices;

  return <div className="site services-site">
    <header className="header"><div className="container nav">
      <a className="brand" href="/"><img src={pandaLogo} alt="Panda Enterprises Logo" className="logoImage"/><div><strong>Panda Enterprises</strong><span>Creating Events People Remember</span></div></a>
      <nav><a href="/">Home</a><a href="/services">Services</a><a href="/events">Events</a><a href="/#contact">Contact</a></nav>
    </div></header>
    <main>
      <section className="services-page-hero"><div className="container">
        <p className="pill">EVENT PLANNING SERVICES</p>
        <h1>Support that fits your event.</h1>
        <p>Choose a complete package or combine individual services. Panda Enterprises can manage the details you need while your team focuses on the experience.</p>
        <div className="buttons"><a className="button primary" href="#packages">Compare packages</a><a className="button secondary" href="#build-your-own">Build your own</a></div>
      </div></section>
      <div id="packages">
<section id="pricing" className="container section">
  <div className="sectionTitle">
    <h2>Event Services Packages</h2>
    <p>Click each package to see what Panda Enterprises handles and what the client handles.</p>
  </div>

  <div className="grid three">
    <details className="packageCard">
      <summary>
        <h3>Basic Package</h3>
        <p>Vendor Coordination + Layout Planning</p>
        <strong>$700</strong>
      </summary>
      <div className="packageDetails">
        <h4>Panda Enterprises:</h4>
        <ul>
          <li>Creates vendor application forms</li>
          <li>Manages incoming applications and fills available space</li>
          <li>Designs the event layout for smooth flow</li>
        </ul>

        <h4>The Client:</h4>
        <ul>
          <li>Handles all day-of event management</li>
          <li>Manages vendor check-in and any issues during the event</li>
        </ul>

        <p><strong>Ideal for:</strong> Teams that want help getting organized but are comfortable running the event themselves.</p>
        <a className="button primary full" href="/#contact">Ask About Basic</a>
      </div>
    </details>

    <details className="packageCard featured">
      <summary>
        <h3>Standard Package</h3>
        <p>Vendor Coordination + Layout Planning + Day-of Management</p>
        <strong>$1,100</strong>
        <em>Most Popular</em>
      </summary>
      <div className="packageDetails">
        <h4>Panda Enterprises:</h4>
        <ul>
          <li>Creates vendor application forms</li>
          <li>Manages applications and fills available space</li>
          <li>Designs the event layout for smooth flow</li>
          <li>Handles full day-of event management</li>
          <li>Vendor check-in and placement</li>
          <li>Helps maintain event organization and vendor guideline compliance</li>
          <li>Coordinates timing and flow</li>
          <li>Troubleshoots issues as they arise</li>
          <li>Makes sure the event is easy for customers to navigate and enjoy</li>
        </ul>

        <h4>The Client:</h4>
        <ul>
          <li>Focuses on guests, fundraising, and overall experience</li>
          <li>Does not manage vendors or logistics</li>
        </ul>

        <p><strong>Ideal for:</strong> Teams that want a well-run event without the stress of managing it themselves.</p>
        <a className="button primary full" href="/#contact">Ask About Stress-Free</a>
      </div>
    </details>

    <details className="packageCard">
      <summary>
        <h3>Premium Package</h3>
        <p>Full-Service Event Management</p>
        <strong>$2,250</strong>
      </summary>
      <div className="packageDetails">
        <h4>Panda Enterprises:</h4>
        <ul>
          <li>Creates vendor application forms</li>
          <li>Manages applications and fills available space</li>
          <li>Designs the full event layout for optimal flow</li>
          <li>Handles full day-of event management, including vendor coordination and issue resolution</li>
          <li>Oversees setup and teardown</li>
          <li>Provides marketing support and social media promotion</li>
          <li>Coordinates volunteers, including scheduling, roles, and on-site direction</li>
          <li>Provides permit guidance so the client knows what is required and where to obtain approvals</li>
        </ul>

        <h4>The Client:</h4>
        <ul>
          <li>Focuses on hosting, guests, and the overall event experience</li>
          <li>Has minimal involvement in logistics and operations</li>
        </ul>

        <p><strong>Ideal for:</strong> A fully supported, hands-off event with professional execution from start to finish.</p>
        <a className="button primary full" href="/#contact">Ask About Premium</a>
      </div>
    </details>
  </div>

  <p className="paymentNote">
    A 20% non-refundable retainer is required at signing to secure your event date. Custom packages are available upon request.
  </p>
</section>

<section id="build-your-own" className="container section">
  <div className="sectionTitle">
    <h2>Build Your Own Estimate</h2>

    <p>
      Select individual services to see an estimated total.
      Packages may offer better overall value depending on your event needs.
    </p>
  </div>

  <div className="estimateBox">
    {services.map((service) => (
      <label key={service.name} className="check">
        <input
          type="checkbox"
          checked={selectedServices.includes(service.name)}
          onChange={() => toggleService(service.name)}
        />

        <span>
          {service.name} — ${service.price}
        </span>
      </label>
    ))}

    <div className="totalEstimate">
      <span>Estimated Total</span>

      <strong>${totalEstimate}</strong>

      <p>
        Estimates are for planning purposes only.
        Final pricing depends on event size,
        location, staffing, and scope.
      </p>
    </div>
  </div>
</section>
        
      </div>
      <section className="services-cta"><div className="container"><div><span>READY TO TALK?</span><h2>Tell us what you’re planning.</h2><p>We’ll help you choose the right level of support and prepare a clear proposal.</p></div><a className="button primary" href="/#contact">Request Event Services</a></div></section>
    </main>
  </div>;
}

function Router() {
  if (window.location.pathname.startsWith('/events')) return <EventsPortal/>;
  if (window.location.pathname.startsWith('/services')) return <ServicesPage/>;
  return <App/>;
}

function App() {
  return (
    <div className="site">
      <header className="header">
        <div className="container nav">
          <div className="brand">
<img src={pandaLogo} alt="Panda Enterprises Logo" className="logoImage" />
            <div>
              <strong>Panda Enterprises</strong>
           <span>Community Events • Vendor Markets • Event Planning</span>
            </div>
          </div>
          <nav>
            <a href="/services">Services</a>
            <a href="/events">Events</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="container hero">
          <div>
            <p className="pill">Creating Events People Remember</p>
<h1>
  Panda Enterprises
</h1>

<p className="heroSubheading">
  Specializing in creating engaging events and memorable experiences designed to bring people together through creativity, organization, and community connection.
</p>

<p className="heroText">
  From vendor coordination and fundraisers to festivals, markets, and special events, we help turn ideas into well-organized and exciting experiences.
</p>

            <div className="buttons">
              <a className="button primary" href="#contact">Request Event Services</a>
<a className="button secondary" href="/events">Explore Upcoming Events</a>
<a
  className="button secondary"
  href="https://mail.google.com/mail/?view=cm&fs=1&to=Panda.Enterprises.712@gmail.com&su=Event%20Inquiry"
  target="_blank"
>
  Email Panda Enterprises
</a>
          </div>
                </div>
<div className="heroCard videoCard">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="heroVideo"
  >
    <source src={marketVideo} type="video/mp4" />
  </video>
</div>

        </section>

        <section id="services" className="container section">
          <div className="sectionTitle">
            <h2>What We Help With</h2>
            <p>Simple, flexible event support for businesses, nonprofits, and community groups.</p>
          </div>
          <div className="grid three">
            <InfoCard icon={<Store />} title="Vendor Markets" text="Vendor outreach, applications, booth planning, setup guidance, and event communication." />
            <InfoCard icon={<Truck />} title="Food Truck Events" text="Food truck coordination for indoor/outdoor events, fundraisers, and community gatherings." />
            <InfoCard icon={<CalendarDays />} title="Event Planning" text="Support for seasonal events, fundraisers, family-friendly activities, and community partnerships." />
          </div>
        </section>

      <section id="pricing" className="container section package-preview-section">
  <div className="sectionTitle">
    <p className="sectionKicker">EVENT SERVICES</p>
    <h2>Choose the level of support you need</h2>
    <p>Start with one of our core packages, or create a custom combination for your event.</p>
  </div>
  <div className="grid three package-preview-grid">
    <article className="packagePreviewCard">
      <span>PLANNING SUPPORT</span><h3>Basic</h3><strong>$700</strong>
      <p>Vendor coordination and layout planning for teams managing event day themselves.</p>
    </article>
    <article className="packagePreviewCard featuredPreview">
      <span>MOST POPULAR</span><h3>Standard</h3><strong>$1,100</strong>
      <p>Planning, vendor coordination, and hands-on management throughout event day.</p>
    </article>
    <article className="packagePreviewCard">
      <span>FULL SERVICE</span><h3>Premium</h3><strong>$2,250</strong>
      <p>Complete event support from planning and promotion through setup and teardown.</p>
    </article>
  </div>
  <div className="package-preview-actions">
    <a className="button primary" href="/services">Compare Event Packages</a>
    <a className="button secondary" href="/services#build-your-own">Build Your Own Package</a>
  </div>
</section>
        <section id="contact" className="contact section">
          <div className="container contactGrid">
            <div>
              <h2>Ready to plan something fun?</h2>
              <p>Reach out to discuss vendor events, fundraisers, community partnerships, and food truck opportunities.</p>
            </div>
        <div className="contactBox">
  <p>
    <Mail size={20} />
    Panda.Enterprises.712@gmail.com
  </p>

  <p>
    <MapPin size={20} />
    Sioux City area and surrounding communities
  </p>

  <div className="buttons">
    <a
      className="button primary"
      href="https://www.facebook.com/PandaEnterprisesLLC"
      target="_blank"
    >
      Message Us on Facebook
    </a>

    <a
      className="button secondary"
href="https://mail.google.com/mail/?view=cm&fs=1&to=Panda.Enterprises.712@gmail.com&su=Event%20Inquiry"
    >
      Email Panda Enterprises
    </a>
  </div>
</div>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return <div className="card iconCard"><div className="icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>;
}

createRoot(document.getElementById('root')).render(<Router />);
