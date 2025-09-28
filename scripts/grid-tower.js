// Grid Tower Background Generator
class GridTowerGenerator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.gridSize = 20; // Size of each grid cell in pixels
        this.columns = 0;
        this.rows = 0;
        this.grid = [];
        
        this.init();
    }
    
    init() {
        this.calculateGridDimensions();
        this.generateGrid();
        this.renderGrid();
        
        // Regenerate on window resize
        window.addEventListener('resize', () => {
            this.clearGrid();
            this.calculateGridDimensions();
            this.generateGrid();
            this.renderGrid();
        });
    }
    
    calculateGridDimensions() {
        // Use viewport dimensions for full-height hero section
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        
        this.columns = Math.ceil(containerWidth / this.gridSize);
        this.rows = Math.ceil(containerHeight / this.gridSize);
    }
    
    generateGrid() {
        this.grid = [];
        
        // Initialize grid with all cells empty
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.columns; col++) {
                this.grid[row][col] = false;
            }
        }
        
        // Generate towers from bottom up
        for (let col = 0; col < this.columns; col++) {
            this.generateTower(col);
        }
        
        // Add some scattered pixels in the upper area
        this.addScatteredPixels();
        
        // Add bottom layer randomization for more natural appearance
        this.addBottomLayerRandomization();
        
        // Add blue texture blocks
        this.addBlueTextureBlocks();
    }
    
    generateTower(column) {
        // Determine tower height (higher probability for shorter towers)
        const maxHeight = this.rows * 0.45; // Max 45% of viewport height (reduced by 50%)
        const minHeight = this.rows * 0.05; // Min 5% of viewport height (reduced by 50%)
        
        // Use exponential distribution for more realistic tower heights
        const height = Math.floor(minHeight + (maxHeight - minHeight) * Math.pow(Math.random(), 2));
        
        // Fill the tower from bottom up, but skip the bottom 3 rows (they'll be handled separately)
        const towerStartRow = this.rows - 3; // Start towers 3 rows up from bottom
        for (let row = towerStartRow; row >= this.rows - height; row--) {
            this.grid[row][column] = true;
        }
        
        // Add some variation to the tower top
        this.addTowerVariation(column, this.rows - height);
    }
    
    addTowerVariation(column, startRow) {
        // Add some random blocks extending from the tower
        const variationCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < variationCount; i++) {
            const offsetCol = column + Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const offsetRow = startRow - Math.floor(Math.random() * 3) - 1; // Above the tower
            
            if (offsetCol >= 0 && offsetCol < this.columns && 
                offsetRow >= 0 && offsetRow < this.rows) {
                this.grid[offsetRow][offsetCol] = true;
            }
        }
    }
    
    addScatteredPixels() {
        // Add scattered pixels in the upper 50% of the viewport for better coverage
        const scatterArea = Math.floor(this.rows * 0.5);
        const scatterCount = Math.floor(this.columns * scatterArea * 0.032); // 3.2% density (reduced by 50%)
        
        for (let i = 0; i < scatterCount; i++) {
            const col = Math.floor(Math.random() * this.columns);
            const row = Math.floor(Math.random() * scatterArea);
            
            if (!this.grid[row][col]) {
                this.grid[row][col] = true;
            }
        }
    }
    
    addBottomLayerRandomization() {
        // Create scattered blocks in the bottom 3 rows, similar to the scattered area above towers
        const bottomRows = 3;
        const scatterCount = Math.floor(this.columns * bottomRows * 0.15); // 15% density in bottom 3 rows
        
        for (let i = 0; i < scatterCount; i++) {
            const col = Math.floor(Math.random() * this.columns);
            const row = this.rows - 1 - Math.floor(Math.random() * bottomRows); // Bottom 3 rows only
            
            // Only add if not already occupied
            if (!this.grid[row][col]) {
                this.grid[row][col] = true;
            }
        }
    }
    
    addBlueTextureBlocks() {
        // Count total black blocks first
        let totalBlocks = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.grid[row][col]) {
                    totalBlocks++;
                }
            }
        }
        
        // Calculate 30% of total blocks to convert to blue
        const blueBlockCount = Math.floor(totalBlocks * 0.3);
        let convertedCount = 0;
        
        // Convert random black blocks to blue
        while (convertedCount < blueBlockCount) {
            const col = Math.floor(Math.random() * this.columns);
            const row = Math.floor(Math.random() * this.rows);
            
            if (this.grid[row][col] === true) {
                // Mark as blue block (using a special value)
                this.grid[row][col] = 'blue';
                convertedCount++;
            }
        }
    }
    
    renderGrid() {
        this.clearGrid();
        
        // Create a wave-like generation effect from bottom to top
        const cells = [];
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.grid[row][col]) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.style.left = `${col * this.gridSize}px`;
                    cell.style.top = `${row * this.gridSize}px`;
                    cell.style.width = `${this.gridSize}px`;
                    cell.style.height = `${this.gridSize}px`;
                    
                    // Set color and enhanced texture based on block type
                    if (this.grid[row][col] === 'blue') {
                        // Generate various shades of blue (RGB values with blue at 255)
                        const red = Math.floor(Math.random() * 50) + 20; // 20-70 (reduced to avoid purple)
                        const green = Math.floor(Math.random() * 100) + 50; // 50-150
                        const blue = 255; // Always 255 for maximum blue
                        
                        // Add subtle color variation for texture
                        const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
                        const finalRed = Math.max(0, Math.min(255, red + variation));
                        const finalGreen = Math.max(0, Math.min(255, green + variation));
                        
                        cell.style.backgroundColor = `rgb(${finalRed}, ${finalGreen}, ${blue})`;
                        
                        // Enhanced blue block shadows and gradients
                        const shadowRed = Math.max(0, finalRed - 40);
                        const shadowGreen = Math.max(0, finalGreen - 40);
                        const shadowBlue = Math.max(0, blue - 40);
                        
                        cell.style.boxShadow = `
                            3px 3px 0px rgba(${shadowRed}, ${shadowGreen}, ${shadowBlue}, 0.5),
                            2px 2px 0px rgba(${Math.max(0, shadowRed-10)}, ${Math.max(0, shadowGreen-10)}, ${Math.max(0, shadowBlue-10)}, 0.4),
                            1px 1px 0px rgba(${Math.max(0, shadowRed-20)}, ${Math.max(0, shadowGreen-20)}, ${Math.max(0, shadowBlue-20)}, 0.3),
                            inset -2px -2px 0px rgba(255, 255, 255, 0.2),
                            inset -1px -1px 0px rgba(255, 255, 255, 0.15),
                            inset 2px 2px 0px rgba(${Math.max(0, shadowRed-20)}, ${Math.max(0, shadowGreen-20)}, ${Math.max(0, shadowBlue-20)}, 0.5),
                            inset 1px 1px 0px rgba(${Math.max(0, shadowRed-30)}, ${Math.max(0, shadowGreen-30)}, ${Math.max(0, shadowBlue-30)}, 0.4)
                        `;
                        
                        // Add blue-specific gradient texture
                        cell.style.backgroundImage = `
                            linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%),
                            linear-gradient(45deg, rgba(${Math.max(0, finalRed-30)}, ${Math.max(0, finalGreen-30)}, ${Math.max(0, blue-30)}, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)
                        `;
                    } else {
                        // Enhanced black blocks with more texture variation
                        const blackVariation = Math.floor(Math.random() * 30) - 15; // -15 to +15
                        const finalBlack = Math.max(0, Math.min(50, blackVariation));
                        cell.style.backgroundColor = `rgb(${finalBlack}, ${finalBlack}, ${finalBlack})`;
                        
                        // Enhanced black block shadows
                        cell.style.boxShadow = `
                            3px 3px 0px rgba(0, 0, 0, 0.5),
                            2px 2px 0px rgba(0, 0, 0, 0.4),
                            1px 1px 0px rgba(0, 0, 0, 0.3),
                            inset -2px -2px 0px rgba(255, 255, 255, 0.2),
                            inset -1px -1px 0px rgba(255, 255, 255, 0.15),
                            inset 2px 2px 0px rgba(0, 0, 0, 0.5),
                            inset 1px 1px 0px rgba(0, 0, 0, 0.4)
                        `;
                        
                        // Add black-specific gradient texture
                        cell.style.backgroundImage = `
                            linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%),
                            linear-gradient(45deg, rgba(0,0,0,0.3) 0%, transparent 50%),
                            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 70%),
                            linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 30%, rgba(0,0,0,0.1) 100%)
                        `;
                    }
                    
                    // Create wave-like animation from bottom to top
                    const distanceFromBottom = this.rows - row;
                    const waveDelay = distanceFromBottom * 0.03; // 0.03s per row from bottom
                    const randomDelay = Math.random() * 0.5; // Random delay up to 0.5s
                    cell.style.animationDelay = `${waveDelay + randomDelay}s`;
                    cell.style.animationDuration = '1.5s'; // Even slower animation duration
                    
                    cells.push(cell);
                }
            }
        }
        
        // Add cells to DOM in order
        cells.forEach(cell => {
            this.container.appendChild(cell);
        });
    }
    
    clearGrid() {
        const cells = this.container.querySelectorAll('.grid-cell');
        cells.forEach(cell => cell.remove());
    }
    
    regenerate() {
        this.clearGrid();
        this.generateGrid();
        this.renderGrid();
    }
}

// Initialize the grid tower when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure the hero section is fully rendered
    setTimeout(() => {
        new GridTowerGenerator('grid-tower-bg');
    }, 100);
});
