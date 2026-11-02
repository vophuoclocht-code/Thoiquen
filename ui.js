'use strict';
const $=s=>document.querySelector(s);
const DOW=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const ic=(n,c='')=>'<svg class="ic '+c+'"><use href="#'+n+'"/></svg>';
const LV=['#3a0d7c','#6a14b8','#a43ee6','#e3a6ff'],LV2=['#6a2bc4','#a050e6','#dba0f7','#fbeaff'];
/* Huy hiệu: số vòng sóng = số cấp, ngôi sao vàng ở tâm */
function badge(lv){let r='';for(let i=0;i<lv;i++){const rx=9+i*6,ry=4+i*3.2;
  r+='<path d="M'+(28-rx)+' 30A'+rx+' '+ry+' 0 0 0 '+(28+rx)+' 30" fill="none" stroke="#ffc457" stroke-width="1.6" stroke-linecap="round" opacity="'+(1-i*.15)+'"/>'}
  return '<svg viewBox="0 0 56 48">'+r+'<path d="M28 6c1 6 4 9 9 12-5 3-8 6-9 12-1-6-4-9-9-12 5-3 8-6 9-12z" fill="#fff0b3" stroke="#ff8a3d" stroke-width="1"/></svg>'}
function ringSvg(p){return '<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#eee7fa" stroke-width="7"/><circle cx="32" cy="32" r="26" fill="none" stroke="url(#gp)" stroke-width="7" stroke-linecap="round" stroke-dasharray="163.4" stroke-dashoffset="'+(163.4*(1-p)).toFixed(1)+'" transform="rotate(-90 32 32)"/></svg>'}
function rHabits(){const hs=D.habits.filter(h=>!h.arch),n=new Date();
  const p=hs.length?hs.reduce((a,h)=>a+prog(h),0)/hs.length:0,done=hs.filter(h=>prog(h)>=1).length;
  let h='<h1 class="h-date">'+DOW[n.getDay()]+', '+n.getDate()+' tháng '+(n.getMonth()+1)+'</h1>';
  h+='<div class="today"><div class="today-t"><span>'+done+'/'+hs.length+' thói quen xong</span><b>'+Math.round(p*100)+'%</b></div><div class="bar"><i style="width:'+(p*100).toFixed(1)+'%"></i></div></div>';
  if(!hs.length)h+='<div class="empty">Chưa có thói quen nào.<br>Vào tab Quản lý để thêm thói quen đầu tiên.</div>';
  for(const x of hs){const s=stat(x),u=x.unit?' '+esc(x.unit):'';
    h+='<article class="habit" data-lv="'+s.lv+'" data-id="'+x.id+'"><div class="h-top"><div class="h-ic">'+ic(x.icon,'l')+'</div><div class="h-main"><div class="h-name">'+esc(x.name)+'</div>'+
    '<div class="h-meta">Hôm nay <b>'+s.today.v+(x.goal>0?'/'+x.goal:'')+u+'</b>'+(s.full?' <span class="full-tag">· đủ hôm nay</span>':'')+'</div></div>'+
    '<div class="badge">'+badge(s.lv)+'<span>'+esc(D.cfg.names[s.lv-1])+'</span></div></div>'+
    '<div class="wave"><i style="--pct:'+(s.into/s.th*100).toFixed(1)+'%"></i></div>'+
    '<div class="h-foot"><div class="h-meta">Lên cấp <b>'+s.into+'/'+s.th+'</b> <span class="stars">'+'★'.repeat(s.stars)+'</span></div><button class="add" data-add aria-label="Ghi nhận">'+ic('ui-plus','l')+'</button></div></article>'}
  return h}
/* Đường kinh nghiệm: cấp đầu cần th điểm, mỗi cấp sau cần thêm inc điểm (như XP trong game) */
function xpChips(th,inc){return [0,1,2,3].map(k=>{const v=Math.max(1,th+k*inc);
  return '<span class="xp" style="background:linear-gradient(90deg,'+LV[k]+','+LV2[k]+');color:'+(k==3?'#2a0a55':'#fff')+'">'+(k<3?(k+1)+'→'+(k+2):'★')+' <b>'+v+'</b></span>'}).join('')}
function updateXp(){const e=$('#xp-prev');if(e)e.innerHTML=xpChips(Math.max(1,+$('#f-th').value||10),Math.max(0,+$('#f-inc').value||0))}
const MODE={log:'1 điểm / lần',day:'1 điểm / ngày đạt mục tiêu',amount:'điểm theo lượng'};
function rManage(){const act=D.habits.filter(x=>!x.arch),arc=D.habits.filter(x=>x.arch);
  let h='<h1 class="h-date">Quản lý</h1><p class="h-sub">'+act.length+' thói quen đang theo dõi</p><button class="btn btn-primary" data-new style="width:100%;margin:14px 0">'+ic('ui-plus')+' Thêm thói quen</button>';
  act.forEach(x=>{const s=stat(x);
    h+='<div class="mg"><div class="mg-top"><span class="mg-ic" data-lv="'+s.lv+'">'+ic(x.icon)+'</span><div class="grow"><div class="t">'+esc(x.name)+'</div><div class="n">'+(x.goal>0?'Mục tiêu '+x.goal+(x.unit?' '+esc(x.unit):'')+'/ngày':'Không đặt mục tiêu')+' · '+MODE[x.mode]+(x.limit>0?' · tối đa '+x.limit+'/ngày':'')+'</div></div>'+
    '<div class="mg-mv"><button data-move="'+x.id+'|top" aria-label="Lên đầu">'+ic('ui-top','s')+'</button><button data-move="'+x.id+'|-1" aria-label="Lên">'+ic('ui-up','s')+'</button><button data-move="'+x.id+'|1" aria-label="Xuống">'+ic('ui-down','s')+'</button></div></div>'+
    '<div class="mg-xp">'+xpChips(x.th,x.inc||0)+'</div><div class="mg-btns"><button data-edit="'+x.id+'">'+ic('ui-edit','s')+' Sửa</button><button data-arch="'+x.id+'">'+ic('ui-archive','s')+' Lưu trữ</button><button class="btn-danger" data-del="'+x.id+'">'+ic('ui-trash','s')+' Xóa</button></div></div>'});
  if(!act.length)h+='<div class="empty">Chưa có thói quen nào. Bấm "Thêm thói quen" và chọn một mẫu dựng sẵn.</div>';
  if(arc.length){h+='<div class="day-head">Đã lưu trữ</div><div class="group">';
    arc.forEach(x=>h+='<div class="row">'+ic(x.icon)+'<div class="grow t">'+esc(x.name)+'</div><button data-arch="'+x.id+'" class="chip">Khôi phục</button><button data-del="'+x.id+'" aria-label="Xóa">'+ic('ui-trash')+'</button></div>');h+='</div>'}
  return h}
function rHistory(){const L=D.log.slice().sort((a,b)=>b.t-a.t),by={};let h='<h1 class="h-date">Lịch sử</h1>';
  for(const l of L)(by[dayKey(l.t)]=by[dayKey(l.t)]||[]).push(l);
  const ks=Object.keys(by),td=dayKey(),yd=dayKey(Date.now()-864e5);
  if(!ks.length)h+='<div class="empty">Chưa có ghi nhận nào</div>';
  for(const k of ks){h+='<div class="day-head">'+(k===td?'Hôm nay':k===yd?'Hôm qua':k.split('-').reverse().join('/'))+'</div><div class="group">';
    for(const l of by[k]){const x=D.habits.find(y=>y.id===l.h);if(!x)continue;const d=new Date(l.t);
      h+='<div class="row entry">'+ic(x.icon)+'<div class="grow"><div class="t">'+esc(x.name)+'</div><div class="n">'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+' · +'+l.v+(x.unit?' '+esc(x.unit):'')+'</div></div><button data-hdel="'+l.id+'" aria-label="Xóa">'+ic('ui-trash')+'</button></div>'}
    h+='</div>'}
  return h}
function rStats(){const st=streaks(),n=new Date(),y=n.getFullYear(),m=n.getMonth(),dim=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7;
  let h='<h1 class="h-date">Thống kê</h1><div class="stat-grid" style="margin-top:12px"><div class="stat">'+ic('ui-flame')+'<b>'+st.cur+'</b>ngày liên tiếp</div><div class="stat"><b>'+st.best+'</b>dài nhất</div></div>';
  h+='<div class="day-head">Tháng '+(m+1)+'</div><div class="heat">'+['T2','T3','T4','T5','T6','T7','CN'].map(d=>'<i style="background:none">'+d+'</i>').join('')+'<i style="background:none"></i>'.repeat(off);
  for(let d=1;d<=dim;d++){const r=dayRatio(y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'));h+='<i data-h="'+(r>=1?4:r>=.66?3:r>=.33?2:r>0?1:0)+'">'+d+'</i>'}
  h+='</div><div class="day-head">Theo thói quen</div><div class="group">';
  for(const x of D.habits){const s=stat(x);h+='<div class="row">'+ic(x.icon)+'<div class="grow"><div class="t">'+esc(x.name)+'</div><div class="n">'+esc(D.cfg.names[s.lv-1])+(s.stars?' '+'★'.repeat(s.stars):'')+'</div></div><b>'+s.pts+' đ</b></div>'}
  return h+'</div>'}
function sw(k,on){return '<button class="switch" role="switch" aria-checked="'+on+'" data-sw="'+k+'"></button>'}
function rSettings(){let h='<h1 class="h-date">Cài đặt</h1><div class="group">';
  D.cfg.names.forEach((t,i)=>h+='<div class="row"><div class="grow">Tên cấp '+(i+1)+'</div><input type="text" maxlength="20" value="'+esc(t)+'" data-name="'+i+'" style="width:150px"></div>');
  h+='<div class="row"><div class="grow">Giờ bắt đầu ngày mới</div><select data-day style="width:110px"><option value="0"'+(D.cfg.dayStart==0?' selected':'')+'>00:00</option><option value="3"'+(D.cfg.dayStart==3?' selected':'')+'>03:00</option></select></div>'+
  '<div class="row"><div class="grow">Rung</div>'+sw('vibrate',D.cfg.vibrate)+'</div><div class="row"><div class="grow">Giảm hiệu ứng</div>'+sw('reduce',D.cfg.reduce)+'</div></div><div class="group">'+
  '<div class="row"><button class="btn" data-export>'+ic('ui-download')+' Xuất sao lưu</button><label class="btn" style="margin-left:auto">'+ic('ui-upload')+' Nhập<input type="file" accept=".json,application/json" data-import hidden></label></div>'+
  '<div class="row"><button class="btn btn-danger" data-reset>Xóa toàn bộ dữ liệu</button></div></div><p class="h-sub" style="text-align:center">Đã sẵn sàng dùng không cần mạng</p>';
  return h}
const R={habits:rHabits,manage:rManage,history:rHistory,stats:rStats,settings:rSettings};
const TPL=[{name:'Uống nước',icon:'h-water',kind:'amount',unit:'ml',step:250,goal:2000,mode:'day',limit:0,th:7,inc:3},
{name:'Đọc sách',icon:'h-book',kind:'amount',unit:'trang',step:10,goal:20,mode:'day',limit:0,th:7,inc:3},
{name:'Thiền',icon:'h-meditate',kind:'amount',unit:'phút',step:5,goal:10,mode:'day',limit:0,th:7,inc:3},
{name:'Chạy bộ',icon:'h-run',kind:'amount',unit:'phút',step:10,goal:30,mode:'day',limit:0,th:7,inc:3},
{name:'Ngủ sớm',icon:'h-moon',kind:'count',unit:'',step:1,goal:1,mode:'day',limit:0,th:7,inc:3}];
function formHtml(x){const isNew=!x;x=x||{name:'',icon:'h-star',kind:'count',unit:'lần',step:1,goal:1,mode:'log',limit:0,th:10,inc:5};
  const o=(v,t,c)=>'<option value="'+v+'"'+(c==v?' selected':'')+'>'+t+'</option>',f=(l,i,s)=>'<div class="field"><label>'+l+'</label>'+i+(s?'<small>'+s+'</small>':'')+'</div>';
  return '<h2 class="h-date">'+(x.id?'Sửa':'Thêm')+' thói quen</h2>'+
  (isNew?'<div class="field"><label>Mẫu dựng sẵn</label><div class="chips">'+TPL.map((t,i)=>'<button class="chip" data-tpl="'+i+'">'+ic(t.icon,'s')+' '+t.name+'</button>').join('')+'</div></div>':'')+
  f('Tên','<input type="text" id="f-name" maxlength="40" value="'+esc(x.name)+'">')+
  f('Biểu tượng','<div class="icon-grid">'+HICONS.map(i=>'<button data-ic="'+i+'" class="'+(i===x.icon?'is-on':'')+'">'+ic(i)+'</button>').join('')+'</div>')+
  '<div class="fsec">Mục tiêu</div>'+
  f('Loại','<select id="f-kind">'+o('count','Đếm lần',x.kind)+o('amount','Theo lượng (ml, trang, phút…)',x.kind)+'</select>')+
  f('Đơn vị','<input type="text" id="f-unit" maxlength="12" value="'+esc(x.unit)+'">')+
  f('Bước cộng nhanh','<input type="number" id="f-step" min="1" value="'+x.step+'">','Mỗi lần bấm nút cộng được thêm bấy nhiêu')+
  f('Mục tiêu mỗi ngày','<input type="number" id="f-goal" min="0" value="'+x.goal+'">','Nhập 0 = không đặt mục tiêu (làm 1 lần là xong, cộng bao nhiêu cũng được)')+
  '<div class="fsec">Điểm</div>'+
  f('Cách tính điểm','<select id="f-mode">'+o('log','Mỗi lần ghi nhận = 1 điểm',x.mode)+o('day','Mỗi ngày đạt mục tiêu = 1 điểm',x.mode)+o('amount','Theo tổng lượng',x.mode)+'</select>')+
  f('Điểm tối đa mỗi ngày','<input type="number" id="f-limit" min="0" value="'+x.limit+'">','0 = không giới hạn')+
  '<div class="fsec">Lên cấp kiểu game</div>'+
  f('Điểm cần cho cấp đầu','<input type="number" id="f-th" min="1" value="'+x.th+'">')+
  f('Mỗi cấp sau cần thêm','<input type="number" id="f-inc" min="0" value="'+(x.inc||0)+'">','Ví dụ 10 và +5: cấp 1→2 cần 10, 2→3 cần 15, 3→4 cần 20, mỗi ★ tiếp theo tăng dần')+
  '<div class="mg-xp" id="xp-prev"></div><p class="h-sub"><a href="#" data-th2>Chế độ thử hiệu ứng (đặt 2 điểm)</a></p>'+
  '<button class="btn btn-primary" data-save="'+(x.id||'')+'" style="width:100%;margin-top:8px">Lưu</button>'}
