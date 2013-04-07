/*
 * Copyright 2005 jWic group (http://www.jwic.de)
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
 * de.jwic.controls.LabelControl
 * $Id: LabelControl.java,v 1.5 2010/01/10 19:54:49 lordsam Exp $
 */package de.jwic.controls;

import de.jwic.base.IControlContainer;
import de.jwic.controls.basics.Label;

/**
 * Represents a label that displays just text. A style can be specified
 * to format the label.
 * @author Florian Lippisch
 */
public class LabelControl extends Label {
	
	private static final long serialVersionUID = 1L;

	/**
	 * @param container
	 * @param name
	 */
	public LabelControl(IControlContainer container, String name) {
		super(container, name);
		setTemplateName(Label.class.getName());
	}

	/**
	 * @param container
	 */
	public LabelControl(IControlContainer container) {
		super(container);
		setTemplateName(Label.class.getName());
	}

}
