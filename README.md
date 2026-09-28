# Gi Rim Han — academic website

A four-page bilingual Quarto website for Gi Rim Han's experimental physical chemistry research profile.

## Preview locally

```powershell
quarto preview
```

The rendered site is written to `_site/`.

## Update before publishing

- Replace the `GRH` monogram on `index.qmd` with a profile photograph when one is available.
- Add verified external profile links (email, ORCID, Google Scholar, GitHub, or CV) to the About page.
- Review affiliation and project status before deployment.
- Add the final GitHub Pages URL as `site-url` in `_quarto.yml`.

## Main files

- `_quarto.yml` — site navigation and global configuration
- `index.qmd` — About page
- `research.qmd` — research themes and capabilities
- `publications.qmd` — bilingual publication page shell
- `assets/publications-v3.js` — structured publication and manuscript data
- `assets/site-v3.js` — English/Korean language switch and translated navigation
- `projects.qmd` — current research directions
- `styles.scss` — visual system and responsive layout
