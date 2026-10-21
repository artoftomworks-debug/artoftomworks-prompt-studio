// These are visual intentions, not judgments about the maker or the result.
export const productionLanguages = ["HU", "EN", "DE", "FR", "ES", "IT", "PT", "PL"];

export const productionGroups = {
  production: {
    label: ["Felvétel jellege", "Production feel", "Aufnahmecharakter", "Style de prise de vue", "Carácter de la toma", "Carattere della ripresa", "Caráter da captura", "Charakter ujęcia"],
    choices: {
      auto: ["Nincs külön megkötés", "No preference", "Keine Vorgabe", "Aucune préférence", "Sin preferencia", "Nessuna preferenza", "Sem preferência", "Bez preferencji"],
      polished: ["Professzionális, gondosan megkomponált", "Polished professional", "Professionell und sorgfältig komponiert", "Professionnel et soigné", "Profesional y cuidado", "Professionale e curato", "Profissional e cuidado", "Profesjonalny i dopracowany"],
      candid: ["Amatőr jellegű – spontán, hétköznapi", "Amateur-style – casual and candid", "Amateurstil – spontan und alltäglich", "Style amateur – spontané et quotidien", "Estilo aficionado – espontáneo y cotidiano", "Stile amatoriale – spontaneo e quotidiano", "Estilo amador – espontâneo e quotidiano", "Styl amatorski – swobodny i spontaniczny"],
      documentary: ["Dokumentarista, megfigyelő", "Observational documentary", "Beobachtend dokumentarisch", "Documentaire d’observation", "Documental observacional", "Documentaristico osservativo", "Documental observacional", "Dokumentalny, obserwacyjny"],
      snapshot: ["Személyes pillanatkép", "Personal snapshot", "Persönlicher Schnappschuss", "Instantané personnel", "Instantánea personal", "Istantanea personale", "Instantâneo pessoal", "Osobista migawka"]
    },
    phrases: {
      polished: ["gondosan komponált, professzionális képi kivitel", "carefully composed, polished professional visual finish", "sorgfältig komponierte, professionelle Bildwirkung", "rendu visuel professionnel et soigneusement composé", "acabado visual profesional y cuidadosamente compuesto", "resa visiva professionale e accuratamente composta", "acabamento visual profissional e cuidadosamente composto", "starannie skomponowany, profesjonalny wygląd obrazu"],
      candid: ["természetes, spontán, nem túlrendezett hatás", "natural, candid, unstaged visual feel", "natürliche, spontane, ungestellte Bildwirkung", "rendu naturel, spontané et non posé", "aspecto natural, espontáneo y no preparado", "aspetto naturale, spontaneo e non posato", "aspeto natural, espontâneo e não encenado", "naturalny, spontaniczny, niepozowany charakter"],
      documentary: ["megfigyelő dokumentarista képi világ, valószerű apró tökéletlenségekkel", "observational documentary feel with believable minor imperfections", "beobachtender Dokumentarstil mit glaubwürdigen kleinen Unvollkommenheiten", "style documentaire d’observation avec de petites imperfections crédibles", "estilo documental observacional con pequeñas imperfecciones creíbles", "stile documentaristico osservativo con piccole imperfezioni credibili", "estilo documental observacional com pequenas imperfeições plausíveis", "obserwacyjny styl dokumentalny z wiarygodnymi drobnymi niedoskonałościami"],
      snapshot: ["személyes pillanatkép hangulata, természetes keretezés", "personal snapshot aesthetic with natural framing", "persönlicher Schnappschuss mit natürlichem Bildausschnitt", "esthétique d’instantané personnel au cadrage naturel", "estética de instantánea personal con encuadre natural", "estetica da istantanea personale con inquadratura naturale", "estética de instantâneo pessoal com enquadramento natural", "estetyka osobistej migawki z naturalnym kadrem"]
    }
  },
  device: {
    label: ["Felvételi eszköz hatása", "Capture device look", "Aufnahmegerät-Look", "Aspect du dispositif", "Aspecto del dispositivo", "Aspetto del dispositivo", "Aspeto do dispositivo", "Charakter urządzenia"],
    choices: {
      auto: ["Nincs külön megkötés", "No preference", "Keine Vorgabe", "Aucune préférence", "Sin preferencia", "Nessuna preferenza", "Sem preferência", "Bez preferencji"],
      smartphone: ["Mobiltelefonnal készült", "Smartphone video", "Smartphone-Video", "Vidéo sur smartphone", "Vídeo de móvil", "Video da smartphone", "Vídeo de telemóvel", "Film ze smartfona"],
      cinema: ["Profi filmes kamera", "Cinema camera", "Kinokamera", "Caméra de cinéma", "Cámara de cine", "Camera cinematografica", "Câmara de cinema", "Kamera filmowa"],
      action: ["Akciókamera", "Action camera", "Actionkamera", "Caméra d’action", "Cámara de acción", "Action cam", "Câmara de ação", "Kamera sportowa"],
      camcorder: ["Kézi videokamera", "Handheld camcorder", "Handcam", "Caméscope", "Videocámara de mano", "Videocamera portatile", "Câmara de vídeo portátil", "Kamera ręczna"]
    },
    phrases: {
      smartphone: ["mobiltelefonnal rögzített videó természetes képi karaktere", "natural smartphone-recorded video look", "natürlicher Look eines Smartphone-Videos", "aspect naturel d’une vidéo filmée au smartphone", "aspecto natural de vídeo grabado con móvil", "aspetto naturale di un video girato con smartphone", "aspeto natural de vídeo gravado com telemóvel", "naturalny wygląd filmu nagranego smartfonem"],
      cinema: ["professzionális filmes kamera képi karaktere", "professional cinema-camera image character", "Bildcharakter einer professionellen Kinokamera", "rendu d’une caméra de cinéma professionnelle", "carácter visual de cámara de cine profesional", "resa di una camera cinematografica professionale", "caráter visual de câmara de cinema profissional", "charakter obrazu z profesjonalnej kamery filmowej"],
      action: ["akciókamera képi karaktere", "action-camera video look", "Actionkamera-Look", "aspect vidéo de caméra d’action", "aspecto de cámara de acción", "aspetto da action cam", "aspeto de câmara de ação", "wygląd obrazu z kamery sportowej"],
      camcorder: ["kézi videokamera képi karaktere", "handheld camcorder video look", "Handcam-Video-Look", "aspect de vidéo au caméscope", "aspecto de videocámara de mano", "aspetto da videocamera portatile", "aspeto de câmara de vídeo portátil", "wygląd filmu z kamery ręcznej"]
    }
  },
  stability: {
    label: ["Kamera stabilitása", "Camera stability", "Kamerastabilität", "Stabilité de la caméra", "Estabilidad de cámara", "Stabilità della camera", "Estabilidade da câmara", "Stabilność kamery"],
    choices: {
      auto: ["Nincs külön megkötés", "No preference", "Keine Vorgabe", "Aucune préférence", "Sin preferencia", "Nessuna preferenza", "Sem preferência", "Bez preferencji"],
      smooth: ["Egyenletes, stabil", "Smooth and stable", "Ruhig und stabil", "Fluide et stable", "Suave y estable", "Fluida e stabile", "Suave e estável", "Płynnie i stabilnie"],
      handheld: ["Kézből tartott, enyhe mozgás", "Natural handheld", "Natürlich aus der Hand", "À main levée, naturel", "Cámara en mano natural", "A mano, naturale", "À mão, natural", "Naturalne ujęcie z ręki"],
      shaky: ["Érezhetően remegő", "Noticeably shaky", "Deutlich verwackelt", "Visiblement tremblante", "Visiblemente temblorosa", "Visibilmente tremolante", "Visivelmente tremida", "Wyraźnie drżąca"]
    },
    phrases: {
      smooth: ["egyenletes, stabil kamerakezelés", "smooth, stable camera handling", "ruhige, stabile Kameraführung", "mouvements de caméra fluides et stables", "manejo de cámara suave y estable", "gestione della camera fluida e stabile", "movimento de câmara suave e estável", "płynne, stabilne prowadzenie kamery"],
      handheld: ["természetes, enyhén mozgó kézi kamerakezelés", "natural handheld camera micro-movement", "natürliche kleine Handkamera-Bewegungen", "légers mouvements naturels de caméra à main levée", "micro-movimientos naturales de cámara en mano", "lievi micro-movimenti naturali della camera a mano", "pequenos movimentos naturais de câmara à mão", "naturalne drobne ruchy kamery z ręki"],
      shaky: ["szándékosan érezhető kézi kameraremegés, a téma maradjon olvasható", "intentional noticeable handheld camera shake while keeping the subject readable", "absichtlich deutliches Handkamera-Wackeln, Motiv bleibt erkennbar", "tremblement intentionnel visible de caméra à main levée, sujet lisible", "temblor intencional visible de cámara en mano, sujeto legible", "tremolio intenzionale visibile della camera a mano, soggetto leggibile", "tremor intencional visível da câmara à mão, sujeito legível", "celowe wyraźne drgania kamery z ręki, obiekt pozostaje czytelny"]
    }
  }
};

export function productionPhrase(group, value, language = "EN") {
  const index = productionLanguages.indexOf(language);
  return productionGroups[group]?.phrases[value]?.[index < 0 ? 1 : index] || "";
}

export function productionPlan(selection, language = "EN", video = false) {
  return (video ? ["production", "device", "stability"] : ["production"])
    .map((group) => productionPhrase(group, selection?.[group], language)).filter(Boolean).join("; ");
}

export function renderProductionSelectors(prefix, language = "EN", video = false) {
  const index = productionLanguages.indexOf(language);
  for (const group of video ? ["production", "device", "stability"] : ["production"]) {
    const spec = productionGroups[group];
    const select = document.getElementById(`${prefix}-${group}`);
    const label = document.getElementById(`${prefix}-${group}-label`);
    if (!select || !label) continue;
    const previous = select.value;
    label.textContent = spec.label[index < 0 ? 1 : index];
    select.replaceChildren();
    for (const [value, names] of Object.entries(spec.choices)) {
      const option = document.createElement("option"); option.value = value; option.textContent = names[index < 0 ? 1 : index];
      select.appendChild(option);
    }
    select.value = Object.hasOwn(spec.choices, previous) ? previous : "auto";
  }
}
