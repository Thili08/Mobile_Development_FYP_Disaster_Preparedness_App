import Checklist from "./Checklist";

const hazeItems = [
  { id: '1', text: 'Stay indoors and keep windows closed.' },
  { id: '2', text: 'Use air purifiers if available.' },
  { id: '3', text: 'Limit outdoor activities, especially strenuous ones.' },
  { id: '4', text: 'Wear masks if going outside is necessary.' },
  { id: '5', text: 'Stay informed about air quality updates.' },
];

export default function HazeChecklist() {
  return (
    <Checklist
      title="Haze Preparedness Checklist"
      items={hazeItems}
      storageKey="hazeChecklist"
    />
  );
}