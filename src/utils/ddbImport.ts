// Convert a D&D Beyond character-service v5 payload into the plugin's character schema.
// Endpoint: https://character-service.dndbeyond.com/character/v5/character/{id}
// Unofficial API — the character must have its privacy set to "Public" on D&D Beyond.

import { defaultCharacter } from './dnd';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SRD_LEVELS: any[] = require('../dnd-resources/5e-SRD-Levels.json');

const STAT_IDS: Record<number, string> = { 1: 'STR', 2: 'DEX', 3: 'CON', 4: 'INT', 5: 'WIS', 6: 'CHA' };
const STAT_SUBTYPES: Record<string, string> = {
  'strength-score': 'STR', 'dexterity-score': 'DEX', 'constitution-score': 'CON',
  'intelligence-score': 'INT', 'wisdom-score': 'WIS', 'charisma-score': 'CHA',
};
const SAVE_SUBTYPES: Record<string, string> = {
  'strength-saving-throws': 'STR', 'dexterity-saving-throws': 'DEX', 'constitution-saving-throws': 'CON',
  'intelligence-saving-throws': 'INT', 'wisdom-saving-throws': 'WIS', 'charisma-saving-throws': 'CHA',
};
const SKILL_SUBTYPES: Record<string, string> = {
  'acrobatics': 'Acrobatics', 'animal-handling': 'Animal Handling', 'arcana': 'Arcana',
  'athletics': 'Athletics', 'deception': 'Deception', 'history': 'History', 'insight': 'Insight',
  'intimidation': 'Intimidation', 'investigation': 'Investigation', 'medicine': 'Medicine',
  'nature': 'Nature', 'perception': 'Perception', 'performance': 'Performance',
  'persuasion': 'Persuasion', 'religion': 'Religion', 'sleight-of-hand': 'Sleight of Hand',
  'stealth': 'Stealth', 'survival': 'Survival',
};
const ALIGNMENTS: Record<number, string> = {
  1: 'Lawful Good', 2: 'Neutral Good', 3: 'Chaotic Good',
  4: 'Lawful Neutral', 5: 'True Neutral', 6: 'Chaotic Neutral',
  7: 'Lawful Evil', 8: 'Neutral Evil', 9: 'Chaotic Evil',
};

const FULL_CASTERS = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'];
const HALF_CASTERS = ['paladin', 'ranger', 'artificer'];
const THIRD_CASTER_SUBCLASSES = ['eldritch knight', 'arcane trickster'];

// PHB multiclass spell-slot table: combined caster level -> slots for levels 1..9
const MULTICLASS_SLOTS: Record<number, number[]> = {
  1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6:  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8:  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

function mod(score: number) { return Math.floor((score - 10) / 2); }
function pbFromLevel(level: number) {
  if (level >= 17) return 6; if (level >= 13) return 5; if (level >= 9) return 4; if (level >= 5) return 3; return 2;
}
function signed(n: number) { return n >= 0 ? `+${n}` : `${n}`; }

// Convert an HTML <table> into pipe-separated text rows so tabular content
// (e.g. Font of Magic's "Creating Spell Slots") survives the HTML strip.
function htmlTableToText(tableHtml: string): string {
  const rows: string[] = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(tableHtml)) !== null) {
    const cells: string[] = [];
    const cellRe = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
    let c: RegExpExecArray | null;
    while ((c = cellRe.exec(m[1])) !== null) {
      cells.push(c[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    }
    if (cells.length && cells.some(x => x)) rows.push(cells.join(' | '));
  }
  const cap = /<caption[^>]*>([\s\S]*?)<\/caption>/i.exec(tableHtml);
  const caption = cap ? cap[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  return '\n' + (caption ? caption + '\n' : '') + rows.join('\n') + '\n';
}

function stripHtml(html: string): string {
  return String(html || '')
    .replace(/<table[\s\S]*?<\/table>/gi, t => htmlTableToText(t))
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|ul|ol|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&rsquo;|&#8217;/g, '’').replace(/&ldquo;|&#8220;/g, '“').replace(/&rdquo;|&#8221;/g, '”').replace(/&mdash;/g, '—')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function truncate(text: string, max = 400): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

/** Extract a character id from a D&D Beyond URL, share link, or a bare numeric id. */
export function parseDdbCharacterInput(input: string): string | null {
  const s = String(input || '').trim();
  if (!s) return null;
  if (/^\d+$/.test(s)) return s;
  const m = s.match(/(?:characters|profile\/[^/]+\/characters)\/(\d+)/i);
  return m ? m[1] : null;
}

export function ddbCharacterUrl(id: string): string {
  return `https://character-service.dndbeyond.com/character/v5/character/${id}`;
}

/** All modifiers from every source group, flattened. */
function allModifiers(data: any): any[] {
  const groups = data?.modifiers || {};
  const out: any[] = [];
  for (const key of Object.keys(groups)) {
    const arr = groups[key];
    if (Array.isArray(arr)) out.push(...arr);
  }
  return out;
}

function computeAbilities(data: any, mods: any[]) {
  const abilities: Record<string, number> = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
  for (const s of data?.stats || []) {
    const key = STAT_IDS[s?.id]; if (key && s?.value != null) abilities[key] = Number(s.value);
  }
  for (const s of data?.bonusStats || []) {
    const key = STAT_IDS[s?.id]; if (key && s?.value != null) abilities[key] += Number(s.value);
  }
  for (const m of mods) {
    const key = STAT_SUBTYPES[m?.subType];
    if (!key) continue;
    if (m?.type === 'bonus' && m?.value != null) abilities[key] += Number(m.value);
    if (m?.type === 'set' && m?.value != null) abilities[key] = Math.max(abilities[key], Number(m.value));
  }
  for (const s of data?.overrideStats || []) {
    const key = STAT_IDS[s?.id]; if (key && s?.value != null) abilities[key] = Number(s.value);
  }
  return abilities;
}

function equippedArmor(data: any): { body: any | null, shield: any | null } {
  let body: any = null, shield: any = null;
  for (const it of data?.inventory || []) {
    if (!it?.equipped) continue;
    const def = it?.definition || {};
    if (def.filterType !== 'Armor') continue;
    if (def.armorTypeId === 4) shield = def;
    else if (def.armorTypeId != null) body = def;
  }
  return { body, shield };
}

function computeArmorClass(data: any, mods: any[], abilities: Record<string, number>, classNames: string[]) {
  const dex = mod(abilities.DEX);
  const { body, shield } = equippedArmor(data);
  let ac: number;
  if (body) {
    const base = Number(body.armorClass || 10);
    if (body.armorTypeId === 1) ac = base + dex;                 // light
    else if (body.armorTypeId === 2) ac = base + Math.min(dex, 2); // medium
    else ac = base;                                               // heavy
  } else if (classNames.includes('barbarian')) {
    ac = 10 + dex + mod(abilities.CON);
  } else if (classNames.includes('monk') && !shield) {
    ac = 10 + dex + mod(abilities.WIS);
  } else {
    ac = 10 + dex;
  }
  if (shield) ac += Number(shield.armorClass || 2);
  for (const m of mods) {
    if (m?.type !== 'bonus' || m?.value == null) continue;
    if (m.subType === 'armor-class') ac += Number(m.value);
    if (m.subType === 'armored-armor-class' && body) ac += Number(m.value);
    if (m.subType === 'unarmored-armor-class' && !body) ac += Number(m.value);
  }
  return ac;
}

function computeSpeed(data: any, mods: any[]): string {
  let walk = Number(data?.race?.weightSpeeds?.normal?.walk || 30);
  const { body } = equippedArmor(data);
  for (const m of mods) {
    if (m?.type !== 'bonus' || m?.value == null) continue;
    if (m.subType === 'speed') walk += Number(m.value);
    if (m.subType === 'unarmored-movement' && !body) walk += Number(m.value);
  }
  return `${walk} ft`;
}

function classInfo(data: any) {
  const classes = (data?.classes || []).map((c: any) => ({
    name: String(c?.definition?.name || ''),
    index: String(c?.definition?.name || '').toLowerCase(),
    subclass: String(c?.subclassDefinition?.name || ''),
    level: Number(c?.level || 0),
    spellAbilityId: c?.definition?.spellCastingAbilityId ?? c?.subclassDefinition?.spellCastingAbilityId ?? null,
    canCast: !!(c?.definition?.canCastSpells || c?.subclassDefinition?.canCastSpells),
  }));
  const totalLevel = classes.reduce((a: number, c: any) => a + c.level, 0) || 1;
  const label = classes
    .map((c: any) => c.subclass ? `${c.name} ${c.level} (${c.subclass})` : `${c.name} ${c.level}`)
    .join(' / ');
  return { classes, totalLevel, label };
}

function srdSlots(classIndex: string, level: number): number[] | null {
  const entry = SRD_LEVELS.find((e: any) => e?.class?.index === classIndex && e?.level === level);
  const sc = entry?.spellcasting;
  if (!sc) return null;
  const out = [];
  for (let i = 1; i <= 9; i++) out.push(Number(sc[`spell_slots_level_${i}`] || 0));
  return out.some(n => n > 0) ? out : null;
}

function computeSpellSlots(classes: any[]): number[] {
  const casters = classes.filter(c =>
    FULL_CASTERS.includes(c.index) || HALF_CASTERS.includes(c.index) || c.index === 'warlock' ||
    THIRD_CASTER_SUBCLASSES.includes(c.subclass.toLowerCase()));
  const nonWarlock = casters.filter(c => c.index !== 'warlock');
  const warlock = casters.find(c => c.index === 'warlock');

  let slots = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (nonWarlock.length === 1) {
    const c = nonWarlock[0];
    // Single caster class: prefer its own class table (SRD); fall back to multiclass math.
    const own = srdSlots(c.index, c.level);
    if (own) slots = own;
    else {
      const cl = casterLevel([c]);
      if (cl > 0) slots = MULTICLASS_SLOTS[Math.min(20, cl)] || slots;
    }
  } else if (nonWarlock.length > 1) {
    const cl = casterLevel(nonWarlock);
    if (cl > 0) slots = MULTICLASS_SLOTS[Math.min(20, cl)] || slots;
  }
  if (warlock) {
    const pact = srdSlots('warlock', warlock.level);
    if (pact) slots = slots.map((n, i) => n + pact[i]);
  }
  return slots;
}

function casterLevel(casters: any[]): number {
  let cl = 0;
  for (const c of casters) {
    if (FULL_CASTERS.includes(c.index)) cl += c.level;
    else if (c.index === 'artificer') cl += Math.ceil(c.level / 2);
    else if (HALF_CASTERS.includes(c.index)) cl += Math.floor(c.level / 2);
    else if (THIRD_CASTER_SUBCLASSES.includes(c.subclass.toLowerCase())) cl += Math.floor(c.level / 3);
  }
  return cl;
}

// How a spell was obtained when it comes from a non-class spell group
const SPELL_GROUP_LABELS: Record<string, string> = {
  race: 'Racial', feat: 'Feat', item: 'Item', background: 'Background',
};

function collectSpells(data: any): { entry: any, abilityId: number | null, origin: string | null }[] {
  const out: { entry: any, abilityId: number | null, origin: string | null }[] = [];
  const classById: Record<string, any> = {};
  for (const c of data?.classes || []) classById[String(c?.id)] = c;

  for (const cs of data?.classSpells || []) {
    const cls = classById[String(cs?.characterClassId)];
    const abilityId = cls?.definition?.spellCastingAbilityId ?? cls?.subclassDefinition?.spellCastingAbilityId ?? null;
    const origin = cls?.definition?.name || null;
    for (const sp of cs?.spells || []) out.push({ entry: sp, abilityId, origin });
  }
  const groups = data?.spells || {};
  for (const key of Object.keys(groups)) {
    for (const sp of groups[key] || []) {
      out.push({ entry: sp, abilityId: sp?.spellCastingAbilityId ?? null, origin: SPELL_GROUP_LABELS[key] || null });
    }
  }
  return out;
}

function spellRange(def: any): string {
  const r = def?.range || {};
  const origin = String(r.origin || '');
  if (origin === 'Ranged' && r.rangeValue) return `${r.rangeValue} ft`;
  if (origin) return origin; // Touch, Self, Sight, etc.
  return '';
}

function spellDamage(def: any): { damage: string, healing: boolean } {
  for (const m of def?.modifiers || []) {
    const dice = m?.die?.diceString;
    if (!dice) continue;
    if (m?.type === 'damage') return { damage: String(dice), healing: false };
    if (m?.type === 'bonus' && m?.subType === 'hit-points') return { damage: String(dice), healing: true };
  }
  return { damage: '', healing: false };
}

// ---- Full spell details (rendered in the sheet's collapsible notes) ----

const SPELL_ACTIVATION_TYPES: Record<number, string> = {
  1: 'action', 3: 'bonus action', 4: 'reaction', 5: 'action', 6: 'minute', 7: 'hour', 8: 'special',
};

// Only ids we are confident about; unknown sources are omitted rather than mislabeled.
const SOURCE_BOOKS: Record<number, string> = {
  1: 'Basic Rules', 2: "Player's Handbook", 3: "Dungeon Master's Guide", 4: 'Monster Manual',
};

function spellCastingTime(def: any): string {
  if (def?.castingTimeDescription) return String(def.castingTimeDescription);
  const a = def?.activation || {};
  const t = Number(a.activationTime || 1);
  const type = SPELL_ACTIVATION_TYPES[a.activationType] || '';
  if (!type) return '';
  const plural = (type === 'minute' || type === 'hour') && t > 1 ? 's' : '';
  return `${t} ${type}${plural}`;
}

function spellRangeArea(def: any): string {
  const r = def?.range || {};
  let base = spellRange(def);
  if (r.aoeValue) {
    const shape = typeof r.aoeType === 'string' && r.aoeType ? ` ${String(r.aoeType).toLowerCase()}` : '';
    base = `${base || 'Self'} (${r.aoeValue} ft${shape})`;
  }
  return base;
}

function spellComponents(def: any): string {
  const map: Record<number, string> = { 1: 'V', 2: 'S', 3: 'M' };
  const comps = (def?.components || []).map((c: number) => map[c]).filter(Boolean);
  if (!comps.length) return '';
  let s = comps.join(', ');
  if (comps.indexOf('M') !== -1 && def?.componentsDescription) s += ` (${def.componentsDescription})`;
  return s;
}

function spellDuration(def: any): string {
  const d = def?.duration || {};
  if (String(d.durationType || '') === 'Instantaneous') return 'Instantaneous';
  const n = Number(d.durationInterval || 0);
  const unit = String(d.durationUnit || '');
  const time = n && unit ? `${n} ${unit.toLowerCase()}${n > 1 ? 's' : ''}` : String(d.durationType || '');
  if (!time) return '';
  return def?.concentration ? `Concentration, up to ${time}` : time;
}

function spellSource(def: any): string {
  const sources = Array.isArray(def?.sources) ? def.sources : [];
  const preferred = sources.find((s: any) => s?.pageNumber != null) || sources[0] || {};
  const id = preferred?.sourceId ?? def?.sourceId;
  const page = preferred?.pageNumber ?? def?.sourcePageNumber;
  const book = SOURCE_BOOKS[id];
  if (!book) return '';
  return page ? `${book}, pg. ${page}` : book;
}

function formatSpellDetails(def: any, origin: string | null, prepared: boolean): string {
  const lines: string[] = [];

  const school = String(def?.school || '');
  const levelLine = (def?.level === 0 ? `${school} cantrip` : `Level ${def?.level} ${school}`).trim();
  const badges = [def?.ritual ? 'ritual' : '', prepared ? 'prepared' : ''].filter(Boolean);
  lines.push([origin, levelLine + (badges.length ? ` (${badges.join(', ')})` : '')].filter(Boolean).join(' — '));

  const facts: [string, string][] = [
    ['Casting Time', spellCastingTime(def)],
    ['Range/Area', spellRangeArea(def)],
    ['Components', spellComponents(def)],
    ['Duration', spellDuration(def)],
    ['Source', spellSource(def)],
  ];
  for (const [k, v] of facts) if (v) lines.push(`${k}: ${v}`);

  const desc = stripHtml(def?.description || def?.snippet || '');
  if (desc) lines.push('', truncate(desc, 8000));

  const tags = (Array.isArray(def?.tags) ? def.tags : []).filter(Boolean);
  if (tags.length) lines.push('', `Tags: ${tags.join(', ')}`);

  return lines.join('\n').trim();
}

// ---- Features & actions (Features tab + activatable actions) ----

const RESET_TYPES: Record<number, string> = { 1: 'Short Rest', 2: 'Long Rest' };

function activationLabel(a: any): string {
  const type = SPELL_ACTIVATION_TYPES[a?.activationType] || '';
  if (!type) return '';
  const t = Number(a?.activationTime || 1);
  const plural = (type === 'minute' || type === 'hour') && t > 1 ? 's' : '';
  return `${t} ${type}${plural}`;
}

function limitedUseLabel(lu: any): string {
  if (!lu || lu.maxUses == null) return '';
  const reset = RESET_TYPES[lu.resetType] || '';
  return `${lu.maxUses}/${reset || 'recharge'}`;
}

function normalizeBody(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

// Boilerplate entries whose mechanics are already applied to the sheet
const FEATURE_SKIP = new Set([
  'ability score improvement', 'ability score increase', 'hit points', 'proficiencies',
  'equipment', 'languages', 'age', 'skills', 'feat', 'bonus proficiency', 'bonus proficiencies',
]);

function collectFeatures(data: any): any[] {
  const seen = new Set<string>();
  // Two-phase collection: gather raw entries first, then resolve description
  // text so duplicated parent descriptions (e.g. every "Font of Magic: …"
  // action carrying the full Font of Magic text) collapse into references.
  const pendingActions: any[] = [];
  const pendingOthers: any[] = [];
  const addPending = (list: any[], p: any) => {
    const key = String(p.name || '').toLowerCase();
    if (!p.name || seen.has(key)) return;
    seen.add(key);
    list.push(p);
  };

  // Map class-feature ids to class names so actions can be attributed
  const featureClass: Record<string, string> = {};
  for (const c of data?.classes || []) {
    const cname = c?.definition?.name || 'Class';
    for (const f of c?.classFeatures || []) {
      if (f?.definition?.id != null) featureClass[String(f.definition.id)] = cname;
    }
  }

  // 1) Activatable actions (DDB Actions tab). Prefer the action's own short
  // snippet; the full parent description is a fallback (and gets deduped).
  const groups = data?.actions || {};
  const groupLabel: Record<string, string> = { race: 'Racial', class: 'Class', background: 'Background', item: 'Item', feat: 'Feat' };
  for (const key of Object.keys(groups)) {
    for (const a of groups[key] || []) {
      if (!a?.name) continue;
      const source = key === 'class'
        ? (featureClass[String(a.componentId)] || 'Class')
        : (groupLabel[key] || '');
      const extra: any = {};
      const r = a?.range || {};
      if (r.range) extra.range = `${r.range}${r.longRange && r.longRange !== r.range ? '/' + r.longRange : ''} ft`;
      else if (r.aoeSize) extra.range = `${r.aoeSize} ft aoe`;
      if (a?.fixedToHit != null) extra.hitDc = signed(Number(a.fixedToHit));
      else if (a?.fixedSaveDc != null) extra.hitDc = `DC ${a.fixedSaveDc}`;
      if (a?.dice?.diceString) extra.damage = String(a.dice.diceString);
      addPending(pendingActions, {
        name: String(a.name),
        source,
        headerBits: [activationLabel(a.activation), limitedUseLabel(a.limitedUse)],
        bodyHtml: a.snippet || a.description || '',
        extra,
      });
    }
  }

  // 2) Class (and subclass) features up to the current level
  for (const c of data?.classes || []) {
    const cname = c?.definition?.name || 'Class';
    const level = Number(c?.level || 0);
    const feats = (c?.classFeatures || [])
      .map((f: any) => f?.definition)
      .filter((d: any) => d && Number(d.requiredLevel || 0) <= level)
      .filter((d: any) => !FEATURE_SKIP.has(String(d.name || '').toLowerCase()))
      .filter((d: any) => d.description || d.snippet);
    feats.sort((a: any, b: any) => Number(a.requiredLevel || 0) - Number(b.requiredLevel || 0));
    for (const d of feats) {
      addPending(pendingOthers, {
        name: String(d.name),
        source: cname + (d.requiredLevel ? ` ${d.requiredLevel}` : ''),
        headerBits: [],
        headerSource: cname + (d.requiredLevel ? ` (level ${d.requiredLevel})` : ''),
        bodyHtml: d.description || d.snippet || '',
      });
    }
  }

  // 3) Species traits
  const raceName = String(data?.race?.fullName || data?.race?.baseName || 'Species');
  for (const t of data?.race?.racialTraits || []) {
    const d = t?.definition;
    if (!d?.name || FEATURE_SKIP.has(String(d.name).toLowerCase())) continue;
    if (!d.description && !d.snippet) continue;
    addPending(pendingOthers, { name: String(d.name), source: raceName, headerBits: [], bodyHtml: d.description || d.snippet });
  }

  // 4) Feats
  for (const f of data?.feats || []) {
    const d = f?.definition;
    if (!d?.name) continue;
    addPending(pendingOthers, { name: String(d.name), source: 'Feat', headerBits: [], bodyHtml: d.description || d.snippet || '' });
  }

  // 5) Background feature
  const bg = data?.background?.definition;
  if (bg?.featureName) {
    addPending(pendingOthers, {
      name: String(bg.featureName),
      source: `Background: ${bg.name || ''}`.trim(),
      headerBits: [],
      headerSource: `Background — ${bg.name || ''}`,
      bodyHtml: bg.featureDescription || '',
    });
  }

  // 6) Chosen options (fighting styles, metamagic, arcane shots, …)
  for (const key of Object.keys(data?.options || {})) {
    for (const o of data.options[key] || []) {
      const d = o?.definition;
      if (!d?.name || !(d.description || d.snippet)) continue;
      const source = key === 'class'
        ? (featureClass[String(o.componentId)] || 'Class option')
        : ((groupLabel[key] ? groupLabel[key] + ' option' : 'Option'));
      addPending(pendingOthers, { name: String(d.name), source, headerBits: [], bodyHtml: d.description || d.snippet });
    }
  }

  // Resolve text. Parents (class features etc.) claim their descriptions
  // first; any later entry with the same substantial body becomes a reference.
  const bodyOwner: Record<string, string> = {};
  const finalize = (p: any) => {
    let body = stripHtml(p.bodyHtml || '').replace(/\{\{[^}]*\}\}/g, '…');
    const norm = normalizeBody(body);
    if (norm.length > 200) {
      if (bodyOwner[norm] && bodyOwner[norm] !== p.name) body = `See "${bodyOwner[norm]}".`;
      else bodyOwner[norm] = p.name;
    }
    const lines: string[] = [];
    const head = [p.headerSource || p.source, (p.headerBits || []).filter(Boolean).join(' • ')].filter(Boolean).join(' — ');
    if (head) lines.push(head);
    if (body) lines.push('', truncate(body, 8000));
    return { name: p.name, source: p.source, notes: lines.join('\n').trim(), ...(p.extra || {}) };
  };

  const others = pendingOthers.map(finalize);
  const actions = pendingActions.map(finalize);
  return actions.concat(others);
}

export interface DdbImportResult {
  character: any;
  warnings: string[];
}

/** Convert a raw character-service v5 payload (with or without the {data} wrapper). */
export function convertDdbToCharacter(payload: any): DdbImportResult {
  const data = payload?.data ?? payload;
  if (!data || typeof data !== 'object' || !('stats' in data)) {
    throw new Error('This does not look like a D&D Beyond character payload (missing "stats").');
  }
  const warnings: string[] = [];
  const mods = allModifiers(data);
  const { classes, totalLevel, label } = classInfo(data);
  const abilities = computeAbilities(data, mods);
  const pb = pbFromLevel(totalLevel);

  const ch: any = defaultCharacter();
  if (data.id != null) ch.ddbId = Number(data.id);
  ch.name = String(data.name || 'Unnamed Character');
  ch.class = label;
  ch.level = totalLevel;
  ch.race = String(data?.race?.fullName || data?.race?.baseName || '');
  ch.background = String(
    data?.background?.hasCustomBackground
      ? (data?.background?.customBackground?.name || '')
      : (data?.background?.definition?.name || ''));
  ch.alignment = ALIGNMENTS[data?.alignmentId] || '';
  ch.abilities = abilities;

  // HP: DDB baseHitPoints excludes the CON contribution.
  const conHp = mod(abilities.CON) * totalLevel;
  const maxHP = data?.overrideHitPoints != null
    ? Number(data.overrideHitPoints)
    : Number(data?.baseHitPoints || 0) + Number(data?.bonusHitPoints || 0) + conHp;
  ch.maxHP = Math.max(1, maxHP);
  ch.currentHP = Math.max(0, ch.maxHP - Number(data?.removedHitPoints || 0));
  ch.tempHP = Number(data?.temporaryHitPoints || 0);

  ch.armorClass = computeArmorClass(data, mods, abilities, classes.map((c: any) => c.index));
  ch.speed = computeSpeed(data, mods);

  // Saving throw + skill proficiencies
  const saves: Record<string, boolean> = { STR: false, DEX: false, CON: false, INT: false, WIS: false, CHA: false };
  const skills: Record<string, string> = {};
  for (const m of mods) {
    const save = SAVE_SUBTYPES[m?.subType];
    if (save && m?.type === 'proficiency') saves[save] = true;
    const skill = SKILL_SUBTYPES[m?.subType];
    if (skill) {
      if (m?.type === 'expertise') skills[skill] = 'expert';
      else if (m?.type === 'proficiency' && skills[skill] !== 'expert') skills[skill] = 'prof';
    }
  }
  ch.savingThrowsProficiencies = saves;
  for (const sk of Object.keys(skills)) ch.skillsProficiencies[sk] = skills[sk];

  // Attacks from equipped weapons
  ch.attacks = [];
  for (const it of data?.inventory || []) {
    const def = it?.definition || {};
    if (def.filterType !== 'Weapon' || !it?.equipped) continue;
    const props = (def.properties || []).map((p: any) => String(p?.name || ''));
    const ranged = def.attackType === 2;
    const finesse = props.includes('Finesse');
    const abilityMod = ranged ? mod(abilities.DEX)
      : finesse ? Math.max(mod(abilities.STR), mod(abilities.DEX))
      : mod(abilities.STR);
    let magic = 0;
    for (const g of def.grantedModifiers || []) {
      if (g?.type === 'bonus' && g?.subType === 'magic' && g?.value != null) magic += Number(g.value);
    }
    const dice = def?.damage?.diceString || '';
    const dmgBonus = abilityMod + magic;
    ch.attacks.push({
      name: String(def.name || 'Weapon'),
      range: ranged && def.range ? `${def.range}/${def.longRange || def.range} ft` : 'Melee',
      hitDc: signed(abilityMod + pb + magic),
      damage: dice ? `${dice}${dmgBonus ? (dmgBonus > 0 ? `+${dmgBonus}` : dmgBonus) : ''}` : '',
      notes: [def.damageType, props.join(', ')].filter(Boolean).join(' — '),
    });
  }

  // Spells
  const spellEntries = collectSpells(data);
  const casters = classes.filter((c: any) => c.spellAbilityId != null);
  const primaryCaster = (casters.some((c: any) => c.canCast) ? casters.filter((c: any) => c.canCast) : casters)
    .sort((a: any, b: any) => b.level - a.level)[0];
  const defaultAbilityId = primaryCaster?.spellAbilityId ?? null;
  ch.spells = [];
  let cantrips = 0, prepared = 0;
  const seenSpells = new Set<string>();
  for (const { entry, abilityId, origin } of spellEntries) {
    const def = entry?.definition || {};
    const name = String(def.name || '');
    if (!name) continue;
    const dedupeKey = `${name}|${def.level}`;
    if (seenSpells.has(dedupeKey)) continue;
    seenSpells.add(dedupeKey);

    const abil = STAT_IDS[abilityId ?? defaultAbilityId ?? -1] || null;
    const abilityMod = abil ? mod(abilities[abil]) : 0;
    let hitDc = '';
    if (def.requiresAttackRoll) hitDc = signed(abilityMod + pb);
    else if (def.requiresSavingThrow) hitDc = `DC ${8 + abilityMod + pb}`;

    const { damage } = spellDamage(def);
    const isPrepared = !!(entry?.prepared || entry?.alwaysPrepared);
    if (def.level === 0) cantrips++;
    if (isPrepared && def.level > 0) prepared++;

    ch.spells.push({
      name,
      range: spellRange(def),
      hitDc,
      damage,
      notes: formatSpellDetails(def, origin, isPrepared),
    });
  }

  // Features & traits (class features, species traits, feats, chosen options)
  ch.features = collectFeatures(data);

  // Spellcasting block
  const slots = computeSpellSlots(classes);
  ch.spellcasting.ability = STAT_IDS[defaultAbilityId ?? -1] || 'NA';
  ch.spellcasting.cantripsKnown = cantrips;
  ch.spellcasting.preparedSpells = prepared;
  for (let i = 1; i <= 9; i++) ch.spellcasting.slots[i] = { total: slots[i - 1], used: 0 };
  if (spellEntries.length && !slots.some(n => n > 0) && classes.some((c: any) => c.canCast)) {
    warnings.push('Could not determine spell slots; set them manually.');
  }

  // Inventory (everything, equipped or not) + custom items + coins
  ch.inventory = [];
  for (const it of data?.inventory || []) {
    const def = it?.definition || {};
    const qty = Number(it?.quantity || 1);
    const cost = def?.cost != null ? `${def.cost} gp` : '';
    ch.inventory.push({
      name: qty > 1 ? `${def.name} (x${qty})` : String(def.name || 'Item'),
      value: cost,
      desc: truncate(stripHtml(def.description || '')),
    });
  }
  for (const it of data?.customItems || []) {
    const qty = Number(it?.quantity || 1);
    ch.inventory.push({
      name: qty > 1 ? `${it?.name} (x${qty})` : String(it?.name || 'Item'),
      value: '',
      desc: truncate(stripHtml(it?.description || '')),
    });
  }
  const cur = data?.currencies || {};
  const coins = ['pp', 'gp', 'ep', 'sp', 'cp']
    .filter(k => Number(cur[k] || 0) > 0)
    .map(k => `${cur[k]} ${k}`);
  if (coins.length) ch.inventory.push({ name: 'Coins', value: coins.join(', '), desc: '' });

  // Notes from traits + notes sections
  const noteLines: string[] = [];
  const traits = data?.traits || {};
  const traitLabels: Record<string, string> = {
    personalityTraits: 'Personality', ideals: 'Ideals', bonds: 'Bonds', flaws: 'Flaws', appearance: 'Appearance',
  };
  for (const k of Object.keys(traitLabels)) {
    if (traits[k]) noteLines.push(`${traitLabels[k]}: ${stripHtml(traits[k])}`);
  }
  const notes = data?.notes || {};
  const noteLabels: Record<string, string> = {
    allies: 'Allies', organizations: 'Organizations', enemies: 'Enemies', backstory: 'Backstory',
    personalPossessions: 'Possessions', otherHoldings: 'Holdings', otherNotes: 'Other',
  };
  for (const k of Object.keys(noteLabels)) {
    if (notes[k]) noteLines.push(`${noteLabels[k]}: ${stripHtml(notes[k])}`);
  }
  noteLines.push(`Imported from D&D Beyond (character ${data.id ?? 'unknown'}).`);
  ch.notes = noteLines.join('\n\n');

  warnings.push('AC, attack bonuses, and spell slots are best-effort — double-check anything with unusual features or magic items.');
  return { character: ch, warnings };
}
