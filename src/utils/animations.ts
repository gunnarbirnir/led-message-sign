export const syncAnimations = async (
  animations: (Animation | null)[] = [],
  updateDuration: number
) => {
  const firstAnimation = animations[0];
  if (firstAnimation) {
    try {
      await firstAnimation.ready;
      const { startTime } = firstAnimation;
      // Sync to animation frame
      const roundedStartTime =
        startTime !== null
          ? Math.ceil((startTime as number) / updateDuration) * updateDuration
          : null;

      animations.forEach((animation) => {
        if (animation) {
          animation.startTime = roundedStartTime;
        }
      });
    } catch {}
  }
};
