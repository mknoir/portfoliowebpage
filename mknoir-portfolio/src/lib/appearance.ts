export type Appearance = 'field' | 'mono' | 'orbit' | 'atlas' | 'afterhours'

export const APPEARANCES = [
  { id: 'field', label: 'Seasons', description: 'A field journal. Take the scenic route.' },
  { id: 'mono', label: 'The Original', description: 'The familiar mknoir.com, in black and white.' },
  { id: 'orbit', label: 'The Lab', description: 'Step inside. Every object has a story.' },
  { id: 'atlas', label: 'Atlas', description: 'A map of the work, the interests, and their connections.' },
  { id: 'afterhours', label: 'After Hours', description: 'Work and play. Two sides of the same person.' },
] as const satisfies readonly { id: Appearance; label: string; description: string }[]

export const DEFAULT_COLOR_MODES = {
  field: 'light',
  mono: 'light',
  orbit: 'light',
  atlas: 'dark',
  afterhours: 'light',
} as const satisfies Record<Appearance, 'light' | 'dark'>

export const APPEARANCE_SESSION_KEY = 'mknoir:appearance'

export function isAppearance(value: unknown): value is Appearance {
  return typeof value === 'string' && APPEARANCES.some(({ id }) => id === value)
}

/**
 * Runs in the document head before hydration and next-themes initialization.
 * Reloads and fresh arrivals explore a new look; navigation within the site
 * keeps the current look and color preference. An explicit review URL wins.
 */
export const APPEARANCE_BOOTSTRAP = `(function () {
  var ids = ${JSON.stringify(APPEARANCES.map(({ id }) => id))};
  var defaults = ${JSON.stringify(DEFAULT_COLOR_MODES)};
  var storageKey = ${JSON.stringify(APPEARANCE_SESSION_KEY)};
  var root = document.documentElement;
  var requested = null;
  var saved = null;
  var navigationType = null;
  var internalReferrer = false;

  function valid(value) { return ids.indexOf(value) !== -1; }

  try {
    var queryValue = new URL(location.href).searchParams.get('look');
    if (valid(queryValue)) requested = queryValue;
  } catch (_) {}

  try {
    var savedValue = sessionStorage.getItem(storageKey);
    if (valid(savedValue)) saved = savedValue;
  } catch (_) {}

  try {
    var navigation = performance.getEntriesByType('navigation')[0];
    navigationType = navigation ? navigation.type : null;
  } catch (_) {}

  try {
    internalReferrer = Boolean(document.referrer) && new URL(document.referrer).origin === location.origin;
  } catch (_) {}

  var preserve = saved !== null && (
    navigationType === 'back_forward' ||
    (navigationType === 'navigate' && internalReferrer)
  );
  var selected = requested || (preserve ? saved : ids[Math.floor(Math.random() * ids.length)]);
  var resetColorMode = !preserve || (requested !== null && requested !== saved);
  var mode = defaults[selected];

  if (resetColorMode) {
    try { localStorage.setItem('theme', mode); } catch (_) {}
  } else {
    var currentTheme = null;
    try { currentTheme = localStorage.getItem('theme'); } catch (_) {}
    if (currentTheme === 'light' || currentTheme === 'dark') {
      mode = currentTheme;
    } else if (currentTheme === 'system') {
      try { mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch (_) {}
    } else if (root.classList.contains('dark')) {
      mode = 'dark';
    } else if (root.classList.contains('light')) {
      mode = 'light';
    }
  }

  root.dataset.appearance = selected;
  root.dataset.appearanceColorMode = mode;
  root.classList.remove('light', 'dark');
  root.classList.add(mode);
  root.style.colorScheme = mode;
  try { sessionStorage.setItem(storageKey, selected); } catch (_) {}
})();`
