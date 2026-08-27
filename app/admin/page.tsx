"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Plus,
  Save,
  Send,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import {
  defaultContent,
  mergeContent,
  type SiteContent,
} from "../../lib/content";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
};
type Section =
  | "Hero"
  | "Trust bar"
  | "About"
  | "Services"
  | "Testimonials"
  | "CTA"
  | "Contact"
  | "Footer";
const sections: Section[] = [
  "Hero",
  "Trust bar",
  "About",
  "Services",
  "Testimonials",
  "CTA",
  "Contact",
  "Footer",
];

const Field = ({
  label,
  value,
  onChange,
  area = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
  rows?: number;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#72818a]">
      {label}
    </span>
    {area ? (
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded border border-[#d6dde1] px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#1d607c]"
      />
    ) : (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-[#d6dde1] px-3 py-2.5 text-sm outline-none focus:border-[#1d607c]"
      />
    )}
  </label>
);

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [active, setActive] = useState<Section | "Dashboard" | "Messages">(
    "Dashboard",
  );
  const [saved, setSaved] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [sessionReady, setSessionReady] = useState(!isSupabaseConfigured);
  const [authenticated, setAuthenticated] = useState(!isSupabaseConfigured);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(Boolean(data.session));
      setSessionReady(true);
    });
    const { data: auth } = supabase.auth.onAuthStateChange((_event, session) =>
      setAuthenticated(Boolean(session)),
    );
    return () => auth.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const load = async () => {
      setContentLoading(true);
      setNotice("");
      if (supabase) {
        const [contentResult, enquiryResult] = await Promise.all([
          supabase
            .from("website_content")
            .select("content")
            .eq("id", "main")
            .maybeSingle(),
          supabase
            .from("enquiries")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);
        if (contentResult.error)
          setNotice(
            `Could not load website content: ${contentResult.error.message}`,
          );
        else if (contentResult.data?.content)
          setContent(
            mergeContent(contentResult.data.content as Partial<SiteContent>),
          );
        if (enquiryResult.error)
          setNotice(`Could not load enquiries: ${enquiryResult.error.message}`);
        else setEnquiries((enquiryResult.data || []) as Enquiry[]);
      } else {
        try {
          const draft = localStorage.getItem("dce-content-draft");
          if (draft)
            setContent(mergeContent(JSON.parse(draft) as Partial<SiteContent>));
          setEnquiries(
            JSON.parse(localStorage.getItem("dce-enquiries") || "[]"),
          );
        } catch {
          setNotice("Local CMS data could not be read.");
        }
      }
      setContentLoading(false);
    };
    void load();
  }, [authenticated]);

  const change = <K extends keyof SiteContent>(
    section: K,
    values: Partial<SiteContent[K]>,
  ) => {
    setContent((current) => ({
      ...current,
      [section]: { ...current[section], ...values },
    }));
    setSaved(false);
  };
  const publish = async () => {
    if (publishing) return;
    setPublishing(true);
    setNotice("");
    if (supabase) {
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("website_content").upsert({
        id: "main",
        content,
        updated_at: new Date().toISOString(),
        updated_by: user.user?.id,
      });
      if (error) {
        setNotice(`Could not publish: ${error.message}`);
        setPublishing(false);
        return;
      }
    } else localStorage.setItem("dce-content-draft", JSON.stringify(content));
    setSaved(true);
    setPublishing(false);
    setNotice("Changes published successfully.");
  };
  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    const { error } = await supabase!.auth.signInWithPassword(login);
    if (error) setLoginError(error.message);
  };
  const removeEnquiry = async (id: number) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    if (supabase) {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) {
        setNotice(`Could not delete enquiry: ${error.message}`);
        return;
      }
    } else
      localStorage.setItem(
        "dce-enquiries",
        JSON.stringify(enquiries.filter((item) => item.id !== id)),
      );
    setEnquiries((items) => items.filter((item) => item.id !== id));
  };
  const updateEnquiryStatus = async (
    id: number,
    status: "New" | "Read" | "Replied",
  ) => {
    if (supabase) {
      const { error } = await supabase
        .from("enquiries")
        .update({ status })
        .eq("id", id);
      if (error) {
        setNotice(`Could not update enquiry: ${error.message}`);
        return;
      }
    } else {
      const next = enquiries.map((item) =>
        item.id === id ? { ...item, status } : item,
      );
      localStorage.setItem("dce-enquiries", JSON.stringify(next));
    }
    setEnquiries((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  if (!sessionReady)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f7f8] text-sm text-[#587065]">
        Loading CMS…
      </div>
    );
  if (!authenticated)
    return (
      <main className="grid min-h-screen place-items-center bg-[#eef3f5] p-5">
        <form
          onSubmit={signIn}
          className="w-full max-w-md rounded-xl border border-[#d8e0e4] bg-white p-8 shadow-xl"
        >
          <a href="/" className="mb-8 flex items-center gap-3">
            <span className="rounded-tr-xl bg-[#c94d35] px-3 py-2 text-lg font-extrabold text-white">
              DCE
            </span>
            <span>
              <b className="block text-sm text-[#123d55]">Portfolio CMS</b>
              <small className="text-[#71818a]">Administrator sign in</small>
            </span>
          </a>
          <h1 className="font-serif text-3xl font-semibold text-[#122f43]">
            Welcome back
          </h1>
          <p className="mb-6 mt-2 text-sm text-[#647681]">
            Sign in with the administrator you created in Supabase
            Authentication.
          </p>
          <div className="space-y-4">
            <Field
              label="Email address"
              value={login.email}
              onChange={(email) => setLogin({ ...login, email })}
            />
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#72818a]">
                Password
              </span>
              <input
                type="password"
                value={login.password}
                onChange={(event) =>
                  setLogin({ ...login, password: event.target.value })
                }
                className="w-full rounded border border-[#d6dde1] px-3 py-2.5"
              />
            </label>
          </div>
          {loginError && (
            <p className="mt-4 text-sm text-[#c94d35]">{loginError}</p>
          )}
          <button className="mt-6 w-full rounded bg-[#164a65] px-4 py-3 text-sm font-bold text-white">
            Sign in
          </button>
        </form>
      </main>
    );

  const nav = (
    <>
      <button
        onClick={() => {
          setActive("Dashboard");
          setMobileNav(false);
        }}
        className={`flex w-full items-center gap-4 rounded-md px-4 py-3 text-left text-sm font-semibold ${active === "Dashboard" ? "bg-white text-[#123d55]" : "text-white/80"}`}
      >
        <LayoutDashboard size={19} />
        Dashboard
      </button>
      <div className="px-4 pb-2 pt-5 text-[9px] font-bold uppercase tracking-[.2em] text-white/40">
        Website sections
      </div>
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => {
            setActive(section);
            setMobileNav(false);
          }}
          className={`flex w-full items-center gap-4 rounded-md px-4 py-3 text-left text-sm font-semibold ${active === section ? "bg-white text-[#123d55]" : "text-white/80"}`}
        >
          <FileText size={18} />
          {section}
        </button>
      ))}
      <div className="px-4 pb-2 pt-5 text-[9px] font-bold uppercase tracking-[.2em] text-white/40">
        Inbox
      </div>
      <button
        onClick={() => {
          setActive("Messages");
          setMobileNav(false);
        }}
        className={`flex w-full items-center gap-4 rounded-md px-4 py-3 text-left text-sm font-semibold ${active === "Messages" ? "bg-white text-[#123d55]" : "text-white/80"}`}
      >
        <Mail size={19} />
        Messages{" "}
        <span className="ml-auto rounded-full bg-[#d95c3c] px-2 py-0.5 text-[9px] text-white">
          {enquiries.length}
        </span>
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#122f43] lg:grid lg:grid-cols-[248px_1fr]">
      <aside
        className={`${mobileNav ? "block" : "hidden"} fixed inset-0 z-50 overflow-y-auto bg-[#123d55] text-white lg:sticky lg:top-0 lg:block lg:h-screen`}
      >
        <div className="flex h-[90px] items-center justify-between border-b border-white/10 px-6">
          <a href="/" className="flex items-center gap-3">
            <span className="rounded-tr-xl bg-[#c94d35] px-3 py-2 text-lg font-extrabold">
              DCE
            </span>
            <span>
              <b className="block text-sm">Portfolio CMS</b>
              <small className="text-white/60">Live website content</small>
            </span>
          </a>
          <button className="lg:hidden" onClick={() => setMobileNav(false)}>
            <X />
          </button>
        </div>
        <nav className="p-4">{nav}</nav>
        <button
          onClick={() => supabase?.auth.signOut()}
          className="m-4 flex items-center gap-3 text-xs font-bold text-white/70"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-[78px] items-center justify-between border-b border-[#dde3e6] bg-white px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMobileNav(true)}>
              <Menu />
            </button>
            <div>
              <h1 className="font-serif text-2xl font-semibold">
                {active === "Dashboard" ? "Website dashboard" : active}
              </h1>
              <span className="flex items-center gap-1 text-[10px] text-[#587065]">
                <Check size={13} />
                {saved ? "All changes saved" : "Unsaved changes"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              className="hidden items-center gap-2 rounded border border-[#234c64] px-4 py-3 text-xs font-bold sm:flex"
            >
              <Eye size={16} />
              View website
            </a>
            <button
              onClick={publish}
              disabled={publishing || saved || contentLoading}
              className="flex items-center gap-2 rounded bg-[#d95c3c] px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
              {publishing ? "Publishing…" : "Publish"}
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className={`mx-5 mt-5 rounded border p-3 text-sm lg:mx-8 ${notice.includes("successfully") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}
          >
            {notice}
          </div>
        )}

        {active === "Dashboard" && (
          <main className="mx-auto max-w-6xl p-5 lg:p-8">
            <div className="rounded-xl bg-[#123d55] p-7 text-white">
              <small className="uppercase tracking-[.2em] text-white/55">
                Supabase CMS
              </small>
              <h2 className="mt-2 font-serif text-4xl font-semibold">
                Your website content, in one place.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Choose a live website section from the menu, edit its content,
                then publish. Contact enquiries appear in Messages.
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <article className="rounded-lg border bg-white p-5">
                <FileText className="text-[#c94d35]" />
                <b className="mt-4 block text-2xl">{sections.length}</b>
                <span className="text-xs text-[#71818a]">
                  Editable sections
                </span>
              </article>
              <article className="rounded-lg border bg-white p-5">
                <MessageSquareQuote className="text-[#c94d35]" />
                <b className="mt-4 block text-2xl">
                  {content.testimonials.items.length}
                </b>
                <span className="text-xs text-[#71818a]">Testimonials</span>
              </article>
              <article className="rounded-lg border bg-white p-5">
                <Mail className="text-[#c94d35]" />
                <b className="mt-4 block text-2xl">{enquiries.length}</b>
                <span className="text-xs text-[#71818a]">Enquiries</span>
              </article>
            </div>
            {!isSupabaseConfigured && (
              <div className="mt-6 rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <b>Supabase is not connected.</b> Add the values from{" "}
                <code>.env.example</code> to <code>.env.local</code>. The editor
                is currently in local preview mode.
              </div>
            )}
          </main>
        )}

        {active === "Messages" && (
          <main className="mx-auto max-w-5xl p-5 lg:p-8">
            {contentLoading ? (
              <div className="rounded-lg border bg-white p-14 text-center text-sm text-[#71818a]">
                Loading enquiries…
              </div>
            ) : enquiries.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-white p-14 text-center">
                <Mail className="mx-auto mb-4 text-[#78909b]" size={34} />
                <h2 className="font-semibold">No enquiries yet</h2>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border bg-white p-5"
                  >
                    <div className="flex flex-wrap justify-between gap-3 border-b pb-4">
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm font-semibold text-[#c94d35]">
                          {item.subject}
                        </p>
                        <small>
                          {item.email} · {item.phone} · {item.location}
                        </small>
                      </div>
                      <div className="text-right">
                        <span
                          className={`mb-1 block text-[10px] font-bold uppercase tracking-wider ${item.status === "New" ? "text-[#c94d35]" : "text-[#71818a]"}`}
                        >
                          {item.status || "New"}
                        </span>
                        <time className="text-xs text-[#71818a]">
                          {new Date(item.created_at).toLocaleString()}
                        </time>
                      </div>
                    </div>
                    <p className="py-5 text-sm leading-7">{item.message}</p>
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${item.email}`}
                        onClick={() =>
                          void updateEnquiryStatus(item.id, "Replied")
                        }
                        className="rounded bg-[#164a65] px-4 py-2 text-xs font-bold text-white"
                      >
                        Reply
                      </a>
                      {item.status === "New" && (
                        <button
                          onClick={() =>
                            void updateEnquiryStatus(item.id, "Read")
                          }
                          className="rounded border border-[#9aabb4] px-4 py-2 text-xs font-bold text-[#164a65]"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => removeEnquiry(item.id)}
                        className="flex items-center gap-2 rounded border border-[#df7c66] px-4 py-2 text-xs font-bold text-[#c94d35]"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        )}

        {sections.includes(active as Section) && (
          <main className="mx-auto grid max-w-7xl gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
            <section className="rounded-lg border border-[#dbe1e4] bg-white p-5 lg:p-7">
              {contentLoading ? (
                <p className="py-14 text-center text-sm text-[#71818a]">
                  Loading website content…
                </p>
              ) : (
                <Editor
                  active={active as Section}
                  content={content}
                  change={change}
                  setContent={(next) => {
                    setContent(next);
                    setSaved(false);
                  }}
                />
              )}
            </section>
            <aside className="self-start rounded-lg border border-[#dbe1e4] bg-white p-5">
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <h2 className="font-bold">Live section preview</h2>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#71818a]">
                Your current edits are shown in the fields. Publish to make them
                visible on the public website.
              </p>
              <div className="mt-5 rounded bg-[#f7f2ea] p-6">
                <small className="font-bold uppercase tracking-[.18em] text-[#c94d35]">
                  {active}
                </small>
                <h3 className="mt-3 font-serif text-2xl font-semibold">
                  {previewTitle(active as Section, content)}
                </h3>
                <p className="mt-3 text-xs leading-5 text-[#61727c]">
                  {previewBody(active as Section, content)}
                </p>
              </div>
              <button
                onClick={publish}
                disabled={publishing || saved || contentLoading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#d95c3c] px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {publishing ? "Publishing…" : "Publish changes"}
              </button>
            </aside>
          </main>
        )}
      </div>
    </div>
  );
}

function Editor({
  active,
  content,
  change,
  setContent,
}: {
  active: Section;
  content: SiteContent;
  change: <K extends keyof SiteContent>(
    section: K,
    values: Partial<SiteContent[K]>,
  ) => void;
  setContent: (content: SiteContent) => void;
}) {
  if (active === "Hero")
    return (
      <FormTitle
        title="Hero section"
        description="The first section visitors see."
      >
        <Field
          label="Eyebrow"
          value={content.hero.eyebrow}
          onChange={(eyebrow) => change("hero", { eyebrow })}
        />
        <Field
          label="Heading"
          value={content.hero.title}
          onChange={(title) => change("hero", { title })}
        />
        <Field
          label="Introduction"
          area
          rows={5}
          value={content.hero.body}
          onChange={(body) => change("hero", { body })}
        />
        <Field
          label="Hero image path or URL"
          value={content.hero.imageUrl}
          onChange={(imageUrl) => change("hero", { imageUrl })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Primary button"
            value={content.hero.primaryButton}
            onChange={(primaryButton) => change("hero", { primaryButton })}
          />
          <Field
            label="Secondary button"
            value={content.hero.secondaryButton}
            onChange={(secondaryButton) => change("hero", { secondaryButton })}
          />
        </div>
      </FormTitle>
    );
  if (active === "Trust bar")
    return (
      <FormTitle
        title="Trust bar"
        description="The three reassurance points directly below the hero."
      >
        {content.trust.map((item, index) => (
          <div
            key={index}
            className="grid gap-4 rounded border p-4 sm:grid-cols-2"
          >
            <Field
              label={`Item ${index + 1} title`}
              value={item.title}
              onChange={(title) => {
                const trust = [...content.trust];
                trust[index] = { ...item, title };
                setContent({ ...content, trust });
              }}
            />
            <Field
              label="Supporting text"
              value={item.subtitle}
              onChange={(subtitle) => {
                const trust = [...content.trust];
                trust[index] = { ...item, subtitle };
                setContent({ ...content, trust });
              }}
            />
          </div>
        ))}
      </FormTitle>
    );
  if (active === "About")
    return (
      <FormTitle
        title="About section"
        description="Your introduction and advisory philosophy."
      >
        <Field
          label="Eyebrow"
          value={content.about.eyebrow}
          onChange={(eyebrow) => change("about", { eyebrow })}
        />
        <Field
          label="Heading (use a new line for a line break)"
          area
          rows={2}
          value={content.about.title}
          onChange={(title) => change("about", { title })}
        />
        {content.about.paragraphs.map((paragraph, index) => (
          <Field
            key={index}
            label={`Paragraph ${index + 1}`}
            area
            rows={4}
            value={paragraph}
            onChange={(value) => {
              const paragraphs = [...content.about.paragraphs];
              paragraphs[index] = value;
              change("about", { paragraphs });
            }}
          />
        ))}
      </FormTitle>
    );
  if (active === "Services")
    return (
      <FormTitle
        title="Services section"
        description="These cards match the services displayed on the website."
      >
        <Field
          label="Eyebrow"
          value={content.services.eyebrow}
          onChange={(eyebrow) => change("services", { eyebrow })}
        />
        <Field
          label="Heading"
          area
          rows={2}
          value={content.services.title}
          onChange={(title) => change("services", { title })}
        />
        <Field
          label="Section introduction"
          area
          value={content.services.intro}
          onChange={(intro) => change("services", { intro })}
        />
        {content.services.items.map((item, index) => (
          <Repeater
            key={index}
            title={`Service ${index + 1}`}
            remove={() =>
              change("services", {
                items: content.services.items.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          >
            <Field
              label="Title"
              value={item.title}
              onChange={(title) => {
                const items = [...content.services.items];
                items[index] = { ...item, title };
                change("services", { items });
              }}
            />
            <Field
              label="Description"
              area
              rows={4}
              value={item.text}
              onChange={(text) => {
                const items = [...content.services.items];
                items[index] = { ...item, text };
                change("services", { items });
              }}
            />
          </Repeater>
        ))}
        <AddButton
          label="Add service"
          onClick={() =>
            change("services", {
              items: [
                ...content.services.items,
                { title: "New service", text: "Describe this service." },
              ],
            })
          }
        />
      </FormTitle>
    );
  if (active === "Testimonials")
    return (
      <FormTitle
        title="Testimonials section"
        description="Client stories shown in the testimonial slider."
      >
        <Field
          label="Eyebrow"
          value={content.testimonials.eyebrow}
          onChange={(eyebrow) => change("testimonials", { eyebrow })}
        />
        <Field
          label="Heading"
          area
          rows={2}
          value={content.testimonials.title}
          onChange={(title) => change("testimonials", { title })}
        />
        {content.testimonials.items.map((item, index) => (
          <Repeater
            key={index}
            title={`Testimonial ${index + 1}`}
            remove={() =>
              change("testimonials", {
                items: content.testimonials.items.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          >
            <Field
              label="Quote"
              area
              rows={4}
              value={item.quote}
              onChange={(quote) => {
                const items = [...content.testimonials.items];
                items[index] = { ...item, quote };
                change("testimonials", { items });
              }}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Client name"
                value={item.name}
                onChange={(name) => {
                  const items = [...content.testimonials.items];
                  items[index] = { ...item, name };
                  change("testimonials", { items });
                }}
              />
              <Field
                label="Client role"
                value={item.role}
                onChange={(role) => {
                  const items = [...content.testimonials.items];
                  items[index] = { ...item, role };
                  change("testimonials", { items });
                }}
              />
            </div>
          </Repeater>
        ))}
        <AddButton
          label="Add testimonial"
          onClick={() =>
            change("testimonials", {
              items: [
                ...content.testimonials.items,
                {
                  quote: "Add the client quote.",
                  name: "Client name",
                  role: "Client role",
                },
              ],
            })
          }
        />
      </FormTitle>
    );
  if (active === "CTA")
    return (
      <FormTitle
        title="Call to action"
        description="The dark-blue banner above the contact form."
      >
        <Field
          label="Eyebrow"
          value={content.cta.eyebrow}
          onChange={(eyebrow) => change("cta", { eyebrow })}
        />
        <Field
          label="Heading"
          value={content.cta.title}
          onChange={(title) => change("cta", { title })}
        />
        <Field
          label="Supporting text"
          area
          value={content.cta.body}
          onChange={(body) => change("cta", { body })}
        />
        <Field
          label="Button label"
          value={content.cta.button}
          onChange={(button) => change("cta", { button })}
        />
      </FormTitle>
    );
  if (active === "Contact")
    return (
      <FormTitle
        title="Contact section"
        description="Contact details and introduction beside the enquiry form."
      >
        <Field
          label="Eyebrow"
          value={content.contact.eyebrow}
          onChange={(eyebrow) => change("contact", { eyebrow })}
        />
        <Field
          label="Heading"
          area
          rows={2}
          value={content.contact.title}
          onChange={(title) => change("contact", { title })}
        />
        <Field
          label="Introduction"
          area
          rows={4}
          value={content.contact.body}
          onChange={(body) => change("contact", { body })}
        />
        <div>
          <Field
            label="Email address"
            value={content.contact.email}
            onChange={(email) => change("contact", { email })}
          />
        </div>
      </FormTitle>
    );
  return (
    <FormTitle
      title="Footer"
      description="Business details and the legal notice at the bottom of the website."
    >
      <Field
        label="Tagline"
        area
        rows={2}
        value={content.footer.tagline}
        onChange={(tagline) => change("footer", { tagline })}
      />
      <Field
        label="Business name"
        value={content.footer.businessName}
        onChange={(businessName) => change("footer", { businessName })}
      />
      <Field
        label="Business details"
        area
        rows={2}
        value={content.footer.businessDetails}
        onChange={(businessDetails) => change("footer", { businessDetails })}
      />
      <Field
        label="Legal notice"
        area
        rows={4}
        value={content.footer.legal}
        onChange={(legal) => change("footer", { legal })}
      />
    </FormTitle>
  );
}

const FormTitle = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div>
    <small className="font-bold uppercase tracking-[.18em] text-[#d95c3c]">
      Page content
    </small>
    <h2 className="mt-1 text-2xl font-bold">{title}</h2>
    <p className="mb-6 mt-2 text-sm text-[#647681]">{description}</p>
    <div className="space-y-5">{children}</div>
  </div>
);
const Repeater = ({
  title,
  remove,
  children,
}: {
  title: string;
  remove: () => void;
  children: React.ReactNode;
}) => (
  <article className="rounded-lg border border-[#e0e5e7] p-4">
    <div className="mb-4 flex items-center justify-between">
      <b className="text-sm">{title}</b>
      <button
        onClick={remove}
        className="text-[#c94d35]"
        aria-label={`Remove ${title}`}
      >
        <Trash2 size={17} />
      </button>
    </div>
    <div className="space-y-4">{children}</div>
  </article>
);
const AddButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 rounded bg-[#164a65] px-4 py-3 text-xs font-bold text-white"
  >
    <Plus size={17} />
    {label}
  </button>
);
const previewTitle = (section: Section, content: SiteContent) =>
  section === "Hero"
    ? content.hero.title
    : section === "About"
      ? content.about.title
      : section === "Services"
        ? content.services.title
        : section === "Testimonials"
          ? content.testimonials.title
          : section === "CTA"
            ? content.cta.title
            : section === "Contact"
              ? content.contact.title
              : section === "Footer"
                ? content.footer.businessName
                : content.trust[0]?.title || "";
const previewBody = (section: Section, content: SiteContent) =>
  section === "Hero"
    ? content.hero.body
    : section === "About"
      ? content.about.paragraphs[0]
      : section === "Services"
        ? `${content.services.items.length} service cards`
        : section === "Testimonials"
          ? `${content.testimonials.items.length} client testimonials`
          : section === "CTA"
            ? content.cta.body
            : section === "Contact"
              ? content.contact.email
              : section === "Footer"
                ? content.footer.tagline
                : content.trust.map((item) => item.title).join(" · ");
