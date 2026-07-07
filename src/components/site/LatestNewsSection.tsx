import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { latestArticlesQuery, categoriesQuery } from "@/lib/articles";
import { ArticleCard } from "@/components/site/ArticleCard";
import { useI18n } from "@/lib/i18n";
import { newsHomeQuery, pick } from "@/lib/site-content";

export function LatestNewsSection() {
  const { t, lang } = useI18n();
  const { data: articles = [] } = useQuery(latestArticlesQuery(4));
  const { data: categories = [] } = useQuery(categoriesQuery());
  const { data: nh } = useQuery(newsHomeQuery());

  const badge = pick(nh?.badge, lang, t("news.eyebrow"));
  const title = pick(nh?.title, lang, t("news.homeTitle"));
  const subtitle = pick(nh?.subtitle, lang, t("news.homeSubtitle"));
  const viewAll = pick(nh?.viewAll, lang, t("news.viewAll"));

  // Split the title so the trailing word carries the brand gradient — matches
  // the "Zgjidhje ... juaj" / "Le të bisedojmë" heading pattern used elsewhere.
  const trimmed = title.trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  const titleHead = lastSpace > 0 ? trimmed.slice(0, lastSpace) : "";
  const titleTail = lastSpace > 0 ? trimmed.slice(lastSpace + 1) : trimmed;

  return (
    <section id="lajme-home" className={`container-page pb-24 scroll-mt-28 md:scroll-mt-32`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">{badge}</div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-foreground">
            {titleHead ? <>{titleHead} <span className="text-gradient-brand">{titleTail}</span></> : <span className="text-gradient-brand">{titleTail}</span>}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        </div>
        <Link
          to="/lajme"
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-border bg-background/70 backdrop-blur px-5 py-2.5 text-sm font-medium text-foreground shadow-soft transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5"
        >
          {viewAll}
          <ArrowRight className="h-4 w-4 text-primary" />
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} categories={categories} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-background/50 backdrop-blur px-6 py-16 text-center">
          <p className="text-base md:text-lg text-muted-foreground">
            {t("news.empty.title")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80">
            {t("news.empty.desc")}
          </p>
        </div>
      )}
    </section>
  );
}
