import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ExamRecord } from "@/lib/types";

const formSchema = z.object({
  day: z.string().min(1, "اليوم مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  grade: z.string().min(1, "الصف مطلوب"),
  subject: z.string().min(1, "المادة مطلوبة"),
  source: z.string().min(1, "المصدر مطلوب"),
});

interface AddExamDialogProps {
  onAdd: (data: Omit<ExamRecord, 'id'>) => void;
}

export function AddExamDialog({ onAdd }: AddExamDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: "",
      date: "",
      grade: "",
      subject: "",
      source: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Initialize steps as false
    const examData: Omit<ExamRecord, 'id'> = {
      ...values,
      steps: {
        questionsExport: false,
        photocopying: false,
        grading: false,
        reviewing: false,
        dataEntry: false,
        auditing: false,
        randomSample: false,
        reportSent: false,
      },
    };
    onAdd(examData);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة اختبار
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة اختبار جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات الاختبار الجديد لمتابعته في الجدول.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اليوم</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر اليوم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="الأحد">الأحد</SelectItem>
                        <SelectItem value="الاثنين">الاثنين</SelectItem>
                        <SelectItem value="الثلاثاء">الثلاثاء</SelectItem>
                        <SelectItem value="الأربعاء">الأربعاء</SelectItem>
                        <SelectItem value="الخميس">الخميس</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ</FormLabel>
                    <FormControl>
                      <Input placeholder="1447/01/01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الصف</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: الأول المتوسط" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المادة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: الرياضيات" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مصدر الأسئلة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المصدر" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="معلم المادة">معلم المادة</SelectItem>
                      <SelectItem value="مركزي">مركزي</SelectItem>
                      <SelectItem value="مشترك">مشترك</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit">حفظ</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
