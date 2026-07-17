export const RACES = [
  {
    id: 'human',
    name: 'Human',
    tagline: 'Versatile. Balanced. Born to lead.',
    description:
      'Humans excel in every path. Stronger parties, better trades, and unmatched versatility make them the backbone of any alliance. Choose a human if you want the most flexible build in Aden.',
    image: '/placeholder-human.jpg',
    accent: 'bg-[#E8DCC8]',
  },
  {
    id: 'elf',
    name: 'Elf',
    tagline: 'Swift. Graceful. Masters of the bow and magic.',
    description:
      'Elves combine deadly ranged precision with arcane mastery. They dominate forests and sieges alike — quick, elegant, and terrifying when focused.',
    image: '/placeholder-elf.jpg',
    accent: 'bg-[#C9E4DE]',
  },
  {
    id: 'dark-elf',
    name: 'Dark Elf',
    tagline: 'Shadow-walkers. Ruthless. Born from darkness.',
    description:
      'Dark Elves trade durability for devastating offense and cursed magic. Their footsteps are silent, their blades poisoned, and their intent unmistakable.',
    image: '/placeholder-dark-elf.jpg',
    accent: 'bg-[#3A2F35]',
  },
  {
    id: 'orc',
    name: 'Orc',
    tagline: 'Brutal. Unstoppable. Masters of raw power.',
    description:
      'Orcs are living siege engines. Higher HP, heavier armor, and berserk fury let them absorb punishment no other race can endure — then answer with overwhelming force.',
    image: '/placeholder-orc.jpg',
    accent: 'bg-[#9C7A5C]',
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    tagline: 'Stout. Crafty. Keepers of ancient wealth.',
    description:
      'Dwarves are shorter in stature but unmatched in craft and combat resilience. Master smiths, expert miners, and stubborn fighters who never break the line.',
    image: '/placeholder-dwarf.jpg',
    accent: 'bg-[#7A6B5D]',
  },
]

export const RACE_CLASSES = {
  human: {
    branches: [
      {
        id: 'human-fighter',
        name: 'Fighter',
        classes: [
          {
            id: 'human-fighter',
            name: 'Human Fighter',
            tier: 1,
            description: 'The balanced starting path for human warriors.',
          },
          {
            id: 'warrior',
            name: 'Warrior',
            tier: 2,
            description: 'Heavy infantry focused on sword-and-shield durability.',
            evolves: ['gladiator', 'warlord', 'paladin', 'dark-avenger'],
          },
          {
            id: 'knight',
            name: 'Knight',
            tier: 2,
            description: 'Defensive specialist suited to tanking and party support.',
            evolves: ['phoenix-knight', 'hell-knight'],
          },
          {
            id: 'rogue',
            name: 'Rogue',
            tier: 2,
            description: 'Dual-wield daggers and traps; critical-hit focused.',
            evolves: ['treasure-hunter', 'adventurer', 'hawkeye'],
          },
          {
            id: 'gladiator',
            name: 'Gladiator',
            tier: 3,
            description: 'Elite duelist. Pure PvP damage.',
            evolves: ['duelist'],
          },
          {
            id: 'warlord',
            name: 'Warlord',
            tier: 3,
            description: 'Symphony of war buffs and party-wide dominance.',
            evolves: ['dreadnought'],
          },
          {
            id: 'paladin',
            name: 'Paladin',
            tier: 3,
            description: 'Holy warrior; defensive magic + crowd control.',
            evolves: ['phoenix-knight'],
          },
          {
            id: 'dark-avenger',
            name: 'Dark Avenger',
            tier: 3,
            description: 'Debuff-heavy tank with resurrection utility.',
            evolves: ['hell-knight'],
          },
          {
            id: 'treasure-hunter',
            name: 'Treasure Hunter',
            tier: 3,
            description: 'Trap master and loot-focused assassin.',
            evolves: ['adventurer'],
          },
          {
            id: 'hawkeye',
            name: 'Hawkeye',
            tier: 3,
            description: 'Long-range precision marksman.',
            evolves: ['sagittarius'],
          },
        ],
      },
      {
        id: 'human-mystic',
        name: 'Mystic',
        classes: [
          {
            id: 'human-mystic',
            name: 'Human Mystic',
            tier: 1,
            description: 'Arcane initiate; choose magic or healing.',
          },
          {
            id: 'human-wizard',
            name: 'Human Wizard',
            tier: 2,
            description: 'Offensive caster with elemental burst magic.',
            evolves: ['sorcerer', 'necromancer', 'warlock'],
          },
          {
            id: 'cleric',
            name: 'Cleric',
            tier: 2,
            description: 'Healer and buffer; core support in every party.',
            evolves: ['bishop', 'prophet'],
          },
          {
            id: 'sorcerer',
            name: 'Sorcerer',
            tier: 3,
            description: 'Raw elemental DPS caster.',
            evolves: ['archmage'],
          },
          {
            id: 'necromancer',
            name: 'Necromancer',
            tier: 3,
            description: 'Minion and debuff oriented dark caster.',
            evolves: ['soultaker'],
          },
          {
            id: 'warlock',
            name: 'Warlock',
            tier: 3,
            description: 'Dark AoE and curse specialist.',
            evolves: ['arcana-lord'],
          },
          {
            id: 'bishop',
            name: 'Bishop',
            tier: 3,
            description: 'Top-tier healer with resurrection.',
            evolves: ['cardinal'],
          },
          {
            id: 'prophet',
            name: 'Prophet',
            tier: 3,
            description: 'Buff/debuff controller over a wide area.',
            evolves: ['hierophant'],
          },
        ],
      },
    ],
  },
  elf: {
    branches: [
      {
        id: 'elven-fighter',
        name: 'Fighter',
        classes: [
          { id: 'elven-fighter', name: 'Elven Fighter', tier: 1, description: 'Agile sword-and-bow starter.' },
          { id: 'elven-knight', name: 'Elven Knight', tier: 2, description: 'Defensive fighter tuned for aggro control.', evolves: ['temple-knight', 'swordsinger'] },
          { id: 'elven-scout', name: 'Elven Scout', tier: 2, description: 'Tracker and bow specialist.', evolves: ['plains-walker', 'silver-ranger'] },
          { id: 'temple-knight', name: 'Temple Knight', tier: 3, description: 'Faith-based tank with party buffs.', evolves: ['evas-templar'] },
          { id: 'swordsinger', name: 'Swordsinger', tier: 3, description: 'Dance buff party enchanter.', evolves: ['sword-muse'] },
          { id: 'plains-walker', name: 'Plainswalker', tier: 3, description: 'Mounted scout with trap skills.', evolves: ['wind-rider'] },
          { id: 'silver-ranger', name: 'Silver Ranger', tier: 3, description: 'Precision ranged DPS.', evolves: ['moonlight-sentinel'] },
        ],
      },
      {
        id: 'elven-mystic',
        name: 'Mystic',
        classes: [
          { id: 'elven-mystic', name: 'Elven Mystic', tier: 1, description: 'Nature-tuned spell starter.' },
          { id: 'elven-wizard', name: 'Elven Wizard', tier: 2, description: 'Fast casting hybrid magic.', evolves: ['spellsinger', 'elemental-summoner'] },
          { id: 'elven-oracle', name: 'Elven Oracle', tier: 2, description: 'Support healer with party resurrection utility.', evolves: ['elven-elder'] },
          { id: 'spellsinger', name: 'Spellsinger', tier: 3, description: 'AoE caster with song-enhanced spells.', evolves: ['mystic-muse'] },
          { id: 'elemental-summoner', name: 'Elemental Summoner', tier: 3, description: 'Pet-based magic siege class.', evolves: ['elemental-master'] },
          { id: 'elven-elder', name: 'Elven Elder', tier: 3, description: 'Versatile buffer and healer.', evolves: ['evas-saint'] },
        ],
      },
    ],
  },
  'dark-elf': {
    branches: [
      {
        id: 'dark-elven-fighter',
        name: 'Fighter',
        classes: [
          { id: 'dark-elven-fighter', name: 'Dark Elven Fighter', tier: 1, description: 'Stealth and poison starter.' },
          { id: 'dark-elven-knight', name: 'Palus Knight', tier: 2, description: 'Dark tank with bleed skills.', evolves: ['shillien-knight', 'bladedancer'] },
          { id: 'dark-elven-scout', name: 'Assassin', tier: 2, description: 'Critical backstab assassin.', evolves: ['abyss-walker', 'phantom-ranger'] },
          { id: 'shillien-knight', name: 'Shillien Knight', tier: 3, description: 'Magic-resistant dark tank.', evolves: ['shillien-templar'] },
          { id: 'bladedancer', name: 'Bladedancer', tier: 3, description: 'Dance debuffer with evasion buffs.', evolves: ['spectral-dancer'] },
          { id: 'abyss-walker', name: 'Abyss Walker', tier: 3, description: 'Fast stealth assassin.', evolves: ['ghost-hunter'] },
          { id: 'phantom-ranger', name: 'Phantom Ranger', tier: 3, description: 'Deadly ranged trap archer.', evolves: ['ghost-sentinel'] },
        ],
      },
      {
        id: 'dark-elven-mystic',
        name: 'Mystic',
        classes: [
          { id: 'dark-elven-mystic', name: 'Dark Elven Mystic', tier: 1, description: 'Cursed magic initiator.' },
          { id: 'dark-wizard', name: 'Dark Wizard', tier: 2, description: 'AoE curse and darkness magic.', evolves: ['spellhowler', 'phantom-summoner'] },
          { id: 'shillien-oracle', name: 'Shillien Oracle', tier: 2, description: 'Dark healer and party corruption cleanser.', evolves: ['shillien-elder'] },
          { id: 'spellhowler', name: 'Spellhowler', tier: 3, description: 'Sonic/curse area denial caster.', evolves: ['storm-screamer'] },
          { id: 'phantom-summoner', name: 'Phantom Summoner', tier: 3, description: 'Summons winged dark familiars.', evolves: ['spectral-master'] },
          { id: 'shillien-elder', name: 'Shillien Elder', tier: 3, description: 'Crowd-control-focused dark priest.', evolves: ['shillien-saint'] },
        ],
      },
    ],
  },
  orc: {
    branches: [
      {
        id: 'orc-fighter',
        name: 'Fighter',
        classes: [
          { id: 'orc-fighter', name: 'Orc Fighter', tier: 1, description: 'Brute-force melee starter.' },
          { id: 'orc-raider', name: 'Orc Raider', tier: 2, description: 'Berserk damage dealer.', evolves: ['destroyer', 'orc-monk'] },
          { id: 'orc-monk', name: 'Orc Monk', tier: 2, description: 'Fist-fighter with chaining binds.', evolves: ['tyrant', 'grand-khavatari'] },
          { id: 'destroyer', name: 'Destroyer', tier: 3, description: 'Soul-breaking two-hand brute.', evolves: ['titan'] },
          { id: 'tyrant', name: 'Tyrant', tier: 3, description: 'Stunning frontline fighter.', evolves: ['grand-khavatari'] },
        ],
      },
      {
        id: 'orc-mystic',
        name: 'Mystic',
        classes: [
          { id: 'orc-mystic', name: 'Orc Mystic', tier: 1, description: 'Shamanic magic starter.' },
          { id: 'orc-shaman', name: 'Orc Shaman', tier: 2, description: 'Buff shaman with totems.', evolves: ['overlord', 'warcryer'] },
          { id: 'overlord', name: 'Overlord', tier: 3, description: 'Siege commander with clan buffs.', evolves: ['dominator'] },
          { id: 'warcryer', name: 'Warcryer', tier: 3, description: 'Massive AoE and morale-shaking cries.', evolves: ['doomcryer'] },
        ],
      },
    ],
  },
  dwarf: {
    branches: [
      {
        id: 'dwarven-fighter',
        name: 'Fighter',
        classes: [
          { id: 'dwarven-fighter', name: 'Dwarven Fighter', tier: 1, description: 'Stout melee and crafting starter.' },
          { id: 'artisan', name: 'Artisan', tier: 2, description: 'Master crafter with SOS/BBS-type utility.', evolves: ['warsmith'] },
          { id: 'scavenger', name: 'Scavenger', tier: 2, description: 'Spoil looter with critical-hit ganks.', evolves: ['bounty-hunter'] },
          { id: 'warsmith', name: 'Warsmith', tier: 3, description: 'Siege weapon specialist.', evolves: ['maestro'] },
          { id: 'bounty-hunter', name: 'Bounty Hunter', tier: 3, description: 'Critical-specialized fighter with bounty mechanics.', evolves: ['fortune-seeker'] },
        ],
      },
    ],
  },
}

export const RACE_BRANCH_LABELS = {
  'human-fighter': 'Fighter',
  'human-mystic': 'Mystic',
  'elven-fighter': 'Fighter',
  'elven-mystic': 'Mystic',
  'dark-elven-fighter': 'Fighter',
  'dark-elven-mystic': 'Mystic',
  'orc-fighter': 'Fighter',
  'orc-mystic': 'Mystic',
  'dwarven-fighter': 'Fighter',
}
