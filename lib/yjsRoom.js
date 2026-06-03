const DEFAULT_ROOM = "portfolio-yjs-playground";

/**
 * @returns {string}
 */
export function getRoomIdFromUrl() {
  if (typeof window === "undefined") {
    return DEFAULT_ROOM;
  }

  const params = new URLSearchParams(window.location.search);
  const room = params.get("room")?.trim();
  return room && room.length > 0 ? room.slice(0, 64) : DEFAULT_ROOM;
}

/**
 * @param {string} roomId
 * @returns {string}
 */
export function buildShareUrl(roomId) {
  if (typeof window === "undefined") {
    return "";
  }

  const url = new URL(window.location.href);
  url.searchParams.set("room", roomId);
  return url.toString();
}

/**
 * @returns {string}
 */
export function generateRoomId() {
  const segment = Math.random().toString(36).slice(2, 8);
  return `room-${segment}`;
}

export { DEFAULT_ROOM };
