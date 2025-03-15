document.addEventListener("DOMContentLoaded", (): void => {
  const TOOLTIP_DELAY = 500;
  const DISMISS_DELAY = 300;
  const MOUSE_TOLERANCE = 5;
  const MOBILE_BREAKPOINT = 768;

  let isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  let activeFootnoteRef: HTMLElement | null = null;
  let tooltipTimer: number | undefined;
  let dismissTimer: number | undefined;

  const tooltip = document.createElement("div");
  tooltip.className = "footnote-tooltip";
  tooltip.style.display = "none";
  document.body.appendChild(tooltip);

  function positionTooltip(target: HTMLElement): void {
    const targetRect = target.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    let top = targetRect.bottom + window.scrollY + 5;

    if (left < 0) left = 0;
    if (left + tooltipWidth > windowWidth) left = windowWidth - tooltipWidth;
    if (top + tooltipHeight > window.scrollY + windowHeight) {
      top = targetRect.top + window.scrollY - tooltipHeight - 5;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function showTooltip(target: HTMLElement): void {
    if (isMobile) return;

    clearTimeout(tooltipTimer);
    clearTimeout(dismissTimer);

    tooltipTimer = window.setTimeout(() => {
      const href = target.getAttribute("href");
      if (!href) return;
      
      const footnoteId = href.slice(1);
      const footnoteContent = document.getElementById(footnoteId);
      
      if (footnoteContent) {
        const clonedContent = footnoteContent.cloneNode(true) as HTMLElement;

        const backRefLink = clonedContent.querySelector(".footnote-backref");
        if (backRefLink) {
          backRefLink.remove();
        }

        clonedContent.querySelectorAll("p").forEach((p) => {
          if (p.innerHTML.trim() === "") {
            p.remove();
          }
        });

        let tooltipContent = clonedContent.innerHTML.trim();
        tooltipContent = tooltipContent.replace(
          /^(<br\s*\/?>)*|(<br\s*\/?>)*$/g,
          "",
        );

        tooltip.innerHTML = tooltipContent;
        tooltip.style.display = "block";
        positionTooltip(target);
        activeFootnoteRef = target;
      }
    }, TOOLTIP_DELAY);
  }

  function hideTooltip(): void {
    if (isMobile) return;

    clearTimeout(tooltipTimer);
    dismissTimer = window.setTimeout(() => {
      tooltip.style.display = "none";
      activeFootnoteRef = null;
    }, DISMISS_DELAY);
  }

  function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
    let timeout: number | undefined;
    return function (...args: any[]): void {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func.apply(this, args), wait);
    };
  }

  const debouncedResize = debounce((): void => {
    isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  }, 100);

  window.addEventListener("resize", debouncedResize);

  document.addEventListener("click", (e: MouseEvent): void => {
    const target = (e.target as HTMLElement).closest('sup[id^="fnref"] a, .footnote-backref') as HTMLElement | null;
    if (target) {
      if (!isMobile && target.closest('sup[id^="fnref"]')) {
        showTooltip(target);
      }
    } else if (
      !isMobile &&
      !tooltip.contains(e.target as Node) &&
      e.target !== activeFootnoteRef
    ) {
      hideTooltip();
    }
  });

  document.addEventListener("mouseover", (e: MouseEvent): void => {
    if (isMobile) return;
    const target = (e.target as HTMLElement).closest('sup[id^="fnref"] a') as HTMLElement | null;
    if (target) {
      showTooltip(target);
    }
  });

  document.addEventListener(
    "mouseout",
    (e: MouseEvent): void => {
      if (isMobile) return;
      const target = (e.target as HTMLElement).closest('sup[id^="fnref"] a') as HTMLElement | null;
      if (target) {
        const rect = target.getBoundingClientRect();
        if (
          e.clientX < rect.left - MOUSE_TOLERANCE ||
          e.clientX > rect.right + MOUSE_TOLERANCE ||
          e.clientY < rect.top - MOUSE_TOLERANCE ||
          e.clientY > rect.bottom + MOUSE_TOLERANCE
        ) {
          hideTooltip();
        }
      }
    },
    { passive: true },
  );

  tooltip.addEventListener("mouseover", (): void => {
    if (isMobile) return;
    clearTimeout(dismissTimer);
  });

  tooltip.addEventListener("mouseout", (e: MouseEvent): void => {
    if (isMobile) return;
    const rect = tooltip.getBoundingClientRect();
    if (
      e.clientX < rect.left - MOUSE_TOLERANCE ||
      e.clientX > rect.right + MOUSE_TOLERANCE ||
      e.clientY < rect.top - MOUSE_TOLERANCE ||
      e.clientY > rect.bottom + MOUSE_TOLERANCE
    ) {
      hideTooltip();
    }
  });
});