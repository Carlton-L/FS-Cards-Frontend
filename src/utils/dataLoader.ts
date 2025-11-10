// src/utils/dataLoader.ts
import Papa from 'papaparse';

export interface SubjectData {
  fst: string;
  fsid: string;
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
export const LAB_CODES: {
  [key: string]: { name: string; description: string };
} = {
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
  af: {
    name: 'Algorithmic Futures',
    description:
      'So far, futures and forecasting work has been largely qualitative, subjective, and inaccurate. AI promises to bring more of both rigor and imagination to the field.',
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
  is: {
    name: 'Interspecies Society',
    description:
      'Nature has been excluded from the economy, with disastrous consequences. Breakthroughs in understanding non-human communication, cognition, and commerce will create an interspecies society that’s both prosperous and sustainable, where animals, plants, and the environment are active and equal participants.',
  },
  ne: {
    name: 'neUIro',
    description:
      "The next UI is neuro! Neurotech's strong connection between human and tool grants us superpowers. We’re testing technologies like electroencephalography (EEG) and transcranial direct current stimulation (tDCS) for connecting our biological brains with digital devices, and chemical catalysts like galantamine for exploring the creative space of lucid dreams.",
  },
  si: {
    name: 'Silverization',
    description:
      "As populations around the world are aging and peaking, we're entering a new era where commerce, culture, and countries can change for the better.",
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
  rr: {
    name: 'The Road to Regeneration',
    description:
      'The world is realizing that sustainability is insufficient. To restore and rebuild what has been lost, the higher goal of regenerative futures requires new technologies and practices.',
  },
  sp: {
    name: 'Space Technology',
    description:
      'Aerospace, satellite systems, and space exploration technologies.',
  },
  mo: {
    name: 'Mobility & Transportation',
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

function parseCSVRow(row: unknown): SubjectData | null {
  // Type guard: ensure row is an object
  if (!row || typeof row !== 'object') {
    return null;
  }

  const data = row as Record<string, string>;
  if (!data.ent_name || !data.ent_summary) {
    return null;
  }

  // Parse labs from the labs column
  const labsString = data.labs || '';
  const labs = labsString
    .split(',')
    .map((lab: string) => lab.trim().toLowerCase())
    .filter((lab: string) => lab.length > 0);

  // Parse synonyms
  const synonymsString = data.synonyms || '';
  let synonyms: string[] = [];

  if (synonymsString.startsWith('[') && synonymsString.endsWith(']')) {
    try {
      synonyms = JSON.parse(synonymsString);
    } catch {
      // If parsing fails, try splitting by comma
      synonyms = synonymsString
        .replace(/[[\]"]/g, '')
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
    fst: data.FST || '',
    fsid: data.ent_fsid
      ? data.ent_fsid.startsWith('fsid_')
        ? data.ent_fsid.substring(5)
        : data.ent_fsid
      : '',
    category: (data.category || '').toLowerCase(),
    name: data.ent_name,
    summary: data.ent_summary,
    fsCardUrl: data.fs_card || '',
    inventor: data.inventor || undefined,
    labs,
    synonyms,
    wikipediaDefinition:
      data.wikipedia_definition && data.wikipedia_definition !== 'nan'
        ? data.wikipedia_definition
        : undefined,
    wikipediaUrl:
      data.wikipedia_url && data.wikipedia_url !== 'wikipedia URL not found'
        ? data.wikipedia_url
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
      error: (error: Error) => {
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
  // First try to match by fsid directly
  const byFsid = subjects.find((subject) => subject.fsid === slug);
  if (byFsid) return byFsid;

  // If not found, try matching by converting the slug back to compare with fsid
  // (in case the URL encoding changed underscores to hyphens or vice versa)
  const normalizedSlug = slug.replace(/-/g, '_');
  const byNormalizedFsid = subjects.find(
    (subject) => subject.fsid === normalizedSlug
  );
  if (byNormalizedFsid) return byNormalizedFsid;

  // Finally, try matching by generating a slug from the name
  return subjects.find((subject) => {
    const nameSlug = subject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return nameSlug === slug;
  });
}
