const $=id=>document.getElementById(id);
const widthEl=$('width'),heightEl=$('height'),qtyEl=$('qty'),assembleEl=$('assemble');
const totalEl=$('total'),detailEl=$('detail'),copyBtn=$('copyBtn');
const basePriceEl=$('basePrice'),widthPriceEl=$('widthPrice'),heightPriceEl=$('heightPrice'),assemblePriceEl=$('assemblePrice');
const unitPriceEl=$('unitPrice'),qtyTextEl=$('qtyText'),itemsTotalEl=$('itemsTotal'),shippingPriceEl=$('shippingPrice');
let currentTotal=KD_PRICE.base+6000;

function comma(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function won(n){return comma(n)+'원'}
function priceOf(type,size){return KD_PRICE[type][size-KD_PRICE.min]||0}
function shipping(qty){return Math.ceil(qty/3)*6000}

function makeOptions(){
  for(let i=KD_PRICE.min;i<=KD_PRICE.max;i++){
    widthEl.add(new Option(`${i}cm  +${won(priceOf('width',i))}`,i));
    heightEl.add(new Option(`${i}cm  +${won(priceOf('height',i))}`,i));
  }
  for(let i=1;i<=30;i++){
    qtyEl.add(new Option(`${i}개`,i));
  }
}

function animatePrice(to){
  const from=currentTotal,start=performance.now(),duration=320;
  function step(now){
    const p=Math.min((now-start)/duration,1),e=1-Math.pow(1-p,3);
    totalEl.textContent=won(from+(to-from)*e);
    if(p<1)requestAnimationFrame(step);
    else{currentTotal=to;totalEl.textContent=won(to)}
  }
  requestAnimationFrame(step)
}

function calc(){
  const w=Number(widthEl.value);
  const h=Number(heightEl.value);
  const qty=Number(qtyEl.value || 1);
  const asm=assembleEl.checked;

  const wp=priceOf('width',w);
  const hp=priceOf('height',h);
  const ap=asm?KD_PRICE.assemble:0;
  const unit=KD_PRICE.base+wp+hp+ap;
  const itemsTotal=unit*qty;
  const ship=shipping(qty);
  const total=itemsTotal+ship;

  animatePrice(total);

  detailEl.textContent=`가로 ${w}cm / 세로 ${h}cm / 수량 ${qty}개 / 조립요청 ${asm?'있음':'없음'}`;
  basePriceEl.textContent=won(KD_PRICE.base);
  widthPriceEl.textContent=won(wp);
  heightPriceEl.textContent=won(hp);
  assemblePriceEl.textContent=won(ap);
  unitPriceEl.textContent=won(unit);
  qtyTextEl.textContent=qty+'개';
  itemsTotalEl.textContent=won(itemsTotal);
  shippingPriceEl.textContent=won(ship);

  return {w,h,qty,asm,unit,itemsTotal,ship,total}
}

copyBtn.addEventListener('click',async()=>{
  const r=calc();
  const text=`강동자바라 알루미늄 방범창 견적 문의\n\n가로: ${r.w}cm\n세로: ${r.h}cm\n조립요청: ${r.asm?'있음':'없음'}\n제품 단가: ${won(r.unit)}\n수량: ${r.qty}개\n제품 소계: ${won(r.itemsTotal)}\n배송비: ${won(r.ship)}\n최종 예상금액: ${won(r.total)}\n\n문의: 010-7595-0484`;
  try{
    await navigator.clipboard.writeText(text);
    alert('견적내용이 복사되었습니다.')
  }catch(e){
    prompt('아래 내용을 복사해주세요.',text)
  }
});

widthEl.addEventListener('change',calc);
heightEl.addEventListener('change',calc);
qtyEl.addEventListener('change',calc);
assembleEl.addEventListener('change',calc);
makeOptions();
calc();
