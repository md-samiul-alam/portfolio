/**
 * @param {import('y-websocket').WebsocketProvider} provider
 * @returns {string}
 */
export function resolveProviderStatus(provider) {
  if (provider.wsconnected) {
    return provider.synced ? "connected · synced" : "connected";
  }

  if (provider.synced || provider.bcconnected) {
    return "synced";
  }

  if (provider.wsconnecting) {
    return "connecting";
  }

  return "disconnected";
}
