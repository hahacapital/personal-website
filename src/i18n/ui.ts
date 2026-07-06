export const ui = {
  zh: {
    'nav.home': '首页',
    'nav.work': '案例',
    'nav.about': '关于',
    'nav.contact': '联系',
    'cta.discuss': '讨论一个项目',
    'cta.download_resume': '下载简历',
    'lang.switch': 'English',
  },
  en: {
    'nav.home': 'Home',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'cta.discuss': 'Discuss a project',
    'cta.download_resume': 'Download résumé',
    'lang.switch': '中文',
  },
} as const;

export type UiKey = keyof typeof ui['en'];
