# Jeanserver HTPC Setup Documentation

## Overview

Jeanserver (Ubuntu 24.04.4 LTS, IP: 192.168.2.4) has been configured as a high-performance, dedicated Home Theater PC (HTPC) running Jellyfin Media Player in TV Mode, with full Xbox controller support.

## Key Configurations

### 1. Minimal Window Manager Session

To achieve the fastest possible startup and lowest resource overhead, the full desktop environment (GNOME) is bypassed.

- **Session Name:** `Jellyfin TV Mode` (`jellyfin-tv`)
- **Window Manager:** `xfwm4` (running as a daemon)
- **Session File:** `/usr/share/xsessions/jellyfin-tv.desktop`
- **Execution Script:** `/home/jean/jellyfin-session.sh`

### 2. Robust Startup Script (`~/jellyfin-session.sh`)

The custom session script includes an infinite loop to automatically restart Jellyfin if it crashes, preventing the server from locking up or dropping to an unusable black screen. A 2-second sleep prevents CPU spikes during rapid crash loops.

```bash
#!/bin/bash
# Minimal Window Manager
xfwm4 --daemon

# Start Jellyfin with a simple restart loop for robustness
while true; do
    flatpak run com.github.iwalton3.jellyfin-media-player --tv
    # Wait 2 seconds before retry to prevent CPU spikes if it fails
    sleep 2
done
```

### 3. Auto-Login

GDM3 is configured to automatically log in the user `jean` directly into the `jellyfin-tv` session.

- **Config File:** `/etc/gdm3/custom.conf` (`AutomaticLoginEnable=true`, `AutomaticLogin=jean`)
- **Default Session:** Set in `/var/lib/AccountsService/users/jean` (`Session=jellyfin-tv`)

### 4. Software Installed

- **Jellyfin Media Player v2.0:** Installed via **Flatpak** (Flathub) to bypass the Qt version limitations in Ubuntu 24.04.
- **Controller Support:** `joystick` and `jstest-gtk` packages installed natively to support Xbox controllers (via USB or Bluetooth/xpad/xpadneo).
- **Window Manager:** `xfce4` components (specifically `xfwm4` and `lxqt-core` components as fallbacks).

### 5. Dash / Tmux Fixes

- The `~/.bashrc` was updated to prevent the `dashboard` tmux session from auto-executing on SSH logins or disrupting the local console boot.
- The execution command was commented out and replaced with a safe `true` statement inside the local session detection `if` block. Manual aliases (`dash`, `dash-enter`) remain available.

## Recovery & Troubleshooting

- **Exiting TV Mode:** If Jellyfin crashes, it will restart in 2 seconds.
- **Disabling Auto-Login:** SSH into `192.168.2.4`, edit `/var/lib/AccountsService/users/jean` and change `Session=jellyfin-tv` back to `Session=gnome` or `Session=lxqt`.
- **Testing Controllers:** SSH into the server and run `jstest-gtk` (requires X11 forwarding) or `jstest /dev/input/js0`.
