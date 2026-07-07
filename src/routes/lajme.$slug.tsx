import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User as UserIcon,
  Clock,
  Facebook,
  Linkedin,
  Mail,
  FileText,
  Download,
} from "lucide-react";
import {
  articleBySlugQuery,
  categoriesQuery,
  relatedArticlesQuery,
  prevNextArticleQuery,
  categoryName,
  formatDate,
  articleTitle,
  articleExcerpt,
  articleContent,
  articleUrlSlug,
} from "@/lib/articles";
import { ArticleCard } from "@/components/site/ArticleCard";
import { sanitizeHtml } from "@/lib/sanitize";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/lajme/$slug")({
  loader: async ({ params, context }) => {
    const article = await context.queryClient.ensureQueryData(
      articleBySlugQuery(params.slug),
    );
    if (!article || article.status !== "published") throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Artikulli nuk u gjet — KPT Consulting" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const a = loaderData.article;
    const title = a.seo_title || a.title;
    const desc =
      a.seo_description ||
      a.excerpt ||
      `${a.title} — KPT Consulting`;
    const image = a.og_image_url || a.cover_image_url || undefined;
    const meta: Array<Record<string, string>> = [
      { title: `${title} — KPT Consulting` },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/lajme/${a.slug}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }
    if (a.published_at) {
      meta.push({ property: "article:published_time", content: a.published_at });
    }
    meta.push({ property: "article:author", content: a.author });
    meta.push({ property: "article:section", content: a.category_slug });

    return {
      meta,
      links: [{ rel: "canonical", href: `/lajme/${a.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: desc,
            image: image ? [image] : undefined,
            datePublished: a.published_at,
            dateModified: a.updated_at,
            author: { "@type": "Organization", name: a.author },
            publisher: {
              "@type": "Organization",
              name: "KPT Consulting",
            },
          }),
        },
      ],
    };
  },
  component: ArticleDetailPage,
  notFoundComponent: ArticleNotFound,
});

function ArticleDetailPage() {
  const { t, lang } = useI18n();
  const { article } = Route.useLoaderData();
  const { data: categories = [] } = useQuery(categoriesQuery());
  const { data: related = [] } = useQuery(
    relatedArticlesQuery(article.category_slug, article.id, 3),
  );
  const { data: prevNext } = useQuery(
    prevNextArticleQuery(article.published_at ?? article.created_at, article.id),
  );

  const cat = categories.find((c) => c.slug === article.category_slug);
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://kpt-glow-site.lovable.app/lajme/${articleUrlSlug(article)}`;

  const title = articleTitle(article, lang);
  const safeHtml = sanitizeHtml(articleContent(article, lang));

  return (
    <article className="pt-10 md:pt-16 pb-20">
      {/* Back link */}
      <div className="container-page">
        <Link
          to="/lajme"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("news.backToAll")}
        </Link>
      </div>

      {/* Header */}
      <header className="container-page mt-6 max-w-3xl mx-auto text-center">
        {cat && (
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-soft"
            style={{ background: "var(--gradient-brand)" }}
          >
            {categoryName(cat, lang)}
          </span>
        )}
        <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight">
          {title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.published_at, lang)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserIcon className="h-3.5 w-3.5" />
            {article.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {article.reading_minutes} {t("news.minRead")}
          </span>
        </div>
      </header>

      {/* Cover */}
      {article.cover_image_url && (
        <div className="container-page mt-10">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/60 shadow-elegant">
            <img
              src={article.cover_image_url}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-page mt-12">
        <div
          className="mx-auto max-w-3xl article-prose"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>

      {/* Gallery */}
      {article.gallery && article.gallery.length > 0 && (
        <div className="container-page mt-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t("news.gallery")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {article.gallery.map((g: { url: string; caption?: string }, i: number) => (
                <a
                  key={i}
                  href={g.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-xl border border-border/60"
                >
                  <img
                    src={g.url}
                    alt={g.caption || `${article.title} ${i + 1}`}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {g.caption && (
                    <div className="p-2 text-xs text-muted-foreground">{g.caption}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attachments */}
      {article.attachments && article.attachments.length > 0 && (
        <div className="container-page mt-12">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl p-5">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              {t("news.attachments")}
            </h2>
            <ul className="space-y-2">
              {article.attachments.map((f: { url: string; name: string }, i: number) => (
                <li key={i}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm hover:border-primary/40 transition group"
                  >
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Share */}
      <div className="container-page mt-12">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
          <span className="text-sm font-medium text-foreground">{t("news.share")}</span>
          <a
            aria-label="Facebook"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            aria-label="LinkedIn"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            aria-label="Email"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition"
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`}
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Prev / Next */}
      {(prevNext?.prev || prevNext?.next) && (
        <nav className="container-page mt-10">
          <div className="mx-auto max-w-3xl grid gap-3 sm:grid-cols-2">
            {prevNext?.prev ? (
              <Link
                to="/lajme/$slug"
                params={{ slug: articleUrlSlug(prevNext.prev) }}
                className="group rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl p-5 hover:border-primary/40 transition"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3 w-3" /> {t("news.previous")}
                </div>
                <div className="mt-2 font-medium text-foreground line-clamp-2 group-hover:text-primary">
                  {articleTitle(prevNext.prev, lang)}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {prevNext?.next ? (
              <Link
                to="/lajme/$slug"
                params={{ slug: articleUrlSlug(prevNext.next) }}
                className="group rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl p-5 hover:border-primary/40 transition text-right"
              >
                <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                  {t("news.next")} <ArrowRight className="h-3 w-3" />
                </div>
                <div className="mt-2 font-medium text-foreground line-clamp-2 group-hover:text-primary">
                  {articleTitle(prevNext.next, lang)}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="container-page mt-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            {t("news.related")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} categories={categories} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function ArticleNotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl font-semibold text-foreground">Artikulli nuk u gjet</h1>
      <p className="mt-3 text-muted-foreground">
        Artikulli që kërkuat mund të jetë hequr ose s'ekziston.
      </p>
      <Link
        to="/lajme"
        className="mt-6 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm text-white"
        style={{ background: "var(--gradient-brand)" }}
      >
        <ArrowLeft className="h-4 w-4" /> Kthehu te Lajmet
      </Link>
    </div>
  );
}
