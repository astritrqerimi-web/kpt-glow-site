import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ArticleStatus = "draft" | "published" | "scheduled";

export interface ArticleCategory {
  slug: string;
  name_al: string;
  name_en: string;
  sort_order: number;
}

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface Attachment {
  url: string;
  name: string;
  size?: number;
}

export interface Article {
  id: string;
  slug: string;
  category_slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  cover_image_url: string | null;
  og_image_url: string | null;
  gallery: GalleryImage[];
  attachments: Attachment[];
  tags: string[];
  author: string;
  reading_minutes: number;
  status: ArticleStatus;
  published_at: string | null;
  scheduled_at: string | null;
  is_featured: boolean;
  is_sticky: boolean;
  seo_title: string | null;
  seo_description: string | null;
  comments_enabled: boolean;
  views_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

const ARTICLE_COLUMNS =
  "id, slug, category_slug, title, excerpt, content_html, cover_image_url, og_image_url, gallery, attachments, tags, author, reading_minutes, status, published_at, scheduled_at, is_featured, is_sticky, seo_title, seo_description, comments_enabled, views_count, created_by, created_at, updated_at";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const from = () => (supabase as any).from("articles");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromCats = () => (supabase as any).from("article_categories");

function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/ë/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function articleUrlSlug(article: Pick<Article, "slug" | "title">): string {
  return article.slug?.trim() || slugifyTitle(article.title);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function publishedOnly(query: any) {
  return query
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString());
}

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["article_categories"],
    queryFn: async (): Promise<ArticleCategory[]> => {
      const { data, error } = await fromCats().select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as ArticleCategory[];
    },
    staleTime: 5 * 60_000,
  });

export const latestArticlesQuery = (limit = 4) =>
  queryOptions({
    queryKey: ["articles", "latest", limit],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await publishedOnly(from().select(ARTICLE_COLUMNS))
        .order("is_sticky", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as Article[];
    },
    staleTime: 60_000,
  });

export interface ListParams {
  category?: string;
  q?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}

export const articlesListQuery = (params: ListParams) =>
  queryOptions({
    queryKey: ["articles", "list", params],
    queryFn: async (): Promise<{ items: Article[]; total: number }> => {
      const pageSize = params.pageSize ?? 12;
      const page = Math.max(1, params.page ?? 1);
      const ascending = params.sort === "oldest";
      let query = publishedOnly(from().select(ARTICLE_COLUMNS, { count: "exact" }));
      if (params.category && params.category !== "all") {
        query = query.eq("category_slug", params.category);
      }
      if (params.q && params.q.trim()) {
        const q = params.q.trim().replace(/[%_]/g, "");
        query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
      }
      query = query
        .order("is_sticky", { ascending: false })
        .order("published_at", { ascending });
      query = query.range((page - 1) * pageSize, page * pageSize - 1);
      const { data, error, count } = await query;
      if (error) throw error;
      return { items: (data ?? []) as Article[], total: count ?? 0 };
    },
    staleTime: 30_000,
  });

export const articleBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["articles", "slug", slug],
    queryFn: async (): Promise<Article | null> => {
      const { data, error } = await publishedOnly(from().select(ARTICLE_COLUMNS))
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as Article;

      const { data: fallbackData, error: fallbackError } = await publishedOnly(
        from().select(ARTICLE_COLUMNS),
      ).order("published_at", { ascending: false });
      if (fallbackError) throw fallbackError;
      return ((fallbackData ?? []) as Article[]).find((article) => articleUrlSlug(article) === slug) ?? null;
    },
    staleTime: 60_000,
  });

export const relatedArticlesQuery = (categorySlug: string, excludeId: string, limit = 3) =>
  queryOptions({
    queryKey: ["articles", "related", categorySlug, excludeId, limit],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await publishedOnly(from().select(ARTICLE_COLUMNS))
        .eq("category_slug", categorySlug)
        .neq("id", excludeId)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as Article[];
    },
    staleTime: 60_000,
  });

export const prevNextArticleQuery = (publishedAt: string, id: string) =>
  queryOptions({
    queryKey: ["articles", "prevnext", id, publishedAt],
    queryFn: async (): Promise<{ prev: Article | null; next: Article | null }> => {
      const [prevRes, nextRes] = await Promise.all([
        from()
          .select(ARTICLE_COLUMNS)
          .eq("status", "published")
          .not("published_at", "is", null)
          .lt("published_at", publishedAt)
          .order("published_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        from()
          .select(ARTICLE_COLUMNS)
          .eq("status", "published")
          .not("published_at", "is", null)
          .gt("published_at", publishedAt)
          .order("published_at", { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);
      return {
        prev: (prevRes.data as Article | null) ?? null,
        next: (nextRes.data as Article | null) ?? null,
      };
    },
    staleTime: 60_000,
  });

/** Admin — all articles regardless of status. */
export const adminArticlesQuery = () =>
  queryOptions({
    queryKey: ["articles", "admin", "all"],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await from()
        .select(ARTICLE_COLUMNS)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Article[];
    },
    staleTime: 10_000,
  });

export function categoryName(cat: ArticleCategory | undefined, lang: string): string {
  if (!cat) return "";
  return lang === "en" ? cat.name_en : cat.name_al;
}

export function formatDate(iso: string | null, lang: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "en" ? "en-GB" : "sq-AL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
