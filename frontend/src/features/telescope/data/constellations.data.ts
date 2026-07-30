export interface ConstellationData {
  id: string;
  name: string;
  latinName: string;
  symbol: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Circumpolar';
  brightestStar: string;
  ra: string;
  dec: string;
  fov: number;
  description: string;
  history: string;
  majorStars: Array<{ name: string; designation: string; mag: number; distLy: number }>;
}

export const CONSTELLATIONS_CATALOG: ConstellationData[] = [
  {
    id: 'ori',
    name: 'Orion',
    latinName: 'The Hunter',
    symbol: '🏹',
    season: 'Winter',
    brightestStar: 'Rigel (α Orionis)',
    ra: '05h 35m 00s',
    dec: '-05° 23′ 00″',
    fov: 25,
    description: 'One of the most recognizable constellations, home to the famous Orion Belt and the Orion Nebula (M42).',
    history: 'In Greek mythology, Orion was a giant hunter whom Zeus placed among the stars.',
    majorStars: [
      { name: 'Rigel', designation: 'Beta Orionis', mag: 0.13, distLy: 860 },
      { name: 'Betelgeuse', designation: 'Alpha Orionis', mag: 0.50, distLy: 642 },
      { name: 'Bellatrix', designation: 'Gamma Orionis', mag: 1.64, distLy: 250 },
      { name: 'Alnilam', designation: 'Epsilon Orionis (Belt)', mag: 1.69, distLy: 2000 },
      { name: 'Alnitak', designation: 'Zeta Orionis (Belt)', mag: 1.77, distLy: 1260 },
      { name: 'Saiph', designation: 'Kappa Orionis', mag: 2.07, distLy: 650 },
    ]
  },
  {
    id: 'uma',
    name: 'Ursa Major',
    latinName: 'The Great Bear',
    symbol: '🐻',
    season: 'Circumpolar',
    brightestStar: 'Alioth (ε Ursae Majoris)',
    ra: '10h 40m 00s',
    dec: '+55° 20′ 00″',
    fov: 35,
    description: 'Contains the world-famous "Big Dipper" asterism used for northern navigation to find Polaris.',
    history: 'Associated with the myth of Callisto, transformed into a bear by jealous Hera.',
    majorStars: [
      { name: 'Alioth', designation: 'Epsilon Ursae Majoris', mag: 1.77, distLy: 81 },
      { name: 'Dubhe', designation: 'Alpha Ursae Majoris', mag: 1.79, distLy: 123 },
      { name: 'Merak', designation: 'Beta Ursae Majoris', mag: 2.37, distLy: 79 },
      { name: 'Alkaid', designation: 'Eta Ursae Majoris', mag: 1.86, distLy: 103 },
    ]
  },
  {
    id: 'cas',
    name: 'Cassiopeia',
    latinName: 'The Vain Queen',
    symbol: '👑',
    season: 'Autumn',
    brightestStar: 'Shedar (α Cassiopeiae)',
    ra: '01h 00m 00s',
    dec: '+60° 00′ 00″',
    fov: 30,
    description: 'Distinctive W-shaped constellation easily visible in northern night skies opposite Ursa Major.',
    history: 'Named after Queen Cassiopeia of Ethiopia, boastful of her peerless beauty.',
    majorStars: [
      { name: 'Shedar', designation: 'Alpha Cassiopeiae', mag: 2.24, distLy: 228 },
      { name: 'Caph', designation: 'Beta Cassiopeiae', mag: 2.28, distLy: 54 },
      { name: 'Gamma Cassiopeiae', designation: 'Gamma Cassiopeiae', mag: 2.15, distLy: 550 },
    ]
  },
  {
    id: 'cyg',
    name: 'Cygnus',
    latinName: 'The Swan',
    symbol: '🦢',
    season: 'Summer',
    brightestStar: 'Deneb (α Cygni)',
    ra: '20h 35m 00s',
    dec: '+42° 00′ 00″',
    fov: 25,
    description: 'Forms the Northern Cross asterism and contains Deneb, one point of the famous Summer Triangle.',
    history: 'Represents Orpheus transformed into a swan upon his death to be placed near his harp (Lyra).',
    majorStars: [
      { name: 'Deneb', designation: 'Alpha Cygni', mag: 1.25, distLy: 2615 },
      { name: 'Albireo', designation: 'Beta Cygni', mag: 3.05, distLy: 430 },
      { name: 'Sadr', designation: 'Gamma Cygni', mag: 2.23, distLy: 1800 },
    ]
  },
  {
    id: 'sco',
    name: 'Scorpius',
    latinName: 'The Scorpion',
    symbol: '🦂',
    season: 'Summer',
    brightestStar: 'Antares (α Scorpii)',
    ra: '16h 50m 00s',
    dec: '-30° 00′ 00″',
    fov: 30,
    description: 'Home to red supergiant Antares ("Rival of Mars") and located near the center of the Milky Way.',
    history: 'Sent by Gaia to defeat Orion after he declared he could slay any beast on Earth.',
    majorStars: [
      { name: 'Antares', designation: 'Alpha Scorpii', mag: 0.96, distLy: 550 },
      { name: 'Shaula', designation: 'Lambda Scorpii', mag: 1.62, distLy: 570 },
      { name: 'Sargas', designation: 'Theta Scorpii', mag: 1.86, distLy: 300 },
    ]
  },
  {
    id: 'tau',
    name: 'Taurus',
    latinName: 'The Bull',
    symbol: '🐂',
    season: 'Winter',
    brightestStar: 'Aldebaran (α Tauri)',
    ra: '04h 30m 00s',
    dec: '+16° 00′ 00″',
    fov: 25,
    description: 'Zodiacal constellation featuring the red eye star Aldebaran, the Pleiades (M45), and Hyades clusters.',
    history: 'Associated with Zeus transforming into a majestic white bull to abduct Europa.',
    majorStars: [
      { name: 'Aldebaran', designation: 'Alpha Tauri', mag: 0.85, distLy: 65 },
      { name: 'Elnath', designation: 'Beta Tauri', mag: 1.65, distLy: 130 },
    ]
  }
];
