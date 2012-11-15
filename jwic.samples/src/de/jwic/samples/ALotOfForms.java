package de.jwic.samples;

import java.util.ArrayList;
import java.util.List;

import de.jwic.base.ControlContainer;
import de.jwic.base.IControlContainer;
import de.jwic.base.JavaScriptSupport;
import de.jwic.controls.InputBoxControl;

@JavaScriptSupport
public class ALotOfForms extends ControlContainer {
	private static final long serialVersionUID = 1L;

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
		

		for (int i = 0; i < 20; i++) {
			InputBoxControl inp = new InputBoxControl(this, "box" + i);
			boxes.add(inp);
			inp.setText("Some Text " + i);
		}

	}
	
	public void actionTest(String param){
		System.out.println("asd");
	}	

}
