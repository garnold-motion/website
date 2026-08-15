/**
 * A hardware-agnostic phone shell for showing off Rive pieces on desktop.
 *
 * Sized in svh so it always fits the viewport, with a 9:19.5 aspect so the
 * proportions stay honest whatever the screen height.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="relative aspect-[9/19.5] h-[min(78svh,780px)] shrink-0">
      {/* Outer body */}
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-[#2a2a30] to-[#131317] p-[3px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
        {/* Bezel */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.85rem] bg-black p-[9px]">
          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] bg-ink-soft">
            {children}

            {/* Dynamic-island style cutout, drawn over the content. */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-2.5 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black"
            />
            {/* Home indicator */}
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-1/2 h-[4px] w-[104px] -translate-x-1/2 rounded-full bg-bone/25"
            />
          </div>
        </div>
      </div>

      {/* Side buttons — small detail, makes the mockup read as a real device. */}
      <div
        aria-hidden="true"
        className="absolute -left-[2px] top-[19%] h-9 w-[3px] rounded-l-sm bg-[#35353c]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-[2px] top-[29%] h-14 w-[3px] rounded-l-sm bg-[#35353c]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-[2px] top-[24%] h-16 w-[3px] rounded-r-sm bg-[#35353c]"
      />
    </div>
  );
}
