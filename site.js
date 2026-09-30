// Shared page behavior. The interest form posts to the Worker contact route.
(function () {
  var form = document.querySelector("[data-interest-form]");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var status = form.querySelector("[data-form-status]");
    var button = form.querySelector("button[type=submit]");
    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = value;
    });
    if (button) button.disabled = true;
    if (status) {
      status.hidden = false;
      status.classList.remove("is-error");
      status.textContent = "Sending…";
    }
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json().then(function (body) {
        return { ok: response.ok, body: body };
      }).catch(function () {
        return { ok: response.ok, body: {} };
      });
    }).then(function (result) {
      if (result.ok) {
        form.reset();
        if (status) status.textContent = "Thank you. Your note is on its way.";
      } else if (status) {
        status.classList.add("is-error");
        status.textContent = (result.body && result.body.error) || "Could not send that note. Please try again.";
      }
    }).catch(function () {
      if (status) {
        status.classList.add("is-error");
        status.textContent = "Could not send that note. Please try again.";
      }
    }).finally(function () {
      if (button) button.disabled = false;
    });
  });
})();
