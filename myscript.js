var changing=false;
var calculatedClass = "hey";
var pendingClass = "hey2";

function totalSpentFunction(elm) {
  if ($(elm).find("tbody tr td.hide-for-print").length != 0)
    return -1;

  var sum = 0;
  $(elm).find(".negative-value").each(function() {
    sum = sum + parseFloat($.trim($(this).html()).substring(2));
  });
  return sum.toFixed(2);
}

function wrap(elm) {
  if ($(elm).find(".extensionDate").length != 0) return;
  $(elm).wrapInner("<p class='extensionDate'></p>");
}

function displayTotalSpent(totalSpent, elm) {
  if (totalSpent == -1 && !$(elm).hasClass(pendingClass)) {
    wrap($(elm).find("tr.transaction-collapsible-header th:eq(0)"));
    var html = "<p class='clickForDetails'>Click For Full Details</p>";
    $(elm).find("tr.transaction-collapsible-header th:eq(0)").append(html);
    $(elm).addClass(pendingClass);
    return false;
  }
  else if (totalSpent != -1) {
    wrap($(elm).find("tr.transaction-collapsible-header th:eq(0)"));
    $(elm).find(".clickForDetails").remove();
    var html = "<p class='totalSpent'>Total Spent: $"+ totalSpent+"</p>";
    $(elm).find("tr.transaction-collapsible-header th:eq(0)").append(html);
    $(elm).addClass(calculatedClass);
    $(elm).removeClass(pendingClass);
  }
}


function injectHtml() {
  if ($("tr.transaction-collapsible-header").length == 0) {
    setTimeout(function() { injectHtml(); }, 2000);
    return;
  }

  if (changing) return;
  changing = true;

  $("table.blank.transactions-history-table").not("."+calculatedClass).each(function() {
    var totalSpent = totalSpentFunction($(this));
    displayTotalSpent(totalSpent, $(this));
  });

  changing = false;
}

var bodyObserver = null;
var tableObserver = null;


function analyzeDetailsPage() {
  var target = document.querySelector('body');
   
  bodyObserver  = new MutationObserver(function(mutations) {
    var shouldInject = true;
    mutations.forEach(function(mutation) {
      if ($(mutation.target).hasClass(pendingClass))
        shouldInject = false;
    });

    if (shouldInject)
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


