// minify on Simple @ http://closure-compiler.appspot.com/home

;(function($){

	function LocaleSwitcher(){
		this.version = '2.0';
		this.selectors = {
			css 			: 'css-exp--locale-switcher',
			modal 			: 'js-exp--locale-switcher',
			modalMask 		: 'js-exp--locale-switcher--mask',
			modalUI 		: 'js-exp--locale-switcher--ui',
			modalUITitle 	: 'js-exp--locale-switcher--ui--title',
			modalUICloseBtn : 'js-exp--locale-switcher--ui--close-button',
			form 			: 'js-exp--locale-switcher--form',
			originLabel 	: 'js-exp--locale-switcher--form--origin-label',
			originSelect 	: 'js-exp--locale-switcher--form--origin-select',
			countryLabel 	: 'js-exp--locale-switcher--form--country-label',
			countrySelect 	: 'js-exp--locale-switcher--form--country-select',
			langLabel 		: 'js-exp--locale-switcher--form--lang-label',
			langSelect 		: 'js-exp--locale-switcher--form--lang-select',
			hidden 			: 'exp--locale-switcher--hidden',
			alignRight 		: 'exp--locale-switcher--align-right'
		};
		this.selectedOrigin = undefined;
		this.selectedCountry = undefined;
		this.selectedLanguage = undefined;

		this.init();
	};

	LocaleSwitcher.prototype = {
		init : function(){
			var _self = this;

			if( !nike.geo.Configuration ){
				alert('nike.geo.Configuration hasn\'t been defined');
				return false;
			}

			// check if the modal already exists, if not, create it
			_self.$modal = $('#'+_self.selectors.modal);
			if( !_self.$modal.length ){
				var css = 
					'<style id="'+_self.selectors.css+'">'+
						'.'+_self.selectors.hidden+' {'+
							'display: none !important;'+
						'}'+
						'.'+_self.selectors.alignRight+' {'+
							'text-align: right;'+
						'}'+
						'#'+_self.selectors.modal+' {'+
							'font-family: monospace;'+
							'font-size: 1.25em;'+
							'min-width: 354px;'+
							'border-radius: 0.25em;'+
							'position: fixed;'+
							'top: 3em;'+
							'left: 50%;'+
							'z-index: 2001;'+
							'transform: translate(-50%);'+
							'border: solid 1px #ccc;'+
							'box-shadow: 0px 5px 20px;'+
						'}'+
						'#'+_self.selectors.modal+' *:focus {'+
							'box-shadow: 0px 0px 10px #FF9B00;'+
						'}'+
						'#'+_self.selectors.modalMask+' {'+
							'background: #000;'+
							'position: absolute;'+
							'top: 0; left: 0; right: 0; bottom: 0;'+
							'opacity: 0.75;'+
							'z-index: 2000;'+
						'}'+
						'#'+_self.selectors.modalUI+' {'+
							'color: #EEE;'+
							'position: relative;'+
							'background: #333;'+
							'border-radius: 0.25em 0.25em 0 0;'+
							'padding: 2px 10px;'+
						'}'+
						'#'+_self.selectors.modalUITitle+' {'+
							'font-size: 0.75em;'+
							'line-height: 2em;'+
							'height: 2em;'+
						'}'+
						'#'+_self.selectors.modalUICloseBtn+' {'+
							'font-weight: bold;'+
							'color: #333;'+
							'border-radius: 1em;'+
							'width: 1em;'+
							'height: 1em;'+
							'text-align: center;'+
							'line-height: 1em;'+
							'background: #EEE;'+
							'position: absolute;'+
							'top: 0.25em;'+
							'right: 0.25em;'+
							'cursor: pointer;'+
						'}'+
						'#'+_self.selectors.form+' {'+
							'padding: 10px;'+
							'background: #eee;'+
							'border-radius: 0 0 0.25em 0.25em;'+
						'}'+
						'#'+_self.selectors.form+' label {'+
							'display: block;'+
							'cursor: default;'+
							'margin-bottom: 10px;'+
							'text-align: right;'+
						'}'+
						'#'+_self.selectors.form+' select {'+
							'min-width: 200px;'+
						'}'+
						'#'+_self.selectors.langLabel+' {'+
							'margin-top: 10px;'+
							'margin-left: 27px;'+
						'}'+
						'button[type="submit"] {'+
							'margin-top: 10px;'+
						'}'+
					'</style>';
				var modalMarkup = 
					'<div id="'+_self.selectors.modalMask+'"></div>'+
					'<div id="'+_self.selectors.modal+'">'+
						'<div id="'+_self.selectors.modalUI+'">'+
							'<div id="'+_self.selectors.modalUITitle+'">Locale Switcher v'+_self.version+'</div>'+
							'<div id="'+_self.selectors.modalUICloseBtn+'">X</div>'+
						'</div>'+
						'<form id="'+_self.selectors.form+'">'+
							'<label id="'+_self.selectors.originLabel+'" title="Where you came from">Origin ISO: <select id="'+_self.selectors.originSelect+'">'+_self.getCountries()+'</select></label>'+
							'<label id="'+_self.selectors.countryLabel+'" title="Where you\'re going to">Country ISO: <select id="'+_self.selectors.countrySelect+'">'+_self.getCountries()+'</select></label>'+
							'<label id="'+_self.selectors.langLabel+'" class="'+_self.selectors.hidden+'" title="The language you want to see the page in">Language: <select id="'+_self.selectors.langSelect+'"></select></label>'+
							'<div class="'+_self.selectors.alignRight+'"><button type="submit">Switch Locale</button></div>'+
						'</form>'+
					'</div>';

				// append the styles
				_self.$css = $(css).appendTo('body');
				// append the modal
				_self.$modal = $(modalMarkup).appendTo('body');

				_self.addListeners();
			}
		},

		getCountries : function(){
			var countryOptions = '';
			var countries = nike.geo.Configuration.COUNTRIES;
			var sortedCountries = [];

			// sort alphabetically first
			for(var i in countries){
				if( countries.hasOwnProperty(i) ){ sortedCountries.push(i); }
			}
			sortedCountries.sort();

			// create all options in alphabetical order
			for(var i=0; i<sortedCountries.length; i++){
				var countryObj = countries[ sortedCountries[i] ];
				var countryCode = countryObj.countryCode.toUpperCase();
				var selected = ( countryCode == 'US' ) ? ' selected="selected"' : ''; // default to US
				countryOptions += '<option'+selected+' value="'+countryCode.toLowerCase()+'">'+countryCode+' : '+countryObj.displayName+'</option>';
			}

			return countryOptions;
		},

		addListeners : function(){
			var _self = this;
			var $closeBtn = _self.$modal.find( '#'+_self.selectors.modalUICloseBtn );
			var $originSelect = _self.$modal.find( '#'+_self.selectors.originSelect );
			var $countrySelect = _self.$modal.find( '#'+_self.selectors.countrySelect );
			var $langLabel = _self.$modal.find( '#'+_self.selectors.langLabel );
			var $langSelect = _self.$modal.find( '#'+_self.selectors.langSelect );
			var $form = _self.$modal.find( '#'+_self.selectors.form );
			var $submitBtn = $form.find('button[type="submit"]');

			
			// set default vals
			_self.selectedOrigin = $originSelect.val();
			_self.selectedCountry = $countrySelect.val();
			_self.selectedLanguage = nike.geo.Configuration.getSupportedLanguages( _self.selectedCountry )[0].abbrev;

			$closeBtn.on('click', function(){
				_self.removeModal();
			});

			$originSelect.on({
				change : function(ev){
					_self.selectedOrigin = $originSelect.val();
				},
				keypress : function(ev){
					_self.selectedOrigin = $originSelect.val();
					_self.handleKeysWithinSelect(ev, $form);
				}
			});

			$countrySelect.on({
				change : function(ev){
					_self.selectedCountry = $countrySelect.val();
					// reset lang select
					$langLabel.addClass( _self.selectors.hidden );
					$langSelect.html('');
					_self.selectedLanguage = undefined;

					var langs = nike.geo.Configuration.getSupportedLanguages( _self.selectedCountry );

					if( langs.length > 1 ){
						// populate the select with the new langs & then display it
						var langOptions = '';

						for(var i in langs){
							if( langs.hasOwnProperty(i) ){ 
								var currLang = langs[i];
								langOptions += '<option value="'+currLang.abbrev+'">'+currLang.lang.toUpperCase()+' : '+currLang.displayName+'</option>';
							}
						}

						$langSelect.html( langOptions );
						$langLabel.removeClass( _self.selectors.hidden );
						_self.selectedLanguage = $langSelect.val();
					}else{
						_self.selectedLanguage = langs[0].abbrev;
					}
				},
				keypress : function(ev){
					_self.selectedCountry = $countrySelect.val();
					if( !$langLabel.hasClass( _self.selectors.hidden ) ){
						_self.selectedLanguage = $langSelect.val();
					}else{

					}
					_self.handleKeysWithinSelect(ev, $form);
				}
			});

			$langSelect.on({
				change : function(ev){
					_self.selectedLanguage = $langSelect.val();
				},
				keypress : function(ev){
					_self.selectedLanguage = $langSelect.val();
					_self.handleKeysWithinSelect(ev, $form);
				}
			});



			$form.on('submit', function(ev){
				ev.preventDefault();
				ev.stopImmediatePropagation();

				_self.switchLocales();
			});

			// default the country select to be focused
			$countrySelect.focus();
		},

		handleKeysWithinSelect : function(ev, $form){
			if( ev.keyCode == 13 ){ 
				ev.preventDefault();
				ev.stopImmediatePropagation();
				$form.submit();
			}
		},

		switchLocales : function(){
			var _self = this;
			var m = window.location.href.match(/(nike|nikedev)\.com(\/.*?)(\/.*?)\//);
		    var exp = '=;path=/;domain=.' + m[1] + '.com;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		    var cookies = ['CONSUMERCHOICE', 'CONSUMERCHOICE_SESSION', 'NIKE_COMMERCE_COUNTRY', 'NIKE_COMMERCE_LANG_LOCALE', 'nike_locale'];
		    
		    // delete the cookies
		    for(var i=0; i<cookies.length; i++){
		        document.cookie = cookies[i] + exp;
		    }
		    
		    // set the geoloc cookie with is usually set in Akamai environments
			$.CookieUtil('geoloc', 'cc='+_self.selectedOrigin+',rc=OR,tp=vhigh,tz=PST,la=45.4908,lo=-122.8046,bw=5000', {
		        expires: 360,
		        path: '/',
		        domain: location.host
		    });

		    // go to the new location
		    if(m.length == 4){
		        window.location = window.location.href.replace(m[3], '/'+ _self.selectedLanguage).replace(m[2], '/'+ _self.selectedCountry);
		    }
		},

		removeModal : function(){
			var _self = this;

			_self.$modal.remove();
			_self.$css.remove();
		}
	};


	// kick it off
	new LocaleSwitcher();
})(jQuery);