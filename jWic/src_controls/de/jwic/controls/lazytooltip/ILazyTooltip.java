package de.jwic.controls.lazytooltip;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author bogdan
 *
 */
public interface ILazyTooltip {
	/**
	 * @return The javascript class that should be used for this Lazy Tooltip
	 */
	public String getJSLabelProviderClass();
	
	/**
	 * The returned jsonObject of this method gets use in the javascript class in order to generate a tooltip message
	 * 
	 * @return A Json Object that represents the current Tooltip.
	 * 
	 * @throws JSONException
	 */
	public JSONObject getData() throws JSONException;
}
