# Changelog

## 3.0.0 (2026-07-22)

Complete redesign and major feature release.

### Added
- **D&D Beyond import** (Tools → Import D&D Beyond Character) from a public
  character URL or pasted JSON: abilities, AC, HP, speed, saves, skills,
  attacks, spells (with full spell details), inventory, and features & traits
- **↻ Sync** button to re-import from D&D Beyond while preserving journal,
  notes, expended spell slots, and ⚔ action flags
- **Features & Traits tab** with sections by source (class, species, feats,
  background, options); single-statement traits render as a compact table
- **Actions tab curation**: flag spells, features, and items with ⚔ to
  surface them as actions; imported action features carry activation, uses,
  save DCs, and damage dice
- **Play sessions**: ▶ Session logs every roll with a timestamp and saves the
  log to a **Character Journal** notebook (a note per session, with its own
  journal editor view); embedded legacy journal entries can be migrated
- **Heal/Damage buttons** with 5e temp-HP-first rules and auto-save
- **Search (🔍)** across the entire sheet with jump-to-result navigation
- **Roll toasts**: results stack bottom-left, dismissable, with Clear all
- Collapsible descriptions for spells and inventory items; HTML tables in
  imported descriptions render as real tables

### Changed
- Character sheet redesigned in a D&D Beyond-style layout with fixed,
  responsive sections (the drag/resize/hide tile system was removed)
- All rolls (attacks, spells, checks, saves, skills) now use the 3D dice
  roller; roll buttons only appear where there is something to roll
- Dice are kept within the visible panel area (bounce off the edges)
- Plugin archive slimmed by ~75% (unused SRD datasets are no longer shipped)

### Fixed
- Spell slot totals and journal entries no longer lost when reloading a sheet
- Ability tooltips no longer fail silently
- Duplicate descriptions across derived features (e.g. Font of Magic
  sub-actions) collapse into references to the parent feature

## 2.0.0

- Inventory & spell saving fixes, expanded renderer, mobile support
