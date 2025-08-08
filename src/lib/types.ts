
export type Tipo = 'Feed' | 'Stories' | 'Reels' | 'Outro';
export type Status = 'Atrasado' | 'Hoje' | 'Próximo' | 'Concluído';

export interface Cliente {
  id: string;
  nome: string;
  responsavel: 'IURE' | 'ELIS';
  prioridade: number; // 1 alta ... 10 baixa
  obs?: string;
}

export interface Peca {
  id: string;
  cliente_id: string;
  tipo: Tipo;
  status: Status;
  qtd?: number;
  programado?: string;
  atraso_desde?: string;
}
