export type TravelerId = "teacher" | "knight" | "cartographer" | "programmer";

export type Traveler = {
  id: TravelerId;
  index: string;
  name: string;
  title: string;
  titleZh: string;
  image: string;
  color: string;
  line: string;
};

export type CharacterPlacement = {
  id: TravelerId;
  left: string;
  bottom: string;
  size: string;
  delay?: string;
  flip?: boolean;
};

export type Chapter = {
  id: string;
  number: string;
  city: string;
  stage: string;
  title: string;
  titleZh: string;
  narrative: string;
  image: string;
  imagePosition?: string;
  artwork: string;
  artist: string;
  date: string;
  lesson: {
    eyebrow: string;
    phrase: string;
    translation: string;
    note: string;
    words: Array<[string, string]>;
  };
  characters: CharacterPlacement[];
};

export const travelers: Traveler[] = [
  {
    id: "teacher",
    index: "01",
    name: "Il Maestro",
    title: "Il Mago delle Parole",
    titleZh: "词语魔法师",
    image: "/characters/teacher.webp",
    color: "#8d2736",
    line: "Le parole difficili diventano possibili.",
  },
  {
    id: "knight",
    index: "02",
    name: "La Compagna",
    title: "La Cavaliere",
    titleZh: "守护句子的骑士",
    image: "/characters/knight.webp",
    color: "#345340",
    line: "Ogni errore è una prova superata.",
  },
  {
    id: "cartographer",
    index: "03",
    name: "La Compagna",
    title: "La Cartografa",
    titleZh: "寻找方向的制图师",
    image: "/characters/cartographer.webp",
    color: "#bc5a3c",
    line: "Una nuova parola apre una nuova strada.",
  },
  {
    id: "programmer",
    index: "04",
    name: "Il Compagno",
    title: "Il Programmatore",
    titleZh: "带着电脑的程序员",
    image: "/characters/programmer.webp",
    color: "#bb7b20",
    line: "Debug della grammatica, una frase alla volta.",
  },
];

export const chapters: Chapter[] = [
  {
    id: "cominciamo",
    number: "00",
    city: "ROMA",
    stage: "IL PRIMO GIORNO",
    title: "Cominciamo?",
    titleZh: "我们开始吧？",
    narrative:
      "一位老师，三位学生。起初，我们只认识零散的词。魔法师翻开课本，第一条路便从画框里出现。",
    image: "/artworks/school-of-athens.jpg",
    imagePosition: "50% 50%",
    artwork: "The School of Athens",
    artist: "Raphael",
    date: "1509–1511",
    lesson: {
      eyebrow: "SALUTO · GREETING",
      phrase: "Buongiorno, cominciamo?",
      translation: "早上好，我们开始吧？",
      note: "Buongiorno 是白天最自然的问候；cominciamo 是“我们开始”，把所有人都放进同一个行动里。",
      words: [
        ["buongiorno", "早上好 / 日安"],
        ["cominciare", "开始"],
      ],
    },
    characters: [
      { id: "teacher", left: "42%", bottom: "8%", size: "15%" },
      { id: "knight", left: "57%", bottom: "7%", size: "10%", delay: ".08s" },
      { id: "cartographer", left: "66%", bottom: "8%", size: "10%", delay: ".16s" },
      { id: "programmer", left: "75%", bottom: "7%", size: "10%", delay: ".24s" },
    ],
  },
  {
    id: "presentarsi",
    number: "01",
    city: "FIRENZE",
    stage: "LE PRIME PAROLE",
    title: "Mi chiamo…",
    titleZh: "第一次用意大利语介绍自己。",
    narrative:
      "名字先穿过门廊，然后是来自哪里、喜欢什么。制图师把陌生的发音，一点点标在地图上。",
    image: "/artworks/annunciation.jpg",
    imagePosition: "50% 48%",
    artwork: "The Annunciation",
    artist: "Fra Angelico",
    date: "c. 1425–1426",
    lesson: {
      eyebrow: "PRESENTARSI · INTRODUCE YOURSELF",
      phrase: "Mi chiamo… Piacere!",
      translation: "我叫……很高兴认识你！",
      note: "Mi chiamo 后面直接接名字。Piacere 既简短又自然，是第一次见面最实用的一句话。",
      words: [
        ["chiamarsi", "叫作 / 名叫"],
        ["piacere", "幸会"],
      ],
    },
    characters: [
      { id: "teacher", left: "15%", bottom: "8%", size: "13%" },
      { id: "cartographer", left: "29%", bottom: "8%", size: "11%", delay: ".12s" },
      { id: "knight", left: "62%", bottom: "8%", size: "9%", delay: ".2s", flip: true },
      { id: "programmer", left: "71%", bottom: "7%", size: "10%", delay: ".28s", flip: true },
    ],
  },
  {
    id: "desiderare",
    number: "02",
    city: "FIRENZE",
    stage: "UNA FRASE INTERA",
    title: "Vorrei…",
    titleZh: "终于说出第一句完整的话。",
    narrative:
      "海风把词吹散，又把它们重新排成句子。骑士守住动词，程序员找到了句子的运行逻辑。",
    image: "/artworks/birth-of-venus.jpg",
    imagePosition: "50% 48%",
    artwork: "The Birth of Venus",
    artist: "Sandro Botticelli",
    date: "c. 1484–1486",
    lesson: {
      eyebrow: "DESIDERIO · A POLITE WISH",
      phrase: "Vorrei un caffè, per favore.",
      translation: "我想要一杯咖啡，谢谢。",
      note: "Vorrei 比 voglio 更柔和。它像一把万能钥匙：点餐、请求帮助、表达愿望时都很好用。",
      words: [
        ["vorrei", "我想要 / 我希望"],
        ["per favore", "请"],
      ],
    },
    characters: [
      { id: "knight", left: "10%", bottom: "6%", size: "11%" },
      { id: "programmer", left: "22%", bottom: "6%", size: "10%", delay: ".1s" },
      { id: "teacher", left: "74%", bottom: "7%", size: "12%", delay: ".18s", flip: true },
      { id: "cartographer", left: "84%", bottom: "6%", size: "9%", delay: ".26s", flip: true },
    ],
  },
  {
    id: "studiare",
    number: "03",
    city: "MILANO",
    stage: "GRAMMATICA A TAVOLA",
    title: "Mi piace studiare.",
    titleZh: "课桌变成长桌，语法成了主菜。",
    narrative:
      "名词、动词、作业和 espresso 全都上了桌。我们争论介词，也分享每一个终于说对的瞬间。",
    image: "/artworks/last-supper.jpg",
    imagePosition: "50% 48%",
    artwork: "The Last Supper",
    artist: "Leonardo da Vinci",
    date: "1495–1498",
    lesson: {
      eyebrow: "PIACERE · WHAT YOU LIKE",
      phrase: "Mi piace studiare l’italiano.",
      translation: "我喜欢学习意大利语。",
      note: "Mi piace 后接动词原形时，不需要 di。那条被删掉的介词，后来成了我们记得最牢的错误之一。",
      words: [
        ["mi piace", "我喜欢"],
        ["studiare", "学习"],
      ],
    },
    characters: [
      { id: "teacher", left: "46%", bottom: "9%", size: "13%" },
      { id: "knight", left: "58%", bottom: "8%", size: "9%", delay: ".08s" },
      { id: "cartographer", left: "68%", bottom: "8%", size: "9%", delay: ".16s" },
      { id: "programmer", left: "77%", bottom: "7%", size: "10%", delay: ".24s" },
    ],
  },
  {
    id: "capire",
    number: "04",
    city: "ROMA",
    stage: "LA CONNESSIONE",
    title: "Ora capisco.",
    titleZh: "某一天，语言真的接通了。",
    narrative:
      "没有闪电，也没有掌声。只是老师递过来一句话，我们忽然不再逐字翻译，而是直接明白了它。",
    image: "/artworks/creation-of-adam.jpg",
    imagePosition: "50% 50%",
    artwork: "The Creation of Adam",
    artist: "Michelangelo",
    date: "c. 1512",
    lesson: {
      eyebrow: "CAPIRE · UNDERSTANDING",
      phrase: "Ora capisco cosa vuoi dire.",
      translation: "现在我明白你的意思了。",
      note: "Ora 是“现在”；cosa vuoi dire 是“你想表达什么”。一句很普通的话，也可以标记真正的进步。",
      words: [
        ["ora", "现在"],
        ["capire", "理解"],
      ],
    },
    characters: [
      { id: "teacher", left: "33%", bottom: "7%", size: "13%" },
      { id: "programmer", left: "56%", bottom: "7%", size: "11%", delay: ".1s", flip: true },
      { id: "knight", left: "68%", bottom: "7%", size: "9%", delay: ".18s", flip: true },
      { id: "cartographer", left: "76%", bottom: "7%", size: "9%", delay: ".26s", flip: true },
    ],
  },
  {
    id: "sbagliare",
    number: "05",
    city: "VENEZIA",
    stage: "GLI ERRORI",
    title: "Ho sbagliato.",
    titleZh: "我们迷路、停顿，也说错很多次。",
    narrative:
      "暴风雨来的时候，地图会湿，代码会报错，盾牌也会拿反。好在每个错误都把下一句话照得更清楚。",
    image: "/artworks/tempest.jpg",
    imagePosition: "50% 45%",
    artwork: "The Tempest",
    artist: "Giorgione",
    date: "c. 1506–1508",
    lesson: {
      eyebrow: "ERRORE · A USEFUL MISTAKE",
      phrase: "Ho sbagliato, riprovo.",
      translation: "我说错了，再试一次。",
      note: "Ho sbagliato 承认错误；riprovo 马上把故事推向下一步。语言学习最重要的不是不犯错，而是继续说。",
      words: [
        ["sbagliare", "犯错 / 说错"],
        ["riprovare", "再试一次"],
      ],
    },
    characters: [
      { id: "cartographer", left: "19%", bottom: "5%", size: "12%" },
      { id: "programmer", left: "32%", bottom: "5%", size: "11%", delay: ".1s" },
      { id: "knight", left: "70%", bottom: "6%", size: "11%", delay: ".18s", flip: true },
      { id: "teacher", left: "82%", bottom: "7%", size: "12%", delay: ".26s", flip: true },
    ],
  },
  {
    id: "viaggiare",
    number: "06",
    city: "VENEZIA",
    stage: "FUORI DALL’AULA",
    title: "Dove andiamo?",
    titleZh: "语言离开课本，变成了方向。",
    narrative:
      "制图师展开意大利，骑士认出路标，程序员查到下一班船。老师只笑着说：继续往前。",
    image: "/artworks/grand-canal.jpg",
    imagePosition: "50% 48%",
    artwork: "The Grand Canal towards Rialto",
    artist: "Canaletto",
    date: "c. 1720–1725",
    lesson: {
      eyebrow: "ORIENTARSI · FINDING THE WAY",
      phrase: "Scusi, dov’è il ponte?",
      translation: "请问，桥在哪里？",
      note: "Scusi 是礼貌地引起注意；dov’è 把 dove + è 连在一起。知道问路，就有了继续旅行的勇气。",
      words: [
        ["scusi", "劳驾 / 请问"],
        ["dov’è", "在哪里"],
      ],
    },
    characters: [
      { id: "cartographer", left: "9%", bottom: "5%", size: "11%" },
      { id: "teacher", left: "19%", bottom: "6%", size: "12%", delay: ".08s" },
      { id: "knight", left: "72%", bottom: "5%", size: "10%", delay: ".16s", flip: true },
      { id: "programmer", left: "82%", bottom: "5%", size: "10%", delay: ".24s", flip: true },
    ],
  },
  {
    id: "coraggio",
    number: "07",
    city: "FIRENZE",
    stage: "PARLARE SENZA PAURA",
    title: "Ce la faccio.",
    titleZh: "开口之前，先相信自己做得到。",
    narrative:
      "骑士向前一步。不是因为句子已经完美，而是因为她终于愿意把它说完。其他三个人也跟了上来。",
    image: "/artworks/david.jpg",
    imagePosition: "50% 28%",
    artwork: "David",
    artist: "Michelangelo · photo by Jörg Bittner Unna",
    date: "1501–1504",
    lesson: {
      eyebrow: "CORAGGIO · YOU CAN DO IT",
      phrase: "Ce la faccio.",
      translation: "我能做到。",
      note: "Ce la faccio 是很有力量的口语表达。它不只表示能力，也带着“我会坚持完成”的决心。",
      words: [
        ["farcela", "成功做到"],
        ["coraggio", "勇气 / 加油"],
      ],
    },
    characters: [
      { id: "knight", left: "18%", bottom: "5%", size: "13%" },
      { id: "teacher", left: "30%", bottom: "6%", size: "11%", delay: ".08s" },
      { id: "cartographer", left: "73%", bottom: "5%", size: "9%", delay: ".16s", flip: true },
      { id: "programmer", left: "82%", bottom: "5%", size: "9%", delay: ".24s", flip: true },
    ],
  },
  {
    id: "esame",
    number: "08",
    city: "ROMA",
    stage: "IL GIORNO DELL’ESAME",
    title: "Speriamo bene.",
    titleZh: "考试像最后的审判——至少当时是这样。",
    narrative:
      "所有动词都突然忘了变位。魔法师合上书，骑士握紧盾牌，制图师检查路线，程序员开始最后一次 debug。",
    image: "/artworks/last-judgment.jpg",
    imagePosition: "50% 34%",
    artwork: "The Last Judgment",
    artist: "Michelangelo",
    date: "1536–1541",
    lesson: {
      eyebrow: "SPERANZA · HOPING FOR THE BEST",
      phrase: "Speriamo bene!",
      translation: "希望一切顺利！",
      note: "Speriamo 是“我们希望”。考前、出发前、等待结果时，这句话既认真，也可以带一点自我调侃。",
      words: [
        ["sperare", "希望"],
        ["andrà bene", "会顺利的"],
      ],
    },
    characters: [
      { id: "teacher", left: "12%", bottom: "5%", size: "12%" },
      { id: "knight", left: "24%", bottom: "5%", size: "10%", delay: ".08s" },
      { id: "cartographer", left: "69%", bottom: "5%", size: "10%", delay: ".16s", flip: true },
      { id: "programmer", left: "80%", bottom: "5%", size: "10%", delay: ".24s", flip: true },
    ],
  },
  {
    id: "insieme",
    number: "09",
    city: "VENEZIA",
    stage: "DOPO L’ULTIMA LEZIONE",
    title: "Abbiamo festeggiato.",
    titleZh: "最后一课结束，旅程却没有停下。",
    narrative:
      "我们把错误、笑话、作业和小小的进步都摆上长桌。原来真正值得庆祝的，不只是结果，而是一起走过。",
    image: "/artworks/wedding-at-cana.jpg",
    imagePosition: "50% 52%",
    artwork: "The Wedding at Cana",
    artist: "Paolo Veronese",
    date: "1562–1563",
    lesson: {
      eyebrow: "INSIEME · TOGETHER",
      phrase: "Abbiamo fatto tanta strada insieme.",
      translation: "我们一起走了很远。",
      note: "Fare strada 不只是真正地走路，也可以表示成长与取得进展。insieme 让这句话成为四个人共同的故事。",
      words: [
        ["fare strada", "前进 / 取得进展"],
        ["insieme", "一起"],
      ],
    },
    characters: [
      { id: "teacher", left: "39%", bottom: "7%", size: "12%" },
      { id: "knight", left: "50%", bottom: "6%", size: "9%", delay: ".08s" },
      { id: "cartographer", left: "59%", bottom: "6%", size: "9%", delay: ".16s" },
      { id: "programmer", left: "68%", bottom: "6%", size: "9%", delay: ".24s" },
    ],
  },
  {
    id: "arrivederci",
    number: "10",
    city: "FIRENZE",
    stage: "FUORI DALLA CORNICE",
    title: "Arrivederci, ma non addio.",
    titleZh: "再见，但不是告别。",
    narrative:
      "我们本来只是来学意大利语，最后却穿过了一整个意大利。画框留在身后，学会的语言还会继续带我们向前。",
    image: "/artworks/primavera.jpg",
    imagePosition: "50% 50%",
    artwork: "Primavera",
    artist: "Sandro Botticelli",
    date: "c. 1477–1482",
    lesson: {
      eyebrow: "ARRIVEDERCI · UNTIL WE MEET AGAIN",
      phrase: "Grazie per questo viaggio.",
      translation: "谢谢你们陪我走过这段旅程。",
      note: "Arrivederci 的字面意思接近“直到我们再次见面”。所以它不是终点，而是下一次相遇之前的停顿。",
      words: [
        ["grazie", "谢谢"],
        ["arrivederci", "再见 / 后会有期"],
      ],
    },
    characters: [
      { id: "teacher", left: "31%", bottom: "5%", size: "12%" },
      { id: "knight", left: "43%", bottom: "4%", size: "9%", delay: ".08s" },
      { id: "cartographer", left: "52%", bottom: "4%", size: "9%", delay: ".16s" },
      { id: "programmer", left: "61%", bottom: "4%", size: "9%", delay: ".24s" },
    ],
  },
];

export const archiveWorks = [
  { image: "/artworks/mona-lisa.jpg", title: "Mona Lisa", artist: "Leonardo da Vinci" },
  { image: "/artworks/calling-of-saint-matthew.jpg", title: "The Calling of Saint Matthew", artist: "Caravaggio" },
  { image: "/artworks/psyche.jpg", title: "Psyche Revived by Cupid’s Kiss", artist: "Antonio Canova" },
  { image: "/artworks/pieta.jpg", title: "Pietà", artist: "Michelangelo · photo by Jebulon" },
  { image: "/artworks/perseus.jpg", title: "Perseus with the Head of Medusa", artist: "Benvenuto Cellini · photo by Jebulon" },
  { image: "/artworks/annunciation.jpg", title: "The Annunciation", artist: "Fra Angelico" },
  { image: "/artworks/school-of-athens.jpg", title: "The School of Athens", artist: "Raphael" },
  { image: "/artworks/birth-of-venus.jpg", title: "The Birth of Venus", artist: "Sandro Botticelli" },
];

export const credits = [
  {
    label: "The School of Athens — Raphael",
    url: "https://commons.wikimedia.org/wiki/File:%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
  },
  {
    label: "The Annunciation — Fra Angelico",
    url: "https://commons.wikimedia.org/wiki/File:La_Anunciaci%C3%B3n,_by_Fra_Angelico,_from_Prado_in_Google_Earth.jpg",
  },
  {
    label: "The Birth of Venus — Sandro Botticelli",
    url: "https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
  },
  {
    label: "The Last Supper — Leonardo da Vinci",
    url: "https://commons.wikimedia.org/wiki/File:Leonardo_da_Vinci_(1452-1519)_-_The_Last_Supper_(1495-1498).jpg",
  },
  {
    label: "The Creation of Adam — Michelangelo",
    url: "https://commons.wikimedia.org/wiki/File:Michelangelo_-_Creation_of_Adam_(cropped).jpg",
  },
  {
    label: "The Tempest — Giorgione",
    url: "https://commons.wikimedia.org/wiki/File:Giorgione,_The_tempest.jpg",
  },
  {
    label: "Grand Canal towards Rialto — Canaletto",
    url: "https://commons.wikimedia.org/wiki/File:Canal_-_The_Grand_Canal_from_Ca%E2%80%99_Balbi_Looking_towards_Rialto_-_Ca%27_Rezzonico_-_Museum_of_the_18_century_Venice.jpg",
  },
  {
    label: "David — Michelangelo; photo Jörg Bittner Unna, CC BY 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Michelangelo-David_JB01.JPG",
  },
  {
    label: "The Last Judgment — Michelangelo",
    url: "https://commons.wikimedia.org/wiki/File:Last_Judgement_(Michelangelo).jpg",
  },
  {
    label: "The Wedding at Cana — Paolo Veronese",
    url: "https://commons.wikimedia.org/wiki/File:Les_Noces_de_Cana_-_Paolo_Veronese_-_Mus%C3%A9e_du_Louvre_Peintures_INV_142_;_MR_384.jpg",
  },
  {
    label: "Primavera — Sandro Botticelli",
    url: "https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_La_Primavera_-_Google_Art_Project.jpg",
  },
  {
    label: "Mona Lisa — Leonardo da Vinci",
    url: "https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg",
  },
  {
    label: "The Calling of Saint Matthew — Caravaggio",
    url: "https://commons.wikimedia.org/wiki/File:The_Calling_of_Saint_Matthew-Caravaggo_(1599-1600).jpg",
  },
  {
    label: "Psyche Revived by Cupid’s Kiss — Antonio Canova",
    url: "https://commons.wikimedia.org/wiki/File:Psyche_revived_Louvre_MR1777.jpg",
  },
  {
    label: "Pietà — Michelangelo; photo Jebulon, CC0",
    url: "https://commons.wikimedia.org/wiki/File:Michelangelo%27s_Piet%C3%A0_Saint_Peter%27s_Basilica_Vatican_City.jpg",
  },
  {
    label: "Perseus with the Head of Medusa — Cellini; photo Jebulon, CC0",
    url: "https://commons.wikimedia.org/wiki/File:Perseus_Medusa_Cellini_Lanzi_Florence.jpg",
  },
];
