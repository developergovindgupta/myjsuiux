document.ready(function () {
  let Theme = parseInt(Math.random() * 7);
  document.body.className = "Theme-" + Theme;
  document.querySelectorAll("nav .nav_Menu li").forEach((x) => {
    x.addEventListener("click", function (e) {
      document.querySelectorAll(".Selected").forEach((x) => {
        x.classList.remove("Selected");
      });

      this.classList.add("Selected");
      history.pushState("", "", this.getAttribute("target"));
      window.document.title = "MYJS-Tutorial-" + this.getAttribute("pageTitle");
      document
        .querySelector("container")
        .load(this.getAttribute("target"))
        .then(function (obj) {
          obj.scrollTop = 0;
          document.querySelectorAll("link[group='container']").remove();
          let links = obj.querySelectorAll("link").each(function () {
            let link = document.createElement("link");

            link.attr("type", "text/css");
            link.attr("rel", "stylesheet");
            link.attr("group", "container");
            link.attr("href", this.getAttribute("href"));
            document.head.appendChild(link);
            this.remove();
          });

          document.querySelectorAll("script[group='container']").remove();
          let scripts = obj.querySelectorAll("script").each(function () {
            let src = this.getAttribute("src");
            if (src) {
              let script = document.createElement("script");
              script.src = src;
              script.attr("type", "text/javascript");
              script.attr("group", "container");
              document.head.appendChild(script);
              this.remove();
            } else if (!this.hasAttribute("exclude")) {
              let script = document.createElement("script");
              script.innerHTML = this.innerHTML;
              script.attr("type", "text/javascript");
              script.attr("group", "container");
              document.head.appendChild(script);
              this.remove();
            } else {
              document.head.appendChild(this);
            }
          });

          if (typeof pageLoad == "function") {
            pageLoad();
          }
        })
        .catch(function (ex) {
          console.log(ex);
        });
    });
  });

  let pageName = QSget("page");
  if (pageName) {
    let li = document.querySelector('nav li[target="' + pageName + '"]');

    li.click();
  } else {
    document.querySelector("container").load("Home.html");
  }
});

function QSget(n) {
  var half = location.search.split("&" + n + "=")[1];
  if (!half) half = location.search.split("?" + n + "=")[1];
  return half !== undefined ? decodeURIComponent(half.split("&")[0]) : null;
}

function changeThemeTo(obj) {
  document.body.className = obj.className;
}
