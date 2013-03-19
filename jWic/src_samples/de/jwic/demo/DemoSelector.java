/**
 * 
 */
package de.jwic.demo;

import java.util.List;

import de.jwic.base.Control;
import de.jwic.base.IControlContainer;
import de.jwic.base.JavaScriptSupport;

/**
 * @author lippisch
 *
 */
@JavaScriptSupport
public class DemoSelector extends Control {

	
	private DemoModel model;

	/**
	 * @param container
	 * @param name
	 */
	public DemoSelector(IControlContainer container, String name, DemoModel model) {
		super(container, name);
		this.model = model;
	}

	/**
	 * @return the modules
	 */
	public List<DemoModule> getModules() {
		return model.getModules();
	}

	/**
	 * This action handler is invoked by clicking on a module.
	 * @param idx
	 */
	public void actionSelection(String idx) {
		int num = Integer.parseInt(idx) - 1;
		DemoModule module = model.getModules().get(num);
		model.setActiveModule(module);
		
	}
	
	
}
