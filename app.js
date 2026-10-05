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
    category: 'First Aid',
    keywords: ['cardiac arrest', 'heart attack', 'not breathing', 'unconscious', 'unresponsive', 'aed', 'defibrillator', 'chest compressions', 'resuscitation'],
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
    category: 'First Aid',
    keywords: ['blood', 'wound', 'cut', 'laceration', 'tourniquet', 'hemorrhage', 'haemorrhage', 'injury', 'stab'],
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
    category: 'First Aid',
    keywords: ['heimlich', 'airway', 'cannot breathe', 'food stuck', 'abdominal thrusts', 'back blows', 'throat'],
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
    category: 'First Aid',
    keywords: ['burn', 'fire', 'scald', 'hot water', 'blister', 'heat', 'flame'],
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
  },
  fracture: {
    category: 'First Aid',
    keywords: ['broken bone', 'fracture', 'splint', 'sprain', 'sling', 'arm', 'leg', 'fall', 'injury'],
    name: 'Fractures & Splinting',
    summary: 'For a suspected broken bone: pain, swelling, deformity, or being unable to use the limb.',
    steps: [
      { title: 'Call for help', text: 'Call your local emergency number if the injury is serious or you cannot move the person safely.' },
      { title: 'Control bleeding', text: 'If there is an open wound, press around it (not on any bone poking through) with a clean cloth.' },
      { title: 'Do not straighten it', text: 'Support the limb in the position you found it. Do not try to push a bone back in or realign the limb.' },
      { title: 'Improvise a splint', text: 'Pad the limb with cloth, then place something rigid (a stick, board, rolled magazine or trekking pole) along it. The splint should reach past the joints above and below the break.' },
      { title: 'Tie it in place', text: 'Secure the splint with strips of cloth, belts or tape above and below the injury, never directly over it. Firm but not tight.' },
      { title: 'Check circulation', text: 'Fingers or toes beyond the splint should stay warm and pink with normal feeling. Loosen the ties if they turn pale, blue, cold or numb.' },
      { title: 'Use a sling or buddy splint', text: 'Support an injured arm in a sling against the chest. With no splint material, tie an injured leg to the good leg with padding between them.' },
      { title: 'Reduce swelling and watch for shock', text: 'Apply a cold pack wrapped in cloth for up to 20 minutes. Keep the person warm and lying down if they look pale, sweaty or faint.' }
    ],
    warning: 'If you suspect a head, neck or back injury, keep the person completely still and do not move them unless they are in immediate danger.'
  },
  snakebite: {
    category: 'First Aid',
    keywords: ['snake', 'bite', 'venom', 'venomous', 'poison', 'animal', 'wilderness'],
    name: 'Snakebite',
    summary: 'For any bite from a snake that could be venomous. Treat every bite as venomous until proven otherwise.',
    steps: [
      { title: 'Move away', text: 'Get yourself and the person away from the snake. Do not try to catch or kill it. A photo from a safe distance can help doctors.' },
      { title: 'Call for help', text: 'Call your local emergency number. Antivenom is only available in hospital.' },
      { title: 'Keep still and calm', text: 'Have the person lie or sit still. Movement spreads venom faster. Carry them out rather than letting them walk if you can.' },
      { title: 'Remove tight items', text: 'Take off rings, watches, bracelets and tight clothing near the bite before swelling starts.' },
      { title: 'Immobilise the limb', text: 'Keep the bitten limb still, at roughly heart level, using a splint or sling if available.' },
      { title: 'Mark and record', text: 'Note the time of the bite. If a pen is available, mark the edge of the swelling with the time, and repeat every 15 minutes.' },
      { title: 'Do not do these', text: 'Do not cut the wound, suck out venom, apply a tourniquet, ice, or electric shock, or give alcohol.' }
    ],
    warning: 'In Australia and for some snake types, a firm pressure immobilisation bandage over the whole limb is recommended. Follow local guidance where you are.'
  },
  lost: {
    category: 'Stranded Survival',
    keywords: ['stranded', 'lost', 'wilderness', 'hiking', 'forest', 'desert', 'mountain', 'vehicle', 'car', 'snow', 'survival', 'no signal'],
    name: 'Lost or Stranded (Wilderness or Vehicle)',
    summary: 'When you are lost, cut off, or stuck somewhere remote and waiting for rescue.',
    steps: [
      { title: 'S.T.O.P.', text: 'Stop, Think, Observe, Plan. Sit down, breathe and calm yourself. Panic wastes energy and leads to bad decisions.' },
      { title: 'Stay put', text: 'If anyone knows your route, stay where you are. Stay with your vehicle: it is far easier for rescuers to spot than a person, and it is a ready-made shelter.' },
      { title: 'Try to call or text', text: 'Try your emergency number even with weak or no signal from your own network. If calls fail, send a text: texts often get through when calls cannot. Share your location if you can.' },
      { title: 'Save your battery', text: 'Turn on low-power mode, close apps, lower screen brightness and only check the phone at set times. Keep it warm in an inside pocket.' },
      { title: 'Prioritise with the rule of 3s', text: 'You can survive about 3 hours exposed in harsh weather, 3 days without water and 3 weeks without food. Shelter first, then water, then food.' },
      { title: 'Make shelter', text: 'Get out of wind, rain and sun. Use your vehicle, rock overhangs, or branches and a tarp. Insulate yourself from the ground with branches, leaves or a pack.' },
      { title: 'Be visible', text: 'Spread bright clothing or a tarp in the open and prepare signals (see the Signalling for Rescue protocol). Use the siren and SOS flasher in this app.' },
      { title: 'Stuck in a car in snow', text: 'Keep the exhaust pipe clear of snow. Run the engine for about 10 minutes each hour for heat, with a window slightly open, to avoid carbon monoxide poisoning.' },
      { title: 'If you must move', text: 'Leave a note with your direction and time. Move only in daylight, mark your path, and follow a trail, road or stream downhill towards people.' }
    ],
    warning: 'Never split up a group, and avoid travelling at night or in bad weather.'
  },
  water: {
    category: 'Stranded Survival',
    keywords: ['water', 'drink', 'thirst', 'dehydration', 'purify', 'boil', 'filter', 'rain', 'stranded', 'survival'],
    name: 'Finding & Purifying Water',
    summary: 'How to find, collect and make water safe to drink when stranded.',
    steps: [
      { title: 'Conserve body water', text: 'Rest in shade, avoid exertion in the heat of the day, and do not ration water you already have: drink when thirsty.' },
      { title: 'Find sources', text: 'Look for flowing streams, springs and rain. Green vegetation and animal tracks often lead to water. Wipe a cloth over dewy grass at dawn and wring it out.' },
      { title: 'Collect rain', text: 'Spread a tarp, plastic sheet or jacket to channel rain into containers.' },
      { title: 'Melt snow first', text: 'Melt snow or ice before drinking. Eating it lowers your body temperature.' },
      { title: 'Filter', text: 'Pour cloudy water through a cloth, or let it settle and pour off the clear water. This removes dirt but does not make it safe.' },
      { title: 'Boil it', text: 'Bring water to a rolling boil for 1 minute (3 minutes above 2,000 m / 6,500 ft), then let it cool. This is the most reliable method.' },
      { title: 'Or disinfect it', text: 'Use purification tablets as directed, or add 2 drops of plain unscented household bleach per litre of clear water and wait 30 minutes. In strong sun, a clear plastic bottle left in full sunlight for 6 hours (2 days if cloudy) also works.' },
      { title: 'Watch for dehydration', text: 'Dark urine, headache, dizziness and confusion mean you need water urgently.' }
    ],
    warning: 'Never drink seawater, urine or alcohol. Boiling and bleach do not remove chemicals or fuel, so avoid water that looks or smells contaminated.'
  },
  hypothermia: {
    category: 'Stranded Survival',
    keywords: ['cold', 'freezing', 'shivering', 'hypothermia', 'snow', 'winter', 'wet', 'warm', 'frostbite', 'stranded'],
    name: 'Hypothermia & Staying Warm',
    summary: 'Signs: intense shivering, confusion, slurred speech, clumsy hands, drowsiness. Shivering may stop as it gets worse.',
    steps: [
      { title: 'Call for help', text: 'Call your local emergency number. Hypothermia can be life-threatening.' },
      { title: 'Get out of the cold', text: 'Move into shelter, out of the wind and wet. Handle the person gently.' },
      { title: 'Replace wet clothing', text: 'Remove wet clothes and replace them with dry layers. Cover the head and neck.' },
      { title: 'Insulate from the ground', text: 'Put branches, a pack, foam or extra clothing underneath them. The ground draws heat away fast.' },
      { title: 'Warm the core first', text: 'Wrap them in blankets or a sleeping bag. Warm the chest, neck, armpits and groin with warm (not hot) packs or skin-to-skin contact.' },
      { title: 'Warm drinks if alert', text: 'Give warm, sweet, non-alcoholic drinks only if the person is fully awake and can swallow.' },
      { title: 'Avoid these', text: 'Do not rub or massage limbs, use hot baths or direct heat, or give alcohol or caffeine.' },
      { title: 'Be ready for CPR', text: 'If they become unresponsive and stop breathing normally, start CPR.' }
    ],
    warning: 'Someone with severe hypothermia can look dead. Keep caring for them until medical help takes over.'
  },
  heatstroke: {
    category: 'Stranded Survival',
    keywords: ['heat', 'hot', 'sun', 'heatstroke', 'heat exhaustion', 'desert', 'summer', 'dehydration', 'fainting', 'stranded'],
    name: 'Heatstroke & Heat Exhaustion',
    summary: 'Heat exhaustion: heavy sweating, cramps, weakness, nausea. Heatstroke: very hot skin, confusion, collapse or seizure. Heatstroke is life-threatening.',
    steps: [
      { title: 'Call for help', text: 'Call your local emergency number for any confusion, collapse, seizure or a body temperature of 40°C (104°F) or higher.' },
      { title: 'Move to shade', text: 'Get the person out of the sun into the coolest place available.' },
      { title: 'Cool them fast', text: 'Soak the skin with cool water and fan them. Put cold packs or wet cloths on the neck, armpits and groin. Immersing in cool water is best if possible.' },
      { title: 'Loosen clothing', text: 'Remove extra layers and loosen tight clothing.' },
      { title: 'Give fluids if alert', text: 'Give sips of water or a sports drink only if they are awake and can swallow.' },
      { title: 'Position them', text: 'Lie them down with legs slightly raised. If drowsy or vomiting, place them on their side in the recovery position.' },
      { title: 'Keep monitoring', text: 'Keep cooling until they improve or help arrives. Start CPR if they stop breathing normally.' }
    ],
    warning: 'Do not give fluids to someone who is confused or unconscious, and do not give paracetamol or aspirin for heatstroke.'
  },
  signal: {
    category: 'Stranded Survival',
    keywords: ['rescue', 'signal', 'sos', 'help', 'mirror', 'whistle', 'fire', 'smoke', 'helicopter', 'aircraft', 'stranded', 'lost'],
    name: 'Signalling for Rescue',
    summary: 'How to make yourself visible and audible to searchers on the ground and in the air.',
    steps: [
      { title: 'Use this app', text: 'The Acoustic Siren and the SOS Flasher above are designed for this. Use them when you see or hear searchers, to save battery.' },
      { title: 'Signals in threes', text: 'Three of anything means distress: 3 whistle blasts, 3 flashes, 3 shouts or 3 fires in a triangle. Pause, then repeat.' },
      { title: 'Whistle', text: 'A whistle carries much farther than your voice and uses far less energy.' },
      { title: 'Mirror flash', text: 'Use a mirror, phone screen, CD or foil. Hold out a V with two fingers around the aircraft or searcher, and tilt the mirror so the light spot lands between your fingers.' },
      { title: 'Ground-to-air symbols', text: 'In an open area, build letters at least 3 m (10 ft) tall from rocks, logs or clothing that contrast with the ground: SOS, V (need assistance) or X (need medical help).' },
      { title: 'Smoke and fire', text: 'By day, add green leaves to a fire for thick white smoke. By night, keep a bright flame. Keep fires small and controlled.' },
      { title: 'Body signals to aircraft', text: 'Both arms raised in a Y means "Yes, we need help". One arm up and one arm down means "No, we do not need help".' }
    ],
    warning: 'Signal only with fire where it is safe to do so. A wildfire puts you and rescuers in danger.'
  },
  earthquake: {
    category: 'Disasters',
    keywords: ['earthquake', 'quake', 'tremor', 'shaking', 'aftershock', 'tsunami', 'collapse', 'trapped', 'disaster'],
    name: 'Earthquake',
    summary: 'What to do during and right after an earthquake.',
    steps: [
      { title: 'Drop', text: 'Get down on your hands and knees before the shaking knocks you down.' },
      { title: 'Cover', text: 'Get under a sturdy table or desk. If there is none, get next to an interior wall away from windows and cover your head and neck with your arms.' },
      { title: 'Hold on', text: 'Hold on to your shelter until the shaking stops. Do not run outside during shaking, and do not stand in a doorway.' },
      { title: 'If you are elsewhere', text: 'In bed: stay there and cover your head with a pillow. Outdoors: move away from buildings, trees and power lines, then drop. Driving: pull over away from bridges and overpasses and stay in the car.' },
      { title: 'After the shaking', text: 'Check yourself and others for injuries. Expect aftershocks. Leave damaged buildings carefully and stay clear of them.' },
      { title: 'Gas and power', text: 'If you smell gas, leave immediately and do not use flames, lighters or light switches.' },
      { title: 'If trapped', text: 'Cover your mouth with cloth. Tap on a pipe or wall or use a whistle rather than shouting, to save energy and avoid inhaling dust.' },
      { title: 'Near the coast', text: 'If shaking was strong or long, move to high ground immediately. A tsunami can arrive within minutes.' }
    ],
    warning: 'Do not use elevators after an earthquake.'
  },
  flood: {
    category: 'Disasters',
    keywords: ['flood', 'flash flood', 'water', 'rain', 'storm', 'hurricane', 'cyclone', 'river', 'disaster'],
    name: 'Flood & Flash Flood',
    summary: 'How to stay safe when water is rising.',
    steps: [
      { title: 'Get to high ground', text: 'Move to higher ground immediately. Do not wait to be told.' },
      { title: 'Turn around, don\'t drown', text: 'Never walk, swim or drive through flood water. 15 cm (6 in) of moving water can knock you over, and 30 cm (1 ft) can float a car.' },
      { title: 'Trapped in a building', text: 'Go to the highest floor. Avoid a closed attic, where you can be trapped by rising water. Go onto the roof only if necessary, and signal for help.' },
      { title: 'Trapped in a car', text: 'If water is rising around your car, unbuckle, open or break the window, get out and climb onto the roof.' },
      { title: 'Electricity', text: 'Turn off power at the main switch only if you can do so without standing in water. Stay away from fallen power lines.' },
      { title: 'Avoid flood water', text: 'Flood water often carries sewage, chemicals and debris. Wash any skin that touches it and do not drink it (see Finding & Purifying Water).' },
      { title: 'Return safely', text: 'Go home only when authorities say it is safe, and watch for weakened floors, walls and roads.' }
    ],
    warning: 'Flash floods can arrive within minutes of heavy rain, even where it is not raining.'
  },
  fire: {
    category: 'Disasters',
    keywords: ['fire', 'smoke', 'house fire', 'building', 'evacuate', 'escape', 'trapped', 'burning', 'disaster'],
    name: 'House Fire & Smoke Escape',
    summary: 'How to get out of a burning building safely.',
    steps: [
      { title: 'Alert everyone', text: 'Shout "Fire!" and get everyone out. Do not stop to collect belongings.' },
      { title: 'Stay low', text: 'Smoke rises and kills faster than flames. Crawl under the smoke, where the air is cleaner.' },
      { title: 'Check doors', text: 'Touch a closed door with the back of your hand before opening it. If it is hot, use another way out.' },
      { title: 'Close doors behind you', text: 'Closing doors slows the spread of fire and smoke.' },
      { title: 'Call from outside', text: 'Once you are out, call your local emergency number and go to a meeting point away from the building.' },
      { title: 'If you are trapped', text: 'Close the door, seal gaps with wet cloth, and signal from a window with a cloth or a light while you call for help.' },
      { title: 'If clothes catch fire', text: 'Stop, drop and roll, then cool any burns (see Thermal Burn Treatment).' }
    ],
    warning: 'Never go back inside a burning building.'
  }
};

const CATEGORY_ORDER = ['First Aid', 'Stranded Survival', 'Disasters'];

const Protocols = (() => {
  let select;
  let output;
  let searchForm;
  let searchInput;
  let results;

  // Lowercased text per protocol, built once. Name and keyword hits rank above body text.
  const index = Object.entries(PROTOCOLS).map(([key, p]) => ({
    key,
    name: p.name.toLowerCase(),
    keywords: p.keywords.map((k) => k.toLowerCase()),
    body: [p.summary, p.warning, ...p.steps.map((s) => `${s.title} ${s.text}`)].join(' ').toLowerCase()
  }));

  function scoreTerm(entry, term) {
    let score = 0;
    if (entry.name.includes(term)) score += 5;
    if (entry.keywords.includes(term)) score += 4;
    else if (entry.keywords.some((k) => k.includes(term))) score += 2;
    if (!score && entry.body.includes(term)) score = 1;
    return score;
  }

  function search(query) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];

    return index
      .map((entry) => {
        let score = 0;
        for (const term of terms) {
          const termScore = scoreTerm(entry, term);
          if (!termScore) return null; // every term must match somewhere
          score += termScore;
        }
        return { key: entry.key, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map((match) => match.key);
  }

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

  function open(key) {
    select.value = key;
    render(key);
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderResults(query) {
    results.replaceChildren();
    const trimmed = query.trim();
    if (!trimmed) return [];

    const matches = search(trimmed);
    const count = document.createElement('p');
    count.className = 'search-count';
    count.textContent = matches.length
      ? `${matches.length} protocol${matches.length === 1 ? '' : 's'} found for "${trimmed}"`
      : `No protocols match "${trimmed}". Try words like water, cold, lost, snake or fire.`;
    results.append(count);

    if (matches.length) {
      const list = document.createElement('ul');
      list.className = 'search-list';
      matches.forEach((key) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'search-result';
        button.dataset.key = key;

        const name = document.createElement('span');
        name.className = 'search-result-name';
        name.textContent = PROTOCOLS[key].name;
        const category = document.createElement('span');
        category.className = 'search-result-category';
        category.textContent = PROTOCOLS[key].category;

        button.append(name, category);
        item.append(button);
        list.append(item);
      });
      results.append(list);
    }
    return matches;
  }

  function buildSelect() {
    CATEGORY_ORDER.forEach((category) => {
      const group = document.createElement('optgroup');
      group.label = category;
      Object.entries(PROTOCOLS)
        .filter(([, p]) => p.category === category)
        .forEach(([key, p]) => group.append(new Option(p.name, key)));
      if (group.children.length) select.append(group);
    });
  }

  function init() {
    select = document.getElementById('protocol-select');
    output = document.getElementById('protocol-output');
    searchForm = document.getElementById('protocol-search-form');
    searchInput = document.getElementById('protocol-search');
    results = document.getElementById('protocol-results');

    buildSelect();

    select.addEventListener('change', () => render(select.value));
    searchInput.addEventListener('input', () => renderResults(searchInput.value));
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const matches = renderResults(searchInput.value);
      if (matches.length) open(matches[0]);
    });
    results.addEventListener('click', (event) => {
      const button = event.target.closest('.search-result');
      if (button) open(button.dataset.key);
    });
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
