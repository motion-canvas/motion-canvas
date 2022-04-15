import {usePlayer} from "./usePlayer";
import {useEffect, useState} from "preact/hooks";

export function useScenes() {
    const player = usePlayer();
    const [scenes, setScenes] = useState(player.project.scenes);
    useEffect(() => {
        player.project.ScenesChanged.subscribe(setScenes);
        return () => player.project.ScenesChanged.unsubscribe(setScenes);
    }, [player, setScenes]);

    return scenes;
}