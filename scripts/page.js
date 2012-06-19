function toggleView(stackId, viewId) {
    if (stackId.length > 0 && viewId.length > 0) {
        var stack = document.getElementById(stackId);
        
        if (stack != null) {
            var allViews = stack.childNodes;
    
            for (var i = 0; i < allViews.length; i++) {
                $(allViews[i]).css("position", "absolute");
                $(allViews[i]).css("left", "-10000px");
            }
    
            var visibleView = document.getElementById(viewId);
    
            if (visibleView != null) {
                $(visibleView).css("position", "relative");
                $(visibleView).css("left", "0px");
            }
        }
    }
}

function addBarChart(chartId, data) {
    var datas = data.split(";");
    
    var line = new Array();
    
    for (i = 0; i < datas.length; i++) {
        var subdatas = datas[i].split(",");

        var series = new Array();

        for (j = 0; j < subdatas.length; j++) {
            series[j] = parseFloat(subdatas[j]);
        }

        line[i] = series;
    }
    
    if (line.length < 1 || line[0] == 0) {
        line = [[10,25,15,20,30]];
    }

    $.jqplot(chartId, line, {
        seriesDefaults:{shadow: false, renderer:$.jqplot.BarRenderer, rendererOptions: {padding: 5}}, grid:{shadow: false, background: '#ffffff', borderWidth: 0},
        axes: {xaxis: {renderer:$.jqplot.CategoryAxisRenderer}, yaxis:{min: 0}}
    });
}

function addLineChart(chartId, data) {
    var datas = data.split(";");
    
    var line = new Array();
    
    for (i = 0; i < datas.length; i++) {
        var subdatas = datas[i].split(",");

        var series = new Array();

        for (j = 0; j < subdatas.length; j++) {
            series[j] = parseFloat(subdatas[j]);
        }

        line[i] = series;
    }
    
    if (line.length < 1 || line[0] == 0) {
        line = [[10,25,15,20,30]];
    }
    
    $.jqplot(chartId, line, {
        seriesDefaults:{shadow: false, rendererOptions: {padding: 5}}, grid:{shadow: false, background: '#ffffff', borderWidth: 0}
    });
}

function slideDownLogin() {
    $("#hidden_login").slideToggle("slow");
/*    alert("test");*/

}

function slideDownComments() {
    $("#comments_list").slideToggle("fast");
/*    alert("test");*/
}
function slideDownReply1() {
    $(".comments_text1").slideToggle("fast");
/*    alert("test");*/
}
function slideDownReply2() {
    $(".comments_text2").slideToggle("fast");
/*    alert("test");*/
}

function addPieChart(chartId, data) {
    var datas = data.split(",");
    
    var line = new Array();
    
    for (i = 0; i < datas.length; i++) {
        line[i] = parseFloat(datas[i]);
    }
    
    if (line.length < 1 || line[0] == 0) {
        line = [10,25,15,20,30]
    }
    
    $.jqplot(chartId, [line], {
        seriesDefaults:{shadow: false, renderer:$.jqplot.PieRenderer, rendererOptions: {padding: 2}}, grid:{shadow: false, background: '#ffffff', borderWidth: 1}
    });
}

function switchState(nodeId, stateId) {
    var currentStateId = currentState[nodeId];
    
    if (currentStateId != null && currentStateId != stateId) {
        var currentStateInfo = states[nodeId + "-" + currentStateId];
        var stateInfo = states[nodeId + "-" + stateId];
        
        if (currentStateInfo != null && stateInfo != null) {
            var node = document.getElementById(nodeId);
            
            for (var attr in stateInfo) {            
                var attrVal = stateInfo[attr];
                var currentAttrVal = currentStateInfo[attr];

                if (attrVal != null && attrVal != currentAttrVal) {
                    if (attr == "checked" || attr == "disabled" || attr == "multiple") {
                        node.setAttribute(attr, "true");
                    } else if (attr == "src") {
                        node.setAttribute(attr, attrVal);
                    } else if (attr == "value") {
                        node.value = attrVal;
                    } else if (attr == "content" || attr == "data") {
                        
                        $(node).html(attrVal);
                    } else if (attr == "background-position" || attr == "background-repeat" || attr == "text-align" || attr == "vertical-align" ||
                               attr == "font-family" || attr == "bold" || attr == "italic" || attr == "underline") {
                        if (currentAttrVal != null && currentAttrVal != "") {
                            $(node).removeClass(currentAttrVal);
                        }
                        $(node).addClass(attrVal);
                    } else {
                        $(node).css(attr, attrVal);
                    }
                }
            }
            
            for (var attr in currentStateInfo) {            
                var currentAttrVal = currentStateInfo[attr];

                if (!(attr in stateInfo)) {
                    if (attr == "checked" || attr == "disabled" || attr == "multiple" || attr == "src") {
                        node.removeAttribute(attr);
                    } else if (attr == "value") {
                        node.value = "";
                    } else if (attr == "content" || attr == "data") {
                        node.innerHTML = "";
                    } else if (attr == "background-position" || attr == "background-repeat" || attr == "text-align" || attr == "vertical-align" ||
                               attr == "font-family" || attr == "bold" || attr == "italic" || attr == "underline") {
                        if (currentAttrVal != null && currentAttrVal != "") {
                            $(node).removeClass(currentAttrVal);
                        }
                    } else {
                        $(node).css(attr, "");
                    }
                }
            }
        }
        
        currentState[nodeId] = stateId;
    }
}


function loadVideo(playerUrl, autoplay) {
  swfobject.embedSWF(
      playerUrl + '&rel=1&border=0&fs=1&autoplay=' + 
      (autoplay?1:0), 'player', '490', '250', '9.0.0', false, 
      false, {allowfullscreen: 'true'});
}

function loadSidebar() {
  
}


function showMyVideos(data) {
  var feed = data.feed;
  var entries = feed.entry || [];
  var html = ['<div class="carousel-inner">'];
  for (var i = 0; i < entries.length; i=i+4) {
    if(i == 0) {
      html.push('<div class="item active">');
    }
    else {
      html.push('<div class="item">')
    }
    for (var j = i; j < i+4; j++) {
      var entry = entries[j];
      var title = entry.title.$t.substr(0, 20);
      var thumbnailUrl = entries[j].media$group.media$thumbnail[0].url;
      var playerUrl = entries[j].media$group.media$content[0].url;
      html.push('<span class="item_each" onclick="loadVideo(\'', playerUrl, '\', true)">',
                  '<img src="', thumbnailUrl, '" width="220" height="120"/>',
                  '<br/><span class="titlec">', title, '</span></span>');
                
    }
    html.push("</div>");
  }
  html.push('</div><a class="carousel-control left" href="#videos" data-slide="prev">&lsaquo;</a><a class="carousel-control right" href="#videos" data-slide="next">&rsaquo;</a><br style="clear: left;"/>');
  document.getElementById('videos').innerHTML = html.join('');
  if (entries.length > 0) {
    loadVideo(entries[0].media$group.media$content[0].url, false);
  }
}



$(document).ready(function() {
  $('.accordion-toggle').mouseover(function() {
    $(this).click();
  });
  
  $(document.body).jfontsize({
    btnMinusClasseId: '#minus-button',
    btnPlusClasseId: '#plus-button',
    btnMinusMaxHits: 5,
    btnPlusMaxHits: 5,
    sizeChange: 1
  });
  
  $("#instructions_modal").modal({
    keyboard: true,
    show: false,
    backdrop: true
  })
  $('.carousel').carousel({
    interval: 5000
  }); 
  
  $('#contactable').contactable({
    subject: 'A Feeback Message'
  });
  
  

   
 /* 
  function mailpage()
{
  mail_str = "mailto:?subject=Check out the " + document.title;
  mail_str += "&body=I thought you might be interested in the " + document.title;
  mail_str += ". You can view it at, " + location.href; 
  location.href = mail_str;
}*/

/*  $("#print-botton").click(window.print());*/

/*  $("#mail-button").click(mailpage());*/

$("#collapseTwo").collapse('show')

});

