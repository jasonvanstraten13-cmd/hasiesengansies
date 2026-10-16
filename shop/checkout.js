// Checkout form: shows the order with delivery, then hands payment to Yoco via /api/create-checkout.
// Totals here are for display only; the server recalculates everything from the same data files.
(function(){
  'use strict';
  var form=document.querySelector('[data-checkout-form]');
  if(!form){return;}
  var summary=document.querySelector('[data-checkout-summary]');
  var alertBox=document.querySelector('[data-checkout-alert]');
  var payButton=document.querySelector('[data-pay-button]');
  var products=[];
  var delivery={options:[]};

  function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function showAlert(message){alertBox.textContent=message;alertBox.hidden=!message;if(message){alertBox.scrollIntoView({behavior:'smooth',block:'center'});}}
  function cartLines(){return window.HGShop.getCart().map(function(item){var product=products.find(function(p){return p.id===item.id;});return product?{product:product,quantity:item.quantity}:null;}).filter(Boolean);}
  function selectedOption(){var checked=form.querySelector('input[name="deliveryMethod"]:checked');return checked?delivery.options.find(function(o){return o.id===checked.value;}):null;}
  function feeFor(option,subtotal){if(!option){return 0;}if(option.freeOverThreshold&&delivery.freeDeliveryThreshold&&subtotal>=delivery.freeDeliveryThreshold){return 0;}return option.price;}

  function renderDeliveryOptions(){
    var target=document.querySelector('[data-delivery-options]');
    target.innerHTML=delivery.options.map(function(option,index){
      return '<label class="delivery-option"><input type="radio" name="deliveryMethod" value="'+escapeHtml(option.id)+'"'+(index===0?' checked':'')+'><span><strong>'+escapeHtml(option.name)+'</strong><small>'+escapeHtml(option.description)+'</small></span><span class="delivery-price" data-fee-for="'+escapeHtml(option.id)+'"></span></label>';
    }).join('')+(delivery.freeDeliveryThreshold?'<p class="cart-note">Free PUDO and courier delivery on orders over '+window.HGShop.price(delivery.freeDeliveryThreshold)+'.</p>':'');
  }

  function render(){
    var lines=cartLines();
    if(!lines.length){
      form.hidden=true;
      summary.innerHTML='<div class="cart-empty"><h2>Your cart is empty.</h2><p>Add something lovely before checking out.</p><a class="button button-dark" href="index.html">Browse the shop <span aria-hidden="true">↗</span></a></div>';
      return;
    }
    var subtotal=lines.reduce(function(total,line){return total+line.product.price*line.quantity;},0);
    var option=selectedOption();
    var fee=feeFor(option,subtotal);
    delivery.options.forEach(function(o){var node=form.querySelector('[data-fee-for="'+o.id+'"]');if(node){var f=feeFor(o,subtotal);node.textContent=f?window.HGShop.price(f):'Free';}});
    form.querySelector('[data-address-fields]').hidden=!(option&&option.needsAddress);
    form.querySelector('[data-locker-fields]').hidden=!(option&&option.needsLocker);
    form.querySelector('[data-personalisation-fields]').hidden=!lines.some(function(line){return line.product.customisable;});
    summary.innerHTML='<h2>Order summary</h2>'+lines.map(function(line){return '<div class="summary-row"><span>'+escapeHtml(line.product.name)+' &times; '+line.quantity+'</span><span>'+window.HGShop.price(line.product.price*line.quantity)+'</span></div>';}).join('')+
      '<div class="summary-row"><span>Subtotal</span><strong>'+window.HGShop.price(subtotal)+'</strong></div>'+
      '<div class="summary-row"><span>'+(option?escapeHtml(option.name):'Delivery')+'</span><strong>'+(fee?window.HGShop.price(fee):'Free')+'</strong></div>'+
      '<div class="summary-row summary-total"><span>Total</span><strong>'+window.HGShop.price(subtotal+fee)+'</strong></div>'+
      '<a class="text-link" href="cart.html">Edit cart <span aria-hidden="true">→</span></a>';
    payButton.disabled=false;
  }

  function validate(option,needsPersonalisation){
    var required=['name','email','phone'];
    if(option&&option.needsAddress){required=required.concat(['street','city','province','postalCode']);}
    if(option&&option.needsLocker){required.push('locker');}
    if(needsPersonalisation){required.push('personalisation');}
    var firstInvalid=null;
    form.querySelectorAll('[aria-invalid]').forEach(function(field){field.removeAttribute('aria-invalid');});
    required.forEach(function(name){var field=form.elements[name];var value=field.value.trim();var ok=value!==''&&(name!=='email'||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));if(!ok){field.setAttribute('aria-invalid','true');firstInvalid=firstInvalid||field;}});
    if(firstInvalid){firstInvalid.focus();return 'Please check the highlighted fields.';}
    if(!option){return 'Please choose a delivery option.';}
    if(!form.elements.acceptTerms.checked){return 'Please accept the terms to continue.';}
    return '';
  }

  form.addEventListener('change',function(event){if(event.target.name==='deliveryMethod'){render();}});
  form.addEventListener('submit',function(event){
    event.preventDefault();
    var lines=cartLines();
    var option=selectedOption();
    var problem=validate(option,lines.some(function(line){return line.product.customisable;}));
    if(problem){showAlert(problem);return;}
    showAlert('');
    var data=form.elements;
    var payload={
      items:lines.map(function(line){return {id:line.product.id,quantity:line.quantity};}),
      customer:{name:data.name.value,email:data.email.value,phone:data.phone.value},
      delivery:{method:option.id,street:data.street.value,suburb:data.suburb.value,city:data.city.value,province:data.province.value,postalCode:data.postalCode.value,locker:data.locker.value},
      personalisation:data.personalisation.value,
      notes:data.notes.value,
      acceptTerms:data.acceptTerms.checked
    };
    payButton.disabled=true;
    payButton.textContent='Taking you to payment...';
    fetch('/api/create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(function(response){return response.json().catch(function(){return {};}).then(function(body){if(!response.ok||!body.redirectUrl){throw new Error(body.error||'We could not start the payment. Please try again.');}return body;});})
      .then(function(body){window.location.href=body.redirectUrl;})
      .catch(function(error){showAlert(error.message);payButton.disabled=false;payButton.innerHTML='Pay securely <span aria-hidden="true">↗</span>';});
  });

  var status=new URLSearchParams(window.location.search).get('status');
  if(status==='cancelled'){showAlert('Payment was cancelled. Your cart is still saved - you can try again whenever you are ready.');}
  if(status==='failed'){showAlert('Your payment did not go through. No money was taken. Please try again or use a different card.');}

  Promise.all([fetch('data/products.json').then(function(r){return r.json();}),fetch('data/delivery.json').then(function(r){return r.json();})])
    .then(function(results){products=results[0];delivery=results[1];renderDeliveryOptions();render();})
    .catch(function(){summary.innerHTML='<p class="loading-state">Checkout could not load. Please refresh and try again.</p>';});
})();
