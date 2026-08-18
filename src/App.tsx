import { FormEvent, useMemo, useState } from 'react';
import officialLogo from '../Logo-Grupo-Raizes_350x110.png.webp';
import {
  ArrowLeft, ArrowRight, BadgeCheck, BarChart3, Building2, CalendarDays, CheckCircle2,
  ChevronRight, CircleDollarSign, Coffee, CreditCard, FileText, GraduationCap,
  Hospital, LayoutDashboard, LogOut, Moon, Receipt, ShieldCheck, Sun, UserRound, Users, Utensils, WalletCards, X,
} from 'lucide-react';

type Operation = 'Cucinari' | 'Quitanda Escolas';
type View = 'overview' | 'clients' | 'calculation' | 'billing';

type CucinariClient = {
  id: string;
  name: string;
  city: string;
  icon: typeof Building2;
  rule: string;
  contracted: string;
  totalMeals: number;
  base: number;
  extras: number;
  status: string;
};

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const number = (value: number) => new Intl.NumberFormat('pt-BR').format(value);

const cucinariClients: CucinariClient[] = [
  { id: 'aurora', name: 'Indústrias Aurora', city: 'Campinas • SP', icon: Building2, rule: 'Todos os dias • 4 serviços', contracted: '300 funcionários • 1 refeição por serviço', totalMeals: 37200, base: 492900, extras: 0, status: 'Pronto para aprovar' },
  { id: 'hospital', name: 'Hospital Santa Clara', city: 'São Paulo • SP', icon: Hospital, rule: 'Todos os dias • 24 horas', contracted: '200 refeições por dia', totalMeals: 6284, base: 93000, extras: 1848, status: 'Adicional identificado' },
  { id: 'horizonte', name: 'Grupo Horizonte', city: 'Jundiaí • SP', icon: Users, rule: 'Segunda a sexta • almoço', contracted: '20 funcionários por dia', totalMeals: 460, base: 8970, extras: 0, status: 'Pronto para aprovar' },
];

const schools = [
  { name: 'Colégio Horizonte', city: 'Vila Mariana • SP', mode: 'Pré-pago', balance: 642, students: ['Ana Souza • RA 26001', 'Bruno Lima • Crachá QH-102', 'Clara Reis • RA 26003', 'Diego Alves • Crachá QH-104', 'Elisa Melo • RA 26005'] },
  { name: 'Escola Nova Geração', city: 'Morumbi • SP', mode: 'Pós-pago', balance: 486, students: ['Felipe Luz • RA 31001', 'Giovana Paz • Crachá NG-202', 'Heitor Nunes • RA 31003', 'Iara Dias • Crachá NG-204', 'João Cruz • RA 31005'] },
  { name: 'Colégio Caminhos', city: 'Osasco • SP', mode: 'Pré e pós-pago', balance: 735, students: ['Karen Sá • RA 42001', 'Lucas Vaz • Crachá CC-302', 'Maya Leal • RA 42003', 'Nicolas Ramos • Crachá CC-304', 'Olívia Freitas • RA 42005'] },
];

const auroraServices = [
  { name: 'Café da manhã', icon: Coffee, daily: 300, qty: 9300, unit: 8.5 },
  { name: 'Almoço', icon: Sun, daily: 300, qty: 9300, unit: 18 },
  { name: 'Jantar', icon: Utensils, daily: 300, qty: 9300, unit: 17 },
  { name: 'Lanche da noite', icon: Moon, daily: 300, qty: 9300, unit: 9.5 },
];

function Login({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get('email')).trim() || !String(data.get('password')).trim()) return setError('Informe e-mail e senha para continuar.');
    onLogin();
  };
  return <main className="auth-page">
    <section className="auth-story"><img src={officialLogo} alt="Grupo Raízes"/><div><span>FATURAMENTO INTELIGENTE</span><h1>Da refeição servida<br/>à cobrança explicada.</h1><p>Um ambiente demonstrativo para validar contratos, consumos e adicionais antes do fechamento.</p></div><small>POC • Dados totalmente fictícios</small></section>
    <section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><div className="auth-mark"><ShieldCheck/><span>Acesso seguro</span></div><h2>Bem-vindo</h2><p>Entre para acessar as operações financeiras.</p><label>E-mail corporativo<input name="email" type="email" defaultValue="financeiro@gruporaizes.com.br" autoComplete="email"/></label><label>Senha<input name="password" type="password" defaultValue="demonstracao" autoComplete="current-password"/></label>{error && <div className="form-error" role="alert">{error}</div>}<button type="submit">Entrar no ambiente <ArrowRight size={17}/></button><small>Use as credenciais preenchidas para navegar na demonstração.</small></form></section>
  </main>;
}

function OperationChoice({ onChoose, onLogout }: { onChoose: (operation: Operation) => void; onLogout: () => void }) {
  return <main className="choice-page">
    <header><img src={officialLogo} alt="Grupo Raízes"/><button onClick={onLogout}><LogOut size={16}/> Sair</button></header>
    <section><span>SELEÇÃO DE AMBIENTE</span><h1>Qual operação deseja acessar?</h1><p>Cada ambiente possui clientes, regras e cobranças independentes.</p>
      <div className="operation-grid">
        <button onClick={() => onChoose('Cucinari')}>
          <div className="operation-visual"><img src="/assets/logo-cucinari.png" alt="Cucinari — gastronomia afetiva"/></div>
          <div className="operation-copy"><em>OPERAÇÃO CORPORATIVA</em><h2>Cucinari</h2><p>Contratos, refeições diárias, públicos atendidos e adicionais.</p><strong>3 clientes demonstrativos <ChevronRight size={17}/></strong></div>
        </button>
        <button onClick={() => onChoose('Quitanda Escolas')}>
          <div className="operation-visual quitanda-visual"><img src="/assets/logo-quitanda-escolas.webp" alt="Quitanda Escolas"/></div>
          <div className="operation-copy"><em>OPERAÇÃO ESCOLAR</em><h2>Quitanda Escolas</h2><p>Alunos identificados por RA ou crachá, pré-pago e pós-pago.</p><strong>3 colégios • 15 alunos <ChevronRight size={17}/></strong></div>
        </button>
      </div>
    </section>
  </main>;
}

function Boleto({ client, onClose }: { client: CucinariClient; onClose: () => void }) {
  const total = client.base + client.extras;
  return <div className="boleto-backdrop printable-layer"><section className="boleto printable-document" role="dialog" aria-modal="true" aria-label={`Boleto simulado de ${client.name}`}><div className="boleto-warning">SIMULAÇÃO • SEM VALOR FISCAL OU BANCÁRIO</div><header className="document-header"><div className="document-brand"><img src={officialLogo} alt="Grupo Raízes"/><span>FATURAMENTO INTELIGENTE</span></div><div><strong>TEKNISA</strong><span>Documento demonstrativo de cobrança</span></div><b>341-7</b></header><div className="boleto-grid"><div><span>Beneficiário</span><strong>Grupo Raízes — ambiente demonstrativo</strong></div><div><span>Pagador</span><strong>{client.name}</strong></div><div><span>Documento</span><strong>SIM-072026-{client.id.toUpperCase()}</strong></div><div><span>Competência</span><strong>Julho/2026</strong></div><div><span>Vencimento</span><strong>10/08/2026</strong></div><div><span>Valor do documento</span><strong>{money(total)}</strong></div></div><div className="boleto-lines"><h3>Demonstrativo</h3><p><span>Contrato base — {client.contracted}</span><strong>{money(client.base)}</strong></p>{client.extras > 0 && <p><span>Adicionais — convidados e excedentes</span><strong>{money(client.extras)}</strong></p>}<p className="boleto-total"><span>Total simulado</span><strong>{money(total)}</strong></p></div><div className="fake-barcode" aria-hidden="true"/><footer><button onClick={onClose}>Fechar</button><button onClick={() => window.print()}><FileText size={15}/> Imprimir simulação</button></footer></section></div>;
}

function Cucinari({ view, setView, onChangeOperation }: { view: View; setView: (view: View) => void; onChangeOperation: () => void }) {
  const [selectedId, setSelectedId] = useState('aurora');
  const [boleto, setBoleto] = useState<CucinariClient | null>(null);
  const selected = cucinariClients.find(client => client.id === selectedId)!;
  const total = useMemo(() => cucinariClients.reduce((sum, client) => sum + client.base + client.extras, 0), []);
  const labels: Record<View, string> = { overview: 'Visão geral', clients: 'Cenários e contratos', calculation: 'Memória de cálculo', billing: 'Boletos simulados' };
  return <div className="workspace"><aside><img src={officialLogo} alt="Grupo Raízes"/><div className="current-operation"><i><Utensils size={18}/></i><span>AMBIENTE ATUAL<strong>Cucinari</strong></span></div><nav>{(Object.keys(labels) as View[]).map(item => <button className={view === item ? 'active' : ''} onClick={() => setView(item)} key={item}>{item === 'overview' ? <CalendarDays/> : item === 'clients' ? <Users/> : item === 'calculation' ? <CircleDollarSign/> : <Receipt/>}<span>{labels[item]}</span></button>)}</nav><button className="change-operation" onClick={onChangeOperation}><ArrowLeft size={15}/> Trocar operação</button></aside><main><header className="workspace-header"><div><span>OPERAÇÃO CUCINARI</span><h1>{labels[view]}</h1></div><div><span className="demo"><i/> Ambiente demonstrativo</span><div className="avatar">MC</div></div></header><div className="workspace-content">+      {view === 'overview' && <><section className="welcome"><div><span>COMPETÊNCIA JULHO/2026</span><h2>Faturamento contratual com<br/>consumo explicado.</h2><p>Confira a previsão, os adicionais e a composição antes de gerar a cobrança.</p></div><div><small>VALOR TOTAL SIMULADO</small><strong>{money(total)}</strong><span>43.944 refeições consolidadas</span></div></section><section className="summary-grid"><article><span>Clientes ativos</span><strong>3</strong><small>Todos na competência</small></article><article><span>Refeições previstas</span><strong>43.944</strong><small>Contratos demonstrativos</small></article><article><span>Adicionais</span><strong>{money(1848)}</strong><small>Hospital Santa Clara</small></article><article><span>Prontos para boleto</span><strong>2 de 3</strong><small>1 requer validação</small></article></section><SectionClients onSelect={id => { setSelectedId(id); setView('calculation'); }}/></>}
      {view === 'clients' && <><Title eyebrow="CENÁRIOS DEMONSTRATIVOS" title="Contratos com regras diferentes" description="Selecione um cliente para consultar sua memória de cálculo."/><SectionClients onSelect={id => { setSelectedId(id); setView('calculation'); }}/></>}
      {view === 'calculation' && <Calculation client={selected} selectedId={selectedId} onSelect={setSelectedId} onBilling={() => { setView('billing'); }}/>} 
      {view === 'billing' && <><Title eyebrow="SAÍDA SIMULADA TEKNISA" title="Boletos da competência" description="Documentos fictícios, sem linha digitável ou integração bancária."/><div className="billing-grid">{cucinariClients.map(client => <article key={client.id}><div className="bill-icon"><Receipt/></div><span>SIM-072026-{client.id.toUpperCase()}</span><h3>{client.name}</h3><p>Vencimento 10/08/2026 • Julho/2026</p><strong>{money(client.base + client.extras)}</strong><button onClick={() => setBoleto(client)}>Visualizar boleto <ArrowRight size={15}/></button></article>)}</div></>}
    </div></main>{boleto && <Boleto client={boleto} onClose={() => setBoleto(null)}/>}</div>;
}

function Title({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>; }

function SectionClients({ onSelect }: { onSelect: (id: string) => void }) { return <section className="client-grid">{cucinariClients.map(client => { const Icon = client.icon; return <article key={client.id}><header><i><Icon/></i><span className={client.extras ? 'attention' : ''}>{client.status}</span></header><h3>{client.name}</h3><p>{client.city}</p><dl><div><dt>Regra</dt><dd>{client.rule}</dd></div><div><dt>Contrato</dt><dd>{client.contracted}</dd></div><div><dt>Volume</dt><dd>{number(client.totalMeals)} refeições</dd></div><div><dt>Total previsto</dt><dd>{money(client.base + client.extras)}</dd></div></dl><button onClick={() => onSelect(client.id)}>Ver cenário completo <ArrowRight size={15}/></button></article>})}</section>; }

function Calculation({ client, selectedId, onSelect, onBilling }: { client: CucinariClient; selectedId: string; onSelect: (id: string) => void; onBilling: () => void }) {
  return <><div className="scenario-tabs">{cucinariClients.map(item => <button className={selectedId === item.id ? 'active' : ''} onClick={() => onSelect(item.id)} key={item.id}>{item.name}</button>)}</div><Title eyebrow="MEMÓRIA DE CÁLCULO" title={client.name} description={`${client.city} • Competência julho/2026`}/>{client.id === 'aurora' && <><div className="aurora-rule"><Users/><div><span>BASE DO CONTRATO</span><strong>300 funcionários • 1 refeição de cada serviço por funcionário/dia</strong><p>Em 7 dias: 2.100 cafés, 2.100 almoços, 2.100 jantares e 2.100 lanches noturnos.</p></div></div><div className="service-grid">{auroraServices.map(({ name, icon: Icon, daily, qty, unit }) => <article key={name}><Icon/><span>{name}</span><strong>{number(daily)} por dia</strong><p>{number(qty)} no mês × {money(unit)}</p><b>{money(qty * unit)}</b></article>)}</div></>}{client.id === 'hospital' && <div className="hospital-split"><article><span>DIRETORIA</span><strong>24/dia</strong><p>Café, almoço e jantar</p></article><article><span>FUNCIONÁRIOS</span><strong>86/dia</strong><p>Escalas e plantões</p></article><article><span>PACIENTES</span><strong>90/dia</strong><p>Dietas e refeições</p></article><article className="extra"><span>CONVIDADOS • ADICIONAL</span><strong>84 no mês</strong><p>84 × R$ 22,00 = {money(1848)}</p></article></div>}{client.id === 'horizonte' && <div className="weekday-card"><CalendarDays/><div><span>SEGUNDA A SEXTA</span><h3>23 dias úteis × 20 almoços</h3><p>460 refeições na competência • finais de semana fora da cobrança</p></div><strong>{money(8970)}</strong></div>}<section className="calculation-card"><header><div><BadgeCheck/><span>CÁLCULO EXPLICADO<strong>Premissas demonstrativas</strong></span></div><em>{client.status}</em></header><div><p><span>Valor contratual da competência</span><strong>{money(client.base)}</strong></p>{client.extras > 0 && <p><span>Adicionais identificados</span><strong>+ {money(client.extras)}</strong></p>}<p className="grand-total"><span>Total previsto para cobrança</span><strong>{money(client.base + client.extras)}</strong></p></div><footer><p><CheckCircle2/> Cada valor pode ser rastreado até sua regra e consumo de origem.</p><button onClick={onBilling}>Continuar para boletos <ArrowRight size={15}/></button></footer></section></>;
}

type School = typeof schools[number];
type SchoolView = 'dashboard' | 'schools' | 'billing';

const schoolTransactions = [
  { date: '03/07', student: 'Ana Souza', item: 'Lanche natural + suco', id: 'RA 26001', mode: 'Pré-pago', value: 18.5, status: 'Debitado do saldo' },
  { date: '08/07', student: 'Bruno Lima', item: 'Salada de frutas', id: 'Crachá QH-102', mode: 'Pré-pago', value: 12, status: 'Debitado do saldo' },
  { date: '14/07', student: 'Clara Reis', item: 'Almoço completo', id: 'RA 26003', mode: 'Pós-pago', value: 24.9, status: 'Para faturar' },
  { date: '21/07', student: 'Diego Alves', item: 'Sanduíche + fruta', id: 'Crachá QH-104', mode: 'Pré-pago', value: 16.5, status: 'Debitado do saldo' },
  { date: '28/07', student: 'Elisa Melo', item: 'Almoço completo', id: 'RA 26005', mode: 'Pós-pago', value: 24.9, status: 'Para faturar' },
];

const responsibleNames = ['Mariana Souza', 'Carlos Lima', 'Renata Reis', 'Paulo Alves', 'Fernanda Melo'];
const studentBills = schools.flatMap((school, schoolIndex) => school.students.map((student, studentIndex) => {
  const [name, identifier] = student.split(' • ');
  const weights = [.18, .19, .20, .21, .22];
  const mode = school.mode === 'Pré e pós-pago' ? (studentIndex < 3 ? 'Pré-pago' : 'Pós-pago') : school.mode;
  return { id: `QTD-072026-${schoolIndex + 1}${studentIndex + 1}`, name, identifier, school: school.name, city: school.city, responsible: responsibleNames[studentIndex], mode, value: school.balance * weights[studentIndex], status: mode === 'Pré-pago' ? 'Liquidado pelo saldo' : studentIndex === 4 ? 'Em conferência' : 'Pronto para boleto' };
}));
type StudentBill = typeof studentBills[number];

function SchoolStatement({ school, onClose, onDetails }: { school: School; onClose: () => void; onDetails: (bill: StudentBill) => void }) {
  const bills = studentBills.filter(bill => bill.school === school.name);
  const prepaid = bills.filter(bill => bill.mode === 'Pré-pago').reduce((sum, bill) => sum + bill.value, 0);
  const postpaid = bills.filter(bill => bill.mode === 'Pós-pago').reduce((sum, bill) => sum + bill.value, 0);
  return <div className="statement-backdrop printable-layer"><section className="statement monthly-statement printable-document" role="dialog" aria-modal="true" aria-labelledby="statement-title"><header><div className="print-heading"><div className="document-brand"><img src={officialLogo} alt="Grupo Raízes"/><span>FATURAMENTO INTELIGENTE</span></div><div><span>RESUMO MENSAL DOS ALUNOS</span><h2 id="statement-title">{school.name}</h2><p>{school.city} • Referência julho/2026</p></div></div><button onClick={onClose} aria-label="Fechar extrato"><X/></button></header><div className="statement-summary"><article><span>Alunos ativos</span><strong>5</strong></article><article><span>Mês de referência</span><strong>Jul/2026</strong></article><article><span>Planos pré-pagos</span><strong>{money(prepaid)}</strong></article><article><span>Pós-pago a faturar</span><strong>{money(postpaid)}</strong></article></div><div className="statement-table monthly-table"><table><thead><tr><th>Referência</th><th>Aluno / identificação</th><th>Plano contratado</th><th>Modalidade</th><th>Status</th><th>Valor mensal</th><th>Detalhes</th></tr></thead><tbody>{bills.map((bill, index) => <tr key={bill.id}><td>Jul/2026</td><td><strong>{bill.name}</strong><span>{bill.identifier}</span></td><td><strong>{index % 3 === 0 ? 'Lanche + almoço' : index % 3 === 1 ? 'Plano somente lanche' : 'Almoço completo'}</strong><span>{bill.mode === 'Pré-pago' ? 'Pacote mensal contratado' : 'Conforme consumo realizado'}</span></td><td><em>{bill.mode}</em></td><td><span className={bill.mode === 'Pré-pago' ? 'paid' : 'pending'}>{bill.status}</span></td><td><strong>{money(bill.value)}</strong></td><td><button className="details-button" onClick={() => onDetails(bill)}>{bill.mode === 'Pré-pago' ? 'Ver plano e boleto' : 'Mais detalhes'} <ArrowRight/></button></td></tr>)}</tbody></table></div><footer><div><span>TOTAL MENSAL DA ESCOLA</span><strong>{money(school.balance)}</strong></div><button onClick={() => window.print()}><FileText/> Imprimir resumo mensal</button></footer></section></div>;
}

function SchoolCards({ onStatement }: { onStatement: (school: School) => void }) { return <div className="school-grid">{schools.map(school => <article key={school.name}><header><i><GraduationCap/></i><span>{school.mode}</span></header><h2>{school.name}</h2><p>{school.city}</p><div className="students">{school.students.map(student => <div key={student}><UserRound/><span>{student}</span><BadgeCheck/></div>)}</div><footer><span>Cobrança simulada<strong>{money(school.balance)}</strong></span><button onClick={() => onStatement(school)}>Ver extrato <ArrowRight size={14}/></button></footer></article>)}</div>; }

function StudentBoleto({ bill, onClose }: { bill: StudentBill; onClose: () => void }) {
  const studentIndex = studentBills.findIndex(item => item.id === bill.id) % 5;
  const planName = studentIndex % 3 === 0 ? 'Plano lanche + almoço' : studentIndex % 3 === 1 ? 'Plano somente lanche' : 'Plano almoço completo';
  const items = bill.mode === 'Pré-pago' ? [[planName, bill.value], ['Valor utilizado do plano', -bill.value * .72], ['Saldo disponível', bill.value * .28]] : [['Almoço completo', bill.value * .54], ['Lanches e frutas', bill.value * .31], ['Bebidas', bill.value * .15]];
  const dailyConsumption = [['02/07','Almoço completo',1,.18],['07/07','Lanche natural + suco',1,.14],['11/07','Almoço completo',1,.20],['16/07','Frutas + bebida',1,.12],['22/07','Almoço completo',1,.19],['29/07','Lanche + almoço',2,.17]] as const;
  return <div className="statement-backdrop printable-layer"><section className="student-boleto printable-document" role="dialog" aria-modal="true" aria-labelledby="student-bill-title"><div className="boleto-warning">SIMULAÇÃO • {bill.mode === 'Pré-pago' ? 'BOLETO DE RECARGA DO PLANO' : 'COBRANÇA INDIVIDUAL'} • SEM VALOR BANCÁRIO</div><header><div className="print-heading"><div className="document-brand"><img src={officialLogo} alt="Grupo Raízes"/><span>FATURAMENTO INTELIGENTE</span></div><div><span>TEKNISA • {bill.id}</span><h2 id="student-bill-title">{bill.name}</h2><p>{bill.identifier} • {bill.school}</p></div></div><button onClick={onClose} aria-label="Fechar cobrança"><X/></button></header><div className="student-bill-meta"><div><span>Responsável financeiro</span><strong>{bill.responsible}</strong></div><div><span>Modalidade</span><strong>{bill.mode}</strong></div><div><span>Competência</span><strong>Julho/2026</strong></div><div><span>Vencimento</span><strong>{bill.mode === 'Pré-pago' ? 'Saldo antecipado' : '10/08/2026'}</strong></div></div>{bill.mode === 'Pós-pago' && <section className="monthly-consumption"><div><h3>Relação completa do consumo mensal</h3><p>Somente consumos pós-pagos são detalhados por dia.</p></div><table><thead><tr><th>Data</th><th>Item consumido</th><th>Qtd.</th><th>Valor</th></tr></thead><tbody>{dailyConsumption.map(([date, item, quantity, share]) => <tr key={date}><td>{date}</td><td>{item}</td><td>{quantity}</td><td><strong>{money(bill.value * share)}</strong></td></tr>)}</tbody></table></section>}<section className="student-bill-lines"><h3>{bill.mode === 'Pré-pago' ? 'Plano mensal contratado' : 'Consolidação para faturamento'}</h3>{items.map(([label, value]) => <p key={String(label)}><span>{label}</span><strong>{money(Number(value))}</strong></p>)}<p className="student-bill-total"><span>{bill.mode === 'Pré-pago' ? 'Crédito contratado' : 'Total do boleto individual'}</span><strong>{money(bill.value)}</strong></p></section><div className="fake-barcode"/><footer><button onClick={onClose}>Fechar</button><button onClick={() => window.print()}><FileText/> Imprimir simulação</button></footer></section></div>;
}

function Quitanda({ onChangeOperation }: { onChangeOperation: () => void }) {
  const [view, setView] = useState<SchoolView>('dashboard');
  const [statement, setStatement] = useState<School | null>(null);
  const [studentBill, setStudentBill] = useState<StudentBill | null>(null);
  const pageTitle = view === 'dashboard' ? 'Visão geral' : view === 'schools' ? 'Escolas e alunos' : 'Cobranças escolares';
  return <div className="school-workspace"><aside><img src={officialLogo} alt="Grupo Raízes"/><div className="current-operation"><i><GraduationCap/></i><span>AMBIENTE ATUAL<strong>Quitanda Escolas</strong></span></div><nav><button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><LayoutDashboard/><span>Visão geral</span></button><button className={view === 'schools' ? 'active' : ''} onClick={() => setView('schools')}><Users/><span>Escolas e alunos</span></button><button className={view === 'billing' ? 'active' : ''} onClick={() => setView('billing')}><WalletCards/><span>Cobranças</span></button></nav><button className="change-operation" onClick={onChangeOperation}><ArrowLeft/> Trocar operação</button></aside><main><header className="workspace-header"><div><span>OPERAÇÃO QUITANDA ESCOLAS</span><h1>{pageTitle}</h1></div><div><span className="demo"><i/> Ambiente demonstrativo</span><div className="avatar">MC</div></div></header><div className="school-content"><section className="school-hero"><span>QUITANDA ESCOLAS • JULHO/2026</span><h2>Alimentação identificada,<br/>cobrança transparente.</h2><p>Do saldo pré-pago ao fechamento pós-pago, cada consumo ligado ao aluno.</p></section>{view === 'dashboard' && <><div className="school-metrics"><article><i><GraduationCap/></i><span>Escolas ativas<strong>3</strong><small>15 alunos cadastrados</small></span></article><article><i><CreditCard/></i><span>Saldo pré-pago<strong>{money(1377)}</strong><small>9 alunos com saldo</small></span></article><article><i><Receipt/></i><span>Pós-pago aberto<strong>{money(486)}</strong><small>6 alunos na competência</small></span></article><article><i><BadgeCheck/></i><span>Consumos validados<strong>94%</strong><small>5 aguardam conferência</small></span></article></div><div className="school-dashboard-grid"><section className="consumption-chart"><header><div><h3>Consumo por escola</h3><p>Quantidade de itens na competência</p></div><BarChart3/></header>{[['Colégio Horizonte',74],['Nova Geração',58],['Colégio Caminhos',86]].map(([name, value]) => <div className="school-bar" key={name}><span>{name}</span><div><i style={{width: `${value}%`}}/></div><strong>{value}</strong></div>)}</section><section className="mode-card"><h3>Distribuição por modalidade</h3><div className="mode-donut"><div><strong>60%</strong><span>pré-pago</span></div></div><p><i className="pre"/> Pré-pago <strong>9 alunos</strong></p><p><i className="post"/> Pós-pago <strong>6 alunos</strong></p></section></div><div className="dashboard-section-head"><div><h3>Escolas da operação</h3><p>Acesse o extrato detalhado de cada unidade.</p></div><button onClick={() => setView('schools')}>Ver todas <ArrowRight/></button></div><SchoolCards onStatement={setStatement}/></>}{view === 'schools' && <><div className="dashboard-section-head"><div><h3>Escolas e alunos</h3><p>Identificação por RA ou crachá e extrato individualizado.</p></div></div><SchoolCards onStatement={setStatement}/></>}{view === 'billing' && <><div className="dashboard-section-head"><div><h3>Cobranças individuais</h3><p>Um documento por aluno, agrupado visualmente pela escola.</p></div><span className="billing-count">15 alunos</span></div><div className="school-billing-list">{studentBills.map(bill => <article key={bill.id}><div className="bill-icon"><UserRound/></div><div><span>{bill.id} • {bill.school}</span><h3>{bill.name}</h3><p>{bill.identifier} • Responsável: {bill.responsible}</p></div><strong>{money(bill.value)}</strong><em className={bill.status === 'Em conferência' ? 'review' : ''}>{bill.status}</em><button onClick={() => setStudentBill(bill)}>{bill.mode === 'Pré-pago' ? 'Abrir plano' : 'Ver boleto'} <ArrowRight/></button></article>)}</div></>}<section className="school-flow"><div><CreditCard/><span>PRÉ-PAGO<strong>Plano mensal → saldo → consumo sem detalhamento diário</strong></span></div><ChevronRight/><div><Receipt/><span>PÓS-PAGO<strong>Consumo diário → conferência → boleto por aluno</strong></span></div></section></div></main>{statement && <SchoolStatement school={statement} onClose={() => setStatement(null)} onDetails={bill => { setStatement(null); setStudentBill(bill); }}/>} {studentBill && <StudentBoleto bill={studentBill} onClose={() => setStudentBill(null)}/>}</div>;
}

export function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [view, setView] = useState<View>('overview');
  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)}/>;
  if (!operation) return <OperationChoice onChoose={setOperation} onLogout={() => setAuthenticated(false)}/>;
  if (operation === 'Quitanda Escolas') return <Quitanda onChangeOperation={() => setOperation(null)}/>;
  return <Cucinari view={view} setView={setView} onChangeOperation={() => setOperation(null)}/>;
}

