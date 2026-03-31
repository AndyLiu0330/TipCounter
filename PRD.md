# Product Requirement Document: TipCalc Pro (Manual Edition)

## 1. Product Objective
**TipCalc Pro** is a high-speed, manual-entry utility designed for users who prefer precision and privacy over AI scanning. It allows users to manually input merchant names, bill amounts, and custom tip percentages to get instant splitting results without needing a camera or internet connection.

---

## 2. Core Features

### 2.1 Manual Data Entry
* **Merchant Tagging**: A dedicated text field at the top to enter the restaurant or shop name (e.g., "Starbucks" or "Friday Night Pizza").
* **Quick-Type Pad**: A large, responsive numeric keypad for entering the **Subtotal** and **Tax** amounts manually.
* **Default Focus**: Upon opening, the cursor automatically focuses on the "Bill Amount" field for immediate input.

### 2.2 Flexible Tipping Engine
* **Tipping Presets**: Quick-action buttons for 10%, 15%, 18%, and 20%.
* **Custom Percentage**: A slider or input box to enter any specific percentage (e.g., 12.5%).
* **Flat Tip Amount**: An option to enter a fixed dollar amount (e.g., "Just give a $10 tip") instead of a percentage.
* **The "Round Up" Feature**: A one-tap button that adjusts the tip amount so the **Grand Total** becomes a clean, whole number.

### 2.3 Advanced Bill Splitting
* **Guest Counter**: A simple `+` / `-` toggle to set the number of people.
* **Equal Split**: Real-time calculation of how much each individual owes.
* **Copy & Share**: Generates a text summary for group chats:
    > "Check at **[Merchant Name]**: Total is **$[X]**. Split between **[N]** people. Each owes **$[Z]**."

### 2.4 History & Archive
* **Local Storage**: Saves every calculation locally on the device.
* **Searchable Logs**: Users can search their history by Merchant Name or Date.

---

## 3. Mathematical Logic

The application calculates the final breakdown using the following formulas:

1.  **Tip Amount**:
    $$\text{Tip} = \text{Subtotal} \times \text{Custom Tip \%}$$
2.  **Grand Total**:
    $$\text{Grand Total} = \text{Subtotal} + \text{Tax} + \text{Tip}$$
3.  **Individual Share**:
    $$\text{Per Person} = \frac{\text{Grand Total}}{\text{Number of People}}$$

---

## 4. User Flow

1.  **Entry**: User opens the app and types the **Merchant Name** (optional) and **Subtotal**.
2.  **Selection**: User taps a **Tip %** button or types a **Custom %/$**.
3.  **Split**: User adjusts the **Number of People** if it's a group bill.
4.  **Review**: The "Total" and "Per Person" amounts update instantly as numbers are typed.
5.  **Action**: User taps **"Save"** to keep a record or **"Share"** to send the breakdown to friends.

---

## 5. Technical Requirements

* **Platform**: Mobile-first (iOS/Android).
* **Offline Mode**: 100% functional without an internet connection.
* **Storage**: Lightweight local database (SQLite or shared preferences).
* **UI/UX**: Minimalist design. The keyboard should never block the "Total Amount" display.

---

## 6. Comparison: Manual vs. Scan Mode

| Feature | AI Scan (Old) | Manual Entry (New) |
| :--- | :--- | :--- |
| **Speed** | Depends on AI processing | Instant |
| **Accuracy** | 95-98% (varies by light) | 100% (User-controlled) |
| **Privacy** | Uploads image to server | 100% On-device |
| **Flexibility** | Fixed extraction | Fully customizable % and names |