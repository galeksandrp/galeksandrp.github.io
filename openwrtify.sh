#!/usr/bin/env sh

wrtCreate() {
  STORAGE="$1"

  TEMPLATE_URL='https://images.linuxcontainers.org/images/openwrt/24.10/amd64/default/20260211_11:57/rootfs.tar.xz'
  OS_TEMPLATE="/var/lib/vz/template/cache/rootfs.tar.xz"

  CT_NUMBER="$(pvesh get /cluster/nextid)"
  TIMESTAMP="$(date +%s)"

  test -e "$OS_TEMPLATE" || wget "$TEMPLATE_URL" -O "$OS_TEMPLATE"

  pct create "$CT_NUMBER" "$OS_TEMPLATE" \
    --description 'https://galeksandrp.github.io/openwrtify.sh' \
    --features keyctl=1,nesting=1 \
    --hostname "openwrt-$TIMESTAMP" \
    --net0 name=eth0,bridge=vmbr0,ip=dhcp \
    --onboot 1 \
    --ostype unmanaged \
    --start 1 \
    --storage "$STORAGE" \
    --unprivileged 1
}

pctCreate "$@"
