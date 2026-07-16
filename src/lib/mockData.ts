export interface DashboardStats {
  attentionCount: number;
  computersWorking: number;
  computersTotal: number;
  printersNeedingFix: number;
  issuesWorthReviewing: number;
}

export interface DashboardTask {
  id: string;
  title: string;
  badges: string[];
  description?: string;
  severity: 'high' | 'medium';
  actionLabel: string;
}

export interface DashboardFeedItem {
  id: string;
  text: string;
  time: string;
  type: 'g' | 'a' | 'r';
  techDetails?: string;
}

export interface ActivityLogEvent {
  id: string;
  category: 'fix' | 'look' | 'normal'; // r, a, g
  text: string;
  locationChip: string;
  time: string;
  severity: 'High' | 'Medium' | 'Info';
  techDetails?: string;
  dayGroup: string; // 'Today · Wednesday, June 10', 'Yesterday · Tuesday, June 9', etc.
}

export interface DashboardData {
  stats: DashboardStats;
  tasks: DashboardTask[];
  feed: DashboardFeedItem[];
}

const mockDashboardData: DashboardData = {
  stats: {
    attentionCount: 2,
    computersWorking: 61,
    computersTotal: 64,
    printersNeedingFix: 1,
    issuesWorthReviewing: 3,
  },
  tasks: [
    {
      id: 'task-1',
      title: 'Fix the Office printer',
      badges: ['Office'],
      description: 'stopped working at 11:42 AM',
      severity: 'high',
      actionLabel: 'Ask IT for help',
    },
    {
      id: 'task-2',
      title: 'Check 3 computers',
      badges: ['Lab 1 • PC 12', 'Lab 3 • PC 4', 'Office • PC 9'],
      severity: 'medium',
      actionLabel: 'Check now',
    },
  ],
  feed: [
    {
      id: 'f1',
      text: 'The Office printer stopped working.',
      time: '11:42 AM',
      type: 'r',
      techDetails: 'printer.spooler • code 0x709 • host=OFFICE-PRN1',
    },
    {
      id: 'f2',
      text: 'A computer in Lab 3 was slow to respond.',
      time: '11:20 AM',
      type: 'a',
      techDetails: 'perf.slow • cpu=98% • host=LAB3-PC04',
    },
    {
      id: 'f3',
      text: '5 new student accounts were added.',
      time: '10:55 AM',
      type: 'g',
    },
  ],
};

export async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardData);
    }, 1500); // 1.5 second delay
  });
}

export const mockActivityLogData: ActivityLogEvent[] = [
  // Today
  {
    id: 'al-1',
    category: 'fix',
    text: 'The Office printer stopped working.',
    locationChip: 'Office',
    time: '11:42 AM',
    severity: 'High',
    techDetails: 'printer.spooler · code 0x709 · host=OFFICE-PRN1',
    dayGroup: 'Today · Wednesday, June 10',
  },
  {
    id: 'al-2',
    category: 'look',
    text: 'A computer in Lab 3 was slow to respond.',
    locationChip: 'Lab 3 · PC 4',
    time: '11:20 AM',
    severity: 'Medium',
    techDetails: 'perf.slow · cpu=98% · host=LAB3-PC04',
    dayGroup: 'Today · Wednesday, June 10',
  },
  {
    id: 'al-3',
    category: 'normal',
    text: '5 new student accounts were added.',
    locationChip: 'Office',
    time: '10:55 AM',
    severity: 'Info',
    dayGroup: 'Today · Wednesday, June 10',
  },
  {
    id: 'al-4',
    category: 'look',
    text: 'Someone typed a wrong password 4 times in Lab 2.',
    locationChip: 'Lab 2',
    time: '10:15 AM',
    severity: 'Medium',
    techDetails: 'auth.fail · attempts=4 · host=LAB2-PC07',
    dayGroup: 'Today · Wednesday, June 10',
  },
  {
    id: 'al-5',
    category: 'look',
    text: 'A student opened a program they’re not allowed to use.',
    locationChip: 'Lab 1',
    time: '9:38 AM',
    severity: 'Medium',
    techDetails: 'policy.block · app=cmd.exe · host=LAB1-PC12',
    dayGroup: 'Today · Wednesday, June 10',
  },
  {
    id: 'al-6',
    category: 'normal',
    text: 'All morning records were saved successfully.',
    locationChip: 'System',
    time: '9:00 AM',
    severity: 'Info',
    dayGroup: 'Today · Wednesday, June 10',
  },
  {
    id: 'al-7',
    category: 'normal',
    text: 'A USB drive was plugged in at the front desk.',
    locationChip: 'Office',
    time: '8:05 AM',
    severity: 'Info',
    dayGroup: 'Today · Wednesday, June 10',
  },
  {
    id: 'al-8',
    category: 'normal',
    text: 'All computers started normally this morning.',
    locationChip: 'All rooms',
    time: '7:30 AM',
    severity: 'Info',
    dayGroup: 'Today · Wednesday, June 10',
  },
  // Yesterday
  {
    id: 'al-9',
    category: 'normal',
    text: 'Yesterday’s records were backed up successfully.',
    locationChip: 'System',
    time: '6:00 PM',
    severity: 'Info',
    dayGroup: 'Yesterday · Tuesday, June 9',
  },
  {
    id: 'al-10',
    category: 'fix',
    text: 'A Library computer overheated and shut down.',
    locationChip: 'Library',
    time: '2:12 PM',
    severity: 'High',
    techDetails: 'hw.thermal · temp=92C · host=LIB-PC03',
    dayGroup: 'Yesterday · Tuesday, June 9',
  },
  {
    id: 'al-11',
    category: 'normal',
    text: 'A software update was installed on all computers.',
    locationChip: 'All rooms',
    time: '7:00 AM',
    severity: 'Info',
    dayGroup: 'Yesterday · Tuesday, June 9',
  },
  // Monday
  {
    id: 'al-12',
    category: 'look',
    text: 'Someone typed a wrong password 3 times in the Office.',
    locationChip: 'Office',
    time: '3:24 PM',
    severity: 'Medium',
    techDetails: 'auth.fail · attempts=3 · host=OFFICE-PC10',
    dayGroup: 'Monday · June 8',
  },
  {
    id: 'al-13',
    category: 'normal',
    text: 'The Office printer was refilled with paper.',
    locationChip: 'Office',
    time: '1:10 PM',
    severity: 'Info',
    dayGroup: 'Monday · June 8',
  },
  {
    id: 'al-14',
    category: 'normal',
    text: 'All computers started normally this morning.',
    locationChip: 'All rooms',
    time: '7:30 AM',
    severity: 'Info',
    dayGroup: 'Monday · June 8',
  },
];

export async function fetchActivityLogData(): Promise<ActivityLogEvent[]> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivityLogData);
    }, 1000);
  });
}
