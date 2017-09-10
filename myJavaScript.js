//====Pre-requisites====
	// Syntactic sugar for creating object with give prototype i.e.:
	Object.create = function (proto) {
		var Constructor = function() {};
		Constructor.prototype = proto;
		return new Constructor();
	};

	// Syntactic sugar for creating a method 
	// for a givec constructor children i.e.: Number.
	Function.prototype.method = function (methodName,method) {
		this.prototype[methodName] = method;
		return method;
	};
	// =======================

//----Type Augumentations----
	String.method('enwrapInHTMLTag', function (attrObj) {
			specsProto = {
				tag: '',
				id : '',
				cls: '',
				href: '',
				onclick: '',
			};

			var makeSpecs = function (attrObj) {
				//example of attrObj 
				// attrObj = {
				// 	tag : String
				// 	id  : String
				// };
				// 'tag' attribute should be always specified
				specs = Object.create(specsProto);
				for (attr in attrObj) {
					specs[attr] = attrObj[attr];
				}
				return specs;
			};

			specs = makeSpecs(attrObj);

			var addAttrVal = function (attr,val) {
				return ' '+attr+' = ' + '"' + val + '"';
			}

			leftWrap = '<' + specs['tag'] +
							addAttrVal('id',specs['id']) +
							addAttrVal('class',specs['cls']) + 
							addAttrVal('href',specs['href']) +																			
							addAttrVal('onclick',specs['onclick']) +					 
						'>';
			rightWrap = '</' + specs['tag'] + '>';
			enwrapped = leftWrap + this + rightWrap;
			return enwrapped;
		}
	);

var makeJumpToElementNav = function (arrayOfButtons, navName, navCls) {
	// How to use makeJumpToElementNav:
	// 1. Create a few content containers you want to jump between with this nagivation bar
	// 2. Set their id's to = *name of the button in lowercase*
	navName = navName || '';
	navCls  = navCls  || '';
	buttons = '';
	while (arrayOfButtons.length > 0) {
		popped = arrayOfButtons.pop();
		buttons = popped
			  	.enwrapInHTMLTag({tag: 'button', id: popped + 'Button', cls: navCls}) 
			  	.enwrapInHTMLTag({tag: 'a', href: '#' + popped.toLowerCase(), cls: navCls}) //Jumping
			  + buttons;
	}

	return buttons
			.enwrapInHTMLTag({tag: 'nav', id: navName, cls: navCls})
};

var makeHideContentNav = function (arrayOfButtons, navName, navCls) {
	// How to use makeHideContentNav:
	// 1. Create a few content containers you want to switch between with this nagivation bar
	// 2. Set their class = "hideMe"
	// 3. Set their id = *name of the button in lowercase*
	navName = navName || '';
	navCls  = navCls  || '';

	for (button in arrayOfButtons) {

	}

	buttons = '';
	while (arrayOfButtons.length > 0) {
		popped = arrayOfButtons.pop();
		buttons = popped
			  	.enwrapInHTMLTag({	tag: 'button', 
			  						onclick: 'showContent' + '(' + "'"+popped.toLowerCase()+"'" + ',' + "'hideMe'" + ')', //Hiding
			  						id: popped + 'Button', cls: navCls
			  					}) 
			  	+ buttons;
	}

	return buttons.enwrapInHTMLTag({tag: 'nav', id: navName, cls: navCls})
};

var showContent = function (showedContentId,hiddenClassName) {
	elements = document.getElementsByClassName(hiddenClassName);
	
	for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
	}
	
	document.getElementById(showedContentId).style.display = '';
}

var makeLoadNewPageNav = function (arrayOfButtons, navName, navCls) {
	// How to use makeJumpToElementNav:
	// 1. Create pages you want to load from the bar
	// 2. Set their names to = *name of the button in lowercase*
	navName = navName || '';
	navCls  = navCls  || '';
	buttons = '';
	while (arrayOfButtons.length > 0) {
		popped = arrayOfButtons.pop();
		buttons = ('.'.enwrapInHTMLTag({tag: 'span', cls: 'invis'}) + popped)
			  	.enwrapInHTMLTag({tag: 'button', id: popped + 'Button', cls: navCls}) 
			  	.enwrapInHTMLTag({tag: 'a', href: popped.toLowerCase() + '.html', cls: navCls}) //Loading
			  + buttons;
	}

	return buttons
			.enwrapInHTMLTag({tag: 'nav', id: navName, cls: navCls})
};
