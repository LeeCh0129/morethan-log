const CONFIG = {
  // profile setting (required)
  profile: {
    name: "ChanHoLee",
    image: "/avatar-white.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Frontend Developer",
    bio: "기억은 잊혀져도 기록은 영원하다",
    email: "cksgh5477@gmail.com",
    linkedin: "LeeCh0129",
    github: "LeeCh0129",
    instagram: "",
  },
  projects: [
    {
      name: `Bowling-Bling`,
      href: "https://github.com/2-Idiots/BowlingBling_FrontEnd",
    },
    {
      name: "Today-Keyword",
      href: "https://github.com/LeeCh0129/TodayKeyword.BackEnd",
    },
    {
      name: "Greenie",
      href: "https://github.com/LeeCh0129/greenie-backend",
    },
  ],
  // blog setting (required)
  blog: {
    title: "LeeCh-log",
    description: "welcome to LeeCh-log!",
    scheme: "dark", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://morethan-log.vercel.app",
  since: 2022, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 21600 * 7, // revalidate time for [slug], index
}

module.exports = { CONFIG }
