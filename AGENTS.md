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

- Succession dossiers extend normal quotes through a private `succession_details` table; use the authenticated transactional creation function so contact information and dossier metadata stay together.
- Completion reports use professional-declared `mission_reports` data and authenticated signed before/after photos; generate PDF blobs in the browser with an embedded Unicode font to avoid server filesystem assumptions and preserve accents.
- Referral contact submissions are validated public server functions with write-only privileged access, a database submission throttle, and administrator-only reads; never expose contact rows publicly.
