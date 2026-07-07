import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Pencil, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  adminArticlesQuery,
  categoriesQuery,
  formatDate,
  type Article,
} from "@/lib/articles";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { useI18n } from "@/lib/i18n";

export function ArticlesAdmin() {
  const { lang } = useI18n();
  const { data: articles = [], isLoading } = useQuery(adminArticlesQuery());
  const { data: categories = [] } = useQuery(categoriesQuery());

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "scheduled">("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (catFilter !== "all" && a.category_slug !== catFilter) return false;
      if (q.trim()) {
        const s = q.trim().toLowerCase();
        if (!a.title.toLowerCase().includes(s) && !a.slug.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [articles, statusFilter, catFilter, q]);

  const statusLabel = (s: Article["status"]) =>
    s === "published" ? "Publikuar" : s === "scheduled" ? "Planifikuar" : "Draft";

  const statusColor = (s: Article["status"]) =>
    s === "published"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : s === "scheduled"
        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
        : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Lajmet & Njoftimet</h2>
          <p className="text-sm text-muted-foreground">Menaxho artikujt e publikuar në faqe.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-soft"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Plus className="h-4 w-4" /> Artikull i ri
        </button>
      </div>

      <div className="rounded-xl border border-border/60 bg-background/60 p-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kërko sipas titullit ose slug…"
            className="w-full rounded-full border border-border bg-background pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-full border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Të gjitha statuset</option>
          <option value="draft">Draft</option>
          <option value="published">Publikuar</option>
          <option value="scheduled">Planifikuar</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-full border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Të gjitha kategoritë</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name_al}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-border/60 bg-background/60 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_100px_100px] gap-3 border-b border-border/60 bg-muted/40 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <div>Titulli</div>
          <div>Kategoria</div>
          <div>Statusi</div>
          <div>Data</div>
          <div className="text-right">Veprime</div>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Duke ngarkuar…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">S'ka artikuj.</div>
        ) : (
          filtered.map((a) => {
            const cat = categories.find((c) => c.slug === a.category_slug);
            return (
              <div
                key={a.id}
                className="grid grid-cols-[1fr_120px_120px_100px_100px] gap-3 items-center border-b border-border/40 px-4 py-3 text-sm hover:bg-muted/30"
              >
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">/lajme/{a.slug}</div>
                </div>
                <div className="text-xs text-muted-foreground truncate">{cat?.name_al ?? a.category_slug}</div>
                <div>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(a.status)}`}>
                    {statusLabel(a.status)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(a.published_at ?? a.updated_at, lang)}
                </div>
                <div className="flex justify-end gap-1">
                  {a.status === "published" && (
                    <Link
                      to="/lajme/$slug"
                      params={{ slug: a.slug }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-muted"
                      title="Shiko"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <button
                    onClick={() => setEditing(a)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-muted"
                    title="Ndrysho"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {(editing || creating) && (
        <ArticleEditor
          article={editing}
          categories={categories}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}
