'use client';

import { useEffect } from 'react';

/**
 * Contact page enquiry form → mailto composer.
 *
 * Ported from the inline <script> at the bottom of contact-us.html. It stays a
 * mount-time listener rather than a React onSubmit so the form markup in
 * app/contact-us/page.jsx remains a byte-for-byte port of the original.
 */
export default function EnquiryMailto() {
  useEffect(() => {
    const form = document.getElementById('enquiry-form');
    if (!form) return undefined;

    function onSubmit(e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const interest = form.interest.value;
      const message = form.message.value.trim();

      if (!name || !phone || !email || !message) {
        alert('Please fill in your name, phone, email and message.');
        return;
      }

      const subject = `New Enquiry — ${interest} — ${name}`;
      const body =
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Interested in: ${interest}\n\n` +
        `Message:\n${message}\n`;

      window.location.href =
        'mailto:marketingaiph7@gmail.com' +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    }

    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, []);

  return null;
}
