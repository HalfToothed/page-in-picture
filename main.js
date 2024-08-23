async function injectedFunction(tabUrl) {

  const pipWindow = await documentPictureInPicture.requestWindow({
    width: 640,
    height: 360,
  });

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.src = tabUrl;

  
  // Disable scrolling in the iframe
  iframe.style.overflow = 'hidden';
  
  // Set margin, padding, and overflow to 0 for the pipWindow document body
  pipWindow.document.body.style.margin = '0';
  pipWindow.document.body.style.padding = '0';

  pipWindow.document.body.appendChild(iframe);

  pipWindow.addEventListener("pagehide", (event) => {
      window.location.reload();
  })
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target : {tabId : tab.id},
    func : injectedFunction,
    args: [tab.url]
  });
});