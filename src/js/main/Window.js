function Window(parameters) {

	c.log('Window!');

	this.id = parameters.id;
	this.handle = true;
	this.omnibox = true;
	
	this.browser = new BrowserWindow({
	  width: 800,
	  height: 500,
	  frame: false,
	  backgroundColor: '#000',
	  x: parameters.x ? parameters.x : 890,
	  y: parameters.y ? parameters.y : 660
	});

	this.attachEvents();
	this.browser.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	// this.browser.webContents.openDevTools();
}

Window.prototype.attachEvents = function() {
	this.browser.webContents.on('did-finish-load', this.onReady.bind(this));
	this.browser.on('closed', this.dispose.bind(this));

	ipcMain.on('setOmniboxShow', this.setOmniboxShow.bind(this));
	ipcMain.on('setOmniboxHide', this.setOmniboxHide.bind(this));
}

Window.prototype.onReady = function() {
	this.browser.webContents.send('ready');
	this.registerCommands();
}

Window.prototype.registerCommands = function() {
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Toggle handle',
			'accelerator' : 'command+/',
			'callback' : this.toggleHandle.bind(this)
		})
	);
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Toggle omnibox',
			'accelerator' : 'command+l',
			'callback' : this.toggleOmnibox.bind(this)
		})
	);
}

Window.prototype.setOmniboxShow = function() {
	this.omnibox = true;
}

Window.prototype.setOmniboxHide = function() {
	this.omnibox = false;
}

Window.prototype.showOmnibox = function() {
	c.log('Showing Omnibox');
	this.omnibox = true;
	this.browser.webContents.send('showOmnibox');
}

Window.prototype.hideOmnibox = function() {
	c.log('Hiding Omnibox');
	this.omnibox = false;
	this.browser.webContents.send('hideOmnibox');
}

Window.prototype.toggleHandle = function() {
	if(this.handle) {
		c.log('Hiding handle!');
		this.handle = false;
		this.browser.webContents.send('hideHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] - 22
		);
	}
	else {
		c.log('Showing handle!');
		this.handle = true;
		this.browser.webContents.send('showHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] + 22
		);
	}
}

Window.prototype.toggleOmnibox = function() {
	c.log('Toggling Omnibox');
	if(this.omnibox) {
		this.hideOmnibox();
	}
	else {
		this.showOmnibox();
	}
}

Window.prototype.dispose = function() {
	this.browser = null;
}