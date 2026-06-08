import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const DAY_ORDER = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء"];
const GRADE_ORDER = [
  "الصف الأول الابتدائي",
  "الصف الثاني الابتدائي", 
  "الصف الثالث الابتدائي",
  "الصف الرابع الابتدائي",
  "الصف الخامس الابتدائي",
  "الصف السادس الابتدائي"
];

function mapExamFromDB(dbExam: any) {
  return {
    id: dbExam.id,
    semester: dbExam.semester,
    day: dbExam.day,
    date: dbExam.date,
    grade: dbExam.grade,
    subject: dbExam.subject,
    source: dbExam.source,
    steps: {
      questionsExport: dbExam.questionsExport,
      photocopying: dbExam.photocopying,
      grading: dbExam.grading,
      reviewing: dbExam.reviewing,
      dataEntry: dbExam.dataEntry,
      auditing: dbExam.auditing,
      randomSample: dbExam.randomSample,
      reportSent: dbExam.reportSent,
    }
  };
}

function mapExamToDB(exam: any) {
  return {
    semester: exam.semester,
    day: exam.day,
    date: exam.date,
    grade: exam.grade,
    subject: exam.subject,
    source: exam.source,
    questionsExport: exam.steps?.questionsExport || false,
    photocopying: exam.steps?.photocopying || false,
    grading: exam.steps?.grading || false,
    reviewing: exam.steps?.reviewing || false,
    dataEntry: exam.steps?.dataEntry || false,
    auditing: exam.steps?.auditing || false,
    randomSample: exam.steps?.randomSample || false,
    reportSent: exam.steps?.reportSent || false,
  };
}

function sortExams(exams: any[]) {
  return [...exams].sort((a, b) => {
    const dayA = DAY_ORDER.indexOf(a.day);
    const dayB = DAY_ORDER.indexOf(b.day);
    if (dayA !== dayB) return dayA - dayB;
    
    const gradeA = GRADE_ORDER.indexOf(a.grade);
    const gradeB = GRADE_ORDER.indexOf(b.grade);
    if (gradeA !== gradeB) return gradeA - gradeB;
    
    return a.subject.localeCompare(b.subject, 'ar');
  });
}

export function useExams(semester: string = "1") {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exams = [] } = useQuery({
    queryKey: ['exams', semester],
    queryFn: async () => {
      const response = await fetch(`/api/exams?semester=${semester}`);
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      return sortExams(data.map(mapExamFromDB));
    },
  });

  const addExamMutation = useMutation({
    mutationFn: async (exam: any) => {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mapExamToDB(exam), semester }),
      });
      if (!response.ok) throw new Error('Failed to create exam');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', semester] });
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الاختبار الجديد بنجاح",
      });
    },
  });

  const updateStepMutation = useMutation({
    mutationFn: async ({ examId, step, value }: { examId: string; step: string; value: boolean }) => {
      const response = await fetch(`/api/exams/${examId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [step]: value }),
      });
      if (!response.ok) throw new Error('Failed to update exam');
      return response.json();
    },
    onMutate: async ({ examId, step, value }) => {
      await queryClient.cancelQueries({ queryKey: ['exams', semester] });
      const previousExams = queryClient.getQueryData(['exams', semester]);
      
      queryClient.setQueryData(['exams', semester], (old: any[]) => {
        if (!old) return old;
        return old.map(exam => {
          if (exam.id === examId) {
            return {
              ...exam,
              steps: {
                ...exam.steps,
                [step]: value
              }
            };
          }
          return exam;
        });
      });
      
      return { previousExams };
    },
    onError: (err, variables, context) => {
      if (context?.previousExams) {
        queryClient.setQueryData(['exams', semester], context.previousExams);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', semester] });
    },
  });

  const deleteExamMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/exams/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete exam');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', semester] });
      toast({
        title: "تم الحذف",
        description: "تم حذف سجل الاختبار",
        variant: "destructive"
      });
    },
  });

  const addExam = (exam: any) => {
    addExamMutation.mutate(exam);
  };

  const updateStep = (examId: string, step: string, value: boolean) => {
    updateStepMutation.mutate({ examId, step, value });
  };

  const deleteExam = (id: string) => {
    deleteExamMutation.mutate(id);
  };

  return {
    exams,
    addExam,
    updateStep,
    deleteExam
  };
}
