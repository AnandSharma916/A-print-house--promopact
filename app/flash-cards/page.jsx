import Link from 'next/link';
import LegacyEngine from '@/components/LegacyEngine';
import './flash-cards.css';
import '../styles/inner-page-fixes.css';

export const metadata = {
  title: "Flash Cards Manufacturer in India | A India Print House",
  description: "A India Print House is a trusted Flash Cards Manufacturer in India. High-quality customized flash cards for schools, preschools, coaching centres, and publishers — designed for fast recall, memory building, and effective revision.",
  keywords: "flash cards manufacturer, flash cards printing India, custom flash cards, sight word flash cards, memory cards, revision cards, montessori flash cards supplier Delhi",
  alternates: { canonical: "/flash-cards" },
};

export default function FlashCardsPage() {
  return (
    <div className="page-root">
      <LegacyEngine variant="product" />
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
              <a href={"#"} className={"hdr-link"}>
                Collection
                <span className={"hdr-caret"}>
                  ▾
                </span>
              </a>
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
                <Link href={"/flash-cards"} className={"hdr-menu-link is-current"}>
                  Flash Cards
                </Link>
              </div>
            </div>
            <Link href={"/about-us"} className={"hdr-link"}>
              About Us
            </Link>
            <Link href={"/contact-us"} className={"hdr-link"}>
              Contact us
            </Link>
          </nav>
          <a href={"#"} className={"hdr-btn magnetic"}>
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
            <a href={"#"} className={"no-link"}>
              <em className={"no-idx"}>
                04
              </em>
              <span>
                Why Us
              </span>
            </a>
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
      {/* Hero Section */}
      <section className={"hero"}>
        <div className={"hero__bg"}>
          <img alt={"Flash Cards Manufacturer in India"} src={"/Flash-Cards/Flash-Card-Banner.avif"} />
          <div className={"hero__overlay"}></div>
          <div className={"hero__gradient"}></div>
        </div>
        <div id={"hero-particles"}></div>
        <div className={"hero__content"}>
          <span className={"hero__eyebrow"}>
            FLASH CARDS · INDIA
          </span>
          <h1 className={"hero__title"}>
            Flash Cards
            <br />
            <em>
              Manufacturer in India
            </em>
          </h1>
          <p className={"hero__text"}>
            Custom flash cards by A India Print House — high-quality, durable cards that boost fast recall, memory, and revision for learners of every age.
          </p>
          <div>
            <button className={"btn-cream"} id={"hero-order-btn"}>
              Order Now
            </button>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className={"hero__scroll"}>
          <span>
            Scroll
          </span>
          <div className={"hero__scroll-line"}></div>
        </div>
      </section>
      {/* Introduction Section */}
      <section className={"section section--padded bg-surface"}>
        <div className={"container heritage__grid"}>
          <div className={"heritage__text"}>
            <span className={"eyebrow"}>
              About Our Products
            </span>
            <h2 className={"headline-lg heritage__title"} data-split="">
              Custom Flash Cards for Faster Learning
            </h2>
            <p className={"body-md heritage__p"}>
              A India Print House is a trusted Flash Cards Manufacturer in India, offering high-quality and customized flash cards for schools, preschools, coaching centres, publishers, and edtech brands. We manufacture engaging and durable flash card sets designed for quick recall, active revision, and confident, independent learning.
            </p>
            <p className={"body-md heritage__p heritage__p--last"}>
              Our flash cards are produced using premium materials, child-safe inks, and advanced printing technology to ensure crisp graphics, bold text, and long-lasting performance. Whether you need sight-word cards, phonics cards, maths and vocabulary cards, or fully custom revision decks, we deliver solutions tailored to your learners and subjects.
            </p>
            <div className={"discover"}>
              <div className={"discover__icon"}>
                <span className={"material-symbols-outlined"}>
                  arrow_forward
                </span>
              </div>
              <span className={"label-md discover__label"}>
                Discover our process
              </span>
            </div>
          </div>
          <div className={"heritage__media"}>
            <div className={"media-frame tint-panel"} style={{ '--tint': "#f2f23c" }}>
              <img alt={"Custom Flash Cards for Revision and Recall — A India Print House"} src={"/Flash-Cards/Flash-Cards1-Photoroom-fit.avif"} className={"no-parallax"} />
              <div className={"media-frame__ring"}></div>
            </div>
            {/* Rotating Badge */}
            <div className={"badge"}>
              <div className={"badge__inner"}>
                <svg className={"badge__svg"} viewBox={"0 0 100 100"}>
                  <defs>
                    <path d={"M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"} id={"textCirclePromo"}></path>
                  </defs>
                  <text>
                    <textpath xlinkHref={"#textCirclePromo"}>
                      A INDIA PRINT HOUSE • FLASH CARDS • SINCE 1998 •
                    </textpath>
                  </text>
                </svg>
                <div className={"badge__core"}>
                  <span className={"material-symbols-outlined"}>
                    campaign
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* High-Quality Card Game Printing Section */}
      <section className={"section bg-dark"}>
        <div className={"container section--padded"}>
          <div className={"section-head"}>
            <h2 className={"headline-lg"} data-split="">
              High-Quality Flash Card Printing
            </h2>
            <div className={"section-head__rule"} data-scroll="" data-scroll-class={"is-inview"}></div>
            <p className={"body-lg section-head__text"}>
              We create flash cards with bold text, clear illustrations, and professional finishing. Our team can customize every card with your words, images, questions, answers, and subject content — printed for instant readability and everyday durability.
            </p>
          </div>
          <div className={"durable__grid"}>
            <div className={"atropos deck-atropos"}>
              <div className={"atropos-scale"}>
                <div className={"atropos-rotate"}>
                  <div className={"atropos-inner"}>
                    <div className={"deck-card tint-panel"} style={{ '--tint': "#f2c43c" }}>
                      <div className={"deck-frame"} aria-hidden={"true"}></div>
                      <img alt={"Custom Subject Flash Cards — A India Print House"} src={"/Flash-Cards/Flash-Cards2-fit.avif"} className={"no-parallax"} />
                      <div className={"deck-card__caption"}>
                        <div>
                          <span className={"label-sm deck-card__kicker"}>
                            Any Subject
                          </span>
                          <h3 className={"headline-md deck-card__title"}>
                            Designed Around Your Topics
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={"atropos deck-atropos"}>
              <div className={"atropos-scale"}>
                <div className={"atropos-rotate"}>
                  <div className={"atropos-inner"}>
                    <div className={"deck-card tint-panel"} style={{ '--tint': "#f2f23c" }}>
                      <div className={"deck-frame"} aria-hidden={"true"}></div>
                      <img alt={"Bold, Readable Flash Cards for Quick Recall — A India Print House"} src={"/Flash-Cards/Flash-Cards3-fit.avif"} className={"no-parallax"} />
                      <div className={"deck-card__caption"}>
                        <div>
                          <span className={"label-sm deck-card__kicker"}>
                            Bold & Readable
                          </span>
                          <h3 className={"headline-md deck-card__title"}>
                            Sharp Cards for Fast Recall
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 3D Card Showcase (Three.js) */}
      <section className={"card-showcase"} id={"card-showcase"}>
        <div className={"card-showcase__content container section--padded"}>
          <span className={"eyebrow"}>
            Crafted for Every Learner
          </span>
          <h2 className={"display-lg card-showcase__title"}>
            Cards That Speed Up Recall
          </h2>
          <p className={"card-showcase__text"}>
            From phonics and sight words to exam revision — every flash card is built for clarity, quick recognition, and repeated daily use.
          </p>
        </div>
      </section>
      {/* Features Bento Grid */}
      <section className={"section section--padded bg-surface"}>
        <div className={"container"}>
          <div className={"specs__head"}>
            <span className={"eyebrow specs__kicker"}>
              Product Features
            </span>
            <h2 className={"headline-lg specs__title"} data-split="">
              Unrivaled Quality in Every Detail
            </h2>
          </div>
          <div className={"bento"}>
            {/* Large Feature */}
            <div className={"bento__cell bento__cell--feature"}>
              <div>
                <span className={"material-symbols-outlined bento__icon bento__icon--lg"}>
                  layers
                </span>
                <h4 className={"headline-md bento__feature-title"}>
                  Premium, Child-Safe Card Material
                </h4>
                <p className={"body-md bento__desc"}>
                  Crafted from thick, premium-grade card stock with rounded corners and non-toxic inks — easy to grip, easy to shuffle, and built to survive daily revision.
                </p>
              </div>
              <div className={"bento__meta"}>
                <span className={"label-sm bento__meta-label"}>
                  Smooth Finish | Kid-Safe
                </span>
                <span className={"material-symbols-outlined"} style={{ color: "var(--foil-gold)" }}>
                  check_circle
                </span>
              </div>
            </div>
            {/* Small Features */}
            <div className={"bento__cell"}>
              <span className={"material-symbols-outlined bento__icon"}>
                brush
              </span>
              <h5 className={"label-md bento__heading"}>
                Bold & Legible Printing
              </h5>
              <p className={"bento__desc bento__desc--sm"}>
                High-contrast text and crisp images that are instantly readable from across the room.
              </p>
            </div>
            <div className={"bento__cell"}>
              <span className={"material-symbols-outlined bento__icon"}>
                palette
              </span>
              <h5 className={"label-md bento__heading"}>
                Custom Card Content
              </h5>
              <p className={"bento__desc bento__desc--sm"}>
                Bespoke words, images, questions, and answers tailored to any subject or level.
              </p>
            </div>
            <div className={"bento__cell"}>
              <span className={"material-symbols-outlined bento__icon"}>
                open_in_full
              </span>
              <h5 className={"label-md bento__heading"}>
                Different Sizes & Shapes
              </h5>
              <p className={"bento__desc bento__desc--sm"}>
                Pocket, standard, and jumbo sizes to suit self-study, group drills, and display use.
              </p>
            </div>
            <div className={"bento__cell"}>
              <span className={"material-symbols-outlined bento__icon"}>
                inventory_2
              </span>
              <h5 className={"label-md bento__heading"}>
                Bulk Order Facility
              </h5>
              <p className={"bento__desc bento__desc--sm"}>
                Scalable production with customized boxed sets and ring-bound decks for any volume.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Applications Visual List */}
      <section className={"section section--padded bg-dark"}>
        <div className={"container apps__grid"}>
          <div>
            <h2 className={"headline-lg apps__title"}>
              Applications &amp; Markets
            </h2>
            <ul className={"apps__list"}>
              <li className={"apps__item"}>
                <span className={"headline-md apps__num"}>
                  01
                </span>
                <span className={"headline-md apps__name"}>
                  Schools &amp; Preschools
                </span>
              </li>
              <li className={"apps__item"}>
                <span className={"headline-md apps__num"}>
                  02
                </span>
                <span className={"headline-md apps__name"}>
                  Coaching &amp; Exam Prep
                </span>
              </li>
              <li className={"apps__item"}>
                <span className={"headline-md apps__num"}>
                  03
                </span>
                <span className={"headline-md apps__name"}>
                  Language &amp; Phonics Learning
                </span>
              </li>
              <li className={"apps__item"}>
                <span className={"headline-md apps__num"}>
                  04
                </span>
                <span className={"headline-md apps__name"}>
                  Home &amp; Parent Learning
                </span>
              </li>
              <li className={"apps__item"}>
                <span className={"headline-md apps__num"}>
                  05
                </span>
                <span className={"headline-md apps__name"}>
                  Publishers &amp; EdTech Brands
                </span>
              </li>
              <li className={"apps__item"}>
                <span className={"headline-md apps__num"}>
                  06
                </span>
                <span className={"headline-md apps__name"}>
                  Retail &amp; Gifting
                </span>
              </li>
            </ul>
          </div>
          <div className={"apps__media tint-panel"} style={{ '--tint': "#3c69f2" }}>
            <img alt={"Flash Cards for Schools, Coaching and Exam Prep — A India Print House"} src={"/Flash-Cards/Flash-Cards4-fit.avif"} className={"no-parallax"} />
            <div className={"apps__media-ring"}></div>
          </div>
        </div>
      </section>
      {/* Benefits / Customization Detail */}
      <section className={"section section--padded bg-surface"}>
        <div className={"container custom"}>
          <h2 className={"headline-lg custom__title"} data-split="">
            Benefits of Flash Cards
          </h2>
          <p className={"body-lg custom__quote"}>
            "Flash cards are one of the most effective learning tools ever made. Through quick repetition and active recall, they strengthen memory, build vocabulary, speed up revision, and give learners the confidence to master new concepts on their own."
          </p>
          <div className={"custom__sig"}>
            <div className={"custom__sig-rule"}></div>
            <span className={"label-md custom__sig-label"}>
              Memory &amp; Revision Series
            </span>
          </div>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section className={"section section--padded bg-cream"}>
        <div className={"container why__grid"}>
          <div className={"why__quote"}>
            <blockquote className={"headline-lg"}>
              "Creating Flash Cards That Turn Repetition Into Mastery."
            </blockquote>
          </div>
          <div className={"why__benefits"}>
            <div className={"why__benefits-grid"}>
              <div>
                <h6 className={"label-md benefit__title"} data-scroll="" data-scroll-class={"is-inview"}>
                  Double-Sided Printing
                </h6>
                <p className={"benefit__desc"}>
                  Question-and-answer or word-and-image layouts are perfectly aligned front to back — ideal for self-testing and active recall.
                </p>
              </div>
              <div>
                <h6 className={"label-md benefit__title"} data-scroll="" data-scroll-class={"is-inview"}>
                  Child-Safe Inks
                </h6>
                <p className={"benefit__desc"}>
                  All inks and coatings are non-toxic and comply with international toy-safety standards — making every card safe for learners of all ages.
                </p>
              </div>
              <div>
                <h6 className={"label-md benefit__title"} data-scroll="" data-scroll-class={"is-inview"}>
                  Everyday Durability
                </h6>
                <p className={"benefit__desc"}>
                  Reinforced card stock, rounded corners, and scratch-resistant coatings withstand daily shuffling — ideal for classrooms, home study, and retail sets.
                </p>
              </div>
              <div>
                <h6 className={"label-md benefit__title"} data-scroll="" data-scroll-class={"is-inview"}>
                  Ring-Bound & Boxed Options
                </h6>
                <p className={"benefit__desc"}>
                  Choose loose decks, sturdy boxes, or ring-bound sets that keep cards organised and portable — with flexible MOQs for every stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Final CTA Section */}
      <section className={"section bg-dark cta"}>
        <canvas id={"cta-granim"}></canvas>
        <div className={"container section--padded"}>
          <h2 className={"display-lg cta__title"}>
            Bring Your Flash Cards to Life
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "18px", maxWidth: "640px", margin: "0 auto 48px", textAlign: "center", fontFamily: "var(--font-sans)" }}>
            Looking for a reliable Flash Cards Manufacturer in India? A India Print House offers customized flash card printing solutions with superior quality and effective, learner-friendly designs. A India Print House — Your Trusted Partner for Quality Flash Cards.
          </p>
          <div className={"cta__contacts"}>
            <div className={"cta__contact"}>
              <span className={"material-symbols-outlined"}>
                mail
              </span>
              <a className={"headline-md"} href={"mailto:marketingaiph7@gmail.com"}>
                marketingaiph7@gmail.com
              </a>
            </div>
            <div className={"cta__contact"}>
              <span className={"material-symbols-outlined"}>
                call
              </span>
              <a className={"headline-md"} href={"tel:+919810614016"}>
                +91 9810614016
              </a>
            </div>
          </div>
          <button className={"btn-gold"} id={"cta-order-btn"}>
            Start Project Now
          </button>
        </div>
      </section>
      {/* FOOTER */}
      <footer id={"site-footer"} data-scroll="" data-scroll-call={"footer"}>
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
                India's trusted flash cards manufacturer — creating cards that turn repetition into mastery.
              </p>
            </div>
            <div className={"ft-links-cols"}>
              <div className={"ftl-col"}>
                <h4>
                  Products
                </h4>
                <ul>
                  <li>
                    <a href={"#"}>
                      Playing Cards
                    </a>
                  </li>
                  <li>
                    <a href={"#"}>
                      Promotional Cards
                    </a>
                  </li>
                  <li>
                    <a href={"#"}>
                      Corporate Playing Cards
                    </a>
                  </li>
                  <li>
                    <a href={"#"}>
                      Educational &amp; Flash Cards
                    </a>
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
                    <a href={"#"}>
                      Why Us
                    </a>
                  </li>
                  <li>
                    <a href={"#"}>
                      Testimonials
                    </a>
                  </li>
                  <li>
                    <a href={"#"}>
                      Contact us
                    </a>
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
      {/* Navbar behavior + all animations are handled by assets/animations.js */}
      {/* FLOATING SOCIAL ICONS */}
      <div className={"floating-social-group"}>
        <a href={"https://wa.me/919810614016"} target={"_blank"} rel={"noopener noreferrer"} className={"fsi-btn fsi-whatsapp"} aria-label={"WhatsApp"}>
          <svg viewBox={"0 0 24 24"} fill={"currentColor"}>
            <path d={"M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.33a9.929 9.929 0 004.93 1.302c5.506 0 9.99-4.478 9.99-9.984C22.007 6.478 17.519 2 12.012 2zm6.09 14.122c-.25.703-1.455 1.285-1.996 1.353-.497.062-1.15.115-3.328-.785-2.784-1.15-4.57-3.98-4.71-4.167-.139-.187-1.135-1.507-1.135-2.877 0-1.37.712-2.042.966-2.316.254-.275.556-.343.74-.343.185 0 .37.004.532.012.169.008.397-.064.62.469.23.55.787 1.916.855 2.053.067.137.112.298.02.482-.09.183-.135.297-.27.457-.134.159-.283.356-.404.477-.135.136-.277.284-.12.553.157.27.7 1.151 1.502 1.866.802.714 1.477.935 1.684 1.026.208.09.33.076.452-.064.122-.14.523-.609.664-.817.14-.207.28-.175.472-.104.193.07 1.22.576 1.43.682.208.106.347.16.398.248.05.088.05.511-.2 1.122z"}></path>
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
      {/* All animations run from the shared module */}
    </div>
  );
}
