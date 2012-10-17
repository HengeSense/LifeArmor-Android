/*
 * 
 * LifeArmor
 * 
 * Copyright © 2009-2012 United States Government as represented by 
 * the Chief Information Officer of the National Center for Telehealth 
 * and Technology. All Rights Reserved.
 * 
 * Copyright © 2009-2012 Contributors. All Rights Reserved. 
 * 
 * THIS OPEN SOURCE AGREEMENT ("AGREEMENT") DEFINES THE RIGHTS OF USE, 
 * REPRODUCTION, DISTRIBUTION, MODIFICATION AND REDISTRIBUTION OF CERTAIN 
 * COMPUTER SOFTWARE ORIGINALLY RELEASED BY THE UNITED STATES GOVERNMENT 
 * AS REPRESENTED BY THE GOVERNMENT AGENCY LISTED BELOW ("GOVERNMENT AGENCY"). 
 * THE UNITED STATES GOVERNMENT, AS REPRESENTED BY GOVERNMENT AGENCY, IS AN 
 * INTENDED THIRD-PARTY BENEFICIARY OF ALL SUBSEQUENT DISTRIBUTIONS OR 
 * REDISTRIBUTIONS OF THE SUBJECT SOFTWARE. ANYONE WHO USES, REPRODUCES, 
 * DISTRIBUTES, MODIFIES OR REDISTRIBUTES THE SUBJECT SOFTWARE, AS DEFINED 
 * HEREIN, OR ANY PART THEREOF, IS, BY THAT ACTION, ACCEPTING IN FULL THE 
 * RESPONSIBILITIES AND OBLIGATIONS CONTAINED IN THIS AGREEMENT.
 * 
 * Government Agency: The National Center for Telehealth and Technology
 * Government Agency Original Software Designation: LifeArmor001
 * Government Agency Original Software Title: LifeArmor
 * User Registration Requested. Please send email 
 * with your contact information to: robert.kayl2@us.army.mil
 * Government Agency Point of Contact for Original Software: robert.kayl2@us.army.mil
 * 
 */
$('#time-out-page').live('pageshow', function(event) {
    $('#time-out-page .reset-timer').bind('click', function() {
        startCountdown($('#time-out-page .clock'), 300);
    });

    $('#time-out-page .interactive-rotate-button').bind("click", function (event) {
        $('#timer-group').show();
        $("#message").html('').removeClass('interactive-instruct').addClass('interactive-message');
        rotateMessage('data.json', $("#message"));
        $('#time-out-page .interactive-rotate-button .ui-btn-text ').html('New Suggestion');
        event.stopPropagation();  // don't let the live handler do this one.
        //resetCountdown($('#time-out-page .clock'));
        $('#time-out-page .clock').stopTime();
        $('#time-out-page .clock').html(formatTime(0));
    });


    $('#time-out-page #timer-1').bind("click", function () {
        startCountdown($('#time-out-page .clock'), 60);
    });
    $('#time-out-page #timer-5').bind("click", function () {
        startCountdown($('#time-out-page .clock'), 300);
    });
    $('#time-out-page #timer-10').bind("click", function () {
        startCountdown($('#time-out-page .clock'), 600);
    });
    $('#time-out-page #timer-30').bind("click", function () {
        startCountdown($('#time-out-page .clock'), 1800);
    });
    
});



$('#seek-support-page').live('pageshow', function(event) {

        $('#seek-support-contacts').empty();
        $('#seek-support-contacts').append('<div class="message">Loading...</div>');
        
        var options = new ContactFindOptions();
        options.multiple = true;
        //TODO: be aware of iOS quirks with displayName.  see phonegap docs.
        var fields = ["id", "displayName", "phoneNumbers"];
        console.log(navigator.contacts);
        if (navigator.contacts == null) {
            console.log('contacts not supported on this device');
            $("#setup_button").hide();
            $('#seek-support-contacts').html('<div class="error">Your device does not support contact retrieval.</div>');
        }
        else {
            console.log ('retrieving contacts');
            if ($("#setup_button:hidden")) {
                $("#setup_button").show();
            }
            navigator.contacts.find(fields, onSeekSupportContactsFindSuccess, onSeekSupportContactsFindError, options);
        }


    function onSeekSupportContactsFindSuccess(contacts) {
        console.log('Contracts retrieved: ' + contacts.length);
        var selectedContactsJson = localStorage.getItem("seekSupportNetwork");
        
        var selectedContacts = null;
        if (selectedContactsJson != null) {
            selectedContacts = JSON.parse(selectedContactsJson);
        }
        else {
            selectedContacts = new Array();
        }
        console.log(selectedContacts.length + ' contacts parsed from localstorage: ' + selectedContactsJson);
        $('#seek-support-contacts').empty();
        
        $('<div class="ui-grid-a"/>').appendTo('#seek-support-contacts');
        $.each(contacts, function(index, contact) {
            var html = '';
            var contactIdNum = parseInt(contact.id);
            if (jQuery.inArray(contactIdNum, selectedContacts) >= 0 && contact.displayName != null && contact.phoneNumbers != null) {
                
                    html = html + '<div class="ui-block-a">' + contact.displayName + '</div>';
                    html = html + '<div class="ui-block-b">';
                    $.each(contact.phoneNumbers, function (i2, phoneNumber) {
                        html = html + '<a href="tel: ' + phoneNumber.value + '" data-role="button">' + phoneNumber.type + '</a>';
                    });
                    html = html + '<br/></div>';

                $(html).appendTo('#seek-support-contacts div.ui-grid-a');
            }
        });

        $('#seek-support-contacts').trigger('create');  // add jqm styling to all created elements
    }

    function onSeekSupportContactsFindError(err) {
        alert('Error: ' + err);
    }
});


$('#seek-support-setup-page').live('pageshow', function(event) {
      $('#seek-support-setup-contacts').empty();
      $('#seek-support-setup-contacts').append('<div class="message">Loading...</div>');  
      
      var options = new ContactFindOptions();
      options.multiple = true;
      var fields = ["id", "displayName", "phoneNumbers"];
      console.log(navigator.contacts);
      if (navigator.contacts == null) {
          console.log('contacts not supported on this device');
          $('#seek-support-setup-contacts').html('<div class="error">Your device does not support contact retrieval.</div>');
          $('#seek-support-setup-submit').button('disable');  //TODO: would actually like to hide, but can't find jqm method to do so easily.  more investigation.
      }
      else {
          console.log ('retrieving contacts');
          navigator.contacts.find(fields, onSeekSupportSetupContactsFindSuccess, onSeekSupportSetupContactsFindError, options);
      }

  function onSeekSupportSetupContactsFindSuccess(contacts) {
      console.log('Contracts retrieved: ' + contacts.length);
      if (contacts.length == 0) {
          alert('You do not have any contacts in your phone book, or your device does not support contact retrieval.');
      }
      else {
          var selectedContactsJson = localStorage.getItem("seekSupportNetwork");
          
          var selectedContacts = null;
          if (selectedContactsJson != null) {
              selectedContacts = JSON.parse(selectedContactsJson);
          }
          else {
              selectedContacts = new Array();
          }
          console.log(selectedContacts.length + ' contacts parsed from localstorage: ' + selectedContactsJson);
          $('#seek-support-setup-contacts').empty();

          $.each(contacts, function(index, contact) {
              console.log('contact.id: ' + contact.id + ", name: " + contact.displayName);
              if (contact.displayName != null && contact.phoneNumbers != null)    {
                  var contactIdNum = parseInt(contact.id);
                  var checkIt;
                  if (jQuery.inArray(contactIdNum, selectedContacts) >= 0) {
                      checkIt = "checked";
                      console.log ("Contact with phone, previously selected.");
                  }
                  else {
                      checkIt = "";
                      console.log ("Contact with phone.");
                  }
                  var nodeBase = 'seek-support-setup-contacts-';  // if you change this, change the substring line, far below
                  var nodeName = nodeBase + contactIdNum;
                  var nodeHtml = '<input type="checkbox" name="' + nodeName + '" id="' + nodeName + '" ' + checkIt + ' />' +
                                      '<label for="' + nodeName + '" id=' + nodeName + '-lbl">' + contact.displayName + '</label>';
                  $('#seek-support-setup-contacts').append(nodeHtml);
              }
          });
          $('#seek-support-setup-contacts').trigger('create');
      }
  }
  function onSeekSupportSetupContactsFindError(err) {
      //TODO: probably don't need to give technical error back to user without addl niceness
      alert('Error: ' + err);
  }

  $('#seek-support-setup-submit').bind('tap', function (event) {
      var checked = new Array();
      $('input[type="checkbox"]').each(function () {
          if ( $(this).prop('checked') ) {
              var contactId = $(this).prop('name').substring(28); //length of nodeBase, above.
              console.log(contactId + "   checked");
              checked.push(parseInt(contactId));
          }
      });
      var checkedJson =  JSON.stringify(checked);
      console.log(checkedJson);
      localStorage.setItem("seekSupportNetwork", checkedJson);
  });
});


$('#rid-r-page').live('pageshow', function(event) {
    $('#rid-r-page .reset-timer').bind('click', function() {
        $('#go_on').show();
        $('#rid-r-page .reset-timer').parent().find('.ui-btn-text').text("Reset Timer");
        startCountdown($('#rid-r-page .clock'), 30);
    });

    // stop timers on any anchor tap
    $('#rid-r-page a').bind('click', function() {
        $('#rid-r-page .clock').stopTime();
    });

    $('#rid-r-page').bind('pagehide', function() {
        $('#rid-r-page .clock').stopTime();
    });
});





$('#breathe_intervention').live('pageshow', function(event) {

    var audio_inhale = null;
    var audio_hold = null;
    var audio_exhale = null;
    var StateEnum = {"NONE": 0, "BREATHE": 3};
    var state = StateEnum.NONE;
    var counter = null;

    document.addEventListener("pause", onApplicationPause, false);
    
    $( '#breathe_intervention' ).bind( 'pagebeforeshow',function(event){
        buttonPress(StateEnum.NONE);
    });

    $( '#breathe_intervention' ).bind( 'pagebeforehide',function(event){
        buttonPress(StateEnum.NONE);
    });
    
    $("#breatheButton").bind('click', function() {
        buttonPress(StateEnum.BREATHE);
    });

    function setAButtonText(txt){
        $('#breatheButton .ui-btn-text').text(txt);
    }

    function onApplicationPause() {
       // console.log('STATE: ' + state);
        buttonPress(StateEnum.NONE);
    };

    function buttonPress(targetState) {
       // console.log("Button press: " + targetState);
        if (targetState == state)
        {
            targetState = StateEnum.NONE;
        }
        changeState(targetState);
    };

    function changeState(newState) {
        var oldState = state;
        state = newState;
        
        console.log("State change, " + oldState + " to " + state);

        //clean up from the old state
        switch (oldState)
        {
        case StateEnum.NONE:
            break;
        case StateEnum.BREATHE:
            if (audio_inhale)
            {
                audio_inhale.stop();
            }
            if (audio_hold)
            {
                audio_hold.stop();
            }
            if (audio_exhale)
            {
                audio_exhale.stop();
            }
            $(this).stopTime("breathe");
            setAButtonText("Start");
            $("#instruction").text("");
            $("#counter").text("");
            $("#orb_green").css({'-webkit-backface-visibility':'hidden','visibility': 'hidden'});
            $("#orb_yellow_full").css({'webkitTransform':'scale(2)', '-webkit-backface-visibility':'hidden', 'visibility': 'hidden'});
            $("#orb_red").css({'webkitTransform':'scale(2)', '-webkit-backface-visibility':'hidden', 'visibility': 'hidden'});
            $("#orb_yellow_empty").css('visibility', 'hidden');
            break;
        }
        switch (state)
        {
        case StateEnum.NONE:
            break;
        case StateEnum.BREATHE:
            setAButtonText("Stop");
            runBreathe();
            break;  
        }
    };

    function runBreathe(){
        var path = jQuery.mobile.path.parseUrl(location.pathname).pathname;
        var dir = path.substring(path.indexOf(''), path.lastIndexOf('/'));
        
            audio_inhale = new Media( dir + "/tools/relax_breathe/audio/Alford/inhale.mp3" );
            audio_hold   = new Media( dir + "/tools/relax_breathe/audio/Alford/hold.mp3" );
            audio_exhale = new Media( dir + "/tools/relax_breathe/audio/Alford/exhale.mp3" );
                    
        counter = -4;

        $(this).stopTime();
        $(this).everyTime(1200, "breathe", function () {
            var instruction = $("#instruction");
            
            function updateCounter(msg){  
                $('.counter').html(msg);  
            }
            
            
            if (counter < 0) {
                updateCounter(Math.abs(counter));
            } else {
                var fourcount = counter % 4 + 1;
                updateCounter(fourcount);
            }
            
            switch (counter)
            {
            case -4:
                $(orb_green).css("visibility", "visible");

                $(instruction).text("Ready");
                break;
            case -3:
                $(instruction).text("Relax");
                break;
            case -2:
                $(instruction).text("Exhale");
                break;
            case -1:
                $(instruction).text("Begin");
                break;
            case 0:
                $("#orb_yellow_full").css('visibility', 'hidden');
                
                $(instruction).text("Inhale");
                console.log('before green transition');
                $("#orb_green").css({'visibility': 'visible', '-webkit-transition-timing-function':'-webkit-transform ease-in-out', '-webkit-transform':'scale(2)','-webkit-transition-duration':'4000ms'});
                //$('#orb_green').animate({'visibility': 'visible', '-webkit-transition':'-webkit-transform 4s ease-in-out', '-webkit-transform':'scale(2)'});
                 if (audio_inhale) 
                    {
                        audio_inhale.play();
                    }
                break;
            case 4:
                $(instruction).text("Hold");
                // hide green orb and scale back to 1.
                $("#orb_green").css({'visibility': 'hidden', 'webkitTransition':'', 'webkitTransform': 'scale(1)'});
                // show yellow orb at scale 2.
                console.log('before yellow transition');
                $("#orb_yellow_full").css({'visibility': 'visible', 'webkitTransform': 'scale(2)'});
                if (audio_hold) 
                {
                    audio_hold.play();
                }
                break;
            case 8:
                $(instruction).text("Exhale");
                // show red orb and shrink
                console.log('before red transition');
                $("#orb_red").css({'visibility': 'visible', 'webkitTransition':'-webkit-transform 4s ease-in-out', 'webkitTransform':'scale(1)'});
                
                // hide yellow orb
                $("#orb_yellow_full").css('visibility', 'hidden');
                if (audio_exhale) 
                {
                    audio_exhale.play();
                }                   
                break;
            case 12:
                $(instruction).text("Hold");
                // hide red orb and scale back to 2.
                console.log('before red transition');
                $("#orb_red").css({'visibility': 'hidden', 'webkitTransition':'', 'webkitTransform': 'scale(2)'});
                // show yellow orb at scale 1.
                $("#orb_yellow_full").css({'visibility': 'visible', 'webkitTransform': 'scale(1)'});
                if (audio_hold)
                {
                    audio_hold.play();
                }
                break;
            case 15:
                //reset to beginning.
                counter = -1;
                break;
            }
            counter++; 
        });
    };
    

    
    
    
    
    
    
    
    
    
    
    
    
    /**
     * Adds a layer of control over PhoneGap's Media object, including the ability
     * to automatically re-acquire media handles that have been released.
     * 
     * @param source
     *            String containing path to source media.
     * @returns boolean indicating successful object creation
     */
    var MediaWrapper = function (source, successCallback, errorCallback)
    {
        if (!(this instanceof arguments.callee)) {  
            return new MediaWrapper(source, successCallback, errorCallback);  
        }   

        this.source = source;
        this.shortSource = source.match("[^/]*/[^/]*$");
        this.playing = false;
        this.media = null;
        this.successCall = successCallback;
        this.errorCall = errorCallback;
        this.muted = false;
       // console.log("MediaWrapper created. [" + this.shortSource + "]");
    };

    MediaWrapper.prototype.play = function ()
    {
        if (!this.isMuted()) // If not muted
        {
            this.playing = true;
            
            // stop any media stopping timers that might be running.  See .stopSafe() for details.
            $(this).stopTime(this.source);
            
            this.acquire();  //ensure we actually have the media handle.
            if (this.media != null)
            {
               // console.log("MediaWrapper playing.  [" + this.shortSource + "]");
                this.media.play();
            } else
            {
              //  console.log("MediaWrapper could not acquire media:  [" + this.shortSource + "]");
            }
        }
    };

    MediaWrapper.prototype.setMuted = function (muted)
    {
        this.muted = muted;
    };

    MediaWrapper.prototype.isMuted = function ()
    {
        return this.muted;
    };

    MediaWrapper.prototype.pause = function ()
    {
       // console.log("MediaWrapper pausing. [" + this.shortSource + "]");
        if (this.media && this.playing)
        {
            this.media.pause();
            this.playing = false;
        }
    };
    MediaWrapper.prototype.togglePause = function ()
    {
       // console.log("MediaWrapper toggle pause. [" + this.shortSource + "]");
        if (this.media)
        {
            if (this.playing)
            {
                this.pause();
            } else
            {
                this.play();
            }
        } else
        {
            this.play();
        }
    };

    MediaWrapper.prototype.stop = function ()
    {
        //console.log("MediaWrapper stopping. [" + this.shortSource + "]");
        if (this.media)
        {
            this.media.stop();
            this.playing = false;
        }
    };
    MediaWrapper.prototype.stopSafe = function ()
    {
       // console.log("MediaWrapper safe stopping. [" + this.shortSource + "]");
        if (this.media)
        {
            var _this = this;  //get around this pointing to Window inside setTimeout.
            $(this).oneTime(700, this.source ,function ()
            {
                _this.stopUnsafe();
            });
        }
    };

    MediaWrapper.prototype.release = function ()
    {
        //console.log("MediaWrapper releasing resource. [" + this.shortSource + "]");
        if (this.media)
        {
            this.media.stop();
            this.media.release();
            this.media = null;
            this.playing = false;
        }
    };
    MediaWrapper.prototype.acquire = function ()
    {
        if (typeof device != 'undefined')
        {
            if (this.media == null) // media not created yet.
            {
               // console.log("MediaWrapper loading media. [" + this.shortSource + "]");
                this.media = new Media(this.source, this.mediaCompleted(),
                    function (code, message)
                    {
                        //console.log("Error " + code + " (" + message + ") occurred in Media. [" + this.shortSource + "]");
                    }
                );
            } else
            { 
                //console.log("MediaWrapper already has media handle. [" + this.shortSource + "]");
            }
        } else
        {
            //console.log("MediaWrapper attempted to load media on a non-mobile device [" + this.shortSource + "]");
        }
    };

    MediaWrapper.prototype.mediaCompleted = function ()
    {
        this.playing = false;
        //console.log("Callback reports MediaWrapper completed. [" + this.shortSource + "]");
        if (this.successCall)
        {
            this.successCall();
        }
    };

    MediaWrapper.prototype.mediaError = function ()
    {
        this.playing = false;
        //console.error("Callback reports MediaWrapper error occurred. [" + this.shortSource + "]");
        if (this.errorCall)
        {
            this.errorCall();
        }
    };
});