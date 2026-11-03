export const LEVELS = [
  {title:'La primera gota', note:'Dos jarras, una medida pequeña.', capacities:[2,3], goal:[1,0]},
  {title:'Luz en el patio', note:'La diferencia entre dos medidas abre el camino.', capacities:[3,5], goal:[0,4]},
  {title:'El pozo tranquilo', note:'Vaciar también puede acercarte al objetivo.', capacities:[4,7], goal:[2,7]},
  {title:'Tres reflejos', note:'Una tercera jarra ofrece otro lugar donde pensar.', capacities:[3,5,8], goal:[2,5,7]},
  {title:'Antes del sol', note:'Guarda pequeñas cantidades antes del último traslado.', capacities:[5,7,9], goal:[0,1,3]},
  {title:'El alba completa', note:'Combina las tres capacidades, sin prisa.', capacities:[5,8,11], goal:[1,8,9]}
].map(level=>Object.freeze({...level, capacities:Object.freeze(level.capacities),goal:Object.freeze(level.goal)}));
Object.freeze(LEVELS);
