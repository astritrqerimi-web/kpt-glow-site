<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Managed app emails use the server-only template helper and per-feature triggers; do not create queues or a generic browser send endpoint because this project uses synchronous managed delivery.
- Preserve the entities v4 resolution aliases and server-only environment loading in Vite because email rendering must work without exposing credentials.
- Let /lovable/* requests pass through app middleware unchanged because managed email endpoints authenticate their own callers.
- Keep all six scaffolded authentication email actions with the managed handler; share email-safe brand tokens between templates so branding stays consistent without altering auth dispatch.
- Declare managed email route options inline in createFileRoute so TanStack code splitting cannot introduce initialization cycles.
- Salary calculator rules and bilingual copy live in one validated site_content record; a shared cent-based payroll engine drives both conversion modes and tests, while existing admin RLS controls edits.
