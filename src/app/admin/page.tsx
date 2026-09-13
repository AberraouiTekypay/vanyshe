'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Video,
  Clock,
  Download,
  LogOut,
  RefreshCw,
  Globe2,
  Cpu,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Activity,
  Layers,
  Server,
  DollarSign,
  AlertCircle,
  GitBranch,
} from 'lucide-react';
import { DashboardMetrics } from '@/lib/analytics';
import { InfrastructureMetrics, computeInfrastructureMetrics } from '@/lib/infrastructure';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [infra, setInfra] = useState<InfrastructureMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'funnel' | 'retention' | 'infrastructure' | 'economics' | 'technology' | 'traction'
  >('overview');
  const router = useRouter();

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [resMetrics, resInfra] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/infrastructure'),
      ]);

      if (resMetrics.status === 401 || resInfra.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (resMetrics.ok) {
        const data = await resMetrics.json();
        setMetrics(data);
      }
      if (resInfra.ok) {
        const infraData = await resInfra.json();
        setInfra(infraData);
      }
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  const handleDownloadCsv = () => {
    window.location.href = '/api/admin/metrics?format=csv';
  };

  if (loading && (!metrics || !infra)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <p className="text-xs font-mono text-zinc-400">Loading Vanyshe Command Center...</p>
      </div>
    );
  }

  if (!metrics || !infra) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-bold tracking-tight text-white">Vanyshe Command Center</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={fetchMetrics}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-mono">Refresh</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          <Link
            href="/admin/infrastructure-playbook"
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 border border-zinc-700 transition-colors"
          >
            <GitBranch className="w-3 h-3 text-emerald-400" />
            <span className="hidden lg:inline">Playbook</span>
          </Link>

          <Link
            href="/admin/infrastructure-dependencies"
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 border border-zinc-700 transition-colors"
          >
            <Server className="w-3 h-3 text-emerald-400" />
            <span className="hidden lg:inline">Dependencies</span>
          </Link>

          <Link
            href="/admin/data-dictionary"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Data Dictionary</span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Core Principle Banner */}
      <div className="bg-zinc-900 border-b border-zinc-800/80 px-4 sm:px-8 py-2.5 text-xs text-zinc-400 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-200 font-medium">CORE PRINCIPLE:</span>
          <span>Measure the product. Never measure the conversation.</span>
        </div>
        <div className="text-[11px] text-zinc-500 flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Status: {infra.scale.status}
          </span>
          <span>•</span>
          <span>Max Room Participants: {infra.rooms.maxParticipantsPerRoom}</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-zinc-800 px-4 sm:px-8 bg-zinc-950/40">
        <div className="flex items-center gap-6 overflow-x-auto text-xs font-medium py-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-1 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-emerald-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Overview & KPIs
          </button>
          <button
            onClick={() => setActiveTab('funnel')}
            className={`pb-1 whitespace-nowrap transition-colors ${
              activeTab === 'funnel'
                ? 'text-white border-b-2 border-emerald-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Product Funnel
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`pb-1 whitespace-nowrap transition-colors ${
              activeTab === 'retention'
                ? 'text-white border-b-2 border-emerald-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Retention & Cohorts
          </button>
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`pb-1 whitespace-nowrap transition-colors ${
              activeTab === 'infrastructure'
                ? 'text-white border-b-2 border-emerald-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Infrastructure & Bandwidth
          </button>
          <button
            onClick={() => setActiveTab('economics')}
            className={`pb-1 whitespace-nowrap transition-colors ${
              activeTab === 'economics'
                ? 'text-white border-b-2 border-emerald-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Unit Economics & Costs
          </button>
          <button
            onClick={() => setActiveTab('technology')}
            className={`pb-1 whitespace-nowrap transition-colors ${
              activeTab === 'technology'
                ? 'text-white border-b-2 border-emerald-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Reliability & Health
          </button>
          <button
            onClick={() => setActiveTab('traction')}
            className={`pb-1 whitespace-nowrap transition-colors ${
              activeTab === 'traction'
                ? 'text-white border-b-2 border-emerald-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Investor Traction
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Live Operations Strip */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-zinc-200 font-semibold uppercase tracking-wider">Live Operations</span>
                  <span className="text-zinc-500">(Operational State Only)</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  System Healthy
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 block">Active Rooms</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">
                    {metrics.liveOperations.activeRoomsCount}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 block">Active Peer Connections</span>
                  <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                    {metrics.liveOperations.activeConnectionsCount}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 block">Current Sessions</span>
                  <span className="text-lg font-bold text-zinc-300 mt-0.5 block">
                    {metrics.liveOperations.currentSessions}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 block">Errors (Last Hour)</span>
                  <span className="text-lg font-bold text-zinc-300 mt-0.5 block">
                    {metrics.liveOperations.errorsLastHour}
                  </span>
                </div>
              </div>

              {/* Anonymized Active Rooms List */}
              <div className="mt-4 pt-4 border-t border-zinc-800/60">
                <span className="text-[11px] font-mono text-zinc-500 block mb-2">
                  Active Rooms Snapshot (Opaque hashes only):
                </span>
                <div className="flex flex-wrap gap-2">
                  {metrics.liveOperations.rooms.map((r, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-zinc-300">{r.safeRef}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-400">{r.participants} peers</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-500">{r.activeMinutes}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeframe KPI Blocks */}
            <div className="space-y-6">
              {/* Today */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Today</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Rooms Created</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {metrics.kpis.today.roomsCreated}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Conversations Completed</span>
                    <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                      {metrics.kpis.today.conversationsCompleted}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Avg Duration</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {metrics.kpis.today.avgDurationMinutes}m
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Connection Success</span>
                    <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                      {metrics.kpis.today.connectionSuccessRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 7 Days */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>7 Days</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Rooms Created</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {metrics.kpis.sevenDays.roomsCreated}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Unique Anonymous Visitors</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {metrics.kpis.sevenDays.uniqueAnonUsers}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Total Conversation Minutes</span>
                    <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                      {metrics.kpis.sevenDays.totalConversationMinutes.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Link Shares</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {metrics.kpis.sevenDays.referralActivity}
                    </span>
                  </div>
                </div>
              </div>

              {/* 30 Days */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400 mb-3 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>30 Days</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Total Rooms Created</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {metrics.kpis.thirtyDays.totalRooms}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Monthly Active Anonymous Visitors</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {metrics.kpis.thirtyDays.anonUsers}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Growth Rate (MoM)</span>
                    <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                      +{metrics.kpis.thirtyDays.growthRatePercent}%
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <span className="text-xs text-zinc-400 block font-mono">Share & Referral Rate</span>
                    <span className="text-2xl font-bold text-white mt-1 block">
                      {metrics.kpis.thirtyDays.referralRatePercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: INFRASTRUCTURE */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-8">
            {/* Top Architecture Recommendations Banner */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Automated Architecture Recommendations (Human Approval Required)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infra.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-xl border ${
                      rec.level === 'AMBER'
                        ? 'border-amber-500/30 bg-amber-500/5 text-amber-200'
                        : rec.level === 'RED'
                        ? 'border-red-500/30 bg-red-500/5 text-red-200'
                        : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {rec.level === 'AMBER' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className="font-bold text-sm text-white">{rec.title}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed mb-2">{rec.description}</p>
                    <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950/60 p-2 rounded border border-zinc-800">
                      <strong>Recommended:</strong> {rec.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic & Bandwidth KPIs */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400 mb-3">
                Traffic & Bandwidth Consumption
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 block font-mono">Total Participant-Minutes</span>
                  <span className="text-2xl font-bold text-white mt-1 block">
                    {infra.traffic.totalParticipantMinutes.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 block font-mono">Total Bandwidth</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                    {infra.traffic.totalBandwidthGB} GB
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 block font-mono">P2P Success Rate</span>
                  <span className="text-2xl font-bold text-white mt-1 block">
                    {infra.webrtc.p2pSuccessRate}%
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 block font-mono">TURN Fallback Rate</span>
                  <span className="text-2xl font-bold text-amber-400 mt-1 block">
                    {infra.webrtc.turnFallbackRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Room Size Distribution & Group Rooms */}
            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Room Sizing & Group Scalability (Target: 2–8 Participants)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block">Avg Participants / Room</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {infra.rooms.avgParticipantsPerRoom}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block">Configured Limit</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">
                    {infra.rooms.maxParticipantsPerRoom} max
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block">Group Rooms (&gt;2 participants)</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {infra.rooms.groupRoomPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: UNIT ECONOMICS */}
        {activeTab === 'economics' && (
          <div className="space-y-8">
            {/* Cost Alert Status */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Infrastructure Cost Monitoring & Alerts
                </span>
                <span className="text-sm font-semibold text-white mt-1 block">
                  {infra.costs.alerts.alertMessage}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                  Threshold 1: ${infra.costs.alerts.tier1Threshold}
                </span>
                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                  Threshold 2: ${infra.costs.alerts.tier2Threshold}
                </span>
              </div>
            </div>

            {/* Core Unit Cost KPIs */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400 mb-3">
                Unit Economics Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 block font-mono">Total Infrastructure Cost</span>
                  <span className="text-2xl font-bold text-white mt-1 block">
                    ${infra.costs.totalCost.toFixed(2)}/mo
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 block font-mono">Cost / Completed Call</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                    ${infra.costs.costPerCompletedConversation.toFixed(3)}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 block font-mono">Cost / Participant-Minute</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                    ${infra.costs.costPerParticipantMinute.toFixed(4)}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <span className="text-xs text-zinc-400 block font-mono">Cost / Active Anon User</span>
                  <span className="text-2xl font-bold text-white mt-1 block">
                    ${infra.costs.costPerActiveUser.toFixed(2)}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Cost Table */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 text-xs font-mono font-medium text-zinc-300">
                Itemized Monthly Infrastructure Ledger
              </div>
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-950/60 text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="p-3.5">Component</th>
                    <th className="p-3.5">Rate / Basis</th>
                    <th className="p-3.5">Monthly Cost</th>
                    <th className="p-3.5">Optimization Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="p-3.5 font-semibold text-white">Edge Compute & Signalling</td>
                    <td className="p-3.5">Serverless Functions</td>
                    <td className="p-3.5 text-white">${infra.costs.computeCost.toFixed(2)}</td>
                    <td className="p-3.5 text-zinc-500">Auto-scaling edge nodes</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-white">TURN Relays</td>
                    <td className="p-3.5">$0.09 / GB relay bandwidth</td>
                    <td className="p-3.5 text-white">${infra.costs.turnCost.toFixed(2)}</td>
                    <td className="p-3.5 text-zinc-500">Used only for strict symmetric NATs ({infra.webrtc.turnFallbackRate}%)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-white">WebRTC Media Routing (P2P)</td>
                    <td className="p-3.5">Direct peer browser media</td>
                    <td className="p-3.5 text-emerald-400">$0.00</td>
                    <td className="p-3.5 text-emerald-400/80">Direct DTLS-SRTP P2P has zero server routing costs</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-white">Database & Call Storage</td>
                    <td className="p-3.5">Zero persistent conversation records</td>
                    <td className="p-3.5 text-emerald-400">$0.00</td>
                    <td className="p-3.5 text-emerald-400/80">Privacy architecture guarantees $0 database bloat</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-white">CDN & Static Assets</td>
                    <td className="p-3.5">Next.js Edge Delivery</td>
                    <td className="p-3.5 text-white">${infra.costs.cdnCost.toFixed(2)}</td>
                    <td className="p-3.5 text-zinc-500">Cached global edge distribution</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Growth Scenario Planning Model */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Growth Scenario Model (Infrastructure Capacity Planning)
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Projected monthly costs as Vanyshe scales from 1k to 1M monthly active anonymous visitors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {infra.scenarios.map((sc, i) => (
                  <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs space-y-2">
                    <span className="font-bold text-sm text-emerald-400 block">{sc.mauTier}</span>
                    <div className="text-zinc-400">Est. Bandwidth: <span className="text-white">{sc.estimatedBandwidthTB} TB</span></div>
                    <div className="text-zinc-400">Est. Cost: <span className="text-emerald-400 font-bold">${sc.estimatedCost}/mo</span></div>
                    <div className="text-zinc-500 text-[11px]">Unit: ${sc.costPerUser} / anon user</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: FUNNEL */}
        {activeTab === 'funnel' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Product Conversion Funnel</h2>
              <p className="text-xs text-zinc-400 font-mono">
                From landing page visit to completed conversation and repeat retention.
              </p>
            </div>

            <div className="space-y-3">
              {metrics.funnel.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-400">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">{step.stage}</span>
                      <span className="text-xs text-zinc-500 font-mono">
                        {step.count.toLocaleString()} events
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Conversion</span>
                      <span className="text-emerald-400 font-bold">{step.conversionRate}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">Drop-off</span>
                      <span className="text-zinc-400">{step.dropoffRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: RETENTION */}
        {activeTab === 'retention' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Anonymous User Retention</h2>
              <p className="text-xs text-zinc-400 font-mono">
                Cohort retention based on anonymous client installation identifiers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">First-Time Visitors</span>
                <span className="text-2xl font-bold text-white mt-1 block">
                  {metrics.retention.firstTimeUsers}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Returning Users</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {metrics.retention.returningUsers}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">7-Day Return Rate</span>
                <span className="text-2xl font-bold text-white mt-1 block">
                  {metrics.retention.repeat7dRate}%
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">30-Day Return Rate</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {metrics.retention.repeat30dRate}%
                </span>
              </div>
            </div>

            {/* Cohorts Table */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 text-xs font-mono font-medium text-zinc-300">
                Weekly Anonymous Cohorts
              </div>
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-950/60 text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="p-3.5">Cohort</th>
                    <th className="p-3.5">Anonymous Visitors</th>
                    <th className="p-3.5">Returned 7d</th>
                    <th className="p-3.5">Returned 30d</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {metrics.retention.cohorts.map((c, i) => (
                    <tr key={i} className="hover:bg-zinc-900/80">
                      <td className="p-3.5 font-semibold text-white">{c.cohort}</td>
                      <td className="p-3.5">{c.users}</td>
                      <td className="p-3.5 text-emerald-400">{c.returned7d}</td>
                      <td className="p-3.5">{c.returned30d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: TECHNOLOGY & HEALTH */}
        {activeTab === 'technology' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">WebRTC & System Reliability</h2>
              <p className="text-xs text-zinc-400 font-mono">
                Technical connection health, browser distribution, and edge performance.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Connection Success %</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {metrics.technicalHealth.connectionSuccessRate}%
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Avg Connection Handshake</span>
                <span className="text-2xl font-bold text-white mt-1 block">
                  {metrics.technicalHealth.avgConnectionTimeSeconds}s
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">TURN Relay Usage</span>
                <span className="text-2xl font-bold text-zinc-300 mt-1 block">
                  {metrics.technicalHealth.turnUsagePercent}%
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Room Expiry Rate</span>
                <span className="text-2xl font-bold text-zinc-300 mt-1 block">
                  {metrics.technicalHealth.roomExpiryRate}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Browsers */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                  Browser Breakdown
                </h3>
                <div className="space-y-2.5">
                  {metrics.technicalHealth.browsers.map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300">{b.name}</span>
                      <span className="text-zinc-500">{b.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Devices */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                  Device Categories
                </h3>
                <div className="space-y-2.5">
                  {metrics.technicalHealth.devices.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300 capitalize">{d.name}</span>
                      <span className="text-zinc-500">{d.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: INVESTOR TRACTION */}
        {activeTab === 'traction' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Investor Traction Summary</h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Audit-ready product metrics for founders and investors.
                </p>
              </div>
              <button
                onClick={handleDownloadCsv}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold font-mono flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Traction CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">All-Time Rooms</span>
                <span className="text-2xl font-bold text-white mt-1 block">
                  {metrics.investorTraction.totalRooms}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Completed Calls</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {metrics.investorTraction.completedConversations}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Total Conversation Minutes</span>
                <span className="text-2xl font-bold text-white mt-1 block">
                  {metrics.investorTraction.totalConversationMinutes.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Returning User Rate</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {metrics.investorTraction.returningUserRate}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Weekly Active Visitors</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {metrics.investorTraction.weeklyActiveUsers}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Monthly Active Visitors</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {metrics.investorTraction.monthlyActiveUsers}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Week-over-Week Growth</span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">
                  +{metrics.investorTraction.wowGrowth}%
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <span className="text-xs text-zinc-400 block font-mono">Rooms / Active User</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {metrics.investorTraction.roomsPerUser}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
