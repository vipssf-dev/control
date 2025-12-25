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
import { Plus, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { ExamRecord } from "@/lib/types";
import DatePicker from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";

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
                  <FormItem className="flex flex-col">
                    <FormLabel>التاريخ (هجري)</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(date) => {
                          if (date) {
                            // @ts-ignore
                            field.onChange(date.format("YYYY/MM/DD"));
                            
                            // Get the JavaScript Date and calculate day of week
                            // @ts-ignore
                            const jsDate = date.toDate();
                            const dayOfWeek = jsDate.getDay();
                            
                            // Map JavaScript day (0=Sunday) to Arabic day names
                            const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
                            const arabicDay = dayNames[dayOfWeek];
                            
                            // Only set if it's a school day (Sunday to Wednesday)
                            if (["الأحد", "الاثنين", "الثلاثاء", "الأربعاء"].includes(arabicDay)) {
                                form.setValue("day", arabicDay);
                            }
                          } else {
                            field.onChange("");
                          }
                        }}
                        calendar={arabic}
                        locale={arabic_ar}
                        calendarPosition="bottom-right"
                        inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        containerClassName="w-full"
                      />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الصف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="الصف الأول الابتدائي">الصف الأول الابتدائي</SelectItem>
                      <SelectItem value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</SelectItem>
                      <SelectItem value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</SelectItem>
                      <SelectItem value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</SelectItem>
                      <SelectItem value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</SelectItem>
                      <SelectItem value="الصف السادس الابتدائي">الصف السادس الابتدائي</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المادة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="الرياضيات">الرياضيات</SelectItem>
                      <SelectItem value="لغتي">لغتي</SelectItem>
                      <SelectItem value="العلوم">العلوم</SelectItem>
                      <SelectItem value="اللغة الإنجليزية">اللغة الإنجليزية</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="بنك الأسئلة">بنك الأسئلة</SelectItem>
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
