import React, { useState, useRef, useEffect } from "react";
import { Clock, Eye, ShoppingCart, Search, Activity, ChevronDown, ChevronUp, Cpu, Sparkles, GripVertical } from "lucide-react";
import { useSession } from "../context/SessionContext";
import { useCart } from "../context/CartContext";

export default function SessionIndicator() {
  const { elapsedSeconds, totalPagesViewed, productViews, searchCount } = useSession();
  const { cartCount } = useCart();
  const [isMinimized, setIsMinimized] = useState(true);

  // Position state for floating drag
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
    hasMoved: false,
  });

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startDrag = (clientX, clientY) => {
    const currentX = position ? position.x : window.innerWidth - (isMinimized ? 280 : 340);
    const currentY = position ? position.y : window.innerHeight - (isMinimized ? 70 : 250);

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: currentX,
      initialPosY: currentY,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!dragRef.current) return;
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragRef.current.hasMoved = true;
      }

      const cardWidth = isMinimized ? 260 : 320;
      const cardHeight = isMinimized ? 50 : 220;

      const newX = Math.max(10, Math.min(window.innerWidth - cardWidth - 10, dragRef.current.initialPosX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - cardHeight - 10, dragRef.current.initialPosY + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches && e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, isMinimized]);

  const handleHeaderClick = () => {
    if (!dragRef.current.hasMoved) {
      setIsMinimized(!isMinimized);
    }
  };

  const style = position
    ? {
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        bottom: "auto",
        right: "auto",
        zIndex: 999,
      }
    : {};

  return (
    <div
      className={`session-indicator-hud ${isMinimized ? "hud-minimized" : "hud-expanded"} ${isDragging ? "hud-dragging" : ""}`}
      style={style}
    >
      {/* Minimized Pill View */}
      {isMinimized ? (
        <div
          className="hud-pill-button cursor-grab select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleHeaderClick}
          title="Drag to move anywhere or click to expand"
        >
          <GripVertical size={14} className="hud-drag-grip text-slate-400" />
          <span className="hud-live-dot" />
          <Activity size={15} className="text-sky-400" />
          <span className="hud-pill-title">LIVE SESSION</span>
          <span className="hud-pill-timer font-mono">{formatTime(elapsedSeconds)}</span>
          <ChevronUp size={14} className="hud-arrow-icon" />
        </div>
      ) : (
        /* Expanded HUD Window */
        <div className="hud-glass-card">
          <div
            className="hud-card-header cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleHeaderClick}
            title="Drag to move anywhere or click to collapse"
          >
            <div className="hud-header-title">
              <GripVertical size={14} className="hud-drag-grip text-slate-400" />
              <span className="hud-live-dot" />
              <Activity size={16} className="text-sky-400" />
              <h3>Real-Time Session HUD</h3>
            </div>
            <button
              className="hud-minimize-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              title="Minimize HUD"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="hud-card-body">
            <div className="hud-metrics-grid">
              <div className="hud-metric-item">
                <span className="hud-metric-label">
                  <Clock size={13} className="text-sky-400" /> Duration
                </span>
                <span className="hud-metric-val font-mono">{formatTime(elapsedSeconds)}</span>
              </div>

              <div className="hud-metric-item">
                <span className="hud-metric-label">
                  <Eye size={13} className="text-indigo-400" /> Pages Viewed
                </span>
                <span className="hud-metric-val">{totalPagesViewed}</span>
              </div>

              <div className="hud-metric-item">
                <span className="hud-metric-label">
                  <Sparkles size={13} className="text-purple-400" /> Product Views
                </span>
                <span className="hud-metric-val">{productViews}</span>
              </div>

              <div className="hud-metric-item">
                <span className="hud-metric-label">
                  <Search size={13} className="text-amber-400" /> Searches
                </span>
                <span className="hud-metric-val">{searchCount}</span>
              </div>

              <div className="hud-metric-item full-width">
                <span className="hud-metric-label">
                  <ShoppingCart size={13} className="text-emerald-400" /> Cart Items
                </span>
                <span className="hud-metric-val text-emerald-400">{cartCount} items</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
