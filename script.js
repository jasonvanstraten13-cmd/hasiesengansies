var brandStyles=document.createElement('link');
brandStyles.rel='stylesheet';
brandStyles.href=window.location.pathname.includes('/shop/')?'../brand.css':'brand.css';
document.head.appendChild(brandStyles);

function formatWhatsApp(value){
  var number=value.replace(/[\s\-()+]/g,'');
  if(number.indexOf('0')===0){
    number='27'+number.substring(1);
  }else if(number.indexOf('27')!==0){
    number='27'+number;
  }
  return number;
}

document.addEventListener('DOMContentLoaded',function(){
  var compactFooterStyle=document.createElement('style');
  compactFooterStyle.textContent='body{background-color:#faf7f1;background-image:radial-gradient(circle at 12% 16%,rgba(202,215,232,.3) 0 1px,transparent 1.5px),radial-gradient(circle at 82% 68%,rgba(243,210,217,.3) 0 1px,transparent 1.5px);background-size:34px 34px,42px 42px;background-attachment:fixed}.site-header{background:#fff!important}.footer-credit{padding:10px 12px;border-radius:12px;gap:3px;box-shadow:0 6px 14px rgba(0,0,0,.16)}.footer-credit__label{font-size:9px}.footer-credit__brand{font-size:16px}.contact-action{display:flex!important;align-items:center;gap:10px}.contact-action svg,.social-link svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.social-links{display:flex;gap:10px;margin-top:10px}.social-link{display:inline-flex!important;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid var(--brand-beige);border-radius:50%;color:var(--brand-sage);background:#fff}.social-link:hover{background:var(--brand-pink);transform:translateY(-2px)}';
  document.head.appendChild(compactFooterStyle);
  var motionStyle=document.createElement('style');
  motionStyle.textContent='@keyframes hg-drift{0%,100%{transform:translate3d(0,0,0) rotate(-2deg)}50%{transform:translate3d(0,-10px,0) rotate(2deg)}}@keyframes hg-sway{0%,100%{transform:rotate(-3deg) translateY(0)}50%{transform:rotate(3deg) translateY(-5px)}}@keyframes hg-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}.hero-art{isolation:isolate}.hero-art:before,.hero-art:after{content:"";position:absolute;z-index:-1;pointer-events:none}.hero-art:before{top:12%;right:-34px;width:54px;height:110px;border:3px solid var(--brand-sage);border-left:0;border-radius:0 100% 0 100%;opacity:.5;transform-origin:bottom left;animation:hg-sway 5s ease-in-out infinite}.hero-art:after{left:-22px;top:25%;width:20px;height:34px;background:var(--brand-pink);border-radius:100% 0 100% 0;opacity:.8;animation:hg-drift 6s ease-in-out infinite}.art-note{animation:hg-drift 6s ease-in-out infinite}.value-card,.product-card,.shop-card{animation:hg-rise .7s both}.value-card:nth-child(2),.product-card:nth-child(2),.shop-card:nth-child(2){animation-delay:.1s}.value-card:nth-child(3),.product-card:nth-child(3),.shop-card:nth-child(3){animation-delay:.2s}.value-card:hover,.product-card:hover,.shop-card:hover{transform:translateY(-6px);transition:transform 180ms ease,box-shadow 180ms ease;box-shadow:0 14px 30px rgba(75,70,63,.12)}.image-rail img:nth-child(2){animation:hg-drift 8s ease-in-out infinite}.image-rail img:nth-child(3){animation:hg-drift 9s ease-in-out infinite reverse}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}';
  document.head.appendChild(motionStyle);
  document.querySelectorAll('.brand').forEach(function(brand){
    if(!brand.querySelector('.brand-logo')){
      var logo=document.createElement('img');
      logo.className='brand-logo';
      logo.width=246;
      logo.height=90;
      logo.style.width='246px';
      logo.style.height='90px';
      logo.style.objectFit='contain';
      logo.src=window.location.pathname.includes('/shop/')?'../hasies-en-gansies-logo.jpg':'hasies-en-gansies-logo.jpg';
      logo.alt='Hasies en Gansies';
      brand.style.minWidth='246px';
      brand.style.minHeight='90px';
      brand.textContent='';
      brand.appendChild(logo);
    }
  });
  var contactIcons={
    'tel:':'<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M6.6 3.5 9 3l2.2 5-2.1 1.5a14 14 0 0 0 5.4 5.4l1.5-2.1 5 2.2-.5 2.4a2 2 0 0 1-2 1.6C11.6 18.5 5.5 12.4 4.6 5.5a2 2 0 0 1 2-2Z"/></svg>',
    'mailto:':'<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    'https://wa.me/':'<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M12 3a8.5 8.5 0 0 0-7.4 12.7L3 21l5.5-1.5A8.5 8.5 0 1 0 12 3Z"/><path d="M8.7 8.4c.3-.4.6-.4.9-.1l1 1.2c.2.2.2.5 0 .8l-.5.6a6.7 6.7 0 0 0 3 3l.6-.5c.3-.2.6-.2.8 0l1.2 1c.3.3.3.6-.1.9-.5.5-1.2.7-1.8.5a8.8 8.8 0 0 1-5.6-5.6c-.2-.6 0-1.3.5-1.8Z"/></svg>'
  };
  document.querySelectorAll('.contact-details a').forEach(function(link){
    var href=link.getAttribute('href')||'';
    var iconKey=Object.keys(contactIcons).find(function(key){return href.startsWith(key);});
    if(iconKey&&!link.querySelector('svg')){
      link.classList.add('contact-action');
      link.insertAdjacentHTML('afterbegin',contactIcons[iconKey]);
    }
  });
  var contactDetails=document.querySelector('.contact-details');
  if(contactDetails&&!contactDetails.querySelector('.social-links')){
    var socialLinks=document.createElement('div');
    socialLinks.className='social-links';
    socialLinks.setAttribute('aria-label','Social media links');
    socialLinks.innerHTML='<a class="social-link" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a><a class="social-link" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8.4v3h2.7v8"/></svg></a>';
    contactDetails.appendChild(socialLinks);
  }
  var header=document.querySelector('[data-header]')||document.querySelector('.site-header');
  var toggle=document.querySelector('[data-menu-toggle]');
  var nav=document.querySelector('[data-nav]')||document.querySelector('.site-nav');
  if(header&&nav&&!toggle){
    toggle=document.createElement('button');
    toggle.className='menu-toggle';
    toggle.type='button';
    toggle.setAttribute('aria-label','Toggle navigation');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-controls','site-nav');
    toggle.dataset.menuToggle='';
    toggle.innerHTML='<span></span><span></span>';
    nav.id='site-nav';
    nav.before(toggle);
  }
  if(header){
    window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>24)},{passive:true});
  }
  if(toggle&&nav){toggle.addEventListener('click',function(){var open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);});}
  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear();});
  document.querySelectorAll('[data-nav], .site-nav').forEach(function(nav){
    var hasShopLink=Array.from(nav.querySelectorAll('a')).some(function(link){return link.textContent.trim().startsWith('Shop');});
    if(!hasShopLink&&!nav.querySelector('[data-root-shop-link]')&&!nav.querySelector('.shop-nav-cart')){
      var shopLink=document.createElement('a');
      shopLink.href=window.location.pathname.includes('/shop/')?'index.html':'shop/';
      shopLink.textContent='Shop';
      shopLink.dataset.rootShopLink='';
      var cta=nav.querySelector('.nav-cta');
      nav.insertBefore(shopLink,cta||null);
    }
  });
  var phone=document.getElementById('phone');
  var whatsapp=document.getElementById('whatsapp');
  if(phone&&whatsapp){['input','change'].forEach(function(eventName){phone.addEventListener(eventName,function(){whatsapp.value=formatWhatsApp(phone.value);});});}
  var form=document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit',function(event){
      var valid=true;
      form.querySelectorAll('[required]').forEach(function(field){
        var value=field.value.trim();
        var emailParts=value.split('@');
        var emailValid=emailParts.length===2&&emailParts[0]!==''&&emailParts[1].indexOf('.')>0;
        var fieldValid=value!==''&&(field.type!=='email'||emailValid);
        field.setAttribute('aria-invalid',String(!fieldValid));
        if(!fieldValid){
          valid=false;
        }
      });
      if(!valid){
        event.preventDefault();
        document.getElementById('formNote').textContent='Please check the required fields and try again.';
      }else{
        if(phone&&whatsapp){
          whatsapp.value=formatWhatsApp(phone.value);
        }
        var button=form.querySelector('button[type="submit"]');
        if(button){
          button.disabled=true;
          button.textContent='Sending...';
        }
      }
    });
  }
});
