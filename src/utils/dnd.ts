

export function mod(score:number){ return Math.floor((score-10)/2); }

const SKILLS: Record<string,string> = {
  Acrobatics: 'DEX', AnimalHandling: 'WIS', Arcana: 'INT', Athletics: 'STR',
  Deception: 'CHA', History: 'INT', Insight: 'WIS', Intimidation: 'CHA',
  Investigation: 'INT', Medicine: 'WIS', Nature: 'INT', Perception: 'WIS',
  Performance: 'CHA', Persuasion: 'CHA', Religion: 'INT', SleightOfHand: 'DEX',
  Stealth: 'DEX', Survival: 'WIS',
};

export function defaultCharacter() {
  return {
    name: '', class: '', level: 1, race: '', background: '', alignment: '',
    profBonus: 2,
    abilities: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    saves: [], skillsProficient: [],
    armorClass: 10, speed: 30, maxHP: 1, currentHP: 1, hitDice: '1d8',
    attacks: [], inventory: [], features: [], spells: []
  };
}

export function deriveStats(ch:any){
  const m:any = {};
  for (const k of ['STR','DEX','CON','INT','WIS','CHA']) m[k] = mod(ch.abilities?.[k] ?? 10);
  const skills:any = {};
  for (const [skill, abil] of Object.entries(SKILLS)) {
    const base = m[abil];
    const prof = (ch.skillsProficient||[]).includes(skill) ? (ch.profBonus||2) : 0;
    skills[skill] = base + prof;
  }
  return { ...ch, _derived: {
    mods: m,
    passivePerception: 10 + skills.Perception,
  }};
}

export function computeDerived(ch:any){ return deriveStats(ch)._derived; }

export function validateCharacter(ch:any){
  if (!ch.name) return 'Name is required';
  if (!ch.class) return 'Class is required';
  if (!ch.abilities) return 'Abilities missing';
  return null;
}

// tiny roller (supports NdM + k)
export function roll(expr:string){
  const m = expr.trim().match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (!m) return `Invalid: ${expr}`;
  const n = parseInt(m[1] || '1', 10), sides = parseInt(m[2],10), k = parseInt(m[3]||'0',10);
  let total = 0, rolls:number[] = [];
  for (let i=0;i<n;i++){ const r = 1 + Math.floor(Math.random()*sides); rolls.push(r); total += r; }
  total += k;
  return `${expr} → [${rolls.join(', ')}] ${k? (k>0?`+${k}`:k): ''} = ${total}`;
}

