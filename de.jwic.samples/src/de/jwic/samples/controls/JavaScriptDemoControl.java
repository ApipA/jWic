/*
 * Copyright 2005-2007 jWic group (http://www.jwic.de)
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
 * de.jwic.samples.controls.JavaScriptDemoControl
 * Created on 16.09.2008
 * $Id: JavaScriptDemoControl.java,v 1.2 2011/06/02 12:30:18 lordsam Exp $
 */
package de.jwic.samples.controls;

import de.jwic.base.Control;
import de.jwic.base.IControlContainer;
import de.jwic.base.JavaScriptSupport;
import de.jwic.util.Util;

/**
 * This control should demonstrate the usage of the JavaScript features
 * in jWic 4.0.
 * 
 * @author Florian Lippisch
 */
@JavaScriptSupport
public class JavaScriptDemoControl extends Control {

	private String someString = "Hello World";
	private int width = 250;
	private int height = 50;
	
	/**
	 * @param container
	 * @param name
	 */
	public JavaScriptDemoControl(IControlContainer container, String name) {
		super(container, name);
	}

	/**
	 * @return the someString
	 */
	public String getSomeString() {
		return someString;
	}

	/**
	 * @param someString the someString to set
	 */
	public void setSomeString(String someString) {
		if (!Util.equals(this.someString, someString)) {
			this.someString = someString;
			requireRedraw();
		}
	}

	/**
	 * @return the width
	 */
	public int getWidth() {
		return width;
	}

	/**
	 * @param width the width to set
	 */
	public void setWidth(int width) {
		this.width = width;
		requireRedraw();
	}

	/**
	 * @return the height
	 */
	public int getHeight() {
		return height;
	}

	/**
	 * @param height the height to set
	 */
	public void setHeight(int height) {
		this.height = height;
		requireRedraw();
	}

}
