chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html#/jvm/connect', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
});
