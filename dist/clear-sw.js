// Script para limpiar Service Workers y caché
// Ejecutar en la consola del navegador o incluir en index.html temporalmente

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service Worker desregistrado:', registration.scope);
    }
  });
  
  // Limpiar caché
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
        console.log('Caché eliminada:', name);
      }
    });
  }
  
  console.log('Service Workers y caché limpiados. Recarga la página.');
}

