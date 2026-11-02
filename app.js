'use strict';
let cur='habits',undoT=null,undoFn=null,fxQ=Promise.resolve(),selIcon='h-star';
function render(){$('#screen-'+cur).innerHTML=R[cur]()}
function go(t){cur=t;document.querySelectorAll('.screen').forEach(s=>s.hidden=s.dataset.screen!==t);
  document.querySelectorAll('.tab').forEach(b=>{const on=b.dataset.tab===t;b.classList.toggle('is-active',on);on?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});render()}
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2200)}
function vib(p){if(D.cfg.vibrate&&navigator.vibrate)navigator.vibrate(p)}
function sheet(h){$('#sheet-panel').innerHTML=h;$('#sheet').hidden=false}
function closeSheet(){$('#sheet').hidden=true}
function confirmBox(msg,yes){sheet('<h2 class="h-date">'+msg+'</h2><div style="display:flex;gap:12px;margin-top:16px"><button class="btn" data-close style="flex:1">Hủy</button><button class="btn btn-primary" id="yes" style="flex:1">Đồng ý</button></div>');$('#yes').onclick=()=>{closeSheet();yes()}}
/* Hoàn tác 5 giây, vòng đếm ngược */
function showUndo(fn){undoFn=fn;const b=$('#undo');b.hidden=false;b.classList.remove('run');void b.offsetWidth;b.classList.add('run');clearTimeout(undoT);undoT=setTimeout(()=>{b.hidden=true;undoFn=null},5000)}
/* Hiệu ứng thăng cấp (xếp hàng, chạy lần lượt) */
function queueFx(id,from,to){fxQ=fxQ.then(()=>new Promise(res=>{const c=document.querySelector('.habit[data-id="'+id+'"]');if(!c||D.cfg.reduce||matchMedia('(prefers-reduced-motion:reduce)').matches){res();return}
  c.dataset.lv=from;c.classList.add('is-leveling');c.style.setProperty('--from',LV[from-1]);c.style.setProperty('--to',LV[to-1]);c.style.setProperty('--n1',LV2[to-1]);c.style.setProperty('--n2',LV[to-1]);
  let h='<div class="fx-ring"></div><div class="fx-bg"></div><div class="fx-wave"><i></i><i></i><i></i></div><div class="fx-label">Thăng cấp: '+esc(D.cfg.names[to-1])+'</div>';
  for(let i=0;i<5;i++)h+='<i class="fx-spark" style="left:'+(20+Math.random()*60)+'%;animation-delay:'+(i*.2)+'s"></i>';
  const w=document.createElement('div');w.innerHTML=h;const els=[...w.children];els.forEach(e=>c.appendChild(e));vib([20,50,90,50,20]);
  setTimeout(()=>{c.dataset.lv=to},1700);setTimeout(()=>{els.forEach(e=>e.remove());c.classList.remove('is-leveling');if(cur==='habits')render();res()},2400)}))}
function doAdd(id){const h=D.habits.find(x=>x.id===id);if(!h)return;const b=stat(h),l=addLog(h,h.kind==='amount'?h.step:1);
  if(!l){toast('Đã đủ hôm nay');return}vib(15);const a=stat(h);render();showUndo(()=>{removeLog(l.id);render()});if(a.lv>b.lv)queueFx(id,b.lv,a.lv)}
function doMinus(id){const h=D.habits.find(x=>x.id===id),l=h&&lastToday(h);if(!l){toast('Hôm nay chưa có gì để trừ');return}removeLog(l.id);vib(15);render();showUndo(()=>{D.log.push(l);save();render()})}
/* Giữ nút cộng 0,55 giây = trừ; bấm nhanh = cộng */
let pt=null,longHit=false;
document.addEventListener('pointerdown',e=>{const a=e.target.closest('[data-add]');if(!a)return;longHit=false;const id=a.closest('.habit').dataset.id;pt=setTimeout(()=>{longHit=true;pt=null;doMinus(id)},550)});
document.addEventListener('pointerup',e=>{const a=e.target.closest('[data-add]');if(pt){clearTimeout(pt);pt=null;if(a)doAdd(a.closest('.habit').dataset.id)}});
document.addEventListener('pointercancel',()=>{clearTimeout(pt);pt=null});
document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-add]'))e.preventDefault()});
document.addEventListener('click',e=>{const t=e.target,q=s=>t.closest(s);let m;
  if(m=q('[data-tab]'))go(m.dataset.tab);
  else if(q('[data-close]'))closeSheet();
  else if(q('[data-new]')){selIcon='h-star';sheet(formHtml())}
  else if(m=q('[data-edit]')){const x=D.habits.find(h=>h.id===m.dataset.edit);selIcon=x.icon;sheet(formHtml(x))}
  else if(m=q('[data-ic]')){selIcon=m.dataset.ic;document.querySelectorAll('[data-ic]').forEach(b=>b.classList.toggle('is-on',b===m))}
  else if(q('[data-th2]')){e.preventDefault();$('#f-th').value=2}
  else if(m=q('[data-save]')){const name=$('#f-name').value.trim(),n=id=>Math.floor(+$('#'+id).value);
    if(!name){toast('Hãy nhập tên thói quen');return}
    const o={name,icon:selIcon,kind:$('#f-kind').value,unit:$('#f-unit').value.trim(),step:Math.max(1,n('f-step')||1),goal:Math.max(1,n('f-goal')||1),mode:$('#f-mode').value,limit:Math.max(0,n('f-limit')||0),th:Math.max(1,n('f-th')||10)};
    const x=D.habits.find(h=>h.id===m.dataset.save);if(x)Object.assign(x,o);else D.habits.push(Object.assign({id:uid()},o));save();closeSheet();render()}
  else if(m=q('[data-del]')){const id=m.dataset.del;confirmBox('Xóa thói quen này và toàn bộ lịch sử của nó?',()=>{D.habits=D.habits.filter(h=>h.id!==id);D.log=D.log.filter(l=>l.h!==id);save();render()})}
  else if(m=q('[data-hdel]')){const l=removeLog(m.dataset.hdel);render();if(l)showUndo(()=>{D.log.push(l);save();render()})}
  else if(q('#undo')){if(undoFn)undoFn();undoFn=null;$('#undo').hidden=true}
  else if(m=q('[data-sw]')){const k=m.dataset.sw;D.cfg[k]=!D.cfg[k];save();document.body.classList.toggle('reduce-motion',D.cfg.reduce);render()}
  else if(q('[data-export]'))exportJSON();
  else if(q('[data-reset]'))confirmBox('Xóa toàn bộ dữ liệu?',()=>setTimeout(()=>confirmBox('Chắc chắn chứ? Không thể khôi phục.',()=>{D=DEF();save();render();toast('Đã xóa dữ liệu')}),50))});
document.addEventListener('change',e=>{const t=e.target;
  if(t.dataset.name!==undefined){D.cfg.names[+t.dataset.name]=t.value.trim()||D.cfg.names[+t.dataset.name];save()}
  else if(t.dataset.day!==undefined){D.cfg.dayStart=+t.value;save()}
  else if(t.dataset.import!==undefined&&t.files[0]){const r=new FileReader();r.onload=()=>{const err=importJSON(r.result);err?toast(err):(toast('Đã nhập dữ liệu'),render())};r.readAsText(t.files[0])}});
/* Khởi động */
load();document.body.classList.toggle('reduce-motion',D.cfg.reduce);go('habits');
const left=D.habits.filter(h=>!h.arch&&prog(h)<1).length;
if(left){const r=$('#remind');r.textContent='Hôm nay còn '+left+' thói quen';r.hidden=false;setTimeout(()=>r.hidden=true,4000)}
setTimeout(()=>{const s=$('#splash');if(s)s.remove()},800);
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js');
