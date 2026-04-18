import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Share2, Send } from "lucide-react";

const DEMO_POSTS = [
  {
    id: 1,
    content: "Кто-нибудь знает, когда будут результаты по экзу на кафедре экономики? Обещали еще в пятницу...",
    nickname: "Анонимный Финансист",
    likes: 12,
    comments: 4,
    time: "2 часа назад",
  },
  {
    id: 2,
    content: "В столовой на 3 этаже сегодня отличные пирожки. Всем советую, пока не разобрали!",
    nickname: "Голодный Менеджер",
    likes: 24,
    comments: 2,
    time: "4 часа назад",
  },
];

export default function Home() {
  return (
    <div className="container max-w-3xl py-8 px-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-50">Стена</h1>
        <p className="text-slate-500 text-sm font-mono">Анонимное пространство для общения студентов УрГЭУ</p>
      </div>

      {/* Post Creation */}
      <Card className="mb-10 border-blue-900/30 bg-slate-900/40 backdrop-blur-sm">
        <CardContent className="p-4">
          <textarea
            placeholder="Что происходит в университете? Пиши анонимно..."
            className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 text-slate-200 resize-none placeholder:text-slate-600 outline-none"
          />
          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="border-slate-800 text-slate-500 hover:text-slate-300 cursor-pointer">
                #вопрос
              </Badge>
              <Badge variant="outline" className="border-slate-800 text-slate-500 hover:text-slate-300 cursor-pointer">
                #слухи
              </Badge>
            </div>
            <Button size="sm" className="bg-blue-700 hover:bg-blue-600 text-white">
              <Send className="mr-2 h-4 w-4" /> Опубликовать
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-6">
        {DEMO_POSTS.map((post) => (
          <Card key={post.id} className="border-slate-800 bg-slate-950/50 hover:border-blue-900/40 transition-all duration-300">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-blue-600 rounded-full" />
                <span className="text-sm font-semibold text-blue-400 font-mono">{post.nickname}</span>
              </div>
              <span className="text-[10px] text-slate-600 uppercase font-mono">{post.time}</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed text-sm">
                {post.content}
              </p>
              <div className="flex items-center gap-4 pt-2 border-t border-slate-900/50">
                <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-500 transition-colors">
                  <MessageSquare className="h-4 w-4" /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors ml-auto">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
