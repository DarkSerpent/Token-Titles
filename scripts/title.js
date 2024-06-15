Hooks.once('init', async function() {
  console.log('Token Titles Module by Amarulence | Initializing token title module!');

  Hooks.on('renderTokenConfig', (app, html, data) => {
    const token = data.object;
    const flags = token.flags || {};
    const tokenTitle = flags.tokenTitle || '';

    const titleHtml = `
      <div class="form-group">
        <label>Token Title</label>
        <input type="text" name="flags.tokenTitle" value="${tokenTitle}">
      </div>`;

    const displayNameField = html.find('select[name="displayName"]').closest('.form-group');
    displayNameField.after(titleHtml);
  });
});

Hooks.on('updateToken', (scene, token, updates) => {
  console.log('updateToken hook triggered');
  if (updates.flags?.tokenTitle !== undefined) {
    console.log('Token title updated:', updates.flags.tokenTitle);
    const tokenObj = canvas.tokens.get(token._id);
    if (tokenObj) {
      updateTokenTitle(tokenObj);
    }
  }
});

Hooks.on('createToken', (scene, token) => {
  console.log('createToken hook triggered');
  const tokenObj = canvas.tokens.get(token._id);
  if (tokenObj) {
    updateTokenTitle(tokenObj);
  }
});

function updateTokenTitle(token) {
  console.log('Updating token title for:', token);
  const title = token.document.flags?.tokenTitle || '';
  console.log('Token title is:', title);

  let nameplate = token.children.find(c => c.name === "nameplate");
  if (!nameplate) {
    console.log('Nameplate not found, creating new nameplate');
    nameplate = new PIXI.Container();
    nameplate.name = "nameplate";
    token.addChild(nameplate);
  } else {
    console.log('Nameplate found');
  }

  let titleText = nameplate.children.find(c => c.name === "titleText");
  if (titleText) {
    console.log('Existing titleText found, destroying');
    titleText.destroy();
  }

  const style = new PIXI.TextStyle({
    fontFamily: 'Signika',
    fontSize: 14,
    fill: '#f0f0e0',
    stroke: '#111111',
    strokeThickness: 2,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 0,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 1,
    align: 'center'
  });

  titleText = new PIXI.Text(title, style);
  titleText.anchor.set(0.5, 0);
  titleText.resolution = 5;

  titleText.x = nameplate.width + 34;
  titleText.y = -20;

  titleText.name = "titleText";
  nameplate.addChild(titleText);
}

Hooks.on('canvasReady', () => {
  console.log('canvasReady hook triggered');
  canvas.tokens.placeables.forEach(token => {
    updateTokenTitle(token);
  });
});

Hooks.on('drawToken', token => {
  console.log('drawToken hook triggered');
  updateTokenTitle(token);
});
