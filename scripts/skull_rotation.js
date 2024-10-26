import { world } from "@minecraft/server";

function getPreciseRotation(playerYRotation) {
    // Transform player's head Y rotation to a positive
    if (playerYRotation < 0) {
        playerYRotation += 360;
    }
    // How many 16ths of 360 is the head rotation? - rounded
    const rotation = Math.round(playerYRotation / 22.5);

    // 0 and 16 represent duplicate rotations (0 degrees and 360 degrees), so 0 is returned if the value of `rotation` is 16
    return rotation !== 16 ? rotation : 0;
}

const SkullRotationBlockComponent = {
    beforeOnPlayerPlace(event) {
        const { player } = event;
        if (!player) {
            return;
        }

        const blockFace = event.permutationToPlace.getState("minecraft:block_face");
        if (blockFace !== "up") {
            return;
        }

        const playerYRotation = player.getRotation().y;
        const rotation = getPreciseRotation(playerYRotation);

        event.permutationToPlace = event.permutationToPlace.withState("mini_blocks:rotation", rotation);
    }
}

world.beforeEvents.worldInitialize.subscribe(({blockComponentRegistry}) => {
    blockComponentRegistry.registerCustomComponent(
        "mini_blocks:skull_rotation",
        SkullRotationBlockComponent
    );
});
