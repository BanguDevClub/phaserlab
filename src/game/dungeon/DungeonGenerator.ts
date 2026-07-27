import { getFloorDimensions } from '../config/GameConfig';

export enum TileType {
    WALL = 0,
    FLOOR = 1,
    STAIR = 2
}

export interface Room {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}

export interface DungeonGrid {
    floor: number;
    width: number;
    height: number;
    tiles: TileType[][];
    explored: boolean[][];
    visible: boolean[][];
    rooms: Room[];
    playerStart: { x: number; y: number };
    stairPos: { x: number; y: number };
    monsterSpawns: { x: number; y: number }[];
    itemSpawns: { x: number; y: number }[];
}

export class DungeonGenerator {

    public static generateFloor(floor: number): DungeonGrid {
        const { width, height } = getFloorDimensions(floor);
        
        const tiles: TileType[][] = Array.from({ length: height }, () => 
            Array.from({ length: width }, () => TileType.WALL)
        );
        const explored: boolean[][] = Array.from({ length: height }, () => 
            Array.from({ length: width }, () => false)
        );
        const visible: boolean[][] = Array.from({ length: height }, () => 
            Array.from({ length: width }, () => false)
        );

        const rooms: Room[] = [];
        // Number of room placement attempts scales with grid size
        const maxRooms = floor <= 9 ? 16 : floor <= 19 ? 35 : 75;
        const minRoomSize = 5;
        const maxRoomSize = 10;

        for (let r = 0; r < maxRooms; r++) {
            const rw = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
            const rh = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
            const rx = Math.floor(Math.random() * (width - rw - 2)) + 1;
            const ry = Math.floor(Math.random() * (height - rh - 2)) + 1;

            const newRoom: Room = {
                x: rx,
                y: ry,
                width: rw,
                height: rh,
                centerX: Math.floor(rx + rw / 2),
                centerY: Math.floor(ry + rh / 2)
            };

            // Check overlap with existing rooms
            const overlaps = rooms.some(other => 
                newRoom.x - 1 < other.x + other.width &&
                newRoom.x + newRoom.width + 1 > other.x &&
                newRoom.y - 1 < other.y + other.height &&
                newRoom.y + newRoom.height + 1 > other.y
            );

            if (!overlaps) {
                // Carve room into floor
                for (let y = newRoom.y; y < newRoom.y + newRoom.height; y++) {
                    for (let x = newRoom.x; x < newRoom.x + newRoom.width; x++) {
                        tiles[y][x] = TileType.FLOOR;
                    }
                }

                if (rooms.length > 0) {
                    // Connect to previous room center with L-shaped corridor
                    const prev = rooms[rooms.length - 1];
                    this.carveCorridor(tiles, prev.centerX, prev.centerY, newRoom.centerX, newRoom.centerY);
                }

                rooms.push(newRoom);
            }
        }

        // Fallback: If room carving didn't produce at least 2 rooms, create fallback rooms
        if (rooms.length < 2) {
            const centerRoom: Room = {
                x: 2, y: 2, width: 8, height: 8, centerX: 6, centerY: 6
            };
            const exitRoom: Room = {
                x: width - 10, y: height - 10, width: 8, height: 8, centerX: width - 6, centerY: height - 6
            };
            rooms.push(centerRoom, exitRoom);
            for (let y = centerRoom.y; y < centerRoom.y + centerRoom.height; y++) {
                for (let x = centerRoom.x; x < centerRoom.x + centerRoom.width; x++) tiles[y][x] = TileType.FLOOR;
            }
            for (let y = exitRoom.y; y < exitRoom.y + exitRoom.height; y++) {
                for (let x = exitRoom.x; x < exitRoom.x + exitRoom.width; x++) tiles[y][x] = TileType.FLOOR;
            }
            this.carveCorridor(tiles, centerRoom.centerX, centerRoom.centerY, exitRoom.centerX, exitRoom.centerY);
        }

        const playerStart = { x: rooms[0].centerX, y: rooms[0].centerY };
        const lastRoom = rooms[rooms.length - 1];
        const stairPos = { x: lastRoom.centerX, y: lastRoom.centerY };
        tiles[stairPos.y][stairPos.x] = TileType.STAIR;

        // Monster and Item Spawns in non-start rooms
        const monsterSpawns: { x: number; y: number }[] = [];
        const itemSpawns: { x: number; y: number }[] = [];

        for (let i = 1; i < rooms.length; i++) {
            const room = rooms[i];
            
            // Increased Monster spawn rate per room (2 to 4+ monsters per room)
            const monsterCount = Math.floor(Math.random() * 3) + 2 + Math.floor(floor / 4);
            for (let m = 0; m < monsterCount; m++) {
                const mx = Math.floor(Math.random() * (room.width - 2)) + room.x + 1;
                const my = Math.floor(Math.random() * (room.height - 2)) + room.y + 1;
                const isTileOccupied = monsterSpawns.some(s => s.x === mx && s.y === my) || (mx === stairPos.x && my === stairPos.y) || (mx === playerStart.x && my === playerStart.y);
                if (tiles[my][mx] === TileType.FLOOR && !isTileOccupied) {
                    monsterSpawns.push({ x: mx, y: my });
                }
            }

            // Rarer item chest spawn logic (22% chance per room)
            if (Math.random() < 0.22) {
                const ix = Math.floor(Math.random() * (room.width - 2)) + room.x + 1;
                const iy = Math.floor(Math.random() * (room.height - 2)) + room.y + 1;
                if (tiles[iy][ix] === TileType.FLOOR && !(ix === stairPos.x && iy === stairPos.y)) {
                    itemSpawns.push({ x: ix, y: iy });
                }
            }
        }

        return {
            floor,
            width,
            height,
            tiles,
            explored,
            visible,
            rooms,
            playerStart,
            stairPos,
            monsterSpawns,
            itemSpawns
        };
    }

    private static carveCorridor(tiles: TileType[][], x1: number, y1: number, x2: number, y2: number) {
        if (Math.random() < 0.5) {
            this.carveHorizontal(tiles, x1, x2, y1);
            this.carveVertical(tiles, y1, y2, x2);
        } else {
            this.carveVertical(tiles, y1, y2, x1);
            this.carveHorizontal(tiles, x1, x2, y2);
        }
    }

    private static carveHorizontal(tiles: TileType[][], x1: number, x2: number, y: number) {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        for (let x = start; x <= end; x++) {
            if (y >= 0 && y < tiles.length && x >= 0 && x < tiles[0].length) {
                tiles[y][x] = TileType.FLOOR;
            }
        }
    }

    private static carveVertical(tiles: TileType[][], y1: number, y2: number, x: number) {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);
        for (let y = start; y <= end; y++) {
            if (y >= 0 && y < tiles.length && x >= 0 && x < tiles[0].length) {
                tiles[y][x] = TileType.FLOOR;
            }
        }
    }

    // Line of Sight Visibility update (Raycasting FOV)
    public static updateVisibility(grid: DungeonGrid, px: number, py: number, radius: number = 7) {
        // Reset visible grid
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                grid.visible[y][x] = false;
            }
        }

        grid.visible[py][px] = true;
        grid.explored[py][px] = true;

        for (let i = 0; i < 360; i += 4) {
            const rad = (i * Math.PI) / 180;
            const dx = Math.cos(rad);
            const dy = Math.sin(rad);

            let cx = px + 0.5;
            let cy = py + 0.5;

            for (let r = 0; r < radius; r++) {
                cx += dx;
                cy += dy;
                const tx = Math.floor(cx);
                const ty = Math.floor(cy);

                if (tx < 0 || tx >= grid.width || ty < 0 || ty >= grid.height) break;

                grid.visible[ty][tx] = true;
                grid.explored[ty][tx] = true;

                if (grid.tiles[ty][tx] === TileType.WALL) break;
            }
        }
    }
}
