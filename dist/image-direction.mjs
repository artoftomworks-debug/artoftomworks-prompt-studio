// Ordered as HU, EN, DE, FR, ES, IT, PT, PL, matching engine.mjs.
export const imageDirectionLanguages = ["HU", "EN", "DE", "FR", "ES", "IT", "PT", "PL"];

export const imageDirectionGroups = {
  shot: {
    label:["Képkivágás", "Shot size / framing", "Bildausschnitt", "Cadrage", "Encuadre", "Inquadratura", "Enquadramento", "Kadr"],
    options: {
      auto: ["Szabad / automatikus", "Free / automatic", "Frei / automatisch", "Libre / automatique", "Libre / automático", "Libera / automatica", "Livre / automático", "Dowolny / automatyczny"],
      portrait: ["Portré – fej és váll", "Portrait – head and shoulders", "Porträt – Kopf und Schultern", "Portrait – tête et épaules", "Retrato – cabeza y hombros", "Ritratto – testa e spalle", "Retrato – cabeça e ombros", "Portret – głowa i ramiona"],
      close: ["Közeli – arc vagy részlet", "Close-up – face or detail", "Nahaufnahme – Gesicht oder Detail", "Gros plan – visage ou détail", "Primer plano – rostro o detalle", "Primo piano – volto o dettaglio", "Primeiro plano – rosto ou detalhe", "Zbliżenie – twarz lub detal"],
      medium: ["Félalak – deréktól felfelé", "Medium shot – waist up", "Halbtotale – ab der Taille", "Plan taille – depuis la taille", "Plano medio – desde la cintura", "Piano medio – dalla vita", "Plano médio – da cintura", "Plan średni – od pasa"],
      cowboy: ["Cowboy shot – combközéptől felfelé", "Cowboy shot – head to mid-thigh", "Cowboy-Einstellung – Kopf bis Mitte Oberschenkel", "Plan américain – tête à mi-cuisse", "Plano americano – cabeza a medio muslo", "Piano americano – testa a metà coscia", "Plano americano – cabeça até meio da coxa", "Plan amerykański – głowa do połowy uda"],
      full: ["Teljes alak – fejtől a cipőig, a lábak ne legyenek levágva", "Full body – entire person from head to shoes, feet not cropped", "Ganzkörper – Kopf bis Schuhe, Füße nicht abgeschnitten", "Plein pied – de la tête aux chaussures, pieds non coupés", "Cuerpo entero – de cabeza a zapatos, sin cortar los pies", "Figura intera – dalla testa alle scarpe, piedi non tagliati", "Corpo inteiro – da cabeça aos sapatos, sem cortar os pés", "Cała sylwetka – od głowy po buty, stopy nieucięte"],
      wide: ["Nagytotál – szereplő és környezet", "Wide shot – subject and surroundings", "Totale – Motiv und Umgebung", "Plan large – sujet et environnement", "Plano general – sujeto y entorno", "Campo lungo – soggetto e ambiente", "Plano aberto – sujeito e ambiente", "Plan szeroki – obiekt i otoczenie"]
    }
  },
  angle: {
    label:["Kameraszög", "Camera angle", "Kamerawinkel", "Angle de caméra", "Ángulo de cámara", "Angolazione", "Ângulo da câmara", "Kąt kamery"],
    options: {
      auto: ["Szabad / automatikus", "Free / automatic", "Frei / automatisch", "Libre / automatique", "Libre / automático", "Libera / automatica", "Livre / automático", "Dowolny / automatyczny"],
      eye: ["Szemmagasság", "Eye-level view", "Augenhöhe", "À hauteur des yeux", "A la altura de los ojos", "All'altezza degli occhi", "Ao nível dos olhos", "Na wysokości oczu"],
      low: ["Alacsony nézőpont", "Low-angle view", "Untersicht", "Contre-plongée", "Ángulo bajo", "Angolazione dal basso", "Ângulo baixo", "Ujęcie z dołu"],
      high: ["Magas nézőpont", "High-angle view", "Aufsicht", "Plongée", "Ángulo alto", "Angolazione dall'alto", "Ângulo alto", "Ujęcie z góry"],
      overhead: ["Felülnézet", "Overhead / top-down view", "Draufsicht", "Vue zénithale", "Vista cenital", "Vista dall'alto", "Vista de cima", "Widok z góry"],
      dutch: ["Enyhén döntött horizont", "Subtle Dutch angle", "Leicht gekippter Horizont", "Léger angle incliné", "Ligero ángulo holandés", "Leggera inclinazione dell'orizzonte", "Leve ângulo inclinado", "Lekko przechylony kadr"]
    }
  },
  lens: {
    label:["Kamera / optikai hatás", "Camera / lens look", "Kamera / Objektivwirkung", "Rendu caméra / objectif", "Cámara / lente", "Effetto camera / obiettivo", "Câmara / objetiva", "Kamera / obiektyw"],
    options: {
      auto: ["Nincs külön megkötés", "No lens constraint", "Keine Objektivvorgabe", "Sans contrainte d'objectif", "Sin restricción de lente", "Nessun vincolo sull'obiettivo", "Sem restrição de objetiva", "Bez narzuconego obiektywu"],
      cinema: ["Filmes objektívhatás – természetes perspektíva", "Cinema lens look – natural perspective", "Kinoobjektiv-Look – natürliche Perspektive", "Rendu d'objectif cinéma – perspective naturelle", "Aspecto de lente de cine – perspectiva natural", "Aspetto da obiettivo cinematografico – prospettiva naturale", "Aspeto de objetiva de cinema – perspetiva natural", "Wygląd obiektywu filmowego – naturalna perspektywa"],
      wide: ["Széles látószög", "Wide-angle lens perspective", "Weitwinkelperspektive", "Perspective grand-angle", "Perspectiva gran angular", "Prospettiva grandangolare", "Perspetiva grande-angular", "Perspektywa szerokokątna"],
      tele: ["Teleobjektív – sűrített háttér", "Telephoto look – compressed background", "Teleobjektiv-Look – verdichteter Hintergrund", "Téléobjectif – arrière-plan comprimé", "Teleobjetivo – fondo comprimido", "Teleobiettivo – sfondo compresso", "Teleobjetiva – fundo comprimido", "Teleobiektyw – spłaszczone tło"],
      fisheye: ["Halszem – erős ívelt torzítás", "Fisheye lens – strong curved distortion", "Fisheye – starke gekrümmte Verzerrung", "Fisheye – forte déformation courbe", "Ojo de pez – fuerte distorsión curva", "Fisheye – forte distorsione curva", "Olho de peixe – forte distorção curva", "Rybie oko – silne zakrzywienie obrazu"]
    }
  },
  medium: {
    label:["Képtípus / technika", "Image medium", "Bildmedium", "Type d'image", "Tipo de imagen", "Tipo di immagine", "Tipo de imagem", "Medium obrazu"],
    options: {
      auto: ["Meglévő képi stílus", "Keep visual style above", "Obigen Bildstil beibehalten", "Garder le style ci-dessus", "Mantener el estilo visual anterior", "Mantieni lo stile sopra", "Manter o estilo acima", "Zachowaj styl powyżej"],
      photo: ["Fotórealisztikus fénykép", "Photorealistic photograph", "Fotorealistisches Foto", "Photographie photoréaliste", "Fotografía fotorrealista", "Fotografia fotorealistica", "Fotografia fotorrealista", "Fotorealistyczna fotografia"],
      film: ["Filmes állókép", "Cinematic film still", "Filmisches Standbild", "Image de film cinématographique", "Fotograma cinematográfico", "Fotogramma cinematografico", "Fotograma cinematográfico", "Kadr filmowy"],
      painting: ["Festmény – látható ecsetvonások", "Painting – visible brushwork", "Gemälde – sichtbare Pinselstriche", "Peinture – coups de pinceau visibles", "Pintura – pinceladas visibles", "Dipinto – pennellate visibili", "Pintura – pinceladas visíveis", "Obraz malarski – widoczne pociągnięcia pędzla"],
      poster: ["Plakát – erős kompozíció", "Poster artwork – bold composition", "Plakatkunst – starke Komposition", "Affiche – composition marquée", "Cartel – composición contundente", "Poster – composizione decisa", "Cartaz – composição marcante", "Plakat – wyrazista kompozycja"],
      graphic: ["Grafikai illusztráció", "Graphic illustration", "Grafische Illustration", "Illustration graphique", "Ilustración gráfica", "Illustrazione grafica", "Ilustração gráfica", "Ilustracja graficzna"]
    }
  },
  capture: {
    label:["Rögzítés típusa", "Capture type", "Aufnahmetyp", "Type de prise de vue", "Tipo de captura", "Tipo di ripresa", "Tipo de captura", "Rodzaj rejestracji"],
    options: {
      auto:["Nincs megkötés", "No preference", "Keine Vorgabe", "Aucune préférence", "Sin preferencia", "Nessuna preferenza", "Sem preferência", "Bez preferencji"],
      film:["Filmes – analóg filmre", "Film – analog capture", "Film – analoge Aufnahme", "Pellicule – capture analogique", "Película – captura analógica", "Pellicola – ripresa analogica", "Película – captação analógica", "Film – rejestracja analogowa"],
      digital:["Digitális", "Digital capture", "Digitale Aufnahme", "Capture numérique", "Captura digital", "Ripresa digitale", "Captação digital", "Rejestracja cyfrowa"]
    }
  }
};

export const cameraProfiles = {
  arriflex435:{ capture:"film", name:"ARRIFLEX 435" },
  panaflex:{ capture:"film", name:"Panavision Panaflex Platinum" },
  leicam6:{ capture:"film", name:"Leica M6" },
  hasselblad500:{ capture:"film", name:"Hasselblad 500C/M" },
  alexa35:{ capture:"digital", name:"ARRI ALEXA 35" },
  venice2:{ capture:"digital", name:"Sony VENICE 2" },
  redraptor:{ capture:"digital", name:"RED V-RAPTOR XL" },
  canonr5ii:{ capture:"digital", name:"Canon EOS R5 Mark II" },
  nikonz8:{ capture:"digital", name:"Nikon Z8" },
  gfx100ii:{ capture:"digital", name:"Fujifilm GFX100 II" }
};

const cameraProfileCopy = {
  label:["Kamera márkája és típusa", "Camera brand and model", "Kameramarke und Modell", "Marque et modèle de caméra", "Marca y modelo de cámara", "Marca e modello della camera", "Marca e modelo da câmara", "Marka i model kamery"],
  auto:["Nincs külön márka", "No specific camera", "Keine bestimmte Kamera", "Aucune caméra précise", "Sin cámara específica", "Nessuna camera specifica", "Sem câmara específica", "Bez konkretnego aparatu"],
  film:["analóg filmes képi hatás", "analog film capture look", "analoger Filmlook", "aspect de prise de vue sur pellicule", "aspecto de captura en película", "aspetto da ripresa su pellicola", "aspeto de película analógica", "wygląd filmu analogowego"],
  digital:["digitális felvétel képi hatása", "digital camera capture look", "digitaler Kameralook", "aspect de caméra numérique", "aspecto de cámara digital", "aspetto da camera digitale", "aspeto de câmara digital", "wygląd aparatu cyfrowego"],
  modelFilm:["{name} analóg kamera képi karaktere", "{name} analog film camera look", "Bildcharakter einer analogen {name}", "rendu d'une caméra argentique {name}", "estética de cámara analógica {name}", "aspetto da camera analogica {name}", "aspeto de câmara analógica {name}", "estetyka analogowej kamery {name}"],
  modelDigital:["{name} digitális kamera képi karaktere", "{name} digital camera look", "Bildcharakter einer digitalen {name}", "rendu d'une caméra numérique {name}", "estética de cámara digital {name}", "aspetto da camera digitale {name}", "aspeto de câmara digital {name}", "estetyka cyfrowej kamery {name}"],
  modelArt:["{name} kamerát idéző képi stílus", "{name}-inspired camera aesthetic", "von {name} inspirierte Bildwirkung", "esthétique inspirée de la caméra {name}", "estética inspirada en la cámara {name}", "estetica ispirata alla camera {name}", "estética inspirada na câmara {name}", "estetyka inspirowana kamerą {name}"]
};

export const imageDirectionHelp = {
  HU:"A kamerát rögzítési típus nélkül is kiválaszthatod; filmes vagy digitális típusnál csak az odaillők látszanak. A márka képi referencia, nem garantált kamerahatás. A képtípus felülírja az általános stílust; festménynél a kamera és az optika stiláris utalás.",
  EN:"You can choose a camera without setting capture type; film or digital filters the list. A brand is a visual reference, not a guaranteed camera effect. The medium overrides the general style; for art, camera and lens are stylistic cues.",
  DE:"Die Optionen sind unabhängig. Analog und digital zeigen nur passende Kameras. Die Marke ist eine Bildreferenz, keine Garantie. Das Medium ersetzt den Stil oben; bei Kunst sind Kamera und Objektiv Stilmittel.",
  FR:"Les choix sont indépendants. Film et numérique affichent seulement les caméras correspondantes. La marque est une référence visuelle, sans garantie. Le médium remplace le style général; pour l'art, caméra et objectif sont stylistiques.",
  ES:"Las opciones son independientes. Película y digital muestran solo cámaras compatibles. La marca es una referencia visual, no una garantía. El medio sustituye el estilo general; en arte, cámara y lente son recursos estilísticos.",
  IT:"Le scelte sono indipendenti. Pellicola e digitale mostrano solo camere compatibili. Il marchio è un riferimento visivo, non una garanzia. Il medium sostituisce lo stile generale; nell'arte, camera e obiettivo sono stilistici.",
  PT:"As opções são independentes. Película e digital mostram apenas câmaras correspondentes. A marca é uma referência visual, não uma garantia. O meio substitui o estilo geral; na arte, câmara e objetiva são efeitos de estilo.",
  PL:"Opcje są niezależne. Film i cyfrówka pokazują tylko pasujące aparaty. Marka jest odniesieniem wizualnym, bez gwarancji efektu. Medium zastępuje styl ogólny; w sztuce aparat i obiektyw są wskazówką stylistyczną."
};

export function imageDirectionValue(group, value, language = "EN") {
  const spec = imageDirectionGroups[group];
  const index = imageDirectionLanguages.includes(language) ? imageDirectionLanguages.indexOf(language) : 1;
  return spec?.options[value]?.[index] || "";
}

export function imageDirectionParts(selection, language = "EN") {
  const parts = ["shot", "angle", "lens"].filter((group) => selection?.[group] && selection[group] !== "auto")
    .map((group) => imageDirectionValue(group, selection[group], language)).filter(Boolean);
  const camera = cameraProfilePhrase(selection, language);
  if (camera) parts.push(camera);
  return parts;
}

export function cameraProfilePhrase(selection, language = "EN") {
  const profile = cameraProfiles[selection?.cameraModel];
  const capture = selection?.capture === "film" || selection?.capture === "digital" ? selection.capture : profile?.capture;
  if (capture !== "film" && capture !== "digital") return "";
  const index = imageDirectionLanguages.includes(language) ? imageDirectionLanguages.indexOf(language) : 1;
  if (!profile || profile.capture !== capture) return cameraProfileCopy[capture][index];
  const isArt = ["painting", "poster", "graphic"].includes(selection?.medium);
  const template = cameraProfileCopy[isArt ? "modelArt" : capture === "film" ? "modelFilm" : "modelDigital"][index];
  return template.replace("{name}", profile.name);
}

export function imageDirectionPlan(selection, language = "EN") {
  const parts = imageDirectionParts(selection, language);
  const medium = imageDirectionValue("medium", selection?.medium, language);
  if (medium && selection?.medium !== "auto") parts.push(medium);
  return parts.join("; ");
}

export function renderImageDirectionSelectors(prefix, language = "EN") {
  const index = imageDirectionLanguages.includes(language) ? imageDirectionLanguages.indexOf(language) : 1;
  for (const [group, spec] of Object.entries(imageDirectionGroups)) {
    const select = document.getElementById(`${prefix}-${group}`);
    const label = document.getElementById(`${prefix}-${group}-label`);
    if (!select || !label) continue;
    const previous = select.value;
    label.textContent = spec.label[index];
    select.replaceChildren();
    for (const [value, names] of Object.entries(spec.options)) {
      const option = document.createElement("option"); option.value = value; option.textContent = names[index];
      select.appendChild(option);
    }
    select.value = Object.hasOwn(spec.options, previous) ? previous : "auto";
  }
  renderCameraProfileSelector(prefix, language);
  const help = document.getElementById(`${prefix}-direction-help`);
  if (help) help.textContent = imageDirectionHelp[language] || imageDirectionHelp.EN;
}

export function renderCameraProfileSelector(prefix, language = "EN") {
  const select = document.getElementById(`${prefix}-camera-model`);
  const label = document.getElementById(`${prefix}-camera-model-label`);
  const capture = document.getElementById(`${prefix}-capture`)?.value;
  if (!select || !label) return;
  const index = imageDirectionLanguages.includes(language) ? imageDirectionLanguages.indexOf(language) : 1;
  const previous = select.value;
  label.textContent = cameraProfileCopy.label[index];
  select.replaceChildren();
  const empty = document.createElement("option"); empty.value = "auto"; empty.textContent = cameraProfileCopy.auto[index]; select.appendChild(empty);
  for (const [value, profile] of Object.entries(cameraProfiles)) {
    if (capture !== "auto" && profile.capture !== capture) continue;
    const option = document.createElement("option"); option.value = value; option.textContent = profile.name; select.appendChild(option);
  }
  select.value = cameraProfiles[previous] && (capture === "auto" || cameraProfiles[previous].capture === capture) ? previous : "auto";
  select.disabled = false;
}
