"use strict";
/////////////////////////////////////////////////////////////////////////////////////
// Global Class having static method show();
//===================================================================================
//
/////////////////////////////////////////////////////////////////////////////////////

class MessageBox {
  static show = function (message, title, buttonAction, defaultButtonIndex) {
    //Set Parameters with passed value or default value
    message = message || ""; //not defined then blank string
    title = title || "MessageBox"; //if title not defined then default title will be "MessageBox"
    defaultButtonIndex = defaultButtonIndex || 0; //if default button not defined then first button is default button
    //When title is not defined and second argument is callback funciton then default title is set as "MessageBox"
    if (typeof title === "function" || title.isArray) {
      if (buttonAction && buttonAction.isNumber) {
        defaultButtonIndex = buttonAction;
      }
      buttonAction = title;
      title = "MessageBox";
    }
    //Set and process Messagebox Buttons list
    let msgBoxButtons = [];
    if (buttonAction) {
      if (typeof buttonAction === "function") {
        msgBoxButtons = [
          {
            btnCaption: "OK",
            btnAction: buttonAction,
            isActive: true,
            cssClass: "MsgBoxButton-OK",
          },
        ];
      } else if (buttonAction.isArray) {
        buttonAction.forEach(function (x, i) {
          let msgBoxButton = {};
          msgBoxButton.btnCaption =
            x.btnCaption ||
            x.btnText ||
            x.caption ||
            x.text ||
            (typeof x === "string"
              ? x
              : buttonAction.length === 1
              ? "OK"
              : "Button-" + (i + 1));
          msgBoxButton.btnAction =
            x.buttonAction || x.btnAction || x.action || x.fn || null;
          msgBoxButton.isActive =
            x.isActive || x.isDefault || x.active || x.default || false;
          msgBoxButton.cssClass =
            x.cssClass ||
            x.class ||
            x.className ||
            "MsgBoxButton-" + msgBoxButton.btnCaption;
          msgBoxButtons.push(msgBoxButton);
        });
      }
    }
    //If Button Action not defined
    if (msgBoxButtons.length === 0) {
      msgBoxButtons = [
        {
          btnCaption: "OK",
          btnAction: null,
          isActive: true,
          cssClass: "MsgBoxButton-OK",
        },
      ];
    }

    let onCloseButtonClicked;
    let msgBoxControls = {};
    msgBoxControls.then = function (fn) {
      //code to button1 onClick
      msgBoxButtons[0].btnAction = fn;
      return this;
    };
    msgBoxControls.onClose = function (fn) {
      onCloseButtonClicked = fn;
      return this;
    };
    msgBoxButtons.forEach(function (btn, i) {
      msgBoxControls["onButton" + (i + 1)] = function (fn) {
        btn.btnAction = fn;
        return this;
      };
    });

    if (message) {
      if (message.isDomElement) {
        message = message.toString();
      }
      message = message.stringify();
      window.setTimeout(function () {
        //Create MessageBox Layout HTML and append in document.body
        let createMessageBox = function (message, title) {
          let html = `
        <div class='MessageBoxBox'>
            <div class='MessageBoxTitle'>
                <div class='MessageBoxTitleLabel'>${title}</div>
                <button class='MessageBoxCloseButton'>✖</button>
            </div>
            <div class='MessageBoxBody'>
                 <div class='MessageBoxIcons'>
                 </div>
                 <div class='MessageBoxMessage'>
                    <div>
                      ${message}
                    </div>
                 </div>
            </div>
            <div class='MessageBoxButtons'>
            </div>
        </div>`;
          let msgBox = document.createElement("div");
          msgBox.className = "MessageBox";
          msgBox.innerHTML = html;
          document.body.appendChild(msgBox);
          return msgBox;
        };

        let msgBox = createMessageBox(message, title);
        msgBox.classList.add("Open");
        msgBox.classList.remove("Close");

        //Move Message Box window on mouse down,move,up
        msgBox
          .querySelector(".MessageBoxTitleLabel")
          .on("mousedown", function (e) {
            e.stopPropagation();
            e.preventDefault();
            let msgBoxBox = msgBox.querySelector(".MessageBoxBox");
            //let pos = { x: msgBoxBox.offsetLeft, y: msgBoxBox.offsetTop };
            let pos = { x: e.pageX, y: e.pageY };
            document.body.on("mousemove.MessageBox", function (e) {
              let left = msgBoxBox.offsetLeft + e.pageX - pos.x;
              let top = msgBoxBox.offsetTop + e.pageY - pos.y;

              msgBoxBox.style.left = left + "px";
              msgBoxBox.style.top = top + "px";
              pos = { x: e.pageX, y: e.pageY };
            });
            document.body.one("mouseup", function (e) {
              document.body.off("mousemove.MessageBox");
            });
          });

        //When Message Box Close Button Clicked
        msgBox.querySelector(".MessageBoxCloseButton").onclick = function () {
          msgBox.classList.remove("Open");
          msgBox.classList.add("Close");
          window.setTimeout(function () {
            msgBox.remove();

            if (typeof onCloseButtonClicked === "function") {
              onCloseButtonClicked();
            }
          }, 100);
        };
        //Create MessageBox Buttons
        let MessageBoxButtons = msgBox.querySelector(".MessageBoxButtons");
        msgBoxButtons.forEach(function (x, i) {
          let btn = document.createElement("input");
          btn.type = "button";
          btn.className = x.cssClass;
          btn.value = x.btnCaption;
          if (x.isActive || i === defaultButtonIndex) {
            btn.setAttribute("IsActive", x.isActive);
          }
          btn.onclick = function () {
            msgBox.classList.remove("Open");
            msgBox.classList.add("Close");
            window.setTimeout(function () {
              msgBox.remove();
              if (typeof x.btnAction === "function") {
                x.btnAction();
              }
            }, 100);
          };
          MessageBoxButtons.appendChild(btn);
        });
        //set focus on default button
        let btnActive = MessageBoxButtons.querySelector("[IsActive]");
        if (btnActive) {
          btnActive.focus();
        } else {
          btnActive = MessageBoxButtons.querySelector(
            "input:nth-child(" + (defaultButtonIndex + 1) + ")"
          );
          if (btnActive) {
            btnActive.focus();
          }
        }

        msgBox
          .on("click.MessageBox", function (e) {
            if (btnActive) {
              btnActive.focus();
            }
          })
          .on("keydown.MessageBox", function (e) {
            if (e.which === 27) {
              e.stopPropagation();
              e.preventDefault();
              msgBox.querySelector(".MessageBoxCloseButton").click();
            }
          });
      });
    }

    return msgBoxControls;
  };
}
