(function () {
    //当浏览器窗口被调整大小时触发
    window.onresize = function () {
        ShowHideElement("i-link-box", "linkList-item", 845);
    }
    window.onload = function () {
        ShowHideElement("i-link-box", "linkList-item", 845);
    }

    function ShowHideElement(Element1, Element2, Vaule) {
        var Person = document.getElementsByClassName(Element1);
        var BoxHeight = document.getElementsByClassName(Element2);
        var WindowHeight = window.innerHeight || document.body.clientHeight;
        //遍历获取到的元素
        for (var i = 6; i < Person.length; i++) {
            if (WindowHeight <= Vaule && deviceVal === "pc") {
                Person[i].style.display = "none";
                BoxHeight[0].style.marginTop = "5px";
            } else {
                Person[i].style.display = "block";
                BoxHeight[0].style.marginTop = "0px";
            }
        }
    }

    window.ShowHideElement = ShowHideElement;
}());

var now = -1;
var resLength = 0;
var listIndex = -1;
var hotList = 0;
//可在此修改默认搜索引擎
var thisSearch = 'https://www.baidu.com/s?wd=';
var thisSearchIcon = './logo.jpg';
var storage = window.localStorage;
if (!storage.stopHot) {
    storage.stopHot = true
}
storage.stopHot == 'false' ? $('#hot-btn').prop('checked', false) : $('#hot-btn').prop('checked', true);
var ssData = storage.searchEngine;
if (storage.searchEngine != undefined) {
    ssData = ssData.split(',');
    thisSearch = ssData[0];
    $('#search-icon').children().attr('xlink:href', ssData[1])
    $('#txt').attr('placeholder', ssData[2])
}

function getHotkeyword(value) {
    $.ajax({
        type: "GET",
        url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
        async: true,
        data: {
            wd: value
        },
        dataType: "jsonp",
        jsonp: "cb",
        success: function (res) {
            $("#box ul").text("");
            hotList = res.s.length;
            if (hotList) {
                $("#box").css("display", "block");
                for (var i = 0; i < hotList; i++) {
                    if (i === hotList - 1) {
                        $("#box ul").append('<li id="lastHot"><span>' + (i + 1) + "</span>" + res.s[i] + "</li>");
                    } else {
                        $("#box ul").append("<li><span>" + (i + 1) + "</span>" + res.s[i] + "</li>");
                    }
                    $("#box ul li").eq(i).click(function () {
                        $('#txt').val(this.childNodes[1].nodeValue);
                        window.open(thisSearch + this.childNodes[1].nodeValue);
                        $('#box').css('display', 'none')
                    });
                    if (i === 0) {
                        $("#box ul li").eq(i).css({
                            "border-top": "none"
                        });
                        $("#box ul span").eq(i).css({
                            "color": "#fff",
                            "background": "#f54545"
                        })
                    } else if (i === 1) {
                        $("#box ul span").eq(i).css({
                            "color": "#fff",
                            "background": "#ff8547"
                        })
                    } else if (i === 2) {
                        $("#box ul span").eq(i).css({
                            "color": "#fff",
                            "background": "#ffac38"
                        })
                    }
                }
            } else {
                $("#box").css("display", "none")
            }
        },
        error: function (res) {
            console.log(res)
        }
    })
}

// 按键松开时执行
$("#txt").keyup(function (e) {
    if ($(this).val()) {
        if (e.keyCode == 38 || e.keyCode == 40 || storage.stopHot != 'true') {
            return
        }
        $("#search-clear").css("display", "block");
        getHotkeyword($(this).val())
    } else {
        $("#search-clear").css("display", "none");
        $("#box").css("display", "none")
    }
});

$("#txt").keydown(function (e) {
    if (e.keyCode === 40) {
        listIndex === (hotList - 1) ? listIndex = 0 : listIndex++;
        $("#box ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
        var hotValue = $("#box ul li").eq(listIndex)[0].childNodes[1].nodeValue;
        $("#txt").val(hotValue)
    }
    if (e.keyCode === 38) {
        if (e.preventDefault) {
            e.preventDefault()
        }
        if (e.returnValue) {
            e.returnValue = false
        }
        listIndex === 0 || listIndex === -1 ? listIndex = (hotList - 1) : listIndex--;
        $("#box ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
        var hotValue = $("#box ul li").eq(listIndex)[0].childNodes[1].nodeValue;
        $("#txt").val(hotValue)
    }
    if (e.keyCode === 13) {
        window.open(thisSearch + $("#txt").val());
        $("#box").css("display", "none");
        $("#txt").blur();
        $("#box ul li").removeClass("current");
        listIndex = -1
    }
});
$("#search-clear").click(function () {
    $('#txt').val("");
    $('#search-clear').css('display', 'none');
    $("#box").css("display", "none");
    console.log("清除输入框");
});
$("#search-enter").click(function () {
    window.open(thisSearch + $('#txt').val());
});
$("#txt").focus(function () {
    if ($(this).val() && storage.stopHot == 'true') {
        getHotkeyword($(this).val())
    }
});
$("#txt").blur(function () {
    setTimeout(function () {
        $("#box").css("display", "none")
    }, 100)
});
$(function () {
    $.ajax({
        type: "GET",
        url: "/api/engine/enable",
        async: true,
        success: function (res) {
            storage.engineList = JSON.stringify(res.data);
        }
    })
    let engineList = JSON.parse(storage.engineList);
    for (var i = 0; i < engineList.length; i++) {
        var addList = '<li><svg class="icon" aria-hidden = "true" ><use xlink:href="#' + engineList[i].icon +
            '"></use></svg>' + engineList[i].name + '</li > '
        $('.search-engine-list').append(addList);
    }
    $('#search-icon, .search-engine').hover(function () {
        $('.search-engine').css('display', 'block')
    }, function () {
        $('.search-engine').css('display', 'none')
    });

    $('#hot-btn').on('click', function () {
        if (storage.stopHot == 'true') {
            $(this).prop('checked', false)
            storage.stopHot = false
        } else {
            storage.stopHot = true
            $(this).prop('checked', true)
        }
        // console.log(storage.stopHot)
    });
    $('.search-engine-list li').click(function () {
        // console.log($(this));
        var _index = $(this).index();
        var thisIcon = $(this).children().children().attr('xlink:href');
        var thisText = $(this).text() + '搜索';
        // console.log(thisText);
        $('#txt').attr('placeholder', thisText)
        $('#search-icon use').attr('xlink:href', thisIcon)
        // console.log("_index", _index)
        thisSearch = engineList[_index].url;
        $('.search-engine').css('display', 'none')
        storage.searchEngine = [thisSearch, thisIcon, thisText]
    });
})
