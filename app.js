/* ==========================================================================
   Life Saver: app logic
   Modules: Protocols, Siren, SosFlasher, Vault, NetworkStatus, PWA
   ========================================================================== */
'use strict';

/* --------------------------------------------------------------------------
   1. First-Aid & Emergency Protocol Engine
   -------------------------------------------------------------------------- */
const PROTOCOLS = {
  cpr: {
    name: 'CPR (Cardiopulmonary Resuscitation)',
    summary: 'For an adult who is unresponsive and not breathing normally (or only gasping).',
    steps: [
      { title: 'Check the scene', text: 'Make sure the area is safe for you and the person.' },
      { title: 'Check responsiveness', text: 'Tap their shoulders and shout "Are you OK?". Look for normal breathing for no more than 10 seconds.' },
      { title: 'Call for help', text: 'Call your local emergency number (or have someone else call) and ask for an AED (defibrillator) to be brought.' },
      { title: 'Position your hands', text: 'Lay the person on their back on a firm surface. Place the heel of one hand in the centre of the chest (lower half of the breastbone) and your other hand on top, fingers interlocked.' },
      { title: 'Push hard and fast', text: 'With straight arms, compress the chest at least 5 cm (2 in) deep at 100 to 120 compressions per minute. Let the chest fully recoil between compressions.' },
      { title: 'Give rescue breaths if trained', text: 'After 30 compressions, tilt the head back, lift the chin, pinch the nose and give 2 breaths of about 1 second each, watching for the chest to rise. If you are not trained, do continuous hands-only compressions.' },
      { title: 'Use the AED', text: 'As soon as an AED arrives, switch it on and follow its voice prompts. Keep pauses in compressions as short as possible.' },
      { title: 'Keep going', text: 'Continue cycles of 30 compressions and 2 breaths until the person starts breathing normally, help takes over, or you are physically unable to continue.' }
    ],
    warning: 'For children and infants, compression depth and technique differ. Follow the emergency dispatcher\'s instructions if you can.'
  },
  bleeding: {
    name: 'Severe Bleeding Control',
    summary: 'For heavy, spurting or pooling blood that does not stop quickly.',
    steps: [
      { title: 'Call for help', text: 'Call your local emergency number immediately.' },
      { title: 'Protect yourself', text: 'Wear gloves or use a plastic bag as a barrier if one is available.' },
      { title: 'Find the source', text: 'Expose the wound by removing or cutting away clothing so you can see where the blood is coming from.' },
      { title: 'Apply firm, direct pressure', text: 'Press hard on the wound with a clean cloth, gauze or your hand, and keep pushing continuously.' },
      { title: 'Do not lift the dressing', text: 'If blood soaks through, add more cloth on top and keep pressing. Removing the first layer can restart the bleeding.' },
      { title: 'Pack deep wounds', text: 'For a deep wound in the neck, armpit or groin, pack cloth or gauze tightly into the wound, then hold firm pressure on top.' },
      { title: 'Use a tourniquet on a limb if needed', text: 'If pressure fails on an arm or leg, apply a tourniquet 5 to 7 cm (2 to 3 in) above the wound, not over a joint. Tighten until the bleeding stops and note the time it was applied.' },
      { title: 'Treat for shock', text: 'Keep the person lying down and warm with a blanket or coat, and reassure them until help arrives.' }
    ],
    warning: 'Never remove a tourniquet once applied. Leave that to medical professionals.'
  },
  choking: {
    name: 'Heimlich Maneuver (Choking)',
    summary: 'For a conscious adult or child over 1 year who cannot breathe, cough or speak.',
    steps: [
      { title: 'Confirm choking', text: 'Ask "Are you choking?". If they can cough forcefully, encourage them to keep coughing.' },
      { title: 'Call for help', text: 'If they cannot breathe, cough or speak, have someone call your local emergency number.' },
      { title: 'Give 5 back blows', text: 'Stand slightly behind them, support their chest with one hand and lean them forward. Give 5 firm blows between the shoulder blades with the heel of your hand.' },
      { title: 'Position for abdominal thrusts', text: 'Stand behind them and wrap your arms around their waist. Make a fist and place the thumb side just above the navel, well below the breastbone.' },
      { title: 'Give 5 abdominal thrusts', text: 'Grasp your fist with your other hand and give quick, hard thrusts inward and upward.' },
      { title: 'Repeat', text: 'Alternate 5 back blows and 5 abdominal thrusts until the object comes out or the person becomes unresponsive.' },
      { title: 'If they become unresponsive', text: 'Lower them to the ground, call emergency services if not done, and start CPR. Look in the mouth before rescue breaths and remove any object you can see.' }
    ],
    warning: 'For pregnant or larger people, use chest thrusts instead of abdominal thrusts. For infants under 1, use back blows and two-finger chest thrusts, never abdominal thrusts. Anyone who received abdominal thrusts should be checked by a doctor.'
  },
  burns: {
    name: 'Thermal Burn Treatment',
    summary: 'For burns from heat, flames, hot liquids or hot surfaces.',
    steps: [
      { title: 'Stop the burning', text: 'Move the person away from the heat source. If clothing is on fire: stop, drop and roll, or smother the flames.' },
      { title: 'Cool the burn', text: 'Hold the burn under cool (not ice-cold) running water for 20 minutes. Start as soon as possible.' },
      { title: 'Remove constrictions', text: 'Gently remove rings, watches, belts and tight clothing near the burn before swelling starts. Do not pull off anything stuck to the skin.' },
      { title: 'Cover loosely', text: 'Cover with cling film laid on lengthwise, or a clean, non-fluffy dressing. Do not wrap tightly.' },
      { title: 'Avoid home remedies', text: 'Do not apply ice, butter, oils, toothpaste or creams, and do not pop blisters.' },
      { title: 'Keep them warm', text: 'Cool the burn, not the person. Keep the rest of the body warm to prevent hypothermia.' },
      { title: 'Get medical help', text: 'Seek emergency care for burns larger than the person\'s palm, deep burns, or burns on the face, hands, feet, joints or genitals, and for any electrical or chemical burn.' }
    ],
    warning: 'Call emergency services right away if the person has trouble breathing or was in a smoke-filled space.'
  }
};

const Protocols = (() => {
  let select;
  let output;

  function render(key) {
    output.replaceChildren();
    const protocol = PROTOCOLS[key];
    if (!protocol) return;

    const heading = document.createElement('h3');
    heading.textContent = protocol.name;

    const summary = document.createElement('p');
    summary.className = 'protocol-summary';
    summary.textContent = protocol.summary;

    const list = document.createElement('ol');
    list.className = 'protocol-steps';
    protocol.steps.forEach(({ title, text }) => {
      const item = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = `${title}: `;
      item.append(strong, document.createTextNode(text));
      list.append(item);
    });

    output.append(heading, summary, list);

    if (protocol.warning) {
      const warning = document.createElement('p');
      warning.className = 'protocol-warning';
      warning.textContent = `⚠ ${protocol.warning}`;
      output.append(warning);
    }
  }

  function init() {
    select = document.getElementById('protocol-select');
    output = document.getElementById('protocol-output');

    Object.entries(PROTOCOLS).forEach(([key, { name }]) => {
      select.add(new Option(name, key));
    });

    select.addEventListener('change', () => render(select.value));
  }

  return { init };
})();

/* --------------------------------------------------------------------------
   2a. Acoustic Emergency Siren (Web Audio API)
   -------------------------------------------------------------------------- */
const Siren = (() => {
  const LOW_HZ = 800;
  const HIGH_HZ = 1200;
  const SWEEP_SECONDS = 0.6;   // one ramp, up or down
  const LOOKAHEAD_SECONDS = 2; // schedule ahead to survive background-tab timer throttling
  const VOLUME = 0.5;

  let ctx = null;
  let osc = null;
  let gain = null;
  let timer = null;
  let nextSweepAt = 0;
  let playing = false;
  let button;
  let status;

  function getContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    return ctx;
  }

  // Queue exponential 800 -> 1200 -> 800 Hz sweeps ahead of the playhead.
  function scheduleSweeps() {
    const freq = osc.frequency;
    while (nextSweepAt < ctx.currentTime + LOOKAHEAD_SECONDS) {
      freq.setValueAtTime(LOW_HZ, nextSweepAt);
      freq.exponentialRampToValueAtTime(HIGH_HZ, nextSweepAt + SWEEP_SECONDS);
      freq.exponentialRampToValueAtTime(LOW_HZ, nextSweepAt + SWEEP_SECONDS * 2);
      nextSweepAt += SWEEP_SECONDS * 2;
    }
  }

  async function start() {
    const audio = getContext();
    if (!audio) {
      status.textContent = 'Audio is not supported in this browser.';
      return;
    }
    if (audio.state === 'suspended') await audio.resume();

    const now = audio.currentTime;
    gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(VOLUME, now + 0.05);
    gain.connect(audio.destination);

    osc = audio.createOscillator();
    osc.type = 'square';
    osc.connect(gain);

    nextSweepAt = now;
    scheduleSweeps();
    osc.start(now);
    timer = setInterval(scheduleSweeps, 250);

    playing = true;
    updateUi();
  }

  function stop() {
    if (!playing) return;
    clearInterval(timer);
    timer = null;

    const now = ctx.currentTime;
    const oldOsc = osc;
    const oldGain = gain;
    oldOsc.frequency.cancelScheduledValues(now);
    oldGain.gain.cancelScheduledValues(now);
    oldGain.gain.setValueAtTime(oldGain.gain.value, now);
    oldGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    oldOsc.stop(now + 0.06);
    oldOsc.onended = () => {
      oldOsc.disconnect();
      oldGain.disconnect();
    };

    osc = null;
    gain = null;
    playing = false;
    updateUi();
  }

  function updateUi() {
    button.setAttribute('aria-pressed', String(playing));
    button.textContent = playing ? 'Stop Siren' : 'Start Siren';
    status.textContent = playing ? 'Siren is sounding.' : '';
  }

  function toggle() {
    if (playing) {
      stop();
    } else {
      start().catch((err) => {
        console.error('Siren failed to start', err);
        status.textContent = 'Could not start the siren. Tap again to retry.';
      });
    }
  }

  function init() {
    button = document.getElementById('siren-btn');
    status = document.getElementById('siren-status');
    button.addEventListener('click', toggle);
  }

  return { init, stop };
})();

/* --------------------------------------------------------------------------
   2b. Optical Screen SOS Flasher (Morse: ... --- ...)
   -------------------------------------------------------------------------- */
const SosFlasher = (() => {
  const UNIT_MS = 250; // standard Morse timing: dot = 1 unit, dash = 3 units

  // [lightOn, durationInUnits] pairs for one full "SOS" word, including the word gap.
  const SEQUENCE = (() => {
    const DOT = [true, 1];
    const DASH = [true, 3];
    const SYMBOL_GAP = [false, 1];
    const LETTER_GAP = [false, 3];
    const WORD_GAP = [false, 7];

    const letter = (symbol) => [symbol, SYMBOL_GAP, symbol, SYMBOL_GAP, symbol];
    const seq = [...letter(DOT), LETTER_GAP, ...letter(DASH), LETTER_GAP, ...letter(DOT), WORD_GAP];
    return seq;
  })();

  let overlay;
  let button;
  let timeoutId = null;
  let index = 0;
  let active = false;
  let wakeLock = null;

  function step() {
    const [lightOn, units] = SEQUENCE[index];
    overlay.classList.toggle('is-on', lightOn);
    index = (index + 1) % SEQUENCE.length;
    timeoutId = setTimeout(step, units * UNIT_MS);
  }

  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch {
      wakeLock = null; // Not critical: the flasher works without it.
    }
  }

  function start() {
    if (active) return;
    active = true;
    index = 0;
    overlay.hidden = false;
    overlay.focus();

    const root = document.documentElement;
    if (root.requestFullscreen && !document.fullscreenElement) {
      root.requestFullscreen().catch(() => {});
    }
    requestWakeLock();
    step();
  }

  function stop() {
    if (!active) return;
    active = false;
    clearTimeout(timeoutId);
    timeoutId = null;
    overlay.classList.remove('is-on');
    overlay.hidden = true;

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    if (wakeLock) {
      wakeLock.release().catch(() => {});
      wakeLock = null;
    }
    button.focus();
  }

  function init() {
    overlay = document.getElementById('sos-overlay');
    button = document.getElementById('sos-btn');
    overlay.tabIndex = -1;

    button.addEventListener('click', start);
    overlay.addEventListener('click', stop);
    document.addEventListener('keydown', (event) => {
      if (active && (event.key === 'Escape' || event.key === 'Esc')) stop();
    });
    // In fullscreen, browsers consume Esc to exit fullscreen, so treat that exit as "stop".
    document.addEventListener('fullscreenchange', () => {
      if (active && !document.fullscreenElement) stop();
    });
    // The browser drops wake locks when the tab is hidden; re-acquire on return.
    document.addEventListener('visibilitychange', () => {
      if (active && document.visibilityState === 'visible') requestWakeLock();
    });
  }

  return { init, stop };
})();

/* --------------------------------------------------------------------------
   3. Offline Medical ID & Emergency Data Vault (localStorage)
   -------------------------------------------------------------------------- */
const Vault = (() => {
  const STORAGE_KEY = 'lifeSaver.medicalVault.v1';
  const FIELDS = ['fullName', 'bloodGroup', 'contacts', 'medical'];

  let form;
  let feedback;
  let feedbackTimer = null;

  function showFeedback(message, type = 'info') {
    clearTimeout(feedbackTimer);
    feedback.textContent = message;
    feedback.className = `feedback is-${type}`;
    feedbackTimer = setTimeout(() => {
      feedback.textContent = '';
      feedback.className = 'feedback';
    }, 6000);
  }

  function readForm() {
    const data = {};
    FIELDS.forEach((name) => {
      data[name] = form.elements[name].value.trim();
    });
    return data;
  }

  function fillForm(data) {
    FIELDS.forEach((name) => {
      form.elements[name].value = typeof data[name] === 'string' ? data[name] : '';
    });
  }

  function readStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  }

  function formatDate(iso) {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? 'an earlier session' : date.toLocaleString();
  }

  function save(event) {
    event.preventDefault();
    const data = readForm();
    if (FIELDS.every((name) => data[name] === '')) {
      showFeedback('Nothing to save yet. Fill in at least one field.', 'error');
      return;
    }
    try {
      const record = { ...data, savedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      showFeedback(`✓ Medical ID saved on this device at ${formatDate(record.savedAt)}.`, 'success');
    } catch (err) {
      console.error('Vault save failed', err);
      showFeedback('Could not save. Storage may be full or disabled (private browsing).', 'error');
    }
  }

  function load({ silentIfEmpty = false } = {}) {
    try {
      const record = readStorage();
      if (!record) {
        if (!silentIfEmpty) showFeedback('No saved Medical ID found on this device.', 'info');
        return;
      }
      fillForm(record);
      showFeedback(`✓ Loaded Medical ID saved ${formatDate(record.savedAt)}.`, 'success');
    } catch (err) {
      console.error('Vault load failed', err);
      showFeedback('Saved data could not be read. It may be corrupted or storage is blocked.', 'error');
    }
  }

  function clear() {
    if (!window.confirm('Delete the Medical ID stored on this device?')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      form.reset();
      showFeedback('Vault cleared from this device.', 'info');
    } catch (err) {
      console.error('Vault clear failed', err);
      showFeedback('Could not clear the vault. Storage may be blocked.', 'error');
    }
  }

  function init() {
    form = document.getElementById('vault-form');
    feedback = document.getElementById('vault-feedback');
    form.addEventListener('submit', save);
    document.getElementById('vault-load').addEventListener('click', () => load());
    document.getElementById('vault-clear').addEventListener('click', clear);
    load({ silentIfEmpty: true });
  }

  return { init };
})();

/* --------------------------------------------------------------------------
   Network status indicator
   -------------------------------------------------------------------------- */
const NetworkStatus = (() => {
  let badge;

  function update() {
    const online = navigator.onLine;
    badge.textContent = online ? 'Network: Online' : 'Network: Offline (all tools still work)';
    badge.classList.toggle('is-offline', !online);
  }

  function init() {
    badge = document.getElementById('network-status');
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  }

  return { init };
})();

/* --------------------------------------------------------------------------
   PWA: Service Worker registration
   -------------------------------------------------------------------------- */
const PWA = (() => {
  function init() {
    if (!('serviceWorker' in navigator)) return;
    // Service workers need HTTPS or localhost; skip quietly on file:// previews.
    if (!window.isSecureContext) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .catch((err) => console.error('Service worker registration failed', err));
    });
  }

  return { init };
})();

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  Protocols.init();
  Siren.init();
  SosFlasher.init();
  Vault.init();
  NetworkStatus.init();
});

PWA.init();

// Silence alarms if the app is being closed or navigated away from.
window.addEventListener('pagehide', () => {
  Siren.stop();
  SosFlasher.stop();
});
