#!/usr/bin/env bash

# Functions
cleanup() {
    umount -R "$EXT_PARTITION_MOUNTPOINT"
    swapoff "$SWAP_PARTITION"
}

init() {
    ROOT_PASSWORD="$1"
    ARCH_PASSWORD="$ROOT_PASSWORD"

    # Cleanup
    cleanup

    # 1 Pre-installation -> Partition the disks
    sfdisk "$LARGEST_BLOCK_DEVICE" << 'EOF'
start=2048, size=131072, type=21686148-6449-6E6F-744E-656564454649
start=133120, size=2097152, type=0657FD6D-A4AB-43C4-84E5-0933C84B4F4F
start=2230272, type=0FC63DAF-8483-4772-8E79-3D69D8477DE4
EOF

    # 1 Pre-installation -> Format the partitions
    mkfs.ext4 "$EXT_PARTITION"
    mkswap "$SWAP_PARTITION"

    # 1 Pre-installation -> Mount the file systems
    mount "$EXT_PARTITION" "$EXT_PARTITION_MOUNTPOINT"
    swapon "$SWAP_PARTITION"

    # 2 Installation -> Install essential packages
    # Configure the system -> Boot loader
    # Configure the system -> sudo
    # Configure the system -> openssh
    # Configure the system -> nano
    # Configure the system -> bash-completion
    pacstrap "$EXT_PARTITION_MOUNTPOINT" base linux linux-firmware grub sudo openssh nano bash-completion

    # 3 Configure the system -> Fstab
    genfstab -U "$EXT_PARTITION_MOUNTPOINT" >> "$EXT_PARTITION_MOUNTPOINT/etc/fstab"

    # Configure the system -> Connect to the internet
    SYSTEMD_NETWORK_FILEPATH="etc/systemd/network/20-ens3.network"

    cp "/$SYSTEMD_NETWORK_FILEPATH" "$EXT_PARTITION_MOUNTPOINT/$SYSTEMD_NETWORK_FILEPATH"
    ln -sf "$EXT_PARTITION_MOUNTPOINT/run/systemd/resolve/stub-resolv.conf" "$EXT_PARTITION_MOUNTPOINT/etc/resolv.conf"
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" systemctl enable systemd-networkd
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" systemctl enable systemd-resolved

    # 3 Configure the system -> Root password
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" bash -c "echo 'root:$ROOT_PASSWORD' | chpasswd"

    # Configure the system -> Non-root user
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" useradd -G wheel -m -U "$ARCH_LOGIN"
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" bash -c "echo '$ARCH_LOGIN:$ROOT_PASSWORD' | chpasswd"

    # 3 Configure the system -> Boot loader
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" grub-install --target=i386-pc "$LARGEST_BLOCK_DEVICE"
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" grub-mkconfig -o /boot/grub/grub.cfg

    # Configure the system -> sudo
    echo '%wheel ALL=(ALL) NOPASSWD: ALL' > "$EXT_PARTITION_MOUNTPOINT/etc/sudoers.d/wheel"

    # Configure the system -> openssh
    DOT_SSH_PATH='.ssh'
    AUTHORIZED_KEYS_FILEPATH="$DOT_SSH_PATH/authorized_keys"

    mkdir -p "$EXT_PARTITION_MOUNTPOINT/root/$DOT_SSH_PATH" "$EXT_PARTITION_MOUNTPOINT/$ARCH_HOME_PATH/$DOT_SSH_PATH"
    curl -L "$ID_RSA_PUB_URL" > "$EXT_PARTITION_MOUNTPOINT/root/$AUTHORIZED_KEYS_FILEPATH"
    cp "$EXT_PARTITION_MOUNTPOINT/root/$AUTHORIZED_KEYS_FILEPATH" "$EXT_PARTITION_MOUNTPOINT/$ARCH_HOME_PATH/$AUTHORIZED_KEYS_FILEPATH"

    arch-chroot "$EXT_PARTITION_MOUNTPOINT" systemctl enable sshd
}

yayInit() {
    MAKEPKG_DIRNAME="yay"

    arch-chroot "$EXT_PARTITION_MOUNTPOINT" pacman -S --needed --noconfirm git base-devel
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" sudo -u "$ARCH_LOGIN" -i git clone "https://aur.archlinux.org/$MAKEPKG_DIRNAME.git"
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" sudo -u "$ARCH_LOGIN" -i bash -c "cd $MAKEPKG_DIRNAME && makepkg -si --noconfirm"

    rm -rf "$EXT_PARTITION_MOUNTPOINT/$ARCH_HOME_PATH/$MAKEPKG_DIRNAME"
}

dockerInit() {
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" pacman -Syu --noconfirm docker docker-compose

    mkdir -p "$EXT_PARTITION_MOUNTPOINT/etc/docker"
    echo '{"userland-proxy":false}' > "$EXT_PARTITION_MOUNTPOINT/etc/docker/daemon.json"

    arch-chroot "$EXT_PARTITION_MOUNTPOINT" systemctl enable docker

    arch-chroot "$EXT_PARTITION_MOUNTPOINT" usermod -G docker -a "$ARCH_LOGIN"
}

travistestInit() {
    PPP_PASSWORD="$1"

    arch-chroot "$EXT_PARTITION_MOUNTPOINT" sudo -u "$ARCH_LOGIN" -i git clone "$TRAVISTEST_GIT_URL"
    arch-chroot "$EXT_PARTITION_MOUNTPOINT" sudo -u "$ARCH_LOGIN" -i bash -c 'cd travistest && git checkout docker-arch-xl2tpd-forward'

    echo "router * $PPP_PASSWORD 192.168.101.2" > "$EXT_PARTITION_MOUNTPOINT/$ARCH_HOME_PATH/travistest/pap-secrets"
    ln -s 'pap-secrets' "$EXT_PARTITION_MOUNTPOINT/$ARCH_HOME_PATH/travistest/chap-secrets"
}

reflectorInit() {
    REFLECTOR_CONF_URL="https://gitlab.archlinux.org/archlinux/archiso/-/raw/master/configs/releng/airootfs/etc/xdg/reflector/reflector.conf"

    arch-chroot "$EXT_PARTITION_MOUNTPOINT" pacman -Syu --noconfirm reflector
    curl -L "$REFLECTOR_CONF_URL" > "$EXT_PARTITION_MOUNTPOINT/etc/xdg/reflector/reflector.conf"

    arch-chroot "$EXT_PARTITION_MOUNTPOINT" systemctl enable reflector.timer
}

iptablesInit() {
    iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
    iptables -A INPUT -p tcp --dport 22 -j ACCEPT
    iptables -A INPUT -p udp --dport 22 -j ACCEPT
    iptables -A INPUT -p tcp --dport 51820 -j ACCEPT
    iptables -A INPUT -p udp --dport 51820 -j ACCEPT
    iptables -A INPUT -i wg0 -j ACCEPT
    iptables -P INPUT DROP

    iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
    iptables -A FORWARD -i wg0 -j ACCEPT
    iptables -P FORWARD DROP

    iptables -t nat -A PREROUTING -i wg0 -p tcp --dport 80 -j REDIRECT --to-ports 9040
    iptables -t nat -A PREROUTING -i wg0 -p udp --dport 80 -j REDIRECT --to-ports 9040
    iptables -t nat -A PREROUTING -i wg0 -p tcp --dport 443 -j REDIRECT --to-ports 9040
    iptables -t nat -A PREROUTING -i wg0 -p udp --dport 443 -j REDIRECT --to-ports 9040

    echo 'net.ipv4.ip_forward=1' > /etc/sysctl.d/30-ipforward.conf
}

ip6tablesInit() {
    echo 'net.ipv6.conf.default.forwarding=1' > /etc/sysctl.d/30-ipforward6.conf
    echo 'net.ipv6.conf.all.forwarding=1' >> /etc/sysctl.d/30-ipforward6.conf
}

full() {
    ROOT_PASSWORD="$1"
    PPP_PASSWORD="$2"

    init "$ROOT_PASSWORD"
    yayInit
    dockerInit
    travistestInit "$PPP_PASSWORD"
    reflectorInit
}

# Environment variables
EXT_PARTITION_MOUNTPOINT='/mnt'
ARCH_LOGIN='arch'
GITHUB_LOGIN='galeksandrp'

LARGEST_BLOCK_DEVICE="$(lsblk -n -o NAME -p -x SIZE | tail -1)"
EXT_PARTITION="${LARGEST_BLOCK_DEVICE}3"
SWAP_PARTITION="${LARGEST_BLOCK_DEVICE}2"
ARCH_HOME_PATH="home/$ARCH_LOGIN"
ID_RSA_PUB_URL="https://$GITHUB_LOGIN.github.io/id_rsa.pub"
TRAVISTEST_GIT_URL="https://github.com/$GITHUB_LOGIN/travistest.git"

# Execute arbitrary command, eg reboot
eval "$@"
