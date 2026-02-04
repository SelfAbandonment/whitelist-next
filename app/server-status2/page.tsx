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
import { ArrowLeft, RefreshCw, Server, Copy, Loader2, Network, Cpu, Timer, Activity, XCircle, CheckCircle2, User, Clock } from 'lucide-react';
import { getServerStatus } from '@/lib/api';
import type { ServerDetail } from '@/lib/api';

export default function ServerStatus2Page() {
  const router = useRouter();
  const [servers, setServers] = useState<ServerDetail[]>([]);
  const [queryTime, setQueryTime] = useState('-');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const fetchServerStatus = async () => {
    setLoading(true);
    try {
      const res = await getServerStatus();
      setServers(Array.isArray(res.data) ? res.data : []);
      setQueryTime(new Date().toLocaleString('zh-CN'));
    } catch (error: any) {
      console.error('Failed to fetch server status:', error);
      showAlert(error.message || '获取服务器状态失败，请稍后重试', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showAlert('已复制到剪贴板', 'success');
    } catch (err) {
      showAlert('复制失败', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    return status === '在线' ? 'default' : 'destructive';
  };

  const getStatusText = (status: string) => {
    return status === '在线' ? '运行中' : '离线';
  };

  const getIndicatorColor = (indicator: string) => {
    if (indicator === '服务正常') return 'default';
    if (indicator === '服务降级') return 'secondary';
    return 'destructive';
  };

  const getRconColor = (rcon: string) => {
    return rcon === '成功' ? 'default' : 'destructive';
  };

  useEffect(() => {
    fetchServerStatus();
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
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Server className="h-7 w-7" />
            服务器详情
          </h1>
          <Button onClick={fetchServerStatus} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500 fade-in">
          💡 以下为当前公开可查询的服务器运行状态。
        </p>

        {servers.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-20 text-center text-gray-500">
              暂无服务器数据
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server, index) => (
              <Card 
                key={`${server['连接地址']}-${server['连接端口']}-${index}`}
                className="hover-lift shadow-lg slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(server['在线状态'])} className="font-semibold">
                        {getStatusText(server['在线状态'])}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      {server['版本']}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2 gradient-text">
                    {server['服务器名称']}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* 连接地址 */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-start gap-2 text-sm">
                      <Network className="h-4 w-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">连接地址</div>
                        <div className="text-gray-900 dark:text-gray-100 font-mono text-xs break-all font-semibold">
                          {server['连接地址']}:{server['连接端口']}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 flex-shrink-0"
                        onClick={() => copyToClipboard(`${server['连接地址']}:${server['连接端口']}`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* 服务器信息网格 */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* 核心 */}
                    <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <Cpu className="h-3 w-3" />
                        核心
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {server['核心']}
                      </div>
                    </div>

                    {/* Rcon */}
                    <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <Activity className="h-3 w-3" />
                        Rcon
                      </div>
                      <Badge variant={getRconColor(server['Rcon连接'])} className="text-xs">
                        {server['Rcon连接']}
                      </Badge>
                    </div>

                    {/* 在线人数 */}
                    <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <User className="h-3 w-3" />
                        在线
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {server['在线人数'] ?? '-'} / {server['最大人数'] ?? '-'}
                      </div>
                    </div>

                    {/* 延迟 */}
                    <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <Timer className="h-3 w-3" />
                        延迟
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {server['延迟(ms)'] ?? '-'} ms
                      </div>
                    </div>
                  </div>

                  {/* 指标 */}
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">服务指标</span>
                    <Badge variant={getIndicatorColor(server['指标'])} className="text-xs font-semibold">
                      {server['指标']}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
              {alertType === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {alertType === 'success' ? '成功' : '错误'}
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
