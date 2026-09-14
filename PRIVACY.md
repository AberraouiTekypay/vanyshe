# Vanyshe Privacy Architecture & Transparency

## 1. Zero Conversation Retention

The architectural foundation of Vanyshe is data minimization:

> **If we do not need your conversation to provide the service, we do not retain it.**

### What Vanyshe NEVER collects or stores:
- Audio streams or audio packet recordings
- Video streams, camera frames, or screenshots
- Screen-sharing payloads
- Speech-to-text transcripts
- Persistent conversation history
- Participant phone numbers, email addresses, or contact lists

## 2. Ephemeral Signalling Data

To coordinate WebRTC handshakes between endpoints, our serverless API routes temporarily process:
- Session Description Protocol (SDP) offers and answers
- ICE candidate strings
- Participant join/leave state transitions

This data is held only in ephemeral memory for the duration of the connection setup. When the room creator ends the conversation, this state is wiped instantly.

## 3. First-Party Product Analytics ("Measure the Product, Never the Conversation")

Vanyshe utilizes a strictly separated, first-party telemetry system:
- **No Third-Party Trackers:** Zero Google Analytics, Meta Pixel, Hotjar, or FullStory trackers.
- **Anonymous Identifiers:** A random string `anon_...` generated client-side with no link to names or emails.
- **Opaque Room Hashes:** Analytics records only a one-way SHA-256 HMAC hash of the room ID, never plain room links or secret tokens.
- **Coarse Metrics Only:** Coarse country geolocation (e.g. Morocco, France) derived from edge headers, browser type, device category, and connection success percentages.
- **Strict Payload Filter:** The analytics intake API rejects any event containing forbidden fields such as `chat`, `message`, `text`, `audio`, `video`, `transcript`, `payload`, `password`, or `email`.
- **Retention:** Raw events are retained for up to 30 days for system debugging, after which they are rolled into aggregate counts (e.g., total rooms created).

## 4. Vanyshe Privacy Shield Disclosures

Vanyshe incorporates the **Vanyshe Privacy Shield** designed around four layers:
1. **Layer 1 — Vanyshe Does Not Record:** We provide zero server-side recording, zero transcription, and zero video archiving.
2. **Layer 2 — Supported Capture Detection:** Where platform APIs expose DOM keyboard events or screen-share requests, supported signals are monitored.
3. **Layer 3 — Transparent Non-Attributed Warnings:** Alerts notify participants of possible capture activity without revealing personal identity.
4. **Layer 4 — Configurable Room Policies:** Room creators can select `OFF`, `DETECT_ALERT` (Default), or `STRICT` (automatically pausing video feeds upon capture detection until acknowledged).

## 5. Realistic Boundaries

- Vanyshe does not make false marketing claims like "impossible to record" or "unhackable".
- Operating system process isolation prevents web applications from detecting background desktop recording applications (OBS Studio, QuickTime, Game Bar).
- Hardware-level capture devices (HDMI/DisplayPort capture cards) and external cameras operate outside the computer's software stack and cannot be detected.
- Native mobile operating systems (iOS Safari and Android Chrome) isolate hardware screenshot button events from web browsers.
- Users subject to formal industry or legal recordkeeping mandates must adhere to their regulatory requirements.
