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
 * de.jwic.wap.events.DialogAdapter
 * Created on 16.01.2006
 * $Id: DialogAdapter.java,v 1.1 2006/04/27 14:39:06 lordsam Exp $
 */
package de.jwic.controls.dialogs;

/**
 * @author Florian Lippisch
 * @version $Revision: 1.1 $
 */
public class DialogAdapter implements DialogListener {
	private static final long serialVersionUID = 1L;
	/* (non-Javadoc)
	 * @see de.jwic.wap.events.DialogListener#dialogFinished(de.jwic.wap.events.DialogEvent)
	 */
	public void dialogFinished(DialogEvent event) {

	}

	/* (non-Javadoc)
	 * @see de.jwic.wap.events.DialogListener#dialogAborted(de.jwic.wap.events.DialogEvent)
	 */
	public void dialogAborted(DialogEvent event) {

	}

}
