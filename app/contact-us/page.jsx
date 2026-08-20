import Link from 'next/link';
import LegacyEngine from '@/components/LegacyEngine';
import EnquiryMailto from '@/components/EnquiryMailto';
import './contact-us.css';

export const metadata = {
  title: "Contact Us — A India Print House | Playing Cards Manufacturer",
  description: "Get in touch with A India Print House — India",
  keywords: "contact a india print house, playing cards manufacturer contact, custom playing cards enquiry, new delhi playing cards, mayapuri printing",
  alternates: { canonical: "/contact-us" },
};

export default function ContactUsPage() {
  return (
    <div className="page-root">
      <LegacyEngine variant="home" />
      <EnquiryMailto />
      {/* GRAIN */}
      <div className={"grain-overlay"} aria-hidden={"true"}></div>
      {/* NAVBAR */}
      <header id={"site-header"}>
        <div className={"hdr-wrap"}>
          <Link href={"/"} className={"hdr-logo"}>
            <img src={"/img/aiph-logo.avif"} alt={"AIPH"} className={"hdr-logo-img"} />
            <div className={"hdr-logo-text"}>
              <span className={"hlt-main"}>
                A India
              </span>
              <span className={"hlt-sub"}>
                Print House
              </span>
            </div>
          </Link>
          <nav className={"hdr-nav"}>
            <Link href={"/"} className={"hdr-link"}>
              Home
            </Link>
            <div className={"hdr-dropdown"}>
              <Link href={"/#products"} className={"hdr-link"}>
                Collection
                <span className={"hdr-caret"}>
                  ▾
                </span>
              </Link>
              <div className={"hdr-menu"}>
                <Link href={"/premium-playing-cards"} className={"hdr-menu-link"}>
                  Premium Playing Cards
                </Link>
                <Link href={"/promotional-playing-cards"} className={"hdr-menu-link"}>
                  Promotional Playing Cards
                </Link>
                <Link href={"/advertisement-playing-cards"} className={"hdr-menu-link"}>
                  Advertisement Playing Cards
                </Link>
                <Link href={"/card-games"} className={"hdr-menu-link"}>
                  Card Games
                </Link>
                <Link href={"/corporate-playing-cards"} className={"hdr-menu-link"}>
                  Corporate Playing Cards
                </Link>
                <Link href={"/souvenir-playing-cards"} className={"hdr-menu-link"}>
                  Customised Playing Cards
                </Link>
                <Link href={"/branded-playing-cards"} className={"hdr-menu-link"}>
                  Branded Playing Cards
                </Link>
                <Link href={"/poker-cards"} className={"hdr-menu-link"}>
                  Poker Cards
                </Link>
                <Link href={"/educational-cards"} className={"hdr-menu-link"}>
                  Educational Cards
                </Link>
                <Link href={"/flash-cards"} className={"hdr-menu-link"}>
                  Flash Cards
                </Link>
              </div>
            </div>
            <Link href={"/about-us"} className={"hdr-link"}>
              About Us
            </Link>
            <Link href={"/contact-us"} className={"hdr-link"} style={{ color: "var(--gold)" }}>
              Contact us
            </Link>
          </nav>
          <a href={"#contact-form"} className={"hdr-btn magnetic"}>
            <span>
              Bespoke Order
            </span>
            <div className={"hdr-btn-glow"}></div>
          </a>
          <button className={"hdr-burger"} id={"hdr-burger"} aria-label={"Open menu"}>
            <div className={"burger-bar b1"}></div>
            <div className={"burger-bar b2"}></div>
          </button>
        </div>
      </header>
      {/* FULLSCREEN NAV */}
      <div className={"nav-overlay"} id={"nav-overlay"}>
        <div className={"no-bg-panel"}></div>
        <div className={"no-content"}>
          <div className={"no-links"}>
            <Link href={"/"} className={"no-link"}>
              <em className={"no-idx"}>
                01
              </em>
              <span>
                Home
              </span>
            </Link>
            <div className={"no-link no-collection-group"}>
              <div className={"no-collection-head"}>
                <em className={"no-idx"}>
                  02
                </em>
                <span>
                  Collection
                </span>
              </div>
              <div className={"no-collection-links"}>
                <Link href={"/premium-playing-cards"} className={"no-col-link"}>
                  Premium Playing Cards
                </Link>
                <Link href={"/promotional-playing-cards"} className={"no-col-link"}>
                  Promotional Playing Cards
                </Link>
                <Link href={"/advertisement-playing-cards"} className={"no-col-link"}>
                  Advertisement Playing Cards
                </Link>
                <Link href={"/card-games"} className={"no-col-link"}>
                  Card Games
                </Link>
                <Link href={"/corporate-playing-cards"} className={"no-col-link"}>
                  Corporate Playing Cards
                </Link>
                <Link href={"/souvenir-playing-cards"} className={"no-col-link"}>
                  Customised Playing Cards
                </Link>
                <Link href={"/branded-playing-cards"} className={"no-col-link"}>
                  Branded Playing Cards
                </Link>
                <Link href={"/poker-cards"} className={"no-col-link"}>
                  Poker Cards
                </Link>
                <Link href={"/educational-cards"} className={"no-col-link"}>
                  Educational Cards
                </Link>
                <Link href={"/flash-cards"} className={"no-col-link"}>
                  Flash Cards
                </Link>
              </div>
            </div>
            <Link href={"/about-us"} className={"no-link"}>
              <em className={"no-idx"}>
                03
              </em>
              <span>
                About Us
              </span>
            </Link>
            <Link href={"/#why"} className={"no-link"}>
              <em className={"no-idx"}>
                04
              </em>
              <span>
                Why Us
              </span>
            </Link>
            <Link href={"/contact-us"} className={"no-link"}>
              <em className={"no-idx"}>
                05
              </em>
              <span>
                Contact Us
              </span>
            </Link>
          </div>
          <div className={"no-side"}>
            <div className={"no-suits-grid"}>
              <span>
                ♠
              </span>
              <span className={"r"}>
                ♥
              </span>
              <span>
                ♣
              </span>
              <span className={"r"}>
                ♦
              </span>
            </div>
            <div className={"no-contact-info"}>
              <p>
                marketingaiph7@gmail.com
              </p>
              <p>
                +91-9810614016
              </p>
              <p>
                New Delhi, India
              </p>
            </div>
          </div>
        </div>
        <button className={"no-close"} id={"no-close"}>
          ✕
        </button>
      </div>
      {/* ══ HERO ══ */}
      <section id={"contact-hero"}>
        <div className={"ch-suits"} aria-hidden={"true"}>
          <span>
            ♠
          </span>
          <span className={"r"}>
            ♥
          </span>
          <span>
            ♣
          </span>
          <span className={"r"}>
            ♦
          </span>
        </div>
        <div className={"ch-inner container"}>
          <div className={"ch-eyebrow"}>
            Let's Talk
          </div>
          <h1>
            Get in
            <em>
              Touch
            </em>
          </h1>
          <p className={"ch-sub"}>
            Whether it's a bespoke deck, a promotional run, or a corporate gifting project — our team is ready to craft something exceptional with you.
          </p>
          <div className={"ch-crumb"}>
            <Link href={"/"}>
              Home
            </Link>
            &nbsp;·&nbsp;
            <span>
              Contact Us
            </span>
          </div>
        </div>
      </section>
      {/* ══ CONTACT MAIN ══ */}
      <section id={"contact-main"}>
        <div className={"container contact-grid"}>
          {/* Info column */}
          <div className={"contact-info-col"}>
            <span className={"ci-label"}>
              Reach Us
            </span>
            <h2 className={"ci-title"}>
              Crafting excellence,
              <br />
              one card at a time.
            </h2>
            <p className={"ci-intro"}>
              With over 25 years of printing expertise, A India Print House is India's trusted partner for premium, custom, and branded playing cards. Drop us a line — we typically respond within one business day.
            </p>
            <div className={"ci-cards"}>
              {/* Email */}
              <div className={"ci-card"}>
                <div className={"ci-ico"} aria-hidden={"true"}>
                  <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
                    <path d={"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"}></path>
                  </svg>
                </div>
                <div className={"ci-c-body"}>
                  <h4>
                    Email Us
                  </h4>
                  <a href={"mailto:marketingaiph7@gmail.com"}>
                    marketingaiph7@gmail.com
                  </a>
                </div>
              </div>
              {/* Phone */}
              <div className={"ci-card"}>
                <div className={"ci-ico"} aria-hidden={"true"}>
                  <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
                    <path d={"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"}></path>
                  </svg>
                </div>
                <div className={"ci-c-body"}>
                  <h4>
                    Call Us
                  </h4>
                  <a href={"tel:+91-9810614016"}>
                    +91 98106 14016
                  </a>
                  <a href={"tel:+91-9711145467"}>
                    +91 97111 45467
                  </a>
                </div>
              </div>
              {/* Address */}
              <div className={"ci-card"}>
                <div className={"ci-ico"} aria-hidden={"true"}>
                  <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
                    <path d={"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"}></path>
                  </svg>
                </div>
                <div className={"ci-c-body"}>
                  <h4>
                    Visit Our Facility
                  </h4>
                  <a href={"https://www.google.com/maps/place/A+India+Print+House/@28.6321157,77.1259235,728m/data=!3m1!1e3!4m14!1m7!3m6!1s0x390d0338eaaaaaab:0xba3a37e5bef20b8d!2sA+India+Print+House!8m2!3d28.632111!4d77.1284984!16s%2Fg%2F1tdwc9tp!3m5!1s0x390d0338eaaaaaab:0xba3a37e5bef20b8d!8m2!3d28.632111!4d77.1284984!16s%2Fg%2F1tdwc9tp?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"} target={"_blank"} rel={"noopener noreferrer"}>
                    A-10/2 Mayapuri Industrial Area,
                    <br />
                    Phase 1, New Delhi 110064
                  </a>
                </div>
              </div>
              {/* Hours */}
              <div className={"ci-card"}>
                <div className={"ci-ico"} aria-hidden={"true"}>
                  <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
                    <path d={"M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"}></path>
                  </svg>
                </div>
                <div className={"ci-c-body"}>
                  <h4>
                    Working Hours
                  </h4>
                  <p>
                    Mon – Sat · 10:00 AM – 7:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Form column */}
          <div className={"contact-form-wrap"} id={"contact-form"}>
            <span className={"cfw-badge"}>
              ♠
            </span>
            <h3 className={"cfw-title"}>
              Send an Enquiry
            </h3>
            <p className={"cfw-note"}>
              Tell us about your project and we'll get back with a custom quote.
            </p>
            <form id={"enquiry-form"} noValidate>
              <div className={"cf-row"}>
                <div className={"cf-field"}>
                  <label htmlFor={"cf-name"}>
                    Full Name
                    <span>
                      *
                    </span>
                  </label>
                  <input type={"text"} id={"cf-name"} name={"name"} placeholder={"Your name"} required />
                </div>
                <div className={"cf-field"}>
                  <label htmlFor={"cf-phone"}>
                    Phone
                    <span>
                      *
                    </span>
                  </label>
                  <input type={"tel"} id={"cf-phone"} name={"phone"} placeholder={"+91 00000 00000"} required />
                </div>
              </div>
              <div className={"cf-field"}>
                <label htmlFor={"cf-email"}>
                  Email
                  <span>
                    *
                  </span>
                </label>
                <input type={"email"} id={"cf-email"} name={"email"} placeholder={"you@company.com"} required />
              </div>
              <div className={"cf-field"}>
                <label htmlFor={"cf-type"}>
                  I'm interested in
                </label>
                <select id={"cf-type"} name={"interest"}>
                  <option>
                    Custom / Bespoke Playing Cards
                  </option>
                  <option>
                    Promotional Playing Cards
                  </option>
                  <option>
                    Corporate Gifting Decks
                  </option>
                  <option>
                    Branded / Advertisement Cards
                  </option>
                  <option>
                    Card Games
                  </option>
                  <option>
                    Educational &amp; Flash Cards
                  </option>
                  <option>
                    Poker Cards
                  </option>
                  <option>
                    Other
                  </option>
                </select>
              </div>
              <div className={"cf-field"}>
                <label htmlFor={"cf-message"}>
                  Your Message
                  <span>
                    *
                  </span>
                </label>
                <textarea id={"cf-message"} name={"message"} placeholder={"Quantity, design ideas, timelines — tell us everything."} required></textarea>
              </div>
              <button type={"submit"} className={"btn-gold cf-submit"}>
                <span>
                  Send Enquiry
                </span>
                <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
                  <path d={"M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"}></path>
                </svg>
              </button>
              <p className={"cf-privacy"}>
                Your enquiry opens in your email app addressed to our team. We respect your privacy and never share your details.
              </p>
            </form>
          </div>
        </div>
      </section>
      {/* ══ MAP ══ */}
      <section id={"contact-map"}>
        <div className={"container"}>
          <div className={"map-frame"}>
            <iframe src={"https://www.google.com/maps?q=A+India+Print+House,+A-10%2F2+Mayapuri+Industrial+Area,+Phase+1,+New+Delhi+110064&ll=28.632111,77.1284984&z=16&output=embed"} loading={"lazy"} referrerPolicy={"no-referrer-when-downgrade"} title={"A India Print House location"}></iframe>
            <div className={"map-tag"}>
              <span className={"r"}>
                ♦
              </span>
              <div>
                <strong>
                  A India Print House
                </strong>
                <span>
                  A-10/2 Mayapuri Industrial Area, Phase 1, New Delhi 110064
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ══ FOOTER ══ */}
      <footer id={"site-footer"}>
        <div className={"footer-suits-mq"}>
          <div className={"fsm-track"}>
            <span>
              ♠
            </span>
            <span className={"r"}>
              ♥
            </span>
            <span>
              ♣
            </span>
            <span className={"r"}>
              ♦
            </span>
            <span>
              ♠
            </span>
            <span className={"r"}>
              ♥
            </span>
            <span>
              ♣
            </span>
            <span className={"r"}>
              ♦
            </span>
            <span>
              ♠
            </span>
            <span className={"r"}>
              ♥
            </span>
            <span>
              ♣
            </span>
            <span className={"r"}>
              ♦
            </span>
            <span>
              ♠
            </span>
            <span className={"r"}>
              ♥
            </span>
            <span>
              ♣
            </span>
            <span className={"r"}>
              ♦
            </span>
            <span>
              ♠
            </span>
            <span className={"r"}>
              ♥
            </span>
            <span>
              ♣
            </span>
            <span className={"r"}>
              ♦
            </span>
            <span>
              ♠
            </span>
            <span className={"r"}>
              ♥
            </span>
            <span>
              ♣
            </span>
            <span className={"r"}>
              ♦
            </span>
            <span>
              ♠
            </span>
            <span className={"r"}>
              ♥
            </span>
            <span>
              ♣
            </span>
            <span className={"r"}>
              ♦
            </span>
            <span>
              ♠
            </span>
            <span className={"r"}>
              ♥
            </span>
            <span>
              ♣
            </span>
            <span className={"r"}>
              ♦
            </span>
          </div>
        </div>
        <div className={"footer-big-name"}>
          <div className={"fbn-track"}>
            <span className={"fbn-inner"}>
              A India Print House &nbsp;·&nbsp; A India Print House &nbsp;·&nbsp; A India Print House &nbsp;·&nbsp;
            </span>
            <span className={"fbn-inner"}>
              A India Print House &nbsp;·&nbsp; A India Print House &nbsp;·&nbsp; A India Print House &nbsp;·&nbsp;
            </span>
          </div>
        </div>
        <div className={"footer-body container"}>
          <div className={"footer-top"}>
            <div className={"ft-brand-col"}>
              <div className={"ft-logo"}>
                <img src={"/img/aiph-logo.avif"} alt={"AIPH"} className={"ft-logo-img"} />
                AIPH
              </div>
              <p>
                India's premium playing card manufacturer. Crafting excellence, one card at a time.
              </p>
            </div>
            <div className={"ft-links-cols"}>
              <div className={"ftl-col"}>
                <h4>
                  Products
                </h4>
                <ul>
                  <li>
                    <Link href={"/#products"}>
                      Playing Cards
                    </Link>
                  </li>
                  <li>
                    <Link href={"/#products"}>
                      Promotional Cards
                    </Link>
                  </li>
                  <li>
                    <Link href={"/#products"}>
                      Corporate Playing Cards
                    </Link>
                  </li>
                  <li>
                    <Link href={"/#products"}>
                      Educational &amp; Flash Cards
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={"ftl-col"}>
                <h4>
                  Company
                </h4>
                <ul>
                  <li>
                    <Link href={"/about-us"}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href={"/#why"}>
                      Why Us
                    </Link>
                  </li>
                  <li>
                    <Link href={"/#testimonials"}>
                      Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link href={"/contact-us"}>
                      Contact us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={"ftl-col"}>
                <h4>
                  Reach Us
                </h4>
                <ul>
                  <li>
                    <a href={"mailto:marketingaiph7@gmail.com"}>
                      marketingaiph7@gmail.com
                    </a>
                  </li>
                  <li>
                    <a href={"tel:+91-9810614016"}>
                      +91-9810614016
                    </a>
                  </li>
                  <li>
                    <a href={"tel:+91-9711145467"}>
                      +91-9711145467
                    </a>
                  </li>
                  <li>
                    <span>
                      A-10/2 Mayapuri Industrial Area,
                      <br />
                      Phase 1, New Delhi 110064
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={"footer-bottom"}>
            <p>
              Designed And Managed By Promopact Marketing India Pvt. Ltd. All Rights Reserved.
            </p>
            <div className={"fb-suits"}>
              ♠ ♥ ♦ ♣
            </div>
          </div>
        </div>
      </footer>
      {/* Contact form → mailto composer */}
      {/* ══ FLOATING SOCIAL ICONS ══ */}
      <div className={"floating-social-group"}>
        <a href={"https://wa.me/919810614016"} target={"_blank"} rel={"noopener noreferrer"} className={"fsi-btn fsi-whatsapp"} aria-label={"WhatsApp"}>
          <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
            <path d={"M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.33a9.929 9.929 0 004.93 1.302c5.506 0 9.99-4.478 9.99-9.984C22.007 6.478 17.519 2 12.012 2zm6.09 14.122c-.25.703-1.455 1.285-1.996 1.353-.497.062-1.15.115-3.328-.785-2.784-1.15-4.57-3.98-4.71-4.167-.139-.187-1.135-1.507-1.135-2.877 0-1.37.712-2.042.966-2.316.254-.275.556-.343.74-.343.185 0 .37.004.532.012.169.008.397-.064.62.469.23.55.787 1.916.855 2.053.067.137.112.298.02.482-.09.183-.135.297-.27.457-.134.159-.283.356-.404.477-.135.136-.277.284-.12.553.157.27.7 1.151 1.502 1.866.802.714 1.477.935 1.684 1.026.208.09.33.076.452-.064.122-.14.523-.609.664-.817.14-.207.28-.175.472-.104.193.07 1.22.576 1.43.682.208.106.347.16.398.248.05.088.05.511-.2.122z"}></path>
          </svg>
          <span className={"fsi-tooltip"}>
            WhatsApp
          </span>
        </a>
        <a href={"tel:+919810614016"} className={"fsi-btn fsi-call"} aria-label={"Call Us"}>
          <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
            <path d={"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"}></path>
          </svg>
          <span className={"fsi-tooltip"}>
            Call Us
          </span>
        </a>
        <a href={"mailto:marketingaiph7@gmail.com"} className={"fsi-btn fsi-email"} aria-label={"Email Us"}>
          <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
            <path d={"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"}></path>
          </svg>
          <span className={"fsi-tooltip"}>
            Email Us
          </span>
        </a>
        <a href={"https://instagram.com"} target={"_blank"} rel={"noopener noreferrer"} className={"fsi-btn fsi-instagram"} aria-label={"Instagram"}>
          <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
            <path d={"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"}></path>
          </svg>
          <span className={"fsi-tooltip"}>
            Instagram
          </span>
        </a>
        <a href={"https://facebook.com"} target={"_blank"} rel={"noopener noreferrer"} className={"fsi-btn fsi-facebook"} aria-label={"Facebook"}>
          <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
            <path d={"M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"}></path>
          </svg>
          <span className={"fsi-tooltip"}>
            Facebook
          </span>
        </a>
      </div>
    </div>
  );
}
