import {LEVELS} from './levels.js';
import {KEY,MAX_MOVES,initial,apply,won,amountsOf,move,undo,decode} from './engine.js';
const $=id=>document.querySelector('#'+id);
const letters=['A','B','C'];
let raw=null,storageOK=true;
try{raw=localStorage.getItem(KEY);}catch{storageOK=false;}
let state=decode(raw),selected=null,pending=null,returnFocus=null;
const board=$('board'),dialog=$('confirm');
function storageNotice(){ $('storage').textContent=storageOK?'Tu progreso se guarda solo en este navegador. Sin cuentas ni seguimiento.':'No se puede guardar en este navegador. Puedes seguir jugando; el avance durará mientras esta página esté abierta.'; }
function announce(text){$('status').textContent=text;}
function persist(){try{const candidate=JSON.stringify(state);localStorage.setItem(KEY,candidate);raw=candidate;storageOK=true;}catch{storageOK=false;}storageNotice();}
function closePending(){pending=null;if(dialog.open)dialog.close();}
function receive(value){raw=value;state=decode(value);selected=null;closePending();render();announce('El progreso cambió en otra pestaña. Se ha cargado su última versión.');}
function syncBefore(){try{const latest=localStorage.getItem(KEY);if(latest!==raw){receive(latest);return true;}}catch{storageOK=false;storageNotice();}return false;}
function focusAgain(id){if(id)document.getElementById(id)?.focus();}
function render(){
  const level=LEVELS[state.currentLevel],amounts=amountsOf(state),complete=won(state.currentLevel,amounts);
  $('level-number').textContent=`AMANECER ${state.currentLevel+1} / 6`;
  $('level-title').textContent=level.title;$('level-note').textContent=level.note;
  $('count').textContent=`${state.run.length} ${state.run.length===1?'movimiento':'movimientos'}`;
  $('target').textContent=level.goal.map((v,i)=>`${letters[i]} = ${v}`).join('   ·   ');
  $('progress').textContent=`${Object.keys(state.completed).length} / 6`;
  $('undo').disabled=!state.run.length;$('next').disabled=!complete||state.currentLevel===LEVELS.length-1;
  $('pour-tip').textContent=selected===null?'Pulsa una jarra con agua y después otra para verter.':`Origen: jarra ${letters[selected]}. Pulsa el destino o Escape para cancelar.`;
  board.style.setProperty('--jars',level.capacities.length);board.replaceChildren();
  level.capacities.forEach((cap,i)=>{
    const card=document.createElement('div');card.className='jar-card';
    const button=document.createElement('button');button.type='button';button.id=`jar-${i}`;button.className='jar-button';
    button.setAttribute('aria-label',`Jarra ${letters[i]}, ${amounts[i]} de ${cap} unidades, objetivo ${level.goal[i]}. Seleccionar para verter.`);
    button.setAttribute('aria-pressed',String(selected===i));button.setAttribute('data-match',String(amounts[i]===level.goal[i]));button.disabled=complete;
    const name=document.createElement('span');name.className='jar-name';name.textContent=`JARRA ${letters[i]}`;
    const vessel=document.createElement('span');vessel.className='vessel';vessel.setAttribute('aria-hidden','true');
    const water=document.createElement('span');water.className='water';water.style.height=`${amounts[i]/cap*100}%`;
    const amount=document.createElement('span');amount.className='amount';amount.textContent=String(amounts[i]);
    const capacity=document.createElement('small');capacity.textContent=`de ${cap} unidades`;amount.append(capacity);vessel.append(water,amount);
    const target=document.createElement('span');target.className='jar-target';target.textContent=`Objetivo: ${level.goal[i]}${amounts[i]===level.goal[i]?' ✓':''}`;
    button.append(name,vessel,target);button.onclick=()=>choose(i);card.append(button);
    const actions=document.createElement('div');actions.className='jar-actions';
    for(const [kind,label] of [['fill','Llenar'],['empty','Vaciar']]){
      const action=document.createElement('button');action.type='button';action.id=`${kind}-${i}`;action.textContent=label;
      action.setAttribute('aria-label',`${label} jarra ${letters[i]}`);action.disabled=complete||!apply(state.currentLevel,amounts,[kind,i]);
      action.onclick=()=>act([kind,i],`jar-${i}`);actions.append(action);
    }
    card.append(actions);board.append(card);
  });
  $('levels').replaceChildren();
  LEVELS.forEach((level,i)=>{
    const button=document.createElement('button');button.type='button';button.id=`level-${i}`;button.setAttribute('aria-current',String(i===state.currentLevel));
    const index=document.createElement('span');index.className='level-index';index.textContent=state.completed[i]?'✓':String(i+1);index.setAttribute('aria-hidden','true');
    const name=document.createElement('span');name.textContent=level.title;button.append(index,name);
    button.setAttribute('aria-label',`Reto ${i+1}: ${level.title}${state.completed[i]?`, completado en ${state.completed[i].bestMoves} movimientos`:''}`);
    button.onclick=()=>changeLevel(i,button.id);$('levels').append(button);
  });
  storageNotice();
  if(complete)announce(`¡Medida exacta! Amanecer completado en ${state.run.length} movimientos. Mejor marca: ${state.completed[state.currentLevel].bestMoves}.`);
}
function act(action,focus){
  if(dialog.open||syncBefore())return;
  const next=move(state,action);
  if(next===state){announce(state.run.length>=MAX_MOVES?'Has llegado a 1000 movimientos en este intento. Deshaz o reinicia el reto.':'Ese movimiento no cambia el agua. Elige otro.');return;}
  state=next;selected=null;persist();render();focusAgain(focus);
  if(!won(state.currentLevel,amountsOf(state)))announce(`Movimiento ${state.run.length}. ${amountsOf(state).map((v,i)=>`${letters[i]}: ${v}`).join(', ')}.`);
}
function choose(i){
  if(dialog.open||syncBefore()||won(state.currentLevel,amountsOf(state)))return;
  if(i===selected){selected=null;render();focusAgain(`jar-${i}`);announce('Selección cancelada.');return;}
  if(selected===null){
    if(!amountsOf(state)[i]){announce(`La jarra ${letters[i]} está vacía. Llénala o elige otra con agua.`);return;}
    selected=i;render();focusAgain(`jar-${i}`);announce(`Jarra ${letters[i]} elegida como origen. Selecciona el destino.`);return;
  }
  act(['pour',selected,i],`jar-${i}`);
}
function changeLevel(i,focus){if(dialog.open||syncBefore())return;if(i===state.currentLevel)return;state=initial(i,state.completed);selected=null;persist();render();focusAgain(focus);announce('Nuevo reto. Todas las jarras empiezan vacías.');}
function doUndo(){if(dialog.open||syncBefore())return;const next=undo(state);if(next===state)return;state=next;selected=null;persist();render();if($('undo').disabled)focusAgain('jar-0');else $('undo').focus();announce('Último movimiento deshecho. Tus logros se conservan.');}
function request(kind){
  if(dialog.open||syncBefore())return;pending=kind;returnFocus=document.activeElement;dialog.returnValue='no';
  $('confirm-title').textContent=kind==='clear'?'¿Borrar todo tu progreso?':'¿Reiniciar este reto?';
  $('confirm-text').textContent=kind==='clear'?'Se borrarán el intento actual y las marcas de los seis amaneceres, solo en este navegador. No se puede deshacer.':'Las jarras volverán a estar vacías. Tus amaneceres completados y mejores marcas se conservan.';
  dialog.showModal();
}
$('undo').onclick=doUndo;$('reset').onclick=()=>request('reset');$('clear').onclick=()=>request('clear');
$('next').onclick=()=>changeLevel(Math.min(state.currentLevel+1,LEVELS.length-1),'level-'+Math.min(state.currentLevel+1,LEVELS.length-1));
dialog.addEventListener('close',()=>{
  const action=pending;pending=null;
  if(action&&dialog.returnValue==='yes'){
    if(syncBefore())return;state=action==='clear'?initial():initial(state.currentLevel,state.completed);selected=null;persist();render();announce(action==='clear'?'Progreso borrado. Puedes empezar de nuevo.':'Reto reiniciado. Tus logros se conservan.');
  }
  if(returnFocus?.isConnected)returnFocus.focus();
});
dialog.addEventListener('cancel',()=>{dialog.returnValue='no';});
document.addEventListener('keydown',event=>{
  if(dialog.open||event.ctrlKey||event.altKey||event.metaKey||event.target?.closest?.('details,input,textarea,select,[contenteditable="true"]'))return;
  if(event.key==='Escape'){const focus=document.activeElement?.id;selected=null;render();focusAgain(focus);announce('Selección cancelada.');return;}
  if(event.key.toLowerCase()==='z'){event.preventDefault();doUndo();return;}
  const index=Number(event.key)-1;
  if(/^[1-3]$/.test(event.key)&&index<LEVELS[state.currentLevel].capacities.length){event.preventDefault();choose(index);}
});
window.addEventListener('storage',event=>{if(event.key!==KEY&&event.key!==null)return;let latest=event.newValue;try{latest=localStorage.getItem(KEY);}catch{storageOK=false;}if(latest!==raw)receive(latest);});
render();if(!won(state.currentLevel,amountsOf(state)))announce('Empieza llenando una jarra. No hay reloj: prueba, deshaz y encuentra tu camino.');
