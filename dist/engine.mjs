import { imageDirectionParts, imageDirectionValue } from "./image-direction.mjs";
import { productionPhrase } from "./production-look.mjs";
import { imageOpening, photoProfileActive, qualityPrefixPhrase } from "./quality-prefix.mjs";

export const languages = ["HU", "EN", "DE", "FR", "ES", "IT", "PT", "PL"];

export const ui = {
  HU: {
    tagline: "Képből ötlet. Ötletből pontos prompt.",
    image: "Kép", video: "Videó", interfaceLanguage: "Felület nyelve",
    outputLanguage: "Prompt nyelve", brief: "Alapötlet", subject: "Fő téma / szereplő",
    action: "Történés / mozgás", setting: "Helyszín és háttér",
    style: "Képi stílus", lighting: "Fény", camera: "Kamera és képkivágás",
    mood: "Hangulat", negatives: "Kerülendő elemek", model: "Képmodell",
    memory: "Gép profilja", frame: "Kompozíció", quality: "Részletesség",
    duration: "Időtartam", sound: "Hang", noVoice: "Ne legyen beszéd",
    music: "Zene / hangulat leírása", build: "Prompt összeállítása",
    copy: "Másolás", download: "TXT letöltése", reset: "Ürítés",
    sample: "Példa betöltése", prompt: "Kész prompt", resolution: "Javasolt képfelbontás",
    alternatives: "Más jó választások", why: "Miért ezt ajánljuk?",
    privacy: "Helyben működik · a beírt szöveg nem kerül szerverre",
    disclaimer: "A felbontás kiindulási javaslat, nem modellgarancia. A szabadon beírt szöveget az eszköz nem fordítja le.",
    copied: "Másolva", empty: "Írj be legalább egy alapötletet vagy fő témát.",
    auto: "Automatikus", portrait: "Álló / teljes alak", landscape: "Fekvő / jelenet",
    square: "Négyzetes", wide: "Szélesvásznú", macro: "Makró / közelkép",
    low: "Kímélő", balanced: "Kiegyensúlyozott", high: "Részletesebb",
    soundNone: "Néma", soundAmbient: "Természetes környezet", soundMusic: "Finom zene",
    soundCustom: "Egyedi hangterv", memoryLow: "8 GB vagy kevesebb",
    memoryMid: "12 GB körül", memoryHigh: "24 GB vagy több",
    ideaPlaceholder: "Például: hajnalban kinyíló vízililiom a tavon",
    subjectPlaceholder: "Ki vagy mi legyen a képen?",
    actionPlaceholder: "Mi történjen, milyen sorrendben?",
    settingPlaceholder: "Környezet, háttér, időjárás...",
    negativePlaceholder: "Például: torz szirmok, felirat, hirtelen kameraváltás",
    musicPlaceholder: "Például: halk, meleg zongora és vonósok",
    translationNote: "A választott sablon nyelve változik. A saját szavaid változatlanul maradnak.",
    firstStep: "1 · Alapötlet", visualStep: "2 · Képi világ",
    technicalStep: "3 · Technika és hang", resultStep: "4 · Eredmény",
    tips: "Tipp: a videós mozgást írd le időrendben, kevés egymással versengő történéssel."
  },
  EN: {
    tagline: "From image to idea. From idea to precise prompt.",
    image: "Image", video: "Video", interfaceLanguage: "Interface language",
    outputLanguage: "Prompt language", brief: "Core idea", subject: "Subject",
    action: "Action / movement", setting: "Setting and background",
    style: "Visual style", lighting: "Lighting", camera: "Camera and framing",
    mood: "Mood", negatives: "Avoid", model: "Image model",
    memory: "Hardware profile", frame: "Composition", quality: "Detail level",
    duration: "Duration", sound: "Sound", noVoice: "No dialogue",
    music: "Music / sound direction", build: "Build prompt",
    copy: "Copy", download: "Download TXT", reset: "Clear",
    sample: "Load example", prompt: "Generated prompt", resolution: "Suggested image resolution",
    alternatives: "Other good choices", why: "Why this size?",
    privacy: "Runs locally in your browser · your text is not sent to a server",
    disclaimer: "Resolution is a starting recommendation, not a model guarantee. Free text is not automatically translated.",
    copied: "Copied", empty: "Enter at least a core idea or subject.",
    auto: "Automatic", portrait: "Portrait / full body", landscape: "Landscape / scene",
    square: "Square", wide: "Cinematic wide", macro: "Macro / close-up",
    low: "Lightweight", balanced: "Balanced", high: "More detail",
    soundNone: "Silent", soundAmbient: "Natural ambience", soundMusic: "Gentle music",
    soundCustom: "Custom sound", memoryLow: "8 GB or less",
    memoryMid: "Around 12 GB", memoryHigh: "24 GB or more",
    ideaPlaceholder: "For example: a water lily opening at sunrise",
    subjectPlaceholder: "Who or what is in the frame?",
    actionPlaceholder: "What happens, and in what order?",
    settingPlaceholder: "Environment, background, weather...",
    negativePlaceholder: "For example: distorted petals, text, abrupt cuts",
    musicPlaceholder: "For example: soft piano and warm strings",
    translationNote: "The template changes language. Your own words remain unchanged.",
    firstStep: "1 · Core idea", visualStep: "2 · Visual direction",
    technicalStep: "3 · Technical and sound", resultStep: "4 · Result",
    tips: "Tip: describe video motion in sequence, with only a few competing actions."
  },
  DE: {
    tagline: "Vom Bild zur Idee. Von der Idee zum präzisen Prompt.",
    image: "Bild", video: "Video", interfaceLanguage: "Sprache der Oberfläche",
    outputLanguage: "Sprache des Prompts", brief: "Grundidee", subject: "Hauptmotiv",
    action: "Handlung / Bewegung", setting: "Ort und Hintergrund",
    style: "Bildstil", lighting: "Licht", camera: "Kamera und Bildausschnitt",
    mood: "Stimmung", negatives: "Vermeiden", model: "Bildmodell",
    memory: "Hardwareprofil", frame: "Komposition", quality: "Detailgrad",
    duration: "Dauer", sound: "Ton", noVoice: "Keine Sprache",
    music: "Musik / Klang", build: "Prompt erstellen",
    copy: "Kopieren", download: "TXT herunterladen", reset: "Leeren",
    sample: "Beispiel laden", prompt: "Fertiger Prompt", resolution: "Empfohlene Bildauflösung",
    alternatives: "Weitere Optionen", why: "Warum diese Größe?",
    privacy: "Läuft lokal im Browser · Texte werden nicht an einen Server gesendet",
    disclaimer: "Die Auflösung ist ein Ausgangspunkt, keine Modellgarantie. Freitext wird nicht automatisch übersetzt.",
    copied: "Kopiert", empty: "Bitte Grundidee oder Motiv eingeben.",
    auto: "Automatisch", portrait: "Hochformat / ganze Figur", landscape: "Querformat / Szene",
    square: "Quadratisch", wide: "Breitbild", macro: "Makro / Nahaufnahme",
    low: "Sparsam", balanced: "Ausgewogen", high: "Mehr Details",
    soundNone: "Stumm", soundAmbient: "Natürliche Umgebung", soundMusic: "Sanfte Musik",
    soundCustom: "Eigener Klang", memoryLow: "8 GB oder weniger",
    memoryMid: "Etwa 12 GB", memoryHigh: "24 GB oder mehr",
    ideaPlaceholder: "Zum Beispiel: Seerose öffnet sich bei Sonnenaufgang",
    subjectPlaceholder: "Wer oder was ist im Bild?",
    actionPlaceholder: "Was geschieht in welcher Reihenfolge?",
    settingPlaceholder: "Umgebung, Hintergrund, Wetter...",
    negativePlaceholder: "Zum Beispiel: verzerrte Blüten, Text, harte Schnitte",
    musicPlaceholder: "Zum Beispiel: leises Klavier und warme Streicher",
    translationNote: "Die Vorlage wechselt die Sprache. Eigene Wörter bleiben unverändert.",
    firstStep: "1 · Grundidee", visualStep: "2 · Bildgestaltung",
    technicalStep: "3 · Technik und Ton", resultStep: "4 · Ergebnis",
    tips: "Tipp: Videobewegung zeitlich geordnet und mit wenigen Aktionen beschreiben."
  },
  FR: {
    tagline: "De l'image à l'idée. De l'idée au prompt précis.",
    image: "Image", video: "Vidéo", interfaceLanguage: "Langue de l'interface",
    outputLanguage: "Langue du prompt", brief: "Idée centrale", subject: "Sujet principal",
    action: "Action / mouvement", setting: "Lieu et arrière-plan",
    style: "Style visuel", lighting: "Lumière", camera: "Caméra et cadrage",
    mood: "Ambiance", negatives: "À éviter", model: "Modèle d'image",
    memory: "Profil matériel", frame: "Composition", quality: "Niveau de détail",
    duration: "Durée", sound: "Son", noVoice: "Sans dialogue",
    music: "Musique / ambiance sonore", build: "Créer le prompt",
    copy: "Copier", download: "Télécharger TXT", reset: "Effacer",
    sample: "Charger un exemple", prompt: "Prompt final", resolution: "Résolution conseillée",
    alternatives: "Autres choix", why: "Pourquoi cette taille ?",
    privacy: "Fonctionne dans le navigateur · aucun texte envoyé au serveur",
    disclaimer: "La résolution est une suggestion initiale, pas une garantie. Le texte libre n'est pas traduit automatiquement.",
    copied: "Copié", empty: "Saisissez au moins une idée ou un sujet.",
    auto: "Automatique", portrait: "Portrait / plein pied", landscape: "Paysage / scène",
    square: "Carré", wide: "Cinémascope", macro: "Macro / gros plan",
    low: "Économe", balanced: "Équilibré", high: "Plus de détails",
    soundNone: "Muet", soundAmbient: "Ambiance naturelle", soundMusic: "Musique douce",
    soundCustom: "Son personnalisé", memoryLow: "8 Go ou moins",
    memoryMid: "Environ 12 Go", memoryHigh: "24 Go ou plus",
    ideaPlaceholder: "Exemple : un nénuphar s'ouvre à l'aube",
    subjectPlaceholder: "Qui ou quoi apparaît à l'image ?",
    actionPlaceholder: "Que se passe-t-il, dans quel ordre ?",
    settingPlaceholder: "Lieu, arrière-plan, météo...",
    negativePlaceholder: "Exemple : pétales déformés, texte, coupes brusques",
    musicPlaceholder: "Exemple : piano doux et cordes chaleureuses",
    translationNote: "Le modèle change de langue. Vos propres mots restent inchangés.",
    firstStep: "1 · Idée", visualStep: "2 · Direction visuelle",
    technicalStep: "3 · Technique et son", resultStep: "4 · Résultat",
    tips: "Conseil : décrivez les mouvements vidéo dans l'ordre, sans trop d'actions simultanées."
  },
  ES: {
    tagline: "De la imagen a la idea. De la idea al prompt preciso.",
    image: "Imagen", video: "Vídeo", interfaceLanguage: "Idioma de la interfaz",
    outputLanguage: "Idioma del prompt", brief: "Idea principal", subject: "Sujeto",
    action: "Acción / movimiento", setting: "Lugar y fondo",
    style: "Estilo visual", lighting: "Iluminación", camera: "Cámara y encuadre",
    mood: "Atmósfera", negatives: "Evitar", model: "Modelo de imagen",
    memory: "Perfil del equipo", frame: "Composición", quality: "Nivel de detalle",
    duration: "Duración", sound: "Sonido", noVoice: "Sin diálogo",
    music: "Música / ambiente sonoro", build: "Crear prompt",
    copy: "Copiar", download: "Descargar TXT", reset: "Borrar",
    sample: "Cargar ejemplo", prompt: "Prompt final", resolution: "Resolución recomendada",
    alternatives: "Otras opciones", why: "¿Por qué este tamaño?",
    privacy: "Funciona en el navegador · el texto no se envía al servidor",
    disclaimer: "La resolución es una recomendación inicial, no una garantía. El texto libre no se traduce automáticamente.",
    copied: "Copiado", empty: "Escribe una idea o un sujeto.",
    auto: "Automático", portrait: "Vertical / cuerpo entero", landscape: "Horizontal / escena",
    square: "Cuadrado", wide: "Panorámico", macro: "Macro / primer plano",
    low: "Ligero", balanced: "Equilibrado", high: "Más detalle",
    soundNone: "Silencio", soundAmbient: "Ambiente natural", soundMusic: "Música suave",
    soundCustom: "Sonido personalizado", memoryLow: "8 GB o menos",
    memoryMid: "Unos 12 GB", memoryHigh: "24 GB o más",
    ideaPlaceholder: "Por ejemplo: un nenúfar se abre al amanecer",
    subjectPlaceholder: "¿Quién o qué aparece en la imagen?",
    actionPlaceholder: "¿Qué ocurre y en qué orden?",
    settingPlaceholder: "Entorno, fondo, clima...",
    negativePlaceholder: "Por ejemplo: pétalos deformes, texto, cortes bruscos",
    musicPlaceholder: "Por ejemplo: piano suave y cuerdas cálidas",
    translationNote: "La plantilla cambia de idioma. Tus palabras permanecen igual.",
    firstStep: "1 · Idea", visualStep: "2 · Estilo visual",
    technicalStep: "3 · Técnica y sonido", resultStep: "4 · Resultado",
    tips: "Consejo: describe el movimiento en orden y evita demasiadas acciones simultáneas."
  },
  IT: {
    tagline: "Dall'immagine all'idea. Dall'idea al prompt preciso.",
    image: "Immagine", video: "Video", interfaceLanguage: "Lingua interfaccia",
    outputLanguage: "Lingua del prompt", brief: "Idea principale", subject: "Soggetto",
    action: "Azione / movimento", setting: "Luogo e sfondo",
    style: "Stile visivo", lighting: "Luce", camera: "Camera e inquadratura",
    mood: "Atmosfera", negatives: "Da evitare", model: "Modello immagine",
    memory: "Profilo hardware", frame: "Composizione", quality: "Livello di dettaglio",
    duration: "Durata", sound: "Audio", noVoice: "Senza dialoghi",
    music: "Musica / atmosfera sonora", build: "Crea prompt",
    copy: "Copia", download: "Scarica TXT", reset: "Cancella",
    sample: "Carica esempio", prompt: "Prompt finale", resolution: "Risoluzione consigliata",
    alternatives: "Altre opzioni", why: "Perché questa dimensione?",
    privacy: "Funziona nel browser · il testo non viene inviato a un server",
    disclaimer: "La risoluzione è un punto di partenza, non una garanzia. Il testo libero non viene tradotto automaticamente.",
    copied: "Copiato", empty: "Inserisci almeno un'idea o un soggetto.",
    auto: "Automatico", portrait: "Verticale / figura intera", landscape: "Orizzontale / scena",
    square: "Quadrato", wide: "Panoramico", macro: "Macro / primo piano",
    low: "Leggero", balanced: "Bilanciato", high: "Più dettagli",
    soundNone: "Muto", soundAmbient: "Ambiente naturale", soundMusic: "Musica delicata",
    soundCustom: "Audio personalizzato", memoryLow: "8 GB o meno",
    memoryMid: "Circa 12 GB", memoryHigh: "24 GB o più",
    ideaPlaceholder: "Per esempio: una ninfea si apre all'alba",
    subjectPlaceholder: "Chi o cosa appare nell'immagine?",
    actionPlaceholder: "Cosa accade e in quale ordine?",
    settingPlaceholder: "Ambiente, sfondo, meteo...",
    negativePlaceholder: "Per esempio: petali deformati, testo, tagli bruschi",
    musicPlaceholder: "Per esempio: piano soffice e archi caldi",
    translationNote: "Il modello cambia lingua. Le tue parole restano invariate.",
    firstStep: "1 · Idea", visualStep: "2 · Stile visivo",
    technicalStep: "3 · Tecnica e audio", resultStep: "4 · Risultato",
    tips: "Consiglio: descrivi il movimento in sequenza, con poche azioni simultanee."
  },
  PT: {
    tagline: "Da imagem à ideia. Da ideia ao prompt preciso.",
    image: "Imagem", video: "Vídeo", interfaceLanguage: "Idioma da interface",
    outputLanguage: "Idioma do prompt", brief: "Ideia central", subject: "Assunto",
    action: "Ação / movimento", setting: "Local e fundo",
    style: "Estilo visual", lighting: "Iluminação", camera: "Câmara e enquadramento",
    mood: "Atmosfera", negatives: "Evitar", model: "Modelo de imagem",
    memory: "Perfil do computador", frame: "Composição", quality: "Nível de detalhe",
    duration: "Duração", sound: "Som", noVoice: "Sem diálogo",
    music: "Música / ambiente sonoro", build: "Criar prompt",
    copy: "Copiar", download: "Descarregar TXT", reset: "Limpar",
    sample: "Carregar exemplo", prompt: "Prompt final", resolution: "Resolução sugerida",
    alternatives: "Outras opções", why: "Porquê este tamanho?",
    privacy: "Funciona no navegador · o texto não é enviado a um servidor",
    disclaimer: "A resolução é uma sugestão inicial, não uma garantia. O texto livre não é traduzido automaticamente.",
    copied: "Copiado", empty: "Introduza pelo menos uma ideia ou assunto.",
    auto: "Automático", portrait: "Vertical / corpo inteiro", landscape: "Horizontal / cena",
    square: "Quadrado", wide: "Panorâmico", macro: "Macro / grande plano",
    low: "Leve", balanced: "Equilibrado", high: "Mais detalhe",
    soundNone: "Silêncio", soundAmbient: "Ambiente natural", soundMusic: "Música suave",
    soundCustom: "Som personalizado", memoryLow: "8 GB ou menos",
    memoryMid: "Cerca de 12 GB", memoryHigh: "24 GB ou mais",
    ideaPlaceholder: "Por exemplo: um nenúfar abre ao nascer do sol",
    subjectPlaceholder: "Quem ou o quê aparece na imagem?",
    actionPlaceholder: "O que acontece e em que ordem?",
    settingPlaceholder: "Ambiente, fundo, clima...",
    negativePlaceholder: "Por exemplo: pétalas deformadas, texto, cortes abruptos",
    musicPlaceholder: "Por exemplo: piano suave e cordas quentes",
    translationNote: "O modelo muda de idioma. As suas palavras ficam iguais.",
    firstStep: "1 · Ideia", visualStep: "2 · Direção visual",
    technicalStep: "3 · Técnica e som", resultStep: "4 · Resultado",
    tips: "Dica: descreva o movimento por ordem, com poucas ações simultâneas."
  },
  PL: {
    tagline: "Od obrazu do pomysłu. Od pomysłu do precyzyjnego promptu.",
    image: "Obraz", video: "Wideo", interfaceLanguage: "Język interfejsu",
    outputLanguage: "Język promptu", brief: "Główny pomysł", subject: "Temat",
    action: "Akcja / ruch", setting: "Miejsce i tło",
    style: "Styl obrazu", lighting: "Oświetlenie", camera: "Kamera i kadrowanie",
    mood: "Nastrój", negatives: "Unikaj", model: "Model obrazu",
    memory: "Profil sprzętu", frame: "Kompozycja", quality: "Poziom szczegółów",
    duration: "Czas trwania", sound: "Dźwięk", noVoice: "Bez dialogu",
    music: "Muzyka / nastrój dźwięku", build: "Zbuduj prompt",
    copy: "Kopiuj", download: "Pobierz TXT", reset: "Wyczyść",
    sample: "Wczytaj przykład", prompt: "Gotowy prompt", resolution: "Sugerowana rozdzielczość",
    alternatives: "Inne możliwości", why: "Dlaczego ten rozmiar?",
    privacy: "Działa w przeglądarce · tekst nie trafia na serwer",
    disclaimer: "Rozdzielczość jest sugestią, nie gwarancją. Własny tekst nie jest tłumaczony automatycznie.",
    copied: "Skopiowano", empty: "Wpisz pomysł lub temat.",
    auto: "Automatycznie", portrait: "Pion / cała postać", landscape: "Poziom / scena",
    square: "Kwadrat", wide: "Szeroki kadr", macro: "Makro / zbliżenie",
    low: "Oszczędnie", balanced: "Zrównoważenie", high: "Więcej detali",
    soundNone: "Cisza", soundAmbient: "Naturalne otoczenie", soundMusic: "Delikatna muzyka",
    soundCustom: "Własny dźwięk", memoryLow: "8 GB lub mniej",
    memoryMid: "Około 12 GB", memoryHigh: "24 GB lub więcej",
    ideaPlaceholder: "Na przykład: lilia wodna otwiera się o świcie",
    subjectPlaceholder: "Kto lub co jest w kadrze?",
    actionPlaceholder: "Co się dzieje i w jakiej kolejności?",
    settingPlaceholder: "Otoczenie, tło, pogoda...",
    negativePlaceholder: "Na przykład: zdeformowane płatki, tekst, nagłe cięcia",
    musicPlaceholder: "Na przykład: cichy fortepian i ciepłe smyczki",
    translationNote: "Szablon zmienia język. Twoje słowa pozostają bez zmian.",
    firstStep: "1 · Pomysł", visualStep: "2 · Styl wizualny",
    technicalStep: "3 · Technika i dźwięk", resultStep: "4 · Wynik",
    tips: "Wskazówka: opisuj ruch po kolei, bez zbyt wielu działań naraz."
  }
};

export const options = {
  style: {
    cinematic: ["filmes hatású, fotórealisztikus", "cinematic photorealism", "filmischer Fotorealismus", "photoréalisme cinématographique", "fotorrealismo cinematográfico", "fotorealismo cinematografico", "fotorrealismo cinematográfico", "filmowy fotorealizm"],
    editorial: ["igényes szerkesztőségi fotó", "editorial photography", "hochwertige Editorial-Fotografie", "photographie éditoriale", "fotografía editorial", "fotografia editoriale", "fotografia editorial", "fotografia edytorialna"],
    painterly: ["festői, finom textúrák", "painterly, delicate textures", "malerisch, feine Texturen", "pictural, textures délicates", "pictórico, texturas delicadas", "pittorico, trame delicate", "pictórico, texturas delicadas", "malarski, delikatne tekstury"],
    natural: ["természetfotós realizmus", "natural documentary realism", "natürlicher Dokumentarstil", "réalisme documentaire naturel", "realismo documental natural", "realismo documentaristico naturale", "realismo documental natural", "naturalny realizm dokumentalny"]
  },
  lighting: {
    dawn: ["hajnali aranyfény", "soft golden dawn light", "weiches goldenes Morgenlicht", "douce lumière dorée de l'aube", "luz dorada suave del amanecer", "morbida luce dorata dell'alba", "luz dourada suave do amanhecer", "miękkie złote światło świtu"],
    soft: ["lágy, szórt fény", "soft diffused light", "weiches diffuses Licht", "lumière douce et diffuse", "luz suave y difusa", "luce morbida e diffusa", "luz suave e difusa", "miękkie rozproszone światło"],
    dramatic: ["drámai ellenfény", "dramatic backlight", "dramatisches Gegenlicht", "contre-jour dramatique", "contraluz dramático", "controluce drammatico", "contraluz dramática", "dramatyczne światło kontrowe"],
    studio: ["tiszta stúdióvilágítás", "clean studio lighting", "klare Studiobeleuchtung", "éclairage de studio net", "iluminación de estudio limpia", "illuminazione da studio pulita", "iluminação de estúdio limpa", "czyste oświetlenie studyjne"]
  },
  camera: {
    locked: ["stabil kamera", "locked-off camera", "statische Kamera", "caméra fixe", "cámara fija", "camera fissa", "câmara fixa", "nieruchoma kamera"],
    handheld: ["kézből tartott kamera", "handheld camera", "Handkamera", "caméra à main levée", "cámara en mano", "camera a mano", "câmara à mão", "kamera z ręki"],
    slowpush: ["lassú, egyenletes közelítés", "slow steady push-in", "langsame gleichmäßige Kamerafahrt", "lent rapprochement régulier", "acercamiento lento y estable", "lento avvicinamento uniforme", "aproximação lenta e estável", "powolny, płynny najazd kamery"],
    orbit: ["lassú kameraív a téma körül", "slow camera orbit around the subject", "langsamer Kamerabogen um das Motiv", "lent arc de caméra autour du sujet", "órbita lenta de cámara alrededor del sujeto", "lento arco di camera attorno al soggetto", "órbita lenta da câmara em torno do assunto", "powolny łuk kamery wokół obiektu"],
    macro: ["makró nézet, kis mélységélesség", "macro view, shallow depth of field", "Makroaufnahme, geringe Schärfentiefe", "vue macro, faible profondeur de champ", "vista macro, poca profundidad de campo", "ripresa macro, profondità di campo ridotta", "vista macro, pouca profundidade de campo", "ujęcie makro, mała głębia ostrości"]
  },
  mood: {
    serene: ["nyugodt, elmélyült", "serene and contemplative", "ruhig und nachdenklich", "serein et contemplatif", "sereno y contemplativo", "sereno e contemplativo", "sereno e contemplativo", "spokojny i refleksyjny"],
    wondrous: ["lélegzetelállító és varázslatos", "breathtaking and wondrous", "atemberaubend und magisch", "saisissant et merveilleux", "impresionante y mágico", "mozzafiato e magico", "deslumbrante e mágico", "zapierający dech i magiczny"],
    energetic: ["lendületes és dinamikus", "energetic and dynamic", "energiegeladen und dynamisch", "énergique et dynamique", "enérgico y dinámico", "energico e dinamico", "enérgico e dinâmico", "energiczny i dynamiczny"],
    intimate: ["meghitt és visszafogott", "intimate and restrained", "intim und zurückhaltend", "intime et retenu", "íntimo y contenido", "intimo e misurato", "íntimo e contido", "intymny i stonowany"]
  }
};

const headings = {
  HU: ["Összefoglaló", "Fő téma", "Történés", "Környezet", "Képi világ", "Kamera", "Fény", "Hangulat", "Technika", "Hang", "Zene", "Korlátok"],
  EN: ["Summary", "Subject", "Action", "Setting", "Visual style", "Camera", "Lighting", "Mood", "Technical", "Soundscape", "Music", "Constraints"],
  DE: ["Zusammenfassung", "Motiv", "Handlung", "Umgebung", "Bildstil", "Kamera", "Licht", "Stimmung", "Technik", "Ton", "Musik", "Einschränkungen"],
  FR: ["Résumé", "Sujet", "Action", "Décor", "Style visuel", "Caméra", "Lumière", "Ambiance", "Technique", "Son", "Musique", "Contraintes"],
  ES: ["Resumen", "Sujeto", "Acción", "Entorno", "Estilo visual", "Cámara", "Luz", "Ambiente", "Técnica", "Sonido", "Música", "Restricciones"],
  IT: ["Sintesi", "Soggetto", "Azione", "Ambiente", "Stile visivo", "Camera", "Luce", "Atmosfera", "Tecnica", "Audio", "Musica", "Vincoli"],
  PT: ["Resumo", "Assunto", "Ação", "Cenário", "Estilo visual", "Câmara", "Luz", "Ambiente", "Técnica", "Som", "Música", "Restrições"],
  PL: ["Podsumowanie", "Temat", "Akcja", "Otoczenie", "Styl wizualny", "Kamera", "Światło", "Nastrój", "Technika", "Dźwięk", "Muzyka", "Ograniczenia"]
};
export function promptSectionHeadings(language="EN"){return [...(headings[language]||headings.EN)];}

const phrases = {
  HU: {
    continuous: "egybefüggő felvétel; a téma azonossága és a képi folytonosság maradjon meg",
    silent: "csend, generált hang nélkül", ambient: "tiszta, visszafogott természetes környezeti hang",
    music: "finom hangszeres zene, gépies zúgás nélkül", custom: "egyedi hangterv",
    noVoice: "beszéd és ének nélkül"
  },
  EN: {
    continuous: "continuous shot; preserve subject identity and visual continuity",
    silent: "silence, no generated audio", ambient: "clean, restrained natural ambience",
    music: "gentle instrumental music, no mechanical hum", custom: "custom sound design",
    noVoice: "no speech or singing"
  },
  DE: {
    continuous: "durchgehende Einstellung; Motividentität und visuelle Kontinuität erhalten",
    silent: "Stille, kein generierter Ton", ambient: "klare, zurückhaltende Naturgeräusche",
    music: "sanfte Instrumentalmusik ohne maschinelles Brummen", custom: "individuelle Klanggestaltung",
    noVoice: "ohne Sprache oder Gesang"
  },
  FR: {
    continuous: "plan continu ; préserver l'identité du sujet et la continuité visuelle",
    silent: "silence, sans audio généré", ambient: "ambiance naturelle propre et discrète",
    music: "musique instrumentale douce, sans bourdonnement mécanique", custom: "création sonore personnalisée",
    noVoice: "sans parole ni chant"
  },
  ES: {
    continuous: "plano continuo; conservar la identidad del sujeto y la continuidad visual",
    silent: "silencio, sin audio generado", ambient: "ambiente natural limpio y discreto",
    music: "música instrumental suave, sin zumbido mecánico", custom: "diseño de sonido personalizado",
    noVoice: "sin voz ni canto"
  },
  IT: {
    continuous: "ripresa continua; mantenere identità del soggetto e continuità visiva",
    silent: "silenzio, senza audio generato", ambient: "suoni naturali puliti e discreti",
    music: "musica strumentale delicata, senza ronzio meccanico", custom: "progetto sonoro personalizzato",
    noVoice: "senza parlato né canto"
  },
  PT: {
    continuous: "plano contínuo; preservar a identidade do assunto e a continuidade visual",
    silent: "silêncio, sem áudio gerado", ambient: "ambiente natural limpo e discreto",
    music: "música instrumental suave, sem zumbido mecânico", custom: "desenho sonoro personalizado",
    noVoice: "sem fala nem canto"
  },
  PL: {
    continuous: "ujęcie ciągłe; zachowaj tożsamość obiektu i spójność obrazu",
    silent: "cisza, bez generowanego dźwięku", ambient: "czyste, subtelne odgłosy natury",
    music: "delikatna muzyka instrumentalna, bez mechanicznego szumu", custom: "własny projekt dźwięku",
    noVoice: "bez mowy i śpiewu"
  }
};

const aspectKeywords = {
  portrait: ["portrait", "vertical", "full body", "standing", "álló", "teljes alak", "portré", "táncos", "dancer"],
  wide: ["panorama", "panoráma", "cinemascope", "ultrawide", "szélesvásznú"],
  macro: ["macro", "makró", "close-up", "közelkép", "flower", "virág", "petal", "szirom"],
  landscape: ["landscape", "horizontal", "fekvő", "tájkép", "meadow", "rét", "waterfall", "vízesés"]
};

export function inferFrame(text) {
  const value = String(text || "").toLocaleLowerCase();
  for (const key of ["portrait", "wide", "macro", "landscape"]) {
    if (aspectKeywords[key].some((word) => value.includes(word))) return key;
  }
  return "square";
}

export function recommendResolution(state) {
  const frame = state.frame && state.frame !== "auto"
    ? state.frame
    : ["full", "cowboy", "portrait"].includes(state.shot) ? "portrait"
    : state.shot === "wide" ? "landscape"
    : state.shot === "close" ? "macro"
    : inferFrame([state.brief, state.subject, state.setting].join(" "));
  const memory = state.memory || "mid";
  const quality = state.quality || "balanced";
  const rank = memory === "low" ? 0
    : memory === "high" ? (quality === "low" ? 1 : 2)
    : quality === "low" ? 0 : 1;
  const kreaPresets = {
    portrait: [[704, 1216], [768, 1344], [896, 1536]],
    landscape: [[1216, 704], [1344, 768], [1536, 896]],
    square: [[896, 896], [1024, 1024], [1152, 1152]],
    wide: [[1280, 640], [1408, 704], [1664, 832]],
    macro: [[896, 896], [1024, 1024], [1152, 1152]]
  };
  const sdxlPresets = {
    portrait: [[768, 1152], [832, 1216], [896, 1344]],
    landscape: [[1152, 768], [1216, 832], [1344, 896]],
    square: [[896, 896], [1024, 1024], [1152, 1152]],
    wide: [[1152, 640], [1344, 704], [1536, 768]],
    macro: [[896, 896], [1024, 1024], [1152, 1152]]
  };
  const presets = state.model === "sdxl" ? sdxlPresets : kreaPresets;
  const selected = presets[frame] || presets.square;
  const [width, height] = selected[rank];
  return {
    width, height, frame, rank,
    alternatives: selected.filter((pair, index) => index !== rank),
    megapixels: ((width * height) / 1000000).toFixed(2)
  };
}

function localizedOption(group, key, language) {
  const row = options[group][key] || options[group][Object.keys(options[group])[0]];
  return row[languages.indexOf(language)] || row[1];
}

const humanSubject = /(?:^|[^\p{L}])(?:person|people|woman|women|man|men|adult|child|girl|boy|dancer|artist|musician|traveler|traveller|model|portrait|human|ember|nő|nők|férfi|felnőtt|gyerek|lány|fiú|táncos|művész|portré|mensch|frau|mann|kind|tänzer|personne|femme|homme|enfant|danseur|persona|mujer|hombre|niño|niña|bailarín|donna|uomo|bambino|ballerino|pessoa|mulher|homem|criança|dançarino|osoba|kobieta|mężczyzna|dziecko|tancerz)(?=$|[^\p{L}])/iu;
const anatomyPositive = {
  EN:"If hands are visible, each hand has four distinct fingers and one opposable thumb, naturally attached with plausible joints and proportions. If bare feet are visible, each foot has five separate toes; legs and ankles connect naturally.",
  HU:"Ha a kezek láthatók, mindegyiken négy különálló ujj és egy hüvelykujj van, természetes csatlakozással, ízületekkel és arányokkal. Ha a mezítelen lábak láthatók, mindegyik lábfejen öt különálló lábujj van; a lábszár és a boka természetesen kapcsolódik.",
  DE:"Wenn Hände sichtbar sind, hat jede Hand vier getrennte Finger und einen Daumen, natürlich verbunden und proportioniert. Wenn nackte Füße sichtbar sind, hat jeder Fuß fünf getrennte Zehen; Beine und Knöchel sind natürlich verbunden.",
  FR:"Si les mains sont visibles, chacune a quatre doigts distincts et un pouce, avec des articulations et des proportions naturelles. Si les pieds nus sont visibles, chacun a cinq orteils distincts ; les jambes et les chevilles sont cohérentes.",
  ES:"Si se ven las manos, cada una tiene cuatro dedos separados y un pulgar, con articulaciones y proporciones naturales. Si se ven los pies descalzos, cada uno tiene cinco dedos separados; las piernas y los tobillos se unen de forma natural.",
  IT:"Se le mani sono visibili, ognuna ha quattro dita distinte e un pollice, con articolazioni e proporzioni naturali. Se i piedi nudi sono visibili, ognuno ha cinque dita distinte; gambe e caviglie sono collegate naturalmente.",
  PT:"Se as mãos estiverem visíveis, cada uma terá quatro dedos distintos e um polegar, com articulações e proporções naturais. Se os pés descalços estiverem visíveis, cada um terá cinco dedos distintos; pernas e tornozelos ligam-se naturalmente.",
  PL:"Jeśli dłonie są widoczne, każda ma cztery oddzielne palce i jeden kciuk, z naturalnymi stawami i proporcjami. Jeśli bose stopy są widoczne, każda ma pięć oddzielnych palców; nogi i kostki łączą się naturalnie."
};
const anatomyNegative = {
  EN:"extra or missing fingers, extra or missing thumbs, fused fingers, duplicated hands, extra arms, extra legs, malformed feet, extra or missing toes",
  HU:"többlet- vagy hiányzó kézujjak, többlet- vagy hiányzó hüvelykujj, összenőtt ujjak, duplikált kezek, többletkarok, többletlábak, torz lábfejek, többlet- vagy hiányzó lábujjak",
  DE:"zusätzliche oder fehlende Finger, zusätzliche oder fehlende Daumen, verwachsene Finger, doppelte Hände, zusätzliche Arme oder Beine, verformte Füße, zusätzliche oder fehlende Zehen",
  FR:"doigts supplémentaires ou manquants, pouces supplémentaires ou manquants, doigts fusionnés, mains dupliquées, bras ou jambes supplémentaires, pieds déformés, orteils supplémentaires ou manquants",
  ES:"dedos adicionales o ausentes, pulgares adicionales o ausentes, dedos fusionados, manos duplicadas, brazos o piernas adicionales, pies deformados, dedos de los pies adicionales o ausentes",
  IT:"dita aggiuntive o mancanti, pollici aggiuntivi o mancanti, dita fuse, mani duplicate, braccia o gambe aggiuntive, piedi deformati, dita dei piedi aggiuntive o mancanti",
  PT:"dedos a mais ou em falta, polegares a mais ou em falta, dedos fundidos, mãos duplicadas, braços ou pernas extra, pés deformados, dedos dos pés a mais ou em falta",
  PL:"dodatkowe lub brakujące palce dłoni, dodatkowe lub brakujące kciuki, zrośnięte palce, zdublowane dłonie, dodatkowe ręce lub nogi, zniekształcone stopy, dodatkowe lub brakujące palce stóp"
};

export function anatomyGuidance(state) {
  const language = languages.includes(state.outputLanguage) ? state.outputLanguage : "EN";
  const text = [state.brief,state.subject,state.action].join(" ");
  if (state.mode !== "image" || state.anatomy === false || !humanSubject.test(text)) return {positive:"",negative:""};
  return {positive:anatomyPositive[language],negative:state.model === "flux" ? "" : anatomyNegative[language]};
}

export function buildPrompt(state) {
  const language = languages.includes(state.outputLanguage) ? state.outputLanguage : "EN";
  const labels = headings[language];
  const words = phrases[language];
  const anatomy = anatomyGuidance(state);
  const line = (index, value) => value ? labels[index] + ": " + value.trim() : "";
  const resolution = recommendResolution(state);
  const summary = String(state.brief || "").trim();
  const subject = String(state.subject || "").trim();
  if (!summary && !subject) return "";
  const selectedMedium = state.mode === "image" && state.medium && state.medium !== "auto"
    ? imageDirectionValue("medium", state.medium, language) : "";
  const style = [selectedMedium || (String(state.medium || "").startsWith("user:") ? "" : localizedOption("style", state.style || "cinematic", language)),
    productionPhrase("production", state.production, language)].filter(Boolean).join("; ");
  const lighting = state.mode === "image" && photoProfileActive(state) && state.photoLight && state.photoLight !== "auto"
    ? "" : localizedOption("lighting", state.lighting || "soft", language);
  const camera = state.mode === "image"
    ? imageDirectionParts(state, language).join("; ")
    : [localizedOption("camera", state.camera || "locked", language),
      productionPhrase("device", state.device, language),
      productionPhrase("stability", state.stability, language)].filter(Boolean).join("; ");
  const mood = localizedOption("mood", state.mood || "serene", language);
  const customHeadings = { HU:"Saját képi irány", EN:"Custom visual direction", DE:"Eigene Bildgestaltung", FR:"Direction visuelle personnalisée", ES:"Dirección visual personalizada", IT:"Direzione visiva personale", PT:"Direção visual personalizada", PL:"Własny kierunek wizualny" };
  const lines = [
    state.mode === "image" ? imageOpening(state, language) : state.customQuality || qualityPrefixPhrase(state.qualityPrefix, language),
    line(0, summary || subject),
    line(1, subject),
    line(2, String(state.action || "")),
    line(3, String(state.setting || "")),
    line(4, style),
    line(5, camera),
    line(6, lighting),
    line(7, mood)
  ];
  if (state.customDirections) lines.push(`${customHeadings[language]}: ${String(state.customDirections).trim()}`);
  if (anatomy.positive) lines.push(anatomy.positive);
  if (state.mode === "video") {
    const seconds = Number(state.duration) || 8;
    lines.push(line(8, String(seconds) + " s · " + words.continuous));
    const soundText = state.sound === "none" ? words.silent
      : state.sound === "ambient" ? words.ambient
      : state.sound === "music" ? words.music
      : String(state.music || words.custom);
    lines.push(line(9, soundText + (state.noVoice ? "; " + words.noVoice : "")));
    if (state.sound === "music" && state.music) lines.push(line(10, String(state.music)));
  } else {
    lines.push(line(8, String(resolution.width) + " × " + String(resolution.height)
      + " px · " + (ui[language][resolution.frame] || resolution.frame)));
  }
  const negatives = [String(state.negatives || "").trim(),anatomy.negative].filter(Boolean).join(", ");
  lines.push(line(11, negatives));
  return lines.filter(Boolean).join("\n");
}
