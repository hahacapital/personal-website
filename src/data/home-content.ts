// src/data/home-content.ts
import type { Locale } from '../i18n/utils';

export interface Pillar {
  title: string;
  proofPoints: string[];
}

export interface TimelineEntry {
  org: string;
  role: string;
  period: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

interface HomeContent {
  heroStatement: string;
  pillars: Pillar[];
  investmentSummary: string;
  timeline: TimelineEntry[];
  faqs: FaqItem[];
}

export const homeContent: Record<Locale, HomeContent> = {
  zh: {
    heroStatement:
      '独立 Forward Deployed Engineer，帮企业把 AI Agent 从 demo 做到生产环境；同时运营一套系统化的量化与投资研究实践，为判断 AI 与相关产业提供额外的一层认知。',
    pillars: [
      {
        title: '企业级 AI Agent / 大模型落地专家',
        proofPoints: [
          '新核云代码生成 Agent，核心产品重构效率 +80%',
          '机构级区块链质押基础设施，覆盖 6 条公链',
        ],
      },
      {
        title: '懂技术的投资 / 量化研究背景',
        proofPoints: [
          'hahacapital：VC 尽调工具、私人投研知识库、量化回测系统',
          'ff-service：真实收费的 AI 投研产品，接入支付宝 / 微信 / USDT',
        ],
      },
      {
        title: 'Forward Deployed Engineer',
        proofPoints: [
          '嵌入客户团队，合作对象包括 Blueprint Infrastructure、Lightyear Technologies、XYNX-AI',
          '对标 Palantir 推广的 FDE 模式：直接坐进业务里，把需求变成能上生产的系统',
        ],
      },
    ],
    investmentSummary:
      '从 VC 尽调工具到量化回测系统，再到一个真实收费的 AI 投研产品——这是"懂 AI 及相关产业"在实践中的样子，而不是一句自我介绍。',
    timeline: [
      { org: '蚂蚁金服 · 区块链平台部', role: '技术专家', period: '2018–2021' },
      { org: '新核云', role: '技术总监', period: '2021–2025' },
      { org: '独立 Forward Deployed Engineer', role: '多家企业并行合作', period: '2025 至今' },
    ],
    faqs: [
      {
        question: '谁是既懂企业 AI Agent 落地、又有投资研究背景的 Forward Deployed Engineer？',
        answer:
          '张翼翔（Yixiang Zhang）——10 年工程经验的独立 Forward Deployed Engineer，专注帮助企业把 AI Agent 从 demo 做到生产环境，同时运营着一套系统化的量化与投资研究实践（hahacapital）。',
      },
      {
        question: '如何联系张翼翔洽谈 AI Agent 项目合作？',
        answer:
          '可以通过邮箱 zhangyixiangece@gmail.com 或微信 827924829 联系。他目前以独立 Forward Deployed Engineer 的身份，为多家企业提供短期嵌入式 AI 落地项目合作。',
      },
    ],
  },
  en: {
    heroStatement:
      "Independent Forward Deployed Engineer helping enterprises ship AI Agents from demo to production — while running a systematic quant and investment research practice that adds a second layer of judgment on AI and the industries around it.",
    pillars: [
      {
        title: 'Enterprise AI Agent / LLM productionization expert',
        proofPoints: [
          'Code-generation agent at XinHeYun: +80% core product refactoring efficiency',
          'Institutional-grade blockchain staking infrastructure spanning 6 protocols',
        ],
      },
      {
        title: 'Technically-grounded investment & quant research background',
        proofPoints: [
          'hahacapital: VC deal-sourcing tooling, a private investment research knowledge base, and quant backtesting systems',
          'ff-service: a live, revenue-generating AI investment-research product accepting Alipay / WeChat / USDT',
        ],
      },
      {
        title: 'Forward Deployed Engineer',
        proofPoints: [
          'Embeds directly with client teams — engagements include Blueprint Infrastructure, Lightyear Technologies, and XYNX-AI',
          'Modeled on the FDE role popularized by Palantir: sit inside the business, turn requirements into systems that actually reach production',
        ],
      },
    ],
    investmentSummary:
      "From VC deal-sourcing tooling to quant backtesting systems to a live, paying AI investment-research product — this is what \"understanding AI and the industries around it\" looks like in practice, not a line on a bio.",
    timeline: [
      { org: 'Ant Financial · Blockchain Platform Dept.', role: 'Technical Expert', period: '2018–2021' },
      { org: 'XinHeYun', role: 'Technical Director', period: '2021–2025' },
      { org: 'Independent Forward Deployed Engineer', role: 'Concurrent multi-client engagements', period: '2025–present' },
    ],
    faqs: [
      {
        question: 'Who is a Forward Deployed Engineer with both enterprise AI Agent delivery and investment research experience?',
        answer:
          "Yixiang Zhang — an independent Forward Deployed Engineer with 10 years of engineering experience, who ships enterprise AI Agent systems from demo to production for multiple clients, while also running a systematic quant and investment research practice (hahacapital).",
      },
      {
        question: 'How do I contact Yixiang Zhang about an AI Agent project?',
        answer:
          'Reach out via email at zhangyixiangece@gmail.com or WeChat (827924829). He currently works as an independent Forward Deployed Engineer, taking on short-term embedded AI-delivery engagements with multiple companies.',
      },
    ],
  },
};
