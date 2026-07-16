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
