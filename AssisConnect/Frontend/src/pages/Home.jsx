import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Row, Col, Card, Badge, Button, Container
} from 'react-bootstrap';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList
} from 'recharts';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TipToast from '../components/TipToast';

import "../dashboard.css"; // importa os estilos

const STATUS_LABELS = {
  EM_ABERTO: 'Em Aberto',
  EM_ANDAMENTO: 'Em Andamento',
  FINALIZADO: 'Finalizado',
};
const PRIORIDADE_LABELS = { 1: 'Alta', 2: 'Média', 3: 'Baixa' };
const COLORS = ['#0066FF', '#FFC107', '#198754']; // para gráficos

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendentesHoje: 0,
    andamento: 0,
    finalizadaSemana: 0,
    atrasadas: 0,
    proximo: [],
    porStatus: [],
    porPrioridade: [],
  });
  const [authed, setAuthed] = useState(undefined);

  const [windowW, setWindowW] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowW(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowW < 700;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthed(false);
      navigate('/login', { replace: true });
    } else {
      setAuthed(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (authed !== true) return;
    (async () => {
      try {
        const tfs = (await api.get('/tarefas')).data || [];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const pendentesHoje = tfs.filter(
          (t) =>
            ['EM_ABERTO', 'EM_ANDAMENTO'].includes(t.status) &&
            t.dataServico &&
            new Date(t.dataServico).toDateString() === hoje.toDateString()
        ).length;

        const andamento = tfs.filter((t) => t.status === 'EM_ANDAMENTO').length;

        function isThisWeek(dateStr) {
          const d = new Date(dateStr);
          const now = new Date();
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return d >= weekStart && d <= weekEnd;
        }

        const finalizadaSemana = tfs.filter(
          (t) => t.status === 'FINALIZADO' && t.dataServico && isThisWeek(t.dataServico)
        ).length;

        const atrasadas = tfs.filter(
          (t) =>
            ['EM_ABERTO', 'EM_ANDAMENTO'].includes(t.status) &&
            t.dataServico &&
            new Date(t.dataServico) < hoje
        ).length;

        const proximo = [...tfs]
          .filter((t) => t.dataServico && new Date(t.dataServico) >= hoje)
          .sort((a, b) => new Date(a.dataServico) - new Date(b.dataServico));

        const porStatus = [
          { name: 'Em Aberto', value: tfs.filter((t) => t.status === 'EM_ABERTO').length },
          { name: 'Em Andamento', value: tfs.filter((t) => t.status === 'EM_ANDAMENTO').length },
          { name: 'Finalizado', value: tfs.filter((t) => t.status === 'FINALIZADO').length },
        ];
        const porPrioridade = [1, 2, 3].map((prio) => ({
          name: PRIORIDADE_LABELS[prio],
          value: tfs.filter((t) => t.prioridade === prio).length,
        }));

        setStats({
          pendentesHoje,
          andamento,
          finalizadaSemana,
          atrasadas,
          proximo,
          porStatus,
          porPrioridade,
        });
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    })();
  }, [authed, navigate]);

  if (authed === false) return null;

  function PieExternalLabel({ cx, cy, midAngle, outerRadius, value, index }) {
    if (value === 0) return null;
    const RADIAN = Math.PI / 180;
    const labelRadius = outerRadius + (isMobile ? 12 : 22);
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={isMobile ? 11 : 14}
        fontWeight={700}
        style={{ textShadow: '0 2px 6px rgba(0,0,0,.35)' }}
      >
        {`${stats.porStatus[index]?.name}: ${value}`}
      </text>
    );
  }

  function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <span>{name}</span>
          <span className="value">{value}</span>
        </div>
      );
    }
    return null;
  }

  const tarefasParaMostrar = isMobile ? stats.proximo : stats.proximo.slice(0, 4);

  return (
    <div className="dashboard-root">
      <Container fluid className="dashboard-container">
        {/* HEADER */}
        <Row className="mb-2 mx-0 align-items-center">
          <Col xs={12} md={8}>
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="dashboard-subtitle">
              Visão geral de tarefas e clientes da <b>CSE & Refrigeração</b>
            </div>
          </Col>
          <Col xs={12} md={4} className="dashboard-actions">
            <Button className="btn-primary-custom" onClick={() => navigate('/agenda')}>
              <i className="bi bi-kanban-fill me-2" /> Ver Agenda
            </Button>
            <Button className="btn-outline-custom" onClick={() => navigate('/clientes')}>
              <i className="bi bi-person-plus-fill me-2" /> Clientes
            </Button>
          </Col>
        </Row>

        {/* CARDS RESUMO */}
        <Row className="g-2 mb-2 mx-0">
          {[
            { icon: "calendar-event", color: "#9cace3", label: "Pendentes Hoje", value: stats.pendentesHoje, valueColor: "#fff" },
            { icon: "play-fill", color: "#FFC107", label: "Em Andamento", value: stats.andamento, valueColor: "#FFC107" },
            { icon: "check-circle-fill", color: "#198754", label: "Finalizadas na Semana", value: stats.finalizadaSemana, valueColor: "#7CE9A8" },
            { icon: "exclamation-circle", color: "#dc3545", label: "Tarefas Atrasadas", value: stats.atrasadas, valueColor: "#FF9CA0" },
          ].map((card) => (
            <Col xs={6} sm={isMobile ? 6 : 3} md={3} key={card.label} className="d-flex">
              <Card className="summary-card">
                <Card.Body className="summary-card-body">
                  <i className={`bi bi-${card.icon} fs-2 mb-2`} style={{ color: card.color }} />
                  <div className="summary-label">{card.label}</div>
                  <div className="summary-value" style={{ color: card.valueColor }}>{card.value}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* GRÁFICOS */}
        <Row className="g-2 mb-2 mx-0">
          <Col xs={12} md={6}>
            <Card className="chart-card">
              <Card.Body>
                <div className="chart-title">
                  <i className="bi bi-pie-chart me-2" /> Distribuição de Tarefas por Status
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.porStatus}
                        cx="50%"
                        cy="50%"
                        label={PieExternalLabel}
                        labelLine={false}
                        outerRadius={isMobile ? 26 : 60}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {stats.porStatus.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="chart-card">
              <Card.Body>
                <div className="chart-title">
                  <i className="bi bi-bar-chart-steps me-2" /> Tarefas por Prioridade
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.porPrioridade} layout="vertical">
                      <XAxis type="number" allowDecimals={false} stroke="#fff" />
                      <YAxis dataKey="name" type="category" stroke="#fff" />
                      <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                        {stats.porPrioridade.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <LabelList dataKey="value" position="right" fill="#fff" fontWeight={700} />
                      </Bar>
                      <Tooltip content={<CustomTooltip />} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* PRÓXIMAS TAREFAS */}
        <Row className="g-2 mx-0 mb-4">
          <Col xs={12}>
            <Card className="chart-card">
              <Card.Body>
                <span className="chart-title">Próximas Tarefas Agendadas</span>
                {tarefasParaMostrar.length === 0 && (
                  <div className="no-tasks">Nenhuma tarefa agendada para os próximos dias.</div>
                )}
                <ul className="task-list">
                  {tarefasParaMostrar.map((t) => (
                    <li key={t.id} className="task-item">
                      <Badge
                        className="task-badge"
                        style={{
                          background:
                            t.status === 'FINALIZADO'
                              ? '#198754'
                              : t.status === 'EM_ANDAMENTO'
                              ? '#FFC107'
                              : 'var(--indigo-900)',
                        }}
                      >
                        {STATUS_LABELS[t.status]}
                      </Badge>
                      <span className="task-title">{t.titulo}</span>
                      <span className="task-date">
                        <i className="bi bi-calendar-event me-1" />
                        {new Date(t.dataServico).toLocaleDateString('pt-BR')}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <TipToast message="Acompanhe pendências, progresso e próximos serviços em tempo real neste painel." />
      </Container>
    </div>
  );
}
