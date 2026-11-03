import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {LEVELS} from '../levels.js';import {KEY,MAX_MOVES,initial,apply,replay,won,amountsOf,move,undo,decode} from '../engine.js';import {solutions,search} from './oracle.js';
const expected=[4,7,10,11,12,12];
for(let i=0;i<LEVELS.length;i++)test(`reto ${i+1}: solución mínima independiente, victoria y guardado`,()=>{
  let state=initial(i);assert.equal(solutions[i].length,expected[i]);assert.ok(!won(i,amountsOf(state)));
  for(const action of solutions[i]){const previous=state;state=move(state,action);assert.notEqual(state,previous);}
  assert.deepEqual(amountsOf(state),[...LEVELS[i].goal]);assert.equal(state.completed[i].bestMoves,expected[i]);assert.deepEqual(decode(JSON.stringify(state)),state);
  assert.equal(move(state,['fill',0]),state);assert.equal(search(i).path.length,expected[i]);
});
test('todas las combinaciones dentro de capacidad: conservación y trasvase exacto',()=>{
  for(let level=0;level<LEVELS.length;level++){
    const cap=LEVELS[level].capacities;
    const visit=(amounts)=>{if(amounts.length<cap.length){for(let i=0;i<=cap[amounts.length];i++)visit([...amounts,i]);return;}
      for(let a=0;a<cap.length;a++)for(let b=0;b<cap.length;b++){
        const actual=apply(level,amounts,['pour',a,b]);
        if(a===b||amounts[a]===0||amounts[b]===cap[b]){assert.equal(actual,null);continue;}
        const independent=[...amounts];while(independent[a]&&independent[b]<cap[b]){independent[a]--;independent[b]++;}
        assert.deepEqual(actual,independent);assert.equal(actual.reduce((x,y)=>x+y,0),amounts.reduce((x,y)=>x+y,0));assert.ok(actual[a]===0||actual[b]===cap[b]);
      }
    };visit([]);
  }
});
test('llenar y vaciar son exactos; acciones sin cambio se rechazan',()=>{
  assert.deepEqual(apply(0,[0,0],['fill',0]),[2,0]);assert.deepEqual(apply(0,[2,3],['empty',1]),[2,0]);
  assert.equal(apply(0,[2,0],['fill',0]),null);assert.equal(apply(0,[2,0],['empty',1]),null);
});
test('valida acciones, capacidades e índices sin coerción',()=>{
  for(const action of [null,{},[],['fill'],['fill','0'],['fill',-1],['fill',2],['fill',0,0],['pour',0],['pour',0,1,2],['pour',0,0],['x',0],['fill',NaN]])assert.equal(apply(0,[0,0],action),null);
  for(const amounts of [null,[0],[0,0,0],[-1,0],[3,0],[1.2,0],['0',0]])assert.equal(apply(0,amounts,['fill',0]),null);
});
test('deshacer conserva el logro y se puede rehacer mediante el movimiento',()=>{
  let state=initial();for(const action of solutions[0])state=move(state,action);const undone=undo(state);
  assert.ok(!won(0,amountsOf(undone)));assert.deepEqual(undone.completed,state.completed);assert.deepEqual(move(undone,solutions[0].at(-1)),state);assert.equal(undo(initial()).run.length,0);
});
test('las marcas mejores no empeoran por rutas más largas',()=>{
  let state=initial();for(const action of solutions[0])state=move(state,action);
  const best=state.completed[0].bestMoves;state=initial(0,state.completed);for(const action of [['fill',0],['empty',0],...solutions[0]])state=move(state,action);assert.equal(state.completed[0].bestMoves,best);
});
test('persistencia corrupta, tamaño excesivo y secuencias ilegales se descartan',()=>{
  for(const raw of [null,'broken','null','{}','[]',JSON.stringify({...initial(),version:2}),JSON.stringify({...initial(),currentLevel:6}),JSON.stringify({...initial(),run:[['empty',0]]}),JSON.stringify({...initial(),run:Array(MAX_MOVES+1).fill(['fill',0])}),' '.repeat(300001)])assert.deepEqual(decode(raw),initial());
  assert.equal(replay(0,[...solutions[0],['empty',0]]),null);assert.equal(replay(-1,[]),null);
});
test('ignora campos inyectados y solo acepta logros con prueba legal',()=>{
  const raw={...initial(),amounts:[1,0],completed:{0:{bestMoves:1,proof:[['fill',0]]},5:{bestMoves:12,proof:solutions[5]},99:{bestMoves:4,proof:solutions[0]}}};
  const state=decode(JSON.stringify(raw));assert.deepEqual(amountsOf(state),[0,0]);assert.deepEqual(Object.keys(state.completed),['5']);assert.ok(!('amounts' in state));
});
test('mutaciones no cambian el estado ni niveles de entrada',()=>{const s=initial(),before=JSON.stringify(s),levels=JSON.stringify(LEVELS);move(s,['fill',0]);assert.equal(JSON.stringify(s),before);assert.equal(JSON.stringify(LEVELS),levels);assert.ok(Object.isFrozen(LEVELS[0].goal));});
test('archivos de ejecución sin red, seguimiento ni dependencias; clave independiente',()=>{
  assert.equal(KEY,'daily-games:jarras-del-alba:v1');assert.equal(JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url))).dependencies,undefined);
  for(const name of ['engine.js','app.js','levels.js','style.css'])assert.doesNotMatch(fs.readFileSync(new URL('../'+name,import.meta.url),'utf8'),/fetch\s*\(|XMLHttpRequest|sendBeacon|@import|https?:\/\//);
});
