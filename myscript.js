var changing=false;

function totalSpentFunction(elm) {
  console.log($(elm).find("tbody tr td.hide-for-print").length);
  if ($(elm).find("tbody tr td.hide-for-print").length != 0)
    return -1;

  var sum = 0;
  $(elm).find(".negative-value").each(function() {
    sum = sum + parseFloat($.trim($(this).html()).substring(2));
  });
  return sum.toFixed(2);
}

function displayTotalSpent(totalSpent, elm) {
  if (totalSpent == -1) {
    var html = "<p class='totalSpent'>Click For Full Details</p>";
    $(elm).find("tr.transaction-collapsible-header th:eq(0)").append(html);
    $(elm).addClass(className);
    return;
  }

  var html = "<p class='totalSpent'>Total Spent: $"+ totalSpent+"</p>";
  $(elm).find("tr.transaction-collapsible-header th:eq(0)").append(html);
  $(elm).addClass(className);
}

var about = false;
var numChanged = 0;
var className = "hey";

function injectHtml() {
  //if (numChanged > 20) return;
  /*console.log(numChanged+"   "+$("table.blank").length);
  if (numChanged == $("table.blank").length) return;
  numChanged = 0;*/

  if (numChanged == $("table.blank").length) return;

  if ($("tr.transaction-collapsible-header").length == 0) {
    setTimeout(function() { injectHtml(); }, 2000);
    return;
  }

  if (changing) return;
  changing = true;

  $("table.blank.transactions-history-table").not("."+className).each(function() {
    numChanged = numChanged + 1;
    var totalSpent = totalSpentFunction($(this));
    displayTotalSpent(totalSpent, $(this));
  });
  changing = false;
}

var bodyObserver = null;

function analyzeDetailsPage() {
  if (bodyObserver) bodyObserver.disconnect();
  var target = document.querySelector('body');
   
  bodyObserver  = new MutationObserver(function(mutations) {
    injectHtml();
  });
    
  var config = { attributes: true, childList: true, characterData: true, subtree:true };
  bodyObserver.observe(target, config);
}


$(document).ready(function() { 
  $(window).on('hashchange', function(e){
    if (document.URL.indexOf("details") > -1) {
      analyzeDetailsPage(); 
    }
  });
});


