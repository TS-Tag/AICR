const translations = {
  en: { home:"Home", about:"About", category:"Categories", search:"Search...", filters:"Filters", add:"Add to Cart", contact:"Contact Us", intro:"Al Ahliya INT. sources top‑tier...", mission:"Our mission is to deliver...", vision:"We work with leading suppliers...", partners:"Our Trusted Partners" },
  ar: { home:"الرئيسية", about:"من نحن", category:"الفئات", search:"ابحث...", filters:"تصفية", add:"أضف إلى السلة", contact:"تواصل معنا", intro:"...", mission:"...", vision:"...", partners:"شركاؤنا الموثوقون" }
};
let currentLang = localStorage.getItem('lang')||'en';
let cart = JSON.parse(localStorage.getItem('cart')||'{}');
function toggleMenu(){document.querySelector('.nav-links').classList.toggle('open');}
function applyLang(){
  document.querySelectorAll('[data-lang]').forEach(el=>el.textContent=translations[currentLang][el.dataset.lang]);
  document.getElementById('lang-toggle').textContent = currentLang==='en'?'EN':'عربي';
}
function switchLang(){ currentLang=currentLang==='en'?'ar':'en'; localStorage.setItem('lang',currentLang); applyLang();}
function applyTheme(){ if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark'); }
function switchTheme(){
  if(document.body.classList.toggle('dark')) localStorage.setItem('theme','dark');
  else localStorage.setItem('theme','light');
}
function updateCartCount(){
  document.getElementById('cart-count').textContent = Object.values(cart).reduce((a,b)=>a+b,0);
}
function loadProducts(){
  fetch('products.csv').then(r=>r.text()).then(csv=>{
    const rows = csv.trim().split('\n').slice(1);
    window.products = rows.map(r=>{
      const [id,name,category,price,image,description] = r.split(',');
      return {id,name,category,price:parseFloat(price),image,description};
    });
    setupFilters();
    displayProducts(window.products);
    updateCartCount();
  });
}
function setupFilters(){
  const sel = document.getElementById('category-filter');
  sel.innerHTML = `<option value="">${translations[currentLang].category}</option>`;
  [...new Set(window.products.map(p=>p.category))].forEach(c=>{
    sel.innerHTML += `<option value="${c}">${c}</option>`;
  });
  sel.onchange = applyFilters;
  document.getElementById('search-input').placeholder=translations[currentLang].search;
  document.getElementById('search-input').oninput = applyFilters;
  document.getElementById('price-sort').onchange = applyFilters;
}
function applyFilters(){
  const cat = document.getElementById('category-filter').value;
  const term = document.getElementById('search-input').value.trim().toLowerCase();
  const sort = document.getElementById('price-sort').value;
  let list = window.products.filter(p=>{
    return (!cat||p.category===cat) && (!term||p.name.toLowerCase().includes(term));
  });
  if(sort==='asc') list.sort((a,b)=>a.price-b.price);
  if(sort==='desc') list.sort((a,b)=>b.price-a.price);
  displayProducts(list);
}
function displayProducts(list){
  const div = document.getElementById('products-grid');
  div.innerHTML = list.map(p=>`
    <div class="card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>KWD ${p.price.toFixed(3)}</p>
      <button onclick="addToCart('${p.id}')">${translations[currentLang].add}</button>
    </div>`).join('');
}
function addToCart(id){
  cart[id] = (cart[id]||0)+1;
  localStorage.setItem('cart',JSON.stringify(cart));
  updateCartCount();
}
document.addEventListener('DOMContentLoaded',()=>{
  applyLang();
  applyTheme();
  loadProducts();
});
