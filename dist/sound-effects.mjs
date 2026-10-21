export const soundEffectOptions = {
  nature: { EN:"Nature ambience", HU:"Természeti háttér", DE:"Naturatmosphäre", FR:"Ambiance naturelle", ES:"Ambiente natural", IT:"Ambiente naturale", PT:"Ambiente natural", PL:"Odgłosy natury", instruction:"subtle natural ambience" },
  wind: { EN:"Wind", HU:"Szél", DE:"Wind", FR:"Vent", ES:"Viento", IT:"Vento", PT:"Vento", PL:"Wiatr", instruction:"soft wind" },
  water: { EN:"Water", HU:"Víz", DE:"Wasser", FR:"Eau", ES:"Agua", IT:"Acqua", PT:"Água", PL:"Woda", instruction:"natural water sounds" },
  footsteps: { EN:"Footsteps", HU:"Lépések", DE:"Schritte", FR:"Pas", ES:"Pasos", IT:"Passi", PT:"Passos", PL:"Kroki", instruction:"footsteps matching the visible movement and surface" },
  fabric: { EN:"Clothing rustle", HU:"Ruha suhogása", DE:"Kleidung raschelt", FR:"Froissement de tissu", ES:"Roce de ropa", IT:"Fruscio dei vestiti", PT:"Roçar da roupa", PL:"Szelest ubrania", instruction:"subtle clothing rustle synchronized with movement" },
  city: { EN:"City ambience", HU:"Városi háttér", DE:"Stadtatmosphäre", FR:"Ambiance urbaine", ES:"Ambiente urbano", IT:"Ambiente cittadino", PT:"Ambiente urbano", PL:"Odgłosy miasta", instruction:"distant city ambience" },
  crowd: { EN:"Distant crowd", HU:"Távoli tömeg", DE:"Ferne Menschenmenge", FR:"Foule lointaine", ES:"Multitud lejana", IT:"Folla lontana", PT:"Multidão distante", PL:"Odległy tłum", instruction:"quiet distant crowd murmur without intelligible dialogue" },
  mechanical: { EN:"Mechanical sounds", HU:"Mechanikus hangok", DE:"Mechanische Geräusche", FR:"Sons mécaniques", ES:"Sonidos mecánicos", IT:"Suoni meccanici", PT:"Sons mecânicos", PL:"Dźwięki mechaniczne", instruction:"subtle mechanical sounds motivated by visible objects" }
};

export function soundEffectsInstruction(selected = [], custom = "") {
  const valid = [...new Set(selected)].filter((key) => Object.hasOwn(soundEffectOptions, key));
  const parts = valid.map((key) => soundEffectOptions[key].instruction);
  const extra = String(custom || "").trim().slice(0, 400);
  if (extra) parts.push(extra);
  if (!parts.length) return "No sound effects requested. Do not invent music, narration, or dialogue.";
  return `Optional sound-effects plan, only if the chosen workflow supports audio: ${parts.join("; ")}. Keep sounds restrained, natural, and synchronized with visible events. Do not invent music, narration, or dialogue unless the user explicitly asks.`;
}
