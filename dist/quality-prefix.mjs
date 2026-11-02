export const qualityLanguages = ["HU", "EN", "DE", "FR", "ES", "IT", "PT", "PL"];
export const qualityCopy = {
  label:["Promptnyitás / részletesség", "Prompt opening / detail", "Promptbeginn / Detail", "Début du prompt / détail", "Inicio del prompt / detalle", "Apertura del prompt / dettaglio", "Abertura do prompt / detalhe", "Początek promptu / szczegóły"],
  choices:{
    auto:["Nincs külön nyitás", "No extra opening", "Kein Zusatz", "Sans ajout", "Sin añadido", "Nessuna aggiunta", "Sem adição", "Bez dodatku"],
    editorial:["Szerkesztőségi minőség", "Editorial quality", "Editoriale Qualität", "Qualité éditoriale", "Calidad editorial", "Qualità editoriale", "Qualidade editorial", "Jakość edytorialna"],
    proPhoto:["Pro fotós nyitás · ajánlott", "Pro photo opening · recommended", "Profi-Fotoeinstieg · empfohlen", "Ouverture photo pro · recommandée", "Inicio fotográfico profesional · recomendado", "Apertura fotografica professionale · consigliata", "Abertura fotográfica profissional · recomendada", "Profesjonalny wstęp fotograficzny · zalecany"],
    creativeArt:["Művészi nyitás", "Creative art opening", "Künstlerischer Einstieg", "Ouverture artistique", "Inicio artístico", "Apertura artistica", "Abertura artística", "Artystyczny wstęp"],
    detailed:["Gazdag részletek", "Rich detail", "Hoher Detailgrad", "Détails riches", "Detalles ricos", "Ricchezza di dettagli", "Detalhe rico", "Bogactwo szczegółów"],
    masterpiece:["Masterpiece · editorial · ultra detailed", "Masterpiece · editorial · ultra detailed", "Meisterwerk · editorial · sehr detailliert", "Chef-d’œuvre · éditorial · très détaillé", "Obra maestra · editorial · ultradetallado", "Capolavoro · editoriale · ultra dettagliato", "Obra-prima · editorial · ultradetalhado", "Arcydzieło · edytorialnie · bardzo szczegółowo"],
    natural:["Természetes, nem túlfeldolgozott", "Natural, not overprocessed", "Natürlich, nicht überbearbeitet", "Naturel, sans surtraitement", "Natural, sin exceso de procesado", "Naturale, senza eccessiva elaborazione", "Natural, sem processamento excessivo", "Naturalnie, bez nadmiernej obróbki"]
  },
  phrases:{
    editorial:["szerkesztőségi minőség, gondos kompozíció, kifinomult tónusok", "editorial quality, carefully composed, refined tones", "editoriale Qualität, sorgfältige Komposition, feine Farbtöne", "qualité éditoriale, composition soignée, tons raffinés", "calidad editorial, composición cuidada, tonos refinados", "qualità editoriale, composizione curata, toni raffinati", "qualidade editorial, composição cuidada, tons refinados", "jakość edytorialna, staranna kompozycja, wyrafinowane tony"],
    proPhoto:[
      "Magával ragadó, fotórealisztikus szerkesztőségi fénykép világos vizuális súlyponttal; a fő téma tűéles fókuszban, természetes mélységélességgel, hihető anatómiával és életszerű textúrákkal; a jelenethez illő árnyalt fények, részletek a világos és sötét részeken is; tudatos, mégis természetes kompozíció, emlékezetes pillanat, visszafogott filmes színvilág, műanyag hatás, túlzott simítás és túlélesítés nélkül",
      "A compelling, photorealistic editorial photograph with a clear visual focal point; the main subject in tack-sharp focus, with natural depth of field, believable anatomy and lifelike textures; nuanced, scene-appropriate lighting reveals fine detail in both highlights and shadows; intentional yet unstaged composition, an authentic memorable moment, rich but restrained colors and subtle filmic grading, without plastic-looking surfaces, excessive smoothing or oversharpening",
      "Ein eindrucksvolles, fotorealistisches Editorial-Foto mit klarem Blickfang; das Hauptmotiv gestochen scharf, mit natürlicher Tiefenschärfe, glaubwürdiger Anatomie und lebensechten Texturen; zur Szene passendes, nuanciertes Licht mit Details in Lichtern und Schatten; bewusste, dennoch ungestellte Komposition, ein authentischer, unvergesslicher Moment, zurückhaltende filmische Farbgebung, ohne künstlich glatte Oberflächen oder Überschärfung",
      "Une photographie éditoriale photoréaliste et saisissante, avec un point focal clair ; le sujet principal parfaitement net, une profondeur de champ naturelle, une anatomie crédible et des textures réalistes ; une lumière nuancée adaptée à la scène, préservant les détails dans les hautes lumières et les ombres ; une composition soignée mais spontanée, un moment authentique et mémorable, des couleurs riches mais mesurées, sans aspect plastique ni lissage ou accentuation excessifs",
      "Una fotografía editorial fotorrealista e impactante, con un punto focal claro; el sujeto principal perfectamente enfocado, con profundidad de campo natural, anatomía creíble y texturas realistas; iluminación matizada y adecuada a la escena, con detalle en luces y sombras; composición cuidada pero espontánea, un momento auténtico y memorable, colores intensos pero contenidos, sin aspecto plástico, suavizado ni enfoque excesivos",
      "Una fotografia editoriale fotorealistica e coinvolgente, con un chiaro punto focale; il soggetto principale nitidissimo, con profondità di campo naturale, anatomia credibile e texture realistiche; luce sfumata e adatta alla scena, con dettagli nelle alte luci e nelle ombre; composizione studiata ma spontanea, un momento autentico e memorabile, colori ricchi ma misurati, senza superfici plastiche, levigatura o nitidezza eccessive",
      "Uma fotografia editorial fotorrealista e marcante, com um ponto focal claro; o motivo principal muito nítido, com profundidade de campo natural, anatomia plausível e texturas realistas; luz subtil e adequada à cena, com pormenores nas zonas claras e nas sombras; composição cuidada mas espontânea, um momento autêntico e memorável, cores ricas mas contidas, sem aspeto plástico, suavização ou nitidez excessivas",
      "Wyrazista, fotorealistyczna fotografia edytorialna z wyraźnym punktem skupienia; główny temat idealnie ostry, z naturalną głębią ostrości, wiarygodną anatomią i realistycznymi fakturami; subtelne światło dopasowane do sceny, zachowujące detale w światłach i cieniach; przemyślana, lecz niewymuszona kompozycja, autentyczna i pamiętna chwila, bogate, lecz stonowane kolory, bez plastikowych powierzchni, nadmiernego wygładzania i wyostrzania"
    ],
    creativeArt:["Kifejező, igényesen kidolgozott műalkotás világos vizuális súlyponttal, tudatos kompozícióval és a választott technikához illő, következetes részletekkel", "Expressive, carefully crafted artwork with a clear visual focal point, intentional composition and coherent details suited to the chosen medium", "Ausdrucksstarkes, sorgfältig gestaltetes Kunstwerk mit klarem Blickfang, bewusster Komposition und stimmigen Details passend zum gewählten Medium", "Œuvre expressive et soignée, avec un point focal clair, une composition réfléchie et des détails cohérents avec la technique choisie", "Obra expresiva y cuidada, con un punto focal claro, composición deliberada y detalles coherentes con la técnica elegida", "Opera espressiva e curata, con un chiaro punto focale, composizione studiata e dettagli coerenti con la tecnica scelta", "Obra expressiva e cuidada, com um ponto focal claro, composição intencional e detalhes coerentes com a técnica escolhida", "Ekspresyjne, starannie wykonane dzieło z wyraźnym punktem skupienia, przemyślaną kompozycją i detalami spójnymi z wybraną techniką"],
    detailed:["gazdag, életszerű részletek és finom textúrák", "rich believable detail and fine textures", "reiche glaubwürdige Details und feine Texturen", "détails riches et crédibles, textures fines", "detalles ricos y creíbles, texturas finas", "dettagli ricchi e credibili, trame fini", "detalhes ricos e credíveis, texturas finas", "bogate, wiarygodne detale i delikatne faktury"],
    masterpiece:["masterpiece, szerkesztőségi minőség, rendkívül részletes", "masterpiece, editorial quality, ultra detailed", "Meisterwerk, editoriale Qualität, sehr detailliert", "chef-d’œuvre, qualité éditoriale, ultra détaillé", "obra maestra, calidad editorial, ultradetallado", "capolavoro, qualità editoriale, ultra dettagliato", "obra-prima, qualidade editorial, ultradetalhado", "arcydzieło, jakość edytorialna, niezwykle szczegółowo"],
    natural:["természetes részletek, hihető textúrák, túlfeldolgozás nélkül", "natural detail, believable textures, no overprocessing", "natürliche Details, glaubwürdige Texturen, keine Überbearbeitung", "détails naturels, textures crédibles, sans surtraitement", "detalle natural, texturas creíbles, sin sobreprocesado", "dettagli naturali, trame credibili, senza eccessiva elaborazione", "detalhe natural, texturas credíveis, sem processamento excessivo", "naturalne detale, wiarygodne faktury, bez nadmiernej obróbki"]
  }
};

export function qualityPrefixPhrase(value, language = "EN") {
  const index = qualityLanguages.indexOf(language);
  return qualityCopy.phrases[value]?.[index < 0 ? 1 : index] || "";
}

export function renderQualityPrefixSelector(prefix, language = "EN") {
  const select = document.getElementById(`${prefix}-quality-prefix`);
  const label = document.getElementById(`${prefix}-quality-prefix-label`);
  if (!select || !label) return;
  const index = qualityLanguages.indexOf(language), previous = select.value;
  label.textContent = qualityCopy.label[index < 0 ? 1 : index];
  select.replaceChildren();
  for (const [value, names] of Object.entries(qualityCopy.choices)) {
    if (["proPhoto", "creativeArt"].includes(value) && !["still", "i2i"].includes(prefix)) continue;
    const option = document.createElement("option"); option.value = value; option.textContent = names[index < 0 ? 1 : index]; select.appendChild(option);
  }
  select.value = [...select.options].some((option) => option.value === previous) ? previous : "auto";
}

const photoCopy = {
  genreLabel:["Fotós irány", "Photographic direction", "Fotografische Richtung", "Direction photographique", "Dirección fotográfica", "Direzione fotografica", "Direção fotográfica", "Kierunek fotograficzny"],
  lightLabel:["Fény / napszak", "Light / time of day", "Licht / Tageszeit", "Lumière / moment de la journée", "Luz / hora del día", "Luce / ora del giorno", "Luz / hora do dia", "Światło / pora dnia"],
  auto:["Nincs külön választás", "No extra choice", "Keine zusätzliche Wahl", "Aucun choix supplémentaire", "Sin elección adicional", "Nessuna scelta aggiuntiva", "Sem escolha adicional", "Bez dodatkowego wyboru"],
  help:["A fotós irány és a fény szabadon kombinálható. A választott fény bekerül a nyitásba; a kész prompt szerkeszthető.", "Combine the photographic direction and lighting freely. The chosen light is included in the opening; the final prompt stays editable.", "Fotografische Richtung und Licht sind frei kombinierbar. Das gewählte Licht erscheint im Einstieg; der Prompt bleibt bearbeitbar.", "Combinez librement direction photographique et lumière. La lumière choisie figure dans l'ouverture ; le prompt reste modifiable.", "Combina libremente la dirección fotográfica y la luz. La luz elegida aparece al inicio; el prompt sigue siendo editable.", "Combina liberamente la direzione fotografica e la luce. La luce scelta compare nell'apertura; il prompt resta modificabile.", "Combine livremente a direção fotográfica e a luz. A luz escolhida aparece na abertura; o prompt continua editável.", "Łącz dowolnie kierunek fotograficzny i światło. Wybrane światło pojawia się we wstępie; prompt nadal można edytować."],
  artWarning:["A profi fotós nyitás festményhez, plakáthoz vagy grafikához nem illik, ezért itt nem kerül a promptba. Válassz fotós képtípust, vagy másik promptnyitást.", "The pro photo opening conflicts with painting, poster or graphic art, so it is not added here. Choose a photographic medium or another opening.", "Der Profi-Fotoeinstieg passt nicht zu Gemälde, Plakat oder Grafik und wird hier nicht eingefügt. Wähle ein Fotomedium oder einen anderen Einstieg.", "L'ouverture photo pro ne convient pas à la peinture, l'affiche ou l'illustration : elle n'est pas ajoutée. Choisissez un médium photo ou une autre ouverture.", "El inicio fotográfico profesional no encaja con pintura, cartel o ilustración, así que no se añade. Elige un medio fotográfico u otro inicio.", "L'apertura fotografica professionale non si adatta a dipinti, poster o illustrazioni, quindi non viene aggiunta. Scegli un medium fotografico o un'altra apertura.", "A abertura fotográfica profissional não combina com pintura, cartaz ou ilustração e não é adicionada. Escolha um meio fotográfico ou outra abertura.", "Profesjonalny wstęp fotograficzny nie pasuje do obrazu malarskiego, plakatu ani grafiki, więc nie zostanie dodany. Wybierz medium fotograficzne lub inny wstęp."]
};

const photoGenres = {
  glamour:{
    label:["Glamour", "Glamour", "Glamour", "Glamour", "Glamour", "Glamour", "Glamour", "Glamour"],
    phrase:["elegáns glamour portré, kifinomult styling, természetes bőrtextúra és magabiztos jelenlét", "refined glamour portraiture, elegant styling, natural skin texture and confident presence", "raffiniertes Glamourporträt, elegantes Styling, natürliche Hauttextur und selbstbewusste Ausstrahlung", "portrait glamour raffiné, style élégant, texture de peau naturelle et présence assurée", "retrato glamour refinado, estilo elegante, textura de piel natural y presencia segura", "ritratto glamour raffinato, styling elegante, texture della pelle naturale e presenza sicura", "retrato glamour requintado, estilo elegante, textura natural da pele e presença confiante", "wyrafinowany portret glamour, elegancka stylizacja, naturalna faktura skóry i pewna siebie obecność"]
  },
  portrait:{
    label:["Portré", "Portrait", "Porträt", "Portrait", "Retrato", "Ritratto", "Retrato", "Portret"],
    phrase:["kifejező portré, őszinte arcrészletek, a tekintet és az érzelem legyen a középpontban", "expressive portraiture, honest facial detail, attention on the eyes and expression", "ausdrucksstarkes Porträt, echte Gesichtsdetails, Fokus auf Augen und Ausdruck", "portrait expressif, détails du visage authentiques, attention portée au regard et à l'expression", "retrato expresivo, detalles faciales naturales, atención a los ojos y la expresión", "ritratto espressivo, dettagli del volto autentici, attenzione agli occhi e all'espressione", "retrato expressivo, detalhes faciais autênticos, atenção aos olhos e à expressão", "ekspresyjny portret, naturalne detale twarzy, uwaga skupiona na oczach i wyrazie twarzy"]
  },
  nature:{
    label:["Természet / táj", "Nature / landscape", "Natur / Landschaft", "Nature / paysage", "Naturaleza / paisaje", "Natura / paesaggio", "Natureza / paisagem", "Przyroda / krajobraz"],
    phrase:["magával ragadó természetfotó, hiteles növényzet és terep, rétegzett távmélység", "immersive nature photography, authentic vegetation and terrain, layered distance and depth", "eindrucksvolle Naturfotografie, glaubwürdige Vegetation und Landschaft, gestaffelte Tiefe", "photographie de nature immersive, végétation et terrain crédibles, profondeur en plusieurs plans", "fotografía de naturaleza envolvente, vegetación y terreno auténticos, profundidad en varios planos", "fotografia naturalistica immersiva, vegetazione e terreno autentici, profondità su più piani", "fotografia de natureza envolvente, vegetação e terreno autênticos, profundidade em vários planos", "wciągająca fotografia przyrody, wiarygodna roślinność i teren, wieloplanowa głębia"]
  },
  wildlife:{
    label:["Vadvilág", "Wildlife", "Tierwelt", "Faune sauvage", "Fauna salvaje", "Fauna selvatica", "Vida selvagem", "Dzika przyroda"],
    phrase:["természetes állati viselkedés, pontos szőr- vagy tollrészletek, tiszteletteljes távolságból készült vadvilágfotó", "natural animal behavior, accurate fur or feather detail, respectful wildlife photography", "natürliches Tierverhalten, genaue Fell- oder Federdetails, respektvolle Tierfotografie", "comportement animal naturel, détails fidèles des poils ou plumes, photographie animalière respectueuse", "comportamiento animal natural, detalle fiel del pelaje o las plumas, fotografía de fauna respetuosa", "comportamento animale naturale, dettagli fedeli di pelo o piume, fotografia naturalistica rispettosa", "comportamento animal natural, detalhes fiéis do pelo ou das penas, fotografia de vida selvagem respeitosa", "naturalne zachowanie zwierząt, wierne detale futra lub piór, fotografia z poszanowaniem dzikiej przyrody"]
  },
  fashion:{
    label:["Divat / editorial", "Fashion / editorial", "Mode / Editorial", "Mode / éditorial", "Moda / editorial", "Moda / editoriale", "Moda / editorial", "Moda / edytorial"],
    phrase:["igényes divatfotó, tisztán látható ruhaanyagok és sziluett, gondos, de nem merev póz", "high-end fashion editorial, clear fabric texture and silhouette, carefully directed yet natural pose", "hochwertiges Mode-Editorial, klare Stofftextur und Silhouette, sorgfältig geführte, natürliche Pose", "éditorial de mode soigné, texture des tissus et silhouette lisibles, pose dirigée mais naturelle", "editorial de moda cuidado, textura de la ropa y silueta claras, pose dirigida pero natural", "editoriale di moda curato, texture dei tessuti e silhouette definite, posa guidata ma naturale", "editorial de moda cuidado, textura dos tecidos e silhueta nítidas, pose orientada mas natural", "dopracowana fotografia modowa, czytelna faktura tkanin i sylwetka, poza kierowana, lecz naturalna"]
  },
  documentary:{
    label:["Dokumentarista", "Documentary", "Dokumentarisch", "Documentaire", "Documental", "Documentaristico", "Documental", "Dokumentalny"],
    phrase:["megfigyelő dokumentarista fotó, spontán gesztusok és hihető apró tökéletlenségek", "observational documentary photography, candid gestures and believable small imperfections", "beobachtende Dokumentarfotografie, spontane Gesten und glaubwürdige kleine Unvollkommenheiten", "photographie documentaire d'observation, gestes spontanés et petites imperfections crédibles", "fotografía documental observacional, gestos espontáneos y pequeñas imperfecciones creíbles", "fotografia documentaristica d'osservazione, gesti spontanei e piccole imperfezioni credibili", "fotografia documental de observação, gestos espontâneos e pequenas imperfeições plausíveis", "obserwacyjna fotografia dokumentalna, spontaniczne gesty i wiarygodne drobne niedoskonałości"]
  },
  architecture:{
    label:["Építészet / enteriőr", "Architecture / interiors", "Architektur / Innenräume", "Architecture / intérieurs", "Arquitectura / interiores", "Architettura / interni", "Arquitetura / interiores", "Architektura / wnętrza"],
    phrase:["építészeti fotó tiszta geometriával, hiteles perspektívával és anyagtextúrákkal", "architectural photography with clean geometry, believable perspective and material textures", "Architekturfotografie mit klarer Geometrie, glaubwürdiger Perspektive und Materialtexturen", "photographie d'architecture aux lignes nettes, perspective crédible et matières réalistes", "fotografía arquitectónica con geometría clara, perspectiva creíble y texturas de materiales", "fotografia architettonica con geometrie pulite, prospettiva credibile e texture dei materiali", "fotografia de arquitetura com geometria limpa, perspetiva plausível e texturas dos materiais", "fotografia architektury o czystej geometrii, wiarygodnej perspektywie i fakturach materiałów"]
  }
};

const photoLights = {
  evening:{
    label:["Este", "Evening", "Abend", "Soir", "Atardecer", "Sera", "Fim de tarde", "Wieczór"],
    phrase:["finom, halványuló esti fény, természetes árnyékrészletek", "soft fading evening light with natural shadow detail", "weiches, schwindendes Abendlicht mit natürlichen Schattendetails", "douce lumière du soir déclinante, détails naturels dans les ombres", "luz suave del final de la tarde, detalles naturales en las sombras", "luce serale morbida e calante, dettagli naturali nelle ombre", "luz suave do fim da tarde, detalhes naturais nas sombras", "miękkie, gasnące światło wieczoru z naturalnymi detalami w cieniach"]
  },
  sunset:{
    label:["Napnyugta", "Sunset", "Sonnenuntergang", "Coucher de soleil", "Puesta de sol", "Tramonto", "Pôr do sol", "Zachód słońca"],
    phrase:["alacsonyan érkező meleg napnyugtafény, hosszú következetes árnyékok, narancsszínű túltolás nélkül", "low warm sunset light, long coherent shadows, warm highlights without an excessive orange cast", "tiefes warmes Sonnenuntergangslicht, lange stimmige Schatten, warme Lichter ohne übermäßigen Orangestich", "lumière chaude et basse du coucher de soleil, longues ombres cohérentes, sans dominante orange excessive", "luz cálida y baja del atardecer, sombras largas y coherentes, sin dominante naranja excesiva", "luce calda e bassa del tramonto, ombre lunghe e coerenti, senza dominante arancione eccessiva", "luz quente e baixa do pôr do sol, sombras longas e coerentes, sem dominante laranja excessiva", "niskie ciepłe światło zachodu, długie spójne cienie, bez przesadnie pomarańczowej dominanty"]
  },
  dawn:{
    label:["Hajnal", "Dawn", "Morgendämmerung", "Aube", "Amanecer", "Alba", "Amanhecer", "Świt"],
    phrase:["hűvös hajnali légkör, visszafogott meleg peremfény és finom pára", "cool dawn atmosphere, restrained warm rim light and delicate haze", "kühle Morgenstimmung, dezentes warmes Kantenlicht und feiner Dunst", "atmosphère fraîche de l'aube, léger contre-jour chaud et brume délicate", "atmósfera fresca del amanecer, luz cálida de contorno y neblina sutil", "atmosfera fresca dell'alba, lieve luce calda sui bordi e foschia delicata", "atmosfera fresca do amanhecer, luz quente discreta nos contornos e névoa delicada", "chłodna atmosfera świtu, subtelne ciepłe światło krawędziowe i delikatna mgła"]
  },
  studio:{
    label:["Stúdiófény", "Studio lighting", "Studiolicht", "Éclairage de studio", "Luz de estudio", "Luce da studio", "Iluminação de estúdio", "Światło studyjne"],
    phrase:["gondosan formált stúdiófények, lágy árnyékok, a textúrák ellaposítása nélkül", "controlled studio lighting, shaped highlights and soft shadows without flattening texture", "kontrolliertes Studiolicht, geformte Spitzlichter und weiche Schatten ohne verflachte Texturen", "éclairage de studio maîtrisé, hautes lumières modelées et ombres douces sans aplatir les textures", "iluminación de estudio controlada, luces modeladas y sombras suaves sin aplanar las texturas", "illuminazione da studio controllata, luci modellate e ombre morbide senza appiattire le texture", "iluminação de estúdio controlada, realces modelados e sombras suaves sem achatar as texturas", "kontrolowane światło studyjne, modelowane światła i miękkie cienie bez spłaszczania faktur"]
  },
  overcast:{
    label:["Borult, szórt fény", "Overcast daylight", "Bewölktes Tageslicht", "Ciel couvert", "Luz de cielo nublado", "Luce nuvolosa", "Luz de céu nublado", "Pochmurne światło dzienne"],
    phrase:["szórt fény borult ég alatt, finom tónuskülönbségek és egyenletes részletek", "diffuse overcast daylight, subtle tonal separation and evenly visible detail", "diffuses Tageslicht bei Bewölkung, feine Tonabstufungen und gleichmäßige Details", "lumière diffuse sous ciel couvert, nuances subtiles et détails uniformément visibles", "luz difusa bajo cielo nublado, matices sutiles y detalles visibles de manera uniforme", "luce diffusa sotto cielo coperto, sottili separazioni tonali e dettagli uniformi", "luz difusa sob céu nublado, separação tonal subtil e detalhes visíveis de forma uniforme", "rozproszone światło pochmurnego dnia, subtelne różnice tonalne i równomiernie widoczne detale"]
  },
  blueHour:{
    label:["Kék óra", "Blue hour", "Blaue Stunde", "Heure bleue", "Hora azul", "Ora blu", "Hora azul", "Błękitna godzina"],
    phrase:["kék órabeli környezeti fény, visszafogottan kiegyensúlyozott meleg mesterséges fények", "blue-hour ambient light balanced with restrained warm practical lights", "Umgebungslicht der blauen Stunde, ausgewogen mit dezenten warmen Lichtquellen", "lumière ambiante de l'heure bleue équilibrée par de discrètes lumières chaudes", "luz ambiental de la hora azul equilibrada con luces cálidas discretas", "luce ambientale dell'ora blu bilanciata da discrete luci calde", "luz ambiente da hora azul equilibrada com luzes quentes discretas", "światło błękitnej godziny zrównoważone subtelnymi ciepłymi źródłami światła"]
  },
  night:{
    label:["Éjszaka", "Night", "Nacht", "Nuit", "Noche", "Notte", "Noite", "Noc"],
    phrase:["hiteles éjszakai expozíció visszafogott csúcsfényekkel és megőrzött árnyékrészletekkel", "credible low-light night exposure with restrained highlights and retained shadow detail", "glaubwürdige Nachtaufnahme mit dezenten Lichtern und erhaltenen Schattendetails", "exposition nocturne crédible, hautes lumières mesurées et détails préservés dans les ombres", "exposición nocturna creíble, luces altas contenidas y detalle conservado en sombras", "esposizione notturna credibile, alte luci contenute e dettagli conservati nelle ombre", "exposição noturna credível, realces contidos e detalhes preservados nas sombras", "wiarygodna nocna ekspozycja z umiarkowanymi światłami i zachowanymi detalami cieni"]
  }
};

const artMedia = new Set(["painting", "poster", "graphic"]);
export function photoProfileActive(selection) {
  return selection?.qualityPrefix === "proPhoto" && !artMedia.has(selection.medium) &&
    !(selection.medium === "auto" && selection.style === "painterly");
}

export function photoOpening(selection, language = "EN") {
  const base = selection?.customQuality || qualityPrefixPhrase(selection?.qualityPrefix, language);
  if (selection?.qualityPrefix !== "proPhoto") return base;
  if (!photoProfileActive(selection)) return "";
  const index = qualityLanguages.indexOf(language);
  const localized = index < 0 ? 1 : index;
  return [base, photoGenres[selection.photoGenre]?.phrase[localized], photoLights[selection.photoLight]?.phrase[localized]]
    .filter(Boolean).join("; ");
}

export function renderPhotoPresetSelectors(prefix, language = "EN") {
  const index = qualityLanguages.indexOf(language);
  const localized = index < 0 ? 1 : index;
  for (const [kind, entries] of [["genre", photoGenres], ["light", photoLights]]) {
    const select = document.getElementById(`${prefix}-photo-${kind}`);
    const label = document.getElementById(`${prefix}-photo-${kind}-label`);
    if (!select || !label) continue;
    const previous = select.value;
    label.textContent = photoCopy[`${kind}Label`][localized];
    select.replaceChildren();
    const automatic = document.createElement("option"); automatic.value = "auto"; automatic.textContent = photoCopy.auto[localized]; select.appendChild(automatic);
    for (const [value, item] of Object.entries(entries)) {
      const option = document.createElement("option"); option.value = value; option.textContent = item.label[localized]; select.appendChild(option);
    }
    select.value = previous in entries ? previous : "auto";
  }
  syncPhotoPresetControls(prefix, language);
}

export function syncPhotoPresetControls(prefix, language = "EN", visible = true) {
  const group = document.getElementById(`${prefix}-photo-presets`);
  const help = document.getElementById(`${prefix}-photo-help`);
  const quality = document.getElementById(`${prefix}-quality-prefix`);
  if (!group || !help || !quality) return;
  const selection = {
    qualityPrefix:quality.value,
    medium:document.getElementById(`${prefix}-medium`)?.value,
    style:prefix === "still" ? document.getElementById("style")?.value : undefined
  };
  const requested = quality.value === "proPhoto";
  const active = photoProfileActive(selection);
  const index = qualityLanguages.indexOf(language);
  group.hidden = !visible || !active;
  help.hidden = !visible || !requested;
  help.textContent = active ? photoCopy.help[index < 0 ? 1 : index] : photoCopy.artWarning[index < 0 ? 1 : index];
}

const artCopy = {
  label:["Művészi irány", "Artistic direction", "Künstlerische Richtung", "Direction artistique", "Dirección artística", "Direzione artistica", "Direção artística", "Kierunek artystyczny"],
  auto:["Nincs külön irány", "No extra direction", "Keine zusätzliche Richtung", "Aucune direction supplémentaire", "Sin dirección adicional", "Nessuna direzione aggiuntiva", "Sem direção adicional", "Bez dodatkowego kierunku"],
  help:["A lehetőségek a választott képtípushoz igazodnak. A kész prompt szerkeszthető.", "Options match the selected image medium. The final prompt stays editable.", "Die Optionen passen zum gewählten Bildmedium. Der Prompt bleibt bearbeitbar.", "Les options correspondent au médium choisi. Le prompt reste modifiable.", "Las opciones se ajustan al medio elegido. El prompt sigue siendo editable.", "Le opzioni seguono il medium scelto. Il prompt resta modificabile.", "As opções correspondem ao meio escolhido. O prompt continua editável.", "Opcje pasują do wybranego medium. Prompt nadal można edytować."],
  warning:["A művészi nyitás fotós vagy filmes képtípushoz nem kerül a promptba. Válassz festményt, plakátot, grafikát vagy meglévő képi stílust.", "The creative art opening is not added to a photo or film still. Choose painting, poster, graphic, or keep the current visual style.", "Der künstlerische Einstieg wird bei Foto oder Filmstill nicht ergänzt. Wähle Gemälde, Plakat, Grafik oder den bisherigen Bildstil.", "L'ouverture artistique n'est pas ajoutée à une photo ou une image de film. Choisissez peinture, affiche, illustration ou le style actuel.", "El inicio artístico no se añade a una foto ni a un fotograma. Elige pintura, cartel, ilustración o mantén el estilo actual.", "L'apertura artistica non viene aggiunta a foto o fotogrammi. Scegli dipinto, poster, grafica o mantieni lo stile attuale.", "A abertura artística não é adicionada a fotos nem fotogramas. Escolha pintura, cartaz, grafismo ou mantenha o estilo atual.", "Artystyczny wstęp nie jest dodawany do zdjęcia ani kadru filmowego. Wybierz malarstwo, plakat, grafikę lub zachowaj obecny styl."]
};

const artStyles = {
  oil:{ media:["auto", "painting"], label:["Olajfestmény", "Oil painting", "Ölgemälde", "Peinture à l'huile", "Óleo", "Dipinto a olio", "Pintura a óleo", "Obraz olejny"], phrase:["rétegzett olajfestés, látható ecsetmunka és gazdag pigmenttextúra", "layered oil paint, visible brushwork and rich pigment texture", "geschichtete Ölfarbe, sichtbare Pinselstriche und reiche Pigmentstruktur", "peinture à l'huile en couches, coups de pinceau visibles et texture riche des pigments", "óleo en capas, pinceladas visibles y rica textura de pigmentos", "pittura a olio stratificata, pennellate visibili e ricca texture del pigmento", "tinta a óleo em camadas, pinceladas visíveis e rica textura dos pigmentos", "warstwowa farba olejna, widoczne pociągnięcia pędzla i bogata faktura pigmentu"] },
  watercolor:{ media:["auto", "painting"], label:["Akvarell", "Watercolor", "Aquarell", "Aquarelle", "Acuarela", "Acquerello", "Aguarela", "Akwarela"], phrase:["áttetsző akvarellrétegek, finom papírtextúra és természetes pigmentfolyás", "translucent watercolor washes, subtle paper texture and natural pigment flow", "transparente Aquarelllasuren, feine Papierstruktur und natürlicher Pigmentfluss", "lavis d'aquarelle translucides, texture délicate du papier et diffusion naturelle des pigments", "veladuras translúcidas de acuarela, textura fina del papel y flujo natural del pigmento", "velature traslucide ad acquerello, trama delicata della carta e flusso naturale del pigmento", "camadas translúcidas de aguarela, textura subtil do papel e fluxo natural do pigmento", "przezroczyste warstwy akwareli, delikatna faktura papieru i naturalny przepływ pigmentu"] },
  expressive:{ media:["auto", "painting"], label:["Expresszív festmény", "Expressive painting", "Expressive Malerei", "Peinture expressive", "Pintura expresiva", "Pittura espressiva", "Pintura expressiva", "Malarstwo ekspresyjne"], phrase:["lendületes ecsetvonások, karakteres formák és a jelenet érzelméhez illő színek", "confident gestural brushwork, distinctive shapes and color guided by the scene's emotion", "kraftvolle gestische Pinselstriche, markante Formen und von der Stimmung geprägte Farben", "gestes picturaux affirmés, formes marquées et couleurs guidées par l'émotion de la scène", "pinceladas gestuales seguras, formas distintivas y color guiado por la emoción de la escena", "pennellate gestuali decise, forme distintive e colori guidati dall'emozione della scena", "pinceladas gestuais seguras, formas distintas e cores guiadas pela emoção da cena", "zdecydowane pociągnięcia pędzla, wyraziste formy i kolory oddające emocje sceny"] },
  illustration:{ media:["auto", "graphic", "poster"], label:["Digitális illusztráció", "Digital illustration", "Digitale Illustration", "Illustration numérique", "Ilustración digital", "Illustrazione digitale", "Ilustração digital", "Ilustracja cyfrowa"], phrase:["tiszta formák, következetes rajzolt részletek és gondosan rétegzett digitális illusztráció", "clean shapes, consistent drawn details and carefully layered digital illustration", "klare Formen, stimmige gezeichnete Details und sorgfältig geschichtete digitale Illustration", "formes nettes, détails dessinés cohérents et illustration numérique soigneusement construite", "formas claras, detalles dibujados coherentes e ilustración digital cuidadosamente elaborada", "forme pulite, dettagli disegnati coerenti e illustrazione digitale stratificata con cura", "formas claras, detalhes desenhados coerentes e ilustração digital cuidadosamente trabalhada", "czyste kształty, spójne rysunkowe detale i starannie warstwowa ilustracja cyfrowa"] },
  graffiti:{ media:["auto", "graphic"], label:["Graffiti / street art", "Graffiti / street art", "Graffiti / Street-Art", "Graffiti / art urbain", "Grafiti / arte urbano", "Graffiti / street art", "Graffiti / arte urbana", "Graffiti / street art"], phrase:["eredeti street art kompozíció, határozott kontúrok, sprayfesték-rétegek és hiteles falfelület", "original street-art composition, bold outlines, layered spray paint and believable wall texture", "originelle Street-Art-Komposition, kräftige Konturen, geschichtete Sprühfarbe und glaubwürdige Wandstruktur", "composition de street art originale, contours affirmés, couches de peinture en aérosol et texture crédible du mur", "composición original de arte urbano, contornos marcados, capas de aerosol y textura creíble del muro", "composizione originale di street art, contorni decisi, strati di vernice spray e texture credibile del muro", "composição original de arte urbana, contornos marcantes, camadas de tinta spray e textura plausível da parede", "oryginalna kompozycja street artu, wyraziste kontury, warstwy farby w sprayu i wiarygodna faktura ściany"] },
  poster:{ media:["auto", "poster", "graphic"], label:["Művészi plakát", "Art poster", "Kunstplakat", "Affiche artistique", "Cartel artístico", "Poster artistico", "Cartaz artístico", "Plakat artystyczny"], phrase:["erős plakátkompozíció, jól olvasható vizuális hierarchia és tudatos negatív tér, kitalált felirat nélkül", "bold poster composition, clear visual hierarchy and deliberate negative space, without invented lettering", "prägnante Plakatkomposition, klare visuelle Hierarchie und bewusster Negativraum, ohne erfundene Schrift", "composition d'affiche marquée, hiérarchie visuelle claire et espace négatif maîtrisé, sans texte inventé", "composición de cartel potente, jerarquía visual clara y espacio negativo deliberado, sin texto inventado", "composizione da poster incisiva, chiara gerarchia visiva e spazio negativo intenzionale, senza scritte inventate", "composição de cartaz marcante, hierarquia visual clara e espaço negativo deliberado, sem texto inventado", "wyrazista kompozycja plakatu, czytelna hierarchia wizualna i świadome puste przestrzenie, bez wymyślonych napisów"] },
  collage:{ media:["auto", "graphic", "poster"], label:["Kollázs", "Collage", "Collage", "Collage", "Collage", "Collage", "Colagem", "Kolaż"], phrase:["rétegzett papír- és képkivágások, tapintható felületek és összefogott kollázskompozíció", "layered paper and image cutouts, tactile surfaces and a cohesive collage composition", "geschichtete Papier- und Bildausschnitte, fühlbare Oberflächen und eine stimmige Collage", "découpes de papier et d'images superposées, surfaces tactiles et composition de collage cohérente", "recortes de papel e imágenes superpuestos, superficies táctiles y composición de collage coherente", "ritagli di carta e immagini sovrapposti, superfici tattili e composizione di collage coerente", "recortes de papel e imagens em camadas, superfícies táteis e composição de colagem coesa", "warstwowe wycinki papieru i obrazów, wyczuwalne faktury i spójna kompozycja kolażu"] }
};

export function artProfileActive(selection) {
  return selection?.qualityPrefix === "creativeArt" && !["photo", "film"].includes(selection.medium);
}

export function imageOpening(selection, language = "EN") {
  if (selection?.qualityPrefix === "proPhoto") return photoOpening(selection, language);
  const base = selection?.customQuality || qualityPrefixPhrase(selection?.qualityPrefix, language);
  if (selection?.qualityPrefix !== "creativeArt") return base;
  if (!artProfileActive(selection)) return "";
  const index = qualityLanguages.indexOf(language);
  const chosen = artStyles[selection.artStyle];
  return [base, chosen?.media.includes(selection.medium || "auto") ? chosen.phrase[index < 0 ? 1 : index] : ""].filter(Boolean).join("; ");
}
// Exact phrases generated by Studio, used for scoped medium changes rather than broad word deletion.
export function generatedQualityMedia(){
  return qualityLanguages.flatMap((language,index)=>[
    {language,kind:"photo",opening:true,value:qualityCopy.phrases.proPhoto[index]},
    {language,kind:"art",opening:true,value:qualityCopy.phrases.creativeArt[index]},
    ...Object.values(photoGenres).map(p=>({language,kind:"photo",value:p.phrase[index]})),
    ...Object.values(artStyles).map(p=>({language,kind:"art",value:p.phrase[index]}))
  ]);
}

export function renderArtPresetSelector(prefix, language = "EN") {
  const select = document.getElementById(`${prefix}-art-style`);
  const label = document.getElementById(`${prefix}-art-style-label`);
  if (!select || !label) return;
  const index = qualityLanguages.indexOf(language);
  const localized = index < 0 ? 1 : index;
  const previous = select.value;
  const medium = document.getElementById(`${prefix}-medium`)?.value || "auto";
  label.textContent = artCopy.label[localized];
  select.replaceChildren();
  const automatic = document.createElement("option"); automatic.value = "auto"; automatic.textContent = artCopy.auto[localized]; select.appendChild(automatic);
  for (const [value, choice] of Object.entries(artStyles)) {
    if (!choice.media.includes(medium)) continue;
    const option = document.createElement("option"); option.value = value; option.textContent = choice.label[localized]; select.appendChild(option);
  }
  select.value = [...select.options].some((option) => option.value === previous) ? previous : "auto";
  syncArtPresetControls(prefix, language);
}

export function syncArtPresetControls(prefix, language = "EN", visible = true) {
  const group = document.getElementById(`${prefix}-art-presets`);
  const help = document.getElementById(`${prefix}-art-help`);
  const quality = document.getElementById(`${prefix}-quality-prefix`);
  if (!group || !help || !quality) return;
  const requested = quality.value === "creativeArt";
  const active = artProfileActive({ qualityPrefix:quality.value, medium:document.getElementById(`${prefix}-medium`)?.value });
  const index = qualityLanguages.indexOf(language);
  group.hidden = !visible || !active;
  help.hidden = !visible || !requested;
  help.textContent = active ? artCopy.help[index < 0 ? 1 : index] : artCopy.warning[index < 0 ? 1 : index];
}
