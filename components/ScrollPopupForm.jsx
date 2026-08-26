'use client';

import { useEffect, useState } from 'react';

export default function ScrollPopupForm() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Show popup button after 300px scroll
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
        setOpen(false);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const f = e.target;
    const name = f.spf_name.value.trim();
    const phone = f.spf_phone.value.trim();
    const email = f.spf_email.value.trim();
    const interest = f.spf_interest.value;
    const message = f.spf_message.value.trim();

    if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const subject = `Quick Enquiry — ${interest} — ${name}`;
    const body =
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Interested in: ${interest}\n\n` +
      `Message:\n${message}\n`;

    window.open(
      'mailto:marketingaiph7@gmail.com' +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`,
      '_blank'
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
    }, 3000);
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="spf-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Popup Panel */}
      <div className={`spf-panel ${open ? 'spf-panel--open' : ''} ${visible ? 'spf-panel--visible' : ''}`}>
        {/* Trigger button */}
        <button
          className={`spf-trigger ${visible ? 'spf-trigger--show' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Quick Enquiry"
          title="Quick Enquiry"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
            </svg>
          )}
          {!open && <span className="spf-trigger-label">Get Quote</span>}
        </button>

        {/* Form Card */}
        <div className="spf-card" role="dialog" aria-modal="true" aria-label="Quick Enquiry Form">
          <div className="spf-card-header">
            <div>
              <p className="spf-card-eyebrow">⚡ Quick Enquiry</p>
              <h3 className="spf-card-title">Get a Free Quote</h3>
            </div>
            <button className="spf-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>

          {submitted ? (
            <div className="spf-success">
              <div className="spf-success-icon">✓</div>
              <p>Opening your mail app…</p>
              <p className="spf-success-sub">We'll get back to you within 24 hours!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="spf-form" noValidate>
              <div className="spf-row">
                <div className="spf-field">
                  <label htmlFor="spf_name">Name <span>*</span></label>
                  <input id="spf_name" name="spf_name" type="text" placeholder="Your name" required />
                </div>
                <div className="spf-field">
                  <label htmlFor="spf_phone">Phone <span>*</span></label>
                  <input id="spf_phone" name="spf_phone" type="tel" placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>
              <div className="spf-field">
                <label htmlFor="spf_email">Email</label>
                <input id="spf_email" name="spf_email" type="email" placeholder="your@email.com" />
              </div>
              <div className="spf-field">
                <label htmlFor="spf_interest">Interested In</label>
                <select id="spf_interest" name="spf_interest">
                  <option value="Premium Playing Cards">Premium Playing Cards</option>
                  <option value="Promotional Playing Cards">Promotional Playing Cards</option>
                  <option value="Advertisement Playing Cards">Advertisement Playing Cards</option>
                  <option value="Corporate Playing Cards">Corporate Playing Cards</option>
                  <option value="Branded Playing Cards">Branded Playing Cards</option>
                  <option value="Poker Cards">Poker Cards</option>
                  <option value="Card Games">Card Games</option>
                  <option value="Educational Cards">Educational Cards</option>
                  <option value="Flash Cards">Flash Cards</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="spf-field">
                <label htmlFor="spf_message">Message</label>
                <textarea id="spf_message" name="spf_message" rows={3} placeholder="Tell us about your requirements…" />
              </div>

              {/* Action buttons */}
              <div className="spf-actions">
                <button type="submit" className="spf-btn spf-btn--primary">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  Send Enquiry
                </button>
                <a
                  href="https://wa.me/919810614016?text=Hi%20AIPH%2C%20I%20am%20interested%20in%20your%20playing%20cards.%20Please%20share%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spf-btn spf-btn--whatsapp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.33a9.929 9.929 0 004.93 1.302c5.506 0 9.99-4.478 9.99-9.984C22.007 6.478 17.519 2 12.012 2zm6.09 14.122c-.25.703-1.455 1.285-1.996 1.353-.497.062-1.15.115-3.328-.785-2.784-1.15-4.57-3.98-4.71-4.167-.139-.187-1.135-1.507-1.135-2.877 0-1.37.712-2.042.966-2.316.254-.275.556-.343.74-.343.185 0 .37.004.532.012.169.008.397-.064.62.469.23.55.787 1.916.855 2.053.067.137.112.298.02.482-.09.183-.135.297-.27.457-.134.159-.283.356-.404.477-.135.136-.277.284-.12.553.157.27.7 1.151 1.502 1.866.802.714 1.477.935 1.684 1.026.208.09.33.076.452-.064.122-.14.523-.609.664-.817.14-.207.28-.175.472-.104.193.07 1.22.576 1.43.682.208.106.347.16.398.248.05.088.05.511-.2.122z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="mailto:marketingaiph7@gmail.com"
                  className="spf-btn spf-btn--email"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  Mail Us
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
