async function injectedFunction(tabUrl) {

  let href;
  let useBody = false;

  const pipWindow = await documentPictureInPicture.requestWindow({
    width: 640,
    height: 360,
  });

  // Set margin, padding, and overflow to 0 for the pipWindow document body
  pipWindow.document.body.style.margin = "0";
  pipWindow.document.body.style.padding = "0";

  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.src = tabUrl;
  iframe.style.overflow = "hidden";
  pipWindow.document.body.appendChild(iframe);

  iframe.onload = () => {
    try {
      href = iframe.contentWindow.location.href;
    } catch {
      useBody = true;

      pipWindow.document.body.innerHTML = "";

      const doc = document.getElementsByTagName("BODY")[0];

      //Copy all style sheets.
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("");
          const style = document.createElement("style");

          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement("link");

          link.rel = "stylesheet";
          link.type = styleSheet.type;
          link.media = styleSheet.media;
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      });

      pipWindow.document.body.append(doc);

      const body = document.createElement("body");
      const heading = document.createElement("h1");
      heading.textContent = "You're viewing this Page In-Picture mode.";
      const subheading = document.createElement("h5");
      subheading.textContent = "We apologize, but this feature may not function correctly for this page.";

      body.appendChild(heading);
      body.appendChild(subheading);

      document.documentElement.appendChild(body);
    }
  };

  pipWindow.addEventListener("pagehide", (event) => {
    if (useBody) {
      window.location.reload();
    }
  });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectedFunction,
    args: [tab.url],
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pip",
    title: "Page-In-Picture",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "pip") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectedFunction,
      args: [tab.url],
    });
  }
});
