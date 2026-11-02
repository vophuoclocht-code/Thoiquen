'use strict';
/* Dữ liệu + logic. Cấp, điểm, chuỗi ngày đều TÍNH LẠI từ nhật ký (D.log), không lưu cứng. */
const KEY='tq_data', SCHEMA=1;
const DEF=()=>({schema:SCHEMA,habits:[],log:[],cfg:{names:['Bể Khổ','Mệnh Tuyền','Thần Kiều','Bỉ Ngạn'],dayStart:0,vibrate:true,reduce:false}});
let D;
function load(){try{D=JSON.parse(localStorage.getItem(KEY))||DEF()}catch(e){D=DEF()}migrate()}
function migrate(){ /* Sau này nâng schema: thêm bước nâng cấp tại đây, đừng xóa dữ liệu cũ */
  D.cfg=Object.assign(DEF().cfg,D.cfg||{});D.habits=D.habits||[];D.log=D.log||[];D.schema=SCHEMA}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){toast('Không lưu được dữ liệu')}}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
/* Khóa ngày theo "giờ bắt đầu ngày mới" */
function dayKey(t=Date.now()){const d=new Date(t-D.cfg.dayStart*36e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function perDay(h){const m={};for(const l of D.log)if(l.h===h.id){const k=dayKey(l.t);const e=m[k]||(m[k]={n:0,v:0});e.n++;e.v+=l.v}return m}
/* Điểm trong 1 ngày: mode log=mỗi lần 1đ, day=đạt mục tiêu 1đ, amount=theo tổng lượng; có trần theo limit */
function dayPts(h,e){if(!e)return 0;let p=h.mode==='amount'?e.v:h.mode==='day'?(e.v>=goalOf(h)?1:0):e.n;if(h.limit>0)p=Math.min(p,h.limit);return Math.floor(p)}
const goalOf=h=>h.goal>0?h.goal:1; /* mục tiêu 0 = không đặt: làm 1 lần là xong */
const need=(h,k)=>Math.max(1,(h.th||10)+k*(h.inc||0)); /* điểm cần cho bước thứ k (tăng dần như XP) */
function stat(h){const m=perDay(h),k=dayKey();let pts=0;for(const d in m)pts+=dayPts(h,m[d]);
  let steps=0,rem=pts;while(steps<999&&rem>=need(h,steps)){rem-=need(h,steps);steps++}
  const t=m[k]||{n:0,v:0},tp=dayPts(h,t);
  return{pts,th:need(h,steps),lv:Math.min(4,steps+1),stars:Math.max(0,steps-3),into:rem,today:t,todayPts:tp,full:h.limit>0&&tp>=h.limit}}
const prog=h=>Math.min(1,stat(h).today.v/goalOf(h));
function addLog(h,v){if(stat(h).full)return null;const l={id:uid(),h:h.id,t:Date.now(),v};D.log.push(l);save();return l}
function removeLog(id){const i=D.log.findIndex(l=>l.id===id);if(i<0)return null;const l=D.log.splice(i,1)[0];save();return l}
function lastToday(h){const k=dayKey();for(let i=D.log.length-1;i>=0;i--){const l=D.log[i];if(l.h===h.id&&dayKey(l.t)===k)return l}}
/* Chuỗi ngày: ngày xong khi mọi thói quen đạt mục tiêu; hôm nay chưa xong thì chưa đứt chuỗi */
function streaks(){const hs=D.habits.filter(h=>!h.arch);if(!hs.length||!D.log.length)return{cur:0,best:0};
  const ms=hs.map(perDay),today=dayKey(),days=[];
  for(let t=Math.min(...D.log.map(l=>l.t));;t+=864e5){const k=dayKey(t);if(days[days.length-1]!==k)days.push(k);if(k>=today)break}
  let run=0,best=0;
  for(const k of days){const ok=hs.every((h,i)=>ms[i][k]&&ms[i][k].v>=goalOf(h));
    if(ok){run++;best=Math.max(best,run)}else if(k!==today)run=0}
  return{cur:run,best}}
function dayRatio(k){const hs=D.habits.filter(h=>!h.arch);if(!hs.length)return 0;
  return hs.filter(h=>{const e=perDay(h)[k];return e&&e.v>=goalOf(h)}).length/hs.length}
/* Sao lưu */
function exportJSON(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(D)],{type:'application/json'}));
  a.download='thoiquen-'+dayKey()+'.json';a.click();localStorage.setItem('tq_lastbackup',Date.now())}
function importJSON(text){let o;try{o=JSON.parse(text)}catch(e){return 'File không phải JSON hợp lệ'}
  if(!o||typeof o.schema!=='number'||!Array.isArray(o.habits)||!Array.isArray(o.log))return 'File không đúng định dạng sao lưu Thói Quen';
  D=o;migrate();save();return ''}

function moveHabit(id,d){const a=D.habits,i=a.findIndex(h=>h.id===id);if(i<0)return;const j=d==='top'?0:i+(+d);if(j<0||j>=a.length)return;a.splice(j,0,a.splice(i,1)[0]);save()}
