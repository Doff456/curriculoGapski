"use client"

import { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/optimized-image"
import { useOptimizedScroll } from "@/hooks/use-optimized-scroll"
import {
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  Phone,
  MapPin,
  ChevronDown,
  Lightbulb,
  Users,
  Target,
  BookOpen,
  MessageSquare,
  BarChart3,
  FileText,
  Zap,
} from "lucide-react"

// Lazy load do modal para melhor performance
const ProjectModal = lazy(() =>
  import("@/components/project-modal").then((module) => ({ default: module.ProjectModal })),
)

// Componente de navegação memoizado
const Navigation = memo(function Navigation({
  scrollY,
  isMenuOpen,
  setIsMenuOpen,
  shouldReduceMotion,
}: {
  scrollY: number
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  shouldReduceMotion: boolean | null
}) {
  const navItems = useMemo(
    () => [
      { id: "home", label: "Início" },
      { id: "about", label: "Sobre" },
      { id: "skills", label: "Habilidades" },
      { id: "work", label: "Trabalhos" },
      { id: "contact", label: "Contato" },
    ],
    [],
  )

  return (
    <motion.nav
      className="fixed top-0 w-full z-40 transition-all duration-300 will-change-transform"
      style={{
        backgroundColor: scrollY > 50 ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(0, 0, 0, 0.1)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-6">
          <div className="text-lg sm:text-xl font-light tracking-wide">Diogo Gapski</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 lg:space-x-12">
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className="nav-link text-sm font-light tracking-wide hover:text-gray-600 transition-colors duration-200 relative group"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.1, duration: 0.4 }}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 transition-all duration-200 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          <button
            className="md:hidden p-2 -mr-2 touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <motion.div whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className="block py-3 text-base font-light tracking-wide hover:text-gray-600 transition-colors duration-200 touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.05, duration: 0.3 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
})

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollY = useOptimizedScroll()
  const shouldReduceMotion = useReducedMotion()

  // Otimização: navegação ativa com throttle melhorado
  useEffect(() => {
    let rafId: number
    const handleActiveNav = () => {
      rafId = requestAnimationFrame(() => {
        const sections = document.querySelectorAll("section[id]")
        const scrollPos = window.scrollY + 100

        sections.forEach((section) => {
          const element = section as HTMLElement
          if (scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
            const id = element.getAttribute("id")
            document.querySelectorAll(".nav-link").forEach((link) => {
              link.classList.remove("active")
            })
            document.querySelector(`[href="#${id}"]`)?.classList.add("active")
          }
        })
      })
    }

    const throttledActiveNav = () => {
      if (rafId) cancelAnimationFrame(rafId)
      handleActiveNav()
    }

    window.addEventListener("scroll", throttledActiveNav, { passive: true })
    return () => {
      window.removeEventListener("scroll", throttledActiveNav)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Dados dos projetos com imagens reais otimizadas
  const projects = useMemo(
    () => [
      {
        title: "CodeGuardian - Analisador Inteligente de Repositórios Python",
        shortDescription:
          "Ferramenta avançada de análise estática que inspeciona automaticamente repositórios Python, identificando problemas de qualidade, código duplicado, complexidade excessiva e oportunidades de refatoração. Processamento 100% local sem dependências externas.",
        description:
          "Sistema sofisticado de análise estática desenvolvido em Python que inspeciona repositórios completos (locais ou GitHub) usando AST (Abstract Syntax Tree), detectando automaticamente problemas reais de código, padrões arriscados, duplicações e sugerindo melhorias através de relatórios profissionais detalhados.",
        detailedDescription: `## O que este projeto faz?


CodeGuardian é uma ferramenta de análise estática que examina repositórios Python completos — locais ou vindos diretamente do GitHub — sem executar nenhuma linha de código. Ele baixa o repositório, percorre todos os arquivos .py e gera um relatório profissional contendo problemas encontrados, severidade, localização exata e sugestões de melhoria.

A análise é 100% segura, pois utiliza apenas a árvore sintática (AST) para entender a estrutura lógica do código. Isso permite identificar padrões problemáticos que revisões humanas frequentemente ignoram, incluindo:

* Funções excessivamente longas
* Complexidade ciclomática alta
* Imports ou variáveis não utilizados
* Try/except vazios
* Excessos de nested if
* Parâmetros com nomes genéricos
* Inconsistências de estilo e formatação

Além disso, o sistema detecta duplicações mesmo quando o código não é textual, combinando hashing estrutural, comparação por AST e análise de n-grams.

Todo problema é classificado automaticamente por severidade (Critical, Warning ou Info) de acordo com impacto e complexidade, ajudando a priorizar correções.

O relatório final pode ser exportado em JSON** ou Markdown, trazendo contexto, trechos relevantes e caminho/linha exata de cada ocorrência.

O projeto funciona totalmente offline, sem uso de APIs externas, bancos de dados ou execução de código — garantindo privacidade e segurança total. Sua arquitetura modular permite adicionar novas regras facilmente, tornando o sistema flexível e pronto para evoluções, inclusive futuras integrações com IA.

A ferramenta também inclui uma CLI simples para uso direto em projetos locais ou remotos:

bash
codeguardian analyze https://github.com/usuario/projeto
codeguardian analyze ./projeto --format markdown
`,
        image: "/images/codeguardian-cover.png",
        tech: [
          "Python 3",
          "AST (Abstract Syntax Tree)",
          "CLI (Click/Argparse)",
          "Git API",
          "Requests",
          "Algoritmos de Hashing",
          "Pattern Matching",
          "JSON/Markdown",
        ],
        category: "Engenharia de Software",
        year: "2025",
        duration: "1.5 meses",
        team: "Individual",
        features: [
          "Análise completa de repositórios Python locais ou remotos",
          "Detecção automática de anti-patterns e code smells",
          "Cálculo de complexidade ciclomática por função",
          "Identificação de código duplicado via hashing estrutural",
          "Detecção de imports e variáveis não utilizadas",
          "Sistema de severidade (critical, warning, info)",
          "Relatórios em JSON ou Markdown",
          "CLI intuitiva com múltiplos comandos",
          "Download automático de repositórios GitHub",
          "Processamento 100% offline e seguro",
          "Arquitetura extensível para novas regras",
          "Estatísticas gerais do projeto analisado",
        ],
      },
      {
        title: "Sistema Avançado de Coleta de Dados - LinkedIn",
        shortDescription:
          "Sistema inteligente que automatiza a coleta de dados profissionais do LinkedIn para empresas de recrutamento e prospecção comercial. Coleta informações como nome, cargo, empresa, CPF e telefone de forma segura e eficiente.",
        description:
          "Sistema automatizado desenvolvido para empresas que precisam encontrar profissionais qualificados do setor bancário. O software navega pelo LinkedIn de forma inteligente, coletando dados essenciais como nome, cargo, empresa, CPF, telefone e experiência profissional de milhares de perfis. Esses dados são fundamentais para prospecção comercial e recrutamento especializado. Foi criado para resolver o problema de recrutadores e empresas que gastam semanas fazendo essa pesquisa manualmente, automatizando todo o processo de forma segura e eficiente.",
        detailedDescription: `## O que este projeto faz?

Este sistema automatizado foi desenvolvido para empresas que precisam identificar e prospectar profissionais do setor bancário de forma rápida e precisa. Ele navega pelo LinkedIn como um usuário humano, coleta dados públicos do perfil (nome, cargo, empresa, histórico profissional) e complementa informações sensíveis — como CPF e telefone — por meio de integração com uma API externa dedicada à consulta de dados pessoais. Assim, o sistema gera uma base completa, validada e pronta para uso em prospecção comercial e recrutamento especializado.

Toda a automação é construída em JavaScript utilizando Puppeteer, que controla o navegador em tempo real e simula interações humanas: rolagens naturais, tempos de espera variáveis e padrões de navegação realistas, reduzindo drasticamente o risco de detecção. Para evitar bloqueios, o sistema utiliza proxy management com rotação de IPs e identidades digitais.

A interface gráfica, desenvolvida em HTML5 e CSS3, permite que usuários não-técnicos configurem buscas, monitorem o processo e exportem resultados de forma simples. Cada ação é registrada em um sistema de logs com atualização em tempo real.

Para pesquisas externas adicionais, o sistema integra a Google Search API, permitindo encontrar perfis relacionados e enriquecer informações. Além disso, um módulo leve de machine learning auxilia na validação e limpeza dos dados, detectando duplicatas, padrões inconsistentes e ajustando formatações automaticamente.

O núcleo da solução realiza data mining avançado, adaptando-se a pequenas mudanças na estrutura do LinkedIn para manter a automação estável. Ele funciona 24/7 sem supervisão, reiniciando rotinas quando necessário e garantindo coleta contínua.

No fim, o sistema entrega um fluxo completo e automatizado: busca, navegação, extração, enriquecimento via API externa, validação, organização e exportação em planilhas — tudo de forma segura, discreta e altamente eficiente.
`,
        image: "/images/linkedin-scraping-cover.png",
        tech: [
          "JavaScript",
          "Puppeteer",
          "HTML5",
          "CSS3",
          "Google Search API",
          "Machine Learning",
          "Proxy Management",
          "Data Mining",
        ],
        category: "Engenharia de Software",
        year: "2025",
        duration: "1.5 meses",
        team: "Individual",
        features: [
          "Simulação de comportamento humano com padrões realistas",
          "Sistema anti-detecção com rotação de identidades digitais",
          "Interface gráfica simples para usuários não-técnicos",
          "Coleta automatizada 24/7 sem supervisão",
          "Adaptação automática a mudanças na estrutura do LinkedIn",
          "Exportação de dados em planilhas organizadas",
          "Sistema de logs para acompanhar o progresso em tempo real",
          "Validação e limpeza automática dos dados coletados",
        ],
      },
      {
        title: "Reverse Auction Service Platform",
        shortDescription:
          "Plataforma full stack de leilão reverso em tempo real, onde compradores publicam solicitações de serviço e fornecedores competem com lances decrescentes. Sistema com concorrência segura e baixa latência.",
        description:
          "Sistema full stack avançado criado para permitir que compradores publiquem solicitações de serviço (leilões) enquanto fornecedores competem enviando lances decrescentes em tempo real. O objetivo central é garantir concorrência segura, baixa latência e consistência absoluta, mesmo quando dezenas ou centenas de fornecedores disputam simultaneamente um mesmo leilão.",
        detailedDescription: `## O que este projeto faz?

Este sistema full stack implementa uma plataforma completa de leilão reverso, onde compradores publicam solicitações de serviço e fornecedores competem enviando lances decrescentes em tempo real. Todo o fluxo foi projetado para oferecer baixa latência, alta consistência e concorrência segura mesmo quando centenas de usuários disputam simultaneamente um mesmo leilão.

A aplicação utiliza Node.js e Express para a API principal, responsável pela criação de leilões, regras de negócio e controle de acesso. O Redis atua como camada de alta velocidade para controle de estado dos leilões, regras de concorrência, cooldowns e validações críticas. Dentro dele, scripts Lua garantem validação atômica de lances, evitando race conditions e assegurando que dois lances não sejam aceitos simultaneamente. Já o PostgreSQL armazena todos os dados persistentes — lances, vencedores, logs, auditoria e histórico completo — mantendo consistência entre cache e banco.

Para comunicação em tempo real, o sistema utiliza WebSocket através do Socket.io, permitindo que todos os usuários conectados recebam instantaneamente novos lances, tempos atualizados e notificações de fechamento do leilão. Um worker scheduler executado em background monitora expiramentos, fecha leilões de forma automática, aplica locks para evitar duplicidade, calcula vencedores e cria registros de escrow simulados.

O front-end foi desenvolvido em React, consumindo a REST API e mantendo conexão contínua via WebSocket para refletir alterações em tempo real na interface — atualização de lances, tempo restante, mudanças de estado e eventos do sistema. Tudo isso roda em containers Docker, facilitando deploy, isolamento e escalabilidade horizontal.

Para garantir estabilidade e segurança, o sistema aplica rate limiting, cooldowns por fornecedor, limites de tentativas, anti-abuso por IP e auditoria completa de ações. Um módulo adicional registra logs detalhados com IP, user-agent e payload de todas as operações sensíveis. Testes de stress validam o comportamento sob carga pesada, simulando centenas de requisições simultâneas para verificar a integridade dos lances e o funcionamento do fluxo atômico.

Com essa arquitetura integrada — Redis para estado rápido, PostgreSQL para persistência confiável, WebSocket para comunicação em tempo real, Node.js + Express para orquestração do backend e React para visualização dinâmica — a plataforma entrega um ambiente robusto, seguro e extremamente responsivo para disputas de preço em leilões reversos.`,
        image: "/images/reverse-auction-cover.png",
        tech: [
          "Node.js",
          "Express",
          "React",
          "PostgreSQL",
          "Redis",
          "Socket.io",
          "Lua Script",
          "WebSocket",
          "REST API",
          "Docker",
        ],
        category: "Engenharia de Software",
        year: "2025",
        duration: "2 meses",
        team: "Individual",
        features: [
          "Sistema de leilão reverso com lances decrescentes em tempo real",
          "Validação atômica de lances via Lua scripts no Redis",
          "Comunicação bi-direcional com WebSocket (Socket.io)",
          "Fechamento automático de leilões via worker schedulers",
          "Sistema completo de auditoria e logs",
          "Rate limiting e cooldowns para prevenir abuso",
          "Sincronização Redis + PostgreSQL para consistência",
          "Front-end React com atualizações em tempo real",
          "Sistema de escrow para pagamentos seguros",
          "Janela de revisão pós-leilão para compradores",
          "Dashboard com histórico completo de lances",
          "Testes de stress com centenas de requisições simultâneas",
        ],
      },
      {
        title: "Solax - Landing Page para Energia Solar",
        shortDescription:
          "Landing page moderna e responsiva desenvolvida para empresa de painéis solares, focada em conversão e experiência do usuário. Design profissional com gradientes, animações e seções otimizadas para geração de leads.",
        description:
          "Landing page completa desenvolvida para a Solax, empresa especializada em energia solar. O projeto combina design moderno com funcionalidades avançadas de conversão, apresentando os serviços da empresa de forma clara e atrativa.",
        detailedDescription: `## O que este projeto faz?

Esta landing page profissional foi desenvolvida para a empresa Solax, com foco total em conversão de visitantes em leads qualificados. O site apresenta os benefícios da energia solar de forma clara, visual e persuasiva, guiando o usuário desde o primeiro contato até o envio de formulário para orçamento. Todo o design foi pensado para transmitir confiança, credibilidade e profissionalismo, fatores essenciais no mercado de energia solar, onde o ticket médio é alto e decisões exigem segurança.

A interface foi construída com HTML5, CSS3 e JavaScript, utilizando princípios modernos de UI/UX para criar uma experiência fluida e atrativa. O design responsivo garante adaptação perfeita entre desktop e mobile, com imagens otimizadas, layouts flexíveis e navegação intuitiva em qualquer tamanho de tela. Animações suaves e gradientes dão ao site uma identidade visual moderna, reforçando a percepção de tecnologia e sustentabilidade.

O site possui seções estratégicas: uma hero section otimizada para captura de leads, cards de benefícios interativos, explicação visual do processo em três etapas, portfólio real de projetos instalados, catálogo de serviços e múltiplos pontos de conversão. Cada elemento foi pensado para reduzir objeções e aumentar a confiança do usuário. Para melhorar ainda mais o desempenho, foram aplicadas técnicas de performance como minificação, lazy loading e boas práticas de estrutura semântica.

A landing page também integra ferramentas de marketing e análise, permitindo acompanhar conversões e mapear o comportamento do usuário. Formulários são conectados com automações externas, e todo o conteúdo foi estruturado com foco em SEO, incluindo boas práticas de escrita, meta tags otimizadas e hierarquia adequada para melhor ranqueamento em buscas sobre energia solar.`,
        image: "/images/solax-cover.png",
        gallery: [
          {
            type: "desktop",
            images: [
              "/images/solax-energy.png",
              "/images/solax-projects.png",
              "/images/solax-process.png",
              "/images/solax-benefits.png",
              "/images/solax-services.png",
              "/images/solax-hero.png",
            ],
          },
          {
            type: "mobile",
            images: [
              "/images/img-3930.jpeg",
              "/images/img-3931.jpeg",
              "/images/img-3932.jpeg",
              "/images/img-3934.jpeg",
              "/images/img-3935.jpeg",
            ],
          },
        ],
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX Design"],
        category: "Desenvolvimento Web",
        year: "2025",
        duration: "1 mês",
        team: "Individual",
        features: [
          "Design responsivo com foco em conversão",
          "Hero section com captura de leads otimizada",
          "Seção de benefícios com cards interativos",
          "Processo simplificado em 3 etapas visuais",
          "Portfólio de projetos com casos reais",
          "Seção de serviços com descrições detalhadas",
          "Gradientes e animações suaves",
          "Otimização para SEO e performance",
          "Integração com ferramentas de marketing",
          "Formulários de contato estratégicos",
          "Design que transmite confiança e profissionalismo",
          "Adaptação perfeita para mobile e desktop",
        ],
        challenges: [
          {
            problem: "Educar sobre energia solar de forma simples e convincente",
            solution:
              "Criação de seções progressivas que explicam benefícios, processo e resultados usando linguagem acessível e elementos visuais claros",
          },
          {
            problem: "Transmitir confiança para investimento de alto valor",
            solution:
              "Design profissional com casos reais, garantias claras, processo transparente e elementos visuais que remetem à qualidade e sustentabilidade",
          },
          {
            problem: "Otimizar conversão sem comprometer a experiência",
            solution:
              "Posicionamento estratégico de CTAs, formulários não-intrusivos e múltiplos pontos de conversão adaptados ao comportamento do usuário",
          },
          {
            problem: "Destacar-se em mercado competitivo de energia solar",
            solution:
              "Diferenciação através de design único, foco em benefícios específicos e apresentação clara do processo e expertise da empresa",
          },
        ],
        results: [
          {
            metric: "Taxa de Conversão",
            value: "8.5%",
            description: "Visitantes que solicitaram orçamento ou consultoria",
          },
          {
            metric: "Tempo na Página",
            value: "4m 32s",
            description: "Tempo médio de engajamento dos visitantes",
          },
          {
            metric: "Performance Score",
            value: "95/100",
            description: "Pontuação no Google PageSpeed Insights",
          },
          {
            metric: "Leads Qualificados",
            value: "150+",
            description: "Leads gerados nos primeiros 3 meses",
          },
        ],
        liveUrl: "#",
        githubUrl: "#",
      },
      {
        title: "Agente IA para Clínicas Médicas",
        shortDescription:
          "Sistema inteligente de atendimento automatizado via WhatsApp para clínicas, com agendamento, lembretes e respostas contextuais desenvolvido com N8N.",
        description:
          "Sistema inteligente de atendimento automatizado via WhatsApp para clínicas, com agendamento, lembretes e respostas contextuais desenvolvido com N8N.",
        detailedDescription: `## O que este projeto faz?

**Sistema automatizado de atendimento para clínicas médicas via WhatsApp.** O agente inteligente resolve o problema de sobrecarga da equipe de recepção, automatizando tarefas repetitivas como agendamento de consultas, confirmação de horários, envio de lembretes e resposta a perguntas comuns dos pacientes. Tudo isso acontece em tempo real, 24 horas por dia, sem necessidade de intervenção humana.

Clínicas gastam muito tempo com tarefas administrativas básicas. A recepção fica sobrecarregada atendendo ligações para agendar consultas, confirmar horários e responder as mesmas perguntas repetidamente. Pacientes ficam frustrados esperando na linha ou não conseguem contato fora do horário comercial.

O sistema usa N8N (plataforma no-code) para criar fluxos automatizados que se conectam ao WhatsApp Business. Quando um paciente manda mensagem, o agente entende o que ele quer, consulta a agenda médica em tempo real, agenda a consulta se houver horário disponível, e confirma tudo automaticamente. Também envia lembretes antes das consultas e responde dúvidas sobre convênios, exames e procedimentos.

## Funcionalidades Principais

**Agendamento Inteligente:**
- Consulta agenda médica em tempo real
- Verifica disponibilidade por especialidade
- Considera duração específica de cada tipo de consulta
- Agenda automaticamente e confirma por WhatsApp

**Sistema de Lembretes Automáticos:**
- Envia lembretes 24h antes da consulta
- Confirma presença do paciente
- Permite reagendamento direto pelo WhatsApp
- Notifica a clínica sobre cancelamentos

**Atendimento 24/7:**
- Utilização de linguagem humanizada.
- Responde perguntas sobre horários de funcionamento
- Informa sobre convênios aceitos
- Explica procedimentos e preparos para exames
- Fornece informações de localização e contato

**Coleta e Organização de Dados:**
- Registra informações do paciente automaticamente
- Salva dados em planilhas organizadas
- Integra com sistemas de prontuário eletrônico
- Mantém histórico completo de conversas
`,
        image: "/images/agente-ia-cover.png",
        tech: ["N8N", "WhatsApp API", "AI", "Automation", "Node.js", "OpenAI", "Webhook", "REST API"],
        category: "Inteligência Artificial",
        year: "2024",
        duration: "1 mês",
        team: "Individual",
        features: [
          "Atendimento 24/7 via WhatsApp Business",
          "Agendamento automático com verificação de disponibilidade",
          "Lembretes personalizados por SMS e WhatsApp",
          "Respostas contextuais sobre procedimentos médicos",
          "Integração com sistemas de gestão médica",
          "Dashboard para monitoramento de conversas",
          "Escalação inteligente para atendimento humano",
          "Relatórios de performance e satisfação",
          "Coleta automática de dados do paciente",
          "Sistema de confirmação de consultas",
          "Reagendamento direto pelo WhatsApp",
          "Integração com prontuário eletrônico",
        ],
        challenges: [
          {
            problem: "Compreensão de linguagem natural médica",
            solution: "Treinamento de modelo específico com terminologia médica e casos de uso reais de clínicas",
          },
          {
            problem: "Integração com múltiplos sistemas de agenda",
            solution:
              "Desenvolvimento de middleware flexível que se adapta a diferentes sistemas através de APIs padronizadas",
          },
          {
            problem: "Conformidade com LGPD e privacidade médica",
            solution:
              "Implementação de criptografia end-to-end, políticas de retenção de dados e controles de acesso rigorosos",
          },
          {
            problem: "Manutenção do contexto conversacional",
            solution:
              "Sistema de memória conversacional que lembra interações anteriores e mantém continuidade natural",
          },
        ],
        results: [
          {
            metric: "Redução de Chamadas",
            value: "70%",
            description: "Diminuição no volume de chamadas telefônicas para agendamento",
          },
          {
            metric: "Satisfação do Paciente",
            value: "4.8/5",
            description: "Avaliação média dos pacientes atendidos pelo sistema",
          },
          {
            metric: "Agendamentos Automatizados",
            value: "85%",
            description: "Percentual de agendamentos feitos sem intervenção humana",
          },
          {
            metric: "Tempo de Resposta",
            value: "< 30s",
            description: "Tempo médio de resposta para qualquer solicitação",
          },
        ],
      },
      {
        title: "Agente IA - Clínicas de Estética",
        shortDescription:
          "Especialização do sistema de IA para o segmento de estética, com funcionalidades específicas para tratamentos, promoções e fidelização de clientes.",
        description:
          "Especialização do sistema de IA para o segmento de estética, com funcionalidades específicas para tratamentos, promoções e fidelização de clientes.",
        detailedDescription: `## O que este projeto faz?

Versão especializada do agente de IA focada exclusivamente no mercado de estética e beleza. Este sistema vai além do agendamento básico, incorporando funcionalidades únicas do setor como consultas sobre tratamentos estéticos, gestão de pacotes promocionais, programas de fidelidade e sugestões personalizadas baseadas no perfil e histórico do cliente.

O mercado de estética tem necessidades muito específicas: clientes querem saber sobre resultados de tratamentos, precisam de orientações pós-procedimento, buscam promoções e pacotes, e valorizam relacionamento personalizado. Uma clínica de estética não é apenas sobre agendar - é sobre vender experiências e resultados.

O sistema conhece profundamente cada tratamento oferecido, seus benefícios, contraindicações e resultados esperados. Quando um cliente pergunta sobre "tratamento para rugas", o agente não só explica as opções disponíveis, mas sugere o melhor tratamento baseado na idade, tipo de pele e histórico anterior. Também gerencia promoções automáticas, oferece upgrades inteligentes e mantém programas de fidelidade.

Adaptar IA para estética exige compreender um mercado muito específico e sofisticado:

**1. Conhecimento Especializado:** O sistema precisa entender centenas de tratamentos diferentes, suas indicações, contraindicações, resultados esperados e cuidados pós-procedimento.

**2. Personalização Avançada:** Cada cliente é único. O sistema analisa histórico de tratamentos, preferências, orçamento e objetivos para fazer sugestões personalizadas.

**3. Gestão Comercial Inteligente:** Não é só agendar - é vender. O sistema identifica oportunidades de upselling, cross-selling e oferece promoções no momento certo.

**4. Relacionamento de Longo Prazo:** Clientes de estética retornam regularmente. O sistema mantém relacionamento contínuo, lembrando de retornos, sugerindo manutenções e oferecendo novidades.

## Funcionalidades Especializadas

**Consultas Especializadas sobre Tratamentos:**
- Explica benefícios e resultados de cada procedimento
- Informa sobre contraindicações e cuidados necessários
- Sugere tratamentos baseados no perfil do cliente
- Compara diferentes opções de tratamento

**Sistema de Pacotes e Promoções:**
- Gerencia automaticamente promoções sazonais
- Oferece pacotes personalizados baseados no histórico
- Calcula descontos e condições especiais
- Integra com sistema de pagamento para facilitar compras

**Programa de Fidelidade Inteligente:**
- Acumula pontos automaticamente por tratamento
- Oferece recompensas personalizadas
- Identifica clientes VIP para tratamento especial
- Envia ofertas exclusivas baseadas no perfil

**Upselling e Cross-selling Automático:**
- Identifica oportunidades de venda adicional
- Sugere tratamentos complementares
- Oferece upgrades no momento da reserva
- Personaliza ofertas baseado no orçamento do cliente

## Integrações Avançadas

**Sistema de Pagamento Completo:**
- Aceita PIX, cartão de crédito e débito
- Oferece parcelamento automático
- Gerencia pacotes pré-pagos
- Processa reembolsos quando necessário

**CRM Especializado em Estética:**
- Mantém ficha completa de cada cliente
- Registra histórico de todos os tratamentos
- Acompanha evolução e resultados
- Agenda retornos e manutenções automáticas

**Avaliação e Feedback Automatizado:**
- Coleta feedback após cada tratamento
- Monitora satisfação e resultados
- Identifica problemas rapidamente
- Usa feedback para melhorar sugestões
`,
        image: "/images/agente-ia-cover.png",
        tech: ["N8N", "WhatsApp Business", "CRM", "Analytics", "Payment API", "OpenAI", "Database", "Webhook"],
        category: "Inteligência Artificial",
        year: "2024",
        duration: "1 mês",
        team: "Individual",
        features: [
          "Consultas especializadas sobre tratamentos estéticos",
          "Agendamento com diferentes durações por procedimento",
          "Gestão automática de pacotes promocionais",
          "Sistema de fidelidade com pontuação automática",
          "Upselling e cross-selling inteligente",
          "Integração com gateway de pagamento",
          "Avaliação pós-tratamento automatizada",
          "Campanhas promocionais sazonais automáticas",
          "Sugestões personalizadas por tipo de pele",
          "Gestão de contraindicações e cuidados",
          "Sistema de indicações com recompensas",
          "Acompanhamento de resultados de tratamentos",
        ],
        challenges: [
          {
            problem: "Personalização por tipo de pele e necessidades específicas",
            solution:
              "Sistema de perfis detalhados que analisa histórico de tratamentos, tipo de pele, idade e objetivos para sugestões precisas",
          },
          {
            problem: "Gestão complexa de promoções e pacotes variados",
            solution:
              "Engine de regras flexível que gerencia diferentes tipos de desconto, condições especiais e combinações de tratamentos",
          },
          {
            problem: "Integração com múltiplos métodos de pagamento",
            solution:
              "Abstração de pagamentos com suporte nativo a PIX, cartões e parcelamento, incluindo gestão de pacotes pré-pagos",
          },
          {
            problem: "Conhecimento especializado sobre centenas de tratamentos",
            solution:
              "Base de conhecimento estruturada com informações detalhadas sobre cada procedimento, resultados e contraindicações",
          },
        ],
        results: [
          {
            metric: "Aumento em Vendas",
            value: "45%",
            description: "Crescimento nas vendas de tratamentos e pacotes",
          },
          {
            metric: "Taxa de Retenção",
            value: "78%",
            description: "Clientes que retornaram para novos tratamentos",
          },
          {
            metric: "Conversão de Leads",
            value: "62%",
            description: "Taxa de conversão de consultas em agendamentos efetivos",
          },
          {
            metric: "Ticket Médio",
            value: "+35%",
            description: "Aumento no valor médio por cliente através de upselling",
          },
        ],
      },
    ],
    [],
  )

  const otherSkills = useMemo(
    () => [
      {
        title: "Resolução de Problemas",
        description:
          "Capacidade analítica para identificar, diagnosticar e resolver problemas complexos de forma eficiente e criativa.",
        icon: <Lightbulb className="h-8 w-8" />,
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Trabalho em Equipe",
        description:
          "Experiência colaborativa em projetos multidisciplinares, comunicação efetiva e liderança técnica.",
        icon: <Users className="h-8 w-8" />,
        color: "from-green-500 to-green-600",
      },
      {
        title: "Gestão de Projetos",
        description: "Planejamento, organização e execução de projetos de software com foco em prazos e qualidade.",
        icon: <Target className="h-8 w-8" />,
        color: "from-purple-500 to-purple-600",
      },
      {
        title: "Aprendizado Contínuo",
        description: "Autodidatismo e adaptabilidade para acompanhar novas tecnologias e tendências do mercado.",
        icon: <BookOpen className="h-8 w-8" />,
        color: "from-orange-500 to-orange-600",
      },
      {
        title: "Comunicação Técnica",
        description:
          "Habilidade para explicar conceitos complexos de forma clara para diferentes públicos e stakeholders.",
        icon: <MessageSquare className="h-8 w-8" />,
        color: "from-teal-500 to-teal-600",
      },
      {
        title: "Análise de Dados",
        description: "Interpretação de métricas, geração de insights e tomada de decisões baseada em dados.",
        icon: <BarChart3 className="h-8 w-8" />,
        color: "from-red-500 to-red-600",
      },
      {
        title: "Documentação Técnica",
        description: "Criação de documentação clara, manuais de usuário e especificações técnicas detalhadas.",
        icon: <FileText className="h-8 w-8" />,
        color: "from-indigo-500 to-indigo-600",
      },
      {
        title: "Otimização de Performance",
        description: "Identificação de gargalos e implementação de melhorias para aumentar eficiência e velocidade.",
        icon: <Zap className="h-8 w-8" />,
        color: "from-yellow-500 to-yellow-600",
      },
    ],
    [],
  )

  const frontendSkills = useMemo(
    () => [
      "HTML5 & CSS3",
      "JavaScript (ES6+)",
      "React & Next.js",
      "Tailwind CSS",
      "UI/UX Design",
      "Responsive Design",
      "TypeScript",
      "Framer Motion",
    ],
    [],
  )

  const backendSkills = useMemo(
    () => [
      "Python",
      "Node.js",
      "REST APIs",
      "GraphQL",
      "SQL & NoSQL",
      "Automação de Processos",
      "Integração de Sistemas",
      "Cloud Services",
    ],
    [],
  )

  // Variantes de animação otimizadas
  const fadeInUp = useMemo(
    () => ({
      initial: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
    }),
    [shouldReduceMotion],
  )

  const staggerContainer = useMemo(
    () => ({
      animate: {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.05,
        },
      },
    }),
    [shouldReduceMotion],
  )

  const smoothScrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  const handleProjectClick = useCallback((project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <Navigation
        scrollY={scrollY}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        shouldReduceMotion={shouldReduceMotion}
      />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <motion.p
                className="text-xs sm:text-sm font-light tracking-wider sm:tracking-widest uppercase text-gray-500 mb-6 break-words"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 0.4 }}
              >
                Desenvolvedor Full-Stack & Especialista em IA
              </motion.p>

              <motion.h1
                className="text-5xl lg:text-7xl font-light leading-tight mb-8"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 0.6 }}
              >
                Diogo Luis
                <br />
                <span className="font-extralight text-gray-600">Gapski Fernandes</span>
              </motion.h1>

              <motion.p
                className="text-lg font-light text-gray-600 leading-relaxed mb-12 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: 0.4 }}
              >
                Desenvolvedor versátil especializado em criar soluções completas: desde landing pages impactantes até
                sistemas complexos de IA e automação. Transformo ideias em realidade digital.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.7, duration: 0.4 }}
              >
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-sm font-light tracking-wide transition-all duration-200"
                  onClick={() => smoothScrollTo("work")}
                >
                  Ver Trabalhos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:bg-gray-50 px-8 py-3 text-sm font-light tracking-wide transition-all duration-200 bg-transparent"
                  onClick={() => smoothScrollTo("contact")}
                >
                  Entrar em Contato
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.4 }}
              className="relative"
            >
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <OptimizedImage
                    src="/profile.jpg"
                    alt="Diogo Luis Gapski Fernandes"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover transition-all duration-300"
                    priority
                    quality={85}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <p className="text-sm font-light tracking-widest uppercase text-gray-500 mb-4">Sobre</p>
            <h2 className="text-4xl lg:text-5xl font-light mb-8">Desenvolvedor Completo</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="text-lg font-light text-gray-600 leading-relaxed mb-8">
                Formado em Técnico em Programação de Jogos Digitais pelo Instituto Federal do Paraná (2022-2025), sou especializado em criar
                sistemas web robustos, automações inteligentes e agentes avançados que resolvem problemas reais de ponta
                a ponta. Trabalho principalmente com Next.js, React, Node.js, Python e N8N — tecnologias que uso para
                construir desde aplicações completas até fluxos autônomos capazes de operar em produção 24/7.
              </p>

              <p className="text-lg font-light text-gray-600 leading-relaxed mb-12">
                Ao longo dos projetos, desenvolvi experiência prática em design, scraping avançado, integrações com
                APIs, análise de dados, IA aplicada, automação empresarial e desenvolvimento full-stack. Meu foco é
                sempre o mesmo: entregar soluções eficientes, escaláveis e realmente úteis para quem usa.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-light mb-4">Formação</h3>
                  <div className="border-l-2 border-gray-200 pl-6">
                    <h4 className="font-medium mb-1">Técnico em Programação de Jogos Digitais</h4>
                    <p className="text-gray-600 text-sm">Instituto Federal do Paraná (IFPR)</p>
                    <p className="text-gray-500 text-sm">2022 - 2025</p>

                    <h4 className="font-medium mb-1">Bacharelado em Ciência da Computação</h4>
                    <p className="text-gray-600 text-sm">Instituto Federal do Paraná (IFPR)</p>
                    <p className="text-gray-500 text-sm">Cursando</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-light mb-4">Áreas de Atuação</h3>
                  <motion.div
                    className="grid grid-cols-2 gap-3"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {[
                      "Desenvolvimento Web",
                      "Landing Pages",
                      "Sistemas de IA",
                      "Automação",
                      "Jogos Digitais",
                      "Apps Mobile",
                      "APIs & Backend",
                      "UI/UX Design",
                    ].map((area, index) => (
                      <motion.div
                        key={index}
                        className="text-sm text-gray-600 py-2 px-3 bg-white rounded border border-gray-200"
                        variants={fadeInUp}
                      >
                        {area}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-xl font-light mb-8">Stack Tecnológico</h3>

              <div className="space-y-8">
                <div>
                  <h4 className="font-medium mb-6 text-gray-800">Frontend & Design</h4>
                  <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {frontendSkills.map((skill, index) => (
                      <motion.div key={index} className="flex items-center space-x-3" variants={fadeInUp}>
                        <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-light">{skill}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div>
                  <h4 className="font-medium mb-6 text-gray-800">Backend & Automação</h4>
                  <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {backendSkills.map((skill, index) => (
                      <motion.div key={index} className="flex items-center space-x-3" variants={fadeInUp}>
                        <div className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-light">{skill}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-gray-800">Experiência Profissional</h4>
                  <div className="space-y-4">
                    <div className="border-l-2 border-gray-200 pl-6">
                      <h5 className="font-medium text-sm">Desenvolvedor Web Full-Stack</h5>
                      <p className="text-gray-600 text-sm">Black-Academy</p>
                      <p className="text-gray-500 text-xs">Sites responsivos, landing pages e marketing digital</p>
                    </div>
                    <div className="border-l-2 border-gray-200 pl-6">
                      <h5 className="font-medium text-sm">Desenvolvedor Mobile</h5>
                      <p className="text-gray-600 text-sm">PlayInformática</p>
                      <p className="text-gray-500 text-xs">Apps Android, APIs e integração de sistemas</p>
                    </div>
                    <div className="border-l-2 border-gray-200 pl-6">
                      <h5 className="font-medium text-sm">Freelancer Full-Stack</h5>
                      <p className="text-gray-600 text-sm">Projetos Diversos</p>
                      <p className="text-gray-500 text-xs">Soluções completas de automação e desenvolvimento</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Skills Section */}
      <section id="skills" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <p className="text-sm font-light tracking-widest uppercase text-gray-500 mb-4">Competências</p>
            <h2 className="text-4xl lg:text-5xl font-light mb-8">Habilidades Profissionais</h2>
            <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto">
              Soft skills e competências complementares que agregam valor aos projetos e equipes.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {otherSkills.map((skill, index) => (
              <motion.div key={index} variants={fadeInUp} className="group">
                <motion.div
                  className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-200 h-full"
                  whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                >
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-200`}
                  >
                    {skill.icon}
                  </motion.div>

                  <h3 className="text-xl font-medium text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-200">
                    {skill.title}
                  </h3>

                  <p className="text-gray-600 font-light leading-relaxed text-sm">{skill.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Work Section - Layout Responsivo Otimizado */}
      <section id="work" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-16"
          >
            <p className="text-sm font-light tracking-widest uppercase text-gray-500 mb-4">Portfólio</p>
            <h2 className="text-4xl lg:text-5xl font-light mb-8">Projetos Destacados</h2>
            <p className="text-lg font-light text-gray-600 max-w-2xl">
              Uma seleção dos meus trabalhos mais impactantes, demonstrando versatilidade em desenvolvimento web,
              mobile, jogos, IA e automação.
            </p>
          </motion.div>

          <div className="space-y-20">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.03 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group"
              >
                {/* Layout Responsivo: Mobile-first com imagem antes do texto */}
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
                  {/* Mobile: Imagem sempre primeiro */}
                  <div className="block lg:hidden">
                    <motion.div
                      className="relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer aspect-[16/10]"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => handleProjectClick(project)}
                    >
                      <OptimizedImage
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={500}
                        className={`w-full h-full object-cover object-center ${project.title === "Solax - Landing Page para Energia Solar" ? "" : "grayscale"} hover:grayscale-0 transition-all duration-300`}
                        quality={70}
                        sizes="100vw"
                      />
                    </motion.div>
                  </div>

                  {/* Desktop: Imagem com alternância de lado - MESMA ALTURA DO TEXTO */}
                  <div
                    className={`hidden lg:flex ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-2 lg:row-start-1"}`}
                  >
                    <motion.div
                      className="relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer w-full aspect-[4/3]"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => handleProjectClick(project)}
                    >
                      <OptimizedImage
                        src={project.image}
                        alt={project.title}
                        width={600}
                        height={450}
                        className={`w-full h-full object-cover object-center ${project.title === "Solax - Landing Page para Energia Solar" ? "" : "grayscale"} hover:grayscale-0 transition-all duration-300`}
                        quality={70}
                        sizes="(max-width: 1200px) 50vw, 40vw"
                      />
                    </motion.div>
                  </div>

                  {/* Conteúdo do texto */}
                  <div
                    className={`flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1"}`}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs font-light tracking-widest uppercase text-gray-500">
                          {project.category}
                        </span>
                        <span className="text-xs text-gray-400">{project.year}</span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-light mb-4 leading-tight">{project.title}</h3>
                    </div>

                    <p className="text-gray-600 font-light leading-relaxed mb-8">{project.shortDescription}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.slice(0, 4).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 text-xs font-light tracking-wide bg-gray-100 text-gray-700 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-3 py-1 text-xs font-light tracking-wide bg-gray-200 text-gray-600 rounded-full">
                          +{project.tech.length - 4} mais
                        </span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-900 hover:bg-gray-50 text-sm font-light tracking-wide group-hover:border-gray-900 transition-all duration-150 bg-transparent self-start"
                      onClick={() => handleProjectClick(project)}
                    >
                      Ver Detalhes
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <p className="text-sm font-light tracking-widest uppercase text-gray-500 mb-4">Contato</p>
            <h2 className="text-4xl lg:text-5xl font-light mb-8">Vamos criar algo incrível</h2>
            <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto">
              Precisa de um site, landing page, sistema de automação ou qualquer solução digital? Vamos conversar sobre
              como posso ajudar seu projeto a decolar.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-light mb-8">Informações de Contato</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-light">diogo.lgapski@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-light">+55 41 99677-4152</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Localização</p>
                      <p className="font-light">Curitiba, Brasil</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-6 mt-12">
                  <a
                    href="https://github.com/diogogapski"
                    className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/diogo-gapski-fernandes-a83601206/"
                    className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:diogo.lgapski@gmail.com"
                    className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-light mb-8">Envie uma mensagem</h3>
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-light tracking-wide transition-all duration-200"
                    onClick={() => window.open("mailto:diogo.lgapski@gmail.com")}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-gray-300 text-gray-900 hover:bg-gray-50 text-sm font-light tracking-wide transition-all duration-200 bg-transparent"
                    onClick={() => window.open("tel:+5541996774152")}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Ligar Agora
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            className="text-sm font-light text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            viewport={{ once: true }}
          >
            © 2025 Diogo Luis Gapski Fernandes. Desenvolvido com atenção aos detalhes.
          </motion.p>
        </div>
      </footer>

      {/* Project Modal - Lazy Loaded e Otimizado */}
      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
        </Suspense>
      )}
    </div>
  )
}
