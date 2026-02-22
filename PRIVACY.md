# Privacy Policy — Readster

**Last updated:** February 22, 2026

## Overview

Readster is a browser extension that saves and organizes a reading list locally in your browser. It is designed with privacy as a core principle — no data ever leaves your device.

## Data Storage

All data (saved pages, tags, theme preference) is stored using your browser's built-in `chrome.storage.local` API. This data lives entirely on your device, within your browser profile.

## Data Collection

Readster does **not** collect, transmit, or share any personal data. There are no analytics, tracking scripts, telemetry, or external APIs used to process your data.

## Network Requests

The only external network request Readster makes is loading website favicon images via Google's public favicon service (`https://www.google.com/s2/favicons`). No user data is sent in these requests — only the domain of the saved page, which is used solely to display the site's icon.

## Permissions

| Permission | Why it's needed |
|---|---|
| `storage` | Store your reading list, tags, and preferences locally. |
| `tabs` | Read the active tab's title and URL when you save a page. |
| `activeTab` | Access the current page when you click the extension icon. |
| `contextMenus` | Provide a right-click "Save to Readster" option. |

## Third Parties

Readster does not share data with any third party. There are no accounts, no cloud sync, and no server-side components.

## Changes

If this policy is updated, the changes will be reflected in this file with an updated date.

## Contact

For questions or concerns, please open an issue at [github.com/bhrigu123/readster](https://github.com/bhrigu123/readster/issues).
