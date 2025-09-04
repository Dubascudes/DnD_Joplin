
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

// ---- Types ----
// Ensure we always have a full record for all skills
function completeSkills(partial) {
    var _a;
    var out = {};
    for (var _i = 0, SKILLS_1 = SKILLS; _i < SKILLS_1.length; _i++) {
        var sk = SKILLS_1[_i];
        out[sk] = ((_a = partial === null || partial === void 0 ? void 0 : partial[sk]) !== null && _a !== void 0 ? _a : 'none');
    }
    return out;
}
// (optional) ensure full abilities too, if you accept partials
function completeAbilities(partial) {
    var _a, _b, _c, _d, _e, _f;
    var base = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
    return {
        STR: (_a = partial === null || partial === void 0 ? void 0 : partial.STR) !== null && _a !== void 0 ? _a : base.STR,
        DEX: (_b = partial === null || partial === void 0 ? void 0 : partial.DEX) !== null && _b !== void 0 ? _b : base.DEX,
        CON: (_c = partial === null || partial === void 0 ? void 0 : partial.CON) !== null && _c !== void 0 ? _c : base.CON,
        INT: (_d = partial === null || partial === void 0 ? void 0 : partial.INT) !== null && _d !== void 0 ? _d : base.INT,
        WIS: (_e = partial === null || partial === void 0 ? void 0 : partial.WIS) !== null && _e !== void 0 ? _e : base.WIS,
        CHA: (_f = partial === null || partial === void 0 ? void 0 : partial.CHA) !== null && _f !== void 0 ? _f : base.CHA,
    };
}
// ---- Constants ----
var SKILL_TO_ABILITY = {
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
var ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
var SKILLS = Object.keys(SKILL_TO_ABILITY);
// central accessor (no redeclare)
function getApi() {
    var _a;
    try {
        var w = (_a = globalThis.webviewApi) !== null && _a !== void 0 ? _a : window.webviewApi;
        if (w && typeof w.postMessage === 'function' && typeof w.onMessage === 'function')
            return w;
    }
    catch (_b) { }
    return null;
}
// optional small wait helper
function waitForApi() {
    return __awaiter(this, arguments, void 0, function (ms) {
        var t0, api_1;
        if (ms === void 0) { ms = 1200; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t0 = Date.now();
                    _a.label = 1;
                case 1:
                    api_1 = getApi();
                    if (api_1)
                        return [2 /*return*/, api_1];
                    if (Date.now() - t0 > ms)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 50); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ---- Utilities ----
var clamp = function (n, min, max) { return Math.max(min, Math.min(max, n)); };
var int = function (v, d) {
    if (d === void 0) { d = 0; }
    var n = parseInt(String(v), 10);
    return Number.isFinite(n) ? n : d;
};
function abilityMod(score) {
    return Math.floor((score - 10) / 2);
}
function proficiencyFromLevel(level) {
    if (level >= 17)
        return 6;
    if (level >= 13)
        return 5;
    if (level >= 9)
        return 4;
    if (level >= 5)
        return 3;
    return 2;
}
function computeDerived(ch) {
    var mods = ABILITIES.reduce(function (acc, a) { return (acc[a] = abilityMod(ch.abilities[a]), acc); }, {});
    var pb = proficiencyFromLevel(ch.level || 1);
    var savingThrows = ABILITIES.reduce(function (acc, a) {
        var _a;
        var base = mods[a];
        var add = ((_a = ch.savingThrowsProficiencies) === null || _a === void 0 ? void 0 : _a[a]) ? pb : 0;
        acc[a] = base + add;
        return acc;
    }, {});
    var skills = SKILLS.reduce(function (acc, sk) {
        var _a;
        var abil = SKILL_TO_ABILITY[sk];
        var base = mods[abil];
        var prof = ((_a = ch.skillsProficiencies) === null || _a === void 0 ? void 0 : _a[sk]) || 'none';
        var add = prof === 'prof' ? pb : prof === 'expert' ? pb * 2 : 0;
        acc[sk] = base + add;
        return acc;
    }, {});
    var passivePerception = 10 + skills['Perception'];
    var initiative = mods.DEX;
    return { mods: mods, proficiencyBonus: pb, skills: skills, savingThrows: savingThrows, passivePerception: passivePerception, initiative: initiative };
}
// Simple dice roller: "NdM+K" (N, K optional)
function rollExpr(expr) {
    var re = /^\s*(?:(-?\d*)\s*)?d\s*(\d+)\s*([+\-]\s*\d+)?\s*$/i; // e.g. "d20", "2d6+3", "-1d4-1"
    var plainInt = /^\s*([+\-]?\d+)\s*$/;
    expr = expr.trim();
    if (plainInt.test(expr)) {
        var total_1 = parseInt(expr, 10);
        return { total: total_1, detail: "".concat(total_1) };
    }
    var m = re.exec(expr);
    if (!m)
        return { total: NaN, detail: 'Invalid roll' };
    var nStr = m[1], mStr = m[2], kStr = m[3];
    var n = nStr ? parseInt(nStr, 10) : 1;
    var faces = parseInt(mStr, 10);
    var k = kStr ? parseInt(kStr.replace(/\s+/g, ''), 10) : 0;
    var count = Math.max(1, Math.abs(n));
    var rolls = [];
    for (var i = 0; i < count; i++)
        rolls.push(1 + Math.floor(Math.random() * faces));
    var subtotal = rolls.reduce(function (a, b) { return a + b; }, 0);
    subtotal = n < 0 ? -subtotal : subtotal;
    var total = subtotal + k;
    var sign = k >= 0 ? "+".concat(k) : "".concat(k);
    return { total: total, detail: "".concat(n, "d").concat(faces).concat(k ? sign : '', " = [").concat(rolls.join(', '), "] ").concat(n < 0 ? '=> negate ' : '').concat(subtotal).concat(k ? " ".concat(sign, " = ").concat(total) : '') };
}

// Roll composite damage like "2d6+1d4+3" or "d8+2" (any number of dice terms + integer modifiers)
// Returns: { total, detail, expr, exprForHost }
// - expr         : normalized internal form, may begin with '+'
// - exprForHost  : ONLY set when the expression is a simple NdM(+|-)K your host likely accepts
function rollCompositeDamage(expr) {
  var raw = String(expr || '0').replace(/\s+/g, '');
  if (!raw) raw = '0';

  // Keep a copy without a leading '+' for host, if we end up needing it
  var rawNoLeading = raw.replace(/^\+/, '');

  // Ensure our internal parse starts with a sign, to make tokenization easier
  var parseStr = /^[+\-]/.test(raw) ? raw : ('+' + raw);

  // Tokenize into signed terms: +<NdM> | -<NdM> | +<int> | -<int>
  var tokens = [], m;
  var re = /([+\-])(\d*d\d+|\d+)/ig;
  while ((m = re.exec(parseStr)) !== null) {
    tokens.push({ sign: m[1] === '-' ? -1 : 1, term: m[2] });
  }

  var total = 0, parts = [];
  tokens.forEach(function (tok) {
    var t = tok.term.toLowerCase();
    if (t.includes('d')) {
      var mm = /^(\d*)d(\d+)$/.exec(t);
      if (!mm) return;
      var n = mm[1] ? parseInt(mm[1], 10) : 1;
      var faces = parseInt(mm[2], 10);
      n = Math.max(1, n);
      var rolls = [];
      for (var i = 0; i < n; i++) rolls.push(1 + Math.floor(Math.random() * faces));
      var subtotal = rolls.reduce((a,b)=>a+b,0) * tok.sign;
      total += subtotal;
      parts.push(`${tok.sign<0?'-':'+'}${n}d${faces}[${rolls.join(',')}]${tok.sign<0?'(neg)':''}`);
    } else {
      var k = parseInt(t, 10);
      if (!Number.isFinite(k)) k = 0;
      k *= tok.sign;
      total += k;
      parts.push(`${tok.sign<0?'-':'+'}${Math.abs(k)}`);
    }
  });

  var detail = parts.join(' ').replace(/^\+/, '');
  var normalizedExpr = parseStr; // may start with '+'

  // Heuristic: provide exprForHost only for simple NdM(+|-)K (or just NdM)
  // Examples that pass: "2d8", "2d8+2", "d6-1", "+2d8+2" (we’ll strip leading '+')
  var simpleHostRe = /^\+?\d*d\d+(?:[+\-]\d+)?$/i;
  var exprForHost = null;
  if (simpleHostRe.test(normalizedExpr)) {
    exprForHost = normalizedExpr.replace(/^\+/, ''); // strip leading '+' for host
  }

  return { total, detail, expr: normalizedExpr, exprForHost, raw: rawNoLeading };
}


// ---- Defaults / Persistence ----
var LOCAL_KEY = 'dnd.character.editor.v1';
function defaultCharacter() {
    var baseSkills = SKILLS.reduce(function (a, s) { return (a[s] = 'none', a); }, {});
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
        notes: '',
    };
}
function loadLocal() {
    try {
        var raw = localStorage.getItem(LOCAL_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    catch (_a) {
        return null;
    }
}
function saveLocal(ch) {
    try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(ch));
    }
    catch (_a) { }
}

// ---- Defaults / Persistence ----
var CACHE_KEY_PREFIX = 'dnd.character.editor.v1:';
var currentNoteId = null; // set when we receive {type:'data', noteId}

function cacheKeyFor(noteId) {
  return CACHE_KEY_PREFIX + (noteId || 'unknown');
}

// Per-note cache (used only as an optimization / offline fallback)
function loadCache(noteId) {
  if (!noteId) return null;
  try {
    const raw = localStorage.getItem(cacheKeyFor(noteId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveCache(noteId, character) {
  if (!noteId) return;
  try {
    localStorage.setItem(cacheKeyFor(noteId), JSON.stringify(character));
  } catch {}
}

// ---- UI State ----
var api = null;
var ch = defaultCharacter();
var derived = computeDerived(ch);
var statusTimer = null;
function setStatus(msg, timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 1600; }
    var el = document.getElementById('status');
    if (el) {
        el.textContent = msg;
    }
    if (statusTimer)
        window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () { if (el && el.textContent === msg)
        el.textContent = ''; }, timeoutMs);
}
function update(next) {
    ch = __assign(__assign({}, ch), next);
    derived = computeDerived(ch);
    renderDynamic();
}
function updateDeep(path, value) {
    var _a;
    // path like "abilities.STR" or "skillsProficiencies.Perception"
    var parts = path.split('.');
    var last = parts.pop();
    var obj = ch;
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var p = parts_1[_i];
        obj[p] = (_a = obj[p]) !== null && _a !== void 0 ? _a : {};
        obj = obj[p];
    }
    obj[last] = value;
    derived = computeDerived(ch);
    renderDynamic();
}
// ---- DOM creation ----
function h(tag, attrs, children) {
    if (attrs === void 0) { attrs = {}; }
    if (children === void 0) { children = []; }
    var el = document.createElement(tag);
    for (var _i = 0, _a = Object.entries(attrs); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        if (k === 'class')
            el.className = v;
        else if (k === 'style' && typeof v === 'object')
            Object.assign(el.style, v);
        else if (k.startsWith('data-'))
            el.setAttribute(k, String(v));
        else if (k === 'for')
            el.setAttribute('for', String(v));
        else if (k === 'value')
            el.value = v;
        else if (k in el)
            el[k] = v;
        else
            el.setAttribute(k, String(v));
    }
    for (var _c = 0, children_1 = children; _c < children_1.length; _c++) {
        var c = children_1[_c];
        el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
}
function labeledInput(label, id, value, onInput, type) {
    if (type === void 0) { type = 'text'; }
    var input = h('input', { id: id, type: type, value: value, class: 'inp' });
    input.addEventListener('input', function () { return onInput(input.value); });
    return h('label', { class: 'lbl' }, [
        h('div', { class: 'lblt' }, [label]),
        input,
    ]);
}
function labeledNumber(label, id, value, onInput, min, max) {
    var input = h('input', { id: id, type: 'number', value: value, class: 'inp' });
    if (min !== undefined)
        input.setAttribute('min', String(min));
    if (max !== undefined)
        input.setAttribute('max', String(max));
    input.addEventListener('input', function () { return onInput(int(input.value, value)); });
    return h('label', { class: 'lbl' }, [
        h('div', { class: 'lblt' }, [label]),
        input,
    ]);
}
function selectProf(initial, onChange) {
    var sel = h('select', { class: 'sel' }, [
        h('option', { value: 'none', selected: initial === 'none' }, ['—']),
        h('option', { value: 'prof', selected: initial === 'prof' }, ['●']),
        h('option', { value: 'expert', selected: initial === 'expert' }, ['◎']),
    ]);
    sel.addEventListener('change', function () { return onChange(sel.value); });
    return sel;
}
// ---- Build UI ----
// ---- Build UI ----
function buildUI() {
  var root = document.getElementById('root');
  if (!root) return;

  // Styles
  var style = document.createElement('style');
  style.textContent = `
    :root { --bd:#d0d4db; --tx:#101216; --mut:#5a6270; --bg:#ffffff; --chip:#f5f7fa; }
    * { box-sizing: border-box; }
    body { margin:0; background: var(--bg); color: var(--tx); font: 14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    .wrap { padding: 12px; }
    h2 { margin: 16px 0 8px; font-size: 16px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
    .cols { display: grid; grid-template-columns: 320px 1fr; gap: 16px; align-items: start; }
    .card { border: 1px solid var(--bd); border-radius: 10px; padding: 10px; background: #fff; }
    .lbl { display:block; }
    .lblt { font-size: 11px; color: var(--mut); margin-bottom: 4px; }
    .inp, .sel, textarea { width: 100%; padding: 8px; border: 1px solid var(--bd); border-radius: 8px; background: #fff; }
    textarea { min-height: 80px; resize: vertical; }
    .row { display:flex; gap:8px; align-items:center; }
    .mut { color: var(--mut); }
    .chip { background: var(--chip); border:1px solid var(--bd); padding:6px 8px; border-radius: 8px; }
    .skills { display: grid; grid-template-columns: 1fr auto auto; gap: 6px 8px; align-items: center; }
    .skillHead { font-size: 12px; color:var(--mut); display: contents; }
    .btn { border:1px solid var(--bd); background:#fff; padding:8px 10px; border-radius: 8px; cursor:pointer; }
    .btn:hover { background:#f9fafb; }
    .btn.small { padding:4px 6px; font-size:12px; }
    .right { text-align: right; }
    .status { margin-left: 8px; color: var(--mut); }
    .attacks .hdr, .attacks .row {
        display: grid;
        grid-template-columns: 1.2fr 100px 100px 1fr 1fr max-content; /* Attack | Range | Hit/DC | Damage | Notes | ✕ */
        gap: 6px;
        align-items: center;
    }
    .attacks .hdr { color: var(--mut); font-size:12px; }
    .attack-roll-btn { white-space: nowrap; }

    /* Top bar (left: roll/load/save, right: tabs) */
    .topbar {
      position: sticky; top: 0; z-index: 10;
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 8px; padding-top: 8px; background: var(--bg);
    }
    .topbar .leftActions, .topbar .rightActions {
      display: flex; align-items: center; gap: 8px;
    }
    .tab.btn {} /* inherits .btn */
    .tab.btn.active { box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

    /* Right column container (avoid global .right{text-align:right}) */
    .rightCol { display: flex; flex-direction: column; min-width: 420px; }
    .rightPanel { display: flex; flex-direction: column; gap: 16px; }

    /* Keep skill prof selects compact and stable */
    .skills select, .skills .sel {
      width: 88px !important; min-width: 88px !important; max-width: 88px !important;
      flex: 0 0 88px; justify-self: start;
    }
    .skills { grid-template-columns: 1fr max-content max-content; }

    /* Saving throws compactness */
    .saving-throws-grid .row { gap: 6px; }
    .saving-throws-grid .mut { white-space: nowrap; }

    /* Optional: tighten first card header spacing */
    .left .card:first-child h2, .rightCol .card:first-child h2 { margin-top: 0; }
  `;
  style.textContent += `
  /* Attacks table: header + rows share the same columns */
  .attacks .header,
  .attacks .rowGrid {
    display: grid;
    grid-template-columns: 1.2fr 100px 100px 1fr 1fr max-content; /* Attack | Range | Hit/DC | Damage | Notes | ✕ */
    gap: 6px;
    align-items: center;
  }
  .attacks .header {
    color: var(--mut);
    font-size: 12px;
    margin-bottom: 6px;
  }

  /* Input+button inline for Hit/DC and Damage cells */
  .attacks .cell-inline { display: flex; align-items: center; gap: 6px; }

  /* Smaller dice buttons */
  .attack-roll-btn {
    padding: 2px 6px;
    font-size: 12px;
    line-height: 1;
    border-radius: 6px;
  }
`;
// Replace your previous Skills CSS block with this:
style.textContent += `
  /* Skills container should NOT be a grid */
  .skillsTable { display: block; }

  /* Header and each row share the same 3-column grid */
  .skillsHeader,
  .skillRow {
    display: grid;
    grid-template-columns: 1fr max-content max-content; /* Skill | Total | Prof */
    gap: 6px 8px;
    align-items: center;
  }

  .skillsHeader {
    color: var(--mut);
    font-size: 12px;
    margin-bottom: 6px;
  }

  .skillRow .right { text-align: right; }

  .skillTotalWrap {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-end;
  }

  /* Keep the small dropdowns compact */
  .skillsTable select,
  .skillsTable .sel {
    width: 88px !important; min-width: 88px !important; max-width: 88px !important;
    flex: 0 0 88px; justify-self: start;
  }
`;

  document.head.appendChild(style);

  // Build columns
  var left  = h('div', { class: 'left' });
  var right = h('div', { class: 'rightCol' });

  // Identity
  var identity = h('div', { class: 'card' }, [
    h('h2', {}, ['Identity']),
    labeledInput('Name', 'name', ch.name, function (v) { return update({ name: v }); }),
    h('div', { class: 'grid2' }, [
      labeledInput('Class', 'class', ch.class, function (v) { return update({ class: v }); }),
      labeledNumber('Level', 'level', ch.level, function (v) { return update({ level: clamp(v, 1, 20) }); }, 1, 20),
    ]),
    h('div', { class: 'grid3' }, [
      labeledInput('Race', 'race', ch.race || '', function (v) { return update({ race: v }); }),
      labeledInput('Background', 'background', ch.background || '', function (v) { return update({ background: v }); }),
      labeledInput('Alignment', 'alignment', ch.alignment || '', function (v) { return update({ alignment: v }); }),
    ]),
  ]);

  // Abilities + Saves
  var abilities = h('div', { class: 'card' });
  abilities.appendChild(h('h2', {}, ['Abilities']));
  var abilWrap = h('div', { class: 'grid3' });
  ABILITIES.forEach(function (a) {
    var score = labeledNumber(`${a} (mod ${fmtSigned(derived.mods[a])})`, `abil.${a}`, ch.abilities[a],
      function (v) { return updateDeep(`abilities.${a}`, clamp(v, 1, 30)); }, 1, 30);
    score.setAttribute('data-ability', a);
    abilWrap.appendChild(score);
  });
  abilities.appendChild(abilWrap);

  var saves = h('div', { class: 'card' });
  saves.appendChild(h('h2', {}, ['Saving Throws']));
  var saveGrid = h('div', { class: 'grid3 saving-throws-grid' });
  ABILITIES.forEach(function (a) {
    var row = h('div', { class: 'row chip' }, [
      h('input', { type: 'checkbox', checked: !!ch.savingThrowsProficiencies[a] }),
      h('div', {}, [`${a} save`]),
      h('div', { class: 'mut' }, [h('span', { id: `save.total.${a}` }, [fmtSigned(derived.savingThrows[a])])]),
    ]);
    row.firstChild.addEventListener('change', function (ev) {
      var on = ev.target.checked;
      updateDeep(`savingThrowsProficiencies.${a}`, on);
    });
    saveGrid.appendChild(row);
  });
  saves.appendChild(saveGrid);

  // Combat
  var combat = h('div', { class: 'card' }, [
    h('h2', {}, ['Combat']),
    h('div', { class: 'grid3' }, [
      labeledNumber('Armor Class', 'ac', ch.armorClass, function (v) { return update({ armorClass: clamp(v, 0, 40) }); }, 0, 40),
      labeledNumber('HP (max)', 'hp.max', ch.maxHP, function (v) { return update({ maxHP: Math.max(1, v) }); }, 1),
      labeledNumber('HP (current)', 'hp.cur', ch.currentHP, function (v) { return update({ currentHP: clamp(v, 0, ch.maxHP) }); }, 0),
    ]),
    h('div', { class: 'grid3', style: { marginTop: '6px' } }, [
      labeledInput('Speed', 'speed', ch.speed || '', function (v) { return update({ speed: v }); }),
      labeledNumber('Temp HP', 'hp.temp', ch.tempHP || 0, function (v) { return update({ tempHP: Math.max(0, v) }); }, 0),
      h('label', { class: 'lbl' }, [
        h('div', { class: 'lblt' }, ['Initiative']),
        h('div', { class: 'chip' }, [h('span', { id: 'derived.initiative' }, [fmtSigned(derived.initiative)]), ' (DEX mod)']),
      ]),
    ]),
    h('div', { class: 'row', style: { marginTop: '6px' } }, [
      h('div', { class: 'chip' }, ['Prof bonus: ', h('strong', { id: 'derived.pb' }, [fmtSigned(derived.proficiencyBonus)])]),
      h('div', { class: 'chip' }, ['Passive Perception: ', h('strong', { id: 'derived.pp' }, [String(derived.passivePerception)])]),
    ]),
  ]);

  // Left column assembly
  left.appendChild(identity);
  left.appendChild(abilities);
  left.appendChild(saves);
  left.appendChild(combat);

  // Right-side cards
    //Skills tab
    var skillsCard = h('div', { class: 'card' });
    skillsCard.appendChild(h('h2', {}, ['Skills']));

    var skillsTable = h('div', { class: 'skillsTable' });

    // Header row (three actual cells)
    var skillsHeader = h('div', { class: 'skillsHeader' }, [
    h('div', {}, ['Skill']),
    h('div', { class: 'right' }, ['Total']),
    h('div', {}, ['Prof']),
    ]);
    skillsTable.appendChild(skillsHeader);

    // Rows
    SKILLS.forEach(function (sk) {
    var abil = SKILL_TO_ABILITY[sk];

    // name cell: "Stealth (DEX)"
    var nameCell = h('div', {}, [
        `${sk} `,
        h('span', { class: 'mut' }, [`(${abil})`])
    ]);

    // total cell: value + tiny roll button
    var totalEl  = h('div', { id: `skill.total.${sk}`, class: 'right' }, [fmtSigned(derived.skills[sk])]);
    var rollBtn  = h('button', { class: 'btn small', title: 'Roll skill' }, ['🎲']);
    var totalWrap = h('div', { class: 'skillTotalWrap' }, [totalEl, rollBtn]);

    rollBtn.addEventListener('click', function () {
        var expr = `1d20${signed(derived.skills[sk])}`;
        if (api) api.postMessage({ type: 'roll', expr });
        else {
        var r = rollExpr(expr);
        setStatus(`Roll ${sk}: ${r.total} (${r.detail})`, 4000);
        }
    });

    // prof select
    var sel = selectProf(ch.skillsProficiencies[sk] || 'none',
        function (p) { return updateDeep(`skillsProficiencies.${sk}`, p); });

    // assemble row (three cells)
    var row = h('div', { class: 'skillRow' }, [nameCell, totalWrap, sel]);
    skillsTable.appendChild(row);
    });

    skillsCard.appendChild(skillsTable);

//   skillsCard.appendChild(skillGrid);

 // Attacks Tab
  var attacksCard = h('div', { class: 'card attacks' });
  attacksCard.appendChild(h('h2', {}, ['Attacks']));
  var list = h('div', { id: 'attacks.list' });
  var addBtn = h('button', { class: 'btn', style: { marginTop: '8px' } }, ['+ Add attack']);
    addBtn.addEventListener('click', function () {
    ch.attacks.push({ name: 'New Attack', range: 'Melee', hitDc: '+0', damage: '1d6+2', notes: '' });
    derived = computeDerived(ch);
    renderAttacks();
    });
  attacksCard.appendChild(list);
  attacksCard.appendChild(addBtn);

  var notesCard = h('div', { class: 'card' }, [
    h('h2', {}, ['Notes']),
    (function () {
      var ta = h('textarea', { value: ch.notes || '' });
      ta.addEventListener('input', function () { return update({ notes: ta.value }); });
      return ta;
    })(),
  ]);

  // Tag right-side cards so we can toggle
  skillsCard.setAttribute('data-panel', 'skills');
  attacksCard.setAttribute('data-panel', 'attacks');
  notesCard.setAttribute('data-panel', 'notes');

  // Panel shell (only the panel goes in the right column)
  var panel = h('div', { class: 'rightPanel' });
  panel.appendChild(skillsCard);
  panel.appendChild(attacksCard);
  panel.appendChild(notesCard);
  right.innerHTML = '';
  right.appendChild(panel);

  // Build top bar
  var leftActions = h('div', { class: 'leftActions' }, [
    h('button', { class: 'btn', id: 'btn.roll' }, ['Roll d20']),
    h('button', { class: 'btn', id: 'btn.load' }, ['Load']),
    h('button', { class: 'btn', id: 'btn.save' }, ['Save']),
    h('div', { id: 'status', class: 'status' }, ['']),
  ]);
  var rightActions = h('div', { class: 'rightActions' }, [
    h('button', { class: 'btn tab active', 'data-target': 'skills'  }, ['Skills']),
    h('button', { class: 'btn tab',         'data-target': 'attacks' }, ['Attacks']),
    h('button', { class: 'btn tab',         'data-target': 'notes'   }, ['Notes']),
  ]);
  var topbar = h('div', { class: 'topbar' }, [leftActions, rightActions]);

  // Mount
  root.innerHTML = '';
  var wrap = h('div', { class: 'wrap' });
  wrap.appendChild(topbar);
  var cols = h('div', { class: 'cols' }, [left, right]);
  wrap.appendChild(cols);
  root.appendChild(wrap);

  // Show/hide logic for right-side panel
  function showPanel(which) {
    Array.from(rightActions.querySelectorAll('.tab')).forEach(btn =>
      btn.classList.toggle('active', btn.getAttribute('data-target') === which)
    );
    Array.from(panel.children).forEach(el =>
      el.style.display = (el.getAttribute('data-panel') === which) ? '' : 'none'
    );
  }
  rightActions.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab');
    if (!btn) return;
    showPanel(btn.getAttribute('data-target'));
  });
  showPanel('skills');

  // Wire top buttons
  document.getElementById('btn.roll').addEventListener('click', function () {
    if (api) api.postMessage({ type: 'roll', expr: '1d20' });
    else {
      var r = rollExpr('1d20');
      setStatus(`Roll d20: ${r.total} (${r.detail})`, 3000);
    }
  });
  document.getElementById('btn.save').addEventListener('click', function () {
    if (api) api.postMessage({ type: 'save', character: ch });
    else {
      saveLocal(ch);
      setStatus('Saved locally ✓');
    }
  });
  document.getElementById('btn.load').addEventListener('click', function () {
    if (api) {
      api.postMessage({ type: 'load' });
      setStatus('Loading…');
    } else {
      setStatus('Nothing to load (offline)');
    }
  });

  // Initial renders that depend on state
  renderAttacks();
  renderDynamic();
}

// function renderAttacks() {
//     var list = document.getElementById('attacks.list');
//     if (!list)
//         return;
//     list.innerHTML = '';
//     ch.attacks.forEach(function (atk, i) {
//         var row = h('div', { class: 'row' });
//         var grid = h('div', { class: 'row', style: { width: '100%' } }, [
//         // use the same 1fr 120px 1fr 28px grid as header
//         ]);
//         var name = h('input', { class: 'inp', value: atk.name });
//         var toHit = h('input', { class: 'inp', value: atk.toHit });
//         var dmg = h('input', { class: 'inp', value: atk.damage });
//         var del = h('button', { class: 'btn small', title: 'Remove' }, ['✕']);
//         name.addEventListener('input', function () { ch.attacks[i].name = name.value; });
//         toHit.addEventListener('input', function () { ch.attacks[i].toHit = toHit.value; });
//         dmg.addEventListener('input', function () { ch.attacks[i].damage = dmg.value; });
//         del.addEventListener('click', function () { ch.attacks.splice(i, 1); renderAttacks(); });
//         var gridWrap = h('div', { class: 'hdr' }, [name, toHit, dmg, del]);
//         list.appendChild(gridWrap);
//     });
// }
// tiny helper to mirror your Combat labels
function labeledWrap(label, child) {
  return h('label', { class: 'lbl' }, [
    h('div', { class: 'lblt' }, [label]),
    child,
  ]);
}

function renderAttacks() {
  var list = document.getElementById('attacks.list');
  if (!list) return;
  list.innerHTML = '';

  ch.attacks.forEach(function (atk, i) {
    // Back-compat: use toHit if hitDc not present
    var hitDcVal = (atk.hitDc != null ? String(atk.hitDc) : (atk.toHit != null ? String(atk.toHit) : '+0'));
    var dmgVal   = (atk.damage != null ? String(atk.damage) : '1d4');
    var rangeVal = (atk.range  != null ? String(atk.range)  : '');

    // Inputs
    var name  = h('input', { class: 'inp', value: atk.name || '' });
    var range = h('input', { class: 'inp', value: rangeVal });

    var hitDcInput = h('input', { class: 'inp', value: hitDcVal, title: 'Enter modifier (e.g. +5). Double-click/Enter or 🎲 to roll' });
    var hitBtn = h('button', { class: 'btn attack-roll-btn', title: 'Roll Hit/DC' }, ['🎲']);
    var hitWrap = h('div', { class: 'cell-inline' }, [hitDcInput, hitBtn]);

    var dmgInput = h('input', { class: 'inp', value: dmgVal, title: 'Composite damage like 2d6+1d4+3' });
    var dmgBtn = h('button', { class: 'btn attack-roll-btn', title: 'Roll Damage' }, ['🎲']);
    var dmgWrap = h('div', { class: 'cell-inline' }, [dmgInput, dmgBtn]);

    var notes = h('input', { class: 'inp', value: atk.notes || '' });
    var del   = h('button', { class: 'btn small', title: 'Remove' }, ['✕']);

    // Persist on input
    name.addEventListener('input',  function () { ch.attacks[i].name  = name.value; });
    range.addEventListener('input', function () { ch.attacks[i].range = range.value; });
    hitDcInput.addEventListener('input', function () {
      ch.attacks[i].hitDc = hitDcInput.value;
      ch.attacks[i].toHit = hitDcInput.value; // keep legacy field updated
    });
    dmgInput.addEventListener('input', function () { ch.attacks[i].damage = dmgInput.value; });
    notes.addEventListener('input', function () { ch.attacks[i].notes  = notes.value; });
    del.addEventListener('click',   function () { ch.attacks.splice(i, 1); renderAttacks(); });

    // Roll handlers
    function rollHit() {
      var mod = parseInt(String(hitDcInput.value).replace(/\s+/g, ''), 10);
      if (!Number.isFinite(mod)) mod = 0;
      var expr = `1d20${mod >= 0 ? '+'+mod : mod}`;
      if (api) api.postMessage({ type: 'roll', expr });
      else {
        var r = rollExpr(expr);
        setStatus(`Hit/DC (${atk.name || 'Attack'}): ${r.total} (${r.detail})`, 4000);
      }
    }
    function rollDamage() {
    var exprIn = String(dmgInput.value || '0');
    var r = rollCompositeDamage(exprIn);

    // If the host can understand this (simple NdM±K), let it roll; otherwise show our local result.
    if (api && r.exprForHost) {
        api.postMessage({ type: 'roll', expr: r.exprForHost });
    } else {
        setStatus(`Damage (${atk.name || 'Attack'}): ${r.total} (${r.detail})`, 4000);
    }
    }
    hitBtn.addEventListener('click', rollHit);
    dmgBtn.addEventListener('click', rollDamage);
    hitDcInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') rollHit(); });
    hitDcInput.addEventListener('dblclick', rollHit);
    dmgInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') rollDamage(); });
    dmgInput.addEventListener('dblclick', rollDamage);

    // Row grid with labeled cells (like Combat)
    var row = h('div', { class: 'rowGrid' }, [
      labeledWrap('Attack', name),
      labeledWrap('Range',  range),
      labeledWrap('Hit/DC', hitWrap),
      labeledWrap('Damage', dmgWrap),
      labeledWrap('Notes',  notes),
      del,
    ]);

    list.appendChild(row);
  });
}


function renderDynamic() {
    // Update ability labels (mods)
    ABILITIES.forEach(function (a) {
        var lab = document.querySelector("[data-ability=\"".concat(a, "\"] .lblt"));
        if (lab)
            lab.textContent = "".concat(a, " (mod ").concat(fmtSigned(derived.mods[a]), ")");
    });
    // Derived chips
    var pb = document.getElementById('derived.pb');
    if (pb)
        pb.textContent = fmtSigned(derived.proficiencyBonus);
    var pp = document.getElementById('derived.pp');
    if (pp)
        pp.textContent = String(derived.passivePerception);
    var ini = document.getElementById('derived.initiative');
    if (ini)
        ini.textContent = fmtSigned(derived.initiative);
    // Saves
    ABILITIES.forEach(function (a) {
        var el = document.getElementById("save.total.".concat(a));
        if (el)
            el.textContent = fmtSigned(derived.savingThrows[a]);
    });
    // Skills
    SKILLS.forEach(function (sk) {
        var el = document.getElementById("skill.total.".concat(sk));
        if (el)
            el.textContent = fmtSigned(derived.skills[sk]);
    });
}
function fmtSigned(n) {
    return (n >= 0 ? "+".concat(n) : "".concat(n));
}
function signed(n) {
    return n >= 0 ? "+".concat(n) : "".concat(n);
}
// ---- Bootstrap ----
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var r, local;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Provide a very small HTML scaffold in case host forgot:
                    if (!document.getElementById('root')) {
                        r = document.createElement('div');
                        r.id = 'root';
                        document.body.appendChild(r);
                    }
                    buildUI();
                    return [4 /*yield*/, waitForApi(1500)];
                case 1:
                    api = _a.sent();
                    if (api) {
                         api.onMessage(function (raw) {
                           // Some Joplin builds deliver { message: <payload> } or an event-like { data: <payload> }.
                           const msg = (raw && typeof raw === 'object')
                             ? (('message' in raw && typeof raw.message === 'object') ? raw.message
                                : ('data' in raw && typeof raw.data === 'object') ? raw.data
                                : raw)
                             : raw;
                           console.log('[webview] message (unwrapped):', msg, ' raw:', raw);
                           if (!msg || typeof msg !== 'object') return;
                        
                           if (msg.type === 'data') {
                            // Host is source of truth. Accept it and update UI.
                            currentNoteId = msg.noteId || currentNoteId;
                            ch = mergeCharacter(defaultCharacter(), msg.character || {});
                            derived = computeDerived(ch);

                            // Cache only for fast reopen/offline — but do NOT read it unless offline.
                            if (currentNoteId) saveCache(currentNoteId, ch);

                            buildUI(); // rebuild inputs to reflect host data
                            setStatus('Loaded ✓');
                        } else if (msg.type === 'saved') {
                            setStatus('Saved ✓');
                            // Do NOT write cache here; it was already saved when we applied 'data'
                        } else if (msg.type === 'error') {
                            setStatus(`Error: ${msg.message}`, 4000);
                        } else if (msg.type === 'rollResult') {
                            setStatus(`Roll: ${msg.result}`, 4000);
                        }
                        });
                        // Ask host for data
                        api.postMessage({ type: 'load' });
                    
                        } else {
                        // OFFLINE MODE: only now is it OK to use cache
                        // We don't know noteId offline; skip cache unless you have one from before
                        const cached = currentNoteId ? loadCache(currentNoteId) : null;
                        if (cached) {
                            ch = mergeCharacter(defaultCharacter(), cached);
                            derived = computeDerived(ch);
                            buildUI();
                            setStatus('Loaded (local cache)');
                        } else {
                            setStatus('Offline mode — using defaults');
                        }
                        }

                    return [2 /*return*/];
            }
        });
    });
}
function mergeCharacter(base, incoming) {
    var _a, _b, _c;
    var mergedAbilities = completeAbilities(__assign(__assign({}, base.abilities), ((_a = incoming.abilities) !== null && _a !== void 0 ? _a : {})));
    var mergedSkills = completeSkills(__assign(__assign({}, ((_b = base.skillsProficiencies) !== null && _b !== void 0 ? _b : {})), ((_c = incoming.skillsProficiencies) !== null && _c !== void 0 ? _c : {})));
    return __assign(__assign(__assign({}, base), incoming), { abilities: mergedAbilities, savingThrowsProficiencies: __assign(__assign({}, (base.savingThrowsProficiencies || {})), (incoming.savingThrowsProficiencies || {})), skillsProficiencies: mergedSkills, attacks: (incoming.attacks || base.attacks || []).map(function (a) { return (__assign({ name: '', toHit: '', damage: '', notes: '' }, a)); }) });
}

(function bootstrap() {
  function start() {
    try {
      main();
      const a = getApi();
      if (a) {
        api = a
        // Tell the host we’re ready so queued messages flush
        api.postMessage({ type: 'ready' });
      }
    } catch (err) {
      console.error('[renderer] bootstrap error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    // DOM is already ready — run immediately
    start();
  }
})();
