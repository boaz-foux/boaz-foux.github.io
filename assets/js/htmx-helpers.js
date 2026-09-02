/* htmx-helpers.js — tiny configuration and UX helpers */
(function(){
  if(typeof htmx === 'undefined') return;

  // sensible defaults
  try{
    htmx.config.defaultSwapStyle = 'innerHTML';
  }catch(e){console.warn('htmx config fail', e)}

  // show a subtle UI state while requests are happening
  document.body.addEventListener('htmx:beforeRequest', function(){
    document.body.classList.add('htmx-requesting');
  });
  document.body.addEventListener('htmx:afterRequest', function(){
    // keep visible for a tick so users notice change
    setTimeout(function(){ document.body.classList.remove('htmx-requesting'); }, 80);
  });

  // globally handle errors
  document.body.addEventListener('htmx:error', function(evt){
    console.error('HTMX error', evt.detail);
  });

  // helper to lazily load fragments: elements with data-hx-fragment
  document.addEventListener('DOMContentLoaded', function(){
    var lazy = document.querySelectorAll('[data-hx-fragment]');
    lazy.forEach(function(el){
      var src = el.getAttribute('data-hx-fragment');
      if(!src) return;
      // small timeout to let the page settle
      setTimeout(function(){ htmx.ajax('GET', src, {target:el, swap:'innerHTML'}); }, 50);
    });
  });
})();
