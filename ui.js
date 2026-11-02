'use strict';
const $=s=>document.querySelector(s);
const DOW=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const ic=(n,c='')=>'<svg class="ic '+c+'"><use href="#'+n+'"/></svg>';
const LV=['#3a0d7c','#6a14b8','#a43ee6','#e3a6ff'],LV2=['#4a12a0','#7a22cc','#b457ee','#f3cfff'];
/* Huy hiệu: số vòng sóng = số cấp, ngôi sao vàng ở tâm */
function badge(lv){let r='';for(let i=0;i<lv;i++){const rx=9+i*6,ry=4+i*3.2;
  r+='<path d="M'+(28-rx)+' 30A'+rx+' '+ry+' 0 0 0 '+(28+rx)+' 30" fill="none" stroke="#ffc457" stroke-width="1.6" stroke-linecap="round" opacity="'+(1-i*.15)+'"/>'}
  return '<svg viewBox="0 0 56 48">'+r+'<path d="M28 6c1 6 4 9 9 12-5 3-8 6-9 12-1-6-4-9-9-12 5-3 8-6 9-12z" fill="#fff0b3" stroke="#ff8a3d" stroke-width="1"/></svg>'}
function ringSvg(p){return '<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#eee7fa" stroke-width="7"/><circle cx="32" cy="32" r="26" fill="none" stroke="url(#gp)" stroke-width="7" stroke-linecap="round" stroke-dasharray="163.4" stroke-dashoffset="'+(163.4*(1-p)).toFixed(1)+'" transform="rotate(-90 32 32)"/></svg>'}
function rHabits(){const hs=D.habits.filter(h=>!h.arch),n=new Date();
  const p=hs.length?hs.reduce((a,h)=>a+prog(h),0)/hs.length:0,done=hs.filter(h=>prog(h)>=1).length;
  let h='<h1 class="h-date">'+DOW[n.getDay()]+', '+n.getDate()+' tháng '+(n.getMonth()+1)+'</h1>';
  h+='<div class="today">'+ringSvg(p)+'<div><b>'+done+'/'+hs.length+' thói quen xong</b><div class="h-sub">'+Math.round(p*100)+'% hôm nay</div></div></div>';
  if(!hs.length)h+='<div class="empty">Chưa có thói quen nào.<br>Vào tab Quản lý để thêm thói quen đầu tiên.</div>';
  for(const x of hs){const s=stat(x),u=x.unit?' '+esc(x.unit):'';
    h+='<article class="habit" data-lv="'+s.lv+'" data-id="'+x.id+'"><div class="h-ic">'+ic(x.icon,'l')+'</div><div><div class="h-name">'+esc(x.name)+'</div>'+
    '<div class="h-meta">Hôm nay <b>'+s.today.v+'/'+(x.goal||1)+u+'</b>'+(s.full?' <span class="full-tag">đủ hôm nay</span>':'')+'</div></div>'+
    '<button class="add" data-add aria-label="Ghi nhận">'+ic('ui-plus','l')+'</button><div class="badge">'+badge(s.lv)+'<span>'+esc(D.cfg.names[s.lv-1])+'</span></div>'+
    '<div class="wave"><i style="--pct:'+(s.into/s.th*100)+'%"></i></div><div class="h-meta" style="grid-column:1/-1">Lên cấp <b>'+s.into+'/'+s.th+'</b> <span class="stars">'+'★'.repeat(s.stars)+'</span></div></article>'}
  return h}
function rManage(){let h='<h1 class="h-date">Quản lý</h1><p class="h-sub">Thêm, sửa, xóa thói quen</p><div class="group">';
  for(const x of D.habits)h+='<div class="row">'+ic(x.icon)+'<div class="grow"><div class="t">'+esc(x.name)+'</div><div class="n">'+x.th+' điểm / cấp</div></div>'+
    '<button data-edit="'+x.id+'" aria-label="Sửa">'+ic('ui-edit')+'</button><button data-del="'+x.id+'" aria-label="Xóa">'+ic('ui-trash')+'</button></div>';
  if(!D.habits.length)h+='<div class="empty">Chưa có thói quen</div>';
  return h+'</div><button class="btn btn-primary" data-new style="width:100%">'+ic('ui-plus')+' Thêm thói quen</button>'}
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
function formHtml(x){x=x||{name:'',icon:'h-star',kind:'count',unit:'',step:1,goal:1,mode:'log',limit:0,th:10};
  const o=(v,t,c)=>'<option value="'+v+'"'+(c==v?' selected':'')+'>'+t+'</option>';
  return '<h2 class="h-date">'+(x.id?'Sửa':'Thêm')+' thói quen</h2><div class="field"><label>Tên</label><input type="text" id="f-name" maxlength="40" value="'+esc(x.name)+'"></div>'+
  '<div class="field"><label>Biểu tượng</label><div class="icon-grid">'+HICONS.map(i=>'<button data-ic="'+i+'" class="'+(i===x.icon?'is-on':'')+'">'+ic(i)+'</button>').join('')+'</div></div>'+
  '<div class="field"><label>Loại</label><select id="f-kind">'+o('count','Đếm lần',x.kind)+o('amount','Theo lượng (ml, trang, phút…)',x.kind)+'</select></div>'+
  '<div class="field"><label>Đơn vị</label><input type="text" id="f-unit" maxlength="12" value="'+esc(x.unit)+'"></div>'+
  '<div class="field"><label>Bước cộng nhanh</label><input type="number" id="f-step" min="1" value="'+x.step+'"></div>'+
  '<div class="field"><label>Mục tiêu mỗi ngày</label><input type="number" id="f-goal" min="1" value="'+x.goal+'"></div>'+
  '<div class="field"><label>Cách tính điểm</label><select id="f-mode">'+o('log','Mỗi lần ghi nhận = 1 điểm',x.mode)+o('day','Mỗi ngày đạt mục tiêu = 1 điểm',x.mode)+o('amount','Theo tổng lượng',x.mode)+'</select></div>'+
  '<div class="field"><label>Giới hạn điểm / ngày</label><input type="number" id="f-limit" min="0" value="'+x.limit+'"><small>0 = không giới hạn</small></div>'+
  '<div class="field"><label>Điểm để lên 1 cấp</label><input type="number" id="f-th" min="1" value="'+x.th+'"><small><a href="#" data-th2>Chế độ thử: đặt 2 điểm</a></small></div>'+
  '<button class="btn btn-primary" data-save="'+(x.id||'')+'" style="width:100%">Lưu</button>'}
