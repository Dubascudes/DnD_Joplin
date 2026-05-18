
export function mod(score: number) { return Math.floor((score - 10) / 2); }

// Keep ability and skill naming aligned with renderer.js
const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
const SKILL_TO_ABILITY: Record<string, typeof ABILITIES[number]> = {
  'Acrobatics': 'DEX',
  'Animal Handling': 'WIS',
  'Arcana': 'INT',
  'Athletics': 'STR',
  'Deception': 'CHA',
  'History': 'INT',
  'Insight': 'WIS',
  'Intimidation': 'CHA',
  'Investigation': 'INT',
  'Medicine': 'WIS',
  'Nature': 'INT',
  'Perception': 'WIS',
  'Performance': 'CHA',
  'Persuasion': 'CHA',
  'Religion': 'INT',
  'Sleight of Hand': 'DEX',
  'Stealth': 'DEX',
  'Survival': 'WIS',
};
const SKILLS = Object.keys(SKILL_TO_ABILITY);

function completeAbilities(partial: any) {
  const base = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
  return {
    STR: partial?.STR ?? base.STR,
    DEX: partial?.DEX ?? base.DEX,
    CON: partial?.CON ?? base.CON,
    INT: partial?.INT ?? base.INT,
    WIS: partial?.WIS ?? base.WIS,
    CHA: partial?.CHA ?? base.CHA,
  };
}

function completeSkills(partial: Record<string, 'none'|'prof'|'expert'>) {
  const out: Record<string, 'none'|'prof'|'expert'> = {} as any;
  for (const sk of SKILLS) out[sk] = (partial?.[sk] ?? 'none') as any;
  return out;
}

export function defaultCharacter() {
  const baseSkills = SKILLS.reduce((a: any, s: string) => (a[s] = 'none', a), {} as Record<string, 'none'|'prof'|'expert'>);
  return {
    name: '',
    class: '',
    level: 1,
    race: '',
    background: '',
    alignment: '',
    abilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    armorClass: 10,
    maxHP: 1,
    currentHP: 1,
    tempHP: 0,
    speed: '30 ft',
    savingThrowsProficiencies: {},
    skillsProficiencies: baseSkills,
    attacks: [],
    spells: [],
    inventory: [],
    notes: '',
    journal: [],
    spellcasting: {
      ability: 'NA',
      miscSaveDC: 0,
      miscAttackMod: 0,
      cantripsKnown: 0,
      preparedSpells: 0,
      slots: {
        1: { total: 0, used: 0 }, 2: { total: 0, used: 0 }, 3: { total: 0, used: 0 },
        4: { total: 0, used: 0 }, 5: { total: 0, used: 0 }, 6: { total: 0, used: 0 },
        7: { total: 0, used: 0 }, 8: { total: 0, used: 0 }, 9: { total: 0, used: 0 },
      },
    },
  };
}

function proficiencyFromLevel(level: number) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

export function computeDerived(ch: any) {
  const abilities = completeAbilities(ch?.abilities || {});
  const mods = ABILITIES.reduce((acc: any, a) => { acc[a] = mod(abilities[a]); return acc; }, {} as any);
  const pb = proficiencyFromLevel(ch?.level || 1);

  const savingThrows = ABILITIES.reduce((acc: any, a) => {
    const base = mods[a];
    const add = ch?.savingThrowsProficiencies?.[a] ? pb : 0;
    acc[a] = base + add;
    return acc;
  }, {} as any);

  const skills = SKILLS.reduce((acc: any, sk) => {
    const abil = SKILL_TO_ABILITY[sk];
    const base = mods[abil];
    const prof = (ch?.skillsProficiencies?.[sk] || 'none') as 'none'|'prof'|'expert';
    const add = prof === 'prof' ? pb : (prof === 'expert' ? pb * 2 : 0);
    acc[sk] = base + add;
    return acc;
  }, {} as any);

  // Spellcasting derived
  const sc = ch?.spellcasting || {};
  const spellAbility = (sc.ability && (ABILITIES as readonly string[]).includes(sc.ability)) ? sc.ability : 'INT';
  const spellMod = mods[spellAbility];
  const spellSaveDC = 8 + spellMod + pb + (sc.miscSaveDC || 0);
  const spellAtkMod = spellMod + pb + (sc.miscAttackMod || 0);

  const passivePerception = 10 + (skills['Perception'] || 0);
  const initiative = mods.DEX;

  return { mods, proficiencyBonus: pb, skills, savingThrows, passivePerception, initiative,
           spellSaveDC, spellAtkMod, spellAbility };
}

// Back-compat: keep a deriveStats that returns object holding `_derived`
export function deriveStats(ch: any) { return { ...ch, _derived: computeDerived(ch) }; }

export function validateCharacter(ch: any) {
  if (!ch?.name) return 'Name is required';
  if (!ch?.class) return 'Class is required';
  if (!ch?.abilities) return 'Abilities missing';
  return null;
}

// tiny roller (supports NdM + k)
export function roll(expr: string) {
  const m = expr.trim().match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (!m) return `Invalid: ${expr}`;
  const n = parseInt(m[1] || '1', 10), sides = parseInt(m[2], 10), k = parseInt(m[3] || '0', 10);
  let total = 0, rolls: number[] = [];
  for (let i = 0; i < n; i++) { const r = 1 + Math.floor(Math.random() * sides); rolls.push(r); total += r; }
  total += k;
  return `${expr} → [${rolls.join(', ')}] ${k ? (k > 0 ? `+${k}` : k) : ''} = ${total}`;
}

