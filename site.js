// Shared page behavior. The interest form opens the visitor's own email app.
(function () {
  var CONTACT = "hello@waltonpowerlines.com";

  var form = document.querySelector("[data-interest-form]");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var email = String(data.get("email") || "").trim();
    var place = String(data.get("place") || "").trim();
    var message = String(data.get("message") || "").trim();
    var study = data.get("study") ? "Yes" : "No";

    var lines = [
      "Walton Power Lines — interest note",
      "",
      "Name: " + (name || "(not given)"),
      "Email: " + (email || "(not given)"),
      "Place in Walton County: " + (place || "(not given)"),
      "Supports a feasibility study: " + study,
      "",
      message || "(no comment)"
    ];

    var href = "mailto:" + CONTACT
      + "?subject=" + encodeURIComponent("Walton Power Lines interest")
      + "&body=" + encodeURIComponent(lines.join("\n"));

    var status = form.querySelector("[data-form-status]");
    if (status) {
      status.hidden = false;
      status.textContent = "Your email app should open with this note. Nothing is stored on this website. If no app opens, write to " + CONTACT + ".";
    }
    window.location.href = href;
  });
})();
