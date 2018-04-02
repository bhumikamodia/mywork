
//$(document).ready(function(){
//	//InitChart();
//	
//	  $.ajax({url: "http://localhost/IOTGraphs/realdatagenerator",dataType: "json", success: function(result){
//	        //alert(""+result);
//	        //InitChart(result);
//	        
//	        
//		  createChartData(result);
//	        
//	    }});
//	
//	
//});
/*
function createChartData(result){
	
	 var temparature=["Temparature"];
     var pressure =["Pressure"];
     var humidity=["Humidity"];
     var tdate=['tdate'];
     var pdate=['pdate'];
     var hdate=['hdate'];
     
       $.each(result, function(index, object) {

           var tsdate = new Date(parseInt(object.data["ts"])*1000).toISOString();

    	   if( object.data["senp"]=="Temperature"){

    		   temparature.push (object.data["senv"]);  
    		   tdate.push( tsdate );
              
        	   }

    	   if(object.data["senp"]=="Pressure"){
    		   
    		   pressure.push (object.data["senv"]);  
    		   pdate.push( tsdate );
        	  }

			if(object.data["senp"]=="Humidity"){
    		   
				   humidity.push (object.data["senv"]);  
    		   hdate.push( tsdate );
        	  }
    	   
           

		});

       generateChart(temparature, pressure, tdate, pdate,humidity,hdate);
	
}

function generateChart(temparature,pressure,tdate,pdate,humidity,hdate){
 //06-Dec-2016 11:43:56:000000
	var chart = c3.generate({
	    data: {
	       
	        xFormat: '%Y-%m-%dT%H:%M:%S.%LZ', // 'xFormat' can be used as custom format of 'x'
            xs:{
                'Temparature': 'tdate',
                'Pressure': 'pdate',
                'Humidity':'hdate'
                },
	        columns: [
	           tdate,
	           pdate,
	           hdate,
	           temparature,
	           pressure,
	           humidity
	        ]
	    },
	    axis: {
	        x: {
	            type: 'timeseries',
	            tick: {
	                format: '%Y-%m-%d %H:%M:%S'
	            }
	        }
	    }
	});
	
}

$(document).ready(function(){

$("#btn_submit").click(function(event)
		{
			event.preventDefault();
			var gateway_id = $("#gateway_id").val();
			var mac_id = $("#mac_id").val();
			var time=$("#time").val()
		    var cur_time = new Date().getTime();  
			
			var macArray = [];
			macArray.push(mac_id);
			//macArray.push(mac_id);
			
			if(time=="Last_30_min"){timestamp = new Date().getTime() - (30 *60000);}
			else if(time=="Last_45_min"){timestamp = new Date().getTime() - (45 *60000);}
			else if(time=="Last_1_hour"){timestamp = new Date().getTime() - (60 *60000);}
			else if(time=="Last_12_hour"){timestamp = new Date().getTime() - (720 *60000);}
			else if(time=="Last_24_hour"){timestamp = new Date().getTime() - (1440 *60000);}
			else if(time=="Last_Week"){timestamp = new Date().getTime() - (7 * 1440 * 60000);}
			//var dataString ='gateway_id='+ gateway_id + '&mac_id='+ mac_id + '&time='+ timestamp;
			
			var dataString = '{"gwid":"'+gateway_id+'","lasttime":'+timestamp+',"macid":'+JSON.stringify(macArray)+'}';
									
			console.log("dataString:->"+dataString);
			
			// AJAX Code To Submit Form.
			$.ajax
			({
				type: "POST",
				url: "http://198.199.110.151/api/live/",
				data: dataString,
				dataType:"json",
				contentType: "application/json",
				cache: false,
			
				success: function(result)
				{
					 createChartData(result.Data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					     alert("Error:->"+XMLHttpRequest.responseText);
				}
			});
  });
});
*/