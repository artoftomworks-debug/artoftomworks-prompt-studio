import { createTrialCatalogBridge, compareCatalogItems, planNextExperiment, catalogCompareCopy, experimentStorageKey, createExperimentEntry, normalizeExperimentEntries } from "./catalog-compare.mjs";
import { buildCreatorPassport, buildPromptCorrectionMessages, cleanPromptCorrectionResponse, MAX_CORRECTION_INPUT } from "./creator-passport.mjs";
import { attachCatalogGalleryActions } from "./catalog-gallery-actions.mjs";

const catalogRootCopy={
 HU:["Mappa vagy meghajtó útvonala (pl. E:\\)","Az almappákat is beolvassa. Teljes meghajtón ez tovább tarthat; a rendszer- és technikai mappákat kihagyja, a hivatkozott mappákat nem követi.","Beolvasás megszakítása","Megszakítás folyamatban…","bejárt mappa","Beolvasás megszakítva. A korábbi archívum megmaradt."],
 EN:["Folder or drive path (e.g. E:\\)","Includes subfolders. Scanning a whole drive can take longer; system and technical folders are skipped and linked folders are not followed.","Cancel scan","Cancelling…","folders visited","Scan cancelled. The previous archive was kept."],
 DE:["Ordner- oder Laufwerkspfad (z. B. E:\\)","Unterordner werden durchsucht. Ein ganzes Laufwerk dauert länger; System- und Technikordner sowie verknüpfte Ordner werden übersprungen.","Einlesen abbrechen","Wird abgebrochen…","Ordner durchsucht","Einlesen abgebrochen. Das vorherige Archiv bleibt erhalten."],
 FR:["Chemin du dossier ou du disque (ex. E:\\)","Inclut les sous-dossiers. Un disque entier peut demander plus de temps ; les dossiers système, techniques et liés sont ignorés.","Annuler l’analyse","Annulation…","dossiers parcourus","Analyse annulée. L’archive précédente est conservée."],
 ES:["Ruta de carpeta o unidad (p. ej. E:\\)","Incluye subcarpetas. Una unidad completa puede tardar más; se omiten carpetas del sistema, técnicas y enlazadas.","Cancelar análisis","Cancelando…","carpetas recorridas","Análisis cancelado. Se conserva el archivo anterior."],
 IT:["Percorso cartella o unità (es. E:\\)","Include le sottocartelle. Un’intera unità può richiedere più tempo; cartelle di sistema, tecniche e collegate vengono ignorate.","Annulla scansione","Annullamento…","cartelle visitate","Scansione annullata. L’archivio precedente è conservato."],
 PT:["Caminho de pasta ou unidade (ex. E:\\)","Inclui subpastas. Uma unidade inteira pode demorar mais; pastas de sistema, técnicas e ligadas são ignoradas.","Cancelar análise","A cancelar…","pastas visitadas","Análise cancelada. O arquivo anterior foi mantido."],
 PL:["Ścieżka folderu lub dysku (np. E:\\)","Obejmuje podfoldery. Cały dysk może wymagać więcej czasu; foldery systemowe, techniczne i dowiązania są pomijane.","Anuluj skanowanie","Anulowanie…","odwiedzonych folderów","Skanowanie anulowane. Poprzednie archiwum zachowano."]
};
export function catalogRootLabels(language="EN"){return Object.fromEntries(["root","help","cancel","cancelling","folders","stopped"].map((key,i)=>[key,(catalogRootCopy[language]||catalogRootCopy.EN)[i]]));}
const catalogRootControlCopy={
 HU:["Eltávolítás az archívumból","Csak az archívumból veszi ki. A gépen lévő fájlok megmaradnak.","Az útvonal eltávolítva az archívumból. A fájlok megmaradtak; később újra hozzáadhatod.","Nem sikerült eltávolítani az útvonalat."],
 EN:["Remove from archive","Removes the archive location only. Files on your computer are kept.","Location removed from the archive. Files were kept; you can add it again later.","Could not remove the archive location."],
 DE:["Aus dem Archiv entfernen","Entfernt nur den Archivpfad. Dateien auf dem Computer bleiben erhalten.","Pfad aus dem Archiv entfernt. Dateien bleiben erhalten; der Pfad kann erneut hinzugefügt werden.","Archivpfad konnte nicht entfernt werden."],
 FR:["Retirer de l’archive","Retire uniquement l’emplacement. Les fichiers de l’ordinateur sont conservés.","Emplacement retiré de l’archive. Les fichiers restent ; vous pouvez l’ajouter à nouveau.","Impossible de retirer cet emplacement."],
 ES:["Quitar del archivo","Solo quita la ubicación del archivo. Los ficheros del equipo se conservan.","Ubicación retirada del archivo. Los ficheros se conservan; puedes añadirla de nuevo.","No se pudo quitar la ubicación."],
 IT:["Rimuovi dall’archivio","Rimuove solo il percorso dall’archivio. I file sul computer restano.","Percorso rimosso dall’archivio. I file restano; puoi aggiungerlo di nuovo.","Impossibile rimuovere il percorso."],
 PT:["Remover do arquivo","Remove apenas a localização do arquivo. Os ficheiros no computador são mantidos.","Localização removida do arquivo. Os ficheiros foram mantidos; pode adicioná-la novamente.","Não foi possível remover a localização."],
 PL:["Usuń z archiwum","Usuwa tylko lokalizację z archiwum. Pliki na komputerze pozostają.","Lokalizacja usunięta z archiwum. Pliki pozostały; możesz dodać ją ponownie.","Nie udało się usunąć lokalizacji."]
};
export function catalogRootControlLabels(language="EN"){return Object.fromEntries(["remove","help","removed","error"].map((key,i)=>[key,(catalogRootControlCopy[language]||catalogRootControlCopy.EN)[i]]));}
export function createCatalogRootChip(value,labels,disabled,onRemove){
  const chip=document.createElement("div"),path=document.createElement("span"),close=document.createElement("button");
  chip.className="catalog-root-chip";path.className="catalog-root-path";path.textContent=value;path.title=value;
  close.type="button";close.className="catalog-root-remove";close.textContent="×";close.disabled=disabled;
  close.setAttribute("aria-label",`${labels.remove}: ${value}`);close.title=`${labels.remove}. ${labels.help}`;
  close.addEventListener("click",()=>{if(!close.disabled)return onRemove(value);});chip.append(path,close);return chip;
}

const catalogCopy = {
  HU:{ title:"Kereshető médiaarchívum", intro:"A kijelölt mappák képeinek és videóinak mentett promptjait keresi. Az eredeti fájlokat nem módosítja.", root:"További mappa teljes elérési útja", add:"Mappa hozzáadása", scan:"Archívum frissítése", scanning:"Beolvasás folyamatban…", search:"Keresés promptban, fájlnévben, modellben", all:"Minden típus", image:"Képek", video:"Videók", allFolders:"Minden mappa", result:"találat", indexed:"kiolvasható prompt", skipped:"fájlban nincs kiolvasható prompt", errors:"olvasási hiba", notScanned:"Még nem készült katalógus. Kattints az Archívum frissítése gombra.", empty:"Nincs találat.", load:"Prompt betöltése", copy:"Prompt másolása", view:"Videó megtekintése", path:"Fájl", prev:"Előző", next:"Következő", page:"Oldal", badRoot:"Nem sikerült hozzáadni a mappát.", offline:"A katalógushoz a Prompt Studio helyi indítóját használd.", confirm:"Lecseréljem az aktuális promptot a kiválasztottra?", loaded:"A prompt betöltve szerkesztésre.", copied:"A prompt a vágólapra került.", scanError:"A beolvasás megszakadt.", newRoot:"A mappa hozzáadva. Frissítsd az archívumot." },
  EN:{ title:"Searchable media archive", intro:"Search prompts saved in images and videos from selected folders. Original files are never changed.", root:"Full path of another folder", add:"Add folder", scan:"Refresh archive", scanning:"Scanning…", search:"Search prompts, filenames and models", all:"All types", image:"Images", video:"Videos", allFolders:"All folders", result:"results", indexed:"readable prompts", skipped:"files without readable prompts", errors:"read errors", notScanned:"No catalog yet. Click Refresh archive.", empty:"No matches.", load:"Load prompt", copy:"Copy prompt", view:"Preview video", path:"File", prev:"Previous", next:"Next", page:"Page", badRoot:"Could not add folder.", offline:"Use the local Prompt Studio launcher to access the archive.", confirm:"Replace the current prompt with this one?", loaded:"Prompt loaded for editing.", copied:"Prompt copied.", scanError:"Scan stopped.", newRoot:"Folder added. Refresh the archive." },
  DE:{title:"Durchsuchbares Medienarchiv",intro:"Gespeicherte Prompts aus Bildern und Videos ausgewählter Ordner. Originale bleiben unverändert.",root:"Vollständiger Ordnerpfad",add:"Ordner hinzufügen",scan:"Archiv aktualisieren",scanning:"Wird eingelesen…",search:"Prompts, Dateien und Modelle suchen",all:"Alle Typen",image:"Bilder",video:"Videos",allFolders:"Alle Ordner",result:"Treffer",indexed:"lesbare Prompts",skipped:"Dateien ohne Prompt",errors:"Lesefehler",notScanned:"Noch kein Katalog. Archiv aktualisieren.",empty:"Keine Treffer.",load:"Prompt laden",copy:"Prompt kopieren",view:"Video ansehen",prev:"Zurück",next:"Weiter",page:"Seite",badRoot:"Ordner konnte nicht hinzugefügt werden.",offline:"Lokalen Prompt-Studio-Starter verwenden.",confirm:"Aktuellen Prompt ersetzen?",loaded:"Prompt geladen.",copied:"Prompt kopiert.",scanError:"Einlesen abgebrochen.",newRoot:"Ordner hinzugefügt. Archiv aktualisieren."},
  FR:{title:"Archive multimédia",intro:"Recherchez les prompts enregistrés dans les images et vidéos des dossiers choisis. Aucun original n'est modifié.",root:"Chemin complet d'un dossier",add:"Ajouter un dossier",scan:"Actualiser l'archive",scanning:"Analyse en cours…",search:"Chercher prompts, fichiers, modèles",all:"Tous",image:"Images",video:"Vidéos",allFolders:"Tous les dossiers",result:"résultats",indexed:"prompts lisibles",skipped:"fichiers sans prompt",errors:"erreurs de lecture",notScanned:"Aucun catalogue. Actualisez l'archive.",empty:"Aucun résultat.",load:"Charger le prompt",copy:"Copier le prompt",view:"Voir la vidéo",prev:"Précédent",next:"Suivant",page:"Page",badRoot:"Impossible d'ajouter le dossier.",offline:"Utilisez le lanceur local de Prompt Studio.",confirm:"Remplacer le prompt actuel ?",loaded:"Prompt chargé.",copied:"Prompt copié.",scanError:"Analyse interrompue.",newRoot:"Dossier ajouté. Actualisez l'archive."},
  ES:{title:"Archivo multimedia",intro:"Busca prompts guardados en imágenes y vídeos de las carpetas elegidas. No modifica los originales.",root:"Ruta completa de otra carpeta",add:"Añadir carpeta",scan:"Actualizar archivo",scanning:"Analizando…",search:"Buscar prompts, archivos y modelos",all:"Todos",image:"Imágenes",video:"Vídeos",allFolders:"Todas las carpetas",result:"resultados",indexed:"prompts legibles",skipped:"archivos sin prompt",errors:"errores de lectura",notScanned:"Aún no hay catálogo. Actualiza el archivo.",empty:"Sin resultados.",load:"Cargar prompt",copy:"Copiar prompt",view:"Ver vídeo",prev:"Anterior",next:"Siguiente",page:"Página",badRoot:"No se pudo añadir la carpeta.",offline:"Usa el iniciador local de Prompt Studio.",confirm:"¿Reemplazar el prompt actual?",loaded:"Prompt cargado.",copied:"Prompt copiado.",scanError:"Análisis interrumpido.",newRoot:"Carpeta añadida. Actualiza el archivo."},
  IT:{title:"Archivio multimediale",intro:"Cerca i prompt salvati nelle immagini e nei video delle cartelle scelte. Gli originali non vengono modificati.",root:"Percorso completo della cartella",add:"Aggiungi cartella",scan:"Aggiorna archivio",scanning:"Scansione…",search:"Cerca prompt, file e modelli",all:"Tutti",image:"Immagini",video:"Video",allFolders:"Tutte le cartelle",result:"risultati",indexed:"prompt leggibili",skipped:"file senza prompt",errors:"errori di lettura",notScanned:"Nessun catalogo. Aggiorna l'archivio.",empty:"Nessun risultato.",load:"Carica prompt",copy:"Copia prompt",view:"Mostra video",prev:"Precedente",next:"Successivo",page:"Pagina",badRoot:"Impossibile aggiungere la cartella.",offline:"Usa il launcher locale di Prompt Studio.",confirm:"Sostituire il prompt attuale?",loaded:"Prompt caricato.",copied:"Prompt copiato.",scanError:"Scansione interrotta.",newRoot:"Cartella aggiunta. Aggiorna l'archivio."},
  PT:{title:"Arquivo multimédia",intro:"Pesquise prompts guardados em imagens e vídeos das pastas escolhidas. Os originais não são alterados.",root:"Caminho completo de outra pasta",add:"Adicionar pasta",scan:"Atualizar arquivo",scanning:"A analisar…",search:"Pesquisar prompts, ficheiros e modelos",all:"Todos",image:"Imagens",video:"Vídeos",allFolders:"Todas as pastas",result:"resultados",indexed:"prompts legíveis",skipped:"ficheiros sem prompt",errors:"erros de leitura",notScanned:"Ainda não há catálogo. Atualize o arquivo.",empty:"Sem resultados.",load:"Carregar prompt",copy:"Copiar prompt",view:"Ver vídeo",prev:"Anterior",next:"Seguinte",page:"Página",badRoot:"Não foi possível adicionar a pasta.",offline:"Use o lançador local do Prompt Studio.",confirm:"Substituir o prompt atual?",loaded:"Prompt carregado.",copied:"Prompt copiado.",scanError:"Análise interrompida.",newRoot:"Pasta adicionada. Atualize o arquivo."},
  PL:{title:"Przeszukiwalne archiwum mediów",intro:"Wyszukuj prompty zapisane w obrazach i filmach z wybranych folderów. Oryginały pozostają bez zmian.",root:"Pełna ścieżka do folderu",add:"Dodaj folder",scan:"Odśwież archiwum",scanning:"Skanowanie…",search:"Szukaj promptów, plików i modeli",all:"Wszystkie",image:"Obrazy",video:"Filmy",allFolders:"Wszystkie foldery",result:"wyników",indexed:"odczytanych promptów",skipped:"plików bez promptu",errors:"błędów odczytu",notScanned:"Brak katalogu. Odśwież archiwum.",empty:"Brak wyników.",load:"Wczytaj prompt",copy:"Kopiuj prompt",view:"Pokaż film",prev:"Poprzednia",next:"Następna",page:"Strona",badRoot:"Nie udało się dodać folderu.",offline:"Użyj lokalnego uruchamiacza Prompt Studio.",confirm:"Zastąpić bieżący prompt?",loaded:"Prompt wczytany.",copied:"Prompt skopiowany.",scanError:"Skanowanie przerwane.",newRoot:"Folder dodany. Odśwież archiwum."}
};
const catalogDateCopy = {
  HU:{heading:"Fájl módosítási dátuma (nem feltétlenül a készítés ideje)",allDates:"Minden dátum",today:"Ma",last7:"Utolsó 7 nap",last30:"Utolsó 30 nap",custom:"Egyéni időszak",from:"Ettől",to:"Eddig"},
  EN:{heading:"File modification date (not necessarily creation date)",allDates:"All dates",today:"Today",last7:"Last 7 days",last30:"Last 30 days",custom:"Custom range",from:"From",to:"To"},
  DE:{heading:"Änderungsdatum der Datei (nicht unbedingt Erstellungsdatum)",allDates:"Alle Daten",today:"Heute",last7:"Letzte 7 Tage",last30:"Letzte 30 Tage",custom:"Eigener Zeitraum",from:"Von",to:"Bis"},
  FR:{heading:"Date de modification du fichier (pas forcément sa création)",allDates:"Toutes les dates",today:"Aujourd’hui",last7:"7 derniers jours",last30:"30 derniers jours",custom:"Période personnalisée",from:"Du",to:"Au"},
  ES:{heading:"Fecha de modificación del archivo (no siempre de creación)",allDates:"Todas las fechas",today:"Hoy",last7:"Últimos 7 días",last30:"Últimos 30 días",custom:"Período personalizado",from:"Desde",to:"Hasta"},
  IT:{heading:"Data di modifica del file (non necessariamente di creazione)",allDates:"Tutte le date",today:"Oggi",last7:"Ultimi 7 giorni",last30:"Ultimi 30 giorni",custom:"Intervallo personalizzato",from:"Da",to:"A"},
  PT:{heading:"Data de modificação do ficheiro (não necessariamente de criação)",allDates:"Todas as datas",today:"Hoje",last7:"Últimos 7 dias",last30:"Últimos 30 dias",custom:"Período personalizado",from:"De",to:"Até"},
  PL:{heading:"Data modyfikacji pliku (niekoniecznie utworzenia)",allDates:"Wszystkie daty",today:"Dzisiaj",last7:"Ostatnie 7 dni",last30:"Ostatnie 30 dni",custom:"Własny zakres",from:"Od",to:"Do"}
};
const catalogGalleryCopy = {
  HU:{galleryView:"Napi galéria",listView:"Részletes lista",day:"Kiválasztott nap",previousDay:"Előző nap",nextDay:"Következő nap",galleryHint:"A kereső és a szűrők csak ezen a napon belül keresnek. A dátum a fájl módosítási ideje."},
  EN:{galleryView:"Daily gallery",listView:"Detailed list",day:"Selected day",previousDay:"Previous day",nextDay:"Next day",galleryHint:"Search and filters apply only to this day. The date is the file modification date."},
  DE:{galleryView:"Tagesgalerie",listView:"Detaillierte Liste",day:"Gewählter Tag",previousDay:"Vorheriger Tag",nextDay:"Nächster Tag",galleryHint:"Suche und Filter gelten nur für diesen Tag. Das Datum ist das Änderungsdatum der Datei."},
  FR:{galleryView:"Galerie du jour",listView:"Liste détaillée",day:"Jour choisi",previousDay:"Jour précédent",nextDay:"Jour suivant",galleryHint:"La recherche et les filtres ne portent que sur ce jour. La date est celle de modification du fichier."},
  ES:{galleryView:"Galería diaria",listView:"Lista detallada",day:"Día elegido",previousDay:"Día anterior",nextDay:"Día siguiente",galleryHint:"La búsqueda y los filtros se aplican solo a este día. Es la fecha de modificación del archivo."},
  IT:{galleryView:"Galleria giornaliera",listView:"Elenco dettagliato",day:"Giorno scelto",previousDay:"Giorno precedente",nextDay:"Giorno successivo",galleryHint:"Ricerca e filtri valgono solo per questo giorno. La data è quella di modifica del file."},
  PT:{galleryView:"Galeria diária",listView:"Lista detalhada",day:"Dia escolhido",previousDay:"Dia anterior",nextDay:"Dia seguinte",galleryHint:"A pesquisa e os filtros aplicam-se só a este dia. A data é a de modificação do ficheiro."},
  PL:{galleryView:"Galeria dzienna",listView:"Lista szczegółowa",day:"Wybrany dzień",previousDay:"Poprzedni dzień",nextDay:"Następny dzień",galleryHint:"Wyszukiwanie i filtry dotyczą tylko tego dnia. To data modyfikacji pliku."}
};
const catalogAutoScanCopy = {
  HU:"Automatikus archívumfrissítés induláskor és 15 percenként",
  EN:"Refresh archive automatically at startup and every 15 minutes",
  DE:"Archiv beim Start und alle 15 Minuten automatisch aktualisieren",
  FR:"Actualiser l’archive au démarrage et toutes les 15 minutes",
  ES:"Actualizar el archivo al iniciar y cada 15 minutos",
  IT:"Aggiorna l’archivio all’avvio e ogni 15 minuti",
  PT:"Atualizar o arquivo ao iniciar e a cada 15 minutos",
  PL:"Odświeżaj archiwum przy uruchomieniu i co 15 minut"
};
const catalogPageJumpCopy = {
  HU:{firstPage:"Első oldal",lastPage:"Utolsó oldal"},
  EN:{firstPage:"First page",lastPage:"Last page"},
  DE:{firstPage:"Erste Seite",lastPage:"Letzte Seite"},
  FR:{firstPage:"Première page",lastPage:"Dernière page"},
  ES:{firstPage:"Primera página",lastPage:"Última página"},
  IT:{firstPage:"Prima pagina",lastPage:"Ultima pagina"},
  PT:{firstPage:"Primeira página",lastPage:"Última página"},
  PL:{firstPage:"Pierwsza strona",lastPage:"Ostatnia strona"}
};
const catalogPromptCopy = {
  HU:{files:"médiafájl",promptAll:"Mindegyik",promptYes:"Van mentett prompt",promptNo:"Nincs mentett prompt",noPrompt:"Ehhez a fájlhoz nem találtam kiolvasható promptot."},
  EN:{files:"media files",promptAll:"Any prompt status",promptYes:"Has saved prompt",promptNo:"No saved prompt",noPrompt:"No readable prompt was found for this file."},
  DE:{files:"Mediendateien",promptAll:"Alle",promptYes:"Mit Prompt",promptNo:"Ohne Prompt",noPrompt:"Für diese Datei wurde kein lesbarer Prompt gefunden."},
  FR:{files:"fichiers multimédias",promptAll:"Tous",promptYes:"Avec prompt",promptNo:"Sans prompt",noPrompt:"Aucun prompt lisible trouvé pour ce fichier."},
  ES:{files:"archivos multimedia",promptAll:"Todos",promptYes:"Con prompt",promptNo:"Sin prompt",noPrompt:"No se encontró un prompt legible para este archivo."},
  IT:{files:"file multimediali",promptAll:"Tutti",promptYes:"Con prompt",promptNo:"Senza prompt",noPrompt:"Nessun prompt leggibile trovato per questo file."},
  PT:{files:"ficheiros multimédia",promptAll:"Todos",promptYes:"Com prompt",promptNo:"Sem prompt",noPrompt:"Não foi encontrado um prompt legível para este ficheiro."},
  PL:{files:"plików multimedialnych",promptAll:"Wszystkie",promptYes:"Z promptem",promptNo:"Bez promptu",noPrompt:"Nie znaleziono czytelnego promptu dla tego pliku."}
};
const catalogOrganizeCopy = {
  HU:{allCategories:"Minden kategória",allRatings:"Minden értékelés",stars:"csillag",newCategory:"Új kategória (pl. Nature, Glamour)",addCategory:"Kategória hozzáadása",category:"Kategória",none:"Nincs kategória",rate:"Értékelés",clear:"Csillagok törlése",saved:"Értékelés és kategória mentve.",categoryAdded:"Kategória hozzáadva.",saveError:"Nem sikerült menteni.",rated:"értékelt fájl"},
  EN:{allCategories:"All categories",allRatings:"All ratings",stars:"stars",newCategory:"New category (e.g. Nature, Glamour)",addCategory:"Add category",category:"Category",none:"No category",rate:"Rating",clear:"Clear stars",saved:"Rating and category saved.",categoryAdded:"Category added.",saveError:"Could not save.",rated:"rated files"},
  DE:{allCategories:"Alle Kategorien",allRatings:"Alle Bewertungen",stars:"Sterne",newCategory:"Neue Kategorie",addCategory:"Kategorie hinzufügen",category:"Kategorie",none:"Keine Kategorie",rate:"Bewertung",clear:"Sterne löschen",saved:"Bewertung und Kategorie gespeichert.",categoryAdded:"Kategorie hinzugefügt.",saveError:"Speichern fehlgeschlagen.",rated:"bewertete Dateien"},
  FR:{allCategories:"Toutes les catégories",allRatings:"Toutes les notes",stars:"étoiles",newCategory:"Nouvelle catégorie",addCategory:"Ajouter la catégorie",category:"Catégorie",none:"Sans catégorie",rate:"Note",clear:"Effacer les étoiles",saved:"Note et catégorie enregistrées.",categoryAdded:"Catégorie ajoutée.",saveError:"Enregistrement impossible.",rated:"fichiers notés"},
  ES:{allCategories:"Todas las categorías",allRatings:"Todas las valoraciones",stars:"estrellas",newCategory:"Nueva categoría",addCategory:"Añadir categoría",category:"Categoría",none:"Sin categoría",rate:"Valoración",clear:"Quitar estrellas",saved:"Valoración y categoría guardadas.",categoryAdded:"Categoría añadida.",saveError:"No se pudo guardar.",rated:"archivos valorados"},
  IT:{allCategories:"Tutte le categorie",allRatings:"Tutte le valutazioni",stars:"stelle",newCategory:"Nuova categoria",addCategory:"Aggiungi categoria",category:"Categoria",none:"Senza categoria",rate:"Valutazione",clear:"Cancella stelle",saved:"Valutazione e categoria salvate.",categoryAdded:"Categoria aggiunta.",saveError:"Impossibile salvare.",rated:"file valutati"},
  PT:{allCategories:"Todas as categorias",allRatings:"Todas as avaliações",stars:"estrelas",newCategory:"Nova categoria",addCategory:"Adicionar categoria",category:"Categoria",none:"Sem categoria",rate:"Avaliação",clear:"Limpar estrelas",saved:"Avaliação e categoria guardadas.",categoryAdded:"Categoria adicionada.",saveError:"Não foi possível guardar.",rated:"ficheiros avaliados"},
  PL:{allCategories:"Wszystkie kategorie",allRatings:"Wszystkie oceny",stars:"gwiazdek",newCategory:"Nowa kategoria",addCategory:"Dodaj kategorię",category:"Kategoria",none:"Bez kategorii",rate:"Ocena",clear:"Usuń gwiazdki",saved:"Ocena i kategoria zapisane.",categoryAdded:"Kategoria dodana.",saveError:"Nie udało się zapisać.",rated:"ocenionych plików"}
};
const catalogDeleteCopy = {
  HU:{intro:"A kijelölt mappák képeiben és videóiban keres. A keresés nem változtatja meg a fájlokat; törlés csak külön jóváhagyással történik.", open:"Törlés…", title:"Fájl törlése", explanation:"Csak az alábbi fájlokat érinti. Más mappákban lévő másolatokat nem töröl.", metadata:"Kapcsolódó metaadat", cancel:"Mégse", trash:"Lomtárba helyezés", permanent:"Végleges törlés", acknowledge:"Tudom, hogy a végleges törlés nem vonható vissza.", doneTrash:"A kijelölt fájl a Lomtárba került.", donePermanent:"A kijelölt fájl véglegesen törölve.", error:"Nem sikerült a törlés.", warning:"Figyelem:", busy:"Törlés folyamatban…"},
  EN:{intro:"Search images and videos in selected folders. Searching changes nothing; deletion needs separate confirmation.",open:"Delete…",title:"Delete file",explanation:"Only these files are affected. Copies in other folders are not removed.",metadata:"Related metadata",cancel:"Cancel",trash:"Move to Recycle Bin",permanent:"Delete permanently",acknowledge:"I understand permanent deletion cannot be undone.",doneTrash:"Selected file moved to Recycle Bin.",donePermanent:"Selected file deleted permanently.",error:"Deletion failed.",warning:"Warning:",busy:"Deleting…"},
  DE:{intro:"Bilder und Videos in ausgewählten Ordnern durchsuchen. Die Suche ändert nichts; Löschen erfordert eine Bestätigung.",open:"Löschen…",title:"Datei löschen",explanation:"Nur diese Dateien sind betroffen. Kopien in anderen Ordnern bleiben erhalten.",metadata:"Zugehörige Metadaten",cancel:"Abbrechen",trash:"In den Papierkorb",permanent:"Endgültig löschen",acknowledge:"Ich weiß, dass endgültiges Löschen nicht rückgängig gemacht werden kann.",doneTrash:"Datei in den Papierkorb verschoben.",donePermanent:"Datei endgültig gelöscht.",error:"Löschen fehlgeschlagen.",warning:"Achtung:",busy:"Wird gelöscht…"},
  FR:{intro:"Recherchez dans les images et vidéos choisies. La recherche ne modifie rien ; toute suppression demande confirmation.",open:"Supprimer…",title:"Supprimer le fichier",explanation:"Seuls ces fichiers seront concernés. Les copies dans d'autres dossiers restent.",metadata:"Métadonnées liées",cancel:"Annuler",trash:"Mettre à la Corbeille",permanent:"Supprimer définitivement",acknowledge:"Je comprends que la suppression définitive est irréversible.",doneTrash:"Fichier placé dans la Corbeille.",donePermanent:"Fichier supprimé définitivement.",error:"Échec de la suppression.",warning:"Attention :",busy:"Suppression…"},
  ES:{intro:"Busca imágenes y vídeos en las carpetas elegidas. Buscar no cambia nada; eliminar requiere confirmación.",open:"Eliminar…",title:"Eliminar archivo",explanation:"Solo se afectan estos archivos. Las copias en otras carpetas permanecen.",metadata:"Metadatos asociados",cancel:"Cancelar",trash:"Mover a la Papelera",permanent:"Eliminar definitivamente",acknowledge:"Entiendo que la eliminación definitiva no se puede deshacer.",doneTrash:"Archivo movido a la Papelera.",donePermanent:"Archivo eliminado definitivamente.",error:"No se pudo eliminar.",warning:"Aviso:",busy:"Eliminando…"},
  IT:{intro:"Cerca immagini e video nelle cartelle selezionate. La ricerca non modifica nulla; l'eliminazione richiede conferma.",open:"Elimina…",title:"Elimina file",explanation:"Solo questi file saranno interessati. Le copie in altre cartelle restano.",metadata:"Metadati associati",cancel:"Annulla",trash:"Sposta nel Cestino",permanent:"Elimina definitivamente",acknowledge:"So che l'eliminazione definitiva non può essere annullata.",doneTrash:"File spostato nel Cestino.",donePermanent:"File eliminato definitivamente.",error:"Eliminazione non riuscita.",warning:"Attenzione:",busy:"Eliminazione…"},
  PT:{intro:"Pesquise imagens e vídeos nas pastas escolhidas. A pesquisa não altera nada; a eliminação exige confirmação.",open:"Eliminar…",title:"Eliminar ficheiro",explanation:"Apenas estes ficheiros serão afetados. As cópias noutras pastas permanecem.",metadata:"Metadados associados",cancel:"Cancelar",trash:"Mover para a Reciclagem",permanent:"Eliminar definitivamente",acknowledge:"Compreendo que a eliminação definitiva não pode ser anulada.",doneTrash:"Ficheiro movido para a Reciclagem.",donePermanent:"Ficheiro eliminado definitivamente.",error:"Falha ao eliminar.",warning:"Aviso:",busy:"A eliminar…"},
  PL:{intro:"Przeszukuj obrazy i filmy w wybranych folderach. Wyszukiwanie niczego nie zmienia; usunięcie wymaga potwierdzenia.",open:"Usuń…",title:"Usuń plik",explanation:"Dotyczy tylko tych plików. Kopie w innych folderach pozostaną.",metadata:"Powiązane metadane",cancel:"Anuluj",trash:"Przenieś do Kosza",permanent:"Usuń trwale",acknowledge:"Rozumiem, że trwałego usunięcia nie można cofnąć.",doneTrash:"Plik przeniesiony do Kosza.",donePermanent:"Plik trwale usunięty.",error:"Usuwanie nie powiodło się.",warning:"Uwaga:",busy:"Usuwanie…"}
};
const catalogImageCopy = {
  HU:{preview:"Kép nagyítása",open:"Megnyitás a gépen",close:"Bezárás",opened:"A kép megnyitva a hozzárendelt programmal.",error:"Nem sikerült megnyitni a képet."},
  EN:{preview:"Enlarge image",open:"Open in default app",close:"Close",opened:"Image opened in the default app.",error:"Could not open the image."},
  DE:{preview:"Bild vergrößern",open:"In Standard-App öffnen",close:"Schließen",opened:"Bild in der Standard-App geöffnet.",error:"Bild konnte nicht geöffnet werden."},
  FR:{preview:"Agrandir l’image",open:"Ouvrir avec l’application par défaut",close:"Fermer",opened:"Image ouverte avec l’application par défaut.",error:"Impossible d’ouvrir l’image."},
  ES:{preview:"Ampliar imagen",open:"Abrir con la aplicación predeterminada",close:"Cerrar",opened:"Imagen abierta con la aplicación predeterminada.",error:"No se pudo abrir la imagen."},
  IT:{preview:"Ingrandisci immagine",open:"Apri nell’app predefinita",close:"Chiudi",opened:"Immagine aperta nell’app predefinita.",error:"Impossibile aprire l’immagine."},
  PT:{preview:"Ampliar imagem",open:"Abrir na aplicação predefinida",close:"Fechar",opened:"Imagem aberta na aplicação predefinida.",error:"Não foi possível abrir a imagem."},
  PL:{preview:"Powiększ obraz",open:"Otwórz w domyślnej aplikacji",close:"Zamknij",opened:"Obraz otwarty w domyślnej aplikacji.",error:"Nie udało się otworzyć obrazu."}
};
const catalogPrivacyCopy = {
  HU:{show:"Bélyegképek mutatása",hidden:"Előnézet rejtve"},
  EN:{show:"Show thumbnails",hidden:"Preview hidden"},
  DE:{show:"Vorschaubilder anzeigen",hidden:"Vorschau ausgeblendet"},
  FR:{show:"Afficher les miniatures",hidden:"Aperçu masqué"},
  ES:{show:"Mostrar miniaturas",hidden:"Vista previa oculta"},
  IT:{show:"Mostra miniature",hidden:"Anteprima nascosta"},
  PT:{show:"Mostrar miniaturas",hidden:"Pré-visualização oculta"},
  PL:{show:"Pokaż miniatury",hidden:"Podgląd ukryty"}
};

const catalogBridgeCopy = {
  HU:{settings:"Mentett beállítások",viewSettings:"Beállítások beolvasása",none:"Nincs kiolvasható technikai beállítás",similar:"Hasonlót készítek",workflow:"Workflow-javaslat ebből",ready:"A Workflow Studio külön lapon megnyílt. Ott átnézheted, majd átveheted a javaslatot.",link:"Workflow Studio megnyitása",error:"Nem sikerült átadni a találatot."},
  EN:{settings:"Saved settings",viewSettings:"Read saved settings",none:"No readable technical settings",similar:"Create something similar",workflow:"Build a workflow from this",ready:"Workflow Studio opened in a new tab. Review the suggestion there before applying it.",link:"Open Workflow Studio",error:"Could not pass this result to Workflow Studio."},
  DE:{settings:"Gespeicherte Einstellungen",none:"Keine lesbaren technischen Einstellungen",similar:"Ähnliches erstellen",workflow:"Workflow daraus vorschlagen",ready:"Workflow Studio wurde in einem neuen Tab geöffnet. Bitte prüfe den Vorschlag.",link:"Workflow Studio öffnen",error:"Übergabe fehlgeschlagen."},
  FR:{settings:"Paramètres enregistrés",none:"Aucun paramètre technique lisible",similar:"Créer une variante",workflow:"Proposer un workflow",ready:"Workflow Studio s'est ouvert dans un nouvel onglet. Vérifiez la proposition.",link:"Ouvrir Workflow Studio",error:"Transfert impossible."},
  ES:{settings:"Ajustes guardados",none:"No hay ajustes técnicos legibles",similar:"Crear algo parecido",workflow:"Proponer un workflow",ready:"Workflow Studio se abrió en otra pestaña. Revisa la propuesta antes de aplicarla.",link:"Abrir Workflow Studio",error:"No se pudo transferir el resultado."},
  IT:{settings:"Impostazioni salvate",none:"Nessuna impostazione tecnica leggibile",similar:"Crea qualcosa di simile",workflow:"Proponi un workflow",ready:"Workflow Studio è aperto in una nuova scheda. Controlla la proposta.",link:"Apri Workflow Studio",error:"Trasferimento non riuscito."},
  PT:{settings:"Definições guardadas",none:"Sem definições técnicas legíveis",similar:"Criar algo semelhante",workflow:"Sugerir workflow",ready:"O Workflow Studio abriu num novo separador. Reveja a proposta.",link:"Abrir Workflow Studio",error:"Não foi possível transferir o resultado."},
  PL:{settings:"Zapisane ustawienia",none:"Brak czytelnych ustawień technicznych",similar:"Utwórz podobne",workflow:"Zaproponuj workflow",ready:"Workflow Studio otwarto w nowej karcie. Sprawdź propozycję.",link:"Otwórz Workflow Studio",error:"Nie udało się przekazać wyniku."}
};

const catalogVideoCopy = {
  HU:{preview:"Videó előnézete",close:"Bezárás",hint:"A videó csak a Lejátszás gombbal indul.",noFrame:"Képkocka nem olvasható"},
  EN:{preview:"Preview video",close:"Close",hint:"The video starts only when you press Play.",noFrame:"Frame unavailable"},
  DE:{preview:"Video ansehen",close:"Schließen",hint:"Das Video startet erst mit Wiedergabe.",noFrame:"Kein Bild verfügbar"},
  FR:{preview:"Voir la vidéo",close:"Fermer",hint:"La vidéo démarre uniquement après Lecture.",noFrame:"Image indisponible"},
  ES:{preview:"Ver vídeo",close:"Cerrar",hint:"El vídeo comienza al pulsar Reproducir.",noFrame:"Fotograma no disponible"},
  IT:{preview:"Mostra video",close:"Chiudi",hint:"Il video parte solo premendo Riproduci.",noFrame:"Fotogramma non disponibile"},
  PT:{preview:"Ver vídeo",close:"Fechar",hint:"O vídeo só começa ao premir Reproduzir.",noFrame:"Fotograma indisponível"},
  PL:{preview:"Pokaż film",close:"Zamknij",hint:"Film uruchamia się dopiero po naciśnięciu Odtwórz.",noFrame:"Klatka niedostępna"}
};

const catalogViewerCopy = {
  HU:{previous:"Előző",next:"Következő",select:"Kijelölés későbbre",selected:"kijelölve",delete:"Törlés…",saveError:"Nem sikerült menteni.",saved:"Mentve.",of:"/",preview:"Néma előnézet"},
  EN:{previous:"Previous",next:"Next",select:"Select for later",selected:"selected",delete:"Delete…",saveError:"Could not save.",saved:"Saved.",of:"/",preview:"Muted preview"},
  DE:{previous:"Zurück",next:"Weiter",select:"Für später auswählen",selected:"ausgewählt",delete:"Löschen…",saveError:"Speichern fehlgeschlagen.",saved:"Gespeichert.",of:"/",preview:"Stumme Vorschau"},
  FR:{previous:"Précédent",next:"Suivant",select:"Sélectionner pour plus tard",selected:"sélectionnés",delete:"Supprimer…",saveError:"Enregistrement impossible.",saved:"Enregistré.",of:"/",preview:"Aperçu muet"},
  ES:{previous:"Anterior",next:"Siguiente",select:"Seleccionar para después",selected:"seleccionados",delete:"Eliminar…",saveError:"No se pudo guardar.",saved:"Guardado.",of:"/",preview:"Vista previa sin sonido"},
  IT:{previous:"Precedente",next:"Successivo",select:"Seleziona per dopo",selected:"selezionati",delete:"Elimina…",saveError:"Impossibile salvare.",saved:"Salvato.",of:"/",preview:"Anteprima senza audio"},
  PT:{previous:"Anterior",next:"Seguinte",select:"Selecionar para mais tarde",selected:"selecionados",delete:"Eliminar…",saveError:"Não foi possível guardar.",saved:"Guardado.",of:"/",preview:"Pré-visualização sem som"},
  PL:{previous:"Poprzedni",next:"Następny",select:"Zaznacz na później",selected:"zaznaczono",delete:"Usuń…",saveError:"Nie udało się zapisać.",saved:"Zapisano.",of:"/",preview:"Podgląd bez dźwięku"}
};
const catalogCleanupCopy = {
  HU:{title:"Takarítási javaslatok",help:"Csak külön indításra vizsgál. Üres vagy gyanús fájlokat és bitre pontos másolatokat keres; az utolsó órában módosult fájlokat kihagyja. Nem töröl automatikusan. Minden találatot nézz át, mielőtt a Lomtárba küldenéd.",start:"Ellenőrzés indítása",cancel:"Megszakítás",idle:"Még nem futott ellenőrzés.",working:"Ellenőrzés folyamatban",done:"Ellenőrzés kész",none:"Nem találtam javaslatot.",suspect:"Gyanús fájl",duplicate:"Pontos másolat",empty:"Üres fájl",truncated:"Lehet, hogy hiányos fájl",header:"Szokatlan vagy hibás fájlfejléc",exact:"A csoport fájljai bitre azonosak; te döntsd el, melyik maradjon.",preview:"Megnézem",remove:"Törlés ellenőrzése…",previous:"Előző",next:"Következő",page:"Oldal",recent:"friss fájl kihagyva",changed:"megváltozott fájl kihagyva",unreadable:"nem ellenőrizhető",hashed:"ellenőrzött egyezés",error:"Az ellenőrzés nem sikerült.",cancelled:"Megszakítva.",review:"Találat: "},
  EN:{title:"Cleanup suggestions",help:"Runs only when requested. Finds empty or suspicious files and byte-for-byte duplicates; skips files modified in the last hour. Never deletes automatically. Review each result before sending it to the Recycle Bin.",start:"Start check",cancel:"Cancel",idle:"No check has run yet.",working:"Checking",done:"Check complete",none:"No suggestions found.",suspect:"Suspicious file",duplicate:"Exact duplicate",empty:"Empty file",truncated:"Possibly incomplete file",header:"Unusual or invalid file header",exact:"Files in this group are byte-for-byte identical; choose which to keep.",preview:"Preview",remove:"Review deletion…",previous:"Previous",next:"Next",page:"Page",recent:"recent files skipped",changed:"changed files skipped",unreadable:"could not check",hashed:"matches checked",error:"Check failed.",cancelled:"Cancelled.",review:"Results: "},
  DE:{title:"Aufräumvorschläge",help:"Nur auf Klick: leere oder verdächtige Dateien und bytegleiche Duplikate. Dateien der letzten Stunde werden übersprungen. Keine automatische Löschung.",start:"Prüfung starten",cancel:"Abbrechen",idle:"Noch keine Prüfung.",working:"Prüfung läuft",done:"Prüfung abgeschlossen",none:"Keine Vorschläge.",suspect:"Verdächtige Datei",duplicate:"Exaktes Duplikat",empty:"Leere Datei",truncated:"Möglicherweise unvollständig",header:"Ungewöhnlicher Dateikopf",exact:"Diese Dateien sind bytegleich. Entscheide, welche bleibt.",preview:"Ansehen",remove:"Löschen prüfen…",previous:"Zurück",next:"Weiter",page:"Seite",recent:"neue Dateien übersprungen",changed:"geänderte Dateien übersprungen",unreadable:"nicht prüfbar",hashed:"Vergleiche geprüft",error:"Prüfung fehlgeschlagen.",cancelled:"Abgebrochen.",review:"Treffer: "},
  FR:{title:"Suggestions de nettoyage",help:"Sur demande seulement : fichiers vides ou suspects et doublons identiques. Les fichiers modifiés depuis moins d'une heure sont ignorés. Aucune suppression automatique.",start:"Lancer la vérification",cancel:"Annuler",idle:"Aucune vérification.",working:"Vérification",done:"Vérification terminée",none:"Aucune suggestion.",suspect:"Fichier suspect",duplicate:"Doublon exact",empty:"Fichier vide",truncated:"Fichier peut-être incomplet",header:"En-tête inhabituel",exact:"Fichiers identiques octet par octet ; choisissez lequel garder.",preview:"Voir",remove:"Vérifier la suppression…",previous:"Précédent",next:"Suivant",page:"Page",recent:"fichiers récents ignorés",changed:"fichiers modifiés ignorés",unreadable:"non vérifiables",hashed:"correspondances vérifiées",error:"Échec de la vérification.",cancelled:"Annulé.",review:"Résultats : "},
  ES:{title:"Sugerencias de limpieza",help:"Solo a petición: archivos vacíos o sospechosos y duplicados idénticos. Omite los modificados en la última hora. Nunca borra automáticamente.",start:"Iniciar revisión",cancel:"Cancelar",idle:"Aún no hay revisión.",working:"Revisando",done:"Revisión terminada",none:"Sin sugerencias.",suspect:"Archivo sospechoso",duplicate:"Duplicado exacto",empty:"Archivo vacío",truncated:"Posiblemente incompleto",header:"Cabecera inusual",exact:"Archivos idénticos byte a byte; decide cuál conservar.",preview:"Ver",remove:"Revisar eliminación…",previous:"Anterior",next:"Siguiente",page:"Página",recent:"archivos recientes omitidos",changed:"archivos cambiados omitidos",unreadable:"sin comprobar",hashed:"coincidencias verificadas",error:"Falló la revisión.",cancelled:"Cancelado.",review:"Resultados: "},
  IT:{title:"Suggerimenti di pulizia",help:"Solo su richiesta: file vuoti o sospetti e duplicati identici. Ignora i file modificati nell'ultima ora. Nessuna eliminazione automatica.",start:"Avvia controllo",cancel:"Annulla",idle:"Nessun controllo eseguito.",working:"Controllo",done:"Controllo completato",none:"Nessun suggerimento.",suspect:"File sospetto",duplicate:"Duplicato esatto",empty:"File vuoto",truncated:"Forse incompleto",header:"Intestazione insolita",exact:"File identici byte per byte; scegli quale tenere.",preview:"Anteprima",remove:"Controlla eliminazione…",previous:"Precedente",next:"Successivo",page:"Pagina",recent:"file recenti ignorati",changed:"file modificati ignorati",unreadable:"non verificabili",hashed:"corrispondenze verificate",error:"Controllo non riuscito.",cancelled:"Annullato.",review:"Risultati: "},
  PT:{title:"Sugestões de limpeza",help:"Só a pedido: ficheiros vazios ou suspeitos e duplicados idênticos. Ignora ficheiros alterados na última hora. Nunca apaga automaticamente.",start:"Iniciar verificação",cancel:"Cancelar",idle:"Ainda sem verificação.",working:"A verificar",done:"Verificação concluída",none:"Sem sugestões.",suspect:"Ficheiro suspeito",duplicate:"Duplicado exato",empty:"Ficheiro vazio",truncated:"Talvez incompleto",header:"Cabeçalho invulgar",exact:"Ficheiros idênticos byte a byte; escolha qual manter.",preview:"Ver",remove:"Rever eliminação…",previous:"Anterior",next:"Seguinte",page:"Página",recent:"ficheiros recentes ignorados",changed:"ficheiros alterados ignorados",unreadable:"não verificáveis",hashed:"correspondências verificadas",error:"Verificação falhou.",cancelled:"Cancelado.",review:"Resultados: "},
  PL:{title:"Sugestie porządkowania",help:"Tylko na żądanie: puste lub podejrzane pliki i identyczne kopie. Pomija pliki zmienione w ostatniej godzinie. Nigdy nie usuwa automatycznie.",start:"Rozpocznij sprawdzanie",cancel:"Anuluj",idle:"Nie wykonano sprawdzenia.",working:"Sprawdzanie",done:"Sprawdzanie zakończone",none:"Brak sugestii.",suspect:"Podejrzany plik",duplicate:"Dokładna kopia",empty:"Pusty plik",truncated:"Może być niekompletny",header:"Nietypowy nagłówek",exact:"Pliki są identyczne bajt po bajcie; wybierz, który zachować.",preview:"Podgląd",remove:"Sprawdź usunięcie…",previous:"Poprzednia",next:"Następna",page:"Strona",recent:"pominięto nowe pliki",changed:"pominięto zmienione pliki",unreadable:"nie można sprawdzić",hashed:"sprawdzone zgodności",error:"Sprawdzanie nie powiodło się.",cancelled:"Anulowano.",review:"Wyniki: "}
};
const cleanupBatchCopy = {
  HU:{select:"Kijelölés törléshez",selected:"kijelölve (legfeljebb 100)",page:"Oldal kijelölése",clear:"Kijelölés törlése",keep:"Pontos másolatokból maradjon:",rating:"Legjobbra értékelt",oldest:"Legrégebbi",newest:"Legújabb",auto:"Másolatok jelölése",review:"Kijelöltek törlésének ellenőrzése…",title:"Kijelölt fájlok ellenőrzése",intro:"Csak a felsorolt fájlokat érinti. A pontos másolatok minden csoportjából egy példány megmarad.",count:"Kijelölt fájlok",cancel:"Mégse",trash:"Lomtárba helyezés",permanent:"Végleges törlés",ack:"Tudom, hogy a végleges törlés nem vonható vissza.",empty:"Jelölj ki legalább egy találatot.",limit:"Egyszerre legfeljebb 100 fájl jelölhető ki.",autoDone:"Pontos másolatok kijelölve; minden csoportból egy megmarad.",done:"Törölt fájlok:",partial:"A művelet megállt; a többi találat megmaradt.",keepError:"Pontos másolatból legalább egyet meg kell tartani. Módosítsd a kijelölést.",busy:"Törlés folyamatban…"},
  EN:{select:"Select for deletion",selected:"selected (maximum 100)",page:"Select page",clear:"Clear selection",keep:"Keep one exact duplicate:",rating:"Highest rated",oldest:"Oldest",newest:"Newest",auto:"Select duplicate extras",review:"Review selected deletions…",title:"Review selected files",intro:"Only listed files are affected. One copy from each exact-duplicate group remains.",count:"Selected files",cancel:"Cancel",trash:"Move to Recycle Bin",permanent:"Delete permanently",ack:"I understand permanent deletion cannot be undone.",empty:"Select at least one result.",limit:"You can select at most 100 files at once.",autoDone:"Duplicate extras selected; one from each group remains.",done:"Files removed:",partial:"Operation stopped; remaining results are still available.",keepError:"At least one exact duplicate must remain. Change the selection.",busy:"Deleting…"},
  DE:{select:"Zum Löschen wählen",selected:"ausgewählt (maximal 100)",page:"Seite auswählen",clear:"Auswahl löschen",keep:"Exaktes Duplikat behalten:",rating:"Höchste Bewertung",oldest:"Ältestes",newest:"Neuestes",auto:"Duplikate markieren",review:"Ausgewählte Löschungen prüfen…",title:"Ausgewählte Dateien prüfen",intro:"Nur die aufgelisteten Dateien sind betroffen. Eine Kopie jeder Gruppe bleibt.",count:"Ausgewählte Dateien",cancel:"Abbrechen",trash:"In den Papierkorb",permanent:"Endgültig löschen",ack:"Endgültiges Löschen kann nicht rückgängig gemacht werden.",empty:"Mindestens einen Treffer wählen.",limit:"Maximal 100 Dateien gleichzeitig.",autoDone:"Duplikate ausgewählt; eine Kopie bleibt.",done:"Entfernte Dateien:",partial:"Vorgang gestoppt; übrige Treffer bleiben.",keepError:"Mindestens ein Duplikat muss bleiben.",busy:"Wird gelöscht…"},
  FR:{select:"Sélectionner pour supprimer",selected:"sélectionnés (100 max.)",page:"Sélectionner la page",clear:"Effacer la sélection",keep:"Garder un doublon exact :",rating:"Mieux noté",oldest:"Plus ancien",newest:"Plus récent",auto:"Sélectionner les doublons",review:"Vérifier les suppressions…",title:"Vérifier les fichiers",intro:"Seuls les fichiers listés sont concernés. Une copie de chaque groupe reste.",count:"Fichiers sélectionnés",cancel:"Annuler",trash:"Mettre à la Corbeille",permanent:"Supprimer définitivement",ack:"La suppression définitive est irréversible.",empty:"Sélectionnez au moins un résultat.",limit:"100 fichiers maximum à la fois.",autoDone:"Doublons sélectionnés ; une copie reste.",done:"Fichiers supprimés :",partial:"Opération arrêtée ; autres résultats conservés.",keepError:"Gardez au moins un doublon exact.",busy:"Suppression…"},
  ES:{select:"Seleccionar para borrar",selected:"seleccionados (máximo 100)",page:"Seleccionar página",clear:"Borrar selección",keep:"Conservar duplicado exacto:",rating:"Mejor valorado",oldest:"Más antiguo",newest:"Más reciente",auto:"Seleccionar duplicados",review:"Revisar eliminación…",title:"Revisar archivos",intro:"Solo afecta a los archivos listados. Queda una copia de cada grupo.",count:"Archivos seleccionados",cancel:"Cancelar",trash:"Enviar a Papelera",permanent:"Eliminar definitivamente",ack:"La eliminación definitiva no se puede deshacer.",empty:"Selecciona al menos un resultado.",limit:"Máximo 100 archivos a la vez.",autoDone:"Duplicados seleccionados; queda una copia.",done:"Archivos eliminados:",partial:"Operación detenida; quedan los demás resultados.",keepError:"Debe quedar un duplicado exacto.",busy:"Eliminando…"},
  IT:{select:"Seleziona per eliminare",selected:"selezionati (massimo 100)",page:"Seleziona pagina",clear:"Cancella selezione",keep:"Conserva un duplicato:",rating:"Voto più alto",oldest:"Più vecchio",newest:"Più recente",auto:"Seleziona duplicati",review:"Controlla eliminazione…",title:"Controlla i file",intro:"Solo i file elencati saranno interessati. Una copia per gruppo resta.",count:"File selezionati",cancel:"Annulla",trash:"Sposta nel Cestino",permanent:"Elimina definitivamente",ack:"L'eliminazione definitiva è irreversibile.",empty:"Seleziona almeno un risultato.",limit:"Massimo 100 file alla volta.",autoDone:"Duplicati selezionati; una copia resta.",done:"File eliminati:",partial:"Operazione interrotta; gli altri risultati restano.",keepError:"Deve restare un duplicato esatto.",busy:"Eliminazione…"},
  PT:{select:"Selecionar para eliminar",selected:"selecionados (máximo 100)",page:"Selecionar página",clear:"Limpar seleção",keep:"Manter um duplicado:",rating:"Mais bem avaliado",oldest:"Mais antigo",newest:"Mais recente",auto:"Selecionar duplicados",review:"Rever eliminação…",title:"Rever ficheiros",intro:"Só os ficheiros listados são afetados. Uma cópia de cada grupo permanece.",count:"Ficheiros selecionados",cancel:"Cancelar",trash:"Mover para Reciclagem",permanent:"Eliminar definitivamente",ack:"A eliminação definitiva é irreversível.",empty:"Selecione pelo menos um resultado.",limit:"Máximo de 100 ficheiros de cada vez.",autoDone:"Duplicados selecionados; uma cópia permanece.",done:"Ficheiros eliminados:",partial:"Operação parada; os outros resultados permanecem.",keepError:"Tem de permanecer um duplicado exato.",busy:"A eliminar…"},
  PL:{select:"Zaznacz do usunięcia",selected:"zaznaczono (maks. 100)",page:"Zaznacz stronę",clear:"Wyczyść wybór",keep:"Zachowaj jedną kopię:",rating:"Najwyżej oceniona",oldest:"Najstarsza",newest:"Najnowsza",auto:"Zaznacz duplikaty",review:"Sprawdź usuwanie…",title:"Sprawdź pliki",intro:"Dotyczy tylko wymienionych plików. Jedna kopia z każdej grupy zostaje.",count:"Wybrane pliki",cancel:"Anuluj",trash:"Przenieś do Kosza",permanent:"Usuń trwale",ack:"Trwałego usunięcia nie można cofnąć.",empty:"Zaznacz co najmniej jeden wynik.",limit:"Maksymalnie 100 plików naraz.",autoDone:"Duplikaty zaznaczone; jedna kopia zostaje.",done:"Usunięte pliki:",partial:"Operacja zatrzymana; reszta wyników pozostała.",keepError:"Co najmniej jedna kopia musi zostać.",busy:"Usuwanie…"}
};
const cleanupProtectedCopy = {
  HU:"A választott szabály alapján ez megmarad:",
  EN:"Kept according to your chosen rule:",
  DE:"Nach der gewählten Regel bleibt erhalten:",
  FR:"Conservé selon la règle choisie :",
  ES:"Se conserva según la regla elegida:",
  IT:"Conservato secondo la regola scelta:",
  PT:"Mantido segundo a regra escolhida:",
  PL:"Zachowane według wybranej reguły:"
};
const cleanupSelectAllCopy = {
  HU:{all:"Összes kijelölése",first:"Első 100 kijelölése",done:"Minden találat kijelölve.",limited:"Az első 100 találat kijelölve; a többi külön körben kezelhető.",changed:"A találatok közben megváltoztak. Nézd át újra a listát."},
  EN:{all:"Select all",first:"Select first 100",done:"All results selected.",limited:"The first 100 results are selected; handle the rest separately.",changed:"Results changed during selection. Review the list again."},
  DE:{all:"Alle auswählen",first:"Erste 100 auswählen",done:"Alle Treffer ausgewählt.",limited:"Die ersten 100 Treffer sind ausgewählt; die übrigen separat bearbeiten.",changed:"Die Treffer haben sich geändert. Liste erneut prüfen."},
  FR:{all:"Tout sélectionner",first:"Sélectionner les 100 premiers",done:"Tous les résultats sont sélectionnés.",limited:"Les 100 premiers sont sélectionnés ; traitez le reste séparément.",changed:"Les résultats ont changé. Vérifiez à nouveau la liste."},
  ES:{all:"Seleccionar todos",first:"Seleccionar los primeros 100",done:"Todos los resultados seleccionados.",limited:"Seleccionados los primeros 100; trata el resto por separado.",changed:"Los resultados han cambiado. Revisa la lista."},
  IT:{all:"Seleziona tutti",first:"Seleziona i primi 100",done:"Tutti i risultati selezionati.",limited:"Selezionati i primi 100; gestisci gli altri separatamente.",changed:"I risultati sono cambiati. Ricontrolla l'elenco."},
  PT:{all:"Selecionar todos",first:"Selecionar os primeiros 100",done:"Todos os resultados selecionados.",limited:"Selecionados os primeiros 100; trate os restantes em separado.",changed:"Os resultados mudaram. Reveja a lista."},
  PL:{all:"Zaznacz wszystkie",first:"Zaznacz pierwsze 100",done:"Zaznaczono wszystkie wyniki.",limited:"Zaznaczono pierwsze 100; pozostałe obsłuż osobno.",changed:"Wyniki się zmieniły. Sprawdź listę ponownie."}
};
const cleanupGalleryCopy = {
  HU:{gallery:"Galéria nézet",list:"Lista nézet"},
  EN:{gallery:"Gallery view",list:"List view"},
  DE:{gallery:"Galerieansicht",list:"Listenansicht"},
  FR:{gallery:"Vue galerie",list:"Vue liste"},
  ES:{gallery:"Vista de galería",list:"Vista de lista"},
  IT:{gallery:"Vista galleria",list:"Vista elenco"},
  PT:{gallery:"Vista de galeria",list:"Vista de lista"},
  PL:{gallery:"Widok galerii",list:"Widok listy"}
};
const viewerFieldCopy = {
  HU:{positive:"Pozitív prompt másolása",negative:"Negatív prompt másolása",copied:"Kimásolva."},
  EN:{positive:"Copy positive prompt",negative:"Copy negative prompt",copied:"Copied."},
  DE:{positive:"Positiven Prompt kopieren",negative:"Negativen Prompt kopieren",copied:"Kopiert."},
  FR:{positive:"Copier le prompt positif",negative:"Copier le prompt négatif",copied:"Copié."},
  ES:{positive:"Copiar prompt positivo",negative:"Copiar prompt negativo",copied:"Copiado."},
  IT:{positive:"Copia prompt positivo",negative:"Copia prompt negativo",copied:"Copiato."},
  PT:{positive:"Copiar prompt positivo",negative:"Copiar prompt negativo",copied:"Copiado."},
  PL:{positive:"Kopiuj prompt pozytywny",negative:"Kopiuj prompt negatywny",copied:"Skopiowano."}
};
const viewerAiCopy={HU:"Kérdezd az MI-t",EN:"Ask AI",DE:"KI fragen",FR:"Demander à l’IA",ES:"Preguntar a la IA",IT:"Chiedi all’IA",PT:"Perguntar à IA",PL:"Zapytaj AI"};
const viewerWorkbenchCopy={HU:"Küldés a Promptműhelybe",EN:"Send to prompt workbench",DE:"Zur Prompt-Werkstatt",FR:"Envoyer à l'atelier de prompt",ES:"Enviar al taller de prompts",IT:"Invia al laboratorio prompt",PT:"Enviar para a oficina de prompts",PL:"Wyślij do warsztatu promptów"};
const catalogRecipeCopy = {
  HU:{positive:"Pozitív prompt",negative:"Negatív prompt",copyPrompt:"Prompt másolása",copyRecipe:"Teljes recept másolása",copiedPrompt:"A prompt kimásolva.",copiedRecipe:"A teljes recept kimásolva.",copyFailed:"Nem sikerült a vágólapra másolni.",loading:"Metaadatok beolvasása…",file:"Fájl",source:"Forrás",note:"A recept mentett adatokból készült; a prompt beillesztése önmagában nem állítja vissza a többi beállítást."},
  EN:{positive:"Positive prompt",negative:"Negative prompt",copyPrompt:"Copy prompt",copyRecipe:"Copy full recipe",copiedPrompt:"Prompt copied.",copiedRecipe:"Full recipe copied.",copyFailed:"Could not copy to clipboard.",loading:"Reading metadata…",file:"File",source:"Source",note:"This recipe uses saved metadata; pasting the prompt alone does not restore the other settings."},
  DE:{positive:"Positiver Prompt",negative:"Negativer Prompt",copyPrompt:"Prompt kopieren",copyRecipe:"Ganzes Rezept kopieren",copiedPrompt:"Prompt kopiert.",copiedRecipe:"Ganzes Rezept kopiert.",copyFailed:"Kopieren fehlgeschlagen.",loading:"Metadaten werden gelesen…",file:"Datei",source:"Quelle",note:"Dieses Rezept enthält gespeicherte Daten; der Prompt allein stellt die übrigen Einstellungen nicht wieder her."},
  FR:{positive:"Prompt positif",negative:"Prompt négatif",copyPrompt:"Copier le prompt",copyRecipe:"Copier la recette complète",copiedPrompt:"Prompt copié.",copiedRecipe:"Recette complète copiée.",copyFailed:"Copie impossible.",loading:"Lecture des métadonnées…",file:"Fichier",source:"Source",note:"Cette recette utilise les données enregistrées ; coller le prompt seul ne rétablit pas les autres réglages."},
  ES:{positive:"Prompt positivo",negative:"Prompt negativo",copyPrompt:"Copiar prompt",copyRecipe:"Copiar receta completa",copiedPrompt:"Prompt copiado.",copiedRecipe:"Receta completa copiada.",copyFailed:"No se pudo copiar.",loading:"Leyendo metadatos…",file:"Archivo",source:"Origen",note:"Esta receta usa datos guardados; pegar solo el prompt no restaura los demás ajustes."},
  IT:{positive:"Prompt positivo",negative:"Prompt negativo",copyPrompt:"Copia prompt",copyRecipe:"Copia ricetta completa",copiedPrompt:"Prompt copiato.",copiedRecipe:"Ricetta completa copiata.",copyFailed:"Copia non riuscita.",loading:"Lettura dei metadati…",file:"File",source:"Origine",note:"Questa ricetta usa dati salvati; incollare il prompt non ripristina le altre impostazioni."},
  PT:{positive:"Prompt positivo",negative:"Prompt negativo",copyPrompt:"Copiar prompt",copyRecipe:"Copiar receita completa",copiedPrompt:"Prompt copiado.",copiedRecipe:"Receita completa copiada.",copyFailed:"Não foi possível copiar.",loading:"A ler metadados…",file:"Ficheiro",source:"Origem",note:"Esta receita usa dados guardados; colar apenas o prompt não repõe as restantes definições."},
  PL:{positive:"Prompt pozytywny",negative:"Prompt negatywny",copyPrompt:"Kopiuj prompt",copyRecipe:"Kopiuj pełny przepis",copiedPrompt:"Prompt skopiowany.",copiedRecipe:"Pełny przepis skopiowany.",copyFailed:"Nie udało się skopiować.",loading:"Odczytywanie metadanych…",file:"Plik",source:"Źródło",note:"Przepis korzysta z zapisanych danych; wklejenie samego promptu nie przywraca pozostałych ustawień."}
};
const passportUiCopy = {
  HU:{open:"Alkotói útlevél készítése",review:"Megosztás előtt olvasd át és szerkeszd a szöveget. A fájlnevet és a helyi elérési utat nem tesszük bele.",sensitive:"Figyelem: a promptban vagy más adatban személyes adat vagy helyi útvonal lehet.",missing:"Ellenőrzött alapadatok hiánya",copy:"Átnézett útlevél másolása",copied:"Az átnézett útlevél kimásolva."},
  EN:{open:"Prepare creator passport",review:"Review and edit before sharing. The filename and local path are excluded.",sensitive:"Caution: a prompt or other field may contain personal information or a local path.",missing:"Missing checked basics",copy:"Copy reviewed passport",copied:"Reviewed passport copied."},
  DE:{open:"Kreativpass erstellen",review:"Vor dem Teilen prüfen und bearbeiten. Dateiname und lokaler Pfad fehlen.",sensitive:"Achtung: Prompt oder andere Felder können persönliche Daten enthalten.",missing:"Wichtige fehlende Daten",copy:"Geprüften Pass kopieren",copied:"Geprüfter Pass kopiert."},
  FR:{open:"Préparer le passeport créatif",review:"Vérifiez et modifiez avant de partager. Le nom et le chemin du fichier sont exclus.",sensitive:"Attention : le prompt peut contenir des données personnelles ou un chemin local.",missing:"Données importantes manquantes",copy:"Copier après vérification",copied:"Passeport vérifié copié."},
  ES:{open:"Preparar pasaporte creativo",review:"Revísalo y edítalo antes de compartir. Se excluyen el nombre y la ruta local.",sensitive:"Atención: el prompt puede contener datos personales o rutas locales.",missing:"Datos importantes ausentes",copy:"Copiar tras revisar",copied:"Pasaporte revisado copiado."},
  IT:{open:"Prepara passaporto creativo",review:"Controlla e modifica prima di condividere. Nome e percorso locale sono esclusi.",sensitive:"Attenzione: il prompt può contenere dati personali o percorsi locali.",missing:"Dati importanti mancanti",copy:"Copia dopo il controllo",copied:"Passaporto controllato copiato."},
  PT:{open:"Preparar passaporte criativo",review:"Reveja e edite antes de partilhar. Nome e caminho local são excluídos.",sensitive:"Atenção: o prompt pode conter dados pessoais ou caminhos locais.",missing:"Dados importantes em falta",copy:"Copiar após revisão",copied:"Passaporte revisto copiado."},
  PL:{open:"Przygotuj paszport twórcy",review:"Sprawdź i edytuj przed udostępnieniem. Nazwa i ścieżka pliku są pominięte.",sensitive:"Uwaga: prompt może zawierać dane osobowe lub lokalną ścieżkę.",missing:"Brakujące ważne dane",copy:"Kopiuj po sprawdzeniu",copied:"Sprawdzony paszport skopiowany."}
};
const passportSuggestionCopy = {
  HU:{suggest:"Javasolj javított promptot (helyi AI)",help:"Csak a pozitív prompt kerül a gépeden futó Ollamához, és csak gombnyomásra. Az eredeti prompt érintetlen marad; a javaslatot ellenőrizd.",working:"Helyi javítási javaslat készül…",unavailable:"A helyi Ollama nem érhető el. Az eredeti prompt megmaradt.",modelMissing:"A gemma3:4b modell nincs telepítve az Ollamába.",failed:"Nem sikerült javaslatot készíteni. Az eredeti prompt megmaradt.",tooLong:"Ez a prompt túl hosszú a helyi javításhoz.",ready:"Kész a szerkeszthető javaslat. Nem az eredeti, mentett prompt.",copySuggestion:"Javasolt prompt másolása",copiedSuggestion:"A javasolt prompt kimásolva."},
  EN:{suggest:"Suggest a corrected prompt (local AI)",help:"Only the positive prompt goes to Ollama on this computer, and only when you click. The saved original stays untouched; review the suggestion.",working:"Preparing a local correction…",unavailable:"Local Ollama is unavailable. The original prompt is unchanged.",modelMissing:"The gemma3:4b model is not installed in Ollama.",failed:"Could not prepare a suggestion. The original prompt is unchanged.",tooLong:"This prompt is too long for local correction.",ready:"Editable suggestion ready. This is not the saved original prompt.",copySuggestion:"Copy suggested prompt",copiedSuggestion:"Suggested prompt copied."},
  DE:{suggest:"Korrigierten Prompt vorschlagen (lokale KI)",help:"Nur der positive Prompt geht nach dem Klick an Ollama auf diesem Computer. Das Original bleibt unverändert; Vorschlag prüfen.",working:"Lokaler Vorschlag wird erstellt…",unavailable:"Lokales Ollama ist nicht erreichbar. Original unverändert.",modelMissing:"gemma3:4b ist in Ollama nicht installiert.",failed:"Vorschlag fehlgeschlagen. Original unverändert.",tooLong:"Prompt für lokale Korrektur zu lang.",ready:"Bearbeitbarer Vorschlag bereit; nicht das gespeicherte Original.",copySuggestion:"Vorschlag kopieren",copiedSuggestion:"Vorschlag kopiert."},
  FR:{suggest:"Suggérer un prompt corrigé (IA locale)",help:"Seul le prompt positif est envoyé à Ollama sur cet ordinateur, après votre clic. L'original reste intact ; vérifiez la proposition.",working:"Correction locale en cours…",unavailable:"Ollama local indisponible. Original inchangé.",modelMissing:"gemma3:4b n'est pas installé dans Ollama.",failed:"Suggestion impossible. Original inchangé.",tooLong:"Prompt trop long pour la correction locale.",ready:"Suggestion modifiable prête ; ce n'est pas l'original enregistré.",copySuggestion:"Copier la suggestion",copiedSuggestion:"Suggestion copiée."},
  ES:{suggest:"Sugerir prompt corregido (IA local)",help:"Solo el prompt positivo va a Ollama en este equipo tras pulsar el botón. El original no cambia; revisa la propuesta.",working:"Preparando corrección local…",unavailable:"Ollama local no está disponible. Original sin cambios.",modelMissing:"gemma3:4b no está instalado en Ollama.",failed:"No se pudo crear la sugerencia. Original sin cambios.",tooLong:"Prompt demasiado largo para corrección local.",ready:"Sugerencia editable lista; no es el original guardado.",copySuggestion:"Copiar sugerencia",copiedSuggestion:"Sugerencia copiada."},
  IT:{suggest:"Suggerisci prompt corretto (IA locale)",help:"Solo il prompt positivo va a Ollama su questo computer dopo il clic. L'originale resta intatto; controlla la proposta.",working:"Correzione locale in corso…",unavailable:"Ollama locale non disponibile. Originale invariato.",modelMissing:"gemma3:4b non è installato in Ollama.",failed:"Impossibile creare la proposta. Originale invariato.",tooLong:"Prompt troppo lungo per la correzione locale.",ready:"Proposta modificabile pronta; non è l'originale salvato.",copySuggestion:"Copia proposta",copiedSuggestion:"Proposta copiata."},
  PT:{suggest:"Sugerir prompt corrigido (IA local)",help:"Só o prompt positivo segue para o Ollama neste computador, após clicar. O original fica intacto; reveja a proposta.",working:"A preparar correção local…",unavailable:"Ollama local indisponível. Original inalterado.",modelMissing:"gemma3:4b não está instalado no Ollama.",failed:"Não foi possível criar a sugestão. Original inalterado.",tooLong:"Prompt demasiado longo para correção local.",ready:"Sugestão editável pronta; não é o original guardado.",copySuggestion:"Copiar sugestão",copiedSuggestion:"Sugestão copiada."},
  PL:{suggest:"Zaproponuj poprawiony prompt (lokalne AI)",help:"Tylko pozytywny prompt trafia do Ollama na tym komputerze po kliknięciu. Oryginał pozostaje bez zmian; sprawdź propozycję.",working:"Tworzenie lokalnej propozycji…",unavailable:"Lokalne Ollama jest niedostępne. Oryginał bez zmian.",modelMissing:"gemma3:4b nie jest zainstalowany w Ollama.",failed:"Nie udało się przygotować propozycji. Oryginał bez zmian.",tooLong:"Prompt jest za długi do lokalnej korekty.",ready:"Edytowalna propozycja gotowa; to nie jest zapisany oryginał.",copySuggestion:"Kopiuj propozycję",copiedSuggestion:"Propozycja skopiowana."}
};
const passportLabels = (language="EN") => ({...passportUiCopy.EN,...passportSuggestionCopy.EN,...(passportUiCopy[language] || {}),...(passportSuggestionCopy[language] || {})});
function recipeLabels(language="EN") {
  return {...catalogCompareCopy.EN,...catalogRecipeCopy.EN,...(catalogCompareCopy[language] || {}),...(catalogRecipeCopy[language] || {})};
}
export function formatCatalogPrompt(item,language="EN") {
  const labels=recipeLabels(language), positive=String(item?.prompt || "").trim(), negative=String(item?.negative || "").trim();
  return positive ? negative ? `${positive}\n\n${labels.negative}:\n${negative}` : positive : "";
}
export function formatCatalogRecipe(item,language="EN") {
  const labels=recipeLabels(language), settings=item?.settings || {};
  const known=(value) => value !== undefined && value !== null && value !== "" ? String(value) : labels.unknown;
  const loras=Array.isArray(settings.loras) && settings.loras.length
    ? settings.loras.map((entry) => `${known(entry?.name)} ×${known(entry?.strength)}`).join("; ") : labels.unknown;
  const fields=[
    [labels.file,item?.filename],[labels.source,item?.source],[labels.positive,item?.prompt],
    [labels.negative,item?.negative],[labels.model,item?.model],[labels.loras,loras],
    [labels.width,settings.width],[labels.height,settings.height],[labels.duration,settings.duration],
    [labels.fps,settings.fps],[labels.frames,settings.frames],[labels.steps,settings.steps],
    [labels.cfg,settings.cfg],[labels.seed,settings.seed ?? (Array.isArray(settings.seeds) ? settings.seeds.join(", ") : undefined)],
    [labels.sampler,settings.sampler],[labels.scheduler,settings.scheduler]
  ];
  return `${fields.map(([label,value]) => `${label}: ${known(value)}`).join("\n")}\n\n${labels.note}`;
}
const viewerPathCopy = {"EN": ["Copy file path", "File path copied."], "HU": ["Fájl elérési útjának másolása", "A fájl elérési útja másolva."], "DE": ["Dateipfad kopieren", "Dateipfad kopiert."], "FR": ["Copier le chemin du fichier", "Chemin du fichier copié."], "ES": ["Copiar ruta del archivo", "Ruta del archivo copiada."], "IT": ["Copia percorso del file", "Percorso del file copiato."], "PT": ["Copiar caminho do ficheiro", "Caminho do ficheiro copiado."], "PL": ["Kopiuj ścieżkę pliku", "Ścieżka pliku skopiowana."]};
const viewerExplorerCopy = {"EN": ["Show in File Explorer", "File Explorer opened with the file selected.", "Could not open File Explorer. Refresh the archive if the file was moved."], "HU": ["Megnyitás az Intézőben", "Az Intéző megnyílt, benne a kijelölt fájllal.", "Nem sikerült megnyitni az Intézőt. Ha a fájlt áthelyezted, frissítsd az archívumot."], "DE": ["Im Datei-Explorer anzeigen", "Datei-Explorer mit ausgewählter Datei geöffnet.", "Datei-Explorer konnte nicht geöffnet werden. Bei verschobener Datei das Archiv aktualisieren."], "FR": ["Afficher dans l’Explorateur", "Explorateur ouvert avec le fichier sélectionné.", "Impossible d’ouvrir l’Explorateur. Actualisez l’archive si le fichier a été déplacé."], "ES": ["Mostrar en el Explorador", "Explorador abierto con el archivo seleccionado.", "No se pudo abrir el Explorador. Actualiza el archivo si el fichero se ha movido."], "IT": ["Mostra in Esplora file", "Esplora file aperto con il file selezionato.", "Impossibile aprire Esplora file. Aggiorna l’archivio se il file è stato spostato."], "PT": ["Mostrar no Explorador", "Explorador aberto com o ficheiro selecionado.", "Não foi possível abrir o Explorador. Atualize o arquivo se o ficheiro foi movido."], "PL": ["Pokaż w Eksploratorze", "Eksplorator otwarty z zaznaczonym plikiem.", "Nie udało się otworzyć Eksploratora. Odśwież archiwum, jeśli plik przeniesiono."]};
const viewerToolbar = `<div class="catalog-viewer-toolbar">
  <div class="catalog-viewer-navigation"><button type="button" data-viewer-prev></button><span data-viewer-position></span><button type="button" data-viewer-next></button></div>
  <label class="catalog-viewer-select"><input type="checkbox" data-viewer-mark><span data-viewer-select-label></span></label>
  <div class="catalog-viewer-stars" data-viewer-stars></div><button type="button" data-viewer-clear></button>
  <select data-viewer-category></select><button type="button" data-viewer-delete></button>
  <button type="button" data-viewer-copy-path></button>
  <button type="button" data-viewer-reveal-file></button>
  <span data-viewer-status role="status"></span>
</div>`;
const viewerPrompt = `<section class="catalog-viewer-prompt">
  <strong data-viewer-positive-title></strong><pre data-viewer-positive></pre><button type="button" class="quiet-action" data-viewer-copy-positive></button>
  <strong data-viewer-negative-title></strong><pre data-viewer-negative></pre><button type="button" class="quiet-action" data-viewer-copy-negative></button>
  <div class="catalog-viewer-copy-actions"><button type="button" data-viewer-copy-prompt></button><button type="button" data-viewer-copy-recipe></button><button type="button" data-viewer-passport-open></button><button type="button" data-viewer-ask-ai></button><button type="button" data-viewer-workbench></button></div>
  <section class="catalog-passport" data-viewer-passport-panel hidden>
    <p data-viewer-passport-review></p><p data-viewer-passport-missing></p><p data-viewer-passport-warning hidden></p>
    <textarea data-viewer-passport-text rows="15" spellcheck="false"></textarea>
    <button type="button" data-viewer-passport-copy></button>
    <div class="catalog-passport-suggestion">
      <p data-viewer-passport-help></p>
      <button type="button" data-viewer-passport-suggest></button>
      <p data-viewer-passport-suggest-status role="status" aria-live="polite"></p>
      <textarea data-viewer-passport-suggested-text rows="12" spellcheck="false" hidden></textarea>
      <button type="button" data-viewer-passport-copy-suggestion hidden></button>
    </div>
  </section>
</section>`;

const journalCopy={
  EN:{journal:"Experiment journal",help:"Saved A/B decisions stay in this browser. Export a JSON backup before changing browsers or computers. Original media files are untouched.",empty:"No experiments saved yet.",export:"Export journal",import:"Import journal",title:"Experiment name (optional)",preferred:"Which result worked better?",none:"Not decided",a:"A worked better",b:"B worked better",tie:"Both / tie",reason:"What worked, and why? (optional)",timeA:"Generation time A, minutes (optional)",timeB:"Generation time B, minutes (optional)",save:"Save this comparison",saved:"Experiment saved.",failed:"Could not save the journal. Export or free browser storage.",imported:"Journal imported.",badFile:"Could not import this journal file.",open:"Open A/B again",missing:"One or both files are no longer indexed. The saved notes remain.",remove:"Remove journal entry",confirm:"Remove this experiment note? The original media files will not be deleted.",changed:"Changed settings",unchanged:"No verified setting difference",prompt:"Prompt",preferredLabel:"Preferred",reasonLabel:"Reason",minutes:"Generation time (min)",local:"This journal is stored in this browser.",loading:"Opening the saved pair…"},
  HU:{journal:"Kísérleti napló",help:"A mentett A/B döntéseid ebben a böngészőben maradnak. Gépcsere előtt készíts JSON-mentést. Az eredeti médiafájlok változatlanok.",empty:"Még nincs mentett kísérlet.",export:"Napló mentése JSON-ba",import:"Napló betöltése",title:"Kísérlet neve (nem kötelező)",preferred:"Melyik eredmény vált be jobban?",none:"Még nem döntöttem",a:"A sikerült jobban",b:"B sikerült jobban",tie:"Mindkettő / döntetlen",reason:"Mi működött és miért? (nem kötelező)",timeA:"A generálási ideje percben (ha tudod)",timeB:"B generálási ideje percben (ha tudod)",save:"Összevetés mentése",saved:"A kísérlet elmentve.",failed:"Nem sikerült elmenteni a naplót. Készíts mentést, vagy szabadíts fel böngészőtárhelyet.",imported:"A napló betöltve.",badFile:"Nem sikerült beolvasni ezt a naplófájlt.",open:"A/B ismételt megnyitása",missing:"Az egyik vagy mindkét fájl már nincs az indexben. A mentett jegyzet megmarad.",remove:"Naplóbejegyzés törlése",confirm:"Törlöd ezt a naplóbejegyzést? Az eredeti médiafájlokat nem érinti.",changed:"Megváltozott beállítások",unchanged:"Nincs biztosan kiolvasható beállításkülönbség",prompt:"Prompt",preferredLabel:"Jobb eredmény",reasonLabel:"Indoklás",minutes:"Generálási idő (perc)",local:"A napló ebben a böngészőben tárolódik.",loading:"A mentett pár megnyitása…"},
  DE:{journal:"Versuchsprotokoll",help:"A/B-Notizen bleiben in diesem Browser; vor einem Gerätewechsel JSON exportieren.",empty:"Noch keine Versuche.",export:"Protokoll exportieren",import:"Protokoll importieren",title:"Versuchsname",preferred:"Besseres Ergebnis?",none:"Unentschieden",a:"A",b:"B",tie:"Beide",reason:"Was funktionierte und warum?",timeA:"Erstellungszeit A (Minuten)",timeB:"Erstellungszeit B (Minuten)",save:"Vergleich speichern",saved:"Gespeichert.",failed:"Speichern fehlgeschlagen.",imported:"Importiert.",badFile:"Import fehlgeschlagen.",open:"A/B erneut öffnen",missing:"Dateien fehlen im Index; Notiz bleibt.",remove:"Notiz löschen",confirm:"Nur diese Notiz löschen?",changed:"Geänderte Einstellungen",unchanged:"Keine sichere Änderung",prompt:"Prompt",preferredLabel:"Bevorzugt",reasonLabel:"Grund",minutes:"Erstellungszeit (Minuten)",local:"Lokal im Browser.",loading:"Paar öffnen…"},
  FR:{journal:"Journal d'essais",help:"Les notes A/B restent dans ce navigateur ; exportez le JSON avant de changer d'appareil.",empty:"Aucun essai enregistré.",export:"Exporter",import:"Importer",title:"Nom de l'essai",preferred:"Meilleur résultat ?",none:"Indécis",a:"A",b:"B",tie:"Les deux",reason:"Qu'est-ce qui a marché, et pourquoi ?",timeA:"Temps de génération A (min)",timeB:"Temps de génération B (min)",save:"Enregistrer",saved:"Essai enregistré.",failed:"Enregistrement impossible.",imported:"Journal importé.",badFile:"Import impossible.",open:"Rouvrir A/B",missing:"Fichiers absents de l'index ; la note reste.",remove:"Supprimer la note",confirm:"Supprimer uniquement cette note ?",changed:"Paramètres modifiés",unchanged:"Aucun écart vérifié",prompt:"Prompt",preferredLabel:"Préféré",reasonLabel:"Pourquoi",minutes:"Génération (min)",local:"Dans ce navigateur.",loading:"Ouverture…"},
  ES:{journal:"Diario de pruebas",help:"Las notas A/B quedan en este navegador; exporta el JSON antes de cambiar de equipo.",empty:"Aún no hay pruebas.",export:"Exportar",import:"Importar",title:"Nombre de la prueba",preferred:"¿Cuál salió mejor?",none:"Sin decidir",a:"A",b:"B",tie:"Ambos",reason:"¿Qué funcionó y por qué?",timeA:"Tiempo de generación A (min)",timeB:"Tiempo de generación B (min)",save:"Guardar comparación",saved:"Prueba guardada.",failed:"No se pudo guardar.",imported:"Diario importado.",badFile:"Importación fallida.",open:"Abrir A/B otra vez",missing:"Faltan archivos del índice; la nota permanece.",remove:"Borrar nota",confirm:"¿Borrar solo esta nota?",changed:"Ajustes cambiados",unchanged:"Sin diferencia verificada",prompt:"Prompt",preferredLabel:"Preferido",reasonLabel:"Motivo",minutes:"Generación (min)",local:"En este navegador.",loading:"Abriendo…"},
  IT:{journal:"Diario delle prove",help:"Le note A/B restano nel browser; esporta il JSON prima di cambiare computer.",empty:"Nessuna prova salvata.",export:"Esporta",import:"Importa",title:"Nome della prova",preferred:"Risultato migliore?",none:"Non deciso",a:"A",b:"B",tie:"Entrambi",reason:"Cosa ha funzionato e perché?",timeA:"Tempo di generazione A (min)",timeB:"Tempo di generazione B (min)",save:"Salva confronto",saved:"Prova salvata.",failed:"Salvataggio fallito.",imported:"Diario importato.",badFile:"Importazione fallita.",open:"Riapri A/B",missing:"File assenti dall'indice; nota conservata.",remove:"Elimina nota",confirm:"Eliminare solo questa nota?",changed:"Impostazioni cambiate",unchanged:"Nessuna differenza verificata",prompt:"Prompt",preferredLabel:"Preferito",reasonLabel:"Motivo",minutes:"Generazione (min)",local:"In questo browser.",loading:"Apertura…"},
  PT:{journal:"Diário de testes",help:"As notas A/B ficam neste navegador; exporte JSON antes de mudar de computador.",empty:"Sem testes guardados.",export:"Exportar",import:"Importar",title:"Nome do teste",preferred:"Melhor resultado?",none:"Por decidir",a:"A",b:"B",tie:"Ambos",reason:"O que funcionou e porquê?",timeA:"Tempo de geração A (min)",timeB:"Tempo de geração B (min)",save:"Guardar comparação",saved:"Teste guardado.",failed:"Não foi possível guardar.",imported:"Diário importado.",badFile:"Falha na importação.",open:"Abrir A/B novamente",missing:"Ficheiros ausentes do índice; nota mantida.",remove:"Apagar nota",confirm:"Apagar apenas esta nota?",changed:"Definições alteradas",unchanged:"Sem diferença verificada",prompt:"Prompt",preferredLabel:"Preferido",reasonLabel:"Motivo",minutes:"Geração (min)",local:"Neste navegador.",loading:"A abrir…"},
  PL:{journal:"Dziennik prób",help:"Notatki A/B są w tej przeglądarce; przed zmianą komputera wyeksportuj JSON.",empty:"Brak zapisanych prób.",export:"Eksportuj",import:"Importuj",title:"Nazwa próby",preferred:"Który wynik lepszy?",none:"Nie wybrano",a:"A",b:"B",tie:"Oba",reason:"Co zadziałało i dlaczego?",timeA:"Czas generowania A (min)",timeB:"Czas generowania B (min)",save:"Zapisz porównanie",saved:"Zapisano.",failed:"Nie udało się zapisać.",imported:"Zaimportowano.",badFile:"Import nieudany.",open:"Otwórz A/B ponownie",missing:"Plików brak w indeksie; notatka pozostała.",remove:"Usuń notatkę",confirm:"Usunąć tylko tę notatkę?",changed:"Zmienione ustawienia",unchanged:"Brak potwierdzonej różnicy",prompt:"Prompt",preferredLabel:"Lepszy",reasonLabel:"Powód",minutes:"Generowanie (min)",local:"W tej przeglądarce.",loading:"Otwieranie…"}
};
journalCopy.EN.search="Search experiments";
journalCopy.HU.search="Keresés a kísérletekben";
const learningCopy={
  EN:{heading:"What did this comparison teach us?",choose:"Choose which result worked better to get a focused next test.",observed:"You preferred {winner}. Readable differences: {fields}. This records an observation, not the cause of the visual result.",one:"Only one readable difference was found, but hidden factors may still matter.",many:"Several settings changed or some important data is missing; the cause cannot be isolated from this pair.",none:"No reliable difference was found in the readable fields.",nextLabel:"One next experiment (editable)",nextTemplate:"Use {base} as the baseline. In two new runs keep the same model, seed and all other settings; change only {field} to the value from {other}. Compare the feature you preferred.",noSafe:"No safe one-variable change can be proposed from these readable values. Choose one compatible setting yourself and hold the rest fixed.",journalNext:"Next experiment"},
  HU:{heading:"Mit tanultunk ebből?",choose:"Jelöld meg, melyik eredmény tetszett jobban, és kapsz egy célzott következő próbát.",observed:"A {winner} eredményt választottad. Kiolvasható eltérések: {fields}. Ez megfigyelés, nem bizonyíték arra, mitől lett jobb a látvány.",one:"Csak egy kiolvasható eltérés látszik, de rejtett tényezők is számíthatnak.",many:"Több beállítás változott, vagy fontos adat hiányzik; ebből a párból nem dönthető el az ok.",none:"A kiolvasható adatokban nincs biztos eltérés.",nextLabel:"Egy következő kísérlet (szerkeszthető)",nextTemplate:"Indulj ki a {base} eredményből. Két új futásnál tartsd azonosan a modellt, a seedet és minden más beállítást; csak ezt változtasd a {other} értékére: {field}. Figyeld meg, megmarad-e az a tulajdonság, ami jobban tetszett.",noSafe:"A kiolvasható adatokból nem javasolható biztonsággal egyetlen változó. Válassz egy összeillő beállítást, és minden mást tarts változatlanul.",journalNext:"Következő próba"},
  DE:{heading:"Was haben wir gelernt?",choose:"Wählen Sie das bessere Ergebnis für einen gezielten nächsten Test.",observed:"Sie bevorzugen {winner}. Lesbare Unterschiede: {fields}. Das ist eine Beobachtung, keine Ursache.",one:"Nur ein lesbarer Unterschied; verborgene Faktoren bleiben möglich.",many:"Mehrere Werte änderten sich oder wichtige Daten fehlen; die Ursache ist nicht isolierbar.",none:"Keine sichere Änderung in den lesbaren Daten.",nextLabel:"Ein nächster Versuch (bearbeitbar)",nextTemplate:"Nehmen Sie {base} als Ausgangspunkt. Halten Sie in zwei neuen Durchläufen Modell, Seed und alle übrigen Werte gleich; ändern Sie nur {field} auf den Wert von {other}. Vergleichen Sie das bevorzugte Merkmal.",noSafe:"Aus diesen Daten ist kein sicherer Einzeltest ableitbar. Wählen Sie selbst eine kompatible Einstellung.",journalNext:"Nächster Versuch"},
  FR:{heading:"Qu'avons-nous appris ?",choose:"Choisissez le résultat préféré pour proposer un prochain essai ciblé.",observed:"Vous préférez {winner}. Différences lisibles : {fields}. C'est une observation, pas une cause démontrée.",one:"Une seule différence lisible, mais d'autres facteurs peuvent intervenir.",many:"Plusieurs paramètres ont changé ou des données manquent ; la cause ne peut pas être isolée.",none:"Aucune différence fiable dans les données lisibles.",nextLabel:"Prochain essai (modifiable)",nextTemplate:"Prenez {base} comme base. Dans deux nouveaux essais, gardez le même modèle, seed et tous les autres réglages ; changez seulement {field} selon la valeur de {other}. Comparez l'aspect préféré.",noSafe:"Aucun essai à variable unique fiable ne peut être proposé. Choisissez un réglage compatible.",journalNext:"Prochain essai"},
  ES:{heading:"¿Qué aprendimos?",choose:"Elige el resultado preferido para obtener una prueba concreta.",observed:"Prefieres {winner}. Diferencias legibles: {fields}. Es una observación, no una causa demostrada.",one:"Solo hay una diferencia legible, pero puede haber factores ocultos.",many:"Cambian varios ajustes o faltan datos; no se puede aislar la causa.",none:"No hay diferencias fiables en los datos legibles.",nextLabel:"Siguiente prueba (editable)",nextTemplate:"Usa {base} como base. En dos nuevas generaciones mantén iguales modelo, semilla y demás ajustes; cambia solo {field} al valor de {other}. Compara el rasgo preferido.",noSafe:"No se puede sugerir una prueba segura de una variable. Elige un ajuste compatible.",journalNext:"Siguiente prueba"},
  IT:{heading:"Che cosa abbiamo imparato?",choose:"Scegli il risultato migliore per una prova mirata.",observed:"Preferisci {winner}. Differenze leggibili: {fields}. È un'osservazione, non una causa dimostrata.",one:"Una sola differenza leggibile, ma possono esserci fattori nascosti.",many:"Sono cambiati più parametri o mancano dati; la causa non è isolabile.",none:"Nessuna differenza affidabile nei dati leggibili.",nextLabel:"Prossima prova (modificabile)",nextTemplate:"Usa {base} come base. In due nuove prove mantieni uguali modello, seed e tutte le altre impostazioni; cambia solo {field} al valore di {other}. Confronta la qualità preferita.",noSafe:"Non è possibile proporre una prova sicura con una variabile. Scegli un'impostazione compatibile.",journalNext:"Prossima prova"},
  PT:{heading:"O que aprendemos?",choose:"Escolha o melhor resultado para uma próxima prova focada.",observed:"Prefere {winner}. Diferenças legíveis: {fields}. É uma observação, não uma causa comprovada.",one:"Só uma diferença legível, mas podem existir fatores ocultos.",many:"Várias definições mudaram ou faltam dados; a causa não pode ser isolada.",none:"Sem diferença fiável nos dados legíveis.",nextLabel:"Próxima prova (editável)",nextTemplate:"Use {base} como base. Em duas novas execuções mantenha modelo, seed e restantes definições iguais; altere apenas {field} para o valor de {other}. Compare o aspeto preferido.",noSafe:"Não é possível propor uma prova segura de uma variável. Escolha uma definição compatível.",journalNext:"Próxima prova"},
  PL:{heading:"Czego się nauczyliśmy?",choose:"Wybierz lepszy wynik, aby otrzymać jeden następny test.",observed:"Wybierasz {winner}. Odczytane różnice: {fields}. To obserwacja, nie dowód przyczyny.",one:"Tylko jedna odczytana różnica, ale mogą istnieć ukryte czynniki.",many:"Zmieniło się kilka ustawień lub brakuje danych; nie można wskazać przyczyny.",none:"Brak pewnej różnicy w odczytanych danych.",nextLabel:"Następna próba (edytowalna)",nextTemplate:"Użyj {base} jako punktu wyjścia. W dwóch nowych próbach zachowaj ten sam model, seed i inne ustawienia; zmień tylko {field} na wartość z {other}. Porównaj preferowaną cechę.",noSafe:"Nie można bezpiecznie zaproponować próby z jedną zmienną. Wybierz zgodne ustawienie.",journalNext:"Następna próba"}
};
export function attachMediaCatalog({ getLanguage, getCurrent, restore, onLinkVideo, getLinkVideoLabel, onCreativeCapture, onCreativeRemix, getCreativeLabels, onPublicationCapture, getPublicationLabel, onTrialCapture, getTrialLabel }) {
  const host = document.querySelector(".result-column");
  const panel = document.createElement("section"); panel.className = "media-catalog result-card"; panel.id="media-catalog";
  panel.innerHTML = `<div class="result-heading"><div><span class="eyebrow">ARCHIVE / 02</span><h2 id="catalog-title"></h2></div><span class="result-spark">⌕</span></div>
    <div class="catalog-body"><p id="catalog-intro"></p><div id="catalog-roots" class="catalog-roots"></div>
      <div class="catalog-add"><input id="catalog-root-input" maxlength="400"><button type="button" id="catalog-add-root" class="quiet-action"></button></div>
      <p id="catalog-root-help" class="catalog-root-help"></p><button type="button" id="catalog-scan" class="secondary-action"></button><button type="button" id="catalog-scan-cancel" class="secondary-action" hidden></button><p id="catalog-progress" role="status" aria-live="polite"></p>
      <label class="catalog-thumbnail-toggle"><input id="catalog-auto-scan" type="checkbox"><span id="catalog-auto-scan-label"></span></label>
      <label class="catalog-thumbnail-toggle"><input id="catalog-show-thumbnails" type="checkbox"><span id="catalog-show-thumbnails-label"></span></label>
      <div class="catalog-compare-picker"><strong id="catalog-compare-picker-title"></strong><span id="catalog-compare-slot-a"></span><span id="catalog-compare-slot-b"></span>
        <button type="button" id="catalog-compare-open" class="secondary-action" disabled></button><button type="button" id="catalog-compare-clear" class="quiet-action"></button></div>
      <details id="catalog-journal" class="catalog-journal"><summary id="catalog-journal-summary"></summary>
        <p id="catalog-journal-help"></p><input id="catalog-journal-query" type="search"><div class="catalog-journal-tools">
          <button type="button" id="catalog-journal-export" class="quiet-action"></button>
          <button type="button" id="catalog-journal-import" class="quiet-action"></button>
          <input id="catalog-journal-file" type="file" accept=".json,application/json" hidden>
        </div><p id="catalog-journal-status" role="status"></p><div id="catalog-journal-list"></div></details>
      <details id="catalog-cleanup" class="catalog-journal"><summary id="catalog-cleanup-title"></summary>
        <p id="catalog-cleanup-help"></p><div class="catalog-actions"><button type="button" id="catalog-cleanup-start"></button><button type="button" id="catalog-cleanup-cancel" hidden></button></div>
        <div id="catalog-cleanup-batch-tools" class="catalog-cleanup-batch-tools" hidden>
          <strong id="catalog-cleanup-selected-count"></strong>
          <button type="button" id="catalog-cleanup-select-page" class="quiet-action"></button>
          <button type="button" id="catalog-cleanup-select-all" class="quiet-action"></button>
          <button type="button" id="catalog-cleanup-clear-selection" class="quiet-action"></button>
          <label><span id="catalog-cleanup-keep-label"></span><select id="catalog-cleanup-keep-rule"><option value="rating"></option><option value="oldest"></option><option value="newest"></option></select></label>
          <button type="button" id="catalog-cleanup-auto-select" class="quiet-action"></button>
          <button type="button" id="catalog-cleanup-batch-review" class="secondary-action"></button>
        </div>
        <p id="catalog-cleanup-status" role="status" aria-live="polite"></p>
        <div class="catalog-cleanup-view-tools"><button type="button" id="catalog-cleanup-view-toggle" class="quiet-action"></button></div>
        <div id="catalog-cleanup-results" class="catalog-results"></div>
        <div class="catalog-pager"><button type="button" id="catalog-cleanup-prev" class="quiet-action"></button><span id="catalog-cleanup-page"></span><button type="button" id="catalog-cleanup-next" class="quiet-action"></button></div>
      </details>
      <div class="catalog-filters"><input id="catalog-query" type="search" maxlength="200"><select id="catalog-kind"></select><select id="catalog-prompt-filter"></select><select id="catalog-root"></select></div>
      <div class="catalog-date-filters"><span id="catalog-date-heading"></span><select id="catalog-date-preset"></select><label><span id="catalog-date-from-label"></span><input id="catalog-date-from" type="date"></label><label><span id="catalog-date-to-label"></span><input id="catalog-date-to" type="date"></label></div>
      <div class="catalog-organize"><select id="catalog-category-filter"></select><select id="catalog-rating-filter"></select>
        <input id="catalog-new-category" maxlength="50"><button type="button" id="catalog-add-category" class="quiet-action"></button></div>
      <div id="catalog-gallery-toolbar" class="catalog-gallery-toolbar"><button type="button" id="catalog-gallery-toggle" class="quiet-action"></button><div id="catalog-gallery-day-controls" class="catalog-gallery-day-controls" hidden><button type="button" id="catalog-gallery-prev-day" class="quiet-action"></button><label><span id="catalog-gallery-day-label"></span><input id="catalog-gallery-day" type="date"></label><button type="button" id="catalog-gallery-next-day" class="quiet-action"></button><span id="catalog-gallery-hint"></span></div></div>
      <p id="catalog-count"></p><p id="catalog-marked-count"></p>
      <div id="catalog-pager-top" class="catalog-pager catalog-pager-top"><button type="button" id="catalog-first-top" class="quiet-action" hidden></button><button type="button" id="catalog-prev-top" class="quiet-action"></button><span id="catalog-page-top"></span><button type="button" id="catalog-next-top" class="quiet-action"></button><button type="button" id="catalog-last-top" class="quiet-action" hidden></button></div>
      <div id="catalog-results" class="catalog-results"></div>
      <div id="catalog-pager" class="catalog-pager"><button type="button" id="catalog-first" class="quiet-action" hidden></button><button type="button" id="catalog-prev" class="quiet-action"></button><span id="catalog-page"></span><button type="button" id="catalog-next" class="quiet-action"></button><button type="button" id="catalog-last" class="quiet-action" hidden></button></div></div>
    <dialog id="catalog-delete-dialog" class="catalog-delete-dialog" aria-labelledby="catalog-delete-title">
      <h3 id="catalog-delete-title"></h3><p id="catalog-delete-explanation"></p><ul id="catalog-delete-files"></ul>
      <label class="catalog-delete-ack"><input id="catalog-delete-ack" type="checkbox"><span id="catalog-delete-ack-label"></span></label>
      <p id="catalog-delete-error" role="alert"></p><div class="catalog-delete-actions">
        <button type="button" id="catalog-delete-cancel"></button><button type="button" id="catalog-delete-trash"></button><button type="button" id="catalog-delete-permanent"></button>
      </div></dialog>
    <dialog id="catalog-cleanup-batch-dialog" class="catalog-delete-dialog" aria-labelledby="catalog-cleanup-batch-title">
      <h3 id="catalog-cleanup-batch-title"></h3><p id="catalog-cleanup-batch-intro"></p>
      <p id="catalog-cleanup-batch-protected" hidden></p>
      <strong id="catalog-cleanup-batch-count"></strong><ul id="catalog-cleanup-batch-files"></ul>
      <label class="catalog-delete-ack"><input id="catalog-cleanup-batch-ack" type="checkbox"><span id="catalog-cleanup-batch-ack-label"></span></label>
      <p id="catalog-cleanup-batch-error" role="alert"></p><div class="catalog-delete-actions">
        <button type="button" id="catalog-cleanup-batch-cancel"></button>
        <button type="button" id="catalog-cleanup-batch-trash"></button>
        <button type="button" id="catalog-cleanup-batch-permanent"></button>
      </div></dialog>
    <dialog id="catalog-image-dialog" class="catalog-image-dialog" aria-labelledby="catalog-image-title">
      <div class="catalog-image-heading"><h3 id="catalog-image-title"></h3><button type="button" id="catalog-image-close"></button></div>
      <img id="catalog-image-large" alt=""><p id="catalog-image-error" role="alert"></p>
      ${viewerToolbar}<section class="catalog-viewer-tech" data-viewer-tech></section>${viewerPrompt}
      <div class="catalog-image-actions"><button type="button" id="catalog-image-open"></button></div>
    </dialog>
    <dialog id="catalog-video-dialog" class="catalog-video-dialog" aria-labelledby="catalog-video-title">
      <div class="catalog-image-heading"><h3 id="catalog-video-title"></h3><button type="button" id="catalog-video-close"></button></div>
      <video id="catalog-video-player" controls playsinline preload="metadata"></video><p id="catalog-video-hint"></p>
      ${viewerToolbar}<section class="catalog-viewer-tech" data-viewer-tech></section>${viewerPrompt}
    </dialog>
    <dialog id="catalog-compare-dialog" class="catalog-compare-dialog" aria-labelledby="catalog-compare-title">
      <div class="catalog-image-heading"><h3 id="catalog-compare-title"></h3><button type="button" id="catalog-compare-close"></button></div>
      <div class="catalog-compare-media"><section><strong id="catalog-compare-name-a"></strong><div id="catalog-compare-media-a"></div></section>
        <section><strong id="catalog-compare-name-b"></strong><div id="catalog-compare-media-b"></div></section></div>
      <div class="catalog-compare-controls"><button type="button" id="catalog-compare-reveal"></button><button type="button" id="catalog-compare-play" hidden></button><button type="button" id="catalog-compare-pause" hidden></button></div>
      <h4 id="catalog-compare-facts-title"></h4><div id="catalog-compare-facts"></div>
      <h4 id="catalog-compare-tradeoffs-title"></h4><ul id="catalog-compare-tradeoffs"></ul>
      <h4 id="catalog-compare-visual-title"></h4><button type="button" id="catalog-compare-visual-run"></button><p id="catalog-compare-visual-status" role="status"></p>
      <div id="catalog-compare-visual-result"></div><p id="catalog-compare-disclaimer"></p>
      <section class="catalog-experiment-save"><h4 id="catalog-experiment-heading"></h4>
        <input id="catalog-experiment-title" maxlength="120">
        <select id="catalog-experiment-preferred"></select>
        <textarea id="catalog-experiment-reason" maxlength="1200" rows="3"></textarea>
        <div class="catalog-learning-plan" aria-live="polite">
          <h5 id="catalog-learning-heading"></h5>
          <p id="catalog-learning-summary"></p>
          <p id="catalog-learning-caution"></p>
          <label id="catalog-learning-next-label" for="catalog-experiment-next-test"></label>
          <textarea id="catalog-experiment-next-test" maxlength="1200" rows="3"></textarea>
        </div>
        <div class="catalog-experiment-times"><input id="catalog-experiment-time-a" type="number" min="0" max="10000" step="0.01">
          <input id="catalog-experiment-time-b" type="number" min="0" max="10000" step="0.01"></div>
        <button type="button" id="catalog-experiment-save" class="secondary-action"></button><p id="catalog-experiment-status" role="status"></p>
      </section>
    </dialog>`;
  host.insertBefore(panel, host.querySelector(".side-tip"));
  const el = (id) => panel.querySelector(`#${id}`), t = () => ({ ...catalogCopy.EN, ...catalogPromptCopy.EN, ...catalogOrganizeCopy.EN,
    ...catalogDateCopy.EN, ...catalogGalleryCopy.EN, ...catalogPageJumpCopy.EN, ...(catalogCopy[getLanguage()] || {}), ...(catalogPromptCopy[getLanguage()] || {}), ...(catalogOrganizeCopy[getLanguage()] || {}), ...(catalogDateCopy[getLanguage()] || {}), ...(catalogGalleryCopy[getLanguage()] || {}), ...(catalogPageJumpCopy[getLanguage()] || {}) });
  const td = () => ({ ...catalogDeleteCopy.EN, ...(catalogDeleteCopy[getLanguage()] || {}) });
  const rootText=()=>catalogRootLabels(getLanguage());
  const rootControlText=()=>catalogRootControlLabels(getLanguage());
  const query = el("catalog-query"), kind = el("catalog-kind"), root = el("catalog-root"), promptFilter = el("catalog-prompt-filter"),
    categoryFilter = el("catalog-category-filter"), ratingFilter = el("catalog-rating-filter"), results = el("catalog-results");
  const datePreset=el("catalog-date-preset"), dateFrom=el("catalog-date-from"), dateTo=el("catalog-date-to");
  const galleryToggle=el("catalog-gallery-toggle"), galleryDay=el("catalog-gallery-day"), galleryControls=el("catalog-gallery-day-controls");
  const autoScanToggle=el("catalog-auto-scan"), autoScanIntervalMs=15*60*1000;
  const autoScanStorageKey="artoftomworks.v2.catalogAutoScan";
  try { autoScanToggle.checked=localStorage.getItem(autoScanStorageKey)!=="false"; }
  catch { autoScanToggle.checked=true; }
  const deleteDialog = el("catalog-delete-dialog");
  const imageDialog = el("catalog-image-dialog");
  const videoDialog = el("catalog-video-dialog");
  const compareDialog = el("catalog-compare-dialog");
  const ti = () => ({ ...catalogImageCopy.EN, ...(catalogImageCopy[getLanguage()] || {}) });
  const tp = () => ({ ...catalogPrivacyCopy.EN, ...(catalogPrivacyCopy[getLanguage()] || {}) });
  const tb = () => ({ ...catalogBridgeCopy.EN, ...(catalogBridgeCopy[getLanguage()] || {}) });
  const tv = () => ({ ...catalogVideoCopy.EN, ...(catalogVideoCopy[getLanguage()] || {}) });
  const tc = () => ({ ...catalogCompareCopy.EN, ...(catalogCompareCopy[getLanguage()] || {}) });
  const tj = () => ({ ...journalCopy.EN, ...(journalCopy[getLanguage()] || {}) });
  const tl = () => ({ ...learningCopy.EN, ...(learningCopy[getLanguage()] || {}) });
  const tw = () => ({ ...catalogViewerCopy.EN, ...(catalogViewerCopy[getLanguage()] || {}) });
  const tr = () => recipeLabels(getLanguage());
  let status = null, page = 0, total = 0, timer = null, delay = null, deletionPlan = null, deleteBusy = false, deletePreparing = false, previewItem = null;
  let scanRequestPending=false, scanMonitorActive=false, pendingCatalogRefresh=false, nextAutoScanAt=Date.now()+autoScanIntervalMs;
  let galleryMode=false, savedDateFilter=null, searchRevision=0;
  let galleryActions=null;
  let rootChangePending=false;
  let visibleItems = [], viewerItem = null, viewerIndex = 0, viewerBusy = false, standaloneSource=false,sourceLookupRevision=0;
  let viewerReturn = null;
  let passportController = null, passportRevision = 0;
  const marked = new Set();
  const selected = { A:null, B:null };
  let compareVisible = false, compareRevision = 0, compareBusy = false, visualController = null;
  let learningNextManual=false;
  const api = async (path, options) => {
    const response = await fetch(path,options);
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || String(response.status));
    return response.json();
  };
  const mediaUrl = (item) => `/api/catalog/media?id=${encodeURIComponent(item.id)}`;
  const cleanupT = () => catalogCleanupCopy[getLanguage()] || catalogCleanupCopy.EN;
  const cleanupB = () => cleanupBatchCopy[getLanguage()] || cleanupBatchCopy.EN;
  const cleanupG = () => cleanupGalleryCopy[getLanguage()] || cleanupGalleryCopy.EN;
  let cleanupPage=0, cleanupTotal=0, cleanupScanStatus=null, cleanupRows=[], cleanupTimer=null;
  let cleanupSelected=new Set(), cleanupFinishedAt=null, cleanupBatchPlan=null, cleanupBatchBusy=false;
  const cleanupGalleryStorageKey="artoftomworks.v2.cleanupGalleryView";
  let cleanupGalleryMode=true;
  try { cleanupGalleryMode=localStorage.getItem(cleanupGalleryStorageKey)!=="list"; } catch {}
  const cleanupBatchDialog=el("catalog-cleanup-batch-dialog");
  function cleanupBatchMessage(error) {
    const message=String(error?.message || error);
    return /Keep at least one|remaining copy/.test(message) ? cleanupB().keepError : message;
  }
  function renderCleanup() {
    const labels=cleanupT();
    const batch=cleanupB();
    for (const [id,key] of [["catalog-cleanup-title","title"],["catalog-cleanup-help","help"],["catalog-cleanup-start","start"],
      ["catalog-cleanup-cancel","cancel"],["catalog-cleanup-prev","previous"],["catalog-cleanup-next","next"]])
      el(id).textContent=labels[key];
    const s=cleanupScanStatus;
    for (const [id,key] of [["catalog-cleanup-select-page","page"],["catalog-cleanup-clear-selection","clear"],
      ["catalog-cleanup-keep-label","keep"],["catalog-cleanup-auto-select","auto"],["catalog-cleanup-batch-review","review"]])
      el(id).textContent=batch[key];
    for (const [value,key] of [["rating","rating"],["oldest","oldest"],["newest","newest"]])
      el("catalog-cleanup-keep-rule").querySelector('option[value="'+value+'"]').textContent=batch[key];
    el("catalog-cleanup-selected-count").textContent=cleanupSelected.size+" "+batch.selected;
    el("catalog-cleanup-select-all").textContent=(cleanupSelectAllCopy[getLanguage()] || cleanupSelectAllCopy.EN)[cleanupTotal>100?"first":"all"];
    el("catalog-cleanup-batch-tools").hidden=!s?.finishedAt || Boolean(s?.running || s?.message || !cleanupTotal);
    el("catalog-cleanup-batch-review").textContent="⚠ "+batch.review;
    el("catalog-cleanup-batch-review").disabled=!cleanupSelected.size;
    el("catalog-cleanup-clear-selection").disabled=!cleanupSelected.size;
    el("catalog-cleanup-start").disabled=Boolean(s?.running || status?.scan?.running);
    el("catalog-cleanup-cancel").hidden=!s?.running;
    let message=labels.idle;
    if (s?.running) message=labels.working + ": " + s.checked + " / " + s.total + " · " + labels.hashed + ": " + s.hashed + " / " + s.hashTotal;
    else if (s?.message === "cancelled") message=labels.cancelled;
    else if (s?.message) message=labels.error + " " + s.message;
    else if (s?.finishedAt) message=labels.done + " · " + labels.review + cleanupTotal + " · " +
      s.skippedRecent + " " + labels.recent + " · " + s.skippedChanged + " " + labels.changed +
      " · " + s.unreadable + " " + labels.unreadable;
    el("catalog-cleanup-status").textContent=message;
    const host=el("catalog-cleanup-results");
    el("catalog-cleanup-view-toggle").textContent=cleanupGalleryMode?cleanupG().list:cleanupG().gallery;
    el("catalog-cleanup-view-toggle").hidden=!s?.finishedAt || Boolean(s?.running || s?.message || !cleanupTotal);
    host.classList.toggle("catalog-cleanup-gallery-mode",cleanupGalleryMode);
    cleanupPosterObserver?.disconnect();
    host.replaceChildren();
    if (s?.finishedAt && !s.running && !s.message && cleanupTotal===0) {
      const empty=document.createElement("p"); empty.textContent=labels.none; host.append(empty);
    }
    for (const candidate of cleanupRows) {
      const item=candidate.item, row=document.createElement("div"); row.className="catalog-item catalog-cleanup-card";
      row.title=item.path;
      row.classList.toggle("catalog-cleanup-selected",cleanupSelected.has(item.id));
      row.classList.add(candidate.type==="duplicate"?"catalog-cleanup-duplicate":"catalog-cleanup-suspect");
      const choose=document.createElement("input"); choose.type="checkbox"; choose.className="catalog-cleanup-checkbox";
      choose.checked=cleanupSelected.has(item.id); choose.setAttribute("aria-label",batch.select+": "+item.filename);
      choose.addEventListener("change",() => {
        if (choose.checked && cleanupSelected.size>=100) {
          choose.checked=false; el("catalog-cleanup-status").textContent=batch.limit; return;
        }
        if (choose.checked) cleanupSelected.add(item.id); else cleanupSelected.delete(item.id);
        row.classList.toggle("catalog-cleanup-selected",choose.checked);
        el("catalog-cleanup-selected-count").textContent=cleanupSelected.size+" "+batch.selected;
        el("catalog-cleanup-batch-review").disabled=!cleanupSelected.size;
        el("catalog-cleanup-clear-selection").disabled=!cleanupSelected.size;
      });
      const media=document.createElement("div"); media.className="catalog-media";
      if (item.kind==="image") {
        const open=document.createElement("button"); open.type="button"; open.className="catalog-cleanup-thumbnail";
        open.setAttribute("aria-label",labels.preview+": "+item.filename);
        const image=document.createElement("img"); image.loading="lazy"; image.alt=item.filename; image.src=mediaUrl(item);
        image.addEventListener("error",() => { image.remove(); open.textContent="⚠"; });
        open.append(image); open.addEventListener("click",() => showImage(item)); media.append(open);
      } else {
        const open=document.createElement("button"); open.type="button"; open.className="catalog-cleanup-thumbnail";
        open.setAttribute("aria-label",labels.preview+": "+item.filename);
        const frame=document.createElement("img"); frame.alt=""; frame.hidden=true;
        const symbol=document.createElement("span"); symbol.className="catalog-cleanup-video-symbol"; symbol.textContent="▶";
        open.append(frame,symbol); open.addEventListener("click",() => showVideo(item)); media.append(open);
        queueCleanupPoster({item,image:frame,symbol,button:open});
      }
      const detail=document.createElement("div"); detail.className="catalog-detail";
      const title=document.createElement("strong"); title.textContent=(candidate.type==="duplicate" ? labels.duplicate : labels.suspect) +
        " · " + item.filename + (item.rating ? " · " + item.rating + "★" : "") + (item.category ? " · " + item.category : "");
      const reason=document.createElement("p");
      reason.textContent=candidate.type==="duplicate" ? labels.exact + " (" + candidate.groupSize + ")" : labels[candidate.reason] || labels.suspect;
      const path=document.createElement("small"); path.textContent=item.path; path.title=item.path;
      const actions=document.createElement("div"); actions.className="catalog-actions";
      const preview=document.createElement("button"); preview.type="button"; preview.textContent=labels.preview;
      preview.addEventListener("click",() => item.kind==="image" ? showImage(item) : showVideo(item));
      const remove=document.createElement("button"); remove.type="button"; remove.textContent=labels.remove;
      remove.addEventListener("click",() => { void openDelete(item); });
      actions.append(preview,remove); detail.append(title,reason,path,actions); row.append(choose,media,detail); host.append(row);
    }
    const pages=Math.max(1,Math.ceil(cleanupTotal/24));
    el("catalog-cleanup-page").textContent=labels.page + " " + (cleanupPage+1) + " / " + pages;
    el("catalog-cleanup-prev").disabled=cleanupPage===0;
    el("catalog-cleanup-next").disabled=(cleanupPage+1)*24>=cleanupTotal;
  }
  async function refreshCleanup() {
    if (cleanupTimer) { clearTimeout(cleanupTimer); cleanupTimer=null; }
    try {
      cleanupScanStatus=await api("/api/catalog/cleanup/status");
      if (cleanupFinishedAt!==cleanupScanStatus.finishedAt) {
        cleanupSelected.clear(); cleanupFinishedAt=cleanupScanStatus.finishedAt;
      }
      if (!cleanupScanStatus.running && cleanupScanStatus.finishedAt && !cleanupScanStatus.message) {
        let response=await api("/api/catalog/cleanup/results?page=" + cleanupPage);
        if (cleanupPage>0 && cleanupPage*24>=response.total) {
          cleanupPage=Math.max(0,Math.ceil(response.total/24)-1);
          response=await api("/api/catalog/cleanup/results?page=" + cleanupPage);
        }
        cleanupTotal=response.total; cleanupRows=response.results;
      } else { cleanupTotal=0; cleanupRows=[]; }
      renderCleanup();
      if (cleanupScanStatus.running) cleanupTimer=setTimeout(() => { void refreshCleanup(); },1200);
    } catch(error) { el("catalog-cleanup-status").textContent=cleanupT().error + " " + error.message; }
  }
  el("catalog-cleanup-start").addEventListener("click",async () => {
    try {
      const response=await api("/api/catalog/cleanup/start",{method:"POST",headers:{"X-Prompt-Studio-Action":"cleanup-review"}});
      if (response.changed) { cleanupPage=0; el("catalog-cleanup").open=true; }
      await refreshCleanup();
    } catch(error) { el("catalog-cleanup-status").textContent=cleanupT().error + " " + error.message; }
  });
  el("catalog-cleanup-cancel").addEventListener("click",async () => {
    try { await api("/api/catalog/cleanup/cancel",{method:"POST",headers:{"X-Prompt-Studio-Action":"cleanup-review"}}); await refreshCleanup(); }
    catch(error) { el("catalog-cleanup-status").textContent=cleanupT().error + " " + error.message; }
  });
  el("catalog-cleanup-prev").addEventListener("click",() => { if (cleanupPage>0) { cleanupPage--; void refreshCleanup(); } });
  el("catalog-cleanup-next").addEventListener("click",() => { if ((cleanupPage+1)*24<cleanupTotal) { cleanupPage++; void refreshCleanup(); } });
  el("catalog-cleanup-view-toggle").addEventListener("click",() => {
    cleanupGalleryMode=!cleanupGalleryMode;
    try { localStorage.setItem(cleanupGalleryStorageKey,cleanupGalleryMode?"gallery":"list"); } catch {}
    renderCleanup();
  });
  el("catalog-cleanup-select-page").addEventListener("click",() => {
    for (const candidate of cleanupRows) {
      if (cleanupSelected.size>=100) break;
      cleanupSelected.add(candidate.id);
    }
    renderCleanup();
    if (cleanupSelected.size>=100) el("catalog-cleanup-status").textContent=cleanupB().limit;
  });
  el("catalog-cleanup-select-all").addEventListener("click",async () => {
    const button=el("catalog-cleanup-select-all");
    const copy=cleanupSelectAllCopy[getLanguage()] || cleanupSelectAllCopy.EN;
    const generation=cleanupScanStatus?.generation;
    button.disabled=true;
    try {
      const total=cleanupTotal;
      const count=Math.min(100,total);
      const ids=[];
      for (let pageIndex=0; pageIndex<Math.ceil(count/24); pageIndex++) {
        const response=await api("/api/catalog/cleanup/results?page="+pageIndex);
        if (response.total!==total) throw new Error(copy.changed);
        ids.push(...response.results.map(row=>row.id));
      }
      const current=await api("/api/catalog/cleanup/status");
      if (current.running || current.message || current.generation!==generation || ids.length<count)
        throw new Error(copy.changed);
      cleanupSelected=new Set(ids.slice(0,100));
      renderCleanup();
      el("catalog-cleanup-status").textContent=total>100 ? copy.limited : copy.done;
    } catch(error) {
      await refreshCleanup();
      el("catalog-cleanup-status").textContent=error.message || copy.changed;
    } finally { button.disabled=false; }
  });
  el("catalog-cleanup-clear-selection").addEventListener("click",() => { cleanupSelected.clear(); renderCleanup(); });
  el("catalog-cleanup-auto-select").addEventListener("click",async () => {
    try {
      const rule=el("catalog-cleanup-keep-rule").value;
      const result=await api("/api/catalog/cleanup/auto-selection?keep="+encodeURIComponent(rule));
      cleanupSelected=new Set(result.ids); renderCleanup();
      el("catalog-cleanup-status").textContent=cleanupB().autoDone+
        (result.totalExtras>result.ids.length ? " "+cleanupB().limit : "");
    } catch(error) { el("catalog-cleanup-status").textContent=cleanupBatchMessage(error); }
  });
  function renderCleanupBatchDialog() {
    const b=cleanupB();
    for (const [id,key] of [["catalog-cleanup-batch-title","title"],["catalog-cleanup-batch-intro","intro"],
      ["catalog-cleanup-batch-ack-label","ack"],["catalog-cleanup-batch-cancel","cancel"],
      ["catalog-cleanup-batch-trash","trash"],["catalog-cleanup-batch-permanent","permanent"]])
      el(id).textContent=b[key];
    if (cleanupBatchPlan) {
      const protectedFiles=cleanupBatchPlan.protectedFiles || [];
      el("catalog-cleanup-batch-protected").hidden=!protectedFiles.length;
      el("catalog-cleanup-batch-protected").textContent=protectedFiles.length ?
        (cleanupProtectedCopy[getLanguage()] || cleanupProtectedCopy.EN)+" "+
        protectedFiles.map(file=>file.filename).join(", ") : "";
      el("catalog-cleanup-batch-count").textContent=b.count+": "+cleanupBatchPlan.count;
      el("catalog-cleanup-batch-files").replaceChildren(...cleanupBatchPlan.files.map(file => {
        const line=document.createElement("li"); line.textContent=file.path; return line;
      }));
    }
  }
  el("catalog-cleanup-batch-review").addEventListener("click",async () => {
    if (!cleanupSelected.size || cleanupBatchBusy) {
      if (!cleanupSelected.size) el("catalog-cleanup-status").textContent=cleanupB().empty;
      return;
    }
    try {
      cleanupBatchPlan=await api("/api/catalog/cleanup/batch-preview",{
        method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"cleanup-batch-preview"},
        body:JSON.stringify({ids:[...cleanupSelected],keep:el("catalog-cleanup-keep-rule").value})
      });
      cleanupSelected=new Set(cleanupBatchPlan.ids);
      renderCleanup();
      el("catalog-cleanup-batch-ack").checked=false;
      el("catalog-cleanup-batch-permanent").disabled=true;
      el("catalog-cleanup-batch-error").textContent="";
      renderCleanupBatchDialog(); cleanupBatchDialog.showModal();
    } catch(error) { el("catalog-cleanup-status").textContent=cleanupBatchMessage(error); }
  });
  el("catalog-cleanup-batch-ack").addEventListener("change",() => {
    el("catalog-cleanup-batch-permanent").disabled=!el("catalog-cleanup-batch-ack").checked || cleanupBatchBusy;
  });
  el("catalog-cleanup-batch-cancel").addEventListener("click",() => { if (!cleanupBatchBusy) cleanupBatchDialog.close(); });
  cleanupBatchDialog.addEventListener("cancel",event => { if (cleanupBatchBusy) event.preventDefault(); });
  cleanupBatchDialog.addEventListener("close",() => { cleanupBatchPlan=null; });
  async function confirmCleanupBatch(mode) {
    if (!cleanupBatchPlan || cleanupBatchBusy ||
        (mode==="permanent" && !el("catalog-cleanup-batch-ack").checked)) return;
    cleanupBatchBusy=true;
    el("catalog-cleanup-batch-error").textContent=cleanupB().busy;
    for (const id of ["catalog-cleanup-batch-cancel","catalog-cleanup-batch-trash","catalog-cleanup-batch-permanent"])
      el(id).disabled=true;
    try {
      const result=await api("/api/catalog/cleanup/batch-delete",{
        method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"cleanup-batch-delete"},
        body:JSON.stringify({token:cleanupBatchPlan.token,mode})
      });
      cleanupBatchDialog.close();
      for (const id of result.deleted) {
        cleanupSelected.delete(id); marked.delete(id);
        for (const side of ["A","B"]) if (selected[side]?.id===id) selected[side]=null;
        if (viewerItem?.id===id) { if (imageDialog.open) imageDialog.close(); if (videoDialog.open) videoDialog.close(); viewerItem=null; }
      }
      await refreshStatus(); await search(); await refreshCleanup();
      el("catalog-cleanup-status").textContent=cleanupB().done+" "+result.deleted.length+" / "+result.requested+
        (result.failed ? " "+cleanupB().partial+" "+result.failed : "")+
        (result.warnings.length ? " "+result.warnings.join("; ") : "");
    } catch(error) { el("catalog-cleanup-batch-error").textContent=cleanupBatchMessage(error); }
    finally {
      cleanupBatchBusy=false;
      for (const id of ["catalog-cleanup-batch-cancel","catalog-cleanup-batch-trash"]) el(id).disabled=false;
      el("catalog-cleanup-batch-permanent").disabled=!el("catalog-cleanup-batch-ack").checked;
    }
  }
  el("catalog-cleanup-batch-trash").addEventListener("click",() => { void confirmCleanupBatch("trash"); });
  el("catalog-cleanup-batch-permanent").addEventListener("click",() => { void confirmCleanupBatch("permanent"); });
  function readJournal(){
    try{return normalizeExperimentEntries(JSON.parse(localStorage.getItem(experimentStorageKey)||"[]"));}
    catch{return [];}
  }
  function writeJournal(entries){
    try{localStorage.setItem(experimentStorageKey,JSON.stringify(normalizeExperimentEntries(entries)));return true;}
    catch{return false;}
  }
  function renderJournal(){
    const entries=readJournal(),list=el("catalog-journal-list");list.replaceChildren();
    const search=el("catalog-journal-query"),needle=search.value.trim().normalize("NFKC").toLocaleLowerCase();
    search.placeholder=tj().search||journalCopy.EN.search;
    search.setAttribute("aria-label",search.placeholder);
    el("catalog-journal-summary").textContent=`${tj().journal} (${entries.length})`;
    el("catalog-journal-help").textContent=tj().help;
    el("catalog-journal-export").textContent=tj().export;
    el("catalog-journal-import").textContent=tj().import;
    const shown=entries.filter((entry)=>!needle||[entry.title,entry.reason,entry.a.filename,entry.b.filename].some((value)=>String(value||"").normalize("NFKC").toLocaleLowerCase().includes(needle)));
    if(!shown.length){const p=document.createElement("p");p.textContent=tj().empty;list.append(p);return;}
    for(const entry of shown){
      const card=document.createElement("details");card.className="catalog-journal-entry";
      const summary=document.createElement("summary");
      const date=entry.createdAt?new Date(entry.createdAt).toLocaleDateString(getLanguage()==="HU"?"hu-HU":undefined):"";
      summary.textContent=`${entry.title||entry.a.filename+" ↔ "+entry.b.filename} · ${date}`;
      const files=document.createElement("p");files.textContent=`A: ${entry.a.filename}  ·  B: ${entry.b.filename}`;
      const winner=document.createElement("p");winner.textContent=`${tj().preferredLabel}: ${tj()[entry.preferred==="A"?"a":entry.preferred==="B"?"b":entry.preferred==="tie"?"tie":"none"]}`;
      const reason=document.createElement("p");reason.textContent=`${tj().reasonLabel}: ${entry.reason||"—"}`;
      const changes=document.createElement("div");changes.className="catalog-journal-changes";
      const heading=document.createElement("strong");heading.textContent=tj().changed;changes.append(heading);
      if(!entry.changed.length){const p=document.createElement("p");p.textContent=tj().unchanged;changes.append(p);}
      for(const row of entry.changed){const p=document.createElement("p");p.textContent=`${tc()[row.key]||row.key}: ${formatCompareValue(row.a)} → ${formatCompareValue(row.b)}`;changes.append(p);}
      const prompt=document.createElement("p");
      const promptChange=entry.prompt?.state==="different"
        ? ` · ${tc().onlyA}: ${(entry.prompt.onlyA||[]).join(", ")||tc().none} · ${tc().onlyB}: ${(entry.prompt.onlyB||[]).join(", ")||tc().none}`:"";
      prompt.textContent=`${tj().prompt}: ${tc()[entry.prompt?.state]||tc().unknown}${promptChange}`;
      const negative=document.createElement("p");
      const negativeChange=entry.negative?.state==="different"
        ? ` · ${tc().onlyA}: ${(entry.negative.onlyA||[]).join(", ")||tc().none} · ${tc().onlyB}: ${(entry.negative.onlyB||[]).join(", ")||tc().none}`:"";
      negative.textContent=`${tc().negative}: ${tc()[entry.negative?.state]||tc().unknown}${negativeChange}`;
      const learning=document.createElement("p");
      const changedKeys=entry.changed.map((row)=>row.key);
      if(entry.prompt?.state==="different")changedKeys.push("prompt");
      if(entry.negative?.state==="different")changedKeys.push("negative");
      const description=learningDescription(entry.preferred==="A"||entry.preferred==="B"?entry.preferred:null,changedKeys,entry.learningConfidence);
      learning.textContent=description.summary+(description.caution?" "+description.caution:"");
      const nextTest=document.createElement("p");
      nextTest.textContent=entry.nextTest?tl().journalNext+": "+entry.nextTest:"";
      const timing=document.createElement("p");
      timing.textContent=`${tj().minutes}: A ${entry.runMinutesA??"—"} · B ${entry.runMinutesB??"—"}`;
      const actions=document.createElement("div");actions.className="catalog-journal-entry-actions";
      const reopen=document.createElement("button");reopen.type="button";reopen.className="secondary-action";reopen.textContent=tj().open;
      const remove=document.createElement("button");remove.type="button";remove.className="quiet-action";remove.textContent=tj().remove;
      reopen.addEventListener("click",async()=>{
        el("catalog-journal-status").textContent=tj().loading;reopen.disabled=true;
        try{
          const [a,b]=await Promise.all([entry.a,entry.b].map((item)=>api(`/api/catalog/item?id=${encodeURIComponent(item.id)}`)));
          if(a.modified!==entry.a.modified||b.modified!==entry.b.modified)throw new Error("changed");
          selected.A=a;selected.B=b;await openCompare();el("catalog-journal-status").textContent="";
        }catch{el("catalog-journal-status").textContent=tj().missing;}
        finally{reopen.disabled=false;}
      });
      remove.addEventListener("click",()=>{
        if(!confirm(tj().confirm))return;
        const remaining=readJournal().filter((item)=>item.id!==entry.id);
        el("catalog-journal-status").textContent=writeJournal(remaining)?"":tj().failed;
        renderJournal();
      });
      actions.append(reopen,remove);card.append(summary,files,winner,reason,changes,prompt,negative,learning,nextTest,timing,actions);list.append(card);
    }
  }
  const fillLearning=(template,values)=>template.replace(/\{(winner|fields|base|other|field)\}/g,(_,key)=>String(values[key]??""));
  function learningDescription(winner,changed,confidence){
    if(!winner)return {summary:tl().choose,caution:""};
    const fields=changed.map((key)=>tc()[key]||key).join(", ");
    return {
      summary:fields?fillLearning(tl().observed,{winner,fields}):winner+" — "+tl().none,
      caution:confidence==="oneRecordedChange"?tl().one:confidence==="severalOrUnknown"?tl().many:""
    };
  }
  function renderLearning(){
    if(!selected.A||!selected.B)return;
    const plan=planNextExperiment(selected.A,selected.B,el("catalog-experiment-preferred").value);
    const description=learningDescription(plan.winner,plan.changed,plan.confidence);
    el("catalog-learning-heading").textContent=tl().heading;
    el("catalog-learning-summary").textContent=description.summary;
    el("catalog-learning-caution").textContent=description.caution;
    el("catalog-learning-next-label").textContent=tl().nextLabel;
    const field=el("catalog-experiment-next-test");
    field.setAttribute("aria-label",tl().nextLabel);
    field.placeholder=plan.winner?tl().noSafe:tl().choose;
    if(!learningNextManual)field.value=plan.next?fillLearning(tl().nextTemplate,{
      base:plan.next.baseline,other:plan.next.alternative,field:tc()[plan.next.field]||plan.next.field
    }):"";
  }
  function renderJournalForm(){
    for(const [id,key] of [["catalog-experiment-heading","journal"],["catalog-experiment-save","save"]])el(id).textContent=tj()[key];
    for(const [id,key] of [["catalog-experiment-title","title"],["catalog-experiment-reason","reason"],["catalog-experiment-time-a","timeA"],["catalog-experiment-time-b","timeB"]]){
      el(id).placeholder=tj()[key];el(id).setAttribute("aria-label",tj()[key]);
    }
    const select=el("catalog-experiment-preferred"),old=select.value;
    select.replaceChildren(...[["none","none"],["A","a"],["B","b"],["tie","tie"]].map(([value,key])=>new Option(tj()[key],value)));
    select.value=old||"none";select.setAttribute("aria-label",tj().preferred);
    if(compareDialog.open)renderLearning();
  }
  const detailCache=new Map();
  const techFields=["width","height","duration","fps","frames","steps","cfg","seed","seeds","sampler","scheduler"];
  function renderTechnical(container,item,expanded=false) {
    const settings=item.settings || {}, names=Array.isArray(settings.loras) ? settings.loras : [];
    const loraLine=document.createElement("p"); loraLine.className="catalog-tech-loras";
    loraLine.textContent=`${tc().loras}: ${names.length ? names.map((entry) => {
      const strength=Number(entry?.strength);
      return `${entry?.name || tc().unknown}${Number.isFinite(strength) && entry?.strength !== undefined ? ` ×${strength}` : ""}`;
    }).join(" · ") : tc().unknown}`;
    const details=document.createElement("details"); details.open=expanded;
    const summary=document.createElement("summary"); summary.textContent=tb().settings;
    const list=document.createElement("dl");
    const entries=[["model",item.model || tc().unknown],...techFields
      .filter((key) => settings[key] !== undefined && settings[key] !== null && settings[key] !== "")
      .map((key) => [key,Array.isArray(settings[key]) ? settings[key].join(", ") : String(settings[key])])];
    for (const [key,value] of entries) {
      const label=document.createElement("dt"), data=document.createElement("dd");
      label.textContent=tc()[key] || key; data.textContent=value; list.append(label,data);
    }
    details.append(summary,list); container.replaceChildren(loraLine,details);
  }
  async function readDetails(item) {
    const key=`${item.id}:${item.modified}:${item.size}`;
    let pending=detailCache.get(key);
    if (!pending) {
      pending=api(`/api/catalog/settings?id=${encodeURIComponent(item.id)}`);
      detailCache.set(key,pending);
      pending.catch(() => { if (detailCache.get(key)===pending) detailCache.delete(key); });
      if (detailCache.size>120) detailCache.delete(detailCache.keys().next().value);
    }
    const detail=await pending;
    item.settings=detail.settings || {};
    if (detail.model) item.model=detail.model;
    if (typeof detail.prompt === "string" && detail.prompt) item.prompt=detail.prompt;
    item.negative=typeof detail.negative === "string" ? detail.negative : "";
    item._catalogDetailsReady=true;
    return detail;
  }
  const detailJobs=new WeakMap(), detailQueue=[];
  let detailActive=0;
  const detailObserver=typeof IntersectionObserver === "function"
    ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        detailObserver.unobserve(entry.target);
        const job=detailJobs.get(entry.target);
        if (job) { detailQueue.push(job); pumpDetailJobs(); }
      }
    },{root:null,rootMargin:"0px"}) : null;
  function pumpDetailJobs() {
    while (detailActive<2 && detailQueue.length) {
      const job=detailQueue.shift();
      if (!job.button.isConnected) continue;
      detailActive++;
      readDetails(job.item).then(() => {
        if (job.button.isConnected) job.paint();
      }).catch((error) => {
        if (job.button.isConnected) job.fail(error);
      }).finally(() => { detailActive--; pumpDetailJobs(); });
    }
  }
  const posterCache = new Map(), posterJobs = new WeakMap(), posterQueue = [];
  const cleanupPosterJobs=new WeakMap(), cleanupPosterQueue=[];
  let cleanupPosterActive=0;
  const cleanupPosterObserver=typeof IntersectionObserver==="function"
    ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        cleanupPosterObserver.unobserve(entry.target);
        const job=cleanupPosterJobs.get(entry.target);
        if (job) { cleanupPosterQueue.push(job); pumpCleanupPosters(); }
      }
    },{root:el("catalog-cleanup-results"),rootMargin:"100px"}) : null;
  let posterActive = 0;
  let hoverTimer = null, hoverPreview = null;
  function stopHoverPreview() {
    clearTimeout(hoverTimer); hoverTimer=null;
    if (!hoverPreview) return;
    hoverPreview.pause(); hoverPreview.removeAttribute("src"); hoverPreview.load(); hoverPreview.remove();
    hoverPreview=null;
  }
  const posterKey = (item) => item.id + ":" + item.modified + ":" + item.size;
  const posterObserver = typeof IntersectionObserver === "function"
    ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        posterObserver.unobserve(entry.target);
        const job = posterJobs.get(entry.target);
        if (job) queuePoster(job);
      }
    }, { root:results, rootMargin:"100px" }) : null;
  function extractPoster(item) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.muted = true; video.playsInline = true; video.preload = "metadata";
      let finished = false;
      const timer = setTimeout(() => finish(""),12000);
      function finish(image) {
        if (finished) return;
        finished = true; clearTimeout(timer);
        video.pause(); video.removeAttribute("src"); video.load();
        resolve(image);
      }
      function capture() {
        if (finished || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
        try {
          const scale = Math.min(1,320/video.videoWidth,180/video.videoHeight);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1,Math.round(video.videoWidth*scale));
          canvas.height = Math.max(1,Math.round(video.videoHeight*scale));
          const context = canvas.getContext("2d");
          if (!context) { finish(""); return; }
          context.drawImage(video,0,0,canvas.width,canvas.height);
          finish(canvas.toDataURL("image/jpeg",0.72));
        } catch { finish(""); }
      }
      video.addEventListener("loadedmetadata",() => {
        const time = Number.isFinite(video.duration) && video.duration > 0
          ? Math.min(video.duration/2,Math.max(0.08,Math.min(0.5,video.duration*0.08))) : 0;
        try { if (time > 0) video.currentTime = time; } catch { /* The first decoded frame is the fallback. */ }
      });
      video.addEventListener("seeked",capture);
      video.addEventListener("loadeddata",capture);
      video.addEventListener("error",() => finish(""));
      video.src = mediaUrl(item);
    });
  }
  function queuePoster(job) { posterQueue.push(job); pumpPosters(); }
  function queueCleanupPoster(job) {
    const cached=posterCache.get(posterKey(job.item));
    if (cached) { job.image.src=cached; job.image.hidden=false; return; }
    cleanupPosterJobs.set(job.button,job);
    if (cleanupPosterObserver) cleanupPosterObserver.observe(job.button);
    else queueMicrotask(() => { cleanupPosterQueue.push(job); pumpCleanupPosters(); });
  }
  function pumpCleanupPosters() {
    while (cleanupPosterActive<2 && cleanupPosterQueue.length) {
      const job=cleanupPosterQueue.shift();
      if (!job.button.isConnected) continue;
      cleanupPosterActive++;
      extractPoster(job.item).then(image => {
        if (!job.button.isConnected) return;
        if (image) {
          posterCache.set(posterKey(job.item),image);
          if (posterCache.size>80) posterCache.delete(posterCache.keys().next().value);
          job.image.src=image; job.image.hidden=false;
        } else job.symbol.textContent=tv().noFrame+" · ▶";
      }).finally(() => { cleanupPosterActive--; pumpCleanupPosters(); });
    }
  }
  function pumpPosters() {
    while (posterActive < 3 && posterQueue.length) {
      const job = posterQueue.shift();
      if (!job.image.isConnected || !el("catalog-show-thumbnails").checked) continue;
      posterActive++;
      extractPoster(job.item).then((image) => {
        if (!job.image.isConnected || !el("catalog-show-thumbnails").checked) return;
        if (image) {
          posterCache.set(posterKey(job.item),image);
          if (posterCache.size > 80) posterCache.delete(posterCache.keys().next().value);
          job.image.src = image; job.image.hidden = false;
        } else job.overlay.textContent = tv().noFrame + " · ▶";
      }).finally(() => { posterActive--; pumpPosters(); });
    }
  }
  function renderMarked() {
    el("catalog-marked-count").textContent=`${marked.size} ${tw().selected}`;
    for (const row of results.querySelectorAll("[data-catalog-id]"))
      row.classList.toggle("catalog-item-marked",marked.has(row.dataset.catalogId));
  }
  function renderViewerToolbar(dialog) {
    if (!viewerItem || !dialog.open) return;
    const find = (name) => dialog.querySelector(`[data-viewer-${name}]`);
    const index = visibleItems.findIndex((item) => item.id === viewerItem.id);
    if (index >= 0) viewerIndex=index;
    const absolute=page*24+viewerIndex;
    find("prev").textContent=tw().previous; find("prev").disabled=viewerBusy || absolute<=0;
    find("next").textContent=tw().next; find("next").disabled=viewerBusy || absolute>=total-1;
    find("position").textContent=standaloneSource?viewerItem.filename:`${absolute+1} ${tw().of} ${total}`;
    if(standaloneSource){find("prev").disabled=true;find("next").disabled=true;}
    find("mark").checked=marked.has(viewerItem.id);
    find("select-label").textContent=`${tw().select} · ${marked.size} ${tw().selected}`;
    find("clear").textContent=t().clear;
    find("delete").textContent=tw().delete;
    const category=find("category");
    category.replaceChildren(new Option(t().none,""),...(status?.categories || []).map((name) => new Option(name,name)));
    category.value=viewerItem.category || "";
    category.setAttribute("aria-label",t().category);
    const stars=find("stars"); stars.replaceChildren();
    stars.setAttribute("role","group"); stars.setAttribute("aria-label",t().rate);
    for (let rating=1;rating<=5;rating++) {
      const button=document.createElement("button"); button.type="button"; button.className="catalog-star";
      button.textContent=rating <= (viewerItem.rating || 0) ? "★" : "☆";
      button.setAttribute("aria-label",`${rating} ${t().stars}`);
      button.setAttribute("aria-pressed",String(rating===viewerItem.rating));
      button.disabled=viewerBusy; button.addEventListener("click",() => { void saveViewerAnnotation({rating}); });
      stars.append(button);
    }
    find("clear").disabled=viewerBusy || !(viewerItem.rating>0);
    find("copy-path").textContent=(viewerPathCopy[getLanguage()] || viewerPathCopy.EN)[0];
    find("copy-path").disabled=!viewerItem.path;
    find("reveal-file").textContent=(viewerExplorerCopy[getLanguage()] || viewerExplorerCopy.EN)[0];
    find("reveal-file").disabled=viewerBusy || !viewerItem.id || !viewerItem.path;
    find("category").disabled=viewerBusy;
    find("delete").disabled=viewerBusy;
  }
  function activeViewerDialog() { return imageDialog.open ? imageDialog : videoDialog.open ? videoDialog : null; }
  function rememberViewerOrigin() {
    if (viewerReturn || activeViewerDialog()) return;
    viewerReturn = { page, resultsScrollTop:results.scrollTop, windowScrollY:window.scrollY };
  }
  async function restoreViewerOrigin() {
    if (activeViewerDialog() || (!viewerReturn && !pendingCatalogRefresh)) return;
    const origin=viewerReturn;
    viewerReturn=null;
    const needsSearch=pendingCatalogRefresh || (origin && page!==origin.page);
    pendingCatalogRefresh=false;
    if (origin) page=origin.page;
    if (needsSearch) {
      await search();
      if (page>0 && page*24>=total) { page=Math.max(0,Math.ceil(total/24)-1); await search(); }
    }
    if (activeViewerDialog()) return;
    requestAnimationFrame(() => {
      if (activeViewerDialog()) return;
      if (origin) {
        results.scrollTop=origin.resultsScrollTop;
        window.scrollTo({top:origin.windowScrollY,behavior:"auto"});
      }
    });
  }
  function renderViewerPrompt(item,dialog) {
    const labels=tr(), passportCopy=passportLabels(getLanguage());
    const find=(name) => dialog.querySelector(`[data-viewer-${name}]`);
    const panel=find("passport-panel");
    if (panel.dataset.itemId !== String(item.id)) {
      passportController?.abort(); passportController=null; passportRevision++;
      panel.dataset.itemId=String(item.id); panel.hidden=true;
    }
    find("positive-title").textContent=labels.positive;
    find("negative-title").textContent=labels.negative;
    find("positive").textContent=item.prompt || labels.unknown;
    find("negative").textContent=item._catalogDetailsReady ? item.negative || labels.unknown : labels.loading;
    find("copy-positive").textContent=(viewerFieldCopy[getLanguage()] || viewerFieldCopy.EN).positive;
    find("copy-negative").textContent=(viewerFieldCopy[getLanguage()] || viewerFieldCopy.EN).negative;
    find("copy-positive").disabled=!item.prompt;
    find("copy-negative").disabled=!item._catalogDetailsReady || !item.negative;
    find("copy-prompt").textContent=labels.copyPrompt;
    find("copy-recipe").textContent=labels.copyRecipe;
    find("passport-open").textContent=passportCopy.open;
    find("ask-ai").textContent=viewerAiCopy[getLanguage()] || viewerAiCopy.EN;
    find("workbench").textContent=viewerWorkbenchCopy[getLanguage()] || viewerWorkbenchCopy.EN;
    find("copy-prompt").disabled=!item._catalogDetailsReady || !item.prompt;
    find("copy-recipe").disabled=!item._catalogDetailsReady;
    find("passport-open").disabled=!item._catalogDetailsReady;
    find("ask-ai").disabled=!item.prompt;
    find("workbench").disabled=!item._catalogDetailsReady || !item.prompt;
    if(onCreativeCapture){
      let save=dialog.querySelector("[data-viewer-proven-save]"),more=dialog.querySelector("[data-viewer-proven-more]");
      if(!save){
        save=document.createElement("button");save.type="button";save.dataset.viewerProvenSave="";
        more=document.createElement("button");more.type="button";more.dataset.viewerProvenMore="";
        find("passport-open").parentElement.append(save,more);
        save.addEventListener("click",()=>{if(viewerItem?._catalogDetailsReady)onCreativeCapture(viewerItem);});
        more.addEventListener("click",()=>{const source=viewerItem;if(!source?._catalogDetailsReady)return;dialog.close();requestAnimationFrame(()=>requestAnimationFrame(()=>onCreativeRemix?.(source)));});
      }
      const labels=getCreativeLabels?.()||{save:"Save to proven recipes",more:"More like this"};
      save.textContent=labels.save;more.textContent=labels.more;save.disabled=!item._catalogDetailsReady;more.disabled=!item._catalogDetailsReady;
    }
    if(onTrialCapture){
      let trial=dialog.querySelector("[data-viewer-trial]");
      if(!trial){trial=document.createElement("button");trial.type="button";trial.dataset.viewerTrial="";find("passport-open").parentElement.append(trial);trial.addEventListener("click",()=>{const source=viewerItem;if(!source?._catalogDetailsReady)return;dialog.close();requestAnimationFrame(()=>onTrialCapture(source));});}
      trial.textContent=getTrialLabel?.()||"Attach to trial bench";trial.disabled=!item._catalogDetailsReady;
    }
    if(onPublicationCapture){
      let publish=dialog.querySelector("[data-viewer-publication]");
      if(!publish){publish=document.createElement("button");publish.type="button";publish.dataset.viewerPublication="";find("passport-open").parentElement.append(publish);publish.addEventListener("click",()=>{const source=viewerItem;if(!source?._catalogDetailsReady)return;dialog.close();requestAnimationFrame(()=>onPublicationCapture(source));});}
      publish.textContent=getPublicationLabel?.()||"Prepare publication";publish.disabled=!item._catalogDetailsReady;
    }
  }
  function openViewerPassport(dialog) {
    const item=viewerItem;
    if (!item?._catalogDetailsReady || !dialog.open) return;
    passportController?.abort(); passportController=null; passportRevision++;
    const labels=passportLabels(getLanguage());
    const passport=buildCreatorPassport(item,getLanguage());
    const find=(name) => dialog.querySelector(`[data-viewer-passport-${name}]`);
    find("review").textContent=labels.review;
    find("missing").textContent=`${labels.missing}: ${passport.missing.length ? passport.missing.join(", ") : "—"}`;
    find("warning").textContent=labels.sensitive;
    find("warning").hidden=!passport.possibleSensitive;
    find("text").value=passport.text;
    find("text").setAttribute("aria-label",labels.open);
    find("copy").textContent=labels.copy;
    find("help").textContent=labels.help;
    find("suggest").textContent=labels.suggest;
    find("suggest").disabled=!String(item.prompt || "").trim();
    find("suggest-status").textContent="";
    find("suggested-text").value="";
    find("suggested-text").hidden=true;
    find("suggested-text").setAttribute("aria-label",labels.ready);
    find("copy-suggestion").textContent=labels.copySuggestion;
    find("copy-suggestion").hidden=true;
    find("panel").hidden=false;
    find("text").focus();
  }
  async function suggestViewerPassport(dialog) {
    const item=viewerItem, labels=passportLabels(getLanguage());
    if (!dialog.open || !item?._catalogDetailsReady) return;
    const find=(name) => dialog.querySelector(`[data-viewer-passport-${name}]`);
    const source=String(item.prompt || "").trim();
    if (!source) return;
    if (source.length>MAX_CORRECTION_INPUT) { find("suggest-status").textContent=labels.tooLong; return; }
    passportController?.abort();
    const controller=new AbortController(), revision=++passportRevision;
    passportController=controller;
    const current=() => dialog.open && viewerItem?.id===item.id && !controller.signal.aborted && revision===passportRevision;
    const button=find("suggest"); button.disabled=true;
    find("suggest-status").textContent=labels.working;
    find("suggested-text").hidden=true; find("copy-suggestion").hidden=true;
    const timeout=setTimeout(() => controller.abort(),180000);
    try {
      const tagsResponse=await fetch("/api/tags",{signal:controller.signal});
      if (!tagsResponse.ok) throw new TypeError("Local Ollama unavailable");
      const tags=await tagsResponse.json();
      if (!current()) return;
      const model=tags.models?.find((entry) => entry.name==="gemma3:4b" || entry.name==="gemma3:latest");
      if (!model) { find("suggest-status").textContent=labels.modelMissing; return; }
      const response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},signal:controller.signal,
        body:JSON.stringify({model:model.name,stream:false,options:{temperature:0.25,num_predict:1800},messages:buildPromptCorrectionMessages(source)})});
      if (!response.ok) throw new Error("Local correction failed");
      const suggested=cleanPromptCorrectionResponse((await response.json()).message?.content);
      if (!suggested) throw new Error("Empty local correction");
      if (!current()) return;
      find("suggested-text").value=suggested;
      find("suggested-text").hidden=false;
      find("copy-suggestion").hidden=false;
      find("suggest-status").textContent=labels.ready;
    } catch(error) {
      if (dialog.open && viewerItem?.id===item.id && revision===passportRevision)
        find("suggest-status").textContent=error instanceof TypeError ? labels.unavailable : labels.failed;
    } finally {
      clearTimeout(timeout);
      if (revision===passportRevision) { passportController=null; if (dialog.open && viewerItem?.id===item.id) button.disabled=false; }
    }
  }
  function showViewerTechnical(item,dialog) {
    const target=dialog.querySelector("[data-viewer-tech]");
    renderTechnical(target,item,true);
    renderViewerPrompt(item,dialog);
    void readDetails(item).then(() => {
      if (dialog.open && viewerItem?.id===item.id) {
        renderTechnical(target,item,true);
        renderViewerPrompt(item,dialog);
      }
    }).catch((error) => {
      if (dialog.open && viewerItem?.id===item.id) {
        const warning=document.createElement("p"); warning.className="catalog-tech-error";
        warning.textContent=`${tb().error} ${error.message}`; target.append(warning);
      }
    });
  }
  async function copyViewerContent(dialog,kind) {
    const item=viewerItem;
    if (!item?._catalogDetailsReady || !dialog.open) return;
    const value=kind === "recipe" ? formatCatalogRecipe(item,getLanguage()) : formatCatalogPrompt(item,getLanguage());
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      if (dialog.open && viewerItem?.id===item.id)
        dialog.querySelector("[data-viewer-status]").textContent=kind === "recipe" ? tr().copiedRecipe : tr().copiedPrompt;
    } catch {
      if (dialog.open && viewerItem?.id===item.id)
        dialog.querySelector("[data-viewer-status]").textContent=tr().copyFailed;
    }
  }
  async function copyViewerField(dialog,kind) {
    const item=viewerItem;
    if (!item || !dialog.open) return;
    const value=kind==="positive" ? item.prompt : item._catalogDetailsReady ? item.negative : "";
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      if (dialog.open && viewerItem?.id===item.id)
        dialog.querySelector("[data-viewer-status]").textContent=(viewerFieldCopy[getLanguage()] || viewerFieldCopy.EN).copied;
    } catch {
      if (dialog.open && viewerItem?.id===item.id)
        dialog.querySelector("[data-viewer-status]").textContent=tr().copyFailed;
    }
  }
  async function saveViewerAnnotation(changes) {
    const dialog=activeViewerDialog(), item=viewerItem;
    if (!dialog || !item || viewerBusy) return;
    viewerBusy=true; renderViewerToolbar(dialog);
    const feedback=dialog.querySelector("[data-viewer-status]");
    try {
      const saved=await api("/api/catalog/annotation",{method:"POST",
        headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"annotate-media"},
        body:JSON.stringify({id:item.id,changes})});
      item.rating=saved.rating; item.category=saved.category;
      feedback.textContent=tw().saved;
      await refreshStatus(); await search();
    } catch(error) { feedback.textContent=`${tw().saveError} ${error.message}`; }
    finally { viewerBusy=false; if (dialog.open && viewerItem?.id===item.id) renderViewerToolbar(dialog); }
  }
  async function navigateViewer(direction) {
    if (!viewerItem || viewerBusy) return;
    const current=visibleItems.findIndex((item) => item.id===viewerItem.id);
    const target=page*24+(current>=0 ? current : viewerIndex)+direction;
    if (target<0 || target>=total) return;
    viewerBusy=true;
    try {
      const targetPage=Math.floor(target/24);
      if (targetPage!==page) { page=targetPage; await search(); }
      const item=visibleItems[target%24];
      if (item) { viewerIndex=target%24; if (item.kind==="image") showImage(item); else showVideo(item); }
    } finally { viewerBusy=false; const dialog=activeViewerDialog(); if (dialog) renderViewerToolbar(dialog); }
  }
  for (const dialog of [imageDialog,videoDialog]) {
    dialog.addEventListener("click",(event) => {
      if (event.target!==dialog || event.detail===0) return;
      const box=dialog.getBoundingClientRect();
      if (event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom)
        dialog.close();
    });
    dialog.querySelector("[data-viewer-prev]").addEventListener("click",() => { void navigateViewer(-1); });
    dialog.querySelector("[data-viewer-next]").addEventListener("click",() => { void navigateViewer(1); });
    dialog.querySelector("[data-viewer-mark]").addEventListener("change",(event) => {
      if (!viewerItem) return;
      if (event.target.checked) marked.add(viewerItem.id); else marked.delete(viewerItem.id);
      renderMarked(); renderViewerToolbar(dialog);
    });
    dialog.querySelector("[data-viewer-clear]").addEventListener("click",() => { void saveViewerAnnotation({rating:0}); });
    dialog.querySelector("[data-viewer-category]").addEventListener("change",(event) => { void saveViewerAnnotation({category:event.target.value}); });
    dialog.querySelector("[data-viewer-delete]").addEventListener("click",() => { if (viewerItem) void openDelete(viewerItem); });
    dialog.querySelector("[data-viewer-reveal-file]").addEventListener("click",async () => {
      const item=viewerItem,button=dialog.querySelector("[data-viewer-reveal-file]");
      if(!item?.id || button.disabled)return;
      button.disabled=true;
      try {
        await api("/api/catalog/reveal-file",{method:"POST",
          headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"reveal-file"},
          body:JSON.stringify({id:item.id})});
        if(dialog.open && viewerItem?.id===item.id)dialog.querySelector("[data-viewer-status]").textContent=(viewerExplorerCopy[getLanguage()] || viewerExplorerCopy.EN)[1];
      } catch {
        if(dialog.open && viewerItem?.id===item.id)dialog.querySelector("[data-viewer-status]").textContent=(viewerExplorerCopy[getLanguage()] || viewerExplorerCopy.EN)[2];
      } finally { if(dialog.open)renderViewerToolbar(dialog); }
    });
    dialog.querySelector("[data-viewer-copy-path]").addEventListener("click",async () => {
      const item=viewerItem;if(!item?.path)return;
      try {
        await navigator.clipboard.writeText(String(item.path));
        if(dialog.open && viewerItem?.id===item.id)dialog.querySelector("[data-viewer-status]").textContent=(viewerPathCopy[getLanguage()] || viewerPathCopy.EN)[1];
      } catch {if(dialog.open && viewerItem?.id===item.id)dialog.querySelector("[data-viewer-status]").textContent=tr().copyFailed;}
    });
    dialog.querySelector("[data-viewer-copy-prompt]").addEventListener("click",() => { void copyViewerContent(dialog,"prompt"); });
    dialog.querySelector("[data-viewer-copy-positive]").addEventListener("click",() => { void copyViewerField(dialog,"positive"); });
    dialog.querySelector("[data-viewer-copy-negative]").addEventListener("click",() => { void copyViewerField(dialog,"negative"); });
    dialog.querySelector("[data-viewer-copy-recipe]").addEventListener("click",() => { void copyViewerContent(dialog,"recipe"); });
    dialog.querySelector("[data-viewer-passport-open]").addEventListener("click",() => openViewerPassport(dialog));
    dialog.querySelector("[data-viewer-ask-ai]").addEventListener("click",() => {
      if (!viewerItem?.prompt) return;
      const text=String(viewerItem.prompt)+(viewerItem.negative ? "\n\nNegative prompt: "+viewerItem.negative : "");
      document.dispatchEvent(new CustomEvent("prompt-studio-ask-ai",{detail:{text}}));
    });
    dialog.querySelector("[data-viewer-workbench]").addEventListener("click",() => {
      if(!viewerItem?.prompt)return;
      const event=new CustomEvent("prompt-studio-workbench-load",{cancelable:true,
        detail:{prompt:String(viewerItem.prompt),negative:String(viewerItem.negative||"")}});
      if(!document.dispatchEvent(event))return;
      dialog.close();
      document.getElementById("prompt-workbench")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
    dialog.querySelector("[data-viewer-passport-suggest]").addEventListener("click",() => { void suggestViewerPassport(dialog); });
    dialog.querySelector("[data-viewer-passport-copy-suggestion]").addEventListener("click",async () => {
      const value=dialog.querySelector("[data-viewer-passport-suggested-text]").value.trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        dialog.querySelector("[data-viewer-passport-suggest-status]").textContent=passportLabels(getLanguage()).copiedSuggestion;
      } catch { dialog.querySelector("[data-viewer-passport-suggest-status]").textContent=tr().copyFailed; }
    });
    dialog.querySelector("[data-viewer-passport-copy]").addEventListener("click",async () => {
      const value=dialog.querySelector("[data-viewer-passport-text]").value.trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        dialog.querySelector("[data-viewer-status]").textContent=(passportUiCopy[getLanguage()] || passportUiCopy.EN).copied;
      } catch { dialog.querySelector("[data-viewer-status]").textContent=tr().copyFailed; }
    });
    dialog.addEventListener("keydown",(event) => {
      if (event.target.closest("video,select,input,textarea") || !["ArrowLeft","ArrowRight"].includes(event.key)) return;
      event.preventDefault(); void navigateViewer(event.key==="ArrowLeft" ? -1 : 1);
    });
  }
  function showVideo(item,standalone=false) {
    standaloneSource=standalone;
    if(!standalone)sourceLookupRevision++;
    rememberViewerOrigin();
    viewerItem=item; viewerIndex=Math.max(0,visibleItems.findIndex((entry) => entry.id===item.id));
    if (imageDialog.open) imageDialog.close();
    const player = el("catalog-video-player");
    el("catalog-video-title").textContent = item.filename;
    const poster = posterCache.get(posterKey(item));
    if (poster) player.poster = poster; else player.removeAttribute("poster");
    player.src = mediaUrl(item);
    player.load();
    if (!videoDialog.open) videoDialog.showModal();
    renderViewerToolbar(videoDialog);
    showViewerTechnical(item,videoDialog);
  }
  function renderSelection() {
    el("catalog-compare-picker-title").textContent=tc().title;
    for (const side of ["A","B"]) el(`catalog-compare-slot-${side.toLowerCase()}`).textContent=`${side}: ${selected[side]?.filename || "—"}`;
    el("catalog-compare-open").disabled=compareBusy || !selected.A || !selected.B;
    el("catalog-compare-open").textContent=tc().open;
    el("catalog-compare-clear").textContent=tc().clear;
    for (const button of results.querySelectorAll("[data-compare-side]"))
      button.setAttribute("aria-pressed",String(selected[button.dataset.compareSide]?.id === button.dataset.itemId));
  }
  function selectForCompare(side,item) {
    if (selected[side]?.id === item.id) selected[side]=null;
    else { selected[side]=item; if (selected[side === "A" ? "B" : "A"]?.id === item.id) selected[side === "A" ? "B" : "A"]=null; }
    renderSelection();
  }
  function formatCompareValue(value) {
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) return tc().unknown;
    if (Array.isArray(value)) return value.map((entry) => typeof entry === "object" ? `${entry.name || "?"} (${entry.strength ?? "?"})` : String(entry)).join(", ");
    return String(value);
  }
  function fillCompareText() {
    for (const [id,key] of [["catalog-compare-title","title"],["catalog-compare-close","close"],["catalog-compare-facts-title","facts"],
      ["catalog-compare-tradeoffs-title","tradeoffs"],["catalog-compare-visual-title","visual"],
      ["catalog-compare-reveal","preview"],["catalog-compare-play","playBoth"],["catalog-compare-pause","pauseBoth"],
      ["catalog-compare-visual-run","runVisual"],["catalog-compare-disclaimer","disclaimer"]]) el(id).textContent=tc()[key];
    renderSelection();
  }
  function clearCompareMedia() {
    for (const side of ["a","b"]) {
      const host=el(`catalog-compare-media-${side}`);
      for (const video of host.querySelectorAll("video")) { video.pause(); video.removeAttribute("src"); video.load(); }
      host.replaceChildren();
    }
  }
  function renderCompareMedia() {
    clearCompareMedia();
    for (const side of ["A","B"]) {
      const item=selected[side], host=el(`catalog-compare-media-${side.toLowerCase()}`);
      el(`catalog-compare-name-${side.toLowerCase()}`).textContent=`${side}: ${item.filename}`;
      if (compareVisible) {
        const media=document.createElement(item.kind === "image" ? "img" : "video");
        media.src=mediaUrl(item);
        if (item.kind === "image") { media.alt=item.filename; media.loading="lazy"; }
        else { media.controls=true; media.playsInline=true; media.preload="metadata"; }
        host.append(media);
      } else { const hidden=document.createElement("p"); hidden.textContent=tc().hidden; host.append(hidden); }
      const prompt=document.createElement("details"), summary=document.createElement("summary"), text=document.createElement("pre");
      summary.textContent=tc().prompt; text.textContent=item.prompt || tc().unknown;
      prompt.append(summary,text); host.append(prompt);
    }
    el("catalog-compare-reveal").hidden=compareVisible;
    const bothVideo=compareVisible && selected.A.kind === "video" && selected.B.kind === "video";
    el("catalog-compare-play").hidden=!bothVideo; el("catalog-compare-pause").hidden=!bothVideo;
    el("catalog-compare-visual-run").disabled=!compareVisible;
  }
  function renderCompareFacts() {
    const data=compareCatalogItems(selected.A,selected.B), facts=el("catalog-compare-facts");
    const table=document.createElement("table"), body=document.createElement("tbody");
    for (const entry of data.rows) {
      const tr=document.createElement("tr"); tr.dataset.state=entry.state;
      for (const value of [tc()[entry.key] || entry.key,formatCompareValue(entry.a),formatCompareValue(entry.b)]) {
        const cell=document.createElement("td"); cell.textContent=value; tr.append(cell);
      }
      body.append(tr);
    }
    for(const key of ["prompt","negative"]){
      const detail=data[key],row=document.createElement("tr");row.dataset.state=detail.state;
      for(const value of [tc()[key],detail.state==="unknown"?tc().unknown:detail.state==="same"?tc().same:tc().different,
        detail.state==="different"?`${tc().onlyA}: ${detail.onlyA.join(", ")||tc().none} · ${tc().onlyB}: ${detail.onlyB.join(", ")||tc().none}`:"—"]){
        const cell=document.createElement("td");cell.textContent=value;row.append(cell);
      }
      body.append(row);
    }
    table.append(body);facts.replaceChildren(table);
    el("catalog-compare-tradeoffs").replaceChildren(...data.notes.map((note) => {
      const li=document.createElement("li"); li.textContent=(tc()[note.key] || "").replace("{side}",note.side || ""); return li;
    }));
  }
  async function openCompare() {
    if (!selected.A || !selected.B || compareBusy) return;
    compareBusy=true; renderSelection(); el("catalog-progress").textContent=tc().checking;
    const pair=[selected.A,selected.B], revision=++compareRevision;
    try {
      const responses=await Promise.all(pair.map((item) => api(`/api/catalog/settings?id=${encodeURIComponent(item.id)}`)));
      if (revision !== compareRevision || selected.A?.id !== pair[0].id || selected.B?.id !== pair[1].id) return;
      for (const [index,detail] of responses.entries()) {
        pair[index].settings=detail.settings || {};
        pair[index].model=detail.model || pair[index].model;
        pair[index].prompt=detail.prompt || pair[index].prompt;
        pair[index].negative=detail.negative || "";
      }
      compareVisible=el("catalog-show-thumbnails").checked;
      fillCompareText(); renderCompareMedia(); renderCompareFacts();
      el("catalog-experiment-title").value="";
      el("catalog-experiment-preferred").value="none";
      el("catalog-experiment-reason").value="";
      el("catalog-experiment-next-test").value="";
      learningNextManual=false;
      renderLearning();
      el("catalog-experiment-time-a").value="";
      el("catalog-experiment-time-b").value="";
      el("catalog-experiment-status").textContent="";
      el("catalog-experiment-save").disabled=false;
      el("catalog-compare-visual-status").textContent=""; el("catalog-compare-visual-result").replaceChildren();
      el("catalog-progress").textContent=""; compareDialog.showModal();
    } catch { if (revision === compareRevision) el("catalog-progress").textContent=tc().dataFailed; }
    finally { compareBusy=false; renderSelection(); }
  }
  function drawContained(context,source,x,y,width,height) {
    const sourceWidth=source.videoWidth || source.naturalWidth, sourceHeight=source.videoHeight || source.naturalHeight;
    if (!sourceWidth || !sourceHeight) return;
    const scale=Math.min(width/sourceWidth,height/sourceHeight);
    const w=sourceWidth*scale,h=sourceHeight*scale;
    context.drawImage(source,x+(width-w)/2,y+(height-h)/2,w,h);
  }
  function waitForMedia(target,event,timeout=8000) {
    return new Promise((resolve,reject) => {
      const timer=setTimeout(() => finish(new Error("Media frame timed out")),timeout);
      function finish(error) { clearTimeout(timer); target.removeEventListener(event,ready); target.removeEventListener("error",failed); error ? reject(error) : resolve(); }
      function ready() { finish(); }
      function failed() { finish(new Error("Media could not be decoded")); }
      target.addEventListener(event,ready,{once:true}); target.addEventListener("error",failed,{once:true});
    });
  }
  async function sampleForVisual(item) {
    const canvas=document.createElement("canvas"), context=canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.fillStyle="#111";
    if (item.kind === "image") {
      const image=new Image(), ready=waitForMedia(image,"load",12000);
      image.src=mediaUrl(item); await ready;
      canvas.width=512; canvas.height=512; context.fillRect(0,0,512,512); drawContained(context,image,0,0,512,512);
    } else {
      const video=document.createElement("video"), ready=waitForMedia(video,"loadedmetadata",12000);
      video.muted=true; video.playsInline=true; video.preload="metadata";
      try {
        video.src=mediaUrl(item); await ready;
        if (!Number.isFinite(video.duration) || video.duration <= 0) throw new Error("No video duration");
        canvas.width=768; canvas.height=256; context.fillRect(0,0,768,256);
        for (const [index,ratio] of [0.1,0.5,0.85].entries()) {
          const seek=waitForMedia(video,"seeked",8000);
          video.currentTime=Math.min(video.duration-0.04,Math.max(0.02,video.duration*ratio));
          await seek;
          drawContained(context,video,index*256,0,256,256);
        }
      } finally { video.pause(); video.removeAttribute("src"); video.load(); }
    }
    return canvas.toDataURL("image/jpeg",0.68).split(",")[1];
  }
  function renderVisualResult(value) {
    const host=el("catalog-compare-visual-result"); host.replaceChildren();
    for (const key of ["aStrengths","aWeaknesses","bStrengths","bWeaknesses","notable"]) {
      const entries=Array.isArray(value[key]) ? value[key].filter((line) => typeof line === "string" && line.trim()).slice(0,3) : [];
      if (!entries.length) continue;
      const section=document.createElement("section"), title=document.createElement("h5"), list=document.createElement("ul"); title.textContent=tc()[key];
      for (const line of entries) { const li=document.createElement("li"); li.textContent=line.slice(0,500); list.append(li); }
      section.append(title,list); host.append(section);
    }
    if (typeof value.nextTest === "string" && value.nextTest.trim()) {
      const section=document.createElement("section"), title=document.createElement("h5"), p=document.createElement("p");
      title.textContent=tc().nextTest; p.textContent=value.nextTest.slice(0,600); section.append(title,p); host.append(section);
    }
    if (!host.children.length) throw new Error("No visual observations returned");
  }
  async function analyzeVisuals() {
    if (!compareVisible) { el("catalog-compare-visual-status").textContent=tc().visualNeedsPreview; return; }
    const revision=compareRevision;
    visualController?.abort(); visualController=new AbortController();
    const controller=visualController, signal=controller.signal, button=el("catalog-compare-visual-run");
    button.disabled=true; el("catalog-compare-visual-status").textContent=tc().working; el("catalog-compare-visual-result").replaceChildren();
    const timeout=setTimeout(() => controller.abort(),120000);
    try {
      const tags=await api("/api/tags",{signal});
      const model=tags.models?.find((entry) => entry.name === "gemma3:4b" || entry.name === "gemma3:latest");
      if (!model) { el("catalog-compare-visual-status").textContent=tc().visualMissing; return; }
      const images=await Promise.all([sampleForVisual(selected.A),sampleForVisual(selected.B)]);
      if (signal.aborted || revision !== compareRevision) return;
      const language={HU:"Hungarian",EN:"English",DE:"German",FR:"French",ES:"Spanish",IT:"Italian",PT:"Portuguese",PL:"Polish"}[getLanguage()] || "English";
      const instruction=`Compare two user-selected generated media samples. Image 1 is A; image 2 is B. A video sample is a contact sheet of three frames ordered early, middle, late from left to right; a still image is one image. Describe only visibly supported differences in subject consistency, composition, lighting, detail and obvious artifacts. Do not infer unseen motion, sound, identity, prompt causes, model performance or technical settings. Give balanced strengths and weaknesses for each where visible, and one practical next test that changes only one variable. Do not announce an objective winner. Write in ${language}. Return only JSON: {"aStrengths":[],"aWeaknesses":[],"bStrengths":[],"bWeaknesses":[],"notable":[],"nextTest":""}. Limit each array to two concise strings.`;
      const response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},signal,
        body:JSON.stringify({model:model.name,stream:false,format:"json",options:{temperature:0.2,num_predict:800},
          messages:[{role:"user",content:instruction,images}]})});
      if (!response.ok) throw new Error("Local visual analysis failed");
      const content=(await response.json()).message?.content;
      if (revision !== compareRevision || signal.aborted || !compareDialog.open) return;
      renderVisualResult(JSON.parse(content));
      el("catalog-compare-visual-status").textContent="";
    } catch (error) {
      if (revision === compareRevision && compareDialog.open && !signal.aborted)
        el("catalog-compare-visual-status").textContent=error instanceof TypeError ? tc().visualMissing : tc().visualFailed;
    } finally {
      clearTimeout(timeout); if (revision === compareRevision && compareDialog.open) button.disabled=!compareVisible;
    }
  }
  function translate() {
    for (const [id,key] of [["catalog-title","title"],["catalog-intro","intro"],["catalog-add-root","add"],["catalog-scan","scan"],["catalog-prev","prev"],["catalog-next","next"],["catalog-add-category","addCategory"]]) el(id).textContent = t()[key];
    el("catalog-intro").textContent = td().intro;
    if (cleanupBatchDialog.open) renderCleanupBatchDialog();
    for (const [id,key] of [["catalog-delete-title","title"],["catalog-delete-explanation","explanation"],["catalog-delete-ack-label","acknowledge"],["catalog-delete-cancel","cancel"],["catalog-delete-trash","trash"],["catalog-delete-permanent","permanent"]]) el(id).textContent = td()[key];
    el("catalog-image-close").textContent = ti().close;
    el("catalog-image-open").textContent = ti().open;
    el("catalog-video-close").textContent = tv().close;
    el("catalog-video-hint").textContent = tv().hint;
    el("catalog-show-thumbnails-label").textContent = tp().show;
    el("catalog-auto-scan-label").textContent=catalogAutoScanCopy[getLanguage()] || catalogAutoScanCopy.EN;
    el("catalog-root-input").placeholder = rootText().root;el("catalog-root-input").setAttribute("aria-label",rootText().root);el("catalog-root-input").setAttribute("aria-describedby","catalog-root-help");query.placeholder = t().search;
    el("catalog-root-help").textContent=rootText().help;el("catalog-scan-cancel").textContent=rootText().cancel;
    el("catalog-date-heading").textContent=t().heading;
    el("catalog-date-from-label").textContent=t().from;
    el("catalog-date-to-label").textContent=t().to;
    const oldDatePreset=datePreset.value;
    datePreset.replaceChildren(new Option(t().allDates,"all"),new Option(t().today,"today"),new Option(t().last7,"last7"),new Option(t().last30,"last30"),new Option(t().custom,"custom"));
    datePreset.value=oldDatePreset || "all";
    datePreset.setAttribute("aria-label",t().heading);
    renderGalleryState();
    el("catalog-new-category").placeholder = t().newCategory;
    el("catalog-new-category").setAttribute("aria-label",t().newCategory);
    const oldKind = kind.value, oldRoot = root.value, oldPrompt = promptFilter.value, oldCategory = categoryFilter.value, oldRating = ratingFilter.value;
    kind.replaceChildren(new Option(t().all,""),new Option(t().image,"image"),new Option(t().video,"video")); kind.value = oldKind;
    promptFilter.replaceChildren(new Option(t().promptAll,""),new Option(t().promptYes,"yes"),new Option(t().promptNo,"no")); promptFilter.value = oldPrompt;
    root.replaceChildren(new Option(t().allFolders,""));
    for (const value of status?.roots || []) root.add(new Option(value,value)); root.value = oldRoot;
    categoryFilter.replaceChildren(new Option(t().allCategories,""));
    for (const value of status?.categories || []) categoryFilter.add(new Option(value,value)); categoryFilter.value = oldCategory;
    ratingFilter.replaceChildren(new Option(t().allRatings,""), ...[1,2,3,4,5].map((n) => new Option(`${n}+ ${t().stars}`,String(n))));
    ratingFilter.value = oldRating;
    categoryFilter.setAttribute("aria-label",t().category);
    ratingFilter.setAttribute("aria-label",t().rate);
    fillCompareText();
    renderJournalForm();renderJournal();
    renderCleanup();
    if (compareDialog.open) { renderCompareMedia(); renderCompareFacts(); }
    const dialog=activeViewerDialog(); if (dialog) renderViewerToolbar(dialog);
    renderStatus(); search();
  }
  function renderStatus() {
    el("catalog-roots").replaceChildren(...(status?.roots || []).map(value=>createCatalogRootChip(value,rootControlText(),rootChangePending||Boolean(status?.scan?.running),removeArchiveRoot)));
    const progress = el("catalog-progress");
    if (!status) { progress.textContent = t().offline; return; }
    const info = status.scan;
    progress.textContent = info.running
      ? `${info.cancelling?rootText().cancelling:t().scanning} ${info.scanned} · ${info.found} ${t().indexed} · ${info.directories || 0} ${rootText().folders}${info.currentFolder?` · ${info.currentFolder}`:""}`
      : info.cancelled ? rootText().stopped
      : info.message ? `${t().scanError} ${info.message}`
      : status.scannedAt ? `${status.indexed} ${t().files} · ${status.withPrompt} ${t().indexed} · ${status.rated || 0} ${t().rated} · ${status.skipped} ${t().skipped} · ${status.errors} ${t().errors}`
      : t().notScanned;
    el("catalog-scan").disabled = info.running;
    el("catalog-scan-cancel").hidden=!info.running;el("catalog-scan-cancel").disabled=info.cancelling||info.finalizing;
    el("catalog-add-root").disabled=info.running||rootChangePending;
  }
  async function removeArchiveRoot(value){
    if(rootChangePending||status?.scan?.running)return;
    rootChangePending=true;renderStatus();let message="";
    try{
      status=await api("/api/catalog/roots/remove",{method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"catalog-root-remove"},body:JSON.stringify({path:value})});
      if(root.value&&!status.roots.includes(root.value))root.value="";
      marked.clear();selected.A=null;selected.B=null;cleanupSelected.clear();galleryActions?.clearSelection();
      page=0;translate();await refreshCleanup();message=rootControlText().removed;
    }catch(error){message=`${rootControlText().error} ${error.message}`;}
    finally{rootChangePending=false;renderStatus();if(message)el("catalog-progress").textContent=message;}
  }
  async function refreshStatus() {
    try { status = await api("/api/catalog/status"); renderStatus(); }
    catch { status = null; renderStatus(); }
  }
  async function refreshVisibleResults() {
    if (document.hidden || activeViewerDialog() || galleryActions?.locked()) { pendingCatalogRefresh=true; return; }
    const viewKey=() => JSON.stringify([page,galleryMode,query.value,kind.value,root.value,promptFilter.value,
      categoryFilter.value,ratingFilter.value,dateFrom.value,dateTo.value]);
    let expectedView=viewKey();
    const previousScroll=results.scrollTop, previousWindowScroll=window.scrollY;
    await search();
    if (viewKey()!==expectedView) return;
    if (page>0 && page*24>=total) {
      page=Math.max(0,Math.ceil(total/24)-1);
      expectedView=viewKey();
      await search();
    }
    if (activeViewerDialog()) { pendingCatalogRefresh=true; return; }
    requestAnimationFrame(() => {
      if (activeViewerDialog() || viewKey()!==expectedView) return;
      results.scrollTop=previousScroll;
      window.scrollTo({top:previousWindowScroll,behavior:"auto"});
    });
  }
  function monitorCatalogScan() {
    if (scanMonitorActive) return;
    scanMonitorActive=true;
    const poll=async () => {
      await refreshStatus();
      if (!status) { scanMonitorActive=false; timer=null; return; }
      if (status.scan?.running) { timer=setTimeout(poll,2000); return; }
      scanMonitorActive=false; timer=null;
      nextAutoScanAt=Date.now()+autoScanIntervalMs;
      await refreshVisibleResults();
    };
    timer=setTimeout(poll,2000);
  }
  async function beginCatalogScan(automatic=false) {
    if (galleryActions?.locked()) return;
    if (scanRequestPending || scanMonitorActive || !status) return;
    if (automatic && (!autoScanToggle.checked || document.hidden || !status.roots?.length)) return;
    if (status.scan?.running) { monitorCatalogScan(); return; }
    scanRequestPending=true;
    try {
      const response=await api("/api/catalog/scan",{method:"POST"});
      await refreshStatus();
      if (response.started || status?.scan?.running) {
        nextAutoScanAt=Date.now()+autoScanIntervalMs;
        monitorCatalogScan();
      } else if (automatic) nextAutoScanAt=Date.now()+60000;
    } catch {
      if (!automatic) el("catalog-progress").textContent=t().offline;
      nextAutoScanAt=Date.now()+60000;
    } finally { scanRequestPending=false; }
  }
  galleryActions=attachCatalogGalleryActions({panel,results,pager:el("catalog-pager"),anchor:el("catalog-marked-count"),
    getLabels:()=>({...cleanupB(),explanation:td().explanation,error:td().error,previousDay:t().previousDay,nextDay:t().nextDay}),
    getItems:()=>visibleItems,getScope:()=>JSON.stringify([galleryMode,query.value,kind.value,root.value,promptFilter.value,categoryFilter.value,ratingFilter.value,dateFrom.value,dateTo.value]),
    getDay:()=>galleryDay.value,isGallery:()=>galleryMode,changeDay:shiftGalleryDay,api,
    onRemoved:async ids=>{
      for(const id of ids){marked.delete(id);cleanupSelected.delete(id);for(const side of ["A","B"])if(selected[side]?.id===id)selected[side]=null;}
      await refreshStatus();
      total=Math.max(0,total-ids.length);page=Math.min(page,Math.max(0,Math.ceil(total/24)-1));
      await search();await refreshCleanup();
    }
  });
  function resultRow(item) {
    const row = document.createElement("article"); row.className = "catalog-item"; row.dataset.catalogId=item.id;
    galleryActions.checkbox(item,row);
    const media = document.createElement("div"); media.className = "catalog-media";
    if (item.kind === "image") {
      if (el("catalog-show-thumbnails").checked) {
        const enlarge=document.createElement("button"); enlarge.type="button"; enlarge.className="catalog-image-thumb";
        enlarge.setAttribute("aria-label",`${ti().preview}: ${item.filename}`); enlarge.title=ti().preview;
        const image = document.createElement("img"); image.src = mediaUrl(item); image.alt = item.filename; image.loading = "lazy";
        enlarge.append(image); enlarge.addEventListener("click",() => showImage(item)); media.append(enlarge);
      } else {
        const hidden=document.createElement("span"); hidden.className="catalog-media-hidden"; hidden.textContent=tp().hidden;
        media.append(hidden);
      }
    } else {
      const play = document.createElement("button"); play.type="button";
      play.setAttribute("aria-label",tv().preview + ": " + item.filename);
      play.title = tv().preview;
      if (el("catalog-show-thumbnails").checked) {
        play.className = "catalog-video-thumb";
        play.title=tw().preview;
        const frame = document.createElement("img"); frame.alt = ""; frame.hidden = true;
        const overlay = document.createElement("span"); overlay.className = "catalog-video-play"; overlay.textContent = "▶";
        play.append(frame,overlay);
        const cached = posterCache.get(posterKey(item));
        if (cached) { frame.src = cached; frame.hidden = false; }
        else {
          const job = {item,image:frame,overlay}; posterJobs.set(play,job);
          if (posterObserver) posterObserver.observe(play); else queuePoster(job);
        }
        play.addEventListener("pointerenter",(event) => {
          if (event.pointerType==="touch" || !el("catalog-show-thumbnails").checked ||
              window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
          stopHoverPreview();
          hoverTimer=setTimeout(() => {
            if (!play.isConnected || !el("catalog-show-thumbnails").checked) return;
            const preview=document.createElement("video"); preview.className="catalog-video-hover";
            preview.muted=true; preview.playsInline=true; preview.loop=true;
            preview.setAttribute("aria-hidden","true"); preview.src=mediaUrl(item);
            play.append(preview); hoverPreview=preview;
            void preview.play().catch(() => { if (hoverPreview===preview) stopHoverPreview(); });
          },450);
        });
        play.addEventListener("pointerleave",stopHoverPreview);
      } else { play.className = "quiet-action"; play.textContent = "▶ " + tv().preview; }
      play.addEventListener("click",() => { stopHoverPreview(); showVideo(item); });
      media.append(play);
    }
    const detail = document.createElement("div"); detail.className="catalog-detail";
    const name = document.createElement("strong"); name.textContent = item.filename;
    const meta = document.createElement("small"); meta.textContent = [item.source,item.model,item.modified?.slice(0,10)].filter(Boolean).join(" · ");
    const settings = document.createElement("button"); settings.type="button"; settings.className="catalog-item-settings";
    const tech=document.createElement("div"); tech.className="catalog-item-tech";
    let settingsRead = false;
    const paintSettings = () => {
      settings.textContent=settingsRead ? tb().settings : tb().viewSettings;
      meta.textContent=[item.source,item.model,item.modified?.slice(0,10)].filter(Boolean).join(" · ");
      renderTechnical(tech,item,false);
    };
    paintSettings();
    settings.addEventListener("click",async () => {
      settings.disabled=true;
      try {
        await readDetails(item);
        settingsRead=true; paintSettings();
      } catch (error) { el("catalog-progress").textContent=`${tb().error} ${error.message}`; }
      finally { settings.disabled=false; }
    });
    if (detailObserver) {
      detailJobs.set(settings,{item,button:settings,paint:() => { settingsRead=true; paintSettings(); },
        fail:(error) => { settings.title=`${tb().error} ${error.message}`; }});
      detailObserver.observe(settings);
    }
    const path = document.createElement("small"); path.textContent = item.path; path.title = item.path;
    const excerpt = document.createElement("p"); excerpt.textContent = item.prompt ? item.prompt.slice(0,260) + (item.prompt.length>260 ? "…" : "") : t().noPrompt;
    const full = document.createElement("details"), summary=document.createElement("summary"), pre=document.createElement("pre");
    summary.textContent="Prompt"; pre.textContent=item.prompt; full.append(summary,pre); full.hidden=!item.prompt;
    const organize=document.createElement("div"); organize.className="catalog-item-organize";
    const ratingLabel=document.createElement("small"); ratingLabel.textContent=t().rate;
    const stars=document.createElement("div"); stars.className="catalog-stars"; stars.setAttribute("role","group"); stars.setAttribute("aria-label",t().rate);
    const starButtons=[];
    const categorySelect=document.createElement("select"); categorySelect.className="catalog-item-category"; categorySelect.setAttribute("aria-label",t().category);
    categorySelect.add(new Option(t().none,""));
    for (const value of status?.categories || []) categorySelect.add(new Option(value,value));
    categorySelect.value=item.category || "";
    const paintStars=() => {
      for (const [index,button] of starButtons.entries()) {
        const value=index+1;
        button.textContent=value <= (item.rating || 0) ? "★" : "☆";
        button.setAttribute("aria-pressed",String(value === item.rating));
        button.setAttribute("aria-label",`${value} ${t().stars}`);
      }
      clearRating.disabled=!(item.rating > 0);
    };
    async function saveAnnotation(changes) {
      for (const control of [...starButtons,clearRating,categorySelect]) control.disabled=true;
      try {
        const saved=await api("/api/catalog/annotation",{ method:"POST",
          headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"annotate-media"},
          body:JSON.stringify({id:item.id,changes}) });
        item.rating=saved.rating; item.category=saved.category;
        await refreshStatus(); await search();
        el("catalog-progress").textContent=t().saved;
      } catch (error) {
        categorySelect.value=item.category || ""; paintStars();
        el("catalog-progress").textContent=`${t().saveError} ${error.message}`;
      } finally {
        for (const control of [...starButtons,categorySelect]) control.disabled=false;
        clearRating.disabled=!(item.rating > 0);
      }
    }
    for (let value=1; value<=5; value++) {
      const button=document.createElement("button"); button.type="button"; button.className="catalog-star";
      button.addEventListener("click",() => saveAnnotation({rating:value}));
      starButtons.push(button); stars.append(button);
    }
    const clearRating=document.createElement("button"); clearRating.type="button"; clearRating.className="catalog-clear-rating"; clearRating.textContent=t().clear;
    clearRating.addEventListener("click",() => saveAnnotation({rating:0}));
    categorySelect.addEventListener("change",() => saveAnnotation({category:categorySelect.value}));
    paintStars(); organize.append(ratingLabel,stars,clearRating,categorySelect);
    const actions=document.createElement("div"); actions.className="catalog-actions";
    const load=document.createElement("button"); load.type="button"; load.textContent=tb().similar;
    load.disabled=!item.prompt;
    load.addEventListener("click", () => {
      const current=getCurrent();
      if (current.prompt?.trim() && current.prompt.trim() !== item.prompt.trim() && !confirm(t().confirm)) return;
      restore({ mode:item.kind === "image" ? "image" : "video", prompt:item.prompt, language:"EN", model:item.model });
      el("catalog-progress").textContent=t().loaded;
      document.getElementById("classic-result")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
    const workflow=document.createElement("button"); workflow.type="button"; workflow.textContent=tb().workflow;
    workflow.disabled=!item.prompt;
    workflow.addEventListener("click",async () => {
      workflow.disabled=true;
      const tab=window.open("", "_blank");
      if (tab) { tab.document.title="Workflow Studio"; tab.opener=null; }
      try {
        const handoff=await api("/api/catalog/workflow-handoff",{method:"POST",
          headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"workflow-handoff"},
          body:JSON.stringify({id:item.id})});
        if (tab && !tab.closed) tab.location.replace(handoff.url);
        else {
          const link=document.createElement("a"); link.href=handoff.url; link.target="_blank"; link.rel="noopener"; link.textContent=tb().link;
          el("catalog-progress").replaceChildren(link);
        }
        if (tab && !tab.closed) el("catalog-progress").textContent=tb().ready;
      } catch (error) {
        if (tab && !tab.closed) tab.close();
        el("catalog-progress").textContent=`${tb().error} ${error.message}`;
      } finally { workflow.disabled=false; }
    });
    const copy=document.createElement("button"); copy.type="button"; copy.textContent=t().copy;
    copy.disabled=!item.prompt;
    copy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(item.prompt); el("catalog-progress").textContent=t().copied; } catch {} });
    if (item.kind === "image") {
      const preview=document.createElement("button"); preview.type="button"; preview.textContent=ti().preview;
      preview.addEventListener("click",() => showImage(item)); actions.append(preview);
    } else if (onLinkVideo) {
      const link=document.createElement("button"); link.type="button";
      link.textContent=getLinkVideoLabel?.() || "Link to Director";
      link.addEventListener("click",() => onLinkVideo(item)); actions.append(link);
    }
    const remove=document.createElement("button"); remove.type="button"; remove.textContent=td().open;
    remove.addEventListener("click",() => { void openDelete(item); });
    for (const side of ["A","B"]) {
      const choose=document.createElement("button"); choose.type="button"; choose.className="catalog-compare-choose";
      choose.dataset.compareSide=side; choose.dataset.itemId=item.id;
      choose.textContent=tc()[side === "A" ? "chooseA" : "chooseB"];
      choose.setAttribute("aria-pressed",String(selected[side]?.id === item.id));
      choose.addEventListener("click",() => selectForCompare(side,item)); actions.append(choose);
    }
    actions.append(load,workflow,copy,remove); detail.append(name,meta,settings,tech,path,excerpt,full,organize,actions); row.append(media,detail);
    return row;
  }
  async function openDelete(item) {
    if (deleteDialog.open || deleteBusy || deletePreparing) return;
    deletePreparing=true;
    try {
      deletionPlan=await api(`/api/catalog/delete-preview?id=${encodeURIComponent(item.id)}`);
      el("catalog-delete-files").replaceChildren(...deletionPlan.files.map((file) => {
        const li=document.createElement("li"); li.textContent=`${file.role === "metadata" ? `${td().metadata}: ` : ""}${file.path}`; return li;
      }));
      el("catalog-delete-ack").checked=false; el("catalog-delete-error").textContent="";
      el("catalog-delete-permanent").disabled=true;
      deleteDialog.showModal();
    } catch(error) {
      const dialog=activeViewerDialog();
      if (dialog) dialog.querySelector("[data-viewer-status]").textContent=`${td().error} ${error.message}`;
      else el("catalog-progress").textContent=`${td().error} ${error.message}`;
    } finally { deletePreparing=false; }
  }
  function showImage(item,standalone=false) {
    standaloneSource=standalone;
    if(!standalone)sourceLookupRevision++;
    rememberViewerOrigin();
    viewerItem=item; previewItem=item; viewerIndex=Math.max(0,visibleItems.findIndex((entry) => entry.id===item.id));
    if (videoDialog.open) videoDialog.close();
    el("catalog-image-title").textContent=item.filename;
    el("catalog-image-large").src=mediaUrl(item);
    el("catalog-image-large").alt=item.filename;
    el("catalog-image-error").textContent="";
    if (!imageDialog.open) imageDialog.showModal();
    renderViewerToolbar(imageDialog);
    showViewerTechnical(item,imageDialog);
  }
  document.addEventListener("prompt-studio-open-proven-source",async event=>{
    const revision=++sourceLookupRevision;
    try{const source=await api("/api/catalog/item?id="+encodeURIComponent(event.detail?.id||""));if(revision!==sourceLookupRevision)return;if(source.kind==="video")showVideo(source,true);else showImage(source,true);}
    catch{if(revision===sourceLookupRevision)event.detail?.report?.();}
  });
  document.addEventListener("prompt-studio-creative-saved",event=>{const dialog=activeViewerDialog();if(dialog&&viewerItem?.id===event.detail?.sourceId)dialog.querySelector("[data-viewer-status]").textContent=event.detail.message;});
  el("catalog-image-close").addEventListener("click",() => imageDialog.close());
  imageDialog.addEventListener("close",() => { passportController?.abort(); passportRevision++; previewItem=null; el("catalog-image-large").removeAttribute("src"); if (!videoDialog.open) viewerItem=null; void restoreViewerOrigin(); });
  el("catalog-video-close").addEventListener("click",() => videoDialog.close());
  videoDialog.addEventListener("close",() => {
    passportController?.abort(); passportRevision++;
    const player = el("catalog-video-player");
    player.pause(); player.removeAttribute("src"); player.removeAttribute("poster"); player.load();
    if (!imageDialog.open) viewerItem=null;
    void restoreViewerOrigin();
  });
  el("catalog-compare-open").addEventListener("click",() => { void openCompare(); });
  el("catalog-compare-clear").addEventListener("click",() => { selected.A=null; selected.B=null; renderSelection(); });
  el("catalog-experiment-preferred").addEventListener("change",()=>{learningNextManual=false;renderLearning();});
  el("catalog-experiment-next-test").addEventListener("input",()=>{learningNextManual=true;});
  el("catalog-experiment-save").addEventListener("click",()=>{
    if(!selected.A||!selected.B||!compareDialog.open)return;
    const saveButton=el("catalog-experiment-save");if(saveButton.disabled)return;
    saveButton.disabled=true;
    const entry=createExperimentEntry(selected.A,selected.B,{
      title:el("catalog-experiment-title").value,preferred:el("catalog-experiment-preferred").value,
      reason:el("catalog-experiment-reason").value,nextTest:el("catalog-experiment-next-test").value,
      runMinutesA:el("catalog-experiment-time-a").value,
      runMinutesB:el("catalog-experiment-time-b").value
    });
    const current=readJournal();
    if(writeJournal([entry,...current])){
      el("catalog-experiment-status").textContent=tj().saved;
      el("catalog-journal-status").textContent="";
      renderJournal();
    }else{el("catalog-experiment-status").textContent=tj().failed;saveButton.disabled=false;}
  });
  el("catalog-journal-export").addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify({version:1,entries:readJournal()},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download="ArtofTomworks_experiment_journal.json";document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  el("catalog-journal-query").addEventListener("input",renderJournal);
  el("catalog-journal-import").addEventListener("click",()=>el("catalog-journal-file").click());
  el("catalog-journal-file").addEventListener("change",async()=>{
    const input=el("catalog-journal-file"),file=input.files?.[0];input.value="";
    if(!file||file.size>2_000_000){el("catalog-journal-status").textContent=tj().badFile;return;}
    try{
      const parsed=JSON.parse(await file.text());
      if(parsed?.version!==1||!Array.isArray(parsed.entries))throw new Error("format");
      const incoming=normalizeExperimentEntries(parsed);
      if(!incoming.length)throw new Error("empty");
      if(!writeJournal([...readJournal(),...incoming]))throw new Error("storage");
      el("catalog-journal-status").textContent=tj().imported;renderJournal();
    }catch{el("catalog-journal-status").textContent=tj().badFile;}
  });
  window.addEventListener("storage",(event)=>{if(event.key===experimentStorageKey)renderJournal();});
  el("catalog-compare-close").addEventListener("click",() => compareDialog.close());
  compareDialog.addEventListener("close",() => {
    compareRevision++; visualController?.abort(); visualController=null;
    clearCompareMedia(); compareVisible=false; el("catalog-compare-visual-result").replaceChildren();
  });
  el("catalog-compare-reveal").addEventListener("click",() => { compareVisible=true; renderCompareMedia(); });
  el("catalog-compare-play").addEventListener("click",() => {
    for (const video of compareDialog.querySelectorAll(".catalog-compare-media video")) { video.currentTime=0; void video.play().catch(() => {}); }
  });
  el("catalog-compare-pause").addEventListener("click",() => {
    for (const video of compareDialog.querySelectorAll(".catalog-compare-media video")) video.pause();
  });
  el("catalog-compare-visual-run").addEventListener("click",() => { void analyzeVisuals(); });
  el("catalog-image-open").addEventListener("click",async () => {
    if (!previewItem) return;
    const button=el("catalog-image-open"); button.disabled=true;
    try {
      await api("/api/catalog/open-image",{method:"POST",
        headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"open-image"},
        body:JSON.stringify({id:previewItem.id})});
      el("catalog-image-error").textContent=ti().opened;
    } catch(error) { el("catalog-image-error").textContent=`${ti().error} ${error.message}`; }
    finally { button.disabled=false; }
  });
  el("catalog-show-thumbnails").addEventListener("change",() => {
    if (!el("catalog-show-thumbnails").checked) {
      stopHoverPreview();
      posterCache.clear(); posterQueue.length = 0;
      if (videoDialog.open) videoDialog.close();
    }
    search();
  });
  document.addEventListener("visibilitychange",() => { if (document.hidden) stopHoverPreview(); });
  async function search() {
    const revision=++searchRevision;
    galleryActions?.setLoading(true);
    stopHoverPreview();
    detailObserver?.disconnect(); detailQueue.length=0;
    posterObserver?.disconnect(); posterQueue.length = 0;
    if (!status) { visibleItems=[]; results.replaceChildren(); galleryActions?.setLoading(false); return; }
    const params = new URLSearchParams({ q:query.value, kind:kind.value, root:root.value, prompt:promptFilter.value,
      category:categoryFilter.value, rating:ratingFilter.value, from:dateFrom.value, to:dateTo.value, page:String(page) });
    try {
      const data=await api(`/api/catalog/search?${params}`);
      if (revision!==searchRevision) return;
      total=data.total; visibleItems=data.results;
      galleryActions.beginRender();
      results.replaceChildren(...data.results.map(resultRow));
      renderSelection(); renderMarked();
      galleryActions.refresh();
      if (!data.results.length) { const message=document.createElement("p"); message.textContent=t().empty; results.append(message); }
      el("catalog-count").textContent=`${total} ${t().result}`;
      const pageLabel=`${t().page} ${page+1} / ${Math.max(1,Math.ceil(total/24))}`;
      for (const suffix of ["","-top"]) {
        el(`catalog-page${suffix}`).textContent=pageLabel;
        el(`catalog-prev${suffix}`).disabled=page===0; el(`catalog-next${suffix}`).disabled=(page+1)*24>=total;
        el(`catalog-first${suffix}`).disabled=page===0; el(`catalog-last${suffix}`).disabled=(page+1)*24>=total;
      }
    } catch { if (revision===searchRevision) { visibleItems=[]; results.replaceChildren(); } }
    finally {if(revision===searchRevision)galleryActions?.setLoading(false);}
  }
  el("catalog-add-root").addEventListener("click", async () => {
    if(rootChangePending)return;
    const input=el("catalog-root-input"), value=input.value.trim(); if (!value) return;
    rootChangePending=true;renderStatus();
    let message="";
    try {
      status=await api("/api/catalog/roots",{ method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"catalog-root"},body:JSON.stringify({path:value}) });
      input.value=""; translate();
      if (autoScanToggle.checked) void beginCatalogScan(true);
      else message=t().newRoot;
    }
    catch (error) {message=`${t().badRoot} ${error.message}`;}
    finally{rootChangePending=false;renderStatus();if(message)el("catalog-progress").textContent=message;}
  });
  async function addCategory() {
    const input=el("catalog-new-category"), name=input.value.trim(); if (!name) return;
    const button=el("catalog-add-category"); button.disabled=true;
    try {
      await api("/api/catalog/categories",{method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"annotate-media"},body:JSON.stringify({name})});
      input.value=""; await refreshStatus(); translate(); el("catalog-progress").textContent=t().categoryAdded;
    } catch (error) { el("catalog-progress").textContent=`${t().saveError} ${error.message}`; }
    finally { button.disabled=false; }
  }
  el("catalog-add-category").addEventListener("click",addCategory);
  el("catalog-new-category").addEventListener("keydown",(event) => { if (event.key === "Enter") { event.preventDefault(); addCategory(); } });
  el("catalog-scan").addEventListener("click",() => { void beginCatalogScan(); });
  el("catalog-scan-cancel").addEventListener("click",async()=>{
    el("catalog-scan-cancel").disabled=true;
    try{await api("/api/catalog/scan/cancel",{method:"POST",headers:{"X-Prompt-Studio-Action":"catalog-scan-control"}});await refreshStatus();}
    catch(error){el("catalog-progress").textContent=`${t().scanError} ${error.message}`;el("catalog-scan-cancel").disabled=false;}
  });
  autoScanToggle.addEventListener("change",() => {
    try { localStorage.setItem(autoScanStorageKey,String(autoScanToggle.checked)); } catch { /* Keep this page's choice. */ }
    if (autoScanToggle.checked) void beginCatalogScan(true);
  });
  async function autoScanTick() {
    if (!autoScanToggle.checked || document.hidden || Date.now()<nextAutoScanAt || scanRequestPending || scanMonitorActive) return;
    if (!status) await refreshStatus();
    if (!status?.roots?.length) { nextAutoScanAt=Date.now()+autoScanIntervalMs; return; }
    await beginCatalogScan(true);
  }
  setInterval(() => { void autoScanTick(); },60000);
  document.addEventListener("visibilitychange",() => {
    if (document.hidden) return;
    if (pendingCatalogRefresh && !activeViewerDialog()) { pendingCatalogRefresh=false; void refreshVisibleResults(); }
    void autoScanTick();
  });
  query.addEventListener("input", () => { clearTimeout(delay); delay=setTimeout(() => { page=0; search(); },250); });
  for (const input of [kind,root,promptFilter,categoryFilter,ratingFilter]) input.addEventListener("change",() => { page=0; search(); });
  const dateString=(date) => [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
  function renderGalleryState() {
    galleryToggle.textContent=galleryMode?t().listView:t().galleryView;
    galleryControls.hidden=!galleryMode;
    el("catalog-gallery-day-label").textContent=t().day;
    el("catalog-gallery-prev-day").textContent=t().previousDay;
    el("catalog-gallery-next-day").textContent=t().nextDay;
    el("catalog-gallery-hint").textContent=t().galleryHint;
    for (const suffix of ["","-top"]) {
      el(`catalog-first${suffix}`).textContent=t().firstPage;
      el(`catalog-last${suffix}`).textContent=t().lastPage;
      el(`catalog-prev${suffix}`).textContent=t().prev;
      el(`catalog-next${suffix}`).textContent=t().next;
    }
    galleryDay.setAttribute("aria-label",t().day);
    results.classList.toggle("catalog-gallery-mode",galleryMode);
    for (const input of [datePreset,dateFrom,dateTo]) input.disabled=galleryMode;
    for (const suffix of ["","-top"]) {
      el(`catalog-pager${suffix}`).classList.add("catalog-pager-gallery");
      el(`catalog-first${suffix}`).hidden=false; el(`catalog-last${suffix}`).hidden=false;
    }
    results.after(el("catalog-pager"));
    galleryActions?.refresh();
  }
  function selectGalleryDay(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    galleryDay.value=value; dateFrom.value=value; dateTo.value=value; datePreset.value="custom";
    page=0; search();
  }
  function shiftGalleryDay(step) {
    const day=new Date((galleryDay.value || dateString(new Date()))+"T12:00:00");
    day.setDate(day.getDate()+step);selectGalleryDay(dateString(day));
  }
  galleryToggle.addEventListener("click",async () => {
    if (galleryMode) {
      galleryMode=false;
      dateFrom.value=savedDateFilter?.from || ""; dateTo.value=savedDateFilter?.to || "";
      datePreset.value=savedDateFilter?.preset || "all"; savedDateFilter=null;
      renderGalleryState(); page=0; search(); return;
    }
    galleryToggle.disabled=true;
    try {
      let day=dateTo.value || dateFrom.value;
      if (!day) {
        const latest=await api("/api/catalog/search?limit=1");
        const modified=latest.results?.[0]?.modified;
        if (modified && !Number.isNaN(Date.parse(modified))) day=dateString(new Date(modified));
      }
      savedDateFilter={from:dateFrom.value,to:dateTo.value,preset:datePreset.value};
      galleryMode=true; renderGalleryState(); selectGalleryDay(day || dateString(new Date()));
    } catch (error) { el("catalog-progress").textContent=String(error.message || error); }
    finally { galleryToggle.disabled=false; }
  });
  galleryDay.addEventListener("change",() => selectGalleryDay(galleryDay.value));
  for (const [id,step] of [["catalog-gallery-prev-day",-1],["catalog-gallery-next-day",1]]) {
    el(id).addEventListener("click",() => {
      shiftGalleryDay(step);
    });
  }
  datePreset.addEventListener("change",() => {
    const today=new Date(); today.setHours(0,0,0,0);
    if (datePreset.value==="all") { dateFrom.value=""; dateTo.value=""; }
    else if (datePreset.value!=="custom") {
      const start=new Date(today);
      if (datePreset.value==="last7") start.setDate(start.getDate()-6);
      if (datePreset.value==="last30") start.setDate(start.getDate()-29);
      dateFrom.value=dateString(start); dateTo.value=dateString(today);
    }
    page=0; search();
  });
  for (const input of [dateFrom,dateTo]) input.addEventListener("change",() => { datePreset.value="custom"; page=0; search(); });
  for (const suffix of ["","-top"]) {
    el(`catalog-first${suffix}`).addEventListener("click",() => { if (page>0) { page=0; search(); } });
    el(`catalog-prev${suffix}`).addEventListener("click",() => { if (page>0) { page--; search(); } });
    el(`catalog-next${suffix}`).addEventListener("click",() => { if ((page+1)*24<total) { page++; search(); } });
    el(`catalog-last${suffix}`).addEventListener("click",() => { const last=Math.max(0,Math.ceil(total/24)-1); if (page<last) { page=last; search(); } });
  }
  el("catalog-delete-ack").addEventListener("change",() => { el("catalog-delete-permanent").disabled=!el("catalog-delete-ack").checked || deleteBusy; });
  el("catalog-delete-cancel").addEventListener("click",() => { if (!deleteBusy) deleteDialog.close(); });
  deleteDialog.addEventListener("close",() => { deletionPlan=null; });
  deleteDialog.addEventListener("cancel",(event) => { if (deleteBusy) event.preventDefault(); });
  async function confirmDeletion(mode) {
    if (!deletionPlan || deleteBusy || (mode === "permanent" && !el("catalog-delete-ack").checked)) return;
    deleteBusy=true;
    el("catalog-delete-error").textContent=td().busy;
    for (const id of ["catalog-delete-cancel","catalog-delete-trash","catalog-delete-permanent"]) el(id).disabled=true;
    try {
      const deletedId=deletionPlan.id;
      const result=await api("/api/catalog/delete",{ method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"delete-media"},body:JSON.stringify({id:deletedId,mode}) });
      deleteDialog.close();
      for (const side of ["A","B"]) if (selected[side]?.id === deletedId) selected[side]=null;
      marked.delete(deletedId);
      galleryActions.forget(deletedId);
      cleanupSelected.delete(deletedId);
      if (viewerItem?.id===deletedId) { if (imageDialog.open) imageDialog.close(); if (videoDialog.open) videoDialog.close(); viewerItem=null; }
      await refreshStatus();
      if (page>0 && page*24>=total-1) page--;
      await search();
      await refreshCleanup();
      el("catalog-progress").textContent=`${mode === "trash" ? td().doneTrash : td().donePermanent}${result.warning ? ` ${td().warning} ${result.warning}` : ""}`;
    } catch (error) { el("catalog-delete-error").textContent=`${td().error} ${error.message}`; }
    finally {
      deleteBusy=false;
      for (const id of ["catalog-delete-cancel","catalog-delete-trash"]) el(id).disabled=false;
      el("catalog-delete-permanent").disabled=!el("catalog-delete-ack").checked;
    }
  }
  el("catalog-delete-trash").addEventListener("click",() => confirmDeletion("trash"));
  el("catalog-delete-permanent").addEventListener("click",() => confirmDeletion("permanent"));
  document.getElementById("ui-language")?.addEventListener("change",translate);
  refreshStatus().then(() => {
    translate();
    if (status?.scan?.running) monitorCatalogScan();
    else if (autoScanToggle.checked && status?.roots?.length) void beginCatalogScan(true);
  });
  void refreshCleanup();
  return {compareIds:createTrialCatalogBridge({load:id=>api('/api/catalog/item?id='+encodeURIComponent(id)),isBusy:()=>compareBusy,isOpen:()=>compareDialog.open,apply:(a,b)=>{selected.A=a;selected.B=b;},open:openCompare})};
}

const creativeMemoryCopy = {
  EN:{title:"Creative echoes",intro:"Find earlier images and videos whose saved prompts share meaningful words with your current idea. Favorites rise to the top. Nothing is changed or uploaded.",find:"Find related creations",working:"Looking through the local archive…",emptyPrompt:"Write or generate a prompt first.",empty:"No close text matches yet. Try a more specific prompt, or refresh the archive below.",unavailable:"Start Prompt Studio with its local launcher to search your archive.",image:"Images",video:"Videos",both:"Both",matched:"Shared words",model:"Model",copy:"Copy earlier prompt",archive:"Find in archive",copied:"Earlier prompt copied.",copyError:"Could not copy the prompt.",error:"Could not search the archive.",prompt:"Earlier prompt"},
  HU:{title:"Alkotói visszhang",intro:"Megkeresi a jelenlegi ötletedhez szavaikban hasonló korábbi képeidet és videóidat. A kedvenceid előrébb kerülnek. Semmit nem módosít és nem tölt fel.",find:"Rokon alkotások keresése",working:"Keresek a helyi archívumban…",emptyPrompt:"Előbb írj vagy állíts össze egy promptot.",empty:"Most nincs közeli szöveges találat. Próbálj konkrétabb promptot, vagy frissítsd lent az archívumot.",unavailable:"Az archívum kereséséhez a Prompt Studio helyi indítóját használd.",image:"Képek",video:"Videók",both:"Mindkettő",matched:"Közös szavak",model:"Modell",copy:"Régi prompt másolása",archive:"Keresés az archívumban",copied:"A korábbi prompt a vágólapra került.",copyError:"Nem sikerült másolni a promptot.",error:"Nem sikerült keresni az archívumban.",prompt:"Korábbi prompt"},
  DE:{title:"Kreative Echos",intro:"Findet frühere Werke mit ähnlichen Wörtern im gespeicherten Prompt. Favoriten stehen höher; nichts wird geändert oder hochgeladen.",find:"Ähnliche Werke finden",working:"Suche im lokalen Archiv…",emptyPrompt:"Zuerst einen Prompt schreiben.",empty:"Keine ähnlichen Texttreffer. Versuche einen genaueren Prompt oder aktualisiere das Archiv.",unavailable:"Für die Suche den lokalen Starter verwenden.",image:"Bilder",video:"Videos",both:"Beides",matched:"Gemeinsame Wörter",model:"Modell",copy:"Früheren Prompt kopieren",archive:"Im Archiv suchen",copied:"Prompt kopiert.",copyError:"Kopieren fehlgeschlagen.",error:"Archivsuche fehlgeschlagen.",prompt:"Früherer Prompt"},
  FR:{title:"Échos créatifs",intro:"Retrouve les créations dont les prompts partagent des mots avec votre idée. Les favoris remontent; rien n'est modifié ni envoyé.",find:"Trouver des créations proches",working:"Recherche dans l'archive locale…",emptyPrompt:"Écrivez d'abord un prompt.",empty:"Aucun texte proche. Précisez le prompt ou actualisez l'archive.",unavailable:"Utilisez le lanceur local pour rechercher.",image:"Images",video:"Vidéos",both:"Les deux",matched:"Mots communs",model:"Modèle",copy:"Copier l'ancien prompt",archive:"Chercher dans l'archive",copied:"Prompt copié.",copyError:"Copie impossible.",error:"Recherche impossible.",prompt:"Ancien prompt"},
  ES:{title:"Ecos creativos",intro:"Busca obras anteriores con palabras similares en sus prompts. Prioriza favoritos; no modifica ni sube nada.",find:"Buscar obras relacionadas",working:"Buscando en el archivo local…",emptyPrompt:"Escribe primero un prompt.",empty:"Sin coincidencias cercanas. Prueba un prompt más concreto o actualiza el archivo.",unavailable:"Usa el iniciador local para buscar.",image:"Imágenes",video:"Vídeos",both:"Ambos",matched:"Palabras comunes",model:"Modelo",copy:"Copiar prompt anterior",archive:"Buscar en el archivo",copied:"Prompt copiado.",copyError:"No se pudo copiar.",error:"No se pudo buscar.",prompt:"Prompt anterior"},
  IT:{title:"Echi creativi",intro:"Trova lavori precedenti con parole simili nei prompt. I preferiti salgono; nulla viene modificato o caricato.",find:"Trova lavori simili",working:"Ricerca nell'archivio locale…",emptyPrompt:"Scrivi prima un prompt.",empty:"Nessuna corrispondenza. Prova un prompt più specifico o aggiorna l'archivio.",unavailable:"Usa il launcher locale per la ricerca.",image:"Immagini",video:"Video",both:"Entrambi",matched:"Parole comuni",model:"Modello",copy:"Copia prompt precedente",archive:"Cerca nell'archivio",copied:"Prompt copiato.",copyError:"Copia non riuscita.",error:"Ricerca non riuscita.",prompt:"Prompt precedente"},
  PT:{title:"Ecos criativos",intro:"Encontra obras anteriores com palavras semelhantes nos prompts. Favoritos aparecem primeiro; nada é alterado nem enviado.",find:"Encontrar obras relacionadas",working:"A pesquisar no arquivo local…",emptyPrompt:"Escreva primeiro um prompt.",empty:"Sem correspondências próximas. Experimente um prompt mais específico ou atualize o arquivo.",unavailable:"Use o launcher local para pesquisar.",image:"Imagens",video:"Vídeos",both:"Ambos",matched:"Palavras comuns",model:"Modelo",copy:"Copiar prompt anterior",archive:"Pesquisar no arquivo",copied:"Prompt copiado.",copyError:"Não foi possível copiar.",error:"Não foi possível pesquisar.",prompt:"Prompt anterior"},
  PL:{title:"Twórcze echa",intro:"Znajduje wcześniejsze prace o podobnych słowach w promptach. Ulubione są wyżej; niczego nie zmienia ani nie wysyła.",find:"Znajdź podobne prace",working:"Przeszukiwanie lokalnego archiwum…",emptyPrompt:"Najpierw napisz prompt.",empty:"Brak podobnych wyników. Uściślij prompt lub odśwież archiwum.",unavailable:"Użyj lokalnego programu uruchamiającego.",image:"Obrazy",video:"Filmy",both:"Oba",matched:"Wspólne słowa",model:"Model",copy:"Kopiuj wcześniejszy prompt",archive:"Szukaj w archiwum",copied:"Prompt skopiowany.",copyError:"Nie udało się skopiować.",error:"Wyszukiwanie nie powiodło się.",prompt:"Wcześniejszy prompt"}
};

export function attachCreativeMemory({getLanguage,getCurrent}) {
  const host=document.querySelector(".result-column");
  if (!host) return;
  const panel=document.createElement("section"); panel.className="creative-memory result-card";
  panel.innerHTML=`<div class="result-heading"><div><span class="eyebrow">DISCOVER / 03</span><h2 data-echo-title></h2></div><span class="result-spark">✦</span></div>
    <div class="creative-memory-body"><p data-echo-intro></p><div class="creative-memory-controls"><select data-echo-kind></select><button type="button" class="secondary-action" data-echo-find></button></div>
    <p data-echo-status role="status" aria-live="polite"></p><div class="creative-memory-results" data-echo-results></div></div>`;
  host.insertBefore(panel,host.querySelector(".media-catalog") || host.querySelector(".side-tip"));
  const el=(name)=>panel.querySelector(`[data-echo-${name}]`),t=()=>creativeMemoryCopy[getLanguage()] || creativeMemoryCopy.EN;
  const kind=el("kind"),find=el("find"),status=el("status"),results=el("results");
  const currentKind=()=>["video","i2v"].includes(getCurrent()?.mode)?"video":"image";
  let kindTouched=false;
  kind.addEventListener("change",()=>{kindTouched=true;});
  function translate() {
    el("title").textContent=t().title; el("intro").textContent=t().intro; find.textContent=t().find;
    const selected=kind.value;
    kind.replaceChildren(...[["image",t().image],["video",t().video],["",t().both]].map(([value,label])=>{
      const option=document.createElement("option");option.value=value;option.textContent=label;return option;
    }));kind.value=selected;
  }
  translate();kind.value=currentKind();
  document.getElementById("ui-language")?.addEventListener("change",translate);
  const button=(label,action)=>{const node=document.createElement("button");node.type="button";node.textContent=label;node.addEventListener("click",action);return node;};
  function showArchive(item) {
    const field=document.getElementById("catalog-query");if(!field)return;
    for(const [id,value] of [["catalog-kind",item.kind],["catalog-prompt-filter",""],["catalog-root",""],["catalog-category-filter",""],["catalog-rating-filter",""]]) {
      const filter=document.getElementById(id);if(filter){filter.value=value;filter.dispatchEvent(new Event("change",{bubbles:true}));}
    }
    field.value=item.filename;field.dispatchEvent(new Event("input",{bubbles:true}));
    field.scrollIntoView({behavior:"smooth",block:"center"});field.focus();
  }
  function renderItem(item) {
    const card=document.createElement("article");card.className="creative-memory-item";
    const heading=document.createElement("strong");heading.textContent=`${item.kind==="video"?"▶":"▣"} ${item.filename}`;card.append(heading);
    const detail=document.createElement("small");detail.textContent=[item.rating?"★".repeat(item.rating):"",item.category,item.model?`${t().model}: ${item.model}`:""].filter(Boolean).join(" · ");if(detail.textContent)card.append(detail);
    const matched=document.createElement("p");matched.textContent=`${t().matched}: ${item.matched.join(", ")}`;card.append(matched);
    const actions=document.createElement("div");actions.className="creative-memory-actions";
    actions.append(button(t().copy,async()=>{try{await navigator.clipboard.writeText(item.prompt);status.textContent=t().copied;}catch{status.textContent=t().copyError;}}),button(t().archive,()=>showArchive(item)));
    card.append(actions);
    const prompt=document.createElement("details"),summary=document.createElement("summary"),body=document.createElement("p");
    summary.textContent=t().prompt;body.textContent=item.prompt;prompt.append(summary,body);card.append(prompt);return card;
  }
  find.addEventListener("click",async()=>{
    const current=getCurrent(),prompt=String(current?.prompt || "").trim();
    if(!prompt){status.textContent=t().emptyPrompt;return;}
    if(!kindTouched)kind.value=currentKind();
    find.disabled=true;status.textContent=t().working;results.replaceChildren();
    const params=new URLSearchParams({q:prompt.slice(0,1800),kind:kind.value,model:current?.model || ""});
    try{
      const response=await fetch(`/api/catalog/creative-memory?${params}`,{cache:"no-store"});
      if(!response.ok)throw new Error(String(response.status));
      const data=await response.json();results.replaceChildren(...(data.results || []).map(renderItem));
      status.textContent=data.results?.length?"":t().empty;
    }catch{status.textContent=location.protocol==="file:"?t().unavailable:t().error;}
    finally{find.disabled=false;}
  });
}
