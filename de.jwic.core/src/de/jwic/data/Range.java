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
 * de.jwic.ecolib.tableviewer.Range
 * Created on 12.03.2007
 * $Id: Range.java,v 1.1 2010/01/26 11:25:13 lordsam Exp $
 */
package de.jwic.data;

import java.io.Serializable;

/**
 * Specifies a subset of table rows using a start and max number.
 * 
 * @author Florian Lippisch
 */
public class Range implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private int start = 0;
	private int max = -1; // all
	
	/**
	 * 
	 */
	public Range() {
		super();
	}
	
	/**
	 * @param start
	 * @param max
	 */
	public Range(int start, int max) {
		super();
		this.start = start;
		this.max = max;
	}
	
	/**
	 * @return the max
	 */
	public int getMax() {
		return max;
	}
	/**
	 * @param max the max to set
	 */
	public void setMax(int max) {
		this.max = max;
	}
	/**
	 * @return the start
	 */
	public int getStart() {
		return start;
	}
	/**
	 * @param start the start to set
	 */
	public void setStart(int start) {
		this.start = start;
	}
	
}
