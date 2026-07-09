/**
 * Reserved ad placeholder. Swap the inner markup for a real
 * <ins class="adsbygoogle"> unit once AdSense is approved — the outer box
 * keeps its size so ads load without shifting the page (good CWV + approval).
 */
export function AdSlot({
  variant,
  className = "",
}: {
  variant: "leaderboard" | "rectangle" | "sidebar" | "anchor";
  className?: string;
}) {
  return (
    <div className={`ad-slot ad-${variant} ${className}`} data-ad={variant}>
      Advertisement
    </div>
  );
}
