"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  Mail,
  Menu,
  MessageCircle,
  MapPinned,
  PieChart,
  Quote,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";
import { defaultContent, mergeContent, type SiteContent } from "../lib/content";
import { supabase } from "../lib/supabase";

const serviceIcons = [PieChart, CalendarDays, ChartNoAxesCombined, ShieldCheck];
const trustIcons = [ShieldCheck, MessageCircle, Target];
const withBreaks = (text: string) =>
  text.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (sent) {
      successRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      successRef.current?.focus({ preventScroll: true });
    }
  }, [sent]);

  useEffect(() => {
    if (supabase)
      supabase
        .from("website_content")
        .select("content")
        .eq("id", "main")
        .maybeSingle()
        .then(({ data }) => {
          if (data?.content)
            setContent(mergeContent(data.content as Partial<SiteContent>));
        });
    else {
      const draft = localStorage.getItem("dce-content-draft");
      if (draft)
        setContent(mergeContent(JSON.parse(draft) as Partial<SiteContent>));
    }
    const timer = window.setInterval(
      () =>
        setSlide(
          (value) =>
            (value + 1) % Math.max(content.testimonials.items.length, 1),
        ),
      7000,
    );
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [content.testimonials.items.length]);

  const move = (amount: number) =>
    setSlide(
      (slide + amount + content.testimonials.items.length) %
        content.testimonials.items.length,
    );
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setSendError("");
    const form = event.currentTarget;
    const enquiry = Object.fromEntries(new FormData(form).entries());

    let savedToInbox = false;
    if (supabase) {
      const { error } = await supabase.from("enquiries").insert(enquiry);
      savedToInbox = !error;
      if (error) console.error("The enquiry could not be saved.", error);
    } else {
      const messages = JSON.parse(
        localStorage.getItem("dce-enquiries") || "[]",
      );
      localStorage.setItem(
        "dce-enquiries",
        JSON.stringify([
          {
            ...enquiry,
            id: Date.now(),
            created_at: new Date().toISOString(),
            status: "New",
          },
          ...messages,
        ]),
      );
      savedToInbox = true;
    }

    let emailSent = false;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
      emailSent = response.ok;
    } catch {
      console.error("The enquiry email notification could not be sent.");
    }

    if (!savedToInbox && !emailSent) {
      setSending(false);
      setSendError(
        "Your message could not be sent. Please try again or email Daniel directly.",
      );
      return;
    }
    form.reset();
    setSending(false);
    setSent(true);
  };

  return (
    <main
      style={
        {
          "--hero-image": `url(${content.hero.imageUrl})`,
        } as React.CSSProperties
      }
    >
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <a className="brand" href="#top">
          <span>DCE</span>
          <b>Daniel Charles Evans</b>
        </a>
        <nav className={open ? "open" : ""}>
          {["About", "Services", "Testimonials", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
          <a className="button" href="#contact">
            {content.hero.primaryButton}
          </a>
        </nav>
        <button
          className="menu"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
      <section id="top" className="hero">
        <div className="heroImage" />
        <div className="heroInner">
          <div className="eyebrow">{content.hero.eyebrow}</div>
          <h1>{withBreaks(content.hero.title)}</h1>
          <p>{content.hero.body}</p>
          <div className="heroActions">
            <a className="button" href="#contact">
              {content.hero.primaryButton} <ArrowRight size={16} />
            </a>
            <a
              className="textLink"
              href="https://reports.adviserinfo.sec.gov/reports/individual/individual_2302549.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.hero.secondaryButton}
            </a>
          </div>
        </div>
      </section>
      <section className="trust">
        {content.trust.map((item, index) => {
          const Icon = trustIcons[index] || Target;
          return (
            <div key={`${item.title}-${index}`}>
              <Icon />
              <span>
                <b>{item.title}</b>
                <small>{item.subtitle}</small>
              </span>
            </div>
          );
        })}
      </section>
      <section id="about" className="about section">
        <div>
          <div className="eyebrow">{content.about.eyebrow}</div>
          <h2>{withBreaks(content.about.title)}</h2>
          {content.about.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="stats">
          <article>
            <BadgeCheck />
            <strong>22</strong>
            <span>Years of Experience</span>
          </article>
          <article>
            <Building2 />
            <strong>2</strong>
            <span>Firms</span>
          </article>
          <article>
            <MapPinned />
            <strong>54</strong>
            <span>State Licenses</span>
          </article>
          <article>
            <ShieldCheck />
            <strong>1</strong>
            <span>Disclosure</span>
          </article>
        </div>
      </section>
      <section id="services" className="services section">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">{content.services.eyebrow}</div>
            <h2>{withBreaks(content.services.title)}</h2>
          </div>
          <p>{content.services.intro}</p>
        </div>
        <div className="serviceGrid">
          {content.services.items.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <article key={`${service.title}-${index}`}>
                <span className="num">0{index + 1}</span>
                <Icon />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section id="testimonials" className="testimonials section">
        <div className="sectionHead testimonialHead">
          <div>
            <div className="eyebrow">{content.testimonials.eyebrow}</div>
            <h2>{withBreaks(content.testimonials.title)}</h2>
          </div>
          <div className="controls">
            <button onClick={() => move(-1)} aria-label="Previous testimonial">
              <ArrowLeft />
            </button>
            <button onClick={() => move(1)} aria-label="Next testimonial">
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className="slider">
          <div
            className="sliderTrack"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {content.testimonials.items.map((item, index) => (
              <blockquote key={`${item.name}-${index}`}>
                <Quote />
                <p>{item.quote}</p>
                <footer>
                  <span>{item.name[0]}</span>
                  <b>
                    {item.name}
                    <small>{item.role}</small>
                  </b>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
        <div className="dots">
          {content.testimonials.items.map((_, index) => (
            <button
              key={index}
              className={index === slide ? "active" : ""}
              onClick={() => setSlide(index)}
              aria-label={`Show testimonial ${index + 1}`}
            />
          ))}
        </div>
      </section>
      <section className="cta">
        <div>
          <small>{content.cta.eyebrow}</small>
          <h2>{content.cta.title}</h2>
          <p>{content.cta.body}</p>
        </div>
        <a className="button light" href="#contact">
          {content.cta.button} <ArrowRight size={16} />
        </a>
      </section>
      <section id="contact" className="contact section">
        <div>
          <div className="eyebrow">{content.contact.eyebrow}</div>
          <h2>{withBreaks(content.contact.title)}</h2>
          <p>{content.contact.body}</p>
          <a href={`mailto:${content.contact.email}`}>
            <Mail size={16} /> {content.contact.email}
          </a>
        </div>
        {sent ? (
          <div
            className="success"
            ref={successRef}
            role="status"
            tabIndex={-1}
            aria-live="polite"
          >
            <span className="successIcon">
              <Check />
            </span>
            <h3>Message sent successfully!</h3>
            <p>
              Thank you for getting in touch. Your enquiry has been received and
              Daniel will respond shortly.
            </p>
            <button onClick={() => setSent(false)}>Send another message</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label>
              Full name
              <input required name="name" />
            </label>
            <label>
              Email address
              <input
                required
                name="email"
                type="email"
              />
            </label>
            <label>
              Phone number
              <input
                required
                name="phone"
                type="tel"
                autoComplete="tel"
              />
            </label>
            <label>
              Location
              <input required name="location" />
            </label>
            <label className="wide">
              Subject
              <input
                required
                name="subject"
              />
            </label>
            <label className="wide">
              How can I help?
              <textarea
                required
                name="message"
              />
            </label>
            <label className="consent wide">
              <input type="checkbox" required />
              <i>I agree to be contacted about my enquiry.</i>
            </label>
            {sendError && (
              <p className="wide" role="alert">
                {sendError}
              </p>
            )}
            <button className="button wide" type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send enquiry"} <ArrowRight size={16} />
            </button>
          </form>
        )}
      </section>
      <footer className="footer">
        <div className="brand">
          <span>DCE</span>
          <b>Daniel Charles Evans</b>
        </div>
        <p>{withBreaks(content.footer.tagline)}</p>
        <div className="footerLinks">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
        <div>
          <b>{content.footer.businessName}</b>
          <p>{withBreaks(content.footer.businessDetails)}</p>
        </div>
        <small>{content.footer.legal}</small>
      </footer>
    </main>
  );
}
