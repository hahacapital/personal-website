// src/data/about-content.ts
// Bilingual About-page content only (career narrative, working philosophy,
// education) — used only by src/pages/{zh,en}/about.astro.
import type { Locale } from '../i18n/utils';

interface AboutContent {
  narrative: string[]; // paragraphs
  philosophy: string;
  education: string[];
}

export const aboutContent: Record<Locale, AboutContent> = {
  zh: {
    narrative: [
      '张翼翔在蚂蚁金服区块链平台部（2018–2021）担任技术专家，是 BaaS（Blockchain-as-a-Service）技术负责人之一，从 0 设计并开发区块链全生命周期管理平台，带领 3 人团队构建支撑大规模流量的 API 网关，基于密码学落地 AKDF 分层密钥派生服务，累计产出 8 项技术专利 + 1 项商业模式专利。',
      '2021 年加入国内工业 SaaS 市占率第一的新核云，担任技术总监（2021–2025），从 0 到 1 设计并落地多个企业级 AI Agent——代码生成 Agent 将核心产品重构效率提升 80%，"质量合拍"产线质量管理 Agent 落地一线工厂。同时带领基础设施团队支撑百人产研协同，建设可观测性平台，SLA 保持在 99.99% 以上，入选阿里云最佳实践。',
      '2025 年起转型为独立 Forward Deployed Engineer，同时为多家企业提供嵌入式 AI 落地服务，包括 Blueprint Infrastructure、Lightyear Technologies、XYNX-AI 等，并持续运营 hahacapital 旗下的量化与投资研究实践。',
    ],
    philosophy:
      '信奉「解决问题优于堆砌技术」——习惯在客户现场把模糊的需求转化为可上线的方案，具备中英双语与跨文化协作能力，能同时与工程团队和业务决策者高效沟通。',
    education: [
      'Illinois Institute of Technology（伊利诺伊理工学院）— 计算机工程硕士，GPA 3.59/4，2013.8–2015.1',
      '河海大学 — 通信工程学士，GPA 3.40/4，2009.8–2013.5',
    ],
  },
  en: {
    narrative: [
      "At Ant Financial's Blockchain Platform Department (2018–2021), Yixiang Zhang served as a Technical Expert and one of the technical leads for its BaaS (Blockchain-as-a-Service) offering — designing and building a full-lifecycle blockchain management platform from zero, leading a 3-person team on a self-service API gateway built for large-scale traffic, and shipping a cryptography-based AKDF hierarchical key-derivation service. That work produced 8 technical patents plus 1 business-model patent.",
      'In 2021 he joined XinHeYun, China\'s #1 industrial SaaS company by market share, as Technical Director (2021–2025), designing and shipping multiple enterprise AI Agents from zero — including a code-generation agent that lifted core product refactoring efficiency by 80%, and a production-line quality-management agent ("Quality Harmony") deployed to factory floors. He also led the infrastructure team supporting a 100-person R&D organization, building an observability platform that sustained >99.99% SLA, recognized as an Alibaba Cloud best practice.',
      'Since 2025 he has worked as an independent Forward Deployed Engineer, taking on embedded AI-delivery engagements with multiple companies concurrently — including Blueprint Infrastructure, Lightyear Technologies, and XYNX-AI — while continuing to run the quant and investment research practice under hahacapital.',
    ],
    philosophy:
      'Believes in solving problems over stacking technology — accustomed to turning vague requirements into shippable systems directly on a client\'s site, with bilingual fluency and cross-cultural collaboration skills that let him communicate efficiently with both engineering teams and business decision-makers.',
    education: [
      'Illinois Institute of Technology — M.S. Computer Engineering, GPA 3.59/4, 2013.8–2015.1',
      'Hohai University — B.S. Communication Engineering, GPA 3.40/4, 2009.8–2013.5',
    ],
  },
};
