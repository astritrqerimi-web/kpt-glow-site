import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { latestArticlesQuery, categoriesQuery } from "@/lib/articles";
import { ArticleCard } from "@/components/site/ArticleCard";
import { useI18n } from "@/lib/i18n";

export function LatestNewsSection() {
  const { t } = useI18n();
  const { data: articles = [] } = useQuery(latestArticlesQuery(4));
  const { data: categories = [] } = useQuery(categoriesQuery());

  

  return (
    <section id="lajme-home" className="relative scroll-mt-28 md:scroll-mt-32 py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.18em] text-primary font-medium">
              {t("news.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
              {t("news.homeTitle")}
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              {t("news.homeSubtitle")}
            </p>
          </div>
          <Link
            to="/lajme"
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-border bg-background/70 backdrop-blur px-5 py-2.5 text-sm font-medium text-foreground shadow-soft transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5"
          >
            {t("news.viewAll")}
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
      </div>
    </section>
  );
}
