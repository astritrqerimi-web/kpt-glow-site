import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import slugify from "slugify";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Save,
  Trash2,
  X,
  Loader2,
  Upload,
  FileText,
  Star,
  Pin,
  Eye,
  EyeOff,
  CalendarClock,
} from "lucide-react";
import type { Article, ArticleCategory, Attachment, GalleryImage } from "@/lib/articles";
import { adminArticlesQuery } from "@/lib/articles";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface Props {
  article: Article | null;
  categories: ArticleCategory[];
  onClose: () => void;
}

type Draft = {
  id?: string;
  slug: string;
  category_slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  content_html: string;
  content_html_en: string;
  cover_image_url: string;
  og_image_url: string;
  gallery: GalleryImage[];
  attachments: Attachment[];
  tags: string[];
  author: string;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  scheduled_at: string | null;
  is_featured: boolean;
  is_sticky: boolean;
  seo_title: string;
  seo_title_en: string;
  seo_description: string;
  seo_description_en: string;
  comments_enabled: boolean;
};

function toDraft(a: Article | null, defaultCategory: string): Draft {
  return {
    id: a?.id,
    slug: a?.slug ?? "",
    category_slug: a?.category_slug ?? defaultCategory,
    title: a?.title ?? "",
    title_en: a?.title_en ?? "",
    excerpt: a?.excerpt ?? "",
    excerpt_en: a?.excerpt_en ?? "",
    content_html: a?.content_html ?? "",
    content_html_en: a?.content_html_en ?? "",
    cover_image_url: a?.cover_image_url ?? "",
    og_image_url: a?.og_image_url ?? "",
    gallery: a?.gallery ?? [],
    attachments: a?.attachments ?? [],
    tags: a?.tags ?? [],
    author: a?.author ?? "KPT Consulting",
    status: a?.status ?? "draft",
    published_at: a?.published_at ?? null,
    scheduled_at: a?.scheduled_at ?? null,
    is_featured: a?.is_featured ?? false,
    is_sticky: a?.is_sticky ?? false,
    seo_title: a?.seo_title ?? "",
    seo_title_en: a?.seo_title_en ?? "",
    seo_description: a?.seo_description ?? "",
    seo_description_en: a?.seo_description_en ?? "",
    comments_enabled: a?.comments_enabled ?? false,
  };
}

function makeSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, locale: "sq" });
}

function toIsoLocal(dt: string | null): string {
  if (!dt) return "";
  const d = new Date(dt);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ArticleEditor({ article, categories, onClose }: Props) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>(() =>
    toDraft(article, categories[0]?.slug ?? "njoftime"),
  );
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [slugDirty, setSlugDirty] = useState(!!article);
  const pdfRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!slugDirty) {
      setDraft((d) => ({ ...d, slug: makeSlug(d.title) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.title]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (!draft.tags.includes(v)) set("tags", [...draft.tags, v]);
    setTagInput("");
  };

  const removeTag = (t: string) => set("tags", draft.tags.filter((x) => x !== t));

  const uploadGalleryFiles = async (files: FileList) => {
    const added: GalleryImage[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: më i madh se 5 MB`);
        continue;
      }
      const ext = file.name.split(".").pop() || "jpg";
      const path = `articles/${draft.id ?? "drafts"}/gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("site-images").upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
      });
      if (error) {
        toast.error(error.message);
        continue;
      }
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      added.push({ url: data.publicUrl, caption: "" });
    }
    if (added.length) set("gallery", [...draft.gallery, ...added]);
  };

  const uploadPdfs = async (files: FileList) => {
    const added: Attachment[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name}: më i madh se 20 MB`);
        continue;
      }
      const path = `articles/${draft.id ?? "drafts"}/attachments/${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
      const { error } = await supabase.storage.from("site-images").upload(path, file, {
        cacheControl: "3600",
        contentType: file.type || "application/pdf",
      });
      if (error) {
        toast.error(error.message);
        continue;
      }
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      added.push({ url: data.publicUrl, name: file.name, size: file.size });
    }
    if (added.length) set("attachments", [...draft.attachments, ...added]);
  };

  const save = async (statusOverride?: Draft["status"]) => {
    if (!draft.title.trim()) {
      toast.error("Titulli është i detyrueshëm");
      return;
    }
    setSaving(true);
    try {
      const status = statusOverride ?? draft.status;
      const table = (supabase as any).from("articles");
      const baseSlug = makeSlug(draft.slug || draft.title);
      if (!baseSlug) {
        toast.error("Slug nuk mund të gjenerohet pa titull");
        setSaving(false);
        return;
      }

      let uniqueSlug = baseSlug;
      for (let suffix = 2; suffix < 100; suffix += 1) {
        const { data: existing, error: slugError } = await table
          .select("id")
          .eq("slug", uniqueSlug)
          .limit(1);
        if (slugError) throw slugError;
        const ownerId = existing?.[0]?.id as string | undefined;
        if (!ownerId || ownerId === draft.id) break;
        uniqueSlug = `${baseSlug}-${suffix}`;
      }

      const payload: Record<string, unknown> = {
        slug: uniqueSlug,
        category_slug: draft.category_slug,
        title: draft.title,
        title_en: draft.title_en || null,
        excerpt: draft.excerpt,
        excerpt_en: draft.excerpt_en || null,
        content_html: draft.content_html,
        content_html_en: draft.content_html_en || null,
        cover_image_url: draft.cover_image_url || null,
        og_image_url: draft.og_image_url || null,
        gallery: draft.gallery,
        attachments: draft.attachments,
        tags: draft.tags,
        author: draft.author,
        status,
        is_featured: draft.is_featured,
        is_sticky: draft.is_sticky,
        seo_title: draft.seo_title || null,
        seo_title_en: draft.seo_title_en || null,
        seo_description: draft.seo_description || null,
        seo_description_en: draft.seo_description_en || null,
        comments_enabled: draft.comments_enabled,
      };

      if (status === "published") {
        payload.published_at = draft.published_at ?? new Date().toISOString();
        payload.scheduled_at = null;
      } else if (status === "scheduled") {
        if (!draft.scheduled_at) {
          toast.error("Zgjidhni datën për publikim të planifikuar");
          setSaving(false);
          return;
        }
        payload.scheduled_at = draft.scheduled_at;
        payload.published_at = null;
      } else {
        // draft
        payload.published_at = null;
      }

      if (draft.id) {
        const { error } = await table.update(payload).eq("id", draft.id);
        if (error) throw error;
        toast.success("Artikulli u ruajt");
      } else {
        const { data: userRes } = await supabase.auth.getUser();
        payload.created_by = userRes.user?.id ?? null;
        const { data, error } = await table.insert(payload).select("id").single();
        if (error) throw error;
        setDraft((d) => ({ ...d, id: data.id, status }));
        toast.success("Artikulli u krijua");
      }
      qc.invalidateQueries({ queryKey: ["articles"] });
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Ruajtja dështoi";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!draft.id) return;
    if (!window.confirm("Fshi këtë artikull? Ky veprim nuk kthehet.")) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("articles").delete().eq("id", draft.id);
    if (error) return toast.error(error.message);
    toast.success("Artikulli u fshi");
    qc.invalidateQueries({ queryKey: ["articles"] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-xl">
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
            <div>
              <div className="text-sm font-semibold">{draft.id ? "Ndrysho artikullin" : "Artikull i ri"}</div>
              <div className="text-[11px] text-muted-foreground">Statusi: {draft.status}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {draft.id && (
              <button
                onClick={del}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Fshi
              </button>
            )}
            <button
              onClick={() => save("draft")}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Ruaj draft
            </button>
            {draft.status === "published" ? (
              <button
                onClick={() => save("draft")}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
              >
                <EyeOff className="h-3.5 w-3.5" /> Anulo publikimin
              </button>
            ) : (
              <button
                onClick={() => save("published")}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-soft"
                style={{ background: "var(--gradient-brand)" }}
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                Publiko
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-page py-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main */}
        <div className="space-y-5">
          <Field label="Titulli">
            <input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="p.sh. Ndryshimet e reja në deklarimin e TVSH-së"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>

          <Field label="Slug (URL)">
            <input
              value={draft.slug}
              onChange={(e) => {
                setSlugDirty(true);
                set("slug", makeSlug(e.target.value));
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono"
            />
            <div className="mt-1 text-[11px] text-muted-foreground">/lajme/{draft.slug || "…"}</div>
          </Field>

          <Field label="Përshkrim i shkurtër (excerpt)">
            <textarea
              value={draft.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              placeholder="Përmbledhje 1–2 fjali që shfaqet në kartë e lajmit."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none"
            />
          </Field>

          <Field label="Përmbajtja">
            <RichTextEditor
              value={draft.content_html}
              onChange={(html) => set("content_html", html)}
              articleId={draft.id}
              placeholder="Fillo të shkruash artikullin..."
            />
          </Field>

          {/* Gallery */}
          <div className="rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Galeria</div>
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
              >
                <Upload className="h-3 w-3" /> Shto imazhe
              </button>
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) uploadGalleryFiles(e.target.files);
                  if (galleryRef.current) galleryRef.current.value = "";
                }}
              />
            </div>
            {draft.gallery.length === 0 ? (
              <div className="text-xs text-muted-foreground">S'ka imazhe në galeri.</div>
            ) : (
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                {draft.gallery.map((g, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border border-border">
                    <img src={g.url} alt="" className="w-full aspect-square object-cover" />
                    <input
                      value={g.caption ?? ""}
                      onChange={(e) => {
                        const next = [...draft.gallery];
                        next[i] = { ...next[i], caption: e.target.value };
                        set("gallery", next);
                      }}
                      placeholder="Titull opsional"
                      className="w-full border-t border-border bg-background px-2 py-1 text-[11px]"
                    />
                    <button
                      onClick={() => set("gallery", draft.gallery.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 rounded-full bg-background/90 p-1 border border-border hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">PDF & Dokumente</div>
              <button
                type="button"
                onClick={() => pdfRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
              >
                <Upload className="h-3 w-3" /> Shto PDF
              </button>
              <input
                ref={pdfRef}
                type="file"
                accept="application/pdf,.pdf,.doc,.docx,.xls,.xlsx"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) uploadPdfs(e.target.files);
                  if (pdfRef.current) pdfRef.current.value = "";
                }}
              />
            </div>
            {draft.attachments.length === 0 ? (
              <div className="text-xs text-muted-foreground">S'ka dokumente të bashkangjitura.</div>
            ) : (
              <ul className="space-y-2">
                {draft.attachments.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="flex-1 truncate">{f.name}</span>
                    <button
                      onClick={() => set("attachments", draft.attachments.filter((_, j) => j !== i))}
                      className="rounded-full p-1 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-3">
            <div className="text-sm font-semibold">Publikimi</div>
            <select
              value={draft.status}
              onChange={(e) => set("status", e.target.value as Draft["status"])}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Publikuar</option>
              <option value="scheduled">Planifikuar</option>
            </select>
            {draft.status === "scheduled" && (
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  <CalendarClock className="inline h-3 w-3 mr-1" /> Data & ora
                </label>
                <input
                  type="datetime-local"
                  value={toIsoLocal(draft.scheduled_at)}
                  onChange={(e) =>
                    set("scheduled_at", e.target.value ? new Date(e.target.value).toISOString() : null)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
            {draft.status === "published" && (
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Data e publikimit</label>
                <input
                  type="datetime-local"
                  value={toIsoLocal(draft.published_at)}
                  onChange={(e) =>
                    set("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 pt-1">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.is_featured}
                  onChange={(e) => set("is_featured", e.target.checked)}
                />
                <Star className="h-3.5 w-3.5 text-primary" /> I zgjedhur (Featured)
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.is_sticky}
                  onChange={(e) => set("is_sticky", e.target.checked)}
                />
                <Pin className="h-3.5 w-3.5 text-primary" /> Në krye (Sticky)
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.comments_enabled}
                  onChange={(e) => set("comments_enabled", e.target.checked)}
                />
                Komentet të aktivizuara
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-3">
            <div className="text-sm font-semibold">Kategori & Autor</div>
            <select
              value={draft.category_slug}
              onChange={(e) => set("category_slug", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name_al}
                </option>
              ))}
            </select>
            <input
              value={draft.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="Autori"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {draft.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px]"
                  >
                    {t}
                    <button onClick={() => removeTag(t)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Shto tag dhe shtyp Enter"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-3">
            <div className="text-sm font-semibold">Imazhet</div>
            <ImageUpload
              label="Kopertina"
              value={draft.cover_image_url}
              onChange={(url) => set("cover_image_url", url)}
              folder={`articles/${draft.id ?? "drafts"}/cover`}
            />
            <ImageUpload
              label="Open Graph (opsional)"
              value={draft.og_image_url}
              onChange={(url) => set("og_image_url", url)}
              folder={`articles/${draft.id ?? "drafts"}/og`}
              hint="1200×630"
            />
          </div>

          <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-3">
            <div className="text-sm font-semibold">SEO</div>
            <input
              value={draft.seo_title}
              onChange={(e) => set("seo_title", e.target.value)}
              placeholder="Titulli SEO (opsional)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <textarea
              value={draft.seo_description}
              onChange={(e) => set("seo_description", e.target.value)}
              placeholder="Meta description (opsional)"
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-foreground/70">{label}</div>
      {children}
    </label>
  );
}

// Reference so the query import is kept for future use
void useQuery;
void adminArticlesQuery;
