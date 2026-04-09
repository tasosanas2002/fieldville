// Game State
const game = {
    coins: 1000,
    level: 1,
    xp: 0,
    xpNeeded: 100,
    selectedItem: null,
    selectedTool: null,
    selectedBuilding: null,
    selectedDecoration: null,
    selectedAnimal: null,
    plots: [],
    buildings: [],
    inventory: {},
    animals: [],
    gridSize: { rows: 8, cols: 10 },
    avatar: {
        x: 390,
        y: 305,
        moving: false,
        speed: 3
    },
    hasWindmill: false,
    hasWell: false,
    hasHorse: false
};

// Crop Definitions
const crops = [
    {
        id: 'wheat',
        name: 'Wheat',
        icon: '🌾',
        price: 10,
        sellPrice: 25,
        growTime: 30, // seconds
        xpGain: 5,
        unlockLevel: 1
    },
    {
        id: 'corn',
        name: 'Corn',
        icon: '🌽',
        price: 20,
        sellPrice: 50,
        growTime: 60,
        xpGain: 10,
        unlockLevel: 1
    },
    {
        id: 'tomato',
        name: 'Tomato',
        icon: '🍅',
        price: 30,
        sellPrice: 80,
        growTime: 90,
        xpGain: 15,
        unlockLevel: 2
    },
    {
        id: 'carrot',
        name: 'Carrot',
        icon: '🥕',
        price: 15,
        sellPrice: 35,
        growTime: 45,
        xpGain: 8,
        unlockLevel: 1
    },
    {
        id: 'pumpkin',
        name: 'Pumpkin',
        icon: '🎃',
        price: 50,
        sellPrice: 150,
        growTime: 120,
        xpGain: 25,
        unlockLevel: 3
    },
    {
        id: 'strawberry',
        name: 'Strawberry',
        icon: '🍓',
        price: 40,
        sellPrice: 100,
        growTime: 75,
        xpGain: 18,
        unlockLevel: 2
    }
];

// Building Definitions
const buildingTypes = {
    barn: { name: 'Barn', icon: '🏚️', price: 500, description: 'Store harvested crops' },
    silo: { name: 'Silo', icon: '🗼', price: 800, description: 'Store animal feed' },
    well: { name: 'Well', icon: '🌊', price: 300, description: 'Free water for crops' },
    windmill: { name: 'Windmill', icon: '🌾', price: 1200, description: '2x harvest value' }
};

// Decoration Definitions
const decorationTypes = {
    tree: { name: 'Tree', icon: '🌳', price: 50 },
    flower: { name: 'Flower', icon: '🌻', price: 30 },
    fence: { name: 'Fence', icon: '🚧', price: 20 }
};

// Animal Definitions
const animalTypes = {
    chicken: {
        name: 'Chicken',
        icon: '🐔',
        price: 150,
        productTime: 45, // seconds
        productIcon: '🥚',
        productName: 'Egg',
        productValue: 40,
        xpGain: 8,
        unlockLevel: 1
    },
    cow: {
        name: 'Cow',
        icon: '🐄',
        price: 500,
        productTime: 90,
        productIcon: '🥛',
        productName: 'Milk',
        productValue: 120,
        xpGain: 20,
        unlockLevel: 2
    },
    pig: {
        name: 'Pig',
        icon: '🐷',
        price: 300,
        productTime: 75,
        productIcon: '🍄',
        productName: 'Truffle',
        productValue: 80,
        xpGain: 15,
        unlockLevel: 1
    },
    sheep: {
        name: 'Sheep',
        icon: '🐑',
        price: 400,
        productTime: 60,
        productIcon: '🧶',
        productName: 'Wool',
        productValue: 90,
        xpGain: 18,
        unlockLevel: 2
    },
    horse: {
        name: 'Horse',
        icon: '🐴',
        price: 800,
        productTime: 0, // No product, just speed boost
        productIcon: '',
        productName: 'Speed Boost',
        productValue: 0,
        xpGain: 30,
        unlockLevel: 3
    }
};

// Plot States
const PlotState = {
    EMPTY: 'empty',
    PLOWED: 'plowed',
    PLANTED: 'planted',
    READY: 'ready'
};

// Initialize Game
function initGame() {
    createFarmGrid();
    populateShop();
    setupEventListeners();
    initializeAvatar();
    updateUI();
    updateInventoryDisplay();
    startGameLoop();
    showMessage('Welcome to Fieldville! 🌾 Build your farm with crops AND animals!', 'success');
}

// Create Farm Grid
function createFarmGrid() {
    const farmGrid = document.getElementById('farm-grid');
    farmGrid.innerHTML = '';
    game.plots = [];
    
    for (let i = 0; i < game.gridSize.rows * game.gridSize.cols; i++) {
        const plot = {
            id: i,
            state: PlotState.EMPTY,
            crop: null,
            plantedAt: null,
            growTime: 0,
            watered: false
        };
        game.plots.push(plot);
        
        const plotElement = document.createElement('div');
        plotElement.className = 'plot empty';
        plotElement.dataset.id = i;
        plotElement.dataset.preview = ['berries', 'melons', 'peppers', 'greens', 'carrots', 'tomatoes'][
            (Math.floor(i / game.gridSize.cols) + i) % 6
        ];
        plotElement.style.setProperty('--tile-row', Math.floor(i / game.gridSize.cols));
        plotElement.style.setProperty('--tile-col', i % game.gridSize.cols);
        plotElement.addEventListener('click', () => handlePlotClick(i));
        
        farmGrid.appendChild(plotElement);
    }
}

function createPlotAsset(type, variant = '') {
    const asset = document.createElement('span');
    asset.className = `plot-asset ${type}${variant ? ` ${variant}` : ''}`;
    return asset;
}

function cropStageClass(plot) {
    const progress = 1 - (plot.growTime / plot.crop.growTime);

    if (plot.state === PlotState.READY) {
        return `crop-${plot.crop.id} crop-ready`;
    }

    if (progress < 0.33) {
        return `crop-${plot.crop.id} crop-sprout`;
    }

    if (progress < 0.66) {
        return `crop-${plot.crop.id} crop-young`;
    }

    return `crop-${plot.crop.id} crop-grown`;
}

// Populate Shop
function populateShop() {
    const seedsShop = document.getElementById('seeds-shop');
    seedsShop.innerHTML = '';
    
    crops.forEach(crop => {
        if (crop.unlockLevel <= game.level) {
            const item = document.createElement('button');
            item.className = 'shop-item';
            item.dataset.cropId = crop.id;
            
            item.innerHTML = `
                <div class="item-icon">${crop.icon}</div>
                <div class="item-name">${crop.name}</div>
                <div class="item-price">💰 ${crop.price}</div>
                <div class="item-time">⏱️ ${crop.growTime}s</div>
                <div class="item-sell">💵 Sells: ${crop.sellPrice}</div>
            `;
            
            item.addEventListener('click', () => selectSeed(crop));
            seedsShop.appendChild(item);
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('plow-tool').addEventListener('click', () => selectTool('plow'));
    document.getElementById('water-tool').addEventListener('click', () => selectTool('water'));
    document.getElementById('remove-tool').addEventListener('click', () => selectTool('remove'));
    document.getElementById('clear-selection').addEventListener('click', clearSelection);
    document.getElementById('teleport-home').addEventListener('click', () => {
        moveAvatarTo(100, 100);
        showMessage('Teleported home! 🏠', 'info');
    });
    
    // Building purchases
    document.querySelectorAll('.building-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const buildingType = btn.dataset.building;
            selectBuildingToBuild(buildingType);
        });
    });
    
    // Decoration purchases
    document.querySelectorAll('.deco-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const decoType = btn.dataset.deco;
            selectDecoration(decoType);
        });
    });
    
    // Animal purchases
    document.querySelectorAll('.animal-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const animalType = btn.dataset.animal;
            selectAnimal(animalType);
        });
    });
    
    // Fixed building clicks
    document.getElementById('farmhouse').addEventListener('click', () => interactWithFarmhouse());
    document.getElementById('shop-building').addEventListener('click', () => interactWithShop());
    
    // Keyboard controls for avatar
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyRelease);
}

// Avatar System
function initializeAvatar() {
    const avatar = document.getElementById('avatar');
    avatar.style.left = game.avatar.x + 'px';
    avatar.style.top = game.avatar.y + 'px';
}

const keys = {};
function handleKeyPress(e) {
    keys[e.key.toLowerCase()] = true;
    
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        game.avatar.moving = true;
        document.getElementById('avatar').classList.add('moving');
    }
}

function handleKeyRelease(e) {
    keys[e.key.toLowerCase()] = false;
    
    const movementKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
    if (!movementKeys.some(key => keys[key])) {
        game.avatar.moving = false;
        document.getElementById('avatar').classList.remove('moving');
    }
}

function updateAvatarPosition() {
    const speed = game.avatar.speed;
    let moved = false;
    
    if (keys['w'] || keys['arrowup']) {
        game.avatar.y = Math.max(0, game.avatar.y - speed);
        moved = true;
    }
    if (keys['s'] || keys['arrowdown']) {
        game.avatar.y = Math.min(550, game.avatar.y + speed);
        moved = true;
    }
    if (keys['a'] || keys['arrowleft']) {
        game.avatar.x = Math.max(0, game.avatar.x - speed);
        moved = true;
    }
    if (keys['d'] || keys['arrowright']) {
        game.avatar.x = Math.min(window.innerWidth > 1200 ? 700 : 500, game.avatar.x + speed);
        moved = true;
    }
    
    if (moved) {
        const avatar = document.getElementById('avatar');
        avatar.style.left = game.avatar.x + 'px';
        avatar.style.top = game.avatar.y + 'px';
    }
}

function moveAvatarTo(x, y) {
    game.avatar.x = x;
    game.avatar.y = y;
    const avatar = document.getElementById('avatar');
    avatar.style.left = x + 'px';
    avatar.style.top = y + 'px';
}

// Building System
function selectBuildingToBuild(buildingType) {
    const building = buildingTypes[buildingType];
    if (game.coins >= building.price) {
        game.selectedBuilding = buildingType;
        game.selectedItem = null;
        game.selectedTool = null;
        game.selectedDecoration = null;
        
        clearShopSelections();
        document.querySelector(`[data-building="${buildingType}"]`).classList.add('selected');
        document.getElementById('current-tool').textContent = `${building.icon} ${building.name}`;
        
        showMessage(`Click anywhere to place ${building.name}`, 'info');
    } else {
        showMessage(`Need ${building.price} coins for ${building.name}!`, 'error');
    }
}

function buildBuilding(buildingType) {
    const building = buildingTypes[buildingType];
    
    game.coins -= building.price;
    game.buildings.push({
        type: buildingType,
        ...building
    });
    
    // Special building effects
    if (buildingType === 'windmill') {
        game.hasWindmill = true;
    }
    if (buildingType === 'well') {
        game.hasWell = true;
    }
    
    renderPlayerBuildings();
    updateUI();
    showMessage(`${building.name} built! ${building.description}`, 'success');
}

function renderPlayerBuildings() {
    const container = document.getElementById('player-buildings');
    container.innerHTML = '';
    
    game.buildings.forEach((building, index) => {
        const buildingEl = document.createElement('div');
        buildingEl.className = 'player-building';
        buildingEl.innerHTML = `
            <div class="building-icon">${building.icon}</div>
            <div class="building-label">${building.name}</div>
            <div class="building-remove" onclick="removeBuilding(${index})">✕</div>
        `;
        buildingEl.addEventListener('click', (e) => {
            if (!e.target.classList.contains('building-remove')) {
                interactWithPlayerBuilding(building);
            }
        });
        container.appendChild(buildingEl);
    });
}

function removeBuilding(index) {
    const building = game.buildings[index];
    const refund = Math.floor(building.price * 0.5);
    game.coins += refund;
    
    if (building.type === 'windmill') game.hasWindmill = false;
    if (building.type === 'well') game.hasWell = false;
    
    game.buildings.splice(index, 1);
    renderPlayerBuildings();
    updateUI();
    showMessage(`Sold ${building.name} for ${refund} coins`, 'info');
}

function interactWithPlayerBuilding(building) {
    const infoPanel = document.getElementById('plot-info');
    
    if (building.type === 'barn') {
        let inventoryHTML = '<p><strong>🏚️ Barn Storage</strong></p>';
        if (Object.keys(game.inventory).length === 0) {
            inventoryHTML += '<p>Empty - Harvest crops to store them!</p>';
        } else {
            inventoryHTML += '<p>Stored crops:</p>';
            for (let [crop, count] of Object.entries(game.inventory)) {
                const cropData = crops.find(c => c.id === crop);
                if (cropData) {
                    inventoryHTML += `<p>${cropData.icon} ${cropData.name}: ${count}</p>`;
                }
            }
        }
        infoPanel.innerHTML = inventoryHTML;
    } else if (building.type === 'windmill') {
        infoPanel.innerHTML = `
            <p><strong>🌾 Windmill</strong></p>
            <p>Status: <span style="color: #43a047;">Active</span></p>
            <p>Effect: All harvests worth 2x coins!</p>
        `;
    } else if (building.type === 'well') {
        infoPanel.innerHTML = `
            <p><strong>🌊 Well</strong></p>
            <p>Status: <span style="color: #43a047;">Active</span></p>
            <p>Effect: Watering is FREE!</p>
        `;
    } else if (building.type === 'silo') {
        infoPanel.innerHTML = `
            <p><strong>🗼 Silo</strong></p>
            <p>Animal feed storage</p>
            <p>Coming soon: Animals!</p>
        `;
    }
}

function interactWithFarmhouse() {
    const infoPanel = document.getElementById('plot-info');
    infoPanel.innerHTML = `
        <p><strong>🏡 Farmhouse</strong></p>
        <p>Your cozy home on the farm!</p>
        <p><strong>Level:</strong> ${game.level}</p>
        <p><strong>Coins:</strong> ${game.coins} 💰</p>
        <p><strong>Buildings:</strong> ${game.buildings.length}</p>
    `;
    showMessage('Welcome home! 🏡', 'success');
}

function interactWithShop() {
    const infoPanel = document.getElementById('plot-info');
    infoPanel.innerHTML = `
        <p><strong>🏪 Market</strong></p>
        <p>Buy seeds, buildings, and decorations!</p>
        <p>Check the shop panel on the left.</p>
    `;
}

// Decoration System
function selectDecoration(decoType) {
    const deco = decorationTypes[decoType];
    if (game.coins >= deco.price) {
        game.selectedDecoration = decoType;
        game.selectedItem = null;
        game.selectedTool = null;
        game.selectedBuilding = null;
        game.selectedAnimal = null;
        
        clearShopSelections();
        document.querySelector(`[data-deco="${decoType}"]`).classList.add('selected');
        document.getElementById('current-tool').textContent = `${deco.icon} ${deco.name}`;
        
        showMessage(`Click a plot to place ${deco.name}`, 'info');
    } else {
        showMessage(`Need ${deco.price} coins for ${deco.name}!`, 'error');
    }
}

// Animal System
function selectAnimal(animalType) {
    const animal = animalTypes[animalType];
    
    if (animalType !== 'horse' && animal.unlockLevel > game.level) {
        showMessage(`Unlock at level ${animal.unlockLevel}!`, 'warning');
        return;
    }
    
    if (game.coins >= animal.price) {
        game.selectedAnimal = animalType;
        game.selectedItem = null;
        game.selectedTool = null;
        game.selectedBuilding = null;
        game.selectedDecoration = null;
        
        clearShopSelections();
        document.querySelector(`[data-animal="${animalType}"]`).classList.add('selected');
        document.getElementById('current-tool').textContent = `${animal.icon} ${animal.name}`;
        
        showMessage(`Click a plot to place ${animal.name}`, 'info');
    } else {
        showMessage(`Need ${animal.price} coins for ${animal.name}!`, 'error');
    }
}

function placeAnimal(animalType, plotId) {
    const animal = animalTypes[animalType];
    const plot = game.plots[plotId];
    
    game.coins -= animal.price;
    plot.state = 'animal';
    plot.animal = {
        type: animalType,
        ...animal,
        readyTime: animal.productTime,
        isReady: false
    };
    
    // Horse gives permanent speed boost
    if (animalType === 'horse') {
        game.hasHorse = true;
        game.avatar.speed = 5;
        showMessage('Horse bought! You move faster now! 🐴', 'success');
    }
    
    updatePlotDisplay(plotId);
    updateUI();
    showMessage(`${animal.name} placed! ${animal.productName ? 'Collect ' + animal.productIcon + ' when ready!' : ''}`, 'success');
}

function collectAnimalProduct(plotId) {
    const plot = game.plots[plotId];
    const animal = plot.animal;
    
    if (!animal.isReady || animal.type === 'horse') return;
    
    let earnings = animal.productValue;
    
    // Windmill bonus
    if (game.hasWindmill) {
        earnings *= 2;
    }
    
    game.coins += earnings;
    game.xp += animal.xpGain;
    
    // Reset animal timer
    animal.readyTime = animalTypes[animal.type].productTime;
    animal.isReady = false;
    
    const bonus = game.hasWindmill ? ' (Windmill 2x!)' : '';
    showMessage(`Collected ${animal.productIcon} ${animal.productName}! +${earnings} 💰${bonus}`, 'success');
    
    updatePlotDisplay(plotId);
    checkLevelUp();
    updateUI();
}

// Select Seed
function selectSeed(crop) {
    game.selectedItem = crop;
    game.selectedTool = null;
    game.selectedBuilding = null;
    game.selectedDecoration = null;
    game.selectedAnimal = null;
    
    clearShopSelections();
    document.querySelector(`[data-crop-id="${crop.id}"]`).classList.add('selected');
    
    document.getElementById('current-tool').textContent = `${crop.icon} ${crop.name}`;
}

// Select Tool
function selectTool(tool) {
    game.selectedTool = tool;
    game.selectedItem = null;
    game.selectedBuilding = null;
    game.selectedDecoration = null;
    game.selectedAnimal = null;
    
    clearShopSelections();
    
    const toolButton = document.getElementById(`${tool}-tool`);
    toolButton.classList.add('selected');
    
    const toolNames = {
        plow: '🚜 Plow',
        water: '💧 Water',
        remove: '❌ Remove'
    };
    document.getElementById('current-tool').textContent = toolNames[tool];
}

// Clear Selection
function clearSelection() {
    game.selectedItem = null;
    game.selectedTool = null;
    game.selectedBuilding = null;
    game.selectedDecoration = null;
    game.selectedAnimal = null;
    
    clearShopSelections();
    document.getElementById('current-tool').textContent = 'None';
}

function clearShopSelections() {
    document.querySelectorAll('.shop-item, .tool-item, .building-item, .deco-item, .animal-item').forEach(item => {
        item.classList.remove('selected');
    });
}

// Handle Plot Click
function handlePlotClick(plotId) {
    const plot = game.plots[plotId];
    
    // Place Building
    if (game.selectedBuilding) {
        buildBuilding(game.selectedBuilding);
        clearSelection();
        return;
    }
    
    // Place Animal
    if (game.selectedAnimal) {
        if (plot.state === PlotState.EMPTY) {
            placeAnimal(game.selectedAnimal, plotId);
            clearSelection();
        } else {
            showMessage('Clear the plot first!', 'warning');
        }
        return;
    }
    
    // Collect from Animal
    if (plot.state === 'animal' && !game.selectedTool && !game.selectedItem && !game.selectedDecoration) {
        if (plot.animal.isReady) {
            collectAnimalProduct(plotId);
        } else {
            showPlotInfo(plot);
        }
        return;
    }
    
    // Place Decoration
    if (game.selectedDecoration) {
        if (plot.state === PlotState.EMPTY) {
            const deco = decorationTypes[game.selectedDecoration];
            game.coins -= deco.price;
            plot.state = 'decoration';
            plot.decoration = game.selectedDecoration;
            updatePlotDisplay(plotId);
            updateUI();
            showMessage(`${deco.name} placed! 🎨`, 'success');
        } else {
            showMessage('Clear the plot first!', 'warning');
        }
        return;
    }
    
    // Remove Tool
    if (game.selectedTool === 'remove') {
        if (plot.state === 'decoration') {
            plot.state = PlotState.EMPTY;
            plot.decoration = null;
            updatePlotDisplay(plotId);
            showMessage('Decoration removed!', 'info');
        } else if (plot.state === 'animal') {
            const refund = Math.floor(plot.animal.price * 0.5);
            game.coins += refund;
            
            if (plot.animal.type === 'horse') {
                game.hasHorse = false;
                game.avatar.speed = 3;
                showMessage('Horse sold! Back to normal speed.', 'info');
            }
            
            plot.state = PlotState.EMPTY;
            plot.animal = null;
            updatePlotDisplay(plotId);
            updateUI();
            showMessage(`Animal sold for ${refund} coins!`, 'info');
        } else if (plot.state === PlotState.PLANTED || plot.state === PlotState.READY) {
            plot.state = PlotState.PLOWED;
            plot.crop = null;
            plot.plantedAt = null;
            plot.growTime = 0;
            plot.watered = false;
            updatePlotDisplay(plotId);
            showMessage('Crop removed!', 'info');
        } else {
            showMessage('Nothing to remove!', 'warning');
        }
        return;
    }
    
    // Use Plow Tool
    if (game.selectedTool === 'plow') {
        if (plot.state === PlotState.EMPTY) {
            plot.state = PlotState.PLOWED;
            updatePlotDisplay(plotId);
            showMessage('Plot plowed! 🚜', 'success');
        } else {
            showMessage('This plot is already plowed or in use!', 'warning');
        }
    }
    // Use Water Tool
    else if (game.selectedTool === 'water') {
        if (plot.state === PlotState.PLANTED && !plot.watered) {
            plot.watered = true;
            plot.growTime = Math.max(0, plot.growTime - 15);
            showMessage('Crop watered! Growth accelerated! 💧', 'success');
        } else if (plot.watered) {
            showMessage('Already watered!', 'info');
        } else {
            showMessage('Nothing to water here!', 'warning');
        }
    }
    // Plant Seed
    else if (game.selectedItem) {
        if (plot.state === PlotState.PLOWED) {
            if (game.coins >= game.selectedItem.price) {
                game.coins -= game.selectedItem.price;
                plot.state = PlotState.PLANTED;
                plot.crop = game.selectedItem;
                plot.plantedAt = Date.now();
                plot.growTime = game.selectedItem.growTime;
                plot.watered = false;
                updatePlotDisplay(plotId);
                updateUI();
                showMessage(`${game.selectedItem.name} planted! 🌱`, 'success');
            } else {
                showMessage('Not enough coins!', 'error');
            }
        } else if (plot.state === PlotState.EMPTY) {
            showMessage('Plow the land first!', 'warning');
        } else if (plot.state === PlotState.READY) {
            showMessage('Harvest the crop first!', 'warning');
        } else if (plot.state === 'decoration') {
            showMessage('Remove the decoration first!', 'warning');
        } else if (plot.state === 'animal') {
            showMessage('Animal is here!', 'warning');
        } else {
            showMessage('Crop is still growing!', 'info');
        }
    }
    // Harvest
    else if (plot.state === PlotState.READY) {
        let earnings = plot.crop.sellPrice;
        
        // Windmill bonus
        if (game.hasWindmill) {
            earnings *= 2;
        }
        
        const xpGain = plot.crop.xpGain;
        
        game.coins += earnings;
        game.xp += xpGain;
        
        // Add to inventory
        if (!game.inventory[plot.crop.id]) {
            game.inventory[plot.crop.id] = 0;
        }
        game.inventory[plot.crop.id]++;
        
        const bonus = game.hasWindmill ? ' (Windmill 2x!)' : '';
        showMessage(`Harvested ${plot.crop.name}! +${earnings} 💰 +${xpGain} ✨${bonus}`, 'success');
        
        // Reset plot
        plot.state = PlotState.EMPTY;
        plot.crop = null;
        plot.plantedAt = null;
        plot.growTime = 0;
        plot.watered = false;
        
        updatePlotDisplay(plotId);
        checkLevelUp();
        updateUI();
        updateInventoryDisplay();
    } else {
        showPlotInfo(plot);
    }
}

// Update Plot Display
function updatePlotDisplay(plotId) {
    const plot = game.plots[plotId];
    const plotElement = document.querySelector(`[data-id="${plotId}"]`);
    
    plotElement.className = 'plot ' + plot.state;
    plotElement.innerHTML = ''; // Clear previous content
    
    if (plot.state === PlotState.EMPTY) {
        // Empty
    } else if (plot.state === PlotState.PLOWED) {
        // Plowed
    } else if (plot.state === 'decoration') {
        plotElement.appendChild(createPlotAsset('deco', `deco-${plot.decoration}`));
    } else if (plot.state === 'animal') {
        plotElement.appendChild(createPlotAsset('animal', `animal-${plot.animal.type}`));
        
        // Show ready indicator for animals that produce
        if (plot.animal.isReady && plot.animal.type !== 'horse') {
            const readyIcon = document.createElement('div');
            readyIcon.className = 'animal-ready';
            readyIcon.textContent = 'Ready!';
            plotElement.appendChild(readyIcon);
        } else if (plot.animal.type !== 'horse') {
            // Show timer
            const timer = document.createElement('div');
            timer.className = 'plot-timer';
            timer.textContent = plot.animal.readyTime + 's';
            plotElement.appendChild(timer);
        }
    } else if (plot.state === PlotState.PLANTED) {
        plotElement.appendChild(createPlotAsset('crop', cropStageClass(plot)));
        
        // Show timer
        const timer = document.createElement('div');
        timer.className = 'plot-timer';
        timer.textContent = plot.growTime + 's';
        plotElement.appendChild(timer);
    } else if (plot.state === PlotState.READY) {
        plotElement.appendChild(createPlotAsset('crop', cropStageClass(plot)));
    }
}

// Show Plot Info
function showPlotInfo(plot) {
    const infoPanel = document.getElementById('plot-info');
    
    if (plot.state === PlotState.EMPTY) {
        infoPanel.innerHTML = '<p>Empty plot - Plow it first!</p>';
    } else if (plot.state === PlotState.PLOWED) {
        infoPanel.innerHTML = '<p>Plowed land - Ready to plant seeds!</p>';
    } else if (plot.state === 'decoration') {
        const deco = decorationTypes[plot.decoration];
        infoPanel.innerHTML = `
            <p><strong>Decoration:</strong> ${deco.icon} ${deco.name}</p>
            <p>Makes your farm beautiful! 🎨</p>
        `;
    } else if (plot.state === 'animal') {
        const animal = plot.animal;
        if (animal.type === 'horse') {
            infoPanel.innerHTML = `
                <p><strong>Animal:</strong> ${animal.icon} ${animal.name}</p>
                <p><strong>Benefit:</strong> Faster movement! 🏃</p>
                <p>Your horse helps you move around faster!</p>
            `;
        } else {
            const value = game.hasWindmill ? animal.productValue * 2 : animal.productValue;
            infoPanel.innerHTML = `
                <p><strong>Animal:</strong> ${animal.icon} ${animal.name}</p>
                <p><strong>Produces:</strong> ${animal.productIcon} ${animal.productName}</p>
                <p><strong>Value:</strong> ${value} 💰 ${game.hasWindmill ? '(2x!)' : ''}</p>
                <p><strong>Time:</strong> ${animal.isReady ? '✅ Ready!' : animal.readyTime + 's remaining'}</p>
                <p><strong>XP Gain:</strong> +${animal.xpGain} ✨</p>
                ${animal.isReady ? '<p style="color: #43a047; font-weight: bold; margin-top: 10px;">Click to collect!</p>' : ''}
            `;
        }
    } else if (plot.state === PlotState.PLANTED) {
        const progress = Math.floor((1 - (plot.growTime / plot.crop.growTime)) * 100);
        infoPanel.innerHTML = `
            <p><strong>Crop:</strong> ${plot.crop.icon} ${plot.crop.name}</p>
            <p><strong>Growth:</strong> ${progress}%</p>
            <p><strong>Time Left:</strong> ${plot.growTime}s</p>
            <p><strong>Watered:</strong> ${plot.watered ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Value:</strong> ${plot.crop.sellPrice} 💰</p>
            ${game.hasWindmill ? '<p style="color: #ff9800;">Windmill: 2x value!</p>' : ''}
        `;
    } else if (plot.state === PlotState.READY) {
        const value = game.hasWindmill ? plot.crop.sellPrice * 2 : plot.crop.sellPrice;
        infoPanel.innerHTML = `
            <p><strong>Ready to Harvest!</strong></p>
            <p><strong>Crop:</strong> ${plot.crop.icon} ${plot.crop.name}</p>
            <p><strong>Value:</strong> ${value} 💰 ${game.hasWindmill ? '(2x!)' : ''}</p>
            <p><strong>XP:</strong> +${plot.crop.xpGain} ✨</p>
            <p style="color: #43a047; font-weight: bold; margin-top: 10px;">Click to harvest!</p>
        `;
    }
}

// Inventory Display
function updateInventoryDisplay() {
    const inventoryEl = document.getElementById('inventory');
    
    if (Object.keys(game.inventory).length === 0) {
        inventoryEl.innerHTML = '<p style="color: #999;">Empty</p>';
        return;
    }
    
    let html = '';
    for (let [cropId, count] of Object.entries(game.inventory)) {
        const crop = crops.find(c => c.id === cropId);
        if (crop && count > 0) {
            html += `
                <div class="inventory-item">
                    <span class="inventory-item-name">${crop.icon} ${crop.name}</span>
                    <span class="inventory-item-count">${count}</span>
                </div>
            `;
        }
    }
    
    inventoryEl.innerHTML = html || '<p style="color: #999;">Empty</p>';
}

// Game Loop
function startGameLoop() {
    // Main game loop - runs every frame
    function gameLoop() {
        updateAvatarPosition();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
    
    // Crop growth and animal production update - runs every second
    setInterval(() => {
        game.plots.forEach((plot, index) => {
            // Crop growth
            if (plot.state === PlotState.PLANTED) {
                plot.growTime--;
                
                if (plot.growTime <= 0) {
                    plot.state = PlotState.READY;
                    showMessage(`${plot.crop.name} is ready to harvest! 🎉`, 'success');
                }
                
                updatePlotDisplay(index);
            }
            
            // Animal production
            if (plot.state === 'animal' && plot.animal.type !== 'horse') {
                if (!plot.animal.isReady) {
                    plot.animal.readyTime--;
                    
                    if (plot.animal.readyTime <= 0) {
                        plot.animal.isReady = true;
                        showMessage(`${plot.animal.name} has ${plot.animal.productIcon} ${plot.animal.productName} ready! 🎉`, 'success');
                    }
                    
                    updatePlotDisplay(index);
                }
            }
        });
    }, 1000);
}

// Check Level Up
function checkLevelUp() {
    if (game.xp >= game.xpNeeded) {
        game.level++;
        game.xp -= game.xpNeeded;
        game.xpNeeded = Math.floor(game.xpNeeded * 1.5);
        
        showMessage(`🎉 Level Up! You are now level ${game.level}!`, 'success');
        populateShop(); // Unlock new crops
    }
}

// Update UI
function updateUI() {
    document.getElementById('coins').textContent = game.coins;
    document.getElementById('level').textContent = game.level;
    document.getElementById('xp').textContent = game.xp;
    document.getElementById('xp-needed').textContent = game.xpNeeded;
}

// Show Message
function showMessage(text, type = 'info') {
    const container = document.getElementById('message-container');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    container.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 3000);
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
