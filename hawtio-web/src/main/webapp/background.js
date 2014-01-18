chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html#/jvm/connect', {
    'bounds': {
      'width': 1200,
      'height': 700
    }
  });
});
