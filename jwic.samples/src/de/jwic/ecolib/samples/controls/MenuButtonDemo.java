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
 * de.jwic.ecolib.samples.controls.MenuButton
 * Created on 09.11.2012
 * $Id:$
 */
package de.jwic.ecolib.samples.controls;

import de.jwic.base.ControlContainer;
import de.jwic.base.IControlContainer;
import de.jwic.controls.AnchorLinkControl;
import de.jwic.controls.Button;
import de.jwic.controls.CheckBox;
import de.jwic.controls.LabelControl;
import de.jwic.ecolib.controls.datapicker.DatePickerControl;
import de.jwic.ecolib.controls.menucontrols.ButtonMenu;
import de.jwic.ecolib.controls.menucontrols.MenuItem;
import de.jwic.events.SelectionEvent;
import de.jwic.events.SelectionListener;
import de.jwic.events.ValueChangedEvent;
import de.jwic.events.ValueChangedListener;

/**
 * 
 * @author andreip
 */
public class MenuButtonDemo extends ControlContainer {

	private LabelControl lblInfo;

	/**
	 * @param container
	 */
	public MenuButtonDemo(IControlContainer container) {
		super(container);

		ButtonMenu menu = new ButtonMenu(this, "menuBtn");
		menu.setWidth(150);

		Button btn = menu.createButton("Open");
		btn.setTitle("Open Sesame!");

		MenuItem item = menu.getMenu().addMenuItem();
		LabelControl l = new LabelControl(menu);
		l.setText("Option 1");
		item.setContent(l);

		MenuItem item2 = item.addMenuItem();
		DatePickerControl datePickerControl = new DatePickerControl(menu, "datePicker");
		item2.setContent(datePickerControl);

		item = menu.getMenu().addMenuItem();
		final Button b = new Button(menu);
		b.setTitle("Option 2");
		b.addSelectionListener(new SelectionListener() {
			public void objectSelected(SelectionEvent event) {
				display(b.getTitle());
			}
		});
		item.setContent(b);

		item2 = item.addMenuItem();
		final Button b1 = new Button(menu);
		b1.setTitle("Option 2-1");
		b1.addSelectionListener(new SelectionListener() {
			public void objectSelected(SelectionEvent event) {
				display(b1.getTitle());
			}
		});
		item2.setContent(b1);
		
		MenuItem item3 = item2.addMenuItem();
		final CheckBox b2 = new CheckBox(menu,"checkBox");
		b2.setLabel("Option 2-1-1");
		b2.addValueChangedListener(new ValueChangedListener() {
			
			public void valueChanged(ValueChangedEvent event) {
				display(b2.getLabel());
			}
		});
		item3.setContent(b2);

		item = menu.getMenu().addMenuItem();
		final AnchorLinkControl link = new AnchorLinkControl(menu);
		link.setTitle("Option 3");
		link.addSelectionListener(new SelectionListener() {
			public void objectSelected(SelectionEvent event) {
				display(link.getTitle());
			}
		});
		item.setContent(link);

		item2 = item.addMenuItem();
		final AnchorLinkControl link1 = new AnchorLinkControl(menu);
		link1.setTitle("Option 3-1");
		link1.addSelectionListener(new SelectionListener() {
			public void objectSelected(SelectionEvent event) {
				display(link1.getTitle());
			}
		});
		item2.setContent(link1);

		lblInfo = new LabelControl(this, "lblInfo");
		lblInfo.setText("Choose an option...");
	}

	/**
	 * @param eventSource
	 */
	protected void display(String s) {

		lblInfo.setText("Selected option: " + s);

	}

}
