'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, RefreshCw, Server, User, Clock, Loader2, XCircle } from 'lucide-react';
import { getOnlinePlayers } from '@/lib/api';
import type { ServerStatus } from '@/lib/api';

export default function ServerStatusPage() {
  const router = useRouter();
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [queryTime, setQueryTime] = useState('-');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const refreshStatus = async () => {
    setLoading(true);
    try {
      const res = await getOnlinePlayers();
      const data = res.data;
      const serverList: ServerStatus[] = [];

      Object.entries(data).forEach(([serverName, serverData]: [string, any]) => {
        if (serverName === '查询时间') {
          setQueryTime(serverData);
          return;
        }

        let players: string[] = [];
        const playersStr = serverData['在线玩家'];
        if (playersStr) {
          players = playersStr
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map((p: string) => p.trim())
            .filter((p: string) => p);
        }

        serverList.push({
          name: serverName,
          playerCount: serverData['在线人数'],
          players: players,
        });
      });

      setServers(serverList);
    } catch (error: any) {
      console.error('Failed to fetch server status:', error);
      showAlert(error.message || '获取服务器状态失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  if (loading && servers.length === 0) {
    return (
      <main className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen animated-gradient p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4 fade-in">
          <Button variant="outline" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Server className="h-7 w-7" />
            服务器状态
          </h1>
          <Button onClick={refreshStatus} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server, index) => (
            <Card 
              key={server.name} 
              className="hover-lift shadow-lg slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    {server.name}
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1 font-semibold">
                    <User className="h-3 w-3" />
                    {server.playerCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {server.players.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 font-medium">
                      <User className="h-4 w-4" />
                      在线玩家:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {server.players.map((player) => (
                        <Badge 
                          key={player} 
                          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white transition-all hover:scale-110 pulse-glow"
                        >
                          {player}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6 italic">
                    暂无在线玩家
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 bg-white/50 dark:bg-gray-800/50 py-4 rounded-lg fade-in">
          <Clock className="h-4 w-4" />
          查询时间: {queryTime}
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              错误
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
