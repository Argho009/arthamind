# DESIGN.md — Design System & Craft Specification

> **Rule:** This document is law. Every screen, component, and interaction in ArthaMind must adhere to these specifications.

---

## 1. The One-Line Brief
> **For salaried and gig-working urban Indians overwhelmed by 80+ weekly micro-UPI transactions, ArthaMind provides immediate, calm clarity on exactly how much they can spend today without jeopardizing fixed commitments or their emergency cushion.**

---

## 2. Direction & Signature Move
* **Direction:** *Architectural Financial Ledger* — Inspired by 21st.dev, Linear, and high-end editorial banking (Land-book / Dribbble craft).
* **Signature Move:**
  * **Asymmetric Focal Anchor:** An oversized, authoritative "Safe to Spend" gauge that establishes immediate visual hierarchy, paired with an architectural cash-flow waterfall.
  * **Nested Surface Geometry:** Exact geometric nesting where inner radius $R_{\text{inner}} = R_{\text{outer}} - \text{padding}$.
  * **Motion Moment:** A tactile 200ms ease-out `cubic-bezier(0.23, 1, 0.32, 1)` transition that physically settles numbers and tags when transactions are reconciled.

---

## 3. Typography & Modular Scale
* **Families (Max 2 + 1 Mono):**
  * **UI & Body:** `Plus Jakarta Sans` (weights: 400 Regular, 500 Medium, 600 SemiBold).
  * **Numerals & Codes:** `JetBrains Mono` with `tabular-nums` enabled everywhere numbers align.
* **Scale & Tracking:**
  * **Display Numbers (Oversized Anchor):** 36px–44px, line-height 1.1, tracking `-0.035em`, weight 700.
  * **Section Headings:** 18px–20px, line-height 1.25, tracking `-0.02em`, weight 600.
  * **Body Text:** 14px–15px (dense app UI), line-height 1.55, tracking `0em`, weight 400.
  * **Functional Labels & Badges:** 11px–12px, tracking `+0.06em`, uppercase, weight 600.
* **Hierarchy:** Established purely by scale and weight contrast (3 weights: 400, 500, 700), never by rainbow coloring.

---

## 4. Colour Ramp & 10% Accent Rule
* **Tinted Dark Neutrals (Warm Slate/Charcoal):**
  * Canvas Background: `#090d14`
  * Raised Surface 1 (Cards): `#0e1420` (border: `#1a2333`)
  * Raised Surface 2 (Nested Items): `#141d2e` (border: `#232f44`)
  * Surface Hover: `#1a263c`
* **Text Contrast:**
  * Primary Text: `#f0f6fc` (off-white, 4.5:1+ contrast)
  * Secondary Text: `#8b949e`
  * Muted / Metadata: `#626c79`
* **Single 10% Accent (Sage Green):**
  * Primary Accent: `#2ea043` / `#3fb950`
  * Subtle Accent Tint: `rgba(46, 160, 67, 0.12)`
  * Focus Ring: `2px solid #2ea043` with `2px offset #090d14`
* **Prohibitions:** No purple-to-blue gradients, no multi-color glows, no pure `#000000` or pure `#ffffff`.

---

## 5. Grid, Layout & Spacing
* **Base Grid:** Strict 4px grid. Standard scale: 4, 8, 12, 16, 24, 32, 48, 64px.
* **Container:** Max width 1240px, centered with 24px horizontal padding.
* **Proximity Principle:** Spacing inside a component group ($\le 8\text{px}$) is half the space between groups ($16\text{px}$–$24\text{px}$).
* **Asymmetry:** Every screen features one oversized primary anchor (not 4 identical symmetrical cards).

---

## 6. Surfaces, Radii & Controls
* **Radii Family:**
  * Outer card: `rounded-xl` (12px) with `p-4` (16px) $\rightarrow$ Inner nested control: `rounded-md` (8px). Formula: $12 - 16 \implies 6\text{px}$ to $8\text{px}$.
* **Borders vs. Shadows:** Crisp 1px solid borders (`#1a2333`), layered with a soft, low-opacity tinted shadow (`rgba(0, 0, 0, 0.4)`).
* **Control States:**
  * **Hover:** Subtle surface lift (`bg-slate-800`).
  * **Focus-Visible:** `ring-2 ring-emerald-500/70 ring-offset-2 ring-offset-[#090d14]`.
  * **Active:** `scale-[0.98]` physical depression.
  * **Disabled:** `opacity-40 cursor-not-allowed`.
  * **Touch Target:** Minimum 44px $\times$ 44px clickable area.

---

## 7. Motion & Transitions
* **Rule:** Animate to explain change, never to decorate.
* **Duration & Curve:** 150ms–200ms with `cubic-bezier(0.23, 1, 0.32, 1)`.
* **Properties:** Transform and opacity only (`transition-transform`, `transition-opacity`). Never `transition: all`.
* **Accessibility:** Strict `motion-reduce:transition-none`.

---

## 8. Voice & Content Standards
* **Banned Words:** "Unlock", "Elevate", "Seamless", "Revolutionize", "Supercharge", "Cutting-edge", "In today's fast-paced world".
* **Tone:** Specific, calm, honest accounting. Show numbers, payees, dates, and calculated deltas.
