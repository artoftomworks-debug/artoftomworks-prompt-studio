import { collectSentenceCandidates } from "./sentence-bank.mjs";

// Optional, local-first writing help. Archived expressions are read only; nothing is inserted automatically.
const libraryKey = "artoftomworks.promptStudio.promptLibrary.v1";
const glossaryKey = "artoftomworks.promptStudio.glossary.v1";
const enabledKey = "artoftomworks.promptStudio.autocomplete.v1";
const sentenceCopy={
  EN:{button:"Sentence ideas from archive",title:"Recurring sentence ideas",help:"Exact recurring sentences from your indexed media and saved prompts. Search and add one to the current editable prompt; nothing is inserted automatically.",search:"Search sentence ideas",add:"Add to prompt",count:"Used in {count} prompts",empty:"No recurring sentences found for this mode yet.",offline:"Start Prompt Studio with its local launcher to read the archive.",error:"Could not read the archive. Saved prompts can still be used."},
  HU:{button:"Mondatminták az archívumból",title:"Visszatérő mondatminták",help:"A beolvasott média és a mentett promptok valóban ismétlődő mondatai. Keress köztük, majd külön gombbal add hozzá a szerkeszthető prompthoz.",search:"Keresés a mondatmintákban",add:"Hozzáadás a prompthoz",count:"{count} promptban szerepel",empty:"Ehhez a módhoz még nincs ismétlődő mondat.",offline:"Az archívumhoz indítsd a Prompt Studiot a helyi indítóval.",error:"Az archívum nem olvasható. A mentett promptokból továbbra is kereshetsz."},
  DE:{button:"Satzideen aus dem Archiv",title:"Wiederkehrende Sätze",help:"Wiederholte Sätze aus Archiv und gespeicherten Prompts. Nur auf Klick einfügen.",search:"Sätze suchen",add:"Zum Prompt hinzufügen",count:"In {count} Prompts",empty:"Keine wiederkehrenden Sätze.",offline:"Archiv benötigt lokalen Starter.",error:"Archiv nicht lesbar."},
  FR:{button:"Idées de phrases de l'archive",title:"Phrases récurrentes",help:"Phrases répétées de l'archive et des prompts enregistrés. Ajout uniquement sur clic.",search:"Chercher une phrase",add:"Ajouter au prompt",count:"Dans {count} prompts",empty:"Aucune phrase récurrente.",offline:"L'archive nécessite le lanceur local.",error:"Archive inaccessible."},
  ES:{button:"Frases del archivo",title:"Frases recurrentes",help:"Frases repetidas del archivo y los prompts guardados. Solo se añaden al pulsar.",search:"Buscar frases",add:"Añadir al prompt",count:"En {count} prompts",empty:"No hay frases recurrentes.",offline:"El archivo requiere el iniciador local.",error:"No se pudo leer el archivo."},
  IT:{button:"Frasi dall'archivio",title:"Frasi ricorrenti",help:"Frasi ripetute dall'archivio e dai prompt salvati. Inserimento solo su clic.",search:"Cerca frasi",add:"Aggiungi al prompt",count:"In {count} prompt",empty:"Nessuna frase ricorrente.",offline:"L'archivio richiede l'avvio locale.",error:"Archivio non leggibile."},
  PT:{button:"Frases do arquivo",title:"Frases recorrentes",help:"Frases repetidas do arquivo e dos prompts guardados. Só são adicionadas ao clicar.",search:"Pesquisar frases",add:"Adicionar ao prompt",count:"Em {count} prompts",empty:"Sem frases recorrentes.",offline:"O arquivo exige o iniciador local.",error:"Não foi possível ler o arquivo."},
  PL:{button:"Zdania z archiwum",title:"Powtarzające się zdania",help:"Powtarzające się zdania z archiwum i zapisanych promptów. Dodawane tylko po kliknięciu.",search:"Szukaj zdań",add:"Dodaj do promptu",count:"W {count} promptach",empty:"Brak powtarzających się zdań.",offline:"Archiwum wymaga lokalnego uruchomienia.",error:"Nie można odczytać archiwum."}
};
const defaultOrder = {
  image:["subject","setting","action","camera","lighting","style"],
  video:["subject","setting","action","camera","lighting","style"],
  i2v:["subject","action","camera","lighting","style"],
  i2i:["subject","action","setting","camera","lighting","style"]
};
const labels = {
  EN:{subject:"subject",setting:"setting",action:"action or change",camera:"framing and camera",lighting:"lighting",style:"style and mood"},
  HU:{subject:"téma / szereplő",setting:"helyszín és háttér",action:"történés vagy változtatás",camera:"képkivágás és kamera",lighting:"fények",style:"stílus és hangulat"},
  DE:{subject:"Motiv",setting:"Ort und Hintergrund",action:"Handlung oder Änderung",camera:"Ausschnitt und Kamera",lighting:"Licht",style:"Stil und Stimmung"},
  FR:{subject:"sujet",setting:"lieu et arrière-plan",action:"action ou changement",camera:"cadrage et caméra",lighting:"éclairage",style:"style et ambiance"},
  ES:{subject:"sujeto",setting:"lugar y fondo",action:"acción o cambio",camera:"encuadre y cámara",lighting:"iluminación",style:"estilo y ambiente"},
  IT:{subject:"soggetto",setting:"luogo e sfondo",action:"azione o modifica",camera:"inquadratura e camera",lighting:"luce",style:"stile e atmosfera"},
  PT:{subject:"tema",setting:"local e fundo",action:"ação ou mudança",camera:"enquadramento e câmara",lighting:"iluminação",style:"estilo e ambiente"},
  PL:{subject:"temat",setting:"miejsce i tło",action:"akcja lub zmiana",camera:"kadr i kamera",lighting:"oświetlenie",style:"styl i nastrój"}
};
const copy = {
  EN:{title:"Prompt writing guide",intro:"An optional guide; your text stays yours. Suggestions never replace it without asking.",auto:"Suggest words while typing",autoHelp:"From your saved prompts, glossary and locally indexed archive. Choose a suggestion with Tab or a click; Esc dismisses it.",outline:"Suggest a prompt structure",outlineHelp:"Uses the most repeated order found in saved prompts for this mode. If there is not enough evidence, shows a basic starting structure.",saved:"Based on {count} saved prompts ({matches} with this structure).",fallback:"Basic starting structure; save more working prompts to personalize it.",useOutline:"Use this structure as an editable draft",guide:"Step-by-step guide",guideHelp:"Answer the questions one at a time, or skip any. This is a learning aid, not a required formula.",example:"Example",back:"Back",next:"Next",finish:"Create editable draft",step:"Step {number} of {total}",confirm:"Replace the current prompt? Your existing text will not be saved by this action.",ready:"Editable draft inserted. Review it and translate if needed.",empty:"Add at least one answer first.",noInsert:"Nothing was changed.",sourceSaved:"saved prompt",sourceGlossary:"glossary",sourceArchive:"archive"},
  HU:{title:"Promptírási szamárvezető",intro:"Opcionális segítség: a szöveged megmarad, javaslat nem írja felül kérdés nélkül.",auto:"Szójavaslat gépelés közben",autoHelp:"A bevált promptokból, a szószedetből és a helyben beolvasott archívumból. Tab vagy kattintás: átvétel; Esc: bezárás.",outline:"Promptfelépítés ajánlása",outlineHelp:"Az adott mód mentett promptjaiban leggyakrabban ismétlődő sorrendet keresi. Kevés adatnál alapvázlatot ad.",saved:"{count} mentett prompt alapján ({matches} követi ezt a felépítést).",fallback:"Alapvázlat; több bevált prompt mentésével személyre szabható.",useOutline:"A vázlat átvétele szerkesztésre",guide:"Lépésenkénti puska",guideHelp:"Válaszolj sorban, vagy ugorj át bármit. Ez tanulási segítség, nem kötelező szabály.",example:"Példa",back:"Vissza",next:"Tovább",finish:"Szerkeszthető vázlat készítése",step:"{number}. lépés / {total}",confirm:"Lecseréljem a jelenlegi promptot? A meglévő szöveget ez a művelet nem menti el.",ready:"A szerkeszthető vázlat elkészült. Nézd át, és szükség esetén fordítsd le.",empty:"Előbb adj meg legalább egy választ.",noInsert:"Nem változott semmi.",sourceSaved:"mentett prompt",sourceGlossary:"szószedet",sourceArchive:"archívum"},
  DE:{title:"Prompt-Schreibhilfe",intro:"Optionale Hilfe; Ihr Text wird nicht ungefragt ersetzt.",auto:"Wörter beim Tippen vorschlagen",autoHelp:"Aus gespeicherten Prompts, Glossar und lokalem Archiv. Tab/Klick übernimmt; Esc schließt.",outline:"Prompt-Struktur vorschlagen",outlineHelp:"Häufigste Reihenfolge aus gespeicherten Prompts dieses Modus; sonst Grundstruktur.",saved:"Aus {count} gespeicherten Prompts ({matches} mit dieser Struktur).",fallback:"Grundstruktur; mit mehr gespeicherten Prompts personalisierbar.",useOutline:"Struktur als Entwurf übernehmen",guide:"Schritt-für-Schritt-Hilfe",guideHelp:"Fragen beantworten oder überspringen; keine feste Regel.",example:"Beispiel",back:"Zurück",next:"Weiter",finish:"Bearbeitbaren Entwurf erstellen",step:"Schritt {number} von {total}",confirm:"Aktuellen Prompt ersetzen? Der bisherige Text wird nicht gespeichert.",ready:"Entwurf eingefügt. Bitte prüfen und bei Bedarf übersetzen.",empty:"Mindestens eine Antwort eingeben.",noInsert:"Nichts geändert.",sourceSaved:"gespeichert",sourceGlossary:"Glossar",sourceArchive:"Archiv"},
  FR:{title:"Guide de rédaction",intro:"Aide facultative ; aucun texte n'est remplacé sans accord.",auto:"Suggérer des mots en écrivant",autoHelp:"Prompts enregistrés, glossaire et archive locale. Tab/clic pour accepter ; Échap pour fermer.",outline:"Proposer une structure",outlineHelp:"Ordre le plus fréquent dans les prompts enregistrés du mode ; sinon structure de base.",saved:"D'après {count} prompts ({matches} avec cette structure).",fallback:"Structure de base ; enregistrez d'autres prompts pour la personnaliser.",useOutline:"Utiliser comme brouillon",guide:"Guide pas à pas",guideHelp:"Répondez ou passez une étape ; ce n'est pas une règle obligatoire.",example:"Exemple",back:"Retour",next:"Suivant",finish:"Créer un brouillon modifiable",step:"Étape {number} sur {total}",confirm:"Remplacer le prompt actuel ? Le texte existant ne sera pas sauvegardé.",ready:"Brouillon ajouté. Vérifiez-le et traduisez-le si besoin.",empty:"Ajoutez au moins une réponse.",noInsert:"Aucun changement.",sourceSaved:"enregistré",sourceGlossary:"glossaire",sourceArchive:"archive"},
  ES:{title:"Guía para escribir prompts",intro:"Ayuda opcional; tu texto no se reemplaza sin permiso.",auto:"Sugerir palabras al escribir",autoHelp:"Prompts guardados, glosario y archivo local. Tab/clic acepta; Esc cierra.",outline:"Sugerir estructura",outlineHelp:"Orden más repetido en los prompts guardados de este modo; si no, estructura básica.",saved:"Basado en {count} prompts ({matches} con esta estructura).",fallback:"Estructura básica; guarda más prompts para personalizarla.",useOutline:"Usar como borrador editable",guide:"Guía paso a paso",guideHelp:"Responde o salta preguntas; no es una regla obligatoria.",example:"Ejemplo",back:"Atrás",next:"Siguiente",finish:"Crear borrador editable",step:"Paso {number} de {total}",confirm:"¿Reemplazar el prompt actual? El texto existente no se guardará.",ready:"Borrador insertado. Revísalo y tradúcelo si hace falta.",empty:"Añade al menos una respuesta.",noInsert:"No se cambió nada.",sourceSaved:"guardado",sourceGlossary:"glosario",sourceArchive:"archivo"},
  IT:{title:"Guida alla scrittura dei prompt",intro:"Aiuto facoltativo; il testo non viene sostituito senza consenso.",auto:"Suggerisci parole durante la scrittura",autoHelp:"Da prompt salvati, glossario e archivio locale. Tab/clic per accettare; Esc per chiudere.",outline:"Suggerisci una struttura",outlineHelp:"Ordine più frequente nei prompt salvati di questa modalità; altrimenti schema base.",saved:"Da {count} prompt ({matches} con questa struttura).",fallback:"Schema base; salva altri prompt per personalizzarlo.",useOutline:"Usa come bozza modificabile",guide:"Guida passo per passo",guideHelp:"Rispondi o salta le domande; non è una regola obbligatoria.",example:"Esempio",back:"Indietro",next:"Avanti",finish:"Crea bozza modificabile",step:"Passo {number} di {total}",confirm:"Sostituire il prompt attuale? Il testo esistente non verrà salvato.",ready:"Bozza inserita. Verifica e traduci se necessario.",empty:"Aggiungi almeno una risposta.",noInsert:"Nessuna modifica.",sourceSaved:"salvato",sourceGlossary:"glossario",sourceArchive:"archivio"},
  PT:{title:"Guia de escrita de prompts",intro:"Ajuda opcional; o texto não é substituído sem confirmação.",auto:"Sugerir palavras ao escrever",autoHelp:"Prompts guardados, glossário e arquivo local. Tab/clique aceita; Esc fecha.",outline:"Sugerir estrutura",outlineHelp:"Ordem mais frequente nos prompts guardados deste modo; caso contrário, estrutura base.",saved:"Com base em {count} prompts ({matches} com esta estrutura).",fallback:"Estrutura base; guarde mais prompts para personalizar.",useOutline:"Usar como rascunho editável",guide:"Guia passo a passo",guideHelp:"Responda ou ignore perguntas; não é uma regra obrigatória.",example:"Exemplo",back:"Voltar",next:"Seguinte",finish:"Criar rascunho editável",step:"Passo {number} de {total}",confirm:"Substituir o prompt atual? O texto atual não será guardado.",ready:"Rascunho inserido. Reveja e traduza se necessário.",empty:"Preencha pelo menos uma resposta.",noInsert:"Nada foi alterado.",sourceSaved:"guardado",sourceGlossary:"glossário",sourceArchive:"arquivo"},
  PL:{title:"Przewodnik pisania promptów",intro:"Opcjonalna pomoc; tekst nie zostanie zastąpiony bez zgody.",auto:"Podpowiadaj słowa podczas pisania",autoHelp:"Z zapisanych promptów, słownika i lokalnego archiwum. Tab/kliknięcie wybiera; Esc zamyka.",outline:"Zaproponuj strukturę",outlineHelp:"Najczęstsza kolejność w zapisanych promptach tego trybu; w razie braku danych schemat podstawowy.",saved:"Na podstawie {count} promptów ({matches} z tą strukturą).",fallback:"Schemat podstawowy; zapisz więcej promptów, aby go spersonalizować.",useOutline:"Użyj jako edytowalnego szkicu",guide:"Instrukcja krok po kroku",guideHelp:"Odpowiedz lub pomiń pytanie; to nie jest sztywna zasada.",example:"Przykład",back:"Wstecz",next:"Dalej",finish:"Utwórz edytowalny szkic",step:"Krok {number} z {total}",confirm:"Zastąpić bieżący prompt? Obecny tekst nie zostanie zapisany.",ready:"Szkic wstawiony. Sprawdź i przetłumacz w razie potrzeby.",empty:"Dodaj co najmniej jedną odpowiedź.",noInsert:"Nic nie zmieniono.",sourceSaved:"zapisany",sourceGlossary:"słownik",sourceArchive:"archiwum"}
};
const stepKeys = ["subject","setting","action","camera","lighting","style"];
const examples = {
  EN:{subject:"a woman in a red coat",setting:"a quiet street at dawn",action:"she turns toward the camera",camera:"medium shot, slow push-in",lighting:"soft sunrise light",style:"cinematic, natural colors"},
  HU:{subject:"piros kabátos nő",setting:"csendes utca hajnalban",action:"lassan a kamera felé fordul",camera:"félközeli, lassú közelítés",lighting:"lágy hajnali fény",style:"filmes, természetes színek"}
};
const stepTips = {
  EN:{subject:"Name the visible main subject precisely, without inventing an identity.",setting:"Add only the place and background details that matter.",action:"For video, describe one feasible action in time order. For an image edit, say what changes.",camera:"State shot size, angle or camera motion; separate subject and camera motion.",lighting:"Describe the direction, quality or time of the light.",style:"Choose a medium and mood; avoid conflicting style labels."},
  HU:{subject:"Nevezd meg pontosan a látható fő témát; ne találj ki személyazonosságot.",setting:"Csak a fontos helyszínt és háttérelemeket írd le.",action:"Videónál időrendben írj le egy megvalósítható történést; képmódosításnál a változást.",camera:"Add meg a képkivágást, nézőpontot vagy kameramozgást; a téma és a kamera mozgását válaszd szét.",lighting:"Írd le a fény irányát, jellegét vagy a napszakot.",style:"Válassz képi médiumot és hangulatot; kerüld az egymásnak ellentmondó stílusokat."},
  DE:{subject:"Hauptmotiv präzise benennen, ohne eine Identität zu erfinden.",setting:"Nur wichtige Orts- und Hintergrunddetails hinzufügen.",action:"Für Video eine machbare Handlung zeitlich ordnen; bei Bildbearbeitung die Änderung nennen.",camera:"Ausschnitt, Winkel oder Kamerabewegung angeben; Motiv- und Kamerabewegung trennen.",lighting:"Richtung, Qualität oder Tageszeit des Lichts beschreiben.",style:"Medium und Stimmung wählen; widersprüchliche Stile vermeiden."},
  FR:{subject:"Nommez précisément le sujet visible sans inventer d'identité.",setting:"N'ajoutez que le lieu et l'arrière-plan utiles.",action:"Pour une vidéo, décrivez une action réalisable dans l'ordre ; pour une retouche, le changement.",camera:"Précisez cadrage, angle ou mouvement de caméra ; distinguez mouvement du sujet et de la caméra.",lighting:"Indiquez direction, qualité ou moment de la lumière.",style:"Choisissez un médium et une ambiance sans styles contradictoires."},
  ES:{subject:"Nombra el sujeto visible con precisión, sin inventar identidades.",setting:"Añade solo los detalles importantes del lugar y fondo.",action:"En vídeo, describe una acción posible en orden; al editar imagen, indica el cambio.",camera:"Indica encuadre, ángulo o movimiento de cámara; separa el movimiento del sujeto.",lighting:"Describe dirección, calidad o momento de la luz.",style:"Elige medio y ambiente; evita estilos contradictorios."},
  IT:{subject:"Indica con precisione il soggetto visibile senza inventare identità.",setting:"Aggiungi solo luogo e sfondo importanti.",action:"Per video, descrivi un'azione realizzabile in ordine; per modifica immagini, il cambiamento.",camera:"Specifica inquadratura, angolo o movimento della camera; distinguilo dal movimento del soggetto.",lighting:"Descrivi direzione, qualità o ora della luce.",style:"Scegli mezzo e atmosfera; evita stili in contrasto."},
  PT:{subject:"Identifique o tema visível sem inventar identidades.",setting:"Inclua apenas local e fundo relevantes.",action:"No vídeo, descreva uma ação viável em sequência; na edição de imagem, a mudança.",camera:"Indique enquadramento, ângulo ou movimento da câmara; separe-o do movimento do tema.",lighting:"Descreva direção, qualidade ou hora da luz.",style:"Escolha meio e ambiente; evite estilos contraditórios."},
  PL:{subject:"Nazwij widoczny główny temat bez wymyślania tożsamości.",setting:"Dodaj tylko ważne szczegóły miejsca i tła.",action:"Dla wideo opisz wykonalną akcję po kolei; dla edycji obrazu podaj zmianę.",camera:"Podaj kadr, kąt lub ruch kamery; oddziel ruch obiektu od kamery.",lighting:"Opisz kierunek, jakość lub porę światła.",style:"Wybierz technikę i nastrój; unikaj sprzecznych stylów."}
};
const checkCopy = {
  EN:{button:"Check this prompt",help:"A quick local checklist, not a quality score. Missing details can be intentional; no model is called.",present:"Found",unclear:"Not clear",empty:"Write or build a prompt first.",clean:"No obvious contradiction found. Review the result yourself.",lockedMotion:"Camera conflict: the prompt asks for both a locked camera and camera movement. Choose one before applying.",silentAudio:"Audio conflict: the prompt asks for silence and for sound/music. Choose one.",oneShotCut:"Shot conflict: a continuous shot also contains a cut or montage. Choose one.",missingSubject:"The main subject is not clear. Name what should be visible.",missingAction:"Video movement is not clear. Describe one feasible subject action in time order.",missingEdit:"For image editing, say what stays and what changes.",missingCamera:"Framing or camera direction could be clearer.",missingLighting:"Lighting could be clearer.",duration:"A duration written in the prompt does not set video length; set it in the workflow too.",draft:"One editable improvement",apply:"Use edited improvement",fill:"Replace the ⟦...⟧ note with your own words before applying.",stale:"The prompt or mode changed. Check it again before applying.",confirm:"Replace the current prompt with this edited version?",applied:"Edited version inserted. Review it before use.",choose:"This conflict needs your choice; no automatic replacement is offered."},
  HU:{button:"Prompt ellenőrzése",help:"Gyors helyi ellenőrzőlista, nem minőségi pontszám. A hiányzó részlet lehet szándékos; nem hív AI-modellt.",present:"Van",unclear:"Nem egyértelmű",empty:"Előbb írj vagy állíts össze egy promptot.",clean:"Nem találtam nyilvánvaló ellentmondást. Az eredményt azért olvasd át.",lockedMotion:"Kameraellentmondás: a prompt egyszerre kér fix kamerát és kameramozgást. Válassz közülük.",silentAudio:"Hangellentmondás: a prompt csendet és hangot/zenét is kér. Válassz közülük.",oneShotCut:"Vágási ellentmondás: egyetlen folyamatos felvétel mellett vágást vagy montázst is kér. Válassz közülük.",missingSubject:"A fő téma nem egyértelmű. Nevezd meg, minek kell látszania.",missingAction:"A videós mozgás nem egyértelmű. Írj le egy megvalósítható történést időrendben.",missingEdit:"Képmódosításnál írd le, mi maradjon és mi változzon.",missingCamera:"A képkivágást vagy kamerairányt pontosíthatod.",missingLighting:"A fényeket pontosíthatod.",duration:"A promptba írt időtartam nem állítja be a videó hosszát; azt a workflow-ban is add meg.",draft:"Egy szerkeszthető javítási vázlat",apply:"Szerkesztett javítás átvétele",fill:"Átvétel előtt a ⟦...⟧ részt cseréld a saját szavaidra.",stale:"Közben változott a prompt vagy a mód. Átvétel előtt ellenőrizd újra.",confirm:"Lecseréljem a jelenlegi promptot erre a szerkesztett változatra?",applied:"A szerkesztett változat bekerült. Használat előtt olvasd át.",choose:"Ehhez az ellentmondáshoz a te döntésed kell; automatikus átírást nem ajánlok."},
  DE:{button:"Prompt prüfen",help:"Lokale Checkliste, keine Qualitätsnote. Fehlende Details können Absicht sein; kein KI-Modell wird aufgerufen.",present:"Gefunden",unclear:"Unklar",empty:"Bitte zuerst einen Prompt schreiben.",clean:"Kein offensichtlicher Widerspruch. Bitte selbst prüfen.",lockedMotion:"Kamerakonflikt: feste Kamera und Kamerabewegung. Entscheiden Sie sich für eines.",silentAudio:"Audiokonflikt: Stille und Ton/Musik. Entscheiden Sie sich für eines.",oneShotCut:"Schnittkonflikt: durchgehende Aufnahme und Schnitt/Montage. Entscheiden Sie sich für eines.",missingSubject:"Hauptmotiv unklar. Benennen Sie das Sichtbare.",missingAction:"Videobewegung unklar. Eine machbare Handlung zeitlich beschreiben.",missingEdit:"Bei Bildbearbeitung: Erhaltenes und Änderung benennen.",missingCamera:"Ausschnitt oder Kamerarichtung präzisieren.",missingLighting:"Licht präzisieren.",duration:"Die Dauer im Prompt legt die Videolänge nicht fest; auch im Workflow einstellen.",draft:"Ein bearbeitbarer Verbesserungsvorschlag",apply:"Bearbeitete Fassung übernehmen",fill:"⟦...⟧ vor der Übernahme durch eigene Wörter ersetzen.",stale:"Prompt oder Modus geändert. Bitte erneut prüfen.",confirm:"Aktuellen Prompt durch diese Fassung ersetzen?",applied:"Fassung eingefügt. Vor Gebrauch prüfen.",choose:"Dieser Widerspruch erfordert Ihre Entscheidung; keine automatische Änderung."},
  FR:{button:"Vérifier le prompt",help:"Liste locale, pas une note de qualité. Une omission peut être volontaire ; aucun modèle IA n'est appelé.",present:"Présent",unclear:"Peu clair",empty:"Écrivez d'abord un prompt.",clean:"Aucune contradiction évidente. Relisez le résultat.",lockedMotion:"Conflit caméra : caméra fixe et mouvement de caméra. Choisissez l'un.",silentAudio:"Conflit audio : silence et son/musique. Choisissez l'un.",oneShotCut:"Conflit de plan : plan continu et coupe/montage. Choisissez l'un.",missingSubject:"Sujet principal peu clair. Nommez ce qui doit être visible.",missingAction:"Mouvement vidéo peu clair. Décrivez une action faisable dans l'ordre.",missingEdit:"En retouche, précisez ce qui reste et ce qui change.",missingCamera:"Précisez cadrage ou caméra.",missingLighting:"Précisez l'éclairage.",duration:"La durée écrite dans le prompt ne règle pas la vidéo ; réglez-la aussi dans le workflow.",draft:"Une amélioration modifiable",apply:"Utiliser la version modifiée",fill:"Remplacez ⟦...⟧ par vos mots avant de l'utiliser.",stale:"Prompt ou mode modifié. Vérifiez à nouveau.",confirm:"Remplacer le prompt actuel par cette version ?",applied:"Version insérée. Relisez-la.",choose:"Ce conflit demande votre choix ; aucune modification automatique."},
  ES:{button:"Revisar el prompt",help:"Lista local, no puntuación de calidad. Una omisión puede ser intencionada; no se llama a IA.",present:"Presente",unclear:"Poco claro",empty:"Primero escribe un prompt.",clean:"Sin contradicción evidente. Revísalo igualmente.",lockedMotion:"Conflicto de cámara: fija y en movimiento. Elige una opción.",silentAudio:"Conflicto de sonido: silencio y música/sonido. Elige una opción.",oneShotCut:"Conflicto de plano: toma continua y corte/montaje. Elige una opción.",missingSubject:"Sujeto principal poco claro. Nombra lo visible.",missingAction:"Movimiento de vídeo poco claro. Describe una acción factible en orden.",missingEdit:"En edición de imagen, indica qué se conserva y qué cambia.",missingCamera:"Puedes precisar encuadre o cámara.",missingLighting:"Puedes precisar la luz.",duration:"La duración escrita no fija la longitud del vídeo; ajústala también en el workflow.",draft:"Una mejora editable",apply:"Usar versión editada",fill:"Sustituye ⟦...⟧ con tus palabras antes de usarla.",stale:"Cambió el prompt o modo. Revísalo de nuevo.",confirm:"¿Sustituir el prompt actual por esta versión?",applied:"Versión insertada. Revísala.",choose:"Este conflicto necesita tu elección; no hay cambio automático."},
  IT:{button:"Controlla il prompt",help:"Lista locale, non un voto. Le omissioni possono essere volute; nessun modello AI viene chiamato.",present:"Presente",unclear:"Poco chiaro",empty:"Scrivi prima un prompt.",clean:"Nessuna contraddizione evidente. Rileggi comunque.",lockedMotion:"Conflitto camera: fissa e in movimento. Scegline una.",silentAudio:"Conflitto audio: silenzio e suono/musica. Scegline uno.",oneShotCut:"Conflitto ripresa: piano continuo e taglio/montaggio. Scegline uno.",missingSubject:"Soggetto principale poco chiaro. Indica cosa si vede.",missingAction:"Movimento video poco chiaro. Descrivi un'azione fattibile in ordine.",missingEdit:"Nella modifica immagine, indica cosa resta e cosa cambia.",missingCamera:"Puoi precisare inquadratura o camera.",missingLighting:"Puoi precisare la luce.",duration:"La durata nel prompt non imposta la lunghezza del video; regolala anche nel workflow.",draft:"Una miglioria modificabile",apply:"Usa versione modificata",fill:"Sostituisci ⟦...⟧ con parole tue prima dell'uso.",stale:"Prompt o modalità cambiati. Controlla di nuovo.",confirm:"Sostituire il prompt attuale con questa versione?",applied:"Versione inserita. Rileggila.",choose:"Questo conflitto richiede una scelta; nessuna modifica automatica."},
  PT:{button:"Verificar o prompt",help:"Lista local, não uma nota. Uma omissão pode ser intencional; não chama IA.",present:"Presente",unclear:"Pouco claro",empty:"Escreva primeiro um prompt.",clean:"Nenhuma contradição evidente. Reveja o resultado.",lockedMotion:"Conflito de câmara: fixa e em movimento. Escolha uma.",silentAudio:"Conflito de áudio: silêncio e som/música. Escolha um.",oneShotCut:"Conflito de plano: tomada contínua e corte/montagem. Escolha um.",missingSubject:"Tema principal pouco claro. Indique o que deve aparecer.",missingAction:"Movimento do vídeo pouco claro. Descreva uma ação viável em sequência.",missingEdit:"Na edição de imagem, diga o que fica e o que muda.",missingCamera:"Pode precisar enquadramento ou câmara.",missingLighting:"Pode precisar a luz.",duration:"A duração no prompt não define o vídeo; ajuste-a também no workflow.",draft:"Uma melhoria editável",apply:"Usar versão editada",fill:"Substitua ⟦...⟧ pelas suas palavras antes de usar.",stale:"Prompt ou modo alterado. Verifique novamente.",confirm:"Substituir o prompt atual por esta versão?",applied:"Versão inserida. Reveja-a.",choose:"Este conflito exige a sua escolha; sem alteração automática."},
  PL:{button:"Sprawdź prompt",help:"Lokalna lista, nie ocena jakości. Brak może być zamierzony; bez wywołania AI.",present:"Jest",unclear:"Niejasne",empty:"Najpierw napisz prompt.",clean:"Brak oczywistej sprzeczności. Sprawdź wynik samodzielnie.",lockedMotion:"Konflikt kamery: stała kamera i ruch kamery. Wybierz jedno.",silentAudio:"Konflikt dźwięku: cisza i muzyka/dźwięk. Wybierz jedno.",oneShotCut:"Konflikt ujęcia: ciągłe ujęcie i cięcie/montaż. Wybierz jedno.",missingSubject:"Główny temat niejasny. Nazwij to, co widać.",missingAction:"Ruch wideo niejasny. Opisz możliwą akcję po kolei.",missingEdit:"Przy edycji obrazu podaj, co zachować i co zmienić.",missingCamera:"Doprecyzuj kadr lub kamerę.",missingLighting:"Doprecyzuj światło.",duration:"Czas w prompcie nie ustawia długości filmu; ustaw go też w workflow.",draft:"Jedna edytowalna poprawka",apply:"Użyj poprawionej wersji",fill:"Zastąp ⟦...⟧ własnymi słowami przed użyciem.",stale:"Prompt lub tryb się zmienił. Sprawdź ponownie.",confirm:"Zastąpić obecny prompt tą wersją?",applied:"Wersja wstawiona. Sprawdź ją.",choose:"Ten konflikt wymaga Twojego wyboru; bez automatycznej zmiany."}
};
const conflictCopy = {
  EN:{photoArt:"Possible style conflict: this asks for a photorealistic photograph and a painting, illustration, or graffiti. Choose the intended medium.",photoArtChoice:"For example: ‘photorealistic editorial photograph with natural textures’ OR ‘expressive painting with visible brushwork’. Keep only the direction you want.",dayNight:"Possible time-of-day conflict: bright daytime and night are both requested without a transition.",dayNightChoice:"For example: ‘bright midday light’ OR ‘a believable night scene lit by practical lights’. For a transition, describe when it happens.",examples:"Clearer wording to consider:"},
  HU:{photoArt:"Lehetséges stílusütközés: a szöveg fotórealisztikus fényképet és festményt, illusztrációt vagy graffitit is kér. Válaszd ki a kívánt képtípust.",photoArtChoice:"Például: „fotórealisztikus szerkesztőségi fénykép természetes textúrákkal” VAGY „expresszív festmény látható ecsetvonásokkal”. Csak a kívánt irányt hagyd meg.",dayNight:"Lehetséges napszakütközés: erős nappali fény és éjszaka is szerepel, átmenet nélkül.",dayNightChoice:"Például: „erős déli napfény” VAGY „hihető éjszakai jelenet visszafogott mesterséges fényekkel”. Ha átmenetet szeretnél, írd le, mikor történik.",examples:"Tisztább megfogalmazás lehet:"},
  DE:{photoArt:"Möglicher Stilkonflikt: Fotografie und Gemälde, Illustration oder Graffiti zugleich. Wählen Sie das gewünschte Medium.",photoArtChoice:"Zum Beispiel: ‘fotorealistisches Editorial-Foto’ ODER ‘ausdrucksstarkes Gemälde mit sichtbaren Pinselstrichen’. Nur eine Richtung beibehalten.",dayNight:"Möglicher Tageszeitkonflikt: helles Tageslicht und Nacht ohne Übergang.",dayNightChoice:"Zum Beispiel: ‘helles Mittagslicht’ ODER ‘glaubwürdige Nachtszene mit dezenten Lichtquellen’. Einen Übergang zeitlich beschreiben.",examples:"Klarere Formulierung:"},
  FR:{photoArt:"Conflit de style possible : photographie photoréaliste et peinture, illustration ou graffiti à la fois. Choisissez le médium voulu.",photoArtChoice:"Par exemple : « photographie éditoriale photoréaliste » OU « peinture expressive aux coups de pinceau visibles ». Gardez une seule direction.",dayNight:"Conflit d'heure possible : pleine lumière du jour et nuit sans transition.",dayNightChoice:"Par exemple : « lumière vive de midi » OU « scène nocturne crédible ». Décrivez le moment d'une transition.",examples:"Formulation plus claire :"},
  ES:{photoArt:"Posible conflicto de estilo: fotografía fotorrealista y pintura, ilustración o grafiti a la vez. Elige el medio deseado.",photoArtChoice:"Por ejemplo: « fotografía editorial fotorrealista » O « pintura expresiva con pinceladas visibles ». Conserva solo una dirección.",dayNight:"Posible conflicto horario: luz diurna intensa y noche sin transición.",dayNightChoice:"Por ejemplo: « luz intensa del mediodía » O « escena nocturna creíble ». Si hay transición, indica cuándo ocurre.",examples:"Una formulación más clara:"},
  IT:{photoArt:"Possibile conflitto di stile: fotografia fotorealistica e dipinto, illustrazione o graffiti insieme. Scegli il medium desiderato.",photoArtChoice:"Per esempio: « fotografia editoriale fotorealistica » O « dipinto espressivo con pennellate visibili ». Mantieni una sola direzione.",dayNight:"Possibile conflitto temporale: luce del giorno intensa e notte senza transizione.",dayNightChoice:"Per esempio: « luce intensa di mezzogiorno » O « scena notturna credibile ». Descrivi quando avviene la transizione.",examples:"Formulazione più chiara:"},
  PT:{photoArt:"Possível conflito de estilo: fotografia fotorrealista e pintura, ilustração ou graffiti ao mesmo tempo. Escolha o meio pretendido.",photoArtChoice:"Por exemplo: « fotografia editorial fotorrealista » OU « pintura expressiva com pinceladas visíveis ». Mantenha apenas uma direção.",dayNight:"Possível conflito de hora: luz do dia intensa e noite sem transição.",dayNightChoice:"Por exemplo: « luz forte do meio-dia » OU « cena noturna credível ». Descreva quando ocorre a transição.",examples:"Formulação mais clara:"},
  PL:{photoArt:"Możliwy konflikt stylu: fotorealistyczne zdjęcie oraz obraz, ilustracja lub graffiti naraz. Wybierz medium.",photoArtChoice:"Na przykład: « fotorealistyczne zdjęcie edytorialne » ALBO « ekspresyjny obraz z widocznymi pociągnięciami pędzla ». Zachowaj jeden kierunek.",dayNight:"Możliwy konflikt pory dnia: jasne światło dzienne i noc bez przejścia.",dayNightChoice:"Na przykład: « jasne światło południa » ALBO « wiarygodna scena nocna ». Przy przejściu opisz jego moment.",examples:"Jaśniejsze sformułowanie:"}
};
const guideReviewCopy = {
  EN:{title:"Before you use this draft",intro:"Check possible contradictions and optional local LoRAs. Nothing is added or activated automatically.",family:"Target model family",choose:"Choose a model family",search:"Suggest matching LoRAs",working:"Checking local LoRAs…",unavailable:"Start the local Prompt Studio to read your LoRAs.",none:"No matching LoRA found. The prompt works without one.",select:"Choose the model family first.",stale:"The prompt changed. Finish the guide again before using these suggestions.",clear:"No obvious conflict found; read the prompt yourself.",likely:"Likely family match from file information; verify before use.",review:"Compatibility not confirmed; check the LoRA description.",matched:"Matching words",source:"Source",copy:"Copy filename",copied:"Copied"},
  HU:{title:"Mielőtt használnád a vázlatot",intro:"Nézd át a lehetséges ütközéseket és a helyi LoRA-javaslatokat. Semmi nem kerül be vagy kapcsolódik be magától.",family:"Célmodell családja",choose:"Válassz modellcsaládot",search:"Illő LoRA-k keresése",working:"Helyi LoRA-k ellenőrzése…",unavailable:"A LoRA-k olvasásához a helyi Prompt Studio-indítót használd.",none:"Nem találtam illő LoRA-t. A prompt nélküle is használható.",select:"Előbb válassz modellcsaládot.",stale:"Közben változott a prompt. A javaslatokhoz fejezd be újra a Szamárvezetőt.",clear:"Nem találtam nyilvánvaló ütközést; azért olvasd át a promptot.",likely:"Valószínű modellcsalád-egyezés a fájladatok alapján; használat előtt ellenőrizd.",review:"A kompatibilitás nem igazolt; nézd meg a LoRA leírását.",matched:"Egyező szavak",source:"Adatforrás",copy:"Fájlnév másolása",copied:"Másolva"},
  DE:{title:"Vor der Verwendung des Entwurfs",intro:"Mögliche Widersprüche und lokale LoRAs prüfen. Nichts wird automatisch eingefügt.",family:"Zielmodellfamilie",choose:"Modellfamilie wählen",search:"Passende LoRAs suchen",working:"Lokale LoRAs prüfen…",unavailable:"Lokalen Prompt Studio-Starter verwenden.",none:"Keine passende LoRA gefunden. Der Prompt funktioniert auch ohne.",select:"Zuerst Modellfamilie wählen.",stale:"Prompt geändert. Entwurf erneut abschließen.",clear:"Kein offensichtlicher Widerspruch; bitte selbst prüfen.",likely:"Wahrscheinliche Familienübereinstimmung laut Dateidaten; vor Nutzung prüfen.",review:"Kompatibilität nicht bestätigt.",matched:"Passende Wörter",source:"Quelle",copy:"Dateiname kopieren",copied:"Kopiert"},
  FR:{title:"Avant d'utiliser ce brouillon",intro:"Vérifiez les contradictions et les LoRA locales. Rien n'est ajouté automatiquement.",family:"Famille du modèle",choose:"Choisir une famille",search:"Chercher des LoRA adaptées",working:"Vérification des LoRA locales…",unavailable:"Démarrez Prompt Studio localement.",none:"Aucune LoRA adaptée trouvée. Le prompt fonctionne sans LoRA.",select:"Choisissez d'abord la famille du modèle.",stale:"Le prompt a changé. Terminez à nouveau le guide.",clear:"Aucun conflit évident ; relisez le prompt.",likely:"Famille probablement correspondante selon les fichiers ; vérifiez avant usage.",review:"Compatibilité non confirmée.",matched:"Mots communs",source:"Source",copy:"Copier le nom",copied:"Copié"},
  ES:{title:"Antes de usar el borrador",intro:"Revisa contradicciones y LoRA locales. Nada se añade automáticamente.",family:"Familia del modelo",choose:"Elige una familia",search:"Buscar LoRA apropiadas",working:"Revisando LoRA locales…",unavailable:"Inicia Prompt Studio localmente.",none:"No se encontró una LoRA adecuada. El prompt funciona sin ella.",select:"Elige primero la familia del modelo.",stale:"El prompt cambió. Termina otra vez la guía.",clear:"Sin conflictos evidentes; revisa el prompt.",likely:"Posible coincidencia de familia según los archivos; compruébala.",review:"Compatibilidad no confirmada.",matched:"Palabras coincidentes",source:"Fuente",copy:"Copiar nombre",copied:"Copiado"},
  IT:{title:"Prima di usare la bozza",intro:"Controlla contraddizioni e LoRA locali. Nulla viene aggiunto automaticamente.",family:"Famiglia del modello",choose:"Scegli una famiglia",search:"Cerca LoRA adatte",working:"Controllo delle LoRA locali…",unavailable:"Avvia Prompt Studio in locale.",none:"Nessuna LoRA adatta trovata. Il prompt funziona anche senza.",select:"Scegli prima la famiglia del modello.",stale:"Il prompt è cambiato. Completa di nuovo la guida.",clear:"Nessun conflitto evidente; rileggi il prompt.",likely:"Possibile compatibilità di famiglia dai dati del file; verifica.",review:"Compatibilità non confermata.",matched:"Parole in comune",source:"Fonte",copy:"Copia nome",copied:"Copiato"},
  PT:{title:"Antes de usar o rascunho",intro:"Verifique contradições e LoRAs locais. Nada é adicionado automaticamente.",family:"Família do modelo",choose:"Escolha uma família",search:"Procurar LoRAs adequadas",working:"A verificar LoRAs locais…",unavailable:"Inicie o Prompt Studio localmente.",none:"Nenhuma LoRA adequada encontrada. O prompt funciona sem ela.",select:"Escolha primeiro a família do modelo.",stale:"O prompt mudou. Termine o guia novamente.",clear:"Sem conflito evidente; reveja o prompt.",likely:"Possível correspondência de família nos dados do ficheiro; confirme.",review:"Compatibilidade não confirmada.",matched:"Palavras coincidentes",source:"Fonte",copy:"Copiar nome",copied:"Copiado"},
  PL:{title:"Przed użyciem szkicu",intro:"Sprawdź sprzeczności i lokalne LoRA. Nic nie jest dodawane automatycznie.",family:"Rodzina modelu",choose:"Wybierz rodzinę",search:"Znajdź pasujące LoRA",working:"Sprawdzanie lokalnych LoRA…",unavailable:"Uruchom Prompt Studio lokalnie.",none:"Nie znaleziono pasującej LoRA. Prompt działa również bez niej.",select:"Najpierw wybierz rodzinę modelu.",stale:"Prompt się zmienił. Zakończ przewodnik ponownie.",clear:"Brak oczywistego konfliktu; przeczytaj prompt.",likely:"Prawdopodobna zgodność rodziny według danych pliku; sprawdź.",review:"Zgodność niepotwierdzona.",matched:"Pasujące słowa",source:"Źródło",copy:"Kopiuj nazwę",copied:"Skopiowano"}
};
const cue = {
  setting:/\b(street|room|studio|forest|city|beach|background|setting|location|utca|szoba|stúdió|erdő|város|tengerpart|háttér|helyszín)\b/iu,
  action:/\b(walks?|turns?|moves?|dances?|runs?|looks?|fly|flies|opens?|changes?|sétál|fordul|mozog|táncol|fut|kinyílik|változik)\b/iu,
  camera:/\b(camera|shot|lens|framing|close-up|wide-angle|pan|zoom|kamera|képkivágás|közelkép|objektív|svenk|közelítés)\b/iu,
  lighting:/\b(light|lighting|sunset|sunrise|shadow|golden.hour|fény|világítás|naplemente|napkelte|árnyék)\b/iu,
  style:/\b(cinematic|photorealistic|editorial|painting|anime|film|style|moody|filmes|fotórealisztikus|festmény|stílus|hangulat)\b/iu
};
function fold(value) { return String(value || "").normalize("NFKC").toLocaleLowerCase(); }
const skipWords=new Set("with from into over under this that these those have has will would should could without while where when whose them they then very more most less some such csak hogy mint majd után előtt együtt vagy pedig amikor amelyik számára".split(" "));
function classify(part, index) {
  for (const [key, pattern] of Object.entries(cue)) if (pattern.test(part)) return key;
  return index === 0 ? "subject" : "subject";
}
export function recommendPromptStructure(entries, mode) {
  const matching = (Array.isArray(entries) ? entries : []).filter((entry) => entry?.mode === mode && typeof entry.prompt === "string" && entry.prompt.trim());
  const patterns = new Map();
  for (const entry of matching) {
    const chunks = entry.prompt.replace(/<lora:[^>]*>/giu," ").split(/[,;.!?\n]+/u).map((part) => part.trim()).filter(Boolean).slice(0,24);
    const keys = [];
    for (const [index, chunk] of chunks.entries()) {
      const key = classify(chunk,index);
      if (!keys.includes(key)) keys.push(key);
    }
    if (keys.length < 2) continue;
    const signature = keys.join("|");
    patterns.set(signature,(patterns.get(signature)||0)+1);
  }
  const [signature,matches] = [...patterns.entries()].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]))[0] || [];
  const learned = matching.length >= 3 && matches >= 2;
  return { order:learned ? signature.split("|") : [...(defaultOrder[mode] || defaultOrder.image)], count:matching.length, matches:matches || 0, learned };
}
export function collectCompletionTerms(entries, glossary, archiveCandidates, language="EN") {
  const terms = new Map();
  function add(term, source, weight=1) {
    const value=String(term || "").replace(/<lora:[^>]*>/giu," ").trim().replace(/\s+/gu," ");
    if (value.length < 3 || value.length > 90 || /[<>\[\]{}]/u.test(value) || (!value.includes(" ") && skipWords.has(fold(value)))) return;
    const key=fold(value);
    const old=terms.get(key);
    if (!old || weight > old.weight) terms.set(key,{term:value,source,weight});
  }
  for (const entry of (Array.isArray(entries) ? entries : []).slice(0,150)) {
    if (entry.language !== language) continue;
    for (const part of String(entry.prompt || "").split(/[,;.!?\n]+/u).slice(0,50)) {
      const value=part.trim();
      if (value.split(/\s+/u).length <= 7) add(value,"saved",4);
      for (const word of value.match(/[\p{L}][\p{L}\p{M}'’-]{3,}/gu) || []) add(word,"saved",3);
    }
  }
  for (const row of (Array.isArray(glossary) ? glossary : []).slice(0,2000)) {
    if (row.source === language) add(row.from,"glossary",6);
    if (row.target === language) add(row.to,"glossary",6);
  }
  // The archive endpoint returns ranked candidates, not whole prompts.
  for (const row of (Array.isArray(archiveCandidates) ? archiveCandidates : []).slice(0,1000)) {
    add(row.term,"archive",Math.min(3,1+Math.log2(1+Number(row.count||1))/10));
    for (const word of String(row.term || "").match(/[\p{L}][\p{L}\p{M}'’-]{3,}/gu) || []) add(word,"archive",1);
  }
  return [...terms.values()].sort((a,b) => b.weight-a.weight || a.term.localeCompare(b.term));
}
export function completionMatches(text, caret, terms, max=6) {
  const before=String(text || "").slice(0,caret);
  const match=before.match(/([\p{L}][\p{L}\p{M}'’-]{1,})$/u);
  if (!match) return [];
  const fragment=fold(match[1]);
  const start=before.length-match[1].length;
  const seen=new Set();
  return (terms || []).filter(({term}) => {
    const key=fold(term);
    if (!key.startsWith(fragment) || key === fragment || seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0,max).map((item) => ({...item,start,end:caret}));
}
export function buildCoachDraft(order, answers, language="EN", placeholders=true) {
  const names=labels[language] || labels.EN;
  const chosen=(order || defaultOrder.image).filter((key) => names[key]);
  const parts=chosen.map((key) => String(answers?.[key] || "").trim() || (placeholders?`[${names[key]}]`:"")).filter(Boolean);
  return parts.length ? parts.join(", ") + "." : "";
}

const checkPatterns = {
  subject:/[\p{L}]{2,}/u,
  action:/\b(?:walk(?:s|ed|ing)?|turn(?:s|ed|ing)?|mov(?:e|es|ed|ing)|danc(?:e|es|ed|ing)|run(?:s|ning)?|fly|flies|flew|open(?:s|ed|ing)?|clos(?:e|es|ed|ing)|reach(?:es|ed|ing)?|smil(?:e|es|ed|ing)|look(?:s|ed|ing)?|ris(?:e|es|ing|en)|fall(?:s|ing|en)?|sétál\w*|fordul\w*|mozog\w*|táncol\w*|fut\w*|repül\w*|nyíl\w*|emelkedik|lép\w*|se\s+mueve|camina|danza|marche|bouge|läuft|bewegt|sposta|cammina|anda|porusza|idzie)\b/iu,
  setting:/\b(?:street|room|studio|forest|city|beach|lake|desert|mountain|background|location|utca|szoba|stúdió|erdő|város|tengerpart|tó|sivatag|hegy|háttér|helyszín|rue|forêt|ville|playa|calle|bosque|strada|città|rua|floresta|ulica|las)\b/iu,
  camera:/\b(?:camera|shot|close[- ]?up|wide[- ]?angle|portrait|full[- ]?body|framing|lens|pan|tilt|zoom|dolly|orbit|kamera|képkivágás|közelkép|nagytotál|objektív|portré|kameramozgás|caméra|cámara|inquadratura|câmara|kadr)\b/iu,
  lighting:/\b(?:light|lighting|sunrise|sunset|shadow|golden hour|backlit|fény|világítás|napkelte|naplemente|árnyék|contre[- ]?jour|lumière|luz|iluminación|luce|illuminazione|światło|oświetlenie)\b/iu,
  style:/\b(?:cinematic|photorealistic|editorial|painting|anime|film|style|mood|watercolor|filmes|fotórealisztikus|festmény|stílus|hangulat|cinématographique|pintura|pittura|malerei|styl|nastrój)\b/iu,
  locked:/(?:\b(?:locked(?:[- ]off)?|static|fixed|stationary|tripod[- ]mounted)\s+(?:camera|shot)\b|\b(?:camera|kamera|caméra|cámara|câmara)\s+(?:is\s+)?(?:static|fixed|locked|áll|mozdulatlan|fixe|fija)\b|\bfix\s+kamera\b)/iu,
  moving:/(?:\b(?:camera|kamera|caméra|cámara|câmara)\s+(?:slowly\s+)?(?:pans?|tilts?|tracks?|orbits?|rotates?|spins?|zooms?|doll(?:y|ies)|moves?|fordul|mozog|közelít|körbejár)\b|\b(?:pan(?:ning)?|tilt(?:ing)?|tracking shot|dolly|orbit|zoom(?:ing)?|kameraív|kameramozgás)\b)/iu,
  silence:/\b(?:silent|no sound|no audio|muted|néma|hang nélkül|nincs hang|sin sonido|sans son|ohne Ton|senza audio|sem som|bez dźwięku)\b/iu,
  audio:/\b(?:music|sound effects?|audio|dialogue|soundtrack|zene|hanghatás|zaj|hangok|música|sonido|musique|musik|musica|dźwięk)\b/iu,
  continuous:/\b(?:one continuous shot|single continuous shot|unbroken shot|one take|single take|egy folyamatos snitt|egyetlen folyamatos felvétel|plan séquence|plano secuencia)\b/iu,
  cut:/\b(?:cut to|jump cut|montage|intercut|vágás|vágjon|montázs|corte|coupe|schnitt|taglio|cięcie)\b/iu,
  edit:/\b(?:keep|preserve|retain|change|replace|modify|make|transform|instead of|tartsd|őrizd|maradjon|változzon|cseréld|legyen|alakítsd|garder|changer|mantener|cambiar|conservare|modificare|manter|alterar|zachowaj|zmień)\b/iu,
  duration:/\b\d+(?:[.,]\d+)?\s*(?:seconds?|secs?|másodperc|mp|sekunden|secondes?|segundos?|secondi|segundos?|sekund)\b/iu
};
const qualityOnly=/^(?:masterpiece|best quality|ultra detailed|highly detailed|professional quality|8k|4k|high resolution|remekmű|részletgazdag)(?:\s|$)/iu;
function appendCheckPlaceholder(text, key, language) {
  const name=(labels[language] || labels.EN)[key];
  const base=text.trim().replace(/[.!?]\s*$/u,"");
  return `${base}, ⟦${name}⟧.`;
}
export function inspectPrompt(text, mode="image", language="EN") {
  const prompt=String(text || "").slice(0,50000).trim();
  if (!prompt) return {empty:true,coverage:{},issues:["empty"],primary:"empty",draft:""};
  const plain=prompt.replace(/<lora:[^>]*>/giu," ");
  const clauses=plain.split(/[,;.!?\n]+/u).map((part)=>part.trim()).filter(Boolean);
  const subject=clauses.some((part)=>!qualityOnly.test(part) && part.match(/[\p{L}]{2,}/gu)?.length >= 2 &&
    (part.match(/[\p{L}]{2,}/gu)?.length >= 4 || !["camera","lighting","style"].some((key)=>checkPatterns[key].test(part))));
  const coverage={subject,setting:checkPatterns.setting.test(plain),action:checkPatterns.action.test(plain),
    camera:checkPatterns.camera.test(plain),lighting:checkPatterns.lighting.test(plain),style:checkPatterns.style.test(plain)};
  const video=mode==="video" || mode==="i2v";
  const issues=[];
  const withoutNegatedMovement=plain.replace(/\b(?:no|without|avoid|not|ne|nincs|sans|sin|ohne|senza|sem|bez)\s+(?:camera\s+)?(?:pan|zoom|orbit|dolly|tilt|kameramozgás)\b/giu," ");
  if(video && checkPatterns.locked.test(plain) && checkPatterns.moving.test(withoutNegatedMovement)) issues.push("lockedMotion");
  const withoutSilence=plain.replace(checkPatterns.silence," ")
    .replace(/\b(?:no|without|avoid|not|ne|nincs|sans|sin|ohne|senza|sem|bez)\s+(?:music|sound(?: effects?)?|audio|dialogue|zene|hanghatás|música|sonido|musique|musik|musica|dźwięk)\b/giu," ");
  if(video && checkPatterns.silence.test(plain) && checkPatterns.audio.test(withoutSilence)) issues.push("silentAudio");
  if(video && checkPatterns.continuous.test(plain) && checkPatterns.cut.test(plain)) issues.push("oneShotCut");
  const positive=plain.replace(/(?<![\p{L}\p{N}])(?:not|no|without|avoid|nem|ne|nincs|sans|sin|ohne|senza|sem|bez)\s+(?:a\s+|an\s+|egy\s+)?(?:photorealistic|realistic|photo|photograph|painting|illustration|graffiti|watercolor|fotórealisztikus|fénykép|festmény|illusztráció|akvarell|fotó)(?![\p{L}\p{N}])/giu," ");
  const photo=/\b(?:photorealistic\s+(?:editorial\s+)?photograph|photorealistic\s+photo|realistic\s+photo(?:graph)?|fotórealisztikus\s+(?:szerkesztőségi\s+)?fénykép|fotórealisztikus\s+fotó|fotorealistisches\s+foto|photographie\s+photoréaliste|fotografía\s+fotorrealista|fotografia\s+fotorealistica|fotografia\s+fotorrealista)\b/iu;
  const art=/\b(?:oil\s+painting|watercolor\s+painting|painting|watercolor|illustration|graffiti|olajfestmény|akvarell|festmény|illusztráció|gemälde|aquarell|peinture|aquarelle|pintura|acuarela|dipinto|acquerello|aguarela|obraz\s+olejny|akwarela|ilustracja)\b/iu;
  if(!video && photo.test(positive) && art.test(positive)) issues.push("photoArt");
  const day=/\b(?:bright\s+daylight|midday|noon|strong\s+daylight|erős\s+nappali\s+fény|déli\s+napfény|Mittagslicht|plein\s+jour|mediodía|mezzogiorno|meio-dia|południe)\b/iu;
  const night=/(?<![\p{L}\p{N}])(?:night\s+scene|nighttime|midnight|at\s+night|éjszakai\s+jelenet|éjszaka|Nachtaufnahme|scène\s+nocturne|escena\s+nocturna|scena\s+notturna|cena\s+noturna|scena\s+nocna)(?![\p{L}\p{N}])/iu;
  const transition=/(?<![\p{L}\p{N}])(?:from\s+day\s+to\s+night|transitions?|time[- ]lapse|then|later|majd|később|átmenet|übergeht|puis|ensuite|luego|después|poi|depois|potem)(?![\p{L}\p{N}])/iu;
  if(day.test(positive) && night.test(positive) && !transition.test(positive)) issues.push("dayNight");
  if(!coverage.subject && mode!=="i2v") issues.push("missingSubject");
  if(video && !coverage.action) issues.push("missingAction");
  if(mode==="i2i" && !checkPatterns.edit.test(plain)) issues.push("missingEdit");
  if(!coverage.camera) issues.push("missingCamera");
  if(!coverage.lighting) issues.push("missingLighting");
  if(video && checkPatterns.duration.test(plain)) issues.push("duration");
  const primary=issues[0] || "clean";
  const conflict=["lockedMotion","silentAudio","oneShotCut","photoArt","dayNight"].includes(primary);
  const placeholderKey=primary==="missingSubject"?"subject":primary==="missingAction"||primary==="missingEdit"?"action":primary==="missingCamera"?"camera":primary==="missingLighting"?"lighting":"";
  const draft=!conflict && placeholderKey ? appendCheckPlaceholder(prompt,placeholderKey,language) : "";
  return {empty:false,coverage,issues,primary,draft};
}

export function attachPromptCoach({getLanguage,getMode,getCurrent,setPrompt,getAddonFamilies=()=>[],inferAddonFamily=()=>"",suggestGuideAddons=async()=>({status:"unavailable",items:[]})}) {
  const host=document.querySelector(".form-column");
  const before=document.getElementById("i2i-workspace");
  const panel=document.createElement("details");
  panel.className="form-card prompt-coach";
panel.innerHTML=`<summary id="coach-title"></summary><div class="coach-body"><p id="coach-intro"></p><label class="coach-toggle"><input id="coach-auto" type="checkbox"><span id="coach-auto-label"></span></label><p id="coach-auto-help"></p><div class="coach-actions"><button id="coach-outline" type="button" class="secondary-action"></button><button id="coach-guide" type="button" class="secondary-action"></button><button id="coach-check" type="button" class="secondary-action"></button></div><p id="coach-outline-help"></p><div id="coach-outline-panel" hidden><p id="coach-origin"></p><ol id="coach-order"></ol><textarea id="coach-outline-text" rows="4" aria-label="Editable prompt structure"></textarea><button id="coach-apply-outline" type="button" class="quiet-action"></button></div><div id="coach-guide-panel" hidden><p id="coach-guide-help"></p><strong id="coach-progress"></strong><label id="coach-question" for="coach-answer"></label><p id="coach-tip"></p><small id="coach-example"></small><textarea id="coach-answer" rows="3"></textarea><div class="coach-actions"><button id="coach-back" type="button" class="quiet-action"></button><button id="coach-next" type="button" class="secondary-action"></button></div><div id="coach-guide-review" hidden><h3 id="coach-guide-review-title"></h3><p id="coach-guide-review-intro"></p><ul id="coach-guide-conflicts"></ul><div class="coach-actions"><label><span id="coach-guide-family-label"></span><select id="coach-guide-family"></select></label><button id="coach-guide-addons" type="button" class="secondary-action"></button></div><p id="coach-guide-addon-status" role="status" aria-live="polite"></p><div id="coach-guide-addon-results"></div></div></div><div id="coach-check-panel" hidden><p id="coach-check-help"></p><div id="coach-check-coverage"></div><ul id="coach-check-issues"></ul><div id="coach-check-draft-box" hidden><label id="coach-check-draft-label" for="coach-check-draft"></label><textarea id="coach-check-draft" rows="5"></textarea><button id="coach-check-apply" type="button" class="quiet-action"></button></div><p id="coach-check-status" role="status" aria-live="polite"></p></div><p id="coach-status" role="status" aria-live="polite"></p></div>`;
  host.insertBefore(panel,before);
  const el=(id)=>panel.querySelector(`#${id}`);
  const fields=["prompt-output","i2v-prompt","i2i-prompt","brief","subject","action","setting","i2v-idea","i2i-keep","i2i-change"].map((id)=>document.getElementById(id)).filter(Boolean);
  let enabled=true;
  try { enabled=localStorage.getItem(enabledKey)!=="false"; } catch {}
  el("coach-auto").checked=enabled;
  let archive=[],archiveLoaded=false,archiveLoading=false;
  let terms=[],currentField=null,menu=null,visible=[],selected=0,step=0,guideMode=getMode(),outlineMode=getMode();
  const answersByMode={image:{},video:{},i2v:{},i2i:{}};
  const outlinesByMode={};
  let checkResult=null,checkSnapshot=null;
  let guideSnapshot=null,guideRequest=0;
  const t=()=>copy[getLanguage()] || copy.EN;
  const gt=()=>guideReviewCopy[getLanguage()] || guideReviewCopy.EN;
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem(libraryKey)||"[]");}catch{return [];}};
  const sentenceToggle=document.createElement("button"); sentenceToggle.type="button"; sentenceToggle.className="secondary-action";
  panel.querySelector(".coach-actions").appendChild(sentenceToggle);
  const sentencePanel=document.createElement("div"); sentencePanel.className="coach-sentences"; sentencePanel.hidden=true;
  const sentenceTitle=document.createElement("h3"),sentenceHelp=document.createElement("p");
  const sentenceSearch=document.createElement("input"); sentenceSearch.type="search";
  const sentenceStatus=document.createElement("p"); sentenceStatus.setAttribute("role","status");
  const sentenceList=document.createElement("div"); sentenceList.className="coach-sentence-list";
  sentencePanel.append(sentenceTitle,sentenceHelp,sentenceSearch,sentenceStatus,sentenceList);
  panel.querySelector(".coach-body").appendChild(sentencePanel);
  let sentenceRows=[],sentenceKind="",sentenceRevision=0;
  const sc=()=>sentenceCopy[getLanguage()]||sentenceCopy.EN;
  function renderSentenceLabels(){
    sentenceToggle.textContent=sc().button;sentenceTitle.textContent=sc().title;sentenceHelp.textContent=sc().help;
    sentenceSearch.placeholder=sc().search;sentenceSearch.setAttribute("aria-label",sc().search);
  }
  function renderSentences(){
    sentenceList.replaceChildren();
    const needle=sentenceSearch.value.trim().normalize("NFKC").toLocaleLowerCase();
    const shown=sentenceRows.filter((row)=>!needle||row.text.normalize("NFKC").toLocaleLowerCase().includes(needle)).slice(0,30);
    if(!shown.length){sentenceStatus.textContent=sc().empty;return;}
    sentenceStatus.textContent="";
    for(const row of shown){
      const item=document.createElement("div");item.className="coach-sentence-row";
      const text=document.createElement("p");text.textContent=row.text;
      const count=document.createElement("small");count.textContent=sc().count.replace("{count}",row.count);
      const add=document.createElement("button");add.type="button";add.className="quiet-action";add.textContent=sc().add;
      add.addEventListener("click",()=>{
        const id=["video","image"].includes(getMode())?"prompt-output":getMode()==="i2v"?"i2v-prompt":"i2i-prompt";
        const field=document.getElementById(id);
        if(!field)return;
        field.value+=(field.value.trim()?"\n":"")+row.text;
        field.dispatchEvent(new Event("input",{bubbles:true}));
        field.focus();
      });
      item.append(text,count,add);sentenceList.appendChild(item);
    }
  }
  async function loadSentences(){
    const kind=["video","i2v"].includes(getMode())?"video":"image",revision=++sentenceRevision;
    sentenceKind=kind;sentenceStatus.textContent="";sentenceRows=[];
    const saved=getSaved().filter((item)=>item?.prompt).map((item)=>({prompt:item.prompt,kind:["video","i2v"].includes(item.mode)?"video":"image"}));
    const local=collectSentenceCandidates(saved,{kind,limit:100,minCount:2});
    let archiveRows=[];
    const localHost=location.protocol==="http:"&&location.hostname==="127.0.0.1";
    if(localHost){
      try{
        const response=await fetch(`/api/catalog/sentences?kind=${kind}`,{cache:"no-store"});
        if(!response.ok)throw new Error("archive");
        archiveRows=(await response.json()).candidates||[];
      }catch{sentenceStatus.textContent=sc().error;}
    }else sentenceStatus.textContent=sc().offline;
    if(revision!==sentenceRevision)return;
    const merged=new Map();
    for(const row of [...archiveRows,...local]){
      const key=String(row.text||"").normalize("NFKC").toLocaleLowerCase();
      if(!key)continue;
      const old=merged.get(key);
      if(old)old.count+=Number(row.count)||0;
      else merged.set(key,{text:row.text,count:Number(row.count)||0});
    }
    sentenceRows=[...merged.values()].sort((a,b)=>b.count-a.count||a.text.localeCompare(b.text)).slice(0,40);
    renderSentences();
  }
  sentenceToggle.addEventListener("click",()=>{
    sentencePanel.hidden=!sentencePanel.hidden;
    if(!sentencePanel.hidden){sentenceSearch.value="";void loadSentences();}
  });
  sentenceSearch.addEventListener("input",renderSentences);
  const getGlossary=()=>{try{return JSON.parse(localStorage.getItem(glossaryKey)||"[]");}catch{return [];}};
  function fieldLanguage(field) {
    if (["brief","subject","action","setting"].includes(field?.id)) return document.getElementById("source-language")?.value || getLanguage();
    if (["i2v-idea","i2i-keep","i2i-change"].includes(field?.id)) return getLanguage();
    return getCurrent().language || "EN";
  }
  function refreshTerms() { terms=collectCompletionTerms(getSaved(),getGlossary(),archive,fieldLanguage(currentField)); }
  function hideMenu() { if (menu) menu.remove(); menu=null; visible=[]; selected=0; }
  function applyCompletion(index) {
    const item=visible[index]; if (!item || !currentField) return;
    currentField.setRangeText(item.term,item.start,item.end,"end");
    currentField.dispatchEvent(new Event("input",{bubbles:true}));
    currentField.focus(); hideMenu();
  }
  function showMenu(field) {
    hideMenu(); if (!enabled || field.selectionStart!==field.selectionEnd) return;
    visible=completionMatches(field.value,field.selectionStart,terms);
    if (!visible.length) return;
    currentField=field;
    menu=document.createElement("div"); menu.className="coach-completions"; menu.setAttribute("role","listbox");
    for (const [index,item] of visible.entries()) {
      const button=document.createElement("button"); button.type="button"; button.setAttribute("role","option");
      button.textContent=item.term;
      const source=document.createElement("small"); source.textContent=t()[`source${item.source[0].toUpperCase()+item.source.slice(1)}`] || item.source; button.appendChild(source);
      button.addEventListener("mousedown",(event)=>event.preventDefault());
      button.addEventListener("click",()=>applyCompletion(index)); menu.appendChild(button);
    }
    field.insertAdjacentElement("afterend",menu); updateSelection();
  }
  function updateSelection() { menu?.querySelectorAll("button").forEach((button,index)=>button.setAttribute("aria-selected",String(index===selected))); }
  async function loadArchive() {
    if (archiveLoaded || archiveLoading || !location.protocol.startsWith("http")) return;
    archiveLoading=true;
    try { const response=await fetch("/api/catalog/glossary-candidates",{cache:"no-store"}); if (response.ok) {const data=await response.json(); archive=Array.isArray(data.candidates)?data.candidates:[];archiveLoaded=true;refreshTerms();} }
    catch {} finally {archiveLoading=false;}
  }
  for (const field of fields) {
    field.setAttribute("autocomplete","off");
    field.addEventListener("focus",()=>{currentField=field;refreshTerms();void loadArchive();});
    field.addEventListener("input",()=>showMenu(field));
    field.addEventListener("click",()=>hideMenu());
    field.addEventListener("blur",()=>setTimeout(()=>{if (document.activeElement?.closest(".coach-completions")!==menu) hideMenu();},100));
    field.addEventListener("keydown",(event)=>{
      if (!menu) return;
      if (event.key==="Escape") {hideMenu();event.preventDefault();}
      else if (event.key==="ArrowDown") {selected=(selected+1)%visible.length;updateSelection();event.preventDefault();}
      else if (event.key==="ArrowUp") {selected=(selected+visible.length-1)%visible.length;updateSelection();event.preventDefault();}
      else if (event.key==="Tab" || event.key==="Enter") {applyCompletion(selected);event.preventDefault();}
    });
  }
  el("coach-auto").addEventListener("change",()=>{enabled=el("coach-auto").checked;hideMenu();try{localStorage.setItem(enabledKey,String(enabled));}catch{}});
  function insertDraft(draft) {
    if (!draft.trim()) {el("coach-status").textContent=t().empty;return false;}
    if (getCurrent().prompt?.trim() && !window.confirm(t().confirm)) {el("coach-status").textContent=t().noInsert;return false;}
    setPrompt(draft,getCurrent().language || "EN");
    el("coach-status").textContent=t().ready;
    return true;
  }
  function renderOutline() {
    const result=recommendPromptStructure(getSaved(),getMode());
    el("coach-origin").textContent=result.learned?t().saved.replace("{count}",result.count).replace("{matches}",result.matches):t().fallback;
    const order=el("coach-order");order.replaceChildren();
    for (const key of result.order) {const li=document.createElement("li");li.textContent=(labels[getLanguage()]||labels.EN)[key];order.appendChild(li);}
    el("coach-outline-text").value=outlinesByMode[getMode()] ?? buildCoachDraft(result.order,{},getCurrent().language || "EN");
  }
  el("coach-outline").addEventListener("click",()=>{
    const box=el("coach-outline-panel");if(!el("coach-guide-panel").hidden)saveAnswer();
    if(!box.hidden)outlinesByMode[outlineMode]=el("coach-outline-text").value;
    box.hidden=!box.hidden;el("coach-guide-panel").hidden=true;
    if (box.hidden) return;
    outlineMode=getMode();renderOutline();
  });
  el("coach-apply-outline").addEventListener("click",()=>insertDraft(el("coach-outline-text").value));
  function guideKeys() {return defaultOrder[guideMode] || defaultOrder.image;}
  function renderStep() {
    const keys=guideKeys(),key=keys[step],names=labels[getLanguage()]||labels.EN;
    el("coach-progress").textContent=t().step.replace("{number}",step+1).replace("{total}",keys.length);
    el("coach-question").textContent=names[key]+"?";
    el("coach-tip").textContent=(stepTips[getLanguage()]||stepTips.EN)[key];
    el("coach-example").textContent=`${t().example}: ${(examples[getLanguage()]||examples.EN)[key]}`;
    el("coach-answer").value=answersByMode[guideMode][key]||"";
    el("coach-back").disabled=step===0;
    el("coach-next").textContent=step===keys.length-1?t().finish:t().next;
  }
  function saveAnswer(){answersByMode[guideMode][guideKeys()[step]]=el("coach-answer").value.trim();}
  el("coach-guide").addEventListener("click",()=>{const box=el("coach-guide-panel");if(!box.hidden)saveAnswer();if(!el("coach-outline-panel").hidden)outlinesByMode[outlineMode]=el("coach-outline-text").value;box.hidden=!box.hidden;el("coach-outline-panel").hidden=true;if (!box.hidden){guideMode=getMode();step=0;guideSnapshot=null;guideRequest++;el("coach-guide-review").hidden=true;renderStep();}});
  el("coach-back").addEventListener("click",()=>{saveAnswer();step=Math.max(0,step-1);renderStep();});
  function sameGuideSnapshot(){return guideSnapshot && getMode()===guideSnapshot.mode && getCurrent().prompt===guideSnapshot.prompt;}
  function renderGuideReview() {
    if(!guideSnapshot)return;
    const g=gt(),c=checkCopy[getLanguage()]||checkCopy.EN,examples=conflictCopy[getLanguage()]||conflictCopy.EN;
    el("coach-guide-review-title").textContent=g.title;
    el("coach-guide-review-intro").textContent=g.intro;
    el("coach-guide-family-label").textContent=g.family;
    el("coach-guide-addons").textContent=g.search;
    const problems=inspectPrompt(guideSnapshot.prompt,guideSnapshot.mode,getLanguage()).issues.filter((code)=>["lockedMotion","silentAudio","oneShotCut","photoArt","dayNight"].includes(code));
    const list=el("coach-guide-conflicts");list.replaceChildren();
    if(!problems.length){const item=document.createElement("li");item.textContent=g.clear;list.appendChild(item);}
    for(const code of problems){const item=document.createElement("li");item.textContent=c[code]||examples[code]||code;item.className="conflict";list.appendChild(item);
      if(examples[`${code}Choice`]){const choice=document.createElement("li");choice.textContent=`${examples.examples} ${examples[`${code}Choice`]}`;choice.className="advice";list.appendChild(choice);}}
  }
  async function searchGuideAddons(){
    const status=el("coach-guide-addon-status"),results=el("coach-guide-addon-results"),family=el("coach-guide-family").value;
    results.replaceChildren();
    if(!sameGuideSnapshot()){status.textContent=gt().stale;return;}
    if(!family){status.textContent=gt().select;return;}
    const request=++guideRequest,snapshot=guideSnapshot;
    status.textContent=gt().working;el("coach-guide-addons").disabled=true;
    let response;
    try{response=await suggestGuideAddons(snapshot.prompt,family);}catch{response={status:"unavailable",items:[]};}
    if(request!==guideRequest){el("coach-guide-addons").disabled=false;return;}
    if(!sameGuideSnapshot()){status.textContent=gt().stale;el("coach-guide-addons").disabled=false;return;}
    el("coach-guide-addons").disabled=false;
    if(response?.status!=="ready"){status.textContent=gt().unavailable;return;}
    if(!response.items?.length){status.textContent=gt().none;return;}
    status.textContent="";
    for(const item of response.items){
      const card=document.createElement("article");card.className="coach-addon-item";
      const title=document.createElement("strong");title.textContent=item.name||item.file;
      const confidence=document.createElement("small");confidence.textContent=item.verified?gt().likely:gt().review;
      const matched=document.createElement("small");matched.textContent=`${gt().matched}: ${(item.matched||[]).join(", ") || "—"}`;
      const source=document.createElement("small");source.textContent=`${gt().source}: ${item.source||"—"}`;
      const file=document.createElement("code");file.textContent=item.file;
      const copyButton=document.createElement("button");copyButton.type="button";copyButton.className="quiet-action";copyButton.textContent=gt().copy;
      copyButton.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(item.file);copyButton.textContent=gt().copied;}catch{}});
      card.append(title,confidence,matched,source,file,copyButton);results.appendChild(card);
    }
  }
  function showGuideReview(){
    const current=getCurrent();guideSnapshot={prompt:current.prompt,mode:getMode()};guideRequest++;
    const family=el("coach-guide-family"),guessed=guideMode==="video"?"":inferAddonFamily(current.model);
    family.replaceChildren(new Option(gt().choose,""),...getAddonFamilies().map(([value,label])=>new Option(label,value)));
    family.value=guessed || "";
    el("coach-guide-review").hidden=false;
    el("coach-guide-addon-results").replaceChildren();
    el("coach-guide-addon-status").textContent=guessed?"":gt().select;
    renderGuideReview();
    if(guessed)void searchGuideAddons();
  }
  el("coach-guide-family").addEventListener("change",()=>{guideRequest++;el("coach-guide-addon-results").replaceChildren();el("coach-guide-addon-status").textContent="";});
  el("coach-guide-addons").addEventListener("click",()=>{void searchGuideAddons();});
  el("coach-next").addEventListener("click",()=>{saveAnswer();if(step<guideKeys().length-1){step++;renderStep();return;}const answers=answersByMode[guideMode];if(!Object.values(answers).some(Boolean)){el("coach-status").textContent=t().empty;return;}if(insertDraft(buildCoachDraft(guideKeys(),answers,getCurrent().language||"EN",false)))showGuideReview();});
  function sameCheckSnapshot() {
    const current=getCurrent();
    return checkSnapshot && current.prompt===checkSnapshot.prompt && current.language===checkSnapshot.language && getMode()===checkSnapshot.mode;
  }
  function updateCheckState() {
    if(!checkResult) return;
    const c=checkCopy[getLanguage()]||checkCopy.EN;
    const stale=!sameCheckSnapshot();
    const draft=el("coach-check-draft").value;
    const unfinished=/⟦[^⟧]+⟧/u.test(draft);
    el("coach-check-apply").disabled=stale || unfinished || !draft.trim();
    el("coach-check-status").textContent=stale?c.stale:checkResult.empty?c.empty:checkResult.draft?(unfinished?c.fill:""):
      ["lockedMotion","silentAudio","oneShotCut","photoArt","dayNight"].includes(checkResult.primary)?c.choose:checkResult.issues.length?"":c.clean;
  }
  function renderCheck() {
    if(!checkResult) return;
    const c=checkCopy[getLanguage()]||checkCopy.EN,examples=conflictCopy[getLanguage()]||conflictCopy.EN;
    el("coach-check-help").textContent=c.help;
    const coverage=el("coach-check-coverage");coverage.replaceChildren();
    for(const [key,found] of Object.entries(checkResult.coverage)) {
      const item=document.createElement("span");item.className=`coach-check-mark ${found?"found":"unclear"}`;
      item.textContent=`${(labels[getLanguage()]||labels.EN)[key]}: ${found?c.present:c.unclear}`;
      coverage.appendChild(item);
    }
    const list=el("coach-check-issues");list.replaceChildren();
    for(const code of checkResult.issues.filter((item)=>item!=="empty")) {
      const item=document.createElement("li");item.textContent=c[code]||examples[code]||code;
      item.className=["lockedMotion","silentAudio","oneShotCut","photoArt","dayNight"].includes(code)?"conflict":"advice";
      list.appendChild(item);
      if(examples[`${code}Choice`]){const choice=document.createElement("li");choice.textContent=`${examples.examples} ${examples[`${code}Choice`]}`;choice.className="advice";list.appendChild(choice);}
    }
    el("coach-check-draft-box").hidden=!checkResult.draft;
    el("coach-check-draft-label").textContent=c.draft;
    el("coach-check-apply").textContent=c.apply;
    updateCheckState();
  }
  el("coach-check").addEventListener("click",()=>{
    const current=getCurrent();
    checkSnapshot={prompt:current.prompt,language:current.language,mode:getMode()};
    checkResult=inspectPrompt(current.prompt,getMode(),current.language);
    el("coach-check-draft").value=checkResult.draft;
    el("coach-check-panel").hidden=false;
    renderCheck();
  });
  el("coach-check-draft").addEventListener("input",updateCheckState);
  for(const id of ["prompt-output","i2v-prompt","i2i-prompt"]) document.getElementById(id)?.addEventListener("input",()=>{
    updateCheckState();
    if(guideSnapshot && !sameGuideSnapshot()){
      guideRequest++;
      el("coach-guide-addon-results").replaceChildren();
      el("coach-guide-addon-status").textContent=gt().stale;
    }
  });
  el("coach-check-apply").addEventListener("click",()=>{
    updateCheckState();
    if(el("coach-check-apply").disabled || !window.confirm((checkCopy[getLanguage()]||checkCopy.EN).confirm)) return;
    setPrompt(el("coach-check-draft").value,checkSnapshot.language);
    el("coach-check-status").textContent=(checkCopy[getLanguage()]||checkCopy.EN).applied;
    checkSnapshot=null;el("coach-check-apply").disabled=true;
  });
  function refresh(){hideMenu();if(!el("coach-guide-panel").hidden)saveAnswer();if(!el("coach-outline-panel").hidden)outlinesByMode[outlineMode]=el("coach-outline-text").value;if(guideMode!==getMode()){guideMode=getMode();step=0;}const c=t();el("coach-title").textContent=c.title;el("coach-intro").textContent=c.intro;el("coach-auto-label").textContent=c.auto;el("coach-auto-help").textContent=c.autoHelp;el("coach-outline").textContent=c.outline;el("coach-outline-help").textContent=c.outlineHelp;el("coach-guide").textContent=c.guide;el("coach-guide-help").textContent=c.guideHelp;el("coach-back").textContent=c.back;el("coach-apply-outline").textContent=c.useOutline;el("coach-check").textContent=(checkCopy[getLanguage()]||checkCopy.EN).button;el("coach-status").textContent="";if(!el("coach-guide-panel").hidden)renderStep();if(!el("coach-outline-panel").hidden){outlineMode=getMode();renderOutline();}if(guideSnapshot){renderGuideReview();if(!sameGuideSnapshot()){guideRequest++;el("coach-guide-addon-results").replaceChildren();el("coach-guide-addon-status").textContent=gt().stale;}}renderCheck();}
  refresh();renderSentenceLabels();
  window.addEventListener("storage",(event)=>{if(event.key===libraryKey||event.key===glossaryKey)refreshTerms();});
  return {refresh:()=>{refresh();renderSentenceLabels();if(!sentencePanel.hidden){const kind=["video","i2v"].includes(getMode())?"video":"image";if(kind!==sentenceKind)void loadSentences();else renderSentences();}}};
}

