import clsx from "clsx";
import { FC, KeyboardEvent, useId, useRef, useState } from "react";
import Button from "./Button";

export interface Work {
  id: string;
  title: string;
  thumb: string;
}

interface WorkSelectorProps {
  works: Work[];
  /** The open work, which starts selected; else the first work. */
  selectedId?: string;
  onOpen: (id: string) => void;
}

/** Explorer's "Large Icons" view of a collection, with an Open button. Fills its positioned parent. */
const WorkSelector: FC<WorkSelectorProps> = ({ works, selectedId, onOpen }) => {
  const [selected, setSelected] = useState(selectedId ?? works[0]?.id);
  const gridRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const selectedTitle = works.find((w) => w.id === selected)?.title ?? "";

  // Items in the first row, read from the layout so Up/Down follow the wrap.
  const columnCount = () => {
    const items = Array.from(gridRef.current?.children ?? []) as HTMLElement[];
    const top = items[0]?.offsetTop;
    const n = items.filter((item) => item.offsetTop === top).length;
    return Math.max(n, 1);
  };

  const select = (index: number) => {
    const work = works[index];
    if (!work) return;
    setSelected(work.id);
    gridRef.current?.children[index]?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = works.findIndex((w) => w.id === selected);
    const moves: Record<string, () => number> = {
      ArrowLeft: () => i - 1,
      ArrowRight: () => i + 1,
      ArrowUp: () => i - columnCount(),
      ArrowDown: () => i + columnCount(),
      Home: () => 0,
      End: () => works.length - 1,
    };
    if (e.key === "Enter") {
      e.preventDefault();
      if (selected) onOpen(selected);
    } else if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key]());
    }
  };

  return (
    // Fills the window's content box, inside its inset bevel.
    <div className="p95-chrome p95-field absolute inset-0 flex flex-col">
      {/* The bar scrolls with the grid, so it sits under the last row and
          sticks to the bottom only once items overflow; the scroll padding
          keeps a keyboard-selected item clear of it. */}
      <div className="flex-1 min-h-0 overflow-auto scroll-pb-10">
        <div
          ref={gridRef}
          role="listbox"
          aria-label="Works"
          aria-activedescendant={selected ? `work-${selected}` : undefined}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="p95-icon-grid outline-none flex flex-wrap content-start gap-y-3 p-2"
        >
          {works.map((work) => {
            const isSelected = work.id === selected;
            return (
              <div
                key={work.id}
                id={`work-${work.id}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => setSelected(work.id)}
                onDoubleClick={() => onOpen(work.id)}
                className="p95-icon w-[112px] flex flex-col items-center gap-1"
              >
                {/* Thumbs keep their work's aspect ratio, centered in the 96px
                    icon area; the dither covers the image only. */}
                <div className="w-24 h-24 flex-none flex items-center justify-center">
                  <div className="relative">
                    <img src={work.thumb} alt="" draggable={false} className="block max-w-[96px] max-h-[96px]" />
                    {isSelected && <div className="p95-icon-dither absolute inset-0" />}
                  </div>
                </div>
                <span
                  className={clsx(
                    "p95-icon-label max-w-full px-0.5 py-px text-center break-words",
                    isSelected && "bg-windowsSelect text-windowsSelectText"
                  )}
                >
                  {work.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Win95's Open dialog row: File name field with the selection, then Open. */}
        <div className="sticky bottom-0 flex items-center gap-2 p-1.5 bg-windowsGray">
          <span id={labelId} className="flex-none">File name:</span>
          <div
            aria-labelledby={labelId}
            className="classic-inset p95-field flex-1 min-w-0 h-[21px] px-1 leading-[17px] truncate"
          >
            {selectedTitle}
          </div>
          <Button
            className="[--p95-dots:4px] flex-none min-w-[75px] h-[23px] px-2"
            disabled={!selected}
            onClick={() => selected && onOpen(selected)}
          >
            <span>Open</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkSelector;
