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
    const title = token.document.flags?.tokenTitle || '';

    let nameplate = token.children.find(c => c.name === "nameplate");
    if (!nameplate) {
        nameplate = new PIXI.Container();
        nameplate.name = "nameplate";
        token.addChild(nameplate);
    }

    const gridScaleFactor = canvas.dimensions.size / 72;

    const originalFontSize = 14;
    const adjustedFontSize = Math.round(originalFontSize * gridScaleFactor);

    const originalX = 0; // Adjust as needed based on your layout
    const originalY = -20;
    const adjustedX = Math.round((originalX + 34) * gridScaleFactor);
    const adjustedY = Math.round(originalY * gridScaleFactor);

    let titleText = nameplate.children.find(c => c.name === "titleText");
    if (titleText) {
        titleText.destroy();
    }

    const style = new PIXI.TextStyle({
        fontFamily: 'Signika',
        fontSize: adjustedFontSize,
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

    titleText.x = adjustedX;
    titleText.y = adjustedY;

    titleText.name = "titleText";
    nameplate.addChild(titleText);
}

Hooks.on('drawToken', token => {
  console.log('drawToken hook triggered');
  updateTokenTitle(token);
});
