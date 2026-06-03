"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Group,
  Rect,
  Line,
  Circle,
  Ellipse,
  Text,
  Transformer,
  Arc,
} from "react-konva";
import { useTheme } from "next-themes";
import MaterialIcon from "@/components/MaterialIcon";
import { cn } from "@/lib/utils";

const GRID = 20;
const STAGE_HEIGHT = 420;
const MIN_ROOM = 160;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;

/** @typedef {'rect' | 'circle' | 'ellipse'} ObjectShape */

/**
 * @typedef {Object} RoomObject
 * @property {string} id
 * @property {string} label
 * @property {ObjectShape} shape
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} rotation
 * @property {string} fill
 * @property {string} stroke
 */

/**
 * @typedef {{ x: number, y: number, width: number, height: number }} RoomBounds
 */

/** @type {RoomBounds} */
const INITIAL_ROOM = { x: 60, y: 40, width: 600, height: 340 };

/** @type {RoomObject[]} */
const INITIAL_OBJECTS = [
  {
    id: "wardrobe",
    label: "Wardrobe",
    shape: "rect",
    x: 82,
    y: 140,
    width: 44,
    height: 160,
    rotation: 0,
    fill: "#6b5b4f",
    stroke: "#4a4038",
  },
  {
    id: "bed",
    label: "Bed",
    shape: "rect",
    x: 360,
    y: 140,
    width: 220,
    height: 200,
    rotation: 0,
    fill: "#8b7355",
    stroke: "#6b5344",
  },
  {
    id: "nightstand-left",
    label: "Nightstand",
    shape: "rect",
    x: 210,
    y: 60,
    width: 40,
    height: 40,
    rotation: 0,
    fill: "#a08060",
    stroke: "#7a6048",
  },
  {
    id: "nightstand-right",
    label: "Nightstand",
    shape: "rect",
    x: 510,
    y: 60,
    width: 40,
    height: 40,
    rotation: 0,
    fill: "#a08060",
    stroke: "#7a6048",
  },
  {
    id: "dresser",
    label: "Dresser",
    shape: "rect",
    x: 620,
    y: 260,
    width: 40,
    height: 100,
    rotation: 0,
    fill: "#9a8268",
    stroke: "#75604c",
  },
  {
    id: "storage-left",
    label: "Storage",
    shape: "rect",
    x: 240,
    y: 340,
    width: 120,
    height: 40,
    rotation: 0,
    fill: "#7a6a5a",
    stroke: "#5a4a3a",
  },
  {
    id: "storage-right",
    label: "Storage",
    shape: "rect",
    x: 380,
    y: 340,
    width: 120,
    height: 40,
    rotation: 0,
    fill: "#7a6a5a",
    stroke: "#5a4a3a",
  },
  {
    id: "plant",
    label: "Plant",
    shape: "circle",
    x: 632,
    y: 352,
    width: 32,
    height: 32,
    rotation: 0,
    fill: "#4a7c59",
    stroke: "#2d5a3a",
  },
];

let objectCounter = INITIAL_OBJECTS.length + 1;

function snap(value) {
  return Math.round(value / GRID) * GRID;
}

/** @param {string} value */
function sanitizeLabel(value) {
  const trimmed = value.trim().replace(/[\u0000-\u001f]/g, "");
  return trimmed.slice(0, 32) || "New item";
}

/** @param {string} value @param {string} fallback */
function normalizeHexColor(value, fallback) {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value.toLowerCase();
  }
  return fallback;
}

/** @param {string} fill */
function strokeFromFill(fill) {
  const hex = fill.replace("#", "");
  if (hex.length !== 6) {
    return fill;
  }
  const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - 32);
  const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - 32);
  const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - 32);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** @type {{ id: ObjectShape, label: string, icon: string }[]} */
const SHAPE_OPTIONS = [
  { id: "rect", label: "Rectangle", icon: "crop_square" },
  { id: "circle", label: "Circle", icon: "circle" },
  { id: "ellipse", label: "Ellipse", icon: "lens" },
];

function readCanvasColors(isDark) {
  return {
    stage: isDark ? "#141414" : "#ebebeb",
    grid: isDark ? "rgba(245,245,245,0.05)" : "rgba(23,23,23,0.05)",
    floor: isDark ? "#1c1c1c" : "#f8f8f8",
    wall: isDark ? "#737373" : "#a3a3a3",
    wallHandle: isDark ? "#e5e5e5" : "#404040",
    wallHandleFill: isDark ? "#404040" : "#f5f5f5",
    label: isDark ? "#a3a3a3" : "#737373",
    text: isDark ? "#f5f5f5" : "#171717",
    muted: isDark ? "#a3a3a3" : "#737373",
    accent: isDark ? "#d4d4d4" : "#404040",
    selection: isDark ? "#e5e5e5" : "#171717",
    defaultFill: isDark ? "#525252" : "#d4d4d4",
    defaultStroke: isDark ? "#737373" : "#a3a3a3",
  };
}

/**
 * @param {{ width: number, height: number, color: string }} props
 */
function GridLayer({ width, height, color }) {
  const lines = [];
  for (let x = 0; x <= width; x += GRID) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, height]}
        stroke={color}
        strokeWidth={1}
        listening={false}
      />,
    );
  }
  for (let y = 0; y <= height; y += GRID) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, width, y]}
        stroke={color}
        strokeWidth={1}
        listening={false}
      />,
    );
  }
  return <>{lines}</>;
}

/**
 * @param {{
 *   room: RoomBounds,
 *   colors: ReturnType<typeof readCanvasColors>,
 *   editWalls: boolean,
 *   onWallDrag: (edge: 'top' | 'right' | 'bottom' | 'left', dx: number, dy: number) => void,
 * }} props
 */
function RoomLayer({ room, colors, editWalls, onWallDrag }) {
  const handleSize = 10;
  const doorWidth = 80;
  const windowHeight = 80;
  const windowY = room.y + room.height * 0.38;

  const walls = [
    {
      edge: /** @type {const} */ ("top"),
      x: room.x + room.width / 2,
      y: room.y,
      cursor: "ns-resize",
    },
    {
      edge: /** @type {const} */ ("right"),
      x: room.x + room.width,
      y: room.y + room.height / 2,
      cursor: "ew-resize",
    },
    {
      edge: /** @type {const} */ ("bottom"),
      x: room.x + room.width / 2,
      y: room.y + room.height,
      cursor: "ns-resize",
    },
    {
      edge: /** @type {const} */ ("left"),
      x: room.x,
      y: room.y + room.height / 2,
      cursor: "ew-resize",
    },
  ];

  return (
    <>
      <Rect
        name="floor"
        x={room.x}
        y={room.y}
        width={room.width}
        height={room.height}
        fill={colors.floor}
        stroke={colors.wall}
        strokeWidth={editWalls ? 3 : 2}
        dash={editWalls ? [8, 4] : undefined}
        cornerRadius={2}
        listening={!editWalls}
      />

      {/* Door opening — bottom-left */}
      <Line
        points={[
          room.x + doorWidth,
          room.y + room.height,
          room.x + doorWidth,
          room.y + room.height + 6,
        ]}
        stroke={colors.wall}
        strokeWidth={2}
        listening={false}
      />
      <Arc
        x={room.x}
        y={room.y + room.height}
        innerRadius={0}
        outerRadius={doorWidth}
        angle={90}
        rotation={-90}
        stroke={colors.muted}
        strokeWidth={1.5}
        dash={[6, 4]}
        listening={false}
      />

      {/* Window — right wall */}
      <Line
        points={[
          room.x + room.width,
          windowY,
          room.x + room.width + 6,
          windowY,
        ]}
        stroke={colors.wall}
        strokeWidth={2}
        listening={false}
      />
      <Line
        points={[
          room.x + room.width,
          windowY + windowHeight,
          room.x + room.width + 6,
          windowY + windowHeight,
        ]}
        stroke={colors.wall}
        strokeWidth={2}
        listening={false}
      />
      <Line
        points={[
          room.x + room.width + 3,
          windowY,
          room.x + room.width + 3,
          windowY + windowHeight,
        ]}
        stroke={colors.muted}
        strokeWidth={1}
        listening={false}
      />

      <Text
        x={room.x + 10}
        y={room.y + 8}
        text="Bedroom — top-down floor plan"
        fontSize={11}
        fontFamily="var(--font-dm-sans), system-ui, sans-serif"
        fill={colors.muted}
        listening={false}
      />
      {editWalls &&
        walls.map((wall) => (
          <Circle
            key={wall.edge}
            x={wall.x}
            y={wall.y}
            radius={handleSize}
            fill={colors.wallHandleFill}
            stroke={colors.wallHandle}
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              const node = e.target;
              const dx = node.x() - wall.x;
              const dy = node.y() - wall.y;
              onWallDrag(wall.edge, dx, dy);
              node.position({ x: wall.x, y: wall.y });
            }}
          />
        ))}
    </>
  );
}

/**
 * @param {{
 *   object: RoomObject,
 *   isSelected: boolean,
 *   draggable: boolean,
 *   colors: ReturnType<typeof readCanvasColors>,
 *   onSelect: () => void,
 *   onChange: (patch: Partial<RoomObject>) => void,
 * }} props
 */
function FurnitureItem({
  object,
  isSelected,
  draggable,
  colors,
  onSelect,
  onChange,
}) {
  const groupRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    const tr = transformerRef.current;
    const node = groupRef.current;
    if (!tr || !node) return;
    if (isSelected && draggable) {
      tr.nodes([node]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [isSelected, draggable]);

  const { width, height } = object;
  const radius = Math.min(width, height) / 2;

  return (
    <>
      <Group
        ref={groupRef}
        id={object.id}
        name={object.id}
        x={object.x}
        y={object.y}
        rotation={object.rotation}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: snap(e.target.x()),
            y: snap(e.target.y()),
          });
        }}
        onTransformEnd={(e) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: snap(node.x()),
            y: snap(node.y()),
            rotation: node.rotation(),
            width: Math.max(GRID, snap(Math.abs(width * scaleX))),
            height: Math.max(GRID, snap(Math.abs(height * scaleY))),
          });
        }}
      >
        {object.shape === "rect" && (
          <Rect
            x={-width / 2}
            y={-height / 2}
            width={width}
            height={height}
            fill={object.fill}
            stroke={isSelected ? colors.selection : object.stroke}
            strokeWidth={isSelected ? 2 : 1}
            cornerRadius={4}
          />
        )}
        {object.shape === "circle" && (
          <Circle
            radius={radius}
            fill={object.fill}
            stroke={isSelected ? colors.selection : object.stroke}
            strokeWidth={isSelected ? 2 : 1}
          />
        )}
        {object.shape === "ellipse" && (
          <Ellipse
            radiusX={width / 2}
            radiusY={height / 2}
            fill={object.fill}
            stroke={isSelected ? colors.selection : object.stroke}
            strokeWidth={isSelected ? 2 : 1}
          />
        )}
        <Text
          text={object.label}
          fontSize={10}
          fill={colors.label}
          offsetX={object.label.length * 2.8}
          offsetY={-height / 2 - 14}
          listening={false}
        />
      </Group>
      {isSelected && draggable && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
            "top-center",
            "bottom-center",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < GRID || newBox.height < GRID) {
              return oldBox;
            }
            return newBox;
          }}
          borderStroke={colors.accent}
          anchorStroke={colors.accent}
          anchorSize={8}
        />
      )}
    </>
  );
}

export default function KonvaRoomPlannerDemo() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [stageWidth, setStageWidth] = useState(720);
  const [room, setRoom] = useState(INITIAL_ROOM);
  const [objects, setObjects] = useState(INITIAL_OBJECTS);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState(/** @type {'select' | 'editWalls'} */ ("select"));
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newObjectShape, setNewObjectShape] = useState(
    /** @type {ObjectShape} */ ("rect"),
  );
  const [newObjectName, setNewObjectName] = useState("New item");
  const [newObjectColor, setNewObjectColor] = useState("#525252");

  const isDark = (resolvedTheme ?? "light") === "dark";
  const colors = useMemo(() => readCanvasColors(isDark), [isDark]);

  const defaultObjectColor = colors.defaultFill;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setStageWidth(Math.max(280, Math.floor(el.offsetWidth)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const updateObject = useCallback((id, patch) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...patch } : obj)),
    );
  }, []);

  const handleWallDrag = useCallback((edge, dx, dy) => {
    setRoom((prev) => {
      let { x, y, width, height } = prev;

      if (edge === "top") {
        const nextY = snap(y + dy);
        const nextHeight = height - (nextY - y);
        if (nextHeight >= MIN_ROOM) {
          y = nextY;
          height = nextHeight;
        }
      } else if (edge === "bottom") {
        height = Math.max(MIN_ROOM, snap(height + dy));
      } else if (edge === "left") {
        const nextX = snap(x + dx);
        const nextWidth = width - (nextX - x);
        if (nextWidth >= MIN_ROOM) {
          x = nextX;
          width = nextWidth;
        }
      } else if (edge === "right") {
        width = Math.max(MIN_ROOM, snap(width + dx));
      }

      return { x, y, width, height };
    });
  }, []);

  const addObject = useCallback(
    (shape, label, fill) => {
      const id = `item-${objectCounter++}`;
      const cx = snap(room.x + room.width / 2);
      const cy = snap(room.y + room.height / 2);
      const defaults =
        shape === "circle"
          ? { width: 40, height: 40 }
          : shape === "ellipse"
            ? { width: 80, height: 50 }
            : { width: 60, height: 40 };
      const safeFill = normalizeHexColor(fill, defaultObjectColor);
      const safeLabel = sanitizeLabel(label);

      setObjects((prev) => [
        ...prev,
        {
          id,
          label: safeLabel,
          shape,
          x: cx,
          y: cy,
          width: defaults.width,
          height: defaults.height,
          rotation: 0,
          fill: safeFill,
          stroke: strokeFromFill(safeFill),
        },
      ]);
      setSelectedId(id);
      setMode("select");
      setIsAddFormOpen(false);
    },
    [room, defaultObjectColor],
  );

  const openAddForm = useCallback(() => {
    setIsAddFormOpen(true);
    setNewObjectShape("rect");
    setNewObjectName("New item");
    setNewObjectColor(defaultObjectColor);
    setMode("select");
  }, [defaultObjectColor]);

  const confirmAddObject = useCallback(() => {
    if (!isAddFormOpen) return;
    addObject(newObjectShape, newObjectName, newObjectColor);
  }, [isAddFormOpen, newObjectShape, newObjectName, newObjectColor, addObject]);

  const cancelAddObject = useCallback(() => {
    setIsAddFormOpen(false);
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setObjects((prev) => prev.filter((obj) => obj.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const resetScene = useCallback(() => {
    setRoom({ ...INITIAL_ROOM });
    setObjects(INITIAL_OBJECTS.map((obj) => ({ ...obj })));
    setSelectedId(null);
    setMode("select");
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
    setIsAddFormOpen(false);
    setNewObjectShape("rect");
    setNewObjectName("New item");
    objectCounter = INITIAL_OBJECTS.length + 1;
  }, []);

  const adjustZoom = useCallback((delta) => {
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta));
      return Math.round(next * 100) / 100;
    });
  }, []);

  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.08;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale =
      direction > 0
        ? Math.min(MAX_ZOOM, oldScale * scaleBy)
        : Math.max(MIN_ZOOM, oldScale / scaleBy);

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setZoom(newScale);
    setStagePos(newPos);
  }, []);

  const hint = useMemo(() => {
    if (isAddFormOpen) {
      return "Choose a shape, set a name and color, then click Add object to place it in the room.";
    }
    if (mode === "editWalls") {
      return "Drag the wall handles to resize the room. Switch back to Select to move furniture.";
    }
    if (selectedId) {
      return "Drag to move. Use corner handles to resize and the rotation handle to rotate. Scroll to zoom.";
    }
    return "Select furniture to move, resize, or rotate. Add objects from the toolbar or edit walls to reshape the room.";
  }, [mode, selectedId, isAddFormOpen]);

  return (
    <article className="glass flex flex-col rounded-2xl p-6 md:p-8">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-foreground">
            Konva.js
          </span>
          <span className="rounded-full border border-card-border px-3 py-1 text-xs text-muted">
            Room planner
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold text-foreground md:text-2xl">
          Virtual floor plan & room planner
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Arrange bedroom furniture on a top-down canvas—add shapes, drag walls,
          resize and rotate pieces, and zoom for detail. Interactive 2D layout
          patterns used in interior design and space-planning tools.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("select")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-card-border px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "select"
              ? "bg-accent-subtle text-foreground"
              : "bg-background/60 text-muted hover:text-foreground",
          )}
        >
          <MaterialIcon name="near_me" size={16} />
          Select
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("editWalls");
            setSelectedId(null);
          }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-card-border px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "editWalls"
              ? "bg-accent-subtle text-foreground"
              : "bg-background/60 text-muted hover:text-foreground",
          )}
        >
          <MaterialIcon name="home_work" size={16} />
          Edit walls
        </button>

        <span className="mx-1 hidden h-4 w-px bg-card-border sm:inline" />

        <button
          type="button"
          onClick={openAddForm}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-card-border px-3 py-1.5 text-xs font-medium transition-colors",
            isAddFormOpen
              ? "bg-accent-subtle text-foreground"
              : "bg-background/60 text-muted hover:text-foreground",
          )}
        >
          <MaterialIcon name="add" size={16} />
          Add object
        </button>

        <span className="mx-1 hidden h-4 w-px bg-card-border sm:inline" />

        <button
          type="button"
          onClick={() => adjustZoom(0.15)}
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:text-muted"
        >
          <MaterialIcon name="zoom_in" size={16} />
          Zoom in
        </button>
        <button
          type="button"
          onClick={() => adjustZoom(-0.15)}
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:text-muted"
        >
          <MaterialIcon name="zoom_out" size={16} />
          Zoom out
        </button>
        <span className="rounded-full border border-card-border bg-background/60 px-2.5 py-1.5 text-xs text-muted">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={deleteSelected}
          disabled={!selectedId || mode !== "select"}
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:text-muted disabled:opacity-50"
        >
          <MaterialIcon name="delete" size={16} />
          Delete
        </button>
        <button
          type="button"
          onClick={resetScene}
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:text-muted"
        >
          <MaterialIcon name="restart_alt" size={16} />
          Reset
        </button>
      </div>

      {isAddFormOpen && (
        <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-card-border bg-background/60 p-4">
          <p className="w-full text-xs font-medium text-foreground">New object</p>
          <div className="flex w-full flex-col gap-1.5">
            <span className="text-xs text-muted">Shape</span>
            <div className="flex flex-wrap gap-2">
              {SHAPE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setNewObjectShape(option.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-card-border px-3 py-1.5 text-xs font-medium transition-colors",
                    newObjectShape === option.id
                      ? "bg-accent-subtle text-foreground"
                      : "bg-background/60 text-muted hover:text-foreground",
                  )}
                >
                  <MaterialIcon name={option.icon} size={16} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
            <span className="text-xs text-muted">Name</span>
            <input
              type="text"
              value={newObjectName}
              maxLength={32}
              onChange={(e) => setNewObjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmAddObject();
                if (e.key === "Escape") cancelAddObject();
              }}
              className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30"
              placeholder="New item"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={normalizeHexColor(newObjectColor, defaultObjectColor)}
                onChange={(e) => setNewObjectColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-card-border bg-background p-1"
                aria-label="Object color"
              />
              <span className="text-xs text-muted">
                {normalizeHexColor(newObjectColor, defaultObjectColor)}
              </span>
            </div>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirmAddObject}
              className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-accent-subtle px-3 py-2 text-xs font-medium text-foreground transition-colors hover:text-muted"
            >
              <MaterialIcon name="add" size={16} />
              Add object
            </button>
            <button
              type="button"
              onClick={cancelAddObject}
              className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background/60 px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative mt-4 overflow-hidden rounded-xl border border-card-border"
      >
        {mounted ? (
          <Stage
            ref={stageRef}
            width={stageWidth}
            height={STAGE_HEIGHT}
            scaleX={zoom}
            scaleY={zoom}
            x={stagePos.x}
            y={stagePos.y}
            draggable={mode === "select" && !selectedId}
            onWheel={handleWheel}
            onDragEnd={(e) => {
              if (e.target === e.target.getStage()) {
                setStagePos({ x: e.target.x(), y: e.target.y() });
              }
            }}
            onMouseDown={(e) => {
              const stage = e.target.getStage();
              if (!stage) return;
              if (e.target === stage || e.target.name() === "floor") {
                setSelectedId(null);
              }
            }}
          >
            <Layer listening={false}>
              <Rect
                width={stageWidth}
                height={STAGE_HEIGHT}
                fill={colors.stage}
                listening={false}
              />
              <GridLayer
                width={stageWidth}
                height={STAGE_HEIGHT}
                color={colors.grid}
              />
            </Layer>
            <Layer listening={mode === "editWalls"}>
              <RoomLayer
                room={room}
                colors={colors}
                editWalls={mode === "editWalls"}
                onWallDrag={handleWallDrag}
              />
            </Layer>
            <Layer>
              {objects.map((obj) => (
                <FurnitureItem
                  key={obj.id}
                  object={obj}
                  isSelected={selectedId === obj.id}
                  draggable={mode === "select"}
                  colors={colors}
                  onSelect={() => setSelectedId(obj.id)}
                  onChange={(patch) => updateObject(obj.id, patch)}
                />
              ))}
            </Layer>
          </Stage>
        ) : (
          <div
            className="flex items-center justify-center bg-background/40"
            style={{ height: STAGE_HEIGHT }}
          >
            <span className="text-sm text-muted">Loading room planner…</span>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted">{hint}</p>
    </article>
  );
}
