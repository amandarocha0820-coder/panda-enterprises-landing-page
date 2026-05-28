import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, ClipboardList, DollarSign, Mail, MapPin, PartyPopper, Store, Truck } from 'lucide-react';
import './styles.css';

function App() {
  const [spaceType, setSpaceType] = useState('indoor');
  const [spaces, setSpaces] = useState(1);
  const [electric, setElectric] = useState(false);

  const vendorTotal = useMemo(() => {
    const base = spaceType === 'indoor' ? 50 : 40;
    return spaces * base;
  }, [spaceType, spaces, electric]);

  const vendorLinks = [
    { event: 'Christmas in July', date: 'July 25', status: 'Now accepting vendors', link: '#' },
    { event: 'Future Events', date: 'TBA', status: 'Join our vendor list', link: '#' },
  ];

  return (
    <div className="site">
      <header className="header">
        <div className="container nav">
          <div className="brand">
            <div className="logo">🐼</div>
            <div>
              <strong>Panda Enterprises</strong>
              <span>Events • Vendors • Community</span>
            </div>
          </div>
          <nav>
            <a href="#services">Services</a>
            <a href="#vendors">Vendors</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="container hero">
          <div>
            <p className="pill">Community-centered event planning</p>
            <h1>Bringing vendors, families, and communities together.</h1>
            <p className="heroText">Panda Enterprises helps organize vendor markets, fundraisers, seasonal events, food truck events, and community gatherings with a creative, organized, and welcoming touch.</p>
            <div className="buttons">
              <a className="button primary" href="#vendors">Apply as a Vendor</a>
              <a className="button secondary" href="#contact">Request Event Services</a>
            </div>
          </div>
          <div className="heroCard">
            <PartyPopper size={70} />
            <h2>Event photo or branded banner goes here</h2>
            <p>Use a great market photo, vendor setup, or Panda Enterprises graphic.</p>
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

        <section id="vendors" className="white section">
          <div className="container">
            <div className="sectionTitle">
              <h2>Vendor Applications</h2>
              <p>One easy place for vendors to find current and upcoming opportunities.</p>
            </div>
            <div className="grid three">
              {vendorLinks.map((event) => (
                <div className="card" key={event.event}>
                  <p className="date">{event.date}</p>
                  <h3>{event.event}</h3>
                  <p>{event.status}</p>
                  <a className="button primary full" href={event.link}>Open Application</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="container section">
          <div className="sectionTitle">
            <h2>Simple Pricing</h2>
            <p>Clear starting prices. Custom quotes available for larger events and full-service planning.</p>
          </div>
          <div className="grid two">
            <div className="card">
              <DollarSign className="pinkIcon" />
              <h3>Vendor Booth Pricing</h3>
              <div className="priceRows">
                <div><span>Indoor vendor space</span><strong>$50</strong></div>
                <div><span>Outdoor vendor space</span><strong>$40</strong></div>
                <div><span>Optional electric</span><strong>$10</strong></div>
              </div>
            </div>

            <div className="card">
              <ClipboardList className="tealIcon" />
              <h3>Vendor Fee Calculator</h3>
              <p>This helps vendors estimate their total before applying.</p>
              <label>Space Type
                <select value={spaceType} onChange={(e) => setSpaceType(e.target.value)}>
                  <option value="indoor">Indoor - $50</option>
                  <option value="outdoor">Outdoor - $40</option>
                </select>
              </label>
              <label>Number of Spaces
                <input type="number" min="1" value={spaces} onChange={(e) => setSpaces(Math.max(1, Number(e.target.value)))} />
              </label>
              <div className="total">
                <span>Estimated Total</span>
                <strong>${vendorTotal}</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section">
          <div className="container contactGrid">
            <div>
              <h2>Ready to plan something fun?</h2>
              <p>Reach out to discuss vendor events, fundraisers, community partnerships, and food truck opportunities.</p>
            </div>
            <div className="contactBox">
              <p><Mail size={20} /> your-email@example.com</p>
              <p><MapPin size={20} /> Sioux City area and surrounding communities</p>
              <a className="button primary full" href="mailto:your-email@example.com">Contact Panda Enterprises</a>
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

createRoot(document.getElementById('root')).render(<App />);
