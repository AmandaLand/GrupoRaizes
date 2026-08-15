import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import officialLogo from '../Logo-Grupo-Raizes_350x110.png.webp';
import {
  AlertTriangle, ArrowRight, BarChart3, Bell, Bot, Check, CheckCircle2,
  ChevronDown, CircleDollarSign, Clock3, Database, FileCheck2, FileText,
  Download, LayoutDashboard, ListChecks, Play, Plus, Receipt, RefreshCw, Search,
  Settings, ShieldCheck, SlidersHorizontal, Users, WalletCards, X,
} from 'lucide-react';

type Operation = 'Todas' | 'Cucinari' | 'Quitanda Escolas';
type Modality = 'Todas' | 'Contratual' | 'Pré-pago' | 'Pós-pago';
type Status = 'Aprovado' | 'Aguardando revisão' | 'Divergência';
type ReportKind = 'consolidado' | 'divergencias' | 'memoria';

type BillingRow = {
  id: number; client: string; unit: string; operation: Exclude<Operation, 'Todas'>;
  modality: Exclude<Modality, 'Todas'>; actual: number; reference: number;
  complement: number; value: number; status: Status;
};

type BillingRule = { id: number; name: string; client: string; operation: Exclude<Operation, 'Todas'>; description: string; minimum: number; unitValue: number; };
type BillingExecution = { id: number; competence: string; operation: Exclude<Operation, 'Todas'>; modality: Exclude<Modality, 'Todas'>; period: string; status: 'Preparada' | 'Em processamento' };

const ruleSchema = z.object({
  name: z.string().min(3, 'Informe o nome da premissa.'),
  client: z.string().min(2, 'Informe o cliente ou operação.'),
  operation: z.enum(['Cucinari', 'Quitanda Escolas']),
  description: z.string().min(10, 'Descreva quando e como a regra deve ser aplicada.'),
  minimum: z.number().min(0, 'O mínimo não pode ser negativo.'),
  unitValue: z.number().positive('Informe um valor unitário maior que zero.'),
});
type RuleForm = z.infer<typeof ruleSchema>;

const executionSchema = z.object({
  competence: z.string().min(1, 'Informe a competência.'),
  operation: z.enum(['Cucinari', 'Quitanda Escolas']),
  modality: z.enum(['Contratual', 'Pré-pago', 'Pós-pago']),
  period: z.string().min(3, 'Informe o período de captura.'),
});
type ExecutionForm = z.infer<typeof executionSchema>;

const rows: BillingRow[] = [
  { id: 1, client: 'Indústrias Aurora', unit: 'Campinas • SP', operation: 'Cucinari', modality: 'Contratual', actual: 8500, reference: 10000, complement: 1500, value: 125005, status: 'Aguardando revisão' },
  { id: 2, client: 'Hospital Santa Clara', unit: 'São Paulo • SP', operation: 'Cucinari', modality: 'Contratual', actual: 12840, reference: 12000, complement: 0, value: 184920, status: 'Aprovado' },
  { id: 3, client: 'Colégio Horizonte', unit: 'Vila Mariana • SP', operation: 'Quitanda Escolas', modality: 'Pré-pago', actual: 1120, reference: 1120, complement: 0, value: 84600, status: 'Aprovado' },
  { id: 4, client: 'Escola Nova Geração', unit: 'Morumbi • SP', operation: 'Quitanda Escolas', modality: 'Pós-pago', actual: 932, reference: 1080, complement: 0, value: 63840, status: 'Divergência' },
  { id: 5, client: 'Grupo Horizonte', unit: 'Jundiaí • SP', operation: 'Cucinari', modality: 'Contratual', actual: 7350, reference: 8000, complement: 650, value: 97120, status: 'Aprovado' },
];

const initialRules: BillingRule[] = [
  { id: 1, name: 'Complemento de faturamento mínimo', client: 'Indústrias Aurora', operation: 'Cucinari', description: 'Se o consumo ficar abaixo do mínimo contratual, complementar a diferença pelo valor unitário vigente.', minimum: 10000, unitValue: 16.67 },
  { id: 2, name: 'Plano escolar pré-pago', client: 'Quitanda Escolas', operation: 'Quitanda Escolas', description: 'Cobrar os serviços pertencentes ao pacote contratado pelo responsável durante a vigência.', minimum: 0, unitValue: 75.54 },
];

const initialExecutions: BillingExecution[] = [
  { id: 1, competence: 'Julho de 2026', operation: 'Cucinari', modality: 'Contratual', period: '01/07/2026 a 31/07/2026', status: 'Em processamento' },
  { id: 2, competence: 'Julho de 2026', operation: 'Quitanda Escolas', modality: 'Pré-pago', period: '01/07/2026 a 31/07/2026', status: 'Preparada' },
];

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
const number = (value: number) => new Intl.NumberFormat('pt-BR').format(value);

const nav = [
  ['Visão geral', LayoutDashboard], ['Dashboard', BarChart3], ['Execuções', Play], ['Clientes e contratos', Users],
  ['Regras de negócio', SlidersHorizontal], ['Captação de dados', Database],
  ['Faturamento', CircleDollarSign], ['Divergências', AlertTriangle],
  ['Notas fiscais', Receipt], ['Boletos e cobranças', WalletCards],
  ['Relatórios', FileText], ['Auditoria', ShieldCheck], ['Configurações', Settings],
] as const;

const initialPage = () => {
  const requested = decodeURIComponent(window.location.hash.slice(1));
  return nav.some(([label]) => label === requested) ? requested : 'Visão geral';
};

const stages = [
  { label: 'Captura', count: 5, state: 'done' }, { label: 'Regras e IA', count: 5, state: 'done' },
  { label: 'Apuração', count: 5, state: 'done' }, { label: 'Validação', count: 4, state: 'active' },
  { label: 'Aprovação', count: 3, state: 'pending' }, { label: 'Teknisa', count: 2, state: 'pending' },
  { label: 'Cobrança', count: 2, state: 'pending' },
] as const;

function StatusBadge({ status }: { status: Status }) {
  return <span className={`status status-${status.toLowerCase().replace(' ', '-')}`}>
    <span className="status-dot" />{status}
  </span>;
}

const pageContent: Record<string, { eyebrow: string; title: string; description: string; action: string; next?: string }> = {
  'Execuções': { eyebrow: 'CICLOS DE FATURAMENTO', title: 'Execuções da competência', description: 'Crie, acompanhe e retome cada ciclo de faturamento.', action: 'Criar execução', next: 'Captação de dados' },
  'Clientes e contratos': { eyebrow: 'BASE CONTRATUAL', title: 'Clientes e contratos', description: 'Cadastros, vigências e premissas usadas no cálculo.', action: 'Novo contrato', next: 'Regras de negócio' },
  'Regras de negócio': { eyebrow: 'INTELIGÊNCIA CONTRATUAL', title: 'Regras de faturamento', description: 'Regras interpretadas e versionadas sem alteração de código.', action: 'Criar regra', next: 'Faturamento' },
  'Captação de dados': { eyebrow: 'ENTRADA CONTROLADA', title: 'Captação e normalização', description: 'Dados são copiados das fontes e validados antes da apuração.', action: 'Executar captura', next: 'Faturamento' },
  'Faturamento': { eyebrow: 'MOTOR DE CÁLCULO', title: 'Apuração inteligente', description: 'Consumo, contratos e regras combinados com explicação do cálculo.', action: 'Processar apuração', next: 'Divergências' },
  'Divergências': { eyebrow: 'CONTROLE HUMANO', title: 'Conferência e aprovação', description: 'Exceções precisam de decisão financeira antes da execução.', action: 'Aprovar selecionados', next: 'Notas fiscais' },
  'Notas fiscais': { eyebrow: 'EXECUÇÃO SIMULADA', title: 'Notas fiscais no Teknisa', description: 'Lançamentos preparados após a aprovação financeira.', action: 'Simular emissão', next: 'Boletos e cobranças' },
  'Boletos e cobranças': { eyebrow: 'COBRANÇA', title: 'Boletos e comunicações', description: 'Acompanhe geração, vencimento e envio aos clientes.', action: 'Simular envio', next: 'Auditoria' },
  'Relatórios': { eyebrow: 'GESTÃO E EXPORTAÇÃO', title: 'Relatórios de faturamento', description: 'Filtre os resultados e extraia arquivos para conferência ou apresentação.', action: 'Exportar CSV' },
  'Auditoria': { eyebrow: 'RASTREABILIDADE', title: 'Trilha de auditoria', description: 'Histórico imutável das decisões humanas e ações do motor.', action: 'Exportar trilha' },
  'Configurações': { eyebrow: 'ADMINISTRAÇÃO', title: 'Configurações da POC', description: 'Parâmetros de segurança, integração e execução simulada.', action: 'Salvar configurações' },
};

const sourceItems = [
  ['Oracle / Teknisa', '125.430 registros', 'Conectado'], ['Contratos', '160 documentos', 'Concluído'],
  ['Planos Quitanda', '12.250 registros', 'Concluído'], ['Catracas', '82.245 consumos', 'Atenção'],
];

function RuleModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: RuleForm) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<RuleForm>({ resolver: zodResolver(ruleSchema), defaultValues: { operation: 'Cucinari', minimum: 0, unitValue: 0 } });
  return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="rule-title"><header><div><span>NOVA PREMISSA</span><h2 id="rule-title">Cadastrar regra de faturamento</h2><p>A regra ficará disponível no motor de apuração desta POC.</p></div><button onClick={onClose} aria-label="Fechar"><X size={18}/></button></header><form onSubmit={handleSubmit(onSubmit)}>
    <div className="form-grid"><label>Nome da premissa<input {...register('name')} placeholder="Ex.: Faturamento mínimo mensal"/>{errors.name && <small role="alert">{errors.name.message}</small>}</label><label>Cliente ou operação<input {...register('client')} placeholder="Ex.: Cliente Alfa"/>{errors.client && <small role="alert">{errors.client.message}</small>}</label><label>Operação<select {...register('operation')}><option>Cucinari</option><option>Quitanda Escolas</option></select></label><label>Mínimo contratado<input type="number" step="1" {...register('minimum', { valueAsNumber: true })} />{errors.minimum && <small role="alert">{errors.minimum.message}</small>}</label><label>Valor unitário (R$)<input type="number" step="0.01" {...register('unitValue', { valueAsNumber: true })} />{errors.unitValue && <small role="alert">{errors.unitValue.message}</small>}</label><label className="full-field">Descrição da regra<textarea rows={4} {...register('description')} placeholder="Explique a condição, cálculo e exceções."/>{errors.description && <small role="alert">{errors.description.message}</small>}</label></div>
    <footer><button type="button" onClick={onClose}>Cancelar</button><button className="primary" type="submit"><Plus size={15}/> Salvar premissa</button></footer>
  </form></section></div>;
}

function ExecutionModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: ExecutionForm) => void }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExecutionForm>({ resolver: zodResolver(executionSchema), defaultValues: { competence: 'Julho de 2026', operation: 'Cucinari', modality: 'Contratual', period: '01/07/2026 a 31/07/2026' } });
  const selectedOperation = watch('operation');
  return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="execution-title"><header><div><span>NOVO CICLO</span><h2 id="execution-title">Criar execução de faturamento</h2><p>Defina o recorte de dados que seguirá para captura e apuração.</p></div><button onClick={onClose} aria-label="Fechar"><X size={18}/></button></header><form onSubmit={handleSubmit(onSubmit)}>
    <div className="form-grid"><label>Competência<input {...register('competence')}/>{errors.competence && <small role="alert">{errors.competence.message}</small>}</label><label>Operação<select {...register('operation', { onChange: event => setValue('modality', event.target.value === 'Cucinari' ? 'Contratual' : 'Pré-pago') })}><option>Cucinari</option><option>Quitanda Escolas</option></select></label><label>Modalidade<select {...register('modality')}>{selectedOperation === 'Cucinari' ? <option>Contratual</option> : <><option>Pré-pago</option><option>Pós-pago</option></>}</select></label><label>Período de captura<input {...register('period')}/>{errors.period && <small role="alert">{errors.period.message}</small>}</label></div>
    <div className="safe-note"><ShieldCheck size={17}/><span><strong>Modo seguro ativo</strong>Nenhum dado será escrito no Teknisa durante esta execução.</span></div><footer><button type="button" onClick={onClose}>Cancelar</button><button className="primary" type="submit"><Play size={15}/> Criar e continuar</button></footer>
  </form></section></div>;
}

function OperationalPage({ page, onNext, notify, filteredRows, rules, executions, onCreateRule, onCreateExecution, onExport }: { page: string; onNext: (page: string) => void; notify: (message: string) => void; filteredRows: BillingRow[]; rules: BillingRule[]; executions: BillingExecution[]; onCreateRule: () => void; onCreateExecution: () => void; onExport: (kind?: ReportKind) => void }) {
  const content = pageContent[page] ?? pageContent['Execuções'];
  const [searchTerm, setSearchTerm] = useState('');
  const visibleRows = filteredRows.filter(row => `${row.client} ${row.unit}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const runAction = () => page === 'Regras de negócio' ? onCreateRule() : page === 'Execuções' ? onCreateExecution() : ['Relatórios', 'Auditoria'].includes(page) ? onExport() : notify(`${content.action} concluído em modo demonstrativo`);
  return <div className="operational-page">
    <div className="page-hero"><div><span>{content.eyebrow}</span><h2>{content.title}</h2><p>{content.description}</p></div><button onClick={runAction}>{['Relatórios','Auditoria'].includes(page) ? <Download size={16}/> : page === 'Regras de negócio' ? <Plus size={16}/> : <Play size={16} fill="currentColor"/>}{content.action}</button></div>
    {page === 'Captação de dados' && <div className="source-grid">{sourceItems.map(([name, volume, state]) => <article key={name}><div className="source-head"><Database size={19}/><span className={state === 'Atenção' ? 'source-warning' : 'source-ok'}>{state}</span></div><h3>{name}</h3><strong>{volume}</strong><p>Última sincronização hoje, 12:18</p><div className="progress"><i style={{width: state === 'Atenção' ? '72%' : '100%'}}/></div></article>)}</div>}
    {page === 'Regras de negócio' && <div className="rules-layout">{rules.map((rule,index)=><article className="rule-card" key={rule.id}><div><Bot size={19}/><span>{index < 2 ? `${98-index*2}% confiança` : 'Cadastrada manualmente'}</span></div><h3>{rule.name}</h3><p>{rule.description}</p><div className="rule-values"><span>Mínimo: <strong>{number(rule.minimum)}</strong></span><span>Valor: <strong>{money(rule.unitValue)}</strong></span></div><footer><strong>{rule.client}</strong><span>{rule.operation} • Ativa</span></footer></article>)}<button className="new-rule" onClick={onCreateRule}>+ Cadastrar condição inédita</button></div>}
    {page === 'Faturamento' && <div className="calculation-grid"><article className="ai-explanation"><div className="ai-title"><Bot/><div><span>MOTOR DE FATURAMENTO</span><h3>Cálculo explicado pela IA</h3></div></div><dl><div><dt>Cliente</dt><dd>Indústrias Aurora</dd></div><div><dt>Consumo realizado</dt><dd>8.500 refeições</dd></div><div><dt>Mínimo contratual</dt><dd>10.000 refeições</dd></div><div><dt>Diferença</dt><dd>1.500 refeições</dd></div><div className="total-line"><dt>Complemento calculado</dt><dd>R$ 25.005,00</dd></div></dl><p className="reason"><CheckCircle2 size={16}/>A regra foi aplicada porque o consumo ficou abaixo do mínimo garantido no contrato.</p></article><article className="processing-log"><h3>Etapas do processamento</h3>{['Dados validados','Cliente identificado','Contrato localizado','Regra aplicada','Complemento calculado'].map((item, index)=><div key={item}><span><Check size={13}/></span><p>{item}<small>Concluído às 12:{10 + index}</small></p></div>)}</article></div>}
    {page === 'Divergências' && <div className="review-list"><article><div className="review-severity high">ALTA</div><div><h3>Consumo 32% abaixo da média</h3><p>Escola Nova Geração • Quitanda Escolas • Pós-pago</p><span>A catraca registrou 932 consumos contra uma referência histórica de 1.370.</span></div><div className="review-actions"><button onClick={() => notify('Item enviado para reprocessamento')}>Reprocessar</button><button className="approve" onClick={() => notify('Divergência aprovada e registrada')}>Aprovar</button></div></article><article><div className="review-severity medium">MÉDIA</div><div><h3>Nova cláusula contratual</h3><p>Indústrias Aurora • Cucinari</p><span>O motor encontrou uma condição sem correspondência exata nas regras ativas.</span></div><div className="review-actions"><button>Editar regra</button><button className="approve" onClick={() => notify('Regra validada por usuário financeiro')}>Validar</button></div></article></div>}
    {page === 'Execuções' && <div className="execution-list">{executions.map(item=><article key={item.id}><div className="execution-icon"><Play size={16}/></div><div><strong>{item.competence} • {item.operation}</strong><span>{item.modality} • {item.period}</span></div><em className={item.status === 'Em processamento' ? 'running' : ''}>{item.status}</em><button onClick={() => onNext('Captação de dados')}>Abrir <ArrowRight size={14}/></button></article>)}</div>}
    {['Clientes e contratos','Notas fiscais','Boletos e cobranças'].includes(page) && <div className="data-panel"><div className="data-panel-head"><div className="search"><Search size={16}/><input value={searchTerm} onChange={event=>setSearchTerm(event.target.value)} placeholder="Pesquisar cliente ou unidade" aria-label={`Pesquisar em ${page}`}/></div><span>{visibleRows.length} resultados filtrados</span></div><table><thead><tr><th>Identificação</th><th>Operação</th><th>Competência / vencimento</th><th>Valor / volume</th><th>Status</th><th></th></tr></thead><tbody>{visibleRows.map((row,index)=><tr key={row.id}><td><strong>{page === 'Notas fiscais' ? `NF 000${12540 + index}` : row.client}</strong><span>{row.unit}</span></td><td><strong>{row.operation}</strong><span>{row.modality}</span></td><td>Julho/2026</td><td><strong>{money(row.value)}</strong></td><td><StatusBadge status={row.status}/></td><td><button aria-label={`Abrir ${row.client}`} className="row-open"><ArrowRight size={16}/></button></td></tr>)}</tbody></table>{visibleRows.length === 0 && <div className="empty">Nenhum resultado para os filtros selecionados.</div>}</div>}
    {page === 'Relatórios' && <div className="reports-grid"><article><FileText size={22}/><div><h3>Apuração consolidada</h3><p>Clientes, consumo, referência, complemento, valor e situação.</p><span>{filteredRows.length} registros na seleção atual</span></div><button onClick={()=>onExport('consolidado')}><Download size={15}/> Extrair CSV</button></article><article><AlertTriangle size={22}/><div><h3>Relatório de divergências</h3><p>Ocorrências que precisam de revisão ou aprovação humana.</p><span>{filteredRows.filter(row=>row.status === 'Divergência').length} divergências na seleção</span></div><button onClick={()=>onExport('divergencias')}><Download size={15}/> Extrair CSV</button></article><article><ShieldCheck size={22}/><div><h3>Memória de cálculo</h3><p>Base para conferência das regras e valores apurados.</p><span>Competência julho/2026</span></div><button onClick={()=>onExport('memoria')}><Download size={15}/> Extrair CSV</button></article></div>}
    {page === 'Auditoria' && <div className="timeline">{['Dados capturados do Oracle','Contrato e regra identificados','Apuração calculada pelo motor','Divergência revisada por Marina Costa','Lançamento preparado para o Teknisa'].map((item,index)=><div key={item}><time>12:{index < 1 ? '02' : `0${index*2+2}`}</time><span><Check size={12}/></span><p><strong>{item}</strong><small>{index === 3 ? 'Ação humana registrada' : 'Ação automática • POC'}</small></p></div>)}</div>}
    {page === 'Configurações' && <div className="settings-panel"><label><span>Modo seguro da POC<small>Impede qualquer escrita no ambiente real</small></span><input type="checkbox" defaultChecked/></label><label><span>Aprovação humana obrigatória<small>Bloqueia emissão antes da conferência</small></span><input type="checkbox" defaultChecked/></label><label><span>Integração Oracle/Teknisa<small>Desabilitada neste ambiente demonstrativo</small></span><input type="checkbox" disabled/></label></div>}
    {content.next && <div className="next-step"><div><span>PRÓXIMA ETAPA</span><strong>{content.next}</strong></div><button onClick={() => onNext(content.next!)}>Continuar fluxo <ArrowRight size={15}/></button></div>}
  </div>;
}

function DashboardCharts({ operation, modality }: { operation: Operation; modality: Modality }) {
  const factor = operation === 'Cucinari' ? .78 : operation === 'Quitanda Escolas' ? (modality === 'Pré-pago' ? .14 : modality === 'Pós-pago' ? .08 : .22) : 1;
  const monthly = [420, 468, 451, 506, 544, 592].map(value => Math.round(value * factor));
  const max = Math.max(...monthly);
  const points = monthly.map((value, index) => `${18 + index * 52},${105 - (value / max) * 78}`).join(' ');
  const bars = operation === 'Todas'
    ? [{ label: 'Cucinari', value: 462 }, { label: 'Quitanda Pré', value: 84 }, { label: 'Quitanda Pós', value: 46 }]
    : operation === 'Cucinari'
      ? [{ label: 'Contratual', value: 437 }, { label: 'Complementos', value: 25 }]
      : modality === 'Pré-pago' ? [{ label: 'Pré-pago', value: 84 }] : modality === 'Pós-pago' ? [{ label: 'Pós-pago', value: 46 }] : [{ label: 'Pré-pago', value: 84 }, { label: 'Pós-pago', value: 46 }];
  const barMax = Math.max(...bars.map(item => item.value));

  return <section className="charts-section" aria-label="Indicadores gráficos">
    <div className="charts-title"><div><h2>Análise da competência</h2><p>Indicadores financeiros e operacionais da seleção atual</p></div><span>Valores em milhares de reais</span></div>
    <div className="charts-grid">
      <figure className="chart-card"><figcaption><div><strong>Faturamento por operação</strong><span>Composição do valor apurado</span></div><BarChart3 size={18}/></figcaption><div className="bar-chart">{bars.map((item, index) => <div className="bar-row" key={item.label}><span>{item.label}</span><div><i className={`bar-tone-${index + 1}`} style={{ width: `${(item.value / barMax) * 100}%` }}/></div><strong>R$ {item.value} mil</strong></div>)}</div><footer><span className="trend-up">↗ 8,4%</span> em relação ao mês anterior</footer></figure>
      <figure className="chart-card"><figcaption><div><strong>Evolução do faturamento</strong><span>Últimos seis meses</span></div><span className="chart-value">R$ {monthly[5]} mil</span></figcaption><div className="line-chart"><svg viewBox="0 0 300 120" role="img" aria-label="Evolução mensal do faturamento"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#58595B" stopOpacity=".24"/><stop offset="1" stopColor="#58595B" stopOpacity="0"/></linearGradient></defs><path d={`M ${points} L278 112 L18 112 Z`} fill="url(#area)"/><polyline points={points} fill="none" stroke="#58595B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{monthly.map((value,index)=><circle key={index} cx={18 + index*52} cy={105 - (value/max)*78} r="4" fill="white" stroke="#58595B" strokeWidth="2"/>)}</svg><div>{['Fev','Mar','Abr','Mai','Jun','Jul'].map(month=><span key={month}>{month}</span>)}</div></div><footer><span className="trend-up">↗ 12,1%</span> crescimento no período</footer></figure>
      <figure className="chart-card"><figcaption><div><strong>Status do processamento</strong><span>Distribuição dos clientes</span></div><ListChecks size={18}/></figcaption><div className="donut-layout"><div className="donut" role="img" aria-label="62% aprovados, 24% em revisão e 14% com divergência"><div><strong>62%</strong><span>aprovados</span></div></div><div className="donut-legend"><div><i className="approved"/><span>Aprovados</span><strong>62%</strong></div><div><i className="waiting"/><span>Em revisão</span><strong>24%</strong></div><div><i className="issue"/><span>Divergências</span><strong>14%</strong></div></div></div><footer><span>3 itens</span> requerem atenção humana</footer></figure>
    </div>
  </section>;
}

export function App() {
  const [operation, setOperation] = useState<Operation>('Todas');
  const [modality, setModality] = useState<Modality>('Todas');
  const [activeNav, setActiveNav] = useState(initialPage);
  const [toast, setToast] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [modal, setModal] = useState<'rule' | 'execution' | null>(null);
  const [rules, setRules] = useState<BillingRule[]>(initialRules);
  const [executions, setExecutions] = useState<BillingExecution[]>(initialExecutions);
  const [tableSearch, setTableSearch] = useState('');

  const filtered = useMemo(() => rows.filter(row =>
    (operation === 'Todas' || row.operation === operation) &&
    (modality === 'Todas' || row.modality === modality)
  ), [operation, modality]);
  const visibleOverviewRows = filtered.filter(row => `${row.client} ${row.unit}`.toLowerCase().includes(tableSearch.toLowerCase()));
  const total = filtered.reduce((sum, row) => sum + row.value, 0);
  const divergences = filtered.filter(row => row.status === 'Divergência').length;

  const chooseOperation = (next: Operation) => {
    setOperation(next);
    setModality(next === 'Cucinari' ? 'Contratual' : 'Todas');
  };

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3000); };
  const addRule = (data: RuleForm) => { setRules(current => [...current, { id: Date.now(), ...data }]); setModal(null); setActiveNav('Regras de negócio'); notify('Premissa salva e disponibilizada para o motor de regras'); };
  const addExecution = (data: ExecutionForm) => { setExecutions(current => [{ id: Date.now(), ...data, status: 'Preparada' }, ...current]); setModal(null); setActiveNav('Execuções'); notify('Execução criada e pronta para captura'); };
  const exportReport = (kind: ReportKind = 'consolidado') => {
    const header = ['Cliente','Unidade','Operação','Modalidade','Consumo real','Referência','Complemento','Valor apurado','Status'];
    const selectedRows = kind === 'divergencias' ? filtered.filter(row => row.status === 'Divergência') : filtered;
    const body = selectedRows.map(row => [row.client,row.unit,row.operation,row.modality,row.actual,row.reference,row.complement,row.value,row.status]);
    const csv = '\uFEFF' + [header,...body].map(columns => columns.map(value => `"${String(value).replaceAll('"','""')}"`).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${kind}-julho-2026-${operation.toLowerCase().replaceAll(' ','-')}.csv`; link.click(); URL.revokeObjectURL(url); notify(`${selectedRows.length} registros exportados em CSV`);
  };

  return <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
    <aside className="sidebar">
      <div className="brand">
        <button className="brand-button" onClick={() => setCollapsed(value => !value)} aria-label={collapsed ? 'Expandir menu' : 'Minimizar menu'} title={collapsed ? 'Expandir menu' : 'Minimizar menu'}>
          <img src={officialLogo} alt="Grupo Raízes" />
        </button>
      </div>
      <nav aria-label="Navegação principal">
        <p className="nav-label">OPERAÇÃO</p>
        {nav.map(([label, Icon]) => <button key={label} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{label === 'Divergências' && <em>3</em>}</button>)}
      </nav>
      <div className="sidebar-footer"><div className="avatar">MC</div><div><strong>Marina Costa</strong><span>Financeiro</span></div><ChevronDown size={16} /></div>
    </aside>

    <main>
      <header className="topbar">
        <div><p>OPERAÇÃO FINANCEIRA</p><h1>{activeNav}</h1></div>
        <div className="top-actions"><span className="demo-pill"><span /> Ambiente demonstrativo</span><button aria-label="Notificações"><Bell size={19}/><i /></button></div>
      </header>

      <section className="content">
        <div className="filters-card">
          <div><label>OPERAÇÃO / MARCA</label><div className="segmented" role="group" aria-label="Filtrar por operação">
            {(['Todas', 'Cucinari', 'Quitanda Escolas'] as Operation[]).map(item => <button key={item} className={operation === item ? 'selected' : ''} onClick={() => chooseOperation(item)}>{item}</button>)}
          </div></div>
          <div><label>MODALIDADE</label><div className="select-wrap"><select aria-label="Filtrar por modalidade" value={modality} onChange={e => setModality(e.target.value as Modality)}>
            <option>Todas</option>{operation !== 'Quitanda Escolas' && <option>Contratual</option>} {operation !== 'Cucinari' && <><option>Pré-pago</option><option>Pós-pago</option></>}
          </select><ChevronDown size={16}/></div></div>
          <div><label>COMPETÊNCIA</label><div className="select-wrap"><select aria-label="Competência"><option>Julho de 2026</option></select><ChevronDown size={16}/></div></div>
          <button className="new-run" onClick={() => setModal('execution')}><Play size={17} fill="currentColor"/> Nova execução</button>
        </div>

        {activeNav === 'Dashboard' ? <DashboardCharts operation={operation} modality={modality}/> : activeNav !== 'Visão geral' ? <OperationalPage page={activeNav} onNext={setActiveNav} notify={notify} filteredRows={filtered} rules={rules} executions={executions} onCreateRule={() => setModal('rule')} onCreateExecution={() => setModal('execution')} onExport={exportReport} /> : <>

        <div className="section-heading"><div><h2>Resumo do faturamento</h2><p>Competência julho/2026 • Atualizado hoje, 12:18</p></div><button className="icon-button" aria-label="Atualizar dados"><RefreshCw size={17}/></button></div>

        <div className="metrics">
          <article><div className="metric-icon green"><CircleDollarSign/></div><div><span>VALOR APURADO</span><strong>{money(total)}</strong><small className="up">↗ 8,4% vs. mês anterior</small></div></article>
          <article><div className="metric-icon blue"><FileCheck2/></div><div><span>CLIENTES PROCESSADOS</span><strong>{filtered.length}<b> / {rows.length}</b></strong><small>100% da seleção</small></div></article>
          <article><div className="metric-icon amber"><Clock3/></div><div><span>AGUARDANDO APROVAÇÃO</span><strong>{filtered.filter(r => r.status === 'Aguardando revisão').length}</strong><small>Requer conferência humana</small></div></article>
          <article><div className="metric-icon red"><AlertTriangle/></div><div><span>DIVERGÊNCIAS</span><strong>{divergences}</strong><small>{divergences ? 'Requer ação' : 'Nenhuma pendência'}</small></div></article>
        </div>

        <article className="workflow-card">
          <div className="card-title"><div><h3>Fluxo da competência</h3><p>Acompanhe o ciclo completo, da captura à cobrança</p></div><span>4 de 7 etapas</span></div>
          <div className="workflow">
            {stages.map((stage, index) => <div className={`stage ${stage.state}`} key={stage.label}>
              <div className="stage-track"><div className="stage-circle">{stage.state === 'done' ? <Check size={17}/> : index + 1}</div>{index < stages.length - 1 && <div className="stage-line"/>}</div>
              <strong>{stage.label}</strong><span>{stage.count} itens</span>
            </div>)}
          </div>
          <div className="human-gate"><ShieldCheck size={17}/><span><strong>Controle humano ativo</strong> — nenhum lançamento será enviado ao Teknisa antes da aprovação financeira.</span></div>
        </article>

        <div className="lower-grid">
          <article className="table-card">
            <div className="card-title"><div><h3>Apuração por cliente</h3><p>Resultados calculados pelo motor de faturamento</p></div><button className="text-button">Ver todos <ArrowRight size={15}/></button></div>
            <div className="table-tools"><div className="search"><Search size={16}/><input value={tableSearch} onChange={event=>setTableSearch(event.target.value)} aria-label="Pesquisar cliente" placeholder="Buscar cliente ou unidade"/></div><button className="filter-button" onClick={()=>exportReport()}><Download size={15}/> Exportar</button></div>
            <div className="table-scroll"><table><thead><tr><th>Cliente / unidade</th><th>Operação</th><th>Real / referência</th><th>Complemento</th><th>Valor apurado</th><th>Status</th><th></th></tr></thead>
              <tbody>{visibleOverviewRows.map(row => <tr key={row.id}><td><strong>{row.client}</strong><span>{row.unit}</span></td><td><strong>{row.operation}</strong><span>{row.modality}</span></td><td>{number(row.actual)} <span>/ {number(row.reference)}</span></td><td>{row.complement ? `+ ${number(row.complement)}` : '—'}</td><td><strong>{money(row.value)}</strong></td><td><StatusBadge status={row.status}/></td><td><button aria-label={`Abrir ${row.client}`} className="row-open"><ArrowRight size={16}/></button></td></tr>)}</tbody>
            </table>{visibleOverviewRows.length === 0 && <div className="empty">Nenhum resultado para os filtros selecionados.</div>}</div>
          </article>

          <aside className="attention-card"><div className="card-title"><div><h3>Requer atenção</h3><p>Pendências identificadas pela IA</p></div><span className="count">3</span></div>
            <div className="attention-item danger"><AlertTriangle size={18}/><div><strong>Consumo fora do padrão</strong><p>Escola Nova Geração está 32% abaixo da média histórica.</p><button>Revisar divergência <ArrowRight size={14}/></button></div></div>
            <div className="attention-item warning"><FileText size={18}/><div><strong>Regra a confirmar</strong><p>Nova cláusula encontrada no contrato da Indústrias Aurora.</p><button>Validar regra <ArrowRight size={14}/></button></div></div>
            <div className="attention-item info"><Bot size={18}/><div><strong>Execução pronta</strong><p>3 clientes estão prontos para aprovação financeira.</p><button>Revisar apuração <ArrowRight size={14}/></button></div></div>
          </aside>
        </div>

        <footer className="page-footer"><span><Database size={14}/> Fonte: dados demonstrativos da POC</span><span><ShieldCheck size={14}/> Integração com Oracle/Teknisa ainda não habilitada</span></footer>
        </>}
      </section>
    </main>
    {toast && <div className="toast"><CheckCircle2 size={20}/><div><strong>{toast}</strong><span>Ação registrada no ambiente demonstrativo.</span></div><button onClick={() => setToast(null)} aria-label="Fechar"><X size={17}/></button></div>}
    {modal === 'rule' && <RuleModal onClose={() => setModal(null)} onSubmit={addRule}/>} 
    {modal === 'execution' && <ExecutionModal onClose={() => setModal(null)} onSubmit={addExecution}/>} 
  </div>;
}
