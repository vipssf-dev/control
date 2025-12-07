import { useState, useEffect } from 'react';
import { ExamRecord, MOCK_DATA } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'mutabaa_exams_data_v1';

export function useExams() {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const { toast } = useToast();

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExams(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored exams", e);
        setExams(MOCK_DATA);
      }
    } else {
      setExams(MOCK_DATA);
    }
  }, []);

  // Save to local storage whenever exams change
  useEffect(() => {
    if (exams.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    }
  }, [exams]);

  const addExam = (exam: Omit<ExamRecord, 'id'>) => {
    const newExam = { ...exam, id: Math.random().toString(36).substr(2, 9) };
    setExams(prev => [newExam, ...prev]);
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة الاختبار الجديد بنجاح",
    });
  };

  const updateStep = (examId: string, step: keyof ExamRecord['steps'], value: boolean) => {
    setExams(prev => prev.map(exam => {
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
    }));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    toast({
      title: "تم الحذف",
      description: "تم حذف سجل الاختبار",
      variant: "destructive"
    });
  };

  return {
    exams,
    addExam,
    updateStep,
    deleteExam
  };
}
