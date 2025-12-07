import { Layout } from "@/components/layout/Layout";
import { ExamTable } from "@/components/exam/ExamTable";
import { AddExamDialog } from "@/components/exam/AddExamDialog";
import { useExams } from "@/hooks/use-exams";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const { exams, addExam, updateStep, deleteExam } = useExams();

  const totalExams = exams.length;
  const completedSteps = exams.reduce((acc, exam) => {
    return acc + Object.values(exam.steps).filter(Boolean).length;
  }, 0);
  const totalSteps = totalExams * 8; // 8 steps per exam
  const progress = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">لوحة المتابعة</h1>
            <p className="text-muted-foreground mt-1">
              متابعة سير عمليات الاختبارات النهائية والتحريرية
            </p>
          </div>
          <AddExamDialog onAdd={addExam} />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الاختبارات
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExams}</div>
              <p className="text-xs text-muted-foreground">
                اختبار مسجل في النظام
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                نسبة الإنجاز
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress}%</div>
              <div className="h-2 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                المهام المتبقية
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSteps - completedSteps}</div>
              <p className="text-xs text-muted-foreground">
                خطوة عمل تحتاج للمتابعة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">جدول المتابعة اليومي</h2>
          <ExamTable 
            exams={exams} 
            onUpdateStep={updateStep} 
            onDelete={deleteExam}
          />
        </div>
      </div>
    </Layout>
  );
}
