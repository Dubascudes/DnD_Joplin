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

  // 4) save proficiencies: YAML has "saves: []"
  const savesArr: string[] = Array.isArray(raw?.saves) ? raw.saves : [];
  out.savingThrowsProficiencies = {
    STR: savesArr.includes('STR'),
    DEX: savesArr.includes('DEX'),
    CON: savesArr.includes('CON'),
    INT: savesArr.includes('INT'),
    WIS: savesArr.includes('WIS'),
    CHA: savesArr.includes('CHA'),
  };

  // 5) skills: YAML has "skillsProficient: []"
  const profSk: string[] = Array.isArray(raw?.skillsProficient) ? raw.skillsProficient : [];
  // panel expects a dict with 'none' | 'prof' | 'expert'
  const skillMap: Record<string,'none'|'prof'|'expert'> = {};
  // add all skills so UI totals aren’t NaN
  const ALL_SKILLS = [
    'Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight',
    'Intimidation','Investigation','Medicine','Nature','Perception','Performance',
    'Persuasion','Religion','Sleight of Hand','Stealth','Survival',
  ];
  for (const sk of ALL_SKILLS) skillMap[sk] = 'none';
  for (const sk of profSk) if (skillMap.hasOwnProperty(sk)) skillMap[sk] = 'prof';
  out.skillsProficiencies = skillMap;

  // 6) other optional fields
  out.attacks = Array.isArray(raw?.attacks) ? raw.attacks : [];
  out.notes = raw?.notes ?? '';

  // ignore profBonus from YAML — the panel computes proficiency from level

  return out;
}
