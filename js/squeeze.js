// REQUIRES JQUERY && JQUERYUI
// This function changes the bottom boxes of the calulations 
var changeSqueeze = function(){
  var validColumnsCount = 0;
  var columnTotal = 0.0;

  $(".squeeze-qty").each(function(idx,el){
    var $el = $(el);
    var tr = $el.closest("tr");
    var price = parseFloat(tr.find("td > input.squeeze-price").val());
    var quantity = parseFloat($el.val());
    if(!isNaN(price) && !isNaN(quantity) && quantity != 0 && price != 0 ){
      // Okay, were're good here!
      validColumnsCount++;
      columnTotal += (parseFloat(price) * parseFloat(quantity));
    }
  });

  if (validColumnsCount > 0) { // Make sure we have some valid columns before we go doing anything here...
    var purchaseWaste 	= (columnTotal * 0.05); // Purchase waste is 5% of annual spend
    var operationWaste 	= (columnTotal * 0.1); 	// Operational waste is 10% of annual spend
    // Set content here
    $("#purchase_waste").html("$" + purchaseWaste.toFixed(2));
    $("#op_waste").html("$" + operationWaste.toFixed(2));
    $("#total_waste").html("$" + (purchaseWaste + operationWaste).toFixed(2));
  } else {
    // Set these to empty because there's no valid input
    $("#purchase_waste").html("");
    $("#op_waste").html("");
    $("#total_waste").html("");
  }

};

var getRawCopy = function(){
  var rows = "";
  $("table tbody tr").each(function(idx,row){
    var $row = $(row);
    var num 	    = $row.find("td > span.num").html();
    var id 		    = $row.find("td > input.squeeze-id").val();
    var qty		 	  = $row.find("td > input.squeeze-qty").val();
    var price 		= $row.find("td > input.squeeze-price").val();
    var spent 		= $row.find("td > span.squeeze-spent").html();
    var attached 	= $row.find("td > input[type='checkbox']").attr("checked");
    // Make sure there is valid information in this row...
    if (!isNaN(parseFloat(qty)) && !isNaN(parseFloat(price))) {
      rows += "\n" +
      " | Field: " + num +
      " | Part:" + id +
      " | Quantity: " + qty +
      " | Price: $" + price +
      " | Annual Spend: " + spent +
      " | Drawing: " + (attached ? "Yes" : "No") + 
      " | ";
    }
  });
  rows += "\n";
  rows += "\nPurchase Waste: " + $("#purchase_waste").html();
  rows += "\nOperational Waste: " + $("#op_waste").html();
  rows += "\nAnnual Waste: " + $("#total_waste").html();
  return rows;
};

$(document).ready(function(){

  // Populate email links
  $("span.email").each(function(idx,el){ 
    $(el).append("<a href='mailto:rwdennis@die-tech.com'>rwdennis@die-tech.com</a>")
  });


    var copyLink = $("#raw-copy");
    var text = copyLink.html();

    $("#dialog").dialog({
      modal: true, 
      position: 'center', 
      title: 'Copy and paste this into your email',
      width: 700,
      height: 300,
      resizable: false,
      autoOpen: false
    });


    $("#dialog").bind("dialogopen", function(e,ui){
      $("#raw-text").val(getRawCopy());
    });


    copyLink.html("<a href='#'>" + text + "</a>");
    copyLink.live("click", function(e){
      e.preventDefault();
      $("#dialog").dialog("open");
    });

  // This is the listener for calculations
  $(".squeeze-qty, .squeeze-price").live("change", function(e){ // Watch input cells
    var changed = $(this);
    var tr = changed.closest("tr");
    var quantity = tr.find("td > input.squeeze-qty").val();
    var price = tr.find("td > input.squeeze-price").val();
    var spendSpan = tr.find("td > span.squeeze-spent");
    var spend = (parseFloat(quantity) * parseFloat(price)).toFixed(2);
    if (isNaN(spend)) {
      spend = "";
    }
    spendSpan.html("$" + spend);
    changeSqueeze();
  });

});
