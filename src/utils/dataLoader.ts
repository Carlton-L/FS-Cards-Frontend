// src/utils/dataLoader.ts
import Papa from 'papaparse';

export interface SubjectData {
  fst: string;
  category: string;
  name: string;
  summary: string;
  fsCardUrl: string;
  inventor?: string;
  labs: string[];
  synonyms: string[];
  wikipediaDefinition?: string;
  wikipediaUrl?: string;
}

export interface LabData {
  id: string;
  name: string;
  description: string;
}

const CSV_URL =
  'https://fs-cards-snapshots.s3.eu-west-3.amazonaws.com/documents.csv';
const STORAGE_KEY = 'fs_cards_subjects_data';
const VERSION_KEY = 'fs_cards_data_version';
const CURRENT_VERSION = '1.0';

// Complete lab codes mapping
const LAB_CODES: { [key: string]: { name: string; description: string } } = {
  ag: {
    name: 'Agriculture',
    description:
      'Vertical farms, artificial bees, cell-based meats, and other high-tech solutions are meeting sustainable practices like no-till farming and biochar.',
  },
  ac: {
    name: 'Advanced Computing',
    description:
      'Artificial intelligence, the distributed web, the metaverse, and quantum computing are all challenging our paradigm of information technology at once.',
  },
  bc: {
    name: 'Blockchain & Crypto',
    description:
      'Distributed ledger technologies, decentralized systems, and cryptocurrency innovations.',
  },
  bt: {
    name: 'Biotechnology',
    description:
      'Genetic engineering, CRISPR, synthetic biology, and molecular medicine.',
  },
  b2: {
    name: 'Bioengineering',
    description:
      'Advanced biological systems engineering and synthetic organisms.',
  },
  bf: {
    name: 'Biofabrication',
    description:
      'Tissue engineering, bioprinting, and biomaterial manufacturing.',
  },
  e1: {
    name: 'Energy Innovation',
    description: 'Next-generation power systems and energy storage solutions.',
  },
  ee: {
    name: 'Energy & Environment',
    description:
      'Renewable energy, climate tech, carbon capture, and sustainable solutions.',
  },
  fo: {
    name: 'Food Technology',
    description:
      'Alternative proteins, precision fermentation, cellular agriculture, and food innovation.',
  },
  si: {
    name: 'Silicon & Materials',
    description:
      'Advanced materials, nanotechnology, and material science innovations.',
  },
  sv: {
    name: 'Society & Governance',
    description: 'Social innovation, governance technologies, and civic tech.',
  },
  eq: {
    name: 'Equity & Access',
    description:
      'Technologies promoting equality, universal access, and social justice.',
  },
  co: {
    name: 'Connectivity',
    description:
      'Communication technologies, networks, and global connectivity solutions.',
  },
  gg: {
    name: 'Global Governance',
    description:
      'International policy, regulation, and cross-border collaboration technologies.',
  },
  me: {
    name: 'Medical Technology',
    description:
      'Healthcare innovations, medical devices, and diagnostic tools.',
  },
  sp: {
    name: 'Space Technology',
    description:
      'Aerospace, satellite systems, and space exploration technologies.',
  },
  tr: {
    name: 'Transportation',
    description:
      'Autonomous vehicles, mobility solutions, and transportation infrastructure.',
  },
  ro: {
    name: 'Robotics',
    description:
      'Autonomous systems, robotic platforms, and automation technologies.',
  },
  qc: {
    name: 'Quantum Computing',
    description:
      'Quantum processors, quantum algorithms, and quantum information systems.',
  },
  vr: {
    name: 'Virtual & Augmented Reality',
    description:
      'Immersive technologies, spatial computing, and extended reality platforms.',
  },
};

function parseCSVRow(row: any): SubjectData | null {
  if (!row.ent_name || !row.ent_summary) {
    return null;
  }

  // Parse labs from the labs column
  const labsString = row.labs || '';
  const labs = labsString
    .split(',')
    .map((lab: string) => lab.trim().toLowerCase())
    .filter((lab: string) => lab.length > 0);

  // Parse synonyms
  const synonymsString = row.synonyms || '';
  let synonyms: string[] = [];

  if (synonymsString.startsWith('[') && synonymsString.endsWith(']')) {
    try {
      synonyms = JSON.parse(synonymsString);
    } catch (e) {
      // If parsing fails, try splitting by comma
      synonyms = synonymsString
        .replace(/[\[\]"]/g, '')
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }
  } else {
    synonyms = synonymsString
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);
  }

  return {
    fst: row.FST || '',
    category: (row.category || '').toLowerCase(),
    name: row.ent_name,
    summary: row.ent_summary,
    fsCardUrl: row.fs_card || '',
    inventor: row.inventor || undefined,
    labs,
    synonyms,
    wikipediaDefinition:
      row.wikipedia_definition && row.wikipedia_definition !== 'nan'
        ? row.wikipedia_definition
        : undefined,
    wikipediaUrl:
      row.wikipedia_url && row.wikipedia_url !== 'wikipedia URL not found'
        ? row.wikipedia_url
        : undefined,
  };
}

export async function loadSubjectsData(): Promise<SubjectData[]> {
  // Check if we have cached data
  const cachedVersion = sessionStorage.getItem(VERSION_KEY);
  const cachedData = sessionStorage.getItem(STORAGE_KEY);

  if (cachedVersion === CURRENT_VERSION && cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.error('Failed to parse cached data:', e);
      // Continue to fetch fresh data
    }
  }

  // Fetch fresh data
  const response = await fetch(CSV_URL);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const subjects = results.data
          .map(parseCSVRow)
          .filter((subject): subject is SubjectData => subject !== null);

        // Cache the data
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
          sessionStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        } catch (e) {
          console.warn('Failed to cache data:', e);
        }

        resolve(subjects);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function getLabsFromSubjects(subjects: SubjectData[]): LabData[] {
  const labSet = new Set<string>();

  subjects.forEach((subject) => {
    subject.labs.forEach((lab) => labSet.add(lab));
  });

  return Array.from(labSet)
    .map((labCode) => ({
      id: labCode,
      name: LAB_CODES[labCode]?.name || labCode.toUpperCase(),
      description:
        LAB_CODES[labCode]?.description ||
        `${labCode.toUpperCase()} technologies and innovations.`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getSubjectsByLab(
  subjects: SubjectData[],
  labId: string
): SubjectData[] {
  return subjects.filter((subject) =>
    subject.labs.includes(labId.toLowerCase())
  );
}

export function searchSubjects(
  subjects: SubjectData[],
  query: string
): SubjectData[] {
  const lowerQuery = query.toLowerCase();
  return subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(lowerQuery) ||
      subject.summary.toLowerCase().includes(lowerQuery) ||
      subject.synonyms.some((syn) => syn.toLowerCase().includes(lowerQuery))
  );
}

export function getSubjectBySlug(
  subjects: SubjectData[],
  slug: string
): SubjectData | undefined {
  return subjects.find((subject) => {
    const expectedSlug = subject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return expectedSlug === slug;
  });
}
