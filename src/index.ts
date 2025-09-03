import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';
// import { parseFrontMatter, writeFrontMatter } from './utils/yaml';
import { deriveStats, defaultCharacter, computeDerived, roll } from './utils/dnd';
import { findDndBlock, upsertDndBlock, normalizeYamlToCharacter, readDndYaml } from './utils/dndNote'; // helpers above
import { parseFrontMatter, writeFrontMatter, parse as parseYaml, stringify as yamlStringify } from './utils/yaml';


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

joplin.plugins.register({
  onStart: async () => {
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

	await joplin.views.panels.onMessage(panel, async (msg) => {
	try {
		if (msg.type === 'ready') {
		panelReady = true;
		while (pending.length) await joplin.views.panels.postMessage(panel, pending.shift());
	// -      await sendToPanel({ type: 'load' });
	      // Immediately load from the current note on first ready.
	      const { noteId, character, derived } = await loadCharacterFromNoteFresh();
	      await joplin.views.panels.postMessage(panel, { type: 'data', noteId, character, derived });
		return;
		}


		if (msg.type === 'load') {
			try {
				const { noteId, character, derived } = await loadCharacterFromNoteFresh();
				await joplin.views.panels.postMessage(panel, { type: 'data', noteId, character, derived });
			} catch (e) {
				await joplin.views.panels.postMessage(panel, { type: 'error', message: String(e) });
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


		if (msg.type === 'roll') {
		const result = roll(msg.expr);
		await joplin.views.panels.postMessage(panel, { type: 'rollResult', result });
		return;
		}
	} catch (e) {
		await joplin.views.panels.postMessage(panel, { type: 'error', message: String(e) });
	}
	});


    const refreshPanelVisibility = async () => {
      const note = await joplin.workspace.selectedNote();
      if (!note) { await joplin.views.panels.hide(panel); return; }
      const visible = hasCharacterInBody(note.body);
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
        // Start with your default character and insert as fenced YAML
        const yaml = yamlStringify(defaultCharacter());
        const updated = upsertDndBlock(note.body, yaml);
        await joplin.data.put(['notes', note.id], null, { body: updated });
        await refreshPanelVisibility();
      },
    });

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

	const fresh = await getFreshActiveNoteBody();
	if (!fresh) { await joplin.views.panels.hide(panel); return; }

	const visible = !!findDndBlock(fresh.body) || !!parseFrontMatter(fresh.body).front?.dnd;

	if (visible) {
		await joplin.views.panels.show(panel);

		// Recompute and push data based on CURRENT fresh body
		const { character } = await readCharacterFromFresh();
		const c = character || defaultCharacter();
		const derived = computeDerived(c);
		await sendToPanel({ type: 'data', character: c, derived });
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
