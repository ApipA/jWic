/*
 * Copyright 2005-2010 jWic group (http://www.jwic.de)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * -------------------------------------------------------------------------
 * This file contains the scripts used by the standard controls such as
 * InputBox etc. It should be included in the basic header if those controls
 * are used (which is in most of the cases).
 */

JWic.controls = {

	/**
	 * de.jwic.controls.CheckBoxGroup
	 */
	CheckBoxGroup : {
		handleChange : function (controlId, field, element) {
			var field = JWic.$(field);
			field.val(element.checked ? element.value : "");
		} 
	},

	/**
	 * de.jwic.async.ProcessInfo
	 */
	ProcessInfo : {
		
		initialize : function(controlId, options) {
			var piProgBar = JWic.$("pi_progressbar_" + controlId);
			
			piProgBar.data("options", options);
			
			var pbOptions = {};
			if (!options.empty) {
				pbOptions.value = options.value;
			}
			piProgBar.progressbar(pbOptions);
			
			if (!options.empty || options.active) {
				JWic.controls.ProcessInfo.updateContent(controlId);
			}
		},
		
		/**
		 * Request a status update
		 */
		updateContent : function(controlId) {
	
			var piProgBar = JWic.$("pi_progressbar_" + controlId)
			if (piProgBar && !piProgBar.data("requestPending")) {
				piProgBar.data("requestPending", true);
				JWic.resourceRequest(controlId, function(ajaxResponse) {
					try {
						//JWic.log("HandleResponde: " + controlId);
						JWic.controls.ProcessInfo.handleResponse(controlId, ajaxResponse);
					} catch (x) {
						// the control was probably removed. Force a regular refresh
						JWic.fireAction('', 'refresh', '');
					}
				});
			}
		},
		
		/**
		 * Handle the response from the server and render the status.
		 */
		handleResponse : function(controlId, resp) {
			var data = jQuery.parseJSON(resp.responseText);
			var piProgBar = JWic.$("pi_progressbar_" + controlId)
			if (piProgBar) { // view container might have been removed in the meantime
				var options = piProgBar.data("options");
				if (data.monitor) {
					var m = data.monitor;
					var piLabel = JWic.$("pi_label_" + controlId);
					var piProg = JWic.$("pi_progress_" + controlId);
					var piVal = JWic.$("pi_values_" + controlId);
					if (piLabel) {
						piLabel.html(m.infoText);
					}
					if (piVal && options.showValues) {
						if (m.max != 0) {
							piVal.html(m.value + " / " + m.max);
						} else if (m.value != 0) {
							piVal.html(m.value);
						}
					}
					var total = m.max - m.min;
					if (total != 0) {
						var pos = m.value - m.min;
						var pr = pos * 100 / total;
						piProgBar.progressbar("value", Math.ceil(pr));
						if (options.showPercentage) {
							var piVal = JWic.$("pi_inmsg_" + controlId);
							piVal.html(Math.ceil(pr) + "%");
						}
					}
					
				}

				piProgBar.data("requestPending", false);
				if (data.active) {
					window.setTimeout(function(){
						JWic.controls.ProcessInfo.updateContent(controlId)
					}, 500);
				}
				if (data.globalRefresh) {
					JWic.fireAction('', 'refresh', '');
				}
			}
			
		}
	},
		
	/**
	 * de.jwic.controls.ProgressBar code
	 */
	ProgressBar : {
		autoRefresh : function(controlId, delay) {
			window.setTimeout(function(){
				JWic.controls.ProgressBar.refreshContent(controlId)
			}, delay);
		},
		refreshContent : function(controlId) {
			var ctrl = jQuery("#pb_" + JWic.util.JQryEscape(controlId));
			if (ctrl && ctrl.length > 0 && !ctrl[0].requestPending) {
				ctrl[0].requestPending = true;
				JWic.resourceRequest(controlId, function(ajaxResponse) {
					try {
						JWic.controls.ProgressBar.handleResponse(controlId, ajaxResponse);
					} catch (x) {
						// the control was probably removed. Force a regular refresh
						JWic.fireAction('', 'refresh', '');
					}
				});
			}

		},
		handleResponse : function(controlId, ajaxReponse) {
			
		}
	},
		
	/**
	 * InputBoxControl script extensions.
	 */
	NumericInputControl : {
		/**
		 * Initialize a new control.
		 */
		initialize : function(inpElm, hiddenInput, options) {
			inpElm.bind("focus", JWic.controls.NumericInputControl.focusHandler);
			inpElm.bind("blur", JWic.controls.NumericInputControl.lostFocusHandler);
			inpElm.change(JWic.controls.NumericInputControl.changeHandler);
			
			inpElm.autoNumeric('init', options); 
			inpElm.autoNumeric('set', hiddenInput.val());
			
			
			if (inpElm.attr("xListenKeyCode") != 0) {
				inpElm.bind("keyup", JWic.controls.NumericInputControl.keyHandler);
			}
			
			if (inpElm.attr("xEmptyInfoText")) {
				if(inpElm.attr("xIsEmpty") == "true" && 
					(inpElm.val() == inpElm.attr("xEmptyInfoText") || inpElm.val() == "")) {
					inpElm.addClass("x-empty");
					inpElm.val(inpElm.attr("xEmptyInfoText"));
				} else {
					inpElm.attr("xIsEmpty", "false");
					inpElm.removeClass("x-empty");
				}
			}
			
			// override the getValue() method to "fix" the serialization
			inpElm.getValue = function() {
				if (this.attr("xEmptyInfoText") && this.attr("xIsEmpty") == "true") {
					return "";
				} else {
					return this.value;
				}
			}
			
		},
		
		/**
		 * Clean up..
		 */
		destroy : function(inpElm) {
			inpElm.unbind();
		},
		
		changeHandler : function(e) {
			var elm =  jQuery(e.target);
			var elmHidden = jQuery('#'+JWic.util.JQryEscape(e.target.id + "_field"));
			var value = elm.autoNumeric('get');
			elmHidden.val(value);
		},
		
		/**
		 * Invoked when the focus is received.
		 */
		focusHandler : function(e) {
			var elm =  jQuery(e.target);
			elm.addClass("x-focus");
			
			if (elm.attr("xEmptyInfoText")) {
				if (elm.attr("xIsEmpty") == "true") {
					elm.val('');
					elm.removeClass("x-empty");
					elm.attr("xIsEmpty", "false");
				} 
			}
			
		},
		/**
		 * Invoked when the focus is lost.
		 */
		lostFocusHandler : function(e) {
			var elm =  jQuery(e.target);
			
			elm.removeClass("x-focus");
			if (elm.attr("xEmptyInfoText")) {
				if (elm.val() == "") { // still empty
					elm.addClass("x-empty");
					elm.val(elm.attr("xEmptyInfoText"));
					elm.attr("xIsEmpty", "true");
				} else {
					elm.attr("xIsEmpty", "false");
				}
			}
		},
		
		keyHandler : function(e) {
			var elm =  jQuery(e.target);
			
			if (e.keyCode == elm.attr("xListenKeyCode")) {
				JWic.fireAction(elm.attr('id'), 'keyPressed', '' + e.keyCode);
			}
		}
		
	},
	
	/**
	 * FileUpload control
	 */
	FileUpload : {
		initialize : function (self, controlId, options) {

			self = jQuery(self);
			var settings = {
				width : 250
	        };
	                    
			if(options) {
				jQuery.extend(settings, options);
			};
	                            
			var wrapper = jQuery("<div class=\"ui-widget ui-corner-all j-fileupload-button j-fileupload-selectfile\">");
			                
			var filename = jQuery('<input readonly class="ui-widget ui-widget-content j-fileupload-filename">')
			                 .addClass(self.attr("class"))
			                 .css({
			                     "width": settings.width + "px"
			                 });
			
			self.before(filename);
			self.wrap(wrapper);
			
			self.css({
			            "position": "relative",
			            "height": "25px",
			            "width": "120px",
			            "display": "inline",
			            "cursor": "pointer",
			            "opacity": "0.0"
			        });
			
			if (jQuery.browser.mozilla) {
			    if (/Win/.test(navigator.platform)) {
			    	self.css("margin-left", "-142px");                    
			    } else {
			    	self.css("margin-left", "-168px");                    
			    };
			} else {
				self.css("margin-left", "0px");                
			};
			
			self.bind("change", function() {
			    filename.val(self.val());
			});
			
		}
	},
		
	/**
	 * Window control script extensions.
	 */
	Window : {

		initialize : function(controlId, options) {
			var win = JWic.$("win_" + controlId);
			if (win) {
				var dlgOptions = {
					close : function() {JWic.controls.Window.close(controlId);},
					dragStop: function( event, ui ) {JWic.controls.Window.dragStop(controlId, ui)},
					resizeStop: function( event, ui ) {JWic.controls.Window.resizeStop(controlId, ui)}
				};
				jQuery.extend(dlgOptions, options);
				
				win.dialog(dlgOptions);
				
				if (!options.closeable) {
					win.parent().find(".ui-dialog-titlebar-close").hide(); 
				}
				if(options.maximizable) {
					this.addMaximizeToDialog(win);
					var titlebar = win.parents('.ui-dialog').find('.ui-dialog-titlebar');
					titlebar.dblclick(function(event){
						JWic.controls.Window.maximize(win);
					});			
				}
				if(options.minimizable) {
					this.addMinimizeToDialog(win);	
				}
				if (options.popup) {
					jQuery(".ui-dialog-titlebar").hide();
				}

				win.parent().appendTo(jQuery("#jwicform"));		
				win.dialog('open');	

			}
		},
		dragStop : function(controlId, ui) {
			var fldTop = JWic.$("fld_" + controlId + ".top");
			var fldLeft = JWic.$("fld_" + controlId + ".left");
			if (fldTop) { fldTop.val(ui.position.top) ;}
			if (fldLeft) { fldLeft.val(ui.position.left) ;}
			
		},
		resizeStop : function(controlId, ui) {
			var fldWidth = JWic.$("fld_" + controlId + ".width");
			var fldHeight = JWic.$("fld_" + controlId + ".height");
			if (fldWidth) { fldWidth.val(ui.size.width) ;}
			if (fldHeight) { fldHeight.val(ui.size.height) ;}
		},
		maximize : function (dialog) {
			var dialogParent = dialog.parent();
			
			dialogParent.css('overflow','hidden');
			if(jQuery.data(dialog,'isMinimized')){
				jQuery.data(dialog,'isMinimized',false);	
				dialogParent.css('width',jQuery.data(dialog,'width'));	
				dialog.show();
				dialog.css('width','auto');
				
			}
			
			if(!jQuery.data(dialog,'isMaximized')){				
				jQuery.data(dialog,'isMaximized',true);				
				jQuery.data(dialog,'originalPosition',dialogParent.offset());
				jQuery.data(dialog,'width',dialogParent.width());

				
				dialogParent.css('width',jQuery(window).width());
				dialogParent.css('height',jQuery(window).height());
				dialogParent.offset({top:0,left:0});
				dialog.parent().css('position','fixed');
				dialog.css('width','auto');
				
				
			}else{
				jQuery.data(dialog,'isMaximized',false);
				dialog.parent().css('position','absolute');
				dialogParent.offset(jQuery.data(dialog,'originalPosition'));					
				dialogParent.css('width',jQuery.data(dialog,'width'));
				dialogParent.css('height', 'auto');
				
			}
			
			dialog.trigger({type:'maximize',source:dialog})
		},
		minimize : function(dialog) {
			var dialogParent = dialog.parent();					
			dialogParent.css('overflow','hidden');
			if(jQuery.data(dialog,'isMaximized')){
				jQuery.data(dialog,'isMaximized',false);
				dialog.parent().css('position','absolute');
				dialogParent.offset(jQuery.data(dialog,'originalPosition'));
				dialogParent.css('width',jQuery.data(dialog,'width'));	
				dialogParent.css('height', 'auto');
				
			}
			
			if(!jQuery.data(dialog,'isMinimized')){
				
				jQuery.data(dialog,'isMinimized',true);
				jQuery.data(dialog,'width',dialogParent.width());					
				dialog.hide();
				
			}else{
				jQuery.data(dialog,'isMinimized',false);
				dialogParent.css('width',jQuery.data(dialog,'width'));	
				dialog.show();				
			}
		
			dialog.trigger({type:'minimize',source:dialog});
		},


		close : function(controlId) {
			JWic.fireAction(controlId, 'close', '');
		},
		
		destroy : function(controlId) {
			var win = JWic.$("win_" + controlId);
			win.dialog('destroy');
		},
		addMaximizeToDialog : function(dialog) {
			if(dialog!==undefined){
				
				dialog.bind('dialogresize',function(){
					jQuery.data(dialog,'width',dialog.parent().width());
					dialog.parent().css('height', 'auto');
					if(!dialog.is(':visible')){
						jQuery.data(dialog,'isMinimized',false);
						jQuery.data(dialog,'isMaximized',false);
						jQuery.data(dialog,'originalPosition',dialog.parent().offset());
						dialog.parent().css('width',jQuery.data(dialog,'width'));	
						dialog.show();	
						dialog.css('width','auto');
					}
				});
				
				
				var titlebar = dialog.parents('.ui-dialog').find('.ui-dialog-titlebar');			
				var maxBtn = jQuery('<a href="#" id="'+dialog.attr('id')+'_maximize" role="button" class="ui-corner-all ui-dialog-titlebar-close ui-dialog-titlebar-max"><span class="ui-icon ui-icon-newwin">maximize</span></a>')
				.appendTo(titlebar)
				.mouseover(function(){
					jQuery(this).addClass('ui-state-hover');
				})
				.mouseout(function(){
					jQuery(this).removeClass('ui-state-hover');
				})
				.click(function(){
					JWic.controls.Window.maximize(dialog);
					
				});
				return maxBtn;
				
			}
		},
		addMinimizeToDialog : function (dialog) {
			if(dialog !== undefined){
				dialog.bind('dialogresize',function(){
					jQuery.data(dialog,'width',dialog.parent().width());
					dialog.parent().css('height', 'auto');
					if(!dialog.is(':visible')){
						jQuery.data(dialog,'isMinimized',false);
						jQuery.data(dialog,'isMaximized',false);
						jQuery.data(dialog,'originalPosition',dialog.parent().offset());
						dialog.parent().css('width',jQuery.data(dialog,'width'));	
						dialog.show();	
						dialog.css('width','auto');
					}
				});
				
				var titlebar = dialog.parents('.ui-dialog').find('.ui-dialog-titlebar');
				//minimize
				var minBtn = jQuery('<a href="#" id="'+dialog.attr('id')+'_minimize" role="button" class="ui-corner-all ui-dialog-titlebar-close ui-dialog-titlebar-min"><span class="ui-icon ui-icon-minusthick">minimize</span></a>')
					.appendTo(titlebar)
					.mouseover(function(){
						jQuery(this).addClass('ui-state-hover');
					})
					.mouseout(function(){
						jQuery(this).removeClass('ui-state-hover');
					})
					.click(function() {
						JWic.controls.Window.minimize(dialog);
					});
				return minBtn;
				
			}
		},


		/* --- Old code? --- */
		updateHandler : function(controlId) {
			var win = jQuery('#'+JWic.util.JQryEscape(controlId));
			if (win) {
				// var size = win.getSize();
				var field = jQuery("#fld_" + JWic.util.JQryEscape(controlId));
				if (field) { // assume that if one field exists, the others
								// exist as well.
					field.width(win.width()); 
					field.height(win.height);
					field.offset(win.offset());
				}
			} else {
				alert("No Window with ID " + controlId);
			}
		},
		
		/**
		 * To fix the problem of overlaying SELECT (and other) elements in IE6,
		 * it moves the below IFRAME to hide the select elements.
		 */
		adjustIEBlocker : function(controlId) {
			jQuery("#win_" + JWic.util.JQryEscape(controlId)+ "_blocker");
			var blocker = jQuery("#win_" + JWic.util.JQryEscape(controlId)+ "_blocker");
			var source =jQuery("#win_" + JWic.util.JQryEscape(controlId)); // get the
																	// window
			JWic.controls.Window.adjustIEBlockerToWin(blocker, source);
		},
		/**
		 * Move the blocker below the source window.
		 */
		adjustIEBlockerToWin : function(blocker, source) {
			if (blocker && source) {
				blocker.setStyle( {
					width: source.getWidth(),
					height: source.getHeight(),
					top: source.getStyle("top"),
					left: source.getStyle("left"),
					display: 'block'
				});
				blocker.setOpacity(0.0);
			}
		}
		
	},
	
	/**
	 * de.jwic.controls.combo.Combo functions.
	 */
	Combo : {
		documentClickHander : function(){
			
		},
//		/**
//		 * Currently open combo content box.
//		 */
//		_activeComboContentBox : null,
//		
//		/** Time the box was opened/closed */
//		_openTime : 0,
//		_closeTime : 0,
//		_closeControlId : null,
//		_delayKeySearchIdx : 0,
//		_delayControlId : null,
//		_lostFocusClose : false,
		
		/**
		 * Initialize a new control.
		 */
		initialize : function(controlId, inpElm) {
			var escapedControlId = JWic.util.JQryEscape(controlId);
			var comboBox = document.getElementById(controlId);
			var iconElm = document.getElementById(controlId + "_open");

			this._activeComboContentBox = null;
			
			this._openTime = 0;
			this._closeTime = 0;
			this._closeControlId = null;
			this._delayKeySearchIdx = 0;
			this._delayControlId = null;
			this._lostFocusClose = false;
			
			comboBox.jComboField = inpElm;
			comboBox.jComboKey = document.getElementById("fld_" + controlId + ".key");
			comboBox.dataFilter = JWic.controls.Combo.StringDataFilter;
			comboBox.keyDelayTime = 100;
			
			var jInpElm = jQuery(inpElm);
			jInpElm.focus(JWic.controls.Combo.focusHandler);
			jInpElm.blur(JWic.controls.Combo.lostFocusHandler);
			jInpElm.click(JWic.controls.Combo.textClickHandler);
			jInpElm.bind('keydown',JWic.controls.Combo.textKeyPressedHandler);

			// adjust sizes
			var totalWidth = jQuery(comboBox).width();
			
			var iconWidth = 0;
			if (iconElm) {
				iconWidth = jQuery(iconElm).width();
				if (iconWidth == 0) { // assume default width
					iconWidth = 20;
				}
			}
			var inpWidth = iconElm ? (totalWidth - iconWidth - 7) : (totalWidth - 3);
			if (jQuery.browser.msie) {
				inpWidth -= 4;
			}
			jQuery(inpElm).width(inpWidth);
			
			if (jInpElm.attr("xEmptyInfoText")) {
				if(jInpElm.attr("xIsEmpty") == "true" && 
					(jInpElm.val() == jInpElm.attr("xEmptyInfoText") || inpElm.value == "")) {
					jInpElm.addClass("x-empty");
					jInpElm.val(jInpElm.attr("xEmptyInfoText"));
				} else {
					jInpElm.attr("xIsEmpty", "false");
					jInpElm.removeClass("x-empty");
				}
			}
			
			// override the getValue() method to "fix" the serialization
			inpElm.getValue = function() {
				if (jQuery(this).attr("xEmptyInfoText") && jQuery(this).attr("xIsEmpty") == "true") {
					return "";
				} else {
					return jQuery(inpElm).val();
				}
			}			
		},
		
		/**
		 * Clean up..
		 */
		destroy : function(controlId, inpElm) {
			var jInpElem = jQuery(inpElm);
			if (jQuery('#win_'+JWic.util.JQryEscape(controlId)).is(':data(dialog)')) {
				jQuery('#win_'+JWic.util.JQryEscape(controlId)).dialog('destroy');
			}
			jInpElem.unbind("focus", JWic.controls.InputBoxControl.focusHandler);
			jInpElem.unbind("blur", JWic.controls.InputBoxControl.lostFocusHandler);
			jInpElem.unbind("click", JWic.controls.Combo.textClickHandler);
			jInpElem.unbind("keydown", JWic.controls.Combo.textKeyPressedHandler);
			
			this._activeComboContentBox = null;			
			this._openTime = 0;
			this._closeTime = 0;
			this._closeControlId = null;
			this._delayKeySearchIdx = 0;
			this._delayControlId = null;
			this._lostFocusClose = false;
			
		},
		
		/**
		 * Invoked on KeyUp to handle user input.
		 */
		textKeyPressedHandler : function(e) {
			
			var ctrlId = jQuery(this).attr("j-controlId");
			if (ctrlId) {
				JWic.log("key pressed: " + e.keyCode + " --");
				var comboBox = document.getElementById(ctrlId);
				if (comboBox.multiSelect) { // behave differently if multiSelect
											// is on
					// no actions yet -- might go for scrolling etc. via
					// keyboard later on.
					return false;
				} else {
					if (e.keyCode == 13) { // enter
						JWic.controls.Combo.finishSelection(ctrlId, false);
					} else if (e.keyCode == 38 || e.keyCode == 40) {
						// scroll up/down
						var isUp = (e.keyCode == 38);
						var newSelection = -1;
						if (comboBox.selectionIdx == null) { // nothing
																// selected
							newSelection = isUp ? comboBox.visibleCount - 1 : 0;
						} else {
							newSelection = comboBox.selectionIdx + (isUp ? -1 : 1);
						}
						if (newSelection >= 0 && newSelection < comboBox.dataItems.length) {
							JWic.controls.Combo.selectRow(ctrlId, newSelection);
						}
					} else if (e.keyCode == 8 || e.keyCode >= 46) { // backspace
																	// or delete
						
						comboBox.pickFirstFinding = comboBox.autoPickFirstHit && !(e.keyCode == 8 || e.keyCode == 46);
						JWic.controls.Combo._delayKeySearchIdx++;
						var myStart = JWic.controls.Combo._delayKeySearchIdx;
						JWic.controls.Combo._delayControlId = ctrlId;
						window.setTimeout("JWic.controls.Combo.afterKeySearchStart(" + myStart + ");", comboBox.keyDelayTime);
						
					}else if(e.keyCode === 27){ // ESC to close the box
						JWic.controls.Combo.closeActiveContentBox();
					}
				}
			}
		},
		
		afterKeySearchStart : function(triggeredIndex) {
			if (triggeredIndex == JWic.controls.Combo._delayKeySearchIdx && JWic.controls.Combo._delayControlId != null) {
				var ctrlId = JWic.controls.Combo._delayControlId;
				var comboBox = document.getElementById(ctrlId);
				
				JWic.controls.Combo._delayControlId = null; // clear
				
				JWic.log("dataFilterValue set to " + comboBox.dataFilterValue);
				comboBox.dataFilterValue = comboBox.jComboField.value;
				comboBox.applyFilter = true;
				if (comboBox.dataFilterValue.length >= comboBox.minSearchKeyLength) {
					if (JWic.controls.Combo._activeComboContentBox != ctrlId) {
						if (comboBox.loadCompleted) {
							comboBox.dataLoader.prepareData(ctrlId);
						}
						
						JWic.controls.Combo.openContentBox(ctrlId);
						comboBox.jComboField.focus();
					
					} else {
						if (comboBox.loadCompleted) {
							comboBox.dataLoader.prepareData(ctrlId);
							comboBox.contentRenderer.renderData(ctrlId);
						} else {
							if (comboBox.dataLoader) {
								comboBox.dataLoader.initializeData(ctrlId);
							}
						}
					}
				}
			} else {
				JWic.log("Invalid triggerIndex - repeative event: "+ triggeredIndex + " - expected: " + JWic.controls.Combo._delayKeySearchIdx);
			}
		},

		/**
		 * Called when selecting a row via keyboard.
		 */
		selectRow : function(ctrlId, newSelection) {
			JWic.log("selectRow: " + newSelection);
			var comboBox = document.getElementById(ctrlId);
			if (newSelection >= 0 && newSelection < comboBox.dataItems.length) {
				var newItem = comboBox.dataItems[newSelection];
				comboBox.contentRenderer.updateSelection(ctrlId, newSelection);
				comboBox.selectionIdx = newSelection;
				// remember the highlighted element
				var winId = "j-combo_contentBox";
				var win = jQuery("#"+winId);
				if (win) {
					// don't select the item, just highlight it.
					comboBox.suggestedObject = newItem;					
				} else {
					// select the item
					JWic.controls.Combo.selectElement(ctrlId, newItem.title, newItem.key, false);
				}
				
			}
		},
		
		/**
		 * Called to submit a keyboard selection via enter press.
		 */
		finishSelection : function (ctrlId, noSelection) {
			JWic.log("finished Selection");
			var comboBox =document.getElementById(ctrlId);
			var fld = comboBox.jComboField;

			var changed = false;
			if (comboBox && comboBox.suggestedObject) {
				// submit the highlighted element
				changed = JWic.controls.Combo.selectElement(ctrlId, comboBox.suggestedObject.title, comboBox.suggestedObject.key, noSelection);
				comboBox.suggestedObject = null;
				
			} else if ((fld.value == "" || (jQuery(fld).attr("xEmptyInfoText") != null && jQuery(fld).attr("xIsEmpty") == "true")) && comboBox.jComboKey.value != "") {
				JWic.log("clear values");
				changed = JWic.controls.Combo.selectElement(ctrlId, "", "", noSelection);
			}
			if (changed && JWic.controls.Combo._lostFocusClose ) {
				JWic.controls.Combo.closeActiveContentBox();
			}
			comboBox.applyFilter = false; // clear filter
			comboBox.dataLoader.prepareData(ctrlId);

		},
		
		/**
		 * Invoked on the first match that is found by the renderer during a
		 * filtered rendering.
		 */
		searchSuggestion : function(comboElm, obj) {
			comboElm.suggestedObject = obj;
			if (obj == null) {
				JWic.log("SearchSuggestion : NULL Object");
				if (!comboElm.allowFreeText) {
					jQuery(comboElm).addClass("x-error");
					comboElm.jComboKey.value = "";
				}
			} else {
				JWic.log("SearchSuggestion : obj.key=" + obj.key);
				jQuery(comboElm).removeClass("x-error");
				comboElm.jComboField.value = obj.title;				
				comboElm.jComboField.focus();
				//comboElm.jComboField.select();
				 if(typeof comboElm.jComboField.selectionStart != 'undefined') {
					 comboElm.jComboField.selectionStart = comboElm.dataFilterValue.length;
				 }

			}
			 comboElm.pickFirstFinding = false;

		},
		
		/**
		 * Invoked when the user clicks into the textbox.
		 */
		textClickHandler : function(e) {
			JWic.log("textClickHandler: Use clicked on textbox.");
			var ctrlId = jQuery(this).attr("j-controlId");
			if (ctrlId) {
				var box = document.getElementById(ctrlId);
				if (box && box.openContentOnTextFocus && ctrlId != JWic.controls.Combo._activeComboContentBox) {
					JWic.controls.Combo.openContentBox(ctrlId);
				}
			}
		},
		
		/**
		 * Invoked when the focus is received.
		 */
		focusHandler : function(e) {
			var ctrlId = jQuery(this).attr("j-controlId");
			if (ctrlId) {
				JWic.log("focusHandler: received Focus");
				var box = document.getElementById(ctrlId);
				if (box) {
					jQuery(box).addClass("x-focus");
					if (box.openContentOnTextFocus && ctrlId != JWic.controls.Combo._activeComboContentBox) {
						JWic.controls.Combo.openContentBox(ctrlId);
					}

						
				}
			}
			if (jQuery(this).attr("xEmptyInfoText")) {
				if (jQuery(this).attr("xIsEmpty") == "true") {
					this.value = "";
					jQuery(this).removeClass("x-empty");
				} 
			}
		},
		/**
		 * Invoked when the focus is lost.
		 */
		lostFocusHandler : function() {
			JWic.log("Combo.lostFocusHandler");
			var ctrlId = jQuery(this).attr("j-controlId");
			if (ctrlId) {
				var box = document.getElementById(ctrlId);
				if (box) {
					jQuery(box).removeClass("x-focus");
					box.applyFilter = false;
					// delay lostFocusCheck in case it was due to a selection
					// click.
					JWic.controls.Combo._lostFocusClose = true;
					// window.setTimeout("JWic.controls.Combo.finishSelection('"
					// + ctrlId + "', true);", 300);
				}
			}
			if (jQuery(this).attr("xEmptyInfoText")) {
				if (this.value == "") { // still empty
					jQuery(this).addClass("x-empty");
					this.value = jQuery(this).attr("xEmptyInfoText");
					jQuery(this).attr("xIsEmpty", "true");
				} else {
					jQuery(this).attr("xIsEmpty", "false");
				}
			}
		},
		/**
		 * Open the content window..
		 */
		openContentBox : function(controlId) {
			JWic.log("openContentBox "+JWic.controls.Combo._activeComboContentBox);
			if (JWic.controls.Combo._activeComboContentBox) {
				if (JWic.controls.Combo._activeComboContentBox == controlId) {
					//JWic.controls.Combo.closeActiveContentBox();
					return; // do not re-open it.
				} else {
					JWic.controls.Combo.closeActiveContentBox();
				}
			}else{
				JWic.controls.Combo._activeComboContentBox = controlId;
			}

			if (JWic.controls.Combo._closeControlId == controlId) {
				var age = new Date().getTime() - JWic.controls.Combo._closeTime;
				if (age < 100) {
					return; // prevent re-open on immidiate re-focus event.
				}
			}
			
			var comboBox = document.getElementById(controlId);
			var winId = "j-combo_contentBox";
			
			var boxWidth = jQuery(comboBox).width();
			var comboBoxWin = jQuery("#win_" + JWic.util.JQryEscape(controlId));			
			if (!comboBoxWin.is(':data(dialog)')) {

				comboBoxWin.dialog({					
					dialogClass : "j-combo-content",
					resizable: false,
					height: 200,
					width: boxWidth - 3,
					autoOpen:false,
					position:{
						my:'top',
						at:'bottom',
						of:jQuery(comboBox)
					}
				});
				comboBoxWin.parent().appendTo(jQuery("#jwicform"));	
				jQuery(".ui-dialog-titlebar").hide();
			}			
				/*
				 * Haven't included resize and move event, when switching to
				 * jQuery.
				 * 
				 * onResize : JWic.controls.Combo.resizeHandler, onMove :
				 * JWic.controls.Combo.moveHandler
				 */
			
			if (comboBox.adjustIEBlockerId) {
				JWic.controls.Window.adjustIEBlockerToWin(document.getElementById(comboBox.adjustIEBlockerId), document.getElementById(winId));		
			}
			
			JWic.controls.Combo._openTime = new Date().getTime();
			JWic.controls.Combo._activeComboContentBox = controlId;
			jQuery(document).bind("click", JWic.controls.Combo.closeBoxDocumentHandler);
			if (comboBox.loadCompleted) {
				comboBox.contentRenderer.renderData(controlId);
			} else {
				if (comboBox.dataLoader) {
					comboBox.dataLoader.initializeData(controlId);
				} else {
					alert("DataLoader is not specified/found");
				}
			}
			
			comboBoxWin.dialog('open');
		},
		/**
		 * Invoked when the box is resized.
		 */
		resizeHandler : function(e) {			
			if (JWic.controls.Combo._activeComboContentBox) {
				var comboBox = document.getElementById(JWic.controls.Combo._activeComboContentBox);
				if (comboBox.adjustIEBlockerId) {
					JWic.controls.Window.adjustIEBlockerToWin(document.getElementById(comboBox.adjustIEBlockerId), jQuery("#j-combo_contentBox").get(0));	
				}
			}
		},
		/**
		 * Invoked when the box is mvoed.
		 */
		moveHandler : function(e) {
			if (JWic.controls.Combo._activeComboContentBox) {
				var comboBox = document.getElementById(JWic.controls.Combo._activeComboContentBox);
				if (comboBox.adjustIEBlockerId) {
					JWic.controls.Window.adjustIEBlockerToWin(document.getElementById(comboBox.adjustIEBlockerId), jQuery("#j-combo_contentBox").get(0));	
				}
			}
		},
		
		/**
		 * Close active window.
		 */
		closeActiveContentBox : function() {
			if (JWic.controls.Combo._activeComboContentBox) {
				JWic.log("closing ActiveContentBox");
				var comboBox = jQuery("#"+JWic.util.JQryEscape(JWic.controls.Combo._activeComboContentBox));
				var comboBoxWin = jQuery("#win_"+JWic.util.JQryEscape(JWic.controls.Combo._activeComboContentBox));
				comboBoxWin.dialog("close");
				if (comboBox && comboBox.adjustIEBlockerId) {
					jQuery("#"+JWic.util.JQryEscape(comboBox.adjustIEBlockerId)).css("display","none");		
				}
				// comboBox.applyFilter = false; // clear filter
				// comboBox.dataLoader.prepareData(ctrlId);
				JWic.controls.Combo._closeTime = new Date().getTime();
				JWic.controls.Combo._closeControlId = JWic.controls.Combo._activeComboContentBox; 

				JWic.controls.Combo._activeComboContentBox = null;
				jQuery(document).unbind("click", JWic.controls.Combo.closeBoxDocumentHandler);
			}
		},
		
		/**
		 * Listens to click events on the document.
		 */
		closeBoxDocumentHandler : function(e) {
			if (JWic.controls.Combo._activeComboContentBox) {
				var tpl = jQuery(e.target).closest(".j-combo_contentBox");
				// var tpl = e.findElement("#j-combo_contentBox");
				if (tpl.length == 0) { // user clicked outside the content box -> close it.
					// JWic.log("Clicked outside of combo box");
					var age = new Date().getTime() - JWic.controls.Combo._openTime;
					if (age > 300) { // to avoid miss-clicks, ignore 300ms
						JWic.log("Closing ContentBox to do outside click..");
						JWic.controls.Combo.closeActiveContentBox();
					}
				} else {
					// JWic.log("Clicked inside of combo box.");
					JWic.controls.Combo._lostFocusClose = false;
				}
			}
		},
		
		/**
		 * Make a selection. Toggles selection if combo box is in multi select
		 * mode.
		 */
		selectElement: function(controlId, title, key, noSelection, keepBoxOpen) {
			var comboBox = document.getElementById(controlId);
			
			if (comboBox) {
				comboBox.suggestedObject = null;
				jQuery(comboBox).removeClass("x-error");
				var changed = false;
				if (comboBox.multiSelect) {
				
					if (jQuery(comboBox.jComboField).val().length <1) {
						jQuery(comboBox.jComboField).val("");
						jQuery(comboBox.jComboKey).val("");
					}
					if (!JWic.controls.Combo.isSelected(comboBox, key)) {
						// add to selection;;
						var sep = "";
						if (jQuery(comboBox.jComboKey).val().length > 0) {
							sep = ";"
						}
						jQuery(comboBox.jComboField).val(jQuery(comboBox.jComboField).val() + sep + title);
						jQuery(comboBox.jComboKey).val(jQuery(comboBox.jComboKey).val() + sep + key);
					} else {
						// remove selected
						jQuery(comboBox.jComboField).val(JWic.util.removeElement(jQuery(comboBox.jComboField).val(), title));
						jQuery(comboBox.jComboKey).val(JWic.util.removeElement(jQuery(comboBox.jComboKey).val(), key));
					}
					changed = true;
				} else {
					comboBox.jComboField.value = title;
					if (comboBox.jComboKey.value != key) {
						comboBox.jComboKey.value = key;
						changed = true;
					}
				}
				if (jQuery(comboBox.jComboField).attr("xEmptyInfoText")) {
					if (comboBox.jComboKey.value != "") {
						jQuery(comboBox.jComboField).attr("xIsEmpty", "false");
						jQuery(comboBox.jComboField).removeClass("x-empty");
					} else {
						jQuery(comboBox.jComboField).attr("xIsEmpty", "true");
						jQuery(comboBox.jComboField).addClass("x-empty");
						comboBox.jComboField.value = jQuery(comboBox.jComboField).attr("xEmptyInfoText");
					}
				}
				if (!noSelection) {					
					comboBox.jComboField.select();
				}
				if (!comboBox.multiSelect) {
					JWic.controls.Combo.closeActiveContentBox();
				}
				if (comboBox.changeNotification && changed) {
					JWic.fireAction(controlId, 'elementSelected', key);
				}
				return changed;
			}
			return false;
		},
		
		/**
		 * Checks if the specified key is selected.
		 */
		isSelected: function(combo, key) {
			var comboBox = combo;
			if (comboBox && jQuery(comboBox.jComboKey).val() != "") {
				var keys = jQuery(comboBox.jComboKey).val().split(";");
				for (var a = 0; a < keys.length; a++) {
					if (keys[a] == key) {
						return true;
					}
				}
			}
			return false;
		},
		
		/**
		 * Loads the data from the control.
		 */
		BeanLoader : {
			_requestIndexCall : 0,
			initializeData : function(controlId) {
			JWic.log("BeanLoader.initializeData(..)");
			var comboBoxWin = jQuery("#win_" + JWic.util.JQryEscape(controlId));
				if (comboBoxWin) {
					comboBoxWin.text("Loading...");
					var comboBox = document.getElementById(controlId);
					var param = {};
					param["action"] = "load";
					if (comboBox.applyFilter && comboBox.dataFilterValue) {
						param["filter"] = comboBox.dataFilterValue;
					}
					JWic.controls.Combo.BeanLoader._requestIndexCall++;
					var myIndex = JWic.controls.Combo.BeanLoader._requestIndexCall 
					JWic.resourceRequest(controlId, function(ajaxResponse) {
						try {
							JWic.log("request answer: " + myIndex);
							if (myIndex == JWic.controls.Combo.BeanLoader._requestIndexCall) {
								JWic.controls.Combo.BeanLoader._handleResponse(ajaxResponse);
							} else {
								JWic.log("Ignored AjaxResponse due to invalid request index."); // DEBUG
							}
						} catch (x) {
							alert(x);
						}
					}, param);
				}
			},
			
			/**
			 * Invoked before rendering - used to apply filters, etc..
			 */
			prepareData : function(controlId) {
				JWic.log("BeanLoader.prepareData(..)");
				var comboBox = document.getElementById(controlId);
				if (comboBox.dataStore) {
					comboBox.dataItems = new Array();
					if (comboBox.clientSideFilter) {
						jQuery(comboBox.dataStore).each(function(i,obj) {
							var title = obj.title;
							if (!comboBox.applyFilter || (comboBox.dataFilter && comboBox.dataFilter.match(comboBox, obj))) {
								comboBox.dataItems.push(obj);
							}
						});
					} else {
						comboBox.dataItems = comboBox.dataStore;
					}
				}
			},
			
			_handleResponse : function(ajaxResponse) {
				JWic.log("BeanLoader._handleResponse(..)");
				var response = jQuery.parseJSON(ajaxResponse.responseText);
				if (response.controlId && response.controlId == JWic.controls.Combo._activeComboContentBox) {
					var comboBoxWin = jQuery("#win_" + JWic.util.JQryEscape(response.controlId));
					if (comboBoxWin) {
						var comboBox = document.getElementById(response.controlId);
						comboBox.dataStore = [];
						jQuery.each(response.data, function(key, value) {
							comboBox.dataStore.push(value);
						});
						JWic.controls.Combo.BeanLoader.prepareData(response.controlId);
						comboBox.loadCompleted = comboBox.cacheData; // only
																		// set
																		// load
																		// to
																		// complete
																		// if
																		// cacheData
																		// behavior
																		// is on
						comboBox.contentRenderer.renderData(response.controlId);
					}
				}
			}
		},
		
		ComboElementLabelProvider : {
			getLabel : function(obj) {
				return obj.title;
			}
		},
		/**
		 * Render IComboElement controls as a list.
		 */
		ComboElementListRenderer : {
			renderData : function(controlId) {
				JWic.log("ComboElementListRenderer.renderData(..)");
				var comboBox = document.getElementById(controlId);
				var comboBoxWin = jQuery("#win_" + JWic.util.JQryEscape(controlId));
				if (comboBoxWin && controlId == JWic.controls.Combo._activeComboContentBox) {
					// in case the content is re-drawn, we remove any
					// pre-existing listeners...
					jQuery(comboBoxWin).unbind("mouseover", JWic.controls.Combo.ComboElementListRenderer.mouseOverHandler)
					jQuery(comboBoxWin).unbind("mouseout", JWic.controls.Combo.ComboElementListRenderer.mouseOutHandler)
					var code = "";
					var idx = 0;
					var first = true;
					var currentKey = comboBox.jComboKey.value;
					comboBox.selectionIdx = null;
					jQuery(comboBox.dataItems).each(function(i,obj) {
						var content = comboBox.labelProvider.getLabel(obj);
						var extraClasses = "";
						if (comboBox.pickFirstFinding && first) {
							extraClasses += " selected";
							JWic.controls.Combo.searchSuggestion(comboBox, obj);
							comboBox.selectionIdx = 0;
						} else if (!comboBox.pickFirstFinding && currentKey == obj.key) {
							extraClasses += " selected";
							comboBox.selectionIdx = idx;
						}
						if (first) {
							first = false;
						}
						var imgSrc = comboBox.defaultImage;
						if (obj.image) {
							imgSrc = obj.image;
						}
						if (imgSrc) {
							content = imgSrc.imgTag + content; // "<IMG src=\""
																// + imgSrc +
																// "\"
																// border=\"0\"
																// align=\"absmiddle\"/>"
																// + content;
						}
						var action = "JWic.controls.Combo.ComboElementListRenderer.handleSelection('" + controlId + "', '" + obj.key + "');";
						
						code += '<div comboElement="' + idx + '" onClick="' + action + 'return false;" class="j-combo_element ' + extraClasses + '">';
						if (comboBox.multiSelect) {
							code += "<input ";
							if (JWic.controls.Combo.isSelected(comboBox, obj.key)) {
								code += "checked";
							}
							code += " id='cbc_" + controlId + "." + idx + "' type=\"checkbox\" class=\"j-combo-chkbox\" onClick=\"" + action + "\"/>";
						}
						code += content;
						code += '</div>';
						
						idx++;
					});
					comboBox.visibleCount = idx;
					if (first && comboBox.pickFirstFinding) { // no entry was
																// found at all
						JWic.controls.Combo.searchSuggestion(comboBox, null);
					}
					jQuery(comboBoxWin).html(code);
					jQuery(comboBoxWin).bind("mouseover", JWic.controls.Combo.ComboElementListRenderer.mouseOverHandler);
					jQuery(comboBoxWin).bind("mouseout", JWic.controls.Combo.ComboElementListRenderer.mouseOutHandler);
				}
			},
			
			/**
			 * Update selection entry by index..
			 */
			updateSelection : function(ctrlId, newSelection) {
				var comboBox = document.getElementById(ctrlId);
				var comboBoxWin = jQuery("#win_" + JWic.util.JQryEscape(ctrlId));
				if (comboBoxWin && ctrlId == JWic.controls.Combo._activeComboContentBox) {
					// clear selection
					jQuery(comboBoxWin).find("div[comboElement].selected").each(function(i,obj) {
						jQuery(obj).removeClass("selected");
					});
		
					var height = jQuery(comboBoxWin).height();
					var boxScrollTop = comboBoxWin.scrollTop();
					jQuery(comboBoxWin).find("div[comboElement=" + newSelection + "]").each(function(i,obj) {
						obj=jQuery(obj);
						obj.addClass("selected");
						jQuery(comboBoxWin).scrollTop(boxScrollTop+obj.position().top);
					});
				}				
			},
			
			/**
			 * Handle mouse over on content box.
			 */
			mouseOverHandler : function(e) {
				var elm = jQuery(e.target).closest("div[comboElement]");				
				if (elm) {
					elm.addClass("hover");
				}
			},
			/**
			 * Handle mouse out on content box.
			 */
			mouseOutHandler : function(e) {
				var elm = jQuery(e.target).closest("div[comboElement]");
				if (elm) {
					elm.removeClass("hover");
				}
				
			},
			/**
			 * Handle the selection by key.
			 */
			handleSelection : function(controlId, key) {
				// find the element by key
				var comboBox = document.getElementById(controlId);
				var title = key;
				var isSelected = JWic.controls.Combo.isSelected(comboBox, key);
				for (var index = 0, len = comboBox.dataStore.length; index < len; ++index) {
					var item = comboBox.dataStore[index];
					if (item.key == key) {
						title = item.title;
						var cbc = document.getElementById("cbc_" + controlId + "." + index);
						
						if (comboBox.multiSelect && cbc) {
							jQuery(cbc).attr('checked',!isSelected);
						}
						break;
					}
				}
				comboBox.suggestedElement = null;
				var keepComboOpen = comboBox.multiSelect; 
				JWic.controls.Combo.selectElement(controlId, title, key, comboBox.multiSelect);
				JWic.log("Combo: handleSelection(" + controlId + ", '" + key + "') -> title: " + title);
			}
		
		},
		
		/**
		 * Default data filter.
		 */
		StringDataFilter : {
			match : function(comboBox, object) {
				if (comboBox.dataFilterValue) {
					var value = comboBox.dataFilterValue.toLowerCase();
					var objTitle = jQuery.trim(object.title).toLowerCase();
					return objTitle.substring(0,value.length)===value;
				}
				return true;
			}
		}


	},
	
	/*
	 * de.jwic.controls.Button control
	 */
	Button : {
		initialize : function(btnElement, ctrlId, options) {
			JWic.log("Initializing new button " + btnElement);
			var btOpt = {};
			if (options.menu) {
				btOpt = {
					icons: {
						secondary: "ui-icon-triangle-1-s"
					}
				}
				btnElement.data("menuId", options.menu);
			}
			btnElement
				.button(btOpt)
				.click(JWic.controls.Button.clickHandler);
			btnElement.data("controlId", ctrlId);
			
		},

		clickHandler : function(e) {
			e.stopPropagation();
			var elm = jQuery(e.currentTarget);
			
			var menuId = elm.data("menuId");
			if (menuId) {
				JWic.controls.Menu.show(menuId, {
					 my: "left top",
					 at: "left bottom",
					 of: elm
				});
			} else {
				var ctrlId = elm.data("controlId");
				var msg = elm.attr("_confirmMsg");
				if (msg && msg != "") {
					if (!confirm(msg)) {
						return false;
					}
				}
				JWic.fireAction(ctrlId, 'click', '');
			}	
		}
	},
	
	/**
	 * InputBoxControl script extensions.
	 */
	InputBoxControl : {
		/**
		 * Initialize a new control.
		 */
		initialize : function(inpElm) {
			inpElm.bind("focus", JWic.controls.InputBoxControl.focusHandler);
			inpElm.bind("blur", JWic.controls.InputBoxControl.lostFocusHandler);
			
			if (inpElm.attr("xListenKeyCode") != 0) {
				inpElm.bind("keyup", JWic.controls.InputBoxControl.keyHandler);
			}
			
			if (inpElm.attr("xEmptyInfoText")) {
				if(inpElm.attr("xIsEmpty") == "true" && 
					(inpElm.val() == inpElm.attr("xEmptyInfoText") || inpElm.val() == "")) {
					inpElm.addClass("x-empty");
					inpElm.val(inpElm.attr("xEmptyInfoText"));
				} else {
					inpElm.attr("xIsEmpty", "false");
					inpElm.removeClass("x-empty");
				}
			}
			
			// override the getValue() method to "fix" the serialization
			inpElm.getValue = function() {
					return inpElm.value;
			}
			
		},
		
		/**
		 * Clean up..
		 */
		destroy : function(inpElm) {
			inpElm.unbind("focus", JWic.controls.InputBoxControl.focusHandler);
			inpElm.unbind("blur", JWic.controls.InputBoxControl.lostFocusHandler);
			
			if (inpElm.attr("xListenKeyCode") != 0) {
				inpElm.unbind("keyup", JWic.controls.InputBoxControl.keyHandler);
			}
		},
		
		/**
		 * Invoked when the focus is received.
		 */
		focusHandler : function(e) {
			var elm =  jQuery(e.target);
			elm.addClass("x-focus");
			
			if (elm.attr("xEmptyInfoText")) {
				if (elm.attr("xIsEmpty") == "true") {
					elm.val('');
					elm.removeClass("x-empty");
					elm.attr("xIsEmpty", "false");
				} 
			}
			
		},
		/**
		 * Invoked when the focus is lost.
		 */
		lostFocusHandler : function(e) {
			var elm =  jQuery(e.target);
			
			elm.removeClass("x-focus");
			if (elm.attr("xEmptyInfoText")) {
				if (elm.val() == "") { // still empty
					elm.addClass("x-empty");
					elm.val(elm.attr("xEmptyInfoText"));
					elm.attr("xIsEmpty", "true");
				} else {
					elm.attr("xIsEmpty", "false");
				}
			}
		},
		
		keyHandler : function(e) {
			var elm =  jQuery(e.target);
			
			if (e.keyCode == elm.attr("xListenKeyCode")) {
				JWic.fireAction(elm.attr('id'), 'keyPressed', '' + e.keyCode);
			}
		}
		
	},

	/**
	 * de.jwic.controls.basics.TabStrip control functions. 
	 */
	TabStrip : {
			internalActivate : false,
			
			initialize : function(tabStrip, ctrlId, activeIndex) {
				JWic.log(activeIndex);
				tabStrip.tabs({
					beforeActivate : JWic.controls.TabStrip.activateHandler,
					active : activeIndex
				});
			},
			
			activateHandler : function (event, ui) {
				if (JWic.controls.TabStrip.internalActivate) {
					return;
				}
				if (ui.newPanel) {
					var tabStripId = ui.newPanel.attr("jwicTabStripId");
					var tabName = ui.newPanel.attr("jwicTabName");
					var oldTabName = ui.oldPanel.attr("jwicTabName");
					var oldH = ui.oldPanel.height();
					
					// find index of new panel
					var widget = JWic.$(tabStripId).tabs("widget");
					var newPanelIdx = -1;
					var tabs = widget.find("div.ui-tabs-panel");
					JWic.log(tabs);
					var count = 0;
					for (var i = 0; i < tabs.length; i++) {
						if (jQuery(tabs[i]).attr("jwicTabStripId") == tabStripId) {
							if (jQuery(tabs[i]).attr("jwicTabName") == tabName) {
								newPanelIdx = count;
								break;
							}
							count++;
						}
					}
					
					JWic.fireAction(tabStripId, "activateTab", tabName, function() {
						ui.oldPanel.html("<span id=\"ctrl_" + tabStripId + "." + oldTabName + "\"><div style=\"height: " + oldH + "px;\"></div></span>");
						JWic.controls.TabStrip.activate(tabStripId, newPanelIdx);
					});
					
					event.preventDefault();
				}
			},
			activate : function(controlId, panelIdx) {
				var tabStrip = JWic.$(controlId);
				JWic.controls.TabStrip.internalActivate = true;
				tabStrip.tabs("option", "active", panelIdx );
				tabStrip.tabs("refresh");
				JWic.controls.TabStrip.internalActivate = false;
			}
	},
	
	/**
	 * de.jwic.controls.Menu
	 */
	Menu : {
		initialize : function(controlId, options) {
			var menu =  JWic.$(controlId);
			if (options.hidden) {
				// move the menu to the body to make sure it can "float" properly
				menu.css("position", "absolute");
				menu.data("oldParent", menu.parent().parent());
				jQuery("body").append(menu.parent());
			}
			menu.menu();
			
			if (!options.hidden) {
				menu.show();
			}
		},
		show : function(controlId, position) {
			var menu = JWic.$(controlId);
			if (!menu) {
				alert("The menu with the id '" + controlId + "' does not exist in the DOM. Was it placed as a control anywhere on the page?");
			} else {
				menu.show().position(position);
				 jQuery( document ).one("click", function() {
					 menu.hide();
				 });
			}
		},
		destroy : function(controlId) {
			var menu = JWic.$(controlId);
			menu.menu("destroy");
			// move the item back to its old parent before destroying it.
			menu.data("oldParent").append(menu.parent());
		}
	},

	/**
	 * de.jwic.controls.basics.Accordion control functions. 
	 */
	Accordion : {
			initialize : function(accordion, ctrlId, options) {
				accordion.accordion(options);
				accordion.accordion("option", "activate", JWic.controls.Accordion.activateHandler);
			},
			
			activateHandler : function (event, ui) {
				
				var elm =  jQuery(event.target);
				var accordionId = elm.accordion("option", "active");
				JWic.fireAction(elm.attr('id'), "activeAccordion", accordionId);
			},
			activate : function(controlId, panelIdx) {
				var accordion = jQuery("#" + JWic.util.JQryEscape(controlId));
				accordion.accordion("option", "active", panelIdx );
			},
			disabled : function(controlId, disable) {
				var accordion = jQuery("#" + JWic.util.JQryEscape(controlId));
				accordion.accordion("option", "disabled", disable );
			}
	},
	
	/**
	 * de.jwic.controls.coledit.ColumnSelector
	 */
	ColumnSelector : {
		initialize : function(controlId, options) {
			
			var sorts = JWic.$('lst_' + controlId);
			if (options.hideDescription) {
				sorts.find(".j-colRow").tooltip({position: { my: "left+15 center", at: "right center" }});
			}
			
			sorts.sortable({
				axis : 'y',
				update : function() {
					var fld =document.getElementById('rowOrder_' + controlId);
					if (fld) {
						var s = "";
						JWic.$('lst_' + controlId).find('div.j-colRow').each(function(i,item) {
							s += jQuery(item).attr("jColId") + ";";
						});
						fld.value = s;
						if(options.immediateUpdate) {
							JWic.fireAction('$control.controlID', 'orderUpdated', '');
						}
					}
				},
				scroll : true
				
			});
			sorts.sortable("enable");
			
			var filterField = JWic.$('search_' + controlId);
			filterField.on("keyup", function(e) {JWic.controls.ColumnSelector.applyFilter(controlId)});
			
			var clearFilter = JWic.$("cse_" + controlId);
			clearFilter.on("click", function(e) {JWic.controls.ColumnSelector.clearFilter(controlId)});
			clearFilter.tooltip();
			this.applyFilter(controlId); 
		}, 
		
		clearFilter : function(controlId) {
			JWic.$('search_' + controlId).val("");
			this.applyFilter(controlId);
		},
		
		applyFilter : function(controlId) {
			var filterField = JWic.$('search_' + controlId);
			var val = jQuery.trim(filterField.val()).toLowerCase();
			var clearFilter = JWic.$("cse_" + controlId);
			if (val.length != 0) {
				clearFilter.find(".j-listColSel-clearSearch").show();
			} else {
				clearFilter.find(".j-listColSel-clearSearch").hide();
			}
			
			JWic.$('lst_' + controlId).find('div.j-colRow').each(function(i,item) {
				var row = jQuery(item);
				if (val.length == 0) {
					row.show();
				} else {
					var title = row.attr("jColName");
					if (!title || title.toLowerCase().indexOf(val) == -1) {
						row.hide();
					} else {
						row.show();
					}
				}
			});
		},
		
		destroy : function(controlId) {
			var sorts = JWic.$('lst_' + controlId);
			if (sorts) {
				sorts.sortable("destroy");
			}
		}
	}
}

