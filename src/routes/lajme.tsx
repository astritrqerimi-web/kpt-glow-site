import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search, Newspaper, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { articlesListQuery, categoriesQuery, categoryName } from "@/lib/articles";
import { ArticleCard } from "@/components/site/ArticleCard";
import { useI18n } from "@/lib/i18n";

const PAGE_SIZE = 12;

const searchSchema = z.object({
  cat: fallback(z.string(), "all").default("all"),
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(["newest", "oldest"]), "newest").default("newest"),
  page: fallback(z.number().int().min(1), 1).default(1),
});

export const Route = createFileRoute("/lajme")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Lajme & Njoftime — KPT Consulting" },
      {
        name: "description",
        content:
          "Lajmet dhe njoftimet më të fundit nga KPT Consulting — përditësime tatimore, ligjore, ATK, TVSH, subvencione dhe zhvillime profesionale për biznese në Kosovë.",
      },
      { property: "og:title", content: "Lajme & Njoftime — KPT Consulting" },
      {
        property: "og:description",
        content:
          "Përditësime ligjore dhe tatimore për biznese — ATK, TVSH, subvencione, ligje dhe njoftime.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/lajme" }],
  }),
  component: LajmePage,
});

function LajmePage() {
  const { t, lang } = useI18n();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/lajme" });
  const [qInput, setQInput] = useState(search.q);

  useEffect(() => {
    setQInput(search.q);
  }, [search.q]);

  const { data: categories = [] } = useQuery(categoriesQuery());
  const { data, isLoading } = useQuery(
    articlesListQuery({
      category: search.cat,
      q: search.q,
      sort: search.sort,
      page: search.page,
      pageSize: PAGE_SIZE,
    }),
  );

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));
  const items = data?.items ?? [];

  const setParam = (updates: Partial<z.infer<typeof searchSchema>>) => {
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, ...updates, page: updates.page ?? 1 }),
    });
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam({ q: qInput });
  };

  return (
    <>
      {/* Header */}
      <section className="container-page pt-16 md:pt-24 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs uppercase tracking-[0.18em] text-primary font-medium">
            {t("news.eyebrow")}
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            {t("news.pageTitle")}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {t("news.pageSubtitle")}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container-page">
        <div className="rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl p-4 md:p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <FilterPill
                active={search.cat === "all"}
                onClick={() => setParam({ cat: "all" })}
              >
                {t("news.filter.all")}
              </FilterPill>
              {categories.map((c) => (
                <FilterPill
                  key={c.slug}
                  active={search.cat === c.slug}
                  onClick={() => setParam({ cat: c.slug })}
                >
                  {categoryName(c, lang)}
                </FilterPill>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="sort" className="text-xs text-muted-foreground">
                {t("news.sort")}
              </label>
              <select
                id="sort"
                value={search.sort}
                onChange={(e) =>
                  setParam({ sort: e.target.value as "newest" | "oldest" })
                }
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
              >
                <option value="newest">{t("news.sort.newest")}</option>
                <option value="oldest">{t("news.sort.oldest")}</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={submitSearch} className="mt-4 relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder={t("news.searchPlaceholder")}
              className="w-full rounded-full border border-border bg-background pl-11 pr-32 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-soft"
              style={{ background: "var(--gradient-brand)" }}
            >
              {t("news.searchBtn")}
            </button>
          </form>
        </div>
      </section>

      {/* Grid */}
      <section className="container-page py-12 md:py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md text-center py-20">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Newspaper className="h-7 w-7" />
            </div>
            <p className="mt-6 text-lg font-medium text-foreground">
              {t("news.empty.title")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("news.empty.desc")}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <ArticleCard key={a.id} article={a} categories={categories} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  disabled={search.page <= 1}
                  onClick={() => setParam({ page: search.page - 1 })}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-4 py-2 text-sm disabled:opacity-40 hover:bg-muted transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("news.prev")}
                </button>
                <span className="text-sm text-muted-foreground px-3">
                  {search.page} / {totalPages}
                </span>
                <button
                  disabled={search.page >= totalPages}
                  onClick={() => setParam({ page: search.page + 1 })}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-4 py-2 text-sm disabled:opacity-40 hover:bg-muted transition"
                >
                  {t("news.next")}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
        active
          ? "text-white shadow-soft"
          : "border border-border bg-background/70 text-foreground/80 hover:bg-muted"
      }`}
      style={active ? { background: "var(--gradient-brand)" } : undefined}
    >
      {children}
    </button>
  );
}

// (Link import kept for potential future use in empty state CTA)
void Link;
