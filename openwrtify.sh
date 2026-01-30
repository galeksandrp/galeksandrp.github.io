#!/usr/bin/env sh

pctCreate() {
  OS_TEMPLATE="$1"
  STORAGE="$2"

  CT_NUMBER="$(pvesh get /cluster/nextid)"
  TIMESTAMP="$(date +%s)"

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
