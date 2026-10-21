import { compareCatalogItems, catalogCompareCopy, experimentStorageKey, createExperimentEntry, normalizeExperimentEntries } from "./catalog-compare.mjs";
import { mixArchivedPrompts } from "./creative-forge.mjs";

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
const viewerToolbar = `<div class="catalog-viewer-toolbar">
  <div class="catalog-viewer-navigation"><button type="button" data-viewer-prev></button><span data-viewer-position></span><button type="button" data-viewer-next></button></div>
  <label class="catalog-viewer-select"><input type="checkbox" data-viewer-mark><span data-viewer-select-label></span></label>
  <div class="catalog-viewer-stars" data-viewer-stars></div><button type="button" data-viewer-clear></button>
  <select data-viewer-category></select><button type="button" data-viewer-delete></button>
  <span data-viewer-status role="status"></span>
</div>`;
const viewerPrompt = `<section class="catalog-viewer-prompt">
  <strong data-viewer-positive-title></strong><pre data-viewer-positive></pre>
  <strong data-viewer-negative-title></strong><pre data-viewer-negative></pre>
  <div class="catalog-viewer-copy-actions"><button type="button" data-viewer-copy-prompt></button><button type="button" data-viewer-copy-recipe></button></div>
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
const mixerCopy={
  EN:{title:"Idea cross-pollinator",help:"Take the scene from one saved work and the visual treatment from the other. This is an editable draft, not an automatic merge of all settings.",image:"Image",video:"Video",swap:"Swap roles",generate:"Mix the ideas",scene:"Scene",look:"Visual direction",use:"Use in editor",copy:"Copy draft",needPrompts:"Both selected files need readable prompts.",confirm:"Replace the current edited prompt with this draft?",used:"Draft loaded for editing.",copied:"Draft copied.",copyError:"Could not copy the draft."},
  HU:{title:"Ötletkeresztező",help:"Az egyik alkotás jelenetét a másik képi hangulatával ötvözi. Ez szerkeszthető vázlat, nem az összes beállítás automatikus összemosása.",image:"Kép",video:"Videó",swap:"Szerepek felcserélése",generate:"Ötletek keresztezése",scene:"Jelenet",look:"Képi világ",use:"Átvitel a szerkesztőbe",copy:"Vázlat másolása",needPrompts:"Mindkét kijelölt fájlhoz kiolvasható prompt kell.",confirm:"Lecseréljem a most szerkesztett promptot erre a vázlatra?",used:"A vázlat szerkesztésre betöltve.",copied:"A vázlat a vágólapra került.",copyError:"Nem sikerült másolni a vázlatot."},
  DE:{title:"Ideenkreuzung",help:"Szene aus einem Werk, Bildstimmung aus dem anderen. Bearbeitbarer Entwurf; Einstellungen werden nicht automatisch gemischt.",image:"Bild",video:"Video",swap:"Rollen tauschen",generate:"Ideen mischen",scene:"Szene",look:"Bildsprache",use:"Im Editor verwenden",copy:"Entwurf kopieren",needPrompts:"Beide Dateien brauchen lesbare Prompts.",confirm:"Aktuellen Prompt ersetzen?",used:"Entwurf im Editor.",copied:"Entwurf kopiert.",copyError:"Kopieren fehlgeschlagen."},
  FR:{title:"Croisement d'idées",help:"La scène d'une œuvre, l'ambiance visuelle de l'autre. Brouillon modifiable; les réglages ne sont pas fusionnés.",image:"Image",video:"Vidéo",swap:"Inverser les rôles",generate:"Croiser les idées",scene:"Scène",look:"Style visuel",use:"Utiliser dans l'éditeur",copy:"Copier le brouillon",needPrompts:"Deux prompts lisibles sont nécessaires.",confirm:"Remplacer le prompt actuel ?",used:"Brouillon dans l'éditeur.",copied:"Brouillon copié.",copyError:"Copie impossible."},
  ES:{title:"Cruce de ideas",help:"La escena de una obra y el estilo visual de otra. Borrador editable; no mezcla todos los ajustes.",image:"Imagen",video:"Vídeo",swap:"Intercambiar papeles",generate:"Cruzar ideas",scene:"Escena",look:"Estilo visual",use:"Usar en el editor",copy:"Copiar borrador",needPrompts:"Ambos archivos necesitan prompts legibles.",confirm:"¿Reemplazar el prompt actual?",used:"Borrador en el editor.",copied:"Borrador copiado.",copyError:"No se pudo copiar."},
  IT:{title:"Incrocio di idee",help:"La scena di un'opera e l'atmosfera visiva dell'altra. Bozza modificabile; le impostazioni non vengono unite.",image:"Immagine",video:"Video",swap:"Scambia ruoli",generate:"Incrocia le idee",scene:"Scena",look:"Stile visivo",use:"Usa nell'editor",copy:"Copia bozza",needPrompts:"Servono due prompt leggibili.",confirm:"Sostituire il prompt attuale?",used:"Bozza nell'editor.",copied:"Bozza copiata.",copyError:"Copia non riuscita."},
  PT:{title:"Cruzamento de ideias",help:"A cena de uma obra e a atmosfera visual de outra. Rascunho editável; não combina todas as definições.",image:"Imagem",video:"Vídeo",swap:"Trocar papéis",generate:"Cruzar ideias",scene:"Cena",look:"Estilo visual",use:"Usar no editor",copy:"Copiar rascunho",needPrompts:"São necessários dois prompts legíveis.",confirm:"Substituir o prompt atual?",used:"Rascunho no editor.",copied:"Rascunho copiado.",copyError:"Não foi possível copiar."},
  PL:{title:"Krzyżowanie pomysłów",help:"Scena z jednej pracy, nastrój wizualny z drugiej. Edytowalny szkic; ustawienia nie są automatycznie łączone.",image:"Obraz",video:"Wideo",swap:"Zamień role",generate:"Połącz pomysły",scene:"Scena",look:"Styl wizualny",use:"Użyj w edytorze",copy:"Kopiuj szkic",needPrompts:"Oba pliki muszą mieć czytelne prompty.",confirm:"Zastąpić obecny prompt?",used:"Szkic w edytorze.",copied:"Szkic skopiowany.",copyError:"Nie udało się skopiować."}
};
export function attachMediaCatalog({ getLanguage, getCurrent, restore, onLinkVideo, getLinkVideoLabel }) {
  const host = document.querySelector(".result-column");
  const panel = document.createElement("section"); panel.className = "media-catalog result-card";
  panel.innerHTML = `<div class="result-heading"><div><span class="eyebrow">ARCHIVE / 02</span><h2 id="catalog-title"></h2></div><span class="result-spark">⌕</span></div>
    <div class="catalog-body"><p id="catalog-intro"></p><div id="catalog-roots" class="catalog-roots"></div>
      <div class="catalog-add"><input id="catalog-root-input" maxlength="400"><button type="button" id="catalog-add-root" class="quiet-action"></button></div>
      <button type="button" id="catalog-scan" class="secondary-action"></button><p id="catalog-progress" role="status" aria-live="polite"></p>
      <label class="catalog-thumbnail-toggle"><input id="catalog-show-thumbnails" type="checkbox"><span id="catalog-show-thumbnails-label"></span></label>
      <div class="catalog-compare-picker"><strong id="catalog-compare-picker-title"></strong><span id="catalog-compare-slot-a"></span><span id="catalog-compare-slot-b"></span>
        <button type="button" id="catalog-compare-open" class="secondary-action" disabled></button><button type="button" id="catalog-mixer-open" class="secondary-action" disabled></button><button type="button" id="catalog-compare-clear" class="quiet-action"></button></div>
      <details id="catalog-journal" class="catalog-journal"><summary id="catalog-journal-summary"></summary>
        <p id="catalog-journal-help"></p><input id="catalog-journal-query" type="search"><div class="catalog-journal-tools">
          <button type="button" id="catalog-journal-export" class="quiet-action"></button>
          <button type="button" id="catalog-journal-import" class="quiet-action"></button>
          <input id="catalog-journal-file" type="file" accept=".json,application/json" hidden>
        </div><p id="catalog-journal-status" role="status"></p><div id="catalog-journal-list"></div></details>
      <div class="catalog-filters"><input id="catalog-query" type="search" maxlength="200"><select id="catalog-kind"></select><select id="catalog-prompt-filter"></select><select id="catalog-root"></select></div>
      <div class="catalog-organize"><select id="catalog-category-filter"></select><select id="catalog-rating-filter"></select>
        <input id="catalog-new-category" maxlength="50"><button type="button" id="catalog-add-category" class="quiet-action"></button></div>
      <p id="catalog-count"></p><p id="catalog-marked-count"></p><div id="catalog-results" class="catalog-results"></div>
      <div class="catalog-pager"><button type="button" id="catalog-prev" class="quiet-action"></button><span id="catalog-page"></span><button type="button" id="catalog-next" class="quiet-action"></button></div></div>
    <dialog id="catalog-delete-dialog" class="catalog-delete-dialog" aria-labelledby="catalog-delete-title">
      <h3 id="catalog-delete-title"></h3><p id="catalog-delete-explanation"></p><ul id="catalog-delete-files"></ul>
      <label class="catalog-delete-ack"><input id="catalog-delete-ack" type="checkbox"><span id="catalog-delete-ack-label"></span></label>
      <p id="catalog-delete-error" role="alert"></p><div class="catalog-delete-actions">
        <button type="button" id="catalog-delete-cancel"></button><button type="button" id="catalog-delete-trash"></button><button type="button" id="catalog-delete-permanent"></button>
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
      <section id="catalog-idea-mixer" class="catalog-idea-mixer"><h4 id="catalog-mixer-title"></h4><p id="catalog-mixer-help"></p>
        <div class="catalog-mixer-controls"><select id="catalog-mixer-kind"></select><button type="button" id="catalog-mixer-swap" class="quiet-action"></button><button type="button" id="catalog-mixer-generate" class="secondary-action"></button></div>
        <p id="catalog-mixer-sources"></p><textarea id="catalog-mixer-output" rows="5"></textarea>
        <div class="catalog-mixer-actions"><button type="button" id="catalog-mixer-use" class="secondary-action"></button><button type="button" id="catalog-mixer-copy" class="quiet-action"></button></div>
        <p id="catalog-mixer-status" role="status" aria-live="polite"></p>
      </section>
      <section class="catalog-experiment-save"><h4 id="catalog-experiment-heading"></h4>
        <input id="catalog-experiment-title" maxlength="120">
        <select id="catalog-experiment-preferred"></select>
        <textarea id="catalog-experiment-reason" maxlength="1200" rows="3"></textarea>
        <div class="catalog-experiment-times"><input id="catalog-experiment-time-a" type="number" min="0" max="10000" step="0.01">
          <input id="catalog-experiment-time-b" type="number" min="0" max="10000" step="0.01"></div>
        <button type="button" id="catalog-experiment-save" class="secondary-action"></button><p id="catalog-experiment-status" role="status"></p>
      </section>
    </dialog>`;
  host.insertBefore(panel, host.querySelector(".side-tip"));
  const el = (id) => panel.querySelector(`#${id}`), t = () => ({ ...catalogCopy.EN, ...catalogPromptCopy.EN, ...catalogOrganizeCopy.EN,
    ...(catalogCopy[getLanguage()] || {}), ...(catalogPromptCopy[getLanguage()] || {}), ...(catalogOrganizeCopy[getLanguage()] || {}) });
  const td = () => ({ ...catalogDeleteCopy.EN, ...(catalogDeleteCopy[getLanguage()] || {}) });
  const query = el("catalog-query"), kind = el("catalog-kind"), root = el("catalog-root"), promptFilter = el("catalog-prompt-filter"),
    categoryFilter = el("catalog-category-filter"), ratingFilter = el("catalog-rating-filter"), results = el("catalog-results");
  const deleteDialog = el("catalog-delete-dialog");
  const imageDialog = el("catalog-image-dialog");
  const videoDialog = el("catalog-video-dialog");
  const compareDialog = el("catalog-compare-dialog");
  const ti = () => ({ ...catalogImageCopy.EN, ...(catalogImageCopy[getLanguage()] || {}) });
  const tp = () => ({ ...catalogPrivacyCopy.EN, ...(catalogPrivacyCopy[getLanguage()] || {}) });
  const tb = () => ({ ...catalogBridgeCopy.EN, ...(catalogBridgeCopy[getLanguage()] || {}) });
  const tv = () => ({ ...catalogVideoCopy.EN, ...(catalogVideoCopy[getLanguage()] || {}) });
  const tc = () => ({ ...catalogCompareCopy.EN, ...(catalogCompareCopy[getLanguage()] || {}) });
  const tm = () => mixerCopy[getLanguage()] || mixerCopy.EN;
  const tj = () => ({ ...journalCopy.EN, ...(journalCopy[getLanguage()] || {}) });
  const tw = () => ({ ...catalogViewerCopy.EN, ...(catalogViewerCopy[getLanguage()] || {}) });
  const tr = () => recipeLabels(getLanguage());
  let status = null, page = 0, total = 0, timer = null, delay = null, deletionPlan = null, deleteBusy = false, deletePreparing = false, previewItem = null;
  let visibleItems = [], viewerItem = null, viewerIndex = 0, viewerBusy = false;
  const marked = new Set();
  const selected = { A:null, B:null };
  let compareVisible = false, compareRevision = 0, compareBusy = false, visualController = null;
  let mixerSwapped = false;
  const api = async (path, options) => {
    const response = await fetch(path,options);
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || String(response.status));
    return response.json();
  };
  const mediaUrl = (item) => `/api/catalog/media?id=${encodeURIComponent(item.id)}`;
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
      actions.append(reopen,remove);card.append(summary,files,winner,reason,changes,prompt,timing,actions);list.append(card);
    }
  }
  function renderJournalForm(){
    for(const [id,key] of [["catalog-experiment-heading","journal"],["catalog-experiment-save","save"]])el(id).textContent=tj()[key];
    for(const [id,key] of [["catalog-experiment-title","title"],["catalog-experiment-reason","reason"],["catalog-experiment-time-a","timeA"],["catalog-experiment-time-b","timeB"]]){
      el(id).placeholder=tj()[key];el(id).setAttribute("aria-label",tj()[key]);
    }
    const select=el("catalog-experiment-preferred"),old=select.value;
    select.replaceChildren(...[["none","none"],["A","a"],["B","b"],["tie","tie"]].map(([value,key])=>new Option(tj()[key],value)));
    select.value=old||"none";select.setAttribute("aria-label",tj().preferred);
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
    find("position").textContent=`${absolute+1} ${tw().of} ${total}`;
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
    find("category").disabled=viewerBusy;
    find("delete").disabled=viewerBusy;
  }
  function activeViewerDialog() { return imageDialog.open ? imageDialog : videoDialog.open ? videoDialog : null; }
  function renderViewerPrompt(item,dialog) {
    const labels=tr(), find=(name) => dialog.querySelector(`[data-viewer-${name}]`);
    find("positive-title").textContent=labels.positive;
    find("negative-title").textContent=labels.negative;
    find("positive").textContent=item.prompt || labels.unknown;
    find("negative").textContent=item._catalogDetailsReady ? item.negative || labels.unknown : labels.loading;
    find("copy-prompt").textContent=labels.copyPrompt;
    find("copy-recipe").textContent=labels.copyRecipe;
    find("copy-prompt").disabled=!item._catalogDetailsReady || !item.prompt;
    find("copy-recipe").disabled=!item._catalogDetailsReady;
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
    dialog.querySelector("[data-viewer-copy-prompt]").addEventListener("click",() => { void copyViewerContent(dialog,"prompt"); });
    dialog.querySelector("[data-viewer-copy-recipe]").addEventListener("click",() => { void copyViewerContent(dialog,"recipe"); });
    dialog.addEventListener("keydown",(event) => {
      if (event.target.closest("video,select,input,textarea") || !["ArrowLeft","ArrowRight"].includes(event.key)) return;
      event.preventDefault(); void navigateViewer(event.key==="ArrowLeft" ? -1 : 1);
    });
  }
  function showVideo(item) {
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
    el("catalog-mixer-open").disabled=compareBusy || !selected.A || !selected.B;
    el("catalog-mixer-open").textContent=tm().title;
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
    renderMixerText();
  }
  function renderMixerText() {
    for(const [id,key] of [["catalog-mixer-title","title"],["catalog-mixer-help","help"],["catalog-mixer-swap","swap"],
      ["catalog-mixer-generate","generate"],["catalog-mixer-use","use"],["catalog-mixer-copy","copy"]])el(id).textContent=tm()[key];
    const outputKind=el("catalog-mixer-kind"),old=outputKind.value||"image";
    outputKind.replaceChildren(new Option(tm().image,"image"),new Option(tm().video,"video"));outputKind.value=old;
    el("catalog-mixer-output").setAttribute("aria-label",tm().title);
    el("catalog-mixer-generate").disabled=!selected.A?.prompt||!selected.B?.prompt;
    const ready=Boolean(el("catalog-mixer-output").value.trim());
    el("catalog-mixer-use").disabled=!ready;el("catalog-mixer-copy").disabled=!ready;
  }
  function generateMix() {
    const result=mixArchivedPrompts(selected.A,selected.B,{swap:mixerSwapped,kind:el("catalog-mixer-kind").value});
    if(!result){el("catalog-mixer-status").textContent=tm().needPrompts;return;}
    el("catalog-mixer-output").value=result.prompt;
    el("catalog-mixer-sources").textContent=`${tm().scene}: ${result.sceneFilename} · ${tm().look}: ${result.lookFilename}`;
    el("catalog-mixer-status").textContent="";renderMixerText();
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
    const promptRow=document.createElement("tr"); promptRow.dataset.state=data.prompt.state;
    for (const value of [tc().prompt,data.prompt.state === "unknown" ? tc().unknown : data.prompt.state === "same" ? tc().same : tc().different,
      data.prompt.state === "different" ? `${tc().onlyA}: ${data.prompt.onlyA.join(", ") || tc().none} · ${tc().onlyB}: ${data.prompt.onlyB.join(", ") || tc().none}` : "—"]) {
      const cell=document.createElement("td"); cell.textContent=value; promptRow.append(cell);
    }
    body.append(promptRow); table.append(body); facts.replaceChildren(table);
    el("catalog-compare-tradeoffs").replaceChildren(...data.notes.map((note) => {
      const li=document.createElement("li"); li.textContent=(tc()[note.key] || "").replace("{side}",note.side || ""); return li;
    }));
  }
  async function openCompare(focusMixer=false) {
    if (!selected.A || !selected.B || compareBusy) return;
    compareBusy=true; renderSelection(); el("catalog-progress").textContent=tc().checking;
    const pair=[selected.A,selected.B], revision=++compareRevision;
    try {
      const responses=await Promise.all(pair.map((item) => api(`/api/catalog/settings?id=${encodeURIComponent(item.id)}`)));
      if (revision !== compareRevision || selected.A?.id !== pair[0].id || selected.B?.id !== pair[1].id) return;
      for (const [index,detail] of responses.entries()) { pair[index].settings=detail.settings || {}; pair[index].model=detail.model || pair[index].model; }
      compareVisible=el("catalog-show-thumbnails").checked;
      fillCompareText(); renderCompareMedia(); renderCompareFacts();
      el("catalog-experiment-title").value="";
      el("catalog-experiment-preferred").value="none";
      el("catalog-experiment-reason").value="";
      el("catalog-experiment-time-a").value="";
      el("catalog-experiment-time-b").value="";
      el("catalog-experiment-status").textContent="";
      el("catalog-experiment-save").disabled=false;
      el("catalog-compare-visual-status").textContent=""; el("catalog-compare-visual-result").replaceChildren();
      mixerSwapped=false;el("catalog-mixer-kind").value=selected.A.kind==="video"?"video":"image";
      el("catalog-mixer-output").value="";el("catalog-mixer-sources").textContent="";el("catalog-mixer-status").textContent="";renderMixerText();
      el("catalog-progress").textContent=""; compareDialog.showModal();
      if(focusMixer)requestAnimationFrame(()=>el("catalog-idea-mixer").scrollIntoView({behavior:"smooth",block:"start"}));
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
    for (const [id,key] of [["catalog-delete-title","title"],["catalog-delete-explanation","explanation"],["catalog-delete-ack-label","acknowledge"],["catalog-delete-cancel","cancel"],["catalog-delete-trash","trash"],["catalog-delete-permanent","permanent"]]) el(id).textContent = td()[key];
    el("catalog-image-close").textContent = ti().close;
    el("catalog-image-open").textContent = ti().open;
    el("catalog-video-close").textContent = tv().close;
    el("catalog-video-hint").textContent = tv().hint;
    el("catalog-show-thumbnails-label").textContent = tp().show;
    el("catalog-root-input").placeholder = t().root; query.placeholder = t().search;
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
    if (compareDialog.open) { renderCompareMedia(); renderCompareFacts(); }
    const dialog=activeViewerDialog(); if (dialog) renderViewerToolbar(dialog);
    renderStatus(); search();
  }
  function renderStatus() {
    el("catalog-roots").replaceChildren(...(status?.roots || []).map((value) => {
      const span = document.createElement("span"); span.textContent = value; span.title = value; return span;
    }));
    const progress = el("catalog-progress");
    if (!status) { progress.textContent = t().offline; return; }
    const info = status.scan;
    progress.textContent = info.running
      ? `${t().scanning} ${info.scanned} · ${info.found} ${t().indexed}`
      : info.message ? `${t().scanError} ${info.message}`
      : status.scannedAt ? `${status.indexed} ${t().files} · ${status.withPrompt} ${t().indexed} · ${status.rated || 0} ${t().rated} · ${status.skipped} ${t().skipped} · ${status.errors} ${t().errors}`
      : t().notScanned;
    el("catalog-scan").disabled = info.running;
  }
  async function refreshStatus() {
    try { status = await api("/api/catalog/status"); renderStatus(); }
    catch { status = null; renderStatus(); }
  }
  function resultRow(item) {
    const row = document.createElement("article"); row.className = "catalog-item"; row.dataset.catalogId=item.id;
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
      restore({ mode:item.kind === "image" ? "image" : "video", prompt:item.prompt, negative:item.negative||"", language:"EN", model:item.model });
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
  function showImage(item) {
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
  el("catalog-image-close").addEventListener("click",() => imageDialog.close());
  imageDialog.addEventListener("close",() => { previewItem=null; el("catalog-image-large").removeAttribute("src"); if (!videoDialog.open) viewerItem=null; });
  el("catalog-video-close").addEventListener("click",() => videoDialog.close());
  videoDialog.addEventListener("close",() => {
    const player = el("catalog-video-player");
    player.pause(); player.removeAttribute("src"); player.removeAttribute("poster"); player.load();
    if (!imageDialog.open) viewerItem=null;
  });
  el("catalog-compare-open").addEventListener("click",() => { void openCompare(); });
  el("catalog-mixer-open").addEventListener("click",() => { void openCompare(true); });
  el("catalog-compare-clear").addEventListener("click",() => { selected.A=null; selected.B=null; renderSelection(); });
  el("catalog-mixer-generate").addEventListener("click",generateMix);
  el("catalog-mixer-swap").addEventListener("click",()=>{mixerSwapped=!mixerSwapped;generateMix();});
  el("catalog-mixer-output").addEventListener("input",renderMixerText);
  el("catalog-mixer-use").addEventListener("click",()=>{
    const prompt=el("catalog-mixer-output").value.trim();if(!prompt)return;
    if(getCurrent()?.prompt?.trim()&&!window.confirm(tm().confirm))return;
    const outputKind=el("catalog-mixer-kind").value;
    compareDialog.close();restore({mode:outputKind,prompt,language:"EN",model:""});
    el("catalog-progress").textContent=tm().used;
    document.querySelector(".result-column")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  el("catalog-mixer-copy").addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(el("catalog-mixer-output").value);el("catalog-mixer-status").textContent=tm().copied;}
    catch{el("catalog-mixer-status").textContent=tm().copyError;}
  });
  el("catalog-experiment-save").addEventListener("click",()=>{
    if(!selected.A||!selected.B||!compareDialog.open)return;
    const saveButton=el("catalog-experiment-save");if(saveButton.disabled)return;
    saveButton.disabled=true;
    const entry=createExperimentEntry(selected.A,selected.B,{
      title:el("catalog-experiment-title").value,preferred:el("catalog-experiment-preferred").value,
      reason:el("catalog-experiment-reason").value,runMinutesA:el("catalog-experiment-time-a").value,
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
    stopHoverPreview();
    detailObserver?.disconnect(); detailQueue.length=0;
    posterObserver?.disconnect(); posterQueue.length = 0;
    if (!status) { visibleItems=[]; results.replaceChildren(); return; }
    const params = new URLSearchParams({ q:query.value, kind:kind.value, root:root.value, prompt:promptFilter.value,
      category:categoryFilter.value, rating:ratingFilter.value, page:String(page) });
    try {
      const data=await api(`/api/catalog/search?${params}`); total=data.total; visibleItems=data.results;
      results.replaceChildren(...data.results.map(resultRow));
      renderSelection(); renderMarked();
      if (!data.results.length) { const message=document.createElement("p"); message.textContent=t().empty; results.append(message); }
      el("catalog-count").textContent=`${total} ${t().result}`;
      el("catalog-page").textContent=`${t().page} ${page+1} / ${Math.max(1,Math.ceil(total/24))}`;
      el("catalog-prev").disabled=page===0; el("catalog-next").disabled=(page+1)*24>=total;
    } catch { visibleItems=[]; results.replaceChildren(); }
  }
  el("catalog-add-root").addEventListener("click", async () => {
    const input=el("catalog-root-input"), value=input.value.trim(); if (!value) return;
    try { status=await api("/api/catalog/roots",{ method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:value}) }); input.value=""; translate(); el("catalog-progress").textContent=t().newRoot; }
    catch (error) { el("catalog-progress").textContent=`${t().badRoot} ${error.message}`; }
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
  el("catalog-scan").addEventListener("click", async () => {
    try {
      await api("/api/catalog/scan",{method:"POST"}); await refreshStatus();
      clearInterval(timer);
      timer=setInterval(async () => { await refreshStatus(); if (!status?.scan?.running) { clearInterval(timer); timer=null; page=0; search(); } },1000);
    } catch { el("catalog-progress").textContent=t().offline; }
  });
  query.addEventListener("input", () => { clearTimeout(delay); delay=setTimeout(() => { page=0; search(); },250); });
  for (const input of [kind,root,promptFilter,categoryFilter,ratingFilter]) input.addEventListener("change",() => { page=0; search(); });
  el("catalog-prev").addEventListener("click",() => { if (page>0) { page--; search(); } });
  el("catalog-next").addEventListener("click",() => { if ((page+1)*24<total) { page++; search(); } });
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
      if (viewerItem?.id===deletedId) { if (imageDialog.open) imageDialog.close(); if (videoDialog.open) videoDialog.close(); viewerItem=null; }
      await refreshStatus();
      if (page>0 && page*24>=total-1) page--;
      await search();
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
  refreshStatus().then(translate);
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
