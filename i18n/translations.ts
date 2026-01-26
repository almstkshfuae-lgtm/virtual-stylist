
const en = {
  header: {
    titlePart1: "Virtual",
    titlePart2: "Stylist",
    subtitle: "What to wear? Solved.",
    startOver: "Start Over"
  },
  landing: {
    juliana: {
      name: "I'm Juliana",
      title: "Fashion Stylist »»",
      bio: "I'm a fashion stylist who believes that everyone has a unique style that can be expressed through fashion.",
      cta: "Find Your Style"
    }
  },
  uploader: {
    title: "Upload Your Clothing Items",
    subtitle: "Have items you don't know how to style? Upload their photos, and our AI stylist will create complete outfits for you.",
    cta: "Click to upload",
    drop: "or drag and drop",
    info: "PNG, JPG, WEBP (you can select multiple files)"
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
    sources: "Sources"
  },
  chat: {
    title: "Fashion Chat",
    welcome: "Hi! I'm your AI fashion assistant. Ask me anything about styling or trends!",
    placeholder: "Ask a fashion question...",
    askingAbout: "Asking about:"
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
    bodyShapeTipTitle: "Why this works for you:"
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
    poweredBy: "Powered by Google Gemini"
  }
};

const ar = {
  header: {
    titlePart1: "مصمم أزياء",
    titlePart2: "افتراضي",
    subtitle: "ماذا أرتدي؟ تم حلها.",
    startOver: "ابدأ من جديد"
  },
  landing: {
    juliana: {
      name: "أنا جوليانا",
      title: "مصممة أزياء »»",
      bio: "أنا مصممة أزياء أؤمن بأن لكل شخص أسلوبه الفريد الذي يمكن التعبير عنه من خلال الموضة.",
      cta: "ابحث عن أسلوبك"
    }
  },
  uploader: {
    title: "قم بتحميل قطع ملابسك",
    subtitle: "هل لديك قطع لا تعرف كيف تنسقها؟ قم بتحميل صورها، وسيقوم مصمم الأزياء الذكاء الاصطناعي لدينا بإنشاء إطلالات كاملة لك.",
    cta: "انقر للتحميل",
    drop: "أو اسحب وأفلت",
    info: "PNG, JPG, WEBP (يمكنك تحديد ملفات متعددة)"
  },
  main: {
    yourItem: "قطعتك",
    yourCollection: "مجموعتك",
    addItem: "إضافة قطعة",
    removeItem: "إزالة قطعة",
    selectItemPrompt: "يرجى تحديد قطعة من مجموعتك لبدء التنسيق.",
    combinePrompt: "حدد قطعتين أو أكثر من مجموعتك للعثور على إطلالات متطابقة.",
    uploadNew: "تحميل قطعة جديدة",
    generate: "إنشاء إطلالات",
    combine: "إيجاد تطابقات",
    styling: "جاري التنسيق...",
    combining: "جاري البحث عن تطابقات...",
    aiSuggestions: "اقتراحات إطلالات الذكاء الاصطناعي",
    combinationSuggestions: "اقتراحات التنسيق بالذكاء الاصطناعي",
    suggestedAccessory: "إكسسوار مقترح",
    mode: {
      single: "تنسيق قطعة واحدة",
      combine: "تنسيق المجموعة"
    },
    loading: {
      analyzing: "جاري تحليل قطعك...",
      messages: [
        "ندرس تنسيقات الألوان...",
        "نطابق النقوش والأقمشة...",
        "نصمم الإطلالة المثالية...",
        "نبحث عن الإكسسوار المناسب...",
        "نراجع أحدث صيحات الموضة...",
        "نطلق العنان لإبداعنا في الموضة..."
      ]
    },
    error: {
      title: "أوه لا!",
      editFailed: "فشل تعديل الصورة لـ {{title}}. يرجى المحاولة مرة أخرى.",
      minTwoItems: "يرجى تحديد قطعتين على الأقل لتنسيقهما."
    }
  },
  trends: {
    button: "تحليل الصيحات",
    loading: "جاري تحليل الصيحات...",
    modalTitle: "الصيحات الحالية",
    sources: "المصادر"
  },
  chat: {
    title: "دردشة الموضة",
    welcome: "أهلاً بك! أنا مساعد الموضة الذكي الخاص بك. اسألني أي شيء عن التنسيق أو الصيحات!",
    placeholder: "اطرح سؤالاً عن الموضة...",
    askingAbout: "تسأل عن:"
  },
  bodyShape: {
    title: "شكل جسمك",
    'apple': { name: "التفاحة", description: "جذع أعرض، أكتاف عريضة، وصدر وخصر ممتلئان." },
    'pear': { name: "الكمثرى", description: "وركان وفخذان أعرض مع خصر محدد وأكتاف أضيق." },
    'hourglass': { name: "الساعة الرملية", description: "صدر ووركان متوازنان مع خصر محدد وواضح." },
    'rectangle': { name: "المستطيل", description: "قياسات متساوية تقريبًا للأكتاف والصدر والخصر والوركين." },
    'inverted_triangle': { name: "المثلث المقلوب", description: "أكتاف وصدر عريضان يضيقان نزولاً إلى الوركين." }
  },
  styleSelector: {
    label: "اختر من 1 إلى 4 أنماط",
    selectionCount: "تم اختيار {{selected}}/{{max}}"
  },
  styleProfile: {
    title: "ملف تعريف أناقتك",
    description: "أعجب أو لا تعجب بالإطلالات لتعليم الذكاء الاصطناعي ذوقك. سيتم استخدام ملفك الشخصي لإنشاء نتائج أكثر تخصيصًا.",
    clear: "مسح الملف الشخصي",
    empty: "ابدأ بتقييم الإطلالات لبناء ملفك الشخصي!"
  },
  outfitCard: {
    editLabel: "عدّل هذه الإطلالة:",
    editPlaceholder: "مثال: أضف وشاحًا أزرق",
    apply: "تطبيق",
    applying: "جاري التطبيق...",
    cancel: "إلغاء",
    edit: "تعديل",
    like: "إعجاب",
    dislike: "عدم إعجاب",
    share: "مشاركة",
    copied: "تم النسخ!",
    failed: "فشل",
    editError: "فشل التعديل. يرجى تجربة طلب مختلف.",
    bodyShapeTipTitle: "لماذا يناسبك هذا؟"
  },
  rejectedCard: {
    title: "تم رفض التنسيق",
    subtitle: "لهذا السبب لا يعتبر هذا التنسيق مناسبًا:"
  },
  styles: {
    'Casual': { name: 'كاجوال', description: 'ملابس مريحة للاستخدام اليومي. فكر في الجينز والقمصان والأحذية الرياضية.' },
    'Business': { name: 'عمل', description: 'احترافية ومناسبة للمكتب. تشمل البدلات والبلوزات والسراويل الرسمية.' },
    'Night Out': { name: 'سهرة', description: 'أنيقة وعصرية للأمسيات. تتميز بفساتين الكوكتيل والكعب العالي والقطع المميزة.' },
    'Athleisure': { name: 'رياضي', description: 'رياضي يلتقي بالكاجوال. يجمع بين الملابس الرياضية مثل اللباس الضيق والسترات مع الموضة اليومية.' },
    'Bohemian': { name: 'بوهيمي', description: 'روح حرة وفنية. يتميز بأقمشة انسيابية وألوان ترابية وأنماط انتقائية.' },
    'Formal': { name: 'رسمي', description: 'ملابس أنيقة للمناسبات الخاصة. فكر في الفساتين والبدلات الرسمية والمجوهرات الفاخرة.' },
    'Streetwear': { name: 'ملابس الشارع', description: 'أزياء حضرية وعصرية. متجذرة في ثقافة التزلج والهيب هوب، مع قمصان جرافيك وأحذية رياضية.' },
    'Minimalist': { name: 'بسيط', description: 'خطوط بسيطة ونظيفة ولوحة ألوان محايدة. يركز على الجودة والأشكال الخالدة.' },
    'Vintage': { name: 'عتيق', description: 'مستوحاة من أزياء العصور الماضية. تتميز بطبعات ريترو وصور ظلية كلاسيكية وإكسسوارات حنينية.' }
  },
  share: {
    title: "إطلالتي من مصمم الأزياء الافتراضي",
    text: "تم تنسيقها بواسطة مصمم الأزياء الذكاء الاصطناعي."
  },
  footer: {
    poweredBy: "مدعوم بواسطة Google Gemini"
  }
};

const fr = {
  header: {
    titlePart1: "Styliste",
    titlePart2: "Virtuel",
    subtitle: "Quoi porter ? Résolu.",
    startOver: "Recommencer"
  },
  landing: {
    juliana: {
      name: "Je suis Juliana",
      title: "Styliste de mode »»",
      bio: "Je suis une styliste de mode qui croit que chacun a un style unique qui peut être exprimé à travers la mode.",
      cta: "Trouvez votre style"
    }
  },
  uploader: {
    title: "Téléchargez vos vêtements",
    subtitle: "Vous avez des vêtements que vous ne savez pas comment styliser ? Téléchargez leurs photos et notre styliste IA créera des tenues complètes pour vous.",
    cta: "Cliquez pour télécharger",
    drop: "ou glissez-déposez",
    info: "PNG, JPG, WEBP (vous pouvez sélectionner plusieurs fichiers)"
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
    sources: "Sources"
  },
  chat: {
    title: "Chat Mode",
    welcome: "Bonjour ! Je suis votre assistant de mode IA. Demandez-moi n'importe quoi sur le style ou les tendances !",
    placeholder: "Posez une question sur la mode...",
    askingAbout: "Question sur :"
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
    bodyShapeTipTitle: "Pourquoi ça vous va :"
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
    poweredBy: "Propulsé par Google Gemini"
  }
};

const ru = {
  header: {
    titlePart1: "Виртуальный",
    titlePart2: "Стилист",
    subtitle: "Что надеть? Решено.",
    startOver: "Начать сначала"
  },
  landing: {
    juliana: {
      name: "Я Джулиана",
      title: "Модный стилист »»",
      bio: "Я модный стилист, который верит, что у каждого есть уникальный стиль, который можно выразить через моду.",
      cta: "Найди свой стиль"
    }
  },
  uploader: {
    title: "Загрузите ваши вещи",
    subtitle: "У вас есть вещи, которые вы не знаете, как стилизовать? Загрузите их фото, и наш ИИ-стилист создаст для вас полные образы.",
    cta: "Нажмите для загрузки",
    drop: "или перетащите",
    info: "PNG, JPG, WEBP (можно выбрать несколько файлов)"
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
    sources: "Источники"
  },
  chat: {
    title: "Модный чат",
    welcome: "Привет! Я ваш ИИ-помощник по моде. Спрашивайте меня о чем угодно, касающемся стиля или трендов!",
    placeholder: "Задайте вопрос о моде...",
    askingAbout: "Вопрос о:"
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
    bodyShapeTipTitle: "Почему это вам подходит:"
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
    poweredBy: "На базе Google Gemini"
  }
};

const nl = {
  header: {
    titlePart1: "Virtuele",
    titlePart2: "Stylist",
    subtitle: "Wat te dragen? Opgelost.",
    startOver: "Opnieuw beginnen"
  },
  landing: {
    juliana: {
      name: "Ik ben Juliana",
      title: "Mode Stylist »»",
      bio: "Ik ben een modestylist die gelooft dat iedereen een unieke stijl heeft die via mode kan worden uitgedrukt.",
      cta: "Vind Jouw Stijl"
    }
  },
  uploader: {
    title: "Upload uw kledingstukken",
    subtitle: "Heeft u items die u niet weet hoe te stylen? Upload de foto's ervan en onze AI-stylist zal complete outfits for u creëren.",
    cta: "Klik om te uploaden",
    drop: "of sleep en zet neer",
    info: "PNG, JPG, WEBP (u kunt meerdere bestanden selecteren)"
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
    sources: "Bronnen"
  },
  chat: {
    title: "Mode Chat",
    welcome: "Hoi! Ik ben je AI-modeassistent. Vraag me alles over styling of trends!",
    placeholder: "Stel een modevraag...",
    askingAbout: "Vraag over:"
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
    bodyShapeTipTitle: "Waarom dit voor jou werkt:"
  },
  rejectedCard: {
    title: "Stijl afgewezen",
    subtitle: "Hier is waarom dit geen goede match is:"
  },
  styles: {
    'Casual': { name: 'Casual', description: 'Comfortabele, alledaagse kleding. Denk aan jeans, t-shirts en sneakers.' },
    'Business': { name: 'Zakelijk', description: 'Professioneel en kantoorgeschikt. Inclusief pakken, blouses en formele broeken.' },
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
    poweredBy: "Aangedreven door Google Gemini"
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
