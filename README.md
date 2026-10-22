# Gi Rim Han — academic website

A three-page bilingual Quarto website for Gi Rim Han's experimental physical chemistry research profile.

## Preview locally

```powershell
quarto preview
```

The rendered site is written to `_site/`.

## Edit website content

English and Korean homepage copy lives in Markdown files under `content/`:

- `content/hero.en.md` and `content/hero.ko.md` — hero eyebrow, headline, summary, and button labels/links.
- `content/intro.en.md` and `content/intro.ko.md` — About introduction, research-interest heading, and list.

Edit these files with standard Markdown (headings, paragraphs, emphasis, lists, and links). Small Quarto classes around selected blocks preserve the existing visual styles; keep those wrappers in place when editing their text. The pages include these files at build time, so changes appear on the next `quarto preview` or `quarto render`; no JavaScript or rebuild-specific content fetching is involved.

Other page content remains in its existing source:

- `research.qmd` — research themes and integrated projects, including the YSF program under topic 01
- `projects.qmd` — Projects page copy
- `publications.qmd` and `assets/publications-v3.js` — Publications page introduction and structured publication records
- `index.qmd` — About-page appointments, education, and honors

## Update before publishing

- Replace the `GRH` monogram on `index.qmd` with a profile photograph when one is available.
- Add verified external profile links (email, ORCID, Google Scholar, GitHub, or CV) to the About page.
- Review affiliation and project status before deployment.
- Add the final GitHub Pages URL as `site-url` in `_quarto.yml`.

## Main files

- `_quarto.yml` — site navigation and global configuration
- `index.qmd` — About page layout and navigation between its content sections
- `research.qmd` — research themes and capabilities
- `publications.qmd` — bilingual publication page shell
- `assets/publications-v3.js` — structured publication and manuscript data
- `assets/site-v3.js` — English/Korean language switch and translated navigation
- `projects.qmd` — redirects legacy Projects links to Research
- `styles.scss` — visual system and responsive layout

## Motion and interference visual

The site uses Lumen; the introduction panel uses scoped Sketchy typography
(Neucha and Cabin Sketch), irregular borders, and a sky-blue/blue/navy palette.
The panel presents the research fields and two diagrams feeding AI-NS. Content
already visible on arrival appears immediately, and content
sections reveal once as scrolling brings them into the viewport. Page navigation
has no transition effect. Supporting browsers can crossfade EN/한 changes.
Reduced-motion preferences disable entrance effects and
continuous animation. The animation button pauses both hero diagrams; hidden
tabs and offscreen diagrams stop requesting animation frames.

`content/interference.html` defines the shared three-row SVG below the pulse
trains. `animateInterference()` in `assets/site-v3.js` supplies identical Gaussian
field packets: Pulse 1 is fixed, Pulse 2 scans in delay, and the lower trace follows
the same delay. The displayed signal is the normalized, background-subtracted
**linear interferogram**, `exp(-τ² / (4σ²)) cos(ωτ)`, for the analytic field
`E(t) = exp(-t² / (2σ²)) exp(iωt)`. It is a schematic in arbitrary units, not
measured data or a nonlinear/SHG autocorrelation. A round trip takes 14 seconds.
The whole interferogram stays visible: forward scanning paints it teal and
return scanning paints it orange, instead of fading or erasing the previous trace.
ASOPS trains use narrow, white-filled Gaussian pulses and a red marker that
tracks the closest pump/probe coincidence. When no trigger is visible, a red
"<- Trigger incoming..." label appears instead. Their flow advances one pump
spacing every 3.9 seconds.

Scroll entrance distances and timing live in `styles.scss`. Both
language variants include the same SVG source, so edit the shared file once.

## Publication author roles

`coFirst` and `corresponding` arrays in `assets/publications-v3.js` name the
authors carrying † and * respectively; affiliation symbols are not role marks.
Roles for 13 published articles were checked against the PDFs in `My papers/`.
The 2019 JACS article was checked against the [publisher's author information](https://pubs.acs.org/jacsat/article/141/14/5808/604023/Highly-Crystalline-Perovskite-Based-Photovoltaics).
The vortex-beam manuscript uses the [arXiv title-page footnotes](https://arxiv.org/pdf/2607.14678).
The other two manuscripts use the author-provided markings recorded in the
integrated profile dated 2026-09-21. Journal-specific equal-contribution symbols
are normalized to †; these do not imply corresponding authorship.
