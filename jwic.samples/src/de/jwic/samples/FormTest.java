package de.jwic.samples;

import de.jwic.base.Application;
import de.jwic.base.Control;
import de.jwic.base.IControlContainer;
import de.jwic.base.Page;

public class FormTest extends Application {

	@Override
	public Control createRootControl(IControlContainer container) {
		Page p = new Page(container);
		new ALotOfForms(p, "forms");
		return p;
	}

}
