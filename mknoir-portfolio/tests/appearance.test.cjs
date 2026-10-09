const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')
const ts = require('typescript')

// Execute the exported production bootstrap rather than duplicating its policy.
const source = fs.readFileSync(path.join(__dirname, '../src/lib/appearance.ts'), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText
const moduleContext = { exports: {} }
vm.runInNewContext(compiled, moduleContext)
const { APPEARANCES, APPEARANCE_BOOTSTRAP, APPEARANCE_SESSION_KEY, DEFAULT_COLOR_MODES, isAppearance } = moduleContext.exports

function runBootstrap({
  url = 'https://www.mknoir.com/',
  referrer = '',
  navigationType = 'navigate',
  saved,
  theme,
  random = 0,
  systemDark = false,
  initialClasses = ['font-ready'],
  blockedSessionStorage = false,
  blockedLocalStorage = false,
  failStorageWrites = false,
  missingNavigationTiming = false,
} = {}) {
  const sessionValues = new Map(saved === undefined ? [] : [[APPEARANCE_SESSION_KEY, saved]])
  const localValues = new Map(theme === undefined ? [] : [['theme', theme]])
  const sessionWrites = []
  const localWrites = []
  const classes = new Set(initialClasses)
  let randomCalls = 0
  const root = {
    dataset: {},
    style: {},
    classList: {
      contains: (name) => classes.has(name),
      add: (name) => classes.add(name),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
    },
  }
  const storage = (values, writes) => ({
    getItem(key) { return values.has(key) ? values.get(key) : null },
    setItem(key, value) {
      if (failStorageWrites) throw new Error('Storage quota unavailable')
      writes.push([key, value])
      values.set(key, value)
    },
  })
  const location = new URL(url)
  const context = {
    document: { documentElement: root, referrer },
    location,
    URL,
    Math: { floor: Math.floor, random: () => { randomCalls += 1; return random } },
    performance: { getEntriesByType: () => missingNavigationTiming ? [] : [{ type: navigationType }] },
    matchMedia: () => ({ matches: systemDark }),
  }
  Object.defineProperty(context, 'sessionStorage', {
    get() {
      if (blockedSessionStorage) throw new Error('Session storage blocked')
      return storage(sessionValues, sessionWrites)
    },
  })
  Object.defineProperty(context, 'localStorage', {
    get() {
      if (blockedLocalStorage) throw new Error('Local storage blocked')
      return storage(localValues, localWrites)
    },
  })
  vm.runInNewContext(APPEARANCE_BOOTSTRAP, context)
  assert.equal(location.href, url, 'The bootstrap must not rewrite the URL')
  assert.equal(root.dataset.appearanceColorMode, root.style.colorScheme, 'The intended color mode must remain available for hydration even without storage')
  return { appearance: root.dataset.appearance, colorScheme: root.style.colorScheme, classes, sessionValues, localValues, sessionWrites, localWrites, randomCalls }
}

test('appearance metadata validates all five supported looks', () => {
  assert.deepEqual(Array.from(APPEARANCES, ({ id }) => id), ['field', 'mono', 'orbit', 'atlas', 'afterhours'])
  assert.deepEqual(Array.from(APPEARANCES, ({ label }) => label), ['Seasons', 'The Original', 'The Lab', 'Atlas', 'After Hours'])
  for (const value of ['field', 'mono', 'orbit', 'atlas', 'afterhours']) assert.equal(isAppearance(value), true)
  for (const value of [null, undefined, '', 'FIELD', 'system', 0, {}, ['field']]) assert.equal(isAppearance(value), false)
})

test('fresh arrivals give every design an equal range and apply its default before paint', () => {
  const boundaries = APPEARANCES.flatMap(({ id }, index) => [[index / APPEARANCES.length, id], [(index + 1) / APPEARANCES.length - Number.EPSILON, id]])
  for (const [random, expected] of boundaries) {
    const result = runBootstrap({ random, theme: 'system', initialClasses: ['font-ready', 'light', 'dark'] })
    assert.equal(result.appearance, expected)
    assert.equal(result.colorScheme, DEFAULT_COLOR_MODES[expected])
    assert.equal(result.localValues.get('theme'), DEFAULT_COLOR_MODES[expected])
    assert.equal(result.classes.has(DEFAULT_COLOR_MODES[expected]), true)
    assert.equal(result.classes.has(DEFAULT_COLOR_MODES[expected] === 'dark' ? 'light' : 'dark'), false)
    assert.equal(result.classes.has('font-ready'), true)
    assert.equal(result.sessionValues.get(APPEARANCE_SESSION_KEY), expected)
    assert.equal(result.randomCalls, 1)
  }
})

test('reload ignores the previous selection even with a same-origin referrer', () => {
  const result = runBootstrap({ navigationType: 'reload', saved: 'orbit', theme: 'dark', referrer: 'https://www.mknoir.com/about', random: 0 })
  assert.equal(result.appearance, 'field')
  assert.equal(result.colorScheme, 'light')
  assert.equal(result.localWrites.length, 1)
})

test('same-origin full-document navigation preserves appearance and current color theme', () => {
  const result = runBootstrap({ saved: 'field', theme: 'dark', referrer: 'https://www.mknoir.com/about', random: 0.9 })
  assert.equal(result.appearance, 'field')
  assert.equal(result.colorScheme, 'dark')
  assert.equal(result.randomCalls, 0)
  assert.deepEqual(result.localWrites, [])
  assert.deepEqual(result.sessionWrites, [[APPEARANCE_SESSION_KEY, 'field']])
})

test('back and forward navigation preserve selection without a referrer', () => {
  const result = runBootstrap({ navigationType: 'back_forward', saved: 'mono', theme: 'light', random: 0.9 })
  assert.equal(result.appearance, 'mono')
  assert.equal(result.colorScheme, 'light')
  assert.equal(result.randomCalls, 0)
  assert.deepEqual(result.localWrites, [])
})

test('direct, external, and unclassified arrivals do not restore an old session look', () => {
  for (const options of [{}, { referrer: 'https://other.example/about' }, { referrer: 'https://mknoir.com/about' }, { referrer: 'https://www.mknoir.com/about', missingNavigationTiming: true }, { referrer: 'not a URL' }]) {
    const result = runBootstrap({ saved: 'orbit', theme: 'dark', random: 0, ...options })
    assert.equal(result.appearance, 'field')
    assert.equal(result.colorScheme, 'light')
    assert.equal(result.randomCalls, 1)
  }
})

test('explicit review links select the requested look and default without randomization', () => {
  for (const look of ['field', 'mono', 'orbit', 'atlas', 'afterhours']) {
    for (const navigationType of ['navigate', 'reload', 'back_forward']) {
      const result = runBootstrap({ url: `https://www.mknoir.com/?look=${look}#projects`, navigationType, random: 0.99 })
      assert.equal(result.appearance, look)
      assert.equal(result.colorScheme, DEFAULT_COLOR_MODES[look])
      assert.equal(result.randomCalls, 0)
    }
  }
})

test('a new explicit look updates the default; the same look on internal navigation keeps the theme', () => {
  const changed = runBootstrap({ url: 'https://www.mknoir.com/?look=orbit', saved: 'field', theme: 'light', referrer: 'https://www.mknoir.com/about' })
  assert.equal(changed.appearance, 'orbit')
  assert.equal(changed.colorScheme, 'light')
  assert.deepEqual(changed.localWrites, [['theme', 'light']])

  const same = runBootstrap({ url: 'https://www.mknoir.com/?look=field', saved: 'field', theme: 'dark', referrer: 'https://www.mknoir.com/about' })
  assert.equal(same.appearance, 'field')
  assert.equal(same.colorScheme, 'dark')
  assert.deepEqual(same.localWrites, [])
})

test('invalid query and saved values cannot become appearance selectors', () => {
  const fresh = runBootstrap({ url: 'https://www.mknoir.com/?look=unknown', saved: 'invalid', referrer: 'https://www.mknoir.com/about', random: 0.5 })
  assert.equal(fresh.appearance, 'orbit')
  const internal = runBootstrap({ url: 'https://www.mknoir.com/?look=__proto__', saved: 'orbit', theme: 'light', referrer: 'https://www.mknoir.com/about' })
  assert.equal(internal.appearance, 'orbit')
  assert.equal(internal.colorScheme, 'light')
})

test('an internally preserved system preference resolves without overwriting that preference', () => {
  for (const systemDark of [true, false]) {
    const result = runBootstrap({ saved: 'orbit', theme: 'system', referrer: 'https://www.mknoir.com/about', systemDark })
    assert.equal(result.colorScheme, systemDark ? 'dark' : 'light')
    assert.equal(result.localValues.get('theme'), 'system')
    assert.deepEqual(result.localWrites, [])
  }
})

test('blocked storage and quota failures still produce a complete visible appearance', () => {
  for (const options of [{ blockedSessionStorage: true, blockedLocalStorage: true }, { failStorageWrites: true }]) {
    const result = runBootstrap({ random: 0.5, ...options })
    assert.equal(result.appearance, 'orbit')
    assert.equal(result.colorScheme, 'light')
    assert.equal(result.classes.has('light'), true)
  }
  const restored = runBootstrap({ saved: 'mono', navigationType: 'back_forward', blockedLocalStorage: true, initialClasses: ['light'] })
  assert.equal(restored.appearance, 'mono')
  assert.equal(restored.colorScheme, 'light')
})
