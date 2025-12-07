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

export function ExamTable({ exams, onUpdateStep, onDelete }: ExamTableProps) {
  const steps = Object.keys(STEP_LABELS) as ExamStep[];

  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[100px] text-right font-bold">اليوم</TableHead>
              <TableHead className="w-[120px] text-right font-bold">التاريخ</TableHead>
              <TableHead className="w-[150px] text-right font-bold">الصف</TableHead>
              <TableHead className="w-[150px] text-right font-bold">المادة</TableHead>
              <TableHead className="w-[120px] text-right font-bold">المصدر</TableHead>
              {steps.map((step) => (
                <TableHead key={step} className="text-center font-bold text-xs px-2 w-[80px]">
                  {STEP_LABELS[step]}
                </TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
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
              exams.map((exam) => (
                <TableRow key={exam.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{exam.day}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{exam.date}</TableCell>
                  <TableCell>{exam.grade}</TableCell>
                  <TableCell className="font-semibold text-primary">{exam.subject}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      exam.source === "مركزي" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" :
                      exam.source === "معلم المادة" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    )}>
                      {exam.source}
                    </span>
                  </TableCell>
                  {steps.map((step) => (
                    <TableCell key={step} className="text-center p-2">
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(exam.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
