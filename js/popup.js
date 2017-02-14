"use strict";

function Popup(oEl, config) {
	this.oPopup = document.getElementById(oEl);
	this.oHead = document.querySelector("head");
	this.zIndex = 3000;

	for (var i in config) {
		if (config.hasOwnProperty(i)) {
			this.config[i] = config[i];
		};
	};

	this.init();
};

//默认参数配置
Popup.prototype.config = {
	width: 230, //弹窗宽度
	//height: 110,//弹窗高度，不设置（自适应）
	opacity: 0.3, //遮罩透明度
	promptText: "弹窗内容", //弹窗的内容
	promptState: "success", //弹窗状态，分四种，详细查看css文件
	closePopupTime: false, //500毫秒后自动关闭弹窗
	btns: [{ //按钮集合，每个按钮以对象形式设置属性
		value: "取消", //按钮value值
		bgColor: "", //背景颜色
		valueColor: "#fff", //字体颜色
		hoverColor: "rgba(0,0,0,.5)", //鼠标滑过颜色
		btnType: "cancel", //按钮的默认样式，详细查看css文件
		width: 70, //按钮的宽度
		height: 30, //按钮的高度
		closePopup: 300, //多弹窗，自动关闭弹窗
		callback: function() { //按钮回调函数
			new Popup("popup", {
				width: 230,
				opacity: 0.3,
				promptText: "正在取消",
				promptState: "warning",
				closePopupTime: 30,
				btns: false
			});
		}
	}]
};

//初始化
Popup.prototype.init = function() {
	//添加样式
	this.addStyle();

	//添加遮罩层
	this.addMask();
	//添加弹窗内容
	this.addContent();

	this.popupContainer = document.querySelector(".popup-container");

	if (this.config.closePopupTime) {
		setTimeout(this.closePopup, this.config.closePopupTime);
	};
};

//添加样式
Popup.prototype.addStyle = function() {
	var oLink = document.createElement("link");
	oLink.href = "css/popup.css";
	oLink.type = "text/css";
	oLink.rel = "stylesheet";
	this.oHead.appendChild(oLink);
};

//添加遮罩
Popup.prototype.addMask = function() {
	this.zIndex++;
	var oDiv = document.createElement("div");
	oDiv.setAttribute("class", "popup-mask");
	oDiv.style.cssText = "opacity:" + this.config.opacity + ";filter:alpha(opacity=" + this.config.opacity * 100 + ");z-index:" + this.zIndex + ";";
	this.oPopup.appendChild(oDiv);
};

//添加弹窗内容
Popup.prototype.addContent = function() {
	var oContainer = document.createElement("div");
	var oContainerL = (-this.config.width - 60) / 2;
	var oContainerT = 0;

	this.zIndex++;
	oContainer.setAttribute("class", "popup-container");

	oContainer.appendChild(this.addPopupText());
	oContainer.appendChild(this.addBtns());
	this.oPopup.appendChild(oContainer);

	if (this.config.height) {
		oContainerT = -this.config.height / 2;
	} else {
		oContainerT = -oContainer.offsetHeight;
	};
	//盒子上下居中有问题 ，待解决...
	//console.log(oContainerT)
	oContainer.style.cssText = "width:" + this.config.width + "px;height:" + this.config.height + "px;margin-left:" + oContainerL + "px;margin-top:" + oContainerT + "px;z-index:" + this.zIndex + ";";

};

//弹窗状态及内容
Popup.prototype.addPopupText = function() {
	var oContent = document.createElement("div");
	oContent.setAttribute("class", "popup-container-content");

	oContent.appendChild(this.addPopupState());
	oContent.appendChild(this.addText());
	return oContent;
};

//弹窗的状态图标
Popup.prototype.addPopupState = function() {
	var oSpan = document.createElement("span");
	oSpan.setAttribute("class", "popup-container-content-icon " + this.config.promptState);
	return oSpan;
};

//弹窗的文本内容
Popup.prototype.addText = function() {
	var oP = document.createElement("p");
	var nW = this.config.width - 46;

	oP.setAttribute("class", "popup-container-content-text");
	oP.style.cssText = "width:" + nW + "px";
	oP.innerHTML = this.config.promptText;
	return oP;
};

//添加按钮盒子
Popup.prototype.addBtns = function() {
	var oBtns = document.createElement("div");
	oBtns.setAttribute("class", "popup-container-btns");
	var _this = this;
	var length = this.config.btns.length;

	for (var i = 0; i < length; i++) {
		var oBtn = document.createElement("input");
		var sColor = '';
		oBtn.type = "button";

		if (typeof this.config.btns[i] == 'object') {
			//判断有没有value参数
			if (this.config.btns[i].value && typeof this.config.btns[i].value == "string") {
				oBtn.value = this.config.btns[i].value;
			};
			//判断有没有class参数
			if (this.config.btns[i].btnType && typeof this.config.btns[i].btnType == "string") {
				oBtn.setAttribute("class", this.config.btns[i].btnType);
			};
			//判断有没有width参数
			if (typeof this.config.btns[i].width == "number") {
				oBtn.style.width = this.config.btns[i].width + "px";
			} else if (typeof this.config.btns[i].width == "string") {
				oBtn.style.width = this.config.btns[i].width;
			};
			//判断有没有height参数
			if (typeof this.config.btns[i].height == "number") {
				oBtn.style.height = this.config.btns[i].height + "px";
			} else if (typeof this.config.btns[i].height == "string") {
				oBtn.style.height = this.config.btns[i].height;
			};
			//判断有没有bgColor参数
			if (typeof this.config.btns[i].bgColor == "string" && !this.config.btns[i].bgColor == '') {
				oBtn.style.background = this.config.btns[i].bgColor;
			};
			//判断有没有valueColor参数
			if (typeof this.config.btns[i].valueColor == "string" && !this.config.btns[i].valueColor == '') {
				oBtn.style.color = this.config.btns[i].valueColor;
			};
		};

		(function(i) {
			oBtn.onclick = function() {
				if (typeof _this.config.btns[i] == 'object' && _this.config.btns[i].closePopup) {
					setTimeout(_this.closePopup, _this.config.btns[i].closePopup);
				};
				if (typeof _this.config.btns[i] == 'object') {
					_this.config.btns[i].callback && _this.config.btns[i].callback();
				};
			};
			oBtn.onmouseover = function() {
				sColor = _this.getStyle(this, "backgroundColor");

				if (typeof _this.config.btns[i] == 'object' && typeof _this.config.btns[i].hoverColor == "string" && !_this.config.btns[i].hoverColor == "") {
					this.style.background = _this.config.btns[i].hoverColor;
				};
			};
			oBtn.onmouseout = function() {
				if (typeof _this.config.btns[i] == 'object' && typeof _this.config.btns[i].bgColor == "string" && !_this.config.btns[i].bgColor == "") {
					this.style.background = _this.config.btns[i].bgColor;
				} else if (sColor) {
					this.style.background = sColor;
				};
			};
		})(i);

		oBtns.appendChild(oBtn);
	};

	return oBtns;
};

//关闭弹窗的方法
Popup.prototype.closePopup = function() {
	var oPopupMask = document.querySelector(".popup-mask");
	var oContainer = document.querySelector(".popup-container");

	oPopupMask.parentNode.removeChild(oPopupMask);
	oContainer.parentNode.removeChild(oContainer);
};

//获取样式方法
Popup.prototype.getStyle = function(oEl, attr) {
	return oEl.currentStyle ? oEl.currentStyle[attr] : getComputedStyle(oEl, false)[attr];
};