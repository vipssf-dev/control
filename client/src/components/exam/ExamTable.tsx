import { ExamRecord, ExamStep, STEP_LABELS } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamTableProps {
  exams: ExamRecord[];
  onUpdateStep: (id: string, step: ExamStep, checked: boolean) => void;
  onDelete: (id: string) => void;
}

function getProgressColor(progress: number): string {
  if (progress === 0) return "bg-red-500";
  if (progress <= 25) return "bg-red-400";
  if (progress <= 50) return "bg-orange-400";
  if (progress <= 75) return "bg-yellow-400";
  if (progress < 100) return "bg-lime-400";
  return "bg-green-500";
}

export function ExamTable({ exams, onUpdateStep, onDelete }: ExamTableProps) {
  const steps = Object.keys(STEP_LABELS) as ExamStep[];

  const calculateExamProgress = (exam: ExamRecord): number => {
    const completed = Object.values(exam.steps).filter(Boolean).length;
    return Math.round((completed / 8) * 100);
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block rounded-md border bg-card shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px] text-right font-bold">اليوم</TableHead>
                <TableHead className="w-[100px] text-right font-bold">التاريخ</TableHead>
                <TableHead className="w-[130px] text-right font-bold">الصف</TableHead>
                <TableHead className="w-[100px] text-right font-bold">المادة</TableHead>
                <TableHead className="w-[90px] text-right font-bold">المصدر</TableHead>
                {steps.map((step) => (
                  <TableHead key={step} className="text-center font-bold text-xs px-1 w-[70px]">
                    {STEP_LABELS[step]}
                  </TableHead>
                ))}
                <TableHead className="w-[100px] text-center font-bold">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5 + steps.length + 1} className="h-24 text-center text-muted-foreground">
                    لا توجد سجلات. قم بإضافة اختبار جديد للبدء.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam) => {
                  const progress = calculateExamProgress(exam);
                  return (
                    <TableRow key={exam.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-sm">{exam.day}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{exam.date}</TableCell>
                      <TableCell className="text-sm">{exam.grade}</TableCell>
                      <TableCell className="font-semibold text-primary text-sm">{exam.subject}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          exam.source === "مركزي" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" :
                          exam.source === "معلم المادة" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                          exam.source === "بنك الأسئلة" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        )}>
                          {exam.source}
                        </span>
                      </TableCell>
                      {steps.map((step) => (
                        <TableCell key={step} className="text-center p-1">
                          <div className="flex justify-center">
                            <Checkbox 
                              checked={exam.steps[step]} 
                              onCheckedChange={(checked) => onUpdateStep(exam.id, step, checked as boolean)}
                              className={cn(
                                "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
                                !exam.steps[step] && "border-muted-foreground/30"
                              )}
                            />
                          </div>
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <div className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white",
                            getProgressColor(progress)
                          )}>
                            {progress}%
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(exam.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {exams.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 bg-card rounded-lg border">
            لا توجد سجلات. قم بإضافة اختبار جديد للبدء.
          </div>
        ) : (
          exams.map((exam) => {
            const progress = calculateExamProgress(exam);
            return (
              <div key={exam.id} className="bg-card rounded-lg border shadow-sm p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary text-lg">{exam.subject}</span>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        exam.source === "مركزي" ? "bg-purple-100 text-purple-800" :
                        exam.source === "معلم المادة" ? "bg-blue-100 text-blue-800" :
                        exam.source === "بنك الأسئلة" ? "bg-amber-100 text-amber-800" :
                        "bg-gray-100 text-gray-800"
                      )}>
                        {exam.source}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exam.grade}</p>
                    <p className="text-xs text-muted-foreground font-mono">{exam.day} - {exam.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white",
                      getProgressColor(progress)
                    )}>
                      {progress}%
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(exam.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {steps.map((step) => (
                    <div key={step} className="flex flex-col items-center gap-1">
                      <Checkbox 
                        checked={exam.steps[step]} 
                        onCheckedChange={(checked) => onUpdateStep(exam.id, step, checked as boolean)}
                        className={cn(
                          "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 h-6 w-6",
                          !exam.steps[step] && "border-muted-foreground/30"
                        )}
                      />
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">
                        {STEP_LABELS[step]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
