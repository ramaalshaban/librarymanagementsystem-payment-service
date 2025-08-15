const toastifyOpts = {
  duration: 3000,
  close: true,
  gravity: "bottom",
  position: "right",
  style: {
    background: "white",
    color: "#545454",
    fontSize: "14px",
    borderRadius: "8px",
  },
};

const showToast = (msg, iconClass) => {
  const content = document.createElement("div");
  content.className = "toastify-content";

  const icon = document.createElement("i");
  icon.className = `fa-solid ${iconClass} text-2xl`;

  const text = document.createElement("span");
  text.textContent = msg;

  content.appendChild(icon);
  content.appendChild(text);

  Toastify({ ...toastifyOpts, node: content }).showToast();
};
