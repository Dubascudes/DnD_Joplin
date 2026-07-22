# D&D Character Manager for Joplin

Manage **Dungeons & Dragons 5e characters** directly in your Joplin notes, with a
character sheet panel styled after D&D Beyond.

Characters are stored as YAML inside a ` ```dnd ` fenced code block in a regular
note — plain text, sync-friendly, and fully editable by hand if you want.

## Features

### Character sheet panel
- D&D Beyond-style layout: ability score strip, vitals band (AC, HP, initiative,
  speed, proficiency), saving throws, senses, and skills
- Tabs for **Actions**, **Spells**, **Inventory**, **Features & Traits**,
  **Notes**, and **Journal**
- Click any modifier, save, or skill to roll it with animated **3D dice**
- Heal/Damage buttons with 5e temp-HP rules; spell slot trackers
- Six color themes (light, dark, parchment, and more)

### D&D Beyond import & sync
- **Tools → Import D&D Beyond Character** imports a character from its public
  D&D Beyond URL (or pasted JSON): abilities, AC, HP, speed, proficiencies,
  attacks, spells with full spell text, inventory, and features & traits
- A **↻ Sync** button re-imports from D&D Beyond while preserving your journal,
  notes, expended spell slots, and customizations
- The character's privacy must be set to **Public** on D&D Beyond
  (character → Edit → Home → Character Privacy)

### Play sessions & Character Journal
- **▶ Session** starts a play session; every dice roll is logged with a
  timestamp
- Ending the session saves the log as a note in a **Character Journal**
  notebook inside your character's folder, titled "Session X - date"
- Journal notes get their own editor view: title, date, prunable roll log, and
  free-form session notes

### Search
- The 🔍 button searches the whole sheet — attacks, spells, features, items,
  notes, journal, skills, and stats — and jumps straight to the matching row

### Actions tab curation
- Flag any spell, feature, or inventory item with **⚔** to include it in the
  Actions tab, with roll-ready hit and damage buttons

## Usage

1. Install the plugin from the Joplin plugin repository (search "Dungeons and
   Dragons").
2. Create a character:
   - **Import D&D Beyond Character** from the Tools menu, or
   - **Insert DnD Character Template** from the command palette
     (Ctrl+Shift+P) for the built-in creation wizard.
3. Select the character's note — the sheet panel opens automatically.
4. **Edit** to change the sheet; click values to roll; **▶ Session** while
   playing.

Keep each character's note in its own folder — the plugin creates the
Character Journal notebook inside that folder.

## License

MIT — not affiliated with Wizards of the Coast or D&D Beyond. The D&D Beyond
importer uses the same public character-service endpoint the D&D Beyond
character sheet itself uses, and only works for characters you have set to
Public.
