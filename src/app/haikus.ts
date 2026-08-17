/**
 * Haiku for the wait, from two sources — see `ORIGINAL_LINES` and
 * `TRANSLATIONS` below. Nothing here is anyone else's to license: the first set
 * was written for this extension, and the second is translated from originals
 * that have been in the public domain for centuries.
 */

export type Lines = readonly [string, string, string]

export type Haiku = {
  lines: Lines
  /** Set only for translations: the poet who wrote the original. */
  poet?: string
  /**
   * The Japanese original in romaji. Not displayed — it is here so the
   * translation can be checked against the poem it claims to translate.
   */
  romaji?: string
}

/**
 * Written for this extension. All 5-7-5, and all about the same thing from a
 * hundred angles: that what you are rushing toward is not going anywhere.
 */
const ORIGINAL_LINES: readonly Lines[] = [
  ['Morning fog lifting —', 'the mountain was always there,', 'waiting to be seen.'],
  ['Rain on the window;', 'the whole afternoon becomes', 'one long grey river.'],
  ['A crow lifts, and snow', 'slides from the pine branch it left —', 'the branch springs upward.'],
  ['Steam from the teacup', 'curls, uncurls, and disappears.', 'Nothing was hurried.'],
  ['The pond holds the moon', 'without gripping it. Water', 'knows how to let go.'],
  ['First light on the sill;', 'dust turns slowly in the beam,', 'in no hurry now.'],
  ['Cold stone under palm.', 'The mountain does not answer.', 'That is the answer.'],
  ['An apple falling', 'makes the whole orchard listen', 'for a small moment.'],
  ['Wind through summer grass —', 'the field bows, stands, bows again,', 'practicing patience.'],
  ["The kettle's low sigh", 'before the boil: a long breath', 'the house takes with it.'],
  ['Snow fills the footprints', 'of whoever walked here first.', 'The path forgets us.'],
  ['A moth at the lamp', 'all night, and by morning, gone.', 'The lamp is still warm.'],
  ['Low tide: the harbor', 'shows what it has been holding —', 'rope, shell, and old glass.'],
  ['Two pines on the ridge', 'lean the same way. Forty years', 'of the same north wind.'],
  ['The river is loud', 'where it is shallow. Deep pools', 'say nothing at all.'],
  ['Late bees in the thyme,', 'heavy, unbothered, going', 'slowly home again.'],
  ['Wet street after rain;', 'each lit window in the block', 'lands twice on the ground.'],
  ['The old dog dreaming', 'runs without leaving the rug.', 'Somewhere, he is fast.'],
  ['Plum blossom, then wind.', 'Nothing lost — the ground is white', 'where the tree was white.'],
  ['A held note fading;', 'the hall keeps it a moment', 'after the hand stops.'],
  ['Fog on the water.', 'The far shore is still over', 'there, being patient.'],
  ['The stone in the stream', 'did not choose to be smooth. Years', 'of water chose that.'],
  ['Autumn: the maple', 'gives all of it at once, then', 'stands there, unashamed.'],
  ['Bare branch, one brown leaf', 'holding on past all reason.', 'Then a gust. Then not.'],
  ['The cat at the door', 'neither in nor out, teaching', 'the hinge to be still.'],
  ['Salt on the window;', 'the sea does not need us to', 'watch it to be there.'],
  ['Bread rising slowly.', 'No amount of watching it', 'will make it happen.'],
  ['The lantern goes out;', 'now I can see how many', 'stars have been waiting.'],
  ['Cicadas at noon —', 'the heat itself seems to sing,', 'and no one is rushed.'],
  ['Ink meets wet paper', 'and goes where it wants to go.', 'The brush only waits.'],
  ['Deep snow, and no sound', 'except the sound of deep snow,', 'which is almost sound.'],
  ['The bell, struck once, spends', 'a long time becoming air.', 'Do not strike again.'],
  ['Small lights in the field.', 'The dark was never empty —', 'only not looked at.'],
  ['Rain finds the one crack', 'in the roof and works all night.', 'It has nowhere else.'],
  ['Long train, empty seats,', 'window full of fields going', 'somewhere without me.'],
  ['The moon does not care', 'that no one is looking up.', 'It rises the same.'],
  ['Green moss on the stone', 'took a hundred wet autumns', 'and asked for no one.'],
  ['An empty bowl waits', 'better than a full one does.', "It knows what it's for."],
  ['Wind chimes, then silence,', 'then wind chimes. The wind is not', 'performing for us.'],
  ['Frost on the first step.', 'Whatever I meant to rush', 'can wait for the sun.'],
  ['Old man on the bench', 'feeding pigeons one seed each.', 'He has the whole day.'],
  ['The lake at first light', 'has not decided to be', 'blue or grey. Neither.'],
  ['Cut grass in the sun', 'gives back the whole afternoon', 'as a single smell.'],
  ['The heron stands still', 'so long the fish forget it.', 'Then it does not stand.'],
  ['Candle in daylight —', 'still burning, doing its work,', 'needed by no one.'],
  ['Warm stone after dusk', 'gives the day back, hour by hour.', 'Nothing is wasted.'],
  ['A door left open', 'all afternoon: the garden', 'came in and stayed there.'],
  ['Slow rain on the pond', 'writes a thousand small circles', 'and erases them.'],
  ['The empty hallway', 'keeps the sound of your footsteps', 'a second longer.'],
  ['Winter tree, bare now —', 'you can see the whole shape it', 'was hiding all year.'],
  ['Steam on the mirror.', 'Whatever face is in there', 'can wait a moment.'],
  ['Sparrows in the hedge', 'argue about the whole world.', 'The hedge does not mind.'],
  ['The tide comes back in', 'without being called by us,', 'exactly on time.'],
  ['One boat on the bay', 'going nowhere in a way', 'that looks like knowing.'],
  ['Bamboo bends and holds.', 'The storm spends itself and leaves.', 'The bamboo stands up.'],
  ['Peeling an orange', 'slowly — the whole room now knows', 'what an orange is.'],
  ['Snowmelt in the eaves', 'counting out the afternoon', 'one drop at a time.'],
  ['The letter I wrote', 'and did not send is the one', 'that said the true thing.'],
  ['Dry riverbed waits.', 'It has done this before, and', 'knows how long rain takes.'],
  ['Two cups on the tray,', 'one still warm. The afternoon', 'was here a moment.'],
  ['The mountain path turns', 'and the whole valley opens.', 'It waited for that.'],
  ['Grey heron, grey sky,', 'grey water — and then it moves,', 'and the world is clear.'],
  ['Bee in the foxglove:', 'the whole flower shakes with work', "that isn't hurried."],
  ['First cold night: the house', 'makes small sounds, settling itself', 'for the long season.'],
  ['Ripe fruit falls when ripe.', 'No one has ever hurried', 'an apple downward.'],
  ['The well is patient.', 'It holds the sky in a ring', 'and waits for the rope.'],
  ['Old bridge, new water.', 'Each day it is a whole new', 'river underneath.'],
  ['Lamplight through the blind', 'lays a ladder on the floor.', 'No one has to climb.'],
  ['The kite is only', 'as free as the string is long,', 'and knows this, and climbs.'],
  ['Mist in the valley', 'will lift or will not lift. Both', 'are fine with the hills.'],
  ['Standing in the door', 'between the cold rain and fire,', 'belonging to both.'],
  ['The sea, all evening,', 'practicing the same one sound', 'and never tiring.'],
  ['A single white plum', 'in the dark, doing its best', 'to be a lantern.'],
  ['Dust along the sill', 'keeps the shape of what was there', 'that has been moved since.'],
  ['Two candles burning.', 'One leans to the other one.', 'Neither moves closer.'],
  ['Winter sun, low, gold,', 'taking its time on the wall', 'before it lets go.'],
  ['The wren does not know', 'how big the sky is, and sings', 'the whole of it out.'],
  ['Rain stops. The gutters', 'go on talking about it', 'a good while longer.'],
  ['Between two long notes', 'the silence is also part', 'of what was written.'],
  ['The path up the hill', 'does not shorten if I sigh.', 'It only lengthens.'],
  ['Blue hour: the birds stop', 'one by one, like lamps going', 'out along a street.'],
  ['The old apple tree', 'gives less each year and is loved', 'more each year for it.'],
  ['Wet ink, unfinished —', 'even the pause in the line', 'is part of the line.'],
  ['Sheep on the hillside', 'move like slow weather across', 'the green of the hill.'],
  ['The stream under ice', 'keeps going, saying nothing,', 'certain of April.'],
  ['Hands around a cup:', 'the whole point of the morning,', 'and it takes no time.'],
  ['Gull on the piling', 'facing the cold wind for hours.', 'This is its whole plan.'],
  ['Beach at low tide, wide —', 'the sea has gone off somewhere', 'and will be right back.'],
  ['The oldest cedar', 'was also once a seed that', 'no one noticed fall.'],
  ['Bell in the far town', 'marks an hour I did not use.', 'It does not scold me.'],
  ['Green tea, second cup —', 'the first one was for thirst, this', 'one is for sitting.'],
  ['Small spider working', 'between two stalks all evening.', 'No one is coming.'],
  ['The window I clean', 'shows the same street it showed me,', 'only more of it.'],
  ['First snow, and the world', 'agrees, for one hour, to be', 'quiet about it.'],
  ['The horse in the field', 'does not think about the field.', "That is why it's calm."],
  ['Long shadow, short day —', 'the light is not running out,', 'only lying down.'],
  ['Wind drops. The whole wood', 'holds one enormous still breath,', 'then lets it all go.'],
  ['Nothing in the box', 'I was so afraid to see.', 'Only old buttons.'],
  ['Last light on the wall', 'climbs slowly and then is gone.', 'Tomorrow, again.'],
  ['Sit still long enough', 'and the room begins to show', 'what it always held.'],
]

/**
 * Canonical haiku, translated for this extension.
 *
 * The poets are Bashō (1644–1694), Buson (1716–1784), Issa (1763–1828) and
 * Shiki (1867–1902), plus a few others — all long out of copyright in any
 * jurisdiction. Their *translators* are not: the versions of these poems that
 * circulate in English are mostly Blyth (1949), Henderson (1958) or Hass
 * (1994), all still in copyright. So these renderings are made here, from the
 * originals, and the romaji is recorded beside each one so any of them can be
 * checked rather than taken on trust.
 *
 * They follow the sense rather than forcing 5-7-5. Japanese counts *on*, not
 * syllables, and 17 of them carry far less than 17 English syllables — padding
 * a translation out to fit the shape is how you end up with a poem the poet
 * did not write.
 */
const TRANSLATIONS: readonly Haiku[] = [
  // Bashō
  {
    lines: ['An old pond.', 'A frog jumps in.', 'The sound of water.'],
    poet: 'Bashō',
    romaji: 'furuike ya / kawazu tobikomu / mizu no oto',
  },
  {
    lines: ['On a bare branch', 'a crow has settled.', 'Autumn dusk.'],
    poet: 'Bashō',
    romaji: 'kareeda ni / karasu no tomarikeri / aki no kure',
  },
  {
    lines: ['Summer grasses —', 'all that is left', "of the warriors' dreams."],
    poet: 'Bashō',
    romaji: 'natsukusa ya / tsuwamonodomo ga / yume no ato',
  },
  {
    lines: ['Such stillness —', "the cicadas' crying", 'soaks into the rocks.'],
    poet: 'Bashō',
    romaji: 'shizukesa ya / iwa ni shimiiru / semi no koe',
  },
  {
    lines: ['A rough sea,', 'and stretched out toward Sado,', 'the River of Heaven.'],
    poet: 'Bashō',
    romaji: 'araumi ya / Sado ni yokotau / amanogawa',
  },
  {
    lines: ['Sick on a journey,', 'and my dreams go wandering', 'over withered fields.'],
    poet: 'Bashō',
    romaji: 'tabi ni yande / yume wa kareno wo / kakemeguru',
  },
  {
    lines: ['Gathering the rains', 'of all the summer, and swift —', 'the Mogami River.'],
    poet: 'Bashō',
    romaji: 'samidare wo / atsumete hayashi / Mogamigawa',
  },
  {
    lines: ['The rose of Sharon', 'at the roadside — my horse', 'has eaten it.'],
    poet: 'Bashō',
    romaji: 'michinobe no / mukuge wa uma ni / kuwarekeri',
  },
  {
    lines: ['First cold rain of winter:', 'even the monkey looks like', 'he wants a straw coat.'],
    poet: 'Bashō',
    romaji: 'hatsushigure / saru mo komino wo / hoshigenari',
  },
  {
    lines: ['This road —', 'and no one walking it.', 'Autumn dusk.'],
    poet: 'Bashō',
    romaji: 'kono michi ya / yuku hito nashi ni / aki no kure',
  },
  {
    lines: ['Say anything at all', 'and your lips go cold:', 'the autumn wind.'],
    poet: 'Bashō',
    romaji: 'mono ieba / kuchibiru samushi / aki no kaze',
  },
  {
    lines: ['A cloud of blossoms —', 'is that bell Ueno,', 'or Asakusa?'],
    poet: 'Bashō',
    romaji: 'hana no kumo / kane wa Ueno ka / Asakusa ka',
  },
  {
    lines: ['Nothing in the voice', 'of the cicada suggests', 'how soon it will die.'],
    poet: 'Bashō',
    romaji: 'yagate shinu / keshiki wa miezu / semi no koe',
  },
  {
    lines: ['Scent of chrysanthemums,', 'and in Nara,', 'all the old buddhas.'],
    poet: 'Bashō',
    romaji: 'kiku no ka ya / Nara ni wa furuki / hotoketachi',
  },
  {
    lines: ['Gravestone, move —', 'the sound of my crying', 'is the autumn wind.'],
    poet: 'Bashō',
    romaji: 'tsuka mo ugoke / waga naku koe wa / aki no kaze',
  },
  {
    lines: ['For a little while', 'the moon will rest', 'above the blossoms.'],
    poet: 'Bashō',
    romaji: 'shibaraku wa / hana no ue naru / tsuki yo kana',
  },
  {
    lines: ['The sea darkening —', "the wild duck's cry", 'faintly white.'],
    poet: 'Bashō',
    romaji: 'umi kurete / kamo no koe / honoka ni shiroshi',
  },
  {
    lines: ['Peaks of cloud —', 'how many have crumbled away', "into the moon's mountain?"],
    poet: 'Bashō',
    romaji: 'kumo no mine / ikutsu kuzurete / tsuki no yama',
  },
  {
    lines: ['Turn the horse', 'sideways across the field —', 'a cuckoo!'],
    poet: 'Bashō',
    romaji: 'no wo yoko ni / uma hikimuke yo / hototogisu',
  },
  {
    lines: ['How admirable —', 'to see the lightning', 'and draw no lesson from it.'],
    poet: 'Bashō',
    romaji: 'inazuma ni / satoranu hito no / tattosa yo',
  },
  {
    lines: ['The cuckoo —', 'and where its cry goes out,', 'a single island.'],
    poet: 'Bashō',
    romaji: 'hototogisu / kieyuku kata ya / shima hitotsu',
  },
  {
    lines: ['The moon is racing.', 'The tops of the trees', 'still hold the rain.'],
    poet: 'Bashō',
    romaji: 'tsuki hayashi / kozue wa ame wo / mochinagara',
  },
  {
    lines: ['The winter wind', 'hides itself in the bamboo', 'and goes quiet.'],
    poet: 'Bashō',
    romaji: 'kogarashi ya / take ni kakurete / shizumarinu',
  },
  {
    lines: ['It would melt in my hand —', 'my tears are that hot —', 'this autumn frost.'],
    poet: 'Bashō',
    romaji: 'te ni toraba kien / namida zo atsuki / aki no shimo',
  },

  // Buson
  {
    lines: ['Resting on the temple bell,', 'and glowing —', 'a firefly.'],
    poet: 'Buson',
    romaji: 'tsurigane ni / tomarite hikaru / hotaru kana',
  },
  {
    lines: ['The summer rains,', 'and facing the great river,', 'two houses.'],
    poet: 'Buson',
    romaji: 'samidare ya / taiga wo mae ni / ie niken',
  },
  {
    lines: ['Willow leaves fallen,', 'the clear stream gone dry,', 'stones here and there.'],
    poet: 'Buson',
    romaji: 'yanagi chiri / shimizu kare ishi / tokorodokoro',
  },
  {
    lines: ['The moon at its height,', 'and I pass through', 'a poor part of town.'],
    poet: 'Buson',
    romaji: 'tsuki tenshin / mazushiki machi wo / tōrikeri',
  },
  {
    lines: ['Setting the axe in —', 'startled by the scent.', 'Winter grove.'],
    poet: 'Buson',
    romaji: 'ono irete / ka ni odoroku ya / fuyu kodachi',
  },
  {
    lines: ['The peony scattered:', 'two petals lying', 'across three petals.'],
    poet: 'Buson',
    romaji: 'botan chirite / uchikasanarinu / nihira sanpira',
  },
  {
    lines: ['So it has come to this —', 'white plum blossoms,', 'and the night turning to dawn.'],
    poet: 'Buson',
    romaji: 'shiraume ni / akuru yo bakari to / narinikeri',
  },
  {
    lines: ['Spring rain,', 'and off down the road they go, talking —', 'straw hat and raincoat.'],
    poet: 'Buson',
    romaji: 'harusame ya / monogatari yuku / minogasa',
  },
  {
    lines: ['Wild roses,', 'and so much like the road', 'home to my village.'],
    poet: 'Buson',
    romaji: 'hana ibara / kokyō no michi ni / nitaru kana',
  },
  {
    lines: ['Evening wind —', 'the water laps', "the blue heron's legs."],
    poet: 'Buson',
    romaji: 'yūkaze ya / mizu aosagi no / hagi wo utsu',
  },
  {
    lines: ['The pond and the river', 'have become one thing:', 'spring rain.'],
    poet: 'Buson',
    romaji: 'ike to kawa / hitotsu ni narinu / harusame',
  },

  // Issa
  {
    lines: ['Do not kill it —', 'the fly is wringing its hands,', 'wringing its feet.'],
    poet: 'Issa',
    romaji: 'yare utsu na / hae ga te wo suru / ashi wo suru',
  },
  {
    lines: ['Little sparrow,', 'out of the way, out of the way —', 'the horse is coming through.'],
    poet: 'Issa',
    romaji: 'suzume no ko / soko noke soko noke / o-uma ga tōru',
  },
  {
    lines: ['The snow has melted', 'and the village is full', 'of children.'],
    poet: 'Issa',
    romaji: 'yuki tokete / mura ippai no / kodomo kana',
  },
  {
    lines: ['Come and play with me,', 'sparrow', 'with no mother, no father.'],
    poet: 'Issa',
    romaji: 'ware to kite / asobe ya oya no / nai suzume',
  },
  {
    lines: ['This world of dew', 'is only a world of dew —', 'and yet. And yet.'],
    poet: 'Issa',
    romaji: 'tsuyu no yo wa / tsuyu no yo nagara / sarinagara',
  },
  {
    lines: ['So this, then,', 'is my last house?', 'Five feet of snow.'],
    poet: 'Issa',
    romaji: 'kore ga maa / tsui no sumika ka / yuki gosshaku',
  },
  {
    lines: ['Snail,', 'climb Mount Fuji —', 'slowly, slowly.'],
    poet: 'Issa',
    romaji: 'katatsumuri / soro soro nobore / Fuji no yama',
  },
  {
    lines: ['Skinny frog,', 'do not give it up —', 'Issa is here.'],
    poet: 'Issa',
    romaji: 'yasegaeru / makeru na Issa / kore ni ari',
  },
  {
    lines: ["The ants' road", 'comes all the way down', 'from the peaks of cloud.'],
    poet: 'Issa',
    romaji: 'ari no michi / kumo no mine yori / tsuzukitari',
  },
  {
    lines: ['My old village —', 'everything I go near,', 'everything I touch, a thorn.'],
    poet: 'Issa',
    romaji: 'furusato ya / yoru mo sawaru mo / bara no hana',
  },
  {
    lines: ['The harvest moon —', '"get it down for me!"', 'the child is crying.'],
    poet: 'Issa',
    romaji: 'meigetsu wo / totte kurero to / naku ko kana',
  },

  // Shiki
  {
    lines: ['I bite into a persimmon', 'and the bell begins', 'at Hōryū-ji.'],
    poet: 'Shiki',
    romaji: 'kaki kueba / kane ga naru nari / Hōryūji',
  },
  {
    lines: ['Again and again', 'I asked them', 'how deep the snow was.'],
    poet: 'Shiki',
    romaji: 'ikutabi mo / yuki no fukasa wo / tazunekeri',
  },
  {
    lines: ['The autumn wind —', 'and everything my eye falls on', 'is haiku.'],
    poet: 'Shiki',
    romaji: 'akikaze ya / ganchū no mono / mina haiku',
  },
  {
    lines: ['The cockscombs —', 'there must be fourteen', 'of them, or fifteen.'],
    poet: 'Shiki',
    romaji: 'keitō no / jūshigo hon mo / arinubeshi',
  },
  {
    lines: ['Snow is falling.', 'I lie here and watch', 'the hole in the paper screen.'],
    poet: 'Shiki',
    romaji: 'yuki furu yo / shōji no ana wo / mite areba',
  },
  {
    lines: ['Nobody there —', 'and on the chair in the tree shade,', 'fallen cherry petals.'],
    poet: 'Shiki',
    romaji: 'hito mo nashi / kikage no isu no / chiru sakura',
  },

  // Others
  {
    lines: ['The morning glory', 'has taken my well bucket.', 'I go and beg for water.'],
    poet: 'Chiyo-ni',
    romaji: 'asagao ni / tsurube torarete / morai mizu',
  },
  {
    lines: ['A fallen blossom', 'returning to its branch?', 'No — a butterfly.'],
    poet: 'Moritake',
    romaji: 'rakka eda ni / kaeru to mireba / kochō kana',
  },
  {
    lines: ['Showing its back,', 'then showing its front —', 'the maple leaf falls.'],
    poet: 'Ryōkan',
    romaji: 'ura wo mise / omote wo misete / chiru momiji',
  },
  {
    lines: ['Nowhere at all', 'to pour out my bath water —', 'insects everywhere, singing.'],
    poet: 'Onitsura',
    romaji: 'gyōzui no / sutedokoro nashi / mushi no koe',
  },
  {
    lines: ['The autumn mountains,', 'and here and there', 'smoke going up.'],
    poet: 'Gyōdai',
    romaji: 'aki no yama / tokorodokoro ni / kemuri tatsu',
  },
]

/** Everything the picker draws from: the originals, then the translations. */
export const HAIKUS: readonly Haiku[] = [
  ...ORIGINAL_LINES.map((lines) => ({ lines })),
  ...TRANSLATIONS,
]

const LAST_KEY = 'haiku-email:last-haiku'

/**
 * `?haiku=<n>` pins the draw, so a specific one can be looked at on purpose.
 * Dev harness only — deliberately unreachable on Gmail itself, like `?fast`.
 */
function forcedIndex(): number | null {
  if (location.hostname === 'mail.google.com') return null
  const raw = new URLSearchParams(location.search).get('haiku')
  if (raw === null) return null
  const n = Number(raw)
  return Number.isInteger(n) && n >= 0 && n < HAIKUS.length ? n : null
}

/**
 * A haiku for this visit. Never the same one twice in a row — with this many
 * to choose from, an immediate repeat is the one draw that would feel broken.
 */
export function pickHaiku(): Haiku {
  const forced = forcedIndex()
  if (forced !== null) return HAIKUS[forced]

  const last = Number(localStorage.getItem(LAST_KEY) ?? -1)
  let index = Math.floor(Math.random() * HAIKUS.length)
  if (index === last) index = (index + 1) % HAIKUS.length
  localStorage.setItem(LAST_KEY, String(index))
  return HAIKUS[index]
}
