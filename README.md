# 🌾 Fieldville - Farm Game (Like Farmville!)

A complete Farmville-style farming simulator with crops, animals, buildings, and decorations! Built with HTML5, CSS3, and vanilla JavaScript with beautiful isometric-style graphics.

## 🎮 How to Play

### Movement & Controls
- **Move Around**: Use **WASD** or **Arrow Keys** to move your farmer avatar
- **Teleport Home**: Click the 🏠 Home button to return to starting position
- **Horse Speed Boost**: Buy a horse to move 66% faster!

### Farming System
1. **Select Tools**: Click on tools in the shop (Plow 🚜, Water 💧, Remove ❌)
2. **Plow the Land**: Select Plow and click on empty plots
3. **Plant Seeds**: Select a seed from the shop and click on plowed land
4. **Wait for Growth**: Crops grow in real-time with visual stages (🌱 → 🌿 → 🌾)
5. **Water Crops**: Use the Water tool to speed up growth by 15 seconds
6. **Harvest**: Click on ready crops to harvest and earn coins + XP

### Animal System 🐄🐷🐔🐑🐴
- **Buy Animals**: Purchase from the Animals shop section
- **Place Animals**: Click on empty plots to place them
- **Collect Products**: Animals produce goods automatically
  - **Chickens** 🐔: Lay eggs every 45 seconds
  - **Cows** 🐄: Produce milk every 90 seconds  
  - **Pigs** 🐷: Find truffles every 75 seconds
  - **Sheep** 🐑: Produce wool every 60 seconds
  - **Horse** 🐴: Increases your movement speed permanently!
- **Collect**: Click on animals when the "✓ Ready!" indicator appears
- **Windmill Bonus**: Animal products are also worth 2x with a windmill!

### Buildings System
- **Farmhouse** 🏡: Your main home (permanent)
- **Market** 🏪: The shop building (permanent)
- **Barn** 🏚️ (500 coins): Store harvested crops
- **Silo** 🗼 (800 coins): Store animal feed
- **Well** 🌊 (300 coins): Get free watering
- **Windmill** 🌾 (1200 coins): **2x harvest value for EVERYTHING!**

### Decorations
- **Tree** 🌳 (50 coins): Natural beauty
- **Flower** 🌻 (30 coins): Colorful garden
- **Fence** 🚧 (20 coins): Border your farm

### Interactions
- **Click Buildings**: View info and benefits
- **Click Plots**: See crop/animal details and growth status
- **Remove Items**: Use Remove tool to clear decorations, crops, or animals

## 🌱 Features

✨ **Complete Farmville Experience**:
- 🧑‍🌾 Animated farmer character with WASD movement
- 🐄 5 different animals with unique production cycles
- 🌾 6 different crops with varying growth times
- 🏗️ Functional buildings with special bonuses
- 📦 Inventory system tracking all harvests
- 🎨 Decorations to beautify your farm
- 💎 Special buildings providing game-changing bonuses
- 🎮 Smooth animations and isometric-style graphics
- 🌈 Beautiful green pasture background
- 🗺️ 10x8 Farm Grid: 80 plots for ultimate farm management

## 💰 Crop Information

| Crop | Cost | Sell Price | Windmill 2x | Grow Time | XP | Level |
|------|------|------------|-------------|-----------|-----|-------|
| 🌾 Wheat | 10 | 25 | **50** | 30s | 5 | 1 |
| 🌽 Corn | 20 | 50 | **100** | 60s | 10 | 1 |
| 🥕 Carrot | 15 | 35 | **70** | 45s | 8 | 1 |
| 🍅 Tomato | 30 | 80 | **160** | 90s | 15 | 2 |
| 🍓 Strawberry | 40 | 100 | **200** | 75s | 18 | 2 |
| 🎃 Pumpkin | 50 | 150 | **300** | 120s | 25 | 3 |

## 🐾 Animal Information

| Animal | Cost | Product | Product Time | Value | Windmill 2x | XP | Level |
|--------|------|---------|-------------|-------|-------------|-----|-------|
| 🐔 Chicken | 150 | 🥚 Egg | 45s | 40 | **80** | 8 | 1 |
| 🐷 Pig | 300 | 🍄 Truffle | 75s | 80 | **160** | 15 | 1 |
| 🐑 Sheep | 400 | 🧶 Wool | 60s | 90 | **180** | 18 | 2 |
| 🐄 Cow | 500 | 🥛 Milk | 90s | 120 | **240** | 20 | 2 |
| 🐴 Horse | 800 | Speed Boost | - | - | - | 30 | 3 |

## 🏗️ Building Prices & Effects

| Building | Price | Special Effect |
|----------|-------|----------------|
| 🏚️ Barn | 500 | Store crops in inventory |
| 🗼 Silo | 800 | Store feed (animals) |
| 🌊 Well | 300 | FREE watering forever |
| 🌾 Windmill | 1200 | **2x ALL harvest & product values!** |

## 🎯 Pro Tips & Strategy

### Early Game (Level 1)
- 💡 Start with **Chickens** - Great passive income every 45s
- 🌾 Plant **Wheat** and **Carrots** to build coin reserves quickly
- 🚜 Plow multiple plots at once for efficiency
- 🌊 **Save for the Well** (300 coins) - Makes watering free forever

### Mid Game (Level 2-3)
- 🏗️ **Buy the Windmill ASAP** - Doubles all income from crops AND animals!
- 🐄 Invest in **Cows** and **Sheep** - With windmill, amazing profit
- 🍓 Plant **Strawberries** and **Tomatoes** for good profit margins
- 🏚️ **Build a Barn** to track your progress

### Late Game (Level 3+)
- 🎃 **Pumpkins** + Windmill = 300 coins per harvest!
- 🐴 **Buy a Horse** to move around your large farm faster
- 🐄 Fill your farm with **Cows** - 240 coins every 90s with windmill
- 🎨 Decorate your beautiful, profitable farm!

### Advanced Strategies
- 💧 Water expensive crops strategically to speed up profits
- 🤑 Combine animals and crops for constant income streams
- 🏗️ Well + Windmill combo = Maximum profit with no watering cost
- 📊 Check inventory regularly to see your total harvests
- 🎯 Focus on profit-per-second for optimal earnings

## 🛠️ Technologies Used

- **HTML5**: Game structure with semantic elements
- **CSS3**: Isometric-style 3D effects, gradients, and smooth animations
- **Vanilla JavaScript**: Complete game logic with requestAnimationFrame
- **CSS Keyframes**: Smooth character walking and item animations
- **Grid Layout**: Flexible and responsive farm design

## 📁 Files

- `index.html` - Game structure with animals, buildings, and avatar
- `style.css` - Farmville-inspired isometric styling and animations
- `game.js` - Complete farming simulation with animals and buildings

## 🎮 Keyboard Controls

- **W** or **↑**: Move Up
- **A** or **←**: Move Left
- **S** or **↓**: Move Down
- **D** or **→**: Move Right

## 🌟 What Makes This Like Farmville?

✅ **Animals** - Chickens, cows, pigs, sheep, horses
✅ **Crop Variety** - Multiple crops with different values and times
✅ **Buildings** - Functional barns, silos, windmills, wells
✅ **Decorations** - Trees, flowers, fences
✅ **Animated Avatar** - Walk around your farm
✅ **Leveling System** - Unlock new items as you progress
✅ **Isometric Style** - 3D-like graphics and depth effects
✅ **Green Fields** - Beautiful grass pasture background
✅ **Product Collection** - Gather eggs, milk, wool, truffles
✅ **Economy System** - Buy, sell, earn, and expand

Build your dream farm in Fieldville! 🚜🌾🐄🐔
