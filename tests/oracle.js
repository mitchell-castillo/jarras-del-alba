import {LEVELS} from '../levels.js';
// Independent breadth-first search. It deliberately does not import the engine.
export function search(index) {
  const {capacities:cap,goal}=LEVELS[index],empty=cap.map(()=>0),queue=[empty];
  const paths=new Map([[empty.join(','),[]]]);
  for(let head=0;head<queue.length;head++){
    const state=queue[head],path=paths.get(state.join(','));
    if(state.every((v,i)=>v===goal[i]))return {path,states:paths.size};
    for(let a=0;a<cap.length;a++){
      const candidates=[];
      for(const mode of ['fill','empty']){const next=state.slice();next[a]=mode==='fill'?cap[a]:0;candidates.push([next,[mode,a]]);}
      for(let b=0;b<cap.length;b++)if(a!==b){const next=state.slice();while(next[a]>0&&next[b]<cap[b]){next[a]--;next[b]++;}candidates.push([next,['pour',a,b]]);}
      for(const [next,action] of candidates){const key=next.join(',');if(!paths.has(key)){paths.set(key,[...path,action]);queue.push(next);}}
    }
  }
  throw Error('No solution');
}
export const solutions=LEVELS.map((_,i)=>search(i).path);
