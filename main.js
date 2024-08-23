async function injectedFunction() {

  const doc = document.getElementsByTagName("BODY")[0];

  const pipWindow = await documentPictureInPicture.requestWindow({
    width: 640,
    height: 360,
  });

  //Copy all style sheets.
  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
      const style = document.createElement('style');

      style.textContent = cssRules;
      pipWindow.document.head.appendChild(style);
    } catch (e) {
      const link = document.createElement('link');

      link.rel = 'stylesheet';
      link.type = styleSheet.type;
      link.media = styleSheet.media;
      link.href = styleSheet.href;
      pipWindow.document.head.appendChild(link);
    }
  });

  pipWindow.document.body.append(doc);

  pipWindow.addEventListener("pagehide", (event) => {
      window.location.reload();
  })

}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target : {tabId : tab.id},
    func : injectedFunction,
  });
});