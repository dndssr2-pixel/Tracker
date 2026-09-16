import { useEffect, useRef, useState, useCallback } from 'react';

type TouchDragState = {
  dragId: string | null;
  startY: number;
  currentY: number;
  itemHeight: number;
};

export function useDragReorder<T extends { id: string }>(
  items: T[],
  onReorder: (orderedIds: string[]) => void
) {
  const [orderedItems, setOrderedItems] = useState(items);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const stateRef = useRef<TouchDragState>({
    dragId: null,
    startY: 0,
    currentY: 0,
    itemHeight: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const findIndex = (id: string) => orderedItems.findIndex((i) => i.id === id);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, itemId: string) => {
      // Only start drag on non-interactive elements
      const target = e.target as HTMLElement;
      if (target.closest('button, input, [role="checkbox"], a')) return;

      stateRef.current = {
        dragId: itemId,
        startY: e.clientY,
        currentY: e.clientY,
        itemHeight: (e.currentTarget as HTMLElement).offsetHeight,
      };
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!stateRef.current.dragId) return;
      const dy = e.clientY - stateRef.current.startY;
      stateRef.current.currentY = e.clientY;
      setDragOffset(dy);

      // Swap items when dragged past threshold
      const dragIdx = findIndex(stateRef.current.dragId);
      if (dragIdx === -1) return;

      const threshold = stateRef.current.itemHeight * 0.5;
      if (dy > threshold && dragIdx < orderedItems.length - 1) {
        const newItems = [...orderedItems];
        [newItems[dragIdx], newItems[dragIdx + 1]] = [
          newItems[dragIdx + 1],
          newItems[dragIdx],
        ];
        setOrderedItems(newItems);
        stateRef.current.startY += stateRef.current.itemHeight;
        setDragOffset(0);
        onReorder(newItems.map((i) => i.id));
      } else if (dy < -threshold && dragIdx > 0) {
        const newItems = [...orderedItems];
        [newItems[dragIdx], newItems[dragIdx - 1]] = [
          newItems[dragIdx - 1],
          newItems[dragIdx],
        ];
        setOrderedItems(newItems);
        stateRef.current.startY -= stateRef.current.itemHeight;
        setDragOffset(0);
        onReorder(newItems.map((i) => i.id));
      }
    },
    [orderedItems, onReorder]
  );

  const handlePointerUp = useCallback(() => {
    stateRef.current.dragId = null;
    setDragId(null);
    setDragOffset(0);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const bindDragHandle = useCallback(
    (itemId: string) => ({
      onPointerDown: (e: React.PointerEvent) => {
        stateRef.current = {
          dragId: itemId,
          startY: e.clientY,
          currentY: e.clientY,
          itemHeight: 60,
        };
        setDragId(itemId);
        e.stopPropagation();
      },
    }),
    []
  );

  return {
    orderedItems,
    dragId,
    dragOffset,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    bindDragHandle,
  };
}
