import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Map database format to frontend format
function mapExamFromDB(dbExam: any) {
  return {
    id: dbExam.id,
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

// Map frontend format to database format
function mapExamToDB(exam: any) {
  return {
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

export function useExams() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exams = [] } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const response = await fetch('/api/exams');
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      return data.map(mapExamFromDB);
    },
  });

  const addExamMutation = useMutation({
    mutationFn: async (exam: any) => {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapExamToDB(exam)),
      });
      if (!response.ok) throw new Error('Failed to create exam');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
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
      queryClient.invalidateQueries({ queryKey: ['exams'] });
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
