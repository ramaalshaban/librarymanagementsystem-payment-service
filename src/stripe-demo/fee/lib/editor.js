document.addEventListener("DOMContentLoaded", () => {
    window.editor = null;
  
    window.editorReady = new Promise((resolve) => {
      const loadAceTheme = async () => {
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/ajaxorg/ace/refs/heads/master/src/theme/github_light_default-css.js"
          );
          const text = await response.text();
          const module = {};
          eval(text);
          const styleElement = document.createElement("style");
          styleElement.innerHTML = module.exports;
          document.head.appendChild(styleElement);
        } catch (error) {
          console.error("Error loading Ace theme:", error);
        }
      };
  
      const initializeAce = () => {
        window.editor = ace.edit("editor");
        editor.session.setMode("ace/mode/json");
        editor.setValue("", -1);
        resolve(); // Editör yüklendi, Promise çözüldü!
      };
  
      loadAceTheme().then(initializeAce);
    });
  });