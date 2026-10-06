import { useSelf, useMutation } from '@/liveblocks.config'

export const useDeleteLayers = () => {
  const selection = useSelf(me => me.presence.selection)

  return useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get('layers')
      const liveLayerIds = storage.get('layerIds')

      const layersToDelete = new Set(selection);

      for (const id of selection) {
        const layer = liveLayers.get(id);
        if (layer && layer.type === 7 && layer.fileName) {
          let baseName = layer.fileName;
          if (baseName.includes(' - Slide ')) {
            baseName = baseName.split(' - Slide ')[0];
            for (const layerId of liveLayerIds.toArray()) {
              const l = liveLayers.get(layerId);
              if (l && l.type === 7 && l.fileName) {
                let lBaseName = l.fileName;
                if (lBaseName.includes(' - Slide ')) {
                  lBaseName = lBaseName.split(' - Slide ')[0];
                  if (lBaseName === baseName) {
                    layersToDelete.add(layerId);
                  }
                }
              }
            }
          }
        }
      }

      for (const id of Array.from(layersToDelete)) {
        liveLayers.delete(id)

        const index = liveLayerIds.indexOf(id)

        if (index !== -1) {
          liveLayerIds.delete(index)
        }
      }

      setMyPresence({ selection: [] }, { addToHistory: true })
    },
    [selection]
  )
}
