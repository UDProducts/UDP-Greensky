/*
 * contactable 1.5 - jQuery Ajax contact form
 *
 * Copyright (c) 2009 Philip Beel (http://www.theodin.co.uk/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Revision: $Id: jquery.contactable.min.js 2012-05-26 $
 *
 */
 
(function(jQuery){

	// Define the new for the plugin ans how to call it	
	jQuery.fn.contactable = function(options) {
		// Set default options  
		var defaults = {
			url: 'mail.php',
			name: 'Name',
			email: 'Email',
			dropdownTitle: '',
			dropdownOptions: ['General', 'Website bug', 'Feature request'],
			message : 'Message',
			subject : 'A contactable message',
			submit : 'SEND',
			recievedMsg : 'Thank you for your message',
			notRecievedMsg : 'Sorry but your message could not be sent, try again later',
			disclaimer: 'Please feel free to get in touch, we value your feedback',
			hideOnSubmit: true
		};

		var options = jQuery.extend(defaults, options);
		
		return this.each(function() {

			// Create the form and inject it into the DOM
			var this_id_prefix = '#'+this.id+' '
			,	dropdown = ''
			,	filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
			,	dropdownLen = options.dropdownOptions.length
			,	i;

			// Add select option if applicable
			if(options.dropdownTitle) {
				dropdown += '<p><label for="issue">'+options.dropdownTitle+' </label><br /><select name="dropdown" id="dropdown" class="dropdown">';

				for(i=0; i < dropdownLen; i++) {
					dropdown += '<option value="'+options.dropdownOptions[i]+'">'+options.dropdownOptions[i]+'</option>';
				}			
				
				dropdown += '</select></p>';
			}
			// Form layout
			/*	
			*	<div id="contactable_inner"></div>
			*	<form id="contactForm" method="" action="">
			*  		<div id="loading"></div>
			*		<div id="callback"></div>
			* 		<div class="holder">
			* 			<p>
			*				<label for="name">Name<span class="green"> * </span></label><br />
			*				<input id="name" class="contact validate" name="name" />
			*			</p>
			*			<p>
			*				<label for="email"> Email address <span class="green"> * </span></label><br />
			* 				<input id="email" class="contact validate" name="email" />
			*			</p>
			* 			<p>
			*				<label for="message"> Message <span class="green"> * </span></label><br />
			* 				<textarea id="message" name="message" class="message validate" rows="4" cols="30" ></textarea>
			*			</p>
			*			<p>
			*				<input class="submit" type="submit" value="Submit"/>
			*			</p>
			*			<p class="disclaimer">Disclaimer</p>
			*		</div>
			*	</form>
			*/

			jQuery(this).html('<div id="contactable_inner"></div><form id="contactForm" method="" action=""><div id="loading"></div><div id="callback"></div><div class="holder"><p><label for="name">'+options.name+'<span class="green"> * </span></label><input type="text" id="name" class="contact validate" name="name" onkeyup="javascript:this.value=this.value.toUpperCase();" /></p><p  class="mail_drop"><label for="email">'+options.email+'<span class="green"> * </span></label><input type="text" id="mail" class="validate mail" name="mail" />&nbsp;&nbsp;@&nbsp;&nbsp;<select><option value="gmail.com">gmail.com</option><option value="yahoo.co.in">yahoo.co.in</option><option value="rediffmail.com">rediffmail.com</option><option value="aol.in">aol.in</option></select></p><p><label for="Subject">'+options.subject+'<span class="green"> * </span></label><select><option value="Technical Support">Technical Support</option><option value="Customer Support">Customer Support</option></select></p><p><label for="message">'+options.message+'<span class="green"> * </span></label><textarea id="message" name="message" class="message validate" rows="4" cols="30" ></textarea></p><p><span id="count" name="count" /></p>Pseudo-Human check.<br/>How much is: <span class="cap_text"><input id="a" readonly="true"/>&nbsp;&nbsp;Answer:<input id="b"/></span><br/><br /><input class="submit" type="button" id="c" value="Submit" /></form>');
			

			
			// Toggle the form visibility
			jQuery(this_id_prefix+'div#contactable_inner').toggle(function() {
				jQuery(this_id_prefix+'#overlay').css({display: 'block'});
				jQuery(this).animate({"marginLeft": "-=5px"}, "2000"); 
				jQuery(this_id_prefix+'#contactForm').animate({"marginLeft": "-=0px"}, "2000");
				jQuery(this).animate({"marginLeft": "+=387px"}, "4000"); 
				jQuery(this_id_prefix+'#contactForm').animate({"marginLeft": "+=390px"}, "4000"); 
			}, 
			function() {
				jQuery(this_id_prefix+'#contactForm').animate({"marginLeft": "-=390px"}, "4000");
				jQuery(this).animate({"marginLeft": "-=387px"}, "4000").animate({"marginLeft": "+=5px"}, "2000"); 
				jQuery(this_id_prefix+'#overlay').css({display: 'none'});
			});
			
			// Submit the form
			jQuery(this_id_prefix+"#contactForm").submit(function() {
				
				// Validate the entries
				var valid = true
				,	params;

				//Remove any previous errors
				jQuery(this_id_prefix+"#contactForm .validate").each(function() {
					jQuery(this).removeClass('invalid');
				});

				// Loop through requigreen field
				jQuery(this_id_prefix+"#contactForm .validate").each(function() {
					
					// Check the min length
					if(jQuery(this).val().length < 2) {
						jQuery(this).addClass("invalid");
						valid = false;
					}

					//Check email is valid
					if (!filter.test(jQuery(this_id_prefix+"#contactForm #email").val())) {
						jQuery(this_id_prefix+"#contactForm #email").addClass("invalid");
						valid = false;
					}						
				});

				if(valid === true) {
					submitForm();
				}
				return false;
			});

			function submitForm() {
				// Display loading animation
				jQuery(this_id_prefix+'.holder').hide();
				jQuery(this_id_prefix+'#loading').show();
				
				// Trigger form submission if form is valid
				jQuery.ajax({
					type: 'POST',
					url: options.url,
					data: {
						subject:options.subject, 
						name:jQuery(this_id_prefix+'#name').val(), 
						email:jQuery(this_id_prefix+'#email').val(), 
						issue:jQuery(this_id_prefix+'#dropdown').val(), 
						message:jQuery(this_id_prefix+'#message').val()
					},
					success: function(data) {
						// Hide loading animation
						jQuery(this_id_prefix+'#loading').css({display:'none'}); 

						// Check for a valid server side response
						if( data.response === 'success') {
							jQuery(this_id_prefix+'#callback').show().append(options.recievedMsg);
							if(options.hideOnSubmit === true) {
								//hide the tab after successful submition if requested
								jQuery(this_id_prefix+'#contactForm').animate({dummy:1}, 2000).animate({"marginLeft": "-=450px"}, "slow");
								jQuery(this_id_prefix+'div#contactable_inner').animate({dummy:1}, 2000).animate({"marginLeft": "-=447px"}, "slow").animate({"marginLeft": "+=5px"}, "fast"); 
								jQuery(this_id_prefix+'#overlay').css({display: 'none'});	
							}
						} else {
							jQuery(this_id_prefix+'#callback').show().append(options.notRecievedMsg);
							setTimeout(function(){
								jQuery(this_id_prefix+'.holder').show();
								jQuery(this_id_prefix+'#callback').hide().html('');
							},2000);
						}
					},
					error:function(e){
						jQuery(this_id_prefix+'#loading').css({display:'none'}); 
						jQuery(this_id_prefix+'#callback').show().append(options.notRecievedMsg);
					}
				});		
			}
		});
	};

var x;
var y;
$('textarea#message').live('keydown', function(e) {
//alert(e.which);
if(e.which != 8)
{
 if (typeof x=='undefined' && e.which!=16)
  {
     x=9;
     $('span#count').text(x+" characters left");
     
  }
 else if(x>0 && e.which!=16)
  {
     x=x-1;
     $('span#count').text(x+" characters left");
  }
 else if(x<0 && e.which!=16)
  {
     x=0;
    $('span#count').text(x+" characters left");
  }
  
}
else if(e.which == 8)
{ x=x+1;
  if(x>10){
   x=10;
   }
  $('span#count').text(x+" characters left");
    
}
});
var z;
var w;
$('div#first_comment').live('keypress', function(e) {
//alert(e.which);
if(e.which==8 && typeof w=='undefined')
{
w=0;
$('span#comment_count').text("10 characters left");
}

if(e.which != 8)
{
 if (typeof z=='undefined' && e.which!=16)
  {
     z=9;
     $('span#comment_count').text(z+" characters left");
  }
 else if(z>0 && e.which!=16)
  {
     z=z-1;
     $('span#comment_count').text(z+" characters left");
  }
 else if(z<0 && e.which!=16)
  {
     z=0;
     $('span#comment_count').text(z+" characters left");
  }
  
}
else if(e.which == 8)
{
  z=z+1;
   if(z>10){
   z=10;
   
  $('span#comment_count').text(z+" characters left");
  }
}
});

var a;

$('div#second_comment').live('keypress', function(e) {
//alert(e.which);
if(e.which==8 && typeof w=='undefined')
{
a=0;
$('span#comment2_count').text("10 characters left");
}

if(e.which != 8)
{
 if (typeof a=='undefined' && e.which!=16)
  {
     a=9;
      $('span#comment2_count').text(a+" characters left");
  }
 else if(a>0 && e.which!=16)
  {
     a=a-1;
      $('span#comment2_count').text(a+" characters left");
  }
 else if(a<0 && e.which!=16)
  {
     a=0;
      $('span#comment2_count').text(a+" characters left");
  }
 
}
else if(e.which == 8)
{
  a=a+1;
   if(a>10){
   a=10;
   
  $('span#comment2_count').text(a+" characters left");
  }
}
});

var $box = $('#contact_form');
$(document).click(function(){//alert($(box).closest('div').attr("id"));
    if (!$box.has(this).length) { // if the click was not within $box
        $box.hide();
    }
});

/*
$('input#name').live('keyup', function(e) {
jQuery.validator.addMethod("lettersonly", function(value, element) {
	return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please"); 

$("input#name.contact.validate").validate({
  rules: {
    name: { lettersonly: true }
  }
});

//});*/
/*$(document).click(function(e) {//alert("e");
 //Hide the menus if visible
//alert(e.target.id);
if(e.target.id=="contactable_inner")
$('#contactForm').show();
else
$('#contactForm').hide();
 });*/



 
})(jQuery);

