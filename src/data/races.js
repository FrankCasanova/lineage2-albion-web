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

export const CLASS_TREES = {
  human: [
    {
      id: 'human-fighter',
      name: 'Fighter',
      tree: {
        id: 'human-fighter',
        name: 'Human Fighter',
        tier: 1,
        description: 'The balanced starting path for human warriors.',
        children: [
          {
            id: 'warrior',
            name: 'Warrior',
            tier: 2,
            description: 'Heavy infantry focused on sword-and-shield durability.',
            children: [
              {
                id: 'gladiator',
                name: 'Gladiator',
                tier: 3,
                description: 'Elite duelist. Pure PvP damage.',
                children: [
                  { id: 'duelist', name: 'Duelist', tier: 3, description: 'Premier PvP swordmaster.', children: [] },
                ],
              },
              {
                id: 'warlord',
                name: 'Warlord',
                tier: 3,
                description: 'Symphony of war buffs and party-wide dominance.',
                children: [
                  { id: 'dreadnought', name: 'Dreadnought', tier: 3, description: 'Siege and party-overlord tank.', children: [] },
                ],
              },
              {
                id: 'knight',
                name: 'Knight',
                tier: 3,
                description: 'Defensive specialist suited to tanking and party support.',
                children: [
                  { id: 'phoenix-knight', name: 'Phoenix Knight', tier: 3, description: 'Holy siege tank with revival skills.', children: [] },
                ],
              },
              {
                id: 'dark-avenger',
                name: 'Dark Avenger',
                tier: 3,
                description: 'Debuff-heavy tank with resurrection utility.',
                children: [
                  { id: 'hell-knight', name: 'Hell Knight', tier: 3, description: 'Dark debuff tank and enforcer.', children: [] },
                ],
              },
            ],
          },
          {
            id: 'rogue',
            name: 'Rogue',
            tier: 2,
            description: 'Dual-wield daggers and traps; critical-hit focused.',
            children: [
              {
                id: 'treasure-hunter',
                name: 'Treasure Hunter',
                tier: 3,
                description: 'Trap master and loot-focused assassin.',
                children: [
                  { id: 'adventurer', name: 'Adventurer', tier: 3, description: 'Hybrid fighter with strong solo gank tools.', children: [] },
                ],
              },
              {
                id: 'hawkeye',
                name: 'Hawkeye',
                tier: 3,
                description: 'Long-range precision marksman.',
                children: [
                  { id: 'sagittarius', name: 'Sagittarius', tier: 3, description: 'Top-tier single-target ranged fighter.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'human-mystic',
      name: 'Mystic',
      tree: {
        id: 'human-mystic',
        name: 'Human Mystic',
        tier: 1,
        description: 'Arcane initiate; choose magic or healing.',
        children: [
          {
            id: 'human-wizard',
            name: 'Human Wizard',
            tier: 2,
            description: 'Offensive caster with elemental burst magic.',
            children: [
              {
                id: 'sorcerer',
                name: 'Sorcerer',
                tier: 3,
                description: 'Raw elemental DPS caster.',
                children: [
                  { id: 'archmage', name: 'Archmage', tier: 3, description: 'Master of element destruction.', children: [] },
                ],
              },
              {
                id: 'necromancer',
                name: 'Necromancer',
                tier: 3,
                description: 'Minion and debuff oriented dark caster.',
                children: [
                  { id: 'soultaker', name: 'Soultaker', tier: 3, description: 'Life-stealing summoner caster.', children: [] },
                ],
              },
              {
                id: 'warlock',
                name: 'Warlock',
                tier: 3,
                description: 'Dark AoE and curse specialist.',
                children: [
                  { id: 'arcana-lord', name: 'Arcana Lord', tier: 3, description: 'Extreme AoE and trap-magic nuker.', children: [] },
                ],
              },
            ],
          },
          {
            id: 'cleric',
            name: 'Cleric',
            tier: 2,
            description: 'Healer and buffer; core support in every party.',
            children: [
              {
                id: 'bishop',
                name: 'Bishop',
                tier: 3,
                description: 'Top-tier healer with resurrection.',
                children: [
                  { id: 'cardinal', name: 'Cardinal', tier: 3, description: 'Best-in-slot healing and sustain.', children: [] },
                ],
              },
              {
                id: 'prophet',
                name: 'Prophet',
                tier: 3,
                description: 'Buff/debuff controller over a wide area.',
                children: [
                  { id: 'hierophant', name: 'Hierophant', tier: 3, description: 'Massive buff and seal controller.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
  elf: [
    {
      id: 'elven-fighter',
      name: 'Fighter',
      tree: {
        id: 'elven-fighter',
        name: 'Elven Fighter',
        tier: 1,
        description: 'Agile sword-and-bow starter.',
        children: [
          {
            id: 'elven-knight',
            name: 'Elven Knight',
            tier: 2,
            description: 'Defensive fighter tuned for aggro control.',
            children: [
              {
                id: 'temple-knight',
                name: 'Temple Knight',
                tier: 3,
                description: 'Faith-based tank with party buffs.',
                children: [
                  { id: 'evas-templar', name: "Eva's Templar", tier: 3, description: 'Faith-tank with holy party auras.', children: [] },
                ],
              },
              {
                id: 'swordsinger',
                name: 'Swordsinger',
                tier: 3,
                description: 'Dance buff party enchanter.',
                children: [
                  { id: 'sword-muse', name: 'Sword Muse', tier: 3, description: 'Dance-buff bard specialist.', children: [] },
                ],
              },
            ],
          },
          {
            id: 'elven-scout',
            name: 'Elven Scout',
            tier: 2,
            description: 'Tracker and bow specialist.',
            children: [
              {
                id: 'plains-walker',
                name: 'Plainswalker',
                tier: 3,
                description: 'Mounted scout with trap skills.',
                children: [
                  { id: 'wind-rider', name: 'Wind Rider', tier: 3, description: 'Mounted ranged skirmisher.', children: [] },
                ],
              },
              {
                id: 'silver-ranger',
                name: 'Silver Ranger',
                tier: 3,
                description: 'Precision ranged DPS.',
                children: [
                  { id: 'moonlight-sentinel', name: 'Moonlight Sentinel', tier: 3, description: 'Master ranged DPS sentinel.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'elven-mystic',
      name: 'Mystic',
      tree: {
        id: 'elven-mystic',
        name: 'Elven Mystic',
        tier: 1,
        description: 'Nature-tuned spell starter.',
        children: [
          {
            id: 'elven-wizard',
            name: 'Elven Wizard',
            tier: 2,
            description: 'Fast casting hybrid magic.',
            children: [
              {
                id: 'spellsinger',
                name: 'Spellsinger',
                tier: 3,
                description: 'AoE caster with song-enhanced spells.',
                children: [
                  { id: 'mystic-muse', name: 'Mystic Muse', tier: 3, description: 'Song-enhanced AoE caster.', children: [] },
                ],
              },
              {
                id: 'elemental-summoner',
                name: 'Elemental Summoner',
                tier: 3,
                description: 'Pet-based magic siege class.',
                children: [
                  { id: 'elemental-master', name: 'Elemental Master', tier: 3, description: 'Summoner arcana artillery.', children: [] },
                ],
              },
            ],
          },
          {
            id: 'elven-oracle',
            name: 'Elven Oracle',
            tier: 2,
            description: 'Support healer with party resurrection utility.',
            children: [
              {
                id: 'elven-elder',
                name: 'Elven Elder',
                tier: 3,
                description: 'Versatile buffer and healer.',
                children: [
                  { id: 'evas-saint', name: "Eva's Saint", tier: 3, description: 'Top-tier elven healer.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
  'dark-elf': [
    {
      id: 'dark-elven-fighter',
      name: 'Fighter',
      tree: {
        id: 'dark-elven-fighter',
        name: 'Dark Elven Fighter',
        tier: 1,
        description: 'Stealth and poison starter.',
        children: [
          {
            id: 'dark-elven-knight',
            name: 'Palus Knight',
            tier: 2,
            description: 'Dark tank with bleed skills.',
            children: [
              {
                id: 'shillien-knight',
                name: 'Shillien Knight',
                tier: 3,
                description: 'Magic-resistant dark tank.',
                children: [
                  { id: 'shillien-templar', name: 'Shillien Templar', tier: 3, description: 'Dark anti-magic tank.', children: [] },
                ],
              },
              {
                id: 'bladedancer',
                name: 'Bladedancer',
                tier: 3,
                description: 'Dance debuffer with evasion buffs.',
                children: [
                  { id: 'spectral-dancer', name: 'Spectral Dancer', tier: 3, description: 'Dark dance-debuff dancer.', children: [] },
                ],
              },
            ],
          },
          {
            id: 'dark-elven-scout',
            name: 'Assassin',
            tier: 2,
            description: 'Critical backstab assassin.',
            children: [
              {
                id: 'abyss-walker',
                name: 'Abyss Walker',
                tier: 3,
                description: 'Fast stealth assassin.',
                children: [
                  { id: 'ghost-hunter', name: 'Ghost Hunter', tier: 3, description: 'Stealth trap hunter.', children: [] },
                ],
              },
              {
                id: 'phantom-ranger',
                name: 'Phantom Ranger',
                tier: 3,
                description: 'Deadly ranged trap archer.',
                children: [
                  { id: 'ghost-sentinel', name: 'Ghost Sentinel', tier: 3, description: 'Ranged dark sentinel.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'dark-elven-mystic',
      name: 'Mystic',
      tree: {
        id: 'dark-elven-mystic',
        name: 'Dark Elven Mystic',
        tier: 1,
        description: 'Cursed magic initiator.',
        children: [
          {
            id: 'dark-wizard',
            name: 'Dark Wizard',
            tier: 2,
            description: 'AoE curse and darkness magic.',
            children: [
              {
                id: 'spellhowler',
                name: 'Spellhowler',
                tier: 3,
                description: 'Sonic/curse area denial caster.',
                children: [
                  { id: 'storm-screamer', name: 'Storm Screamer', tier: 3, description: 'Curse and sonic disable caster.', children: [] },
                ],
              },
              {
                id: 'phantom-summoner',
                name: 'Phantom Summoner',
                tier: 3,
                description: 'Summons winged dark familiars.',
                children: [
                  { id: 'spectral-master', name: 'Spectral Master', tier: 3, description: 'Dark summon mastery.', children: [] },
                ],
              },
            ],
          },
          {
            id: 'shillien-oracle',
            name: 'Shillien Oracle',
            tier: 2,
            description: 'Dark healer and party corruption cleanser.',
            children: [
              {
                id: 'shillien-elder',
                name: 'Shillien Elder',
                tier: 3,
                description: 'Crowd-control-focused dark priest.',
                children: [
                  { id: 'shillien-saint', name: 'Shillien Saint', tier: 3, description: 'Master dark support priest.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
  orc: [
    {
      id: 'orc-fighter',
      name: 'Fighter',
      tree: {
        id: 'orc-fighter',
        name: 'Orc Fighter',
        tier: 1,
        description: 'Brute-force melee starter.',
        children: [
          {
            id: 'orc-raider',
            name: 'Orc Raider',
            tier: 2,
            description: 'Berserk damage dealer.',
            children: [
              {
                id: 'destroyer',
                name: 'Destroyer',
                tier: 3,
                description: 'Soul-breaking two-hand brute.',
                children: [
                  { id: 'titan', name: 'Titan', tier: 3, description: 'Brutal max-power warrior.', children: [] },
                ],
              },
            ],
          },
          {
            id: 'orc-monk',
            name: 'Orc Monk',
            tier: 2,
            description: 'Fist-fighter with chaining binds.',
            children: [
              {
                id: 'tyrant',
                name: 'Tyrant',
                tier: 3,
                description: 'Stunning frontline fighter.',
                children: [
                  { id: 'grand-khavatari', name: 'Grand Khavatari', tier: 3, description: 'Supreme unarmed brute.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'orc-mystic',
      name: 'Mystic',
      tree: {
        id: 'orc-mystic',
        name: 'Orc Mystic',
        tier: 1,
        description: 'Shamanic magic starter.',
        children: [
          {
            id: 'orc-shaman',
            name: 'Orc Shaman',
            tier: 2,
            description: 'Buff shaman with totems.',
            children: [
              {
                id: 'overlord',
                name: 'Overlord',
                tier: 3,
                description: 'Siege commander with clan buffs.',
                children: [
                  { id: 'dominator', name: 'Dominator', tier: 3, description: 'Siege/raid commander class.', children: [] },
                ],
              },
              {
                id: 'warcryer',
                name: 'Warcryer',
                tier: 3,
                description: 'Massive AoE and morale-shaking cries.',
                children: [
                  { id: 'doomcryer', name: 'Doomcryer', tier: 3, description: 'Morale-shaker with big AoE.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
  dwarf: [
    {
      id: 'dwarven-fighter',
      name: 'Fighter',
      tree: {
        id: 'dwarven-fighter',
        name: 'Dwarven Fighter',
        tier: 1,
        description: 'Stout melee and crafting starter.',
        children: [
          {
            id: 'artisan',
            name: 'Artisan',
            tier: 2,
            description: 'Master crafter with SOS/BBS-type utility.',
            children: [
              {
                id: 'warsmith',
                name: 'Warsmith',
                tier: 3,
                description: 'Siege weapon specialist.',
                children: [
                  { id: 'maestro', name: 'Maestro', tier: 3, description: 'Master blacksmith and siege crafter.', children: [] },
                ],
              },
            ],
          },
          {
            id: 'scavenger',
            name: 'Scavenger',
            tier: 2,
            description: 'Spoil looter with critical-hit ganks.',
            children: [
              {
                id: 'bounty-hunter',
                name: 'Bounty Hunter',
                tier: 3,
                description: 'Critical-specialized fighter with bounty mechanics.',
                children: [
                  { id: 'fortune-seeker', name: 'Fortune Seeker', tier: 3, description: 'Wealth-seeking gank-fighter.', children: [] },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
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
