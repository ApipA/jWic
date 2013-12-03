package de.jwic.controls.lazytooltip;

/**
 * @author bogdan
 *
 */
public interface ILazyTooltipProvider {
	/**
	 * Returns a ILazyTooltip instance created from the request params that come from the client
	 * 
	 * @param requestParams
	 * @return
	 */
	public ILazyTooltip getTooltip(String requestParams);
}
