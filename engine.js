import {LEVELS} from './levels.js';
export const KEY='daily-games:jarras-del-alba:v1';
export const MAX_MOVES=1000;
const validLevel=i=>Number.isInteger(i)&&i>=0&&i<LEVELS.length;
const validIndex=(i,n)=>Number.isInteger(i)&&i>=0&&i<n;
export function initial(level=0,completed={}) {
  return {version:1,currentLevel:validLevel(level)?level:0,run:[],completed:structuredClone(completed)};
}
export function won(level,amounts) {return amounts.length===LEVELS[level].goal.length&&amounts.every((a,i)=>a===LEVELS[level].goal[i]);}
export function apply(level,amounts,action) {
  if(!validLevel(level)||!Array.isArray(amounts)||!Array.isArray(action))return null;
  const cap=LEVELS[level].capacities,n=cap.length;
  if(amounts.length!==n||amounts.some((a,i)=>!Number.isInteger(a)||a<0||a>cap[i]))return null;
  const [kind,a,b]=action;
  if(!validIndex(a,n)||!['fill','empty','pour'].includes(kind)||action.length!==(kind==='pour'?3:2))return null;
  const out=[...amounts];
  if(kind==='fill')out[a]=cap[a];
  if(kind==='empty')out[a]=0;
  if(kind==='pour') {
    if(!validIndex(b,n)||a===b)return null;
    const quantity=Math.min(out[a],cap[b]-out[b]);
    out[a]-=quantity;out[b]+=quantity;
  }
  return out.some((v,i)=>v!==amounts[i])?out:null;
}
export function replay(level,run) {
  if(!validLevel(level)||!Array.isArray(run)||run.length>MAX_MOVES)return null;
  let amounts=LEVELS[level].capacities.map(()=>0);
  for(const action of run) {
    if(won(level,amounts))return null;
    amounts=apply(level,amounts,action);
    if(!amounts)return null;
  }
  return amounts;
}
export const amountsOf=s=>replay(s.currentLevel,s.run);
export function move(state,action) {
  const current=amountsOf(state);
  if(!current||won(state.currentLevel,current)||state.run.length>=MAX_MOVES||!apply(state.currentLevel,current,action))return state;
  const next=structuredClone(state);next.run.push([...action]);
  if(won(next.currentLevel,amountsOf(next))) {
    const record=next.completed[next.currentLevel];
    if(!record||next.run.length<record.bestMoves)next.completed[next.currentLevel]={bestMoves:next.run.length,proof:structuredClone(next.run)};
  }
  return next;
}
export function undo(state) {if(!state.run.length)return state;const next=structuredClone(state);next.run.pop();return next;}
export function decode(raw) {
  try {
    if(typeof raw!=='string'||raw.length>300000)return initial();
    const data=JSON.parse(raw);
    if(!data||data.version!==1||!validLevel(data.currentLevel)||!replay(data.currentLevel,data.run))return initial();
    const completed={};
    if(data.completed&&typeof data.completed==='object'&&!Array.isArray(data.completed))for(let i=0;i<LEVELS.length;i++) {
      const record=data.completed[i];
      if(!record||!Number.isInteger(record.bestMoves)||record.bestMoves<1||!Array.isArray(record.proof)||record.bestMoves!==record.proof.length)continue;
      const amounts=replay(i,record.proof);
      if(amounts&&won(i,amounts))completed[i]={bestMoves:record.bestMoves,proof:structuredClone(record.proof)};
    }
    const state={version:1,currentLevel:data.currentLevel,run:structuredClone(data.run),completed};
    if(won(state.currentLevel,amountsOf(state))) {
      const previous=completed[state.currentLevel];
      if(!previous||state.run.length<previous.bestMoves)completed[state.currentLevel]={bestMoves:state.run.length,proof:structuredClone(state.run)};
    }
    return state;
  } catch {return initial();}
}
