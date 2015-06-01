var changing=false;

function totalSpentFunction(elm) {
  var sum = 0;
  $(elm).find(".negative-value").each(function() {
    sum = sum + parseFloat($.trim($(this).html()).substring(2));
  });
  return sum.toFixed(2);
}

function displayTotalSpent(totalSpent, elm) {
  var html = "<p class='totalSpent'>Total Spent: $"+ totalSpent+"</p>";
  $(elm).find("tr.transaction-collapsible-header th:eq(0)").append(html);
}

function change() {
    if ($("tr.transaction-collapsible-header").length == 0) {
      setTimeout(function() { change(); }, 2000);
      return;
    }

    if (changing) return;
    changing = true;

    $("table.blank.transactions-history-table").each(function() {
      var totalSpent = totalSpentFunction($(this));
      displayTotalSpent(totalSpent, $(this));
    });
}

$(document).ready(function() { 
  window.onhashchange = change;
});


