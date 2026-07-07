import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import type { Article, ArticleCategory } from "@/lib/articles";
import {
  articleUrlSlug,
  articleTitle,
  articleExcerpt,
  categoryName,
  formatDate,
} from "@/lib/articles";
import { useI18n } from "@/lib/i18n";

interface Props {
  article: Article;
  categories: ArticleCategory[];
}

export function ArticleCard({ article, categories }: Props) {
  const { lang, t } = useI18n();
  const cat = categories.find((c) => c.slug === article.category_slug);
  const dateStr = formatDate(article.published_at, lang);
  const slug = articleUrlSlug(article);
  const title = articleTitle(article, lang);
  const excerpt = articleExcerpt(article, lang);

  return (
    <Link
      to="/lajme/$slug"
      params={{ slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant hover:border-primary/30"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden
          />
        )}
        {cat && (
          <span
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-soft backdrop-blur"
            style={{ background: "var(--gradient-brand)" }}
          >
            {categoryName(cat, lang)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{dateStr}</span>
          <span className="mx-1">·</span>
          <span>
            {article.reading_minutes} {t("news.minRead")}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
        )}
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            {t("news.readMore")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
