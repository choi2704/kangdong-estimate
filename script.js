const $=id=>document.getElementById(id);
const widthEl=$('width'),heightEl=$('height'),assembleEl=$('assemble');
const totalEl=$('total'),detailEl=$('detail'),copyBtn=$('copyBtn');
const basePriceEl=$('basePrice'),widthPriceEl=$('widthPrice'),heightPriceEl=$('heightPrice'),assemblePriceEl=$('assemblePrice');
let currentTotal=KD_PRICE.base;
function comma(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function won(n){return comma(n)+'원'}
function priceOf(type,size){return KD_PRICE[type][size-KD_PRICE.min]||0}
function makeOptions(){for(let i=KD_PRICE.min;i<=KD_PRICE.max;i++){widthEl.add(new Option(`${i}cm  +${won(priceOf('width',i))}`,i));heightEl.add(new Option(`${i}cm  +${won(priceOf('height',i))}`,i));}}
function animatePrice(to){const from=currentTotal,start=performance.now(),duration=320;function step(now){const p=Math.min((now-start)/duration,1),e=1-Math.pow(1-p,3);totalEl.textContent=won(from+(to-from)*e);if(p<1)requestAnimationFrame(step);else{currentTotal=to;totalEl.textContent=won(to)}}requestAnimationFrame(step)}
function calc(){const w=Number(widthEl.value),h=Number(heightEl.value),asm=assembleEl.checked;const wp=priceOf('width',w),hp=priceOf('height',h),ap=asm?KD_PRICE.assemble:0,total=KD_PRICE.base+wp+hp+ap;animatePrice(total);detailEl.textContent=`가로 ${w}cm / 세로 ${h}cm / 조립요청 ${asm?'있음':'없음'}`;basePriceEl.textContent=won(KD_PRICE.base);widthPriceEl.textContent=won(wp);heightPriceEl.textContent=won(hp);assemblePriceEl.textContent=won(ap);return{w,h,asm,total}}
copyBtn.addEventListener('click',async()=>{const r=calc();const text=`강동자바라 알루미늄 방범창 견적 문의\n\n가로: ${r.w}cm\n세로: ${r.h}cm\n조립요청: ${r.asm?'있음':'없음'}\n예상금액: ${won(r.total)}\n\n문의: 010-3050-0482`;try{await navigator.clipboard.writeText(text);alert('견적내용이 복사되었습니다.')}catch(e){prompt('아래 내용을 복사해주세요.',text)}});
widthEl.addEventListener('change',calc);heightEl.addEventListener('change',calc);assembleEl.addEventListener('change',calc);makeOptions();calc();