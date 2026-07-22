import joplin from 'api';
import { ToolbarButtonLocation, SettingItemType, MenuItemLocation } from 'api/types';
// import { parseFrontMatter, writeFrontMatter } from './utils/yaml';
import { deriveStats, defaultCharacter, computeDerived, roll } from './utils/dnd';
import {
  findDndBlock, upsertDndBlock, normalizeYamlToCharacter, readDndYaml,
  findDndJournalBlock, upsertDndJournalBlock, normalizeJournalEntry,
} from './utils/dndNote'; // helpers above
import { parseFrontMatter, writeFrontMatter, parse as parseYaml, stringify as yamlStringify } from './utils/yaml';
import { parseDdbCharacterInput, ddbCharacterUrl, convertDdbToCharacter } from './utils/ddbImport';


let panelReady = false;
let mutatingSince = 0;           // guard around our own writes
const MUTATION_GRACE_MS = 600;   // tweak as you like (Joplin autosave is fast but not instant)


function now() { return Date.now(); }
function withinMutationGrace() { return (now() - mutatingSince) < MUTATION_GRACE_MS; }
function markMutating() { mutatingSince = now(); }

// Fetch the FRESHEST body for the currently selected note
async function getFreshActiveNoteBody(): Promise<{ id: string; body: string } | null> {
  const note = await joplin.workspace.selectedNote();
  if (!note?.id) return null;
  const fresh = await joplin.data.get(['notes', note.id], { fields: ['id', 'body'] });
  return { id: fresh.id, body: String(fresh.body ?? '') };
}

async function readCharacterFromFresh(): Promise<{ character: any | null, hasBlock: boolean }> {
  const fresh = await getFreshActiveNoteBody();
  if (!fresh) return { character: null, hasBlock: false };

  const blk = findDndBlock(fresh.body);
  if (blk) {
    try {

      const obj = parseYaml(blk.yaml);
	  const normalized = normalizeYamlToCharacter(obj);
      return { character: normalized, hasBlock: true };
    } catch (e) {
      console.warn('[dnd] YAML parse error:', e);
      return { character: null, hasBlock: true }; // block exists but broken
    }
  }

  // (Optional) also allow front-matter dnd:
  const { front } = parseFrontMatter(fresh.body);
  if (front?.dnd) return { character: normalizeYamlToCharacter(front.dnd), hasBlock: true };
  
  return { character: null, hasBlock: false };
}

async function getActiveNote() {
  const note = await joplin.workspace.selectedNote();
  if (!note) throw new Error('No active note');
  return note;
}

function hasCharacterInBody(body: string): boolean {
  // Prefer fenced block like Life Calendar:
  if (findDndBlock(body)) return true;

  // Optional: also accept front-matter dnd:
  const { front } = parseFrontMatter(body);
  return !!front?.dnd;
}

async function readCharacter(noteBody: string) {
  const blk = findDndBlock(noteBody);
  if (blk) {
    try {
      const obj = parseYaml(blk.yaml);
	  const normalized = normalizeYamlToCharacter(obj);
      return normalized;
    } catch (e) {
      console.warn('[dnd] YAML parse error:', e);
    }
  }
  const { front } = parseFrontMatter(noteBody);
  if (front?.dnd) return normalizeYamlToCharacter(front.dnd);
  return null;
}

async function saveCharacterToCurrentNote(character: any): Promise<string> {
  const fresh = await getFreshActiveNoteBody();
  if (!fresh) throw new Error('No active note');

  const yaml = yamlStringify(character).replace(/\t/g, '  ');
  const updatedBody = upsertDndBlock(fresh.body, yaml);

  if (updatedBody === fresh.body) return fresh.body;

  markMutating();
  await joplin.data.put(['notes', fresh.id], null, { body: updatedBody });

  // (Optional) reflect immediately in the visible editor
  await joplin.commands.execute('editor.setText', updatedBody);

  return updatedBody;
}

async function loadCharacterFromNoteFresh() {
  const fresh = await getFreshActiveNoteBody();
  if (!fresh) throw new Error('No active note');

  const yamlText = readDndYaml(fresh.body);
  if (!yamlText) throw new Error('No ```dnd block found in active note');

  const raw = parseYaml(yamlText);
  const character = normalizeYamlToCharacter(raw);
  const derived = computeDerived(character);
  return { noteId: fresh.id, character, derived };
}

// ---------- Character Journal (notebook of journal-entry notes) ----------
const JOURNAL_FOLDER_TITLE = 'Character Journal';

async function pagedGet(path: string[], query: any): Promise<any[]> {
  const items: any[] = [];
  let page = 1;
  for (;;) {
    const res = await joplin.data.get(path, { ...query, page });
    items.push(...(res.items || []));
    if (!res.has_more) break;
    page++;
  }
  return items;
}

// The character sheet's folder is treated as the character/campaign folder;
// journal entries live in a "Character Journal" notebook inside it.
async function getCharacterFolderId(): Promise<string> {
  const note = await joplin.workspace.selectedNote();
  if (!note?.id) throw new Error('No active note');
  const full = await joplin.data.get(['notes', note.id], { fields: ['id', 'parent_id'] });
  return full.parent_id;
}

async function findJournalFolderId(create: boolean): Promise<string | null> {
  const parentId = await getCharacterFolderId();
  const folders = await pagedGet(['folders'], { fields: ['id', 'title', 'parent_id'] });
  // If the selected note is itself a journal entry, its parent IS the journal folder.
  const self = folders.find(f => f.id === parentId);
  if (self && self.title === JOURNAL_FOLDER_TITLE) return self.id;
  const existing = folders.find(f => f.parent_id === parentId && f.title === JOURNAL_FOLDER_TITLE);
  if (existing) return existing.id;
  if (!create) return null;
  const created = await joplin.data.post(['folders'], null, { title: JOURNAL_FOLDER_TITLE, parent_id: parentId });
  return created.id;
}

async function listJournalEntries(): Promise<any[]> {
  const folderId = await findJournalFolderId(false);
  if (!folderId) return [];
  const notes = await pagedGet(['folders', folderId, 'notes'], { fields: ['id', 'title', 'body', 'updated_time'] });
  const out: any[] = [];
  for (const n of notes) {
    const blk = findDndJournalBlock(String(n.body || ''));
    const entry = blk ? normalizeJournalEntry(parseYaml(blk.yaml)) : null;
    out.push({ id: n.id, title: n.title, date: entry?.date || '', updated: n.updated_time });
  }
  out.sort((a, b) => (b.updated || 0) - (a.updated || 0));
  return out;
}

function nextSessionNumber(titles: string[]): number {
  let maxN = 0;
  for (const t of titles) {
    const m = /^Session (\d+)/.exec(String(t || ''));
    if (m) maxN = Math.max(maxN, parseInt(m[1], 10));
  }
  return maxN + 1;
}

async function createJournalEntry(entry: any): Promise<{ id: string; title: string }> {
  const folderId = await findJournalFolderId(true);
  const e = normalizeJournalEntry(entry || {});
  if (!e.date) e.date = new Date().toISOString().slice(0, 10);
  if (!e.title) {
    const existing = await listJournalEntries();
    e.title = `Session ${nextSessionNumber(existing.map(x => x.title))} - ${e.date}`;
  }
  const body = upsertDndJournalBlock('', yamlStringify(e));
  const note = await joplin.data.post(['notes'], null, { title: e.title, body, parent_id: folderId });
  return { id: note.id, title: e.title };
}

async function saveJournalEntry(noteId: string, entry: any): Promise<void> {
  const e = normalizeJournalEntry(entry || {});
  const fresh = await joplin.data.get(['notes', noteId], { fields: ['id', 'body'] });
  const body = upsertDndJournalBlock(String(fresh.body || ''), yamlStringify(e));
  markMutating();
  await joplin.data.put(['notes', noteId], null, { title: e.title || 'Journal Entry', body });
}

// What should the panel display for the current note?
async function loadActivePayload(): Promise<any | null> {
  const fresh = await getFreshActiveNoteBody();
  if (!fresh) return null;

  const blk = findDndBlock(fresh.body);
  const front = blk ? null : parseFrontMatter(fresh.body).front;
  if (blk || front?.dnd) {
    const raw = blk ? parseYaml(blk.yaml) : front.dnd;
    const character = normalizeYamlToCharacter(raw);
    const derived = computeDerived(character);
    return { type: 'data', noteId: fresh.id, character, derived };
  }

  const jb = findDndJournalBlock(fresh.body);
  if (jb) {
    return { type: 'journalData', noteId: fresh.id, entry: normalizeJournalEntry(parseYaml(jb.yaml)) };
  }
  return null;
}

// ---------- Character Creation Wizard ----------
function pbCost(score: number): number {
  // Standard 27-point buy 5e: scores 8..15 cost {0,1,2,3,4,5,7,9}
  const table: Record<number, number> = { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 };
  return table[Math.max(8, Math.min(15, Math.floor(score)))] ?? 9;
}

// Local SRD datasets (bundled JSON)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CLASSES: any[] = require('./dnd-resources/5e-SRD-Classes.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BACKGROUNDS: any[] = require('./dnd-resources/5e-SRD-Backgrounds.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ALIGNMENTS: any[] = require('./dnd-resources/5e-SRD-Alignments.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RACES: any[] = require('./dnd-resources/5e-SRD-Races.json');

const dialogHandles: Record<string, string> = {};
async function promptDialog(id: string, title: string, html: string, buttons: any) {
  // Joplin view ids must be unique per plugin lifetime — reuse handles on repeat runs.
  const d = dialogHandles[id] || (dialogHandles[id] = await joplin.views.dialogs.create(id));
  await joplin.views.dialogs.setHtml(d, `<div style="font: 14px system-ui; min-width: 420px;">${html}</div>`);
  await joplin.views.dialogs.setButtons(d, buttons);
  const res = await joplin.views.dialogs.open(d);
  return res;
}

function escapeHtml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------- D&D Beyond import ----------
async function fetchDdbCharacter(id: string): Promise<any> {
  const f: any = (globalThis as any).fetch;
  if (typeof f !== 'function') {
    throw new Error('fetch is not available in this Joplin version — paste the character JSON instead.');
  }
  const resp = await f(ddbCharacterUrl(id), {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Joplin DnD Character Plugin)' },
  });
  if (resp.status === 403) {
    throw new Error(
      'D&D Beyond refused access to this character (HTTP 403). ' +
      'Its privacy must be set to Public: open the character on dndbeyond.com → Edit → Home → Character Privacy → Public.');
  }
  if (resp.status === 404) throw new Error(`No D&D Beyond character found with id ${id}.`);
  if (!resp.ok) throw new Error(`D&D Beyond request failed (HTTP ${resp.status}).`);
  return await resp.json();
}

// Re-fetch a previously imported character and refresh the current note's dnd block,
// preserving local-only content (journal, notes, expended slots, action flags).
async function resyncCharacterFromDdb(): Promise<any> {
  const { character: current } = await readCharacterFromFresh();
  if (!current) throw new Error('No character found in the active note.');
  if (current.ddbId == null) {
    throw new Error('This character has no D&D Beyond link (ddbId). Only characters imported from D&D Beyond can be re-synced.');
  }

  const payload = await fetchDdbCharacter(String(current.ddbId));
  const { character: fresh } = convertDdbToCharacter(payload);

  // Preserve locally-authored content.
  fresh.journal = Array.isArray(current.journal) ? current.journal : [];
  if (current.notes) fresh.notes = current.notes;

  // Preserve expended spell slots, clamped to the new totals.
  for (let i = 1; i <= 9; i++) {
    const used = Number(current.spellcasting?.slots?.[i]?.used ?? 0);
    const total = Number(fresh.spellcasting?.slots?.[i]?.total ?? 0);
    fresh.spellcasting.slots[i].used = Math.min(used, total);
  }

  // Preserve "show in Actions" flags (and manual combat stats on items), matched by name.
  const byName = (arr: any[]) => {
    const map: Record<string, any> = {};
    for (const x of arr || []) if (x?.name) map[String(x.name).toLowerCase()] = x;
    return map;
  };
  const oldSpells = byName(current.spells);
  for (const sp of fresh.spells || []) {
    if (oldSpells[String(sp?.name || '').toLowerCase()]?.action) sp.action = true;
  }
  const oldItems = byName(current.inventory);
  for (const it of fresh.inventory || []) {
    const old = oldItems[String(it?.name || '').toLowerCase()];
    if (!old) continue;
    if (old.action) it.action = true;
    for (const f of ['range', 'hitDc', 'damage', 'notes']) {
      if (old[f] != null && old[f] !== '') it[f] = old[f];
    }
  }
  // Features: preserve manual action un-flagging is not tracked; just carry
  // over custom combat stats the user added, matched by name.
  const oldFeatures = byName(current.features);
  for (const ft of fresh.features || []) {
    const old = oldFeatures[String(ft?.name || '').toLowerCase()];
    if (!old) continue;
    if (old.action) ft.action = true;
    for (const f of ['range', 'hitDc', 'damage']) {
      if ((ft[f] == null || ft[f] === '') && old[f] != null && old[f] !== '') ft[f] = old[f];
    }
  }

  await saveCharacterToCurrentNote(fresh);
  return fresh;
}

async function runDdbImport() {
  const res = await promptDialog('dnd-ddb-import', 'Import from D&D Beyond', `
    <h3 style="margin-top:0">Import from D&D Beyond</h3>
    <form name="f" style="display:grid; gap:10px;">
      <label>Character URL or ID<br>
        <input name="url" type="text" style="width:100%" placeholder="https://www.dndbeyond.com/characters/12345678"/>
      </label>
      <label>…or paste character JSON (from character-service.dndbeyond.com)<br>
        <textarea name="json" rows="5" style="width:100%"></textarea>
      </label>
      <div style="color:#666; font-size:12px;">
        The character's privacy must be set to <b>Public</b> on D&D Beyond
        (open the character &rarr; Edit &rarr; Home &rarr; Character Privacy).
      </div>
    </form>
  `, [{ id: 'ok', title: 'Import' }, { id: 'cancel', title: 'Cancel' }]);

  if (res?.id !== 'ok') return;
  const form = res?.formData?.f || {};

  try {
    let payload: any;
    const pastedJson = String(form.json || '').trim();
    if (pastedJson) {
      payload = JSON.parse(pastedJson);
    } else {
      const id = parseDdbCharacterInput(String(form.url || ''));
      if (!id) throw new Error('Enter a D&D Beyond character URL (dndbeyond.com/characters/…) or a numeric character id.');
      payload = await fetchDdbCharacter(id);
    }

    const { character, warnings } = convertDdbToCharacter(payload);

    const folder = await joplin.workspace.selectedFolder();
    const yaml = yamlStringify(character).replace(/\t/g, '  ');
    const body = upsertDndBlock('', yaml);
    const note = await joplin.data.post(['notes'], null, {
      title: character.name || 'Imported Character',
      body,
      parent_id: folder?.id,
    });
    try { await joplin.commands.execute('openNote', note.id); } catch { /* note is still created */ }

    await promptDialog('dnd-ddb-import-done', 'Import complete', `
      <h3 style="margin-top:0">Imported "${escapeHtml(character.name)}"</h3>
      <p>A new note was created with the character sheet.</p>
      ${warnings.length ? `<ul>${warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>` : ''}
    `, [{ id: 'ok', title: 'OK' }]);
  } catch (e: any) {
    await promptDialog('dnd-ddb-import-err', 'Import failed', `
      <h3 style="margin-top:0">Import failed</h3>
      <p>${escapeHtml(String(e?.message || e))}</p>
    `, [{ id: 'ok', title: 'OK' }]);
  }
}

async function openCharacterCreationWizard() {
  const dialogs = joplin.views.dialogs;

  // 1) Name
  let name = '';
  {
    const res = await promptDialog('dnd-cc-name', 'Character Name', `
      <form name="f">
        <label>Name<br><input name="name" type="text" style="width:100%" required/></label>
      </form>
    `, [{id:'ok', title:'Next'}]);
    name = res?.formData?.f?.name || '';
  }

  // 2) Class
  let cls: any = null;
  {
    const opts = CLASSES.map(c => `<option value="${c.index}">${c.name}</option>`).join('');
    const res = await promptDialog('dnd-cc-class', 'Choose Class', `
      <form name="f"><label>Class<br>
        <select name="klass" style="width:100%">${opts}</select>
      </label></form>
    `, [{id:'ok', title:'Next'}]);
    const idx = res?.formData?.f?.klass;
    cls = CLASSES.find(c => c.index === idx) || CLASSES[0];
  }

  // 3) Background + Alignment
  let background: any = null; let alignment: any = null;
  {
    const bgOpts = BACKGROUNDS.map(b => `<option value="${b.index}">${b.name}</option>`).join('');
    const alOpts = ALIGNMENTS.map(a => `<option value="${a.index}">${a.name}</option>`).join('');
    const res = await promptDialog('dnd-cc-bg-align', 'Background and Alignment', `
      <form name="f" style="display:grid; gap:10px;">
        <label>Background<br><select name="bg" style="width:100%">${bgOpts}</select></label>
        <label>Alignment<br><select name="al" style="width:100%">${alOpts}</select></label>
      </form>
    `, [{id:'ok', title:'Next'}]);
    background = BACKGROUNDS.find(b => b.index === (res?.formData?.f?.bg)) || BACKGROUNDS[0];
    alignment = ALIGNMENTS.find(a => a.index === (res?.formData?.f?.al)) || ALIGNMENTS[0];
  }

  // 4) Species (Race)
  let race: any = null;
  {
    const rcOpts = RACES.map(r => `<option value="${r.index}">${r.name}</option>`).join('');
    const res = await promptDialog('dnd-cc-race', 'Choose Species', `
      <form name="f"><label>Species<br>
        <select name="race" style="width:100%">${rcOpts}</select>
      </label></form>
    `, [{id:'ok', title:'Next'}]);
    const idx = res?.formData?.f?.race;
    race = RACES.find(r => r.index === idx) || RACES[0];
  }

  // 5) Ability scores: method
  let abilities = { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 };
  {
    const res = await promptDialog('dnd-cc-abil-method', 'Ability Scores', `
      <form name="f" style="display:grid; gap:10px;">
        <label><input type="radio" name="m" value="roll" checked/> Roll (4d6 drop lowest)</label>
        <label><input type="radio" name="m" value="point"/> Point Buy (27)</label>
      </form>
    `, [{id:'ok', title:'Next'}]);
    const m = res?.formData?.f?.m || 'roll';
    if (m === 'roll') {
      function roll4d6dl() { const r = [0,0,0,0].map(()=>1+Math.floor(Math.random()*6)); r.sort((a,b)=>a-b); return r[1]+r[2]+r[3]; }
      const arr = [roll4d6dl(), roll4d6dl(), roll4d6dl(), roll4d6dl(), roll4d6dl(), roll4d6dl()].sort((a,b)=>b-a);
      // Assign in common order: STR, DEX, CON, INT, WIS, CHA
      abilities = { STR: arr[0], DEX: arr[1], CON: arr[2], INT: arr[3], WIS: arr[4], CHA: arr[5] };
    } else {
      // point buy inputs
      const res2 = await promptDialog('dnd-cc-abil-point', 'Point Buy (27)', `
        <form name="f" class="grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
          <label>STR<input type="number" name="STR" min="8" max="15" value="15"/></label>
          <label>DEX<input type="number" name="DEX" min="8" max="15" value="14"/></label>
          <label>CON<input type="number" name="CON" min="8" max="15" value="13"/></label>
          <label>INT<input type="number" name="INT" min="8" max="15" value="12"/></label>
          <label>WIS<input type="number" name="WIS" min="8" max="15" value="10"/></label>
          <label>CHA<input type="number" name="CHA" min="8" max="15" value="8"/></label>
          <div style="grid-column:1/-1;color:#666;">Ensure total cost ≤ 27</div>
        </form>
      `, [{id:'ok', title:'Next'}]);
      const f = res2?.formData?.f || {};
      const cand = { STR:Number(f.STR||15), DEX:Number(f.DEX||14), CON:Number(f.CON||13), INT:Number(f.INT||12), WIS:Number(f.WIS||10), CHA:Number(f.CHA||8) };
      const cost = Object.values(cand).reduce((a,v)=>a+pbCost(v),0) - 6*pbCost(8);
      if (cost > 27) {
        await promptDialog('dnd-cc-abil-err', 'Point Buy Error', `<div>Point buy exceeds 27 (got ${cost}). Try again.</div>`, [{id:'ok', title:'OK'}]);
        return await openCharacterCreationWizard();
      }
      abilities = cand as any;
    }
  }

  // 6) Starting equipment from class (optional)
  const inventory: any[] = [];
  try {
    const se = cls?.starting_equipment || [];
    for (const it of se) {
      if (it?.equipment?.name) inventory.push({ name: it.equipment.name, value: '', desc: '' });
    }
  } catch {}

  // Compose character
  const ch0 = defaultCharacter();
  const character: any = { ...ch0 };
  character.name = name || '';
  character.class = cls?.name || '';
  character.level = 1;
  character.race = race?.name || '';
  character.background = background?.name || '';
  character.alignment = alignment?.name || '';
  character.abilities = abilities;
  const spd = typeof race?.speed === 'number' ? `${race.speed} ft` : (race?.speed?.walk ? `${race.speed.walk} ft` : ch0.speed);
  character.speed = spd;
  // saving throw profs from class
  const saves = (cls?.saving_throws || []).map((s:any)=>String(s?.index||'').toUpperCase());
  character.savingThrowsProficiencies = { STR: saves.includes('STR'), DEX: saves.includes('DEX'), CON: saves.includes('CON'), INT: saves.includes('INT'), WIS: saves.includes('WIS'), CHA: saves.includes('CHA') };
  // inventory
  character.inventory = inventory;

  return character;
}

joplin.plugins.register({
  onStart: async () => {
    // ---- Settings ----
    await joplin.settings.registerSection('dndCharacterSheet', {
      label: 'D&D Character Sheet',
      iconName: 'fas fa-dragon',
    });

    await joplin.settings.registerSettings({
      'dnd.theme': {
        section: 'dndCharacterSheet',
        type: SettingItemType.String,
        public: true,
        label: 'Color Theme',
        value: 'light',
        isEnum: true,
        options: {
          'light': 'Light (Default)',
          'dark': 'Dark',
          'parchment': 'Parchment / Tan',
          'darkDungeon': 'Dark Dungeon',
          'forest': 'Forest Green',
          'royal': 'Royal Purple',
        },
        description: 'Choose the color scheme for the character sheet panel.',
      },
    });

    const panel = await joplin.views.panels.create('dnd-editor');
    await joplin.views.panels.setHtml(panel, '<div id="root"> Test </div>');
    await joplin.views.panels.addScript(panel, 'utils/renderer.js');

    await joplin.views.panels.hide(panel);

    let panelReady = false;
    const pending: any[] = [];
    const sendToPanel = async (msg: any) => {
      if (!panelReady) { pending.push(msg); return; }
      await joplin.views.panels.postMessage(panel, msg);
    };

    async function pushThemeToPanel() {
      const theme = await joplin.settings.value('dnd.theme');
      await sendToPanel({ type: 'theme', theme: theme || 'light' });
    }

    await joplin.settings.onChange(async () => {
      await pushThemeToPanel();
    });

	await joplin.views.panels.onMessage(panel, async (msg) => {
	try {
		if (msg.type === 'ready') {
		panelReady = true;
		while (pending.length) await joplin.views.panels.postMessage(panel, pending.shift());
	      // Immediately load from the current note on first ready.
	      const payload = await loadActivePayload();
	      if (payload) await joplin.views.panels.postMessage(panel, payload);
		  await pushThemeToPanel();
		return;
		}


		if (msg.type === 'load') {
			try {
				const payload = await loadActivePayload();
				if (payload) await joplin.views.panels.postMessage(panel, payload);
			} catch (e) {
				await joplin.views.panels.postMessage(panel, { type: 'error', message: String(e) });
			}
			return;
		}

		if (msg.type === 'journalList') {
			try {
				const entries = await listJournalEntries();
				await joplin.views.panels.postMessage(panel, { type: 'journalListData', entries });
			} catch (e: any) {
				await joplin.views.panels.postMessage(panel, { type: 'journalListData', entries: [] });
			}
			return;
		}

		if (msg.type === 'journalCreate') {
			try {
				const created = await createJournalEntry(msg.entry);
				await joplin.views.panels.postMessage(panel, { type: 'journalCreated', id: created.id, title: created.title });
				const entries = await listJournalEntries();
				await joplin.views.panels.postMessage(panel, { type: 'journalListData', entries });
				if (msg.open) { try { await joplin.commands.execute('openNote', created.id); } catch {} }
			} catch (e: any) {
				await joplin.views.panels.postMessage(panel, { type: 'error', message: 'Journal: ' + String(e?.message || e) });
			}
			return;
		}

		if (msg.type === 'journalOpen') {
			try { await joplin.commands.execute('openNote', msg.id); } catch {}
			return;
		}

		if (msg.type === 'journalSave') {
			try {
				await saveJournalEntry(msg.noteId, msg.entry);
				await joplin.views.panels.postMessage(panel, { type: 'journalSaved' });
			} catch (e: any) {
				await joplin.views.panels.postMessage(panel, { type: 'error', message: 'Journal: ' + String(e?.message || e) });
			}
			return;
		}

		if (msg.type === 'journalMigrate') {
			try {
				const entries = Array.isArray(msg.entries) ? msg.entries : [];
				for (const e of entries) await createJournalEntry(e);
				await joplin.views.panels.postMessage(panel, { type: 'journalMigrated', count: entries.length });
				const list = await listJournalEntries();
				await joplin.views.panels.postMessage(panel, { type: 'journalListData', entries: list });
			} catch (e: any) {
				await joplin.views.panels.postMessage(panel, { type: 'error', message: 'Journal: ' + String(e?.message || e) });
			}
			return;
		}
		if (msg.type === 'save') {
		const note = await getActiveNote();
		const updatedBody = await saveCharacterToCurrentNote(msg.character);
		const blk = findDndBlock(updatedBody);
		const raw = blk ? parseYaml(blk.yaml) : msg.character;
		const c = normalizeYamlToCharacter(raw);
		const derived = computeDerived(c);
		await joplin.views.panels.postMessage(panel, { type: 'data', noteId: note.id, character: c, derived });
		await joplin.views.panels.postMessage(panel, { type: 'saved' });
		return;
		}


		if (msg.type === 'ddbSync') {
			try {
				const fresh = await resyncCharacterFromDdb();
				const note = await joplin.workspace.selectedNote();
				const c = normalizeYamlToCharacter(fresh);
				const derived = computeDerived(c);
				await joplin.views.panels.postMessage(panel, { type: 'data', noteId: note?.id, character: c, derived });
				await joplin.views.panels.postMessage(panel, { type: 'synced' });
			} catch (e: any) {
				await joplin.views.panels.postMessage(panel, { type: 'error', message: String(e?.message || e) });
			}
			return;
		}

		if (msg.type === 'roll') {
		const result = roll(msg.expr);
		const totalMatch = result.match(/=\s*(-?\d+)\s*$/);
		const total = totalMatch ? parseInt(totalMatch[1], 10) : null;
		await joplin.views.panels.postMessage(panel, { type: 'rollResult', result, total, expr: msg.expr });
		return;
		}
	} catch (e) {
		await joplin.views.panels.postMessage(panel, { type: 'error', message: String(e) });
	}
	});


    const refreshPanelVisibility = async () => {
      const note = await joplin.workspace.selectedNote();
      if (!note) { await joplin.views.panels.hide(panel); return; }
      const visible = hasCharacterInBody(note.body) || !!findDndJournalBlock(note.body);
      if (visible) {
        await joplin.views.panels.show(panel);
        await sendToPanel({ type: 'load' });
      } else {
        await joplin.views.panels.hide(panel);
      }
    };

    // Commands
    await joplin.commands.register({
      name: 'openDndEditor',
      label: 'Open DnD Character Editor',
      execute: async () => { await refreshPanelVisibility(); },
    });

    await joplin.commands.register({
      name: 'insertDndTemplate',
      label: 'Insert DnD Character Template',
      execute: async () => {
        const note = await getActiveNote();
        // If there is no existing block or it's effectively empty, run the wizard
        const has = !!findDndBlock(note.body);
        const character = await openCharacterCreationWizard();
        const yaml = yamlStringify(character || defaultCharacter());
        const updated = upsertDndBlock(note.body, yaml);
        await joplin.data.put(['notes', note.id], null, { body: updated });
        await refreshPanelVisibility();
      },
    });

    await joplin.commands.register({
      name: 'importDndBeyondCharacter',
      label: 'Import D&D Beyond Character',
      execute: async () => { await runDdbImport(); },
    });

    await joplin.views.menuItems.create(
      'importDndBeyondCharacterMenuItem',
      'importDndBeyondCharacter',
      MenuItemLocation.Tools
    );

    await joplin.views.toolbarButtons.create(
      'openDndEditorBtn',
      'openDndEditor',
      ToolbarButtonLocation.EditorToolbar
    );

    await joplin.workspace.onNoteSelectionChange(refreshPanelVisibility);
    await joplin.workspace.onNoteChange(refreshPanelVisibility);

		// Initial
	let refreshTimer: any = null;

	async function refreshFromNoteChange() {
	if (withinMutationGrace()) return; // ignore echoes from our own put/setText

	const payload = await loadActivePayload();
	if (payload) {
		await joplin.views.panels.show(panel);
		await sendToPanel(payload);
	} else {
		await joplin.views.panels.hide(panel);
	}
	}



	// Wire events with debounce
	await joplin.workspace.onNoteSelectionChange(() => {
	if (refreshTimer) clearTimeout(refreshTimer);
	refreshTimer = setTimeout(refreshFromNoteChange, 150);
	});

	await joplin.workspace.onNoteChange(() => {
	if (refreshTimer) clearTimeout(refreshTimer);
	refreshTimer = setTimeout(refreshFromNoteChange, 250);
	});

	// Initial
	await refreshFromNoteChange();

  },
});
