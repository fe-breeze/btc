function NavToggle(){$(".navbar-minimalize").trigger("click")}function SmoothlyMenu(){$(this).width()<769&&$(".map-content").hide(),$("body").hasClass("mini-navbar")?$("body").hasClass("fixed-sidebar")?($("#side-menu").hide(),$(".map-content").hide(),setTimeout(function(){$("#side-menu").fadeIn(500)},300)):$("#side-menu").removeAttr("style"):($("#side-menu").hide(),$(".map-content").hide(),setTimeout(function(){$("#side-menu").fadeIn(500),$(this).width()>=769&&$(".map-content").fadeIn(500)},100))}$(document).ready(function(){function i(){var i=$("body > #wrapper").height()-61;$(".sidebard-panel").css("min-height",i+"px")}$(".nav-second-level").prev().click(function(){void 0!==$(".nav-second-level").attr("style")&&$(".nav-second-level").removeAttr("style")}),$("#side-menu").metisMenu(),$(".right-sidebar-toggle").click(function(){$("#right-sidebar").toggleClass("sidebar-open")}),$(function(){$(".sidebar-collapse").slimScroll({height:"100%",railOpacity:.9,alwaysVisible:!1})}),$(".navbar-minimalize").click(function(){$("body").toggleClass("mini-navbar"),SmoothlyMenu()}),i(),$(window).bind("load resize click scroll",function(){$("body").hasClass("body-small")||i()}),$(window).scroll(function(){$(window).scrollTop()>0&&!$("body").hasClass("fixed-nav")?$("#right-sidebar").addClass("sidebar-top"):$("#right-sidebar").removeClass("sidebar-top")}),$(".full-height-scroll").slimScroll({height:"100%"}),$("#side-menu>li").click(function(){$("body").hasClass("mini-navbar")&&NavToggle()}),$("#side-menu>li li a").click(function(){$(window).width()<769&&NavToggle()}),$(".nav-close").click(NavToggle),/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)&&$("#content-main").css("overflow-y","auto")}),$(window).bind("load resize",function(){$(this).width()<769&&($("body").addClass("mini-navbar"),$(".map-content").hide(),$(".navbar-static-side").fadeIn())});