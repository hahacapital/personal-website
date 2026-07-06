// src/data/contact-content.ts
// Bilingual Contact-page content only (the one verbatim intro line) — used only
// by src/components/ContactBody.astro. Everything else on the page (labels,
// résumé copy) is structural microcopy that lives in the component itself, the
// same split home-content.ts/about-content.ts already establish.
import type { Locale } from '../i18n/utils';

interface ContactContent {
  intro: string;
}

export const contactContent: Record<Locale, ContactContent> = {
  zh: {
    intro: '目前以独立 Forward Deployed Engineer 的身份，为多家企业提供短期嵌入式 AI 落地项目合作。',
  },
  en: {
    intro:
      'Currently working as an independent Forward Deployed Engineer, taking on short-term embedded AI-delivery project engagements with multiple companies.',
  },
};
