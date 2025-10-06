// const FENCE_RE = /```(?:dnd|dndchar)\s*\n([\s\S]*?)\n```/m;

// /** Find the first fenced dnd block and return { yaml, start, end } or null */
// export function findDndBlock(body: string) {
//   const m = FENCE_RE.exec(body);
//   if (!m) return null;
//   const yaml = m[1];
//   return {
//     yaml,
//     start: m.index,
//     end: m.index + m[0].length,
//   };
// }

// /** Replace the fenced block if present, else insert one at top (below front matter if any) */
// export function upsertDndBlock(body: string, newYaml: string) {
//   const found = findDndBlock(body);
//   const block = `\`\`\`dnd\n${newYaml}\n\`\`\``;

//   if (found) {
//     return body.slice(0, found.start) + block + body.slice(found.end);
//   }

//   // Try to keep any YAML front-matter untouched (--- ... ---)
//   const fm = body.match(/^---\n[\s\S]*?\n---\n?/);
//   if (fm) {
//     const after = body.slice(fm[0].length);
//     return fm[0] + block + '\n\n' + after;
//   }

//   return block + '\n\n' + body;
// }
// src/utils/dndNote.ts

/** Normalise line endings of a string to the host style of `body`. */
function normaliseEol(text: string, body: string) {
  const hasCRLF = /\r\n/.test(body);
  const eol = hasCRLF ? '\r\n' : '\n';
  return text.replace(/\r\n?|\n/g, eol);
}

/** 
 * Find first fenced ```dnd or ```dndchar block.
 * Supports:
 *   - ```dnd
 *   - ``` dnd
 *   - ```dnd yaml   (extra tokens ignored)
 *   - CRLF or LF
 *   - closing fence with or without trailing newline
 */
export function findDndBlock(body: string): null | {
  yaml: string;
  start: number;      // index of opening backticks
  end: number;        // index AFTER the closing backticks (so body.slice(0,start)+…+body.slice(end))
  openFence: string;  // the exact opening fence text we matched
  closeFence: string; // the exact closing fence text we matched
} {
  // Opening fence at start of line
  const openRe = /(^|\r?\n)```[ \t]*(?:dnd|dndchar)\b[^\r\n]*\r?\n/gi;
  const mOpen = openRe.exec(body);
  if (!mOpen) return null;

  const openStart = mOpen.index + (mOpen[1] ? mOpen[1].length : 0);
  const yamlStart = openRe.lastIndex;
  const openFence = body.slice(openStart, yamlStart);

  // Closing fence must also be at start of line
  const closeRe = /\r?\n```[ \t]*\r?(?=\n|$)/g;
  closeRe.lastIndex = yamlStart;
  const mClose = closeRe.exec(body);
  if (!mClose) return null;

  const yamlEnd = mClose.index;               // right before \n```
  const closeFence = body.slice(mClose.index, closeRe.lastIndex);
  const end = closeRe.lastIndex;

  const yaml = body.slice(yamlStart, yamlEnd);
  return { yaml, start: openStart, end, openFence, closeFence };
}

/** Replace fenced block if present; else insert one (after front matter if any, else at top). */
export function upsertDndBlock(body: string, newYaml: string, lang: 'dnd'|'dndchar' = 'dnd') {
  // Keep YAML tidy for Joplin/CM: spaces not tabs; keep EOL style of current note.
  const cleanedYaml = normaliseEol(newYaml.replace(/\t/g, '  ').trim() + '\n', body);

  const found = findDndBlock(body);
  if (found) {
    const block = `${found.openFence}${cleanedYaml}${found.closeFence}`;
    return body.slice(0, found.start) + block + body.slice(found.end);
  }

  const hasCRLF = /\r\n/.test(body);
  const eol = hasCRLF ? '\r\n' : '\n';
  const open = `\`\`\`${lang}${eol}`;
  const close = `${eol}\`\`\``;
  const block = `${open}${cleanedYaml}${close}`;

  // Preserve YAML front matter if present
  const fm = body.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (fm) {
    const after = body.slice(fm[0].length);
    return fm[0] + block + eol + eol + after;
  }

  return block + eol + eol + body;
}

/** Convenience: read the YAML text of the block (or null). */
export function readDndYaml(body: string): string | null {
  const b = findDndBlock(body);
  return b ? b.yaml : null;
}


// Normalize what’s inside ```dnd fences to the panel’s schema,
// preserving fields like "name" and mapping common alternates.
export function normalizeYamlToCharacter(raw: any) {
  const out: any = {};

  // 1) passthroughs (keep user values)
  out.name = raw?.name ?? '';
  out.class = raw?.class ?? '';
  out.level = Number(raw?.level ?? 1);
  out.race = raw?.race ?? '';
  out.background = raw?.background ?? '';
  out.alignment = raw?.alignment ?? '';

  // 2) abilities (uppercase keys expected by panel)
  const abil = raw?.abilities || {};
  out.abilities = {
    STR: Number(abil.STR ?? abil.str ?? 10),
    DEX: Number(abil.DEX ?? abil.dex ?? 10),
    CON: Number(abil.CON ?? abil.con ?? 10),
    INT: Number(abil.INT ?? abil.int ?? 10),
    WIS: Number(abil.WIS ?? abil.wis ?? 10),
    CHA: Number(abil.CHA ?? abil.cha ?? 10),
  };

  // 3) AC / HP / speed
  out.armorClass = Number(raw?.armorClass ?? raw?.ac ?? 10);
  out.maxHP = Number(raw?.maxHP ?? raw?.maxHp ?? raw?.hpMax ?? 1);
  out.currentHP = Number(raw?.currentHP ?? raw?.hp ?? raw?.hpCurrent ?? out.maxHP);
  out.tempHP = Number(raw?.tempHP ?? 0);

  // If YAML used a number for speed (e.g. 30), keep a friendly string
  if (typeof raw?.speed === 'number') out.speed = `${raw.speed} ft`;
  else out.speed = raw?.speed ?? '30 ft';

  // Helpers
  const ABILS = ['STR','DEX','CON','INT','WIS','CHA'] as const;
  const ALL_SKILLS = [
    'Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight',
    'Intimidation','Investigation','Medicine','Nature','Perception','Performance',
    'Persuasion','Religion','Sleight of Hand','Stealth','Survival',
  ] as const;

  // 4) saving throw proficiencies
  // Accept either:
  //  - object form: {STR: true/false, ...}
  //  - array form: ['STR','DEX', ...]
  const rawSaves = raw?.savingThrowsProficiencies ?? raw?.saves ?? null;
  const savingObj: Record<typeof ABILS[number], boolean> = {
    STR: false, DEX: false, CON: false, INT: false, WIS: false, CHA: false,
  };

  if (Array.isArray(rawSaves)) {
    for (const a of ABILS) savingObj[a] = rawSaves.includes(a);
  } else if (rawSaves && typeof rawSaves === 'object') {
    for (const a of ABILS) {
      const v = (rawSaves as any)[a] ?? (rawSaves as any)[a.toLowerCase()];
      savingObj[a] = Boolean(v);
    }
  }
  out.savingThrowsProficiencies = savingObj;

  // 5) skills: accept either
  //  - object form: { Arcana: 'expert' | 'prof' | 'none' | boolean | number }
  //  - array form: ['Arcana', ...] meaning 'prof'
  // Normalize values to 'none' | 'prof' | 'expert'
  const normalizeSkillLevel = (v: any): 'none' | 'prof' | 'expert' => {
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (['expert','expertise','exp','x','2'].includes(s)) return 'expert';
      if (['prof','proficient','p','1','true','yes','y','t'].includes(s)) return 'prof';
      return 'none';
    }
    if (v === true) return 'prof';
    if (v === false || v == null) return 'none';
    if (typeof v === 'number') {
      if (v >= 2) return 'expert';
      if (v >= 1) return 'prof';
      return 'none';
    }
    return 'none';
  };

  const rawSkills = raw?.skillsProficiencies ?? raw?.skills ?? null;
  const skillMap: Record<(typeof ALL_SKILLS)[number], 'none'|'prof'|'expert'> = {} as any;
  for (const sk of ALL_SKILLS) skillMap[sk] = 'none';

  if (Array.isArray(rawSkills)) {
    // array means all listed skills are 'prof'
    for (const sk of rawSkills) {
      if (sk in skillMap) skillMap[sk as (typeof ALL_SKILLS)[number]] = 'prof';
    }
  } else if (rawSkills && typeof rawSkills === 'object') {
    for (const sk of ALL_SKILLS) {
      const v = (rawSkills as any)[sk];
      if (v !== undefined) skillMap[sk] = normalizeSkillLevel(v);
    }
  }
  out.skillsProficiencies = skillMap;

  // 6) other optional fields
  out.attacks = Array.isArray(raw?.attacks) ? raw.attacks : [];
  out.notes = raw?.notes ?? '';

  // 7) inventory and spells
  out.inventory = Array.isArray(raw?.inventory) ? raw.inventory : [];
  out.spells = Array.isArray(raw?.spells) ? raw.spells : [];

  // ignore profBonus from YAML — the panel computes proficiency from level
  return out;
}
