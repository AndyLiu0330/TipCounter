# Product Requirement Document: Manual TipCalc Pro

## 1. Product Objective
**Manual TipCalc Pro** is a privacy-centric utility designed for users who prioritize speed and absolute data control.  the app ensures that financial data never leaves the device. It provides an ultra-fast, "input-first" interface for manual bill entry, precision tipping, and group splitting.

---

## 2. Core Features (Manual-First)

### 2.1 High-Speed Manual Entry
* **Direct-to-Keypad**: Upon launch, the app focuses immediately on the "Subtotal" field with the numeric keypad active.
* **Merchant Labeling**: A manual text field to name the entry (e.g., "UCR Dining" or "K-BBQ Night") for history tracking.
* **Tactile Feedback**: Haptic vibrations on every keypress to confirm accurate input without needing to look constantly at the screen.

### 2.2 Precision Tipping & Customization
* **Custom Percentages**: A dedicated field for non-standard tips (e.g., 12.3% or 22%).
* **Flat-Rate Tipping**: A toggle to switch from percentage-based tipping to a specific dollar amount.
* **Smart Rounding**: A "Round Total" button that adjusts the tip dynamically so the final bill is a whole number (e.g., $45.67 \rightarrow$ $46.00).

### 2.3 Privacy-First Architecture
* **Zero Network Calls**: The application operates entirely offline. No data is sent to external servers.
* **No Image Logging**: Since no camera is used, there is zero risk of capturing sensitive data often found on receipts (e.g., partial credit card numbers or signatures).

### 2.4 Social Sharing (Local Generation)
* **Text Summary Export**: Generates a clean, shareable string locally:
    > **[Merchant Name]**
    > Subtotal: $[X]
    > Tip: $[Y]
    > **Total: $[Z]**
    > Each (of [N] people) owes: **$[Share]**

---

## 3. Mathematical Logic

The application uses standard arithmetic to ensure 100% precision, avoiding the common OCR errors found in AI-based scanners:

1.  **Calculated Tip**:
    $$\text{Tip} = \text{Subtotal} \times \left( \frac{\text{Tip \%}}{100} \right)$$
2.  **Final Grand Total**:
    $$\text{Grand Total} = \text{Subtotal} + \text{Tax} + \text{Tip}$$
3.  **The Per-Person Split**:
    $$\text{Share} = \frac{\text{Grand Total}}{\text{Number of People}}$$

---

## 4. Technical Requirements

* **Offline Storage**: Use **SQLite** or **Hive** for a local-only database to store historical entries.
* **Permissions**: **Zero permissions required.** The app will function without access to the Camera, Microphone, Location, or Internet.
* **Security**: No external API keys or `.env` files are required for AI providers, significantly reducing the application's attack surface.

---

## 5. User Flow

1.  **Launch**: App opens directly to the numeric input screen.
2.  **Input**: User enters the merchant name (optional), tax, and subtotal.
3.  **Adjust**: User taps a preset percentage (15%, 18%, 20%) or enters a custom value/flat rate.
4.  **Split**: User adjusts a slider or taps to set the number of people.
5.  **Save/Share**: User saves the entry to local history or copies the summary to the clipboard.

---

## 6. Comparison: Manual vs. AI

| Factor | AI Scanning | Manual TipCalc Pro |
| :--- | :--- | :--- |
| **Data Privacy** | Images processed in Cloud | **100% Local (On-Device)** |
| **Accuracy** | Subject to OCR/AI hallucination | **User-Validated Precision** |
| **Speed** | 3-5 seconds (Network latency) | **Instant (<1s)** |
| **Battery Life** | High (Camera + Data Upload) | **Negligible** |
| **Connectivity** | Requires 4G/5G or Wi-Fi | **Works 100% Offline** |