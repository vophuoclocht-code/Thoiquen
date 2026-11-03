'use strict';
const $=s=>document.querySelector(s);
const DOW=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const ic=(n,c='')=>'<svg class="ic '+c+'"><use href="#'+n+'"/></svg>';
const LV=['#6D28D9','#B02ACB','#F97316','#FCD34D'],LV2=['#6a2bc4','#a050e6','#dba0f7','#fbeaff'];
/* Huy hiệu: số vòng sóng = số cấp, ngôi sao vàng ở tâm */
const bspan=n=>'<span style="font-size:'+Math.min(.74,Math.max(.5,10.5/[...n].length)).toFixed(2)+'rem">'+esc(n)+'</span>';
/* Màu khung theo 12 cấp: nội suy tím → hồng → cam → vàng kim */
const hx=c=>[1,3,5].map(i=>parseInt(c.substr(i,2),16)),mix=(a,b,t)=>{const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const ANC=[['#6D28D9','#A855F7'],['#B02ACB','#EC4899'],['#F97316','#FBBF24'],['#FCD34D','#FFF7D1']];
function lvCol(L){const p=L/11*3,i=Math.min(2,Math.floor(p)),t=p-i;return [mix(ANC[i][0],ANC[i+1][0],t),mix(ANC[i][1],ANC[i+1][1],t)]}
function lvStyle(L){const c=lvCol(L);return '--c0:'+c[0]+';--c1:'+c[1]+';--gl:'+c[1]+';--fg:'+(L>=7?'#331400':'#fff')}
/* Huy hiệu = cảnh: ngôi sao nổi lên từ mặt nước (Khổ Hải) → bay lên bờ (Bỉ Ngạn) → hóa thành sao sáng trên trời, càng lên càng lớn, càng nhiều sao bạn */
function badge(lv){const L=lv-1,t=L/11,x=42,y=50-34*t,r=6+L*.75,f=mix('#ffc4ec','#fff3b0',t);
  const st=(cx,cy,s,fl,o)=>'<path d="M'+cx+' '+(cy-s)+'Q'+(cx+s*.2)+' '+(cy-s*.2)+' '+(cx+s)+' '+cy+'Q'+(cx+s*.2)+' '+(cy+s*.2)+' '+cx+' '+(cy+s)+'Q'+(cx-s*.2)+' '+(cy+s*.2)+' '+(cx-s)+' '+cy+'Q'+(cx-s*.2)+' '+(cy-s*.2)+' '+cx+' '+(cy-s)+'z" fill="'+fl+'"'+(o?' opacity="'+o+'"':'')+'/>';
  let g='<svg viewBox="0 0 84 62" aria-hidden="true"><defs><linearGradient id="bdk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a2dbd"/><stop offset="1" stop-color="#e060c4"/></linearGradient><linearGradient id="bdw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a58f0"/><stop offset="1" stop-color="#5b25ad"/></linearGradient><radialGradient id="bdg"><stop offset="0" stop-color="#fff6c9" stop-opacity=".95"/><stop offset="1" stop-color="#ffd24d" stop-opacity="0"/></radialGradient></defs><rect width="84" height="42" fill="url(#bdk)"/><rect y="42" width="84" height="20" fill="url(#bdw)"/>';
  const P=[[14,12],[69,9],[22,28],[63,26],[8,24],[76,21]];
  for(let i=0;i<Math.min(6,Math.max(0,L-5));i++)g+=st(P[i][0],P[i][1],2.6+(i%2),'#fff6c9',.9);
  const ro=Math.max(0,.9-L*.09);
  for(let i=0;i<3;i++){const w=9+i*8,yy=46+i*5;g+='<path d="M'+(x-w)+' '+yy+'A'+w+' '+(2.4+i*1.2)+' 0 0 0 '+(x+w)+' '+yy+'" fill="none" stroke="#ffc457" stroke-width="1.4" stroke-linecap="round" opacity="'+(ro*(1-i*.2)).toFixed(2)+'"/>'}
  if(L>=1)g+='<ellipse cx="'+x+'" cy="49" rx="'+(r*.45).toFixed(1)+'" ry="1.8" fill="#ffd24d" opacity="'+Math.min(.55,.15+L*.04).toFixed(2)+'"/>';
  g+='<circle cx="'+x+'" cy="'+y.toFixed(1)+'" r="'+(r*2.1).toFixed(1)+'" fill="url(#bdg)" opacity="'+Math.min(.95,.3+L*.06).toFixed(2)+'"/>';
  if(L>=8)g+='<path d="M'+x+' '+(y-r*2.5).toFixed(1)+'V'+(y+r*2.5).toFixed(1)+'M'+(x-r*2.5).toFixed(1)+' '+y.toFixed(1)+'H'+(x+r*2.5).toFixed(1)+'" stroke="#fff6c9" stroke-width=".7" opacity=".7"/>';
  return g+st(x,+y.toFixed(1),+r.toFixed(1),f)+'</svg>'}
function ringSvg(p){return '<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#eee7fa" stroke-width="7"/><circle cx="32" cy="32" r="26" fill="none" stroke="url(#gp)" stroke-width="7" stroke-linecap="round" stroke-dasharray="163.4" stroke-dashoffset="'+(163.4*(1-p)).toFixed(1)+'" transform="rotate(-90 32 32)"/></svg>'}
function rHabits(){const hs=D.habits.filter(h=>!h.arch),n=new Date(),nm=D.cfg.names;
  const p=hs.length?hs.reduce((a,h)=>a+prog(h),0)/hs.length:0,done=hs.filter(h=>prog(h)>=1).length;
  let h='<h1 class="h-date">'+DOW[n.getDay()]+', '+n.getDate()+' tháng '+(n.getMonth()+1)+'</h1>';
  if(!hs.length)h+='<div class="empty">Chưa có thói quen nào.<br>Vào tab Quản lý để thêm thói quen đầu tiên.</div>';
  for(const x of hs){const s=stat(x),u=x.unit?' '+esc(x.unit):'',len=String(s.today.v).length,sub=s.full?'Đủ hôm nay':(x.goal>0?'Mục tiêu '+x.goal+u:'');
    /* Chạm vào cả khung để cộng. Trái: huy hiệu cấp. Giữa: icon + tên. Phải: số lần hôm nay thật to. Dưới: thanh lên cấp */
    h+='<article class="habit'+(s.full?' is-full':'')+'" data-lv="'+s.lv+'" data-id="'+x.id+'" style="'+lvStyle(s.lv-1)+'">'+
    '<div class="badge">'+badge(s.lv)+bspan(nm[s.lv-1])+'</div>'+
    '<div class="h-main"><div class="h-name">'+ic(x.icon,'l')+'<span>'+esc(x.name)+'</span></div>'+(sub?'<div class="h-sub2">'+sub+'</div>':'')+'</div>'+
    '<div class="count"><b class="cnum'+(len>=4?' xl':len==3?' l':'')+'">'+s.today.v+'</b><span>'+(x.goal>0?'/ '+x.goal+u:(x.unit?esc(x.unit):'hôm nay'))+'</span></div>'+
    '<div class="pg"><div class="wave"><i style="--pct:'+(s.into/s.th*100).toFixed(1)+'%"></i></div><em class="pgn">'+s.into+'/'+s.th+(s.stars?' ★'+s.stars:'')+'</em></div></article>'}
  return h}
/* Mỗi cấp một số điểm riêng do người dùng nhập: lvs = [cấp1→2, cấp2→3, cấp3→4, mỗi ★] */
function xpChips(L){return L.map((v,k)=>'<span class="xp" style="background:'+LV[k]+';color:'+(k>=2?'#331400':'#fff')+'">'+(k<3?(k+1)+'→'+(k+2):'mỗi ★')+' <b>'+v+'</b></span>').join('')}
function updateXp(){}
const MODE={log:'1 điểm / lần',day:'1 điểm / ngày đạt mục tiêu',amount:'điểm theo lượng'};
function rManage(){const act=D.habits.filter(x=>!x.arch),arc=D.habits.filter(x=>x.arch),nm=D.cfg.names;
  let h='<h1 class="h-date">Quản lý</h1><p class="h-sub">'+act.length+' thói quen đang theo dõi</p><button class="btn btn-primary" data-new style="width:100%;margin:14px 0">'+ic('ui-plus')+' Thêm thói quen</button>';
  act.forEach(x=>{const s=stat(x),c=lvCol(s.lv-1),fg=s.lv>=8?'#331400':'#fff';
    h+='<div class="mg"><div class="mg-top"><span class="mg-ic" style="background:linear-gradient(135deg,'+c[0]+','+c[1]+')!important;color:'+fg+'!important">'+ic(x.icon,'l')+'</span><div class="grow"><div class="t">'+esc(x.name)+'</div><div class="n">'+esc(nm[s.lv-1])+(s.stars?' '+'★'.repeat(s.stars):'')+' · '+s.pts+' điểm</div></div>'+
    '<div class="mg-mv"><button data-move="'+x.id+'|top" aria-label="Lên đầu">'+ic('ui-top','s')+'</button><button data-move="'+x.id+'|-1" aria-label="Lên">'+ic('ui-up','s')+'</button><button data-move="'+x.id+'|1" aria-label="Xuống">'+ic('ui-down','s')+'</button></div></div>'+
    '<div class="mg-btns"><button data-edit="'+x.id+'">'+ic('ui-edit','s')+' Sửa</button><button data-arch="'+x.id+'">'+ic('ui-archive','s')+' Lưu trữ</button><button class="btn-danger" data-del="'+x.id+'">'+ic('ui-trash','s')+' Xóa</button></div></div>'});
  if(!act.length)h+='<div class="empty">Chưa có thói quen nào. Bấm "Thêm thói quen" để bắt đầu.</div>';
  if(arc.length){h+='<div class="day-head">Đã lưu trữ</div><div class="group">';
    arc.forEach(x=>h+='<div class="row">'+ic(x.icon)+'<div class="grow t">'+esc(x.name)+'</div><button data-arch="'+x.id+'" class="chip">Khôi phục</button><button data-del="'+x.id+'" aria-label="Xóa">'+ic('ui-trash')+'</button></div>');h+='</div>'}
  return h}
const unitOf=x=>x.unit||'lần';
const dLab=k=>{const t=dayKey(),y=dayKey(Date.now()-864e5);return k===t?'Hôm nay':k===y?'Hôm qua':k.slice(8)+'/'+k.slice(5,7)};
let histOpen={},statDay=null;
/* Lịch sử: mỗi ngày gom theo thói quen, hiện tổng số lần nhấn; bấm vào để xem từng lần */
function rHistory(){let h='<h1 class="h-date">Lịch sử</h1>';const L=D.log.slice().sort((a,b)=>b.t-a.t),by={};
  for(const l of L){const k=dayKey(l.t);by[k]=by[k]||{};(by[k][l.h]=by[k][l.h]||[]).push(l)}
  const ks=Object.keys(by);if(!ks.length)h+='<div class="empty">Chưa có ghi nhận nào</div>';
  for(const k of ks){h+='<div class="day-head">'+dLab(k)+'</div><div class="group">';
    for(const id in by[k]){const x=D.habits.find(y=>y.id===id);if(!x)continue;const ls=by[k][id],tot=ls.reduce((a,l)=>a+l.v,0),key=k+'|'+id,open=!!histOpen[key];
      h+='<div class="hx"><button class="row hx-h" data-hx="'+key+'" aria-expanded="'+open+'">'+ic(x.icon)+'<div class="grow"><div class="t">'+esc(x.name)+'</div>'+(x.kind==='amount'?'<div class="n">Tổng '+tot+' '+esc(unitOf(x))+'</div>':'')+'</div><span class="hx-n"><b>'+ls.length+'</b> lần</span>'+ic(open?'ui-up':'ui-down','s')+'</button>';
      if(open)h+='<div class="hx-d">'+ls.map(l=>{const d=new Date(l.t);return '<div class="row entry"><div class="grow n">'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+'</div><b>+'+l.v+' '+esc(unitOf(x))+'</b><button data-hdel="'+l.id+'" aria-label="Xóa">'+ic('ui-trash','s')+'</button></div>'}).join('')+'</div>';
      h+='</div>'}
    h+='</div>'}
  return h}
function rStats(){const st=streaks(),n=new Date(),y=n.getFullYear(),m=n.getMonth(),dim=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7,td=dayKey();if(!statDay)statDay=td;
  let h='<h1 class="h-date">Thống kê</h1><div class="stat-row"><div>'+ic('ui-flame')+'<b>'+st.cur+'</b><span>ngày liên tiếp</span></div><i></i><div><b>'+st.best+'</b><span>ngày dài nhất</span></div></div>';
  h+='<div class="day-head">Tháng '+(m+1)+'</div><div class="heat">'+['T2','T3','T4','T5','T6','T7','CN'].map(d=>'<i style="background:none">'+d+'</i>').join('')+'<i style="background:none"></i>'.repeat(off);
  for(let d=1;d<=dim;d++){const k=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'),r=dayRatio(k);
    h+='<i data-hd="'+k+'" data-h="'+(r>=1?4:r>=.66?3:r>=.33?2:r>0?1:0)+'" class="'+(k===statDay?'sel':'')+(k===td?' tdy':'')+'">'+d+'</i>'}
  /* Chi tiết ngày đang chọn, dùng đơn vị của từng thói quen */
  const items=D.habits.map(x=>{const e=perDay(x)[statDay];return e?{x,e}:null}).filter(Boolean);
  h+='</div><div class="day-head">'+(statDay===td?'Hôm nay':'Ngày '+dLab(statDay))+'</div><div class="group">';
  h+=items.length?items.map(o=>'<div class="row">'+ic(o.x.icon)+'<div class="grow"><div class="t">'+esc(o.x.name)+'</div><div class="n">'+o.e.n+' lần nhấn</div></div><b>'+o.e.v+' '+esc(unitOf(o.x))+'</b></div>').join(''):'<div class="empty">Không có ghi nhận</div>';
  h+='</div><div class="day-head">Theo thói quen</div><div class="group">';
  for(const x of D.habits){const s=stat(x),tot=Object.values(perDay(x)).reduce((a,e)=>a+e.v,0);
    h+='<div class="row">'+ic(x.icon)+'<div class="grow"><div class="t">'+esc(x.name)+'</div><div class="n">'+esc(D.cfg.names[s.lv-1])+(s.stars?' '+'★'.repeat(s.stars):'')+' · '+s.pts+' điểm</div></div><b>'+tot+' '+esc(unitOf(x))+'</b></div>'}
  return h+'</div>'}
function sw(k,on){return '<button class="switch" role="switch" aria-checked="'+on+'" data-sw="'+k+'"></button>'}
function rSettings(){let h='<h1 class="h-date">Cài đặt</h1><details class="group"><summary class="row xs"><span class="grow">Tên 12 cấp</span>'+ic('ui-down','s')+'</summary>';
  D.cfg.names.forEach((t,i)=>h+='<div class="row"><div class="grow">Tên cấp '+(i+1)+'</div><input type="text" maxlength="20" value="'+esc(t)+'" data-name="'+i+'" style="width:150px"></div>');
  h+='</details><div class="group"><div class="row"><div class="grow">Giờ bắt đầu ngày mới</div><select data-day style="width:110px"><option value="0"'+(D.cfg.dayStart==0?' selected':'')+'>00:00</option><option value="3"'+(D.cfg.dayStart==3?' selected':'')+'>03:00</option></select></div>'+
  '<div class="row"><div class="grow">Rung</div>'+sw('vibrate',D.cfg.vibrate)+'</div><div class="row"><div class="grow">Giảm hiệu ứng</div>'+sw('reduce',D.cfg.reduce)+'</div></div><div class="group">'+
  '<div class="row"><button class="btn" data-export>'+ic('ui-download')+' Xuất sao lưu</button><label class="btn" style="margin-left:auto">'+ic('ui-upload')+' Nhập<input type="file" accept=".json,application/json" data-import hidden></label></div>'+
  '<div class="row"><button class="btn btn-danger" data-reset>Xóa toàn bộ dữ liệu</button></div></div><p class="h-sub" style="text-align:center">Đã sẵn sàng dùng không cần mạng</p>';
  return h}
const R={habits:rHabits,manage:rManage,history:rHistory,stats:rStats,settings:rSettings};
function formHtml(x){const isNew=!x;x=x||{name:'',icon:'h-star',kind:'count',unit:'lần',step:1,goal:1,mode:'log',limit:0};
  const L=lvsOf(x.id?x:{th:10,inc:5}),nm=D.cfg.names;
  const seg=(k,o,c)=>'<div class="seg" data-seg="'+k+'">'+o.map(a=>'<button type="button" data-v="'+a[0]+'" class="'+(a[0]==c?'is-on':'')+'">'+a[1]+'</button>').join('')+'</div>';
  const num=(id,l,v,m,s,cls)=>'<div class="field '+(cls||'')+'"><label for="'+id+'">'+l+'</label><input type="number" inputmode="numeric" id="'+id+'" min="'+m+'" value="'+v+'">'+(s?'<small>'+s+'</small>':'')+'</div>';
  const lab=['Thăng cấp 1: '+nm[0]+' → '+nm[1],'Thăng cấp 2: '+nm[1]+' → '+nm[2],'Thăng cấp 3: '+nm[2]+' → '+nm[3],'Mỗi ★ sau '+nm[3]];
  return '<div class="f" id="fform" data-kind="'+x.kind+'"><h2 class="h-date">'+(x.id?'Sửa':'Thêm')+' thói quen</h2>'+
  '<div class="fcard"><h3 class="fsec">Thông tin</h3><div class="field"><label for="f-name">Tên</label><input type="text" id="f-name" maxlength="40" value="'+esc(x.name)+'"></div>'+
  '<div class="field" style="margin:0"><label>Biểu tượng</label><div class="icon-grid">'+HICONS.map(i=>'<button type="button" data-ic="'+i+'" class="'+(i===x.icon?'is-on':'')+'">'+ic(i)+'</button>').join('')+'</div></div></div>'+
  '<div class="fcard"><h3 class="fsec">Cách ghi nhận</h3>'+seg('kind',[['count','Đếm lần'],['amount','Theo lượng']],x.kind)+
  '<div class="g2" style="margin-top:12px"><div class="field"><label for="f-unit">Đơn vị</label><input type="text" id="f-unit" maxlength="12" placeholder="lần, ml, trang…" value="'+esc(x.unit)+'"></div>'+num('f-step','Cộng nhanh',x.step,1,'','only-amount')+'</div>'+
  num('f-goal','Mục tiêu mỗi ngày',x.goal,0,'Nhập 0 = không đặt mục tiêu (làm 1 lần là xong, không giới hạn số lượng)')+'</div>'+
  '<div class="fcard"><h3 class="fsec">Cách tính điểm</h3>'+seg('mode',[['log','Mỗi lần'],['day','Mỗi ngày'],['amount','Theo lượng']],x.mode)+
  '<small class="hint">Mỗi lần: 1 lần ghi nhận = 1 điểm. Mỗi ngày: đạt mục tiêu = 1 điểm. Theo lượng: điểm bằng tổng lượng.</small>'+
  '<div style="margin-top:12px">'+num('f-limit','Điểm tối đa mỗi ngày',x.limit,0,'Nhập 0 = không giới hạn')+'</div></div>'+
  '<details class="fcard xpd"><summary><span>Điểm cần thăng cấp</span><small>'+esc(nm[0])+' → '+esc(nm[11])+'</small>'+ic('ui-down','s')+'</summary>'+
  '<div class="qf"><div class="field"><label for="f-fb">Cấp đầu</label><input type="number" inputmode="numeric" id="f-fb" min="1" value="'+L[0]+'"></div><div class="field"><label for="f-fi">Mỗi cấp thêm</label><input type="number" inputmode="numeric" id="f-fi" min="0" value="'+Math.max(0,L[1]-L[0])+'"></div><button type="button" class="btn" data-fill>Điền nhanh</button></div>'+
  L.map((v,i)=>'<div class="lr2"><label for="f-l'+i+'">'+(i<11?esc(nm[i])+' → '+esc(nm[i+1]):'Mỗi ★ sau '+esc(nm[11]))+'</label><input class="lvin" type="number" inputmode="numeric" id="f-l'+i+'" min="1" value="'+v+'"></div>').join('')+
  '<small class="hint"><a href="#" data-th2>Chế độ thử hiệu ứng: đặt tất cả = 2</a></small></details>'+
  '<div class="fsave"><button class="btn btn-primary" data-save="'+(x.id||'')+'" style="width:100%">Lưu</button></div></div>'}
