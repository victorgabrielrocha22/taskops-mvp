
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Pill, Button } from '@/src/components/ui';
import type { Peca, Cliente, Status, Tipo } from '@/src/lib/types';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(url).then(r => r.json()).then(setData).finally(()=>setLoading(false));
  }, [url]);
  return { data, loading };
}

function PriorityPill({ value }: { value: number }) {
  const tone = value <= 3 ? 'red' : value <= 6 ? 'amber' : 'emerald';
  const label = value <= 3 ? 'Alta' : value <= 6 ? 'Média' : 'Baixa';
  return <Pill tone={tone as any}>P{value} · {label}</Pill>;
}

export default function Page() {
  const { data: clientes } = useFetch<Cliente[]>('/api/clients');
  const { data: pecas, } = useFetch<Peca[]>('/api/tasks');

  const [responsavel, setResponsavel] = useState<'Todos' | 'IURE' | 'ELIS'>('Todos');
  const [tipo, setTipo] = useState<'Todos' | Tipo>('Todos');
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const clienteById = useMemo(() => {
    const map: Record<string, Cliente> = {};
    (clientes || []).forEach(c => map[c.id] = c);
    return map;
  }, [clientes]);

  const filtered = useMemo(() => {
    let arr = (pecas || []).slice();
    if (!clientes) return arr;
    if (responsavel !== 'Todos') arr = arr.filter(p => clienteById[p.cliente_id]?.responsavel === responsavel);
    if (tipo !== 'Todos') arr = arr.filter(p => p.tipo === tipo);
    if (busca.trim()) arr = arr.filter(p => (clienteById[p.cliente_id]?.nome || '').toLowerCase().includes(busca.toLowerCase()));
    return arr;
  }, [pecas, responsavel, tipo, busca, clienteById, clientes]);

  const buckets: Record<Status, Peca[]> = useMemo(() => ({
    'Atrasado': filtered.filter(p => p.status === 'Atrasado'),
    'Hoje': filtered.filter(p => p.status === 'Hoje'),
    'Próximo': filtered.filter(p => p.status === 'Próximo'),
    'Concluído': filtered.filter(p => p.status === 'Concluído'),
  }), [filtered]);

  const totals = useMemo(() => ({
    atrasado: buckets['Atrasado'].reduce((acc, p) => acc + (p.qtd || 1), 0),
    hoje: buckets['Hoje'].length,
    proximo: buckets['Próximo'].length,
    concluido: buckets['Concluído'].length,
  }), [buckets]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900 dark:from-zinc-950 dark:to-black dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur dark:bg-zinc-900/70 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-2xl bg-black/90 dark:bg-white"></div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">TaskOps — Produção Diária</h1>
              <p className="text-xs text-zinc-500">Atrasos e agenda do dia</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone="red">Atrasado: {totals.atrasado}</Pill>
            <Pill tone="blue">Hoje: {totals.hoje}</Pill>
            <Pill tone="amber">Próximo: {totals.proximo}</Pill>
            <Pill tone="emerald">Concluído: {totals.concluido}</Pill>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* Sidebar */}
        <Card>
          <div className="p-3 border-b border-black/5 dark:border-white/10">
            <h2 className="text-sm font-semibold">Clientes</h2>
            <div className="mt-3 flex items-center gap-2">
              {(['Todos','IURE','ELIS'] as const).map(r => (
                <button key={r} onClick={()=>setResponsavel(r)} className={`pill ${responsavel===r?'bg-black text-white ring-black dark:bg-white dark:text-black':''}`}>{r}</button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {(['Todos','Feed','Stories','Reels','Outro'] as const).map(t => (
                <button key={t} onClick={()=>setTipo(t as any)} className={`pill ${tipo===t?'bg-black text-white ring-black dark:bg-white dark:text-black':''}`}>{t}</button>
              ))}
            </div>
            <div className="mt-3">
              <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar cliente" className="w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none focus:ring-4 ring-black/5 dark:bg-zinc-800 dark:border-white/10"/>
            </div>
          </div>
          <div className="max-h-[60vh] overflow-auto p-2 space-y-2">
            {(clientes||[]).filter(c=>c.nome.toLowerCase().includes(busca.toLowerCase())).map(c => (
              <button key={c.id} onClick={()=>setSelecionado(c.id)} className={`w-full text-left rounded-xl px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 ${selecionado===c.id?'ring-2 ring-black/10 dark:ring-white/10':''}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{c.nome}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{c.responsavel}</span>
                  <PriorityPill value={c.prioridade} />
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Board */}
        <div className="space-y-6">
          {(['Atrasado','Hoje','Próximo','Concluído'] as Status[]).map(bucket => (
            <section key={bucket} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{bucket}</h3>
                <span className="text-xs text-zinc-500">{(buckets[bucket]||[]).length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {(buckets[bucket]||[]).map(p => {
                  const cliente = clienteById[p.cliente_id];
                  return (
                    <Card key={p.id}>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{cliente?.nome || '—'}</div>
                            <div className="text-xs text-zinc-500">{p.tipo} · Resp. {cliente?.responsavel}</div>
                          </div>
                          {cliente && <PriorityPill value={cliente.prioridade} />}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {p.status==='Atrasado' && (p.atraso_desde ? `Desde ${new Date(p.atraso_desde).toLocaleDateString()}` : '—')}
                          {(p.status==='Hoje' || p.status==='Próximo') && (p.programado ? `Programado: ${new Date(p.programado).toLocaleDateString()}` : '—')}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{p.qtd ?? 1}× {p.tipo}</span>
                          <div className="flex gap-2">
                            {p.status!=='Concluído' && <Button kind="secondary" onClick={()=>{
                              fetch('/api/tasks', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: p.id, status: 'Próximo' })}).then(()=>location.reload());
                            }}>Adiar</Button>}
                            {p.status!=='Concluído' && <Button kind="primary" onClick={()=>{
                              fetch('/api/tasks', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: p.id, status: 'Concluído', qtd: null })}).then(()=>location.reload());
                            }}>Concluir</Button>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Detail */}
        <Card>
          <div className="p-4">
            {selecionado && clienteById[selecionado] ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold leading-tight">{clienteById[selecionado].nome}</h2>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span>{clienteById[selecionado].responsavel}</span>
                      <span>•</span>
                      <PriorityPill value={clienteById[selecionado].prioridade} />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-black/5 p-3 dark:border-white/10">
                  <h4 className="text-xs font-semibold mb-2">OBS</h4>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{clienteById[selecionado].obs || '—'}</p>
                </div>
              </div>
            ) : <div className="text-sm text-zinc-500">Selecione um cliente para ver detalhes.</div>}
          </div>
        </Card>
      </main>
    </div>
  );
}
