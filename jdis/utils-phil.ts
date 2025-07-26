type Direction = "up" | "down" | "left" | "right";
export function moveToCenterDirection(playerPosition: { x: number; y: number }): Direction | null {
    const center = { x: 62, y: 62 };
    const dx = playerPosition.x < center.x ? 1 : playerPosition.x > center.x ? -1 : 0;
    const dy = playerPosition.y < center.y ? 1 : playerPosition.y > center.y ? -1 : 0;

    if (dx === 0 && dy === 0) {
        return null; // Already at center
    }

    // Prioritize horizontal or vertical move if needed
    if (dx !== 0 && dy === 0) {
        return dx === 1 ? "right" : "left";
    }
    if (dy !== 0 && dx === 0) {
        return dy === 1 ? "down" : "up";
    }

    // If both dx and dy are non-zero, pick one direction (e.g., horizontal first)
    return dx === 1 ? "right" : "left";
}
