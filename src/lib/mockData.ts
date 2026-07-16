export interface DashboardStats {
  attentionCount: number;
  computersWorking: number;
  computersTotal: number;
  printersFix: number;
  worthALook: number;
}

export interface DashboardTask {
  id: string;
  title: string;
  badges: string[];
  description?: string;
  severity: 'high' | 'medium';
  actionLabel: string;
}

export interface DashboardData {
  stats: DashboardStats;
  tasks: DashboardTask[];
}

const mockDashboardData: DashboardData = {
  stats: {
    attentionCount: 2,
    computersWorking: 61,
    computersTotal: 64,
    printersFix: 1,
    worthALook: 3,
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
};

export async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardData);
    }, 1500); // 1.5 second delay
  });
}
