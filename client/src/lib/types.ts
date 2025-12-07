export type ExamStep = 
  | 'questionsExport'
  | 'photocopying'
  | 'grading'
  | 'reviewing'
  | 'dataEntry'
  | 'auditing'
  | 'randomSample'
  | 'reportSent';

export interface ExamRecord {
  id: string;
  day: string;
  date: string;
  grade: string;
  subject: string;
  source: string;
  steps: {
    [key in ExamStep]: boolean;
  };
}

export const STEP_LABELS: Record<ExamStep, string> = {
  questionsExport: "تصدير الأسئلة",
  photocopying: "التصوير",
  grading: "التصحيح",
  reviewing: "المراجعة",
  dataEntry: "الرصد",
  auditing: "التدقيق",
  randomSample: "العينة العشوائية",
  reportSent: "إرسال التقارير للإدارة",
};

export const MOCK_DATA: ExamRecord[] = [
  {
    id: "1",
    day: "الأحد",
    date: "1447/07/15",
    grade: "الأول المتوسط",
    subject: "ريد 101",
    source: "مركزي",
    steps: {
      questionsExport: true,
      photocopying: true,
      grading: false,
      reviewing: false,
      dataEntry: false,
      auditing: false,
      randomSample: false,
      reportSent: false,
    },
  },
  {
    id: "2",
    day: "الاثنين",
    date: "1447/07/16",
    grade: "الثاني المتوسط",
    subject: "لغتي",
    source: "معلم المادة",
    steps: {
      questionsExport: true,
      photocopying: true,
      grading: true,
      reviewing: true,
      dataEntry: true,
      auditing: false,
      randomSample: false,
      reportSent: false,
    },
  },
];
