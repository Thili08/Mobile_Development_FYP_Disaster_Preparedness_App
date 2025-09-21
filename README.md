# PrepForDisasterApp

This is a user-centered React Native app to help Singapore residents prepare for disasters with real-time alerts, elements of gamification such as checklists, missions, and resource information such as shelters.

---

## Features

- **Live Weather & PSI:** See current weather and PSI levels for your current location.
- **Alerts:** Get real-time alerts for disasters and environmental hazards.
- **Checklists:** Access and track progress on flood and haze preparedness checklists.
- **Resource Hub:** Find public shelters and other useful resources.
- **Missions & Badges:** Complete quizzes and missions to earn badges.
- **Notifications:** Receive reminders and alerts for high PSI/rainfall.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/PrepForDisasterApp.git
   cd PrepForDisasterApp
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the app:**
   ```sh
   expo start
   ```

4. **Run on your device:**
   - Scan the QR code with the Expo Go app (iOS/Android).

---

## Project Structure

```
PrepForDisasterApp/
├── App.js
├── AlertsScreen.js
├── ResourceHub.js
├── FloodChecklist.js
├── HazeChecklist.js
├── Checklist.js
├── ChecklistScreen.js
├── Missions.js
├── Quiz.js
├── Badges.js
├── badgesData.js
├── alertsData.js
├── helperFunctions.js
├── index.js
├── styles.js
├── app.json
├── assets/
│   └── simulationPSI.json
│   └── simulationRainfall.json
│   └── disasterTips.json
└── ...
```

---

## Customization

- To use simulated data, toggle the switch in the Alerts screen.
- To add new checklists, create a new checklist file and add it to the stack.

---

## Credits

- Data sources: [data.gov.sg](https://data.gov.sg/)
- Icons: [Ionicons](https://ionic.io/ionicons)
- Weather: [OpenWeatherMap](https://openweathermap.org/)

---