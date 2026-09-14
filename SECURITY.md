# Vanyshe Security Architecture & Verification

## Core Cryptographic Principles

Vanyshe adheres strictly to established internet standards:
- **No Proprietary Cryptography:** We utilize RFC-standard WebRTC security implementations provided natively by modern browsers.
- **DTLS-SRTP:** All browser-to-browser media streams (audio, video, and screen sharing) are negotiated via Datagram Transport Layer Security (DTLS 1.2/1.3) and encrypted with the Secure Real-time Transport Protocol (SRTP).
- **Endpoint Key Generation:** DTLS encryption keys are generated locally within the participant browsers. Vanyshe servers never generate, hold, or store media decryption keys.
- **Blind TURN Relays:** When firewalls force packets through a TURN relay, the relay forwards ciphertext blindly without decryption capabilities.

## Room Identifier Security

- Generated using system Cryptographically Secure Pseudo-Random Number Generators (CSPRNG via Node `crypto.randomBytes`).
- High entropy: 16-20 alphanumeric characters, segmented as `vny-xxxx-xxxx-xxxx`.
- Non-sequential and non-enumerable to prevent brute-force discovery or web crawler scraping.

## Ephemeral Destruction Guarantees

1. The room creator is issued a cryptographically random `creatorToken` stored only in their browser's `sessionStorage`.
2. When the creator triggers **End & Destroy Room**:
   - The token is verified server-side.
   - The room status is updated to `DESTROYED`.
   - All ephemeral signalling buffers and session tokens are immediately wiped.
   - All active WebRTC peer connections are terminated.
   - Any subsequent requests to `/r/[roomId]` receive HTTP 410 Gone.

## Infrastructure Hardening

- **HTTP Strict Transport Security (HSTS):** Enforced with `max-age=63072000; includeSubDomains; preload`.
- **Frame Ancestors Protection:** `X-Frame-Options: DENY` prevents clickjacking.
- **Content-Type Protection:** `X-Content-Type-Options: nosniff`.
- **Permissions-Policy:** Explicitly restrains browser features (`camera=(self), microphone=(self), display-capture=(self), geolocation=()`).

## Vanyshe Privacy Shield & Capture Detection Boundaries

### In-Transit vs Local Rendering Decryption
WebRTC DTLS-SRTP secures packet streams end-to-end across public network infrastructure. However, once media packets reach the destination device, the browser must decrypt the media frames locally to composite them onto the hardware display buffer.

### Operating System Sandboxing Limits
Because web applications operate within a sandboxed browser runtime:
- **Detectable Signals:** Hardware `PrintScreen` key events, shortcut sequences (`Win+Shift+S`, `Cmd+Shift+3/4/5`) correlated with focus loss, and in-page display capture calls.
- **Undetectable Channels:** Background OS-level recording applications (OBS, QuickTime, Game Bar), hardware capture cards (HDMI taps), physical external cameras, and mobile hardware button combinations.

### Defense-in-Depth Deterrence
- **Dynamic Shifting Watermarking:** Semi-transparent, shifting visual patterns containing room hash and timestamp embedded across video tiles, deterring unauthorized leakage through non-repudiation.
- **Strict Privacy Mode:** Automatically pauses media feeds across all participants upon supported capture detection until participants manually acknowledge the warning.

## Reporting Vulnerabilities

Security issues may be reported responsibly to `security@vanyshe.com`.
