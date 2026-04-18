import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Filter, Award } from "lucide-react";
import { Input } from "@/components/ui/input";

const INSTITUTES = ["Все", "ИЭ", "ИМГТ", "ИЭУ", "ИЭП", "ИСТ", "ИДО"];

const TEACHERS = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    department: "Кафедра Экономики",
    institute: "ИЭ",
    difficulty: 4.5,
    charisma: 4.8,
    isTeacherOfMonth: true,
  },
  {
    id: 2,
    name: "Сидоров Петр Петрович",
    department: "Кафедра Информатики",
    institute: "ИСТ",
    difficulty: 3.2,
    charisma: 4.1,
    isTeacherOfMonth: false,
  },
  {
    id: 3,
    name: "Петрова Анна Сергеевна",
    department: "Кафедра Менеджмента",
    institute: "ИМГТ",
    difficulty: 2.8,
    charisma: 4.9,
    isTeacherOfMonth: false,
  },
];

export default function TeachersPage() {
  return (
    <div className="container max-w-5xl py-8 px-6">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-50">Преподы</h1>
          <p className="text-slate-500 text-sm font-mono">Рейтинг сложности и харизмы преподавателей УрГЭУ</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {INSTITUTES.map((inst) => (
            <Badge 
              key={inst} 
              variant={inst === "Все" ? "default" : "outline"}
              className={`${inst === "Все" ? "bg-blue-700" : "border-slate-800 text-slate-400"} cursor-pointer hover:bg-blue-800 transition-colors`}
            >
              {inst}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEACHERS.map((teacher) => (
          <Card key={teacher.id} className="border-slate-800 bg-slate-950/40 hover:border-blue-700/50 transition-all duration-500 group">
            <CardHeader className="relative">
              {teacher.isTeacherOfMonth && (
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-amber-500 text-black font-bold animate-pulse shadow-lg shadow-amber-500/20">
                    <Award className="mr-1 h-3 w-3" /> ПРЕПОД МЕСЯЦА
                  </Badge>
                </div>
              )}
              <CardTitle className="text-lg text-slate-200 group-hover:text-blue-400 transition-colors">{teacher.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-slate-900 text-[10px] text-slate-400 border-none font-mono">
                  {teacher.institute}
                </Badge>
                <span className="text-[10px] text-slate-600 font-mono italic">{teacher.department}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Сложность</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-400">{teacher.difficulty}</span>
                    <TrendingUp className="h-4 w-4 text-red-900/50" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Харизма</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-400">{teacher.charisma}</span>
                    <Star className="h-4 w-4 text-blue-900/50" />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-slate-900 hover:bg-blue-900/40 text-slate-300 border border-slate-800 hover:border-blue-700/50 transition-all text-sm h-9">
                Голосовать
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
