"use client"

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Share2, Send, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export default function Home() {
  const [mounted, setMounted] = React.useState(false);
  const [posts, setPosts] = React.useState<any[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((res) => res.ok ? res.json() : { authenticated: false })
      .then((data) => setSession(data))
      .catch(() => setSession({ authenticated: false }));
      
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!inputValue.trim() || !session?.user?.nickname) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: inputValue,
          nickname: session.user.nickname,
        }),
      });

      if (res.ok) {
        setInputValue("");
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`${session?.user?.nickname ? `Привет, ${session.user.nickname}! ` : ""}Что происходит в университете?`}
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
            <Button 
              size="sm" 
              onClick={handlePost}
              disabled={!inputValue.trim()}
              className="bg-blue-700 hover:bg-blue-600 text-white"
            >
              <Send className="mr-2 h-4 w-4" /> Опубликовать
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10 text-slate-600 font-mono animate-pulse">Загрузка защищенного канала...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-slate-600 font-mono">На стене пока пусто. Будь первым!</div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="border-slate-800 bg-slate-950/50 hover:border-blue-900/40 transition-all duration-300">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-blue-600 rounded-full" />
                  <span className="text-sm font-semibold text-blue-400 font-mono">{post.nickname}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 uppercase font-mono">
                  <Clock className="h-3 w-3" />
                  {mounted ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru }) : "недавно"}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 pt-2 border-t border-slate-900/50">
                  <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-500 transition-colors">
                    <MessageSquare className="h-4 w-4" /> 0
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors ml-auto">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
