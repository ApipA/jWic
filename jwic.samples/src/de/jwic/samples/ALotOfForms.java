package de.jwic.samples;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import de.jwic.base.ControlContainer;
import de.jwic.base.IControlContainer;
import de.jwic.base.JavaScriptSupport;
import de.jwic.controls.InputBoxControl;

@JavaScriptSupport
public class ALotOfForms extends ControlContainer {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(ALotOfForms.class);
	
	public ALotOfForms(IControlContainer container) {
		super(container);
		init();
	}

	public ALotOfForms(IControlContainer container, String name) {
		super(container, name);
		init();
	}

	private void init() {
		final List<InputBoxControl> boxes = new ArrayList<InputBoxControl>();
		

		for (int i = 0; i < 50; i++) {
			InputBoxControl inp = new InputBoxControl(this, "box" + i);
			boxes.add(inp);
			inp.setText("Some Text " + i);
		}

	}
	
	private long timestamp;
	
	public void actionTest(String param){
	}	
	
	
	public void actionTimestamp_start(String param){
		timestamp = Long.parseLong(param);
		log.info("Starting");
	}
	public void actionTimestamp_stop(String param){
		log.info("Finished in: " + (Long.parseLong(param)-timestamp));
		
		
	}
}
