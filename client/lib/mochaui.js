/*
 ---

 script: core.js

 description: MUI - A Web Applications User Interface Framework.

 copyright: (c) 2011 Contributors in (/AUTHORS.txt).

 license: MIT-style license in (/MIT-LICENSE.txt).

 requires:
 - Core/Array
 - Core/Element
 - Core/Browser
 - Core/Request
 - Core/Request.HTML
 - More/Hash
 - More/Assets

 provides: [MUI, MochaUI, MUI.Require, NamedClass]

 ...
 */

var MochaUI;
var MUI = MochaUI = (MUI || {});

MUI.append = function(hash){
	Object.append(MUI, hash);
}.bind(MUI);

Browser.webkit = (Browser.safari || Browser.chrome);

MUI.append({
	'options': {
		theme: 'default',
		advancedEffects: false, // Effects that require fast browsers and are cpu intensive.
		standardEffects: true,  // Basic effects that tend to run smoothly.

		path: {
			root:		'../',						// Path to root of other source folders
			source:		'{root}Source/',			// Path to MochaUI source JavaScript
			themes:		'{root}Source/Themes/'		// Path to MochaUI Themes
		},

		pluginGroups: {
			'controls':{path:'{root}Source/Controls/',singularName:'control'},
			'plugins':{path:'{root}Source/Plugins/',singularName:'plugin'}
		},

		themes: ['Default','Charcoal'],

		css:	 ['{theme}css/core.css'],				// default list of css files to load, added to requirements of every control and plugin loaded

		defaultJsonProvider: 'json'						// the default json provider chosen for controls that require json and not loadMethod was selected

	}
});

MUI.append({
	version: '1.0.0',
	initialized: false,
	instances: new Hash(),
	registered: new Hash(),
	idCount: 0,
	ieSupport: 'excanvas',					// Makes it easier to switch between Excanvas and Moocanvas for testing
	path: MUI.options.path,					// depreciated, will be removed

	initialize: function(options){
		if (options){
			if (options.path) options.path = Object.append(MUI.options.path, options.path);
			if (options.css) options.css = Object.append(MUI.options.css, options.css);
			if (options.pluginGroups) options.pluginGroups = Object.append(MUI.options.pluginGroups, options.pluginGroups);
			Object.append(MUI.options, options);
		}
		Object.each(MUI.options.pluginGroups, MUI.addPluginGroup);
		MUI.initialized = true;
	},

	replaceFields: function(str, values){
		if (values == null) return str;

		if (typeOf(str) == 'string'){
			var keys = str.match(/\{+(\w*)\}+/g);
			if (keys == null) return str;

			// make sure root path and plugin package paths are always checked for
			Object.each(MUI.options.pluginGroups, function(g, name){
				keys.push('{' + name + '}')
			});
			keys.push('{root}');

			keys.each(function(key){
				var name = key.replace(/[\{\}]/g, '');
				if (name == null || name == '') return;

				if (values[name] == null) return;
				var re = new RegExp('\\{' + name + '\\}', 'g');
				str = str.replace(re, values[name]);
			});
			return str;
		}
		if (typeOf(str) == 'array'){
			for (var i = 0; i < str.length; i++){
				str[i] = MUI.replaceFields(str[i], values);
			}
		}
		return str;
	},

	replacePaths: function(files){
		if (!MUI.initialized) MUI.initialize();
		var paths = Object.append({'theme':MUI.options.path.themes + MUI.options.theme + '/'}, MUI.options.path);
		return MUI.replaceFields(files, paths);
	},

	files: new Hash({'{source}Core/core.js': 'loaded'}),

	getID: function(el){
		var type = typeOf(el);
		if (type == 'string') return el;
		if (type == 'element') return el.id;
		else if (type == 'object' && el.id) return el.id;
		else if (type == 'object' && el.options && el.options.id) return el.options.id;
		return el;
	},

	get: function(el){
		var id = this.getID(el);
		el = $(id);
		if (el && el.retrieve('instance')) return el.retrieve('instance');
		return this.instances[id];
	},

	set: function(el, instance){
		el = this.getID(el);
		this.instances.set(el, instance);
		return instance;
	},

	erase: function(el){
		var t=typeof(el);
		var instance;
		if(el.each) t='array';
		switch(t) {
			case 'array':
				el.each(function(el) {
					MUI.erase(el)
				});
				break;
			case 'element':
				el=$(el);
				if(el.getChildren) {
					if(!instance) instance=MUI.instances[MUI.getID(el)];
					MUI.instances.erase(MUI.getID(el));
					MUI.erase($(el).getChildren());
				}
				break;
			default:
				el=MUI.getID(el);
				instance = MUI.instances[el];
				MUI.instances.erase(el);
		}
		if(instance && instance.dispose) {
			instance.dispose();
			delete instance;
			return null;
		}
		return instance;
	},

	each: function(func){
		Object.each(this.instances, func);
		return this;
	},

	reloadIframe: function(iframe){
		var src = $(iframe).src;
		Browser.firefox ? $(iframe).src = src : top.frames[iframe].location.reload(true);
	},

	notification: function(message, options){
		options = Object.append({
			control: 'MUI.Window',
			loadMethod: 'html',
			closeAfter: 1500,
			type: 'notification',
			cssClass: 'notification',
			content: message,
			width: 220,
			height: 40,
			y: 53,
			padding: {top: 10, right: 12, bottom: 10, left: 12},
			shadowBlur: 5
		}, options);
		MUI.create(options);
	},

	toggleAdvancedEffects: function(link){
		if (MUI.options.advancedEffects){
			MUI.options.advancedEffects = false;
			if (this.toggleAdvancedEffectsLink) this.toggleAdvancedEffectsLink.destroy();
		} else {
			MUI.options.advancedEffects = true;
			if (link){
				this.toggleAdvancedEffectsLink = new Element('div', {
					'class': 'check',
					'id': 'toggleAdvancedEffects_check'
				}).inject(link);
			}
		}
	},

	toggleStandardEffects: function(link){
		if (MUI.options.standardEffects){
			MUI.options.standardEffects = false;
			if (this.toggleStandardEffectsLink) this.toggleStandardEffectsLink.destroy();
		} else {
			MUI.options.standardEffects = true;
			if (link){
				this.toggleStandardEffectsLink = new Element('div', {
					'class': 'check',
					'id': 'toggleStandardEffects_check'
				}).inject(link);
			}
		}
	},

	hideSpinner: function(instance){
		if (instance == null) instance = MUI.get(this.id);
		var spinner = $$('.spinner');
		if (instance && instance.el && instance.el.spinner) spinner = instance.el.spinner;
		if ((instance == null || (instance && instance.showSpinner == null)) && spinner){
			var t = (typeof spinner);
			if (t == 'array' || t == 'object') spinner = spinner[0];
			if (spinner) MUI.each(function(instance){
				if (instance.isTypeOf && instance.isTypeOf('MUI.Spinner')) spinner = instance.el.spinner;
			});
			if (!spinner) return;
			(function(){
				var count = this.retrieve("count");
				this.store("count", count ? count - 1 : 0);
				if (count <= 1) this.setStyle('display', 'none');
			}).delay(500, spinner);
			return;
		}
		if (instance && instance.hideSpinner) instance.hideSpinner();
	},

	showSpinner: function(instance){
		if (instance == null) instance = MUI.get(this.id);
		var spinner = $$('.spinner');
		if (instance && instance.el && instance.el.spinner) spinner = instance.el.spinner;
		if ((instance == null || (instance && instance.showSpinner == null)) && spinner){
			var t = (typeof spinner);
			if (t == 'array' || t == 'object') spinner = spinner[0];
			if (spinner) MUI.each(function(instance){
				if (instance.isTypeOf && instance.isTypeOf('MUI.Spinner')) spinner = instance.el.spinner;
			});
			if (!spinner) return;
			var count = spinner.retrieve("count");
			spinner.store("count", count ? count + 1 : 1).show();
			return;
		}
		if (instance && instance.showSpinner) instance.showSpinner();
	},

	register: function(namespace, funcs, depth){
		try{
			if (typeof(funcs) == 'function'){
				if (namespace) MUI.registered[namespace] = funcs;
				return;
			}
			if (depth == null) depth = 4;
			if (depth < 0) return;
			for (var name in funcs){
				if (name == '') continue;
				var func = funcs[name];
				if (typeOf(func) != 'function' || name.substr(0, 1) == '_') continue;
				if (typeOf(func) == 'object'){
					MUI.register(namespace + '.' + name, func, depth - 1);
					return;
				}
				MUI.registered[namespace + '.' + name] = func;
			}
		} catch(e){
		}
	},

	getRegistered: function(bind, name, args){
		return function(ev){
			MUI.registered[name].apply(bind, [ev].append(args));
		};
	},

	getWrappedEvent: function(bind, func, args){
		return function(ev){
			func.apply(bind, [ev].append(args));
		};
	},

	getPartnerLoader: function(bind, content){
		return function(ev){
			ev.stop();
			if ($(content.element)) MUI.Content.update(content);
		};
	},

	getDefaultJsonProvider: function(value) {
		if(value=='json' || value=='jsonp' ) return value;
		return MUI.options.defaultJsonProvider;
	}

});

var NamedClass = function(name, members){
	members.className = name;
	members.isTypeOf = function(cName){
		if (cName == this.className) return true;
		if (!this.constructor || !this.constructor.parent) return false;
		return this.isTypeOf.apply(this.constructor.parent.prototype, cName);
	};
	return new Class(members);
};

function fixPNG(myImage){
	if (Browser.ie6 && document.body.filters){
		var imgID = (myImage.id) ? "id='" + myImage.id + "' " : "";
		var imgClass = (myImage.className) ? "class='" + myImage.className + "' " : "";
		var imgTitle = (myImage.title) ? "title='" + myImage.title + "' " : "title='" + myImage.alt + "' ";
		var imgStyle = "display:inline-block;" + myImage.style.cssText;
		myImage.outerHTML = "<span " + imgID + imgClass + imgTitle
				+ " style=\"" + "width:" + myImage.width
				+ "px; height:" + myImage.height
				+ "px;" + imgStyle + ";"
				+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
				+ "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>";
	}
}

Element.implement({

	shake: function(radius, duration){
		radius = radius || 3;
		duration = duration || 500;
		duration = (duration / 50).toInt() - 1;
		var parent = this.getParent();
		if (parent != $(document.body) && parent.getStyle('position') == 'static'){
			parent.setStyle('position', 'relative');
		}
		var position = this.getStyle('position');
		if (position == 'static'){
			this.setStyle('position', 'relative');
			position = 'relative';
		}
		if (Browser.ie){
			parent.setStyle('height', parent.getStyle('height'));
		}
		var coords = this.getPosition(parent);
		if (position == 'relative' && !Browser.opera){
			coords.x -= parent.getStyle('paddingLeft').toInt();
			coords.y -= parent.getStyle('paddingTop').toInt();
		}
		var morph = this.retrieve('morph');
		var oldOptions;
		if (morph){
			morph.cancel();
			oldOptions = morph.options;
		}

		this.set('morph', {
			duration:50,
			link:'chain'
		});

		for (var i = 0; i < duration; i++){
			morph.start({
				top:coords.y + Number.random(-radius, radius),
				left:coords.x + Number.random(-radius, radius)
			});
		}

		morph.start({
			top:coords.y,
			left:coords.x
		}).chain(function(){
			if (oldOptions){
				this.set('morph', oldOptions);
			}
		}.bind(this));

		return this;
	},

	hide: function(){
		var instance = MUI.get(this.id);
		if (instance != null && instance.hide != null){
			instance.hide();
			return this;
		}

		this.setStyle('display', 'none');
		return this;
	},

	show: function(){
		var instance = MUI.get(this.id);
		if (instance != null && instance.show != null){
			instance.show();
			return this;
		}

		this.setStyle('display', 'block');
		return this;
	},

	close: function(){
		var instance = MUI.get(this.id);
		if (instance == null || instance.isClosing || instance.close == null) return;
		instance.close();
	},

	resize: function(options){
		var instance = MUI.get(this.id);
		if (instance == null || instance.resize == null){
			if (options.width != null) this.setStyle('width', options.width);
			if (options.height != null) this.setStyle('height', options.height);
		} else instance.resize(options);
		return this;
	},

	empty: function() {
		MUI.erase(this)
		Array.from(this.childNodes).each(Element.dispose);
		return this;
	}

});

// This makes it so Request will work to some degree locally
if (location.protocol == 'file:'){

	Request.implement({
		isSuccess : function(status){
			return (status == 0 || (status >= 200) && (status < 300));
		}
	});

	Browser.Request = function(){
		return Function.attempt(function(){
			return new ActiveXObject('MSXML2.XMLHTTP');
		}, function(){
			return new XMLHttpRequest();
		});
	};

}


/*
 ---

 script: create.js

 description: core content control creation and plugin loading routines

 copyright: (c) 2011 Contributors in (/AUTHORS.txt).

 license: MIT-style license in (/MIT-LICENSE.txt).

 requires:
 - MochaUI/MUI

 provides: [MUI.create, MUI.load, MUI.addPluginGroup, MUI.loadPluginGroups]

 ...
 */

MUI.append({

	addPluginGroup: function(group, name){
		MUI.options.pluginGroups[name] = group;
		MUI.options.path[name] = group.path;
	},

	loadPluginGroups:function(onload){
		var js = [];
		Object.each(MUI.options.pluginGroups, function(group, name){
			if (MUI.files['{' + name + '}mui-' + name + '.js'] != 'loaded'){
				MUI[name] = [];
				js = js.append(['{' + name + '}mui-' + name + '.js']);
			}
		});
		if (js.length > 0) new MUI.Require({'js':js, 'onload':onload });
		else return false;  // returns false to signal that everything is loaded
		return true;   // returns true to signal that it loading something
	},

	load:function(options){
		// convert none hash parameters to hash
		if (typeOf(options) == 'string') options = {control:options, loadOnly:true,onload:(arguments.length > 0) ? arguments[1] : null};
		if (typeOf(options) == 'array'){
			var controls = [];
			for (var j = 0; j < options.length; j++)
				controls.push({control:options[j]});
			options = {controls:controls, onload:(arguments.length > 1) ? arguments[1] : null, loadOnly:true};
		}
		MUI.create(options);
	},

	getControlAssets : function(control, js, css, traversed, name){
		if (typeOf(control) == 'string') control = {control:control};
		if (!traversed) traversed = [control.control];
		if (!name) name = control.control;
		name = name.replace(/(^MUI\.)/i, '');
		var cname = name.toLowerCase();

		// try and locate the requested item
		var config;
		var pgName;
		Object.each(MUI.options.pluginGroups, function(group, name){
			if (MUI[name][cname] != null){
				pgName = name;
				config = MUI[name][cname];
			}
		});
		if (config == null) return {js:js,css:css,config:null};

		// see if we can gather all of the dependency controls
		var dependsOn = config.dependsOn ? config.dependsOn : [];	// add configured dependencies if they exist
		if (config.childNode && control[config.childNode]){			// add child controls of the control has a childnode configured
			var children = control[config.childNode];
			if (typeof(children) != 'array') children = [children];				// some controls allow child nodes to be an array or a single node
			Object.each(control[config.childNode], function(child){
				var controlname = (child.control ? child.control : config.childType);
				if (typeof(controlname) == 'string'){
					traversed.include(controlname);
					MUI.getControlAssets(child, js, css, traversed, controlname);
				}
			})
		}
		// gather dependencies if we have some
		if (dependsOn.length > 0){
			Object.each(dependsOn, function(controlname){
				if (traversed.indexOf(controlname) >= 0 || control.control == controlname) return;  // make sure we do get into a runaway recursion
				MUI.getControlAssets(controlname, js, css, traversed);
			})
		}

		var path = {};
		var sname = MUI.options.pluginGroups[pgName].singularName;
		if (!config.location) config.location = cname;
		path[sname] = '{' + pgName + '}' + config.location + '/';

		if (config.paths) Object.each(config.paths, function(tpath, name){
			MUI.options.path[name] = MUI.replaceFields(tpath, path);
		});

		if (!config.js) js.push(path[sname] + cname + '.js');
		else js.combine(config.js);
		js = MUI.replaceFields(js, path);

		if (config.css) css.combine(config.css);
		css.combine(MUI.options.css);
		css = MUI.replaceFields(css, path);

		return {js:js,css:css,config:config};
	},

	create:function(options){
		// convert none hash parameters to hash
		if (typeOf(options) == 'string') options = {control:options,onload:(arguments.length > 1) ? arguments[1] : null};
		if (!MUI.initialized) MUI.initialize(); // initialize mocha if needed

		if (this.loadPluginGroups(function(){ // make sure all all plugin/control group configurations are loaded
			MUI.create(options);
		})) return;

		// convert array of plugin names to controls request
		var controls = options.controls;
		if (!controls) controls = [];
		if (typeOf(options) == 'array'){
			for (var j = 0; j < options.length; j++)
				controls.push({control:options[j]});
			options = {controls:controls,onload:options.onload};
		}

		if (controls.length == 0) controls = [options]; // make sure we have an array for list of controls to load

		// gather all of the assests for the requested controls/plugins
		var r = {js:[],css:[],traversed:(MUI.traversed ? MUI.traversed : [])};
		var config;
		for (var i = 0; i < controls.length; i++){
			if (!controls[i].control) return;
			config = MUI.getControlAssets(controls[i], r.js, r.css, r.traversed).config;
		}

		// if only one control was requested and it is loaded then return it
		if (controls.length == 1 && r.js.length > 0 && MUI.files[r.js[0]] == 'loaded'){
			if ((config && config.loadOnly) || options.loadOnly) return null;
			var name = controls[0].control.replace(/(^MUI\.)/i, '');
			var klass = MUI[name];
			var obj = new klass(options);
			if (options.onNew) options.onNew(obj);
			if (options.fromHTML && obj.fromHTML) obj.fromHTML();
			new MUI.Require(r);
			return obj;
		}

		// build a callback function for the assests requested
		r.onload = function(){
			MUI.traversed = (MUI.traversed ? MUI.traversed : []).combine(r.traversed);
			if (this.onload) this.onload(this);

			controls.each(function(control){
				if (control.loadOnly || this.loadOnly) return;
				if (control.onload) control.onload(control);
				var name = control.control.replace(/(^MUI\.)/i, '');
				var klass = MUI[name];
				var obj = new klass(control);
				if (control.onNew) control.onNew(obj);
				if (control.fromHTML && obj.fromHTML) obj.fromHTML();
			}.bind(this));

		}.bind(options);
		new MUI.Require(r);
	}

});


/*
 ---

 script: require.js

 description: core css and js asset loading functionality, builds on mootools ASSET

 copyright: (c) 2011 Contributors in (/AUTHORS.txt).

 license: MIT-style license in (/MIT-LICENSE.txt).

 requires:
 - MochaUI/MUI
 - Core/Request
 - More/Hash
 - More/Assets

 provides: [MUI.Require, Asset.css ]

 ...
 */

MUI.Require = new Class({

	Implements: [Options],

	options: {
		css: [],
		images: [],
		js: []
		//onload: null
	},

	initialize: function(options){
		this.setOptions(options);
		options = this.options;

		this.assetsToLoad = options.css.length + options.images.length + options.js.length;
		this.assetsLoaded = 0;

		var cssLoaded = 0;

		// Load CSS before images and JavaScript

		if (options.css.length){
			options.css.each(function(sheet){

				this.getAsset(sheet, function(){
					if (cssLoaded == options.css.length - 1){
						if (this.assetsLoaded == this.assetsToLoad - 1) this.requireOnload();
						else {
							// Add a little delay since we are relying on cached CSS from XHR request.
							this.assetsLoaded++;
							this.requireContinue.delay(50, this);
						}
					} else {
						cssLoaded++;
						this.assetsLoaded++;
					}
				}.bind(this));
			}.bind(this));
		} else if (!options.js.length && !options.images.length){
			if (typeof this.options.onload == 'function'){
				this.options.onload();
			}
			return true;
		} else this.requireContinue.delay(50, this); // Delay is for Safari
	},

	requireOnload: function(){
		this.assetsLoaded++;
		if (this.assetsLoaded == this.assetsToLoad){
			if (typeof this.options.onload == 'function'){
				this.options.onload();
			}
			return true;
		}
	},

	requireContinue: function(){
		var options = this.options;
		if (options.images.length){
			options.images.each(function(image){
				this.getAsset(image, this.requireOnload.bind(this));
			}.bind(this));
		}

		if (options.js.length){
			options.js.each(function(script){
				this.getAsset(script, this.requireOnload.bind(this));
			}.bind(this));
		}
	},

	getAsset: function(source, onload){
		// If the asset is loaded, fire the onload function.
		if (MUI.files[source] == 'loaded'){
			if (typeof onload == 'function'){
				onload(source);
			}
			return true;
		}

		// If the asset is loading, wait until it is loaded and then fire the onload function.
		// If asset doesn't load by a number of tries, fire onload anyway.
		else if (MUI.files[source] == 'loading'){
			var tries = 0;
			var checker = (function(){
				tries++;
				if (MUI.files[source] == 'loading' && tries < 100) return;
				clearInterval(checker);
				if (typeof onload == 'function'){
					onload(source);
				}
			}).periodical(50);
		} else {  // If the asset is not yet loaded or loading, start loading the asset.
			MUI.files[source] = 'loading';

			var properties = {
				'onload': onload != 'undefined' ? onload : null
			};

			// Add to the onload function
			var oldonload = properties.onload;
			properties.onload = function(){
				MUI.files[source] = 'loaded';
				if (typeof oldonload == 'function') {
					oldonload(source);
				}
			}.bind(this);

			var sourcePath = MUI.replacePaths(source);
			switch (sourcePath.match(/\.\w+$/)[0]){
				case '.js': return Asset.javascript(sourcePath, properties);
				case '.css': return Asset.css(sourcePath, properties);
				case '.jpg':
				case '.png':
				case '.gif': return Asset.image(sourcePath, properties);
			}

			alert('The required file "' + source + '" could not be loaded');
		}
	}
});

Object.append(Asset, {
	// Get the CSS with XHR before appending it to document.head so that we can have an onload callback.
	css: function(source, properties){
		properties = Object.append({
			id: null,
			media: 'screen',
			onload: null
		}, properties);

		new Request({
			method: 'get',
			url: source,
			onComplete: function(){
				newSheet = new Element('link', {
					'id': properties.id,
					'rel': 'stylesheet',
					'media': properties.media,
					'type': 'text/css',
					'href': source
				}).inject(document.head);
				if (typeOf(properties.onload) == 'function') properties.onload();
			}.bind(this),
			onFailure: function(){
			},
			onSuccess: function(){
			}.bind(this)
		}).send();
	},

	getCSSRule: function(selector){
		for (var ii = 0; ii < document.styleSheets.length; ii++){
			var mySheet = document.styleSheets[ii];
			var myRules = mySheet.cssRules ? mySheet.cssRules : mySheet.rules;
			selector=selector.toLowerCase();
			for (var i = 0; i < myRules.length; i++){
				if (myRules[i].selectorText.toLowerCase() == selector){
					return myRules[i];
				}
			}
		}
		return false;
	}
});

/*
 ---

 script: canvas.js

 description: Namespace for all canvas drawing functions.

 copyright: (c) 2011 Contributors in (/AUTHORS.txt).

 license: MIT-style license in (/MIT-LICENSE.txt).

 requires: [MochaUI/MUI]

 provides: [MUI.Canvas]

 ...
 */

MUI.Canvas = Object.append((MUI.Canvas || {}), {

	drawBox: function(ctx, width, height, shadowBlur, shadowOffset, shadows, headerHeight, cornerRadius, bodyBgColor, headerStartColor, headerStopColor){
		var shadowBlur2x = shadowBlur * 2;

		// This is the drop shadow. It is created onion style.
		if (shadows){
			for (var x = 0; x <= shadowBlur; x++){
				this.roundedRect(
					ctx,
					shadowOffset.x + x,
					shadowOffset.y + x,
					width - (x * 2) - shadowOffset.x,
					height - (x * 2) - shadowOffset.y,
					cornerRadius + (shadowBlur - x),
					[0, 0, 0],
					x == shadowBlur ? .29 : .065 + (x * .01)
				);
			}
		}

		// Window body.
		this._drawBodyRoundedRect(
			ctx, // context
			shadowBlur - shadowOffset.x, // x
			shadowBlur - shadowOffset.y, // y
			width - shadowBlur2x, // width
			height - shadowBlur2x, // height
			cornerRadius, // corner radius
			bodyBgColor // Footer color
		);

		if (headerHeight){
			// Window header.
			this._drawTopRoundedRect(
				ctx, // context
				shadowBlur - shadowOffset.x, // x
				shadowBlur - shadowOffset.y, // y
				width - shadowBlur2x, // width
				headerHeight, // height
				cornerRadius, // corner radius
				headerStartColor, // Header gradient's top color
				headerStopColor // Header gradient's bottom color
			);
		}
	},

	drawGauge: function(ctx, width, height, shadowBlur, shadowOffset, shadows, canvasHeader, headerHeight, bodyBgColor, useCSS3){
		if (shadows && !useCSS3){
			if (Browser.webkit){
				var cssobj = Asset.getCSSRule('.mochaCss3Shadow'); // [i_a] fix Safari 5 error (load order?)
				var color = (typeof cssobj === 'object' ? cssobj.style.backgroundColor : '#333');
				if (typeof cssobj !== 'object')
					console.warn('MUI.drawGauge: cannot find style mochaCss3Shadow');
				ctx.shadowColor = color.replace(/rgb/g,'rgba');
				ctx.shadowOffsetX = shadowOffset.x;
				ctx.shadowOffsetY = shadowOffset.y;
				ctx.shadowBlur = shadowBlur;
			} else for (var x = 0; x <= shadowBlur; x++){
				MUI.Canvas.circle(
					ctx,
					width * .5 + shadowOffset.x,
					(height + headerHeight) * .5 + shadowOffset.x,
					(width * .5) - (x * 2) - shadowOffset.x,
					[0, 0, 0],
					x == shadowBlur ? .75 : .075 + (x * .04)
				);
			}
		}
		MUI.Canvas.circle(
			ctx,
			width * .5 - shadowOffset.x,
			(height + headerHeight) * .5 - shadowOffset.y,
			(width * .5) - shadowBlur,
			bodyBgColor,
			1
		);

		if (Browser.webkit){
			ctx.shadowColor = "rgba(0,0,0,0)";
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 0;
		}

		if(canvasHeader) {
			// Draw gauge header
			canvasHeader.setStyles({
				'top': shadowBlur - shadowOffset.y,
				'left': shadowBlur - shadowOffset.x
			});
			ctx = canvasHeader.getContext('2d');
			ctx.clearRect(0, 0, width, 100);
			ctx.beginPath();
			ctx.lineWidth = 24;
			ctx.lineCap = 'round';
			ctx.moveTo(13, 13);
			ctx.lineTo(width - (shadowBlur * 2) - 13, 13);
			ctx.strokeStyle = 'rgba(0, 0, 0, .65)';
			ctx.stroke();
		}
	},

	drawBoxCollapsed: function(ctx, width, height, shadowBlur, shadowOffset, shadows, headerHeight, cornerRadius, headerStartColor, headerStopColor){
		var shadowBlur2x = shadowBlur * 2;

		// This is the drop shadow. It is created onion style.
		if (shadows){
			for (var x = 0; x <= shadowBlur; x++){
				this.roundedRect(
					ctx,
					shadowOffset.x + x,
					shadowOffset.y + x,
					width - (x * 2) - shadowOffset.x,
					height - (x * 2) - shadowOffset.y,
					cornerRadius + (shadowBlur - x),
					[0, 0, 0],
					x == shadowBlur ? .3 : .06 + (x * .01)
				);
			}
		}

		// Window header
		this._drawTopRoundedRect2(
			ctx, // context
			shadowBlur - shadowOffset.x, // x
			shadowBlur - shadowOffset.y, // y
			width - shadowBlur2x, // width
			headerHeight + 2, // height
			shadowBlur,
			cornerRadius, // corner radius
			headerStartColor, // Header gradient's top color
			headerStopColor // Header gradient's bottom color
		);

	},

	drawMaximizeButton: function(ctx, x, y, rgbBg, aBg, rgb, a){
		// Circle
		ctx.beginPath();
		ctx.arc(x, y, 7, 0, Math.PI * 2, true);
		ctx.fillStyle = 'rgba(' + rgbBg.join(',') + ',' + aBg + ')';
		ctx.fill();
		// X sign
		ctx.strokeStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(x, y - 3.5);
		ctx.lineTo(x, y + 3.5);
		ctx.moveTo(x - 3.5, y);
		ctx.lineTo(x + 3.5, y);
		ctx.stroke();
	},

	drawCloseButton: function(ctx, x, y, rgbBg, aBg, rgb, a){
		// Circle
		ctx.beginPath();
		ctx.arc(x, y, 7, 0, Math.PI * 2, true);
		ctx.fillStyle = 'rgba(' + rgbBg.join(',') + ',' + aBg + ')';
		ctx.fill();
		// Plus sign
		ctx.strokeStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(x - 3, y - 3);
		ctx.lineTo(x + 3, y + 3);
		ctx.moveTo(x + 3, y - 3);
		ctx.lineTo(x - 3, y + 3);
		ctx.stroke();
	},

	drawMinimizeButton: function(ctx, x, y, rgbBg, aBg, rgb, a){
		// Circle
		ctx.beginPath();
		ctx.arc(x, y, 7, 0, Math.PI * 2, true);
		ctx.fillStyle = 'rgba(' + rgbBg.join(',') + ',' + aBg + ')';
		ctx.fill();
		// Minus sign
		ctx.strokeStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(x - 3.5, y);
		ctx.lineTo(x + 3.5, y);
		ctx.stroke();
	},

	roundedRect: function(ctx, x, y, width, height, radius, rgb, a){
		ctx.fillStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		ctx.lineTo(x + width - radius, y + height);
		ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
		ctx.fill();
	},

	triangle: function(ctx, x, y, width, height, rgb, a){
		ctx.beginPath();
		ctx.moveTo(x + width, y);
		ctx.lineTo(x, y + height);
		ctx.lineTo(x + width, y + height);
		ctx.closePath();
		ctx.fillStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.fill();
	},

	circle: function(ctx, x, y, diameter, rgb, a){
		ctx.beginPath();
		ctx.arc(x, y, diameter, 0, Math.PI * 2, true);
		ctx.fillStyle = 'rgba(' + rgb.join(',') + ',' + a + ')';
		ctx.fill();
	},

	_drawBodyRoundedRect: function(ctx, x, y, width, height, radius, rgb){
		ctx.fillStyle = 'rgba(' + rgb.join(',') + ', 1)';
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		ctx.lineTo(x + width - radius, y + height);
		ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
		ctx.fill();
	},

	_drawTopRoundedRect: function(ctx, x, y, width, height, radius, headerStartColor, headerStopColor){
		var lingrad = ctx.createLinearGradient(0, 0, 0, height);
		lingrad.addColorStop(0, 'rgb(' + headerStartColor.join(',') + ')');
		lingrad.addColorStop(1, 'rgb(' + headerStopColor.join(',') + ')');
		ctx.fillStyle = lingrad;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + height);
		ctx.lineTo(x + width, y + height);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
		ctx.fill();
	},

	_drawTopRoundedRect2: function(ctx, x, y, width, height, shadowBlur, radius, headerStartColor, headerStopColor){
		// Chrome is having trouble rendering the LinearGradient in this particular case
		if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
			ctx.fillStyle = 'rgba(' + headerStopColor.join(',') + ', 1)';
		} else {
			var lingrad = ctx.createLinearGradient(0, shadowBlur - 1, 0, height + shadowBlur + 3);
			lingrad.addColorStop(0, 'rgb(' + headerStartColor.join(',') + ')');
			lingrad.addColorStop(1, 'rgb(' + headerStopColor.join(',') + ')');
			ctx.fillStyle = lingrad;
		}
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		ctx.lineTo(x + width - radius, y + height);
		ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
		ctx.fill();
	}

});

/*
 ---

 script: content.js

 description: core content update routines

 copyright: (c) 2011 Contributors in (/AUTHORS.txt).

 license: MIT-style license in (/MIT-LICENSE.txt).

 requires:
 - MochaUI/MUI
 - Core/Request
 - More/Request.JSONP

 provides: [MUI.Content]

 ...
 */

MUI.Content = Object.append((MUI.Content || {}), {

	Providers: {},

	Filters: {},

	callBacks: {},

	update: function(content){

		// set defaults for options
		/*		content = Object.append({
		 instance:		null,			// the instance of the control to be updated, this is normally used internally only
		 element:		null,			// the element to inject into, or the instance name
		 method:		null,			// the method to use to make request, 'POST' or 'GET'
		 data:			null,			// the data payload to send to the url
		 content:		null,			// used to feed content instead of requesting from a url endpoint
		 clear:			false,			// setting to true forces current content to be cleared
		 loadMethod:	null,			// the provider that will be used to make the request
		 url:			null,			// the url endpoint to make the request to
		 prepUrl:		null,			// callback that is executed to prepare the url. syntax: prepUrl.run([url,values,instance],this) return url;
		 require:		{},				// used to add additional css, images, or javascript
		 paging:		{},				// used to specify paging parameters
		 filters:		[],				// used to make post request processing/filtering of data, can be used to convert request to JSON
		 persist:		false			// true if you want to persist the request, false if you do not.
		 // if it is a string value the string will be used to persist the data instead of the request URL.
		 // if it is an array, it will assume the array is an array of strings and each string represents a cache key that is also the name of a hash value that needs to cached individually.
		 //onLoaded:		null			// fired when content is loaded
		 }, content);*/

		// set defaults for require option
		content.require = Object.append({
			css: [],			// the style sheets to load before the request is made
			images: [],			// the images to preload before the request is made
			js: [],				// the JavaScript that is loaded and called after the request is made
			onload: function(){
			}// the event that is fired after all required files are loaded
		}, content.require);

		// set defaults for paging
		content.paging = Object.append(MUI.Content.PagingOptions, content.paging);

		// detect subcontrol content
		if (content.control){
			if (!content.options) content.options = {};
			if (content.url) content.options.url = content.url;
			if (content.loadMethod) content.options.loadMethod = content.loadMethod;
			content.loadMethod = 'control';
		}

		// make sure loadMethod has a value
		if (!content.loadMethod){
			if (instance == null || instance.options == null || !instance.options.loadMethod){
				if (!content.url) content.loadMethod = 'html';
				else content.loadMethod = 'xhr';
			} else {
				content.loadMethod = instance.options.loadMethod;
			}
		}

		var instance = content.instance;
		var element = content.element = $(content.element);
		if (!instance && element) instance = element.retrieve('instance');
		content.instance = instance;

		// -- argument pre-processing override --
		// allow controls to process any custom arguments, titles, scrollbars, etc..
		if (instance && instance.updateStart) instance.updateStart(content);

		// no content or url and not a subcontrol? nothing else to do beyond this point
		if (!content.url && !content.content && content.loadMethod != 'control'){
			if (content.clear){
				if (instance && instance.updateClear) removeContent = instance.updateClear(content);
				if (element) element.empty().show();
			}
			return content;
		}

		// replace in path replacement fields,  and prepare the url
		content.doPrepUrl = (function(prepUrl){
			return function(content){
				if (content.url){
					// create standard field replacements from data, paging, and path hashes
					var values = Object.merge(content.data || {}, content.paging || {}, MUI.options.path || {});
					// call the prepUrl callback if it was defined
					if (prepUrl) return prepUrl.apply(this, [content.url, values, instance]);
					return MUI.replaceFields(content.url, values);
				}
			};
		})(content.prepUrl);

		// -- content removal --
		// allow controls option to clear their own content
		var removeContent = content.clear;
		if (instance && instance.updateClear) removeContent = instance.updateClear(content);

		// Remove old content.
		if (removeContent && element) element.empty().show();

		// prepare function to persist the data
		if (content.persist && MUI.Content.Providers[content.loadMethod].canPersist){
			// if given string to use as persist key then use it
			if (typeOf(content.persist) == 'string') content.persistKey = content.persist;
			if (typeOf(content.persist) == 'array') content.persistKey = content.persist;
			content.persist = true;
		} else content.persist = false;

		content.persistLoad = function(){
			this.persistKey = this.doPrepUrl(this);
			if (this.persist){
				if (typeOf(this.persistKey) == 'string'){
					// load the response
					var content = MUI.Persist.get(this.persistKey, this.url);
					if (content) return content;
				}
			}
			return this.content;
		}.bind(content);

		content.persistStore = function(response){
			if (!this.persist) return response;

			// store the response
			if (typeOf(this.persistKey) == 'string') MUI.Persist.set(this.persistKey, response, this.url);
			if (typeOf(this.persistKey) == 'array'){
				response = JSON.decode(response);
				this.persistKey.each(function(key){
					MUI.Persist.set(key, response[key], this.url);
				}, this);
				return null;
			}
			return response;
		}.bind(content);

		// prepare function to fire onLoaded event
		content.fireLoaded = function(){
			var fireEvent = true;
			var instance = this.instance;
			if (instance && instance.updateEnd) fireEvent = instance.updateEnd(this);
			if (fireEvent){
				if (this.require.js.length){
					// process javascript dependencies
					new MUI.Require({
						js: this.require.js,
						onload: function(){
							if (Browser.opera) this.require.onload.delay(100);
							else this.require.onload();
							if (this.onLoaded && this.onLoaded != null){
								this.onLoaded(element, this);
							} else {
								if (instance) instance.fireEvent('loaded', [element, this]);
							}
						}.bind(this)
					});
				} else {
					if (this.onLoaded && this.onLoaded != null){
						// call onLoaded directly
						this.onLoaded(element, this);
					} else {
						// fire the event
						if (instance) instance.fireEvent('loaded', [element, this]);
					}
				}
			}
		}.bind(content);

		// now perform dependencies requests for images and style sheets
		if (content.require.css.length || content.require.images.length){
			new MUI.Require({
				css: content.require.css,
				images: content.require.images,
				onload: function(){
					MUI.Content.Providers[this.loadMethod].doRequest(this);
				}.bind(content)
			});
		} else {
			MUI.Content.Providers[content.loadMethod].doRequest(content);
		}

		return content;
	},

	processFilters: function(content){
		if (typeof content == 'string') return content;
		Object.each(content.filters, function(filter){
			content.content = filter(content.content, content);
		});
		return content.content;
	},

	canPage:function(content){
		return !(!content || !content.fireLoaded || !content.paging || content.paging.pageSize <= 0 || content.paging.total == 0);
	},

	firstPage: function(content){
		if (!MUI.Content.canPage(content)) return this;
		content.paging.page = 1;
		if (content.instance && content.instance.updateStart) content.instance.updateStart(content);
		MUI.Content.Providers[content.loadMethod].doRequest(content);
		return this;
	},

	prevPage: function(content){
		if (!MUI.Content.canPage(content)) return this;
		content.paging.page--;
		if (content.paging.page < 1 && content.paging.wrap) return this.lastPage(content);
		if (content.paging.page < 1) content.paging.page = 1;
		if (content.instance && content.instance.updateStart) content.instance.updateStart(content);
		MUI.Content.Providers[content.loadMethod].doRequest(content);
		return this;
	},

	nextPage: function(content){
		if (!MUI.Content.canPage(content)) return this;
		content.paging.page++;
		var lastPage = Math.round(content.paging.total / content.paging.pageSize);
		if (content.paging.page > lastPage && content.paging.wrap) return this.firstPage();
		if (content.paging.page > lastPage) content.paging.page = lastPage;
		if (content.instance && content.instance.updateStart) content.instance.updateStart(content);
		MUI.Content.Providers[content.loadMethod].doRequest(content);
		return this;
	},

	lastPage: function(content){
		if (!MUI.Content.canPage(content)) return this;
		content.paging.page = Math.round(content.paging.total / content.paging.pageSize);
		if (content.instance && content.instance.updateStart) content.instance.updateStart(content);
		MUI.Content.Providers[content.loadMethod].doRequest(content);
		return this;
	},

	gotoPage: function(content, page){
		if (!MUI.Content.canPage(content)) return this;
		if (!page) page = 1;
		page = parseInt('' + page);
		var lastPage = parseInt(content.paging.total / content.paging.pageSize);
		if (page > lastPage) page = lastPage;
		if (page < 1) page = 1;
		content.paging.page = page;
		if (content.instance && content.instance.updateStart) content.instance.updateStart(content);
		MUI.Content.Providers[content.loadMethod].doRequest(content);
		return this;
	},

	setPageSize: function(content, max){
		var paging = content.paging;
		if (!MUI.Content.canPage(content)) return this;
		max = parseInt('' + max);
		if (max <= 0) return this;
		paging.pageSize = max;
		paging.page = 1;
		paging.pageMax = parseInt(paging.total / paging.pageSize);
		if (content.instance && content.instance.updateStart) content.instance.updateStart(content);
		MUI.Content.Providers[content.loadMethod].doRequest(content);
		return this;
	},

	setRecords: function(content){
		if (!content.content) return null;
		var paging = content.paging;

		var records;
		if (!paging || !paging.recordsField || !content.content[paging.recordsField]) records = content.content;
		else records = content.content[paging.recordsField];

		['total','page','pageMax','pageSize','page','last','first'].each(function(options, name){
			options.paging[name] = MUI.getData(options.content, options.paging[name + 'Field'], 0);
		}.bind(this, content));
		delete content.content;

		if (!content.fireLoaded || !paging || paging.pageSize <= 0)
			return content.records = records;

		if (!content.records) content.records = records;
		else {
			for (var i = 0,t = ((paging.page - 1) * paging.pageSize); i < records.length; i++,t++){
				content.records[t] = records[i];
			}
		}
	},

	getRecords: function(content){
		var records = content.records;
		if (!records) return null;
		var paging = content.paging;

		if (!content.fireLoaded || !paging || paging.pageSize <= 0) return records;

		var retval = [];
		for (var i = ((paging.page - 1) * paging.pageSize),t = 0; t < paging.pageSize && i < records.length; i++,t++){
			retval[t] = records[i];
		}
		return retval;
	}

});

MUI.Content.Filters.tree = function(response, content, node){
	var usePaging = node == null && content.paging && content.paging.size > 0 && content.paging.recordsField;
	var data = response, i;

	if (node == null) content = Object.append(content, {
		fieldParentID: 'parentID',
		fieldID: 'ID',
		fieldNodes: 'nodes',
		topID: '0'
	});

	if (usePaging) data = response[content.paging.recordsField];

	if (node == null){
		for (i = 0; i < data.length; i++){
			if (data[i][content.fieldID] == content.topID){
				node = data[i];
				break;
			}
		}
	}

	if (node != null){
		var id = node[content.fieldID];
		node[content.fieldNodes] = [];
		for (i = 0; i < data.length; i++){
			if (data[i][content.fieldParentID] == id && data[i][content.fieldID] != id){
				node[content.fieldNodes].push(data[i]);
				MUI.Content.Filters.tree(data, content, data[i]);
			}
		}
	}

	if (usePaging) response[content.paging.recordsField] = node;

	return node;
};

MUI.Content.Providers.xhr = {

	canPersist:		true,

	canPage:		false,

	doRequest: function(content){
		// if js is required, but no url, fire loaded to proceed with js-only
		if (content.url == null && content.require.js && content.require.js.length != 0){
			Browser.ie6 ? content.fireLoaded.delay(50, content) : content.fireLoaded();
			return null;
		}

		// load persisted data if it exists
		content.content = content.persistLoad(content);

		// process content passed to options.content or persisted data
		if (content.content){
			content.content = MUI.Content.processFilters(content);
			Browser.ie6 ? content.fireLoaded.delay(50, content) : content.fireLoaded();
			return;
		}

		var request = new Request({
			url: content.persistKey,
			method: content.method ? content.method : 'get',
			data: content.data ? new Object(content.data).toQueryString() : '',
			evalScripts: function(script){
				content.javascript = script;
			},
			evalResponse: false,
			onRequest: function(){
				MUI.showSpinner(this.instance);
			}.bind(content),
			onFailure: function(response){
				var content = this;
				var instance = this.instance;
				var getTitle = new RegExp('<title>[\n\r\\s]*(.*)[\n\r\\s]*</title>', 'gmi');
				var error = getTitle.exec(response.responseText);
				if (!error) error = [500, 'Unknown'];

				var updateSetContent = true;
				content.error = error;
				content.errorMessage = '<h3>Error: ' + error[1] + '</h3>';
				if (instance && instance.updateSetContent) updateSetContent = instance.updateSetContent(content);
				if (this.element){
					if (updateSetContent) this.element.set('html', content.errorMessage);
					MUI.hideSpinner(instance);
				}
			}.bind(content),
			onSuccess: function(text){
				content = this._content;
				var instance = content.instance;
				text = content.persistStore(text);
				text = MUI.Content.processFilters(text, content);
				MUI.hideSpinner(instance);

				var js = content.javascript, html = text;

				// convert text files to html
				if (this.getHeader('Content-Type') == 'text/plain') html = html.replace(/\n/g, '<br>');

				var updateSetContent = true;
				content.content = html;
				if (instance && instance.updateSetContent) updateSetContent = instance.updateSetContent(content);
				if (updateSetContent){
					if (content.element) content.element.set('html', content.content);
					var evalJS = true;
					if (instance && instance.options && instance.options.evalScripts) evalJS = instance.options.evalScripts;
					if (evalJS && js) Browser.exec(js);
				}

				Browser.ie6 ? content.fireLoaded.delay(50, content) : content.fireLoaded();
			},
			onComplete: function(){
			}
		});
		request._content = content;
		request.send();
	}
};

MUI.Content.Providers.json = {

	canPersist:		true,

	canPage:		 true,

	_checkRecords: function(content){  // check to see if records already downloaded and fir onLoaded if it does
		var paging = content.paging;
		if (content.records && paging.pageSize == 0){
			Browser.ie6 ? content.fireLoaded.delay(50, content) : content.fireLoaded();
			return true;	// return them all if they exists and paging is turned off
		}
		if (content.records && content.records.length && paging.pageSize > 0){	// if paging is on make sure we have that page
			var first = ((paging.page - 1) * paging.pageSize);
			var last = first + paging.pageSize - 1;
			var total = content.records.length;
			//if (!paging.pageMax) paging.pageMax = parseInt(paging.total / paging.pageSize);
			if (total > first && total > last){
				for (var i = first; i <= last; i++){
					if (!content.records[i]) return false;
				}
				// if in scope then fire loaded to make control know we have the records
				Browser.ie6 ? content.fireLoaded.delay(50, content) : content.fireLoaded();
				return true
			}
		}
		return false;
	},

	_onSuccess: function(json){
		this.persistStore(json);
		if (json != null){	// when multiple results are persisted, null is returned.  decoding takes place in persistStore instead, and filtering is not allowed
			if (typeof(json) == 'string') json = JSON.decode(json);
			this.content = json;
			MUI.Content.setRecords(this);
			json = MUI.Content.processFilters(this);
		}
		MUI.hideSpinner(this.instance);
		Browser.ie6 ? this.fireLoaded.delay(50, this) : this.fireLoaded();
	},

	doRequest: function(content){
		if (content.content && !content.url){
			Browser.ie6 ? content.fireLoaded.delay(50, this) : content.fireLoaded();
			return;
		}

		if (!this._checkRecords(content)){
			// load persisted data if it exists
			content.content = JSON.decode(content.persistLoad(content));
			MUI.Content.setRecords(content);												// see if any records are there
		} else content.persistKey = content.doPrepUrl(content);

		if (!this._checkRecords(content)){
			if (content.loadMethod == 'jsonp'){
				new Request.JSONP({
					url: content.persistKey,
					callbackKey: (content.callbackKey ? content.callbackKey : 'callback'),
					data: content.data ? new Hash(content.data).toQueryString() : '',
					onRequest: function(){
						MUI.showSpinner(this.instance);
					}.bind(content),
					onComplete: this._onSuccess.bind(content),
					onCancel: function(){
						MUI.hideSpinner(this.instance);
					}.bind(content)
				}).send();
			} else {
				// still not found so load
				new Request({
					url: content.persistKey,
					update: content.element,
					method: content.method ? content.method : 'get',
					data: content.data ? new Object(content.data).toQueryString() : '',
					evalScripts: false,
					evalResponse: false,
					headers: {'Content-Type':'application/json'},
					onRequest: function(){
						MUI.showSpinner(this.instance);
					}.bind(content),
					onFailure: function(){
						var updateSetContent = true;
						this.error = [500, 'Error Loading XMLHttpRequest'];
						this.errorMessage = '<p><strong>Error Loading XMLHttpRequest</strong></p>';
						if (this.instance && this.instance.updateSetContent) updateSetContent = this.instance.updateSetContent(this);

						if (this.element){
							if (updateSetContent) this.element.set('html', this.errorMessage);
							this.element.hideSpinner(this.instance);
						}
					}.bind(content),
					onException: function(){}.bind(content),
					onSuccess: this._onSuccess.bind(content),
					onComplete: function(){}.bind(content)
				}).send();
			}
		}
	}
}
		;

MUI.Content.Providers.jsonp = MUI.Content.Providers.json;

MUI.Content.Providers.iframe = {

	canPersist:		false,

	canPage:		false,

	doRequest: function(content){
		var updateSetContent = true;
		var instance = content.instance;
		if (instance && instance.updateSetContent) updateSetContent = instance.updateSetContent(content);
		var element = content.element;

		if (updateSetContent && element){
			var iframeEl = new Element('iframe', {
				id: element.id + '_iframe',
				name: element.id + '_iframe',
				'class': 'mochaIframe',
				src: content.doPrepUrl(content),
				marginwidth: 0,
				marginheight: 0,
				frameBorder: 0,
				scrolling: 'auto',
				styles: {
					height: element.offsetHeight - element.getStyle('border-top').toInt() - element.getStyle('border-bottom').toInt(),
					width: instance && instance.el.panel ? element.offsetWidth - element.getStyle('border-left').toInt() - element.getStyle('border-right').toInt() : '100%'
				}
			}).inject(element);
			if (instance) instance.el.iframe = iframeEl;

			// Add onload event to iframe so we can hide the spinner and run fireLoaded()
			iframeEl.addEvent('load', function(){
				MUI.hideSpinner(instance);
				Browser.ie6 ? this.fireLoaded.delay(50, this) : this.fireLoaded();
			}.bind(content));
		}
	}

};

MUI.Content.Providers.html = {

	canPersist:		false,

	canPage:		false,

	doRequest: function(content){
		var elementTypes = new Array('element', 'textnode', 'whitespace', 'collection');

		var updateSetContent = true;
		if (content.instance && content.instance.updateSetContent) updateSetContent = content.instance.updateSetContent(content);
		if (updateSetContent && content.element){
			if (elementTypes.contains(typeOf(content.content))) content.content.inject(content.element);
			else content.element.set('html', content.content);
		}

		Browser.ie6 ? content.fireLoaded.delay(50, content) : content.fireLoaded();
	}

};

MUI.Content.Providers.control = {

	canPersist:		false,

	canPage:		false,

	doRequest: function(content){
		//var options2 = content.options;
		// remove unneeded items that cause recursion
		// delete content.options;
		delete content.instance;
		MUI.create(content);
	}

};

MUI.append({

	WindowPanelShared: {

		/// intercepts workflow from MUI.Content.update
		/// sets title and scroll bars of this window
		updateStart: function(options){
			if (!options.position) options.position = 'content';
			if (options.position == 'content'){
				options.element = this.el.content;
				this.addPadding(options);

				// set title if given option to do so
				if (options.title && this.el && this.el.title){
					this.options.title = options.title;
					this.el.title.set('html', options.title);
				}

				// Set scrollbars if loading content in main content container.
				// Always use 'hidden' for iframe windows
				this.el.contentWrapper.setStyles({
					'overflow': this.options.scrollbars && options.loadMethod != 'iframe' ? 'auto' : 'hidden'
				});
			}
			return false;  // not used but expected
		},

		/// intercepts workflow from MUI.Content.update
		updateClear: function(options){
			if (options.position == 'content'){

				this.el.content.show();
				
				var iframes = this.el.contentWrapper.getElements('.mochaIframe');		
				if(iframes.length > 0){
					iframes.destroy();
				}
				
				this.el.contentWrapper.getElements('.column').each(function(column_el){						
						column_el.getElements('.panel').each(function(panel_el){
							panel_el.retrieve('instance').close();							
							MUI.erase(panel_el);							
						});
						column_el.retrieve('instance').close();
						MUI.erase(column_el);
				});

				MUI.WindowPanelShared.empty.apply(this);
				
				if (this.el.content.getParent() == null) this.el.content.inject(this.el.element);					
				

				return false;
			}
			return true;
		},

		/// intercepts workflow from MUI.Content.update
		updateSetContent: function(options){
			if (options.position == 'content'){
				if (options.loadMethod == 'html'){					
					this.el.content.show();				
				}
				if (options.loadMethod == 'iframe'){									
					this.el.content.hide();
					options.element = this.el.contentWrapper;
				}
			}
			return true;	// tells MUI.Content.update to update the content
		},

		addPadding: function(options){
			if (!options) options = Object.clone(this.options);

			if (options.padding == null) options.padding = this.options.padding;
			if (options.padding || options.padding == 0){
				// copy padding from main options if not passed in
				if (typeOf(options.padding) != 'number')
					Object.append(options.padding, this.options.padding);
				if (typeOf(options.padding) == 'number')
					options.padding = {top: options.padding, left: options.padding, right: options.padding, bottom: options.padding};

				// update padding if requested
				this.el.content.setStyles({
					'padding-top': options.padding.top,
					'padding-bottom': options.padding.bottom,
					'padding-left': options.padding.left,
					'padding-right': options.padding.right
				});
			}
			return this;
		},

		removePadding: function(){
			this.el.content.setStyle('padding', 0);
			return this;
		},

		empty: function(){
			MUI.erase(this.el.content.getChildren());
			this.el.content.empty();
			return this;
		},

		getSection: function(section){
			var retval;
			this.sections.each(function(s){
				if (s.section == section) retval = s;
			});
			return retval;
		}
	},

	update: MUI.Content.update,

	getData: function(item, property, dfault){
		if (!dfault) dfault = '';
		if (!item || !property) return dfault;
		if (item[property] == null) return dfault;
		return item[property];
	}

});

MUI.Content.PagingOptions = {
	// main paging options
	pageSize:		0,			// if >0 then paging is turned on
	page:			0,			// the page index offset (index*size)+1 = first record, (index*size)+size = last record
	pageMax:		0,			// the last page in the that (largest value of index).

	// informational values, set by return results, if they are change after contents are returned, they can be used to change what the pager is displaying
	total:			0,			// starts out as zero until filled in when data is received
	first:			1,			// first record showing in current page
	last:			10,			// last record showing in current page

	// additional options
	sort:			'',			// fields to search by, comma separated list of fields or array of strings.  Will be passed to server end-point.
	dir:			'asc',		// 'asc' ascending, 'desc' descending
	recordsField:	'data',		// 'element' in the json hash that contains the data
	totalField:		'total',	// 'element' in the json hash that contains the total records in the overall set
	pageField:		'page',		// 'element' in the json hash that contains the maximum pages that can be selected
	pageMaxField:	'pageMax',	// 'element' in the json hash that contains the maximum pages that can be selected
	pageSizeField:	'pageSize',	// 'element' in the json hash that contains the size of the page
	firstField:		'first',	// 'element' in the json hash that contains the size of the page
	lastField:		'last',		// 'element' in the json hash that contains the maximum pages that can be selected
	lookAhead:		0,			// # of pages to request in the background and cache
	wrap:			false,		// true if you want paging to wrap when user hits next page and they are at the last page, or from the first to the last page

	pageOptions:	[10, 20, 50, 100, 200]	// per page options available to user
};


/*
 ---

 name: Persist

 script: persist.js

 description: MUI - Provides the ability to cache data in the browser

 copyright: (c) 2011 Contributors in (/AUTHORS.txt).

 license: MIT-style license in (/MIT-LICENSE.txt).

 authors:
 original - Paul Duncan (paul@pablotron.org) <http://github.com/jeremydurham/persist-js>
 mootools adaptation - Chris Doty

 requires:
 - Core/Element
 - Core/Class
 - Core/Options
 - Core/Events
 - MUI
 - MUI.Core
 - MUI.Require

 provides: [
 MUI.Persist,
 MUI.Persist.Providers.Gears,
 MUI.Persist.Providers.WhatWG,
 MUI.Persist.Providers.GlobalStorage,
 MUI.Persist.Providers.LocalStorage,
 MUI.Persist.Providers.IE,
 MUI.Persist.Providers.Cookie,
 MUI.Persist.Providers.Flash
 ]
 ...
 */

MUI.Persist = Object.append((MUI.Persist || {}), {
	options: {
		name: 'MUI',								// Name added to keys in some of the providers.
		provider: 'auto',							// The name of the provider to use, defaults to auto.

		searchOrder:[
			'LocalStorage',
			'GlobalStorage',
			'Gears',
			'WhatWG',
			'Cookie',
			'IE',
			'Flash'
		],

		sql: {								// sql for db providers (gears and db)
			create:   "CREATE TABLE IF NOT EXISTS persist_data (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL)",
			get:	  "SELECT v FROM persist_data WHERE k = ?",
			set:	  "INSERT INTO persist_data(k, v) VALUES (?, ?)",
			remove:   "DELETE FROM persist_data WHERE k = ?"
		},

		flash: {											// default flash configuration
			divID:		'_persist_flash_wrap',	// ID of wrapper element
			id:			'_persist_flash',				// id of flash object/embed
			path:		'persist.swf',					// default path to flash object
			height:		1,
			width:		1,
			params:	{									// arguments passed to flash object
				autostart: true
			}

		}

		//onGet:      null,
		//onSet:      null,
		//onRemove:   null
	},

	Providers: {},						// hash used to store the providers initialized below.

	ProviderTests: {					// hash of test functions used to test for the different providers
		'Gears': function(){
			return (window.google && window.google.gears) ? true : false;
		},

		'WhatWG': function(){
			if (!window.openDatabase) return false;
			return window.openDatabase('PersistJS Test', 1, 'Persistent database test.', this.size);
		},

		'GlobalStorage': function(){
			if (window.globalStorage){
				var domain = '127.0.0.1';
				if (this.o && this.o.domain) domain = this.o.domain;
				try{
					var dontcare = globalStorage[domain];
					return true;
				} catch(e){
					if (window.console && window.console.warn)
						console.warn("globalStorage exists, but couldn't use it because your browser is running on domain:", domain);
					return false;
				}
			} else {
				return false;
			}
		},

		'LocalStorage': function(){
			return (window.localStorage ? true : false);
		},

		'IE': function(){
			return window.ActiveXObject ? true : false;
		},

		'Cookie':function(){
			return P.Cookie.enabled ? true : false;
		},

		'Flash':function(){
			return Browser.Plugins.Flash.version >= 8;
		}
	},

	initialize: function(options){

		// set the options
		if (options) Object.append(MUI.Persist.options, options);
		options = MUI.Persist.options;

		// if provider is set to auto then set to false
		if (options.provider == 'auto') options.provider = false;

		// if no provider requested than
		if (!options.provider){
			// loop over all providers and test for each one
			var keys = options.searchOrder;
			for (var i = 0, len = keys.length; i < len; i++){
				var provider = this.ProviderTests[keys[i]];
				if (provider && provider()){
					options.provider = keys[i];
					break;
				}
			}
		}

		// if we have a provider than create and initialize it
		if (options.provider){
			this._providerClass = 'MUI.Persist.Providers.' + options.provider;
			var klass = MUI['Persist']['Providers'][options.provider];
			this.currentProvider = new klass();
			this.size = this.currentProvider.options.size;
		}
	},

	get: function(key, group){
		if(group && !MUI.Persist.hasGroupKey(group,key)) return null;
		// get a provider if needed and get the requested value
		if (!this.currentProvider) this.initialize();
		return this.currentProvider.get(key);
	},

	hasGroupKey: function(group,key) {
		var keys = MUI.Persist.getGroupKeys(group);
		if(!key && keys!=null) return true;
		if(keys && key) {
			for(var i=0;i<keys.length;i++) {
				if(keys[i]==key) return true;
			}
		}
		return false;
	},

	getGroupKeys: function(group) {
		var keys = MUI.Persist.get(group);
		if (keys) return keys = keys.split('|');
		return null;
	},

	addGroupKey: function(group,key) {
		var keys = MUI.Persist.getGroupKeys(group);
		if (keys) keys.push();
		else keys = [key];
		MUI.Persist.set(group, keys.join('|'));
	},

	set: function(key, val, group){
		if (group) MUI.Persist.addGroupKey(group,key);

		// get a provider if needed and set the requested value
		if (!this.currentProvider) this.initialize();
		return this.currentProvider.set(key, val);
	},

	remove: function(key){
		// get a provider if needed and remove the requested value
		if (!this.currentProvider) this.initialize();
		return this.currentProvider.remove(key);
	},

	clear: function(group){
		var keys = MUI.Persist.get(group);
		if (keys){
			keys = keys.split('|');
			keys.each(function(key){
				MUI.Persist.remove(key);
			});
		}
	}
});

MUI.Persist.Providers.Gears = new Class({

	Implements: [Events,Options],

	options: {
		size:	-1
	},

	initialize: function(options){
		// process options
		Object.append(this.options, MUI.Persist.options);
		this.setOptions(options);

		// create database and table
		var db;
		db = this.db = google.gears.factory.create('beta.database');
		db.open(this._safeKey(this.options.name));
		db.execute(this.options.sql.create).close();
	},

	get: function(key){
		// get the value from the table
		var val;
		this._transaction(function (t){

			var row = t.execute(this.options.sql.get, [key]);
			var valid = row.isValidRow();
			val = valid ? row.field(0) : null;
			row.close();

			this.fireEvent('get', [this,val,key]);
		});

		return val;
	},

	set: function(key, val){
		var old_val = this.get(key);	// get previous value

		this._transaction(function(t){
			t.execute(this.options.sql.remove, [key]).close();		// delete previous value
			t.execute(this.options.sql.set, [key, val]).close();	// set the value

			this.fireEvent('set', [this,val,key,old_val]);
		});

		return old_val;
	},

	remove: function(key){
		var old_val = this.get(key);	// get previous value

		this._transaction(function(t){
			// deletes value from the table
			t.execute(this.options.sql.remove, [key]).close();

			this.fireEvent('remove', [this,old_val,key]);
		});

		return old_val;
	},

	_transaction: function(fn){
		var db = this.db;
		db.execute('BEGIN').close();
		fn.call(this, db);
		db.execute('COMMIT').close();
	},

	_safeKey: function(str){
		return str.replace(/_/g, '__').replace(/ /g, '_s');
	}

});

MUI.Persist.Providers.WhatWG = new Class({

	Implements: [Events,Options],

	options: {
		size:	200 * 1024		// size based on DatabaseExample from above (should I increase this?)
	},

	initialize: function(options){
		// process options
		Object.append(this.options, MUI.Persist.options);
		this.setOptions(options);

		// create the database
		this.db = openDatabase(this.options.name, 1, 'Persistent storage for MochaUI', this.options.size);
	},

	get: function(key){
		var val;

		this._transaction(function (t){
			// get the value from the database
			t.executeSql(this.options.sql.get, [key], function(t, r){
				val = r.rows.length > 0 ? r.rows.item(0).v : null;
				this.fireEvent('get', [this,val,key]);
			}.bind(this));
		});

		return val;
	},

	set: function(key, val){
		var old_val = this.get(key); // get previous value

		this._transaction(function(t){
			t.executeSql(this.options.sql.remove, [key], function(){
				t.executeSql(this.options.sql.set, [key, val], function(){
					this.fireEvent('set', [this,val,key,old_val]);
				}.bind(this));
			}.bind(this));
		});

		return old_val;
	},

	remove: function(key){
		var old_val;

		this._transaction(function(t){
			t.executeSql(this.options.sql.get, [key], function(t, r){
				if (r.rows.length > 0){
					old_val = r.rows.item(0).v;  // get previous value

					t.executeSql(this.options.sql.remove, [key]);  // remove the key
					this.fireEvent('set', [this,old_val,key]);
				}
			}.bind(this));
		});

		return old_val;
	},

	_transaction: function(fn){
		if (!this.db_created){
			this.db._transaction(function(t){
				t.executeSql(this.options.sql.create, [], function(){
					this.db_created = true;
				}.bind(this));
			}.bind(this), function(){
			});
		}
		this.db._transaction(fn.bind(this));
	},

	_safeKey: function(str){
		return str.replace(/_/g, '__').replace(/ /g, '_s');
	}

});

MUI.Persist.Providers.GlobalStorage = new Class({

	Implements: [Events,Options],

	options: {
		size:	5 * 1024 * 1024		// (5 meg limit, src: http://ejohn.org/blog/dom-storage-answers/)
	},

	initialize: function(options){
		// process options
		Object.append(this.options, MUI.Persist.options);
		this.setOptions(options);

		// cleanup domain option
		var o = this.options;
		o.domain = o.domain || location.host || 'localhost';
		o.domain = o.domain.replace(/:\d+$/, '');

		// create data store
		this.store = globalStorage[o.domain];
	},

	_key: function(key){
		return this._safeKey(this.options.name) + this._safeKey(key);
	},

	get: function(key){
		key = this._key(key);
		var val = this.store.getItem(key);  // get current value
		this.fireEvent('get', [this,val,key]);
		return val;
	},

	set: function(key, val){
		key = this._key(key);

		var old_val = this.store.getItem(key); // get previous value
		this.store.setItem(key, val); // store new value
		this.fireEvent('set', [this,val,key,old_val]);

		return old_val;
	},

	remove: function(key){
		key = this._key(key);

		var old_val = this.store.getItem(key); // get previous value
		this.store.removeItem(key); // remove the key
		this.fireEvent('remove', [this,old_val,key]);

		return old_val;
	},

	_safeKey: function(str){
		return str.replace(/_/g, '__').replace(/ /g, '_s');
	}

});

MUI.Persist.Providers.LocalStorage = new Class({

	Implements: [Events,Options],

	options: {
		prefix:	'_persist_data-'
	},

	initialize: function(options){
		// process options
		Object.append(this.options, MUI.Persist.options);
		this.setOptions(options);

		this.store = localStorage;
	},

	get: function(key){
		key = this._safeKey(key);

		var val = this.store.getItem(key);  // get current value
		this.fireEvent('get', [this,val,key]);

		return val;
	},

	set: function(key, val){
		key = this._safeKey(key);

		var old_val = this.store.getItem(key);  // get previous value
		this.store.setItem(key, val);  // store new value
		this.fireEvent('set', [this,val,key,old_val]);

		return old_val;
	},

	remove: function(key){
		key = this._safeKey(key);

		var old_val = this.store.getItem(key); // get previous value
		this.store.removeItem(key);	// remove the key
		this.fireEvent('remove', [this,old_val,key]);

		return old_val;
	},

	_safeKey: function(str){
		return str.replace(/_/g, '__').replace(/ /g, '_s');
	}

});

MUI.Persist.Providers.IE = new Class({

	Implements: [Events,Options],

	options: {
		prefix:	'_persist_data-',
		size: 64 * 1024				// 64k limit
	},

	initialize: function(options){
		// process options
		Object.append(this.options, MUI.Persist.options);
		this.setOptions(options);

		// create element to store keys in
		this.id = this.options.prefix + this._safeKey(this.options.name);
		this.el = new Element('div', {'id': this.id, styles: {'display': 'none'}}).inject(document.body);
	},

	get: function(key){
		key = this._safeKey(key);

		var val = this.el.retrieve(key); // get current value
		this.fireEvent('get', [this, val, key]);

		return val;
	},

	set: function(key, val){
		key = this._safeKey(key);

		var old_val = this.el.retrieve(key);  // get previous value
		this.el.store(key, val);  // store new value
		this.fireEvent('set', [this, val, key, old_val]);

		return old_val;
	},

	remove: function(key){
		key = this._safeKey(key);

		var old_val = this.el.retrieve(key);  // get previous value
		this.el.eliminate(key);  // remove key
		this.fireEvent('remove', [this, old_val, key]);

		return old_val;
	},

	_safeKey: function(str){
		return str.replace(/_/g, '__').replace(/ /g, '_s');
	}

});

MUI.Persist.Providers.Cookie = new Class({

	Implements: [Events, Options],

	options: {
		size:	4000,			// 4k limit (low-ball this limit to handle browser weirdness, and so we don't hose session cookies)
		delim: ':',
		domain: false,
		path: false,
		duration: 365,
		secure: false
	},

	initialize: function(options){
		// process options
		Object.append(this.options, MUI.Persist.options);
		this.setOptions(options);

		// cleanup domain option
		var o = this.options;
		o.domain = o.domain || location.host || 'localhost';
		o.domain = o.domain.replace(/:\d+$/, '');
		o.domain = (o.domain == 'localhost') ? '' : o.domain;
	},

	get: function(key){
		key = this._safeKey(key);

		var val = Cookie.read(key);  // get current value
		this.fireEvent('get', [this, val, key]);

		return val;
	},

	set: function(key, val){
		key = this._safeKey(key);

		var old_val = Cookie.read(key);  //get previous value
		Cookie.write(key, val, this.options);  // store new value
		this.fireEvent('set', [this, val, key, old_val]);

		return old_value;
	},

	remove: function(key){
		key = this._safeKey(key);

		var old_val = Cookie.read(key); // get old value
		Cookie.dispose(key, this.options); // remove key
		this.fireEvent('remove', [this, old_val, key]);

		return old_val;
	},

	_safeKey: function(key){
		return this.options.name + this.options.delim + key;
	}

});

MUI.Persist.Providers.Flash = new Class({

	Implements: [Events,Options],

	options: {
		size:	-1
	},

	initialize: function(options){
		Object.append(this.options, MUI.Persist.options);
		this.setOptions(options);
		if (!MUI.Persist.options.flash.el){
			var cfg = this.options.flash;
			cfg.container = new Element('div', {'id': this.options.flash.divID}).inject(document.body);
			MUI.Persist.options.flash.el = new Swiff(cfg.path, cfg);
		}
		this.el = MUI.Persist.options.flash.el;
	},

	get: function(key){
		key = this._safeKey(key);

		var val = this.el.get(this.options.name, key);  // get current value
		this.fireEvent('get', [this, val, key]);

		return val;
	},

	set: function(key, val){
		key = this._safeKey(key);

		var old_val = this.el.set(this.options.name, key, val);  // get previous value, set new value
		this.fireEvent('set', [this, val, key, old_val]);

		return old_val;
	},

	remove: function(key){
		key = this._safeKey(key);

		var old_val = this.el.remove(this.options.name, key);  // remove key, and return previous value
		this.fireEvent('remove', [this, val, key]);

		return old_val;
	},

	_safeKey: function(str){
		return str.replace(/_/g, '__').replace(/ /g, '_s');
	}

});


/*
 * The contents of gears_init.js; we need this because Chrome supports
 * Gears out of the box, but still requires this constructor.  Note that
 * if you include gears_init.js then this function does nothing.
 */
(function(){
	// We are already defined. Hooray!
	if (window.google && google.gears) return;

	// factory
	var F = null;

	// Firefox
	if (typeof GearsFactory != 'undefined'){
		F = new GearsFactory();
	} else {
		// IE
		try{
			F = new ActiveXObject('Gears.Factory');
			// privateSetGlobalObject is only required and supported on WinCE.
			if (F.getBuildInfo().indexOf('ie_mobile') != -1){
				F.privateSetGlobalObject(this);
			}
		} catch (e){
			// Safari
			if ((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes["application/x-googlegears"]){
				F = new Element('object', {width:0,height:0,type:'application/x-googlegears',styles:{display:'name'}}).inject(document.documentElement);
			}
		}
	}

	// *Do not* define any objects if Gears is not installed. This mimics the
	// behavior of Gears defining the objects in the future.
	if (!F) return;

	// Now set up the objects, being careful not to overwrite anything.
	//
	// Note: In Internet Explorer for Windows Mobile, you can't add properties to
	// the window object. However, global objects are automatically added as
	// properties of the window object in all browsers.
	if (!window.google) google = {};
	if (!google.gears) google.gears = {factory: F};
})();


/*
 ---

 script: themes.js

 description: MUI - Allows for switching themes dynamically.

 copyright: (c) 2011 Contributors in (/AUTHORS.txt).

 license: MIT-style license in (/MIT-LICENSE.txt).

 note:
 This documentation is taken directly from the javascript source files. It is built using Natural Docs.

 syntax:
 (start code)
 new MUI.Themes.init(newTheme);
 (end)

 example:
 (start code)
 new MUI.Themes.init('charcoal');
 (end)

 arguments:
 newTheme - (string) The theme name

 requires:
 - Core/Element
 - Core/Class
 - Core/Options
 - Core/Events
 - MUI
 - MUI.Core

 provides: [MUI.Themes]
 ...
 */

MUI.Themes = {

	init: function(newTheme){
		this.newTheme = newTheme.toLowerCase();
		if (!this.newTheme || this.newTheme == null || this.newTheme == MUI.options.theme.toLowerCase()) return false;

		if ($('spinner')) $('spinner').show();

		this.oldURIs = [];
		this.oldSheets = [];
		var themesPath = MUI.replacePaths(MUI.options.path.themes);

		$$('link').each(function(link){
			var href = link.get('href');
			if (href.contains(themesPath + MUI.options.theme)){
				this.oldURIs.push(href);
				this.oldSheets.push(link);
			}
		}.bind(this));

		Object.each(MUI.files, function(value, key){
			if (key.contains(themesPath + MUI.options.theme)){
				this.oldURIs.push(key);
			}
		}.bind(this));

		this.newSheetURLs = this.oldURIs.map(function(item){
			return item.replace('/' + MUI.options.theme + '/', '/' + MUI.Themes.newTheme + '/');
		}.bind(this));

		this.sheetsToLoad = this.oldURIs.length;
		this.sheetsLoaded = 0;

		// Download new stylesheets and add them to an array
		this.newSheets = [];
		this.newSheetURLs.each(function(link){
			var href = link;
			var cssRequest = new Request({
				method: 'get',
				url: href,
				onComplete: function(){
					var newSheet = new Element('link', {
						'rel': 'stylesheet',
						'media': 'screen',
						'type': 'text/css',
						'href': href
					});
					this.newSheets.push(newSheet);
				}.bind(this),
				onFailure: function(){
					this.themeLoadSuccess = false;
					if ($('spinner')) $('spinner').hide();
					MUI.notification('Stylesheets did not load.');
				},
				onSuccess: function(){
					this.sheetsLoaded++;
					if (this.sheetsLoaded == this.sheetsToLoad){
						this.updateThemeStyleSheets();
						this.themeLoadSuccess = true;
					}
				}.bind(this)
			});
			cssRequest.send();

		}.bind(this));

		return true;
	},

	updateThemeStyleSheets: function(){

		this.oldSheets.each(function(sheet){
			sheet.destroy();
		});

		this.newSheets.each(function(sheet){
			MUI.files[sheet.get('href')] = 'loaded';
			sheet.inject(document.head);
		});

		// Delay gives the stylesheets time to take effect. IE6 needs more delay.
		if (Browser.ie){
			this.redraw.delay(1250, this);
		} else {
			this.redraw.delay(250, this);
		}

	},

	redraw: function(){

		$$('.replaced').removeClass('replaced');

		// Redraw open windows
		$$('.mocha').each(function(element){
			var instance = element.retrieve('instance');

			// Convert CSS colors to Canvas colors.
			instance._setColors();
			instance.redraw();
		});

		if (MUI.taskbar) MUI.taskbar.setTaskbarColors();

		// Reformat layout
		if (MUI.Desktop && MUI.Desktop.desktop){
			var checker = (function(){
				// Make sure the style sheets are really ready.
				if (MUI.Desktop.desktop.getStyle('overflow') != 'hidden'){
					return;
				}
				clearInterval(checker);
				MUI.Desktop.setDesktopSize();
			}).periodical(50);
		}

		if ($('spinner')) $('spinner').hide();
		MUI.options.theme = this.newTheme;
	}
};
