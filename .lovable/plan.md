# Lajme & Njoftime — plan i plotë

Nje modul i plotë lajmesh me krijim/publikim nga Admin Paneli dhe shfaqje publike me SEO, në stilin ekzistues të KPT.

## 1. Baza e të dhënave (Cloud)

**Tabela `article_categories`** (paracaktuar, e ndryshueshme më vonë):
`slug`, `name_al`, `name_en`, `sort_order`.
Seed: `atk`, `tatime`, `tvsh`, `ligje-udhezime`, `subvencione-grante`, `kontabilitet`, `financa`, `punesim`, `njoftime`.

**Tabela `articles`**:
- `slug` (unik), `category_slug`
- `title`, `excerpt`, `content_html` (rich text)
- `cover_image_url`, `og_image_url`
- `gallery` (jsonb: `[{url,caption}]`), `attachments` (jsonb: `[{url,name,size}]`)
- `tags` (text[])
- `author` (default "KPT Consulting")
- `reading_minutes` (int, auto-llogaritet nga content)
- `status` (`draft` | `published` | `scheduled`)
- `published_at` (timestamptz), `scheduled_at` (timestamptz)
- `is_featured` (bool), `is_sticky` (bool)
- `seo_title`, `seo_description`
- `comments_enabled` (bool, për të ardhmen)
- `views_count` (int)
- `created_by` (uuid → auth.users), `created_at`, `updated_at`

**RLS + GRANTs**:
- `anon` + `authenticated` mund të lexojnë vetëm rreshtat me `status='published'` AND `published_at <= now()`.
- Adminët (`has_role admin`) menaxhojnë gjithçka (SELECT/INSERT/UPDATE/DELETE).
- GRANT SELECT public; GRANT ALL admin/service_role.
- Trigger `set_updated_at` + trigger për `reading_minutes` (≈200 fjalë/min).

**Storage**: përdor bucket-in ekzistues `site-images` për cover, gallery, OG. PDF-të në një nën-folder `articles/attachments/`.

## 2. Faqja publike `/lajme` (rishkruhet)

Grid responsive (1/2/3 kolona), me:
- Filtra kategorish si "pill" tabs (Të gjitha + 9 kategoritë).
- Search bar (kërkon në title + excerpt).
- Sort: Më të rejat / Më të vjetrat.
- Paginim (12 për faqe) me query params `?cat=&q=&sort=&page=`.
- Kartë artikulli: cover me `loading="lazy"`, badge kategorie, data, titull, excerpt, buton "Lexo më shumë".
- Sticky articles në krye.

## 3. Faqja e artikullit `/lajme/$slug`

- Featured image e madhe, hero i pastër.
- Titull, kategori (badge), data, autor, koha e leximit.
- Përmbajtja (HTML e sanitizuar nga DOMPurify) me tipografia e brendit.
- Gallery opsionale (grid + lightbox i thjeshtë).
- PDF attachments (listë me ikona + download).
- Share: Facebook, LinkedIn, Email (mailto).
- Prev / Next artikull (sipas `published_at`).
- 3 artikuj të lidhur nga e njëjta kategori.
- SEO i plotë në `head()`: title, description, canonical, `og:*`, `twitter:card`, `og:image`, JSON-LD `Article`.

## 4. Homepage — seksioni "Përditësime Ligjore dhe Tatimore"

Shtohet mes seksioneve ekzistuese (para "Kontakti"):
- Titull + subtitull + buton djathtas "Shiko të gjitha →" → `/lajme`.
- 4 artikujt më të fundit (grid 1/2/4).
- Nëse s'ka artikuj, seksioni fshihet automatikisht.

## 5. Admin Panel — tab i ri "Lajmet"

Shtohet një tab `articles` në `/admin`:
- Lista me kërkim/filtër status/kategori, kolona: titull, kategori, status, data, veprime.
- Butoni "Artikull i ri" hap një editor të plotë.
- Editor:
  - Titull → auto slug (i editueshëm).
  - Kategori (select), Tags (input me chip-a).
  - Cover image (ImageUpload ekzistues), OG image opsionale.
  - Excerpt (textarea).
  - **Rich text editor**: **TipTap** (React, i lehtë, mbulon: Headings H2/H3, Bold, Italic, Underline, Lista, Tables, Links, Images, Quotes, Code block).
  - Gallery (multi image upload).
  - Attachments PDF (upload me `supabase.storage`).
  - SEO title, meta description, custom slug, OG image.
  - Toggles: Featured, Sticky, Comments enabled.
  - Status: Draft / Published / Scheduled (me date-time picker).
  - Butonat: Ruaj draft • Publiko • Anulo publikimin • Fshi.
- Të gjitha thirrjet përmes klientit `supabase` (RLS admin).

## 6. Cron për publikime të planifikuara

pg_cron job çdo 5 minuta që `UPDATE articles SET status='published', published_at=scheduled_at WHERE status='scheduled' AND scheduled_at <= now()`.

## 7. SEO & Sitemap

- Rifreskohet `src/routes/sitemap[.]xml.ts` që të përfshijë `/lajme` dhe të gjitha `/lajme/$slug` published.
- Meta të pasura në `head()` të secilës faqe.
- `robots` normale; artikujt draft s'listohen kurrë.

## 8. Navigimi

Header desktop + mobile: `Ballina, Rreth Nesh, Shërbimet, Lajme & Njoftime, Na Kontaktoni` (linku aktiv theksohet — tashmë ekziston, ruhet).

## 9. Përkthimi

Etiketat UI shtohen në `src/lib/i18n.tsx` për SQ + EN (titujt e artikujve mbeten siç i shkruan admin).

## 10. Dizajni

Përdor tokenat, tipografia (Inter/Manrope), rrezet (`rounded-2xl`), `shadow-soft/elegant`, gradientin `--gradient-brand`, dhe animimet `animate-fade-up` që ekzistojnë. Asnjë skemë e re ngjyrash.

---

## Detaje teknike

- **Rich text**: TipTap starter kit + extensions (Underline, Link, Image, Table, CodeBlock). Ruhet si HTML. Rendering me DOMPurify.
- **Slug**: `slugify` në klient; kontroll unike në DB (indeks unik).
- **Uploads**: `supabase.storage.from('site-images').upload(...)` në folder `articles/{articleId}/...`.
- **Fetching publik**: `queryOptions` në `src/lib/articles.ts` (list, byCategory, bySlug, latest(n), related, prevNext) — të gjitha përdorin publikun `supabase` client (RLS bën filtrimin).
- **Paketa të reja**: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-table` (+ row/cell/header), `dompurify`, `slugify`.

```text
Struktura e re e skedarëve
src/lib/articles.ts                     (queries + tipe)
src/lib/sanitize.ts                     (DOMPurify wrapper)
src/routes/lajme.tsx                    (rishkruhet: listë + filtra)
src/routes/lajme.$slug.tsx              (faqja e artikullit)
src/components/site/ArticleCard.tsx
src/components/site/LatestNewsSection.tsx  (homepage)
src/components/admin/ArticlesAdmin.tsx
src/components/admin/ArticleEditor.tsx
src/components/admin/RichTextEditor.tsx    (TipTap)
supabase/migrations/…_articles.sql
```

## Çfarë s'preket
Header nav rendi, dizajni ekzistues, Shërbimet, Rreth Nesh, Kontakti, About-i, Trust, Footer, LanguageSwitcher — asgjë nga këto s'ndryshon vizualisht.
