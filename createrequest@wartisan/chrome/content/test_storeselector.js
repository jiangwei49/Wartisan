(function() {
	$.Controller.extend("Adobe.StoreSelector.StoreSelectorController",
		    /* @Static */
		    {
		        pluginName : "store_selector",
		        defaults:
		        {
		            storeSelectorCountries : {},
                    storeProductUrlMapping : {},
                    storeKeyword		   : '',
                    productPageURL		   : '',
                    countriesUrlCodeObj	   : {}
		        }
		    },
		    /* @Prototype */
		    {
		    	init: function(el, params)
		    	{
	                this.storeSelectorCountries = (params) ? params.storeSelectorCountries : {};
                    this.storeProductUrlMapping = (params) ? params.storeProducUrltMappings : {};
                    this.storeKeyword 			= (params) ? params.storeKeyword : '';
	            },

                getStoreRegionCookie: function()
                {
                    var cookieVal = $.cookie("storeregion"),
	                	cookieIdx = ($.isValue(cookieVal)) ? cookieVal.indexOf("-") : "",
	                	cookieValue = ($.isValue(cookieVal)) ? cookieVal.substring(cookieIdx+1, cookieVal.length).toUpperCase() : "";

                    return cookieValue;
                },

	            updateCountryDropdownFromCookie: function()
                {
                    var cookieValue = this.getStoreRegionCookie(),
                        internationalCookieValue = $.cookie("international");

					if (cookieValue !== "")
                    {
                        if (cookieValue === "EDU" && (internationalCookieValue === "us" || internationalCookieValue === "ca" || internationalCookieValue === "ca_fr"))
                        {
	                		$("#countriesList").val(internationalCookieValue.toUpperCase());
                        }
                        else
                        {
	                		$("#countriesList").val(cookieValue);
                        }
                    }
                    else
                    {
						if (typeof(tntGeocountry) !== "undefined")
                     	{
	                    	 tntCountry = (tntGeocountry.replace(/([^ -])([^ -]*)/gi,function(v,v1,v2){ return v1.toUpperCase()+v2; }));
                     	}
                     	if (tntCountry != "")
                     	{
                        	$('#countriesList option:contains(' + tntCountry + ')').each(function(){
                            	if ($(this).text() === tntCountry)
                            	{
                                	$(this).attr('selected', 'selected');
                                	return false;
                            	}
                            	return true;
                         	});
                        }
                    }
					var selectedCountry = $("#countriesList").val();
                    if (selectedCountry != "")
                    {
                        this.updateStoreLinks();
                    }
                },

	            updateStoreLinks: function()
	            {
					var selectedCountry = $("#countriesList").val();
	                var countries = Adobe.Store.StoreSelector.storeSelectorCountries;
	                var customerCareNumber = "";
                    var productPageURL = this.productPageURL;
	                if (selectedCountry == "")
	                {
	                    $("#COMStoreLink").empty();
	                    $("#EDUStoreLink").empty();
	                    $("#BIZStoreLink").empty();
                        $('#contactNumber').empty();
						$('#storeLinkContainer').hide();
                        $('#contactTextRow').hide();
	                    return;
	                }
                    if (this.storeKeyword !== "")
                    {
                        this.mapProductUrlTokeyword(selectedCountry);
                    }
                    var _selfObj = this;
					for (var country in countries)
	                {
	                    if (countries[country].countryCode === selectedCountry)
	                    {
	                        $('#storeLinkContainer').show();
	                        customerCareNumber = countries[country].customerCareNumber;
                            if (customerCareNumber != "" && $.isValue(customerCareNumber))
                            {
	                        	$('#contactNumber').html(customerCareNumber);
	                        	$('#contactTextRow').show();
                            }
                            else
                            {
                            	$('#contactNumber').empty();
                            	$('#contactTextRow').hide();
                            }
                            var storeTypeText,
                                storeCOMUrlText = (Adobe.Store.LinksText) ? Adobe.Store.LinksText.comLinkText : "Personal &amp; Professional Use",
                                storeEDUUrlText = (Adobe.Store.LinksText) ? Adobe.Store.LinksText.eduLinkText : "Student, Educators and Staff",
                                storeBIZUrlText = (Adobe.Store.LinksText) ? Adobe.Store.LinksText.bizLinkText : "Small &amp; Medum Business";

                            if (countries[country].hasCOMStore == "true")
                            {
                                storeTypeText = storeCOMUrlText;
                                $("#CommercialLink").html(storeCOMUrlText).live("click", function(event){
                                    var _self = this;
									event.preventDefault();
									Adobe.StoreSelector.StoreSelectorController.prototype.createCookieOnLink(this, "COM", countries[selectedCountry]);
                                    var cookieVal = $.cookie("storeregion");
           	            			OpenAjax.hub.publish("storeselector.navigation_link_clicked", {obj: this});
                                    window.setTimeout(function(){
                                        if ((_selfObj.storeKeyword === "" && _self.cookieVal === "") || (_selfObj.storeKeyword === "" && _self.cookieVal !== ""))
                                        {
                                        	var href = $(_self).attr("href");
                                        	window.location.href = href;
                                        }
                                        if (_selfObj.storeKeyword !== "" && _self.cookieVal !== "")
                                        {
                                            window.location.href = _selfObj.productPageURL;
                                        }
                                    }, 2000, _self);
                                });
                                $("#COMStoreData").show();
                                $("#COMImgLink").wrap("<a href='" + countries[selectedCountry].COMStoreUrl + "' target='_self'/>").live("click", function(event){
                                    event.preventDefault();
                                    var _self = $(this).parent();
                                    if (countries[selectedCountry].COMCookieRequired === "true")
                                    {
                                    	$.cookie( "storeregion", countries[selectedCountry].countryCode.toLowerCase(), {path:'/', domain:'.adobe.com', expires:1} );
                                    	$.cookie( "international", countries[selectedCountry].countryCode.toLowerCase(), {path:'/', domain:'.adobe.com', expires:1} );
                                    }
                	            	OpenAjax.hub.publish("storeselector.navigation_link_clicked", {obj: this});
                                    window.setTimeout(function(){
                                        if ((_selfObj.storeKeyword === "" && _self.cookieVal === "") || (_selfObj.storeKeyword === "" && _self.cookieVal !== ""))
                                        {
                                        	var href = $(_self).attr("href");
                                        	window.location.href = href;
                                        }
                                        if (_selfObj.storeKeyword !== "" && _self.cookieVal !== "")
                                        {
                                            window.location.href = _selfObj.productPageURL;
                                        }
                                    }, 2000, _self);
                                });
                            }
                            else
                            {
	                        	$("#COMStoreData").hide();
                            }

                            if (countries[country].hasEDUStore == "true")
							{
                                storeTypeText = storeEDUUrlText;
                                $("#EduLink").html(storeEDUUrlText).live("click", function(event){
                                    var _self = this;
									event.preventDefault();
									Adobe.StoreSelector.StoreSelectorController.prototype.createCookieOnLink(this, "EDU", countries[selectedCountry]);
                                    OpenAjax.hub.publish("storeselector.navigation_link_clicked", {obj: this});
                                    window.setTimeout(function(){
                                        if ((_selfObj.storeKeyword === "" && _self.cookieVal === "") || (_selfObj.storeKeyword === "" && _self.cookieVal !== ""))
                                        {
                                        	var href = $(_self).attr("href");
                                        	window.location.href = href;
                                        }
                                        if (_selfObj.storeKeyword !== "" && _self.cookieVal !== "")
                                        {
                                            window.location.href = _selfObj.productPageURL;
                                        }
                                    }, 2000, _self);
                                });
                                $("#EDUStoreData").show();
                                $("#EDUImgLink").wrap("<a href='" + countries[selectedCountry].EDUStoreUrl + "' target='_self'/>").live("click", function(event){
                                    event.preventDefault();
			                        Adobe.Cart.Models.Cart.setMarketSegment('EDU');
                                    var _self = $(this).parent();
									if (countries[selectedCountry].countryCode === "US" || countries[selectedCountry].countryCode === "CA" || countries[selectedCountry].countryCode === "CA_FR")
                                    {
                                        if (countries[selectedCountry].EDUCookieRequired === "true")
                                        {
                                        	$.cookie( "storeregion", "edu", {path:'/', domain:'.adobe.com', expires:1} );
                                        	$.cookie( "international", countries[selectedCountry].countryCode.toLowerCase(), {path:'/', domain:'.adobe.com', expires:1} );
                                        }
                                    }
                                    else
                                    {
                                        if (countries[selectedCountry].EDUCookieRequired === "true" && countries[selectedCountry].hasCommonEDUStore === "true" && countries[selectedCountry].commonEDUCookieValue !== "")
                                        {
                                        	$.cookie( "storeregion", countries[selectedCountry].commonEDUCookieValue, {path:'/', domain:'.adobe.com', expires:1} );
                                        }
                                        else
                                        {
                                        	$.cookie( "storeregion", "edu-"+countries[selectedCountry].countryCode.toLowerCase(), {path:'/', domain:'.adobe.com', expires:1} );
                                        	$.cookie( "international", countries[selectedCountry].countryCode.toLowerCase(), {path:'/', domain:'.adobe.com', expires:1} );
                                        }
                                    }
									OpenAjax.hub.publish("storeselector.navigation_link_clicked", {obj: this});
                                    window.setTimeout(function(){
                                        if ((_selfObj.storeKeyword === "" && _self.cookieVal === "") || (_selfObj.storeKeyword === "" && _self.cookieVal !== ""))
                                        {
                                        	var href = $(_self).attr("href");
                                        	window.location.href = href;
                                        }
                                        if (_selfObj.storeKeyword !== "" && _self.cookieVal !== "")
                                        {
                                            window.location.href = _selfObj.productPageURL;
                                        }
                                    }, 2000, _self);
                                });
                            }
                            else
                            {
	                        	$("#EDUStoreData").hide();
                            }

                            if (countries[country].hasBIZStore == "true")
                            {
                                storeTypeText = storeBIZUrlText;
                                $("#BizLink").html(storeBIZUrlText).live("click", function(event){
                                    var _self = this;
									event.preventDefault();
									Adobe.StoreSelector.StoreSelectorController.prototype.createCookieOnLink(this, "BIZ", countries[selectedCountry]);
                	            	OpenAjax.hub.publish("storeselector.navigation_link_clicked", {obj: this});
                                    window.setTimeout(function(){
                                        var href = $(_self).attr("href");
                                        window.location.href = href;
                                    }, 2000, _self);
                                });
                                $("#BIZStoreData").show();
                                $("#BIZImgLink").wrap("<a href='" + countries[selectedCountry].BIZStoreUrl + "' target='_self'/>").live("click", function(event){
                                    event.preventDefault();
                                    var _self = $(this).parent();
                	            	OpenAjax.hub.publish("storeselector.navigation_link_clicked", {obj: this});
                                    window.setTimeout(function(){
                                        var href = $(_self).attr("href");
                                        window.location.href = href;
                                    }, 2000, _self);
                                });
                            }
                            else
                            {
	                        	$("#BIZStoreData").hide();
                            }
	                    }
	                }
	            },

                createCookieOnLink: function(elem, storeType, countryObj)
                {
                    var _countryCode = countryObj.countryCode.toLowerCase();
                    if (storeType === "COM")
                    {
                        if (countryObj.COMCookieRequired === "true")
                        {
                        	$.cookie( "storeregion", _countryCode, {path:'/', domain:'.adobe.com', expires:1} );
                        	$.cookie( "international", _countryCode, {path:'/', domain:'.adobe.com', expires:1} );
                        }
                       	elem.href = countryObj.COMStoreUrl;
                    }
                    else if (storeType === "EDU")
                    {
                        Adobe.Cart.Models.Cart.setMarketSegment('EDU');
                        if (_countryCode === "us" || _countryCode === "ca" || _countryCode === "ca_fr")
                        {
                            if (countryObj.EDUCookieRequired === "true")
                            {
	                        	$.cookie( "storeregion", "edu", {path:'/', domain:'.adobe.com', expires:1} );
	                        	$.cookie( "international", _countryCode, {path:'/', domain:'.adobe.com', expires:1} );
                            }
                            elem.href = countryObj.EDUStoreUrl;
                        }
                        else
                        {
                            if (countryObj.EDUCookieRequired === "true" && countryObj.hasCommonEDUStore === "true")
                            {
	                            $.cookie( "storeregion", countryObj.commonEDUCookieValue, {path:'/', domain:'.adobe.com', expires:1} );
                            }
                            else
                        	{
                            	$.cookie( "storeregion", "edu-"+_countryCode, {path:'/', domain:'.adobe.com', expires:1} );
                            	$.cookie( "international", _countryCode, {path:'/', domain:'.adobe.com', expires:1} );
                        	}
                            elem.href = countryObj.EDUStoreUrl;
                        }
                    }
                    else
                    {
                        //As per our current implementation, business store doesn't need a cookie to be set.
                        //if (countryObj.BIZCookieRequired === "true")
                        //{
                        //	$.cookie( "storeregion", null, {path:'/', expires:-1, domain:'.adobe.com'} );
                        //}
                        elem.href = countryObj.BIZStoreUrl;
                    }
                },

                updateMBoxSpecifications: function()
                {
                    var mBoxName = "storeselector",
		        		mboxID = $("div[id*="+mBoxName+"]").attr("id"),
                        mboxId = "",
				        mBoxId = $("#"+mboxID).next().next().attr("id");
					    if (mBoxId == undefined)
					    {
					    	return;
		    			}
					    var mboxSplit = mBoxId.split("mboxImported-default-"),
					        mboxLastIndex = mboxSplit[1].lastIndexOf("-"),
					        mboxName = $.trim(mboxSplit[1].substring(0, mboxLastIndex));
                    	mboxDefine(mboxID, mboxName);
                        mboxUpdate(mboxName, 'langloc=en_us');
                },

                sortDropDownListAlphabetically: function()
                {
                    var foption = $('#countriesList option:first');
                    var soptions = $('#countriesList option:not(:first)').sort(function(a, b) {
                        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                    });
                    $('#countriesList').html(soptions).prepend(foption);
                },

                mapProductUrlTokeyword: function(selectedCountry)
                {
					var productUrls = Adobe.Store.StoreSelector.storeProducUrltMappings,
                        _productUrl = '',
                        _productLandingPageUrl = '';

                    $.each(productUrls, function(key, value){
						if(key.toLowerCase() === Adobe.Store.StoreSelector.storeKeyword.toLowerCase())
                        {
                            _productUrl = Adobe.Store.StoreSelector.storeProducUrltMappings[key].productUrl;
                        }
                    });

                    var cookieValue = this.getStoreRegionCookie(),
                        isCountryFound = false;

                    if (selectedCountry !== "" && cookieValue === "")
                    {
						cookieValue = this.getMappingCountryName(selectedCountry);
                        isCountryFound = true;
                    }

                    if (this.storeKeyword !== "")
                    {
                        _productLandingPageUrl = this.constructProductLandingPageUrl(_productUrl, cookieValue, isCountryFound);
                    }
                },

                constructProductLandingPageUrl: function(productUrl, cookieValue, isCountryFound)
                {
                    var countryLocale = '',
                    	_countryCode = $.cookie("international");
	                if (cookieValue !== "")
	                {
	                    countryLocale = (isCountryFound) ? cookieValue : this.getMappingCountryName(cookieValue);
	                    if (cookieValue === "EDU" || ($.cookie("storeregion") !== null && $.cookie("storeregion").indexOf("edu") > -1))
	                    {
							if (_countryCode.toUpperCase() === "US" || _countryCode.toUpperCase() === "CA" || _countryCode.toUpperCase() === "CA_FR")
	                        {
								countryLocale = (countryLocale !== "" && countryLocale !== "en") ? ("/" + countryLocale) : "";
	                        }
	                    }
	                    this.productPageURL = ((countryLocale !== "" && countryLocale !== "en") ? ("/" + countryLocale) : "") + productUrl;
	                }
	                else
	                {
	                    this.productPageURL = productUrl;
	                }
	
	                return this.productPageURL;
                },

                getMappingCountryName: function(countryValue)
                {
                    var rtnVal = '',
                		countriesUrlCodeObj = this.countriesUrlCodeObj;

                    if (countryValue !== "" && countryValue.indexOf("-") > -1)
                    {
                    	cookieIdx = countryValue.indexOf("-"),
                    	countryValue = countryValue.substring(cookieIdx+1, countryValue.length).toUpperCase();
                    }

                    $.each(countriesUrlCodeObj, function(key, value){
                    	if (key.toLowerCase() === countryValue.toLowerCase())
                    	{
                    		rtnVal = value;
                    	}
                    });
                    return rtnVal;
                },

                navigateToProductPage: function()
                {
                    var cookieValue = this.getStoreRegionCookie(),
                    	selectedCountry = $("#countriesList").val(),
	                	countries = Adobe.Store.StoreSelector.storeSelectorCountries,
                        _countryCode = $.cookie("international");

                    if (this.storeKeyword === "" && cookieValue !== "")
                    {
                        if (cookieValue === "EDU" || $.cookie("storeregion").indexOf("edu") > -1)
                    	{
                        	if (_countryCode.toUpperCase() === "US" || _countryCode.toUpperCase() === "CA" || _countryCode.toUpperCase() === "CA_FR")
                        	{
								window.location.href = countries[_countryCode].EDUStoreUrl;
                    		}
                            else
                            {
								window.location.href = countries[selectedCountry].EDUStoreUrl;
                            }
                        }
                        else
                        {
							window.location.href = countries[selectedCountry].COMStoreUrl;
                        }
                    }
                    if (this.storeKeyword !== "" && cookieValue !== "")
                    {
                        window.location.href = this.productPageURL;
                    }
                },

                getCountryUrlMapping: function()
                {
					var countries = Adobe.Store.StoreSelector.storeSelectorCountries,
                        countriesUrlCodeArray = {};
					for (var country in countries)
                    {
                        countriesUrlCodeArray[countries[country].countryCode] = countries[country].countryURLCode;
                    }
                    this.countriesUrlCodeObj = countriesUrlCodeArray;
                },

	            "{document} ready" : function()
			 	{
	            	OpenAjax.hub.publish("storeselector.onPageSuccessfulLoad");
                    this.getCountryUrlMapping();
                    this.sortDropDownListAlphabetically();
                    this.updateCountryDropdownFromCookie();
	                $('#countriesList').live('change', this.callback("updateStoreLinks"));
                    this.mapProductUrlTokeyword($('#countriesList').val());
                    this.navigateToProductPage();
                    $('#OWTPLink').live('click', function(){
                        var _self = this;
                        window.setTimeout(function(){
                            var href = Adobe.Store.LinksText.OWTPLinkText;
                            OpenAjax.hub.publish("storeselector.onOWTPLinkClick", {obj:this});
                            window.location.href = href;
                        }, 2000, _self);
                    });
					this.updateMBoxSpecifications();
	            }
	    });
})(jQuery)