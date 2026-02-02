
const en = {
  paywall: {
    insufficient: "Out of points. Subscribe to keep using the stylist.",
    spendFailed: "We couldn't deduct points. Please subscribe or try again later."
  },
  auth: {
    loginFailedEmail: "Could not sign in with email. Please try again later."
  },
  header: {
    titlePart1: "Virtual",
    titlePart2: "Stylist",
    subtitle: "What to wear? Solved.",
    startOver: "Start Over"
  },
  landing: {
    hello: "HELLO!",
    header: {
      profile: "Profile",
      referral: "Referral",
      referralUnavailable: "Referral program coming soon",
      homeAria: "Virtual Stylist home",
      logoAlt: "Virtual Stylist logo",
      primaryNavAria: "Primary navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      guest: "Guest",
      pointsLabel: "{{points}} pts",
      pointsUnknown: "Points pending",
      referralActive: "Referral active",
      referralPending: "Referral pending"
    },
    juliana: {
      name: "I'm Juliana",
      title: "Fashion Stylist »»",
      bio: "I'm a fashion stylist who believes that everyone has a unique style that can be expressed through fashion.",
      cta: "Find Your Style"
    },
    features: {
      title: "Elevate Your Style",
      subtitle: "Everything you need to look your best, powered by advanced AI.",
      ai: { title: "AI Personal Stylist", desc: "Get instant outfit recommendations based on your uploaded items." },
      mix: { title: "Mix & Match", desc: "Create stunning combinations from your existing wardrobe." },
      trends: { title: "Trend Analysis", desc: "Stay ahead of the curve with real-time fashion trend insights." },
      chat: { title: "Expert Advice", desc: "Chat with our AI fashion expert for personalized tips." },
      local: { title: "Shop Local", desc: "Find nearby stores carrying the items you love." },
      closet: { title: "Digital Closet", desc: "Organize and visualize your wardrobe digitally." }
    },
    restore: {
      emailRequired: "Enter your email to restore your account.",
      invalidEmail: "Enter a valid email address (example: you@example.com).",
      failed: "We couldn't restore your account. Please try again later.",
      emailPlaceholder: "you@example.com",
      namePlaceholder: "Optional name",
      action: "Restore",
      loading: "..."
    },
    signup: {
      intro: "New user? Sign up to get points instantly",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "Referral code (optional)",
      emailRequired: "Enter your email to get points.",
      invalidEmail: "Enter a valid email address (example: you@example.com).",
      failed: "Signup is unavailable right now. Please try again later.",
      submit: "Sign up and get points",
      loading: "...",
      hint: "Signup and welcome points are credited instantly, and referrals reward you both."
    },
    profileSection: {
      title: "Complete your profile and claim your points now",
      subtitle: "Enter your name, email, and referral code (if any) to get signup and welcome rewards instantly."
    },
    cta: {
      ariaLabel: "Get started with Virtual Stylist"
    },
    profileForm: {
      eyebrow: "Customer profile",
      description: "Save your name, email, and referral code to receive your points instantly.",
      save: "Save details",
      saving: "Saving...",
      nameLabel: "Name",
      emailLabel: "Email",
      referralLabel: "Referral code (to claim your friend's points)",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "Example: ABC12345",
      invalidEmail: "Enter a valid email address before saving.",
      rewardSignup: "Signup + welcome reward",
      rewardReferral: "Referral activation grants instant points",
      saved: "Saved and points issued 🎉",
      errorFallback: "We couldn't save your details. Please try again."
    },
    loyalty: {
      eyebrow: "Loyalty overview",
      title: "Points & referral",
      profileFallback: "Your profile",
      emailFallback: "No email yet",
      balance: "Balance",
      monthlyPoints: "Monthly points",
      signup: "Signup",
      welcomePackage: "Welcome package",
      awarded: "Awarded",
      pending: "Pending",
      referralLink: "Referral link",
      collectPointsHint: "Collect points by signing up",
      bothEarn: "Both referrer and friend earn {{points}} pts",
      copyLink: "Copy link",
      linkCopied: "Link copied",
      referralCodePending: "Referral code pending",
      qrAlt: "Referral QR code"
    }
  },
  profilePage: {
    referralQrAlt: "Referral QR code for your invite link",
    savedOutfitAlt: "Saved outfit: {{title}}",
    savedOutfitAltFallback: "Saved outfit {{index}}"
  },
  uploader: {
    title: "Upload Your Clothing Items",
    subtitle: "Have items you don't know how to style? Upload their photos, and our AI stylist will create complete outfits for you.",
    cta: "Click to upload",
    drop: "or drag and drop",
    info: "PNG, JPG, WEBP (you can select multiple files)",
    invalidType: "Please upload valid image files."
  },
  main: {
    yourItem: "Your Item",
    yourCollection: "Your Collection",
    addItem: "Add Item",
    removeItem: "Remove Item",
    selectItemPrompt: "Please select an item from your collection to start styling.",
    combinePrompt: "Select 2 or more items from your collection to find matching outfits.",
    uploadNew: "Upload New Item",
    generate: "Generate Outfits",
    combine: "Find Matches",
    styling: "Styling...",
    combining: "Finding Matches...",
    aiSuggestions: "AI Outfit Suggestions",
    combinationSuggestions: "AI Combination Suggestions",
    suggestedAccessory: "Suggested Accessory",
    mode: {
      single: "Style Single Item",
      combine: "Combine Collection"
    },
    loading: {
      analyzing: "Analyzing your items...",
      messages: [
        "Considering color palettes...",
        "Matching patterns and textures...",
        "Crafting the perfect silhouette...",
        "Finding the ideal accessory...",
        "Consulting the latest trends...",
        "Unleashing our fashion creativity..."
      ]
    },
    error: {
      title: "Oh no!",
      editFailed: "Failed to edit image for {{title}}. Please try again.",
      minTwoItems: "Please select at least two items to combine."
    }
  },
  trends: {
    button: "Analyze Trends",
    loading: "Analyzing trends...",
    modalTitle: "Current Trends",
    sources: "Sources",
    close: "Close trends dialog"
  },
  chat: {
    title: "Fashion Chat",
    welcome: "Hi! I'm your AI fashion assistant. Ask me anything about styling or trends!",
    placeholder: "Ask a fashion question...",
    askingAbout: "Asking about:",
    open: "Open chat",
    close: "Close chat"
  },
  bodyShape: {
    title: "Your Body Shape",
    'apple': { name: "Apple", description: "Wider torso, broader shoulders, and a fuller bust and waist." },
    'pear': { name: "Pear", description: "Wider hips and thighs with a more defined waist and narrower shoulders." },
    'hourglass': { name: "Hourglass", description: "Balanced bust and hips with a clearly defined, narrower waist." },
    'rectangle': { name: "Rectangle", description: "Fairly uniform measurements for shoulders, bust, waist, and hips." },
    'inverted_triangle': { name: "Inverted Triangle", description: "Broader shoulders and bust that narrow down to the hips." }
  },
  styleSelector: {
    label: "Choose 1-4 styles",
    selectionCount: "{{selected}}/{{max}} selected"
  },
  styleProfile: {
    title: "Your Style Profile",
    description: "Like or dislike outfits to teach the AI your taste. Your profile will be used to generate more personalized results.",
    clear: "Clear Profile",
    empty: "Start rating outfits to build your profile!"
  },
  outfitCard: {
    editLabel: "Edit this look:",
    editPlaceholder: "e.g., add a blue scarf",
    apply: "Apply",
    applying: "Applying...",
    cancel: "Cancel",
    edit: "Edit",
    like: "Like",
    dislike: "Dislike",
    share: "Share",
    copied: "Copied!",
    failed: "Failed",
    editError: "Editing failed. Please try a different prompt.",
    bodyShapeTipTitle: "Why this works for you:",
    findNearby: "Find Nearby",
    finding: "Finding...",
    save: "Save",
    unsave: "Unsave"
  },
  storeLocator: {
    title: "Stores Near You",
    subtitle: "Showing results for '{{accessory}}'",
    empty: "Sorry, we couldn't find any specific stores nearby. Try a broader search on Google Maps.",
    error: "Could not fetch store locations. Please ensure you've granted location permissions and try again.",
    manualLocationPlaceholder: "Enter city or zip code",
    manualLocationLabel: "Search by city or zip code",
    manualSearch: "Search this location",
    buttonOpen: "Open in Maps",
    copy: "Copy link",
    copied: "Copied",
    close: "Close store locator"
  },
  rejectedCard: {
    title: "Style Rejected",
    subtitle: "Here's why this isn't a good match:"
  },
  styles: {
    'Casual': { name: 'Casual', description: 'Comfortable, everyday wear. Think jeans, t-shirts, and sneakers.' },
    'Business': { name: 'Business', description: 'Professional and office-appropriate. Includes suits, blouses, and formal trousers.' },
    'Night Out': { name: 'Night Out', description: 'Dressy and stylish for evenings. Features cocktail dresses, heels, and statement pieces.' },
    'Athleisure': { name: 'Athleisure', description: 'Sporty meets casual. Combines athletic wear like leggings and hoodies with everyday fashion.' },
    'Bohemian': { name: 'Bohemian', description: 'Free-spirited and artistic. Characterized by flowy fabrics, earthy tones, and eclectic patterns.' },
    'Formal': { name: 'Formal', description: 'Elegant attire for special occasions. Think gowns, tuxedos, and fine jewelry.' },
    'Streetwear': { name: 'Streetwear', description: 'Urban and modern fashion. Rooted in skate and hip-hop culture, with graphic tees and sneakers.' },
    'Minimalist': { name: 'Minimalist', description: 'Simple, clean lines and a neutral color palette. Focuses on quality and timeless shapes.' },
    'Vintage': { name: 'Vintage', description: 'Inspired by fashion from past eras. Features retro prints, classic silhouettes, and nostalgic accessories.' }
  },
  share: {
    title: "My Virtual Stylist Outfit",
    text: "Styled by Virtual Stylist AI."
  },
  footer: {
    poweredBy: "Powered by Google Gemini",
    copyright: "Application copyrights by ALMSTKSHF Co 2026"
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System"
  }
};

const ar = {
  paywall: {
    insufficient: "رصيد النقاط انتهى. اشترك للاستمرار في استخدام منسق الأزياء.",
    spendFailed: "تعذر خصم النقاط. يرجى الاشتراك أو المحاولة لاحقاً."
  },
  auth: {
    loginFailedEmail: "تعذر تسجيل الدخول بالبريد. حاول لاحقاً."
  },
  header: {
    titlePart1: "منسق الأزياء",
    titlePart2: "الافتراضي",
    subtitle: "وداعاً لحيرة اختيار الملابس.",
    startOver: "ابدأ من جديد"
  },
  landing: {
    hello: "مرحباً!",
    header: {
      profile: "الملف الشخصي",
      referral: "إحالة",
      referralUnavailable: "برنامج الإحالة قيد الإعداد",
      homeAria: "الصفحة الرئيسية لمنسق الأزياء الافتراضي",
      logoAlt: "شعار منسق الأزياء الافتراضي",
      primaryNavAria: "التنقل الرئيسي",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
      guest: "زائر",
      pointsLabel: "{{points}} نقطة",
      pointsUnknown: "النقاط قيد الانتظار",
      referralActive: "برنامج الإحالة جاهز",
      referralPending: "برنامج الإحالة قيد الانتظار"
    },
    juliana: {
      name: "أنا جوليانا",
      title: "خبيرة مظهر وأناقة »»",
      bio: "بصفتي خبيرة مظهر، أؤمن أن لكل شخص بصمته الفريدة التي يعكسها أسلوبه في الملابس.",
      cta: "اكتشف أسلوبك"
    },
    features: {
      title: "ارتقِ بأسلوبك",
      subtitle: "كل ما تحتاجه لتظهر بأفضل مظهر، بدعم من الذكاء الاصطناعي.",
      ai: { title: "مصفف شخصي ذكي", desc: "احصل على توصيات فورية للأزياء بناءً على قطعك." },
      mix: { title: "تنسيق ومطابقة", desc: "ابتكر تشكيلات مذهلة من خزانتك الحالية." },
      trends: { title: "تحليل الصيحات", desc: "ابقَ في الطليعة مع رؤى فورية لاتجاهات الموضة." },
      chat: { title: "نصيحة الخبراء", desc: "دردش مع خبير الأزياء الذكي للحصول على نصائح مخصصة." },
      local: { title: "تسوق محلياً", desc: "اعثر على متاجر قريبة تبيع القطع التي تحبها." },
      closet: { title: "خزانة رقمية", desc: "نظم وتخيل خزانتك رقمياً." }
    },
    restore: {
      emailRequired: "أدخل بريدك لاستعادة حسابك.",
      invalidEmail: "أدخل بريداً إلكترونياً صحيحاً (مثال: you@example.com).",
      failed: "تعذر استعادة الحساب. حاول لاحقاً.",
      emailPlaceholder: "you@example.com",
      namePlaceholder: "اسم اختياري",
      action: "استعادة",
      loading: "..."
    },
    signup: {
      intro: "مستخدم جديد؟ سجّل لتحصل على النقاط فوراً",
      namePlaceholder: "اسمك",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "كود إحالة (اختياري)",
      emailRequired: "أدخل بريدك للحصول على النقاط.",
      invalidEmail: "أدخل بريداً إلكترونياً صحيحاً (مثال: you@example.com).",
      failed: "تعذر التسجيل حالياً. حاول لاحقاً.",
      submit: "سجّل واحصل على النقاط",
      loading: "...",
      hint: "نقاط التسجيل + الترحيب تصلك فوراً، والإحالة تكافئكما معاً."
    },
    profileSection: {
      title: "أكمل ملفك الشخصي واحصل على نقاطك الآن",
      subtitle: "أدخل الاسم والبريد وكود الإحالة (إن وجد) لتحصل على مكافأة التسجيل والترحيب وتفعيل الإحالة فوراً."
    },
    cta: {
      ariaLabel: "ابدأ استخدام منسق الأزياء الافتراضي"
    },
    profileForm: {
      eyebrow: "ملف العميل",
      description: "احفظ الاسم والبريد وكود الإحالة لتحصل على نقاطك فوراً.",
      save: "حفظ البيانات",
      saving: "جاري الحفظ...",
      nameLabel: "الاسم",
      emailLabel: "البريد الإلكتروني",
      referralLabel: "كود الإحالة (للاستفادة من نقاط صديقك)",
      namePlaceholder: "اكتب اسمك",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "مثال: ABC12345",
      invalidEmail: "أدخل بريداً إلكترونياً صحيحاً قبل الحفظ.",
      rewardSignup: "مكافأة التسجيل + الترحيب",
      rewardReferral: "تفعيل الإحالة يمنحك نقاطاً فورية",
      saved: "تم الحفظ وإصدار النقاط 🎉",
      errorFallback: "لم نتمكن من حفظ بياناتك. حاول مرة أخرى."
    },
    loyalty: {
      eyebrow: "نظرة عامة على الولاء",
      title: "النقاط والإحالة",
      profileFallback: "ملفك الشخصي",
      emailFallback: "لا يوجد بريد بعد",
      balance: "الرصيد",
      monthlyPoints: "النقاط الشهرية",
      signup: "التسجيل",
      welcomePackage: "باقة الترحيب",
      awarded: "تم منحها",
      pending: "قيد الانتظار",
      referralLink: "رابط الإحالة",
      collectPointsHint: "اجمع النقاط عبر التسجيل",
      bothEarn: "أنت وصديقك تكسبان {{points}} نقطة",
      copyLink: "نسخ الرابط",
      linkCopied: "تم نسخ الرابط",
      referralCodePending: "كود الإحالة قيد التجهيز",
      qrAlt: "رمز QR للإحالة"
    }
  },
  profilePage: {
    referralQrAlt: "رمز QR لرابط الإحالة الخاص بك",
    savedOutfitAlt: "إطلالة محفوظة: {{title}}",
    savedOutfitAltFallback: "إطلالة محفوظة رقم {{index}}"
  },
  uploader: {
    title: "قم بتحميل قطع ملابسك",
    subtitle: "هل لديك قطع ملابس تحتار في تنسيقها؟ ارفع صورها هنا، وسأقوم بابتكار إطلالات كاملة ومتناسقة لك.",
    cta: "اضغط للتحميل",
    drop: "أو اسحب الملفات هنا",
    info: "PNG, JPG, WEBP (يمكنك اختيار عدة صور)",
    invalidType: "يرجى تحميل ملفات صور صالحة."
  },
  main: {
    yourItem: "القطعة المختارة",
    yourCollection: "خزانتك",
    addItem: "إضافة قطعة",
    removeItem: "حذف",
    selectItemPrompt: "اختر قطعة من خزانتك لتبدأ رحلة التنسيق.",
    combinePrompt: "حدد قطعتين أو أكثر لنجد لك التنسيق الأمثل بينهم.",
    uploadNew: "تحميل المزيد",
    generate: "ابتكار إطلالات",
    combine: "تنسيق المجموعة",
    styling: "جاري التصميم...",
    combining: "جاري التنسيق...",
    aiSuggestions: "اقتراحات الذكاء الاصطناعي",
    combinationSuggestions: "تنسيقات مقترحة من مجموعتك",
    suggestedAccessory: "إكسسوار يكمل إطلالتك",
    mode: {
      single: "تنسيق قطعة واحدة",
      combine: "تنسيق المجموعة"
    },
    loading: {
      analyzing: "جاري تحليل القطع...",
      messages: [
        "نحلل تناغم الألوان...",
        "نطابق الخامات والنقوش...",
        "نبحث عن أفضل القصات...",
        "نختار الإكسسوار الأمثل...",
        "نراجع أحدث صيحات الموضة...",
        "نضع لمسات الأناقة الأخيرة..."
      ]
    },
    error: {
      title: "عذراً!",
      editFailed: "تعذر تعديل صورة {{title}}. يرجى المحاولة مجدداً.",
      minTwoItems: "يجب اختيار قطعتين على الأقل للتنسيق."
    }
  },
  trends: {
    button: "تحليل الصيحات",
    loading: "نبحث في الصيحات...",
    modalTitle: "أحدث صيحات الموضة",
    sources: "المصادر",
    close: "إغلاق نافذة الصيحات"
  },
  chat: {
    title: "مستشارك للأزياء",
    welcome: "أهلاً بك! أنا مساعدك الشخصي للأناقة. اسألني عن أي نصيحة أو صيحة تهمك.",
    placeholder: "اكتب سؤالك هنا...",
    askingAbout: "بخصوص:",
    open: "افتح الدردشة",
    close: "إغلاق الدردشة"
  },
  bodyShape: {
    title: "شكل الجسم",
    'apple': { name: "التفاحة", description: "جذع ممتلئ، أكتاف عريضة، مع وسط غير محدد." },
    'pear': { name: "الكمثرى", description: "أرداف وفخذين أعرض من الأكتاف، مع خصر محدد." },
    'hourglass': { name: "الساعة الرملية", description: "توازن بين الأكتاف والأرداف، مع خصر محدد جداً." },
    'rectangle': { name: "المستطيل", description: "قياسات متقاربة للأكتاف والخصر والأرداف." },
    'inverted_triangle': { name: "المثلث المقلوب", description: "أكتاف عريضة تضيق تدريجياً نحو الأرداف." }
  },
  styleSelector: {
    label: "اختر من 1 إلى 4 أنماط",
    selectionCount: "تم اختيار {{selected}}/{{max}}"
  },
  styleProfile: {
    title: "تفضيلاتك الشخصية",
    description: "تفاعل مع الإطلالات (إعجاب/عدم إعجاب) ليتعلم الذكاء الاصطناعي ذوقك ويقدم لك نتائج أدق مستقبلاً.",
    clear: "مسح التفضيلات",
    empty: "ابدأ بتقييم الإطلالات لبناء ملفك الشخصي!"
  },
  outfitCard: {
    editLabel: "تعديل هذه الإطلالة:",
    editPlaceholder: "مثال: أضيفي وشاحاً حريرياً",
    apply: "نفذ",
    applying: "جاري التنفيذ...",
    cancel: "إلغاء",
    edit: "تعديل",
    like: "أعجبني",
    dislike: "لم يعجبني",
    share: "مشاركة",
    copied: "تم النسخ!",
    failed: "فشل",
    editError: "لم نتمكن من التعديل. جرب صياغة أخرى.",
    bodyShapeTipTitle: "لماذا تناسبك هذه الإطلالة:",
    findNearby: "متاجر قريبة",
    finding: "بحث...",
    save: "حفظ",
    unsave: "إلغاء الحفظ"
  },
  storeLocator: {
    title: "متاجر قريبة توفر هذا",
    subtitle: "نتائج البحث عن: '{{accessory}}'",
    empty: "عذراً، لم نجد متاجر محددة بالقرب منك. جرب البحث العام في خرائط جوجل.",
    error: "تعذر تحديد الموقع. تأكد من تفعيل خدمة الموقع وحاول مرة أخرى.",
    manualLocationPlaceholder: "أدخل اسم المدينة أو الحي",
    manualLocationLabel: "ابحث بالمدينة أو الرمز البريدي",
    manualSearch: "بحث عن هذا الموقع",
    buttonOpen: "فتح في الخرائط",
    copy: "نسخ الرابط",
    copied: "تم النسخ",
    close: "إغلاق محدد المتاجر"
  },
  rejectedCard: {
    title: "تنسيق غير مناسب",
    subtitle: "لماذا لا نوصي بهذا الخيار:"
  },
  styles: {
    'Casual': { name: 'كاجوال', description: 'مريح وعملي للاستخدام اليومي. جينز، تيشيرت، أحذية رياضية.' },
    'Business': { name: 'رسمي للعمل', description: 'احترافي ومناسب لبيئة العمل. بدلات، قمصان، بناطيل قماشية.' },
    'Night Out': { name: 'سهرة', description: 'أنيق وجذاب للمناسبات المسائية. فساتين، كعب عالي، إكسسوارات لامعة.' },
    'Athleisure': { name: 'رياضي أنيق', description: 'الراحة الرياضية بلمسة عصرية. ليقنز، هوديز منسقة بشكل أنيق.' },
    'Bohemian': { name: 'بوهيمي', description: 'حر وفني. أقمشة انسيابية، ألوان ترابية، نقوش مميزة.' },
    'Formal': { name: 'رسمي جداً', description: 'فخامة للمناسبات الكبرى. فساتين سهرة، مجوهرات راقية.' },
    'Streetwear': { name: 'ستريت وير', description: 'عصري وشبابي. مستوحى من ثقافة الشارع، ملابس واسعة وأحذية مميزة.' },
    'Minimalist': { name: 'مينيمال (بسيط)', description: 'أناقة البساطة. ألوان محايدة، قصات نظيفة، جودة عالية.' },
    'Vintage': { name: 'فينتج (كلاسيكي)', description: 'سحر الماضي. قطع مستوحاة من حقب زمنية سابقة بلمسة حنين.' }
  },
  share: {
    title: "إطلالتي من المنسق الافتراضي",
    text: "تم تنسيقها بواسطة الذكاء الاصطناعي."
  },
  footer: {
    poweredBy: "مدعوم بواسطة Google Gemini",
    copyright: "حقوق تطبيق ALMSTKSHF Co 2026"
  },
  theme: {
    light: "فاتح",
    dark: "داكن",
    system: "النظام"
  }
};

const fr = {
  paywall: {
    insufficient: "Plus de points. Abonnez-vous pour continuer à utiliser le styliste.",
    spendFailed: "Impossible de débiter les points. Veuillez vous abonner ou réessayer plus tard."
  },
  auth: {
    loginFailedEmail: "Connexion par e-mail impossible. Veuillez réessayer plus tard."
  },
  header: {
    titlePart1: "Styliste",
    titlePart2: "Virtuel",
    subtitle: "Quoi porter ? Résolu.",
    startOver: "Recommencer"
  },
  landing: {
    hello: "SALUT!",
    header: {
      profile: "Profil",
      referral: "Parrainage",
      referralUnavailable: "Programme de parrainage bientôt disponible",
      homeAria: "Accueil Virtual Stylist",
      logoAlt: "Logo Virtual Stylist",
      primaryNavAria: "Navigation principale",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      guest: "Invité",
      pointsLabel: "{{points}} pts",
      pointsUnknown: "Points en attente",
      referralActive: "Parrainage actif",
      referralPending: "Parrainage en attente"
    },
    juliana: {
      name: "Je suis Juliana",
      title: "Styliste de mode »»",
      bio: "Je suis une styliste de mode qui croit que chacun a un style unique qui peut être exprimé à travers la mode.",
      cta: "Trouvez votre style"
    },
    features: {
      title: "Élevez votre style",
      subtitle: "Tout ce dont vous avez besoin pour être au top, propulsé par l'IA.",
      ai: { title: "Styliste personnel IA", desc: "Obtenez des recommandations de tenues instantanées." },
      mix: { title: "Mix & Match", desc: "Créez des combinaisons étonnantes à partir de votre garde-robe." },
      trends: { title: "Analyse des tendances", desc: "Restez à la pointe avec des aperçus de la mode en temps réel." },
      chat: { title: "Conseils d'experts", desc: "Discutez avec notre expert mode IA pour des conseils personnalisés." },
      local: { title: "Achetez local", desc: "Trouvez des magasins à proximité vendant les articles que vous aimez." },
      closet: { title: "Garde-robe numérique", desc: "Organisez et visualisez votre garde-robe numériquement." }
    },
    restore: {
      emailRequired: "Saisissez votre e-mail pour restaurer votre compte.",
      invalidEmail: "Saisissez une adresse e-mail valide (exemple : you@example.com).",
      failed: "Impossible de restaurer le compte. Veuillez réessayer plus tard.",
      emailPlaceholder: "you@example.com",
      namePlaceholder: "Nom facultatif",
      action: "Restaurer",
      loading: "..."
    },
    signup: {
      intro: "Nouveau ? Inscrivez-vous pour recevoir des points immédiatement",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "Code parrain (facultatif)",
      emailRequired: "Saisissez votre e-mail pour recevoir des points.",
      invalidEmail: "Saisissez une adresse e-mail valide (exemple : you@example.com).",
      failed: "Inscription indisponible pour le moment. Réessayez plus tard.",
      submit: "S'inscrire et recevoir des points",
      loading: "...",
      hint: "Les points d'inscription et de bienvenue sont crédités instantanément, et le parrainage récompense les deux."
    },
    profileSection: {
      title: "Complétez votre profil et obtenez vos points maintenant",
      subtitle: "Entrez votre nom, e-mail et code de parrainage (si disponible) pour recevoir immédiatement les bonus d'inscription et de bienvenue."
    },
    cta: {
      ariaLabel: "Commencer avec Virtual Stylist"
    },
    profileForm: {
      eyebrow: "Profil client",
      description: "Enregistrez votre nom, e-mail et code de parrainage pour recevoir vos points immédiatement.",
      save: "Enregistrer",
      saving: "Enregistrement...",
      nameLabel: "Nom",
      emailLabel: "E-mail",
      referralLabel: "Code de parrainage (pour réclamer les points de votre ami)",
      namePlaceholder: "Entrez votre nom",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "Exemple : ABC12345",
      invalidEmail: "Saisissez une adresse e-mail valide avant l'enregistrement.",
      rewardSignup: "Bonus inscription + bienvenue",
      rewardReferral: "L'activation du parrainage accorde des points immédiats",
      saved: "Enregistré et points attribués 🎉",
      errorFallback: "Impossible d'enregistrer vos données. Veuillez réessayer."
    },
    loyalty: {
      eyebrow: "Aperçu fidélité",
      title: "Points et parrainage",
      profileFallback: "Votre profil",
      emailFallback: "Pas encore d'e-mail",
      balance: "Solde",
      monthlyPoints: "Points mensuels",
      signup: "Inscription",
      welcomePackage: "Pack de bienvenue",
      awarded: "Attribué",
      pending: "En attente",
      referralLink: "Lien de parrainage",
      collectPointsHint: "Cumulez des points en vous inscrivant",
      bothEarn: "Le parrain et l'ami reçoivent {{points}} pts",
      copyLink: "Copier le lien",
      linkCopied: "Lien copié",
      referralCodePending: "Code de parrainage en attente",
      qrAlt: "Code QR de parrainage"
    }
  },
  profilePage: {
    referralQrAlt: "Code QR de votre lien de parrainage",
    savedOutfitAlt: "Tenue enregistrée : {{title}}",
    savedOutfitAltFallback: "Tenue enregistrée {{index}}"
  },
  uploader: {
    title: "Téléchargez vos vêtements",
    subtitle: "Vous avez des vêtements que vous ne savez pas comment styliser ? Téléchargez leurs photos et notre styliste IA créera des tenues complètes pour vous.",
    cta: "Cliquez pour télécharger",
    drop: "ou glissez-déposez",
    info: "PNG, JPG, WEBP (vous pouvez sélectionner plusieurs fichiers)",
    invalidType: "Veuillez télécharger des fichiers image valides."
  },
  main: {
    yourItem: "Votre article",
    yourCollection: "Votre collection",
    addItem: "Ajouter un article",
    removeItem: "Supprimer l'article",
    selectItemPrompt: "Veuillez sélectionner un article de votre collection pour commencer la stylisation.",
    combinePrompt: "Sélectionnez 2 articles ou plus de votre collection pour trouver des tenues assorties.",
    uploadNew: "Télécharger un nouvel article",
    generate: "Générer des tenues",
    combine: "Trouver des assortiments",
    styling: "Stylisation...",
    combining: "Recherche d'assortiments...",
    aiSuggestions: "Suggestions de tenues par l'IA",
    combinationSuggestions: "Suggestions de combinaisons par l'IA",
    suggestedAccessory: "Accessoire suggéré",
    mode: {
      single: "Styliser un article",
      combine: "Combiner la collection"
    },
    loading: {
      analyzing: "Analyse de vos articles...",
      messages: [
        "Examen des palettes de couleurs...",
        "Association des motifs et textures...",
        "Création de la silhouette parfaite...",
        "Recherche de l'accessoire idéal...",
        "Consultation des dernières tendances...",
        "Libération de notre créativité mode..."
      ]
    },
    error: {
      title: "Oh non !",
      editFailed: "Échec de la modification de l'image pour {{title}}. Veuillez réessayer.",
      minTwoItems: "Veuillez sélectionner au moins deux articles à combiner."
    }
  },
  trends: {
    button: "Analyser les tendances",
    loading: "Analyse des tendances...",
    modalTitle: "Tendances actuelles",
    sources: "Sources",
    close: "Fermer la fenêtre des tendances"
  },
  chat: {
    title: "Chat Mode",
    welcome: "Bonjour ! Je suis votre assistant de mode IA. Demandez-moi n'importe quoi sur le style ou les tendances !",
    placeholder: "Posez une question sur la mode...",
    askingAbout: "Question sur :",
    open: "Ouvrir le chat",
    close: "Fermer le chat"
  },
  bodyShape: {
    title: "Votre morphologie",
    'apple': { name: "Pomme", description: "Torse plus large, épaules larges, et une poitrine et une taille plus pleines." },
    'pear': { name: "Poire", description: "Hanches et cuisses plus larges avec une taille plus définie et des épaules plus étroites." },
    'hourglass': { name: "Sablier", description: "Poitrine et hanches équilibrées avec une taille clairement définie et plus étroite." },
    'rectangle': { name: "Rectangle", description: "Mesures assez uniformes pour les épaules, la poitrine, la taille et les hanches." },
    'inverted_triangle': { name: "Triangle inversé", description: "Épaules et poitrine larges qui s'affinent jusqu'aux hanches." }
  },
  styleSelector: {
    label: "Choisissez 1-4 styles",
    selectionCount: "{{selected}}/{{max}} sélectionné(s)"
  },
  styleProfile: {
    title: "Votre profil de style",
    description: "Aimez ou n'aimez pas les tenues pour apprendre à l'IA vos goûts. Votre profil sera utilisé pour générer des résultats plus personnalisés.",
    clear: "Effacer le profil",
    empty: "Commencez à noter des tenues pour construire votre profil !"
  },
  outfitCard: {
    editLabel: "Modifier ce look :",
    editPlaceholder: "ex: ajouter une écharpe bleue",
    apply: "Appliquer",
    applying: "Application...",
    cancel: "Annuler",
    edit: "Modifier",
    like: "J'aime",
    dislike: "Je n'aime pas",
    share: "Partager",
    copied: "Copié !",
    failed: "Échec",
    editError: "La modification a échoué. Veuillez essayer une autre instruction.",
    bodyShapeTipTitle: "Pourquoi ça vous va :",
    findNearby: "Trouver à proximité",
    finding: "Recherche...",
    save: "Enregistrer",
    unsave: "Retirer"
  },
  storeLocator: {
    title: "Magasins près de chez vous",
    subtitle: "Affichage des résultats pour '{{accessory}}'",
    empty: "Désolé, nous n'avons pas pu trouver de magasins spécifiques à proximité. Essayez une recherche plus large sur Google Maps.",
    error: "Impossible de récupérer les emplacements des magasins. Veuillez vous assurer que vous avez accordé les autorisations de localisation et réessayez.",
    manualLocationPlaceholder: "Entrez la ville ou le code postal",
    manualLocationLabel: "Rechercher par ville ou code postal",
    manualSearch: "Rechercher cet emplacement",
    buttonOpen: "Ouvrir dans Maps",
    copy: "Copier le lien",
    copied: "Copié",
    close: "Fermer le localisateur de magasins"
  },
  rejectedCard: {
    title: "Style rejeté",
    subtitle: "Voici pourquoi ce n'est pas une bonne correspondance :"
  },
  styles: {
    'Casual': { name: 'Décontracté', description: 'Tenue confortable de tous les jours. Pensez jeans, t-shirts et baskets.' },
    'Business': { name: 'Professionnel', description: 'Professionnel et adapté au bureau. Comprend des costumes, des chemisiers et des pantalons formels.' },
    'Night Out': { name: 'Soirée', description: 'Habillé et élégant pour les soirées. Comprend des robes de cocktail, des talons et des pièces maîtresses.' },
    'Athleisure': { name: 'Athleisure', description: 'Le sportif rencontre le décontracté. Combine des vêtements de sport comme des leggings et des sweats à capuche avec la mode de tous les jours.' },
    'Bohemian': { name: 'Bohème', description: 'Esprit libre et artistique. Caractérisé par des tissus fluides, des tons terreux et des motifs éclectiques.' },
    'Formal': { name: 'Formel', description: 'Tenue élégante pour les occasions spéciales. Pensez robes de soirée, smokings et bijoux fins.' },
    'Streetwear': { name: 'Streetwear', description: 'Mode urbaine et moderne. Ancrée dans la culture du skate et du hip-hop, avec des t-shirts graphiques et des baskets.' },
    'Minimalist': { name: 'Minimaliste', description: 'Lignes simples et épurées et une palette de couleurs neutres. Se concentre sur la qualité et les formes intemporelles.' },
    'Vintage': { name: 'Vintage', description: 'Inspiré de la mode des époques passées. Comprend des imprimés rétro, des silhouettes classiques et des accessoires nostalgiques.' }
  },
  share: {
    title: "Ma tenue de Styliste Virtuel",
    text: "Stylisée par l'IA Styliste Virtuel."
  },
  footer: {
    poweredBy: "Propulsé par Google Gemini",
    copyright: "Droits d'application par ALMSTKSHF Co 2026"
  },
  theme: {
    light: "Clair",
    dark: "Sombre",
    system: "Système"
  }
};

const ru = {
  paywall: {
    insufficient: "Баллы закончились. Оформите подписку, чтобы продолжить пользоваться стилистом.",
    spendFailed: "Не удалось списать баллы. Подпишитесь или попробуйте позже."
  },
  auth: {
    loginFailedEmail: "Не удалось войти по email. Попробуйте позже."
  },
  header: {
    titlePart1: "Виртуальный",
    titlePart2: "Стилист",
    subtitle: "Что надеть? Решено.",
    startOver: "Начать сначала"
  },
  landing: {
    hello: "ПРИВЕТ!",
    header: {
      profile: "Профиль",
      referral: "Реферальная программа",
      referralUnavailable: "Реферальная программа скоро появится",
      homeAria: "Главная Virtual Stylist",
      logoAlt: "Логотип Virtual Stylist",
      primaryNavAria: "Основная навигация",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
      guest: "Гость",
      pointsLabel: "{{points}} баллов",
      pointsUnknown: "Баллы ожидают начисления",
      referralActive: "Реферал активен",
      referralPending: "Реферал в ожидании"
    },
    juliana: {
      name: "Я Джулиана",
      title: "Модный стилист »»",
      bio: "Я модный стилист, который верит, что у каждого есть уникальный стиль, который можно выразить через моду.",
      cta: "Найди свой стиль"
    },
    features: {
      title: "Поднимите свой стиль",
      subtitle: "Всё, что нужно для идеального образа, на базе передового ИИ.",
      ai: { title: "ИИ Персональный стилист", desc: "Мгновенные рекомендации образов на основе ваших вещей." },
      mix: { title: "Сочетай и комбинируй", desc: "Создавайте потрясающие комбинации из вашего гардероба." },
      trends: { title: "Анализ трендов", desc: "Будьте в курсе моды с анализом трендов в реальном времени." },
      chat: { title: "Советы эксперта", desc: "Общайтесь с нашим ИИ-экспертом для получения персональных советов." },
      local: { title: "Покупайте рядом", desc: "Находите ближайшие магазины с вещами, которые вам нравятся." },
      closet: { title: "Цифровой гардероб", desc: "Организуйте и визуализируйте свой гардероб в цифровом виде." }
    },
    restore: {
      emailRequired: "Введите e-mail для восстановления аккаунта.",
      invalidEmail: "Введите корректный e-mail (пример: you@example.com).",
      failed: "Не удалось восстановить аккаунт. Попробуйте позже.",
      emailPlaceholder: "you@example.com",
      namePlaceholder: "Имя (необязательно)",
      action: "Восстановить",
      loading: "..."
    },
    signup: {
      intro: "Новый пользователь? Зарегистрируйтесь и получите баллы сразу",
      namePlaceholder: "Ваше имя",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "Реферальный код (необязательно)",
      emailRequired: "Введите e-mail, чтобы получить баллы.",
      invalidEmail: "Введите корректный e-mail (пример: you@example.com).",
      failed: "Сейчас регистрация недоступна. Попробуйте позже.",
      submit: "Зарегистрироваться и получить баллы",
      loading: "...",
      hint: "Баллы за регистрацию и приветствие начисляются сразу, а реферал дает награду вам обоим."
    },
    profileSection: {
      title: "Заполните профиль и получите баллы сейчас",
      subtitle: "Введите имя, e-mail и реферальный код (если есть), чтобы сразу получить бонусы за регистрацию и приветствие."
    },
    cta: {
      ariaLabel: "Начать с Virtual Stylist"
    },
    profileForm: {
      eyebrow: "Профиль клиента",
      description: "Сохраните имя, e-mail и реферальный код, чтобы получить баллы мгновенно.",
      save: "Сохранить данные",
      saving: "Сохранение...",
      nameLabel: "Имя",
      emailLabel: "E-mail",
      referralLabel: "Реферальный код (чтобы получить баллы друга)",
      namePlaceholder: "Введите имя",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "Пример: ABC12345",
      invalidEmail: "Введите корректный e-mail перед сохранением.",
      rewardSignup: "Бонус за регистрацию + приветствие",
      rewardReferral: "Активация реферала дает мгновенные баллы",
      saved: "Сохранено, баллы начислены 🎉",
      errorFallback: "Не удалось сохранить данные. Попробуйте еще раз."
    },
    loyalty: {
      eyebrow: "Обзор лояльности",
      title: "Баллы и реферал",
      profileFallback: "Ваш профиль",
      emailFallback: "E-mail пока нет",
      balance: "Баланс",
      monthlyPoints: "Ежемесячные баллы",
      signup: "Регистрация",
      welcomePackage: "Приветственный пакет",
      awarded: "Начислено",
      pending: "В ожидании",
      referralLink: "Реферальная ссылка",
      collectPointsHint: "Получайте баллы за регистрацию",
      bothEarn: "Реферер и друг получают по {{points}} баллов",
      copyLink: "Копировать ссылку",
      linkCopied: "Ссылка скопирована",
      referralCodePending: "Реферальный код в ожидании",
      qrAlt: "QR-код реферала"
    }
  },
  profilePage: {
    referralQrAlt: "QR-код вашей реферальной ссылки",
    savedOutfitAlt: "Сохраненный образ: {{title}}",
    savedOutfitAltFallback: "Сохраненный образ {{index}}"
  },
  uploader: {
    title: "Загрузите ваши вещи",
    subtitle: "У вас есть вещи, которые вы не знаете, как стилизовать? Загрузите их фото, и наш ИИ-стилист создаст для вас полные образы.",
    cta: "Нажмите для загрузки",
    drop: "или перетащите",
    info: "PNG, JPG, WEBP (можно выбрать несколько файлов)",
    invalidType: "Пожалуйста, загрузите корректные изображения."
  },
  main: {
    yourItem: "Ваша вещь",
    yourCollection: "Ваша коллекция",
    addItem: "Добавить вещь",
    removeItem: "Удалить вещь",
    selectItemPrompt: "Пожалуйста, выберите вещь из вашей коллекции, чтобы начать стилизацию.",
    combinePrompt: "Выберите 2 или более вещей из вашей коллекции, чтобы найти подходящие образы.",
    uploadNew: "Загрузить новую вещь",
    generate: "Создать образы",
    combine: "Найти сочетания",
    styling: "Стилизация...",
    combining: "Поиск сочетаний...",
    aiSuggestions: "Предложения образов от ИИ",
    combinationSuggestions: "Предложения по сочетаниям от ИИ",
    suggestedAccessory: "Рекомендуемый аксессуар",
    mode: {
      single: "Стиль для одной вещи",
      combine: "Комбинировать коллекцию"
    },
    loading: {
      analyzing: "Анализ ваших вещей...",
      messages: [
        "Подбираем цветовую палитру...",
        "Сочетаем узоры и текстуры...",
        "Создаем идеальный силуэт...",
        "Ищем идеальный аксессуар...",
        "Изучаем последние тренды...",
        "Раскрываем наш модный потенциал..."
      ]
    },
    error: {
      title: "О нет!",
      editFailed: "Не удалось изменить изображение для {{title}}. Пожалуйста, попробуйте еще раз.",
      minTwoItems: "Пожалуйста, выберите как минимум две вещи для комбинирования."
    }
  },
  trends: {
    button: "Анализ трендов",
    loading: "Анализ трендов...",
    modalTitle: "Текущие тренды",
    sources: "Источники",
    close: "Закрыть окно трендов"
  },
  chat: {
    title: "Модный чат",
    welcome: "Привет! Я ваш ИИ-помощник по моде. Спрашивайте меня о чем угодно, касающемся стиля или трендов!",
    placeholder: "Задайте вопрос о моде...",
    askingAbout: "Вопрос о:",
    open: "Открыть чат",
    close: "Закрыть чат"
  },
  bodyShape: {
    title: "Ваш тип фигуры",
    'apple': { name: "Яблоко", description: "Широкое туловище, широкие плечи, пышная грудь и талия." },
    'pear': { name: "Груша", description: "Широкие бедра и ляжки с более выраженной талией и узкими плечами." },
    'hourglass': { name: "Песочные часы", description: "Сбалансированные грудь и бедра с четко выраженной, узкой талией." },
    'rectangle': { name: "Прямоугольник", description: "Примерно одинаковые размеры плеч, груди, талии и бедер." },
    'inverted_triangle': { name: "Перевернутый треугольник", description: "Широкие плечи и грудь, сужающиеся к бедрам." }
  },
  styleSelector: {
    label: "Выберите от 1 до 4 стилей",
    selectionCount: "Выбрано {{selected}}/{{max}}"
  },
  styleProfile: {
    title: "Ваш профиль стиля",
    description: "Ставьте лайки или дизлайки образам, чтобы научить ИИ вашему вкусу. Ваш профиль будет использоваться для создания более персонализированных результатов.",
    clear: "Очистить профиль",
    empty: "Начните оценивать образы, чтобы создать свой профиль!"
  },
  outfitCard: {
    editLabel: "Редактировать этот образ:",
    editPlaceholder: "например, добавить синий шарф",
    apply: "Применить",
    applying: "Применение...",
    cancel: "Отмена",
    edit: "Редактировать",
    like: "Нравится",
    dislike: "Не нравится",
    share: "Поделиться",
    copied: "Скопировано!",
    failed: "Ошибка",
    editError: "Не удалось редактировать. Попробуйте другой запрос.",
    bodyShapeTipTitle: "Почему это вам подходит:",
    findNearby: "Найти рядом",
    finding: "Поиск...",
    save: "Сохранить",
    unsave: "Удалить"
  },
  storeLocator: {
    title: "Магазины рядом с вами",
    subtitle: "Результаты для '{{accessory}}'",
    empty: "К сожалению, мы не смогли найти конкретные магазины поблизости. Попробуйте более широкий поиск на Google Картах.",
    error: "Не удалось загрузить расположение магазинов. Убедитесь, что вы предоставили доступ к местоположению, и попробуйте снова.",
    manualLocationPlaceholder: "Введите город или индекс",
    manualLocationLabel: "Поиск по городу или почтовому индексу",
    manualSearch: "Искать этот адрес",
    buttonOpen: "Открыть в картах",
    copy: "Копировать ссылку",
    copied: "Скопировано",
    close: "Закрыть окно магазинов"
  },
  rejectedCard: {
    title: "Стиль отклонен",
    subtitle: "Вот почему это не лучшее сочетание:"
  },
  styles: {
    'Casual': { name: 'Повседневный', description: 'Удобная, повседневная одежда. Джинсы, футболки, кроссовки.' },
    'Business': { name: 'Деловой', description: 'Профессиональный и офисный стиль. Включает костюмы, блузки и формальные брюки.' },
    'Night Out': { name: 'Вечерний', description: 'Нарядный и стильный для вечера. Включает коктейльные платья, каблуки и яркие аксессуары.' },
    'Athleisure': { name: 'Спортивный', description: 'Спортивный стиль встречается с повседневным. Сочетает спортивную одежду, такую как леггинсы и худи, с повседневной модой.' },
    'Bohemian': { name: 'Богемный', description: 'Свободный и артистичный. Характеризуется летящими тканями, земными тонами и эклектичными узорами.' },
    'Formal': { name: 'Формальный', description: 'Элегантная одежда для особых случаев. Вечерние платья, смокинги и изысканные украшения.' },
    'Streetwear': { name: 'Уличный', description: 'Городская и современная мода. Основана на культуре скейтбординга и хип-хопа, с графическими футболками и кроссовками.' },
    'Minimalist': { name: 'Минимализм', description: 'Простые, чистые линии и нейтральная цветовая палитра. Акцент на качестве и вневременных формах.' },
    'Vintage': { name: 'Винтаж', description: 'Вдохновлен модой прошлых эпох. Включает ретро-принты, классические силуэты и ностальгические аксессуары.' }
  },
  share: {
    title: "Мой образ от Виртуального Стилиста",
    text: "Стилизовано ИИ Виртуальным Стилистом."
  },
  footer: {
    poweredBy: "На базе Google Gemini",
    copyright: "Авторские права приложения ALMSTKSHF Co 2026"
  },
  theme: {
    light: "Светлая",
    dark: "Темная",
    system: "Системная"
  }
};

const nl = {
  paywall: {
    insufficient: "Punten zijn op. Abonneer om de stylist te blijven gebruiken.",
    spendFailed: "Punten konden niet worden afgeschreven. Abonneer of probeer het later opnieuw."
  },
  auth: {
    loginFailedEmail: "Aanmelden met e-mail mislukt. Probeer het later opnieuw."
  },
  header: {
    titlePart1: "Virtuele",
    titlePart2: "Stylist",
    subtitle: "Wat te dragen? Opgelost.",
    startOver: "Opnieuw beginnen"
  },
  landing: {
    hello: "HALLO!",
    header: {
      profile: "Profiel",
      referral: "Doorverwijzing",
      referralUnavailable: "Doorverwijzingsprogramma binnenkort beschikbaar",
      homeAria: "Virtual Stylist startpagina",
      logoAlt: "Virtual Stylist logo",
      primaryNavAria: "Primaire navigatie",
      openMenu: "Menu openen",
      closeMenu: "Menu sluiten",
      guest: "Gast",
      pointsLabel: "{{points}} pts",
      pointsUnknown: "Punten in afwachting",
      referralActive: "Doorverwijzing actief",
      referralPending: "Doorverwijzing in afwachting"
    },
    juliana: {
      name: "Ik ben Juliana",
      title: "Mode Stylist »»",
      bio: "Ik ben een modestylist die gelooft dat iedereen een unieke stijl heeft die via mode kan worden uitgedrukt.",
      cta: "Vind Jouw Stijl"
    },
    features: {
      title: "Verbeter uw stijl",
      subtitle: "Alles wat u nodig heeft om er op uw best uit te zien, aangedreven door AI.",
      ai: { title: "AI Persoonlijke Stylist", desc: "Krijg directe outfit-aanbevelingen op basis van uw items." },
      mix: { title: "Mix & Match", desc: "Creëer prachtige combinaties uit uw bestaande garderobe." },
      trends: { title: "Trendanalyse", desc: "Blijf voorop lopen met realtime mode-inzichten." },
      chat: { title: "Expertadvies", desc: "Chat met onze AI-mode-expert voor gepersonaliseerde tips." },
      local: { title: "Winkel Lokaal", desc: "Vind winkels in de buurt die de items verkopen waar u van houdt." },
      closet: { title: "Digitale Garderobe", desc: "Organiseer en visualiseer uw garderobe digitaal." }
    },
    restore: {
      emailRequired: "Voer je e-mail in om je account te herstellen.",
      invalidEmail: "Voer een geldig e-mailadres in (voorbeeld: you@example.com).",
      failed: "Account herstellen is mislukt. Probeer het later opnieuw.",
      emailPlaceholder: "you@example.com",
      namePlaceholder: "Optionele naam",
      action: "Herstellen",
      loading: "..."
    },
    signup: {
      intro: "Nieuwe gebruiker? Meld je aan en ontvang direct punten",
      namePlaceholder: "Jouw naam",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "Doorverwijzingscode (optioneel)",
      emailRequired: "Voer je e-mail in om punten te krijgen.",
      invalidEmail: "Voer een geldig e-mailadres in (voorbeeld: you@example.com).",
      failed: "Aanmelden is nu niet beschikbaar. Probeer het later opnieuw.",
      submit: "Aanmelden en punten krijgen",
      loading: "...",
      hint: "Aanmeld- en welkomstpunten worden direct toegekend, en doorverwijzing beloont jullie allebei."
    },
    profileSection: {
      title: "Vul je profiel in en claim nu je punten",
      subtitle: "Voer je naam, e-mail en doorverwijzingscode (indien aanwezig) in om direct aanmeld- en welkomstbeloningen te ontvangen."
    },
    cta: {
      ariaLabel: "Aan de slag met Virtual Stylist"
    },
    profileForm: {
      eyebrow: "Klantprofiel",
      description: "Sla je naam, e-mail en doorverwijzingscode op om direct punten te ontvangen.",
      save: "Gegevens opslaan",
      saving: "Opslaan...",
      nameLabel: "Naam",
      emailLabel: "E-mail",
      referralLabel: "Doorverwijzingscode (om de punten van je vriend te claimen)",
      namePlaceholder: "Voer je naam in",
      emailPlaceholder: "you@example.com",
      referralPlaceholder: "Voorbeeld: ABC12345",
      invalidEmail: "Voer een geldig e-mailadres in voordat je opslaat.",
      rewardSignup: "Aanmeld- + welkomstbeloning",
      rewardReferral: "Doorverwijzing activeren geeft direct punten",
      saved: "Opgeslagen en punten uitgegeven 🎉",
      errorFallback: "We konden je gegevens niet opslaan. Probeer het opnieuw."
    },
    loyalty: {
      eyebrow: "Loyaliteitsoverzicht",
      title: "Punten en doorverwijzing",
      profileFallback: "Jouw profiel",
      emailFallback: "Nog geen e-mail",
      balance: "Saldo",
      monthlyPoints: "Maandelijkse punten",
      signup: "Aanmelden",
      welcomePackage: "Welkomstpakket",
      awarded: "Toegekend",
      pending: "In afwachting",
      referralLink: "Doorverwijzingslink",
      collectPointsHint: "Verzamel punten door je aan te melden",
      bothEarn: "Zowel verwijzer als vriend verdienen {{points}} pts",
      copyLink: "Link kopiëren",
      linkCopied: "Link gekopieerd",
      referralCodePending: "Doorverwijzingscode in afwachting",
      qrAlt: "Doorverwijzing QR-code"
    }
  },
  profilePage: {
    referralQrAlt: "QR-code voor je doorverwijzingslink",
    savedOutfitAlt: "Opgeslagen outfit: {{title}}",
    savedOutfitAltFallback: "Opgeslagen outfit {{index}}"
  },
  uploader: {
    title: "Upload uw kledingstukken",
    subtitle: "Heeft u items die u niet weet hoe te stylen? Upload de foto's ervan en onze AI-stylist zal complete outfits for u creëren.",
    cta: "Klik om te uploaden",
    drop: "of sleep en zet neer",
    info: "PNG, JPG, WEBP (u kunt meerdere bestanden selecteren)",
    invalidType: "Upload geldige afbeeldingsbestanden."
  },
  main: {
    yourItem: "Jouw item",
    yourCollection: "Jouw collectie",
    addItem: "Item toevoegen",
    removeItem: "Item verwijderen",
    selectItemPrompt: "Selecteer een item uit je collectie om te beginnen met stylen.",
    combinePrompt: "Selecteer 2 of meer items uit je collectie om passende outfits te vinden.",
    uploadNew: "Nieuw item uploaden",
    generate: "Outfits genereren",
    combine: "Matches zoeken",
    styling: "Bezig met stylen...",
    combining: "Matches zoeken...",
    aiSuggestions: "AI Outfit Suggesties",
    combinationSuggestions: "AI Combinatie Suggesties",
    suggestedAccessory: "Voorgesteld accessoire",
    mode: {
      single: "Style één item",
      combine: "Combineer collectie"
    },
    loading: {
      analyzing: "Je items worden geanalyseerd...",
      messages: [
        "Kleurenpaletten overwegen...",
        "Patronen en texturen matchen...",
        "Het perfecte silhouet creëren...",
        "Het ideale accessoire vinden...",
        "De laatste trends raadplegen...",
        "Onze modecreativiteit de vrije loop laten..."
      ]
    },
    error: {
      title: "Oh nee!",
      editFailed: "Bewerken van afbeelding voor {{title}} mislukt. Probeer het opnieuw.",
      minTwoItems: "Selecteer alstublieft minstens twee items om te combineren."
    }
  },
  trends: {
    button: "Analyseer Trends",
    loading: "Trends analyseren...",
    modalTitle: "Huidige Trends",
    sources: "Bronnen",
    close: "Trendsvenster sluiten"
  },
  chat: {
    title: "Mode Chat",
    welcome: "Hoi! Ik ben je AI-modeassistent. Vraag me alles over styling of trends!",
    placeholder: "Stel een modevraag...",
    askingAbout: "Vraag over:",
    open: "Chat openen",
    close: "Chat sluiten"
  },
  bodyShape: {
    title: "Jouw Lichaamsvorm",
    'apple': { name: "Appel", description: "Bredere romp, bredere schouders en een vollere borst en taille." },
    'pear': { name: "Peer", description: "Bredere heupen en dijen met een meer gedefinieerde taille en smallere schouders." },
    'hourglass': { name: "Zandloper", description: "Evenwichtige borst en heupen met een duidelijk gedefinieerde, smallere taille." },
    'rectangle': { name: "Rechthoek", description: "Vrij uniforme afmetingen voor schouders, borst, taille en heupen." },
    'inverted_triangle': { name: "Omgekeerde Driehoek", description: "Bredere schouders en borst die naar de heupen versmallen." }
  },
  styleSelector: {
    label: "Kies 1-4 stijlen",
    selectionCount: "{{selected}}/{{max}} geselecteerd"
  },
  styleProfile: {
    title: "Jouw Stijlprofiel",
    description: "Like of dislike outfits om de AI jouw smaak te leren. Je profiel wordt gebruikt om meer gepersonaliseerde resultaten te genereren.",
    clear: "Profiel wissen",
    empty: "Begin met het beoordelen van outfits om je profiel op te bouwen!"
  },
  outfitCard: {
    editLabel: "Bewerk deze look:",
    editPlaceholder: "bijv. voeg een blauwe sjaal toe",
    apply: "Toepassen",
    applying: "Toepassen...",
    cancel: "Annuleren",
    edit: "Bewerken",
    like: "Like",
    dislike: "Dislike",
    share: "Delen",
    copied: "Gekopieerd!",
    failed: "Mislukt",
    editError: "Bewerken mislukt. Probeer een andere prompt.",
    bodyShapeTipTitle: "Waarom dit voor jou werkt:",
    findNearby: "Vind in de buurt",
    finding: "Zoeken...",
    save: "Opslaan",
    unsave: "Verwijderen"
  },
  storeLocator: {
    title: "Winkels bij jou in de buurt",
    subtitle: "Resultaten voor '{{accessory}}'",
    empty: "Sorry, we konden geen specifieke winkels in de buurt vinden. Probeer een bredere zoekopdracht op Google Maps.",
    error: "Kon winkellocaties niet ophalen. Zorg ervoor dat je locatietoestemming hebt gegeven en probeer het opnieuw.",
    manualLocationPlaceholder: "Voer stad of postcode in",
    manualLocationLabel: "Zoek op stad of postcode",
    manualSearch: "Zoek op deze locatie",
    buttonOpen: "Openen in Maps",
    copy: "Link kopiëren",
    copied: "Gekopieerd",
    close: "Winkellocator sluiten"
  },
  rejectedCard: {
    title: "Stijl afgewezen",
    subtitle: "Hier is waarom dit geen goede match is:"
  },
  styles: {
    'Casual': { name: 'Casual', description: 'Comfortabele, alledaagse kleding. Denk aan jeans, t-shirts, and sneakers.' },
    'Business': { name: 'Zakelijk', description: 'Professionnel en kantoorgeschikt. Inclusief pakken, blouses en formele broeken.' },
    'Night Out': { name: 'Avondje uit', description: 'Netjes en stijlvol voor \'s avonds. Met cocktailjurken, hakken en opvallende stukken.' },
    'Athleisure': { name: 'Athleisure', description: 'Sportief ontmoet casual. Combineert sportkleding zoals leggings en hoodies met alledaagse mode.' },
    'Bohemian': { name: 'Bohemien', description: 'Vrijgevochten en artistiek. Gekenmerkt door zwierige stoffen, aardetinten en eclectische patronen.' },
    'Formal': { name: 'Formeel', description: 'Elegante kleding voor speciale gelegenheden. Denk aan galajurken, smokings en fijne sieraden.' },
    'Streetwear': { name: 'Streetwear', description: 'Stedelijke en moderne mode. Geworteld in de skate- en hiphopcultuur, met grafische T-shirts en sneakers.' },
    'Minimalist': { name: 'Minimalistisch', description: 'Eenvoudige, strakke lijnen en een neutraal kleurenpalet. Focust op kwaliteit en tijdloze vormen.' },
    'Vintage': { name: 'Vintage', description: 'Geïnspireerd op mode uit vervlogen tijden. Met retroprints, klassieke silhouetten en nostalgische accessoires.' }
  },
  share: {
    title: "Mijn Virtuele Stylist Outfit",
    text: "Gestyled door Virtuele Stylist AI."
  },
  footer: {
    poweredBy: "Aangedreven door Google Gemini",
    copyright: "Applicatie-auteursrechten door ALMSTKSHF Co 2026"
  },
  theme: {
    light: "Licht",
    dark: "Donker",
    system: "Systeem"
  }
};


export const translations = { en, ar, fr, ru, nl };

// This is a helper type to provide strong typing for the translation keys
type PathsToStringProps<T> = T extends string ? [] : {
    [K in keyof T]: [K, ...PathsToStringProps<T[K]>]
}[keyof T];
type Join<T extends (string | number)[], D extends string> =
    T extends [] ? never :
    T extends [infer F] ? F :
    T extends [infer F, ...infer R] ? F extends string | number ? `${F}${D}${Join<Extract<R, (string | number)[]>, D>}` : never : string;

export type TranslationKey = Join<PathsToStringProps<typeof en>, '.'>;
