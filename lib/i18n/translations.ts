export type Language = "en" | "pcm" | "sw";

export const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "pcm", label: "Pidgin", native: "Pidgin" },
  { code: "sw", label: "Swahili", native: "Kiswahili" },
];

type TranslationMap = Record<string, string>;

export const translations: Record<Language, TranslationMap> = {
  en: {
    "nav.shops": "Shops",
    "nav.how-it-works": "How it works",
    "nav.login": "Login",
    "nav.start-free": "Start for free",

    "hero.title": "Authentic African Food, Delivered Anywhere",
    "hero.body":
      "Shop your favorite African groceries, pay securely, and track your delivery in real time. We deliver the best in real time",
    "hero.start-free": "Start for free",
    "hero.watch-video": "Watch video",

    "how.title": "How Deni Works",
    "how.subtitle": "We offer the best experience for authentic African products",
    "how.step1.title": "Discover",
    "how.step1.body": "Browse authentic African products",
    "how.step2.title": "Order & Pay",
    "how.step2.body": "Fast checkout with secure payments",
    "how.step3.title": "Track Live",
    "how.step3.body": "See your order in real-time.",
    "how.step4.title": "Receive",
    "how.step4.body": "Delivered fresh to your doorstep",

    "social.headline":
      "Used by Africans in diaspora just like you to order products in Africa.",

    "community.title": "Our Community",
    "community.subtitle": "We love to connect you to the source",
    "community.item1": "Browse thousands of authentic products",
    "community.item2": "Shop with confidence",
    "community.item3": "Feel connected",
    "community.item4": "Every seller is identity-verified",
    "community.item5": "Secure checkout with full buyer protection",
    "community.item6":
      "Track your order from the artisan\u2019s hands to your front door.",
    "community.cta": "Get started",

    "footer.newsletter":
      "Not sure where to start? Sign up to receive our newsletter. a free guide to getting cheaper African products delivered to your doorstep.",
    "footer.email-placeholder": "Your email",
    "footer.sign-up": "Sign up",
    "footer.shop-title": "Shop / Marketplace",
    "footer.company-title": "Company",
    "footer.vendors-title": "Vendors",
    "footer.connect": "Connect",
    "footer.support-title": "Support",
    "footer.terms": "Terms",
    "footer.privacy": "Privacy policy",

    "shops.title": "Browse African Markets",
    "shops.subtitle":
      "Discover authentic products from verified sellers across the continent \u2014 from fresh produce to traditional pantry staples.",
    "shops.cta-title": "Want to sell on Deni?",
    "shops.cta-body":
      "Join hundreds of vendors reaching customers across the diaspora.",
    "shops.cta-button": "Become a Vendor",
    "shops.cat1.title": "Fresh Produce",
    "shops.cat1.desc":
      "Farm-fresh fruits, vegetables, and herbs sourced directly from local growers",
    "shops.cat2.title": "Grains & Staples",
    "shops.cat2.desc":
      "Rice, yam, garri, beans, and other everyday essentials",
    "shops.cat3.title": "Spices & Seasonings",
    "shops.cat3.desc":
      "Authentic blends, dried peppers, and traditional flavorings",
    "shops.cat4.title": "Seafood & Proteins",
    "shops.cat4.desc":
      "Dried fish, stockfish, crayfish, and premium cuts",
    "shops.cat5.title": "Snacks & Treats",
    "shops.cat5.desc":
      "Traditional snacks, chin chin, puff puff mixes, and more",
    "shops.cat6.title": "Beverages",
    "shops.cat6.desc":
      "Zobo mixes, sobo ingredients, palm wine, and specialty drinks",

    "how-page.title": "How Deni Works",
    "how-page.subtitle":
      "From discovery to delivery \u2014 we make getting authentic African products simple and secure.",
    "how-page.step1.body":
      "Browse thousands of authentic African products from verified sellers. Use categories, search, and filters to find exactly what you need \u2014 from fresh produce to traditional pantry staples.",
    "how-page.step1.item1":
      "Explore categories like fresh produce, grains, spices, and more",
    "how-page.step1.item2": "Search by product name, seller, or region",
    "how-page.step1.item3": "Read product descriptions and reviews",
    "how-page.step2.body":
      "Add items to your cart and checkout securely. We support multiple payment methods so you can pay in your preferred currency, whether you\u2019re local or in the diaspora.",
    "how-page.step2.item1": "Easy add-to-cart and checkout flow",
    "how-page.step2.item2": "Secure payments with Stripe",
    "how-page.step2.item3": "Pay in your local currency",
    "how-page.step3.body":
      "Never wonder where your order is. Get real-time tracking updates from the moment your seller confirms to final delivery at your doorstep.",
    "how-page.step3.item1": "Real-time order tracking dashboard",
    "how-page.step3.item2": "Push notifications for status updates",
    "how-page.step3.item3": "Direct contact with your seller",
    "how-page.step4.body":
      "Enjoy your authentic African products delivered fresh to your door. Every package is handled with care to ensure quality from the source to your table.",
    "how-page.step4.item1": "Freshness guaranteed on all perishables",
    "how-page.step4.item2": "Carefully packaged for safe delivery",
    "how-page.step4.item3": "Easy returns if anything is wrong",
    "how-page.cta-title": "Ready to get started?",
    "how-page.cta-body":
      "Join thousands of customers getting authentic African food delivered.",
    "how-page.cta-button": "Start for free",
  },

  pcm: {
    "nav.shops": "Shops",
    "nav.how-it-works": "How e take work",
    "nav.login": "Login",
    "nav.start-free": "Start for free",

    "hero.title": "Real African Food, We Deliver Anywhere",
    "hero.body":
      "Buy your favourite African food, pay well well, and track your delivery for real time. We dey give you the best for real time",
    "hero.start-free": "Start for free",
    "hero.watch-video": "Watch video",

    "how.title": "How e take work",
    "how.subtitle": "We give you the best experience for authentic African products",
    "how.step1.title": "Find am",
    "how.step1.body": "Look for authentic African products",
    "how.step2.title": "Order & Pay",
    "how.step2.body": "Quick checkout with safe payment",
    "how.step3.title": "Track am live",
    "how.step3.body": "See your order for real-time.",
    "how.step4.title": "Receive",
    "how.step4.body": "We deliver am fresh to your door",

    "social.headline":
      "People wey dey diaspora like you dey use am to order products for Africa.",

    "community.title": "Our Community",
    "community.subtitle": "We love to connect you to the source",
    "community.item1": "Browse thousands of authentic products",
    "community.item2": "Shop with confidence",
    "community.item3": "Feel connected",
    "community.item4": "Every seller don verify",
    "community.item5": "Safe checkout with full buyer protection",
    "community.item6": "Track your order from the seller hands to your door.",
    "community.cta": "Start now",

    "footer.newsletter":
      "You no sure where to start? Sign up to receive our newsletter. free guide to get cheaper African products delivered to your doorstep.",
    "footer.email-placeholder": "Your email",
    "footer.sign-up": "Sign up",
    "footer.shop-title": "Shop / Marketplace",
    "footer.company-title": "Company",
    "footer.vendors-title": "Vendors",
    "footer.connect": "Connect",
    "footer.support-title": "Support",
    "footer.terms": "Terms",
    "footer.privacy": "Privacy policy",

    "shops.title": "Browse African Markets",
    "shops.subtitle":
      "Find authentic products from verified sellers across the continent \u2014 from fresh food to traditional pantry goods.",
    "shops.cta-title": "You want sell for Deni?",
    "shops.cta-body":
      "Join hundreds of vendors wey dey reach customers across the diaspora.",
    "shops.cta-button": "Become a Vendor",
    "shops.cat1.title": "Fresh Produce",
    "shops.cat1.desc":
      "Farm-fresh fruits, vegetables, and herbs from local growers",
    "shops.cat2.title": "Grains & Staples",
    "shops.cat2.desc":
      "Rice, yam, garri, beans, and other everyday food",
    "shops.cat3.title": "Spices & Seasonings",
    "shops.cat3.desc":
      "Real African blends, dried peppers, and traditional flavorings",
    "shops.cat4.title": "Seafood & Proteins",
    "shops.cat4.desc":
      "Dried fish, stockfish, crayfish, and premium cuts",
    "shops.cat5.title": "Snacks & Treats",
    "shops.cat5.desc":
      "Traditional snacks, chin chin, puff puff mixes, and more",
    "shops.cat6.title": "Beverages",
    "shops.cat6.desc":
      "Zobo mixes, sobo ingredients, palm wine, and specialty drinks",

    "how-page.title": "How Deni Take Work",
    "how-page.subtitle":
      "From find am to delivery \u2014 we make getting authentic African products easy and safe.",
    "how-page.step1.body":
      "Browse thousands of authentic African products from verified sellers. Use categories, search, and filters to find exactly wetin you need \u2014 from fresh food to traditional pantry goods.",
    "how-page.step1.item1":
      "Explore categories like fresh food, grains, spices, and more",
    "how-page.step1.item2": "Search by product name, seller, or region",
    "how-page.step1.item3": "Read product descriptions and reviews",
    "how-page.step2.body":
      "Add items to your cart and checkout safely. We support plenty payment methods so you fit pay for your preferred currency, whether you dey local or diaspora.",
    "how-page.step2.item1": "Easy add-to-cart and checkout flow",
    "how-page.step2.item2": "Secure payments with Stripe",
    "how-page.step2.item3": "Pay for your local currency",
    "how-page.step3.body":
      "Never wonder where your order dey. Get real-time tracking updates from the moment your seller confirm to final delivery for your doorstep.",
    "how-page.step3.item1": "Real-time order tracking dashboard",
    "how-page.step3.item2": "Push notifications for status updates",
    "how-page.step3.item3": "Direct contact with your seller",
    "how-page.step4.body":
      "Enjoy your authentic African products delivered fresh to your door. Every package dey handled with care to ensure quality from the source to your table.",
    "how-page.step4.item1": "Freshness guaranteed on all perishables",
    "how-page.step4.item2": "Carefully packaged for safe delivery",
    "how-page.step4.item3": "Easy returns if anything dey wrong",
    "how-page.cta-title": "You ready to start?",
    "how-page.cta-body":
      "Join thousands of customers wey dey get authentic African food delivered.",
    "how-page.cta-button": "Start for free",
  },

  sw: {
    "nav.shops": "Maduka",
    "nav.how-it-works": "Jinsi Inavyofanya Kazi",
    "nav.login": "Ingia",
    "nav.start-free": "Anza Bure",

    "hero.title": "Chakula Halisi cha Kiafrika, Kinatolewa Popote",
    "hero.body":
      "Nunua mboga zako unazozipenda za Kiafrika, lipa kwa usalama, na ufuatilie utoaji wako kwa wakati halisi. Tunatoa bora kwa wakati halisi",
    "hero.start-free": "Anza Bure",
    "hero.watch-video": "Tazama Video",

    "how.title": "Jinsi Inavyofanya Kazi",
    "how.subtitle": "Tunatoa uzoefu bora kwa bidhaa halisi za Kiafrika",
    "how.step1.title": "Gundua",
    "how.step1.body": "Vinjari bidhaa halisi za Kiafrika",
    "how.step2.title": "Agiza & Lipa",
    "how.step2.body": "Malipo ya haraka kwa usalama",
    "how.step3.title": "Fuatilia Moja kwa Moja",
    "how.step3.body": "Ona agizo lako kwa wakati halisi.",
    "how.step4.title": "Pokea",
    "how.step4.body": "Imetolewa ikiwa mbichi mlangoni mwako",

    "social.headline":
      "Inatumiwa na Waafrika waliotawanyika kama wewe kuagiza bidhaa Afrika.",

    "community.title": "Jumuiya Yetu",
    "community.subtitle": "Tunapenda kukuunganisha na chanzo",
    "community.item1": "Vinjari maelfu ya bidhaa halisi",
    "community.item2": "Nunua kwa imani",
    "community.item3": "Jisikie umeunganishwa",
    "community.item4": "Kila muuzaji amethibitishwa",
    "community.item5": "Malipo salama na ulinzi kamili wa mnunuzi",
    "community.item6":
      "Fuatilia agizo lako kutoka kwa fundi hadi mlangoni mwako.",
    "community.cta": "Anza Sasa",

    "footer.newsletter":
      "Hujui pa kuanzia? Jisajili kupokea jarida letu. Mwongozo wa bure wa kupata bidhaa za bei nafuu za Kiafrika zikifika mlangoni mwako.",
    "footer.email-placeholder": "Barua pepe yako",
    "footer.sign-up": "Jisajili",
    "footer.shop-title": "Duka / Soko",
    "footer.company-title": "Kampuni",
    "footer.vendors-title": "Wauzaji",
    "footer.connect": "Unganisha",
    "footer.support-title": "Msaada",
    "footer.terms": "Masharti",
    "footer.privacy": "Sera ya faragha",

    "shops.title": "Vinjari Masoko ya Kiafrika",
    "shops.subtitle":
      "Gundua bidhaa halisi kutoka kwa wauzaji waliothibitishwa kote barani \u2014 kutoka mazao safi hadi vyakula vya kawaida.",
    "shops.cta-title": "Unataka kuuza kwenye Deni?",
    "shops.cta-body":
      "Jiunge na mamia ya wauzaji wanaowafikia wateja kote ulimwenguni.",
    "shops.cta-button": "Kuwa Muuzaji",
    "shops.cat1.title": "Mazao Safi",
    "shops.cat1.desc":
      "Matunda, mboga mboga, na mimea safi kutoka kwa wakulima wa ndani",
    "shops.cat2.title": "Nafaka & Vyakula vya Msingi",
    "shops.cat2.desc":
      "Wali, viazi vikuu, garri, maharagwe, na vitu vingine vya kila siku",
    "shops.cat3.title": "Viungo & Vitoweo",
    "shops.cat3.desc":
      "Mchanganyiko halisi, pilipili kavu, na vitoweo vya kitamaduni",
    "shops.cat4.title": "Samaki & Protini",
    "shops.cat4.desc":
      "Samaki wakavu, stockfish, kamba, na nyama bora",
    "shops.cat5.title": "Vitafunio",
    "shops.cat5.desc":
      "Vitafunio vya kitamaduni, chin chin, mchanganyiko wa puff puff, na zaidi",
    "shops.cat6.title": "Vinywaji",
    "shops.cat6.desc":
      "Mchanganyiko wa zobo, viungo vya sobo, mvinyo wa tende, na vinywaji maalum",

    "how-page.title": "Jinsi Deni Inavyofanya Kazi",
    "how-page.subtitle":
      "Kutoka ugunduzi hadi utoaji \u2014 tunafanya kupata bidhaa halisi za Kiafrika kuwa rahisi na salama.",
    "how-page.step1.body":
      "Vinjari maelfu ya bidhaa halisi za Kiafrika kutoka kwa wauzaji waliothibitishwa. Tumia kategoria, utaftaji, na vichujio kupata hasa kile unachohitaji \u2014 kutoka mazao safi hadi vyakula vya kawaida.",
    "how-page.step1.item1":
      "Gundua kategoria kama mazao safi, nafaka, viungo, na zaidi",
    "how-page.step1.item2": "Tafuta kwa jina la bidhaa, muuzaji, au eneo",
    "how-page.step1.item3": "Soma maelezo ya bidhaa na hakiki",
    "how-page.step2.body":
      "Ongeza bidhaa kwenye gari lako na ulipe kwa usalama. Tunaunga mkono njia nyingi za malipo ili ulipe kwa sarafu unayopendelea, iwe uko ndani au nje ya nchi.",
    "how-page.step2.item1": "Mtiririko rahisi wa kuongeza na kulipa",
    "how-page.step2.item2": "Malipo salama kwa kutumia Stripe",
    "how-page.step2.item3": "Lipa kwa sarafu yako ya ndani",
    "how-page.step3.body":
      "Usiwahi kujiuliza agizo lako liko wapi. Pata taarifa za ufuatiliaji wa wakati halisi tangu muuzaji athibitishe hadi utoaji wa mwisho mlangoni mwako.",
    "how-page.step3.item1": "Dashibodi ya ufuatiliaji wa wakati halisi",
    "how-page.step3.item2": "Arifa za kusukuma kwa sasisho la hali",
    "how-page.step3.item3": "Mawasiliano ya moja kwa moja na muuzaji wako",
    "how-page.step4.body":
      "Furahia bidhaa zako halisi za Kiafrika zikifika ikiwa mbichi mlangoni mwako. Kila kifurushi kinashughulikiwa kwa uangalifu kuhakikisha ubora kutoka chanzo hadi meza yako.",
    "how-page.step4.item1": "Uhakika wa ubora kwa vyakula vyote",
    "how-page.step4.item2": "Kimefungwa kwa uangalifu kwa utoaji salama",
    "how-page.step4.item3": "Kurudisha kwa urahisi ikiwa kuna tatizo",
    "how-page.cta-title": "Uko tayari kuanza?",
    "how-page.cta-body":
      "Jiunge na maelfu ya wateja wanaopata chakula halisi cha Kiafrika wakifikishwa.",
    "how-page.cta-button": "Anza Bure",
  },
};
