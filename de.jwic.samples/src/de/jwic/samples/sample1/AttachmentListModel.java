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
 * de.jwic.samples.sample1.AttachmentListModel
 * Created on 18.10.2011
 * $Id: AttachmentListModel.java,v 1.1 2012/01/01 21:48:07 lordsam Exp $
 */
package de.jwic.samples.sample1;

import java.util.ArrayList;
import java.util.List;

import de.jwic.util.SerObservable;

/**
 *
 * @author lippisch
 */
public class AttachmentListModel extends SerObservable {

	private List<String> attachments = new ArrayList<String>();
	
	public void addAttachment(String name) {
		attachments.add(name);
		
		setChanged();
		notifyObservers();
	}
	
	public List<String> getAttachmentNames() {
		return attachments;
	}
	
}
