function FindProxyForURL(url, host) {
  if (dnsDomainIs(host, ".copydog.com")) {
    return "PROXY 192.168.0.113:9191";
  }
  return "DIRECT";
}
