export const syncAnimations = async (
  animation: Animation | null,
  updateDuration: number,
  animationsToSync: (Animation | null)[] = []
) => {
  if (animation) {
    try {
      await animation.ready;
      const { startTime } = animation;
      // Sync to animation frame
      const roundedStartTime =
        startTime !== null
          ? Math.ceil((startTime as number) / updateDuration) * updateDuration
          : null;

      animation.startTime = roundedStartTime;
      animationsToSync.forEach((animationToSync) => {
        if (animationToSync) {
          animationToSync.startTime = roundedStartTime;
        }
      });
    } catch {}
  }
};
